import type { ToolSeoData } from './toolSeoData';

interface SearchQuestionGuide {
  heading: string;
  answer: string;
  steps: string[];
  example: string;
  note: string;
  links: { href: string; label: string }[];
}

/** Practical answers shared by the interactive tool and its initial HTML. */
export const SEARCH_QUESTION_GUIDES: Record<string, SearchQuestionGuide> = {
  'image-resizer': {
    heading: 'What is a 20 to 50 KB photo size in pixels?',
    answer: 'A 20–50 KB photo has no single pixel width or height. KB measures the encoded file size; pixels measure its dimensions. Follow the dimensions and format requested by your form, then adjust compression until the exported file is inside the required size range.',
    steps: [
      'Read the form instructions for width, height, format, minimum KB and maximum KB. Treat these as separate requirements.',
      'Upload a clear original photo. Enter the required dimensions; use the crop tool first if the photo has a different shape, rather than stretching a face.',
      'Choose Photo between 20KB and 50KB to set a 20 KB minimum, a 50 KB maximum and JPG output. This preset changes file-size settings, not the required pixel dimensions.',
      'Select Resize All Images, then inspect the measured dimensions, file size and preview. Download only when the range check passes and the photo remains clear.'
    ],
    example: 'If your form specifically requests 200 × 230 pixels and 20–50 KB, a clear 200 × 230 JPG measuring 32 KB meets those size conditions. A 15 KB file misses the minimum; a 55 KB file exceeds the maximum. These are illustrative requirements, not a universal passport or exam-photo standard.',
    note: 'This tool uses 1 KB = 1,000 bytes. JPG and WebP quality can reduce size, but the tool does not add filler bytes to reach a minimum. If the result is too small, try a clearer original and follow the portal instructions. Increasing the pixel count cannot restore missing detail.',
    links: [{ href: '/crop-image', label: 'Crop a photo before resizing' }, { href: '/signature-resizer', label: 'Prepare a separate signature image' }]
  },
  'experience-calculator': {
    heading: 'How to calculate work experience in years, months and days',
    answer: 'Enter the start and end dates for each job, or mark a role as currently active. This tool merges overlapping employment periods and displays total experience in years, months and days. Its year/month breakdown is an estimate based on average-length units, rather than an exact calendar-anniversary calculation.',
    steps: [
      'Replace the sample employment records with your own company, role, start date and end date.',
      'For an ongoing job, select Present so the end date follows the current device date.',
      'Review each date range, then inspect total unique days, overlap information and gaps. Concurrent jobs should not count the same elapsed time twice.',
      'Copy the summary or export the report. For a recruitment form, check whether the employer requires calendar months, inclusive dates, full-time-equivalent experience or another rule.'
    ],
    example: 'January 1 to February 1, 2026 is 31 elapsed days. If a second role runs from January 15 to February 15, the merged interval is January 1 to February 15: 45 elapsed days, rather than the 62 days obtained by adding the two roles. The start date itself counts as day zero.',
    note: 'The displayed breakdown uses 365.25 days per year and 30.4375 days per month. Calendar months have different lengths, so an exact anniversary calculation can differ. Employment gaps are excluded, and overlapping roles are merged; the tool does not decide whether an employer accepts a particular role as qualifying experience.',
    links: [{ href: '/age-calculator', label: 'Calculate calendar age between two dates' }, { href: '/resume-builder', label: 'Build a resume from your work history' }]
  },
  'increase-pdf-size': {
    heading: 'How to increase the size of a PDF file',
    answer: 'Upload your PDF, enter a target larger than its current size in KB or MB, and run the size adjustment. The increase mode adds internal padding data without intentionally changing the visible pages. Making a file larger does not improve the resolution or readability of its contents.',
    steps: [
      'Check the upload instructions first. Use this workflow only when the portal requires a minimum file size; a maximum-size error needs compression instead.',
      'Select your PDF and compare its current byte size with the required minimum and maximum.',
      'Enter a larger target, choose KB or MB, and confirm that the tool indicates increase mode. Keep the target within the portal range and the tool’s 50 MB limit.',
      'Run the adjustment, read the actual output size and any warning, then download and reopen the PDF. Check every page before submitting it.'
    ],
    example: 'If a PDF is 50 KB and the form explicitly allows 200–500 KB, a 250 KB target gives room above the minimum and below the maximum. Here 250 KB means 250,000 bytes. Check the actual result rather than relying only on a rounded file-size label.',
    note: 'A larger PDF is not necessarily a better scan. Rescan an unreadable document instead of padding it. A portal may validate more than byte size, so meeting the size range does not guarantee acceptance. Keep the original, particularly when it is digitally signed.',
    links: [{ href: '/pdf-compressor', label: 'Compress a PDF that is too large' }, { href: '/pdf-size-adjuster', label: 'Adjust PDF size in either direction' }]
  }
};

/** Replace outdated FAQs for these pages, including misleading precision claims. */
export const SEARCH_QUESTION_SEO: Record<string, ToolSeoData> = {
  'image-resizer': {
    faq: [
      { question: 'What is a 20 to 50 KB photo size in pixels?', answer: SEARCH_QUESTION_GUIDES['image-resizer'].answer },
      { question: 'How do I resize a photo between 20 KB and 50 KB?', answer: 'Set the pixel dimensions required by your form, then choose Photo between 20KB and 50KB and select Resize All Images. Check the measured output and preview before downloading. The range preset sets JPG and the KB boundaries; it does not choose universal dimensions.' },
      { question: 'Why is a photo under 50 KB still rejected by the size check?', answer: 'A 20–50 KB requirement includes a minimum as well as a maximum. A 15 KB photo is too small. The tool blocks downloads outside the selected range and does not insert filler bytes to make the file larger. Your portal may also check dimensions, format and image quality.' },
      { question: 'Can I resize multiple photos on Android or iPhone?', answer: 'Yes. Upload your images in a modern mobile browser, configure the output settings, then inspect each result. You can download eligible results individually or together as a ZIP. Image resizing and encoding run locally in your browser.' }
    ]
  },
  'experience-calculator': {
    faq: [
      { question: 'How do I calculate experience in years and months and days?', answer: SEARCH_QUESTION_GUIDES['experience-calculator'].answer },
      { question: 'Are the displayed years and months exact calendar durations?', answer: SEARCH_QUESTION_GUIDES['experience-calculator'].note },
      { question: 'How does overlapping work experience count?', answer: 'Overlapping date ranges are merged before total unique elapsed days are counted. January 1 to February 1 plus January 15 to February 15, 2026 becomes January 1 to February 15: 45 elapsed days. The time in both roles is not counted twice.' },
      { question: 'Can I include my current job and career gaps?', answer: 'Mark an ongoing role as Present to use the current device date. Add separate entries for earlier roles. Gaps between employment intervals are excluded from unique elapsed days. The calculation does not determine an employer’s eligibility rules.' }
    ]
  },
  'increase-pdf-size': {
    howTo: [
      { title: 'Upload and inspect the original PDF', desc: 'Select your PDF and compare its current file size with the portal minimum and maximum.' },
      { title: 'Choose a larger target size', desc: 'Enter a target above the current size in decimal KB or MB, up to the 50 MB tool limit.' },
      { title: 'Adjust, verify and download', desc: 'Run the adjustment, read the measured output size and any warning, then download and reopen the file. Check its pages before submitting.' }
    ],
    faq: [
      { question: 'How do I increase the size of a PDF file?', answer: SEARCH_QUESTION_GUIDES['increase-pdf-size'].answer },
      { question: 'Can I increase a PDF from 50 KB to 200 KB?', answer: 'Enter 200 as the target and choose KB, then run the adjustment. The tool uses decimal units, so 200 KB means 200,000 bytes. Read the actual output size and status; if the portal allows a range, leave room between its boundaries.' },
      { question: 'Does increasing PDF file size improve scan quality?', answer: 'No. Padding increases bytes without restoring missing image detail. If a page is blurry or unreadable, rescan it at suitable quality. Keep the original and inspect the adjusted copy.' },
      { question: 'Will a PDF with the right size always be accepted?', answer: 'No. Portals may check file format, dimensions, document contents, encryption, signatures or other conditions. Meeting a byte-size range alone does not guarantee acceptance. The file-size adjustment runs locally in your browser.' }
    ]
  }
};
