import assert from 'node:assert/strict';
import { secureRandomIndex, passwordPool, generateRandomPassword, randomPasswordEntropy } from '../src/lib/secureRandom';
import { PASSPHRASE_WORDS } from '../src/data/passphraseWords';
import { encodeCanvasBlob } from '../src/lib/canvasEncoding';

// A rejected tail draw must not bias the final choice (2^32 is not divisible by 10).
const draws = [0xffffffff, 123];
assert.equal(secureRandomIndex(10, () => draws.shift()!), 3);
assert.equal(draws.length, 0);
assert.equal(secureRandomIndex(1, () => 0xffffffff), 0);
assert.throws(() => secureRandomIndex(0));
for (const invalid of [-1, 0x100000000, NaN, Infinity, 1.5]) {
  assert.throws(() => secureRandomIndex(10, () => invalid), /unsigned 32-bit integer/);
}
for (const invalidSize of [-1, 1.5, NaN, Infinity, 0x100000001]) {
  assert.throws(() => secureRandomIndex(invalidSize));
}
assert.equal(secureRandomIndex(0x100000000, () => 0xffffffff), 0xffffffff);
assert.equal(secureRandomIndex(10, () => 0), 0);
const options = { upper: true, lower: true, numbers: true, symbols: true, avoidSimilar: true, exclude: 'Ab2!' };
const pool = passwordPool(options);
for (const excluded of 'IOil01Ab2!') assert.ok(!pool.includes(excluded));
for (let i = 0; i < 30; i++) {
  const password = generateRandomPassword(24, pool);
  assert.equal(password.length, 24);
  assert.ok([...password].every(char => pool.includes(char)));
}
assert.equal(passwordPool({ ...options, upper: false, lower: false, numbers: false, symbols: false }), '');
assert.throws(() => generateRandomPassword(12, ''));
assert.equal(generateRandomPassword(16, 'aaaa'), 'a'.repeat(16));
const unicodePassword = generateRandomPassword(16, '🔒');
assert.equal(unicodePassword, '🔒'.repeat(16));
assert.equal(Array.from(unicodePassword).length, 16);
assert.throws(() => generateRandomPassword(0, 'abc'));
assert.throws(() => generateRandomPassword(257, 'abc'));
assert.equal(randomPasswordEntropy(20, 1), 0);
assert.equal(randomPasswordEntropy(20, 2), 20);
assert.equal(PASSPHRASE_WORDS.length, 7776);
assert.equal(new Set(PASSPHRASE_WORDS).size, 7776);
assert.ok(6 * Math.log2(PASSPHRASE_WORDS.length) > 77.5);
assert.ok(PASSPHRASE_WORDS.every(word => /^[a-z]+(?:-[a-z]+)*$/.test(word)));

// Exercise the browser's documented unsupported-codec fallback, null export and exceptions.
const fakeCanvas = (blob: Blob | null) => ({ toBlob: (cb: (value: Blob | null) => void) => cb(blob) }) as HTMLCanvasElement;
await assert.rejects(encodeCanvasBlob(fakeCanvas(new Blob(['png'], { type: 'image/png' })), 'image/avif'), /cannot export AVIF/);
await assert.rejects(encodeCanvasBlob(fakeCanvas(null), 'image/png'), /encoding failed/);
await assert.rejects(encodeCanvasBlob({ toBlob: () => { throw new Error('Canvas allocation failed'); } } as unknown as HTMLCanvasElement, 'image/png'), /allocation/);
const png = new Blob(['png'], { type: 'image/png' });
assert.equal(await encodeCanvasBlob(fakeCanvas(png), 'image/png'), png);
console.log('Secure generation, wordlist integrity and canvas export failure regressions passed.');

// Date-only calculations must not gain a century or lose a day across DST.
const { parseCalendarDate, calendarAge, calendarDay, calendarAnniversary } = await import('../src/lib/calendarAge');
const date = (value: string) => { const parsed = parseCalendarDate(value); assert.ok(parsed); return parsed; };
for (const invalid of ['', '2026-02-29', '2026-04-31', '0000-01-01', '2026-13-01', '2026-1-01']) assert.equal(parseCalendarDate(invalid), null);
assert.equal(date('0099-01-01').getFullYear(), 99);
assert.deepEqual(calendarAge(date('2024-02-29'), date('2025-02-28')), { years: 1, months: 0, days: 0, totalDays: 365 });
assert.deepEqual(calendarAge(date('2026-01-31'), date('2026-02-28')), { years: 0, months: 1, days: 0, totalDays: 28 });
assert.equal(calendarAge(date('2026-10-18'), date('2026-10-17')), null);
assert.equal(calendarAge(date('2026-10-18'), date('2026-10-18'))?.totalDays, 0);
assert.equal(calendarAge(date('2026-03-07'), date('2026-03-09'))?.totalDays, 2);
assert.equal(calendarDay(calendarAnniversary(date('0096-02-29'), 99)) - calendarDay(date('0099-02-27')), 1);
console.log('Calendar age, leap-day, month-end and early-year regressions passed.');

// Directory searches combine words with the selected tag without hiding tools by default.
const { filterDirectoryTools, directoryTags } = await import('../src/lib/toolDirectory');
const { TOOLS_DATA } = await import('../src/data/toolsData');
assert.equal(filterDirectoryTools(TOOLS_DATA, '   ').length, TOOLS_DATA.length);
assert.ok(filterDirectoryTools(TOOLS_DATA, '  PDF   MERGE ').some(tool => tool.id === 'pdf-merge'));
assert.ok(filterDirectoryTools(TOOLS_DATA, 'photo resize').length > 0);
assert.equal(filterDirectoryTools(TOOLS_DATA, 'nonexistent-utility-xyz').length, 0);
const tagged = filterDirectoryTools(TOOLS_DATA, '', 'PDF');
assert.ok(tagged.length > 0);
assert.ok(tagged.every(tool => tool.tags?.some(tag => tag.toLowerCase() === 'pdf')));
assert.equal(filterDirectoryTools(TOOLS_DATA, 'nonexistent-utility-xyz', 'PDF').length, 0);
const tagFixture = directoryTags([{tags:['PDF','PDF','Image']}, {tags:['PDF']}]);
assert.deepEqual(tagFixture, [{tag:'PDF',count:2}, {tag:'Image',count:1}]);
assert.ok(directoryTags(TOOLS_DATA).every(({count}) => count <= TOOLS_DATA.length));
console.log('Directory search, combined filters and per-tool tag counts passed.');

// Keeping an original must never disguise PNG bytes as a requested JPEG export.
const { chooseWithinTargetBlob, compressionChangeLabel } = await import('../src/lib/imageCompressionResult');
const sourcePng = new Blob([new Uint8Array(100)], {type:'image/png'});
const largerPng = new Blob([new Uint8Array(200)], {type:'image/png'});
const convertedJpeg = new Blob([new Uint8Array(150)], {type:'image/jpeg'});
assert.equal(chooseWithinTargetBlob(sourcePng, largerPng, 'image/png', 1000), sourcePng);
assert.equal(chooseWithinTargetBlob(sourcePng, null, 'image/jpeg', 1000), null);
assert.equal(chooseWithinTargetBlob(sourcePng, largerPng, 'image/jpeg', 1000), null);
assert.equal(chooseWithinTargetBlob(sourcePng, convertedJpeg, 'image/jpeg', 1000), convertedJpeg);
assert.equal(chooseWithinTargetBlob(sourcePng, convertedJpeg, 'image/jpeg', 100), null);
assert.equal(compressionChangeLabel(100, 200), '100% larger');
assert.equal(compressionChangeLabel(200, 100), '50% reduction');
assert.equal(compressionChangeLabel(100, 100), 'size unchanged');
console.log('Compressor original preservation, format integrity and size labels passed.');

// Name matches must outrank incidental keyword tags, including hyphenated IDs.
const indirect = {title:'Other Utility',navTitle:'Other',description:'PDF editing utility',tags:['pdf merge']};
const direct = {title:'PDF Merge',navTitle:'Merge PDF',description:'Combine documents',tags:['PDF']};
assert.equal(filterDirectoryTools([indirect, direct], 'PDF merge')[0], direct);
assert.equal(filterDirectoryTools(TOOLS_DATA, 'pdf merge')[0]?.id, 'pdf-merge');
assert.equal(filterDirectoryTools(TOOLS_DATA, 'pdf-to-word')[0]?.id, 'pdf-to-word');
assert.deepEqual(filterDirectoryTools([indirect, direct], ''), [indirect, direct]);
assert.ok(filterDirectoryTools(TOOLS_DATA, 'merge', 'pdf').some(tool => tool.id === 'pdf-merge'));

// Corrupt local storage must not crash tool cards or the dashboard.
const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let storedFavorites = '';
Object.defineProperty(globalThis, 'localStorage', { configurable:true, value:{getItem:()=>storedFavorites} });
try {
  const { getFavorites } = await import('../src/lib/userStore');
  for (const invalid of ['null', '{}', '42', '"pdf-merge"', '{broken']) {
    storedFavorites = invalid;
    assert.deepEqual(getFavorites(), []);
  }
  storedFavorites = JSON.stringify(['pdf-merge', 'pdf-merge', null, 4, '', 'image-compressor']);
  assert.deepEqual(getFavorites(), ['pdf-merge', 'image-compressor']);
} finally {
  if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor);
  else delete (globalThis as any).localStorage;
}
console.log('Search relevance and corrupted-favorites regressions passed.');

// Batch exports must use actual MIME types and preserve same-name files in a ZIP.
const { IMAGE_EXPORT_MIME, imageExportExtension, uniqueImageExportName } = await import('../src/lib/imageExport');
assert.equal(IMAGE_EXPORT_MIME.bmp, 'image/bmp');
assert.equal(IMAGE_EXPORT_MIME.avif, 'image/avif');
assert.equal(imageExportExtension('image/jpeg'), 'jpg');
assert.throws(() => imageExportExtension('application/octet-stream'));
const usedNames = new Set<string>();
assert.equal(uniqueImageExportName('sample.bmp', usedNames), 'sample.bmp');
assert.equal(uniqueImageExportName('sample.bmp', usedNames), 'sample-2.bmp');
assert.equal(uniqueImageExportName('SAMPLE.BMP', usedNames), 'SAMPLE-3.BMP');
assert.equal(uniqueImageExportName('../sample.bmp', usedNames), '.._sample.bmp');
const { default: JSZip } = await import('jszip');
const zipFixture = new JSZip();
const fixtureNames = new Set<string>();
zipFixture.file(uniqueImageExportName('sample.png', fixtureNames), 'first image');
zipFixture.file(uniqueImageExportName('sample.png', fixtureNames), 'second image');
const loadedZip = await JSZip.loadAsync(await zipFixture.generateAsync({type:'uint8array'}));
assert.equal(Object.keys(loadedZip.files).length, 2);
assert.equal(await loadedZip.file('sample.png')!.async('string'), 'first image');
assert.equal(await loadedZip.file('sample-2.png')!.async('string'), 'second image');
console.log('Image output format and duplicate ZIP entry regressions passed.');

const { imageResizeDimensions } = await import('../src/lib/imageResize');
const dimensionOptions = {mode:'dimensions' as const,width:300,height:200,percentage:50,preserveBatchAspect:false};
assert.deepEqual(imageResizeDimensions(640,480,dimensionOptions), {width:300,height:200});
assert.deepEqual(imageResizeDimensions(640,480,{...dimensionOptions,preserveBatchAspect:true}), {width:300,height:225});
assert.deepEqual(imageResizeDimensions(480,640,{...dimensionOptions,preserveBatchAspect:true}), {width:300,height:400});
assert.deepEqual(imageResizeDimensions(641,481,{...dimensionOptions,mode:'percentage'}), {width:321,height:241});
assert.deepEqual(imageResizeDimensions(640,480,{...dimensionOptions,mode:'preset',width:1080,height:1080,preserveBatchAspect:true}), {width:1080,height:1080});
for (const invalid of [NaN,Infinity,0,-1]) assert.throws(() => imageResizeDimensions(640,480,{...dimensionOptions,width:invalid}));
assert.throws(() => imageResizeDimensions(640,480,{...dimensionOptions,width:20000}));
assert.throws(() => imageResizeDimensions(640,480,{...dimensionOptions,width:10000,height:10000}));
console.log('Resize dimensions, batch aspect ratios, rounding and memory bounds passed.');

const { rotatedImageBounds, rotationExportMime } = await import('../src/lib/imageRotation');
for (const angle of [90,270,-90,450]) assert.deepEqual(rotatedImageBounds(640,480,angle), {width:480,height:640,angle:((angle%360)+360)%360});
assert.deepEqual(rotatedImageBounds(640,480,180), {width:640,height:480,angle:180});
assert.deepEqual(rotatedImageBounds(640,480,360), {width:640,height:480,angle:0});
assert.deepEqual(rotatedImageBounds(80,40,45), {width:85,height:85,angle:45});
assert.throws(() => rotatedImageBounds(0,40,90));
assert.throws(() => rotatedImageBounds(80,40,NaN));
assert.equal(rotationExportMime('image/gif'), 'image/png');
assert.equal(rotationExportMime('image/svg+xml'), 'image/png');
assert.equal(rotationExportMime('image/jpeg'), 'image/jpeg');
console.log('Rotation bounds, quarter turns and truthful export MIME checks passed.');
