export interface CategoryWorkflow {
  title: string;
  description: string;
  toolIds: string[];
}

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryAuthorityItem {
  slug: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  leadParagraph: string;
  workflows: CategoryWorkflow[];
  faqs: CategoryFaq[];
}

export const CATEGORY_AUTHORITY_MAP: Record<string, CategoryAuthorityItem> = {
  'pdf-tools': {
    slug: 'pdf-tools',
    h1: 'Free Online PDF Tools & Document Utilities',
    seoTitle: 'PDF Tools — Free Online PDF Merge, Split & Compress Utilities | Zubware',
    metaDescription: 'Browse free browser-based PDF utilities. Merge, split, compress, edit, convert, and sign PDF documents directly in your browser with local processing.',
    leadParagraph: 'Zubware PDF Tools provide a fast, secure, client-side document processing suite. Whether optimizing heavy PDFs for email attachments, merging multi-part contracts, rearranging invoice pages, or signing NDAs, all operations run inside your browser using WebAssembly. Confidential business files and personal records never touch an external server.',
    workflows: [
      {
        title: 'Document Compression & Size Optimization',
        description: 'Shrink oversized PDFs to meet strict email, job portal, and government gateway upload thresholds while retaining crisp vector text.',
        toolIds: ['pdf-compressor', 'decrease-pdf-size', 'pdf-size-adjuster']
      },
      {
        title: 'Collation, Merging & Page Extraction',
        description: 'Combine multiple document streams into a unified dossier or break large reports down into individual chapters.',
        toolIds: ['pdf-merge', 'pdf-split', 'extract-pdf-pages', 'reorder-pdf-pages', 'delete-pdf-pages']
      },
      {
        title: 'Security, Signatures & Access Control',
        description: 'Add password encryption, draw electronic signatures, apply watermarks, or unlock password-protected archives.',
        toolIds: ['protect-pdf', 'unlock-pdf', 'sign-pdf', 'watermark-pdf']
      },
      {
        title: 'Cross-Format Document Conversion',
        description: 'Convert PDFs to editable Word documents, transform image scans into PDF packages, or export pages as high-resolution images.',
        toolIds: ['pdf-to-word', 'word-to-pdf', 'pdf-to-jpg', 'jpg-to-pdf']
      }
    ],
    faqs: [
      {
        question: 'Does Zubware store or upload my PDF documents to cloud servers?',
        answer: 'No. All Zubware PDF utilities execute in-memory within your web browser using client-side WebAssembly and JavaScript engines. Your documents are never uploaded to Zubware or third-party servers.'
      },
      {
        question: 'How do I compress a PDF without making the text blurry?',
        answer: 'True PDF compression downsamples embedded raster images (e.g., from 300 DPI to 150 DPI) while preserving vector typography and glyph outlines. Our PDF compressor maintains crisp text rendering across any zoom level.'
      },
      {
        question: 'Are there any page limits or watermarks applied to exported files?',
        answer: 'No. Zubware does not impose file size limits, page caps, or mandatory watermark overlays on your processed documents.'
      }
    ]
  },

  'image-tools': {
    slug: 'image-tools',
    h1: 'Free Online Image Tools & Photo Editors',
    seoTitle: 'Image Tools — Free Online Image Compressor, Resizer & Converter | Zubware',
    metaDescription: 'Explore browser-based image utilities. Compress WebP, PNG & JPG files, remove backgrounds, resize photos, and convert formats directly in your browser.',
    leadParagraph: 'The Zubware Image Tools suite empowers designers, creators, and web developers to prepare visual assets with speed and privacy. Execute bulk resizing, canvas cropping, format conversion, and background cutouts right in your browser canvas without third-party subscriptions or waiting in server queues.',
    workflows: [
      {
        title: 'Lossless & High-Efficiency Compression',
        description: 'Reduce visual payload sizes by up to 80% to boost Google Core Web Vitals and accelerate web page load speeds.',
        toolIds: ['image-compressor', 'image-splitter-merger', 'svg-optimizer']
      },
      {
        title: 'Modern Format Conversion',
        description: 'Seamlessly interchange between WebP, PNG, JPEG, SVG, and iPhone HEIC formats without loss of color fidelity.',
        toolIds: ['image-converter', 'heic-to-jpg', 'svg-to-png', 'png-to-svg']
      },
      {
        title: 'Canvas Manipulation & Dimensions',
        description: 'Crop images to exact social ratios, rotate orientations, create passport photos, and resize dimensions in pixels or percentages.',
        toolIds: ['crop-image', 'image-resizer', 'rotate-image', 'flip-image', 'passport-photo-maker']
      },
      {
        title: 'Backgrounds & Creative Enhancements',
        description: 'Isolate subjects with client-side AI, replace background colors, apply blur/pixelate privacy filters, and watermark media.',
        toolIds: ['background-remover', 'background-color-changer', 'blur-image', 'pixelate-image', 'image-watermark']
      }
    ],
    faqs: [
      {
        question: 'Can I convert Apple HEIC photos directly in my web browser?',
        answer: 'Yes. Our HEIC to JPG converter decodes High Efficiency Image Container binaries directly inside your browser memory and exports standard JPG images ready for any platform.'
      },
      {
        question: 'Will image compression affect my photo colors or transparency?',
        answer: 'Our tools support lossless PNG compression that keeps transparent alpha channels intact, as well as tunable WebP/JPEG quality sliders that retain rich sRGB color balances.'
      }
    ]
  },

  'creator-tools': {
    slug: 'creator-tools',
    h1: 'Creator & Social Media Optimization Tools',
    seoTitle: 'Creator Tools — Free Social Media, YouTube & Content Utilities | Zubware',
    metaDescription: 'Discover free tools for content creators, YouTubers, and social marketers. Character counters, bio generators, tag optimizers, and banner safe-area guides.',
    leadParagraph: 'Streamline your social distribution workflows across YouTube, TikTok, Instagram, X (Twitter), and LinkedIn. From character limit verifications to thumbnail feed previews and bio builders, Zubware creator utilities ensure every post achieves maximum engagement.',
    workflows: [
      {
        title: 'Audience Copy & Character Verification',
        description: 'Ensure text stays within strict platform cutoff points for titles, captions, tweets, and bio descriptions.',
        toolIds: ['social-character-counter', 'instagram-bio-generator', 'youtube-title-generator']
      },
      {
        title: 'Visual Feed Simulation & Safe Areas',
        description: 'Test thumbnail readability and verify banner layouts across desktop, tablet, and mobile displays before publishing.',
        toolIds: ['youtube-thumbnail-simulator', 'youtube-banner-safe-area']
      }
    ],
    faqs: [
      {
        question: 'Why do character counters differ between platforms?',
        answer: 'Social networks calculate length differently: X (Twitter) counts URLs as 23 characters and weights emoji as 2 units, while Instagram counts raw character length. Our tools apply platform-specific counter rules.'
      }
    ]
  },

  'video-tools': {
    slug: 'video-tools',
    h1: 'Browser Video Generators & Clip Utilities',
    seoTitle: 'Video Tools — Free Video Clip & Shorts Generators | Zubware',
    metaDescription: 'Browse free browser-based video clip tools and viral animation makers. Create engaging puzzle shorts and reels with zero software installations.',
    leadParagraph: 'Produce captivating short-form visual content directly within your browser. Assemble matching-part video puzzles, render procedural animations, and prep engaging video reels without heavy desktop editing software.',
    workflows: [
      {
        title: 'Viral Puzzle Shorts Creation',
        description: 'Generate high-retention split-video puzzles designed specifically for YouTube Shorts, Instagram Reels, and TikTok.',
        toolIds: ['matching-parts-video-maker']
      }
    ],
    faqs: [
      {
        question: 'Do I need a dedicated GPU to render videos on Zubware?',
        answer: 'No. Our browser video utilities use HTML5 canvas rendering and MediaRecorder APIs to compile video frames locally on any modern laptop or desktop.'
      }
    ]
  },

  'audio-tools': {
    slug: 'audio-tools',
    h1: 'Online Audio Tools & Music Atmosphere Generators',
    seoTitle: 'Audio Tools — Free Online Lofi Studio & Audio Effects | Zubware',
    metaDescription: 'Explore free browser audio tools. Craft chill lofi beats, apply slowed and reverb effects, and design ambient soundscapes with zero plugins.',
    leadParagraph: 'Transform your audio tracks with client-side Web Audio API filters. Dial in slowed and reverb effects, generate procedural chill lofi beats, and design calming acoustic environments directly in your browser.',
    workflows: [
      {
        title: 'Lofi Beat & Atmosphere Generation',
        description: 'Layer vinyl crackle, mellow chord progressions, and relaxed rhythm loops in a lightweight browser workstation.',
        toolIds: ['lofi-song-maker', 'lofi-maker']
      },
      {
        title: 'Slowed + Reverb Audio Processing',
        description: 'Add nostalgic spatial depth and pitch adjustments to your audio tracks with zero server uploads.',
        toolIds: ['slowed-and-reverb']
      }
    ],
    faqs: [
      {
        question: 'Are audio files uploaded to a remote server for processing?',
        answer: 'No. Audio decoding, convolution reverb, and rate alterations are processed locally via the Web Audio API on your machine.'
      }
    ]
  },

  'business-tools': {
    slug: 'business-tools',
    h1: 'Free Business Invoicing & Commerce Tools',
    seoTitle: 'Business Tools — Free GST Invoices, Receipts & Card Creators | Zubware',
    metaDescription: 'Explore free business tools. Generate GST invoices, printable receipts, and professional business cards with local browser privacy.',
    leadParagraph: 'Empower your small business, freelance practice, or consulting firm with instant administrative tools. Generate tax-compliant invoices, export printable PDF receipts, and configure branded business cards with zero monthly SaaS fees.',
    workflows: [
      {
        title: 'Invoicing & Tax Calculations',
        description: 'Create professional invoices with automated GST breakdown, currency selection, and instant PDF download.',
        toolIds: ['gst-invoice-generator', 'invoice-generator', 'receipt-maker']
      },
      {
        title: 'Brand Collateral & Networking',
        description: 'Design elegant print-ready business cards and corporate identity essentials in seconds.',
        toolIds: ['business-card-generator']
      }
    ],
    faqs: [
      {
        question: 'Are my invoice customer details kept private?',
        answer: 'Yes. All invoice generation and PDF exports are compiled in your browser memory. Client names, billing rates, and tax IDs are never transmitted or stored on our servers.'
      }
    ]
  },

  'text-tools': {
    slug: 'text-tools',
    h1: 'Text Editing, Formatting & Word Counter Tools',
    seoTitle: 'Text Tools — Free Online Word Counter, Diff & Case Converter | Zubware',
    metaDescription: 'Browse free online text tools. Count words and characters, convert letter cases, inspect text diffs, and clean whitespace instantly.',
    leadParagraph: 'Clean, format, inspect, and analyze textual content with precision. Whether debugging markdown documentation, removing unwanted line breaks, comparing source revisions, or auditing word counts, Zubware text utilities deliver instant results.',
    workflows: [
      {
        title: 'Metrics & Readability Statistics',
        description: 'Calculate real-time word counts, character frequencies, sentence structures, and estimated reading durations.',
        toolIds: ['word-counter', 'social-character-counter']
      },
      {
        title: 'Case Transformation & Whitespace Sanitization',
        description: 'Convert between camelCase, PascalCase, snake_case, UPPERCASE, and remove duplicate spaces or blank lines.',
        toolIds: ['case-converter', 'remove-extra-spaces', 'duplicate-line-remover', 'line-sorter']
      },
      {
        title: 'Diff Analysis & Markup Editing',
        description: 'Highlight additions and deletions between two text blocks or preview rendered markdown documents.',
        toolIds: ['text-diff-checker', 'markdown-editor', 'slug-generator']
      }
    ],
    faqs: [
      {
        question: 'Can I format sensitive confidential text here?',
        answer: 'Yes. Zubware text tools run client-side JavaScript. Pasted text is never transmitted over the internet or logged in database servers.'
      }
    ]
  },

  'career-tools': {
    slug: 'career-tools',
    h1: 'Career, ATS Resume & Compensation Tools',
    seoTitle: 'Career Tools — Free ATS Resume Checker, Builder & Salary Tools | Zubware',
    metaDescription: 'Discover career tools. Test resumes against ATS bots, build modern CVs, calculate notice periods, and evaluate CTC salary hikes.',
    leadParagraph: 'Accelerate your job search and professional transitions. Analyze your resume against Applicant Tracking System (ATS) parsing rules, craft tailored cover letters, and accurately compute CTC revisions and notice period dates.',
    workflows: [
      {
        title: 'ATS Resume Optimization',
        description: 'Scan resume text for keyword relevance, structural readability, and section headers that score high with enterprise ATS screeners.',
        toolIds: ['ats-resume-checker', 'resume-keyword-optimizer', 'resume-score-analyzer']
      },
      {
        title: 'Curriculum Vitae & Letter Crafting',
        description: 'Build sleek modern resumes and cover letters with guided templates and instant PDF generation.',
        toolIds: ['resume-builder', 'cv-builder', 'cover-letter-builder', 'cover-letter-templates']
      },
      {
        title: 'Compensation & Timeline Calculators',
        description: 'Evaluate salary hike offers, in-hand paycheck deductions, notice period last working days, and accrued experience.',
        toolIds: ['salary-hike-calculator', 'ctc-calculator', 'salary-calculator', 'notice-period-calculator', 'working-days-calculator']
      }
    ],
    faqs: [
      {
        question: 'How does an ATS resume checker evaluate my resume?',
        answer: 'Our ATS checker inspects heading taxonomy, keyword frequency, measurable achievement bullet points, and formatting simplicity to ensure recruiters and scanning bots parse your credentials accurately.'
      }
    ]
  },

  'developer-tools': {
    slug: 'developer-tools',
    h1: 'Free Online Developer Tools & Code Formatters',
    seoTitle: 'Developer Tools — Free Online JSON, JWT, Hash & Regex Utilities | Zubware',
    metaDescription: 'Explore developer utilities. Format JSON, SQL & XML, decode JWT tokens, test regular expressions, generate hashes, and convert timestamps.',
    leadParagraph: 'A dedicated developer workbench built for speed and security. Format messy payloads, inspect JSON Web Tokens, validate regular expressions, encode base64 payloads, and compute cryptographic hashes right in your browser tab without transmitting sensitive API keys or credentials.',
    workflows: [
      {
        title: 'Payload Formatting & Beautification',
        description: 'Indent, validate, and beautify minified JSON, SQL queries, HTML documents, CSS stylesheets, and XML feeds.',
        toolIds: ['json-formatter', 'sql-formatter', 'html-formatter', 'css-formatter', 'xml-formatter']
      },
      {
        title: 'Token Inspection & String Encoders',
        description: 'Decode JWT headers and claims, encode URL components, convert Base64 strings, and escape HTML entities.',
        toolIds: ['jwt-decoder', 'base64-encoder-decoder', 'url-encoder-decoder', 'html-entity-encoder']
      },
      {
        title: 'Cryptography, Hashes & UUIDs',
        description: 'Compute MD5, SHA-256, and SHA-512 hashes, generate cryptographically random UUID v4 identifiers, and test passwords.',
        toolIds: ['hash-generator', 'uuid-generator', 'password-generator', 'password-strength-checker']
      },
      {
        title: 'Debugging, Regex & Network Utilities',
        description: 'Test regular expressions in real-time, inspect HTTP response headers, and convert Unix epoch timestamps.',
        toolIds: ['regex-tester', 'text-diff-checker', 'timestamp-converter', 'http-header-viewer']
      }
    ],
    faqs: [
      {
        question: 'Is it safe to decode private production JWTs on Zubware?',
        answer: 'Yes. Our JWT decoder parses the base64 URL segments entirely within your local browser JavaScript engine. Your token is never transmitted over the network or saved to server logs.'
      },
      {
        question: 'Can these developer tools be used offline?',
        answer: 'Yes. Most utilities run offline after the page has loaded, making them ideal for secure corporate development environments.'
      }
    ]
  },

  'design-tools': {
    slug: 'design-tools',
    h1: 'Design, Color & CSS Productivity Tools',
    seoTitle: 'Design Tools — Free CSS Gradient, Shadow & Color Utilities | Zubware',
    metaDescription: 'Explore design and utility tools. Generate CSS gradients, pick colors, build box shadows, and convert units with live visual previews.',
    leadParagraph: 'Speed up UI design and frontend implementation. Generate CSS gradients, experiment with box-shadow depths, pick harmonic colors, convert viewport units, and calculate financial figures with live responsive previews.',
    workflows: [
      {
        title: 'Color Palettes & Harmonies',
        description: 'Sample HEX/RGB/HSL codes, generate complimentary palettes, and test contrast ratios for WCAG compliance.',
        toolIds: ['color-picker', 'random-color-generator']
      },
      {
        title: 'CSS Geometry & Code Snippets',
        description: 'Construct smooth CSS drop shadows, borders, and gradients with one-click code copy.',
        toolIds: ['rounded-corners']
      }
    ],
    faqs: [
      {
        question: 'Can I copy ready-to-use CSS directly into my stylesheets?',
        answer: 'Yes. All design generators provide instant copy buttons formatted with standard CSS rules compatible with modern browsers and Tailwind CSS.'
      }
    ]
  },

  'prompt-tools': {
    slug: 'prompt-tools',
    h1: 'AI Prompt Builder Tools for ChatGPT, Claude & Midjourney',
    seoTitle: 'AI Prompt Builders — Free Prompt Generators for ChatGPT & Claude | Zubware',
    metaDescription: 'Discover specialized AI prompt builder tools. Structure effective system prompts for ChatGPT, Gemini, Claude, Midjourney, and Flux.',
    leadParagraph: 'Elevate your generative AI results with structured prompt engineering frameworks. Formulate crystal-clear system prompts, specify persona constraints, enforce output schemas, and craft descriptive Midjourney visual descriptors with precision.',
    workflows: [
      {
        title: 'Large Language Model Prompt Structuring',
        description: 'Apply role-task-context-constraint prompting architectures to eliminate hallucinations and achieve accurate LLM replies.',
        toolIds: ['chatgpt-prompt-builder', 'gemini-prompt-builder', 'claude-prompt-builder']
      },
      {
        title: 'Diffusion Image Prompt Engineering',
        description: 'Inject lighting parameters, photographic lenses, artistic styles, and aspect ratios for Midjourney, DALL-E, and Flux.',
        toolIds: ['midjourney-prompt-builder', 'flux-prompt-builder']
      }
    ],
    faqs: [
      {
        question: 'Why does structured prompt engineering improve AI responses?',
        answer: 'LLMs generate outputs based on attention probabilities. Defining explicit personas, specific tasks, contextual background, and strict negative constraints drastically reduces ambiguous interpretations.'
      }
    ]
  },

  'health-fitness': {
    slug: 'health-fitness',
    h1: 'Health, Caloric & Fitness Benchmarking Tools',
    seoTitle: 'Health & Fitness — Free Calorie, Macro & Fitness Calculators | Zubware',
    metaDescription: 'Browse free health and fitness calculators. Calculate daily calorie targets, macronutrient splits, and workout benchmarks easily.',
    leadParagraph: 'Track health metrics and establish baseline fitness targets with accurate mathematical models. Estimate daily caloric expenditure (TDEE), plan macronutrient balances for fat loss or muscle gain, and compute workout targets.',
    workflows: [
      {
        title: 'Body Composition & Caloric Targets',
        description: 'Determine Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on activity level and goals.',
        toolIds: ['calorie-calculator', 'macro-calculator', 'bmi-calculator']
      }
    ],
    faqs: [
      {
        question: 'What equations do Zubware health calculators use?',
        answer: 'Our calculators employ validated clinical standards such as the Mifflin-St Jeor and Harris-Benedict formulas to compute metabolic baselines.'
      }
    ]
  },

  'generators': {
    slug: 'generators',
    h1: 'Generators, QR Codes & Daily Productivity Tools',
    seoTitle: 'Generators & Productivity — Free QR, Barcode & Password Tools | Zubware',
    metaDescription: 'Explore generator utilities. Create QR codes, barcodes, random passwords, secure notes, and track daily habits in your browser.',
    leadParagraph: 'Equip your everyday routine with dependable offline utilities. Generate customized QR codes for WiFi and URLs, design EAN/UPC barcodes, create unbreakable cryptographic passwords, and organize tasks with zero external logins.',
    workflows: [
      {
        title: 'Codes & Quick Scanners',
        description: 'Generate high-resolution vector QR codes with embedded logos and format standard retail barcodes.',
        toolIds: ['qr-generator', 'barcode-generator', 'wifi-qr-code', 'qr-code-scanner', 'barcode-scanner']
      },
      {
        title: 'Security, Passwords & Secrets',
        description: 'Generate high-entropy randomized credentials and evaluate dictionary attack resilience.',
        toolIds: ['password-generator', 'password-strength-checker']
      }
    ],
    faqs: [
      {
        question: 'Are generated QR codes permanent?',
        answer: 'Yes. Static QR codes encode destination text or URLs directly into the 2D matrix pattern. They never expire and require no redirect server.'
      }
    ]
  }
};
