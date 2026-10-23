# Zubware ChatGPT plugin — integration draft

This draft exposes the **entire current website catalogue: 309 tools in 16 categories** through three MCP tools and an MCP Apps panel. The panel renders the existing website components directly, rather than embedding the public website in another iframe. Lazy loading keeps each tool's code separate. No OpenAI API key, paid AI integration, new account system, or file storage service is introduced.

## What works at the code/protocol level

- `list_categories`: counts across the complete catalogue.
- `search_tools`: paginated search and category filtering over website metadata.
- `open_tool`: opens an existing tool component in the panel, using the exact tool ID.
- Users select inputs and operate the existing tool interface in the panel.
- English/Hindi tool language selector, mobile layout, canonical website fallback links.
- The generator reads `src/data/toolsData.ts` and the tool render block in `src/App.tsx`, failing the build if any website tool has no component mapping. Generated files are intentionally not committed.

**Opening a tool does not process a file.** The MCP layer does not implement automatic execution from chat attachments, result download back into the conversation, or server-side file processing. All catalogue entries carry `chatgptVerified: false`. Browser processing, permissions, external model downloads, exports, workers, media codecs and storage must be verified in ChatGPT before claiming compatibility for any individual tool.

## Local build

Use Node 22 or newer. From the repository root:

```sh
npm ci
node scripts/prepareVideoEngine.mjs
cd chatgpt-plugin
npm ci
npm run build
npm run check
npm test
npm start
```

Open `http://localhost:8787/` for the standalone panel; MCP is at `http://localhost:8787/mcp`. Set `PORT` if needed. For external hosting, set `PUBLIC_ORIGIN` to the public HTTPS origin; this origin is used for absolute widget asset URLs and the widget CSP. Keep it a trusted deployment setting, never a user input.

The standalone server is a development/deployment entrypoint, not an automatic Cloudflare deployment. A production host needs HTTPS, appropriate traffic limits and operational monitoring. No paid infrastructure has been provisioned.

## Connect and test in ChatGPT

After deploying the server and static assets to an HTTPS host:

1. Add its HTTPS `/mcp` URL as a custom MCP connection using the app/plugin setup available to the account.
2. Select Zubware in a new conversation. Try “Find a photo resizing tool”, then open the returned `image-resizer` ID.
3. Supply a harmless sample image in the panel, resize it, and verify the downloaded dimensions. Repeat with PDF merge/compression, QR generation, calculators, Hindi licence practice and text tools before widening compatibility claims.

Account availability and public distribution follow OpenAI's current requirements. Public directory review/submission has **not** been performed.

Official implementation reference: https://developers.openai.com/plugins/build/app-quickstart

## Validation and remaining work

Completed locally: all 309 metadata/component mappings; production widget build; plugin TypeScript check; MCP handshake, tool discovery, pagination, invalid arguments/IDs, canonical paths, resource URLs; HTTP widget/static asset responses and traversal rejection.

Not completed: visual browser QA (Chromium download failed in the execution environment), live ChatGPT connection, per-tool upload/processing/download tests, sandbox camera/microphone/storage behavior, codec/worker compatibility, public deployment and directory submission. Root-relative media-engine requests and third-party model resources may need dedicated sandbox adapters. The whole catalogue is integrated at the interface level; this is **not** a claim that all 309 tools already run successfully inside ChatGPT.

External processing behavior remains that of each existing tool, including the website's background-removal endpoint. Review these per-tool data flows and update user-facing privacy information before public release. Do not enter real identity documents, passwords or confidential records during testing.

## Hosted deployment

The Pages workflow builds and publishes the standalone panel at `https://www.zubware.com/chatgpt-plugin/`. The Cloudflare entry point is `worker.mjs`; build its single-module bundle with `node build-worker.mjs` after building the panel with `ZUBWARE_PLUGIN_BASE=/chatgpt-plugin/`. It serves a stateless `/mcp` endpoint and `/health`. The Worker loads the current widget HTML from the website on each resource request; hashed static assets come from the website. No new storage service or paid plan is required. Website asset hash changes do not require a Worker redeployment. Redeploy the Worker when its MCP catalogue or server logic changes.

Worker-specific validation: `node --test test-worker.mjs` after building the bundle. This validates the real Worker handler, MCP protocol, hosted resource URLs, body size, origin checks and routes. It is separate from live ChatGPT per-tool validation.
