import assert from 'node:assert/strict';
import { createCanvas } from '@napi-rs/canvas';
import { fitPhotoLabel, localPhotoDate } from '../src/lib/photoLabel';
const ctx=createCanvas(200,60).getContext('2d');
for(const text of ['A VERY LONG CANDIDATE NAME THAT SHOULD FIT','DOP: 23-Oct-2026','शाह मोहम्मद जुबैर']) {
 const size=fitPhotoLabel(ctx as any,text,'sans-serif',24,184);
 assert(size>0&&size<=24);assert(ctx.measureText(text).width<=184);
}
const date=new Date(2026,9,23,0,15);
assert.equal(localPhotoDate(date),'2026-10-23');
const late=new Date(2026,9,23,23,45);assert.equal(localPhotoDate(late),'2026-10-23');
console.log('Photo labels: long/multilingual text fits measured width; local calendar dates preserved.');
