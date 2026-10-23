/**
 * motionConfig.ts
 * Centralized motion design parameters for the V2 cinematic narrative.
 * Controls scroll distances, scrub smoothing, and responsive thresholds.
 */

export const motionConfig = {
  // Scrub smoothing factor (in seconds) - between 0.35 and 0.6 for direct yet fluid response
  scrubSmoothing: 0.5,

  // Extra scroll distance (in vh) for pinned scenes on desktop
  desktopScroll: {
    // Capítulo 01: Território MT (percurso adicional 100–140vh)
    territorioExtraVh: 120,

    // Capítulo 02: Robô Otto (percurso adicional 160–200vh)
    ottoExtraVh: 180,

    // Capítulo 03: Meninas Digitais / Comunidade (percurso adicional 80–120vh)
    comunidadeExtraVh: 100,

    // Capítulo 04: Encerramento / Revelação tipográfica
    encerramentoExtraVh: 60,
  },

  // Responsive Breakpoints
  breakpoints: {
    desktopMin: 901,
    desktopWideMin: 1024,
    mobileMax: 900,
  },

  // Color tokens for GSAP transitions
  colors: {
    paper: '#F4E3CB',
    paperAlt: '#F2E8D5',
    ink: '#181818',
    red: '#D74735',
    blue: '#2465EC',
  },
};
