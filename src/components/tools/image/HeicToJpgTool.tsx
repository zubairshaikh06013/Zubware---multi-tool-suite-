import React, { useState, useRef } from 'react';
import { 
  RefreshCw, Download, FileCheck, Layers, FileArchive, ShieldCheck, 
  Sliders, Image as ImageIcon, Info, AlertTriangle, Eye, EyeOff, Trash2, CheckCircle2, RotateCcw
} from 'lucide-react';
import JSZip from 'jszip';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';
import { formatBytes } from '../../../lib/imageUtils';

interface HeicToJpgToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface HeicItem {
  id: string;
  file: File;
  status: 'pending' | 'decoding' | 'processing' | 'encoding' | 'done' | 'error';
  errorMessage?: string;
  originalWidth?: number;
  originalHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  decodedJpegBlob?: Blob;
  decodedJpegUrl?: string;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  showConvertedPreview?: boolean;
}

type DimensionPreset = 'original' | '1920' | '1600' | '1280' | '1080' | '720' | 'custom';
type QualityPreset = 'low' | 'medium' | 'high' | 'very-high' | 'max';

export const HeicToJpgTool: React.FC<HeicToJpgToolProps> = ({ onShowToast, onNavigate }) => {
  const [items, setItems] = useState<HeicItem[]>([]);
  
  // Conversion Settings
  const [quality, setQuality] = useState<number>(90);
  const [dimensionPreset, setDimensionPreset] = useState<DimensionPreset>('original');
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);

  // Processing State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('Reading Files');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [cancelRequested, setCancelRequested] = useState<boolean>(false);

  // Large File Warning Modal
  const [largeFileWarning, setLargeFileWarning] = useState<File[] | null>(null);

  // Helper to check HEIC/HEIF file extension / MIME
  const isHeicFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.toLowerCase();
    return (
      ext === 'heic' ||
      ext === 'heif' ||
      type.includes('heic') ||
      type.includes('heif')
    );
  };

  const handleFilesSelected = (files: File[]) => {
    if (!files || !files.length) return;

    // Filter valid HEIC / HEIF files
    const validFiles: File[] = [];
    let hasInvalid = false;

    for (const f of files) {
      if (isHeicFile(f)) {
        validFiles.push(f);
      } else {
        hasInvalid = true;
      }
    }

    if (hasInvalid) {
      onShowToast('Please select a HEIC or HEIF image.');
    }

    if (!validFiles.length) return;

    // Check if any file is very large (>30MB)
    const largeFiles = validFiles.filter(f => f.size > 30 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setLargeFileWarning(validFiles);
      return;
    }

    addFilesToBatch(validFiles);
  };

  const addFilesToBatch = (files: File[]) => {
    const newItems: HeicItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      status: 'pending' as const,
      showConvertedPreview: true
    }));

    setItems((prev) => [...prev, ...newItems]);
    onShowToast(`Added ${files.length} HEIC ${files.length === 1 ? 'file' : 'files'} to converter.`);
  };

  const handleConfirmLargeFiles = () => {
    if (largeFileWarning) {
      addFilesToBatch(largeFileWarning);
      setLargeFileWarning(null);
    }
  };

  const handleCancelLargeFiles = () => {
    setLargeFileWarning(null);
  };

  // Convert single HEIC file using heic2any
  const convertSingleHeicItem = async (
    item: HeicItem, 
    qualityRatio: number,
    preset: DimensionPreset,
    cW: string,
    cH: string,
    aspect: boolean,
    bg: string
  ): Promise<HeicItem> => {
    try {
      // Step 1: Decode HEIC using dynamically loaded heic2any
      let decodedBlob = item.decodedJpegBlob;

      if (!decodedBlob) {
        const heic2anyModule = await import('heic2any');
        const heic2anyFn: any = heic2anyModule.default || heic2anyModule;

        const res = await heic2anyFn({
          blob: item.file,
          toType: 'image/jpeg',
          quality: qualityRatio
        });

        decodedBlob = Array.isArray(res) ? res[0] : res;
      }

      if (!decodedBlob) {
        throw new Error('Unable to decode this HEIC file. It may be corrupted or use an unsupported encoding.');
      }

      const decodedUrl = URL.createObjectURL(decodedBlob);

      // Step 2: Load into HTML Image element to inspect dimensions & optionally resize/render canvas
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load decoded image into canvas preview.'));
        img.src = decodedUrl;
      });

      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      // Determine output dimensions
      let outW = origW;
      let outH = origH;

      if (preset !== 'original') {
        let maxDim = 0;
        if (preset === '1920') maxDim = 1920;
        else if (preset === '1600') maxDim = 1600;
        else if (preset === '1280') maxDim = 1280;
        else if (preset === '1080') maxDim = 1080;
        else if (preset === '720') maxDim = 720;

        if (maxDim > 0 && (origW > maxDim || origH > maxDim)) {
          if (origW >= origH) {
            outW = maxDim;
            outH = Math.round((origH / origW) * maxDim);
          } else {
            outH = maxDim;
            outW = Math.round((origW / origH) * maxDim);
          }
        } else if (preset === 'custom') {
          const parsedW = parseInt(cW, 10);
          const parsedH = parseInt(cH, 10);

          if (!isNaN(parsedW) && parsedW > 0 && !isNaN(parsedH) && parsedH > 0) {
            outW = parsedW;
            outH = parsedH;
          } else if (!isNaN(parsedW) && parsedW > 0) {
            outW = parsedW;
            outH = aspect ? Math.round((origH / origW) * parsedW) : origH;
          } else if (!isNaN(parsedH) && parsedH > 0) {
            outH = parsedH;
            outW = aspect ? Math.round((origW / origH) * parsedH) : origW;
          }
        }
      }

      // Step 3: Draw on Canvas to apply quality, dimensions, and background color for non-transparent JPG
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D rendering context unavailable.');
      }

      // Fill background color
      ctx.fillStyle = bg || '#FFFFFF';
      ctx.fillRect(0, 0, outW, outH);

      // Draw image
      ctx.drawImage(img, 0, 0, outW, outH);

      // Export JPG Blob
      const finalJpgBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to generate JPG image blob.'));
          },
          'image/jpeg',
          qualityRatio
        );
      });

      const convertedUrl = URL.createObjectURL(finalJpgBlob);

      return {
        ...item,
        status: 'done',
        originalWidth: origW,
        originalHeight: origH,
        outputWidth: outW,
        outputHeight: outH,
        decodedJpegBlob: decodedBlob,
        decodedJpegUrl: decodedUrl,
        convertedBlob: finalJpgBlob,
        convertedUrl,
        convertedSize: finalJpgBlob.size,
        showConvertedPreview: true
      };

    } catch (err: any) {
      console.error('HEIC conversion error:', err);
      let msg = 'Unable to decode this HEIC file. It may be corrupted or use an unsupported encoding.';
      if (err?.message?.includes('out of memory') || err?.name === 'RangeError') {
        msg = 'Your browser ran out of memory while processing this image. Try a smaller file.';
      } else if (err?.message) {
        msg = err.message;
      }

      return {
        ...item,
        status: 'error',
        errorMessage: msg
      };
    }
  };

  const convertBatch = async () => {
    if (!items.length || isProcessing) return;

    setIsProcessing(true);
    setCancelRequested(false);
    setCurrentStage('Reading Files');
    setProgressPercent(5);
    setProcessedCount(0);

    const qualityRatio = quality / 100;
    const workingItems = [...items];

    for (let i = 0; i < workingItems.length; i++) {
      if (cancelRequested) {
        break;
      }

      const item = workingItems[i];
      item.status = 'decoding';
      setCurrentStage('Processing');
      setItems([...workingItems]);

      const updated = await convertSingleHeicItem(
        item,
        qualityRatio,
        dimensionPreset,
        customWidth,
        customHeight,
        maintainAspectRatio,
        bgColor
      );

      workingItems[i] = updated;
      setProcessedCount(i + 1);
      setProgressPercent(Math.round(((i + 1) / workingItems.length) * 95));
      setItems([...workingItems]);
    }

    setCurrentStage('Completed');
    setProgressPercent(100);

    setTimeout(() => {
      setIsProcessing(false);
    }, 400);

    const successfulCount = workingItems.filter((it) => it.status === 'done').length;
    if (successfulCount > 0) {
      onShowToast(`Successfully converted ${successfulCount} ${successfulCount === 1 ? 'image' : 'images'} to JPG!`);
    } else {
      onShowToast('HEIC conversion completed with errors.');
    }
  };

  const convertIndividual = async (id: string) => {
    const itemIndex = items.findIndex((it) => it.id === id);
    if (itemIndex === -1) return;

    const working = [...items];
    working[itemIndex].status = 'decoding';
    setItems([...working]);

    const updated = await convertSingleHeicItem(
      working[itemIndex],
      quality / 100,
      dimensionPreset,
      customWidth,
      customHeight,
      maintainAspectRatio,
      bgColor
    );

    working[itemIndex] = updated;
    setItems([...working]);

    if (updated.status === 'done') {
      onShowToast(`Converted ${updated.file.name} to JPG!`);
    } else {
      onShowToast(updated.errorMessage || 'Failed to convert HEIC image.');
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) {
        if (item.decodedJpegUrl) URL.revokeObjectURL(item.decodedJpegUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.decodedJpegUrl) URL.revokeObjectURL(item.decodedJpegUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
  };

  const getOutputFilename = (originalName: string, index: number): string => {
    const baseName = originalName.replace(/\.(heic|heif|HEIC|HEIF)$/i, '');
    if (index === 0) return `${baseName}.jpg`;
    return `${baseName}-${index + 1}.jpg`;
  };

  const handleDownloadSingle = (item: HeicItem, index: number) => {
    if (!item.convertedBlob || !item.convertedUrl) return;
    const a = document.createElement('a');
    a.href = item.convertedUrl;
    a.download = getOutputFilename(item.file.name, index);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = async () => {
    const completedItems = items.filter((it) => it.status === 'done' && it.convertedBlob);
    if (!completedItems.length) return;

    const zip = new JSZip();
    const usedNames = new Set<string>();

    completedItems.forEach((item, idx) => {
      let filename = getOutputFilename(item.file.name, 0);
      let count = 1;
      while (usedNames.has(filename)) {
        const base = item.file.name.replace(/\.(heic|heif|HEIC|HEIF)$/i, '');
        filename = `${base}-${count}.jpg`;
        count++;
      }
      usedNames.add(filename);

      if (item.convertedBlob) {
        zip.file(filename, item.convertedBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'heic-converted-jpgs.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl);

    onShowToast('Downloaded all JPG images in ZIP archive!');
  };

  const setQualityPresetValue = (preset: QualityPreset) => {
    switch (preset) {
      case 'low': setQuality(30); break;
      case 'medium': setQuality(60); break;
      case 'high': setQuality(80); break;
      case 'very-high': setQuality(90); break;
      case 'max': setQuality(100); break;
    }
  };

  const completedCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SEO Head */}
      <SEOHead
        title="HEIC to JPG Converter - Convert HEIC Images to JPG Online"
        description="Convert HEIC and HEIF images to JPG directly in your browser. Batch convert HEIC files, adjust JPG quality and download your images without uploading them to a server."
        canonicalPath="/heic-to-jpg.html"
        faqs={[
          {
            question: "What is a HEIC file?",
            answer: "HEIC (High Efficiency Image Container) is the default photo format used by Apple iOS (iPhone/iPad) and macOS devices. It provides high quality at reduced file sizes, but is not natively supported by all browsers and Windows applications."
          },
          {
            question: "How do I convert HEIC to JPG?",
            answer: "Simply upload your .HEIC or .HEIF images using our drag-and-drop tool above, select your desired JPG quality or dimensions, and click Convert to JPG. Your images will be converted instantly."
          },
          {
            question: "Can I convert HEIC files on iPhone?",
            answer: "Yes! Zubware HEIC to JPG Converter works directly in mobile browsers on iOS (iPhone/iPad), Android, and desktop without installing any software or app."
          },
          {
            question: "Can I convert multiple HEIC files?",
            answer: "Yes, you can batch convert dozens of HEIC files at once and download them individually or as a single ZIP archive."
          },
          {
            question: "Are my HEIC images uploaded to a server?",
            answer: "No. All conversion is processed 100% locally inside your web browser using WebAssembly. Your images never leave your device or get uploaded to any external server."
          },
          {
            question: "Can I adjust JPG quality?",
            answer: "Yes, you can choose from preset quality levels (Low, Medium, High, Very High, Maximum) or adjust the quality slider from 10% to 100%."
          },
          {
            question: "Can I resize the converted image?",
            answer: "Yes, you can preserve the original dimensions or resize to popular resolutions like 1920px, 1600px, 1280px, 1080px, 720px, or enter custom dimensions."
          },
          {
            question: "Does the converter work offline?",
            answer: "Yes! Once the webpage and decoder assets are loaded into your browser cache, the converter can operate completely offline."
          },
          {
            question: "Why can't my browser open a HEIC file natively?",
            answer: "Most web browsers (like Chrome, Firefox, and Edge) lack native HEIC image decoding codecs due to licensing constraints. Zubware uses a client-side WebAssembly decoder to render HEIC images safely in any browser."
          }
        ]}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <BackButton onNavigate={(p) => onNavigate ? onNavigate(p) : window.history.back()} />
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Image Tools', path: '/#category-image-tools' },
              { label: 'HEIC to JPG Converter' }
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Tool Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          100% Client-Side & Private
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          HEIC to JPG Converter
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Convert HEIC and HEIF images to JPG directly in your browser.
        </p>
      </div>

      {/* Local Processing Privacy Notice */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">Private & Local:</span> Your HEIC images are processed directly in your browser and are not uploaded to Zubware or any third-party server.
        </div>
      </div>

      {/* Upload Dropzone Area */}
      <div className="glass-panel p-6 rounded-2xl">
        <ImageUploadArea
          onImageSelected={handleFilesSelected}
          accept=".heic,.HEIC,.heif,.HEIF,image/heic,image/heif,image/heic-sequence,image/heif-sequence"
          multiple={true}
          title="Drop HEIC files here"
          subtitle="or click to browse from iPhone, Android or Desktop"
          showCamera={true}
          showClipboard={true}
        />
      </div>

      {/* Controls & Options Panel (Shown when files are uploaded) */}
      {items.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversion Settings</h2>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All ({items.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quality Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  JPG Quality: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{quality}%</span>
                </label>
              </div>

              {/* Quality Presets */}
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'low', label: 'Low', val: 30 },
                  { id: 'medium', label: 'Med', val: 60 },
                  { id: 'high', label: 'High', val: 80 },
                  { id: 'very-high', label: 'V.High', val: 90 },
                  { id: 'max', label: 'Max', val: 100 }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setQualityPresetValue(p.id as QualityPreset)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all text-center ${
                      quality === p.val
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Dimension Resizing */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Image Dimensions / Resizing
              </label>
              <select
                value={dimensionPreset}
                onChange={(e) => setDimensionPreset(e.target.value as DimensionPreset)}
                className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="original">Original Dimensions (Default)</option>
                <option value="1920">Max 1920px Width/Height</option>
                <option value="1600">Max 1600px Width/Height</option>
                <option value="1280">Max 1280px Width/Height</option>
                <option value="1080">Max 1080px Width/Height</option>
                <option value="720">Max 720px Width/Height</option>
                <option value="custom">Custom Dimensions...</option>
              </select>

              {dimensionPreset === 'custom' && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400">Width (px)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1920"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400">Height (px)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1080"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Maintain Aspect Ratio
                  </label>
                </div>
              )}
            </div>

            {/* Transparency Background Fill & EXIF */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Transparency Background Fill
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="bgColor"
                    value="#FFFFFF"
                    checked={bgColor === '#FFFFFF'}
                    onChange={() => setBgColor('#FFFFFF')}
                    className="text-indigo-600"
                  />
                  White
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="bgColor"
                    value="#000000"
                    checked={bgColor === '#000000'}
                    onChange={() => setBgColor('#000000')}
                    className="text-indigo-600"
                  />
                  Black
                </label>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-slate-300 dark:border-slate-600 p-0"
                  />
                  Custom
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeMetadata}
                    onChange={(e) => setRemoveMetadata(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    Remove Metadata for Privacy
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Re-encoding via browser canvas automatically strips EXIF metadata for privacy.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Global Action Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} {items.length === 1 ? 'file' : 'files'} selected • {completedCount} converted
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={convertBatch}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Converting...' : items.length === 1 ? 'Convert to JPG' : 'Convert All'}
              </button>

              {completedCount > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <FileArchive className="w-4 h-4" />
                  Download All as ZIP
                </button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="pt-2">
              <ImageProcessingProgress
                stage={currentStage}
                progress={progressPercent}
              />
            </div>
          )}
        </div>
      )}

      {/* File Cards List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            Uploaded Images ({items.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-xl space-y-4 border border-slate-200/50 dark:border-slate-800/50 relative"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail / Preview Switcher */}
                  <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative group">
                    {item.convertedUrl && item.showConvertedPreview ? (
                      <img
                        src={item.convertedUrl}
                        alt="Converted Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : item.decodedJpegUrl ? (
                      <img
                        src={item.decodedJpegUrl}
                        alt="Original Decoded Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-[10px] text-slate-500 mt-1 block">HEIC</span>
                      </div>
                    )}

                    {/* Preview Switch Button if both URLs exist */}
                    {item.convertedUrl && item.decodedJpegUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setItems((prev) =>
                            prev.map((it) =>
                              it.id === item.id
                                ? { ...it, showConvertedPreview: !it.showConvertedPreview }
                                : it
                            )
                          );
                        }}
                        className="absolute bottom-1 right-1 p-1 rounded bg-black/60 hover:bg-black/80 text-white text-[10px] flex items-center gap-1 transition-opacity"
                        title="Toggle Original vs Converted Preview"
                      >
                        {item.showConvertedPreview ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* File Metadata */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={item.file.name}>
                        {item.file.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <div>Size: <span className="text-slate-700 dark:text-slate-300 font-medium">{formatBytes(item.file.size)}</span></div>
                      <div>Type: <span className="text-slate-700 dark:text-slate-300 font-medium">HEIC/HEIF</span></div>

                      {item.originalWidth && item.originalHeight && (
                        <div>Original: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.originalWidth}×{item.originalHeight}</span></div>
                      )}

                      {item.outputWidth && item.outputHeight && (
                        <div>Output: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.outputWidth}×{item.outputHeight}</span></div>
                      )}
                    </div>

                    {/* Conversion Status Badge */}
                    <div className="pt-1">
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Ready
                        </span>
                      )}
                      {item.status === 'decoding' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Decoding HEIC...
                        </span>
                      )}
                      {item.status === 'done' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Converted to JPG
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </div>

                    {/* Size Comparison */}
                    {item.convertedSize && (
                      <div className="text-xs pt-1">
                        {item.convertedSize < item.file.size ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Converted: {formatBytes(item.convertedSize)} ({Math.round((1 - item.convertedSize / item.file.size) * 100)}% smaller)
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Converted file size: {formatBytes(item.convertedSize)}
                          </span>
                        )}
                      </div>
                    )}

                    {item.errorMessage && (
                      <div className="text-xs text-rose-600 dark:text-rose-400 pt-1">
                        {item.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => convertIndividual(item.id)}
                    disabled={isProcessing || item.status === 'decoding'}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {item.status === 'done' ? 'Re-convert' : 'Convert'}
                  </button>

                  {item.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item, index)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download JPG
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Large File Warning Modal */}
      {largeFileWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl space-y-4 border border-amber-500/30 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Large File Warning</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Some of your selected HEIC images are larger than 30 MB. Processing very large images locally in your browser may require significant device memory.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelLargeFiles}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLargeFiles}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about HEIC to JPG conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">What is a HEIC file?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              HEIC is Apple's high-efficiency image container format used on iPhones and iPads. It offers half the file size of JPG at similar visual quality.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">How do I convert HEIC to JPG?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Drag and drop your HEIC files into the box above, adjust quality or dimension settings if desired, and click Convert. You can download the JPGs instantly.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I convert HEIC files on iPhone?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes, our converter is fully optimized for mobile browsers on iOS, iPadOS, Android, and desktop.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I convert multiple HEIC files?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes! You can select multiple HEIC images, batch convert them simultaneously, and download all converted JPGs in a single ZIP file.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Are my HEIC images uploaded?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No. All decoding and conversion happen locally inside your web browser. Your images are never sent to any server.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I adjust JPG quality and dimensions?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes, you can adjust the JPG quality from 10% to 100% or pick preset options like 1920px, 1080px, or custom width and height.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related Image Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Batch Converter', path: '/batch-image-converter.html', icon: '⚡' },
            { title: 'Image Compressor', path: '/image-compressor.html', icon: '🗜️' },
            { title: 'Image Resizer', path: '/image-resizer.html', icon: '📐' },
            { title: 'Image Converter', path: '/image-converter.html', icon: '🔄' }
          ].map((t) => (
            <a
              key={t.path}
              href={getLinkUrl(t.path)}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate(t.path);
              }}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2.5 text-xs font-medium text-slate-900 dark:text-white"
            >
              <span className="text-base">{t.icon}</span>
              <span className="truncate">{t.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
