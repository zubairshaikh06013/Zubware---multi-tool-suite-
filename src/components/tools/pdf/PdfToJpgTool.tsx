import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Image as ImageIcon, Eye, RefreshCw, FileArchive, CheckCircle2, ShieldCheck, Sliders, X } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToCanvas, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';
import { PDFDocument } from 'pdf-lib';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  size: number;
}

export const PdfToJpgTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [scale, setScale] = useState<number>(1.5); // 1.5x (~110 DPI standard)
  const [quality, setQuality] = useState<number>(0.85);
  const [pageRangeMode, setPageRangeMode] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState<string>('');

  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<ConvertedPage | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  // Clean up object URLs when unmounting or resetting
  useEffect(() => {
    return () => {
      // Free any memory if needed
    };
  }, []);

  const handleFileSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF document.');
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
      setConvertedPages([]);
      setSelectedPreview(null);
      setCustomRange(`1-${count}`);
      onShowToast(`Loaded ${count} page${count > 1 ? 's' : ''} from PDF.`);
    } catch {
      onShowToast('Failed to parse PDF document.');
    }
  };

  const parseTargetPages = (total: number): number[] => {
    if (pageRangeMode === 'all') {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    const parts = customRange.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
            if (p >= 1 && p <= total) pages.add(p);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= total) {
          pages.add(p);
        }
      }
    }
    const result = Array.from(pages).sort((a, b) => a - b);
    return result.length > 0 ? result : Array.from({ length: total }, (_, i) => i + 1);
  };

  const processConvertPdfToJpg = async () => {
    if (!pdfBuffer || !file || pageCount === 0) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(10);
    setConvertedPages([]);

    try {
      await new Promise(r => setTimeout(r, 100));
      setStage('Analyzing');
      setProgress(20);

      const targetPages = parseTargetPages(pageCount);
      const results: ConvertedPage[] = [];

      setStage('Processing');

      for (let i = 0; i < targetPages.length; i++) {
        const pageNumber = targetPages[i];
        // 0-indexed for pdfUtils
        const canvas = await renderPdfPageToCanvas(pdfBuffer, pageNumber - 1, scale);

        // Convert canvas to JPG blob & dataUrl
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', quality);
        });

        results.push({
          pageNumber,
          dataUrl,
          blob,
          size: blob.size
        });

        const currentPct = 20 + Math.round(((i + 1) / targetPages.length) * 70);
        setProgress(currentPct);
      }

      setStage('Preparing Download');
      setProgress(95);

      setConvertedPages(results);
      setStage('Completed');
      setProgress(100);

      onShowToast(`Converted ${results.length} page${results.length > 1 ? 's' : ''} to JPG!`);
    } catch (err) {
      console.error('PDF to JPG conversion error:', err);
      onShowToast('Error converting PDF to JPG. Please check file and settings.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingleJpg = (page: ConvertedPage) => {
    if (!file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    const fileName = `${baseName}-page-${page.pageNumber}.jpg`;
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    onShowToast(`Downloaded Page ${page.pageNumber}`);
  };

  const downloadAllAsZip = async () => {
    if (!file || convertedPages.length === 0) return;

    try {
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, '');

      convertedPages.forEach(p => {
        zip.file(`${baseName}-page-${p.pageNumber}.jpg`, p.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-jpg-pages.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      onShowToast('Downloaded all pages as ZIP!');
    } catch (err) {
      console.error('ZIP creation error:', err);
      onShowToast('Failed to create ZIP package.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setConvertedPages([]);
    setSelectedPreview(null);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {!file ? (
        <UniversalFileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMB={100}
          title="Drop your PDF here to convert to JPG"
          subtitle="Converts every page into crisp, high-resolution JPG images with instant download"
          fileTypeSupportText="100% Client-Side • Supports multi-page documents"
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          <FileInformationPanel
            fileName={file.name}
            fileSize={file.size}
            pageCount={pageCount}
            pdfVersion={pdfVersion}
            status={isProcessing ? stage : convertedPages.length > 0 ? 'Completed' : 'Idle'}
            statusProgress={progress}
          />

          {/* Configuration Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Conversion Quality & Page Range
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Resolution / DPI */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Resolution / Scale
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value={1.0}>Standard (1x • ~72 DPI - Fast)</option>
                  <option value={1.5}>Medium (1.5x • ~110 DPI - Balanced)</option>
                  <option value={2.0}>High (2x • ~150 DPI - Sharp)</option>
                  <option value={3.0}>Ultra HD (3x • ~300 DPI - Print Quality)</option>
                </select>
              </div>

              {/* JPG Quality */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  JPG Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>

              {/* Page Range Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Page Selection
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('all')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      pageRangeMode === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    All Pages ({pageCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('custom')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      pageRangeMode === 'custom'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Custom Range
                  </button>
                </div>
                {pageRangeMode === 'custom' && (
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5, 8"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    className="w-full mt-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {convertedPages.length === 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={processConvertPdfToJpg}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4" />
                  {isProcessing ? 'Converting to JPG...' : 'Convert to JPG'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Clear File
                </button>
              </div>
            )}
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <PdfProcessingProgress currentStage={stage} percent={progress} message="Rendering pages with PDF.js and generating JPEG stream..." />
          )}

          {/* Converted Results Grid */}
          {convertedPages.length > 0 && (
            <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Converted {convertedPages.length} Pages to JPG
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any page to preview, download individually, or save all as a ZIP archive.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadAllAsZip}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileArchive className="w-4 h-4" />
                    Download All as ZIP
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Convert Another
                  </button>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {convertedPages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="glass-card p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div
                      onClick={() => setSelectedPreview(page)}
                      className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer aspect-[1/1.41] flex items-center justify-center"
                    >
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <Eye className="w-4 h-4" /> Preview
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        Page {page.pageNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadSingleJpg(page)}
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                        title={`Download Page ${page.pageNumber} JPG`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Preview */}
          {selectedPreview && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                    Preview: Page {selectedPreview.pageNumber}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSelectedPreview(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50">
                  <img
                    src={selectedPreview.dataUrl}
                    alt={`Page ${selectedPreview.pageNumber}`}
                    className="max-h-[70vh] object-contain shadow-md rounded-lg"
                  />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => downloadSingleJpg(selectedPreview)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download This Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreview(null)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
