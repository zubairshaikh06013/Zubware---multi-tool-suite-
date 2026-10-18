import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Crop, RotateCw, Download, RefreshCw} from 'lucide-react';
import {ImageUploadArea} from './ImageUploadArea';
import {ImageFileInfoPanel} from './ImageFileInfoPanel';
import {ImageProcessingProgress} from './ImageProcessingProgress';
import {getImageMetadata, ImageMetadata} from '../../../lib/imageUtils';
import {decodeBrowserImage} from '../../../lib/browserImageDecode';
import {encodeCanvasBlob} from '../../../lib/canvasEncoding';
import {imageExportExtension, IMAGE_EXPORT_MIME} from '../../../lib/imageExport';
import {rotatedImageBounds} from '../../../lib/imageRotation';
import {CropRectangle, cropPixelRectangle, normalizeCropRectangle, presetCropRectangle} from '../../../lib/imageCrop';

interface CropImageToolProps {onShowToast:(message:string)=>void; onNavigate?:(path:string)=>void}
interface CropResult {blob:Blob; url:string; width:number; height:number; key:string}
const FULL_IMAGE:CropRectangle = {x:0,y:0,width:100,height:100};
const PRESETS = [
  {id:'free',label:'Free Crop',ratio:0}, {id:'1:1',label:'1:1 Square',ratio:1},
  {id:'4:3',label:'4:3 Standard',ratio:4/3}, {id:'16:9',label:'16:9 Widescreen',ratio:16/9},
  {id:'9:16',label:'9:16 Story/Reels',ratio:9/16}, {id:'A4',label:'A4 Document',ratio:1/Math.SQRT2},
  {id:'instagram',label:'Instagram',ratio:1}, {id:'youtube',label:'YouTube Thumb',ratio:16/9},
  {id:'facebook',label:'Facebook Cover',ratio:16/9},
];

export const CropImageTool:React.FC<CropImageToolProps> = ({onShowToast}) => {
  const [file,setFile] = useState<File|null>(null);
  const [metadata,setMetadata] = useState<ImageMetadata|null>(null);
  const [image,setImage] = useState<HTMLImageElement|null>(null);
  const [sourceUrl,setSourceUrl] = useState('');
  const [box,setBox] = useState<CropRectangle>(FULL_IMAGE);
  const [preset,setPreset] = useState('free');
  const [rotation,setRotation] = useState(0);
  const [zoom,setZoom] = useState(100);
  const [format,setFormat] = useState<'png'|'jpg'|'webp'>('png');
  const [loading,setLoading] = useState(false);
  const [rendering,setRendering] = useState(false);
  const [error,setError] = useState('');
  const [result,setResult] = useState<CropResult|null>(null);
  const resultRef = useRef<CropResult|null>(null);
  const sourceRef = useRef('');
  const loadRun = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{mode:'move'|'resize';x:number;y:number;box:CropRectangle;rect:DOMRect}|null>(null);
  const key = JSON.stringify([sourceUrl,box,rotation,format]);
  const validResult = result?.key === key ? result : null;
  const replaceResult = useCallback((next:CropResult|null) => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    resultRef.current = next;
    setResult(next);
  },[]);
  useEffect(() => () => {
    loadRun.current++;
    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
  },[]);

  const reset = () => {
    loadRun.current++;
    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    sourceRef.current = '';
    setSourceUrl('');setFile(null);setImage(null);setMetadata(null);
    replaceResult(null);setError('');setLoading(false);setRendering(false);
    setBox(FULL_IMAGE);setPreset('free');setRotation(0);setZoom(100);
    dragRef.current = null;
  };
  const handleImageSelected = async (files:File[]) => {
    if (!files.length) return;
    reset();
    const run = ++loadRun.current;
    const selected = files[0];
    setFile(selected);setLoading(true);
    let temporaryUrl:string|undefined;
    try {
      const decoded = await decodeBrowserImage(selected);
      temporaryUrl = decoded.url;
      const meta = await getImageMetadata(selected,decoded.image);
      if (run !== loadRun.current) return;
      sourceRef.current = decoded.url;
      temporaryUrl = undefined;
      setSourceUrl(decoded.url);setImage(decoded.image);setMetadata(meta);
    } catch (failure) {
      if (run !== loadRun.current) return;
      const message = failure instanceof Error ? failure.message : 'Could not open this image.';
      setFile(null);setError(message);onShowToast(message);
    } finally {
      if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
      if (run === loadRun.current) setLoading(false);
    }
  };

  useEffect(() => {
    replaceResult(null);
    if (!image) {setRendering(false);return;}
    let cancelled = false;
    setRendering(true);setError('');
    const timer = setTimeout(async () => {
      try {
        const crop = cropPixelRectangle(box,image.naturalWidth,image.naturalHeight);
        const bounds = rotatedImageBounds(crop.width,crop.height,rotation);
        const canvas = document.createElement('canvas');
        canvas.width = bounds.width;canvas.height = bounds.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not create the crop canvas. Try a smaller image.');
        const mime = IMAGE_EXPORT_MIME[format];
        if (mime === 'image/jpeg') {ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(bounds.angle*Math.PI/180);
        ctx.drawImage(image,crop.x,crop.y,crop.width,crop.height,-crop.width/2,-crop.height/2,crop.width,crop.height);
        const blob = await encodeCanvasBlob(canvas,mime,0.92);
        if (!cancelled) replaceResult({blob,url:URL.createObjectURL(blob),width:bounds.width,height:bounds.height,key});
      } catch (failure) {
        if (!cancelled) setError(failure instanceof Error ? failure.message : 'Could not export this crop.');
      } finally {if (!cancelled) setRendering(false);}
    },150);
    return () => {cancelled=true;clearTimeout(timer);};
  },[image,key,replaceResult]);

  const changeBox = (next:CropRectangle, free=false) => {
    if (!image) return;
    setBox(normalizeCropRectangle(next,image.naturalWidth,image.naturalHeight));
    if (free) setPreset('free');
  };
  const beginDrag = (event:React.PointerEvent<HTMLElement>,mode:'move'|'resize') => {
    if (!frameRef.current) return;
    event.preventDefault();event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {mode,x:event.clientX,y:event.clientY,box,rect:frameRef.current.getBoundingClientRect()};
  };
  const moveDrag = (event:React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.rect.width || !drag.rect.height) return;
    const dx = (event.clientX-drag.x)/drag.rect.width*100;
    const dy = (event.clientY-drag.y)/drag.rect.height*100;
    if (drag.mode === 'move') changeBox({...drag.box,x:Math.max(0,Math.min(100-drag.box.width,drag.box.x+dx)),y:Math.max(0,Math.min(100-drag.box.height,drag.box.y+dy))});
    else changeBox({...drag.box,width:drag.box.width+dx,height:drag.box.height+dy},true);
  };
  const download = () => {
    if (!validResult || !file || rendering) return;
    const link = document.createElement('a');
    link.download = `${file.name.replace(/\.[^/.]+$/, '') || 'image'}_cropped.${imageExportExtension(validResult.blob.type)}`;
    link.href = validResult.url;link.click();onShowToast('Cropped image downloaded!');
  };

  return <div className="space-y-6">
    {error && <p role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">{error}</p>}
    {!file ? <ImageUploadArea onImageSelected={handleImageSelected}/> : <div className="space-y-6">
      {metadata && <ImageFileInfoPanel fileName={metadata.fileName} originalSize={metadata.fileSize} format={metadata.format} width={metadata.width} height={metadata.height} hasTransparency={metadata.hasTransparency}/>}
      {(loading || rendering) && <ImageProcessingProgress stage={loading ? 'Reading Image' : 'Processing'} progress={loading ? 30 : 70}/>}
      <div className="glass-panel p-6 rounded-3xl space-y-5">
        <div className="flex flex-wrap gap-2">{PRESETS.map(option => <button key={option.id} type="button" disabled={!image} aria-pressed={preset===option.id} onClick={() => {setPreset(option.id);if (option.ratio && image) setBox(presetCropRectangle(image.naturalWidth,image.naturalHeight,option.ratio));}}
          className={`px-3 py-2 rounded-xl text-xs font-bold ${preset===option.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{option.label}</button>)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{(['x','y','width','height'] as const).map(field => <div key={field}>
          <label htmlFor={`crop-${field}`} className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Crop {field==='x'?'left':field==='y'?'top':field} (%)</label>
          <input id={`crop-${field}`} type="number" min="0" max="100" step="0.1" disabled={!image} value={Number(box[field].toFixed(3))} onChange={event => changeBox({...box,[field]:Number(event.target.value)},true)} className="w-full rounded-xl px-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"/>
        </div>)}</div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" disabled={!image} onClick={() => setRotation(value=>(value+90)%360)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold inline-flex gap-2"><RotateCw className="w-4 h-4"/>Rotate Crop ({rotation}°)</button>
          <button type="button" disabled={!image} onClick={() => {setBox(FULL_IMAGE);setPreset('free');}} className="text-xs font-bold text-indigo-600 dark:text-indigo-300">Select full image</button>
          <label className="text-xs text-slate-600 dark:text-slate-300">Preview zoom: {zoom}% <input aria-label="Preview zoom" type="range" min="50" max="200" value={zoom} onChange={event=>setZoom(Number(event.target.value))}/></label>
        </div>
        <p id="crop-help" className="text-xs text-slate-500 dark:text-slate-400">Drag the selection to move it, drag its corner to resize, or enter percentages. Arrow keys move the focused selection by one pixel; Shift moves ten. Zoom changes the source preview only.</p>
        {image && <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="space-y-2"><h3 className="text-sm font-bold text-slate-800 dark:text-white">Source selection</h3>
            <div className="max-h-96 overflow-auto bg-slate-950 p-4 rounded-2xl text-center">
              <div ref={frameRef} className="relative inline-block align-middle" style={{transform:`scale(${zoom/100})`,transformOrigin:'center'}}>
                <img src={sourceUrl} alt="Source image for cropping" className="block max-h-80 max-w-full object-contain" draggable={false}/>
                <div role="group" tabIndex={0} aria-label="Crop selection" aria-describedby="crop-help" onPointerDown={event=>beginDrag(event,'move')} onPointerMove={moveDrag} onPointerUp={()=>{dragRef.current=null;}} onLostPointerCapture={()=>{dragRef.current=null;}}
                  onKeyDown={event=>{const directions:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const direction=directions[event.key];if (!direction) return;event.preventDefault();const factor=event.shiftKey?10:1;changeBox({...box,x:Math.max(0,Math.min(100-box.width,box.x+direction[0]*factor*100/image.naturalWidth)),y:Math.max(0,Math.min(100-box.height,box.y+direction[1]*factor*100/image.naturalHeight))});}}
                  className="absolute border-2 border-white bg-indigo-500/15 cursor-move outline-offset-2 focus:outline-indigo-400" style={{left:`${box.x}%`,top:`${box.y}%`,width:`${box.width}%`,height:`${box.height}%`,touchAction:'none',boxShadow:'0 0 0 100vmax rgba(0,0,0,.4)'}}>
                  <span onPointerDown={event=>beginDrag(event,'resize')} className="absolute -right-2 -bottom-2 w-4 h-4 bg-white border border-indigo-600 cursor-se-resize" style={{touchAction:'none'}}/>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-2"><h3 className="text-sm font-bold text-slate-800 dark:text-white">Cropped output</h3>
            <div className="min-h-36 bg-slate-950 p-4 rounded-2xl flex justify-center items-center">{validResult ? <img src={validResult.url} alt="Cropped Preview" className="max-h-80 max-w-full object-contain"/> : <span className="text-xs text-slate-300">Preparing crop…</span>}</div>
            {validResult && <p className="text-xs text-slate-500">{validResult.width} × {validResult.height} px · {imageExportExtension(validResult.blob.type).toUpperCase()}</p>}
          </section>
        </div>}
        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex gap-2"><select aria-label="Crop output format" value={format} onChange={event=>setFormat(event.target.value as typeof format)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs"><option value="png">PNG Format</option><option value="jpg">JPG Format</option><option value="webp">WebP Format</option></select>
            <button type="button" onClick={reset} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold inline-flex items-center gap-1"><RefreshCw className="w-4 h-4"/>New File</button></div>
          <button type="button" onClick={download} disabled={!validResult || loading || rendering} className="px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50 inline-flex gap-2 items-center"><Download className="w-4 h-4"/>Download Cropped Image</button>
        </div>
      </div>
    </div>}
  </div>;
};
