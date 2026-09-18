import React, { useState } from 'react';
import { FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { BatchQueue, BatchQueueItem } from '../../common/BatchQueue';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface BatchImageConverterToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const BatchImageConverterTool: React.FC<BatchImageConverterToolProps> = ({ onShowToast, onNavigate }) => {
  const [items, setItems] = useState<BatchQueueItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>('webp');
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Files');
  const [progress, setProgress] = useState<number>(0);

  const handleAddFiles = (files: File[]) => {
    if (!files.length) return;
    const newItems: BatchQueueItem[] = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      status: 'pending' as const
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearQueue = () => {
    setItems([]);
  };

  const convertBatch = async () => {
    if (!items.length) return;
    setIsProcessing(true);
    setStage('Optimizing');
    setProgress(10);

    const mime =
      targetFormat === 'png'
        ? 'image/png'
        : targetFormat === 'jpg'
        ? 'image/jpeg'
        : targetFormat === 'webp'
        ? 'image/webp'
        : 'image/png';

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'processing';
      setItems([...updatedItems]);

      try {
        const blob = await convertSingleFile(item.file, mime, quality / 100);
        item.resultBlob = blob;
        item.resultSize = blob.size;
        item.resultUrl = URL.createObjectURL(blob);
        item.status = 'done';
      } catch (e) {
        item.status = 'error';
        item.errorMessage = 'Conversion failed';
      }

      setProgress(Math.round(((i + 1) / updatedItems.length) * 90));
      setItems([...updatedItems]);
    }

    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
    onShowToast(`Successfully converted ${items.length} images to ${targetFormat.toUpperCase()}!`);
  };

  const convertSingleFile = (file: File, mimeType: string, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject('Blob error');
        }, mimeType, q);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject('Image load failed');
      };
      img.src = url;
    });
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.resultBlob);
    if (!doneItems.length) {
      await convertBatch();
      return;
    }

    setIsProcessing(true);
    setStage('Compressing ZIP');
    setProgress(50);

    const zip = new JSZip();
    doneItems.forEach((it) => {
      const baseName = it.file.name.substring(0, it.file.name.lastIndexOf('.')) || 'converted';
      zip.file(`${baseName}.${targetFormat}`, it.resultBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `batch_converted_${targetFormat}.zip`;
    link.click();

    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
    onShowToast('Batch ZIP downloaded!');
  };

  const doneCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="space-y-6">
      <SEOHead
        title="Batch Image Converter — Convert Multiple Photos Online — Zubware"
        description="Free online batch image converter. Convert multiple photos to PNG, JPG, WebP, BMP, AVIF instantly with bulk ZIP download."
        canonicalPath="/batch-image-converter.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Batch Image Converter' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⚡ Batch Image Converter
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Convert dozens of photos simultaneously into PNG, JPG, WebP, BMP or AVIF with one-click bulk ZIP export.
        </p>
      </div>

      {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

      <BatchQueue
        items={items}
        onAddFiles={handleAddFiles}
        onRemoveItem={handleRemoveItem}
        onClearQueue={handleClearQueue}
        onStartBatch={convertBatch}
        actionLabel="Convert All Images"
        secondaryAction={
          doneCount > 0
            ? {
                label: `Download ZIP (${doneCount})`,
                icon: <FileArchive className="w-4 h-4" />,
                onClick: handleDownloadZip
              }
            : undefined
        }
        isProcessing={isProcessing}
        accept="image/*"
        title="Drop images or click to select batch"
        subtitle="Upload multiple images to convert in batch queue"
        customControls={
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Target Format
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['webp', 'png', 'jpg', 'bmp', 'avif'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setTargetFormat(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      targetFormat === fmt
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {(targetFormat === 'jpg' || targetFormat === 'webp') && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 gap-4">
                  <span>Quality</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-36 accent-indigo-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

