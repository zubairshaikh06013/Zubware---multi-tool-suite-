/**
 * Zubware SEO Topical Authority & Content Architecture Roadmap
 *
 * This content map defines 60 high-value, targeted informational articles designed
 * to establish topical authority across all 13 Zubware tool domains.
 * Each entry details primary keyword, search intent, target tools, workflow cluster,
 * and category hub integration.
 */

export interface SeoTopicPlan {
  id: string;
  categorySlug: string;
  categoryName: string;
  workingTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'informational' | 'commercial' | 'transactional';
  targetToolIds: string[];
  workflowCluster: string;
  status: 'published' | 'planned' | 'draft';
  targetWordCount: number;
  slug: string;
}

export const SEO_TOPICAL_AUTHORITY_ROADMAP: SeoTopicPlan[] = [
  // ==========================================
  // 1. PDF TOOLS CLUSTER (Articles 1-7)
  // ==========================================
  {
    id: 'pdf-01',
    categorySlug: 'pdf-tools',
    categoryName: 'PDF Tools',
    workingTitle: 'How to Compress a PDF Without Losing Readability',
    primaryKeyword: 'compress pdf without losing quality',
    secondaryKeywords: ['reduce pdf size', 'compress pdf readable text', 'pdf compression settings'],
    searchIntent: 'informational',
    targetToolIds: ['pdf-compressor', 'decrease-pdf-size', 'pdf-size-adjuster'],
    workflowCluster: 'PDF Compression & Optimization',
    status: 'published',
    targetWordCount: 2200,
    slug: 'how-to-compress-pdf-without-losing-readability'
  },
  {
    id: 'pdf-02',
    categorySlug: 'pdf-tools',
    categoryName: 'PDF Tools',
    workingTitle: 'How to Merge, Split, and Reorder PDFs Securely in the Browser',
    primaryKeyword: 'merge and split pdf online free',
    secondaryKeywords: ['combine pdf pages', 'reorder pdf pages in browser', 'extract pdf pages offline'],
    searchIntent: 'informational',
    targetToolIds: ['pdf-merge', 'pdf-split', 'reorder-pdf-pages', 'extract-pdf-pages'],
    workflowCluster: 'PDF Page Organization',
    status: 'published',
    targetWordCount: 2100,
    slug: 'merge-split-pdf-browser-workflow-guide'
  },
  {
    id: 'pdf-03',
    categorySlug: 'pdf-tools',
    categoryName: 'PDF Tools',
    workingTitle: 'PDF Security Guide: Password Encryption, Watermarking, and Permissions',
    primaryKeyword: 'password protect pdf online',
    secondaryKeywords: ['encrypt pdf browser', 'watermark pdf free', 'remove pdf password'],
    searchIntent: 'informational',
    targetToolIds: ['protect-pdf', 'unlock-pdf', 'pdf-watermark', 'pdf-metadata'],
    workflowCluster: 'PDF Security & Protection',
    status: 'planned',
    targetWordCount: 2000,
    slug: 'pdf-security-encryption-watermarking-guide'
  },
  {
    id: 'pdf-04',
    categorySlug: 'pdf-tools',
    categoryName: 'PDF Tools',
    workingTitle: 'How to Convert Scanned PDFs to Word and Extract Clean Text with OCR',
    primaryKeyword: 'pdf to word converter free',
    secondaryKeywords: ['ocr pdf to text', 'extract tables from pdf to excel', 'convert docx to pdf'],
    searchIntent: 'informational',
    targetToolIds: ['pdf-to-word', 'pdf-to-text', 'pdf-to-excel', 'word-to-pdf'],
    workflowCluster: 'Document Format Conversion',
    status: 'planned',
    targetWordCount: 1900,
    slug: 'convert-pdf-to-word-excel-text-guide'
  },
  {
    id: 'pdf-05',
    categorySlug: 'pdf-tools',
    categoryName: 'PDF Tools',
    workingTitle: 'Adding Electronic Signatures to PDF Contracts Without Third-Party Portals',
    primaryKeyword: 'sign pdf online free',
    secondaryKeywords: ['electronic signature pdf', 'draw signature on pdf', 'stamp pdf contract'],
    searchIntent: 'informational',
    targetToolIds: ['pdf-signature', 'edit-pdf', 'signature-maker', 'photo-signature-joiner'],
    workflowCluster: 'PDF Signing & Editing',
    status: 'planned',
    targetWordCount: 1800,
    slug: 'how-to-electronically-sign-pdf-contracts'
  },

  // ==========================================
  // 2. IMAGE TOOLS CLUSTER (Articles 6-12)
  // ==========================================
  {
    id: 'img-01',
    categorySlug: 'image-tools',
    categoryName: 'Image Tools',
    workingTitle: 'Client-Side Image Optimization: WebP, Compression & Quality Preservation',
    primaryKeyword: 'compress image without losing quality',
    secondaryKeywords: ['png vs jpg vs webp compression', 'batch image compressor browser', 'reduce image file size'],
    searchIntent: 'informational',
    targetToolIds: ['image-compressor', 'image-resizer', 'batch-image-converter'],
    workflowCluster: 'Image Compression & Formatting',
    status: 'published',
    targetWordCount: 2400,
    slug: 'client-side-image-optimization-guide'
  },
  {
    id: 'img-02',
    categorySlug: 'image-tools',
    categoryName: 'Image Tools',
    workingTitle: 'Mastering AI Background Removal in the Browser: Edge Matting and Transparency',
    primaryKeyword: 'remove image background free online',
    secondaryKeywords: ['transparent png cutout', 'client side background removal', 'change image background color'],
    searchIntent: 'informational',
    targetToolIds: ['background-remover', 'background-color-changer', 'passport-photo-maker'],
    workflowCluster: 'Background Removal & Portraits',
    status: 'planned',
    targetWordCount: 2000,
    slug: 'browser-background-removal-edge-matting-guide'
  },
  {
    id: 'img-03',
    categorySlug: 'image-tools',
    categoryName: 'Image Tools',
    workingTitle: 'The Complete Image Formats Guide: WebP, AVIF, PNG, JPG, and HEIC Compared',
    primaryKeyword: 'convert heic to jpg online',
    secondaryKeywords: ['convert webp to png', 'image format comparison', 'batch image conversion'],
    searchIntent: 'informational',
    targetToolIds: ['heic-to-jpg', 'image-converter', 'batch-image-converter', 'svg-optimizer'],
    workflowCluster: 'Format Conversion & Transcoding',
    status: 'planned',
    targetWordCount: 2100,
    slug: 'complete-image-formats-conversion-guide'
  },
  {
    id: 'img-04',
    categorySlug: 'image-tools',
    categoryName: 'Image Tools',
    workingTitle: 'How to Prepare Compliant Passport and Visa Photos at Home',
    primaryKeyword: 'passport photo maker free',
    secondaryKeywords: ['visa photo dimensions online', 'photo date name joiner', 'signature photo joiner'],
    searchIntent: 'informational',
    targetToolIds: ['passport-photo-maker', 'photo-name-date-joiner', 'photo-signature-joiner', 'signature-resizer'],
    workflowCluster: 'ID & Verification Photos',
    status: 'planned',
    targetWordCount: 1800,
    slug: 'passport-visa-photo-maker-guide'
  },
  {
    id: 'img-05',
    categorySlug: 'image-tools',
    categoryName: 'Image Tools',
    workingTitle: 'EXIF Metadata & Digital Photo Privacy: How to Strip Geolocation Before Sharing',
    primaryKeyword: 'remove exif data from photos online',
    secondaryKeywords: ['strip photo metadata browser', 'view image exif data', 'digital photo privacy'],
    searchIntent: 'informational',
    targetToolIds: ['exif-remover', 'image-info-viewer', 'watermark-image'],
    workflowCluster: 'Image Privacy & EXIF',
    status: 'planned',
    targetWordCount: 1700,
    slug: 'remove-exif-metadata-photo-privacy-guide'
  },

  // ==========================================
  // 3. DEVELOPER TOOLS CLUSTER (Articles 13-18)
  // ==========================================
  {
    id: 'dev-01',
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    workingTitle: 'The Developer Privacy Handbook: Formatting, Decoding & Hashing Without Server Leakage',
    primaryKeyword: 'offline json formatter developer tools',
    secondaryKeywords: ['jwt decoder private client side', 'hash generator browser', 'developer data confidentiality'],
    searchIntent: 'informational',
    targetToolIds: ['json-formatter', 'jwt-decoder', 'hash-generator', 'api-request-builder'],
    workflowCluster: 'Secure Developer Utilities',
    status: 'published',
    targetWordCount: 2300,
    slug: 'offline-developer-tools-privacy-guide'
  },
  {
    id: 'dev-02',
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    workingTitle: 'JSON, XML, CSV, and YAML Interoperability: Automated Data Transformation Pipelines',
    primaryKeyword: 'convert json to csv online',
    secondaryKeywords: ['json to xml converter', 'csv to json generator', 'xml validator and formatter'],
    searchIntent: 'informational',
    targetToolIds: ['json-to-csv', 'csv-to-json', 'json-to-xml', 'xml-to-json', 'json-validator'],
    workflowCluster: 'Data Serialization & Interchange',
    status: 'planned',
    targetWordCount: 2200,
    slug: 'json-xml-csv-yaml-data-transformation-guide'
  },
  {
    id: 'dev-03',
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    workingTitle: 'Understanding JWT Tokens: Decoding Claims, Verifying Signatures, and Debugging Expiration',
    primaryKeyword: 'jwt token decoder online',
    secondaryKeywords: ['jwt generator debugger', 'json web token claims', 'jwt security best practices'],
    searchIntent: 'informational',
    targetToolIds: ['jwt-decoder', 'jwt-generator', 'base64-encoder-decoder'],
    workflowCluster: 'Authentication & Tokens',
    status: 'planned',
    targetWordCount: 1950,
    slug: 'jwt-debugging-verification-security-guide'
  },
  {
    id: 'dev-04',
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    workingTitle: 'Regex Demystified: How to Test and Debug Regular Expressions for Input Validation',
    primaryKeyword: 'regex tester online free',
    secondaryKeywords: ['regular expression tester browser', 'regex pattern builder', 'email regex phone validation'],
    searchIntent: 'informational',
    targetToolIds: ['regex-tester', 'url-parser', 'email-extractor', 'url-extractor'],
    workflowCluster: 'Text Parsing & Regular Expressions',
    status: 'planned',
    targetWordCount: 2100,
    slug: 'regex-tester-pattern-debugging-guide'
  },
  {
    id: 'dev-05',
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    workingTitle: 'Mastering Cron Expressions: Schedule Syntax, Generators, and Production Pitfalls',
    primaryKeyword: 'cron expression generator',
    secondaryKeywords: ['crontab generator online', 'cron syntax explanation', 'schedule cron jobs'],
    searchIntent: 'informational',
    targetToolIds: ['cron-expression-generator', 'unix-timestamp-converter', 'time-zone-converter'],
    workflowCluster: 'DevOps & Scheduling',
    status: 'planned',
    targetWordCount: 1850,
    slug: 'cron-expression-generator-scheduling-guide'
  },

  // ==========================================
  // 4. CREATOR & SOCIAL TOOLS CLUSTER (Articles 19-24)
  // ==========================================
  {
    id: 'cre-01',
    categorySlug: 'creator-tools',
    categoryName: 'Creator & Social Tools',
    workingTitle: 'The YouTube Growth Blueprint: Titles, Tags, Descriptions, and High-CTR Thumbnails',
    primaryKeyword: 'youtube title generator high ctr',
    secondaryKeywords: ['youtube tags generator free', 'youtube description template', 'youtube thumbnail preview simulator'],
    searchIntent: 'informational',
    targetToolIds: ['youtube-title-generator', 'youtube-tags-generator', 'youtube-description-generator', 'youtube-thumbnail-preview', 'viral-hook-generator'],
    workflowCluster: 'YouTube Metadata & Optimization',
    status: 'published',
    targetWordCount: 2350,
    slug: 'youtube-growth-metadata-thumbnails-guide'
  },
  {
    id: 'cre-02',
    categorySlug: 'creator-tools',
    categoryName: 'Creator & Social Tools',
    workingTitle: 'Writing Viral Hooks: The Psychological Frameworks Behind Multi-Million View Short-Form Content',
    primaryKeyword: 'viral hook generator shorts reels',
    secondaryKeywords: ['tiktok hook ideas', 'instagram reels captions', 'short form video hooks'],
    searchIntent: 'informational',
    targetToolIds: ['viral-hook-generator', 'tiktok-caption-generator', 'cta-generator', 'social-media-post-formatter'],
    workflowCluster: 'Hook & Copywriting Formulas',
    status: 'planned',
    targetWordCount: 2000,
    slug: 'viral-hooks-copywriting-short-form-guide'
  },
  {
    id: 'cre-03',
    categorySlug: 'creator-tools',
    categoryName: 'Creator & Social Tools',
    workingTitle: 'Optimizing Your Social Media Bio: Layouts, Call-to-Actions, and Custom Link Trees',
    primaryKeyword: 'instagram bio generator aesthetic',
    secondaryKeywords: ['twitter bio generator', 'social bio link builder', 'fancy text generator instagram'],
    searchIntent: 'informational',
    targetToolIds: ['instagram-bio-generator', 'twitter-bio-generator', 'social-bio-link-builder', 'fancy-text-generator'],
    workflowCluster: 'Social Profiles & Bio Links',
    status: 'planned',
    targetWordCount: 1800,
    slug: 'social-media-bio-link-tree-optimization-guide'
  },
  {
    id: 'cre-04',
    categorySlug: 'creator-tools',
    categoryName: 'Creator & Social Tools',
    workingTitle: 'Hashtag Strategies for 2026: Niche, Broad, and Algorithmic Distribution on Instagram & TikTok',
    primaryKeyword: 'hashtag generator for instagram and tiktok',
    secondaryKeywords: ['youtube hashtags generator', 'facebook hashtag generator', 'tiktok trending tags'],
    searchIntent: 'informational',
    targetToolIds: ['instagram-hashtag-generator', 'tiktok-hashtag-generator', 'youtube-hashtag-generator', 'universal-hashtag-generator'],
    workflowCluster: 'Hashtag Discovery & Categorization',
    status: 'planned',
    targetWordCount: 1900,
    slug: 'instagram-tiktok-hashtag-strategy-guide'
  },

  // ==========================================
  // 5. VIDEO & AUDIO TOOLS CLUSTER (Articles 25-30)
  // ==========================================
  {
    id: 'med-01',
    categorySlug: 'video-tools',
    categoryName: 'Video & Audio Tools',
    workingTitle: 'Browser-Based Video Creation: Puzzle Shorts, Script-to-Video & Web Audio Production',
    primaryKeyword: 'browser video maker online free',
    secondaryKeywords: ['lofi music maker browser', 'slowed and reverb generator', 'video trimmer to gif converter'],
    searchIntent: 'informational',
    targetToolIds: ['script-to-video-maker', 'matching-parts-puzzle-video-maker', 'lofi-music-studio', 'slowed-and-reverb', 'video-to-gif'],
    workflowCluster: 'Automated Content Creation',
    status: 'published',
    targetWordCount: 2200,
    slug: 'browser-video-audio-creation-guide'
  },
  {
    id: 'med-02',
    categorySlug: 'audio-tools',
    categoryName: 'Audio Tools',
    workingTitle: 'How Slowed & Reverb Effects Work: DSP Pitch Shifting, Convolution, and Atmosphere',
    primaryKeyword: 'slowed and reverb audio generator',
    secondaryKeywords: ['slow down songs online', 'reverb effect browser', 'lofi audio filters'],
    searchIntent: 'informational',
    targetToolIds: ['slowed-and-reverb', 'lofi-music-studio', 'video-to-audio'],
    workflowCluster: 'Audio Effects & Atmosphere',
    status: 'planned',
    targetWordCount: 1900,
    slug: 'slowed-and-reverb-audio-effects-guide'
  },
  {
    id: 'med-03',
    categorySlug: 'video-tools',
    categoryName: 'Video Tools',
    workingTitle: 'Compressing and Converting MP4 Videos in the Browser Using WebAssembly FFmpeg',
    primaryKeyword: 'compress video online free without watermark',
    secondaryKeywords: ['video to gif converter', 'video aspect ratio converter 9:16', 'trim video in browser'],
    searchIntent: 'informational',
    targetToolIds: ['video-compressor', 'video-to-gif', 'video-aspect-ratio', 'video-trimmer'],
    workflowCluster: 'Video Transcoding & Sizing',
    status: 'planned',
    targetWordCount: 2050,
    slug: 'compress-convert-video-browser-ffmpeg-guide'
  },

  // ==========================================
  // 6. BUSINESS & FINANCIAL CALCULATORS (Articles 31-36)
  // ==========================================
  {
    id: 'fin-01',
    categorySlug: 'business-tools',
    categoryName: 'Business & Calculators',
    workingTitle: 'Financial Planning Tools: Understanding SIP, Loan EMI, and GST Calculations',
    primaryKeyword: 'emi calculator loan online',
    secondaryKeywords: ['compound interest calculator', 'gst calculator online', 'sip investment calculation formula'],
    searchIntent: 'informational',
    targetToolIds: ['emi-calculator', 'compound-interest-calculator', 'gst-invoice-generator', 'personal-loan-calculator'],
    workflowCluster: 'Financial Modeling & Amortization',
    status: 'published',
    targetWordCount: 2400,
    slug: 'financial-calculators-sip-emi-gst-guide'
  },
  {
    id: 'fin-02',
    categorySlug: 'business-tools',
    categoryName: 'Business Tools',
    workingTitle: 'Invoicing Compliance Guide: Essential Elements of a Valid GST and Corporate Invoice',
    primaryKeyword: 'free gst invoice generator',
    secondaryKeywords: ['create business invoice online', 'invoice formatting requirements', 'professional business card qr maker'],
    searchIntent: 'informational',
    targetToolIds: ['gst-invoice-generator', 'qr-business-card-generator', 'roi-profit-margin-calculator'],
    workflowCluster: 'Billing & Commercial Documents',
    status: 'planned',
    targetWordCount: 1950,
    slug: 'gst-invoice-compliance-commercial-billing-guide'
  },
  {
    id: 'fin-03',
    categorySlug: 'calculators',
    categoryName: 'Calculators',
    workingTitle: 'Mortgage & Home Loan Affordability: Down Payments, Debt-to-Income, and Amortization Schedules',
    primaryKeyword: 'mortgage calculator with amortization schedule',
    secondaryKeywords: ['home loan down payment calculator', 'loan eligibility calculator', 'interest vs principal breakdown'],
    searchIntent: 'informational',
    targetToolIds: ['loan-mortgage-calculator', 'down-payment-calculator', 'loan-eligibility-calculator'],
    workflowCluster: 'Real Estate & Lending Formulas',
    status: 'planned',
    targetWordCount: 2100,
    slug: 'mortgage-loan-eligibility-amortization-guide'
  },

  // ==========================================
  // 7. CAREER & RESUME TOOLS CLUSTER (Articles 37-42)
  // ==========================================
  {
    id: 'car-01',
    categorySlug: 'career-tools',
    categoryName: 'Career & Resume Tools',
    workingTitle: 'Beating the ATS: The Complete Guide to Applicant Tracking Systems & Resume Optimization',
    primaryKeyword: 'ats resume checker online free',
    secondaryKeywords: ['ats resume builder', 'resume keyword optimizer', 'ats friendly resume format'],
    searchIntent: 'informational',
    targetToolIds: ['resume-builder', 'ats-resume-checker', 'resume-keyword-optimizer', 'cover-letter-builder', 'salary-hike-calculator'],
    workflowCluster: 'ATS & Candidate Sourcing',
    status: 'published',
    targetWordCount: 2300,
    slug: 'ats-resume-optimization-career-guide'
  },
  {
    id: 'car-02',
    categorySlug: 'career-tools',
    categoryName: 'Career Tools',
    workingTitle: 'Salary Negotiation Science: Calculating CTC Components, In-Hand Pay, and Hike Percentages',
    primaryKeyword: 'salary hike calculator percentage',
    secondaryKeywords: ['ctc calculator in hand', 'notice period calculator working days', 'experience calculator resume'],
    searchIntent: 'informational',
    targetToolIds: ['salary-hike-calculator', 'ctc-calculator', 'notice-period-calculator', 'experience-calculator'],
    workflowCluster: 'Compensation & Career Transition',
    status: 'planned',
    targetWordCount: 2000,
    slug: 'salary-negotiation-ctc-hike-calculator-guide'
  },
  {
    id: 'car-03',
    categorySlug: 'career-tools',
    categoryName: 'Career Tools',
    workingTitle: 'LinkedIn Profile Architecture: Crafting High-Conversion Headlines, Summaries, and Badges',
    primaryKeyword: 'linkedin headline generator professional',
    secondaryKeywords: ['linkedin summary generator', 'resume score analyzer', 'professional skills library'],
    searchIntent: 'informational',
    targetToolIds: ['linkedin-headline-generator', 'linkedin-summary-generator', 'resume-score-analyzer', 'professional-skill-library'],
    workflowCluster: 'Professional Branding & Sourcing',
    status: 'planned',
    targetWordCount: 1900,
    slug: 'linkedin-profile-headline-summary-optimization-guide'
  },

  // ==========================================
  // 8. TEXT & WRITING TOOLS CLUSTER (Articles 43-48)
  // ==========================================
  {
    id: 'txt-01',
    categorySlug: 'text-tools',
    categoryName: 'Text & Writing Tools',
    workingTitle: 'Clean Text Processing: Diffs, Word Counts, ATS Formatting & Case Conversion',
    primaryKeyword: 'text compare tool diff online',
    secondaryKeywords: ['remove duplicate lines text', 'case converter online uppercase lowercase', 'clean text formatting'],
    searchIntent: 'informational',
    targetToolIds: ['text-compare', 'remove-duplicate-lines', 'case-converter', 'word-counter', 'text-cleaner'],
    workflowCluster: 'Text Sanitization & Deduplication',
    status: 'published',
    targetWordCount: 2150,
    slug: 'clean-text-processing-formatting-guide'
  },
  {
    id: 'txt-02',
    categorySlug: 'text-tools',
    categoryName: 'Text & Writing Tools',
    workingTitle: 'Markdown Mastery for Technical Documentation: Syntax, Formatting, and HTML Rendering',
    primaryKeyword: 'markdown editor online with live preview',
    secondaryKeywords: ['markdown to html converter', 'technical documentation formatting', 'clean markdown syntax'],
    searchIntent: 'informational',
    targetToolIds: ['markdown-editor', 'markdown-to-html', 'reading-time-calculator', 'character-counter'],
    workflowCluster: 'Technical Authoring & Markdown',
    status: 'planned',
    targetWordCount: 1850,
    slug: 'markdown-syntax-technical-writing-guide'
  },

  // ==========================================
  // 9. AI PROMPT BUILDER TOOLS CLUSTER (Articles 49-54)
  // ==========================================
  {
    id: 'ai-01',
    categorySlug: 'prompt-tools',
    categoryName: 'AI Prompt Builder Tools',
    workingTitle: 'AI Prompt Engineering Mastery: Structuring Role, Context, and Few-Shot Directives',
    primaryKeyword: 'ai prompt builder chatgpt claude gemini',
    secondaryKeywords: ['midjourney prompt builder parameters', 'flux prompt generator', 'seo prompt engineering'],
    searchIntent: 'informational',
    targetToolIds: ['chatgpt-prompt-builder', 'claude-prompt-builder', 'gemini-prompt-builder', 'midjourney-prompt-builder', 'flux-prompt-builder'],
    workflowCluster: 'LLM & Image Diffusion Prompting',
    status: 'published',
    targetWordCount: 2450,
    slug: 'ai-prompt-engineering-mastery-guide'
  },
  {
    id: 'ai-02',
    categorySlug: 'prompt-tools',
    categoryName: 'AI Prompt Builders',
    workingTitle: 'Diffusion Model Prompting: Lighting, Camera Lenses, and Aspect Ratios in Midjourney & Flux',
    primaryKeyword: 'midjourney prompt formula guide',
    secondaryKeywords: ['flux ai prompt parameters', 'product photography prompt builder', 'logo prompt engineering'],
    searchIntent: 'informational',
    targetToolIds: ['midjourney-prompt-builder', 'flux-prompt-builder', 'product-photo-prompt-builder', 'logo-prompt-builder'],
    workflowCluster: 'Image Diffusion Prompts',
    status: 'planned',
    targetWordCount: 2100,
    slug: 'diffusion-model-prompting-lighting-camera-guide'
  },

  // ==========================================
  // 10. GENERATORS, DESIGN & HEALTH (Articles 55-60)
  // ==========================================
  {
    id: 'gen-01',
    categorySlug: 'generators',
    categoryName: 'Generators & Productivity',
    workingTitle: 'QR Code Engineering: Error Correction Levels, Data Encodings, and Security Auditing',
    primaryKeyword: 'qr code generator high resolution',
    secondaryKeywords: ['qr code safety checker', 'barcode scanner online', 'qr code error correction level H'],
    searchIntent: 'informational',
    targetToolIds: ['qr-generator', 'qr-code-safety-checker', 'barcode-generator', 'barcode-scanner'],
    workflowCluster: 'Matrix Barcodes & Verification',
    status: 'planned',
    targetWordCount: 1950,
    slug: 'qr-code-engineering-security-error-correction-guide'
  },
  {
    id: 'des-01',
    categorySlug: 'design-tools',
    categoryName: 'Design & Utility Tools',
    workingTitle: 'Modern CSS Visual Effects: Mastering Glassmorphism, Neumorphism, and Dynamic Box Shadows',
    primaryKeyword: 'glassmorphism css generator',
    secondaryKeywords: ['neumorphism css code generator', 'box shadow generator multi layer', 'css gradient generator smooth'],
    searchIntent: 'informational',
    targetToolIds: ['glassmorphism-generator', 'neumorphism-generator', 'box-shadow-generator', 'css-gradient-generator'],
    workflowCluster: 'CSS Stylers & UI Effects',
    status: 'planned',
    targetWordCount: 2000,
    slug: 'modern-css-glassmorphism-box-shadows-guide'
  },
  {
    id: 'hea-01',
    categorySlug: 'health-fitness',
    categoryName: 'Health & Fitness',
    workingTitle: 'Nutritional Energy Balance: BMR, TDEE, Caloric Surpluses, and Macronutrient Splits',
    primaryKeyword: 'tdee calorie calculator bulking cutting',
    secondaryKeywords: ['weight gain calculator macro split', 'daily water intake calculator formula', 'bmr calculation formula'],
    searchIntent: 'informational',
    targetToolIds: ['calorie-calculator', 'weight-gain-calculator', 'water-intake-calculator'],
    workflowCluster: 'Energy Balance & Metabolism',
    status: 'planned',
    targetWordCount: 1900,
    slug: 'tdee-calorie-macronutrient-energy-balance-guide'
  },
  {
    id: 'sec-01',
    categorySlug: 'generators',
    categoryName: 'Generators & Productivity',
    workingTitle: 'Password Entropy and Cryptographic Security: Why Passphrases Beat Complex Characters',
    primaryKeyword: 'password generator high entropy',
    secondaryKeywords: ['diceware passphrase generator', 'password strength checker bit entropy', 'sha256 hash generator'],
    searchIntent: 'informational',
    targetToolIds: ['random-password-generator', 'passphrase-generator', 'password-strength-checker', 'sha256-hash-generator'],
    workflowCluster: 'Cryptographic Entropy & Passwords',
    status: 'planned',
    targetWordCount: 2050,
    slug: 'password-entropy-passphrases-cryptographic-security-guide'
  }
];

export function getRoadmapByCategory(categorySlug: string): SeoTopicPlan[] {
  return SEO_TOPICAL_AUTHORITY_ROADMAP.filter(t => t.categorySlug === categorySlug);
}

export function getPublishedTopicArticles(): SeoTopicPlan[] {
  return SEO_TOPICAL_AUTHORITY_ROADMAP.filter(t => t.status === 'published');
}
