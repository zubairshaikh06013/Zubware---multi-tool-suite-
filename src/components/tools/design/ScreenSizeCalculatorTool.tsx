import React, { useState } from 'react';
import { Monitor, Smartphone, Tv, Copy, Check } from 'lucide-react';

interface ScreenSizeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const PRESET_RESOLUTIONS = [
  { name: '4K UHD (3840 x 2160)', w: 3840, h: 2160, aspect: '16:9' },
  { name: '1440p QHD (2560 x 1440)', w: 2560, h: 1440, aspect: '16:9' },
  { name: '1080p Full HD (1920 x 1080)', w: 1920, h: 1080, aspect: '16:9' },
  { name: 'Ultrawide 1440p (3440 x 1440)', w: 3440, h: 1440, aspect: '21:9' },
  { name: 'MacBook 16" (3456 x 2234)', w: 3456, h: 2234, aspect: '16:10' },
  { name: 'iPhone 15 Pro (2556 x 1179)', w: 1179, h: 2556, aspect: '19.5:9' }
];

export const ScreenSizeCalculatorTool: React.FC<ScreenSizeCalculatorToolProps> = ({ onShowToast }) => {
  const [diagonalInches, setDiagonalInches] = useState<number>(27);
  const [aspectW, setAspectW] = useState<number>(16);
  const [aspectH, setAspectH] = useState<number>(9);
  const [resW, setResW] = useState<number>(2560);
  const [resH, setResH] = useState<number>(1440);
  const [copied, setCopied] = useState<boolean>(false);

  // Geometric calculations:
  // d^2 = w^2 + h^2
  // w = d * (aspectW / sqrt(aspectW^2 + aspectH^2))
  // h = d * (aspectH / sqrt(aspectW^2 + aspectH^2))
  const diagonalRatio = Math.sqrt(Math.pow(aspectW, 2) + Math.pow(aspectH, 2));
  const widthInches = (diagonalInches * aspectW) / diagonalRatio;
  const heightInches = (diagonalInches * aspectH) / diagonalRatio;

  const widthCm = widthInches * 2.54;
  const heightCm = heightInches * 2.54;
  const areaSqInches = widthInches * heightInches;
  const areaSqCm = widthCm * heightCm;

  // Pixels Per Inch (PPI):
  // PPI = sqrt(resW^2 + resH^2) / diagonalInches
  const ppi = diagonalInches > 0 ? Math.sqrt(Math.pow(resW, 2) + Math.pow(resH, 2)) / diagonalInches : 0;
  const totalMegapixels = ((resW * resH) / 1000000).toFixed(2);

  const copySpecs = () => {
    const text = `${diagonalInches}" Display (${aspectW}:${aspectH}): ${widthInches.toFixed(1)}W x ${heightInches.toFixed(1)}H inches, ${ppi.toFixed(0)} PPI (${resW}x${resH})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied screen specifications!');
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: typeof PRESET_RESOLUTIONS[0], defaultDiag: number) => {
    setResW(preset.w);
    setResH(preset.h);
    if (preset.aspect === '16:9') {
      setAspectW(16);
      setAspectH(9);
    } else if (preset.aspect === '21:9') {
      setAspectW(21);
      setAspectH(9);
    } else if (preset.aspect === '16:10') {
      setAspectW(16);
      setAspectH(10);
    } else if (preset.aspect === '19.5:9') {
      setAspectW(9);
      setAspectH(19.5);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🖥️</span> Screen Dimensions & PPI Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate physical monitor width, height, surface area, and pixel density (PPI) from diagonal size and aspect ratio.
          </p>
        </div>
        <button
          onClick={copySpecs}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Specs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span>Display Diagonal & Aspect Ratio</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Diagonal Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Diagonal (Inches)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                step="0.5"
                value={diagonalInches}
                onChange={e => setDiagonalInches(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Aspect Ratio Width */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Aspect Width
              </label>
              <input
                type="number"
                min="1"
                value={aspectW}
                onChange={e => setAspectW(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Aspect Ratio Height */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Aspect Height
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={aspectH}
                onChange={e => setAspectH(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Resolution Presets (for PPI calculation):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_RESOLUTIONS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p, 27)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-indigo-600 font-mono">{p.w} x {p.h}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Physical Dimensions
            </span>

            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {widthInches.toFixed(1)}&quot; × {heightInches.toFixed(1)}&quot;
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {widthCm.toFixed(1)} cm × {heightCm.toFixed(1)} cm
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Pixel Density:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {ppi.toFixed(1)} PPI
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Display Area:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {areaSqInches.toFixed(1)} sq in ({areaSqCm.toFixed(0)} cm²)
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Resolution:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {resW} × {resH} ({totalMegapixels} MP)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
