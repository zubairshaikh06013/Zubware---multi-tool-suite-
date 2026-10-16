/** Uniform sampling: discard the incomplete modulo bucket before selecting an index. */
export function secureRandomIndex(size: number, draw = () => crypto.getRandomValues(new Uint32Array(1))[0]): number {
  if (!Number.isSafeInteger(size) || size < 1 || size > 0x100000000) throw new Error('Invalid random pool size');
  const limit = Math.floor(0x100000000 / size) * size;
  let value: number;
  do { value = draw(); } while (value >= limit);
  return value % size;
}

export function passwordPool(options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; avoidSimilar: boolean; exclude?: string }): string {
  const groups = [options.upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', options.lower && 'abcdefghijklmnopqrstuvwxyz', options.numbers && '0123456789', options.symbols && '!@#$%^&*()_+-=[]{}|;:,.<>?'];
  const excluded = new Set([...(options.exclude || ''), ...(options.avoidSimilar ? 'IOil01' : '')]);
  return [...new Set(groups.filter(Boolean).join(''))].filter(char => !excluded.has(char)).join('');
}

export function generateRandomPassword(length: number, pool: string): string {
  if (!pool || !Number.isSafeInteger(length) || length < 1 || length > 256) throw new Error('Choose a valid length and at least one available character');
  return Array.from({ length }, () => pool[secureRandomIndex(pool.length)]).join('');
}

export function randomPasswordEntropy(length: number, poolSize: number): number {
  return poolSize > 0 ? length * Math.log2(poolSize) : 0;
}
