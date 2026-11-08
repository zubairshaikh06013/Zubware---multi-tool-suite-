export function signatureSizeIssue(bytes: number, minKb: number | null, maxKb: number | null) {
  if ((minKb !== null && (!Number.isFinite(minKb) || minKb <= 0)) ||
      (maxKb !== null && (!Number.isFinite(maxKb) || maxKb <= 0)) ||
      (minKb !== null && maxKb !== null && minKb > maxKb)) return 'invalid-range';
  if (minKb !== null && bytes < minKb * 1000) return 'below-minimum';
  if (maxKb !== null && bytes > maxKb * 1000) return 'above-maximum';
  return null;
}

/** Keep dimensions unchanged and choose the highest sampled JPEG quality under the cap. */
export async function encodeSignatureJpeg(encode: (quality: number) => Promise<Blob>, maxKb: number | null) {
  const full = await encode(1);
  if (maxKb === null || full.size <= maxKb * 1000) return full;
  let low = 0.05;
  let high = 1;
  let best = await encode(low);
  if (best.size > maxKb * 1000) return best; // The caller reports an unmet limit.
  for (let attempt = 0; attempt < 10; attempt++) {
    const quality = (low + high) / 2;
    const candidate = await encode(quality);
    if (candidate.size <= maxKb * 1000) { best = candidate; low = quality; }
    else high = quality;
  }
  return best;
}
