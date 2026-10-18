import type { ToolMeta } from '../types';

type SearchableTool = Pick<ToolMeta, 'title' | 'navTitle' | 'description' | 'tags'>;

export function filterDirectoryTools<T extends SearchableTool>(tools: T[], query: string, tag = 'All'): T[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return tools.filter(tool => {
    if (tag !== 'All' && !tool.tags?.includes(tag)) return false;
    const text = [tool.title, tool.navTitle, tool.description, ...(tool.tags || [])].join(' ').toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  });
}

export function directoryTags(tools: Pick<ToolMeta, 'tags'>[]) {
  const counts = new Map<string, number>();
  for (const tool of tools) for (const tag of new Set(tool.tags || [])) counts.set(tag, (counts.get(tag) || 0) + 1);
  return Array.from(counts, ([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
