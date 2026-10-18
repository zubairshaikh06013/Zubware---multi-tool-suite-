// Optional Cloudflare Images background-removal endpoint.
// Deploy separately; does not change Zubware's existing browser-only processing.
const MAX_BYTES = 10 * 1024 * 1024;
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/remove-background') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return new Response('POST required', { status: 405, headers: { Allow: 'POST' } });
    const origin = request.headers.get('Origin');
    // This is NOT an authentication or anti-abuse mechanism; add rate limiting before public deployment.
    if (origin && origin !== 'https://www.zubware.com' && origin !== 'https://zubware.com') {
      return new Response('Origin not allowed', { status: 403 });
    }
    // Fail closed before reading uploads or invoking any metered service.
    if (env.REMOTE_BACKGROUND_REMOVAL_ENABLED !== "true") {
      return new Response("Online removal is unavailable. Use Quick Removal or Private Removal at https://www.zubware.com/background-remover", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": origin || "https://www.zubware.com", "Vary": "Origin" }
      });
    }
    const type = (request.headers.get('Content-Type') || '').split(';')[0].trim();
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(type)) return new Response('Upload JPG, PNG or WebP', { status: 415 });
    const length = Number(request.headers.get('Content-Length') || 0);
    if (length > MAX_BYTES) return new Response('Image too large', { status: 413 });
    if (!env.IMAGES) return new Response('Images binding not configured', { status: 503 });
    try {
      const data = await request.arrayBuffer();
      if (!data.byteLength || data.byteLength > MAX_BYTES) return new Response('Invalid image size', { status: 413 });
      const transformed = await env.IMAGES.input(new Blob([data], { type }).stream())
        .transform({ segment: 'foreground' })
        .output({ format: 'image/png' });
      const response = transformed.response();
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'Access-Control-Allow-Origin': origin || 'https://www.zubware.com',
          'Vary': 'Origin'
        }
      });
    } catch (error) {
      console.error('Image transformation failed', error);
      return new Response('Background removal unavailable', { status: 502 });
    }
  }
};
