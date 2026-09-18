import React, { useState } from 'react';
import { Sparkles, Copy, Check, Heart, RefreshCw, Zap, Bookmark } from 'lucide-react';

interface BrandNameGeneratorToolProps {
  onShowToast: (message: string) => void;
}

const BRAND_PATTERNS = {
  invented: ['ora', 'ify', 'ly', 'io', 'ex', 'is', 'ix', 'ia', 'on', 'um', 'os', 'us', 'ava', 'iva'],
  modern: ['Go', 'Up', 'Next', 'Neo', 'Hyper', 'True', 'Zen', 'Pure', 'Omni', 'Verve', 'Flux'],
  blended: ['Flow', 'Wave', 'Pulse', 'Craft', 'Spark', 'Base', 'Vault', 'Point', 'Sync', 'Grid']
};

export const BrandNameGeneratorTool: React.FC<BrandNameGeneratorToolProps> = ({ onShowToast }) => {
  const [keyword, setKeyword] = useState<string>('Lumi');
  const [style, setStyle] = useState<'invented' | 'modern' | 'compound' | 'luxury'>('invented');
  const [lengthPref, setLengthPref] = useState<'all' | 'short' | 'medium'>('all');
  const [generatedBrands, setGeneratedBrands] = useState<string[]>([
    'Lumiora',
    'LumiSync',
    'LumiZen',
    'LumiVerve',
    'Lumio',
    'Lumify',
    'LumiPulse',
    'NeoLumi',
    'LumiSpark',
    'Lumix'
  ]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedBrand, setCopiedBrand] = useState<string | null>(null);

  const generateBrands = () => {
    const raw = keyword.trim().toLowerCase() || 'lumi';
    const capKw = raw.charAt(0).toUpperCase() + raw.slice(1);
    const results = new Set<string>();

    if (style === 'invented') {
      BRAND_PATTERNS.invented.forEach(suffix => {
        results.add(`${capKw}${suffix}`);
        results.add(`${capKw.slice(0, 3)}${suffix}`);
      });
    } else if (style === 'modern') {
      BRAND_PATTERNS.modern.forEach(prefix => {
        results.add(`${prefix}${capKw}`);
        results.add(`${capKw}${prefix}`);
      });
      BRAND_PATTERNS.invented.slice(0, 6).forEach(suffix => {
        results.add(`${capKw}${suffix}`);
      });
    } else if (style === 'compound') {
      BRAND_PATTERNS.blended.forEach(word => {
        results.add(`${capKw}${word}`);
        results.add(`${word}${capKw}`);
      });
    } else if (style === 'luxury') {
      ['Maison', 'Atelier', 'Aura', 'Veloce', 'Monde', 'Privé', 'Bespoke'].forEach(lux => {
        results.add(`${capKw} ${lux}`);
        results.add(`${lux} ${capKw}`);
        results.add(`${capKw}ora`);
      });
    }

    // Filter by length if requested
    let list = Array.from(results);
    if (lengthPref === 'short') {
      list = list.filter(b => b.replace(/\s+/g, '').length <= 7);
    } else if (lengthPref === 'medium') {
      list = list.filter(b => b.replace(/\s+/g, '').length >= 7 && b.replace(/\s+/g, '').length <= 11);
    }

    const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 15);
    setGeneratedBrands(shuffled.length ? shuffled : Array.from(results).slice(0, 12));
    onShowToast(`Generated ${shuffled.length} brand concepts!`);
  };

  const copyToClipboard = (brand: string) => {
    navigator.clipboard.writeText(brand);
    setCopiedBrand(brand);
    onShowToast(`Copied brand: "${brand}"`);
    setTimeout(() => setCopiedBrand(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generatedBrands.join('\n'));
    onShowToast('Copied all brand names to clipboard!');
  };

  const toggleFavorite = (brand: string) => {
    if (favorites.includes(brand)) {
      setFavorites(favorites.filter(b => b !== brand));
      onShowToast(`Removed "${brand}" from favorites`);
    } else {
      setFavorites([...favorites, brand]);
      onShowToast(`Saved "${brand}" to favorites ❤️`);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✨</span> Brand Name Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create catchy, brandable, invented one-word and modern startup brand names for your new venture.
          </p>
        </div>
        <button
          onClick={generateBrands}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Brands</span>
        </button>
      </div>

      {/* Control Panel */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span>Brand Formulation Engine</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Keyword Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Seed Word / Root</label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="e.g. Nova, Velo, Zen, Cloud..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>

          {/* Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Vibe & Style</label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="invented">Invented & Catchy (e.g. Spotify, Lumio)</option>
              <option value="modern">Modern Startup (e.g. NeoLumi, Veloce)</option>
              <option value="compound">Compound Words (e.g. FlowCraft, WavePoint)</option>
              <option value="luxury">Luxury & Premium (e.g. Atelier Lumi)</option>
            </select>
          </div>

          {/* Length Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Length Preference</label>
            <select
              value={lengthPref}
              onChange={e => setLengthPref(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">Any Length</option>
              <option value="short">Short (&le; 7 letters)</option>
              <option value="medium">Medium (7–11 letters)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Brand Name Ideas ({generatedBrands.length})</span>
          </h3>
          <button
            onClick={copyAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy All</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {generatedBrands.map((brand, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-md transition-all group"
            >
              <span className="font-black text-slate-900 dark:text-white text-base truncate mb-3">
                {brand}
              </span>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => toggleFavorite(brand)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    favorites.includes(brand) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                  }`}
                  title="Save"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => copyToClipboard(brand)}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  title="Copy"
                >
                  {copiedBrand === brand ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="glass-card p-6 rounded-3xl space-y-3 border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved Brand Favorites ({favorites.length})</span>
            </span>
            <button
              onClick={() => setFavorites([])}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/20 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                {fav}
                <button
                  onClick={() => toggleFavorite(fav)}
                  className="text-slate-400 hover:text-rose-500 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
