import React, { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Check, Download, RefreshCw, FileText, PenTool, Eraser, RotateCcw, Sliders, Scan, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';

export function HandwritingToTextTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [contrastBoost, setContrastBoost] = useState<boolean>(true);

  // Canvas drawing refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onShowToast('Canvas cleared');
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Preprocess image to enhance handwriting contrast (binarization / high contrast)
  const preprocessImage = async (dataUrl: string): Promise<string> => {
    if (!contrastBoost) return dataUrl;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = img.width;
        offscreen.height = img.height;
        const ctx = offscreen.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
        const d = imgData.data;

        // Grayscale + high contrast thresholding
        for (let i = 0; i < d.length; i += 4) {
          const v = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          // Binarize
          const binary = v < 140 ? 0 : 255;
          d[i] = binary;
          d[i + 1] = binary;
          d[i + 2] = binary;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(offscreen.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  };

  const processOcr = async () => {
    let sourceDataUrl = '';
    if (mode === 'draw') {
      if (!canvasRef.current) return;
      sourceDataUrl = canvasRef.current.toDataURL('image/png');
    } else {
      if (!imageSrc) return;
      sourceDataUrl = imageSrc;
    }

    setLoading(true);
    setProgress(0);
    setStatusText('Enhancing handwriting contrast...');

    try {
      const processed = await preprocessImage(sourceDataUrl);

      setStatusText('Initializing recognition model...');
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Reading handwriting (${Math.round(m.progress * 100)}%)...`);
          }
        },
      });

      const ret = await worker.recognize(processed);
      setExtractedText(ret.data.text);
      await worker.terminate();
      onShowToast('Handwriting converted to digital text!');
    } catch (err: unknown) {
      console.error(err);
      onShowToast('Could not recognize handwriting. Try writing more clearly.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    onShowToast('Copied text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handwriting_notes.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded notes!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Handwriting to Text Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Draw handwriting directly on the canvas or upload photos of handwritten notes/diaries to convert into editable text.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 max-w-sm">
        <button
          onClick={() => setMode('draw')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'draw' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" /> Draw on Pad
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Drawing Pad or Upload */}
        <div className="lg:col-span-6 space-y-4">
          {mode === 'draw' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 pl-2">Pen Size:</span>
                  {[3, 5, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        brushSize === size ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>

                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Canvas
                </button>
              </div>

              <div className="relative border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl overflow-hidden shadow-inner bg-white">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[320px] cursor-crosshair touch-none"
                />
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[320px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />

              {imageSrc ? (
                <div className="space-y-3 w-full">
                  <img
                    src={imageSrc}
                    alt="Handwriting"
                    className="max-h-56 mx-auto rounded-xl object-contain shadow-sm border border-slate-200 dark:border-slate-800"
                  />
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block">Click to upload another handwritten document</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Upload Handwritten Document or Photo
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports notebook photos, handwritten notes, whiteboards</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={contrastBoost}
                onChange={(e) => setContrastBoost(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>High Contrast Ink Optimization (Improves Accuracy)</span>
            </label>

            <button
              onClick={processOcr}
              disabled={loading || (mode === 'upload' && !imageSrc)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{statusText || 'Converting Handwriting...'}</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Convert Handwriting to Text</span>
                </>
              )}
            </button>

            {loading && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{statusText}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recognized Text */}
        <div className="lg:col-span-6 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Converted Digital Text
            </label>
            <span className="text-[10px] text-slate-400 font-bold">
              {extractedText.length} characters &bull; {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            rows={14}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Converted text will appear here. For best results, write clearly with good spacing between letters..."
            className="w-full flex-1 min-h-[320px] p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Runs 100% locally in your browser.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!extractedText}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download TXT
              </button>
              <button
                onClick={handleCopy}
                disabled={!extractedText}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
