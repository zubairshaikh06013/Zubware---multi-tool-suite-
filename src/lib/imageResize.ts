export const MAX_RESIZE_EDGE = 16384;
export const MAX_RESIZE_PIXELS = 40000000;

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
