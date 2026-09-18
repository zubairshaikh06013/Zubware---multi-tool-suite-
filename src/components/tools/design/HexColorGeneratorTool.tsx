import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Palette, Check, Sparkles, Sliders } from 'lucide-react';

interface HexColorGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const HexColorGeneratorTool: React.FC<HexColorGeneratorToolProps> = ({ onShowToast }) => {
  const [hex, setHex] = useState<string>('#4F46E5');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Convert HEX to RGB
  const hexToRgb = (h: string) => {
    const clean = h.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
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

  const generateRandomHex = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateNewColor = () => {
    const newHex = generateRandomHex();
    setHex(newHex);
    setHistory(prev => [newHex, ...prev.filter(c => c !== newHex)].slice(0, 8));
    generatePalette(newHex);
    onShowToast(`Generated HEX: ${newHex}`);
  };

  const generatePalette = (baseHex: string) => {
    const { r, g, b } = hexToRgb(baseHex);
    const { h, s, l } = rgbToHsl(r, g, b);
    // Generate harmonious variations (monochromatic / analogous)
    const offsets = [-30, -15, 0, 15, 30];
    const newPalette = offsets.map(off => {
      const newH = (h + off + 360) % 360;
      return hslToHex(newH, s, Math.min(90, Math.max(15, l + (off === 0 ? 0 : (off > 0 ? 8 : -8)))));
    });
    setPalette(newPalette);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  useEffect(() => {
    generatePalette(hex);
  }, []);

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copyToClipboard = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    onShowToast(`Copied ${formatName}: ${text}`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Determine text contrast
  const isLight = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 128;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span> HEX Color Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate random HEX colors instantly with live preview, RGB/HSL conversion, and palette variations.
          </p>
        </div>
        <button
          onClick={generateNewColor}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate New Color</span>
        </button>
      </div>

      {/* Hero Color Preview Card */}
      <div
        className="relative w-full h-64 sm:h-80 rounded-3xl shadow-xl transition-colors duration-300 flex flex-col justify-between p-6 sm:p-8 border border-white/20"
        style={{ backgroundColor: hex }}
      >
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isLight ? 'bg-black/10 text-black/80' : 'bg-white/20 text-white'
            }`}
          >
            {isLight ? 'Light Tone' : 'Dark Tone'}
          </span>
          <button
            onClick={() => copyToClipboard(hex, 'HEX')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              isLight
                ? 'bg-black/10 hover:bg-black/20 text-black'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {copiedFormat === 'HEX' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy HEX</span>
          </button>
        </div>

        <div>
          <span className={`text-xs uppercase tracking-widest font-mono font-bold block ${isLight ? 'text-black/60' : 'text-white/60'}`}>
            Active Color
          </span>
          <span
            className={`text-4xl sm:text-6xl font-black font-mono tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {hex}
          </span>
        </div>
      </div>

      {/* Color Formats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* HEX */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HEX Code</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">{hex}</div>
          </div>
          <button
            onClick={() => copyToClipboard(hex, 'HEX')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Copy HEX"
          >
            {copiedFormat === 'HEX' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* RGB */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RGB Format</span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">{rgbString}</div>
          </div>
          <button
            onClick={() => copyToClipboard(rgbString, 'RGB')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Copy RGB"
          >
            {copiedFormat === 'RGB' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* HSL */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HSL Format</span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">{hslString}</div>
          </div>
          <button
            onClick={() => copyToClipboard(hslString, 'HSL')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Copy HSL"
          >
            {copiedFormat === 'HSL' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Harmonious Palette Variations */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-500" />
            <span>Harmonious Color Palette</span>
          </h3>
          <span className="text-xs text-slate-400">Click any shade to inspect</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {palette.map((color, idx) => (
            <div
              key={idx}
              onClick={() => {
                setHex(color);
                onShowToast(`Selected ${color}`);
              }}
              className="group cursor-pointer flex flex-col items-center space-y-2"
            >
              <div
                className="w-full h-16 sm:h-20 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600">
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Recent:</span>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => setHex(h)}
                className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: h }}
                title={h}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
