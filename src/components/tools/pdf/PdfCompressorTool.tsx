import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowDown, 
  Check, 
  Upload, 
  Loader2, 
  Percent, 
  SlidersHorizontal, 
  CheckCircle2 
} from 'lucide-react';
import { renderPdfPageToDataUrl, formatBytes } from '../../../lib/pdfUtils';
import { reducePdfSize, ReduceQualityLevel } from '../../../lib/pdfSizeAdjuster';
import { ToolIcon } from '../../common/ToolIcon';

interface PdfCompressorToolProps {
  onShowToast: (msg: string) => void;
}

type CompressionPreset = 'extreme' | 'recommended' | 'light' | 'target';

export const PdfCompressorTool: React.FC<PdfCompressorToolProps> = ({ onShowToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const [preset, setPreset] = useState<CompressionPreset>('recommended');
  const [targetKb, setTargetKb] = useState<number>(300);

  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressProgress, setCompressProgress] = useState<{ stage: string; percent: number }>({ stage: '', percent: 0 });

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileAdded = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      setFile(selected);
      setPdfBuffer(buffer);
      setPageCount(count);
      setCompressedBlob(null);
      setCompressedSize(null);

      // Set default target KB to half of original size
      const originalKb = Math.ceil(selected.size / 1024);
      setTargetKb(Math.max(50, Math.round(originalKb * 0.5)));

      // Generate visual thumbnail
      try {
        const thumb = await renderPdfPageToDataUrl(buffer, 0, 0.45);
        setThumbnailUrl(thumb);
      } catch {
        setThumbnailUrl(null);
      }

      onShowToast(`Loaded "${selected.name}" (${count} pages, ${formatBytes(selected.size)})`);
    } catch {
      onShowToast('Failed to parse PDF. File might be password protected.');
    }
  };

  const handleCompress = async () => {
    if (!file || !pdfBuffer) return;

    setIsCompressing(true);
    setCompressProgress({ stage: 'Analyzing document structure & raster images...', percent: 15 });

    try {
      await new Promise(r => setTimeout(r, 200));

      let qualityLevel: ReduceQualityLevel = 'medium';
      let targetBytes = 0;

      if (preset === 'extreme') {
        qualityLevel = 'strong';
        targetBytes = Math.round(file.size * 0.3); // target 70% reduction
      } else if (preset === 'light') {
        qualityLevel = 'low';
        targetBytes = Math.round(file.size * 0.7); // target 30% reduction
      } else if (preset === 'target') {
        qualityLevel = 'medium';
        targetBytes = targetKb * 1024;
      } else {
        // recommended
        qualityLevel = 'medium';
        targetBytes = Math.round(file.size * 0.5); // target 50% reduction
      }

      setCompressProgress({ stage: 'Compressing embedded images & streams...', percent: 45 });
      await new Promise(r => setTimeout(r, 250));

      setCompressProgress({ stage: 'Optimizing font subsets & metadata tables...', percent: 75 });

      // Run optimized size reduction
      const result = await reducePdfSize(pdfBuffer, targetBytes, qualityLevel, (stageName, pct) => {
        setCompressProgress({ stage: stageName, percent: Math.max(15, pct) });
      });

      setCompressProgress({ stage: 'Finalizing compressed PDF package...', percent: 95 });
      await new Promise(r => setTimeout(r, 150));

      setCompressedBlob(result.blob);
      setCompressedSize(result.actualBytes);

      setCompressProgress({ stage: 'Completed!', percent: 100 });
      const savedBytes = Math.max(0, file.size - result.actualBytes);
      const savedPct = file.size > 0 ? Math.round((savedBytes / file.size) * 100) : 0;
      onShowToast(`Compressed by ${savedPct}% (Saved ${formatBytes(savedBytes)})!`);
    } catch (err: any) {
      onShowToast(err.message || 'Failed to compress PDF');
    } finally {
      setTimeout(() => {
        setIsCompressing(false);
      }, 500);
    }
  };

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = file.name.replace(/\.pdf$/i, '');
    a.download = `${baseName}-compressed.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded compressed PDF file!');
  };

  const originalSize = file?.size || 0;
  const savedBytes = (compressedSize !== null && file) ? Math.max(0, originalSize - compressedSize) : 0;
  const savedPct = (originalSize > 0 && compressedSize !== null) ? Math.round((savedBytes / originalSize) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="flex justify-center mb-3"><ToolIcon toolId="pdf-compressor" category="PDF Tools" size="xl" /></div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          PDF Compressor Studio & Size Reducer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Shrink large PDF documents while preserving crisp text readability. View live document previews and choose from Recommended, Extreme, or High Quality presets.
        </p>
      </div>

      {!file ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) handleFileAdded([e.dataTransfer.files[0]]);
          }}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer glass-card transition-all text-center group ${
            isDragOver 
              ? 'border-indigo-600 bg-indigo-50/20 scale-[1.01]' 
              : 'border-indigo-300/60 dark:border-indigo-900/40 hover:border-indigo-500'
          }`}
        >
          <Upload className="w-12 h-12 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Select or drag and drop PDF file here to compress
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fast, secure, 100% in-browser processing with zero server uploads
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileAdded([e.target.files[0]])}
          />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Document Overview with Thumbnail Preview */}
          <div className="glass-card p-5 rounded-3xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 min-w-0">
              {/* Document Thumbnail Preview */}
              <div className="w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pageCount} Pages</span>
                  <span>•</span>
                  <span>Original: <strong>{formatBytes(originalSize)}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPdfBuffer(null);
                setCompressedBlob(null);
                setThumbnailUrl(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          {/* Compression Level Selector */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" /> Choose Compression Strength
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Recommended */}
              <button
                onClick={() => setPreset('recommended')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  preset === 'recommended'
                    ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">
                    Recommended
                  </span>
                  {preset === 'recommended' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Medium Compression</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">~50% - 65% reduction with great visual quality.</p>
                </div>
              </button>

              {/* Extreme */}
              <button
                onClick={() => setPreset('extreme')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  preset === 'extreme'
                    ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-500 uppercase">
                    Maximum Savings
                  </span>
                  {preset === 'extreme' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Extreme Compression</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">~70% - 85% reduction. Best for upload limits.</p>
                </div>
              </button>

              {/* Light */}
              <button
                onClick={() => setPreset('light')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  preset === 'light'
                    ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-500 uppercase">
                    High Quality
                  </span>
                  {preset === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Light Compression</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">~20% - 35% reduction. Keeps crystal clear images.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isCompressing && (
            <div className="glass-card p-6 rounded-3xl space-y-3 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{compressProgress.stage}</span>
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{compressProgress.percent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${compressProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Compressed Result Card with Before/After Gauge */}
          {compressedSize !== null && compressedBlob && (
            <div className="glass-card p-6 rounded-3xl space-y-5 border border-emerald-500/30 bg-emerald-50/20 dark:bg-slate-900/60">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Compression Complete!</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white">
                  -{savedPct}% Reduced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Original File</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {formatBytes(originalSize)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Compressed File</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatBytes(compressedSize)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Space Saved</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {formatBytes(savedBytes)}
                  </span>
                </div>
              </div>

              <button
                onClick={downloadCompressed}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Compressed PDF ({formatBytes(compressedSize)})</span>
              </button>
            </div>
          )}

          {/* Compress Trigger Button */}
          {compressedSize === null && (
            <button
              onClick={handleCompress}
              disabled={isCompressing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Compressing Document Streams...</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-5 h-5" />
                  <span>Compress PDF Now</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
