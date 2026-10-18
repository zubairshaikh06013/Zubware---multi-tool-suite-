import {rgbToHex,rgbToHsl,rgbToCmyk} from './imageUtils';
export function colorSample(r:number,g:number,b:number,alpha=255) {
  const hsl=rgbToHsl(r,g,b),cmyk=rgbToCmyk(r,g,b);
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  const saturation=max===0?0:Math.round((max-min)/max*100),value=Math.round(max/255*100);
  const hex=rgbToHex(r,g,b)+(alpha<255?alpha.toString(16).padStart(2,'0').toUpperCase():'');
  const opacity=Number((alpha/255).toFixed(3));
  return {hex,alpha,
    rgb:alpha<255?`rgba(${r}, ${g}, ${b}, ${opacity})`:`rgb(${r}, ${g}, ${b})`,
    hsl:alpha<255?`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${opacity})`:`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv:`hsv(${hsl.h%360}, ${saturation}%, ${value}%)`,
    cmyk:`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`};
}
export function imagePixelCoordinates(clientX:number,clientY:number,rect:{left:number;top:number;width:number;height:number},width:number,height:number) {
  return {x:Math.max(0,Math.min(width-1,Math.floor((clientX-rect.left)/rect.width*width))),y:Math.max(0,Math.min(height-1,Math.floor((clientY-rect.top)/rect.height*height)))};
}
