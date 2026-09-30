import React, { useState, useEffect, useMemo } from 'react';
import { getTranslatedTools, TOOLS_DATA } from '../../data/toolsData';
import { CATEGORIES_DATA, CategoryItem } from '../../data/categoriesData';
import { CATEGORY_AUTHORITY_MAP } from '../../data/categoryAuthorityData';
import { BLOG_ARTICLES } from '../../data/blogArticles';
import { useLanguage } from '../../context/LanguageContext';
import { getLinkUrl } from '../../lib/paths';
import { toggleFavorite, isFavorite } from '../../lib/userStore';
import { ArrowRight, CheckCircle2, Star, Filter, Sparkles, BookOpen, ChevronDown, Layers, HelpCircle } from 'lucide-react';
import { SEOHead } from '../SEOHead';
import { Breadcrumb } from '../Breadcrumb';
import { ToolIcon } from '../common/ToolIcon';

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    } else {
      setActiveCategory('all');
    }
  }, [categorySlug]);

  const activeCategoryMeta = CATEGORIES_DATA.find((c) => c.slug === activeCategory) || CATEGORIES_DATA[0];
  const authMeta = CATEGORY_AUTHORITY_MAP[activeCategory];

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (activeCategory === 'all') {
      return [
        { label: 'Home', path: getLinkUrl('/') },
        { label: 'Tool Categories Directory' }
      ];
    }
    return [
      { label: 'Home', path: getLinkUrl('/') },
      { label: 'Categories Directory', path: getLinkUrl('/categories') },
      { label: activeCategoryMeta.defaultName }
    ];
  }, [activeCategory, activeCategoryMeta.defaultName]);

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

  // Matching guides from the 30-article library
  const matchingGuides = useMemo(() => {
    if (activeCategory === 'all') return BLOG_ARTICLES.slice(0, 6);
    const c = activeCategory.toLowerCase();
    return BLOG_ARTICLES.filter((a) => {
      const aCat = a.category.toLowerCase();
      const aTags = (a.tags || []).map(t => t.toLowerCase());
      if (c === 'pdf-tools') return aCat.includes('pdf') || aTags.some(t => t.includes('pdf'));
      if (c === 'image-tools') return aCat.includes('image') || aTags.some(t => t.includes('image') || t.includes('photo') || t.includes('heic'));
      if (c === 'creator-tools') return aCat.includes('creator') || aCat.includes('social') || aTags.some(t => t.includes('youtube') || t.includes('instagram') || t.includes('tiktok'));
      if (c === 'video-tools') return aCat.includes('video') || aTags.some(t => t.includes('video') || t.includes('animation'));
      if (c === 'audio-tools') return aCat.includes('audio') || aTags.some(t => t.includes('audio') || t.includes('lofi') || t.includes('music'));
      if (c === 'business-tools') return aCat.includes('business') || aCat.includes('financial') || aTags.some(t => t.includes('invoice') || t.includes('gst') || t.includes('tax'));
      if (c === 'text-tools') return aCat.includes('text') || aTags.some(t => t.includes('text') || t.includes('word') || t.includes('formatting'));
      if (c === 'career-tools') return aCat.includes('career') || aCat.includes('resume') || aTags.some(t => t.includes('resume') || t.includes('ats') || t.includes('interview'));
      if (c === 'developer-tools') return aCat.includes('developer') || aTags.some(t => t.includes('json') || t.includes('jwt') || t.includes('developer') || t.includes('api'));
      if (c === 'design-tools') return aCat.includes('design') || aCat.includes('calculator') || aCat.includes('financial') || aTags.some(t => t.includes('css') || t.includes('color') || t.includes('emi') || t.includes('sip'));
      if (c === 'prompt-tools') return aCat.includes('prompt') || aCat.includes('ai') || aTags.some(t => t.includes('prompt') || t.includes('chatgpt') || t.includes('claude'));
      if (c === 'health-fitness') return aCat.includes('health') || aCat.includes('fitness') || aTags.some(t => t.includes('bmi') || t.includes('calorie') || t.includes('fasting'));
      if (c === 'generators') return aCat.includes('security') || aCat.includes('productivity') || aTags.some(t => t.includes('password') || t.includes('qr') || t.includes('habit') || t.includes('generator'));
      return false;
    }).slice(0, 3);
  }, [activeCategory]);

  const otherCategories = useMemo(() => {
    return CATEGORIES_DATA.filter((c) => c.slug !== 'all' && c.slug !== activeCategory);
  }, [activeCategory]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    setSelectedTag('All');
    const path = slug === 'all' ? '/categories' : `/category/${slug}`;
    onNavigate(getLinkUrl(path));
  };

  const handleToggleFav = (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(id);
    onShowToast(added ? t('addedFavorite', 'Added to favorites!') : t('removedFavorite', 'Removed from favorites'));
  };

  const pageTitle = activeCategory === 'all'
    ? 'Tool Categories & Complete Directory — Zubware'
    : (authMeta?.seoTitle || `${t(activeCategoryMeta.nameKey, activeCategoryMeta.defaultName)} — Free Online Utilities | Zubware`);
  const pageDesc = activeCategory === 'all'
    ? `Browse our complete suite of ${allTools.length}+ free online browser utilities organized across 13 specialized domains with zero installation.`
    : (authMeta?.metaDescription
        ? authMeta.metaDescription.replace(/^([A-Za-z]+)\s+/i, `$1 ${filteredTools.length} `)
        : activeCategoryMeta.description);
  const canonicalPath = activeCategory === 'all' ? '/categories' : `/category/${activeCategory}`;
  const faqs = authMeta?.faqs || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        canonicalPath={canonicalPath}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />
      
      {/* Category Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Zubware Category Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {activeCategory === 'all'
            ? t('toolCategories', 'Tool Categories & Directory')
            : `${activeCategoryMeta.icon} ${authMeta?.h1 || t(activeCategoryMeta.nameKey, activeCategoryMeta.defaultName)}`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {activeCategory === 'all'
            ? t('categoriesSubtitle', 'Browse hundreds of browser-based utilities organized by domain with zero installation and fast client-side processing.')
            : (authMeta?.leadParagraph || activeCategoryMeta.description)}
        </p>

        {activeCategory !== 'all' && (
          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap text-[11px] font-bold">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              ⚡ {filteredTools.length} Active Utilities
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              🔒 In-Browser Execution
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              🆓 100% Free Forever
            </span>
          </div>
        )}
      </div>

      {/* Category Selection Tabs */}
      <nav aria-label="Tool Categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_DATA.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const translatedName = t(cat.nameKey, cat.defaultName);
          const catPath = cat.slug === 'all' ? '/categories' : `/category/${cat.slug}`;
          return (
            <a
              key={cat.slug}
              href={getLinkUrl(catPath)}
              onClick={(e) => {
                e.preventDefault();
                handleSelectCategory(cat.slug);
              }}
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
            </a>
          );
        })}
      </nav>

      {/* Authority Workflows (Subtopics) if available */}
      {authMeta?.workflows && authMeta.workflows.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Curated Workflows
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Common {activeCategoryMeta.defaultName} Workflows</span>
              </h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Step-by-step solutions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {authMeta.workflows.map((wf, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col justify-between space-y-3 border border-slate-200/70 dark:border-slate-800/70">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full inline-block mb-2">
                    Workflow 0{idx + 1}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {wf.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {wf.description}
                  </p>
                </div>

                {wf.toolIds && wf.toolIds.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {wf.toolIds.map((tid) => {
                      const tObj = TOOLS_DATA.find((t) => t.id === tid);
                      if (!tObj) return null;
                      return (
                        <a
                          key={tid}
                          href={getLinkUrl(tObj.path)}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(getLinkUrl(tObj.path));
                          }}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                        >
                          {tObj.navTitle || tObj.title} &rarr;
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

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
            <a
              key={tool.id}
              href={getLinkUrl(tool.path)}
              aria-label={`Open ${tool.title}`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                e.preventDefault();
                onNavigate(getLinkUrl(tool.path));
              }}
              className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all relative block shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <ToolIcon 
                    toolId={tool.id} 
                    category={tool.category} 
                    size="lg" 
                    className="group-hover:scale-110 transition-transform shadow-xs" 
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
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
                <span
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20"
                >
                  <span>{t('openTool', 'Open')} {tool.navTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Category In-Depth Guides & Tutorials */}
      {matchingGuides.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-indigo-200/60 dark:border-indigo-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Best Practice Guides
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Related {activeCategoryMeta.defaultName} Guides &amp; Tutorials
              </h2>
            </div>
            <a
              href={getLinkUrl('/blog')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(getLinkUrl('/blog'));
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
            >
              Browse All Guides <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {matchingGuides.map((guide) => (
              <a
                key={guide.slug}
                href={getLinkUrl(guide.canonicalPath)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(guide.canonicalPath));
                }}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 group transition-all block shadow-xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                      {guide.category}
                    </span>
                    <span>{guide.readingTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>Read In-Depth Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Category Frequently Asked Questions (FAQ Accordion) */}
      {faqs && faqs.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Common Questions about {activeCategoryMeta.defaultName}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Cross-Category Navigation Links */}
      {otherCategories.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Explore More Tool Domains
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Navigate to specialized category authority hubs across our 300+ tool directory:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={getLinkUrl('/categories')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(getLinkUrl('/categories'));
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
            >
              ⚡ All Categories Directory
            </a>
            {otherCategories.map((c) => (
              <a
                key={c.slug}
                href={getLinkUrl(`/category/${c.slug}`)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(`/category/${c.slug}`));
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-1.5"
              >
                <span>{c.icon}</span>
                <span>{c.defaultName}</span>
              </a>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

