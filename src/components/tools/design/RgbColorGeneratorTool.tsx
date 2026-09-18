import React, { useState } from 'react';
import { Copy, RefreshCw, Check, Sliders, Pipette } from 'lucide-react';

interface RgbColorGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const RgbColorGeneratorTool: React.FC<RgbColorGeneratorToolProps> = ({ onShowToast }) => {
  const [r, setR] = useState<number>(79);
  const [g, setG] = useState<number>(70);
  const [b, setB] = useState<number>(229);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // RGB to HEX
  const rgbToHex = (red: number, green: number, blue: number) => {
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
  };

  // RGB to HSL
  const rgbToHsl = (red: number, green: number, blue: number) => {
    const rNorm = red / 255;
    const gNorm = green / 255;
    const bNorm = blue / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const handleRandomize = () => {
    const newR = Math.floor(Math.random() * 256);
    const newG = Math.floor(Math.random() * 256);
    const newB = Math.floor(Math.random() * 256);
    setR(newR);
    setG(newG);
    setB(newB);
    onShowToast(`Random RGB: rgb(${newR}, ${newG}, ${newB})`);
  };

  const hexValue = rgbToHex(r, g, b);
  const hslValue = rgbToHsl(r, g, b);
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const hslString = `hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    onShowToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const isLight = (r * 299 + g * 587 + b * 114) / 1000 > 128;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎛️</span> RGB Color Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fine-tune Red, Green, and Blue channels with live interactive preview, conversions, and one-click copying.
          </p>
        </div>
        <button
          onClick={handleRandomize}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Randomize RGB</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Channel Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Channel Controls</span>
            </h3>

            {/* Red Channel */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Red Channel (R)
                </span>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={r}
                  onChange={e => setR(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-xs"
                />
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={r}
                onChange={e => setR(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 bg-red-100 dark:bg-red-950/40"
              />
            </div>

            {/* Green Channel */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green Channel (G)
                </span>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={g}
                  onChange={e => setG(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-xs"
                />
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={g}
                onChange={e => setG(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-emerald-100 dark:bg-emerald-950/40"
              />
            </div>

            {/* Blue Channel */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Blue Channel (B)
                </span>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={b}
                  onChange={e => setB(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center font-bold text-xs"
                />
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={b}
                onChange={e => setB(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 bg-blue-100 dark:bg-blue-950/40"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Indigo', rgb: [79, 70, 229] },
                  { name: 'Emerald', rgb: [16, 185, 129] },
                  { name: 'Rose', rgb: [244, 63, 94] },
                  { name: 'Amber', rgb: [245, 158, 11] },
                  { name: 'Cyan', rgb: [6, 182, 212] },
                  { name: 'Dark Slate', rgb: [30, 41, 59] }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setR(preset.rgb[0]);
                      setG(preset.rgb[1]);
                      setB(preset.rgb[2]);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Values */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Box */}
          <div
            className="w-full h-52 rounded-3xl shadow-xl transition-colors duration-200 flex flex-col justify-between p-6 border border-white/20"
            style={{ backgroundColor: rgbString }}
          >
            <div className="flex justify-between items-start">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'bg-black/10 text-black/80' : 'bg-white/20 text-white'
                }`}
              >
                {isLight ? 'Light Background' : 'Dark Background'}
              </span>
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-widest font-mono font-bold block ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                RGB Output
              </span>
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {rgbString}
              </span>
            </div>
          </div>

          {/* Formats Card */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            {/* RGB */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">RGB</span>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{rgbString}</div>
              </div>
              <button
                onClick={() => copyToClipboard(rgbString, 'RGB')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedFormat === 'RGB' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>

            {/* HEX */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">HEX</span>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{hexValue}</div>
              </div>
              <button
                onClick={() => copyToClipboard(hexValue, 'HEX')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedFormat === 'HEX' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">HSL</span>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{hslString}</div>
              </div>
              <button
                onClick={() => copyToClipboard(hslString, 'HSL')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedFormat === 'HSL' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
