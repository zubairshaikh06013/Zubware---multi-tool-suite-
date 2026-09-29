import { ToolMeta, FAQItem } from '../types';
import { LanguageCode, getTranslation } from '../lib/i18n';
import { getToolKeywords } from '../lib/toolKeywords';

const RAW_TOOLS_DATA: ToolMeta[] = [
  {
    id: 'image-splitter-merger',
    title: 'Image Splitter & Combiner',
    navTitle: 'Image Splitter & Combiner',
    description: 'Split an image cleanly along any vertical or horizontal line, or combine two images seamlessly into a composite directly in your browser.',
    icon: '✂️',
    path: '/image-splitter-merger.html',
    filename: 'image-splitter-merger.html',
    category: '🖼️ Image Tools',
    badge: 'Original',
    features: ['Vertical & Horizontal Split', 'Dual Image Combine', 'Auto-trim Padding', 'Drag-to-Adjust Seam', 'Local Browser Processing'],
    howTo: [
      { title: "Select Split or Combine Mode", desc: "Choose whether you want to slice a single photo into two halves or merge two photos together." },
      { title: "Position the Cut or Join Seam", desc: "In Split mode, select horizontal or vertical orientation and drag the divider guide to your cut line. In Combine mode, select side-by-side or stacked layout." },
      { title: "Download Processed Images", desc: "Click Download to instantly save both separated image pieces or the single combined composite directly to your device." }
    ],
    faq: [
      { question: "Does splitting an image reduce visual quality?", answer: "No. The image is rendered onto an HTML5 canvas at its full source dimensions, preserving original pixel resolution when exporting each half." },
      { question: "Can I split an image both horizontally and vertically at the same time?", answer: "Currently, the tool slices along one axis per pass (vertical or horizontal). To create a four-quadrant split, download the two halves and run each half through horizontal split mode." },
      { question: "What does the auto-trim padding option do?", answer: "Auto-trim scans the image perimeter and removes empty transparent or uniform border pixels before cutting, ensuring your split pieces align flush against each other." },
      { question: "What happens when combining images with different heights or widths?", answer: "The tool scales the smaller image proportionally to match the matching dimension of the other image, preventing stretching or aspect ratio distortion." },
      { question: "Are my images uploaded to a server during splitting or combining?", answer: "The image is processed locally in your browser using HTML5 Canvas and is not sent to a Zubware server for processing." }
    ]
  },
  {
    id: 'learning-licence-mock-test',
    title: "Learning Licence Mock Test — Practice RTO Driving Exam Online",
    navTitle: "LL Mock Test",
    description: "Practice driving licence exam questions, traffic rules, and mandatory road signs online with a bilingual English and Hindi mock test simulator.",
    icon: '🚦',
    path: '/learning-licence-mock-test.html',
    filename: 'learning-licence-mock-test.html',
    category: '🏛️ Government & Utility Tools',
    badge: 'New',
    features: ['Bilingual Hindi & English', '60 Question Practice Bank', '15 Questions Random Selection', 'Optional 15-Min Timer', 'Traffic Signs Practice Mode'],
    howTo: [
      { title: "Choose Test Mode & Language", desc: "Select the comprehensive Mock Test or the Traffic Signs practice test, and choose English or Hindi language." },
      { title: "Answer Practice Questions", desc: "Read each road scenario or traffic sign prompt and select your answer before the countdown timer runs out." },
      { title: "Review Score & Detailed Explanations", desc: "Review your passing status, total score, and inspect explanations for any missed questions to prepare for your test." }
    ],
    faq: [
      { question: "Is this an official government driving licence examination?", answer: "No. This is an educational practice simulator designed to help learners study road safety rules, traffic signals, and common exam questions before taking an official RTO exam." },
      { question: "Can I practice traffic signs and road symbol questions separately?", answer: "Yes. Switch to the Traffic Signs tab to test your recognition of mandatory, cautionary, and informatory road signs with visual sign illustrations." },
      { question: "Can I take the practice test in Hindi as well as English?", answer: "Yes. Use the language selector at the top to toggle between English and Hindi for all questions and explanations." },
      { question: "Can I take the practice test without a time limit?", answer: "Yes. You can disable the 30-second question timer to study and review question explanations at your own comfortable pace." },
      { question: "Is my test score or personal information stored on a server?", answer: "All test questions, timer state, and score calculations run locally inside your web browser without requiring an account or storing test results on a server." }
    ]
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
    features: ['AI Automatic Removal', 'Transparent PNG Export', 'Before/After Comparison', 'Local Browser Processing', 'High Resolution Output'],
    howTo: [
      { title: "Upload Photo", desc: "Select or drag and drop a JPG, PNG, or WebP photo with a distinct foreground subject into the workspace." },
      { title: "Automatic AI Subject Isolation", desc: "The client-side machine learning model analyzes the image and segments people, products, animals, or objects from the background." },
      { title: "Preview & Download Transparent PNG", desc: "Use the comparison slider to inspect cutout edges, then download the resulting image as a transparent 32-bit PNG." }
    ],
    faq: [
      { question: "What types of photos yield the cleanest background removal?", answer: "Images with sharp contrast between the subject and background, good lighting, and clear subject boundaries produce the highest quality cutouts." },
      { question: "Does the output file have a true transparent background?", answer: "Yes. The result is exported as a 32-bit PNG with an alpha channel, so you can place it over any backdrop, presentation, or design mockup." },
      { question: "Why do fine hair strands or translucent fabrics sometimes show slight artifacts?", answer: "Hair and semi-transparent fabrics blend background and foreground pixels. In high-frequency areas, automated segmentation may retain slight edge fringing." },
      { question: "What image formats and file size limits are supported?", answer: "You can upload JPG, JPEG, PNG, and WebP images up to 20MB in size." },
      { question: "Is my photo sent to an external AI server for processing?", answer: "The image is processed in your browser using a client-side WebAssembly neural model and is not sent to a Zubware server for processing." }
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
      'Local Browser Processing'
    ],
    howTo: [
      { title: "Add Images to Queue", desc: "Drag and drop or select one or multiple JPG, PNG, or WebP images to compress." },
      { title: "Choose Compression Mode", desc: "Select By Target Size (KB) to hit strict limits like 20KB or 50KB, or adjust the Quality or Percentage reduction sliders." },
      { title: "Compress and Export", desc: "Review the before/after byte counts and savings percentage, then download individual files or the entire batch as a ZIP." }
    ],
    faq: [
      { question: "How does Target Size mode compress to an exact KB number?", answer: "The compression engine runs an iterative binary search on encoding quality combined with progressive resolution downscaling until the encoded blob fits within your specified KB threshold." },
      { question: "Why do PNG files compress less than JPG files?", answer: "PNG uses lossless DEFLATE compression to preserve crisp lines and transparent pixels, whereas JPG uses lossy discrete cosine transform compression that discards imperceptible color details." },
      { question: "Can I compress multiple photos at the same time?", answer: "Yes. You can queue multiple images, apply a universal target size or quality level, and download all compressed files together in a ZIP package." },
      { question: "Does image compression remove EXIF camera metadata?", answer: "Yes. Re-encoding the image through HTML5 Canvas strips embedded camera metadata, GPS tags, and device identifiers, further reducing file size." },
      { question: "Can I compress multiple images without uploading them?", answer: "Yes. The batch image compressor processes all selected PNG, JPG, and WebP files concurrently inside your browser memory using HTML5 canvas and WebAssembly, so your photos are never uploaded to a server." }
    ]
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    navTitle: 'Image Converter',
    description: 'Convert PNG, JPG, WebP, GIF, and BMP image formats instantly in high resolution. Free bulk online image converter with client-side browser processing.',
    icon: '🔄',
    path: '/image-converter.html',
    filename: 'image-converter.html',
    category: '🖼️ Image Tools',
    badge: 'Free',
    features: ['Multi-format Support', 'Bulk Conversion', 'High Fidelity Output', 'Local Browser Processing', 'One-Click Download'],
    howTo: [
      { title: "Upload Source Files", desc: "Add one or more images in formats like PNG, JPG, WebP, GIF, BMP, or SVG." },
      { title: "Select Target Output Format", desc: "Choose a global target format such as WebP, JPG, or PNG, or specify different formats for individual queue items." },
      { title: "Convert and Download", desc: "Click Convert to encode the files in your browser, then download each converted file or download all as a ZIP archive." }
    ],
    faq: [
      { question: "Which image formats can I convert between?", answer: "The converter supports reading and exporting standard web image formats including JPG, PNG, WebP, GIF, BMP, and ICO." },
      { question: "What happens to transparency when converting a transparent PNG to JPG?", answer: "Because the JPEG format does not support alpha transparency channels, transparent areas are automatically filled with a clean white background." },
      { question: "Does converting a JPG to PNG improve its image quality?", answer: "No. Converting to PNG prevents further quality loss during future edits, but cannot restore detail already lost in original JPEG compression." },
      { question: "Why should I convert existing images to WebP?", answer: "WebP provides 25% to 35% smaller file sizes than JPG and PNG at equivalent visual fidelity, speeding up website page loads." },
      { question: "Can I convert photos between PNG, JPG, and WebP without uploading files?", answer: "Yes. All image decoding and re-encoding between PNG, JPG, WebP, GIF, and BMP formats happen locally inside your browser memory with zero file uploads." }
    ]
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
    features: ['Pixels & Percentage', 'Lock Aspect Ratio', 'JPG, PNG, WebP, AVIF', 'Local Browser Processing', 'Instant Export'],
    howTo: [
      { title: "Upload Your Image", desc: "Select the image you want to resize from your computer or mobile device." },
      { title: "Set Target Dimensions or Scale", desc: "Input custom pixel width and height with aspect ratio locked or unlocked, or scale by percentage." },
      { title: "Select Format and Download", desc: "Pick your preferred export format (PNG, JPEG, WebP), adjust quality if needed, and click Download Resized Image." }
    ],
    faq: [
      { question: "How can I prevent my resized image from looking stretched or distorted?", answer: "Keep the Lock Aspect Ratio toggle enabled. When you enter a new width, the corresponding height calculates automatically to maintain exact natural proportions." },
      { question: "What happens if I enlarge an image beyond its original resolution?", answer: "Enlarging (upscaling) an image interpolates existing pixels, which can introduce blurriness or soft edges because the original file does not contain extra detail." },
      { question: "Can I resize by percentage instead of exact pixels?", answer: "Yes. Switch to Percentage mode and use the scale slider (e.g., 50% for half size or 200% for double size) to scale both dimensions uniformly." },
      { question: "Which format should I select when saving my resized image?", answer: "Choose PNG if your image contains text, sharp graphics, or transparency; choose JPG or WebP for photographs to keep file size compact." },
      { question: "Can I preserve the original aspect ratio while resizing photos locally?", answer: "Yes. Locking the aspect ratio automatically calculates proportional height for any width you enter, and all pixel scaling takes place directly in your browser without uploading." }
    ]
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
    features: ['Social Media Presets', 'Free Crop & Zoom', 'Rotate & Preview', 'High Resolution Output', 'Zero Uploads'],
    howTo: [
      { title: "Upload Image", desc: "Select or drop the photo you need to crop into the interactive canvas." },
      { title: "Adjust Crop Box or Select Aspect Preset", desc: "Drag the handles to frame your subject, or pick a preset ratio such as 1:1 square, 16:9 widescreen, or 4:3 standard." },
      { title: "Crop and Download", desc: "Optionally zoom or rotate the orientation, review the pixel dimensions of the crop selection, and download the cropped file." }
    ],
    faq: [
      { question: "Can I crop to specific social media ratios like Instagram or YouTube?", answer: "Yes. The preset menu includes 1:1 (Instagram feed), 16:9 (YouTube thumbnails & widescreen), 4:3, 3:2, and freeform custom cropping." },
      { question: "Does cropping an image reduce its file size?", answer: "Yes. Discarding pixels outside the crop boundary lowers overall pixel count, which typically results in a smaller saved file size." },
      { question: "Can I zoom and pan inside the crop frame before saving?", answer: "Yes. You can use the zoom slider and pan controls to fine-tune your subject placement within the crop frame before exporting." },
      { question: "Does cropping a transparent PNG preserve its transparency?", answer: "Yes. If you crop a PNG file and export in PNG format, the alpha transparency channel in the cropped region remains fully intact." },
      { question: "Does cropping execute locally without uploading my photo to cloud servers?", answer: "Yes. Crop boundaries, aspect ratio presets, and pixel slicing are executed entirely on an in-memory HTML5 canvas without transmitting image data." }
    ]
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
    features: ['90°, 180°, Custom Angle', 'Batch Support', 'Live Grid Preview', 'Fast Local Processing', 'Bulk Download'],
    howTo: [
      { title: "Upload Image Files", desc: "Select single or multiple photos that need reorientation." },
      { title: "Choose Rotation Angle", desc: "Click 90° Clockwise, 90° Counter-Clockwise, or 180° Flip, or use the custom degree slider for fine angles." },
      { title: "Download Rotated Output", desc: "Preview the corrected orientation and download the rotated image or download the complete batch as a ZIP." }
    ],
    faq: [
      { question: "Why do photos taken on smartphones sometimes appear sideways?", answer: "Smartphones store orientation in EXIF metadata tags. Some software ignores this tag, displaying the raw sensor orientation. Rotating here writes the correct physical pixel orientation." },
      { question: "Does rotating an image 90 degrees degrade visual quality?", answer: "No. A 90°, 180°, or 270° rotation maps existing pixels to new coordinates without resampling or blurring the image content." },
      { question: "Can I straighten a crooked horizon with custom degree angles?", answer: "Yes. The degree slider lets you rotate by arbitrary fine angles between -180° and +180° to level tilted horizon lines." },
      { question: "Can I rotate multiple photos in a single batch?", answer: "Yes. You can upload several images at once, apply the rotation to the entire queue, and export them together in a ZIP file." },
      { question: "Can I rotate and level photos without server-side processing?", answer: "Yes. Coordinate transformations and custom angle rotations execute locally in your browser memory, eliminating upload wait times and protecting your privacy." }
    ]
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
    features: ['Horizontal Flip', 'Vertical Flip', 'Full Mirror Effect', 'Live Preview', 'One-Click Download'],
    howTo: [
      { title: "Upload Your Photo", desc: "Drag and drop or select the image you want to mirror or invert." },
      { title: "Choose Flip Axis", desc: "Click Flip Horizontal to create a left-to-right mirror reflection, or Flip Vertical to turn the image upside-down." },
      { title: "Save Mirrored File", desc: "Inspect the real-time canvas preview and click Download Flipped Image to save the result." }
    ],
    faq: [
      { question: "What is the difference between flipping and rotating an image?", answer: "Rotating turns the image around a central pivot point, while flipping creates a mirror reflection across a horizontal or vertical axis." },
      { question: "Can I apply both horizontal and vertical flips simultaneously?", answer: "Yes. Toggling both Horizontal and Vertical flips mirrors the image across both axes, equivalent to a 180-degree reflection." },
      { question: "Does flipping an image reverse embedded text?", answer: "Yes. Horizontal mirroring reverses everything in the frame, making readable text appear backwards as if viewed in a physical mirror." },
      { question: "Does flipping change image resolution or pixel dimensions?", answer: "No. Flipping inverts coordinate indices along the chosen axis, preserving original pixel dimensions and resolution." },
      { question: "Are mirrored photos generated locally inside the browser?", answer: "Yes. Horizontal and vertical mirroring flip pixel coordinates instantly on your local canvas without sending the image to an external server." }
    ]
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
    features: ['Text & Image Logo', 'Tile Repeat Pattern', 'Custom Fonts & Colors', 'Opacity & Shadow', 'Local Browser Processing'],
    howTo: [
      { title: "Upload Base Photo", desc: "Select the photograph or graphic you want to brand and protect." },
      { title: "Configure Watermark Text or Logo", desc: "Choose text or image watermark, customize font styling, color, opacity, rotation angle, and canvas placement." },
      { title: "Apply and Download", desc: "Review the live watermarked preview on the canvas and click Download Watermarked Image." }
    ],
    faq: [
      { question: "Can I use a transparent PNG as an image watermark logo?", answer: "Yes. Uploading a PNG logo with transparency allows your graphic or emblem to overlay cleanly onto photos without a solid rectangular background." },
      { question: "What does the Tile Repeat pattern do?", answer: "The Tile option repeats your watermark across the entire image at regular intervals, preventing unauthorized cropping of corner marks." },
      { question: "How transparent should a protective watermark be?", answer: "An opacity between 25% and 40% usually offers effective copyright protection while keeping the underlying photo content clearly visible." },
      { question: "Can I customize the watermark font, color, and drop shadow?", answer: "Yes. You can select font families, change text color, add a subtle drop shadow for legibility over bright backgrounds, and rotate the mark." },
      { question: "Can I apply text or logo watermarks without sending graphics to a server?", answer: "Yes. Both text rendering and PNG logo overlay compositing occur directly on your local device canvas without cloud processing." }
    ]
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
    features: ['Interactive Brush Blur', 'Background Blur', 'Strength Slider', 'Undo & Redo Stack', 'Instant Download'],
    howTo: [
      { title: "Upload Image", desc: "Select the photo containing elements or personal details you wish to blur." },
      { title: "Select Blur Mode and Strength", desc: "Choose Entire Image to soften the full background, or Selective Brush to blur specific regions like faces or license plates." },
      { title: "Brush and Export", desc: "Adjust brush radius, paint directly over confidential areas with undo/redo support, and download the blurred image." }
    ],
    faq: [
      { question: "Can someone reverse or unblur an area blurred with this tool?", answer: "No. Blurring mathematically averages neighboring pixel color values on the canvas. The original high-frequency detail is permanently replaced before saving." },
      { question: "How do I blur out faces, license plates, or credit card numbers?", answer: "Select the Selective Brush mode, set your preferred brush size and blur strength, and paint directly over the sensitive regions you want obscured." },
      { question: "Can I undo accidental brush strokes?", answer: "Yes. The tool maintains an interactive history stack with Undo and Redo controls so you can step backward if you paint outside the target boundary." },
      { question: "What is full background blur used for?", answer: "Full background blurring is commonly used to create soft aesthetic backdrops for presentations, social media banners, or portrait depth effects." },
      { question: "Is interactive blur and redaction applied locally on my device?", answer: "Yes. Gaussian blur convolutions and interactive brush strokes process strictly within browser memory, ensuring confidential redacted information is never transmitted." }
    ]
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
    features: ['Brush Censor Tool', 'Entire Image Pixelate', 'Pixel Size Slider', 'Undo & Redo', 'Instant Export'],
    howTo: [
      { title: "Upload Photo", desc: "Select the image you want to censor or transform into pixel art." },
      { title: "Set Pixel Block Size", desc: "Use the pixel size slider to determine coarseness, from subtle mosaic softening to heavy censorship blocks." },
      { title: "Apply and Download", desc: "Click Pixelate Entire Image for retro effects or use the brush tool to redact specific areas, then download your output." }
    ],
    faq: [
      { question: "Is pixelation secure for redacting sensitive passwords or IDs?", answer: "Yes, provided a sufficiently large pixel block size is used. Larger blocks average hundreds of pixels into uniform color squares, eliminating character shapes." },
      { question: "What is the difference between blurring and pixelating?", answer: "Blurring applies a smooth Gaussian gradient that softens edges, while pixelation divides the image into a rigid grid of solid-color square mosaic tiles." },
      { question: "Can I pixelate only a portion of the photo?", answer: "Yes. Use the brush tool to paint mosaic blocks specifically over sensitive information while leaving the rest of the image in full sharpness." },
      { question: "Can I create full 8-bit retro video game style graphics?", answer: "Yes. Clicking Pixelate Entire Image with an 8px to 16px block size transforms standard photographs into nostalgic pixel art." },
      { question: "Are pixel censorship blocks rendered locally in the browser?", answer: "Yes. Pixel block calculations and mosaic censor brushes execute locally in browser memory without sending private photos over the network." }
    ]
  },
  {
    id: 'exif-remover',
    title: 'EXIF Remover',
    navTitle: 'EXIF Remover',
    description: 'Strip GPS location data, camera model, author info, and device metadata from photos directly in your browser.',
    icon: '🛡️',
    path: '/exif-remover.html',
    filename: 'exif-remover.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Strip GPS Location', 'Camera & Serial Info', 'Batch Support', 'Preserves Quality', 'Client-Side Processing'],
    howTo: [
      { title: "Select Photos", desc: "Upload one or multiple camera or smartphone images containing embedded metadata." },
      { title: "Inspect Detected Metadata", desc: "Review identified EXIF tags including camera make, shutter speed, date/time, and GPS coordinates." },
      { title: "Strip EXIF and Download", desc: "Click to sanitize your photos, removing all tracking metadata, and download the cleaned files or a ZIP bundle." }
    ],
    faq: [
      { question: "What private information is stored in photo EXIF data?", answer: "EXIF metadata commonly contains exact GPS latitude and longitude coordinates, capture timestamps, camera/phone serial numbers, and device settings." },
      { question: "Does stripping EXIF data reduce the visual quality of my photo?", answer: "No. EXIF data is non-visual header metadata. Removing it strips hidden tags without altering pixel resolution or image clarity." },
      { question: "Why should I remove EXIF data before uploading photos online?", answer: "Removing EXIF protects your privacy by preventing strangers or scrapers from discovering where you live, work, or took the photograph." },
      { question: "Can I sanitize multiple photos at once?", answer: "Yes. You can upload batches of photos, strip metadata from all files in one operation, and download them together in a ZIP file." },
      { question: "Can I strip GPS location and camera metadata without uploading my photos?", answer: "Yes. The EXIF scrubber reads the binary JPEG/PNG byte stream and removes metadata headers locally in browser memory before you download the clean image." }
    ]
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
    features: ['HEX, RGB, HSL, CMYK', 'EyeDropper Tool', 'Recent Color Palette', 'One-Click Copy', 'High Precision'],
    howTo: [
      { title: "Upload Image", desc: "Select any photo, design screenshot, or graphic from which you need color codes." },
      { title: "Hover and Sample Pixels", desc: "Move your cursor across the canvas with the 9x magnifying loupe and click on any pixel to lock its color." },
      { title: "Copy Color Formats", desc: "View instant readouts in HEX, RGB, HSL, and HSV formats, and click any copy button or view your recent palette." }
    ],
    faq: [
      { question: "How accurate is the pixel color selection?", answer: "The color picker uses a 9x real-time magnifying loupe that highlights single individual pixels, ensuring you sample the exact intended color." },
      { question: "Which color code formats can I copy?", answer: "You can copy HEX (#RRGGBB), RGB (rgb(r, g, b)), HSL (hsl(h, s, l)), and HSV color values directly to your clipboard." },
      { question: "Does the tool save my previously picked colors?", answer: "Yes. Each clicked color is automatically added to a recent color history palette below the canvas for easy side-by-side comparison." },
      { question: "Can I sample colors from photos taken in different lighting conditions?", answer: "Yes. Keep in mind that shadows and gradients cause slight color variations across surfaces, so use the loupe to sample neutral, well-lit areas." },
      { question: "Does the eyedropper color picker inspect pixels without uploading images?", answer: "Yes. Canvas pixel data is read directly from local device memory to extract HEX, RGB, HSL, and CMYK color values without sending the screenshot to a server." }
    ]
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
    features: ['Full Technical Specs', 'EXIF Metadata Tags', 'Print Size @ 300 DPI', 'Copy Report', 'Client-Side Processing'],
    howTo: [
      { title: "Upload Image File", desc: "Select or drag any image file into the viewer." },
      { title: "Review Technical Specifications", desc: "Examine detailed metrics including width, height, megapixel count, file size, MIME type, and aspect ratio." },
      { title: "Inspect Camera EXIF & Print Sizing", desc: "Check shooting parameters (ISO, aperture, exposure), calculate physical print dimensions at 300 DPI, and copy report data." }
    ],
    faq: [
      { question: "What technical specifications can I inspect with this tool?", answer: "You can view exact pixel dimensions, aspect ratio, file size in KB/MB, MIME type, bit depth, megapixels, and print size at 300 DPI." },
      { question: "How is the print size at 300 DPI calculated?", answer: "Print dimensions are derived by dividing pixel width and height by 300, showing the maximum print size in inches or centimeters without quality loss." },
      { question: "Can I view camera shooting data like ISO and aperture?", answer: "Yes. If the uploaded image retains EXIF metadata, camera brand, model, lens focal length, f-stop, shutter speed, and ISO are parsed and displayed." },
      { question: "Why does my image show no camera EXIF data?", answer: "Images downloaded from messaging apps, social networks, or edited in web software often have EXIF metadata stripped automatically by those platforms." },
      { question: "Can I inspect image resolution and metadata without uploading files?", answer: "Yes. The viewer analyzes image headers, color depth, pixel dimensions, and print specs entirely client-side without transmitting the file." }
    ]
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
    features: ['Transparent/Solid Keying', 'Solid HEX & RGB', 'Linear Gradient', 'Blurred BG', 'Client-Side Processing'],
    howTo: [
      { title: "Upload Cutout or Transparent Photo", desc: "Select a PNG or WebP image with a transparent background, or a photo with a solid background to key out." },
      { title: "Select Background Fill Style", desc: "Choose a solid color using the color picker or define a linear gradient with start/end colors and angle." },
      { title: "Export Finished Composite", desc: "Preview the updated background and download your new image in PNG, JPG, or WebP format." }
    ],
    faq: [
      { question: "Can I replace the background on an image that already has transparent cutouts?", answer: "Yes. Transparent regions are immediately replaced with your selected solid color or gradient fill." },
      { question: "Can this tool replace a solid white or green backdrop?", answer: "Yes. Use Key Color mode, sample the backdrop color with the eyedropper, and adjust the tolerance slider to replace that background." },
      { question: "What is the difference between solid color and gradient backgrounds?", answer: "Solid mode applies a single uniform color, while gradient mode blends two chosen colors across an adjustable angle (such as 45° or 90°)." },
      { question: "Which format should I choose when saving the new background?", answer: "Choose JPG or WebP for smaller file sizes when the new background is opaque, or PNG if you need lossless graphic clarity." },
      { question: "Are background color fills and gradients applied locally?", answer: "Yes. Canvas compositing, solid HEX fills, and linear gradients are rendered directly in browser RAM without server-side image processing." }
    ]
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
    features: ['Individual Corner Radius', 'Circle Avatar Mode', 'Transparent / Solid BG', 'Live Canvas Preview', 'Instant Download'],
    howTo: [
      { title: "Upload Image", desc: "Select the photo or banner you want to soften with rounded corners." },
      { title: "Configure Corner Radii", desc: "Adjust the master radius slider for all four corners, or unlock individual corner sliders (top-left, top-right, etc.)." },
      { title: "Set Background & Download", desc: "Choose a transparent background (PNG) or solid fill color, preview the curved corners, and download." }
    ],
    faq: [
      { question: "How do I make sure the corners remain transparent after downloading?", answer: "Select the Transparent Background option and export in PNG format. JPG does not support transparency and will fill corners with white." },
      { question: "Can I create a circular profile picture or avatar?", answer: "Yes. Enable Circle Avatar mode to crop square photos into a circle with rounded perimeter." },
      { question: "Can I round only specific corners, like top corners for a card UI?", answer: "Yes. Unlock the individual corner controls to set custom pixel radii for top-left, top-right, bottom-right, and bottom-left independently." },
      { question: "Does rounding corners change the dimensions of my photo?", answer: "No. The image maintains its original width and height; only the outer corner pixels outside the radius boundary are clipped." },
      { question: "Are rounded corner masks and circle avatars generated locally?", answer: "Yes. Clipping paths and alpha corner masking execute strictly in your browser canvas without uploading images to any external endpoint." }
    ]
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
    features: ['Solid, Dashed, Dotted', 'Double & Rounded', 'Custom Border Width', 'HEX/RGB Color Picker', 'PNG/JPG/WebP'],
    howTo: [
      { title: "Upload Photo", desc: "Select the image you want to outline or frame." },
      { title: "Customize Border Settings", desc: "Set border width in pixels, choose border color, select border style (solid, dashed, dotted, double), and adjust corner radius." },
      { title: "Download Bordered Image", desc: "Choose whether the border extends outward or overlays inward, preview the design, and download your bordered image." }
    ],
    faq: [
      { question: "What is the difference between inner and outer border placement?", answer: "An outer border expands the canvas dimensions to frame the image on the outside, while an inner border draws over the outer edges without altering original dimensions." },
      { question: "Which border styles can I apply?", answer: "You can choose between solid lines, dashed outlines, dotted borders, and double borders, with custom thickness and color." },
      { question: "Can I combine rounded corners with an image border?", answer: "Yes. Adjusting the border radius slider curves both the border and the photo corners together for a modern UI card appearance." },
      { question: "What export formats are supported for bordered photos?", answer: "You can export your bordered photo in PNG, JPG, or WebP formats at full resolution." },
      { question: "Can I add decorative borders and frames without uploading photos?", answer: "Yes. Border width offsets, dash patterns, and color strokes are rendered locally on the canvas before instant client-side download." }
    ]
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
    features: ['Polaroid & Caption', 'Soft Drop Shadow', 'Frosted Glass Frame', 'Instagram Post Style', 'White & Black Gallery'],
    howTo: [
      { title: "Upload Photo", desc: "Select the picture you want to place inside a decorative frame." },
      { title: "Select Frame Style & Add Caption", desc: "Choose from Polaroid, Gallery Wood, Soft Shadow, Neon Glow, or Minimalist frames, and optionally add caption text." },
      { title: "Download Framed Photo", desc: "Preview the framed composition and download high-resolution PNG or JPG files." }
    ],
    faq: [
      { question: "Can I create authentic Polaroid-style prints with handwritten captions?", answer: "Yes. Select the Polaroid preset to generate the classic wide bottom border and type your personalized caption." },
      { question: "Which framing styles are available?", answer: "Presets include Classic Gallery White, Dark Museum, Polaroid print, Floating Drop Shadow, Frosted Acrylic, and Vibrant Neon glow." },
      { question: "Does adding a frame reduce the resolution of the original photo?", answer: "No. The frame expands the outer canvas boundaries to accommodate border margins while preserving your photo at original resolution." },
      { question: "Can I customize caption text size and styling?", answer: "Yes. You can edit the caption string, select from multiple typography options, and preview the final framed layout before downloading." },
      { question: "Are Polaroid, shadow, and glass photo frames rendered locally?", answer: "Yes. Frame styles, drop shadows, and captions are rendered directly on the browser canvas without sending photos to cloud rendering services." }
    ]
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
    features: ['2, 3, 4, 6, 9+ Photos', 'Grid & Masonry', 'Spacing & Radius Sliders', 'Background Color', 'PNG/JPG Export'],
    howTo: [
      { title: "Upload Multiple Photos", desc: "Select 2 to 6 images from your device to include in the collage." },
      { title: "Choose Grid Layout & Spacing", desc: "Select a layout preset (such as 2x2 grid, side-by-side, or vertical stack) and adjust cell gap, border radius, and background color." },
      { title: "Download Finished Collage", desc: "Preview the assembled grid and download your combined photo collage in high-resolution PNG or JPG." }
    ],
    faq: [
      { question: "How are images with different aspect ratios fitted into collage cells?", answer: "Images are scaled and center-cropped to fill each grid cell proportionately, ensuring a balanced, aligned collage layout." },
      { question: "Can I adjust the gap between photos and the outer border?", answer: "Yes. The gap slider controls the spacing between photos, and you can customize the background color shown in the gaps." },
      { question: "Can I reorder or delete photos in the collage?", answer: "Yes. You can remove individual photos or replace images in specific cells before rendering the final collage." },
      { question: "How many photos can I include in a single collage?", answer: "The tool supports 2 to 6 photos across versatile grid templates including dual side-by-side, 3-column banners, and 4-picture 2x2 grids." },
      { question: "Can I build photo collages and grid layouts without uploading images?", answer: "Yes. Multi-image arrangement, grid spacing, and border radius styling are composited locally in browser memory and exported directly." }
    ]
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
    features: ['16x16 to 512x512', 'favicon.ico Included', 'site.webmanifest PWA', 'HTML Head Snippet', 'Download ZIP'],
    howTo: [
      { title: "Upload Square Icon or Logo", desc: "Select a high-resolution square graphic (512x512 PNG recommended) for your website favicon." },
      { title: "Review Generated Sizes", desc: "Inspect the automatically generated icon sizes including 16x16, 32x32, 48x48, 180x180 Apple Touch, and 192x192 Android." },
      { title: "Download ZIP & Copy HTML", desc: "Download the complete icon package as a ZIP archive and copy the ready-to-paste HTML <link> tags for your website header." }
    ],
    faq: [
      { question: "What file formats and sizes are included in the generated ZIP?", answer: "The bundle includes standard 16x16 and 32x32 favicons, a 48x48 icon, a 180x180 Apple Touch Icon, and a 192x192 Android Chrome icon." },
      { question: "Why does my website need multiple favicon sizes?", answer: "Different platforms require specific resolutions: browser tabs use 16x16, bookmarks use 32x32, iPhones use 180x180, and Android home screens use 192x192." },
      { question: "How do I add the generated favicons to my website?", answer: "Unzip the files into your website root directory, copy the provided <link> meta tags, and paste them inside your HTML <head> section." },
      { question: "What is the best source image to upload for favicon generation?", answer: "A high-contrast square PNG with a transparent background, at least 512x512 pixels, provides the sharpest downsampled icons across all sizes." },
      { question: "Are multi-resolution icons and favicon.ico files generated locally?", answer: "Yes. Icon scaling (16x16 to 512x512) and binary ICO bundling execute completely in your browser without uploading brand logos." }
    ]
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
    features: ['Remove Metadata & Comments', 'Remove Empty Groups', 'Round Path Decimals', 'Before/After Comparison', 'Instant Download'],
    howTo: [
      { title: "Paste SVG Code or Upload File", desc: "Upload an .svg vector file or paste raw SVG markup directly into the editor." },
      { title: "Review Minification Savings", desc: "The optimizer automatically strips XML doctypes, editor metadata, comments, and empty groups, displaying byte reductions." },
      { title: "Copy Minified Code or Download", desc: "Copy the clean SVG code to your clipboard for inline HTML use or download the optimized .svg file." }
    ],
    faq: [
      { question: "How does SVG optimization reduce file size without altering graphics?", answer: "Vector editors like Illustrator and Figma export unnecessary XML headers, editor namespaces, comments, and extra precision decimals. Removing them shrinks file size without changing visual paths." },
      { question: "Can I use the optimized SVG directly inline in HTML or React?", answer: "Yes. The cleaned markup is sanitized and formatted for direct copy-pasting into HTML files, JSX components, or CSS background-image properties." },
      { question: "Does optimizing an SVG strip IDs and classes needed for styling?", answer: "Redundant and empty attributes are removed, but functional path data, viewBox attributes, and necessary visual coordinates are preserved." },
      { question: "What file size reduction can I expect?", answer: "SVGs exported from graphic design software often see file size reductions of 20% to 60%, depending on the volume of embedded metadata." },
      { question: "Can I clean SVG code and remove vector metadata without uploading files?", answer: "Yes. XML DOM parsing, decimal precision rounding, and metadata cleanup run entirely inside client-side JavaScript." }
    ]
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
    features: ['Multiple Frame Import', 'Custom Speed / Delay', 'Forward / Bounce Order', 'Interactive Player', 'Client-Side GIF'],
    howTo: [
      { title: "Upload Animation Frames", desc: "Select or drag multiple sequential photos or illustrations into the frame timeline." },
      { title: "Configure Speed & Direction", desc: "Adjust frame delay (milliseconds per frame), set playback direction (Forward, Reverse, Ping-Pong), and preview the animation." },
      { title: "Generate and Download GIF", desc: "Click Download Animated .GIF to compile and save your animated GIF file directly from your browser." }
    ],
    faq: [
      { question: "What frame delay setting produces a smooth animated GIF?", answer: "A delay between 80ms and 150ms per frame (roughly 7 to 12 frames per second) produces natural animation for photo sequences and stop-motion." },
      { question: "What does the Ping-Pong playback mode do?", answer: "Ping-Pong plays the frames from first to last, then plays them in reverse back to the start, creating an endless, seamless bounce loop." },
      { question: "Can I reorder or delete specific frames before generating the GIF?", answer: "Yes. You can remove individual frames or rearrange their sequence in the timeline before compiling the animation." },
      { question: "How do I keep my animated GIF file size manageable?", answer: "To keep file size compact, limit the total number of frames, use consistent canvas dimensions, and avoid unnecessary high-resolution source images." },
      { question: "Are my image frames uploaded to a server to compile the GIF?", answer: "The image is processed in your browser using a client-side GIF encoder and is not sent to a Zubware server for processing." }
    ]
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
    features: ['Bulk Multi-File Conversion', 'PNG, JPG, WebP, BMP, AVIF', 'Individual & ZIP Download', 'Quality Slider', 'Fast Local'],
    howTo: [
      { title: "Add Images to Batch Queue", desc: "Drag and drop multiple images in JPG, PNG, WebP, GIF, or BMP formats into the converter." },
      { title: "Select Output Format & Quality", desc: "Choose a target format (PNG, JPG, or WebP) for the entire batch and adjust the quality slider." },
      { title: "Convert and Download ZIP", desc: "Process all images concurrently in your browser and download individual files or the entire batch as a ZIP." }
    ],
    faq: [
      { question: "How many images can I convert at the same time?", answer: "You can convert dozens of images simultaneously. Because processing executes locally in your browser memory, performance depends on your device RAM." },
      { question: "Can I mix different input formats in the same batch queue?", answer: "Yes. You can upload a mixture of JPG, PNG, and WebP files together and convert them all into a unified target format." },
      { question: "What happens to transparent backgrounds when batch converting to JPG?", answer: "Since JPG does not support transparency, transparent areas in PNG or WebP files are automatically rendered with a clean white background." },
      { question: "Can I download all converted images in a single archive?", answer: "Yes. Click Download All as ZIP to export every converted file in an organized ZIP package with one click." },
      { question: "Does batch image conversion process multiple photos without server uploads?", answer: "Yes. All queued JPG, PNG, and WebP photos are converted concurrently using your browser WebAssembly and canvas engines with zero server uploads." }
    ]
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
    features: ['Interactive Split Slider', 'Magnifier Lens', 'Bytes Saved & % Metrics', 'Visual Quality Rating', 'Instant Export'],
    howTo: [
      { title: "Upload Test Image", desc: "Select any high-resolution photo to test compression behavior." },
      { title: "Adjust Quality and Encoding Format", desc: "Use the quality slider and switch between JPEG and WebP to see real-time file size reductions." },
      { title: "Compare Split-Screen and Zoom", desc: "Drag the split-screen divider and toggle 2x/4x zoom to inspect pixel sharpness, compression artifacts, and byte savings." }
    ],
    faq: [
      { question: "How does the interactive split slider help find the optimal compression level?", answer: "The split slider shows the uncompressed original on the left and the compressed output on the right, letting you sweep across fine details to spot where artifacts start." },
      { question: "What visual artifacts should I watch for when compressing images?", answer: "Look for blockiness in solid color areas (macroblocking), halo ringing around high-contrast edges, and banding across smooth sky or wall gradients." },
      { question: "How does WebP compare to JPEG at identical quality settings?", answer: "WebP typically produces 25% to 35% smaller file sizes than JPEG at the same visual fidelity, while preserving better edge sharpness." },
      { question: "Can I zoom in to inspect fine textures and text?", answer: "Yes. Activate Zoom mode to inspect high-frequency textures like grass, foliage, and text rendering at magnified scale." },
      { question: "Does the side-by-side compression comparison run locally in browser memory?", answer: "Yes. Original and compressed canvas layers, split-screen sweeping, and pixel zoom loupes operate entirely in browser memory." }
    ]
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
    features: ['Batch HEIC/HEIF Conversion', 'Local Browser Processing', 'Custom Quality Slider', 'Dimension Resizing', 'ZIP Download'],
    tags: ['heic', 'heif', 'jpg', 'image converter', 'iphone'],
    howTo: [
      { title: "Upload iPhone HEIC Photos", desc: "Select or drag Apple HEIC or HEIF images from your iPhone or iPad." },
      { title: "Configure Quality and Dimensions", desc: "Adjust JPG quality, select target dimensions (Original, 4K, 1080p), and choose whether to strip metadata." },
      { title: "Convert and Download", desc: "Convert the files locally in your browser and download individual JPGs or all files in a ZIP archive." }
    ],
    faq: [
      { question: "Why can some Windows computers and Android phones not open HEIC files?", answer: "HEIC (High Efficiency Image Coding) is Apple default image container. Many non-Apple applications and web forms require standard JPEG format for compatibility." },
      { question: "Does converting HEIC to JPG reduce photo clarity?", answer: "Converting to JPG at 90% or higher quality retains excellent visual fidelity indistinguishable from the original HEIC capture." },
      { question: "Can I batch convert multiple HEIC photos at once?", answer: "Yes. You can upload multiple HEIC photos, convert them in sequence, and download all resulting JPGs packaged in a single ZIP." },
      { question: "Can I resize the photo dimensions during conversion?", answer: "Yes. You can keep original dimensions or downscale to standard presets like 4K or 1080p Full HD to reduce file size." },
      { question: "Can I convert Apple HEIC and HEIF photos without uploading them to cloud servers?", answer: "Yes. The libheif WebAssembly decoder runs directly inside your browser to convert iPhone HEIC photos into standard JPGs with complete privacy." }
    ]
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
    tags: ['bulk', 'rename', 'resize', 'images', 'e-commerce', 'property'],
    howTo: [
      { title: "Upload Photo Batch", desc: "Drag a folder or selection of image files into the batch processing queue." },
      { title: "Configure Renaming and Resizing Rules", desc: "Set prefix, sequence numbering, casing rules, target dimensions, and format preferences." },
      { title: "Download Renamed & Resized ZIP", desc: "Preview the new filenames and dimensions in the table, then download the complete organized archive." }
    ],
    faq: [
      { question: "What renaming patterns can I create for my images?", answer: "You can combine a base name, prefix, suffix, incremental numbering sequence (with zero-padding like 001, 002), and text find-and-replace rules." },
      { question: "How does fit mode handle images with different aspect ratios?", answer: "Fit modes include \"contain\" (scales to fit without cropping), \"cover\" (fills exact dimensions by cropping excess), and \"stretch\" (forces exact dimensions)." },
      { question: "Can I clean up spaces and special characters for web-friendly filenames?", answer: "Yes. You can replace spaces with hyphens or underscores and strip non-alphanumeric characters to generate SEO- and web-safe filenames." },
      { question: "Can I convert image formats while renaming and resizing?", answer: "Yes. You can simultaneously convert all files to JPG, PNG, or WebP with custom quality compression settings." },
      { question: "Can I rename and resize image batches without sending files to a server?", answer: "Yes. Filename formatting rules, canvas resizing, and ZIP packaging operate locally in your browser memory without uploading any photos." }
    ]
  },
  {
    id: 'passport-photo-maker',
    title: "Passport & Visa Photo Maker",
    navTitle: "Passport Photo Maker",
    description: "Create passport-style and visa-style photos online. Crop to popular document dimensions, adjust lighting, and generate printable sheets directly in your browser.",
    icon: '🪪',
    path: '/passport-photo-maker.html',
    filename: 'passport-photo-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Standard Country Dimension Profiles",
      "Face Position Alignment Guide",
      "Background Color Changer",
      "Photo Touch-Up & Lighting Controls",
      "Print Sheet Generator (A4, 4x6 in)"
    ],
    howTo: [
      { title: "Upload Portrait Photo", desc: "Select a clear, front-facing portrait photo with even lighting and a neutral expression." },
      { title: "Select Dimension Preset & Align Face", desc: "Choose a standard passport-style preset (such as 2x2 inches or 35x45 mm) and align your face using the framing guide." },
      { title: "Arrange Sheet & Download", desc: "Select your preferred background shade, choose single photo or multi-photo printable sheet layout, and download as JPG or PDF." }
    ],
    faq: [
      { question: "Can I create multiple passport-style photos on one printable sheet?", answer: "Yes. You can arrange multiple copies of your photo onto standard 4x6 inch, 5x7 inch, or A4 sheets with optional cut marks for convenient home or photo lab printing." },
      { question: "Which common document size presets are available?", answer: "The tool provides presets for common document sizes including 2x2 inches (51x51 mm), 35x45 mm, and 3.5x4.5 cm, as well as custom pixel and millimeter dimensions." },
      { question: "Does this tool guarantee official acceptance by passport authorities?", answer: "No automated tool can guarantee official acceptance. Different passport and visa agencies have strict physical lighting, expression, and head-measurement rules. This tool helps you format, crop, and arrange photos according to common dimensions before submission." },
      { question: "Can I adjust lighting and change background shades?", answer: "Yes. You can fine-tune brightness, contrast, and warmth, and select standard plain white, off-white, light blue, or neutral gray backdrops." },
      { question: "Are passport and visa application photos processed securely without server uploads?", answer: "Yes. Official dimension cropping, biometric centering guidelines, and printable multi-photo sheets are generated entirely in your browser memory." }
    ]
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
    features: ['9:16 Vertical Shorts/Reels', 'Deterministic Animation', 'Grass Lawn & Custom Backgrounds', 'Web Audio Synthesizer Effects', 'Client-Side WebM/MP4 Export'],
    howTo: [
      { title: "Upload Character Artwork & Select Layout", desc: "Upload your main puzzle character graphic, choose 9:16 Shorts canvas dimensions, and select background colors." },
      { title: "Configure Puzzle Pieces & Timer Countdown", desc: "Position cutout puzzle pieces, designate the correct match, set the countdown timer duration, and add reveal effects." },
      { title: "Preview Animation & Render Video", desc: "Play the interactive puzzle simulation in real-time, then click Render Video to record and export the MP4/WebM video." }
    ],
    faq: [
      { question: "What are 'Matching Parts' puzzle videos on YouTube Shorts and TikTok?", answer: "They are viral, high-retention short-form videos where viewers are challenged to guess which cutout piece fits into an incomplete character graphic before a countdown timer runs out." },
      { question: "What video aspect ratio is generated by the puzzle maker?", answer: "The studio defaults to a standard 9:16 vertical resolution (1080x1920 pixels), optimized specifically for YouTube Shorts, Instagram Reels, and TikTok feeds." },
      { question: "Can I customize the countdown duration and decoy pieces?", answer: "Yes. You can set the countdown length (such as 3 to 10 seconds), rearrange multiple decoy pieces, and configure the winning match reveal timing." },
      { question: "Can I add background music and sound effects to the puzzle animation?", answer: "Yes. You can attach custom background music tracks and audio cues that play in sync with the countdown ticks and the final puzzle snap." },
      { question: "How is the puzzle animation exported without server processing?", answer: "The canvas animation is recorded in real time directly inside your browser using the MediaStream Recording API, producing a downloadable video file on your device." }
    ],
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
    howTo: [
      { title: "Select Mood, Key & Chord Progression", desc: "Choose from chillhop, rainy day, or midnight study moods, and pick musical keys and chord progressions." },
      { title: "Layer Ambient Sounds & Vinyl FX", desc: "Blend customizable ambient layers including vinyl crackle, gentle rain, cafe chatter, and tape flutter." },
      { title: "Generate & Export Lofi Audio Track", desc: "Play real-time synthesized beats using the Web Audio engine and export as a high-quality WAV audio file." }
    ],
    faq: [
      { question: "How does the Lofi Song Maker generate music without samples?", answer: "It uses the browser's native Web Audio API (AudioContext) to synthesize musical chords, Rhodes piano tones, analog basslines, and drum patterns algorithmically in real time." },
      { question: "Can I adjust individual volume levels for ambient background layers?", answer: "Yes. Independent audio mixer faders let you balance rain, vinyl static, tape hiss, and cafe ambience against the musical melody." },
      { question: "Are the generated lofi tracks royalty-free for YouTube and streaming?", answer: "Yes. Music synthesized by this tool is dynamically generated royalty-free audio that you can use in study streams, videos, and podcasts without copyright strikes." },
      { question: "What audio export format is generated?", answer: "You can download uncompressed 44.1kHz stereo WAV audio files directly to your device." },
      { question: "Does the audio generator require an ongoing internet connection?", answer: "Once loaded in your browser cache, the algorithmic audio synthesis and DSP effects execute locally in your web browser." }
    ],
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
    features: ['One-Click Automatic Lofi Processing', '320 kbps LAME MP3 Export', 'Local Browser Processing', 'Simple Intuitive Controls', 'Mobile Friendly'],
    howTo: [
      { title: "Upload Any Audio Track", desc: "Select an MP3, WAV, or OGG audio file from your device to transform into a lofi version." },
      { title: "Apply Lofi DSP Effects & Filters", desc: "Adjust vintage tape pitch wobble, low-pass telephone EQ filter, slow down tempo, and mix vinyl crackle." },
      { title: "Render & Download Lofi Audio", desc: "Preview your customized sound in real time and export the processed audio file directly to your device." }
    ],
    faq: [
      { question: "How does the tool transform standard music into vintage lofi audio?", answer: "It applies digital signal processing (DSP) filters: a Biquad low-pass filter cutting harsh highs, an LFO modulating subtle pitch vibrato (tape flutter), and mixed vinyl surface noise." },
      { question: "Can I slow down the playback speed and pitch?", answer: "Yes. The tempo and pitch slider lets you slow down playback by 5% to 25% for a signature relaxed chillhop feel." },
      { question: "Is there a file size limit for uploaded audio?", answer: "The tool processes audio files up to 50MB smoothly using Web Audio API buffer decoding directly in browser memory." },
      { question: "Can I toggle individual effects on and off?", answer: "Yes. You can independently enable or disable vinyl crackle, cassette tape noise, room reverb, and EQ filtering." },
      { question: "Is my uploaded song uploaded to any server?", answer: "No. All audio decoding, effects processing, and WAV rendering occur client-side on your computer." }
    ],
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
    features: ['Slowed Playback Speed Control', 'Acoustic Reverb Presets', '320 kbps LAME MP3 Export', 'In-Browser Processing', 'Local Browser Processing'],
    howTo: [
      { title: "Upload Your Song File", desc: "Drag and drop or select an MP3, WAV, or AAC audio track to process." },
      { title: "Configure Slowdown Speed & Reverb Space", desc: "Adjust the playback speed slider (0.75x to 0.95x) and select reverb space: Bedroom, Church, Cathedral, or Cosmic Echo." },
      { title: "Process & Export Slowed Audio", desc: "Listen to the live processed audio preview and click Export to download your slowed-and-reverb audio file." }
    ],
    faq: [
      { question: "What is the 'Slowed and Reverb' aesthetic?", answer: "Popularized on TikTok and YouTube, slowed and reverb (also known as chopped and screwed derivative) lowers the tempo and pitch of a song while routing it through lush atmospheric reverberation." },
      { question: "Which reverb algorithm is used by this tool?", answer: "The tool utilizes a Web Audio ConvolverNode with synthetic impulse response convolution, simulating realistic spatial acoustic reflections without robotic metallic artifacts." },
      { question: "Does slowing down the audio lower its musical pitch?", answer: "Yes. By default, slowing playback resamples the waveform, dropping the pitch proportionately to create a deeper, dreamy vocal timbre." },
      { question: "What audio output format is generated?", answer: "The processed audio renders into a clean 16-bit 44.1kHz stereo WAV audio file ready for video editing." },
      { question: "Are my audio files uploaded to a remote cloud server?", answer: "No. File processing is performed within your browser using Web Audio API buffers. Files are not uploaded to Zubware servers." }
    ],
    tags: ['slowed', 'reverb', 'slowed and reverb', 'mp3', 'audio effect', 'speed changer', 'music', 'creator']
  },
  {
    id: 'gst-invoice-generator',
    title: "GST Invoice Generator — Create & Download Invoices Online",
    navTitle: "GST Invoice",
    description: "Create professional GST invoices online with automatic CGST, SGST, and IGST tax calculation, HSN/SAC codes, dynamic UPI payment QR codes, and PDF export.",
    icon: '🧾',
    path: '/gst-invoice-generator.html',
    filename: 'gst-invoice-generator.html',
    category: '💼 Business Tools',
    badge: 'New',
    features: [
      "Complete Supplier & Buyer GSTIN Billing",
      "Automatic CGST, SGST & IGST Calculation",
      "HSN/SAC Code & Item Discounts",
      "Bank Details & Dynamic UPI Payment QR",
      "Print & High-Res PDF Invoice Export",
      "Local Browser Draft Saving"
    ],
    tags: ['gst', 'invoice', 'gst invoice generator', 'bill generator', 'pdf', 'tax invoice', 'business', 'cgst', 'sgst', 'igst', 'india', 'tax'],
    howTo: [
      { title: "Enter Supplier & Customer Details", desc: "Add your business name, GSTIN, address, state of supply, and customer billing information." },
      { title: "Add Line Items & Tax Slabs", desc: "Enter item descriptions, HSN/SAC codes, quantities, and rates. The system automatically calculates CGST/SGST or IGST based on place of supply." },
      { title: "Add Payment Details & Download PDF", desc: "Include bank details, UPI QR code, terms, and authorized signature, then click Download PDF or Print Invoice." }
    ],
    faq: [
      { question: "How does the tool calculate CGST, SGST, and IGST?", answer: "The tool compares the supplier state with the place of supply. For intra-state transactions, the tax rate is split equally into CGST and SGST. For inter-state transactions, the full rate is applied as IGST." },
      { question: "Can I generate a scannable UPI payment QR code on the invoice?", answer: "Yes. Entering your UPI ID automatically generates a dynamic payment QR code with the invoice amount embedded so customers can scan and pay instantly." },
      { question: "Can I save invoice drafts and resume editing later?", answer: "Yes. Click Save Draft to store your current invoice in your browser local storage. You can restore your draft anytime to make updates or reprint." },
      { question: "What export and printing options are available?", answer: "You can download the invoice as a formatted PDF file or use the direct Print option to print on standard A4 paper." },
      { question: "Is my confidential business or customer billing data sent to a server?", answer: "The invoice is generated entirely within your browser. Your customer lists, bank accounts, and billing numbers are not uploaded to Zubware servers." }
    ]
  },
  {
    id: 'pdf-merge',
    title: 'PDF Merge',
    navTitle: 'PDF Merge',
    description: 'Merge PDF files online for free. Combine multiple PDFs into one document with drag-and-drop page reordering, instant preview, and local browser processing.',
    icon: '🧩',
    path: '/pdf-merge.html',
    filename: 'pdf-merge.html',
    category: 'PDF Tools',
    badge: 'Free',
    features: ['Merge Multiple PDF Files', 'Drag-and-Drop Reorder', 'Fast Local Processing', 'Secure & Private', 'Device-Resource Based Sizing'],
    howTo: [
      { title: 'Upload PDF Documents', desc: 'Select or drag multiple PDF files from your device into the merge queue.' },
      { title: 'Arrange Document Order', desc: 'Use the Up and Down arrow buttons to set your preferred file order, or remove unwanted documents.' },
      { title: 'Merge and Download', desc: 'Click Merge PDFs to combine all documents into a single PDF directly in your browser.' }
    ],
    faq: [
      { question: 'How does the PDF Merge tool combine multiple documents?', answer: 'It loads the byte streams of your selected PDF files into memory and appends pages in sequence into a new combined PDF using client-side WebAssembly, preserving text, vector lines, and embedded images.' },
      { question: 'Can I change the document order before merging?', answer: 'Yes. Use the move up and move down arrow buttons on each listed file to organize the exact sequence before combining.' },
      { question: 'Is there a limit on how many PDF files I can merge at once?', answer: 'You can merge multiple files in a single session. Because all processing runs directly in your browser memory, performance depends primarily on your device available RAM.' },
      { question: 'Will hyperlinks and visual assets survive the merge process?', answer: 'Core page contents, text, and visual assets are fully preserved. Complex interactive cross-document bookmarks may be flattened to fit the combined file structure.' },
      { question: 'Can I merge password-protected PDF files?', answer: 'Encrypted or password-protected PDFs must be unlocked before merging. Use the Zubware Unlock PDF tool first to remove password restrictions, then add the files to the merge queue.' }
    ]
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
    features: ['Extract Custom Ranges', 'Split All Pages', 'Page Thumbnail Preview', 'ZIP Download Support', '100% Offline Capable'],
    howTo: [
      { title: 'Select Your PDF', desc: 'Upload or drop a multi-page PDF document to inspect its total page count.' },
      { title: 'Choose Split Mode', desc: 'Select All Pages to separate every page individually, or choose Custom Page Range to define specific pages (e.g., 1-3, 5).' },
      { title: 'Extract and Save', desc: 'Process the file to download selected pages as a new PDF or download all separated pages in a ZIP archive.' }
    ],
    faq: [
      { question: 'What is the difference between splitting all pages and custom ranges?', answer: 'All Pages separates every individual page into its own standalone PDF file bundled in a ZIP archive, whereas Custom Page Range extracts only specified page numbers into a single new PDF document.' },
      { question: 'How should I format custom page ranges?', answer: 'You can use comma-separated page numbers and hyphenated ranges such as 1-3, 5, 8-10 to pinpoint exact pages.' },
      { question: 'Does splitting a PDF affect the quality or resolution of its contents?', answer: 'No. Page extraction directly copies existing document streams without rasterizing or recompressing text or images, so quality remains identical to the original.' },
      { question: 'Can I split password-protected PDFs?', answer: 'If the PDF requires a password to open, unlock it first using Zubware Unlock PDF before splitting.' },
      { question: 'Can I extract just a single page out of a large document?', answer: 'Yes. Switch to Custom Page Range mode and enter that specific page number (e.g. 4) to extract just that single page into a new PDF.' }
    ]
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
    features: ['JPG, PNG, WebP, BMP, GIF', 'A4 & Letter Layouts', 'Custom Margins & Fit', 'Drag Reorder', 'Client-Side Processing'],
    howTo: [
      { title: 'Add Images', desc: 'Upload JPG, PNG, WebP, BMP, or GIF images into the conversion list.' },
      { title: 'Customize Layout', desc: 'Choose paper size (A4 or Letter), orientation (Portrait or Landscape), margins, and image fit mode (Contain, Cover, Fill).' },
      { title: 'Convert and Download', desc: 'Click Create PDF to generate the unified PDF document directly in your browser.' }
    ],
    faq: [
      { question: 'Which image formats are supported?', answer: 'The tool supports standard web and photo formats including JPG/JPEG, PNG, WebP, BMP, and GIF.' },
      { question: 'Can I adjust margins and page orientation?', answer: 'Yes. You can select document-wide page dimensions (A4 or US Letter), portrait or landscape orientation, margin sizes (None, Small, Large), and fit modes (Contain, Cover, Fill).' },
      { question: 'Can I reorder the images before generating the PDF?', answer: 'Yes. Use the move up and move down controls on each image card to arrange your photos into your preferred sequence.' },
      { question: 'What is the difference between Contain, Cover, and Fill fit modes?', answer: 'Contain scales the image to fit entirely within the page margins without cropping. Cover expands the image to fill the entire page area while trimming excess edges. Fill stretches the image to touch all margins.' },
      { question: 'Is any watermark added to the created PDF?', answer: 'No. All generated documents are completely clean with zero watermarks or Zubware branding stamps.' }
    ]
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
    features: ['PNG, JPG & WebP Output', 'ZIP Batch Download', 'Page Thumbnail Preview', 'High Resolution', 'No Server Uploads'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Select or drop a PDF file to inspect its pages and document details.' },
      { title: 'Choose Image Format', desc: 'Select PNG (lossless), JPEG (compressed), or WebP output format.' },
      { title: 'Render and Export', desc: 'Download individual page images or export all converted pages bundled in a single ZIP file.' }
    ],
    faq: [
      { question: 'What image formats can I export PDF pages into?', answer: 'You can export pages as PNG (lossless with crisp text), JPEG (compact file size), or modern WebP images.' },
      { question: 'Can I preview the pages before downloading?', answer: 'Yes. The tool renders a visual gallery of all converted pages with interactive preview modals so you can inspect quality before saving.' },
      { question: 'Can I download all converted pages at once?', answer: 'Yes. Click Download All as ZIP to receive an archive containing all exported page images organized sequentially.' },
      { question: 'What resolution are the output images rendered at?', answer: 'Pages are rendered using high-density canvas scaling (1.8x supersampling) to ensure text, diagrams, and small prints remain crisp and readable.' },
      { question: 'How does this tool differ from extracting embedded photos?', answer: 'This tool renders each complete PDF page into a high-resolution image including fonts, vector lines, and layouts, rather than pulling raw embedded photo files.' }
    ]
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
    features: ['90°, 180°, 270° Rotation', 'All or Selected Pages', 'Live Visual Thumbnails', 'Fast Local Processing', 'Local Browser Processing'],
    howTo: [
      { title: 'Load PDF File', desc: 'Upload the document to display thumbnail previews of each page.' },
      { title: 'Choose Rotation Angle and Scope', desc: 'Select 90°, 180°, or 270° clockwise, and choose whether to apply rotation to all pages or selected pages.' },
      { title: 'Save Rotated PDF', desc: 'Click Rotate & Download to save the permanently re-oriented PDF document.' }
    ],
    faq: [
      { question: 'Can I rotate individual pages instead of the whole document?', answer: 'Yes. Switch the target scope to Selected Pages and check only the specific pages you wish to rotate.' },
      { question: 'Is the rotation permanent when the PDF is downloaded?', answer: 'Yes. The tool updates the rotation metadata tag within the PDF structure so that the new orientation is permanently respected in all PDF viewers, printers, and browsers.' },
      { question: 'Which rotation angles are supported?', answer: 'You can rotate pages by 90 degrees clockwise, 180 degrees (upside down), or 270 degrees clockwise (90 degrees counterclockwise).' },
      { question: 'Does rotating a PDF degrade the text or image resolution?', answer: 'No. Rotating modifies the viewport orientation dictionary without re-encoding page streams, meaning zero loss of fidelity or clarity.' },
      { question: 'Can I reset the rotation if I rotate a page too many times?', answer: 'Yes. Each click advances by your chosen rotation angle (90°, 180°, or 270°). Rotating four times (360°) returns pages to their original orientation.' }
    ]
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
    features: ['Visual Page Thumbnails', 'One-Click Page Removal', 'Instant Local Export', 'Private & Secure', 'No Upload Bottleneck'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Load your file to display interactive page thumbnails in a visual grid.' },
      { title: 'Mark Pages to Remove', desc: 'Click on any page thumbnail to flag it for deletion with a red outline and trash icon.' },
      { title: 'Export Cleaned PDF', desc: 'Click Delete & Export to download a fresh PDF with the selected pages omitted.' }
    ],
    faq: [
      { question: 'How do I select which pages to delete?', answer: 'Simply click directly on any page thumbnail in the grid. The thumbnail will highlight in red with a trash badge indicating it is marked for removal. Click again to unmark.' },
      { question: 'Can I delete all pages in the PDF?', answer: 'No. A valid PDF requires at least one remaining page, so the tool prevents deleting the entire document.' },
      { question: 'Does deleting pages renumber the remaining pages?', answer: 'The remaining pages automatically collapse into consecutive order in the output document.' },
      { question: 'Will deleting pages reduce the overall PDF file size?', answer: 'Yes. Removing unwanted pages strips their content streams and associated embedded assets, resulting in a lighter file.' },
      { question: 'Can I select multiple non-adjacent pages to delete?', answer: 'Yes. Simply click on each thumbnail card you wish to remove. Each selected page is highlighted with a red outline and trash icon until exported.' }
    ]
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
    features: ['Custom Page Ranges', 'Visual Selection Grid', 'Instant PDF Generation', 'Client-Side Processing', 'Generous Client Limits'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Drop or select the document to preview all page thumbnails.' },
      { title: 'Select Pages to Extract', desc: 'Click thumbnails or enter custom page numbers/ranges (e.g., 1, 3-5) into the range input.' },
      { title: 'Download Extracted PDF', desc: 'Click Extract Pages to generate and download a new PDF containing only your chosen pages.' }
    ],
    faq: [
      { question: 'How do I specify which pages to extract?', answer: 'You can either click on thumbnail cards directly or type page ranges into the range input field (for example: 1, 3-5, 8). The visual selector and text input stay synchronized.' },
      { question: 'What is the difference between Extract Pages and Split PDF?', answer: 'Extract Pages allows you to selectively pull specific non-consecutive or consecutive pages into a single new consolidated PDF file, whereas Split PDF typically segments files or outputs all individual pages into a ZIP archive.' },
      { question: 'Does extracting pages keep the original PDF file intact?', answer: 'Yes. Your original file on your computer is completely untouched. The tool creates a new separate PDF file containing only your selected pages.' },
      { question: 'Are text layers, fonts, and form fields preserved?', answer: 'Yes. Pages are copied structurally using PDF-level cloning, retaining embedded vector fonts, vector lines, and page formatting.' },
      { question: 'Can I reorder pages while extracting them?', answer: 'Extracted pages maintain their relative order in the output document. To freely customize the sequence of pages, use the dedicated Zubware Reorder PDF Pages tool.' }
    ]
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
    features: ['Drag & Drop Reordering', 'Visual Page Grid', 'Instant Local Re-assembly', 'Preserves Quality', 'No Signup Needed'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your file to see thumbnail cards of every page in original sequence.' },
      { title: 'Rearrange Page Sequence', desc: 'Use the Left and Right arrows beneath thumbnails to reposition pages in your desired sequence.' },
      { title: 'Export Reordered PDF', desc: 'Click Export PDF to download the document with your new page organization.' }
    ],
    faq: [
      { question: 'How do I rearrange pages using this tool?', answer: 'Each page card features left and right arrow buttons. Clicking an arrow shifts that page forward or backward in the sequence.' },
      { question: 'Can I see visual previews of the pages as I rearrange them?', answer: 'Yes. High-resolution canvas thumbnails display the actual visual contents and original page numbers of each page to make organizing straightforward.' },
      { question: 'Does reordering alter the text content or formatting of the pages?', answer: 'No. The internal contents of each page remain completely unchanged; only the order in which they appear in the PDF catalog is rearranged.' },
      { question: 'Is there a page count limit for reordering?', answer: 'You can reorder documents of varying lengths. For very large documents (hundreds of pages), thumbnail rendering speed will depend on your device processing power.' },
      { question: 'Can I move a page directly toward the beginning or end of a document?', answer: 'Use the arrow buttons to step a page forward or backward through the sequence. For documents with many pages, you can click repeatedly until the page reaches your target position.' }
    ]
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
    features: ['Text & Image Logo Support', 'Custom Opacity & Angle', 'Flexible Positions', 'Live Color Picker', 'Batch Applied'],
    howTo: [
      { title: 'Load PDF and Choose Type', desc: 'Select your PDF file and choose between Text watermark or Image stamp watermark.' },
      { title: 'Customize Appearance', desc: 'Configure watermark text, font size, opacity, rotation angle, text color, or upload a custom logo image.' },
      { title: 'Position and Apply', desc: 'Choose placement (Center, Top-Left, Top-Right, Bottom-Left, Bottom-Right) and download your watermarked PDF.' }
    ],
    faq: [
      { question: 'Can I use both text and image stamps as watermarks?', answer: 'Yes. You can enter custom text (such as CONFIDENTIAL or DRAFT) or upload a logo/stamp image file (PNG, JPG) to overlay on your document.' },
      { question: 'Can I adjust the transparency and angle of the watermark?', answer: 'Yes. For text watermarks you can adjust opacity (0.1 to 1.0) and rotation angle (e.g., 45° diagonal), as well as font size and color.' },
      { question: 'Where can the watermark be positioned?', answer: 'You can position the watermark in 5 primary locations: Center, Top-Left, Top-Right, Bottom-Left, or Bottom-Right of each page.' },
      { question: 'Does the watermark get applied to all pages?', answer: 'Yes, the watermark is rendered across every page in the uploaded PDF document.' },
      { question: 'Can someone easily remove the watermark?', answer: 'The watermark is embedded directly into the PDF content stream. While sophisticated PDF editing tools can alter non-flattened elements, standard viewers and printers will display it permanently.' }
    ]
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
    features: ['Password Encryption', 'AES Standard Security', 'Local Browser Processing', 'No Server Storage', 'Instant Protection'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your file to inspect its structure and page count.' },
      { title: 'Set Encryption Password', desc: 'Enter and confirm your password, check the real-time strength score, and optionally configure permission flags.' },
      { title: 'Encrypt and Download', desc: 'Apply AES-256 encryption client-side and save your password-locked PDF.' }
    ],
    faq: [
      { question: 'What encryption algorithm is used to protect the PDF?', answer: 'By default, the tool applies modern AES-256 standard encryption, which is supported by all standard PDF readers such as Adobe Acrobat, Apple Preview, and modern web browsers.' },
      { question: 'What permissions can I restrict on the PDF?', answer: 'Under advanced options, you can selectively control permissions for printing, text/graphics copying, annotating, and modifying document content.' },
      { question: 'Can Zubware recover my password if I forget it?', answer: 'No. Encryption is applied using strong cryptographic algorithms inside your browser. Zubware does not store your passwords or documents, so forgotten passwords cannot be recovered.' },
      { question: 'What is the difference between a User Password and an Owner Password?', answer: 'A User Password (open password) is required to open and read the PDF. An Owner Password (permissions password) allows unrestricted editing and printing rights even if permissions are locked for regular viewers.' },
      { question: 'How is encryption handled by this tool?', answer: 'Files are processed in your browser and are not sent to a Zubware server for processing. Encryption is applied directly inside your browser using standard AES-256 cryptographic algorithms.' }
    ]
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    navTitle: 'Unlock PDF',
    description: 'Remove password protection and permission restrictions from your encrypted PDF documents after entering the correct password in your browser.',
    icon: '🔓',
    path: '/unlock-pdf.html',
    filename: 'unlock-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Password Removal', 'Local Browser Decryption', 'Clear Helpful Guidance', 'Private & Secure', 'No Uploads'],
    howTo: [
      { title: 'Upload Locked PDF', desc: 'Select your password-protected or permission-restricted PDF document.' },
      { title: 'Enter Password if Required', desc: 'If the document requires an open password, type it into the password field; owner permissions restrictions are detected automatically.' },
      { title: 'Decrypt and Save', desc: 'Click Unlock PDF to remove encryption and download a clean, unprotected PDF.' }
    ],
    faq: [
      { question: 'Can this tool unlock a PDF without knowing the password?', answer: 'If the document is restricted only by permissions (printing or copying locks without an open password), it can often be unlocked directly. However, if the PDF is protected by an open/read password, you must enter the valid password once to decrypt and remove the lock.' },
      { question: 'What happens to the password once I unlock the PDF?', answer: 'A new, unencrypted copy of the document is generated. The downloaded PDF will open freely in any viewer without asking for a password in the future.' },
      { question: 'Will unlocking affect the formatting or layout of the document?', answer: 'No. Decryption restores the native content stream, keeping all pages, text formatting, and images identical to the original.' },
      { question: 'How are passwords verified in this tool?', answer: 'Files are processed in your browser and are not sent to a Zubware server for processing. Password checks and decryption operations run locally within your browser memory.' },
      { question: 'What should I do if the tool says the password is incorrect?', answer: 'Verify caps lock and spelling. PDF passwords are strictly case-sensitive.' }
    ]
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
    features: ['Inspect Full Metadata', 'Edit Title & Author', 'Strip All Metadata', 'Page Size & Version Info', 'Client-Side Processing'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your file to inspect existing embedded metadata fields and page dimensions.' },
      { title: 'Edit or Clear Metadata', desc: 'Modify Title, Author, Subject, Keywords, Creator, and Producer, or click Clear All Metadata for anonymity.' },
      { title: 'Save Updated PDF', desc: 'Click Save Metadata to download the updated PDF file with your customized metadata tags.' }
    ],
    faq: [
      { question: 'What metadata properties can I view and edit?', answer: 'You can inspect and modify Document Title, Author, Subject, Keywords, Creator application, Producer, Creation Date, Modification Date, and Page Dimensions.' },
      { question: 'Why should I clear metadata from a PDF before sharing?', answer: 'PDF files often inadvertently contain personal identifiers such as author names, local file paths, software licenses, and creation timestamps. Clearing metadata helps protect your privacy when submitting resumes, tenders, or confidential publications.' },
      { question: 'Does changing metadata alter the text or appearance of pages?', answer: 'No. Metadata changes only alter internal document header properties without modifying visible page contents or layouts.' },
      { question: 'Can I use this tool to verify document dimensions?', answer: 'Yes. The tool automatically displays page dimensions in millimeters and PostScript points (e.g., standard A4 210 x 297 mm or Letter size).' },
      { question: 'Can I remove metadata to pass anonymous review or job application filters?', answer: 'Yes. Clicking Clear All Metadata strips author names, institution identifiers, creation timestamps, and software signatures, creating a sanitized PDF document.' }
    ]
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    navTitle: 'QR Generator',
    description: 'Generate custom QR codes for URLs, WiFi networks, vCards, UPI payments, emails, and events. High-resolution vector PNG, SVG, and A4 PDF QR code generator with logo embed and custom styles.',
    icon: '📱',
    path: '/qr-generator.html',
    filename: 'qr-generator.html',
    category: 'Generators',
    badge: 'Pro',
    features: ['9 Data Formats (URL, WiFi, vCard, UPI, etc.)', 'Logo Upload & Center Embedding', 'Custom Dots & Corner Eye Styles', 'Linear & Radial Gradient Fills', 'PNG, Scalable SVG & A4 PDF Print'],
    howTo: [
      { title: "Select Content Type & Input Data", desc: "Choose from 9 data formats including Website URL, WiFi Network, vCard Contact, UPI Payment, Email, Phone, SMS, Geo Location, or Calendar Event." },
      { title: "Customize Visual Style, Logo & Frame", desc: "Select color themes or gradients, pick custom dot and corner shapes, upload a center brand logo, and add an optional 'SCAN ME' banner frame." },
      { title: "Export in PNG, Vector SVG, or PDF", desc: "Inspect the instant live preview and download as high-resolution PNG, infinite-scale SVG vector, or ready-to-print A4 PDF document." }
    ],
    faq: [
      { question: "What QR error correction levels are supported and why do they matter?", answer: "The generator supports levels L (7%), M (15%), Q (25%), and H (30%). Higher error correction (Q or H) allows the QR code to remain scannable even if damaged, smudged, or partially covered by a logo." },
      { question: "How does the WiFi QR code connection work?", answer: "Selecting WiFi generates a standardized WIFI: protocol string (SSID, encryption type, password) that smartphones scan to connect to your wireless network automatically without typing passwords." },
      { question: "Do QR codes generated here ever expire?", answer: "No. These are static direct QR codes where the data is embedded directly into the matrix. They have no expiration date, no scan limits, and no redirect intermediaries." },
      { question: "Can I download vector SVG files for billboard and packaging printing?", answer: "Yes. SVG vector download guarantees razor-sharp edges at any physical print size from business cards to giant banners." },
      { question: "Is any tracking data recorded when users scan my QR code?", answer: "No. Because these are direct static QR codes without intermediary redirect servers, scans are completely private and untracked." }
    ]
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
    features: ['ATS Friendly', 'Live Preview', 'PDF Export', 'Custom Sections', 'Client-Side Processing'],
    howTo: [
      { title: "Fill Contact & Experience Sections", desc: "Input your personal information, work history, education, skills, and certifications into structured form fields." },
      { title: "Select Professional Template & Theme", desc: "Choose from modern, executive, or technical layouts and customize accent colors, typography, and section order." },
      { title: "Preview & Download PDF / JSON", desc: "Inspect the real-time A4/Letter resume preview and download a print-ready PDF or save a backup JSON file." }
    ],
    faq: [
      { question: "Is the generated resume formatted to be ATS-friendly?", answer: "Yes. The templates utilize clean single-column or standard two-column structures with selectable text, standard heading hierarchies, and no complex graphical tables that could confuse ATS parsers." },
      { question: "Can I download my resume as a PDF file?", answer: "Yes. The builder generates a vector PDF document preserving crisp font rendering and standard page margins for job applications." },
      { question: "Can I save my resume data to continue editing later?", answer: "Yes. Your progress is saved automatically in browser localStorage, and you can export a full JSON backup to reload anytime on any device." },
      { question: "Can I customize the order of sections (e.g. putting Skills before Experience)?", answer: "Yes. The section manager lets you reorder, rename, or toggle visibility for sections like Projects, Certifications, and Publications." },
      { question: "Is my personal employment history stored on external servers?", answer: "No. All resume data is stored exclusively in your browser's local storage. Zubware never uploads, stores, or sells your resume data." }
    ]
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
    features: ['ATS Score (0-100)', 'Missing Keyword Scan', 'Contact Info Check', 'Readability Score', 'Local Browser Scanner'],
    howTo: [
      { title: "Paste Resume Text or Upload File", desc: "Paste your resume content or upload a text/PDF document into the checker." },
      { title: "Paste Target Job Description", desc: "Input the job listing to scan for keyword matches, missing skills, and required qualifications." },
      { title: "Review ATS Compatibility Score & Fixes", desc: "Inspect your overall score (0-100), detected formatting warnings, keyword match percentage, and actionable recommendations." }
    ],
    faq: [
      { question: "How does the ATS score calculation work?", answer: "The scoring engine evaluates standard section headers, contact completeness, bullet point metrics, and keyword frequency alignment against the provided job description." },
      { question: "Does a high score guarantee an interview or job offer?", answer: "No automated tool can guarantee hiring outcomes. The score provides an algorithmic estimate of scannability and keyword relevance to help you optimize your application before applying." },
      { question: "What formatting issues trigger ATS warnings?", answer: "Warnings are flagged for missing standard headers (e.g. Experience, Education), unquantified bullet points, tables, low keyword density, and missing contact information." },
      { question: "Can I test multiple versions of my resume for different job postings?", answer: "Yes. You can paste different job descriptions repeatedly to tailor your resume's keyword balance for specific roles." },
      { question: "Are my resume and target job descriptions kept private?", answer: "Yes. All text parsing, keyword extraction, and scoring algorithms execute locally in your web browser." }
    ]
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
    features: ['Overall Metric Score', 'Design & Content Metrics', 'Professionalism Rating', 'Completion Checklist', 'Actionable Suggestions'],
    howTo: [
      { title: "Input Complete Resume Content", desc: "Paste your full resume text into the analysis pane." },
      { title: "Run Deep Structural & Metric Analysis", desc: "Click Analyze to inspect breakdown scores across Impact, Brevity, Action Verbs, and Quantified Results." },
      { title: "Review Weak Bullet Points & Suggested Edits", desc: "Examine identified passive voice phrases and replace them with suggested high-impact action verbs and metric frameworks." }
    ],
    faq: [
      { question: "What core criteria determine the overall resume score?", answer: "The analyzer assesses four primary pillars: Impact (quantifiable business metrics), Action Verbs (strong leadership language vs passive voice), Brevity (concise sentence structures), and Section Balance." },
      { question: "How does it detect weak or passive bullet points?", answer: "The rule engine identifies passive constructions (e.g. 'Responsible for', 'Assisted with') and flags them, suggesting dynamic action verbs like 'Architected', 'Spearheaded', or 'Optimized'." },
      { question: "Does the analyzer flag resume length issues?", answer: "Yes. It evaluates total word count against professional standards, alerting you if your draft is too sparse or exceeds single/two-page best practices." },
      { question: "Can I re-analyze my text after making edits?", answer: "Yes. Real-time re-analysis updates your score and metric meters instantly as you revise bullet points." },
      { question: "Is my resume analyzed by third-party cloud AI?", answer: "No. The linguistic rule-matching and scoring metrics operate locally in your browser memory." }
    ]
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
    features: ['Structured Sections', 'Live Preview', 'PDF / HTML / JSON Export', 'Greeting & Intro Presets', 'Local Browser Processing'],
    howTo: [
      { title: "Enter Candidate & Employer Information", desc: "Fill in your contact details, date, hiring manager name, target role, and company name." },
      { title: "Write or Customize Letter Paragraphs", desc: "Use guided prompts to craft your Opening Hook, Core Value Accomplishments, and Closing Call to Action." },
      { title: "Preview & Download PDF", desc: "Inspect the formatted single-page letter matching your resume style and download as a PDF or text file." }
    ],
    faq: [
      { question: "Can I pair the cover letter design with my resume template?", answer: "Yes. The builder uses coordinated header typography and color themes so your cover letter and resume present a unified visual brand." },
      { question: "How does the guided editor help write compelling paragraphs?", answer: "It provides fill-in-the-blank starter frameworks that prompt you for concrete achievements, company interest reasons, and confident next steps." },
      { question: "Can I download my cover letter as a print-ready PDF?", answer: "Yes. Click Download PDF to export a formatted single-page document conforming to standard business letter margins." },
      { question: "Is my cover letter saved automatically?", answer: "Yes. Changes are preserved in local browser storage so you can retrieve and adapt your letters for multiple applications." },
      { question: "Are cover letter contents transmitted to Zubware servers?", answer: "No. The document generation runs entirely in your browser without network transmission." }
    ]
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
    features: ['15+ Industry Presets', 'One-Click Load', 'Editable Text', 'Instant Customization', 'PDF & TXT Export'],
    howTo: [
      { title: "Browse Categorized Template Gallery", desc: "Filter templates by industry: Tech & Software, Marketing, Finance & Consulting, Creative, or Recent Graduate." },
      { title: "Preview Letter Layout & Copy", desc: "Click any template card to inspect sample copy, paragraph structure, and typography styling." },
      { title: "Load into Editor or Copy Text", desc: "Click 'Use This Template' to populate the builder with the chosen layout, or copy the raw sample text." }
    ],
    faq: [
      { question: "Are these templates customizable for different seniority levels?", answer: "Yes. Templates range from entry-level and internship layouts to senior manager and executive leadership formats." },
      { question: "Do the templates follow standard business correspondence format?", answer: "Yes. Each template includes standard contact header blocks, formal salutations, 3-to-4 paragraph body structure, and professional sign-offs." },
      { question: "Can I copy the template text directly to my clipboard?", answer: "Yes. You can copy the clean placeholder text with bracketed tokens (e.g. [Company Name], [Achievement]) directly into Word, Docs, or email." },
      { question: "Are there templates designed for career transitions?", answer: "Yes. The 'Career Pivot' template emphasizes transferable skills, adaptability, and cross-functional problem-solving over traditional industry tenure." },
      { question: "Is template access completely free without a subscription?", answer: "Yes. All cover letter templates are freely accessible with no watermarks, credit cards, or accounts required." }
    ]
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
    features: ['Academic Research Format', 'Publications & Grants', 'Multiple CV Layouts', 'High Density Output', 'PDF Export'],
    howTo: [
      { title: "Input Comprehensive Academic & Clinical History", desc: "Add comprehensive sections for Research Publications, Teaching Experience, Grants, Fellowships, and Conferences." },
      { title: "Select Multi-Page Academic Layout", desc: "Choose classic academic or scientific serif/sans-serif styling with custom citation formatting." },
      { title: "Export Multi-Page PDF Curriculum Vitae", desc: "Inspect the multi-page preview with synchronized pagination and export a clean PDF." }
    ],
    faq: [
      { question: "What is the difference between a Resume and an Academic CV?", answer: "A resume is a concise 1-2 page document tailored for industry jobs. A Curriculum Vitae (CV) is a comprehensive, multi-page credential detailing full academic, research, grant, and publication histories without page limits." },
      { question: "Does the CV builder support formal publication citation formats?", answer: "Yes. You can format publication entries according to standard academic styles including APA, MLA, and Chicago formatting." },
      { question: "Can I generate multi-page documents with consistent running headers?", answer: "Yes. The PDF engine supports multi-page layout with running headers, author names, and automatic page numbers." },
      { question: "Can I export my CV data as a JSON file for safe archiving?", answer: "Yes. Exporting a JSON backup allows you to store your academic record safely and reload it whenever updating credentials." },
      { question: "Is sensitive research or grant information private?", answer: "Yes. All CV data remains 100% on your local computer; no academic information is sent over the network." }
    ]
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
    features: ['Job Description Match', 'Missing & Weak Keywords', 'Frequency Analysis', 'Action Verb Suggestions', 'Client-Side Processing'],
    howTo: [
      { title: "Paste Resume & Job Listing", desc: "Input your current resume text into the left editor and target job posting into the right editor." },
      { title: "Run Semantic Keyword Comparison", desc: "Click Compare Keywords to view Matched, Missing, and Overused keyword frequency breakdowns." },
      { title: "Incorporate Missing Skills & Re-Score", desc: "Add identified missing hard and soft skills into your experience bullets and verify your match percentage increases." }
    ],
    faq: [
      { question: "How does the keyword optimizer identify essential job skills?", answer: "It extracts technical terms, certifications, software tools, and domain proficiencies from the job listing using natural language tokenization and frequency weighting." },
      { question: "Why shouldn't I just copy and paste all missing keywords into the footer?", answer: "Recruiters and modern ATS scanners detect 'keyword stuffing' or white-text tricks, which can lead to immediate application rejection. Keywords should be woven contextually into real accomplishment bullets." },
      { question: "Does the tool categorize hard skills separately from soft skills?", answer: "Yes. Keywords are grouped into Technical Tools/Hard Skills (e.g. Python, AWS, SQL) and Competencies/Soft Skills (e.g. Agile Leadership, Stakeholder Management)." },
      { question: "Can I see exact keyword match percentages?", answer: "Yes. The summary dashboard displays your overall keyword overlap percentage and highlights specific missing terms." },
      { question: "Are job postings or resume texts saved on a server?", answer: "No. The keyword comparison engine executes locally in browser memory with zero external requests." }
    ]
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
    features: ['30+ Unique Layouts', 'Categorized Presets', 'One-Click Load', 'Live Sample Previews', 'Free Customization'],
    howTo: [
      { title: "Browse Resume Template Styles", desc: "Filter by layout categories: Modern Minimalist, Executive Classic, Creative Visual, or Technical Engineering." },
      { title: "Inspect Live Template Demo", desc: "Preview full-screen template samples with realistic dummy content to evaluate typography, spacing, and column balance." },
      { title: "Apply Template to Active Resume", desc: "Click 'Apply Template' to instantly reformat your existing resume data into the selected design without losing content." }
    ],
    faq: [
      { question: "Will switching templates erase my existing resume content?", answer: "No. Your resume data is decoupled from the visual presentation layer; switching templates instantly reapplies your existing data into the new layout without data loss." },
      { question: "Which template is best for corporate and traditional finance roles?", answer: "The 'Executive Classic' template—featuring a single-column layout, traditional serif typography, and standard chronological sections—is optimal for conservative corporate industries." },
      { question: "Which template is recommended for software developers and engineers?", answer: "The 'Technical Minimal' template features dedicated skills matrices, project link badges, and compact bullet spacing ideal for developer portfolios." },
      { question: "Are all templates optimized for standard A4 and US Letter printing?", answer: "Yes. All templates conform strictly to standard international A4 and North American Letter print boundaries with balanced margins." },
      { question: "Are premium templates locked behind paywalls?", answer: "No. Every template in the gallery is 100% free and open for download." }
    ]
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
    features: ['Multi-Resume Storage', 'Duplicate & Rename', 'Local Storage Backup', 'Export / Restore All', 'Zero Server Dependence'],
    howTo: [
      { title: "View Saved Resume Versions", desc: "Review your library of tailored resume drafts saved for different companies or job titles." },
      { title: "Create, Duplicate or Rename Drafts", desc: "Clone a base resume to customize for a new application (e.g. 'Resume - Product Manager' vs 'Resume - Tech Lead')." },
      { title: "Switch Active Resume or Export Backups", desc: "Set your target active version for editing, or export all versions in a single consolidated JSON backup." }
    ],
    faq: [
      { question: "Why should I maintain multiple versions of my resume?", answer: "Tailoring distinct resume versions for specific job roles or target industries allows you to highlight relevant experience and optimize keywords for higher callback rates." },
      { question: "Where are my saved resume versions stored?", answer: "All versions are stored in your web browser's local storage (localStorage) under a structured version registry." },
      { question: "What happens if I clear my browser cookies and site data?", answer: "Clearing browser data deletes localStorage. We recommend using the 'Export All Versions' feature periodically to keep a local JSON backup file on your computer." },
      { question: "Can I restore a previous version from a JSON backup file?", answer: "Yes. The import function allows you to upload any previously exported JSON file to restore your full version history instantly." },
      { question: "Is there a limit on how many resume versions I can save?", answer: "No practical limit exists; browser localStorage easily accommodates dozens of distinct full resume records." }
    ]
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
    features: ['JSON / HTML / TXT Import', 'Instant Data Validation', 'Restore Backup', 'Overwrite or Add', 'Client-Side Processing'],
    howTo: [
      { title: "Select Import Source File", desc: "Upload a previously exported Zubware JSON backup or upload a plain text/markdown resume file." },
      { title: "Review Extracted Data Fields", desc: "Inspect parsed contact details, work history items, education, and skill lists in the mapping preview." },
      { title: "Confirm & Load into Editor", desc: "Click 'Import to Resume' to populate your resume editor with the extracted content ready for further editing." }
    ],
    faq: [
      { question: "Which file formats can be imported?", answer: "The tool natively supports Zubware JSON backup files, structured plain text (.txt), and Markdown (.md) documents." },
      { question: "Will importing a file overwrite my current resume draft?", answer: "You are prompted before import to either replace your current draft or save the imported data as a new named version." },
      { question: "Can I import resumes exported from LinkedIn?", answer: "You can copy and paste the text content from your LinkedIn profile archive into the text parser to populate structured sections." },
      { question: "How does the JSON validator verify uploaded backup files?", answer: "The importer validates the JSON schema to ensure all required profile fields, date structures, and arrays are valid before loading." },
      { question: "Is my imported resume uploaded to a remote server?", answer: "No. File reading is handled client-side via the browser's native FileReader API with zero server contact." }
    ]
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
    features: ['PDF, HTML, JSON, TXT', 'Print & Browser Share', 'Vector Crisp Quality', 'Filename Customization', 'Instant Download'],
    howTo: [
      { title: "Select Active Resume Draft", desc: "Choose the resume version you want to export from your saved library." },
      { title: "Choose Export Format", desc: "Select Vector PDF for job applications, Clean JSON for backup/migration, or Plain Text (.txt) for plain ATS form fields." },
      { title: "Download File to Device", desc: "Click the download button to save the generated file directly to your local computer or phone." }
    ],
    faq: [
      { question: "Does the exported PDF contain selectable, readable text?", answer: "Yes. The PDF engine compiles true vector typography, ensuring all text remains selectable and searchable by recruiters and ATS scanners." },
      { question: "Why should I export a JSON backup?", answer: "A JSON backup preserves your exact structured data, letting you restore your complete resume across different browsers, computers, or devices." },
      { question: "What is the Plain Text (.txt) export useful for?", answer: "Plain text export strips all styling while maintaining clear spacing, making it easy to copy and paste sections into online job application forms." },
      { question: "Can I choose between A4 and US Letter page sizes during PDF export?", answer: "Yes. You can select either international ISO A4 or North American US Letter paper dimensions before generating the PDF." },
      { question: "Are exported files processed on an external server?", answer: "No. All PDF generation and JSON serialization execute locally in your browser memory." }
    ]
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
    features: ['Completion Percentage', 'Step-by-Step Checklist', 'Missing Section Alerts', 'Live Progress Bar', 'Improvement Guide'],
    howTo: [
      { title: "Load Resume for Audit", desc: "Select your active resume draft to evaluate profile completeness." },
      { title: "Inspect Completeness Checklist", desc: "Review status checks for Contact Info, Professional Summary, Quantified Metrics, Skills Count, and Education." },
      { title: "Resolve Flagged Missing Items", desc: "Click on any incomplete recommendation card to jump directly to the editor section and fill in the missing details." }
    ],
    faq: [
      { question: "What items does the completeness audit evaluate?", answer: "It checks for full name, email, phone number, location, LinkedIn URL, professional summary, at least 2 work experiences with quantifiable bullet points, education, and at least 5 relevant skills." },
      { question: "Why is a complete LinkedIn URL recommended on a resume?", answer: "Over 85% of recruiters cross-reference candidates' LinkedIn profiles during initial screening; including a clean custom profile link validates your professional credibility." },
      { question: "What is considered a passing completeness percentage?", answer: "A score of 90% or higher indicates that all essential ATS and recruiter criteria are satisfied." },
      { question: "Does the checker flag missing dates or locations in work experience?", answer: "Yes. Incomplete employment dates or missing company locations trigger warning flags to prevent chronological gaps." },
      { question: "Is my completeness data tracked externally?", answer: "No. All checklist calculations run entirely within your local browser runtime." }
    ]
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
    features: ['Reorder & Drag/Drop', 'Show / Hide Sections', 'Duplicate Section', 'Undo / Redo Stack', 'Instant Sync'],
    howTo: [
      { title: "View Active Resume Sections", desc: "Inspect the list of default sections: Contact, Summary, Experience, Education, Skills, and Projects." },
      { title: "Reorder, Hide or Add Custom Sections", desc: "Drag sections to change vertical hierarchy, toggle visibility switches, or create custom sections (e.g. Publications, Volunteer Work, Languages)." },
      { title: "Save Section Configuration", desc: "Review the updated layout in the live resume preview with instant section realignment." }
    ],
    faq: [
      { question: "Can I create completely custom resume sections?", answer: "Yes. You can add custom sections (such as Patents, Awards, Military Service, or Speaking Engagements) with custom headers." },
      { question: "Can I hide a section without permanently deleting its data?", answer: "Yes. Toggling a section's visibility switch hides it from the rendered resume and PDF while preserving its data in your storage for later use." },
      { question: "Can I rename standard section titles (e.g. changing 'Work Experience' to 'Professional Background')?", answer: "Yes. You can edit the display title of any standard section to match regional or industry preferences." },
      { question: "Does reordering sections affect the final PDF output?", answer: "Yes. The generated PDF renders sections in the exact vertical sequence configured in the section manager." },
      { question: "Is section ordering saved per resume version?", answer: "Yes. Each saved resume version retains its own independent section configuration and ordering." }
    ]
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
    features: ['10+ Industry Categories', 'Search & Filter', 'One-Click Add', 'Proficiency Ratings', 'Skill Descriptions'],
    howTo: [
      { title: "Search Skills by Job Role or Industry", desc: "Type your career field (e.g. Frontend Engineer, Product Marketing, Data Science) or search specific keywords." },
      { title: "Filter by Hard Skills, Soft Skills & Tools", desc: "Browse organized categories: Programming Languages, Cloud Infrastructure, Methodologies, and Leadership." },
      { title: "Add Skills to Resume with One Click", desc: "Click '+' on any verified skill tag to insert it directly into your active resume's skills list." }
    ],
    faq: [
      { question: "How many verified industry skills are included in the library?", answer: "The library indexes thousands of standardized hard skills, software tools, frameworks, methodologies, and professional competencies across major industries." },
      { question: "Does adding standardized skill tags improve ATS keyword recognition?", answer: "Yes. Standardized industry spelling (e.g. 'Kubernetes', 'PostgreSQL', 'Scrum') ensures automated ATS scanners match your skills against job posting requirements without spelling discrepancies." },
      { question: "Can I group skills into custom categories on my resume?", answer: "Yes. You can organize skills into categorized groups (such as 'Languages', 'Frameworks', 'DevOps Tools') for cleaner visual scanning." },
      { question: "Can I add custom skills that are not in the predefined library?", answer: "Yes. You can type any custom proprietary tool or specialized skill and add it directly to your profile." },
      { question: "Is the skills library available offline?", answer: "Yes. The complete skills database is packaged locally in the application bundle, allowing instant offline searching." }
    ]
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
    features: ['Local Browser Formulas', 'Impact, Tech & Formal Tones', 'Role Specific Presets', 'One-Click Insert', 'Editable Drafts'],
    howTo: [
      { title: "Select Job Title & Experience Level", desc: "Choose Entry-Level, Mid-Career, Senior Professional, or Executive, and specify your industry domain." },
      { title: "Choose Summary Angle & Key Accomplishments", desc: "Select tone (Impact-Focused, Technical Specialist, People Leader) and enter 2-3 key career highlights." },
      { title: "Insert into Resume or Copy", desc: "Review tailored 3-to-4 sentence summary options and click 'Insert into Resume' or Copy to clipboard." }
    ],
    faq: [
      { question: "What makes a professional resume summary effective?", answer: "An effective summary states your professional identity, years of specialization, top 2-3 quantifiable achievements, and core value proposition in 3-4 concise sentences, avoiding generic buzzwords." },
      { question: "How is a resume summary different from an objective statement?", answer: "An objective statement describes what the candidate wants (outdated practice). A professional summary describes what value the candidate offers the employer based on proven experience." },
      { question: "Can career changers use this summary generator?", answer: "Yes. The career transition mode highlights transferable achievements and demonstrated problem-solving skills rather than years in a single role." },
      { question: "Does the summary generator support multiple industry verticals?", answer: "Yes. It provides specialized phrasing for Technology, Finance, Healthcare, Sales, Education, Operations, and Creative professions." },
      { question: "Is my career data kept private?", answer: "Yes. All summary generation logic runs client-side in your browser memory." }
    ]
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
    features: ['10+ Professional Palette Presets', 'HEX / RGB Custom Picker', 'WCAG Contrast Check', 'Printable Aesthetics', 'Live Preview'],
    howTo: [
      { title: "Select Coordinated Color Palette", desc: "Browse curated professional themes: Executive Navy, Slate Charcoal, Emerald Forest, Burgundy Maroon, and Modern Cobalt." },
      { title: "Customize Accent & Text Colors", desc: "Fine-tune primary header color, divider line tone, body text contrast, and background wash." },
      { title: "Verify WCAG Contrast & Apply", desc: "Inspect the real-time contrast ratio score and apply the color theme across all resume sections and headers." }
    ],
    faq: [
      { question: "Are the color themes calibrated for black-and-white printing?", answer: "Yes. Every theme uses high-contrast tonal values that maintain clear grayscale readability when printed on standard monochrome office printers." },
      { question: "Which color theme is recommended for conservative industries?", answer: "Executive Navy (#1E3A8A) and Slate Charcoal (#334155) are widely favored for banking, legal, corporate management, and government applications." },
      { question: "Can I enter custom brand HEX codes?", answer: "Yes. You can input custom hexadecimal color codes to match your personal brand or portfolio color palette." },
      { question: "Do color themes change the formatting or text structure?", answer: "No. Color themes only modify CSS visual styling (heading colors, bullet accents, divider borders), leaving your resume text content untouched." },
      { question: "Are color theme selections saved with the resume?", answer: "Yes. Your active color palette is stored alongside your resume data in local storage and persists across sessions." }
    ]
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
    features: ['Multi-Job Timeline', 'Gap Analysis', 'Years / Months / Days', 'Current Employment Support', 'Printable Report'],
    howTo: [
      { title: "Add Employment Records", desc: "Add your past and current jobs with company name, job title, start date, and end date." },
      { title: "Mark Current Position", desc: "Toggle 'Currently Working Here' on your active job to calculate ongoing tenure up to today's date." },
      { title: "Review Total Merged Experience", desc: "Inspect your unified professional experience in years, months, and days with overlapping dates merged accurately." }
    ],
    faq: [
      { question: "How does the experience calculator handle overlapping employment dates?", answer: "The algorithm merges intersecting date intervals into continuous calendar spans so overlapping tenures (such as freelancing while employed) are not double-counted in total experience." },
      { question: "Can I calculate experience for currently active positions?", answer: "Yes. Check the 'Currently Working Here' box to automatically calculate tenure from your start date up to the present day." },
      { question: "How are months and days converted into total years?", answer: "The tool calculates full completed calendar years, remaining whole months, and remaining residual days, while also displaying total completed calendar days." },
      { question: "Can I add multiple historical jobs to my career timeline?", answer: "Yes. Click 'Add Position' to enter as many previous employers as needed to construct your complete career chronology." },
      { question: "Is my resume or job history saved on an external server?", answer: "No. All job entries and date calculations reside strictly within your local browser session and are never uploaded to Zubware servers." }
    ]
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
    features: ['Exact End Date Calculation', 'Working Days Remaining', 'Notice Buyout Calculator', 'Public Holiday Exclusions', 'Instant Summary'],
    howTo: [
      { title: "Enter Resignation Date", desc: "Select the date you submitted your formal resignation letter to your employer." },
      { title: "Set Contractual Notice Days", desc: "Input your required notice period duration (common presets: 15, 30, 60, or 90 days)." },
      { title: "Review Last Working Day & Buyout Cost", desc: "Inspect your official Last Working Day (LWD) calendar date, remaining days countdown, and optional salary buyout calculation." }
    ],
    faq: [
      { question: "How is the official Last Working Day (LWD) determined?", answer: "The calculator adds your required notice period calendar days directly to your resignation submission date to determine your exact final employment date." },
      { question: "Does the notice period count calendar days or working days?", answer: "Standard corporate employment contracts specify notice periods in total calendar days (including weekends and holidays) unless your specific employment agreement explicitly states business days." },
      { question: "How does notice period buyout calculation work?", answer: "If you leave earlier than your contractual notice, buyout compensation is calculated by dividing monthly salary by 30 to determine daily rate, then multiplying by the shortfall days: Buyout = (Monthly Salary / 30) × Shortfall Days." },
      { question: "Can I adjust for waived or negotiated shortfall days?", answer: "Yes. Enter the number of buyout or waived days to calculate the exact financial recovery or settlement amount between you and your employer." },
      { question: "What happens if my last working day falls on a weekend or public holiday?", answer: "Companies typically treat the preceding Friday or following Monday as the formal physical exit day for returning company assets and exit interviews." }
    ]
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
    features: ['Current vs New CTC', 'Percentage Hike Calculation', 'Monthly Difference', 'Tax Slabs Estimate', 'Offer Comparison'],
    howTo: [
      { title: "Enter Current Salary or CTC", desc: "Input your current annual gross Cost to Company (CTC) or base salary." },
      { title: "Enter Offered New Salary or CTC", desc: "Input the new proposed annual compensation offered by your current or new employer." },
      { title: "Review Percentage Hike & In-Hand Gain", desc: "Inspect the absolute annual increment, percentage hike %, and estimated gross monthly paycheck increase." }
    ],
    faq: [
      { question: "What formula is used to calculate percentage salary hike?", answer: "Percentage hike is calculated as: Hike % = [(Offered CTC - Current CTC) / Current CTC] × 100." },
      { question: "How is the estimated monthly difference calculated?", answer: "The tool divides both annual CTC figures by 12 to display current monthly gross, offered monthly gross, and the monthly dollar increment." },
      { question: "Does the calculated hike reflect net in-hand salary after taxes?", answer: "This tool calculates gross CTC increase. Actual net in-hand pay depends on income tax brackets, retirement contributions (401k/PF), and health insurance deductions." },
      { question: "What is considered a standard salary hike when switching jobs?", answer: "In professional industries, typical lateral job switches offer between 15% and 35% hikes depending on skill demand, candidate experience, and market benchmarks." },
      { question: "Can I use this calculator for hourly wage increases?", answer: "Yes. You can enter hourly pay rates directly into the fields; the percentage hike remains mathematically identical whether using hourly, monthly, or annual figures." }
    ]
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
    features: ['Monthly Take-Home Breakdown', 'PF & Gratuity Calculation', 'Tax Deductions', 'Custom Allowances', 'Detailed Payslip Breakdown'],
    howTo: [
      { title: "Enter Annual Gross CTC", desc: "Input your total yearly Cost to Company package as stated on your employment offer letter." },
      { title: "Configure Component Percentages", desc: "Adjust percentage allocations for Basic Salary (typically 40–50%), HRA (typically 20%), and Employee PF (12% of Basic)." },
      { title: "Review Estimated Monthly Take-Home Pay", desc: "Inspect your annual salary breakdown (Basic, HRA, PF, Gratuity) and view your estimated monthly in-hand take-home salary." }
    ],
    faq: [
      { question: "What is the difference between Cost to Company (CTC) and In-Hand Salary?", answer: "CTC is the total annual expense an employer incurs for an employee, including direct salary, retirement contributions (PF), gratuity provisions, and benefits. In-hand salary is the actual net cash deposited into your bank account after deductions." },
      { question: "How is Provident Fund (PF) deducted from CTC?", answer: "Statutory Employee PF deduction is calculated as 12% of Basic Salary. In many corporate CTC structures, an equal 12% employer contribution is also included within the gross CTC package." },
      { question: "What is the Gratuity component in a CTC structure?", answer: "Gratuity is a statutory terminal benefit calculated at approximately 4.81% of Basic Salary (15 days of basic pay for each year of service), payable upon completing 5+ years with the employer." },
      { question: "Does the estimated monthly in-hand salary include income tax (TDS)?", answer: "This tool calculates gross pre-tax in-hand pay after standard statutory retirement deductions. Final take-home pay will vary based on your personal income tax bracket and chosen tax regime." },
      { question: "Can I customize the Basic and HRA percentage ratios?", answer: "Yes. You can adjust the Basic Salary percentage slider (30% to 60%) and HRA percentage to match your employer's specific salary compensation structure." }
    ]
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
    features: ['5-Day & 6-Day Week Options', 'Weekend Exclusions', 'Custom Holiday Entries', 'Hours & Minutes Equivalent', 'Fast Local Calc'],
    howTo: [
      { title: "Select Start and End Dates", desc: "Pick your beginning date and conclusion date from the calendar selectors." },
      { title: "Configure Weekend & Holiday Rules", desc: "Toggle whether Saturdays are counted as working days (5-day vs 6-day week) and input your count of public or company holidays." },
      { title: "Review Net Business Working Days", desc: "Inspect total net working days, weekend days excluded, holidays deducted, and total calendar days elapsed." }
    ],
    faq: [
      { question: "How does the working days calculator exclude weekend days?", answer: "The algorithm iterates through each calendar day in the date range; Sundays (and optionally Saturdays) are counted as non-working weekend days and excluded from the net total." },
      { question: "Can I count Saturdays as normal working days for a 6-day work week?", answer: "Yes. Check the 'Include Saturday as Workday' toggle to count Saturdays toward total business days, excluding only Sundays." },
      { question: "How are public and company holidays accounted for?", answer: "Type your number of scheduled company holidays or bank holidays into the holiday deduction field. The tool subtracts them directly from net working days." },
      { question: "Are start and end dates included in the working days count?", answer: "Yes. Both the start date and end date are evaluated inclusively if they fall on valid working business days." },
      { question: "Can I calculate working days across full calendar years?", answer: "Yes. The calculator handles arbitrary date spans across multi-year project schedules, leap years, and quarterly milestone periods." }
    ]
  },
  {
    id: 'youtube-title-generator',
    title: 'YouTube Title Generator',
    navTitle: 'Title Generator',
    description: 'Generate creative, SEO-friendly video titles for Tutorial, Review, Gaming, Education, Tech, Finance, AI, Vlog, Shorts, News, Islamic, and Entertainment.',
    icon: '🎬',
    path: '/youtube-title-generator.html',
    filename: 'youtube-title-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['12 Category Options', 'Curated Title Formulas', 'Keyword Optimization', 'Instant Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Topic & Select Channel Niche", desc: "Type your target subject keywords and choose your content category (Tech, Gaming, Education, Lifestyle, Business)." },
      { title: "Select Copywriting Formula Style", desc: "Filter by How-To, Listicle, Curiosity Gap, Shock/Extreme, or Beginner Guide styles to match your video's mood." },
      { title: "Monitor Character Limits & Copy", desc: "Check the character count gauge to stay within the recommended 50–70 character sweet spot, then click to copy your favorite title." }
    ],
    faq: [
      { question: "What is the optimal character length for a YouTube video title?", answer: "Between 50 and 70 characters. Although YouTube allows up to 100 characters, titles longer than 60–70 characters get truncated with an ellipsis on mobile home feeds and search result cards." },
      { question: "Why is keyword front-loading critical for YouTube SEO?", answer: "Placing your primary target keyword in the first 30–40 characters ensures viewers immediately recognize the video's relevance even if the end of the title is clipped on smaller screens." },
      { question: "Can I include numbers and brackets in my YouTube titles?", answer: "Yes. Data shows titles with specific numbers (e.g., '7 Mistakes', '2026 Edition') and brackets (e.g., '[Step-by-Step]') frequently achieve higher click-through rates by setting concrete expectations." },
      { question: "Should I use ALL CAPS in YouTube titles?", answer: "Capitalizing one or two key impact words (e.g. 'STOP Doing This') adds punchy emphasis, but typing an entire title in all caps often looks spammy and can discourage discerning viewers." },
      { question: "Does this tool guarantee YouTube search rankings or CTR?", answer: "No tool can guarantee algorithmic rankings. These formulas are based on proven copywriting psychology, but real performance depends on audience demand, viewer retention, and thumbnail synergy." }
    ]
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
    features: ['Structured Layout', 'Subscribe & Social Links', 'Hashtags & Links', 'Copy & Download TXT', 'Instant Preview'],
    howTo: [
      { title: "Enter Video Overview & Key Points", desc: "Fill in your video title, an engaging 2-to-3 sentence hook paragraph, and your main discussion points." },
      { title: "Add Links, Socials & Call-to-Action", desc: "Include your channel subscribe link, relevant product or resource URLs, social handles, and viewer call-to-action." },
      { title: "Generate & Copy Complete Description", desc: "Review the structured, formatted description blocks and click Copy All to paste directly into YouTube Studio." }
    ],
    faq: [
      { question: "Why are the first three lines of a YouTube description the most critical?", answer: "YouTube displays only the first 2–3 lines (about 100–150 characters) above the '...more' fold. This snippet is also indexed in search engine snippets and determines whether viewers expand the full description." },
      { question: "How many hashtags should I include in a YouTube description?", answer: "YouTube recommends 3 to 5 targeted hashtags. If a video includes more than 15 hashtags, YouTube ignores all hashtags on the video and may flag the upload for keyword stuffing." },
      { question: "What is the maximum character limit for YouTube video descriptions?", answer: "YouTube allows up to 5,000 characters per video description, providing plenty of room for chapters, reference links, transcripts, affiliate disclosures, and channel credits." },
      { question: "Can I include clickable timestamps in the generated description?", answer: "Yes. Any timestamp formatted with standard digits (such as 00:00 Intro or 02:45 Chapter Name) is automatically recognized by YouTube's player as an interactive clickable chapter." },
      { question: "Does Zubware store my video descriptions or channel links?", answer: "No. The entire description is formatted in your browser memory and is never saved, tracked, or stored on external servers." }
    ]
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
    features: ['Short & Long-Tail Tags', 'SEO Keyword Clusters', '500 Char Counter', 'Comma-Separated Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Input Target Topic or Keyword", desc: "Enter your video's core topic to generate relevant semantic tags, related queries, and phrase variations." },
      { title: "Select Categorized Tag Sets", desc: "Choose from primary exact matches, long-tail search phrases, broad topic tags, and common search query variations." },
      { title: "Copy Comma-Separated Tag String", desc: "Monitor the 500-character limit gauge and click Copy All to paste all tags into YouTube Studio's tag box in one click." }
    ],
    faq: [
      { question: "Do YouTube tags still help video search rankings?", answer: "According to YouTube, tags play a modest role compared to the title, thumbnail, and description, but they are specifically valuable for common misspellings, abbreviations, and related synonyms." },
      { question: "What is the total character limit for tags in YouTube Studio?", answer: "YouTube allows up to 500 characters across all tags combined, including separating commas." },
      { question: "How does this tool format tags for YouTube Studio?", answer: "It outputs tags as a clean, comma-separated list so you can copy and paste the entire block into YouTube Studio's tag field in a single operation." },
      { question: "Should I prioritize long-tail tags or single words?", answer: "A combination of 2-to-4 word specific phrases (long-tail keywords) along with 2–3 broad category tags gives YouTube's algorithm much better semantic context than generic single words." },
      { question: "Can using irrelevant or trending tags hurt my channel?", answer: "Yes. YouTube's Community Guidelines strictly prohibit adding tags unrelated to your video content. Always ensure all generated tags accurately describe what happens in your video." }
    ]
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
    features: ['High & Medium Volume', 'Long-Tail Hashtags', 'Trending Style', 'One-Click Copy', 'Local Generator'],
    howTo: [
      { title: "Enter Video Topic or Niche", desc: "Type your primary video topic or keyword into the search bar to generate curated hashtags." },
      { title: "Select Relevant Hashtags", desc: "Choose from categorized Trending, Evergreen, Niche, and High-Volume hashtag groupings." },
      { title: "Copy Formatted Hashtags", desc: "Click Copy All to paste the formatted hashtags directly into your YouTube video title or description." }
    ],
    faq: [
      { question: "Where should I place hashtags on YouTube—in the title or the description?", answer: "You can place hashtags in either location. The first 3 hashtags in your description appear prominently above your title or in the description header on mobile and desktop." },
      { question: "How many hashtags should I include on a YouTube video?", answer: "Using 3 to 5 targeted hashtags is optimal. If you include more than 15 hashtags, YouTube ignores all hashtags on the video and may penalize your video's search visibility." },
      { question: "Are hashtags effective for YouTube Shorts?", answer: "Yes! Including targeted hashtags like #shorts along with 2–3 niche-specific tags in your Shorts title and description helps YouTube's recommendation engine categorize your video quickly." },
      { question: "What is the difference between tags and hashtags on YouTube?", answer: "Tags are hidden metadata in the YouTube Studio backend (up to 500 characters), while hashtags are visible, clickable links with a '#' symbol that lead to dedicated hashtag search pages." },
      { question: "Can I use custom branded hashtags for my channel?", answer: "Yes. Many creators include a unique channel hashtag (such as #YourChannelName) across all video descriptions to link their entire catalog together." }
    ]
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
      'Local Browser Image Processing'
    ],
    howTo: [
      { title: "Upload Thumbnail Image", desc: "Select or drag your 1280x720 thumbnail file to load it into the authentic YouTube feed mockup." },
      { title: "Input & Compare Video Titles", desc: "Enter up to three title variations to evaluate side-by-side character counts, keyword placement, and mobile two-line truncation." },
      { title: "Inspect Readability & Theme Contrast", desc: "Toggle between Dark and Light mode, review visual contrast metrics, and inspect the 140px mobile mini-scale preview." }
    ],
    faq: [
      { question: "How does the YouTube thumbnail simulator work?", answer: "The simulator renders your uploaded thumbnail and video title inside an authentic mobile device container that emulates YouTube mobile Home Feed and Search Result layouts. It uses browser-native Canvas 2D image processing to measure tonal contrast, perceived luminance, edge sharpness, and theme compatibility—giving you instant, deterministic feedback before you upload to YouTube." },
      { question: "Can I preview my YouTube thumbnail on mobile screens?", answer: "Yes. Over 70% of YouTube views occur on mobile smartphones. Our simulator lets you inspect how your thumbnail scales on mobile displays, including a dedicated 140px small-size preview mode to ensure your main subject, text badge, and facial expressions remain recognizable at miniature scale." },
      { question: "How does the title truncation simulation work?", answer: "Rather than simply counting characters, the simulator measures the title inside real mobile container dimensions with standard YouTube two-line clamping. It indicates whether your title fits within 2 lines or may be truncated with an ellipsis on smaller phone screens, allowing you to front-load vital keywords in the first 40–50 characters." },
      { question: "Can I test both YouTube Light Mode and Dark Mode?", answer: "Yes! You can toggle between Light Mode and Dark Mode with one click. The analysis engine calculates separate edge contrast scores for both dark backgrounds (#0f0f0f) and light backgrounds (#ffffff) to warn you if dark borders or white text blend into the viewer’s interface." },
      { question: "Can I compare multiple video title options?", answer: "Yes. You can enter up to three title variations (Primary Title, Option 2, and Option 3). The comparison table displays character counts, word counts, and estimated truncation states side-by-side, and lets you activate any option in the live phone preview with a single click." },
      { question: "Does this tool predict actual YouTube CTR (Click-Through Rate)?", answer: "No tool can predict real viewer CTR or algorithmic ranking because audience interest, niche competition, topic timing, and viewer intent vary widely. Our Feed Standout and Readability scores measure mathematical visual characteristics (luminance, tonal contrast, color saturation, and edge clarity) to help you optimize visual clarity, not make algorithmic promises." },
      { question: "Are my thumbnail images uploaded to any server?", answer: "No. The simulator operates locally inside your web browser using HTML5 File APIs and Canvas 2D. Your images are never transmitted to any external server or third-party service, keeping your unpublished creator assets private." },
      { question: "What is the optimal YouTube thumbnail size and aspect ratio?", answer: "YouTube recommends an aspect ratio of 16:9 with a resolution of 1280×720 pixels (minimum 640 pixels wide) in JPG, PNG, or WebP format with a file size under 2MB. Our tool automatically checks your uploaded image dimensions and flags non-16:9 ratios so you can avoid awkward letterboxing or cropping." }
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
      'Local Browser Processing'
    ],
    howTo: [
      { title: "Upload Channel Banner Graphic", desc: "Select or drag your 2560x1440 channel art file into the interactive safe area simulator." },
      { title: "Inspect Multi-Device Crop Zones", desc: "Switch between Mobile (1546x423), Desktop (2560x423), Tablet, and TV views or enable simultaneous 3-Way Comparison mode." },
      { title: "Align Artwork to Safe Boundaries", desc: "Adjust pan position and scale to ensure your logo, text, and faces sit entirely within the emerald safe zone before uploading." }
    ],
    faq: [
      { question: "Why does YouTube crop my channel banner differently on mobile, desktop, and TV?", answer: "YouTube serves a single responsive banner image across smart TVs, desktop computers, tablets, and mobile phones. On TVs, the entire 2560 × 1440 pixel image is shown. On desktop browsers, YouTube crops the image into a wide, shallow horizontal strip of 2560 × 423 pixels. On smartphones, YouTube crops the sides even further to fit narrow phone screens, displaying only the central 1546 × 423 pixel safe area. If your important text or logos are placed near the edges, they will be cut off on mobile devices." },
      { question: "What size should a YouTube channel banner be?", answer: "According to official YouTube guidelines, the recommended banner upload dimensions are 2560 × 1440 pixels with a 16:9 aspect ratio. The minimum required upload dimension is 2048 × 1152 pixels. YouTube accepts JPG, PNG, GIF, and WebP files up to 6MB in size." },
      { question: "What is the YouTube banner safe area?", answer: "The YouTube banner safe area is the central 1546 × 423 pixel zone of a standard 2560 × 1440 pixel canvas (or 1235 × 338 pixels at minimum upload resolution). Any text, logos, social handles, faces, or call-to-actions placed inside this central safe zone remain fully visible across standard device types—including smartphones, tablets, laptops, and 4K TVs." },
      { question: "How can I prevent my logo from being cropped?", answer: "To prevent your logo and text from being cropped, always keep them centered horizontally and vertically within the 1546 × 423 pixel safe area. Use our simulator’s 'Safe Area Outline' and 'Center Alignment Guides' to verify that none of your essential branding touches or crosses outside the emerald safe boundary." },
      { question: "Can I check my banner before uploading it?", answer: "Yes! That is the exact purpose of this tool. Simply upload your drafted channel art to test how it appears in realistic YouTube-style Mobile, Desktop, and TV contexts. You can also use our 3-Way Crop Comparison mode to simultaneously inspect where the mobile and desktop cutoffs occur." },
      { question: "Does the simulator upload my image?", answer: "No. This tool runs in your web browser. Your banner image is loaded directly into browser memory and is not uploaded to Zubware servers. Your creator designs remain on your local device." },
      { question: "Does this tool guarantee the exact YouTube crop?", answer: "No. This is a visual simulation based on current official YouTube banner guidance and standard device aspect ratios. YouTube periodically updates its web and mobile app interfaces, and different smartphone screen aspect ratios (such as 19.5:9 or foldable screens) may apply minor visual variations. Always verify the live result on your channel after uploading." }
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
    features: ['Desktop & Mobile View', 'Search & Suggested Feed', 'Dark & Light Mode', 'Custom Title & Channel', 'Client-Side Processing'],
    howTo: [
      { title: "Upload Thumbnail or Paste Video URL", desc: "Upload a local image file or enter any YouTube video link to automatically retrieve its official high-resolution thumbnail." },
      { title: "Customize Title & Channel Information", desc: "Enter your video title, channel name, view count, and upload time ago to populate the realistic YouTube card." },
      { title: "Preview Across Layouts & Color Themes", desc: "Toggle between Desktop card view, Mobile feed format, Dark theme, and Light theme to evaluate presentation." }
    ],
    faq: [
      { question: "Can I preview thumbnails from published YouTube videos by entering a link?", answer: "Yes. Pasting any standard YouTube video URL or 11-character video ID automatically loads its official maxresdefault or hqdefault thumbnail image into the preview card." },
      { question: "Why should I test thumbnails in both Dark and Light themes?", answer: "YouTube's Dark Mode background (#0f0f0f) can swallow thumbnails with dark outer borders, while Light Mode (#ffffff) reveals contrast against light backgrounds. Testing both ensures your artwork stands out in either user setting." },
      { question: "What is the recommended resolution for YouTube thumbnail uploads?", answer: "YouTube recommends a 16:9 aspect ratio at 1280x720 pixels (minimum 640 pixels wide) in JPG, PNG, or WebP format with a file size under 2MB." },
      { question: "Does this preview tool display the bottom-right video duration badge?", answer: "Yes. The preview card displays the bottom-right timestamp overlay so you can verify that essential text, faces, or brand badges are not obscured by the duration clock." },
      { question: "Are my uploaded thumbnail concepts saved or uploaded to external servers?", answer: "No. Uploaded preview graphics and metadata are handled locally in your browser memory with zero tracking or server-side caching." }
    ]
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
    features: ['Categorized Suggestions', 'Handle Format Checker', 'Favorites List', 'One-Click Copy', 'Zero Server Dependence'],
    howTo: [
      { title: "Enter Seed Keyword & Select Niche", desc: "Type a keyword representing your personal name, topic, or theme and choose your channel category." },
      { title: "Pick a Naming Formula Style", desc: "Filter results by Modern, Brandable, Catchy, Two-Word, or Minimalist naming styles." },
      { title: "Save Favorites & Check Handles", desc: "Click the star icon to save names to your shortlist and click Check Handle to verify availability on YouTube." }
    ],
    faq: [
      { question: "What makes a memorable YouTube channel name?", answer: "A great channel name is easy to spell, pronounceable, memorable, relevant to your content theme, and flexible enough to grow with your channel over time." },
      { question: "Can I change my YouTube channel name later without losing subscribers?", answer: "Yes. You can update your channel name and handle in YouTube Studio under Customization -> Basic Info without losing subscribers, videos, or watch hours." },
      { question: "What is the difference between a Channel Name and a YouTube Handle?", answer: "Your Channel Name is your public display title (e.g. 'Tech Studio'), while your Handle is your unique identifier starting with '@' (e.g. '@TechStudioOfficial') used for mentions and custom URLs." },
      { question: "Should my channel name include my personal name or a brand name?", answer: "If you plan to build a personal brand, personality-driven vlog, or coaching business, using your name works well. If you are creating topical tutorials, gaming, or company content, a descriptive brandable name is often easier for new audiences to remember." },
      { question: "Does this tool guarantee trademark or handle availability?", answer: "No. It provides creative name concepts and quick search links. You should always verify handle availability on YouTube and conduct trademark searches before commercializing a brand." }
    ]
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
    features: ['10 Niche Categories', 'Angles & Target Audience', 'Difficulty Rating', 'Copy & Save Ideas', 'Client-Side Processing'],
    howTo: [
      { title: "Select Channel Niche", desc: "Choose your content category from Tech, Gaming, Lifestyle, Education, Business, Fitness, and more." },
      { title: "Filter by Content Format", desc: "Narrow ideas by format type—such as Beginner Tutorials, Common Mistakes, Deep Dives, or Challenge concepts." },
      { title: "Save Favorites & Plan Production", desc: "Click the star icon to save your favorite concepts to your personal production shortlist or copy them to your notes." }
    ],
    faq: [
      { question: "How do I choose which video idea to produce first?", answer: "Look for ideas that combine high audience search interest with low competition, or concepts that address a specific painful problem your target viewers frequently encounter." },
      { question: "How can I adapt these ideas for YouTube Shorts vs Long-Form videos?", answer: "Shorts focus on a single quick tip, shocking stat, or 30-second demonstration, whereas long-form videos allow deep step-by-step explanations, stories, and multi-part breakdowns." },
      { question: "Why do 'Common Mistakes' video concepts perform so well?", answer: "Negative curiosity hooks (such as '5 Mistakes Beginners Make') trigger curiosity and loss aversion, often outperforming positive titles like '5 Tips for Beginners' in click-through rate." },
      { question: "Can I customize these ideas with my own personal twist?", answer: "Yes! Treat these concepts as structural frameworks. Infuse them with your unique personal experiences, case studies, and channel personality." },
      { question: "Does Zubware claim ownership of generated video ideas?", answer: "No. All generated ideas are free for creators to use, adapt, script, and monetize without attribution or restrictions." }
    ]
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
    features: ['Catchy Playlist Titles', 'Categorized Styles', 'Copy to Clipboard', 'Download TXT & JSON', 'Instant Local Gen'],
    howTo: [
      { title: "Enter Topic or Series Subject", desc: "Type the core topic of your video series or themed collection into the generator." },
      { title: "Select Playlist Architecture", desc: "Browse generated titles organized by Course Series, Bingeable Themes, Best-Of Compilations, and Challenge arcs." },
      { title: "Copy Selected Playlist Title", desc: "Click your preferred playlist name to copy it and paste it into YouTube Studio under Playlists." }
    ],
    faq: [
      { question: "How do YouTube playlists improve channel watch time and SEO?", answer: "Playlists automatically play consecutive videos, increasing average session duration—a critical metric YouTube's algorithm rewards with increased recommendations across your channel." },
      { question: "What should be included in an effective YouTube playlist title?", answer: "Include your primary search keyword along with clear series indicators such as 'Complete Guide', 'Full Course', or 'Step-by-Step Series' so viewers know it's a curated progression." },
      { question: "Can playlists rank in YouTube and Google search results independently?", answer: "Yes! Playlists rank separately in both YouTube and Google Search, giving your channel an additional opportunity to capture search traffic for broad queries." },
      { question: "Should I write a description for my YouTube playlists?", answer: "Yes. Adding a 2–3 sentence description to your playlist containing relevant keywords helps YouTube understand the collective topic of the videos and boosts indexing." },
      { question: "How many videos should a YouTube playlist contain?", answer: "Playlists with 4 to 12 videos are ideal for binge-watching without overwhelming viewers; for longer courses, consider breaking them into Part 1 and Part 2 series." }
    ]
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
    features: ['Chapter Timestamp Builder', 'Auto-Chronological Sort', '00:00 Intro Validation', 'Instant Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Add Video Chapters & Start Times", desc: "Enter the minutes and seconds along with a descriptive title for each video section." },
      { title: "Validate YouTube Chapter Rules", desc: "Ensure your first timestamp starts at 00:00, each chapter is at least 10 seconds long, and you have at least 3 chapters." },
      { title: "Copy Formatted Timestamps", desc: "Click Copy All to copy the timestamp block and paste it directly into your YouTube video description." }
    ],
    faq: [
      { question: "What are the official YouTube rules for clickable video chapters?", answer: "To activate video chapters: 1) Your first chapter must start at 00:00, 2) You must list at least 3 chapters in ascending order, and 3) Each chapter must be at least 10 seconds long." },
      { question: "How do chapters help viewers and YouTube SEO?", answer: "Chapters let viewers jump directly to the exact answer they need, and Google search displays chapters as interactive key moments in search results." },
      { question: "Can I use YouTube timestamps for single-song music tracks or podcasts?", answer: "Yes. Timestamps are commonly used for podcast topic breakdowns, interview question marks, and tracklists for DJ mixes and albums." },
      { question: "What is the standard timestamp format YouTube recognizes?", answer: "Use standard MM:SS format (e.g., 03:45) for videos under one hour, and HH:MM:SS (e.g., 01:15:30) for videos that exceed 60 minutes." },
      { question: "What happens if I forget to start at 00:00?", answer: "If the first timestamp does not begin at 00:00, YouTube's player will not parse the timestamps as interactive scrubber chapters on the video progress bar." }
    ]
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
    features: ['Clean Spacing & Indents', 'Bullet & Divider Styles', 'Section Auto-Capitalize', 'Live Preview Box', 'Copy Formatted Text'],
    howTo: [
      { title: "Paste Raw Text into Editor", desc: "Enter or paste your unformatted notes, links, or video summary into the input box." },
      { title: "Select Bullet Styles & Section Dividers", desc: "Choose your preferred bullet symbols (arrows, dashes, emojis) and decorative separator lines." },
      { title: "Format & Copy Polished Description", desc: "Click to clean and format the text, preview the organized layout, and copy it ready for YouTube Studio." }
    ],
    faq: [
      { question: "Why is a well-formatted YouTube description important?", answer: "Clear section dividers, bulleted lists, and structured headers make long descriptions easy to skim, increasing click-through rates on your links and affiliate recommendations." },
      { question: "How does the formatter handle website and social URLs?", answer: "It identifies URLs in your text and ensures they are placed on dedicated lines with proper spacing so YouTube renders them as clickable links." },
      { question: "Can I customize the style of bullet points and divider lines?", answer: "Yes. You can toggle between modern arrows, traditional bullet dots, clean dashes, or emojis, and choose subtle or bold horizontal section dividers." },
      { question: "Does formatting affect search engine optimization (SEO)?", answer: "Clean descriptions with well-spaced keyword sections and readable text help YouTube's natural language processing algorithms accurately categorize your content." },
      { question: "Is any of my copied text or links stored on Zubware servers?", answer: "No. All text parsing, regex replacement, and formatting run entirely in your local browser memory." }
    ]
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
    features: ['1-4 Word Power Phrases', 'Engagement Categories', 'Visual Typography Preview', 'One-Click Copy', 'Instant Local Generator'],
    howTo: [
      { title: "Enter Your Video Topic", desc: "Type the main topic, niche, or keyword of your YouTube video into the text input field." },
      { title: "Browse Short-Form Hook Formulas", desc: "Explore generated 2-to-4 word thumbnail hook categories including curiosity gaps, shock, numbers, and warnings." },
      { title: "Copy Text for Graphic Design", desc: "Click any hook idea to copy it to your clipboard and paste it directly into your thumbnail design in Photoshop, Canva, or Zubware." }
    ],
    faq: [
      { question: "Why should thumbnail text be limited to 2 to 4 words?", answer: "Viewers scan YouTube feeds in less than a second on small mobile screens. Short 2–4 word phrases in bold, high-contrast fonts grab immediate attention without cluttering the visual image." },
      { question: "Should thumbnail text repeat the video title word-for-word?", answer: "No. The highest-performing YouTube videos use thumbnail text as a punchy curiosity hook or emotional question, allowing the video title to provide the descriptive context and SEO keywords." },
      { question: "How do these short hooks improve YouTube CTR (Click-Through Rate)?", answer: "Formulas based on curiosity gaps, emotional stakes, and contrasting outcomes create an irresistible impulse for viewers to click and discover the answer." },
      { question: "Which font styles work best with these generated thumbnail phrases?", answer: "Heavy, bold sans-serif typefaces (such as Impact, Montserrat ExtraBold, Anton, or Bebas Neue) with high-contrast outlines or drop shadows offer maximum readability on mobile devices." },
      { question: "Can I use these hooks for YouTube Shorts and TikTok cover text?", answer: "Yes. These short hooks work exceptionally well for vertical 9:16 Shorts cover frames, TikTok preview text, and Instagram Reel covers." }
    ]
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
    features: ['5 Social Platforms', 'Curiosity & Urgency Hooks', 'Retention-Driven Formula', 'One-Click Copy', 'Zero Server Dependence'],
    howTo: [
      { title: "Input Video or Post Topic", desc: "Type your content subject, target audience, and primary emotional angle into the prompt field." },
      { title: "Select Hook Framework & Tone", desc: "Choose from proven frameworks: Curiosity Gap, Contrarian Hot Take, Story Loop, Authority Case Study, or Negative Warning." },
      { title: "Review & Copy Top Viral Hooks", desc: "Browse generated high-CTR hook variations, inspect engagement ratings, and click Copy to clipboard." }
    ],
    faq: [
      { question: "How do viral hook frameworks increase video and post retention?", answer: "Viral hooks target psychological triggers—such as curiosity gaps, surprising contrarian facts, and open story loops—that capture attention within the first 3 seconds of scrolling." },
      { question: "Can I use these hooks across YouTube Shorts, TikTok, and Instagram Reels?", answer: "Yes. Short-form video platforms share identical first-3-second retention requirements, making these opening hooks universally effective." },
      { question: "Can I generate hooks tailored for LinkedIn and Twitter/X text posts?", answer: "Yes. Switch to 'Text Post' mode to generate one-line opening scroll-stoppers optimized for text-based newsfeeds." },
      { question: "Does the generator score hook strength?", answer: "Yes. Each hook includes estimated curiosity and urgency metrics to help you select the most impactful variation." },
      { question: "Are my content ideas transmitted to an external server?", answer: "No. The algorithmic hook assembly runs locally in your web browser." }
    ]
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
    features: ['5 CTA Types', 'Multiple Tone Options', 'High-Converting Formulas', 'One-Click Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Define Desired User Action", desc: "Choose your primary goal: Newsletter Signup, Product Purchase, Social Follow, Comment Engagement, or Free Trial." },
      { title: "Select Tone & Urgency Level", desc: "Configure style (Low Friction, High Urgency, Value-Driven, Casual, or Direct) and adjust incentive offers." },
      { title: "Copy High-Converting CTA", desc: "Review button labels, closing sentences, and caption CTAs, then click Copy to clipboard." }
    ],
    faq: [
      { question: "What makes a call-to-action (CTA) high-converting?", answer: "Effective CTAs use low-friction action verbs, clearly communicate immediate user value (e.g. 'Get Instant Access' vs 'Submit'), and eliminate decision anxiety." },
      { question: "Can I generate social media comment-driver CTAs?", answer: "Yes. The 'Engagement' mode creates natural discussion questions and prompts designed to boost comments and algorithmic reach." },
      { question: "Are button label CTAs separated from caption closing CTAs?", answer: "Yes. The tool outputs both short 2-to-4 word microcopy for UI buttons and full 1-to-2 sentence closing copy for posts and emails." },
      { question: "Can I include urgency and scarcity triggers?", answer: "Yes. Urgency presets generate tasteful deadline and limited-availability phrasing without sounding spammy." },
      { question: "Is this tool free and private?", answer: "Yes. All CTA calculations and template rendering occur locally on your device with complete privacy." }
    ]
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
    features: ['Characters & Words', 'Reading Time Estimate', 'Platform Limit Gauges', 'Text Formatting Cleaners', 'Local Browser Processing'],
    howTo: [
      { title: "Enter Social Post Content", desc: "Type or paste your post copy into the multi-platform editor." },
      { title: "Monitor Live Platform Limit Gauges", desc: "Track real-time character meters and progress rings for Twitter/X (280), Threads (500), LinkedIn (3,000), Instagram caption (2,200), and TikTok (2,200)." },
      { title: "Optimize Length & Copy Formatted Text", desc: "Ensure your copy stays safely within optimal truncation cutoffs and copy the finalized post." }
    ],
    faq: [
      { question: "What are the exact character limits across major social networks?", answer: "Twitter/X is 280 characters, Threads is 500 characters, Instagram captions allow 2,200, LinkedIn posts support 3,000, and TikTok descriptions support 2,200." },
      { question: "What is the 'See More' truncation cutoff threshold?", answer: "Platforms truncate visible text behind a '...more' link: Instagram truncates around 125 characters, and LinkedIn truncates around 210 characters. The tool displays indicator lines for these cutoffs." },
      { question: "How does the counter calculate URL lengths for Twitter/X?", answer: "It accurately accounts for Twitter's t.co link shortening algorithm, which wraps any URL into a fixed 23-character count regardless of the original URL length." },
      { question: "Are emojis counted as 1 character or multiple characters?", answer: "The counter uses standard Unicode grapheme cluster splitting, properly counting emojis to reflect exact platform submission metrics." },
      { question: "Does the counter save or store typed draft messages?", answer: "No. Input text remains strictly within component memory in your active browser session." }
    ]
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
    features: ['Categorized Emoji Library', 'Fast Keyword Search', 'Recent & Favorites Stack', 'Social Combo Presets', 'One-Click Copy'],
    howTo: [
      { title: "Search by Emotion, Keyword or Concept", desc: "Type feelings, objects, activities, or topics into the intelligent emoji search box." },
      { title: "Browse Categorized Emoji Sets", desc: "Filter through contextual clusters: Reactions, Tech & Business, Nature, Aesthetic Accents, and Bullet Indicators." },
      { title: "Copy Single or Combined Emoji Chains", desc: "Click individual emojis to copy instantly, or assemble custom emoji sequences in the bottom staging tray." }
    ],
    faq: [
      { question: "Does this generator support modern Unicode emoji releases?", answer: "Yes. It supports the latest Unicode Emoji standard (Emoji 15.0+), including skin-tone modifiers and multi-person composite emojis." },
      { question: "Can I generate coordinated emoji bullet points for posts?", answer: "Yes. The 'Bullet Point' category provides professional symbols (checkmarks, arrows, minimalist geometric shapes) for structured social posts." },
      { question: "How does semantic keyword search work for emojis?", answer: "The search index maps thousands of synonyms and colloquial terms to related emojis (e.g. searching 'coding' matches 💻, ⌨️, 👨‍💻, ⚡)." },
      { question: "Can I copy multiple emojis as an assembled sequence?", answer: "Yes. Click multiple emojis to populate the staging bar and copy the full decorative combination with one click." },
      { question: "Is this tool completely browser-based?", answer: "Yes. Emoji mapping and Unicode glyph handling execute entirely in your local browser." }
    ]
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
    features: ['11 Niche Categories', 'Multiple Variations', 'Emoji & Hashtag Integration', 'One-Click Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Describe Post Photo or Video Topic", desc: "Input your image context, key message, and location or setting." },
      { title: "Select Caption Vibe & Formatting", desc: "Choose from Minimalist Aesthetic, Storytelling, Humorous & Relatable, Motivational, or Business Promo with clean line breaks." },
      { title: "Copy Caption with Safe Spacing", desc: "Review formatted captions with line breaks and invisible separators that prevent messy Instagram wall-of-text collapse." }
    ],
    faq: [
      { question: "How does this tool prevent Instagram line breaks from collapsing?", answer: "It inserts invisible non-breaking whitespace characters into blank lines, ensuring your paragraph spacing remains intact when published on Instagram." },
      { question: "What is the recommended caption length for Instagram engagement?", answer: "Short punchy captions (1-3 sentences) perform well on casual lifestyle photos, while micro-blog captions (1,000+ characters) drive higher saves and shares on educational carousels." },
      { question: "Does the generator include relevant call-to-actions (CTAs)?", answer: "Yes. You can toggle concluding CTAs that prompt users to save the post, tag a friend, or tap the link in your bio." },
      { question: "Can I include curated hashtag blocks with the caption?", answer: "Yes. Captions can include a clean bottom hashtag group spaced appropriately from your main story text." },
      { question: "Are caption drafts uploaded or stored on any server?", answer: "No. Caption assembly occurs entirely within your local browser runtime." }
    ]
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
    features: ['Categorized Hashtag Sets', 'Popular, Niche & Local', 'Character & Count Metrics', 'Copy All Button', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Niche or Primary Keyword", desc: "Type your topic, industry, or visual theme (e.g. 'streetwear', 'coffeeroaster', 'fitnessjourney')." },
      { title: "Select Audience Tier Strategy", desc: "Filter hashtags by competition volume: High Reach (1M+ posts), Mid-Tier (100k-500k), and Niche Community (10k-50k)." },
      { title: "Copy 30-Tag Balanced Set", desc: "Click Copy All or select individual tags to copy a balanced hashtag block ready for your post or first comment." }
    ],
    faq: [
      { question: "How many hashtags should I use on Instagram?", answer: "Instagram allows up to 30 hashtags per post. Instagram's creator guidelines recommend focusing on 3 to 8 highly specific, relevant hashtags to help the recommendation algorithm categorize your niche." },
      { question: "What is the 3-tier hashtag strategy?", answer: "It combines 2-3 broad high-volume tags for reach, 3-5 mid-volume community tags for sustained ranking, and 2-3 hyper-specific niche tags where your post can dominate the recent feed." },
      { question: "Should hashtags go in the caption or the first comment?", answer: "Instagram's search algorithm indexes hashtags identically in both locations. Placing them in the caption is recommended for immediate discoverability." },
      { question: "Does the generator filter out banned and spammy hashtags?", answer: "Yes. The dictionary filters out flagged, over-saturated, and banned hashtags that could negatively impact post reach." },
      { question: "Is this hashtag tool free to use without registration?", answer: "Yes. You can generate unlimited hashtag combinations client-side without creating an account." }
    ]
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
    features: ['10 Profile Categories', 'Multiple Aesthetic Styles', '150 Character Limit Check', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Input Niche & Core Identity", desc: "Enter your profession, brand mission, and target audience into the bio builder." },
      { title: "Choose Bio Layout Style", desc: "Select Bulleted Minimalist, Clean One-Liner, Creator Credibility, or Local Business format with emoji accents." },
      { title: "Test 150-Character Limit & Copy", desc: "Check the live character meter against Instagram's strict 150-character bio cap and click Copy to clipboard." }
    ],
    faq: [
      { question: "What is the character limit for an Instagram profile bio?", answer: "Instagram limits profile bios strictly to 150 characters, making concise line-spaced messaging essential." },
      { question: "How does the tool format multi-line bios without breaking on mobile?", answer: "It uses compact newline delimiters and concise bullet points that stay neatly aligned across iOS and Android screen widths." },
      { question: "What are the four essential elements of a high-converting bio?", answer: "An effective bio contains: 1) Who you help, 2) How you help them, 3) Social proof / credentials, and 4) A clear CTA pointing down to your link." },
      { question: "Can I use aesthetic Unicode fonts in the generated bio?", answer: "Yes. You can toggle aesthetic font styling for your display name or title line to stand out visually in search." },
      { question: "Is my personal profile information saved on a server?", answer: "No. All bio combinations are generated client-side in browser memory with zero tracking." }
    ]
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
    features: ['Short & Minimal Styles', 'Professional & Creative', 'Random Combination Mode', 'One-Click Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Enter Name or Primary Brand Keyword", desc: "Input your name, creative handle, or business theme into the generator." },
      { title: "Select Handle Style & Category", desc: "Filter by Clean & Aesthetic, Professional / Agency, Gaming / Creator, or Prefix/Suffix variants (the, official, studio)." },
      { title: "Browse & Copy Username Ideas", desc: "Inspect available username ideas formatted with clean underscores and dots, and copy your favorite handle." }
    ],
    faq: [
      { question: "What are Instagram's official username syntax rules?", answer: "Usernames can contain up to 30 characters and may only include letters (a-z), numbers (0-9), periods (.), and underscores (_). Spaces and special symbols are prohibited." },
      { question: "How does the generator create memorable username suggestions?", answer: "It blends your root word with phonetic aesthetic modifiers, creative suffixes (.hq, .studio, .co), and clean minimalist prefixes." },
      { question: "Does the generator guarantee that a username is unclaimed on Instagram?", answer: "The tool generates syntactically valid suggestions; live availability must be confirmed directly inside Instagram during profile setup." },
      { question: "Can I filter out numbers and symbols for clean personal handles?", answer: "Yes. You can toggle 'Letters Only' to exclude numbers, periods, and underscores for minimalist handles." },
      { question: "Are my keyword searches recorded?", answer: "No. All username generation algorithms execute locally on your machine." }
    ]
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
    features: ['6 Niche Categories', 'Hook & Call to Action', 'Trending Style Formats', 'One-Click Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Describe Video Content & Hook", desc: "Input your video concept, joke punchline, or tutorial topic." },
      { title: "Select Caption Style & Trend Vibe", desc: "Choose Viral Relatable, POV Storytime, Educational Step-by-Step, or Punchy One-Liner." },
      { title: "Copy TikTok Caption & Hashtags", desc: "Review the caption formatted with search-friendly keywords and copy it for immediate upload." }
    ],
    faq: [
      { question: "How does TikTok SEO affect video discoverability?", answer: "TikTok functions as a search engine; including descriptive natural keywords in your caption and on-screen text helps the algorithm surface your video for user search queries." },
      { question: "What is TikTok's description character limit?", answer: "TikTok allows up to 2,200 characters in descriptions, giving creators ample room for search-rich descriptions alongside short punchy hooks." },
      { question: "Can I generate loop-prompt captions that encourage repeat views?", answer: "Yes. The 'Loop Trap' mode crafts clever open-ended captions that prompt viewers to re-watch the video to understand the beginning." },
      { question: "Does the generator include trending FYP hashtags?", answer: "Yes. It combines broad discoverability tags with specific topical community tags to maximize algorithm classification." },
      { question: "Is any user data transmitted to a server?", answer: "No. All text compilation operates strictly in local browser state." }
    ]
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
    features: ['FYP & Trending Clusters', 'Niche-Specific Tag Sets', 'Favorites Manager', 'One-Click Copy All', 'Client-Side Processing'],
    howTo: [
      { title: "Input Video Niche or Trend", desc: "Type your content category (e.g. 'booktok', 'gymtok', 'cleantok', 'techreview')." },
      { title: "Configure Hashtag Batch Size", desc: "Select how many tags to generate (recommended 3 to 6 high-relevance tags)." },
      { title: "Copy Curated FYP Hashtags", desc: "Review the hashtag cluster and click Copy to clipboard to append to your TikTok description." }
    ],
    faq: [
      { question: "Why is using fewer, targeted hashtags better on TikTok?", answer: "TikTok's recommendation system categorizes content based on semantic relevance; using 3-5 hyper-relevant niche tags signals content context far better than spamming generic #fyp tags." },
      { question: "What are community subculture tags (like #BookTok or #GymTok)?", answer: "Subculture tags connect your video directly to dedicated communities of high-intent viewers who actively engage with specific interest niches." },
      { question: "Can I mix trending sound tags with content tags?", answer: "Yes. The builder allows you to combine audio challenge hashtags with categorical content descriptors." },
      { question: "Does this tool update with current trending tags?", answer: "The library indexes popular viral community hashtags and dynamic keyword combinations across major TikTok verticals." },
      { question: "Is this hashtag tool free to use?", answer: "Yes. You can generate unlimited TikTok hashtag combinations client-side without registration." }
    ]
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
    features: ['7 Niche Categories', 'Engaging Storytelling Tone', 'Call to Action Options', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Post Message or Link Topic", desc: "Describe your photo, video, community announcement, or shared article link." },
      { title: "Choose Audience Tone & Engagement Goal", desc: "Select Personal Story, Group Community Discussion, Small Business Offer, or Question Poll." },
      { title: "Copy Shareable Facebook Copy", desc: "Inspect the conversational copy formatted with readable paragraphs and copy it for your feed or page." }
    ],
    faq: [
      { question: "What caption style performs best on Facebook personal feeds and pages?", answer: "Conversational storytelling, relatable personal anecdotes, and open-ended community questions drive the highest comments and meaningful social interactions on Facebook." },
      { question: "Can I generate captions tailored for Facebook Groups?", answer: "Yes. The 'Community Group' mode structures posts that introduce discussions, ask for group member recommendations, and follow group guidelines." },
      { question: "How does the generator handle link post descriptions?", answer: "It writes compelling teaser commentary that summarizes key article takeaways and encourages clicks without clickbait penalties." },
      { question: "Are emojis used moderately for professional Facebook pages?", answer: "Yes. You can toggle professional mode to keep emoji usage subtle and clean for business organizations." },
      { question: "Are my draft Facebook posts kept private?", answer: "Yes. All post text generation runs locally in your browser." }
    ]
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
    features: ['Trending Facebook Tags', 'Topic-Based Tag Clusters', 'One-Click Copy', 'Fast Local Processing', 'Free to Use'],
    howTo: [
      { title: "Enter Topic or Event Keyword", desc: "Type your campaign theme, holiday event, local business niche, or article topic." },
      { title: "Select Hashtag Count & Scope", desc: "Choose 1 to 3 targeted hashtags (recommended best practice for Facebook engagement)." },
      { title: "Copy Facebook-Optimized Tags", desc: "Review the selected tags and copy them to append to your public Facebook post." }
    ],
    faq: [
      { question: "How many hashtags should you use on Facebook?", answer: "Best practices suggest using 1 to 3 relevant hashtags on Facebook; excessive hashtag usage can look cluttered and reduce organic engagement on Facebook feeds." },
      { question: "Do hashtags work inside public Facebook Groups and Events?", answer: "Yes. Hashtags in public groups and events help members track recurring topic threads, weekly challenges, and event announcements." },
      { question: "Can I generate branded campaign hashtags for small businesses?", answer: "Yes. The generator creates localized and brand-specific hashtag variations suitable for promotional events and sales." },
      { question: "Are hashtag searches tracked on Zubware?", answer: "No. All hashtag indexing runs in local browser memory." },
      { question: "Can I copy individual tags or the entire set?", answer: "Yes. You can click any individual tag to copy it or click Copy All for the complete formatted set." }
    ]
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
    features: ['10 Career Paths', 'Impact & Keyword Formats', 'Multi-Variation Output', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Input Current Role & Core Competencies", desc: "Enter your job title, primary technical skills, industry niche, and career achievements." },
      { title: "Select Headline Value Formula", desc: "Choose from Role + Impact Value, Keyword-Rich Recruiter Magnet, Thought Leader, or Career Transition formula." },
      { title: "Test 220-Character Limit & Copy", desc: "Check the character counter against LinkedIn's 220-character headline limit and click Copy to clipboard." }
    ],
    faq: [
      { question: "What is the maximum character length for a LinkedIn headline?", answer: "LinkedIn allows up to 220 characters for your profile headline on desktop and mobile." },
      { question: "Why is a value-driven headline better than just a job title?", answer: "A headline stating 'Helping [target audience] achieve [measurable result]' communicates clear business impact and value proposition to prospective employers, clients, and recruiters." },
      { question: "How does the tool optimize headlines for LinkedIn recruiter search?", answer: "It integrates high-volume industry keywords, certifications, and specialized technical competencies that recruiters query in LinkedIn Recruiter." },
      { question: "Can job seekers use this headline generator while actively looking?", answer: "Yes. Headline templates highlight expertise and open-to-work availability without sounding generic or desperate." },
      { question: "Is my personal professional data stored on a database?", answer: "No. Headline generation occurs client-side in browser memory with complete privacy." }
    ]
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
    features: ['Structured Bio Sections', 'Live Text Editing', 'One-Click Copy', 'Download TXT File', 'Client-Side Processing'],
    howTo: [
      { title: "Provide Career History & Achievements", desc: "Enter your career background, notable project metrics, industry passion, and core skills." },
      { title: "Select Narrative Voice & Structure", desc: "Choose First-Person Storyteller, Executive Accomplishment-Driven, or Creative Technologist style." },
      { title: "Copy 2,600-Character LinkedIn About Section", desc: "Review your structured summary featuring opening hook, career wins, and contact CTA, and copy it." }
    ],
    faq: [
      { question: "What is the character limit for the LinkedIn About summary section?", answer: "LinkedIn allows up to 2,600 characters in the About summary, which equates to roughly 350-450 words of formatted text." },
      { question: "Should a LinkedIn summary be written in first person or third person?", answer: "First person ('I am a software architect passionate about...') is strongly recommended on modern LinkedIn because it feels authentic, personable, and approachable." },
      { question: "How does the generator structure the summary for mobile readability?", answer: "It uses short 2-to-3 sentence paragraphs, bulleted skill callouts, and clean white space to ensure scannability on smartphone screens." },
      { question: "Does the summary include a professional call-to-action (CTA)?", answer: "Yes. It concludes with an invitation to connect, email, or explore your portfolio, specifying how colleagues and recruiters can reach you." },
      { question: "Is my resume or career information transmitted anywhere?", answer: "No. All text processing is executed locally in your browser." }
    ]
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
    features: ['5 Style Options', '160 Character Limit Indicator', 'Hashtag & Tag Suggestions', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Input Niche, Identity & Humor Level", desc: "Enter your profession, side projects, hobbies, and preferred humor level." },
      { title: "Select Bio Style", desc: "Choose from Tech Founder / Builder, Sarcastic One-Liner, High-Signal Specialist, or Minimalist Handle." },
      { title: "Test 160-Character Limit & Copy", desc: "Monitor the real-time character gauge against Twitter/X's strict 160-character bio cap and copy your handle bio." }
    ],
    faq: [
      { question: "What is Twitter/X's official bio character limit?", answer: "Twitter/X limits profile bios strictly to 160 characters, making every word and punctuation mark critical." },
      { question: "How does the generator craft punchy Twitter bios?", answer: "It combines concise credentials, witty self-deprecation, and direct project links or location tags tailored to Twitter's fast-paced culture." },
      { question: "Can I include hashtags and handle mentions in the bio?", answer: "Yes. The builder integrates company or project handles (@username) and topical hashtags seamlessly into the 160-character budget." },
      { question: "Can I generate aesthetic lowercase bios?", answer: "Yes. You can toggle aesthetic lowercase mode for minimalist indie creator profiles." },
      { question: "Are profile ideas sent to external servers?", answer: "No. Bio compilation operates entirely client-side in browser memory." }
    ]
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
    features: ['8 Platform Selector Options', 'Topic Keyword Generator', 'Copy All Functionality', 'Fast Local Processing', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Topic or Target Keyword", desc: "Input any word, topic, or phrase into the universal search field." },
      { title: "Select Target Platform & Quantity", desc: "Choose Instagram, TikTok, LinkedIn, YouTube Shorts, or Twitter, and set your desired tag count." },
      { title: "Copy Clean Hashtag Set", desc: "Review the generated hashtag cluster formatted with # symbols and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does this generator adapt tags for different social networks?", answer: "It calibrates output quantity and format to match platform conventions: 3-5 tags for LinkedIn/TikTok, 10-25 tags for Instagram, and 2-3 tags for Twitter." },
      { question: "Can I copy tags separated by spaces or newlines?", answer: "Yes. Formatting toggles let you copy as a single-line space-separated block or a multi-line list for easy editing." },
      { question: "Does the generator remove punctuation and invalid characters from hashtags?", answer: "Yes. It strips punctuation, spaces, and illegal symbols to ensure every output tag is valid across social platforms." },
      { question: "Can I exclude specific tags from the generated set?", answer: "Yes. You can click the 'x' on any individual tag to remove it before copying the remaining list." },
      { question: "Is an internet connection needed to generate tags?", answer: "No. The algorithmic keyword associative dictionary executes locally in your browser." }
    ]
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
    features: ['Bold, Italic & Script', 'Bubble, Outline & Monospace', 'Small Caps Style', 'Instant One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Type Standard Text", desc: "Enter words, names, or sentences into the text conversion box." },
      { title: "Browse Fancy Unicode Font Styles", desc: "Scroll through dozens of live rendered styles: Bold Serif, Script Cursive, Gothic Fraktur, Monospace, Double-Struck, and Small Caps." },
      { title: "Click Any Style to Copy", desc: "Click the Copy button next to your favorite typography style to paste into Instagram bios, Discord names, or game handles." }
    ],
    faq: [
      { question: "How does the Fancy Text Generator work without installing fonts?", answer: "It maps standard ASCII letters to special mathematical and alphanumeric symbols located in the universal Unicode character set, which modern operating systems render natively as distinct font styles." },
      { question: "Will fancy text display properly on iPhone, Android, and Windows?", answer: "Yes. Unicode characters are part of the international standard supported by all modern operating systems and web browsers." },
      { question: "Can I use fancy text in Instagram bios, TikTok names, and Twitter tweets?", answer: "Yes. You can copy and paste fancy text directly into status updates, profile bios, photo captions, and gaming screen names." },
      { question: "What fancy font styles are included?", answer: "Styles include 𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗, 𝓢𝓬𝓻𝓲𝓹𝓽 𝓒𝓾𝓻𝓼𝓲𝓿𝓮, 𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜, ꜱᴍᴀʟʟ ᴄᴀᴘꜱ, 𝔒𝔩𝔡 𝔈𝔫𝔤𝔩𝔦𝔰𝔥, 🅒🅘🅡🅒🅛🅔🅢, and ｕｎｉｃｏｄｅ ｗｉｄｅ." },
      { question: "Does text conversion happen locally?", answer: "Yes. Character mapping lookup tables evaluate instantly in your browser without network communication." }
    ]
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
    features: ['20+ Unicode Text Styles', 'Live Input Preview', 'Favorites Collection', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Input Plain Text", desc: "Type or paste your message into the conversion input field." },
      { title: "Select Specific Unicode Mathematical Block", desc: "Browse categorized mathematical alphanumeric blocks: Bold, Italic, Bold-Italic, Sans-Serif, Monospace, and Cursive." },
      { title: "Copy Formatted Unicode Characters", desc: "Click Copy on the target typography card to copy pure Unicode glyphs ready for any text field." }
    ],
    faq: [
      { question: "What is the difference between standard CSS fonts and Unicode fonts?", answer: "CSS fonts require external stylesheet font files (.woff2) and only render on websites that load that font. Unicode fonts use distinct universal character code points that display anywhere, including plain text inputs and social media bios." },
      { question: "Can screen readers read Unicode mathematical alphanumeric symbols?", answer: "Screen readers may read stylized mathematical characters by their literal technical descriptions (e.g. 'Mathematical Bold Capital A'). For accessibility, use fancy Unicode text primarily for decorative accents, headings, and handles rather than vital body copy." },
      { question: "Does it convert numbers and punctuation as well as letters?", answer: "Yes. Mathematical double-struck, monospace, and circled blocks include full digit sets (0-9) alongside alphabet characters." },
      { question: "Can I convert text back to standard plain text?", answer: "Yes. An integrated reverse normalizer maps stylized Unicode characters back into standard readable ASCII Latin characters." },
      { question: "Is this tool completely free and client-side?", answer: "Yes. All character code transformations happen in browser memory with zero tracking." }
    ]
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
    features: ['Stars, Lines & Boxes', 'Arrows & Circles Decor', 'Minimal Separators', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Message or Phrase", desc: "Type words, titles, or status updates into the decorator input." },
      { title: "Choose Decorative Border & Ornament Style", desc: "Browse decorative frames: Star Accents (★), Floral Borders (✿), Wing Accents (꧁꧂), Sparkles (✨), and Kaomoji faces." },
      { title: "Copy Decorated Text", desc: "Click Copy on your preferred ornamented text design for gaming profiles, Discord channels, or bios." }
    ],
    faq: [
      { question: "What decorative text styles are available?", answer: "Styles include symmetrical wing banners (꧁༺text༻꧂), cute floral borders (🌸・text・🌸), sparkles (✨text✨), aesthetic dividers (═━═), and Japanese Kaomoji symbols." },
      { question: "Can I use decorated text in Discord channel names and nicknames?", answer: "Yes. Discord accepts standard Unicode decorative glyphs in server channels, category headers, user nicknames, and role names." },
      { question: "Will decorative symbols display properly on all mobile phones?", answer: "Yes. The symbols use universally supported Unicode blocks that render cleanly on iOS, Android, and desktop systems." },
      { question: "Can I customize the inner text after decoration?", answer: "Yes. You can edit the enclosed text directly or generate variations with one click." },
      { question: "Are decorated phrases saved or logged?", answer: "No. All text decoration is performed locally in browser memory." }
    ]
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
    features: ['Emoji Combination Canvas', 'Recents & Favorites Manager', 'One-Click Clipboard Copy', 'Clean Interface', 'Local Browser Processing'],
    howTo: [
      { title: "Select First Base Emoji", desc: "Pick your starting emoji from the visual emoji grid (e.g. 🐱 Cat, 🚀 Rocket, or 🤠 Cowboy)." },
      { title: "Select Second Mixing Emoji", desc: "Pick a secondary emoji to blend into a hybrid sticker (e.g. 👻 Ghost, 🍕 Pizza, or 🔥 Fire)." },
      { title: "Download Combined Hybrid Sticker", desc: "Inspect the generated Emoji Kitchen mashup sticker and click Copy or Download as a transparent PNG image." }
    ],
    faq: [
      { question: "What is an Emoji Kitchen mashup?", answer: "Emoji Kitchen is a creative feature originally popularized by Google's Gboard that combines two distinct emojis into a unique, whimsical hybrid sticker illustration." },
      { question: "Can I download combined emoji stickers with a transparent background?", answer: "Yes. Combined stickers export as high-resolution transparent PNG files ready for WhatsApp, Telegram, Discord, and iMessage." },
      { question: "Can I randomize emoji combinations with one click?", answer: "Yes. Click the Shuffle / Dice button to generate unexpected and humorous random emoji combinations instantly." },
      { question: "Are all emoji pairings supported?", answer: "Hundreds of popular face, animal, object, and food combinations have custom hand-crafted mashup stickers available." },
      { question: "Does the combiner require an account or installation?", answer: "No. The emoji combiner runs entirely in your web browser without installing keyboards or software." }
    ]
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
    features: ['Preserve Paragraph Spacing', 'Platform Mockup Previews', 'Invisible Space Inserter', 'One-Click Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Write or Paste Raw Post Draft", desc: "Input your rough post content, thoughts, or draft announcement into the editor." },
      { title: "Format Paragraphs, Bullets & Spacing", desc: "Add clean bullet lists, bold and italic headline accents, paragraph line separators, and hashtag sections." },
      { title: "Preview & Copy for Target Platform", desc: "Select LinkedIn, Instagram, or Twitter view to verify mobile layout, then click Copy Formatted Post." }
    ],
    faq: [
      { question: "How does this formatter fix collapsed line breaks on Instagram and LinkedIn?", answer: "It uses invisible Unicode spacing characters on empty lines to ensure the social platform's algorithm preserves your paragraph breaks when published." },
      { question: "Can I use bold and italic text in LinkedIn and Facebook posts?", answer: "Yes. The formatter converts highlighted text into Unicode bold (𝗯𝗼𝗹𝗱) and italic (𝘪𝘵𝘢𝘭𝘪𝘤) characters that display natively in social posts." },
      { question: "Does the preview simulate desktop and mobile views?", answer: "Yes. You can toggle between desktop newsfeed and smartphone card previews to inspect where text wraps and truncates." },
      { question: "Can I add organized bullet points and numbered lists?", answer: "Yes. One-click formatting tools insert clean Unicode bullet symbols (•, ⁃, ✦, ✔) that stay perfectly aligned." },
      { question: "Is my post content stored on a server?", answer: "No. Formatting and previewing execute locally in your browser session." }
    ]
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
    features: ['Live Mobile Mockup', 'All Social Media Links', 'Export Clean Static HTML', 'No Backend Required', 'Free Browser Tool'],
    howTo: [
      { title: "Enter Profile Name, Bio & Avatar", desc: "Add your handle, short bio description, brand color theme, and upload your profile photo." },
      { title: "Add Custom Links & Social Handles", desc: "Create buttons for your website, store, portfolio, newsletter, and social media channels with custom icons." },
      { title: "Preview Mobile Landing Page & Export", desc: "Inspect the responsive smartphone preview card and export your customized bio link page or configuration." }
    ],
    faq: [
      { question: "What is a bio link landing page?", answer: "A bio link page is a streamlined mobile-first landing page hosted in your social media bio that consolidates all your important links, products, and socials in one place." },
      { question: "Can I customize the color theme and button styles?", answer: "Yes. You can select modern color palettes, gradient backgrounds, frosted glass cards, and rounded or pill button styling." },
      { question: "Can I reorder links by dragging?", answer: "Yes. The link manager lets you drag and reorder links so your highest-priority promotion sits prominently at the top." },
      { question: "Is there a limit on how many links I can add?", answer: "No. You can add as many links as needed for stores, YouTube videos, podcast episodes, and affiliate recommendations." },
      { question: "Are my links and profile settings private?", answer: "Yes. The builder runs locally in your browser and saves your page configuration directly in browser localStorage." }
    ]
  },
  {
    id: 'islamic-shorts-maker',
    title: 'Islamic Shorts Maker — Create 9:16 Islamic Images Online',
    navTitle: 'Islamic Shorts Maker',
    description: 'Create 9:16 Islamic Shorts images for YouTube Shorts, Reels & TikTok. Add Arabic, Hindi, Urdu, or English text, gold borders, and download high-res PNGs locally.',
    icon: '🕌',
    path: '/islamic-shorts-maker.html',
    filename: 'islamic-shorts-maker.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['1080x1920 9:16 Canvas', '12+ Islamic Templates', 'Arabic, Hindi, Urdu, EN', 'Gold Borders & Mihrab Arch', 'High-Res PNG/JPG Export'],
    howTo: [
      { title: "Select Template or Content Preset", desc: "Choose a curated Quran verse, authentic Hadith, or Dua preset, or type custom text in Arabic, Urdu, Hindi, or English." },
      { title: "Customize Islamic Borders, Fonts & Media", desc: "Pick elegant gold borders, Islamic geometric backgrounds, typography styles, and optional voiceover audio." },
      { title: "Animate & Export Video or PNG", desc: "Preview the 9:16 vertical canvas with subtle zoom/pan animations, and export directly as an MP4/WebM video or high-res PNG." }
    ],
    faq: [
      { question: "Can I create both animated videos and static image slides with this tool?", answer: "Yes. You can export animated 9:16 vertical videos (WebM/MP4) with motion presets and background audio, or download high-resolution PNG images for community posts and Stories." },
      { question: "Are the Quranic verses and Hadith texts customizable?", answer: "Yes. You can choose from our curated library of verses and Hadiths or write your own custom text in Arabic, English, Urdu, Hindi, or other languages." },
      { question: "What aspect ratio is used for Islamic Shorts?", answer: "The canvas is locked to standard 9:16 vertical resolution (1080x1920 pixels), designed specifically for YouTube Shorts, Instagram Reels, and TikTok." },
      { question: "Can I add custom nasheed or recitation audio to the video?", answer: "Yes. You can upload an MP3 or WAV audio track to synchronize with the animated text and visual background." },
      { question: "Are my designs, audio, or texts uploaded to any server?", answer: "No. The Islamic Shorts Maker operates locally in your web browser. Your text, audio, and visual exports remain completely private on your device." }
    ]
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
      'Client-Side MP4 Export'
    ],
    howTo: [
      { title: "Input Story or Script Paragraphs", desc: "Type or paste your narrative text into the editor and choose font styling, text colors, and emphasis highlight boxes." },
      { title: "Customize Background, Overlay & Audio", desc: "Pick an aesthetic gradient or upload custom background media, add a draggable brand logo watermark, and attach optional voiceover audio." },
      { title: "Preview & Render Video File", desc: "Select your target aspect ratio (9:16 Shorts, 1:1 Square, 16:9 Landscape), preview scrolling animation, and download the MP4/WebM video." }
    ],
    faq: [
      { question: "What video aspect ratios are supported by the Script to Video Maker?", answer: "You can render 9:16 vertical video (1080x1920) for TikTok, Reels, and YouTube Shorts; 1:1 square (1080x1080) for Instagram feeds; or 16:9 landscape (1920x1080) for standard YouTube videos." },
      { question: "Can I synchronize text scrolling speed with a voiceover recording?", answer: "Yes. When you attach an audio voiceover file, enabling the Auto-Sync feature automatically adjusts the text scroll rate to match the exact duration of your audio track." },
      { question: "Can I use custom video loops or photos as the background?", answer: "Yes. You can choose from built-in colorful gradient themes or upload your own looping video background or still photography to display behind the text." },
      { question: "How do I add a brand logo or social media watermark?", answer: "Upload a transparent PNG logo in the branding section; you can resize it, adjust opacity, and drag it anywhere on the video preview canvas." },
      { question: "Are my scripts or uploaded media stored on external servers?", answer: "No. Typography layout, canvas animation, audio mixing, and video encoding operate locally in your web browser. Files and inputs are not uploaded to Zubware servers." }
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
    features: ['UUID v4 Standard', 'Bulk Generation (1-100)', 'Uppercase / Lowercase', 'Hyphen Toggle', 'Copy & TXT Download'],
    howTo: [
      { title: "Select UUID Version & Quantity", desc: "Choose Version 4 (random cryptographically secure) or Version 1 (timestamp-based), and set the quantity from 1 to 500." },
      { title: "Configure Formatting Options", desc: "Toggle uppercase letters, hyphens, and brace enclosures ({uuid}) according to your database requirements." },
      { title: "Generate and Copy UUIDs", desc: "Click Generate to create collision-resistant identifiers and copy individual IDs or the complete batch." }
    ],
    faq: [
      { question: "How are UUID v4 identifiers generated in this tool?", answer: "UUID v4 identifiers are generated using the browser's native Web Crypto API (crypto.getRandomValues), providing 122 bits of cryptographic entropy." },
      { question: "What is the probability of a UUID v4 collision?", answer: "The collision probability is vanishingly small. Generating 1 billion UUIDs every second for 100 years yields a less than 50% chance of a single duplicate collision." },
      { question: "Can I generate bulk batches of UUIDs for database seeding?", answer: "Yes. You can generate up to 500 UUIDs in a single click, formatted as a newline-separated list or JSON array for SQL/NoSQL seeds." },
      { question: "What format options are supported?", answer: "You can toggle standard lowercase with hyphens (e.g. 550e8400-e29b-41d4-a716-446655440000), uppercase, hyphen-free 32-character strings, or braced formats." },
      { question: "Are generated UUIDs stored on a server?", answer: "No. All UUID string synthesis occurs locally in your browser memory with zero network logging." }
    ]
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
    features: ['MD5, SHA-1, SHA-256, SHA-512', 'Real-time Calculation', 'Uppercase / Lowercase', 'Local Browser Processing', 'Copy & Download'],
    howTo: [
      { title: "Enter Input Text or String", desc: "Type or paste your secret, password, or payload into the hash editor." },
      { title: "Select Cryptographic Hash Algorithm", desc: "Compute hashes across SHA-256, SHA-512, SHA-384, SHA-1, or MD5 simultaneously in real time." },
      { title: "Copy Hex Digest", desc: "Click Copy next to your desired algorithm hash to grab the verified hexadecimal checksum." }
    ],
    faq: [
      { question: "Which hash algorithms are supported by this generator?", answer: "It supports standard NIST algorithms including SHA-256, SHA-512, SHA-384, SHA-1, and legacy MD5 digests." },
      { question: "How does the hash generation execute securely?", answer: "Secure SHA-family hashes are computed directly via the browser's hardware-accelerated Web Crypto API (SubtleCrypto.digest)." },
      { question: "Can I hash UTF-8 characters and multi-line text?", answer: "Yes. The text is encoded using standard UTF-8 binary buffers before digest computation, ensuring cross-platform parity with OpenSSL and backend systems." },
      { question: "Is MD5 secure for password storage?", answer: "No. MD5 and SHA-1 have known collision vulnerabilities. Use SHA-256, SHA-512, or salted derivation algorithms like PBKDF2/bcrypt for security credentials." },
      { question: "Is my input text uploaded to an external server?", answer: "No. All hashing computations execute client-side in your browser; your plaintext is never transmitted." }
    ]
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
    features: ['Header & Payload Parsing', 'Token Expiry Check', 'Client-Side Processing', 'Never Sends Data to Server', 'Formatted JSON View'],
    howTo: [
      { title: "Paste Encoded JWT Token", desc: "Input your JSON Web Token (header.payload.signature) into the decoder box." },
      { title: "Inspect Decoded Header & Claims", desc: "View parsed algorithm parameters (alg, typ) and payload claims (sub, iss, exp, iat, roles) formatted in clean JSON." },
      { title: "Verify Token Expiration Status", desc: "Check the visual expiration badge showing whether the token is currently active or expired, along with exact UTC timestamps." }
    ],
    faq: [
      { question: "Is it safe to decode private JWT tokens using this web tool?", answer: "Yes. This decoder operates locally in your browser. It splits the token string and decodes the Base64URL payload using client-side JavaScript without network calls." },
      { question: "How does the tool parse expiration (exp) and issued-at (iat) timestamps?", answer: "Standard JWT Unix timestamps are converted into human-readable local and UTC date-times, displaying relative elapsed time (e.g. 'Expires in 42 minutes')." },
      { question: "Can this tool verify cryptographic JWT signatures?", answer: "This is a decoder and claims inspector. Cryptographic signature verification requires a matching public key or HMAC secret." },
      { question: "What does the red, purple, and blue color-coding signify?", answer: "Red highlights the JOSE Header, purple indicates the Claims Payload, and blue represents the Cryptographic Signature." },
      { question: "Does the tool support nested JSON claims and custom attributes?", answer: "Yes. Complex nested objects, arrays, and custom OAuth/OIDC claims are parsed and displayed in an interactive JSON tree." }
    ]
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
    features: ['Seconds & Milliseconds', 'Date to Timestamp', 'UTC & Local Time', 'Current Time Counter', 'Relative Time Display'],
    howTo: [
      { title: "Choose Conversion Direction", desc: "Convert a Unix Epoch timestamp (seconds or milliseconds) into calendar dates, or convert a calendar date into a Unix timestamp." },
      { title: "Input Timestamp or Pick Date", desc: "Type a numeric Unix timestamp or use the date-time picker to specify your target date, hour, minute, and second." },
      { title: "Inspect UTC, Local Time & Epoch Formats", desc: "Review synchronized timestamps in UTC ISO-8601, localized date-time, epoch seconds, and relative time ago." }
    ],
    faq: [
      { question: "What is a Unix Epoch timestamp?", answer: "A Unix timestamp is the total number of seconds that have elapsed since January 1, 1970 at 00:00:00 UTC (the Unix Epoch), widely used in databases, APIs, and operating systems." },
      { question: "What is the difference between 10-digit and 13-digit Unix timestamps?", answer: "10-digit timestamps measure elapsed time in seconds (standard Unix/Linux and Python timestamps). 13-digit timestamps measure time in milliseconds (standard in JavaScript Date.now()). Toggle the 'Milliseconds' switch to convert 13-digit timestamps." },
      { question: "How does the tool handle daylight saving time and local time zones?", answer: "The tool displays your timestamp in both standardized Universal Coordinated Time (UTC) and your computer's local timezone with accurate seasonal daylight saving offsets." },
      { question: "Can I view a live real-time updating Unix epoch clock?", answer: "Yes. The top status panel displays the live current Unix epoch second, which updates every second and can be paused or copied with one click." },
      { question: "What will happen during the Year 2038 Unix timestamp problem?", answer: "The Year 2038 problem affects legacy 32-bit signed integer systems when seconds reach 2,147,483,647 on January 19, 2038. Modern 64-bit systems and this JavaScript tool safely support timestamps billions of years into the future." }
    ]
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
    features: ['Live Highlight Matches', 'Regex Flags (g, i, m, s, u, y)', 'Match & Group Extraction', 'Token Explainer', 'Preset Patterns'],
    howTo: [
      { title: "Enter Regular Expression Pattern", desc: "Input your regex pattern and toggle standard flags: Global (g), Case-Insensitive (i), Multiline (m), and DotAll (s)." },
      { title: "Input Test String or Sample Text", desc: "Paste sample text to test your pattern against real-world data and edge cases." },
      { title: "Inspect Matches & Capture Groups", desc: "Review highlighted match spans, match count, execution time, and individual captured group arrays." }
    ],
    faq: [
      { question: "Which regex dialect does this tester use?", answer: "It uses modern ECMAScript (JavaScript) RegExp specifications, including named capture groups (?<name>), lookaheads (?=), lookbehinds (?<=), and Unicode property escapes." },
      { question: "Does the tester highlight multiple capture groups?", answer: "Yes. Matched text is visually highlighted with distinct color badges, and capture groups are broken down in an interactive results table." },
      { question: "Can I test regex substitution and replacement strings?", answer: "Yes. Switch to Replacement mode to test substitution syntax including $1 group variables and custom replacement logic." },
      { question: "Does the tester protect against catastrophic backtracking (ReDoS)?", answer: "Yes. Pattern matching runs inside a protected evaluation wrapper that aborts if an exponential backtracking freeze is detected." },
      { question: "Are my test data or regex patterns stored anywhere?", answer: "No. Regex compilation and text matching execute client-side in browser memory with complete confidentiality." }
    ]
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
    features: ['Beautify & Indent', 'Minify / Compact', 'Collapsible Tree View', 'Syntax Error Detection', 'Copy & Download'],
    howTo: [
      { title: "Paste Raw JSON Code", desc: "Enter unformatted, minified, or messy JSON into the input editor." },
      { title: "Select Indentation & Formatting Mode", desc: "Choose 2-space, 4-space, or tab indentation, and optionally sort object keys alphabetically." },
      { title: "Format, Validate & Copy Clean JSON", desc: "Click Format to beautify your data with syntax color coding and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does the JSON Formatter handle syntax errors?", answer: "If the input contains invalid syntax, the parser pinpoints the exact line number, column, and character token causing the parse failure." },
      { question: "Can I sort object keys alphabetically for consistent diff comparisons?", answer: "Yes. Toggling 'Sort Keys' recursively orders all JSON keys alphabetically, making it easy to compare API payloads." },
      { question: "What is the maximum JSON file size supported?", answer: "The tool handles multi-megabyte JSON payloads (10MB+) smoothly using native browser JSON.parse and JSON.stringify engines." },
      { question: "Can I toggle between formatted tree view and raw text?", answer: "Yes. You can switch between an interactive collapsible tree view and a formatted code editor." },
      { question: "Is my JSON payload uploaded to an external server?", answer: "No. All parsing and formatting occur locally in your browser memory." }
    ]
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
    features: ['Syntax Validation', 'Exact Line & Column Error', 'Fix Assistance', 'Copy & Clean', 'Local Browser Processing'],
    howTo: [
      { title: "Paste JSON to Validate", desc: "Input JSON configuration, API responses, or schema definitions into the validation pane." },
      { title: "Run Instant Syntax & Type Check", desc: "The parser verifies RFC 8259 syntax on every keystroke, checking quotes, braces, trailing commas, and escaped characters." },
      { title: "Locate & Fix Highlighted Errors", desc: "Inspect precise error banners highlighting line and column coordinates, or click 'Auto-Fix' to repair common syntax mistakes." }
    ],
    faq: [
      { question: "What common JSON errors does this validator detect?", answer: "It detects trailing commas, unquoted keys, single quotes instead of double quotes, unescaped control characters, and mismatched brackets." },
      { question: "Can the validator automatically fix common JSON mistakes?", answer: "Yes. The 'Auto-Fix' feature converts single quotes to double quotes, strips trailing commas, and wraps unquoted property names according to RFC standards." },
      { question: "Does the validator support JSON Schema validation?", answer: "Yes. You can provide an optional JSON Schema definition to validate data types, required fields, and array constraints." },
      { question: "Can I inspect object depth and element counts?", answer: "Yes. The statistics panel displays total keys, array lengths, object nesting depth, and character metrics." },
      { question: "Is sensitive configuration data kept secure?", answer: "Yes. Validation runs locally in your browser without any network communication." }
    ]
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
    features: ['Array & Object Parsing', 'CSV Data Table Preview', 'Automated Header Extraction', 'Copy & Download CSV', 'Client-Side Processing'],
    howTo: [
      { title: "Paste JSON Array or Object", desc: "Enter a JSON array of objects or nested JSON records into the input pane." },
      { title: "Configure Delimiter & Header Options", desc: "Choose Comma (,), Semicolon (;), or Tab (TSV), and toggle flattened dot-notation for nested objects." },
      { title: "Download CSV Spreadsheet", desc: "Review the live table preview and click Download CSV to open directly in Excel or Google Sheets." }
    ],
    faq: [
      { question: "How does the tool handle nested JSON objects and arrays?", answer: "Nested objects are flattened into dot-notation column headers (e.g. 'user.address.city'), and array values are serialized cleanly into quoted comma-separated strings." },
      { question: "How are commas and quotes inside string fields escaped?", answer: "In compliance with RFC 4180, fields containing commas, line breaks, or quotation marks are wrapped in double quotes, with internal quotes escaped as double double-quotes (\"\")." },
      { question: "Can I customize the column delimiter for European Excel?", answer: "Yes. You can select semicolon (;) delimiter mode to ensure seamless spreadsheet opening in European locales." },
      { question: "Can I convert large JSON datasets?", answer: "Yes. Datasets containing thousands of rows are processed in milliseconds using streaming browser memory buffers." },
      { question: "Are database records uploaded to Zubware servers?", answer: "No. Conversion executes client-side in your browser. Data is not uploaded to Zubware servers." }
    ]
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
    features: ['Custom Delimiters (, ; \\t |)', 'Auto Data Type Casting', 'Formatted JSON Output', 'Copy & Download JSON', 'Client-Side Processing'],
    howTo: [
      { title: "Paste CSV Data or Upload File", desc: "Enter raw comma-separated text or upload a .csv / .tsv spreadsheet file." },
      { title: "Configure Parsing & Type Inference", desc: "Select delimiter (Auto, Comma, Tab, Semicolon), specify header row, and toggle automatic number/boolean type conversion." },
      { title: "Copy or Export Formatted JSON", desc: "Review the converted JSON array of objects and click Copy or Download as a .json file." }
    ],
    faq: [
      { question: "Does the converter automatically detect numbers and booleans?", answer: "Yes. The type inference engine converts numeric strings (e.g. '123' to 123) and boolean words ('true' to true) into native JSON primitives." },
      { question: "Can I choose between an Array of Objects and an Array of Arrays?", answer: "Yes. You can output an array of keyed objects ([{id: 1, name: 'Alice'}]) or a compact 2D array of rows ([['id', 'name'], [1, 'Alice']])." },
      { question: "How does the parser handle quoted fields with line breaks?", answer: "It follows the RFC 4180 specification, correctly preserving multi-line strings enclosed inside double quotes without splitting them into new records." },
      { question: "Can I convert Tab-Separated Values (TSV) from Excel?", answer: "Yes. The parser auto-detects tab delimiters when copying and pasting directly from spreadsheet software." },
      { question: "Is any spreadsheet data sent over the network?", answer: "No. File parsing and JSON serialization occur completely in your web browser." }
    ]
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
    features: ['Interactive Data Grid', 'Search & Column Sort', 'Pagination Controls', 'Export Filtered CSV', 'No Server Limits'],
    howTo: [
      { title: "Open or Paste CSV File", desc: "Upload a CSV spreadsheet or paste raw tabular text directly into the viewer." },
      { title: "Search, Sort & Paginate Table", desc: "Click column headers to sort ascending/descending, filter rows with live search, and navigate pages." },
      { title: "Export Filtered View or JSON", desc: "Download the sorted data back to a clean CSV file or export selected rows as JSON." }
    ],
    faq: [
      { question: "Can this viewer open large CSV spreadsheets without freezing?", answer: "Yes. It uses virtualized table rendering and paginated data slicing to display files with tens of thousands of rows smoothly." },
      { question: "Can I search and filter specific columns?", answer: "Yes. The global search bar filters rows instantly across all columns, while column filters allow targeted data querying." },
      { question: "Does the viewer auto-detect delimiters like semicolons and tabs?", answer: "Yes. An automated sniffer inspects the first several rows to detect whether comma, semicolon, tab, or pipe is the primary delimiter." },
      { question: "Can I edit cell values directly in the table?", answer: "Yes. Double-click any table cell to edit its value and export the modified spreadsheet." },
      { question: "Are financial or customer spreadsheets secure?", answer: "Yes. File reading is performed via the browser's native FileReader API with local browser-side processing." }
    ]
  },
  {
    id: 'website-downloader',
    title: 'Website Downloader — Download Website Assets & HTML into ZIP',
    navTitle: 'Website Downloader',
    description: 'Download publicly accessible website HTML, CSS, JavaScript, and images into a structured ZIP archive with rewritten relative links directly in your browser.',
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
      'Direct Browser Network Requests — No Server Storage'
    ],
    howTo: [
      { title: "Enter Web Page URL", desc: "Type the full target website URL (including https://) into the downloader bar." },
      { title: "Select Download Assets to Package", desc: "Choose whether to bundle inline HTML, linked CSS stylesheets, JavaScript files, and images into a single zip archive." },
      { title: "Download Offline ZIP Archive", desc: "Click Download to fetch the webpage resources directly and download an organized offline archive." }
    ],
    faq: [
      { question: "How does the Website Downloader package web pages for offline viewing?", answer: "It fetches the primary HTML document, rewrites relative asset paths, bundles linked styles and scripts, and packages them into a portable ZIP archive." },
      { question: "Why might some websites fail to download due to CORS?", answer: "Web security standards enforce Cross-Origin Resource Sharing (CORS). Websites that explicitly forbid cross-origin browser requests cannot be scraped directly from a web client." },
      { question: "Does this downloader crawl entire multi-page websites?", answer: "This tool downloads single complete web pages and their immediate page assets rather than crawling multi-level domain hierarchies." },
      { question: "Can I open the downloaded HTML file directly in my browser without a server?", answer: "Yes. Extracted files use relative pathing, allowing you to double-click index.html to view the saved page offline." },
      { question: "Does Zubware log the URLs I download?", answer: "No. Network requests are dispatched directly between your browser and the target server." }
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
    features: ['Beautify & Indent', 'Minify HTML', 'Live Render Preview', 'File Upload & Export', 'Local Browser Processing'],
    howTo: [
      { title: "Paste Raw HTML Code", desc: "Input minified, scraped, or unindented HTML markup into the editor." },
      { title: "Configure Indentation & Formatting Rules", desc: "Select 2 spaces, 4 spaces, or tabs, and toggle void tag style (HTML5 vs XHTML self-closing)." },
      { title: "Beautify & Copy Clean HTML", desc: "Click Format HTML to re-indent all nested tags and copy the clean markup to your clipboard." }
    ],
    faq: [
      { question: "Does the formatter format inline CSS and JavaScript?", answer: "Yes. Code blocks inside <style> and <script> tags are indented according to their respective CSS and JavaScript syntax rules." },
      { question: "How does it handle void self-closing tags like <img> and <input>?", answer: "You can configure standard modern HTML5 style (<img>) or strict XHTML style (<img />) for self-closing elements." },
      { question: "Does formatting preserve whitespace inside <pre> and <code> tags?", answer: "Yes. Preformatted blocks (<pre>, <code>, <textarea>) are protected to prevent breaking code indentation or whitespace layout." },
      { question: "Can I collapse multiple empty lines?", answer: "Yes. The formatter normalizes redundant consecutive blank lines to keep templates clean and readable." },
      { question: "Is HTML formatted client-side?", answer: "Yes. The parsing algorithm runs entirely in browser memory without sending code to an external server." }
    ]
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
    features: ['Beautify & Indent', 'Minify CSS', 'File Upload & Export', 'Copy & Download', 'Local Browser Processing'],
    howTo: [
      { title: "Paste CSS Stylesheet", desc: "Input unformatted, minified, or disorganized CSS, SCSS, or Less code." },
      { title: "Select Formatting Style", desc: "Choose Expanded (standard multi-line rules) or Compact (one-line selectors), and set indent spacing." },
      { title: "Beautify & Copy CSS", desc: "Review syntax-highlighted CSS with normalized property spacing and click Copy to clipboard." }
    ],
    faq: [
      { question: "Can the formatter sort CSS properties alphabetically?", answer: "Yes. Toggling 'Sort Properties' orders declarations alphabetically (e.g. background, color, margin, padding) within each selector block." },
      { question: "Does it format CSS media queries and @keyframes correctly?", answer: "Yes. Nested @media, @supports, and @keyframes blocks are indented with hierarchical nesting." },
      { question: "How does it handle hex color case normalization?", answer: "You can choose to normalize all hex color codes to consistent lowercase (#fff) or uppercase (#FFF)." },
      { question: "Can I remove duplicate CSS selectors?", answer: "Yes. The deduplication filter identifies and reports duplicate selector declarations across your stylesheet." },
      { question: "Is my stylesheet processed locally?", answer: "Yes. CSS parsing and formatting execute locally in your browser session." }
    ]
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
    features: ['Beautify & Indent', 'Minify JS', 'File Upload & Export', 'Copy & Download', 'Local Browser Processing'],
    howTo: [
      { title: "Paste JavaScript or TypeScript", desc: "Enter unformatted, obfuscated, or minified JS/TS code into the editor." },
      { title: "Choose Indentation & Semicolon Rules", desc: "Set 2-space or 4-space indents, toggle single/double quote preferences, and choose semicolon insertion rules." },
      { title: "Format Code & Copy", desc: "Click Format to unpack minified bundles into readable code and copy the beautified script." }
    ],
    faq: [
      { question: "Can this formatter unpack and de-minify bundled JavaScript?", answer: "Yes. It unwraps minified one-line bundles, restoring clean indentation, statement line breaks, and bracket hierarchy." },
      { question: "Does it support modern ES6+ and TypeScript syntax?", answer: "Yes. It handles arrow functions, async/await, optional chaining (?.), nullish coalescing (??), and TypeScript type annotations." },
      { question: "Can I enforce semicolons or quote styles?", answer: "Yes. You can enforce trailing semicolons and normalize quotes to consistent single (') or double (\") quotes." },
      { question: "Does the formatter execute the JavaScript code?", answer: "No. The tool parses AST tokens purely as text for formatting purposes; it never executes the script, avoiding runtime execution risks." },
      { question: "Is my proprietary script code transmitted to Zubware?", answer: "No. All formatting logic runs client-side in browser memory with complete privacy." }
    ]
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
    features: ['XML Beautifier', 'Minify XML', 'Syntax Validation', 'Copy & Download', 'Client-Side Processing'],
    howTo: [
      { title: "Paste Raw XML or RSS Feed", desc: "Input unindented XML markup, SOAP payloads, SVG code, or sitemaps." },
      { title: "Configure Indentation Spacing", desc: "Choose 2-space, 4-space, or tab indentation and select self-closing tag handling." },
      { title: "Beautify & Copy Clean XML", desc: "Inspect the formatted XML tree with aligned attributes and click Copy to clipboard." }
    ],
    faq: [
      { question: "Does the XML formatter validate tag hierarchy before formatting?", answer: "Yes. It checks for well-formed XML structure, flagging unclosed tags or mismatched elements with exact line error callouts." },
      { question: "Can it format CDATA blocks and XML comments properly?", answer: "Yes. CDATA sections (<![CDATA[...]]>) and comments (<!-- ... -->) are preserved with proper indentation." },
      { question: "Can I use this tool to format SVG vector files?", answer: "Yes. Because SVG is an XML-based vector format, you can format messy SVG files into clean readable markup." },
      { question: "Can I format attribute alignment across multiple lines?", answer: "Yes. Long tag elements with numerous XML attributes can be formatted with attributes aligned on separate lines for legibility." },
      { question: "Is XML data processed securely in the browser?", answer: "Yes. The XML parser operates client-side without sending data to an external server." }
    ]
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
    features: ['Syntax Checker', 'Unmatched Tag Detection', 'Line Error Reporting', 'Clean Output', 'Local Browser Processing'],
    howTo: [
      { title: "Paste XML Document", desc: "Input your XML document, configuration file, or API payload into the editor." },
      { title: "Run Real-Time Well-Formedness Check", desc: "The parser verifies tag pairing, attribute quoting, root element closure, and character encoding." },
      { title: "Review Line Errors & Fix", desc: "Inspect pinpointed error lines and error descriptions to correct syntax violations." }
    ],
    faq: [
      { question: "What does 'well-formed' XML mean?", answer: "A well-formed XML document strictly satisfies XML specifications: a single root element, all tags properly closed and correctly nested, attribute values quoted, and special characters escaped." },
      { question: "How does the validator report syntax errors?", answer: "It uses the browser's native DOMParser engine to return the exact line number, column, and description of the invalid token." },
      { question: "Does it check for illegal unescaped characters like < and &?", answer: "Yes. It alerts you to unescaped ampersands (&amp;) or angle brackets inside attribute values and text nodes." },
      { question: "Can I validate XML sitemaps and RSS feeds?", answer: "Yes. You can paste XML sitemaps or RSS feeds to confirm they are error-free before publishing." },
      { question: "Is my XML content private?", answer: "Yes. Validation executes entirely in your browser session with zero server tracking." }
    ]
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
    features: ['Protocol, Host & Port', 'Query Parameters Table', 'Fragment Hash Extraction', 'Copy Parameter Pairs', 'Local Browser Processing'],
    howTo: [
      { title: "Paste Full Target URL", desc: "Input any web address (e.g. https://example.com:8080/path/page?user=1&ref=tw#section) into the parser." },
      { title: "Inspect Deconstructed URL Components", desc: "Review parsed breakdown cards: Protocol, Hostname, Port, Pathname, Query String Parameters, and Hash Fragment." },
      { title: "Copy Query Parameters as JSON or Table", desc: "Inspect individual query key-value pairs, decode encoded URI values, and copy parameter data." }
    ],
    faq: [
      { question: "Which URL components does this parser deconstruct?", answer: "It breaks URLs down into Protocol (Scheme), Username, Password, Hostname, Port, Pathname, Search/Query string, and Hash fragment." },
      { question: "How does it handle URL-encoded query parameters?", answer: "It automatically decodes percent-encoded query keys and values (e.g. decoding %20 into spaces or %3D into equals signs) for clean readability." },
      { question: "Can I copy the parsed query parameters as a JSON object?", answer: "Yes. Click 'Export JSON' to copy all query parameters as a structured {key: value} JSON object." },
      { question: "Can I edit query parameters and reconstruct an updated URL?", answer: "Yes. You can add, edit, or remove parameter rows; the master URL updates in real time with correct URI encoding." },
      { question: "Are parsed URLs logged or tracked?", answer: "No. URL parsing uses the browser's native URL object locally with zero server communication." }
    ]
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
    features: ['Percent Encoding (%20)', 'Decode URL Strings', 'Copy & Download TXT', 'Local Browser Processing', 'Instant Conversion'],
    howTo: [
      { title: "Enter Text or URL String", desc: "Paste plaintext to encode or percent-encoded query strings to decode." },
      { title: "Select Encoding Standard", desc: "Choose encodeURIComponent (for query values) or encodeURI (for complete URLs), or switch to Decode mode." },
      { title: "Copy Converted String", desc: "Review the converted result and click Copy to clipboard for API queries or link construction." }
    ],
    faq: [
      { question: "What is the difference between encodeURI and encodeURIComponent?", answer: "encodeURI preserves protocol and path delimiters (: / ? & #) suitable for full web addresses. encodeURIComponent encodes all special characters into percent-escapes (%2F, %3F, %26), which is required when passing parameters inside query strings." },
      { question: "How does decoding handle plus signs (+) in query strings?", answer: "The decoder provides an option to treat plus signs as spaces, matching standard application/x-www-form-urlencoded form submission behavior." },
      { question: "Can I encode non-ASCII Unicode characters?", answer: "Yes. Characters like accented letters, emojis, and international scripts are encoded into standard UTF-8 percent-byte sequences." },
      { question: "Does it support batch multi-line URL decoding?", answer: "Yes. You can paste lists of multiple URLs on separate lines to encode or decode them all simultaneously." },
      { question: "Is text processing executed client-side?", answer: "Yes. All encoding and decoding execute in local browser memory with complete privacy." }
    ]
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
    features: ['UTF-8 Safe Encoding', 'Decode Base64', 'File Upload Support', 'Copy & Download', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Text or Upload File", desc: "Type or paste ASCII/Unicode text into the input editor or upload an image/document file." },
      { title: "Choose Encode or Decode Mode", desc: "Toggle between Encode (Plaintext to Base64) and Decode (Base64 to Plaintext), and configure URL-safe Base64 options." },
      { title: "Copy Base64 Output or Download File", desc: "Click Copy to grab the Base64 string or download decoded binary data as a local file." }
    ],
    faq: [
      { question: "Does this Base64 tool support UTF-8 characters and emojis?", answer: "Yes. Standard browser btoa() fails on multi-byte characters; this tool uses full UTF-8 byte encoding arrays so characters like é, ñ, and emojis convert without errors." },
      { question: "What is URL-Safe Base64 encoding?", answer: "URL-safe Base64 replaces standard characters + and / with - and _, and removes trailing padding (=), making the string safe for URL paths and JWT tokens." },
      { question: "Can I convert small images to Base64 Data URIs?", answer: "Yes. Uploading a PNG, JPG, or SVG generates a complete data:image/png;base64,... string ready for inline CSS or HTML." },
      { question: "Can I decode Base64 back into a downloadable binary file?", answer: "Yes. If the decoded data is binary, you can download the recovered file directly to your computer." },
      { question: "Are files or sensitive tokens uploaded to a server?", answer: "No. All Base64 conversions execute client-side in browser memory." }
    ]
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
    features: ['Escape HTML Entities', 'Unescape HTML Entities', 'Quotes & Ampersands', 'Copy & Download', 'Client-Side Processing'],
    howTo: [
      { title: "Paste Raw HTML or Escaped Entities", desc: "Enter HTML code to escape for documentation, or paste escaped strings containing &lt;, &gt;, and &amp; to decode." },
      { title: "Select Escape or Unescape Mode", desc: "Toggle between escaping special markup characters and unescaping entities back into clean HTML tags." },
      { title: "Copy Converted Entity String", desc: "Review the converted text and click Copy to clipboard for safe insertion into HTML pre/code blocks." }
    ],
    faq: [
      { question: "Which characters are escaped by default?", answer: "It escapes reserved HTML characters: &amp; (&), &lt; (<), &gt; (>), &quot; (\"), and &#39; (') to prevent unintended HTML tag rendering." },
      { question: "Why is escaping HTML essential when displaying code examples on websites?", answer: "Without escaping, browsers interpret code brackets as real DOM elements rather than text, which breaks page layouts or exposes Cross-Site Scripting (XSS) vulnerabilities." },
      { question: "Can it decode named HTML entities (like &copy; and &euro;)?", answer: "Yes. The unescape engine decodes named entities, decimal entities (&#169;), and hexadecimal entities (&#xA9;) into their literal Unicode glyphs." },
      { question: "Is there a limit on the amount of code I can escape?", answer: "No. High-performance string replacement handles entire script files and template components in milliseconds." },
      { question: "Is code uploaded to an external server?", answer: "No. String replacement executes entirely within your browser session." }
    ]
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
    features: ['Status Line & Headers', 'Categorized Security Rules', 'Security Audit Rating', 'Search & Filter', 'Copy Pairs'],
    howTo: [
      { title: "Enter Web Domain or URL", desc: "Type the target website address (e.g. https://example.com) into the header lookup field." },
      { title: "Fetch Response Headers", desc: "Click Inspect Headers to retrieve HTTP response status codes, cache directives, and server headers." },
      { title: "Analyze Security & Caching Headers", desc: "Inspect security badges for Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, and Cache-Control." }
    ],
    faq: [
      { question: "What security headers does this tool audit?", answer: "It audits crucial security headers including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy." },
      { question: "Can I inspect HTTP redirect response codes (301, 302)?", answer: "Yes. The tool reveals the HTTP status code (200 OK, 301 Permanent Redirect, 404 Not Found) along with server response latency." },
      { question: "How does it check caching configurations?", answer: "It parses Cache-Control directives (max-age, s-maxage, no-cache), ETag tags, and Last-Modified headers to verify CDN caching efficiency." },
      { question: "Can I copy individual header values?", answer: "Yes. You can click on any header row to copy its value or export all response headers as a clean JSON object." },
      { question: "Does Zubware record my header lookups?", answer: "No. Header lookups are performed directly between client requests and target endpoints without search logging." }
    ]
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
    features: ['GET, POST, PUT, DELETE', 'Header & Body Editor', 'Response Status & Time', 'Formatted JSON Body', 'Direct Browser Requests'],
    howTo: [
      { title: "Select HTTP Method & Enter Endpoint", desc: "Choose GET, POST, PUT, PATCH, or DELETE, and input the target API endpoint URL." },
      { title: "Configure Headers, Auth & Body Payload", desc: "Add custom HTTP headers, Bearer token / Basic auth credentials, and JSON or form-data request body." },
      { title: "Send Request & Inspect Live Response", desc: "Click Send to inspect status code, round-trip latency, formatted JSON response body, and response headers." }
    ],
    faq: [
      { question: "Can I test authenticated API endpoints with Bearer tokens?", answer: "Yes. The Authorization tab allows you to configure Bearer tokens, Basic Auth (username/password), or custom API Key header pairs." },
      { question: "How does the tool handle browser CORS restrictions?", answer: "Because requests originate from your browser, target endpoints must support CORS (Access-Control-Allow-Origin). For restricted APIs, test endpoints that permit cross-origin calls." },
      { question: "Can I send JSON, form-data, and raw text payloads?", answer: "Yes. The body editor supports raw JSON (with real-time syntax validation), URL-encoded form data, and raw plain text." },
      { question: "Does it generate copyable curl commands?", answer: "Yes. Click 'Copy as cURL' to generate a complete command-line curl snippet matching your configured request." },
      { question: "Are API keys or payload data stored on Zubware servers?", answer: "No. Requests are dispatched directly from your browser to your endpoint. No keys, tokens, or request bodies are logged." }
    ]
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
    features: ['HEX, RGB, HSL, CMYK', 'Visual Swatch Picker', 'WCAG AA/AAA Contrast Check', 'One-Click Copy', 'Client-Side Processing'],
    howTo: [
      { title: "Input Color in Any Format", desc: "Enter a HEX code, RGB/RGBA string, HSL/HSLA value, or select a shade with the visual color picker." },
      { title: "Inspect Synchronized Multi-Format Outputs", desc: "View instant synchronized conversions in HEX, RGB, HSL, HSV, CMYK, and CSS Color Name." },
      { title: "Copy Formatted Code & Check Contrast", desc: "Click Copy on your desired color format and inspect WCAG legibility over black and white backgrounds." }
    ],
    faq: [
      { question: "Which color models are supported by the converter?", answer: "It converts between HEX (#RRGGBB, #RRGGBBAA), RGB/RGBA, HSL/HSLA, HSV/HSB, and 4-color CMYK printing values." },
      { question: "How are alpha channel transparency values converted?", answer: "Alpha values are accurately preserved across formats: 8-digit HEX (#ffffff80) maps to rgba(255, 255, 255, 0.5) and hsla(0, 0%, 100%, 0.5)." },
      { question: "Does the tool check WCAG accessibility contrast?", answer: "Yes. It calculates real-time relative luminance and shows contrast ratio scores against pure black (#000) and pure white (#fff)." },
      { question: "Can I generate a monochromatic shade ramp for the color?", answer: "Yes. Every converted color generates an automated 10-step lighter tint and darker shade spectrum." },
      { question: "Does color conversion run offline?", answer: "Yes. Mathematical color space conversions execute locally in your browser JavaScript engine." }
    ]
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
    features: ['Image Drag & Drop', 'PNG, JPG, WEBP', 'jsQR Local Engine', 'Open URL Link', 'Copy Decoded Text'],
    howTo: [
      { title: "Upload QR Code Image or Paste from Clipboard", desc: "Select a photo, screenshot, or graphic containing a QR code, or paste directly with Ctrl+V / Cmd+V." },
      { title: "Inspect Decoded Data & Payload Type", desc: "The decoder identifies the QR matrix and reveals the embedded text, URL, vCard, or WiFi network credentials." },
      { title: "Copy Extracted Data or Open Link", desc: "Click Copy to grab the raw decoded text or click the open button to visit the link safely." }
    ],
    faq: [
      { question: "Can this tool decode QR codes from screenshots and saved images?", answer: "Yes. You can upload any image file (PNG, JPG, WebP, GIF) or paste a screenshot from your clipboard to extract the embedded data." },
      { question: "Can it decode blurry, angled, or low-contrast QR codes?", answer: "The image pre-processor applies automatic binarization, adaptive contrast thresholding, and perspective correction to read challenging scans." },
      { question: "Does the decoder format vCard contact cards and WiFi credentials?", answer: "Yes. It parses structured payloads and organizes vCard contacts and WiFi passwords into readable fields." },
      { question: "Can I scan using my device camera?", answer: "Yes. Toggle 'Live Camera' to decode QR codes in real time through your laptop webcam or smartphone browser." },
      { question: "Is the uploaded image sent to an external server?", answer: "No. The QR matrix analysis runs locally in browser memory via client-side JavaScript." }
    ]
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
    features: ['Linear, Radial, Conic', 'Unlimited Color Stops', 'Angle Slider', 'Random & Reverse', 'Copy & Download CSS'],
    howTo: [
      { title: "Choose Gradient Type & Angle", desc: "Select Linear, Radial, or Conic gradient style and use the interactive angle compass slider (0° to 360°)." },
      { title: "Add & Position Color Stops", desc: "Click the color bar to add color stops, pick custom HEX/RGBA values, and drag handles to adjust stop percentages." },
      { title: "Copy Generated CSS Rule", desc: "Preview the background live in full size and click Copy CSS to copy cross-browser background styles directly." }
    ],
    faq: [
      { question: "What CSS properties does this gradient generator output?", answer: "It outputs modern standard background and background-image properties using linear-gradient(), radial-gradient(), or conic-gradient() syntax with percentage color-stop coordinates." },
      { question: "Can I create multi-color gradients with 3 or more colors?", answer: "Yes. Click anywhere along the gradient spectrum track to add unlimited additional color stops with independent opacity and position values." },
      { question: "How do radial gradients position their focal center?", answer: "Radial gradients let you position the ellipse or circle origin at center, top, bottom, or custom coordinates using standard CSS position keywords." },
      { question: "Can I export the gradient as an image or SVG file?", answer: "Yes. In addition to clean CSS rules, you can download high-resolution PNG or SVG gradient assets for graphic design applications." },
      { question: "Are color values processed locally in the browser?", answer: "Yes. All gradient rendering and CSS rule compilation happen dynamically in client-side state without server network requests." }
    ]
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
    features: ['Multiple Shadow Layers', 'X & Y Offset Sliders', 'Blur & Spread Radius', 'Opacity & Inset', 'Copy CSS Code'],
    howTo: [
      { title: "Adjust Shadow Sliders", desc: "Drag sliders for Horizontal Offset, Vertical Offset, Blur Radius, and Spread Radius." },
      { title: "Configure Color & Inset Mode", desc: "Select your shadow color, adjust opacity, and toggle between Outset (drop shadow) and Inset (inner shadow)." },
      { title: "Copy Cross-Browser CSS", desc: "Inspect the live preview box and click Copy CSS to grab ready-to-use box-shadow rules." }
    ],
    faq: [
      { question: "What is the difference between blur radius and spread radius?", answer: "Blur radius controls how softly the shadow edges feather out (higher values create diffuse shadows). Spread radius physically expands or shrinks the shadow perimeter before blurring occurs." },
      { question: "Can I stack multiple shadows for realistic smooth elevation?", answer: "Yes. You can add layered shadow tiers with progressive offsets and blurs, simulating natural lighting and ambient light occlusion." },
      { question: "What does the Inset toggle do?", answer: "The Inset keyword casts the shadow inside the element's borders rather than outside, creating an etched, sunken, or hollowed-out card appearance." },
      { question: "Does the generator support semi-transparent RGBA shadow colors?", answer: "Yes. The color picker provides an alpha channel slider to define subtle translucent shadows that blend naturally over any background." },
      { question: "Is the generated CSS compatible with all modern browsers?", answer: "Yes. Standard box-shadow is universally supported across Chrome, Safari, Firefox, Edge, and modern mobile browsers without vendor prefixes." }
    ]
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
    features: ['Individual Corners', 'Linked Corners Sync', 'Elliptical Radii', 'Live Shape Preview', 'Copy CSS Code'],
    howTo: [
      { title: "Adjust Corner Radius Sliders", desc: "Use the master slider for uniform rounded corners, or unlock individual corner controls for top-left, top-right, bottom-right, and bottom-left." },
      { title: "Toggle 8-Value Fancy Organic Mode", desc: "Enable Full 8-value radius mode to adjust independent horizontal and vertical elliptical radiuses for blob-like organic shapes." },
      { title: "Copy CSS border-radius Rule", desc: "Review the animated preview card and click Copy CSS to paste the rule into your stylesheet." }
    ],
    faq: [
      { question: "What is the 8-value syntax in CSS border-radius?", answer: "The 8-value syntax (e.g. border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%) specifies horizontal vs vertical radiuses separated by a slash (/), creating smooth organic asymmetric shapes." },
      { question: "Can I use pixel (px) or percentage (%) units?", answer: "Yes. You can toggle between absolute pixel dimensions (ideal for fixed cards) and percentage units (ideal for responsive circles, pills, and fluid containers)." },
      { question: "How do I create a perfect circular avatar with border-radius?", answer: "On a square container (equal width and height), setting border-radius to 50% produces a mathematically perfect circle." },
      { question: "Can I lock corners to mirror top/bottom symmetry?", answer: "Yes. Symmetry locks let you adjust paired corners simultaneously to maintain balanced aesthetic geometry." },
      { question: "Does this tool execute entirely in the browser?", answer: "Yes. Radius calculations and SVG/CSS generation update in real time in client-side memory." }
    ]
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
    features: ['Backdrop Blur', 'Translucent Opacity', 'Border Highlight', 'Ambient Glow', 'Copy Glass CSS'],
    howTo: [
      { title: "Adjust Blur & Opacity Sliders", desc: "Fine-tune backdrop-filter blur (px), background alpha transparency, and surface saturation." },
      { title: "Configure Border & Light Reflection", desc: "Set subtle border stroke width, outline opacity, and light reflection highlights for frosted glass depth." },
      { title: "Copy CSS backdrop-filter Code", desc: "Preview the card over vibrant image and gradient backgrounds, then click Copy CSS." }
    ],
    faq: [
      { question: "Which CSS property creates the frosted glass blur effect?", answer: "Glassmorphism relies on the CSS backdrop-filter: blur(Npx) property, which blurs the content positioned directly behind the semi-transparent element." },
      { question: "Why is a subtle border stroke recommended for glassmorphism?", answer: "A delicate 1px semi-transparent white border (e.g. rgba(255, 255, 255, 0.2)) simulates light refracting off glass edges, giving definition against dark or busy backgrounds." },
      { question: "Is backdrop-filter supported in Safari and mobile browsers?", answer: "Yes. The generated code includes -webkit-backdrop-filter alongside the standard property for broad Safari and iOS compatibility." },
      { question: "How do I ensure readable text on frosted glass cards?", answer: "Increase background opacity slightly (between 0.15 and 0.3) or add a subtle text-shadow to preserve WCAG contrast legibility over colorful background images." },
      { question: "Is any user data collected or sent to a server?", answer: "No. All visual CSS parameters are computed client-side with instant canvas feedback." }
    ]
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
    features: ['Flat, Concave, Convex, Pressed', 'Light Direction', 'Distance & Blur', 'Radius Adjustment', 'Copy CSS Code'],
    howTo: [
      { title: "Select Base Surface Color", desc: "Pick your background color using the color picker or input a HEX code." },
      { title: "Adjust Elevation, Blur & Shape", desc: "Fine-tune shadow distance, blur intensity, surface curve (Flat, Concave, Convex, or Pressed), and light angle." },
      { title: "Copy Dual-Shadow CSS", desc: "Review the soft extruded 3D surface and click Copy CSS for instant implementation." }
    ],
    faq: [
      { question: "How does neumorphic styling create the illusion of extruded plastic?", answer: "Neumorphism casts two opposing shadows from a single light source: a dark shadow on one side (shadow side) and a highlight shadow on the opposite side (light source side)." },
      { question: "Can I create inset pressed/sunken button states?", answer: "Yes. Switching to Pressed mode changes the box-shadow rules to inset shadows, creating a realistic depressed button appearance when clicked." },
      { question: "Why must the element color match the parent background color?", answer: "Neumorphism requires the element surface color to be identical to the underlying background; the 3D elevation is defined purely through light and dark shadow gradients." },
      { question: "What are the accessibility considerations for neumorphic design?", answer: "Because neumorphic contrast is subtle, always ensure text, icons, and interactive focus states maintain high contrast ratios against the surface." },
      { question: "Does the generator run entirely in browser memory?", answer: "Yes. Color calculations, shadow offsets, and CSS outputs update in real time locally." }
    ]
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
    features: ['Triangle, Hexagon, Star', 'Polygon & Circles', 'Live Visual Preview', 'Editable Code', 'Copy CSS Code'],
    howTo: [
      { title: "Select Shape Template", desc: "Choose from preset polygons including Triangle, Hexagon, Chevron, Star, Message Bubble, or Circle." },
      { title: "Drag Anchor Points on Canvas", desc: "Click and drag interactive coordinate handles on the visual grid to customize polygon vertices." },
      { title: "Copy clip-path: polygon() CSS", desc: "Review the cut-out shape preview and copy the generated CSS polygon rule or SVG path." }
    ],
    faq: [
      { question: "What is the CSS clip-path property used for?", answer: "The clip-path property creates a clipping region that sets what part of an element is visible, masking away everything outside the specified polygon coordinates." },
      { question: "Can I add new coordinate anchor points to the polygon?", answer: "Yes. Double-click anywhere on the canvas perimeter to insert a new vertex, allowing you to build complex custom geometric shapes." },
      { question: "Are coordinate values responsive across different container sizes?", answer: "Yes. The generated polygon() uses percentage coordinates (0% to 100%), ensuring your masked shape scales responsively across any screen resolution." },
      { question: "Can CSS clip-path shapes be animated with transitions?", answer: "Yes. You can transition between two clip-path states smoothly in CSS, provided both polygons share the exact same number of vertices." },
      { question: "Is this tool free and client-side?", answer: "Yes. The vector calculation engine operates entirely inside your browser without backend processing." }
    ]
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
    features: ['Circles, Polygons & Blobs', 'Fill & Stroke Colors', 'Stroke Width', 'Download SVG File', 'Copy SVG Code'],
    howTo: [
      { title: "Choose Base Shape or Blob Type", desc: "Select Wave, Blob, Polygon, or Organic contour and adjust complexity and randomness sliders." },
      { title: "Customize Colors & Gradients", desc: "Apply solid brand fills or dual-color linear gradients and configure stroke outlines." },
      { title: "Copy SVG Code or Download File", desc: "Inspect the crisp vector preview and click Copy SVG Code or Download .svg for Figma, Illustrator, or web code." }
    ],
    faq: [
      { question: "How are smooth organic blobs generated?", answer: "Blobs are generated using cubic Bézier curves (svg path d='M... C...') positioned at randomized angular offsets around a circular origin." },
      { question: "Can I generate section divider waves for web page headers?", answer: "Yes. Switch to Wave mode to generate smooth horizontal wave dividers that fit seamlessly along the top or bottom of website sections." },
      { question: "Can I import generated SVGs into Figma and Adobe Illustrator?", answer: "Yes. The exported SVG files are clean vector standards that import directly into Figma, Sketch, Illustrator, and web development frameworks." },
      { question: "Can I randomize the shape with one click?", answer: "Yes. Click the Shuffle / Dice button to generate unique organic iterations instantly while keeping your chosen color scheme." },
      { question: "Does the SVG generator upload any artwork to a server?", answer: "No. Vector paths are calculated using mathematical trigonometric functions directly in your browser." }
    ]
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
    features: ['Color Harmonies', 'Lock Swatches', 'One-Click HEX Copy', 'JSON Export', 'Local Browser Processing'],
    howTo: [
      { title: "Generate Palette or Lock Base Color", desc: "Press Spacebar to randomize colors, or enter a primary brand HEX code and lock it in place." },
      { title: "Select Color Harmony Rule", desc: "Choose from Monochromatic, Analogous, Complementary, Split-Complementary, Triadic, or Tetradic harmony modes." },
      { title: "Export Palette & Copy Codes", desc: "Click individual color swatches to copy HEX/RGB/HSL codes, or export the full palette as CSS variables or image." }
    ],
    faq: [
      { question: "How do color harmony rules work?", answer: "Color harmony algorithms reference the 360-degree color wheel: Complementary picks opposite hues (180°), Triadic picks 3 equidistant hues (120°), and Analogous selects adjacent hues (30°)." },
      { question: "Can I lock specific colors while randomizing the rest?", answer: "Yes. Click the Lock icon on any swatch to keep your preferred brand colors stationary while generating fresh complementary accents around them." },
      { question: "Which color formats are available for copying?", answer: "You can copy values in HEX (#ffffff), RGB (rgb(255,255,255)), HSL (hsl(0, 0%, 100%)), or as a block of CSS custom properties (--color-primary)." },
      { question: "Does the generator assess color blindness accessibility?", answer: "Yes. You can preview your palette under simulated protanopia, deuteranopia, and tritanopia color vision deficiencies." },
      { question: "Are palettes saved locally?", answer: "Yes. Your favorite palettes are preserved in browser localStorage so you can access them across visits." }
    ]
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
    features: ['Exact Ratio Calculation', 'WCAG AA & AAA Badges', 'Normal & Large Text', 'Foreground/Background Swap', 'Live Preview'],
    howTo: [
      { title: "Select Foreground & Background Colors", desc: "Input HEX, RGB, or HSL codes for your text color and background surface." },
      { title: "Inspect WCAG 2.1 Ratio Score", desc: "Review the calculated contrast ratio (e.g. 4.5:1 or 7:1) and check pass/fail badges for Normal Text, Large Text, and UI Components." },
      { title: "Test Live Typography Preview", desc: "Inspect simulated headings, body paragraphs, and button components to ensure real-world legibility." }
    ],
    faq: [
      { question: "What are the WCAG 2.1 contrast ratio requirements?", answer: "WCAG AA requires a minimum ratio of 4.5:1 for normal body text and 3.0:1 for large text (18pt+ or 14pt bold). WCAG AAA requires 7.0:1 for normal text and 4.5:1 for large text." },
      { question: "How is relative luminance calculated for contrast ratios?", answer: "The tool calculates CIE relative luminance (L) from linearized sRGB color coordinates: Ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color." },
      { question: "Can I swap foreground and background colors with one click?", answer: "Yes. Click the Swap button to instantly reverse foreground and background values to check inverse button and dark mode states." },
      { question: "Does the tool suggest accessible color adjustments if contrast fails?", answer: "Yes. The auto-adjust recommendation provides the closest lighter or darker shade that satisfies WCAG AA compliance." },
      { question: "Is contrast checking performed locally?", answer: "Yes. The mathematical formula evaluates in your browser instantly without server roundtrips." }
    ]
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
    features: ['Spacebar Shortcut', 'HEX, RGB, HSL, RGBA', 'Favorites Saved Locally', 'Recent History', 'One-Click Copy'],
    howTo: [
      { title: "Generate Random Color", desc: "Click Generate or press Spacebar to generate a vibrant random color swatch." },
      { title: "View Multi-Format Color Codes", desc: "Inspect real-time conversions in HEX, RGB, HSL, HSV, and CMYK formats." },
      { title: "Copy Code or Save to Favorites", desc: "Click any color code format to copy to your clipboard, or click the Star icon to bookmark it to your favorites list." }
    ],
    faq: [
      { question: "Can I filter random colors to specific hues (e.g. pastel, dark, neon)?", answer: "Yes. You can restrict the random generator to specific luminosity or saturation ranges to generate pastel, dark mode, or vibrant neon palettes." },
      { question: "Which formats are available for one-click copying?", answer: "Values can be copied in HEX (#RRGGBB), RGB/RGBA, HSL/HSLA, HSV, and CMYK color spaces." },
      { question: "Can I use keyboard shortcuts to generate colors quickly?", answer: "Yes. Pressing the Spacebar generates a fresh random color immediately, allowing rapid visual brainstorming." },
      { question: "Where are favorite bookmarked colors saved?", answer: "Favorites are stored in your browser's local storage, keeping them accessible whenever you reopen the tool." },
      { question: "Does the tool require an internet connection?", answer: "No. Random number generation and color space conversions run entirely offline in your browser." }
    ]
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
    features: ['vCard Contact Format', 'Name, Phone, Email, Site', 'Live QR Preview', 'High Res PNG Download', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Contact Information", desc: "Fill in your full name, job title, company, phone number, email address, website, and social links." },
      { title: "Customize QR Styling & Colors", desc: "Select foreground and background colors, choose dot corner styling, and optionally add your logo emblem." },
      { title: "Download Print-Ready vCard QR Code", desc: "Scan the preview with a smartphone camera to test instant contact saving, then download as high-res PNG or SVG." }
    ],
    faq: [
      { question: "What happens when someone scans this QR code with their phone?", answer: "The phone's native camera opens an 'Add to Contacts' prompt, pre-filling your name, phone number, email, company, and website into their address book without typing." },
      { question: "Which standard vCard format is embedded in the QR code?", answer: "It uses the universal vCard 3.0 / MeCard protocol, natively supported by Apple iOS Contacts, Google Android Contacts, and Outlook." },
      { question: "Can I customize the QR code color to match my company brand?", answer: "Yes. You can customize foreground and background colors, ensuring sufficient contrast so barcode scanners read it reliably." },
      { question: "Does the QR business card ever expire?", answer: "No. The QR code is a static direct-data code containing the literal contact information; it never expires and requires no monthly subscription or hosting." },
      { question: "Are my personal contact details stored on a database?", answer: "No. The vCard payload is encoded directly into QR pixel matrices client-side in your browser. No personal data is stored on Zubware servers." }
    ]
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
    features: ['8 Major Categories', 'Instant Recalculation', 'All-Unit Breakdown Table', 'Unit Swap', 'Zero Latency'],
    howTo: [
      { title: "Select Unit Measurement Category", desc: "Choose from 8 unit families: Length, Weight & Mass, Temperature, Area, Volume, Speed, Digital Data, or Time." },
      { title: "Choose Source and Target Units", desc: "Pick your originating unit in the 'From' dropdown and your desired destination unit in the 'To' dropdown." },
      { title: "Input Value & Copy Converted Output", desc: "Type any numeric value into the input field to view the instant converted result and click Copy to clipboard." }
    ],
    faq: [
      { question: "Which measurement categories are supported by the unit converter?", answer: "The tool supports 8 categories: Length (mm to miles), Weight & Mass (mg to tons), Temperature (Celsius, Fahrenheit, Kelvin), Area, Volume, Speed (m/s, km/h, mph, knots), Digital Data (Bytes to TB), and Time." },
      { question: "How are temperature conversions calculated between Celsius and Fahrenheit?", answer: "Temperature conversions use precise affine formulas: °F = (°C × 9/5) + 32, °C = (°F - 32) × 5/9, and Kelvin = °C + 273.15, correctly accounting for non-zero baseline offsets." },
      { question: "Can I swap the source and target units with one click?", answer: "Yes. Click the Swap button between the unit selectors to instantly reverse the conversion direction." },
      { question: "How is conversion decimal precision handled?", answer: "Results are calculated with full 64-bit floating-point precision and formatted cleanly, omitting unnecessary trailing zeroes while avoiding rounding distortion." },
      { question: "Are my conversion values uploaded to a server?", answer: "No. All conversion factors and formulas are evaluated entirely within your local browser JavaScript engine." }
    ]
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
    features: ['What is X% of Y', 'X is what % of Y', '% Increase / Decrease', '% Difference', 'Instant Results'],
    howTo: [
      { title: "Select Percentage Mode", desc: "Choose from four calculation modes: find X% of Y, determine what percentage X is of Y, calculate percentage increase or decrease, or find percentage difference." },
      { title: "Enter Numerical Values", desc: "Type your base numbers and percentage values into the designated input fields for your chosen calculation mode." },
      { title: "View & Copy Calculated Result", desc: "Review the instant real-time calculation displayed with full decimal precision and copy the result to your clipboard." }
    ],
    faq: [
      { question: "How do I calculate what percentage one number is of another?", answer: "Use Mode 2 ('X is what % of Y'). The calculator divides X by Y and multiplies the quotient by 100 to yield the exact percentage share." },
      { question: "How does the percentage increase and decrease mode work?", answer: "Mode 3 subtracts the initial value X from the final value Y, divides the difference by X, and multiplies by 100. Positive results indicate a percentage increase, while negative numbers represent a percentage drop." },
      { question: "What is the difference between percentage change and percentage difference?", answer: "Percentage change (Mode 3) tracks relative growth or drop from an initial starting point X to Y. Percentage difference (Mode 4) compares two independent values against their mutual average (|X - Y| / ((X + Y) / 2) * 100)." },
      { question: "Does the calculator support decimal numbers and negative values?", answer: "Yes. You can enter positive or negative decimal numbers into any input field; calculations update dynamically on every keystroke." },
      { question: "Are my calculation numbers transmitted to a remote server?", answer: "No. All arithmetic operations are performed locally in your browser memory using JavaScript floating-point math." }
    ]
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
    features: ['Years, Months, Days', 'Total Hours & Minutes', 'Next Birthday Timer', 'Day of Week', 'Target Date Comparison'],
    howTo: [
      { title: "Select Date of Birth", desc: "Pick your birth date using the calendar picker or enter year, month, and day." },
      { title: "Choose Target Date", desc: "Leave the target date set to today's date to calculate current age, or select a past or future date to determine age at a specific milestone." },
      { title: "Review Exact Age Breakdown", desc: "Inspect your exact chronological age in years, months, and days, total elapsed hours and minutes, and the countdown to your next birthday." }
    ],
    faq: [
      { question: "How does the age calculator handle leap years and varying month lengths?", answer: "The algorithm calculates elapsed years and months first, then computes remaining days by referencing the exact calendar day count of the preceding month (including 29 days in February during leap years)." },
      { question: "Can I calculate how old I will be on a future date?", answer: "Yes. Adjust the 'Age at Date' field to any future date. The tool computes your exact age in years, months, and days on that selected future milestone." },
      { question: "What detailed time units are included in the age breakdown?", answer: "In addition to primary years, months, and days, the calculator displays total completed months, total elapsed weeks, total calendar days, total hours, minutes, and seconds." },
      { question: "How is the next birthday countdown determined?", answer: "The tool projects your birth month and day onto the current or upcoming calendar year and calculates the exact remaining months and days until your next anniversary." },
      { question: "Is my personal birth date saved or tracked?", answer: "No. Your birth date is processed entirely within your local browser session and is never uploaded or saved to external databases." }
    ]
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
    features: ['Monthly EMI Amount', 'Total Interest Paid', 'Principal vs Interest Bar', 'Yearly Amortization Schedule', 'Interactive Sliders'],
    howTo: [
      { title: "Enter Loan Principal Amount", desc: "Input your total desired loan or mortgage borrowing amount." },
      { title: "Set Interest Rate & Tenure", desc: "Specify the annual interest rate percentage and your repayment duration in years." },
      { title: "Review Monthly EMI & Amortization", desc: "Inspect your fixed monthly EMI, total interest payable over the loan life, and review the year-by-year amortization schedule." }
    ],
    faq: [
      { question: "Which mathematical formula is used to calculate monthly EMI?", answer: "The calculator uses the standard reducing-balance EMI formula: E = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is principal, r is monthly interest rate (annual rate / 12 / 100), and n is total monthly installments (tenure in years × 12)." },
      { question: "How does changing loan tenure affect my monthly EMI and total interest?", answer: "A longer tenure lowers your monthly payment by spreading repayments over more months, but significantly increases the cumulative interest paid to the lender." },
      { question: "Does the calculated EMI include bank processing fees, insurance, or taxes?", answer: "No. The calculator estimates the pure principal and interest payment. Bank-specific origination fees, mortgage insurance (PMI), stamp duty, and local taxes must be added separately." },
      { question: "What information does the yearly amortization schedule show?", answer: "The schedule details the beginning balance, total principal repaid, interest paid to the lender, and closing loan balance for each individual year of the loan term." },
      { question: "Are loan interest rates fixed or floating in this calculator?", answer: "The tool assumes a constant fixed interest rate over the full tenure. For floating rate loans, recalculate whenever your lender adjusts the benchmark interest rate." }
    ]
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
    features: ['Original Price & Discount %', 'Sales Tax Rate', 'Total Savings Badge', 'Final Price Output', 'Preset Quick Buttons'],
    howTo: [
      { title: "Enter Original Price", desc: "Type the sticker or list price of the product or service before any discounts." },
      { title: "Set Discount & Sales Tax Rates", desc: "Input the percentage discount being offered and enter your applicable local sales tax rate." },
      { title: "View Final Price & Net Savings", desc: "Review the discounted subtotal, total dollar amount saved, sales tax added, and the final checkout price." }
    ],
    faq: [
      { question: "How is the final checkout price calculated with discount and sales tax?", answer: "The calculator first subtracts the discount percentage from the original price to find the discounted subtotal. It then applies your sales tax percentage to that discounted price to determine the final amount due." },
      { question: "Can I use the tool if there is no sales tax?", answer: "Yes. Simply set the sales tax field to 0% to calculate pure markdown savings and post-discount price." },
      { question: "How are cents and rounding handled in the discount calculation?", answer: "Calculations maintain full precision internally and format results to standard two decimal currency places (cents) for accurate shopping estimates." },
      { question: "Can I calculate stacked discounts (such as 20% off plus an extra 10% coupon)?", answer: "This tool calculates single percentage markdowns. For stacked store discounts with secondary coupon codes, use the Sale Price Calculator tool." },
      { question: "Does this tool support different world currencies?", answer: "Yes. The mathematical percentages apply identically regardless of whether your values are in Dollars, Euros, Pounds, Rupees, or Yen." }
    ]
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
    features: ['Offline Processing', 'Custom Rate Editing', 'Major World Currencies', 'Instant Calculation', 'Local Storage Persistence'],
    howTo: [
      { title: "Enter Starting Amount", desc: "Type the numeric cash amount you wish to convert." },
      { title: "Select Base & Target Currencies", desc: "Choose your source currency (e.g. USD, EUR, GBP, INR) and your target conversion currency from the dropdown menus." },
      { title: "View Converted Value & Adjust Rates", desc: "Inspect the converted amount immediately, or open rate settings to override baseline exchange rates with custom bank rates." }
    ],
    faq: [
      { question: "Which currencies are supported by this calculator?", answer: "The tool supports major world currencies including US Dollar (USD), Euro (EUR), British Pound (GBP), Indian Rupee (INR), Canadian Dollar (CAD), Australian Dollar (AUD), Japanese Yen (JPY), Swiss Franc (CHF), and Singapore Dollar (SGD)." },
      { question: "Can I customize or update the exchange rates?", answer: "Yes. Clicking the Settings button allows you to input custom live bank or bureau de change rates against USD, which are saved in your local browser storage." },
      { question: "Does the calculator include credit card foreign transaction fees?", answer: "No. The tool computes pure exchange parity. Banks and card issuers typically add a 1% to 3.5% foreign transaction fee or exchange markup above mid-market rates." },
      { question: "Can I invert the conversion with one click?", answer: "Yes. Click the Swap button between the currency selectors to instantly reverse source and target currencies." },
      { question: "Can I use this currency converter offline without internet access?", answer: "Yes. Because default baseline rates are stored locally in the application, conversions execute instantaneously without requiring active network requests." }
    ]
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
    features: ['Bill & Tip %', 'Preset Tip Buttons', 'Split Bill Count', 'Per-Person Total & Tip', 'Instant Calculation'],
    howTo: [
      { title: "Enter Bill Subtotal", desc: "Input the pre-tip total amount from your dining, delivery, or service receipt." },
      { title: "Choose Tip Percentage & Group Size", desc: "Select a standard tip preset (10%, 15%, 18%, 20%, 25%) or enter custom percentage, and input the number of people splitting." },
      { title: "Inspect Tip Total & Per-Person Split", desc: "Review total tip amount, overall grand total, and the exact individual payment share per person." }
    ],
    faq: [
      { question: "How is the individual split calculated for dining groups?", answer: "The tool calculates total bill plus tip, then divides both the total check and the tip amount equally by the number of people entered in the party size field." },
      { question: "Should I calculate the tip on the pre-tax or post-tax bill amount?", answer: "Standard etiquette recommends tipping on the pre-tax food and beverage subtotal. However, you can enter whichever subtotal is printed on your receipt." },
      { question: "What tip percentages are standard for restaurant dining?", answer: "In North America, 15% to 18% is standard for adequate service, 20% for good service, and 22% to 25% for exceptional hospitality. The preset buttons provide fast access to these tiers." },
      { question: "Can I enter a custom tip percentage outside the presets?", answer: "Yes. You can type any custom percentage value into the tip percentage box for specialized tipping scenarios." },
      { question: "Does the calculator handle uneven penny splits?", answer: "Results are calculated with full decimal precision and formatted to standard two decimal places for clear payment settlement." }
    ]
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
    features: ['Min & Max Range', 'Multiple Quantity', 'Allow/Disallow Repeats', 'Asc/Desc Sorting', 'Copy Numbers'],
    howTo: [
      { title: "Set Minimum & Maximum Range", desc: "Specify your numeric boundary values (e.g. 1 to 100 or custom integer limits)." },
      { title: "Configure Count & Uniqueness", desc: "Set how many numbers to generate and toggle 'Allow Duplicates' or 'Unique Numbers Only'." },
      { title: "Generate & Copy Results", desc: "Click Generate to view the randomized output list and copy results or sort numerically." }
    ],
    faq: [
      { question: "Is this random number generator cryptographically secure?", answer: "Yes. It uses window.crypto.getRandomValues, which draws entropy from the operating system rather than predictable pseudo-random seeds." },
      { question: "Can I generate numbers with decimal places?", answer: "Yes. You can switch from Integer mode to Decimal/Float mode and specify decimal precision from 1 to 6 decimal places." },
      { question: "Can I generate a large list of non-repeating numbers for a raffle or lottery?", answer: "Yes. Toggle 'Unique Numbers Only' to generate randomized non-repeating sets without duplicates." },
      { question: "Can results be automatically sorted?", answer: "Yes. You can display generated numbers in their raw random sequence, or sort them in ascending or descending numerical order." },
      { question: "Is any calculation data sent over the network?", answer: "No. Random numbers are generated locally within your browser JavaScript engine." }
    ]
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
    features: ['Length 6 to 64 Chars', 'A-Z, a-z, 0-9, Symbols', 'Exclude Similar Chars', 'Strength Meter', 'One-Click Copy'],
    howTo: [
      { title: "Set Password Length", desc: "Use the slider to choose your password character length (recommended 16 to 32 characters)." },
      { title: "Select Character Sets & Options", desc: "Toggle Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Special Symbols (!@#$), and Exclude Ambiguous Characters (l, 1, O, 0)." },
      { title: "Copy Secure Password", desc: "Inspect the entropy strength meter and click Copy to clipboard to use your secure credential." }
    ],
    faq: [
      { question: "How secure are passwords generated by this tool?", answer: "Passwords are generated using Web Crypto API (crypto.getRandomValues), providing cryptographically strong entropy resistant to brute-force dictionary attacks." },
      { question: "What does the 'Exclude Ambiguous Characters' option do?", answer: "It removes visually confusing characters like uppercase I, lowercase l, numeral 1, uppercase O, and numeral 0, preventing transcription errors." },
      { question: "What length is recommended for maximum security?", answer: "Cybersecurity guidelines recommend a minimum of 16 characters with mixed character sets for standard accounts, and 20+ characters for master passwords and sensitive accounts." },
      { question: "Can I generate multiple passwords simultaneously?", answer: "Yes. You can generate batches of up to 50 passwords at once for bulk credential provisioning." },
      { question: "Is my generated password sent to or saved by Zubware?", answer: "No. Passwords are created entirely in client-side volatile memory and are never transmitted over the internet or logged to any database." }
    ]
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
    features: ['Millions & Lakhs Systems', 'USD, INR, EUR, GBP Currencies', 'Title, Upper & Lower Case', 'Text-to-Speech Pronunciation', 'One-Click Copy'],
    howTo: [
      { title: "Enter Numeric Digits", desc: "Type or paste any positive or negative integer or decimal number into the input field." },
      { title: "Select Numbering System & Currency", desc: "Choose International (Millions/Billions) or Indian (Lakhs/Crores) format, select an optional currency (USD, INR, EUR, GBP), and pick letter case." },
      { title: "Copy Formatted Words String", desc: "Review the generated English text representation and click Copy to transfer the words to your clipboard for checks or legal documents." }
    ],
    faq: [
      { question: "What is the difference between International and Indian numbering systems?", answer: "The International system groups digits by thousands (Thousands, Millions, Billions, Trillions). The Indian numbering system groups by Hundreds, Thousands, Lakhs (100,000), and Crores (10,000,000)." },
      { question: "How does the tool format currency amounts for check writing?", answer: "When a currency is selected (such as USD or INR), the integer portion is labeled with the primary currency (e.g. 'Dollars' or 'Rupees') and decimal digits are formatted as fractional units (e.g. 'Cents' or 'Paise') followed by 'Only'." },
      { question: "Can I convert decimal fractions and cents into words?", answer: "Yes. Decimal inputs (such as 1234.56) are accurately parsed into full words for both the integer portion and the fractional decimal components." },
      { question: "Which letter casing options are available for the output?", answer: "You can toggle output between Title Case ('One Hundred'), Sentence Case ('One hundred'), ALL UPPERCASE ('ONE HUNDRED'), and all lowercase ('one hundred')." },
      { question: "What is the maximum number size supported for conversion?", answer: "The tool handles numbers up to quadrillions in the International system and Arab/Kharab in the Indian numbering system without arithmetic overflow." }
    ]
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
    features: ['Words to Digits', 'Formatted Commas', 'Millions & Crores Support', 'Client-Side Processing', 'One-Click Copy'],
    howTo: [
      { title: "Type or Paste Number Words", desc: "Input natural English number words (e.g. 'two million three hundred forty-five thousand')." },
      { title: "Automatic Text Parsing", desc: "The parser cleans punctuation, handles hyphenated compound words, and aggregates numeric scales." },
      { title: "Copy Converted Number Digits", desc: "View the converted plain integer string and localized comma-separated format, and copy the result with one click." }
    ],
    faq: [
      { question: "Which number scales are supported by the words-to-number parser?", answer: "The parser recognizes standard English scales from units (zero to nine), teens, tens (twenty to ninety), hundreds, thousands, millions, billions, and trillions." },
      { question: "Does the parser handle hyphenated words like 'twenty-five'?", answer: "Yes. Hyphens are automatically normalized, allowing compound words like 'forty-two' or 'ninety-nine' to be parsed accurately." },
      { question: "Can the parser process phrases with the word 'and' (such as 'one hundred and twenty')?", answer: "Yes. Connecting words such as 'and' are recognized as conversational syntax and filtered cleanly during numerical evaluation." },
      { question: "What output formats are generated from the words?", answer: "The tool generates both a raw numeric digit string (e.g. 1500000) for formulas and a localized comma-formatted display (e.g. 1,500,000) for reading clarity." },
      { question: "Are my entered phrases uploaded to an external server?", answer: "No. The natural language string parsing algorithm runs entirely in your local browser memory." }
    ]
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
    features: ['Bidirectional Conversion', 'Numbers 1 to 3,999,999', 'Year Quick Presets', 'Roman Reference Chart', 'One-Click Copy'],
    howTo: [
      { title: "Select Conversion Direction", desc: "Choose Number to Roman to convert Arabic digits (e.g. 2026), or Roman to Number to convert Roman numerals (e.g. MMXXVI)." },
      { title: "Enter Value in Active Field", desc: "Type an integer between 1 and 3999 or valid Roman numeral symbols (I, V, X, L, C, D, M)." },
      { title: "View Converted Result & Breakdown", desc: "Inspect the converted numeral, read the step-by-step additive value breakdown, and copy the result." }
    ],
    faq: [
      { question: "What is the valid numerical range for Roman numeral conversion?", answer: "Standard classical Roman numerals support integers from 1 up to 3999 (MMMCMXCIX). Numbers 4000 and above traditionally required vinculum overlines not supported in standard ASCII text." },
      { question: "How do subtractive notation rules work in Roman numerals?", answer: "Smaller value numerals placed before larger ones indicate subtraction: I before V (4) or X (9); X before L (40) or C (90); and C before D (400) or M (900)." },
      { question: "What does the calculation breakdown show?", answer: "The tool displays an additive decomposition showing how each individual symbol contributes to the overall sum (for example, MMXXIV = 1000 + 1000 + 10 + 10 + 4 = 2024)." },
      { question: "Can I enter lowercase Roman letters like 'mmxxiv'?", answer: "Yes. The parser accepts lowercase and uppercase characters automatically and normalizes them into valid uppercase Roman notation." },
      { question: "Why is there no Roman numeral for zero?", answer: "Classical Romans did not have a numeral symbol for zero; they used the Latin word 'nulla' (meaning none) when referring to an absence of quantity." }
    ]
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
    features: ['Monthly EMI Payment', 'Extra Payment Savings', 'Yearly Amortization Schedule', 'Visual Principal vs Interest', 'Export CSV Schedule'],
    howTo: [
      { title: "Enter Loan & Mortgage Parameters", desc: "Input your loan principal balance, annual interest rate percentage, and loan term in years." },
      { title: "Add Optional Extra Monthly Payments", desc: "Enter an additional monthly payment amount to test how extra principal payments accelerate debt payoff." },
      { title: "Analyze Payoff Timeline & Amortization", desc: "Review your base monthly payment, total interest saved, years cut off your mortgage, and yearly amortization table." }
    ],
    faq: [
      { question: "How do extra monthly payments reduce my total mortgage interest?", answer: "Extra payments go directly toward reducing loan principal balance. Because monthly interest is calculated on remaining balance, lowering principal accelerates amortization and reduces total interest owed." },
      { question: "How is the base monthly payment calculated?", answer: "The calculator uses standard monthly amortization: M = P[r(1+r)^n] / [(1+r)^n - 1], where P is loan amount, r is monthly rate, and n is total months." },
      { question: "Does this mortgage calculator include property taxes and homeowner insurance?", answer: "This tool calculates principal and interest (P&I). Escrow items like property taxes, home insurance, and HOA dues vary by municipality and should be budgeted alongside P&I." },
      { question: "Can I see how many years an extra payment cuts off my loan?", answer: "Yes. When you enter an extra monthly payment, the summary card displays the exact number of years and months saved off your original repayment term." },
      { question: "Can I download or copy the amortization schedule?", answer: "Yes. The amortization table displays yearly starting balance, principal paid, interest paid, and end balance across the entire loan lifespan." }
    ]
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
    features: ['Total & Annualized ROI', 'Profit Margin & Markup %', 'Break-Even Unit & Revenue', 'Local In-Browser Math', 'Instant Output'],
    howTo: [
      { title: "Select Analysis Tab", desc: "Choose ROI & Profit Margin for commercial product pricing, Annualized ROI for investments, or Break-Even for volume planning." },
      { title: "Input Financial Figures", desc: "Enter cost price, selling price, units, overhead expenses, initial investment capital, or fixed costs." },
      { title: "Inspect Margins & Return Percentages", desc: "Review gross profit, net profit margin %, markup %, annualized rate of return, or minimum break-even sales volume." }
    ],
    faq: [
      { question: "What is the difference between Profit Margin and Markup?", answer: "Profit Margin is profit divided by selling price (Profit / Revenue × 100). Markup is profit divided by cost price (Profit / Cost × 100). A product costing $50 and sold for $100 has a 50% margin but a 100% markup." },
      { question: "How is simple ROI calculated versus Annualized ROI?", answer: "Simple ROI is (Net Profit / Initial Investment) × 100. Annualized ROI incorporates investment duration to calculate the compound annual return: [(Final Value / Initial Value)^(1 / Years) - 1] × 100." },
      { question: "How does the Break-Even analysis work?", answer: "Break-even units are calculated by dividing Total Fixed Costs by the Contribution Margin per unit (Selling Price - Variable Cost per unit), showing exact sales needed to cover costs." },
      { question: "Can I factor in secondary business expenses?", answer: "Yes. The commercial mode includes fields for shipping, advertising, packaging, or transaction overhead to determine true net profit." },
      { question: "Are calculated financial projections stored on any server?", answer: "No. All margin calculations, ROI percentages, and break-even tables execute locally in your browser memory." }
    ]
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
    features: ['Monthly Deposits & Compounding', 'Yearly Growth Breakdown', 'CAGR Rate Calculator', 'Interactive Schedule', 'Instant Output'],
    howTo: [
      { title: "Choose Calculator Mode", desc: "Select Compound Interest to project savings growth over time, or CAGR to calculate historical compound annual growth rate." },
      { title: "Set Principal, Rate & Contributions", desc: "Input your starting deposit, monthly addition, expected annual return %, duration in years, and compounding frequency." },
      { title: "Examine Growth Projection & Yearly Table", desc: "Review total accumulated balance, total principal invested, compound interest earned, and the yearly growth schedule." }
    ],
    faq: [
      { question: "How does compounding frequency affect investment returns?", answer: "More frequent compounding (e.g. monthly or daily vs annually) applies interest to newly earned interest sooner, yielding a slightly higher Effective Annual Rate (EAR) and larger final balance." },
      { question: "What mathematical formula is used for regular monthly contributions?", answer: "Future value combines principal compounding A = P(1 + r/n)^(nt) with future value of an annuity series PMT × [((1 + r/n)^(nt) - 1) / (r/n)] adjusted for deposit timing." },
      { question: "What is CAGR and when should I use it?", answer: "Compound Annual Growth Rate (CAGR) measures the geometric mean annual return of an investment over multiple years: CAGR = (End Value / Start Value)^(1 / Years) - 1." },
      { question: "Does the calculator factor in investment management fees or taxes?", answer: "The tool computes gross mathematical compounding. To reflect advisory fees or capital gains taxes, reduce your annual interest rate input accordingly." },
      { question: "Can I model savings with zero monthly contributions?", answer: "Yes. Leave monthly contributions set to 0 to simulate pure lump-sum compound interest on your initial principal deposit." }
    ]
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
    features: ['Role & Tone Customizer', 'Multi-Category Templates', 'Copy & Download Options', 'Browser-Only Privacy', 'Library Integration'],
    howTo: [
      { title: "Define Persona & Goal", desc: "Select your expert persona (e.g. Senior Software Engineer or Marketing Strategist) and state your primary objective." },
      { title: "Add Context & Constraints", desc: "Specify domain background, negative constraints, preferred tone, and toggle Chain-of-Thought reasoning or few-shot examples." },
      { title: "Generate & Copy Structured Prompt", desc: "Review the assembled prompt block in the live preview panel and click Copy to clipboard to paste into ChatGPT." }
    ],
    faq: [
      { question: "How does structured prompt engineering improve ChatGPT output quality?", answer: "Explicitly defining persona, goal, context, constraints, and format eliminates ambiguity, guiding the model toward accurate, detailed responses while reducing hallucinations." },
      { question: "What does the Chain-of-Thought reasoning toggle do?", answer: "It injects instructions directing the model to outline its analytical strategy step-by-step before delivering the final answer, which boosts logic and math accuracy." },
      { question: "Can I use these prompts across GPT-4o, GPT-4, and GPT-3.5?", answer: "Yes. The generated prompt structures follow universal prompt design best practices that perform reliably across all OpenAI model versions." },
      { question: "Does this tool make calls to the OpenAI API?", answer: "No. This tool is a client-side prompt builder that formats and optimizes your prompt text locally; you paste the resulting prompt into ChatGPT." },
      { question: "Is my proprietary prompt content stored on Zubware servers?", answer: "No. All text fields and generated prompt blocks remain in local browser state with zero server-side transmission." }
    ]
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
    features: ['Google Gemini Tuned', 'Multimodal & Search Hooks', 'Structured Prompt Rules', 'Copy & Download', 'Favorites Store'],
    howTo: [
      { title: "Set Persona & Core Objective", desc: "Choose an expert role and define the exact task or query for Google Gemini." },
      { title: "Specify Multimodal & Research Context", desc: "Provide source context, cite data references, select output structure, and toggle step-by-step reasoning." },
      { title: "Copy Optimized Gemini Prompt", desc: "Review the formatted prompt and click Copy to clipboard for instant use in Google Gemini or Google AI Studio." }
    ],
    faq: [
      { question: "How is this prompt builder optimized specifically for Google Gemini models?", answer: "It organizes prompts into clean markdown sections with bracketed system instructions ([ROLE], [CONTEXT], [CONSTRAINTS]) that align with Gemini 1.5 Pro and Flash attention mechanisms." },
      { question: "Can I use these prompts with image and document uploads in Gemini?", answer: "Yes. The prompt framework includes sections for referencing attached screenshots, PDFs, or spreadsheets so Gemini analyzes them systematically." },
      { question: "Does the builder support few-shot examples?", answer: "Yes. You can add input/output demonstrations to teach Gemini custom formatting styles or specialized classification schemas." },
      { question: "Is an API key required to use this tool?", answer: "No. The builder operates purely in your browser as a structured template generator without requiring any API keys." },
      { question: "Are my draft prompts kept private?", answer: "Yes. All prompt text and selections remain strictly on your local device." }
    ]
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
    features: ['XML Tag Structuring', 'System Role Framing', 'Long-Context Optimization', 'Copy/Download/Print', 'Browser Offline'],
    howTo: [
      { title: "Define Expert Persona & Mission", desc: "Select an expert archetype and define the primary analytical or writing objective." },
      { title: "Configure XML Tag Structuring", desc: "Enable XML tag wrappers (<context>, <instructions>, <rules>) to maximize Claude's context comprehension." },
      { title: "Copy Anthropic-Optimized Prompt", desc: "Inspect the assembled prompt and click Copy for use in Claude 3.5 Sonnet, Opus, or Haiku." }
    ],
    faq: [
      { question: "Why does the builder use XML tags for Claude prompts?", answer: "Anthropic explicitly recommends XML tags (like <context>, <rules>, <scratchpad>) because Claude's architecture parses structured XML tags with exceptional precision." },
      { question: "What is the purpose of the 'scratchpad' or thinking section?", answer: "It prompts Claude to think through the problem internally inside <thinking> tags before writing its final response, yielding higher accuracy on complex queries." },
      { question: "Can I specify strict negative constraints in Claude prompts?", answer: "Yes. The constraints section generates explicit negative rules (e.g. 'Never apologize', 'Do not summarize') which Claude follows reliably." },
      { question: "Is this tool compatible with Claude Artifacts?", answer: "Yes. You can specify output formats like standalone HTML/React code or Markdown documentation that Claude renders cleanly inside Artifacts." },
      { question: "Are my prompts recorded on an external server?", answer: "No. All text formatting runs locally in your browser memory." }
    ]
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
    features: ['Camera Movement Sliders', 'Lighting & Frame Rates', 'Cinematic Movement Cues', 'Runway/Luma/Sora Compatible', 'Export & Copy'],
    howTo: [
      { title: "Describe Scene Subject & Action", desc: "Enter your primary subject, environment, and physical movement sequence for Google Veo video generation." },
      { title: "Set Camera Movement & Cinematography", desc: "Choose lens focal length, camera motion (Drone Orbit, Tracking Shot, Steadicam, Slow Dolly), lighting, and atmosphere." },
      { title: "Copy Cinematic Video Prompt", desc: "Review the compiled cinematic prompt with framerate and resolution descriptors and copy it with one click." }
    ],
    faq: [
      { question: "What parameters are critical for generating high-definition video with Google Veo?", answer: "Veo responds best to descriptive camera motion (e.g. 'slow drone push-in at 24fps'), specific lighting cues (e.g. 'golden hour volumetric light'), and explicit temporal action descriptions." },
      { question: "Can I specify aspect ratios like 16:9 widescreen or 9:16 vertical?", answer: "Yes. The builder formats technical aspect ratio directives for cinematic widescreen or vertical mobile video." },
      { question: "Does the builder include negative prompts to avoid visual artifacts?", answer: "Yes. You can append negative cues to filter out jitter, frame distortion, morphing limbs, and unnatural speed fluctuations." },
      { question: "Is this prompt builder connected to Google Cloud or Veo servers?", answer: "No. It is a local template engineering tool that crafts the prompt text you input into video generation platforms." },
      { question: "Can I save my favorite video camera movement combinations?", answer: "Yes. Your active settings persist in browser memory so you can generate cohesive sequential video scene prompts." }
    ]
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
    features: ['V6 Command Parameters', 'Aspect Ratio Selector', 'Stylize & Chaos Sliders', 'Negative Prompting (--no)', 'Ready Templates'],
    howTo: [
      { title: "Describe Subject & Environment", desc: "Enter your core visual concept, characters, architectural elements, and background setting." },
      { title: "Select Art Style, Lighting & Parameters", desc: "Pick artistic medium (Hyperrealistic Photo, Oil, Anime), lighting style, and set --ar, --v, --stylize, and --chaos flags." },
      { title: "Copy Formatted /imagine Prompt", desc: "Review the full Midjourney command with appended parameter flags and click Copy to clipboard for Discord." }
    ],
    faq: [
      { question: "Which Midjourney parameter flags does this builder support?", answer: "It supports aspect ratios (--ar 16:9, --ar 9:16), version selection (--v 6), stylize intensity (--s 250), chaos randomization (--c 10), and weirdness (--w)." },
      { question: "How does weight weighting (--no, ::) work in Midjourney prompts?", answer: "You can append negative weights with --no (e.g. --no text, blur) and assign relative emphasis to concepts using double-colon weights (e.g. cyberpunk::2)." },
      { question: "Does the builder organize descriptive keywords effectively?", answer: "Yes. It arranges prompts in recommended Midjourney order: Core Subject → Environment & Lighting → Art Medium/Artist Reference → Technical Parameter Flags." },
      { question: "Can I copy the prompt with the /imagine prefix included?", answer: "Yes. The one-click copy button includes '/imagine prompt: ' so you can paste directly into Discord without typing commands." },
      { question: "Is any prompt data sent to external servers?", answer: "No. All parameter string concatenation executes client-side in your web browser." }
    ]
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
    features: ['Flux Schnell & Dev Presets', 'Typography In-Image Controls', 'Photorealism Detail Sliders', 'Copy/Download Formats', 'Library Modal'],
    howTo: [
      { title: "Input Image Concept & Scene Details", desc: "Type your visual subject, composition, background textures, and emotional tone." },
      { title: "Configure Photographic & Stylistic Cues", desc: "Specify natural lighting, camera sensor specs (e.g. 35mm lens, f/1.8), color grading, and style realism." },
      { title: "Copy Natural Language Flux Prompt", desc: "Review the prompt engineered for Flux.1 Schnell, Dev, or Pro and copy the text for your image generator." }
    ],
    faq: [
      { question: "Why does Flux prefer natural language descriptions over tag lists?", answer: "Black Forest Labs' Flux models use a modern T5 text encoder that excels at parsing fluent, natural descriptive sentences rather than comma-separated booru tags." },
      { question: "Can Flux render readable in-image text?", answer: "Yes. The builder lets you wrap target text in quotation marks (e.g. a neon sign reading \"COFFEE\"), which Flux renders with high typographic accuracy." },
      { question: "How should photographic lighting be described for Flux?", answer: "Describe physical light sources naturally (e.g. 'soft morning diffuse light streaming through blinds with subtle dust motes') rather than generic buzzwords like 'hyperrealistic'." },
      { question: "Which Flux model tiers is this prompt compatible with?", answer: "The generated prompts work seamlessly across Flux.1 [pro], Flux.1 [dev], and Flux.1 [schnell] platforms." },
      { question: "Does the tool transmit my image prompt ideas anywhere?", answer: "No. All prompt assembly is performed locally in browser memory." }
    ]
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
    features: ['Positive & Negative Prompts', 'Sampler & CFG Recommendations', 'Pony/SDXL/SD1.5 Presets', 'Export TXT & MD', 'Favorite Manager'],
    howTo: [
      { title: "Enter Subject & Art Direction", desc: "Specify your character, setting, art style (photorealistic, digital illustration, concept art), and color palette." },
      { title: "Configure Keyword Weights & Negative Prompt", desc: "Adjust emphasis parentheses (keyword:1.2), select camera optics, and generate an automated negative prompt." },
      { title: "Copy Positive & Negative Prompts", desc: "Click Copy Positive Prompt or Copy Negative Prompt to paste directly into Automatic1111, ComfyUI, or Fooocus." }
    ],
    faq: [
      { question: "How do keyword emphasis weights work in Stable Diffusion?", answer: "Enclosing words in parentheses with weight values (e.g. (masterpiece:1.2), (detailed eyes:1.1)) instructs the CLIP text encoder to prioritize those tokens during image generation." },
      { question: "What does the negative prompt do in SDXL and SD 1.5?", answer: "Negative prompts guide the reverse diffusion process away from unwanted features, removing artifacts like extra fingers, mutated anatomy, blur, and watermarks." },
      { question: "Is this compatible with SDXL, SD 1.5, and SD 3?", answer: "Yes. You can toggle SDXL natural sentence mode or SD 1.5 tag-weighted syntax depending on your local model checkpoint." },
      { question: "Can I copy positive and negative prompts separately?", answer: "Yes. Dedicated copy buttons let you grab the positive prompt block and negative prompt block independently." },
      { question: "Are prompt configurations saved on a server?", answer: "No. Everything runs client-side in your browser with complete privacy." }
    ]
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
    features: ['Industry Categories', 'Logo Style Presets', 'Vector Graphic Rules', 'Color Palette Control', 'One-Click Copy'],
    howTo: [
      { title: "Enter Brand Name & Industry", desc: "Input your business or project name, company niche, and brand core values." },
      { title: "Select Logo Aesthetic & Style", desc: "Choose from Minimalist Flat Vector, Mascot Emblem, Monogram Lettermark, Geometric Abstract, or Vintage Badge." },
      { title: "Copy AI Image Logo Prompt", desc: "Review the engineered prompt featuring white background isolation directives and copy it for Midjourney or DALL-E." }
    ],
    faq: [
      { question: "Why does the logo prompt builder specify a pure white background?", answer: "Specifying an isolated pure white background (hex #FFFFFF) ensures the generated logo can be easily traced to vector (SVG) or transparent PNG without messy background artifacts." },
      { question: "What logo design styles are supported?", answer: "Styles include Modern Minimalist, Geometric Wordmark, Monogram Emblem, Vintage Retro Badge, 3D App Icon, and Corporate Tech Mascot." },
      { question: "Does the prompt enforce flat 2D vector aesthetics?", answer: "Yes. It injects negative constraints against gradients, photo textures, realistic 3D shading, and noisy backgrounds when 2D vector mode is chosen." },
      { question: "Can I use these prompts in Midjourney, DALL-E 3, and Flux?", answer: "Yes. The generated prompts follow universal graphic design prompt standards that translate cleanly across all major text-to-image engines." },
      { question: "Are my company branding ideas uploaded anywhere?", answer: "No. All prompt assembly is processed entirely inside your local browser." }
    ]
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
    features: ['High-CTR Hooks', 'Facial Expression Controls', 'Overlay Text Formatting', 'Platform Aspect Ratios', 'Export & Share'],
    howTo: [
      { title: "Input Video Topic & Hook", desc: "Enter your YouTube or social video subject, emotional hook, and primary thumbnail concept." },
      { title: "Select Composition & Facial Expression", desc: "Choose camera framing (Extreme Close-Up, Split-Screen), expressive facial reaction, high-contrast lighting, and 16:9 aspect ratio." },
      { title: "Copy High-CTR Thumbnail Prompt", desc: "Review the final prompt optimized for visual click-through rate and copy it for your image generator." }
    ],
    faq: [
      { question: "What visual elements make an AI-generated thumbnail click-worthy?", answer: "High-CTR thumbnails require high contrast, clean focal separation between subject and background, bold expressive faces, and vibrant lighting that stays legible on small mobile screens." },
      { question: "Does the builder automatically enforce 16:9 widescreen proportions?", answer: "Yes. It automatically includes the widescreen parameter (--ar 16:9) matching standard YouTube thumbnail dimensions (1280x720)." },
      { question: "Can I specify room for text overlay in the composition?", answer: "Yes. Composition presets let you place the main subject on the right or left third (Rule of Thirds), leaving negative space for bold headline text." },
      { question: "Can I generate split-screen Before vs After thumbnail prompts?", answer: "Yes. The comparison mode structures dual-scene prompts showing stark before-and-after contrasts." },
      { question: "Is my thumbnail prompt idea kept confidential?", answer: "Yes. All prompt construction runs in local browser state with zero external logging." }
    ]
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
    features: ['Studio Lighting Options', 'Podium & Backdrop Controls', 'Camera Lens Specs', 'Commercial E-Commerce Presets', 'Copy & Download'],
    howTo: [
      { title: "Enter Product Details", desc: "Describe your product category (cosmetics, electronics, beverage, apparel) and physical materials." },
      { title: "Choose Studio Setting & Lighting", desc: "Select studio podium, natural lifestyle interior, outdoor nature setting, softbox lighting, and camera depth-of-field." },
      { title: "Copy Commercial Photography Prompt", desc: "Review the commercial advertising prompt and copy it to generate realistic product mockups." }
    ],
    faq: [
      { question: "What lighting setups are included for commercial product photography?", answer: "It includes luxury studio softbox lighting, natural window backlight, dramatic moody rim light, high-key white e-commerce lighting, and golden hour sunlight." },
      { question: "Can I specify pedestal materials like marble, concrete, or wood?", answer: "Yes. You can select podium surfaces including polished marble, rough textured stone, acrylic glass, water splash ripples, or natural wood." },
      { question: "Does the prompt enforce shallow depth of field?", answer: "Yes. It includes camera lens parameters (e.g. 85mm macro lens, f/2.8) to blur busy background distractions and focus crisp detail on the product packaging." },
      { question: "Can I use these prompts for Amazon and Shopify listing mockups?", answer: "Yes. Switch to 'Clean White E-Commerce' mode to generate compliant white-background product shots for digital store listings." },
      { question: "Are product names or descriptions transmitted to Zubware?", answer: "No. All text formatting operates locally in your web browser." }
    ]
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
    features: ['ArchViz Style Presets', 'Room & Furniture Options', 'Material & Lighting Sliders', 'Camera Angles', 'Export Actions'],
    howTo: [
      { title: "Select Room Type & Dimensions", desc: "Choose Living Room, Master Bedroom, Modern Kitchen, Luxury Bathroom, or Home Office." },
      { title: "Choose Architecture Style & Palette", desc: "Select Japandi, Scandinavian, Industrial Loft, Mid-Century Modern, or Biophilic, and configure natural lighting." },
      { title: "Copy Architectural Interior Prompt", desc: "Inspect the detailed architectural prompt with wide-angle lens specs and copy it to your clipboard." }
    ],
    faq: [
      { question: "Which interior design architectural styles are supported?", answer: "It supports Japandi, Scandinavian Minimalist, Mid-Century Modern, Industrial Urban Loft, Contemporary Luxury, Biophilic Modern, and French Provincial." },
      { question: "Does the prompt specify wide-angle architectural lens optics?", answer: "Yes. It includes professional architectural photography directives (e.g. 24mm tilt-shift lens, eye-level perspective) to render realistic room proportions." },
      { question: "Can I configure specific interior finishes like oak flooring and brass fixtures?", answer: "Yes. Material selectors let you specify concrete, herringbone hardwood, polished plaster, boucle fabrics, and custom metal hardware." },
      { question: "Can I specify time of day and natural window light?", answer: "Yes. You can select morning sunrise sunlight, bright afternoon daylight, dusk twilight with warm interior lamps, or moody overcast lighting." },
      { question: "Are design prompts stored on external servers?", answer: "No. All prompt assembly executes locally in client-side memory." }
    ]
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
    features: ['Genre Archetypes', 'Protagonist Flaw Builder', 'Inciting Incident Hooks', 'Twist & Moral Controls', 'Download TXT/MD'],
    howTo: [
      { title: "Select Genre & Core Premise", desc: "Pick Sci-Fi, Fantasy, Thriller, Historical, Romance, or Horror, and summarize your central conflict." },
      { title: "Define Characters, Setting & Pacing", desc: "Configure protagonist motivations, primary antagonist, atmospheric setting, narrative point-of-view, and plot twists." },
      { title: "Copy Creative Writing Master Prompt", desc: "Review the comprehensive fiction-writing prompt and copy it for ChatGPT, Claude, or local LLMs." }
    ],
    faq: [
      { question: "How does this builder prevent generic or cliché AI story outputs?", answer: "It injects directives for showing rather than telling, subverting genre clichés, establishing distinct sensory details, and maintaining authentic character dialogue voices." },
      { question: "Can I choose narrative point-of-view (POV)?", answer: "Yes. You can toggle First Person ('I'), Third Person Limited, or Third Person Omniscient perspective." },
      { question: "Does the prompt include pacing and three-act structure guidance?", answer: "Yes. You can select classic Three-Act structure, the Hero's Journey, or episodic chapter-by-chapter scene breakdowns." },
      { question: "Can I generate dialogue-heavy scene prompts?", answer: "Yes. Tone options let you emphasize snappy character banter, philosophical dialogue, or descriptive atmospheric exposition." },
      { question: "Is my original fiction manuscript idea private?", answer: "Yes. All creative writing prompts are constructed entirely in your browser without external transmission." }
    ]
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
    features: ['Viral Hook Formulas', 'Host Persona Options', 'B-Roll & Music Cues', 'CTA Formatting', 'Library Templates'],
    howTo: [
      { title: "Enter Video Topic & Target Audience", desc: "State your video subject, target viewer demographic, and estimated video runtime." },
      { title: "Select Script Structure & Retention Hooks", desc: "Choose 5-second Hook style, Storytelling pacing, B-Roll callouts, and Call-to-Action placement." },
      { title: "Copy Complete YouTube Production Prompt", desc: "Review the scriptwriting prompt and copy it into your AI assistant for full script generation." }
    ],
    faq: [
      { question: "How does the builder optimize for YouTube audience retention?", answer: "It structures prompts to generate instant opening hooks (first 5-15 seconds), open story loops, curiosity gaps, and fast-paced transitions that minimize viewer drop-off." },
      { question: "Does the prompt output visual B-Roll and editing cues?", answer: "Yes. It instructs the AI model to include bracketed [Visual: B-roll / Motion Graphics] and [Sound Effect] suggestions alongside narration copy." },
      { question: "Can I specify target video duration and word count?", answer: "Yes. Durations (e.g. 5 minutes, 10 minutes, or 15+ minutes) automatically calibrate target script word counts based on a 140 WPM spoken pace." },
      { question: "Can I generate YouTube Shorts and TikTok 60-second scripts?", answer: "Yes. Toggle 'Short-Form Video' mode to structure fast 30-to-60 second vertical scripts with continuous visual scene shifts." },
      { question: "Are video script topics kept private?", answer: "Yes. Script prompt generation executes locally in your browser." }
    ]
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
    features: ['Google XYZ Formula', 'Action Verb Tuning', 'ATS Keyword Targeting', 'Section Specific Prompts', 'One-Click Export'],
    howTo: [
      { title: "Input Target Role & Experience Level", desc: "Specify your desired job title, target industry, and career seniority level." },
      { title: "Paste Raw Experience & Key Skills", desc: "Provide rough bullet points, job duties, metrics, and target job description keywords." },
      { title: "Copy Executive Resume Prompt", desc: "Review the prompt engineered to produce high-impact, metrics-driven XYZ bullet points and copy it." }
    ],
    faq: [
      { question: "What is Google's XYZ formula for resume bullet points?", answer: "The XYZ formula instructs: 'Accomplished [X] as measured by [Y], by doing [Z]'. The prompt directs the AI to transform vague duties into quantified business accomplishments." },
      { question: "Does the prompt optimize for Applicant Tracking Systems (ATS)?", answer: "Yes. It instructs the model to incorporate keywords from your target job description and use standard, scannable chronological section headings." },
      { question: "Can I use this for career transitions into new industries?", answer: "Yes. The career changer option emphasizes transferable technical and leadership skills while de-emphasizing non-relevant historical duties." },
      { question: "Does this prompt builder generate real executive summaries?", answer: "Yes. It includes templates for compelling 3-line professional career summaries highlighting core strengths and industry specialization." },
      { question: "Is my personal employment history uploaded to any server?", answer: "No. All text parsing and prompt assembly occur client-side in your active browser tab." }
    ]
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
    features: ['Company Alignment Hooks', 'Value Proposition Tuning', 'Executive Tone Options', '3-Paragraph Format', 'Export & Print'],
    howTo: [
      { title: "Enter Job Title & Company Name", desc: "Provide the target employer, position title, and company culture context." },
      { title: "Highlight Value Proposition & Experience", desc: "Input your top 2-3 career accomplishments and why you are drawn to this organization." },
      { title: "Copy Tailored Cover Letter Prompt", desc: "Review the cover letter prompt and copy it to generate an authentic, non-generic letter in ChatGPT or Claude." }
    ],
    faq: [
      { question: "How does this builder avoid generic, robotic cover letters?", answer: "It requires specific company mission details and quantifiable past wins, instructing the AI model to write in an authentic, confident human voice without clichés." },
      { question: "Can I adjust the tone between formal and modern startup?", answer: "Yes. You can select Corporate Professional, Modern Startup, Academic/Scientific, or Creative conversational tone." },
      { question: "How long is the generated cover letter?", answer: "The prompt specifies standard single-page hiring manager length (250-350 words, 3 to 4 concise paragraphs)." },
      { question: "Can I address potential resume gaps or career changes?", answer: "Yes. The transition module frames career breaks or pivoting skill sets positively as adaptable problem-solving strengths." },
      { question: "Is my application data kept confidential?", answer: "Yes. No company names, user resumes, or cover letter drafts are sent to external servers." }
    ]
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
    features: ['Cold Outreach Formulas', 'Subject Line Generators', 'Low-Friction CTAs', 'Word Count Constraints', 'Copy & Download'],
    howTo: [
      { title: "Choose Email Category & Objective", desc: "Select Cold Outreach, Client Follow-Up, Executive Update, Salary Negotiation, or Customer Support." },
      { title: "Set Recipient Persona & Desired Call to Action", desc: "Define the recipient's role, tone (Casual, Professional, Urgent, Diplomatic), and your exact desired next step." },
      { title: "Copy High-Response Email Prompt", desc: "Review the email generation prompt with subject line options and copy it with one click." }
    ],
    faq: [
      { question: "Which email templates are supported?", answer: "It supports sales cold outreach, networking requests, polite invoice payment reminders, project status summaries, and executive escalations." },
      { question: "Does the prompt ask for multiple subject line variants?", answer: "Yes. The prompt instructs the AI to propose 3 high-open-rate subject lines with differing curiosity and urgency levels." },
      { question: "Can I constrain email length to prevent wordy messages?", answer: "Yes. You can enforce a strict brevity limit (e.g. under 125 words) to ensure high mobile readability and reply rates." },
      { question: "How does it handle polite but firm follow-up emails?", answer: "The follow-up module provides context-aware phrasing that follows up warmly without sounding accusatory or desperate." },
      { question: "Is my private correspondence uploaded anywhere?", answer: "No. All prompt assembly executes locally in browser memory." }
    ]
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
    features: ['Multi-Platform Presets', 'Carousel & Thread Outlines', 'Pattern Interrupt Hooks', 'Hashtags & CTAs', 'Export Actions'],
    howTo: [
      { title: "Select Social Platform & Content Pillar", desc: "Choose LinkedIn, Twitter/X, Instagram, Facebook, or Threads, and specify your content topic." },
      { title: "Configure Hook Style, Formatting & Hashtags", desc: "Select single post, multi-tweet thread, or carousel script, set emoji frequency, and define call-to-action." },
      { title: "Copy Viral Social Post Prompt", desc: "Review the platform-native social media prompt and copy it into your AI assistant." }
    ],
    faq: [
      { question: "How does the builder adapt prompts for specific social networks?", answer: "Each platform uses native formatting guidelines: Twitter/X enforces 280-character thread blocks, LinkedIn prioritizes professional line-spaced storytelling, and Instagram emphasizes visual caption storytelling." },
      { question: "Can I generate multi-part Twitter/X threads?", answer: "Yes. The thread mode instructs the model to write a magnetic opening hook tweet, 5-8 structured value tweets, and a concluding recap CTA tweet." },
      { question: "Can I control emoji usage and visual spacing?", answer: "Yes. You can select 'Minimal / Professional', 'Moderate Accents', or 'Vibrant / High Engagement' emoji levels." },
      { question: "Does the prompt suggest relevant hashtags?", answer: "Yes. It directs the AI to research and provide 3-5 high-relevance niche hashtags matching the core topic." },
      { question: "Are social media post ideas stored on a server?", answer: "No. Prompt compilation runs locally in your browser." }
    ]
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
    features: ['E-E-A-T Compliance Rules', 'Meta Tag Optimization', 'Search Intent Targeting', 'FAQ Schema Guidelines', 'Download Markdown'],
    howTo: [
      { title: "Enter Target Keyword & Search Intent", desc: "Specify your primary target keyword, secondary keywords, and search intent (Informational, Commercial, or Transactional)." },
      { title: "Configure Article Scope & Schema Directives", desc: "Set word count, outline depth, H2/H3 subheadings, FAQ schema questions, and competitor differentiator angles." },
      { title: "Copy Comprehensive SEO Writing Prompt", desc: "Review the search-optimized content prompt and copy it for ChatGPT, Claude, or Gemini." }
    ],
    faq: [
      { question: "How does this builder ensure compliance with Google's helpful content guidelines?", answer: "The prompt instructs the AI to provide direct answers, cite practical examples, offer unique expert insights (EEAT), and avoid repetitive keyword stuffing." },
      { question: "Does the prompt generate FAQ schema sections?", answer: "Yes. It directs the model to extract common 'People Also Ask' questions and answer them concisely in ready-to-use FAQ schema formats." },
      { question: "Can I specify internal linking placeholder directives?", answer: "Yes. The prompt instructs the model to indicate natural anchor text placements for linking to related website resources." },
      { question: "What search intent classifications are available?", answer: "You can select Informational (guides, tutorials), Commercial (reviews, comparisons), Transactional (buy/pricing), or Navigational intents." },
      { question: "Is my proprietary keyword research data stored on a database?", answer: "No. All text inputs remain strictly in local browser memory with zero tracking." }
    ]
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
    features: ['Multi-Language Presets', 'Edge Case Guardrails', 'Strict Typing Rules', 'Architecture Constraints', 'Copy Code Prompt'],
    howTo: [
      { title: "Select Language, Framework & Architecture", desc: "Choose programming language (TypeScript, Python, Go, Rust, React, Next.js) and architecture design patterns." },
      { title: "Specify Problem, Inputs & Edge Cases", desc: "Describe function requirements, input/output data types, performance constraints, and error handling rules." },
      { title: "Copy Production-Grade Code Prompt", desc: "Review the technical engineering prompt demanding clean typed code and unit tests, and copy it." }
    ],
    faq: [
      { question: "How does this builder prevent hallucinated code and syntax bugs?", answer: "It requires strict typing (TypeScript, mypy), forbids deprecated APIs, demands production error handling, and instructs the model to include runnable test suites." },
      { question: "Can I request specific testing frameworks like Jest, Vitest, or PyTest?", answer: "Yes. The testing directive instructs the AI to generate complete unit test suites with mock assertions alongside the core implementation." },
      { question: "Can I generate prompts for refactoring or debugging existing code?", answer: "Yes. Toggle 'Refactor & Optimize' mode to paste existing legacy code and request Big-O algorithmic optimization, readability improvements, or bug identification." },
      { question: "Does the prompt demand clean, commented code without fluff?", answer: "Yes. It instructs the model to provide raw code blocks with concise inline architectural explanations, omitting unnecessary conversational filler." },
      { question: "Is my proprietary codebase or code snippet uploaded to Zubware?", answer: "No. All prompt construction runs client-side in browser memory with zero server access." }
    ]
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
    features: ['Custom Section Architect', 'Role & Goal Builder', 'Output Format Tuning', 'Language & Examples', 'Export TXT/MD'],
    howTo: [
      { title: "Define Role & Primary Task", desc: "State the expert persona and clearly describe what you want the AI assistant to accomplish." },
      { title: "Add Context, Rules & Formatting Requirements", desc: "Provide background information, negative constraints, desired tone, and exact output format (Table, Markdown, Code, JSON)." },
      { title: "Copy Master Prompt for Any LLM", desc: "Review the universally structured prompt and copy it for use in any AI model or chat platform." }
    ],
    faq: [
      { question: "Why is the Universal Prompt Builder compatible with all AI models?", answer: "It utilizes the universal PREP framework (Persona, Request, Explanation, Proof/Format), which aligns with the core instruction-tuning algorithms of all modern LLMs." },
      { question: "Can I generate JSON schema outputs for API automation?", answer: "Yes. Select 'Strict JSON' in the output format selector to instruct the model to return valid, unescaped JSON matching your required schema." },
      { question: "Does the universal builder support step-by-step reasoning?", answer: "Yes. You can toggle Chain-of-Thought reasoning to ensure models break complex multi-part questions into logical steps before concluding." },
      { question: "Can I save custom prompt templates for repeat tasks?", answer: "Yes. The integrated prompt library allows you to bookmark custom configurations in local browser storage for quick reuse." },
      { question: "Are universal prompt drafts sent over the internet?", answer: "No. String compilation is executed locally in your web browser." }
    ]
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
    features: ['In-Browser Security Scan', 'Camera & Image Upload', '12+ Local Heuristic Rules', 'Phishing & Impersonation Alert', 'Safe Link Inspector'],
    howTo: [
      { title: "Upload QR Image or Scan via Camera", desc: "Upload a photo/screenshot of a QR code or scan it live using your device's webcam." },
      { title: "Inspect Decoded URL & Security Audit", desc: "Review the full decoded destination URL, domain reputation, protocol safety (HTTPS), and URL redirect hops." },
      { title: "Verify Safety Before Visiting", desc: "Check security indicators for deceptive homograph domains, executable downloads, and known phishing patterns." }
    ],
    faq: [
      { question: "Why should I inspect a QR code with a safety checker before opening it on my phone?", answer: "Malicious QR codes (quishing) can disguise harmful phishing websites, malicious app installation links, or payment redirect traps behind innocent-looking physical stickers." },
      { question: "Can the checker detect deceptive lookalike (homograph) domain attacks?", answer: "Yes. It inspects internationalized domain names (IDN) and Punycode representations to detect deceptive lookalike characters used to impersonate legitimate brands." },
      { question: "Does the tool automatically expand shortened redirect links?", answer: "The audit analyzes known short-link services and displays destination parameters to alert you to multi-hop redirects." },
      { question: "Can I scan QR codes using my laptop or phone camera?", answer: "Yes. You can use your device's camera stream with client-side barcode scanning, or simply drop a screenshot into the tool." },
      { question: "Is the scanned QR image uploaded to a server?", answer: "No. Image decoding runs locally in your browser using JavaScript QR matrix parsers." }
    ]
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
      'Local Browser Processing'
    ],
    howTo: [
      { title: "Enter Body Weight & Gender", desc: "Input your current body weight in kilograms or pounds and select your gender." },
      { title: "Choose Daily Physical Activity Level", desc: "Select your activity multiplier ranging from Sedentary (desk job) to Very Active (heavy physical training)." },
      { title: "Review Calorie Surplus & Macronutrients", desc: "Inspect your baseline maintenance calories, daily surplus recommendations (Mild +300, Moderate +500, Aggressive +750 kcal), and macro distribution in grams." }
    ],
    faq: [
      { question: "How are baseline maintenance calories estimated in this calculator?", answer: "Maintenance calories are estimated mathematically by multiplying your body weight in kilograms by an established metabolic activity multiplier (33 for sedentary up to 39 for very active training)." },
      { question: "What daily calorie surplus is recommended for lean weight gain?", answer: "A moderate surplus of approximately 300 to 500 calories above maintenance per day is commonly recommended to promote steady lean tissue accretion while minimizing excess fat gain." },
      { question: "How are daily protein, carbohydrate, and fat macros distributed?", answer: "The mathematical model targets protein at approximately 2.0g to 2.2g per kg of body weight for muscle synthesis, dietary fats at 25% to 30% of total calories, and remaining calories allocated to carbohydrates." },
      { question: "Can I track weight gain progress in pounds as well as kilograms?", answer: "Yes. You can enter your body weight in either kilograms or pounds; unit conversions are applied automatically." },
      { question: "Is this calculator a medical or clinical nutrition diagnosis?", answer: "No. This tool provides an informational mathematical estimate based on standard sports nutrition formulas and is not personalized medical advice." }
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
      'Client-Side In-Browser Processing'
    ],
    howTo: [
      { title: 'Upload PDF File', desc: 'Select or drag your PDF into the tool to inspect its current size.' },
      { title: 'Set Target Size and Mode', desc: 'Enter your desired size in KB or MB, and choose automatic detection, size increase, or compression mode.' },
      { title: 'Process and Download', desc: 'Click Adjust PDF Size to generate and download the calibrated PDF file.' }
    ],
    faq: [
      {
        question: 'How does the PDF Size Adjuster determine whether to increase or reduce size?',
        answer: 'The tool automatically compares your target file size against the actual uploaded file size. If your target is larger than your original file, it initiates harmless padding expansion. If your target is smaller, it applies browser-side compression.'
      },
      {
        question: 'Will expanding or increasing the PDF alter its visible pages or text?',
        answer: 'No. Increase mode adds non-rendering, ISO-compliant private data structures to the PDF catalog. Your document pages, text, vectors, images, and fonts remain untouched and identical.'
      },
      {
        question: 'What file-size units does the tool use?',
        answer: 'The tool strictly follows the standard decimal convention where 1 KB = 1,000 bytes and 1 MB = 1,000,000 bytes, matching government and job application upload thresholds.'
      },
      {
        question: 'Why do recruitment and government portals enforce PDF size boundaries?',
        answer: 'Portals specify file size floors and ceilings to prevent empty placeholder uploads, avoid corrupted scans, and prevent database saturation.'
      },
      {
        question: 'What happens if my original PDF is already within the target size range?',
        answer: 'The tool analyzes your file size upon upload. If your document already satisfies your target criteria, no unnecessary padding or compression is applied.'
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
      'Client-Side Processing'
    ],
    howTo: [
      { title: 'Select Your PDF', desc: 'Upload the document to inspect its current file size in KB.' },
      { title: 'Enter Target Minimum Size', desc: 'Specify the required threshold in KB or MB requested by your submission portal.' },
      { title: 'Generate and Download', desc: 'Produce a standard-compliant PDF padded to meet or exceed your specified file size requirement.' }
    ],
    faq: [
      {
        question: 'How does Increase PDF Size make the file larger without altering content?',
        answer: 'It embeds harmless, standard-compliant non-rendering data and metadata inside the PDF structure. Your visible document pages, layouts, vectors, and text remain untouched and identical.'
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
        question: 'Does increasing the file size affect print quality or visual layout?',
        answer: 'No. Because visible page content is neither compressed nor stretched, print quality and on-screen appearance remain identical to your original file.'
      },
      {
        question: 'Can I increase the size of a PDF multiple times?',
        answer: 'Yes. You can re-adjust the target threshold or upload an already-enlarged PDF if an application portal requires an even higher file size boundary.'
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
      'Browser-Based Compression'
    ],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your file to see its original size and page count.' },
      { title: 'Choose Compression Preset', desc: 'Select Low, Medium, or Strong compression based on your file requirements.' },
      { title: 'Compress and Download', desc: 'Save your smaller PDF with a real-time savings breakdown showing exact megabytes reduced.' }
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
        question: 'Which compression preset is best for job and university applications?',
        answer: 'Medium compression is optimal for portal uploads and emails, providing substantial size reductions while keeping text and diagrams sharp.'
      },
      {
        question: 'What if my PDF is already heavily compressed?',
        answer: 'PDF compression depends heavily on document contents. If a PDF is already heavily optimized (like text-only PDFs), our tool detects this and informs you honestly rather than degrading your document.'
      },
      {
        question: 'Can I see the exact before-and-after file sizes?',
        answer: 'Yes. The tool displays your original file size, resulting compressed size, and the percentage reduction before you download the file.'
      }
    ]
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor — Compress PDF Files Online Free',
    navTitle: 'PDF Compressor',
    description: 'Compress PDF files online for free and reduce file size while preserving high visual quality. browser-side processing.',
    icon: '🗜️',
    path: '/pdf-compressor.html',
    filename: 'pdf-compressor.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: ['Adjustable Compression Presets', 'Maximum, Balanced & High Quality', 'Real-time Size Savings Calculator', 'Preserves Document Dimensions', 'Browser-Based Processing'],
    howTo: [
      { title: 'Select Your PDF', desc: 'Drop or select the PDF file you want to compress.' },
      { title: 'Choose Compression Level', desc: 'Select from High Quality, Balanced, or Maximum Compression presets.' },
      { title: 'Download Compressed PDF', desc: 'Inspect the size reduction percentage and save your optimized PDF.' }
    ],
    faq: [
      {
        question: 'How does the PDF Compressor reduce file size?',
        answer: 'It compresses raster images and document streams using configurable resolution scaling and JPEG compression algorithms directly inside your web browser.'
      },
      {
        question: 'Does compressing a PDF reduce text clarity?',
        answer: 'No. Selectable text and font glyphs are stored as vector data and are not blurred during compression. Compression primarily optimizes high-resolution background scans and photos.'
      },
      {
        question: 'Can I choose different compression levels?',
        answer: 'Yes. You can select between High Quality (minor compression), Balanced (recommended for emails and portals), and Maximum Compression (for aggressive size reduction).'
      },
      {
        question: 'How much file size reduction can I expect?',
        answer: 'Image-rich PDFs, presentations, and scanned documents often see reductions between 40% and 80%, while plain text documents may see smaller savings.'
      },
      {
        question: 'Can I compress a multi-page document all at once?',
        answer: 'Yes. The compressor optimizes all pages in the PDF document simultaneously, compressing embedded raster images and streamlining object streams across the entire file.'
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
    features: ['High Resolution Rendering (up to 300 DPI)', 'Custom Page Range Support', 'Individual Page Download & ZIP Export', 'Instant Grid Preview', 'Client-Side Processing'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Drag or select the document to load its pages into the workspace.' },
      { title: 'Configure Resolution and Range', desc: 'Adjust scaling factor (up to 300 DPI equivalent), JPG quality slider, and select All Pages or custom page ranges.' },
      { title: 'Convert and Download', desc: 'Download individual page JPGs or save all converted pages bundled in a ZIP archive.' }
    ],
    faq: [
      {
        question: 'Does this tool extract embedded images or convert the entire page?',
        answer: 'It renders each complete PDF page—including text, layout, headers, and graphics—into a unified high-resolution JPG image.'
      },
      {
        question: 'Can I choose specific pages to convert?',
        answer: 'Yes! You can convert all pages or enter a custom page range such as 1-5, 8, 12.'
      },
      {
        question: 'Can I download all converted pages in one click?',
        answer: 'Yes, click Download All as ZIP to save all converted JPG images bundled together in a single archive.'
      },
      {
        question: 'How do I ensure small text remains legible in the JPG?',
        answer: 'You can increase the scale slider to 1.5x or 2.0x (300 DPI equivalent) to render ultra-sharp text and detailed graphics.'
      },
      {
        question: 'Can I zoom in and preview converted JPG pages before saving?',
        answer: 'Yes. Clicking on any converted thumbnail card opens a full-screen preview modal where you can inspect text legibility and image quality.'
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
    features: ['Add Custom Text Annotations', 'Digital Signature Drawing Pad', 'Image & Stamp Insertion', 'Highlight Rectangles', 'Rotate & Delete Pages', 'Browser-Side Processing'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your file to open the interactive canvas editing workspace.' },
      { title: 'Add Annotations and Markup', desc: 'Insert custom text notes, highlight areas, draw freehand signatures, or insert image stamps.' },
      { title: 'Save and Download', desc: 'Click Save PDF to export your updated document with all annotations permanently baked in.' }
    ],
    faq: [
      {
        question: 'What can I edit with this online PDF editor?',
        answer: 'You can add text notes, draw signatures, insert images/stamps, highlight areas, rotate pages, and remove or reorder pages.'
      },
      {
        question: 'Does this modify existing embedded PDF text?',
        answer: 'This tool performs client-side overlay editing and annotation. Direct vector editing of existing embedded text is not supported.'
      },
      {
        question: 'Can I sign documents on a mobile device or touch screen?',
        answer: 'Yes. The interactive signature pad supports touch gestures, stylus input, and mouse drawing for quick and natural signing.'
      },
      {
        question: 'Are annotations permanently embedded in the downloaded file?',
        answer: 'Yes. When you download the document, annotations and signature layers are written directly into the PDF page definitions so they appear in all viewers and printers.'
      },
      {
        question: 'Can I undo or clear annotations before exporting?',
        answer: 'Yes. You can select any text note, highlight, or image stamp on the canvas and remove it before saving your edited document.'
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
    features: ['A4, Letter & Legal Paper Sizes', 'Portrait & Landscape Orientation', 'Customizable Typography & Margins', 'Multi-Page Auto Pagination', 'Instant PDF Download', 'Client-Side Processing'],
    howTo: [
      { title: 'Enter or Paste Text', desc: 'Type directly into the editor or paste your text notes and drafts.' },
      { title: 'Format Page and Typography', desc: 'Configure document title, paper size (A4, Letter, Legal), orientation, margins, font family, size, alignment, and styling.' },
      { title: 'Generate and Download', desc: 'Inspect the real-time word count and download the formatted multi-page PDF document.' }
    ],
    faq: [
      {
        question: 'Does it support multi-page text documents?',
        answer: 'Yes! The converter automatically flows long text across multiple pages cleanly without cutting off lines.'
      },
      {
        question: 'Can I customize font styling and margins?',
        answer: 'Yes, you can choose fonts, sizes, line heights, text colors, alignment, and margin presets.'
      },
      {
        question: 'Can I automatically include page numbers?',
        answer: 'Yes. An optional toggle inserts clean page numbering into the footer of every generated page.'
      },
      {
        question: 'Which paper formats and orientations are available?',
        answer: 'You can choose between A4, US Letter, and Legal paper dimensions in either Portrait or Landscape orientation.'
      },
      {
        question: 'Can I preview the PDF layout before downloading?',
        answer: 'Yes. The live PDF preview window renders your formatted document in real-time as you type and adjust typography or margin controls.'
      }
    ]
  },
  {
    id: 'signature-maker',
    title: "Online Signature Maker — Create Digital Signatures Free",
    navTitle: "Signature Maker",
    description: "Create digital signatures online for forms, contracts, and applications. Draw with mouse or touchscreen, type in cursive script fonts, or scan and clean signatures with a transparent background.",
    icon: '✍️',
    path: '/signature-maker.html',
    filename: 'signature-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Smooth Digital Drawing Canvas",
      "Realistic Cursive Typing Fonts",
      "Scan & Upload Signature Cleanup",
      "Transparent PNG & High-Res JPG Export",
      "Auto-Crop Padding",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Choose Signature Mode", desc: "Select Draw to sign with your mouse, finger, or stylus; Type to generate cursive scripts; or Upload to scan an ink signature from paper." },
      { title: "Customize Style & Transparency", desc: "Choose ink color (black, blue, red), stroke width, cursive font style, and toggle auto-crop margins with a transparent background." },
      { title: "Download Digital Signature", desc: "Preview your clean signature on the canvas and download it as a transparent PNG or high-resolution JPG ready for documents and forms." }
    ],
    faq: [
      { question: "Can I draw my signature using a mouse, stylus, or touchscreen?", answer: "Yes. The drawing canvas supports mouse input, touchscreens on phones and tablets, and digital stylus pens with smooth stroke interpolation." },
      { question: "Can I create a typed cursive signature?", answer: "Yes. Switch to Type mode, enter your name, and select from cursive and calligraphy font styles with adjustable ink color and slant." },
      { question: "Can I download my signature with a transparent background?", answer: "Yes. Select the Transparent background option and download as PNG. The exported file has no white background box and can be placed cleanly over document signature lines." },
      { question: "How does paper signature scanning and cleanup work?", answer: "Upload a photo of your signature on paper, then adjust the background threshold slider to isolate the dark ink strokes onto a clean transparent background." },
      { question: "Is my digital signature stored or sent to a server?", answer: "No. The signature is created, smoothed, and exported entirely within your browser memory and is not transmitted to Zubware servers." }
    ]
  },
  {
    id: 'signature-resizer',
    title: "Signature Resizer — Resize Signature Images Online Free",
    navTitle: "Signature Resizer",
    description: "Resize signature images to custom pixel dimensions, millimeter/centimeter measurements, and maximum KB file size limits for online application forms and documents.",
    icon: '📏',
    path: '/signature-resizer.html',
    filename: 'signature-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Exact Pixel, CM, MM & Inch Sizing",
      "Target KB File Size Compression Limit",
      "Auto-Crop Margins & Background Mode",
      "Contrast Enhancement for Darker Ink",
      "JPG, PNG & WebP Output Support",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Upload Signature Image", desc: "Select your digital or scanned signature file (PNG, JPG, or WebP) from your device." },
      { title: "Set Dimensions & KB Limit", desc: "Specify target width and height in pixels, cm, mm, or inches, and optionally enter a maximum file size limit (e.g. 20KB or 50KB)." },
      { title: "Crop Margins & Download", desc: "Enable auto-crop margins to remove excess whitespace around strokes, inspect the output size preview, and download your resized signature." }
    ],
    faq: [
      { question: "How do I resize a signature to meet strict 20KB or 50KB limits?", answer: "Enter your required maximum KB limit in the Max File Size field. The compression engine iteratively scales quality and resolution to keep the exported file under your threshold." },
      { question: "What measurement units are supported for sizing?", answer: "You can specify signature dimensions in pixels (px), centimeters (cm), millimeters (mm), or inches (in)." },
      { question: "Will downscaling blur or distort my signature lines?", answer: "Keeping the aspect ratio locked prevents stretching or warping, and the canvas resampling engine maintains stroke contrast for clean, legible ink lines." },
      { question: "Does this tool guarantee acceptance on specific government portals?", answer: "No tool can guarantee acceptance because individual portals may have varying file name, aspect ratio, or DPI guidelines. This tool formats your image to the dimensions and file size limits you configure." },
      { question: "Is my signature uploaded to an external server for resizing?", answer: "The image is processed locally in your web browser and is not sent to a Zubware server for processing." }
    ]
  },
  {
    id: 'photo-signature-joiner',
    title: "Photo and Signature Joiner — Combine Images Online Free",
    navTitle: "Photo + Signature Joiner",
    description: "Combine passport-style photos and signatures into a single unified image file for job applications, entrance examinations, and verification forms.",
    icon: '🪪',
    path: '/photo-signature-joiner.html',
    filename: 'photo-signature-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Vertical (Stacked) & Side-by-Side Layouts",
      "Custom Dimension Controls",
      "Exam & Application Presets",
      "Borders & Spacing Options",
      "High-Res JPG & PNG Export",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Upload Photo & Signature", desc: "Select your passport-style portrait in slot 1 and your signature image in slot 2." },
      { title: "Adjust Layout & Dimensions", desc: "Choose vertical stacked (photo on top, signature below) or side-by-side layout, and customize width, height, gap spacing, and border margins." },
      { title: "Preview & Download Composite", desc: "Review the live composite image on the canvas and download the joined result in JPG or PNG format." }
    ],
    faq: [
      { question: "Why do entrance exams and job portals require photo and signature combined?", answer: "Many application portals require a single unified image file containing both the candidate photo and signature to simplify verification on admit cards and candidate records." },
      { question: "Can I adjust the gap and border between the photo and signature?", answer: "Yes. You can customize the vertical or horizontal gap between images, set outer border thickness, choose border colors, and set the background fill." },
      { question: "How can I prevent the photo and signature from looking stretched?", answer: "The tool allows you to adjust individual dimensions and provides preset aspect options so both portrait and signature maintain natural proportions without distortion." },
      { question: "Which file format is recommended for online application forms?", answer: "Most application portals recommend JPG/JPEG format with an opaque white background. You can select JPG export before downloading." },
      { question: "Can I combine my photo and signature for government exams without server uploads?", answer: "Yes. Both the identification photo and scanned signature are merged onto a single canvas locally in your browser, keeping sensitive exam documents private." }
    ]
  },
  {
    id: 'photo-name-date-joiner',
    title: "Add Name and Date to Photo Online — Exam Photo Maker",
    navTitle: "Photo Name & Date",
    description: "Add candidate name and date of photo (DOP) or date of birth (DOB) to passport-style photos for entrance exams, recruitment portals, and application forms.",
    icon: '📅',
    path: '/photo-name-date-joiner.html',
    filename: 'photo-name-date-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Custom Candidate Name & Date Formatting",
      "Bottom Strip, Top Strip & Overlay Modes",
      "Recruitment Exam Photo Preparation",
      "High-Resolution Vector Typography",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Upload Passport-Style Photo", desc: "Select your portrait photograph from your computer or mobile device." },
      { title: "Enter Candidate Name & Date", desc: "Type your name, enter the date, select whether to display Date of Photo (DOP) or Date of Birth (DOB), and pick your date format." },
      { title: "Position Strip & Download", desc: "Adjust bottom strip height, font styling, and border settings, preview the formatted image, and download your form photo." }
    ],
    faq: [
      { question: "What is the difference between DOP and DOB on candidate photos?", answer: "DOP stands for Date of Photo (the date the photograph was captured, often requested to be within the last 3 months). DOB stands for Date of Birth." },
      { question: "Which date formats can I choose for the label?", answer: "The tool supports DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, and DD-MMM-YYYY (e.g. 15-OCT-2024) formats." },
      { question: "Does adding the name and date strip crop out the face?", answer: "No. The text strip is positioned at the lower margin. You can adjust the strip height percentage and reposition your photo to ensure facial features remain unobscured." },
      { question: "Can I include a label prefix like \"DOP:\" or \"DOB:\"?", answer: "Yes. You can select prefixes including \"DOP:\", \"DOB:\", \"Date:\", or no prefix to match your application requirements." },
      { question: "Are candidate names and dates added to exam photos without uploading?", answer: "Yes. Typography rendering, name and date stamping, and official exam dimension constraints are applied strictly in local browser memory." }
    ]
  },
  {
    id: 'text-to-handwriting',
    title: "Text to Handwriting Converter — Create Realistic Handwritten Notes",
    navTitle: "Text to Handwriting",
    description: "Convert typed digital text into realistic handwritten notes on lined, plain, or vintage paper. Export high-res PNGs or multi-page PDFs.",
    icon: '🖋️',
    path: '/text-to-handwriting.html',
    filename: 'text-to-handwriting.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Realistic Handwriting Font Styles",
      "Gel Blue, Navy, Black & Red Ink Options",
      "College Ruled Lined, Grid & Plain Paper",
      "Natural Human Baseline Jitter",
      "Multi-Page PDF & PNG Export",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Enter or Paste Text", desc: "Type or paste your notes, assignment text, or letter into the text editor." },
      { title: "Choose Handwriting Style & Paper", desc: "Select from realistic cursive and print fonts, choose ink color (blue, black, red), and pick ruled notebook or plain paper." },
      { title: "Export PNG or Multi-Page PDF", desc: "Adjust letter spacing and baseline jitter for organic handwriting variations, and download page images or a combined PDF." }
    ],
    faq: [
      { question: "Can I download multi-page handwritten notes as a single PDF?", answer: "Yes. The tool automatically paginates longer texts across sequential notebook pages and allows you to download a unified multi-page PDF document." },
      { question: "What makes the handwriting look authentic rather than computer-generated?", answer: "The engine applies subtle natural baseline jitter, organic letter-spacing variations, authentic ink colors, and realistic ruled notebook margin lines." },
      { question: "Which paper styles are available?", answer: "You can choose from college-ruled lined notebook paper, plain blank white paper, yellow legal pad, and graph grid paper." },
      { question: "Can I customize font size and line spacing?", answer: "Yes. You can adjust font size, line spacing, and margin padding to match different notebook sizes and school assignment guidelines." },
      { question: "Is my typed text or assignment uploaded to a server?", answer: "The text and resulting document are rendered locally in your browser and are not sent to a Zubware server for processing." }
    ]
  },
  {
    id: 'omr-sheet-generator',
    title: "OMR Sheet Generator — Create Printable OMR Answer Sheets Free",
    navTitle: "OMR Sheet Generator",
    description: "Generate and print custom OMR answer sheets and answer keys for exams, tests, quizzes, and mock assessments. Download printable A4 PDF and PNG.",
    icon: '🎯',
    path: '/omr-sheet-generator.html',
    filename: 'omr-sheet-generator.html',
    category: '💼 Business Tools',
    badge: 'New',
    features: [
      "Customizable Question Count (20-150)",
      "4 or 5 Options (A-D / A-E)",
      "Roll Number & Set Code Bubble Grids",
      "Blank Sheet & Answer Key Modes",
      "Printable A4 PDF & High-Res PNG Export",
      "Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Set Exam Header & Question Count", desc: "Enter your institution name, exam title, subject, test date, and choose total questions (20 to 150) with 4 or 5 options." },
      { title: "Configure Roll Number & Booklet Code", desc: "Toggle roll number bubble grid (5-10 digits), question booklet set codes (A-D), instructions, and invigilator signature boxes." },
      { title: "Export Blank Sheet or Answer Key", desc: "Switch between blank candidate sheet mode or mark correct answers in Answer Key mode, then download as printable A4 PDF or PNG." }
    ],
    faq: [
      { question: "Can I generate both blank candidate answer sheets and marked answer keys?", answer: "Yes. Use Blank Sheet mode to print clean test sheets for students, or switch to Answer Key mode to click and fill the correct bubbles for scoring reference." },
      { question: "What question counts and bubble choice options are supported?", answer: "You can configure sheets for 20, 50, 100, 120, or 150 questions, with either 4 options (A, B, C, D) or 5 options (A, B, C, D, E) arranged in 1 to 4 clean columns." },
      { question: "Can students bubble their roll number and exam set code?", answer: "Yes. You can enable a roll number bubble grid with 5 to 10 digits and question paper set code options (Set A, B, C, D) for candidate identification." },
      { question: "Can the generated OMR sheet be printed on standard A4 paper?", answer: "Yes. The tool formats the sheet specifically for standard A4 paper dimensions and exports a print-ready vector PDF document or high-resolution PNG image." },
      { question: "Is my test or institute data uploaded to an external server?", answer: "The OMR sheet is generated and rendered directly in your web browser using HTML5 Canvas and client-side PDF libraries, without sending data to Zubware servers." }
    ]
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter — Convert PDF to Editable DOCX Online Free',
    navTitle: 'PDF to Word',
    description: 'Convert PDF documents to editable Microsoft Word (.docx) files directly in your browser with client-side text and layout extraction.',
    icon: '📄',
    path: '/pdf-to-word.html',
    filename: 'pdf-to-word.html',
    category: '📄 PDF Tools',
    badge: 'Popular',
    features: ['Client-Side DOCX Generation', 'Preserves Text & Paragraphs', 'Page Range Selection', 'Local Browser Processing', 'Instant Download'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Drop or select a PDF containing text and paragraphs from your device.' },
      { title: 'Reconstruct Document Structure', desc: 'The client-side engine parses text items, lines, and formatting per page in browser memory.' },
      { title: 'Download DOCX File', desc: 'Download the generated Microsoft Word (.docx) document compatible with Word, Google Docs, and LibreOffice.' }
    ],
    faq: [
      {
        question: 'How does PDF to Word conversion work without uploading?',
        answer: 'Zubware parses text elements directly in browser WebAssembly memory and constructs a valid OpenXML Word document (.docx) package locally.'
      },
      {
        question: 'Can I edit the generated Word file in Microsoft Word and Google Docs?',
        answer: 'Yes! The exported .docx file is compatible with Microsoft Word, LibreOffice, and Google Docs.'
      },
      {
        question: 'Does the converted Word document preserve page breaks?',
        answer: 'Yes. The engine identifies PDF page boundaries and inserts corresponding OpenXML page breaks to maintain the original pagination.'
      },
      {
        question: 'Can scanned PDFs without selectable text be converted?',
        answer: 'This tool is optimized for digital PDFs with embedded text layers. If your PDF is a flat scan or photo of a page, use the Zubware PDF to Text with OCR tool to extract character data first.'
      },
      {
        question: 'How does the converter handle tables and bulleted lists?',
        answer: 'The text extraction engine identifies paragraph breaks and structured text lines, formatting them into editable Word paragraphs that you can style or turn into tables in Word.'
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
    features: ['DOCX to PDF Conversion', 'Standard A4 Page Sizing', 'Custom Margins & Fonts', 'Local Browser Processing', 'Instant Download'],
    howTo: [
      { title: 'Upload Word Document', desc: 'Select a modern .docx Word file from your computer or phone.' },
      { title: 'Configure Layout', desc: 'Review parsed headings, paragraphs, and tables, and choose your preferred paper size and margins.' },
      { title: 'Export PDF', desc: 'Click Download PDF to export a clean vector PDF directly from your browser.' }
    ],
    faq: [
      {
        question: 'Which Word document formats are supported?',
        answer: 'The tool supports standard modern .docx files (Microsoft Word 2007 and newer, Google Docs exports, and LibreOffice Writer files).'
      },
      {
        question: 'Will headings, paragraphs, and bulleted lists be preserved?',
        answer: 'Yes. The browser parser interprets Heading 1, 2, 3 tags, body paragraphs, bullet lists, and tables directly from the OpenXML structure.'
      },
      {
        question: 'Can I adjust margins and paper size for the PDF?',
        answer: 'Yes. You can choose between A4 and US Letter sizes, and configure custom page margins in millimeters.'
      },
      {
        question: 'Does this tool require Microsoft Office to be installed on my computer?',
        answer: 'No. The parser reads and converts the document package entirely inside your web browser without requiring Office or third-party software.'
      },
      {
        question: 'Can I convert documents created in Google Docs or LibreOffice?',
        answer: 'Yes. Export your document as a standard .docx file from Google Docs or LibreOffice Writer, then upload it to this tool for instant vector PDF generation.'
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
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select your PDF file to detect total page count and layout.' },
      { title: 'Select Extraction Mode', desc: 'Choose Digital Text for selectable PDFs or Scanned OCR for image-based documents, and pick your language.' },
      { title: 'Extract and Copy', desc: 'Review the extracted page-by-page text breakdown, copy text to clipboard, or download as a .txt file.' }
    ],
    faq: [
      {
        question: 'What is the difference between Digital Mode and Scanned OCR Mode?',
        answer: 'Digital Mode instantly extracts pre-existing digital text streams from computer-generated PDFs. Scanned OCR Mode uses optical character recognition to read text from scanned documents, photos, and rasterized pages.'
      },
      {
        question: 'Can this read scanned PDFs and photos of documents?',
        answer: 'Yes! Toggle OCR Mode to run client-side Tesseract.js optical character recognition on scanned pages directly in your browser.'
      },
      {
        question: 'What languages are supported in OCR mode?',
        answer: 'OCR mode supports multiple language training sets including English, Spanish, French, German, Italian, Portuguese, and Simplified Chinese.'
      },
      {
        question: 'Can I copy the extracted text or download it as a file?',
        answer: 'Both options are supported: you can copy the full text or individual page text to your clipboard, or click Download TXT to save a clean text file.'
      },
      {
        question: 'Can I extract text from specific pages instead of the whole file?',
        answer: 'In Digital Mode, you can copy text from individual pages using the per-page copy buttons or copy the consolidated text across all pages at once.'
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
    features: ['PDF Table Detection', 'Clean XLSX & CSV Export', 'Live Spreadsheet Preview', 'Local Browser Processing', 'Multi-Page Support'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Select a document containing invoices, bank statements, or data tables.' },
      { title: 'Inspect Detected Table', desc: 'Review aligned columns and rows in the live interactive spreadsheet grid and edit cells if needed.' },
      { title: 'Export to XLSX or CSV', desc: 'Download an Excel (.xlsx) workbook, save as CSV, or copy tab-separated values to clipboard.' }
    ],
    faq: [
      {
        question: 'Does this convert multi-column tables?',
        answer: 'Yes, our extraction engine analyzes spatial coordinate bounding boxes to align columns into spreadsheet rows.'
      },
      {
        question: 'Can I edit table cells before exporting?',
        answer: 'Yes. The interactive spreadsheet viewer allows you to click into cells to correct text, add new rows, or remove unnecessary header rows before downloading.'
      },
      {
        question: 'What spreadsheet formats can I download?',
        answer: 'You can download an authentic Microsoft Excel workbook (.xlsx), a standard CSV file, or copy tab-delimited data directly into your clipboard.'
      },
      {
        question: 'Does it support multi-page tables and financial statements?',
        answer: 'Yes. You can navigate across pages using the page selector and process tabular data from multi-page PDF documents.'
      },
      {
        question: 'Can I add new rows or remove extra rows in the table before exporting?',
        answer: 'Yes. The interactive spreadsheet interface lets you click "+ Add Row" or click the trash icon on any row to clean up headers and footers before saving as XLSX or CSV.'
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
    features: ['Custom Number Formats (e.g. Page X of Y)', '6 Position Placements', 'Skip First Page / Cover', 'Custom Starting Number', 'Local Browser Processing'],
    howTo: [
      { title: 'Upload Your PDF', desc: 'Select your document to preview total page count and size.' },
      { title: 'Configure Numbering Settings', desc: 'Choose number format (e.g. Page X of Y), placement position, starting number, and whether to skip the cover page.' },
      { title: 'Apply and Download', desc: 'Click Add Page Numbers to render the numbering onto every page and download your updated PDF.' }
    ],
    faq: [
      {
        question: 'Can I choose where page numbers appear?',
        answer: 'Yes, place them at bottom-center, bottom-right, bottom-left, top-right, top-center, or top-left.'
      },
      {
        question: 'Which numbering formats can I choose from?',
        answer: 'You can select from Page X of Y, Page X, - X -, or plain numeric digits.'
      },
      {
        question: 'Can I skip numbering on the cover or title page?',
        answer: 'Yes. Toggle Skip First Page / Cover so that your cover page remains unnumbered and numbering begins seamlessly on page 2.'
      },
      {
        question: 'Can I start numbering from a custom number?',
        answer: 'Yes. You can specify a custom starting number offset (such as starting at 10 for a book section or appendix).'
      },
      {
        question: 'Does adding page numbers modify existing document contents?',
        answer: 'No. Page numbers are drawn neatly into the margins without altering or compressing the existing document text or images.'
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
    features: ['Side-by-Side Comparison', 'Color-Coded Additions & Deletions', 'Similarity Percentage Score', 'Page Text Extraction', 'Client-Side Processing'],
    howTo: [
      { title: 'Upload Both PDF Files', desc: 'Upload the original document as Document A and the revised document as Document B.' },
      { title: 'Run Text Comparison', desc: 'The tool extracts text streams and computes word-level differences between the two files.' },
      { title: 'Review Highlighted Differences', desc: 'Inspect additions in green, deletions in red, and check the overall Similarity Score percentage.' }
    ],
    faq: [
      {
        question: 'How are differences shown?',
        answer: 'Additions are highlighted in green, deletions in red, and identical text in neutral gray.'
      },
      {
        question: 'What does the Similarity Percentage Score mean?',
        answer: 'The Similarity Score reflects the percentage of matching words across both documents, giving an objective index of how much the text has changed.'
      },
      {
        question: 'Can I compare multi-page contracts and reports?',
        answer: 'Yes. The comparison engine extracts text across all pages in both documents and aligns them sequentially for detailed review.'
      },
      {
        question: 'Can this tool compare scanned documents?',
        answer: 'The comparison engine operates on text layers. If your PDFs are scans without digital text, run them through Zubware PDF to Text with OCR first.'
      },
      {
        question: 'Can I export or save the comparison report?',
        answer: 'Yes. Click "Download Diff Report" to save a clean text file showing all additions, deletions, and the overall similarity score.'
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
    features: ['Draw, Type, or Upload Signature', 'Interactive Drag & Resize Placement', 'Multi-Page Selection', 'High Quality Vector Embedding', 'Client-Side Processing'],
    howTo: [
      { title: 'Upload PDF Document', desc: 'Select the file and navigate to the page where your signature is required.' },
      { title: 'Create Your Signature', desc: 'Draw your signature on the drawing pad, type your name in cursive typography, or upload a signature image stamp.' },
      { title: 'Position and Sign', desc: 'Adjust position and scale sliders to place your signature accurately on the page, then click Sign & Download.' }
    ],
    faq: [
      {
        question: 'Are my signatures legally valid?',
        answer: 'Electronic signatures placed on PDFs are widely used and accepted for informal agreements, commercial invoices, timesheets, and internal sign-offs.'
      },
      {
        question: 'Can I draw, type, or upload a signature image?',
        answer: 'Yes. You can draw your signature with a mouse or touch stylus, type your name using a cursive font, or upload a transparent PNG signature stamp.'
      },
      {
        question: 'Can I choose which page to place my signature on?',
        answer: 'Yes. Use the page selector to navigate directly to the specific page that needs your signature.'
      },
      {
        question: 'Can I reposition and resize the signature on the page?',
        answer: 'Yes. Use the horizontal and vertical position sliders as well as the signature scale slider to fit your signature precisely onto the signature line.'
      },
      {
        question: 'Are signature drawings or documents stored on any server?',
        answer: 'Files are processed in your browser and are not sent to a Zubware server for processing. Your signature is rendered directly into the PDF in browser memory.'
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
    howTo: [
      { title: "Select Barcode Standard", desc: "Choose Code 128, EAN-13, UPC-A, Code 39, ITF-14, or Pharmacode." },
      { title: "Enter Data & Configure Dimensions", desc: "Input your numeric or alphanumeric SKU code, adjust bar height and width, and toggle text label display." },
      { title: "Download High-Res Barcode Image", desc: "Preview the rendered barcode and click Download as crisp SVG, PNG, or print-ready PDF." }
    ],
    faq: [
      { question: "Which barcode formats are supported by this generator?", answer: "The generator supports Code 128 (general inventory and shipping), EAN-13 (international retail products), UPC-A (North American retail), Code 39, ITF-14, and MSI Plessey." },
      { question: "How does the tool validate EAN-13 and UPC-A check digits?", answer: "It automatically computes and verifies the modulo-10 checksum digit required by GS1 standards, preventing invalid retail barcodes." },
      { question: "Can I download vector barcodes for high-DPI packaging printing?", answer: "Yes. Exporting in SVG vector format ensures razor-sharp bar edges at any scale without raster blur or scan degradation." },
      { question: "Can I hide the human-readable text below the bars?", answer: "Yes. You can toggle the text label on or off and customize font size and text positioning." },
      { question: "Is barcode data transmitted to an external server?", answer: "No. Barcode encoding and canvas/SVG rendering execute locally in your web browser." }
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
    features: ['8+ Case Formats', 'One-Click Conversion', 'Live Character Counter', 'Instant Copy & Download', 'Local Browser Processing'],
    howTo: [
      { title: "Paste or Type Text", desc: "Enter your raw text into the input editor or paste paragraphs directly from your clipboard." },
      { title: "Select Desired Case Transformation", desc: "Click UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or aLtErNaTiNg cAsE." },
      { title: "Copy or Download Transformed Text", desc: "Review the instant conversion in the output pane and click Copy to clipboard or download as a .txt file." }
    ],
    faq: [
      { question: "How does the Title Case transformation handle minor words and prepositions?", answer: "The title-casing algorithm capitalizes major words while respecting standard stylistic conventions for short conjunctions and prepositions unless they appear at the start of a sentence." },
      { question: "What is the difference between camelCase, PascalCase, and kebab-case?", answer: "camelCase starts with a lowercase letter and capitalizes subsequent word initials without delimiters. PascalCase capitalizes all word initials including the first. kebab-case joins all lowercase tokens with hyphens, ideal for URLs and CSS classes." },
      { question: "Does Case Converter support accented and Unicode characters?", answer: "Yes. Transformation methods use standard Unicode-aware JavaScript string manipulation functions, correctly casing characters like é, ñ, and ü." },
      { question: "Is there a character limit when converting text cases?", answer: "No practical limit exists. Processing takes place locally in browser memory, easily converting large documents containing tens of thousands of words in milliseconds." },
      { question: "Is my text saved or uploaded to an external server?", answer: "No. The casing logic operates strictly within your local browser runtime. No text data is transmitted over the network." }
    ]
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
    features: ['Real-Time Word & Char Count', 'Reading & Speaking Duration', 'Flesch Readability Score', 'Sentence & Paragraph Stats', 'Instant Copy'],
    howTo: [
      { title: "Enter or Paste Document Content", desc: "Type directly into the text editor or paste articles, essays, and manuscripts." },
      { title: "Inspect Real-Time Statistics", desc: "View live tallies for total words, characters with/without spaces, sentences, paragraphs, and reading/speaking duration estimates." },
      { title: "Review Keyword Density & Copy Stats", desc: "Check the top repeated keywords and frequency breakdown, then copy the metrics summary to your clipboard." }
    ],
    faq: [
      { question: "How does the tool calculate reading time and speaking duration?", answer: "Reading time is calculated using an average silent reading speed of 200 words per minute (WPM), while speaking duration is estimated at 130 WPM, typical for public presentations." },
      { question: "How are hyphenated words and contractions counted?", answer: "Contractions such as 'don't' count as single lexical words. Hyphenated compounds like 'well-known' are evaluated as one word unless broken across whitespace." },
      { question: "Does the word counter detect sentence and paragraph boundaries accurately?", answer: "Yes. Sentences are parsed by punctuation markers (. ! ?) followed by whitespace or quotes, and paragraphs are detected via distinct newline delimiters." },
      { question: "What does the keyword density analysis show?", answer: "It filters out common grammatical stop words (the, is, and) to reveal your most frequently repeated substantive keywords and their percentage frequency." },
      { question: "Is my pasted document content private?", answer: "Yes. All word frequency counting and readability metric calculations execute entirely client-side inside your browser." }
    ]
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
    features: ['Detailed Character Breakdown', 'With & Without Spaces', 'Alphanumeric Ratio', 'Copy & Reset', 'Client-Side Processing'],
    howTo: [
      { title: "Input Text Content", desc: "Paste your text or type directly into the counter input box." },
      { title: "Analyze Character Metrics", desc: "Inspect counts for total characters, characters excluding spaces, vowels, consonants, numbers, symbols, and whitespace." },
      { title: "Check Social Platform Limits", desc: "Compare your current character count against platform presets like Twitter/X (280), SMS (160), and meta descriptions (160)." }
    ],
    faq: [
      { question: "Why is tracking characters without spaces important?", answer: "Many academic submissions, translation rate quotes, and publishing guidelines charge or evaluate length strictly based on non-whitespace glyphs." },
      { question: "How does this tool handle multi-byte Unicode characters and emojis?", answer: "The counter accurately parses Unicode code points and emoji sequences so composite glyphs do not trigger misleading double counts." },
      { question: "Does the character counter support live typing updates?", answer: "Yes. Event listeners evaluate state on every keystroke, keeping metrics instantly synchronized without needing to click a calculate button." },
      { question: "Can I use this tool to verify social media character limits?", answer: "Yes. Pre-configured indicator bars show your remaining character headroom for Twitter/X posts, Instagram bios, LinkedIn summaries, and SMS messaging limits." },
      { question: "Does the tool retain or store pasted text?", answer: "No. Input text remains solely in component state in your active browser session and disappears upon page reload." }
    ]
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
    features: ['Custom Words-Per-Minute Slider', 'Silent Reading & Speaking Estimates', 'Fast / Average / Slow Speed Tiers', 'File Upload Support', 'Live Word Count'],
    howTo: [
      { title: "Paste or Type Text Manuscript", desc: "Enter or paste your article, speech, essay, or blog post into the text editor, or upload a text file." },
      { title: "Adjust Words-Per-Minute (WPM) Speed", desc: "Use the slider to customize reading speed (default 200 WPM) or review presets for speed readers and speaking presentations." },
      { title: "Review Reading & Speaking Duration", desc: "Inspect total word count, character count, estimated silent reading time, and estimated oral presentation speaking time." }
    ],
    faq: [
      { question: "What reading speed (WPM) is standard for online articles and blog posts?", answer: "The standard average silent reading speed for adults is approximately 200 to 250 words per minute (WPM). Zubware defaults to 200 WPM to provide a conservative, accessible reading time estimate." },
      { question: "How does speech presentation time differ from silent reading time?", answer: "Speaking aloud is significantly slower than reading silently. Speech delivery typically ranges between 130 and 150 WPM to maintain clear articulation, audience pacing, and emphasis." },
      { question: "How is reading time calculated for articles that take less than a minute?", answer: "The calculator breaks down duration into exact minutes and seconds (e.g. '0 min 45 sec') rather than rounding small snippets up to a full minute." },
      { question: "Does the calculator count words accurately across punctuation and line breaks?", answer: "Yes. The text parser splits on whitespace and cleans punctuation marks to count distinct lexical words accurately." },
      { question: "Is my pasted article or speech text uploaded to an external server?", answer: "No. Text parsing, word counting, and reading speed calculations occur locally in your web browser memory." }
    ]
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
    features: ['Case-Sensitive / Insensitive', 'Trim Whitespace Option', 'Duplicate Removal Stats', 'Export Cleaned File', 'Instant Copy'],
    howTo: [
      { title: "Paste Multi-Line List", desc: "Enter your raw list of URLs, emails, product SKUs, or text items into the input field." },
      { title: "Configure Deduplication Options", desc: "Toggle Case Sensitive matching, Trim Whitespace, and Preserve Original Order depending on your list requirements." },
      { title: "Copy Clean Deduplicated Output", desc: "Review the unique lines count and reduction percentage, then click Copy or download the sanitized list." }
    ],
    faq: [
      { question: "Does deduplication preserve the original order of list items?", answer: "Yes. By default, the tool retains the first occurrence of each unique item in its original sequence while discarding subsequent duplicates." },
      { question: "How does the Case Sensitive toggle affect duplicate removal?", answer: "When enabled, 'Item' and 'item' are treated as two distinct unique lines. When disabled, case differences are normalized so only one instance remains." },
      { question: "Can leading and trailing spaces cause false duplicate mismatches?", answer: "Enabling the 'Trim Whitespace' option strips invisible leading or trailing spaces before comparison, ensuring clean matches across formatted lists." },
      { question: "Can this tool handle lists with thousands of entries?", answer: "Yes. Using a high-performance JavaScript Set data structure, lists with tens of thousands of rows are deduplicated in fractions of a second." },
      { question: "Is any list data sent to Zubware servers?", answer: "No. Array filtering and Set lookups are computed in your browser without any network requests." }
    ]
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
    features: ['Strip All Blank Lines', 'Collapse Multiple Blanks to Single', 'Trim Whitespace Option', 'Instant Copy', 'Local Browser Processing'],
    howTo: [
      { title: "Paste Raw Text with Blank Lines", desc: "Input or paste your document, code snippet, or dataset containing unwanted empty rows." },
      { title: "Select Line Removal Mode", desc: "Choose whether to remove all blank lines completely, or collapse multiple consecutive empty lines into a single clean line break." },
      { title: "Copy Cleaned Result", desc: "Inspect the sanitized output in the preview window and click Copy to clipboard." }
    ],
    faq: [
      { question: "Does the tool remove lines that only contain spaces or tabs?", answer: "Yes. The regex engine detects lines containing only whitespace (spaces, tabs, carriage returns) and removes them alongside completely empty lines." },
      { question: "What is the difference between Remove All and Collapse Blank Lines?", answer: "Remove All eliminates every empty line to produce a continuous compact block. Collapse Blank Lines condenses 2 or more consecutive blank lines down to 1 single blank separator line." },
      { question: "Can I use this on programming source code without breaking indentation?", answer: "Yes. Code indentation on non-empty lines is completely preserved; only entirely blank or whitespace-only lines are eliminated." },
      { question: "Does this utility handle Windows (CRLF) and Unix (LF) line endings?", answer: "Yes. The parser normalizes CRLF and LF delimiters before stripping empty rows, outputting consistent clean line breaks." },
      { question: "Is my text data processed securely in the browser?", answer: "Yes. String manipulation is executed locally in client-side memory with zero server-side storage or transmission." }
    ]
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
    features: ['Exact Match & Regular Expressions', 'Case Sensitivity Toggle', 'Live Match Counter', 'Undo / Reset History', 'Download Output'],
    howTo: [
      { title: "Input Source Text", desc: "Paste the document or paragraph you want to modify into the main text area." },
      { title: "Set Search and Replacement Terms", desc: "Type the target string or regular expression in Find, specify the new text in Replace, and toggle Match Case or Whole Word." },
      { title: "Execute & Copy Updated Text", desc: "Click Replace All to see highlighted match counts and instant substitutions, then copy the result." }
    ],
    faq: [
      { question: "Does the tool support regular expression (RegEx) search patterns?", answer: "Yes. Check the 'Use RegEx' toggle to search using regular expressions, character classes, lookaheads, and capture groups." },
      { question: "How do capture groups work in the replacement field?", answer: "When RegEx mode is active, you can reference captured subpatterns using $1, $2, etc., in your replacement text for advanced reformatting." },
      { question: "What does the Whole Word matching option do?", answer: "Whole Word prevents partial matches inside larger words (e.g. searching for 'cat' will not alter 'caterpillar' or 'scatter')." },
      { question: "How many replacements can be executed simultaneously?", answer: "The global replacement handles thousands of matches instantly across lengthy documents without crashing or lagging." },
      { question: "Are my sensitive search strings uploaded anywhere?", answer: "No. All search, match, and replace operations run locally in your browser memory." }
    ]
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
    features: ['Character & Line Diff', 'Color-Coded Highlights', 'Difference Counter', 'Swap Text Panels', 'Local Browser Processing'],
    howTo: [
      { title: "Paste Original and Modified Texts", desc: "Enter your base text into the left pane and the updated version into the right pane." },
      { title: "Choose Diff Comparison Mode", desc: "Select Line-by-Line, Word-by-Word, or Character-level diff comparison and toggle whitespace ignore options." },
      { title: "Inspect Visual Highlight Differences", desc: "Review added lines (green) and removed lines (red) side-by-side or in inline unified view." }
    ],
    faq: [
      { question: "Which diff algorithm is used to calculate differences?", answer: "The tool utilizes Myers' diff algorithm to compute the shortest edit script between original and modified strings." },
      { question: "Can I view differences inline as well as side-by-side?", answer: "Yes. You can switch between split side-by-side view (ideal for wide screens) and unified inline view (ideal for compact review)." },
      { question: "Can the comparison ignore indentation and trailing whitespace?", answer: "Yes. Toggle 'Ignore Whitespace' to prevent formatting differences from highlighting as content changes." },
      { question: "Is this suitable for comparing source code and configuration files?", answer: "Yes. Developers frequently use it to diff JSON schemas, YAML configs, markdown drafts, and source code files." },
      { question: "Is my compared text sent to any cloud server?", answer: "No. The diff engine is executed entirely within your browser runtime, ensuring confidentiality." }
    ]
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
    features: ['Strip HTML & XML Tags', 'Remove Extra Spaces & Tabs', 'Remove Duplicate Lines', 'Normalize Line Breaks', 'One-Click Clean'],
    howTo: [
      { title: "Paste Dirty or Scraped Text", desc: "Input unformatted text copied from PDFs, websites, or legacy text files." },
      { title: "Select Cleaning Rules", desc: "Check desired cleanup filters: Strip HTML tags, remove emojis, decode HTML entities, normalize smart quotes, or strip extra spaces." },
      { title: "Copy Sanitized Plain Text", desc: "Review the cleaned output in the preview panel and copy it with a single click." }
    ],
    faq: [
      { question: "Does the cleaner remove HTML tags without destroying tag content?", answer: "Yes. It strips HTML tags (such as <div>, <p>, <span>) while retaining the inner readable text content cleanly." },
      { question: "What does smart quote normalization do?", answer: "It replaces curly quotes (“ ” ‘ ’) and em-dashes with standard ASCII straight quotes (\" ') and hyphens, preventing syntax errors in code and databases." },
      { question: "Can this tool strip non-ASCII characters and emojis?", answer: "Yes. You can toggle emoji removal and non-ASCII character stripping to prepare pure plain text for strict legacy systems." },
      { question: "How does it handle mixed line breaks from copied PDF text?", answer: "It unifies carriage returns and joins soft hyphenated line wraps into smooth, readable continuous paragraphs." },
      { question: "Is my cleaned text stored in any cloud database?", answer: "No. All text scrubbing regexes run client-side in browser memory." }
    ]
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
    features: ['A-Z & Z-A Alphabetical', 'Numeric 0-9 Ascending & Descending', 'Sort by Line Length', 'Random Shuffle & Reverse', 'Remove Duplicate Lines'],
    howTo: [
      { title: "Paste Unsorted Lines", desc: "Enter your list of names, numbers, keywords, or filenames into the editor." },
      { title: "Select Sorting Criteria", desc: "Choose Alphabetical (A-Z or Z-A), Natural Numeric sorting, Line Length, or Random Shuffle, and toggle case sensitivity." },
      { title: "Copy or Export Sorted List", desc: "Review the reordered list and click Copy to clipboard or download as text." }
    ],
    faq: [
      { question: "What is Natural Numeric sorting?", answer: "Natural sorting treats multi-digit numbers intelligently so that 'item 2' appears before 'item 10', unlike standard ASCII sorting which places '10' before '2'." },
      { question: "Can I sort lines by character length?", answer: "Yes. You can sort from shortest line to longest line, or descending from longest to shortest, useful for domain naming and keyword research." },
      { question: "Can I shuffle lines randomly?", answer: "Yes. The Shuffle option uses the Fisher-Yates randomization algorithm to randomize row order for giveaways or randomized test lists." },
      { question: "Does the sorter preserve leading numbers and formatting?", answer: "Yes. Text on each line remains unaltered; only the sequence of the rows is reorganized." },
      { question: "Is the sorting performed locally on my computer?", answer: "Yes. Array sorting executes in your local JavaScript runtime without external server communication." }
    ]
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
    features: ['Paragraphs, Sentences, or Words', 'Start with "Lorem Ipsum" Toggle', 'One-Click Copy', 'Download as .txt', 'Fast & Lightweight'],
    howTo: [
      { title: "Choose Output Unit & Quantity", desc: "Select whether to generate Paragraphs, Sentences, Words, or List Items, and enter your desired quantity." },
      { title: "Configure Generation Options", desc: "Toggle whether to start with standard 'Lorem ipsum dolor sit amet...' and whether to wrap output in HTML <p> tags." },
      { title: "Copy Generated Placeholder Text", desc: "Click Generate, review the dummy text, and click Copy to clipboard for immediate use in mockups and wireframes." }
    ],
    faq: [
      { question: "Where does traditional Lorem Ipsum text originate?", answer: "It derives from sections of Cicero's 45 BC philosophical treatise 'De finibus bonorum et malorum', randomized to simulate natural reading cadence." },
      { question: "Can I wrap generated dummy text in HTML markup?", answer: "Yes. Check the 'HTML Tags' option to automatically wrap paragraphs in <p>...</p> tags or generate ready-to-use <ul><li>...</li></ul> lists." },
      { question: "Why use placeholder dummy text instead of real copy?", answer: "Dummy text prevents visual designers, clients, and reviewers from getting distracted by readable copy, keeping focus on layout, typography, and hierarchy." },
      { question: "Can I generate specific word counts for tight layout mockups?", answer: "Yes. Select 'Words' mode and set your exact word count threshold to test tight button labels, card snippets, or metadata fields." },
      { question: "Does the generator require an active internet connection?", answer: "No. The Latin vocabulary dictionary is stored locally in the application bundle, allowing instant offline text generation." }
    ]
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
    features: ['Side-by-Side Live Preview', 'Formatting Toolbar Shortcuts', 'Table & Code Block Support', 'Export as .md, .html, or .txt', 'Client-Side Processing'],
    howTo: [
      { title: "Write or Paste Markdown", desc: "Type markdown syntax in the left editor or use formatting toolbar shortcuts for headings, lists, bold, and code blocks." },
      { title: "Preview Formatted Output Live", desc: "Inspect real-time HTML rendering in the right preview pane with synchronized scroll and syntax highlighting." },
      { title: "Export as MD, HTML, or PDF", desc: "Copy the rendered HTML or raw Markdown, or click Download to save a formatted .html or .md file." }
    ],
    faq: [
      { question: "Which Markdown specifications are supported?", answer: "The editor supports CommonMark and GitHub Flavored Markdown (GFM), including tables, strikethrough, task lists, and fenced code blocks." },
      { question: "Can I export the rendered preview as standalone HTML?", answer: "Yes. You can copy the generated raw HTML markup or export a complete self-contained HTML document with default styling." },
      { question: "Does the editor include syntax shortcuts?", answer: "Yes. The top toolbar provides single-click insertion for H1-H3 headings, bold, italics, links, blockquotes, code snippets, and data tables." },
      { question: "Is my document saved automatically?", answer: "The editor saves active document drafts to browser localStorage, so your work persists across tab refreshes." },
      { question: "Are my private notes and drafts transmitted to a server?", answer: "No. Parsing and rendering are performed entirely client-side using JavaScript parser libraries." }
    ]
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
    features: ['Whitespace & Indent Stripping', 'Compression Ratio Calculator', 'Syntax Error Highlighting', 'File Upload & Drag-and-Drop', 'Instant Copy'],
    howTo: [
      { title: "Paste Formatted JSON", desc: "Input indented or multi-line JSON into the compression editor." },
      { title: "Minify JSON & Strip Whitespace", desc: "Click Minify to remove all unnecessary whitespace, tabs, and line breaks while preserving string literals." },
      { title: "Copy Compact Payload & View Size Savings", desc: "Inspect the file size reduction percentage and click Copy to grab the minified single-line JSON string." }
    ],
    faq: [
      { question: "How does JSON minification reduce file size?", answer: "It removes all formatting spaces, indents, and newline characters between syntax tokens, typically reducing JSON payload size by 20% to 45% for faster network transit." },
      { question: "Does minifying JSON alter data or string contents?", answer: "No. Spaces and line breaks located inside string values (e.g. \"message\": \"hello world\") are strictly preserved; only structural whitespace is stripped." },
      { question: "Does the minifier validate JSON syntax before compressing?", answer: "Yes. It runs a full JSON syntax verification pass; if invalid syntax is found, it alerts you to the error location before minifying." },
      { question: "Can I copy the minified string or download a .min.json file?", answer: "Yes. You can copy the single-line string with one click or download a production-ready .min.json file." },
      { question: "Is my JSON processed privately?", answer: "Yes. Minification executes entirely client-side using native JSON serialization." }
    ]
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
    features: ['Custom Root & Item Tag Names', 'Beautified XML Output', 'Attributes Support', 'Download as .xml', 'Client-Side Processing'],
    howTo: [
      { title: "Paste Valid JSON", desc: "Enter a JSON object or array of records into the input pane." },
      { title: "Configure Root Tag & Attribute Rules", desc: "Specify your custom root wrapper element name (e.g. <root> or <response>) and choose element vs attribute mapping." },
      { title: "Copy or Download Clean XML", desc: "Review the formatted XML output with proper tag hierarchy and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does the tool handle JSON arrays when converting to XML?", answer: "Array elements are mapped into repeated child elements wrapped under the parent tag (e.g. a 'users' array produces multiple sequential <user> tags)." },
      { question: "Can I define a custom root element name?", answer: "Yes. You can specify any valid XML tag name for the document root element (defaulting to <root>)." },
      { question: "How are special characters in JSON strings escaped in XML?", answer: "Characters like <, >, &, and quotes inside JSON strings are automatically escaped into compliant XML entities (&lt;, &gt;, &amp;)." },
      { question: "Can I download the resulting XML as a file?", answer: "Yes. You can copy the text or download a clean .xml document directly to your device." },
      { question: "Is my data sent to an external server?", answer: "No. All conversion logic runs client-side in browser memory with zero server access." }
    ]
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
    features: ['Preserves Hierarchy & Attributes', 'Formatted 2-Space JSON', 'Syntax Error Detection', 'Download as .json', 'Instant Copy'],
    howTo: [
      { title: "Paste Raw XML Document", desc: "Input your XML document, RSS feed, or SOAP response into the editor." },
      { title: "Configure Parsing Rules", desc: "Choose whether to prefix attributes with '@' or '_', collapse single-child arrays, and normalize text nodes." },
      { title: "Copy or Download Formatted JSON", desc: "Review the converted JSON tree with syntax color-coding and click Copy or download as a .json file." }
    ],
    faq: [
      { question: "How does the converter translate XML attributes into JSON?", answer: "Attributes are mapped to prefixed object properties (e.g. '@id' or '_id') inside the parent element, keeping attributes cleanly distinguished from child tags." },
      { question: "Can it convert XML repeating tags into JSON arrays?", answer: "Yes. Repeating sibling elements with the same tag name are automatically parsed into cohesive JSON arrays." },
      { question: "Does the tool handle XML CDATA sections?", answer: "Yes. CDATA text blocks are extracted and preserved as raw string values without entity corruption." },
      { question: "Can I convert large XML datasets?", answer: "Yes. Using the browser's native DOMParser, multi-megabyte XML files parse rapidly in client memory." },
      { question: "Is XML data transmitted to an external server?", answer: "No. Conversion runs locally in your browser session with complete data confidentiality." }
    ]
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
    features: ['Headers, Lists, Tables & Code', 'Full Document or Snippet Mode', 'Live Visual HTML Preview', 'Copy HTML Code', 'Export as .html'],
    howTo: [
      { title: "Paste or Write Markdown", desc: "Enter markdown text into the left pane or use formatting buttons for tables, code blocks, and headers." },
      { title: "Configure HTML Generation Options", desc: "Toggle GitHub Flavored Markdown (GFM), task lists, table generation, and standalone HTML document wrapper." },
      { title: "Copy Rendered HTML Markup", desc: "Review the live formatted preview and click Copy HTML to paste into your CMS, blog, or website." }
    ],
    faq: [
      { question: "Which Markdown flavor is supported by this converter?", answer: "It supports standard CommonMark and GitHub Flavored Markdown (GFM), including data tables, task checkboxes, strikethrough, and fenced code blocks with language tags." },
      { question: "Can I generate a complete standalone HTML document?", answer: "Yes. Check 'Standalone Document' to wrap the output in full <!DOCTYPE html><html><head><meta charset='UTF-8'></head><body> boilerplate." },
      { question: "How are code blocks formatted in the HTML output?", answer: "Code blocks are wrapped in semantic <pre><code class=\"language-*\"></pre> tags ready for highlight.js or Prism syntax highlighters." },
      { question: "Does the converter sanitize raw HTML for safety?", answer: "Yes. An optional sanitization toggle neutralizes dangerous <script> tags and malicious inline event handlers to prevent XSS." },
      { question: "Is parsing performed locally on my device?", answer: "Yes. Markdown tokenization and HTML rendering execute entirely in browser memory." }
    ]
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
    features: ['Uppercase SQL Keywords', '2 or 4 Space Indentation', 'Multi-Dialect Support', 'Minify & Beautify Modes', 'Instant Copy'],
    howTo: [
      { title: "Paste Unformatted SQL Query", desc: "Input minified, messy, or single-line SQL queries into the editor." },
      { title: "Select SQL Dialect & Indentation", desc: "Choose standard SQL, PostgreSQL, MySQL, SQLite, Oracle, or SQL Server, and select 2-space, 4-space, or tab indents." },
      { title: "Format, Beautify & Copy Query", desc: "Click Format SQL to align clauses (SELECT, FROM, WHERE, JOIN) and uppercase keywords, then click Copy to clipboard." }
    ],
    faq: [
      { question: "Which SQL dialects are supported by the formatter?", answer: "It supports Standard ANSI SQL, PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server (T-SQL), and Oracle PL/SQL." },
      { question: "Can the formatter convert SQL keywords to uppercase automatically?", answer: "Yes. It normalizes all SQL keywords (SELECT, FROM, WHERE, GROUP BY, ORDER BY, INNER JOIN) to consistent uppercase for readability." },
      { question: "How does it handle complex nested subqueries and CTEs?", answer: "Common Table Expressions (WITH clauses) and nested subqueries are indented with hierarchical padding and aligned parentheses." },
      { question: "Can I format multi-statement database migration scripts?", answer: "Yes. The formatter detects semicolon statement delimiters and formats multiple sequential queries with clean vertical separation." },
      { question: "Are my database queries and table schemas logged on a server?", answer: "No. All SQL parsing and token formatting execute client-side in browser memory." }
    ]
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
    features: ['HS256, HS384, HS512 HMAC Signing', 'Custom Header & Payload Claims', 'Quick Expiry Presets', 'Color-Coded Token Inspection', 'Client-Side Processing'],
    howTo: [
      { title: "Define JWT Payload Claims", desc: "Input claims JSON (e.g. sub, name, role, iat, exp) or use guided fields to set user ID and expiration duration." },
      { title: "Select Signing Algorithm & Enter Secret Key", desc: "Choose HS256, HS384, or HS512 and input your private HMAC secret signing key." },
      { title: "Generate & Copy Signed JWT Token", desc: "Click Generate Token to calculate the cryptographic HMAC signature and copy the three-part JWT token." }
    ],
    faq: [
      { question: "How are JWT tokens cryptographically signed in this tool?", answer: "Signatures are computed locally using the browser's native Web Crypto API (SubtleCrypto.sign) with HMAC SHA-256/384/512 algorithms." },
      { question: "Can I set custom token expiration times?", answer: "Yes. You can specify token expiration in minutes, hours, or days; the tool automatically calculates and sets the Unix exp timestamp." },
      { question: "Can I generate tokens for testing authentication in local development?", answer: "Yes. It is designed for developers building mock APIs, testing frontend OAuth/OIDC flows, and debugging microservice authentication." },
      { question: "Is it safe to enter real secret keys into this tool?", answer: "All cryptographic HMAC signing runs locally in your browser memory without network calls. However, best practice is to use development secrets for testing." },
      { question: "Does the generator validate JSON payload syntax before signing?", answer: "Yes. The payload editor validates JSON syntax in real time, preventing invalid claim structures." }
    ]
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
    features: ['Plain English Explanation', 'Interactive Field Builders', 'Popular Schedule Presets', 'Next 5 Scheduled Runs', 'Instant Copy'],
    howTo: [
      { title: "Select Schedule Frequency", desc: "Choose Minutes, Hourly, Daily, Weekly, Monthly, or Custom cron intervals via visual dropdowns." },
      { title: "Configure Specific Times & Days", desc: "Select execution minutes, hours of the day, weekdays (Mon-Fri), or days of the month." },
      { title: "Copy 5-Part Cron String & Inspect Next Runs", desc: "Review the standard 5-part cron expression (e.g. 0 9 * * 1-5), read the plain-English translation, and copy the string." }
    ],
    faq: [
      { question: "What do the 5 fields of a standard cron expression represent?", answer: "The 5 fields correspond to: 1) Minute (0-59), 2) Hour (0-23), 3) Day of Month (1-31), 4) Month (1-12 or JAN-DEC), and 5) Day of Week (0-6 or SUN-SAT)." },
      { question: "Does the tool provide human-readable English explanations?", answer: "Yes. It translates any cron expression into clear English (e.g. 'At 09:00 AM, Monday through Friday') using standard cron-strue parsing." },
      { question: "Can I view upcoming scheduled execution timestamps?", answer: "Yes. The preview calculates and displays the next 5 upcoming scheduled execution dates and times in your local time zone." },
      { question: "Can I paste an existing cron expression to reverse-engineer it?", answer: "Yes. Paste any valid 5-part cron string into the expression bar to populate the visual controls and view its schedule." },
      { question: "Does this generator execute offline?", answer: "Yes. Cron calculation and natural language translation operate completely in your web browser." }
    ]
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
    features: ['Random Hex Generator', 'Color Shades & Tints', 'Color Harmonies', 'RGB & HSL Conversion', 'Instant CSS Copy'],
    howTo: [
      { title: "Generate Random HEX Color", desc: "Click Generate or press Spacebar to produce a fresh random 6-character hexadecimal color code." },
      { title: "Inspect Shades, Tints & Contrast", desc: "Review the monochromatic shade ramp from dark to light and check text legibility against white and black backgrounds." },
      { title: "Copy #HEX Code", desc: "Click the HEX code card to copy formatted values (#RRGGBB) to your clipboard for CSS and HTML templates." }
    ],
    faq: [
      { question: "What does a 6-digit HEX color code represent?", answer: "A HEX color code (#RRGGBB) specifies red, green, and blue light intensity using hexadecimal values from 00 (0) to FF (255) for each color channel." },
      { question: "Does this tool generate 8-digit HEX codes with alpha transparency?", answer: "Yes. You can toggle the opacity slider to generate 8-digit HEX codes (#RRGGBBAA) that include alpha channel transparency." },
      { question: "Can I view contrasting text colors for the generated HEX code?", answer: "Yes. The preview automatically calculates whether dark or light text provides optimal WCAG contrast over the generated color." },
      { question: "Can I generate a palette of related HEX shades?", answer: "Yes. Every generated color automatically displays a coordinated spectrum of 10 lighter tints and 10 darker shades." },
      { question: "Does generation happen offline in the browser?", answer: "Yes. Color calculations run locally in your browser without network communication." }
    ]
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
    features: ['Red, Green, Blue Sliders', 'Hex & HSL Conversion', 'Complementary Colors', 'Preset Color Swatches', 'One-Click Copy'],
    howTo: [
      { title: "Adjust Red, Green & Blue Sliders", desc: "Slide R, G, and B channel controls from 0 to 255 to mix your exact target color." },
      { title: "Set Alpha Opacity Channel", desc: "Use the alpha slider from 0.0 (fully transparent) to 1.0 (fully opaque) for RGBA translucency." },
      { title: "Copy CSS rgb() or rgba() Syntax", desc: "Inspect live color feedback and click Copy to grab the formatted CSS rule." }
    ],
    faq: [
      { question: "What is the difference between RGB and RGBA?", answer: "RGB defines solid colors using Red, Green, and Blue values (0 to 255). RGBA adds a fourth Alpha parameter (0.0 to 1.0) defining transparency level." },
      { question: "Can I convert between RGB sliders and HEX values simultaneously?", answer: "Yes. Adjusting any RGB slider updates the synchronized HEX, HSL, and HSV conversion readouts in real time." },
      { question: "What RGB values produce pure white and pure black?", answer: "rgb(0, 0, 0) produces pure black (no light emitted), while rgb(255, 255, 255) produces pure white (maximum intensity across all three channels)." },
      { question: "Does the tool output modern CSS Color Module Level 4 syntax?", answer: "Yes. You can copy traditional comma-separated syntax rgb(255, 0, 0) or modern space-separated syntax rgb(255 0 0 / 100%)." },
      { question: "Is this color tool processed in the browser?", answer: "Yes. Color mixing calculations occur client-side in browser memory with zero latency." }
    ]
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
    features: ['Custom Name Lists', 'Unique Winner Elimination', 'Multi-winner Drawing', 'Sound & Confetti FX', 'Client-Side Processing'],
    howTo: [
      { title: "Enter Candidate Names", desc: "Type or paste participant names into the list area (one name per line or separated by commas)." },
      { title: "Configure Draw Settings", desc: "Choose whether to remove picked names from subsequent draws, set animation duration, and select winner count." },
      { title: "Pick Winner & View History", desc: "Click Pick Name to launch the randomized draw animation and reveal the winner." }
    ],
    faq: [
      { question: "How is the winner selected to ensure fairness?", answer: "Winner selection uses the Web Crypto API (crypto.getRandomValues) to select a mathematically unbiased index across the participant pool." },
      { question: "Can I remove winners so they cannot be selected twice?", answer: "Yes. Enabling the 'Remove Winner on Draw' toggle eliminates picked participants from subsequent rounds." },
      { question: "Can I import a large list of names from a spreadsheet?", answer: "Yes. You can copy a column of hundreds of names from Excel or Google Sheets and paste them directly into the name input box." },
      { question: "Is there a draw history log?", answer: "Yes. A chronological winner log records each successful pick along with timestamps during your session." },
      { question: "Are participant names stored or sent to a server?", answer: "No. Your participant list exists solely within your active browser tab and is never saved to external servers." }
    ]
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
    features: ['Mifflin-St Jeor Formula', 'Activity Multipliers', 'Weight Loss & Gain Targets', 'Macronutrient Split Breakdown', 'BMI Estimation'],
    howTo: [
      { title: "Enter Personal Biometrics", desc: "Choose Metric or Imperial units and input your age, gender, weight, and height." },
      { title: "Select Activity Level & Fitness Goal", desc: "Choose your weekly exercise frequency (Sedentary to Athlete) and pick your goal (Maintain, Weight Loss, or Weight Gain)." },
      { title: "Review BMR, TDEE & Daily Target Calories", desc: "Inspect your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and exact daily calorie intake target." }
    ],
    faq: [
      { question: "Which scientific formula is used to calculate Basal Metabolic Rate (BMR)?", answer: "The calculator uses the clinically validated Mifflin-St Jeor equation: For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161." },
      { question: "What is Total Daily Energy Expenditure (TDEE)?", answer: "TDEE represents total calories burned in 24 hours combining BMR, physical activity, and food digestion: TDEE = BMR × Activity Multiplier (1.2 for sedentary up to 1.9 for rigorous athlete training)." },
      { question: "How are calorie deficits and surpluses structured for weight goals?", answer: "Mild loss targets a 250 kcal/day deficit (~0.5 lb/week); standard weight loss targets a 500 kcal/day deficit (~1 lb/week); mild weight gain targets a 250–500 kcal/day surplus." },
      { question: "Does the calculator support both Metric (kg/cm) and Imperial (lbs/ft/in) units?", answer: "Yes. Toggle between Metric and Imperial unit systems anytime to input weight in pounds and height in feet and inches." },
      { question: "Is this calculator a medical diagnosis or diet prescription?", answer: "No. This calculator provides an educational mathematical estimate based on standard demographic formulas and is not personalized medical advice." }
    ]
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
    features: ['Industry & Style Filtering', 'Prefix & Suffix Combinations', 'Domain Availability Checks', 'Favorite Names List', 'Instant Clipboard Copy'],
    howTo: [
      { title: "Enter Industry Keywords & Concepts", desc: "Type your business niche, core product offerings, and brand values." },
      { title: "Select Naming Style & Length", desc: "Filter by Modern Minimalist, Compound Word, Classic Corporate, Tech Syllable Blend, or Invented Abstract." },
      { title: "Explore Ideas & Check Domain Formats", desc: "Review curated business name suggestions formatted with matching .com and modern TLD concepts, and copy your favorites." }
    ],
    faq: [
      { question: "How does the business name generator formulate suggestions?", answer: "It uses linguistic word blending, Latin roots, phonetic syllable compounding, and industry keyword associations to produce memorable, brandable company names." },
      { question: "Can I filter name length by character count?", answer: "Yes. You can specify maximum character length to prioritize short, punchy 5-to-8 character startup names." },
      { question: "Does the tool check live trademark registers?", answer: "No. The tool generates creative branding concepts; legal trademark availability and corporate registry filings must be conducted through official government trademark offices (e.g. USPTO, EUIPO)." },
      { question: "Can I bookmark favorite name ideas during my session?", answer: "Yes. Click the star icon on any suggestion to save it to your local favorites list." },
      { question: "Are my company name ideas recorded by Zubware?", answer: "No. All name generation algorithms execute locally on your machine with complete privacy." }
    ]
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
    features: ['Tech & Luxury Vibe Filters', 'Portmanteau Word Blend', 'Vowel Harmony Engine', 'One-Click Shortlisting', 'Brand Identity Inspiration'],
    howTo: [
      { title: "Input Brand Focus & Emotional Vibe", desc: "Enter your product theme and choose an emotional vibe: Luxury & Prestige, Playful & Friendly, High-Tech, or Eco & Organic." },
      { title: "Choose Naming Architecture", desc: "Select Abstract Neologisms, Real Word Metaphors, Foreign Language Roots, or Clean Acronyms." },
      { title: "Review & Copy Brand Concepts", desc: "Browse generated brand identities along with sample tagline hooks and copy top candidates." }
    ],
    faq: [
      { question: "What is the difference between a business name and a brand name?", answer: "A business name is often the legal corporate entity (e.g. 'Apex Logistics LLC'), whereas a brand name is the public-facing, emotionally resonant consumer identity (e.g. 'Swiftly')." },
      { question: "What makes a brand name legally protectable and distinctive?", answer: "Arbitrary and invented names (like 'Kodak' or 'Spotify') receive the strongest legal trademark protection because they do not merely describe the product." },
      { question: "Can I generate matching brand tagline concepts alongside names?", answer: "Yes. Each generated brand suggestion includes optional paired positioning taglines and brand story cues." },
      { question: "Can I filter for names with clean pronunciation across multiple languages?", answer: "Yes. Phonetic filtering prioritizes simple consonant-vowel syllable structures that sound natural internationally." },
      { question: "Is my brand research confidential?", answer: "Yes. All generation occurs entirely in client-side volatile memory." }
    ]
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
    features: ['3D Coin Animation', 'Multi-coin Flips', 'Heads vs Tails History', 'Probability Statistics', 'Audio Effects'],
    howTo: [
      { title: "Set Flip Count & Options", desc: "Choose single toss or multi-flip simulation (up to 1,000 flips at once) and select custom coin themes." },
      { title: "Flip Coin with 3D Animation", desc: "Click Flip Coin or press Spacebar to trigger the physics-based 3D coin spin animation." },
      { title: "Inspect Heads vs Tails Statistics", desc: "View the landed outcome, cumulative win percentages, streaks, and total Heads vs Tails distribution." }
    ],
    faq: [
      { question: "Are coin flip outcomes truly 50/50 fair?", answer: "Yes. Each toss evaluates a cryptographically random bit from window.crypto.getRandomValues, ensuring exactly 50.0% theoretical probability." },
      { question: "Can I simulate large numbers of coin flips for probability experiments?", answer: "Yes. You can execute batch simulations of up to 10,000 flips instantly to observe the Law of Large Numbers in action." },
      { question: "Can I customize the coin faces?", answer: "Yes. You can choose between classic Gold Dollar, Silver Quarter, Euro, and custom text labels." },
      { question: "Does the tool track flip streaks and statistics?", answer: "Yes. The stats dashboard tracks total tosses, current streak, longest streak of Heads or Tails, and percentage distributions." },
      { question: "Does this simulation require ongoing internet access?", answer: "Once loaded, the 3D CSS animation and cryptographic randomization execute locally in your browser." }
    ]
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
    features: ['Collapsible Tree Nodes', 'Syntax Validation', 'Key/Value Search', 'Minify & Beautify', 'Copy JSON Paths'],
    howTo: [
      { title: "Paste or Upload JSON File", desc: "Input JSON text or upload a .json file to inspect complex hierarchical data structures." },
      { title: "Navigate Interactive Tree & Filter Keys", desc: "Expand and collapse object nodes, search keys and values with live filtering, and inspect data types." },
      { title: "Copy JSON Paths or Value Nodes", desc: "Click any node to copy its exact JSONPath (such as $.users.address.city) or copy the node value." }
    ],
    faq: [
      { question: "Can I expand or collapse all JSON nodes with one click?", answer: "Yes. Global 'Expand All' and 'Collapse All' buttons let you navigate large nested trees effortlessly." },
      { question: "Does the viewer highlight data types with distinct colors?", answer: "Yes. Strings, numbers, booleans, nulls, keys, and array indices are color-coded for fast visual recognition." },
      { question: "How does the search and filter feature work?", answer: "The search box highlights matching object keys and string values in real time, auto-expanding parent branches that contain matches." },
      { question: "Can I copy JSONPath expressions for programming?", answer: "Yes. Clicking any node provides its dot-notation or JSONPath expression for immediate use in Python, JavaScript, or jq scripts." },
      { question: "Is large JSON data secure in the viewer?", answer: "Yes. All tree rendering and object navigation execute locally in your browser memory." }
    ]
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
    features: ['Colorful Spinning Wheel', 'Custom Slice Names', 'Remove Winner on Spin', 'Confetti Celebration', 'Custom Weights'],
    howTo: [
      { title: "Input Names or Choices", desc: "Paste your list of options, participants, or decisions into the wheel slice editor." },
      { title: "Customize Wheel Appearance & Sounds", desc: "Select color themes, configure spin duration (seconds), and toggle audio ticker sound effects." },
      { title: "Spin the Wheel to Pick a Winner", desc: "Click the center Spin button to start the wheel and celebrate the winner with confetti." }
    ],
    faq: [
      { question: "How does the wheel calculate its stopping angle?", answer: "The stopping angle is determined using cryptographic randomization before applying easing physics, ensuring an unbiased outcome across all wheel slices." },
      { question: "Can I eliminate the winning slice after a spin?", answer: "Yes. You can click 'Remove Winner' in the winner popup to remove that option before spinning again." },
      { question: "What is the maximum number of slices the wheel can hold?", answer: "The wheel renders smoothly with up to 100 slices, automatically adjusting label typography and slice widths." },
      { question: "Can I save custom wheel setups for future use?", answer: "Yes. Your current wheel options are saved in local browser storage so your list remains ready for your next session." },
      { question: "Are names sent to any server during the spin?", answer: "No. Canvas rendering, rotation animations, and outcome calculations run locally in your browser." }
    ]
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
    features: ['FOIR Limit Adjustment', 'Existing Obligations', 'Tenure & Rate Customization', 'Maximum EMI & Loan Amount', 'Amortization Overview'],
    howTo: [
      { title: "Enter Net Monthly Income & Debts", desc: "Input your monthly take-home salary or income, along with your existing monthly loan EMIs and credit commitments." },
      { title: "Set Loan Terms & DTI Threshold", desc: "Specify the expected annual interest rate, proposed tenure in years, and select your bank's maximum allowable DTI/FOIR ratio (e.g. 45% or 50%)." },
      { title: "Review Maximum Borrowing Capacity", desc: "Inspect your estimated maximum loan amount eligibility, maximum permissible monthly EMI, and residual disposable income." }
    ],
    faq: [
      { question: "What is FOIR or Debt-to-Income (DTI) ratio in loan eligibility?", answer: "Fixed Obligation to Income Ratio (FOIR) or Debt-to-Income (DTI) is the maximum percentage of your monthly income lenders permit toward all combined debt payments (typically 40% to 50%)." },
      { question: "How does existing debt affect my maximum borrowing limit?", answer: "Existing monthly loan and credit card EMIs reduce the remaining monthly surplus available for new debt, directly lowering the maximum loan amount a bank will approve." },
      { question: "How does increasing loan tenure increase eligibility?", answer: "A longer tenure lowers the required monthly EMI per dollar borrowed, allowing your available monthly repayment surplus to qualify for a larger principal loan amount." },
      { question: "Does this calculator guarantee formal loan approval by a bank?", answer: "No. This tool provides an estimate based on income and mathematical ratios. Final lender approval depends on credit bureau score (CIBIL/FICO), employment stability, and property collateral valuation." },
      { question: "Can co-applicant income be added to boost loan eligibility?", answer: "Yes. You can enter combined household income into the monthly income field if applying jointly with a spouse or co-borrower." }
    ]
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
    features: ['Live Millisecond Countdown', 'Working Days Calculation', 'Milestone Presets', 'Shareable Event Card', 'Custom Background Themes'],
    howTo: [
      { title: "Enter Event Name", desc: "Type a descriptive title for your upcoming occasion, deadline, holiday, or personal milestone." },
      { title: "Select Target Date & Time", desc: "Use the calendar picker to specify the exact future date and time for the countdown." },
      { title: "Monitor Live Countdown", desc: "Watch the animated real-time ticker displaying remaining days, hours, minutes, and seconds, and copy the shareable summary." }
    ],
    faq: [
      { question: "How accurate is the real-time countdown timer?", answer: "The countdown recalculates remaining time every 1,000 milliseconds by comparing your device's system clock against the target timestamp in UTC epoch time." },
      { question: "What happens when the countdown reaches zero?", answer: "When the clock expires, the timer stops ticking and displays a celebratory event completion notice." },
      { question: "Does the countdown work across different time zones?", answer: "The date picker records local device time. When shared or calculated, time differences are computed against your computer's local clock timezone." },
      { question: "Can I track total days or hours remaining instead of broken-down units?", answer: "Yes. The summary statistics panel displays total aggregate calendar days, total hours, and total minutes remaining until the event." },
      { question: "Is my personal event information saved on a server?", answer: "No. The event title and target date run strictly within your client browser session without server communication." }
    ]
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
    features: ['Millisecond Precision', 'Split Lap Times', 'Keyboard Shortcuts (Space/L/R)', 'Lap History Export', 'In-Browser Processing'],
    howTo: [
      { title: "Start Elapsed Timer", desc: "Click Start to initiate millisecond-precision stopwatch timing." },
      { title: "Record Lap & Split Times", desc: "Click Lap while running to record individual split times and total cumulative time without pausing the clock." },
      { title: "Pause, Copy or Reset", desc: "Click Pause to halt timing, copy your complete lap history to clipboard, or click Reset to return to zero." }
    ],
    faq: [
      { question: "What time precision does this digital stopwatch offer?", answer: "The stopwatch measures time with centisecond (hundredths of a second, 10ms) display precision using the browser's performance timestamp API." },
      { question: "What is the difference between Lap Time and Overall Time?", answer: "Lap Time measures the specific duration of the single current lap or segment. Overall Time measures cumulative elapsed time since the stopwatch was started." },
      { question: "Can I copy my recorded lap times?", answer: "Yes. Click Copy Laps to export a formatted list of all recorded split times, lap numbers, and total times to your clipboard." },
      { question: "Does the stopwatch continue running if I switch browser tabs?", answer: "Yes. Because elapsed time is calculated from wall-clock timestamps rather than setInterval ticks, background tab throttling does not cause the stopwatch to lose time." },
      { question: "How are fastest and slowest laps highlighted?", answer: "The lap table automatically detects the minimum and maximum lap durations, highlighting your fastest split in green and slowest split in amber." }
    ]
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
    features: ['Quick Duration Presets (10s–1h)', 'Custom Hours, Minutes & Seconds', 'Web Audio Alert Chime', 'Desktop Notifications', 'Background Tab Accuracy'],
    howTo: [
      { title: "Set Timer Duration", desc: "Choose a quick preset (10s, 1m, 5m, 15m, 25m Pomodoro, 1h) or enter custom hours, minutes, and seconds." },
      { title: "Configure Sound & Alerts", desc: "Enable the audio chime sound and grant browser notification permissions for background completion alerts." },
      { title: "Start & Monitor Progress", desc: "Click Start to begin countdown. Watch the circular progress ring and receive an audible alarm when time expires." }
    ],
    faq: [
      { question: "Will the alarm sound if my browser tab is in the background?", answer: "Yes. As long as your browser window remains open and audio is not muted, the Web Audio synthesized chime will play when the timer completes." },
      { question: "How do desktop notifications work with this timer?", answer: "Clicking the Bell icon requests standard browser notification permission. When granted, Zubware sends a desktop notification card when time runs out." },
      { question: "What is the 25-minute preset used for?", answer: "The 25-minute preset corresponds to the standard Pomodoro Technique interval for focused work sprints followed by a short rest break." },
      { question: "Can I pause and resume the timer midway?", answer: "Yes. Click Pause at any time to freeze the countdown, and click Resume to continue from the exact second remaining." },
      { question: "Can I set multi-hour timers for cooking or studying?", answer: "Yes. You can enter any combination of hours (up to 99), minutes (up to 59), and seconds (up to 59) in the custom input fields." }
    ]
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
    features: ['Accurate Local Digital Clock', '10+ Major World Cities Clocks', '12-Hour & 24-Hour Formats', 'Searchable Global City Directory', 'Automatic DST Synchronization'],
    howTo: [
      { title: "View Current Local Time", desc: "Inspect the large real-time digital clock displaying hours, minutes, seconds, and full date." },
      { title: "Toggle 12-Hour or 24-Hour Format", desc: "Switch between standard 12-hour AM/PM format and 24-hour military time." },
      { title: "Add World Cities to Clock Grid", desc: "Search and add international cities (e.g. London, Tokyo, New York, Dubai) to monitor worldwide time zones simultaneously." }
    ],
    faq: [
      { question: "How does the online clock synchronize its current time?", answer: "The clock reads your computer or smartphone's operating system hardware clock, formatted through JavaScript's internationalization (Intl) time APIs." },
      { question: "How do world city clocks handle daylight saving time (DST)?", answer: "The world clock uses IANA timezone identifiers (e.g. America/New_York, Europe/London), which automatically apply regional Daylight Saving Time offsets." },
      { question: "Can I copy the current timestamp with one click?", answer: "Yes. Click the Copy Time button to copy the exact formatted time and date string directly to your clipboard." },
      { question: "Are my saved world cities preserved between browser visits?", answer: "Yes. Your selected world cities and 12/24-hour display preferences are saved in browser local storage for subsequent visits." },
      { question: "Does this clock consume background battery power?", answer: "No. The clock uses lightweight requestAnimationFrame scheduling that updates only once per second with minimal CPU and battery consumption." }
    ]
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
    features: ['Multi-zone Comparison', 'Automatic DST Adjustment', '12h & 24h Formats', 'Day/Night & Day Diff Tags', 'Instant Schedule Sharing'],
    howTo: [
      { title: "Set Origin Date, Time & Zone", desc: "Choose your base date, hour, minute, and your starting local time zone." },
      { title: "Add Target Cities & Time Zones", desc: "Select destination cities across North America, Europe, Asia, Australia, and Africa to compare matching local hours." },
      { title: "Plan Meetings Across Time Zones", desc: "Review synchronized time cards with day/night status and working-hours indicators to find ideal meeting windows." }
    ],
    faq: [
      { question: "How does the time zone converter handle date changes across the International Date Line?", answer: "When converting to time zones that cross midnight, the tool displays an explicit '+1 Day' or '-1 Day' badge alongside the target city's calendar date." },
      { question: "How does the working-hours indicator help meeting planners?", answer: "Each destination card highlights whether the converted hour falls within standard business hours (9:00 AM to 5:00 PM), early morning, evening, or nighttime sleep hours." },
      { question: "Are daylight saving adjustments handled automatically?", answer: "Yes. Conversions are processed through standard IANA timezone databases that apply accurate seasonal daylight saving offsets for every selected date." },
      { question: "Can I swap the origin and destination time zones?", answer: "Yes. You can reassign any destination city as your new base timezone with one click to plan return communications." },
      { question: "Can I copy meeting schedule details to share with attendees?", answer: "Yes. Click Copy Summary to copy a formatted multi-city time comparison block ready to paste into calendar invites or emails." }
    ]
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
    features: ['RPG Dice (D4 to D100)', 'Sum Totals & Modifiers', 'Roll History & Logs', 'Physical Physics Toss', 'Multiple Dice Sets'],
    howTo: [
      { title: "Select Dice Type & Quantity", desc: "Choose standard D6 gaming dice or tabletop RPG dice (D4, D6, D8, D10, D12, D20, D100) and set quantity." },
      { title: "Set Modifiers & Roll Options", desc: "Add optional positive or negative score modifiers (+/-) and toggle roll history tracking." },
      { title: "Roll Dice with 3D Physics", desc: "Click Roll Dice or press Spacebar to watch animated dice rolls and inspect individual values and total sum." }
    ],
    faq: [
      { question: "Which tabletop RPG polyhedral dice are supported?", answer: "The roller supports D4, D6, D8, D10, D12, D20, and percentile D100 dice, suitable for D&D, Pathfinder, and tabletop games." },
      { question: "How are dice rolls generated for fairness?", answer: "Outcomes are derived from cryptographically strong random values (crypto.getRandomValues), preventing algorithmic roll bias." },
      { question: "Can I roll multiple dice of different types together?", answer: "Yes. You can roll multiple dice simultaneously (e.g. 3d6 or 1d20 + 2d8) and review individual values alongside combined sums." },
      { question: "Does the tool support advantage and disadvantage rolls?", answer: "Yes. Tabletop presets let you roll with Advantage (keep highest) or Disadvantage (keep lowest) with automatic highlights." },
      { question: "Is an internet connection required to roll dice?", answer: "No. All 3D animations and roll calculations execute locally on your device." }
    ]
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
    features: ['20% PMI Avoidance Check', 'Target Date Savings Timeline', 'Loan-to-Value (LTV) Ratio', 'Closing Cost Estimation', 'Home & Auto Presets'],
    howTo: [
      { title: "Enter Target Purchase Price", desc: "Input the expected total price of the home, real estate property, or vehicle you plan to purchase." },
      { title: "Set Down Payment & Closing Cost Rates", desc: "Choose your target down payment percentage (e.g. 3.5%, 5%, 10%, 20%), estimated closing costs (typically 2–4%), and savings timeframe." },
      { title: "Review Total Upfront Cash Needed", desc: "Inspect required down payment cash, estimated closing fees, total cash required at closing, and the monthly savings required to hit your target." }
    ],
    faq: [
      { question: "Why is a 20% down payment traditionally recommended for home purchases?", answer: "Putting 20% down eliminates the requirement for Private Mortgage Insurance (PMI) on conventional loans, lowers your monthly mortgage payment, and reduces total lifetime interest." },
      { question: "What are typical closing costs on a real estate purchase?", answer: "Buyer closing costs typically range between 2% and 5% of the purchase price, covering lender origination fees, appraisal, title search, escrow reserves, and transfer taxes." },
      { question: "How is the monthly savings target calculated?", answer: "The tool subtracts your current saved funds from the total cash needed (down payment + closing costs) and divides the shortfall by your timeframe in months." },
      { question: "Can I calculate down payments for lower down payment loans like FHA?", answer: "Yes. Preset buttons provide quick calculation for low down payment loans including 3.5% (FHA minimum), 5%, 10%, and standard 20% conventional loans." },
      { question: "Does the calculator account for interest earned on savings deposits?", answer: "This tool calculates the direct linear cash required. Any high-yield savings interest earned on your deposits will help you reach your down payment goal even faster." }
    ]
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
    features: ['Standard Mix Ratios (M15, M20, M25)', 'Metric & Imperial Units', 'Dry Volume Factor (1.54)', '50kg Bag Conversion', 'Material Cost Estimates'],
    howTo: [
      { title: "Select Unit System & Structure Dimensions", desc: "Choose Imperial (feet and inches) or Metric (meters and centimeters) and input the length, width, and thickness of your slab or footing." },
      { title: "Set Wastage & Concrete Bag Size", desc: "Include a safety wastage allowance (typically 5% to 10%) and select your pre-mixed bag size (80lb, 60lb, or 50kg)." },
      { title: "View Required Bags & Material Volumes", desc: "Inspect total concrete volume in cubic yards or cubic meters, total pre-mixed bags needed, or raw sand and gravel component weights." }
    ],
    faq: [
      { question: "How is total concrete volume calculated from slab dimensions?", answer: "For imperial units: Volume (cu ft) = Length (ft) × Width (ft) × [Thickness (in) / 12]. Divide by 27 to obtain Cubic Yards. For metric: Volume (cu m) = Length (m) × Width (m) × [Thickness (cm) / 100]." },
      { question: "How many 80lb or 60lb bags of concrete make one cubic yard?", answer: "One 80-lb bag yields approximately 0.60 cubic feet (requiring 45 bags per cubic yard). One 60-lb bag yields approximately 0.45 cubic feet (requiring 60 bags per cubic yard)." },
      { question: "Why should I add a wastage factor to my concrete estimate?", answer: "Sub-base soil variations, formwork deflection, spillage, and excavation irregularities typically consume 5% to 10% more concrete than theoretical dimensions." },
      { question: "What is the standard 1:2:3 volumetric concrete mix ratio?", answer: "A standard structural concrete mix consists of 1 part Portland cement, 2 parts clean sand, and 3 parts coarse aggregate/gravel by volume, yielding approximately 3,000 PSI strength." },
      { question: "Can I calculate concrete for post holes and footings?", answer: "Yes. Enter the cross-sectional area and depth of your footing into the dimension fields to calculate volume and bag counts for fence posts and deck piers." }
    ]
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
    features: ['Light & Sound Wave Speeds', 'Spectrum Band Identification', 'Photon Energy (eV & Joules)', 'Scientific Notation Input', 'Instant Unit Switching'],
    howTo: [
      { title: "Enter Wave Frequency", desc: "Type the frequency value and select the frequency unit (Hz, kHz, MHz, GHz, or THz)." },
      { title: "Select Wave Medium or Propagation Speed", desc: "Choose a medium preset (Light/Radio in vacuum 3×10⁸ m/s, Sound in air 343 m/s, Sound in water, Sound in steel, or enter custom velocity)." },
      { title: "Review Calculated Wavelength & Period", desc: "Inspect the calculated wavelength across meters, millimeters, micrometers, and nanometers, along with wave period in seconds." }
    ],
    faq: [
      { question: "What mathematical formula relates wavelength, frequency, and wave speed?", answer: "Wavelength (λ) is calculated using the wave equation: λ = v / f, where v is wave propagation velocity in meters per second and f is frequency in Hertz." },
      { question: "What wave speed is used for radio waves and light in a vacuum?", answer: "Electromagnetic radiation in a vacuum travels at the constant speed of light: c = 299,792,458 meters per second (~3.0 × 10⁸ m/s)." },
      { question: "How does the speed of sound differ between air, water, and steel?", answer: "Sound travels at approximately 343 m/s in air at 20°C, 1,482 m/s in fresh water, and 5,960 m/s in solid steel due to differences in density and elastic modulus." },
      { question: "How is wave period calculated from frequency?", answer: "Wave period (T) is the reciprocal of frequency: T = 1 / f, representing the exact duration in seconds for one complete wave cycle to pass a fixed point." },
      { question: "Which electromagnetic spectrum bands are classified by this tool?", answer: "The calculator identifies whether electromagnetic inputs fall into Audio, Radio (VLF to EHF), Microwave, Infrared, Visible Light, Ultraviolet, or X-ray bands." }
    ]
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
    features: ['Live Browser UA Detection', 'Hardware & OS Extraction', 'Engine & Architecture Info', 'Copy Clean JSON Spec', 'Common Device Presets'],
    howTo: [
      { title: "Inspect Current Browser User Agent", desc: "The tool automatically detects and populates your active browser's navigator.userAgent string." },
      { title: "Paste Custom User Agent String", desc: "Paste user agents from web server logs, mobile apps, or web crawlers to analyze external devices." },
      { title: "Review Deconstructed Device & Engine Details", desc: "Inspect parsed breakdown cards: Browser Name & Version, Operating System, Rendering Engine (Blink/Gecko/WebKit), and Device Type (Mobile/Desktop/Tablet)." }
    ],
    faq: [
      { question: "What client properties does this parser extract from a User Agent string?", answer: "It extracts Browser Name and Version, Operating System (Windows, macOS, iOS, Android, Linux) and Version, Device Vendor/Model, Architecture, and Rendering Engine." },
      { question: "Does the tool detect web crawlers and search engine bots?", answer: "Yes. It identifies major bot signatures including Googlebot, Bingbot, YandexBot, DuckDuckBot, and social media preview crawlers." },
      { question: "Can I analyze mobile smartphone user agents?", answer: "Yes. Pasting user agents from iPhones, iPads, or Android devices reveals exact hardware model identifiers and mobile Safari/Chrome versions." },
      { question: "What is User-Agent Client Hints (UA-CH)?", answer: "Modern browsers are gradually freezing traditional User-Agent strings in favor of Client Hints; this tool decodes available Client Hints and legacy strings." },
      { question: "Is my browser User Agent recorded on a server?", answer: "No. The User Agent analysis is parsed strictly within your local browser session." }
    ]
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
    features: ['Multimodal Detection', 'Frequency Table Distribution', 'Mean & Median Summary', 'Comma/Space Delimited Inputs', 'Copy Statistical Summary'],
    howTo: [
      { title: "Enter or Paste Numbers Dataset", desc: "Type or paste your raw numbers separated by commas, spaces, semicolons, or line breaks." },
      { title: "Statistical Evaluation", desc: "The calculator sorts your numbers, tallies frequency distributions, and checks for modal clusters." },
      { title: "Review Mode, Mean & Median Summary", desc: "Inspect the detected mode value(s), frequency count, distribution classification, arithmetic mean, and median." }
    ],
    faq: [
      { question: "What is the statistical mode of a dataset?", answer: "The mode is the number that appears most frequently in a dataset. For example, in the set [2, 4, 4, 7, 9], the mode is 4 with a frequency of 2." },
      { question: "What is the difference between unimodal, bimodal, and multimodal datasets?", answer: "Unimodal datasets have exactly one most frequent value. Bimodal datasets have two distinct values tied for highest frequency. Multimodal datasets have three or more tied modes." },
      { question: "What happens if every number in the dataset appears only once?", answer: "When all values in a dataset appear with equal frequency (frequency = 1), the distribution has no mode, which the tool identifies explicitly." },
      { question: "Does the mode calculator also provide mean and median?", answer: "Yes. In addition to mode, the summary panel displays arithmetic mean (average), median (middle value), minimum, maximum, range, and total sample count." },
      { question: "Can I paste negative numbers and decimal values?", answer: "Yes. The parsing engine recognizes negative values and floating-point decimal numbers separated by any common delimiter." }
    ]
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
    features: ['Air-Core Solenoids', 'Magnetic Permeability (µr)', 'Wire Length & Resistance', 'Wheeler Approximation', 'µH, mH, Henry Outputs'],
    howTo: [
      { title: "Enter Solenoid Coil Dimensions", desc: "Input coil diameter in millimeters and total winding length in millimeters." },
      { title: "Specify Turn Count & Core Material", desc: "Enter the number of wire turns and set the relative magnetic permeability of the core material (1 for air core)." },
      { title: "Review Inductance & Wire Length", desc: "Inspect calculated inductance in microhenries (μH), millihenries (mH), and approximate wire length needed for construction." }
    ],
    faq: [
      { question: "Which formula is used to calculate single-layer solenoid inductance?", answer: "The calculator uses Wheeler's continuous coil formula: L (μH) = (μr × d² × n²) / (18d + 40ℓ), where d is coil diameter in inches, ℓ is coil length in inches, n is turn count, and μr is relative permeability." },
      { question: "What is the relative permeability (μr) of an air-core inductor?", answer: "Air, wood, plastic, and non-magnetic coil formers have a relative permeability of 1.0. Ferrite or iron cores have much higher values (10 to 1,000+), significantly increasing inductance." },
      { question: "How does doubling the number of turns affect inductance?", answer: "Because turn count is squared in Wheeler's formula (n²), doubling the number of turns quadruples (4x) the resulting inductance if coil dimensions remain similar." },
      { question: "How is the estimated winding wire length calculated?", answer: "Wire length is estimated by multiplying the circumference of a single circular turn (π × diameter) by the total number of turns: Length ≈ n × π × d." },
      { question: "Are these calculations suitable for high-frequency RF coil design?", answer: "Wheeler's formula provides high accuracy (typically within 1%) for single-layer helical solenoids where coil length is greater than 0.4 times coil diameter." }
    ]
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
    features: ['Vowel & Consonant Filtering', 'Unique Letter Drawings', 'Scrabble Letter Frequencies', 'Batch Letter Output', 'One-Click Clipboard Copy'],
    howTo: [
      { title: "Choose Alphabet & Language Set", desc: "Select standard English (A-Z) or international alphabets, and toggle uppercase or lowercase letters." },
      { title: "Configure Quantity & Exclusions", desc: "Specify how many letters to generate, toggle vowels-only or consonants-only, and exclude specific letters." },
      { title: "Generate and Copy Letters", desc: "Click Generate to reveal randomized letters for word games, educational quizzes, or creative prompts." }
    ],
    faq: [
      { question: "Can I generate vowels-only or consonants-only?", answer: "Yes. Filtering toggles allow you to restrict output strictly to vowels (A, E, I, O, U) or consonants for word games like Scrabble." },
      { question: "Can I generate non-repeating unique letters?", answer: "Yes. Enabling the 'Unique Letters' toggle ensures no letter appears more than once in a single draw." },
      { question: "Can I exclude difficult letters from the draw?", answer: "Yes. You can specify a blacklist of letters (such as Q, X, Z) to omit from generation." },
      { question: "Is this tool suitable for classroom and word games?", answer: "Yes. Large display typography and one-click re-draws make it popular for teachers, trivia hosts, and language learners." },
      { question: "Are random letters generated locally?", answer: "Yes. Random indexing executes client-side using browser cryptographic randomness." }
    ]
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
    features: ['Weight & Activity Modifiers', 'Hot Climate Adjustments', 'Standard Glass Counters', 'Metric & Imperial Units', 'Hourly Hydration Schedule'],
    howTo: [
      { title: "Enter Body Weight", desc: "Choose Metric (kg) or Imperial (lbs) units and input your current body weight." },
      { title: "Add Daily Exercise & Climate Conditions", desc: "Input daily workout duration in minutes, select your local climate (Moderate, Hot, Very Hot), and indicate pregnancy or nursing status." },
      { title: "Review Recommended Daily Hydration", desc: "Inspect your total daily water target in liters and fluid ounces, glass count, and hourly drinking schedule." }
    ],
    faq: [
      { question: "What baseline formula determines daily water intake from body weight?", answer: "The baseline formula recommends approximately 35 milliliters of water per kilogram of body weight per day (equivalent to about 0.5 to 0.6 fluid ounces per pound)." },
      { question: "How does physical exercise increase daily water requirements?", answer: "The calculator adds approximately 350 milliliters (about 12 fluid ounces) of additional water for every 30 minutes of moderate-to-vigorous exercise to replace sweat loss." },
      { question: "How do hot climates and pregnancy affect hydration targets?", answer: "Hot weather adds 500ml to 1,000ml to offset perspiration. Pregnancy adds 300ml, while breastfeeding adds 700ml to support fluid balance and milk production." },
      { question: "How many standard drinking glasses does the target represent?", answer: "The tool converts your total volume into standard 250ml (8 fl oz) glass equivalents and provides an hourly drinking timetable from morning to evening." },
      { question: "Is this water calculator suitable for individuals with kidney or cardiac conditions?", answer: "No. Individuals with medical fluid restrictions (such as heart failure or kidney disease) must follow their physician's specific hydration directives." }
    ]
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
    features: ['Bidirectional Conversion', 'Syntax Error Detection', 'Indentation Control', 'Download YAML File', 'In-Browser Processing'],
    howTo: [
      { title: "Paste JSON Data", desc: "Input valid JSON objects, configs, or arrays into the left editor pane." },
      { title: "Configure Indentation & Formatting", desc: "Select 2-space or 4-space indentations and toggle quote wrapping for string values." },
      { title: "Copy or Download Clean YAML", desc: "Review the converted YAML document with clean block structure and click Copy or download as .yaml." }
    ],
    faq: [
      { question: "How does the converter handle nested arrays in YAML?", answer: "Nested arrays are formatted into clean YAML list syntax with dashes (-) indented according to standard YAML specification rules." },
      { question: "Are multiline strings formatted as YAML literal blocks?", answer: "Yes. Multiline string fields with newline characters are formatted using clean YAML pipe (|) or folded (>) literal block operators." },
      { question: "Is this suitable for Docker Compose and Kubernetes manifest files?", answer: "Yes. The generated YAML is strictly formatted for Kubernetes pod configs, GitHub Actions workflows, and Docker Compose specifications." },
      { question: "Does the converter validate JSON syntax before transforming?", answer: "Yes. If the JSON contains syntax errors, the parser alerts you to the exact error location before converting." },
      { question: "Is data sent to an external server?", answer: "No. The JSON-to-YAML conversion engine runs entirely in browser memory." }
    ]
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
    features: ['Deduplicate Links', 'Domain Name Filtering', 'CSV & Plaintext Export', 'Remove Query Strings', 'Fast Regex Engine'],
    howTo: [
      { title: "Paste Raw Text or Source Code", desc: "Paste articles, emails, server logs, or HTML page source containing hyperlinks into the input box." },
      { title: "Configure Extraction Filters", desc: "Choose to extract all URLs, filter by domain extension, remove duplicate links, or strip query parameters." },
      { title: "Copy Extracted URL List", desc: "Review the extracted link count and copy the clean newline-separated list or download as text." }
    ],
    faq: [
      { question: "Can the extractor detect URLs without http:// or https:// prefixes?", answer: "Yes. The regular expression recognizes standard http/https links, www. subdomains, and standalone web domains." },
      { question: "Can I strip tracking parameters (like UTM tags) from extracted links?", answer: "Yes. Enabling the 'Strip Query Parameters' filter removes tracking parameters from URLs, giving you clean canonical domain paths." },
      { question: "How does the tool handle malformed or nested links in raw HTML?", answer: "It parses href attributes as well as raw text occurrences, extracting clean URLs while discarding HTML tag markup." },
      { question: "Can I deduplicate extracted URLs automatically?", answer: "Yes. The deduplication filter automatically discards repeated URLs and displays unique link counts." },
      { question: "Is my scanned text private?", answer: "Yes. The regex scan runs locally in your browser. No URLs or source texts are uploaded." }
    ]
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
    features: ['Yield to Maturity (YTM)', 'Current Yield vs Coupon', 'Premium / Discount Indicator', 'Annual Cash Flow Schedule', 'Maturity Value Analysis'],
    howTo: [
      { title: "Enter Bond Pricing & Face Value", desc: "Input the par face value of the bond (typically $1,000) and its current market trading price." },
      { title: "Set Coupon Rate & Maturity Duration", desc: "Enter the annual coupon interest rate percentage, remaining years to maturity, and payment frequency (annual or semi-annual)." },
      { title: "Inspect Current Yield & Yield to Maturity", desc: "Review annual dollar coupon payment, Current Yield percentage, approximate Yield to Maturity (YTM %), and premium/discount status." }
    ],
    faq: [
      { question: "What is the difference between Coupon Rate, Current Yield, and YTM?", answer: "Coupon Rate is the fixed annual interest percentage paid on face value. Current Yield is annual coupon divided by current market price. Yield to Maturity (YTM) is the total estimated annualized return if held until the bond matures." },
      { question: "What is the formula used for approximate Yield to Maturity (YTM)?", answer: "The tool uses the standard approximation formula: YTM ≈ [C + (F - P) / n] / [(F + P) / 2], where C is annual coupon, F is face value, P is market price, and n is years to maturity." },
      { question: "What does it mean when a bond trades at a discount or premium?", answer: "A bond trades at a discount when market price is below face value (P < F, YTM > Coupon Rate). It trades at a premium when market price exceeds face value (P > F, YTM < Coupon Rate)." },
      { question: "Does this calculator support semi-annual coupon payments?", answer: "Yes. Most US corporate and Treasury bonds pay interest semi-annually; selecting semi-annual frequency splits the annual coupon into two equal distributions per year." },
      { question: "Does YTM account for reinvestment risk?", answer: "YTM assumes that all periodic coupon payments can be reinvested at the same continuous yield rate until maturity." }
    ]
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
    features: ['Veterinary Life Stages', 'Kitten & Senior Care Tips', 'Human Age Equivalency', 'Indoor vs Outdoor Adjustments', 'Health Milestone Guide'],
    howTo: [
      { title: "Enter Cat Age in Years & Months", desc: "Input your cat's current chronological age using the years and months number steppers." },
      { title: "Veterinary Curve Translation", desc: "The tool translates feline developmental milestones into equivalent human biological age." },
      { title: "Review Equivalent Age & Life Stage", desc: "Inspect your cat's equivalent human years, life stage classification (Kitten, Junior, Prime, Mature, Senior, Geriatric), and health tips." }
    ],
    faq: [
      { question: "Why is cat aging not simply 7 human years per calendar year?", answer: "Cats mature rapidly in their first two years of life. According to the American Association of Feline Practitioners (AAFP), a 1-year-old cat is biologically comparable to a 15-year-old human, and a 2-year-old cat corresponds to about 24 human years." },
      { question: "How are cat ages calculated beyond age two?", answer: "After reaching full adult maturity at age two (24 human years), each additional calendar year adds approximately 4 human biological years." },
      { question: "What are the recognized feline life stages?", answer: "The AAFP classifies feline stages as: Kitten (0–6 months), Junior (7 months–2 years), Prime (3–6 years), Mature (7–10 years), Senior (11–14 years), and Geriatric (15+ years)." },
      { question: "Do indoor cats and outdoor cats age differently?", answer: "Indoor cats generally enjoy longer life expectancies (often 14–18+ years) compared to outdoor cats due to reduced exposure to traffic, predators, and infectious feline diseases." },
      { question: "Is this calculator a substitute for professional veterinary advice?", answer: "No. This tool provides an educational mathematical estimate based on established veterinary age curves and does not replace regular veterinary checkups." }
    ]
  },
  {
    id: 'exam-score-calculator',
    title: "Exam Score Calculator — Test Grade, Percentage & Negative Marking",
    navTitle: "Exam Score Calc",
    description: "Calculate test percentage marks, letter grades (A+ to F), and net scores with negative marking penalties for competitive exams and academic assessments.",
    icon: '📝',
    path: '/exam-score-calculator.html',
    filename: 'exam-score-calculator.html',
    category: '💼 Career Tools',
    badge: 'Academic',
    features: ['Letter Grade Conversion', 'Target Grade Goal Solver', 'Weighted Grading Scale', 'Wrong Answer Analysis', 'Pass / Fail Thresholds'],
    howTo: [
      { title: "Enter Question & Answer Counts", desc: "Input total questions on the exam and the number of incorrect or missed answers." },
      { title: "Select Negative Marking Penalty", desc: "Choose the deduction rate per wrong answer (none, -0.25 for 1/4 penalty, -0.33 for 1/3 penalty, or -0.5)." },
      { title: "Review Net Score & Letter Grade", desc: "Inspect your net score, percentage, and letter grade, then click Copy Score to copy the result to your clipboard." }
    ],
    faq: [
      { question: "How does negative marking penalty calculate net exam score?", answer: "Each wrong answer incurs a fractional deduction (such as 0.25 marks for a 1/4 penalty). Correct answers score full marks, and penalties are subtracted to determine your net score." },
      { question: "Which negative marking deduction options are supported?", answer: "The calculator provides presets for None (0), 1/4 penalty (-0.25), 1/3 penalty (-0.33), 1/2 penalty (-0.5), and full point penalty (-1.0)." },
      { question: "How are percentage marks and letter grades determined?", answer: "Percentage is calculated by dividing net score by total questions and multiplying by 100. Grades are classified on a standard scale from A+ (97%+) to F (below 60%)." },
      { question: "Can I copy the score summary to share or save?", answer: "Yes. Click the Copy Score button to copy your net marks, total questions, percentage, and grade formatted cleanly to your clipboard." },
      { question: "Is my exam marks data sent to a remote server?", answer: "All calculations run in your browser memory and are not sent to or stored on any external server." }
    ]
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
    features: ['CBSE 9.5x Multiplier', 'Semester-by-Semester GPA', 'Credit Weight Calculation', 'Division & Honors Class', 'PDF Transcript Summary'],
    howTo: [
      { title: "Select Grading Scale", desc: "Choose between a standard 10.0 grading scale (common in universities and CBSE) or a 4.0 GPA scale." },
      { title: "Add Semester GPAs & Credits", desc: "Enter your GPA and credit weight for each completed academic semester or course module." },
      { title: "Review Cumulative CGPA & Percentage", desc: "Inspect your credit-weighted cumulative CGPA, converted percentage equivalent, total credits earned, and academic class honors." }
    ],
    faq: [
      { question: "How is credit-weighted Cumulative GPA (CGPA) calculated?", answer: "CGPA is calculated by dividing total earned grade points (sum of GPA × Credits for each semester) by total completed credits: CGPA = Σ(GPAᵢ × Creditsᵢ) / Σ(Creditsᵢ)." },
      { question: "How is CGPA converted to percentage marks on a 10-point scale?", answer: "For standard Indian universities and CBSE guidelines, percentage is calculated as: Percentage = CGPA × 9.5. On a 4.0 scale, percentage is computed as (GPA / 4.0) × 100." },
      { question: "What academic honors divisions are displayed?", answer: "The tool classifies results into recognized academic standings: First Class with Distinction (typically CGPA ≥ 7.5 or 75%+), First Class, Second Class, or Pass." },
      { question: "Can I add or remove semesters easily?", answer: "Yes. Use the 'Add Semester' button to append semesters up to a full 4-year or 5-year degree program, or click the trash icon to remove semesters." },
      { question: "Can I copy my full CGPA academic summary?", answer: "Yes. Click Copy Summary to copy your overall CGPA, equivalent percentage, total credits, and semester breakdown to your clipboard." }
    ]
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
    features: ['MPG & L/100km Conversion', 'Trip Fuel Cost Estimation', 'Cost per Mile/Kilometer', 'Fuel Tank Range Forecast', 'Road Trip Planner'],
    howTo: [
      { title: "Select Unit System", desc: "Choose US Units (Miles, Gallons, $/gal) or Metric Units (Kilometers, Liters, $/L)." },
      { title: "Enter Trip Distance & Fuel Used", desc: "Input odometer distance traveled, total volume of fuel pumped, and the fuel unit price." },
      { title: "Review Fuel Economy & IRS Deduction", desc: "Inspect calculated MPG and L/100km fuel economy, cost per mile, total trip fuel expense, and IRS business mileage deduction value." }
    ],
    faq: [
      { question: "How is fuel economy calculated in MPG and L/100km?", answer: "In US units: MPG = Distance (miles) / Fuel (gallons). In Metric units: L/100km = [Fuel (liters) × 100] / Distance (kilometers). The tool displays both ratings simultaneously." },
      { question: "What is the standard IRS business mileage rate?", answer: "The default rate is set to the official 2024 IRS standard business mileage rate of $0.67 per mile, which you can adjust if tax authorities update statutory rates." },
      { question: "How do I accurately calculate my car's true gas mileage?", answer: "Fill your tank completely and reset the trip odometer. Drive normally until the tank is partially empty, refill completely, and record the exact gallons pumped and trip mileage." },
      { question: "How is trip fuel cost per mile calculated?", answer: "Cost per mile is calculated by dividing total fuel purchase cost by the distance driven, showing exact out-of-pocket fuel costs per mile." },
      { question: "Can I use this calculator for diesel and hybrid vehicles?", answer: "Yes. The mathematical relationship between distance traveled, liquid fuel volume pumped, and price per unit volume applies to gasoline, diesel, and hybrid cars." }
    ]
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
    features: ['Room Dimension Inputs', 'Window & Door Deductions', 'Number of Coats (1-3)', 'Gallon & Liter Coverage', 'Total Cost Breakdown'],
    howTo: [
      { title: "Enter Room Dimensions", desc: "Input the length, width, and wall height of the room in feet." },
      { title: "Specify Openings, Coats & Material Costs", desc: "Enter the number of doors and windows to subtract, choose 1 to 3 coats of paint, input paint price per gallon, and toggle primer or labor." },
      { title: "Review Paint Gallons & Budget Estimate", desc: "Inspect net paintable square footage, required paint and primer gallons, paint material cost, estimated labor, and total project budget." }
    ],
    faq: [
      { question: "How many square feet does one gallon of paint cover?", answer: "Standard architectural wall paint covers approximately 350 to 400 square feet per gallon on primed, smooth interior drywall." },
      { question: "How are door and window cutouts subtracted from total wall area?", answer: "Total gross wall area is 2 × (Length + Width) × Height. The calculator subtracts 21 square feet per standard door and 15 square feet per standard window to calculate net paintable surface." },
      { question: "Should I buy extra paint for touch-ups?", answer: "The calculator rounds gallon requirements up to the nearest whole container and applies standard coverage rates so you have adequate volume for touch-ups." },
      { question: "When should I include a separate primer coat in the calculation?", answer: "Toggling primer is recommended when painting bare unpainted drywall, patching large plaster repairs, transitioning from dark to light colors, or sealing porous masonry." },
      { question: "How is the optional professional labor cost estimated?", answer: "When labor is enabled, the tool multiplies your net paintable wall square footage by your custom labor rate per square foot (default $1.75/sq ft)." }
    ]
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
    features: ['Density = Mass / Volume', 'Common Material Presets', 'g/cm³, kg/m³, lb/ft³ Units', 'Solve for Any Variable', 'Buoyancy Indication'],
    howTo: [
      { title: "Choose Variable to Solve", desc: "Select whether you want to calculate Density (ρ = m/V), Mass (m = ρ × V), or Volume (V = m/ρ)." },
      { title: "Enter Input Values & Select Units", desc: "Type known parameters and select appropriate units (e.g. grams, kilograms, cm³, liters, m³) or pick a common material preset." },
      { title: "Review Calculated Value & Comparisons", desc: "View the computed result in multiple scientific units and compare your material against reference substances like water, steel, and gold." }
    ],
    faq: [
      { question: "What is the standard formula for physical density?", answer: "Density is defined as mass per unit volume: ρ = m / V, where ρ is density, m is total mass, and V is the physical volume occupied by the object." },
      { question: "What are the common scientific units for measuring density?", answer: "Standard metric units are grams per cubic centimeter (g/cm³) and kilograms per cubic meter (kg/m³). In imperial units, pounds per cubic foot (lb/ft³) is standard. (1 g/cm³ = 1,000 kg/m³)." },
      { question: "What is the reference density of pure water?", answer: "Pure liquid water at 4°C has a density of exactly 1.00 g/cm³ (1,000 kg/m³). Substances with density less than 1.0 g/cm³ float in water, while denser materials sink." },
      { question: "Can I choose from built-in material presets?", answer: "Yes. You can select common material presets including Aluminum (2.70 g/cm³), Steel/Iron (7.87 g/cm³), Copper (8.96 g/cm³), Silver (10.49 g/cm³), Gold (19.32 g/cm³), and Concrete (2.40 g/cm³)." },
      { question: "Does temperature affect material density?", answer: "Yes. Most materials expand when heated, increasing volume and slightly decreasing density. The reference presets in this tool represent standard room temperature values (20°C)." }
    ]
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
    features: ['16:9, 21:9, 16:10 Ratios', 'Physical Width & Height', 'Pixel Density (PPI) Matrix', '4K, 1440p, 1080p Presets', 'Display Area in cm² & in²'],
    howTo: [
      { title: "Enter Diagonal Screen Size", desc: "Type the screen diagonal measurement in inches (e.g. 24\", 27\", 32\", 55\", 65\")." },
      { title: "Select Aspect Ratio & Resolution", desc: "Choose an aspect ratio (16:9, 16:10, 21:9, 4:3, 3:2, 19.5:9) and select your display resolution (4K, 1440p, 1080p, Ultrawide, etc.)." },
      { title: "Review Physical Dimensions & PPI", desc: "Inspect calculated width and height in inches and centimeters, total screen display area, and pixel density (PPI)." }
    ],
    faq: [
      { question: "How are screen width and height calculated from diagonal size?", answer: "Using the Pythagorean theorem: Width = Diagonal × [AspectW / √(AspectW² + AspectH²)] and Height = Diagonal × [AspectH / √(AspectW² + AspectH²)]." },
      { question: "What is Pixels Per Inch (PPI) and why does it matter?", answer: "PPI measures pixel density: PPI = √(ResWidth² + ResHeight²) / Diagonal. Higher PPI results in sharper text and finer visual detail, with 100–140 PPI typical for desktop monitors and 220+ PPI for Retina laptops and smartphones." },
      { question: "Why do ultrawide 21:9 monitors have less height than 16:9 monitors of the same diagonal?", answer: "A wider aspect ratio stretches the diagonal horizontally. A 34-inch 21:9 monitor has approximately the same vertical height as a 27-inch 16:9 display, but offers 33% more horizontal desktop space." },
      { question: "Are dimensions displayed in both inches and centimeters?", answer: "Yes. Screen width, height, and diagonal are displayed in both imperial inches and metric centimeters alongside total square area." },
      { question: "What is dot pitch or pixel pitch?", answer: "Dot pitch is the physical distance between the centers of two adjacent pixels (in millimeters): Dot Pitch = 25.4 mm / PPI. Smaller dot pitch indicates a crisper display." }
    ]
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
    features: ['Lever Arm Force & Radius', 'Motor Power (kW) & RPM', 'Newton-Meters (N·m)', 'Foot-Pounds (ft·lb)', 'Angle of Applied Force'],
    howTo: [
      { title: "Select Calculation Mode", desc: "Choose Lever Arm Mode (Force × Distance) for mechanical wrenches and levers, or Motor Mode (Power & RPM) for rotating shafts." },
      { title: "Enter Mechanical Parameters", desc: "Input applied force and lever radius with angle in Lever mode; or input motor power (kW/HP) and rotational speed in RPM in Motor mode." },
      { title: "Inspect Torque in Multiple Units", desc: "Review calculated torque in Newton-meters (N·m), Foot-pounds (ft·lb), Inch-pounds (in·lb), and Kilogram-force meters (kgf·m)." }
    ],
    faq: [
      { question: "What is the formula for mechanical lever torque?", answer: "Torque is calculated by: τ = r × F × sin(θ), where r is the lever arm radius, F is applied force, and θ is the angle between force vector and lever arm (maximum at 90°)." },
      { question: "How is motor torque calculated from horsepower and RPM?", answer: "For electric motors and engines: Torque (N·m) = (9,548.8 × Power in kW) / RPM. In imperial units: Torque (ft·lb) = (5,252 × Horsepower) / RPM." },
      { question: "Why does torque decrease as motor RPM increases at constant power?", answer: "Power is the product of torque and angular velocity (P = τ × ω). If power output is fixed, increasing rotational speed requires torque to drop proportionally." },
      { question: "How do I convert between Newton-meters (N·m) and Foot-pounds (ft·lb)?", answer: "1 Newton-meter equals approximately 0.73756 Foot-pounds. 1 Foot-pound equals approximately 1.3558 Newton-meters. The tool automatically displays all equivalent units simultaneously." },
      { question: "Does the angle of force affect torque when using a wrench?", answer: "Yes. Maximum torque occurs when pulling perpendicular to the wrench handle (90°). Pulling at an angle reduces effective torque by the sine of that angle." }
    ]
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
    features: ['y = mx + b Equation', 'R² Goodness of Fit', 'Pearson Correlation (r)', 'Interactive X Predictor', 'Data Points Parser'],
    howTo: [
      { title: "Input Data Coordinates", desc: "Type or paste paired (X, Y) coordinate points separated by commas, spaces, or line breaks into the data editor." },
      { title: "Least-Squares Line Calculation", desc: "The calculator computes linear regression slope m, y-intercept b, Pearson correlation r, and r² coefficient of determination." },
      { title: "Predict Y & Copy Regression Stats", desc: "Enter any X value to predict its estimated Y outcome along the trendline and copy full regression statistics to clipboard." }
    ],
    faq: [
      { question: "What is the formula for the linear regression trendline?", answer: "The ordinary least-squares line is expressed as y = mx + b, where slope m = [nΣxy - (Σx)(Σy)] / [nΣx² - (Σx)²] and y-intercept b = (Σy - mΣx) / n." },
      { question: "What does the Pearson correlation coefficient (r) indicate?", answer: "Correlation r ranges from -1.0 to +1.0. A value near +1.0 indicates a strong positive linear relationship, -1.0 indicates a strong negative relationship, and 0 indicates no linear correlation." },
      { question: "What does the R-squared (r²) value represent?", answer: "The coefficient of determination (r²) represents the proportion of variance in the dependent variable Y that is predictable from independent variable X (e.g. r² = 0.85 means 85% of variance is explained by the model)." },
      { question: "Can I use the regression equation to predict unknown values?", answer: "Yes. Type any numeric value into the 'Predict Y for X' input box to calculate the exact projected point on the best-fit line." },
      { question: "What coordinate format should I use when pasting data?", answer: "Enter coordinates as paired values (e.g. '1, 2.5' or '1 2.5') with each pair on a new line or separated by semicolons." }
    ]
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
    features: ['Web Crypto API', 'Real-Time Digest Calculation', 'Hex Uppercase/Lowercase', 'Checksum Match Verification', 'Client-Side Processing'],
    howTo: [
      { title: "Input Text to Hash", desc: "Type or paste your string, password, payload, or token into the input editor." },
      { title: "Compute SHA-256 Checksum", desc: "The hash is calculated instantly via the Web Crypto API on every keystroke." },
      { title: "Copy 64-Character Hexadecimal Digest", desc: "Review the 256-bit hash string and click Copy to clipboard for verification or cryptographic signatures." }
    ],
    faq: [
      { question: "What is SHA-256 and how long is the output hash?", answer: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed 64-character hexadecimal string (256 bits) from any arbitrary input data." },
      { question: "How is the hash computed securely in this tool?", answer: "It uses the browser's hardware-accelerated Web Crypto API (crypto.subtle.digest('SHA-256', buffer)), ensuring cryptographic accuracy and speed." },
      { question: "Can SHA-256 hashes be reversed back into the original text?", answer: "No. Cryptographic hash functions are one-way mathematical functions; it is computationally infeasible to invert a SHA-256 digest back into its original input." },
      { question: "Can I toggle uppercase and lowercase hex output?", answer: "Yes. You can copy the standard lowercase hex string or toggle uppercase output for specific database requirements." },
      { question: "Is my plaintext input sent over the internet?", answer: "No. The hashing execution occurs locally on your device with complete privacy." }
    ]
  },
  {
    id: 'us-income-tax-calculator',
    title: 'US Income Tax Calculator — Latest Federal Brackets & FICA',
    navTitle: 'US Tax Calculator',
    description: 'Calculate latest IRS federal income tax brackets (2025/2026), FICA taxes (Social Security & Medicare), and estimated paycheck take-home pay.',
    icon: '🇺🇸',
    path: '/us-income-tax-calculator.html',
    filename: 'us-income-tax-calculator.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: ['Latest IRS Brackets (2025/2026)', 'All 4 Filing Statuses', 'FICA (Social Security & Medicare)', 'State Income Tax Simulator', 'Paycheck Pay (Bi-weekly & Monthly)'],
    howTo: [
      { title: "Enter Gross Annual Income", desc: "Input your total yearly pre-tax earnings from wages, salaries, and business income." },
      { title: "Select Filing Status & Deductions", desc: "Choose Single, Married Filing Jointly, Married Filing Separately, or Head of Household, and enter pre-tax deductions (401k, HSA, health insurance)." },
      { title: "Review Federal Tax & FICA Breakdown", desc: "Inspect your standard deduction, taxable income, federal income tax brackets, FICA taxes (Social Security & Medicare), and estimated take-home pay." }
    ],
    faq: [
      { question: "Which tax year and brackets are implemented in this calculator?", answer: "This tool implements official IRS federal income tax brackets for 2025 and 2026 (10%, 12%, 22%, 24%, 32%, 35%, and 37%), as well as reference 2024 brackets." },
      { question: "What are the latest standard deduction amounts?", answer: "For 2025, standard deductions are: Single ($15,000), Married Filing Jointly ($30,000), Married Filing Separately ($15,000), and Head of Household ($22,500)." },
      { question: "How are FICA Social Security and Medicare taxes calculated?", answer: "Social Security tax is 6.2% on earnings up to the IRS wage base limit ($176,100 for 2025). Medicare tax is 1.45% on all earnings, plus an additional 0.9% surtax for high earners above threshold limits." },
      { question: "What is the difference between Marginal Tax Rate and Effective Tax Rate?", answer: "Your Marginal Tax Rate is the highest tax bracket applied to your top dollar of income. Your Effective Tax Rate is the actual blended percentage of total income paid in tax (Total Tax / Gross Income × 100)." },
      { question: "Does this calculator include state or local income taxes?", answer: "Yes! This tool includes an integrated state income tax simulator featuring states with 0% tax (like Texas and Florida) as well as common progressive and flat tax states." }
    ]
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
    features: ['Monthly EMI Calculation', 'Origination Fee Deduction', 'Net Funded Cash Amount', 'Total Interest Cost', 'Amortization Breakdown'],
    howTo: [
      { title: "Enter Loan Amount & Interest Rate", desc: "Input the requested personal loan borrowing amount and the lender's annual percentage rate (APR)." },
      { title: "Set Loan Duration & Origination Fee", desc: "Select the loan term in months (e.g. 12, 24, 36, 48, 60 months) and enter any upfront origination fee percentage." },
      { title: "Review Monthly Payment & Net Cash", desc: "Inspect your fixed monthly payment, total interest cost, upfront fee deducted, and the net cash actually disbursed to your bank account." }
    ],
    faq: [
      { question: "What is a personal loan origination fee?", answer: "An origination fee is an upfront administrative fee charged by lenders (typically 1% to 8%) deducted directly from your loan proceeds before funds are disbursed." },
      { question: "How does the origination fee affect net disbursed cash?", answer: "If you borrow $10,000 with a 5% origination fee, $500 is deducted upfront and you receive $9,500 in cash, while you repay interest and principal on the full $10,000." },
      { question: "How is the monthly personal loan installment calculated?", answer: "The payment is calculated using standard fixed monthly amortization: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is loan principal, r is monthly interest rate, and n is loan term in months." },
      { question: "Can I pay off my personal loan early to save interest?", answer: "Most modern personal loans have no prepayment penalties. Paying extra principal early reduces remaining balance and shortens your repayment period." },
      { question: "Does this calculator check or affect my credit score?", answer: "No. This is a local mathematical planning tool running in your browser; it does not connect to credit bureaus or perform credit inquiries." }
    ]
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
    features: ['Primary Markdown Discount', 'Stacked Coupon Discount', 'Sales Tax Calculation', 'Total Savings Dollar & %', 'Quick Sales Presets'],
    howTo: [
      { title: "Enter Original Item Price", desc: "Input the initial retail sticker price of the merchandise." },
      { title: "Add Primary Discount & Stacked Coupon", desc: "Enter the store markdown percentage (e.g. 25%) and input an additional promo code or store coupon percentage (e.g. 10%)." },
      { title: "Review Savings & Final Register Price", desc: "Review your initial discount, secondary coupon savings, total combined percentage saved, sales tax, and final checkout price." }
    ],
    faq: [
      { question: "How do stacked discounts calculate (e.g. 25% off plus extra 10% coupon)?", answer: "Retailers apply the secondary coupon to the already-discounted price, not the original price. For a $100 item: 25% off = $75, then 10% off $75 = $7.50, resulting in a $67.50 price (32.5% effective savings, not 35%)." },
      { question: "How does sales tax apply to discounted merchandise?", answer: "In most retail jurisdictions, sales tax is assessed on the final discounted price after all coupons have been deducted." },
      { question: "Can I calculate single-discount sales without a coupon?", answer: "Yes. Simply leave the extra coupon percentage field set to 0% to calculate standard single-discount sale prices." },
      { question: "Does the tool show total combined dollar savings?", answer: "Yes. The summary breakdown displays exact dollar savings from the primary discount, additional coupon savings, total combined dollar discount, and net effective percentage saved." },
      { question: "Are prices formatted with accurate currency rounding?", answer: "Yes. All price calculations round to standard two decimal places matching retail cash register checkout totals." }
    ]
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
    features: ['RFC 1321 Pure MD5 Engine', 'Instant Live Hashing', 'Uppercase & Lowercase Hex', 'Checksum Verifier Matcher', 'In-Browser Processing'],
    howTo: [
      { title: "Enter String or Message", desc: "Input your text, identifier, or legacy checksum payload into the editor." },
      { title: "Compute MD5 128-Bit Digest", desc: "The tool processes the input through the MD5 hashing algorithm in real time." },
      { title: "Copy 32-Character Hex Digest", desc: "Review the 32-character hexadecimal hash and click Copy to clipboard for database lookups or file verification." }
    ],
    faq: [
      { question: "What is MD5 and what is its standard output length?", answer: "MD5 (Message Digest Algorithm 5) produces a 128-bit hash value, commonly represented as a 32-character hexadecimal string." },
      { question: "Is MD5 recommended for modern password security?", answer: "No. MD5 has known cryptographic collision vulnerabilities and should not be used for secure password storage or digital certificates; use SHA-256 or bcrypt instead. MD5 remains useful for non-security checksums and legacy database keys." },
      { question: "Does the generator support UTF-8 strings?", answer: "Yes. Multibyte UTF-8 characters and accented text are encoded properly into binary byte arrays prior to MD5 computation." },
      { question: "Can I generate uppercase and lowercase MD5 digests?", answer: "Yes. You can switch between standard lowercase and uppercase output formats with one click." },
      { question: "Are input messages uploaded to a server?", answer: "No. MD5 hashing executes client-side in browser memory with zero network requests." }
    ]
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
    features: ['Fullwidth Unicode (0xFF01-0xFF5E)', 'Spaced & Double Spaced', 'Squared Unicode Box Letters', 'One-Click Copy', 'Aesthetic Presets'],
    howTo: [
      { title: "Type Standard Text", desc: "Input alphanumeric text or messages into the text editor." },
      { title: "Select Fullwidth Aesthetic Style", desc: "Choose classic Fullwidth Vaporwave spacing, spaced letters, or aesthetic block characters." },
      { title: "Copy Wide Text for Social Media", desc: "Click Copy to grab the transformed fullwidth Unicode string ready for Discord, Twitter, or Instagram bios." }
    ],
    faq: [
      { question: "How does the Wide Text Generator create aesthetic vaporwave text?", answer: "It maps standard ASCII character codes to the Unicode Halfwidth and Fullwidth Forms block (U+FF01 to U+FF5E), creating wide monospace characters." },
      { question: "Will wide text display correctly across all devices and phones?", answer: "Yes. Fullwidth glyphs are part of the universal Unicode standard supported natively on iOS, Android, macOS, Windows, and Linux." },
      { question: "Can I use wide text in Discord nicknames, usernames, and game handles?", answer: "Yes. Most gaming platforms and social apps accept fullwidth Unicode characters in status messages, bios, and display names." },
      { question: "Does the generator alter numbers and punctuation?", answer: "Yes. Fullwidth numbers (０-９) and punctuation marks (！, ？, ：) are mapped alongside alphabetical letters for consistent wide spacing." },
      { question: "Is text conversion performed locally?", answer: "Yes. Character mapping is computed instantly client-side without any server API calls." }
    ]
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
    features: ['Real-Time WPM & CPM Calculation', 'Keystroke Accuracy Tracking', '15s, 30s, 60s & 120s Timers', 'Live Error Highlighting', 'Client-Side Processing'],
    howTo: [
      { title: "Select Test Duration & Difficulty", desc: "Choose 1-minute, 2-minute, or 3-minute timed tests with common words, quotes, or coding syntax." },
      { title: "Type the Displayed Text", desc: "Type words as they highlight in real time, with immediate color feedback for correct (green) and incorrect (red) keystrokes." },
      { title: "Review WPM & Accuracy Metrics", desc: "Inspect your net Words Per Minute (WPM), Gross WPM, raw keystroke accuracy percentage, and error breakdown." }
    ],
    faq: [
      { question: "How is net Words Per Minute (WPM) calculated?", answer: "Standard typing speed calculates 1 word as 5 keystrokes: Net WPM = (Total Keystrokes / 5 - Uncorrected Errors) / Time in Minutes." },
      { question: "What is the difference between Gross WPM and Net WPM?", answer: "Gross WPM measures raw typing speed regardless of mistakes. Net WPM penalizes typographical errors, providing a realistic measure of productive typing throughput." },
      { question: "Can I practice typing programming code snippets?", answer: "Yes. Switch to 'Coding Mode' to practice typing JavaScript, Python, HTML, and syntax symbols like brackets, braces, and semicolons." },
      { question: "Can I view my typing history and improvement streaks?", answer: "Yes. Your recent test scores and accuracy metrics are saved in local browser storage to track your typing improvement over time." },
      { question: "Does the test require any software installation?", answer: "No. The typing engine runs in your web browser with millisecond keystroke latency tracking." }
    ]
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
    features: ['Reverse Characters & Letters', 'Reverse Word Order', 'Reverse Lines Upside Down', 'Live Character & Word Counts', 'Instant Copy & Download'],
    howTo: [
      { title: "Input Text to Reverse", desc: "Type or paste words, phrases, or multi-line paragraphs into the input box." },
      { title: "Choose Reversal Direction", desc: "Select Reverse Entire Text, Reverse Each Word, Reverse Word Order Only, or Flip Upside Down." },
      { title: "Copy Reversed Output", desc: "Inspect the flipped or reversed text and click Copy to clipboard." }
    ],
    faq: [
      { question: "What is the difference between reversing text and reversing word order?", answer: "Reversing text turns 'hello world' into 'dlrow olleh' (character level). Reversing word order turns 'hello world' into 'world hello' while keeping individual words readable." },
      { question: "How does the Reverse Each Word mode work?", answer: "It preserves sentence word sequence while reversing the internal letters of each individual word (e.g. 'hello world' becomes 'olleh dlrow')." },
      { question: "Does the reverser support multi-line poems and paragraphs?", answer: "Yes. You can choose whether to reverse line order from bottom to top or maintain paragraph line structure." },
      { question: "How does upside-down text flipping work?", answer: "It maps standard Latin alphabet characters to phonetic upside-down Unicode equivalents (such as ɐ for a and ɥ for h)." },
      { question: "Are my messages processed securely?", answer: "Yes. String reversal algorithms run client-side in browser memory with zero network footprint." }
    ]
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
    features: ['Strip All Line Breaks', 'Preserve Double Paragraph Breaks', 'Custom Delimiter Replacement', 'Trim Extra Whitespace', 'Instant Export'],
    howTo: [
      { title: "Paste Segmented Text", desc: "Input paragraphs copied from PDF columns, OCR scans, or emails that have broken lines." },
      { title: "Select Line Break Replacement", desc: "Choose to replace line breaks with spaces, completely remove them, or preserve double paragraph breaks while removing single wraps." },
      { title: "Copy Reflowed Paragraphs", desc: "Review the unified, continuous text block and click Copy to clipboard." }
    ],
    faq: [
      { question: "Why do texts copied from PDF documents contain unwanted line breaks?", answer: "PDF files store text using physical print coordinates rather than semantic paragraph flow, causing line breaks at every visual margin wrap." },
      { question: "Can I preserve paragraph separations while fixing broken single lines?", answer: "Yes. The 'Preserve Paragraphs' option retains double line breaks (\n\n) while joining single broken line ends into smooth continuous sentences." },
      { question: "Does the tool automatically clean up hyphenated words broken across lines?", answer: "Yes. It detects trailing hyphens at line endings (e.g. 'infor-\nmation') and merges them back into single unbroken words ('information')." },
      { question: "Can I replace line breaks with custom delimiters like commas or semicolons?", answer: "Yes. You can specify a custom character or string delimiter to replace every newline character." },
      { question: "Is any text stored on external servers?", answer: "No. Regex string normalization executes completely in your web browser." }
    ]
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
    features: ['Collapse Multiple Spaces to Single Space', 'Trim Leading & Trailing Spaces', 'Remove Empty Blank Lines', 'Real-Time Space Savings Counter', '1-Click Copy'],
    howTo: [
      { title: "Paste Spaced Text", desc: "Enter text containing multiple spaces between words, uneven indents, or trailing whitespace." },
      { title: "Select Space Cleanup Rules", desc: "Toggle Remove Multiple Spaces to Single Space, Trim Leading/Trailing Whitespace, and Remove Empty Lines." },
      { title: "Copy Compact Clean Text", desc: "Review the normalized spacing and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does this tool collapse repeated spaces?", answer: "It uses regular expressions to replace instances of two or more consecutive spaces with a single standard ASCII space." },
      { question: "Does it remove invisible non-breaking spaces (NBSP)?", answer: "Yes. The cleaner normalizes non-breaking spaces (&nbsp; / U+00A0) and zero-width spaces into standard ASCII spacing." },
      { question: "Can I trim trailing spaces from the end of every line?", answer: "Yes. The line-trimming feature strips redundant spaces from the end of each line without altering word spacing inside lines." },
      { question: "Will this break intentional multi-line paragraphs?", answer: "No. Unless you specifically choose to collapse line breaks, existing newlines are preserved while horizontal space between words is normalized." },
      { question: "Is text processing private and safe?", answer: "Yes. Whitespace normalization occurs locally in browser memory." }
    ]
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
    features: ['Repeat up to 10,000 Times', 'Custom Separators & Newlines', 'Number Each Repetition Option', 'Quick Count Presets', 'One-Click Copy & Download'],
    howTo: [
      { title: "Enter Message or Text to Repeat", desc: "Type words, phrases, or emojis that you want to duplicate." },
      { title: "Set Repetition Count & Delimiter", desc: "Specify the number of repeats (e.g. 10 to 10,000) and choose separation: Space, Newline, Comma, or Custom delimiter." },
      { title: "Generate and Copy Repeated Text", desc: "Click Repeat, inspect the output character count, and click Copy to clipboard." }
    ],
    faq: [
      { question: "What is the maximum number of times I can repeat text?", answer: "You can repeat text up to 10,000 times safely without browser freezing or memory overflow." },
      { question: "Can I add numbering or index tags to each repeated line?", answer: "Yes. Toggling the 'Add Line Numbers' option prepends sequential numbers (1., 2., 3.) before each repeated instance." },
      { question: "Can I repeat emojis and special characters?", answer: "Yes. Full Unicode and emoji sequences are supported without corruption or encoding issues." },
      { question: "How fast is generating thousands of repeated words?", answer: "Generation is virtually instantaneous, utilizing native JavaScript array creation and string joining." },
      { question: "Is repeated text sent to any server?", answer: "No. All text repetition string construction executes client-side in browser memory." }
    ]
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
    features: ['Split by Delimiter or Regex', 'Split by Fixed Character Chunk Size', 'Preview Chunks with Length Stats', 'Copy Individual or All Chunks', 'ZIP / TXT Export'],
    howTo: [
      { title: "Paste Raw Text Block", desc: "Enter a large block of text, CSV records, or code into the input pane." },
      { title: "Choose Splitting Delimiter or Size", desc: "Split by Newline, Comma, Custom Character/Regex, or by fixed Character/Word count chunks." },
      { title: "Inspect Segments & Copy Results", desc: "Review individual segment cards, view chunk counts, and copy individual pieces or export all chunks as files." }
    ],
    faq: [
      { question: "Can I split text into chunks suitable for AI prompt token limits?", answer: "Yes. You can specify a maximum character or word threshold per chunk to partition large documents into manageable sections for AI chat tools." },
      { question: "Does the splitter support regular expressions as delimiters?", answer: "Yes. You can enter custom regex patterns (like \\d+\\. or ;\\s*) to split on complex headings or numbering systems." },
      { question: "How does word-aware chunk splitting work?", answer: "When splitting by size, word-boundary preservation ensures the tool does not chop words in half, finding the nearest preceding space." },
      { question: "Can I download each chunk as an individual text file?", answer: "Yes. You can export all split parts as a zipped archive of individual .txt files for batch processing." },
      { question: "Is my document data kept private?", answer: "Yes. All string partitioning and array transformations occur strictly in browser memory." }
    ]
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
    features: ['Join with Comma, Semicolon, Space or Custom Separator', 'Prefix and Suffix Enclosing', 'Trim Whitespace & Skip Empty Lines', 'Real-Time Merging', '1-Click Copy'],
    howTo: [
      { title: "Input Lines or Segments", desc: "Paste individual lines, list items, or sentences that need combining." },
      { title: "Select Join Delimiter & Enclosure", desc: "Choose join delimiter: Comma, Semicolon, Space, Pipe (|), or Custom string, and optionally wrap each item in quotes." },
      { title: "Copy Merged Single-Line Output", desc: "Review the joined string in the output box and click Copy to clipboard for SQL IN queries, CSV arrays, or code lists." }
    ],
    faq: [
      { question: "Can this tool format items for SQL IN clauses?", answer: "Yes. Select comma as delimiter and enable single quote enclosure to format items instantly as 'val1', 'val2', 'val3'." },
      { question: "Does the joiner skip empty lines automatically?", answer: "Yes. An optional 'Ignore Empty Lines' toggle prevents redundant adjacent delimiters from appearing in your joined output." },
      { question: "Can I wrap items in custom prefix and suffix characters?", answer: "Yes. You can specify custom prefixes and suffixes (such as parentheses, brackets, or double quotes) around each individual line item." },
      { question: "Can I sort lines before joining them?", answer: "Yes. An integrated sort toggle organizes list items alphabetically before merging." },
      { question: "Are list items transmitted to an external server?", answer: "No. Array filtering, mapping, and joining execute entirely in client-side JavaScript." }
    ]
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
    features: ['RFC 5322 Compliant Email Extraction', 'Automatic Duplicate Removal', 'Domain Grouping & Filtering', 'Alphabetical Sorting', 'Export to CSV & TXT'],
    howTo: [
      { title: "Paste Raw Text or Document Source", desc: "Input raw text, scraped web pages, email correspondence, or support ticket dumps." },
      { title: "Configure Extraction and Filter Rules", desc: "Toggle Deduplicate Emails, Sort Alphabetically, and filter by specific top-level domain or company domain name." },
      { title: "Copy Clean Email Addresses", desc: "Review the verified address count and click Copy or download a newline-separated list." }
    ],
    faq: [
      { question: "What regular expression standard is used to identify email addresses?", answer: "The extractor uses an RFC-5322 compliant regex pattern that reliably matches standard alphanumeric usernames, subdomains, and modern generic TLDs." },
      { question: "Can I filter extracted emails to specific domain names?", answer: "Yes. Enter a domain filter (e.g. 'gmail.com' or 'company.org') to isolate only emails matching your target organization." },
      { question: "How does the tool handle obfuscated emails (like user [at] domain [dot] com)?", answer: "The de-obfuscation feature normalizes common anti-spam formatting into standard usable email syntax before extraction." },
      { question: "Does the email extractor eliminate duplicates?", answer: "Yes. Case-insensitive deduplication ensures each distinct email address appears only once in your final output." },
      { question: "Are extracted emails uploaded or harvested to a server?", answer: "No. Scanning and extraction occur locally in your browser session. Zubware does not collect, record, or store extracted addresses." }
    ]
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
    features: ['1-Word, 2-Word & 3-Word N-Gram Extraction', 'Automatic Stop Words Filter', 'Keyword Density Percentage Calculation', 'Sort by Count or Alphabetical', 'CSV Data Export'],
    howTo: [
      { title: "Paste Article or Copy", desc: "Enter your blog post, product description, or competitor text into the analysis editor." },
      { title: "Configure Minimum Length & Stopwords", desc: "Set minimum word length, select 1-word, 2-word, or 3-word n-gram phrases, and enable stopword filtering." },
      { title: "Review Keyword Density & Export", desc: "Inspect frequency counts, percentage density metrics, and copy the top SEO keywords list." }
    ],
    faq: [
      { question: "How are stop words handled in keyword extraction?", answer: "A comprehensive English stopword dictionary filters out common grammatical fillers (e.g., 'the', 'with', 'about') so only meaningful topical keywords appear." },
      { question: "Can this tool extract multi-word keyword phrases (n-grams)?", answer: "Yes. You can switch between unigrams (single words), bigrams (2-word phrases), and trigrams (3-word phrases) to detect long-tail keywords." },
      { question: "What is keyword density and how is it calculated?", answer: "Keyword density measures the percentage frequency of a term relative to total document words: (keyword occurrences / total word count) * 100." },
      { question: "How does keyword extraction help SEO content writing?", answer: "It reveals overused terms (preventing keyword stuffing penalties) and verifies that primary search intent topics appear naturally throughout the text." },
      { question: "Is my proprietary article text uploaded to a server?", answer: "No. Tokenization, frequency mapping, and density calculations execute entirely in local browser memory." }
    ]
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
    features: ['Named & Numeric Entity Support', 'Dual Encode & Decode Modes', 'Special Character Quick Reference Table', 'Real-Time Conversion', 'One-Click Copy'],
    howTo: [
      { title: "Enter Text or Entity Markup", desc: "Input raw text to encode into HTML entities, or paste encoded entities (&amp;, &lt;, &euro;) to decode." },
      { title: "Select Encoding Scope & Format", desc: "Choose Named Entities (e.g. &copy;), Decimal Entities (&#169;), or Hexadecimal Entities (&#xA9;), and set encoding scope (All characters vs Special symbols only)." },
      { title: "Copy Converted String", desc: "Review the converted result in the preview box and click Copy to clipboard." }
    ],
    faq: [
      { question: "What is the difference between Named, Decimal, and Hexadecimal entities?", answer: "Named entities use mnemonic names (e.g. &amp; for &), decimal entities use character code points in base 10 (&#38;), and hex entities use base 16 (&#x26;)." },
      { question: "Why should special characters be converted to HTML entities?", answer: "Encoding reserved characters (<, >, &, \", ') prevents browsers from misinterpreting text as HTML tags, avoiding broken layouts and cross-site scripting vulnerabilities." },
      { question: "Can I encode all non-ASCII characters for strict email templates?", answer: "Yes. The 'Encode All Non-ASCII' mode converts foreign alphabets, symbols, and mathematical glyphs into safe ASCII entity references for legacy email clients." },
      { question: "Does decoding handle both named and numeric entities?", answer: "Yes. The decoder parses standard HTML5 named entities as well as decimal and hexadecimal numeric references." },
      { question: "Is processing performed locally?", answer: "Yes. String parsing executes client-side in browser memory with zero tracking." }
    ]
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
    features: ['8-Bit UTF-8 Byte Stream Encoding', 'Configurable Delimiters (Space, None, Comma, Dash)', 'Bit Length Counter', 'Instant Copy & Download', 'Client-Side Processing'],
    howTo: [
      { title: "Type or Paste Plain Text", desc: "Enter words, letters, or sentences into the text conversion area." },
      { title: "Select Binary Formatting Options", desc: "Choose byte delimiter: Space (8-bit blocks), None, Comma, or Prefix (0b), and set byte padding to 8-bit." },
      { title: "Copy Converted Binary 0s and 1s", desc: "Review the binary string output and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does Text to Binary conversion work?", answer: "Each character is mapped to its ASCII or UTF-8 character code, which is converted into an 8-bit binary representation of 0s and 1s (e.g. 'A' = 65 = 01000001)." },
      { question: "Does the converter support multi-byte Unicode characters and emojis?", answer: "Yes. It uses UTF-8 byte serialization, encoding emojis and accented characters into their complete 2, 3, or 4-byte binary sequences." },
      { question: "Can I format output with 8-bit spacing?", answer: "Yes. By default, binary output is grouped into clean 8-bit octets separated by spaces for readability." },
      { question: "Is there a character limit when converting text?", answer: "No practical limit exists; thousands of characters convert to binary in milliseconds." },
      { question: "Are messages uploaded to external servers?", answer: "No. Character code conversions execute locally in your web browser." }
    ]
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
    features: ['Automatic Delimiter Detection', 'Binary Syntax & Character Validation', 'Instant UTF-8 String Decoding', 'Sample Loader', '1-Click Copy'],
    howTo: [
      { title: "Paste Binary Numbers", desc: "Enter binary strings composed of 0s and 1s (with or without spaces between bytes)." },
      { title: "Select Byte Delimiter Mode", desc: "Choose Auto-Detect, 8-bit Spaced, or Continuous string mode to match your binary format." },
      { title: "Decode & Copy Readable Text", desc: "Review the decoded plaintext in the output area and click Copy to clipboard." }
    ],
    faq: [
      { question: "Can the decoder handle binary strings without spaces?", answer: "Yes. In continuous mode, the parser slices the binary sequence into 8-bit chunks automatically to decode the characters." },
      { question: "What happens if a binary string contains invalid characters?", answer: "The decoder validates input and flags non-binary digits (any characters other than 0 and 1) before decoding." },
      { question: "Can it decode multi-byte UTF-8 character sequences?", answer: "Yes. Multi-byte sequences are reassembled into their original Unicode characters, correctly rendering accented letters and symbols." },
      { question: "Can I handle binary strings with 0b prefixes?", answer: "Yes. The parser automatically strips common programming prefixes like 0b before parsing byte values." },
      { question: "Is binary decoding performed client-side?", answer: "Yes. String decoding executes entirely in local browser memory with complete privacy." }
    ]
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
    features: ['Space, None, Colon, 0x Prefixes', 'Uppercase & Lowercase Hex Toggle', 'UTF-8 Multi-Byte Character Support', 'Live Conversion', 'Copy & Download'],
    howTo: [
      { title: "Enter Plaintext Input", desc: "Type or paste words, code, or strings into the text editor." },
      { title: "Choose Hex Delimiter & Prefix", desc: "Select delimiter: Space, None, Comma, Colon (:), or Prefix (0x or \\x), and toggle uppercase/lowercase hex." },
      { title: "Copy Converted Hexadecimal String", desc: "Review the hex byte representation and click Copy to clipboard." }
    ],
    faq: [
      { question: "How does Text to Hex conversion work?", answer: "Each character's UTF-8 byte code is converted into its 2-digit base-16 hexadecimal representation (e.g. 'A' = 0x41)." },
      { question: "Can I format hex strings for C/C++ or Python code arrays?", answer: "Yes. You can select '0x' or '\\x' prefixing with comma separation to format byte arrays for programming languages." },
      { question: "Does it support UTF-8 multibyte characters?", answer: "Yes. Accented characters and emojis are converted into their full sequence of hex bytes." },
      { question: "Can I toggle uppercase and lowercase hex letters?", answer: "Yes. You can output standard lowercase (e.g. 4a 6f 62) or uppercase (4A 6F 62) hex characters." },
      { question: "Is my text data stored or sent to a server?", answer: "No. Conversion logic operates locally in your browser memory." }
    ]
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
    features: ['Supports 0x, Colon, Space or Continuous Hex', 'Invalid Hex Character Detection', 'UTF-8 Decoder', 'Quick Sample Loader', 'Instant Copy'],
    howTo: [
      { title: "Paste Hexadecimal String", desc: "Enter hex byte values (e.g. '48 65 6c 6c 6f' or '48656c6c6f') into the decoder." },
      { title: "Configure Delimiter & Auto-Detection", desc: "The parser auto-strips spaces, colons, commas, 0x, and \\x prefixes before decoding bytes." },
      { title: "Copy Decoded Plaintext", desc: "Review the recovered ASCII/UTF-8 text in the output box and click Copy to clipboard." }
    ],
    faq: [
      { question: "Can this tool decode hex strings with 0x or \\x prefixes?", answer: "Yes. It automatically cleans programming prefixes (0x, \\x) and separators (spaces, colons, commas) before decoding." },
      { question: "How does the tool handle odd-length hex strings?", answer: "If a hex string has an odd number of characters, the parser alerts you to an incomplete byte or prepends a leading zero." },
      { question: "Can it decode multi-byte UTF-8 characters and emojis?", answer: "Yes. Multi-byte hex sequences (e.g. 'f0 9f 9a 80') are decoded back into their original Unicode emojis and characters." },
      { question: "What if the hex string contains non-hex characters?", answer: "The validator flags characters outside the valid 0-9 and A-F range, identifying invalid byte entries." },
      { question: "Is hex decoding private?", answer: "Yes. Hex decoding executes client-side in browser memory without sending data to Zubware servers." }
    ]
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
    features: ['Strip Comments & Unnecessary Whitespace', 'Accurate Byte & Compression Ratio Counter', 'Safe Production Output', '1-Click Copy', 'Download styles.min.css'],
    howTo: [
      { title: "Paste CSS Stylesheet", desc: "Input unminified CSS files or stylesheet code into the compression pane." },
      { title: "Configure Minification Settings", desc: "Toggle stripping comments, removing redundant semicolons, collapsing zero units (0px to 0), and shortening hex colors (#ffffff to #fff)." },
      { title: "Copy Minified CSS & Inspect File Size Savings", desc: "Review the byte savings metric and click Copy or download your production-ready .min.css file." }
    ],
    faq: [
      { question: "How does CSS minification improve website page speed?", answer: "It removes comments, unnecessary whitespace, redundant semicolons, and shortens color codes, reducing stylesheet download size by 20% to 50% for faster First Contentful Paint (FCP)." },
      { question: "Does minifying CSS alter visual design or layout rules?", answer: "No. The minification process strictly strips non-functional whitespace and comments without modifying selector hierarchy, specificity, or property values." },
      { question: "Can I preserve copyright banners and license comments?", answer: "Yes. Check 'Keep Important Comments' to preserve license headers starting with /*! or /*@." },
      { question: "Does it optimize colors and zero values?", answer: "Yes. It converts 6-character hex codes to 3 characters where possible (#000000 to #000) and strips units from zero values (0px to 0)." },
      { question: "Does minification execute safely without uploading CSS to a server?", answer: "Yes. All whitespace removal, comment stripping, and color optimizations run locally in your browser memory." }
    ]
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
    features: ['Strip Single-line & Multi-line Comments', 'Whitespace Optimization', 'File Size Savings Statistics', 'Copy Minified Code', 'Download script.min.js'],
    howTo: [
      { title: "Paste JavaScript Code", desc: "Enter full JavaScript or TypeScript scripts into the input editor." },
      { title: "Select Minification & Strip Options", desc: "Toggle Remove Comments, Strip Console Logs (console.log), and Compress Whitespace." },
      { title: "Copy Production-Ready Script", desc: "Review the compressed one-line script and download a production .min.js file." }
    ],
    faq: [
      { question: "Does this minifier remove console.log statements?", answer: "Yes. You can enable the 'Strip Console Logs' option to remove debugging console calls from production builds." },
      { question: "How does JS minification reduce bundle size?", answer: "It strips comments, indentation, and unnecessary line breaks while preserving valid semicolon statement boundaries, significantly reducing file transfer size." },
      { question: "Does it support modern ES6+ syntax?", answer: "Yes. The parser supports modern ECMAScript features including arrow functions, classes, template literals, and async/await." },
      { question: "Can I preserve license header comments?", answer: "Yes. Comments marked with /*! are recognized as legal license headers and preserved at the top of the output file." },
      { question: "Is proprietary code uploaded to Zubware servers?", answer: "No. All minification executes client-side in browser memory with complete confidentiality." }
    ]
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
    features: ['Preserve pre, code, script and style Blocks', 'Optional HTML Comment Removal', 'Intra-tag Whitespace Collapsing', 'Savings Ratio Tracker', 'Download index.min.html'],
    howTo: [
      { title: "Paste Raw HTML Markup", desc: "Input complete HTML pages or component templates into the compression box." },
      { title: "Select Compression Level", desc: "Toggle Remove HTML Comments, Collapse Whitespace, Strip Optional End Tags, and Minify Inline CSS/JS." },
      { title: "Copy Compact HTML & View Compression Ratio", desc: "Inspect the file size savings percentage and copy the compressed markup or download index.min.html." }
    ],
    faq: [
      { question: "How does HTML minification improve SEO and Core Web Vitals?", answer: "Smaller HTML documents reduce Time to First Byte (TTFB) and DOM parsing time, leading to faster First Contentful Paint (FCP) and improved mobile search rankings." },
      { question: "Does HTML minification break <pre> and <code> code blocks?", answer: "No. Text within <pre>, <code>, and <textarea> tags is protected to preserve code indentation and preformatted spacing." },
      { question: "Can it minify inline <style> and <script> tags simultaneously?", answer: "Yes. Enabling the inline minifier compresses embedded CSS stylesheets and JavaScript blocks within the HTML." },
      { question: "Does it remove conditional comments for legacy Internet Explorer?", answer: "You can choose to preserve conditional comments (<!--[if IE]>) or strip all comments completely." },
      { question: "Is my HTML source code secure?", answer: "Yes. All parsing and minification execute locally in your browser session." }
    ]
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
    features: ['Safe String Literal Preservation', 'Strip -- and /* */ Comments', 'Single-Line Query Formatting', 'Byte Reduction Stats', 'Download query.min.sql'],
    howTo: [
      { title: "Paste Multi-Line SQL Script", desc: "Input formatted or indented SQL database queries and migration scripts." },
      { title: "Minify SQL Query", desc: "Click Minify SQL to strip line breaks, indentation, and single-line (-- ) and multi-line (/* */) comments." },
      { title: "Copy Single-Line Query String", desc: "Copy the compact single-line query string for embedding into application source code or API payloads." }
    ],
    faq: [
      { question: "Why minify SQL queries into single lines?", answer: "Single-line minified SQL strings are easy to embed into programming language source files, environment variables, and log strings without multi-line escaping errors." },
      { question: "Does the minifier remove SQL comments safely?", answer: "Yes. It removes single-line comments (-- comment) and block comments (/* comment */) without breaking string literals." },
      { question: "Are spaces preserved inside quoted text strings?", answer: "Yes. Spaces and punctuation inside single-quoted strings (e.g. 'New York City') are strictly preserved." },
      { question: "Does it support multiple SQL statements separated by semicolons?", answer: "Yes. Multiple queries separated by semicolons remain intact on a single line." },
      { question: "Is my SQL schema transmitted over the network?", answer: "No. Minification executes locally in browser memory." }
    ]
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
    features: ['Standard Meta Tags (Title, Description, Canonical)', 'Open Graph & Twitter Cards', 'Live Google SERP Card Preview', 'Live Social Share Card Preview', 'Copy HTML & Download'],
    howTo: [
      { title: "Enter Webpage Title & Description", desc: "Input your target page title (50-60 characters) and compelling meta description (150-160 characters)." },
      { title: "Configure OpenGraph & Twitter Cards", desc: "Add canonical URL, social share image URL, site name, author, and select Twitter card format (summary_large_image)." },
      { title: "Copy HTML <head> Tags", desc: "Review live social card previews for Google, Facebook, and Twitter/X, and click Copy HTML Tags." }
    ],
    faq: [
      { question: "What are the recommended character lengths for SEO titles and meta descriptions?", answer: "Keep titles between 50 and 60 characters (to avoid search snippet truncation at 600px width) and meta descriptions between 140 and 160 characters for optimal display." },
      { question: "Which Open Graph (OG) tags are generated?", answer: "It generates og:title, og:description, og:url, og:image, og:type (website/article), and og:site_name for Facebook, LinkedIn, Discord, and Slack rich sharing previews." },
      { question: "What image dimensions are recommended for og:image?", answer: "The standard recommended Open Graph share image resolution is 1200 x 630 pixels (1.91:1 aspect ratio) for sharp display across mobile and desktop." },
      { question: "Does the generator include modern mobile viewport and robots tags?", answer: "Yes. It includes <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> and standard index/follow robots directives." },
      { question: "Is website metadata kept private during generation?", answer: "Yes. Tag synthesis runs client-side in your browser memory." }
    ]
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
    features: ['Quick Presets (Allow All, Private, WordPress, E-Commerce)', 'Custom User-Agent & Crawl-Delay', 'Interactive Disallow/Allow Rule Manager', 'Sitemap Reference Inclusion', 'Download robots.txt'],
    howTo: [
      { title: "Set Default Crawl Permissions", desc: "Choose Allow or Disallow as default crawler access and specify your crawl-delay rate." },
      { title: "Add Disallowed Directories & Bot Rules", desc: "Specify private paths to block (/admin/, /private/, /api/) and configure bot-specific rules (Googlebot, Bingbot, Baiduspider)." },
      { title: "Add Sitemap URL & Download robots.txt", desc: "Enter your full canonical XML sitemap URL (e.g. https://example.com/sitemap.xml) and download the validated robots.txt file." }
    ],
    faq: [
      { question: "Where should the robots.txt file be uploaded on a website?", answer: "The robots.txt file must be uploaded directly to the root directory of your website domain (e.g. https://yourdomain.com/robots.txt) so search crawlers can locate it." },
      { question: "Can I block specific directories while allowing others?", answer: "Yes. You can disallow private administrative sections (Disallow: /admin/) while allowing public content (Allow: /)." },
      { question: "How do I block AI scrapers in robots.txt?", answer: "You can add dedicated User-agent directives for AI scrapers (e.g. GPTBot, CCBot, ClaudeBot) with Disallow: / to prevent web crawling." },
      { question: "Does robots.txt guarantee that private pages won't be indexed?", answer: "Robots.txt tells ethical crawlers not to visit pages; if other sites link to the URL, search engines might still index the link. To completely prevent indexing, use a 'noindex' meta tag on the page." },
      { question: "Does this tool validate robots.txt syntax?", answer: "Yes. It formats standard User-agent, Disallow, Allow, Crawl-delay, and Sitemap directives conforming to Google Search specifications." }
    ]
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
    features: ['Visual URL & Priority Table Editor', 'Bulk URL Paste & Auto-Import', 'Google Sitemaps 0.9 Standard Compliant', 'Last-Modified Date Tracking', 'Download sitemap.xml'],
    howTo: [
      { title: "Input Website URLs", desc: "Enter or paste your website's canonical URLs (one URL per line)." },
      { title: "Configure Priority, Frequency & Dates", desc: "Assign change frequency (daily, weekly, monthly), priority score (0.1 to 1.0), and last-modified dates." },
      { title: "Download Validated sitemap.xml", desc: "Review the compiled XML structure conforming to sitemaps.org protocols and download your sitemap.xml file." }
    ],
    faq: [
      { question: "What is the maximum number of URLs allowed in a single sitemap.xml file?", answer: "According to the official sitemaps.org protocol, a single sitemap file can contain up to 50,000 URLs and must not exceed 50MB uncompressed. Larger sites use sitemap index files." },
      { question: "What do the 'changefreq' and 'priority' tags signify?", answer: "changefreq provides a hint to search bots regarding how often page content updates; priority (0.0 to 1.0) signals the relative importance of a page within your own domain." },
      { question: "Does Google require the lastmod timestamp?", answer: "Google strongly recommends the lastmod attribute in W3C Datetime format (YYYY-MM-DD), using it to prioritize crawling newly published or updated pages." },
      { question: "Can I validate my generated sitemap before submitting to Google Search Console?", answer: "Yes. The generated XML strictly follows the http://www.sitemaps.org/schemas/sitemap/0.9 XML schema, ensuring immediate acceptance by Google and Bing." },
      { question: "Are my website URLs uploaded to a server?", answer: "No. XML sitemap generation runs client-side in browser memory with zero server access." }
    ]
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
    features: ['Organization, Article, FAQPage, Product & LocalBusiness', 'Interactive Dynamic Property Fields', 'Valid schema.org JSON-LD Output', 'Google Rich Snippets Ready', 'Copy Script & Download'],
    howTo: [
      { title: "Select Schema.org Structured Data Type", desc: "Choose from Article, Local Business, Product, FAQPage, Organization, Event, or Recipe." },
      { title: "Fill in Structured Schema Fields", desc: "Input required properties: Name, URL, Author, Pricing, Aggregate Rating, Reviews, or Questions & Answers." },
      { title: "Copy JSON-LD Script Tag", desc: "Review the formatted <script type=\"application/ld+json\"> snippet and click Copy for insertion into your page HTML." }
    ],
    faq: [
      { question: "Why is JSON-LD the recommended format for Schema.org markup?", answer: "Google explicitly recommends JSON-LD because it injects structured data cleanly inside a <script> block in the HTML head or body without interfering with visible page design." },
      { question: "What rich search snippets can Schema markup unlock in Google search results?", answer: "Proper schema can unlock rich snippets including star ratings, review counts, product pricing and stock status, interactive FAQ accordions, recipe cooking times, and event dates." },
      { question: "How do I test the generated JSON-LD code?", answer: "Copy the generated snippet and paste it directly into Google's official Rich Results Test or Schema.org Validator to verify compliance." },
      { question: "Can I generate FAQPage schema for multiple questions?", answer: "Yes. The FAQ generator lets you add unlimited question-and-answer pairs, outputting compliant Question and Answer entity arrays." },
      { question: "Is schema data generated locally?", answer: "Yes. All JSON serialization runs in your local browser runtime." }
    ]
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
    features: ['Google Ads, Facebook, Newsletter Presets', 'Real-Time Clean URL Generation', 'Saved Links History in LocalStorage', 'Parameter Character Counters', '1-Click Copy'],
    howTo: [
      { title: "Enter Destination Webpage URL", desc: "Input the target landing page address (e.g. https://example.com/product)." },
      { title: "Configure Campaign UTM Parameters", desc: "Specify Campaign Source (google, newsletter), Medium (cpc, email, social), Campaign Name, and optional Term and Content." },
      { title: "Copy Tracked Campaign URL or Short Link", desc: "Inspect the validated campaign URL with encoded parameters and click Copy to clipboard for ads, emails, or social posts." }
    ],
    faq: [
      { question: "What are the core UTM parameters used for Google Analytics 4 (GA4)?", answer: "The core parameters are: utm_source (where traffic originates, e.g. twitter), utm_medium (marketing channel, e.g. cpc, email), and utm_campaign (specific campaign name, e.g. summer_sale)." },
      { question: "Are UTM parameters case-sensitive in Google Analytics?", answer: "Yes. Google Analytics treats 'Email', 'email', and 'EMAIL' as three separate mediums. The builder provides an option to force all parameters to lowercase for clean reporting." },
      { question: "How does the tool handle URLs that already contain existing query parameters?", answer: "It checks whether the base URL already contains a question mark (?); if so, it appends UTM parameters using ampersands (&) to preserve existing parameters." },
      { question: "What are utm_term and utm_content used for?", answer: "utm_term tracks paid search keywords; utm_content differentiates between distinct links or buttons pointing to the same URL in an A/B test or newsletter." },
      { question: "Are campaign URLs logged or tracked by Zubware?", answer: "No. URL construction is handled locally in your browser memory." }
    ]
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
    features: ['Trigonometric (sin, cos, tan) in DEG & RAD', 'Logarithms (log10, ln), Powers & Roots', 'Factorial & Percentage Functions', 'Interactive Calculation History', 'Memory (MC, MR, M+, M-)'],
    howTo: [
      { title: "Input Expressions via Keypad or Keyboard", desc: "Type numbers, mathematical operators (+, −, ×, ÷), and parentheses using on-screen buttons or your computer keyboard." },
      { title: "Apply Scientific Functions & Angle Modes", desc: "Use trigonometry (sin, cos, tan), logarithms (ln, log), powers (xʸ, x²), roots (√, ∛), and toggle between Radian (RAD) and Degree (DEG) modes." },
      { title: "Evaluate, Store in Memory & View History", desc: "Press Equals (=) or Enter to evaluate, store results in memory registers (M+, MR), and inspect past calculations in the history log." }
    ],
    faq: [
      { question: "What is the difference between Radian (RAD) and Degree (DEG) mode?", answer: "Degree mode measures angles on a 360° circle, where sin(30°) = 0.5. Radian mode measures angles based on radius arc length (2π radians in a circle), where sin(π/6) = 0.5. Click the RAD/DEG badge to toggle." },
      { question: "How do the calculator memory registers (M+, M-, MR, MC) function?", answer: "M+ adds the current result to memory; M- subtracts it; MR (Memory Recall) inserts the stored memory value into your expression; and MC (Memory Clear) resets memory to 0." },
      { question: "Does the calculator support keyboard shortcuts on desktop computers?", answer: "Yes. You can use number keys, standard operators (+, -, *, /), parentheses, Enter for equals, Backspace to delete characters, and Escape to clear the display." },
      { question: "Are past calculations saved in history?", answer: "Yes. Evaluated expressions are automatically saved to your calculation history list in local storage, allowing you to recall past results with one click." },
      { question: "Which scientific constants and functions are built into the tool?", answer: "The calculator includes mathematical constants Pi (π ≈ 3.14159) and Euler's number (e ≈ 2.71828), factorial (x!), inverse trigonometry (asin, acos, atan), natural log (ln), common log (log₁₀), and absolute value (abs)." }
    ]
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
    features: ['Interactive Drawing Canvas & Image Upload', 'Client-Side Tesseract OCR Engine', 'Contrast Boost Enhancement', 'Instant Text Copy & Export'],
    howTo: [
      { title: "Upload Photo or Draw Notes", desc: "Upload a picture of handwritten notes, or write directly onto the interactive digital canvas." },
      { title: "Enhance Stroke Contrast", desc: "Adjust the contrast boost slider to sharpen faint ink and pencil strokes, improving recognition accuracy." },
      { title: "Extract Text and Copy", desc: "Click Extract Text to run client-side OCR, review the transcribed text in the editor, and copy or download as TXT." }
    ],
    faq: [
      { question: "What types of handwriting produce the most accurate OCR results?", answer: "Neat, consistent handwriting with separated printed characters or clear cursive letters on clean, unlined or lightly lined paper produces the highest accuracy." },
      { question: "How does the contrast boost slider improve OCR accuracy?", answer: "Contrast enhancement darkens pencil and ink lines while brightening background paper, helping the OCR engine distinguish letter boundaries from paper texture." },
      { question: "Can I edit the recognized text before saving?", answer: "Yes. The transcribed text appears in an editable text box so you can quickly correct any misread words before copying or saving." },
      { question: "Can I write directly on the screen using a touchscreen or stylus?", answer: "Yes. Switch to Draw mode to handwrite notes or equations directly on the canvas using your finger, stylus, or mouse." },
      { question: "Is my personal handwriting or notebook photo sent to an external server?", answer: "The image is processed locally in your browser using the client-side Tesseract.js OCR engine and is not sent to a Zubware server for processing." }
    ]
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
    features: ['11+ Languages (English, Hindi, Spanish, etc.)', 'Confidence Score & Real-Time Progress', 'Client-Side Processing', 'Copy & Download Extracted Text'],
    howTo: [
      { title: "Upload Document or Photo", desc: "Select an image, screenshot, document scan, or book page containing printed text." },
      { title: "Select Recognition Language", desc: "Choose your document language (English, Spanish, French, German, Hindi, etc.) to load the optimized language model." },
      { title: "Extract, Edit and Export Text", desc: "Click Extract Text to process with browser-side OCR, review the confidence score, and copy or download the text as a TXT file." }
    ],
    faq: [
      { question: "Which languages are supported for OCR text extraction?", answer: "The OCR engine supports over 11 major languages including English, Spanish, French, German, Hindi, Portuguese, Italian, Chinese, and Arabic." },
      { question: "What image quality is recommended for high OCR accuracy?", answer: "Crisp, high-contrast images with at least 150 to 300 DPI, even lighting, and horizontal text alignment achieve the most reliable transcription." },
      { question: "Can I extract text from screenshots and scanned receipts?", answer: "Yes. The OCR engine reads receipts, book pages, business cards, signs, and software screenshots." },
      { question: "What does the OCR confidence score indicate?", answer: "The confidence score represents the statistical probability of character recognition accuracy across all detected words in the image." },
      { question: "Are my confidential document photos uploaded to an external server?", answer: "The image is processed locally in your browser using Tesseract.js WebAssembly and is not sent to a Zubware server for processing." }
    ]
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
    features: ['Live Camera & Image File Scanning', 'BarcodeDetector API with jsQR Fallback', 'Scanned Barcodes History', 'Google Product Search & Copy'],
    howTo: [
      { title: "Allow Camera Access or Upload Image", desc: "Point your smartphone or webcam at any barcode, or upload a photo containing a barcode." },
      { title: "Align Barcode in Scanner Viewfinder", desc: "Position the 1D barcode or 2D QR code within the visual bounding box for instant recognition." },
      { title: "Copy Decoded Data or Open Link", desc: "Review the decoded alphanumeric payload, detect barcode symbology type, and copy or search the code." }
    ],
    faq: [
      { question: "Which barcode formats can this scanner decode?", answer: "It scans 1D formats including EAN-13, UPC-A, Code 128, Code 39, and ITF, as well as 2D formats including QR Code, Data Matrix, and PDF417." },
      { question: "Can I scan barcodes from saved image files and photos?", answer: "Yes. You can upload or paste image files (JPG, PNG, WebP) directly without using a live camera." },
      { question: "How does the scanner achieve instant detection?", answer: "It uses modern WebAssembly-accelerated barcode decoding libraries and the browser's native BarcodeDetector API when available." },
      { question: "Is camera video recorded or sent to a server?", answer: "No. Video frames are processed in volatile memory on your device; no video streams or captured photos are transmitted over the internet." },
      { question: "Does the tool support continuous scanning for inventory counts?", answer: "Yes. Toggle 'Continuous Scan' to rapidly beep and log sequential product barcodes into an exportable list." }
    ]
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
    features: ['Interactive Monthly Calendar Grid', 'Per-Day Private Note Autosave', 'Month-by-Month Navigation', 'Client-Side Autosave — Local Storage'],
    howTo: [
      { title: "Select Calendar Date", desc: "Navigate through months and click any day on the interactive monthly calendar grid." },
      { title: "Write Date-Specific Notes & Reminders", desc: "Add rich text notes, checklists, meeting notes, and tag items with color-coded categories." },
      { title: "Review Monthly Schedule & Export", desc: "Inspect calendar badges showing days with active notes and export your notes as a backup file." }
    ],
    faq: [
      { question: "Are my calendar notes stored privately on my device?", answer: "Yes. All notes, dates, and event tags are stored exclusively in your browser's local storage (localStorage) with zero server synchronization." },
      { question: "Can I color-code notes by category (e.g. Work, Personal, Health)?", answer: "Yes. You can assign custom color badges to organize different categories across the calendar grid." },
      { question: "Can I export all my calendar notes to a backup file?", answer: "Yes. The 'Export Backup' button lets you save a clean JSON file of all your notes, which you can restore anytime." },
      { question: "Does the calendar highlight today's date automatically?", answer: "Yes. Today's date is dynamically highlighted, and days with recorded notes display visual indicator dots." },
      { question: "Does this calendar tool require an account or login?", answer: "No. It is a completely private, offline-capable calendar tool requiring no email, account, or cloud subscription." }
    ]
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
    features: ['Instant Snippet Storage & Local Persistence', 'Real-Time Text Search', 'One-Click Copy Back to Clipboard', 'Manage & Delete Saved Items'],
    howTo: [
      { title: "Save Copied Text Snippets", desc: "Paste or capture text snippets, code blocks, URLs, and templates into the clipboard manager." },
      { title: "Organize, Pin & Search Snippets", desc: "Pin frequently used items to the top, tag snippets by category, and search your clipboard archive." },
      { title: "One-Click Copy Back to Clipboard", desc: "Click any snippet card to copy it back to your active system clipboard instantly." }
    ],
    faq: [
      { question: "Where is my clipboard history stored?", answer: "All snippets are stored locally in your browser's local storage; no text is ever uploaded to Zubware servers." },
      { question: "Can I pin frequently used boilerplate text to the top?", answer: "Yes. Click the Pin icon on any snippet to keep key email templates, addresses, or code snippets permanently at the top of your list." },
      { question: "Is there a limit on how many items I can save?", answer: "The manager stores up to 200 recent snippets smoothly with instant instant-search filtering." },
      { question: "Can I clear my entire clipboard history with one click?", answer: "Yes. Click 'Clear History' to wipe all unpinned snippets from your local browser storage immediately." },
      { question: "Can I export my saved snippets to a text or JSON file?", answer: "Yes. You can export your curated clipboard collection as a backup file to transfer between devices." }
    ]
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
    features: ['Morning, Afternoon & Evening Task Sections', 'Daily Priority Scratchpad', 'Task Checkboxes & Local Persistence', 'Clean Distraction-Free Design'],
    howTo: [
      { title: "Set Daily Top 3 Priority Goals", desc: "Define your primary focus tasks for the day to anchor your productivity." },
      { title: "Schedule Hourly Time Blocks", desc: "Assign tasks across Morning, Afternoon, and Evening time slots from 6:00 AM to 10:00 PM." },
      { title: "Track Water, Habits & Daily Notes", desc: "Check off hydration glasses, daily habit streaks, and jot evening reflections." }
    ],
    faq: [
      { question: "Why does the planner emphasize the 'Rule of 3' daily priorities?", answer: "Focusing on 3 high-impact outcomes prevents task overwhelm and ensures key objectives get accomplished before secondary busywork." },
      { question: "Is my daily schedule stored locally and privately?", answer: "Yes. All schedule items, checkboxes, and reflection notes persist securely in your browser's local storage." },
      { question: "Can I print my daily plan onto paper?", answer: "Yes. The print-optimized layout formats your daily agenda cleanly onto standard A4 or Letter paper for physical desk planning." },
      { question: "Can I clear completed items for tomorrow with one click?", answer: "Yes. Click 'Reset Day' to clear completed checkboxes and start a fresh daily schedule while keeping recurring habits." },
      { question: "Does the planner function without an active internet connection?", answer: "Once cached in your browser, the daily planner functions as a standalone browser productivity workspace." }
    ]
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
    features: ['Live Income, Expense & Balance Summary', 'Categorized Transaction Logging', 'Export Transaction History to CSV', 'Local Browser Storage'],
    howTo: [
      { title: "Log Inflow & Outflow Transactions", desc: "Enter transaction description, dollar amount, date, and category (Groceries, Housing, Utilities, Dining, Income)." },
      { title: "Inspect Visual Spending Analytics", desc: "View real-time donut charts and category breakdown graphs showing where your money is allocated." },
      { title: "Filter by Date Range & Export CSV", desc: "Filter expenses by month or custom date range, and export a clean spreadsheet CSV report." }
    ],
    faq: [
      { question: "Are my personal financial transactions uploaded to a server?", answer: "No. Your transactions, expense records, and income data are stored exclusively in your browser's local storage (localStorage). No financial data is ever transmitted to Zubware servers." },
      { question: "Can I export my expense log to Excel or Google Sheets?", answer: "Yes. Click 'Export CSV' to download a standard comma-separated spreadsheet containing dates, categories, descriptions, and amounts." },
      { question: "Can I create custom spending categories?", answer: "Yes. You can add, edit, or delete expense categories and assign custom color tags to match your personal budget." },
      { question: "Does the tool require connecting my bank account?", answer: "No. It is a completely private, offline-capable manual expense tracker requiring no bank logins, third-party aggregators, or account creation." },
      { question: "How do I backup my expense data across devices?", answer: "Use the 'Export JSON' feature to save a complete backup file to your computer, which you can import on another device anytime." }
    ]
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
    features: ['Supports SHA-256, SHA-1, SHA-512 & MD5', 'Integrity Matching vs Expected Hash', 'Visual Match/Mismatch Verification Badge', 'Zero Upload — Calculated In-Browser'],
    howTo: [
      { title: "Select File to Verify", desc: "Drag and drop any installer, ISO image, document, or archive into the verifier." },
      { title: "Select Hash Algorithm & Compute Checksum", desc: "Calculate cryptographic hashes using SHA-256, SHA-1, SHA-512, or MD5 via the Web Crypto API." },
      { title: "Paste Expected Hash to Compare", desc: "Input the developer's published checksum to see an instant match (green checkmark) or mismatch warning." }
    ],
    faq: [
      { question: "What is a cryptographic file checksum?", answer: "A checksum is a unique mathematical fingerprint calculated from a file's binary contents. Even a single changed bit in the file produces a completely different hash value." },
      { question: "How does this tool calculate checksums for large files without crashing?", answer: "It reads files in streaming chunks using the browser's native FileReader and Web Crypto APIs (SubtleCrypto), verifying multi-gigabyte files efficiently without uploading them." },
      { question: "Is my file uploaded to a server to calculate the hash?", answer: "No. All hash calculations execute locally in your browser using the Web Cryptography API. Files are not uploaded to Zubware servers." },
      { question: "Why is verifying checksums essential for downloaded software?", answer: "Matching the publisher's published SHA-256 hash confirms the file was downloaded completely without corruption and has not been tampered with by malicious actors." },
      { question: "Does the tool ignore uppercase and lowercase differences when comparing?", answer: "Yes. Hash comparison is case-insensitive, ensuring accurate matches regardless of whether the developer published lowercase or uppercase hex strings." }
    ]
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
    features: ['Daily Streak Counters with Flame Icons', 'One-Click Habit Check-Off', 'Persistent Habit Management', 'Historical Completion Tracking'],
    howTo: [
      { title: "Create Daily Habits & Goals", desc: "Add habits you want to build (e.g. Exercise, Read 20 Mins, Drink 2L Water, Meditate) and assign color tags." },
      { title: "Check Off Daily Completions", desc: "Click the completion circles for each day of the week to record your consistency." },
      { title: "Track Consecutive Streaks & Trends", desc: "Monitor your current active streak, best streak, and monthly completion rate percentages." }
    ],
    faq: [
      { question: "How does the habit streak calculation work?", answer: "The streak counter tallies consecutive daily completions; missing a scheduled day resets the active streak counter while preserving your all-time best record." },
      { question: "Are my personal habits and routines private?", answer: "Yes. All habit names, completion checkboxes, and streak analytics are stored strictly in your browser's local storage." },
      { question: "Can I set habits for specific days of the week (e.g. weekdays only)?", answer: "Yes. You can configure habit frequency to daily, weekdays only, or custom weekly target counts." },
      { question: "Can I export my habit tracking data as a backup?", answer: "Yes. Export your habit log as a JSON file to prevent accidental data loss if you clear browser cache." },
      { question: "Is there any limit to the number of habits I can track?", answer: "You can track multiple daily routines simultaneously. Designed to handle multiple routines efficiently." }
    ]
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
    features: ['Category Budget Allocations', 'Visual Progress Bars & Over-Budget Alerts', 'Total Budget vs Actual Spent Overview', 'Persistent Local Browser Storage'],
    howTo: [
      { title: "Enter Monthly Net Income", desc: "Input your expected monthly take-home income from salary, freelance, or investments." },
      { title: "Allocate Category Spending Limits", desc: "Set budget targets across Fixed Needs (50%), Wants & Lifestyle (30%), and Savings & Investments (20%)." },
      { title: "Track Remaining Cash & Surplus", desc: "Monitor visual progress bars to see real-time unallocated cash and prevent monthly overspending." }
    ],
    faq: [
      { question: "What is the 50/30/20 budgeting rule built into this planner?", answer: "The 50/30/20 guideline recommends allocating 50% of net income to essential Needs (rent, groceries, debt minimums), 30% to Wants (dining, hobbies), and 20% to Savings and debt acceleration." },
      { question: "Does the planner support zero-based budgeting?", answer: "Yes. The zero-based budgeting indicator tracks unallocated income in real time until every dollar of your net income is assigned to a specific category." },
      { question: "Can I duplicate last month's budget to the new month?", answer: "Yes. One-click rollover clones your existing category limits to save time setting up upcoming months." },
      { question: "Are there any financial advisory guarantees provided?", answer: "No. This tool is a mathematical personal budgeting calculator; it does not provide certified financial, investment, tax, or legal advice." },
      { question: "Is my personal salary and budget data private?", answer: "Yes. All calculations, budget caps, and income entries remain strictly in your browser's local storage." }
    ]
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
    features: ['Cryptographically Secure Word Selection', 'Configurable Word Count & Separators', 'Optional Numbers & Special Symbols', 'One-Click Copy to Clipboard'],
    howTo: [
      { title: "Set Word Count & Separator", desc: "Choose number of words (4 to 8 words) and select delimiter: Hyphen (-), Space, Period (.), or Underscore (_)." },
      { title: "Configure Capitalization & Numbers", desc: "Toggle Title Case capitalization and append random numbers or symbols for enhanced credential complexity." },
      { title: "Generate & Copy Memorable Passphrase", desc: "Inspect the calculated bit-entropy security rating and copy your secure, easy-to-remember passphrase." }
    ],
    faq: [
      { question: "What is a Diceware-style passphrase and why is it superior?", answer: "Diceware passphrases combine several random dictionary words (e.g. 'correct-horse-battery-staple'). They provide high mathematical entropy against automated cracking while being easy for humans to remember and type." },
      { question: "How much entropy does a 5-word passphrase provide?", answer: "A 5-word passphrase drawn from a curated dictionary of 7,776 words provides approximately 65 bits of entropy, which would take modern supercomputers billions of years to brute-force." },
      { question: "How are the random words chosen?", answer: "Words are selected using the cryptographically secure pseudo-random number generator (crypto.getRandomValues), ensuring non-predictable outcomes." },
      { question: "Does the wordlist exclude offensive or confusing words?", answer: "Yes. The dictionary is curated to remove profanity, ambiguous spellings, and homophones for clean professional memorability." },
      { question: "Is my generated passphrase transmitted to Zubware?", answer: "No. All passphrase assembly occurs entirely in volatile client-side browser memory with zero network logging." }
    ]
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
    features: ['Entropy Calculation in Bits', 'Brute-Force Crack Time Estimation', 'Visual Strength Meter & Character Checks', 'Actionable Security Recommendations'],
    howTo: [
      { title: "Enter Password to Audit", desc: "Type or paste your password into the secure evaluation input box." },
      { title: "Inspect Entropy & Crack-Time Estimate", desc: "Review the calculated bits of entropy, estimated brute-force crack time, and visual strength meter." },
      { title: "Review Security Checklist & Vulnerabilities", desc: "Check for common vulnerabilities: length deficiencies, dictionary words, sequential numbers, and repeated patterns." }
    ],
    faq: [
      { question: "Is it safe to test sensitive passwords on this web page?", answer: "Yes. The strength algorithm runs locally in your browser using client-side JavaScript. Your password is never sent across the internet, logged, or transmitted anywhere." },
      { question: "How is the estimated brute-force crack time calculated?", answer: "The tool estimates total search space entropy (based on character pool variety and length) and calculates time to crack assuming an offline cluster attempting 100 billion guesses per second." },
      { question: "Does the tool check against common leaked password lists?", answer: "Yes. It checks against a local dictionary of the most common breached passwords and keyboard walk patterns (e.g. 'qwerty', '123456', 'password')." },
      { question: "What makes a password rated 'Very Strong'?", answer: "A score of 'Very Strong' requires at least 80+ bits of entropy, typically achieved by 16+ characters with a mixture of uppercase, lowercase, numbers, and symbols, or a 5-word random passphrase." },
      { question: "Can I toggle password visibility while typing?", answer: "Yes. Click the eye icon to toggle between masked bullet points and visible plain text." }
    ]
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
    features: ['25m Focus, 5m Short Break & 15m Long Break', 'Custom Session Duration Setting', 'Synthesized Web Audio Completion Chime', 'Clean Play, Pause & Reset Controls'],
    howTo: [
      { title: "Select Session Mode", desc: "Choose Focus (25 mins), Short Break (5 mins), or Long Break (15 mins), or configure custom session durations." },
      { title: "Start Timer & Work on Single Task", desc: "Click Start or press Spacebar to begin countdown with visual progress ring and audio chime alerts." },
      { title: "Complete Pomodoro Rounds & Take Breaks", desc: "Track completed focus sessions, take prescribed rest intervals, and maintain productivity momentum." }
    ],
    faq: [
      { question: "What is the Pomodoro Technique?", answer: "Developed by Francesco Cirillo, the Pomodoro Technique structures work into 25-minute uninterrupted focus intervals followed by 5-minute restorative breaks to sustain mental stamina." },
      { question: "Does the timer play an audible completion alert?", answer: "Yes. The timer uses the Web Audio API to play gentle, pleasant synthesized chime notifications when focus and break intervals conclude." },
      { question: "Can I customize the focus and break lengths?", answer: "Yes. You can adjust focus sessions (e.g. 50 minutes for deep work) and break times (e.g. 10 minutes) to fit your personal workflow." },
      { question: "Does the timer continue running if I switch browser tabs?", answer: "Yes. The timer calculates elapsed time against system clock timestamps, keeping time completely accurate even when the tab is running in the background." },
      { question: "Does the page title show the remaining countdown time?", answer: "Yes. The browser tab title updates continuously (e.g. '24:59 - Focus') so you can monitor progress while working in other windows." }
    ]
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
    features: ['Multi-Note Management with Pinning', 'Instant Search Across Titles & Content', 'Export as Text File or Backup JSON', 'Local Browser Storage'],
    howTo: [
      { title: "Set Master Encryption Password", desc: "Create a strong personal passphrase used to derive cryptographic AES-256 encryption keys." },
      { title: "Write Private Notes & Credentials", desc: "Compose sensitive notes, code snippets, recovery keys, and confidential checklists in the private editor." },
      { title: "Lock Notes with AES-256 Encryption", desc: "Click Lock to encrypt all note data in browser storage; notes cannot be decrypted without your master password." }
    ],
    faq: [
      { question: "What encryption standard is used to protect secure notes?", answer: "Notes are encrypted with AES-256-GCM using keys derived from your master password via PBKDF2 with 100,000 hashing iterations using the browser's native Web Crypto API." },
      { question: "Can Zubware or server administrators recover my forgotten master password?", answer: "No. This is a zero-knowledge local architecture. Your password is never stored or transmitted; if you lose your master password, encrypted notes cannot be decrypted by anyone." },
      { question: "Where are the encrypted notes saved?", answer: "Encrypted ciphertext blobs are saved exclusively in your browser's local storage (localStorage)." },
      { question: "Can I export an encrypted backup file to my computer?", answer: "Yes. You can export an encrypted JSON backup file that can be restored on another device using your master password." },
      { question: "Does the tool auto-lock after a period of inactivity?", answer: "Yes. You can configure an inactivity auto-lock timer to lock your notes automatically if you step away from your computer." }
    ]
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
    features: ['Simultaneous SHA-1, SHA-256, SHA-384 & SHA-512', 'Text and File Input Hashing Modes', 'One-Click Copy for Individual Hashes', 'Zero Server Upload — Fast Client Processing'],
    howTo: [
      { title: "Enter Text or Select File", desc: "Type string data or upload any file to generate cryptographic checksum digests." },
      { title: "Calculate Multi-Algorithm SHA Digests", desc: "Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes simultaneously in real time." },
      { title: "Copy Verified Checksum", desc: "Inspect the hexadecimal digests and click Copy next to your desired algorithm." }
    ],
    faq: [
      { question: "Which Secure Hash Algorithms (SHA) are computed by this tool?", answer: "It computes SHA-1 (160-bit), SHA-256 (256-bit), SHA-384 (384-bit), and SHA-512 (512-bit) hashes conforming to NIST FIPS PUB 180-4." },
      { question: "How does the browser calculate SHA digests without server uploads?", answer: "It utilizes the browser's native Web Crypto API (SubtleCrypto.digest), executing cryptographic hashing directly on your local hardware." },
      { question: "What is the difference between SHA-256 and SHA-512?", answer: "SHA-256 outputs a 64-character hex digest and is optimized for 32-bit architectures; SHA-512 outputs a 128-character hex digest with greater mathematical collision resistance and faster performance on 64-bit CPUs." },
      { question: "Can I generate checksums for large files?", answer: "Yes. Files are read via streaming FileReader chunks, allowing local hash generation for multi-gigabyte files." },
      { question: "Is my data or file uploaded to any external server?", answer: "No. All checksum calculations occur locally in your browser." }
    ]
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
    features: ['AES Symmetric Encryption & Decryption', 'Custom Secret Key with Show/Hide Toggle', 'Tamper & Invalid Password Validation', 'One-Click Copy of Ciphertext or Plaintext'],
    howTo: [
      { title: "Paste Text & Enter Secret Key", desc: "Input your plain message to encrypt (or cipher text to decrypt) and enter your private secret key passphrase." },
      { title: "Choose Encryption Algorithm", desc: "Select military-grade AES-256-GCM, AES-CBC, or Base64 / ROT13 encoding." },
      { title: "Execute & Copy Secure Ciphertext", desc: "Click Encrypt or Decrypt and copy the Base64-encoded encrypted ciphertext to your clipboard." }
    ],
    faq: [
      { question: "How does AES-256-GCM encryption ensure confidentiality and integrity?", answer: "AES-GCM (Galois/Counter Mode) provides both authenticated encryption and data integrity verification, ensuring encrypted text cannot be read or secretly modified without the secret key." },
      { question: "Is an initialization vector (IV) generated for each encryption?", answer: "Yes. A fresh, cryptographically random 12-byte initialization vector (IV) is generated via window.crypto.getRandomValues for every encryption operation." },
      { question: "Can I decrypt text encrypted by this tool on other standard cryptographic platforms?", answer: "Yes. Because it uses standard AES-GCM and PBKDF2 key derivation, ciphertexts can be decrypted using standard OpenSSL, Python cryptography libraries, or Web Crypto." },
      { question: "Does Zubware have access to my secret key or decrypted messages?", answer: "No. The entire cryptographic lifecycle is handled strictly within your local browser's Web Crypto API subsystem." },
      { question: "What happens if someone enters the wrong secret key during decryption?", answer: "The decryption algorithm detects the authentication tag mismatch and immediately halts with a clean error, preventing corrupted data output." }
    ]
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
    features: ['Priority Tagging (Low, Medium, High)', 'Custom Task Categories', 'Filter by All, Active, or Completed', 'Instant Local Browser Persistence'],
    howTo: [
      { title: "Add Tasks with Priority & Due Dates", desc: "Type task names, select priority (High, Medium, Low), and assign optional due dates and project tags." },
      { title: "Organize, Filter & Reorder Checklist", desc: "Filter tasks by status (All, Active, Completed), drag to prioritize, and search across your task list." },
      { title: "Check Off Completed Tasks", desc: "Click task checkboxes to mark items done and review completion metrics and progress bars." }
    ],
    faq: [
      { question: "Are my tasks and to-do lists stored privately?", answer: "Yes. All task data, priorities, and completion timestamps are stored exclusively in your browser's local storage (localStorage) with zero external tracking." },
      { question: "Can I categorize tasks by project or category tags?", answer: "Yes. You can assign custom category tags (e.g. Work, Personal, Errands) and filter your task view by tag." },
      { question: "Does the to-do list support drag-and-drop reordering?", answer: "Yes. You can drag and drop tasks vertically to organize your immediate daily execution order." },
      { question: "Can I export my task list as a backup or to-do file?", answer: "Yes. You can export your tasks as a JSON backup or clean text checklist." },
      { question: "Does this to-do app require creating an account?", answer: "No. It is completely free, privacy-first, and requires no account, email, or login." }
    ]
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
    features: ['7-Day Overview (Monday through Sunday)', 'Quick Task Addition & Removal Per Day', 'Persistent Local Browser Storage', 'Clean Responsive Layout'],
    howTo: [
      { title: "View 7-Day Weekly Grid", desc: "Inspect the organized Monday-to-Sunday weekly view with daily schedule columns." },
      { title: "Schedule Tasks, Meetings & Objectives", desc: "Add specific appointments, deadlines, and workout plans under each day of the week." },
      { title: "Check Off Items & Roll Over Pending Tasks", desc: "Mark completed items and roll unfinished tasks forward to upcoming days to maintain momentum." }
    ],
    faq: [
      { question: "How does the weekly planner help manage workload balance?", answer: "Seeing all 7 days side-by-side allows you to distribute deadlines evenly, prevent meeting congestion on single days, and reserve designated focus blocks." },
      { question: "Are weekly planner entries stored locally on my device?", answer: "Yes. All entries, schedules, and checklists persist safely in browser local storage without server synchronization." },
      { question: "Can I print a physical weekly agenda sheet?", answer: "Yes. The print stylesheet formats the full 7-day grid onto a clean landscape A4/Letter page for physical desk use." },
      { question: "Can I set recurring weekly routines?", answer: "Yes. You can designate recurring weekly items (e.g. Team Standup on Monday, Gym on Wednesday) that populate each week automatically." },
      { question: "Can I export a backup of my weekly plan?", answer: "Yes. You can download a JSON backup file to archive previous weeks or restore across devices." }
    ]
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
    features: ['Custom Length up to 1024 Characters', 'Uppercase, Lowercase, Numbers & Symbols', 'Hex, Base64 & Alphanumeric Presets', 'Instant Copy & Download as Text File'],
    howTo: [
      { title: "Choose Generation Type & Length", desc: "Select Random Words, Alphanumeric Strings, Hexadecimal Hashes, or Mixed Passwords, and set length." },
      { title: "Configure Character Set Options", desc: "Toggle uppercase letters, lowercase letters, numbers, and special symbols to customize the generated string." },
      { title: "Generate and Copy Random Text", desc: "Click Generate, inspect the entropy strength, and copy the randomized string to your clipboard." }
    ],
    faq: [
      { question: "How random are the generated strings?", answer: "Strings are produced using the browser's cryptographically secure pseudo-random number generator (window.crypto.getRandomValues), ensuring high cryptographic entropy." },
      { question: "Can I generate pronounceable random words for testing?", answer: "Yes. Switch to 'Word' mode to generate pseudo-pronounceable syllable chains or random dictionary terms for mockup placeholder data." },
      { question: "What character sets are supported?", answer: "You can toggle uppercase Latin (A-Z), lowercase (a-z), digits (0-9), and special ASCII symbols (!@#$%^&*), or provide a custom character pool." },
      { question: "Can I generate multiple random strings at once?", answer: "Yes. Set the batch count to generate up to 1,000 distinct random strings formatted on separate lines." },
      { question: "Are generated random strings stored or transmitted?", answer: "No. All randomization occurs client-side in browser memory with zero server transmission." }
    ]
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
    features: ['Live Video Player with Subtitle Overlay', 'Interactive Timestamp Editing (Start & End)', 'Speech-to-Text Voice Recognition Option', 'Export as Standard .SRT or .VTT Files'],
    howTo: [
      { title: "Load Video File into Player", desc: "Upload your video to activate the interactive timeline player and synchronized caption editor." },
      { title: "Add & Sync Subtitle Timestamps", desc: "Type captions manually or use voice recognition speech-to-text, setting exact start and end timestamps for each dialogue cue." },
      { title: "Export Standard SRT or VTT File", desc: "Click Download SRT or Download VTT to save standard timed subtitle files ready for YouTube Studio or video players." }
    ],
    faq: [
      { question: "What is the difference between SRT and WebVTT subtitle files?", answer: "SRT (.srt) is the universal subtitle format supported by YouTube, Premiere Pro, and desktop players. WebVTT (.vtt) is the modern HTML5 web standard used for responsive online video elements and browser playback." },
      { question: "How does the built-in speech-to-text captioning work?", answer: "It utilizes your browser's native Web Speech API to transcribe spoken audio during playback directly into timestamped subtitle cues without third-party API keys." },
      { question: "How do I upload the generated SRT file to YouTube?", answer: "In YouTube Studio, open your video's Subtitles section, click Add Language, select Upload File -> With Timing, and choose your exported .srt file." },
      { question: "Can I edit subtitle timings down to milliseconds?", answer: "Yes. You can edit the exact start and end millisecond timestamps on each subtitle block to ensure precise synchronization with on-screen dialogue." },
      { question: "Are my subtitle scripts or video files sent to a remote database?", answer: "No. All video playback, speech recognition buffers, and subtitle cues are managed entirely within your local browser session." }
    ]
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
    features: ['Presets for 9:16, 16:9, 1:1, 4:5 & 4:3', 'Blurred Background Padding or Solid Color', 'Contain and Cover Aspect Ratio Modes', 'Fast In-Browser Video Re-Encoding'],
    howTo: [
      { title: "Upload Your Source Video", desc: "Drag and drop your video clip into the converter workspace to inspect its current aspect ratio and dimensions." },
      { title: "Select Target Ratio & Framing Style", desc: "Choose 9:16 (Shorts/Reels/TikTok), 16:9 (YouTube), 1:1, or 4:5, and select blurred background padding, solid fill, or crop-to-fit." },
      { title: "Export Converted Aspect Ratio Video", desc: "Preview the re-framed playback in real-time and click Export Video to save the reframed clip directly to your machine." }
    ],
    faq: [
      { question: "How does the blurred background padding mode work?", answer: "Blurred background mode duplicates your source video into a background canvas layer, scales it up, and applies an aesthetic Gaussian blur, cleanly filling the empty letterbox or pillarbox bars without harsh black borders." },
      { question: "Can I convert a 16:9 horizontal YouTube video into a 9:16 vertical Short?", answer: "Yes. Select the 9:16 preset. You can either use blurred background padding to show the entire original widescreen video in the center, or choose crop mode to zoom in and fill the full vertical frame." },
      { question: "What is the difference between Fit mode and Crop mode?", answer: "Fit mode keeps 100% of your source video visible by adding padded borders to match the target ratio. Crop mode enlarges the video to eliminate all borders, cutting away outer edges that fall outside the new frame." },
      { question: "What output video format is produced by the converter?", answer: "The browser exports a web-ready WebM or MP4 video container recorded directly from the canvas stream at the target dimensions." },
      { question: "Does changing video aspect ratios upload my footage to any cloud service?", answer: "No. All frame manipulation, aspect ratio calculations, and canvas recordings occur locally in your web browser with zero server data transfer." }
    ]
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
    features: ['Quality Presets (High, Medium, Low Bitrates)', 'Custom Resolution Scaling & FPS Control', 'Before vs After File Size Comparison', 'In-Browser Processing'],
    howTo: [
      { title: "Upload Your Video File", desc: "Select or drag and drop an MP4, WebM, or MOV video file from your computer or phone into the upload area." },
      { title: "Choose Quality Preset & Scale", desc: "Select a compression preset (High, Medium, Low) or downscale resolution to 75% or 50% to hit your target file size." },
      { title: "Compress and Save Video", desc: "Click Start Compression to re-encode the video locally in browser memory and download the smaller video file." }
    ],
    faq: [
      { question: "How does in-browser video compression work without server uploads?", answer: "The compressor uses HTML5 video elements, HTML5 Canvas, and the native MediaRecorder API to decode and re-encode video frames locally on your device's hardware, never transmitting video frames across the network." },
      { question: "Which video file formats are supported for compression?", answer: "The tool supports modern browser-decodable formats including MP4 (H.264/AAC), WebM (VP8/VP9/Opus), and compatible MOV files from smartphones and digital cameras." },
      { question: "Does lowering resolution reduce file size faster than lowering bitrate?", answer: "Yes. Downscaling resolution (such as from 1080p to 720p or 50% scale) reduces the total number of pixels per frame by up to 75%, resulting in substantial file size savings alongside bitrate adjustments." },
      { question: "Is there a recommended file size limit for browser video compression?", answer: "Because video re-encoding occurs inside your browser's allocated RAM, video clips under 500MB perform most reliably across modern desktop computers and high-end mobile devices." },
      { question: "Are my personal or proprietary video files sent to a server?", answer: "No. All video decoding, compression, and file assembly execute strictly within your local browser session. No video data or audio tracks are uploaded to Zubware servers." }
    ]
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
    features: ['Lossless Web Audio API Decoding', 'Built-in Audio Player for Instant Preview', 'Export to Standard WAV Audio Format', 'Fast Local Processing in Browser'],
    howTo: [
      { title: "Select Video File", desc: "Choose or drop an MP4, WebM, or MOV video containing the audio track you wish to extract." },
      { title: "Choose Audio Format & Bitrate", desc: "Select high-fidelity uncompressed WAV audio for studio editing or lightweight WebM audio for quick listening." },
      { title: "Extract and Download Audio Track", desc: "Click Extract Audio to decode the sound stream with Web Audio APIs and save the audio file directly to your device." }
    ],
    faq: [
      { question: "Does extracting audio from a video reduce sound quality?", answer: "Exporting to WAV produces lossless uncompressed PCM audio decoded directly from the source video's audio stream without adding extra compression artifacts." },
      { question: "Can I extract stereo channels and background music accurately?", answer: "Yes. The browser's native Web Audio API preserves multichannel stereo sound, vocal tracks, and background music at the original sampling rate (typically 44.1kHz or 48kHz)." },
      { question: "What happens if I upload a video that does not contain audio?", answer: "The extractor will inspect the video container; if no active audio stream is detected, it will display a notification informing you that the file contains no audio to extract." },
      { question: "Can I import the extracted WAV audio into audio editing software?", answer: "Yes. Standard WAV audio files are universally compatible with Audacity, Adobe Audition, Premiere Pro, DaVinci Resolve, Final Cut Pro, and mobile editing applications." },
      { question: "Is my video uploaded to any server during the extraction process?", answer: "No. Audio stream extraction and WAV file generation run locally on your computer or phone using native Web Audio and TypedArray buffers." }
    ]
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
    features: ['Interactive Start & End Trimming Handles', 'Adjustable Frame Rate (FPS) & Dimensions', 'High-Quality Client-Side GIF Encoding', 'Instant Animated Preview & Download'],
    howTo: [
      { title: "Upload Video Clip", desc: "Select an MP4, WebM, or MOV video file to load the video playback and animation controls." },
      { title: "Configure Trim, Resolution & Frame Rate", desc: "Set the start and end trim timestamps, choose target pixel width (e.g., 320px, 480px, 640px), and set frame rate (10 to 20 FPS)." },
      { title: "Render & Download Animated GIF", desc: "Click Convert to GIF to extract frames, compile the color palette, and download your animated GIF image." }
    ],
    faq: [
      { question: "Why should video clips for GIF conversion be kept short?", answer: "The GIF format does not use modern inter-frame compression algorithms. Every frame stores individual bitmap color tables, meaning long clips or high resolutions quickly result in multi-megabyte files." },
      { question: "How does the frame rate (FPS) setting affect GIF file size?", answer: "Higher FPS (such as 20 FPS) delivers ultra-smooth animation but doubles the total frame count and file size compared to 10 FPS. For memes and website embeds, 10 to 12 FPS provides great motion at a lightweight file size." },
      { question: "Does the converted GIF file include audio?", answer: "No. The GIF specification (GIF89a) is strictly an animated image standard that does not support audio tracks. If you need sound, use the Video Trimmer tool to create short video clips." },
      { question: "What is the best width setting for web and email GIFs?", answer: "A width between 320px and 480px is optimal for newsletters, email signatures, and web articles, providing crisp visual clarity without causing slow email loading." },
      { question: "Are video frames sent to an external server during GIF conversion?", answer: "No. Frame sampling, color quantization, and GIF binary encoding execute entirely in your browser's JavaScript environment." }
    ]
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
    features: ['Visual Timeline Scrubber with Start/End Handles', 'Live Real-Time Playback of Selected Range', 'In-Browser Re-Encoding via MediaRecorder', 'Instant Trimmed Video Download'],
    howTo: [
      { title: "Load Video into Interactive Timeline", desc: "Select or drop your video file into the trimmer to display the playable scrubber timeline." },
      { title: "Set Exact Start and End Cut Points", desc: "Drag the visual timeline handles or type exact second timestamps into the start and end input fields." },
      { title: "Preview Range & Download Trimmed Clip", desc: "Play the isolated segment loop to confirm the cut, then click Trim Video to export and download your clipped video." }
    ],
    faq: [
      { question: "Can I specify exact second and millisecond timestamps for trimming?", answer: "Yes. In addition to dragging the interactive visual timeline scrubber handles, you can manually type precise start and end times into the timestamp input boxes for frame-level accuracy." },
      { question: "Can I preview only the selected trimmed portion before exporting?", answer: "Yes. Clicking Play in the trimmer interface loops playback strictly between your specified start and end cut points, allowing you to verify the edit before rendering." },
      { question: "Does trimming a video re-upload it to a remote server?", answer: "No. The trimmer processes media directly in your browser using HTML5 media elements and client-side canvas capture, keeping your files completely on your device." },
      { question: "Are audio and video kept in sync in the trimmed output?", answer: "Yes. The MediaRecorder stream captures both synchronized video frames and the active audio track from the media element during the selected time range." },
      { question: "What is the maximum video duration I can trim in the browser?", answer: "You can trim videos of several minutes to half an hour depending on your device's available memory. For optimal performance, trim clips from source files under 500MB." }
    ]
  }
];

export function getTranslatedTools(lang: LanguageCode): ToolMeta[] {
  return TOOLS_DATA.map(tool => {
    let t: ToolMeta = { ...tool };
    switch (tool.id) {
      case 'image-splitter-merger':
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
  const isTrendingList = ['image-splitter-merger', 'image-compressor', 'pdf-merge', 'resume-builder', 'youtube-title-generator', 'chatgpt-prompt-builder', 'json-formatter', 'css-gradient-generator', 'random-password-generator', 'qr-generator', 'weight-gain-calculator'];
  const isFeaturedList = ['image-splitter-merger', 'image-converter', 'pdf-split', 'ats-resume-checker', 'instagram-caption-generator', 'gemini-prompt-builder', 'jwt-decoder', 'color-palette-generator', 'image-to-pdf'];
  const isEditorsPickList = ['image-splitter-merger', 'crop-image', 'cover-letter-builder', 'midjourney-prompt-builder', 'unit-converter', 'qr-code-decoder', 'todo-list', 'weight-gain-calculator'];

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
    answer: "Zubware is a comprehensive online multi-tool suite offering over 300+ instant browser tools for PDF editing, image processing, video creation, developer utilities, financial calculators, and career documents. File and document utilities process data locally in your browser with zero server uploads."
  },
  {
    question: "Are my files, PDFs, or private data uploaded to any server?",
    answer: "No. For local tools, processing executes client-side inside your browser sandbox using HTML5 Canvas, WebAssembly, and pdf-lib. Your confidential tax numbers, resume drafts, PDFs, and photos never touch external servers."
  },
  {
    question: "How does the latest Income Tax Calculator calculate taxes for 2025 and 2026?",
    answer: "The Income Tax Calculator includes the latest IRS federal brackets (Rev. Proc. 2024-40) and projected 2026 brackets with FICA withholdings for the US, as well as the newly revised Union Budget 2025-2026 New Tax Regime for India featuring the ₹75,000 standard deduction, revised slabs, and full Section 87A rebate (zero tax up to ₹12 Lakhs income)."
  },
  {
    question: "What features are included in the upgraded PDF suite?",
    answer: "The PDF suite includes drag-and-drop page reordering, real-time page rotation (90° increments), individual page deletion, PDF merge, PDF split with odd/even extraction, high-speed client-side compression, thumbnail preview modals, and stage-by-stage processing progress bars."
  },
  {
    question: "Is Zubware completely free to use without limits or watermarks?",
    answer: "Yes, Zubware tools are 100% free with no forced account signups, no subscription paywalls, and zero added watermarks."
  },
  {
    question: "Can I use Zubware tools on mobile devices?",
    answer: "Yes! All tools feature responsive, touch-friendly interfaces optimized for mobile smartphones (Android Chrome, iOS Safari), tablets, and desktop browsers with hardware-accelerated performance."
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
