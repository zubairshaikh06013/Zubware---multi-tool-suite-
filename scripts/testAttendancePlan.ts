import assert from 'node:assert/strict';
import { planRemainingClasses } from '../src/lib/attendancePlan';

assert.deepEqual(planRemainingClasses(30, 40, 20, 75), { required: 15, reachable: true, canMiss: 5, maximum: 100 * 50 / 60 });
assert.deepEqual(planRemainingClasses(20, 40, 10, 75), { required: 18, reachable: false, canMiss: null, maximum: 60 });
assert.equal(planRemainingClasses(45, 50, 10, 75)?.canMiss, 10);
assert.equal(planRemainingClasses(0, 0, 0, 75), null);
for (const input of [[5, 4, 10, 75], [1, 4, -1, 75], [1, 4, 2.5, 75], [1, 4, 5, 100], [1, 4, 5, NaN]]) {
  assert.equal(planRemainingClasses(...input as [number, number, number, number]), null);
}
// Check minimality against exhaustive whole-class outcomes, including decimal targets.
for (let held = 0; held <= 30; held++) for (let attended = 0; attended <= held; attended++)
  for (const remaining of [0, 1, 7, 20]) for (const target of [50, 66.67, 75, 80, 90, 99.9]) {
    const actual = planRemainingClasses(attended, held, remaining, target);
    if (held + remaining === 0) { assert.equal(actual, null); continue; }
    const feasible = Array.from({ length: remaining + 1 }, (_, x) => x)
      .find(x => 100 * (attended + x) / (held + remaining) >= target);
    assert.equal(actual?.reachable, feasible !== undefined);
    if (feasible !== undefined) assert.equal(actual?.required, feasible);
  }
console.log('Attendance planner examples, invalid inputs and exhaustive minimal-class checks passed.');
