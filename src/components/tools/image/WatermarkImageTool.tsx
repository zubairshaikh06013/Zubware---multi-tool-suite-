import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Type, Image as ImageIcon, Download, RefreshCw, Sliders } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';
import {decodeBrowserImage} from '../../../lib/browserImageDecode';
import {encodeCanvasBlob} from '../../../lib/canvasEncoding';
import {imageExportExtension} from '../../../lib/imageExport';
import {rotationExportMime} from '../../../lib/imageRotation';
import {MAX_RESIZE_EDGE,MAX_RESIZE_PIXELS} from '../../../lib/imageResize';
import {watermarkPlacement} from '../../../lib/watermarkPlacement';

interface WatermarkImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'repeat';

export const WatermarkImageTool: React.FC<WatermarkImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [type, setType] = useState<WatermarkType>('text');

  // Text options
  const [wmText, setWmText] = useState<string>('CONFIDENTIAL');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [fontSize, setFontSize] = useState<number>(48);
  const [shadow, setShadow] = useState<boolean>(true);

  // Image watermark options
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);
  const [wmImageObj, setWmImageObj] = useState<HTMLImageElement | null>(null);

  const [logoWidth,setLogoWidth] = useState(25);

  // Common options
  const [opacity, setOpacity] = useState<number>(50); // 0..100
  const [rotation, setRotation] = useState<number>(-30); // degrees
  const [position, setPosition] = useState<Position>('repeat');

  const [result,setResult] = useState<{blob:Blob;url:string;key:string}|null>(null);
  const [loading,setLoading] = useState(false);
  const [loadingLogo,setLoadingLogo] = useState(false);
  const [rendering,setRendering] = useState(false);
  const [error,setError] = useState('');
  const sourceRef=useRef(''),logoRef=useRef(''),resultRef=useRef('');
  const loads=useRef({base:0,logo:0});
  const key=JSON.stringify([imageObj?.src,wmImageObj?.src,type,wmText,textColor,fontFamily,fontSize,logoWidth,shadow,opacity,rotation,position]);
  const validResult=!loading && !loadingLogo && result?.key===key ? result : null;
  const previewUrl=validResult?.url;
  const isProcessing=loading || loadingLogo || rendering;
  const stage:ProcessingStage=loading || loadingLogo?'Reading Image':'Processing';
  const progress=loading || loadingLogo?30:70;
  const replaceResult=useCallback((next:typeof result)=>{
    if(resultRef.current) URL.revokeObjectURL(resultRef.current);
    resultRef.current=next?.url || '';setResult(next);
  },[]);
  useEffect(()=>()=>{
    loads.current.base++;loads.current.logo++;
    [sourceRef.current,logoRef.current,resultRef.current].forEach(url=>{if(url) URL.revokeObjectURL(url);});
  },[]);
  const resetBase=()=>{
    loads.current.base++;
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    sourceRef.current='';setFile(null);setImageObj(null);setMetadata(null);replaceResult(null);setLoading(false);setRendering(false);setError('');
  };
  const validateImage=(image:HTMLImageElement)=>{
    if(image.naturalWidth>MAX_RESIZE_EDGE || image.naturalHeight>MAX_RESIZE_EDGE || image.naturalWidth*image.naturalHeight>MAX_RESIZE_PIXELS) throw new Error('Choose images up to 16,384 px per side and 40 megapixels.');
  };
  const handleImageSelected=async(files:File[])=>{
    if(!files.length) return;
    resetBase();const run=++loads.current.base,selected=files[0];setFile(selected);setLoading(true);
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(selected);temporaryUrl=decoded.url;validateImage(decoded.image);
      const meta=await getImageMetadata(selected,decoded.image);
      if(run!==loads.current.base) return;
      sourceRef.current=decoded.url;temporaryUrl=undefined;setImageObj(decoded.image);setMetadata(meta);
    } catch(failure) {if(run===loads.current.base) {setFile(null);setError(failure instanceof Error?failure.message:'Could not open this image.');}}
    finally {if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);if(run===loads.current.base) setLoading(false);}
  };
  const handleWmImageSelected=async(event:React.ChangeEvent<HTMLInputElement>)=>{
    const selected=event.target.files?.[0];event.target.value='';if(!selected) return;
    const run=++loads.current.logo;setLoadingLogo(true);setWmImageFile(null);setWmImageObj(null);setError('');
    if(logoRef.current) URL.revokeObjectURL(logoRef.current);logoRef.current='';
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(selected);temporaryUrl=decoded.url;validateImage(decoded.image);
      if(run!==loads.current.logo) return;
      logoRef.current=decoded.url;temporaryUrl=undefined;setWmImageFile(selected);setWmImageObj(decoded.image);
    } catch(failure) {if(run===loads.current.logo) setError(failure instanceof Error?failure.message:'Could not open this logo.');}
    finally {if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);if(run===loads.current.logo) setLoadingLogo(false);}
  };
  useEffect(()=>{
    replaceResult(null);
    if(!imageObj || !file || (type==='image' && !wmImageObj) || (type==='text' && !wmText.trim())) {setRendering(false);return;}
    let cancelled=false;setRendering(true);setError('');
    const timer=setTimeout(async()=>{
      try {
        const canvas=document.createElement('canvas');canvas.width=imageObj.naturalWidth;canvas.height=imageObj.naturalHeight;
        const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create the watermark canvas.');
        const mime=rotationExportMime(file.type);
        if(mime==='image/jpeg') {ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
        ctx.drawImage(imageObj,0,0);ctx.globalAlpha=opacity/100;
        let markWidth:number,markHeight:number,drawMark:()=>void;
        if(type==='text') {
          ctx.font=`bold ${fontSize}px ${fontFamily}`;ctx.fillStyle=textColor;
          const metrics=ctx.measureText(wmText);
          const left=-(metrics.actualBoundingBoxLeft || 0),right=metrics.actualBoundingBoxRight || metrics.width;
          const top=-(metrics.actualBoundingBoxAscent || fontSize),bottom=metrics.actualBoundingBoxDescent || 0;
          markWidth=Math.max(1,right-left);markHeight=Math.max(1,bottom-top);
          if(shadow) {ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=8;}
          drawMark=()=>ctx.fillText(wmText,-(left+right)/2,-(top+bottom)/2);
        } else {
          const logo=wmImageObj!;markWidth=canvas.width*logoWidth/100;markHeight=markWidth*logo.naturalHeight/logo.naturalWidth;
          drawMark=()=>ctx.drawImage(logo,-markWidth/2,-markHeight/2,markWidth,markHeight);
        }
        const placement=watermarkPlacement(canvas.width,canvas.height,markWidth,markHeight,rotation,position);
        const stamp=(x:number,y:number)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rotation*Math.PI/180);ctx.scale(placement.scale,placement.scale);drawMark();ctx.restore();};
        if(position==='repeat') {
          const stepX=placement.rotatedWidth+80,stepY=placement.rotatedHeight+80;
          for(let x=canvas.width/2-Math.ceil(canvas.width/stepX)*stepX;x<canvas.width+stepX;x+=stepX)
            for(let y=canvas.height/2-Math.ceil(canvas.height/stepY)*stepY;y<canvas.height+stepY;y+=stepY) stamp(x,y);
        } else stamp(placement.x,placement.y);
        const blob=await encodeCanvasBlob(canvas,mime,0.92);
        if(!cancelled) replaceResult({blob,url:URL.createObjectURL(blob),key});
      } catch(failure) {if(!cancelled) setError(failure instanceof Error?failure.message:'Could not export the watermark.');}
      finally {if(!cancelled) setRendering(false);}
    },150);
    return()=>{cancelled=true;clearTimeout(timer);};
  },[imageObj,file,key,replaceResult]);
  const handleDownload=()=>{
    if(!validResult || !file || isProcessing) return;
    const link=document.createElement('a');link.download=`${file.name.replace(/\.[^/.]+$/, '') || 'image'}_watermarked.${imageExportExtension(validResult.blob.type)}`;link.href=validResult.url;link.click();onShowToast('Watermarked image downloaded!');
  };


  return (
    <div className="space-y-6">
      

      {error && <p role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">{error}</p>}
      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Settings Panel */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <button
                type="button"
                aria-pressed={type==='text'}
                onClick={() => setType('text')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  type === 'text'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Text Watermark
              </button>
              <button
                type="button"
                aria-pressed={type==='image'}
                onClick={() => setType('image')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  type === 'image'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Logo / Image Watermark
              </button>
            </div>

            {/* Type Specific Fields */}
            {type === 'text' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Watermark Text</label>
                  <input aria-label="Watermark Text"
                                        type="text"
                    value={wmText}
                    onChange={(e) => setWmText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Font</label>
                  <select aria-label="Font"
                                        value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Text Color</label>
                  <input aria-label="Text Color"
                                        type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-9 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Watermark Logo / Image</label>
                <input aria-label="Upload Watermark Logo / Image"
                                      type="file"
                  accept="image/*"
                  onChange={handleWmImageSelected}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950 dark:file:text-indigo-400 cursor-pointer"
                />
              </div>
            )}

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Opacity</span>
                  <span className="text-indigo-600">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  aria-label="Watermark opacity"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Size</span>
                  <span className="text-indigo-600">{type==='text'?`${fontSize}px`:`${logoWidth}% width`}</span>
                </div>
                <input
                  type="range"
                  min={type==='text'?16:5}
                  max={type==='text'?120:100}
                  aria-label={type==='text'?'Text size':'Logo width (%)'}
                  value={type==='text'?fontSize:logoWidth}
                  onChange={e=>type==='text'?setFontSize(Number(e.target.value)):setLogoWidth(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Rotation</span>
                  <span className="text-indigo-600">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  aria-label="Watermark rotation"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Position Select */}
            <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Position / Pattern</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'repeat', label: 'Tile Repeat Pattern' },
                  { id: 'center', label: 'Center' },
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-right', label: 'Bottom Right' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={position===p.id}
                    onClick={() => setPosition(p.id as Position)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      position === p.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">JPG and WebP sources keep their format when supported; other inputs export as PNG still frames. Logos use a percentage of the image width and fit inside the image after rotation. Watermark settings are kept when selecting another base image.</p>
            {type==='image' && !wmImageObj && !loadingLogo && <p className="text-sm text-slate-500">Choose a logo to prepare the watermarked image.</p>}
            {type==='text' && !wmText.trim() && <p className="text-sm text-slate-500">Enter watermark text to prepare the image.</p>}
            {/* Live Preview Canvas */}
            {previewUrl && (
              <div className="max-h-96 overflow-hidden rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
                <img src={previewUrl} alt="Watermarked Preview" className="max-h-80 object-contain rounded-xl shadow-lg" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <button
                type="button"
                onClick={resetBase}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Select Different Image
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!validResult || isProcessing}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Download Watermarked Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
