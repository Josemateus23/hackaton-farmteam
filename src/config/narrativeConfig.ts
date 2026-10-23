import type { NarrativeConfig } from '../types/frames';

/**
 * Narrative & Animation Settings
 * All copy, scroll timeline marks, cache thresholds, and framing rules are centralized here.
 */
export const narrativeConfig: NarrativeConfig = {
  copy: {
    descriptor: 'Mulheres na tecnologia em Mato Grosso',
    text1: 'Você usa tecnologia todos os dias.',
    text2: 'Já imaginou criar a próxima?',
    scrollHint: 'Role para descobrir',
    skipLinkText: 'Pular abertura',
    nextChapterTag: 'Capítulo 01',
    nextChapterTitle: 'Em Mato Grosso, essa história já está sendo construída.',
    nextChapterSubtitle:
      'Da bancada escolar aos laboratórios de prototipagem, garotas e mulheres estão transformando curiosidade em circuitos reais.',
    accessibilityAlt:
      'Ilustração conceitual em estilo HQ editorial: uma adolescente de cabelos cacheados em uma bancada de eletrônica com ferramentas, cadernos e um circuito montado onde um LED azul brilha.',
  },

  scroll: {
    // Scroll track height in viewport height units
    desktopHeightVh: 320, // ~3.2 viewport heights
    mobileHeightVh: 230,  // ~2.3 viewport heights for a lighter touch on mobile

    // Timeline checkpoints (normalized progress 0.0 to 1.0)
    schedule: {
      // 0 - 18%: first text displays while scene stays on initial wide frame
      text1: [0.0, 0.20],
      // 18 - 30%: transition to second text; zoom starts; text fades out by 45%
      text2: [0.18, 0.45],
      // 18 - 85%: camera zooms progressively into circuit
      sequence: [0.18, 0.85],
      // 85 - 100%: last frame (macro of LED & circuit) holds, then section exits
      leadToExit: [0.85, 1.0],
    },
  },

  cache: {
    // Keep at most 30 decoded images in memory at once
    maxCacheSize: 30,
    // Pre-decode the first 8 frames immediately on mount
    initialBatchSize: 8,
    // Max simultaneous HTTP image fetches
    maxConcurrency: 4,
    // Frames to prefetch forward in current scroll direction
    prefetchAhead: 14,
    // Frames to keep cached behind current scroll position
    prefetchBehind: 8,
  },

  canvas: {
    // Cap pixel ratio to 1.5 to prevent GPU texture bloat while maintaining razor-sharp lines
    maxPixelRatio: 1.5,
  },
};
