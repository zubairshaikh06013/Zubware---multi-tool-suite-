import { compositeSizeRange } from './compositeSizeRange';

export const MAX_RESIZE_EDGE = 16384;
export const MAX_RESIZE_PIXELS = 40000000;

/** Keep the canvas dimensions and selected quality ceiling; check the floor too. */
export async function encodeResizeToLimit(encode: (quality: number) => Promise<Blob>, quality: number, maxBytes: number) {
  const initial = await encode(quality);
  if (initial.size <= maxBytes) return initial;
  let low = Math.min(0.05, quality);
  let high = quality;
  let best = await encode(low);
  if (best.size > maxBytes) return best; // The caller reports an unmet limit.
  for (let attempt = 0; attempt < 10; attempt++) {
    const midpoint = (low + high) / 2;
    const candidate = await encode(midpoint);
    if (candidate.size <= maxBytes) { best = candidate; low = midpoint; }
    else high = midpoint;
  }
  return best;
}

export function imageResizeDimensions(originalWidth: number, originalHeight: number, options: {
  mode: 'dimensions' | 'percentage' | 'preset'; width: number; height: number; percentage: number; preserveBatchAspect: boolean;
}) {
  let width = options.width;
  let height = options.height;
  if (options.mode === 'percentage') {
    width = originalWidth * options.percentage / 100;
    height = originalHeight * options.percentage / 100;
  } else if (options.mode === 'dimensions' && options.preserveBatchAspect) {
    height = originalHeight * options.width / originalWidth;
  }
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new Error('Enter valid positive image dimensions.');
  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));
  if (width > MAX_RESIZE_EDGE || height > MAX_RESIZE_EDGE || width * height > MAX_RESIZE_PIXELS) throw new Error('Choose an output up to 16,384 px per side and 40 megapixels. Try a smaller size or percentage.');
  return {width, height};
}

/** Validate the encoded bytes; never pad the image to satisfy a form minimum. */
export function imageResizeSizeError(bytes: number, minKb: number, maxKb: number): string | undefined {
  const status = compositeSizeRange(bytes, minKb, maxKb);
  if (status === 'invalid') return 'Minimum KB must not exceed maximum KB. Enter valid file-size limits.';
  if (status === 'below') return `Output is ${bytes.toLocaleString('en-US')} bytes, below ${minKb} KB. Increase JPEG/WebP quality or use a clearer original. Keep the dimensions your form requires; no filler bytes are added.`;
  if (status === 'above') return `Output exceeds ${maxKb} KB. Select JPEG/WebP or reduce dimensions only if your form permits it.`;
  if (status === 'pending') return 'No valid output file was created. Try the original image again.';
}
