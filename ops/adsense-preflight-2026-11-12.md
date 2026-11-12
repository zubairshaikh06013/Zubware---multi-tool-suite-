# Zubware AdSense preflight — 12 November 2026

Owner requested a final readiness check before applying. This is a focused preflight, not an AdSense approval prediction or full functional audit of 314 tools. No AdSense application was submitted; no ad code, publisher ID, ads.txt seller entry or consent platform was invented or enabled.

## Decision and verified strengths

The indexing exclusion counts alone are not a reason to postpone an application. Ten representative HTML pages returned HTTP 200 with consistent clean HTTPS www canonicals and index/follow directives. Robots allows all crawlers and contains no specific advertising-crawler block. Sitemap XML parsed with 391 canonical locations and includes all ten sampled pages. This does not demonstrate an actual successful AdSense crawler visit.

Privacy, About, Contact, Terms and Disclaimer pages are reachable. Browser privacy page discloses measurement, local storage, Cloudflare, online background removal and published invitations. Public contact is info@zubware.com; mail delivery itself was not tested.

Functional checks:
- Age Calculator: 2000-01-01 to 2025-01-01 gives 25 years and 9,132 elapsed days. 31 February rejected with an accessible alert/status.
- QR Generator: new age-calculator URL encoded; built-in exact-content scan passed; exported PNG opened as 360×360.
- PDF Merge: two synthetic one-page inputs exported as a valid two-page PDF. Extracted text order First test page, Second test page verified using pypdf.
- Photo Resizer: same-day preceding release verified an actual 300×300, 11.78 KB JPG from the demo logo, published guide images loaded and 375 CSS-pixel mobile layout did not overflow. This earlier test is not a new all-device/sitewide test.

## Findings and work performed

F1 — medium, observed, high confidence; content accuracy. Initial About HTML promised no invasive tracking and omitted named online processing exceptions; a creator article FAQ promised zero tracking/cookies despite the measurement disclosure. Corrected About initial HTML and FAQ article data/generator. Owner: site maintainer; active effort estimate 0.5–1 hour; no dependency. Acceptance: generated About/article HTML retains qualified local-processing language and does not repeat the identified blanket tracking promise. Local TypeScript and production build pass. Live retest follows deployment.

F2 — low, observed preparation gap, high confidence; privacy clarity. Current policy truthfully says no AdSense yet, but omitted future advertising-cookie information and ad-personalization choice links. Added explicitly conditional wording plus My Ad Center and AboutAds links to shared policy text, rendered page and generated initial HTML. No claim that ads/CMP are already active. Owner: site maintainer; estimate 0.5–1 hour; acceptance: both initial HTML and rendered page include those links and conditional text. Local TypeScript and production build pass. Live retest follows deployment.

## Remaining account steps and verification backlog

- In the owner's real AdSense account, add/select zubware.com and use the verification method Google actually offers. Account eligibility, previous rejection and review status are not observed here.
- Before serving personalized ads in EEA/UK/Switzerland, configure Google's certified consent message or another certified CMP; verify actual consent behavior. A policy paragraph is not a CMP.
- Once Google provides the real publisher ID, publish its exact ads.txt entry if requested; do not invent a publisher ID or create an empty seller entry.
- Check ad layouts before turning ads on so download/resize controls cannot be confused with advertisements. This is a future placement check, not a current defect finding.
- Wider tool reliability, mobile/keyboard/contrast, actual advertising crawler access, field CWV, lab performance and analytics collection remain untested in this preflight.

Targeted improvements are appropriate; the sample does not support a rebuild. Immediate work is the two bounded wording fixes. Next, complete real account verification and required privacy-message setup. Expand tool/mobile testing over the next two weeks; obtain performance/usage evidence before larger changes over the next month. These are suggested sequences, not scheduled promises. No confirmed high/critical outage found in the sample; no guaranteed approval or ranking result.

Official sources checked 12 November 2026:
- https://support.google.com/adsense/answer/9724
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/1348695
- https://support.google.com/adsense/answer/13554116

## Full fixed-catalog evidence register

The following limited-coverage scorecard is an audit-method accounting record, not an AdSense readiness score. No overall numeric score is available; no field/lab performance measurements were collected.

# Website audit

**URL:** https://www.zubware.com  
**Audit window:** 2026-11-12T11:23:00+00:00 to 2026-11-12T11:33:27.349979+00:00  
**Scope:** sampled; 10 selected page(s).  
**Overall:** Not assessed · Unassessed · provisional  
**Evidence coverage:** 27.5% of applicable weight; 27.5% of the full catalog assessed; 0% excluded as N/A.

Scores describe the sampled evidence and are not certifications or estimates of revenue, traffic, or legal compliance.

## Scope and limitations

| Page | Type | Selection reason |
|---|---|---|
| https://www.zubware.com/ | Unspecified | Entry/navigation |
| https://www.zubware.com/about | Unspecified | Trust/legal page |
| https://www.zubware.com/contact | Unspecified | Trust/legal page |
| https://www.zubware.com/privacy | Unspecified | Trust/legal page |
| https://www.zubware.com/terms | Unspecified | Trust/legal page |
| https://www.zubware.com/disclaimer | Unspecified | Trust/legal page |
| https://www.zubware.com/age-calculator | Unspecified | Representative free tool |
| https://www.zubware.com/image-resizer | Unspecified | Representative free tool |
| https://www.zubware.com/pdf-merge | Unspecified | Representative free tool |
| https://www.zubware.com/qr-generator | Unspecified | Representative free tool |

- 10 HTML pages sampled plus robots and sitemap. Not a complete 314-tool functional audit.
- Desktop browser tested; new mobile, keyboard, contrast, accessibility media and trace testing not performed. Earlier same-day Photo Resizer mobile check is not a sitewide pass.
- No AdSense account/publisher ID, review status, actual advertising crawler request, consent-platform setup or ad placement verified.
- No field Core Web Vitals or lab performance measurement. No overall readiness/approval score.
- Overall score withheld: at least one category has no assessed checks.
- Overall evidence coverage is below 80% or no applicable checks were assessed.
- On-page SEO: evidence coverage is below 60% or the category is unassessed.
- Performance / Core Web Vitals: evidence coverage is below 60% or the category is unassessed.
- Accessibility: evidence coverage is below 60% or the category is unassessed.
- UX / mobile: evidence coverage is below 60% or the category is unassessed.
- Security / technical hygiene: evidence coverage is below 60% or the category is unassessed.
- Content quality: evidence coverage is below 60% or the category is unassessed.

**Field performance data:** Not collected.

**Lab performance data:** Not collected.

## Scorecard

| # | Category | Weight | Score / 100 | Coverage | N/A share | Status |
|---|---|---:|---:|---:|---:|---|
| 1 | Technical SEO | 20% | 100 | 70% | 0% | assessed |
| 2 | On-page SEO | 15% | 100 | 25% | 0% | provisional |
| 3 | Performance / Core Web Vitals | 15% | Not assessed | 0% | 0% | unassessed |
| 4 | Accessibility | 15% | Not assessed | 0% | 0% | unassessed |
| 5 | UX / mobile | 10% | 100 | 15% | 0% | provisional |
| 6 | Conversion / CRO | 10% | 100 | 70% | 0% | assessed |
| 7 | Security / technical hygiene | 10% | Not assessed | 0% | 0% | unassessed |
| 8 | Content quality | 5% | 50 | 25% | 0% | provisional |

Pass = 1 credit; partial = 0.5; fail = 0. Untested and justified N/A checks are excluded from the assessed score. Findings do not apply extra deductions.

## Prioritized findings

Risk tier determines order before the benefit/effort index. Impact and reach are ordinal judgments; effort is an estimate. Dependencies must be resolved before implementation.

No findings were recorded. This does not establish that the website is issue-free.

## Quick wins

Eligible findings have observed evidence, impact ≥3/5, medium/high confidence, estimated effort ≤4 hours, and no recorded dependencies.

- None qualify from the available evidence.

## Actionable remediation plan

Sequence dependencies before dependent fixes. Verify hypotheses before implementing their proposed changes; retest the affected checks after each change. Time bands indicate urgency, not delivery promises.

| Sequence | Findings |
|---|---|
| Immediate triage (P0–P1) | None recorded |
| Next planned work (P2) | None recorded |
| Later optimization (P3–P4) | None recorded |
| Require verification before remediation | None recorded |

## Complete check register

Every fixed-catalog check appears below. N/A requires evidence and a rationale; missing observations remain untested.

| Check | Weight in category | Status | Evidence | Notes / exclusion rationale |
|---|---:|---|---|---|
| technical_seo.crawl_index — Crawlability and index eligibility | 30 | pass | E001, E002 | Applies to stated sampled pages or tested desktop tool tasks only. |
| technical_seo.canonicals — Canonical URLs and duplication controls | 25 | pass | E001 | Applies to stated sampled pages or tested desktop tool tasks only. |
| technical_seo.sitemaps — Sitemaps and discovery | 15 | pass | E009 | Applies to stated sampled pages or tested desktop tool tasks only. |
| technical_seo.internal_links — Internal linking and crawl paths | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| technical_seo.structured_localization — Structured data and localization accuracy | 10 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| on_page_seo.titles — Page titles and search intent | 25 | pass | E001 | Applies to stated sampled pages or tested desktop tool tasks only. |
| on_page_seo.descriptions — Search descriptions and presentation | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| on_page_seo.headings — Heading structure and main topic | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| on_page_seo.image_links — Image and link context | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| on_page_seo.url_topic — URL clarity and topical alignment | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| performance.field_cwv — Field Core Web Vitals evidence | 30 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| performance.lab_loading — Reproducible lab loading diagnostics | 25 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| performance.assets — Images, fonts and transferred assets | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| performance.main_thread — Interaction and main-thread work | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| performance.delivery_stability — Caching, delivery and layout stability | 10 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| accessibility.keyboard_focus — Keyboard access and visible focus | 25 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| accessibility.names_structure — Accessible names and semantic structure | 25 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| accessibility.contrast_zoom — Contrast, text resize and reflow | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| accessibility.forms_errors — Labels, instructions and error recovery | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| accessibility.media_motion — Media alternatives and motion controls | 10 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| ux_mobile.responsive — Responsive layout and reflow | 25 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| ux_mobile.navigation — Navigation and findability | 25 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| ux_mobile.touch_readability — Touch controls and mobile readability | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| ux_mobile.states_feedback — Feedback, empty and error states | 15 | pass | E003, E004, E005 | Applies to stated sampled pages or tested desktop tool tasks only. |
| ux_mobile.journey_consistency — Consistency of critical journeys | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| conversion.value_proposition — Value proposition and audience fit | 25 | pass | E003, E004, E005 | Applies to stated sampled pages or tested desktop tool tasks only. |
| conversion.primary_cta — Primary calls to action | 25 | pass | E003, E004, E005 | Applies to stated sampled pages or tested desktop tool tasks only. |
| conversion.trust — Trust and decision information | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| conversion.funnel_friction — Lead or purchase journey friction | 20 | pass | E003, E004, E005 | Applies to stated sampled pages or tested desktop tool tasks only. |
| conversion.measurement — Conversion measurement evidence | 10 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| security.https — HTTPS and transport hygiene | 30 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| security.headers — Relevant browser security controls | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| security.mixed_content — Mixed content and insecure dependencies | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| security.cookies_forms — Observed cookie and form transport hygiene | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| security.exposure_errors — Visible technical exposure and broken states | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| content.usefulness — Task completion and content usefulness | 30 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| content.accuracy — Accuracy and supported claims | 25 | partial | E006, E007 | Observed initial About/creator privacy wording conflicts with measured services disclosure. Local fix validated; live verification pending. No whole-site factual certification. |
| content.clarity — Clarity and readability | 20 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| content.freshness — Freshness and maintenance cues | 15 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |
| content.originality_depth — Distinctiveness, depth and duplication | 10 | not_tested | — | Not assessed in this focused AdSense preflight; requires the relevant complete measurement/manual inspection. |

## Evidence register

### E001

**URL:** https://www.zubware.com  
**Method:** HTTP GET with Mozilla/5.0 · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** All 10 sampled HTML pages returned 200, clean www HTTPS self canonicals and index/follow meta. SSL accepted. HSTS max-age=31536000; includeSubDomains and CSP upgrade-insecure-requests delivered.

### E002

**URL:** https://www.zubware.com/robots.txt  
**Method:** HTTP and source inspection · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** 200 text/plain; User-agent * Allow /. No Mediapartners-Google or Google-Display-Ads-Bot exclusion. Actual crawler traffic not observed.

### E003

**URL:** https://www.zubware.com/age-calculator  
**Method:** Desktop browser interaction · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** 2000-01-01 to 2025-01-01 gives 25 years, 0 months, 0 days and 9,132 days. 31 February produces alert and status invalid-date feedback.

### E004

**URL:** https://www.zubware.com/qr-generator  
**Method:** Desktop browser and downloaded PNG inspection · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** Generated age-calculator URL; built-in scan test passed exact content; downloaded PNG is 360x360. Physical print scan not tested.

### E005

**URL:** https://www.zubware.com/pdf-merge  
**Method:** Desktop browser download and pypdf inspection · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** Two one-page synthetic PDFs merged/downloaded. Output contains 2 pages and extracted First test page then Second test page in expected order.

### E006

**URL:** https://www.zubware.com/privacy  
**Method:** Browser DOM and source · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** Privacy discloses GTM, Cloudflare, local storage and optional online processing; says AdSense not currently active. Owner name and public business contact shown. Footer About and Contact links navigated. No contact message sent.

### E007

**URL:** https://www.zubware.com/about  
**Method:** Initial HTML compared with rendered component and shared privacy source · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** Initial About text promises no invasive tracking while privacy discloses measurement, and omits named online processing exceptions. Source patch aligns those claims. Creator article FAQ also had blanket zero-tracking claim; patched in article data and generator.

### E008

**URL:** https://www.zubware.com/privacy  
**Method:** Source patch and local build · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** Added conditional Google/third-party advertising-cookie disclosure, My Ad Center and AboutAds choice links. Preserves no-current-AdSense statement. TypeScript and production build passed. Live retest pending at report generation.

### E009

**URL:** https://www.zubware.com/sitemap.xml  
**Method:** HTTP XML parsing · **Captured:** 2026-11-12T11:33:27.349979+00:00  
**Observation:** HTTP 200; XML parsed, 391 URL locations. All ten sampled canonical pages present. No full sitemap crawl.

---

This audit was provided by [SiteIn72](https://sitein72.com/).
