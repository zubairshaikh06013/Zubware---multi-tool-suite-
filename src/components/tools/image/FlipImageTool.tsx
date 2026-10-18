import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlipHorizontal, FlipVertical, Download, RefreshCw, Sparkles } from 'lucide-react';
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

interface FlipImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const FlipImageTool: React.FC<FlipImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [result,setResult] = useState<{blob:Blob;url:string;key:string}|null>(null);
  const [loading,setLoading] = useState(false);
  const [rendering,setRendering] = useState(false);
  const [error,setError] = useState('');
  const sourceRef = useRef('');
  const resultRef = useRef('');
  const loadRun = useRef(0);
  const key = JSON.stringify([imageObj?.src,flipH,flipV]);
  const validResult = result?.key===key ? result : null;
  const previewUrl = validResult?.url;
  const isProcessing = loading || rendering;
  const stage:ProcessingStage = loading?'Reading Image':'Processing';
  const progress = loading?30:70;
  const replaceResult = useCallback((next:typeof result) => {
    if(resultRef.current) URL.revokeObjectURL(resultRef.current);
    resultRef.current=next?.url || '';setResult(next);
  },[]);
  useEffect(() => () => {
    loadRun.current++;
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    if(resultRef.current) URL.revokeObjectURL(resultRef.current);
  },[]);
  const reset = () => {
    loadRun.current++;
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    sourceRef.current='';setFile(null);setMetadata(null);setImageObj(null);
    setFlipH(false);setFlipV(false);replaceResult(null);setLoading(false);setRendering(false);setError('');
  };
  const handleImageSelected = async (files:File[]) => {
    if(!files.length) return;
    reset();const run=++loadRun.current,selected=files[0];
    setFile(selected);setLoading(true);
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(selected);temporaryUrl=decoded.url;
      const meta=await getImageMetadata(selected,decoded.image);
      if(run!==loadRun.current) return;
      sourceRef.current=decoded.url;temporaryUrl=undefined;
      setMetadata(meta);setImageObj(decoded.image);
    } catch(failure) {
      if(run===loadRun.current) {
        const message=failure instanceof Error?failure.message:'Could not open this image.';
        setFile(null);setError(message);onShowToast(message);
      }
    } finally {
      if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);
      if(run===loadRun.current) setLoading(false);
    }
  };
  useEffect(() => {
    replaceResult(null);
    if(!imageObj || !file) {setRendering(false);return;}
    let cancelled=false;
    setRendering(true);setError('');
    const render = async () => {
      try {
        const canvas=document.createElement('canvas');canvas.width=imageObj.naturalWidth;canvas.height=imageObj.naturalHeight;
        const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create the image canvas. Try a smaller image.');
        const mime=rotationExportMime(file.type);
        if(mime==='image/jpeg') {ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
        ctx.translate(flipH?canvas.width:0,flipV?canvas.height:0);ctx.scale(flipH?-1:1,flipV?-1:1);ctx.drawImage(imageObj,0,0);
        const blob=await encodeCanvasBlob(canvas,mime,0.92);
        if(!cancelled) replaceResult({blob,url:URL.createObjectURL(blob),key});
      } catch(failure) {if(!cancelled) setError(failure instanceof Error?failure.message:'Could not flip this image.');}
      finally {if(!cancelled) setRendering(false);}
    };
    void render();
    return () => {cancelled=true;};
  },[imageObj,file,key,replaceResult]);
  const handleDownload = () => {
    if(!validResult || !file || isProcessing) return;
    const link=document.createElement('a');
    link.download=`${file.name.replace(/\.[^/.]+$/, '') || 'image'}_flipped.${imageExportExtension(validResult.blob.type)}`;
    link.href=validResult.url;link.click();onShowToast('Flipped image downloaded!');
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

          {/* Controls & Preview */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={loading}
                aria-pressed={flipH}
                onClick={() => setFlipH(value=>!value)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  flipH
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" /> Horizontal Flip {flipH && '✓'}
              </button>

              <button
                type="button"
                disabled={loading}
                aria-pressed={flipV}
                onClick={() => setFlipV(value=>!value)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  flipV
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipVertical className="w-4 h-4" /> Vertical Flip {flipV && '✓'}
              </button>

              <button
                type="button"
                disabled={loading}
                aria-pressed={flipH && flipV}
                onClick={() => {
                  setFlipH(true);
                  setFlipV(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-purple-200 dark:border-purple-800"
              >
                <Sparkles className="w-3.5 h-3.5" /> Full Mirror
              </button>
            </div>

            <p className="text-xs text-slate-500">JPG and WebP sources keep their format when supported. Other inputs export as PNG. Animated images become a still frame.</p>
            {/* Canvas Preview */}
            {previewUrl && (
              <div className="max-h-96 overflow-hidden rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
                <img src={previewUrl} alt="Flipped Preview" className="max-h-80 object-contain rounded-xl shadow-lg" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <button
                type="button"
                onClick={reset}
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
                <Download className="w-4 h-4" /> Download Flipped Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
