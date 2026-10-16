# Zubware SEO, tool quality and AdSense audit — 16 October 2026

## Scope and outcome

The repository contains 308 tools, 13 category hubs and 42 articles. The generated sitemap contains 374 canonical pages. This review checks shared architecture and selected tool implementations; it is not a claim that all 308 tools have passed individual end-to-end tests, that Google has indexed them, or that rankings/AdSense approval are guaranteed.

- [Competitor discovery and action matrix for every tool](COMPETITOR_RESEARCH_308.md)
- [Structured competitor evidence](competitor-research-308.json)
- [374-page live HTTP audit before this deployment](live-route-audit-2026-10-16.json)

Each tool received an individual search-intent query. The matrix contains 923 candidate competitor URLs across 308 tools. Search discovery is not a measured Google ranking report, keyword-volume study, backlink audit or hands-on test of every competitor. Candidate relevance and feature claims need page-level review before implementation. We do not infer that a feature alone caused a competitor to rank.

## Confirmed fixes in this change

1. Fail builds when static SEO generation fails, instead of deploying an incomplete artifact. Validate all 374 generated pages, their canonical URLs, unique titles/descriptions, H1s, JSON-LD syntax, assets and incoming links to all 308 tools.
2. Remove the repeated visible search-keyword section and unused meta-keywords tag. Keep search tags available for internal discovery.
3. Remove invented sitemap last-modified dates. Preserve article dates that are explicitly present in article data. Generate sitemap/llms output in the deployment directory without rewriting source files during a build.
4. Correct QR decoder instructions to match actual file upload and decoded-text output. Remove unsupported camera and clipboard-image claims.
5. Correct month-end/leap-day age calculations and make the calendar convention visible. Link age users to relevant date tools rather than unrelated CSS/PDF pages.
6. Fix subtitle rounding at minute boundaries and WebVTT hours. Permit same-origin microphone requests while retaining browser user permission. Explain that dictation listens to the microphone, does not transcribe an uploaded video automatically, and may use the browser provider’s remote speech service. Clean up media URLs and recognition sessions.
7. Correct compression quality and portal-specific requirement claims. Explain practical limitations instead of promising lossless results or universal application-portal acceptance.
8. Move the full FAQ catalog out of the initial application entry bundle. Measured local Vite entry bundle: 1,517.39 KB / 406.54 KB gzip before, 855.61 KB / 193.39 KB gzip after extraction. This is an entry-bundle comparison, not total transferred JavaScript or measured Core Web Vitals; tool pages still load FAQ data separately.
9. Replace projected 2026 US income-tax brackets with IRS Revenue Procedure 2025-32 figures, update 2025/2026 standard deductions and 2026 Social Security wage base. Remove misleading named-state rate presets and all-50-state coverage claims. State tax is now clearly an optional custom effective-rate estimate. Explain excluded tax situations and link official sources.
10. Add TypeScript/regression checks to CI and fix the background-removal library import warning.

## Validation evidence

- Production build: passed, including checks for all 374 generated canonical pages and all 308 tool links.
- TypeScript: checked with `npm run lint`.
- Focused regression script: calendar month ends, leap days, subtitle boundaries, relevant links, no self/duplicate related links across 308 tools, and independent IRS tax-table examples.
- Calendar/subtitle/link regressions also passed in the America/New_York timezone before the tax cases were added.
- Validator negative test: deliberately changed one generated canonical URL; validator rejected it; file restored.
- Live pre-deployment audit: all 374 sitemap URLs returned HTTP 200, a matching self-canonical and one H1. This does not establish Googlebot access, render success or interactive tool correctness.
- All 308 tool IDs have matching renderer branches. Mapping presence does not prove correct outputs.

Individual large-file/mobile conversion testing, cross-browser microphone testing, actual Core Web Vitals, and every financial/health calculation remain outside the completed test scope. The competitor matrix explicitly marks individual functional verification as pending. Existing generated editorial claims beyond the corrected sections still need human review.

## Traffic priorities

Prioritize the tools with existing impressions rather than publishing hundreds of generic articles. Previously supplied Search Console exports showed mobile dominating clicks and substantial discovered-but-not-indexed coverage. Those exports are historical snapshots, not a fresh direct Search Console connection.

| Priority tool | Competitor observations / practical next work |
| --- | --- |
| Image compressor | Squoosh demonstrates comparison and sample inputs; TinyPNG explains format-specific compression. Test actual output quality, transparency, target-size behavior and mobile memory, then add original before/after examples. |
| Photo and signature joiner | Pi7 emphasizes crop, dimensions and output-size controls. Verify equivalent workflows and publish an original illustrated example; link current official application instructions instead of claiming one universal rule. |
| Age calculator | Calculator.net explains reference dates and multiple age units. This patch corrects month-end behavior and related links; add tested examples covering February and month ends. |
| Image converter | Verify the actual browser/format support matrix, transparency and unsupported HEIC behavior. Keep titles and instructions aligned to real output formats. |
| Signature maker | Test touch input, transparent PNG exports and mobile save behavior. Add a short original privacy/usage example. |
| QR generator/decoder | QRCodeMonkey highlights print/vector export. Verify the formats Zubware actually offers before advertising them. Decoder content is corrected in this patch. |

Relevant competitor pages: https://squoosh.app/ ; https://tinypng.com/ ; https://image.pi7.org/merge-photo-and-signature ; https://www.calculator.net/age-calculator.html ; https://www.qrcode-monkey.com/ . These are product observations, not proof of ranking causation.

Use the 308-tool matrix as the remaining acceptance queue: sample input, independently checked expected output, mobile interaction, error/unsupported input, downloadable result, accurate instructions, and a relevant next-step link. Consolidate or improve overlapping weak tools where user intent is genuinely the same; do not mass-create doorway pages.

## AdSense readiness and owner-only steps

Technical crawlability alone does not establish AdSense eligibility. Google evaluates useful original content, navigation and policy compliance. Ranking and approval remain Google decisions.

Before requesting review:
- Complete practical quality checks for promoted tools and review existing articles for unsupported claims or repetitive generated content. Remove or correct inaccurate content rather than padding word counts.
- Confirm the published About, Contact and legal information accurately describes the real operator and services. Do not invent credentials, testimonials or addresses.
- In the owner’s AdSense account, add/verify zubware.com and review any specific eligibility/rejection message. This audit has not submitted an application and has not verified an AdSense account.
- The repository does not contain a verified AdSense publisher configuration. Installing actual ad code/ads.txt requires the correct publisher ID and the account’s instructions. Do not invent a publisher ID or ask the owner to share passwords/tokens.
- Before enabling ads, update any currently ad-free privacy statements to describe the actual ad setup and implement the consent flow required by the selected advertising configuration and visitor regions.

After deployment, inspect a small representative set of tool URLs in Search Console, confirm the current sitemap is submitted, and monitor indexing reasons. A successful live URL test means Google can potentially access the page; it does not mean the URL is indexed or will rank. Avoid repeated mass indexing requests or fabricated backlinks.

Compare Search Console clicks, impressions, CTR and page/query/device breakdowns over comparable 28-day periods. Investigate pages individually; do not sum different exported aggregations into a false site total. Track organic tool completion/download events only if implemented with appropriate privacy disclosures; no new analytics events were installed by this patch.

## Primary references

- Google Search meta tags: https://developers.google.com/search/docs/crawling-indexing/special-tags
- Accurate sitemap dates: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- AdSense content and navigation: https://support.google.com/adsense/answer/7299563?hl=en
- AdSense application issues: https://support.google.com/adsense/answer/81904?hl=en
- IRS 2026 schedules / updated 2025 deductions: https://www.irs.gov/irb/2025-45_IRB
- SSA 2026 wage base: https://www.ssa.gov/news/en/cola/factsheets/2026.html
- Browser speech recognition: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
