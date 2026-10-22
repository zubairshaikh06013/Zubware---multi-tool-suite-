import assert from 'node:assert/strict';
import { createCanvas } from '@napi-rs/canvas';
import { paintInvoiceLabels } from '../src/lib/invoiceWorkspace';

const render = (scale: number, inherited: boolean) => {
  const canvas = createCanvas(400 * scale, 180 * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (inherited) { ctx.scale(scale, scale); ctx.translate(10000, -50); }
  const transform = ctx.getTransform();
  paintInvoiceLabels(ctx as unknown as CanvasRenderingContext2D, [{
    text: 'TAX INVOICE', left: 100, top: 50, width: 160, height: 28,
    paddingLeft: 12, paddingRight: 12, font: 'bold 14px sans-serif',
    colour: '#ffffff', letterSpacing: '0px', align: 'center',
  }], scale);
  const after = ctx.getTransform();
  assert.deepEqual([after.a, after.d, after.e, after.f], [transform.a, transform.d, transform.e, transform.f]);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let minY = canvas.height, maxY = -1, ink = 0;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    const i = (y * canvas.width + x) * 4;
    if (pixels[i] > 180 && pixels[i + 1] > 180 && pixels[i + 2] > 180) {
      ink++; minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      assert(x >= 100 * scale && x < 260 * scale, 'Text outside label');
    }
  }
  assert(ink > 100, 'Label disappeared');
  assert(Math.abs((minY + maxY + 1) / 2 - 64 * scale) <= scale, 'Label not vertically centred');
  return pixels;
};
for (const scale of [1, 2, 3]) {
  assert.deepEqual(render(scale, true), render(scale, false), 'Inherited canvas transforms changed the output');
}
console.log('Invoice labels remain visible and centred with inherited renderer scale/translation at 1x, 2x and 3x.');
