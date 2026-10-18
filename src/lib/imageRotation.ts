/** Cover the complete rotated image; snap quarter-turn trig values to avoid extra pixels. */
export function rotatedImageBounds(width: number, height: number, angle: number) {
  if (![width, height, angle].every(Number.isFinite) || width <= 0 || height <= 0) throw new Error('Invalid image dimensions or angle.');
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const radians = normalizedAngle * Math.PI / 180;
  const snap = (value: number) => Math.abs(value) < 1e-12 ? 0 : Math.abs(value - 1) < 1e-12 ? 1 : value;
  const sin = snap(Math.abs(Math.sin(radians)));
  const cos = snap(Math.abs(Math.cos(radians)));
  return {width:Math.max(1,Math.ceil(width*cos + height*sin)),height:Math.max(1,Math.ceil(width*sin + height*cos)),angle:normalizedAngle};
}

export function rotationExportMime(sourceMime: string) {
  return sourceMime === 'image/jpeg' || sourceMime === 'image/webp' ? sourceMime : 'image/png';
}
