import fs from 'node:fs';

const all = [...fs.readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
// Fast representative audit by default; FULL_SITE=1 audits every sitemap page.
const sample = ['/', '/categories', '/blog', '/image-compressor', '/image-resizer', '/qr-generator', '/age-calculator', '/pdf-merger', '/word-counter', ...all.filter(p => p.startsWith('/category/'))];
export default {
  site: process.env.SEO_AUDIT_SITE || 'http://127.0.0.1:4173',
  urls: process.env.FULL_SITE === '1' ? all : [...new Set(sample.filter(p => all.includes(p)))],
  scanner: { samples: 1, maxRoutes: false, dynamicSampling: false, throttle: true },
  puppeteerOptions: { args: ['--no-sandbox', '--disable-dev-shm-usage'], ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) },
  puppeteerClusterOptions: { maxConcurrency: 2 },
  ci: { reporter: 'jsonExpanded', buildStatic: true, budget: { seo: 90 } },
};
