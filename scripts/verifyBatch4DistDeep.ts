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
  const html = fs.readFileSync(p, 'utf8');
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);

  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  
  const howToH3s = h3s.filter(h => /^\d+\.\s/.test(h));
  const faqH3s = h3s.filter(h => h.endsWith('?'));

  console.log(`=== ${id} (${html.length} bytes) ===`);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NONE');
  console.log('H1:', h1Match ? h1Match[1].trim() : 'NONE');
  console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'NONE');
  console.log('Meta Desc:', metaDescMatch ? metaDescMatch[1].slice(0, 75) + '...' : 'NONE');
  console.log(`HowTo steps: ${howToH3s.length} | FAQs: ${faqH3s.length} | H2 sections: ${h2s.length}`);
  console.log('H2s:', h2s.join(' | '));
});
