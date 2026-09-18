import React from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Download,
  Play,
  Sparkles,
  RefreshCw,
  X,
  Layers,
  FileArchive,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export interface CustomBatchAction {
  /** Unique key for the action */
  key: string;
  /** Display text on the button */
  label: string;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Visual variant styling */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'amber';
  /** Click handler receiving currently selected IDs (or empty array if none) */
  onClick: (selectedIds: string[]) => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Show this action button only when 1 or more items are selected */
  showWhenSelectedOnly?: boolean;
  /** Optional tooltip text */
  tooltip?: string;
}

export interface BatchActionToolbarProps {
  /** Total number of items in the batch queue */
  totalCount: number;
  /** Array of currently selected item IDs */
  selectedIds?: string[];
  /** Callback when selection state changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback to clear the entire queue */
  onClearQueue?: () => void;
  /** Callback to remove selected items */
  onDeleteSelected?: (selectedIds: string[]) => void;
  /** Callback to download all ready items */
  onDownloadAll?: () => void;
  /** Callback to download only selected items */
  onDownloadSelected?: (selectedIds: string[]) => void;
  /** Primary batch action callback (e.g. Compress All, Merge All) */
  onStartBatch?: (selectedIds?: string[]) => void;
  /** Label for the primary batch action button */
  batchActionLabel?: string;
  /** Icon for the primary batch action button */
  batchActionIcon?: React.ReactNode;
  /** Secondary action callback or config */
  secondaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
  /** Whether mass execution is currently in progress */
  isProcessing?: boolean;
  /** Number of items that have completed processing */
  completedCount?: number;
  /** Number of items with processing errors */
  errorCount?: number;
  /** Total size in bytes of files in queue */
  totalSizeBytes?: number;
  /** Custom additional bulk actions */
  customActions?: CustomBatchAction[];
  /** Enable item selection checkboxes controls */
  enableSelection?: boolean;
  /** All item IDs in queue (used for Select All calculations) */
  allItemsIds?: string[];
  /** Extra child element/controls to render inside the toolbar */
  children?: React.ReactNode;
  /** Optional container CSS class */
  className?: string;
}

/** Utility to format bytes cleanly */
function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Reusable `BatchActionToolbar` component for performing bulk actions
 * (delete all, delete selected, download all, clear queue, custom bulk actions)
 * on items in batch queues across the application.
 */
export const BatchActionToolbar: React.FC<BatchActionToolbarProps> = ({
  totalCount,
  selectedIds = [],
  onSelectionChange,
  onClearQueue,
  onDeleteSelected,
  onDownloadAll,
  onDownloadSelected,
  onStartBatch,
  batchActionLabel,
  batchActionIcon,
  secondaryAction,
  isProcessing = false,
  completedCount = 0,
  errorCount = 0,
  totalSizeBytes,
  customActions = [],
  enableSelection = true,
  allItemsIds = [],
  children,
  className = ''
}) => {
  const { t } = useLanguage();

  const selectedCount = selectedIds.length;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isSomeSelected = selectedCount > 0 && selectedCount < totalCount;

  // Handle select all / deselect all toggle
  const handleToggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allItemsIds.length > 0 ? [...allItemsIds] : []);
    }
  };

  const handleClearSelection = () => {
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedCount > 0 && onDeleteSelected) {
      onDeleteSelected(selectedIds);
    } else if (onClearQueue) {
      onClearQueue();
    }
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div
      className={`glass-panel p-4 sm:p-5 rounded-3xl space-y-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-lg ${className}`}
      role="toolbar"
      aria-label="Batch Action Toolbar"
    >
      {/* Top Bar: Queue Summary Badges & Selection Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        
        {/* Left Side: Item Counts & Selection Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* Select All Checkbox Control */}
          {enableSelection && onSelectionChange && allItemsIds.length > 0 && (
            <button
              type="button"
              onClick={handleToggleSelectAll}
              aria-label={isAllSelected ? t('deselectAll', 'Deselect all items') : t('selectAll', 'Select all items')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isAllSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isSomeSelected
                  ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-300/50 dark:border-indigo-700/50'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isAllSelected
                  ? t('allSelected', 'All Selected')
                  : selectedCount > 0
                  ? `${selectedCount} ${t('selectedOf', 'of')} ${totalCount} ${t('selected', 'selected')}`
                  : t('selectAll', 'Select All')}
              </span>
            </button>
          )}

          {/* Queued Items Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              <strong>{totalCount}</strong> {totalCount === 1 ? 'file' : 'files'}
            </span>
          </div>

          {/* Total Size Badge */}
          {totalSizeBytes !== undefined && totalSizeBytes > 0 && (
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatBytes(totalSizeBytes)}</span>
            </div>
          )}

          {/* Completed Badge */}
          {completedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{completedCount} Done</span>
            </div>
          )}

          {/* Error Badge */}
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>{errorCount} Error</span>
            </div>
          )}

          {/* Clear Selection Button */}
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-medium cursor-pointer text-[11px]"
            >
              {t('clearSelection', 'Clear selection')}
            </button>
          )}
        </div>

        {/* Right Side: Quick Destructive Actions (Delete Selected / Clear Queue) */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && onDeleteSelected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleDeleteClick}
              aria-label={t('deleteSelected', 'Delete selected items')}
              className="py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-rose-200/60 dark:border-rose-800/60 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {t('deleteSelectedCount', 'Delete Selected')} ({selectedCount})
              </span>
            </motion.button>
          ) : onClearQueue ? (
            <button
              type="button"
              onClick={onClearQueue}
              aria-label={t('clearQueue', 'Clear queue')}
              className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearQueue', 'Clear Queue')}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Action Bar: Primary Batch Trigger, Downloads & Custom Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Left Side: Status / Processing Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('processingBatch', 'Processing batch queue...')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                {selectedCount > 0
                  ? `${selectedCount} item(s) selected for bulk action`
                  : completedCount > 0 && completedCount === totalCount
                  ? t('allCompleted', 'All items ready!')
                  : t('readyForBatch', 'Ready for batch execution.')}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons Group */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          
          {/* Custom Actions */}
          {customActions.map((act) => {
            if (act.showWhenSelectedOnly && selectedCount === 0) return null;

            const variantStyles =
              act.variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : act.variant === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : act.variant === 'amber'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : act.variant === 'outline'
                ? 'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : act.variant === 'secondary'
                ? 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white';

            return (
              <motion.button
                key={act.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => act.onClick(selectedIds)}
                disabled={act.disabled || isProcessing}
                title={act.tooltip}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-all cursor-pointer ${variantStyles}`}
              >
                {act.icon}
                <span>{act.label}</span>
              </motion.button>
            );
          })}

          {/* Download Selected Action */}
          {selectedCount > 0 && onDownloadSelected && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onDownloadSelected(selectedIds)}
              disabled={isProcessing}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {t('downloadSelected', 'Download Selected')} ({selectedCount})
              </span>
            </motion.button>
          )}

          {/* Download All Action */}
          {onDownloadAll && (!onDownloadSelected || selectedCount === 0) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onDownloadAll}
              disabled={isProcessing}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileArchive className="w-4 h-4" />
              <span>{t('downloadAll', 'Download All')}</span>
            </motion.button>
          )}

          {/* Secondary Action (e.g., Download ZIP) */}
          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled || isProcessing}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {secondaryAction.icon || <Download className="w-4 h-4" />}
              <span>{secondaryAction.label}</span>
            </motion.button>
          )}

          {/* Primary Batch Action Button */}
          {onStartBatch && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onStartBatch(selectedCount > 0 ? selectedIds : undefined)}
              disabled={isProcessing || totalCount === 0}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {batchActionIcon || (
                isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )
              )}
              <span>
                {batchActionLabel || t('processQueue', 'Process Queue')}
                {selectedCount > 0 ? ` (${selectedCount})` : ''}
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Optional Extra Custom Children */}
      {children && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          {children}
        </div>
      )}
    </div>
  );
};
