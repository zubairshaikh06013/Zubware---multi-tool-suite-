export function rasterHistoryLimit(width:number,height:number) {
  return Math.max(2,Math.min(12,Math.floor(64*1024*1024/(width*height*4))));
}
export function strokePoints(from:{x:number;y:number},to:{x:number;y:number},spacing:number) {
  const steps=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/Math.max(1,spacing)));
  return Array.from({length:steps},(_,index)=>({x:from.x+(to.x-from.x)*(index+1)/steps,y:from.y+(to.y-from.y)*(index+1)/steps}));
}
function canvas(width:number,height:number) {
  const result=document.createElement('canvas');result.width=width;result.height=height;
  const context=result.getContext('2d');if(!context) throw new Error('Could not create the image effect canvas.');
  return {canvas:result,context};
}
export function blurredCanvas(source:HTMLCanvasElement,strength:number) {
  const {width:w,height:h}=source,pad=Math.ceil(strength*3);
  const padded=canvas(w+pad*2,h+pad*2),ctx=padded.context;ctx.imageSmoothingEnabled=false;
  ctx.drawImage(source,pad,pad);
  ctx.drawImage(source,0,0,w,1,pad,0,w,pad);ctx.drawImage(source,0,h-1,w,1,pad,h+pad,w,pad);
  ctx.drawImage(source,0,0,1,h,0,pad,pad,h);ctx.drawImage(source,w-1,0,1,h,w+pad,pad,pad,h);
  for(const [sx,sy,dx,dy] of [[0,0,0,0],[w-1,0,w+pad,0],[0,h-1,0,h+pad],[w-1,h-1,w+pad,h+pad]]) ctx.drawImage(source,sx,sy,1,1,dx,dy,pad,pad);
  const output=canvas(w,h);output.context.filter=`blur(${strength}px)`;
  if(output.context.filter!==`blur(${strength}px)`) throw new Error('This browser cannot apply canvas blur. Try a browser with canvas filter support.');
  output.context.drawImage(padded.canvas,-pad,-pad);return output.canvas;
}
export function pixelatedCanvas(source:HTMLCanvasElement,size:number) {
  const small=canvas(Math.max(1,Math.floor(source.width/size)),Math.max(1,Math.floor(source.height/size)));
  small.context.imageSmoothingEnabled=false;small.context.drawImage(source,0,0,small.canvas.width,small.canvas.height);
  const output=canvas(source.width,source.height);output.context.imageSmoothingEnabled=false;
  output.context.drawImage(small.canvas,0,0,source.width,source.height);return output.canvas;
}
