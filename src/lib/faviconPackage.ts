/** Center the complete source inside a square icon without stretching it. */
export function faviconImageRect(width: number, height: number, size: number) {
  if (![width,height,size].every(value=>Number.isFinite(value) && value>0)) throw new Error('Invalid icon dimensions.');
  const scale = size / Math.max(width,height);
  return {x:(size-width*scale)/2,y:(size-height*scale)/2,width:width*scale,height:height*scale};
}

/** ICONDIR + ICONDIRENTRY records followed by complete PNG image payloads. */
export function packPngIco(images: {size:number; png:Uint8Array}[]): Uint8Array {
  if (!images.length || images.length>256) throw new Error('Choose between 1 and 256 icon images.');
  const signature=[137,80,78,71,13,10,26,10];
  for(const {size,png} of images) {
    if (!Number.isInteger(size) || size<1 || size>256 || png.length<33 || !signature.every((byte,i)=>png[i]===byte)) throw new Error('Invalid PNG icon image.');
    const view=new DataView(png.buffer,png.byteOffset,png.byteLength);
    if (view.getUint32(16)!==size || view.getUint32(20)!==size) throw new Error('Icon PNG dimensions must match its directory entry.');
  }
  const directorySize=6+16*images.length;
  const output=new Uint8Array(directorySize+images.reduce((sum,image)=>sum+image.png.length,0));
  const view=new DataView(output.buffer);
  view.setUint16(2,1,true); view.setUint16(4,images.length,true);
  let offset=directorySize;
  images.forEach(({size,png},index)=>{
    const entry=6+index*16;
    output[entry]=size===256?0:size; output[entry+1]=size===256?0:size;
    view.setUint16(entry+4,1,true); view.setUint16(entry+6,32,true);
    view.setUint32(entry+8,png.length,true); view.setUint32(entry+12,offset,true);
    output.set(png,offset); offset+=png.length;
  });
  return output;
}

export const FAVICON_HEAD_HTML = `<!-- Upload these files to your website root. -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

export const FAVICON_MANIFEST = {
  name:'My App', short_name:'App',
  icons:[
    {src:'/android-chrome-192x192.png',sizes:'192x192',type:'image/png'},
    {src:'/android-chrome-512x512.png',sizes:'512x512',type:'image/png'}
  ],
  theme_color:'#ffffff',background_color:'#ffffff',display:'standalone'
};
