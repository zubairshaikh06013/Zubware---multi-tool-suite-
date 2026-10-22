import assert from 'node:assert/strict';
import { createCanvas } from '@napi-rs/canvas';
import { signatureFit, whitenSignaturePaper } from '../src/lib/signatureAppearance';
const source=createCanvas(200,50),s=source.getContext('2d');s.fillStyle='black';s.fillRect(0,0,200,50);
const out=createCanvas(100,100),ctx=out.getContext('2d');const fit=signatureFit(200,50,100,100);
ctx.drawImage(source,fit.x,fit.y,fit.width,fit.height);
assert.equal(fit.width/fit.height,4);assert.deepEqual(fit,{x:0,y:37.5,width:100,height:25});
assert.equal(ctx.getImageData(50,10,1,1).data[3],0);
assert.equal(ctx.getImageData(50,50,1,1).data[3],255);
for(const dims of [[50,200,100,100],[700,30,140,60],[1,1,1,1]]){
 const [sw,sh,w,h]=dims,c=signatureFit(sw,sh,w,h);
 assert(c.x>=0&&c.y>=0&&c.x+c.width<=w+1e-9&&c.y+c.height<=h+1e-9);
 assert(Math.abs(c.width/c.height-sw/sh)<1e-9);
}
const pixels=new Uint8ClampedArray([240,240,240,255, 0,0,120,255, 100,100,100,255, 240,240,240,0]);
whitenSignaturePaper(pixels,235);
assert.deepEqual([...pixels],[255,255,255,255,0,0,120,255,100,100,100,255,240,240,240,0]);
assert.throws(()=>signatureFit(0,1,10,10));
console.log('Signature appearance: real rendered proportions, target bounds, grey-paper cleanup, blue/dark ink and transparency passed.');
