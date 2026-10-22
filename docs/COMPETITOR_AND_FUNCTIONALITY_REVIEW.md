# Tool improvement workflow

Scope: all 309 tools, reviewed in batches. Permission to continue covers implementation, tests and normal repository publication. No paid API adoption, fabricated ranking promises, bulk noindex or outreach messages are implied.

For each tool record:
1. Actual input/output and error cases, including export integrity and mobile/browser coverage.
2. Relevant competitor pages and dated observations; distinguish advertised features from hands-on tests.
3. Useful feature gaps, usability, speed and privacy differences. Do not copy prose or assume competitor claims are verified.
4. Original instructions matching the implementation, limitations, related tools and search intent.
5. Publisher readiness: useful functionality, accurate claims, navigable pages and truthful processing disclosures. Approval and ranking remain external decisions.
6. Implemented changes, passing tests, remaining gaps and deployment evidence.

## Photo–Signature Joiner — 23 October 2026

Comparison sources inspected (page content, not interactive testing):
- https://correctform.in/tools/photo-sign-joiner — stacked/side-by-side composition with optional KB target.
- https://jpgjoiner.com/photo-signature-joiner/ — advertises byte ceilings, fixed pixel dimensions, photo framing, signature cleanup and actual-size output inspection.

Zubware baseline: custom photo/signature dimensions, two layouts, padding/gap/border, JPG/PNG export. It lacked a size ceiling and displayed an approximate binary-KB estimate. Preview showed the pre-encoding canvas.

Implemented:
- Photo zoom and horizontal/vertical crop-position controls, with reset and automatic framing reset on new photo upload.
- Optional decimal-KB limit and 20/50/100 KB JPG buttons.
- Bounded JPEG quality search without changing pixel dimensions; no promise that all limits can be reached.
- Actual encoded output preview, actual-pixel mode, exact bytes and oversized-download guard.
- Border drawn after composition so zero-padding images cannot cover it.
- Instructions/FAQ reflecting the new behavior.

Evidence: testCompositeImageExport exercises real canvas-generated JPEG/PNG files, decodes dimensions, checks byte accounting including base64 padding, reachable/impossible limits and export failure. Full mobile UI, screen-reader behavior and device performance remain unverified.

Additional evidence: testPhotoFrame verifies portrait/landscape source crops, edge positions, zoom bounds and the pixels produced by real canvas draws.

Remaining candidate improvements: optional signature margin cleanup. These need dedicated geometry/output tests before release. No claim of overall competitor superiority.

## Signature Resizer — appearance improvements

Relevant pages discovered:
- https://www.signatureresizer.com/ — crop, dimensions and KB targets.
- https://weesize.com/signature-resizer — advertises background cleanup, ink enhancement and file-size controls.

Previous Zubware batch fixed export cancellation, object-URL cleanup, upload errors and decimal maximum-KB checks. The Weesize page was inspected and advertises paper cleanup and ink enhancement; interactive behavior was not independently tested.

Implemented in the following batch:
- Default contain-fit rendering after auto-crop preserves handwriting proportions while keeping the selected pixel dimensions.
- Optional near-white paper cleanup with adjustable threshold, disabled by default; coloured/dark ink and pixel alpha are preserved by the threshold operation. Faint grey ink above the threshold can be removed, so preview guidance explains how to raise the cutoff or disable cleanup.
- No claim of deep-shadow removal, transparent-background extraction or guaranteed form acceptance.
- Added original Hindi FAQs explaining proportions and cleanup limitations.
- testSignatureAppearance uses actual canvas rendering to check proportions and test pixels; testSignatureExport still covers cancellation and object-URL cleanup.

Mobile visual testing and ink enhancement remain pending.

## Coverage

Only reviewed tools should be marked complete. The remaining suite, AdSense account status, live configuration and comprehensive mobile/browser testing are still pending. This document is a work queue, not an approval certificate.

## Add Name and Date to Photo — 23 October 2026

Inspected competitor page content (not interactive behavior):
- https://tools.sarkaridiary.in/add-name-date/ — name/date and top/bottom strip.
- https://imageonline.co/add-name-under-photo.php — font, colour, style and added space below the image.

Zubware already has top/bottom strips, bottom overlay, date formats, prefix and font choices. Review found long text could exceed the photo width; minimum font sizes could exceed a small strip; Today used a UTC date.

Implemented measured font fitting without stretching glyphs, proportional strip fonts, local calendar dates, opaque white backing for JPEG exports of transparent photos, and upload type/size/decode errors. Hindi UI guidance explains small-text readability and the need to enter the actual photo date. Tests cover measured long Latin/Devanagari strings and local calendar dates under Asia/Kolkata and America/Los_Angeles. Mobile UI, browser font availability and complete output workflows remain pending. The tool does not establish exam compliance or the actual capture date.
