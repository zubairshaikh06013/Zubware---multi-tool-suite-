import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { 
  FileText, 
  Scissors, 
  FileArchive, 
  Upload, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Layers, 
  Eye, 
  X, 
  Loader2 
} from 'lucide-react';
import { ToolIcon } from '../common/ToolIcon';
import { useLanguage } from '../../context/LanguageContext';
import { renderPdfPageToDataUrl } from '../../lib/pdfUtils';
import { formatDecimalBytes } from '../../lib/fileSizeStandard';

const formatBytes = (b: number) => formatDecimalBytes(b);

interface PageThumbnail {
  pageNumber: number;
  dataUrl?: string;
}

interface PdfSplitToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfSplitTool: React.FC<PdfSplitToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'selected' | 'all' | 'range'>('selected');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [exportAsCombined, setExportAsCombined] = useState<boolean>(true);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState<boolean>(false);
  const [thumbnailProgress, setThumbnailProgress] = useState<number>(0);
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState<{ stage: string; percent: number }>({ stage: '', percent: 0 });
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  const handleFileAdded = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const loadedPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = loadedPdf.getPageCount();
      setPdfFile(file);
      setPdfDoc(loadedPdf);
      setPageCount(count);

      // Pre-select first 3 pages
      const initial = new Set<number>();
      for (let i = 1; i <= Math.min(count, 3); i++) initial.add(i);
      setSelectedPages(initial);
      setRangeInput(`1-${Math.min(count, 3)}`);
      onShowToast(`Loaded PDF with ${count} pages`);

      // Asynchronously render thumbnails for pages
      generateThumbnails(buffer, count);
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const generateThumbnails = async (buffer: ArrayBuffer, total: number) => {
    setIsLoadingThumbnails(true);
    setThumbnailProgress(0);
    const thumbs: PageThumbnail[] = [];

    // Render first up to 30 pages for fast snappy UI
    const maxToRender = Math.min(total, 30);
    for (let i = 0; i < maxToRender; i++) {
      try {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.4);
        thumbs.push({ pageNumber: i + 1, dataUrl: url });
      } catch {
        thumbs.push({ pageNumber: i + 1 });
      }
      setThumbnailProgress(Math.round(((i + 1) / maxToRender) * 100));
    }

    // Fill remaining if document is very large
    for (let i = maxToRender; i < total; i++) {
      thumbs.push({ pageNumber: i + 1 });
    }

    setThumbnails(thumbs);
    setIsLoadingThumbnails(false);
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages(prev => {
      const updated = new Set(prev);
      if (updated.has(pageNumber)) {
        updated.delete(pageNumber);
      } else {
        updated.add(pageNumber);
      }
      return updated;
    });
  };

  const selectAll = () => {
    const s = new Set<number>();
    for (let i = 1; i <= pageCount; i++) s.add(i);
    setSelectedPages(s);
  };

  const selectNone = () => {
    setSelectedPages(new Set());
  };

  const selectOdd = () => {
    const s = new Set<number>();
    for (let i = 1; i <= pageCount; i += 2) s.add(i);
    setSelectedPages(s);
  };

  const selectEven = () => {
    const s = new Set<number>();
    for (let i = 2; i <= pageCount; i += 2) s.add(i);
    setSelectedPages(s);
  };

  const parseRangeIndices = (input: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          indices.add(p - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfDoc || !pdfFile) return;
    setIsProcessing(true);
    setProcessProgress({ stage: 'Reading pages...', percent: 15 });

    try {
      const baseName = pdfFile.name.replace(/\.pdf$/i, '');

      if (splitMode === 'all') {
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          setProcessProgress({
            stage: `Splitting page ${i + 1} of ${pageCount}...`,
            percent: 20 + Math.round(((i + 1) / pageCount) * 60)
          });
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
          const pdfBytes = await newDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, pdfBytes);
        }

        setProcessProgress({ stage: 'Generating ZIP package...', percent: 90 });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-split-pages.zip`;
        a.click();
        URL.revokeObjectURL(url);
        onShowToast('Downloaded all split PDF pages as ZIP!');
      } else {
        let targetIndices: number[] = [];
        if (splitMode === 'range') {
          targetIndices = parseRangeIndices(rangeInput, pageCount);
        } else {
          targetIndices = Array.from(selectedPages).map(p => p - 1).sort((a, b) => a - b);
        }

        if (targetIndices.length === 0) {
          onShowToast('Please select at least 1 page to extract');
          setIsProcessing(false);
          return;
        }

        if (exportAsCombined) {
          setProcessProgress({ stage: 'Compiling selected pages...', percent: 45 });
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(pdfDoc, targetIndices);
          copiedPages.forEach(p => newDoc.addPage(p));
          setProcessProgress({ stage: 'Saving combined PDF...', percent: 85 });
          const pdfBytes = await newDoc.save();

          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${baseName}-extracted-${targetIndices.length}pages.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          onShowToast(`Downloaded extracted ${targetIndices.length}-page PDF!`);
        } else {
          const zip = new JSZip();
          for (let i = 0; i < targetIndices.length; i++) {
            const idx = targetIndices[i];
            setProcessProgress({
              stage: `Packaging page ${idx + 1}...`,
              percent: 25 + Math.round(((i + 1) / targetIndices.length) * 60)
            });
            const newDoc = await PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(pdfDoc, [idx]);
            newDoc.addPage(copiedPage);
            const pdfBytes = await newDoc.save();
            zip.file(`${baseName}-page-${idx + 1}.pdf`, pdfBytes);
          }

          setProcessProgress({ stage: 'Generating ZIP archive...', percent: 90 });
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${baseName}-extracted-pages.zip`;
          a.click();
          URL.revokeObjectURL(url);
          onShowToast(`Downloaded ${targetIndices.length} pages as ZIP!`);
        }
      }
    } catch {
      onShowToast('Failed to split PDF');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessProgress({ stage: '', percent: 0 });
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {!pdfFile ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            if (e.dataTransfer.files?.[0]) handleFileAdded([e.dataTransfer.files[0]]);
          }}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer glass-card transition-all text-center group ${
            isDraggingFile 
              ? 'border-indigo-600 bg-indigo-50/20 scale-[1.01]' 
              : 'border-indigo-300/60 dark:border-indigo-900/40 hover:border-indigo-500'
          }`}
        >
          <Upload className="w-12 h-12 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Select or drag and drop PDF file here
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose any multi-page PDF document to extract pages
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
          {/* Document Overview Header */}
          <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {pdfFile.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {pageCount} Pages • {formatBytes(pdfFile.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setPdfFile(null);
                setPdfDoc(null);
                setPageCount(0);
                setThumbnails([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change File</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSplitMode('selected')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                splitMode === 'selected'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              Visual Page Selector ({selectedPages.size} Selected)
            </button>

            <button
              onClick={() => setSplitMode('range')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                splitMode === 'range'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              Custom Range Syntax (1-3, 5, 8)
            </button>

            <button
              onClick={() => setSplitMode('all')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                splitMode === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              Split Every Page (All {pageCount} as ZIP)
            </button>
          </div>

          {/* Thumbnail Progress Indicator */}
          {isLoadingThumbnails && (
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Rendering high-resolution page thumbnails...</span>
              </span>
              <span className="font-mono">{thumbnailProgress}%</span>
            </div>
          )}

          {/* Visual Page Selector Grid with Live Thumbnails */}
          {splitMode === 'selected' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Click Thumbnails to Select or Deselect
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={selectAll}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={selectOdd}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Odd Pages
                  </button>
                  <button
                    onClick={selectEven}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Even Pages
                  </button>
                  <button
                    onClick={selectNone}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-rose-500 hover:bg-rose-500/10"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5 max-h-96 overflow-y-auto p-1">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedPages.has(num);
                  const thumb = thumbnails.find(t => t.pageNumber === num);

                  return (
                    <div
                      key={num}
                      onClick={() => togglePage(num)}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 group relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      {/* Thumbnail container */}
                      <div className="w-full aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative border border-slate-200/60 dark:border-slate-700">
                        {thumb?.dataUrl ? (
                          <img
                            src={thumb.dataUrl}
                            alt={`Page ${num}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-slate-400 text-center">
                            <FileText className="w-6 h-6 mb-1 opacity-50" />
                            <span className="text-[10px]">Page {num}</span>
                          </div>
                        )}

                        {/* Expand preview hover button */}
                        {thumb?.dataUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPage(num);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                            title="Expand preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Card Footer with Checkbox */}
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Page {num}
                        </span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Range Input Mode */}
          {splitMode === 'range' && (
            <div className="glass-card p-5 rounded-3xl space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Page Range Syntax (e.g. "1-3, 5, 7-{Math.min(pageCount, 10)}")
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={e => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* Output Option (Combined vs Separate ZIP) */}
          {splitMode !== 'all' && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold px-2">
              <span className="text-slate-400 uppercase text-[10px]">Export Format:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  checked={exportAsCombined}
                  onChange={() => setExportAsCombined(true)}
                  className="accent-indigo-600"
                />
                <span className="text-slate-800 dark:text-slate-200">Single Combined Multi-Page PDF</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  checked={!exportAsCombined}
                  onChange={() => setExportAsCombined(false)}
                  className="accent-indigo-600"
                />
                <span className="text-slate-800 dark:text-slate-200">Separate Individual PDFs (ZIP Archive)</span>
              </label>
            </div>
          )}

          {/* Live Progress Indicator during splitting */}
          {isProcessing && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {processProgress.stage}
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{processProgress.percent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${processProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={handleSplit}
            disabled={isProcessing || (splitMode === 'selected' && selectedPages.size === 0)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting & Compiling Pages...</span>
              </>
            ) : splitMode === 'all' ? (
              <>
                <FileArchive className="w-5 h-5" />
                <span>Split All {pageCount} Pages & Download ZIP</span>
              </>
            ) : exportAsCombined ? (
              <>
                <Download className="w-5 h-5" />
                <span>Extract & Download Combined PDF ({splitMode === 'selected' ? selectedPages.size : 'Selected'} Pages)</span>
              </>
            ) : (
              <>
                <FileArchive className="w-5 h-5" />
                <span>Extract & Download ZIP ({splitMode === 'selected' ? selectedPages.size : 'Selected'} Pages)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Expanded Page Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Page {previewPage} Preview
              </h3>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] overflow-auto flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              {thumbnails.find(t => t.pageNumber === previewPage)?.dataUrl ? (
                <img
                  src={thumbnails.find(t => t.pageNumber === previewPage)!.dataUrl}
                  alt={`Page ${previewPage}`}
                  className="max-h-[50vh] object-contain shadow-lg rounded-lg"
                />
              ) : (
                <div className="text-center text-xs text-slate-400 p-8">
                  Preview not available for this page
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewPage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
