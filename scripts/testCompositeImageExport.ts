import assert from 'node:assert/strict';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { dataUrlBytes, exportCompositeImage } from '../src/lib/compositeImageExport';
const canvas = createCanvas(300,460);
const ctx = canvas.getContext('2d');
let seed=7;
for(let y=0;y<460;y+=2) for(let x=0;x<300;x+=2) {
 seed=(seed*1664525+1013904223)>>>0;
 ctx.fillStyle=`rgb(${seed&255},${(seed>>>8)&255},${(seed>>>16)&255})`;ctx.fillRect(x,y,2,2);
}
const adapter = {toDataURL: (mime:string,quality?:number) => canvas.toDataURL(mime as 'image/jpeg',quality)};
const original=exportCompositeImage(adapter,'jpeg');
const limited=exportCompositeImage(adapter,'jpeg',50000);
assert(limited.withinLimit && limited.bytes<=50000);
assert(limited.bytes<original.bytes);
for(const result of [original,limited,exportCompositeImage(adapter,'png',100)]) {
 const bytes=Buffer.from(result.url.split(',')[1],'base64');
 assert.equal(result.bytes,bytes.length);
 const image=await loadImage(bytes);assert.equal(image.width,300);assert.equal(image.height,460);
}
assert.equal(exportCompositeImage(adapter,'jpeg',1).withinLimit,false);
assert.equal(exportCompositeImage(adapter,'png',100).withinLimit,false);
assert.throws(()=>exportCompositeImage({toDataURL:()=> 'data:,'},'jpeg'));
for(const text of ['a','ab','abc']) {const url='data:image/png;base64,'+Buffer.from(text).toString('base64');assert.equal(dataUrlBytes(url),text.length);}
console.log('Composite export: real JPEG/PNG decode, fixed dimensions, byte limits, impossible targets and padding counts passed.');
