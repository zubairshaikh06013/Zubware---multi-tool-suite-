import { encodeCanvasBlob } from '../../../lib/canvasEncoding';
import { encodeBmpFromImageData } from '../../../lib/fileSizeStandard';
import { IMAGE_EXPORT_MIME, imageExportExtension, uniqueImageExportName } from '../../../lib/imageExport';
import React, { useState, useEffect, useRef } from 'react';
import { FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { BatchQueue, BatchQueueItem } from '../../common/BatchQueue';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';

interface BatchImageConverterToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const BatchImageConverterTool: React.FC<BatchImageConverterToolProps> = ({ onShowToast, onNavigate }) => {
  const [items, setItems] = useState<BatchQueueItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<keyof typeof IMAGE_EXPORT_MIME>('webp');
  const processingRef = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const runRef = useRef(0);
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Files');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setItems(previous => previous.map(item => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return { ...item, status:'pending', resultBlob:undefined, resultUrl:undefined, resultSize:undefined, downloadFileName:undefined, errorMessage:undefined };
    }));
  }, [targetFormat, quality]);
  useEffect(() => () => {
    runRef.current++;
    itemsRef.current.forEach(item => { if (item.resultUrl) URL.revokeObjectURL(item.resultUrl); });
  }, []);

  const handleAddFiles = (files: File[]) => {
    if (!files.length || processingRef.current) return;
    const newItems: BatchQueueItem[] = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      status: 'pending' as const
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    if (processingRef.current) return;
    const item = items.find(item => item.id === id);
    if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearQueue = () => {
    if (processingRef.current) return;
    items.forEach(item => { if (item.resultUrl) URL.revokeObjectURL(item.resultUrl); });
    setItems([]);
  };

  const convertBatch = async () => {
    if (!items.length || processingRef.current) return;
    processingRef.current = true;
    const run = ++runRef.current;
    setIsProcessing(true);
    setStage('Optimizing');
    setProgress(0);
    const mime = IMAGE_EXPORT_MIME[targetFormat];
    const updatedItems = items.map(item => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return { ...item, status:'pending', resultBlob:undefined, resultUrl:undefined, resultSize:undefined, downloadFileName:undefined, errorMessage:undefined } as BatchQueueItem;
    });
    setItems(updatedItems);
    try {
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        item.status = 'processing';
        setItems([...updatedItems]);
        try {
          const blob = await convertSingleFile(item.file, mime, quality / 100);
          if (run !== runRef.current) return;
          item.resultBlob = blob;
          item.resultSize = blob.size;
          item.resultUrl = URL.createObjectURL(blob);
          item.downloadFileName = `${item.file.name.replace(/\.[^/.]+$/, '') || 'converted'}.${imageExportExtension(blob.type)}`;
          item.status = 'done';
        } catch (error) {
          if (run !== runRef.current) return;
          item.status = 'error';
          item.errorMessage = error instanceof Error ? error.message : 'Image could not be decoded or converted.';
        }
        setProgress(Math.round(((i + 1) / updatedItems.length) * 100));
        setItems([...updatedItems]);
      }
      const done = updatedItems.filter(item => item.status === 'done').length;
      setStage('Completed');
      onShowToast(`${done} image(s) converted${done < updatedItems.length ? `; ${updatedItems.length - done} failed. Check the queue.` : '.'}`);
    } finally {
      processingRef.current = false;
      if (run === runRef.current) setIsProcessing(false);
    }
  };

  const convertSingleFile = (file: File, mimeType: string, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        try {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas error');

        if (mimeType === 'image/jpeg' || mimeType === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        if (mimeType === 'image/bmp') {
          const bytes = encodeBmpFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
          resolve(new Blob([bytes], {type:'image/bmp'}));
        } else resolve(await encodeCanvasBlob(canvas, mimeType, q));
        } catch (error) { reject(error); }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('This image cannot be decoded by your browser. Try JPG, PNG, or WebP.'));
      };
      img.src = url;
    });
  };

  const handleDownloadZip = async () => {
    if (processingRef.current) return;
    const doneItems = items.filter((it) => it.status === 'done' && it.resultBlob);
    if (!doneItems.length) {
      await convertBatch();
      return;
    }

    setIsProcessing(true);
    processingRef.current = true;
    setStage('Compressing ZIP');
    setProgress(50);

    try {
      const zip = new JSZip();
      const names = new Set<string>();
      doneItems.forEach(item => {
        const name = item.downloadFileName || `${item.file.name.replace(/\.[^/.]+$/, '')}.${imageExportExtension(item.resultBlob!.type)}`;
        zip.file(uniqueImageExportName(name, names), item.resultBlob!);
      });
      const zipBlob = await zip.generateAsync({ type:'blob' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(zipBlob);
      link.href = url;
      link.download = `batch_converted_${targetFormat}.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStage('Completed');
      setProgress(100);
      onShowToast('Batch ZIP downloaded!');
    } catch {
      onShowToast('Could not create the ZIP. Download completed files individually or try again.');
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };

  const doneCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="space-y-6">
      

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
          <fieldset disabled={isProcessing} className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Target Format
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['webp', 'png', 'jpg', 'bmp', 'avif'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setTargetFormat(fmt as keyof typeof IMAGE_EXPORT_MIME)}
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
          </fieldset>
        }
      />
    </div>
  );
};

