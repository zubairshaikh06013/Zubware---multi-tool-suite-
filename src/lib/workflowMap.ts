import { ToolMeta, BlogArticle } from '../types';

/**
 * Curated workflow clusters mapping specific tools to next-step or companion utilities.
 */
export const WORKFLOW_MAP: Record<string, string[]> = {
  'us-income-tax-calculator': ['salary-hike-calculator', 'ctc-calculator', 'percentage-calculator', 'currency-calculator'],
  'currency-calculator': ['percentage-calculator', 'profit-margin-calculator', 'us-income-tax-calculator'],
  'password-generator': ['passphrase-generator', 'password-strength-checker', 'random-password-generator'],
  // Date calculations belong with dates, not CSS tools in the broad Design category.
  'wedding-invitation-maker': ['marriage-biodata-maker', 'qr-generator', 'image-compressor', 'countdown-calculator'],
  'marriage-biodata-maker': ['wedding-invitation-maker', 'image-compressor', 'passport-photo-maker', 'age-calculator', 'image-to-pdf'],
  'age-calculator': ['marriage-biodata-maker', 'working-days-calculator', 'countdown-calculator', 'time-zone-converter', 'cat-age-calculator'],
  'countdown-calculator': ['age-calculator', 'working-days-calculator', 'time-zone-converter'],
  'cat-age-calculator': ['age-calculator', 'countdown-calculator'],
  'college-gpa-calculator': ['cgpa-calculator', 'exam-score-calculator', 'percentage-calculator'],
  'signature-maker': ['signature-resizer', 'pdf-signature', 'photo-signature-joiner'],
  'photo-name-date-joiner': ['photo-signature-joiner', 'signature-resizer', 'passport-photo-maker'],
  'subtitle-generator': ['video-trimmer', 'video-compressor', 'video-aspect-ratio', 'video-to-audio'],
  'video-compressor': ['video-trimmer', 'video-aspect-ratio', 'video-to-audio', 'video-to-gif'],
  'json-validator': ['json-formatter', 'json-viewer', 'json-minifier', 'json-to-csv'],
  // Data-conversion tasks form a natural, bidirectional workflow.
  'json-to-csv': ['csv-to-json', 'csv-viewer', 'json-validator', 'json-formatter'],
  'csv-to-json': ['json-to-csv', 'csv-viewer', 'json-validator', 'json-formatter'],
  'csv-viewer': ['csv-to-json', 'json-to-csv', 'json-formatter'],
  'json-viewer': ['json-formatter', 'json-validator', 'json-to-csv', 'csv-to-json'],
  'json-minifier': ['json-formatter', 'json-validator', 'json-viewer'],
  'pdf-to-excel': ['pdf-to-text', 'pdf-to-word', 'csv-viewer', 'csv-to-json'],
  // PDF Workflow Clusters
  'pdf-compressor': ['decrease-pdf-size', 'pdf-size-adjuster', 'pdf-merge', 'pdf-split', 'edit-pdf', 'protect-pdf'],
  'decrease-pdf-size': ['pdf-compressor', 'pdf-size-adjuster', 'pdf-merge', 'pdf-split', 'protect-pdf'],
  'pdf-size-adjuster': ['pdf-compressor', 'decrease-pdf-size', 'pdf-merge', 'pdf-split', 'rotate-pdf'],
  'pdf-merge': ['pdf-split', 'extract-pdf-pages', 'pdf-compressor', 'rotate-pdf', 'delete-pdf-pages', 'reorder-pdf-pages'],
  'pdf-split': ['pdf-merge', 'extract-pdf-pages', 'delete-pdf-pages', 'reorder-pdf-pages', 'pdf-compressor'],
  'extract-pdf-pages': ['pdf-split', 'pdf-merge', 'delete-pdf-pages', 'reorder-pdf-pages'],
  'delete-pdf-pages': ['pdf-split', 'extract-pdf-pages', 'pdf-merge', 'reorder-pdf-pages'],
  'reorder-pdf-pages': ['pdf-merge', 'pdf-split', 'rotate-pdf', 'extract-pdf-pages'],
  'rotate-pdf': ['pdf-merge', 'reorder-pdf-pages', 'pdf-split', 'pdf-compressor'],
  'protect-pdf': ['unlock-pdf', 'signature-maker', 'pdf-compressor', 'pdf-merge'],
  'unlock-pdf': ['protect-pdf', 'pdf-compressor', 'pdf-merge', 'edit-pdf'],
  'edit-pdf': ['pdf-compressor', 'pdf-merge', 'signature-maker', 'pdf-watermark'],
  'pdf-watermark': ['signature-maker', 'protect-pdf', 'pdf-compressor', 'pdf-merge'],
  'pdf-to-word': ['pdf-to-jpg', 'pdf-compressor', 'extract-pdf-pages'],
  'word-to-pdf': ['pdf-to-word', 'pdf-compressor', 'pdf-merge', 'protect-pdf'],
  'pdf-to-jpg': ['image-to-pdf', 'extract-pdf-pages', 'pdf-compressor', 'image-converter'],
  'image-to-pdf': ['pdf-to-jpg', 'pdf-merge', 'pdf-compressor', 'image-compressor'],

  // Image Processing Clusters
  'image-splitter-merger': ['crop-image', 'image-resizer', 'image-compressor', 'background-remover'],
  'image-compressor': ['image-converter', 'image-resizer', 'crop-image', 'heic-to-jpg', 'background-remover'],
  'image-converter': ['image-compressor', 'image-resizer', 'heic-to-jpg', 'background-remover'],
  'image-resizer': ['crop-image', 'image-compressor', 'bulk-image-renamer-resizer', 'passport-photo-maker'],
  'crop-image': ['image-resizer', 'image-compressor', 'rotate-image', 'flip-image'],
  'rotate-image': ['flip-image', 'crop-image', 'image-resizer', 'image-compressor'],
  'flip-image': ['rotate-image', 'crop-image', 'image-resizer'],
  'background-remover': ['background-color-changer', 'image-compressor', 'image-converter', 'passport-photo-maker'],
  'background-color-changer': ['background-remover', 'passport-photo-maker', 'image-compressor'],
  'heic-to-jpg': ['image-compressor', 'image-converter', 'image-resizer', 'exif-remover'],
  'bulk-image-renamer-resizer': ['image-resizer', 'image-compressor', 'image-converter'],
  'passport-photo-maker': ['marriage-biodata-maker', 'background-remover', 'crop-image', 'image-resizer', 'photo-signature-joiner', 'signature-resizer'],
  'photo-signature-joiner': ['signature-resizer', 'passport-photo-maker', 'image-compressor', 'background-remover', 'crop-image'],
  'signature-resizer': ['photo-signature-joiner', 'passport-photo-maker', 'image-compressor', 'signature-maker', 'background-color-changer'],
  'image-watermark': ['image-compressor', 'crop-image', 'blur-image', 'pixelate-image'],
  'blur-image': ['pixelate-image', 'image-watermark', 'crop-image'],
  'pixelate-image': ['blur-image', 'image-watermark', 'crop-image'],
  'exif-remover': ['image-info-viewer', 'image-compressor', 'heic-to-jpg'],
  'image-info-viewer': ['exif-remover', 'image-color-picker', 'image-resizer'],
  'image-color-picker': ['image-info-viewer', 'background-color-changer', 'random-color-generator'],
  'rounded-corners': ['image-resizer', 'crop-image', 'background-remover'],

  // Audio & Video Media Clusters
  'lofi-song-maker': ['lofi-maker', 'slowed-and-reverb'],
  'lofi-maker': ['lofi-song-maker', 'slowed-and-reverb'],
  'slowed-and-reverb': ['lofi-song-maker', 'lofi-maker'],
  'matching-parts-video-maker': ['social-character-counter', 'youtube-title-generator'],

  // Developer Utilities Clusters
  'json-formatter': ['json-validator', 'json-minifier', 'json-to-csv', 'csv-to-json', 'json-viewer', 'regex-tester'],
  'jwt-decoder': ['json-formatter', 'base64-encoder-decoder', 'hash-generator', 'url-encoder-decoder'],
  'base64-encoder-decoder': ['jwt-decoder', 'url-encoder-decoder', 'hash-generator', 'json-formatter'],
  'url-encoder-decoder': ['base64-encoder-decoder', 'html-escape-unescape', 'text-cleaner'],
  'html-escape-unescape': ['url-encoder-decoder', 'html-formatter', 'markdown-editor'],
  'sql-formatter': ['json-formatter', 'xml-formatter', 'html-formatter'],
  'html-formatter': ['css-formatter', 'sql-formatter', 'xml-formatter', 'json-formatter'],
  'css-formatter': ['html-formatter', 'json-formatter', 'image-color-picker'],
  'xml-formatter': ['json-formatter', 'html-formatter', 'sql-formatter'],
  'regex-tester': ['json-formatter', 'text-compare', 'word-counter'],
  'hash-generator': ['uuid-generator', 'random-password-generator', 'base64-encoder-decoder', 'jwt-decoder'],
  'uuid-generator': ['hash-generator', 'random-password-generator', 'url-encoder-decoder'],
  'unix-timestamp-converter': ['online-clock', 'online-stopwatch', 'working-days-calculator'],

  // Financial & Business Calculator Clusters
  'emi-calculator': ['compound-interest-calculator', 'ctc-calculator', 'loan-calculator', 'gst-invoice-generator'],
  'compound-interest-calculator': ['emi-calculator', 'percentage-calculator', 'loan-calculator'],
  'gst-invoice-generator': ['discount-calculator', 'percentage-calculator', 'signature-maker', 'qr-generator'],
  'salary-hike-calculator': ['ctc-calculator', 'experience-calculator', 'working-days-calculator'],
  'ctc-calculator': ['salary-hike-calculator', 'notice-period-calculator', 'working-days-calculator'],
  'percentage-calculator': ['discount-calculator', 'compound-interest-calculator', 'scientific-calculator'],
  'scientific-calculator': ['percentage-calculator', 'college-gpa-calculator', 'age-calculator', 'cement-calculator'],
  'discount-calculator': ['percentage-calculator', 'gst-invoice-generator'],
  'learning-licence-mock-test': ['photo-signature-joiner', 'signature-resizer', 'passport-photo-maker', 'age-calculator'],

  // Career & Resume Clusters
  'ats-resume-checker': ['resume-builder', 'cover-letter-builder', 'resume-score-analyzer', 'resume-keyword-optimizer'],
  'resume-builder': ['ats-resume-checker', 'cover-letter-builder', 'cv-builder', 'resume-keyword-optimizer'],
  'cv-builder': ['resume-builder', 'cover-letter-builder', 'ats-resume-checker'],
  'cover-letter-builder': ['cover-letter-templates', 'resume-builder', 'ats-resume-checker'],
  'cover-letter-templates': ['cover-letter-builder', 'resume-builder'],
  'resume-keyword-optimizer': ['ats-resume-checker', 'resume-builder', 'resume-score-analyzer'],
  'resume-score-analyzer': ['ats-resume-checker', 'resume-keyword-optimizer', 'resume-builder'],
  'experience-calculator': ['salary-hike-calculator', 'working-days-calculator'],
  'notice-period-calculator': ['working-days-calculator', 'experience-calculator'],
  'working-days-calculator': ['notice-period-calculator', 'experience-calculator', 'age-calculator', 'unix-timestamp-converter'],

  // Text & Writing Clusters
  'word-counter': ['social-character-counter', 'case-converter', 'text-cleaner', 'text-compare'],
  'social-character-counter': ['word-counter', 'case-converter', 'youtube-title-generator'],
  'case-converter': ['text-cleaner', 'word-counter', 'text-compare', 'url-encoder-decoder'],
  'text-cleaner': ['case-converter', 'word-counter', 'text-compare', 'remove-duplicate-lines'],
  'text-compare': ['word-counter', 'text-cleaner', 'case-converter'],
  'remove-duplicate-lines': ['text-cleaner', 'word-counter', 'sort-lines'],
  'sort-lines': ['remove-duplicate-lines', 'text-cleaner'],

  // QR, Security & Productivity Clusters
  'qr-generator': ['qr-code-decoder', 'qr-code-safety-checker', 'qr-business-card-generator', 'barcode-generator'],
  'barcode-generator': ['qr-generator', 'barcode-scanner', 'qr-business-card-generator'],
  'qr-code-decoder': ['qr-generator', 'barcode-scanner', 'qr-code-safety-checker'],
  'barcode-scanner': ['barcode-generator', 'qr-code-decoder'],
  'random-password-generator': ['password-strength-checker', 'hash-generator', 'passphrase-generator', 'text-encrypt-decrypt'],
  'password-strength-checker': ['random-password-generator', 'hash-generator', 'passphrase-generator'],
  'passphrase-generator': ['random-password-generator', 'password-strength-checker', 'text-encrypt-decrypt'],
  'text-encrypt-decrypt': ['random-password-generator', 'password-strength-checker', 'hash-generator']
};

/**
 * Returns 4 to 6 genuinely related, non-duplicate, non-orphaned tools for any tool in the suite.
 */
export function getRelatedTools(tool: ToolMeta, allTools: ToolMeta[], maxCount: number = 6): ToolMeta[] {
  if (maxCount <= 0) return [];
  const result: ToolMeta[] = [];
  const seenIds = new Set<string>([tool.id]);

  // 1. Direct curated workflow mappings
  const workflowIds = WORKFLOW_MAP[tool.id] || [];
  for (const wid of workflowIds) {
    if (seenIds.has(wid)) continue;
    const match = allTools.find((t) => t.id === wid);
    if (match) {
      result.push(match);
      seenIds.add(match.id);
      if (result.length >= maxCount) return result;
    }
  }

  // Generated tags contain broad terms such as "Free", "Generator" and "Design".
  // Those made an age calculator recommend CSS tools. Match specific concepts instead.
  const genericWords = new Set(['free', 'online', 'tool', 'tools', 'generator', 'calculator', 'converter', 'builder', 'maker', 'to', 'and', 'the', 'for', 'with', 'without', 'browser', 'client', 'side', 'best']);
  const concepts = (t: ToolMeta) => new Set(
    `${t.id} ${t.navTitle || ''}`.toLowerCase().split(/[^a-z0-9]+/)
      .filter(word => word.length > 1 && !genericWords.has(word))
  );
  const toolTags = concepts(tool);
  if (toolTags.size > 0) {
    const scoredTools = allTools
      .filter((t) => !seenIds.has(t.id))
      .map((t) => {
        let score = 0;
        for (const tag of concepts(t)) {
          if (toolTags.has(tag)) score += 3;
        }
        if (score > 0 && t.category === tool.category) score += 1;
        return { tool: t, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const item of scoredTools) {
      result.push(item.tool);
      seenIds.add(item.tool.id);
      if (result.length >= maxCount) return result;
    }
  }

  // A curated workflow is more useful than padding it with unrelated links.
  if (workflowIds.length > 0) return result.slice(0, maxCount);

  // 3. Category fallback for tools without a curated workflow.
  const cleanCat = tool.category.replace(/^[^\w]+/, '').trim().toLowerCase();
  for (const t of allTools) {
    if (seenIds.has(t.id)) continue;
    const otherCat = t.category.replace(/^[^\w]+/, '').trim().toLowerCase();
    if (otherCat === cleanCat || otherCat.includes(cleanCat) || cleanCat.includes(otherCat)) {
      result.push(t);
      seenIds.add(t.id);
      if (result.length >= maxCount) return result;
    }
  }

  return result.slice(0, maxCount);
}

/**
 * Returns matching cornerstone blog articles for a tool.
 */
export function getMatchingGuidesForTool<T extends Pick<BlogArticle, 'slug' | 'title' | 'category' | 'tags' | 'relatedToolIds'>>(tool: ToolMeta, articles: T[], maxCount: number = 2): T[] {
  const toolCat = tool.category.toLowerCase().replace(/^[^\w]+/, '').trim();
  const toolWords = tool.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  // 1. Articles that explicitly reference this tool, sorted by topical relevance
  const explicit = articles
    .filter((a) => a.relatedToolIds && a.relatedToolIds.includes(tool.id))
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.category.toLowerCase().includes(toolCat)) scoreA += 5;
      if (b.category.toLowerCase().includes(toolCat)) scoreB += 5;
      for (const w of toolWords) {
        if (a.title.toLowerCase().includes(w)) scoreA += 2;
        if (b.title.toLowerCase().includes(w)) scoreB += 2;
      }
      return scoreB - scoreA;
    });

  if (explicit.length >= maxCount) return explicit.slice(0, maxCount);

  const matched = [...explicit];
  const seenSlugs = new Set(explicit.map((a) => a.slug));

  // 2. Articles matching category keyword
  const genericCategories = new Set(['tools', 'tool', 'utility', 'utilities', 'design', 'calculators', 'calculator']);
  const toolCatWords = tool.category.toLowerCase().replace(/^[^\w]+/, '').trim().split(/\s+/)
    .filter(word => !genericCategories.has(word));
  for (const a of articles) {
    if (seenSlugs.has(a.slug)) continue;
    const artCat = a.category.toLowerCase();
    const artTitle = a.title.toLowerCase();
    const artTags = (a.tags || []).map((t) => t.toLowerCase());

    const isMatch = toolCatWords.some(
      (word) => word.length > 2 && (artCat.includes(word) || artTitle.includes(word) || artTags.some((t) => t.includes(word)))
    );

    if (isMatch) {
      matched.push(a);
      seenSlugs.add(a.slug);
      if (matched.length >= maxCount) break;
    }
  }

  return matched.slice(0, maxCount);
}
