import assert from 'node:assert/strict';
import { signatureSizeIssue, encodeSignatureJpeg } from '../src/lib/signatureFileSize';

assert.equal(signatureSizeIssue(9999, 10, 20), 'below-minimum');
assert.equal(signatureSizeIssue(10000, 10, 20), null);
assert.equal(signatureSizeIssue(20000, 10, 20), null);
assert.equal(signatureSizeIssue(20001, 10, 20), 'above-maximum');
assert.equal(signatureSizeIssue(15000, 20, 10), 'invalid-range');
assert.equal(signatureSizeIssue(500, null, 20), null);
assert.equal(signatureSizeIssue(50000, null, null), null);
assert.equal(signatureSizeIssue(15000, Number.NaN, 20), 'invalid-range');

// A coarse quality decrement could jump from >20 KB to <10 KB. Search the gap.
const result = await encodeSignatureJpeg(async quality => new Blob([new Uint8Array(Math.round(1000 + 40000 * quality))], { type: 'image/jpeg' }), 20);
assert.equal(signatureSizeIssue(result.size, 10, 20), null);
assert.ok(result.size > 19900, 'keep quality near the cap instead of over-compressing');
const impossible = await encodeSignatureJpeg(async () => new Blob([new Uint8Array(21000)]), 20);
assert.equal(signatureSizeIssue(impossible.size, 10, 20), 'above-maximum');
const tooSmall = await encodeSignatureJpeg(async () => new Blob([new Uint8Array(5000)]), 20);
assert.equal(signatureSizeIssue(tooSmall.size, 10, 20), 'below-minimum');
console.log('Signature KB boundaries, invalid ranges and JPEG search passed.');
