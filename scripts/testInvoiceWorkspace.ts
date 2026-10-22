import assert from 'node:assert/strict';
import { buildInvoicePaymentUri, invoicePageSlices, validateInvoiceSnapshot, invoiceLabelBaseline } from '../src/lib/invoiceWorkspace';
import { numberToIndianWords } from '../src/components/tools/business/GstInvoiceGeneratorTool';

const uri = new URL(buildInvoicePaymentUri('shop@bank', 'A & B', 1180 - 500)!);
assert.equal(uri.searchParams.get('am'), '680.00');
assert.equal(uri.searchParams.get('pn'), 'A & B');
assert.equal(buildInvoicePaymentUri('shop@bank', 'Shop', 0), null);
assert.equal(buildInvoicePaymentUri('shop@bank', 'Shop', NaN), null);
assert.equal(new URL(buildInvoicePaymentUri('shop@bank', 'Shop', 0.01)!).searchParams.get('am'), '0.01');
const slices = invoicePageSlices(3100, 1000, [{top:950,bottom:1100},{top:1800,bottom:2000}]);
assert.equal(slices[0].height, 950);
assert.equal(slices.reduce((sum, page) => sum + page.height, 0), 3100);
slices.forEach((page, i) => { assert(page.height > 0 && page.height <= 1000); if (i) assert.equal(page.start, slices[i-1].start + slices[i-1].height); });
assert.deepEqual(invoicePageSlices(500,1000,[]),[{start:0,height:500}]);
assert.equal(invoicePageSlices(2500,1000,[{top:0,bottom:2100}]).length,3);
const template = {supplier:{logoUrl:null,businessName:'Demo'}, signatureUrl:null,terms:'',amountReceived:0,taxOverride:'auto',invoiceMeta:{invoiceType:'Tax Invoice',reverseCharge:'No'},items:[{discountType:'amount',rate:0}]};
const restored = validateInvoiceSnapshot({...template,terms:'',signatureUrl:null},template);
assert.equal(restored.terms,'');assert.equal(restored.signatureUrl,null);
assert.throws(()=>validateInvoiceSnapshot({...template,items:[]},template));
assert.throws(()=>validateInvoiceSnapshot({...template,amountReceived:-1},template));
assert.throws(()=>validateInvoiceSnapshot({...template,signatureUrl:'https://tracker.invalid/image'},template));
assert.throws(()=>validateInvoiceSnapshot({...template,taxOverride:'invalid'},template));
assert.throws(()=>validateInvoiceSnapshot({...template,supplier:null},template));
assert.equal(numberToIndianWords(1.999),'Two Rupees Only');
assert.equal(numberToIndianWords(1.01),'One Rupee and One Paise Only');
console.log('Invoice backup validation, outstanding payment, page coverage and paise carry tests passed.');

// Font metrics differ by face/device; visible ink must still sit at box centre.
for (const [top, height, ascent, descent] of [[0,28,10,2], [100,36,13,0], [400,32,8,3], [20,28,9,-1]]) {
  const baseline = invoiceLabelBaseline(top,height,ascent,descent);
  const inkTop = baseline - ascent;
  const inkBottom = baseline + descent;
  assert.equal((inkTop + inkBottom) / 2, top + height / 2);
  assert(inkTop >= top && inkBottom <= top + height);
}
console.log('Invoice label glyph-centering checks passed.');
