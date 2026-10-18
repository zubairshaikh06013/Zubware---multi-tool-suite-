import {rotatedImageBounds} from './imageRotation';
export type WatermarkPosition='center'|'top-left'|'top-right'|'bottom-left'|'bottom-right'|'repeat';
/** Position the center of the rotated mark, fitting its complete bounds inside the image. */
export function watermarkPlacement(width:number,height:number,markWidth:number,markHeight:number,angle:number,position:WatermarkPosition) {
  if(![width,height,markWidth,markHeight].every(value=>Number.isFinite(value)&&value>0)) throw new Error('Invalid watermark dimensions.');
  const margin=Math.min(24,width*0.05,height*0.05);
  const bounds=rotatedImageBounds(markWidth,markHeight,angle);
  const scale=Math.min(1,(width-2*margin)/bounds.width,(height-2*margin)/bounds.height);
  const rotatedWidth=bounds.width*scale,rotatedHeight=bounds.height*scale;
  let x=width/2,y=height/2;
  if(position.endsWith('left')) x=margin+rotatedWidth/2;
  if(position.endsWith('right')) x=width-margin-rotatedWidth/2;
  if(position.startsWith('top')) y=margin+rotatedHeight/2;
  if(position.startsWith('bottom')) y=height-margin-rotatedHeight/2;
  return {x,y,scale,rotatedWidth,rotatedHeight};
}
