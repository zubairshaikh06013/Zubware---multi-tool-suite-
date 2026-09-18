export const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

export const BASE_PATH = BASE_URL === '/' ? '' : BASE_URL.replace(/\/$/, '');

/**
 * Returns a full href suitable for <a> tags.
 * Example: getLinkUrl('/image-compressor.html') => '/image-compressor.html'
 */
export function getLinkUrl(path?: string): string {
  if (!path || path === '/' || path === '/index.html') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  if (BASE_PATH && cleanPath.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Normalizes a full browser pathname into an internal route path.
 * Handles backward-compatibility if an incoming URL still has /Splitdrop prefix.
 * Example: normalizePath('/image-compressor.html') => '/image-compressor.html'
 * Example: normalizePath('/Splitdrop/image-compressor.html') => '/image-compressor.html'
 */
export function normalizePath(pathname?: string): string {
  if (!pathname) return '/';
  let p = pathname;
  // Strip legacy /splitdrop prefix if a user or search engine accesses an old link
  if (/^\/splitdrop(\/|$)/i.test(p)) {
    p = p.replace(/^\/splitdrop/i, '');
  }
  if (BASE_PATH && p.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  return p === '' ? '/' : p;
}
