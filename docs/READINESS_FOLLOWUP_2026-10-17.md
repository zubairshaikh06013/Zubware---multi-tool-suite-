# Tool reliability and trust follow-up — 17 October 2026

The owner confirmed that an AdSense application has not yet been made. This update prepares the existing site; it does not apply for AdSense or promise approval/rankings.

## Confirmed problems corrected

- The passphrase generator had only 48 words, while its explanatory content claimed thousands and overstated strength. It now bundles the 7,776-word EFF Long Wordlist with attribution, defaults to six words, uses unbiased Web Crypto sampling, and displays entropy calculated from the actual options. Fixed separators/capitalization do not add entropy. Unsupported cracking-time predictions have been removed.
- Both password generators retained a stale password when all character sets were disabled. They now clear invalid results and use the actual available character pool for strength estimates, including exclusions. Selection is uniform through rejection sampling.
- The image converter could label a failed batch successful, show failed items as pending, silently export a PNG under another extension, or leave stale output after changing formats. It now validates export MIME type, catches encoder/decode errors, shows per-file failures and accurate batch counts, clears stale format output, limits excessive output dimensions and releases preview object URLs. A format change retains source-decode errors. Image format documentation now distinguishes SVG input from raster output and single-size ICO export.
- The currency calculator used undated sample rates with insufficiently visible context. Its manual/sample-rate limitation is now visible before results and included in copied output. Invalid saved/edited rates are rejected or restored to defaults. No live exchange-rate feed has been installed.
- Contact information differed between static HTML and the browser page. Static Contact and Feedback now match the existing browser contact address. Unsupported response-time promises were removed.
- Feedback incorrectly said a message had been sent after merely opening another app. It now tells visitors to review and send the draft in their email/WhatsApp app.
- About now explains the existing maintainer, tool limitations and how to report reproducible problems. Privacy text distinguishes local file processing from hosting requests, optional speech services, measurement tags, local drafts and contact messages. It no longer asserts that all analytics are anonymous. No ads or advertising scripts were added.
- All 42 article bylines now use the site name rather than unverified specialist/research teams. Two PDF/password guides were rewritten to remove fabricated compression benchmarks, incorrect cracking-time predictions and descriptions of features the implementation does not have. Several blanket privacy/compliance claims were qualified. PDF progress text now describes the implemented steps.
- Financial/security related links now point to closer next-step tools.

## Checks

`npm run build` checks all 374 generated canonical pages and incoming links to all 308 tools. `npm run lint` checks TypeScript. `scripts/testSeoRegressions.ts` covers the prior calendar/subtitle/tax fixes. `scripts/testToolReliability.ts` checks empty/excluded character pools, unbiased sampling boundary handling, the exact wordlist size/uniqueness, entropy arithmetic and canvas fallback/null/exception behavior. Both regression scripts run in CI.

Preview checks used a synthetic transparent 100×60 PNG and a corrupt PNG. The valid file exported as a real 100×60 JPEG with white background and as a real RGBA PNG with preserved transparent pixels; the corrupt file showed an error and no downloadable output. Changing output format cleared stale output. Security-tool controls were also checked. Results are reported in the accompanying pull request. A build pass or MIME-helper test is not a claim that every image format, every device or all 308 tools have been tested end to end.

## Still required before calling the entire suite fully verified

1. Complete per-tool sample-input/output tests from the existing 308-tool matrix, especially PDFs, large video/audio files, OCR and financial/health assumptions. This update fixes confirmed defects; it does not certify every calculation or conversion.
2. Complete factual review of the other 40 articles and specialized tool instructions against real behavior and original examples. Avoid adding generic paragraphs merely to increase word count.
3. Measure real-user/mobile Core Web Vitals after traffic accumulates and examine current Search Console indexing reasons and page/query performance. The local bundle reduction is not a real-user performance measurement.
4. Review the actual Google Tag Manager container and third-party consent configuration in the owner's account. The repository only exposes the container ID; it does not reveal all remotely configured tags.
5. Create/apply through the owner's AdSense account when the owner chooses. The account's site-verification instructions and publisher ID determine any required code/ads.txt changes. Update the advertising disclosure and appropriate consent controls before enabling ads. No publisher ID, ad code, fake approval or fake ads.txt was invented.

## Sources and attribution

- EFF long-wordlist guidance: https://www.eff.org/dice
- EFF wordlist data: https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
- EFF reuse policy: https://www.eff.org/copyright
- Wordlist attribution/license details: [EFF_WORDLIST_ATTRIBUTION.md](EFF_WORDLIST_ATTRIBUTION.md)
- Browser canvas fallback behavior: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- Browser cryptographic randomness: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
- AdSense page readiness: https://support.google.com/adsense/answer/7299563?hl=en
