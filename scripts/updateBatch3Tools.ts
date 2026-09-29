import * as fs from 'fs';

interface HowToStep {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Batch3Update {
  title?: string;
  navTitle?: string;
  description?: string;
  features?: string[];
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const BATCH_3_TOOLS: Record<string, Batch3Update> = {
  'signature-maker': {
    title: 'Online Signature Maker — Create Digital Signatures Free',
    navTitle: 'Signature Maker',
    description: 'Create digital signatures online for forms, contracts, and applications. Draw with mouse or touchscreen, type in cursive script fonts, or scan and clean signatures with a transparent background.',
    features: [
      'Smooth Digital Drawing Canvas',
      'Realistic Cursive Typing Fonts',
      'Scan & Upload Signature Cleanup',
      'Transparent PNG & High-Res JPG Export',
      'Auto-Crop Padding',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Choose Signature Mode', desc: 'Select Draw to sign with your mouse, finger, or stylus; Type to generate cursive scripts; or Upload to scan an ink signature from paper.' },
      { title: 'Customize Style & Transparency', desc: 'Choose ink color (black, blue, red), stroke width, cursive font style, and toggle auto-crop margins with a transparent background.' },
      { title: 'Download Digital Signature', desc: 'Preview your clean signature on the canvas and download it as a transparent PNG or high-resolution JPG ready for documents and forms.' }
    ],
    faq: [
      { question: 'Can I draw my signature using a mouse, stylus, or touchscreen?', answer: 'Yes. The drawing canvas supports mouse input, touchscreens on phones and tablets, and digital stylus pens with smooth stroke interpolation.' },
      { question: 'Can I create a typed cursive signature?', answer: 'Yes. Switch to Type mode, enter your name, and select from cursive and calligraphy font styles with adjustable ink color and slant.' },
      { question: 'Can I download my signature with a transparent background?', answer: 'Yes. Select the Transparent background option and download as PNG. The exported file has no white background box and can be placed cleanly over document signature lines.' },
      { question: 'How does paper signature scanning and cleanup work?', answer: 'Upload a photo of your signature on paper, then adjust the background threshold slider to isolate the dark ink strokes onto a clean transparent background.' },
      { question: 'Is my digital signature stored or sent to a server?', answer: 'No. The signature is created, smoothed, and exported entirely within your browser memory and is not transmitted to Zubware servers.' }
    ]
  },

  'signature-resizer': {
    title: 'Signature Resizer — Resize Signature Images Online Free',
    navTitle: 'Signature Resizer',
    description: 'Resize signature images to custom pixel dimensions, millimeter/centimeter measurements, and maximum KB file size limits for online application forms and documents.',
    features: [
      'Exact Pixel, CM, MM & Inch Sizing',
      'Target KB File Size Compression Limit',
      'Auto-Crop Margins & Background Mode',
      'Contrast Enhancement for Darker Ink',
      'JPG, PNG & WebP Output Support',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Upload Signature Image', desc: 'Select your digital or scanned signature file (PNG, JPG, or WebP) from your device.' },
      { title: 'Set Dimensions & KB Limit', desc: 'Specify target width and height in pixels, cm, mm, or inches, and optionally enter a maximum file size limit (e.g. 20KB or 50KB).' },
      { title: 'Crop Margins & Download', desc: 'Enable auto-crop margins to remove excess whitespace around strokes, inspect the output size preview, and download your resized signature.' }
    ],
    faq: [
      { question: 'How do I resize a signature to meet strict 20KB or 50KB limits?', answer: 'Enter your required maximum KB limit in the Max File Size field. The compression engine iteratively scales quality and resolution to keep the exported file under your threshold.' },
      { question: 'What measurement units are supported for sizing?', answer: 'You can specify signature dimensions in pixels (px), centimeters (cm), millimeters (mm), or inches (in).' },
      { question: 'Will downscaling blur or distort my signature lines?', answer: 'Keeping the aspect ratio locked prevents stretching or warping, and the canvas resampling engine maintains stroke contrast for clean, legible ink lines.' },
      { question: 'Does this tool guarantee acceptance on specific government portals?', answer: 'No tool can guarantee acceptance because individual portals may have varying file name, aspect ratio, or DPI guidelines. This tool formats your image to the dimensions and file size limits you configure.' },
      { question: 'Is my signature uploaded to an external server for resizing?', answer: 'The image is processed locally in your web browser and is not sent to a Zubware server for processing.' }
    ]
  },

  'photo-signature-joiner': {
    title: 'Photo and Signature Joiner — Combine Images Online Free',
    navTitle: 'Photo + Signature Joiner',
    description: 'Combine passport-style photos and signatures into a single unified image file for job applications, entrance examinations, and verification forms.',
    features: [
      'Vertical (Stacked) & Side-by-Side Layouts',
      'Custom Dimension Controls',
      'Exam & Application Presets',
      'Borders & Spacing Options',
      'High-Res JPG & PNG Export',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Upload Photo & Signature', desc: 'Select your passport-style portrait in slot 1 and your signature image in slot 2.' },
      { title: 'Adjust Layout & Dimensions', desc: 'Choose vertical stacked (photo on top, signature below) or side-by-side layout, and customize width, height, gap spacing, and border margins.' },
      { title: 'Preview & Download Composite', desc: 'Review the live composite image on the canvas and download the joined result in JPG or PNG format.' }
    ],
    faq: [
      { question: 'Why do entrance exams and job portals require photo and signature combined?', answer: 'Many application portals require a single unified image file containing both the candidate photo and signature to simplify verification on admit cards and candidate records.' },
      { question: 'Can I adjust the gap and border between the photo and signature?', answer: 'Yes. You can customize the vertical or horizontal gap between images, set outer border thickness, choose border colors, and set the background fill.' },
      { question: 'How can I prevent the photo and signature from looking stretched?', answer: 'The tool allows you to adjust individual dimensions and provides preset aspect options so both portrait and signature maintain natural proportions without distortion.' },
      { question: 'Which file format is recommended for online application forms?', answer: 'Most application portals recommend JPG/JPEG format with an opaque white background. You can select JPG export before downloading.' },
      { question: 'Are my personal identification photos uploaded to a server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },

  'photo-name-date-joiner': {
    title: 'Add Name and Date to Photo Online — Exam Photo Maker',
    navTitle: 'Photo Name & Date',
    description: 'Add candidate name and date of photo (DOP) or date of birth (DOB) to passport-style photos for entrance exams, recruitment portals, and application forms.',
    features: [
      'Custom Candidate Name & Date Formatting',
      'Bottom Strip, Top Strip & Overlay Modes',
      'Recruitment Exam Photo Preparation',
      'High-Resolution Vector Typography',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Upload Passport-Style Photo', desc: 'Select your portrait photograph from your computer or mobile device.' },
      { title: 'Enter Candidate Name & Date', desc: 'Type your name, enter the date, select whether to display Date of Photo (DOP) or Date of Birth (DOB), and pick your date format.' },
      { title: 'Position Strip & Download', desc: 'Adjust bottom strip height, font styling, and border settings, preview the formatted image, and download your form photo.' }
    ],
    faq: [
      { question: 'What is the difference between DOP and DOB on candidate photos?', answer: 'DOP stands for Date of Photo (the date the photograph was captured, often requested to be within the last 3 months). DOB stands for Date of Birth.' },
      { question: 'Which date formats can I choose for the label?', answer: 'The tool supports DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, and DD-MMM-YYYY (e.g. 15-OCT-2024) formats.' },
      { question: 'Does adding the name and date strip crop out the face?', answer: 'No. The text strip is positioned at the lower margin. You can adjust the strip height percentage and reposition your photo to ensure facial features remain unobscured.' },
      { question: 'Can I include a label prefix like "DOP:" or "DOB:"?', answer: 'Yes. You can select prefixes including "DOP:", "DOB:", "Date:", or no prefix to match your application requirements.' },
      { question: 'Are my application photos uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },

  'passport-photo-maker': {
    title: 'Passport & Visa Photo Maker',
    navTitle: 'Passport Photo Maker',
    description: 'Create passport-style and visa-style photos online. Crop to popular document dimensions, adjust lighting, and generate printable sheets directly in your browser.',
    features: [
      'Standard Country Dimension Profiles',
      'Face Position Alignment Guide',
      'Background Color Changer',
      'Photo Touch-Up & Lighting Controls',
      'Print Sheet Generator (A4, 4x6 in)'
    ],
    howTo: [
      { title: 'Upload Portrait Photo', desc: 'Select a clear, front-facing portrait photo with even lighting and a neutral expression.' },
      { title: 'Select Dimension Preset & Align Face', desc: 'Choose a standard passport-style preset (such as 2x2 inches or 35x45 mm) and align your face using the framing guide.' },
      { title: 'Arrange Sheet & Download', desc: 'Select your preferred background shade, choose single photo or multi-photo printable sheet layout, and download as JPG or PDF.' }
    ],
    faq: [
      { question: 'Can I create multiple passport-style photos on one printable sheet?', answer: 'Yes. You can arrange multiple copies of your photo onto standard 4x6 inch, 5x7 inch, or A4 sheets with optional cut marks for convenient home or photo lab printing.' },
      { question: 'Which common document size presets are available?', answer: 'The tool provides presets for common document sizes including 2x2 inches (51x51 mm), 35x45 mm, and 3.5x4.5 cm, as well as custom pixel and millimeter dimensions.' },
      { question: 'Does this tool guarantee official acceptance by passport authorities?', answer: 'No automated tool can guarantee official acceptance. Different passport and visa agencies have strict physical lighting, expression, and head-measurement rules. This tool helps you format, crop, and arrange photos according to common dimensions before submission.' },
      { question: 'Can I adjust lighting and change background shades?', answer: 'Yes. You can fine-tune brightness, contrast, and warmth, and select standard plain white, off-white, light blue, or neutral gray backdrops.' },
      { question: 'Are my private photos uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },

  'text-to-handwriting': {
    title: 'Text to Handwriting Converter — Create Realistic Handwritten Notes',
    navTitle: 'Text to Handwriting',
    description: 'Convert typed digital text into realistic handwritten notes on lined, plain, or vintage paper. Export high-res PNGs or multi-page PDFs.',
    features: [
      'Realistic Handwriting Font Styles',
      'Gel Blue, Navy, Black & Red Ink Options',
      'College Ruled Lined, Grid & Plain Paper',
      'Natural Human Baseline Jitter',
      'Multi-Page PDF & PNG Export',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Enter or Paste Text', desc: 'Type or paste your notes, assignment text, or letter into the text editor.' },
      { title: 'Choose Handwriting Style & Paper', desc: 'Select from realistic cursive and print fonts, choose ink color (blue, black, red), and pick ruled notebook or plain paper.' },
      { title: 'Export PNG or Multi-Page PDF', desc: 'Adjust letter spacing and baseline jitter for organic handwriting variations, and download page images or a combined PDF.' }
    ],
    faq: [
      { question: 'Can I download multi-page handwritten notes as a single PDF?', answer: 'Yes. The tool automatically paginates longer texts across sequential notebook pages and allows you to download a unified multi-page PDF document.' },
      { question: 'What makes the handwriting look authentic rather than computer-generated?', answer: 'The engine applies subtle natural baseline jitter, organic letter-spacing variations, authentic ink colors, and realistic ruled notebook margin lines.' },
      { question: 'Which paper styles are available?', answer: 'You can choose from college-ruled lined notebook paper, plain blank white paper, yellow legal pad, and graph grid paper.' },
      { question: 'Can I customize font size and line spacing?', answer: 'Yes. You can adjust font size, line spacing, and margin padding to match different notebook sizes and school assignment guidelines.' },
      { question: 'Is my typed text or assignment uploaded to a server?', answer: 'The text and resulting document are rendered locally in your browser and are not sent to a Zubware server for processing.' }
    ]
  },

  'omr-sheet-generator': {
    title: 'OMR Sheet Generator — Create Printable OMR Answer Sheets Free',
    navTitle: 'OMR Sheet Generator',
    description: 'Generate and print custom OMR answer sheets and answer keys for exams, tests, quizzes, and mock assessments. Download printable A4 PDF and PNG.',
    features: [
      'Customizable Question Count (20-150)',
      '4 or 5 Options (A-D / A-E)',
      'Roll Number & Set Code Bubble Grids',
      'Blank Sheet & Answer Key Modes',
      'Printable A4 PDF & High-Res PNG Export',
      'Client-Side Browser Processing'
    ],
    howTo: [
      { title: 'Set Exam Header & Question Count', desc: 'Enter your institution name, exam title, subject, test date, and choose total questions (20 to 150) with 4 or 5 options.' },
      { title: 'Configure Roll Number & Booklet Code', desc: 'Toggle roll number bubble grid (5-10 digits), question booklet set codes (A-D), instructions, and invigilator signature boxes.' },
      { title: 'Export Blank Sheet or Answer Key', desc: 'Switch between blank candidate sheet mode or mark correct answers in Answer Key mode, then download as printable A4 PDF or PNG.' }
    ],
    faq: [
      { question: 'Can I generate both blank candidate answer sheets and marked answer keys?', answer: 'Yes. Use Blank Sheet mode to print clean test sheets for students, or switch to Answer Key mode to click and fill the correct bubbles for scoring reference.' },
      { question: 'What question counts and bubble choice options are supported?', answer: 'You can configure sheets for 20, 50, 100, 120, or 150 questions, with either 4 options (A, B, C, D) or 5 options (A, B, C, D, E) arranged in 1 to 4 clean columns.' },
      { question: 'Can students bubble their roll number and exam set code?', answer: 'Yes. You can enable a roll number bubble grid with 5 to 10 digits and question paper set code options (Set A, B, C, D) for candidate identification.' },
      { question: 'Can the generated OMR sheet be printed on standard A4 paper?', answer: 'Yes. The tool formats the sheet specifically for standard A4 paper dimensions and exports a print-ready vector PDF document or high-resolution PNG image.' },
      { question: 'Is my test or institute data uploaded to an external server?', answer: 'The OMR sheet is generated and rendered directly in your web browser using HTML5 Canvas and client-side PDF libraries, without sending data to Zubware servers.' }
    ]
  },

  'gst-invoice-generator': {
    title: 'GST Invoice Generator — Create & Download Invoices Online',
    navTitle: 'GST Invoice',
    description: 'Create professional GST invoices online with automatic CGST, SGST, and IGST tax calculation, HSN/SAC codes, dynamic UPI payment QR codes, and PDF export.',
    features: [
      'Complete Supplier & Buyer GSTIN Billing',
      'Automatic CGST, SGST & IGST Calculation',
      'HSN/SAC Code & Item Discounts',
      'Bank Details & Dynamic UPI Payment QR',
      'Print & High-Res PDF Invoice Export',
      'Local Browser Draft Saving'
    ],
    howTo: [
      { title: 'Enter Supplier & Customer Details', desc: 'Add your business name, GSTIN, address, state of supply, and customer billing information.' },
      { title: 'Add Line Items & Tax Slabs', desc: 'Enter item descriptions, HSN/SAC codes, quantities, and rates. The system automatically calculates CGST/SGST or IGST based on place of supply.' },
      { title: 'Add Payment Details & Download PDF', desc: 'Include bank details, UPI QR code, terms, and authorized signature, then click Download PDF or Print Invoice.' }
    ],
    faq: [
      { question: 'How does the tool calculate CGST, SGST, and IGST?', answer: 'The tool compares the supplier state with the place of supply. For intra-state transactions, the tax rate is split equally into CGST and SGST. For inter-state transactions, the full rate is applied as IGST.' },
      { question: 'Can I generate a scannable UPI payment QR code on the invoice?', answer: 'Yes. Entering your UPI ID automatically generates a dynamic payment QR code with the invoice amount embedded so customers can scan and pay instantly.' },
      { question: 'Can I save invoice drafts and resume editing later?', answer: 'Yes. Click Save Draft to store your current invoice in your browser local storage. You can restore your draft anytime to make updates or reprint.' },
      { question: 'What export and printing options are available?', answer: 'You can download the invoice as a formatted PDF file or use the direct Print option to print on standard A4 paper.' },
      { question: 'Is my confidential business or customer billing data sent to a server?', answer: 'The invoice is generated entirely within your browser. Your customer lists, bank accounts, and billing numbers are not uploaded to Zubware servers.' }
    ]
  },

  'learning-licence-mock-test': {
    title: 'Learning Licence Mock Test — Practice RTO Driving Exam Online',
    navTitle: 'LL Mock Test',
    description: 'Practice driving licence exam questions, traffic rules, and mandatory road signs online with a bilingual English and Hindi mock test simulator.',
    features: [
      'Driving Licence Mock Test Simulator',
      'Traffic Signs & Road Symbols Practice Mode',
      'English & Hindi Bilingual Support',
      'Timed & Untimed Practice Options',
      'Instant Score Breakdown & Explanations',
      'Client-Side Browser Simulation'
    ],
    howTo: [
      { title: 'Choose Test Mode & Language', desc: 'Select the comprehensive Mock Test or the Traffic Signs practice test, and choose English or Hindi language.' },
      { title: 'Answer Practice Questions', desc: 'Read each road scenario or traffic sign prompt and select your answer before the countdown timer runs out.' },
      { title: 'Review Score & Detailed Explanations', desc: 'Review your passing status, total score, and inspect explanations for any missed questions to prepare for your test.' }
    ],
    faq: [
      { question: 'Is this an official government driving licence examination?', answer: 'No. This is an educational practice simulator designed to help learners study road safety rules, traffic signals, and common exam questions before taking an official RTO exam.' },
      { question: 'Can I practice traffic signs and road symbol questions separately?', answer: 'Yes. Switch to the Traffic Signs tab to test your recognition of mandatory, cautionary, and informatory road signs with visual sign illustrations.' },
      { question: 'Can I take the practice test in Hindi as well as English?', answer: 'Yes. Use the language selector at the top to toggle between English and Hindi for all questions and explanations.' },
      { question: 'Can I take the practice test without a time limit?', answer: 'Yes. You can disable the 30-second question timer to study and review question explanations at your own comfortable pace.' },
      { question: 'Is my test score or personal information stored on a server?', answer: 'All test questions, timer state, and score calculations run locally inside your web browser without requiring an account or storing test results on a server.' }
    ]
  },

  'exam-score-calculator': {
    title: 'Exam Score Calculator — Test Grade, Percentage & Negative Marking',
    navTitle: 'Exam Score Calc',
    description: 'Calculate test percentage marks, letter grades (A+ to F), and net scores with negative marking penalties for competitive exams and academic assessments.',
    features: [
      'Test Percentage & Net Marks Calculation',
      'Flexible Negative Marking Deduction (1/4, 1/3, 1/2)',
      'Standard Letter Grade Classification (A+ to F)',
      '1-Click Score Summary Clipboard Copy',
      'Instant Visual Performance Breakdown'
    ],
    howTo: [
      { title: 'Enter Question & Answer Counts', desc: 'Input total questions on the exam and the number of incorrect or missed answers.' },
      { title: 'Select Negative Marking Penalty', desc: 'Choose the deduction rate per wrong answer (none, -0.25 for 1/4 penalty, -0.33 for 1/3 penalty, or -0.5).' },
      { title: 'Review Net Score & Letter Grade', desc: 'Inspect your net score, percentage, and letter grade, then click Copy Score to copy the result to your clipboard.' }
    ],
    faq: [
      { question: 'How does negative marking penalty calculate net exam score?', answer: 'Each wrong answer incurs a fractional deduction (such as 0.25 marks for a 1/4 penalty). Correct answers score full marks, and penalties are subtracted to determine your net score.' },
      { question: 'Which negative marking deduction options are supported?', answer: 'The calculator provides presets for None (0), 1/4 penalty (-0.25), 1/3 penalty (-0.33), 1/2 penalty (-0.5), and full point penalty (-1.0).' },
      { question: 'How are percentage marks and letter grades determined?', answer: 'Percentage is calculated by dividing net score by total questions and multiplying by 100. Grades are classified on a standard scale from A+ (97%+) to F (below 60%).' },
      { question: 'Can I copy the score summary to share or save?', answer: 'Yes. Click the Copy Score button to copy your net marks, total questions, percentage, and grade formatted cleanly to your clipboard.' },
      { question: 'Is my exam marks data sent to a remote server?', answer: 'All calculations run in your browser memory and are not sent to or stored on any external server.' }
    ]
  }
};
