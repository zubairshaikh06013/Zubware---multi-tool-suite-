import React, { useState, useCallback } from 'react';
import { Square, Download, RefreshCw, Sliders } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress } from './ImageProcessingProgress';
import { useImageDecoration } from '../../../hooks/useImageDecoration';
import { prepareDecorationCanvas, borderGeometry, doubleBorderRects } from '../../../lib/imageDecoration';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';

interface ImageBorderGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'rounded';

export const ImageBorderGeneratorTool: React.FC<ImageBorderGeneratorToolProps> = ({ onShowToast, onNavigate }) => {


  const [borderWidth, setBorderWidth] = useState<number>(20);
  const [borderColor, setBorderColor] = useState<string>('#4F46E5');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('solid');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [isOuter, setIsOuter] = useState<boolean>(true); // outer expands canvas, inner overlays inside image

  const [outputFormat, setOutputFormat] = useState<string>('png');

  const render = useCallback((canvas: HTMLCanvasElement, imageObj: HTMLImageElement) => {
    const imgW = imageObj.naturalWidth || imageObj.width;
    const imgH = imageObj.naturalHeight || imageObj.height;

    const geometry = borderGeometry(imgW, imgH, borderWidth, isOuter);
    const bw = geometry.border, canvasW = geometry.width, canvasH = geometry.height;
    const ctx = prepareDecorationCanvas(canvas, canvasW, canvasH);
    ctx.clearRect(0, 0, canvasW, canvasH);

    const imgX = isOuter ? bw : 0;
    const imgY = isOuter ? bw : 0;

    if (borderStyle === 'rounded' && bw > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, canvasW, canvasH, Math.min(borderRadius + bw / 2, canvasW / 2, canvasH / 2));
      ctx.clip();
    }
    // Draw base image
    ctx.drawImage(imageObj, imgX, imgY, imgW, imgH);

    if (bw === 0) return;

    // Draw border
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.fillStyle = borderColor;
    ctx.lineWidth = bw;

    if (borderStyle === 'dashed') {
      ctx.setLineDash([bw * 2, bw]);
    } else if (borderStyle === 'dotted') {
      ctx.setLineDash([bw, bw]);
    } else {
      ctx.setLineDash([]);
    }

    if (borderStyle === 'rounded') {
      const rad = Math.max(0, Math.min(borderRadius, (canvasW - bw) / 2, (canvasH - bw) / 2));
      const bx = isOuter ? bw / 2 : bw / 2;
      const by = isOuter ? bw / 2 : bw / 2;
      const bwW = isOuter ? canvasW - bw : imgW - bw;
      const bwH = isOuter ? canvasH - bw : imgH - bw;

      ctx.beginPath();
      ctx.roundRect(bx, by, bwW, bwH, rad);
      ctx.stroke();
    } else if (borderStyle === 'double') {
      for (const rect of doubleBorderRects(canvasW, canvasH, bw)) {
        ctx.lineWidth = rect.lineWidth;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    } else {
      // Solid / Dashed / Dotted
      const bx = isOuter ? bw / 2 : bw / 2;
      const by = isOuter ? bw / 2 : bw / 2;
      const bwW = isOuter ? canvasW - bw : imgW - bw;
      const bwH = isOuter ? canvasH - bw : imgH - bw;
      ctx.strokeRect(bx, by, bwW, bwH);
    }

    ctx.restore();
  }, [borderWidth, borderColor, borderStyle, borderRadius, isOuter]);

  const {file, metadata, isProcessing, ready, error, canvasRef, handleImageSelected, handleDownload, reset} = useImageDecoration(render, outputFormat, 'bordered', onShowToast);

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

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

          {isProcessing && <ImageProcessingProgress stage={ready ? "Preparing Download" : "Reading Image"} progress={50} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Border Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['solid', 'dashed', 'dotted', 'double', 'rounded'] as BorderStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      aria-pressed={borderStyle === st}
                      onClick={() => setBorderStyle(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                        borderStyle === st
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Expand Canvas (Outer Border)</span>
                <input
                  type="checkbox"
                  aria-label="Expand Canvas (Outer Border)"
                  checked={isOuter}
                  onChange={(e) => setIsOuter(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Width Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Border Width</span>
                  <span className="text-indigo-600">{borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {borderStyle === 'rounded' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Corner Radius</span>
                    <span className="text-indigo-600">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="100"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Border Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Border Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['png', 'jpg', 'webp'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      aria-pressed={outputFormat === fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        outputFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 mb-2 block">Border Preview</span>
                <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800">
                  <canvas aria-label="Image preview" ref={canvasRef} className="max-h-80 max-w-full object-contain" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
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
                  disabled={!ready || isProcessing}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Bordered Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
