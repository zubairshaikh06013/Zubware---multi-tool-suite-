import assert from 'node:assert/strict';
import { calculatePartnership as calc, examplePlan } from '../src/lib/partnership';
const base = examplePlan();
const r = calc(base);
assert.deepEqual(r.rows.map(p => p.total), [38500, 27000, 27000]);
assert.equal(r.reserveAmount, 7500);
assert.equal(r.allocated + r.reserveAmount, base.profit);
const bonusPlan = { ...base, reserve: 0, partners: base.partners.map((p, i) => ({ ...p, bonus: i === 0 ? 10 : 0 })) };
const b = calc(bonusPlan);
assert.equal(b.bonus, 7500); // after salary, not on the original 100000
assert.deepEqual(b.rows.map(p => p.total), [46000, 27000, 27000]);
const loss = calc({ ...base, profit: -10000, separateLoss: true, partners: base.partners.map((p, i) => ({ ...p, lossWeight: i === 0 ? 0 : 1 })) });
assert.deepEqual(loss.rows.map(p => p.total), [25000, -17500, -17500]);
assert.equal(loss.bonus, 0); assert.equal(loss.reserveAmount, 0);
const time = calc({ ...base, profit: 1200, reserve: 0, months: 12, method: 'time', partners: base.partners.slice(0, 2).map((p, i) => ({ ...p, salary: 0, capital: 100, months: i === 0 ? 12 : 6 })) });
assert.deepEqual(time.rows.map(p => p.total), [800, 400]);
const interest = calc({ ...base, months: 12, interest: 12, partners: base.partners.map(p => ({ ...p, months: 6 })) });
assert.equal(interest.interestTotal, 60000);
assert.equal(interest.allocated + interest.reserveAmount, 100000);
for (const [profit, index] of [[99999.99, 0], [100000, 1], [199999.99, 1], [200000, 2]]) assert.equal(calc({ ...base, profit, method: 'slabs' }).slab, index);
assert(calc({ ...base, method: 'slabs', slabs: [{ from: 0, weights: [0, 0, 0] }] }).errors.includes('slabs'));
assert(calc({ ...base, partners: base.partners.map(p => ({ ...p, weight: 0 })) }).errors.includes('weights'));
assert(calc({ ...base, partners: base.partners.map(p => ({ ...p, months: 5 })) }).errors.includes('partnerValues'));
assert(calc({ ...base, partners: base.partners.map(p => ({ ...p, working: true, bonus: 40 })) }).errors.includes('bonus'));
assert(calc({ ...base, profit: NaN }).errors.includes('profit'));
assert(calc({ ...base, reserve: -5 }).errors.includes('rates'));
// Investor salary and bonus values must never leak into allocations after changing roles.
assert.equal(calc({ ...base, partners: base.partners.map(p => ({ ...p, working: false, salary: 123, bonus: 70 })) }).salary, 0);
for (const profit of [0, .01, -.01, 1, -100000, 999999.99]) {
  const x = calc({ ...base, profit, method: 'equal', reserve: 0, partners: base.partners.map(p => ({ ...p, salary: 0 })) });
  assert.equal(x.allocated, profit);
}
// Reconcile non-integer allocations, zero weights and mixed salary/bonus/interest.
for (let i = 1; i <= 100; i++) {
  const p = { ...base, profit: i * 1234.57, interest: 3.75, reserve: 7.13, partners: base.partners.map((p, j) => ({ ...p, working: true, weight: j === 0 ? 0 : j, bonus: 3.33 })) };
  const x = calc(p);
  assert.equal(Math.round((x.allocated + x.reserveAmount) * 100), Math.round(p.profit * 100));
  assert.equal(x.rows[0].residual, 0);
}
console.log('Partnership: example, salary, bonus, interest, losses, slabs, validation and 100 reconciliation scenarios passed.');
