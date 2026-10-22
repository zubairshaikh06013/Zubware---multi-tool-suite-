/** Fit the whole signature without stretching or clipping its ink. */
export function signatureFit(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  if (![sourceWidth, sourceHeight, width, height].every(n => Number.isFinite(n) && n > 0)) throw new Error('Invalid signature dimensions.');
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale, drawHeight = sourceHeight * scale;
  return { x: (width - drawWidth) / 2, y: (height - drawHeight) / 2, width: drawWidth, height: drawHeight };
}

/** Optional near-white paper cleanup; do not alter alpha or darker/coloured ink. */
export function whitenSignaturePaper(pixels: Uint8ClampedArray, threshold: number): void {
  const cutoff = Number.isFinite(threshold) ? Math.max(180, Math.min(250, threshold)) : 235;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > 0 && Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) >= cutoff) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
    }
  }
}
