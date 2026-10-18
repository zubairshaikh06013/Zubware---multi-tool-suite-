import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Code, RefreshCw, FileArchive } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { decodeBrowserImage } from '../../../lib/browserImageDecode';
import { encodeCanvasBlob } from '../../../lib/canvasEncoding';
import { imageResizeDimensions } from '../../../lib/imageResize';
import { faviconImageRect, createFaviconBundle, FAVICON_SIZES, FAVICON_HEAD_HTML } from '../../../lib/faviconPackage';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';

interface FaviconGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const FaviconGeneratorTool: React.FC<FaviconGeneratorToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState('');

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const generation = useRef(0);
  const busy = useRef(false);
  const blobs = useRef<Record<string, Blob>>({});
  const urls = useRef<string[]>([]);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const releasePreviews = () => { urls.current.forEach(url=>URL.revokeObjectURL(url)); urls.current=[]; };
  useEffect(()=>()=>{generation.current++;releasePreviews();clearTimeout(copyTimer.current);},[]);
  const reset = () => {
    generation.current++; busy.current=false; releasePreviews(); blobs.current={}; clearTimeout(copyTimer.current);
    setFile(null);setMetadata(null);setPreviews({});setCopiedHtml(false);setError('');setIsProcessing(false);setProgress(0);
  };
  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    reset();
    const run=generation.current;
    setFile(files[0]);busy.current=true;setIsProcessing(true);setStage('Reading Image');setProgress(10);
    let sourceUrl='';
    const pendingUrls:string[]=[];
    try {
      const decoded=await decodeBrowserImage(files[0]);sourceUrl=decoded.url;
      if(run!==generation.current) return;
      const img=decoded.image;
      imageResizeDimensions(img.naturalWidth,img.naturalHeight,{mode:'percentage',width:1,height:1,percentage:100,preserveBatchAspect:false});
      setStage('Analyzing');
      const meta=await getImageMetadata(files[0],img);
      if(run!==generation.current) return;
      setStage('Generating Previews');
      const icons:Record<string,Blob>={}, previewsMap:Record<string,string>={};
      for(const spec of FAVICON_SIZES) {
        const canvas=document.createElement('canvas');canvas.width=spec.size;canvas.height=spec.size;
        const ctx=canvas.getContext('2d');
        if(!ctx) throw new Error('Unable to create icon canvas.');
        ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
        const rect=faviconImageRect(img.naturalWidth,img.naturalHeight,spec.size);
        ctx.drawImage(img,rect.x,rect.y,rect.width,rect.height);
        const blob=await encodeCanvasBlob(canvas,'image/png');
        if(run!==generation.current) return;
        icons[spec.filename]=blob;
        const url=URL.createObjectURL(blob);pendingUrls.push(url);previewsMap[spec.filename]=url;
        setProgress(Math.round(25+65*pendingUrls.length/FAVICON_SIZES.length));
      }
      blobs.current=icons;urls.current=pendingUrls.splice(0);setMetadata(meta);setPreviews(previewsMap);
      setStage('Completed');setProgress(100);
    } catch(cause) {
      if(run===generation.current) {setFile(null);setError(cause instanceof Error?cause.message:'Unable to generate icons.');}
    } finally {
      if(sourceUrl) URL.revokeObjectURL(sourceUrl);
      pendingUrls.forEach(url=>URL.revokeObjectURL(url));
      if(run===generation.current) {busy.current=false;setIsProcessing(false);}
    }
  };

  const htmlHeadSnippet = FAVICON_HEAD_HTML;
  const copyHtmlSnippet = async () => {
    const run=generation.current;
    try {
      await navigator.clipboard.writeText(htmlHeadSnippet);
      if(run!==generation.current) return;
      setCopiedHtml(true);clearTimeout(copyTimer.current);
      onShowToast('HTML <head> tags copied to clipboard!');
      copyTimer.current=setTimeout(()=>setCopiedHtml(false),2000);
    } catch {if(run===generation.current) onShowToast('Clipboard unavailable. Select and copy the HTML below.');}
  };

  const handleDownloadZip = async () => {
    if (busy.current || !FAVICON_SIZES.every(spec=>blobs.current[spec.filename])) return;
    const run=generation.current, icons=blobs.current;
    busy.current=true;setIsProcessing(true);setError('');setStage('Preparing Download');setProgress(50);
    try {
      setStage('Compressing ZIP');setProgress(85);
      const blob=await createFaviconBundle(icons);
      if(run!==generation.current) return;
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download='favicons_bundle.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      setStage('Completed');setProgress(100);onShowToast('Favicon ZIP package downloaded!');
    } catch(cause) {
      if(run===generation.current) setError(cause instanceof Error?cause.message:'Unable to create the favicon ZIP.');
    } finally {if(run===generation.current){busy.current=false;setIsProcessing(false);}}
  };

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

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
          <button type="button" onClick={reset} className="flex items-center gap-2 text-sm font-bold text-indigo-600"><RefreshCw className="w-4 h-4" /> Select Different Image</button>

          {/* Favicons Grid Preview */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Generated Favicon Set</h3>
                <p className="text-xs text-slate-500">Includes 10 PNG sizes, a multi-size ICO, web manifest and HTML tags. Keeps image proportions with transparent padding.</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isProcessing || Object.keys(previews).length !== FAVICON_SIZES.length}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <FileArchive className="w-4 h-4" /> Download All as ZIP
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {FAVICON_SIZES.map((spec) => (
                <div key={spec.filename} className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center space-y-3 text-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-300 dark:border-slate-700">
                    {previews[spec.filename] && (
                      <img src={previews[spec.filename]} alt={spec.label} className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{spec.filename}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{spec.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">Upload the ZIP contents to your website root, add the tags to your HTML head, and edit the app name in site.webmanifest.</p>
            {/* HTML Code Snippet Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-400" /> HTML &lt;head&gt; Integration Code
                </span>
                <button
                  type="button"
                  onClick={copyHtmlSnippet}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedHtml ? 'Copied Snippet' : 'Copy HTML'}
                </button>
              </div>

              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-slate-900/80 rounded-xl leading-relaxed">
                {htmlHeadSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
