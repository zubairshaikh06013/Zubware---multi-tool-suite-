# Zubware SEO toolkit

The build generates and validates every canonical tool, category and guide page.
Pagefind indexes only the sitemap's canonical routes, so legacy `.html`, QA,
dashboard and 404 copies cannot appear in the full-text search. Search loads the
index only after a visitor types, alongside the existing tool-directory search.

## Automated audits

`.github/workflows/seo-toolkit.yml` runs on main updates and pull requests:

- **Lychee** checks links from all canonical pages against the exact local build,
  plus an advisory report for external editorial references. Internal failures
  fail the check; external network/403 errors remain visible for manual review.
- **Lighthouse CI** checks six representative mobile pages. SEO below 90 fails;
  performance, accessibility and best-practice budgets are initially advisory.
- **SEOnaut** crawls the live production site in a temporary Docker instance,
  respects robots.txt, and saves CSV pages and an issue summary. Its temporary
  database and local-only account are destroyed after the job.
- **OpenSEO** audits the live homepage and crawls up to 500 production pages.
  Both upstream crawler sources are pinned to inspected commit hashes. No paid
  data API, permanent server or production credentials are used.
- On a pull request, **Unlighthouse** audits representative tools/category pages.
  Use the workflow's Run workflow control with `full_site: true` to audit every
  current sitemap route. Full audits are deliberately manual to control runtime.

Artifacts are kept for 14 days. Live crawler findings describe the deployed site,
while build/link/Lighthouse checks describe the proposed code. Review redirect,
canonical, crawlability and speed evidence before changing content or security
settings. Audit scores do not measure actual Google rankings or field Core Web
Vitals. Indexing and search traffic must be measured separately in Search Console.

## Local commands

```bash
npm ci
npm run build
npm run lint
npm run test:seo-search
npm run audit:lighthouse
# In one terminal:
node scripts/serveSeoBuild.mjs
# In another:
npm run audit:links:prepare
npm run audit:site
FULL_SITE=1 npm run audit:site
```

Chrome is required for browser audits. SEOnaut additionally needs Docker; its
compose file is `ops/seo/seonaut.compose.yml`. Upstream sources are prepared by
the workflow. Public hosting of either crawler is unnecessary for this setup.

## Initial findings and fixes

The first production OpenSEO run scored the homepage 93/100 and crawled 382
pages. SEOnaut crawled 408 resources with no critical issues. Their page counts
include different resource types; neither count represents indexed Google URLs.
The source build has 380 canonical pages covering 309 tools.

Fixes from these audits: ordinary internal editorial links instead of nofollow,
correct shared footer and feature-card heading levels, a real 1200×630 share card,
and manifest entries pointing to the existing correctly sized 192/512 PNG icons.
The phishing-awareness article's reserved `.example` URL is now code, not a live
link. Title-length and other heuristic warnings require editorial review, not
blanket truncation. A CDN-generated `/cdn-cgi/l/email-protection` link was flagged
by OpenSEO; this needs browser verification rather than treating the mailto
source as a missing content page. The private dashboard's noindex is intentional.

The local audit server sends gzip for text/WASM assets and immutable caching for
versioned bundles, matching compressed CDN delivery. These lab scores still
differ from production network conditions and real visitor measurements.
