# Sitewide SEO audit plan (Claude SEO guide methodology)

This branch is dedicated to the entire Zubware site, not the QR generator feature project.

## Baseline and safeguards
- Preserve the existing `scripts/generateSeoAndSitemap.ts` pipeline, canonical URL utilities, and tool SEO data.
- Never activate paid APIs or install a paid Claude plan.
- Treat the external `AgriciDaniel/claude-seo` repository as a reference until its source, dependencies, license, and commands have been reviewed.
- Do not fabricate ratings, reviews, benchmarks, rankings, or traffic claims.
- Review any proposed changes and verify build output before merging.

## Sitewide audit checklist
1. Crawl the published sitemap and validate 200 responses, canonical URLs, indexability, robots directives, and sitemap URL consistency.
2. Check each generated tool page for unique title, description, H1, useful intro, FAQ and how-to content where appropriate, and broken internal links.
3. Validate JSON-LD against visible content; avoid unsupported rich-result claims.
4. Review mobile performance, layout shifts, JavaScript failures, and client-side processing/privacy claims.
5. Use GSC query/page exports to find high-impression low-CTR opportunities and positions 11-20. Prioritize by impressions, intent, and page fit; do not assume every query meets a 100-impression threshold.
6. Review category pages, related-tool links, and blog-to-tool links for navigability and search intent.
7. Re-check results in Search Console after Google has had time to recrawl.

## Execution order
- Phase A: Baseline audit, issue inventory and severity.
- Phase B: Fix sitewide technical issues, preserving existing tool functionality.
- Phase C: Improve content in small batches based on verified GSC data.
- Phase D: Validate build, request review, deploy and monitor.

This file records the initial workstream only. It does not claim that a full crawl, agent installation, code fix, or deployment has been completed.
