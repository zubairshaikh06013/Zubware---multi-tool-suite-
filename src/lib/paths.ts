export const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

export const BASE_PATH = BASE_URL === '/' ? '' : BASE_URL.replace(/\/$/, '');

/**
 * Returns a full clean href suitable for <a> tags.
 * Example: getLinkUrl('/image-compressor.html') => '/image-compressor'
 * Example: getLinkUrl('/about.html') => '/about'
 */
export function getLinkUrl(path?: string): string {
  if (!path || path === '/' || path === '/index.html') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    // If it's an internal absolute URL to zubware.com, strip trailing .html from web pages
    return path.replace(/(https?:\/\/(?:www\.)?zubware\.com\/[a-zA-Z0-9_-]+)\.html(\?.*)?$/g, '$1$2');
  }
  let cleanPath = path.startsWith('/') ? path : '/' + path;
  // Clean trailing .html from web routes (keep index.html as root, don't strip static assets)
  if (cleanPath.endsWith('.html') && cleanPath !== '/index.html' && cleanPath !== '/404.html') {
    cleanPath = cleanPath.slice(0, -5);
  }
  if (BASE_PATH && cleanPath.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Normalizes a full browser pathname into an internal route path.
 */
export function normalizePath(pathname?: string): string {
  if (!pathname) return '/';
  let p = pathname;
  if (BASE_PATH && p.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  // Strip trailing .html from route matching (except index.html)
  if (p.endsWith('.html') && p !== '/index.html' && p !== '/404.html') {
    p = p.slice(0, -5);
  }
  return p === '' ? '/' : p;
}
