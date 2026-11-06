import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Calendar,
  Type,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Layout
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';

import { exportCompositeImage } from '../../../lib/compositeImageExport';
import { formatDecimalBytes, parseTargetBytes } from '../../../lib/fileSizeStandard';

import { localPhotoDate, fitPhotoLabel } from '../../../lib/photoLabel';

type Placement = 'bottom-strip' | 'top-strip' | 'bottom-overlay';
type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD-MMM-YYYY';

export const PhotoNameDateJoinerTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();

  // Uploaded photo
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [origFile, setOrigFile] = useState<File | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [datePrefix, setDatePrefix] = useState('DOP: '); // Date of Photo
  const [dateFormat, setDateFormat] = useState<DateFormat>('DD/MM/YYYY');
  const [textTransform, setTextTransform] = useState<'uppercase' | 'capitalize' | 'none'>('uppercase');

  // Strip Styling & Placement
  const [placement, setPlacement] = useState<Placement>('bottom-strip');
  const [stripHeightPct, setStripHeightPct] = useState<number>(20); // 15-30% of photo height
  const [stripBgColor, setStripBgColor] = useState<'#ffffff' | '#0f172a' | '#f1f5f9'>('#ffffff');
  const [textColor, setTextColor] = useState<'#0f172a' | '#ffffff'>('#0f172a');
  const [fontFamily, setFontFamily] = useState<'sans-serif' | 'serif' | 'monospace'>('sans-serif');
  const [includeBorder, setIncludeBorder] = useState(true);
  const [exportFormat, setExportFormat] = useState<'jpeg' | 'png'>('jpeg');

  // Live Canvas Preview
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [outputDataUrl, setOutputDataUrl] = useState<string>('');
  const [maxKb, setMaxKb] = useState(0);
  const [outputInfo, setOutputInfo] = useState({ width: 0, height: 0, bytes: 0, withinLimit: true });
  const [exportError, setExportError] = useState('');
  const uploadRequest = useRef(0);

  const handleFileSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    const requestId = ++uploadRequest.current;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size === 0 || selected.size > 25 * 1024 * 1024) { onShowToast('Choose a JPG, PNG or WebP image up to 25 MB.'); return; }
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => onShowToast('Unable to read this file. Try another image.');
    img.onerror = () => onShowToast('Unable to decode this image. Try JPG, PNG or WebP.');
    reader.onload = (e) => {
      img.onload = () => {
        if (requestId !== uploadRequest.current) return;
        if (img.width * img.height > 12000000 || img.width > 8192 || img.height > 6000) { onShowToast('Use a photo up to 12 megapixels, 8192 pixels wide and 6000 pixels tall.'); return; }
        setPhotoImg(img);
        setOrigFile(selected);
        onShowToast(`Photo loaded (${img.width} × ${img.height} px)`);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selected);
  };

  // Format date helper
  const getFormattedDate = (): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(m, 10) - 1;
    const mName = monthNames[monthIndex] || m;

    let formatted = '';
    if (dateFormat === 'DD/MM/YYYY') formatted = `${d}/${m}/${y}`;
    else if (dateFormat === 'MM/DD/YYYY') formatted = `${m}/${d}/${y}`;
    else if (dateFormat === 'YYYY-MM-DD') formatted = `${y}-${m}-${d}`;
    else if (dateFormat === 'DD-MMM-YYYY') formatted = `${d}-${mName}-${y}`;

    return `${datePrefix}${formatted}`;
  };

  const getFormattedName = (): string => {
    if (textTransform === 'uppercase') return name.toUpperCase();
    if (textTransform === 'capitalize') {
      return name.replace(/\b\w/g, l => l.toUpperCase());
    }
    return name;
  };

  // Render composite canvas
  useEffect(() => {
    if (!photoImg) return;

    const imgW = photoImg.width;
    const imgH = photoImg.height;

    // Calculate strip height proportional to photo
    const stripHeight = Math.round((imgH * stripHeightPct) / 100);

    let canvasW = imgW;
    let canvasH = imgH;

    if (placement === 'bottom-strip' || placement === 'top-strip') {
      canvasH = imgH + stripHeight;
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Draw photo
    let photoY = 0;
    let stripY = imgH;

    if (placement === 'top-strip') {
      photoY = stripHeight;
      stripY = 0;
    } else if (placement === 'bottom-overlay') {
      photoY = 0;
      stripY = imgH - stripHeight;
    }

    if (exportFormat === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvasW, canvasH); }
    ctx.drawImage(photoImg, 0, photoY, imgW, imgH);

    // 2. Draw strip background
    ctx.fillStyle = stripBgColor;
    if (placement === 'bottom-overlay') {
      // If overlay, can be slightly translucent if desired or clean solid
      ctx.fillRect(0, stripY, imgW, stripHeight);
    } else {
      ctx.fillRect(0, stripY, imgW, stripHeight);
    }

    // 3. Draw separator line between photo and strip if matching
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = Math.max(1, Math.round(imgW / 400));
    if (placement === 'bottom-strip') {
      ctx.beginPath();
      ctx.moveTo(0, imgH);
      ctx.lineTo(imgW, imgH);
      ctx.stroke();
    } else if (placement === 'top-strip') {
      ctx.beginPath();
      ctx.moveTo(0, stripHeight);
      ctx.lineTo(imgW, stripHeight);
      ctx.stroke();
    }

    // 4. Render Name and Date Text centered
    const displayName = getFormattedName();
    const displayDate = getFormattedDate();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Font sizing based on strip height
    const nameFontSize = stripHeight * 0.32;
    const dateFontSize = stripHeight * 0.28;

    const drawLabel = (text: string, preferred: number, y: number) => {
      fitPhotoLabel(ctx, text, fontFamily, preferred, imgW * 0.92);
      ctx.fillText(text, imgW / 2, y);
    };
    if (displayName && displayDate) {
      const nameY = stripY + stripHeight * 0.35;
      const dateY = stripY + stripHeight * 0.72;

      drawLabel(displayName, nameFontSize, nameY);

      drawLabel(displayDate, dateFontSize, dateY);
    } else if (displayName) {
      drawLabel(displayName, nameFontSize * 1.2, stripY + stripHeight / 2);
    } else if (displayDate) {
      drawLabel(displayDate, dateFontSize * 1.2, stripY + stripHeight / 2);
    }

    // 5. Draw border around entire composite if enabled
    if (includeBorder) {
      ctx.strokeStyle = '#0f172a';
      const bWidth = Math.max(2, Math.round(imgW / 300));
      ctx.lineWidth = bWidth;
      ctx.strokeRect(bWidth / 2, bWidth / 2, canvasW - bWidth, canvasH - bWidth);
    }

    try {
      const exported = exportCompositeImage(canvas, exportFormat, parseTargetBytes(maxKb, 'KB'));
      setOutputDataUrl(exported.url);
      setOutputInfo({ width: canvasW, height: canvasH, bytes: exported.bytes, withinLimit: exported.withinLimit });
      setExportError('');
    } catch {
      setOutputDataUrl('');
      setExportError('Unable to export this photo. Try a smaller original.');
    }

    // Update preview canvas
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      pCanvas.width = canvas.width;
      pCanvas.height = canvas.height;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) pCtx.drawImage(canvas, 0, 0);
    }
  }, [photoImg, name, dateStr, datePrefix, dateFormat, textTransform, placement, stripHeightPct, stripBgColor, textColor, fontFamily, includeBorder, exportFormat, maxKb]);

  const handleDownload = () => {
    if (!outputDataUrl || !outputInfo.withinLimit || exportError) return;
    const a = document.createElement('a');
    a.href = outputDataUrl;
    const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
    a.download = `photo-name-date.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Composite photo downloaded.');
  };

  const handleReset = () => {
    uploadRequest.current++;
    setExportError('');
    setOutputInfo({ width: 0, height: 0, bytes: 0, withinLimit: true });
    setPhotoImg(null);
    setOrigFile(null);
    setOutputDataUrl('');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {!photoImg ? (
        <UniversalFileUpload
          accept="image/jpeg,image/png,image/webp"
          multiple={false}
          maxSizeMB={25}
          title="Drop candidate photo here to add name & date"
          subtitle="Add a visible label, then check your form’s own photo requirements"
          fileTypeSupportText="Client-Side • Sharp vector typography"
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 Cols: Form Fields & Formatting */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600" /> Name & Date Settings
              </h3>

              {/* Candidate Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  aria-label="Candidate name"
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. JOHN DOE"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <p className="text-xs text-slate-500">लंबा नाम strip में फिट करने के लिए छोटा किया जाता है। Preview में लिखावट साफ न दिखे तो बड़ी फोटो या बड़ी strip चुनें। सही नाम और फोटो लेने की असली तारीख भरें—Today केवल आपके device की आज की तारीख चुनता है।</p>
              {/* Date Input & Quick Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-500">Date of Photo</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDateStr(localPhotoDate())}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Today
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  aria-label="Date photograph was taken"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              {/* Date Prefix & Format */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Prefix Label</label>
                  <select
                    value={datePrefix}
                    onChange={(e) => setDatePrefix(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="DOP: ">DOP: (Date of Photo)</option>
                    <option value="Date: ">Date: </option>
                    <option value="">None (Just Date)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                  </select>
                </div>
              </div>

              <hr className="border-slate-200/60 dark:border-slate-800" />

              {/* Strip Placement & Appearance */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Banner Position</label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPlacement('bottom-strip')}
                      className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                        placement === 'bottom-strip'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Bottom Strip
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlacement('top-strip')}
                      className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                        placement === 'top-strip'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Top Strip
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlacement('bottom-overlay')}
                      className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                        placement === 'bottom-overlay'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Overlay
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Strip Height: {stripHeightPct}%
                    </label>
                    <input
                      type="range"
                      min={14}
                      max={30}
                      value={stripHeightPct}
                      onChange={(e) => setStripHeightPct(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Strip Theme</label>
                    <div className="flex gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setStripBgColor('#ffffff');
                          setTextColor('#0f172a');
                        }}
                        className={`flex-1 py-1 rounded-lg border font-bold cursor-pointer ${
                          stripBgColor === '#ffffff' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        White
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStripBgColor('#0f172a');
                          setTextColor('#ffffff');
                        }}
                        className={`flex-1 py-1 rounded-lg border font-bold cursor-pointer ${
                          stripBgColor === '#0f172a' ? 'border-indigo-600 bg-slate-900 text-white' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeBorder}
                    onChange={(e) => setIncludeBorder(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Add outer border frame around photo
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Live Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Result Preview
                </h4>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
                >
                  Change Photo
                </button>
              </div>

              {/* Preview Box */}
              <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[380px] overflow-auto">
                {outputDataUrl && <img src={outputDataUrl} alt="Exported photo with name and date" className="max-w-full max-h-[480px] object-contain shadow-md rounded-lg bg-white" />}
                <canvas ref={previewCanvasRef} className="hidden" aria-hidden="true" />
              </div>

              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Export format
                <select value={exportFormat} onChange={e => setExportFormat(e.target.value as 'jpeg' | 'png')} className="block w-full mt-2 p-2 rounded-lg border bg-white dark:bg-slate-900"><option value="jpeg">JPG</option><option value="png">PNG</option></select>
              </label>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                Maximum file size (KB; 0 = no limit)
                <input type="number" min="0" max="10000" value={maxKb} onChange={e => setMaxKb(Math.min(10000, Math.max(0, Number(e.target.value) || 0)))} className="block w-full mt-2 p-2 rounded-lg border bg-white dark:bg-slate-900" />
              </label>
              <p className="text-xs text-slate-500">1 KB = 1,000 bytes. JPG quality adjusts without changing pixels. PNG is measured without lossy compression. No minimum-size check is applied here.</p>
              {outputDataUrl && <p role="status" className="text-sm font-bold">Output: {outputInfo.width} × {outputInfo.height} px · {formatDecimalBytes(outputInfo.bytes)} ({outputInfo.bytes.toLocaleString('en-US')} bytes)</p>}
              {!outputInfo.withinLimit && <p role="alert" className="text-sm text-rose-600">The export exceeds your maximum KB. Download is blocked. Increase the limit or resize the image if your form permits it.</p>}
              {exportError && <p role="alert" className="text-sm text-rose-600">{exportError}</p>}
              <p className="text-xs text-slate-500">A separate top or bottom strip increases the output height. Overlay keeps the original dimensions but covers part of the photo. Check readability and your form instructions.</p>
              <a href="/image-resizer" className="text-xs text-indigo-600 underline">Need different final pixels? Resize the labelled photo</a>
              {/* Download Action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!outputDataUrl || !outputInfo.withinLimit || !!exportError}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" /> Download Form Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
