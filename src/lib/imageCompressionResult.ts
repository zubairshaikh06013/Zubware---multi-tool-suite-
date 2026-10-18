/** Keep the smallest compatible file that meets a maximum-size request. */
export function chooseWithinTargetBlob(original: Blob, encoded: Blob | null, mimeType: string, targetBytes: number): Blob | null {
  const source = original.type === mimeType && original.size <= targetBytes ? original : null;
  const result = encoded?.type === mimeType && encoded.size <= targetBytes ? encoded : null;
  return source && (!result || source.size <= result.size) ? source : result;
}

export function compressionChangeLabel(originalSize: number, resultSize: number): string {
  const percent = Math.round(Math.abs(originalSize - resultSize) / originalSize * 100);
  if (originalSize === resultSize) return 'size unchanged';
  return resultSize < originalSize ? `${percent}% reduction` : `${percent}% larger`;
}
