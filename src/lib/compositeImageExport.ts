export function dataUrlBytes(url: string): number {
  const payload = url.slice(url.indexOf(',') + 1);
  return payload.length * 3 / 4 - (payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0);
}

/** Search JPEG quality without changing the required canvas dimensions. */
export function exportCompositeImage(
  canvas: Pick<HTMLCanvasElement, 'toDataURL'>,
  format: 'jpeg' | 'png',
  maxBytes = 0,
): { url: string; bytes: number; withinLimit: boolean } {
  const encode = (quality: number) => {
    const url = canvas.toDataURL(`image/${format}`, quality);
    if (!url.startsWith(`data:image/${format};base64,`)) throw new Error('Image export failed. Try smaller dimensions.');
    return { url, bytes: dataUrlBytes(url) };
  };
  let result = encode(0.95);
  if (maxBytes > 0 && result.bytes > maxBytes && format === 'jpeg') {
    let low = 0.35;
    let high = 0.95;
    result = encode(low);
    if (result.bytes <= maxBytes) {
      for (let step = 0; step < 8; step++) {
        const mid = (low + high) / 2;
        const candidate = encode(mid);
        if (candidate.bytes <= maxBytes) { result = candidate; low = mid; }
        else high = mid;
      }
    }
  }
  return { ...result, withinLimit: maxBytes <= 0 || result.bytes <= maxBytes };
}
