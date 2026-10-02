import React, { useMemo } from 'react';
import { ToolMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { ArrowRight, Layers } from 'lucide-react';
import { ToolIcon } from './common/ToolIcon';

interface ToolRecommendationsProps {
  currentTool: ToolMeta;
  allTools: ToolMeta[];
  onNavigate: (path: string) => void;
}

export const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({
  currentTool,
  allTools,
  onNavigate,
}) => {
  const { t } = useLanguage();

  const relatedTools = useMemo(() => {
    const pool = allTools.filter((t) => t.id !== currentTool.id);
    const seen = new Set<string>();
    const result: ToolMeta[] = [];

    // 1. Same category tools
    const categoryTools = pool.filter((t) => t.category === currentTool.category);
    for (const tool of categoryTools) {
      if (result.length >= 6) break;
      if (!seen.has(tool.id)) {
        seen.add(tool.id);
        result.push(tool);
      }
    }

    // 2. Matching tags tools
    if (result.length < 6 && currentTool.tags && currentTool.tags.length > 0) {
      const tagTools = pool.filter(
        (t) => t.tags && t.tags.some((tag) => currentTool.tags?.includes(tag))
      );
      for (const tool of tagTools) {
        if (result.length >= 6) break;
        if (!seen.has(tool.id)) {
          seen.add(tool.id);
          result.push(tool);
        }
      }
    }

    // 3. Trending/Featured fallback
    if (result.length < 6) {
      const popular = pool.filter((t) => t.trending || t.featured || t.editorsPick);
      for (const tool of popular) {
        if (result.length >= 6) break;
        if (!seen.has(tool.id)) {
          seen.add(tool.id);
          result.push(tool);
        }
      }
    }

    // 4. Fill to 6 if needed
    for (const tool of pool) {
      if (result.length >= 6) break;
      if (!seen.has(tool.id)) {
        seen.add(tool.id);
        result.push(tool);
      }
    }

    return result;
  }, [allTools, currentTool]);

  if (relatedTools.length === 0) return null;

  return (
    <div className="my-10 border-t border-slate-200/80 dark:border-slate-800 pt-8">
      {/* Unified Single Related Tools Section */}
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {t('relatedTools', 'Related Tools')}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <a
            key={tool.id}
            href={getLinkUrl(tool.path)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(getLinkUrl(tool.path));
            }}
            aria-label={`Open tool ${tool.navTitle}`}
            className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between text-left block"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ToolIcon toolId={tool.id} category={tool.category} size="sm" showBackground={false} />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.navTitle}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                {tool.description}
              </p>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              <span>{tool.category.replace(/^[^\w]+/, '').trim()}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
