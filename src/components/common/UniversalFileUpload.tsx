import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Camera,
  Clipboard,
  FileText,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  FileCode,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface UniversalFileUploadProps {
  /** Callback when user selects or drops valid files */
  onFilesSelected: (files: File[]) => void;

  /** Optional callback when user clears or resets selected files */
  onClear?: () => void;

  /** Optional callback when user clicks Replace file button */
  onReplace?: () => void;

  /** Currently selected file(s) if controlled by parent */
  files?: File[];

  /** File types allowed, e.g., 'image/*', '.pdf', 'image/*,.pdf', '.json,.csv' */
  accept?: string;

  /** Allow multiple files selection */
  multiple?: boolean;

  /** Maximum allowed file size in MB (e.g. 50 for 50MB) */
  maxSizeMB?: number;

  /** Custom main title on dropzone */
  title?: string;

  /** Custom subtitle on dropzone */
  subtitle?: string;

  /** Custom support text, e.g., "Supports JPG, PNG, WebP, PDF up to 50MB" */
  fileTypeSupportText?: string;

  /** Current processing state */
  status?: 'idle' | 'processing' | 'success' | 'error';

  /** Progress percentage (0 to 100) */
  progress?: number;

  /** Text step description during processing */
  processingStep?: string;

  /** Custom error message string */
  errorMessage?: string;

  /** Custom success message string */
  successMessage?: string;

  /** Enable camera capture button (default: true) */
  showCamera?: boolean;

  /** Enable clipboard paste button (default: true) */
  showClipboard?: boolean;

  /** Show visual preview thumbnail for images/documents (default: true) */
  showPreview?: boolean;

  /** Compact mode layout */
  compact?: boolean;

  /** Additional wrapper CSS class */
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const EMPTY_FILES: File[] = [];

export const UniversalFileUpload: React.FC<UniversalFileUploadProps> = ({
  onFilesSelected,
  onClear,
  onReplace,
  files = EMPTY_FILES,
  accept = '*',
  multiple = false,
  maxSizeMB = 100,
  title,
  subtitle,
  fileTypeSupportText,
  status = 'idle',
  progress,
  processingStep,
  errorMessage,
  successMessage,
  showCamera = true,
  showClipboard = true,
  showPreview = true,
  compact = false,
  className = ''
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  // Generate image preview URLs safely without triggering re-render cascades
  useEffect(() => {
    if (!showPreview || files.length === 0) {
      setPreviews((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      return;
    }

    const newPreviews: { [key: string]: string } = {};
    const createdUrls: string[] = [];

    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newPreviews[`${file.name}-${index}`] = url;
        createdUrls.push(url);
      }
    });

    setPreviews(newPreviews);

    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, showPreview]);

  // Global Clipboard paste event listener (Ctrl+V)
  useEffect(() => {
    if (!showClipboard) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      const matchedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (blob) {
            const ext = blob.type.split('/')[1] || 'bin';
            const pastedFile = new File([blob], `clipboard_pasted_${Date.now()}.${ext}`, {
              type: blob.type
            });
            matchedFiles.push(pastedFile);
          }
        }
      }

      if (matchedFiles.length > 0) {
        validateAndSubmit(matchedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [showClipboard, accept, maxSizeMB, multiple]);

  // File validation logic
  const validateAndSubmit = (incomingFiles: File[]) => {
    setInternalError(null);

    if (!incomingFiles || incomingFiles.length === 0) return;

    const selectedList = multiple ? incomingFiles : [incomingFiles[0]];
    const validFiles: File[] = [];

    for (const file of selectedList) {
      // Check size limit
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setInternalError(
          t('fileTooLarge', `File "${file.name}" exceeds the max limit of ${maxSizeMB}MB.`)
        );
        return;
      }

      // Check mime type / extension match if accept is specified and not '*'
      if (accept && accept !== '*') {
        const acceptTypes = accept.split(',').map((s) => s.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const matches = acceptTypes.some((type) => {
          if (type.startsWith('.')) {
            return fileName.endsWith(type);
          }
          if (type.endsWith('/*')) {
            const group = type.replace('/*', '');
            return fileType.startsWith(group);
          }
          return fileType === type;
        });

        if (!matches && !fileType.includes('octet-stream')) {
          setInternalError(
            t('invalidFileType', `"${file.name}" is not an accepted format. Allowed: ${accept}`)
          );
          return;
        }
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSubmit(Array.from(e.dataTransfer.files));
    }
  };

  const handleClipboardClick = async () => {
    setInternalError(null);
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        const pastedFiles: File[] = [];

        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/') || type.includes('pdf') || type.includes('text')) {
              const blob = await item.getType(type);
              const ext = type.split('/')[1] || 'file';
              pastedFiles.push(
                new File([blob], `pasted_${Date.now()}.${ext}`, { type })
              );
            }
          }
        }

        if (pastedFiles.length > 0) {
          validateAndSubmit(pastedFiles);
          return;
        }
      }
      setInternalError(t('pasteHint', 'Press Ctrl+V or Cmd+V anywhere on screen to paste files.'));
    } catch {
      setInternalError(t('pasteHint', 'Press Ctrl+V or Cmd+V anywhere on screen to paste files.'));
    }
  };

  const currentError = errorMessage || internalError;
  const isHasFiles = files && files.length > 0;
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden File & Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndSubmit(Array.from(e.target.files));
          }
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndSubmit([e.target.files[0]]);
          }
        }}
      />

      {/* Main Drag & Drop Zone when NO files or in replace mode */}
      {!isHasFiles ? (
        <div
          role="region"
          aria-label={title || 'File upload drag and drop area'}
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-3xl transition-all cursor-pointer text-center group flex flex-col items-center justify-center glass-card ${
            compact ? 'p-6 space-y-3' : 'p-8 sm:p-10 space-y-4'
          } ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
              : 'border-indigo-300/80 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
        >
          {/* Upload Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50/90 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-indigo-500/10">
            <Upload className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 max-w-md">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {title || t('dropFileHere', 'Drop your files here, or click to browse')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle ||
                fileTypeSupportText ||
                t('fileSupportDefault', `Supports ${accept === '*' ? 'all standard files' : accept} up to ${maxSizeMB}MB`)}
            </p>
          </div>

          {/* Interactive Button Bar: Browse, Paste, Camera */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 pt-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Browse Files"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('browseFiles', 'Browse Files')}</span>
            </button>

            {showClipboard && (
              <button
                type="button"
                onClick={handleClipboardClick}
                aria-label="Paste from clipboard"
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                <Clipboard className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                <span>{t('pasteClipboard', 'Paste (Ctrl+V)')}</span>
              </button>
            )}

            {showCamera && (
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                aria-label="Take picture with camera"
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                <span>{t('cameraCapture', 'Camera')}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Selected Files Showcase Area */
        <div className="glass-card p-5 rounded-3xl space-y-4">
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <HardDrive className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {files.length} {files.length === 1 ? t('fileSelected', 'File Selected') : t('filesSelected', 'Files Selected')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Total Size: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{formatBytes(totalSize)}</strong>
                </p>
              </div>
            </div>

            {/* Top Action Buttons: Replace & Remove */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onReplace) onReplace();
                  fileInputRef.current?.click();
                }}
                aria-label="Replace selected file"
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer border border-indigo-200/50 dark:border-indigo-800/50"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('replaceFile', 'Replace')}</span>
              </button>

              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Clear files"
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200/50 dark:border-rose-800/50"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('clearAll', 'Clear')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Files List Items */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {files.map((file, idx) => {
              const previewUrl = previews[`${file.name}-${idx}`];
              const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
              const isImg = file.type.startsWith('image/');

              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 shadow-xs"
                >
                  {/* Thumbnail / Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
                    {isImg && previewUrl ? (
                      <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                    ) : isPdf ? (
                      <FileText className="w-6 h-6 text-rose-500" />
                    ) : isImg ? (
                      <ImageIcon className="w-6 h-6 text-indigo-500" />
                    ) : (
                      <FileCode className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      {formatBytes(file.size)} • <span className="uppercase text-indigo-600 dark:text-indigo-400">{file.type.split('/')[1] || 'file'}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing Status Banner */}
          {status === 'processing' && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {processingStep || t('processingFile', 'Processing file...')}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{progress || 50}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress || 50}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Status Banner */}
          {status === 'success' && (
            <div className="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage || t('fileReady', 'File processed successfully and ready!')}</span>
            </div>
          )}
        </div>
      )}

      {/* Global Error Notice */}
      {currentError && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{currentError}</span>
          </div>
          <button
            type="button"
            onClick={() => setInternalError(null)}
            aria-label="Dismiss error"
            className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
