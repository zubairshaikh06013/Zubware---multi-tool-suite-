import { encodeCanvasBlob } from '../../../lib/canvasEncoding';
import { imageExportExtension } from '../../../lib/imageExport';
import { imageResizeDimensions } from '../../../lib/imageResize';
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { 
  Download, 
  Trash2, 
  Upload, 
  Lock, 
  Unlock, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Image as ImageIcon,
  FileArchive,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { formatDecimalBytes, encodeBmpFromImageData } from '../../../lib/fileSizeStandard';

const formatBytes = (b: number) => formatDecimalBytes(b);

interface ResizePreset {
  name: string;
  category: string;
  width: number;
  height: number;
}

const PRESETS: ResizePreset[] = [
  // Generic application-photo dimensions; always verify the specific form's requirements.
  { name: 'Application Photo Portrait (3:4)', category: 'India Forms', width: 300, height: 400 },
  { name: 'Application Photo Portrait (3.5:4.5)', category: 'India Forms', width: 350, height: 450 },
  { name: 'Application Photo Square (1:1)', category: 'India Forms', width: 400, height: 400 },
  { name: 'Application Photo (200×230)', category: 'India Forms', width: 200, height: 230 },
  { name: 'Application Photo (100×120)', category: 'India Forms', width: 100, height: 120 },
  { name: 'Instagram Square (1:1)', category: 'Social', width: 1080, height: 1080 },
  { name: 'Instagram Story / Reel (9:16)', category: 'Social', width: 1080, height: 1920 },
  { name: 'Instagram Portrait (4:5)', category: 'Social', width: 1080, height: 1350 },
  { name: 'YouTube Thumbnail (16:9)', category: 'Video', width: 1280, height: 720 },
  { name: 'YouTube Channel Banner', category: 'Video', width: 2560, height: 1440 },
  { name: 'LinkedIn Post Header', category: 'Social', width: 1200, height: 627 },
  { name: 'X / Twitter Post Image', category: 'Social', width: 1200, height: 675 },
  { name: 'Facebook Feed Post', category: 'Social', width: 1200, height: 630 },
  { name: 'Full HD (1080p)', category: 'Display', width: 1920, height: 1080 },
  { name: 'Ultra HD (4K)', category: 'Display', width: 3840, height: 2160 },
  { name: 'HD Standard (720p)', category: 'Display', width: 1280, height: 720 },
  { name: 'Website Favicon / Icon', category: 'Web', width: 512, height: 512 }
];

interface ResizedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  origW: number;
  origH: number;
  targetW: number;
  targetH: number;
  resizedBlob: Blob | null;
  resizedSize?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

interface ImageResizerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const ImageResizerTool: React.FC<ImageResizerToolProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<ResizedFileItem[]>([]);
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage' | 'preset'>('dimensions');
  const [width, setWidth] = useState<number>(1200);
  const [height, setHeight] = useState<number>(800);
  const [percentage, setPercentage] = useState<number>(50);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [activeAspect, setActiveAspect] = useState<number>(1.5);
  
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp'>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [targetKb, setTargetKb] = useState<number>(0);
  const [indiaFormsOnly, setIndiaFormsOnly] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const processingRef = useRef(false);
  const runRef = useRef(0);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(() => () => {
    runRef.current++;
    itemsRef.current.forEach(item => URL.revokeObjectURL(item.previewUrl));
  }, []);
  useEffect(() => {
    setItems(previous => previous.map(item => ({...item, status:'idle', resizedBlob:null, resizedSize:undefined, errorMessage:undefined})));
  }, [resizeMode, width, height, percentage, lockAspect, exportFormat, quality, targetKb]);

  const handleFilesAdded = async (files: File[]) => {
    if (processingRef.current) return;
    const importRun = runRef.current;
    // Restrict uploads to formats supported by browser canvas decoding.
    const validFiles = Array.from(files).filter(f => ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'].includes(f.type));
    const rejected = files.length - validFiles.length;
    if (validFiles.length === 0) {
      onShowToast('Please select JPG, PNG, WebP, BMP or GIF images.');
      return;
    }

    const loaded: ResizedFileItem[] = [];
    for (const file of validFiles) {
      const previewUrl = URL.createObjectURL(file);
      const dims = await new Promise<{ w: number; h: number } | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => resolve(null);
        img.src = previewUrl;
      });

      if (!dims || !dims.w || !dims.h) {
        URL.revokeObjectURL(previewUrl);
        continue;
      }
      loaded.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl,
        origW: dims.w,
        origH: dims.h,
        targetW: dims.w,
        targetH: dims.h,
        resizedBlob: null,
        status: 'idle'
      });
    }

    if (importRun !== runRef.current || processingRef.current) {
      loaded.forEach(item => URL.revokeObjectURL(item.previewUrl));
      return;
    }
    if (loaded.length === 0) {
      onShowToast('These images could not be decoded. Try JPG, PNG, or WebP.');
      return;
    }
    // Preserve dimensions chosen before upload, especially India form presets.
    if (items.length === 0 && loaded.length > 0 && resizeMode === 'dimensions' && width === 1200 && height === 800) {
      const first = loaded[0];
      setWidth(first.origW);
      setHeight(first.origH);
      setActiveAspect(first.origW / (first.origH || 1));
    }

    setItems(prev => [...prev, ...loaded]);
    onShowToast(`Added ${loaded.length} image(s)${rejected || loaded.length < validFiles.length ? `; skipped ${files.length - loaded.length} unreadable or unsupported file(s)` : ''}.`);
  };

  // Paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardFiles: File[] = [];
      if (e.clipboardData?.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) clipboardFiles.push(file);
          }
        }
      }
      if (clipboardFiles.length > 0) {
        handleFilesAdded(clipboardFiles);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [items.length]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && activeAspect > 0) {
      setHeight(Math.max(1, Math.round(val / activeAspect)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && activeAspect > 0) {
      setWidth(Math.max(1, Math.round(val * activeAspect)));
    }
  };

  const applyPreset = (preset: ResizePreset) => {
    setResizeMode('preset');
    setWidth(preset.width);
    setHeight(preset.height);
    setActiveAspect(preset.width / preset.height);
    onShowToast(`Applied preset: ${preset.name} (${preset.width}×${preset.height})`);
  };

  const resizeSingle = async (item: ResizedFileItem): Promise<ResizedFileItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const dimensions = imageResizeDimensions(item.origW, item.origH, {
            mode:resizeMode, width, height, percentage, preserveBatchAspect:resizeMode !== 'preset' && items.length > 1 && lockAspect,
          });
          const finalW = dimensions.width;
          const finalH = dimensions.height;

          const canvas = document.createElement('canvas');
          canvas.width = finalW;
          canvas.height = finalH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ ...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:'This image could not be resized. Try smaller dimensions.' });
            return;
          }

          // Clean high quality image scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Background for jpeg
          if (exportFormat === 'image/jpeg' || exportFormat === 'image/bmp') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, finalW, finalH);
          }

          ctx.drawImage(img, 0, 0, finalW, finalH);

          if (exportFormat === 'image/bmp') {
            try {
              const imgData = ctx.getImageData(0, 0, finalW, finalH);
              const bmpBytes = encodeBmpFromImageData(imgData);
              const bmpBlob = new Blob([bmpBytes], { type: 'image/bmp' });
              if (targetKb > 0 && bmpBlob.size > targetKb * 1000) {
                resolve({...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:`BMP exceeds ${targetKb} KB. Select JPEG/WebP or smaller dimensions.`});
                return;
              }
              resolve({
                ...item,
                targetW: finalW,
                targetH: finalH,
                resizedBlob: bmpBlob,
                resizedSize: bmpBlob.size,
                status: 'done'
              });
              return;
            } catch {
              resolve({ ...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:'This image could not be resized. Try smaller dimensions.' });
              return;
            }
          }

          const expQuality = (exportFormat === 'image/jpeg' || exportFormat === 'image/webp') ? quality / 100 : undefined;

          let blob = await encodeCanvasBlob(canvas, exportFormat, expQuality);
          if (targetKb > 0 && (exportFormat === 'image/jpeg' || exportFormat === 'image/webp')) {
            const limit = targetKb * 1000;
            if (blob.size > limit) {
              let smallest = blob;
              let low = 0.05;
              let high = Math.min(1, quality / 100);
              for (let attempt = 0; attempt < 9; attempt++) {
                const midpoint = (low + high) / 2;
                const candidate = await encodeCanvasBlob(canvas, exportFormat, midpoint);
                if (candidate.size < smallest.size) smallest = candidate;
                if (candidate.size <= limit) {
                  blob = candidate;
                  low = midpoint;
                } else {
                  high = midpoint;
                }
              }
              if (blob.size > limit) blob = smallest;
            }
            if (blob.size > limit) {
              resolve({...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:`Cannot reach ${targetKb} KB at these dimensions. Try smaller width/height.`});
              return;
            }
          }
          // Enforce the selected limit for every output format, including PNG/BMP.
          if (targetKb > 0 && blob.size > targetKb * 1000) {
            resolve({...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:`Output exceeds ${targetKb} KB. Select JPEG/WebP or smaller dimensions.`});
            return;
          }
          resolve({...item, targetW:finalW, targetH:finalH, resizedBlob:blob, resizedSize:blob.size, status:'done', errorMessage:undefined});
        } catch (error) {
          resolve({...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:error instanceof Error ? error.message : 'Resize failed. Try smaller dimensions.'});
        }
      };
      img.onerror = () => resolve({...item, resizedBlob:null, resizedSize:undefined, status:'error', errorMessage:'Image could not be decoded. Please select it again.'});
      img.src = item.previewUrl;
    });
  };

  const resizeAll = async (onlyId?: string) => {
    if (items.length === 0 || processingRef.current) return;
    processingRef.current = true;
    const run = ++runRef.current;
    setIsProcessing(true);
    const jobs = items.filter(item => !onlyId || item.id === onlyId).map(item => ({...item, resizedBlob:null, resizedSize:undefined, errorMessage:undefined, status:'processing' as const}));
    setItems(previous => previous.map(item => jobs.find(job => job.id === item.id) || item));
    let done = 0;
    try {
      for (const item of jobs) {
        const result = await resizeSingle(item).catch(error => ({...item, resizedBlob:null, resizedSize:undefined, status:'error' as const, errorMessage:error instanceof Error ? error.message : 'Resize failed.'}));
        if (run !== runRef.current) return;
        if (result.status === 'done') done++;
        setItems(previous => previous.map(existing => existing.id === result.id ? result : existing));
      }
      onShowToast(`${done} image(s) resized${done < jobs.length ? `; ${jobs.length - done} failed. Check the queue.` : '.'}`);
    } finally {
      processingRef.current = false;
      if (run === runRef.current) setIsProcessing(false);
    }
  };

  const downloadSingle = (item: ResizedFileItem) => {
    if (!item.resizedBlob) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const ext = imageExportExtension(item.resizedBlob.type);
    const url = URL.createObjectURL(item.resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-resized-${item.targetW}x${item.targetH}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadAllZip = async () => {
    if (processingRef.current) return;
    const ready = items.filter(i => i.status === 'done' && i.resizedBlob);
    if (ready.length === 0) {
      onShowToast('Please resize images first.');
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      ready.forEach((item, idx) => {
        const ext = imageExportExtension(item.resizedBlob!.type);
        const baseName = item.file.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}-resized-${item.targetW}x${item.targetH}-${idx + 1}.${ext}`, item.resizedBlob!);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zubware-resized-images-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      onShowToast('Downloaded all resized images in ZIP!');
    } catch {
      onShowToast('Could not create the ZIP. Try downloading images individually.');
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };

  const removeItem = (id: string) => {
    if (processingRef.current) return;
    const item = items.find(item => item.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
    if (processingRef.current) return;
    items.forEach(i => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    onShowToast('Queue cleared.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {items.length > 0 && (
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {items.length} image{items.length > 1 ? 's' : ''} in queue
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resizeAll()}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Processing...' : 'Resize All Images'}</span>
            </button>
            <button
              onClick={clearAll}
              disabled={isProcessing}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Control Settings Bar */}
      <fieldset disabled={isProcessing} className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setResizeMode('dimensions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                resizeMode === 'dimensions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Exact Dimensions (px)
            </button>
            <button
              onClick={() => setResizeMode('percentage')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                resizeMode === 'percentage' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Percentage (%)
            </button>
            <button
              onClick={() => setResizeMode('preset')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                resizeMode === 'preset' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              India Forms & Social Presets
            </button>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Browser Processing</span>
          </span>
        </div>

        {/* India application form size limits (decimal KB). */}
        <div className="space-y-2">
          <label htmlFor="photo-target-kb" className="block text-xs font-bold text-slate-600 dark:text-slate-300">
            Maximum Photo File Size (KB) — Optional
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input id="photo-target-kb" type="number" min="0" max="5000" step="1"
              value={targetKb || ''}
              placeholder="No limit"
              onChange={(e) => {
                const kb = Math.max(0, Math.min(5000, Math.floor(Number(e.target.value) || 0)));
                setTargetKb(kb);
                if (kb > 0 && exportFormat !== 'image/jpeg' && exportFormat !== 'image/webp') setExportFormat('image/jpeg');
              }}
              className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            />
            {[20, 50, 100, 200, 500].map(kb => (
              <button type="button" key={kb} onClick={() => {
                setTargetKb(kb);
                if (exportFormat !== 'image/jpeg' && exportFormat !== 'image/webp') setExportFormat('image/jpeg');
              }} className={`px-3 py-2 rounded-lg text-xs font-bold ${targetKb === kb ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {kb} KB
              </button>
            ))}
            <button type="button" onClick={() => setTargetKb(0)} className="text-xs underline text-slate-500">Clear</button>
          </div>
          <p className="text-xs text-slate-500">Uses JPEG/WebP quality adjustment. If the selected dimensions cannot fit under the limit, the tool shows an error instead of downloading an oversized image. Check your application form's official size and format rules.</p>
        </div>

        {/* Mode-Specific Controls */}
        {resizeMode === 'dimensions' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="resize-width" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Width (px)</label>
              <input
                type="number"
                id="resize-width" min="1" max="16384" step="1"
                value={width}
                onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label htmlFor="resize-height" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Height (px)</label>
              <input
                type="number"
                id="resize-height" min="1" max="16384" step="1"
                value={height}
                onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  lockAspect
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lockAspect ? <Lock className="w-4 h-4 text-indigo-500" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Free'}</span>
              </button>
            </div>
          </div>
        )}

        {resizeMode === 'percentage' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <span>Scale Factor</span>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm">{percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {[25, 50, 75, 100, 150, 200].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setPercentage(pct)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    percentage === pct ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        )}

        {resizeMode === 'preset' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Preset Dimensions
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              <input type="checkbox" checked={indiaFormsOnly} onChange={(e) => setIndiaFormsOnly(e.target.checked)} />
              Show India application photo sizes only
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {(indiaFormsOnly ? PRESETS.filter(p => p.category === 'India Forms') : PRESETS).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    width === preset.width && height === preset.height
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{preset.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{preset.width} × {preset.height} px</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <section aria-label="Indian application photo guide" className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 p-4 space-y-2">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Photo Resize for Indian Application Forms — How to Use</h3>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li>Read your application's official notification for exact pixel dimensions, file size and JPG/PNG format.</li>
            <li>Select an India Forms preset above, or choose Exact Dimensions and enter the required width and height.</li>
            <li>Set Maximum Photo File Size to your form's KB limit; select JPG for forms that require JPEG.</li>
            <li>Upload your photo, click Resize All Images, and verify the resulting dimensions and KB before downloading.</li>
          </ol>
          <p className="text-xs text-amber-800 dark:text-amber-300">Presets are examples, not guaranteed SSC, UPSC, IBPS or other official requirements. Some applications require live camera capture instead of a resized upload. Stretching a photo to different proportions may distort the face.</p>
        </section>

        {/* Export format & quality controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Output Format
            </label>
            <select
              aria-label="Output Format"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="image/webp">WebP (Recommended)</option>
              <option value="image/png">PNG (Lossless)</option>
              <option value="image/jpeg">JPG / JPEG (Standard Photo)</option>
              <option value="image/bmp">BMP (Uncompressed)</option>
            </select>
          </div>

          {(exportFormat === 'image/jpeg' || exportFormat === 'image/webp') && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <span>Output Quality</span>
                <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Output limit: 16,384 pixels per side and 40 megapixels. Change settings and resize again to create a new download.</p>
      </fieldset>

      <section aria-label="Popular photo resize shortcuts" className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white/80 dark:bg-slate-900/70 p-4 space-y-3">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Popular Photo Resize Tasks - 20KB, 50KB, 100KB</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Choose a maximum size, upload a photo, then resize. These limits are examples; follow the exact requirements of your application.</p>
        <div className="flex flex-wrap gap-2">
          {[20, 50, 100, 200].map(kb => (
            <button key={kb} type="button" disabled={isProcessing}
              onClick={() => { setTargetKb(kb); setExportFormat('image/jpeg'); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${targetKb === kb && exportFormat === 'image/jpeg' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 dark:bg-slate-800 border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300'}`}>
              Photo under {kb}KB
            </button>
          ))}
          <button type="button" disabled={isProcessing} onClick={() => { setResizeMode('preset'); setIndiaFormsOnly(true); }}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            India Form Photo Sizes
          </button>
        </div>
        <nav aria-label="Related application tools" className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
          <a href="/signature-resizer" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">Resize Signature to 10KB-20KB</a>
          <a href="/pdf-compressor" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">Compress PDF to 200KB</a>
          <a href="/photo-signature-joiner" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">Join Photo and Signature</a>
        </nav>
      </section>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) handleFilesAdded(Array.from(e.dataTransfer.files));
        }}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
            : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50'
        }`}
      >
        <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
          <Upload className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drag & drop images to resize, or paste from clipboard (Ctrl+V)
          </p>
          <p className="text-xs text-slate-400">
            Supports batch resize with multi-file selection. 100% Client-Side Private Processing.
          </p>
        </div>

        <label className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-all inline-flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Browse Images to Resize</span>
          <input
            type="file"
            disabled={isProcessing}
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              e.target.value = '';
              if (files.length) void handleFilesAdded(files);
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Resize Queue Grid */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Queue ({items.length} Images) • {items.filter(i => i.status === 'done').length} Resized
            </span>
            {items.some(i => i.resizedBlob) && (
              <button
                onClick={downloadAllZip}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileArchive className="w-4 h-4" />
                <span>Download All as ZIP</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{item.origW}×{item.origH}</span>
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {item.status === 'done' ? `${item.targetW}×${item.targetH}` : item.status === 'processing' ? 'Resizing…' : 'Not resized'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatBytes(item.file.size)}</span>
                      {item.resizedSize !== undefined && (
                        <>
                          <span>→</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatBytes(item.resizedSize)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.errorMessage && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{item.errorMessage}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.resizedBlob ? (
                    <button
                      onClick={() => downloadSingle(item)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer"
                      title="Download Resized Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => resizeAll(item.id)}
                      disabled={isProcessing}
                      className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer"
                      title="Resize Image"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isProcessing}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
