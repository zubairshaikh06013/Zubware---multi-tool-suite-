import { imageResizeDimensions } from './imageResize';

export function prepareDecorationCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const size = imageResizeDimensions(width, height, {mode:'percentage', width:1, height:1, percentage:100, preserveBatchAspect:false});
  canvas.width = size.width; canvas.height = size.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create an image canvas.');
  return context;
}

export function borderGeometry(width: number, height: number, requested: number, outer: boolean) {
  const border = Math.max(0, outer ? requested : Math.min(requested, width / 2, height / 2));
  return {border, width: width + (outer ? border * 2 : 0), height: height + (outer ? border * 2 : 0)};
}

/** Both strokes lie entirely inside the border band, separated by an equal-width gap. */
export function doubleBorderRects(width: number, height: number, border: number) {
  const lineWidth = border / 3;
  return [lineWidth / 2, border - lineWidth / 2].map(inset => ({x:inset, y:inset, width:width - 2*inset, height:height - 2*inset, lineWidth}));
}
