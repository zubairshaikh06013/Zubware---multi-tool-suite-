import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  FileImage,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { processBackgroundRemoval, BackgroundRemovalResult, BackgroundRemovalMode, BackgroundRemovalProgress } from '../../../lib/backgroundRemoval';
import { processCloudflareBackgroundRemoval } from '../../../lib/cloudflareBackgroundRemoval';
import { formatBytes } from '../../../lib/imageUtils';
import { getLinkUrl } from '../../../lib/paths';

interface BackgroundRemoverToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type PreviewBackground = 'checkerboard' | 'white' | 'black' | 'gray';
type ViewMode = 'result' | 'original' | 'slider';

export const BackgroundRemoverTool: React.FC<BackgroundRemoverToolProps> = ({ onShowToast, onNavigate }) => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('Preparing AI background remover...');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [largeFileWarning, setLargeFileWarning] = useState<boolean>(false);

  const [processingMode, setProcessingMode] = useState<BackgroundRemovalMode | 'cloudflare'>('quality');
  const [cloudflareConsent, setCloudflareConsent] = useState(false);

  // Result state
  const [result, setResult] = useState<BackgroundRemovalResult | null>(null);

  // Preview options
  const [previewBg, setPreviewBg] = useState<PreviewBackground>('checkerboard');
  const [viewMode, setViewMode] = useState<ViewMode>('result');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  // Revoke generated URLs on replacement and unmount to avoid retaining image blobs.
  useEffect(() => () => {
    requestIdRef.current += 1;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

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

    requestIdRef.current += 1;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
    setLargeFileWarning(file.size > 15 * 1024 * 1024);
    setSelectedFile(file);
    setOriginalDimensions(null);
    setErrorMessage(null);
    setResult(null);

    const origUrl = URL.createObjectURL(file);
    previewUrlRef.current = origUrl;
    setOriginalPreviewUrl(origUrl);
    const metadataImage = new Image();
    metadataImage.onload = () => {
      if (previewUrlRef.current === origUrl) {
        setOriginalDimensions({ width: metadataImage.naturalWidth, height: metadataImage.naturalHeight });
      }
    };
    metadataImage.src = origUrl;

    // Browser mode remains automatic. Cloudflare uploads require a separate explicit click.
    if (processingMode !== 'cloudflare') runRemoval(file);
  }, [onShowToast]);

  // Execute AI Background Removal
  const runRemoval = async (fileToProcess: File) => {
    const requestId = requestIdRef.current;
    setIsProcessing(true);
    setProgressPercent(5);
    setProcessingStage('Preparing AI background remover...');
    setErrorMessage(null);

    try {
      if (processingMode === 'cloudflare' && !cloudflareConsent) {
        throw new Error('Please agree to upload this photo to Cloudflare before starting.');
      }
      const onProgress = (prog: BackgroundRemovalProgress) => {
        if (requestId !== requestIdRef.current) return;
        setProcessingStage(prog.stage);
        setProgressPercent(prog.percent);
      };
      const res = processingMode === 'cloudflare'
        ? await processCloudflareBackgroundRemoval(fileToProcess, onProgress)
        : await processBackgroundRemoval(fileToProcess, onProgress, processingMode);

      if (requestId !== requestIdRef.current) {
        URL.revokeObjectURL(res.url);
        return;
      }
      resultUrlRef.current = res.url;
      setResult(res);
      setIsProcessing(false);
      onShowToast('✓ Background removed successfully!');
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
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
    requestIdRef.current += 1;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    previewUrlRef.current = null;
    resultUrlRef.current = null;

    setSelectedFile(null);
    setOriginalPreviewUrl(null);
    setResult(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setLargeFileWarning(false);
    setProgressPercent(0);
    setViewMode('result');
    setCloudflareConsent(false);
    setOriginalDimensions(null);
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

      {/* Mode selection: consistent, accessible cards on mobile and desktop. */}
      <section aria-labelledby="bg-mode-heading" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
        <div className="mb-4">
          <h2 id="bg-mode-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Choose the best option for your photo</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">Not sure which to choose? Smart AI Removal is recommended for most photos. All options create a transparent PNG.</p>
        </div>
        <fieldset disabled={isProcessing}>
          <legend className="sr-only">Background removal processing mode</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { id: 'cloudflare', icon: '🚀', title: 'Smart AI Removal', subtitle: 'Recommended for most photos', detail: 'Works well on mobile · Up to 10 MB · Upload permission required', badge: 'RECOMMENDED' },
              { id: 'fast', icon: '⚡', title: 'Quick Removal', subtitle: 'Faster processing on your device', detail: 'No upload · Fine details may be reduced', badge: 'PRIVATE' },
              { id: 'quality', icon: '🔒', title: 'Private Removal', subtitle: 'Keeps your photo on your device', detail: 'No upload · May take longer on mobile', badge: 'PRIVATE' }
            ] as const).map(mode => (
              <label key={mode.id} className={`relative flex items-start gap-3 rounded-xl border-2 p-3.5 sm:p-4 cursor-pointer transition-colors ${processingMode === mode.id ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'} ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input type="radio" name="bg-removal-mode" value={mode.id} checked={processingMode === mode.id} onChange={() => setProcessingMode(mode.id)} className="mt-1 accent-indigo-600 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span aria-hidden="true">{mode.icon}</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{mode.title}</span>
                  </span>
                  {mode.id === 'cloudflare' && <span className="inline-flex mt-1 rounded-full bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-200">Recommended</span>}
                  <span className="block mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">{mode.subtitle}</span>
                  <span className="block mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{mode.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 sm:p-4">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">{processingMode === 'cloudflare' ? 'Smart AI Removal · Upload permission required' : 'Your photo stays on your device'}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{processingMode === 'cloudflare' ? 'Smart AI Removal sends your selected photo to our processing provider, Cloudflare, only after you give permission and start. Avoid private or sensitive photos. Results and speed may vary.' : 'Quick Removal and Private Removal process photos on your device. Your photo is not uploaded for processing.'}</p>
              </div>
            </div>
            {processingMode === 'cloudflare' && (
              <label className="mt-3 flex items-start gap-2.5 border-t border-indigo-200/70 dark:border-indigo-800 pt-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                <input type="checkbox" checked={cloudflareConsent} onChange={e => setCloudflareConsent(e.target.checked)} className="mt-0.5 accent-indigo-600 shrink-0" />
                <span>I agree to send my selected photo to Cloudflare for background removal. I will not use sensitive photos.</span>
              </label>
            )}
          </div>
        </fieldset>
      </section>

      {/* ========================================================
          UPLOAD AREA (When no image is selected yet)
          ======================================================== */}
      {!selectedFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
            aria-label="Choose an image to remove its background"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />

          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
            <Scissors className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Remove Image Background
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
            {processingMode === 'cloudflare' ? 'Choose a photo, then give permission to process it online. Download a transparent PNG.' : 'Choose a photo to remove its background on your device. Download a transparent PNG.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <span
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <FileImage className="w-4 h-4" />
              <span>Browse Image</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">or drag & drop here</span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Supported: JPG, PNG, WEBP
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Max size: {processingMode === 'cloudflare' ? '10 MB' : '20 MB'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {processingMode === 'cloudflare' ? 'Online AI after permission' : 'No photo upload'}
            </span>
          </div>
        </div>
      )}

      {selectedFile && processingMode === 'cloudflare' && !isProcessing && !result && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 p-4 space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-200">Original: {selectedFile.name} • {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height} px` : "Reading dimensions…"} • {formatBytes(selectedFile.size)} ({(selectedFile.size / 1024).toFixed(1)} KB). Your photo stays on this device until you start.</p>
          <button type="button" disabled={!cloudflareConsent || selectedFile.size > 10 * 1024 * 1024} onClick={() => runRemoval(selectedFile)} className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">Start Smart AI Removal</button>
          {selectedFile.size > 10 * 1024 * 1024 && <p className="text-xs text-red-600">Smart AI Removal supports photos up to 10 MB. Choose a smaller photo or use Quick or Private Removal.</p>}
          <button type="button" onClick={handleReset} className="ml-3 text-sm underline text-slate-600 dark:text-slate-300">Choose another photo</button>
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
              {processingMode === 'cloudflare' ? 'Uploading and removing the background online...' : 'Removing the background on your device. This may take a little longer on mobile...'}
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
              <span>{processingMode === 'cloudflare' ? 'Smart AI Removal' : 'On-device removal'}</span>
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
                  {selectedFile?.name}<br />Original: {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height} px` : `${result.originalWidth} × ${result.originalHeight} px`} • {((selectedFile?.size || 0) / 1024).toFixed(1)} KB ({formatBytes(selectedFile?.size || 0)})<br />Output: {result.width} × {result.height} px • {(result.blob.size / 1024).toFixed(1)} KB ({formatBytes(result.blob.size)})
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

    </div>
  );
};
