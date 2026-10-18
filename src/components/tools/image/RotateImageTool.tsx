import JSZip from 'jszip';
import { decodeBrowserImage } from '../../../lib/browserImageDecode';
import { encodeCanvasBlob } from '../../../lib/canvasEncoding';
import { rotatedImageBounds, rotationExportMime } from '../../../lib/imageRotation';
import { imageExportExtension, uniqueImageExportName } from '../../../lib/imageExport';
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, RotateCw, Download, RefreshCw, Layers } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';

interface RotateImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface ProcessedFileItem {
  file: File;
  previewUrl: string;
  angle: number;
  blob: Blob;
  width: number;
  height: number;
}

export const RotateImageTool: React.FC<RotateImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<number>(90);
  const [items, setItems] = useState<ProcessedFileItem[]>([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const runRef = useRef(0);
  const itemsRef = useRef<ProcessedFileItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const replaceItems = (next: ProcessedFileItem[]) => {
    itemsRef.current.forEach(item => URL.revokeObjectURL(item.previewUrl));
    itemsRef.current = next;
    setItems(next);
  };
  useEffect(() => () => {
    runRef.current++;
    itemsRef.current.forEach(item => URL.revokeObjectURL(item.previewUrl));
  }, []);

  const renderRotations = async (fileList: File[], rotAngle: number) => {
    const run = ++runRef.current;
    replaceItems([]);
    setErrors([]);
    setIsProcessing(true);
    setStage('Processing');
    setProgress(0);
    const results: ProcessedFileItem[] = [];
    const failures: string[] = [];
    try {
      for (const file of fileList) {
        let sourceUrl: string | undefined;
        try {
          const {image, url} = await decodeBrowserImage(file);
          sourceUrl = url;
          if (run !== runRef.current) break;
          const bounds = rotatedImageBounds(image.naturalWidth, image.naturalHeight, rotAngle);
          const canvas = document.createElement('canvas');
          canvas.width = bounds.width;
          canvas.height = bounds.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Image canvas is unavailable. Try a smaller image.');
          const mime = rotationExportMime(file.type);
          if (mime === 'image/jpeg') {ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
          ctx.translate(canvas.width/2, canvas.height/2);
          ctx.rotate(bounds.angle*Math.PI/180);
          ctx.drawImage(image,-image.naturalWidth/2,-image.naturalHeight/2);
          const blob = await encodeCanvasBlob(canvas,mime,0.92);
          if (run !== runRef.current) break;
          results.push({file,blob,previewUrl:URL.createObjectURL(blob),angle:bounds.angle,width:bounds.width,height:bounds.height});
        } catch (error) {
          failures.push(`${file.name}: ${error instanceof Error ? error.message : 'Rotation failed.'}`);
        } finally {
          if (sourceUrl) URL.revokeObjectURL(sourceUrl);
        }
        if (run !== runRef.current) break;
        setProgress(Math.round((results.length+failures.length)/fileList.length*100));
      }
      if (run !== runRef.current) {results.forEach(item => URL.revokeObjectURL(item.previewUrl));return;}
      replaceItems(results);
      setErrors(failures);
      setStage('Completed');
      setProgress(100);
      if (failures.length) onShowToast(`${results.length} rotated; ${failures.length} failed. Check the file errors.`);
    } finally {
      if (run === runRef.current) setIsProcessing(false);
    }
  };

  const handleImageSelected = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    setFiles(selectedFiles);
    void renderRotations(selectedFiles, angle);
  };
  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    if (files.length) void renderRotations(files, newAngle);
  };
  const outputName = (item: ProcessedFileItem) => `${item.file.name.replace(/\.[^/.]+$/, '') || 'rotated'}_rotated_${item.angle}deg.${imageExportExtension(item.blob.type)}`;
  const handleDownloadItem = (item: ProcessedFileItem) => {
    const link = document.createElement('a');
    link.download = outputName(item);
    link.href = item.previewUrl;
    link.click();
    onShowToast('Rotated image downloaded!');
  };
  const handleDownloadAll = async () => {
    if (isProcessing || isZipping || !items.length) return;
    const run = runRef.current;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const names = new Set<string>();
      items.forEach(item => zip.file(uniqueImageExportName(outputName(item),names),item.blob));
      const blob = await zip.generateAsync({type:'blob'});
      if (run !== runRef.current) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rotated-images-${angle}deg.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url),1000);
    } catch {onShowToast('Could not create the ZIP. Try individual image downloads.');}
    finally {setIsZipping(false);}
  };

  return (
    <div className="space-y-6">
      

      {files.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {errors.length > 0 && <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm space-y-1">{errors.map((error,index) => <p key={index}>{error}</p>)}</div>}
          <p className="text-xs text-slate-500 dark:text-slate-400">JPG and WebP sources keep their format when supported. Other inputs export as PNG. Animated images become a still frame.</p>
          {/* Preset Buttons & Slider */}
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => handleAngleChange(deg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      angle === deg
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Rotate {deg}°
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAngleChange((angle - 90 + 360) % 360)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Rotate -90°"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAngleChange((angle + 90) % 360)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Rotate +90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Custom Angle Slider</span>
                <span className="text-indigo-600 dark:text-indigo-400">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                aria-label="Rotation angle"
                value={angle}
                onChange={(e) => handleAngleChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Grid Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-3xl glass-card space-y-3 flex flex-col justify-between">
                <div className="max-h-60 overflow-hidden rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <img src={item.previewUrl} alt={item.file.name} className="max-h-48 object-contain rounded-xl" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.file.name}</p>
                  <p className="text-xs text-slate-500">{item.width} × {item.height} px · {imageExportExtension(item.blob.type).toUpperCase()}</p>
                  <button
                    type="button"
                    onClick={() => handleDownloadItem(item)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Rotated
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Global Actions */}
          <div className="flex items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
            <button
              type="button"
              onClick={() => {
                runRef.current++;
                setFiles([]);
                replaceItems([]);
                setErrors([]);
                setIsProcessing(false);
                setAngle(90);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset / Clear
            </button>

            {items.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isProcessing || isZipping}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Layers className="w-4 h-4" /> {isZipping ? 'Creating ZIP…' : `Download ZIP (${items.length})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
