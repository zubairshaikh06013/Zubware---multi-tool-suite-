# Zubware: useful content for external readers

Status: drafts only; no external post or research deposit is claimed. Website updates are tracked separately in the associated commit. Use the existing publisher accounts and check previous publication logs before posting duplicates. Disclose the author’s relationship with Zubware.

## What the supplied 74-second video recommends

1. Publish helpful original content on established platforms such as LinkedIn and Reddit (called “parasite SEO” in the video).
2. Target newer-year search phrases in articles.
3. Publish original findings on Zenodo.
4. Put a direct answer near the start of a LinkedIn article.
5. Publish useful public Gamma presentations.
6. Answer real Reddit questions before mentioning your own product, disclosing ownership.

Platform authority, adding a future year, a public deck, or a research deposit does not guarantee indexing, first-page placement, authority transfer, or AI citations. Keep year references accurate. The closing “comment SEO” instruction is the presenter’s lead-generation CTA, not a website optimization.

## LinkedIn article draft: photo upload troubleshooting

Title: Photo rejected by an upload form? Check pixels, bytes and format separately

Short answer: a photo’s pixel dimensions do not determine its file size. To meet an upload requirement, check the required width, height, file format and minimum/maximum bytes independently.

Disclosure: I build Zubware, including its browser photo tools.

Start with the actual application instructions. Write down the requested pixel dimensions, allowed format, and both file-size boundaries. A 12 KB image fails a 20–50 KB requirement even though it is smaller than the maximum.

Use a resizer when the dimensions are wrong. Use compression when the image has the right dimensions but is too large. If the form requires JPG, exporting PNG will not solve that format requirement. Cropping removes image content; resizing changes dimensions. Neither action alone guarantees a particular number of bytes.

After export, inspect the downloaded file rather than just the editing preview. Confirm its dimensions and byte size, then zoom in to check that the face, handwriting or small text remains readable. Keep your original image so you can retry with less compression.

The relevant tools are [Image Resizer](https://www.zubware.com/image-resizer), [Image Compressor](https://www.zubware.com/image-compressor), and [Signature Resizer](https://www.zubware.com/signature-resizer). Choose one for the task you need; there is no universal setting that guarantees acceptance by every form.

## LinkedIn article draft: calendar age

Title: Why dividing days by 365 can give the wrong age near a birthday

Short answer: completed age is a calendar calculation. Compare the reference date with the birthday in that year; dividing elapsed days by 365 or 365.25 can disagree near birthday boundaries.

Disclosure: I build Zubware and published the dataset described here.

Zubware’s synthetic benchmark contains 87,660 date pairs generated from 7,305 birth dates, four anniversary ages and the day before, day of and day after each anniversary. Under the documented convention, division by 365 disagrees with completed calendar years in 23,740 rows. Division by 365.25 disagrees in 14,615 rows.

These counts describe this deliberately difficult sample. They do not measure real-world error rates, user populations, or other calculator websites. No competitor was tested. The convention clamps February 29 anniversaries to February 28 in a non-leap year; legal eligibility rules may use another convention.

For an application cutoff, enter the exact reference date and check the authority’s rules. For research or teaching, inspect the generator and CSV so the result can be reproduced rather than relying on the headline.

[Methodology and findings](https://www.zubware.com/blog/age-calculator-leap-year-month-end-test-cases)

[Dataset CSV](https://www.zubware.com/resources/age-benchmark/birthday-boundary-benchmark.csv)

[Generator](https://www.zubware.com/resources/age-benchmark/generate.mjs)

[Age calculator](https://www.zubware.com/age-calculator)

## Gamma presentation draft

Title: Choose the right browser tool for the job

- Slide 1 — Pixels, bytes and format: three separate upload checks.
- Slide 2 — Resizing changes dimensions. Compression changes file size. Crop only when the framing needs to change.
- Slide 3 — PDF compression: inspect text clarity and selectable text after export; a target size is not guaranteed.
- Slide 4 — Resume checks: a local heuristic score cannot predict an employer’s ATS or hiring decision.
- Slide 5 — QR codes: scan the final exported image and verify the destination before printing.
- Slide 6 — Date calculations: specify the reference date and birthday convention. Link the reproducible benchmark above.
- Slide 7 — Tool directory: https://www.zubware.com/categories. Disclosure: created by Zubware. Link specific tools only where the slide explains their actual use.

## Reddit answer pattern

Use only in an existing relevant discussion where community rules allow owner recommendations. Do not mass-post the same answer or invent a customer testimonial.

“Check the pixel dimensions, allowed format and both file-size limits separately. For example, a 12 KB photo will fail a 20–50 KB rule even if the dimensions are correct. Resize first if the dimensions are wrong, then adjust compression and check the downloaded file. I build Zubware’s image tools, so I’m affiliated; [include the relevant tool link only if permitted and useful]. What exact dimensions and size range does your form require?”

## Research deposit preparation

Reuse the existing birthday-boundary dataset rather than depositing promotional articles as research. Verify the existing deposit/submission logs before creating another record. Include the generator, CSV, summary, CC0-1.0 license, reproducibility instructions, sample construction and limitations. Do not claim Zenodo publication or a DOI until the repository returns the published record. Read the platform’s current scope and policies before submission.

## Verification and measurement

The source change adds task-led selection guidance shared by rendered category pages and their initial HTML. It also removes category-only guide recommendations and corrects several overbroad category claims. It does not alter existing tool routes or create duplicate year-targeted landing pages.

Measure tool-page clicks, impressions, query position and CTR over comparable Search Console periods after recrawling. Record external referral visits separately from organic search. A third-party article ranking is not evidence that the linked tool has reached page one.

References:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/essentials/spam-policies
