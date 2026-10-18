import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Share2, ArrowRightLeft, Scissors, Layers, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import {decodeBrowserImage} from '../../lib/browserImageDecode';
import {encodeCanvasBlob} from '../../lib/canvasEncoding';
import {MAX_RESIZE_EDGE,MAX_RESIZE_PIXELS} from '../../lib/imageResize';
import {alphaContentBounds,splitImageRectangles,combinedImageLayout,combineRatioAtPosition,ImageRectangle} from '../../lib/imageSplitCombine';
import { useLanguage } from '../../context/LanguageContext';

interface ImageSplitterMergerToolProps {
  onShowToast: (msg: string) => void;
}

export const ImageSplitterMergerTool: React.FC<ImageSplitterMergerToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();

  // Mode: 'split' | 'combine'
  const [activeTab, setActiveTab] = useState<'split' | 'combine'>('split');
  
  // Options
  const [trimPadding, setTrimPadding] = useState<boolean>(true);

  // --- SPLIT MODE STATE ---
  const [splitImg, setSplitImg] = useState<HTMLImageElement | null>(null);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitOrientation, setSplitOrientation] = useState<'v' | 'h'>('v');
  const [splitPct, setSplitPct] = useState<number>(50);
  const splitInputRef = useRef<HTMLInputElement>(null);
  const splitCanvasRef = useRef<HTMLCanvasElement>(null);
  const [splitImgTrim, setSplitImgTrim] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // --- COMBINE MODE STATE ---
  const [imgA, setImgA] = useState<HTMLImageElement | null>(null);
  const [imgB, setImgB] = useState<HTMLImageElement | null>(null);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [combineOrientation, setCombineOrientation] = useState<'v' | 'h'>('v');
  const [combinePct, setCombinePct] = useState<number>(50);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const combineCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const [error,setError] = useState('');
  const [exporting,setExporting] = useState(false);
  const loads = useRef({split:0,a:0,b:0});
  const sourceUrls = useRef({split:'',a:'',b:''});
  const trims = useRef(new WeakMap<HTMLImageElement,ImageRectangle>());
  const exportKey=JSON.stringify([activeTab,trimPadding,splitImg?.src,splitPct,splitOrientation,imgA?.src,imgB?.src,combinePct,combineOrientation]);
  const exportRef=useRef(exportKey);exportRef.current=exportKey;
  const alive=useRef(true);
  useEffect(()=>setCopied(false),[exportKey]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;loads.current.split++;loads.current.a++;loads.current.b++;Object.values(sourceUrls.current).forEach(url=>{if(url) URL.revokeObjectURL(url);});};},[]);
  const computeTrim = useCallback((img:HTMLImageElement):ImageRectangle => {
    const cached=trims.current.get(img);if(cached) return cached;
    if(img.naturalWidth>MAX_RESIZE_EDGE || img.naturalHeight>MAX_RESIZE_EDGE || img.naturalWidth*img.naturalHeight>MAX_RESIZE_PIXELS) throw new Error('Choose images up to 16,384 px per side and 40 megapixels.');
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not inspect image padding. Try a smaller image.');
    ctx.drawImage(img,0,0);
    const result=alphaContentBounds(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
    trims.current.set(img,result);return result;
  },[]);
  const selectImage = async (file:File,slot:'split'|'a'|'b') => {
    const run=++loads.current[slot];setError('');
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(file);temporaryUrl=decoded.url;
      const trim=computeTrim(decoded.image);
      if(run!==loads.current[slot] || !alive.current) return;
      if(sourceUrls.current[slot]) URL.revokeObjectURL(sourceUrls.current[slot]);
      sourceUrls.current[slot]=decoded.url;temporaryUrl=undefined;
      if(slot==='split') {setSplitImg(decoded.image);setSplitFile(file);setSplitImgTrim(trim);}
      if(slot==='a') {setImgA(decoded.image);setFileA(file);}
      if(slot==='b') {setImgB(decoded.image);setFileB(file);}
      onShowToast('Image loaded successfully');
    } catch(failure) {
      if(run===loads.current[slot] && alive.current) setError(failure instanceof Error?failure.message:'Could not open this image.');
    } finally {if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);}
  };
  const saveBlob = (blob:Blob,name:string) => {
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.download=name;link.href=url;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const runExport = async (work:(current:()=>boolean)=>Promise<void>) => {
    if(exporting) return;
    const key=exportKey,current=()=>alive.current && key===exportRef.current;
    setExporting(true);setError('');
    try {await work(current);} catch(failure) {if(current()) setError(failure instanceof Error?failure.message:'Could not export this image.');}
    finally {if(alive.current) setExporting(false);}
  };

  const getRect = useCallback((img: HTMLImageElement, cachedTrim: { x: number; y: number; w: number; h: number } | null) => {
    if (trimPadding) {
      if (cachedTrim) return cachedTrim;
      return computeTrim(img);
    }
    return { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  }, [trimPadding, computeTrim]);

  // --- DRAW SPLIT CANVAS ---
  const drawSplit = useCallback(() => {
    if (!splitImg || !splitCanvasRef.current) return;
    const canvas = splitCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = getRect(splitImg, splitImgTrim);
    const MAXDIM = 1200;
    const scale = Math.min(1, MAXDIM / Math.max(r.w, r.h));
    const cw = Math.max(1,Math.round(r.w * scale));
    const ch = Math.max(1,Math.round(r.h * scale));

    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(splitImg, r.x, r.y, r.w, r.h, 0, 0, cw, ch);

    // Draw handle line
    ctx.save();
    ctx.strokeStyle = '#ff5a6e';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255,90,110,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    let handleX = 0, handleY = 0;
    if (splitOrientation === 'v') {
      const x = Math.round((cw * splitPct) / 100);
      ctx.moveTo(x, 0); ctx.lineTo(x, ch);
      handleX = x; handleY = ch / 2;
    } else {
      const y = Math.round((ch * splitPct) / 100);
      ctx.moveTo(0, y); ctx.lineTo(cw, y);
      handleX = cw / 2; handleY = y;
    }
    ctx.stroke();

    // Circle handle
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(handleX, handleY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff5a6e';
    ctx.beginPath(); ctx.arc(handleX, handleY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }, [splitImg, splitImgTrim, splitOrientation, splitPct, getRect]);

  useEffect(() => {
    if (activeTab === 'split') {try {drawSplit();setError('');} catch(failure) {setError(failure instanceof Error?failure.message:'Could not draw split preview.');}}
  }, [activeTab, drawSplit]);

  // --- SPLIT CANVAS DRAG HANDLER ---
  const isDraggingSplit = useRef(false);
  const handleSplitPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingSplit.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromPointer(e);
  };
  const handleSplitPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingSplit.current) updateSplitFromPointer(e);
  };
  const handleSplitPointerUp = () => { isDraggingSplit.current = false; };

  const updateSplitFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!splitCanvasRef.current) return;
    const rect = splitCanvasRef.current.getBoundingClientRect();
    let pct = 50;
    if (splitOrientation === 'v') {
      pct = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      pct = ((e.clientY - rect.top) / rect.height) * 100;
    }
    setSplitPct(Math.min(95, Math.max(5, Math.round(pct))));
  };

  // --- BUILD SPLIT PARTS FOR EXPORT ---
  const buildSplitParts = () => {
    if (!splitImg) return null;
    const r = getRect(splitImg, splitImgTrim);
    const parts=splitImageRectangles(r,splitPct,splitOrientation).map(rect=>{
      const canvas=document.createElement('canvas');canvas.width=rect.w;canvas.height=rect.h;
      const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create split canvas.');
      ctx.drawImage(splitImg,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);return canvas;
    });
    return {cA:parts[0],cB:parts[1]};
  };
  const splitBlobs = async () => {
    const parts=buildSplitParts();if(!parts) throw new Error('Select an image first.');
    return [await encodeCanvasBlob(parts.cA,'image/png'),await encodeCanvasBlob(parts.cB,'image/png')];
  };
  const saveSplitZip = async (blobs:Blob[],current:()=>boolean) => {
    const zip=new JSZip();zip.file('split-part-a.png',blobs[0]);zip.file('split-part-b.png',blobs[1]);
    const blob=await zip.generateAsync({type:'blob'});if(current()) {saveBlob(blob,'split-parts.zip');onShowToast('Both split parts saved in one ZIP.');}
  };
  const downloadSplitBoth = () => runExport(async current=>{const blobs=await splitBlobs();if(current()) await saveSplitZip(blobs,current);});
  const shareSplitBoth = () => runExport(async current=>{
    const blobs=await splitBlobs();if(!current()) return;
    const files=blobs.map((blob,index)=>new File([blob],`split-part-${index?'b':'a'}.png`,{type:'image/png'}));
    if(navigator.canShare?.({files})) {
      try {await navigator.share({files,title:'Split Parts from Zubware'});return;}
      catch(failure) {if(failure instanceof DOMException && failure.name==='AbortError') return;}
    }
    if(current()) await saveSplitZip(blobs,current);
  });

  // --- COMBINE MODE CALCULATIONS & DRAWING ---
  const combineLayout = useCallback(() => {
    if (!imgA || !imgB) return null;
    return combinedImageLayout(getRect(imgA,null),getRect(imgB,null),combinePct,combineOrientation);
  }, [imgA, imgB, combinePct, combineOrientation, getRect]);

  const drawCombine = useCallback(() => {
    if (!combineCanvasRef.current || !imgA || !imgB) return;
    const canvas = combineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const L = combineLayout();
    if (!L) return;

    const scale=Math.min(1,1200/Math.max(L.totalW,L.totalH));
    canvas.width = Math.max(1,Math.round(L.totalW*scale));
    canvas.height = Math.max(1,Math.round(L.totalH*scale));
    ctx.scale(canvas.width/L.totalW,canvas.height/L.totalH);
    ctx.clearRect(0, 0, L.totalW, L.totalH);
    ctx.drawImage(imgA, ...L.aSrc, ...L.aDst);
    ctx.drawImage(imgB, ...L.bSrc, ...L.bDst);

    // Seam line
    ctx.save();
    ctx.strokeStyle = '#ffab00';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255,171,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    if (L.orient === 'v') {
      ctx.moveTo(L.seamPos, 0); ctx.lineTo(L.seamPos, L.totalH);
    } else {
      ctx.moveTo(0, L.seamPos); ctx.lineTo(L.totalW, L.seamPos);
    }
    ctx.stroke();

    // Handle
    const handleX = L.orient === 'v' ? L.seamPos : L.totalW / 2;
    const handleY = L.orient === 'v' ? L.totalH / 2 : L.seamPos;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(handleX, handleY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffab00';
    ctx.beginPath(); ctx.arc(handleX, handleY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }, [combineLayout, imgA, imgB]);

  useEffect(() => {
    if (activeTab === 'combine') {try {drawCombine();setError('');} catch(failure) {setError(failure instanceof Error?failure.message:'Could not draw combined preview.');}}
  }, [activeTab, drawCombine]);

  // COMBINE POINTER DRAG
  const isDraggingCombine = useRef(false);
  const handleCombinePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingCombine.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateCombineFromPointer(e);
  };
  const handleCombinePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingCombine.current) updateCombineFromPointer(e);
  };
  const handleCombinePointerUp = () => { isDraggingCombine.current = false; };

  const updateCombineFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!combineCanvasRef.current) return;
    const rect = combineCanvasRef.current.getBoundingClientRect();
    let pct = 50;
    if (combineOrientation === 'v') {
      pct = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      pct = ((e.clientY - rect.top) / rect.height) * 100;
    }
    if(imgA && imgB) pct=combineRatioAtPosition(getRect(imgA,null),getRect(imgB,null),pct/100,combineOrientation);
    setCombinePct(Math.min(95, Math.max(5, Math.round(pct))));
  };

  const combinedBlob = async () => {
    const layout=combineLayout();if(!layout || !imgA || !imgB) throw new Error('Choose both images first.');
    const canvas=document.createElement('canvas');canvas.width=layout.totalW;canvas.height=layout.totalH;
    const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Could not create combined canvas.');
    ctx.drawImage(imgA,...layout.aSrc,...layout.aDst);ctx.drawImage(imgB,...layout.bSrc,...layout.bDst);
    return encodeCanvasBlob(canvas,'image/png');
  };
  const downloadCombinedImage = () => runExport(async current=>{const blob=await combinedBlob();if(current()) {saveBlob(blob,'combined-image.png');onShowToast('Combined image saved!');}});
  const copyCombinedToClipboard = () => runExport(async current=>{
    const blob=await combinedBlob();if(!current()) return;
    try {await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);if(current()) {setCopied(true);onShowToast(t('copiedToClipboard','Copied to Clipboard'));}}
    catch {if(current()) {saveBlob(blob,'combined-image.png');onShowToast('Clipboard unavailable; image downloaded.');}}
  });

  const swapImages = () => {
    loads.current.a++;loads.current.b++;
    [sourceUrls.current.a,sourceUrls.current.b]=[sourceUrls.current.b,sourceUrls.current.a];
    const tempImg = imgA;
    setImgA(imgB);
    setImgB(tempImg);

    const tempFile = fileA;
    setFileA(fileB);
    setFileB(tempFile);

    onShowToast('Swapped Image A and Image B');
  };

  const handleReset = () => {
    loads.current.split++;loads.current.a++;loads.current.b++;
    Object.values(sourceUrls.current).forEach(url=>{if(url) URL.revokeObjectURL(url);});sourceUrls.current={split:'',a:'',b:''};
    setError('');setCopied(false);setSplitPct(50);setCombinePct(50);setSplitOrientation('v');setCombineOrientation('v');
    setSplitImg(null);
    setSplitFile(null);
    setSplitImgTrim(null);
    setImgA(null);
    setImgB(null);
    setFileA(null);
    setFileB(null);
    if (splitInputRef.current) splitInputRef.current.value = '';
    if (inputARef.current) inputARef.current.value = '';
    if (inputBRef.current) inputBRef.current.value = '';
    onShowToast('Reset image splitter tool');
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 glass-panel rounded-3xl p-5 sm:p-7 shadow-xl transition-all">
      
      {error && <p role="alert" className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">{error}</p>}
      {/* Header bar */}
      <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10 rounded-2xl glass-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Image Splitter & Combiner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('fastBrowserBased', 'Fast, browser-based, zero installation required')}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 glass-btn text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> {t('resetAll', 'Reset All')}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <p className="text-xs text-slate-500">Preview handles and guide lines are excluded from downloads. Combined output keeps the smaller input's shared dimension; previews fit within 1,200 pixels. Split parts retain their source pixels. Animated inputs export a still frame.</p>
        {/* Global Option */}
        <div className="flex items-center justify-between p-4 rounded-2xl glass-card text-xs sm:text-sm">
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-bold">{t('autoTrimPadding', 'Auto-trim padding:')}</strong> {t('ignoreEmptyMargin', 'Ignore empty transparent canvas margin')}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              aria-label="Auto-trim transparent padding"
              checked={trimPadding}
              onChange={(e) => setTrimPadding(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200/80 peer-focus:outline-none rounded-full peer dark:bg-slate-700/80 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl glass-card font-semibold text-xs sm:text-sm relative">
          <button
            onClick={() => setActiveTab('split')}
            className={`relative flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors cursor-pointer z-10 ${
              activeTab === 'split' ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'split' && (
              <motion.div
                layoutId="heroTabIndicator"
                className="absolute inset-0 bg-indigo-600 rounded-xl shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Scissors className="w-4 h-4" /> {t('splitImage', 'Split Image')}
          </button>

          <button
            onClick={() => setActiveTab('combine')}
            className={`relative flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors cursor-pointer z-10 ${
              activeTab === 'combine' ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'combine' && (
              <motion.div
                layoutId="heroTabIndicator"
                className="absolute inset-0 bg-indigo-600 rounded-xl shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Layers className="w-4 h-4" /> {t('combineImages', 'Combine Images')}
          </button>
        </div>

        {/* TAB 1: SPLIT MODE */}
        <AnimatePresence mode="wait">
          {activeTab === 'split' && (
            <motion.div
              key="split-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
            {!splitImg ? (
              <div
                onClick={() => splitInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={e=>{e.preventDefault();const file=e.dataTransfer.files?.[0];if(file) void selectImage(file,'split');}}
                className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/50 rounded-3xl glass-card hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer text-center group"
              >
                <div className="w-16 h-16 bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/50 dark:border-white/10">
                  <svg width="32" height="32" fill="none" stroke="#6366F1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p className="text-base font-bold text-slate-700 dark:text-slate-200">{t('dropFileHere', 'Drop your file here or tap to upload')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('supportsFormats', 'Supports PNG, JPG, WebP, GIF, BMP')}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    splitInputRef.current?.click();
                  }}
                  className="mt-5 px-6 py-2 glass-btn rounded-full text-xs font-semibold shadow-sm text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {t('browseFiles', 'Browse Files')}
                </button>
                <input
                  ref={splitInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Split source image"
                  onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file) void selectImage(file,'split');}}
                />
              </div>
            ) : (
              <>
                {/* File Info Badge */}
                {splitFile && (
                  <div className="flex items-center justify-between p-3 rounded-2xl glass-card text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <span className="truncate max-w-[240px] sm:max-w-xs">📷 {splitFile.name}</span>
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full text-[11px] shadow-xs">
                      Size: {formatSize(splitFile.size)}
                    </span>
                  </div>
                )}

                {/* Orientation Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSplitOrientation('v')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      splitOrientation === 'v'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'glass-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t('verticalSplit', 'Vertical Split')}
                  </button>
                  <button
                    onClick={() => setSplitOrientation('h')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      splitOrientation === 'h'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'glass-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t('horizontalSplit', 'Horizontal Split')}
                  </button>
                </div>

                {/* Canvas Preview Container */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 p-2 flex items-center justify-center min-h-[240px]">
                  <canvas
                    ref={splitCanvasRef}
                    onPointerDown={handleSplitPointerDown}
                    onPointerMove={handleSplitPointerMove}
                    onPointerUp={handleSplitPointerUp}
                    className="max-h-[50vh] w-auto max-w-full cursor-grab active:cursor-grabbing rounded-lg object-contain touch-none"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-slate-700 shadow-lg">
                    {t('dragLineSplit', 'Drag line on canvas to adjust split location')}
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>{t('partA', 'Part A')}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{splitPct}%</span>
                    <span>{t('partB', 'Part B')}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    aria-label="Split position"
                    value={splitPct}
                    onChange={(e) => setSplitPct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex gap-2">
                    {[25, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setSplitPct(pct)}
                        className="flex-1 py-1.5 rounded-lg glass-btn text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={downloadSplitBoth}
                    disabled={exporting}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> {t('downloadPartsZip', 'Download Parts ZIP')}
                  </button>
                  <button
                    onClick={shareSplitBoth}
                    disabled={exporting}
                    className="flex items-center justify-center gap-2 py-3 px-4 glass-btn text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" /> {t('shareBothParts', 'Share Both Parts')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* TAB 2: COMBINE MODE */}
        {activeTab === 'combine' && (
          <motion.div
            key="combine-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Two Input Slots */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
              {/* Slot A */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('imageA', 'Image A')}
                  </span>
                  {fileA && (
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {formatSize(fileA.size)}
                    </span>
                  )}
                </div>
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/50 rounded-2xl hover:border-indigo-400 cursor-pointer glass-card overflow-hidden text-center p-2 relative">
                  {imgA ? (
                    <img src={imgA.src} alt="Thumb A" className="h-full w-full object-contain" />
                  ) : (
                    <>
                      <span className="text-xl">🅰️</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{t('selectA', 'Select A')}</span>
                    </>
                  )}
                  <input
                    ref={inputARef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  aria-label="Image A"
                  onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file) void selectImage(file,'a');}}
                  />
                </label>
              </div>

              {/* Swap Button */}
              <div className="pt-5">
                <button
                  onClick={swapImages}
                  disabled={!imgA && !imgB}
                  title="Swap Image A and Image B"
                  className="p-3 rounded-full glass-btn text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Slot B */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('imageB', 'Image B')}
                  </span>
                  {fileB && (
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {formatSize(fileB.size)}
                    </span>
                  )}
                </div>
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/50 rounded-2xl hover:border-indigo-400 cursor-pointer glass-card overflow-hidden text-center p-2 relative">
                  {imgB ? (
                    <img src={imgB.src} alt="Thumb B" className="h-full w-full object-contain" />
                  ) : (
                    <>
                      <span className="text-xl">🅱️</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{t('selectB', 'Select B')}</span>
                    </>
                  )}
                  <input
                    ref={inputBRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  aria-label="Image B"
                  onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file) void selectImage(file,'b');}}
                  />
                </label>
              </div>
            </div>

            {(fileA || fileB) && (
              <div className="p-3 rounded-2xl glass-card text-xs font-bold text-indigo-900 dark:text-indigo-200 text-center">
                📊 Total Selected Input File Size: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatSize((fileA?.size || 0) + (fileB?.size || 0))}</strong>
              </div>
            )}

            {/* If both images loaded */}
            {imgA && imgB ? (
              <>
                {/* Orientation buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCombineOrientation('v')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      combineOrientation === 'v'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'glass-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t('sideBySide', 'Side-by-Side (Left / Right)')}
                  </button>
                  <button
                    onClick={() => setCombineOrientation('h')}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      combineOrientation === 'h'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'glass-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t('stackedTopBottom', 'Stacked (Top / Bottom)')}
                  </button>
                </div>

                {/* Canvas Preview */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 p-2 flex items-center justify-center min-h-[240px]">
                  <canvas
                    ref={combineCanvasRef}
                    onPointerDown={handleCombinePointerDown}
                    onPointerMove={handleCombinePointerMove}
                    onPointerUp={handleCombinePointerUp}
                    className="max-h-[50vh] w-auto max-w-full cursor-grab active:cursor-grabbing rounded-lg object-contain touch-none"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-slate-700 shadow-lg">
                    {t('dragSeamRatio', 'Drag seam on canvas to adjust ratio')}
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>More Image A</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{combinePct}%</span>
                    <span>More Image B</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    aria-label="Combine ratio"
                    value={combinePct}
                    onChange={(e) => setCombinePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex gap-2">
                    {[25, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setCombinePct(pct)}
                        className="flex-1 py-1.5 rounded-lg glass-btn text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={downloadCombinedImage}
                    disabled={exporting}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> {t('saveCombinedImage', 'Save Combined Image')}
                  </button>
                  <button
                    onClick={copyCombinedToClipboard}
                    disabled={exporting}
                    className="flex items-center justify-center gap-2 py-3 px-4 glass-btn text-slate-900 dark:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? t('copiedToClipboard', 'Copied to Clipboard') : t('copyToClipboard', 'Copy to Clipboard')}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-4">
                Add both Image A and Image B above to generate live combined preview.
              </p>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};
