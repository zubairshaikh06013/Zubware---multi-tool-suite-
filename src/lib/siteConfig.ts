export const SITE_ORIGIN = 'https://www.zubware.com';
export const SITE_HOST = 'www.zubware.com';
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;

// Keep the initial HTML, generated landing page and client navigation consistent.
export const HOMEPAGE_SEO = {
  title: 'Zubware — Free Online Multi-Tool Suite',
  description: 'Explore 300+ free online tools for PDFs, images, video, developers, calculators, and productivity. Processing options and limits vary by tool.',
} as const;

export function absoluteUrl(path: string = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${cleanPath}`;
}
