import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Download, Copy, Check, Sliders, Palette, RefreshCw, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import JsBarcode from 'jsbarcode';

const BARCODE_FORMATS = [
  { id: 'CODE128', name: 'CODE 128 (Universal/Auto)', sample: 'ZUBWARE-2025' },
  { id: 'EAN13', name: 'EAN-13 (Standard Retail)', sample: '1234567890128' },
  { id: 'EAN8', name: 'EAN-8 (Small Packages)', sample: '12345670' },
  { id: 'UPC', name: 'UPC-A (North America Retail)', sample: '123456789012' },
  { id: 'CODE39', name: 'CODE 39 (Alphanumeric/Gov)', sample: 'PROD-9988' },
  { id: 'ITF14', name: 'ITF-14 (Shipping Cartons)', sample: '10012345678902' },
  { id: 'MSI', name: 'MSI / Plessey (Inventory)', sample: '1234567' },
  { id: 'pharmacode', name: 'Pharmacode (Pharmaceutical)', sample: '123456' },
  { id: 'codabar', name: 'Codabar (Libraries/FedEx)', sample: 'A12345678B' },
];

export function BarcodeGeneratorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [value, setValue] = useState<string>('ZUBWARE-8849');
  const [format, setFormat] = useState<string>('CODE128');
  const [width, setWidth] = useState<number>(2);
  const [height, setHeight] = useState<number>(80);
  const [displayValue, setDisplayValue] = useState<boolean>(true);
  const [lineColor, setLineColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(16);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!value) {
      setErrorMsg('Please enter a barcode value');
      return;
    }

    try {
      if (svgRef.current) {
        JsBarcode(svgRef.current, value, {
          format: format as any,
          width: width,
          height: height,
          displayValue: displayValue,
          lineColor: lineColor,
          background: bgColor,
          fontSize: fontSize,
          margin: 12,
          font: 'monospace',
          valid: (valid: boolean) => {
            if (!valid) {
              setErrorMsg(`Invalid input for ${format}. Please check required digits or format.`);
            } else {
              setErrorMsg(null);
            }
          },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || `Invalid input format for ${format}`);
    }
  }, [value, format, width, height, displayValue, lineColor, bgColor, fontSize]);

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    const found = BARCODE_FORMATS.find((f) => f.id === newFormat);
    if (found) {
      setValue(found.sample);
    }
  };

  const downloadPng = () => {
    if (!svgRef.current || errorMsg) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `barcode_${format}_${value}.png`;
        downloadLink.click();
        onShowToast('Downloaded Barcode PNG!');
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const downloadSvg = () => {
    if (!svgRef.current || errorMsg) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${format}_${value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Barcode SVG vector!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Barcode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Barcode Generator (1D & Retail)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-resolution commercial barcodes (CODE128, EAN-13, UPC, CODE39, ITF-14) with instant vector SVG & PNG export.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Configuration Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Barcode Type / Symbology
              </label>
              <select
                value={format}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {BARCODE_FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Barcode Data / Text
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter numbers or text..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Sample for this format: {BARCODE_FORMATS.find((f) => f.id === format)?.sample}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Bar Width ({width}px)</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Bar Height ({height}px)</label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  step="5"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Font Size ({fontSize}px)</label>
                <input
                  type="range"
                  min="10"
                  max="26"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Bar Color</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Background</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={displayValue}
                onChange={(e) => setDisplayValue(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Display readable human text below barcode</span>
            </label>
          </div>
        </div>

        {/* Right Side: Live Barcode Preview & Export */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[280px]">
            {errorMsg ? (
              <div className="text-center space-y-2 max-w-sm">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                  !
                </div>
                <p className="text-xs font-bold text-rose-500">{errorMsg}</p>
                <p className="text-[11px] text-slate-400">
                  Tip: EAN-13 requires 12 or 13 digits. UPC-A requires 11 or 12 digits.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/80 max-w-full overflow-x-auto flex items-center justify-center">
                <svg ref={svgRef} className="max-w-full h-auto" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={downloadSvg}
              disabled={!!errorMsg}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Vector SVG
            </button>
            <button
              onClick={downloadPng}
              disabled={!!errorMsg}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download High-Res PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
