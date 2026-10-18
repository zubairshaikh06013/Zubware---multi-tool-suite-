import type { ToolMeta } from '../types';

type SearchableTool = Pick<ToolMeta, 'title' | 'navTitle' | 'description' | 'tags'> & Partial<Pick<ToolMeta, 'id' | 'category' | 'features'>>;
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[-_/–—]+/g, ' ').replace(/\s+/g, ' ').trim();

export function filterDirectoryTools<T extends SearchableTool>(tools: T[], query: string, tag = 'All'): T[] {
  const phrase = normalize(query);
  const terms = phrase.split(' ').filter(Boolean);
  const matches = tools.flatMap((tool, index) => {
    if (tag !== 'All' && !tool.tags?.some(value => value.toLocaleLowerCase() === tag.toLocaleLowerCase())) return [];
    const names = [tool.title, tool.navTitle || '', tool.id || ''].map(normalize);
    const text = normalize([tool.title, tool.navTitle, tool.id, tool.category, tool.description, ...(tool.tags || []), ...(tool.features || [])].join(' '));
    if (!terms.every(term => text.includes(term))) return [];
    const score = !phrase ? 0 : names.some(name => name === phrase) ? 1000
      : names.some(name => name.includes(phrase)) ? 700
      : terms.every(term => names.some(name => name.includes(term))) ? 500
      : tool.tags?.some(value => normalize(value) === phrase) ? 250 : 100;
    return [{ tool, score, index }];
  });
  return matches.sort((a, b) => b.score - a.score || a.index - b.index).map(({tool}) => tool);
}

export function directoryTags(tools: Pick<ToolMeta, 'tags'>[]) {
  const counts = new Map<string, number>();
  for (const tool of tools) for (const tag of new Set(tool.tags || [])) counts.set(tag, (counts.get(tag) || 0) + 1);
  return Array.from(counts, ([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
