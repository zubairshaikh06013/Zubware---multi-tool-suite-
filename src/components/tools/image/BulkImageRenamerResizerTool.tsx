import React, { useState, useRef, useEffect } from 'react';
import { 
  RefreshCw, Download, FileArchive, ShieldCheck, Sliders, Image as ImageIcon,
  AlertTriangle, Trash2, CheckCircle2, ArrowUp, ArrowDown, Eye, Layers, Type,
  Sparkles, Grid, Tag, SlidersHorizontal, FileText, RotateCcw, X
} from 'lucide-react';
import JSZip from 'jszip';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';
import { formatBytes } from '../../../lib/imageUtils';

interface BulkImageRenamerResizerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export interface BulkImageItem {
  id: string;
  file: File;
  previewUrl: string;
  origWidth: number;
  origHeight: number;
  origSize: number;
  
  // Dynamic output properties calculated/processed
  calculatedName: string;
  outWidth: number;
  outHeight: number;
  outFormat: 'jpg' | 'png' | 'webp';
  
  // Processed results
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  processedBlob?: Blob;
  processedUrl?: string;
  processedSize?: number;
}

type NamingPreset = 'product' | 'image' | 'photo' | 'property' | 'listing' | 'item' | 'name-number' | 'custom';
type DimensionPreset = 'original' | '3840' | '2560' | '1920' | '1600' | '1280' | '1080' | '720' | '480' | 'custom' |
  'ig-post' | 'ig-story' | 'yt-thumb' | 'fb-post' | 'wa-status' |
  'ecom-market' | 'ecom-sq' | 'ecom-listing' | 'ecom-cat' |
  'prop-list' | 'prop-gal' | 'prop-sq' | 'prop-land' | 'prop-port';

type FitMode = 'contain' | 'cover' | 'stretch' | 'crop';
type CropPos = 'center' | 'top' | 'bottom' | 'left' | 'right';
type CaseTransform = 'none' | 'lowercase' | 'uppercase' | 'titlecase';
type SpaceReplace = 'keep' | 'hyphen' | 'underscore' | 'remove';
type OutputFormatChoice = 'original' | 'jpg' | 'png' | 'webp';

export const BulkImageRenamerResizerTool: React.FC<BulkImageRenamerResizerToolProps> = ({ onShowToast, onNavigate }) => {
  const [items, setItems] = useState<BulkImageItem[]>([]);

  // --- RENAMING SETTINGS ---
  const [namingPreset, setNamingPreset] = useState<NamingPreset>('product');
  const [baseName, setBaseName] = useState<string>('product');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [startingNumber, setStartingNumber] = useState<number>(1);
  const [zeroPadding, setZeroPadding] = useState<number>(3); // 001
  const [separator, setSeparator] = useState<string>('-');
  const [customPattern, setCustomPattern] = useState<string>('{base}-{number}');
  
  // Advanced Renaming
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [spaceHandling, setSpaceHandling] = useState<SpaceReplace>('hyphen');
  const [casingTransform, setCasingTransform] = useState<CaseTransform>('none');
  const [removeSpecialChars, setRemoveSpecialChars] = useState<boolean>(false);

  // --- RESIZING SETTINGS ---
  const [dimPreset, setDimPreset] = useState<DimensionPreset>('original');
  const [targetWidth, setTargetWidth] = useState<string>('1920');
  const [targetHeight, setTargetHeight] = useState<string>('1080');
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [allowUpscaling, setAllowUpscaling] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [cropPos, setCropPos] = useState<CropPos>('center');

  // --- FORMAT & QUALITY SETTINGS ---
  const [outputFormat, setOutputFormat] = useState<OutputFormatChoice>('original');
  const [jpgQuality, setJpgQuality] = useState<number>(90);
  const [webpQuality, setWebpQuality] = useState<number>(90);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // --- GENERAL / ZIP SETTINGS ---
  const [zipName, setZipName] = useState<string>('zubware-processed-images');

  // --- PROCESSING STATE ---
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('Reading Files');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [largeBatchWarning, setLargeBatchWarning] = useState<File[] | null>(null);

  // --- PREVIEW MODAL STATE ---
  const [previewItem, setPreviewItem] = useState<BulkImageItem | null>(null);

  // Load image dimensions helper
  const loadImageInfo = (file: File): Promise<{ width: number; height: number; previewUrl: string }> => {
    return new Promise((resolve) => {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          previewUrl
        });
      };
      img.onerror = () => {
        resolve({
          width: 0,
          height: 0,
          previewUrl
        });
      };
      img.src = previewUrl;
    });
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!files || !files.length) return;

    // Check large batch warning (>50 files or >100MB)
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    if (files.length > 50 || totalBytes > 100 * 1024 * 1024) {
      setLargeBatchWarning(files);
      return;
    }

    await addFilesToBatch(files);
  };

  const addFilesToBatch = async (files: File[]) => {
    const newItems: BulkImageItem[] = [];

    for (const file of files) {
      // Check HEIC file handling if selected
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      let info = { width: 0, height: 0, previewUrl: '' };

      if (isHeic) {
        try {
          const heic2anyModule = await import('heic2any');
          const heic2anyFn: any = heic2anyModule.default || heic2anyModule;
          const res = await heic2anyFn({ blob: file, toType: 'image/jpeg', quality: 0.8 });
          const decodedBlob = Array.isArray(res) ? res[0] : res;
          info = await loadImageInfo(new File([decodedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' }));
        } catch {
          info = { width: 0, height: 0, previewUrl: '' };
        }
      } else {
        info = await loadImageInfo(file);
      }

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: info.previewUrl,
        origWidth: info.width,
        origHeight: info.height,
        origSize: file.size,
        calculatedName: file.name,
        outWidth: info.width,
        outHeight: info.height,
        outFormat: 'jpg',
        status: 'pending'
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    onShowToast(`Added ${files.length} images to batch list.`);
  };

  // Preset switch handler
  const handleNamingPresetChange = (preset: NamingPreset) => {
    setNamingPreset(preset);
    switch (preset) {
      case 'product':
        setBaseName('product');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'image':
        setBaseName('image');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'photo':
        setBaseName('photo');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'property':
        setBaseName('property');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'listing':
        setBaseName('listing');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'item':
        setBaseName('item');
        setSeparator('-');
        setPrefix('');
        setSuffix('');
        break;
      case 'name-number':
        setCustomPattern('{name}-{number}');
        break;
      default:
        break;
    }
  };

  // Preset dimension switch handler
  const handleDimensionPresetChange = (preset: DimensionPreset) => {
    setDimPreset(preset);
    switch (preset) {
      case '3840': setTargetWidth('3840'); setTargetHeight('2160'); setMaintainAspect(true); break;
      case '2560': setTargetWidth('2560'); setTargetHeight('1440'); setMaintainAspect(true); break;
      case '1920': setTargetWidth('1920'); setTargetHeight('1080'); setMaintainAspect(true); break;
      case '1600': setTargetWidth('1600'); setTargetHeight('1200'); setMaintainAspect(true); break;
      case '1280': setTargetWidth('1280'); setTargetHeight('720'); setMaintainAspect(true); break;
      case '1080': setTargetWidth('1080'); setTargetHeight('1080'); setMaintainAspect(true); break;
      case '720': setTargetWidth('720'); setTargetHeight('480'); setMaintainAspect(true); break;
      case '480': setTargetWidth('480'); setTargetHeight('320'); setMaintainAspect(true); break;

      // Social Media
      case 'ig-post': setTargetWidth('1080'); setTargetHeight('1080'); setMaintainAspect(false); setFitMode('crop'); break;
      case 'ig-story': setTargetWidth('1080'); setTargetHeight('1920'); setMaintainAspect(false); setFitMode('crop'); break;
      case 'yt-thumb': setTargetWidth('1280'); setTargetHeight('720'); setMaintainAspect(true); break;
      case 'fb-post': setTargetWidth('1200'); setTargetHeight('630'); setMaintainAspect(false); setFitMode('crop'); break;
      case 'wa-status': setTargetWidth('1080'); setTargetHeight('1920'); setMaintainAspect(false); setFitMode('crop'); break;

      // E-commerce
      case 'ecom-market': setTargetWidth('1200'); setTargetHeight('1200'); setMaintainAspect(true); break;
      case 'ecom-sq': setTargetWidth('1000'); setTargetHeight('1000'); setMaintainAspect(true); break;
      case 'ecom-listing': setTargetWidth('1600'); setTargetHeight('1600'); setMaintainAspect(true); break;
      case 'ecom-cat': setTargetWidth('800'); setTargetHeight('800'); setMaintainAspect(true); break;

      // Real Estate
      case 'prop-list': setTargetWidth('1920'); setTargetHeight('1080'); setMaintainAspect(true); break;
      case 'prop-gal': setTargetWidth('1280'); setTargetHeight('853'); setMaintainAspect(true); break;
      case 'prop-sq': setTargetWidth('1080'); setTargetHeight('1080'); setMaintainAspect(true); break;
      case 'prop-land': setTargetWidth('1600'); setTargetHeight('1200'); setMaintainAspect(true); break;
      case 'prop-port': setTargetWidth('1080'); setTargetHeight('1350'); setMaintainAspect(true); break;
      default: break;
    }
  };

  // Compute live output filename for item at index
  const computeFilename = (item: BulkImageItem, index: number): string => {
    const rawExt = item.file.name.split('.').pop() || 'jpg';
    let targetExt = rawExt.toLowerCase();

    if (outputFormat === 'jpg') targetExt = 'jpg';
    else if (outputFormat === 'png') targetExt = 'png';
    else if (outputFormat === 'webp') targetExt = 'webp';

    const origBaseName = item.file.name.replace(/\.[^/.]+$/, '');
    const numVal = startingNumber + index;
    const formattedNumber = String(numVal).padStart(zeroPadding, '0');

    let resultName = '';

    if (namingPreset === 'custom' || namingPreset === 'name-number') {
      let pattern = customPattern;
      if (namingPreset === 'name-number') pattern = '{name}-{number}';

      resultName = pattern
        .replace(/\{base\}/g, baseName)
        .replace(/\{name\}/g, origBaseName)
        .replace(/\{number\}/g, formattedNumber)
        .replace(/\{ext\}/g, targetExt)
        .replace(/\{width\}/g, String(item.origWidth))
        .replace(/\{height\}/g, String(item.origHeight))
        .replace(/\{date\}/g, new Date().toISOString().split('T')[0]);
    } else {
      let core = `${baseName}${separator}${formattedNumber}`;
      if (prefix) core = `${prefix}${separator}${core}`;
      if (suffix) core = `${core}${separator}${suffix}`;
      resultName = core;
    }

    // Advanced manipulations
    if (findText) {
      resultName = resultName.replaceAll(findText, replaceText);
    }

    if (spaceHandling === 'hyphen') {
      resultName = resultName.replace(/\s+/g, '-');
    } else if (spaceHandling === 'underscore') {
      resultName = resultName.replace(/\s+/g, '_');
    } else if (spaceHandling === 'remove') {
      resultName = resultName.replace(/\s+/g, '');
    }

    if (casingTransform === 'lowercase') {
      resultName = resultName.toLowerCase();
    } else if (casingTransform === 'uppercase') {
      resultName = resultName.toUpperCase();
    } else if (casingTransform === 'titlecase') {
      resultName = resultName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    }

    if (removeSpecialChars) {
      resultName = resultName.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    // Clean multiple separators
    resultName = resultName.replace(/--+/g, '-').replace(/__+/g, '_');

    return `${resultName}.${targetExt}`;
  };

  // Reorder helpers
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
    });
    setItems([]);
  };

  // Core processing for an individual item
  const processSingleItem = async (
    item: BulkImageItem,
    outFilename: string
  ): Promise<BulkImageItem> => {
    try {
      // Step 1: Load image into HTML Image
      let imgSource = item.file;
      const isHeic = item.file.name.toLowerCase().endsWith('.heic') || item.file.name.toLowerCase().endsWith('.heif');

      if (isHeic) {
        const heic2anyModule = await import('heic2any');
        const heic2anyFn: any = heic2anyModule.default || heic2anyModule;
        const res = await heic2anyFn({ blob: item.file, toType: 'image/jpeg', quality: 0.9 });
        imgSource = Array.isArray(res) ? res[0] : res;
      }

      const imgUrl = URL.createObjectURL(imgSource);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for processing.'));
        img.src = imgUrl;
      });

      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      // Step 2: Compute target dimensions
      let reqW = parseInt(targetWidth, 10) || origW;
      let reqH = parseInt(targetHeight, 10) || origH;

      if (dimPreset === 'original') {
        reqW = origW;
        reqH = origH;
      }

      let finalW = origW;
      let finalH = origH;

      if (dimPreset !== 'original') {
        if (maintainAspect) {
          if (origW >= origH) {
            finalW = reqW;
            finalH = Math.round((origH / origW) * reqW);
          } else {
            finalH = reqH;
            finalW = Math.round((origW / origH) * reqH);
          }
        } else {
          finalW = reqW;
          finalH = reqH;
        }

        // Prevent upscaling unless allowed
        if (!allowUpscaling) {
          if (finalW > origW || finalH > origH) {
            finalW = Math.min(finalW, origW);
            finalH = Math.min(finalH, origH);
          }
        }
      }

      // Step 3: Draw on canvas
      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to initialize canvas 2D context.');

      // Determine output format & quality
      let exportMime = 'image/jpeg';
      let exportQuality = jpgQuality / 100;

      const ext = outFilename.split('.').pop()?.toLowerCase();
      if (ext === 'png') {
        exportMime = 'image/png';
        exportQuality = 1.0;
      } else if (ext === 'webp') {
        exportMime = 'image/webp';
        exportQuality = webpQuality / 100;
      } else {
        exportMime = 'image/jpeg';
        exportQuality = jpgQuality / 100;
      }

      // Fill background if JPG or background specified
      if (exportMime === 'image/jpeg' || bgColor) {
        ctx.fillStyle = bgColor || '#FFFFFF';
        ctx.fillRect(0, 0, finalW, finalH);
      }

      // Draw according to fit mode
      if (fitMode === 'crop' && (finalW !== origW || finalH !== origH)) {
        // Center crop math
        const scale = Math.max(finalW / origW, finalH / origH);
        const nw = origW * scale;
        const nh = origH * scale;
        let nx = (finalW - nw) / 2;
        let ny = (finalH - nh) / 2;

        if (cropPos === 'top') ny = 0;
        else if (cropPos === 'bottom') ny = finalH - nh;
        else if (cropPos === 'left') nx = 0;
        else if (cropPos === 'right') nx = finalW - nw;

        ctx.drawImage(img, nx, ny, nw, nh);
      } else {
        ctx.drawImage(img, 0, 0, finalW, finalH);
      }

      URL.revokeObjectURL(imgUrl);

      // Export Blob
      const processedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to export canvas blob.'));
          },
          exportMime,
          exportQuality
        );
      });

      const processedUrl = URL.createObjectURL(processedBlob);

      return {
        ...item,
        status: 'done',
        calculatedName: outFilename,
        outWidth: finalW,
        outHeight: finalH,
        processedBlob,
        processedUrl,
        processedSize: processedBlob.size
      };

    } catch (err: any) {
      console.error(`Error processing ${item.file.name}:`, err);
      return {
        ...item,
        status: 'error',
        errorMessage: err?.message || 'Failed to process image.'
      };
    }
  };

  // Process all files batch
  const processBatch = async () => {
    if (!items.length || isProcessing) return;

    setIsProcessing(true);
    setCurrentStage('Reading Files');
    setProgressPercent(5);
    setProcessedCount(0);

    const working = [...items];

    // Detect duplicate names and resolve
    const nameCountMap: Record<string, number> = {};

    for (let i = 0; i < working.length; i++) {
      const item = working[i];
      let name = computeFilename(item, i);

      if (nameCountMap[name]) {
        const ext = name.split('.').pop();
        const base = name.replace(/\.[^/.]+$/, '');
        const count = nameCountMap[name]++;
        name = `${base}-${count}.${ext}`;
      } else {
        nameCountMap[name] = 1;
      }

      working[i].status = 'processing';
      working[i].calculatedName = name;
      setCurrentStage('Processing');
      setItems([...working]);

      const updated = await processSingleItem(working[i], name);
      working[i] = updated;

      setProcessedCount(i + 1);
      setProgressPercent(Math.round(((i + 1) / working.length) * 95));
      setItems([...working]);
    }

    setCurrentStage('Completed');
    setProgressPercent(100);

    setTimeout(() => {
      setIsProcessing(false);
    }, 400);

    const successCount = working.filter((it) => it.status === 'done').length;
    onShowToast(`Processed ${successCount} of ${working.length} images successfully!`);
  };

  // Download individual file
  const handleDownloadSingle = (item: BulkImageItem) => {
    if (!item.processedBlob || !item.processedUrl) return;
    const a = document.createElement('a');
    a.href = item.processedUrl;
    a.download = item.calculatedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.processedBlob);
    if (!doneItems.length) return;

    const zip = new JSZip();
    doneItems.forEach((item) => {
      if (item.processedBlob) {
        zip.file(item.calculatedName, item.processedBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl);

    onShowToast('Downloaded all processed images in ZIP archive!');
  };

  // Stats calculation
  const completedItems = items.filter((it) => it.status === 'done');
  const totalOrigSize = completedItems.reduce((acc, it) => acc + it.origSize, 0);
  const totalOutSize = completedItems.reduce((acc, it) => acc + (it.processedSize || 0), 0);
  const totalSavingsBytes = Math.max(0, totalOrigSize - totalOutSize);
  const totalSavingsPct = totalOrigSize > 0 ? Math.round((totalSavingsBytes / totalOrigSize) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SEO Head */}
      <SEOHead
        title="Bulk Image Renamer & Resizer - Rename & Resize Images Online"
        description="Rename and resize multiple images at once. Bulk rename product photos, property images and other files, change dimensions, convert formats and download everything as a ZIP directly in your browser."
        canonicalPath="/bulk-image-renamer-resizer.html"
        faqs={[
          {
            question: "Can I rename multiple images at once?",
            answer: "Yes! You can rename dozens or hundreds of images at once using custom patterns, prefixes, suffixes, base names, and zero-padded sequential numbers."
          },
          {
            question: "Can I resize 100 images at once?",
            answer: "Yes, you can upload 100 or more images, choose preset resolutions (like 1920px, 1080px, Instagram, Marketplace) or custom dimensions, and resize all images simultaneously."
          },
          {
            question: "Can I rename product photos in bulk?",
            answer: "Absolutely. E-commerce sellers can quickly format product photos (e.g. product-001.jpg, product-002.jpg) with consistent dimensions for Amazon, Shopify, eBay, and Etsy."
          },
          {
            question: "Can I resize property photos in bulk?",
            answer: "Yes, real-estate agents and property dealers can batch rename and resize gallery photos (e.g. property-001.jpg, 1920x1080) in seconds."
          },
          {
            question: "Can I convert JPG to WebP in bulk?",
            answer: "Yes, you can select WebP, JPG, or PNG as your bulk output format with customizable quality controls."
          },
          {
            question: "Can I download all images as ZIP?",
            answer: "Yes! Once processing is complete, you can download all converted images in a single compressed ZIP file generated locally inside your browser."
          },
          {
            question: "Are my images uploaded to a server?",
            answer: "No. All renaming, resizing, format conversion, and ZIP archiving take place 100% locally inside your web browser. Your images never get uploaded to any server."
          },
          {
            question: "Can I use this tool on my phone?",
            answer: "Yes, Zubware Bulk Image Renamer & Resizer is fully responsive and optimized for touch devices on Android, iPhone, iPad, and desktop."
          },
          {
            question: "What happens if one image fails?",
            answer: "If a corrupted or unsupported file fails, Zubware marks that individual file as failed and continues processing all remaining images in the batch."
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
              { label: 'Bulk Image Renamer & Resizer' }
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-4 h-4" />
          Pro E-commerce & Property Photo Utility
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bulk Image Renamer & Resizer
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Rename, resize and optimize multiple images at once — directly in your browser.
        </p>
      </div>

      {/* Privacy Banner */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">100% Private & Local:</span> Your images are processed directly in your browser. They are never uploaded to Zubware or any external server.
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="glass-panel p-6 rounded-2xl">
        <ImageUploadArea
          onImageSelected={handleFilesSelected}
          accept="image/*,.heic,.heif"
          multiple={true}
          title="Drop 10, 50, 100 or more images here"
          subtitle="Support JPG, PNG, WEBP, GIF, HEIC/HEIF • Fast Local Batch Processing"
          showCamera={true}
          showClipboard={true}
        />
      </div>

      {/* Main Configuration Panels (When images are uploaded) */}
      {items.length > 0 && (
        <div className="space-y-6">
          {/* Top Global Bar */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                {items.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {items.length} {items.length === 1 ? 'Image' : 'Images'} Selected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready for bulk renaming, resizing, and format optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Clear Batch
              </button>

              <button
                type="button"
                onClick={processBatch}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Processing Batch...' : 'Process All Images'}
              </button>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PANEL 1: BULK RENAMING */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Type className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Bulk Renaming</h2>
              </div>

              {/* Naming Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Preset Pattern</label>
                <select
                  value={namingPreset}
                  onChange={(e) => handleNamingPresetChange(e.target.value as NamingPreset)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="product">product-{'{number}'} (E-commerce)</option>
                  <option value="property">property-{'{number}'} (Real Estate)</option>
                  <option value="image">image-{'{number}'}</option>
                  <option value="photo">photo-{'{number}'}</option>
                  <option value="listing">listing-{'{number}'}</option>
                  <option value="item">item-{'{number}'}</option>
                  <option value="name-number">{'{name}'}-{'{number}'}</option>
                  <option value="custom">Custom Pattern...</option>
                </select>
              </div>

              {/* Inputs */}
              {namingPreset === 'custom' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Pattern</label>
                  <input
                    type="text"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    placeholder="e.g. {base}-{number}"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-500">Variables: {'{name}, {number}, {ext}, {date}, {width}, {height}'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">Base Name</label>
                      <input
                        type="text"
                        value={baseName}
                        onChange={(e) => setBaseName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Separator</label>
                      <select
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="-">Hyphen (-)</option>
                        <option value="_">Underscore (_)</option>
                        <option value=" ">Space ( )</option>
                        <option value="">None</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">Prefix (Optional)</label>
                      <input
                        type="text"
                        value={prefix}
                        placeholder="e.g. shop"
                        onChange={(e) => setPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Suffix (Optional)</label>
                      <input
                        type="text"
                        value={suffix}
                        placeholder="e.g. v1"
                        onChange={(e) => setSuffix(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Numbering Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] text-slate-500">Start Number</label>
                  <input
                    type="number"
                    value={startingNumber}
                    onChange={(e) => setStartingNumber(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Zero Padding</label>
                  <select
                    value={zeroPadding}
                    onChange={(e) => setZeroPadding(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value={1}>1 (1, 2, 3)</option>
                    <option value={2}>2 (01, 02, 03)</option>
                    <option value={3}>3 (001, 002, 003)</option>
                    <option value={4}>4 (0001, 0002)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Renaming Options */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Advanced Text Adjustments</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Find text..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="w-full px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="w-full px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={spaceHandling}
                    onChange={(e) => setSpaceHandling(e.target.value as SpaceReplace)}
                    className="w-full px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="hyphen">Spaces → Hyphens (-)</option>
                    <option value="underscore">Spaces → Underscores (_)</option>
                    <option value="keep">Keep Spaces</option>
                    <option value="remove">Remove Spaces</option>
                  </select>

                  <select
                    value={casingTransform}
                    onChange={(e) => setCasingTransform(e.target.value as CaseTransform)}
                    className="w-full px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="none">Original Case</option>
                    <option value="lowercase">lowercase</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="titlecase">Title Case</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PANEL 2: BULK RESIZING */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Sliders className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Bulk Resizing</h2>
              </div>

              {/* Dimension Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dimension Preset</label>
                <select
                  value={dimPreset}
                  onChange={(e) => handleDimensionPresetChange(e.target.value as DimensionPreset)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <optgroup label="Standard Sizes">
                    <option value="original">Original Dimensions (No Resize)</option>
                    <option value="3840">3840 × 2160 (4K UHD)</option>
                    <option value="2560">2560 × 1440 (2K QHD)</option>
                    <option value="1920">1920 × 1080 (Full HD)</option>
                    <option value="1600">1600 × 1200</option>
                    <option value="1280">1280 × 720 (HD)</option>
                    <option value="1080">1080 × 1080 (Square)</option>
                    <option value="720">720 × 480</option>
                  </optgroup>

                  <optgroup label="E-Commerce Presets">
                    <option value="ecom-market">Marketplace Product (1200 × 1200)</option>
                    <option value="ecom-sq">Square Product (1000 × 1000)</option>
                    <option value="ecom-listing">Product Listing (1600 × 1600)</option>
                    <option value="ecom-cat">Catalog Image (800 × 800)</option>
                  </optgroup>

                  <optgroup label="Property & Real Estate">
                    <option value="prop-list">Property Listing (1920 × 1080)</option>
                    <option value="prop-gal">Property Gallery (1280 × 853)</option>
                    <option value="prop-sq">Square Property (1080 × 1080)</option>
                    <option value="prop-land">Landscape Property (1600 × 1200)</option>
                    <option value="prop-port">Portrait Property (1080 × 1350)</option>
                  </optgroup>

                  <optgroup label="Social Media">
                    <option value="ig-post">Instagram Post (1080 × 1080)</option>
                    <option value="ig-story">Instagram Story (1080 × 1920)</option>
                    <option value="yt-thumb">YouTube Thumbnail (1280 × 720)</option>
                    <option value="fb-post">Facebook Post (1200 × 630)</option>
                    <option value="wa-status">WhatsApp Status (1080 × 1920)</option>
                  </optgroup>
                </select>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500">Max Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => {
                      setTargetWidth(e.target.value);
                      setDimPreset('custom');
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Max Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => {
                      setTargetHeight(e.target.value);
                      setDimPreset('custom');
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Fit Mode & Aspect Ratio */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500">Fit Mode</label>
                    <select
                      value={fitMode}
                      onChange={(e) => setFitMode(e.target.value as FitMode)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="contain">Contain (Fit)</option>
                      <option value="crop">Crop (Fill)</option>
                      <option value="stretch">Stretch</option>
                    </select>
                  </div>

                  {fitMode === 'crop' && (
                    <div>
                      <label className="text-[11px] text-slate-500">Crop Alignment</label>
                      <select
                        value={cropPos}
                        onChange={(e) => setCropPos(e.target.value as CropPos)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintainAspect}
                      onChange={(e) => setMaintainAspect(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Maintain Aspect Ratio
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowUpscaling}
                      onChange={(e) => setAllowUpscaling(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Allow Upscaling Smaller Images
                  </label>
                </div>
              </div>
            </div>

            {/* PANEL 3: FORMAT & QUALITY */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Format & Quality</h2>
              </div>

              {/* Output Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bulk Output Format</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'original', label: 'Original' },
                    { id: 'jpg', label: 'JPG' },
                    { id: 'webp', label: 'WEBP' },
                    { id: 'png', label: 'PNG' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOutputFormat(f.id as OutputFormatChoice)}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        outputFormat === f.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Sliders */}
              {(outputFormat === 'jpg' || outputFormat === 'original') && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">JPG Quality</label>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{jpgQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={jpgQuality}
                    onChange={(e) => setJpgQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {outputFormat === 'webp' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">WEBP Compression</label>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{webpQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={webpQuality}
                    onChange={(e) => setWebpQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Background fill */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Background Fill Color</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bulkBgColor"
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
                      name="bulkBgColor"
                      value="#000000"
                      checked={bgColor === '#000000'}
                      onChange={() => setBgColor('#000000')}
                      className="text-indigo-600"
                    />
                    Black
                  </label>
                  <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border p-0"
                    />
                    Custom
                  </div>
                </div>
              </div>

              {/* ZIP Filename */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ZIP Export Filename</label>
                <input
                  type="text"
                  value={zipName}
                  onChange={(e) => setZipName(e.target.value)}
                  placeholder="e.g. zubware-processed-images"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="glass-panel p-4 rounded-2xl">
              <ImageProcessingProgress
                stage={currentStage}
                progress={progressPercent}
              />
            </div>
          )}

          {/* Batch Processing Summary Card */}
          {completedItems.length > 0 && !isProcessing && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  Batch Processing Complete! ({completedItems.length} Successful)
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
                  <div>Original Size: <span className="font-semibold">{formatBytes(totalOrigSize)}</span></div>
                  <div>Processed Size: <span className="font-semibold">{formatBytes(totalOutSize)}</span></div>
                  {totalSavingsBytes > 0 && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Saved {formatBytes(totalSavingsBytes)} ({totalSavingsPct}%)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-white shadow-lg transition-all flex items-center gap-2"
                >
                  <FileArchive className="w-5 h-5" />
                  Download All as ZIP
                </button>
              </div>
            </div>
          )}

          {/* Image List / Table View */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-indigo-500" />
                Image Queue ({items.length})
              </h2>
              <span className="text-xs text-slate-500">
                Use arrows to reorder sequence numbering
              </span>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => {
                const liveCalculatedName = computeFilename(item, index);

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    {/* Left Thumbnail & Names */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === items.length - 1}
                          className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        {item.previewUrl ? (
                          <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* File Details */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          Original: {item.file.name} ({formatBytes(item.origSize)})
                        </div>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs truncate flex items-center gap-1.5">
                          <Tag className="w-3 h-3 shrink-0" />
                          New: {item.status === 'done' ? item.calculatedName : liveCalculatedName}
                        </div>
                        {item.origWidth > 0 && (
                          <div className="text-[10px] text-slate-500">
                            Dimensions: {item.origWidth}×{item.origHeight}
                            {item.status === 'done' && ` → ${item.outWidth}×${item.outHeight}`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Status & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {item.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                          Ready
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium text-[11px] flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                        </span>
                      )}
                      {item.status === 'done' && (
                        <div className="text-right space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                          {item.processedSize && (
                            <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                              {formatBytes(item.processedSize)}
                            </div>
                          )}
                        </div>
                      )}
                      {item.status === 'error' && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                          Failed
                        </span>
                      )}

                      {/* Download Individual */}
                      {item.status === 'done' && (
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(item)}
                          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                          title="Download single file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Large Batch Warning Modal */}
      {largeBatchWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl space-y-4 border border-amber-500/30 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Large Batch Warning</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You've selected a large number of images ({largeBatchWarning.length} files). Processing may use significant device memory.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLargeBatchWarning(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const files = largeBatchWarning;
                  setLargeBatchWarning(null);
                  await addFilesToBatch(files);
                }}
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
            Everything you need to know about bulk image renaming & resizing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I rename multiple images at once?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes! You can rename dozens or hundreds of images at once using custom patterns, prefixes, suffixes, base names, and zero-padded sequential numbers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I resize 100 images at once?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes, you can upload 100 or more images, choose preset resolutions (like 1920px, 1080px, Instagram, Marketplace) or custom dimensions, and resize all images simultaneously.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I rename product photos in bulk?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              E-commerce sellers can quickly format product photos (e.g. product-001.jpg, product-002.jpg) with consistent dimensions for Amazon, Shopify, eBay, and Etsy.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I resize property photos in bulk?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-estate agents and property dealers can batch rename and resize gallery photos (e.g. property-001.jpg, 1920x1080) in seconds.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Are my images uploaded to a server?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No. All renaming, resizing, format conversion, and ZIP archiving take place 100% locally inside your web browser. Your images never get uploaded to any server.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Can I download all images as a ZIP?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes! Once processing is complete, you can download all converted images in a single compressed ZIP file generated locally inside your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related Image Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'HEIC to JPG', path: '/heic-to-jpg.html', icon: '📱' },
            { title: 'Batch Converter', path: '/batch-image-converter.html', icon: '⚡' },
            { title: 'Image Compressor', path: '/image-compressor.html', icon: '🗜️' },
            { title: 'Image Resizer', path: '/image-resizer.html', icon: '📐' }
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
