import fs from 'node:fs';
import path from 'node:path';
import { TOOLS_DATA } from '../src/data/toolsData';
import { SITE_ORIGIN } from '../src/lib/siteConfig';
import { getToolCanonicalPath } from '../src/lib/paths';

/** Find named meta content regardless of quote style, case or attribute ordering. */
export function extractNamedMetaContent(html: string, metaName: string): string[] {
  return (html.match(/<meta\b[^>]*>/gi) || []).flatMap(tag => {
    const name = tag.match(/\bname\s*=\s*["']([^"']*)["']/i)?.[1];
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1];
    return name?.toLowerCase() === metaName.toLowerCase() && content !== undefined ? [content] : [];
  });
}

export function hasNoindexRobotsMeta(html: string): boolean {
  return ['robots', 'googlebot'].some(name =>
    extractNamedMetaContent(html, name).some(content => /(?:^|[,\s])noindex(?:$|[,\s])/i.test(content))
  );
}

/** Extract canonical links independent of HTML attribute order. */
export function extractCanonicalHrefs(html: string): string[] {
  return (html.match(/<link\b[^>]*>/gi) || []).flatMap(tag => {
    const rel = tag.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1];
    const href = tag.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1];
    return rel?.split(/\s+/).some(value => value.toLowerCase() === 'canonical') && href ? [href] : [];
  });
}

/** Validate the actual deploy artifact, rather than stale copies in public/. */
export function validateSeoBuild(distDir: string): void {
  const errors: string[] = [];
  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const incoming = new Set<string>();
  const crawlGraph = new Map<string, Set<string>>();
  const brokenInternalLinks = new Set<string>();
  const sitemapPaths = new Set(urls.map(url => new URL(url).pathname.replace(/\/$/, '') || '/'));
  // The signed-in dashboard is an intentionally non-indexable client-side route.
  const nonIndexableAppRoutes = new Set(['/dashboard']);
  if (!urls.length || new Set(urls).size !== urls.length) errors.push('Sitemap is empty or contains duplicate URLs');
  const capture = (html: string, pattern: RegExp) => [...html.matchAll(pattern)].map(m => m[1]);
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== SITE_ORIGIN || parsed.search || parsed.hash || parsed.pathname.endsWith('.html')) {
      errors.push(`Noncanonical sitemap URL: ${url}`);
    }
    const slug = parsed.pathname.replace(/^\/+|\/+$/g, '');
    const filename = path.join(distDir, slug, 'index.html');
    if (!fs.existsSync(filename)) { errors.push(`Missing page: ${url}`); continue; }
    const html = fs.readFileSync(filename, 'utf8');
    const outgoing = new Set<string>();
    crawlGraph.set(parsed.pathname.replace(/\/$/, '') || '/', outgoing);
    const canonical = extractCanonicalHrefs(html);
    if (canonical.length !== 1 || canonical[0] !== url) errors.push(`Canonical mismatch: ${url}`);
    if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`Expected one H1: ${url}`);
    if (hasNoindexRobotsMeta(html)) errors.push(`Indexable sitemap page has noindex: ${url}`);
    for (const [name, values, seen] of [
      ['title', capture(html, /<title>([\s\S]*?)<\/title>/g), titles],
      ['description', extractNamedMetaContent(html, 'description'), descriptions],
    ] as const) {
      if (values.length !== 1 || !values[0]?.trim()) errors.push(`Missing/duplicate ${name}: ${url}`);
      else if (seen.has(values[0])) errors.push(`Repeated ${name}: ${url} and ${seen.get(values[0])}`);
      else seen.set(values[0], url);
    }
    const schemas = capture(html, /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
    if (!schemas.length) errors.push(`Missing JSON-LD: ${url}`);
    for (const schema of schemas) {
      try { JSON.parse(schema); } catch { errors.push(`Invalid JSON-LD: ${url}`); }
    }
    const assets = capture(html, /<(?:script|link)[^>]+(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g);
    for (const asset of assets) if (!fs.existsSync(path.join(distDir, asset))) errors.push(`Missing asset ${asset}: ${url}`);
    for (const href of capture(html, /<a\b[^>]*href="([^"]+)"/g)) {
      try {
        const link = new URL(href, url);
        if (link.origin === SITE_ORIGIN && link.pathname !== parsed.pathname) {
          const normalizedPath = link.pathname.replace(/\/$/, '') || '/';
          if (sitemapPaths.has(normalizedPath)) {
            incoming.add(normalizedPath);
            outgoing.add(normalizedPath);
          }
          else if (!nonIndexableAppRoutes.has(normalizedPath) && !/\.[a-z0-9]+$/i.test(normalizedPath)) brokenInternalLinks.add(`${url} -> ${link.pathname}`);
        }
      } catch { errors.push(`Invalid link on ${url}: ${href}`); }
    }
  }
  for (const broken of brokenInternalLinks) errors.push(`Broken internal page link: ${broken}`);
  for (const tool of TOOLS_DATA) {
    const route = getToolCanonicalPath(tool);
    if (!urls.includes(`${SITE_ORIGIN}${route}`)) errors.push(`Tool missing from sitemap: ${tool.id}`);
    if (!incoming.has(route)) errors.push(`Tool has no crawlable incoming link: ${tool.id}`);
  }
  // Crawl-depth diagnostics: all sitemap URLs should be reachable through HTML links,
  // not solely through sitemap discovery. Report deep/orphaned pages without failing
  // an otherwise valid deployment (legacy content may require editorial review).
  const depth = new Map<string, number>([['/', 0]]);
  const queue = ['/'];
  for (let i = 0; i < queue.length; i++) {
    const source = queue[i];
    for (const target of crawlGraph.get(source) || []) {
      if (!depth.has(target)) {
        depth.set(target, depth.get(source)! + 1);
        queue.push(target);
      }
    }
  }
  const unreachable = [...sitemapPaths].filter(route => !depth.has(route));
  const deep = [...depth].filter(([, hops]) => hops > 3);
  console.log(`[Zubware SEO] Homepage crawl reachability: ${depth.size}/${sitemapPaths.size} sitemap routes; ${deep.length} deeper than 3 clicks.`);
  if (unreachable.length) console.warn(`[Zubware SEO] Sitemap-only/unreachable routes (first 30): ${unreachable.slice(0, 30).join(', ')}`);
  if (deep.length) console.warn(`[Zubware SEO] Deep routes (first 30): ${deep.slice(0, 30).map(([route, hops]) => `${route} (${hops})`).join(', ')}`);
  const robots = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)) errors.push('Robots sitemap declaration missing');
  if (errors.length) throw new Error(`SEO artifact validation failed:\n${[...new Set(errors)].join('\n')}`);
  console.log(`[Zubware SEO] Validated ${urls.length} canonical pages and ${TOOLS_DATA.length} linked tool routes.`);
}
