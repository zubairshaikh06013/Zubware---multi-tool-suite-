# Converter reliability and guide accuracy follow-up

This change follows PRs #1 and #2. It is not a claim that all 308 tools are fully tested, that every article is fact-checked, or that Google ranking/AdSense approval is assured.

## Confirmed tool defects addressed

- **CSV to JSON / CSV Viewer / JSON to CSV:** record-aware quoted multiline parsing; escaped quotes and CR/LF exports; text-preserving CSV conversion by default; explicit optional simple inference; large IDs and leading zeros preserved; duplicate headers and mismatched record widths rejected for object conversion. JSON array entries must be objects. Nested JSON remains serialized within cells, not automatically flattened.
- **Number to Words / Words to Number:** decimal-text/BigInt conversion avoids crashes from scientific/hexadecimal input, preserves decimal zero digits, handles negative fractional amounts and rounds currency at two places without binary-floating-point rounding errors. Cardinal-word parsing rejects unknown words, malformed order, missing decimal digits and unsupported precision rather than silently producing a number. Parser limits are intentionally explicit.
- **Roman numerals:** whole numeric input and canonical subtractive spelling required. Above 3,999 the existing repeated-M convention is explained; this is not overbar notation.
- **Regex Tester:** arbitrary patterns execute in a terminable Web Worker with a 2-second deadline, input limits, correct Unicode zero-width advancement, and a visible 1,000-match truncation notice. A match-count guard alone could not interrupt a single expensive exec call.
- **EXIF Remover:** corrupt-image failures are reported; successful files remain available; resources are released; output extensions match PNG/JPEG encoding; JPEG transparency is flattened on white. The shared encoder handles null/unsupported exports and bounds oversized canvases. Content now explains re-encoding instead of claiming lossless header stripping.
- **Video Compressor:** avoid waiting for a seek event at the already-current zero timestamp; reject unsupported/unloaded input; catch recording/playback failures; clean up streams and frame loops; report missing audio capture; explain WebM/real-time recording rather than FFmpeg/CRF. Source controls are disabled during recording.
- **PDF to Word:** extracted text is escaped before inclusion in preview/legacy HTML output, so literal markup is rendered as text instead of becoming HTML.
- **Compound Interest:** whole-year input matches the existing yearly simulation; grouped contribution timing is disclosed. This is not a new daily cash-flow engine.
- **Contrast Checker:** use the current 0.04045 sRGB transfer threshold; AA/AAA decisions already use the unrounded ratio.

## Content review scope

All 40 remaining article titles/section lists were screened and selected claims inspected. This is not a full line-by-line expert review of all 40 articles.

Twelve guides were substantially rewritten with corresponding summaries, instructions and FAQs: PDF-to-Office, passport photos, SIP/EMI/GST calculations, compound interest/CAGR, amortization, invoice drafting, BMI/calorie estimates, PDF encryption/watermarks, visible PDF signatures, EXIF, data conversion and browser video compression.

Eleven further guides received targeted section corrections: merge/split PDF, background removal, developer privacy, QR security, YouTube metadata/thumbnails, browser video creation, slowed/reverb audio, video aspect ratio, YouTube banner, title/hooks, and regex testing. Removed unsupported customer/attack case studies, guaranteed traffic uplifts, fixed hardware/memory benchmarks and invented implementation details. These targeted corrections do not certify every remaining paragraph or FAQ.

Examples are labelled illustrative. No customer results, measurements or professional credentials were invented. Existing article paths remain stable.

## Verification evidence

- `scripts/testDataConversions.ts`: independent known values and adversarial boundary cases for CSV fidelity, identifiers, number syntax/precision/rounding, Roman numerals (including all 1–3,999 round trips), regex groups/Unicode zero-width matches/caps, and markup escaping.
- Existing SEO and reliability regressions remain in CI.
- Production build validates 374 canonical pages and incoming links to 308 tool routes.
- `docs/TOOL_VERIFICATION_COVERAGE.json` records all 308 tools and names the limited regression evidence available. Empty evidence means not functionally verified, not a pass.
- The historical `testAll50GroupATools.ts` now honestly reports source-file inventory only; simulated file sizes and unconditional functional PASS claims were removed.
- Browser acceptance for this change is recorded in its pull request, including any limitations. Fixtures contain synthetic data only.

## Remaining work

- Complete per-tool end-to-end checks, especially OCR, PDF preservation, all video/audio formats, and financial/health edge cases. Static route checks are not functional checks.
- Complete factual review of untouched articles and remaining sections/FAQs in partially reviewed guides. Audit tool-page instructions as well as blog articles.
- Inspect current Search Console query/page/indexing data and real mobile performance; historical export data does not establish current rankings.
- Review the actual owner-controlled GTM tags and consent configuration. GitHub contains the container reference, not its full remote configuration.
- AdSense application, publisher-specific verification and ad configuration remain separate owner/account steps. No application or ad code is included in this change.

## Primary references used

- MDN Number.MAX_SAFE_INTEGER: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
- MDN MediaRecorder support: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static
- W3C contrast understanding: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- CDC adult BMI: https://www.cdc.gov/bmi/adult-calculator/index.html
- US passport photo requirements: https://travel.state.gov/en/passports/apply/help/photos.html
- CFPB amortization: https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/
- GST reporting workflow: https://tutorial.gst.gov.in/userguide/returns/Creation_of_Outward_Supplies_Return_in_GSTR-1.htm
- YouTube performance FAQ: https://support.google.com/youtube/answer/141805?hl=en

Implementation descriptions were checked against the repository, including PDF text extraction, PDF encryption calls, canvas re-encoding, CSV serialization, audio engine and video recorder source.
