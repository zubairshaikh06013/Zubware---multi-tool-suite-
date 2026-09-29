export const SITE_ORIGIN = 'https://www.zubware.com';
export const SITE_HOST = 'www.zubware.com';
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;

export function absoluteUrl(path: string = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${cleanPath}`;
}
