import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Layers, 
  Upload, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  Plus, 
  GripVertical, 
  Eye, 
  X, 
  Check, 
  Sparkles, 
  Download, 
  Loader2, 
  FileCheck 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BatchActionToolbar } from '../common/BatchActionToolbar';
import { UniversalFileUpload } from '../common/UniversalFileUpload';
import { ToolIcon } from '../common/ToolIcon';
import { renderPdfPageToDataUrl } from '../../lib/pdfUtils';
import { formatDecimalBytes } from '../../lib/fileSizeStandard';

const formatBytes = (b: number) => formatDecimalBytes(b);

interface PdfItem {
  id: string;
  file: File;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
  thumbnailUrl?: string;
  customPageRange?: string; // Optional custom range for this specific file, e.g. "1-3"
}

interface PdfMergeToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfMergeTool: React.FC<PdfMergeToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState<{ stage: string; percent: number }>({ stage: '', percent: 0 });
  const [previewItem, setPreviewItem] = useState<PdfItem | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('merged-document.pdf');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFilesAdded = async (files: File[]) => {
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      onShowToast('Please select valid PDF documents');
      return;
    }

    const loadedItems: PdfItem[] = [];
    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        // Generate thumbnail preview of first page
        let thumbUrl: string | undefined;
        try {
          thumbUrl = await renderPdfPageToDataUrl(buffer, 0, 0.4);
        } catch {
          // Thumbnail generation warning fallback
        }

        loadedItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount,
          arrayBuffer: buffer,
          thumbnailUrl: thumbUrl
        });
      } catch {
        onShowToast(`Failed to parse ${file.name}`);
      }
    }

    setItems(prev => [...prev, ...loadedItems]);
    if (loadedItems.length > 0) {
      onShowToast(`Loaded ${loadedItems.length} PDF file(s) with previews`);
    }
  };

  // Drag and Drop Reordering Handlers
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

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [moved] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, moved);
    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
    onShowToast(`Reordered documents`);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const handleDeleteSelected = (idsToRemove: string[]) => {
    setItems(prev => prev.filter(i => !idsToRemove.includes(i.id)));
    setSelectedIds([]);
    onShowToast(`Removed ${idsToRemove.length} item(s)`);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const mergePdfs = async (targetIds?: string[]) => {
    const sourceItems = targetIds && targetIds.length > 0
      ? items.filter(i => targetIds.includes(i.id))
      : items;

    if (sourceItems.length < 2) {
      onShowToast('Please add at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    setMergeProgress({ stage: 'Initializing PDF merger...', percent: 15 });

    try {
      await new Promise(r => setTimeout(r, 150));
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < sourceItems.length; i++) {
        const item = sourceItems[i];
        const progressPct = 20 + Math.round(((i + 1) / sourceItems.length) * 60);
        setMergeProgress({ 
          stage: `Merging ${item.file.name} (${i + 1} of ${sourceItems.length})...`, 
          percent: progressPct 
        });

        const pdfToCopy = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfToCopy, pdfToCopy.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      setMergeProgress({ stage: 'Optimizing and compiling master PDF...', percent: 90 });
      await new Promise(r => setTimeout(r, 200));

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const downloadName = outputFileName.trim().endsWith('.pdf') ? outputFileName.trim() : `${outputFileName.trim()}.pdf`;
      a.download = downloadName || 'merged-document.pdf';
      a.click();
      URL.revokeObjectURL(url);

      setMergeProgress({ stage: 'Completed!', percent: 100 });
      onShowToast(`Successfully merged ${sourceItems.length} PDFs into ${downloadName}!`);
    } catch {
      onShowToast('Error merging PDFs. Please check for corrupted files.');
    } finally {
      setTimeout(() => {
        setIsMerging(false);
        setMergeProgress({ stage: '', percent: 0 });
      }, 600);
    }
  };

  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalSize = items.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {items.length === 0 ? (
        <UniversalFileUpload
          onFilesSelected={handleFilesAdded}
          accept=".pdf,application/pdf"
          multiple={true}
          title="Drop PDF files here to merge"
          subtitle="Support multiple files • Reorder by dragging • Instant local processing"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Actions & Summary Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                Total Files: <strong className="text-slate-900 dark:text-white font-mono">{items.length}</strong>
              </span>
              <span className="text-xs font-bold text-slate-500">
                Combined Pages: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{totalPages}</strong>
              </span>
              <span className="text-xs font-bold text-slate-500">
                Size: <strong className="text-slate-900 dark:text-white font-mono">{formatBytes(totalSize)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Add More PDFs</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={e => e.target.files && handleFilesAdded(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setItems([])}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Batch Action Toolbar */}
          {items.length > 0 && (
            <BatchActionToolbar
              totalCount={items.length}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onDeleteSelected={() => handleDeleteSelected(selectedIds)}
              onStartBatch={() => mergePdfs(selectedIds.length > 0 ? selectedIds : undefined)}
              batchActionLabel={selectedIds.length > 0 ? "Merge Selected Only" : "Merge All Files"}
            />
          )}

          {/* Drag & Drop Reorder Instructions */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold">
              <GripVertical className="w-4 h-4 text-indigo-500" />
              <span>Drag cards by handle to change document merge order</span>
            </span>
            <span className="italic text-[11px]">Top to bottom will be page order</span>
          </div>

          {/* PDF Items List with Drag-and-Drop & Visual Preview Thumbnails */}
          <div className="space-y-3">
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(index)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 glass-card ${
                    isDragging ? 'opacity-40 scale-[0.98]' : ''
                  } ${
                    isOver ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/20' : 'border-slate-200 dark:border-slate-800'
                  } ${
                    isSelected ? 'ring-1 ring-indigo-500 bg-indigo-50/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Handle */}
                    <div 
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleSelect(item.id)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    {/* Page Thumbnail Preview */}
                    <div 
                      onClick={() => setPreviewItem(item)}
                      className="w-12 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs cursor-pointer group relative"
                      title="Click to view larger preview"
                    >
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.file.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                          #{index + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                          {item.file.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.pageCount} pages</span>
                        <span>•</span>
                        <span>{formatBytes(item.file.size)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Move Up/Down & Remove Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors ml-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Merge Custom Options & Execution */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Output File Name
              </label>
              <input
                type="text"
                value={outputFileName}
                onChange={e => setOutputFileName(e.target.value)}
                placeholder="merged-document.pdf"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              />
            </div>

            {/* Live Progress Bar during merging */}
            {isMerging && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mergeProgress.stage}
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{mergeProgress.percent}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${mergeProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => mergePdfs()}
              disabled={isMerging || items.length < 2}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Merging PDF Documents...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Merge All {items.length} PDFs ({totalPages} Pages) & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {previewItem.file.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {previewItem.pageCount} Pages • {formatBytes(previewItem.file.size)}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] overflow-auto flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              {previewItem.thumbnailUrl ? (
                <img
                  src={previewItem.thumbnailUrl}
                  alt={previewItem.file.name}
                  className="max-h-[50vh] object-contain shadow-lg rounded-lg"
                />
              ) : (
                <div className="text-center text-xs text-slate-400 p-8">
                  Preview not available for this document
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
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
