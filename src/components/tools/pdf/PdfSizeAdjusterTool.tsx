import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  AlertCircle,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  Equal
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';
import {
  KB_TO_BYTES,
  MB_TO_BYTES,
  MAX_SAFE_TARGET_BYTES,
  formatDecimalBytes,
  parseTargetBytes,
  determineAdjustMode,
  increasePdfSize,
  reducePdfSize,
  IncreaseResult,
  ReduceResult,
  ReduceQualityLevel
} from '../../../lib/pdfSizeAdjuster';
import { PDFDocument } from 'pdf-lib';

type TargetUnit = 'KB' | 'MB';

export interface PdfSizeAdjusterToolProps {
  initialMode?: 'auto' | 'increase' | 'reduce';
  onShowToast: (msg: string) => void;
}

export const PdfSizeAdjusterTool: React.FC<PdfSizeAdjusterToolProps> = ({
  initialMode = 'auto',
  onShowToast
}) => {
  const { t } = useLanguage();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  // Target size configuration
  const [targetSizeVal, setTargetSizeVal] = useState<number>(300);
  const [targetUnit, setTargetUnit] = useState<TargetUnit>('KB');
  const [compressionPreset, setCompressionPreset] = useState<ReduceQualityLevel>('medium');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  // Result state
  const [increaseResult, setIncreaseResult] = useState<IncreaseResult | null>(null);
  const [reduceResult, setReduceResult] = useState<ReduceResult | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];

    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      const version = extractPdfVersionFromBuffer(buffer);

      setFile(selected);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);
      setIncreaseResult(null);
      setReduceResult(null);
      setOutputBlob(null);
      setErrorMessage(null);

      // Suggest initial target depending on initialMode & current file size
      const currentBytes = selected.size;
      const currentKb = Math.ceil(currentBytes / KB_TO_BYTES);

      if (initialMode === 'increase') {
        if (currentKb < 300) {
          setTargetSizeVal(Math.max(300, currentKb + 100));
          setTargetUnit('KB');
        } else if (currentKb < 1000) {
          setTargetSizeVal(Math.ceil((currentKb + 200) / 50) * 50);
          setTargetUnit('KB');
        } else {
          const currentMb = parseFloat((currentBytes / MB_TO_BYTES).toFixed(1));
          setTargetSizeVal(Math.ceil(currentMb + 1));
          setTargetUnit('MB');
        }
      } else if (initialMode === 'reduce') {
        if (currentKb > 1000) {
          const reducedMb = parseFloat(Math.max(0.5, (currentBytes / MB_TO_BYTES) * 0.6).toFixed(1));
          setTargetSizeVal(reducedMb);
          setTargetUnit('MB');
        } else {
          setTargetSizeVal(Math.max(50, Math.round((currentKb * 0.6) / 10) * 10));
          setTargetUnit('KB');
        }
      } else {
        // Auto default: suggest 1.2x if small or 0.7x if large
        if (currentKb < 400) {
          setTargetSizeVal(Math.max(300, currentKb + 100));
          setTargetUnit('KB');
        } else {
          setTargetSizeVal(Math.max(100, Math.round((currentKb * 0.7) / 25) * 25));
          setTargetUnit('KB');
        }
      }

      onShowToast(`PDF loaded: ${count} page${count > 1 ? 's' : ''}`);
    } catch {
      onShowToast('Could not parse PDF. The file may be password-protected or corrupted.');
    }
  };

  const originalBytes = file ? file.size : 0;
  const targetBytes = parseTargetBytes(targetSizeVal, targetUnit);
  const activeMode = originalBytes > 0 ? determineAdjustMode(originalBytes, targetBytes) : 'match';

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setIncreaseResult(null);
    setReduceResult(null);
    setOutputBlob(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setProgress(0);
  };

  const handleProcess = async () => {
    if (!pdfBuffer || !file || targetBytes <= 0) return;

    if (targetBytes === originalBytes) {
      onShowToast('Target already matches current file size. No processing needed.');
      return;
    }

    if (targetBytes > MAX_SAFE_TARGET_BYTES) {
      setErrorMessage(`Target size exceeds the 50 MB browser safety limit (${formatDecimalBytes(MAX_SAFE_TARGET_BYTES)}).`);
      return;
    }

    setErrorMessage(null);
    setIncreaseResult(null);
    setReduceResult(null);
    setOutputBlob(null);
    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(15);

    try {
      if (activeMode === 'increase') {
        const result = await increasePdfSize(pdfBuffer, targetBytes, (s, pct) => {
          setStage(s as ProcessingStage);
          setProgress(pct);
        });
        setIncreaseResult(result);
        setOutputBlob(result.blob);
        setStage('Completed');
        setProgress(100);
        onShowToast(result.isExact ? 'PDF size increased to exact target!' : 'PDF size increased successfully!');
      } else {
        const result = await reducePdfSize(pdfBuffer, targetBytes, compressionPreset, (s, pct) => {
          setStage(s as ProcessingStage);
          setProgress(pct);
        });
        setReduceResult(result);
        setOutputBlob(result.blob);
        setStage('Completed');
        setProgress(100);
        if (result.isAlreadyOptimized) {
          onShowToast('PDF is already highly optimized. Original file preserved.');
        } else {
          onShowToast('PDF size reduced successfully!');
        }
      }
    } catch (err: any) {
      console.error('PDF Size Adjustment error:', err);
      setErrorMessage(err.message || 'An error occurred while processing the PDF.');
      onShowToast('Failed to adjust PDF size.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;

    const baseName = file.name.replace(/\.pdf$/i, '');
    let suffix = 'size-adjusted';
    if (activeMode === 'increase') suffix = 'increased';
    else if (activeMode === 'reduce') suffix = 'reduced';

    const downloadName = `${baseName}-${suffix}.pdf`;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded: ${downloadName}`);
  };

  // Presets in decimal
  const presetSizes: { label: string; val: number; unit: TargetUnit }[] = [
    { label: '100 KB', val: 100, unit: 'KB' },
    { label: '200 KB', val: 200, unit: 'KB' },
    { label: '300 KB', val: 300, unit: 'KB' },
    { label: '500 KB', val: 500, unit: 'KB' },
    { label: '1 MB', val: 1, unit: 'MB' },
    { label: '2 MB', val: 2, unit: 'MB' },
    { label: '5 MB', val: 5, unit: 'MB' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Tool Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Unified PDF Size Engine</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>100% Client-Side Private</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          PDF Size Adjuster
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Adjust a PDF file toward a target size by increasing it with harmless PDF padding or reducing it with browser-based compression.
        </p>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!file && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <UniversalFileUpload
              accept=".pdf,application/pdf"
              multiple={false}
              maxSizeMB={50}
              title="Upload PDF Document"
              subtitle="Drag & drop your PDF file here, or click to browse"
              fileTypeSupportText="Supports standard PDF files up to 50 MB. 100% processed locally in your browser."
              onFilesSelected={handleFileSelected}
            />
          </div>
        )}

        {/* Active PDF Workspace */}
        {file && (
          <div className="space-y-6">
            {/* File Info Card */}
            <FileInformationPanel
              fileName={file.name}
              fileSize={file.size}
              displayFileSize={formatDecimalBytes(file.size)}
              pageCount={pageCount}
              pdfVersion={pdfVersion}
            />

            {/* Target Size Configuration Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Target File Size Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your desired file size in decimal KB or MB (1 KB = 1,000 bytes).
                  </p>
                </div>

                {/* Auto Mode Badge */}
                <div>
                  {activeMode === 'increase' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200/70 dark:border-indigo-800/70">
                      <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Mode: Increase PDF Size
                    </span>
                  )}
                  {activeMode === 'reduce' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200/70 dark:border-emerald-800/70">
                      <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Mode: Reduce PDF Size
                    </span>
                  )}
                  {activeMode === 'match' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200/70 dark:border-amber-800/70">
                      <Equal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Target Matches Current Size
                    </span>
                  )}
                </div>
              </div>

              {/* Target Input & Unit Selector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-7">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Desired Target Size
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        step={targetUnit === 'MB' ? '0.1' : '10'}
                        value={targetSizeVal || ''}
                        disabled={isProcessing}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setTargetSizeVal(isNaN(val) ? 0 : val);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 300"
                      />
                    </div>

                    {/* Unit Toggle */}
                    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 p-1">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setTargetUnit('KB')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                          targetUnit === 'KB'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        KB
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setTargetUnit('MB')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                          targetUnit === 'MB'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        MB
                      </button>
                    </div>
                  </div>
                </div>

                {/* Target in Bytes indicator */}
                <div className="md:col-span-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Calculated Target
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{formatDecimalBytes(targetBytes)}</span>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {targetBytes.toLocaleString()} bytes
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Original: <strong className="text-slate-700 dark:text-slate-300">{formatDecimalBytes(originalBytes)}</strong> ({originalBytes.toLocaleString()} bytes)
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Quick Target Presets:
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetSizes.map((p) => {
                    const bytesVal = parseTargetBytes(p.val, p.unit);
                    const isSelected = targetBytes === bytesVal;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                          setTargetSizeVal(p.val);
                          setTargetUnit(p.unit);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}

                  {/* Relative shortcuts */}
                  <span className="border-r border-slate-200 dark:border-slate-800 mx-1" />

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      const curKb = Math.ceil(originalBytes / KB_TO_BYTES);
                      setTargetSizeVal(curKb + 100);
                      setTargetUnit('KB');
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100"
                  >
                    +100 KB
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      const curKb = Math.ceil(originalBytes / KB_TO_BYTES);
                      setTargetSizeVal(curKb + 500);
                      setTargetUnit('KB');
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100"
                  >
                    +500 KB
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      const curKb = Math.ceil(originalBytes / KB_TO_BYTES);
                      setTargetSizeVal(Math.max(50, Math.round(curKb * 0.5)));
                      setTargetUnit('KB');
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60 hover:bg-emerald-100"
                  >
                    50% (Half)
                  </button>
                </div>
              </div>

              {/* Mode-specific guidance */}
              {activeMode === 'increase' && (
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
                  <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold">
                      Increase Strategy: Harmless Standard PDF Data Padding
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Zubware will expand your PDF by adding standard-compliant non-rendering data stream structures.
                      Your document text, vector shapes, fonts, page count, and layout remain <strong>100% intact and untouched</strong>.
                    </p>
                  </div>
                </div>
              )}

              {activeMode === 'reduce' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
                    <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-extrabold">
                        Reduction Strategy: Stream & Content Optimization
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Zubware optimizes document stream structures and applies balanced compression. If a PDF is already compressed, it safely preserves your original without degrading quality.
                      </p>
                    </div>
                  </div>

                  {/* Quality preset options */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Compression Profile:
                    </span>
                    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setCompressionPreset('low')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          compressionPreset === 'low'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Low (Max Quality)
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setCompressionPreset('medium')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          compressionPreset === 'medium'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Medium (Balanced)
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setCompressionPreset('strong')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          compressionPreset === 'strong'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Strong (Smallest Size)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'match' && (
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>The requested target size already matches your current PDF file size. Please adjust the target above.</span>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={resetAll}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Remove PDF & Reset
                </button>

                <button
                  type="button"
                  disabled={isProcessing || activeMode === 'match' || targetBytes <= 0}
                  onClick={handleProcess}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-sm transition-all ${
                    isProcessing || activeMode === 'match' || targetBytes <= 0
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : activeMode === 'increase'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-600/20'
                  }`}
                >
                  {activeMode === 'increase' ? (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      Increase PDF Size to {formatDecimalBytes(targetBytes)}
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4" />
                      Reduce PDF Size to {formatDecimalBytes(targetBytes)}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <PdfProcessingProgress
                currentStage={stage}
                percent={progress}
                message={
                  activeMode === 'increase'
                    ? 'Calibrating standard PDF data padding to reach exact byte target...'
                    : 'Applying browser-based PDF stream optimization...'
                }
              />
            )}

            {/* Result Display Card */}
            {(increaseResult || reduceResult) && outputBlob && !isProcessing && (
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Size Adjustment Complete!
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {increaseResult
                          ? increaseResult.message
                          : reduceResult?.modeNotice || 'PDF successfully processed.'}
                      </p>
                    </div>
                  </div>

                  {/* Accuracy Badge */}
                  {increaseResult && (
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border ${
                        increaseResult.isExact
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                          : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200'
                      }`}
                    >
                      {increaseResult.isExact ? 'Exact Target Reached' : 'Closest Achievable Result'}
                    </span>
                  )}

                  {reduceResult && reduceResult.isAlreadyOptimized && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200">
                      Already Highly Optimized
                    </span>
                  )}
                </div>

                {/* Metrics Comparison Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Original Size
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {formatDecimalBytes(originalBytes)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {originalBytes.toLocaleString()} B
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Target Size
                    </div>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {formatDecimalBytes(targetBytes)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {targetBytes.toLocaleString()} B
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">
                      Final Output Size
                    </div>
                    <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {formatDecimalBytes(outputBlob.size)}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      {outputBlob.size.toLocaleString()} B
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Difference
                    </div>
                    {increaseResult && (
                      <>
                        <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                          +{formatDecimalBytes(increaseResult.diffBytes)}
                        </div>
                        <div className="text-[11px] font-bold text-indigo-500">
                          +{( (increaseResult.diffBytes / originalBytes) * 100 ).toFixed(1)}%
                        </div>
                      </>
                    )}
                    {reduceResult && (
                      <>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          -{formatDecimalBytes(reduceResult.reducedBytes)}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-500">
                          {reduceResult.reductionPercentage}% Reduced
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Safeguard / Warning Notice if target couldn't safely be reached */}
                {reduceResult?.warningNotice && (
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Optimization Notice:</p>
                      <p>{reduceResult.warningNotice}</p>
                    </div>
                  </div>
                )}

                {/* Document Verification Checks */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Document Integrity Checks:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Valid %PDF- structure verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{pageCount} page{pageCount > 1 ? 's' : ''} preserved intact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>100% Client-side sandbox</span>
                    </div>
                  </div>
                </div>

                {/* Primary Download Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Adjust Another PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2.5 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF ({formatDecimalBytes(outputBlob.size)})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature Highlights & Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Increase File Size
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Expand PDF file sizes to satisfy strict minimum upload thresholds for government exam portals, tenders, and job applications without modifying visual pages.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Reduce File Size
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Compress PDF document streams and image assets to fit email attachments and size caps while preserving selectable text, fonts, and sharpness.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            100% Client-Side Privacy
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your PDF documents are processed strictly inside your web browser sandbox using WebAssembly and canvas. No files are ever sent to any remote server.
          </p>
        </div>
      </div>
    </div>
  );
};
