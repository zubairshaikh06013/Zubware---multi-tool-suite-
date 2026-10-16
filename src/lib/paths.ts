export const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

export const BASE_PATH = BASE_URL === '/' ? '' : BASE_URL.replace(/\/$/, '');

/**
 * Returns a full clean href suitable for <a> tags.
 * Example: getLinkUrl('/image-compressor.html') => '/image-compressor'
 * Example: getLinkUrl('/about.html') => '/about'
 */
export function getLinkUrl(path?: string): string {
  if (!path || path === '/' || path === '/index.html') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    // If it's an internal absolute URL to zubware.com, strip trailing .html from web pages
    return path.replace(/(https?:\/\/(?:www\.)?zubware\.com\/[a-zA-Z0-9_-]+)\.html(\?.*)?$/g, '$1$2');
  }
  let cleanPath = path.startsWith('/') ? path : '/' + path;
  // Clean trailing .html from web routes (keep index.html as root, don't strip static assets)
  if (cleanPath.endsWith('.html') && cleanPath !== '/index.html' && cleanPath !== '/404.html') {
    cleanPath = cleanPath.slice(0, -5);
  }
  if (BASE_PATH && cleanPath.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Normalizes a full browser pathname into an internal route path.
 */
export function normalizePath(pathname?: string): string {
  if (!pathname) return '/';
  let p = pathname;
  if (BASE_PATH && p.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  // Strip trailing .html from route matching (except index.html)
  if (p.endsWith('.html') && p !== '/index.html' && p !== '/404.html') {
    p = p.slice(0, -5);
  }
  return p === '' ? '/' : p;
}

/**
 * Single source of truth for tool canonical paths.
 * Guarantees that tools with ID/slug mismatches (such as 'image-color-picker' -> '/color-picker')
 * always resolve to their correct, clean public canonical route without extensions.
 */
export function getToolCanonicalPath(toolOrId: { id?: string; filename?: string; path?: string } | string | null | undefined): string {
  if (!toolOrId) return '/';

  // If a string was provided (e.g. tool ID or path)
  if (typeof toolOrId === 'string') {
    const raw = toolOrId.trim().replace(/^\//, '').replace(/\.html$/, '');
    if (raw === 'image-color-picker') return '/color-picker';
    if (raw === 'photo-and-signature-joiner') return '/photo-signature-joiner';
    if (raw === 'qr-code-generator') return '/qr-generator';
    if (raw === 'stopwatch') return '/online-stopwatch';
    if (raw === 'timezone-converter') return '/time-zone-converter';
    return `/${raw}`;
  }

  // Known tool ID overrides
  if (toolOrId.id === 'image-color-picker') {
    return '/color-picker';
  }
  if (toolOrId.id === 'photo-and-signature-joiner') {
    return '/photo-signature-joiner';
  }
  if (toolOrId.id === 'qr-code-generator') {
    return '/qr-generator';
  }

  // Derive from filename if present (e.g. 'color-picker.html' -> '/color-picker')
  if (toolOrId.filename && toolOrId.filename !== 'index.html') {
    const cleanFromFilename = toolOrId.filename.replace(/^\//, '').replace(/\.html$/, '');
    if (cleanFromFilename) return `/${cleanFromFilename}`;
  }

  // Derive from path if present (e.g. '/color-picker.html' -> '/color-picker')
  if (toolOrId.path && toolOrId.path !== '/' && toolOrId.path !== '/index.html') {
    const cleanFromPath = toolOrId.path.replace(/^\//, '').replace(/\.html$/, '');
    if (cleanFromPath) return `/${cleanFromPath}`;
  }

  // Fallback to id
  if (toolOrId.id) {
    if (toolOrId.id === 'image-color-picker') return '/color-picker';
    const cleanFromId = toolOrId.id.replace(/^\//, '').replace(/\.html$/, '');
    return `/${cleanFromId}`;
  }

  return '/';
}

/**
 * Returns the full canonical absolute URL for a tool.
 * Example: getToolCanonicalUrl('image-color-picker') => 'https://www.zubware.com/color-picker'
 */
export function getToolCanonicalUrl(toolOrId: { id?: string; filename?: string; path?: string } | string | null | undefined): string {
  const path = getToolCanonicalPath(toolOrId);
  return `https://www.zubware.com${path}`;
}

export const NETWORK_DEPENDENT_TOOL_IDS = new Set([
  'api-request-builder',
  'website-downloader',
  'http-header-viewer'
]);

/**
 * Returns intent-focused, search-optimized How-To headings for priority tools.
 */
export function getToolHowToHeading(tool: { id: string; title: string; navTitle?: string }): string {
  const specificHeadings: Record<string, string> = {
    'pdf-merge': 'How to Merge Multiple PDF Files Into One',
    'pdf-split': 'How to Split a PDF Into Separate Pages',
    'image-to-pdf': 'How to Convert and Combine Images into a Single PDF',
    'pdf-to-images': 'How to Convert PDF Pages into High-Resolution PNG & JPG Images',
    'delete-pdf-pages': 'How to Delete and Remove Specific Pages from a PDF',
    'extract-pdf-pages': 'How to Extract and Save Selected Pages from a PDF',
    'protect-pdf': 'How to Encrypt and Password-Protect a PDF Document',
    'unlock-pdf': 'How to Unlock and Remove Passwords from a PDF File',
    'pdf-size-adjuster': 'How to Adjust PDF File Size to an Exact Target KB or MB',
    'pdf-to-jpg': 'How to Convert PDF Pages into High-Quality JPG Images',
    'edit-pdf': 'How to Add Text, Draw, and Annotate a PDF Online',
    'pdf-to-word': 'How to Convert PDF Documents into Editable Word (.DOCX) Files',
    'word-to-pdf': 'How to Convert Word (.DOCX) Documents into Vector PDF Files',
    'pdf-to-text': 'How to Extract Plain Text and Scanned OCR from a PDF',
    'pdf-to-excel': 'How to Extract PDF Tables into Excel (.XLSX) and CSV Spreadsheets',
    'pdf-signature': 'How to Electronically Sign and Place Signatures on a PDF',
    'pdf-compressor': 'How to Compress and Reduce PDF File Size Online',
    'image-compressor': 'How to Compress Images to 20KB, 50KB, 100KB or 200KB',
    'image-converter': 'How to Convert Images Between JPG, PNG, WebP, SVG & ICO',
    'image-resizer': 'How to Resize Photos by Pixels or Percentage Online',
    'crop-image': 'How to Crop and Trim Photos to Custom Aspect Ratios',
    'image-watermark': 'How to Add Text and Logo Watermarks to Photos Online',
    'exif-remover': 'How to Strip EXIF Metadata and GPS Location from Photos',
    'favicon-generator': 'How to Generate a Favicon Package and HTML Head Code',
    'gif-maker': 'How to Create Animated GIFs from Photos in Your Browser',
    'batch-image-converter': 'How to Batch Convert Multiple Images to WebP, JPG, or PNG',
    'heic-to-jpg': 'How to Convert iPhone HEIC Photos to High-Quality JPG',
    'passport-photo-maker': 'How to Create Biometric Passport and Visa Photos Online',
    'signature-maker': 'How to Create a Digital Signature by Drawing, Typing, or Scanning',
    'handwriting-to-text': 'How to Convert Handwritten Notes to Digital Text with OCR',
    'image-to-text': 'How to Extract Text from Photos and Scans with Multi-Language OCR',
    'ats-resume-checker': 'How to Check if Your Resume Is ATS-Friendly',
    'json-validator': 'How to Validate JSON and Fix Syntax Errors',
    'uuid-generator': 'How to Generate Bulk UUID v4 and v1 Identifiers',
    'hash-generator': 'How to Generate MD5, SHA-256 and SHA-512 Hashes Online',
    'jwt-decoder': 'How to Decode and Inspect JSON Web Tokens (JWT) Online',
    'unix-timestamp-converter': 'How to Convert Unix Timestamps to Human-Readable Dates',
    'regex-tester': 'How to Test and Debug Regular Expressions Online',
    'json-formatter': 'How to Format, Beautify, and Validate JSON Online',
    'json-to-csv': 'How to Convert JSON Data to CSV Online',
    'csv-to-json': 'How to Convert CSV Spreadsheets to JSON Online',
    'csv-viewer': 'How to View and Search CSV Files in Your Browser',
    'base64-encoder-decoder': 'How to Encode and Decode Base64 Strings Online',
    'url-encoder-decoder': 'How to Encode and Decode URLs and URI Components',
    'sql-formatter': 'How to Format and Beautify SQL Queries Online',
    'cron-expression-generator': 'How to Build and Explain Cron Schedule Expressions',
    'qr-generator': 'How to Create a QR Code Online',
    'image-color-picker': 'How to Sample HEX and RGB Colors From an Image',
    'image-splitter-merger': 'How to Split or Combine Images in Your Browser',
    'resume-builder': 'How to Build a Professional Resume Online',
    'subtitle-generator': 'How to Create, Sync, and Export Video Subtitles (.SRT & .VTT)',
    'video-aspect-ratio': 'How to Convert Video Aspect Ratios for Reels, Shorts & YouTube',
    'video-compressor': 'How to Compress and Reduce Video File Size Online',
    'video-trimmer': 'How to Trim, Cut, and Split Video Clips in Your Browser',
    'gst-invoice-generator': 'How to Generate GST-Compliant Invoices Online',
    'omr-sheet-generator': 'How to Generate and Print Custom OMR Answer Sheets & Keys',
    'barcode-generator': 'How to Generate High-Resolution 1D Barcodes in SVG and PNG',
    'loan-eligibility-calculator': 'How to Calculate Your Maximum Loan Eligibility and Borrowing Power',
    'down-payment-calculator': 'How to Calculate Your Home Down Payment and Savings Target',
    'us-income-tax-calculator': 'How to Calculate Federal & State Income Taxes and Paycheck Take-Home Pay',
    'personal-loan-calculator': 'How to Calculate Personal Loan EMI, APR, and Amortization',
    'sale-price-calculator': 'How to Calculate Sale Prices with Stacked Discounts and Sales Tax',
    'learning-licence-mock-test': 'How to Practice for the Driving Learning Licence Exam Online',
    'signature-resizer': 'How to Resize and Compress a Signature Image for Online Forms',
    'photo-signature-joiner': 'How to Combine Photo and Signature Into a Single Image for Online Applications',
    'age-calculator': 'How to Calculate Your Exact Age by Date of Birth',
    'college-gpa-calculator': 'How to Calculate Your College Semester & Cumulative GPA',
    'background-remover': 'How to Remove Background from Images with AI Online',
    'discount-calculator': 'How to Calculate Discounted Sale Prices and Savings',
    'cgpa-calculator': 'How to Convert 10-Point CGPA to Percentage Online',
    'notice-period-calculator': 'How to Calculate Your Last Working Day and Notice Period',
    'salary-hike-calculator': 'How to Calculate Salary Hike Percentage and New CTC',
    'exam-score-calculator': 'How to Calculate Competitive Exam Marks with Negative Marking',
    'qr-business-card-generator': 'How to Create a Contact vCard QR Business Card',
    'contrast-checker': 'How to Check WCAG Color Contrast Ratios for Web Accessibility',
    'unit-converter': 'How to Convert Units Across Metric and Imperial Measurement Systems',
    'percentage-calculator': 'How to Calculate Percentages, Percentage Increase & Decrease, and Differences',
    'emi-calculator': 'How to Calculate Loan EMI, Total Interest, and Prepayment Savings',
    'currency-calculator': 'How to Calculate Currency Conversions and Foreign Exchange Rates',
    'loan-calculator': 'How to Calculate Mortgage & Loan Amortization Schedules',
    'roi-calculator': 'How to Calculate Return on Investment (ROI), Profit Margins, and Markup',
    'compound-interest-calculator': 'How to Calculate Compound Interest Growth and Annualized CAGR',
    'countdown-calculator': 'How to Calculate Exact Days, Hours, and Time Remaining to an Event',
    'online-stopwatch': 'How to Time Splits and Record Laps with Millisecond Precision',
    'countdown-timer': 'How to Set a Countdown Timer with Custom Alarm Chimes and Notifications',
    'online-clock': 'How to Check Current Local Time and Synchronized World Clocks',
    'time-zone-converter': 'How to Convert Time Zones and Plan International Meetings',
    'cement-calculator': 'How to Calculate Concrete Volume, Cement Bags, Sand, and Gravel Quantities',
    'random-letter-generator': 'How to Pick Random Alphabet Letters with Custom Case and Filters',
    'qr-code-safety-checker': 'How to Scan and Inspect QR Codes for Malicious Links and Quishing Threats',
    'typing-speed-test': 'How to Measure Words Per Minute (WPM) and Keystroke Accuracy Online',
    'file-checksum-verifier': 'How to Calculate and Verify File Checksums (SHA-256, SHA-512, SHA-1, MD5)',
    'passphrase-generator': 'How to Generate Cryptographically Secure Diceware Passphrases',
    'password-strength-checker': 'How to Test Password Strength, Shannon Entropy, and Brute-Force Crack Time',
    'text-encrypt-decrypt': 'How to Encrypt and Decrypt Confidential Text with AES Symmetric Keys',
    'scientific-calculator': 'How to Use the Scientific Calculator for Advanced Mathematics',
  };

  return specificHeadings[tool.id] || `How to Use ${tool.navTitle || tool.title}`;
}

/**
 * Returns a high-quality, intent-answering first paragraph for tool pages.
 */
export function getToolIntroParagraph(tool: { id: string; title: string; navTitle?: string; description: string; category: string }): string {
  const isNetwork = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);

  const priorityIntros: Record<string, string> = {
    'pdf-merge':
      'Zubware PDF Merge combines multiple separate PDF documents into a single organized file directly in your browser. Whether you need to compile contracts, scanned receipts, academic assignments, or business reports, you can reorder pages by dragging and dropping multiple files simultaneously. All merging executes locally using client-side WebAssembly and pdf-lib, ensuring your confidential documents are never uploaded to remote servers.',
    'pdf-split':
      'Zubware PDF Split extracts specific pages, custom ranges, or separates every individual page from your PDF document into standalone files. Ideal for extracting signed agreement pages or downsizing large multi-chapter reports, it processes files locally in your browser memory with zero server uploads.',
    'image-to-pdf':
      'Zubware Image to PDF Converter compiles photos, scanned forms, receipts, and screenshots into standardized, multi-page PDF documents directly in your browser. Choose standard ISO page sizes (A4, US Letter, or Fit to Image), customize margin padding, reorder pictures intuitively, and export print-ready PDFs without uploading private photos to external servers.',
    'pdf-to-images':
      'Zubware PDF to Images extracts and rasterizes PDF document pages into high-resolution PNG or JPG images directly in your browser memory. Choose from 1x, 2x, or 3x DPI resolution multipliers for crystal-clear presentations and print graphics, and download individual pages or a consolidated ZIP archive with zero cloud bottlenecks.',
    'delete-pdf-pages':
      'Zubware Delete PDF Pages removes unwanted, blank, duplicate, or confidential pages from PDF documents with visual thumbnail previews and range selection. Reconstructs a clean, optimized PDF omitting deleted pages entirely, reducing file weight and protecting sensitive records with 100% private in-browser processing.',
    'extract-pdf-pages':
      'Zubware Extract PDF Pages isolates specific target pages, chapters, or signed agreement sheets from multi-page PDFs and compiles them into a standalone document. Select pages visually or input custom ranges (e.g., 1, 4-6, 11) while preserving original fonts, vector sharpness, and metadata with zero server uploads.',
    'protect-pdf':
      'Zubware Protect PDF encrypts sensitive financial statements, contracts, and confidential records with standard 128-bit and 256-bit AES encryption. Set user passwords for viewing access, configure owner passwords with granular restrictions against unauthorized printing or copying, and safeguard documents with 100% private browser WebAssembly cryptography.',
    'unlock-pdf':
      'Zubware Unlock PDF permanently strips password encryption and security restrictions from authorized PDF documents directly in your browser. By entering your known password once, it decrypts the document in memory and saves a clean, unencrypted PDF that opens friction-free on any device with zero server tracking.',
    'pdf-size-adjuster':
      'Zubware PDF Size Adjuster modifies PDF document weights to exact target KB or MB thresholds mandated by government exam portals (UPSC, SSC, IBPS, State PSCs) and university upload systems. Expand file size safely using standard PDF private data streams without blurring text or degrading visual layout, or compress oversized documents below upload limits with complete browser privacy.',
    'pdf-to-jpg':
      'Zubware PDF to JPG Converter transforms PDF document pages into universally compatible JPEG images with customizable compression quality (High 100%, Medium 80%, Low 60%) and multi-scale DPI resolution. Render crisp presentation graphics with automated white background filling, and download single pages or bulk ZIP archives directly from browser memory.',
    'edit-pdf':
      'Zubware Online PDF Editor provides an intuitive client-side workspace to add custom text overlays, draw freehand pen annotations, sketch arrows, and stamp signatures onto PDF documents. Permanently flattens edits directly into the PDF content stream with zero watermarks, zero logins, and complete device privacy.',
    'pdf-to-word':
      'Zubware PDF to Word Converter parses digital text, headings, and paragraph structures from PDF files and compiles them into native OpenXML Microsoft Word (.docx) documents. Inspect converted pages in an interactive reading pane and export clean, editable documents for MS Word and Google Docs with zero cloud uploads.',
    'word-to-pdf':
      'Zubware Word to PDF Converter transforms Microsoft Word (.docx) files into clean, standardized vector PDF documents directly in your browser. Unzips OpenXML packages, preserves headings, paragraphs, bulleted lists, and data tables, and generates print-ready vector PDFs with customizable page geometry (A4 or Letter) and margin formatting.',
    'pdf-to-text':
      'Zubware PDF to Text Converter extracts text from research papers, ebooks, and documents using a dual-engine architecture: instantaneous digital vector text extraction via pdfjs-dist, and client-side neural optical character recognition (OCR) via Tesseract.js for scanned, image-only documents across multiple languages with complete privacy.',
    'pdf-to-excel':
      'Zubware PDF to Excel Converter reconstructs tabular data from PDF invoices, bank account statements, and tax forms into editable spreadsheets. Groups text coordinates into rows and columns, provides an interactive table editor, and exports directly to Microsoft Excel (.xlsx) and CSV formats in browser memory.',
    'pdf-signature':
      'Zubware Sign PDF Online provides a fast, privacy-focused electronic signing workflow with 3 signature creation methods (draw with mouse/touchscreen, type cursive script, or upload signature image) and multi-page placement controls. Embeds signatures directly into PDF documents using client-side WebAssembly with zero server storage.',
    'pdf-compressor':
      'Zubware PDF Compressor reduces the file size of PDF documents directly in your browser using PDF optimization or image-based rebuilding. Stronger compression can reduce detail and remove selectable text, links or form fields. Keep the original and inspect the output. Select from the available compression presets to optimize scanned forms, multi-page reports, and contracts for email attachments and portal upload limits. All compression algorithms run 100% locally in your device memory with zero server uploads.',
    'image-compressor':
      'Zubware Image Compressor reduces the byte size of JPG, PNG, and WebP photos to exact limits like 20KB, 50KB, 100KB, or 200KB with adjustable quality and resolution. Small size targets can reduce detail; inspect the downloaded image before submitting it. Designed for government exam application forms (SSC, UPSC, State PSC), job portals, and web optimization, all compression algorithms run 100% locally in your browser memory with zero server uploads.',
    'image-resizer':
      'Zubware Image Resizer modifies photo dimensions by exact pixels, percentage scale, or social media presets (Instagram 1:1, Stories 9:16, YouTube 16:9, LinkedIn) while preserving original aspect ratios. Process single pictures or bulk batches simultaneously, adjust output format and compression quality, and download resized images or a consolidated ZIP archive with zero cloud logging.',
    'image-converter':
      'Zubware Image Converter reads supported photos and SVG inputs and exports JPG, PNG, WebP, BMP or a single-size ICO in your browser. AVIF export appears only when supported by the browser. Adjust shared quality settings, fill transparent backgrounds for JPEG/BMP and resize output. SVG is an input format, not a vector output option.',
    'crop-image':
      'Zubware Crop Image trims photos to custom pixel bounds or standardized aspect ratio presets (1:1 square, 4:3, 16:9 widescreen, 9:16 vertical, and A4 document ratio) directly in your browser. Inspect composition with smooth 50%–200% zoom and 90-degree rotation controls, and export pristine crops in PNG, JPG, or WebP format with zero server uploads.',
    'image-watermark':
      'Zubware Watermark Image protects your photography, digital artwork, and confidential documents by stamping custom text autographs or transparent PNG logos directly onto your images. Customize rotation angles, opacity levels, font styles, drop shadows, and full-image diagonal tiled repeat patterns. All rendering executes locally on an HTML5 canvas with zero remote tracking.',
    'exif-remover':
      'Zubware EXIF Remover strips sensitive metadata from your photos before you share them online. It eliminates embedded GPS coordinates, altitude data, camera make and lens specifications, device serial numbers, exact timestamps, and editing history by re-encoding pixels; JPEG quality and file size can change. All metadata purging executes 100% locally inside your device browser.',
    'favicon-generator':
      'Zubware Favicon Generator creates a complete, production-ready website favicon suite from any uploaded image. It renders 9 standardized PNG resolutions (16x16 to 512x512 px), Apple Touch Icons for iOS Safari, Android Chrome PWA icons, a classic Windows favicon.ico binary, and a pre-formatted site.webmanifest. Download everything in a single ZIP package with copyable HTML head code.',
    'gif-maker':
      'Zubware GIF Maker turns multiple image frames into smooth animated GIFs directly in your browser. Customize frame delay timings, playback speed, canvas dimensions, and loop directions (forward, reverse, or ping-pong bounce). Powered by client-side omggif binary encoding, your animated GIFs are created in browser memory with zero watermarks and zero server uploads.',
    'batch-image-converter':
      'Zubware Batch Image Converter converts dozens of photos simultaneously to modern WebP, universal JPG, or lossless PNG format directly in your browser. Queue entire folders, fine-tune global compression quality, monitor real-time conversion progress per file, and download all processed images in a single ZIP archive without cloud upload bottlenecks.',
    'ats-resume-checker':
      'Zubware ATS Resume Checker is a free online tool that evaluates your resume against target job postings to calculate your ATS compatibility score (0–100%). It scans for technical and soft skill keywords, detects missing qualifications, verifies contact details, and highlights formatting risks before you submit your application. All PDF text extraction and keyword matching run 100% locally in your browser with zero server uploads and complete privacy.',
    'json-validator':
      'Zubware JSON Validator verifies JSON syntax, highlights parse errors with exact line and column numbers, and formats messy code into readable indented structures. Ideal for API debugging and configuration audits, all validation and formatting execute locally in your browser with zero data retention.',
    'qr-generator':
      'Zubware QR Code Generator creates high-resolution, customized QR codes instantly from website URLs, plain text, Wi-Fi networks, and contact cards. Designed for businesses, educators, event organizers, and everyday sharing, it runs smoothly on both desktop and mobile browsers. Every QR code is rendered 100% locally in your device memory with zero server uploads, no account registration, and no tracking redirects, giving you permanent, private QR codes that never expire.',
    'image-color-picker':
      'Zubware Color Picker extracts exact pixel color values from any photo, UI screenshot, or graphic with a real-time 9x magnifying loupe. You can inspect and copy colors across HEX, RGB, HSL, HSV, and CMYK formats, while clicked swatches are automatically saved to your session palette. All pixel sampling runs locally in browser memory.',
    'image-splitter-merger':
      'Zubware Image Splitter & Combiner slices images cleanly along any vertical or horizontal line, or merges two images into a seamless composite directly in your browser. With real-time seam positioning and auto-trim padding options, processing executes completely in client memory with zero server uploads.',
    'resume-builder':
      'Zubware Resume Builder is a free online CV maker that lets you design professional, ATS-friendly resumes directly in your browser. Choose from 20 modern and classic templates, customize work experience and education sections, tailor skills and certifications, and instantly download a high-resolution PDF or backup JSON file. All data is saved automatically in your browser storage with zero server uploads, no user tracking, and no sign-up required.',
    'gst-invoice-generator':
      'Zubware GST Invoice Generator creates legally structured Indian tax invoices with automatic CGST, SGST, and IGST tax bifurcation, HSN/SAC code classification, dynamic UPI payment QR codes, and instant vector PDF downloads. Purpose-built for Indian small business owners, freelancers, GST-registered traders, and consultancies, financial calculations and high-resolution PDF rendering execute 100% locally in your web browser memory with complete data privacy.',
    'subtitle-generator':
      'Zubware Video Subtitle & SRT Generator creates, synchronizes, and exports timed caption tracks for your videos directly in your browser. Load MP4, WebM, or MOV files into the synchronized player, dictate dialogue in real time using the browser Web Speech API, fine-tune timestamps down to tenths of a second, and download standardized SubRip (.srt) or WebVTT (.vtt) files for YouTube Studio and video editors. Video files stay local; optional microphone dictation may send audio to your browser provider for speech recognition.',
    'video-aspect-ratio':
      'Zubware Video Aspect Ratio Converter reframes video footage for modern social media platforms including 9:16 vertical (TikTok, Instagram Reels, YouTube Shorts), 16:9 widescreen, 1:1 square, and 4:5 portrait posts. Choose between Contain mode with real-time blurred ambient padding or Cover mode for center cropping, and re-encode high-bitrate WebM video with synchronized audio directly in your browser.',
    'video-compressor':
      'Zubware Video Compressor reduces MP4, WebM, and MOV video file sizes directly in your browser without uploading private footage to remote cloud servers. Select from High, Medium, or Low bitrate presets, scale video dimensions to 75% or 50%, and preserve clear audio tracks while shrinking byte weights to fit under strict Discord, Gmail, and messaging upload limits.',
    'video-trimmer':
      'Zubware Video Trimmer & Cutter cuts, extracts, and slices video clips with frame-accurate precision directly in your browser. Drag interactive timeline scrubber handles, enter exact second and decimal cut points, test isolated looping previews, and export pristine trimmed WebM video clips with audio preserved and zero watermarks.',
    'omr-sheet-generator':
      'Zubware OMR Sheet Generator creates customizable, print-ready Optical Mark Recognition answer sheets and master answer keys for schools, coaching institutes, and competitive exam practice. Configure 20 to 150 questions, 4 to 6 options (A–D, A–E, A–F), student roll number grids, test booklet set codes, and corner fiducial registration marks, and export crisp 300 DPI A4 PDF documents ready for standard laser printers.',
    'barcode-generator':
      'Zubware Free Barcode Generator creates high-resolution vector SVG and raster PNG 1D barcodes across 9 standardized linear symbologies, including Code 128, EAN-13, UPC-A, Code 39, and ITF-14. Customize bar dimensions, colors, and human-readable text labels for warehouse inventory, shipping cartons, and retail product labeling with 100% private in-browser generation.',
    'loan-eligibility-calculator':
      'Zubware Loan Eligibility Calculator computes your maximum borrowing capacity and maximum allowable monthly installment (EMI) based on net take-home salary, existing loan commitments, expected interest rates, tenure, and lender Debt-to-Income (DTI / FOIR) caps. Evaluate current vs projected debt ratios and borrowing headroom with complete financial privacy.',
    'down-payment-calculator':
      'Zubware Down Payment Calculator determines required upfront cash for purchasing real estate, evaluating loan presets (Conventional 20% no-PMI, 3% minimum, FHA 3.5%, VA 0%), estimated closing costs (2%–5%), and compound savings growth in a High-Yield Savings Account (HYSA). Calculate exact monthly savings targets to reach your homebuying goal on time.',
    'us-income-tax-calculator':
      'Zubware US Income Tax Calculator models official IRS federal tax brackets for 2025 and 2026, standard deductions across all four filing statuses (Single, Married Joint, Married Separate, Head of Household), FICA Social Security and Medicare payroll taxes, and an optional custom effective state tax rate to estimate wage take-home pay. Credits, self-employment tax and state-specific tax brackets are not modeled.',
    'personal-loan-calculator':
      'Zubware Personal Loan Calculator computes fixed monthly payments (EMI), total interest costs, true APR incorporating upfront lender origination fees, and net disbursed funds. Model early loan payoff with extra monthly principal contributions and inspect a complete month-by-month amortization schedule with CSV spreadsheet export.',
    'sale-price-calculator':
      'Zubware Sale Price Calculator computes sequential retail markdowns, stacked promotional coupon codes, sales tax / VAT, and total out-of-pocket register costs across international currencies. Understand true effective discount percentages on clearance doorbusters with instantaneous browser calculations.',
    'learning-licence-mock-test':
      'Zubware Learning Licence Mock Test is a free online practice simulator designed to help learner drivers prepare for the Indian RTO computer-based driving licence examination. Featuring real test questions based on the Motor Vehicles Act, mandatory traffic signs, and road safety regulations in bilingual English and Hindi, you can practice with an optional 15-minute exam timer or study at your own pace with instant answer explanations. All questions and results run 100% locally in your browser with zero sign-up required. (Note: Zubware is an independent educational practice tool and is not affiliated with the Ministry of Road Transport and Highways or any state RTO).',
    'signature-resizer':
      'Zubware Signature Resizer is a free online tool designed to crop, resize, and compress scanned signatures for government, exam, and job recruitment portals (including SSC, UPSC, IBPS, NEET, and State PSCs). Adjust dimensions in pixels (px), centimeters (cm), millimeters (mm), or inches, trim empty paper borders automatically, set strict maximum file size caps (such as < 20KB or < 50KB), and export in form-compliant JPG or transparent PNG format. All processing runs 100% locally in your browser with zero server uploads without uploading your signature to Zubware. Keep the downloaded file private.',
    'photo-signature-joiner':
      'Zubware Photo and Signature Joiner is a free browser-based tool that stitches candidate passport photos and scanned signatures into a single unified image for competitive examinations, admit cards, and job applications. Choose between vertical stacked or horizontal side-by-side layouts, apply standard recruitment presets (such as 300×460 px), customize individual dimensions, gaps, and outer borders, and download compliant JPG or PNG files. All image composition executes client-side with zero server uploads.',
    'age-calculator':
      'Zubware Age Calculator is a free online tool that calculates your exact chronological age in completed years, months, and days from your date of birth. Compare your age against today\'s date or any custom milestone, track total elapsed days, weeks, and hours, and view the countdown to your next birthday. All calculations execute instantly and privately inside your browser memory with zero server tracking.',
    'college-gpa-calculator':
      'Zubware College GPA Calculator computes your semester grade point average (GPA) and cumulative college GPA on a standard 4.0 weighted scale. Add credit hours and letter grades (A+ to F) for each course to calculate quality points, assess graduation academic honors (Cum Laude, Magna Cum Laude, Summa Cum Laude), and plan upcoming semester target grades. All calculations execute instantly and privately in your browser memory with zero server tracking.',
    'heic-to-jpg':
      'Zubware HEIC to JPG Converter transforms Apple iPhone and iPad HEIC and HEIF photos into universal high-resolution JPG images directly in your browser. Batch convert multiple live photos or camera roll exports with adjustable JPEG quality and no account login. JPEG is a lossy format; compare the result with your original. All conversion algorithms execute 100% locally on your device with zero server uploads.',
    'background-remover':
      'Zubware Background Remover isolates subjects and removes image backgrounds automatically using client-side machine learning. Whether preparing product listings for e-commerce, creating passport photos, or designing social media graphics, you can download transparent 32-bit PNG cutouts instantly with zero watermarks. All neural network processing executes privately on your device via WebAssembly with no server uploads.',
    'passport-photo-maker':
      'Zubware Passport & Visa Photo Maker creates officially compliant biometric ID photos for India (MEA online 35x45mm & visa 2x2"), United States (2x2"), Schengen Europe (35x45mm), UK, Canada, and Australia. Use biometric head and eye alignment guides, fine-tune zoom, rotation, and lighting, change background colors to official white or light grey, and download individual JPGs or printable 4x6" multi-photo PDF sheets.',
    'signature-maker':
      'Zubware Online Signature Maker creates professional electronic signatures for legal contracts, PDF documents, and online employment applications. Draw your autograph with smooth bezier pen strokes, generate realistic cursive signatures using elegant calligraphy fonts, or scan and clean a paper signature by removing paper background texture. Export in transparent PNG, solid white JPG, or vector SVG format with complete privacy.',
    'handwriting-to-text':
      'Zubware Handwriting to Text OCR converts handwritten notebook pages, whiteboard sketches, student homework, and canvas scribbles into editable digital text directly in your browser. Featuring automatic adaptive binarization, high-contrast ink enhancement, and client-side Tesseract.js neural network OCR, your handwritten notes are transcribed locally with zero cloud data retention.',
    'image-to-text':
      'Zubware Image to Text OCR Converter extracts editable text from screenshots, invoices, receipts, book pages, and scanned photos across 11+ languages including English, Hindi (हिंदी), Spanish, French, and German. Powered by client-side Tesseract.js WebAssembly, optical character recognition runs completely in browser memory with real-time progress tracking, accuracy confidence ratings, and instant text download.',
    'discount-calculator':
      'Zubware Discount Calculator determines final retail checkout prices and total monetary savings across percentage discounts, flat cash price drops, stacked coupons, and local sales tax rates. Switch between single product calculations and multi-item shopping cart breakdowns with instant local browser computation.',
    'cgpa-calculator':
      'Zubware CGPA Calculator converts 10-point scale CGPA into equivalent percentage marks for Indian university students and competitive exam applications (CBSE, VTU, Mumbai University, AKTU). Calculate aggregate percentages with standard university multipliers (such as 9.5x) or custom conversion formulas with zero server tracking.',
    'notice-period-calculator':
      'Zubware Notice Period Calculator determines your exact Last Working Day (LWD) and remaining calendar days upon submitting a job resignation. Factor in contractual notice periods (30, 60, or 90 days), weekend policies, paid leave adjustments, and early release buyout estimates with complete privacy.',
    'salary-hike-calculator':
      'Zubware Salary Hike Calculator evaluates your annual appraisal increment, new gross salary, and percentage appraisal hike. Compare pre-hike and post-hike CTC compensation packages, monthly in-hand take-home changes, and job switch offers with zero server storage.',
    'exam-score-calculator':
      'Zubware Exam Score Calculator computes total raw scores, penalty deductions for incorrect responses, and net percentages for competitive entrance exams (such as SSC, UPSC, NEET, JEE, and Banking). Input attempted questions, correct answers, and negative penalty ratios to verify answer keys instantly.',
    'qr-business-card-generator':
      'Zubware QR Business Card Generator creates standardized vCard 3.0 digital contact barcodes for print and mobile networking. Encode full names, job titles, companies, telephone numbers, emails, addresses, and websites into scannable QR symbols with customizable dimensions, error correction levels, and vector SVG and high-resolution PNG downloads without cloud tracking.',
    'scientific-calculator':
      'Zubware Scientific Calculator is a free online mathematical tool engineered for students, engineers, and researchers to solve complex arithmetic, trigonometry, logarithms, powers, and roots directly in the browser. Easily toggle between Degree (DEG) and Radian (RAD) angle modes, compute natural logarithms (ln) and common logs (log₁₀), evaluate factorials (n!), and recall past calculations from your private browser history. Built with a safe client-side parsing engine, all computations execute instantly on your device with complete privacy.',
    'contrast-checker':
      'Zubware Contrast Checker calculates mathematically precise color contrast ratios between foreground text and background elements using the W3C sRGB relative luminance standard. Instantly evaluate WCAG 2.1 Level AA and Level AAA compliance across normal text, large headlines, and graphical user interface components with live visual card previews and complete browser privacy.',
    'unit-converter':
      'Zubware Unit Converter provides instantaneous two-way conversion across 7 core measurement categories: Length, Mass/Weight, Temperature, Volume, Area, Speed, and Digital Storage. Designed with high floating-point precision and standardized international conversion factors, all unit calculations run 100% locally in your browser with zero latency.',
    'percentage-calculator':
      'Zubware Percentage Calculator solves multi-scenario percentage math including finding percentages of values, calculating what percentage one number is of another, evaluating percentage increase and decrease, and compounding additions or discounts. Features clear step-by-step mathematical explanations and immediate client-side calculations.',
    'emi-calculator':
      'Zubware EMI Calculator computes equated monthly installments for home mortgages, auto loans, and personal loans using standard monthly reducing balance formulas. Input principal, annual interest rate, and tenure to evaluate monthly payments, total interest payable, annual amortization schedules, and interest saved through extra monthly prepayments.',
    'currency-calculator':
      'Zubware Currency Calculator performs instantaneous fiat currency conversions across major international currencies including USD, EUR, GBP, INR, JPY, CAD, AUD, and AED. Features benchmark foreign exchange rates, custom bank spread adjustments, and instant reciprocal rate comparisons without external network latency or tracker cookies.',
    'loan-calculator':
      'Zubware Loan & Mortgage Calculator provides comprehensive financial amortization modeling for residential home loans, commercial mortgages, and fixed-rate borrowing. Analyze monthly principal and interest payments, total lifetime financing costs, and accelerated payoff schedules achieved through recurring extra principal contributions.',
    'roi-calculator':
      'Zubware ROI & Profit Margin Calculator analyzes commercial profitability across three dedicated financial modes: Gross Profit Margin vs Markup %, Return on Investment (ROI) %, and Break-Even Unit Volume Analysis. Compare revenue gains against cost outlays with mathematically rigorous formulas and complete client-side data privacy.',
    'compound-interest-calculator':
      'Zubware Compound Interest & CAGR Calculator models exponential long-term wealth accumulation and annualized investment returns. Simulate initial deposits with recurring monthly contributions across daily, monthly, quarterly, or annual compounding frequencies, or calculate exact historical Compound Annual Growth Rates (CAGR) without server logging.',
    'countdown-calculator':
      'Zubware Countdown Calculator measures exact remaining time until future deadlines, exams, holidays, and milestones, or calculates elapsed time since past events. Breaks down calendar intervals into days, hours, minutes, seconds, total weeks, and working business days with live real-time ticking and zero cloud storage.',
    'online-stopwatch':
      'Zubware Online Stopwatch delivers high-resolution millisecond timing powered by the browser\'s performance.now() engine and requestAnimationFrame. Features start, pause, resume, and split lap recording with automated fastest/slowest lap identification and one-click clipboard export for athletic and productivity training.',
    'countdown-timer':
      'Zubware Countdown Timer provides precision duration countdowns with quick presets (including a 25-minute Pomodoro study timer) and custom hour/minute/second configurations. Features local Web Audio API synthesized chime alerts, HTML5 desktop notifications, and distraction-free fullscreen presentation mode with 100% offline functionality.',
    'online-clock':
      'Zubware Online Clock & World Clock displays accurate local system time down to the second with 12-hour (AM/PM) and 24-hour military toggles, full date formatting, and local time zone detection. Add multiple global cities (London, New York, Tokyo, Sydney, Mumbai, Dubai) to monitor real-time international business hours with zero server tracking.',
    'time-zone-converter':
      'Zubware Time Zone Converter coordinates cross-border meetings and global schedules using the international IANA time zone database. Compare source times against multiple target cities, account for seasonal Daylight Saving Time (DST) shifts, highlight standard 9-to-5 working hour overlaps, and copy meeting invitations directly to your clipboard.',
    'cement-calculator':
      'Zubware Cement Concrete Calculator estimates volumetric concrete requirements and raw material batches for slabs, footings, retaining walls, and columns. Supports Metric and Imperial units, standard nominal mix ratios (M15, M20, M25), dry volume void coefficients (1.54 factor), and wastage contingency buffers with complete in-browser calculation.',
    'random-letter-generator':
      'Zubware Random Letter Generator draws randomized letters from the English alphabet for word games, classroom phonics, vocabulary drills, and creative prompts. Configure uppercase, lowercase, or mixed casing, filter by vowels or consonants, control duplicate sampling, and choose custom delimiters with instant client-side generation.',
    'qr-code-safety-checker':
      'Zubware QR Code Safety Checker inspects QR code payloads safely inside an isolated browser sandbox before you open links. Decode QR codes via image upload, device camera, or text input, and evaluate structural security flags including insecure protocols, IP hostnames, URL shorteners, and credential phishing indicators with zero cloud data transmission.',
    'typing-speed-test':
      'Zubware Typing Speed Test evaluates keyboarding proficiency across 15, 30, and 60-second typing assessments. Calculates Net WPM, Gross WPM, percentage accuracy, and error counts using standardized 5-character word metrics with live visual feedback, multiple practice passages, and zero server logging.',
    'file-checksum-verifier':
      'Zubware File Checksum Verifier validates file integrity and verifies software downloads against published hashes using the browser\'s native Web Crypto API. Calculate SHA-256, SHA-512, SHA-1, and MD5 digests for large installers and disk images directly in browser RAM without uploading a single byte to external servers.',
    'passphrase-generator':
      'Zubware Memorable Passphrase Generator creates strong, memorable multi-word passphrases using window.crypto.getRandomValues() CSPRNG entropy and a curated dictionary of clean English words. Customize word counts (3 to 10 words), separators, capitalization, numbers, and symbols while inspecting exact mathematical entropy bits with complete local privacy.',
    'password-strength-checker':
      'Zubware Password Strength Checker evaluates credential security in real-time through client-side heuristic inspection and Shannon entropy analysis. Detect common keyboard sequences, dictionary words, and character pool vulnerabilities, and review estimated brute-force resistance against offline GPU cracking clusters with zero network transmission.',
    'text-encrypt-decrypt':
      'Zubware AES Text Encrypt & Decrypt provides client-side symmetric-key cryptography to secure confidential notes, messages, and credentials with a private secret key. Transform plaintext into clean Base64-encoded ciphertext or decrypt cipher payloads in local browser memory with zero tracking and zero server storage.',
    'jwt-decoder':
      'Zubware JWT Decoder decodes and inspects JSON Web Tokens (JWT) directly inside your browser without transmitting sensitive authentication tokens over the network. Inspect token headers, signature algorithms (RS256, HS256), payload claims (sub, iss, aud, exp), human-readable expiration timestamps, and validation status in real time. Processing executes 100% locally in device memory, ensuring your confidential production credentials, session claims, and bearer tokens never leak to external servers.',
  };

  if (priorityIntros[tool.id]) {
    return priorityIntros[tool.id];
  }

  const cleanCat = tool.category.replace(/^[^\w]+/, '').trim();
  const privacyNote = isNetwork
    ? 'Requests communicate directly from your browser to designated external endpoints without server logging.'
    : 'All processing takes place client-side in browser memory with zero server uploads.';

  return `${tool.title} provides dedicated online capabilities for ${cleanCat.toLowerCase()} workflows. ${tool.description} ${privacyNote}`;
}


