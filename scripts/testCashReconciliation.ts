import assert from 'node:assert/strict';
import { reconcileCash } from '../src/lib/cashReconciliation';

assert.deepEqual(reconcileCash(12750, '12800'), { expectedPaise: 1280000, differencePaise: -5000, status: 'short' });
assert.deepEqual(reconcileCash(12850, '12800'), { expectedPaise: 1280000, differencePaise: 5000, status: 'over' });
assert.equal(reconcileCash(12800, '12800.00')?.status, 'matched');
assert.equal(reconcileCash(100, '100.01')?.differencePaise, -1);
assert.equal(reconcileCash(0, '0')?.status, 'matched');
assert.equal(reconcileCash(999999999, '999999999')?.differencePaise, 0);
for (const input of ['', '-1', '1e3', '1,000', '1.001', 'Infinity', '999999999.01', 'NaN']) {
  assert.equal(reconcileCash(100, input), null, input);
}
for (const actual of [-1, 1.5, Infinity, 1000000000]) assert.equal(reconcileCash(actual, '100'), null);
for (let amount = 0; amount < 100; amount++) for (let paise = 0; paise < 100; paise++) {
  const expected = `${amount}.${String(paise).padStart(2, '0')}`;
  const result = reconcileCash(amount, expected)!;
  assert.equal(result.differencePaise, paise === 0 ? 0 : -paise);
  assert.equal(result.status, paise === 0 ? 'matched' : 'short');
}
console.log('Cash reconciliation shortage, excess, match, paise precision and invalid-input tests passed.');
