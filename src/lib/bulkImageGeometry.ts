import {MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS} from './imageResize';

export function bulkImageGeometry(sourceWidth:number, sourceHeight:number, options:{
  original:boolean; width:number; height:number; maintainAspect:boolean; allowUpscaling:boolean;
  fit:'contain'|'cover'|'crop'|'stretch'; alignment:'center'|'top'|'bottom'|'left'|'right';
}) {
  if (![sourceWidth,sourceHeight].every(value=>Number.isFinite(value)&&value>0)) throw new Error('This image has no valid dimensions.');
  let width=options.original ? sourceWidth : options.width;
  let height=options.original ? sourceHeight : options.height;
  if (![width,height].every(value=>Number.isFinite(value)&&value>0)) throw new Error('Enter a positive width and height.');
  if (!options.original && options.maintainAspect) {
    const scale=Math.min(width/sourceWidth,height/sourceHeight,options.allowUpscaling?Infinity:1);
    width=sourceWidth*scale;height=sourceHeight*scale;
  } else if (!options.original && !options.allowUpscaling) {
    const scale=Math.min(1,sourceWidth/width,sourceHeight/height);
    width*=scale;height*=scale;
  }
  width=Math.max(1,Math.round(width));height=Math.max(1,Math.round(height));
  if (width>MAX_RESIZE_EDGE || height>MAX_RESIZE_EDGE || width*height>MAX_RESIZE_PIXELS) throw new Error('Choose an output up to 16,384 px per side and 40 megapixels.');
  let drawWidth=width,drawHeight=height;
  if (options.fit!=='stretch') {
    const scale=(options.fit==='contain'?Math.min:Math.max)(width/sourceWidth,height/sourceHeight);
    drawWidth=sourceWidth*scale;drawHeight=sourceHeight*scale;
  }
  let x=(width-drawWidth)/2,y=(height-drawHeight)/2;
  if (options.fit==='crop' || options.fit==='cover') {
    if(options.alignment==='left') x=0;
    if(options.alignment==='right') x=width-drawWidth;
    if(options.alignment==='top') y=0;
    if(options.alignment==='bottom') y=height-drawHeight;
  }
  return {width,height,x,y,drawWidth,drawHeight};
}
