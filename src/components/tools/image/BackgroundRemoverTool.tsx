import React, { useState, useRef, useCallback } from 'react';
import {
  Scissors,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  ChevronDown,
  FileImage,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { processBackgroundRemoval, BackgroundRemovalResult } from '../../../lib/backgroundRemoval';
import { formatBytes } from '../../../lib/imageUtils';
import { getLinkUrl } from '../../../lib/paths';

interface BackgroundRemoverToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type PreviewBackground = 'checkerboard' | 'white' | 'black' | 'gray';
type ViewMode = 'result' | 'original' | 'slider';

interface ToolFAQ {
  question: string;
  answer: string;
}

const FAQS: ToolFAQ[] = [
  {
    question: 'What image formats are supported?',
    answer: 'The AI Background Remover supports JPG, JPEG, PNG, and WebP image formats up to 20 MB.'
  },
  {
    question: 'Does the tool remove backgrounds automatically?',
    answer: 'Yes! The AI automatically detects people, products, animals, cars, and objects in your photo and extracts them without requiring manual tracing or lasso tools.'
  },
  {
    question: 'Can I download a transparent PNG?',
    answer: 'Absolutely. The final output is saved as a 32-bit PNG file containing real transparent alpha pixels, perfect for graphics, e-commerce, and design projects.'
  },
  {
    question: 'Is my image uploaded to any server?',
    answer: 'No. All AI segmentation and image rendering take place 100% locally in your web browser memory. Your private photos never leave your device.'
  },
  {
    question: 'Can I remove the background from a product photo?',
    answer: 'Yes, it is optimized for e-commerce products, fashion models, vehicles, furniture, and everyday objects with crisp edge accuracy.'
  },
  {
    question: 'Does it preserve original image resolution?',
    answer: 'Yes! Even though AI models process at internal tensor resolutions, Zubware maps the high-precision alpha matte back onto your full-resolution source image.'
  }
];

export const BackgroundRemoverTool: React.FC<BackgroundRemoverToolProps> = ({ onShowToast, onNavigate }) => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('Preparing AI background remover...');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [largeFileWarning, setLargeFileWarning] = useState<boolean>(false);

  // Result state
  const [result, setResult] = useState<BackgroundRemovalResult | null>(null);

  // Preview options
  const [previewBg, setPreviewBg] = useState<PreviewBackground>('checkerboard');
  const [viewMode, setViewMode] = useState<ViewMode>('result');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // FAQ collapse state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext || '');

    if (!validTypes.includes(file.type.toLowerCase()) && !isValidExt) {
      onShowToast('Please select a valid JPG, PNG, or WebP image.');
      return;
    }

    // Recommended max size warning (20MB)
    if (file.size > 20 * 1024 * 1024) {
      onShowToast('File size exceeds recommended 20 MB limit. Processing may be slow or fail on mobile.');
    }

    setLargeFileWarning(file.size > 15 * 1024 * 1024);
    setSelectedFile(file);
    setErrorMessage(null);
    setResult(null);

    const origUrl = URL.createObjectURL(file);
    setOriginalPreviewUrl(origUrl);

    // Trigger AI background removal
    runRemoval(file);
  }, [onShowToast]);

  // Execute AI Background Removal
  const runRemoval = async (fileToProcess: File) => {
    setIsProcessing(true);
    setProgressPercent(5);
    setProcessingStage('Preparing AI background remover...');
    setErrorMessage(null);

    try {
      const res = await processBackgroundRemoval(fileToProcess, (prog) => {
        setProcessingStage(prog.stage);
        setProgressPercent(prog.percent);
      });

      setResult(res);
      setIsProcessing(false);
      onShowToast('✓ Background removed successfully!');
    } catch (err: any) {
      console.error('Background removal error:', err);
      setIsProcessing(false);
      setErrorMessage(
        err?.message || 'Could not process background removal. Please try a smaller image or a different browser.'
      );
      onShowToast('Error removing background');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Reset tool
  const handleReset = () => {
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);

    setSelectedFile(null);
    setOriginalPreviewUrl(null);
    setResult(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setLargeFileWarning(false);
    setProgressPercent(0);
    setViewMode('result');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download transparent PNG
  const handleDownload = () => {
    if (!result || !selectedFile) return;

    const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
    const cleanName = originalName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const downloadFilename = `${cleanName}-no-bg.png`;

    const link = document.createElement('a');
    link.href = result.url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Downloaded ${downloadFilename}`);
  };

  // Get CSS background class for preview
  const getPreviewBgStyle = () => {
    switch (previewBg) {
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-slate-950';
      case 'gray':
        return 'bg-slate-300 dark:bg-slate-700';
      case 'checkerboard':
      default:
        return 'bg-checkerboard';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* CSS for Checkerboard Background */}
      <style>{`
        .bg-checkerboard {
          background-color: #f8fafc;
          background-image: 
            linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .dark .bg-checkerboard {
          background-color: #0f172a;
          background-image: 
            linear-gradient(45deg, #1e293b 25%, transparent 25%),
            linear-gradient(-45deg, #1e293b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e293b 75%),
            linear-gradient(-45deg, transparent 75%, #1e293b 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>

      {/* Privacy Notice Banner */}
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="font-medium">
            <strong className="font-bold">🔒 Private & Local:</strong> Your image is processed directly in your browser. Files are never uploaded to Zubware.
          </p>
        </div>
      </div>

      {/* ========================================================
          UPLOAD AREA (When no image is selected yet)
          ======================================================== */}
      {!selectedFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50/80 dark:hover:bg-slate-900/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
            <Scissors className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Remove Image Background
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
            Upload an image and automatically remove its background with browser AI. Download transparent PNGs instantly.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <FileImage className="w-4 h-4" />
              <span>Browse Image</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">or drag & drop here</span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Supported: JPG, PNG, WEBP
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Max size: 20 MB
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Free & Automatic
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          PROCESSING / LOADING STATE
          ======================================================== */}
      {isProcessing && (
        <div className="p-8 sm:p-12 glass-card rounded-3xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Scissors className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {processingStage}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Running browser AI segmentation model. This might take a few seconds...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(10, progressPercent)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Client-side AI</span>
              <span>{progressPercent}%</span>
            </div>
          </div>

          {largeFileWarning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs inline-flex items-center gap-2 max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Large image detected. Processing may take a moment longer depending on your hardware.</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          ERROR STATE
          ======================================================== */}
      {errorMessage && !isProcessing && (
        <div className="p-6 sm:p-8 glass-card rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-red-900 dark:text-red-200">
            Background Removal Failed
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">
            {errorMessage}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-all"
            >
              Try Another Image
            </button>
            {selectedFile && (
              <button
                onClick={() => runRemoval(selectedFile)}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUCCESS / PREVIEW & DOWNLOAD STATE
          ======================================================== */}
      {result && !isProcessing && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Background Removed</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] uppercase font-black tracking-wider">
                    Ready
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedFile?.name} ({formatBytes(selectedFile?.size || 0)}) • {result.width} × {result.height} px
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleReset}
                className="py-2 px-3.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Remove Another</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD PNG</span>
              </button>
            </div>
          </div>

          {/* View Mode & Background Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('result')}
                className={`py-1.5 px-3 rounded-lg transition-all ${
                  viewMode === 'result'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Result
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`py-1.5 px-3 rounded-lg transition-all ${
                  viewMode === 'slider'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Before / After Slider
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`py-1.5 px-3 rounded-lg transition-all ${
                  viewMode === 'original'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Original
              </button>
            </div>

            {/* Preview Background Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Preview BG:</span>
              <div className="flex items-center gap-1">
                <button
                  title="Checkerboard (Transparent)"
                  onClick={() => setPreviewBg('checkerboard')}
                  className={`w-7 h-7 rounded-lg border-2 transition-all bg-checkerboard ${
                    previewBg === 'checkerboard' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                />
                <button
                  title="White"
                  onClick={() => setPreviewBg('white')}
                  className={`w-7 h-7 rounded-lg border-2 bg-white transition-all ${
                    previewBg === 'white' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                />
                <button
                  title="Black"
                  onClick={() => setPreviewBg('black')}
                  className={`w-7 h-7 rounded-lg border-2 bg-slate-950 transition-all ${
                    previewBg === 'black' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                />
                <button
                  title="Gray"
                  onClick={() => setPreviewBg('gray')}
                  className={`w-7 h-7 rounded-lg border-2 bg-slate-400 transition-all ${
                    previewBg === 'gray' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* MAIN PREVIEW CANVAS DISPLAY */}
          <div className="relative glass-card rounded-3xl overflow-hidden p-4 sm:p-6 flex items-center justify-center min-h-[350px] max-h-[600px]">
            {/* Mode 1: Transparent Result */}
            {viewMode === 'result' && (
              <div className={`relative max-w-full max-h-[500px] rounded-2xl overflow-hidden p-2 shadow-inner transition-colors duration-200 ${getPreviewBgStyle()}`}>
                <img
                  src={result.url}
                  alt="Transparent background result"
                  className="max-w-full max-h-[480px] object-contain mx-auto rounded-lg"
                />
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                  Transparent PNG ({result.width} × {result.height})
                </span>
              </div>
            )}

            {/* Mode 2: Original */}
            {viewMode === 'original' && originalPreviewUrl && (
              <div className="relative max-w-full max-h-[500px] rounded-2xl overflow-hidden p-2 bg-slate-100 dark:bg-slate-900 shadow-inner">
                <img
                  src={originalPreviewUrl}
                  alt="Original image"
                  className="max-w-full max-h-[480px] object-contain mx-auto rounded-lg"
                />
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                  Original Source
                </span>
              </div>
            )}

            {/* Mode 3: Before / After Interactive Slider */}
            {viewMode === 'slider' && originalPreviewUrl && (
              <div className="relative w-full max-w-2xl h-[400px] sm:h-[480px] rounded-2xl overflow-hidden select-none shadow-xl">
                {/* Background (Before Image) */}
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <img
                    src={originalPreviewUrl}
                    alt="Original before removal"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold z-10 backdrop-blur-md">
                    BEFORE
                  </span>
                </div>

                {/* Foreground (After Image clipped by slider position) */}
                <div
                  className={`absolute inset-0 overflow-hidden ${getPreviewBgStyle()}`}
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={result.url}
                    alt="Transparent result"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold z-10 backdrop-blur-md">
                    AFTER
                  </span>
                </div>

                {/* Divider bar */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center border-2 border-indigo-600 text-xs font-bold">
                    ↔
                  </div>
                </div>

                {/* Invisible slider input for touch/mouse */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            )}
          </div>

          {/* Action Download Banner */}
          <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-transparent border-indigo-200/50 dark:border-indigo-800/50">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Ready to download transparent image?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saved with real alpha channel. Zero compression artifacts.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>DOWNLOAD PNG ({result.width} × {result.height})</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ANSWER-FIRST CONTENT & EXPLANATION
          ======================================================== */}
      <div className="pt-8 space-y-8 border-t border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
        <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            What is an AI Background Remover?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            An AI background remover automatically detects the main subject in an image and removes the surrounding background, creating a transparent image. Unlike manual photo editing software that requires painstaking lasso selections, our client-side machine learning segmentation model analyzes edge boundaries, color contrast, and depth pixels in real-time.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4">
            How to remove an image background online?
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <li className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upload Your Photo</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Drag & drop or browse any JPG, PNG, or WebP image.</p>
            </li>
            <li className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">2</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">AI Detection</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Our browser AI segments foreground subject and cuts background.</p>
            </li>
            <li className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">3</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Preview Transparency</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Inspect the transparent result on checkerboard or color canvas.</p>
            </li>
            <li className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">4</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Download PNG</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Save a high-resolution PNG with real alpha channel.</p>
            </li>
          </ol>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-white/50 dark:bg-slate-900/50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RELATED IMAGE TOOLS */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Related Image Tools
            </h3>
            <span className="text-xs text-slate-500 font-medium">Zubware Suite</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {[
              { id: 'image-compressor', title: 'Image Compressor', icon: '🗜️', path: '/image-compressor.html' },
              { id: 'image-resizer', title: 'Image Resizer', icon: '📐', path: '/image-resizer.html' },
              { id: 'heic-to-jpg', title: 'HEIC to JPG', icon: '📱', path: '/heic-to-jpg.html' },
              { id: 'bulk-image-renamer-resizer', title: 'Bulk Image Renamer', icon: '📁', path: '/bulk-image-renamer-resizer.html' },
              { id: 'passport-photo-maker', title: 'Passport Photo Maker', icon: '🪪', path: '/passport-photo-maker.html' },
              { id: 'image-converter', title: 'Image Converter', icon: '🔄', path: '/image-converter.html' },
              { id: 'crop-image', title: 'Crop Image', icon: '✂️', path: '/crop-image.html' },
              { id: 'background-color-changer', title: 'BG Color Changer', icon: '🎨', path: '/background-color-changer.html' }
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => onNavigate && onNavigate(getLinkUrl(tool.path))}
                className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 text-left transition-all group flex items-center gap-2.5"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {tool.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
