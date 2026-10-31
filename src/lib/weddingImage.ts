/** Re-encode user artwork locally; no source-file metadata or active SVG is retained. */
export async function prepareWeddingImage(file:File,kind:'photo'|'design'):Promise<string> {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024)throw Error('format');
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();image.src=url;await image.decode();
  if(image.naturalWidth*image.naturalHeight>50000000)throw Error('dimensions');
  const max=kind==='design'?1600:800,limit=kind==='design'?345000:175000;
  let scale=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');const context=canvas.getContext('2d');if(!context)throw Error('canvas');
  for(let resize=0;resize<5;resize++){
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   context.drawImage(image,0,0,canvas.width,canvas.height);
   for(const quality of [.94,.86,.76,.66,.55]){const encoded=canvas.toDataURL('image/webp',quality);if(encoded.length<=limit)return encoded;}
   scale*=.8;
  }
  throw Error('size');
 }finally{URL.revokeObjectURL(url)}
}
export async function embeddedWeddingFont():Promise<string> {
 let response=await fetch('/fonts/noto-nastaliq-urdu.woff2');if(!response.ok||!response.headers.get('Content-Type')?.includes('font'))response=await fetch('https://www.zubware.com/fonts/noto-nastaliq-urdu.woff2');if(!response.ok)throw Error('font');
 const bytes=new Uint8Array(await response.arrayBuffer());if(String.fromCharCode(...bytes.subarray(0,4))!=='wOF2')throw Error('font');let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));
 return 'data:font/woff2;base64,'+btoa(binary);
}
