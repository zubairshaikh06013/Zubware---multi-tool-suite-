import React, { useState } from 'react';
import { Copy, Check, Sparkles, Smile, Star, Type, Box, Hash, Palette, RefreshCw } from 'lucide-react';

interface TextDecoratorToolProps {
  onShowToast: (msg: string) => void;
}

interface DecorationItem {
  id: string;
  name: string;
  category: 'sparkles' | 'frames' | 'aesthetic' | 'dividers' | 'kaomoji';
  wrap: (s: string) => string;
}

const DECORATIONS: DecorationItem[] = [
  // Sparkles & Stars
  { id: 'stars', name: 'Stars & Sparkles', category: 'sparkles', wrap: (s) => `✨⭐ ${s} ⭐✨` },
  { id: 'galaxy', name: 'Cosmic Galaxy', category: 'sparkles', wrap: (s) => `✦✧★ ${s} ★✧✦` },
  { id: 'magical', name: 'Magical Shimmer', category: 'sparkles', wrap: (s) => `｡･:*:･ﾟ★,｡･:*:･ﾟ☆ ${s} ☆ﾟ･:*:･｡,★ﾟ･:*:･｡` },
  { id: 'diamond', name: 'Diamond Crown', category: 'sparkles', wrap: (s) => `💎 ◆ ${s} ◆ 💎` },
  { id: 'sunshine', name: 'Sun & Stars', category: 'sparkles', wrap: (s) => `☀️ ⋆⁺₊⋆ ${s} ⋆⁺₊⋆ 🌙` },
  { id: 'shooting_stars', name: 'Shooting Stars', category: 'sparkles', wrap: (s) => `彡★ ${s} ★彡` },

  // Frames & Boxes
  { id: 'double_box', name: 'Double Border Box', category: 'frames', wrap: (s) => `╔═════════════════════════════╗\n║  ${s}  ║\n╚═════════════════════════════╝` },
  { id: 'round_corner', name: 'Rounded Corner Box', category: 'frames', wrap: (s) => `╭─────────────────────────────╮\n│  ${s}  │\n╰─────────────────────────────╯` },
  { id: 'classic_box', name: 'Single Border Box', category: 'frames', wrap: (s) => `┌─────────────────────────────┐\n│  ${s}  │\n└─────────────────────────────┘` },
  { id: 'thick_block', name: 'Bold Heavy Frame', category: 'frames', wrap: (s) => `▛▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▜\n▌  ${s}  ▐\n▙▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟` },
  { id: 'bracket_box', name: 'Corner Header', category: 'frames', wrap: (s) => `┌─── [ ${s} ] ───┐` },
  { id: 'dotted_box', name: 'Dotted Border', category: 'frames', wrap: (s) => `┊ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ┊\n┊   ${s}   ┊\n┊ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ┊` },

  // Aesthetic & Wings
  { id: 'wings', name: 'Angel Wings', category: 'aesthetic', wrap: (s) => `༺ ${s} ༻` },
  { id: 'bird_wings', name: 'Winged Crest', category: 'aesthetic', wrap: (s) => `꧁༺ ${s} ༻꧂` },
  { id: 'arrows', name: 'Pointer Arrows', category: 'aesthetic', wrap: (s) => `➽➔ ${s} ➔➽` },
  { id: 'minimal_dots', name: 'Minimal Dot Spacers', category: 'aesthetic', wrap: (s) => `· · · ${s} · · ·` },
  { id: 'heartbeat', name: 'Heart Pulse Line', category: 'aesthetic', wrap: (s) => `ﮩـﮩﮩـ ${s} ـﮩﮩـﮩ` },
  { id: 'royal_crown', name: 'Royal Crown', category: 'aesthetic', wrap: (s) => `👑 ⚜️ ${s} ⚜️ 👑` },
  { id: 'cross_stars', name: 'Cross Hatch Stars', category: 'aesthetic', wrap: (s) => `×º°”˜\`”°º× ${s} ×º°”˜\`”°º×` },

  // Dividers & Lines
  { id: 'divider_line', name: 'Classic Line Divider', category: 'dividers', wrap: (s) => `─── ❖ ─── [ ${s} ] ─── ❖ ───` },
  { id: 'wave_lines', name: 'Ocean Waves', category: 'dividers', wrap: (s) => `〰️〰️ ${s} 〰️〰️` },
  { id: 'chain_divider', name: 'Chain Pattern', category: 'dividers', wrap: (s) => `««———« ${s} »———»»` },
  { id: 'swirl_divider', name: 'Victorian Swirl', category: 'dividers', wrap: (s) => `𓊈 ${s} 𓊉` },
  { id: 'ribbon', name: 'Banner Ribbon', category: 'dividers', wrap: (s) => `•┈┈┈••✦ ${s} ✦••┈┈┈•` },
  { id: 'dashed', name: 'Dashed Arrow', category: 'dividers', wrap: (s) => `⫷⫷⫷ ${s} ⫸⫸⫸` },

  // Kaomoji & Cute
  { id: 'flower_garden', name: 'Floral Blossoms', category: 'kaomoji', wrap: (s) => `❀✿ ${s} ✿❀` },
  { id: 'cute_bear', name: 'Cute Bear Ears', category: 'kaomoji', wrap: (s) => `ʕ•́ᴥ•̀ʔっ♡ ${s} ♡` },
  { id: 'sparkly_eyes', name: 'Happy Cheers', category: 'kaomoji', wrap: (s) => `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${s} ✧ﾟ･:*` },
  { id: 'music_notes', name: 'Melody & Notes', category: 'kaomoji', wrap: (s) => `♪♫ ${s} ♫♪` },
  { id: 'butterfly', name: 'Spring Butterfly', category: 'kaomoji', wrap: (s) => `🦋 ੈ✩‧₊˚ ${s} ˚₊‧✩ੈ 🦋` },
  { id: 'cat_paws', name: 'Kitty Paws', category: 'kaomoji', wrap: (s) => `🐾 ( =^･ω･^= ) ${s} 🐾` }
];

const SYMBOL_PALETTE = ['✨', '⭐', '★', '☆', '✦', '✧', '❀', '✿', '༺', '༻', '꧁', '꧂', '👑', '💎', '🦋', '🌙', '☀️', '⚜️', '♡', '♥', '➔', '➽', '♪', '♫', '◆', '◇', '❖'];

export const TextDecoratorTool: React.FC<TextDecoratorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState('WELCOME TO MY PROFILE');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sparkles' | 'frames' | 'aesthetic' | 'dividers' | 'kaomoji'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDecorations = categoryFilter === 'all'
    ? DECORATIONS
    : DECORATIONS.filter(d => d.category === categoryFilter);

  const handleCopy = (text: string, id: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`Copied "${name}" decorated text!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsertSymbol = (sym: string) => {
    setInputText(prev => `${prev} ${sym}`);
    onShowToast(`Appended ${sym} to text`);
  };

  const transformCase = (type: 'upper' | 'lower' | 'title') => {
    if (type === 'upper') setInputText(inputText.toUpperCase());
    else if (type === 'lower') setInputText(inputText.toLowerCase());
    else if (type === 'title') {
      setInputText(inputText.replace(/\b\w/g, c => c.toUpperCase()));
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            Aesthetic Text Decorator & Bio Styler
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stylize your headlines, social bios, Instagram captions, and discord channel topics with cute frames, stars, and dividers.
          </p>
        </div>
      </div>

      {/* Input Box & Transform Tools */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Enter Your Text, Headline, or Bio Name:
          </label>
          {/* Quick Case Transforms */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Case:</span>
            <button
              onClick={() => transformCase('upper')}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              ABC
            </button>
            <button
              onClick={() => transformCase('title')}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Abc
            </button>
            <button
              onClick={() => transformCase('lower')}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              abc
            </button>
          </div>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. WELCOME TO MY CHANNEL"
          className="w-full px-4 py-3.5 text-base font-bold rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
        />

        {/* Click-to-Add Symbol Toolbar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-indigo-500" /> Click to Insert Symbol:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SYMBOL_PALETTE.map((sym) => (
              <button
                key={sym}
                onClick={() => handleInsertSymbol(sym)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:scale-110 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm flex items-center justify-center transition-all cursor-pointer"
                title={`Insert ${sym}`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: `All (${DECORATIONS.length})` },
          { key: 'sparkles', label: '✨ Sparkles & Stars' },
          { key: 'frames', label: '🔲 Frames & Boxes' },
          { key: 'aesthetic', label: '⚔️ Wings & Aesthetic' },
          { key: 'dividers', label: '➖ Dividers & Lines' },
          { key: 'kaomoji', label: '🌸 Cute & Kaomoji' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              categoryFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Decorated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDecorations.map((item) => {
          const formatted = item.wrap(inputText || 'Your Text Here');
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all shadow-sm group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white break-words whitespace-pre-wrap leading-relaxed select-all">
                  {formatted}
                </pre>
              </div>

              <button
                onClick={() => handleCopy(formatted, item.id, item.name)}
                className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Decoration'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
