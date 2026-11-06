import assert from 'node:assert/strict';
import { compositeSizeRange } from '../src/lib/compositeSizeRange';

for (const [bytes, expected] of [[19999, 'below'], [20000, 'within'], [50000, 'within'], [50001, 'above']] as const)
  assert.equal(compositeSizeRange(bytes, 20, 50), expected);
assert.equal(compositeSizeRange(0, 20, 50), 'pending');
assert.equal(compositeSizeRange(1, 0, 0), 'within');
assert.equal(compositeSizeRange(50000, 50, 0), 'within');
assert.equal(compositeSizeRange(50000, 60, 50), 'invalid');
assert.equal(compositeSizeRange(50000, NaN, 50), 'invalid');
assert.equal(compositeSizeRange(50000, -1, 50), 'invalid');
assert.equal(compositeSizeRange(50000, 20, Infinity), 'invalid');
assert.equal(compositeSizeRange(1001, 1.001, 1.001), 'within');
console.log('Composite file-size range boundaries, optional limits and invalid ranges passed.');
