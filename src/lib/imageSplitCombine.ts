import {MAX_RESIZE_EDGE,MAX_RESIZE_PIXELS} from './imageResize';
export interface ImageRectangle {x:number;y:number;w:number;h:number}
type Box = [number,number,number,number];
export function alphaContentBounds(data:ArrayLike<number>,width:number,height:number):ImageRectangle {
  let left=width,top=height,right=-1,bottom=-1;
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
    if(data[(y*width+x)*4+3]>0) {left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
  }
  return right<0?{x:0,y:0,w:width,h:height}:{x:left,y:top,w:right-left+1,h:bottom-top+1};
}
export function splitImageRectangles(rect:ImageRectangle,percentage:number,orientation:'v'|'h') {
  const extent=orientation==='v'?rect.w:rect.h;
  if(extent<2) throw new Error('This image is only one pixel along the split direction. Change direction or turn off auto-trim.');
  const cut=Math.max(1,Math.min(extent-1,Math.round(extent*percentage/100)));
  const first={...rect},second={...rect};
  if(orientation==='v') {first.w=cut;second.x+=cut;second.w-=cut;}
  else {first.h=cut;second.y+=cut;second.h-=cut;}
  return [first,second] as const;
}
export function combinedImageLayout(a:ImageRectangle,b:ImageRectangle,percentage:number,orientation:'v'|'h') {
  const pct=percentage/100;
  const vertical=orientation==='v';
  const common=Math.min(vertical?a.h:a.w,vertical?b.h:b.w);
  const scaleA=common/(vertical?a.h:a.w),scaleB=common/(vertical?b.h:b.w);
  const partA=(vertical?a.w:a.h)*pct,partB=(vertical?b.w:b.h)*(1-pct);
  const extentA=Math.max(1,Math.round(partA*scaleA)),extentB=Math.max(1,Math.round(partB*scaleB));
  const totalW=vertical?extentA+extentB:common,totalH=vertical?common:extentA+extentB;
  if(![totalW,totalH].every(value=>Number.isFinite(value)&&value>0) || totalW>MAX_RESIZE_EDGE || totalH>MAX_RESIZE_EDGE || totalW*totalH>MAX_RESIZE_PIXELS) throw new Error('Combined output must be at most 16,384 px per side and 40 megapixels. Try smaller images.');
  return {orient:orientation,totalW,totalH,seamPos:extentA,
    aSrc:(vertical?[a.x,a.y,partA,a.h]:[a.x,a.y,a.w,partA]) as Box,
    bSrc:(vertical?[b.x+b.w-partB,b.y,partB,b.h]:[b.x,b.y+b.h-partB,b.w,partB]) as Box,
    aDst:(vertical?[0,0,extentA,common]:[0,0,common,extentA]) as Box,
    bDst:(vertical?[extentA,0,extentB,common]:[0,extentA,common,extentB]) as Box};
}

export function combineRatioAtPosition(a:ImageRectangle,b:ImageRectangle,fraction:number,orientation:'v'|'h') {
  const relativeA=orientation==='v'?a.w/a.h:a.h/a.w;
  const relativeB=orientation==='v'?b.w/b.h:b.h/b.w;
  const position=Math.max(0,Math.min(1,fraction));
  return 100*position*relativeB/((1-position)*relativeA+position*relativeB);
}
