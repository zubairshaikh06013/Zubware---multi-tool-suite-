# Zubware AdSense review — 18 November 2026

## Conclusion and scope

The observed account and 16 November rejection email show only “Meet AdSense programme policies”; neither identifies a specific content issue or a duplicate account. The findings below are independently observed site defects, not a statement of Google's undisclosed rejection reason. This is a focused audit and correction pass, not certification of every tool or article.

Reviewed production Home, About, Contact, Privacy, Help, Terms, Age Calculator, Background Remover and YouTube Title Generator; inspected current repository main `ac3b7a45e3aec9b68f3cfd2184b2a59024d12dd7` and generated build output. Live title-generator controls were exercised in the browser. Official Google policy and YouTube documentation were checked on the review date.

## Confirmed defects corrected

| Finding | Evidence before correction | Correction |
| --- | --- | --- |
| Privacy disclosure differed before and after JavaScript | `/privacy` initial HTML omitted the Background Remover section; React contained online upload, consent and Cloudflare processing details | Both versions use the same three disclosure paragraphs; existing wording preserved |
| Help gave inaccurate processing/limit advice | Initial HTML said limits depended on RAM “rather than cloud upload quotas” and universally supported modern browsers | Seven shared, practical answers explain the 10 MB online photo limit, device/browser constraints, online processing, downloads, QR scanning and contact workflow |
| Title generator returned duplicate results | Selecting “Urgency & Secret Formula” on production displayed six identical titles | Replaced with six distinct Warnings & Checklists drafts; all 60 category/style combinations tested |
| Title reorder and copy controls were misleading | Re-shuffle only triggered a toast; clipboard success was shown before the promise resolved | Reorder Suggestions rotates the list and clears the old copied indicator; clipboard errors now show failure |
| Title documentation overstated optimization and described different controls | FAQs gave fixed truncation/CTR claims and listed categories/styles absent from the UI | Steps match the actual controls, explain local templates and their limits, remove unsupported CTR claims and show the documented 100-character limit |
| Empty fallback HTML | `public/404.html` had an empty body with a script-only SPA redirect | Added a page-not-found heading and home/directory/contact links; existing SPA redirect behavior retained |

No publisher ID, AdSense verification metadata, ads.txt, canonical rules or indexed tool URLs were changed. No tools or articles were deleted or blanket-noindexed. No AdSense application was resubmitted.

## Verification

- Production build passed: 314 tool pages, 53 article pages, 13 category hubs and 391 sitemap URLs in total.
- Generated-page validator passed all 391 canonical pages and 314 tool routes. Homepage crawl graph reached all 391 sitemap routes within three links.
- TypeScript passed.
- Existing SEO and tool reliability regression scripts passed, including calendar-age, export-format and related-link checks.
- New title test passed all 60 category/style combinations with normal, whitespace-only, Unicode and long topics (240 input combinations), requiring six unique drafts each.
- Build-content regression verifies the actual initial Privacy/Help HTML contains the shared disclosure paragraphs and FAQ answers.
- Supplemental generated HTML audit: 786 HTML files, 394 distinct route keys, zero findings after the fallback fix. The generator emits both flat `.html` files and clean `/index.html` files; its 392 duplicate file route keys do not mean 392 indexed duplicates.
- This executor's direct production HTTP requests returned 403, while web retrieval and the interactive browser loaded the pages. This is a verification limitation; it does not establish that Googlebot is blocked. Raw production robots/sitemap/ads HTTP behavior was not certified here.
- The localhost preview was unreachable from the browser, so validation used the deployed Cloudflare preview. Six distinct warning/checklist drafts, reorder, exact clipboard copy, over-length warnings, online-photo privacy disclosure and expanded Help upload-limit guidance passed interactive checks.
- The initial production dependency audit failed because the Vite React and Tailwind plugins were incorrectly listed as runtime dependencies. Both are imported by build configuration only. They now belong to devDependencies; the lockfile was regenerated without changing any retained package version, resolved URL or integrity hash. The unchanged `npm audit --omit=dev --audit-level=high` command reports zero production vulnerabilities.
- This classification correction is not an upstream picomatch patch: the development/build dependency advisory remains. GitHub GHSA-fc5q-39xc-vjpf lists no patched version as checked on 18 November. The public deployment consists of static build output, not an exposed Vite development server. Audit commands, thresholds and failure handling are unchanged; do not describe the entire development dependency tree as vulnerability-free.

## Remaining review priorities

1. Review tool-specific output and instructions, beginning with the most-used photo/signature/PDF workflows. A successful build does not prove exported files are correct on Android Chrome or other browsers.
2. Review articles and specialist claims against actual tool behavior and primary sources. The build uses a generic introduction template for 226 of 314 tools after this patch. That count flags editorial review work; it does not establish that those entire pages are thin, since many also have tool-specific guides/examples. Do not fix this by adding filler or removing functioning tools in bulk.
3. The older open notice-period metadata PR #159 has a known feature-claim correction but conflicts with current main. Inspect its calculator and port only the still-relevant change in a separate focused update.
4. Verify the actual GTM tags, current advertising status and consent setup before enabling ads. The repository alone cannot reveal remotely configured tags. Existing privacy text describes AdSense advertising conditionally.
5. Obtain a specific account/site reason through the official account support route when available. Feedback submission is not a support case and has no guaranteed response. Do not claim a duplicate-account issue without account evidence, or close an account based on this generic message.
6. Resubmit only after reviewing the remaining material issues and being able to truthfully confirm compliance. No approval, ranking or review-time guarantee is available.

## Primary sources

- Google account-not-approved guidance: https://support.google.com/adsense/answer/81904?hl=en
- Google required privacy content: https://support.google.com/adsense/answer/1348695?hl=en
- AdSense support options: https://support.google.com/adsense/answer/2581949?hl=en
- YouTube title limit: https://support.google.com/youtube/answer/57404
