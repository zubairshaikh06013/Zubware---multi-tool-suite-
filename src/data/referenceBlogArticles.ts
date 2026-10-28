import { BlogArticle } from '../types';

export const REFERENCE_BLOG_ARTICLES: BlogArticle[] = [
  {
    "slug": "photo-upload-rejected-file-size-format-checklist",
    "title": "Photo Upload Rejected? Check Bytes, Pixels and Format",
    "metaTitle": "Photo Upload Rejected? Check Size & Format | Zubware",
    "description": "Troubleshoot rejected photo uploads with a byte-size reference, format checks and a repeatable resize-and-compress workflow. Includes a downloadable checklist.",
    "canonicalPath": "/blog/photo-upload-rejected-file-size-format-checklist",
    "publishedTime": "2026-10-20T00:00:00Z",
    "modifiedTime": "2026-10-20T00:00:00Z",
    "author": {
      "name": "Zubware",
      "url": "https://www.zubware.com/about",
      "role": "Tool guides and documentation"
    },
    "publisher": {
      "name": "Zubware",
      "url": "https://www.zubware.com"
    },
    "category": "Image Guides",
    "readingTime": "6 min read",
    "tags": [
      "Photo upload",
      "Image compression",
      "KB vs KiB",
      "Upload checklist"
    ],
    "excerpt": "Troubleshoot rejected photo uploads with a byte-size reference, format checks and a repeatable resize-and-compress workflow. Includes a downloadable checklist.",
    "takeaways": [
      "Check bytes, dimensions and format independently.",
      "Zubware targets decimal KB; check downloaded bytes against the destination’s rules.",
      "Compression may change dimensions, so recheck the final file."
    ],
    "sections": [
      {
        "id": "start-with-rules",
        "title": "Read the destination rules before editing",
        "content": "A photo can be under the size limit and still be rejected. Upload validators may check the real image format, width, height and aspect ratio separately. A recognizable filename is not proof that the file satisfies any of those checks.\n\nCopy the current requirements from the destination into a short checklist: accepted formats, minimum and maximum bytes, pixel dimensions, crop or background requirements, and filename restrictions if stated. Keep the original photograph. The examples below are arithmetic demonstrations, not requirements for a particular examination, passport service or government portal. Always use that service’s current instructions.\n\n[Download the upload-check worksheet (CSV)](/resources/photo-upload-checklist.csv). It separates the requirement, the observed value and the result, so you can identify which condition failed instead of repeatedly reducing quality."
      },
      {
        "id": "bytes-reference",
        "title": "A size reference: KB is not always displayed consistently",
        "content": "Decimal kilobytes use 1,000 bytes; binary kibibytes use 1,024 bytes. Some software labels a binary value “KB,” which can make two displays look inconsistent. Use the exact byte count when comparing against a documented limit. [NIST’s binary-prefix reference](https://physics.nist.gov/cuu/Units/binary.html) explains the units.\n\n| Number shown | Decimal kB: bytes | Binary KiB: bytes | Difference |\n|---|---:|---:|---:|\n| 20 | 20,000 | 20,480 | 480 |\n| 50 | 50,000 | 51,200 | 1,200 |\n| 100 | 100,000 | 102,400 | 2,400 |\n| 200 | 200,000 | 204,800 | 4,800 |\n\nThese values are calculated as number × 1,000 and number × 1,024. For example, a 20,300-byte photo exceeds a 20,000-byte ceiling even if another application displays it as about 19.8 binary units. Also distinguish “size” from “size on disk”: disk allocation is not the upload payload.\n\nZubware’s image compressor uses decimal KB and MB targets. If a portal specifies only “20 KB” without defining it, a readable image below 20,000 bytes avoids this particular ambiguity, provided it also satisfies any minimum size. It does not guarantee acceptance."
      },
      {
        "id": "dimensions",
        "title": "Pixels and bytes answer different questions",
        "content": "Pixel dimensions describe the image grid; bytes describe the encoded file. A 600 × 600 image contains 360,000 pixels, while 300 × 300 contains 90,000. Halving both dimensions removes three quarters of the pixels, but it does not promise the same reduction in bytes.\n\nPhotographic detail, noise, format and compression settings affect the encoded size. Two images with identical dimensions can therefore have different file sizes. Conversely, a tiny file may still have the wrong dimensions. Changing only a DPI label is not a reliable way to satisfy a width-and-height requirement expressed in pixels.\n\nCrop to the required aspect ratio first, then use the [image resizer](/image-resizer) for the required dimensions. Avoid stretching a portrait to force it into a box: it changes the proportions of the face. If a portal defines a required composition, follow that instruction before compressing."
      },
      {
        "id": "format",
        "title": "Renaming a file does not convert it",
        "content": "Changing photo.webp to photo.jpg changes the name, not the image encoding. When the destination requires JPEG, export a JPEG using the [image converter](/image-converter), then inspect and open the downloaded file. Keep the original separately.\n\nChoose a format accepted by the destination. JPEG may be useful for photographs, but it does not preserve transparency. PNG supports transparency; that does not mean a photo exported as PNG will meet a very small size limit. Do not choose WebP just because it produces a small file if the upload form accepts only JPEG.\n\nBrowser encoding is also format-dependent. [MDN documents canvas export](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob): quality applies to supported lossy formats, and unsupported output types can fall back to PNG. This is why checking the resulting file matters more than trusting an extension or a quality percentage."
      },
      {
        "id": "workflow",
        "title": "A repeatable workflow with a clear stopping point",
        "content": "1. Save the destination requirements and preserve the original image.\n2. Crop and resize to the required aspect ratio and dimensions.\n3. Export an accepted format. Open this export to check orientation, background and content.\n4. In the [image compressor](/image-compressor), choose a maximum-size target matching the documented ceiling. Use a slightly smaller target only if the destination leaves room above its minimum.\n5. Download the result and check its bytes, dimensions and readability again. Inspect facial detail or thin signature strokes at normal viewing size and zoomed in.\n6. Upload this exact downloaded file. Do not send it through a messaging application first: a new export may change its size or format.\n\nZubware may lower quality and then reduce dimensions to reach a target. A successful byte-size result can therefore fail a strict pixel requirement. If that happens, return to the correctly sized source and try a less aggressive target or another accepted format. Stop when further reduction makes required detail unclear; the destination may need a different source photograph.\n\nFor a maximum limit, an exact-size file is usually unnecessary. The compressor’s exact-size mode can add padding to supported formats; padding adds bytes, not visual detail. Use it only when there is a real requirement, and verify that the destination accepts the resulting file."
      },
      {
        "id": "diagnosis",
        "title": "Match the symptom to the next check",
        "content": "| Symptom | Check next | Useful action |\n|---|---|---|\n| “File too large” | Exact bytes and the documented unit | Re-export below the ceiling while preserving any minimum |\n| “Invalid format” | Actual encoding and supported types | Convert the original; do not just rename it |\n| “Invalid dimensions” | Downloaded width, height and orientation | Resize and recheck after compression |\n| Size passes but preview is blurred | Fine detail at normal size | Use a cleaner source or gentler compression |\n| All documented checks pass | Exact error message and selected file | Confirm the correct download was selected; consult portal support |\n\nDo not assume every rejection is a compression problem. Keep a record of the error and your measured values. When asking for help, share a non-sensitive sample or the measurements instead of publishing identity documents or application details."
      },
      {
        "id": "reuse",
        "title": "How to reuse this reference",
        "content": "The byte table is reproducible arithmetic, not a benchmark of compression performance. You can reproduce it using the multipliers above. The linked worksheet is an original Zubware checklist released under CC0; you may adapt it for a classroom, support guide or application checklist. A source link is welcome, but is not required for using the worksheet.\n\nSuggested reference: “Zubware, Photo Upload Rejected? Check Bytes, Pixels and Format, published 20 October 2026.” Link to this article so readers can see the assumptions and current instructions. For broader format choices, see our [image formats guide](/blog/complete-image-formats-conversion-guide)."
      }
    ],
    "relatedToolIds": [
      "image-compressor",
      "image-resizer",
      "image-converter"
    ],
    "faqs": [
      {
        "question": "Does a 20 KB photo always pass an upload form?",
        "answer": "No. The destination may separately validate format, dimensions, minimum size and image content."
      },
      {
        "question": "Do I need an exact 20,000-byte image?",
        "answer": "Only if the destination explicitly requires an exact size. For a maximum-size rule, a smaller file may qualify if it also meets the other requirements."
      }
    ]
  },
  {
    "slug": "age-calculator-leap-year-month-end-test-cases",
    "title": "Age Calculator: Leap-Year and Month-End Test Cases",
    "metaTitle": "Age Calculator: Leap-Year and Month-End Test Cases | Zubware",
    "description": "Understand calendar age with eight reproducible date pairs, leap-day and month-end examples, and a downloadable CSV for testing calculators.",
    "canonicalPath": "/blog/age-calculator-leap-year-month-end-test-cases",
    "publishedTime": "2026-10-20T00:00:00Z",
    "modifiedTime": "2026-10-20T00:00:00Z",
    "author": {
      "name": "Zubware",
      "url": "https://www.zubware.com/about",
      "role": "Tool guides and documentation"
    },
    "publisher": {
      "name": "Zubware",
      "url": "https://www.zubware.com"
    },
    "category": "Calculator Guides",
    "readingTime": "6 min read",
    "tags": [
      "Age calculator",
      "Leap year",
      "Calendar age",
      "Test cases"
    ],
    "excerpt": "Understand calendar age with eight reproducible date pairs, leap-day and month-end examples, and a downloadable CSV for testing calculators.",
    "takeaways": [
      "Fixed dates make the examples reproducible on any day.",
      "Month-end anniversaries are clamped to the last available day.",
      "Calendar-day counts differ from elapsed-time and inclusive-day calculations."
    ],
    "sections": [
      {
        "id": "meaning",
        "title": "Decide what “age” means before comparing answers",
        "content": "An age in completed years answers a different question from elapsed days. A result in years, months and days adds another choice: what should happen when the starting day does not exist in the destination month? Comparing two calculators without checking that rule can make a convention difference look like a bug.\n\nThe [Zubware age calculator](/age-calculator) uses calendar dates and clamps a month-end anniversary to the last available day of the destination month. This guide makes that convention explicit and supplies fixed examples you can reproduce. It is documentation of this calculator, not a legal rule for eligibility, benefits or age-restricted services. Use the authority’s stated cutoff date and rules for those decisions.\n\nThe examples use YYYY-MM-DD dates and do not depend on “today.” They were checked against Zubware’s calendar-age implementation on 20 October 2026. No personal birth dates are included."
      },
      {
        "id": "method",
        "title": "The calculation, step by step",
        "content": "First calculate the difference in calendar months between the two dates. Construct an anniversary using that month difference and the original day of birth. If that day does not exist, use the last day of that destination month. If this anniversary is after the target date, subtract one month and construct the anniversary again.\n\nDivide the completed-month count into full groups of 12 and remaining months. Count calendar days from the final anniversary to the target for the remaining days. Separately, count calendar-day boundaries from birth to target for total days. Do not calculate total days by multiplying years by 365 and months by 30: real months and years vary.\n\nFor example, 2000-01-31 to 2026-03-01 initially spans 314 calendar months. The corresponding March 31 anniversary is too late. After subtracting one month, the anniversary is February 28, 2026. That leaves 313 completed months, or 26 years and one month, plus one day."
      },
      {
        "id": "test-table",
        "title": "Eight fixed test cases",
        "content": "| Birth date | Target date | Years | Months | Days | Total days |\n|---|---|---:|---:|---:|---:|\n| 2000-01-01 | 2025-01-01 | 25 | 0 | 0 | 9,132 |\n| 1995-05-15 | 2024-10-20 | 29 | 5 | 5 | 10,751 |\n| 2004-02-29 | 2024-03-01 | 20 | 0 | 1 | 7,306 |\n| 2000-01-31 | 2026-03-01 | 26 | 1 | 1 | 9,526 |\n| 2023-01-31 | 2023-02-28 | 0 | 1 | 0 | 28 |\n| 2024-01-31 | 2024-02-29 | 0 | 1 | 0 | 29 |\n| 2004-02-29 | 2023-02-28 | 19 | 0 | 0 | 6,939 |\n| 2024-02-29 | 2024-02-29 | 0 | 0 | 0 | 0 |\n\n[Download all eight age test cases (CSV)](/resources/calendar-age-test-cases.csv). These are expected outputs under the stated clamped-anniversary convention, not a universal definition of how every calculator must represent months. Total days exclude the starting day: the same date has a difference of zero."
      },
      {
        "id": "leap-day",
        "title": "Why February 29 needs an explicit rule",
        "content": "For a February 29 birth date, February 28 in a non-leap year is the clamped anniversary used here. That produces 19 years exactly for 2004-02-29 to 2023-02-28. A system that chooses March 1 as the anniversary will differ around that boundary. Neither result should be transferred into an official eligibility decision without checking the applicable rule.\n\nThe leap-year test in the Gregorian calendar is divisibility by four, except century years must also be divisible by 400. Thus 2000 contains February 29; 1900 and 2100 do not. Invalid dates should be rejected rather than silently rolled into the next month.\n\nMonth arithmetic also differs from repeatedly adding a month to the previous result. Starting from January 31, clamping to February 28 and then using 28 as the next base day loses the original 31. Zubware constructs each anniversary from the original birth date, so this accumulated drift is avoided."
      },
      {
        "id": "days-versus-time",
        "title": "Calendar days are not elapsed 24-hour blocks",
        "content": "A date-only calculation is about calendar boundaries. It is not a timestamp calculation using a birth time, time zone and target time. Local clocks can move when daylight-saving time starts or ends, so dividing two local-midnight timestamps by 86,400,000 is not a reliable general method for counting calendar dates.\n\nZubware maps the selected calendar date components to UTC day numbers for the day difference. The label “total days” in the table therefore means date boundaries, not measured 24-hour periods since an exact birth instant. Hours or seconds derived from that day count should not be treated as a stopwatch reading.\n\nThis distinction is useful when debugging a one-day disagreement. Check whether one calculator has interpreted an ISO date as UTC and another as local time, whether the target date is the same, and whether either result counts both endpoints. An inclusive count would add one to these total-day values and is a different question."
      },
      {
        "id": "reproduce",
        "title": "Reproduce the results and investigate a mismatch",
        "content": "1. Open the age calculator and enter the birth date from one row.\n2. Set the comparison date explicitly to that row’s target date.\n3. Compare years, months, days and total days separately.\n4. Repeat the two January 31 cases and the February 29 cases; they exercise different month lengths.\n5. Check the same-date case. It should show zero rather than one elapsed day.\n\nFor your own implementation, also reject a target before birth and impossible input such as 2023-02-29. Do not “repair” an invalid date silently. If the total-day value agrees but the month/day breakdown differs, compare the anniversary conventions before changing code.\n\nThe [source implementation](https://github.com/zubairshaikh06013/Zubware---multi-tool-suite-/blob/main/src/lib/calendarAge.ts) exposes calendarAge and parseCalendarDate. Developers can use the CSV as an independent set of fixed expected outputs, including a description of the convention in their own tests. Eight examples cover useful boundaries but do not prove a whole date library correct."
      },
      {
        "id": "reference",
        "title": "Reuse the data with its assumptions",
        "content": "The accompanying CSV is original Zubware test data released under CC0. You can copy, adapt or redistribute the cases for tutorials or testing. Attribution is welcome, but not a condition of using the data. Keep the clamped-anniversary and exclusive-start-day assumptions with the values so readers know what they demonstrate.\n\nSuggested citation: “Zubware, Age Calculator: Leap-Year and Month-End Test Cases, published 20 October 2026.” Link to this article when explaining the method, and to the CSV when readers need machine-readable rows. If you find a mismatch, include the two dates, the expected convention and the observed result in a [report](/contact)."
      }
    ],
    "relatedToolIds": [
      "age-calculator"
    ],
    "faqs": [
      {
        "question": "Why do age calculators disagree for February 29 birthdays?",
        "answer": "They may use different anniversary conventions for non-leap years. Zubware clamps to February 28; check the relevant official rule for eligibility."
      },
      {
        "question": "Is the starting day included in total days?",
        "answer": "No. These test cases count calendar-day boundaries, so birth and target on the same date produce zero days."
      }
    ]
  }
];
