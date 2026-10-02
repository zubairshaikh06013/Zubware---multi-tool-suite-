import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FileArchive,
  Trash2,
  Upload,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatDecimalBytes,
  encodeBmpFromImageData,
  encodeIcoFromPngBytes,
  checkBrowserCanvasSupport
} from '../../lib/fileSizeStandard';

export type OutputImageFormat =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/bmp'
  | 'image/x-icon'
  | 'image/avif';

interface ConvertItem {
  id: string;
  file: File;
  previewUrl: string;
  isSvg: boolean;
  isGif: boolean;
  originalWidth: number;
  originalHeight: number;
  targetFormat: OutputImageFormat;
  convertedBlob: Blob | null;
  convertedWidth?: number;
  convertedHeight?: number;
  convertedSize?: number;
  status: 'idle' | 'converting' | 'done' | 'error';
  errorMsg?: string;
}

interface ImageConverterToolProps {
  onShowToast: (msg: string) => void;
}

export const ImageConverterTool: React.FC<ImageConverterToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [globalTarget, setGlobalTarget] = useState<OutputImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(88);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [enableResize, setEnableResize] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [icoSize, setIcoSize] = useState<number>(64);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [browserSupport, setBrowserSupport] = useState<{
    jpeg: boolean;
    png: boolean;
    webp: boolean;
    avif: boolean;
  }>({
    jpeg: true,
    png: true,
    webp: true,
    avif: false
  });

  // Check client-side browser codec support on mount
  useEffect(() => {
    const sup = checkBrowserCanvasSupport();
    setBrowserSupport(sup);
  }, []);

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
  }, [globalTarget]);

  const handleFilesAdded = async (files: File[]) => {
    const validFiles = Array.from(files).filter(
      (f) =>
        f.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|bmp|gif|avif|ico|svg)$/i.test(f.name)
    );
    if (validFiles.length === 0) {
      onShowToast('Please select valid image files (PNG, JPG, WebP, BMP, GIF, AVIF, SVG).');
      return;
    }

    const loaded: ConvertItem[] = [];
    for (const file of validFiles) {
      const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      const previewUrl = URL.createObjectURL(file);

      // Extract image dimensions
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({
            w: img.naturalWidth || img.width || 800,
            h: img.naturalHeight || img.height || 600
          });
        img.onerror = () => resolve({ w: 800, h: 600 });
        img.src = previewUrl;
      });

      loaded.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl,
        isSvg,
        isGif,
        originalWidth: dims.w,
        originalHeight: dims.h,
        targetFormat: globalTarget,
        convertedBlob: null,
        status: 'idle'
      });
    }

    setItems((prev) => [...prev, ...loaded]);
    onShowToast(`Added ${loaded.length} image(s) to conversion queue.`);
  };

  const convertSingle = async (
    item: ConvertItem,
    targetFmt: OutputImageFormat
  ): Promise<ConvertItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        let drawW = img.naturalWidth || img.width || 800;
        let drawH = img.naturalHeight || img.height || 600;

        // ICO specific dimension sizing
        if (targetFmt === 'image/x-icon') {
          drawW = icoSize;
          drawH = icoSize;
        } else if (enableResize && (maxWidth > 0 || maxHeight > 0)) {
          if (lockAspect) {
            const scaleW = maxWidth > 0 ? maxWidth / drawW : 1;
            const scaleH = maxHeight > 0 ? maxHeight / drawH : 1;
            const scale = Math.min(scaleW, scaleH, 1);
            drawW = Math.round(drawW * scale);
            drawH = Math.round(drawH * scale);
          } else {
            if (maxWidth > 0) drawW = maxWidth;
            if (maxHeight > 0) drawH = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, drawW);
        canvas.height = Math.max(1, drawH);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...item, status: 'error', errorMsg: 'Canvas context unavailable' });
          return;
        }

        // Fill background color for formats that do not support transparency
        const needsFlatten = targetFmt === 'image/jpeg' || targetFmt === 'image/bmp';
        if (needsFlatten) {
          ctx.fillStyle = bgColor || '#FFFFFF';
          ctx.fillRect(0, 0, drawW, drawH);
        } else if (bgColor && bgColor !== '#FFFFFF' && bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, drawW, drawH);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, drawW, drawH);

        // 1. BMP Custom Pure Client-Side Encoder (guarantees valid BMP file)
        if (targetFmt === 'image/bmp') {
          try {
            const imgData = ctx.getImageData(0, 0, drawW, drawH);
            const bmpBytes = encodeBmpFromImageData(imgData);
            const bmpBlob = new Blob([bmpBytes], { type: 'image/bmp' });
            resolve({
              ...item,
              targetFormat: targetFmt,
              convertedBlob: bmpBlob,
              convertedWidth: drawW,
              convertedHeight: drawH,
              convertedSize: bmpBlob.size,
              status: 'done'
            });
            return;
          } catch (e: any) {
            resolve({ ...item, status: 'error', errorMsg: e.message || 'BMP encoding failed' });
            return;
          }
        }

        // 2. ICO Custom Pure Client-Side Encoder (guarantees valid standard Windows ICO)
        if (targetFmt === 'image/x-icon') {
          canvas.toBlob(
            async (pngBlob) => {
              if (!pngBlob) {
                resolve({ ...item, status: 'error', errorMsg: 'ICO rasterization failed' });
                return;
              }
              const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
              const icoBytes = encodeIcoFromPngBytes(pngBytes, drawW, drawH);
              const icoBlob = new Blob([icoBytes], { type: 'image/x-icon' });
              resolve({
                ...item,
                targetFormat: targetFmt,
                convertedBlob: icoBlob,
                convertedWidth: drawW,
                convertedHeight: drawH,
                convertedSize: icoBlob.size,
                status: 'done'
              });
            },
            'image/png'
          );
          return;
        }

        // 3. Standard Browser Codecs (PNG, JPEG, WebP, AVIF)
        const exportQuality =
          targetFmt === 'image/jpeg' || targetFmt === 'image/webp' ? quality / 100 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                ...item,
                targetFormat: targetFmt,
                convertedBlob: blob,
                convertedWidth: drawW,
                convertedHeight: drawH,
                convertedSize: blob.size,
                status: 'done'
              });
            } else {
              resolve({
                ...item,
                status: 'error',
                errorMsg: 'Conversion encoding failed'
              });
            }
          },
          targetFmt,
          exportQuality
        );
      };

      img.onerror = () => {
        resolve({ ...item, status: 'error', errorMsg: 'Failed to load source image' });
      };

      img.src = item.previewUrl;
    });
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setProgressPercent(10);

    const results: ConvertItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const target = item.targetFormat || globalTarget;
      const res = await convertSingle(item, target);
      results.push(res);
      setProgressPercent(Math.round(((i + 1) / items.length) * 100));
    }

    setItems(results);
    setIsProcessing(false);
    onShowToast('All images converted successfully!');
  };

  const downloadSingle = (item: ConvertItem) => {
    if (!item.convertedBlob) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const ext = getExtensionForMime(item.targetFormat);
    const url = URL.createObjectURL(item.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded: ${baseName}.${ext} (${formatDecimalBytes(item.convertedBlob.size)})`);
  };

  const downloadAllZip = async () => {
    const readyItems = items.filter((i) => i.convertedBlob);
    if (readyItems.length === 0) {
      onShowToast('Please convert images first.');
      return;
    }

    const zip = new JSZip();
    readyItems.forEach((item, index) => {
      const baseName = item.file.name.replace(/\.[^/.]+$/, '');
      const ext = getExtensionForMime(item.targetFormat);
      zip.file(`${baseName}-${index + 1}.${ext}`, item.convertedBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zubware-converted-images-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ZIP archive (${formatDecimalBytes(content.size)}) with all converted images!`);
  };

  const getExtensionForMime = (mime: OutputImageFormat): string => {
    switch (mime) {
      case 'image/png':
        return 'png';
      case 'image/jpeg':
        return 'jpg';
      case 'image/webp':
        return 'webp';
      case 'image/bmp':
        return 'bmp';
      case 'image/x-icon':
        return 'ico';
      case 'image/avif':
        return 'avif';
      default:
        return 'png';
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
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
              onClick={convertAll}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? `Converting (${progressPercent}%)` : 'Convert All Images'}</span>
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

      {/* Global Conversion Settings Toolbar */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Conversion & Format Options</span>
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Browser Processing</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Format Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Target Format
            </label>
            <select
              value={globalTarget}
              onChange={(e) => {
                const val = e.target.value as OutputImageFormat;
                setGlobalTarget(val);
                setItems(items.map((i) => ({ ...i, targetFormat: val })));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="image/webp">WebP (Modern & Compact)</option>
              <option value="image/png">PNG (Lossless & Alpha)</option>
              <option value="image/jpeg">JPG / JPEG (Standard Photo)</option>
              <option value="image/bmp">BMP (Bitmap Uncompressed)</option>
              <option value="image/x-icon">ICO (Favicon Icon)</option>
              {browserSupport.avif && <option value="image/avif">AVIF (Ultra High Compression)</option>}
            </select>
          </div>

          {/* Quality Slider for lossy */}
          {(globalTarget === 'image/jpeg' || globalTarget === 'image/webp') && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <span>Quality</span>
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

          {/* ICO Size Selector */}
          {globalTarget === 'image/x-icon' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Favicon Icon Size
              </label>
              <select
                value={icoSize}
                onChange={(e) => setIcoSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                <option value="16">16 × 16 px (Browser Tab Favicon)</option>
                <option value="32">32 × 32 px (Standard Favicon)</option>
                <option value="48">48 × 48 px (Desktop Icon)</option>
                <option value="64">64 × 64 px (High-DPI Favicon)</option>
                <option value="128">128 × 128 px (App Icon)</option>
                <option value="256">256 × 256 px (Windows Vista+ Icon)</option>
              </select>
            </div>
          )}

          {/* Background Flatten Color */}
          {(globalTarget === 'image/jpeg' || globalTarget === 'image/bmp') && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Alpha Fill Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* Optional Resize Toggle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Constraint Resize
            </label>
            <button
              onClick={() => setEnableResize(!enableResize)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                enableResize
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{enableResize ? 'Resize Enabled' : 'Original Dimensions'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Resize Controls */}
        {enableResize && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Max Width (px)
              </label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Max Height (px)
              </label>
              <input
                type="number"
                value={maxHeight}
                onChange={(e) => setMaxHeight(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300"
              >
                {lockAspect ? (
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{lockAspect ? 'Keep Aspect Ratio' : 'Allow Stretch'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
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
            Drag & drop multiple images here, or paste directly from clipboard (Ctrl+V)
          </p>
          <p className="text-xs text-slate-400">
            Supports PNG, JPG, WebP, BMP, GIF, AVIF, SVG. No upload limit.
          </p>
        </div>

        <label className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-all inline-flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Browse Image Files</span>
          <input
            type="file"
            multiple
            accept="image/*,.webp,.png,.jpg,.jpeg,.bmp,.gif,.avif,.svg"
            onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))}
            className="hidden"
          />
        </label>
      </div>

      {/* Conversion Queue List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Queue ({items.length} Images) • {items.filter((i) => i.status === 'done').length} Converted
            </span>
            {items.some((i) => i.convertedBlob) && (
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
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>
                        {item.originalWidth}×{item.originalHeight}
                      </span>
                      <span>•</span>
                      <span>{formatDecimalBytes(item.file.size)}</span>
                      {item.convertedSize !== undefined && (
                        <>
                          <ArrowRight className="w-3 h-3 text-indigo-500" />
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {formatDecimalBytes(item.convertedSize)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.isGif && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Animated GIF: converted using first frame
                      </p>
                    )}
                    {item.isSvg && (
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Vector SVG: rasterized at crisp resolution
                      </p>
                    )}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'done'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : item.status === 'converting'
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.status === 'done'
                          ? `Ready (.${getExtensionForMime(item.targetFormat)})`
                          : item.status === 'converting'
                          ? 'Converting...'
                          : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.convertedBlob ? (
                    <button
                      onClick={() => downloadSingle(item)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const updated = await convertSingle(item, item.targetFormat);
                        setItems(items.map((i) => (i.id === item.id ? updated : i)));
                      }}
                      className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer"
                      title="Convert Image"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                    title="Remove from queue"
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
