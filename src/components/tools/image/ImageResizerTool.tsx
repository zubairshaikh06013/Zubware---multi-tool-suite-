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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

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
  }, []);

  const handleFilesAdded = async (files: File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      onShowToast('Please select valid image files.');
      return;
    }

    const loaded: ResizedFileItem[] = [];
    for (const file of validFiles) {
      const previewUrl = URL.createObjectURL(file);
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => resolve({ w: 800, h: 600 });
        img.src = previewUrl;
      });

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

    // Default primary dimension to first file if not set
    if (items.length === 0 && loaded.length > 0) {
      const first = loaded[0];
      setWidth(first.origW);
      setHeight(first.origH);
      setActiveAspect(first.origW / (first.origH || 1));
    }

    setItems(prev => [...prev, ...loaded]);
    onShowToast(`Added ${loaded.length} image(s) to resizer.`);
  };

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
    setWidth(preset.width);
    setHeight(preset.height);
    setActiveAspect(preset.width / preset.height);
    onShowToast(`Applied preset: ${preset.name} (${preset.width}×${preset.height})`);
  };

  const resizeSingle = async (item: ResizedFileItem): Promise<ResizedFileItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let finalW = width;
        let finalH = height;

        if (resizeMode === 'percentage') {
          finalW = Math.max(1, Math.round((item.origW * percentage) / 100));
          finalH = Math.max(1, Math.round((item.origH * percentage) / 100));
        } else if (resizeMode === 'dimensions' && items.length > 1 && lockAspect) {
          // Proportionally scale individual files in batch
          const scale = width / item.origW;
          finalW = width;
          finalH = Math.max(1, Math.round(item.origH * scale));
        }

        const canvas = document.createElement('canvas');
        canvas.width = finalW;
        canvas.height = finalH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...item, status: 'error' });
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
            resolve({ ...item, status: 'error' });
            return;
          }
        }

        const expQuality = (exportFormat === 'image/jpeg' || exportFormat === 'image/webp') ? quality / 100 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                ...item,
                targetW: finalW,
                targetH: finalH,
                resizedBlob: blob,
                resizedSize: blob.size,
                status: 'done'
              });
            } else {
              resolve({ ...item, status: 'error' });
            }
          },
          exportFormat,
          expQuality
        );
      };

      img.onerror = () => resolve({ ...item, status: 'error' });
      img.src = item.previewUrl;
    });
  };

  const resizeAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const updated: ResizedFileItem[] = [];
    for (const item of items) {
      const res = await resizeSingle(item);
      updated.push(res);
    }

    setItems(updated);
    setIsProcessing(false);
    onShowToast('All images resized successfully!');
  };

  const downloadSingle = (item: ResizedFileItem) => {
    if (!item.resizedBlob) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const ext = exportFormat === 'image/jpeg' ? 'jpg' : exportFormat === 'image/webp' ? 'webp' : exportFormat === 'image/bmp' ? 'bmp' : 'png';
    const url = URL.createObjectURL(item.resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-resized-${item.targetW}x${item.targetH}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllZip = async () => {
    const ready = items.filter(i => i.resizedBlob);
    if (ready.length === 0) {
      onShowToast('Please resize images first.');
      return;
    }

    const zip = new JSZip();
    const ext = exportFormat === 'image/jpeg' ? 'jpg' : exportFormat === 'image/webp' ? 'webp' : exportFormat === 'image/bmp' ? 'bmp' : 'png';
    ready.forEach((item, idx) => {
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
    URL.revokeObjectURL(url);
    onShowToast('Downloaded all resized images in ZIP!');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
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
              onClick={resizeAll}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Resizing...' : 'Resize All Images'}</span>
            </button>
            <button
              onClick={clearAll}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Control Settings Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-5">
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
              Social & Standard Presets
            </button>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Browser Processing</span>
          </span>
        </div>

        {/* Mode-Specific Controls */}
        {resizeMode === 'dimensions' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Height (px)</label>
              <input
                type="number"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {PRESETS.map((preset, idx) => (
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

        {/* Export format & quality controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Output Format
            </label>
            <select
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
      </div>

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
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))}
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
                        {item.targetW || width}×{item.targetH || height}
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
                      onClick={async () => {
                        const updated = await resizeSingle(item);
                        setItems(items.map(i => (i.id === item.id ? updated : i)));
                      }}
                      className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer"
                      title="Resize Image"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
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
