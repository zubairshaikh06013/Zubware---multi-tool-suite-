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

const {cropPixelRectangle,normalizeCropRectangle,presetCropRectangle} = await import('../src/lib/imageCrop');
assert.deepEqual(cropPixelRectangle({x:25,y:25,width:50,height:50},640,480), {x:160,y:120,width:320,height:240});
assert.deepEqual(cropPixelRectangle({x:100,y:100,width:0,height:0},640,480), {x:639,y:479,width:1,height:1});
assert.deepEqual(cropPixelRectangle({x:-10,y:-10,width:200,height:200},640,480), {x:0,y:0,width:640,height:480});
assert.throws(() => normalizeCropRectangle({x:NaN,y:0,width:10,height:10},640,480));
const square = cropPixelRectangle(presetCropRectangle(640,480,1),640,480);
assert.equal(square.width,square.height);
const wide = cropPixelRectangle(presetCropRectangle(4000,400,16/9),4000,400);
assert.ok(Math.abs(wide.width/wide.height-16/9)<0.01);
assert.ok(wide.width<=4000 && wide.height<=400);
console.log('Crop pixel bounds, edge clamps and extreme-aspect presets passed.');

const {bulkImageGeometry} = await import('../src/lib/bulkImageGeometry');
const bulkOptions={original:false,width:300,height:100,maintainAspect:true,allowUpscaling:false,fit:'contain' as const,alignment:'center' as const};
const tallFit=bulkImageGeometry(480,640,bulkOptions);
assert.equal(tallFit.width,75);assert.equal(tallFit.height,100);
const landscapeFit=bulkImageGeometry(640,480,bulkOptions);
assert.equal(landscapeFit.width,133);assert.equal(landscapeFit.height,100);
const letterbox=bulkImageGeometry(200,100,{...bulkOptions,width:100,height:100,maintainAspect:false});
assert.deepEqual(letterbox,{width:100,height:100,x:0,y:25,drawWidth:100,drawHeight:50});
const filled=bulkImageGeometry(200,100,{...bulkOptions,width:100,height:100,maintainAspect:false,fit:'crop',alignment:'right'});
assert.deepEqual(filled,{width:100,height:100,x:-100,y:0,drawWidth:200,drawHeight:100});
const stretched=bulkImageGeometry(200,100,{...bulkOptions,width:100,height:100,maintainAspect:false,fit:'stretch'});
assert.deepEqual(stretched,{width:100,height:100,x:0,y:0,drawWidth:100,drawHeight:100});
const smaller=bulkImageGeometry(80,40,{...bulkOptions,width:100,height:100,maintainAspect:false});
assert.equal(smaller.width,40);assert.equal(smaller.height,40);
const originalBulk=bulkImageGeometry(80,40,{...bulkOptions,original:true});
assert.equal(originalBulk.width,80);assert.equal(originalBulk.height,40);
for(const invalid of [0,-5,NaN,Infinity]) assert.throws(()=>bulkImageGeometry(200,100,{...bulkOptions,width:invalid}));
assert.throws(()=>bulkImageGeometry(0,100,bulkOptions));
assert.throws(()=>bulkImageGeometry(200,100,{...bulkOptions,width:20000,height:20000,maintainAspect:false,allowUpscaling:true}));
const collisionNames=new Set<string>();
const collisionOutputs=['photo.png','photo.png','photo-2.png','PHOTO.PNG'].map(name=>uniqueImageExportName(name,collisionNames));
assert.equal(new Set(collisionOutputs.map(name=>name.toLowerCase())).size,4);
console.log('Bulk contain, crop alignment, stretch, maxima and upscaling regressions passed.');

const {alphaContentBounds,splitImageRectangles,combinedImageLayout,combineRatioAtPosition}=await import('../src/lib/imageSplitCombine');
const opaque=new Uint8Array(5*3*4);for(let i=3;i<opaque.length;i+=4) opaque[i]=255;
assert.deepEqual(alphaContentBounds(opaque,5,3),{x:0,y:0,w:5,h:3});
const sparse=new Uint8Array(7*5*4);sparse[(1*7+1)*4+3]=1;sparse[(3*7+5)*4+3]=255;
assert.deepEqual(alphaContentBounds(sparse,7,5),{x:1,y:1,w:5,h:3});
assert.deepEqual(alphaContentBounds(new Uint8Array(8),2,1),{x:0,y:0,w:2,h:1});
const oddRect={x:1,y:3,w:5,h:7};
assert.deepEqual(splitImageRectangles(oddRect,50,'v'),[{x:1,y:3,w:3,h:7},{x:4,y:3,w:2,h:7}]);
assert.deepEqual(splitImageRectangles({x:0,y:0,w:2,h:2},5,'h'),[{x:0,y:0,w:2,h:1},{x:0,y:1,w:2,h:1}]);
assert.throws(()=>splitImageRectangles({x:0,y:0,w:1,h:3},50,'v'),/one pixel/);
const highRes=combinedImageLayout({x:0,y:0,w:2400,h:1600},{x:0,y:0,w:2400,h:1600},50,'v');
assert.equal(highRes.totalW,2400);assert.equal(highRes.totalH,1600);assert.equal(highRes.seamPos,1200);
const stacked=combinedImageLayout({x:0,y:0,w:200,h:100},{x:0,y:0,w:200,h:100},50,'h');
assert.equal(stacked.totalW,200);assert.equal(stacked.totalH,100);
assert.throws(()=>combinedImageLayout({x:0,y:0,w:20000,h:20000},{x:0,y:0,w:20000,h:20000},50,'v'),/40 megapixels/);
assert.ok(Math.abs(combineRatioAtPosition({x:0,y:0,w:400,h:200},{x:0,y:0,w:200,h:200},0.5,'v')-100/3)<1e-8);
console.log('Exact alpha bounds, gap-free splits, full-resolution combine and seam placement passed.');

const {watermarkPlacement}=await import('../src/lib/watermarkPlacement');
assert.deepEqual(watermarkPlacement(200,100,60,20,0,'center'),{x:100,y:50,scale:1,rotatedWidth:60,rotatedHeight:20});
assert.deepEqual(watermarkPlacement(200,100,60,20,90,'bottom-right'),{x:185,y:65,scale:1,rotatedWidth:20,rotatedHeight:60});
for(const position of ['center','top-left','top-right','bottom-left','bottom-right'] as const) {
 for(const angle of [0,45,90,-30,180]) {
  const p=watermarkPlacement(80,40,1000,400,angle,position);
  assert.ok(p.x-p.rotatedWidth/2>=-1e-8 && p.x+p.rotatedWidth/2<=80+1e-8);
  assert.ok(p.y-p.rotatedHeight/2>=-1e-8 && p.y+p.rotatedHeight/2<=40+1e-8);
 }
}
assert.throws(()=>watermarkPlacement(200,100,0,40,0,'center'));
console.log('Centered watermark placement, rotated corners and oversized-logo bounds passed.');

const {colorSample,imagePixelCoordinates}=await import('../src/lib/colorSample');
for(const [channels,hsv] of [[ [255,0,0],'hsv(0, 100%, 100%)'],[[0,255,0],'hsv(120, 100%, 100%)'],[[0,0,255],'hsv(240, 100%, 100%)'],[[128,128,128],'hsv(0, 0%, 50%)'],[[255,255,255],'hsv(0, 0%, 100%)'],[[0,0,0],'hsv(0, 0%, 0%)']] as const) {
 assert.equal(colorSample(...channels).hsv,hsv);
}
assert.equal(colorSample(255,0,0,128).hex,'#FF000080');
assert.equal(colorSample(255,0,0,128).rgb,'rgba(255, 0, 0, 0.502)');
assert.equal(colorSample(0,0,0,0).hex,'#00000000');
assert.equal(colorSample(0,0,0).cmyk,'cmyk(0%, 0%, 0%, 100%)');
assert.deepEqual(imagePixelCoordinates(110,70,{left:10,top:20,width:100,height:50},640,480),{x:639,y:479});
assert.deepEqual(imagePixelCoordinates(0,0,{left:10,top:20,width:100,height:50},640,480),{x:0,y:0});
console.log('Shared image/screen HSV, alpha-aware colors and edge pixel coordinates passed.');
