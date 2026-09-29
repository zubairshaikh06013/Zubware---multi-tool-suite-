import React, { useState, useMemo } from 'react';
import { SKILL_LIBRARY } from '../../../data/careerData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { 
  Search, 
  Plus, 
  Check, 
  Lightbulb, 
  Copy, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Tag 
} from 'lucide-react';

interface SelectedSkill {
  name: string;
  category: string;
  level: number; // 0 to 100
}

export const ProfessionalSkillLibraryTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [resume, setResume] = useState(() => getActiveResume());
  const [selectedBasket, setSelectedBasket] = useState<SelectedSkill[]>([]);
  const [customSkillName, setCustomSkillName] = useState<string>('');
  const [defaultProficiency, setDefaultProficiency] = useState<number>(85);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', ...SKILL_LIBRARY.map(s => s.category)];
  const activeSkillNames = useMemo(() => new Set((resume.skills || []).map(s => s.name.toLowerCase())), [resume]);
  const basketNames = useMemo(() => new Set(selectedBasket.map(s => s.name.toLowerCase())), [selectedBasket]);

  // Toggle basket item
  const handleToggleBasket = (skillName: string, category: string) => {
    if (basketNames.has(skillName.toLowerCase())) {
      setSelectedBasket(prev => prev.filter(s => s.name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSelectedBasket(prev => [...prev, { name: skillName, category, level: defaultProficiency }]);
    }
  };

  // Add directly to active resume
  const handleAddDirectToResume = (skillName: string) => {
    const current = getActiveResume();
    if (activeSkillNames.has(skillName.toLowerCase())) {
      onShowToast(`"${skillName}" is already in your active resume!`);
      return;
    }
    const updatedSkills = [...(current.skills || []), { id: `skill_${Date.now()}_${Math.random()}`, name: skillName, level: defaultProficiency }];
    const updated = { ...current, skills: updatedSkills };
    saveActiveResume(updated);
    setResume(updated);
    onShowToast(`Added "${skillName}" to active resume skills!`);
  };

  // Add all basket skills to active resume
  const handleAddBasketToResume = () => {
    if (selectedBasket.length === 0) return;
    const current = getActiveResume();
    const existing = new Set((current.skills || []).map(s => s.name.toLowerCase()));
    const newItems = selectedBasket.filter(s => !existing.has(s.name.toLowerCase())).map(s => ({
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: s.name,
      level: s.level
    }));

    if (newItems.length === 0) {
      onShowToast('All basket skills are already in your active resume.');
      return;
    }

    const updated = {
      ...current,
      skills: [...(current.skills || []), ...newItems]
    };
    saveActiveResume(updated);
    setResume(updated);
    onShowToast(`Successfully added ${newItems.length} skills to active resume!`);
  };

  // Add custom skill
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    const name = customSkillName.trim();
    handleToggleBasket(name, 'Custom');
    setCustomSkillName('');
    onShowToast(`Added "${name}" to skills basket!`);
  };

  // Copy formats
  const handleCopyCommaSeparated = () => {
    if (selectedBasket.length === 0) return;
    const text = selectedBasket.map(s => s.name).join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied skills as comma-separated list!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBullets = () => {
    if (selectedBasket.length === 0) return;
    const text = selectedBasket.map(s => `• ${s.name} (${s.level}% proficiency)`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied skills as bullet list!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (selectedBasket.length === 0) return;
    const data = JSON.stringify(selectedBasket, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_skills.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded skills JSON file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" /> Professional Skills & Competency Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse 500+ categorized industry skill keywords, compile targeted skill sets, and sync directly with your resume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Active Resume Skills: <span className="text-indigo-600 font-mono font-black">{resume.skills?.length || 0}</span>
          </span>
        </div>
      </div>

      {/* Selected Basket Toolbar (if any selected) */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Selected Skill Basket ({selectedBasket.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyCommaSeparated}
              disabled={selectedBasket.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Comma-Separated</span>
            </button>

            <button
              onClick={handleCopyBullets}
              disabled={selectedBasket.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Bullets</span>
            </button>

            <button
              onClick={handleDownloadJson}
              disabled={selectedBasket.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleAddBasketToResume}
              disabled={selectedBasket.length === 0}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sync to Active Resume</span>
            </button>

            {selectedBasket.length > 0 && (
              <button
                onClick={() => setSelectedBasket([])}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                title="Clear Basket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {selectedBasket.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Click any skill tag below to add it to your working basket.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedBasket.map(s => (
              <span
                key={s.name}
                onClick={() => handleToggleBasket(s.name, s.category)}
                className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-rose-600 transition-colors shadow-sm group"
                title="Click to remove"
              >
                <span>{s.name}</span>
                <span className="text-[10px] opacity-75 group-hover:hidden">({s.level}%)</span>
                <span className="hidden group-hover:inline text-[10px]">✕</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Add Custom Skill */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 500+ skills (e.g. React, Kubernetes, Financial Modeling, Figma)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <form onSubmit={handleAddCustom} className="md:col-span-6 flex gap-2">
          <input
            type="text"
            value={customSkillName}
            onChange={(e) => setCustomSkillName(e.target.value)}
            placeholder="Add custom skill term..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom</span>
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Groups */}
      <div className="space-y-5">
        {SKILL_LIBRARY.filter(catGroup => selectedCat === 'All' || catGroup.category === selectedCat).map((catGroup) => {
          const filteredSkills = catGroup.skills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
          if (filteredSkills.length === 0) return null;

          return (
            <div key={catGroup.category} className="glass-card p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {catGroup.category}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{filteredSkills.length} terms</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((sk) => {
                  const inBasket = basketNames.has(sk.name.toLowerCase());
                  const inResume = activeSkillNames.has(sk.name.toLowerCase());

                  return (
                    <button
                      key={sk.name}
                      onClick={() => handleToggleBasket(sk.name, catGroup.category)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        inBasket
                          ? 'bg-indigo-600 text-white border border-indigo-600 shadow-sm scale-105'
                          : inResume
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {inBasket ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : inResume ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 opacity-40" />
                      )}
                      <span>{sk.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
