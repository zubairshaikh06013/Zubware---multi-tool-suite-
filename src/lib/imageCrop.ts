export interface CropRectangle {x:number; y:number; width:number; height:number}
const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,value));

export function normalizeCropRectangle(box:CropRectangle, imageWidth:number, imageHeight:number):CropRectangle {
  if (![box.x,box.y,box.width,box.height,imageWidth,imageHeight].every(Number.isFinite) || imageWidth < 1 || imageHeight < 1) throw new Error('Invalid crop dimensions.');
  const minWidth = 100/imageWidth;
  const minHeight = 100/imageHeight;
  const x = clamp(box.x,0,100-minWidth);
  const y = clamp(box.y,0,100-minHeight);
  return {x,y,width:clamp(box.width,minWidth,100-x),height:clamp(box.height,minHeight,100-y)};
}

export function cropPixelRectangle(box:CropRectangle, imageWidth:number, imageHeight:number) {
  const valid = normalizeCropRectangle(box,imageWidth,imageHeight);
  const x = clamp(Math.round(valid.x*imageWidth/100),0,imageWidth-1);
  const y = clamp(Math.round(valid.y*imageHeight/100),0,imageHeight-1);
  const right = clamp(Math.round((valid.x+valid.width)*imageWidth/100),x+1,imageWidth);
  const bottom = clamp(Math.round((valid.y+valid.height)*imageHeight/100),y+1,imageHeight);
  return {x,y,width:right-x,height:bottom-y};
}

export function presetCropRectangle(imageWidth:number,imageHeight:number,ratio:number):CropRectangle {
  if (!Number.isFinite(ratio) || ratio <= 0) throw new Error('Invalid crop ratio.');
  const width = Math.min(imageWidth*0.8,imageHeight*0.8*ratio);
  const height = width/ratio;
  return normalizeCropRectangle({x:(imageWidth-width)/imageWidth*50,y:(imageHeight-height)/imageHeight*50,width:width/imageWidth*100,height:height/imageHeight*100},imageWidth,imageHeight);
}
