import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  PenTool,
  Type,
  Upload,
  RotateCcw,
  RotateCw,
  Trash2,
  Crop,
  ShieldCheck,
  CheckCircle2,
  Info,
  Sliders,
  Palette,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

type Mode = 'draw' | 'type' | 'upload';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

export const SignatureMakerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('draw');

  // Draw Mode State
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [penColor, setPenColor] = useState('#0f172a'); // ink black
  const [penWidth, setPenWidth] = useState(3);

  // Type Mode State
  const [typedText, setTypedText] = useState('Alex Morgan');
  const [fontFamily, setFontFamily] = useState<'Caveat' | 'Dancing Script' | 'Great Vibes' | 'Sacramento' | 'Homemade Apple'>('Caveat');
  const [typedFontSize, setTypedFontSize] = useState(56);
  const [typedColor, setTypedColor] = useState('#0f172a');
  const [typedSlant, setTypedSlant] = useState(0);

  // Upload Mode State
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [threshold, setThreshold] = useState(210); // 0-255 luminance threshold
  const [contrastBoost, setContrastBoost] = useState(1.4);

  // Export Settings
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'white'>('transparent');
  const [autoTrim, setAutoTrim] = useState(true);
  const [exportScale, setExportScale] = useState<1 | 2 | 3>(2);

  // Redraw Draw Canvas whenever strokes change
  useEffect(() => {
    if (mode !== 'draw') return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderStroke = (stroke: Stroke) => {
      if (stroke.points.length < 1) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
        return;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
        const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
      }
      ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
      ctx.stroke();
    };

    strokes.forEach(renderStroke);

    if (currentStroke.length > 0) {
      renderStroke({ points: currentStroke, color: penColor, width: penWidth });
    }
  }, [strokes, currentStroke, mode, penColor, penWidth]);

  // Drawing Handlers
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pt: Point = {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };

    setIsDrawing(true);
    setCurrentStroke([pt]);
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pt: Point = {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };

    setCurrentStroke(prev => [...prev, pt]);
  };

  const handleEndDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: penColor,
        width: penWidth
      };
      setStrokes(prev => [...prev, newStroke]);
      setRedoStack([]);
      setCurrentStroke([]);
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setRedoStack(prev => [...prev, last]);
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setStrokes(prev => [...prev, next]);
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStack([]);
    setCurrentStroke([]);
    onShowToast('Canvas cleared.');
  };

  // Upload Handling
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.onload = () => {
        setUploadedImage(img);
        onShowToast('Signature image uploaded.');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  // Build Final Export Canvas (handles cropping, supersampling, backgrounds)
  const generateExportCanvas = (): HTMLCanvasElement => {
    const scale = exportScale;
    let sourceCanvas = document.createElement('canvas');

    if (mode === 'draw') {
      const raw = drawCanvasRef.current;
      sourceCanvas.width = (raw?.width || 700) * scale;
      sourceCanvas.height = (raw?.height || 260) * scale;
      const sCtx = sourceCanvas.getContext('2d')!;
      sCtx.scale(scale, scale);

      strokes.forEach(stroke => {
        if (stroke.points.length < 1) return;
        sCtx.beginPath();
        sCtx.strokeStyle = stroke.color;
        sCtx.lineWidth = stroke.width;
        sCtx.lineCap = 'round';
        sCtx.lineJoin = 'round';
        sCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 1; i++) {
          const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          sCtx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
        }
        sCtx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
        sCtx.stroke();
      });
    } else if (mode === 'type') {
      sourceCanvas.width = 700 * scale;
      sourceCanvas.height = 260 * scale;
      const sCtx = sourceCanvas.getContext('2d')!;
      sCtx.scale(scale, scale);

      sCtx.font = `${typedFontSize}px "${fontFamily}", cursive`;
      sCtx.fillStyle = typedColor;
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';

      sCtx.save();
      sCtx.translate(350, 130);
      sCtx.rotate((typedSlant * Math.PI) / 180);
      sCtx.fillText(typedText, 0, 0);
      sCtx.restore();
    } else if (mode === 'upload' && uploadedImage) {
      sourceCanvas.width = uploadedImage.width;
      sourceCanvas.height = uploadedImage.height;
      const sCtx = sourceCanvas.getContext('2d')!;
      sCtx.drawImage(uploadedImage, 0, 0);

      if (removeBackground) {
        const imgData = sCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum > threshold) {
            data[i + 3] = 0; // make transparent
          } else {
            // Darken ink / boost contrast
            const ink = Math.max(0, 255 - (255 - lum) * contrastBoost);
            data[i] = ink;
            data[i + 1] = ink;
            data[i + 2] = ink;
          }
        }
        sCtx.putImageData(imgData, 0, 0);
      }
    }

    // Auto-Trim Transparent Bounding Box
    if (autoTrim) {
      const sCtx = sourceCanvas.getContext('2d')!;
      const imgData = sCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const data = imgData.data;

      let minX = sourceCanvas.width;
      let minY = sourceCanvas.height;
      let maxX = 0;
      let maxY = 0;
      let hasPixels = false;

      for (let y = 0; y < sourceCanvas.height; y++) {
        for (let x = 0; x < sourceCanvas.width; x++) {
          const alpha = data[(y * sourceCanvas.width + x) * 4 + 3];
          if (alpha > 10) {
            hasPixels = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (hasPixels) {
        const padding = 20 * scale;
        const cropX = Math.max(0, minX - padding);
        const cropY = Math.max(0, minY - padding);
        const cropW = Math.min(sourceCanvas.width - cropX, maxX - minX + padding * 2);
        const cropH = Math.min(sourceCanvas.height - cropY, maxY - minY + padding * 2);

        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = cropW;
        trimmedCanvas.height = cropH;
        const tCtx = trimmedCanvas.getContext('2d')!;

        if (backgroundType === 'white') {
          tCtx.fillStyle = '#ffffff';
          tCtx.fillRect(0, 0, cropW, cropH);
        }

        tCtx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        return trimmedCanvas;
      }
    }

    if (backgroundType === 'white') {
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = sourceCanvas.width;
      finalCanvas.height = sourceCanvas.height;
      const fCtx = finalCanvas.getContext('2d')!;
      fCtx.fillStyle = '#ffffff';
      fCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      fCtx.drawImage(sourceCanvas, 0, 0);
      return finalCanvas;
    }

    return sourceCanvas;
  };

  const handleDownloadPng = () => {
    try {
      const canvas = generateExportCanvas();
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast('Signature downloaded as PNG.');
    } catch (err) {
      console.error(err);
      onShowToast('Download failed. Please try again.');
    }
  };

  const handleDownloadJpg = () => {
    try {
      // JPG requires a solid white background
      const oldBg = backgroundType;
      setBackgroundType('white');
      const canvas = generateExportCanvas();
      setBackgroundType(oldBg);

      const url = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onShowToast('Signature downloaded as JPG.');
    } catch (err) {
      console.error(err);
      onShowToast('Download failed.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {/* Mode Selector */}
      <div className="glass-card p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'draw'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" /> Draw
        </button>

        <button
          type="button"
          onClick={() => setMode('type')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'type'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Type className="w-4 h-4" /> Type Cursive
        </button>

        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Scan
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        {mode === 'draw' && (
          <div className="space-y-4">
            {/* Draw Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Ink Color:</span>
                {['#0f172a', '#1e3a8a', '#1d4ed8', '#b91c1c', '#047857'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPenColor(c)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                      penColor === c ? 'scale-110 border-indigo-600' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer ml-1"
                  title="Custom Ink Color"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Thickness:</span>
                {[1.5, 3, 4.5, 6].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPenWidth(w)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      penWidth === w
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {w === 1.5 ? 'Fine' : w === 3 ? 'Medium' : w === 4.5 ? 'Bold' : 'Thick'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-30"
                  title="Undo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-30"
                  title="Redo"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 cursor-pointer"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 select-none">
              <canvas
                ref={drawCanvasRef}
                width={700}
                height={260}
                onMouseDown={handleStartDraw}
                onMouseMove={handleMoveDraw}
                onMouseUp={handleEndDraw}
                onMouseLeave={handleEndDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={handleMoveDraw}
                onTouchEnd={handleEndDraw}
                className="w-full h-64 sm:h-72 cursor-crosshair touch-none"
              />
              {strokes.length === 0 && !isDrawing && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-semibold">
                  Sign here using mouse, trackpad, or finger
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'type' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Your Name / Text</label>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Script Font Style</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Caveat">Caveat (Modern Casual)</option>
                  <option value="Dancing Script">Dancing Script (Elegant Calligraphy)</option>
                  <option value="Great Vibes">Great Vibes (Formal Flowing)</option>
                  <option value="Sacramento">Sacramento (Connected Monoline)</option>
                  <option value="Homemade Apple">Homemade Apple (Natural Pen)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Font Size: {typedFontSize}px</label>
                <input
                  type="range"
                  min={32}
                  max={80}
                  value={typedFontSize}
                  onChange={(e) => setTypedFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Slant / Rotation</label>
                <input
                  type="range"
                  min={-15}
                  max={15}
                  value={typedSlant}
                  onChange={(e) => setTypedSlant(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>
            </div>

            {/* Type Preview Display */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 min-h-[220px] flex items-center justify-center overflow-hidden">
              <span
                style={{
                  fontFamily: `"${fontFamily}", cursive`,
                  fontSize: `${typedFontSize}px`,
                  color: typedColor,
                  transform: `rotate(${typedSlant}deg)`,
                  display: 'inline-block',
                  transition: 'transform 0.1s'
                }}
              >
                {typedText || 'Signature Preview'}
              </span>
            </div>
          </div>
        )}

        {mode === 'upload' && (
          <div className="space-y-4">
            {!uploadedImage ? (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Upload Scanned / Photographed Signature</span>
                <span className="text-xs text-slate-500 mt-1">PNG, JPG, WebP supported</span>
                <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      checked={removeBackground}
                      onChange={(e) => setRemoveBackground(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Remove Paper Background</span>
                  </label>

                  {removeBackground && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Threshold: {threshold}</label>
                        <input
                          type="range"
                          min={120}
                          max={250}
                          value={threshold}
                          onChange={(e) => setThreshold(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Contrast Boost: {contrastBoost.toFixed(1)}x</label>
                        <input
                          type="range"
                          min={1.0}
                          max={2.5}
                          step={0.1}
                          value={contrastBoost}
                          onChange={(e) => setContrastBoost(parseFloat(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center max-h-72 overflow-hidden">
                  <img src={uploadedImage.src} alt="Uploaded signature" className="max-h-60 object-contain rounded-lg shadow-sm" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Options & Actions */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Background:</span>
              <button
                type="button"
                onClick={() => setBackgroundType('transparent')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  backgroundType === 'transparent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Transparent
              </button>
              <button
                type="button"
                onClick={() => setBackgroundType('white')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  backgroundType === 'white' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                White
              </button>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoTrim}
                onChange={(e) => setAutoTrim(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Auto-crop empty edges</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Quality:</span>
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setExportScale(s as any)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    exportScale === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              type="button"
              onClick={handleDownloadJpg}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" /> Download JPG
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Use Case Guidance */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          Legal & Practical Usage Note
        </div>
        <p>
          Electronic signatures generated here can be inserted into digital documents, Word files, PDF contracts, emails, and online applications. Always verify if your specific jurisdiction or counterparty requires cryptographic digital certificates for formal legal deeds.
        </p>
      </div>
    </div>
  );
};
