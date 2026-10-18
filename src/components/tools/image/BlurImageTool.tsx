import React, {useState} from 'react';
import { EyeOff as Blur, Undo, Redo, Download, RefreshCw, Brush, Square } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';
import {useRasterEditor,useCanvasBrush} from '../../../hooks/useRasterEditor';
import {blurredCanvas,pixelatedCanvas} from '../../../lib/rasterEffects';

interface BlurImageToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type BlurMode = 'brush' | 'area' | 'background';

export const BlurImageTool: React.FC<BlurImageToolProps> = ({ onShowToast, onNavigate }) => {
  const [mode,setMode]=useState<BlurMode>('brush');
  const [blurStrength,setBlurStrength]=useState(15),[brushSize,setBrushSize]=useState(30);
  const editor=useRasterEditor('blurred',onShowToast);
  const brush=useCanvasBrush(editor,brushSize,canvas=>blurredCanvas(canvas,blurStrength),mode==='brush');
  const applyFullBackgroundBlur=()=>editor.applyEffect(canvas=>blurredCanvas(canvas,blurStrength));
  const {file,metadata,canvasRef,ready,historyIndex,historyLength,handleImageSelected,handleUndo,handleRedo,handleDownload,reset,error,isProcessing,stage,progress}=editor;

  return (
    <div className="space-y-6">
      

      {error && <p role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">{error}</p>}
      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Controls Bar */}
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={mode==='brush'}
                  disabled={!ready}
                  onClick={() => setMode('brush')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === 'brush'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Brush className="w-3.5 h-3.5" /> Brush Blur
                </button>

                <button
                  type="button"
                  aria-pressed={mode==='background'}
                  disabled={!ready}
                  onClick={() => {
                    setMode('background');
                    applyFullBackgroundBlur();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === 'background'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Apply Full Image Blur
                </button>
              </div>

              {/* Undo / Redo Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!ready || historyIndex <= 0}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!ready || historyIndex >= historyLength - 1}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500">Choose strength, then apply Full Image Blur or start a new brush stroke. Full-image edits preserve earlier brush work.</p>
            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Blur Strength</span>
                  <span className="text-indigo-600">{blurStrength}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  aria-label="Blur strength"
                  value={blurStrength}
                  onChange={(e) => setBlurStrength(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {mode === 'brush' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Brush Size</span>
                    <span className="text-indigo-600">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    aria-label="Brush size"
                  value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500">Brush with a mouse, pen or touch. Undo keeps up to 12 recent states, with fewer for large images. JPG and WebP keep their format when supported; other inputs export as PNG still frames.</p>
            {/* Drawing Canvas */}
            <div className="relative max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
              <canvas
                ref={canvasRef}
                {...brush}
                aria-label="Image editing canvas"
                style={{touchAction:'none'}}
                className="max-h-80 object-contain rounded-xl cursor-crosshair"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Select Different Image
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!ready}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Download Blurred Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
