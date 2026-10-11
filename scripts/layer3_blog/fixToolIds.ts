import * as fs from 'fs';

const files = [
  'scripts/layer3_blog/cluster1_pdf.ts',
  'scripts/layer3_blog/cluster2_images.ts',
  'scripts/layer3_blog/cluster3_dev.ts',
  'scripts/layer3_blog/cluster4_finance.ts',
  'scripts/layer3_blog/cluster5_text_security.ts',
  'scripts/layer3_blog/cluster6_media_audio.ts',
  'scripts/layer3_blog/cluster7_career_ai.ts',
  'scripts/layer3_blog/expanded_articles.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/'clean-text'/g, "'text-cleaner'");
    content = content.replace(/'youtube-tag-generator'/g, "'youtube-tags-generator'");
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed IDs in', f);
  }
});
