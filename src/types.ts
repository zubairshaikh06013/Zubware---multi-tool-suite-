export type ToolId = 
  | 'splitdrop' 
  | 'background-remover'
  | 'image-compressor' 
  | 'image-converter' 
  | 'image-resizer'
  | 'crop-image'
  | 'rotate-image'
  | 'flip-image'
  | 'image-watermark'
  | 'blur-image'
  | 'pixelate-image'
  | 'exif-remover'
  | 'image-color-picker'
  | 'image-info-viewer'
  | 'background-color-changer'
  | 'rounded-corners'
  | 'image-border'
  | 'image-frame'
  | 'image-collage'
  | 'favicon-generator'
  | 'svg-optimizer'
  | 'gif-maker'
  | 'batch-image-converter'
  | 'compression-comparison'
  | 'heic-to-jpg'
  | 'bulk-image-renamer-resizer'
  | 'passport-photo-maker'
  | 'matching-parts-video-maker'
  | 'lofi-song-maker'
  | 'lofi-maker'
  | 'slowed-and-reverb'
  | 'gst-invoice-generator'
  | 'pdf-merge' 
  | 'pdf-split' 
  | 'image-to-pdf'
  | 'pdf-to-images'
  | 'rotate-pdf'
  | 'delete-pdf-pages'
  | 'extract-pdf-pages'
  | 'reorder-pdf-pages'
  | 'pdf-watermark'
  | 'protect-pdf'
  | 'unlock-pdf'
  | 'pdf-metadata'
  | 'qr-generator'
  | 'resume-builder'
  | 'ats-resume-checker'
  | 'resume-score-analyzer'
  | 'cover-letter-builder'
  | 'cover-letter-templates'
  | 'cv-builder'
  | 'resume-keyword-optimizer'
  | 'resume-template-gallery'
  | 'resume-version-manager'
  | 'resume-import'
  | 'resume-export'
  | 'resume-completeness'
  | 'resume-section-manager'
  | 'professional-skill-library'
  | 'summary-generator'
  | 'resume-color-themes'
  | 'experience-calculator'
  | 'notice-period-calculator'
  | 'salary-hike-calculator'
  | 'ctc-calculator'
  | 'working-days-calculator'
  | 'youtube-title-generator'
  | 'youtube-description-generator'
  | 'youtube-tags-generator'
  | 'youtube-hashtag-generator'
  | 'youtube-thumbnail-simulator'
  | 'youtube-banner-safe-area'
  | 'youtube-thumbnail-preview'
  | 'youtube-channel-name-generator'
  | 'youtube-video-idea-generator'
  | 'youtube-playlist-name-generator'
  | 'youtube-timestamp-generator'
  | 'youtube-description-formatter'
  | 'thumbnail-text-generator'
  | 'viral-hook-generator'
  | 'cta-generator'
  | 'social-character-counter'
  | 'emoji-generator'
  | 'instagram-caption-generator'
  | 'instagram-hashtag-generator'
  | 'instagram-bio-generator'
  | 'instagram-username-generator'
  | 'tiktok-caption-generator'
  | 'tiktok-hashtag-generator'
  | 'facebook-caption-generator'
  | 'facebook-hashtag-generator'
  | 'linkedin-headline-generator'
  | 'linkedin-summary-generator'
  | 'twitter-bio-generator'
  | 'universal-hashtag-generator'
  | 'fancy-text-generator'
  | 'unicode-font-generator'
  | 'text-decorator'
  | 'emoji-combiner'
  | 'social-media-post-formatter'
  | 'social-bio-link-builder'
  | 'islamic-shorts-maker'
  | 'script-to-video-maker'
  | 'uuid-generator'
  | 'hash-generator'
  | 'jwt-decoder'
  | 'unix-timestamp-converter'
  | 'regex-tester'
  | 'json-formatter'
  | 'json-validator'
  | 'json-to-csv'
  | 'csv-to-json'
  | 'csv-viewer'
  | 'website-downloader'
  | 'html-formatter'
  | 'css-formatter'
  | 'javascript-formatter'
  | 'xml-formatter'
  | 'xml-validator'
  | 'url-parser'
  | 'url-encoder-decoder'
  | 'base64-encoder-decoder'
  | 'html-escape-unescape'
  | 'http-header-viewer'
  | 'api-request-builder'
  | 'color-converter'
  | 'qr-code-decoder'
  | 'css-gradient-generator'
  | 'box-shadow-generator'
  | 'border-radius-generator'
  | 'glassmorphism-generator'
  | 'neumorphism-generator'
  | 'css-clip-path-generator'
  | 'svg-shape-generator'
  | 'color-palette-generator'
  | 'contrast-checker'
  | 'random-color-generator'
  | 'qr-business-card-generator'
  | 'unit-converter'
  | 'percentage-calculator'
  | 'age-calculator'
  | 'emi-calculator'
  | 'discount-calculator'
  | 'currency-calculator'
  | 'tip-calculator'
  | 'random-number-generator'
  | 'random-password-generator'
  | 'number-to-words'
  | 'words-to-number'
  | 'roman-numeral-converter'
  | 'loan-calculator'
  | 'roi-calculator'
  | 'compound-interest-calculator'
  | 'learning-licence-mock-test'
  | 'chatgpt-prompt-builder'
  | 'gemini-prompt-builder'
  | 'claude-prompt-builder'
  | 'veo-prompt-builder'
  | 'midjourney-prompt-builder'
  | 'flux-prompt-builder'
  | 'stable-diffusion-prompt-builder'
  | 'logo-prompt-builder'
  | 'thumbnail-prompt-builder'
  | 'product-photo-prompt-builder'
  | 'interior-design-prompt-builder'
  | 'story-prompt-builder'
  | 'youtube-script-prompt-builder'
  | 'resume-prompt-builder'
  | 'cover-letter-prompt-builder'
  | 'email-prompt-builder'
  | 'social-media-prompt-builder'
  | 'seo-prompt-builder'
  | 'coding-prompt-builder'
  | 'universal-prompt-builder'
  | 'password-generator'
  | 'password-strength-checker'
  | 'qr-code-safety-checker'
  | 'qr-code-scanner'
  | 'barcode-scanner'
  | 'text-encrypt-decrypt'
  | 'sha-checksum-generator'
  | 'passphrase-generator'
  | 'secure-notes'
  | 'todo-list'
  | 'clipboard-history'
  | 'pomodoro-timer'
  | 'stopwatch'
  | 'online-stopwatch'
  | 'countdown-timer'
  | 'online-clock'
  | 'time-zone-converter'
  | 'habit-tracker'
  | 'expense-tracker'
  | 'monthly-budget-planner'
  | 'daily-planner'
  | 'weekly-planner'
  | 'calendar-notes'
  | 'file-checksum-verifier'
  | 'weight-gain-calculator'
  | 'pdf-size-adjuster'
  | 'increase-pdf-size'
  | 'decrease-pdf-size'
  | 'pdf-compressor'
  | 'pdf-to-jpg'
  | 'edit-pdf'
  | 'text-to-pdf'
  | 'signature-maker'
  | 'signature-resizer'
  | 'photo-signature-joiner'
  | 'photo-name-date-joiner'
  | 'text-to-handwriting'
  | 'omr-sheet-generator'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'pdf-to-text'
  | 'pdf-to-excel'
  | 'pdf-page-number'
  | 'pdf-compare'
  | 'pdf-signature'
  | 'barcode-generator'
  | 'case-converter'
  | 'word-counter'
  | 'character-counter'
  | 'reading-time-calculator'
  | 'remove-duplicate-lines'
  | 'remove-empty-lines'
  | 'find-and-replace'
  | 'text-compare'
  | 'text-cleaner'
  | 'sort-lines'
  | 'lorem-ipsum-generator'
  | 'markdown-editor'
  | 'json-minifier'
  | 'json-to-xml'
  | 'xml-to-json'
  | 'markdown-to-html'
  | 'sql-formatter'
  | 'jwt-generator'
  | 'cron-expression-generator'
  | 'hex-color-generator'
  | 'rgb-color-generator'
  | 'random-name-picker'
  | 'calorie-calculator'
  | 'business-name-generator'
  | 'brand-name-generator'
  | 'coin-flip'
  | 'json-viewer'
  | 'name-picker-wheel'
  | 'loan-eligibility-calculator'
  | 'countdown-calculator'
  | 'timezone-converter'
  | 'dice-roller'
  | 'down-payment-calculator'
  | 'cement-calculator'
  | 'wavelength-calculator'
  | 'user-agent-parser'
  | 'mode-calculator'
  | 'inductance-calculator'
  | 'random-letter-generator'
  | 'water-intake-calculator'
  | 'json-to-yaml'
  | 'url-extractor'
  | 'bond-yield-calculator'
  | 'cat-age-calculator'
  | 'exam-score-calculator'
  | 'cgpa-calculator'
  | 'mileage-calculator'
  | 'paint-cost-calculator'
  | 'density-calculator'
  | 'screen-size-calculator'
  | 'torque-calculator'
  | 'linear-regression-calculator'
  | 'sha256-hash-generator'
  | 'us-income-tax-calculator'
  | 'personal-loan-calculator'
  | 'sale-price-calculator'
  | 'md5-hash-generator'
  | 'wide-text-generator'
  | 'typing-speed-test'
  | 'text-reverser'
  | 'remove-line-breaks'
  | 'remove-extra-spaces'
  | 'text-repeater'
  | 'text-splitter'
  | 'text-joiner'
  | 'email-extractor'
  | 'keyword-extractor'
  | 'html-entity-encoder-decoder'
  | 'text-to-binary'
  | 'binary-to-text'
  | 'text-to-hex'
  | 'hex-to-text'
  | 'css-minifier'
  | 'javascript-minifier'
  | 'html-minifier'
  | 'sql-minifier'
  | 'meta-tag-generator'
  | 'robots-txt-generator'
  | 'xml-sitemap-generator'
  | 'schema-markup-generator'
  | 'utm-builder'
  | 'scientific-calculator'
  | 'handwriting-to-text'
  | 'image-to-text'
  | 'barcode-scanner'
  | 'calendar-notes'
  | 'clipboard-history'
  | 'daily-planner'
  | 'expense-tracker'
  | 'file-checksum-verifier'
  | 'habit-tracker'
  | 'monthly-budget-planner'
  | 'passphrase-generator'
  | 'password-strength-checker'
  | 'pomodoro-timer'
  | 'secure-notes'
  | 'sha-checksum-generator'
  | 'text-encrypt-decrypt'
  | 'todo-list'
  | 'weekly-planner'
  | 'random-text-generator'
  | 'subtitle-generator'
  | 'video-aspect-ratio'
  | 'video-compressor'
  | 'video-to-audio'
  | 'video-to-gif'
  | 'video-trimmer';

export interface ToolMeta {
  id: ToolId;
  title: string;
  navTitle: string;
  seoTitle?: string;
  description: string;
  icon: string;
  path: string;
  filename: string;
  category: string;
  badge?: string;
  features: string[];
  tags?: string[];
  faq?: FAQItem[];
  trending?: boolean;
  featured?: boolean;
  editorsPick?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export type StudioMode = 'transform' | 'creator';

export interface LofiEffects {
  speed: number;
  pitch: number;
  lowPassFreq: number;
  highPassFreq: number;
  bassGain: number;
  trebleGain: number;
  reverbWet: number;
  reverbDecay: number;
  delayWet: number;
  delayTime: number;
  delayFeedback: number;
  vinylCrackle: number;
  vinylHiss: number;
  vinylPop: number;
  tapeHiss: number;
  tapeSaturation: number;
  tapeWow: number;
  tapeFlutter: number;
  stereoWidth: number;
  volume: number;
}

export interface AmbienceSettings {
  type: 'none' | 'rain' | 'night' | 'cafe' | 'fireplace' | 'thunderstorm' | 'forest';
  volume: number;
  muted: boolean;
}

export interface CreatorSettings {
  bpm: number;
  key: string;
  scale: 'minor' | 'major' | 'pentatonic' | 'dorian';
  mood: 'chill' | 'dreamy' | 'sad' | 'melancholic' | 'peaceful' | 'rainy' | 'study' | 'sleep' | 'nostalgic';
  durationSec: number;
  instrument: 'soft_piano' | 'electric_piano' | 'warm_keys' | 'synth_pad' | 'soft_bass' | 'pluck' | 'bell';
  swing: number;
  seed: string;
  enableDrums: boolean;
  enableBass: boolean;
  enableChords: boolean;
  enableMelody: boolean;
}

export interface VideoMakerSettings {
  aspectRatio: '16:9' | '9:16' | '1:1';
  bgType: 'cozy_room' | 'color' | 'gradient' | 'image';
  bgColor: string;
  bgGradient1: string;
  bgGradient2: string;
  bgImage: string | null;
  bgBlur: number;
  bgBrightness: number;
  showCover: boolean;
  coverImage: string | null;
  titleText: string;
  artistText: string;
  taglineText: string;
  visualizerMode: 'waveform' | 'spectrum' | 'bars' | 'circular' | 'minimal';
  visualizerColor: string;
}

export interface BlogArticleAuthor {
  name: string;
  url?: string;
  role?: string;
}

export interface BlogArticleSection {
  id: string;
  title: string;
  content: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  canonicalPath: string;
  publishedTime: string;
  modifiedTime: string;
  author: BlogArticleAuthor;
  publisher: {
    name: string;
    url: string;
  };
  category: string;
  readingTime: string;
  tags: string[];
  excerpt: string;
  takeaways?: string[];
  sections?: BlogArticleSection[];
  relatedToolIds: string[];
  faqs?: FAQItem[];
  howTo?: {
    name: string;
    description?: string;
    steps: { name: string; text: string }[];
  };
}

