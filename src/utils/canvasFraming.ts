/**
 * Utility for drawing frames to canvas with editorial comic framing.
 * Desktop: full-bleed cover anchored to the right so character & circuit stay visible
 * while texts sit cleanly on the left ivory negative space.
 * Mobile: preserves character and circuit focal points without aggressive cropping.
 */

export interface FramingRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export function computeFramingRect(
  canvasWidth: number,
  canvasHeight: number,
  isMobile: boolean,
  progress = 0,
  sourceWidth = 1920,
  sourceHeight = 1080
): FramingRect {
  const imgWidth = sourceWidth || 1920;
  const imgHeight = sourceHeight || 1080;

  if (isMobile) {
    // In mobile portrait: show the scene with focus on character + circuit
    // In frame 1, subject is centered around x ~ 1250 (65% of width).
    // As progress approaches 1 (macro zoom), focal point shifts to center (x ~ 960, 50%).
    const focalXRatio = 0.65 - progress * 0.15; // 0.65 -> 0.50

    // Full cover in the mobile visual viewport area
    const scale = Math.max(canvasHeight / imgHeight, canvasWidth / imgWidth);
    const dw = imgWidth * scale;
    const dh = imgHeight * scale;

    // Anchor X based on focal point, clamping so frame doesn't pull empty space
    const idealDx = canvasWidth * 0.5 - dw * focalXRatio;
    const minDx = canvasWidth - dw;
    const maxDx = 0;
    const dx = Math.max(minDx, Math.min(maxDx, idealDx));

    // Center Y
    const dy = (canvasHeight - dh) * 0.5;

    return { dx, dy, dw, dh };
  }

  // Desktop / Tablet Landscape: Full Bleed Cover
  const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
  const dw = imgWidth * scale;
  const dh = imgHeight * scale;

  // Anchor to the right (where character & workbench are)
  // Interpolate slightly toward center as zoom approaches macro LED at circuit center
  const alignRightWeight = 1.0 - progress * 0.45; // 1.0 down to 0.55
  const dx = (canvasWidth - dw) * alignRightWeight;
  const dy = (canvasHeight - dh) * 0.5;

  return { dx, dy, dw, dh };
}

export function drawFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  isMobile: boolean,
  progress = 0
) {
  // 1. Fill background with paper ivory
  ctx.fillStyle = '#F4E3CB';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Compute framing bounds with actual natural image dimensions
  const { dx, dy, dw, dh } = computeFramingRect(
    canvasWidth,
    canvasHeight,
    isMobile,
    progress,
    img.naturalWidth || 1920,
    img.naturalHeight || 1080
  );

  // 3. Draw image cleanly
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, dw, dh);
}
