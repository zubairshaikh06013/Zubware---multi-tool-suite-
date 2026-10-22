import assert from 'node:assert/strict';
import { createCanvas } from '@napi-rs/canvas';
import { photoFrame } from '../src/lib/photoFrame';
for (const [sw,sh,ow,oh] of [[1200,800,300,350],[800,1200,300,100],[300,350,300,350]]) {
 for (const z of [1,2,3]) for (const x of [0,50,100]) for (const y of [0,50,100]) {
  const c=photoFrame(sw,sh,ow,oh,z,x,y);
  assert(c.x>=0 && c.y>=0 && c.x+c.width<=sw+1e-9 && c.y+c.height<=sh+1e-9);
  assert(Math.abs(c.width/c.height-ow/oh)<1e-9);
 }
}
assert.throws(()=>photoFrame(0,100,50,50));
const src=createCanvas(300,100),ctx=src.getContext('2d');
for (const [i,color] of ['red','green','blue'].entries()) {ctx.fillStyle=color;ctx.fillRect(i*100,0,100,100);}
for(const [pos,expected] of [[0,[255,0,0]],[100,[0,0,255]]] as const) {
 const out=createCanvas(50,50),o=out.getContext('2d');const c=photoFrame(300,100,50,50,1,pos,50);
 o.drawImage(src,c.x,c.y,c.width,c.height,0,0,50,50);
 assert.deepEqual([...o.getImageData(25,25,1,1).data].slice(0,3),[...expected]);
}
console.log('Photo framing: source bounds, aspect ratio, zoom, edge position and real rendered pixels passed.');
