const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_ORIGINS = new Set([
  "https://www.zubware.com",
  "https://zubware.com",
  "https://zubware---multi-tool-suite.pages.dev"
]);
const PREVIEW_HOST_SUFFIX = ".zubware---multi-tool-suite.pages.dev";

function allowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && url.username === "" && url.password === "" &&
      url.port === "" && url.pathname === "/" && !url.search && !url.hash &&
      url.hostname.endsWith(PREVIEW_HOST_SUFFIX) &&
      /^[a-z0-9-]+$/.test(url.hostname.slice(0, -PREVIEW_HOST_SUFFIX.length));
  } catch { return false; }
}
function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };
}
function error(message, status, origin, extra = {}) {
  return new Response(message, {
    status, headers: { ...headers(origin), ...extra, "Content-Type": "text/plain; charset=utf-8" }
  });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") {
      return new Response("Zubware Background Remover API", {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
      });
    }
    if (url.pathname !== "/remove-background") return new Response("Not found", { status: 404 });
    const origin = request.headers.get("Origin");
    if (!allowed(origin)) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });
    if (request.method !== "POST") return error("POST required", 405, origin, { Allow: "POST, OPTIONS" });
    if (!env.IMAGES || !env.RATE_LIMITER) return error("Worker bindings missing", 503, origin);
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) return error("Unable to verify request", 403, origin);
    try {
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return error("Too many requests. Try again later.", 429, origin, { "Retry-After": "60" });
      const type = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
      if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return error("Upload JPG, PNG or WebP", 415, origin);
      const length = Number(request.headers.get("Content-Length") || 0);
      if (length > MAX_BYTES) return error("Image exceeds 10 MB", 413, origin);
      const data = await request.arrayBuffer();
      if (!data.byteLength || data.byteLength > MAX_BYTES) return error("Invalid image size", 413, origin);
      const result = await env.IMAGES.input(new Blob([data], { type }).stream())
        .transform({ segment: "foreground" })
        .output({ format: "image/png" });
      const response = result.response();
      if (!response.ok) return error("Online AI is unavailable or the free allowance was reached. Choose Quick Removal or Private Removal.", 503, origin);
      return new Response(response.body, {
        status: 200, headers: { ...headers(origin), "Content-Type": "image/png" }
      });
    } catch (e) {
      console.error("Background removal error", e);
      return error("Online AI is unavailable or the free allowance was reached. Choose Quick Removal or Private Removal.", 503, origin);
    }
  }
};
