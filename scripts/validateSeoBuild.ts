import fs from 'node:fs';
import path from 'node:path';
import { TOOLS_DATA } from '../src/data/toolsData';
import { SITE_ORIGIN } from '../src/lib/siteConfig';
import { getToolCanonicalPath } from '../src/lib/paths';

/** Validate the actual deploy artifact, rather than stale copies in public/. */
export function validateSeoBuild(distDir: string): void {
  const errors: string[] = [];
  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const incoming = new Set<string>();
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
    const canonical = capture(html, /<link\s+rel="canonical"\s+href="([^"]+)"/g);
    if (canonical.length !== 1 || canonical[0] !== url) errors.push(`Canonical mismatch: ${url}`);
    if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`Expected one H1: ${url}`);
    // Attribute order is not significant in HTML: detect both name-before-content and content-before-name.
    const metaTags = html.match(/<meta\\b[^>]*>/gi) || [];
    if (metaTags.some(tag => {
      const name = tag.match(/\\bname\\s*=\\s*["'](robots|googlebot)["']/i)?.[1];
      const content = tag.match(/\\bcontent\\s*=\\s*["']([^"']*)["']/i)?.[1];
      return name && content && /(?:^|[,\\s])noindex(?:$|[,\\s])/i.test(content);
    })) errors.push(`Indexable sitemap page has noindex: ${url}`);
    for (const [name, values, seen] of [
      ['title', capture(html, /<title>([\s\S]*?)<\/title>/g), titles],
      ['description', capture(html, /<meta\s+name="description"\s+content="([^"]*)"/g), descriptions],
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
        if (link.origin === SITE_ORIGIN && link.pathname !== parsed.pathname) incoming.add(link.pathname);
      } catch { errors.push(`Invalid link on ${url}: ${href}`); }
    }
  }
  for (const tool of TOOLS_DATA) {
    const route = getToolCanonicalPath(tool);
    if (!urls.includes(`${SITE_ORIGIN}${route}`)) errors.push(`Tool missing from sitemap: ${tool.id}`);
    if (!incoming.has(route)) errors.push(`Tool has no crawlable incoming link: ${tool.id}`);
  }
  const robots = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)) errors.push('Robots sitemap declaration missing');
  if (errors.length) throw new Error(`SEO artifact validation failed:\n${[...new Set(errors)].join('\n')}`);
  console.log(`[Zubware SEO] Validated ${urls.length} canonical pages and ${TOOLS_DATA.length} linked tool routes.`);
}
