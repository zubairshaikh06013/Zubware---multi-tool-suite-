export interface ContentSearchResult {
  url: string;
  title: string;
  excerpt: string;
}
interface PagefindModule {
  search: (query: string) => Promise<{ results: { data: () => Promise<{ url: string; meta: { title?: string }; excerpt?: string; plain_excerpt?: string }> }[] }>;
}
let engine: Promise<PagefindModule> | undefined;

export async function searchSiteContent(query: string): Promise<ContentSearchResult[]> {
  if (query.trim().length < 2) return [];
  // The generated engine and WASM load only after a visitor starts searching.
  const bundlePath = '/pagefind/pagefind.js';
  engine ??= import(/* @vite-ignore */ bundlePath).catch(error => { engine = undefined; throw error; });
  const pagefind = await engine;
  const result = await pagefind.search(query.trim());
  const pages = await Promise.all(result.results.slice(0, 5).map(r => r.data()));
  return pages.flatMap(page => {
    const url = new URL(page.url, window.location.origin);
    if (url.origin !== window.location.origin) return [];
    return [{ url: url.pathname + url.hash, title: page.meta.title || url.pathname, excerpt: (page.plain_excerpt || page.excerpt || '').replace(/<[^>]*>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&') }];
  });
}
