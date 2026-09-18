import React, { useState, useEffect } from 'react';
import { getTranslatedTools } from '../../data/toolsData';
import { CATEGORIES_DATA, CategoryItem } from '../../data/categoriesData';
import { useLanguage } from '../../context/LanguageContext';
import { getLinkUrl } from '../../lib/paths';
import { toggleFavorite, isFavorite } from '../../lib/userStore';
import { ArrowRight, CheckCircle2, Star, Filter, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  categorySlug?: string;
  onNavigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onNavigate,
  onShowToast,
}) => {
  const { currentLang, t } = useLanguage();
  const allTools = getTranslatedTools(currentLang);

  const [activeCategory, setActiveCategory] = useState<string>(categorySlug || 'all');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    } else {
      setActiveCategory('all');
    }
  }, [categorySlug]);

  const activeCategoryMeta = CATEGORIES_DATA.find((c) => c.slug === activeCategory) || CATEGORIES_DATA[0];

  // Filter tools by active category
  const filteredTools = allTools.filter((tool) => activeCategoryMeta.match(tool.category));

  // Extract all tags from filtered tools
  const allTags = Array.from(
    new Set(filteredTools.flatMap((tool) => tool.tags || []))
  );

  const finalTools = filteredTools.filter((tool) => {
    if (selectedTag === 'All') return true;
    return tool.tags && tool.tags.includes(selectedTag);
  });

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    setSelectedTag('All');
    const path = slug === 'all' ? '/categories.html' : `/categories.html?cat=${slug}`;
    onNavigate(getLinkUrl(path));
  };

  const handleToggleFav = (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(id);
    onShowToast(added ? t('addedFavorite', 'Added to favorites!') : t('removedFavorite', 'Removed from favorites'));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* Category Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Zubware Multi-Tool Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('toolCategories', 'Tool Categories & Directory')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('categoriesSubtitle', 'Browse hundreds of browser-based utilities organized by domain with zero installation and 100% private offline processing.')}
        </p>
      </div>

      {/* Category Selection Tabs */}
      <nav aria-label="Tool Categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_DATA.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const translatedName = t(cat.nameKey, cat.defaultName);
          return (
            <button
              key={cat.slug}
              onClick={() => handleSelectCategory(cat.slug)}
              aria-label={`Category ${translatedName}`}
              aria-current={isActive ? 'page' : undefined}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
              }`}
            >
              <span aria-hidden="true">{cat.icon}</span>
              <span>{translatedName}</span>
            </button>
          );
        })}
      </nav>

      {/* Tags Filter Pill List */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-xs" role="toolbar" aria-label="Tag filter">
          <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            aria-label="Filter by all tags"
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              selectedTag === 'All'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold'
                : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({filteredTools.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              aria-label={`Filter by tag ${tag}`}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalTools.map((tool) => {
          const fav = isFavorite(tool.id);
          return (
            <div
              key={tool.id}
              role="button"
              tabIndex={0}
              aria-label={`Open ${tool.title}`}
              onClick={() => onNavigate(getLinkUrl(tool.path))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(getLinkUrl(tool.path));
                }
              }}
              className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleFav(tool.id, e)}
                      aria-label={fav ? `Remove ${tool.title} from favorites` : `Add ${tool.title} to favorites`}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        fav
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                      }`}
                      title={fav ? 'Remove Favorite' : 'Add to Favorite'}
                    >
                      <Star className={`w-4 h-4 ${fav ? 'fill-amber-500' : ''}`} aria-hidden="true" />
                    </button>
                    {tool.badge && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tool.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {tool.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(getLinkUrl(tool.path));
                  }}
                  aria-label={`Open tool ${tool.navTitle}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                >
                  <span>{t('openTool', 'Open')} {tool.navTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

