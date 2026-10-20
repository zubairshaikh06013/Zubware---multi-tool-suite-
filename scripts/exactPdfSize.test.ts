import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { matchPdfByteLength } from '../src/lib/exactPdfSize';
import { reducePdfSize } from '../src/lib/pdfSizeAdjuster';

for (const useObjectStreams of [true, false]) {
  test(`exact bytes and readable pages, object streams=${useObjectStreams}`, async () => {
    const doc = await PDFDocument.create();
    doc.addPage([300, 400]).drawText('Exact PDF target regression');
    const bytes = await doc.save({ useObjectStreams });
    for (const gap of [0, 1, 2, 79, 80, 1025, 300000 - bytes.length]) {
      const padded = matchPdfByteLength(bytes, bytes.length + gap);
      assert.equal(padded.length, bytes.length + gap);
      const parsed = await PDFDocument.load(padded);
      assert.equal(parsed.getPageCount(), 1);
      assert.deepEqual(parsed.getPage(0).getSize(), { width: 300, height: 400 });
    }
    assert.throws(() => matchPdfByteLength(bytes, bytes.length - 1), /above/);
  });
}
test('500 KB input becomes exactly 300 KB in the real reduction pipeline', async () => {
  const doc = await PDFDocument.create();
  doc.addPage().drawText('Keep this selectable text');
  const input = matchPdfByteLength(await doc.save(), 500000);
  const result = await reducePdfSize(input.buffer as ArrayBuffer, 300000);
  assert.equal(result.actualBytes, 300000);
  assert.equal(result.blob.size, 300000);
  assert.equal(result.targetReached, true);
  assert.equal((await PDFDocument.load(await result.blob.arrayBuffer())).getPageCount(), 1);
});
test('invalid targets and malformed PDFs fail clearly', () => {
  assert.throws(() => matchPdfByteLength(new Uint8Array(10), NaN), /Target/);
  assert.throws(() => matchPdfByteLength(new Uint8Array(10), 12.5), /Target/);
  assert.throws(() => matchPdfByteLength(new Uint8Array(10), 20), /marker/);
});
