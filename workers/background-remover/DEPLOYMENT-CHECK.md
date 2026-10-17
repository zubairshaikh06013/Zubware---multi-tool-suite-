# Worker Git deployment check

Cloudflare Worker build settings: `echo Worker build ready` and `npx wrangler deploy --config workers/background-remover/wrangler.jsonc`.

This change triggers the first Git-connected build after connecting the repository. Verify deployment logs, `api.zubware.com`, Images and RATE_LIMITER bindings, and a real photo test before marking the service working.
