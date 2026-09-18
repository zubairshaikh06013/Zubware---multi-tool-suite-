import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileImage,
  FileText,
  Grid,
  List,
  Search,
  Sparkles,
  X,
  FileArchive,
  HardDrive,
  ArrowRight,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';
import { UniversalFileUpload } from './UniversalFileUpload';
import { BatchActionToolbar, CustomBatchAction } from './BatchActionToolbar';

export interface BatchQueueItem {
  /** Unique identifier for the item in the queue */
  id: string;
  /** The source File object */
  file: File;
  /** Optional custom thumbnail URL (if omitted, auto-generated for images) */
  thumbnailUrl?: string;
  /** Processing status for this file */
  status?: 'pending' | 'processing' | 'done' | 'error';
  /** Progress percentage (0 to 100) */
  progress?: number;
  /** Optional error message if status is 'error' */
  errorMessage?: string;
  /** Size in bytes of the processed output */
  resultSize?: number;
  /** Object URL or URL for downloading the processed output */
  resultUrl?: string;
  /** Blob of processed output */
  resultBlob?: Blob;
  /** Optional custom status label or subtitle */
  customLabel?: string;
  /** Optional key-value metadata */
  extraMeta?: Record<string, any>;
}

export interface BatchQueueProps {
  /** The current array of files/items in the queue */
  items: BatchQueueItem[];
  /** Callback when user selects or drops new files */
  onAddFiles: (files: File[]) => void;
  /** Callback when user removes a single file by id */
  onRemoveItem: (id: string) => void;
  /** Callback when user clears the entire queue */
  onClearQueue: () => void;
  /** Primary callback when user triggers the mass transformation */
  onStartBatch?: (selectedIds?: string[]) => void;
  /** Label for the primary action button (e.g. "Process Queue", "Convert All Images") */
  actionLabel?: string;
  /** Optional secondary batch action (e.g. "Download All as ZIP") */
  secondaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
  /** Callback to handle download of selected items */
  onDownloadSelected?: (selectedIds: string[]) => void;
  /** Custom bulk actions to render in BatchActionToolbar */
  customActions?: CustomBatchAction[];
  /** Indicates whether mass processing is currently running */
  isProcessing?: boolean;
  /** Accepted file types, e.g. "image/*", ".pdf", etc. */
  accept?: string;
  /** Max file size limit in MB per file */
  maxSizeMB?: number;
  /** Title for the empty state dropzone */
  title?: string;
  /** Subtitle for the empty state dropzone */
  subtitle?: string;
  /** Support text displayed on dropzone */
  fileTypeSupportText?: string;
  /** Custom controls panel rendered inside the queue header bar (e.g. format dropdown, sliders) */
  customControls?: React.ReactNode;
  /** Default view mode: 'grid' (thumbnail cards) or 'table' (compact rows) */
  defaultViewMode?: 'grid' | 'table';
  /** Custom container wrapper CSS class */
  className?: string;
}

/** Utility to format bytes cleanly */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Unified `BatchQueue` component for managing multi-file uploads and previewing queues
 * before executing mass transformations.
 */
export const BatchQueue: React.FC<BatchQueueProps> = ({
  items,
  onAddFiles,
  onRemoveItem,
  onClearQueue,
  onStartBatch,
  actionLabel = 'Process Queue',
  secondaryAction,
  onDownloadSelected,
  customActions,
  isProcessing = false,
  accept = '*',
  maxSizeMB = 100,
  title = 'Drop files here or click to browse',
  subtitle = 'Upload multiple files to process in batch queue',
  fileTypeSupportText,
  customControls,
  defaultViewMode = 'grid',
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(defaultViewMode);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoThumbnails, setAutoThumbnails] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const addFilesInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedIds when items array changes
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = prev.filter((id) => items.some((it) => it.id === id));
      return next.length === prev.length ? prev : next;
    });
  }, [items]);

  // Generate object URLs for image preview thumbnails with fallback
  useEffect(() => {
    let isCancelled = false;

    setAutoThumbnails((prevThumbnails) => {
      let changed = false;
      const newThumbnails: Record<string, string> = { ...prevThumbnails };

      // Remove thumbnails for items no longer in queue
      Object.keys(newThumbnails).forEach((id) => {
        if (!items.some((it) => it.id === id)) {
          if (newThumbnails[id]?.startsWith('blob:')) {
            URL.revokeObjectURL(newThumbnails[id]);
          }
          delete newThumbnails[id];
          changed = true;
        }
      });

      // Add or retain thumbnails
      items.forEach((item) => {
        if (item.thumbnailUrl && newThumbnails[item.id] !== item.thumbnailUrl) {
          newThumbnails[item.id] = item.thumbnailUrl;
          changed = true;
        } else if (item.resultUrl && newThumbnails[item.id] !== item.resultUrl) {
          newThumbnails[item.id] = item.resultUrl;
          changed = true;
        } else if (item.file && item.file.type.startsWith('image/') && !newThumbnails[item.id]) {
          try {
            newThumbnails[item.id] = URL.createObjectURL(item.file);
            changed = true;
          } catch {
            // Ignore preview generation error
          }
        }
      });

      return changed ? newThumbnails : prevThumbnails;
    });

    // Fallback: For any image file where createObjectURL might fail on mobile Android Chrome, try FileReader
    items.forEach((item) => {
      if (item.file && item.file.type.startsWith('image/') && !autoThumbnails[item.id] && item.file.size < 15 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          if (!isCancelled && typeof reader.result === 'string') {
            setAutoThumbnails((prev) => ({ ...prev, [item.id]: reader.result as string }));
          }
        };
        reader.readAsDataURL(item.file);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [items]);

  // Compute stats
  const totalFiles = items.length;
  const totalInputSize = useMemo(() => items.reduce((acc, curr) => acc + (curr.file?.size || 0), 0), [items]);
  const doneCount = useMemo(() => items.filter((it) => it.status === 'done').length, [items]);
  const pendingCount = useMemo(() => items.filter((it) => !it.status || it.status === 'pending').length, [items]);
  const processingCount = useMemo(() => items.filter((it) => it.status === 'processing').length, [items]);
  const errorCount = useMemo(() => items.filter((it) => it.status === 'error').length, [items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((it) => it.file?.name.toLowerCase().includes(q));
  }, [items, searchQuery]);

  // Handle hidden file input trigger for "Add More"
  const handleAddMoreClick = () => {
    addFilesInputRef.current?.click();
  };

  const handleAddMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDeleteSelected = (idsToRemove: string[]) => {
    idsToRemove.forEach((id) => onRemoveItem(id));
    setSelectedIds([]);
  };

  const handleToggleItemSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // If no files in queue, show full UniversalFileUpload dropzone
  if (totalFiles === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <UniversalFileUpload
          onFilesSelected={onAddFiles}
          accept={accept}
          multiple={true}
          maxSizeMB={maxSizeMB}
          title={title}
          subtitle={subtitle}
          fileTypeSupportText={fileTypeSupportText}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden file input for "Add More Files" */}
      <input
        ref={addFilesInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleAddMoreChange}
      />

      {/* REUSABLE BATCH ACTION TOOLBAR */}
      <BatchActionToolbar
        totalCount={totalFiles}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onClearQueue={onClearQueue}
        onDeleteSelected={handleDeleteSelected}
        onDownloadSelected={onDownloadSelected}
        onStartBatch={onStartBatch}
        batchActionLabel={actionLabel}
        secondaryAction={secondaryAction}
        isProcessing={isProcessing}
        completedCount={doneCount}
        errorCount={errorCount}
        totalSizeBytes={totalInputSize}
        customActions={customActions}
        allItemsIds={items.map((i) => i.id)}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Custom Controls Slot (e.g. Compression quality sliders, format selectors) */}
          {customControls && <div className="flex-1 min-w-0">{customControls}</div>}

          {/* Add More Button */}
          <button
            type="button"
            onClick={handleAddMoreClick}
            className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Add More Files</span>
          </button>
        </div>
      </BatchActionToolbar>

      {/* QUEUE LISTING CONTAINER */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
        {/* Filter and View mode switcher bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          {/* Search filter input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Grid / Table View Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 font-bold ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid Thumbnail Cards"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 font-bold ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Detailed Table Rows"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Filtered empty state */}
        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold">No files match search "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Clear search filter
            </button>
          </div>
        )}

        {/* VIEW MODE 1: GRID VIEW (VISUAL THUMBNAILS) */}
        {viewMode === 'grid' && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const thumbUrl = autoThumbnails[item.id];
              const ext = item.file.name.split('.').pop()?.toUpperCase() || 'FILE';
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItemSelection(item.id)}
                  className={`group relative rounded-2xl bg-white/80 dark:bg-slate-900/80 border overflow-hidden flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md'
                  }`}
                >
                  {/* Select Checkbox Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItemSelection(item.id);
                    }}
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900/60 text-white/70 hover:bg-slate-900 hover:text-white'
                    }`}
                    title={isSelected ? 'Deselect item' : 'Select item'}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>

                  {/* Remove X Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    title="Remove from queue"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Thumbnail / Icon Display */}
                  <div className="relative w-full h-28 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={item.file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <FileText className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{ext}</span>
                      </div>
                    )}

                    {/* Status Overlay */}
                    {item.status === 'done' && (
                      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex items-center justify-center text-white">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 drop-shadow-md animate-scaleIn" />
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="absolute inset-0 bg-rose-950/50 backdrop-blur-[1px] flex items-center justify-center text-white">
                        <AlertCircle className="w-8 h-8 text-rose-400 drop-shadow-md" />
                      </div>
                    )}

                    {item.status === 'processing' && (
                      <div className="absolute inset-0 bg-indigo-950/50 backdrop-blur-[1px] flex flex-col items-center justify-center text-white space-y-1">
                        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                        <span className="text-[10px] font-bold">Processing...</span>
                      </div>
                    )}

                    {/* Format Badge */}
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                      {ext}
                    </span>
                  </div>

                  {/* Card Info & Download */}
                  <div className="p-2.5 space-y-1.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={item.file.name}>
                      {item.file.name}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>{formatBytes(item.file.size)}</span>
                      {item.resultSize && <span className="text-emerald-600 dark:text-emerald-400 font-bold">→ {formatBytes(item.resultSize)}</span>}
                    </div>

                    {/* Custom label or Error text with Retry button */}
                    {item.errorMessage && (
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] text-rose-500 font-semibold truncate" title={item.errorMessage}>
                          {item.errorMessage}
                        </p>
                        {onStartBatch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartBatch([item.id]);
                            }}
                            className="text-[9px] font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0 flex items-center gap-0.5"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                    {item.customLabel && !item.errorMessage && (
                      <p className="text-[10px] text-slate-400 font-medium truncate">{item.customLabel}</p>
                    )}

                    {/* Individual Output Download Button */}
                    {item.resultUrl && item.status === 'done' && (
                      <a
                        href={item.resultUrl}
                        download={`converted-${item.file.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full mt-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>Save File</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: TABLE / LIST VIEW (COMPACT ROWS) */}
        {viewMode === 'table' && filteredItems.length > 0 && (
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const thumbUrl = autoThumbnails[item.id];
              const ext = item.file.name.split('.').pop()?.toUpperCase() || 'FILE';
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItemSelection(item.id)}
                  className={`p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItemSelection(item.id);
                      }}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    {/* Small preview avatar */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                      {thumbUrl ? (
                        <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileCheck className="w-5 h-5 text-indigo-500" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.file.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase">
                          {ext}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {formatBytes(item.file.size)}
                        {item.resultSize && ` • Output: ${formatBytes(item.resultSize)}`}
                        {item.customLabel && ` • ${item.customLabel}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status indicators */}
                    {item.status === 'processing' && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                      </span>
                    )}

                    {item.status === 'done' && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Done
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-500" /> Error
                      </span>
                    )}

                    {(!item.status || item.status === 'pending') && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                        Ready
                      </span>
                    )}

                    {/* Download button if result available */}
                    {item.resultUrl && item.status === 'done' && (
                      <a
                        href={item.resultUrl}
                        download={`converted-${item.file.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3 h-3" /> Save
                      </a>
                    )}

                    {/* Single Item Removal */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from queue"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
