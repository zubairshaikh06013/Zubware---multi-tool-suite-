import type { ToolSeoData } from '../data/toolSeoData';

const cache = new Map<string, ToolSeoData>();
const pending = new Map<string, Promise<ToolSeoData>>();

function validate(value: unknown, id: string): ToolSeoData {
  if (!value || typeof value !== 'object' || (value as { id?: unknown }).id !== id) throw new Error('Wrong tool guide response');
  const data = value as ToolSeoData;
  if (data.faq !== undefined && (!Array.isArray(data.faq) || data.faq.some(item => typeof item?.question !== 'string' || typeof item?.answer !== 'string'))) throw new Error('Invalid tool FAQs');
  if (data.howTo !== undefined && (!Array.isArray(data.howTo) || data.howTo.some(item => typeof item?.title !== 'string' || typeof item?.desc !== 'string'))) throw new Error('Invalid tool instructions');
  return { faq: data.faq, howTo: data.howTo };
}

export function readToolSeoData(id: string): ToolSeoData | undefined {
  if (cache.has(id)) return cache.get(id);
  if (typeof document === 'undefined') return undefined;
  const source = document.getElementById('tool-seo-data')?.textContent;
  if (!source) return undefined;
  try {
    const data = validate(JSON.parse(source), id);
    cache.set(id, data);
    return data;
  } catch { return undefined; }
}

/** Initial visits read the head's route data; SPA navigation fetches just one guide. */
export function loadToolSeoData(id: string): Promise<ToolSeoData> {
  if (!/^[a-z0-9-]+$/.test(id)) return Promise.reject(new Error('Invalid tool id'));
  const ready = readToolSeoData(id);
  if (ready) return Promise.resolve(ready);
  const existing = pending.get(id);
  if (existing) return existing;
  const request = (async () => {
    const response = await fetch(`/tool-seo/${id}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Tool guide could not load');
    const data = validate(await response.json(), id);
    cache.set(id, data);
    return data;
  })().finally(() => pending.delete(id));
  pending.set(id, request);
  return request;
}
