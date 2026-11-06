import { parseTargetBytes } from './fileSizeStandard';

/** A size-range check is not a verdict on an application's full requirements. */
export function compositeSizeRange(bytes: number, minKb: number, maxKb: number) {
  if (![minKb, maxKb].every(n => Number.isFinite(n) && n >= 0 && n <= 10000) ||
      (maxKb > 0 && minKb > maxKb)) return 'invalid' as const;
  if (!Number.isSafeInteger(bytes) || bytes <= 0) return 'pending' as const;
  if (minKb > 0 && bytes < parseTargetBytes(minKb, 'KB')) return 'below' as const;
  if (maxKb > 0 && bytes > parseTargetBytes(maxKb, 'KB')) return 'above' as const;
  return 'within' as const;
}
