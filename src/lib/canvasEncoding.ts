/** Browsers may silently return PNG when an export codec is unsupported. */
export function encodeCanvasBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) reject(new Error('Image encoding failed. Try smaller dimensions.'));
        else if (blob.type !== mime) reject(new Error(`This browser cannot export ${mime.replace('image/', '').toUpperCase()}. Choose PNG or JPEG.`));
        else resolve(blob);
      }, mime, quality);
    } catch (error) { reject(error); }
  });
}
