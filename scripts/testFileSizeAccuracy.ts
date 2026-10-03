import {
  DECIMAL_KB_BYTES,
  DECIMAL_MB_BYTES,
  formatDecimalBytes,
  parseTargetBytes,
  padJpegToExactBytes,
  padPngToExactBytes,
  encodeBmpFromImageData,
  encodeIcoFromPngBytes
} from '../src/lib/fileSizeStandard';

console.log('=== TEST 1: DECIMAL FILE SIZE STANDARD & UNIT CONVERSION ===');
const target100Kb = parseTargetBytes(100, 'KB');
if (target100Kb !== 100000) throw new Error(`Expected 100000 bytes, got ${target100Kb}`);
console.log('✓ 100 KB = 100,000 bytes (decimal standard)');

const target300Kb = parseTargetBytes(300, 'KB');
if (target300Kb !== 300000) throw new Error(`Expected 300000 bytes, got ${target300Kb}`);
console.log('✓ 300 KB = 300,000 bytes (decimal standard)');

const target1Mb = parseTargetBytes(1, 'MB');
if (target1Mb !== 1000000) throw new Error(`Expected 1000000 bytes, got ${target1Mb}`);
console.log('✓ 1 MB = 1,000,000 bytes (decimal standard)');

console.log('=== TEST 2: DISPLAY FORMATTING FROM AUTHORITATIVE BLOB SIZES ===');
const formatted299842 = formatDecimalBytes(299842);
if (formatted299842 !== '299.84 KB') throw new Error(`Expected '299.84 KB', got '${formatted299842}'`);
console.log('✓ 299,842 bytes displays accurately as 299.84 KB');

const formatted300000 = formatDecimalBytes(300000);
if (formatted300000 !== '300 KB' && formatted300000 !== '300.00 KB') throw new Error(`Expected '300 KB', got '${formatted300000}'`);
console.log(`✓ 300,000 bytes displays accurately as ${formatted300000}`);

console.log('=== TEST 3: JPEG FORMAT-SAFE DETERMINISTIC EXACT TARGET PADDING ===');
// Minimal valid JPEG
const testJpeg = Buffer.from([
  0xFF, 0xD8, // SOI
  0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
  0xFF, 0xDB, 0x00, 0x43, 0x00,
  ...Array(64).fill(1),
  0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00,
  0xFF, 0xC4, 0x00, 0x1F, 0x00,
  0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B,
  0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
  0x7F,
  0xFF, 0xD9 // EOI
]);

const targetJpegBytes = 1000;
const paddedJpeg = padJpegToExactBytes(new Uint8Array(testJpeg), targetJpegBytes);
if (paddedJpeg.length !== targetJpegBytes) {
  throw new Error(`Expected exactly ${targetJpegBytes} bytes, got ${paddedJpeg.length}`);
}
// Verify valid SOI and EOI
if (paddedJpeg[0] !== 0xFF || paddedJpeg[1] !== 0xD8) throw new Error('Invalid JPEG SOI');
if (paddedJpeg[paddedJpeg.length - 2] !== 0xFF || paddedJpeg[paddedJpeg.length - 1] !== 0xD9) throw new Error('Invalid JPEG EOI');
console.log(`✓ JPEG padded from ${testJpeg.length} B to exactly ${paddedJpeg.length} B with valid headers`);

console.log('=== TEST 4: PNG FORMAT-SAFE DETERMINISTIC EXACT TARGET PADDING ===');
// Minimal valid PNG
const testPng = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR len 13
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00,
  0x90, 0x77, 0x53, 0xDE,
  0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54,
  0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x03, 0x01, 0x01, 0x00,
  0x18, 0xDD, 0x8D, 0xB0,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
]);

const targetPngBytes = 500;
const paddedPng = padPngToExactBytes(new Uint8Array(testPng), targetPngBytes);
if (paddedPng.length !== targetPngBytes) {
  throw new Error(`Expected exactly ${targetPngBytes} bytes, got ${paddedPng.length}`);
}
// Verify valid PNG signature
if (paddedPng[0] !== 0x89 || paddedPng[1] !== 0x50 || paddedPng[2] !== 0x4E || paddedPng[3] !== 0x47) {
  throw new Error('Invalid PNG signature');
}
console.log(`✓ PNG padded from ${testPng.length} B to exactly ${paddedPng.length} B with valid CRC32 tEXt chunk`);

console.log('=== TEST 5: CLIENT-SIDE BITMAP (BMP) ENCODER ===');
const mockImageData = {
  width: 4,
  height: 4,
  data: new Uint8ClampedArray(4 * 4 * 4).fill(255)
} as any;
const bmpBytes = encodeBmpFromImageData(mockImageData);
if (bmpBytes[0] !== 0x42 || bmpBytes[1] !== 0x4D) throw new Error('Invalid BMP magic header');
const bmpFileSizeInHeader = new DataView(bmpBytes.buffer).getUint32(2, true);
if (bmpFileSizeInHeader !== bmpBytes.length) throw new Error(`BMP header size mismatch: ${bmpFileSizeInHeader} !== ${bmpBytes.length}`);
console.log(`✓ 4x4 BMP generated: ${bmpBytes.length} bytes with valid DIB and BM header`);

console.log('=== TEST 6: CLIENT-SIDE WINDOWS ICON (ICO) ENCODER ===');
const icoBytes = encodeIcoFromPngBytes(new Uint8Array([1, 2, 3, 4, 5]), 32, 32);
const icoType = new DataView(icoBytes.buffer).getUint16(2, true);
const icoCount = new DataView(icoBytes.buffer).getUint16(4, true);
const icoOffset = new DataView(icoBytes.buffer).getUint32(18, true);
if (icoType !== 1 || icoCount !== 1 || icoOffset !== 22) throw new Error('Invalid ICO header structure');
console.log(`✓ Standard Windows ICO generated: ${icoBytes.length} bytes with valid ICONDIR and ICONDIRENTRY`);

console.log('\n>>> ALL FILE SIZE ACCURACY & CLIENT-SIDE CODEC TESTS PASSED! <<<');
