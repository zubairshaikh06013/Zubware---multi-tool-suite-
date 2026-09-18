import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Lock,
  Unlock,
  Sliders,
  Crop,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';
import { formatBytes } from '../../../lib/pdfUtils';

type Unit = 'px' | 'cm' | 'mm' | 'in';

const DPI = 96; // Standard screen/web DPI for conversions

export const SignatureResizerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Original specs
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [origSize, setOrigSize] = useState(0);

  // Dimension settings
  const [unit, setUnit] = useState<Unit>('px');
  const [targetWidth, setTargetWidth] = useState<number>(300);
  const [targetHeight, setTargetHeight] = useState<number>(100);
  const [aspectLocked, setAspectLocked] = useState(true);

  // Options
  const [cropMargins, setCropMargins] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState<'transparent' | 'white'>('transparent');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [maxKbLimit, setMaxKbLimit] = useState<number | null>(null);

  // Output result
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputDataUrl, setOutputDataUrl] = useState<string>('');

  const handleFileSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith('image/')) {
      onShowToast('Please select a valid image file.');
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        setFile(selected);
        setImgElement(img);
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setOrigSize(selected.size);

        setTargetWidth(img.width);
        setTargetHeight(img.height);
        onShowToast(`Image loaded: ${img.width} × ${img.height} px`);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selected);
  };

  // Unit conversion helpers
  const toPx = (val: number, u: Unit): number => {
    if (u === 'px') return val;
    if (u === 'in') return Math.round(val * DPI);
    if (u === 'cm') return Math.round((val / 2.54) * DPI);
    if (u === 'mm') return Math.round((val / 25.4) * DPI);
    return val;
  };

  const fromPx = (px: number, u: Unit): number => {
    if (u === 'px') return px;
    if (u === 'in') return Number((px / DPI).toFixed(2));
    if (u === 'cm') return Number(((px / DPI) * 2.54).toFixed(2));
    if (u === 'mm') return Math.round((px / DPI) * 25.4);
    return px;
  };

  const handleWidthChange = (val: number) => {
    const px = toPx(val, unit);
    setTargetWidth(px);
    if (aspectLocked && origWidth > 0 && origHeight > 0) {
      const ratio = origHeight / origWidth;
      setTargetHeight(Math.round(px * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const px = toPx(val, unit);
    setTargetHeight(px);
    if (aspectLocked && origWidth > 0 && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setTargetWidth(Math.round(px * ratio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setAspectLocked(false);
    setTargetWidth(w);
    setTargetHeight(h);
    onShowToast(`Preset set to ${w} × ${h} px`);
  };

  const applyPercentage = (pct: number) => {
    if (!imgElement) return;
    const w = Math.round((origWidth * pct) / 100);
    const h = Math.round((origHeight * pct) / 100);
    setTargetWidth(w);
    setTargetHeight(h);
    onShowToast(`Scaled to ${pct}%`);
  };

  // Generate Resized Image Canvas
  useEffect(() => {
    if (!imgElement) return;

    let sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = imgElement.width;
    sourceCanvas.height = imgElement.height;
    const sCtx = sourceCanvas.getContext('2d');
    if (!sCtx) return;
    sCtx.drawImage(imgElement, 0, 0);

    let workingCanvas = sourceCanvas;

    // Optional Trim Margin
    if (cropMargins) {
      const imgData = sCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const data = imgData.data;
      let minX = sourceCanvas.width;
      let minY = sourceCanvas.height;
      let maxX = 0;
      let maxY = 0;
      let hasContent = false;

      for (let y = 0; y < sourceCanvas.height; y++) {
        for (let x = 0; x < sourceCanvas.width; x++) {
          const idx = (y * sourceCanvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // If pixel is not transparent and not pure white
          const isNotWhite = r < 240 || g < 240 || b < 240;
          if (a > 20 && isNotWhite) {
            hasContent = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (hasContent) {
        const pad = 8;
        const cropX = Math.max(0, minX - pad);
        const cropY = Math.max(0, minY - pad);
        const cropW = Math.min(sourceCanvas.width - cropX, maxX - minX + pad * 2);
        const cropH = Math.min(sourceCanvas.height - cropY, maxY - minY + pad * 2);

        const trimmed = document.createElement('canvas');
        trimmed.width = cropW;
        trimmed.height = cropH;
        const tCtx = trimmed.getContext('2d');
        if (tCtx) {
          tCtx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          workingCanvas = trimmed;
        }
      }
    }

    // Final Output Canvas with Target Dimensions
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = Math.max(10, targetWidth);
    finalCanvas.height = Math.max(10, targetHeight);
    const fCtx = finalCanvas.getContext('2d');
    if (!fCtx) return;

    if (backgroundMode === 'white' || exportFormat === 'jpeg') {
      fCtx.fillStyle = '#ffffff';
      fCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    }

    // High quality bicubic scaling
    fCtx.imageSmoothingEnabled = true;
    fCtx.imageSmoothingQuality = 'high';
    fCtx.drawImage(workingCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

    // Convert to Blob with file size limit check if requested
    const mime = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    let quality = 0.92;

    const buildBlob = (q: number) => {
      finalCanvas.toBlob((b) => {
        if (b) {
          // If KB limit is set and format is JPEG, attempt to compress further
          if (maxKbLimit && b.size > maxKbLimit * 1024 && q > 0.2 && exportFormat === 'jpeg') {
            buildBlob(q - 0.15);
            return;
          }
          setOutputBlob(b);
          setOutputDataUrl(URL.createObjectURL(b));
        }
      }, mime, q);
    };

    buildBlob(quality);
  }, [imgElement, targetWidth, targetHeight, cropMargins, backgroundMode, exportFormat, maxKbLimit]);

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-resized-${targetWidth}x${targetHeight}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    onShowToast('Resized signature downloaded.');
  };

  const handleReset = () => {
    setFile(null);
    setImgElement(null);
    setOutputBlob(null);
    setOutputDataUrl('');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to SplitDrop&apos;s servers.</span>
      </div>

      {!imgElement ? (
        <UniversalFileUpload
          accept="image/*"
          multiple={false}
          maxSizeMB={25}
          title="Drop your signature image here to resize"
          subtitle="Supports PNG, JPG, WebP signatures with instant dimension & KB size adjustments"
          fileTypeSupportText="100% Client-Side • Preserves transparency"
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Resize Parameters */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" /> Dimensions
                  </h3>
                  {/* Unit Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-bold">
                    {(['px', 'cm', 'mm', 'in'] as Unit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          unit === u ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width & Height Inputs with Lock */}
                <div className="grid grid-cols-5 items-center gap-2">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Width ({unit})
                    </label>
                    <input
                      type="number"
                      value={fromPx(targetWidth, unit)}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center pt-5">
                    <button
                      type="button"
                      onClick={() => setAspectLocked(!aspectLocked)}
                      className={`p-2 rounded-xl cursor-pointer ${
                        aspectLocked
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                      title={aspectLocked ? 'Lock Aspect Ratio' : 'Unlock Aspect Ratio'}
                    >
                      {aspectLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Height ({unit})
                    </label>
                    <input
                      type="number"
                      value={fromPx(targetHeight, unit)}
                      onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Scale Percentage Chips */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Quick Scale</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[25, 50, 75, 100, 150, 200].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyPercentage(pct)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Official Exam & Form Presets */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Government & Form Presets</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPreset(140, 60)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 text-xs cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Exam Form</div>
                      <div className="text-[10px] text-slate-500">140 × 60 px</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(200, 100)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 text-xs cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Passport / Visa</div>
                      <div className="text-[10px] text-slate-500">200 × 100 px</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(300, 100)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 text-xs cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">High-Res Doc</div>
                      <div className="text-[10px] text-slate-500">300 × 100 px</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(120, 40)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 text-xs cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Small Stamp</div>
                      <div className="text-[10px] text-slate-500">120 × 40 px</div>
                    </button>
                  </div>
                </div>

                <hr className="border-slate-200/60 dark:border-slate-800" />

                {/* Additional Formatting */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cropMargins}
                      onChange={(e) => setCropMargins(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Auto-crop empty edges before resizing
                    </span>
                  </label>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Background:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setBackgroundMode('transparent')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                          backgroundMode === 'transparent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        Transparent
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackgroundMode('white')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                          backgroundMode === 'white' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        Solid White
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Format:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setExportFormat('png')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                          exportFormat === 'png' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => setExportFormat('jpeg')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                          exportFormat === 'jpeg' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        JPG
                      </button>
                    </div>
                  </div>

                  {/* Target File Size Cap (KB) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Target File Size Limit (Optional): {maxKbLimit ? `${maxKbLimit} KB` : 'No Limit'}
                    </label>
                    <div className="flex gap-1.5">
                      {[20, 50, 100].map((kb) => (
                        <button
                          key={kb}
                          type="button"
                          onClick={() => {
                            setMaxKbLimit(maxKbLimit === kb ? null : kb);
                            if (maxKbLimit !== kb) setExportFormat('jpeg'); // limit works via JPEG compression
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            maxKbLimit === kb
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          &lt; {kb} KB
                        </button>
                      ))}
                      {maxKbLimit && (
                        <button
                          type="button"
                          onClick={() => setMaxKbLimit(null)}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live Before & After Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Preview & Output Comparison
                  </h4>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>

                {/* Specs Metric Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Original File</span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {origWidth} × {origHeight} px • {formatBytes(origSize)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      Resized Output
                    </span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {targetWidth} × {targetHeight} px • {outputBlob ? formatBytes(outputBlob.size) : '...'}
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[220px]">
                  {outputDataUrl ? (
                    <img
                      src={outputDataUrl}
                      alt="Resized signature"
                      className="max-h-48 object-contain shadow-sm rounded-lg"
                      style={{
                        backgroundColor: backgroundMode === 'white' ? '#ffffff' : 'transparent'
                      }}
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">Rendering preview...</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!outputBlob}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    <Download className="w-4 h-4" /> Download Resized Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
