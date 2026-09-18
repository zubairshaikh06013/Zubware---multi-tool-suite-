import { ToolMeta, FAQItem } from '../types';
import { LanguageCode, getTranslation } from '../lib/i18n';
import { getToolKeywords } from '../lib/toolKeywords';

const RAW_TOOLS_DATA: ToolMeta[] = [
  {
    id: 'splitdrop',
    title: 'Image Splitter & Combiner',
    navTitle: 'Image Splitter & Combiner',
    description: 'Split an image cleanly along any vertical or horizontal line, or combine two images seamlessly into a composite with zero server uploads.',
    icon: '✂️',
    path: '/image-splitter-merger.html',
    filename: 'image-splitter-merger.html',
    category: '🖼️ Image Tools',
    badge: 'Original',
    features: ['Vertical & Horizontal Split', 'Dual Image Combine', 'Auto-trim Padding', 'Drag-to-Adjust Seam', '100% Client-side'],
    faq: [
      {
        question: 'How do I split an image into two pieces?',
        answer: 'Upload or drop your image into the tool. Select vertical or horizontal split mode, drag the canvas seam guide to where you want to make the cut, and click Download. Both split image halves are exported instantly.'
      },
      {
        question: 'How do I combine two images into one?',
        answer: 'Switch to the Combine Images tab, upload both photos into slot A and slot B, choose side-by-side or stacked orientation, adjust the split slider if desired, and download the seamless composite.'
      },
      {
        question: 'Are my images uploaded to any external server?',
        answer: 'No! All processing is executed 100% locally inside your web browser using HTML5 Canvas. Your images never leave your computer or phone.'
      },
      {
        question: 'What is auto-trim padding?',
        answer: 'Auto-trim padding automatically detects and eliminates transparent or empty border space around your image before slicing, ensuring flush cuts.'
      }
    ]
  },
  {
    id: 'learning-licence-mock-test',
    title: 'Learning Licence Mock Test',
    navTitle: 'LL Mock Test',
    description: 'Practice Indian Learning Licence traffic rules, road signs and driving regulations with a bilingual Hindi and English mock test.',
    icon: '🚦',
    path: '/learning-licence-mock-test.html',
    filename: 'learning-licence-mock-test.html',
    category: '🏛️ Government & Utility Tools',
    badge: 'New',
    features: ['Bilingual Hindi & English', '60 Question Practice Bank', '15 Questions Random Selection', 'Optional 15-Min Timer', 'Traffic Signs Practice Mode']
  },
  {
    id: 'background-remover',
    title: 'Background Remover',
    navTitle: 'Background Remover',
    description: 'Remove image backgrounds automatically with AI and download transparent PNGs. Free, private and processed directly in your browser.',
    icon: '✂️',
    path: '/background-remover.html',
    filename: 'background-remover.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['AI Automatic Removal', 'Transparent PNG Export', 'Before/After Comparison', '100% Client-Side Privacy', 'High Resolution Output'],
    faq: [
      {
        question: 'What image formats are supported?',
        answer: 'The AI Background Remover supports JPG, JPEG, PNG, and WebP image formats up to 20 MB.'
      },
      {
        question: 'Does the tool remove backgrounds automatically?',
        answer: 'Yes! The AI automatically detects people, products, animals, cars, and objects in your photo and extracts them without requiring manual tracing or lasso tools.'
      },
      {
        question: 'Can I download a transparent PNG?',
        answer: 'Absolutely. The final output is saved as a 32-bit PNG file containing real transparent alpha pixels.'
      },
      {
        question: 'Is my image uploaded to any server?',
        answer: 'No. All processing happens 100% locally inside your web browser. Your private photos are never uploaded anywhere.'
      }
    ]
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    navTitle: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP images to exact file sizes like 20KB, 50KB, 100KB, 200KB, or 500KB without visible quality loss. Free private batch image compressor with zero server uploads.',
    icon: '🗜️',
    path: '/image-compressor.html',
    filename: 'image-compressor.html',
    category: '🖼️ Image Tools',
    badge: 'Free',
    features: [
      'Target Size Mode (20KB, 50KB, 100KB, 200KB, 500KB)',
      'By Quality % Slider (10-95%)',
      'Batch Image Queue & ZIP Download',
      'Auto Progressive Resolution Downscale',
      'JPG, PNG, & WebP Output Formats',
      '100% Client-Side Privacy'
    ],
    faq: [
      {
        question: 'How do I compress an image to 20KB or 50KB for online forms?',
        answer: 'Switch the Compression Mode to "By Target Size (KB)", select the 20KB or 50KB quick preset (or type your custom KB number), and click "Compress". The algorithm uses binary search on quality and progressive resolution scaling to automatically hit your required file size.'
      },
      {
        question: 'Can I compress multiple images to a specific target size at once?',
        answer: 'Yes! Drop or select multiple images in the batch queue, choose your target size (e.g. 100KB), and hit Compress. All images will be processed simultaneously, and you can download them individually or as a single ZIP archive.'
      },
      {
        question: 'What happens if a large photo cannot reach 20KB by quality alone?',
        answer: 'The compressor automatically downscales the canvas dimensions gradually (90% → 80% → 70%...) and reruns the compression loop so it converges as close as possible to your exact target KB while preserving aspect ratio.'
      },
      {
        question: 'Are my photos uploaded to any external server?',
        answer: 'No. Everything is calculated 100% locally inside your browser using HTML5 Canvas and client-side encoding. Your personal files and documents never touch external servers.'
      }
    ]
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    navTitle: 'Image Converter',
    description: 'Convert PNG, JPG, WebP, GIF, and BMP image formats instantly in high resolution. Free bulk online image converter with 100% private browser processing.',
    icon: '🔄',
    path: '/image-converter.html',
    filename: 'image-converter.html',
    category: '🖼️ Image Tools',
    badge: 'Free',
    features: ['Multi-format Support', 'Bulk Conversion', 'High Fidelity Output', 'Zero Server Uploads', 'One-Click Download']
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    navTitle: 'Image Resizer',
    description: 'Resize JPG, PNG, WebP, AVIF, and GIF images by exact dimensions, width, height, or percentage with locked aspect ratio.',
    icon: '📐',
    path: '/image-resizer.html',
    filename: 'image-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Pixels & Percentage', 'Lock Aspect Ratio', 'JPG, PNG, WebP, AVIF', '100% Local Browser', 'Instant Export']
  },
  {
    id: 'crop-image',
    title: 'Crop Image',
    navTitle: 'Crop Image',
    description: 'Crop images freeform or with social media presets for Instagram, YouTube thumbnails, Facebook cover, A4, 16:9, and 1:1 ratios.',
    icon: '✂️',
    path: '/crop-image.html',
    filename: 'crop-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Social Media Presets', 'Free Crop & Zoom', 'Rotate & Preview', 'High Resolution Output', 'Zero Uploads']
  },
  {
    id: 'rotate-image',
    title: 'Rotate Image',
    navTitle: 'Rotate Image',
    description: 'Rotate single or batch images by 90°, 180°, 270°, or any custom angle slider with bulk download support.',
    icon: '🔄',
    path: '/rotate-image.html',
    filename: 'rotate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['90°, 180°, Custom Angle', 'Batch Support', 'Live Grid Preview', 'Fast Local Processing', 'Bulk Download']
  },
  {
    id: 'flip-image',
    title: 'Flip Image',
    navTitle: 'Flip Image',
    description: 'Flip photos horizontally or vertically to create mirror reflections instantly in your browser.',
    icon: '⇄',
    path: '/flip-image.html',
    filename: 'flip-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Horizontal Flip', 'Vertical Flip', 'Full Mirror Effect', 'Live Preview', 'One-Click Download']
  },
  {
    id: 'image-watermark',
    title: 'Watermark Image',
    navTitle: 'Watermark Image',
    description: 'Add custom text or logo image watermarks to protect your photos with opacity, rotation, shadow, and tile repeat patterns.',
    icon: '💧',
    path: '/image-watermark.html',
    filename: 'image-watermark.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Text & Image Logo', 'Tile Repeat Pattern', 'Custom Fonts & Colors', 'Opacity & Shadow', '100% Local']
  },
  {
    id: 'blur-image',
    title: 'Blur Image',
    navTitle: 'Blur Image',
    description: 'Blur sensitive information, faces, or full backgrounds with interactive brush painting, strength slider, and undo/redo stack.',
    icon: '🌫️',
    path: '/blur-image.html',
    filename: 'blur-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Interactive Brush Blur', 'Background Blur', 'Strength Slider', 'Undo & Redo Stack', 'Instant Download']
  },
  {
    id: 'pixelate-image',
    title: 'Pixelate Image',
    navTitle: 'Pixelate Image',
    description: 'Censor photos or create retro pixel art effects with custom pixel block sizes, paint brush tool, and undo history.',
    icon: '👾',
    path: '/pixelate-image.html',
    filename: 'pixelate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Brush Censor Tool', 'Entire Image Pixelate', 'Pixel Size Slider', 'Undo & Redo', 'Instant Export']
  },
  {
    id: 'exif-remover',
    title: 'EXIF Remover',
    navTitle: 'EXIF Remover',
    description: 'Strip GPS location data, camera model, author info, and device metadata from photos for total privacy.',
    icon: '🛡️',
    path: '/exif-remover.html',
    filename: 'exif-remover.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Strip GPS Location', 'Camera & Serial Info', 'Batch Support', 'Preserves Quality', '100% Private']
  },
  {
    id: 'image-color-picker',
    title: 'Color Picker',
    navTitle: 'Color Picker',
    description: 'Pick colors directly from any image to inspect HEX, RGB, HSL, HSV, and CMYK color codes with copy buttons & recent color palette.',
    icon: '🎨',
    path: '/color-picker.html',
    filename: 'color-picker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['HEX, RGB, HSL, CMYK', 'EyeDropper Tool', 'Recent Color Palette', 'One-Click Copy', 'High Precision']
  },
  {
    id: 'image-info-viewer',
    title: 'Image Information Viewer',
    navTitle: 'Image Information',
    description: 'Inspect full technical specifications, EXIF tags, dimensions, color depth, transparency, print size, and generate full reports.',
    icon: '🔍',
    path: '/image-info-viewer.html',
    filename: 'image-info-viewer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Full Technical Specs', 'EXIF Metadata Tags', 'Print Size @ 300 DPI', 'Copy Report', '100% Client-Side']
  },
  {
    id: 'background-color-changer',
    title: 'Background Color Changer',
    navTitle: 'Background Color Changer',
    description: 'Replace transparent or solid image backgrounds with solid HEX/RGB colors, smooth gradients, or ambient blur.',
    icon: '🎨',
    path: '/background-color-changer.html',
    filename: 'background-color-changer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Transparent/Solid Keying', 'Solid HEX & RGB', 'Linear Gradient', 'Blurred BG', '100% Client-Side']
  },
  {
    id: 'rounded-corners',
    title: 'Rounded Corner Generator',
    navTitle: 'Rounded Corners',
    description: 'Round photo corners, create circular avatars, or adjust individual corner radii with live preview.',
    icon: '⭕',
    path: '/rounded-corners.html',
    filename: 'rounded-corners.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Individual Corner Radius', 'Circle Avatar Mode', 'Transparent / Solid BG', 'Live Canvas Preview', 'Instant Download']
  },
  {
    id: 'image-border',
    title: 'Image Border Generator',
    navTitle: 'Image Border',
    description: 'Add solid, dashed, dotted, double, or rounded borders to photos with instant color & width controls.',
    icon: '🖼️',
    path: '/image-border.html',
    filename: 'image-border.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Solid, Dashed, Dotted', 'Double & Rounded', 'Custom Border Width', 'HEX/RGB Color Picker', 'PNG/JPG/WebP']
  },
  {
    id: 'image-frame',
    title: 'Image Frame Generator',
    navTitle: 'Image Frame',
    description: 'Transform photos into Polaroid, Shadow, Frosted Glass, Instagram, or Art Gallery framed masterpieces.',
    icon: '📸',
    path: '/image-frame.html',
    filename: 'image-frame.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Polaroid & Caption', 'Soft Drop Shadow', 'Frosted Glass Frame', 'Instagram Post Style', 'White & Black Gallery']
  },
  {
    id: 'image-collage',
    title: 'Image Collage Maker',
    navTitle: 'Collage Maker',
    description: 'Combine multiple photos into beautiful grid, masonry, vertical or horizontal layouts with custom spacing & corner rounding.',
    icon: '🧩',
    path: '/image-collage.html',
    filename: 'image-collage.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['2, 3, 4, 6, 9+ Photos', 'Grid & Masonry', 'Spacing & Radius Sliders', 'Background Color', 'PNG/JPG Export']
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    navTitle: 'Favicon Generator',
    description: 'Generate complete set of multi-size favicons (16px - 512px), favicon.ico, site.webmanifest, and HTML head code in a ZIP bundle.',
    icon: '⭐',
    path: '/favicon-generator.html',
    filename: 'favicon-generator.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['16x16 to 512x512', 'favicon.ico Included', 'site.webmanifest PWA', 'HTML Head Snippet', 'Download ZIP']
  },
  {
    id: 'svg-optimizer',
    title: 'SVG Optimizer',
    navTitle: 'SVG Optimizer',
    description: 'Clean SVG vector code, strip Inkscape/Illustrator metadata, comments, and empty groups to minimize file size.',
    icon: '⚡',
    path: '/svg-optimizer.html',
    filename: 'svg-optimizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Remove Metadata & Comments', 'Remove Empty Groups', 'Round Path Decimals', 'Before/After Comparison', 'Instant Download']
  },
  {
    id: 'gif-maker',
    title: 'GIF Maker',
    navTitle: 'GIF Maker',
    description: 'Combine photo frames into animated GIFs with custom frame speed, sizing, loop, and bounce order controls.',
    icon: '🎬',
    path: '/gif-maker.html',
    filename: 'gif-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Multiple Frame Import', 'Custom Speed / Delay', 'Forward / Bounce Order', 'Interactive Player', 'Client-Side GIF']
  },
  {
    id: 'batch-image-converter',
    title: 'Batch Image Converter',
    navTitle: 'Batch Converter',
    description: 'Convert dozens of photos simultaneously into PNG, JPG, WebP, BMP, or AVIF with one-click bulk ZIP export.',
    icon: '⚡',
    path: '/batch-image-converter.html',
    filename: 'batch-image-converter.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Bulk Multi-File Conversion', 'PNG, JPG, WebP, BMP, AVIF', 'Individual & ZIP Download', 'Quality Slider', 'Fast Local']
  },
  {
    id: 'compression-comparison',
    title: 'Compression Comparison',
    navTitle: 'Compression Comparison',
    description: 'Interactive split-screen slider comparison of original vs compressed photo pixels with 2x/4x magnification inspection.',
    icon: '🔍',
    path: '/compression-comparison.html',
    filename: 'compression-comparison.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Interactive Split Slider', 'Magnifier Lens', 'Bytes Saved & % Metrics', 'Visual Quality Rating', 'Instant Export']
  },
  {
    id: 'heic-to-jpg',
    title: 'HEIC to JPG Converter',
    navTitle: 'HEIC to JPG',
    description: 'Convert HEIC and HEIF images to JPG directly in your browser.',
    icon: '📱',
    path: '/heic-to-jpg.html',
    filename: 'heic-to-jpg.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Batch HEIC/HEIF Conversion', '100% Local & Private', 'Custom Quality Slider', 'Dimension Resizing', 'ZIP Download'],
    tags: ['heic', 'heif', 'jpg', 'image converter', 'iphone']
  },
  {
    id: 'bulk-image-renamer-resizer',
    title: 'Bulk Image Renamer & Resizer',
    navTitle: 'Bulk Renamer & Resizer',
    description: 'Rename, resize and optimize multiple images at once — directly in your browser.',
    icon: '⚡',
    path: '/bulk-image-renamer-resizer.html',
    filename: 'bulk-image-renamer-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Bulk Pattern Renaming', 'Preset & Custom Resizing', 'Social & E-commerce Presets', 'Format Conversion & Quality', 'Local ZIP Export'],
    tags: ['bulk', 'rename', 'resize', 'images', 'e-commerce', 'property']
  },
  {
    id: 'passport-photo-maker',
    title: 'Passport & Visa Photo Maker',
    navTitle: 'Passport Photo Maker',
    description: 'Create correctly sized ID, passport and visa photos from your own photo.',
    icon: '🪪',
    path: '/passport-photo-maker.html',
    filename: 'passport-photo-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Official Country Profiles', 'Face Position Guide Overlay', 'Background Color Changer', 'Quality & Size Checks', 'Print Sheet Generator (A4/4x6)'],
    tags: ['passport', 'visa', 'id photo', 'passport photo', 'print sheet', 'face crop']
  },
  {
    id: 'matching-parts-video-maker',
    title: 'Matching Parts Puzzle Video Maker',
    navTitle: 'Matching Parts Video Maker',
    description: 'Create satisfying matching-parts puzzle Shorts and Reels directly in your browser.',
    icon: '📹',
    path: '/matching-parts-video-maker.html',
    filename: 'matching-parts-video-maker.html',
    category: '📹 Video Tools',
    badge: 'New',
    features: ['9:16 Vertical Shorts/Reels', 'Deterministic Animation', 'Grass Lawn & Custom Backgrounds', 'Web Audio Synthesizer Effects', '100% Local WebM/MP4 Export'],
    tags: ['video', 'puzzle', 'shorts', 'reels', 'matching parts', 'video generator', 'creator']
  },
  {
    id: 'lofi-song-maker',
    title: 'Lofi Music Studio',
    navTitle: 'Lofi Song Maker',
    description: 'Transform audio with vintage Lofi effects or synthesize original Lofi beats & chill tracks completely in your browser.',
    icon: '🎧',
    path: '/lofi-song-maker.html',
    filename: 'lofi-song-maker.html',
    category: '🎵 Audio Tools',
    badge: 'New',
    features: ['Transform Audio with Lofi FX', 'Original Lofi Algorithmic Synthesizer', 'Vinyl, Tape & Ambient Noise FX', 'Chords, Drums & Melody Generators', 'WAV/MP3 & Lofi Video Exporter'],
    tags: ['lofi', 'music maker', 'lofi generator', 'chill beats', 'audio converter', 'lofi studio', 'vinyl', 'creator']
  },
  {
    id: 'lofi-maker',
    title: 'Lofi Maker',
    navTitle: 'Lofi Maker',
    description: 'Turn your song into a smooth Lofi version in one click. Upload an audio file and download your Lofi MP3.',
    icon: '🎧',
    path: '/lofi-maker.html',
    filename: 'lofi-maker.html',
    category: '🎵 Audio Tools',
    badge: 'Popular',
    features: ['One-Click Automatic Lofi Processing', '320 kbps LAME MP3 Export', '100% Client-Side Private Processing', 'Zero Settings Required', 'Mobile Friendly'],
    tags: ['lofi', 'lofi maker', 'audio converter', 'lofi effect', 'mp3', 'chill', 'music', 'creator']
  },
  {
    id: 'slowed-and-reverb',
    title: 'Slowed & Reverb Generator',
    navTitle: 'Slowed & Reverb',
    description: 'Slow down your song and add a smooth reverb effect online. Upload an audio file, create a slowed and reverb version, and download it as MP3.',
    icon: '🎧',
    path: '/slowed-and-reverb.html',
    filename: 'slowed-and-reverb.html',
    category: '🎵 Audio Tools',
    badge: 'New',
    features: ['Slowed Playback Speed Control', 'Acoustic Reverb Presets', '320 kbps LAME MP3 Export', '100% Client-Side Processing', 'Zero Server Uploads'],
    tags: ['slowed', 'reverb', 'slowed and reverb', 'mp3', 'audio effect', 'speed changer', 'music', 'creator']
  },
  {
    id: 'gst-invoice-generator',
    title: 'GST Invoice Generator',
    navTitle: 'GST Invoice',
    description: 'Create professional GST invoices online and download them as PDF.',
    icon: '🧾',
    path: '/gst-invoice-generator.html',
    filename: 'gst-invoice-generator.html',
    category: '💼 Business Tools',
    badge: 'New',
    features: [
      '100% Client-Side Local Processing',
      'Auto CGST, SGST & IGST Calculations',
      'Amount in Indian Rupees Words',
      'A4 Printable & PDF Export',
      'UPI QR Code & Logo Upload'
    ],
    tags: ['gst', 'invoice', 'gst invoice generator', 'bill generator', 'pdf', 'tax invoice', 'business', 'cgst', 'sgst', 'igst', 'india', 'tax']
  },
  {
    id: 'pdf-merge',
    title: 'PDF Merge',
    navTitle: 'PDF Merge',
    description: 'Merge PDF files online for free. Combine multiple PDFs into one document with drag-and-drop page reordering, instant preview, and zero server uploads.',
    icon: '🧩',
    path: '/pdf-merge.html',
    filename: 'pdf-merge.html',
    category: 'PDF Tools',
    badge: 'Free',
    features: ['Combine Unlimited PDFs', 'Drag-and-Drop Reorder', 'Fast Local Processing', 'Secure & Private', 'No File Size Limit']
  },
  {
    id: 'pdf-split',
    title: 'PDF Split',
    navTitle: 'PDF Split',
    description: 'Split PDF files into individual pages or extract custom page ranges online for free. Fast, secure PDF splitter with page thumbnail previews & ZIP download.',
    icon: '✂️',
    path: '/pdf-split.html',
    filename: 'pdf-split.html',
    category: 'PDF Tools',
    badge: 'Free',
    features: ['Extract Custom Ranges', 'Split All Pages', 'Page Thumbnail Preview', 'ZIP Download Support', '100% Offline Capable']
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    navTitle: 'Image to PDF',
    description: 'Convert JPG, PNG, WebP, BMP, and GIF images to a clean PDF document. Drag and drop multiple images with paper size, margin, and layout options.',
    icon: '🖼️',
    path: '/image-to-pdf.html',
    filename: 'image-to-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['JPG, PNG, WebP, BMP, GIF', 'A4 & Letter Layouts', 'Custom Margins & Fit', 'Drag Reorder', '100% Local']
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to Images',
    navTitle: 'PDF to Images',
    description: 'Extract every PDF page as high-resolution PNG, JPG, or WebP images instantly in your browser. Download pages individually or as a single ZIP package.',
    icon: '📷',
    path: '/pdf-to-images.html',
    filename: 'pdf-to-images.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['PNG, JPG & WebP Output', 'ZIP Batch Download', 'Page Thumbnail Preview', 'High Resolution', 'No Server Uploads']
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    navTitle: 'Rotate PDF',
    description: 'Rotate PDF pages by 90°, 180°, or 270° clockwise. Apply rotation to all pages or specific selected pages with live visual preview.',
    icon: '🔄',
    path: '/rotate-pdf.html',
    filename: 'rotate-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['90°, 180°, 270° Rotation', 'All or Selected Pages', 'Live Visual Thumbnails', 'Fast Local Processing', 'Zero Server Uploads']
  },
  {
    id: 'delete-pdf-pages',
    title: 'Delete PDF Pages',
    navTitle: 'Delete Pages',
    description: 'Visually select and remove unwanted pages from your PDF document. Instant thumbnail grid preview and export of updated PDF file.',
    icon: '🗑️',
    path: '/delete-pdf-pages.html',
    filename: 'delete-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Visual Page Thumbnails', 'One-Click Page Removal', 'Instant Local Export', 'Private & Secure', 'No Upload Bottleneck']
  },
  {
    id: 'extract-pdf-pages',
    title: 'Extract PDF Pages',
    navTitle: 'Extract Pages',
    description: 'Select specific pages or enter custom page range strings to extract and create a brand new PDF document.',
    icon: '📦',
    path: '/extract-pdf-pages.html',
    filename: 'extract-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Custom Page Ranges', 'Visual Selection Grid', 'Instant PDF Generation', '100% Client-Side', 'Zero Data Limits']
  },
  {
    id: 'reorder-pdf-pages',
    title: 'Reorder PDF Pages',
    navTitle: 'Reorder Pages',
    description: 'Rearrange and change page sequence in your PDF document using drag and drop or simple arrow controls.',
    icon: '🔀',
    path: '/reorder-pdf-pages.html',
    filename: 'reorder-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Drag & Drop Reordering', 'Visual Page Grid', 'Instant Local Re-assembly', 'Preserves Quality', 'No Signup Needed']
  },
  {
    id: 'pdf-watermark',
    title: 'Add Watermark',
    navTitle: 'Add Watermark',
    description: 'Add custom text or image logo watermarks to your PDF pages with control over opacity, rotation, font size, position, and color.',
    icon: '💧',
    path: '/pdf-watermark.html',
    filename: 'pdf-watermark.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Text & Image Logo Support', 'Custom Opacity & Angle', 'Flexible Positions', 'Live Color Picker', 'Batch Applied']
  },
  {
    id: 'protect-pdf',
    title: 'Protect PDF',
    navTitle: 'Protect PDF',
    description: 'Encrypt and password protect your confidential PDF documents in your browser with AES encryption support.',
    icon: '🔒',
    path: '/protect-pdf.html',
    filename: 'protect-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Password Encryption', 'AES Standard Security', 'Local Browser Processing', 'No Server Storage', 'Instant Protection']
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    navTitle: 'Unlock PDF',
    description: 'Remove password protection from your encrypted PDF documents after entering the correct password. 100% private in browser.',
    icon: '🔓',
    path: '/unlock-pdf.html',
    filename: 'unlock-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Password Removal', 'Local Browser Decryption', 'Clear Helpful Guidance', 'Private & Secure', 'No Uploads']
  },
  {
    id: 'pdf-metadata',
    title: 'PDF Metadata Viewer',
    navTitle: 'PDF Metadata',
    description: 'Inspect and edit PDF document properties including Title, Author, Subject, Keywords, Creator, and Producer, or clear metadata for privacy.',
    icon: '📋',
    path: '/pdf-metadata.html',
    filename: 'pdf-metadata.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Inspect Full Metadata', 'Edit Title & Author', 'Strip All Metadata', 'Page Size & Version Info', '100% Client-Side']
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    navTitle: 'QR Generator',
    description: 'Generate custom QR codes for URLs, WiFi networks, text, and vCards for free. High-resolution vector PNG/SVG QR code generator with brand color options.',
    icon: '📱',
    path: '/qr-generator.html',
    filename: 'qr-generator.html',
    category: 'Generators',
    badge: 'Free',
    features: ['URL & WiFi Templates', 'Custom Brand Colors', 'PNG & SVG Formats', 'Instant Clipboard Copy', 'Vector Crisp Quality']
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    navTitle: 'Resume Builder',
    description: 'Create beautiful ATS-friendly resumes completely in your browser. Live preview, customizable sections, instant PDF export.',
    icon: '📄',
    path: '/resume-builder.html',
    filename: 'resume-builder.html',
    category: '💼 Career Tools',
    badge: 'Core Tool',
    features: ['ATS Friendly', 'Live Preview', 'PDF Export', 'Custom Sections', '100% Client-Side']
  },
  {
    id: 'ats-resume-checker',
    title: 'ATS Resume Checker',
    navTitle: 'ATS Checker',
    description: 'Scan resume text locally to calculate ATS compatibility score, missing target keywords, contact details, and formatting warnings.',
    icon: '🎯',
    path: '/ats-resume-checker.html',
    filename: 'ats-resume-checker.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['ATS Score (0-100)', 'Missing Keyword Scan', 'Contact Info Check', 'Readability Score', '100% Local Scanner']
  },
  {
    id: 'resume-score-analyzer',
    title: 'Resume Score Analyzer',
    navTitle: 'Score Analyzer',
    description: 'In-depth multi-dimensional breakdown evaluating Design, Content, ATS Readiness, Keyword Density, and Professionalism.',
    icon: '📊',
    path: '/resume-score-analyzer.html',
    filename: 'resume-score-analyzer.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Overall Metric Score', 'Design & Content Metrics', 'Professionalism Rating', 'Completion Checklist', 'Actionable Suggestions']
  },
  {
    id: 'cover-letter-builder',
    title: 'Cover Letter Builder',
    navTitle: 'Cover Letter Builder',
    description: 'Interactive cover letter builder with structured sections, professional preset styles, and multi-format PDF/HTML/JSON export.',
    icon: '✉️',
    path: '/cover-letter-builder.html',
    filename: 'cover-letter-builder.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Structured Sections', 'Live Preview', 'PDF / HTML / JSON Export', 'Greeting & Intro Presets', '100% Private']
  },
  {
    id: 'cover-letter-templates',
    title: 'Cover Letter Templates',
    navTitle: 'Cover Letter Templates',
    description: '15+ industry-tailored cover letter templates for Software Engineers, Designers, Doctors, Teachers, Freshers, Marketers & more.',
    icon: '📋',
    path: '/cover-letter-templates.html',
    filename: 'cover-letter-templates.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['15+ Industry Presets', 'One-Click Load', 'Editable Text', 'Instant Customization', 'PDF & TXT Export']
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    navTitle: 'CV Builder',
    description: 'Comprehensive Curriculum Vitae builder tailored for academic, medical, research, and senior executive applications.',
    icon: '🎓',
    path: '/cv-builder.html',
    filename: 'cv-builder.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Academic Research Format', 'Publications & Grants', 'Multiple CV Layouts', 'High Density Output', 'PDF Export']
  },
  {
    id: 'resume-keyword-optimizer',
    title: 'Resume Keyword Optimizer',
    navTitle: 'Keyword Optimizer',
    description: 'Paste target Job Description and compare against your resume text to highlight missing, repeated, weak, and strong power words.',
    icon: '🔍',
    path: '/resume-keyword-optimizer.html',
    filename: 'resume-keyword-optimizer.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Job Description Match', 'Missing & Weak Keywords', 'Frequency Analysis', 'Action Verb Suggestions', '100% Client-Side']
  },
  {
    id: 'resume-template-gallery',
    title: 'Resume Template Gallery',
    navTitle: 'Template Gallery',
    description: 'Browse and load 30+ professionally engineered resume templates across Minimal, Modern, Executive, Developer, Creative & Medical.',
    icon: '🖼️',
    path: '/resume-template-gallery.html',
    filename: 'resume-template-gallery.html',
    category: '💼 Career Tools',
    badge: '30+ Designs',
    features: ['30+ Unique Layouts', 'Categorized Presets', 'One-Click Load', 'Live Sample Previews', 'Free Customization']
  },
  {
    id: 'resume-version-manager',
    title: 'Resume Version Manager',
    navTitle: 'Version Manager',
    description: 'Store, rename, duplicate, manage, and back up multiple resume versions safely inside local browser storage.',
    icon: '📁',
    path: '/resume-version-manager.html',
    filename: 'resume-version-manager.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Multi-Resume Storage', 'Duplicate & Rename', 'Local Storage Backup', 'Export / Restore All', 'Zero Server Dependence']
  },
  {
    id: 'resume-import',
    title: 'Resume Import',
    navTitle: 'Resume Import',
    description: 'Import previously saved resume files in JSON, HTML, or TXT formats directly into active suite memory.',
    icon: '📥',
    path: '/resume-import.html',
    filename: 'resume-import.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['JSON / HTML / TXT Import', 'Instant Data Validation', 'Restore Backup', 'Overwrite or Add', '100% Client-Side']
  },
  {
    id: 'resume-export',
    title: 'Resume Export',
    navTitle: 'Resume Export',
    description: 'Export active resume to PDF, clean HTML web page, raw JSON code, plain TXT file, or initiate direct print & web sharing.',
    icon: '📤',
    path: '/resume-export.html',
    filename: 'resume-export.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['PDF, HTML, JSON, TXT', 'Print & Browser Share', 'Vector Crisp Quality', 'Filename Customization', 'Instant Download']
  },
  {
    id: 'resume-completeness',
    title: 'Resume Completeness Tracker',
    navTitle: 'Completeness',
    description: 'Check profile completeness percentage with interactive checklist and step-by-step recommendations for job readiness.',
    icon: '✅',
    path: '/resume-completeness.html',
    filename: 'resume-completeness.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Completion Percentage', 'Step-by-Step Checklist', 'Missing Section Alerts', 'Live Progress Bar', 'Improvement Guide']
  },
  {
    id: 'resume-section-manager',
    title: 'Resume Section Manager',
    navTitle: 'Section Manager',
    description: 'Reorder, show, hide, duplicate, or rename resume sections with drag-and-drop flexibility and undo/redo history stack.',
    icon: '🧱',
    path: '/resume-section-manager.html',
    filename: 'resume-section-manager.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Reorder & Drag/Drop', 'Show / Hide Sections', 'Duplicate Section', 'Undo / Redo Stack', 'Instant Sync']
  },
  {
    id: 'professional-skill-library',
    title: 'Professional Skill Library',
    navTitle: 'Skill Library',
    description: 'Searchable library of 500+ predefined professional skills across Programming, Design, Marketing, Finance, HR, Legal & Healthcare.',
    icon: '💡',
    path: '/professional-skill-library.html',
    filename: 'professional-skill-library.html',
    category: '💼 Career Tools',
    badge: '500+ Skills',
    features: ['10+ Industry Categories', 'Search & Filter', 'One-Click Add', 'Proficiency Ratings', 'Skill Descriptions']
  },
  {
    id: 'summary-generator',
    title: 'Professional Summary Generator',
    navTitle: 'Summary Generator',
    description: 'Generate high-impact executive summaries without AI using structured formula templates for every experience level.',
    icon: '✍️',
    path: '/summary-generator.html',
    filename: 'summary-generator.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['100% Local Formulas', 'Impact, Tech & Formal Tones', 'Role Specific Presets', 'One-Click Insert', 'Editable Drafts']
  },
  {
    id: 'resume-color-themes',
    title: 'Resume Color Themes',
    navTitle: 'Color Themes',
    description: 'Apply professional high-contrast color themes (Corporate Navy, Emerald Green, Ocean Blue, Royal Purple, Obsidian) to your resume.',
    icon: '🎨',
    path: '/resume-color-themes.html',
    filename: 'resume-color-themes.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['10+ Professional Palette Presets', 'HEX / RGB Custom Picker', 'WCAG Contrast Check', 'Printable Aesthetics', 'Live Preview']
  },
  {
    id: 'experience-calculator',
    title: 'Work Experience Calculator',
    navTitle: 'Experience Calc',
    description: 'Calculate total work experience in years, months, and days across multiple roles with employment gap & overlap analysis.',
    icon: '⏳',
    path: '/experience-calculator.html',
    filename: 'experience-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Multi-Job Timeline', 'Gap Analysis', 'Years / Months / Days', 'Current Employment Support', 'Printable Report']
  },
  {
    id: 'notice-period-calculator',
    title: 'Notice Period Calculator',
    navTitle: 'Notice Period Calc',
    description: 'Determine exact last working day, remaining working days, holiday exclusions, and estimated notice buyout cost.',
    icon: '📅',
    path: '/notice-period-calculator.html',
    filename: 'notice-period-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Exact End Date Calculation', 'Working Days Remaining', 'Notice Buyout Calculator', 'Public Holiday Exclusions', 'Instant Summary']
  },
  {
    id: 'salary-hike-calculator',
    title: 'Salary Hike Calculator',
    navTitle: 'Salary Hike Calc',
    description: 'Calculate absolute salary increase, percentage hike, monthly take-home difference, and tax impact between job offers.',
    icon: '📈',
    path: '/salary-hike-calculator.html',
    filename: 'salary-hike-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Current vs New CTC', 'Percentage Hike Calculation', 'Monthly Difference', 'Tax Slabs Estimate', 'Offer Comparison']
  },
  {
    id: 'ctc-calculator',
    title: 'CTC to In-Hand Calculator',
    navTitle: 'CTC Calculator',
    description: 'Break down gross CTC into Basic, HRA, Allowances, PF, Gratuity, Professional Tax, and net monthly take-home salary.',
    icon: '💵',
    path: '/ctc-calculator.html',
    filename: 'ctc-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Monthly Take-Home Breakdown', 'PF & Gratuity Calculation', 'Tax Deductions', 'Custom Allowances', 'Detailed Payslip Breakdown']
  },
  {
    id: 'working-days-calculator',
    title: 'Working Days Calculator',
    navTitle: 'Working Days Calc',
    description: 'Calculate exact working business days between two dates excluding weekends (5-day or 6-day week) and custom public holidays.',
    icon: '📆',
    path: '/working-days-calculator.html',
    filename: 'working-days-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['5-Day & 6-Day Week Options', 'Weekend Exclusions', 'Custom Holiday Entries', 'Hours & Minutes Equivalent', 'Fast Local Calc']
  },
  {
    id: 'youtube-title-generator',
    title: 'YouTube Title Generator',
    navTitle: 'Title Generator',
    description: 'Generate high-CTR, SEO-friendly video titles for Tutorial, Review, Gaming, Education, Tech, Finance, AI, Vlog, Shorts, News, Islamic, and Entertainment.',
    icon: '🎬',
    path: '/youtube-title-generator.html',
    filename: 'youtube-title-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['12 Category Options', 'High CTR Formulas', 'Keyword Optimization', 'Instant Copy', '100% Client-Side']
  },
  {
    id: 'youtube-description-generator',
    title: 'YouTube Description Generator',
    navTitle: 'Description Generator',
    description: 'Generate structured YouTube video descriptions with Intro, Main Content, Subscribe CTA, Social Links, and Hashtags. Download TXT or copy.',
    icon: '📝',
    path: '/youtube-description-generator.html',
    filename: 'youtube-description-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Structured Layout', 'Subscribe & Social Links', 'Hashtags & Links', 'Copy & Download TXT', 'Instant Preview']
  },
  {
    id: 'youtube-tags-generator',
    title: 'YouTube Tags Generator',
    navTitle: 'Tags Generator',
    description: 'Generate Short Tags, Long-tail Tags, SEO Tags, and Related Tags with real-time character counter and one-click Copy All for YouTube Studio.',
    icon: '🏷️',
    path: '/youtube-tags-generator.html',
    filename: 'youtube-tags-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Short & Long-Tail Tags', 'SEO Keyword Clusters', '500 Char Counter', 'Comma-Separated Copy', '100% Local']
  },
  {
    id: 'youtube-hashtag-generator',
    title: 'YouTube Hashtag Generator',
    navTitle: 'Hashtag Generator',
    description: 'Generate optimized YouTube hashtags categorized into High Volume, Medium Volume, Long Tail, and Trending styles with one-click copy.',
    icon: '#️⃣',
    path: '/youtube-hashtag-generator.html',
    filename: 'youtube-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['High & Medium Volume', 'Long-Tail Hashtags', 'Trending Style', 'One-Click Copy', 'Local Generator']
  },
  {
    id: 'youtube-thumbnail-simulator',
    title: 'YouTube Thumbnail & Mobile Feed Simulator',
    navTitle: 'Thumbnail Simulator',
    description: 'Preview YouTube video thumbnails and titles in realistic mobile Home Feed and Search Results before publishing. Test dark and light mode, title truncation, readability, and visual standout.',
    icon: '📱',
    path: '/youtube-thumbnail-simulator.html',
    filename: 'youtube-thumbnail-simulator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: [
      'Mobile Home Feed Simulator',
      'Mobile Search Results Simulator',
      'Dark & Light Mode Previews',
      'CSS Title Truncation Simulation',
      '3-Way Title Comparison',
      'Deterministic HTML5 Canvas Readability Score',
      'Feed Standout Analysis',
      'Micro Small-Size Inspection',
      '16:9 Aspect Ratio Checker',
      '100% Private Client-Side Image Processing'
    ],
    faq: [
      {
        question: 'How does the YouTube thumbnail simulator work?',
        answer: 'The simulator renders your uploaded thumbnail and video title inside an authentic mobile device container that emulates YouTube mobile Home Feed and Search Result layouts. It uses browser-native Canvas 2D image processing to measure tonal contrast, perceived luminance, edge sharpness, and theme compatibility—giving you instant, deterministic feedback before you upload to YouTube.'
      },
      {
        question: 'Can I preview my YouTube thumbnail on mobile screens?',
        answer: 'Yes. Over 70% of YouTube views occur on mobile smartphones. Our simulator lets you inspect how your thumbnail scales on mobile displays, including a dedicated 140px small-size preview mode to ensure your main subject, text badge, and facial expressions remain recognizable at miniature scale.'
      },
      {
        question: 'How does the title truncation simulation work?',
        answer: 'Rather than simply counting characters, the simulator measures the title inside real mobile container dimensions with standard YouTube two-line clamping. It indicates whether your title fits within 2 lines or may be truncated with an ellipsis on smaller phone screens, allowing you to front-load vital keywords in the first 40–50 characters.'
      },
      {
        question: 'Can I test both YouTube Light Mode and Dark Mode?',
        answer: 'Yes! You can toggle between Light Mode and Dark Mode with one click. The analysis engine calculates separate edge contrast scores for both dark backgrounds (#0f0f0f) and light backgrounds (#ffffff) to warn you if dark borders or white text blend into the viewer’s interface.'
      },
      {
        question: 'Can I compare multiple video title options?',
        answer: 'Yes. You can enter up to three title variations (Primary Title, Option 2, and Option 3). The comparison table displays character counts, word counts, and estimated truncation states side-by-side, and lets you activate any option in the live phone preview with a single click.'
      },
      {
        question: 'Does this tool predict actual YouTube CTR (Click-Through Rate)?',
        answer: 'No tool can predict real viewer CTR or algorithmic ranking because audience interest, niche competition, topic timing, and viewer intent vary widely. Our Feed Standout and Readability scores measure mathematical visual characteristics (luminance, tonal contrast, color saturation, and edge clarity) to help you optimize visual clarity, not make algorithmic promises.'
      },
      {
        question: 'Are my thumbnail images uploaded to any server?',
        answer: 'No. The simulator operates 100% locally inside your web browser using HTML5 File APIs and Canvas 2D. Your images are never transmitted to any external server or third-party service, guaranteeing complete privacy for unpublished creator assets.'
      },
      {
        question: 'What is the optimal YouTube thumbnail size and aspect ratio?',
        answer: 'YouTube recommends an aspect ratio of 16:9 with a resolution of 1280×720 pixels (minimum 640 pixels wide) in JPG, PNG, or WebP format with a file size under 2MB. Our tool automatically checks your uploaded image dimensions and flags non-16:9 ratios so you can avoid awkward letterboxing or cropping.'
      }
    ]
  },
  {
    id: 'youtube-banner-safe-area',
    title: 'YouTube Channel Banner Safe Area Simulator',
    navTitle: 'Banner Safe Area',
    description: 'Preview your YouTube channel banner on mobile, desktop and TV. Check safe areas, crop regions and banner dimensions before uploading.',
    icon: '📐',
    path: '/youtube-banner-safe-area.html',
    filename: 'youtube-banner-safe-area.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: [
      'Mobile Channel Header Preview',
      'Desktop Wide Strip Simulation',
      'Full 16:9 TV Display Mockup',
      'Simultaneous 3-Way Device Comparison',
      'Mathematical 1546×423 Safe Area Overlay',
      'Proportional Dimension & Aspect Ratio Checker',
      'Customizable Channel Mockup Elements',
      'Center Alignment Crosshair Guides',
      'High-Resolution Guide Export',
      '100% Client-Side Privacy'
    ],
    faq: [
      {
        question: 'Why does my YouTube banner look different on mobile?',
        answer: 'YouTube serves a single responsive banner image across smart TVs, desktop computers, tablets, and mobile phones. On TVs, the entire 2560 × 1440 pixel image is shown. On desktop browsers, YouTube crops the image into a wide, shallow horizontal strip of 2560 × 423 pixels. On smartphones, YouTube crops the sides even further to fit narrow phone screens, displaying only the central 1546 × 423 pixel safe area. If your important text or logos are placed near the edges, they will be cut off on mobile devices.'
      },
      {
        question: 'What size should a YouTube channel banner be?',
        answer: 'According to official YouTube guidelines, the recommended banner upload dimensions are 2560 × 1440 pixels with a 16:9 aspect ratio. The minimum required upload dimension is 2048 × 1152 pixels. YouTube accepts JPG, PNG, GIF, and WebP files up to 6MB in size.'
      },
      {
        question: 'What is the YouTube banner safe area?',
        answer: 'The YouTube banner safe area is the central 1546 × 423 pixel zone of a standard 2560 × 1440 pixel canvas (or 1235 × 338 pixels at minimum upload resolution). Any text, logos, social handles, faces, or call-to-actions placed inside this central safe zone are guaranteed to remain fully visible across all device types—including smartphones, tablets, laptops, and 4K TVs.'
      },
      {
        question: 'How can I prevent my logo from being cropped?',
        answer: 'To prevent your logo and text from being cropped, always keep them centered horizontally and vertically within the 1546 × 423 pixel safe area. Use our simulator’s "Safe Area Outline" and "Center Alignment Guides" to verify that none of your essential branding touches or crosses outside the emerald safe boundary.'
      },
      {
        question: 'Can I check my banner before uploading it?',
        answer: 'Yes! That is the exact purpose of this tool. Simply upload your drafted channel art to test how it appears in realistic YouTube-style Mobile, Desktop, and TV contexts. You can also use our 3-Way Crop Comparison mode to simultaneously inspect where the mobile and desktop cutoffs occur.'
      },
      {
        question: 'Does the simulator upload my image?',
        answer: 'No. This tool runs 100% client-side in your web browser. Your banner image is loaded directly into browser memory and is never uploaded, stored, or transmitted to any server or third-party service. Your unpublished creator designs remain completely private.'
      },
      {
        question: 'Does this tool guarantee the exact YouTube crop?',
        answer: 'No. This is a visual simulation based on current official YouTube banner guidance and standard device aspect ratios. YouTube periodically updates its web and mobile app interfaces, and different smartphone screen aspect ratios (such as 19.5:9 or foldable screens) may apply minor visual variations. Always verify the live result on your channel after uploading.'
      }
    ]
  },
  {
    id: 'youtube-thumbnail-preview',
    title: 'YouTube Thumbnail Preview',
    navTitle: 'Thumbnail Preview',
    description: 'Preview uploaded video thumbnails in realistic YouTube mockups across Desktop, Mobile, Search Results, and Suggested Videos in Light/Dark mode.',
    icon: '🖼️',
    path: '/youtube-thumbnail-preview.html',
    filename: 'youtube-thumbnail-preview.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Desktop & Mobile View', 'Search & Suggested Feed', 'Dark & Light Mode', 'Custom Title & Channel', '100% Client-Side']
  },
  {
    id: 'youtube-channel-name-generator',
    title: 'YouTube Channel Name Generator',
    navTitle: 'Channel Name Generator',
    description: 'Generate unique YouTube channel names and handle ideas by category with handle availability format checker, favorites list, and copy button.',
    icon: '📢',
    path: '/youtube-channel-name-generator.html',
    filename: 'youtube-channel-name-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Suggestions', 'Handle Format Checker', 'Favorites List', 'One-Click Copy', 'Zero Server Dependence']
  },
  {
    id: 'youtube-video-idea-generator',
    title: 'YouTube Video Idea Generator',
    navTitle: 'Video Idea Generator',
    description: 'Generate creative video topic ideas across Tech, Gaming, Education, Finance, Cooking, Islamic, AI, Travel, Health, and Lifestyle categories.',
    icon: '💡',
    path: '/youtube-video-idea-generator.html',
    filename: 'youtube-video-idea-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Niche Categories', 'Angles & Target Audience', 'Difficulty Rating', 'Copy & Save Ideas', '100% Client-Side']
  },
  {
    id: 'youtube-playlist-name-generator',
    title: 'YouTube Playlist Name Generator',
    navTitle: 'Playlist Name Generator',
    description: 'Generate catchy, organized, and searchable YouTube playlist names with instant copy and TXT/JSON download options.',
    icon: '🎶',
    path: '/youtube-playlist-name-generator.html',
    filename: 'youtube-playlist-name-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Catchy Playlist Titles', 'Categorized Styles', 'Copy to Clipboard', 'Download TXT & JSON', 'Instant Local Gen']
  },
  {
    id: 'youtube-timestamp-generator',
    title: 'YouTube Timestamp Generator',
    navTitle: 'Timestamp Generator',
    description: 'Create, sort, and format YouTube video chapter timestamps (00:00 Intro, 00:45 Topic, etc.) with automatic sorting and YouTube Studio formatting.',
    icon: '⏱️',
    path: '/youtube-timestamp-generator.html',
    filename: 'youtube-timestamp-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Chapter Timestamp Builder', 'Auto-Chronological Sort', '00:00 Intro Validation', 'Instant Copy', '100% Client-Side']
  },
  {
    id: 'youtube-description-formatter',
    title: 'YouTube Video Description Formatter',
    navTitle: 'Description Formatter',
    description: 'Auto-format raw YouTube descriptions with clean spacing, bullet points, capitalized section dividers, sanitized links, and live preview.',
    icon: '🪄',
    path: '/youtube-description-formatter.html',
    filename: 'youtube-description-formatter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Clean Spacing & Indents', 'Bullet & Divider Styles', 'Section Auto-Capitalize', 'Live Preview Box', 'Copy Formatted Text']
  },
  {
    id: 'thumbnail-text-generator',
    title: 'Thumbnail Text Generator',
    navTitle: 'Thumbnail Text',
    description: 'Generate short, attention-grabbing 1-4 word thumbnail text concepts (MUST WATCH, SECRET, VIRAL, SHOCKING, FREE) with visual preview.',
    icon: '🔤',
    path: '/thumbnail-text-generator.html',
    filename: 'thumbnail-text-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['1-4 Word Power Phrases', 'High CTR Categories', 'Visual Typography Preview', 'One-Click Copy', 'Instant Local Generator']
  },
  {
    id: 'viral-hook-generator',
    title: 'Viral Hook Generator',
    navTitle: 'Viral Hook Generator',
    description: 'Generate powerful first-line hooks for YouTube, Instagram, TikTok, Facebook, and LinkedIn videos and posts to maximize viewer retention.',
    icon: '🪝',
    path: '/viral-hook-generator.html',
    filename: 'viral-hook-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 Social Platforms', 'Curiosity & Urgency Hooks', 'Retention-Driven Formula', 'One-Click Copy', 'Zero Server Dependence']
  },
  {
    id: 'cta-generator',
    title: 'CTA Generator',
    navTitle: 'CTA Generator',
    description: 'Generate compelling Call-To-Action (CTA) phrases for Subscribe, Like, Comment, Share, and Website links across multiple communication tones.',
    icon: '📣',
    path: '/cta-generator.html',
    filename: 'cta-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 CTA Types', 'Multiple Tone Options', 'High-Converting Formulas', 'One-Click Copy', '100% Local']
  },
  {
    id: 'social-character-counter',
    title: 'Social Character Counter',
    navTitle: 'Social Character Counter',
    description: 'Live character, word, sentence, and reading time counter with built-in limit gauges for YouTube, Instagram, TikTok, Twitter/X, Facebook, and LinkedIn.',
    icon: '📊',
    path: '/social-character-counter.html',
    filename: 'social-character-counter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Characters & Words', 'Reading Time Estimate', 'Platform Limit Gauges', 'Text Formatting Cleaners', '100% Private']
  },
  {
    id: 'emoji-generator',
    title: 'Emoji Generator & Picker',
    navTitle: 'Emoji Generator',
    description: 'Browse, search, and copy emojis by category with recent emoji tracking, favorites list, and social media emoji combination generator.',
    icon: '😀',
    path: '/emoji-generator.html',
    filename: 'emoji-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Emoji Library', 'Fast Keyword Search', 'Recent & Favorites Stack', 'Social Combo Presets', 'One-Click Copy']
  },
  {
    id: 'instagram-caption-generator',
    title: 'Instagram Caption Generator',
    navTitle: 'IG Caption Generator',
    description: 'Generate catchy captions with emojis and hashtags for Reels, Posts, Stories, Business, Travel, Food, Fashion, Fitness, Education, Motivation, and Personal Brand.',
    icon: '📸',
    path: '/instagram-caption-generator.html',
    filename: 'instagram-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['11 Niche Categories', 'Multiple Variations', 'Emoji & Hashtag Integration', 'One-Click Copy', '100% Local']
  },
  {
    id: 'instagram-hashtag-generator',
    title: 'Instagram Hashtag Generator',
    navTitle: 'IG Hashtag Generator',
    description: 'Generate Popular, Niche, Long-tail, Local, and Reels hashtags with real-time character counter and one-click Copy All.',
    icon: '🏷️',
    path: '/instagram-hashtag-generator.html',
    filename: 'instagram-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Hashtag Sets', 'Popular, Niche & Local', 'Character & Count Metrics', 'Copy All Button', '100% Client-Side']
  },
  {
    id: 'instagram-bio-generator',
    title: 'Instagram Bio Generator',
    navTitle: 'IG Bio Generator',
    description: 'Generate professional, creative, and aesthetic bios for Business, Creator, Freelancer, Student, Influencer, Islamic, Tech, Gamer, Fitness, and Photographer profiles.',
    icon: '✨',
    path: '/instagram-bio-generator.html',
    filename: 'instagram-bio-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Profile Categories', 'Multiple Aesthetic Styles', '150 Character Limit Check', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'instagram-username-generator',
    title: 'Instagram Username Generator',
    navTitle: 'IG Username Generator',
    description: 'Generate available-style usernames categorized into Short, Professional, Creative, Minimal, and Random options.',
    icon: '👤',
    path: '/instagram-username-generator.html',
    filename: 'instagram-username-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Short & Minimal Styles', 'Professional & Creative', 'Random Combination Mode', 'One-Click Copy', '100% Local']
  },
  {
    id: 'tiktok-caption-generator',
    title: 'TikTok Caption Generator',
    navTitle: 'TikTok Caption Generator',
    description: 'Generate viral, high-retention TikTok captions across Entertainment, Comedy, Education, Gaming, Lifestyle, and Technology niches.',
    icon: '🎵',
    path: '/tiktok-caption-generator.html',
    filename: 'tiktok-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['6 Niche Categories', 'Hook & Call to Action', 'Trending Style Formats', 'One-Click Copy', '100% Local']
  },
  {
    id: 'tiktok-hashtag-generator',
    title: 'TikTok Hashtag Generator',
    navTitle: 'TikTok Hashtag Generator',
    description: 'Generate FYP-optimized TikTok hashtags with favorites saving and one-click copy.',
    icon: '#️⃣',
    path: '/tiktok-hashtag-generator.html',
    filename: 'tiktok-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['FYP & Trending Clusters', 'Niche-Specific Tag Sets', 'Favorites Manager', 'One-Click Copy All', '100% Client-Side']
  },
  {
    id: 'facebook-caption-generator',
    title: 'Facebook Caption Generator',
    navTitle: 'FB Caption Generator',
    description: 'Generate engaging Facebook post captions for Business, Festival, Events, Travel, Technology, Marketing, and Personal posts.',
    icon: '📘',
    path: '/facebook-caption-generator.html',
    filename: 'facebook-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['7 Niche Categories', 'Engaging Storytelling Tone', 'Call to Action Options', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'facebook-hashtag-generator',
    title: 'Facebook Hashtag Generator',
    navTitle: 'FB Hashtag Generator',
    description: 'Generate trending-style Facebook hashtags to expand post reach and engagement.',
    icon: '📲',
    path: '/facebook-hashtag-generator.html',
    filename: 'facebook-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Trending Facebook Tags', 'Topic-Based Tag Clusters', 'One-Click Copy', 'Fast Local Processing', '100% Free']
  },
  {
    id: 'linkedin-headline-generator',
    title: 'LinkedIn Headline Generator',
    navTitle: 'LinkedIn Headline Generator',
    description: 'Generate high-converting professional headlines for Developer, Designer, Student, HR, Marketing, Sales, AI Engineer, Teacher, Doctor, and Business.',
    icon: '💼',
    path: '/linkedin-headline-generator.html',
    filename: 'linkedin-headline-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Career Paths', 'Impact & Keyword Formats', 'Multi-Variation Output', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'linkedin-summary-generator',
    title: 'LinkedIn Summary Generator',
    navTitle: 'LinkedIn Summary Generator',
    description: 'Generate polished, professional About summaries for LinkedIn. Edit directly, copy to clipboard, or download as TXT file.',
    icon: '📜',
    path: '/linkedin-summary-generator.html',
    filename: 'linkedin-summary-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Structured Bio Sections', 'Live Text Editing', 'One-Click Copy', 'Download TXT File', '100% Client-Side']
  },
  {
    id: 'twitter-bio-generator',
    title: 'Twitter (X) Bio Generator',
    navTitle: 'Twitter / X Bio Generator',
    description: 'Generate punchy Twitter/X bios in Short, Professional, Funny, Minimal, and Business styles within character limits.',
    icon: '🐦',
    path: '/twitter-bio-generator.html',
    filename: 'twitter-bio-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 Style Options', '160 Character Limit Indicator', 'Hashtag & Tag Suggestions', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'universal-hashtag-generator',
    title: 'Universal Hashtag Generator',
    navTitle: 'Universal Hashtag Generator',
    description: 'Generate platform-tailored hashtags for YouTube, Instagram, TikTok, Facebook, LinkedIn, Twitter (X), Pinterest, and Threads.',
    icon: '🌐',
    path: '/universal-hashtag-generator.html',
    filename: 'universal-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['8 Platform Selector Options', 'Topic Keyword Generator', 'Copy All Functionality', 'Fast Local Processing', '100% Client-Side']
  },
  {
    id: 'fancy-text-generator',
    title: 'Fancy Text Generator',
    navTitle: 'Fancy Text Generator',
    description: 'Convert plain text into stylized Unicode fonts including Bold, Italic, Script, Bubble, Outline, Monospace, and Small Caps.',
    icon: '🔠',
    path: '/fancy-text-generator.html',
    filename: 'fancy-text-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Bold, Italic & Script', 'Bubble, Outline & Monospace', 'Small Caps Style', 'Instant One-Click Copy', '100% Client-Side']
  },
  {
    id: 'unicode-font-generator',
    title: 'Unicode Font Generator',
    navTitle: 'Unicode Font Generator',
    description: 'Generate multiple Unicode text font styles with live preview, favorites saving, and one-click copy for bios and captions.',
    icon: '🔤',
    path: '/unicode-font-generator.html',
    filename: 'unicode-font-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['20+ Unicode Text Styles', 'Live Input Preview', 'Favorites Collection', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'text-decorator',
    title: 'Text Decorator',
    navTitle: 'Text Decorator',
    description: 'Decorate text with Stars, Lines, Boxes, Symbols, Arrows, Circles, and minimal separators for social media bios and headers.',
    icon: '🎀',
    path: '/text-decorator.html',
    filename: 'text-decorator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Stars, Lines & Boxes', 'Arrows & Circles Decor', 'Minimal Separators', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'emoji-combiner',
    title: 'Emoji Combiner',
    navTitle: 'Emoji Combiner',
    description: 'Combine and build creative emoji strings and sequences with recents stack, favorites saving, and instant copy.',
    icon: '🎨',
    path: '/emoji-combiner.html',
    filename: 'emoji-combiner.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Emoji Combination Canvas', 'Recents & Favorites Manager', 'One-Click Clipboard Copy', 'Clean Interface', '100% Local']
  },
  {
    id: 'social-media-post-formatter',
    title: 'Social Media Post Formatter',
    navTitle: 'Post Formatter',
    description: 'Format posts for Instagram, Facebook, LinkedIn, Twitter, and Threads preserving line breaks, paragraph spacing, and bullet points.',
    icon: '📐',
    path: '/social-media-post-formatter.html',
    filename: 'social-media-post-formatter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Preserve Paragraph Spacing', 'Platform Mockup Previews', 'Invisible Space Inserter', 'One-Click Copy', '100% Local']
  },
  {
    id: 'social-bio-link-builder',
    title: 'Social Bio Link Builder',
    navTitle: 'Bio Link Builder',
    description: 'Build a personalized single-page bio link website with Name, Bio, Website, Instagram, YouTube, LinkedIn, GitHub, and Email, and export as static HTML.',
    icon: '🔗',
    path: '/social-bio-link-builder.html',
    filename: 'social-bio-link-builder.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Live Mobile Mockup', 'All Social Media Links', 'Export Clean Static HTML', 'No Backend Required', '100% Free & Local']
  },
  {
    id: 'islamic-shorts-maker',
    title: 'Islamic Shorts Maker — Create 9:16 Islamic Images Online',
    navTitle: 'Islamic Shorts Maker',
    description: 'Create 9:16 Islamic Shorts images for YouTube Shorts, Reels & TikTok. Add Arabic, Hindi, Urdu, or English text, gold borders, and download high-res PNGs 100% locally.',
    icon: '🕌',
    path: '/islamic-shorts-maker.html',
    filename: 'islamic-shorts-maker.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['1080x1920 9:16 Canvas', '12+ Islamic Templates', 'Arabic, Hindi, Urdu, EN', 'Gold Borders & Mihrab Arch', 'High-Res PNG/JPG Export']
  },
  {
    id: 'script-to-video-maker',
    title: 'Script to Video Maker',
    navTitle: 'Script to Video',
    description: 'Turn any script into a scrolling text video with your own background, fonts, colors, and logo overlay — perfect for Reels, Shorts, and TikTok. 100% free, runs in your browser.',
    icon: '📜',
    path: '/script-to-video-maker.html',
    filename: 'script-to-video-maker.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: [
      'Scrolling Text Story Reel Animation',
      'Custom Backgrounds (Gradients, Images, Videos)',
      'Aspect Ratio Presets (9:16, 1:1, 16:9)',
      'Custom Typography & Text Highlight Boxes',
      'Draggable Fixed Logo / Watermark PNG Overlay',
      '100% Free Client-Side MP4 Export'
    ],
    faq: [
      {
        question: 'How do I turn a script into a video?',
        answer: 'Simply paste your script or story, choose a background (gradient preset, custom image, or looping video), customize font styles, add an optional PNG logo overlay, and click Download MP4 Video.'
      },
      {
        question: 'Are my scripts and background files uploaded to any server?',
        answer: 'No! Zubware processes everything 100% locally in your web browser. Your scripts, images, and videos remain private on your device.'
      },
      {
        question: 'What video formats and aspect ratios are supported?',
        answer: 'You can export 9:16 (1080x1920 for TikTok/Reels/Shorts), 1:1 (1080x1080 for Instagram), or 16:9 (1920x1080 for YouTube) in MP4 format.'
      }
    ]
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    navTitle: 'UUID Generator',
    description: 'Generate bulk UUID v4 strings instantly in your browser with download TXT option.',
    icon: '🔑',
    path: '/uuid-generator.html',
    filename: 'uuid-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['UUID v4 Standard', 'Bulk Generation (1-100)', 'Uppercase / Lowercase', 'Hyphen Toggle', 'Copy & TXT Download']
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    navTitle: 'Hash Generator',
    description: 'Generate cryptographic MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally in real-time.',
    icon: '🔒',
    path: '/hash-generator.html',
    filename: 'hash-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['MD5, SHA-1, SHA-256, SHA-512', 'Real-time Calculation', 'Uppercase / Lowercase', '100% Private', 'Copy & Download']
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    navTitle: 'JWT Decoder',
    description: 'Decode JSON Web Tokens locally. Inspect Header, Payload, Expiry, and Issued time without sending data to any server.',
    icon: '🔏',
    path: '/jwt-decoder.html',
    filename: 'jwt-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Header & Payload Parsing', 'Token Expiry Check', '100% Client-Side', 'Never Sends Data to Server', 'Formatted JSON View']
  },
  {
    id: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    navTitle: 'Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human-readable dates and vice versa in UTC and local timezone.',
    icon: '⏰',
    path: '/unix-timestamp-converter.html',
    filename: 'unix-timestamp-converter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Seconds & Milliseconds', 'Date to Timestamp', 'UTC & Local Time', 'Current Time Counter', 'Relative Time Display']
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Explainer',
    navTitle: 'Regex Tester',
    description: 'Test regular expressions against sample text with live highlights, capture groups, and plain English token breakdown.',
    icon: '🔍',
    path: '/regex-tester.html',
    filename: 'regex-tester.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Live Highlight Matches', 'Regex Flags (g, i, m, s, u, y)', 'Match & Group Extraction', 'Token Explainer', 'Preset Patterns']
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Tree Viewer',
    navTitle: 'JSON Formatter',
    description: 'Beautify, minify, validate, and inspect collapsible JSON node tree structures.',
    icon: '💻',
    path: '/json-formatter.html',
    filename: 'json-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify / Compact', 'Collapsible Tree View', 'Syntax Error Detection', 'Copy & Download']
  },
  {
    id: 'json-validator',
    title: 'JSON Validator',
    navTitle: 'JSON Validator',
    description: 'Validate JSON syntax locally, pinpoint error line and column numbers, and format valid JSON.',
    icon: '✅',
    path: '/json-validator.html',
    filename: 'json-validator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Syntax Validation', 'Exact Line & Column Error', 'Fix Assistance', 'Copy & Clean', '100% Local']
  },
  {
    id: 'json-to-csv',
    title: 'JSON to CSV Converter',
    navTitle: 'JSON to CSV',
    description: 'Convert JSON arrays into CSV spreadsheets with live table preview and instant CSV export.',
    icon: '📊',
    path: '/json-to-csv.html',
    filename: 'json-to-csv.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Array & Object Parsing', 'CSV Data Table Preview', 'Automated Header Extraction', 'Copy & Download CSV', '100% Client-Side']
  },
  {
    id: 'csv-to-json',
    title: 'CSV to JSON Converter',
    navTitle: 'CSV to JSON',
    description: 'Convert CSV spreadsheets or TSV files into clean formatted JSON objects and arrays.',
    icon: '🔄',
    path: '/csv-to-json.html',
    filename: 'csv-to-json.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Custom Delimiters (, ; \\t |)', 'Auto Data Type Casting', 'Formatted JSON Output', 'Copy & Download JSON', '100% Client-Side']
  },
  {
    id: 'csv-viewer',
    title: 'CSV Viewer & Data Grid',
    navTitle: 'CSV Viewer',
    description: 'Inspect, search, sort by column, filter, and paginate large CSV datasets directly in your browser.',
    icon: '📋',
    path: '/csv-viewer.html',
    filename: 'csv-viewer.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Interactive Data Grid', 'Search & Column Sort', 'Pagination Controls', 'Export Filtered CSV', 'No Server Limits']
  },
  {
    id: 'website-downloader',
    title: 'Website Downloader — Download Website Assets & HTML into ZIP',
    navTitle: 'Website Downloader',
    description: 'Download publicly accessible website HTML, CSS, JavaScript, and images into a structured ZIP archive with rewritten relative links. 100% client-side in-browser tool.',
    icon: '🌐',
    path: '/website-downloader.html',
    filename: 'website-downloader.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: [
      'Download Website HTML, CSS, JS & Images',
      'Client-Side In-Browser Packaging (JSZip)',
      'Relative Asset Path Rewriting (index.html)',
      'Live In-Browser Code & Sandbox Preview',
      'Direct HTML / View-Source Mode for CORS Sites',
      '100% Free & Private — Zero Server Proxies'
    ],
    faq: [
      {
        question: 'How does the in-browser Website Downloader work?',
        answer: 'Zubware analyzes the target website HTML directly in your web browser, extracts linked assets (CSS stylesheets, JS scripts, images, and fonts), rewrites asset links to relative local paths, and bundles them into an offline-ready ZIP archive using client-side JSZip.'
      },
      {
        question: 'Why do some websites show a CORS restriction?',
        answer: 'Modern web browsers enforce Cross-Origin Resource Sharing (CORS) security policies to protect web users. If a target site prevents cross-origin browser fetches, you can easily switch to "Direct HTML / Source Mode", paste the view-source HTML markup, and Zubware will extract and package the resources for you.'
      },
      {
        question: 'Are my downloaded websites uploaded to any server?',
        answer: 'No! Zubware operates 100% client-side inside your browser memory. No proxy servers or cloud databases ever intercept, log, or store your requests or downloaded files.'
      },
      {
        question: 'Can I open the downloaded ZIP file offline?',
        answer: 'Yes! When you enable "Rewrite Local Paths", all stylesheets, scripts, and images are linked using relative paths (e.g. ./assets/css/style.css) so you can unzip the archive and double-click index.html to view the website offline.'
      }
    ]
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter & Preview',
    navTitle: 'HTML Formatter',
    description: 'Beautify, indent, minify, or preview rendered HTML document markups in real-time.',
    icon: '🌐',
    path: '/html-formatter.html',
    filename: 'html-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify HTML', 'Live Render Preview', 'File Upload & Export', '100% Local']
  },
  {
    id: 'css-formatter',
    title: 'CSS Formatter & Beautifier',
    navTitle: 'CSS Formatter',
    description: 'Format, indent, clean, and minify CSS style rules for maximum readability & performance.',
    icon: '🎨',
    path: '/css-formatter.html',
    filename: 'css-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify CSS', 'File Upload & Export', 'Copy & Download', '100% Local']
  },
  {
    id: 'javascript-formatter',
    title: 'JavaScript Formatter',
    navTitle: 'JS Formatter',
    description: 'Format, beautify, un-minify, or compact JavaScript & TypeScript code directly in your browser.',
    icon: '⚡',
    path: '/javascript-formatter.html',
    filename: 'javascript-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify JS', 'File Upload & Export', 'Copy & Download', '100% Local']
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter',
    navTitle: 'XML Formatter',
    description: 'Beautify and indent raw XML documents with custom spacing options.',
    icon: '📄',
    path: '/xml-formatter.html',
    filename: 'xml-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['XML Beautifier', 'Minify XML', 'Syntax Validation', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'xml-validator',
    title: 'XML Validator',
    navTitle: 'XML Validator',
    description: 'Validate XML syntax and detect unmatched opening or closing tags.',
    icon: '🛡️',
    path: '/xml-validator.html',
    filename: 'xml-validator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Syntax Checker', 'Unmatched Tag Detection', 'Line Error Reporting', 'Clean Output', '100% Private']
  },
  {
    id: 'url-parser',
    title: 'URL Component Parser',
    navTitle: 'URL Parser',
    description: 'Break down complex URL strings into protocol, host, port, path, fragment hash, and query parameter pairs.',
    icon: '🔗',
    path: '/url-parser.html',
    filename: 'url-parser.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Protocol, Host & Port', 'Query Parameters Table', 'Fragment Hash Extraction', 'Copy Parameter Pairs', '100% Local']
  },
  {
    id: 'url-encoder-decoder',
    title: 'URL Encoder / Decoder',
    navTitle: 'URL Encoder',
    description: 'Encode special characters into web-safe URL formats or decode percent-encoded links back to plain text.',
    icon: '🌐',
    path: '/url-encoder-decoder.html',
    filename: 'url-encoder-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Percent Encoding (%20)', 'Decode URL Strings', 'Copy & Download TXT', '100% Private', 'Instant Conversion']
  },
  {
    id: 'base64-encoder-decoder',
    title: 'Base64 Encoder / Decoder',
    navTitle: 'Base64 Tool',
    description: 'Encode text into Base64 format or decode Base64 strings back to UTF-8 text.',
    icon: '🔤',
    path: '/base64-encoder-decoder.html',
    filename: 'base64-encoder-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['UTF-8 Safe Encoding', 'Decode Base64', 'File Upload Support', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'html-escape-unescape',
    title: 'HTML Escape / Unescape',
    navTitle: 'HTML Escape',
    description: 'Convert HTML markup characters into safe entity codes (&lt;, &gt;, &amp;) or unescape entities back to markup.',
    icon: '🏷️',
    path: '/html-escape-unescape.html',
    filename: 'html-escape-unescape.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Escape HTML Entities', 'Unescape HTML Entities', 'Quotes & Ampersands', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'http-header-viewer',
    title: 'HTTP Header Viewer',
    navTitle: 'Header Viewer',
    description: 'Parse HTTP headers, categorize security & caching rules, and audit security compliance.',
    icon: '🌐',
    path: '/http-header-viewer.html',
    filename: 'http-header-viewer.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Status Line & Headers', 'Categorized Security Rules', 'Security Audit Rating', 'Search & Filter', 'Copy Pairs']
  },
  {
    id: 'api-request-builder',
    title: 'API Request Builder',
    navTitle: 'API Request Builder',
    description: 'Send HTTP requests (GET, POST, PUT, DELETE) and inspect status, headers, and response payloads directly in browser.',
    icon: '🚀',
    path: '/api-request-builder.html',
    filename: 'api-request-builder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['GET, POST, PUT, DELETE', 'Header & Body Editor', 'Response Status & Time', 'Formatted JSON Body', '100% Browser Executed']
  },
  {
    id: 'color-converter',
    title: 'Color Converter & Contrast',
    navTitle: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK with WCAG contrast ratio checks.',
    icon: '🎨',
    path: '/color-converter.html',
    filename: 'color-converter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['HEX, RGB, HSL, CMYK', 'Visual Swatch Picker', 'WCAG AA/AAA Contrast Check', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'qr-code-decoder',
    title: 'QR Code Decoder',
    navTitle: 'QR Decoder',
    description: 'Upload any image containing a QR code to extract its underlying text or web link completely client-side.',
    icon: '📱',
    path: '/qr-code-decoder.html',
    filename: 'qr-code-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Image Drag & Drop', 'PNG, JPG, WEBP', 'jsQR Local Engine', 'Open URL Link', 'Copy Decoded Text']
  },
  {
    id: 'css-gradient-generator',
    title: 'CSS Gradient Generator',
    navTitle: 'Gradient Generator',
    description: 'Design custom linear, radial, or conic CSS gradients with live preview, unlimited color stops, angle adjustment & instant export.',
    icon: '🎨',
    path: '/css-gradient-generator.html',
    filename: 'css-gradient-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Linear, Radial, Conic', 'Unlimited Color Stops', 'Angle Slider', 'Random & Reverse', 'Copy & Download CSS']
  },
  {
    id: 'box-shadow-generator',
    title: 'Box Shadow Generator',
    navTitle: 'Box Shadow Generator',
    description: 'Create layered, soft, inset, or multi-shadow CSS box shadows with real-time visual canvas customization.',
    icon: '📦',
    path: '/box-shadow-generator.html',
    filename: 'box-shadow-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Multiple Shadow Layers', 'X & Y Offset Sliders', 'Blur & Spread Radius', 'Opacity & Inset', 'Copy CSS Code']
  },
  {
    id: 'border-radius-generator',
    title: 'Border Radius Generator',
    navTitle: 'Border Radius',
    description: 'Design custom rounded, asymmetrical, or elliptical box corners easily with live preview.',
    icon: '⭕',
    path: '/border-radius-generator.html',
    filename: 'border-radius-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Individual Corners', 'Linked Corners Sync', 'Elliptical Radii', 'Live Shape Preview', 'Copy CSS Code']
  },
  {
    id: 'glassmorphism-generator',
    title: 'Glassmorphism Generator',
    navTitle: 'Glassmorphism',
    description: 'Generate frosted glass UI effects with blur, opacity, translucent borders & ambient glow.',
    icon: '✨',
    path: '/glassmorphism-generator.html',
    filename: 'glassmorphism-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Backdrop Blur', 'Translucent Opacity', 'Border Highlight', 'Ambient Glow', 'Copy Glass CSS']
  },
  {
    id: 'neumorphism-generator',
    title: 'Neumorphism Generator',
    navTitle: 'Neumorphism',
    description: 'Generate soft UI extruded or inset neumorphic shadows, flat, concave, and convex shapes.',
    icon: '🔲',
    path: '/neumorphism-generator.html',
    filename: 'neumorphism-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Flat, Concave, Convex, Pressed', 'Light Direction', 'Distance & Blur', 'Radius Adjustment', 'Copy CSS Code']
  },
  {
    id: 'css-clip-path-generator',
    title: 'CSS Clip Path Generator',
    navTitle: 'Clip Path Generator',
    description: 'Create custom geometric shapes, polygons, circles & stars using CSS clip-path.',
    icon: '✂️',
    path: '/css-clip-path-generator.html',
    filename: 'css-clip-path-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Triangle, Hexagon, Star', 'Polygon & Circles', 'Live Visual Preview', 'Editable Code', 'Copy CSS Code']
  },
  {
    id: 'svg-shape-generator',
    title: 'SVG Shape Generator',
    navTitle: 'SVG Shape Generator',
    description: 'Generate vector circles, stars, polygons & organic smooth blobs with SVG download.',
    icon: '📐',
    path: '/svg-shape-generator.html',
    filename: 'svg-shape-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Circles, Polygons & Blobs', 'Fill & Stroke Colors', 'Stroke Width', 'Download SVG File', 'Copy SVG Code']
  },
  {
    id: 'color-palette-generator',
    title: 'Color Palette Generator',
    navTitle: 'Color Palette',
    description: 'Generate harmonious monochromatic, triadic, complementary or random palettes with hex lock & JSON export.',
    icon: '🎨',
    path: '/color-palette-generator.html',
    filename: 'color-palette-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Color Harmonies', 'Lock Swatches', 'One-Click HEX Copy', 'JSON Export', '100% Local']
  },
  {
    id: 'contrast-checker',
    title: 'Contrast Checker',
    navTitle: 'Contrast Checker',
    description: 'Check color contrast ratios against WCAG 2.1 AA & AAA accessibility guidelines with live text preview.',
    icon: '👁️',
    path: '/contrast-checker.html',
    filename: 'contrast-checker.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Exact Ratio Calculation', 'WCAG AA & AAA Badges', 'Normal & Large Text', 'Foreground/Background Swap', 'Live Preview']
  },
  {
    id: 'random-color-generator',
    title: 'Random Color Generator',
    navTitle: 'Random Color',
    description: 'Generate random colors instantly in HEX, RGB, HSL, RGBA with spacebar control & favorites list.',
    icon: '🎲',
    path: '/random-color-generator.html',
    filename: 'random-color-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Spacebar Shortcut', 'HEX, RGB, HSL, RGBA', 'Favorites Saved Locally', 'Recent History', 'One-Click Copy']
  },
  {
    id: 'qr-business-card-generator',
    title: 'QR Business Card Generator',
    navTitle: 'QR Business Card',
    description: 'Create a contact vCard QR code that instantly imports contact details on mobile smartphones.',
    icon: '📇',
    path: '/qr-business-card-generator.html',
    filename: 'qr-business-card-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['vCard Contact Format', 'Name, Phone, Email, Site', 'Live QR Preview', 'High Res PNG Download', '100% Client-Side']
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    navTitle: 'Unit Converter',
    description: 'Convert length, weight, area, volume, temperature, data storage, speed & time units instantly.',
    icon: '📏',
    path: '/unit-converter.html',
    filename: 'unit-converter.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['8 Major Categories', 'Instant Recalculation', 'All-Unit Breakdown Table', 'Unit Swap', 'Zero Latency']
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    navTitle: 'Percentage Calculator',
    description: 'Calculate percentage amounts, proportions, increases, decreases & differences with live formula modes.',
    icon: '%',
    path: '/percentage-calculator.html',
    filename: 'percentage-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['What is X% of Y', 'X is what % of Y', '% Increase / Decrease', '% Difference', 'Instant Results']
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    navTitle: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, total hours & next birthday countdown.',
    icon: '🎂',
    path: '/age-calculator.html',
    filename: 'age-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Years, Months, Days', 'Total Hours & Minutes', 'Next Birthday Timer', 'Day of Week', 'Target Date Comparison']
  },
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    navTitle: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installment (EMI), total interest & yearly amortization schedule.',
    icon: '🏦',
    path: '/emi-calculator.html',
    filename: 'emi-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Monthly EMI Amount', 'Total Interest Paid', 'Principal vs Interest Bar', 'Yearly Amortization Schedule', 'Interactive Sliders']
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    navTitle: 'Discount Calculator',
    description: 'Calculate final sale price, discount savings & total tax payable instantly.',
    icon: '🏷️',
    path: '/discount-calculator.html',
    filename: 'discount-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Original Price & Discount %', 'Sales Tax Rate', 'Total Savings Badge', 'Final Price Output', 'Preset Quick Buttons']
  },
  {
    id: 'currency-calculator',
    title: 'Currency Calculator',
    navTitle: 'Currency Calculator',
    description: 'Fast offline manual currency converter with customizable exchange rates for USD, EUR, GBP, INR & more.',
    icon: '💱',
    path: '/currency-calculator.html',
    filename: 'currency-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Offline Processing', 'Custom Rate Editing', 'Major World Currencies', 'Instant Calculation', 'Local Storage Persistence']
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    navTitle: 'Tip Calculator',
    description: 'Calculate tip amounts and split bill totals evenly among friends or group members.',
    icon: '🍽️',
    path: '/tip-calculator.html',
    filename: 'tip-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Bill & Tip %', 'Preset Tip Buttons', 'Split Bill Count', 'Per-Person Total & Tip', 'Instant Calculation']
  },
  {
    id: 'random-number-generator',
    title: 'Random Number Generator',
    navTitle: 'Random Number',
    description: 'Generate random numbers with customizable range, quantity, unique rules & sorting.',
    icon: '🔢',
    path: '/random-number-generator.html',
    filename: 'random-number-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Min & Max Range', 'Multiple Quantity', 'Allow/Disallow Repeats', 'Asc/Desc Sorting', 'Copy Numbers']
  },
  {
    id: 'random-password-generator',
    title: 'Random Password Generator',
    navTitle: 'Password Generator',
    description: 'Generate strong, cryptographically secure random passwords instantly in your browser.',
    icon: '🔑',
    path: '/random-password-generator.html',
    filename: 'random-password-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Length 6 to 64 Chars', 'A-Z, a-z, 0-9, Symbols', 'Exclude Similar Chars', 'Strength Meter', 'One-Click Copy']
  },
  {
    id: 'number-to-words',
    title: 'Number to Words Converter',
    navTitle: 'Number to Words',
    description: 'Convert numbers and currency amounts into plain English words (International & Indian systems) with speech pronunciation.',
    icon: '🔢',
    path: '/number-to-words.html',
    filename: 'number-to-words.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Millions & Lakhs Systems', 'USD, INR, EUR, GBP Currencies', 'Title, Upper & Lower Case', 'Text-to-Speech Pronunciation', 'One-Click Copy']
  },
  {
    id: 'words-to-number',
    title: 'Words to Number Converter',
    navTitle: 'Words to Number',
    description: 'Convert English written word phrases into numeric digits and formatted numbers instantly.',
    icon: '🔤',
    path: '/words-to-number.html',
    filename: 'words-to-number.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Words to Digits', 'Formatted Commas', 'Millions & Crores Support', '100% Client-Side', 'One-Click Copy']
  },
  {
    id: 'roman-numeral-converter',
    title: 'Roman Numeral Converter',
    navTitle: 'Roman Numerals',
    description: 'Convert Hindu-Arabic numbers to Roman numerals and vice versa with year presets and reference charts.',
    icon: '🏛️',
    path: '/roman-numeral-converter.html',
    filename: 'roman-numeral-converter.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Bidirectional Conversion', 'Numbers 1 to 3,999,999', 'Year Quick Presets', 'Roman Reference Chart', 'One-Click Copy']
  },
  {
    id: 'loan-calculator',
    title: 'Loan & Mortgage Calculator',
    navTitle: 'Loan Calculator',
    description: 'Calculate monthly loan payments, total interest, payoff schedule, extra payment savings, and export amortization CSV.',
    icon: '🏦',
    path: '/loan-calculator.html',
    filename: 'loan-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Monthly EMI Payment', 'Extra Payment Savings', 'Yearly Amortization Schedule', 'Visual Principal vs Interest', 'Export CSV Schedule']
  },
  {
    id: 'roi-calculator',
    title: 'ROI & Profit Margin Calculator',
    navTitle: 'ROI Calculator',
    description: 'Calculate Return on Investment (ROI), Annualized ROI, Gross Profit Margin, Markup %, and Break-Even point.',
    icon: '📈',
    path: '/roi-calculator.html',
    filename: 'roi-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Total & Annualized ROI', 'Profit Margin & Markup %', 'Break-Even Unit & Revenue', '100% Private Local Math', 'Instant Output']
  },
  {
    id: 'compound-interest-calculator',
    title: 'Compound Interest & CAGR Calculator',
    navTitle: 'Compound Interest',
    description: 'Calculate compound interest growth over time with recurring deposits, compounding frequencies, and CAGR rate.',
    icon: '📊',
    path: '/compound-interest-calculator.html',
    filename: 'compound-interest-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Monthly Deposits & Compounding', 'Yearly Growth Breakdown', 'CAGR Rate Calculator', 'Interactive Schedule', 'Instant Output']
  },
  {
    id: 'chatgpt-prompt-builder',
    title: 'ChatGPT Prompt Builder',
    navTitle: 'ChatGPT Prompts',
    description: 'Build structured, professional prompts for ChatGPT writing, coding, marketing, business, education & productivity.',
    icon: '🤖',
    path: '/chatgpt-prompt-builder.html',
    filename: 'chatgpt-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Role & Tone Customizer', 'Multi-Category Templates', 'Copy & Download Options', 'Browser-Only Privacy', 'Library Integration']
  },
  {
    id: 'gemini-prompt-builder',
    title: 'Gemini Prompt Builder',
    navTitle: 'Gemini Prompts',
    description: 'Construct optimized prompts for Google Gemini AI covering writing, research, analysis, image ideas & multimodal prompts.',
    icon: '✨',
    path: '/gemini-prompt-builder.html',
    filename: 'gemini-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Google Gemini Tuned', 'Multimodal & Search Hooks', 'Structured Prompt Rules', 'Copy & Download', 'Favorites Store']
  },
  {
    id: 'claude-prompt-builder',
    title: 'Claude Prompt Builder',
    navTitle: 'Claude Prompts',
    description: 'Craft long-form prompts with XML tags, system personas, context framing & complex reasoning for Claude AI.',
    icon: '🧠',
    path: '/claude-prompt-builder.html',
    filename: 'claude-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['XML Tag Structuring', 'System Role Framing', 'Long-Context Optimization', 'Copy/Download/Print', 'Browser Offline']
  },
  {
    id: 'veo-prompt-builder',
    title: 'Veo Prompt Builder',
    navTitle: 'Veo Video Prompts',
    description: 'Generate realistic cinematic AI video prompts for Google Veo, Runway, Luma & Sora with camera motion & lighting.',
    icon: '🎬',
    path: '/veo-prompt-builder.html',
    filename: 'veo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Camera Movement Sliders', 'Lighting & Frame Rates', 'Cinematic Movement Cues', 'Runway/Luma/Sora Compatible', 'Export & Copy']
  },
  {
    id: 'midjourney-prompt-builder',
    title: 'Midjourney Prompt Builder',
    navTitle: 'Midjourney Prompts',
    description: 'Build Midjourney v6 prompts with aspect ratio --ar, stylize --s, chaos --c, quality --q, version --v & negative parameters.',
    icon: '🎨',
    path: '/midjourney-prompt-builder.html',
    filename: 'midjourney-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['V6 Command Parameters', 'Aspect Ratio Selector', 'Stylize & Chaos Sliders', 'Negative Prompting (--no)', 'Ready Templates']
  },
  {
    id: 'flux-prompt-builder',
    title: 'Flux Prompt Builder',
    navTitle: 'Flux Prompts',
    description: 'Create hyperrealistic Flux1.0 AI image generator prompts for portraits, anime, photorealism, typography & architecture.',
    icon: '⚡',
    path: '/flux-prompt-builder.html',
    filename: 'flux-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Flux Schnell & Dev Presets', 'Typography In-Image Controls', 'Photorealism Detail Sliders', 'Copy/Download Formats', 'Library Modal']
  },
  {
    id: 'stable-diffusion-prompt-builder',
    title: 'Stable Diffusion Prompt Builder',
    navTitle: 'SDXL Prompts',
    description: 'Generate positive and negative prompts for SDXL, SD 1.5, Pony & Flux with samplers, CFG scale & step recommendations.',
    icon: '🖼️',
    path: '/stable-diffusion-prompt-builder.html',
    filename: 'stable-diffusion-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Positive & Negative Prompts', 'Sampler & CFG Recommendations', 'Pony/SDXL/SD1.5 Presets', 'Export TXT & MD', 'Favorite Manager']
  },
  {
    id: 'logo-prompt-builder',
    title: 'Logo Prompt Builder',
    navTitle: 'Logo Prompts',
    description: 'Generate vector logo prompts across Tech, Business, Medical, Finance, Gaming, Luxury & Minimalist styles.',
    icon: '🏷️',
    path: '/logo-prompt-builder.html',
    filename: 'logo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Industry Categories', 'Logo Style Presets', 'Vector Graphic Rules', 'Color Palette Control', 'One-Click Copy']
  },
  {
    id: 'thumbnail-prompt-builder',
    title: 'Thumbnail Prompt Builder',
    navTitle: 'Thumbnail Prompts',
    description: 'Generate high-CTR thumbnail prompts for YouTube, TikTok, Instagram & Facebook with facial hooks & bold text.',
    icon: '📺',
    path: '/thumbnail-prompt-builder.html',
    filename: 'thumbnail-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['High-CTR Hooks', 'Facial Expression Controls', 'Overlay Text Formatting', 'Platform Aspect Ratios', 'Export & Share']
  },
  {
    id: 'product-photo-prompt-builder',
    title: 'Product Photography Prompt Builder',
    navTitle: 'Product Photo Prompts',
    description: 'Generate commercial studio photography prompts for Amazon, Flipkart, luxury brands & e-commerce.',
    icon: '📸',
    path: '/product-photo-prompt-builder.html',
    filename: 'product-photo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Studio Lighting Options', 'Podium & Backdrop Controls', 'Camera Lens Specs', 'Commercial E-Commerce Presets', 'Copy & Download']
  },
  {
    id: 'interior-design-prompt-builder',
    title: 'Interior Design Prompt Builder',
    navTitle: 'Interior Prompts',
    description: 'Generate AI prompts for interior architecture, luxury villas, cafes, bedrooms, kitchens & modern offices.',
    icon: '🛋️',
    path: '/interior-design-prompt-builder.html',
    filename: 'interior-design-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['ArchViz Style Presets', 'Room & Furniture Options', 'Material & Lighting Sliders', 'Camera Angles', 'Export Actions']
  },
  {
    id: 'story-prompt-builder',
    title: 'Story Prompt Builder',
    navTitle: 'Story Prompts',
    description: 'Generate narrative prompts across Horror, Sci-Fi, Fantasy, Adventure, Islamic Stories, Kids Stories & Mysteries.',
    icon: '📖',
    path: '/story-prompt-builder.html',
    filename: 'story-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Genre Archetypes', 'Protagonist Flaw Builder', 'Inciting Incident Hooks', 'Twist & Moral Controls', 'Download TXT/MD']
  },
  {
    id: 'youtube-script-prompt-builder',
    title: 'YouTube Script Prompt Builder',
    navTitle: 'Script Prompts',
    description: 'Generate scriptwriting prompts for YouTube Shorts, Long Videos, Explainers, Podcasts & Tech channels.',
    icon: '📹',
    path: '/youtube-script-prompt-builder.html',
    filename: 'youtube-script-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Viral Hook Formulas', 'Host Persona Options', 'B-Roll & Music Cues', 'CTA Formatting', 'Library Templates']
  },
  {
    id: 'resume-prompt-builder',
    title: 'Resume Prompt Builder',
    navTitle: 'Resume Prompts',
    description: 'Generate ATS-friendly AI resume writing & job tailoring prompts using accomplishment metrics.',
    icon: '📄',
    path: '/resume-prompt-builder.html',
    filename: 'resume-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Google XYZ Formula', 'Action Verb Tuning', 'ATS Keyword Targeting', 'Section Specific Prompts', 'One-Click Export']
  },
  {
    id: 'cover-letter-prompt-builder',
    title: 'Cover Letter Prompt Builder',
    navTitle: 'Cover Letter Prompts',
    description: 'Craft persuasive, professional AI cover letter prompts tailored to target companies & hiring managers.',
    icon: '✉️',
    path: '/cover-letter-prompt-builder.html',
    filename: 'cover-letter-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Company Alignment Hooks', 'Value Proposition Tuning', 'Executive Tone Options', '3-Paragraph Format', 'Export & Print']
  },
  {
    id: 'email-prompt-builder',
    title: 'Email Prompt Builder',
    navTitle: 'Email Prompts',
    description: 'Generate AI prompts for business emails, cold outreach, customer support, job offers & marketing.',
    icon: '📧',
    path: '/email-prompt-builder.html',
    filename: 'email-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Cold Outreach Formulas', 'Subject Line Generators', 'Low-Friction CTAs', 'Word Count Constraints', 'Copy & Download']
  },
  {
    id: 'social-media-prompt-builder',
    title: 'Social Media Prompt Builder',
    navTitle: 'Social Media Prompts',
    description: 'Generate viral social post prompts for Instagram, LinkedIn, TikTok, Twitter/X, Facebook & Threads.',
    icon: '📱',
    path: '/social-media-prompt-builder.html',
    filename: 'social-media-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Multi-Platform Presets', 'Carousel & Thread Outlines', 'Pattern Interrupt Hooks', 'Hashtags & CTAs', 'Export Actions']
  },
  {
    id: 'seo-prompt-builder',
    title: 'SEO Prompt Builder',
    navTitle: 'SEO Prompts',
    description: 'Build SEO content briefs for blogs, websites, keyword research, meta titles & internal linking.',
    icon: '🔍',
    path: '/seo-prompt-builder.html',
    filename: 'seo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['E-E-A-T Compliance Rules', 'Meta Tag Optimization', 'Search Intent Targeting', 'FAQ Schema Guidelines', 'Download Markdown']
  },
  {
    id: 'coding-prompt-builder',
    title: 'Coding Prompt Builder',
    navTitle: 'Coding Prompts',
    description: 'Generate software engineering prompts for React, Python, JS, Flutter, SQL, debugging & clean architecture.',
    icon: '💻',
    path: '/coding-prompt-builder.html',
    filename: 'coding-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Multi-Language Presets', 'Edge Case Guardrails', 'Strict Typing Rules', 'Architecture Constraints', 'Copy Code Prompt']
  },
  {
    id: 'universal-prompt-builder',
    title: 'Universal Prompt Builder',
    navTitle: 'Universal Prompts',
    description: 'Build custom structured master prompts with Role, Goal, Context, Constraints, Format, Tone & Examples.',
    icon: '🌐',
    path: '/universal-prompt-builder.html',
    filename: 'universal-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Custom Section Architect', 'Role & Goal Builder', 'Output Format Tuning', 'Language & Examples', 'Export TXT/MD']
  },
  {
    id: 'qr-code-safety-checker',
    title: 'QR Code Safety Checker',
    navTitle: 'QR Safety Checker',
    description: 'Scan a QR code safely, decode its URL or text, and check for common phishing and suspicious URL patterns before opening it.',
    icon: '🛡️',
    path: '/qr-code-safety-checker.html',
    filename: 'qr-code-safety-checker.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'New',
    features: ['100% Client-Side Scan', 'Camera & Image Upload', '12+ Local Heuristic Rules', 'Phishing & Impersonation Alert', 'Safe Link Inspector']
  },
  {
    id: 'weight-gain-calculator',
    title: 'Weight Gain Calorie & Macro Calculator',
    navTitle: 'Weight Gain Calculator',
    description: 'Calculate your daily calorie target and protein, fat, and carb targets for weight and muscle gain.',
    icon: '💪',
    path: '/weight-gain-calculator.html',
    filename: 'weight-gain-calculator.html',
    category: '💪 Health & Fitness',
    badge: 'New',
    tags: [
      'weight gain calculator',
      'weight gain calorie calculator',
      'bulking calculator',
      'calorie surplus calculator',
      'macro calculator',
      'weight gain macros',
      'protein calculator',
      'calorie calculator India',
      'macro calculator India'
    ],
    features: [
      'Personalized Calorie Surplus Formula',
      'Protein, Fat & Carb Target Breakdown',
      '4 Activity Multiplier Levels',
      'Macro Calorie Percentage Distribution',
      '1-Click Copy & Reset Functions',
      '100% Client-Side Privacy'
    ],
    faq: [
      {
        question: 'How does the Weight Gain Calorie & Macro Calculator work?',
        answer: 'The calculator estimates your daily caloric bulking requirement by multiplying your body weight in kg by your chosen activity multiplier (33 for Sedentary, 35 for Lightly Active, 37 for Moderately Active, and 39 for Very Active). It then allocates 1.9g of protein per kg of body weight (4 kcal/g) and 0.7g of fat per kg of body weight (9 kcal/g), assigning all remaining surplus calories to clean carbohydrates (4 kcal/g).'
      },
      {
        question: 'How much weight can I expect to gain with this calorie target?',
        answer: 'This formula is tuned for steady, lean muscle mass growth (hypertrophy) with minimal fat accumulation, typically aiming for 0.25 kg to 0.5 kg of healthy weight gain per week when combined with progressive resistance training.'
      },
      {
        question: 'Why is protein set to 1.9g per kg of body weight?',
        answer: 'Sports nutrition research recommends between 1.6g and 2.2g of protein per kg of body weight for individuals seeking muscle hypertrophy and weight gain. 1.9g/kg provides an optimal sweet spot for muscle protein synthesis without excessive digestive load.'
      },
      {
        question: 'Is my health data saved or sent to any server?',
        answer: 'No. All calculations run strictly client-side inside your web browser. Zubware never stores, collects, or transmits your personal body metrics to any external server or third party.'
      }
    ]
  },
  {
    id: 'pdf-size-adjuster',
    title: 'PDF Size Adjuster Online – Increase or Reduce PDF Size',
    navTitle: 'PDF Size Adjuster',
    description: 'Adjust a PDF file toward a target size by increasing it with harmless PDF padding or reducing it with browser-based compression.',
    icon: '⚖️',
    path: '/pdf-size-adjuster.html',
    filename: 'pdf-size-adjuster.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      'Automatic Increase or Reduce Mode Detection',
      'Target Size in Decimal KB or MB (1 KB = 1,000 B)',
      'Exact Byte Targeting with Fixed-Point Calibration',
      'Lossless Stream & Structure Compression',
      '100% Client-Side In-Browser Processing'
    ],
    faq: [
      {
        question: 'How does the PDF Size Adjuster determine whether to increase or reduce size?',
        answer: 'The tool automatically compares your target file size against the actual uploaded file size. If your target is larger than your original file, it initiates harmless padding expansion. If your target is smaller, it applies browser-side compression.'
      },
      {
        question: 'Will expanding or increasing the PDF alter its visible pages or text?',
        answer: 'No. Increase mode adds non-rendering, ISO-compliant private data structures to the PDF catalog. Your document pages, text, vectors, images, and fonts remain 100% untouched and identical.'
      },
      {
        question: 'What file-size units does the tool use?',
        answer: 'The tool strictly follows the standard decimal convention where 1 KB = 1,000 bytes and 1 MB = 1,000,000 bytes. This ensures perfect consistency with government and job application upload thresholds.'
      },
      {
        question: 'Are my confidential documents uploaded to a remote server?',
        answer: 'No. Everything runs strictly in your web browser sandbox using WebAssembly and client-side processing. Your files never leave your device.'
      }
    ]
  },
  {
    id: 'increase-pdf-size',
    title: 'Increase PDF Size Online – Make a PDF Larger',
    navTitle: 'Increase PDF Size',
    description: 'Increase the file size of a PDF to meet minimum upload size requirements. Process your PDF locally in your browser.',
    icon: '📈',
    path: '/increase-pdf-size.html',
    filename: 'increase-pdf-size.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      'Target Size in KB or MB',
      'Increase to At Least Requested Size',
      'Preserves All Text, Vectors & Layouts',
      'No Visible Pages or Content Added',
      '100% Client-Side Privacy'
    ],
    faq: [
      {
        question: 'How does Increase PDF Size make the file larger without altering content?',
        answer: 'It embeds harmless, standard-compliant non-rendering data and metadata inside the PDF structure. Your visible document pages, layouts, vectors, and text remain 100% untouched and identical.'
      },
      {
        question: 'Why would I need to increase a PDF file size?',
        answer: 'Certain recruitment portals, government job application forms, tender submissions, and automated scanning systems enforce strict minimum file size thresholds (e.g., must be at least 300 KB or 1 MB) to prevent empty or low-resolution document uploads.'
      },
      {
        question: 'Will the PDF still open in standard PDF viewers?',
        answer: 'Yes. The generated document remains a strictly valid standard PDF (ISO 32000 compliant) and opens flawlessly in Adobe Acrobat, Google Chrome, Apple Preview, Foxit, and mobile PDF readers.'
      },
      {
        question: 'Is my confidential PDF uploaded to any server?',
        answer: 'No. All operations run 100% locally inside your web browser. Your document never leaves your device.'
      }
    ]
  },
  {
    id: 'decrease-pdf-size',
    title: 'Decrease PDF Size Online – Compress PDF',
    navTitle: 'Decrease PDF Size',
    description: 'Reduce PDF file size online with browser-based compression while preserving quality where possible.',
    icon: '📉',
    path: '/decrease-pdf-size.html',
    filename: 'decrease-pdf-size.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      'Low, Medium & Strong Compression Presets',
      'Optional Custom Target Maximum Size',
      'Preserves Selectable Text & Vector Graphics',
      'Accurate Side-by-Side Savings Calculator',
      '100% Private Client-Side Compression'
    ],
    faq: [
      {
        question: 'How does Decrease PDF Size reduce the file size?',
        answer: 'It applies intelligent stream compression, object stream deduplication, and configurable raster image recompression directly inside your web browser.'
      },
      {
        question: 'Will text and vector quality be preserved?',
        answer: 'Yes. Unlike basic compressors that rasterize entire documents into low-resolution images, our smart compression preserves selectable text, vector graphics, and document structure wherever possible.'
      },
      {
        question: 'What if my PDF is already compressed?',
        answer: 'PDF compression depends heavily on document contents. If a PDF is already heavily optimized (like text-only PDFs), our tool detects this and informs you honestly rather than degrading your document.'
      },
      {
        question: 'Are my files sent to any external server?',
        answer: 'No. All compression operations run locally inside your browser sandbox. Zubware never uploads, stores, or inspects your files.'
      }
    ]
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor — Compress PDF Files Online Free',
    navTitle: 'PDF Compressor',
    description: 'Compress PDF files online for free and reduce file size while preserving high visual quality. 100% browser-side processing.',
    icon: '🗜️',
    path: '/pdf-compressor.html',
    filename: 'pdf-compressor.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['Adjustable Compression Presets', 'Maximum, Balanced & High Quality', 'Real-time Size Savings Calculator', 'Preserves Document Dimensions', '100% Client-Side Privacy'],
    faq: [
      {
        question: 'How does the PDF Compressor reduce file size?',
        answer: 'It compresses raster images and document streams using configurable resolution scaling and JPEG compression algorithms directly inside your web browser.'
      },
      {
        question: 'Are my confidential documents uploaded to a server?',
        answer: 'No. All compression is executed 100% locally in your browser memory. Your files never leave your computer or phone.'
      }
    ]
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG Converter — Convert PDF Pages to Images Online',
    navTitle: 'PDF to JPG',
    description: 'Convert PDF pages into high-resolution JPG images online for free. Download individual pages or all pages as a ZIP archive.',
    icon: '🖼️',
    path: '/pdf-to-jpg.html',
    filename: 'pdf-to-jpg.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['High Resolution Rendering (up to 300 DPI)', 'Custom Page Range Support', 'Individual Page Download & ZIP Export', 'Instant Grid Preview', '100% Private Client-Side'],
    faq: [
      {
        question: 'Can I choose specific pages to convert?',
        answer: 'Yes! You can convert all pages or enter a custom page range such as 1-5, 8, 12.'
      },
      {
        question: 'Can I download all converted pages in one click?',
        answer: 'Yes, click "Download All as ZIP" to save all converted JPG images bundled together.'
      }
    ]
  },
  {
    id: 'edit-pdf',
    title: 'Online PDF Editor — Add Text, Sign & Edit PDF Free',
    navTitle: 'Edit PDF',
    description: 'Edit PDF documents online for free. Add text annotations, insert digital signatures, highlight sections, place images, rotate, and rearrange pages.',
    icon: '✏️',
    path: '/edit-pdf.html',
    filename: 'edit-pdf.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['Add Custom Text Annotations', 'Digital Signature Drawing Pad', 'Image & Stamp Insertion', 'Highlight Rectangles', 'Rotate & Delete Pages', '100% Browser-Side Processing'],
    faq: [
      {
        question: 'What can I edit with this online PDF editor?',
        answer: 'You can add text notes, draw signatures, insert images/stamps, highlight areas, rotate pages, and remove or reorder pages.'
      },
      {
        question: 'Does this modify existing embedded PDF text?',
        answer: 'This tool performs client-side overlay editing and annotation. Direct vector editing of existing embedded text is not supported.'
      }
    ]
  },
  {
    id: 'text-to-pdf',
    title: 'Text to PDF Converter — Convert Plain Text to PDF Free',
    navTitle: 'Text to PDF',
    description: 'Convert text, notes, and articles into clean, formatted, printable PDF documents. Customize fonts, margins, page orientation, and numbering.',
    icon: '📝',
    path: '/text-to-pdf.html',
    filename: 'text-to-pdf.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['A4, Letter & Legal Paper Sizes', 'Portrait & Landscape Orientation', 'Customizable Typography & Margins', 'Multi-Page Auto Pagination', 'Instant PDF Download', '100% Client-Side'],
    faq: [
      {
        question: 'Does it support multi-page text documents?',
        answer: 'Yes! The converter automatically flows long text across multiple pages cleanly without cutting off lines.'
      },
      {
        question: 'Can I customize font styling and margins?',
        answer: 'Yes, you can choose fonts, sizes, line heights, text colors, and margin presets.'
      }
    ]
  },
  {
    id: 'signature-maker',
    title: 'Online Signature Maker — Create Digital Signatures Free',
    navTitle: 'Signature Maker',
    description: 'Create beautiful digital signatures online. Draw with mouse/stylus, type in elegant cursive fonts, or scan and extract signatures with transparent backgrounds.',
    icon: '✍️',
    path: '/signature-maker.html',
    filename: 'signature-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Smooth Vector Drawing Canvas', 'Elegant Handwriting Cursive Fonts', 'Scan Background Removal', 'Transparent PNG & Solid JPG Export', 'Auto-Crop Empty Margins', '100% Private'],
    faq: [
      {
        question: 'Can I download my signature with a transparent background?',
        answer: 'Yes, select "Transparent" background and download as PNG.'
      },
      {
        question: 'Are digital signatures created here legally valid?',
        answer: 'They are commonly accepted for business agreements, emails, and online forms. Check local laws for specific formal contract requirements.'
      }
    ]
  },
  {
    id: 'signature-resizer',
    title: 'Signature Resizer — Resize Signature Images Online Free',
    navTitle: 'Signature Resizer',
    description: 'Resize signature images to exact width, height, and KB file size limits for job portals, government exam forms, and visa applications.',
    icon: '📏',
    path: '/signature-resizer.html',
    filename: 'signature-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Pixel, CM, MM & Inch Dimensions', 'Official Exam & Passport Presets', 'Target File Size Limiter (KB)', 'Auto-Crop Empty Margins', 'Transparent & White Backgrounds', '100% Browser-Side'],
    faq: [
      {
        question: 'Can I resize my signature to under 20KB or 50KB?',
        answer: 'Yes, select the Target File Size Limit option to ensure your file meets strict portal requirements.'
      },
      {
        question: 'What units are supported?',
        answer: 'You can specify dimensions in pixels (px), centimeters (cm), millimeters (mm), or inches (in).'
      }
    ]
  },
  {
    id: 'photo-signature-joiner',
    title: 'Photo and Signature Joiner — Combine Images Online Free',
    navTitle: 'Photo + Signature Joiner',
    description: 'Combine your passport photo and signature into a single composite image for online job applications, entrance examinations, and identity verification.',
    icon: '🪪',
    path: '/photo-signature-joiner.html',
    filename: 'photo-signature-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Vertical (Stacked) & Side-by-Side Layouts', 'Custom Dimension Controls', 'Exam & Passport Card Presets', 'Borders & Spacing Options', 'High-Res JPG & PNG Export', '100% Client-Side'],
    faq: [
      {
        question: 'Why do government and exam portals require photo + signature joined?',
        answer: 'Many recruitment and entrance examination boards require a single unified image file containing both the candidate photo and signature to prevent mismatches.'
      },
      {
        question: 'Can I customize the gap and border?',
        answer: 'Yes, you have full control over image dimensions, gap spacing, outer border, and background color.'
      }
    ]
  },
  {
    id: 'photo-name-date-joiner',
    title: 'Add Name and Date to Photo Online — Exam Photo Maker',
    navTitle: 'Photo Name & Date',
    description: 'Add candidate name and date of photo (DOP/DOB) to passport photos for competitive entrance exams, recruitment portals, and official applications.',
    icon: '📅',
    path: '/photo-name-date-joiner.html',
    filename: 'photo-name-date-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Custom Candidate Name & Date Formatting', 'Bottom Strip, Top Strip & Overlay Modes', 'Standard Recruitment Exam Compliance', 'High-Resolution Vector Typography', '100% Private Client-Side'],
    faq: [
      {
        question: 'What is DOP and DOB on candidate photos?',
        answer: 'DOP stands for Date of Photo (when the photo was taken), while DOB stands for Date of Birth. Many exam portals specify including this at the bottom of the photo.'
      },
      {
        question: 'Can I change the date format?',
        answer: 'Yes, choose from DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, or DD-MMM-YYYY.'
      }
    ]
  },
  {
    id: 'text-to-handwriting',
    title: 'Text to Handwriting Converter — Create Realistic Handwritten Notes',
    navTitle: 'Text to Handwriting',
    description: 'Convert typed digital text into realistic handwritten notes on lined, plain, or vintage paper. Export high-res PNGs or multi-page PDFs.',
    icon: '🖋️',
    path: '/text-to-handwriting.html',
    filename: 'text-to-handwriting.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['5 Realistic Handwriting Font Styles', 'Gel Blue, Navy, Black & Red Ink Options', 'College Ruled Lined, Grid & Vintage Paper', 'Natural Human Baseline Jitter', 'Multi-Page PDF & PNG Export', '100% Client-Side'],
    faq: [
      {
        question: 'Can I export multi-page assignments as a single PDF?',
        answer: 'Yes! The tool automatically paginates your text across multiple pages and lets you download a unified multi-page PDF.'
      },
      {
        question: 'Does it look authentic and natural?',
        answer: 'Yes, it uses organic cursive scripts, authentic ruled margins, and optional natural baseline jitter to simulate organic penmanship.'
      }
    ]
  },
  {
    id: 'omr-sheet-generator',
    title: 'OMR Sheet Generator — Create Printable OMR Answer Sheets Free',
    navTitle: 'OMR Sheet Generator',
    description: 'Generate and print standardized OMR answer sheets and answer keys for exams, tests, quizzes, and mock assessments. Download high-res PDF & PNG.',
    icon: '🎯',
    path: '/omr-sheet-generator.html',
    filename: 'omr-sheet-generator.html',
    category: '💼 Business Tools',
    badge: 'New',
    features: ['20 to 200 Question Layouts', '4, 5, or 6 Options per Question', 'Custom Institute & Exam Header', 'Roll Number & Booklet Code Blocks', 'Blank Sheets & Answer Key Generator', 'Print-Ready Vector PDF Output'],
    faq: [
      {
        question: 'Can this generate answer keys with marked correct answers?',
        answer: 'Yes! Toggle to "Teacher Answer Key" mode, click the correct option bubbles, and download a pre-filled answer key sheet.'
      },
      {
        question: 'What paper size does this print on?',
        answer: 'The sheets are sized for standard international A4 paper at print-ready resolution.'
      }
    ]
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter — Convert PDF to Editable DOCX Online Free',
    navTitle: 'PDF to Word',
    description: 'Convert PDF documents to editable Microsoft Word (.docx) files directly in your browser. 100% private with client-side text and layout extraction.',
    icon: '📄',
    path: '/pdf-to-word.html',
    filename: 'pdf-to-word.html',
    category: '📄 PDF Tools',
    badge: 'Popular',
    features: ['Client-Side DOCX Generation', 'Preserves Text & Paragraphs', 'Page Range Selection', 'Zero Server Uploads', 'Instant Download'],
    faq: [
      {
        question: 'How does PDF to Word conversion work without uploading?',
        answer: 'Zubware parses text elements directly in browser WebAssembly memory and constructs a valid OpenXML Word document (.docx) package locally.'
      },
      {
        question: 'Can I edit the generated Word file in Microsoft Word and Google Docs?',
        answer: 'Yes! The exported .docx file is 100% compatible with Microsoft Word, LibreOffice, and Google Docs.'
      }
    ]
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF Converter — Convert DOCX to PDF Online Free',
    navTitle: 'Word to PDF',
    description: 'Convert Microsoft Word (.docx) documents to PDF files directly in your browser with zero server uploads and instant export.',
    icon: '📝',
    path: '/word-to-pdf.html',
    filename: 'word-to-pdf.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['DOCX to PDF Conversion', 'Standard A4 Page Sizing', 'Custom Margins & Fonts', '100% Local Processing', 'Instant Download'],
    faq: [
      {
        question: 'Are my Word files uploaded to any server?',
        answer: 'No. The DOCX file is unzipped and converted to PDF using browser-based PDF generation.'
      }
    ]
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text Converter — Extract Text from PDF with OCR Online Free',
    navTitle: 'PDF to Text',
    description: 'Extract raw text from PDF documents using digital text extraction or client-side Tesseract OCR for scanned documents.',
    icon: '📑',
    path: '/pdf-to-text.html',
    filename: 'pdf-to-text.html',
    category: '📄 PDF Tools',
    badge: 'OCR',
    features: ['Digital Text & OCR Modes', 'Multi-Language OCR Support', 'Per-Page Text Breakdown', 'Copy to Clipboard', 'Export as .txt'],
    faq: [
      {
        question: 'Can this read scanned PDFs?',
        answer: 'Yes! Toggle OCR Mode to run client-side Tesseract.js optical character recognition on scanned pages.'
      }
    ]
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel Converter — Extract Tables to XLSX Online Free',
    navTitle: 'PDF to Excel',
    description: 'Extract tabular data and structured text from PDF reports into Microsoft Excel (.xlsx) spreadsheets locally.',
    icon: '📊',
    path: '/pdf-to-excel.html',
    filename: 'pdf-to-excel.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['PDF Table Detection', 'Clean XLSX & CSV Export', 'Live Spreadsheet Preview', 'Zero Server Uploads', 'Multi-Page Support'],
    faq: [
      {
        question: 'Does this convert multi-column tables?',
        answer: 'Yes, our extraction engine analyzes spatial coordinate bounding boxes to align columns into spreadsheet rows.'
      }
    ]
  },
  {
    id: 'pdf-page-number',
    title: 'Add Page Numbers to PDF Online Free — Number PDF Pages',
    navTitle: 'Add Page Numbers',
    description: 'Insert customizable page numbers into your PDF files. Choose custom formats, positions, margins, fonts, and skip the cover page.',
    icon: '🔢',
    path: '/pdf-page-number.html',
    filename: 'pdf-page-number.html',
    category: '📄 PDF Tools',
    badge: 'Free',
    features: ['Custom Number Formats (e.g. Page X of Y)', '6 Position Placements', 'Skip First Page / Cover', 'Custom Starting Number', 'Zero Server Uploads'],
    faq: [
      {
        question: 'Can I choose where page numbers appear?',
        answer: 'Yes, place them at bottom-center, bottom-right, bottom-left, top-right, top-center, or top-left.'
      }
    ]
  },
  {
    id: 'pdf-compare',
    title: 'PDF Compare Tool — Compare Two PDF Files Side-by-Side Online',
    navTitle: 'Compare PDFs',
    description: 'Compare two versions of a PDF document to find changes, additions, and deletions with side-by-side diff highlighting.',
    icon: '⚖️',
    path: '/pdf-compare.html',
    filename: 'pdf-compare.html',
    category: '📄 PDF Tools',
    badge: 'Diff',
    features: ['Side-by-Side Comparison', 'Color-Coded Additions & Deletions', 'Similarity Percentage Score', 'Page Text Extraction', '100% Client-Side'],
    faq: [
      {
        question: 'How are differences shown?',
        answer: 'Additions are highlighted in green, deletions in red, and identical text in neutral gray.'
      }
    ]
  },
  {
    id: 'pdf-signature',
    title: 'Sign PDF Online Free — Electronic Signature & Stamp for PDF',
    navTitle: 'Sign PDF',
    description: 'Sign PDF documents electronically in your browser. Draw your signature, type with signature fonts, or upload a signature stamp image.',
    icon: '✍️',
    path: '/pdf-signature.html',
    filename: 'pdf-signature.html',
    category: '📄 PDF Tools',
    badge: 'Popular',
    features: ['Draw, Type, or Upload Signature', 'Interactive Drag & Resize Placement', 'Multi-Page Selection', 'High Quality Vector Embedding', '100% Private'],
    faq: [
      {
        question: 'Are my signatures legally valid?',
        answer: 'Electronic signatures placed on PDFs are widely used for informal agreements, approvals, and invoices.'
      }
    ]
  },
  {
    id: 'barcode-generator',
    title: 'Free Barcode Generator — Create Code 128, EAN-13, UPC Barcodes',
    navTitle: 'Barcode Generator',
    description: 'Generate high-resolution vector and raster barcodes for retail, shipping, and inventory in Code 128, EAN-13, UPC-A, Code 39, and more.',
    icon: '🏷️',
    path: '/barcode-generator.html',
    filename: 'barcode-generator.html',
    category: '💼 Business Tools',
    badge: 'Free',
    features: ['10+ Barcode Formats', 'SVG & PNG Download', 'Custom Dimensions & Colors', 'Show / Hide Text Label', 'Print Ready'],
    faq: [
      {
        question: 'Which barcode format is best for retail products?',
        answer: 'EAN-13 is standard globally (outside North America), while UPC-A is standard in the US and Canada.'
      }
    ]
  },
  {
    id: 'case-converter',
    title: 'Case Converter — Uppercase, Lowercase, Title Case, CamelCase',
    navTitle: 'Case Converter',
    description: 'Convert text case instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    icon: '🔠',
    path: '/case-converter.html',
    filename: 'case-converter.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['8+ Case Formats', 'One-Click Conversion', 'Live Character Counter', 'Instant Copy & Download', 'Zero Server Uploads']
  },
  {
    id: 'word-counter',
    title: 'Word Counter & Character Counter — Readability & Speaking Time',
    navTitle: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in real time with Flesch reading score, reading time, and speaking time calculations.',
    icon: '📝',
    path: '/word-counter.html',
    filename: 'word-counter.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Popular',
    features: ['Real-Time Word & Char Count', 'Reading & Speaking Duration', 'Flesch Readability Score', 'Sentence & Paragraph Stats', 'Instant Copy']
  },
  {
    id: 'character-counter',
    title: 'Character Counter — Letters, Numbers & Symbol Statistics',
    navTitle: 'Character Counter',
    description: 'Analyze precise character counts, spaces, alphanumeric letters, digits, and special punctuation in your copy.',
    icon: '🔢',
    path: '/character-counter.html',
    filename: 'character-counter.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Detailed Character Breakdown', 'With & Without Spaces', 'Alphanumeric Ratio', 'Copy & Reset', '100% Client-Side']
  },
  {
    id: 'reading-time-calculator',
    title: 'Reading Time Calculator — Estimate Reading & Speaking Duration',
    navTitle: 'Reading Time Calculator',
    description: 'Estimate how long it will take an audience to read or listen to your blog post, speech, presentation, or script.',
    icon: '⏱️',
    path: '/reading-time-calculator.html',
    filename: 'reading-time-calculator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Custom Words-Per-Minute Slider', 'Silent Reading & Speaking Estimates', 'Fast / Average / Slow Speed Tiers', 'File Upload Support', 'Live Word Count']
  },
  {
    id: 'remove-duplicate-lines',
    title: 'Remove Duplicate Lines — Deduplicate Text Lists Online',
    navTitle: 'Remove Duplicate Lines',
    description: 'Deduplicate lines of text, email lists, keywords, and code lists instantly with case sensitivity and trimming options.',
    icon: '🧹',
    path: '/remove-duplicate-lines.html',
    filename: 'remove-duplicate-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Case-Sensitive / Insensitive', 'Trim Whitespace Option', 'Duplicate Removal Stats', 'Export Cleaned File', 'Instant Copy']
  },
  {
    id: 'remove-empty-lines',
    title: 'Remove Empty Lines — Strip Blank Lines & Whitespace Online',
    navTitle: 'Remove Empty Lines',
    description: 'Remove blank lines, unnecessary carriage returns, and normalize paragraph spacing in messy text files.',
    icon: '🗑️',
    path: '/remove-empty-lines.html',
    filename: 'remove-empty-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Strip All Blank Lines', 'Collapse Multiple Blanks to Single', 'Trim Whitespace Option', 'Instant Copy', 'Zero Server Uploads']
  },
  {
    id: 'find-and-replace',
    title: 'Find and Replace Text Online — Batch Replace with Regex Support',
    navTitle: 'Find and Replace',
    description: 'Find and replace words, phrases, or regex patterns across long text documents with live match counter and replacement preview.',
    icon: '🔍',
    path: '/find-and-replace.html',
    filename: 'find-and-replace.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Exact Match & Regular Expressions', 'Case Sensitivity Toggle', 'Live Match Counter', 'Undo / Reset History', 'Download Output']
  },
  {
    id: 'text-compare',
    title: 'Text Compare Tool — Online Diff Checker & Text Difference',
    navTitle: 'Text Compare',
    description: 'Compare two text snippets side-by-side or inline to visually spot differences, additions, and edits.',
    icon: '⚖️',
    path: '/text-compare.html',
    filename: 'text-compare.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Diff',
    features: ['Character & Line Diff', 'Color-Coded Highlights', 'Difference Counter', 'Swap Text Panels', '100% Private']
  },
  {
    id: 'text-cleaner',
    title: 'Text Cleaner — Remove Extra Spaces, Tabs, HTML Tags & Empty Lines',
    navTitle: 'Text Cleaner',
    description: 'Clean up sloppy, formatted, or copied text by stripping HTML tags, redundant spaces, tabs, duplicate lines, and weird unicode characters.',
    icon: '🧼',
    path: '/text-cleaner.html',
    filename: 'text-cleaner.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Popular',
    features: ['Strip HTML & XML Tags', 'Remove Extra Spaces & Tabs', 'Remove Duplicate Lines', 'Normalize Line Breaks', 'One-Click Clean']
  },
  {
    id: 'sort-lines',
    title: 'Sort Lines Online — Alphabetical, Numeric & Reverse Line Sorter',
    navTitle: 'Sort Lines',
    description: 'Sort lines of text alphabetically (A-Z or Z-A), numerically (0-9), by length, or randomly shuffle lines with duplicate removal.',
    icon: '🔃',
    path: '/sort-lines.html',
    filename: 'sort-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['A-Z & Z-A Alphabetical', 'Numeric 0-9 Ascending & Descending', 'Sort by Line Length', 'Random Shuffle & Reverse', 'Remove Duplicate Lines']
  },
  {
    id: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator — Dummy Placeholder Text Generator',
    navTitle: 'Lorem Ipsum Generator',
    description: 'Generate customizable Latin dummy text by paragraphs, sentences, or word counts for web design and mockup layouts.',
    icon: '📜',
    path: '/lorem-ipsum-generator.html',
    filename: 'lorem-ipsum-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: ['Paragraphs, Sentences, or Words', 'Start with "Lorem Ipsum" Toggle', 'One-Click Copy', 'Download as .txt', 'Fast & Lightweight']
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor & Live Previewer — Export MD, HTML & Text',
    navTitle: 'Markdown Editor',
    description: 'Full-featured online Markdown editor with instant side-by-side HTML preview, formatting toolbar, and multi-format download.',
    icon: '🖋️',
    path: '/markdown-editor.html',
    filename: 'markdown-editor.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Popular',
    features: ['Side-by-Side Live Preview', 'Formatting Toolbar Shortcuts', 'Table & Code Block Support', 'Export as .md, .html, or .txt', '100% Client-Side']
  },
  {
    id: 'json-minifier',
    title: 'JSON Minifier & Compressor — Minify JSON Online Free',
    navTitle: 'JSON Minifier',
    description: 'Minify, compress, and strip unneeded whitespace and line breaks from JSON documents to reduce payload size.',
    icon: '⚡',
    path: '/json-minifier.html',
    filename: 'json-minifier.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Free',
    features: ['Whitespace & Indent Stripping', 'Compression Ratio Calculator', 'Syntax Error Highlighting', 'File Upload & Drag-and-Drop', 'Instant Copy']
  },
  {
    id: 'json-to-xml',
    title: 'JSON to XML Converter — Transform JSON to XML Online Free',
    navTitle: 'JSON to XML',
    description: 'Transform JSON data structures into clean, standardized XML documents with customizable root and item element names.',
    icon: '🔄',
    path: '/json-to-xml.html',
    filename: 'json-to-xml.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Free',
    features: ['Custom Root & Item Tag Names', 'Beautified XML Output', 'Attributes Support', 'Download as .xml', '100% Client-Side']
  },
  {
    id: 'xml-to-json',
    title: 'XML to JSON Converter — Convert XML Structure to JSON Online',
    navTitle: 'XML to JSON',
    description: 'Parse and convert XML feeds and document structures into clean, formatted JSON data objects directly in your browser.',
    icon: '🔀',
    path: '/xml-to-json.html',
    filename: 'xml-to-json.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Free',
    features: ['Preserves Hierarchy & Attributes', 'Formatted 2-Space JSON', 'Syntax Error Detection', 'Download as .json', 'Instant Copy']
  },
  {
    id: 'markdown-to-html',
    title: 'Markdown to HTML Converter — Parse Markdown to Clean HTML',
    navTitle: 'Markdown to HTML',
    description: 'Convert Markdown syntax (.md) into clean, semantic HTML markup with live preview and syntax-highlighted code output.',
    icon: '📄',
    path: '/markdown-to-html.html',
    filename: 'markdown-to-html.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Free',
    features: ['Headers, Lists, Tables & Code', 'Full Document or Snippet Mode', 'Live Visual HTML Preview', 'Copy HTML Code', 'Export as .html']
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter & Beautifier — Format SQL Queries Online Free',
    navTitle: 'SQL Formatter',
    description: 'Format, beautify, and indent SQL queries with customizable uppercase keywords, indentation, and support for MySQL, Postgres, SQLite, and T-SQL.',
    icon: '🗄️',
    path: '/sql-formatter.html',
    filename: 'sql-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Free',
    features: ['Uppercase SQL Keywords', '2 or 4 Space Indentation', 'Multi-Dialect Support', 'Minify & Beautify Modes', 'Instant Copy']
  },
  {
    id: 'jwt-generator',
    title: 'JWT Generator & Signer — Create Signed JSON Web Tokens Online',
    navTitle: 'JWT Generator',
    description: 'Create and cryptographically sign JSON Web Tokens (JWT) using HS256, HS384, or HS512 with custom headers, claims, and expiry.',
    icon: '🛡️',
    path: '/jwt-generator.html',
    filename: 'jwt-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Security',
    features: ['HS256, HS384, HS512 HMAC Signing', 'Custom Header & Payload Claims', 'Quick Expiry Presets', 'Color-Coded Token Inspection', '100% Client-Side']
  },
  {
    id: 'cron-expression-generator',
    title: 'Cron Expression Generator & Explainer — Schedule Builder',
    navTitle: 'Cron Generator',
    description: 'Build, translate, and explain 5-part Unix cron schedule expressions into plain English with upcoming execution time predictions.',
    icon: '⏱️',
    path: '/cron-expression-generator.html',
    filename: 'cron-expression-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Plain English Explanation', 'Interactive Field Builders', 'Popular Schedule Presets', 'Next 5 Scheduled Runs', 'Instant Copy']
  },
  {
    id: 'hex-color-generator',
    title: 'Hex Color Code Generator — Random HTML & CSS Palette',
    navTitle: 'Hex Color Generator',
    description: 'Generate beautiful random hex color codes, color shades, tints, and complementary color schemes with one-click CSS copy.',
    icon: '🎨',
    path: '/hex-color-generator.html',
    filename: 'hex-color-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Design',
    features: ['Random Hex Generator', 'Color Shades & Tints', 'Color Harmonies', 'RGB & HSL Conversion', 'Instant CSS Copy']
  },
  {
    id: 'rgb-color-generator',
    title: 'RGB Color Code Generator & Hex Slider Converter',
    navTitle: 'RGB Color Generator',
    description: 'Interactive RGB color sliders with real-time Hex, HSL, CSS conversion, and live color canvas previews.',
    icon: '🌈',
    path: '/rgb-color-generator.html',
    filename: 'rgb-color-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Design',
    features: ['Red, Green, Blue Sliders', 'Hex & HSL Conversion', 'Complementary Colors', 'Preset Color Swatches', 'One-Click Copy']
  },
  {
    id: 'random-name-picker',
    title: 'Random Name Picker — Lucky Draw & Raffle Winner Wheel',
    navTitle: 'Random Name Picker',
    description: 'Pick random winners from any list of names or entries. Perfect for classroom activities, sweepstakes, giveaways, and raffles.',
    icon: '🎯',
    path: '/random-name-picker.html',
    filename: 'random-name-picker.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Fun',
    features: ['Custom Name Lists', 'Unique Winner Elimination', 'Multi-winner Drawing', 'Sound & Confetti FX', '100% Client-Side']
  },
  {
    id: 'calorie-calculator',
    title: 'Daily Calorie Intake Calculator — BMR & Weight Loss Goal',
    navTitle: 'Calorie Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to plan weight loss, maintenance, or muscle gain.',
    icon: '🥗',
    path: '/calorie-calculator.html',
    filename: 'calorie-calculator.html',
    category: '💪 Health & Fitness',
    badge: 'Health',
    features: ['Mifflin-St Jeor Formula', 'Activity Multipliers', 'Weight Loss & Gain Targets', 'Macronutrient Split Breakdown', 'BMI Estimation']
  },
  {
    id: 'business-name-generator',
    title: 'Business Name Generator — Creative Brand & Startup Ideas',
    navTitle: 'Business Name Gen',
    description: 'Generate hundreds of catchy, modern, and memorable company brand names for your new startup, online store, or business venture.',
    icon: '💡',
    path: '/business-name-generator.html',
    filename: 'business-name-generator.html',
    category: '💼 Business Tools',
    badge: 'Popular',
    features: ['Industry & Style Filtering', 'Prefix & Suffix Combinations', 'Domain Availability Checks', 'Favorite Names List', 'Instant Clipboard Copy']
  },
  {
    id: 'brand-name-generator',
    title: 'Brand Name Generator — Catchy Company & Domain Names',
    navTitle: 'Brand Name Gen',
    description: 'Create unique, premium, and creative brand identity names with linguistic morphemes, blended words, and modern tech vibes.',
    icon: '✨',
    path: '/brand-name-generator.html',
    filename: 'brand-name-generator.html',
    category: '💼 Business Tools',
    badge: 'Creative',
    features: ['Tech & Luxury Vibe Filters', 'Portmanteau Word Blend', 'Vowel Harmony Engine', 'One-Click Shortlisting', 'Brand Identity Inspiration']
  },
  {
    id: 'coin-flip',
    title: 'Online Coin Flip Simulator — 3D Heads or Tails Toss',
    navTitle: 'Coin Flip',
    description: 'Realistic 3D coin toss simulator with heads/tails streak statistics, multiple coin flips, and sound effects for unbiased decision making.',
    icon: '🪙',
    path: '/coin-flip.html',
    filename: 'coin-flip.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['3D Coin Animation', 'Multi-coin Flips', 'Heads vs Tails History', 'Probability Statistics', 'Audio Effects']
  },
  {
    id: 'json-viewer',
    title: 'JSON Viewer & Tree Formatter — Interactive Object Inspector',
    navTitle: 'JSON Viewer',
    description: 'Inspect, validate, and navigate complex JSON data structures with collapsible tree views, search filters, and syntax highlighting.',
    icon: '🔍',
    path: '/json-viewer.html',
    filename: 'json-viewer.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Collapsible Tree Nodes', 'Syntax Validation', 'Key/Value Search', 'Minify & Beautify', 'Copy JSON Paths']
  },
  {
    id: 'name-picker-wheel',
    title: 'Name Picker Wheel — Random Raffle & Prize Spinner',
    navTitle: 'Picker Wheel',
    description: 'Spin the customizable lucky wheel to pick a random name, winner, decision, or team member with celebratory animations.',
    icon: '🎡',
    path: '/name-picker-wheel.html',
    filename: 'name-picker-wheel.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Interactive',
    features: ['Colorful Spinning Wheel', 'Custom Slice Names', 'Remove Winner on Spin', 'Confetti Celebration', 'Custom Weights']
  },
  {
    id: 'loan-eligibility-calculator',
    title: 'Loan Eligibility Calculator — FOIR & Maximum Borrow Limit',
    navTitle: 'Loan Eligibility',
    description: 'Calculate how much home loan or personal loan you can borrow based on monthly income, existing EMIs, FOIR, and interest rates.',
    icon: '🏦',
    path: '/loan-eligibility-calculator.html',
    filename: 'loan-eligibility-calculator.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['FOIR Limit Adjustment', 'Existing Obligations', 'Tenure & Rate Customization', 'Maximum EMI & Loan Amount', 'Amortization Overview']
  },
  {
    id: 'countdown-calculator',
    title: 'Countdown Calculator — Exact Days, Hours & Event Timer',
    navTitle: 'Countdown Calc',
    description: 'Count down exact days, hours, minutes, and seconds until any date, wedding, vacation, milestone, or special holiday event.',
    icon: '⏳',
    path: '/countdown-calculator.html',
    filename: 'countdown-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['Live Millisecond Countdown', 'Working Days Calculation', 'Milestone Presets', 'Shareable Event Card', 'Custom Background Themes']
  },
  {
    id: 'online-stopwatch',
    title: 'Online Stopwatch — Millisecond Precision Lap Timer',
    navTitle: 'Online Stopwatch',
    description: 'Free online stopwatch with millisecond precision, split lap times, keyboard shortcuts (Space, L, R), and exportable lap history.',
    icon: '⏱️',
    path: '/online-stopwatch.html',
    filename: 'online-stopwatch.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['Millisecond Precision', 'Split Lap Times', 'Keyboard Shortcuts (Space/L/R)', 'Lap History Export', '100% Client-Side Safe']
  },
  {
    id: 'countdown-timer',
    title: 'Countdown Timer — Online Timer with Custom Alarm Chime',
    navTitle: 'Countdown Timer',
    description: 'Accurate online countdown timer with quick presets (10s to 1h), custom duration hours/minutes/seconds, Web Audio alert chime, and optional desktop alerts.',
    icon: '⏲️',
    path: '/countdown-timer.html',
    filename: 'countdown-timer.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['Quick Duration Presets (10s–1h)', 'Custom Hours, Minutes & Seconds', 'Web Audio Alert Chime', 'Desktop Notifications', 'Background Tab Accuracy']
  },
  {
    id: 'online-clock',
    title: 'Online Clock & World Clock — Accurate Current Local Time',
    navTitle: 'Online Clock',
    description: 'Accurate real-time digital clock and multi-city world clock displaying current local time, UTC offsets, day/night indicators, and DST.',
    icon: '🌐',
    path: '/online-clock.html',
    filename: 'online-clock.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['Accurate Local Digital Clock', '10+ Major World Cities Clocks', '12-Hour & 24-Hour Formats', 'Searchable Global City Directory', 'Automatic DST Synchronization']
  },
  {
    id: 'time-zone-converter',
    title: 'Time Zone Converter — World Meeting & Time Zone Planner',
    navTitle: 'Time Zone Converter',
    description: 'Convert date and time across multiple world time zones with automatic Daylight Saving Time (DST) tracking, 12h/24h toggle, and side-by-side city comparison.',
    icon: '🌍',
    path: '/time-zone-converter.html',
    filename: 'time-zone-converter.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: ['Multi-zone Comparison', 'Automatic DST Adjustment', '12h & 24h Formats', 'Day/Night & Day Diff Tags', 'Instant Schedule Sharing']
  },
  {
    id: 'dice-roller',
    title: '3D Dice Roller Simulator — Multi-Dice D6, D20 & D100',
    navTitle: 'Dice Roller',
    description: 'Roll virtual dice for tabletop RPGs, D&D, board games, and probability tests. Supports D4, D6, D8, D10, D12, D20, and D100.',
    icon: '🎲',
    path: '/dice-roller.html',
    filename: 'dice-roller.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Fun',
    features: ['RPG Dice (D4 to D100)', 'Sum Totals & Modifiers', 'Roll History & Logs', 'Physical Physics Toss', 'Multiple Dice Sets']
  },
  {
    id: 'down-payment-calculator',
    title: 'Down Payment Calculator — Mortgage Savings & Upfront Cash',
    navTitle: 'Down Payment Calc',
    description: 'Calculate how much down payment cash you need for buying a house or car, PMI avoidance threshold, and monthly savings timelines.',
    icon: '🏡',
    path: '/down-payment-calculator.html',
    filename: 'down-payment-calculator.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['20% PMI Avoidance Check', 'Target Date Savings Timeline', 'Loan-to-Value (LTV) Ratio', 'Closing Cost Estimation', 'Home & Auto Presets']
  },
  {
    id: 'cement-calculator',
    title: 'Cement Concrete Calculator — Bags, Sand & Gravel Volume',
    navTitle: 'Cement Calculator',
    description: 'Calculate the number of 50kg cement bags, sand cubic feet, and gravel aggregate needed for slabs, footings, and columns.',
    icon: '🏗️',
    path: '/cement-calculator.html',
    filename: 'cement-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Engineering',
    features: ['Standard Mix Ratios (M15, M20, M25)', 'Metric & Imperial Units', 'Dry Volume Factor (1.54)', '50kg Bag Conversion', 'Material Cost Estimates']
  },
  {
    id: 'wavelength-calculator',
    title: 'Wavelength Calculator — Light & Radio Wave Frequency',
    navTitle: 'Wavelength Calc',
    description: 'Calculate electromagnetic wavelength, frequency, wave speed, and photon energy across radio, microwave, optical, and X-ray spectrums.',
    icon: '〰️',
    path: '/wavelength-calculator.html',
    filename: 'wavelength-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Science',
    features: ['Light & Sound Wave Speeds', 'Spectrum Band Identification', 'Photon Energy (eV & Joules)', 'Scientific Notation Input', 'Instant Unit Switching']
  },
  {
    id: 'user-agent-parser',
    title: 'User Agent Parser — Browser, Device & OS Header Lookup',
    navTitle: 'UA Parser',
    description: 'Parse browser User-Agent strings to detect browser family, layout engine, operating system version, and mobile device hardware model.',
    icon: '🕵️',
    path: '/user-agent-parser.html',
    filename: 'user-agent-parser.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Live Browser UA Detection', 'Hardware & OS Extraction', 'Engine & Architecture Info', 'Copy Clean JSON Spec', 'Common Device Presets']
  },
  {
    id: 'mode-calculator',
    title: 'Mode Calculator — Statistical Dataset & Frequency Counter',
    navTitle: 'Mode Calculator',
    description: 'Find the statistical mode, bimodal/multimodal values, and full frequency table for any raw numeric or categorical dataset.',
    icon: '📊',
    path: '/mode-calculator.html',
    filename: 'mode-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Math',
    features: ['Multimodal Detection', 'Frequency Table Distribution', 'Mean & Median Summary', 'Comma/Space Delimited Inputs', 'Copy Statistical Summary']
  },
  {
    id: 'inductance-calculator',
    title: 'Inductance Calculator — Coil Turns & Solenoid Formula',
    navTitle: 'Inductance Calc',
    description: 'Calculate electrical inductance (Henry, mH, µH) of single-layer air-core and magnetic core coils using Wheeler and Solenoid formulas.',
    icon: '🧲',
    path: '/inductance-calculator.html',
    filename: 'inductance-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Electronics',
    features: ['Air-Core Solenoids', 'Magnetic Permeability (µr)', 'Wire Length & Resistance', 'Wheeler Approximation', 'µH, mH, Henry Outputs']
  },
  {
    id: 'random-letter-generator',
    title: 'Random Letter Generator — Alphabet Picker & Word Games',
    navTitle: 'Random Letter Gen',
    description: 'Pick random letters from the English alphabet with uppercase, lowercase, vowel/consonant filtering, and word game modes (Scrabble/Boggle).',
    icon: '🔤',
    path: '/random-letter-generator.html',
    filename: 'random-letter-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Fun',
    features: ['Vowel & Consonant Filtering', 'Unique Letter Drawings', 'Scrabble Letter Frequencies', 'Batch Letter Output', 'One-Click Clipboard Copy']
  },
  {
    id: 'water-intake-calculator',
    title: 'Daily Water Intake Calculator — Hydration Needs by Weight',
    navTitle: 'Water Intake Calc',
    description: 'Calculate how many liters or ounces of water you should drink daily based on your body weight, workout intensity, and climate.',
    icon: '💧',
    path: '/water-intake-calculator.html',
    filename: 'water-intake-calculator.html',
    category: '💪 Health & Fitness',
    badge: 'Health',
    features: ['Weight & Activity Modifiers', 'Hot Climate Adjustments', 'Standard Glass Counters', 'Metric & Imperial Units', 'Hourly Hydration Schedule']
  },
  {
    id: 'json-to-yaml',
    title: 'JSON to YAML Converter — Format Configs & Data Online',
    navTitle: 'JSON to YAML',
    description: 'Convert JSON objects into clean, indented YAML data structures for Kubernetes manifests, Docker Compose, and CI/CD pipelines.',
    icon: '🔁',
    path: '/json-to-yaml.html',
    filename: 'json-to-yaml.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Bidirectional Conversion', 'Syntax Error Detection', 'Indentation Control', 'Download YAML File', '100% Client-Side Safe']
  },
  {
    id: 'url-extractor',
    title: 'URL Extractor — Scrape & Filter Web Links from Raw Text',
    navTitle: 'URL Extractor',
    description: 'Extract, deduplicate, and clean all HTTP/HTTPS website links and URLs from unformatted text, HTML source code, and documents.',
    icon: '🔗',
    path: '/url-extractor.html',
    filename: 'url-extractor.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Text',
    features: ['Deduplicate Links', 'Domain Name Filtering', 'CSV & Plaintext Export', 'Remove Query Strings', 'Fast Regex Engine']
  },
  {
    id: 'bond-yield-calculator',
    title: 'Bond Yield Calculator — Current Yield & YTM Valuation',
    navTitle: 'Bond Yield Calc',
    description: 'Calculate bond current yield, Yield to Maturity (YTM), and semi-annual coupon payments for treasury, corporate, and municipal bonds.',
    icon: '📈',
    path: '/bond-yield-calculator.html',
    filename: 'bond-yield-calculator.html',
    category: '💼 Business Tools',
    badge: 'Investing',
    features: ['Yield to Maturity (YTM)', 'Current Yield vs Coupon', 'Premium / Discount Indicator', 'Annual Cash Flow Schedule', 'Maturity Value Analysis']
  },
  {
    id: 'cat-age-calculator',
    title: 'Cat Age Calculator — Convert Feline Years to Human Age',
    navTitle: 'Cat Age Calc',
    description: 'Accurately convert your cat or kitten age into human equivalent years based on veterinary life stages (kitten, junior, adult, senior).',
    icon: '🐱',
    path: '/cat-age-calculator.html',
    filename: 'cat-age-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Pets',
    features: ['Veterinary Life Stages', 'Kitten & Senior Care Tips', 'Human Age Equivalency', 'Indoor vs Outdoor Adjustments', 'Health Milestone Guide']
  },
  {
    id: 'exam-score-calculator',
    title: 'Exam Score Calculator — Test Grade & Percentage Marks',
    navTitle: 'Exam Score Calc',
    description: 'Calculate your test score percentage, letter grade (A-F), GPA points, and required points needed on final exams to pass.',
    icon: '📝',
    path: '/exam-score-calculator.html',
    filename: 'exam-score-calculator.html',
    category: '💼 Career Tools',
    badge: 'Academic',
    features: ['Letter Grade Conversion', 'Target Grade Goal Solver', 'Weighted Grading Scale', 'Wrong Answer Analysis', 'Pass / Fail Thresholds']
  },
  {
    id: 'cgpa-calculator',
    title: 'CGPA to Percentage Calculator — University Grade Points',
    navTitle: 'CGPA Calculator',
    description: 'Convert college and university CGPA or GPA into percentage marks using standard CBSE, Mumbai University, and 10-point scale formulas.',
    icon: '🎓',
    path: '/cgpa-calculator.html',
    filename: 'cgpa-calculator.html',
    category: '💼 Career Tools',
    badge: 'Academic',
    features: ['CBSE 9.5x Multiplier', 'Semester-by-Semester GPA', 'Credit Weight Calculation', 'Division & Honors Class', 'PDF Transcript Summary']
  },
  {
    id: 'mileage-calculator',
    title: 'Car Gas Mileage Calculator — MPG & Fuel Economy Tracker',
    navTitle: 'Mileage Calculator',
    description: 'Calculate vehicle fuel economy in Miles Per Gallon (MPG), Liters per 100km (L/100km), and estimated road trip travel costs.',
    icon: '⛽',
    path: '/mileage-calculator.html',
    filename: 'mileage-calculator.html',
    category: '💼 Business Tools',
    badge: 'Auto',
    features: ['MPG & L/100km Conversion', 'Trip Fuel Cost Estimation', 'Cost per Mile/Kilometer', 'Fuel Tank Range Forecast', 'Road Trip Planner']
  },
  {
    id: 'paint-cost-calculator',
    title: 'Paint Cost & Gallon Calculator — Wall Area Coverage',
    navTitle: 'Paint Cost Calc',
    description: 'Estimate how many gallons or liters of paint you need to paint interior rooms, walls, doors, and ceilings, plus total material budget.',
    icon: '🖌️',
    path: '/paint-cost-calculator.html',
    filename: 'paint-cost-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Home',
    features: ['Room Dimension Inputs', 'Window & Door Deductions', 'Number of Coats (1-3)', 'Gallon & Liter Coverage', 'Total Cost Breakdown']
  },
  {
    id: 'density-calculator',
    title: 'Density Calculator — Mass, Volume & Material Formula',
    navTitle: 'Density Calculator',
    description: 'Calculate density (ρ = m / V), mass, or volume with instant unit conversions and reference densities for metals, liquids, and gases.',
    icon: '🧪',
    path: '/density-calculator.html',
    filename: 'density-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Science',
    features: ['Density = Mass / Volume', 'Common Material Presets', 'g/cm³, kg/m³, lb/ft³ Units', 'Solve for Any Variable', 'Buoyancy Indication']
  },
  {
    id: 'screen-size-calculator',
    title: 'Screen Size Calculator — Monitor Dimensions, Area & PPI',
    navTitle: 'Screen Size Calc',
    description: 'Calculate monitor physical width, height, surface area, and pixel density (PPI) from diagonal size and aspect ratio.',
    icon: '🖥️',
    path: '/screen-size-calculator.html',
    filename: 'screen-size-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Hardware',
    features: ['16:9, 21:9, 16:10 Ratios', 'Physical Width & Height', 'Pixel Density (PPI) Matrix', '4K, 1440p, 1080p Presets', 'Display Area in cm² & in²']
  },
  {
    id: 'torque-calculator',
    title: 'Torque Calculator — Force, Lever Arm Distance & RPM',
    navTitle: 'Torque Calculator',
    description: 'Calculate mechanical rotational torque from applied lever arm force or electrical motor power (kW & RPM).',
    icon: '⚙️',
    path: '/torque-calculator.html',
    filename: 'torque-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Engineering',
    features: ['Lever Arm Force & Radius', 'Motor Power (kW) & RPM', 'Newton-Meters (N·m)', 'Foot-Pounds (ft·lb)', 'Angle of Applied Force']
  },
  {
    id: 'linear-regression-calculator',
    title: 'Linear Regression Calculator — Best Fit Line y = mx + b',
    navTitle: 'Linear Regression',
    description: 'Calculate least squares regression line, slope (m), intercept (b), correlation (r), and R² determination coefficient.',
    icon: '📈',
    path: '/linear-regression-calculator.html',
    filename: 'linear-regression-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Math',
    features: ['y = mx + b Equation', 'R² Goodness of Fit', 'Pearson Correlation (r)', 'Interactive X Predictor', 'Data Points Parser']
  },
  {
    id: 'sha256-hash-generator',
    title: 'SHA-256 Hash Generator — Real-Time Checksum Verifier',
    navTitle: 'SHA-256 Generator',
    description: 'Generate 256-bit cryptographic SHA-256 checksum hashes in real-time with Web Crypto API and verify matching digests.',
    icon: '🛡️',
    path: '/sha256-hash-generator.html',
    filename: 'sha256-hash-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Security',
    features: ['Web Crypto API', 'Real-Time Digest Calculation', 'Hex Uppercase/Lowercase', 'Checksum Match Verification', '100% Client-Side']
  },
  {
    id: 'us-income-tax-calculator',
    title: 'US Income Tax Calculator — 2024 Federal Brackets & FICA',
    navTitle: 'US Tax Calculator',
    description: 'Calculate 2024 IRS federal income tax brackets, FICA taxes (Social Security & Medicare), and estimated paycheck take-home pay.',
    icon: '🇺🇸',
    path: '/us-income-tax-calculator.html',
    filename: 'us-income-tax-calculator.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['2024 Federal Brackets', 'All 4 Filing Statuses', 'FICA (Social Security & Medicare)', 'Effective vs Marginal Rate', 'Bi-weekly Take-Home Pay']
  },
  {
    id: 'personal-loan-calculator',
    title: 'Personal Loan Calculator — Monthly EMI, APR & Net Cash',
    navTitle: 'Personal Loan Calc',
    description: 'Calculate monthly personal loan payments (EMI), interest charges, upfront origination fees, and net funded proceeds.',
    icon: '💳',
    path: '/personal-loan-calculator.html',
    filename: 'personal-loan-calculator.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['Monthly EMI Calculation', 'Origination Fee Deduction', 'Net Funded Cash Amount', 'Total Interest Cost', 'Amortization Breakdown']
  },
  {
    id: 'sale-price-calculator',
    title: 'Sale Price Calculator — Stacked Coupon Discount & Tax',
    navTitle: 'Sale Price Calc',
    description: 'Calculate markdown sale prices, stacked promo code discounts, sales tax, and total out-of-pocket checkout costs.',
    icon: '🏷️',
    path: '/sale-price-calculator.html',
    filename: 'sale-price-calculator.html',
    category: '💼 Business Tools',
    badge: 'Shopping',
    features: ['Primary Markdown Discount', 'Stacked Coupon Discount', 'Sales Tax Calculation', 'Total Savings Dollar & %', 'Quick Sales Presets']
  },
  {
    id: 'md5-hash-generator',
    title: 'MD5 Hash Generator — 128-Bit Checksum Digest Lookup',
    navTitle: 'MD5 Hash Generator',
    description: 'Generate 128-bit MD5 message digest hash checksums instantly with real-time verification and casing options.',
    icon: '#️⃣',
    path: '/md5-hash-generator.html',
    filename: 'md5-hash-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Security',
    features: ['RFC 1321 Pure MD5 Engine', 'Instant Live Hashing', 'Uppercase & Lowercase Hex', 'Checksum Verifier Matcher', '100% Client-Side Safe']
  },
  {
    id: 'wide-text-generator',
    title: 'Wide Text Generator — Fullwidth Aesthetic Vaporwave Font',
    navTitle: 'Wide Text Gen',
    description: 'Convert standard text into fullwidth Unicode aesthetic text (ｗｉｄｅ　ｔｅｘｔ) and spaced typography.',
    icon: '🔤',
    path: '/wide-text-generator.html',
    filename: 'wide-text-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Creative',
    features: ['Fullwidth Unicode (0xFF01-0xFF5E)', 'Spaced & Double Spaced', 'Squared Unicode Box Letters', 'One-Click Copy', 'Aesthetic Presets']
  },
  {
    id: 'typing-speed-test',
    title: 'Typing Speed Test — Test WPM & Accuracy Online',
    navTitle: 'Typing Speed Test',
    description: 'Test your words per minute (WPM), raw CPM speed, and keystroke accuracy with timed 15s, 30s, 60s, or 120s typing tests.',
    icon: '⌨️',
    path: '/typing-speed-test.html',
    filename: 'typing-speed-test.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'New',
    features: ['Real-Time WPM & CPM Calculation', 'Keystroke Accuracy Tracking', '15s, 30s, 60s & 120s Timers', 'Live Error Highlighting', '100% Client-Side']
  },
  {
    id: 'text-reverser',
    title: 'Text Reverser — Reverse Text, Words & Letters Online',
    navTitle: 'Text Reverser',
    description: 'Flip and reverse characters, words, lines, or mirror text backwards instantly with 1-click clipboard copy.',
    icon: '🔄',
    path: '/text-reverser.html',
    filename: 'text-reverser.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: ['Reverse Characters & Letters', 'Reverse Word Order', 'Reverse Lines Upside Down', 'Live Character & Word Counts', 'Instant Copy & Download']
  },
  {
    id: 'remove-line-breaks',
    title: 'Remove Line Breaks — Clean Text & Paragraph Formatter',
    navTitle: 'Remove Line Breaks',
    description: 'Remove line breaks, carriage returns, and newlines from messy copied text, PDF text, or code with customizable separators.',
    icon: '↩️',
    path: '/remove-line-breaks.html',
    filename: 'remove-line-breaks.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Cleaner',
    features: ['Strip All Line Breaks', 'Preserve Double Paragraph Breaks', 'Custom Delimiter Replacement', 'Trim Extra Whitespace', 'Instant Export']
  },
  {
    id: 'remove-extra-spaces',
    title: 'Remove Extra Spaces — Clean Whitespace & Indents',
    navTitle: 'Remove Extra Spaces',
    description: 'Eliminate duplicate spaces, trailing whitespace, blank lines, and irregular indents from your text in one click.',
    icon: '🧹',
    path: '/remove-extra-spaces.html',
    filename: 'remove-extra-spaces.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Cleaner',
    features: ['Collapse Multiple Spaces to Single Space', 'Trim Leading & Trailing Spaces', 'Remove Empty Blank Lines', 'Real-Time Space Savings Counter', '1-Click Copy']
  },
  {
    id: 'text-repeater',
    title: 'Text Repeater — Repeat Words & Messages 10,000x Times',
    navTitle: 'Text Repeater',
    description: 'Repeat any word, phrase, emoji, or text string up to 10,000 times with newlines, spaces, or custom separators.',
    icon: '🔁',
    path: '/text-repeater.html',
    filename: 'text-repeater.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Generator',
    features: ['Repeat up to 10,000 Times', 'Custom Separators & Newlines', 'Number Each Repetition Option', 'Quick Count Presets', 'One-Click Copy & Download']
  },
  {
    id: 'text-splitter',
    title: 'Text Splitter — Split Text by Delimiter, Lines & Chunks',
    navTitle: 'Text Splitter',
    description: 'Split text, lists, CSVs, or logs by character, comma, newline, regex delimiter, or fixed character chunk size.',
    icon: '✂️',
    path: '/text-splitter.html',
    filename: 'text-splitter.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: ['Split by Delimiter or Regex', 'Split by Fixed Character Chunk Size', 'Preview Chunks with Length Stats', 'Copy Individual or All Chunks', 'ZIP / TXT Export']
  },
  {
    id: 'text-joiner',
    title: 'Text Joiner — Combine Lines with Custom Delimiters',
    navTitle: 'Text Joiner',
    description: 'Merge and concatenate list items, lines of text, or values using commas, tabs, semicolons, or custom prefixes/suffixes.',
    icon: '🔗',
    path: '/text-joiner.html',
    filename: 'text-joiner.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: ['Join with Comma, Semicolon, Space or Custom Separator', 'Prefix and Suffix Enclosing', 'Trim Whitespace & Skip Empty Lines', 'Real-Time Merging', '1-Click Copy']
  },
  {
    id: 'email-extractor',
    title: 'Email Extractor — Scrape & Filter Emails from Text',
    navTitle: 'Email Extractor',
    description: 'Extract all valid email addresses from raw text, HTML documents, or spreadsheets with domain filtering and deduplication.',
    icon: '📧',
    path: '/email-extractor.html',
    filename: 'email-extractor.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Scraper',
    features: ['RFC 5322 Compliant Email Extraction', 'Automatic Duplicate Removal', 'Domain Grouping & Filtering', 'Alphabetical Sorting', 'Export to CSV & TXT']
  },
  {
    id: 'keyword-extractor',
    title: 'Keyword Extractor — Extract SEO Keywords & Density',
    navTitle: 'Keyword Extractor',
    description: 'Analyze text to extract top single words, 2-word, and 3-word key phrases with frequency and percentage density.',
    icon: '🏷️',
    path: '/keyword-extractor.html',
    filename: 'keyword-extractor.html',
    category: '✍️ Text & Writing Tools',
    badge: 'SEO',
    features: ['1-Word, 2-Word & 3-Word N-Gram Extraction', 'Automatic Stop Words Filter', 'Keyword Density Percentage Calculation', 'Sort by Count or Alphabetical', 'CSV Data Export']
  },
  {
    id: 'html-entity-encoder-decoder',
    title: 'HTML Entity Encoder & Decoder — Convert &amp;, &lt;, &gt;',
    navTitle: 'HTML Entity Tool',
    description: 'Encode special characters to HTML entities (&amp;, &lt;, &gt;, &quot;) or decode named and numeric entities back to text.',
    icon: '🔣',
    path: '/html-entity-encoder-decoder.html',
    filename: 'html-entity-encoder-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Named & Numeric Entity Support', 'Dual Encode & Decode Modes', 'Special Character Quick Reference Table', 'Real-Time Conversion', 'One-Click Copy']
  },
  {
    id: 'text-to-binary',
    title: 'Text to Binary Converter — Convert Text to 0s & 1s Online',
    navTitle: 'Text to Binary',
    description: 'Convert ASCII and UTF-8 text strings to 8-bit binary code with space, comma, or continuous formatting.',
    icon: '0️⃣',
    path: '/text-to-binary.html',
    filename: 'text-to-binary.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['8-Bit UTF-8 Byte Stream Encoding', 'Configurable Delimiters (Space, None, Comma, Dash)', 'Bit Length Counter', 'Instant Copy & Download', '100% Client-Side']
  },
  {
    id: 'binary-to-text',
    title: 'Binary to Text Converter — Decode 0s & 1s to Text Online',
    navTitle: 'Binary to Text',
    description: 'Translate binary code (0s and 1s) back into readable English text with auto-delimiter detection and error handling.',
    icon: '1️⃣',
    path: '/binary-to-text.html',
    filename: 'binary-to-text.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Automatic Delimiter Detection', 'Binary Syntax & Character Validation', 'Instant UTF-8 String Decoding', 'Sample Loader', '1-Click Copy']
  },
  {
    id: 'text-to-hex',
    title: 'Text to Hex Converter — Convert ASCII to Hexadecimal',
    navTitle: 'Text to Hex',
    description: 'Convert plain text and strings to hexadecimal values with uppercase/lowercase, space, colon, or 0x prefixes.',
    icon: '🔤',
    path: '/text-to-hex.html',
    filename: 'text-to-hex.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Space, None, Colon, 0x Prefixes', 'Uppercase & Lowercase Hex Toggle', 'UTF-8 Multi-Byte Character Support', 'Live Conversion', 'Copy & Download']
  },
  {
    id: 'hex-to-text',
    title: 'Hex to Text Converter — Decode Hexadecimal to Plain Text',
    navTitle: 'Hex to Text',
    description: 'Decode hexadecimal strings, byte codes, and hex dumps back into readable ASCII/UTF-8 plain text.',
    icon: '#️⃣',
    path: '/hex-to-text.html',
    filename: 'hex-to-text.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Dev',
    features: ['Supports 0x, Colon, Space or Continuous Hex', 'Invalid Hex Character Detection', 'UTF-8 Decoder', 'Quick Sample Loader', 'Instant Copy']
  },
  {
    id: 'css-minifier',
    title: 'CSS Minifier — Minify CSS Online for Faster Page Speeds',
    navTitle: 'CSS Minifier',
    description: 'Compress and minify CSS stylesheets by stripping comments, redundant whitespace, and semicolons for production.',
    icon: '🎨',
    path: '/css-minifier.html',
    filename: 'css-minifier.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Speed',
    features: ['Strip Comments & Unnecessary Whitespace', 'Accurate Byte & Compression Ratio Counter', 'Safe Production Output', '1-Click Copy', 'Download styles.min.css']
  },
  {
    id: 'javascript-minifier',
    title: 'JavaScript Minifier — Minify JS Code Online Free',
    navTitle: 'JavaScript Minifier',
    description: 'Minify JavaScript code by stripping comments and extraneous whitespace while preserving syntactical keyword boundaries.',
    icon: '⚡',
    path: '/javascript-minifier.html',
    filename: 'javascript-minifier.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Speed',
    features: ['Strip Single-line & Multi-line Comments', 'Whitespace Optimization', 'File Size Savings Statistics', 'Copy Minified Code', 'Download script.min.js']
  },
  {
    id: 'html-minifier',
    title: 'HTML Minifier — Compress HTML Online for SEO Speed',
    navTitle: 'HTML Minifier',
    description: 'Minify HTML markup, strip comments, and eliminate whitespace while protecting pre, code, and script blocks.',
    icon: '🌐',
    path: '/html-minifier.html',
    filename: 'html-minifier.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Speed',
    features: ['Preserve pre, code, script and style Blocks', 'Optional HTML Comment Removal', 'Intra-tag Whitespace Collapsing', 'Savings Ratio Tracker', 'Download index.min.html']
  },
  {
    id: 'sql-minifier',
    title: 'SQL Minifier — Compress SQL Queries to Single Line',
    navTitle: 'SQL Minifier',
    description: 'Minify SQL queries, remove comments, and convert multi-line statements into single-line queries while protecting string literals.',
    icon: '🗄️',
    path: '/sql-minifier.html',
    filename: 'sql-minifier.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Database',
    features: ['Safe String Literal Preservation', 'Strip -- and /* */ Comments', 'Single-Line Query Formatting', 'Byte Reduction Stats', 'Download query.min.sql']
  },
  {
    id: 'meta-tag-generator',
    title: 'Meta Tag Generator — Generate SEO & Open Graph Tags',
    navTitle: 'Meta Tag Generator',
    description: 'Generate Google SEO meta tags, Open Graph tags, and Twitter Cards with live SERP and social share previews.',
    icon: '🔍',
    path: '/meta-tag-generator.html',
    filename: 'meta-tag-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'SEO',
    features: ['Standard Meta Tags (Title, Description, Canonical)', 'Open Graph & Twitter Cards', 'Live Google SERP Card Preview', 'Live Social Share Card Preview', 'Copy HTML & Download']
  },
  {
    id: 'robots-txt-generator',
    title: 'Robots.txt Generator — Create SEO-Friendly Robots.txt Online',
    navTitle: 'Robots.txt Generator',
    description: 'Generate optimized robots.txt files for Googlebot and search crawlers with presets, disallow paths, and sitemap directives.',
    icon: '🤖',
    path: '/robots-txt-generator.html',
    filename: 'robots-txt-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'SEO',
    features: ['Quick Presets (Allow All, Private, WordPress, E-Commerce)', 'Custom User-Agent & Crawl-Delay', 'Interactive Disallow/Allow Rule Manager', 'Sitemap Reference Inclusion', 'Download robots.txt']
  },
  {
    id: 'xml-sitemap-generator',
    title: 'XML Sitemap Generator — Create Google Sitemaps Free',
    navTitle: 'XML Sitemap Generator',
    description: 'Generate Google Search Console compliant XML sitemaps with priority, change frequency, and bulk URL importing.',
    icon: '🗺️',
    path: '/xml-sitemap-generator.html',
    filename: 'xml-sitemap-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'SEO',
    features: ['Visual URL & Priority Table Editor', 'Bulk URL Paste & Auto-Import', 'Google Sitemaps 0.9 Standard Compliant', 'Last-Modified Date Tracking', 'Download sitemap.xml']
  },
  {
    id: 'schema-markup-generator',
    title: 'Schema Markup Generator — JSON-LD Structured Data',
    navTitle: 'Schema Generator',
    description: 'Generate Google Rich Results JSON-LD schema markup for Organizations, Articles, FAQ Pages, Products, and Local Businesses.',
    icon: '📑',
    path: '/schema-markup-generator.html',
    filename: 'schema-markup-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'SEO',
    features: ['Organization, Article, FAQPage, Product & LocalBusiness', 'Interactive Dynamic Property Fields', 'Valid schema.org JSON-LD Output', 'Google Rich Snippets Ready', 'Copy Script & Download']
  },
  {
    id: 'utm-builder',
    title: 'UTM Campaign URL Builder — Google Analytics UTM Generator',
    navTitle: 'UTM Link Builder',
    description: 'Build trackable marketing campaign URLs with UTM parameters (source, medium, campaign, term, content) and history tracking.',
    icon: '🎯',
    path: '/utm-builder.html',
    filename: 'utm-builder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Marketing',
    features: ['Google Ads, Facebook, Newsletter Presets', 'Real-Time Clean URL Generation', 'Saved Links History in LocalStorage', 'Parameter Character Counters', '1-Click Copy']
  },
  {
    id: 'scientific-calculator',
    title: 'Scientific Calculator — Free Advanced Math & Trigonometry Online',
    navTitle: 'Scientific Calculator',
    description: 'Calculate trigonometry, logarithms, powers, roots, factorials, and scientific expressions with Degree/Radian mode and history.',
    icon: '🧮',
    path: '/scientific-calculator.html',
    filename: 'scientific-calculator.html',
    category: '🏛️ Government & Utility Tools',
    badge: 'Advanced',
    features: ['Trigonometric (sin, cos, tan) in DEG & RAD', 'Logarithms (log10, ln), Powers & Roots', 'Factorial & Percentage Functions', 'Interactive Calculation History', 'Memory (MC, MR, M+, M-)']
  },
  {
    id: 'handwriting-to-text',
    title: 'Handwriting to Text OCR — Extract Handwritten Notes Online',
    navTitle: 'Handwriting to Text',
    description: 'Convert handwritten notes, sketches, and documents into editable digital text with interactive drawing and client-side OCR.',
    icon: '✍️',
    path: '/handwriting-to-text.html',
    filename: 'handwriting-to-text.html',
    category: '🖼️ Image Tools',
    badge: 'AI OCR',
    features: ['Interactive Drawing Canvas & Image Upload', 'Client-Side Tesseract OCR Engine', 'Contrast Boost Enhancement', 'Instant Text Copy & Export']
  },
  {
    id: 'image-to-text',
    title: 'Image to Text OCR Converter — Extract Text from Photos',
    navTitle: 'Image to Text (OCR)',
    description: 'Extract editable text from images, photos, and scanned documents in 11+ languages with high accuracy in your browser.',
    icon: '📄',
    path: '/image-to-text.html',
    filename: 'image-to-text.html',
    category: '🖼️ Image Tools',
    badge: 'OCR',
    features: ['11+ Languages (English, Hindi, Spanish, etc.)', 'Confidence Score & Real-Time Progress', '100% Client-Side Processing', 'Copy & Download Extracted Text']
  },
  {
    id: 'barcode-scanner',
    title: 'Barcode Scanner — Scan 1D/2D Barcodes Online Free',
    navTitle: 'Barcode Scanner',
    description: 'Scan and decode 1D & 2D barcodes from camera or uploaded images with automatic barcode format detection and Google lookup.',
    icon: '📱',
    path: '/barcode-scanner.html',
    filename: 'barcode-scanner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Scanner',
    features: ['Live Camera & Image File Scanning', 'BarcodeDetector API with jsQR Fallback', 'Scanned Barcodes History', 'Google Product Search & Copy']
  },
  {
    id: 'calendar-notes',
    title: 'Calendar Notes — Private Monthly Calendar & Daily Planner',
    navTitle: 'Calendar Notes',
    description: 'Organize your schedule and write private daily notes on an interactive monthly calendar stored securely in your browser.',
    icon: '📅',
    path: '/calendar-notes.html',
    filename: 'calendar-notes.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Planner',
    features: ['Interactive Monthly Calendar Grid', 'Per-Day Private Note Autosave', 'Month-by-Month Navigation', 'Zero Server Tracking — 100% Offline']
  },
  {
    id: 'clipboard-history',
    title: 'Clipboard History Manager — Save & Search Copied Snippets',
    navTitle: 'Clipboard History',
    description: 'Store frequently used text snippets, code blocks, and notes locally with instant search and one-click re-copying.',
    icon: '📋',
    path: '/clipboard-history.html',
    filename: 'clipboard-history.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Utility',
    features: ['Instant Snippet Storage & Local Persistence', 'Real-Time Text Search', 'One-Click Copy Back to Clipboard', 'Manage & Delete Saved Items']
  },
  {
    id: 'daily-planner',
    title: 'Daily Routine Planner — Morning, Afternoon & Evening Focus',
    navTitle: 'Daily Planner',
    description: 'Structure your day into Morning, Afternoon, and Evening priorities with persistent task checkboxes and daily notes.',
    icon: '☀️',
    path: '/daily-planner.html',
    filename: 'daily-planner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Routine',
    features: ['Morning, Afternoon & Evening Task Sections', 'Daily Priority Scratchpad', 'Task Checkboxes & Local Persistence', 'Clean Distraction-Free Design']
  },
  {
    id: 'expense-tracker',
    title: 'Personal Expense Tracker — Income, Expenses & Budget Ledger',
    navTitle: 'Expense Tracker',
    description: 'Track daily expenses and income, view real-time balance metrics, and export categorized financial transactions to CSV.',
    icon: '💰',
    path: '/expense-tracker.html',
    filename: 'expense-tracker.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['Live Income, Expense & Balance Summary', 'Categorized Transaction Logging', 'Export Transaction History to CSV', '100% Private Local Browser Storage']
  },
  {
    id: 'file-checksum-verifier',
    title: 'File Checksum Verifier — Verify SHA-256, SHA-1, SHA-512 & MD5',
    navTitle: 'File Checksum',
    description: 'Compute cryptographic hashes of any file to verify file integrity and detect tampering with instant hash comparison.',
    icon: '🛡️',
    path: '/file-checksum-verifier.html',
    filename: 'file-checksum-verifier.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Security',
    features: ['Supports SHA-256, SHA-1, SHA-512 & MD5', 'Integrity Matching vs Expected Hash', 'Visual Match/Mismatch Verification Badge', 'Zero Upload — Calculated In-Browser']
  },
  {
    id: 'habit-tracker',
    title: 'Daily Habit Tracker — Build Habits & Track Streaks',
    navTitle: 'Habit Tracker',
    description: 'Cultivate positive daily habits, maintain consecutive streaks, and monitor your personal consistency over time.',
    icon: '🔥',
    path: '/habit-tracker.html',
    filename: 'habit-tracker.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Habits',
    features: ['Daily Streak Counters with Flame Icons', 'One-Click Habit Check-Off', 'Persistent Habit Management', 'Historical Completion Tracking']
  },
  {
    id: 'monthly-budget-planner',
    title: 'Monthly Budget Planner — Category Spending & Expense Limits',
    navTitle: 'Budget Planner',
    description: 'Plan monthly expenditures by category, monitor actual spending against budgeted limits, and avoid overspending.',
    icon: '💳',
    path: '/monthly-budget-planner.html',
    filename: 'monthly-budget-planner.html',
    category: '💼 Business Tools',
    badge: 'Budget',
    features: ['Category Budget Allocations', 'Visual Progress Bars & Over-Budget Alerts', 'Total Budget vs Actual Spent Overview', 'Persistent Local Browser Storage']
  },
  {
    id: 'passphrase-generator',
    title: 'Memorable Passphrase Generator — Secure Diceware Words',
    navTitle: 'Passphrase Generator',
    description: 'Generate highly secure yet easy-to-remember multi-word passphrases using Diceware principles and cryptographic randomness.',
    icon: '🔑',
    path: '/passphrase-generator.html',
    filename: 'passphrase-generator.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Security',
    features: ['Cryptographically Secure Word Selection', 'Configurable Word Count & Separators', 'Optional Numbers & Special Symbols', 'One-Click Copy to Clipboard']
  },
  {
    id: 'password-strength-checker',
    title: 'Password Strength Checker — Entropy & Crack Time Estimator',
    navTitle: 'Password Strength',
    description: 'Evaluate password resilience, calculate mathematical entropy bits, and estimate brute-force cracking resistance.',
    icon: '🔐',
    path: '/password-strength-checker.html',
    filename: 'password-strength-checker.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Audit',
    features: ['Entropy Calculation in Bits', 'Brute-Force Crack Time Estimation', 'Visual Strength Meter & Character Checks', 'Actionable Security Recommendations']
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Focus Timer — 25-Minute Work & Break Intervals',
    navTitle: 'Pomodoro Timer',
    description: 'Enhance focus and productivity with 25-minute Pomodoro sessions, short and long breaks, and synthesized audio chimes.',
    icon: '⏱️',
    path: '/pomodoro-timer.html',
    filename: 'pomodoro-timer.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Focus',
    features: ['25m Focus, 5m Short Break & 15m Long Break', 'Custom Session Duration Setting', 'Synthesized Web Audio Completion Chime', 'Clean Play, Pause & Reset Controls']
  },
  {
    id: 'secure-notes',
    title: 'Secure Offline Notes — Private Encrypted Local Notepad',
    navTitle: 'Secure Notes',
    description: 'Draft, organize, and pin private notes stored entirely on your device with text search and instant export.',
    icon: '📝',
    path: '/secure-notes.html',
    filename: 'secure-notes.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Private',
    features: ['Multi-Note Management with Pinning', 'Instant Search Across Titles & Content', 'Export as Text File or Backup JSON', 'Zero Cloud Uploads — 100% Offline']
  },
  {
    id: 'sha-checksum-generator',
    title: 'SHA Checksum Generator — SHA-1, SHA-256, SHA-384 & SHA-512',
    navTitle: 'SHA Checksum Suite',
    description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes simultaneously for strings or uploaded files.',
    icon: '#️⃣',
    path: '/sha-checksum-generator.html',
    filename: 'sha-checksum-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'Hashing',
    features: ['Simultaneous SHA-1, SHA-256, SHA-384 & SHA-512', 'Text and File Input Hashing Modes', 'One-Click Copy for Individual Hashes', 'Zero Server Upload — Fast Client Processing']
  },
  {
    id: 'text-encrypt-decrypt',
    title: 'AES Text Encrypt & Decrypt — Secure Cipher with Secret Key',
    navTitle: 'Text Encrypt & Decrypt',
    description: 'Encrypt confidential text messages with AES symmetric encryption and decrypt ciphertexts using your private passphrase.',
    icon: '🔒',
    path: '/text-encrypt-decrypt.html',
    filename: 'text-encrypt-decrypt.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'AES-256',
    features: ['AES Symmetric Encryption & Decryption', 'Custom Secret Key with Show/Hide Toggle', 'Tamper & Invalid Password Validation', 'One-Click Copy of Ciphertext or Plaintext']
  },
  {
    id: 'todo-list',
    title: 'Todo List & Task Manager — Priority Checklist & Categories',
    navTitle: 'Todo List',
    description: 'Stay organized with priority task tagging, custom category grouping, active/completed filters, and persistent local storage.',
    icon: '✅',
    path: '/todo-list.html',
    filename: 'todo-list.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Tasks',
    features: ['Priority Tagging (Low, Medium, High)', 'Custom Task Categories', 'Filter by All, Active, or Completed', 'Instant Local Browser Persistence']
  },
  {
    id: 'weekly-planner',
    title: '7-Day Weekly Planner — Monday to Sunday Schedule Manager',
    navTitle: 'Weekly Planner',
    description: 'Map out your schedule and tasks across all 7 days of the week with easy per-day task entries and browser storage.',
    icon: '🗓️',
    path: '/weekly-planner.html',
    filename: 'weekly-planner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Weekly',
    features: ['7-Day Overview (Monday through Sunday)', 'Quick Task Addition & Removal Per Day', 'Persistent Local Browser Storage', 'Clean Responsive Layout']
  },
  {
    id: 'random-text-generator',
    title: 'Random Text & String Generator — Custom Length & Character Sets',
    navTitle: 'Random Text Generator',
    description: 'Generate cryptographically random strings, alphanumeric keys, and passwords with customizable length and character sets.',
    icon: '🎲',
    path: '/random-text-generator.html',
    filename: 'random-text-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Generator',
    features: ['Custom Length up to 1024 Characters', 'Uppercase, Lowercase, Numbers & Symbols', 'Hex, Base64 & Alphanumeric Presets', 'Instant Copy & Download as Text File']
  },
  {
    id: 'subtitle-generator',
    title: 'Video Subtitle & SRT Generator — Create Captions & Timestamps',
    navTitle: 'Subtitle Generator',
    description: 'Create, edit, and sync video subtitles with interactive player preview, speech-to-text voice recognition, and SRT/VTT export.',
    icon: '💬',
    path: '/subtitle-generator.html',
    filename: 'subtitle-generator.html',
    category: '📹 Video Tools',
    badge: 'Subtitles',
    features: ['Live Video Player with Subtitle Overlay', 'Interactive Timestamp Editing (Start & End)', 'Speech-to-Text Voice Recognition Option', 'Export as Standard .SRT or .VTT Files']
  },
  {
    id: 'video-aspect-ratio',
    title: 'Video Aspect Ratio Converter — 9:16 Shorts, Reels & 16:9 YouTube',
    navTitle: 'Video Aspect Ratio',
    description: 'Convert video aspect ratios for TikTok, Instagram Reels, YouTube Shorts, and widescreen with blurred background padding.',
    icon: '📐',
    path: '/video-aspect-ratio.html',
    filename: 'video-aspect-ratio.html',
    category: '📹 Video Tools',
    badge: 'Resizer',
    features: ['Presets for 9:16, 16:9, 1:1, 4:5 & 4:3', 'Blurred Background Padding or Solid Color', 'Contain and Cover Aspect Ratio Modes', 'Fast In-Browser Video Re-Encoding']
  },
  {
    id: 'video-compressor',
    title: 'Video Compressor — Reduce Video File Size In Browser',
    navTitle: 'Video Compressor',
    description: 'Shrink video file sizes directly in your browser with adjustable bitrate presets, resolution scaling, and frame rate controls.',
    icon: '🗜️',
    path: '/video-compressor.html',
    filename: 'video-compressor.html',
    category: '📹 Video Tools',
    badge: 'Compressor',
    features: ['Quality Presets (High, Medium, Low Bitrates)', 'Custom Resolution Scaling & FPS Control', 'Before vs After File Size Comparison', '100% Client-Side — Zero Server Upload']
  },
  {
    id: 'video-to-audio',
    title: 'Video to Audio Extractor — Convert MP4 & WebM to WAV Online',
    navTitle: 'Video to Audio',
    description: 'Extract audio tracks, background music, and speech from video files into high-quality WAV audio directly in your browser.',
    icon: '🎵',
    path: '/video-to-audio.html',
    filename: 'video-to-audio.html',
    category: '📹 Video Tools',
    badge: 'Extractor',
    features: ['Lossless Web Audio API Decoding', 'Built-in Audio Player for Instant Preview', 'Export to Standard WAV Audio Format', 'Fast Processing with Zero Server Uploads']
  },
  {
    id: 'video-to-gif',
    title: 'Video to GIF Converter — Create Animated GIFs from Video Clips',
    navTitle: 'Video to GIF',
    description: 'Turn video clips into smooth animated GIFs with customizable start/end trim times, frame rate, and resolution options.',
    icon: '🎞️',
    path: '/video-to-gif.html',
    filename: 'video-to-gif.html',
    category: '📹 Video Tools',
    badge: 'Converter',
    features: ['Interactive Start & End Trimming Handles', 'Adjustable Frame Rate (FPS) & Dimensions', 'High-Quality Client-Side GIF Encoding', 'Instant Animated Preview & Download']
  },
  {
    id: 'video-trimmer',
    title: 'Video Trimmer & Cutter — Cut Video Segments In Browser',
    navTitle: 'Video Trimmer',
    description: 'Trim, cut, and extract specific video clips with interactive timeline scrubber handles and fast client-side export.',
    icon: '✂️',
    path: '/video-trimmer.html',
    filename: 'video-trimmer.html',
    category: '📹 Video Tools',
    badge: 'Editor',
    features: ['Visual Timeline Scrubber with Start/End Handles', 'Live Real-Time Playback of Selected Range', 'In-Browser Re-Encoding via MediaRecorder', 'Instant Trimmed Video Download']
  }
];

export function getTranslatedTools(lang: LanguageCode): ToolMeta[] {
  return TOOLS_DATA.map(tool => {
    let t: ToolMeta = { ...tool };
    switch (tool.id) {
      case 'splitdrop':
        t = {
          ...tool,
          title: getTranslation(lang, 'imageSplitterTitle', 'Image Splitter & Combiner'),
          navTitle: getTranslation(lang, 'imageSplitterNav', 'Image Split & Combine'),
          description: getTranslation(lang, 'imageSplitterDesc', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
        break;
      case 'image-compressor':
        t = {
          ...tool,
          title: getTranslation(lang, 'imageCompressorTitle', 'Image Compressor'),
          navTitle: getTranslation(lang, 'imageCompressorNav', 'Image Compressor'),
          description: getTranslation(lang, 'compressorSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
        break;
      case 'image-converter':
      case 'image-resizer':
      case 'crop-image':
      case 'rotate-image':
      case 'flip-image':
      case 'image-watermark':
      case 'blur-image':
      case 'pixelate-image':
      case 'exif-remover':
      case 'image-color-picker':
      case 'image-info-viewer':
        t = {
          ...tool,
          category: getTranslation(lang, 'imageToolsCategory', '🖼️ Image Tools')
        };
        break;
      case 'pdf-merge':
        t = {
          ...tool,
          title: getTranslation(lang, 'pdfMergeTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfMergeTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfMergeSubtitle', tool.description),
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'pdf-split':
        t = {
          ...tool,
          title: getTranslation(lang, 'pdfSplitTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfSplitTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfSplitSubtitle', tool.description),
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'image-to-pdf':
      case 'pdf-to-images':
      case 'rotate-pdf':
      case 'delete-pdf-pages':
      case 'extract-pdf-pages':
      case 'reorder-pdf-pages':
      case 'pdf-watermark':
      case 'protect-pdf':
      case 'unlock-pdf':
      case 'pdf-metadata':
        t = {
          ...tool,
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'qr-generator':
        t = {
          ...tool,
          title: getTranslation(lang, 'qrTitle', tool.title),
          navTitle: getTranslation(lang, 'qrTitle', tool.navTitle),
          description: getTranslation(lang, 'qrSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
        break;
      case 'resume-builder':
      case 'ats-resume-checker':
      case 'resume-score-analyzer':
      case 'cover-letter-builder':
      case 'cover-letter-templates':
      case 'cv-builder':
      case 'resume-keyword-optimizer':
      case 'resume-template-gallery':
      case 'resume-version-manager':
      case 'resume-import':
      case 'resume-export':
      case 'resume-completeness':
      case 'resume-section-manager':
      case 'professional-skill-library':
      case 'summary-generator':
      case 'resume-color-themes':
      case 'experience-calculator':
      case 'notice-period-calculator':
      case 'salary-hike-calculator':
      case 'ctc-calculator':
      case 'working-days-calculator':
        t = {
          ...tool,
          category: getTranslation(lang, 'careerToolsCategory', '💼 Career Tools')
        };
        break;
      case 'youtube-title-generator':
      case 'youtube-description-generator':
      case 'youtube-tags-generator':
      case 'youtube-hashtag-generator':
      case 'youtube-thumbnail-simulator':
      case 'youtube-banner-safe-area':
      case 'youtube-thumbnail-preview':
      case 'youtube-channel-name-generator':
      case 'youtube-video-idea-generator':
      case 'youtube-playlist-name-generator':
      case 'youtube-timestamp-generator':
      case 'youtube-description-formatter':
      case 'thumbnail-text-generator':
      case 'viral-hook-generator':
      case 'cta-generator':
      case 'social-character-counter':
      case 'emoji-generator':
      case 'instagram-caption-generator':
      case 'instagram-hashtag-generator':
      case 'instagram-bio-generator':
      case 'instagram-username-generator':
      case 'tiktok-caption-generator':
      case 'tiktok-hashtag-generator':
      case 'facebook-caption-generator':
      case 'facebook-hashtag-generator':
      case 'linkedin-headline-generator':
      case 'linkedin-summary-generator':
      case 'twitter-bio-generator':
      case 'universal-hashtag-generator':
      case 'fancy-text-generator':
      case 'unicode-font-generator':
      case 'text-decorator':
      case 'emoji-combiner':
      case 'social-media-post-formatter':
      case 'social-bio-link-builder':
        t = {
          ...tool,
          category: getTranslation(lang, 'creatorToolsCategory', '📱 Creator & Social Media Tools')
        };
        break;
      case 'uuid-generator':
      case 'hash-generator':
      case 'jwt-decoder':
      case 'unix-timestamp-converter':
      case 'regex-tester':
      case 'json-formatter':
      case 'json-validator':
      case 'json-to-csv':
      case 'csv-to-json':
      case 'csv-viewer':
      case 'website-downloader':
      case 'html-formatter':
      case 'css-formatter':
      case 'javascript-formatter':
      case 'xml-formatter':
      case 'xml-validator':
      case 'url-parser':
      case 'url-encoder-decoder':
      case 'base64-encoder-decoder':
      case 'html-escape-unescape':
      case 'http-header-viewer':
      case 'api-request-builder':
      case 'color-converter':
      case 'qr-code-decoder':
        t = {
          ...tool,
          category: getTranslation(lang, 'devToolsCategory', '👨‍💻 Developer Tools')
        };
        break;
      case 'css-gradient-generator':
      case 'box-shadow-generator':
      case 'border-radius-generator':
      case 'glassmorphism-generator':
      case 'neumorphism-generator':
      case 'css-clip-path-generator':
      case 'svg-shape-generator':
      case 'color-palette-generator':
      case 'contrast-checker':
      case 'random-color-generator':
      case 'qr-business-card-generator':
      case 'unit-converter':
      case 'percentage-calculator':
      case 'age-calculator':
      case 'emi-calculator':
      case 'discount-calculator':
      case 'currency-calculator':
      case 'tip-calculator':
      case 'random-number-generator':
      case 'random-password-generator':
      case 'number-to-words':
      case 'words-to-number':
      case 'roman-numeral-converter':
      case 'loan-calculator':
      case 'roi-calculator':
      case 'compound-interest-calculator':
      case 'learning-licence-mock-test':
      case 'online-clock':
      case 'time-zone-converter':
      case 'timezone-converter':
        t = {
          ...tool,
          category: getTranslation(lang, 'designToolsCategory', '🏛️ Government & Utility Tools')
        };
        break;
      case 'chatgpt-prompt-builder':
      case 'gemini-prompt-builder':
      case 'claude-prompt-builder':
      case 'veo-prompt-builder':
      case 'midjourney-prompt-builder':
      case 'flux-prompt-builder':
      case 'stable-diffusion-prompt-builder':
      case 'logo-prompt-builder':
      case 'thumbnail-prompt-builder':
      case 'product-photo-prompt-builder':
      case 'interior-design-prompt-builder':
      case 'story-prompt-builder':
      case 'youtube-script-prompt-builder':
      case 'resume-prompt-builder':
      case 'cover-letter-prompt-builder':
      case 'email-prompt-builder':
      case 'social-media-prompt-builder':
      case 'seo-prompt-builder':
      case 'coding-prompt-builder':
      case 'universal-prompt-builder':
        t = {
          ...tool,
          category: getTranslation(lang, 'promptToolsCategory', '🤖 AI Prompt Builder Tools')
        };
        break;
      case 'password-generator':
      case 'password-strength-checker':
      case 'qr-code-safety-checker':
      case 'qr-code-scanner':
      case 'barcode-scanner':
      case 'text-encrypt-decrypt':
      case 'sha-checksum-generator':
      case 'passphrase-generator':
      case 'secure-notes':
      case 'todo-list':
      case 'clipboard-history':
      case 'pomodoro-timer':
      case 'stopwatch':
      case 'online-stopwatch':
      case 'countdown-timer':
      case 'habit-tracker':
      case 'expense-tracker':
      case 'monthly-budget-planner':
      case 'daily-planner':
      case 'weekly-planner':
      case 'calendar-notes':
      case 'file-checksum-verifier':
      case 'typing-speed-test':
        t = {
          ...tool,
          category: getTranslation(lang, 'securityCategory', '🔒 Security, Privacy & Productivity')
        };
        break;
      case 'weight-gain-calculator':
        t = {
          ...tool,
          category: getTranslation(lang, 'healthFitnessCategory', '💪 Health & Fitness')
        };
        break;
      case 'pdf-size-adjuster':
      case 'increase-pdf-size':
      case 'decrease-pdf-size':
      case 'pdf-compressor':
      case 'pdf-to-jpg':
      case 'edit-pdf':
      case 'text-to-pdf':
        t = {
          ...tool,
          category: getTranslation(lang, 'pdfTools', '📄 PDF Tools')
        };
        break;
      case 'signature-maker':
      case 'signature-resizer':
      case 'photo-signature-joiner':
      case 'photo-name-date-joiner':
      case 'text-to-handwriting':
        t = {
          ...tool,
          category: getTranslation(lang, 'imageTools', '🖼️ Image Tools')
        };
        break;
      case 'omr-sheet-generator':
      case 'barcode-generator':
        t = {
          ...tool,
          category: getTranslation(lang, 'businessTools', '💼 Business Tools')
        };
        break;
      case 'pdf-to-word':
      case 'word-to-pdf':
      case 'pdf-to-text':
      case 'pdf-to-excel':
      case 'pdf-page-number':
      case 'pdf-compare':
      case 'pdf-signature':
        t = {
          ...tool,
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'case-converter':
      case 'word-counter':
      case 'character-counter':
      case 'reading-time-calculator':
      case 'remove-duplicate-lines':
      case 'remove-empty-lines':
      case 'find-and-replace':
      case 'text-compare':
      case 'text-cleaner':
      case 'sort-lines':
      case 'lorem-ipsum-generator':
      case 'markdown-editor':
      case 'wide-text-generator':
      case 'text-reverser':
      case 'remove-line-breaks':
      case 'remove-extra-spaces':
      case 'text-repeater':
      case 'text-splitter':
      case 'text-joiner':
      case 'email-extractor':
      case 'keyword-extractor':
        t = {
          ...tool,
          category: getTranslation(lang, 'textToolsCategory', '✍️ Text & Writing Tools')
        };
        break;
      case 'json-minifier':
      case 'json-to-xml':
      case 'xml-to-json':
      case 'markdown-to-html':
      case 'sql-formatter':
      case 'jwt-generator':
      case 'cron-expression-generator':
      case 'html-entity-encoder-decoder':
      case 'text-to-binary':
      case 'binary-to-text':
      case 'text-to-hex':
      case 'hex-to-text':
      case 'css-minifier':
      case 'javascript-minifier':
      case 'html-minifier':
      case 'sql-minifier':
      case 'meta-tag-generator':
      case 'robots-txt-generator':
      case 'xml-sitemap-generator':
      case 'schema-markup-generator':
      case 'utm-builder':
      case 'sha256-hash-generator':
      case 'md5-hash-generator':
      case 'json-to-yaml':
      case 'user-agent-parser':
        t = {
          ...tool,
          category: getTranslation(lang, 'devToolsCategory', '👨‍💻 Developer Tools')
        };
        break;
      case 'scientific-calculator':
        t = {
          ...tool,
          category: getTranslation(lang, 'designToolsCategory', '🏛️ Government & Utility Tools')
        };
        break;
      default:
        break;
    }

    const { tags, trending, featured, editorsPick } = getToolTagsAndFlags(t.id, t.category);

    return {
      ...t,
      tags: Array.from(new Set([...(t.tags || []), ...tags])),
      trending: t.trending ?? trending,
      featured: t.featured ?? featured,
      editorsPick: t.editorsPick ?? editorsPick
    };
  });
}

function getToolTagsAndFlags(id: string, category: string): { tags: string[]; trending?: boolean; featured?: boolean; editorsPick?: boolean } {
  const isTrendingList = ['splitdrop', 'image-compressor', 'pdf-merge', 'resume-builder', 'youtube-title-generator', 'chatgpt-prompt-builder', 'json-formatter', 'css-gradient-generator', 'random-password-generator', 'qr-generator', 'weight-gain-calculator'];
  const isFeaturedList = ['splitdrop', 'image-converter', 'pdf-split', 'ats-resume-checker', 'instagram-caption-generator', 'gemini-prompt-builder', 'jwt-decoder', 'color-palette-generator', 'image-to-pdf'];
  const isEditorsPickList = ['splitdrop', 'crop-image', 'cover-letter-builder', 'midjourney-prompt-builder', 'unit-converter', 'qr-code-decoder', 'todo-list', 'weight-gain-calculator'];

  let tags: string[] = ['Free', 'Online', 'Tool'];
  
  // Inject specialized search intent keywords from keyword research
  const specificKws = getToolKeywords(id);
  if (specificKws && specificKws.length > 0) {
    tags.push(...specificKws);
  }

  if (category.includes('Image')) {
    tags.push('Image', 'Photo', 'Graphic', 'Converter', 'Compressor', 'Canvas', 'Design');
  } else if (category.includes('PDF')) {
    tags.push('PDF', 'Document', 'Merge', 'Split', 'Office', 'Converter', 'PDF Tools');
  } else if (category.includes('Creator')) {
    tags.push('YouTube', 'Instagram', 'TikTok', 'Creator', 'SEO', 'Social Media', 'Caption');
  } else if (category.includes('Career')) {
    tags.push('Resume', 'Career', 'CV', 'Job', 'Interview', 'ATS', 'Cover Letter');
  } else if (category.includes('Developer')) {
    tags.push('Developer', 'Coding', 'JSON', 'Formatter', 'API', 'Base64', 'Hash');
  } else if (category.includes('Design')) {
    tags.push('Design', 'CSS', 'Color', 'Palette', 'Calculator', 'UI', 'Generator');
  } else if (category.includes('Health') || category.includes('Fitness')) {
    tags.push('Health', 'Fitness', 'Calorie', 'Bulking', 'Macros', 'Diet', 'Calculator', 'Nutrition');
  } else if (category.includes('Prompt')) {
    tags.push('AI', 'Prompt', 'ChatGPT', 'Midjourney', 'Gemini', 'Claude', 'Generator');
  } else {
    tags.push('Security', 'Privacy', 'Password', 'QR', 'Productivity', 'Tools');
  }

  if (id.includes('pdf')) tags.push('PDF');
  if (id.includes('image') || id.includes('photo')) tags.push('Image');
  if (id.includes('resume') || id.includes('cv')) tags.push('Resume');
  if (id.includes('youtube')) tags.push('YouTube');
  if (id.includes('prompt')) tags.push('AI');
  if (id.includes('qr')) tags.push('QR');
  if (id.includes('calorie') || id.includes('weight')) tags.push('Health', 'Fitness', 'Calculator');
  if (id.includes('json')) tags.push('JSON');
  if (id.includes('password')) tags.push('Security');

  return {
    tags: Array.from(new Set(tags)),
    trending: isTrendingList.includes(id),
    featured: isFeaturedList.includes(id),
    editorsPick: isEditorsPickList.includes(id)
  };
}

export const TOOLS_DATA: ToolMeta[] = RAW_TOOLS_DATA.map(tool => {
  const { tags, trending, featured, editorsPick } = getToolTagsAndFlags(tool.id, tool.category);
  return {
    ...tool,
    tags: Array.from(new Set([...(tool.tags || []), ...tags])),
    trending: tool.trending ?? trending,
    featured: tool.featured ?? featured,
    editorsPick: tool.editorsPick ?? editorsPick
  };
});

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "What is Zubware and what tools are available?",
    answer: "Zubware is a comprehensive, privacy-first online multi-tool suite offering over 300+ instant browser tools for PDF editing, image processing, video creation, developer utilities, calculators, and career documents. Everything runs directly on your device with zero server uploads."
  },
  {
    question: "Are my files uploaded to any server?",
    answer: "No! All processing happens 100% inside your browser using HTML5 Canvas and WebAssembly technologies. Your files never leave your device, ensuring maximum speed and privacy."
  },
  {
    question: "Is Zubware and all free tools completely free to use?",
    answer: "Yes, Zubware and all tools (Image Compressor, Image Converter, PDF Merge, PDF Split, and QR Generator) are 100% free with no watermarks or hidden fees."
  },
  {
    question: "Can I use these tools on mobile devices?",
    answer: "Absolutely! All tools feature responsive touch-optimized controls designed to work seamlessly on iPhones, Android smartphones, iPads, and desktop computers."
  },
  {
    question: "What image formats are supported?",
    answer: "Zubware supports all major Web image formats including PNG, JPG, JPEG, WebP, GIF, and BMP."
  }
];

export function getTranslatedFaqs(lang: LanguageCode): FAQItem[] {
  return [
    {
      question: getTranslation(lang, 'faqsTitle', HOMEPAGE_FAQS[0].question),
      answer: getTranslation(lang, 'heroSubtitle', HOMEPAGE_FAQS[0].answer)
    },
    {
      question: getTranslation(lang, 'zeroServerUploads', HOMEPAGE_FAQS[1].question),
      answer: getTranslation(lang, 'zeroServerUploadsDesc', HOMEPAGE_FAQS[1].answer)
    },
    {
      question: getTranslation(lang, 'freeForever', HOMEPAGE_FAQS[2].question),
      answer: getTranslation(lang, 'freeForeverDesc', HOMEPAGE_FAQS[2].answer)
    },
    {
      question: getTranslation(lang, 'fastBrowserBased', HOMEPAGE_FAQS[3].question),
      answer: getTranslation(lang, 'instantSpeedDesc', HOMEPAGE_FAQS[3].answer)
    },
    {
      question: getTranslation(lang, 'supportsFormats', HOMEPAGE_FAQS[4].question),
      answer: getTranslation(lang, 'supportsFormats', HOMEPAGE_FAQS[4].answer)
    }
  ];
}
