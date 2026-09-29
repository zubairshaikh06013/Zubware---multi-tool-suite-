import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Layers, Sliders, Code2 } from 'lucide-react';

interface CssClipPathGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface ShapePreset {
  name: string;
  category: 'Geometric' | 'Arrows & Badges' | 'Curves' | 'Symbols';
  type: 'polygon' | 'circle' | 'ellipse' | 'inset';
  code: string;
}

const SHAPE_PRESETS: ShapePreset[] = [
  // Geometric
  { name: 'Triangle', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { name: 'Inverted Triangle', category: 'Geometric', type: 'polygon', code: 'polygon(0% 0%, 100% 0%, 50% 100%)' },
  { name: 'Trapezoid', category: 'Geometric', type: 'polygon', code: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
  { name: 'Parallelogram', category: 'Geometric', type: 'polygon', code: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
  { name: 'Rhombus', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { name: 'Pentagon', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { name: 'Hexagon', category: 'Geometric', type: 'polygon', code: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  { name: 'Heptagon', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)' },
  { name: 'Octagon', category: 'Geometric', type: 'polygon', code: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  { name: 'Nonagon', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)' },
  { name: 'Decagon', category: 'Geometric', type: 'polygon', code: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)' },
  
  // Arrows & Badges
  { name: 'Arrow Right', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
  { name: 'Arrow Left', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)' },
  { name: 'Chevron Right', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)' },
  { name: 'Chevron Left', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)' },
  { name: 'Message Bubble', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
  { name: 'Badge Ribbon', category: 'Arrows & Badges', type: 'polygon', code: 'polygon(100% 0%, 100% 100%, 50% 85%, 0% 100%, 0% 0%)' },

  // Symbols
  { name: '5-Point Star', category: 'Symbols', type: 'polygon', code: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { name: '4-Point Star', category: 'Symbols', type: 'polygon', code: 'polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)' },
  { name: 'Plus Cross', category: 'Symbols', type: 'polygon', code: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)' },
  { name: 'Close X', category: 'Symbols', type: 'polygon', code: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)' },

  // Curves
  { name: 'Circle', category: 'Curves', type: 'circle', code: 'circle(50% at 50% 50%)' },
  { name: 'Ellipse Wide', category: 'Curves', type: 'ellipse', code: 'ellipse(50% 35% at 50% 50%)' },
  { name: 'Inset Rounded Box', category: 'Curves', type: 'inset', code: 'inset(10% 15% 10% 15% round 24px)' },
];

const PREVIEW_BACKGROUNDS = [
  { name: 'Sunset Gradient', class: 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500' },
  { name: 'Ocean Cyan', class: 'bg-gradient-to-tr from-emerald-400 via-cyan-500 to-blue-600' },
  { name: 'Amber Fire', class: 'bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-400' },
  { name: 'Cyberpunk Neon', class: 'bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-rose-400' },
  { name: 'Solid Indigo', class: 'bg-indigo-600' }
];

export const CssClipPathGeneratorTool: React.FC<CssClipPathGeneratorToolProps> = ({ onShowToast }) => {
  const [selectedShape, setSelectedShape] = useState<ShapePreset>(SHAPE_PRESETS[0]);
  const [customCode, setCustomCode] = useState<string>(SHAPE_PRESETS[0].code);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bgStyle, setBgStyle] = useState<string>(PREVIEW_BACKGROUNDS[0].class);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = ['All', 'Geometric', 'Arrows & Badges', 'Symbols', 'Curves'];

  const handleSelectShape = (shape: ShapePreset) => {
    setSelectedShape(shape);
    setCustomCode(shape.code);
  };

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredPresets = SHAPE_PRESETS.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>✂️</span> CSS Clip-Path Generator & Shape Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build responsive CSS polygons, stars, chevrons, circles, and custom vector masks with multi-framework exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => copyToClipboard(`clip-path: ${customCode};\n-webkit-clip-path: ${customCode};`, 'css', 'CSS Clip-Path')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copiedKey === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy CSS</span>
          </button>

          <button
            onClick={() => copyToClipboard(`[clip-path:${customCode.replace(/\s+/g, '_')}]`, 'tw', 'Tailwind Class')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copiedKey === 'tw' ? <Check className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>Copy Tailwind</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Preview Box */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="w-full h-80 sm:h-96 rounded-3xl bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden border border-slate-800 shadow-2xl">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            <div
              className={`w-60 h-60 sm:w-72 sm:h-72 ${bgStyle} transition-all duration-300 shadow-2xl flex items-center justify-center text-white font-extrabold text-sm tracking-wider select-none`}
              style={{ clipPath: customCode, WebkitClipPath: customCode }}
            >
              <span className="drop-shadow-md bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {selectedShape.name}
              </span>
            </div>
          </div>

          {/* Background Style Switcher */}
          <div className="flex items-center justify-between text-xs px-2">
            <span className="font-semibold text-slate-500">Preview Fill:</span>
            <div className="flex gap-1.5">
              {PREVIEW_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setBgStyle(bg.class)}
                  className={`w-6 h-6 rounded-full border-2 ${bg.class} transition-transform ${
                    bgStyle === bg.class ? 'scale-125 border-white ring-2 ring-indigo-500' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  title={bg.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Code Output Formats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Standard CSS Rule
              </label>
              <button
                onClick={() => copyToClipboard(`clip-path: ${customCode};\n-webkit-clip-path: ${customCode};`, 'code', 'CSS')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <textarea
              value={`clip-path: ${customCode};\n-webkit-clip-path: ${customCode};`}
              readOnly
              rows={3}
              className="w-full p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs outline-none border border-slate-800"
            />
          </div>

          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Tailwind CSS Class
              </label>
              <button
                onClick={() => copyToClipboard(`[clip-path:${customCode.replace(/\s+/g, '_')}]`, 'twcode', 'Tailwind')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <textarea
              value={`[clip-path:${customCode.replace(/\s+/g, '_')}]`}
              readOnly
              rows={2}
              className="w-full p-3 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs outline-none border border-slate-800"
            />
          </div>

          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                React Inline Style
              </label>
              <button
                onClick={() => copyToClipboard(`style={{ clipPath: '${customCode}', WebkitClipPath: '${customCode}' }}`, 'react', 'React Style')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <textarea
              value={`style={{ clipPath: '${customCode}', WebkitClipPath: '${customCode}' }}`}
              readOnly
              rows={2}
              className="w-full p-3 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs outline-none border border-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Preset Shapes Selector Grid */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Shape Presets ({filteredPresets.length})
          </h3>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectShape(preset)}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                selectedShape.name === preset.name
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg scale-105'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              <div
                className="w-12 h-12 bg-current opacity-85 shadow-inner"
                style={{ clipPath: preset.code, WebkitClipPath: preset.code }}
              />
              <span className="text-center line-clamp-1">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
