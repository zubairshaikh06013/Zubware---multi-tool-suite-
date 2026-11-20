import React from 'react';
import { TOOL_CHOICES } from '../../data/toolChoices';
import { ToolMeta } from '../../types';
import { getLinkUrl, getToolCanonicalPath } from '../../lib/paths';

export function ToolChoiceGuide({ category, tools }: { category: string; tools: ToolMeta[] }) {
  const choices = (TOOL_CHOICES[category] || []).flatMap(choice => {
    const tool = tools.find(item => item.id === choice.toolId);
    return tool ? [{ ...choice, tool }] : [];
  });
  if (!choices.length) return null;
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5" aria-labelledby="tool-choice-heading">
    <h2 id="tool-choice-heading" className="text-xl sm:text-2xl font-bold">Which tool should I use?</h2>
    <p className="text-base text-slate-600 dark:text-slate-300">Choose the task you need to finish, then check the result before sharing or submitting it.</p>
    <div className="grid sm:grid-cols-2 gap-5">
      {choices.map(choice => <div key={choice.toolId} className="space-y-2">
        <h3 className="text-lg font-semibold">{choice.task}</h3>
        <a className="text-base text-indigo-600 dark:text-indigo-400 underline" href={getLinkUrl(getToolCanonicalPath(choice.tool))}>{choice.tool.navTitle || choice.tool.title}</a>
        <p className="text-base text-slate-600 dark:text-slate-300">{choice.check}</p>
      </div>)}
    </div>
  </section>;
}
