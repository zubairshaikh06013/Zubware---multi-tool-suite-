import assert from 'node:assert/strict';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { buildQrPayload, escapeWifi } from '../src/lib/qrPayload';
import { renderQrSvg, escapeXml, qrContrast, type QrDesign } from '../src/lib/qrCodeDesign';
const base: QrDesign = {
  qrSize: 640, margin: 4, fgColor: '#0f172a', bgColor: '#ffffff', transparentBg: false,
  errorCorrection: 'H', dotStyle: 'square', cornerStyle: 'square', useGradient: false,
  fgColor2: '#312e81', gradientType: 'linear', logoImage: null, logoSize: 16,
  frameText: '', frameColor: '#0f172a', framePosition: 'bottom'
};
const wifi = buildQrPayload('wifi', { wifiSsid: ' Café;"Guest" ', wifiPass: 'a:b\\c,d;', wifiEnc: 'WPA', wifiHidden: true });
assert.equal(wifi, `WIFI:T:WPA;S:${escapeWifi(' Café;"Guest" ')};P:${escapeWifi('a:b\\c,d;')};H:true;;`);
assert.equal(buildQrPayload('wifi', { wifiSsid: 'Open', wifiEnc: 'nopass', wifiPass: 'old secret' }), 'WIFI:T:nopass;S:Open;;');
const whatsapp = buildQrPayload('whatsapp', { phoneNumber: '+1 (212) 555-0199', smsMessage: 'Hi & नमस्ते 👋' });
assert.equal(whatsapp, 'https://wa.me/12125550199?text=Hi%20%26%20%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20%F0%9F%91%8B');
assert.throws(() => buildQrPayload('whatsapp', { phoneNumber: '0012125550199' }), /international/);
assert.throws(() => buildQrPayload('url', { textValue: '' }), /Enter/);
assert.throws(() => buildQrPayload('geo', { geoLat: '91', geoLng: '0' }), /Latitude/);
assert.throws(() => buildQrPayload('upi', { upiId: 'name@bank', upiName: 'Name', upiAmount: '-1' }), /positive/);
assert.throws(() => buildQrPayload('upi', { upiId: 'name@bank&am=90', upiName: 'Name' }), /UPI ID/);
assert.throws(() => buildQrPayload('event', { eventTitle: 'Test', eventStart: '2026-10-24T12:00', eventEnd: '2026-10-24T11:00' }), /end after/);
const oldZone = process.env.TZ;
process.env.TZ = 'Asia/Kolkata';
const event = buildQrPayload('event', { eventTitle: 'Meet; discuss\nPlans', eventStart: '2026-10-24T12:00', eventEnd: '2026-10-24T13:00' });
assert.match(event, /DTSTART:20261024T063000Z/);
assert.match(event, /SUMMARY:Meet\\; discuss\\nPlans/);
if (oldZone === undefined) delete process.env.TZ; else process.env.TZ = oldZone;
const contact = buildQrPayload('vcard', { vFirstName: 'Zoë', vLastName: 'Smith;Jones', vOrg: 'A,B', vAddress: 'One\nTwo' });
assert.match(contact, /N:Smith\\;Jones;Zoë;;;/);
assert.match(contact, /ORG:A\\,B/);
const payloads = [wifi, whatsapp, event, contact,
  buildQrPayload('url', { textValue: 'https://example.com/menu?lang=en&table=3' }),
  buildQrPayload('url', { textValue: 'हेलो दुनिया 🌍\nText with leading and trailing spaces  ' }),
  buildQrPayload('phone', { phoneNumber: '+91 98765 43210' }),
  buildQrPayload('email', { emailTo: 'a+b@example.com', emailSubject: 'Hello & welcome', emailBody: 'Line 1\nLine 2' }),
  buildQrPayload('sms', { phoneNumber: '+12125550199', smsMessage: 'Hello & test' }),
  buildQrPayload('geo', { geoLat: '-33.8688', geoLng: '151.2093' }),
  buildQrPayload('upi', { upiId: 'name@bank', upiName: 'A & B', upiAmount: '12.50' })];
let decoded = 0;
async function verify(payload: string, design: QrDesign) {
  const result = renderQrSvg(payload, design);
  const { data, info } = await sharp(Buffer.from(result.svg)).flatten({ background: '#fff' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const scan = jsQR(new Uint8ClampedArray(data), info.width, info.height, { inversionAttempts: 'attemptBoth' });
  assert.equal(scan?.data, payload, `${design.dotStyle}/${design.cornerStyle}/${design.gradientType}/${design.framePosition}/${Boolean(design.logoImage)}`);
  assert.equal(info.width, result.width);
  assert.equal(info.height, result.height);
  assert.ok(result.cell >= 3 && result.margin >= 4);
  decoded++;
}
for (const payload of payloads) await verify(payload, base);
for (const dotStyle of ['square', 'dots', 'rounded', 'classy'] as const) {
  for (const cornerStyle of ['square', 'rounded', 'circle'] as const) await verify(payloads[4], { ...base, dotStyle, cornerStyle, useGradient: true });
}
const logo = await sharp({ create: { width: 80, height: 40, channels: 4, background: '#4338ca' } }).png().toBuffer();
for (const framePosition of ['top', 'bottom'] as const) {
  await verify(payloads[4], { ...base, logoImage: `data:image/png;base64,${logo.toString('base64')}`, logoSize: 20, framePosition, frameText: 'SCAN FOR MENU', gradientType: 'radial', useGradient: true });
}
// Verify all eighteen one-click design templates decode before shipping them to users.
const quickDesigns = [
  { fgColor: '#0f172a', bgColor: '#ffffff', dotStyle: 'square', cornerStyle: 'square' },
  { fgColor: '#312e81', bgColor: '#eef2ff', dotStyle: 'rounded', cornerStyle: 'rounded' },
  { fgColor: '#78350f', bgColor: '#fffbeb', dotStyle: 'dots', cornerStyle: 'circle' },
  { fgColor: '#14532d', bgColor: '#f0fdf4', dotStyle: 'rounded', cornerStyle: 'square' },
  { fgColor: '#115e59', bgColor: '#f0fdfa', dotStyle: 'classy', cornerStyle: 'rounded' },
  { fgColor: '#581c87', bgColor: '#faf5ff', dotStyle: 'dots', cornerStyle: 'rounded' },
  { fgColor: '#172554', bgColor: '#eff6ff', dotStyle: 'square', cornerStyle: 'rounded' },
  { fgColor: '#881337', bgColor: '#fff1f2', dotStyle: 'rounded', cornerStyle: 'circle' },
  { fgColor: '#171717', bgColor: '#fafafa', dotStyle: 'classy', cornerStyle: 'square' },
  { fgColor: '#075985', bgColor: '#f0f9ff', dotStyle: 'dots', cornerStyle: 'circle' },
  { fgColor: '#7c2d12', bgColor: '#fff7ed', dotStyle: 'square', cornerStyle: 'rounded' },
  { fgColor: '#365314', bgColor: '#f7fee7', dotStyle: 'rounded', cornerStyle: 'rounded' },
  { fgColor: '#334155', bgColor: '#f8fafc', dotStyle: 'dots', cornerStyle: 'square' },
  { fgColor: '#701a75', bgColor: '#fdf4ff', dotStyle: 'classy', cornerStyle: 'rounded' },
  { fgColor: '#44403c', bgColor: '#fafaf9', dotStyle: 'square', cornerStyle: 'circle' },
  { fgColor: '#134e4a', bgColor: '#ccfbf1', dotStyle: 'rounded', cornerStyle: 'circle' },
  { fgColor: '#3730a3', bgColor: '#eef2ff', dotStyle: 'square', cornerStyle: 'square' },
  { fgColor: '#9f1239', bgColor: '#fff1f2', dotStyle: 'dots', cornerStyle: 'rounded' }
] satisfies Array<Pick<QrDesign, 'fgColor' | 'bgColor' | 'dotStyle' | 'cornerStyle'>>;
// Diamond data modules must remain machine-readable at standard print sizes.
await verify(payloads[4], { ...base, dotStyle: 'diamond', cornerStyle: 'square', qrSize: 640 });
assert.equal(quickDesigns.length, 18);
for (const template of quickDesigns) {
  await verify(payloads[4], { ...base, ...template });
}
await verify(payloads[4], { ...base, transparentBg: true, dotStyle: 'dots', qrSize: 320 });
await verify('A'.repeat(1200), { ...base, qrSize: 256, margin: 0 });
for (const errorCorrection of ['L', 'M', 'Q', 'H'] as const) await verify(payloads[4], { ...base, errorCorrection });
assert.throws(() => renderQrSvg('A'.repeat(5000), base), /too long/);
assert.throws(() => renderQrSvg('test', { ...base, fgColor: '"><script>' }), /hex colors/);
assert.throws(() => renderQrSvg('test', { ...base, logoImage: 'https://example.com/image.svg' }), /Upload/);
assert.ok(!renderQrSvg('test', { ...base, frameText: '<img src=x onerror=alert(1)>' }).svg.includes('<img'));
assert.equal(escapeXml('<script>"&'), '&lt;script&gt;&quot;&amp;');
assert.ok(qrContrast({ ...base, fgColor: '#eeeeee' }).ratio < 4.5);
assert.ok(qrContrast({ ...base, fgColor: '#ffffff', bgColor: '#000000' }).inverted);
console.log(`QR regression tests passed: ${decoded} rendered SVG images decoded exactly; validation, UTC dates, escaping, logo, gradients, styles, margins and Unicode checked.`);
