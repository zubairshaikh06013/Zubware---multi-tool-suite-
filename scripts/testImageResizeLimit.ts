import assert from 'node:assert/strict';
import { encodeResizeToLimit } from '../src/lib/imageResize';

const blob = (bytes: number) => new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });
// A feasible result at the exact floor was never sampled by the old search.
const floorOnly = await encodeResizeToLimit(async q => blob(q <= 0.05 ? 20000 : 21000), 0.9, 20000);
assert.equal(floorOnly.size, 20000);
const samples: number[] = [];
const nearCap = await encodeResizeToLimit(async q => { samples.push(q); return blob(Math.round(1000 + q * 40000)); }, 0.8, 20000);
assert.ok(nearCap.size <= 20000 && nearCap.size > 19900, 'Retain quality near the cap');
assert.ok(samples.every(q => q <= 0.8), 'Respect the user-selected quality ceiling');
let count = 0;
const alreadyFits = await encodeResizeToLimit(async () => { count++; return blob(12000); }, 0.8, 20000);
assert.equal(alreadyFits.size, 12000);
assert.equal(count, 1, 'Do not re-encode a result that already fits');
const impossible = await encodeResizeToLimit(async () => blob(21000), 0.9, 20000);
assert.ok(impossible.size > 20000, 'Return the unmet limit for the existing download guard');
await assert.rejects(encodeResizeToLimit(async () => { throw new Error('encoding failed'); }, 0.9, 20000), /encoding failed/);
console.log('Image resizing checks the quality floor, preserves the quality ceiling, and reports impossible limits.');
