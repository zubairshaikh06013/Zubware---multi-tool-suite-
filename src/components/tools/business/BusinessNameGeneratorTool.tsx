import React, { useState } from 'react';
import { Sparkles, Copy, Check, Heart, Building2, RefreshCw, Layers } from 'lucide-react';

interface BusinessNameGeneratorToolProps {
  onShowToast: (message: string) => void;
}

const INDUSTRY_VOCAB: Record<string, { prefixes: string[]; roots: string[]; suffixes: string[] }> = {
  tech: {
    prefixes: ['Next', 'Sync', 'Apex', 'Hyper', 'Cyber', 'Quantum', 'Cloud', 'Data', 'Omni', 'Velo'],
    roots: ['Logic', 'Stack', 'Wave', 'Core', 'Net', 'Pulse', 'Byte', 'Matrix', 'Nexus', 'Stream'],
    suffixes: ['Tech', 'Labs', 'Systems', 'Digital', 'Dynamics', 'Solutions', 'Soft', 'Works', 'AI', 'Group']
  },
  retail: {
    prefixes: ['Urban', 'Noble', 'Prime', 'Ever', 'Pure', 'Luxe', 'Aura', 'Select', 'Moda', 'Velvet'],
    roots: ['Market', 'Boutique', 'Haven', 'Goods', 'Vault', 'Corner', 'Craft', 'Guild', 'Cart', 'Hub'],
    suffixes: ['Co', 'Store', 'Collective', 'Supply', 'Emporium', 'Merchants', 'Living', 'Shop', 'House']
  },
  food: {
    prefixes: ['Golden', 'Rustic', 'Fresh', 'Savory', 'Sweet', 'Artisan', 'Copper', 'Urban', 'Harvest', 'Daily'],
    roots: ['Bite', 'Table', 'Spoon', 'Fork', 'Kitchen', 'Plate', 'Roast', 'Grain', 'Crust', 'Flavors'],
    suffixes: ['Eats', 'Cafe', 'Bistro', 'Kitchen', 'Grill', 'Co', 'Diner', 'Bakery', 'Brew', 'Lounge']
  },
  consulting: {
    prefixes: ['Vanguard', 'Strategic', 'Apex', 'Clear', 'Catalyst', 'Keystone', 'True', 'Pinnacle', 'Summit'],
    roots: ['Vision', 'Bridge', 'Insight', 'Path', 'Growth', 'Scale', 'Point', 'Advisory', 'Focus', 'Compass'],
    suffixes: ['Consulting', 'Partners', 'Group', 'Advisors', 'Capital', 'Associates', 'Strategies', 'LLC']
  },
  health: {
    prefixes: ['Vital', 'Pure', 'Nova', 'Aura', 'Well', 'Bio', 'Care', 'Life', 'Zen', 'Equilibrium'],
    roots: ['Pulse', 'Balance', 'Health', 'Span', 'Med', 'Harmony', 'Optima', 'Cure', 'Mind', 'Form'],
    suffixes: ['Wellness', 'Health', 'Care', 'Therapeutics', 'Clinic', 'Life', 'Rehab', 'Sanctuary', 'Institute']
  },
  finance: {
    prefixes: ['Sterling', 'Summit', 'Meridian', 'Apex', 'Trust', 'Noble', 'Anchor', 'Fortress', 'Crest'],
    roots: ['Wealth', 'Vest', 'Capital', 'Fund', 'Asset', 'Equity', 'Ledger', 'Yield', 'Vault', 'Fin'],
    suffixes: ['Financial', 'Wealth', 'Capital', 'Securities', 'Holdings', 'Advisors', 'Trust', 'Group']
  }
};

export const BusinessNameGeneratorTool: React.FC<BusinessNameGeneratorToolProps> = ({ onShowToast }) => {
  const [keyword, setKeyword] = useState<string>('Apex');
  const [industry, setIndustry] = useState<string>('tech');
  const [style, setStyle] = useState<string>('modern');
  const [location, setLocation] = useState<string>('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([
    'Apex Logic Labs',
    'Apex Cloud Dynamics',
    'Quantum Apex Systems',
    'Next Apex Digital',
    'Apex Wave Solutions',
    'Hyper Apex Works',
    'Apex Core Technologies',
    'Omni Apex Group'
  ]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const generateNames = () => {
    const vocab = INDUSTRY_VOCAB[industry] || INDUSTRY_VOCAB.tech;
    const cleanKw = keyword.trim() || 'Nova';
    const locClean = location.trim();
    const results = new Set<string>();

    // Template 1: [Prefix] + [Keyword] + [Suffix]
    vocab.prefixes.forEach(p => {
      vocab.suffixes.slice(0, 3).forEach(s => {
        results.add(`${p} ${cleanKw} ${s}`);
      });
    });

    // Template 2: [Keyword] + [Root] + [Suffix]
    vocab.roots.forEach(r => {
      vocab.suffixes.slice(0, 3).forEach(s => {
        results.add(`${cleanKw} ${r} ${s}`);
      });
    });

    // Template 3: Location based if present
    if (locClean) {
      results.add(`${locClean} ${cleanKw} ${vocab.suffixes[0]}`);
      results.add(`${cleanKw} ${vocab.roots[0]} of ${locClean}`);
      results.add(`${cleanKw} ${locClean} ${vocab.suffixes[1] || 'Group'}`);
    }

    // Template 4: Style nuances
    if (style === 'minimalist') {
      vocab.roots.forEach(r => results.add(`${cleanKw} ${r}`));
      vocab.prefixes.forEach(p => results.add(`${p} ${cleanKw}`));
    } else if (style === 'professional') {
      results.add(`${cleanKw} & Partners`);
      results.add(`${cleanKw} Advisory Group`);
      results.add(`${cleanKw} Global Solutions`);
    }

    const shuffled = Array.from(results).sort(() => 0.5 - Math.random()).slice(0, 12);
    setGeneratedNames(shuffled);
    onShowToast(`Generated ${shuffled.length} business names!`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedName(text);
    onShowToast(`Copied "${text}"`);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generatedNames.join('\n'));
    onShowToast('Copied all generated business names to clipboard!');
  };

  const toggleFavorite = (name: string) => {
    if (favorites.includes(name)) {
      setFavorites(favorites.filter(f => f !== name));
      onShowToast(`Removed "${name}" from favorites`);
    } else {
      setFavorites([...favorites, name]);
      onShowToast(`Saved "${name}" to favorites ❤️`);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏢</span> Business Name Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate memorable, professional business names tailored to your industry, tone, and keywords.
          </p>
        </div>
        <button
          onClick={generateNames}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Ideas</span>
        </button>
      </div>

      {/* Input Options */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-6">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span>Business Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Keyword / Concept</label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="e.g. Apex, Cloud, Bloom..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry / Niche</label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="tech">Technology & Software</option>
              <option value="retail">Retail & E-commerce</option>
              <option value="food">Food, Cafe & Restaurant</option>
              <option value="consulting">Consulting & Advisory</option>
              <option value="health">Health & Wellness</option>
              <option value="finance">Finance & Investment</option>
            </select>
          </div>

          {/* Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Style / Tone</label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="modern">Modern & Innovative</option>
              <option value="professional">Corporate & Professional</option>
              <option value="minimalist">Short & Minimalist</option>
            </select>
          </div>

          {/* Optional Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Austin, London, Global..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>
        </div>
      </div>

      {/* Generated Names Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Generated Business Names ({generatedNames.length})</span>
          </h3>
          <button
            onClick={copyAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedNames.map((name, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/40 transition-all shadow-sm"
            >
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFavorite(name)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    favorites.includes(name) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                  }`}
                  title="Save favorite"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => copyToClipboard(name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  title="Copy name"
                >
                  {copiedName === name ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites Panel */}
      {favorites.length > 0 && (
        <div className="glass-card p-6 rounded-3xl space-y-3 border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved Favorites ({favorites.length})</span>
            </span>
            <button
              onClick={() => setFavorites([])}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium"
            >
              Clear Favorites
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
