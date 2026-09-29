import * as fs from 'fs';

interface HowToStep {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolUpdate {
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const IMAGE_TOOLS_DATA: Record<string, ToolUpdate> = {
  'image-splitter-merger': {
    howTo: [
      { title: 'Select Split or Combine Mode', desc: 'Choose whether you want to slice a single photo into two halves or merge two photos together.' },
      { title: 'Position the Cut or Join Seam', desc: 'In Split mode, select horizontal or vertical orientation and drag the divider guide to your cut line. In Combine mode, select side-by-side or stacked layout.' },
      { title: 'Download Processed Images', desc: 'Click Download to instantly save both separated image pieces or the single combined composite directly to your device.' }
    ],
    faq: [
      { question: 'Does splitting an image reduce visual quality?', answer: 'No. The image is rendered onto an HTML5 canvas at its full source dimensions, preserving original pixel resolution when exporting each half.' },
      { question: 'Can I split an image both horizontally and vertically at the same time?', answer: 'Currently, the tool slices along one axis per pass (vertical or horizontal). To create a four-quadrant split, download the two halves and run each half through horizontal split mode.' },
      { question: 'What does the auto-trim padding option do?', answer: 'Auto-trim scans the image perimeter and removes empty transparent or uniform border pixels before cutting, ensuring your split pieces align flush against each other.' },
      { question: 'What happens when combining images with different heights or widths?', answer: 'The tool scales the smaller image proportionally to match the matching dimension of the other image, preventing stretching or aspect ratio distortion.' },
      { question: 'Are my images uploaded to a server during splitting or combining?', answer: 'The image is processed locally in your browser using HTML5 Canvas and is not sent to a Zubware server for processing.' }
    ]
  },
  'background-remover': {
    howTo: [
      { title: 'Upload Photo', desc: 'Select or drag and drop a JPG, PNG, or WebP photo with a distinct foreground subject into the workspace.' },
      { title: 'Automatic AI Subject Isolation', desc: 'The client-side machine learning model analyzes the image and segments people, products, animals, or objects from the background.' },
      { title: 'Preview & Download Transparent PNG', desc: 'Use the comparison slider to inspect cutout edges, then download the resulting image as a transparent 32-bit PNG.' }
    ],
    faq: [
      { question: 'What types of photos yield the cleanest background removal?', answer: 'Images with sharp contrast between the subject and background, good lighting, and clear subject boundaries produce the highest quality cutouts.' },
      { question: 'Does the output file have a true transparent background?', answer: 'Yes. The result is exported as a 32-bit PNG with an alpha channel, so you can place it over any backdrop, presentation, or design mockup.' },
      { question: 'Why do fine hair strands or translucent fabrics sometimes show slight artifacts?', answer: 'Hair and semi-transparent fabrics blend background and foreground pixels. In high-frequency areas, automated segmentation may retain slight edge fringing.' },
      { question: 'What image formats and file size limits are supported?', answer: 'You can upload JPG, JPEG, PNG, and WebP images up to 20MB in size.' },
      { question: 'Is my photo sent to an external AI server for processing?', answer: 'The image is processed in your browser using a client-side WebAssembly neural model and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-compressor': {
    howTo: [
      { title: 'Add Images to Queue', desc: 'Drag and drop or select one or multiple JPG, PNG, or WebP images to compress.' },
      { title: 'Choose Compression Mode', desc: 'Select By Target Size (KB) to hit strict limits like 20KB or 50KB, or adjust the Quality or Percentage reduction sliders.' },
      { title: 'Compress and Export', desc: 'Review the before/after byte counts and savings percentage, then download individual files or the entire batch as a ZIP.' }
    ],
    faq: [
      { question: 'How does Target Size mode compress to an exact KB number?', answer: 'The compression engine runs an iterative binary search on encoding quality combined with progressive resolution downscaling until the encoded blob fits within your specified KB threshold.' },
      { question: 'Why do PNG files compress less than JPG files?', answer: 'PNG uses lossless DEFLATE compression to preserve crisp lines and transparent pixels, whereas JPG uses lossy discrete cosine transform compression that discards imperceptible color details.' },
      { question: 'Can I compress multiple photos at the same time?', answer: 'Yes. You can queue multiple images, apply a universal target size or quality level, and download all compressed files together in a ZIP package.' },
      { question: 'Does image compression remove EXIF camera metadata?', answer: 'Yes. Re-encoding the image through HTML5 Canvas strips embedded camera metadata, GPS tags, and device identifiers, further reducing file size.' },
      { question: 'Are my images uploaded to an external server for compression?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-converter': {
    howTo: [
      { title: 'Upload Source Files', desc: 'Add one or more images in formats like PNG, JPG, WebP, GIF, BMP, or SVG.' },
      { title: 'Select Target Output Format', desc: 'Choose a global target format such as WebP, JPG, or PNG, or specify different formats for individual queue items.' },
      { title: 'Convert and Download', desc: 'Click Convert to encode the files in your browser, then download each converted file or download all as a ZIP archive.' }
    ],
    faq: [
      { question: 'Which image formats can I convert between?', answer: 'The converter supports reading and exporting standard web image formats including JPG, PNG, WebP, GIF, BMP, and ICO.' },
      { question: 'What happens to transparency when converting a transparent PNG to JPG?', answer: 'Because the JPEG format does not support alpha transparency channels, transparent areas are automatically filled with a clean white background.' },
      { question: 'Does converting a JPG to PNG improve its image quality?', answer: 'No. Converting to PNG prevents further quality loss during future edits, but cannot restore detail already lost in original JPEG compression.' },
      { question: 'Why should I convert existing images to WebP?', answer: 'WebP provides 25% to 35% smaller file sizes than JPG and PNG at equivalent visual fidelity, speeding up website page loads.' },
      { question: 'Is any file sent across the internet during conversion?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-resizer': {
    howTo: [
      { title: 'Upload Your Image', desc: 'Select the image you want to resize from your computer or mobile device.' },
      { title: 'Set Target Dimensions or Scale', desc: 'Input custom pixel width and height with aspect ratio locked or unlocked, or scale by percentage.' },
      { title: 'Select Format and Download', desc: 'Pick your preferred export format (PNG, JPEG, WebP), adjust quality if needed, and click Download Resized Image.' }
    ],
    faq: [
      { question: 'How can I prevent my resized image from looking stretched or distorted?', answer: 'Keep the Lock Aspect Ratio toggle enabled. When you enter a new width, the corresponding height calculates automatically to maintain exact natural proportions.' },
      { question: 'What happens if I enlarge an image beyond its original resolution?', answer: 'Enlarging (upscaling) an image interpolates existing pixels, which can introduce blurriness or soft edges because the original file does not contain extra detail.' },
      { question: 'Can I resize by percentage instead of exact pixels?', answer: 'Yes. Switch to Percentage mode and use the scale slider (e.g., 50% for half size or 200% for double size) to scale both dimensions uniformly.' },
      { question: 'Which format should I select when saving my resized image?', answer: 'Choose PNG if your image contains text, sharp graphics, or transparency; choose JPG or WebP for photographs to keep file size compact.' },
      { question: 'Are my photos uploaded to a server to resize them?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'crop-image': {
    howTo: [
      { title: 'Upload Image', desc: 'Select or drop the photo you need to crop into the interactive canvas.' },
      { title: 'Adjust Crop Box or Select Aspect Preset', desc: 'Drag the handles to frame your subject, or pick a preset ratio such as 1:1 square, 16:9 widescreen, or 4:3 standard.' },
      { title: 'Crop and Download', desc: 'Optionally zoom or rotate the orientation, review the pixel dimensions of the crop selection, and download the cropped file.' }
    ],
    faq: [
      { question: 'Can I crop to specific social media ratios like Instagram or YouTube?', answer: 'Yes. The preset menu includes 1:1 (Instagram feed), 16:9 (YouTube thumbnails & widescreen), 4:3, 3:2, and freeform custom cropping.' },
      { question: 'Does cropping an image reduce its file size?', answer: 'Yes. Discarding pixels outside the crop boundary lowers overall pixel count, which typically results in a smaller saved file size.' },
      { question: 'Can I zoom and pan inside the crop frame before saving?', answer: 'Yes. You can use the zoom slider and pan controls to fine-tune your subject placement within the crop frame before exporting.' },
      { question: 'Does cropping a transparent PNG preserve its transparency?', answer: 'Yes. If you crop a PNG file and export in PNG format, the alpha transparency channel in the cropped region remains fully intact.' },
      { question: 'Is my cropped photo uploaded anywhere?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'rotate-image': {
    howTo: [
      { title: 'Upload Image Files', desc: 'Select single or multiple photos that need reorientation.' },
      { title: 'Choose Rotation Angle', desc: 'Click 90° Clockwise, 90° Counter-Clockwise, or 180° Flip, or use the custom degree slider for fine angles.' },
      { title: 'Download Rotated Output', desc: 'Preview the corrected orientation and download the rotated image or download the complete batch as a ZIP.' }
    ],
    faq: [
      { question: 'Why do photos taken on smartphones sometimes appear sideways?', answer: 'Smartphones store orientation in EXIF metadata tags. Some software ignores this tag, displaying the raw sensor orientation. Rotating here writes the correct physical pixel orientation.' },
      { question: 'Does rotating an image 90 degrees degrade visual quality?', answer: 'No. A 90°, 180°, or 270° rotation maps existing pixels to new coordinates without resampling or blurring the image content.' },
      { question: 'Can I straighten a crooked horizon with custom degree angles?', answer: 'Yes. The degree slider lets you rotate by arbitrary fine angles between -180° and +180° to level tilted horizon lines.' },
      { question: 'Can I rotate multiple photos in a single batch?', answer: 'Yes. You can upload several images at once, apply the rotation to the entire queue, and export them together in a ZIP file.' },
      { question: 'Are my rotated photos uploaded to a remote server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'flip-image': {
    howTo: [
      { title: 'Upload Your Photo', desc: 'Drag and drop or select the image you want to mirror or invert.' },
      { title: 'Choose Flip Axis', desc: 'Click Flip Horizontal to create a left-to-right mirror reflection, or Flip Vertical to turn the image upside-down.' },
      { title: 'Save Mirrored File', desc: 'Inspect the real-time canvas preview and click Download Flipped Image to save the result.' }
    ],
    faq: [
      { question: 'What is the difference between flipping and rotating an image?', answer: 'Rotating turns the image around a central pivot point, while flipping creates a mirror reflection across a horizontal or vertical axis.' },
      { question: 'Can I apply both horizontal and vertical flips simultaneously?', answer: 'Yes. Toggling both Horizontal and Vertical flips mirrors the image across both axes, equivalent to a 180-degree reflection.' },
      { question: 'Does flipping an image reverse embedded text?', answer: 'Yes. Horizontal mirroring reverses everything in the frame, making readable text appear backwards as if viewed in a physical mirror.' },
      { question: 'Does flipping change image resolution or pixel dimensions?', answer: 'No. Flipping inverts coordinate indices along the chosen axis, preserving original pixel dimensions and resolution.' },
      { question: 'Are my images uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-watermark': {
    howTo: [
      { title: 'Upload Base Photo', desc: 'Select the photograph or graphic you want to brand and protect.' },
      { title: 'Configure Watermark Text or Logo', desc: 'Choose text or image watermark, customize font styling, color, opacity, rotation angle, and canvas placement.' },
      { title: 'Apply and Download', desc: 'Review the live watermarked preview on the canvas and click Download Watermarked Image.' }
    ],
    faq: [
      { question: 'Can I use a transparent PNG as an image watermark logo?', answer: 'Yes. Uploading a PNG logo with transparency allows your graphic or emblem to overlay cleanly onto photos without a solid rectangular background.' },
      { question: 'What does the Tile Repeat pattern do?', answer: 'The Tile option repeats your watermark across the entire image at regular intervals, preventing unauthorized cropping of corner marks.' },
      { question: 'How transparent should a protective watermark be?', answer: 'An opacity between 25% and 40% usually offers effective copyright protection while keeping the underlying photo content clearly visible.' },
      { question: 'Can I customize the watermark font, color, and drop shadow?', answer: 'Yes. You can select font families, change text color, add a subtle drop shadow for legibility over bright backgrounds, and rotate the mark.' },
      { question: 'Are my watermarked photos sent to a server for processing?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'blur-image': {
    howTo: [
      { title: 'Upload Image', desc: 'Select the photo containing elements or personal details you wish to blur.' },
      { title: 'Select Blur Mode and Strength', desc: 'Choose Entire Image to soften the full background, or Selective Brush to blur specific regions like faces or license plates.' },
      { title: 'Brush and Export', desc: 'Adjust brush radius, paint directly over confidential areas with undo/redo support, and download the blurred image.' }
    ],
    faq: [
      { question: 'Can someone reverse or unblur an area blurred with this tool?', answer: 'No. Blurring mathematically averages neighboring pixel color values on the canvas. The original high-frequency detail is permanently replaced before saving.' },
      { question: 'How do I blur out faces, license plates, or credit card numbers?', answer: 'Select the Selective Brush mode, set your preferred brush size and blur strength, and paint directly over the sensitive regions you want obscured.' },
      { question: 'Can I undo accidental brush strokes?', answer: 'Yes. The tool maintains an interactive history stack with Undo and Redo controls so you can step backward if you paint outside the target boundary.' },
      { question: 'What is full background blur used for?', answer: 'Full background blurring is commonly used to create soft aesthetic backdrops for presentations, social media banners, or portrait depth effects.' },
      { question: 'Is my blurred image uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'pixelate-image': {
    howTo: [
      { title: 'Upload Photo', desc: 'Select the image you want to censor or transform into pixel art.' },
      { title: 'Set Pixel Block Size', desc: 'Use the pixel size slider to determine coarseness, from subtle mosaic softening to heavy censorship blocks.' },
      { title: 'Apply and Download', desc: 'Click Pixelate Entire Image for retro effects or use the brush tool to redact specific areas, then download your output.' }
    ],
    faq: [
      { question: 'Is pixelation secure for redacting sensitive passwords or IDs?', answer: 'Yes, provided a sufficiently large pixel block size is used. Larger blocks average hundreds of pixels into uniform color squares, eliminating character shapes.' },
      { question: 'What is the difference between blurring and pixelating?', answer: 'Blurring applies a smooth Gaussian gradient that softens edges, while pixelation divides the image into a rigid grid of solid-color square mosaic tiles.' },
      { question: 'Can I pixelate only a portion of the photo?', answer: 'Yes. Use the brush tool to paint mosaic blocks specifically over sensitive information while leaving the rest of the image in full sharpness.' },
      { question: 'Can I create full 8-bit retro video game style graphics?', answer: 'Yes. Clicking Pixelate Entire Image with an 8px to 16px block size transforms standard photographs into nostalgic pixel art.' },
      { question: 'Are my images uploaded to any server during pixelation?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'exif-remover': {
    howTo: [
      { title: 'Select Photos', desc: 'Upload one or multiple camera or smartphone images containing embedded metadata.' },
      { title: 'Inspect Detected Metadata', desc: 'Review identified EXIF tags including camera make, shutter speed, date/time, and GPS coordinates.' },
      { title: 'Strip EXIF and Download', desc: 'Click to sanitize your photos, removing all tracking metadata, and download the cleaned files or a ZIP bundle.' }
    ],
    faq: [
      { question: 'What private information is stored in photo EXIF data?', answer: 'EXIF metadata commonly contains exact GPS latitude and longitude coordinates, capture timestamps, camera/phone serial numbers, and device settings.' },
      { question: 'Does stripping EXIF data reduce the visual quality of my photo?', answer: 'No. EXIF data is non-visual header metadata. Removing it strips hidden tags without altering pixel resolution or image clarity.' },
      { question: 'Why should I remove EXIF data before uploading photos online?', answer: 'Removing EXIF protects your privacy by preventing strangers or scrapers from discovering where you live, work, or took the photograph.' },
      { question: 'Can I sanitize multiple photos at once?', answer: 'Yes. You can upload batches of photos, strip metadata from all files in one operation, and download them together in a ZIP file.' },
      { question: 'Are my photos uploaded to a server to clean metadata?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-color-picker': {
    howTo: [
      { title: 'Upload Image', desc: 'Select any photo, design screenshot, or graphic from which you need color codes.' },
      { title: 'Hover and Sample Pixels', desc: 'Move your cursor across the canvas with the 9x magnifying loupe and click on any pixel to lock its color.' },
      { title: 'Copy Color Formats', desc: 'View instant readouts in HEX, RGB, HSL, and HSV formats, and click any copy button or view your recent palette.' }
    ],
    faq: [
      { question: 'How accurate is the pixel color selection?', answer: 'The color picker uses a 9x real-time magnifying loupe that highlights single individual pixels, ensuring you sample the exact intended color.' },
      { question: 'Which color code formats can I copy?', answer: 'You can copy HEX (#RRGGBB), RGB (rgb(r, g, b)), HSL (hsl(h, s, l)), and HSV color values directly to your clipboard.' },
      { question: 'Does the tool save my previously picked colors?', answer: 'Yes. Each clicked color is automatically added to a recent color history palette below the canvas for easy side-by-side comparison.' },
      { question: 'Can I sample colors from photos taken in different lighting conditions?', answer: 'Yes. Keep in mind that shadows and gradients cause slight color variations across surfaces, so use the loupe to sample neutral, well-lit areas.' },
      { question: 'Is my uploaded screenshot or image sent to a server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-info-viewer': {
    howTo: [
      { title: 'Upload Image File', desc: 'Select or drag any image file into the viewer.' },
      { title: 'Review Technical Specifications', desc: 'Examine detailed metrics including width, height, megapixel count, file size, MIME type, and aspect ratio.' },
      { title: 'Inspect Camera EXIF & Print Sizing', desc: 'Check shooting parameters (ISO, aperture, exposure), calculate physical print dimensions at 300 DPI, and copy report data.' }
    ],
    faq: [
      { question: 'What technical specifications can I inspect with this tool?', answer: 'You can view exact pixel dimensions, aspect ratio, file size in KB/MB, MIME type, bit depth, megapixels, and print size at 300 DPI.' },
      { question: 'How is the print size at 300 DPI calculated?', answer: 'Print dimensions are derived by dividing pixel width and height by 300, showing the maximum print size in inches or centimeters without quality loss.' },
      { question: 'Can I view camera shooting data like ISO and aperture?', answer: 'Yes. If the uploaded image retains EXIF metadata, camera brand, model, lens focal length, f-stop, shutter speed, and ISO are parsed and displayed.' },
      { question: 'Why does my image show no camera EXIF data?', answer: 'Images downloaded from messaging apps, social networks, or edited in web software often have EXIF metadata stripped automatically by those platforms.' },
      { question: 'Are my image files uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'background-color-changer': {
    howTo: [
      { title: 'Upload Cutout or Transparent Photo', desc: 'Select a PNG or WebP image with a transparent background, or a photo with a solid background to key out.' },
      { title: 'Select Background Fill Style', desc: 'Choose a solid color using the color picker or define a linear gradient with start/end colors and angle.' },
      { title: 'Export Finished Composite', desc: 'Preview the updated background and download your new image in PNG, JPG, or WebP format.' }
    ],
    faq: [
      { question: 'Can I replace the background on an image that already has transparent cutouts?', answer: 'Yes. Transparent regions are immediately replaced with your selected solid color or gradient fill.' },
      { question: 'Can this tool replace a solid white or green backdrop?', answer: 'Yes. Use Key Color mode, sample the backdrop color with the eyedropper, and adjust the tolerance slider to replace that background.' },
      { question: 'What is the difference between solid color and gradient backgrounds?', answer: 'Solid mode applies a single uniform color, while gradient mode blends two chosen colors across an adjustable angle (such as 45° or 90°).' },
      { question: 'Which format should I choose when saving the new background?', answer: 'Choose JPG or WebP for smaller file sizes when the new background is opaque, or PNG if you need lossless graphic clarity.' },
      { question: 'Are my pictures uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'rounded-corners': {
    howTo: [
      { title: 'Upload Image', desc: 'Select the photo or banner you want to soften with rounded corners.' },
      { title: 'Configure Corner Radii', desc: 'Adjust the master radius slider for all four corners, or unlock individual corner sliders (top-left, top-right, etc.).' },
      { title: 'Set Background & Download', desc: 'Choose a transparent background (PNG) or solid fill color, preview the curved corners, and download.' }
    ],
    faq: [
      { question: 'How do I make sure the corners remain transparent after downloading?', answer: 'Select the Transparent Background option and export in PNG format. JPG does not support transparency and will fill corners with white.' },
      { question: 'Can I create a circular profile picture or avatar?', answer: 'Yes. Enable Circle Avatar mode to crop square photos into a circle with rounded perimeter.' },
      { question: 'Can I round only specific corners, like top corners for a card UI?', answer: 'Yes. Unlock the individual corner controls to set custom pixel radii for top-left, top-right, bottom-right, and bottom-left independently.' },
      { question: 'Does rounding corners change the dimensions of my photo?', answer: 'No. The image maintains its original width and height; only the outer corner pixels outside the radius boundary are clipped.' },
      { question: 'Are my photos uploaded to a server to apply rounded corners?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-border': {
    howTo: [
      { title: 'Upload Photo', desc: 'Select the image you want to outline or frame.' },
      { title: 'Customize Border Settings', desc: 'Set border width in pixels, choose border color, select border style (solid, dashed, dotted, double), and adjust corner radius.' },
      { title: 'Download Bordered Image', desc: 'Choose whether the border extends outward or overlays inward, preview the design, and download your bordered image.' }
    ],
    faq: [
      { question: 'What is the difference between inner and outer border placement?', answer: 'An outer border expands the canvas dimensions to frame the image on the outside, while an inner border draws over the outer edges without altering original dimensions.' },
      { question: 'Which border styles can I apply?', answer: 'You can choose between solid lines, dashed outlines, dotted borders, and double borders, with custom thickness and color.' },
      { question: 'Can I combine rounded corners with an image border?', answer: 'Yes. Adjusting the border radius slider curves both the border and the photo corners together for a modern UI card appearance.' },
      { question: 'What export formats are supported for bordered photos?', answer: 'You can export your bordered photo in PNG, JPG, or WebP formats at full resolution.' },
      { question: 'Is my photo uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-frame': {
    howTo: [
      { title: 'Upload Photo', desc: 'Select the picture you want to place inside a decorative frame.' },
      { title: 'Select Frame Style & Add Caption', desc: 'Choose from Polaroid, Gallery Wood, Soft Shadow, Neon Glow, or Minimalist frames, and optionally add caption text.' },
      { title: 'Download Framed Photo', desc: 'Preview the framed composition and download high-resolution PNG or JPG files.' }
    ],
    faq: [
      { question: 'Can I create authentic Polaroid-style prints with handwritten captions?', answer: 'Yes. Select the Polaroid preset to generate the classic wide bottom border and type your personalized caption.' },
      { question: 'Which framing styles are available?', answer: 'Presets include Classic Gallery White, Dark Museum, Polaroid print, Floating Drop Shadow, Frosted Acrylic, and Vibrant Neon glow.' },
      { question: 'Does adding a frame reduce the resolution of the original photo?', answer: 'No. The frame expands the outer canvas boundaries to accommodate border margins while preserving your photo at original resolution.' },
      { question: 'Can I customize caption text size and styling?', answer: 'Yes. You can edit the caption string, select from multiple typography options, and preview the final framed layout before downloading.' },
      { question: 'Are my framed photos sent to any server for rendering?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-collage': {
    howTo: [
      { title: 'Upload Multiple Photos', desc: 'Select 2 to 6 images from your device to include in the collage.' },
      { title: 'Choose Grid Layout & Spacing', desc: 'Select a layout preset (such as 2x2 grid, side-by-side, or vertical stack) and adjust cell gap, border radius, and background color.' },
      { title: 'Download Finished Collage', desc: 'Preview the assembled grid and download your combined photo collage in high-resolution PNG or JPG.' }
    ],
    faq: [
      { question: 'How are images with different aspect ratios fitted into collage cells?', answer: 'Images are scaled and center-cropped to fill each grid cell proportionately, ensuring a balanced, aligned collage layout.' },
      { question: 'Can I adjust the gap between photos and the outer border?', answer: 'Yes. The gap slider controls the spacing between photos, and you can customize the background color shown in the gaps.' },
      { question: 'Can I reorder or delete photos in the collage?', answer: 'Yes. You can remove individual photos or replace images in specific cells before rendering the final collage.' },
      { question: 'How many photos can I include in a single collage?', answer: 'The tool supports 2 to 6 photos across versatile grid templates including dual side-by-side, 3-column banners, and 4-picture 2x2 grids.' },
      { question: 'Are my collage photos uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'favicon-generator': {
    howTo: [
      { title: 'Upload Square Icon or Logo', desc: 'Select a high-resolution square graphic (512x512 PNG recommended) for your website favicon.' },
      { title: 'Review Generated Sizes', desc: 'Inspect the automatically generated icon sizes including 16x16, 32x32, 48x48, 180x180 Apple Touch, and 192x192 Android.' },
      { title: 'Download ZIP & Copy HTML', desc: 'Download the complete icon package as a ZIP archive and copy the ready-to-paste HTML <link> tags for your website header.' }
    ],
    faq: [
      { question: 'What file formats and sizes are included in the generated ZIP?', answer: 'The bundle includes standard 16x16 and 32x32 favicons, a 48x48 icon, a 180x180 Apple Touch Icon, and a 192x192 Android Chrome icon.' },
      { question: 'Why does my website need multiple favicon sizes?', answer: 'Different platforms require specific resolutions: browser tabs use 16x16, bookmarks use 32x32, iPhones use 180x180, and Android home screens use 192x192.' },
      { question: 'How do I add the generated favicons to my website?', answer: 'Unzip the files into your website root directory, copy the provided <link> meta tags, and paste them inside your HTML <head> section.' },
      { question: 'What is the best source image to upload for favicon generation?', answer: 'A high-contrast square PNG with a transparent background, at least 512x512 pixels, provides the sharpest downsampled icons across all sizes.' },
      { question: 'Are my brand logos uploaded to a server to generate icons?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'svg-optimizer': {
    howTo: [
      { title: 'Paste SVG Code or Upload File', desc: 'Upload an .svg vector file or paste raw SVG markup directly into the editor.' },
      { title: 'Review Minification Savings', desc: 'The optimizer automatically strips XML doctypes, editor metadata, comments, and empty groups, displaying byte reductions.' },
      { title: 'Copy Minified Code or Download', desc: 'Copy the clean SVG code to your clipboard for inline HTML use or download the optimized .svg file.' }
    ],
    faq: [
      { question: 'How does SVG optimization reduce file size without altering graphics?', answer: 'Vector editors like Illustrator and Figma export unnecessary XML headers, editor namespaces, comments, and extra precision decimals. Removing them shrinks file size without changing visual paths.' },
      { question: 'Can I use the optimized SVG directly inline in HTML or React?', answer: 'Yes. The cleaned markup is sanitized and formatted for direct copy-pasting into HTML files, JSX components, or CSS background-image properties.' },
      { question: 'Does optimizing an SVG strip IDs and classes needed for styling?', answer: 'Redundant and empty attributes are removed, but functional path data, viewBox attributes, and necessary visual coordinates are preserved.' },
      { question: 'What file size reduction can I expect?', answer: 'SVGs exported from graphic design software often see file size reductions of 20% to 60%, depending on the volume of embedded metadata.' },
      { question: 'Is my SVG code or vector file uploaded to a server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'gif-maker': {
    howTo: [
      { title: 'Upload Animation Frames', desc: 'Select or drag multiple sequential photos or illustrations into the frame timeline.' },
      { title: 'Configure Speed & Direction', desc: 'Adjust frame delay (milliseconds per frame), set playback direction (Forward, Reverse, Ping-Pong), and preview the animation.' },
      { title: 'Generate and Download GIF', desc: 'Click Download Animated .GIF to compile and save your animated GIF file directly from your browser.' }
    ],
    faq: [
      { question: 'What frame delay setting produces a smooth animated GIF?', answer: 'A delay between 80ms and 150ms per frame (roughly 7 to 12 frames per second) produces natural animation for photo sequences and stop-motion.' },
      { question: 'What does the Ping-Pong playback mode do?', answer: 'Ping-Pong plays the frames from first to last, then plays them in reverse back to the start, creating an endless, seamless bounce loop.' },
      { question: 'Can I reorder or delete specific frames before generating the GIF?', answer: 'Yes. You can remove individual frames or rearrange their sequence in the timeline before compiling the animation.' },
      { question: 'How do I keep my animated GIF file size manageable?', answer: 'To keep file size compact, limit the total number of frames, use consistent canvas dimensions, and avoid unnecessary high-resolution source images.' },
      { question: 'Are my image frames uploaded to a server to compile the GIF?', answer: 'The image is processed in your browser using a client-side GIF encoder and is not sent to a Zubware server for processing.' }
    ]
  },
  'batch-image-converter': {
    howTo: [
      { title: 'Add Images to Batch Queue', desc: 'Drag and drop multiple images in JPG, PNG, WebP, GIF, or BMP formats into the converter.' },
      { title: 'Select Output Format & Quality', desc: 'Choose a target format (PNG, JPG, or WebP) for the entire batch and adjust the quality slider.' },
      { title: 'Convert and Download ZIP', desc: 'Process all images concurrently in your browser and download individual files or the entire batch as a ZIP.' }
    ],
    faq: [
      { question: 'How many images can I convert at the same time?', answer: 'You can convert dozens of images simultaneously. Because processing executes locally in your browser memory, performance depends on your device RAM.' },
      { question: 'Can I mix different input formats in the same batch queue?', answer: 'Yes. You can upload a mixture of JPG, PNG, and WebP files together and convert them all into a unified target format.' },
      { question: 'What happens to transparent backgrounds when batch converting to JPG?', answer: 'Since JPG does not support transparency, transparent areas in PNG or WebP files are automatically rendered with a clean white background.' },
      { question: 'Can I download all converted images in a single archive?', answer: 'Yes. Click Download All as ZIP to export every converted file in an organized ZIP package with one click.' }
      ,{ question: 'Are my batch photos sent to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'compression-comparison': {
    howTo: [
      { title: 'Upload Test Image', desc: 'Select any high-resolution photo to test compression behavior.' },
      { title: 'Adjust Quality and Encoding Format', desc: 'Use the quality slider and switch between JPEG and WebP to see real-time file size reductions.' },
      { title: 'Compare Split-Screen and Zoom', desc: 'Drag the split-screen divider and toggle 2x/4x zoom to inspect pixel sharpness, compression artifacts, and byte savings.' }
    ],
    faq: [
      { question: 'How does the interactive split slider help find the optimal compression level?', answer: 'The split slider shows the uncompressed original on the left and the compressed output on the right, letting you sweep across fine details to spot where artifacts start.' },
      { question: 'What visual artifacts should I watch for when compressing images?', answer: 'Look for blockiness in solid color areas (macroblocking), halo ringing around high-contrast edges, and banding across smooth sky or wall gradients.' },
      { question: 'How does WebP compare to JPEG at identical quality settings?', answer: 'WebP typically produces 25% to 35% smaller file sizes than JPEG at the same visual fidelity, while preserving better edge sharpness.' },
      { question: 'Can I zoom in to inspect fine textures and text?', answer: 'Yes. Activate Zoom mode to inspect high-frequency textures like grass, foliage, and text rendering at magnified scale.' },
      { question: 'Is my test image uploaded to a server for comparison?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'heic-to-jpg': {
    howTo: [
      { title: 'Upload iPhone HEIC Photos', desc: 'Select or drag Apple HEIC or HEIF images from your iPhone or iPad.' },
      { title: 'Configure Quality and Dimensions', desc: 'Adjust JPG quality, select target dimensions (Original, 4K, 1080p), and choose whether to strip metadata.' },
      { title: 'Convert and Download', desc: 'Convert the files locally in your browser and download individual JPGs or all files in a ZIP archive.' }
    ],
    faq: [
      { question: 'Why can some Windows computers and Android phones not open HEIC files?', answer: 'HEIC (High Efficiency Image Coding) is Apple default image container. Many non-Apple applications and web forms require standard JPEG format for compatibility.' },
      { question: 'Does converting HEIC to JPG reduce photo clarity?', answer: 'Converting to JPG at 90% or higher quality retains excellent visual fidelity indistinguishable from the original HEIC capture.' },
      { question: 'Can I batch convert multiple HEIC photos at once?', answer: 'Yes. You can upload multiple HEIC photos, convert them in sequence, and download all resulting JPGs packaged in a single ZIP.' },
      { question: 'Can I resize the photo dimensions during conversion?', answer: 'Yes. You can keep original dimensions or downscale to standard presets like 4K or 1080p Full HD to reduce file size.' },
      { question: 'Are my private iPhone photos uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'bulk-image-renamer-resizer': {
    howTo: [
      { title: 'Upload Photo Batch', desc: 'Drag a folder or selection of image files into the batch processing queue.' },
      { title: 'Configure Renaming and Resizing Rules', desc: 'Set prefix, sequence numbering, casing rules, target dimensions, and format preferences.' },
      { title: 'Download Renamed & Resized ZIP', desc: 'Preview the new filenames and dimensions in the table, then download the complete organized archive.' }
    ],
    faq: [
      { question: 'What renaming patterns can I create for my images?', answer: 'You can combine a base name, prefix, suffix, incremental numbering sequence (with zero-padding like 001, 002), and text find-and-replace rules.' },
      { question: 'How does fit mode handle images with different aspect ratios?', answer: 'Fit modes include "contain" (scales to fit without cropping), "cover" (fills exact dimensions by cropping excess), and "stretch" (forces exact dimensions).' },
      { question: 'Can I clean up spaces and special characters for web-friendly filenames?', answer: 'Yes. You can replace spaces with hyphens or underscores and strip non-alphanumeric characters to generate SEO- and web-safe filenames.' },
      { question: 'Can I convert image formats while renaming and resizing?', answer: 'Yes. You can simultaneously convert all files to JPG, PNG, or WebP with custom quality compression settings.' },
      { question: 'Are my batch photos sent to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'passport-photo-maker': {
    howTo: [
      { title: 'Upload Front-Facing Portrait', desc: 'Select a sharp, well-lit photo of your face taken directly in front of the camera.' },
      { title: 'Select Country Profile & Position Face', desc: 'Choose your document preset (e.g. US 2x2 in, Schengen 35x45 mm, India 3.5x4.5 cm) and align your eyes and head with the biometric guide.' },
      { title: 'Configure Sheet & Download', desc: 'Select background color (white or off-white), set up a 4x6 in or A4 printable sheet with crop marks, and download as JPG or PDF.' }
    ],
    faq: [
      { question: 'What are the official biometric photo guidelines for passport applications?', answer: 'Official guidelines require a straight front-facing pose, neutral facial expression with mouth closed, both eyes open and clearly visible, and even lighting without harsh facial shadows.' },
      { question: 'Can I print multiple passport photos on standard 4x6 inch photo paper?', answer: 'Yes. The tool arranges multiple passport photos with optional cutting crop marks onto 4x6 inch, 5x7 inch, or A4 sheets ready for home printing or pharmacy photo kiosks.' },
      { question: 'What are the standard dimensions for US and Schengen visa photos?', answer: 'US passport photos require 2x2 inches (51x51 mm) at 300 DPI (600x600 px). Schengen and UK passports require 35x45 mm with the head measuring between 32 and 36 mm.' },
      { question: 'Can I adjust lighting and change background color?', answer: 'Yes. You can fine-tune brightness, contrast, and warmth, and select standard plain white, off-white, light blue, or light grey backdrops.' },
      { question: 'Are my sensitive passport photos uploaded to any server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'signature-maker': {
    howTo: [
      { title: 'Choose Mode', desc: 'Select Draw to sign with your finger, mouse, or stylus, Type to generate cursive signatures, or Upload to clean a paper scan.' },
      { title: 'Customize Pen and Background', desc: 'Select ink color (black, blue), line thickness, enable smooth stroke rendering, and toggle a transparent background with auto-trim.' },
      { title: 'Download Clean Signature', desc: 'Click Download PNG to save your transparent signature ready to sign PDFs, contracts, and digital documents.' }
    ],
    faq: [
      { question: 'How do I download a signature with a transparent background?', answer: 'Keep the Transparent background option selected and download in PNG format. The resulting file can be pasted onto any PDF or Word document without a white box.' },
      { question: 'What does the auto-trim padding feature do?', answer: 'Auto-trim eliminates empty margin whitespace around your drawn signature, cropping the canvas tight to your signature strokes for easy placement.' },
      { question: 'Can I draw my signature on a mobile phone or tablet?', answer: 'Yes. The drawing canvas supports smooth touch input on smartphones, tablets, iPads, and stylus pens with responsive pressure stroke interpolation.' },
      { question: 'Can I clean up a photo of a signature signed on paper?', answer: 'Yes. Switch to Upload mode, select your scanned paper signature, and adjust the threshold slider to isolate the dark ink strokes onto a clean transparent background.' },
      { question: 'Is my digital signature stored or sent to a server?', answer: 'The signature is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'signature-resizer': {
    howTo: [
      { title: 'Upload Signature Image', desc: 'Select your scanned or digital signature file.' },
      { title: 'Set Target Dimensions and File Size Limit', desc: 'Enter the exact pixel dimensions (or mm/cm) and maximum KB file size required by your recruitment or exam portal.' },
      { title: 'Trim and Download', desc: 'Enable auto-crop margins to remove empty border whitespace, verify the output file size, and download your resized signature.' }
    ],
    faq: [
      { question: 'How do I resize my signature to under 20KB or 50KB for exam portals?', answer: 'Set the Max File Size limit to your required number (e.g., 20KB). The tool iteratively adjusts encoding compression to ensure the exported file does not exceed that limit.' },
      { question: 'What are the standard signature dimensions for government job applications?', answer: 'Many portals (like SSC, UPSC, IBPS) specify dimensions like 140x60 pixels, 3.5x1.5 cm, with file sizes strictly between 10KB and 20KB.' },
      { question: 'Will resizing blur or distort my signature strokes?', answer: 'Keeping the aspect ratio locked prevents stretching, and the contrast enhancement engine sharpens ink strokes during downsampling for legible lines.' },
      { question: 'Can I set dimensions in centimeters or millimeters instead of pixels?', answer: 'Yes. Use the units dropdown to switch between pixels (px), centimeters (cm), millimeters (mm), and inches (in).' },
      { question: 'Is my signature uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'photo-signature-joiner': {
    howTo: [
      { title: 'Upload Photo & Signature', desc: 'Upload your passport portrait in slot 1 and your signature image in slot 2.' },
      { title: 'Configure Stacked Layout & Spacing', desc: 'Set vertical stacked layout (photo top, signature bottom), adjust width, height, and border padding according to portal guidelines.' },
      { title: 'Download Composite Image', desc: 'Inspect the unified composite preview and click Download Composite in JPG or PNG format.' }
    ],
    faq: [
      { question: 'Why do recruitment and exam portals require photo and signature combined in one file?', answer: 'Exam boards require a unified composite file to prevent photo/signature mismatches on admit cards, hall tickets, and verification databases.' },
      { question: 'Can I adjust the gap and border between the photo and signature?', answer: 'Yes. You can customize the separation gap, outer border width, border color, and background fill to match portal specifications.' },
      { question: 'How can I ensure the photo and signature do not look stretched?', answer: 'The tool provides independent width and height controls for both images, allowing you to match exact official proportions without distortion.' },
      { question: 'Which format is best for official exam form uploads?', answer: 'Most recruitment portals require JPG/JPEG format with white background fill. Select JPG output before downloading.' },
      { question: 'Are my personal identification photos uploaded to a server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'photo-name-date-joiner': {
    howTo: [
      { title: 'Upload Passport Photo', desc: 'Select your standard passport-sized portrait photograph.' },
      { title: 'Enter Candidate Name & Date', desc: 'Type your full name, input the date of photo (DOP) or date of birth (DOB), and pick your required date format.' },
      { title: 'Format Strip and Download', desc: 'Adjust the bottom white strip height, select font styling, preview the compliant exam photo, and click Download Form Photo.' }
    ],
    faq: [
      { question: 'What is the difference between DOP and DOB on candidate photos?', answer: 'DOP stands for Date of Photo (the date the picture was captured, often required to be within the last 3 months). DOB stands for Date of Birth.' },
      { question: 'Which date formats are supported for the photo footer?', answer: 'You can choose between DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, and DD-MMM-YYYY (e.g. 15-OCT-2024).' },
      { question: 'Does adding the name and date strip crop the candidate face?', answer: 'No. The white label strip is positioned neatly along the bottom margin. You can adjust the strip height percentage to ensure your face remains fully visible.' },
      { question: 'Can I add a prefix like "DOP:" or "DOB:" before the date?', answer: 'Yes. The prefix selector allows you to include "DOP:", "DOB:", "Date:", or no prefix according to your specific exam notification.' },
      { question: 'Are my application photos uploaded to an external server?', answer: 'The image is processed in your browser and is not sent to a Zubware server for processing.' }
    ]
  },
  'text-to-handwriting': {
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
  'handwriting-to-text': {
    howTo: [
      { title: 'Upload Photo or Draw Notes', desc: 'Upload a picture of handwritten notes, or write directly onto the interactive digital canvas.' },
      { title: 'Enhance Stroke Contrast', desc: 'Adjust the contrast boost slider to sharpen faint ink and pencil strokes, improving recognition accuracy.' },
      { title: 'Extract Text and Copy', desc: 'Click Extract Text to run client-side OCR, review the transcribed text in the editor, and copy or download as TXT.' }
    ],
    faq: [
      { question: 'What types of handwriting produce the most accurate OCR results?', answer: 'Neat, consistent handwriting with separated printed characters or clear cursive letters on clean, unlined or lightly lined paper produces the highest accuracy.' },
      { question: 'How does the contrast boost slider improve OCR accuracy?', answer: 'Contrast enhancement darkens pencil and ink lines while brightening background paper, helping the OCR engine distinguish letter boundaries from paper texture.' },
      { question: 'Can I edit the recognized text before saving?', answer: 'Yes. The transcribed text appears in an editable text box so you can quickly correct any misread words before copying or saving.' },
      { question: 'Can I write directly on the screen using a touchscreen or stylus?', answer: 'Yes. Switch to Draw mode to handwrite notes or equations directly on the canvas using your finger, stylus, or mouse.' },
      { question: 'Is my personal handwriting or notebook photo sent to an external server?', answer: 'The image is processed locally in your browser using the client-side Tesseract.js OCR engine and is not sent to a Zubware server for processing.' }
    ]
  },
  'image-to-text': {
    howTo: [
      { title: 'Upload Document or Photo', desc: 'Select an image, screenshot, document scan, or book page containing printed text.' },
      { title: 'Select Recognition Language', desc: 'Choose your document language (English, Spanish, French, German, Hindi, etc.) to load the optimized language model.' },
      { title: 'Extract, Edit and Export Text', desc: 'Click Extract Text to process with browser-side OCR, review the confidence score, and copy or download the text as a TXT file.' }
    ],
    faq: [
      { question: 'Which languages are supported for OCR text extraction?', answer: 'The OCR engine supports over 11 major languages including English, Spanish, French, German, Hindi, Portuguese, Italian, Chinese, and Arabic.' },
      { question: 'What image quality is recommended for high OCR accuracy?', answer: 'Crisp, high-contrast images with at least 150 to 300 DPI, even lighting, and horizontal text alignment achieve the most reliable transcription.' },
      { question: 'Can I extract text from screenshots and scanned receipts?', answer: 'Yes. The OCR engine reads receipts, book pages, business cards, signs, and software screenshots.' },
      { question: 'What does the OCR confidence score indicate?', answer: 'The confidence score represents the statistical probability of character recognition accuracy across all detected words in the image.' },
      { question: 'Are my confidential document photos uploaded to an external server?', answer: 'The image is processed locally in your browser using Tesseract.js WebAssembly and is not sent to a Zubware server for processing.' }
    ]
  }
};
