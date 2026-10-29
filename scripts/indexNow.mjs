import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const ORIGIN = 'https://www.zubware.com';
const KEY = '9f10749edcf342c78b50d6be9836a21d';
const hash = text => createHash('sha256').update(text).digest('hex');

export function changedUrls(current, previous) {
  const pages = current.pages;
  if (!pages || Object.keys(pages).some(url => new URL(url).origin !== ORIGIN)) throw new Error('Invalid current manifest');
  const old = previous?.pages || {};
  if (Object.keys(old).some(url => new URL(url).origin !== ORIGIN)) throw new Error('Invalid previous manifest');
  return [...new Set([
    ...Object.keys(pages).filter(url => pages[url] !== old[url]),
    ...Object.keys(old).filter(url => !(url in pages)),
  ])].sort();
}

// Hash a tool's own implementation and relative imports, avoiding unrelated bundle hash churn.
async function sourceGraph(file, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  const text = await fs.readFile(file, 'utf8');
  const parts = [path.relative(process.cwd(), file), text];
  const imports = [...text.matchAll(/(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g)];
  for (const match of imports) {
    if (!match[1].startsWith('.')) continue;
    const base = path.resolve(path.dirname(file), match[1]);
    for (const candidate of [base, base + '.ts', base + '.tsx', base + '.json', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
      if (await fs.stat(candidate).then(s => s.isFile()).catch(() => false)) {
        parts.push(await sourceGraph(candidate, seen));
        break;
      }
    }
  }
  return parts.join('\n');
}

export async function buildManifest(dist = 'dist') {
  const sitemap = await fs.readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const app = await fs.readFile('src/App.tsx', 'utf8');
  const components = new Map([...app.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]/g)].map(m => [m[1], m[2]]));
  const routes = new Map([...app.matchAll(/activeTool\.id\s*===\s*['"]([^'"]+)['"]\s*&&\s*<(\w+)/g)].map(m => [m[1], m[2]]));
  const pages = {};
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    if (url.origin !== ORIGIN || url.search || url.hash) throw new Error('Unexpected sitemap URL');
    const slug = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (slug.includes('..')) throw new Error('Invalid sitemap path');
    let html;
    for (const file of [slug ? `${slug}.html` : 'index.html', path.join(slug, 'index.html')]) {
      try { html = await fs.readFile(path.join(dist, file), 'utf8'); break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    if (!html || /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) throw new Error(`Missing or noindex sitemap page: ${url}`);
    // Keep readable content and metadata; remove build-generated asset references.
    const stable = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<link\b(?=[^>]*(?:modulepreload|stylesheet))[^>]*>/gi, '')
      .replace(/\/assets\/[^"'\s<>]+/g, '/assets/compiled');
    const componentPath = components.get(routes.get(slug));
    const source = componentPath ? await sourceGraph(path.resolve('src', componentPath) + '.tsx') : '';
    pages[url.href] = hash(stable + source);
  }
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  await fs.writeFile(path.join(dist, 'indexnow-manifest.json'), JSON.stringify({ version: 1, revision, pages }, null, 2) + '\n');
  console.log(`IndexNow manifest: ${Object.keys(pages).length} canonical pages.`);
}

async function getLive(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response;
}

export async function submitManifest(manifestFile = 'reports/indexnow-manifest.json', stateDir = '.indexnow-state') {
  const current = JSON.parse(await fs.readFile(manifestFile, 'utf8'));
  const stateFile = path.join(stateDir, 'manifest.json');
  let previous;
  try { previous = JSON.parse(await fs.readFile(stateFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  let verified = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      const key = await (await getLive(`${ORIGIN}/${KEY}.txt`)).text();
      const live = await (await getLive(`${ORIGIN}/indexnow-manifest.json?revision=${current.revision}`)).json();
      if (key.trim() === KEY && live.revision === current.revision && JSON.stringify(live.pages) === JSON.stringify(current.pages)) { verified = true; break; }
    } catch (error) { console.log(`Live verification attempt ${attempt + 1}: ${error.message}`); }
    if (attempt < 89) await new Promise(resolve => setTimeout(resolve, 10000));
  }
  if (!verified) throw new Error('Deployed key and manifest are not live yet. No URLs were submitted. Rerun the failed job after deployment.');
  const urls = changedUrls(current, previous);
  const report = { revision: current.revision, submittedAt: new Date().toISOString(), urls, responses: [] };
  for (let start = 0; start < urls.length; start += 10000) {
    const batch = urls.slice(start, start + 10000);
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(ORIGIN).hostname, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: batch }),
      signal: AbortSignal.timeout(30000),
    });
    report.responses.push({ status: response.status, count: batch.length });
    if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status}: ${(await response.text()).slice(0, 300)}. State not advanced.`);
    console.log(`IndexNow received ${batch.length} URLs (HTTP ${response.status}); indexing remains the search engine's decision.`);
  }
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/indexnow-submission.json', JSON.stringify(report, null, 2) + '\n');
  await fs.mkdir(stateDir, { recursive: true });
  await fs.writeFile(stateFile, JSON.stringify(current, null, 2) + '\n');
  console.log(urls.length ? 'Submission state saved.' : 'No changed URLs; no submission needed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === 'build') await buildManifest();
  else if (process.argv[2] === 'submit') await submitManifest();
  else throw new Error('Usage: node scripts/indexNow.mjs build|submit');
}
