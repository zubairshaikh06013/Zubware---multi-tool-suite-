import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { stripExifFromImage, formatBytes } from '../../../lib/imageUtils';
import { decodeBrowserImage } from '../../../lib/browserImageDecode';
import { cleanedImageName, cleanedImagesZip } from '../../../lib/cleanImageExport';

interface ExifRemoverToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface ExifCleanedResult {
  file: File;
  cleanedBlob: Blob;
  originalSize: number;
  newSize: number;
}

export const ExifRemoverTool: React.FC<ExifRemoverToolProps> = ({ onShowToast, onNavigate }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ExifCleanedResult[]>([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const generation = useRef(0), busy = useRef(false), zipping = useRef(false);
  const [isZipping, setIsZipping] = useState(false);
  useEffect(() => () => { generation.current++; }, []);
  const reset = () => {
    generation.current++; busy.current=false;zipping.current=false;
    setErrors([]);setFiles([]);setResults([]);setIsProcessing(false);setIsZipping(false);setProgress(0);
  };
  const handleImageSelected = async (selectedFiles: File[]) => {
    if (!selectedFiles.length || busy.current) return;
    reset();
    const run=generation.current;
    busy.current=true;setFiles(selectedFiles);setIsProcessing(true);setStage('Reading Image');
    const list: ExifCleanedResult[] = [], failures: string[] = [];
    try {
      for (let i=0;i<selectedFiles.length;i++) {
        if(run!==generation.current) return;
        const file=selectedFiles[i];let url='';
        try {
          setStage('Reading Image');
          const decoded=await decodeBrowserImage(file);url=decoded.url;
          if(run!==generation.current) return;
          setStage('Processing');
          const cleaned=await stripExifFromImage(file,decoded.image);
          if(run!==generation.current) return;
          list.push({file,...cleaned});
        } catch(cause) {
          if(run!==generation.current) return;
          failures.push(`${file.name}: ${cause instanceof Error?cause.message:'Unable to process image.'}`);
        } finally {
          if(url) URL.revokeObjectURL(url);
          if(run===generation.current) setProgress(Math.round((i+1)/selectedFiles.length*100));
        }
      }
      if(run!==generation.current) return;
      setResults(list);setErrors(failures);setStage('Completed');
      onShowToast(`${list.length} image(s) processed; ${failures.length} failed.`);
    } finally {if(run===generation.current){busy.current=false;setIsProcessing(false);}}
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.download=name;link.href=url;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const handleDownloadItem = (res: ExifCleanedResult) => {
    downloadBlob(res.cleanedBlob,cleanedImageName(res.file.name,res.cleanedBlob.type));
    onShowToast('Cleaned image downloaded!');
  };
  const handleDownloadAll = async () => {
    if(!results.length || zipping.current) return;
    const run=generation.current;
    zipping.current=true;setIsZipping(true);setErrors([]);
    try {
      const blob=await cleanedImagesZip(results.map(res=>({name:res.file.name,blob:res.cleanedBlob})));
      if(run!==generation.current) return;
      downloadBlob(blob,'cleaned_images.zip');onShowToast('Cleaned images ZIP downloaded!');
    } catch(cause) {
      if(run===generation.current) setErrors([cause instanceof Error?cause.message:'Unable to create ZIP.']);
    } finally {if(run===generation.current){zipping.current=false;setIsZipping(false);}}
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">This tool redraws decoded pixels without copying source metadata. JPEG inputs are re-encoded at 95% quality; other formats become PNG to preserve transparency. Animated inputs export a single still frame. This is not lossless header stripping. Check the exported metadata before sharing.</p>
      {errors.map((error, i) => <p key={i} role="alert" className="text-red-600">{error}</p>)}
      

      {files.length === 0 ? (
        <ImageUploadArea onImageSelected={handleImageSelected} multiple={true} />
      ) : (
        <div className="space-y-6">
          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Results Grid */}
          <div className="space-y-4">
            {results.map((res, idx) => (
              <div key={idx} className="p-6 rounded-3xl glass-panel space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{res.file.name}</h3>
                      <p className="text-xs text-slate-500">
                        {formatBytes(res.originalSize)} → {formatBytes(res.newSize)} (EXIF Metadata Removed)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadItem(res)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Cleaned
                  </button>
                </div>

                {/* Examples, not a per-file metadata detection report. */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Examples of source metadata not copied:
                  </span>
                  <p>This list does not mean these tags were present in your file. Inspect the exported metadata if removal is important for your use.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                    <div>• GPS Location & Altitude</div>
                    <div>• Camera Model & Lens</div>
                    <div>• Device Serial Number</div>
                    <div>• Date & Time Original</div>
                    <div>• Author & Copyright</div>
                    <div>• Software & Firmware</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Global Actions */}
          <div className="flex items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clean Another Image
            </button>

            {results.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isZipping}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> {isZipping ? 'Preparing ZIP…' : `Download All as ZIP (${results.length})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
