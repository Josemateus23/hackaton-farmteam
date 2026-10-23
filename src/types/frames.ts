export interface FrameItem {
  index: number;
  filename: string;
  url: string;
  sizeBytes: number;
}

export interface FramesManifest {
  totalFrames: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  zeroPadding: number;
  firstFrameIndex: number;
  lastFrameIndex: number;
  baseDir: string;
  publicUrlPrefix: string;
  frames: FrameItem[];
}

export interface NarrativeSchedule {
  text1: [number, number];       // [start, end] progress for first text
  text2: [number, number];       // [start, end] progress for second text
  sequence: [number, number];    // [start, end] progress for frame zoom (18% - 85%)
  leadToExit: [number, number];  // [start, end] progress for transition to next chapter
}

export interface NarrativeConfig {
  copy: {
    descriptor: string;
    text1: string;
    text2: string;
    scrollHint: string;
    skipLinkText: string;
    nextChapterTag: string;
    nextChapterTitle: string;
    nextChapterSubtitle: string;
    accessibilityAlt: string;
  };
  scroll: {
    desktopHeightVh: number;
    mobileHeightVh: number;
    schedule: NarrativeSchedule;
  };
  cache: {
    maxCacheSize: number;
    initialBatchSize: number;
    maxConcurrency: number;
    prefetchAhead: number;
    prefetchBehind: number;
  };
  canvas: {
    maxPixelRatio: number;
  };
}
