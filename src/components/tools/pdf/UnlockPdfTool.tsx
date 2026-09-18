import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Unlock, Eye, EyeOff, ShieldAlert, CheckCircle2, KeyRound, Lock, FileCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

// Configure pdfjs worker source safely
if (typeof window !== 'undefined') {
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.2.108'}/build/pdf.worker.min.mjs`;
    }
  } catch {
    // Fallback gracefully
  }
}

export const UnlockPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEncryptedFile, setIsEncryptedFile] = useState<boolean>(false);
  const [requiresOpenPassword, setRequiresOpenPassword] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);
  const [unlockedSuccess, setUnlockedSuccess] = useState<string | null>(null);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [unlockedFileSize, setUnlockedFileSize] = useState<number | null>(null);

  const handleFileAdded = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    setErrorMessage(null);
    setUnlockedSuccess(null);
    if (downloadBlobUrl) {
      URL.revokeObjectURL(downloadBlobUrl);
      setDownloadBlobUrl(null);
    }
    setUnlockedFileSize(null);

    try {
      const buffer = await uploadedFile.arrayBuffer();
      let count = 0;
      let encrypted = false;
      let needsPassword = false;

      // 1. Test loading with standard pdf-lib
      try {
        const testDoc = await PDFDocument.load(buffer);
        count = testDoc.getPageCount();
        encrypted = false;
        needsPassword = false;
      } catch (err: any) {
        encrypted = true;
        // 2. Test if it opens with empty password in PDF.js (Owner restricted vs User password)
        try {
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(buffer.slice(0)),
            password: '',
          });
          const pdf = await loadingTask.promise;
          count = pdf.numPages;
          needsPassword = false; // Opens without password, only permissions/owner locked!
        } catch (pdfErr: any) {
          needsPassword = true; // Requires open password
          try {
            const ignoreDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
            count = ignoreDoc.getPageCount();
          } catch {
            count = 1;
          }
        }
      }

      const version = extractPdfVersionFromBuffer(buffer);

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);
      setIsEncryptedFile(encrypted);
      setRequiresOpenPassword(needsPassword);

      if (encrypted && !needsPassword) {
        onShowToast('Owner-restricted PDF detected. Can be unlocked directly!');
      } else if (encrypted && needsPassword) {
        onShowToast('Password-protected PDF detected. Enter password to unlock.');
      } else {
        onShowToast('Loaded PDF file.');
      }
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const handleUnlockAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    if (requiresOpenPassword && !password.trim()) {
      setErrorMessage('This PDF requires a document password to open. Please enter the password above.');
      return;
    }

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(15);
    setErrorMessage(null);
    setUnlockedSuccess(null);

    try {
      await new Promise(r => setTimeout(r, 80));
      setStage('Analyzing');
      setProgress(30);

      let unencryptedPdfBytes: Uint8Array | null = null;

      // ATTEMPT 1: If document does NOT require open password, try lossless vector copy via pdf-lib
      if (!requiresOpenPassword) {
        try {
          const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
          const newDoc = await PDFDocument.create();
          const count = srcDoc.getPageCount();
          const indices = Array.from({ length: count }, (_, i) => i);
          const copiedPages = await newDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => newDoc.addPage(p));
          const testBytes = await newDoc.save();

          // Verify that the produced document loads cleanly without encryption
          const verifyDoc = await PDFDocument.load(testBytes);
          if (verifyDoc.getPageCount() === count) {
            unencryptedPdfBytes = testBytes;
          }
        } catch (stripErr) {
          console.warn('Vector page copy failed, falling back to PDF.js engine:', stripErr);
        }
      }

      // ATTEMPT 2: High-fidelity PDF.js decryption engine with memory-safe rendering
      if (!unencryptedPdfBytes) {
        setStage('Processing');
        setProgress(45);

        try {
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(pdfBuffer.slice(0)),
            password: password.trim(),
          });
          const pdf = await loadingTask.promise;
          const totalPages = pdf.numPages;

          const newDoc = await PDFDocument.create();

          // Reusable single canvas element to completely avoid memory spikes & mobile crashes
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) throw new Error('Canvas rendering context not available');

          for (let i = 1; i <= totalPages; i++) {
            setProgress(45 + Math.round((i / totalPages) * 45));
            const page = await pdf.getPage(i);
            const origViewport = page.getViewport({ scale: 1.0 });

            // Adaptive scale: 1.5x gives 108-150 DPI for crisp text while capping max resolution
            let renderScale = 1.5;
            const maxDim = Math.max(origViewport.width, origViewport.height);
            if (maxDim > 1200) {
              renderScale = Math.min(1.5, 1800 / maxDim);
            }
            const renderViewport = page.getViewport({ scale: renderScale });

            canvas.width = Math.round(renderViewport.width);
            canvas.height = Math.round(renderViewport.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvasContext: ctx,
              viewport: renderViewport,
              canvas,
            }).promise;

            // Direct binary blob encoding avoids gigabytes of base64 allocations
            const jpegBlob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, 'image/jpeg', 0.88)
            );

            if (!jpegBlob) throw new Error('Failed to encode page image');

            const jpegBytes = await jpegBlob.arrayBuffer();
            const embeddedImg = await newDoc.embedJpg(jpegBytes);

            const newPage = newDoc.addPage([origViewport.width, origViewport.height]);
            newPage.drawImage(embeddedImg, {
              x: 0,
              y: 0,
              width: origViewport.width,
              height: origViewport.height,
            });

            // Clean up page object and yield to browser event loop for GC
            page.cleanup();
            await new Promise((r) => setTimeout(r, 20));
          }

          // Clean up reusable canvas memory
          canvas.width = 1;
          canvas.height = 1;

          unencryptedPdfBytes = await newDoc.save();
        } catch (pdfjsErr: any) {
          console.error('Decryption failed:', pdfjsErr);
          if (
            pdfjsErr?.name === 'PasswordException' ||
            pdfjsErr?.message?.toLowerCase().includes('password') ||
            pdfjsErr?.code === 1 ||
            pdfjsErr?.code === 2
          ) {
            setErrorMessage('Incorrect password entered. Please check the document password and try again.');
          } else {
            setErrorMessage(`Failed to unlock PDF: ${pdfjsErr?.message || 'Unsupported encryption format'}`);
          }
          setIsProcessing(false);
          return;
        }
      }

      if (!unencryptedPdfBytes) {
        setErrorMessage('Unable to unlock document. Please check the password.');
        setIsProcessing(false);
        return;
      }

      setStage('Preparing Download');
      setProgress(95);

      const blob = new Blob([unencryptedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const downloadName = `${baseName}_unlocked.pdf`;

      setDownloadBlobUrl(url);
      setUnlockedFileSize(blob.size);

      // Trigger instant download
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStage('Completed');
      setProgress(100);
      setUnlockedSuccess(downloadName);
      onShowToast('Unlocked PDF created and downloaded successfully!');
    } catch (err: any) {
      console.error('Unlock PDF error:', err);
      setErrorMessage(`Error unlocking PDF: ${err?.message || 'Unknown error'}`);
    } finally {
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  const resetAll = () => {
    if (downloadBlobUrl) {
      URL.revokeObjectURL(downloadBlobUrl);
      setDownloadBlobUrl(null);
    }
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPassword('');
    setErrorMessage(null);
    setUnlockedSuccess(null);
    setUnlockedFileSize(null);
    setIsProcessing(false);
    setIsEncryptedFile(false);
    setRequiresOpenPassword(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🔓</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('unlockPdfTitle', 'Unlock & Remove PDF Password')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t(
            'unlockPdfSubtitle',
            'Remove password restrictions, printing limits, and owner security from PDF files 100% locally in your browser.'
          )}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfUnlock', 'Select protected PDF file to unlock')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsSinglePdf', 'Choose any password-protected or restricted PDF document')}
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileAdded(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="space-y-6">
          <FileInformationPanel
            fileName={file.name}
            fileSize={file.size}
            pageCount={pageCount}
            pdfVersion={pdfVersion}
            status={isProcessing ? stage : 'Idle'}
            statusProgress={progress}
          />

          <div className="p-6 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Document Security Status
                </h3>
              </div>
              {isEncryptedFile ? (
                requiresOpenPassword ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Lock className="w-3.5 h-3.5" />
                    Open Password Required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <FileCheck className="w-3.5 h-3.5" />
                    Permission Locked (No Password Needed)
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Not Password Protected
                </span>
              )}
            </div>

            {requiresOpenPassword ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Document Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Enter password to unlock"
                    className="w-full p-3 pr-10 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  This document has an open password. Enter it once to permanently remove it and get an unlocked PDF.
                </p>
              </div>
            ) : isEncryptedFile ? (
              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  This PDF has owner-level restrictions (e.g. printing or editing blocked), but no open password.
                  Click <strong>Unlock PDF & Download Clean File</strong> below to remove all restrictions directly!
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  This PDF is already completely unlocked! You can click below to generate a fresh, normalized copy with stripped metadata and permissions.
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex gap-3 items-start leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Decryption Error</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            {unlockedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between leading-relaxed">
                <div className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">PDF Unlocked Successfully!</strong>
                    <span>
                      {unlockedSuccess} {unlockedFileSize ? `(${(unlockedFileSize / 1000).toFixed(1)} KB)` : ''} — ready to view without any passwords.
                    </span>
                  </div>
                </div>
                {downloadBlobUrl && (
                  <a
                    href={downloadBlobUrl}
                    download={unlockedSuccess}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    Download Again
                  </a>
                )}
              </div>
            )}
          </div>

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="py-4 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm cursor-pointer transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleUnlockAndDownload}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Unlock className="w-4 h-4" />
                Unlock PDF & Download Clean File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

