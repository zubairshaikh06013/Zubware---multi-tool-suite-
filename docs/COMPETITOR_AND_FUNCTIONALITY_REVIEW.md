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

## Signature Resizer — comparison queue

Relevant pages discovered:
- https://www.signatureresizer.com/ — crop, dimensions and KB targets.
- https://weesize.com/signature-resizer — advertises background cleanup, ink enhancement and file-size controls.

Previous Zubware batch fixed export cancellation, object-URL cleanup, upload errors and decimal maximum-KB checks. Background cleanup/ink enhancement require further competitor inspection and implementation review; they are not yet implemented or verified in this batch.

## Coverage

Only reviewed tools should be marked complete. The remaining suite, AdSense account status, live configuration and comprehensive mobile/browser testing are still pending. This document is a work queue, not an approval certificate.
