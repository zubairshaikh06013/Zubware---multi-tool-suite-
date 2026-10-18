import JSZip from 'jszip';

interface FaviconSizeSpec {
  size: number;
  filename: string;
  label: string;
}

export const FAVICON_SIZES: FaviconSizeSpec[] = [
  { size: 16, filename: 'favicon-16x16.png', label: '16x16 (Browser Tab)' },
  { size: 32, filename: 'favicon-32x32.png', label: '32x32 (Desktop Shortcut)' },
  { size: 48, filename: 'favicon-48x48.png', label: '48x48 (Windows Site Tile)' },
  { size: 64, filename: 'favicon-64x64.png', label: '64x64 (High-DPI Tab)' },
  { size: 96, filename: 'favicon-96x96.png', label: '96x96 (Google TV / App)' },
  { size: 128, filename: 'favicon-128x128.png', label: '128x128 (Chrome Web Store)' },
  { size: 180, filename: 'apple-touch-icon.png', label: '180x180 (Apple Touch Icon)' },
  { size: 192, filename: 'android-chrome-192x192.png', label: '192x192 (PWA Android Icon)' },
  { size: 256, filename: 'icon-256x256.png', label: '256x256 (PWA Android Icon)' },
  { size: 512, filename: 'android-chrome-512x512.png', label: '512x512 (Splash Screen)' }
];

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

/** Used directly by the download action, so format checks exercise the shipped archive. */
export async function createFaviconBundle(icons: Record<string, Blob>): Promise<Blob> {
  const zip = new JSZip();
  for (const spec of FAVICON_SIZES) {
    const icon=icons[spec.filename];
    if (!icon || icon.type!=='image/png') throw new Error(`Missing PNG icon: ${spec.filename}`);
    zip.file(spec.filename, await icon.arrayBuffer());
  }
  const images=await Promise.all([16,32,48].map(async size=>({size,png:new Uint8Array(await icons[`favicon-${size}x${size}.png`].arrayBuffer())})));
  zip.file('favicon.ico',packPngIco(images));
  zip.file('site.webmanifest',JSON.stringify(FAVICON_MANIFEST,null,2));
  zip.file('favicon-head.html',FAVICON_HEAD_HTML);
  return zip.generateAsync({type:'blob'});
}
