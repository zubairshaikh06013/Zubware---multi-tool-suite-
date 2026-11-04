export type SplitMethod = 'custom' | 'capital' | 'time' | 'equal' | 'slabs';
export interface Partner { id: string; name: string; working: boolean; capital: number; months: number; salary: number; bonus: number; weight: number; lossWeight: number; }
export interface ProfitSlab { from: number; weights: number[]; }
export interface PartnershipPlan { profit: number; months: number; interest: number; reserve: number; method: SplitMethod; separateLoss: boolean; partners: Partner[]; slabs: ProfitSlab[]; }
export interface Allocation extends Partner { salaryAmount: number; interestAmount: number; bonusAmount: number; ratio: number; residual: number; total: number; }
const total = (a: number[]) => a.reduce((s, n) => s + n, 0);
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
function distribute(amount: number, weights: number[]): number[] {
  const sum = total(weights);
  const cents = Math.round(amount * 100);
  const parts = weights.map(w => Math.trunc(cents * w / sum));
  let remainder = cents - total(parts);
  // Give rounding cents to the largest fractional remainders, never to a zero-weight partner.
  const order = weights.map((w, i) => ({ i, fraction: Math.abs(cents * w / sum - parts[i]) })).sort((a, b) => b.fraction - a.fraction);
  for (const { i } of order) { if (!remainder) break; parts[i] += Math.sign(remainder); remainder -= Math.sign(remainder); }
  return parts.map(n => n === 0 ? 0 : n / 100);
}
export function calculatePartnership(plan: PartnershipPlan) {
  const { partners, profit, months, interest, reserve, method, separateLoss, slabs } = plan;
  const errors: string[] = [];
  if (partners.length < 2 || partners.length > 10) errors.push('partners');
  if (!Number.isFinite(profit) || Math.abs(profit) > 1e12) errors.push('profit');
  if (!Number.isFinite(months) || months <= 0 || months > 120) errors.push('months');
  if (![interest, reserve].every(n => Number.isFinite(n) && n >= 0 && n <= 100)) errors.push('rates');
  if (partners.some(p => ![p.capital, p.months, p.salary, p.weight, p.lossWeight].every(n => Number.isFinite(n) && n >= 0 && n <= 1e12) || p.months > months || !Number.isFinite(p.bonus) || p.bonus < 0 || p.bonus > 100)) errors.push('partnerValues');
  if (total(partners.filter(p => p.working).map(p => p.bonus)) > 100) errors.push('bonus');
  if (method === 'slabs' && (!slabs.length || slabs[0].from !== 0 || slabs.some((s, i) => !Number.isFinite(s.from) || s.from < 0 || (i > 0 && s.from <= slabs[i - 1].from) || s.weights.length !== partners.length || s.weights.some(w => !Number.isFinite(w) || w < 0 || w > 1e12) || total(s.weights) <= 0))) errors.push('slabs');
  if (errors.length) return { errors, rows: [] as Allocation[], salary: 0, interestTotal: 0, bonus: 0, reserveAmount: 0, remainder: 0, allocated: 0, slab: -1 };
  const salaries = partners.map(p => p.working ? round(p.salary) : 0);
  const interests = partners.map(p => round(p.capital * interest / 100 * p.months / 12));
  const salary = round(total(salaries)), interestTotal = round(total(interests));
  const bonusBase = Math.max(0, round(profit - salary - interestTotal));
  const bonusWeights = partners.map(p => p.working ? p.bonus : 0);
  const bonusTarget = round(bonusBase * total(bonusWeights) / 100);
  const bonuses = total(bonusWeights) > 0 ? distribute(bonusTarget, bonusWeights) : partners.map(() => 0);
  const bonus = round(total(bonuses));
  const afterBonus = round(profit - salary - interestTotal - bonus);
  const reserveAmount = round(Math.max(0, afterBonus) * reserve / 100);
  const remainder = round(afterBonus - reserveAmount);
  const slab = method === 'slabs' ? slabs.reduce((selected, s, i) => profit >= s.from ? i : selected, 0) : -1;
  const weights = partners.map((p, i) => remainder < 0 && separateLoss ? p.lossWeight : method === 'equal' ? 1 : method === 'capital' ? p.capital : method === 'time' ? p.capital * p.months : method === 'slabs' ? slabs[slab].weights[i] : p.weight);
  if (total(weights) <= 0) errors.push('weights');
  if (errors.length) return { errors, rows: [] as Allocation[], salary, interestTotal, bonus, reserveAmount, remainder, allocated: 0, slab };
  const residuals = distribute(remainder, weights);
  const rows = partners.map((p, i) => ({ ...p, salaryAmount: salaries[i], interestAmount: interests[i], bonusAmount: bonuses[i], ratio: weights[i] / total(weights) * 100, residual: residuals[i], total: round(salaries[i] + interests[i] + bonuses[i] + residuals[i]) }));
  return { errors, rows, salary, interestTotal, bonus, reserveAmount, remainder, allocated: round(total(rows.map(p => p.total))), slab };
}
export function examplePlan(): PartnershipPlan {
  return { profit: 100000, months: 1, interest: 0, reserve: 10, method: 'custom', separateLoss: false, partners: [
    { id: 'operator', name: 'Working partner', working: true, capital: 200000, months: 1, salary: 25000, bonus: 0, weight: 20, lossWeight: 20 },
    { id: 'investor1', name: 'Investor 1', working: false, capital: 400000, months: 1, salary: 0, bonus: 0, weight: 40, lossWeight: 40 },
    { id: 'investor2', name: 'Investor 2', working: false, capital: 400000, months: 1, salary: 0, bonus: 0, weight: 40, lossWeight: 40 },
  ], slabs: [{ from: 0, weights: [4, 3, 3] }, { from: 100000, weights: [6, 2, 2] }, { from: 200000, weights: [8, 1, 1] }] };
}
