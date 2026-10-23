import type { FrameItem } from '../types/frames';
import { narrativeConfig } from '../config/narrativeConfig';

interface LoadTask {
  index: number;
  priority: number;
  resolve: (img: HTMLImageElement) => void;
  reject: (err: unknown) => void;
}

/**
 * Memory-efficient, windowed, direction-aware frame loader.
 * Guarantees limited concurrency, LRU eviction of distant frames,
 * and zero blank canvas states.
 */
export class FrameLoader {
  private frames: FrameItem[];
  private cache: Map<number, HTMLImageElement> = new Map();
  private inFlight: Set<number> = new Set();
  private queue: LoadTask[] = [];
  private activeConcurrency = 0;
  private maxConcurrency: number;
  private maxCacheSize: number;
  private prefetchAhead: number;
  private prefetchBehind: number;
  private currentIndex = 0;
  private scrollDirection: 'down' | 'up' = 'down';
  private listeners: Map<number, Set<() => void>> = new Map();
  private isDestroyed = false;
  private isMobile: boolean;

  constructor(frames: FrameItem[], isMobile = false) {
    this.frames = frames;
    this.isMobile = isMobile;
    this.maxConcurrency = narrativeConfig.cache.maxConcurrency;
    this.maxCacheSize = narrativeConfig.cache.maxCacheSize;
    this.prefetchAhead = narrativeConfig.cache.prefetchAhead;
    this.prefetchBehind = narrativeConfig.cache.prefetchBehind;
  }

  public setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  /**
   * Returns the cached image for the given frame index if available.
   * If not ready, schedules loading with immediate priority and triggers prefetch.
   */
  public getImage(index: number): HTMLImageElement | null {
    if (this.isDestroyed || index < 0 || index >= this.frames.length) {
      return null;
    }

    const cached = this.cache.get(index);
    if (cached) {
      return cached;
    }

    // Schedule immediate fetch
    this.scheduleLoad(index, 100);
    return null;
  }

  /**
   * Check if a frame is already decoded and cached.
   */
  public hasImage(index: number): boolean {
    return this.cache.has(index);
  }

  /**
   * Find the closest loaded frame between lastDrawnIndex and targetIndex in the scroll direction.
   */
  public getClosestAvailableImage(
    targetIndex: number,
    lastDrawnIndex: number | null
  ): { index: number; img: HTMLImageElement } | null {
    if (this.isDestroyed || this.cache.size === 0) return null;

    // Check exact target first
    const exact = this.cache.get(targetIndex);
    if (exact && exact.naturalWidth > 0) {
      return { index: targetIndex, img: exact };
    }

    // Schedule target frame loading if not in flight
    this.scheduleLoad(targetIndex, 100);

    if (lastDrawnIndex === null) {
      const frame0 = this.cache.get(0);
      if (frame0 && frame0.naturalWidth > 0) return { index: 0, img: frame0 };
      return null;
    }

    if (targetIndex > lastDrawnIndex) {
      // Scrolling down: pick closest available frame progressing toward target
      for (let idx = targetIndex; idx > lastDrawnIndex; idx--) {
        const candidate = this.cache.get(idx);
        if (candidate && candidate.naturalWidth > 0) {
          return { index: idx, img: candidate };
        }
      }
    } else if (targetIndex < lastDrawnIndex) {
      // Scrolling up: pick closest available frame progressing backward toward target
      for (let idx = targetIndex; idx < lastDrawnIndex; idx++) {
        const candidate = this.cache.get(idx);
        if (candidate && candidate.naturalWidth > 0) {
          return { index: idx, img: candidate };
        }
      }
    }

    return null;
  }

  /**
   * Updates current scroll position and direction, scheduling prefetching
   * and evicting distant frames from memory.
   */
  public setPosition(index: number, direction: 'down' | 'up' = 'down') {
    if (this.isDestroyed) return;

    this.currentIndex = Math.max(0, Math.min(index, this.frames.length - 1));
    this.scrollDirection = direction;

    this.runPrefetch();
    this.evictDistantFrames();
  }

  /**
   * Preload initial burst of frames (e.g., frames 0..7) on startup.
   */
  public preloadInitial(count = narrativeConfig.cache.initialBatchSize): Promise<void[]> {
    const promises: Promise<HTMLImageElement>[] = [];
    const limit = Math.min(count, this.frames.length);

    for (let i = 0; i < limit; i++) {
      promises.push(this.loadFrame(i, 50 - i));
    }

    return Promise.allSettled(promises).then(() => []);
  }

  /**
   * Subscribe to notification when a specific frame becomes ready.
   */
  public onFrameReady(index: number, callback: () => void): () => void {
    if (this.cache.has(index)) {
      callback();
      return () => {};
    }

    if (!this.listeners.has(index)) {
      this.listeners.set(index, new Set());
    }
    const set = this.listeners.get(index)!;
    set.add(callback);

    return () => {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(index);
      }
    };
  }

  private runPrefetch() {
    const ahead = this.scrollDirection === 'down' ? this.prefetchAhead : this.prefetchBehind;
    const behind = this.scrollDirection === 'down' ? this.prefetchBehind : this.prefetchAhead;

    // Prefetch ahead with high priority
    for (let step = 1; step <= ahead; step++) {
      const idx = this.scrollDirection === 'down' ? this.currentIndex + step : this.currentIndex - step;
      if (idx >= 0 && idx < this.frames.length && !this.cache.has(idx) && !this.inFlight.has(idx)) {
        this.scheduleLoad(idx, 80 - step);
      }
    }

    // Prefetch behind with lower priority
    for (let step = 1; step <= behind; step++) {
      const idx = this.scrollDirection === 'down' ? this.currentIndex - step : this.currentIndex + step;
      if (idx >= 0 && idx < this.frames.length && !this.cache.has(idx) && !this.inFlight.has(idx)) {
        this.scheduleLoad(idx, 40 - step);
      }
    }
  }

  private scheduleLoad(index: number, priority: number) {
    if (this.cache.has(index) || this.inFlight.has(index)) {
      return;
    }

    // Check if task already exists in queue; update priority if higher
    const existing = this.queue.find((t) => t.index === index);
    if (existing) {
      if (priority > existing.priority) {
        existing.priority = priority;
        this.sortQueue();
      }
      return;
    }

    this.queue.push({
      index,
      priority,
      resolve: () => {},
      reject: () => {},
    });

    this.sortQueue();
    this.processQueue();
  }

  public loadFrame(index: number, priority = 100): Promise<HTMLImageElement> {
    const cached = this.cache.get(index);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
      const existing = this.queue.find((t) => t.index === index);
      if (existing) {
        const prevResolve = existing.resolve;
        existing.resolve = (img) => {
          prevResolve(img);
          resolve(img);
        };
        if (priority > existing.priority) {
          existing.priority = priority;
          this.sortQueue();
        }
        return;
      }

      this.queue.push({
        index,
        priority,
        resolve,
        reject,
      });

      this.sortQueue();
      this.processQueue();
    });
  }

  private sortQueue() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private processQueue() {
    if (this.isDestroyed || this.activeConcurrency >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    if (this.cache.has(task.index)) {
      task.resolve(this.cache.get(task.index)!);
      this.processQueue();
      return;
    }

    this.activeConcurrency++;
    this.inFlight.add(task.index);

    const frameItem = this.frames[task.index];
    if (!frameItem) {
      this.activeConcurrency--;
      this.inFlight.delete(task.index);
      this.processQueue();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    const finalize = () => {
      this.activeConcurrency--;
      this.inFlight.delete(task.index);
      if (!this.isDestroyed) {
        this.processQueue();
      }
    };

    img.onload = () => {
      if (this.isDestroyed) {
        finalize();
        return;
      }
      this.handleImageLoaded(task.index, img, task);
      finalize();
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    };

    const targetUrl = (this.isMobile && frameItem.mobileUrl) ? frameItem.mobileUrl : frameItem.url;
    let didFallback = false;

    img.onerror = (err) => {
      if (!didFallback && targetUrl !== frameItem.url) {
        didFallback = true;
        img.src = frameItem.url;
        return;
      }
      task.reject(err);
      finalize();
    };

    img.src = targetUrl;
  }

  private handleImageLoaded(index: number, img: HTMLImageElement, task: LoadTask) {
    if (this.isDestroyed) return;

    this.cache.set(index, img);
    task.resolve(img);

    // Notify any waiting listeners for this frame
    const set = this.listeners.get(index);
    if (set) {
      set.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          console.error('Frame listener error:', e);
        }
      });
      this.listeners.delete(index);
    }

    this.evictDistantFrames();
  }

  /**
   * Keeps cache bounded: evicts frames furthest from the current index.
   * Clears image src on eviction to release decoded bitmaps from GPU/VRAM.
   */
  private evictDistantFrames() {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }

    // Never evict frame 0 (fallback poster frame)
    const candidates: { index: number; distance: number }[] = [];

    for (const cachedIndex of this.cache.keys()) {
      if (cachedIndex === 0 || cachedIndex === this.currentIndex) continue;

      let distance = Math.abs(cachedIndex - this.currentIndex);
      // Give eviction penalty to frames behind current scroll direction
      if (
        (this.scrollDirection === 'down' && cachedIndex < this.currentIndex) ||
        (this.scrollDirection === 'up' && cachedIndex > this.currentIndex)
      ) {
        distance += 10;
      }

      candidates.push({ index: cachedIndex, distance });
    }

    // Sort by largest distance first
    candidates.sort((a, b) => b.distance - a.distance);

    const toRemoveCount = this.cache.size - this.maxCacheSize;
    for (let i = 0; i < toRemoveCount && i < candidates.length; i++) {
      const idxToRemove = candidates[i].index;
      const img = this.cache.get(idxToRemove);
      if (img) {
        // Detach source to reclaim memory in Chromium/WebKit
        img.src = '';
      }
      this.cache.delete(idxToRemove);
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.queue = [];
    this.listeners.clear();

    for (const img of this.cache.values()) {
      img.src = '';
    }
    this.cache.clear();
    this.inFlight.clear();
  }
}
