# Worker deployment verification

Production branch: `main`. Root: `workers/background-remover`. Build: `node --check src/index.js`. Deploy: `npx wrangler@4.151.1 deploy --config wrangler.jsonc`. Preview builds are disabled.

Preserve the existing `api.zubware.com` custom domain and bindings. The checked-in `REMOTE_BACKGROUND_REMOVAL_ENABLED` value is `"false"`. Verify a POST from the website origin returns 503 with an on-device alternative, before any Images call. Root GET remains a health response and allowed OPTIONS remains 204.

Run `node --import tsx scripts/testCloudflareBackgroundRemoval.ts` from the repository root for Worker request-path regressions. Do not upgrade plans. Billing access is separate from deployment access; existing subscriptions were not verified.
