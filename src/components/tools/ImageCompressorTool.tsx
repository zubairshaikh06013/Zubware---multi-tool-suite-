import React, { useState } from 'react';
import JSZip from 'jszip';
import { FileArchive, Sliders, Target, Percent, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BatchQueue, BatchQueueItem } from '../common/BatchQueue';

interface ImageCompressorToolProps {
  onShowToast: (msg: string) => void;
}

const TARGET_PRESETS = [
  { label: '20 KB', value: 20, tag: 'Passport / SSC' },
  { label: '50 KB', value: 50, tag: 'Job Portals' },
  { label: '100 KB', value: 100, tag: 'Web Uploads' },
  { label: '200 KB', value: 200, tag: 'Email / Forms' },
  { label: '500 KB', value: 500, tag: 'Social Media' },
  { label: '1 MB', value: 1024, tag: 'HD Quality' }
];

const POPULAR_SEARCH_PRESETS = [
  { label: 'Image compressor to 20kb', value: 20, desc: 'Government forms & passport photos' },
  { label: 'Image compressor to 50kb', value: 50, desc: 'Online application & signature uploads' },
  { label: 'Image compressor to 100kb', value: 100, desc: 'Standard portal & document uploads' },
  { label: 'Image compressor to 200kb', value: 200, desc: 'Email attachments & CVs' },
  { label: 'Image compressor to 500kb', value: 500, desc: 'Blog illustrations & portfolio images' }
];

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<BatchQueueItem[]>([]);
  const [mode, setMode] = useState<'target' | 'quality'>('target');
  const [targetSizeKB, setTargetSizeKB] = useState<number>(100);
  const [customInputKB, setCustomInputKB] = useState<string>('100');
  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      onShowToast('Please select valid image files');
      return;
    }

    const newItems: BatchQueueItem[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      status: 'pending' as const
    }));

    setItems((prev) => [...prev, ...newItems]);
    onShowToast(`Added ${validFiles.length} image(s) to queue`);
  };

  const handleSetTargetKB = (kb: number) => {
    const valid = Math.max(5, Math.min(10000, Math.round(kb)));
    setTargetSizeKB(valid);
    setCustomInputKB(valid.toString());
    setMode('target');
  };

  const compressSingle = async (
    item: BatchQueueItem,
    currentMode: 'target' | 'quality',
    qValue: number,
    targetKB: number,
    format: string
  ): Promise<BatchQueueItem> => {
    // Helper to load image either via createImageBitmap or Image element (with FileReader fallback for mobile Android Chrome)
    const loadImageSource = async (file: File): Promise<{
      source: CanvasImageSource;
      width: number;
      height: number;
      cleanup: () => void;
    }> => {
      // 1. Try createImageBitmap first (very fast and robust on modern mobile Chrome)
      if (typeof createImageBitmap === 'function') {
        try {
          const bmp = await createImageBitmap(file);
          return {
            source: bmp,
            width: bmp.width,
            height: bmp.height,
            cleanup: () => bmp.close?.()
          };
        } catch (e) {
          // Fallback to Image element
        }
      }

      // 2. Try URL.createObjectURL with Image element
      try {
        const objUrl = URL.createObjectURL(file);
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error('Object URL load failed'));
          el.src = objUrl;
        });
        return {
          source: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          cleanup: () => URL.revokeObjectURL(objUrl)
        };
      } catch {
        // 3. Fallback: FileReader readAsDataURL (works when blob: URLs are restricted or memory throttled on Android)
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('FileReader failed'));
          reader.readAsDataURL(file);
        });

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error('Data URL load failed'));
          el.src = dataUrl;
        });

        return {
          source: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          cleanup: () => {}
        };
      }
    };

    try {
      const { source, width: srcWidth, height: srcHeight, cleanup } = await loadImageSource(item.file);

      let mimeType = format === 'original' ? item.file.type : format;
      if (!mimeType || mimeType === 'image/svg+xml') {
        mimeType = 'image/jpeg';
      }

      const renderBlob = (scale: number, q: number): Promise<Blob | null> => {
        return new Promise((resBlob) => {
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(srcWidth * scale));
          canvas.height = Math.max(1, Math.round(srcHeight * scale));
          const ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
          if (!ctx) return resBlob(null);

          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((b) => resBlob(b), mimeType, q);
        });
      };

      let finalBlob: Blob | null = null;
      let label = '';

      if (currentMode === 'quality') {
        // Standard Quality % mode
        finalBlob = await renderBlob(1.0, qValue / 100);
        if (!finalBlob) {
          cleanup();
          return { ...item, status: 'error', errorMessage: 'Compression failed' };
        }
        const savings = Math.round(((item.file.size - finalBlob.size) / item.file.size) * 100);
        label = savings > 0 ? `${savings}% reduced` : 'Compressed';
      } else {
        // Target Size (KB) mode
        const targetBytes = targetKB * 1024;
        const tolerance = 0.05; // 5% tolerance
        let bestBlob: Blob | null = null;
        let bestDiff = Infinity;

        const recordCandidate = (blob: Blob | null) => {
          if (!blob) return;
          const diff = Math.abs(blob.size - targetBytes);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestBlob = blob;
          }
        };

        if (mimeType === 'image/png') {
          let lowScale = 0.05;
          let highScale = 1.0;
          let iter = 0;
          while (iter < 8 && (highScale - lowScale) > 0.02) {
            iter++;
            const midScale = (lowScale + highScale) / 2;
            const b = await renderBlob(midScale, 1.0);
            if (!b) break;
            recordCandidate(b);
            if (Math.abs(b.size - targetBytes) / targetBytes <= tolerance) {
              bestBlob = b;
              break;
            }
            if (b.size > targetBytes) {
              highScale = midScale;
            } else {
              lowScale = midScale;
            }
          }
        } else {
          // JPEG or WebP
          const initialHigh = await renderBlob(1.0, 0.92);
          if (initialHigh && initialHigh.size <= targetBytes) {
            recordCandidate(initialHigh);
          } else {
            let currentScale = 1.0;
            let minQualityBlob = await renderBlob(1.0, 0.05);
            recordCandidate(minQualityBlob);

            let downscaleStep = 0.90;
            while (minQualityBlob && minQualityBlob.size > targetBytes && currentScale > 0.15) {
              currentScale = Math.max(0.1, currentScale * downscaleStep);
              minQualityBlob = await renderBlob(currentScale, 0.05);
              recordCandidate(minQualityBlob);
              if (minQualityBlob && minQualityBlob.size <= targetBytes) {
                break;
              }
              downscaleStep = Math.max(0.70, downscaleStep - 0.05);
            }

            let lowQ = 0.05;
            let highQ = 0.95;
            let iter = 0;
            const maxIter = 8;

            while (iter < maxIter && (highQ - lowQ) > 0.02) {
              iter++;
              const midQ = (lowQ + highQ) / 2;
              const b = await renderBlob(currentScale, midQ);
              if (!b) break;
              recordCandidate(b);

              const diffRatio = Math.abs(b.size - targetBytes) / targetBytes;
              if (diffRatio <= tolerance) {
                bestBlob = b;
                break;
              }

              if (b.size > targetBytes) {
                highQ = midQ;
              } else {
                lowQ = midQ;
              }
            }
          }
        }

        finalBlob = bestBlob || (await renderBlob(1.0, 0.5));
        if (!finalBlob) {
          cleanup();
          return { ...item, status: 'error', errorMessage: 'Compression failed' };
        }

        const achievedKB = (finalBlob.size / 1024).toFixed(1).replace(/\.0$/, '');
        label = `Target: ${targetKB}KB → Achieved: ${achievedKB}KB`;
      }

      cleanup();
      const resUrl = URL.createObjectURL(finalBlob);

      return {
        ...item,
        resultBlob: finalBlob,
        resultSize: finalBlob.size,
        resultUrl: resUrl,
        status: 'done',
        customLabel: label,
        errorMessage: undefined
      };
    } catch (err: any) {
      return {
        ...item,
        status: 'error',
        errorMessage: err?.message || 'Processing error'
      };
    }
  };

  const compressBatch = async (targetIds?: string[]) => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const targetItems = targetIds && targetIds.length > 0
      ? items.filter((item) => targetIds.includes(item.id))
      : items;

    const updatedMap = new Map(items.map((it) => [it.id, it]));

    await Promise.all(
      targetItems.map(async (item) => {
        const compressed = await compressSingle(item, mode, quality, targetSizeKB, targetFormat);
        updatedMap.set(item.id, compressed);
      })
    );

    setItems(Array.from(updatedMap.values()));
    setIsProcessing(false);
    onShowToast(`Compression complete for ${targetItems.length} image(s)!`);
  };

  const downloadZipForItems = async (targetItems: BatchQueueItem[], zipName = 'compressed-images.zip') => {
    const readyItems = targetItems.filter((i) => i.resultBlob && i.status === 'done');
    if (readyItems.length === 0) {
      onShowToast('No completed compressed images to download');
      return;
    }

    const zip = new JSZip();
    readyItems.forEach((item, index) => {
      const ext =
        item.resultBlob?.type === 'image/webp'
          ? '.webp'
          : item.resultBlob?.type === 'image/jpeg'
          ? '.jpg'
          : '.png';
      const cleanName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
      zip.file(`${cleanName}-compressed-${index + 1}${ext}`, item.resultBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${readyItems.length} image(s) as ZIP!`);
  };

  const downloadAllZip = () => downloadZipForItems(items, 'all-compressed-images.zip');

  const downloadSelectedZip = (selectedIds: string[]) => {
    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    downloadZipForItems(selectedItems, 'selected-compressed-images.zip');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearQueue = () => {
    setItems([]);
  };

  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="w-full max-w-5xl mx-auto my-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>New: Compress to Exact KB Target</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('batchImageCompressor', 'Batch Image Compressor')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
          Compress photos to 20KB, 50KB, 100KB, 200KB, or 500KB online for free. Fast, private client-side compression with quality retention and zero uploads.
        </p>
      </div>

      {/* Main Queue & Controls */}
      <BatchQueue
        items={items}
        onAddFiles={handleFilesAdded}
        onRemoveItem={handleRemoveItem}
        onClearQueue={handleClearQueue}
        onStartBatch={compressBatch}
        onDownloadSelected={downloadSelectedZip}
        actionLabel={mode === 'target' ? `Compress to ${targetSizeKB}KB` : 'Compress Images'}
        secondaryAction={
          doneCount > 0
            ? {
                label: `Download ZIP (${doneCount})`,
                icon: <FileArchive className="w-4 h-4" />,
                onClick: downloadAllZip
              }
            : undefined
        }
        isProcessing={isProcessing}
        accept="image/*"
        title={t('dropImagesCompress', 'Drop your images here or click to upload')}
        subtitle={t('supportsMultipleFiles', 'Supports multiple files (PNG, JPG, WebP, AVIF, GIF)')}
        customControls={
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">Compression Mode</span>
              </div>

              <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('target')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'target'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>By Target Size (KB)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('quality')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'quality'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>By Quality %</span>
                </button>
              </div>
            </div>

            {/* Mode-Specific Settings */}
            {mode === 'target' ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>Target File Size</span>
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                        Auto-converges within ±5%
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select a standard size or enter your exact requirement in KB.
                    </p>
                  </div>

                  {/* Manual KB Input */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="10000"
                        value={customInputKB}
                        onChange={(e) => {
                          setCustomInputKB(e.target.value);
                          const val = Number(e.target.value);
                          if (val > 0) setTargetSizeKB(val);
                        }}
                        className="w-24 px-2.5 py-1.5 text-xs font-extrabold text-right bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                      />
                      <span className="absolute right-2 top-1.5 text-xs font-bold text-slate-400 pointer-events-none">
                        KB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {TARGET_PRESETS.map((preset) => {
                    const isActive = targetSizeKB === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSetTargetKB(preset.value)}
                        className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold">{preset.label}</span>
                          {isActive && <Check className="w-3 h-3 text-rose-500" />}
                        </div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                          {preset.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t('compressionQuality', 'Compression Quality')}</span>
                  <span className="text-rose-500 font-extrabold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>Smaller File Size (10%)</span>
                  <span>Balanced (75%)</span>
                  <span>Highest Fidelity (95%)</span>
                </div>
              </div>
            )}

            {/* Output Format Setting */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                  {t('targetFormat', 'Target Output Format')}
                </label>
                <p className="text-[11px] text-slate-400">
                  JPG and WebP support direct quality binary search. PNG uses progressive resolution scale.
                </p>
              </div>

              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer min-w-[180px]"
              >
                <option value="original">{t('keepOriginalFormat', 'Keep Original Format')}</option>
                <option value="image/jpeg">JPG / JPEG (Standard)</option>
                <option value="image/webp">WebP (Modern & Compact)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Visible Popular Searches & Quick Presets Section (SEO & Real Usable UI) */}
      <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Popular Image Size Presets & Queries</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Need an exact file size for an exam form, visa application, or portal upload? Click any preset below to load target compression instantly:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {POPULAR_SEARCH_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleSetTargetKB(p.value)}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between group ${
                mode === 'target' && targetSizeKB === p.value
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-rose-300 hover:bg-rose-50/40 dark:hover:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                <span>{p.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-extrabold text-rose-500">
                  {p.value}KB
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {p.desc}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Client-Side Private: All binary search and resolution scaling runs locally in your browser with zero server uploads.</span>
        </div>
      </div>
    </div>
  );
};


