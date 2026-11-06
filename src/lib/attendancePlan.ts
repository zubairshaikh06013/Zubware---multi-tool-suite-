/** Equal-weight classes; institutional eligibility rules are outside this model. */
export function planRemainingClasses(attended: number, held: number, remaining: number, target: number) {
  if (![attended, held, remaining].every(n => Number.isSafeInteger(n) && n >= 0) || attended > held ||
      !Number.isFinite(target) || target <= 0 || target >= 100 || !Number.isSafeInteger(held + remaining)) return null;
  const finalTotal = held + remaining;
  if (finalTotal === 0) return null;
  const required = Math.max(0, Math.ceil(target / 100 * finalTotal - attended - 1e-10));
  const reachable = required <= remaining;
  return { required, reachable, canMiss: reachable ? remaining - required : null,
    maximum: 100 * (attended + remaining) / finalTotal };
}
