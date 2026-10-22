import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Layers,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Sparkles,
  Layout
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

import { photoFrame } from '../../../lib/photoFrame';
import { exportCompositeImage } from '../../../lib/compositeImageExport';
import { formatDecimalBytes, parseTargetBytes } from '../../../lib/fileSizeStandard';

type LayoutMode = 'vertical' | 'horizontal';
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const drawPhoto = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, zoom: number, positionX: number, positionY: number) => {
  const crop = photoFrame(img.width, img.height, width, height, zoom, positionX, positionY);
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
};

const drawSignature = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number) => {
  const scale = Math.min(width / img.width, height / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  ctx.drawImage(img, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
};

export const PhotoSignatureJoinerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();

  // Images
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [sigImg, setSigImg] = useState<HTMLImageElement | null>(null);

  // Layout & Styling
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vertical');
  const [photoWidth, setPhotoWidth] = useState<number>(300);
  const [photoHeight, setPhotoHeight] = useState<number>(350);
  const [sigWidth, setSigWidth] = useState<number>(300);
  const [sigHeight, setSigHeight] = useState<number>(100);

  const [gap, setGap] = useState<number>(10);
  const [padding, setPadding] = useState<number>(15);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderColor, setBorderColor] = useState('#cbd5e1'); // slate-300
  const [bgColor, setBgColor] = useState<'#ffffff' | '#f8fafc' | 'transparent'>('#ffffff');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('jpeg');

  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPositionX, setPhotoX] = useState(50);
  const [photoPositionY, setPhotoY] = useState(50);
  const resetFraming = () => { setPhotoZoom(1); setPhotoX(50); setPhotoY(50); };

  const [maxKb, setMaxKb] = useState(0);
  const [outputBytes, setOutputBytes] = useState(0);
  const [exportError, setExportError] = useState('');
  const [actualSize, setActualSize] = useState(false);
  const exceedsLimit = maxKb > 0 && outputBytes > parseTargetBytes(maxKb, 'KB');

  // Preview & Export Canvas
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [outputDataUrl, setOutputDataUrl] = useState<string>('');

  const loadImage = (file: File, onLoaded: (img: HTMLImageElement) => void) => {
    if (!acceptedTypes.has(file.type) || file.size > MAX_IMAGE_BYTES || file.size === 0) {
      onShowToast('Choose a JPG, PNG, or WebP image up to 25 MB.');
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.onload = () => onLoaded(img);
      img.onerror = () => onShowToast('This image could not be opened. Try another file.');
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => onShowToast('This image could not be read. Try another file.');
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoImg(null);
    loadImage(file, (img) => {
      setPhotoImg(img);
      resetFraming();
      onShowToast('Passport/Candidate photo loaded.');
    });
  };

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSigImg(null);
    loadImage(file, (img) => {
      setSigImg(img);
      onShowToast('Signature image loaded.');
    });
  };

  const applyPreset = (pW: number, pH: number, sW: number, sH: number, mode: LayoutMode, presetGap = 10) => {
    setLayoutMode(mode);
    setPhotoWidth(pW);
    setPhotoHeight(pH);
    setSigWidth(sW);
    setSigHeight(sH);
    setGap(presetGap);
    setPadding(0);
    onShowToast('Applied layout preset.');
  };

  // Render Combined Canvas
  useEffect(() => {
    let totalCanvasWidth = 400;
    let totalCanvasHeight = 500;

    if (layoutMode === 'vertical') {
      totalCanvasWidth = Math.max(photoWidth, sigWidth) + padding * 2;
      totalCanvasHeight = photoHeight + sigHeight + gap + padding * 2;
    } else if (layoutMode === 'horizontal') {
      totalCanvasWidth = photoWidth + sigWidth + gap + padding * 2;
      totalCanvasHeight = Math.max(photoHeight, sigHeight) + padding * 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = totalCanvasWidth;
    canvas.height = totalCanvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    if (bgColor !== 'transparent' || exportFormat === 'jpeg') {
      ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (layoutMode === 'vertical') {
      // Center photo horizontally
      const photoX = padding + (totalCanvasWidth - padding * 2 - photoWidth) / 2;
      const photoY = padding;

      if (photoImg) {
        drawPhoto(ctx, photoImg, photoX, photoY, photoWidth, photoHeight, photoZoom, photoPositionX, photoPositionY);
      } else {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload Photo Here', photoX + photoWidth / 2, photoY + photoHeight / 2);
      }

      // Center signature horizontally below photo
      const sigX = padding + (totalCanvasWidth - padding * 2 - sigWidth) / 2;
      const sigY = photoY + photoHeight + gap;

      if (sigImg) {
        drawSignature(ctx, sigImg, sigX, sigY, sigWidth, sigHeight);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(sigX, sigY, sigWidth, sigHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload Signature Here', sigX + sigWidth / 2, sigY + sigHeight / 2);
      }
    } else if (layoutMode === 'horizontal') {
      const photoX = padding;
      const photoY = padding + (totalCanvasHeight - padding * 2 - photoHeight) / 2;

      if (photoImg) {
        drawPhoto(ctx, photoImg, photoX, photoY, photoWidth, photoHeight, photoZoom, photoPositionX, photoPositionY);
      } else {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Photo', photoX + photoWidth / 2, photoY + photoHeight / 2);
      }

      const sigX = photoX + photoWidth + gap;
      const sigY = padding + (totalCanvasHeight - padding * 2 - sigHeight) / 2;

      if (sigImg) {
        drawSignature(ctx, sigImg, sigX, sigY, sigWidth, sigHeight);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(sigX, sigY, sigWidth, sigHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Signature', sigX + sigWidth / 2, sigY + sigHeight / 2);
      }
    }

    // Draw Outer Border if requested
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);
    }

    setOutputDataUrl('');
    setOutputBytes(0);
    setExportError('');
    if (photoImg && sigImg) {
      try {
        const result = exportCompositeImage(canvas, exportFormat, parseTargetBytes(maxKb, 'KB'));
        setOutputDataUrl(result.url);
        setOutputBytes(result.bytes);
      } catch (error) {
        setExportError(error instanceof Error ? error.message : 'Unable to export this image.');
      }
    }

    // Also update preview ref
    const targetRef = previewCanvasRef.current;
    if (targetRef) {
      targetRef.width = canvas.width;
      targetRef.height = canvas.height;
      const pCtx = targetRef.getContext('2d');
      if (pCtx) {
        pCtx.drawImage(canvas, 0, 0);
      }
    }
  }, [photoImg, sigImg, layoutMode, photoWidth, photoHeight, sigWidth, sigHeight, gap, padding, borderWidth, borderColor, bgColor, exportFormat, maxKb, photoZoom, photoPositionX, photoPositionY]);

  const handleDownload = () => {
    if (!photoImg || !sigImg || !outputDataUrl || exceedsLimit) return;
    const a = document.createElement('a');
    a.href = outputDataUrl;
    const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
    a.download = `photo-signature-joined.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Joined composite image downloaded.');
  };

  const handleReset = () => {
    setPhotoImg(null);
    setSigImg(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {/* Dual Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Photo */}
        <label className="glass-card border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
          <Upload className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {photoImg ? 'Change Passport / Candidate Photo' : '1. Upload Photo'}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">JPG, PNG, WebP up to 25MB</span>
          {photoImg && (
            <span className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Photo Loaded ({photoImg.width} × {photoImg.height} px)
            </span>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} className="hidden" />
        </label>

        {/* Upload Signature */}
        <label className="glass-card border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
          <Upload className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {sigImg ? 'Change Signature Image' : '2. Upload Signature'}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">JPG, PNG, WebP up to 25MB</span>
          {sigImg && (
            <span className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Signature Loaded ({sigImg.width} × {sigImg.height} px)
            </span>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleSigUpload} className="hidden" />
        </label>
      </div>

      {/* Editor Layout & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Layout Orientation */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Composite Arrangement</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLayoutMode('vertical')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    layoutMode === 'vertical'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">Vertical (Stacked)</div>
                  <div className="text-[10px] opacity-75">Photo on top, Sign below</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('horizontal')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    layoutMode === 'horizontal'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">Horizontal (Side-by-side)</div>
                  <div className="text-[10px] opacity-75">Photo left, Sign right</div>
                </button>
              </div>
            </div>

            {/* Form Presets */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Example Output Sizes</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset(300, 350, 300, 100, 'vertical')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs font-bold hover:border-indigo-500 cursor-pointer"
                >
                  Vertical (300×460)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(240, 300, 240, 80, 'vertical')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs font-bold hover:border-indigo-500 cursor-pointer"
                >
                  Vertical (240×390)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(400, 500, 400, 150, 'vertical', 20)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs font-bold hover:border-indigo-500 cursor-pointer"
                >
                  Vertical (400×670)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(250, 300, 200, 120, 'horizontal')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs font-bold hover:border-indigo-500 cursor-pointer"
                >
                  Side-by-Side Card
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Presets set the shown total pixels with zero padding. Check your application form’s required dimensions and file size; changing spacing changes the total.</p>
            </div>

            <hr className="border-slate-200/60 dark:border-slate-800" />

            <fieldset className="space-y-2 text-xs">
              <legend className="font-bold">Photo framing</legend>
              <p className="text-slate-500">Keep the full face visible. These controls crop the photo; the signature stays fully inside its own area.</p>
              <label className="block">Zoom: {photoZoom.toFixed(2)}×<input className="block w-full" type="range" min="1" max="3" step="0.05" value={photoZoom} onChange={e => setPhotoZoom(Number(e.target.value))} /></label>
              <label className="block">Crop position — left to right<input className="block w-full" type="range" min="0" max="100" value={photoPositionX} onChange={e => setPhotoX(Number(e.target.value))} /></label>
              <label className="block">Crop position — top to bottom<input className="block w-full" type="range" min="0" max="100" value={photoPositionY} onChange={e => setPhotoY(Number(e.target.value))} /></label>
              <button type="button" onClick={resetFraming} className="rounded border px-3 py-2">Reset framing</button>
            </fieldset>
            {/* Dimensions Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Photo Size: {photoWidth} × {photoHeight} px</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={photoWidth}
                    min={16} max={2000}
                    onChange={(e) => setPhotoWidth(Math.min(2000, Math.max(16, parseInt(e.target.value, 10) || 16)))}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    value={photoHeight}
                    min={16} max={2000}
                    onChange={(e) => setPhotoHeight(Math.min(2000, Math.max(16, parseInt(e.target.value, 10) || 16)))}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    placeholder="Height"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Signature Size: {sigWidth} × {sigHeight} px</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={sigWidth}
                    min={16} max={2000}
                    onChange={(e) => setSigWidth(Math.min(2000, Math.max(16, parseInt(e.target.value, 10) || 16)))}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    value={sigHeight}
                    min={16} max={2000}
                    onChange={(e) => setSigHeight(Math.min(2000, Math.max(16, parseInt(e.target.value, 10) || 16)))}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    placeholder="Height"
                  />
                </div>
              </div>

              {/* Spacing & Border */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Gap: {gap}px</label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={gap}
                    onChange={(e) => setGap(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Padding: {padding}px</label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={padding}
                    onChange={(e) => setPadding(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Outer Border:</span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 4].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBorderWidth(b)}
                      className={`px-2 py-0.5 rounded cursor-pointer font-bold ${
                        borderWidth === b ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {b === 0 ? 'None' : `${b}px`}
                    </button>
                  ))}
                  {borderWidth > 0 && (
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Format:</span>
                <div className="flex gap-1 font-bold">
                  <button
                    type="button"
                    onClick={() => setExportFormat('jpeg')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      exportFormat === 'jpeg' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    JPG
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('png')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      exportFormat === 'png' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Live Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Live Composite Preview
              </h4>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
              >
                Clear Images
              </button>
            </div>

            {/* Composite Display */}
            <div className={`p-6 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex min-h-[380px] overflow-auto ${actualSize ? 'items-start justify-start' : 'items-center justify-center'}`}>
              <canvas ref={previewCanvasRef} className={outputDataUrl ? 'hidden' : 'max-h-[500px] max-w-full object-contain shadow-md bg-white'} />
              {outputDataUrl && <img src={outputDataUrl} alt="Combined photo and signature, showing the exported file" className={actualSize ? 'max-w-none shrink-0 bg-white' : 'max-w-full max-h-[500px] object-contain bg-white'} />}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold">Maximum file size (KB; 0 = no limit)
                <input type="number" min="0" max="10000" step="1" value={maxKb} onChange={e => setMaxKb(Math.min(10000, Math.max(0, Number(e.target.value) || 0)))} className="ml-2 w-24 rounded border p-2 bg-white dark:bg-slate-900" />
              </label>
              <div className="flex gap-2">{[20, 50, 100].map(kb => <button type="button" key={kb} onClick={() => { setMaxKb(kb); setExportFormat('jpeg'); }} className="rounded border px-3 py-2 text-xs">{kb} KB JPG</button>)}</div>
              <p className="text-xs text-slate-500">1 KB = 1,000 bytes. JPG quality adjusts to your limit; pixel dimensions stay fixed. PNG is measured without lossy compression.</p>
              <label className="block text-xs"><input type="checkbox" checked={actualSize} onChange={e => setActualSize(e.target.checked)} /> View actual pixels (scroll to inspect)</label>
              {exceedsLimit && <p role="alert" className="text-xs text-red-600">This file exceeds your limit. Increase the limit, choose JPG, or reduce dimensions if your form allows it. Download is disabled until it fits.</p>}
              {exportError && <p role="alert" className="text-xs text-red-600">{exportError}</p>}
            </div>
            {/* Action Bar */}
            <p className="text-xs text-slate-500">Output: {layoutMode === 'vertical' ? Math.max(photoWidth, sigWidth) + padding * 2 : photoWidth + sigWidth + gap + padding * 2} × {layoutMode === 'vertical' ? photoHeight + sigHeight + gap + padding * 2 : Math.max(photoHeight, sigHeight) + padding * 2} px{outputDataUrl && photoImg && sigImg ? ` · ${formatDecimalBytes(outputBytes)} (${outputBytes.toLocaleString()} bytes)` : ''}. Confirm your portal accepts the final dimensions and file size.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!photoImg || !sigImg || !outputDataUrl || exceedsLimit}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" /> Download Composite ({exportFormat.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
