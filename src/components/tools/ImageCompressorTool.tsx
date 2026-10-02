import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  FileArchive,
  Sliders,
  Target,
  Percent,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BatchQueue, BatchQueueItem } from '../common/BatchQueue';
import {
  DECIMAL_KB_BYTES,
  DECIMAL_MB_BYTES,
  formatDecimalBytes,
  parseTargetBytes,
  padJpegToExactBytes,
  padPngToExactBytes
} from '../../lib/fileSizeStandard';

interface ImageCompressorToolProps {
  onShowToast: (msg: string) => void;
}

const TARGET_PRESETS = [
  { label: '20 KB', value: 20, unit: 'KB' as const, tag: 'Passport / SSC' },
  { label: '50 KB', value: 50, unit: 'KB' as const, tag: 'Job Portals' },
  { label: '100 KB', value: 100, unit: 'KB' as const, tag: 'Web Uploads' },
  { label: '200 KB', value: 200, unit: 'KB' as const, tag: 'Email / Forms' },
  { label: '300 KB', value: 300, unit: 'KB' as const, tag: 'Doc Portals' },
  { label: '500 KB', value: 500, unit: 'KB' as const, tag: 'Social Media' },
  { label: '1 MB', value: 1, unit: 'MB' as const, tag: 'HD Quality' }
];

const POPULAR_SEARCH_PRESETS = [
  { label: 'Image compressor to 20kb', value: 20, unit: 'KB' as const, desc: 'Government forms & passport photos' },
  { label: 'Image compressor to 50kb', value: 50, unit: 'KB' as const, desc: 'Online application & signature uploads' },
  { label: 'Image compressor to 100kb', value: 100, unit: 'KB' as const, desc: 'Standard portal & document uploads' },
  { label: 'Image compressor to 200kb', value: 200, unit: 'KB' as const, desc: 'Email attachments & CVs' },
  { label: 'Image compressor to 300kb', value: 300, unit: 'KB' as const, desc: 'Official identity & certificate uploads' },
  { label: 'Image compressor to 500kb', value: 500, unit: 'KB' as const, desc: 'Blog illustrations & portfolio images' }
];

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<BatchQueueItem[]>([]);
  const [mode, setMode] = useState<'target' | 'quality'>('target');
  const [targetAccuracy, setTargetAccuracy] = useState<'max' | 'exact'>('max');
  const [targetSizeVal, setTargetSizeVal] = useState<number>(100);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [customInputStr, setCustomInputStr] = useState<string>('100');
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

  const handleSetTargetPreset = (val: number, unit: 'KB' | 'MB' = 'KB') => {
    setTargetSizeVal(val);
    setTargetUnit(unit);
    setCustomInputStr(val.toString());
    setMode('target');
  };

  const compressSingle = async (
    item: BatchQueueItem,
    currentMode: 'target' | 'quality',
    qValue: number,
    targetVal: number,
    unit: 'KB' | 'MB',
    accuracyMode: 'max' | 'exact',
    format: string
  ): Promise<BatchQueueItem> => {
    // 1. Helper to safely load image with fallbacks for Android/mobile Chrome
    const loadImageSource = async (
      file: File
    ): Promise<{
      source: CanvasImageSource;
      width: number;
      height: number;
      cleanup: () => void;
    }> => {
      if (typeof createImageBitmap === 'function') {
        try {
          const bmp = await createImageBitmap(file);
          return {
            source: bmp,
            width: bmp.width,
            height: bmp.height,
            cleanup: () => bmp.close?.()
          };
        } catch {
          // Fallback to Image element
        }
      }

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

      // Render helper returning an exact Blob
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
      let isExactMatched = false;

      if (currentMode === 'quality') {
        // Direct Quality Percentage Mode
        finalBlob = await renderBlob(1.0, qValue / 100);
        if (!finalBlob) {
          cleanup();
          return { ...item, status: 'error', errorMessage: 'Compression failed' };
        }
        const reductionPct = Math.round(((item.file.size - finalBlob.size) / item.file.size) * 100);
        label = `Quality ${qValue}% • ${formatDecimalBytes(finalBlob.size)} (${reductionPct > 0 ? `${reductionPct}% reduction` : 'Optimized'})`;
      } else {
        // Target Size Mode (Decimal Standard: 1 KB = 1000 B, 1 MB = 1,000,000 B)
        const targetBytes = parseTargetBytes(targetVal, unit);

        // Check if original is already smaller than target
        if (item.file.size <= targetBytes && accuracyMode === 'max') {
          // If already smaller and user requested maximum size <= targetBytes
          finalBlob = await renderBlob(1.0, 0.90);
          if (!finalBlob || finalBlob.size > targetBytes) {
            // Keep original if re-encoding increases size
            finalBlob = item.file;
          }
          cleanup();
          const achievedStr = formatDecimalBytes(finalBlob.size);
          const targetStr = formatDecimalBytes(targetBytes);
          return {
            ...item,
            resultBlob: finalBlob,
            resultSize: finalBlob.size,
            resultUrl: URL.createObjectURL(finalBlob),
            status: 'done',
            exactMatch: finalBlob.size === targetBytes,
            customLabel: `Original within target: ${achievedStr} <= ${targetStr}`,
            downloadFileName: `${item.file.name.replace(/\.[^/.]+$/, '')}-compressed.${mimeType === 'image/webp' ? 'webp' : mimeType === 'image/png' ? 'png' : 'jpg'}`
          };
        }

        // Target search: Iterative quality search and dimension scaling
        let bestCandidate: Blob | null = null;
        let bestDiff = Infinity;

        if (mimeType === 'image/png') {
          // PNG is lossless: binary search dimension scale
          let lowScale = 0.05;
          let highScale = 1.0;
          let iter = 0;
          while (iter < 8 && (highScale - lowScale) > 0.02) {
            iter++;
            const midScale = (lowScale + highScale) / 2;
            const b = await renderBlob(midScale, 1.0);
            if (!b) break;

            if (b.size <= targetBytes) {
              bestCandidate = b;
              lowScale = midScale; // try larger scale to get closer to target
            } else {
              highScale = midScale;
            }
          }
        } else {
          // JPEG or WebP: Binary search quality first at full resolution
          let currentScale = 1.0;
          let minQBlob = await renderBlob(1.0, 0.05);

          // If even lowest quality at 100% scale is too large, downscale dimensions
          while (minQBlob && minQBlob.size > targetBytes && currentScale > 0.15) {
            currentScale = Math.max(0.12, currentScale * 0.85);
            minQBlob = await renderBlob(currentScale, 0.05);
            if (minQBlob && minQBlob.size <= targetBytes) break;
          }

          let lowQ = 0.05;
          let highQ = 0.95;
          let iter = 0;

          while (iter < 8 && (highQ - lowQ) > 0.02) {
            iter++;
            const midQ = (lowQ + highQ) / 2;
            const b = await renderBlob(currentScale, midQ);
            if (!b) break;

            if (b.size <= targetBytes) {
              bestCandidate = b;
              lowQ = midQ; // try higher quality closer to target
            } else {
              highQ = midQ;
            }
          }
        }

        if (!bestCandidate) {
          // Fallback to lowest possible output
          bestCandidate = await renderBlob(0.15, 0.05);
        }

        if (!bestCandidate) {
          cleanup();
          return { ...item, status: 'error', errorMessage: 'Could not reach target size' };
        }

        finalBlob = bestCandidate;

        // Exact Target Size Processing (if user requested exact bytes and format supports safe padding)
        if (accuracyMode === 'exact') {
          if (finalBlob.size === targetBytes) {
            isExactMatched = true;
          } else if (finalBlob.size < targetBytes) {
            const buf = new Uint8Array(await finalBlob.arrayBuffer());
            let padded: Uint8Array | null = null;

            if (mimeType === 'image/jpeg') {
              padded = padJpegToExactBytes(buf, targetBytes);
            } else if (mimeType === 'image/png') {
              padded = padPngToExactBytes(buf, targetBytes);
            }

            if (padded && padded.length === targetBytes) {
              finalBlob = new Blob([padded], { type: mimeType });
              isExactMatched = true;
            }
          }
        }

        const achievedBytes = finalBlob.size;
        const targetStr = formatDecimalBytes(targetBytes);
        const achievedStr = formatDecimalBytes(achievedBytes);
        const reductionPct = Math.round(((item.file.size - achievedBytes) / item.file.size) * 100);

        if (accuracyMode === 'exact') {
          if (isExactMatched) {
            label = `Target: ${targetStr} • Final: ${achievedStr} • Exact Match: YES (${reductionPct}% reduction)`;
          } else {
            label = `Target: ${targetStr} • Final: ${achievedStr} (Exact target not safely achievable for this format)`;
          }
        } else {
          const withinTarget = achievedBytes <= targetBytes;
          label = withinTarget
            ? `Target: ${targetStr} • Actual: ${achievedStr} (Within target, ${reductionPct}% reduction)`
            : `Smallest valid output: ${achievedStr} (Target: ${targetStr})`;
        }
      }

      cleanup();
      const resUrl = URL.createObjectURL(finalBlob);
      const ext = mimeType === 'image/webp' ? '.webp' : mimeType === 'image/png' ? '.png' : '.jpg';
      const cleanBase = item.file.name.replace(/\.[^/.]+$/, '');
      const downloadFileName = `${cleanBase}-compressed-${formatDecimalBytes(finalBlob.size).replace(/\s+/g, '')}${ext}`;

      return {
        ...item,
        resultBlob: finalBlob,
        resultSize: finalBlob.size,
        resultUrl: resUrl,
        status: 'done',
        customLabel: label,
        downloadFileName,
        exactMatch: isExactMatched,
        errorMessage: undefined
      };
    } catch (err: any) {
      return {
        ...item,
        status: 'error',
        errorMessage: err?.message || 'Compression error'
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

    for (const item of targetItems) {
      const compressed = await compressSingle(
        item,
        mode,
        quality,
        targetSizeVal,
        targetUnit,
        targetAccuracy,
        targetFormat
      );
      updatedMap.set(item.id, compressed);
    }

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
      const fileName = item.downloadFileName || `${item.file.name.replace(/\.[^/.]+$/, '')}-compressed-${index + 1}.jpg`;
      zip.file(fileName, item.resultBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ZIP archive (${formatDecimalBytes(content.size)}) with ${readyItems.length} image(s)!`);
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
      {/* Main Queue & Controls */}
      <BatchQueue
        items={items}
        onAddFiles={handleFilesAdded}
        onRemoveItem={handleRemoveItem}
        onClearQueue={handleClearQueue}
        onStartBatch={compressBatch}
        onDownloadSelected={downloadSelectedZip}
        actionLabel={mode === 'target' ? `Compress to ${targetSizeVal} ${targetUnit}` : 'Compress Images'}
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
                  <span>By Target Size</span>
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
                        Strict Byte Verification (blob.size)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select standard government form size or enter custom target in KB/MB.
                    </p>
                  </div>

                  {/* Manual Input & Unit Selector */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="50000"
                      value={customInputStr}
                      onChange={(e) => {
                        setCustomInputStr(e.target.value);
                        const val = Number(e.target.value);
                        if (val > 0) setTargetSizeVal(val);
                      }}
                      className="w-20 px-2.5 py-1.5 text-xs font-extrabold text-right bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-2 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>

                {/* Sub-mode: Maximum vs Exact Target */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Accuracy Mode:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="accuracy"
                      checked={targetAccuracy === 'max'}
                      onChange={() => setTargetAccuracy('max')}
                      className="accent-rose-600"
                    />
                    <span>Maximum Size (&le; Target)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="accuracy"
                      checked={targetAccuracy === 'exact'}
                      onChange={() => setTargetAccuracy('exact')}
                      className="accent-rose-600"
                    />
                    <span>Exact Target Byte Match</span>
                  </label>
                </div>

                {/* Quick Presets Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 pt-1">
                  {TARGET_PRESETS.map((preset) => {
                    const isActive = targetSizeVal === preset.value && targetUnit === preset.unit;
                    return (
                      <button
                        key={`${preset.value}-${preset.unit}`}
                        type="button"
                        onClick={() => handleSetTargetPreset(preset.value, preset.unit)}
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
              onClick={() => handleSetTargetPreset(p.value, p.unit)}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between group ${
                mode === 'target' && targetSizeVal === p.value && targetUnit === p.unit
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-rose-300 hover:bg-rose-50/40 dark:hover:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                <span>{p.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-extrabold text-rose-500">
                  {p.value}{p.unit}
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
          <span>Local Browser Processing: Binary search, format padding, and quality iteration run locally in your browser. Files are not uploaded to Zubware servers.</span>
        </div>
      </div>
    </div>
  );
};
