import * as fs from 'fs';

const target16 = [
  'pdf-merge',
  'pdf-split',
  'image-to-pdf',
  'pdf-to-images',
  'delete-pdf-pages',
  'extract-pdf-pages',
  'protect-pdf',
  'unlock-pdf',
  'pdf-size-adjuster',
  'pdf-to-jpg',
  'edit-pdf',
  'pdf-to-word',
  'word-to-pdf',
  'pdf-to-text',
  'pdf-to-excel',
  'pdf-signature'
];

target16.forEach(id => {
  const p = `dist/${id}/index.html`;
  if (!fs.existsSync(p)) {
    console.error(`Missing ${p}`);
    return;
  }
  const html = fs.readFileSync(p, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  
  // Count how to steps
  const howToCount = (html.match(/Step \d+/g) || []).length;
  // Count FAQs (question elements)
  const faqCount = (html.match(/itemprop="name"/g) || []).length;
  const hasEditorial = html.includes('Comprehensive') || html.includes('Workflow') || html.includes('Technical') || html.includes('In-Browser') || html.includes('zubware-seo-deep-content');
  const hasJsonLd = html.includes('application/ld+json') && html.includes('FAQPage') && html.includes('HowTo');

  console.log(`=== ${id} (${html.length} bytes) ===`);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NONE');
  console.log('H1:', h1Match ? h1Match[1] : 'NONE');
  console.log('Meta Desc:', metaDescMatch ? metaDescMatch[1].slice(0, 60) + '...' : 'NONE');
  console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'NONE');
  console.log(`HowTo steps: ${howToCount} | FAQs: ${faqCount} | Editorial: ${hasEditorial} | JSON-LD FAQ+HowTo: ${hasJsonLd}`);
});
