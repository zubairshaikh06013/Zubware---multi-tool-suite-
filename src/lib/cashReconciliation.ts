/** Compare a whole-rupee denomination count with a decimal INR book balance. */
export function reconcileCash(countedRupees: number, expectedInput: string) {
  const text = expectedInput.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text) || !Number.isSafeInteger(countedRupees) || countedRupees < 0 || countedRupees > 999999999) return null;
  const [whole, fraction = ''] = text.split('.');
  const expectedPaise = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(expectedPaise) || expectedPaise > 99999999900) return null;
  const differencePaise = countedRupees * 100 - expectedPaise;
  return { expectedPaise, differencePaise,
    status: differencePaise === 0 ? 'matched' as const : differencePaise > 0 ? 'over' as const : 'short' as const };
}
