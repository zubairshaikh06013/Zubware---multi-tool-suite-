import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  FileCheck, 
  Shuffle, 
  RotateCw, 
  Trash2, 
  Eye, 
  X, 
  GripVertical,
  CheckCircle2,
  Sparkles,
  Download,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';
import { ToolIcon } from '../../common/ToolIcon';

interface ReorderPageItem {
  id: string;
  originalIndex: number;
  dataUrl: string;
  rotation: number; // 0, 90, 180, 270
}

export const ReorderPdfPagesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [pages, setPages] = useState<ReorderPageItem[]>([]);
  const [originalPages, setOriginalPages] = useState<ReorderPageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Full Preview Modal State
  const [previewItem, setPreviewItem] = useState<ReorderPageItem | null>(null);

  const handleFileAdded = async (uploadedFile: File) => {
    if (!uploadedFile.name.endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      const version = extractPdfVersionFromBuffer(buffer);

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);

      const items: ReorderPageItem[] = [];
      for (let i = 0; i < count; i++) {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.45);
        items.push({
          id: `page_${i}_${Math.random().toString(36).substring(2, 7)}`,
          originalIndex: i,
          dataUrl: url,
          rotation: 0
        });
      }
      setPages(items);
      setOriginalPages(items);
      onShowToast(`Loaded PDF (${count} pages) with visual previews`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...pages];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setPages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    onShowToast(`Moved page to position ${targetIndex + 1}`);
  };

  const movePage = (index: number, dir: 'left' | 'right') => {
    const target = dir === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const copy = [...pages];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setPages(copy);
  };

  const rotatePage = (index: number) => {
    setPages(prev => prev.map((p, i) => {
      if (i === index) {
        return { ...p, rotation: (p.rotation + 90) % 360 };
      }
      return p;
    }));
    onShowToast(`Rotated page ${index + 1} by 90°`);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      onShowToast('Cannot delete the last remaining page');
      return;
    }
    setPages(prev => prev.filter((_, i) => i !== index));
    onShowToast(`Removed page ${index + 1}`);
  };

  const reverseOrder = () => {
    setPages(prev => [...prev].reverse());
    onShowToast('Reversed page order');
  };

  const shuffleOrder = () => {
    const shuffled = [...pages].sort(() => Math.random() - 0.5);
    setPages(shuffled);
    onShowToast('Shuffled pages order');
  };

  const resetAll = () => {
    setPages([...originalPages]);
    onShowToast('Reset pages to original document order');
  };

  const handleExportReordered = async () => {
    if (!pdfBuffer || !file) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(15);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(35);

      const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      setStage('Processing');
      setProgress(60);

      for (let i = 0; i < pages.length; i++) {
        const item = pages[i];
        const [copiedPage] = await newDoc.copyPages(srcDoc, [item.originalIndex]);
        if (item.rotation !== 0) {
          const currentRot = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRot + item.rotation) % 360));
        }
        newDoc.addPage(copiedPage);
      }

      setStage('Preparing Download');
      setProgress(90);

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_reordered.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('Reordered PDF downloaded successfully!');
    } catch (err) {
      console.error('Reorder pages error:', err);
      onShowToast('Failed to reorder PDF pages');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPages([]);
    setOriginalPages([]);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="flex justify-center mb-3"><ToolIcon toolId="pdf-reorder" category="PDF Tools" size="xl" /></div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('reorderPdfPagesTitle', 'Reorder & Organize PDF Pages')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('reorderPdfPagesSubtitle', 'Drag-and-drop to rearrange PDF pages, rotate orientations, preview full pages, and export your updated document.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-3xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {t('selectPdfToReorder', 'Select PDF file to reorder pages')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsSinglePdf', 'Drag and drop or browse your local file')}
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

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {pages.length} Pages • Drag cards to reorder
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={reverseOrder}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reverse entire page order"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Reverse</span>
              </button>

              <button
                onClick={shuffleOrder}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Randomly shuffle pages"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={resetAll}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to original order"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Order</span>
              </button>

              <button
                onClick={clearFile}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Change PDF</span>
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((p, idx) => {
              const isDragging = draggedIndex === idx;
              const isOver = dragOverIndex === idx;

              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(idx)}
                  className={`glass-card p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all cursor-grab active:cursor-grabbing select-none relative ${
                    isDragging 
                      ? 'opacity-40 scale-95 border-dashed border-indigo-500' 
                      : isOver
                      ? 'border-2 border-indigo-600 ring-4 ring-indigo-500/20 scale-105 shadow-xl'
                      : 'border-slate-200/60 dark:border-slate-800 hover:border-indigo-400 hover:shadow-md'
                  }`}
                >
                  {/* Page Image Container */}
                  <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center group">
                    <img 
                      src={p.dataUrl} 
                      alt={`Page ${idx + 1}`} 
                      className="object-contain max-h-full transition-transform duration-200"
                      style={{ transform: `rotate(${p.rotation}deg)` }}
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                      #{idx + 1}
                    </div>

                    {/* Grip Icon */}
                    <div className="absolute top-2 right-2 p-1 rounded-md bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewItem(p); }}
                        className="p-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Enlarge Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); rotatePage(idx); }}
                        className="p-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePage(idx); }}
                        className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Footer Labels & Direction Controls */}
                  <div className="w-full flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-500">
                      Orig #{p.originalIndex + 1}
                      {p.rotation > 0 && <span className="text-indigo-500 ml-1">({p.rotation}°)</span>}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); movePage(idx, 'left'); }}
                        disabled={idx === 0}
                        className="p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-20 cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); movePage(idx, 'right'); }}
                        disabled={idx === pages.length - 1}
                        className="p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-20 cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing Progress or Save Button */}
          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleExportReordered}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <FileCheck className="w-4 h-4" />
              <span>{t('exportReorderedPdf', 'Save & Download Reordered PDF')}</span>
            </button>
          )}
        </div>
      )}

      {/* Enhanced Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Page Preview • Original #{previewItem.originalIndex + 1}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl">
              <img 
                src={previewItem.dataUrl} 
                alt="Enlarged Page Preview" 
                className="max-h-[65vh] object-contain shadow-md rounded-lg"
                style={{ transform: `rotate(${previewItem.rotation}deg)` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
