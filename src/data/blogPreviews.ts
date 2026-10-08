export interface BlogCardPreview {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  canonicalPath: string;
}

export const HOMEPAGE_BLOG_PREVIEWS: BlogCardPreview[] = [
  {
    slug: 'how-to-compress-pdf-without-losing-readability',
    title: 'How to Compress a PDF Without Losing Readability',
    excerpt: "Shrinking a PDF file for email or web portal limits shouldn't turn your text into an unreadable, pixelated blur. Here is the technical breakdown of what PDF compression does, how to balance size versus visual clarity, and how to safely reduce PDF files right in your browser.",
    category: 'PDF Guides',
    readingTime: '6 min read',
    canonicalPath: '/blog/how-to-compress-pdf-without-losing-readability'
  },
  {
    slug: 'client-side-image-optimization-guide',
    title: 'Client-Side Image Optimization: WebP, Compression & Quality Preservation',
    excerpt: 'Images constitute over 60% of modern web page weight. In this technical guide, learn how format selection, resolution downscaling, and browser-based canvas encoding slash file sizes by up to 80% while keeping visuals crisp.',
    category: 'Image Guides',
    readingTime: '7 min read',
    canonicalPath: '/blog/client-side-image-optimization-guide'
  },
  {
    slug: 'merge-split-pdf-browser-workflow-guide',
    title: 'How to Merge, Split, and Reorder PDFs Securely in the Browser',
    excerpt: "Combining multiple documents or extracting specific pages shouldn't require sending sensitive legal paperwork or tax returns across unencrypted cloud servers. Learn how client-side PDF document manipulation works.",
    category: 'PDF Guides',
    readingTime: '6 min read',
    canonicalPath: '/blog/merge-split-pdf-browser-workflow-guide'
  },
  {
    slug: 'offline-developer-tools-privacy-guide',
    title: 'The Developer Privacy Handbook: Formatting, Decoding & Hashing Without Server Leakage',
    excerpt: 'Pasting production JSON payloads, Bearer tokens, or SQL dumps into random web utility sites frequently leaks sensitive customer records and API keys into remote access logs. Here is why client-side execution is essential for engineering workflows.',
    category: 'Developer Guides',
    readingTime: '8 min read',
    canonicalPath: '/blog/offline-developer-tools-privacy-guide'
  },
  {
    slug: 'financial-calculators-sip-emi-gst-guide',
    title: 'Financial Planning Tools: Understanding SIP, Loan EMI, and GST Calculations',
    excerpt: 'Accurate financial planning requires understanding how compounding interest, reducing balance loan amortization, and multi-tier tax structures work in practice. Learn the exact mathematics behind everyday financial calculators.',
    category: 'Calculator Guides',
    readingTime: '6 min read',
    canonicalPath: '/blog/financial-calculators-sip-emi-gst-guide'
  },
  {
    slug: 'clean-text-processing-formatting-guide',
    title: 'Clean Text Processing: Diffs, Word Counts, ATS Formatting & Case Conversion',
    excerpt: 'Invisible unicode spaces, erratic line breaks, and formatting glitches can break code builds and cause resumes to fail ATS parsing. Learn how client-side text sanitization utilities ensure clean typography and data integrity.',
    category: 'Text Guides',
    readingTime: '5 min read',
    canonicalPath: '/blog/clean-text-processing-formatting-guide'
  }
];
