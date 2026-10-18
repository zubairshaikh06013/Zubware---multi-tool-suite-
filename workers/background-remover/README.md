# Zubware Background Remover Worker

This standalone Cloudflare Worker is independent of the main Vite/Cloudflare Pages website.

Cloudflare Worker **Settings → Builds → Git repository**:
- Repository: `zubairshaikh06013/Zubware---multi-tool-suite-`
- Production branch: `main`
- Build command: **leave blank** (if required: `echo Worker-only deployment`)
- Deploy command: `npx wrangler deploy --config workers/background-remover/wrangler.jsonc`
- Preview command: leave blank.

The config intentionally uses the same Worker name, `zubware-background-remover`. Review and preserve existing custom domain `api.zubware.com` and bindings before deploying. It declares the Images binding `IMAGES` and rate limiter `RATE_LIMITER` (namespace `1001`, 5 requests / 60 seconds). Existing production bindings should be checked after the first deploy. No secrets are required by this code.

CORS supports zubware.com, www.zubware.com, the project's pages.dev host, and its subdomain previews. Requests from other origins are rejected. CORS is **not authentication**. Browser preflight OPTIONS is supported. Image upload is server-side: do not claim browser-only privacy for this API. Test real image removal before promoting it.

**Important:** Do not click Cloudflare Connect until this PR is merged to main and build/deploy commands are set as above. The website's `npm run build` is not the Worker build.

## No-paid-API safeguard (2026-10-18)

The owner requires no paid APIs. Remote image processing is disabled in the frontend and the Worker fails closed unless `REMOTE_BACKGROUND_REMOVAL_ENABLED` is exactly `"true"`. Both checked-in Worker configurations set it to `"false"`. Requests are rejected before upload reads, rate-limiter calls or Images transformations. Browser Quick/Private modes remain available.

Do not enable the flag, add a paid API, upgrade a plan or purchase resources without the owner's explicit authorization. Cloudflare Images Free has a hard transformation allowance, while paid plans can incur usage charges. The connector could not read billing/subscriptions, so the actual account plan and any existing bill were not verified. This guard does not cancel existing subscriptions or guarantee that unrelated Cloudflare services incur no charges.
