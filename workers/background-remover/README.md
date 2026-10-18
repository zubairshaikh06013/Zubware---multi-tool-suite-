# Zubware Background Remover Worker

This standalone Cloudflare Worker is independent of the main Vite/Cloudflare Pages website.

Cloudflare Worker **Settings → Builds → Git repository**:
- Repository: `zubairshaikh06013/Zubware---multi-tool-suite-`
- Production branch: `main`
- Root directory: `workers/background-remover`
- Build command: `node --check src/index.js`
- Deploy command: `npx wrangler@4.151.1 deploy --config wrangler.jsonc`
- Preview builds: disabled.

The config intentionally uses the same Worker name, `zubware-background-remover`. Review and preserve existing custom domain `api.zubware.com` and bindings before deploying. It declares the Images binding `IMAGES` and rate limiter `RATE_LIMITER` (namespace `1001`, 5 requests / 60 seconds). Existing production bindings should be checked after the first deploy. No secrets are required by this code.

CORS supports zubware.com, www.zubware.com, the project's pages.dev host, and its subdomain previews. Requests from other origins are rejected. CORS is **not authentication**. Browser preflight OPTIONS is supported. If explicitly enabled in future, this API processes uploads server-side. It is currently disabled; verify POST returns 503 without invoking Images. Browser Quick/Private modes remain local.

The Worker is Git-connected. The website’s `npm run build` is not the Worker build; website deployment is handled separately by Cloudflare Pages.

## Free AI and cost controls

The owner allows free AI features and does not authorize paid APIs, subscriptions, or automatic upgrades. This Worker uses the existing Cloudflare Images binding with foreground segmentation and a 5-per-minute per-IP rate limiter. It does not enable a plan or add an AI provider. The online mode requires photo-upload consent; Quick and Private modes run locally.

Cloudflare states Images Free includes 5,000 unique transformations monthly and rejects new transformations after that without a charge or automatic plan upgrade. Paid Images includes the first 5,000 transformations, then charges for overage. We cannot read this account's Images plan or total usage with the current connector. Therefore do not describe an unknown existing Paid plan as a guaranteed zero bill. If no-charge operation must be guaranteed across account settings, confirm Images Free in Cloudflare billing before relying on the online mode. On 503 or rate limits, users can switch to local processing.

Sources: https://developers.cloudflare.com/images/pricing/ and https://developers.cloudflare.com/images/optimization/binding/
