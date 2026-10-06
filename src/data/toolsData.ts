import { ToolMeta, FAQItem } from '../types';
import { LanguageCode, getTranslation } from '../lib/i18n';
import { getToolKeywords } from '../lib/toolKeywords';
import { getToolCanonicalPath } from '../lib/paths';

const RAW_TOOLS_DATA: ToolMeta[] = [
  {
    id: 'image-splitter-merger',
    title: "Image Splitter & Combiner — Split or Merge Photos Online",
    navTitle: "Image Split & Combine",
    description: "Split photos into rows and columns or combine multiple images side-by-side online. Export high-res cuts as a ZIP or single composite in your browser.",
    icon: '✂️',
    path: '/image-splitter-merger.html',
    filename: 'image-splitter-merger.html',
    category: '🖼️ Image Tools',
    badge: 'Original',
    features: [
      "Dual Split & Merge Operating Modes",
      "Custom Grid Rows, Columns & Slice Offsets",
      "Horizontal & Vertical Photo Merging",
      "Custom Border Gutter & Alignment Spacing",
      "High-Resolution ZIP & Canvas Image Export",
      "100% Private Client-Side Browser Processing"
    ],
    howTo: [
      { title: "Select Split or Merge Mode", desc: "Choose whether you want to slice a single image into multiple pieces or combine multiple photos into a single composite." },
      { title: "Configure Grid or Alignment Layout", desc: "Set the number of rows and columns for splitting, or choose horizontal/vertical stacking and spacing for merging." },
      { title: "Preview and Download Slices or Merged File", desc: "Inspect the live canvas preview and download individual image cuts, a packaged ZIP archive, or your combined graphic." }
    ],
    faq: [
      { question: "Can I split an image into equal grid tiles for Instagram or social media?", answer: "Yes. You can specify exact row and column counts (such as 3x3 for an Instagram profile grid) and export every tile simultaneously in a single ZIP file." },
      { question: "Does combining images degrade the original photo resolution?", answer: "No. The merger tool calculates composite canvas dimensions based on the full pixel resolution of your source images, maintaining crisp detail without compression loss." },
      { question: "Can I merge photos both horizontally side-by-side and vertically stacked?", answer: "Yes. Switch between horizontal alignment (side-by-side) and vertical alignment (stacked vertically) with customizable spacing and background fill colors." },
      { question: "Which image file formats are supported for splitting and merging?", answer: "You can upload and process PNG, JPG, WebP, SVG, and GIF files. Export options include PNG, JPG, and compressed ZIP archives." },
      { question: "Are my uploaded photos sent to any external server?", answer: "No. All image slicing, canvas stitching, and ZIP packaging occur strictly in your local browser memory using HTML5 Canvas APIs." }
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
    title: 'Image Compressor – Reduce Image Size Online',
    navTitle: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP images online to 20KB, 50KB, or 100KB for exam and job forms. Free, private in-browser photo compressor with zero server uploads.',
    icon: '🗜️',
    path: '/image-compressor.html',
    filename: 'image-compressor.html',
    category: '🖼️ Image Tools',
    badge: 'Free',
    tags: [
      'Image Compressor',
      'Compress Image Online',
      'Reduce Image Size',
      'Photo Compressor',
      'Compress Image to 20KB',
      'Compress Image to 50KB',
      'Compress Image to 100KB',
      'Photo Ka Size Kaise Kam Kare',
      'Reduce Photo Size',
      'JPG Compressor',
      'PNG Compressor',
      'WebP Compressor',
      'Govt Exam Photo Size',
      'Passport Photo Size'
    ],
    features: [
      'Target Size Mode (20KB, 50KB, 100KB, 200KB, 500KB)',
      'By Quality % Slider (10-95%)',
      'Batch Image Queue & ZIP Download',
      'Auto Progressive Resolution Downscale',
      'JPG, PNG, & WebP Output Formats',
      'Local Browser Processing'
    ],
    howTo: [
      { title: "Select or Drag Photos", desc: "Drag and drop or select one or multiple JPG, PNG, or WebP images from your phone or desktop." },
      { title: "Choose Target Size or Quality", desc: "Pick a target limit such as 20KB, 50KB, or 100KB for portal uploads, or adjust the Quality slider to reduce file size." },
      { title: "Compress and Download", desc: "Inspect before/after file sizes and savings percentage, then download your compressed photos individually or as a ZIP archive." }
    ],
    faq: [
      {
        question: "How to compress image to 20KB, 50KB, or 100KB online?",
        answer: "Upload your JPG, PNG, or WebP photo into Zubware Image Compressor, select 'By Target Size (KB)' mode, and choose a preset button (20KB, 50KB, 100KB, or 200KB) or enter your exact required KB value. The tool automatically computes the optimal quality and dimensions to keep your photo under the selected limit without visible distortion."
      },
      {
        question: "Photo ka size kaise kam kare (How to reduce photo size)?",
        answer: "Photo ka size kam karne ke liye photo ko drag-and-drop ya upload karein, 'By Target Size' option mein jakar apni zaroorat ke mutabiq 20KB, 50KB ya 100KB chunein, aur Compress button dabayein. File bina kisi server upload ke aapke mobile ya computer browser mein turant compress hokar download ho jayegi."
      },
      {
        question: "Can I compress photos for government exams, SSC, UPSC, and job portals?",
        answer: "Yes. Most Indian government, banking, and recruitment portals (SSC, UPSC, State PSC, IBPS, NTA, Railway, and State Police) enforce strict photo upload limits between 20KB and 50KB, and signatures between 10KB and 20KB. Zubware's Target Size mode is built specifically to meet these exact portal constraints."
      },
      {
        question: "Mobile mein photo ka size kaise kam kare?",
        answer: "Aap kisi bhi mobile browser (Google Chrome, Safari, ya Firefox) mein Zubware Image Compressor khol sakte hain. Gallery se photo select karein, 20KB ya 50KB target size chunein aur Compress par click karein. Kisi third-party mobile app ya registration ki bilkul zaroorat nahi hai."
      },
      {
        question: "Does compressing an image reduce its visual quality?",
        answer: "Zubware uses adaptive compression algorithms that discard redundant metadata and imperceptible color details while preserving facial features and sharpness. When compressing a large 5MB photo to 20KB, resolution is progressively scaled to ensure the result looks crisp at document upload sizes."
      },
      {
        question: "Is it safe to compress private photos, ID proofs, and signatures?",
        answer: "Yes, 100% safe. Unlike traditional online compressors that transmit your images to remote cloud servers, Zubware compresses all files entirely inside your device's browser memory using HTML5 Canvas and WebAssembly. Your photos, signatures, and IDs are never uploaded to any server."
      },
      {
        question: "Which image formats can be compressed and exported?",
        answer: "Zubware supports compressing standard web image formats including JPG (JPEG), PNG, and WebP. You can choose to maintain the original format or convert between JPG, PNG, and WebP during the compression process."
      },
      {
        question: "Can I compress multiple photos in batch at once?",
        answer: "Yes. You can upload multiple photos simultaneously, apply a uniform target KB size or quality percentage across the entire batch, and download all compressed images in one click as a ZIP file."
      }
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
    title: "Rotate Image Online — Rotate Photos 90°, 180° or Custom Angles",
    navTitle: "Rotate Image",
    description: "Rotate images clockwise, counter-clockwise, or at custom angles online for free. Preview adjustments instantly and download PNG, JPG, or WebP files.",
    icon: '🔄',
    path: '/rotate-image.html',
    filename: 'rotate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Instant 90° Clockwise & Counter-Clockwise Rotation",
      "Full 180° Upside-Down Inversion",
      "Precision Angle Slider from -180° to +180°",
      "Batch Rotation for Multiple Files Simultaneously",
      "PNG, JPG & WebP High-Quality Export",
      "Zero Server Uploads & Complete Privacy"
    ],
    howTo: [
      { title: "Upload Image Files", desc: "Drag and drop one or multiple images into the tool or click to select files from your computer or phone." },
      { title: "Select Rotation Angle", desc: "Click the 90° clockwise or counter-clockwise buttons, or adjust the fine-tuning angle slider to straighten skewed photos." },
      { title: "Download Rotated Images", desc: "Review the live canvas orientation and download the rotated photos individually or as a batch in your preferred format." }
    ],
    faq: [
      { question: "Can I rotate an image by custom degrees to straighten a crooked horizon?", answer: "Yes. Use the continuous angle slider to rotate photos by exact fractional degrees between -180° and +180° with live visual feedback." },
      { question: "Will rotating a transparent PNG keep its transparency?", answer: "Yes. When exporting as PNG, transparent backgrounds are preserved without adding white or black background boxes." },
      { question: "Can I rotate multiple photos at the same time in batch mode?", answer: "Yes. You can upload multiple image files and apply uniform 90°, 180°, or 270° rotations to all photos in a single click." },
      { question: "Does rotating reduce the resolution or sharpness of the photo?", answer: "No. Standard 90-degree increments perform lossless pixel coordinate remapping on the full-resolution source file." },
      { question: "Is there a file size limit for rotating photos in the browser?", answer: "Because processing runs in client-side browser memory, you can comfortably rotate high-resolution photos up to 50MB each." }
    ]
  },
  {
    id: 'flip-image',
    title: "Flip Image Online — Mirror Photos Horizontally & Vertically",
    navTitle: "Flip Image",
    description: "Flip photos horizontally or vertically to create mirror reflections instantly in your browser. Maintain original image quality with no server uploads.",
    icon: '⇄',
    path: '/flip-image.html',
    filename: 'flip-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Horizontal Flip for Left-to-Right Mirror Reflection",
      "Vertical Flip for Top-to-Bottom Inversion",
      "Combined Dual-Axis Flip Transformations",
      "Live Real-Time Visual Canvas Preview",
      "Supports JPG, PNG, WebP & SVG Formats",
      "100% Client-Side In-Browser Processing"
    ],
    howTo: [
      { title: "Upload Your Photo", desc: "Select or drag and drop any image file from your device into the interactive canvas workspace." },
      { title: "Choose Flip Direction", desc: "Click Flip Horizontally to mirror left-to-right, or Flip Vertically to invert top-to-bottom." },
      { title: "Export Mirrored Image", desc: "Inspect the transformed image preview and click Download to save the flipped picture in full resolution." }
    ],
    faq: [
      { question: "What is the difference between flipping and rotating an image?", answer: "Flipping creates a mirror reflection across an axis (inverting left and right or top and bottom), whereas rotating turns the image around a central pivot point." },
      { question: "Can I flip a selfie image to correct inverted front-camera photos?", answer: "Yes. If your smartphone camera mirrored your selfie or flipped text on your clothing, clicking Flip Horizontally restores the natural view." },
      { question: "Does flipping alter the pixel dimensions or image resolution?", answer: "No. Flipping preserves the exact width, height, and pixel quality of your original image without compression degradation." },
      { question: "Can I flip transparent PNG logos without adding a solid background?", answer: "Yes. Transparent alpha channels are fully retained when saving flipped graphics in PNG or WebP formats." },
      { question: "Are my private pictures uploaded to a cloud server to flip?", answer: "No. The transformation executes directly on your device via HTML5 Canvas matrix scaling, ensuring complete privacy." }
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
    title: "Blur Image Online — Blur Faces, Backgrounds & Sensitive Data",
    navTitle: "Blur Image",
    description: "Blur sensitive information, faces, or full backgrounds with an interactive brush online. Adjust blur radius and brush size privately in your browser.",
    icon: '🌫️',
    path: '/blur-image.html',
    filename: 'blur-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Selective Brush Tool for Targeted Localized Blurring",
      "Full-Image Uniform Background Defocus Mode",
      "Adjustable Blur Radius, Intensity & Feathering",
      "Brush Size Slider with Dynamic Cursor Preview",
      "Multi-Step Undo & Redo History Controls",
      "Secure Client-Side Privacy Without Cloud Upload"
    ],
    howTo: [
      { title: "Load Photo into Canvas", desc: "Upload the image containing sensitive text, private faces, or backgrounds you wish to blur." },
      { title: "Paint over Sensitive Areas", desc: "Adjust your brush diameter and blur intensity slider, then paint directly over faces, license plates, or confidential numbers." },
      { title: "Review and Download Image", desc: "Verify the blurred areas with the live preview and download your redacted photo as a high-resolution PNG or JPG." }
    ],
    faq: [
      { question: "Can I blur only specific parts of a photo like a license plate or credit card?", answer: "Yes. The interactive paint brush lets you paint blur precisely over sensitive areas like ID numbers, faces, addresses, or license plates." },
      { question: "Can I apply a full-image blur to create an aesthetic background?", answer: "Yes. Switch to Full Image Blur mode and use the intensity slider to create soft, atmospheric background wallpapers for presentations or apps." },
      { question: "Can someone unblur or reverse the blurred areas after I download the file?", answer: "No. The blur operation permanently recalculates and merges pixel color averages into the rasterized output image, making reversal mathematically impossible." },
      { question: "Is there an undo option if I accidentally blur the wrong part of an image?", answer: "Yes. Full undo and redo history buttons allow you to step back and reapply brush strokes at any time before exporting." },
      { question: "Is my confidential or identity document uploaded to a server?", answer: "No. All pixel modifications occur strictly inside your local browser memory, making it safe for medical records, bank statements, and IDs." }
    ]
  },
  {
    id: 'pixelate-image',
    title: "Pixelate Image Online — Censor Photos & Create Pixel Art",
    navTitle: "Pixelate Image",
    description: "Pixelate sensitive photo areas or craft retro 8-bit art with an adjustable brush online. Control block sizes and export private images with no upload.",
    icon: '👾',
    path: '/pixelate-image.html',
    filename: 'pixelate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Interactive Brush for Targeted Censor Pixelation",
      "Full Image Pixel Art & 8-Bit Retro Filter Mode",
      "Adjustable Pixel Block Size Slider (4px to 64px)",
      "Customizable Brush Radius with Real-Time Stencil",
      "Non-Destructive Canvas Undo and Redo Controls",
      "Zero Cloud Transmission for Complete Data Privacy"
    ],
    howTo: [
      { title: "Upload Image to Workspace", desc: "Select or drag your photo onto the canvas to begin pixelating sensitive details or styling graphics." },
      { title: "Set Block Size and Paint", desc: "Choose your desired pixel block size and paint directly over faces, logos, or documents to censor them." },
      { title: "Download Pixelated Photo", desc: "Confirm the redacted areas on the canvas and download the finalized image file in PNG, JPG, or WebP format." }
    ],
    faq: [
      { question: "How does pixelation differ from Gaussian blurring for censorship?", answer: "Pixelation groups adjacent pixels into solid color blocks (mosaic tiles), creating high-contrast censorship or a retro 8-bit aesthetic, while blur softens color gradients smoothly." },
      { question: "Can the pixelated content be recovered or reversed by other software?", answer: "No. Pixelating replaces high-frequency detail across entire blocks with an average color value, discarding original pixel information permanently upon download." },
      { question: "Can I pixelate an entire photo to make video-game style pixel art?", answer: "Yes. You can apply the pixelation algorithm globally across the entire photo and adjust block size from subtle to extreme retro 8-bit resolution." },
      { question: "Can I adjust the size of the pixelation blocks?", answer: "Yes. The block size slider lets you dial in everything from tiny micro-mosaics to large, heavy censor blocks." },
      { question: "Are my private photos stored or transmitted across the web?", answer: "No. All image processing runs strictly within your browser via HTML5 Canvas, ensuring complete confidentiality for private and legal documents." }
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
    title: "Image Color Picker — Extract HEX, RGB & CMYK Colors from Photos",
    navTitle: "Color Picker",
    description: "Pick exact colors from any uploaded photo using a zoom loupe eyedropper. Inspect HEX, RGB, HSL, and CMYK color codes with one-click clipboard copying.",
    icon: '🎨',
    path: '/color-picker.html',
    filename: 'color-picker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Precision Eyedropper with Real-Time Zoom Magnifier",
      "Simultaneous HEX, RGB, HSL, HSV & CMYK Color Codes",
      "Recent Color Swatch History & Palette Generator",
      "One-Click Clipboard Copying for Web Developers",
      "Supports High-Resolution RAW, PNG, JPG & WebP Files",
      "100% In-Browser Execution with Zero Server Uploads"
    ],
    howTo: [
      { title: "Upload Any Image or Screenshot", desc: "Drop your design mockup, photograph, or brand asset into the interactive color inspector." },
      { title: "Hover and Click Exact Pixels", desc: "Use the real-time zoom loupe to inspect individual pixels and click anywhere on the image to sample a color." },
      { title: "Copy Color Codes or Export Palette", desc: "Click the copy icon beside HEX, RGB, HSL, or CMYK values, or review your session palette history." }
    ],
    faq: [
      { question: "Does the color picker show a magnified view for single-pixel precision?", answer: "Yes. An interactive zoom loupe follows your cursor, magnifying surrounding pixels so you can sample exact 1px lines and borders effortlessly." },
      { question: "Which color code formats are generated when I click a pixel?", answer: "The tool instantly computes HEX (with leading #), RGB (r, g, b), HSL (h%, s%, l%), HSV, and print-ready CMYK values." },
      { question: "Does the tool save a history of colors I have sampled?", answer: "Yes. Every sampled color is added to a visual palette bar at the bottom, allowing you to compare swatches and copy earlier colors anytime." },
      { question: "Can I pick colors from images with transparent backgrounds?", answer: "Yes. If you click transparent areas, the tool displays transparent alpha channels or background canvas values accurately." },
      { question: "Are my proprietary design mockups uploaded to Zubware servers?", answer: "No. The eyedropper reads pixel values directly from your browser’s canvas memory using client-side getImageData APIs." }
    ]
  },
  {
    id: 'image-info-viewer',
    title: "Image Information Viewer — Inspect EXIF, Dimensions & Metadata",
    navTitle: "Image Info Viewer",
    description: "Inspect image metadata, exact pixel dimensions, color depth, aspect ratio, and EXIF camera tags online. Generate detailed photo diagnostic reports.",
    icon: '🔍',
    path: '/image-info-viewer.html',
    filename: 'image-info-viewer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Exact Pixel Width, Height & Megapixel Calculations",
      "Aspect Ratio Detection & Standard Print Size Estimates",
      "Detailed EXIF Camera Data (Shutter, ISO, Aperture, Model)",
      "MIME Type, File Size in KB/MB & Color Bit Depth",
      "Transparency Detection for Alpha Channel Assets",
      "Client-Side Inspection Without Network File Uploads"
    ],
    howTo: [
      { title: "Select or Drop Image File", desc: "Upload any PNG, JPG, WebP, GIF, or SVG file to analyze its technical properties." },
      { title: "Review Technical Specifications", desc: "Explore comprehensive data cards detailing dimensions, aspect ratio, file size, color depth, and camera settings." },
      { title: "Copy Details or Print Diagnostic Summary", desc: "Copy individual metadata attributes or save the complete inspection summary for asset documentation." }
    ],
    faq: [
      { question: "What technical image details does this tool reveal?", answer: "It displays exact width and height, aspect ratio (e.g. 16:9, 4:3), total megapixels, file size in bytes/KB/MB, MIME type, color bit depth, and alpha transparency." },
      { question: "Can it read EXIF camera information from smartphone or DSLR photos?", answer: "Yes. If EXIF data is preserved in your JPEG file, it displays camera manufacturer, lens model, ISO speed, shutter speed, f-stop aperture, and capture timestamp." },
      { question: "Why does my photo show no EXIF data?", answer: "Many social media platforms and messaging apps strip EXIF tags automatically upon upload to protect user privacy. Unaltered camera files retain full tags." },
      { question: "Can I check whether a graphic has a transparent background?", answer: "Yes. The tool inspects the image buffer for alpha transparency channels and confirms whether transparent pixels are present." },
      { question: "Is my photo or its private EXIF location sent to a server?", answer: "No. Metadata extraction and dimension calculations occur entirely within your browser via the HTML5 File API and binary buffer readers." }
    ]
  },
  {
    id: 'background-color-changer',
    title: "Background Color Changer — Add Solid Colors & Gradients to Photos",
    navTitle: "Change BG Color",
    description: "Replace transparent image backgrounds with solid colors or smooth gradients online. Customize color palettes and export PNG or JPG files instantly.",
    icon: '🎨',
    path: '/background-color-changer.html',
    filename: 'background-color-changer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Solid Custom HEX & RGB Background Color Application",
      "Two-Color Linear & Radial Gradient Background Presets",
      "Passport White, Blue & Gray Background Shortcuts",
      "Ambient Soft Blur Backdrop Generator",
      "High-Resolution JPG & Transparent PNG Export",
      "Client-Side Browser Execution for Complete Privacy"
    ],
    howTo: [
      { title: "Upload Transparent Photo or Cutout", desc: "Upload a cutout PNG or transparent portrait image that needs a new background color." },
      { title: "Select Solid Color or Gradient Preset", desc: "Pick a solid color using the HEX color picker, choose an exam passport color, or configure a smooth gradient." },
      { title: "Download Image with New Background", desc: "Preview the composite output and download your updated picture as a high-quality JPG or PNG." }
    ],
    faq: [
      { question: "Can I add a white or light blue background for passport and visa photos?", answer: "Yes. Dedicated quick-select buttons allow you to apply compliant pure white (HEX #FFFFFF) or official light blue backgrounds for passport applications." },
      { question: "Does this tool work best with cutout images that already have transparency?", answer: "Yes. It seamlessly fills transparent background areas in PNG and WebP files. You can pair it with Zubware Background Remover for full end-to-end editing." },
      { question: "Can I create smooth gradient backdrops for product photos?", answer: "Yes. You can select custom start and end gradient colors, adjust angles, and create eye-catching e-commerce product presentations." },
      { question: "Does changing the background color reduce image quality?", answer: "No. The subject pixels from your original upload are layered at native resolution over the newly rendered background canvas." },
      { question: "Are my personal portrait photos uploaded to a cloud server?", answer: "No. Layering and compositing occur 100% inside your browser using HTML5 Canvas graphics." }
    ]
  },
  {
    id: 'rounded-corners',
    title: "Rounded Corner Generator — Round Photo Corners & Make Circular Avatars",
    navTitle: "Rounded Corners",
    description: "Round photo corners and create circular profile avatars online with live preview. Adjust individual corner radii and export transparent PNG images.",
    icon: '⭕',
    path: '/rounded-corners.html',
    filename: 'rounded-corners.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Uniform Corner Radius Slider with Real-Time Preview",
      "Independent 4-Corner Radius Controls (TL, TR, BR, BL)",
      "One-Click Perfect Circle & Ellipse Avatar Mode",
      "Transparent PNG Cutout or Custom Background Fill",
      "High-Resolution Image Processing & Download",
      "Zero Server Uploads for Maximum Photo Privacy"
    ],
    howTo: [
      { title: "Upload Your Image", desc: "Drag and drop your profile photo, app icon, or graphic into the rounded corner workspace." },
      { title: "Adjust Corner Radii or Choose Circle Mode", desc: "Move the uniform radius slider to curve edges, or unlock individual corners for asymmetrical design styles." },
      { title: "Save Rounded Image as PNG", desc: "Download your curved image with transparent rounded corners or a custom border fill color." }
    ],
    faq: [
      { question: "How do I create a perfectly circular avatar for social media profiles?", answer: "Click the Circular Avatar toggle button. If your image is square, it crops into a 1:1 circle; if rectangular, it creates a centered circular cutout." },
      { question: "Can I round only specific corners, like just the top two corners?", answer: "Yes. Unlock the Individual Corners mode to set custom pixel radii for Top-Left, Top-Right, Bottom-Right, and Bottom-Left separately." },
      { question: "Will the outer cropped corners remain transparent?", answer: "Yes. When you download the image as PNG, the clipped corner areas are completely transparent, perfect for placing on websites or app screens." },
      { question: "Can I add a solid background color behind the rounded corners instead of transparency?", answer: "Yes. You can toggle between transparent alpha clipping and a custom solid background color fill." },
      { question: "Are my images processed securely without cloud storage?", answer: "Yes. All clipping path calculations execute client-side in your browser using HTML5 Canvas." }
    ]
  },
  {
    id: 'image-border',
    title: "Image Border Generator — Add Custom Borders & Frames to Photos",
    navTitle: "Image Border",
    description: "Add solid, dashed, or double borders to your photos online with full color control. Adjust frame thickness and padding directly inside your browser.",
    icon: '🖼️',
    path: '/image-border.html',
    filename: 'image-border.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Solid, Dashed, Dotted & Double Border Styling Presets",
      "Custom Border Width & Thickness Slider (1px to 100px)",
      "Full Color Palette with HEX & Opacity Controls",
      "Inner Padding & Outer Frame Spacing Options",
      "Preserves Original Aspect Ratio & Pixel Sharpness",
      "100% In-Browser Execution with Instant Export"
    ],
    howTo: [
      { title: "Load Photo into the Editor", desc: "Upload any image you want to decorate with an outline border or photo frame." },
      { title: "Configure Border Style, Width & Color", desc: "Choose your preferred border style (solid, dashed, double), pick an outline color, and adjust border thickness." },
      { title: "Download Framed Picture", desc: "Review the bordered image on the live preview canvas and download your file in PNG or JPG format." }
    ],
    faq: [
      { question: "Can I add a border without cropping into my original image?", answer: "Yes. The border expands the canvas outwards, preserving 100% of your source photo content without cutting into edges." },
      { question: "Which border styles can I choose from?", answer: "You can choose between Solid, Dashed, Dotted, Double borders, and Rounded outline frames with customizable corner radii." },
      { question: "Can I choose any custom color for the border?", answer: "Yes. Use the built-in color picker or enter exact HEX, RGB, or HSL color codes to match your brand identity." },
      { question: "Can I create a white polaroid-style margin around my photo?", answer: "Yes. Set the border color to white and increase the border width or padding slider to achieve an authentic photographic print border." },
      { question: "Does adding a border compress or degrade image quality?", answer: "No. The image is rendered onto a high-resolution canvas at native dimensions before exporting." }
    ]
  },
  {
    id: 'image-frame',
    title: "Image Frame Generator — Add Decorative Photo Frames Online",
    navTitle: "Image Frame",
    description: "Add stylish Polaroid, shadow, and minimalist gallery frames to photos online for free. Customize frame colors, padding, and styles with live preview.",
    icon: '📸',
    path: '/image-frame.html',
    filename: 'image-frame.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Vintage Polaroid Frame with Customizable Bottom Caption Margin",
      "Modern Gallery Frame with Drop Shadow & Passpartout Border",
      "Frosted Glass & Minimalist Social Media Framing Styles",
      "Adjustable Matting Thickness, Padding & Background Fill",
      "High-Resolution JPG & PNG Image Output",
      "Client-Side Browser Processing with Zero Server Uploads"
    ],
    howTo: [
      { title: "Upload Your Photograph", desc: "Choose any vacation picture, portrait, or artwork to place inside a decorative frame." },
      { title: "Select Frame Theme and Adjust Spacing", desc: "Pick from Polaroid, Modern Art Gallery, Shadow, or Minimalist frames and fine-tune margin widths." },
      { title: "Export Framed Masterpiece", desc: "Preview the rendered framed photo and click Download to save the framed image in high resolution." }
    ],
    faq: [
      { question: "Can I make a Polaroid-style photo with an extended bottom margin?", answer: "Yes. The Polaroid preset automatically adds classic photographic borders with an extended bottom margin suitable for handwritten captions." },
      { question: "Does the gallery frame include realistic drop shadows?", answer: "Yes. The Gallery and Shadow presets add soft Gaussian drop shadows that create a dimensional, floating wall-art look." },
      { question: "Can I customize the color of the passpartout matting?", answer: "Yes. You can switch between traditional museum white, charcoal black, cream, or any custom color using the color picker." },
      { question: "Can I frame photos of any aspect ratio (e.g. square, 4:3, 16:9)?", answer: "Yes. The frame generator dynamically adapts to landscape, portrait, and square image dimensions automatically." },
      { question: "Are my private family photos uploaded to a cloud server?", answer: "No. All canvas layering and shadow effects are generated directly inside your local browser." }
    ]
  },
  {
    id: 'image-collage',
    title: "Image Collage Maker — Combine Multiple Photos Online Free",
    navTitle: "Image Collage",
    description: "Combine photos into clean grid, vertical, or horizontal collage layouts online. Adjust spacing, borders, and aspect ratios with instant local export.",
    icon: '🧩',
    path: '/image-collage.html',
    filename: 'image-collage.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Multiple Grid Layouts (2x2, 3x3, Side-by-Side, Vertical Stack)",
      "Custom Gutter Spacing, Margins & Background Colors",
      "Adjustable Corner Rounding for Individual Photo Tiles",
      "Automatic Aspect Ratio Fitting & Smart Crop Centering",
      "High-Definition PNG & JPG Collage Export",
      "100% In-Browser Privacy Without Server File Storage"
    ],
    howTo: [
      { title: "Upload Multiple Photos", desc: "Select 2 to 9 photos from your device to assemble into an aesthetic photo collage." },
      { title: "Pick a Layout and Customize Spacing", desc: "Choose a grid structure, adjust the gap spacing between photos, round tile corners, and pick a backdrop color." },
      { title: "Generate and Download Collage", desc: "Review the merged collage on the real-time canvas and download your high-resolution finished picture." }
    ],
    faq: [
      { question: "How many pictures can I combine into a single collage?", answer: "You can combine anywhere from 2 up to 9 photos across multiple multi-cell grid arrangements and stacked configurations." },
      { question: "Can I adjust the gap spacing between individual pictures?", answer: "Yes. The spacing slider lets you adjust the gutter from 0px (seamless edge-to-edge) up to wide white border spacing." },
      { question: "Does the collage maker preserve the sharpness of uploaded pictures?", answer: "Yes. It renders the collage on a high-resolution canvas scaled to match your input photos, avoiding blurry compression." },
      { question: "Can I change the background color behind the collage gaps?", answer: "Yes. Choose from white, black, pastel tones, or use the HEX color picker for any custom background accent." },
      { question: "Are my personal images uploaded to any server or database?", answer: "No. All photo tiling, positioning, and final collage rendering take place entirely within your browser memory." }
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
    title: "SVG Optimizer — Compress & Clean Vector SVG Code Online",
    navTitle: "SVG Optimizer",
    description: "Optimize vector SVG graphics by stripping editor metadata, comments, and empty tags. Reduce file size while preserving sharp vector rendering online.",
    icon: '⚡',
    path: '/svg-optimizer.html',
    filename: 'svg-optimizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Strips Inkscape, Adobe Illustrator & Figma Metadata",
      "Removes Unnecessary XML Comments & Doctypes",
      "Eliminates Empty Groups, Unused Defs & Hidden Paths",
      "Optimizes Path Coordinates with Decimal Precision Control",
      "Live Side-by-Side Vector Code & Visual Rendering Preview",
      "100% Client-Side Vector Cleanup with Zero Data Logging"
    ],
    howTo: [
      { title: "Upload or Paste SVG Vector Code", desc: "Upload an SVG file or paste raw vector XML markup directly into the code editor input." },
      { title: "Select Optimization Rules", desc: "Toggle metadata stripping, comment removal, and coordinate rounding options to maximize compression." },
      { title: "Copy Clean Code or Download Optimized SVG", desc: "Review the file size reduction percentage, copy the minified XML, or download your optimized .svg file." }
    ],
    faq: [
      { question: "Why do exported SVGs from Illustrator or Figma have large file sizes?", answer: "Design tools embed extensive proprietary metadata, editor namespaces, document histories, and redundant grouping tags that are unnecessary for web rendering." },
      { question: "Does optimizing an SVG reduce visual vector quality?", answer: "No. By removing non-rendering metadata and pruning unused tags, visual vector fidelity remains identical while drastically reducing payload size." },
      { question: "Can I copy the minified SVG code directly to paste into HTML or React JSX?", answer: "Yes. You can copy the clean inline SVG markup with one click or download the cleaned file as a `.svg` document." },
      { question: "How much file size reduction can I expect?", answer: "Unoptimized SVGs from design software often see 30% to 70% file size savings after stripping editor overhead." },
      { question: "Is my proprietary SVG design code transmitted to a server?", answer: "No. Parsing, regex sanitization, and minification execute entirely inside your browser via local DOMParser APIs." }
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
    title: "Image Compression Comparison — Compare Photo Quality Side-by-Side",
    navTitle: "Compression Comparison",
    description: "Compare original and compressed images side-by-side with an interactive split slider. Inspect compression artifacts with 2x and 4x zoom magnification.",
    icon: '🔍',
    path: '/compression-comparison.html',
    filename: 'compression-comparison.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Interactive Split-Screen Before & After Slider",
      "2x and 4x Precision Zoom Loupe for Pixel Inspection",
      "Exact File Size & Percentage Savings Comparison",
      "Supports JPG, WebP, PNG & AVIF Image Formats",
      "Side-by-Side Synchronized Pan and Zoom Navigation",
      "Zero Cloud Uploads with Local Browser Image Analysis"
    ],
    howTo: [
      { title: "Upload Original and Compressed Images", desc: "Select your uncompressed source image alongside a compressed version to compare them." },
      { title: "Drag Split Divider to Inspect Quality", desc: "Slide the interactive vertical divider across the canvas to observe fine details, textures, and edge sharpness." },
      { title: "Use Zoom Loupe for Micro-Artifact Inspection", desc: "Toggle 2x or 4x magnification to verify that text, gradients, and skin tones remain crisp without blocky artifacts." }
    ],
    faq: [
      { question: "How does the split-screen slider help evaluate image compression?", answer: "It overlays the original and compressed images on synchronized canvases, allowing you to slide the divider back and forth across identical pixels to spot quality loss." },
      { question: "What should I look for when comparing compressed photos?", answer: "Watch for color banding in gradients, ringing artifacts around sharp text edges, blockiness in dark shadows, and loss of fine texture in skin or fabric." },
      { question: "Can I zoom into specific areas to inspect compression artifacts up close?", answer: "Yes. Built-in 2x and 4x zoom magnification allows you to inspect individual pixel clusters with precision." },
      { question: "Does the tool display exact before-and-after file size numbers?", answer: "Yes. It calculates exact byte differences, file size reductions in KB, and total percentage savings achieved." },
      { question: "Are my uploaded benchmark images sent to an external server?", answer: "No. Both image files are loaded into browser memory and rendered locally via HTML5 Canvas without network transmission." }
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
    title: "Bulk Image Renamer & Resizer — Batch Resize and Rename Photos",
    navTitle: "Bulk Renamer & Resizer",
    description: "Batch resize, rename, and convert multiple images simultaneously in your browser. Apply sequential numbering, custom dimensions, and download as a ZIP.",
    icon: '⚡',
    path: '/bulk-image-renamer-resizer.html',
    filename: 'bulk-image-renamer-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Simultaneous Batch Resizing by Width, Height or Percentage",
      "Pattern Renaming with Prefixes, Suffixes & Sequential Numbers",
      "Format Conversion Across JPG, PNG & WebP Files",
      "Batch Quality Compression Slider for Target File Sizes",
      "One-Click ZIP Packaging for Fast Bulk Downloads",
      "100% Client-Side Processing Without Cloud Upload Limits"
    ],
    tags: ['bulk', 'rename', 'resize', 'images', 'e-commerce', 'property'],
    howTo: [
      { title: "Upload Multiple Photos", desc: "Drag and drop dozens of images into the batch processing queue simultaneously." },
      { title: "Configure Renaming and Resizing Settings", desc: "Set custom naming patterns (e.g. photo-001), specify max dimensions or scale percentage, and pick output formats." },
      { title: "Process Queue and Download ZIP", desc: "Click Start Batch Processing and download all resized and renamed photos packaged in a convenient ZIP file." }
    ],
    faq: [
      { question: "Can I rename dozens of photos with sequential numbering like image-01, image-02?", answer: "Yes. You can configure custom prefixes, suffixes, start numbers, and digit zero-padding (e.g., photo-001, photo-002)." },
      { question: "Can I resize all images to a maximum width while maintaining aspect ratio?", answer: "Yes. Specifying a maximum width automatically scales image height proportionally, preventing distortion." },
      { question: "Does the batch tool convert images to modern WebP format?", answer: "Yes. You can batch convert collections of large JPGs or PNGs into lightweight WebP format to speed up website loading." },
      { question: "How many photos can I process at one time?", answer: "You can process 50+ images in a single session depending on your device’s available RAM, all without hitting server upload limits." },
      { question: "Are my bulk image files uploaded to a cloud server?", answer: "No. Every photo is decoded, resized, renamed, and packaged into a ZIP archive entirely within your local browser session." }
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
    title: "Matching Parts Puzzle Video Maker — Create Viral Puzzle Shorts & Reels",
    navTitle: "Matching Parts Video",
    description: "Create satisfying vertical matching parts puzzle videos for TikTok, Shorts, and Reels. Customize slice counts, speeds, and audio in your browser.",
    icon: '📹',
    path: '/matching-parts-video-maker.html',
    filename: 'matching-parts-video-maker.html',
    category: '📹 Video Tools',
    badge: 'New',
    features: [
      "9:16 Vertical Video Canvas Optimized for Shorts, Reels & TikTok",
      "Custom Slice Counts (2 to 6 Horizontal or Vertical Sliding Parts)",
      "Adjustable Slide Animation Speeds & Reveal Timers",
      "Custom Headline Banners, Background Colors & Visual Themes",
      "Background Music & Audio Integration with Real-Time Audio Mixer",
      "Client-Side Video Rendering via MediaRecorder API"
    ],
    howTo: [
      { title: "Upload Your Image", desc: "Select an eye-catching photo or artwork that will be sliced into sliding puzzle parts." },
      { title: "Configure Slice Count and Slide Animations", desc: "Choose how many pieces to slice (e.g. 3 or 4 parts), set sliding speeds, and add a catchy title banner." },
      { title: "Render and Download Video", desc: "Preview the interactive animation on the canvas and render your vertical MP4 or WebM puzzle video." }
    ],
    faq: [
      { question: "What is a matching parts puzzle video?", answer: "It is a viral social video format where an image is divided into sliding segments moving at different speeds, challenging viewers to pause the video when all pieces align." },
      { question: "What video dimensions are generated?", answer: "The maker outputs standard 1080x1920 (9:16 vertical) format, ready for direct upload to YouTube Shorts, Instagram Reels, and TikTok." },
      { question: "Can I add my own background music or audio to the video?", answer: "Yes. You can upload an audio track or sound effect that plays alongside the sliding animations." },
      { question: "Can I customize the number of sliding puzzle pieces?", answer: "Yes. You can slice your image into 2, 3, 4, 5, or 6 independent sliding segments with varying movement directions." },
      { question: "Does video rendering require cloud server processing?", answer: "No. Video frames and audio streams are synthesized in real time directly inside your browser using the MediaRecorder API." }
    ],
    tags: ['video', 'puzzle', 'shorts', 'reels', 'matching parts', 'video generator', 'creator']
  },
  {
    id: 'lofi-song-maker',
    title: "Lofi Music Studio — Online Lofi Beat Maker & Ambient Synth",
    navTitle: "Lofi Studio",
    description: "Compose chill Lofi beats, ambient synths, and drum patterns directly in your browser. Mix vinyl crackle, rain sounds, and tape filters with zero install.",
    icon: '🎧',
    path: '/lofi-song-maker.html',
    filename: 'lofi-song-maker.html',
    category: '🎵 Audio Tools',
    badge: 'New',
    features: [
      "Interactive Synth Keyboard with Warm Nostalgic Lofi Tones",
      "Drum Machine Sequencer (Lofi Kick, Snare, Rimshot, Closed Hat)",
      "Atmospheric Ambient Soundscape Mixer (Rain, Vinyl Crackle, Tape Hiss)",
      "Vintage Low-Pass Filter, Wow/Flutter Pitch Wobble & Reverb",
      "Tempo (BPM) Adjustment & Pattern Sequencer",
      "Real-Time Audio Recording & WAV File Export"
    ],
    howTo: [
      { title: "Set Tempo and Layer Drum Beats", desc: "Choose your BPM (e.g. 75–85 BPM) and program mellow drum loops on the interactive step sequencer." },
      { title: "Play Chords and Blend Ambient Textures", desc: "Play dreamy chords on the keyboard synth and blend in soothing rain, crackling vinyl, or tape hiss ambience." },
      { title: "Record and Export Your Lofi Track", desc: "Hit the record button to capture your live performance and download your unique Lofi composition as a WAV file." }
    ],
    faq: [
      { question: "Do I need any musical instruments or external software to make Lofi beats?", answer: "No. The entire studio runs directly in your browser with built-in synth keys, drums, atmospheric sounds, and audio recording." },
      { question: "Can I add real vinyl crackle and background rain sounds?", answer: "Yes. Independent ambient volume sliders let you mix soothing rain showers, fireplace crackle, and nostalgic vinyl surface noise." },
      { question: "What gives Lofi music its signature vintage sound in this studio?", answer: "The studio integrates low-pass analog-style frequency filters, subtle pitch wow and flutter, and warm room reverberation." },
      { question: "Are the tracks I produce royalty-free?", answer: "Yes. All beats and synthesized melodies you create are 100% royalty-free for your personal projects, study playlists, or videos." },
      { question: "Can I record and download my tracks?", answer: "Yes. Click Start Recording, perform your sequence, and export the finalized master track directly to an uncompressed WAV file." }
    ],
    tags: ['lofi', 'music maker', 'lofi generator', 'chill beats', 'audio converter', 'lofi studio', 'vinyl', 'creator']
  },
  {
    id: 'lofi-maker',
    title: "Lofi Maker — Transform Any Song into Chill Lofi Music Online",
    navTitle: "Lofi Maker",
    description: "Transform any song into a chill Lofi track with warm vintage filters and tape ambience online. Adjust tempo and vinyl crackle directly in your browser.",
    icon: '🎧',
    path: '/lofi-maker.html',
    filename: 'lofi-maker.html',
    category: '🎵 Audio Tools',
    badge: 'Popular',
    features: [
      "One-Click Lofi Audio Transformation Preset",
      "Low-Pass EQ Filter to Cut Harsh Highs for Warm Tones",
      "Adjustable Playback Tempo & Pitch Slowdown Sliders",
      "Integrated Vinyl Noise & Ambient Rain Texture Overlay",
      "Spacey Reverb Room Size and Wet/Dry Mix Control",
      "Export Converted Audio Directly to WAV or MP3"
    ],
    howTo: [
      { title: "Upload Audio Track", desc: "Select any MP3, WAV, or AAC audio file from your device to convert into a chill Lofi version." },
      { title: "Fine-Tune Vintage Effects", desc: "Adjust the slowdown tempo slider, cut high frequencies with the low-pass filter, and blend vinyl crackle ambience." },
      { title: "Listen to Preview and Download", desc: "Preview the transformed Lofi music in real time and download the finished audio file to your computer or phone." }
    ],
    faq: [
      { question: "How does Lofi Maker turn normal music into Lofi audio?", answer: "It applies vintage low-pass filtering to remove harsh treble, slows down playback tempo slightly, and blends in subtle vinyl surface crackle." },
      { question: "Can I adjust how slow and deep the audio becomes?", answer: "Yes. The speed and pitch slider lets you fine-tune playback between 0.75x and 1.0x to achieve the exact chill vibe you want." },
      { question: "Can I turn off the background vinyl crackle if I only want the EQ effect?", answer: "Yes. The vinyl noise and ambient sliders are fully adjustable and can be turned down completely if you prefer clean audio." },
      { question: "Which audio formats can I upload for conversion?", answer: "You can upload MP3, WAV, AAC, M4A, OGG, and WebM audio files." },
      { question: "Is my audio uploaded to an external server?", answer: "No. All digital audio processing runs locally via the Web Audio API inside your browser, keeping your songs private." }
    ],
    tags: ['lofi', 'lofi maker', 'audio converter', 'lofi effect', 'mp3', 'chill', 'music', 'creator']
  },
  {
    id: 'slowed-and-reverb',
    title: "Slowed & Reverb Generator — Create Aesthetic Slowed + Reverb Audio",
    navTitle: "Slowed & Reverb",
    description: "Slow down songs and add atmospheric reverb online to create viral aesthetic audio tracks. Customize speed, pitch, and room depth with instant MP3 export.",
    icon: '🎧',
    path: '/slowed-and-reverb.html',
    filename: 'slowed-and-reverb.html',
    category: '🎵 Audio Tools',
    badge: 'New',
    features: [
      "Precision Speed Reduction Slider (0.70x to 0.95x)",
      "Coupled Pitch Shifting for Authentic Aesthetic Resonance",
      "Convolver & Algorithmic Reverb with Room Size Controls",
      "Wet/Dry Reverb Blend Slider for Ideal Space Balance",
      "Real-Time Waveform Visualizer & Audio Player Preview",
      "Direct In-Browser Audio Encoding & Free Download"
    ],
    howTo: [
      { title: "Upload Your Song", desc: "Drop any MP3 or WAV song file into the slowed and reverb workstation." },
      { title: "Adjust Speed and Reverb Depth", desc: "Slide the playback speed down (e.g. to 0.85x) and increase the reverb room size and wet mix sliders." },
      { title: "Preview and Download Track", desc: "Listen to the aesthetic slowed track with the live audio player and export your finished music file." }
    ],
    faq: [
      { question: "What is the \"slowed + reverb\" aesthetic audio style?", answer: "Popularized across TikTok and YouTube, it involves slowing a track by 10% to 20% while applying atmospheric reverb to evoke dreamy nostalgia." },
      { question: "Can I control the room size and echo depth of the reverb?", answer: "Yes. You can adjust the room impulse size, decay time, and wet/dry mix slider from subtle room acoustic to massive concert hall ambience." },
      { question: "Does slowing down the song also lower its musical pitch?", answer: "Yes. By default it lowers pitch proportionally with tempo (tape-style slowdown), creating the signature deep, warm vocal tone of the genre." },
      { question: "Can I listen to changes in real time before downloading?", answer: "Yes. The built-in audio player updates instantaneously as you move sliders, so you can test settings without waiting." },
      { question: "Are my audio files uploaded or stored on any server?", answer: "No. All DSP convolution, pitch shifting, and export run directly in client-side Web Audio API memory." }
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
    title: "Rotate PDF Online — Rotate and Save PDF Pages Permanently Free",
    navTitle: "Rotate PDF",
    description: "Rotate PDF pages 90, 180, or 270 degrees clockwise online with instant visual previews. Rotate all pages or selected pages and download updated PDFs free.",
    icon: '🔄',
    path: '/rotate-pdf.html',
    filename: 'rotate-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: [
      "Rotate Clockwise by 90°, 180°, or 270° Degrees",
      "Rotate All Pages or Specific Individual Pages Selectively",
      "Visual Interactive Page Thumbnails with Real-Time Rotation",
      "Preserves Original Vector Text, Bookmarks & Annotations",
      "High-Speed Local Assembly via pdf-lib in Browser Memory",
      "100% Private Client-Side Document Processing"
    ],
    howTo: [
      { title: "Upload PDF Document", desc: "Select or drag your PDF file into the rotation tool to load page thumbnails." },
      { title: "Select Pages and Rotation Angle", desc: "Click individual page thumbnails to rotate specific pages, or use the global 90°/180° buttons to rotate the entire document." },
      { title: "Save and Download Rotated PDF", desc: "Click Save and Download to compile your permanently rotated PDF document." }
    ],
    faq: [
      { question: "Can I rotate only a single upside-down page without changing the rest of the PDF?", answer: "Yes. You can click on any individual page thumbnail to rotate just that single page by 90°, 180°, or 270° without affecting other pages." },
      { question: "Is the rotation permanent when I open the PDF on another device?", answer: "Yes. The tool modifies the internal PDF page dictionary `/Rotate` attribute, so the pages remain permanently oriented correctly in Adobe Acrobat, Chrome, and print dialogs." },
      { question: "Does rotating a PDF degrade the text clarity or image resolution?", answer: "No. The rotation adjusts coordinate transformation matrices without recompressing or rasterizing underlying text or images." },
      { question: "Is there a page limit for rotating PDFs in the browser?", answer: "Documents with dozens or hundreds of pages process smoothly since thumbnail rendering and byte manipulation occur locally in fast WebAssembly/JavaScript." },
      { question: "Are my confidential PDF documents uploaded to a cloud server?", answer: "No. All PDF page parsing and rewriting happen entirely inside your local browser via pdf-lib." }
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
    title: "Reorder PDF Pages — Rearrange, Sort and Organize PDF Pages Online",
    navTitle: "Reorder Pages",
    description: "Rearrange, sort, or delete PDF pages using an intuitive visual drag-and-drop thumbnail grid. Save reorganized PDF documents quickly with zero quality loss.",
    icon: '🔀',
    path: '/reorder-pdf-pages.html',
    filename: 'reorder-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: [
      "Visual Drag-and-Drop Page Grid Reordering",
      "One-Click Move Controls (Move Forward, Backward, First, Last)",
      "Selective Page Deletion to Remove Unwanted Sheets",
      "Reverse Entire Document Page Order in One Click",
      "Retains All Original Embedded Fonts, Links & Vector Objects",
      "Completely Private Browser-Based Processing"
    ],
    howTo: [
      { title: "Upload Multi-Page PDF", desc: "Drag your PDF into the organizer to generate interactive page preview cards." },
      { title: "Drag or Move Pages to New Sequence", desc: "Drag page thumbnails to your desired order, use arrow shortcuts, or delete blank/unnecessary pages." },
      { title: "Download Reorganized PDF", desc: "Click Download to compile and save your freshly ordered PDF document with full original formatting." }
    ],
    faq: [
      { question: "How do I rearrange pages in my PDF document?", answer: "Simply drag and drop page thumbnails to their new positions in the grid, or use the quick arrow buttons to shift pages forward or backward." },
      { question: "Can I delete unwanted or blank pages while reordering?", answer: "Yes. Each thumbnail card features a trash icon that removes that specific page from the final compiled document." },
      { question: "Can I reverse the entire page order of a scanned document?", answer: "Yes. Click the \"Reverse Order\" button to invert the page sequence instantly from last to first." },
      { question: "Does reordering change the formatting, hyperlinks, or text of the pages?", answer: "No. The tool copies full underlying PDF page object trees without touching text streams, preserving vector fidelity." },
      { question: "Are my legal contracts or tax files uploaded to a remote server?", answer: "No. Document page trees are restructured entirely within your local browser session using pdf-lib." }
    ]
  },
  {
    id: 'pdf-watermark',
    title: "Add Watermark to PDF — Stamp Text or Logo Watermarks on PDF Files",
    navTitle: "Add Watermark",
    description: "Add custom text or image logo watermarks to PDF documents online. Adjust opacity, rotation angle, position, and color with complete local privacy.",
    icon: '💧',
    path: '/pdf-watermark.html',
    filename: 'pdf-watermark.html',
    category: 'PDF Tools',
    badge: 'New',
    features: [
      "Text Watermark Mode with Custom Strings (e.g. DRAFT, CONFIDENTIAL)",
      "Image Logo Watermark Mode Supporting PNG & JPG Graphics",
      "Precision Opacity Slider from 10% Subtle to 100% Solid",
      "Diagonal Angle Rotation (e.g. 45° across page)",
      "Positioning Controls (Center, Corners, Top/Bottom Headers)",
      "100% Client-Side Processing for Sensitive Documents"
    ],
    howTo: [
      { title: "Upload PDF Document", desc: "Select the PDF file you want to protect or brand with a watermark stamp." },
      { title: "Configure Text or Upload Image Logo", desc: "Type your custom watermark text or upload a transparent PNG logo, then adjust rotation angle, opacity, and color." },
      { title: "Apply Watermark and Download", desc: "Review the preview and click Download to save the watermarked PDF file." }
    ],
    faq: [
      { question: "Can I add a semi-transparent \"CONFIDENTIAL\" or \"DRAFT\" stamp across all pages?", answer: "Yes. Enter your custom text, set the angle to 45 degrees, and adjust the opacity slider to 20–30% for a professional translucent stamp." },
      { question: "Can I stamp a company logo image instead of text?", answer: "Yes. Switch to Image mode and upload your PNG or JPG logo to overlay it onto every page at your chosen position and opacity." },
      { question: "Can I choose where the watermark appears on the page?", answer: "Yes. You can position the watermark in the exact center of the page, across the background diagonally, or in header/footer corners." },
      { question: "Does watermarking affect existing text and signatures in the PDF?", answer: "No. Watermarks are rendered as a clean overlay layer, preserving the clarity and structure of all underlying document content." },
      { question: "Are my confidential documents uploaded to a cloud server to watermark?", answer: "No. The overlay rendering executes 100% within your browser memory using client-side PDF libraries." }
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
    title: "PDF Metadata Viewer & Editor — View, Edit or Strip PDF Properties",
    navTitle: "PDF Metadata",
    description: "Inspect and edit PDF document metadata including title, author, and keywords online for free. Strip all metadata tags for privacy before sharing files.",
    icon: '📋',
    path: '/pdf-metadata.html',
    filename: 'pdf-metadata.html',
    category: 'PDF Tools',
    badge: 'New',
    features: [
      "Inspect Title, Author, Subject, Keywords, Creator & Producer",
      "Edit Core Document Properties & Custom Metadata Fields",
      "One-Click \"Strip All Metadata\" Anonymization Tool",
      "View PDF Version, Page Dimensions & Creation Timestamps",
      "Preserves Full Page Content, Form Fields & Text Layers",
      "Zero Cloud Uploads for Total Anonymity & Privacy"
    ],
    howTo: [
      { title: "Upload PDF File", desc: "Drop your PDF document into the metadata inspector to read its embedded properties." },
      { title: "View, Modify or Clear Metadata Fields", desc: "Edit document Title, Author, or Keywords, or click Strip All to sanitize personal information." },
      { title: "Save and Download Cleaned PDF", desc: "Click Save PDF to download your updated or fully anonymized document." }
    ],
    faq: [
      { question: "What hidden metadata is stored inside PDF files?", answer: "PDFs often contain your full name, software operating system, computer username, software producer (e.g. Word, InDesign), and exact creation timestamps." },
      { question: "Why should I strip metadata before submitting resumes or research papers?", answer: "Clearing metadata ensures anonymous peer review compliance, prevents employers from seeing past edit histories, and safeguards personal privacy." },
      { question: "Can I update the Title property so PDF viewers display the correct document name?", answer: "Yes. Updating the Title field ensures web browsers and PDF readers display a clean title in browser tabs rather than random file paths." },
      { question: "Does modifying metadata alter the visual layout or printable text of the PDF?", answer: "No. Metadata editing updates only the document information dictionary and XMP metadata stream without altering any visible pages." },
      { question: "Are my sensitive files uploaded to a remote server during inspection?", answer: "No. The metadata dictionary is read and rewritten entirely in client-side memory using pdf-lib." }
    ]
  },
  {
    id: 'qr-generator',
    title: 'Create a QR Code From a URL or Text',
    navTitle: 'QR Code Generator',
    description: 'Create free custom QR codes from URLs, text, WiFi, and vCards online. Fast, private in-browser generation with PNG, vector SVG, and PDF downloads. Zero uploads.',
    icon: '📱',
    path: '/qr-generator.html',
    filename: 'qr-generator.html',
    category: 'Generators',
    badge: 'Free',
    tags: [
      'QR Code Generator',
      'Free QR Code Generator',
      'QR Code Generator Online',
      'Create QR Code Online',
      'QR Code Maker',
      'QR Generator',
      'Create QR Code from URL',
      'Create QR Code from Text',
      'QR Code Kaise Banaye',
      'Website Link ka QR Code Kaise Banaye',
      'URL ka QR Code Kaise Banaye',
      'Free QR Code Generator Online',
      'QR Generator No Watermark',
      'Vector SVG QR Code',
      'Client Side QR Generator'
    ],
    features: [
      'URL, Plain Text, Wi-Fi & vCard Contact Generation',
      'High-Resolution PNG, Scalable Vector SVG & A4 PDF Exports',
      'Center Brand Logo Upload with Level-H Error Correction',
      'Custom Dot Styles, Corner Eye Patterns & Gradient Fills',
      '100% Local In-Browser Processing (No Server Uploads & No Watermark)'
    ],
    howTo: [
      { title: "Enter or Select Content", desc: "Choose your content type (Website URL, Plain Text, Wi-Fi Network, or vCard Contact) and enter your details into the input field." },
      { title: "Customize Design & Logo (Optional)", desc: "Select custom colors, gradients, dot patterns, eye styles, or upload your center brand logo with automatic high error correction." },
      { title: "Preview & Scan Test", desc: "Review the instant real-time preview and test-scan the matrix with your smartphone camera to ensure quick readability." },
      { title: "Download PNG, SVG or PDF", desc: "Export your clean, unwatermarked QR code as a high-resolution PNG image, scalable vector SVG for printing, or printable A4 PDF." }
    ],
    faq: [
      {
        question: "What is a QR code generator?",
        answer: "A QR code generator is a tool that converts text strings, website URLs, Wi-Fi credentials, contact cards (vCards), or payment details into a two-dimensional matrix barcode that can be scanned by any smartphone camera."
      },
      {
        question: "How do I create a QR code from a URL?",
        answer: "Select the URL content tab, paste or type your full website address (including https://), and the QR code will instantly generate in real time. You can customize colors, dot styles, or embed a brand logo before downloading."
      },
      {
        question: "How do I create a QR code from plain text?",
        answer: "In the URL / Text input field, enter any plain text message, note, code, or instruction. The generator encodes your text directly into the matrix, which will display on the user's screen when scanned."
      },
      {
        question: "Is this QR code generator free and unwatermarked?",
        answer: "Yes, 100% free with no watermarks, no hidden fees, and no scan limits. The generated QR codes belong entirely to you for personal and commercial use."
      },
      {
        question: "Can I create a QR code on my mobile phone?",
        answer: "Yes. Zubware QR Code Generator is fully responsive and runs on any modern mobile browser including Chrome on Android and Safari on iOS without downloading any mobile app."
      },
      {
        question: "Do I need to sign up or create an account to generate QR codes?",
        answer: "No account registration, email address, or login is required. You can immediately create, test, and download your QR codes upon opening the page."
      },
      {
        question: "Is my QR code data uploaded to an external server?",
        answer: "No. All QR encoding and canvas rendering take place entirely inside your device's browser memory. Your links, Wi-Fi passwords, and contact cards are never sent to or stored on any remote server."
      },
      {
        question: "What formats can I download the QR code in?",
        answer: "You can download your QR code as a high-resolution PNG image, a scalable vector SVG file for infinite-resolution printing, or a print-ready A4 PDF document. You can also copy the image directly to your clipboard."
      }
    ]
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder — Free Professional CV Maker Online',
    navTitle: 'Resume Builder',
    description: 'Free online resume builder to create professional, ATS-friendly resumes in your browser. Live preview, customizable sections, 20 styles, and instant PDF download without sign-up.',
    icon: '📄',
    path: '/resume-builder.html',
    filename: 'resume-builder.html',
    category: '💼 Career Tools',
    badge: 'Core Tool',
    tags: [
      'resume builder',
      'free resume builder',
      'resume builder online',
      'free resume maker',
      'create resume online',
      'build resume online',
      'CV builder',
      'free CV builder',
      'resume builder without signup',
      'resume builder PDF',
      'download resume as PDF',
      'ATS friendly resume builder',
      'resume builder for freshers',
      'resume kaise banaye',
      'resume kaise banaye online',
      'resume kaise banaye PDF',
      'fresher resume kaise banaye',
      'job ke liye resume kaise banaye',
      'client side resume builder',
      'no signup resume maker'
    ],
    features: [
      '100% Free & No Sign-Up Required',
      'ATS-Friendly Layouts & Standards',
      'Instant Download as PDF, HTML & JSON',
      '20 Design Templates & Layout Presets',
      'Custom Reorderable Sections & Colors',
      'Auto-Saved Locally in Browser Storage',
      'Multi-Language Support (8 Languages)',
      'Built-in ATS Checklist & Action Verbs'
    ],
    howTo: [
      {
        title: "Fill Contact Information & Personal Details",
        desc: "Enter your full name, targeted job title, email, phone number, location, and optional links for LinkedIn, GitHub, or portfolio website. Add an optional professional headshot."
      },
      {
        title: "Add Experience, Education & Core Skills",
        desc: "Add your work history with quantifiable bullet points, education credentials, technical and soft skills, and optional sections like Projects, Certifications, or Awards."
      },
      {
        title: "Pick Template, Customize Styling & Review ATS Checklist",
        desc: "Choose from 20 templates (Modern, Classic, ATS Clean, Executive), adjust primary colors, font family, margins, and paper format (A4 or Letter). Check the ATS completeness score."
      },
      {
        title: "Download Print-Ready PDF or Export JSON Backup",
        desc: "Click 'Download PDF' for an immediate print-ready document formatted for job applications. You can also export a JSON backup to edit or update your resume anytime."
      }
    ],
    faq: [
      {
        question: "Is this resume builder completely free to use without sign-up or watermark?",
        answer: "Yes, Zubware Resume Builder is 100% free with no account creation, no email registration, no subscription paywalls, and no watermarks on downloaded PDFs. You can create, edit, and download your resume immediately."
      },
      {
        question: "Are the generated resumes ATS-friendly?",
        answer: "Yes. The builder uses standardized single-column and clean two-column layouts, standard semantic typography, universal section headers (Experience, Education, Skills), and clean text hierarchy. It avoids complex tables, icons in critical text paths, or multi-layered graphics that confuse Applicant Tracking Systems (ATS)."
      },
      {
        question: "Can I download my resume as a PDF file?",
        answer: "Yes. Clicking 'Download PDF' compiles your resume into a clean vector PDF formatted for either A4 or US Letter paper size. You can also export your resume as an HTML file or a JSON backup."
      },
      {
        question: "Can freshers with no experience use this resume maker?",
        answer: "Yes. Freshers and college students can load the pre-filled sample data or start from scratch. Using the section manager, you can reorder sections so Education, Academic Projects, Skills, and Internships appear prominently before Work Experience."
      },
      {
        question: "Online resume kaise banaye? (Mobile aur PC par)",
        answer: "Zubware par resume banana behad aasan hai: (1) Apne mobile ya computer browser mein tool kholein, (2) Personal details, Education, Skills aur Projects enter karein, (3) 'Templates' tab se manpasand design chunein, aur (4) 'Download PDF' par tap karke print-ready resume turant save karein. Kisi app download ya signup ki zaroorat nahi hai."
      },
      {
        question: "Can I save my resume and edit it later?",
        answer: "Yes. Your resume data is automatically auto-saved in your browser's local storage (localStorage). When you return on the same browser, your resume reloads automatically. For multi-device use or permanent backup, use 'Export JSON' and 'Import JSON' at any time."
      },
      {
        question: "Can I customize the order of sections or add custom headings?",
        answer: "Yes. Under the 'Order' and 'More Sections' tabs, you can drag or click to reorder sections, enable or disable sections (such as Certifications, Publications, Languages, and Hobbies), and add custom sections with your own headings and bullet points."
      },
      {
        question: "Is my personal data and employment history private?",
        answer: "Yes, completely. All resume processing and storage happen 100% on your device inside your web browser. Zubware never uploads, stores, analyzes, or shares your contact information or work history on external servers."
      }
    ]
  },
  {
    id: 'ats-resume-checker',
    title: 'ATS Resume Checker — Check Your Resume ATS Score Online',
    navTitle: 'ATS Checker',
    description: 'Free online ATS resume checker. Scan your resume against job postings to calculate your ATS match score, detect missing keywords, and verify formatting in your browser.',
    icon: '🎯',
    path: '/ats-resume-checker.html',
    filename: 'ats-resume-checker.html',
    category: '💼 Career Tools',
    badge: 'Core Tool',
    tags: [
      'ats resume checker',
      'ats checker',
      'free ats resume checker',
      'ats resume checker online',
      'resume ats score',
      'ats score checker',
      'check resume ats score',
      'ats friendly resume checker',
      'resume checker online',
      'resume compatibility checker',
      'resume scanner',
      'resume ats test',
      'check resume for ats',
      'resume keywords for ats',
      'ats resume format',
      'ats friendly resume',
      'resume ats score kaise check kare',
      'resume ats friendly hai ya nahi',
      'ats resume checker kaise use kare',
      'resume ats score kaise badhaye',
      'job ke liye ats resume kaise banaye'
    ],
    features: [
      '100% Free & No Sign-Up Required',
      'Overall ATS Compatibility Score (0-100%)',
      'Technical & Soft Skills Keyword Breakdown',
      'Missing Job Keyword Detection',
      'Experience & Role Title Alignment',
      'Contact Info & Format Risk Flags',
      'Instant PDF Match Report Export',
      '100% Private In-Browser Scanning'
    ],
    howTo: [
      {
        title: "Upload Resume or Paste Content",
        desc: "Upload your resume as a PDF, TXT, or Markdown document, or paste the text directly into the resume input pane. You can also import an active draft from the Zubware Resume Builder."
      },
      {
        title: "Enter Target Job Title & Description",
        desc: "Paste the full job listing, required qualifications, and key responsibilities for the target role you want to apply for."
      },
      {
        title: "Run the ATS Match Scan",
        desc: "Click 'Scan ATS Match Compatibility' to analyze keyword frequency, technical skills, soft skills, title alignment, and contact information completeness."
      },
      {
        title: "Review Missing Keywords & Export Report",
        desc: "Inspect your overall ATS match score, review matched vs missing keywords, implement tailoring recommendations, and download a PDF match report or copy the summary."
      }
    ],
    faq: [
      {
        question: "What is an ATS resume checker?",
        answer: "An ATS (Applicant Tracking System) resume checker is a diagnostic tool that scans your resume against a specific job posting. It evaluates keyword overlap, technical skills, core competencies, contact details, and text formatting to estimate how well automated recruiting software can parse and rank your application."
      },
      {
        question: "What does the ATS resume score mean?",
        answer: "The ATS match score (0-100%) represents the mathematical alignment between your resume and the target job description. It is calculated from four dimensions: Technical Skills Match (45%), Title & Experience Alignment (25%), Soft Skills & Competencies (15%), and Formatting & Contact Safety (15%). A score of 80%+ indicates strong keyword alignment."
      },
      {
        question: "How do I check if my resume is ATS friendly?",
        answer: "To test your resume: (1) Upload your PDF or paste your resume text into the checker, (2) Paste the job description you want to apply for, (3) Click 'Scan ATS Match Compatibility'. The tool flags missing keywords, checks for email and phone numbers, and evaluates text content density."
      },
      {
        question: "Is this ATS resume checker free and private?",
        answer: "Yes, 100% free with no account creation, no email sign-up, and no paid paywalls. Furthermore, all PDF text extraction, keyword parsing, and scoring algorithms execute entirely inside your device's web browser. Your resume and job postings are never uploaded to remote servers or stored in any database."
      },
      {
        question: "Which resume file formats are supported?",
        answer: "You can upload PDF (.pdf) documents directly, as well as plain text (.txt) and Markdown (.md) files. You can also paste formatted text directly into the editor or load your active draft from the Zubware Resume Builder with one click."
      },
      {
        question: "Does a high ATS score guarantee an interview or job offer?",
        answer: "No automated tool can guarantee an interview. While high keyword alignment helps your resume pass initial automated filters and reach human recruiters, hiring managers ultimately make decisions based on portfolio quality, measurable achievements, cultural fit, and interview performance."
      },
      {
        question: "How can I improve my ATS resume score?",
        answer: "Review the 'Missing Keywords' box after scanning and incorporate those exact technical skills, tools, and methodologies into your bullet points where you have authentic experience. Align your summary headline with the targeted job title and ensure your email and phone number are clearly formatted in plain text."
      },
      {
        question: "Resume ATS score kaise check kare? (Mobile aur PC par)",
        answer: "Apne mobile ya computer browser mein Zubware ATS Resume Checker kholein: (1) Apni resume PDF upload karein ya text paste karein, (2) Job vacancy ka description paste karein, aur (3) 'Scan ATS Match Compatibility' par tap karein. Tool aapko overall ATS score, matched skills, aur missing keywords turant dikha dega."
      }
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
    title: 'UUID Generator — Bulk v1 & v4 UUID/GUID Maker Online',
    navTitle: 'UUID Generator',
    description: 'Generate bulk UUID v4 and v1 strings online in your browser. Fast client-side generation, uppercase/lowercase toggles, hyphens, braces, and instant TXT download.',
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
    title: 'Hash Generator — MD5, SHA-1, SHA-256 & SHA-512 Hash Maker',
    navTitle: 'Hash Generator',
    description: 'Generate cryptographic MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally in real-time. Fast browser-based checksum calculations with instant copy and export.',
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
    title: 'JWT Decoder — Decode & Inspect JSON Web Tokens Online',
    navTitle: 'JWT Decoder',
    description: 'Decode JSON Web Tokens (JWT) locally in your browser. Inspect header, payload claims, expiration status, and issued time with zero server uploads for privacy.',
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
    title: 'Unix Timestamp Converter — Epoch to Human Date Converter',
    navTitle: 'Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human-readable dates and vice versa in UTC or local timezone. Supports seconds, milliseconds, live clock, and date-time picker.',
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
    title: 'Regex Tester & Explainer — Test Regular Expressions Online',
    navTitle: 'Regex Tester',
    description: 'Test regular expressions against sample text with live highlights, capture groups, and plain English token breakdown. Fast client-side JavaScript regex debugging.',
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
    title: 'JSON Formatter & Tree Viewer — Beautify & Validate JSON Online',
    navTitle: 'JSON Formatter',
    description: 'Beautify, format, validate, and inspect collapsible JSON tree structures in your browser. Clean 2-space or 4-space indentation, minification, and instant copy.',
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
    title: 'JSON Validator — Check JSON Syntax & Line Error Detector',
    navTitle: 'JSON Validator',
    description: 'Validate JSON syntax online, pinpoint exact line and column error coordinates, and repair malformed quotes or trailing commas. Fast and private client-side tool.',
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
    title: 'JSON to CSV Converter — Convert JSON Array to CSV Online',
    navTitle: 'JSON to CSV',
    description: 'Convert JSON arrays and objects into clean CSV spreadsheets with live table preview and instant CSV download. 100% private client-side browser conversion.',
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
    title: 'CSV to JSON Converter — Convert CSV Data to JSON Online',
    navTitle: 'CSV to JSON',
    description: 'Convert CSV spreadsheets and TSV files into formatted JSON objects or arrays. Auto-detects delimiters, infers data types, and exports clean JSON in browser.',
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
    title: 'CSV Viewer & Data Grid — Inspect & Search Tabular CSV Online',
    navTitle: 'CSV Viewer',
    description: 'Inspect, search, sort by column, filter, and paginate large CSV datasets directly in your browser. Fast client-side spreadsheet data grid with instant export.',
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
    description: 'Download publicly accessible website HTML, CSS, JavaScript, and images into an organized ZIP archive with relative link rewriting. Fast client-side packaging.',
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
    title: 'HTML Formatter & Preview — Beautify & Indent HTML Code',
    navTitle: 'HTML Formatter',
    description: 'Beautify, format, indent, and preview HTML markup code in real-time. Supports custom indentation, tag rules, void element handling, and instant code export.',
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
    title: 'CSS Formatter & Beautifier — Clean & Indent CSS Stylesheet',
    navTitle: 'CSS Formatter',
    description: 'Format, beautify, and indent CSS stylesheets with expanded or compact styles. Clean up messy declarations, sort properties, and export production-ready code.',
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
    title: 'JavaScript Formatter — Beautify JS & TypeScript Code Online',
    navTitle: 'JS Formatter',
    description: 'Beautify, format, un-minify, and indent JavaScript and TypeScript code online. Supports ES6+ syntax, custom quotes, semicolons, and private client execution.',
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
    title: 'XML Formatter — Beautify & Indent XML Documents Online',
    navTitle: 'XML Formatter',
    description: 'Beautify, format, and indent raw XML documents, RSS feeds, SVG code, and SOAP payloads. Clean attribute alignments, syntax checking, and fast browser export.',
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
    title: 'XML Validator — Check XML Syntax & Unmatched Tags Online',
    navTitle: 'XML Validator',
    description: 'Validate XML syntax online, detect unmatched opening or closing tags, and identify invalid entities. Fast, private client-side well-formedness XML checker.',
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
    title: 'URL Component Parser — Extract Query Params & Hostname Online',
    navTitle: 'URL Parser',
    description: 'Break down complex URL strings into protocol, hostname, port, pathname, hash fragment, and query parameters. Parse, edit, and export parameters in browser.',
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
    title: 'URL Encoder & Decoder — Encode & Decode URI Components Online',
    navTitle: 'URL Encoder',
    description: 'Encode special characters into percent-encoded URL formats or decode web links back to readable text. Supports encodeURI and encodeURIComponent standards.',
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
    title: 'Base64 Encoder & Decoder — Encode & Decode Base64 Strings Online',
    navTitle: 'Base64 Tool',
    description: 'Encode plain text and files to Base64 or decode Base64 strings back to UTF-8 text and binary files. Supports URL-safe Base64 and instant client-side download.',
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
    title: 'HTML Escape & Unescape — Convert Special Characters to Entities',
    navTitle: 'HTML Escape',
    description: 'Escape HTML markup characters into safe entity codes (&lt;, &gt;, &amp;, &quot;) or unescape entities back into markup. Fast client-side browser conversion.',
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
    title: 'HTTP Header Viewer — Inspect Response & CORS Headers Online',
    navTitle: 'Header Viewer',
    description: 'Inspect HTTP response headers, status codes, and latency in your browser. Audit security rules for CSP, HSTS, X-Frame-Options, and Cache-Control headers.',
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
    title: 'API Request Builder — Test REST API Endpoints in Browser',
    navTitle: 'API Request Builder',
    description: 'Send HTTP requests (GET, POST, PUT, DELETE) and inspect status codes, headers, and JSON responses directly in browser. Clean headers and body payload editor.',
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
    title: 'Color Converter & Contrast — HEX, RGB, HSL, CMYK & WCAG Tool',
    navTitle: 'Color Converter',
    description: 'Convert colors across HEX, RGB, HSL, and CMYK formats with real-time WCAG accessibility contrast checks. Visual palette swatches and 1-click code copying.',
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
    title: 'QR Code Decoder — Scan & Read QR Codes from Images Online',
    navTitle: 'QR Decoder',
    description: 'Upload any image or screenshot containing a QR code to extract its underlying text or web link completely client-side. Fast, private in-browser QR reading.',
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
    title: 'Age Calculator — Calculate Your Exact Age Online',
    navTitle: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days from your date of birth. Free online age calculator with next birthday countdown, total days, and hours.',
    icon: '🎂',
    path: '/age-calculator.html',
    filename: 'age-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: [
      'Exact Chronological Age in Years, Months, and Days',
      'Custom Age at Date: Calculate Age on Past or Future Milestones',
      'Comprehensive Time Units: Total Months, Weeks, Days, Hours, Minutes & Seconds',
      'Next Birthday Countdown Timer with Day of the Week',
      'Day of Birth Detection & Astrological Signs (Zodiac, Chinese Zodiac, Birthstone)',
      'Biological Journey Milestones: Estimated Heartbeats, Breaths & Sleep Time',
      'One-Click Copy Age Summary Card to Clipboard',
      '100% Client-Side Browser Processing with Zero Server Tracking'
    ],
    howTo: [
      { title: "Select Date of Birth", desc: "Pick your birth date using the calendar input or enter your birth year, month, and day." },
      { title: "Choose Reference Date", desc: "Keep the target date set to today to find your current age, or select any past or future date to determine your exact age at a specific milestone." },
      { title: "Review Exact Age Breakdown", desc: "Inspect your exact chronological age in completed years, months, and days, along with total elapsed days, weeks, hours, and next birthday countdown." },
      { title: "Copy or Share Age Card", desc: "Click 'Copy Age Card' to copy your complete age breakdown and milestone statistics to your clipboard." }
    ],
    faq: [
      { question: "How do I calculate my age from my date of birth?", answer: "To calculate your age, enter your birth date into the Date of Birth field. The calculator automatically compares your birth date against today's date (or any custom reference date you select) and displays your exact chronological age in completed years, months, and days." },
      { question: "How does an online age calculator work?", answer: "An age calculator computes the precise calendar difference between two dates. It first calculates completed full years, then accounts for elapsed months, and finally determines remaining days using the exact day count of each intervening calendar month." },
      { question: "Can I calculate my exact age in years, months, and days?", answer: "Yes. Unlike rough approximations that simply divide elapsed days by 365, Zubware calculates calendar-accurate years, months, and days, honoring varying month lengths (28, 29, 30, and 31 days) and leap years." },
      { question: "What is an Online Age Calculator by Date of Birth?", answer: "An Online Age Calculator by Date of Birth is a browser-based utility that takes your birth date and instantly determines your chronological age, day of birth, next birthday countdown, and secondary units like total days, hours, and minutes without requiring manual calendar math." },
      { question: "Can I calculate my age on a specific future or past date?", answer: "Yes. Change the 'Age at Date (Reference Date)' field to any date. You can calculate how old you will be at retirement, how old you were when graduating, or your age on an official application cutoff date." },
      { question: "How does the calculator handle leap years and February 29 birthdays?", answer: "The calculator correctly accounts for leap years containing 366 days (with 29 days in February). For individuals born on February 29 (a leap day), age increases by one year on each subsequent February 28 / March 1 depending on common legal calendar convention." },
      { question: "What is the difference between chronological age and dividing total days by 365?", answer: "A calendar year varies between 365 days (common year) and 366 days (leap year), and months range from 28 to 31 days. Dividing total days by 365 produces a fractional decimal (e.g., 25.42 years) that does not match official calendar birthdays. Chronological age reflects real calendar milestones." },
      { question: "Can I calculate my age on a mobile phone?", answer: "Yes. Zubware Age Calculator is fully responsive and touch-optimized for iOS and Android smartphones. You can use your mobile browser's native date picker to calculate your age on the go with zero lag and no app installation." },
      { question: "Can I use this age calculator for exam forms and job applications?", answer: "Yes. Many competitive exams and job applications require applicants to state their exact age as of a specific cutoff date (such as July 1 or January 1). Enter the advertised cutoff date into 'Age at Date' to find your exact years, months, and days for the form." },
      { question: "Can an age calculator determine official exam or retirement eligibility?", answer: "No. While the calculator gives you mathematically exact chronological age, official eligibility rules, minimum/maximum age limits, and age relaxations (such as category or service quotas) depend entirely on the issuing authority's specific notification." },
      { question: "What additional time units are displayed in the age breakdown?", answer: "Beyond years, months, and days, the tool displays total completed months, total elapsed weeks, total calendar days, total hours, total minutes, and total seconds lived." },
      { question: "How is the next birthday countdown calculated?", answer: "The tool determines your upcoming birthday anniversary date in the current or following calendar year and computes the exact remaining calendar days and day of the week it will fall on." },
      { question: "What is the difference between chronological age and cultural age systems?", answer: "Chronological age starts at zero on your birth date and increases on each annual anniversary (the international standard ISO 8601). Some traditional cultural systems (such as traditional East Asian age reckoning) count an infant as one year old at birth and add a year on the New Year." },
      { question: "Is my date of birth saved, logged, or shared with external servers?", answer: "No. All date calculations and milestone breakdowns run 100% locally inside your web browser using client-side JavaScript. Your birth date is never transmitted across the network, stored in cookies, or saved to any database." }
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
    title: "Tip Calculator — Split Bill & Calculate Gratuity Online",
    navTitle: "Tip Calculator",
    description: "Calculate tip amounts and split restaurant bills evenly among friends online. Adjust tip percentages and review per-person totals with live calculations.",
    icon: '🍽️',
    path: '/tip-calculator.html',
    filename: 'tip-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: [
      "Instant Tip Amount & Total Bill Calculation",
      "Even Bill Splitting Across Any Number of People",
      "Quick-Select Tip Presets (10%, 15%, 18%, 20%, 25%)",
      "Custom Tip Percentage Slider for Precise Gratuity",
      "Real-Time Per-Person Cost Breakdown Display",
      "100% Client-Side In-Browser Calculation"
    ],
    howTo: [
      { title: "Enter Bill Amount", desc: "Input the total pre-tip check amount from your restaurant, café, or service bill." },
      { title: "Choose Tip Percentage", desc: "Select a standard gratuity preset or use the slider to set a custom tip rate." },
      { title: "Set Number of People and Review Totals", desc: "Adjust the group size counter to view total tip, combined bill, and individual cost per person." }
    ],
    faq: [
      { question: "How is the total tip and per-person split calculated?", answer: "The tip is calculated by multiplying the bill amount by your chosen tip percentage. Adding the tip to the bill gives the total amount, which is then divided equally by the number of people in your party." },
      { question: "What is the standard tip percentage in restaurants?", answer: "In the US and Canada, standard restaurant tipping is typically 15% to 20% for good service, with 18% being a common baseline for average dinner service." },
      { question: "Can I calculate custom tip percentages like 12% or 22%?", answer: "Yes. You can enter any custom percentage value or drag the slider to calculate exact custom tip amounts." },
      { question: "Does the calculator run privately without saving my financial details?", answer: "Yes. All calculations happen instantly within your browser with zero data stored or sent to any server." }
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
    title: "Number to Words Converter — Convert Numbers to Words Online",
    navTitle: "Number to Words",
    description: "Convert numbers and currency into written English words online. Supports International and Indian numbering systems with audio pronunciation and copy.",
    icon: '🔢',
    path: '/number-to-words.html',
    filename: 'number-to-words.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: [
      "Converts Numbers into Written English Words Instantly",
      "Dual International (Millions, Billions) & Indian (Lakhs, Crores) Systems",
      "Currency Formats (USD Dollars, INR Rupees, GBP Pounds, EUR Euros)",
      "Built-in Speech Pronunciation via Web Speech API",
      "One-Click Clipboard Copying for Checks and Legal Forms",
      "Handles Large Numbers and Decimal Fractions"
    ],
    howTo: [
      { title: "Type or Paste a Number", desc: "Enter any positive, negative, or decimal number into the converter input." },
      { title: "Select Numbering System and Currency", desc: "Choose between International or Indian numbering systems and pick a currency format if needed." },
      { title: "Copy or Listen to Words", desc: "Click Copy to paste the written words into legal documents or checks, or click Listen to hear pronunciation." }
    ],
    faq: [
      { question: "How do International and Indian numbering systems differ?", answer: "The International system groups digits by thousands (thousands, millions, billions, trillions), whereas the Indian system groups by hundreds after the first thousand (thousands, lakhs, crores)." },
      { question: "Can I use this tool to write checks and financial vouchers?", answer: "Yes. Selecting currency mode formats amounts with standard banking text (such as \"Five Thousand Dollars and Fifty Cents Only\"), suitable for writing official checks." },
      { question: "Does the converter support decimal cents or paise?", answer: "Yes. Decimal numbers are accurately converted into cents, paise, or fractional words based on your selected currency." },
      { question: "Can I hear the words spoken out loud?", answer: "Yes. The built-in audio button uses your browser’s text-to-speech synthesis to pronounce the full converted phrase." }
    ]
  },
  {
    id: 'words-to-number',
    title: "Words to Number Converter — Convert Written Words to Numbers Online",
    navTitle: "Words to Number",
    description: "Convert written English number phrases into numeric digits and formatted numbers online. Parse complex written numbers with instant clipboard copy.",
    icon: '🔤',
    path: '/words-to-number.html',
    filename: 'words-to-number.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: [
      "Parses Written Number Words into Accurate Numeric Digits",
      "Handles Large Magnitudes (Thousands, Millions, Billions, Trillions)",
      "Supports Decimal Words (e.g. \"point five\", \"and seventy-five hundredths\")",
      "Negative Number Phrase Detection (e.g. \"minus forty-two\")",
      "Displays Standard Formatted & Raw Numeric Outputs",
      "100% In-Browser Natural Language Number Parsing"
    ],
    howTo: [
      { title: "Enter Written Words", desc: "Type or paste number phrases such as \"two million three hundred forty-five thousand\"." },
      { title: "Automatic Real-Time Parsing", desc: "The tool immediately evaluates written words and calculates the equivalent mathematical value." },
      { title: "Copy Digits to Clipboard", desc: "Click Copy to copy the formatted number (with commas) or raw integer to your clipboard." }
    ],
    faq: [
      { question: "Which word formats are recognized by the converter?", answer: "It parses cardinal numbers (one, twenty, hundred), hyphenated compounds (twenty-five), large scale words (million, billion), negative indicators (minus, negative), and decimals (point)." },
      { question: "Can it convert spoken transcriptions or voice recognition text into numbers?", answer: "Yes. You can paste speech-to-text transcripts containing spoken numbers to transform them into clean numeric digits." },
      { question: "Does it handle informal phrases like \"a hundred\" or \"a thousand\"?", answer: "Yes. Common English phrasing where \"a\" signifies 1 (such as \"a hundred\" or \"a thousand\") is parsed correctly." },
      { question: "Is my input text sent across the internet?", answer: "No. Linguistic parsing runs entirely inside your browser using client-side JavaScript regex and vocabulary tokenization." }
    ]
  },
  {
    id: 'roman-numeral-converter',
    title: "Roman Numeral Converter — Convert Numbers to Roman Numerals Online",
    navTitle: "Roman Numerals",
    description: "Convert numbers to Roman numerals and Roman numerals to numbers online. Check date translations, historical year charts, and standard notation rules.",
    icon: '🏛️',
    path: '/roman-numeral-converter.html',
    filename: 'roman-numeral-converter.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: [
      "Bidirectional Arabic to Roman & Roman to Arabic Conversion",
      "Validates Roman Numeral Syntax (Subtractive Notation Rules)",
      "Supports Standard Values from 1 to 3,999 (I to MMMCMXCIX)",
      "Quick Historical Year Presets (Current Year, Milestones, Centuries)",
      "Interactive Roman Numeral Reference Symbols & Values Chart",
      "Instant Conversion with One-Click Clipboard Copying"
    ],
    howTo: [
      { title: "Enter Number or Roman Numeral", desc: "Type standard digits (e.g., 2026) or a Roman numeral string (e.g., MMXXVI)." },
      { title: "Review Bidirectional Result", desc: "The tool automatically detects the input format and outputs the corresponding counterpart with syntax validation." },
      { title: "Copy Converted Text", desc: "Click Copy to paste your Roman numeral for tattoos, clock designs, outlines, or book chapters." }
    ],
    faq: [
      { question: "What are the basic Roman numeral symbols and their values?", answer: "The fundamental Roman symbols are I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, and M = 1,000." },
      { question: "How does subtractive notation work in Roman numerals?", answer: "When a smaller symbol precedes a larger one, it is subtracted rather than added. For example, IV is 4 (5 - 1), IX is 9 (10 - 1), and CM is 900 (1000 - 100)." },
      { question: "What is the highest number standard Roman numerals can represent?", answer: "In standard classical notation without vinculum overlines, the maximum number is 3,999 (MMMCMXCIX)." },
      { question: "Can I convert calendar years like 2026 into Roman numerals?", answer: "Yes. Entering 2026 converts to MMXXVI, which is widely used in copyright notices, movie credits, and graduation plaques." }
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
    title: "Increase PDF Size Online — Make PDF File Size Larger for Uploads",
    navTitle: "Increase PDF Size",
    description: "Increase PDF file size to meet minimum upload requirements on government and exam portals. Inject compliant data safely without altering page layout.",
    icon: '📈',
    path: '/increase-pdf-size.html',
    filename: 'increase-pdf-size.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      "Target File Size Specification in Kilobytes (KB) or Megabytes (MB)",
      "Pads PDF to Meet Minimum Threshold (e.g. Minimum 100KB, 200KB, 500KB)",
      "Preserves 100% of Original Vector Text, Images & Page Layouts",
      "Injects Non-Destructive Compliant Metadata Streams",
      "Validates Output Against Standard PDF Readers and Portals",
      "100% Client-Side Processing with No Server Uploads"
    ],
    howTo: [
      { title: "Upload Your PDF File", desc: "Select the PDF document that is currently too small for your target application portal." },
      { title: "Specify Target Minimum Size in KB or MB", desc: "Enter the required minimum file size (e.g., 200KB or 1MB) specified by the exam or job portal." },
      { title: "Generate and Download Padded PDF", desc: "Click Adjust Size to inflate the file safely and download your larger, compliant PDF." }
    ],
    faq: [
      { question: "Why would an online portal require a minimum PDF file size?", answer: "Many government, university, and recruitment portals use automated upload filters that reject files under 100KB or 200KB under the assumption that tiny files are blank or corrupted." },
      { question: "How does this tool increase PDF file size without changing the visual content?", answer: "It injects safe, compliant uncompressed binary padding streams into the PDF structure, expanding file size while leaving every page, word, and image completely unchanged." },
      { question: "Will the larger PDF still open in standard viewers like Adobe Acrobat and Chrome?", answer: "Yes. The injected padding conforms strictly to standard ISO 32000 PDF specifications, opening smoothly in all viewers and portal validators." },
      { question: "Can I increase a PDF from 50KB to 200KB or 500KB accurately?", answer: "Yes. You can enter any target size in KB or MB, and the tool will calculate the exact byte difference needed to hit your target." },
      { question: "Is my application document uploaded to a server?", answer: "No. The padding injection runs directly in your local browser runtime via pdf-lib and ArrayBuffers." }
    ]
  },
  {
    id: 'decrease-pdf-size',
    title: "Decrease PDF Size Online — Compress and Reduce PDF File Size",
    navTitle: "Decrease PDF Size",
    description: "Compress and reduce PDF file size online while preserving text clarity and document layout. Choose compression presets to meet portal size limits.",
    icon: '📉',
    path: '/decrease-pdf-size.html',
    filename: 'decrease-pdf-size.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      "Multi-Level Compression Presets (Low, Medium, Strong Compression)",
      "Target Maximum File Size Optimization for Strict Upload Portals",
      "Maintains Crisp Selectable Vector Text & Document Structure",
      "Detailed Real-Time File Size Savings & Percentage Metrics",
      "Removes Redundant Fonts, Unused Objects & Heavy Image Data",
      "100% In-Browser Execution Ensuring Private Document Security"
    ],
    howTo: [
      { title: "Upload Heavy PDF File", desc: "Select the large PDF document you need to shrink for email attachments or upload limits." },
      { title: "Select Compression Strength Preset", desc: "Choose Low compression for maximum visual sharpness, Medium for balanced quality, or Strong for maximum file size reduction." },
      { title: "Download Compressed PDF", desc: "Review the before-and-after file size numbers and download your smaller, optimized PDF document." }
    ],
    faq: [
      { question: "How does Decrease PDF Size reduce file size in the browser?", answer: "It strips unreferenced font descriptors, optimizes internal PDF object streams, and recompresses embedded raster graphics at efficient quality levels." },
      { question: "Will my PDF text remain sharp and selectable after compression?", answer: "Yes. Vector text and fonts remain native vector objects and stay perfectly crisp when zoomed or printed." },
      { question: "Which compression preset should I use for job applications and email attachments?", answer: "Medium compression is ideal for most applications, offering substantial file size savings (typically 40–70%) while keeping graphics clear." },
      { question: "Can I see the exact before-and-after file size in KB/MB?", answer: "Yes. The interface shows original file size, compressed file size, and the exact percentage reduction achieved." },
      { question: "Are my private financial records or legal contracts uploaded to a server?", answer: "No. The entire compression process executes strictly within your browser memory with zero network transmission." }
    ]
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor — Compress PDF Files Online Free',
    navTitle: 'PDF Compressor',
    description: 'Compress PDF files online for free. Reduce PDF size with Extreme, Recommended, and High Quality presets. 100% private in-browser compression with zero uploads.',
    icon: '🗜️',
    path: '/pdf-compressor.html',
    filename: 'pdf-compressor.html',
    category: '📄 PDF Tools',
    badge: 'Free',
    tags: [
      'PDF Compressor',
      'Compress PDF Online',
      'Reduce PDF Size',
      'PDF Size Reducer',
      'Compress PDF Free',
      'PDF Ka Size Kaise Kam Kare',
      'Shrink PDF File',
      'Reduce PDF File Size',
      'Compress PDF for Email',
      'Government Exam PDF Size',
      'Client-Side PDF Compressor'
    ],
    features: [
      'Recommended (Balanced), Extreme & High Quality Presets',
      'Real-time Size Savings & Reduction % Calculator',
      'Multi-Page Document Stream & Image Optimization',
      'Preserves Crisp Vector Text, Fonts & Dimensions',
      '100% Local In-Browser Processing (Zero Server Upload)'
    ],
    howTo: [
      { title: 'Select or Drag Your PDF', desc: 'Choose a PDF file from your device or drag and drop it directly into the compressor.' },
      { title: 'Select Compression Strength', desc: 'Pick Recommended (~50-65% reduction), Extreme (maximum savings), or High Quality (light compression) preset.' },
      { title: 'Compress and Download', desc: 'Click Compress PDF, view the space saved and reduction percentage, then download your optimized document.' }
    ],
    faq: [
      {
        question: 'How does Zubware PDF Compressor reduce file size without losing text quality?',
        answer: 'Selectable text, fonts, and vector illustrations are stored as mathematical vector paths in PDF documents and remain 100% sharp during compression. The compressor optimizes embedded raster images, downsamples redundant resolution, and strips unreferenced document metadata directly in your browser.'
      },
      {
        question: 'PDF ka size kaise kam kare (How to reduce PDF file size)?',
        answer: 'PDF ka size kam karne ke liye PDF file ko Zubware PDF Compressor mein select ya drag karein. Portal ya email requirement ke hisaab se Recommended ya Extreme compression preset chunein, aur Compress button dabayein. File bina kisi server upload ke aapke browser mein turant compress hokar download ho jayegi.'
      },
      {
        question: 'Which compression preset should I choose for email attachments and portal uploads?',
        answer: 'Use the Recommended (Medium) preset for job resumes, contracts, and standard email attachments (~50% to 65% reduction with great visual fidelity). If you are uploading to a government portal or recruitment form with strict upload caps (such as 1MB or 2MB), select Extreme Compression for maximum size reduction (~70% to 85%).'
      },
      {
        question: 'Can I compress multi-page PDF documents and scanned forms?',
        answer: 'Yes. Zubware PDF Compressor processes multi-page documents all at once. Every page, embedded photo, and internal document stream across the entire file is parsed and optimized simultaneously.'
      },
      {
        question: 'Mobile mein PDF ka size kaise kam kare?',
        answer: 'Aap kisi bhi mobile browser (Google Chrome ya Safari) mein Zubware PDF Compressor open karein. Apne phone storage ya Files app se PDF upload karein, compression strength select karein aur Compress par click karein. Kisi third-party app ya registration ki zaroorat nahi hai.'
      },
      {
        question: 'Are confidential legal contracts, bank statements, and tax documents safe to compress?',
        answer: 'Yes, 100% safe. Traditional online PDF tools upload your sensitive documents to external cloud servers. Zubware PDF Compressor runs entirely inside your browser memory using client-side JavaScript and WebAssembly. Your files never leave your device and are never sent to any remote server.'
      },
      {
        question: 'Why did my PDF file compress only slightly?',
        answer: 'PDFs that consist primarily of plain vector text or documents that have already been heavily optimized have few redundant bytes to eliminate. Image-heavy PDFs, presentations, and high-DPI scanned documents experience the highest size reductions (often between 50% and 85%).'
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
    title: "Text to PDF Converter — Convert Plain Text to PDF Online Free",
    navTitle: "Text to PDF",
    description: "Convert plain text, notes, and articles into formatted, printable PDF documents online. Customize fonts, margins, paper sizes, and page numbering free.",
    icon: '📝',
    path: '/text-to-pdf.html',
    filename: 'text-to-pdf.html',
    category: '📄 PDF Tools',
    badge: 'New',
    features: [
      "Standard Paper Sizes (A4, US Letter, Legal)",
      "Portrait & Landscape Page Orientation Toggles",
      "Customizable Fonts (Serif, Sans-Serif, Monospace) & Font Sizes",
      "Adjustable Page Margins, Line Spacing & Document Headers",
      "Automatic Multi-Page Flow & Pagination Engine",
      "Instant Local PDF Compilation with Complete Privacy"
    ],
    howTo: [
      { title: "Paste or Upload Text Content", desc: "Type, paste, or upload plain text notes, articles, or code snippets into the text area." },
      { title: "Configure Page Layout and Typography", desc: "Choose paper size (A4/Letter), orientation, font family, line spacing, margins, and document title." },
      { title: "Generate and Download Formatted PDF", desc: "Click Convert to PDF and download your clean, printable document instantly." }
    ],
    faq: [
      { question: "Does the converter automatically split long text across multiple pages?", answer: "Yes. The pagination engine measures line heights and page margins to break long text seamlessly into sequential pages." },
      { question: "Can I choose between A4 and US Letter page sizes?", answer: "Yes. You can select A4, US Letter, or Legal page sizes in either Portrait or Landscape orientation." },
      { question: "Can I convert code snippets using a monospace font?", answer: "Yes. Switch the font family to Monospace to preserve code indentation and column alignment." },
      { question: "Can I add custom headers, footers, or page numbers?", answer: "Yes. You can configure document header titles and automatic page numbering in the margin settings." },
      { question: "Is my typed text or document content sent to any server?", answer: "No. All text parsing and PDF synthesis occur client-side inside your browser." }
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
    title: "Signature Resizer — Resize Signature Images for Online Exam Forms",
    navTitle: "Signature Resizer",
    description: "Resize signature images to required pixel dimensions and KB limits for SSC, UPSC, IBPS, and state exam forms. Auto-crop empty edges with zero server upload.",
    icon: '📏',
    path: '/signature-resizer.html',
    filename: 'signature-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Custom Dimensions in Pixels (px), Centimeters (cm), Millimeters (mm) & Inches",
      "Official Exam Presets for SSC, UPSC, IBPS, Passport/Visa & Application Forms",
      "Target File Size Limits (< 20 KB, < 50 KB, < 100 KB) with Adaptive JPEG Compression",
      "Auto-Crop Empty White Margins & Tight Non-Ink Boundary Trimming",
      "Aspect Ratio Lock & Instant Scaling Percentages (25% to 200%)",
      "Solid White Background or Transparent Canvas with Direct JPG/PNG Download",
      "100% Client-Side Browser Processing with Zero Server Uploads & Full Privacy"
    ],
    howTo: [
      { title: "Upload Scanned Signature Photo", desc: "Select or drop your handwritten signature photo (JPG, PNG, or WebP) captured with a smartphone or flatbed scanner." },
      { title: "Select Exam Preset or Units", desc: "Choose a recruitment preset (e.g. 140 × 60 px for SSC/IBPS) or enter custom width and height in px, cm, mm, or inches." },
      { title: "Configure Crop, Background & File Size Cap", desc: "Enable auto-crop to remove blank paper margins, select transparent or white background, and pick a KB limit like < 20 KB." },
      { title: "Preview Live Dimensions & Download", desc: "Compare original vs output dimensions in the live preview and download your form-compliant JPG or PNG image instantly." }
    ],
    faq: [
      { question: "How do I resize and compress a signature image to under 20KB for SSC, IBPS, or UPSC portals?", answer: "Upload your signature, set the required dimensions (typically 140 × 60 pixels for SSC and IBPS Bank exams), and click the '< 20 KB' button under Target File Size Limit. Zubware automatically adjusts JPEG compression quality in your browser so the resulting file stays strictly below the 20 KB threshold without pixelating or blurring pen strokes." },
      { question: "What are the standard signature dimensions and file sizes for Indian competitive exams?", answer: "Most major Indian portals require: SSC (CGL, CHSL, MTS, GD) — 140 × 60 px, 10 KB to 20 KB in JPG format; IBPS & SBI Bank exams — 140 × 60 px, 10 KB to 20 KB; UPSC (Civil Services, NDA, CDS) — minimum 350 × 350 px, 20 KB to 300 KB; NTA NEET & JEE — 4 cm × 2 cm (approx. 140 × 70 px), 4 KB to 30 KB; and Railway RRB — 140 × 60 px, 10 KB to 20 KB in JPG format." },
      { question: "Can I convert signature measurements from centimeters (cm) to pixels (px)?", answer: "Yes. Switch the dimension unit selector to 'cm' or 'mm'. Zubware automatically calculates standard 96 DPI pixel values (for example, 4 cm corresponds to ~151 px and 2 cm corresponds to ~76 px) so you do not have to perform manual mathematical conversions." },
      { question: "How does the auto-crop margins feature work?", answer: "When taking a mobile photo of a signature on paper, large empty margins often surround the ink strokes. Checking 'Auto-crop empty edges' scans canvas pixel data, identifies bounding ink coordinates, and trims blank white borders before scaling. This ensures your signature fills the designated upload frame rather than appearing as a tiny smudge." },
      { question: "Should I download my resized signature in JPG or PNG format?", answer: "For government recruitment portals, university admissions, and online exam forms, always select JPG format because most application portals reject PNG files. If you need a transparent signature for PDF contracts or digital document signing, choose PNG format." },
      { question: "Is my handwritten legal signature uploaded or stored on any server?", answer: "No. All canvas rendering, edge trimming, resizing, and JPEG compression take place 100% locally inside your web browser memory. Your personal handwritten signature is never transmitted across the internet or stored on Zubware servers, eliminating any risk of identity theft or forgery." }
    ]
  },
  {
    id: 'photo-signature-joiner',
    title: "Photo and Signature Joiner — Combine Photo & Signature Online Free",
    navTitle: "Photo & Signature Joiner",
    description: "Combine candidate passport photos and signatures into a single image for exam portals. Choose vertical or horizontal layout, adjust sizes, and export in JPG.",
    icon: '🪪',
    path: '/photo-signature-joiner.html',
    filename: 'photo-signature-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Vertical Stack Mode (Photo on Top, Signature Below) for Recruitment Admit Cards",
      "Horizontal Side-by-Side Mode for Identity Badges & Office Credentials",
      "Application Presets: Exam Portal (300×460), Standard ID (240×390), High Res (400×670)",
      "Independent Width & Height Sizing Controls for Both Photo and Signature",
      "Customizable Gap & Padding Spacing Sliders (0px to 40px)",
      "Adjustable Outer Border Width (0 to 4px) with Custom Color Picker",
      "Direct Form-Ready JPG or Transparent PNG Download with Zero Watermark",
      "100% Private Client-Side Processing with No Server Uploads"
    ],
    howTo: [
      { title: "Upload Passport Photo & Signature", desc: "Select or drag your candidate passport photo into slot 1 and your scanned signature image into slot 2." },
      { title: "Choose Layout Arrangement", desc: "Select Vertical (Stacked) for standard exam admit cards, or choose Horizontal for employee and student ID cards." },
      { title: "Select Preset or Customize Sizing", desc: "Click a standard preset like Exam Portal (300×460 px) or input custom pixel widths and heights for each element." },
      { title: "Fine-Tune Spacing, Border & Format", desc: "Adjust spacing gap, outer padding, optional separation border color, and choose form-ready JPG format." },
      { title: "Download Combined Image", desc: "Preview the rendered composite canvas and click Download to save your unified image file for instant form submission." }
    ],
    faq: [
      { question: "Why do exam and job recruitment portals require photo and signature in a single image file?", answer: "Several Indian recruitment boards (such as MPPEB/Vyapam, High Court recruitments, State Police boards, and departmental recruitment portals) require candidates to upload a single combined file to ensure the applicant's signature is indelibly joined to their photograph. This prevents impersonation during biometric verification at exam test centers." },
      { question: "What is the standard vertical layout ratio for combined photo and signature?", answer: "Standard recruitment guidelines typically specify an overall canvas width of 300 pixels and height of 460 pixels (or 400 × 670 pixels for high resolution). In this configuration, the passport photo occupies approximately 300 × 350 pixels on top, and the signature occupies 300 × 100 pixels directly beneath it with a clean gap or border." },
      { question: "Can I adjust individual photo and signature dimensions independently?", answer: "Yes. Zubware allows you to independently specify photo width, photo height, signature width, and signature height in pixels. The composite canvas dynamically recalculates total width and height in real time." },
      { question: "Can I add an outer border or change background color?", answer: "Yes. You can customize the outer border thickness (None, 1px, 2px, or 4px) and choose a custom border color using the color picker. You can also toggle between crisp white, light slate, or transparent backgrounds." },
      { question: "Which format should I use when downloading the combined image for forms?", answer: "Most government application portals mandate JPG/JPEG format for image uploads. Select JPG before clicking download to ensure 100% compatibility with online application verification systems." },
      { question: "Are my passport photos or signature images uploaded to your servers?", answer: "No. The entire composite image is rendered using HTML5 Canvas directly inside your browser memory. Neither your photograph nor your signature is ever uploaded to or stored on Zubware servers, ensuring complete privacy." }
    ]
  },
  {
    id: 'photo-name-date-joiner',
    title: "Add Name and Date to Photo Online — Exam Photo Editor Free",
    navTitle: "Name & Date on Photo",
    description: "Add candidate name and date of photo (DOP) to passport pictures for recruitment exams. Customize date formats and font sizes with instant image export.",
    icon: '📅',
    path: '/photo-name-date-joiner.html',
    filename: 'photo-name-date-joiner.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Compliant White Footer Strip for Candidate Name & Date",
      "Custom Date Formats (DD/MM/YYYY, MM/DD/YYYY, DOP, DOB)",
      "Adjustable Font Family, Font Size & Banner Height",
      "Preset Dimensions for SSC, NEET, UPSC & State PSC Forms",
      "High-Resolution JPG Export Meeting Portal Requirements",
      "Zero Cloud Uploads with Local In-Browser Processing"
    ],
    howTo: [
      { title: "Upload Passport Photograph", desc: "Select or drag your passport-style photo into the exam photo formatting tool." },
      { title: "Enter Candidate Name and Date of Photo", desc: "Type your official name and select the photo capture date (DOP) or date of birth (DOB) as required by notification guidelines." },
      { title: "Preview and Download Form-Ready Photo", desc: "Adjust text size or banner height on the live preview canvas and download your compliant photo instantly." }
    ],
    faq: [
      { question: "Why do exams like SSC, NEET, and police recruitments require name and date on photos?", answer: "Exam commissions mandate printing the candidate’s full name and Date of Photograph (DOP) to verify the photo is recent and prevent impersonation." },
      { question: "Can I customize the date format to match official notification requirements?", answer: "Yes. You can format the date as DD-MM-YYYY, DD/MM/YYYY, or include custom text prefixes such as \"DOP: 15/08/2026\"." },
      { question: "Does the white text bar cut into the candidate’s face or chin?", answer: "You can adjust the banner height, font size, and vertical padding to ensure the text strip sits neatly below the chin area." },
      { question: "Can I adjust the final output image dimensions (e.g. 3.5cm x 4.5cm or 200x230px)?", answer: "Yes. The tool lets you enforce exact pixel dimensions and maximum file size limits required by official upload portals." },
      { question: "Is my personal identity photograph uploaded to a cloud server?", answer: "No. All text compositing and image generation happen locally in your browser memory." }
    ]
  },
  {
    id: 'text-to-handwriting',
    title: "Text to Handwriting Converter — Create Realistic Handwritten Notes",
    navTitle: "Text to Handwriting",
    description: "Convert digital text into realistic handwritten notes on lined or vintage paper online. Choose cursive font styles, ink colors, and export as PDF or PNG.",
    icon: '🖋️',
    path: '/text-to-handwriting.html',
    filename: 'text-to-handwriting.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: [
      "Multiple Realistic Cursive & Print Handwriting Font Styles",
      "Authentic Paper Backgrounds (Ruled Lines, Red Margin, Plain, Vintage)",
      "Custom Ink Colors (Classic Blue Ballpoint, Dark Blue, Black Gel, Red)",
      "Human-Like Ink Jitter, Line Spacing & Word Slant Adjustments",
      "Multi-Page Document Auto-Pagination with Header Margins",
      "Export as High-Resolution Printable PNG Images or Multi-Page PDF"
    ],
    howTo: [
      { title: "Paste or Type Your Text", desc: "Enter your assignments, letters, notes, or study material into the text editor." },
      { title: "Choose Handwriting Font and Paper Style", desc: "Select a cursive or neat handwriting style, pick lined or blank paper, and choose blue or black ink." },
      { title: "Export Handwritten Notes as PDF or PNG", desc: "Review the realistic handwritten pages and download them as high-resolution images or a printable multi-page PDF." }
    ],
    faq: [
      { question: "How realistic do the generated handwritten pages look?", answer: "The tool uses authentic human handwriting fonts combined with subtle baseline variations, letter spacing jitter, and genuine paper textures to mimic real handwriting." },
      { question: "Can I convert long documents spanning multiple pages?", answer: "Yes. The converter automatically calculates page breaks and line wrapping, splitting long text into multiple sequential handwritten pages." },
      { question: "Which paper backgrounds can I write on?", answer: "You can choose from standard blue lined notebook paper with red left margins, plain clean white sheets, yellow legal pads, or textured vintage parchment." },
      { question: "Can I download the generated handwritten assignment as a PDF?", answer: "Yes. You can export your pages as a single multi-page PDF document ready for printing or submission, or download individual PNG image sheets." },
      { question: "Is my typed assignment text stored or sent to an external server?", answer: "No. All typography rendering and PDF document generation occur completely inside your local browser." }
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
    title: "Add Page Numbers to PDF Online — Number PDF Pages Easily",
    navTitle: "Add Page Numbers",
    description: "Insert customizable page numbers into multi-page PDF documents online for free. Select custom placement positions, numbering formats, and skip covers.",
    icon: '🔢',
    path: '/pdf-page-number.html',
    filename: 'pdf-page-number.html',
    category: '📄 PDF Tools',
    badge: 'Free',
    features: [
      "6 Standard Placement Positions (Bottom Center, Bottom Right, Top, etc.)",
      "Multiple Numbering Formats (e.g. \"Page 1 of 10\", \"1 / 10\", \"1\")",
      "Skip Cover Page / First Page Numbering Toggle",
      "Custom Starting Page Number & Margin Offsets",
      "Font Selection, Font Size & Text Color Controls",
      "100% Client-Side Processing with No Server Uploads"
    ],
    howTo: [
      { title: "Upload Multi-Page PDF", desc: "Select the PDF document you want to number from your device." },
      { title: "Choose Number Format and Position", desc: "Select your preferred position (such as bottom-center), choose a format like \"Page X of Y\", and toggle whether to skip the cover." },
      { title: "Apply Numbers and Download PDF", desc: "Click Apply Page Numbers and download your newly numbered PDF document immediately." }
    ],
    faq: [
      { question: "Can I skip adding page numbers to the cover or title page?", answer: "Yes. Check the \"Skip First Page\" option, and numbering will begin cleanly on page two." },
      { question: "Can I format page numbers as \"Page X of Y\" with total page count?", answer: "Yes. You can select between \"1\", \"Page 1\", \"Page 1 of 10\", or \"1 / 10\" formatting styles." },
      { question: "Can I start numbering from a specific number (like starting at page 5)?", answer: "Yes. Enter your custom starting number, and subsequent pages will increment sequentially from that number." },
      { question: "Does numbering modify or cover existing text on my pages?", answer: "Page numbers are stamped in the margin area. You can adjust margin offsets to ensure numbers never overlap document contents." },
      { question: "Are my private documents sent to an external server?", answer: "No. Page numbering is calculated and rendered directly in your browser using pdf-lib." }
    ]
  },
  {
    id: 'pdf-compare',
    title: "PDF Compare Tool — Compare Two PDF Files Side-by-Side Online",
    navTitle: "Compare PDFs",
    description: "Compare two PDF documents side-by-side to highlight text differences, additions, and deletions. View color-coded revision diffs and similarity scores.",
    icon: '⚖️',
    path: '/pdf-compare.html',
    filename: 'pdf-compare.html',
    category: '📄 PDF Tools',
    badge: 'Diff',
    features: [
      "Side-by-Side Visual Diff Highlighting for Revisions & Edits",
      "Color-Coded Additions (Green) and Deletions (Red)",
      "Similarity Percentage Score & Word Change Metrics",
      "Page-by-Page Synchronized Text Comparison",
      "Extracts Text Layers Directly via pdfjs-dist",
      "100% Client-Side Comparison for Confidential Contracts"
    ],
    howTo: [
      { title: "Upload Original and Modified PDF Files", desc: "Select your baseline PDF document in the first slot and your revised version in the second slot." },
      { title: "Run Side-by-Side Comparison", desc: "Click Compare to extract text layers and compute differences between the two documents." },
      { title: "Review Highlighted Changes and Similarity Score", desc: "Inspect color-coded text diffs page by page and review the calculated similarity percentage." }
    ],
    faq: [
      { question: "How does the PDF comparison highlight changes between documents?", answer: "It extracts selectable text from both files and runs a diff algorithm, highlighting inserted text in green and deleted text in red." },
      { question: "Can I compare multi-page legal contracts and agreements?", answer: "Yes. You can navigate through pages sequentially to review clauses that were added, removed, or reworded." },
      { question: "What does the similarity percentage score represent?", answer: "It measures the proportion of unchanged text relative to total words, giving you an instant metric of how closely the two versions match." },
      { question: "Can this tool compare scanned documents that are image-only PDFs?", answer: "The comparison works directly on documents with embedded text layers. Scanned PDFs must have OCR text layers to detect differences." },
      { question: "Are my confidential legal contracts or agreements uploaded to a server?", answer: "No. Text extraction and comparison run entirely inside your browser memory, keeping sensitive legal documents secure." }
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
    title: "Reading Time Calculator — Estimate Reading Duration Online",
    navTitle: "Reading Time",
    description: "Estimate silent reading time and speaking duration for articles, speeches, or scripts online. Calculate total word counts and adjustable reading speeds.",
    icon: '⏱️',
    path: '/reading-time-calculator.html',
    filename: 'reading-time-calculator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: [
      "Calculates Silent Reading Time (Adjustable Words Per Minute)",
      "Estimates Public Speaking & Presentation Duration (130-150 WPM)",
      "Detailed Text Metrics (Word Count, Character Count, Sentences, Paragraphs)",
      "Adjustable Reading Speed Slider (Slow, Average, Fast Reader)",
      "Readability Score and Average Word Length Analytics",
      "Instant Client-Side Text Processing with Zero Data Logging"
    ],
    howTo: [
      { title: "Paste Text or Script", desc: "Paste your blog post, speech, manuscript, or presentation script into the text analyzer." },
      { title: "Adjust Reading Speed", desc: "Use the default 200–250 WPM average reading rate or customize reading/speaking speeds." },
      { title: "Review Duration Metrics", desc: "View estimated reading time in minutes and seconds alongside comprehensive word count analytics." }
    ],
    faq: [
      { question: "What is the average human reading speed used for calculation?", answer: "The standard silent reading speed for adults is between 200 and 250 words per minute (WPM), with 225 WPM commonly used across digital publishing platforms." },
      { question: "How does speaking duration differ from silent reading time?", answer: "People speak much slower than they read silently. Average public speaking, presentations, and podcast speech run at 130 to 150 words per minute." },
      { question: "Can I use this tool to time speeches and video voiceovers?", answer: "Yes. The speaking time estimate is ideal for pacing conference presentations, YouTube scripts, and commercial voiceovers." },
      { question: "Is my written text or unpublished book manuscript uploaded to a server?", answer: "No. All word counting and time calculations execute locally in your browser memory." }
    ]
  },
  {
    id: 'remove-duplicate-lines',
    title: "Remove Duplicate Lines — Deduplicate Text Lists Online Free",
    navTitle: "Remove Duplicates",
    description: "Remove duplicate lines from text lists, emails, keywords, and code online. Configure case sensitivity and trimming options with instant deduplication.",
    icon: '🧹',
    path: '/remove-duplicate-lines.html',
    filename: 'remove-duplicate-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: [
      "Instant One-Click Line Deduplication for Text & Lists",
      "Case-Sensitive vs Case-Insensitive Matching Toggles",
      "Trim Leading and Trailing Whitespace Before Comparison",
      "Preserve Original Line Order or Sort Output Alphabetically",
      "Detailed Statistics Showing Original, Duplicate & Unique Counts",
      "100% In-Browser Execution for Private Email and Keyword Lists"
    ],
    howTo: [
      { title: "Paste Your Text List", desc: "Input lists of emails, URLs, keywords, or code lines into the editor box." },
      { title: "Choose Deduplication Options", desc: "Toggle case sensitivity, whitespace trimming, and whether to remove empty lines." },
      { title: "Copy Cleaned Unique Lines", desc: "Review the duplicate count removed and copy the deduplicated list with one click." }
    ],
    faq: [
      { question: "How does case sensitivity affect duplicate removal?", answer: "With case sensitivity enabled, \"Apple\" and \"apple\" are treated as distinct lines. In case-insensitive mode, they are identified as duplicates and merged." },
      { question: "Can I deduplicate massive email or keyword lists safely?", answer: "Yes. The tool runs in client-side JavaScript, meaning lists with thousands of entries are deduplicated in milliseconds without server limits." },
      { question: "Does the tool preserve the original order of my list?", answer: "Yes. By default it keeps the first occurrence of each unique line in its original order, with an optional toggle to sort alphabetically." },
      { question: "Are my proprietary email lists or keywords uploaded to Zubware servers?", answer: "No. Deduplication executes entirely in your local browser runtime with zero network data transfer." }
    ]
  },
  {
    id: 'remove-empty-lines',
    title: "Remove Empty Lines — Strip Blank Lines & Whitespace Online",
    navTitle: "Remove Empty Lines",
    description: "Remove empty lines, blank spaces, and unnecessary paragraph breaks from text online. Clean up messy text formatting with one-click clipboard copying.",
    icon: '🗑️',
    path: '/remove-empty-lines.html',
    filename: 'remove-empty-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: [
      "Strips All Blank & Empty Lines with a Single Click",
      "Normalize Mode: Compresses Multiple Blank Lines into Single Breaks",
      "Trims Leading & Trailing Whitespace Across All Lines",
      "Handles Windows (CRLF), Unix (LF) & Mac Line Endings",
      "Live Metrics for Lines Removed and Resulting Line Count",
      "Instant In-Browser Text Cleaning with Zero Cloud Logging"
    ],
    howTo: [
      { title: "Paste Text with Blank Lines", desc: "Paste code, copied documents, or articles containing excessive empty lines." },
      { title: "Select Cleaning Rule", desc: "Choose to strip all empty lines completely or compress multiple blank lines into a single neat paragraph break." },
      { title: "Copy Cleaned Text", desc: "Click Copy to take your condensed, cleanly formatted text to your document or code editor." }
    ],
    faq: [
      { question: "What constitutes an \"empty line\" in this tool?", answer: "An empty line is any line with zero characters or lines containing only whitespace (spaces, tabs, carriage returns) with no visible text." },
      { question: "Can I keep single paragraph breaks while removing triple or quadruple blank lines?", answer: "Yes. Select the \"Compress Multiple Blank Lines\" option to normalize double or triple line breaks into clean single paragraph spacing." },
      { question: "Can this tool fix messy text copied from PDFs or OCR scanners?", answer: "Yes. It quickly removes the random empty lines and broken paragraphs frequently introduced when copying from PDF files." },
      { question: "Is my text stored anywhere online during cleaning?", answer: "No. All string manipulation takes place locally inside your browser memory." }
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
    title: "Text Cleaner — Remove Extra Spaces, Tabs & HTML Tags Online",
    navTitle: "Text Cleaner",
    description: "Clean up messy text by stripping redundant spaces, tabs, HTML tags, and line breaks online. Normalize whitespace and formatting with instant preview.",
    icon: '🧼',
    path: '/text-cleaner.html',
    filename: 'text-cleaner.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Popular',
    features: [
      "Removes Consecutive Multiple Spaces and Replaces with Single Space",
      "Converts Tabs to Spaces & Trims Leading/Trailing Line Whitespace",
      "Strips HTML, XML & Web Markup Tags from Pasted Content",
      "Normalizes Curly Quotes, Smart Apostrophes & Dashes",
      "Removes Empty Blank Lines and Normalizes Paragraph Spacing",
      "Before & After Character, Word, and Line Reduction Metrics"
    ],
    howTo: [
      { title: "Paste Unformatted or Scraped Text", desc: "Paste text containing HTML tags, irregular spacing, tabs, or strange quotes." },
      { title: "Select Cleaning Rules", desc: "Toggle which cleanup operations to apply (strip HTML, remove extra spaces, trim whitespace)." },
      { title: "Copy Cleaned Text", desc: "Review the character savings and copy your pristine, uniformly formatted text." }
    ],
    faq: [
      { question: "What types of formatting noise can this text cleaner remove?", answer: "It removes multiple spaces, converts tab indents, strips HTML/XML tags, removes empty lines, and normalizes smart quotes and em-dashes into standard characters." },
      { question: "Can I strip HTML tags from web pages while keeping the actual text content?", answer: "Yes. The \"Strip HTML Tags\" option strips all markup elements (like `<div>`, `<p>`, `<a>`) while preserving readable text." },
      { question: "Does this tool fix smart curly quotes for coding?", answer: "Yes. It converts curly quotes (“ ” ‘ ’) into straight ASCII quotation marks (' and \") that won’t trigger syntax errors in code or JSON." },
      { question: "Are my private documents sent to an external server?", answer: "No. All string cleansing algorithms run strictly in your browser runtime via client-side regex." }
    ]
  },
  {
    id: 'sort-lines',
    title: "Sort Lines Online — Alphabetical & Numeric Line Sorter Free",
    navTitle: "Sort Lines",
    description: "Sort lines of text alphabetically, numerically, by length, or in reverse order online. Organize keyword lists and CSV files with instant text sorting.",
    icon: '🔃',
    path: '/sort-lines.html',
    filename: 'sort-lines.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: [
      "Alphabetical Sorting (A to Z) & Reverse Alphabetical (Z to A)",
      "Natural Numeric Sorting (Orders 1, 2, 10 Correctly)",
      "Sort by Line Length (Shortest to Longest / Longest to Shortest)",
      "Random Shuffle Mode to Randomize List Order",
      "Case Sensitive / Insensitive Sorting Toggles",
      "Optional Integrated Duplicate Removal While Sorting"
    ],
    howTo: [
      { title: "Paste Text Lines", desc: "Enter a list of items, names, keywords, or data records." },
      { title: "Choose Sort Method", desc: "Select alphabetical, reverse, numeric, length-based, or random shuffle order." },
      { title: "Copy Sorted Output", desc: "Review the newly organized list and copy the sorted lines directly to your clipboard." }
    ],
    faq: [
      { question: "What is natural numeric sorting versus standard alphabetical sorting?", answer: "Standard alphabetical sorting puts \"10\" before \"2\" because \"1\" precedes \"2\". Natural numeric sorting recognizes numerical values, correctly ordering 1, 2, 3... 10." },
      { question: "Can I randomly shuffle lines to randomize a list?", answer: "Yes. Select Random Shuffle to reorder list items into an unpredictable random sequence using the Fisher-Yates algorithm." },
      { question: "Can I sort lines by character length?", answer: "Yes. You can sort lines from shortest to longest or longest to shortest, which is useful for domain names and SEO keyword grouping." },
      { question: "Are large text files supported?", answer: "Yes. Lists with thousands of lines sort in milliseconds within your browser memory." }
    ]
  },
  {
    id: 'lorem-ipsum-generator',
    title: "Lorem Ipsum Generator — Dummy Placeholder Text Online Free",
    navTitle: "Lorem Ipsum",
    description: "Generate custom Latin placeholder dummy text by paragraphs, sentences, or word counts online. Copy formatted mock text for design and layout mockups.",
    icon: '📜',
    path: '/lorem-ipsum-generator.html',
    filename: 'lorem-ipsum-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Free',
    features: [
      "Generate by Exact Paragraphs, Sentences, or Word Counts",
      "Classic \"Lorem ipsum dolor sit amet...\" Opening Toggle",
      "Optional HTML Formatting (Wraps Output in <p> Tags)",
      "Generates Natural Latin Vocabulary Distribution",
      "One-Click Clipboard Copying for Web Designers and Developers",
      "Instant Client-Side Generation with Zero Network Delays"
    ],
    howTo: [
      { title: "Select Unit and Quantity", desc: "Choose whether you need paragraphs, sentences, or a specific number of words (e.g. 5 paragraphs)." },
      { title: "Configure Options", desc: "Toggle whether to start with the classic \"Lorem ipsum\" opening or wrap in HTML markup tags." },
      { title: "Copy Placeholder Text", desc: "Click Copy to paste dummy filler text into your Figma, Webflow, or code mockup layouts." }
    ],
    faq: [
      { question: "What is Lorem Ipsum and why is it used in graphic design?", answer: "Lorem Ipsum is standard placeholder dummy text derived from Cicero’s 45 BC Latin treatise. Designers use it because its natural letter distribution prevents viewers from getting distracted by readable content." },
      { question: "Can I generate exact word counts for character-constrained layouts?", answer: "Yes. Switch to Word mode and specify the exact number of words needed for your button, card, or banner design." },
      { question: "Can it output HTML paragraph tags (<p>)?", answer: "Yes. Enabling the HTML tags option automatically wraps each paragraph in `<p>` and `</p>` tags for immediate pasting into code." },
      { question: "Is this dummy text generator free with unlimited use?", answer: "Yes. It generates unlimited filler text instantly in your browser with no sign-ups or limits." }
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
    description: 'Minify and compress JSON documents online to reduce payload size. Strips whitespace, tabs, and line breaks while preserving string literals. Fast and free.',
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
    description: 'Transform JSON data structures into clean, standardized XML documents with custom root tags and attribute mappings. Fast client-side conversion in browser.',
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
    description: 'Parse and convert XML documents, RSS feeds, and SOAP payloads into clean JSON objects directly in your browser. Preserves attributes and hierarchy accurately.',
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
    description: 'Convert Markdown syntax (.md) into clean, semantic HTML markup with live preview and syntax-highlighted code output. Supports GFM tables and code blocks.',
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
    description: 'Format, beautify, and indent SQL queries online with uppercase keywords and custom indentation. Supports MySQL, PostgreSQL, SQLite, MariaDB, and SQL Server.',
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
    description: 'Create and cryptographically sign JSON Web Tokens (JWT) using HS256, HS384, or HS512 with custom claims, headers, and expiry. Fast client-side HMAC signing.',
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
    description: 'Build, translate, and explain 5-part Unix cron schedule expressions into plain English with next execution time predictions. Visual online schedule builder.',
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
    title: "Business Name Generator — Catchy Startup & Brand Name Ideas",
    navTitle: "Business Names",
    description: "Generate hundreds of catchy, modern company name ideas for your startup or online store. Filter by industry niche and check domain name availability.",
    icon: '💡',
    path: '/business-name-generator.html',
    filename: 'business-name-generator.html',
    category: '💼 Business Tools',
    badge: 'Popular',
    features: [
      "Hundreds of Categorized Startup & E-Commerce Name Ideas",
      "Industry Filters (Tech, Retail, Agency, Consulting, Food, Health)",
      "Naming Style Modes (Modern Blend, Invented, Minimalist, Classic)",
      "Character Length Filters & Keyword Insertion Support",
      "One-Click Domain Availability Check Shortcut Links",
      "Save & Export Favorite Brand Names to Clipboard or Text"
    ],
    howTo: [
      { title: "Enter Keywords and Choose Industry", desc: "Input core keywords describing your business concept and select your commercial sector." },
      { title: "Browse and Filter Generated Names", desc: "Filter suggestions by naming style (compound, invented, modern) and adjust character count preferences." },
      { title: "Save Favorites and Check Domains", desc: "Bookmark top name candidates, copy your shortlist, and check domain name availability with one click." }
    ],
    faq: [
      { question: "How does the generator create relevant business names?", answer: "It combines linguistic morphemes, industry power words, modern prefixes, and phonetic word blends tailored to your seed keywords." },
      { question: "Can I filter business names by specific industries?", answer: "Yes. You can filter by technology, SaaS, e-commerce, consulting, creative agencies, fashion, food and dining, and wellness." },
      { question: "Can I check if the corresponding .com domain name is available?", answer: "Yes. Clicking the domain lookup shortcut next to any generated name checks registration status instantly on popular registrars." },
      { question: "Can I save a shortlist of my favorite name ideas?", answer: "Yes. Click the star or heart icon next to any name to save it to your session shortlist, which you can copy or export anytime." },
      { question: "Is this business name generator free to use without an account?", answer: "Yes. It is completely free with no signup, credit card, or usage restrictions." }
    ]
  },
  {
    id: 'brand-name-generator',
    title: "Brand Name Generator — Creative Company & Product Brand Names",
    navTitle: "Brand Name Generator",
    description: "Generate premium brand names, product titles, and company brand identities online for free. Explore invented, compound, and modern name styles instantly.",
    icon: '✨',
    path: '/brand-name-generator.html',
    filename: 'brand-name-generator.html',
    category: '💼 Business Tools',
    badge: 'Creative',
    features: [
      "Sophisticated Linguistic Morpheme & Phonetic Name Synthesis",
      "Brand Tone Profiles (Luxurious, Modern Tech, Playful, Bold, Organic)",
      "Syllable Count & Prefix/Suffix Customization Options",
      "Keyword Seed Insertion with Creative Morphing",
      "Session Favorites List with One-Click Clipboard Copying",
      "Fast In-Browser Algorithmic Generation with Zero Delay"
    ],
    howTo: [
      { title: "Enter Brand Keywords", desc: "Provide one or two words that reflect your core product, service, or brand values." },
      { title: "Select Brand Personality and Tone", desc: "Pick your preferred tone—such as sleek modern tech, timeless luxury, organic wellness, or energetic bold." },
      { title: "Curate and Export Your Brand Shortlist", desc: "Review high-scoring brand names, save favorites to your shortlist, and verify trademark and domain viability." }
    ],
    faq: [
      { question: "What is the difference between a business name and a brand name?", answer: "A business name is often descriptive of corporate operations, whereas a brand name focuses on emotional appeal, phonetics, and memorable product identity." },
      { question: "Can I generate invented words similar to Spotify or Hulu?", answer: "Yes. Select the \"Invented / Abstract\" style to generate catchy, pronounceable neologisms with strong phonetic rhythm." },
      { question: "Can I control syllable counts for punchy, short names?", answer: "Yes. Use syllable and character length filters to narrow suggestions down to punchy 1-2 syllable brand candidates." },
      { question: "Are the generated brand names safe to trademark?", answer: "While names are generated algorithmically, you should always check national trademark databases (like USPTO) before launching commercial products." },
      { question: "Does the tool require an account or subscription?", answer: "No. The brand name generator is 100% free with unlimited generation rounds and zero sign-in required." }
    ]
  },
  {
    id: 'coin-flip',
    title: "Online Coin Flip Simulator — 3D Heads or Tails Toss Online",
    navTitle: "Coin Flip",
    description: "Flip a virtual coin in 3D with realistic physics and sound effects online. Track heads and tails streaks or flip multiple coins for fair decisions.",
    icon: '🪙',
    path: '/coin-flip.html',
    filename: 'coin-flip.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Utility',
    features: [
      "Realistic 3D Animated Coin Toss with Dynamic Lighting",
      "Single and Multi-Coin Modes (Flip 1, 2, 3, 5, or 10 Coins)",
      "Live Statistical Tracker for Total Flips, Heads, Tails & Streaks",
      "Realistic Audio Coin Clink Sound Effects via Web Audio API",
      "Cryptographically Unbiased Random Number Generation",
      "Instant Flip Animation or Immediate Instant-Result Mode"
    ],
    howTo: [
      { title: "Choose Coin Count", desc: "Select whether to flip a single coin or multiple coins at once." },
      { title: "Click Flip Coin", desc: "Click the flip button or tap the coin to trigger the 3D spinning animation." },
      { title: "Review Outcome and Probability Stats", desc: "Observe the Heads or Tails result and monitor your cumulative flip streak and probability percentages." }
    ],
    faq: [
      { question: "Is this coin flip truly fair and 50/50 unbiased?", answer: "Yes. The coin flip simulator uses modern pseudo-random algorithms providing an exact 50% statistical probability for heads and tails over large sample sizes." },
      { question: "Can I flip multiple coins at the same time?", answer: "Yes. You can flip up to 10 coins simultaneously to simulate probability experiments or quickly break ties among group members." },
      { question: "Can I mute the coin flip sound effects?", answer: "Yes. An audio toggle allows you to turn the synthesized coin sound effects on or off at any time." },
      { question: "Does the tool track my flipping history across the session?", answer: "Yes. It maintains a running counter of total flips, heads count, tails count, win percentages, and consecutive streaks." }
    ]
  },
  {
    id: 'json-viewer',
    title: 'JSON Viewer & Tree Formatter — Interactive Object Inspector',
    navTitle: 'JSON Viewer',
    description: 'Inspect, validate, and navigate complex JSON data structures with collapsible tree views, search filters, and syntax highlighting. 100% private in-browser.',
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
    title: "Name Picker Wheel — Random Raffle & Prize Spinner Online",
    navTitle: "Picker Wheel",
    description: "Spin the customizable lucky wheel to pick a random name, winner, or raffle choice online. Enjoy smooth spin animations, sound, and winner celebration.",
    icon: '🎡',
    path: '/name-picker-wheel.html',
    filename: 'name-picker-wheel.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Interactive',
    features: [
      "Customizable Wheel Slices with Vibrant Colors and Labels",
      "Bulk Name Input with Comma or Newline List Pasting",
      "Smooth Wheel Deceleration Physics & Ticking Sound Effects",
      "Winner Confetti Celebration Animation & Highlight Modal",
      "Optional \"Remove Winner on Draw\" Mode for Multi-Round Raffles",
      "100% In-Browser Execution with No Registration Required"
    ],
    howTo: [
      { title: "Add Names or Choices", desc: "Enter names, raffle tickets, team members, or options in the editable slice list." },
      { title: "Click to Spin the Wheel", desc: "Click Spin to initiate the spinning animation and listen to the ticking indicator." },
      { title: "Celebrate and Select Next Winner", desc: "View the winning selection in the celebration pop-up, with the option to remove the winner before spinning again." }
    ],
    faq: [
      { question: "How does the name picker wheel select a winner fairly?", answer: "When you click Spin, the tool generates a random rotational angle with physics-based deceleration. Every slice has an equal chance proportional to its size." },
      { question: "Can I paste a long list of students or raffle entries at once?", answer: "Yes. You can paste lines of names directly into the input area to populate dozens of wheel segments instantly." },
      { question: "Can I eliminate winners after each round so they cannot win twice?", answer: "Yes. Enable the \"Remove Winner\" setting, and the selected person will be taken off the wheel for subsequent spins." },
      { question: "Is there a limit on how many names I can put on the wheel?", answer: "You can comfortably add dozens of names; the wheel dynamically adjusts slice angles and label typography." }
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
    title: "3D Dice Roller Simulator — Roll Virtual D6, D20 & RPG Dice Online",
    navTitle: "Dice Roller",
    description: "Roll virtual polyhedral 3D dice for D&D, tabletop RPGs, and board games online. Roll D4, D6, D8, D10, D12, D20, and D100 dice with total score logs.",
    icon: '🎲',
    path: '/dice-roller.html',
    filename: 'dice-roller.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Fun',
    features: [
      "Full Polyhedral RPG Dice Set (D4, D6, D8, D10, D12, D20, D100)",
      "Roll Multiple Dice Simultaneously with Modifier Bonuses (+/-)",
      "Detailed Roll History Log Showing Individual Face Values & Totals",
      "Realistic 3D Tumbling Physics and Rolling Audio Effects",
      "One-Click Quick Roll Buttons for Common D&D Checks",
      "Fair, Cryptographically Random Outcomes in Your Browser"
    ],
    howTo: [
      { title: "Choose Dice Type and Quantity", desc: "Click on D4, D6, D8, D10, D12, D20, or D100 and select how many dice you want to throw." },
      { title: "Add Modifiers (Optional)", desc: "Add bonus points or penalties (+/-) to match your character stats or game rules." },
      { title: "Roll and Inspect Results", desc: "Click Roll to trigger the roll animation and view the sum total alongside individual dice face results." }
    ],
    faq: [
      { question: "Can I roll multiple dice of different types together?", answer: "Yes. You can configure multi-dice combinations like 2d6 + 1d20 with custom modifiers for complex roleplaying checks." },
      { question: "What dice are included for Dungeons & Dragons (D&D)?", answer: "The simulator includes the complete standard seven-dice set: D4, D6, D8, D10, D12, D20, and percentile D100." },
      { question: "Are the virtual dice rolls truly random?", answer: "Yes. Roll outcomes are computed using cryptographically sound random values, ensuring completely unbiased numbers." },
      { question: "Does the tool keep track of my roll history?", answer: "Yes. A scrolling session log records each roll, showing timestamps, dice rolled, modifiers applied, and final totals." }
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
    title: "Wavelength Calculator — Light & Wave Frequency Online",
    navTitle: "Wavelength Calc",
    description: "Calculate electromagnetic wavelength, wave frequency, and photon energy online. Explore presets for radio, microwave, visible light, and X-ray bands.",
    icon: '〰️',
    path: '/wavelength-calculator.html',
    filename: 'wavelength-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Science',
    features: [
      "Calculates Wavelength (λ), Frequency (f) & Wave Speed (v = c)",
      "Computes Photon Energy (E = hf) in Joules (J) and Electron-Volts (eV)",
      "Electromagnetic Spectrum Presets (Radio, Microwave, Infrared, Visible, UV, X-Ray)",
      "Unit Conversion Across Nanometers, Micrometers, Meters, Hz, MHz, GHz & THz",
      "Color Swatch Display for Frequencies in the Visible Light Spectrum",
      "Precision Scientific Notation and Floating-Point Math"
    ],
    howTo: [
      { title: "Enter Wavelength or Frequency", desc: "Input a known wave value and choose its measurement unit (e.g. 500 nm or 100 MHz)." },
      { title: "Select Medium or Wave Speed", desc: "Use the speed of light in vacuum (c) or enter a custom wave propagation velocity." },
      { title: "Review Spectrum Band and Energy", desc: "Inspect the calculated wavelength, frequency, photon energy (eV), and corresponding spectrum classification." }
    ],
    faq: [
      { question: "What is the formula used to calculate wavelength from frequency?", answer: "The wavelength formula is λ = v / f, where λ is wavelength in meters, v is wave velocity (the speed of light c ≈ 3×10^8 m/s in vacuum), and f is wave frequency in Hertz (Hz)." },
      { question: "How is photon energy calculated from wavelength or frequency?", answer: "Photon energy is determined by Planck’s equation E = h × f = (h × c) / λ, where h is Planck’s constant (6.626×10^-34 J·s), expressed in Joules or electron-volts (eV)." },
      { question: "Does the calculator show visible light colors?", answer: "Yes. When entering wavelengths between approximately 380 nm and 750 nm, the calculator displays the corresponding visible spectrum color (violet to red)." },
      { question: "Can I calculate acoustic or sound wave wavelengths?", answer: "Yes. You can enter the speed of sound in air (approximately 343 m/s) as the custom velocity to calculate audio sound wavelengths." }
    ]
  },
  {
    id: 'user-agent-parser',
    title: 'User Agent Parser — Browser, Device & OS Header Lookup',
    navTitle: 'UA Parser',
    description: 'Parse browser User-Agent strings to detect browser family, layout engine, operating system version, and mobile device hardware model. Fast, free online tool.',
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
    title: "Mode Calculator — Find Statistical Dataset Mode Online",
    navTitle: "Mode Calculator",
    description: "Find the statistical mode and frequency counts for any raw numerical or categorical dataset online. Identify unimodal, bimodal, and multimodal values.",
    icon: '📊',
    path: '/mode-calculator.html',
    filename: 'mode-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Math',
    features: [
      "Calculates Statistical Mode for Numeric & Categorical Data",
      "Detects Unimodal, Bimodal, Multimodal & No-Mode Datasets",
      "Full Frequency Distribution Table with Counts & Percentages",
      "Parses Comma, Space, or Newline-Delimited Value Lists",
      "Summary Metrics for Dataset Size, Unique Items & High Frequency",
      "Instant Calculations with One-Click Clipboard Copying"
    ],
    howTo: [
      { title: "Enter or Paste Dataset", desc: "Input numbers or text categories separated by commas, spaces, or line breaks." },
      { title: "Analyze Distribution", desc: "The tool counts occurrences and identifies the value or values that appear most frequently." },
      { title: "Review Mode and Frequency Table", desc: "Inspect the identified mode value(s) alongside the complete sorted frequency distribution table." }
    ],
    faq: [
      { question: "What is the statistical mode of a dataset?", answer: "The mode is the value that appears with the highest frequency in a data set. A dataset can have one mode (unimodal), two modes (bimodal), multiple modes (multimodal), or no mode if all values appear equally." },
      { question: "What happens if every number in my dataset appears only once?", answer: "When all items have the same frequency of occurrence (such as appearing once each), the dataset has no mode, and the calculator clearly reports \"No Mode\"." },
      { question: "Can this mode calculator handle text or categorical lists?", answer: "Yes. In addition to numbers, you can paste lists of survey responses, colors, or names to find the most frequent categorical answer." },
      { question: "Does the tool show a full frequency distribution table?", answer: "Yes. It displays every unique item sorted by frequency count, showing exact counts and percentage shares." }
    ]
  },
  {
    id: 'inductance-calculator',
    title: "Inductance Calculator — Coil Turns & Solenoid Formula Online",
    navTitle: "Inductance Calc",
    description: "Calculate electrical inductance in Henrys, mH, or µH for single-layer air-core coils and solenoids online using Wheeler formulas and coil dimensions.",
    icon: '🧲',
    path: '/inductance-calculator.html',
    filename: 'inductance-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Electronics',
    features: [
      "Calculates Inductance for Single-Layer Air-Core Cylindrical Coils",
      "Uses Wheeler’s Standard Empirical Solenoid Equation",
      "Calculates Number of Turns Needed for Target Inductance",
      "Computes Total Wire Length and Aspect Ratio Diagnostics",
      "Supports Metric (mm, cm) and Imperial (Inches, Mils) Dimensions",
      "Ideal for RF Electronics, Antenna Chokes & Inductor Prototyping"
    ],
    howTo: [
      { title: "Enter Coil Dimensions", desc: "Input coil diameter, coil length, and number of wire turns." },
      { title: "Select Units of Measurement", desc: "Choose millimeters, centimeters, or inches for coil dimensions." },
      { title: "Calculate Inductance & Wire Length", desc: "Review the calculated inductance in microhenrys (µH), millihenrys (mH), and total required wire length." }
    ],
    faq: [
      { question: "Which formula is used for calculating air-core coil inductance?", answer: "The calculator uses Wheeler’s approximation formula: L (µH) = (d² × n²) / (18d + 40l), where d is coil diameter in inches, l is coil length in inches, and n is total turns." },
      { question: "Can I calculate the number of turns required to achieve a target inductance?", answer: "Yes. You can enter your desired target inductance, coil diameter, and length to solve for the required turn count." },
      { question: "Does this calculator apply to coils with ferrite or iron cores?", answer: "This specific tool calculates air-core coils (relative magnetic permeability μr ≈ 1). Coils with ferromagnetic cores require multiplying by the core material’s permeability." },
      { question: "Why is coil wire length calculated?", answer: "Knowing the total wire length helps electronics hobbyists and RF designers cut the correct length of magnet wire before winding." }
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
    description: 'Convert JSON objects into clean, indented YAML data structures for Kubernetes manifests, Docker Compose, and CI/CD pipelines. Fast client-side tool in browser.',
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
    title: "Bond Yield Calculator — Current Yield, YTM & Bond Valuation Tool",
    navTitle: "Bond Yield",
    description: "Calculate bond current yield, Yield to Maturity (YTM), and coupon payments for corporate or government bonds. Analyze bond valuation with precision math.",
    icon: '📈',
    path: '/bond-yield-calculator.html',
    filename: 'bond-yield-calculator.html',
    category: '💼 Business Tools',
    badge: 'Investing',
    features: [
      "Accurate Yield to Maturity (YTM) Newton-Raphson Calculation",
      "Current Yield & Nominal Coupon Yield Percentage Metrics",
      "Annual & Semi-Annual Coupon Payment Frequency Modes",
      "Par Value, Market Price & Capital Gain/Loss Valuation",
      "Detailed Cash Flow & Total Return Investment Summary",
      "Instant In-Browser Calculations with Zero Data Tracking"
    ],
    howTo: [
      { title: "Enter Bond Face Value and Market Price", desc: "Input the bond par value (typically $1,000) and the current market purchase price." },
      { title: "Input Coupon Rate, Frequency and Maturity", desc: "Provide the annual coupon interest rate percentage, payment schedule (annual/semi-annual), and years remaining to maturity." },
      { title: "Analyze Yield Metrics and Cash Flows", desc: "Review the calculated Yield to Maturity (YTM), Current Yield, total interest received, and capital gain or discount at par." }
    ],
    faq: [
      { question: "What is the difference between Current Yield and Yield to Maturity (YTM)?", answer: "Current Yield measures annual coupon interest divided by market price, whereas YTM calculates the total annualized rate of return including all future coupons and par capital gain or loss." },
      { question: "Does this calculator support semi-annual coupon bonds?", answer: "Yes. Most US Treasury and corporate bonds pay coupons semi-annually. Selecting semi-annual compounds the periods and divides coupon rates accurately." },
      { question: "How is a bond trading at a discount or premium treated?", answer: "If price is below par (discount), YTM exceeds the coupon rate because you gain capital at maturity; if above par (premium), YTM is lower than the coupon rate." },
      { question: "Can I calculate bond yields for zero-coupon bonds?", answer: "Yes. Setting the coupon rate to 0% calculates the exact compounded annual return between purchase price and face value at maturity." },
      { question: "Is my financial portfolio data stored or sent to a server?", answer: "No. All financial calculations run in your local browser runtime and are never logged or stored." }
    ]
  },
  {
    id: 'cat-age-calculator',
    title: "Cat Age Calculator — Convert Cat Years to Human Age Online",
    navTitle: "Cat Age Calc",
    description: "Convert your cat or kitten age into human equivalent years based on veterinary life stages. Check health milestones and indoor life expectancy tips.",
    icon: '🐱',
    path: '/cat-age-calculator.html',
    filename: 'cat-age-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Pets',
    features: [
      "Veterinary Life Stage Mapping (Kitten, Junior, Prime, Mature, Senior, Geriatric)",
      "Accurate Dual-Stage Age Curve (1st year = 15 years, 2nd year = 24 years)",
      "Inputs for Cat Age in Both Years and Fractional Months",
      "Veterinary Health Milestone Checklist for Each Life Stage",
      "Indoor vs Outdoor Lifestyle Impact Guidelines",
      "Instant In-Browser Calculation with Pet Care Advice"
    ],
    howTo: [
      { title: "Enter Cat Age in Years and Months", desc: "Use the steppers or input fields to specify your feline companion’s current age." },
      { title: "Review Human Equivalent Age", desc: "See your cat’s equivalent human age calculated using veterinary stage curves." },
      { title: "Read Life Stage Care Recommendations", desc: "Explore specific nutritional, health screening, and dental milestones recommended for your cat’s age group." }
    ],
    faq: [
      { question: "Why is a cat’s age not simply calculated by multiplying by 7?", answer: "Cats mature much faster in their first two years. A 1-year-old cat is roughly equivalent to a 15-year-old human, and a 2-year-old cat is comparable to a 24-year-old human. Each subsequent year adds approximately 4 human years." },
      { question: "What are the main veterinary life stages for domestic cats?", answer: "The American Association of Feline Practitioners (AAFP) defines six stages: Kitten (0-6 months), Junior (7 months - 2 years), Prime (3-6 years), Mature (7-10 years), Senior (11-14 years), and Geriatric (15+ years)." },
      { question: "Does being an indoor cat increase life expectancy?", answer: "Yes. Indoor cats typically live 12 to 18 years on average, compared to outdoor cats who face higher risks from traffic, predators, and infectious diseases." },
      { question: "When is a cat considered a senior citizen?", answer: "Veterinarians generally consider cats to enter their senior years around age 11 (equivalent to approximately 60 human years)." }
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
    id: 'college-gpa-calculator',
    title: 'College GPA Calculator – 4.0 Scale Weighted & Semester GPA',
    navTitle: 'College GPA Calculator',
    description: 'Calculate college semester and cumulative Grade Point Average on a standard 4.0 scale with credit-weighted quality points, letter grades (A+ to F), and graduation honors.',
    icon: '🎓',
    path: '/college-gpa-calculator.html',
    filename: 'college-gpa-calculator.html',
    category: '💼 Career Tools',
    badge: 'Academic',
    features: ['4.0 Letter Grade Scale (A+ to F)', 'Credit-Weighted Quality Points', 'Semester & Cumulative GPA', 'Target GPA Honors Planner', 'Interactive Course Rows'],
    howTo: [
      { title: "Add Course Names & Credits", desc: "Enter course names and select credit hours (1 to 6 credits) for each class in your semester schedule." },
      { title: "Select Letter Grades", desc: "Choose your letter grades (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F) to calculate course quality points." },
      { title: "Review Quality Points & Honors", desc: "Inspect your calculated semester GPA, total quality points, cumulative blended GPA, and Latin graduation honors (Summa/Magna Cum Laude)." }
    ],
    faq: [
      { question: "How do credit hours affect my college semester GPA?", answer: "Courses with higher credit hours carry more weight. Quality Points equal Credit Hours multiplied by Grade Point value. Total quality points are divided by total attempted credit hours." },
      { question: "What is the difference between College GPA Calculator and CGPA Calculator?", answer: "The College GPA Calculator computes credit-weighted course grades on a 4.0 letter scale (A+ to F), while the CGPA Calculator converts a 10.0 scale university cumulative score into a percentage using standard multipliers (like 9.5x)." },
      { question: "What GPA qualifies for graduation honors (Cum Laude)?", answer: "Standard Latin honors benchmarks are: Cum Laude (Honors): 3.50–3.69 GPA; Magna Cum Laude (High Honors): 3.70–3.89 GPA; and Summa Cum Laude (Highest Honors): 3.90–4.00 GPA." },
      { question: "How is cumulative GPA calculated across multiple semesters?", answer: "Cumulative GPA is calculated by dividing total quality points earned across all semesters by total credit hours completed across your degree." },
      { question: "Are my student grades saved or transmitted to a server?", answer: "No. All GPA calculations execute 100% locally in your browser with zero server transmission and complete student privacy." }
    ]
  },
  {
    id: 'mileage-calculator',
    title: "Car Gas Mileage Calculator — MPG, Fuel Economy & Trip Gas Cost",
    navTitle: "Mileage Calculator",
    description: "Calculate vehicle fuel economy in MPG or L/100km and estimate road trip gasoline costs online. Compare mileage efficiency with US and metric units.",
    icon: '⛽',
    path: '/mileage-calculator.html',
    filename: 'mileage-calculator.html',
    category: '💼 Business Tools',
    badge: 'Auto',
    features: [
      "Miles Per Gallon (MPG) & Liters Per 100km (L/100km) Calculations",
      "Kilometers Per Liter (km/L) Metric Support",
      "Road Trip Gas Cost Estimator Based on Fuel Price & Distance",
      "Cost Per Mile and Cost Per Kilometer Travel Breakdown",
      "Dual US Imperial (Gallons/Miles) and Metric (Liters/Km) Systems",
      "Instant Mathematical Results with Complete User Privacy"
    ],
    howTo: [
      { title: "Choose Calculation Mode and Unit System", desc: "Select whether you want to calculate fuel economy from a fill-up or estimate the total fuel cost for an upcoming trip." },
      { title: "Enter Distance Traveled and Fuel Consumed", desc: "Input odometer miles or kilometers along with the gallons or liters of fuel required to refill your gas tank." },
      { title: "Review Fuel Economy and Cost Per Mile", desc: "View your vehicle’s exact MPG, L/100km rating, cost per mile, and total estimated travel expense." }
    ],
    faq: [
      { question: "How do I accurately calculate my car’s real-world gas mileage?", answer: "Fill your tank completely and record your odometer reading. Drive normally until your next fill-up, note the gallons added, and divide total miles driven by gallons used." },
      { question: "Can I convert between US MPG, UK Imperial MPG, and Liters/100km?", answer: "Yes. The calculator supports both US Imperial and Metric systems, allowing seamless comparison between MPG and L/100km." },
      { question: "Can this tool calculate how much gas will cost for a long road trip?", answer: "Yes. Enter your trip distance, average MPG, and local price per gallon to calculate total fuel gallons required and total road trip gas cost." },
      { question: "Why does my car’s calculated MPG differ from the dashboard display?", answer: "In-dash computers often estimate fuel use via throttle sensors, whereas pump-to-pump calculations reflect exact physical fuel volume burned." },
      { question: "Is any of my vehicle or travel data stored online?", answer: "No. The calculator runs completely in client-side JavaScript with zero tracking or data retention." }
    ]
  },
  {
    id: 'paint-cost-calculator',
    title: "Paint Cost Calculator — Room Wall Area & Gallons Needed Online",
    navTitle: "Paint Cost Calc",
    description: "Calculate how many gallons or liters of paint you need for interior rooms online. Estimate wall surface area, subtract windows, and compute costs.",
    icon: '🖌️',
    path: '/paint-cost-calculator.html',
    filename: 'paint-cost-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Home',
    features: [
      "Calculates Total Wall Surface Area in Square Feet or Square Meters",
      "Automatic Deductions for Standard Doors and Windows",
      "Multi-Coat Support (1, 2, or 3 Coats of Paint)",
      "Computes Paint Volume Needed in Gallons and Liters",
      "Material Cost Estimator Based on Price Per Gallon/Can",
      "100% Client-Side In-Browser Renovation Estimator"
    ],
    howTo: [
      { title: "Enter Room Dimensions", desc: "Input room length, width, and ceiling height in feet or meters." },
      { title: "Set Openings and Number of Coats", desc: "Specify how many doors and windows are in the room, and choose whether you plan to apply 1, 2, or 3 coats." },
      { title: "Review Paint Volume and Budget", desc: "Enter paint can price to view the required number of gallons/cans and total estimated project cost." }
    ],
    faq: [
      { question: "How many square feet does one gallon of paint typically cover?", answer: "A standard gallon of interior wall paint typically covers approximately 350 to 400 square feet with one coat on smooth primed drywall." },
      { question: "How do doors and windows affect the paint calculation?", answer: "Standard doors subtract roughly 20 square feet each, and average windows subtract about 15 square feet each from total wall surface area." },
      { question: "Why should I apply two coats of paint instead of one?", answer: "Two coats ensure even color saturation, cover underlying stains, and provide greater durability against scrubbing and scuffs." },
      { question: "Should I buy a little extra paint beyond the exact calculation?", answer: "Yes. It is standard practice to round up to the next full gallon or add 10% extra for textured walls, touch-ups, and roller absorption." }
    ]
  },
  {
    id: 'density-calculator',
    title: "Density Calculator — Mass, Volume & Density Formula Online",
    navTitle: "Density Calculator",
    description: "Calculate density, mass, or volume with instant unit conversions online. Compare material reference densities for metals, liquids, and common solids.",
    icon: '🧪',
    path: '/density-calculator.html',
    filename: 'density-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Science',
    features: [
      "Solves for Density (ρ = m/V), Mass (m = ρ×V), or Volume (V = m/ρ)",
      "Extensive Unit Support (g/cm³, kg/m³, lb/ft³, g/mL, kg/L)",
      "Built-in Reference Density Library (Gold, Iron, Water, Ice, Air, Wood)",
      "Real-Time Scientific Unit Conversion and Formatting",
      "Step-by-Step Mathematical Formula Display",
      "100% In-Browser Execution for Chemistry and Physics Students"
    ],
    howTo: [
      { title: "Select Calculation Variable", desc: "Choose whether you want to calculate Density, Mass, or Volume." },
      { title: "Enter the Two Known Values", desc: "Input the measurements and select their units (e.g. grams and cubic centimeters)." },
      { title: "Review the Calculated Result", desc: "Inspect the resulting value in multiple standard units and compare against common materials." }
    ],
    faq: [
      { question: "What is the standard formula for calculating density?", answer: "Density is defined as mass per unit volume: ρ = m / V, where ρ (rho) is density, m is mass, and V is volume." },
      { question: "What is the density of pure water at standard room temperature?", answer: "Pure liquid water has a density of approximately 1.000 g/cm³ (or 1,000 kg/m³ and 1.000 g/mL) at 4°C." },
      { question: "How do I convert density from g/cm³ to kg/m³?", answer: "To convert from g/cm³ to kg/m³, multiply by 1,000. For example, aluminum has a density of 2.70 g/cm³, which equals 2,700 kg/m³." },
      { question: "Can I find the volume of an object if I know its weight and material?", answer: "Yes. Set the calculator to solve for Volume (V = m / ρ), select your material from the density library, and enter its mass." }
    ]
  },
  {
    id: 'screen-size-calculator',
    title: "Screen Size Calculator — Monitor Dimensions, Area & PPI Online",
    navTitle: "Screen Size Calc",
    description: "Calculate monitor physical width, height, viewable area, and pixel density (PPI) online from diagonal display size and aspect ratio with zero math.",
    icon: '🖥️',
    path: '/screen-size-calculator.html',
    filename: 'screen-size-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Hardware',
    features: [
      "Calculates Physical Screen Width, Height & Total Surface Area",
      "Pixel Density (PPI / Pixels Per Inch) & Dot Pitch Calculations",
      "Aspect Ratio Presets (16:9, 16:10, 21:9 Ultrawide, 32:9 Superwide, 4:3)",
      "Resolution Presets (1080p FHD, 1440p QHD, 4K UHD, 5K, 8K)",
      "Dual Unit Support in Inches and Centimeters",
      "Compare Display Real Estate for Dual-Monitor Setups"
    ],
    howTo: [
      { title: "Enter Diagonal Screen Size", desc: "Type your monitor, laptop, or TV diagonal measurement in inches (e.g. 27\" or 34\")." },
      { title: "Select Aspect Ratio and Resolution", desc: "Choose your aspect ratio (e.g. 16:9) and screen resolution (e.g. 2560×1440)." },
      { title: "Review Dimensions and Pixel Density", desc: "Inspect exact physical width, height, surface area in square inches, and pixel density (PPI)." }
    ],
    faq: [
      { question: "Why does an ultrawide 34-inch monitor have a different height than a 16:9 34-inch monitor?", answer: "Because diagonal measurements span corner to corner, wider aspect ratios (like 21:9) distribute diagonal length horizontally, resulting in less vertical height and smaller total surface area than a square-ish 16:9 screen of the same diagonal." },
      { question: "What is PPI and why does pixel density matter for monitors?", answer: "PPI (Pixels Per Inch) measures display sharpness. Higher PPI values (like 110+ PPI for desktop monitors or 200+ PPI for laptops) result in crisp text without visible pixelation." },
      { question: "What is the ideal desktop monitor PPI for clear text rendering?", answer: "A density of 100 to 120 PPI is considered the sweet spot for standard desktop viewing distances without requiring OS display scaling." },
      { question: "Can I calculate dimensions in centimeters instead of inches?", answer: "Yes. The calculator toggles seamlessly between Imperial inches and Metric centimeters." }
    ]
  },
  {
    id: 'torque-calculator',
    title: "Torque Calculator — Rotational Force, Distance & RPM Online",
    navTitle: "Torque Calculator",
    description: "Calculate mechanical rotational torque from applied force and lever arm radius or motor power and RPM online. Supports metric and imperial units.",
    icon: '⚙️',
    path: '/torque-calculator.html',
    filename: 'torque-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Engineering',
    features: [
      "Calculates Torque from Lever Arm Distance, Force & Angle (τ = r × F × sin θ)",
      "Calculates Motor Rotational Torque from Horsepower/kW & RPM",
      "Comprehensive Unit Conversion (N·m, ft-lb, in-lb, kgf·m, dyn·cm)",
      "Solves for Any Missing Variable (Torque, Force, Radius, or Power)",
      "Visual Mechanical Diagram and Engineering Formulas",
      "Instant In-Browser Calculations for Automotive and Physics"
    ],
    howTo: [
      { title: "Choose Calculation Mode", desc: "Select whether to calculate torque from mechanical lever force or electric motor power and RPM." },
      { title: "Input Known Values and Angles", desc: "Enter force, lever arm distance, angle of application, or motor power and speed." },
      { title: "Review Torque in N·m and ft-lb", desc: "View calculated rotational torque converted across international engineering units." }
    ],
    faq: [
      { question: "What is the fundamental formula for calculating torque?", answer: "Torque (τ) is calculated as τ = r × F × sin(θ), where r is the lever arm distance, F is the applied force, and θ is the angle between the lever arm and the force vector." },
      { question: "How do you calculate torque from electric motor horsepower and RPM?", answer: "In imperial units, Torque (ft-lb) = (Horsepower × 5,252) / RPM. In metric units, Torque (N·m) = (Power in Watts × 9.5488) / RPM." },
      { question: "How do foot-pounds (ft-lb) convert to Newton-meters (N·m)?", answer: "1 foot-pound is approximately equal to 1.3558 Newton-meters (N·m). 1 N·m is equal to approximately 0.7376 ft-lb." },
      { question: "Why does applying force at 90 degrees produce maximum torque?", answer: "Because the sine of 90 degrees equals 1.0 (sin 90° = 1), delivering 100% of the applied force perpendicularly into rotational work." }
    ]
  },
  {
    id: 'linear-regression-calculator',
    title: "Linear Regression Calculator — Best Fit Line y = mx + b Online",
    navTitle: "Linear Regression",
    description: "Calculate linear regression equations, slope, y-intercept, and correlation coefficient r online. Generate trendline plots with value predictions.",
    icon: '📈',
    path: '/linear-regression-calculator.html',
    filename: 'linear-regression-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'Math',
    features: [
      "Computes Least Squares Best Fit Line Equation (y = mx + b)",
      "Calculates Slope (m), Y-Intercept (b), and Standard Error",
      "Computes Pearson Correlation (r) & Coefficient of Determination (R²)",
      "Interactive Scatter Plot with Regression Trendline Visualization",
      "Value Prediction Tool to Forecast Y for Any Given X Input",
      "Parses Paired (X, Y) Coordinates from Tables or CSV Paste"
    ],
    howTo: [
      { title: "Enter Paired (X, Y) Data Points", desc: "Type or paste coordinate pairs separated by commas, spaces, or tabs." },
      { title: "Calculate Best-Fit Equation", desc: "The tool computes least-squares regression statistics, slope, intercept, and correlation coefficient." },
      { title: "Review Trendline and Forecast Y", desc: "Inspect the scatter chart and enter new X values to predict expected Y outputs." }
    ],
    faq: [
      { question: "What does the Pearson correlation coefficient (r) indicate?", answer: "The correlation coefficient r ranges from -1 to +1. Values near +1 indicate a strong positive linear relationship, values near -1 indicate a strong negative relationship, and values near 0 indicate no linear correlation." },
      { question: "What is the meaning of the R² (coefficient of determination) value?", answer: "R² measures the proportion of variance in the dependent variable (Y) that is predictable from the independent variable (X). An R² of 0.85 means 85% of variance is explained by the linear model." },
      { question: "Can I use this calculator to predict future values?", answer: "Yes. Use the built-in prediction box to plug in any X value into the resulting y = mx + b equation to calculate the predicted Y value." },
      { question: "How many data points are needed for linear regression?", answer: "You need at least two distinct points to form a line, but 5 or more points are recommended for meaningful statistical correlation." }
    ]
  },
  {
    id: 'sha256-hash-generator',
    title: 'SHA-256 Hash Generator — Real-Time Checksum Verifier',
    navTitle: 'SHA-256 Generator',
    description: 'Generate 256-bit cryptographic SHA-256 checksum hashes in real-time with Web Crypto API and verify matching digests. Free, private client-side browser tool.',
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
    description: 'Generate 128-bit MD5 message digest hash checksums instantly with real-time verification and casing options. Fast, private client-side tool with instant copy.',
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
    title: "Wide Text Generator — Fullwidth Aesthetic Vaporwave Font Online",
    navTitle: "Wide Text",
    description: "Convert normal text into aesthetic fullwidth vaporwave text and spaced characters online. Copy wide aesthetic typography for social bios and usernames.",
    icon: '🔤',
    path: '/wide-text-generator.html',
    filename: 'wide-text-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Creative',
    features: [
      "Converts Text to Unicode Fullwidth Characters (ｆｕｌｌｗｉｄｔｈ)",
      "Aesthetic Spaced Letter Mode (w i d e  t e x t) with Custom Spacing",
      "Universal Unicode Compatibility Across Discord, Twitter, Instagram & TikTok",
      "Real-Time Instant Preview as You Type",
      "One-Click Copy Button with Visual Feedback",
      "100% Client-Side In-Browser Typography Transformer"
    ],
    howTo: [
      { title: "Enter Normal Text", desc: "Type or paste standard words, usernames, or quotes into the input field." },
      { title: "Choose Aesthetic Style", desc: "Select Fullwidth Japanese Zenkaku characters or spaced letter mode." },
      { title: "Copy Aesthetic Text", desc: "Click Copy to use your vaporwave styled text on social media profiles, Discord, or gaming handles." }
    ],
    faq: [
      { question: "What is fullwidth Unicode text (ｗｉｄｅ ｔｅｘｔ)?", answer: "Fullwidth characters originate from CJK (Chinese, Japanese, Korean) computing, where characters occupy the same width as Kanji glyphs. In internet culture, they are popular for vaporwave aesthetics." },
      { question: "Will wide text display properly on phones and social media apps?", answer: "Yes. Because they are standard Unicode characters (U+FF01 to U+FF5E), they render natively across modern operating systems, Discord, Instagram, and TikTok." },
      { question: "Can I use wide text in gaming handles like Steam or Discord?", answer: "Yes. Many gamers use fullwidth characters to create distinctive usernames and Discord nicknames." },
      { question: "Can I adjust the spacing between characters?", answer: "Yes. You can switch to spaced typography mode and adjust the spacing slider for custom text width." }
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
    title: "Text Reverser — Reverse Words, Letters & Backwards Text Online",
    navTitle: "Text Reverser",
    description: "Reverse text, flip word order, mirror letters backwards, or turn text upside down online. Transform sentences instantly with one-click clipboard copy.",
    icon: '🔄',
    path: '/text-reverser.html',
    filename: 'text-reverser.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: [
      "Reverse Character Order (Reverses Letters Completely Backwards)",
      "Reverse Word Order (Maintains Letter Spelling, Reverses Sequence)",
      "Flip Text Upside Down Using Unicode Inverted Glyphs",
      "Reverse Each Line Individually for Code and Data Lists",
      "Instant Real-Time Reversal as You Type",
      "One-Click Clipboard Copying with Character Counter"
    ],
    howTo: [
      { title: "Paste Text to Reverse", desc: "Type or paste any phrase, sentence, or list into the input box." },
      { title: "Select Reversal Mode", desc: "Choose to reverse all characters, reverse word order, flip upside down, or reverse lines." },
      { title: "Copy Transformed Text", desc: "Click Copy to use your backwards text for puzzles, social media posts, or coding tests." }
    ],
    faq: [
      { question: "What is the difference between reversing characters and reversing word order?", answer: "Reversing characters inverts every letter (\"hello world\" becomes \"dlrow olleh\"), while reversing word order maintains individual word spelling but flips sentence order (\"world hello\")." },
      { question: "How does the upside-down text mode work?", answer: "It maps standard Latin letters to equivalent upside-down Unicode characters (e.g. \"a\" becomes \"ɐ\", \"e\" becomes \"ǝ\") and reverses character direction." },
      { question: "Can this tool be used for testing palindromes?", answer: "Yes. If a word or phrase produces the exact same string when reversed (ignoring spaces), it is a valid palindrome." },
      { question: "Are my private text inputs uploaded to a remote server?", answer: "No. All string manipulations execute strictly within your browser runtime with zero network requests." }
    ]
  },
  {
    id: 'remove-line-breaks',
    title: "Remove Line Breaks — Clean Text & Paragraph Formatter Online",
    navTitle: "Remove Line Breaks",
    description: "Remove line breaks, carriage returns, and newlines from messy copied text online. Replace breaks with spaces or custom delimiters with instant preview.",
    icon: '↩️',
    path: '/remove-line-breaks.html',
    filename: 'remove-line-breaks.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Cleaner',
    features: [
      "Strips Hard Line Breaks, Carriage Returns & Newlines (\\n, \\r\\n)",
      "Replaces Line Breaks with Single Spaces, Commas, or Custom Delimiters",
      "Preserves Double Paragraph Breaks Option for Article Formatting",
      "Removes Trailing and Consecutive Whitespace Automatically",
      "Character and Word Count Summary Cards",
      "100% In-Browser Execution for Private Documents and Code"
    ],
    howTo: [
      { title: "Paste Copied Text", desc: "Paste messy text copied from PDF files, emails, or terminal outputs with broken line wraps." },
      { title: "Choose Replacement Delimiter", desc: "Select whether to replace line breaks with spaces, commas, or semicolons, and choose if paragraphs should be preserved." },
      { title: "Copy Formatted Text", desc: "Click Copy to take your seamless, continuous text to Word, Google Docs, or email drafts." }
    ],
    faq: [
      { question: "Why does text copied from PDF files often have awkward line breaks?", answer: "PDFs store text in fixed-width visual layout lines rather than flowing paragraphs. Copying text brings along hard line breaks at the end of every line." },
      { question: "Can I keep paragraph breaks while removing line wraps within paragraphs?", answer: "Yes. Enable the \"Preserve Paragraph Breaks\" setting to merge single line breaks into flowing sentences while retaining empty lines between paragraphs." },
      { question: "Can I replace line breaks with commas to format spreadsheet lists?", answer: "Yes. Choose \"Comma\" as the replacement delimiter to convert a vertical list of items into a clean comma-separated list." },
      { question: "Is there any character limit on the text I can clean?", answer: "Because the tool runs in local browser memory, you can clean articles, essays, and legal agreements of any length within seconds." }
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
    title: "Text Repeater — Repeat Words & Messages 10,000x Times Online",
    navTitle: "Text Repeater",
    description: "Repeat words, phrases, emojis, or text strings up to 10,000 times online. Choose custom separators, line breaks, or numbering with one-click copying.",
    icon: '🔁',
    path: '/text-repeater.html',
    filename: 'text-repeater.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Generator',
    features: [
      "Repeats Any Word, Phrase, Emoji or String up to 10,000 Times",
      "Custom Delimiters (Newline, Space, Comma, Period, Custom Text)",
      "Optional Sequential Line Numbering (1., 2., 3...)",
      "Instant In-Browser Assembly with No Processing Lag",
      "One-Click Clipboard Copying with Total Character Count",
      "Perfect for Messaging, Stress Testing & Social Media Posts"
    ],
    howTo: [
      { title: "Enter Text to Repeat", desc: "Type any message, word, emoji, or phrase into the text input field." },
      { title: "Set Repetition Count and Delimiter", desc: "Specify how many times to repeat (e.g. 100 or 1,000) and choose your separator (newline, space, comma)." },
      { title: "Copy Repeated Message", desc: "Click Copy to take your repeated text string directly to WhatsApp, Discord, or code editors." }
    ],
    faq: [
      { question: "Can I repeat emojis as well as standard text words?", answer: "Yes. You can repeat emojis, symbols, custom strings, or complete multi-line paragraphs up to 10,000 times." },
      { question: "Can I put each repetition on a new line with line numbers?", answer: "Yes. Select the \"New Line\" separator and toggle \"Add Line Numbers\" to generate numbered lists automatically." },
      { question: "Will repeating text 1,000 or 10,000 times freeze my browser?", answer: "No. The repeater uses optimized array joining in JavaScript that compiles thousands of repetitions in a fraction of a second." },
      { question: "Is there any limit or payment required?", answer: "No. The tool is 100% free with unlimited generation rounds and zero sign-ups." }
    ]
  },
  {
    id: 'text-splitter',
    title: "Text Splitter — Split Text by Delimiter, Lines & Chunks Online",
    navTitle: "Text Splitter",
    description: "Split text, lists, and CSV data by delimiter, newline, regex, or character chunk size online. Inspect and copy split text chunks in your browser.",
    icon: '✂️',
    path: '/text-splitter.html',
    filename: 'text-splitter.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: [
      "Split by Character Delimiter (Comma, Semicolon, Pipe, Space, Tab)",
      "Split by Regex Pattern or Custom String Sequences",
      "Fixed-Length Character Chunk Splitting (e.g. 1,000 Characters Per Chunk)",
      "Live Chunk Counter & Chunk Length Statistics",
      "One-Click Copy Individual Chunks or Export All as List",
      "100% In-Browser Execution for Large Data Files and Logs"
    ],
    howTo: [
      { title: "Paste Text to Split", desc: "Input text, CSV records, comma-separated lists, or long articles." },
      { title: "Choose Splitting Method", desc: "Select whether to split by a delimiter (like comma or newline) or divide into fixed character chunks." },
      { title: "Review and Copy Chunks", desc: "Inspect the segmented pieces and copy individual chunks or the complete split list." }
    ],
    faq: [
      { question: "Why would I split text by fixed character chunks?", answer: "Splitting long texts into chunks (such as 2,000 or 4,000 characters) is useful for pasting text into AI chatbots with prompt size limits or sending long SMS messages." },
      { question: "Can I split comma-separated values (CSV) into separate lines?", answer: "Yes. Set the delimiter to a comma, and the tool will split the list into individual items on separate lines." },
      { question: "Does the tool support custom regular expressions (regex)?", answer: "Yes. You can define custom regex split patterns to handle complex multi-delimiter text structures." },
      { question: "Are my files or text blocks sent to any server?", answer: "No. String segmentation occurs completely within your browser runtime." }
    ]
  },
  {
    id: 'text-joiner',
    title: "Text Joiner — Combine Lines with Custom Delimiters Online",
    navTitle: "Text Joiner",
    description: "Join and merge multiple lines of text with commas, semicolons, tabs, or custom separators online. Concatenate list items with prefix and suffix options.",
    icon: '🔗',
    path: '/text-joiner.html',
    filename: 'text-joiner.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Utility',
    features: [
      "Join Separate Lines into a Single Delimited String",
      "Preset Delimiters: Comma, Comma+Space, Semicolon, Tab, Pipe (|)",
      "Custom String Delimiter Option with Custom Padding",
      "Add Custom Prefix and Suffix to Each Line (e.g. Quotes 'value')",
      "Optional Empty Line Removal & Whitespace Trimming",
      "Instant Real-Time Concatenation with One-Click Copying"
    ],
    howTo: [
      { title: "Paste Multi-Line List", desc: "Paste a list of items, IDs, emails, or names (one per line)." },
      { title: "Select Separator Delimiter", desc: "Choose a delimiter like comma, comma-space (\", \"), semicolon, or enter a custom separator." },
      { title: "Copy Merged Text", desc: "Review the joined string and click Copy to paste into spreadsheets, SQL IN clauses, or code arrays." }
    ],
    faq: [
      { question: "How do I convert a vertical column of IDs into a SQL IN clause list?", answer: "Paste your list of IDs, choose comma as the delimiter, and set single quotes (') as the prefix and suffix to output `'id1', 'id2', 'id3'`." },
      { question: "Can I join text lines with custom text like \" AND \" or \" OR \"?", answer: "Yes. You can type any custom word or character sequence into the custom delimiter box." },
      { question: "Can I remove blank lines automatically before joining?", answer: "Yes. The \"Ignore Empty Lines\" toggle ensures blank rows do not create unwanted double commas or delimiters." },
      { question: "Is my data private when using this tool?", answer: "Yes. All line merging runs in client-side JavaScript inside your browser with zero server logging." }
    ]
  },
  {
    id: 'email-extractor',
    title: "Email Extractor — Scrape & Filter Emails from Text Online",
    navTitle: "Email Extractor",
    description: "Extract all valid email addresses from raw text, documents, and web source code online. Automatically deduplicate and sort emails with one-click export.",
    icon: '📧',
    path: '/email-extractor.html',
    filename: 'email-extractor.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Scraper',
    features: [
      "Extracts All Valid Email Addresses from Unstructured Text & HTML",
      "Automatic Deduplication of Redundant Email Entries",
      "Sort Extracted Emails Alphabetically (A to Z) or Keep Found Order",
      "Domain Extension Filtering (.com, .org, .edu, .io, custom)",
      "Export Results as Newline-Separated or Comma-Separated Lists",
      "100% In-Browser Execution Safeguarding Contact Data Privacy"
    ],
    howTo: [
      { title: "Paste Raw Text or Source Code", desc: "Paste articles, contact pages, HTML source, or email headers containing email addresses." },
      { title: "Configure Filters and Sorting", desc: "Toggle automatic deduplication, alphabetical sorting, or filter by specific top-level domains." },
      { title: "Copy or Export Unique Emails", desc: "Inspect the list of discovered emails, view total count, and copy clean emails to your clipboard." }
    ],
    faq: [
      { question: "How does the email extractor identify valid email addresses?", answer: "It uses standardized RFC-compliant regular expressions to find email patterns (username@domain.tld) embedded within messy text or HTML code." },
      { question: "Does the tool automatically remove duplicate email addresses?", answer: "Yes. Deduplication is enabled by default, ensuring every extracted email address appears only once in your final list." },
      { question: "Can I filter for specific corporate or academic email domains?", answer: "Yes. You can filter results to display only emails matching specific domain extensions like `.edu` or specific companies." },
      { question: "Are extracted contact lists uploaded or saved anywhere?", answer: "No. All regex parsing executes entirely in your local browser memory to ensure confidential contact lists remain completely private." }
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
    description: 'Encode special characters to HTML entities (&amp;, &lt;, &gt;, &quot;) or decode named and numeric entities back to text. Fast and private client-side tool.',
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
    description: 'Convert ASCII and UTF-8 text strings to 8-bit binary code with space, comma, or continuous formatting. Fast in-browser encoding with instant copy and download.',
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
    description: 'Translate binary code (0s and 1s) back into readable English text with auto-delimiter detection and error handling. Fast, private client-side binary decoder.',
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
    description: 'Convert plain text and strings to hexadecimal values with uppercase/lowercase, space, colon, or 0x prefixes. Fast, private client-side ASCII to hex converter.',
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
    description: 'Decode hexadecimal strings, byte codes, and hex dumps back into readable ASCII and UTF-8 plain text. Supports 0x prefixes, spaces, and colons in your browser.',
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
    description: 'Compress and minify CSS stylesheets online by stripping comments, redundant whitespace, and semicolons. Boost page speed and Core Web Vitals with free tool.',
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
    description: 'Minify JavaScript code online by stripping comments and whitespace while preserving syntax boundaries and semicolons. Boost page speed with free in-browser tool.',
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
    description: 'Minify HTML markup, strip comments, and eliminate whitespace while protecting pre, code, and script blocks. Optimize web page speed with fast in-browser tool.',
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
    description: 'Minify SQL queries, strip comments, and convert multi-line statements into single-line queries while protecting string literals. Fast, free client-side tool.',
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
    description: 'Generate Google SEO meta tags, Open Graph tags, and Twitter Cards with live SERP and social share previews. Copy ready-to-use HTML head tags in your browser.',
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
    description: 'Generate optimized robots.txt files for Googlebot and search crawlers with presets, disallow paths, and sitemap directives. Download valid robots.txt online.',
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
    description: 'Generate Google Search Console compliant XML sitemaps with priority, change frequency, and bulk URL importing. Download standardized sitemap.xml in browser.',
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
    description: 'Generate Google Rich Results JSON-LD schema markup for Organizations, Articles, FAQ Pages, Products, and Local Businesses. Ready for Google Search Console.',
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
    description: 'Build trackable marketing campaign URLs with UTM parameters (source, medium, campaign, term, content) and saved history. Free link builder for Google Analytics.',
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
    title: "Barcode Scanner Online — Scan 1D & 2D Barcodes Free in Browser",
    navTitle: "Barcode Scanner",
    description: "Scan and decode 1D and 2D barcodes using your device camera or uploaded images online. Read UPC, EAN, Code 128, and QR codes directly in your browser.",
    icon: '📱',
    path: '/barcode-scanner.html',
    filename: 'barcode-scanner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Scanner',
    features: [
      "Real-Time Live Camera Barcode Scanning on Mobile & Desktop",
      "Upload & Decode Image Files (PNG, JPG, WebP)",
      "Supports 1D Barcodes (UPC-A, EAN-13, Code 128, Code 39, ITF)",
      "Supports 2D Barcodes (QR Code, Data Matrix, PDF417)",
      "One-Click Clipboard Copying & Google Product Search Link",
      "100% Client-Side Barcode Recognition with Zero Server Uploads"
    ],
    howTo: [
      { title: "Enable Camera or Upload an Image", desc: "Point your camera at a barcode or drop an image file containing a barcode into the scanner." },
      { title: "Automatic Detection and Decode", desc: "The tool uses hardware-accelerated computer vision to locate and decode the barcode format." },
      { title: "Copy Scanned Data or Search Product", desc: "Copy the numeric code or text to your clipboard, or click Search to look up product information." }
    ],
    faq: [
      { question: "Which barcode formats are supported by this scanner?", answer: "It decodes common retail 1D barcodes (UPC-A, UPC-E, EAN-13, EAN-8), industrial barcodes (Code 128, Code 39, ITF), and 2D matrices (QR codes, Data Matrix)." },
      { question: "Can I scan barcodes using my smartphone camera?", answer: "Yes. The scanner works in mobile web browsers (Safari, Chrome, Firefox) using native WebRTC camera streams." },
      { question: "Is my camera video stream or barcode data sent to a server?", answer: "No. Camera frames are processed entirely on your device via client-side Barcode Detection and WebAssembly libraries." },
      { question: "Can I scan a barcode from an image or screenshot saved on my computer?", answer: "Yes. You can drag and drop any image file to read barcodes without needing a webcam." }
    ]
  },
  {
    id: 'calendar-notes',
    title: "Calendar Notes — Private Monthly Calendar & Daily Planner Online",
    navTitle: "Calendar Notes",
    description: "Organize daily tasks and journal notes on an interactive monthly calendar online. Keep notes stored locally in your browser with private offline access.",
    icon: '📅',
    path: '/calendar-notes.html',
    filename: 'calendar-notes.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Planner',
    features: [
      "Interactive Full-Month Calendar View with Date Highlighting",
      "Dedicated Daily Journaling & Task Checklist Notes",
      "Visual Activity Dots Indicating Days with Saved Notes",
      "Local Browser Persistence with Zero Account Requirements",
      "Export and Backup Notes to Text or JSON Files",
      "100% Private Offline Execution Protecting Personal Schedules"
    ],
    howTo: [
      { title: "Select a Calendar Date", desc: "Click on any day of the current, past, or future month to open its daily notes panel." },
      { title: "Write Daily Notes and Reminders", desc: "Type meeting notes, daily priorities, journal thoughts, or tasks for that specific date." },
      { title: "Navigate Months and Export Data", desc: "Browse between months with indicator dots showing active notes, and backup your entries anytime." }
    ],
    faq: [
      { question: "Where are my daily calendar notes stored?", answer: "All notes are stored in your web browser’s local storage (LocalStorage). Your entries are never uploaded or synced to external servers." },
      { question: "Will my calendar notes be saved if I close or refresh the tab?", answer: "Yes. Your notes persist automatically in your browser on this device across browser restarts." },
      { question: "Can I export a backup of all my calendar entries?", answer: "Yes. You can export all your notes into a clean JSON or text backup file to transfer or archive your records." },
      { question: "How do I identify which dates have notes attached?", answer: "Dates with saved notes display a visual marker dot on the calendar grid, making it easy to see your active days at a glance." }
    ]
  },
  {
    id: 'clipboard-history',
    title: "Clipboard History Manager — Save & Search Copied Snippets Online",
    navTitle: "Clipboard History",
    description: "Store and organize copied text snippets, code blocks, and templates locally online. Search your personal clipboard history with one-click re-copying.",
    icon: '📋',
    path: '/clipboard-history.html',
    filename: 'clipboard-history.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Utility',
    features: [
      "Save and Organize Frequently Used Text Snippets and Code",
      "Instant Real-Time Search Across Snippet Titles & Contents",
      "One-Click Re-Copy to System Clipboard with Visual Toast Feedback",
      "Custom Categorization and Tagging for Quick Access",
      "Local Browser Storage with Import & Export Backup Support",
      "Complete Privacy with Zero Cloud Synchronization"
    ],
    howTo: [
      { title: "Add a Copied Snippet", desc: "Paste any text, email response, code block, or message template into the manager." },
      { title: "Organize and Tag Items", desc: "Assign descriptive titles or category tags so you can find them easily later." },
      { title: "Search and One-Click Copy", desc: "Use the instant search bar to find any saved snippet and click Copy to place it back onto your clipboard." }
    ],
    faq: [
      { question: "Can this tool replace repetitive typing of email replies and code templates?", answer: "Yes. It acts as a personal snippet library where you can keep canned responses, frequently used links, and code snippets ready for instant copying." },
      { question: "Is my clipboard data transmitted across the internet?", answer: "No. Everything stays in your browser’s local storage on your device. No text or snippets are ever transmitted to any server." },
      { question: "Can I search through my saved snippets?", answer: "Yes. The real-time search filter checks snippet titles and text bodies instantly as you type." },
      { question: "How do I backup or transfer my snippets to another device?", answer: "You can export all your saved items into a JSON backup file and import it into another browser anytime." }
    ]
  },
  {
    id: 'daily-planner',
    title: "Daily Routine Planner — Morning, Afternoon & Evening Focus Online",
    navTitle: "Daily Planner",
    description: "Structure your daily schedule into Morning, Afternoon, and Evening focus blocks online. Track task checkboxes and priorities stored in your browser.",
    icon: '☀️',
    path: '/daily-planner.html',
    filename: 'daily-planner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Routine',
    features: [
      "Time-Blocked Sections for Morning, Afternoon & Evening Focus",
      "Daily Top 3 Priorities Highlight Card for Goal Alignment",
      "Interactive Checkboxes with Progress Percentage Tracking",
      "Dedicated Notes and Daily Gratitude Journaling Section",
      "Automatic Local Browser Storage for Seamless Daily Routines",
      "100% Private Offline Planning Without Account Sign-In"
    ],
    howTo: [
      { title: "Set Top 3 Daily Priorities", desc: "Define the three most critical goals you want to accomplish today." },
      { title: "Organize Tasks by Time Blocks", desc: "Add morning, afternoon, and evening action items into dedicated time blocks." },
      { title: "Check Off Completed Items", desc: "Mark tasks complete throughout the day and monitor your daily productivity progress." }
    ],
    faq: [
      { question: "Why is time blocking into Morning, Afternoon, and Evening effective?", answer: "Breaking your day into three structured blocks prevents overwhelm, aligns high-energy tasks with morning hours, and gives clear structure to your day." },
      { question: "What is the purpose of setting \"Top 3 Priorities\"?", answer: "Focusing on three core priorities ensures you achieve your most important outcomes each day even if minor errands get rescheduled." },
      { question: "Will my daily routine planner save my tasks if I close the browser?", answer: "Yes. All daily tasks, priorities, and notes are saved automatically in your browser’s local storage." },
      { question: "Can I clear my tasks at the end of the day to start fresh tomorrow?", answer: "Yes. A one-click reset option allows you to clear completed items or reset the planner for a productive new morning." }
    ]
  },
  {
    id: 'expense-tracker',
    title: "Personal Expense Tracker — Track Daily Income, Expenses & Budget",
    navTitle: "Expense Tracker",
    description: "Log daily personal expenses and income with real-time balance tracking and category breakdowns online. Export financial records to CSV with zero server sync.",
    icon: '💰',
    path: '/expense-tracker.html',
    filename: 'expense-tracker.html',
    category: '💼 Business Tools',
    badge: 'Finance',
    features: [
      "Log Daily Income & Expense Transactions with Date Tags",
      "Comprehensive Spending Categories (Housing, Food, Utilities, Transport)",
      "Real-Time Net Balance, Total Income & Expense Summaries",
      "Interactive Spending Breakdown by Category",
      "Export Transaction History Directly to CSV Spreadsheet",
      "Persistent Local Storage in Browser Without Remote Cloud Sync"
    ],
    howTo: [
      { title: "Record a Transaction", desc: "Enter transaction amount, description, date, and select whether it is income or an expense." },
      { title: "Assign Category and Payment Method", desc: "Tag entries with categories such as Groceries, Rent, Salary, or Utilities to organize your cash flow." },
      { title: "Monitor Financial Balances and Export", desc: "Track your live net cash balance, review category spending totals, and export records to CSV anytime." }
    ],
    faq: [
      { question: "Where is my private personal financial data stored?", answer: "All transaction records are saved exclusively in your browser’s local storage (LocalStorage). No financial records are ever sent to Zubware servers." },
      { question: "Can I export my logged expenses to Excel or Google Sheets?", answer: "Yes. Click the Export CSV button to download a spreadsheet-compatible file containing dates, categories, descriptions, and amounts." },
      { question: "Can I delete or edit past transactions?", answer: "Yes. Each transaction entry in the history table has an individual delete button to remove mistakes or update records." },
      { question: "Will my expense data be saved if I close or refresh the browser?", answer: "Yes. Because data persists in your browser’s local storage, your records will be right there when you return on the same device." },
      { question: "Do I need to connect a bank account or credit card?", answer: "No. This is a private, manual ledger tool requiring zero bank logins, passwords, or third-party financial API access." }
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
    title: "Daily Habit Tracker — Build Positive Habits & Track Streaks Online",
    navTitle: "Habit Tracker",
    description: "Track daily habits, build consistent routines, and celebrate streak milestones online. View weekly completion progress stored privately in your browser.",
    icon: '🔥',
    path: '/habit-tracker.html',
    filename: 'habit-tracker.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Habits',
    features: [
      "Track Unlimited Custom Daily Habits (Health, Work, Learning, Fitness)",
      "Consecutive Day Streak Counters & Longest Streak Records",
      "Weekly Multi-Day Completion Grid Visualization",
      "Daily Completion Percentage Progress Bar",
      "Persistent Local Storage in Browser Without Cloud Accounts",
      "Fast, Intuitive One-Click Check-In Interface"
    ],
    howTo: [
      { title: "Add Your Target Habits", desc: "Create habits you want to cultivate (e.g. Read 20 Mins, Drink Water, Morning Workout)." },
      { title: "Check In Daily", desc: "Click each habit’s checkbox every day you complete it to maintain your streak." },
      { title: "Monitor Streaks and Consistency", desc: "Review your 7-day completion grid and watch your consecutive streak counts grow." }
    ],
    faq: [
      { question: "How do habit streaks help build lasting routines?", answer: "Visual streak counters create positive behavioral reinforcement, motivating you to maintain daily consistency and avoid breaking the chain." },
      { question: "How many habits should I track simultaneously?", answer: "Behavioral experts recommend starting with 3 to 5 key habits to build solid momentum before adding additional routines." },
      { question: "Where is my habit history stored?", answer: "All habit definitions, completion checks, and streak records are stored exclusively in your browser’s LocalStorage on this device." },
      { question: "Can I edit or delete habits later?", answer: "Yes. You can edit habit names or delete completed habit goals at any time." }
    ]
  },
  {
    id: 'monthly-budget-planner',
    title: "Monthly Budget Planner — Category Spending Limits & 50/30/20 Rule",
    navTitle: "Budget Planner",
    description: "Plan monthly household budgets and track spending limits by category online for free. Follow the 50/30/20 rule and monitor savings goals in your browser.",
    icon: '💳',
    path: '/monthly-budget-planner.html',
    filename: 'monthly-budget-planner.html',
    category: '💼 Business Tools',
    badge: 'Budget',
    features: [
      "Custom Category Budget Allocations (Needs, Wants, Savings)",
      "Built-in 50/30/20 Budgeting Rule Calculation Framework",
      "Visual Progress Bars & Over-Budget Warning Indicators",
      "Total Budget vs Actual Spent Financial Overview",
      "Net Monthly Income Surplus & Deficit Calculations",
      "Local Browser Persistence with Total Personal Privacy"
    ],
    howTo: [
      { title: "Enter Monthly Take-Home Pay", desc: "Input your total monthly net income after taxes to establish your available spending baseline." },
      { title: "Allocate Category Budget Limits", desc: "Set target budgets for housing, groceries, transport, utilities, dining out, and emergency savings." },
      { title: "Review Budget Health and Surpluses", desc: "Check the 50/30/20 breakdown, monitor category progress bars, and ensure your monthly budget balances to zero." }
    ],
    faq: [
      { question: "How does the 50/30/20 budgeting rule work in this planner?", answer: "It divides your after-tax income into 50% for essential Needs, 30% for discretionary Wants, and 20% for Savings and debt repayment, helping you maintain balanced finances." },
      { question: "Can I add custom spending categories beyond the default list?", answer: "Yes. You can customize category names, assign specific monthly spending caps, and track expenses across your household priorities." },
      { question: "What happens if I allocate more money than my monthly income?", answer: "The planner immediately highlights a deficit warning indicator, showing the exact dollar amount needed to balance your monthly budget." },
      { question: "Is my salary and personal budget data sent to any third party?", answer: "No. All budget numbers and allocations remain stored locally inside your browser session with zero server tracking." },
      { question: "Can I use this budget planner on my smartphone or tablet?", answer: "Yes. The responsive design allows you to manage and review your monthly budget seamlessly across mobile phones, tablets, and desktop computers." }
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
    title: "Pomodoro Focus Timer — 25-Minute Work & Break Intervals Online",
    navTitle: "Pomodoro Timer",
    description: "Boost productivity with 25-minute Pomodoro focus intervals and structured breaks online. Features customizable session timers and soothing audio chimes.",
    icon: '⏱️',
    path: '/pomodoro-timer.html',
    filename: 'pomodoro-timer.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Focus',
    features: [
      "Standard 25-Minute Focus, 5-Minute Short Break & 15-Minute Long Break",
      "Customizable Interval Durations for Flexible Deep Work Workflows",
      "Pleasant Audio Chime Notifications via Web Audio Synthesis",
      "Circular Countdown Visual Progress Indicator with Pause & Reset",
      "Completed Pomodoro Session Counter Tracking Daily Focus",
      "Zero Ads, Signups, or Disruptions in a Clean Minimalist UI"
    ],
    howTo: [
      { title: "Select a Focus Session", desc: "Start with the classic 25-minute Pomodoro interval or adjust custom minutes." },
      { title: "Focus Without Distraction", desc: "Work on your single primary task until the timer chimes signaling the session end." },
      { title: "Take a Rest and Repeat", desc: "Take a 5-minute short break to refresh. After 4 completed pomodoros, enjoy an extended 15-minute long break." }
    ],
    faq: [
      { question: "What is the Pomodoro Technique and how does it improve productivity?", answer: "Developed by Francesco Cirillo, it uses 25-minute intervals of focused deep work separated by 5-minute breaks to maintain high concentration and prevent mental fatigue." },
      { question: "Can I customize the timer lengths for work and break periods?", answer: "Yes. You can adjust the minutes for focus sessions, short breaks, and long breaks to fit your personal workflow rhythm." },
      { question: "Does the timer play an audible alert when a session ends?", answer: "Yes. It plays a gentle synthesized audio chime when each interval finishes, with an optional mute toggle." },
      { question: "Does the timer continue running if I switch to another tab?", answer: "Yes. The timer updates continuously in background browser tabs and updates the page title with remaining time." }
    ]
  },
  {
    id: 'secure-notes',
    title: "Secure Offline Notes — Private Local Browser Notepad Online",
    navTitle: "Secure Notes",
    description: "Write, organize, and pin private notes stored safely in your browser memory online. Search notes instantly and export text with zero cloud storage.",
    icon: '📝',
    path: '/secure-notes.html',
    filename: 'secure-notes.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Private',
    features: [
      "Private Browser Notepad with Zero Server Transmission",
      "Instant Full-Text Search Across Note Titles and Bodies",
      "Pin Important Notes to the Top of Your Workspace",
      "Export Notes to TXT Files or Complete JSON Backup",
      "Clean Distraction-Free Markdown-Friendly Writing Canvas",
      "Automatic Local Storage Saving on Every Keystroke"
    ],
    howTo: [
      { title: "Create a New Note", desc: "Click New Note to start drafting thoughts, draft messages, or meeting notes." },
      { title: "Organize and Pin Essentials", desc: "Assign titles, format text, and click the pin icon to keep high-priority notes at the top." },
      { title: "Search or Export Anytime", desc: "Use instant search to retrieve notes and download text backups whenever needed." }
    ],
    faq: [
      { question: "Are my notes stored on any cloud server or database?", answer: "No. Notes are stored exclusively inside your device browser’s local storage. Nobody else can access or view your private notes." },
      { question: "Do I need an account or login to write and save notes?", answer: "No. The notepad is completely serverless and requires no login, email address, or account setup." },
      { question: "Can I export my notes to transfer them to another device?", answer: "Yes. You can export individual notes as text files or download all notes as a JSON backup to import onto another computer." },
      { question: "What happens if I accidentally close the tab while writing?", answer: "Your text saves automatically with every keystroke, so your notes will be right where you left them when you return." }
    ]
  },
  {
    id: 'sha-checksum-generator',
    title: 'SHA Checksum Generator — SHA-1, SHA-256, SHA-384 & SHA-512',
    navTitle: 'SHA Checksum Suite',
    description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes simultaneously for text or files. Fast client-side checksum verification in your browser.',
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
    title: "Todo List & Task Manager — Priority Checklist Online Free",
    navTitle: "Todo List",
    description: "Organize daily tasks with priority tags, category filters, and progress tracking online. Manage your personal to-do list stored safely in your browser.",
    icon: '✅',
    path: '/todo-list.html',
    filename: 'todo-list.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Tasks',
    features: [
      "Priority Level Tagging (High, Medium, Low Priority)",
      "Custom Task Categorization (Work, Personal, Errands, Projects)",
      "Filter Views for Active, Completed & All Task Items",
      "Visual Progress Bar Indicating Completed Task Percentages",
      "Persistent Local Storage in Browser with One-Click Clear Completed",
      "100% Private Offline Task Management Without Cloud Sync"
    ],
    howTo: [
      { title: "Add a New Task", desc: "Type your task description, select a priority level, and choose a category." },
      { title: "Organize and Filter Tasks", desc: "Filter by priority or active status to focus on your most critical immediate objectives." },
      { title: "Check Off Completed Items", desc: "Check off finished tasks and watch your daily progress bar reach 100%." }
    ],
    faq: [
      { question: "How do priority levels help manage daily task lists?", answer: "Tagging tasks as High, Medium, or Low allows you to focus on urgent items first and filter out less important tasks during busy days." },
      { question: "Is my to-do list saved automatically?", answer: "Yes. All tasks, priority flags, and completion states are stored in your browser’s local storage on this computer." },
      { question: "Can I clear all completed tasks at once?", answer: "Yes. Click \"Clear Completed\" to tidy up your list and remove checked-off items while keeping active tasks in place." },
      { question: "Do I need to sign up for an account to use this task manager?", answer: "No. The tool is 100% free and ready to use immediately without any sign-up or subscription." }
    ]
  },
  {
    id: 'weekly-planner',
    title: "7-Day Weekly Planner — Schedule Monday to Sunday Online Free",
    navTitle: "Weekly Planner",
    description: "Plan your weekly schedule and daily commitments across Monday through Sunday online. Organize weekly tasks and checklists stored locally in your browser.",
    icon: '🗓️',
    path: '/weekly-planner.html',
    filename: 'weekly-planner.html',
    category: '🔒 Security, Privacy & Productivity',
    badge: 'Weekly',
    features: [
      "7 Dedicated Columns for Monday Through Sunday Scheduling",
      "Per-Day Task Creation with Checkboxes and Completion Tracking",
      "Weekly Priority Focus Banner for Key Milestones",
      "Week-by-Week Navigation and Historical Review",
      "Automatic Local Browser Storage for Complete Schedule Privacy",
      "Clean Responsive Layout Optimized for Desktop & Mobile"
    ],
    howTo: [
      { title: "Set Your Weekly Priority", desc: "Define the overarching goal or main milestone you want to achieve this week." },
      { title: "Map Tasks Across the 7 Days", desc: "Add appointments, workouts, deadlines, and study sessions under each specific day of the week." },
      { title: "Track Daily Progress and Check Off Items", desc: "Check off tasks as you move through Monday to Sunday to maintain weekly momentum." }
    ],
    faq: [
      { question: "How does a 7-day weekly planner differ from a daily to-do list?", answer: "A weekly planner lets you balance workloads across the entire week, ensuring you don’t overload single days and can easily schedule recurring commitments." },
      { question: "Where is my weekly schedule stored?", answer: "All weekly items and checklists are saved inside your browser’s local storage on your device. Nothing is stored on external cloud servers." },
      { question: "Can I view or plan upcoming weeks in advance?", answer: "Yes. Week navigation buttons let you switch between weeks to plan ahead or review past achievements." },
      { question: "Can I use this planner on a mobile phone or tablet?", answer: "Yes. The layout adapts responsively to smartphones and tablets, allowing easy mobile scheduling on the go." }
    ]
  },
  {
    id: 'random-text-generator',
    title: "Random Text & String Generator — Custom Alphanumeric Strings Online",
    navTitle: "Random Text",
    description: "Generate cryptographically random strings, alphanumeric keys, and dummy text online. Customize string length, character sets, and count in your browser.",
    icon: '🎲',
    path: '/random-text-generator.html',
    filename: 'random-text-generator.html',
    category: '✍️ Text & Writing Tools',
    badge: 'Generator',
    features: [
      "Generates Cryptographically Secure Random Strings & Tokens",
      "Configurable Character Sets (Uppercase, Lowercase, Numbers, Symbols)",
      "Custom Character Length Slider (1 to 1,000+ Characters)",
      "Generate Multiple Unique Strings Simultaneously (1 to 100 Keys)",
      "Exclude Confusing Characters Option (e.g. 0, O, 1, l, I)",
      "Powered by Web Crypto API for High-Entropy Randomness"
    ],
    howTo: [
      { title: "Choose String Length and Quantity", desc: "Select desired string length (e.g. 16 or 32 characters) and how many strings to generate." },
      { title: "Select Character Sets", desc: "Check boxes for uppercase, lowercase, numbers, or symbols, or define a custom character set." },
      { title: "Generate and Copy Strings", desc: "Click Generate to produce high-entropy strings and copy individual items or the full list." }
    ],
    faq: [
      { question: "How secure are the generated random strings?", answer: "The generator uses the browser’s native `window.crypto.getRandomValues()` API, which provides cryptographically secure pseudo-random numbers suitable for API tokens and temporary keys." },
      { question: "Can I generate strings without ambiguous characters like O, 0, I, and l?", answer: "Yes. You can toggle the \"Exclude Ambiguous Characters\" option to prevent visually similar characters that cause transcription errors." },
      { question: "Can I generate random strings using only numbers or only hex characters?", answer: "Yes. You can select only numbers for random numeric PINs, or define custom characters (like `0123456789abcdef` for hex hashes)." },
      { question: "Are generated strings or keys logged to a server?", answer: "No. Every string is generated on your local CPU and is never transmitted or logged." }
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
    title: "Video to Audio Extractor — Extract Audio from MP4 & WebM Videos Online",
    navTitle: "Video to Audio",
    description: "Extract high-quality audio tracks and speech from MP4 or WebM videos online. Convert video files to uncompressed WAV audio directly in your browser.",
    icon: '🎵',
    path: '/video-to-audio.html',
    filename: 'video-to-audio.html',
    category: '📹 Video Tools',
    badge: 'Extractor',
    features: [
      "Extracts Audio from MP4, WebM, MOV & MKV Video Files",
      "Pristine Uncompressed WAV Audio Output with Full Dynamic Range",
      "Browser Web Audio API Hardware-Accelerated Decoding",
      "No File Size Restrictions from External Cloud Queues",
      "Visual Audio Waveform & Playback Inspection",
      "100% Private Offline Processing Without Server Uploads"
    ],
    howTo: [
      { title: "Upload Your Video File", desc: "Select or drag any MP4, WebM, or MOV video into the audio extraction workspace." },
      { title: "Decode and Extract Audio Track", desc: "Click Extract Audio to decode the embedded audio stream locally in browser memory." },
      { title: "Listen to Preview and Download WAV", desc: "Play the extracted soundtrack in the built-in media player and download your crystal-clear audio file." }
    ],
    faq: [
      { question: "Which video formats can I extract sound from?", answer: "The tool supports all browser-decodable video formats including MP4 (H.264/AAC), WebM (VP8/VP9/Opus), and compatible MOV files." },
      { question: "What audio format does this tool produce?", answer: "It extracts and encodes audio into clean, uncompressed 16-bit PCM WAV audio, preserving full acoustic fidelity without lossy artifacts." },
      { question: "Can I extract background music or speech from phone camera recordings?", answer: "Yes. Simply drop your smartphone video clip into the tool to extract speeches, interviews, voice memos, or background tracks." },
      { question: "Is there a limit on how long the video can be?", answer: "Because decoding relies on your local computer memory, video clips up to several hundred megabytes process smoothly within seconds." },
      { question: "Are my private video files uploaded to a remote server?", answer: "No. The entire decoding pipeline executes locally via the Web Audio API and AudioContext, ensuring 100% confidentiality." }
    ]
  },
  {
    id: 'video-to-gif',
    title: "Video to GIF Converter — Create Animated GIFs from Video Clips",
    navTitle: "Video to GIF",
    description: "Convert video clips into smooth animated GIFs with custom trim times and frame rates. Adjust resolution scale and download GIFs with no server upload.",
    icon: '🎞️',
    path: '/video-to-gif.html',
    filename: 'video-to-gif.html',
    category: '📹 Video Tools',
    badge: 'Converter',
    features: [
      "Converts MP4, WebM & MOV Clips into High-Quality GIFs",
      "Precise Video Trimming with Start and End Timestamp Sliders",
      "Custom Frame Rate Controls (10 FPS, 15 FPS, 24 FPS)",
      "Resolution Scale Options (Original, 480p, 360p, 240p)",
      "Looping Options & Color Quantization Optimization",
      "In-Browser Canvas Frame Extraction with Zero Server Logging"
    ],
    howTo: [
      { title: "Load Video Clip", desc: "Upload an MP4 or WebM video file you want to turn into an animated looping GIF." },
      { title: "Trim Clip and Configure Frame Rate", desc: "Set start and end times to isolate the exact moment, then select your desired FPS and resolution scale." },
      { title: "Generate and Download GIF", desc: "Click Convert to GIF, watch the encoding progress, preview the looping animation, and download your GIF." }
    ],
    faq: [
      { question: "How do I select only a short portion of my video to make a GIF?", answer: "Use the interactive start and end trim sliders (or enter exact seconds) to isolate short, high-impact moments between 1 and 10 seconds." },
      { question: "How does frame rate (FPS) affect GIF file size?", answer: "Higher frame rates (24 FPS) provide ultra-smooth animation but increase file size, while 10 to 15 FPS offers a great balance of smoothness and compact file size." },
      { question: "Can I resize the GIF dimensions to reduce file size for Discord or Twitter?", answer: "Yes. You can scale resolution down to 480p or 360p, significantly shrinking GIF payload size for forums and social chats." },
      { question: "Will the created GIF loop continuously?", answer: "Yes. The generated GIF files are encoded with standard infinite loop flags so they play seamlessly on websites and messaging platforms." },
      { question: "Are my video clips uploaded to an external server to encode?", answer: "No. Video frame capture and palette quantization execute entirely inside your local browser via HTML5 Canvas." }
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

function simplifyBadge(badge?: string): 'New' | 'Free' | undefined {
  if (!badge) return undefined;
  const b = badge.trim();
  if (b === 'New') return 'New';
  if (b === 'Free' || b === 'Original' || b.includes('Free') || b.includes('Online')) return 'Free';
  return undefined;
}

export const TOOLS_DATA: ToolMeta[] = RAW_TOOLS_DATA.map(tool => {
  const { tags, trending, featured, editorsPick } = getToolTagsAndFlags(tool.id, tool.category);
  const cleanPath = getToolCanonicalPath(tool);
  return {
    ...tool,
    path: cleanPath,
    badge: simplifyBadge(tool.badge),
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
