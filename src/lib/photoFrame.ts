/** Source crop for a cover-fit photo. Position is 0–100 across available crop travel. */
export function photoFrame(sourceWidth: number, sourceHeight: number, outputWidth: number, outputHeight: number, zoom = 1, positionX = 50, positionY = 50) {
  if (![sourceWidth, sourceHeight, outputWidth, outputHeight].every(n => Number.isFinite(n) && n > 0)) throw new Error('Photo dimensions must be positive.');
  const safeZoom = Number.isFinite(zoom) ? Math.max(1, Math.min(3, zoom)) : 1;
  const fraction = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) / 100 : 0.5;
  const scale = Math.max(outputWidth / sourceWidth, outputHeight / sourceHeight) * safeZoom;
  const width = outputWidth / scale;
  const height = outputHeight / scale;
  return { x: (sourceWidth - width) * fraction(positionX), y: (sourceHeight - height) * fraction(positionY), width, height };
}
