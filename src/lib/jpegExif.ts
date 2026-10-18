export interface ExifInspection { tags: Record<string,string>; status: string }
type Value = string | number[];

/** Selected standard JPEG EXIF fields. XMP/IPTC, maker notes and other containers are not inspected. */
export function inspectJpegExif(bytes: Uint8Array): ExifInspection {
  const tags: Record<string,string>={};
  const result=(status:string)=>({tags,status});
  if(bytes[0]!==255 || bytes[1]!==216) return result('EXIF inspection is supported for JPEG only. Metadata in this format was not inspected.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  let pos=2;
  try {
    while(pos<bytes.length) {
      if(bytes[pos++]!==255) throw new Error('Invalid JPEG header.');
      while(bytes[pos]===255) pos++;
      const marker=bytes[pos++];
      if(marker===0xda || marker===0xd9) return result('No EXIF block found in JPEG headers. Other metadata was not inspected.');
      if(marker===0x01 || (marker>=0xd0 && marker<=0xd7)) continue;
      const length=view.getUint16(pos);if(length<2 || pos+length>bytes.length) throw new Error('Truncated JPEG header.');
      if(marker===0xe1 && length>=8 && [69,120,105,102,0,0].every((b,i)=>bytes[pos+2+i]===b)) {
        try {Object.assign(tags,readTiff(bytes.subarray(pos+8,pos+length)));}
        catch {return result('EXIF block found, but it is incomplete or could not be decoded.');}
        return result('Selected JPEG EXIF fields shown below. Other tags, XMP, IPTC and maker notes were not inspected.');
      }
      pos+=length;
    }
  } catch {return result('JPEG headers are incomplete or invalid; EXIF could not be fully inspected.');}
  return result('JPEG header scan ended before image data; EXIF inspection is incomplete.');
}

function readTiff(bytes:Uint8Array):Record<string,string> {
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const endian=v.getUint16(0), little=endian===0x4949;
  if((endian!==0x4949 && endian!==0x4d4d) || v.getUint16(2,little)!==42) throw new Error('Invalid TIFF header.');
  const range=(offset:number,length:number)=> {if(offset<0 || length<0 || offset+length>bytes.length) throw new Error('Invalid EXIF offset.');};
  const visited=new Set<number>();
  const ifd=(offset:number):Map<number,Value>=>{
    if(visited.has(offset) || offset<8) throw new Error('Invalid EXIF directory.');
    visited.add(offset);range(offset,2);
    const count=v.getUint16(offset,little);if(count>512) throw new Error('Too many EXIF entries.');
    range(offset+2,count*12+4);
    const values=new Map<number,Value>();
    for(let i=0;i<count;i++) {
      const p=offset+2+i*12,tag=v.getUint16(p,little),type=v.getUint16(p+2,little),n=v.getUint32(p+4,little);
      const unit=({1:1,2:1,3:2,4:4,5:8} as Record<number,number>)[type];
      if(!unit || !n || n>(type===2?4096:16)) continue;
      const size=n*unit,at=size<=4?p+8:v.getUint32(p+8,little);range(at,size);
      if(type===2) {
        const text=new TextDecoder('utf-8').decode(bytes.subarray(at,at+n)).split('\0')[0].replace(/[\x00-\x1f\x7f]/g,'').trim();
        if(text) values.set(tag,text);
      } else {
        const numbers:number[]=[];
        for(let j=0;j<n;j++) {
          const q=at+j*unit;
          numbers.push(type===1?v.getUint8(q):type===3?v.getUint16(q,little):type===4?v.getUint32(q,little):v.getUint32(q,little)/v.getUint32(q+4,little));
        }
        if(numbers.every(Number.isFinite)) values.set(tag,numbers);
      }
    }
    return values;
  };
  const root=ifd(v.getUint32(4,little)), tags:Record<string,string>={};
  const text=(map:Map<number,Value>,id:number)=> {const value=map.get(id);return typeof value==='string'?value:undefined;};
  const pointer=(id:number)=>{const val=root.get(id);return Array.isArray(val) && val.length===1?val[0]:undefined;};
  for(const [id,name] of [[0x10f,'Camera Make'],[0x110,'Camera Model'],[0x131,'Software'],[0x132,'EXIF Date Modified'],[0x13b,'Artist'],[0x8298,'Copyright']] as const) {
    const val=text(root,id);if(val) tags[name]=val;
  }
  const exifOffset=pointer(0x8769);
  if(exifOffset) {
    const exif=ifd(exifOffset);
    for(const [id,name] of [[0x9003,'Date Taken'],[0xa434,'Lens Model']] as const) {const val=text(exif,id);if(val) tags[name]=val;}
  }
  const gpsOffset=pointer(0x8825);
  if(gpsOffset) {
    const gps=ifd(gpsOffset);
    tags['GPS Directory']='Present; coordinate fields are shown only when valid.';
    const coordinate=(id:number,refId:number,positive:string,negative:string,max:number)=>{
      const parts=gps.get(id),ref=text(gps,refId);
      if(!Array.isArray(parts)||parts.length!==3||!parts.every(x=>x>=0)||parts[1]>=60||parts[2]>=60||!ref||![positive,negative].includes(ref)) return;
      const value=parts[0]+parts[1]/60+parts[2]/3600;
      if(value<=max) return ((ref===negative?-1:1)*value).toFixed(6);
    };
    const lat=coordinate(2,1,'N','S',90),lon=coordinate(4,3,'E','W',180);
    if(lat!==undefined) tags['GPS Latitude']=lat;
    if(lon!==undefined) tags['GPS Longitude']=lon;
  }
  return tags;
}
