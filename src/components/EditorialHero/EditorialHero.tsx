import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import manifestData from '../../data/framesManifest.json';
import type { FramesManifest } from '../../types/frames';
import { narrativeConfig } from '../../config/narrativeConfig';
import { FrameLoader } from '../../utils/frameLoader';
import { drawFrameToCanvas } from '../../utils/canvasFraming';
import styles from './EditorialHero.module.css';

gsap.registerPlugin(ScrollTrigger);

const manifest = manifestData as FramesManifest;

interface EditorialHeroProps {
  onSkip?: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onSkip }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<FrameLoader | null>(null);

  // Text refs for smooth direct transform/opacity updates without re-rendering JSX
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // State
  const [hasDrawnFirstFrame, setHasDrawnFirstFrame] = useState(false);
  const hasDrawnFirstFrameRef = useRef(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Animation & Rendering tracking refs
  const activeFrameIndexRef = useRef(0);
  const lastDrawnFrameIndexRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const currentProgressRef = useRef(0);
  const requestFrameRenderRef = useRef<() => void>(() => {});
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  // Check for mobile viewport
  const checkViewport = useCallback(() => {
    setIsMobile(window.innerWidth <= 900);
  }, []);

  // Handle Skip Opening click
  const handleSkip = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (onSkip) {
        onSkip();
        return;
      }
      const target = document.getElementById('proximo-capitulo');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'smooth' });
        window.history.pushState(null, '', '#proximo-capitulo');
      }
    },
    [onSkip]
  );

  // Decoupled frame render function using requestAnimationFrame
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const visual = visualRef.current;
    if (!canvas || !loader || !visual) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const targetIndex = activeFrameIndexRef.current;
    const candidate = loader.getClosestAvailableImage(targetIndex, lastDrawnFrameIndexRef.current);

    const cssWidth = visual.clientWidth;
    const cssHeight = visual.clientHeight;

    // If candidate frame is ready, draw it without ever clearing or flashing
    if (candidate && candidate.img.naturalWidth > 0) {
      ctx.save();
      drawFrameToCanvas(ctx, candidate.img, cssWidth, cssHeight, window.innerWidth <= 900, currentProgressRef.current);
      ctx.restore();

      lastDrawnFrameIndexRef.current = candidate.index;
      if (typeof window !== 'undefined') {
        (window as unknown as { __heroLastDrawnFrame?: number }).__heroLastDrawnFrame = candidate.index;
      }

      if (!hasDrawnFirstFrameRef.current) {
        hasDrawnFirstFrameRef.current = true;
        setHasDrawnFirstFrame(true);
      }
    }

    // If target frame is not yet the one drawn, subscribe to render once decoded
    if (candidate?.index !== targetIndex) {
      loader.onFrameReady(targetIndex, () => {
        requestFrameRenderRef.current();
      });
    }
  }, []);

  // Request a render on the next animation frame if one is not already queued
  const requestFrameRender = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      renderCanvas();
    });
  }, [renderCanvas]);

  requestFrameRenderRef.current = requestFrameRender;

  // Resize canvas to match container with pixel-ratio bounds
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const visual = visualRef.current;
    if (!canvas || !visual) return;

    const rect = visual.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, narrativeConfig.canvas.maxPixelRatio);

    const displayWidth = Math.floor(rect.width);
    const displayHeight = Math.floor(rect.height);

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    requestFrameRender();
  }, [requestFrameRender]);

  // Shared progress calculation function
  const applyProgress = useCallback(
    (progress: number, direction: 'down' | 'up' = 'down') => {
      const totalFrames = manifest.totalFrames;
      const schedule = narrativeConfig.scroll.schedule;
      const loader = loaderRef.current;

      currentProgressRef.current = progress;

      // --- Schedule: Sequence Zoom (18% - 85%) ---
      let targetIndex = 0;
      if (progress < schedule.sequence[0]) {
        targetIndex = 0;
      } else if (progress > schedule.sequence[1]) {
        targetIndex = totalFrames - 1;
      } else {
        const p = (progress - schedule.sequence[0]) / (schedule.sequence[1] - schedule.sequence[0]);
        targetIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.round(p * (totalFrames - 1)))
        );
      }

      if (loader) {
        loader.setPosition(targetIndex, direction);
      }

      if (typeof window !== 'undefined') {
        (window as unknown as { __heroTargetFrame?: number }).__heroTargetFrame = targetIndex;
      }

      if (targetIndex !== activeFrameIndexRef.current) {
        activeFrameIndexRef.current = targetIndex;
        requestFrameRender();
      }

      // --- Schedule: Text 1 ("Você usa tecnologia todos os dias.") ---
      // 0% -> 18%: fully visible.
      // 18% -> 30%: transitions out cleanly as text 2 transitions in.
      if (text1Ref.current) {
        let t1Opacity = 1;
        let t1Y = 0;
        if (progress <= 0.18) {
          t1Opacity = 1;
          t1Y = 0;
        } else if (progress < 0.28) {
          t1Opacity = 1 - (progress - 0.18) / 0.10;
          t1Y = -(1 - t1Opacity) * 14;
        } else {
          t1Opacity = 0;
          t1Y = -14;
        }
        text1Ref.current.style.opacity = t1Opacity.toFixed(3);
        text1Ref.current.style.setProperty('--y-offset', `${t1Y.toFixed(1)}px`);
        text1Ref.current.style.visibility = t1Opacity > 0 ? 'visible' : 'hidden';
      }

      // --- Schedule: Text 2 ("Já imaginou criar a próxima?") ---
      // 18% -> 30%: transitions in from 18% to 28%, holds at 100% until 32%.
      // 30% -> 45%: fades out cleanly, completely gone by 45%.
      if (text2Ref.current) {
        let t2Opacity = 0;
        let t2Y = 0;
        if (progress < 0.18) {
          t2Opacity = 0;
          t2Y = 14;
        } else if (progress < 0.28) {
          t2Opacity = (progress - 0.18) / 0.10;
          t2Y = (1 - t2Opacity) * 14;
        } else if (progress <= 0.32) {
          t2Opacity = 1;
          t2Y = 0;
        } else if (progress < 0.45) {
          t2Opacity = 1 - (progress - 0.32) / 0.13;
          t2Y = -(1 - t2Opacity) * 14;
        } else {
          t2Opacity = 0;
          t2Y = -14;
        }
        text2Ref.current.style.opacity = t2Opacity.toFixed(3);
        text2Ref.current.style.setProperty('--y-offset', `${t2Y.toFixed(1)}px`);
        text2Ref.current.style.visibility = t2Opacity > 0 ? 'visible' : 'hidden';
      }

      // --- Scroll Hint: Fades out as soon as user begins scrolling (0% -> 12%) ---
      if (scrollHintRef.current) {
        const hintOpacity = Math.max(0, 1 - progress / 0.12);
        scrollHintRef.current.style.opacity = hintOpacity.toFixed(2);
        scrollHintRef.current.style.visibility = hintOpacity > 0.02 ? 'visible' : 'hidden';
      }

      // --- Progress bar indicator ---
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }

      // --- Editorial Transition Veil (0.88 -> 1.0) ---
      // Veils the macro circuit into ivory paper before unpinning to second chapter
      if (transitionOverlayRef.current) {
        let exitOpacity = 0;
        if (progress > 0.88) {
          exitOpacity = Math.min(1, (progress - 0.88) / 0.11);
        }
        transitionOverlayRef.current.style.opacity = exitOpacity.toFixed(3);

        const blueTrace = transitionOverlayRef.current.querySelector('[data-blue-trace]') as HTMLElement | null;
        if (blueTrace) {
          const traceProgress = progress > 0.91 ? Math.min(1, (progress - 0.91) / 0.08) : 0;
          blueTrace.style.transform = `scaleY(${traceProgress.toFixed(3)})`;
          blueTrace.style.opacity = traceProgress > 0 ? '1' : '0';
        }
      }
    },
    [requestFrameRender]
  );

  // Initialize Motion / Reduced Motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Main lifecycle: Setup Loader, ScrollTrigger, Listeners
  useEffect(() => {
    checkViewport();
    window.addEventListener('resize', checkViewport);

    // If reduced motion is preferred, do not initialize sequence or ScrollTrigger
    if (isReducedMotion) {
      return () => {
        window.removeEventListener('resize', checkViewport);
      };
    }

    // 1. Initialize Loader
    const loader = new FrameLoader(manifest.frames);
    loaderRef.current = loader;

    // Check URL query param for deterministic preview/validation (e.g. ?progress=0.25)
    const urlParams = new URLSearchParams(window.location.search);
    const progressParam = urlParams.get('progress');
    const hasInitialParam = progressParam !== null;
    const initialProgress = hasInitialParam ? Math.max(0, Math.min(1, parseFloat(progressParam))) : 0;

    const schedule = narrativeConfig.scroll.schedule;
    const totalFrames = manifest.totalFrames;
    let initialTargetIndex = 0;
    if (initialProgress < schedule.sequence[0]) {
      initialTargetIndex = 0;
    } else if (initialProgress > schedule.sequence[1]) {
      initialTargetIndex = totalFrames - 1;
    } else {
      const p = (initialProgress - schedule.sequence[0]) / (schedule.sequence[1] - schedule.sequence[0]);
      initialTargetIndex = Math.min(totalFrames - 1, Math.max(0, Math.round(p * (totalFrames - 1))));
    }

    // Preload initial frames for instant start
    loader.preloadInitial().then(() => {
      renderCanvas();
    });

    if (hasInitialParam && initialTargetIndex > 0) {
      loader.loadFrame(initialTargetIndex, 100).then(() => {
        renderCanvas();
      });
    }

    // 2. Setup Canvas sizing
    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (visualRef.current) {
      resizeObserver.observe(visualRef.current);
    }

    // Apply initial progress
    applyProgress(initialProgress, 'down');

    // 3. Setup ScrollTrigger
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: true,
      scrub: 0.1, // Native smooth scrub
      onUpdate: (self) => {
        if (hasInitialParam && window.scrollY === 0) {
          applyProgress(initialProgress, 'down');
        } else {
          applyProgress(self.progress, self.direction > 0 ? 'down' : 'up');
        }
      },
    });

    if (typeof window !== 'undefined') {
      (window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
      (window as unknown as { gsap: typeof gsap }).gsap = gsap;
      (window as unknown as { __heroScrollTrigger: typeof scrollTrigger }).__heroScrollTrigger = scrollTrigger;
    }

    ScrollTrigger.refresh();

    // If a preview progress was requested in URL, update after layout
    if (hasInitialParam) {
      setTimeout(() => {
        applyProgress(initialProgress, 'down');
      }, 50);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkViewport);
      resizeObserver.disconnect();
      scrollTrigger.kill();
      if (typeof window !== 'undefined') {
        delete (window as unknown as { __heroScrollTrigger?: typeof scrollTrigger }).__heroScrollTrigger;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      loader.destroy();
      loaderRef.current = null;
    };
  }, [isReducedMotion, checkViewport, resizeCanvas, requestFrameRender, applyProgress]);

  // Reduced motion alternative representation
  if (isReducedMotion) {
    return (
      <section className={styles.reducedMotionContainer} aria-label={narrativeConfig.copy.descriptor}>
        <div className={styles.topBar} style={{ position: 'static', padding: '0 0 2rem 0' }}>
          <div className={styles.descriptorWrapper}>
            <span className={styles.accentDot} />
            <span className={styles.descriptor}>
              <span className={styles.descriptorLine}>Mulheres na tecnologia</span>
              <span className={styles.descriptorLine}>em Mato Grosso</span>
            </span>
          </div>
          <a href="#proximo-capitulo" className={styles.skipButton} onClick={handleSkip}>
            {narrativeConfig.copy.skipLinkText}
          </a>
        </div>

        <div className={styles.reducedMotionText}>
          <h1 className={styles.headlineText} style={{ position: 'static', transform: 'none' }}>
            {narrativeConfig.copy.text1}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '1.5rem',
              color: 'var(--color-blue)',
            }}
          >
            {narrativeConfig.copy.text2}
          </p>
        </div>

        <div className={styles.reducedMotionImageWrapper}>
          <img
            src={manifest.frames[0].url}
            alt={narrativeConfig.copy.accessibilityAlt}
            className={styles.reducedMotionImage}
          />
        </div>
      </section>
    );
  }

  const trackHeightVh = isMobile
    ? narrativeConfig.scroll.mobileHeightVh
    : narrativeConfig.scroll.desktopHeightVh;

  return (
    <section
      ref={trackRef}
      className={styles.heroTrack}
      style={{ ['--track-height' as string]: `${trackHeightVh}vh` }}
      aria-label="Abertura narrativa da história"
    >
      {/* Invisible narrative description for screen readers */}
      <div className="sr-only" aria-live="polite">
        {narrativeConfig.copy.accessibilityAlt}
      </div>

      <div ref={stageRef} className={styles.stickyStage}>
        {/* Top Editorial Bar */}
        <header className={styles.topBar}>
          <div className={styles.descriptorWrapper}>
            <span className={styles.accentDot} aria-hidden="true" />
            <span className={styles.descriptor}>
              <span className={styles.descriptorLine}>Mulheres na tecnologia</span>
              <span className={styles.descriptorLine}>em Mato Grosso</span>
            </span>
          </div>

          <a
            href="#proximo-capitulo"
            className={styles.skipButton}
            onClick={handleSkip}
            aria-label="Pular abertura para o conteúdo"
          >
            <span>{narrativeConfig.copy.skipLinkText}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </header>

        {/* Stage Content */}
        <div className={styles.stageContent}>
          {/* Visual Layer: Poster + Canvas */}
          <div ref={visualRef} className={styles.visualContainer}>
            {/* LCP Poster Image: Loads high-priority, replaced once canvas is drawn */}
            <img
              src={manifest.frames[0].url}
              alt=""
              role="presentation"
              fetchPriority="high"
              className={`${styles.posterImage} ${hasDrawnFirstFrame ? styles.posterHidden : ''}`}
            />

            <canvas
              ref={canvasRef}
              className={styles.heroCanvas}
              aria-hidden="true"
            />

            {/* Editorial Transition Veil between macro circuit and ivory chapter */}
            <div
              ref={transitionOverlayRef}
              className={styles.editorialTransitionOverlay}
              aria-hidden="true"
            >
              <div data-blue-trace className={styles.exitBlueTrace} />
            </div>
          </div>

          {/* Left Editorial Text Column (Desktop) / Top Area (Mobile) */}
          <div className={styles.textColumn}>
            <div className={styles.textCardWrapper}>
              {/* Text 1: 0% - 18% */}
              <h1
                ref={text1Ref}
                className={styles.headlineText}
                style={{ opacity: 1, visibility: 'visible' }}
              >
                Você usa <span className={styles.textHighlightRed}>tecnologia</span> todos os dias.
              </h1>

              {/* Text 2: 18% - 45% */}
              <h2
                ref={text2Ref}
                className={styles.headlineText}
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                Já imaginou criar a <span className={styles.textHighlightBlue}>próxima</span>?
              </h2>
            </div>
          </div>
        </div>

        {/* Discrete Scroll Guidance */}
        <div ref={scrollHintRef} className={styles.scrollGuidance} aria-hidden="true">
          <div className={styles.scrollIconLine} />
          <span className={styles.scrollText}>{narrativeConfig.copy.scrollHint}</span>
        </div>

        {/* Narrative Scroll Progress Bar */}
        <div ref={progressBarRef} className={styles.progressBar} aria-hidden="true" style={{ width: '0%' }} />
      </div>
    </section>
  );
};
