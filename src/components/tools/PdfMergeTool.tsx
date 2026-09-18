import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, ArrowUp, ArrowDown, Trash2, Layers, Upload, CheckSquare, Square, RefreshCw, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BatchActionToolbar } from '../common/BatchActionToolbar';
import { UniversalFileUpload } from '../common/UniversalFileUpload';

interface PdfItem {
  id: string;
  file: File;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

interface PdfMergeToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfMergeTool: React.FC<PdfMergeToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);

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
        loadedItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount: pdfDoc.getPageCount(),
          arrayBuffer: buffer
        });
      } catch {
        onShowToast(`Failed to parse ${file.name}`);
      }
    }

    setItems(prev => [...prev, ...loadedItems]);
    if (loadedItems.length > 0) {
      onShowToast(`Loaded ${loadedItems.length} PDF file(s)`);
    }
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
      onShowToast('Select at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of sourceItems) {
        const pdfToCopy = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfToCopy, pdfToCopy.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetIds && targetIds.length > 0 ? 'merged-selected-documents.pdf' : 'merged-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
      onShowToast(`Merged ${sourceItems.length} PDFs successfully!`);
    } catch {
      onShowToast('Error merging PDFs');
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalSize = items.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🧩</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('pdfMergeTitle', 'PDF Merge Tool')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          {t('pdfMergeSubtitle', 'Combine multiple PDF files into one clean document. Select items, reorder pages, perform bulk actions, and download instantly.')}
        </p>
      </div>

      {items.length === 0 ? (
        <UniversalFileUpload
          onFilesSelected={handleFilesAdded}
          accept=".pdf,application/pdf"
          multiple={true}
          title={t('selectPdfCombine', 'Select PDF files to combine')}
          subtitle={t('supportsMultiplePdfs', 'Supports multiple PDF documents')}
        />
      ) : (
        <div className="space-y-5">
          {/* REUSABLE BATCH ACTION TOOLBAR */}
          <BatchActionToolbar
            totalCount={items.length}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onClearQueue={() => {
              setItems([]);
              setSelectedIds([]);
            }}
            onDeleteSelected={handleDeleteSelected}
            onStartBatch={mergePdfs}
            batchActionLabel={selectedIds.length > 0 ? 'Merge Selected' : 'Merge All PDFs'}
            batchActionIcon={<Layers className="w-4 h-4" />}
            isProcessing={isMerging}
            totalSizeBytes={totalSize}
            allItemsIds={items.map(i => i.id)}
            customActions={[
              {
                key: 'reverse',
                label: 'Reverse Order',
                icon: <ArrowDown className="w-3.5 h-3.5" />,
                variant: 'outline',
                onClick: () => setItems(prev => [...prev].reverse()),
                tooltip: 'Reverse queue sequence'
              }
            ]}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
              <span>
                Total Pages across queue: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{totalPages} pages</strong>
              </span>
              <label className="text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add More PDFs
                <input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))}
                />
              </label>
            </div>
          </BatchActionToolbar>

          {/* ITEM QUEUE ROWS */}
          <div className="space-y-2.5">
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleSelect(item.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl glass-card transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'hover:border-indigo-500/40'
                  }`}
                >
                  {/* Select Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(item.id);
                    }}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • Size: <strong className="text-gray-700 dark:text-slate-300 font-semibold">{formatSize(item.file.size)}</strong>
                    </p>
                  </div>

                  {/* Move Up/Down & Remove */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveItem(index, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1.5 text-gray-500 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveItem(index, 'down');
                      }}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-gray-500 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
