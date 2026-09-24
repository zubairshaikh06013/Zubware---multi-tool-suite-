import { ToolMeta, BlogArticle } from '../types';

/**
 * Curated workflow clusters mapping specific tools to next-step or companion utilities.
 */
export const WORKFLOW_MAP: Record<string, string[]> = {
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
  'protect-pdf': ['unlock-pdf', 'sign-pdf', 'pdf-compressor', 'pdf-merge'],
  'unlock-pdf': ['protect-pdf', 'pdf-compressor', 'pdf-merge', 'edit-pdf'],
  'sign-pdf': ['protect-pdf', 'pdf-compressor', 'edit-pdf', 'watermark-pdf'],
  'edit-pdf': ['pdf-compressor', 'pdf-merge', 'sign-pdf', 'watermark-pdf'],
  'watermark-pdf': ['sign-pdf', 'protect-pdf', 'pdf-compressor', 'flatten-pdf'],
  'pdf-page-numberer': ['pdf-merge', 'pdf-compressor', 'reorder-pdf-pages', 'watermark-pdf'],
  'pdf-to-word': ['word-to-pdf', 'pdf-to-jpg', 'pdf-compressor', 'extract-pdf-pages'],
  'word-to-pdf': ['pdf-to-word', 'pdf-compressor', 'pdf-merge', 'protect-pdf'],
  'pdf-to-jpg': ['jpg-to-pdf', 'extract-pdf-pages', 'pdf-compressor', 'image-converter'],
  'jpg-to-pdf': ['pdf-to-jpg', 'pdf-merge', 'pdf-compressor', 'image-compressor'],

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
  'passport-photo-maker': ['background-remover', 'crop-image', 'image-resizer', 'background-color-changer'],
  'image-watermark': ['image-compressor', 'crop-image', 'blur-image', 'pixelate-image'],
  'blur-image': ['pixelate-image', 'image-watermark', 'crop-image'],
  'pixelate-image': ['blur-image', 'image-watermark', 'crop-image'],
  'exif-remover': ['image-info-viewer', 'image-compressor', 'heic-to-jpg'],
  'image-info-viewer': ['exif-remover', 'color-picker', 'image-resizer'],
  'color-picker': ['image-info-viewer', 'background-color-changer', 'random-color-generator'],
  'rounded-corners': ['image-resizer', 'crop-image', 'background-remover'],

  // Audio & Video Media Clusters
  'lofi-song-maker': ['lofi-maker', 'slowed-and-reverb'],
  'lofi-maker': ['lofi-song-maker', 'slowed-and-reverb'],
  'slowed-and-reverb': ['lofi-song-maker', 'lofi-maker'],
  'matching-parts-video-maker': ['social-character-counter', 'youtube-title-generator'],

  // Developer Utilities Clusters
  'json-formatter': ['jwt-decoder', 'base64-encoder-decoder', 'hash-generator', 'regex-tester', 'sql-formatter'],
  'jwt-decoder': ['json-formatter', 'base64-encoder-decoder', 'hash-generator', 'url-encoder-decoder'],
  'base64-encoder-decoder': ['jwt-decoder', 'url-encoder-decoder', 'hash-generator', 'json-formatter'],
  'url-encoder-decoder': ['base64-encoder-decoder', 'html-entity-encoder', 'slug-generator'],
  'html-entity-encoder': ['url-encoder-decoder', 'html-formatter', 'markdown-editor'],
  'sql-formatter': ['json-formatter', 'xml-formatter', 'html-formatter'],
  'html-formatter': ['css-formatter', 'sql-formatter', 'xml-formatter', 'json-formatter'],
  'css-formatter': ['html-formatter', 'json-formatter', 'color-picker'],
  'xml-formatter': ['json-formatter', 'html-formatter', 'sql-formatter'],
  'regex-tester': ['json-formatter', 'text-diff-checker', 'word-counter'],
  'hash-generator': ['uuid-generator', 'password-generator', 'base64-encoder-decoder', 'jwt-decoder'],
  'uuid-generator': ['hash-generator', 'password-generator', 'slug-generator'],
  'timestamp-converter': ['online-clock', 'stopwatch', 'working-days-calculator'],

  // Financial & Business Calculator Clusters
  'sip-calculator': ['emi-calculator', 'compound-interest-calculator', 'salary-calculator', 'gst-invoice-generator'],
  'emi-calculator': ['sip-calculator', 'compound-interest-calculator', 'salary-calculator', 'loan-amortization-calculator'],
  'compound-interest-calculator': ['sip-calculator', 'emi-calculator', 'percentage-calculator'],
  'gst-invoice-generator': ['invoice-generator', 'receipt-maker', 'emi-calculator', 'salary-calculator'],
  'invoice-generator': ['gst-invoice-generator', 'receipt-maker', 'business-card-generator'],
  'salary-calculator': ['salary-hike-calculator', 'ctc-calculator', 'working-days-calculator'],
  'percentage-calculator': ['discount-calculator', 'compound-interest-calculator', 'scientific-calculator'],
  'discount-calculator': ['percentage-calculator', 'gst-invoice-generator'],

  // Career & Resume Clusters
  'ats-resume-checker': ['resume-builder', 'cover-letter-builder', 'resume-score-analyzer', 'resume-keyword-optimizer'],
  'resume-builder': ['ats-resume-checker', 'cover-letter-builder', 'cv-builder', 'resume-keyword-optimizer'],
  'cv-builder': ['resume-builder', 'cover-letter-builder', 'ats-resume-checker'],
  'cover-letter-builder': ['cover-letter-templates', 'resume-builder', 'ats-resume-checker'],
  'cover-letter-templates': ['cover-letter-builder', 'resume-builder'],
  'resume-keyword-optimizer': ['ats-resume-checker', 'resume-builder', 'resume-score-analyzer'],
  'resume-score-analyzer': ['ats-resume-checker', 'resume-keyword-optimizer', 'resume-builder'],
  'salary-hike-calculator': ['ctc-calculator', 'salary-calculator', 'experience-calculator'],
  'ctc-calculator': ['salary-hike-calculator', 'salary-calculator', 'notice-period-calculator'],
  'experience-calculator': ['salary-hike-calculator', 'working-days-calculator'],
  'notice-period-calculator': ['working-days-calculator', 'experience-calculator'],
  'working-days-calculator': ['notice-period-calculator', 'experience-calculator', 'timestamp-converter'],

  // Text & Writing Clusters
  'word-counter': ['social-character-counter', 'case-converter', 'remove-extra-spaces', 'text-diff-checker'],
  'social-character-counter': ['word-counter', 'case-converter', 'youtube-title-generator'],
  'case-converter': ['remove-extra-spaces', 'word-counter', 'slug-generator', 'text-diff-checker'],
  'remove-extra-spaces': ['case-converter', 'word-counter', 'text-diff-checker', 'duplicate-line-remover'],
  'text-diff-checker': ['word-counter', 'remove-extra-spaces', 'case-converter'],
  'slug-generator': ['case-converter', 'url-encoder-decoder', 'remove-extra-spaces'],
  'duplicate-line-remover': ['remove-extra-spaces', 'line-sorter', 'word-counter'],
  'line-sorter': ['duplicate-line-remover', 'remove-extra-spaces'],

  // QR, Security & Productivity Clusters
  'qr-generator': ['barcode-generator', 'wifi-qr-code', 'password-generator', 'qr-code-scanner'],
  'barcode-generator': ['qr-generator', 'barcode-scanner', 'wifi-qr-code'],
  'wifi-qr-code': ['qr-generator', 'password-generator'],
  'qr-code-scanner': ['qr-generator', 'barcode-scanner'],
  'barcode-scanner': ['barcode-generator', 'qr-code-scanner'],
  'password-generator': ['password-strength-checker', 'hash-generator', 'qr-generator'],
  'password-strength-checker': ['password-generator', 'hash-generator']
};

/**
 * Returns 4 to 6 genuinely related, non-duplicate, non-orphaned tools for any tool in the suite.
 */
export function getRelatedTools(tool: ToolMeta, allTools: ToolMeta[], maxCount: number = 6): ToolMeta[] {
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

  // 2. High tag overlap within same or related category
  const toolTags = new Set(tool.tags || []);
  if (toolTags.size > 0) {
    const scoredTools = allTools
      .filter((t) => !seenIds.has(t.id))
      .map((t) => {
        let score = 0;
        if (t.category === tool.category) score += 2;
        if (t.tags) {
          for (const tag of t.tags) {
            if (toolTags.has(tag)) score += 3;
          }
        }
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

  // 3. Category fill to guarantee minimum link density
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

  // 4. Fallback from general popular tools if category is very small
  if (result.length < 3) {
    for (const t of allTools) {
      if (!seenIds.has(t.id)) {
        result.push(t);
        seenIds.add(t.id);
        if (result.length >= maxCount) break;
      }
    }
  }

  return result.slice(0, maxCount);
}

/**
 * Returns matching cornerstone blog articles for a tool.
 */
export function getMatchingGuidesForTool(tool: ToolMeta, articles: BlogArticle[], maxCount: number = 2): BlogArticle[] {
  // 1. Articles that explicitly reference this tool
  const explicit = articles.filter((a) => a.relatedToolIds && a.relatedToolIds.includes(tool.id));
  if (explicit.length >= maxCount) return explicit.slice(0, maxCount);

  const matched = [...explicit];
  const seenSlugs = new Set(explicit.map((a) => a.slug));

  // 2. Articles matching category keyword
  const toolCatWords = tool.category.toLowerCase().replace(/^[^\w]+/, '').trim().split(/\s+/);
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
