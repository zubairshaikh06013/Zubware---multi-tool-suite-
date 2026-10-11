import React, { useMemo } from 'react';
import { ToolMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { getRelatedTools } from '../lib/workflowMap';
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
    return getRelatedTools(currentTool, allTools, 6);
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
