import {useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {decodeBrowserImage} from '../lib/browserImageDecode';
import {encodeCanvasBlob} from '../lib/canvasEncoding';
import {getImageMetadata,ImageMetadata} from '../lib/imageUtils';
import {imageExportExtension} from '../lib/imageExport';
import {rotationExportMime} from '../lib/imageRotation';
import {MAX_RESIZE_EDGE,MAX_RESIZE_PIXELS} from '../lib/imageResize';
import {imagePixelCoordinates} from '../lib/colorSample';
import {rasterHistoryLimit,strokePoints} from '../lib/rasterEffects';

export function useRasterEditor(suffix:string,onShowToast:(message:string)=>void) {
  const [file,setFile]=useState<File|null>(null),[imageObj,setImageObj]=useState<HTMLImageElement|null>(null);
  const [metadata,setMetadata]=useState<ImageMetadata|null>(null);
  const [loading,setLoading]=useState(false),[exporting,setExporting]=useState(false),[error,setError]=useState('');
  const [historyIndex,setHistoryIndex]=useState(-1),[historyLength,setHistoryLength]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const snapshots=useRef<ImageData[]>([]),indexRef=useRef(-1),runRef=useRef(0),revision=useRef(0),sourceUrl=useRef('');
  useEffect(()=>()=>{runRef.current++;if(sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);snapshots.current=[];},[]);
  const reset=()=>{
    runRef.current++;revision.current++;if(sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);sourceUrl.current='';
    snapshots.current=[];indexRef.current=-1;setHistoryIndex(-1);setHistoryLength(0);
    setFile(null);setImageObj(null);setMetadata(null);setLoading(false);setExporting(false);setError('');
  };
  const saveCanvasState=()=>{
    const canvas=canvasRef.current,ctx=canvas?.getContext('2d');if(!canvas || !ctx) return;
    const previous=snapshots.current.slice(0,indexRef.current+1);
    previous.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    const next=previous.slice(-rasterHistoryLimit(canvas.width,canvas.height));
    snapshots.current=next;indexRef.current=next.length-1;revision.current++;
    setHistoryLength(next.length);setHistoryIndex(next.length-1);
  };
  const handleImageSelected=async(files:File[])=>{
    if(!files.length) return;
    reset();const run=++runRef.current,selected=files[0];setFile(selected);setLoading(true);
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(selected);temporaryUrl=decoded.url;
      if(decoded.image.naturalWidth>MAX_RESIZE_EDGE || decoded.image.naturalHeight>MAX_RESIZE_EDGE || decoded.image.naturalWidth*decoded.image.naturalHeight>MAX_RESIZE_PIXELS) throw new Error('Choose images up to 16,384 px per side and 40 megapixels.');
      const info=await getImageMetadata(selected,decoded.image);
      if(run!==runRef.current) return;
      sourceUrl.current=decoded.url;temporaryUrl=undefined;setMetadata(info);setImageObj(decoded.image);
    } catch(failure) {if(run===runRef.current) {setFile(null);setError(failure instanceof Error?failure.message:'Could not open this image.');}}
    finally {if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);if(run===runRef.current) setLoading(false);}
  };
  useEffect(()=>{
    if(!imageObj || !canvasRef.current) return;
    try {
      const canvas=canvasRef.current;canvas.width=imageObj.naturalWidth;canvas.height=imageObj.naturalHeight;
      const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create the editing canvas.');
      ctx.drawImage(imageObj,0,0);saveCanvasState();
    } catch(failure) {setError(failure instanceof Error?failure.message:'Could not prepare this image.');}
  },[imageObj]);
  const ready=!!imageObj && historyIndex>=0 && !loading && !exporting;
  const handleUndo=()=>{
    const ctx=canvasRef.current?.getContext('2d');if(!ready || !ctx || indexRef.current<=0) return;
    indexRef.current--;ctx.putImageData(snapshots.current[indexRef.current],0,0);revision.current++;setHistoryIndex(indexRef.current);
  };
  const handleRedo=()=>{
    const ctx=canvasRef.current?.getContext('2d');if(!ready || !ctx || indexRef.current>=snapshots.current.length-1) return;
    indexRef.current++;ctx.putImageData(snapshots.current[indexRef.current],0,0);revision.current++;setHistoryIndex(indexRef.current);
  };
  const applyEffect=(effect:(canvas:HTMLCanvasElement)=>HTMLCanvasElement)=>{
    if(!ready || !canvasRef.current) return;
    try {
      const canvas=canvasRef.current,result=effect(canvas),ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not apply the image effect.');
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(result,0,0);saveCanvasState();setError('');
    } catch(failure) {setError(failure instanceof Error?failure.message:'Could not apply the image effect.');}
  };
  const handleDownload=async()=>{
    if(!ready || !file || !canvasRef.current) return;
    const run=runRef.current,version=revision.current;setExporting(true);setError('');
    try {
      const source=canvasRef.current,canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;
      const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create the export canvas.');
      const mime=rotationExportMime(file.type);
      if(mime==='image/jpeg') {ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
      ctx.drawImage(source,0,0);const blob=await encodeCanvasBlob(canvas,mime,0.92);
      if(run!==runRef.current || version!==revision.current) return;
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${file.name.replace(/\.[^/.]+$/, '') || 'image'}_${suffix}.${imageExportExtension(blob.type)}`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);onShowToast('Edited image downloaded!');
    } catch(failure) {if(run===runRef.current) setError(failure instanceof Error?failure.message:'Could not export this image.');}
    finally {if(run===runRef.current) setExporting(false);}
  };
  return {file,metadata,imageObj,canvasRef,ready,historyIndex,historyLength,saveCanvasState,handleImageSelected,handleUndo,handleRedo,handleDownload,reset,applyEffect,error,setError,isProcessing:loading||exporting,stage:loading?'Reading Image' as const:'Preparing Download' as const,progress:loading?30:85};
}

export function useCanvasBrush(editor:ReturnType<typeof useRasterEditor>,radius:number,effect:(canvas:HTMLCanvasElement)=>HTMLCanvasElement,enabled=true) {
  const stroke=useRef<{pointer:number;source:HTMLCanvasElement;last:{x:number;y:number}}|null>(null);
  useEffect(()=>{stroke.current=null;},[editor.imageObj,enabled]);
  const point=(event:ReactPointerEvent<HTMLCanvasElement>)=>imagePixelCoordinates(event.clientX,event.clientY,event.currentTarget.getBoundingClientRect(),event.currentTarget.width,event.currentTarget.height);
  const paint=(x:number,y:number)=>{
    const canvas=editor.canvasRef.current,ctx=canvas?.getContext('2d'),active=stroke.current;if(!canvas || !ctx || !active) return;
    ctx.save();ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.clip();ctx.globalCompositeOperation='copy';ctx.drawImage(active.source,0,0);ctx.restore();
  };
  const onPointerDown=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!editor.ready || !enabled || event.button!==0) return;
    event.preventDefault();
    try {
      const canvas=editor.canvasRef.current;if(!canvas) return;
      event.currentTarget.setPointerCapture(event.pointerId);const start=point(event);
      stroke.current={pointer:event.pointerId,source:effect(canvas),last:start};paint(start.x,start.y);editor.setError('');
    } catch(failure) {stroke.current=null;editor.setError(failure instanceof Error?failure.message:'Could not apply brush stroke.');}
  };
  const onPointerMove=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    const active=stroke.current;if(!active || active.pointer!==event.pointerId) return;
    const next=point(event);strokePoints(active.last,next,radius/3).forEach(p=>paint(p.x,p.y));active.last=next;
  };
  const end=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!stroke.current || stroke.current.pointer!==event.pointerId) return;
    stroke.current=null;
    try {editor.saveCanvasState();} catch(failure) {editor.setError(failure instanceof Error?failure.message:'Could not save brush history.');}
  };
  return {onPointerDown,onPointerMove,onPointerUp:end,onPointerCancel:end,onLostPointerCapture:end};
}
