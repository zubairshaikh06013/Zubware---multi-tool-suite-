import fs from 'node:fs';
import path from 'node:path';
import * as pagefind from 'pagefind';

// Read only canonical sitemap routes, never the duplicate legacy .html outputs,
// QA pages, dashboard or the 404 page. Index main content, not footer navigation.
const urls = [...fs.readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]));
const { index, errors } = await pagefind.createIndex({ rootSelector: 'main', forceLanguage: 'en' });
if (!index || errors.length) throw new Error(errors.join('\n'));
try {
  for (const url of urls) {
    const content = fs.readFileSync(path.join('dist', url.pathname, 'index.html'), 'utf8');
    const result = await index.addHTMLFile({ url: url.pathname, content });
    if (result.errors.length) throw new Error(`${url}: ${result.errors.join('\n')}`);
  }
  const written = await index.writeFiles({ outputPath: 'dist/pagefind' });
  if (written.errors.length) throw new Error(written.errors.join('\n'));
  console.log(`[Zubware Search] Indexed ${urls.length} canonical pages with Pagefind.`);
} finally {
  await pagefind.close();
}
