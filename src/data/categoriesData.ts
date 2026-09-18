export interface CategoryItem {
  slug: string;
  nameKey: string;
  defaultName: string;
  icon: string;
  description: string;
  match: (toolCategory: string) => boolean;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    slug: 'all',
    nameKey: 'allCategories',
    defaultName: 'All Tools',
    icon: '⚡',
    description: 'Explore our complete directory of 100+ free online browser utilities.',
    match: () => true,
  },
  {
    slug: 'pdf-tools',
    nameKey: 'pdfToolsCategory',
    defaultName: 'PDF Tools',
    icon: '📄',
    description: 'Merge, split, convert, rotate, reorder, protect & edit PDF documents.',
    match: (cat) => cat.toLowerCase().includes('pdf'),
  },
  {
    slug: 'image-tools',
    nameKey: 'imageToolsCategory',
    defaultName: 'Image Tools',
    icon: '🖼️',
    description: 'Compress, convert, resize, crop, rotate, watermark & edit photos instantly.',
    match: (cat) => cat.toLowerCase().includes('image'),
  },
  {
    slug: 'creator-tools',
    nameKey: 'creatorToolsCategory',
    defaultName: 'Creator & Social Tools',
    icon: '🎬',
    description: 'YouTube, Instagram, TikTok & LinkedIn generator suite for content creators.',
    match: (cat) => cat.toLowerCase().includes('creator') || cat.toLowerCase().includes('social'),
  },
  {
    slug: 'video-tools',
    nameKey: 'videoToolsCategory',
    defaultName: 'Video Tools',
    icon: '📹',
    description: 'Create satisfying puzzle animation shorts, video reels & interactive clip generators.',
    match: (cat) => cat.toLowerCase().includes('video'),
  },
  {
    slug: 'business-tools',
    nameKey: 'businessToolsCategory',
    defaultName: 'Business Tools',
    icon: '🧾',
    description: 'Create GST invoices, business cards & business productivity tools.',
    match: (cat) => cat.toLowerCase().includes('business'),
  },
  {
    slug: 'text-tools',
    nameKey: 'textToolsCategory',
    defaultName: 'Text & Writing Tools',
    icon: '✍️',
    description: 'Case converter, word counter, text diff, text cleaner, markdown editor & line sorter.',
    match: (cat) => cat.toLowerCase().includes('text') || cat.toLowerCase().includes('writing'),
  },
  {
    slug: 'career-tools',
    nameKey: 'careerToolsCategory',
    defaultName: 'Career & Resume Tools',
    icon: '💼',
    description: 'ATS resume builder, cover letters, salary hike & experience calculators.',
    match: (cat) => cat.toLowerCase().includes('career') || cat.toLowerCase().includes('resume'),
  },
  {
    slug: 'developer-tools',
    nameKey: 'devToolsCategory',
    defaultName: 'Developer Tools',
    icon: '👨‍💻',
    description: 'Format JSON/XML/HTML, test regex, decode JWTs, convert colors & timestamps.',
    match: (cat) => cat.toLowerCase().includes('developer') || cat.toLowerCase().includes('dev'),
  },
  {
    slug: 'design-tools',
    nameKey: 'designToolsCategory',
    defaultName: 'Design & Utility Tools',
    icon: '🎨',
    description: 'CSS gradients, box shadows, unit converters, EMI & age calculators.',
    match: (cat) => cat.toLowerCase().includes('design') || cat.toLowerCase().includes('utility'),
  },
  {
    slug: 'prompt-tools',
    nameKey: 'promptToolsCategory',
    defaultName: 'AI Prompt Builder Tools',
    icon: '🤖',
    description: 'ChatGPT, Gemini, Claude, Veo, Midjourney & Flux prompt generator suite.',
    match: (cat) => cat.toLowerCase().includes('prompt') || cat.toLowerCase().includes('ai'),
  },
  {
    slug: 'health-fitness',
    nameKey: 'healthFitnessCategory',
    defaultName: 'Health & Fitness',
    icon: '💪',
    description: 'Calculate calories, macros, bulking targets, and fitness benchmarks.',
    match: (cat) => cat.toLowerCase().includes('health') || cat.toLowerCase().includes('fitness'),
  },
  {
    slug: 'generators',
    nameKey: 'generatorsCategory',
    defaultName: 'Generators & Productivity',
    icon: '⚡',
    description: 'QR generators, password generators, hashes, UUIDs & productivity tools.',
    match: (cat) => cat.toLowerCase().includes('generator') || cat.toLowerCase().includes('security') || cat.toLowerCase().includes('productivity'),
  },
];

export function getCategoryBySlug(slug?: string): CategoryItem {
  if (!slug) return CATEGORIES_DATA[0];
  const found = CATEGORIES_DATA.find((c) => c.slug === slug.toLowerCase());
  return found || CATEGORIES_DATA[0];
}
