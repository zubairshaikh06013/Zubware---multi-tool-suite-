import { BlogArticle } from '../../src/types';

export const CLUSTER2_IMAGE_ARTICLES: BlogArticle[] = [
  // 2. client-side-image-optimization-guide
  {
    slug: 'client-side-image-optimization-guide',
    title: 'Client-Side Image Optimization: WebP, Compression & Quality Preservation',
    metaTitle: 'Client-Side Image Optimization: WebP, Compression & Quality — Zubware',
    description: 'Master in-browser image optimization. Compare WebP, AVIF, JPG, and PNG compression algorithms, canvas downsampling math, and client-side privacy benefits.',
    canonicalPath: '/blog/client-side-image-optimization-guide',
    publishedTime: '2026-09-23T00:00:00Z',
    modifiedTime: '2026-10-09T00:00:00Z',
    author: {
      name: 'Zubware Media Engineering Team',
      url: 'https://www.zubware.com/about',
      role: 'Computer Vision & Browser Media Engineering'
    },
    publisher: {
      name: 'Zubware',
      url: 'https://www.zubware.com'
    },
    category: 'Image Guides',
    readingTime: '8 min read',
    tags: [
      'Image Optimization',
      'Compress Images',
      'WebP Converter',
      'Browser Compression',
      'Client-Side Image Processing',
      'Image Quality'
    ],
    excerpt: 'Images constitute over 60% of modern web page weight and mobile data consumption. Learn how format selection, HTML5 Canvas downsampling mathematics, and client-side encoding reduce file sizes by up to 85% while keeping visual details razor-sharp.',
    takeaways: [
      'WebP yields 25% to 35% smaller files than equivalent JPEGs: Modern predictive block coding preserves high-frequency textures with fewer compression artifacts.',
      'Canvas bilinear and bicubic downsampling slash raw pixels: Scaling a 4000x3000 camera photo down to 1920x1440 eliminates 77% of raw pixels prior to compression.',
      'Alpha transparency requires smart formatting: PNG-24 handles subtle drop shadows losslessly, while WebP Lossy provides transparent backgrounds at a fraction of the weight.',
      'Zero-upload processing protects personal photos: Processing sensitive family portraits and identity cards locally in browser memory guarantees absolute digital privacy.'
    ],
    sections: [
      {
        id: 'the-cost-of-uncompressed-images',
        title: '1. The Real Cost of Uncompressed Images on Web & Mobile Performance',
        content: `According to HTTP Archive metrics, image assets account for the single largest contributor to web payload weight. Serving unoptimized 5MB DSLR photographs directly to mobile visitors causes severe Core Web Vitals penalties—specifically degrading Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).

Every raw uncompressed image loaded into memory consumes device RAM according to the bitmap formula:
\`\`\`
RAM Allocation = Width in Pixels × Height in Pixels × 4 bytes (RGBA32)
\`\`\`
A single 24-megapixel camera photo (6000 × 4000 px) requires **96 megabytes of uncompressed RAM** inside mobile browser memory, leading to battery drain and tab crashes on budget smartphones.`
      },
      {
        id: 'modern-formats-comparison',
        title: '2. Next-Gen Format Shootout: WebP vs. AVIF vs. JPEG vs. PNG',
        content: `Choosing the right image container depends on content characteristics and browser support:

| Format | Compression Type | Transparency | Typical Size vs JPEG | Best Suited For |
|---|---|---|---|---|
| **WebP** | Lossy & Lossless | Yes (8-bit alpha) | -25% to -35% | Hero banners, e-commerce, modern web |
| **AVIF** | Lossy & Lossless (AV1) | Yes (10/12-bit HDR) | -40% to -55% | Next-gen web, high-detail photographs |
| **JPEG** | Lossy (DCT) | No | Baseline (100%) | Universal legacy fallback, print photos |
| **PNG** | Lossless (DEFLATE) | Yes (32-bit RGBA) | +150% to +300% | UI icons, vector logos, screenshots |

> **Key Rule:** Use WebP for photographs requiring transparency or high compression efficiency, and reserve PNG strictly for screenshots and crisp line graphics.`
      },
      {
        id: 'canvas-downsampling-math',
        title: '3. The Mathematics of HTML5 Canvas Downsampling',
        content: `When resizing high-resolution photos in the browser, client-side scripts render the image to an offscreen \`HTMLCanvasElement\` with bicubic interpolation. 

The scaling factor is calculated as:
\`\`\`
Scale Factor = min(Target Width / Original Width, Target Height / Original Height)
New Width = round(Original Width × Scale Factor)
New Height = round(Original Height × Scale Factor)
\`\`\`

By resampling pixels down to exact display dimensions (e.g., 1600px wide for full-width web banners or 800px for blog figures), the raw pixel count drops exponentially, enabling the encoder to produce clean, sharp outputs without heavy block quantization.`
      },
      {
        id: 'compression-quality-sweet-spot',
        title: '4. Finding the Quality Sweet Spot: The 75%–82% Rule',
        content: `Many users believe that saving an image at 100% quality is essential for clarity. In practice, JPEG and WebP encoders experience diminishing returns above 85%:
- **100% Quality:** Disables most quantization tables, multiplying file weight by 3x–5x with virtually zero perceivable improvement in human visual clarity.
- **78%–82% Quality:** The perceptual sweet spot. Removes psychoacoustically undetectable high-frequency noise while preserving sharp edges, text clarity, and skin tones.
- **50%–60% Quality:** Aggressive compression suitable for background thumbnails, yielding tiny files under 50KB.`
      }
    ],
    howTo: {
      name: 'How to Optimize Images in Your Browser',
      description: 'Quick steps to reduce image file size without quality loss using Zubware tools.',
      steps: [
        {
          name: 'Upload Photo or Graphic',
          text: 'Open Zubware Image Compressor and select your JPG, PNG, or WebP image.'
        },
        {
          name: 'Set Target Dimensions or File Size',
          text: 'Choose your desired compression quality (e.g., Balanced 80%) or enter a strict target size cap.'
        },
        {
          name: 'Compare Side-by-Side Preview',
          text: 'Inspect original vs compressed image previews at 100% zoom to confirm visual fidelity.'
        },
        {
          name: 'Download Optimized Image',
          text: 'Save the optimized file instantly with local browser processing and zero server uploads.'
        }
      ]
    },
    faqs: [
      {
        question: 'Does WebP work across all modern web browsers?',
        answer: 'Yes. WebP is supported by over 97% of global web browsers, including Google Chrome, Apple Safari (iOS & macOS), Mozilla Firefox, and Microsoft Edge.'
      },
      {
        question: 'Can I compress multiple images simultaneously?',
        answer: 'Yes. Zubware Bulk Image Resizer and Image Compressor support batch processing, allowing you to optimize dozens of photos simultaneously in your browser.'
      },
      {
        question: 'Why is my transparent PNG turning black after JPEG conversion?',
        answer: 'JPEG does not support alpha transparency channels. Transparent pixels are replaced by solid black or white. To preserve transparency, convert to WebP or maintain PNG format.'
      },
      {
        question: 'Are my private photos uploaded to remote servers during compression?',
        answer: 'No. All canvas downsampling and WebP encoding run locally in your browser memory. Your images never leave your computer or phone.'
      },
      {
        question: 'What is the best format for government exam uploads (UPSC, SSC)?',
        answer: 'Most government recruitment portals mandate standard JPG format under strict caps (such as 20KB to 50KB). Use Zubware Image Compressor with JPG output.'
      }
    ],
    relatedToolIds: [
      'image-compressor',
      'image-resizer',
      'image-converter',
      'batch-image-converter',
      'heic-to-jpg',
      'background-remover'
    ]
  },

  // 12. passport-size-photo-maker-guidelines
  {
    slug: 'passport-size-photo-maker-guidelines',
    title: 'Official Passport Size Photo Dimensions & Requirements Guide',
    metaTitle: 'Official Passport Size Photo Dimensions & Requirements Guide — Zubware',
    description: 'Complete global passport photo guidelines. Official dimensions for US (2x2 in), India (3.5x4.5 cm), UK & Schengen (35x45 mm), head height ratios, and plain background rules.',
    canonicalPath: '/blog/passport-size-photo-maker-guidelines',
    publishedTime: '2026-09-25T00:00:00Z',
    modifiedTime: '2026-10-09T00:00:00Z',
    author: {
      name: 'Zubware Media Engineering Team',
      url: 'https://www.zubware.com/about',
      role: 'Computer Vision & Browser Media Engineering'
    },
    publisher: {
      name: 'Zubware',
      url: 'https://www.zubware.com'
    },
    category: 'Image Guides',
    readingTime: '8 min read',
    tags: [
      'Passport Photo',
      'Passport Dimensions',
      'Visa Photo Requirements',
      'Photo Resizer',
      'Government Exam Photo',
      'Passport Size Photo Maker'
    ],
    excerpt: 'Submitting a passport, visa, or competitive exam photo with incorrect millimetre dimensions, wrong head height proportions, or shadow-filled backgrounds is the #1 cause of bureaucratic application rejections. Here is the official global specifications reference and sizing guide.',
    takeaways: [
      'Dimensions vary by jurisdiction: US passports require 2×2 inches (51×51 mm), while India, UK, and Schengen countries require 35×45 mm (3.5×4.5 cm).',
      'Head height must occupy 50% to 69% of vertical frame: Biometric facial recognition algorithms require exact crown-to-chin proportions.',
      'Strict background standards apply: US mandates pure white or off-white; UK, Canada, and Schengen accept light grey or cream; patterns and dark shadows cause instant disqualification.',
      'Never upscale low-res selfies for print: Passport printing requires exactly 300 DPI (600×600 px for US; 413×531 px for UK/India) to avoid blurry grain.'
    ],
    sections: [
      {
        id: 'global-dimension-standards',
        title: '1. Official Passport & Visa Dimensions by Country',
        content: `Every international immigration authority enforces precise physical dimensions and digital pixel resolutions:

| Country / Region | Physical Dimensions | Digital Pixels (at 300 DPI) | Background Color | Head Ratio (Chin to Crown) |
|---|---|---|---|---|
| **United States** | 2 × 2 inches (51 × 51 mm) | 600 × 600 px | Pure White / Off-White | 1.0 to 1.375 inches (50% – 69%) |
| **India (Passport / OCI)** | 3.5 × 4.5 cm (35 × 45 mm) | 413 × 531 px | Pure White | 25 mm to 35 mm (70% – 80%) |
| **United Kingdom (HMPO)** | 35 × 45 mm | 413 × 531 px | Light Grey or Cream | 29 mm to 34 mm |
| **Schengen Visa (Europe)** | 35 × 45 mm | 413 × 531 px | Plain Light Grey / White | 32 mm to 36 mm (70% – 80%) |
| **Canada** | 50 × 70 mm | 590 × 826 px | Pure White / Light | 31 mm to 36 mm |`
      },
      {
        id: 'biometric-facial-geometry-rules',
        title: '2. Biometric Facial Geometry and Lighting Requirements',
        content: `Biometric passport readers use automated facial geometry algorithms. Compliance requires adhering to strict physical parameters:
- **Eye Line Positioning:** In US photos, the subject's eye height must fall between 1.125 inches and 1.375 inches (28 mm – 35 mm) from the bottom edge of the photo.
- **Direct Eye Contact & Neutral Expression:** Eyes must be open, looking directly into the camera lens with mouth closed and a neutral facial expression (no wide smiles, squinting, or tilted heads).
- **Even Lighting & Shadow Elimination:** Diffuse, frontal illumination is mandatory. Shadows cast under the chin, across cheeks, or onto the background wall violate ICAO Doc 9303 standards.
- **Eyeglasses & Headwear:** The US State Department strictly prohibits eyeglasses in passport photos. Religious head coverings are allowed provided the full face from jawline to forehead is visible without shadows.`
      },
      {
        id: 'common-rejection-pitfalls',
        title: '3. Top Reasons Passport & Exam Photos Get Rejected',
        content: `Avoid these frequent applicant mistakes:
1. **Selfie Distortion:** Shooting with a smartphone front camera held 18 inches away introduces wide-angle facial distortion (large nose, receded ears). Have someone take the photo from 4 to 6 feet away using standard 50mm–85mm focal equivalent, or use Zubware Passport Photo Maker.
2. **Incorrect Aspect Ratio Cropping:** Stretches or squashes facial proportions.
3. **Over-Editing & Filters:** Applying skin smoothing, face-thinning filters, or Instagram color grades alters biometric landmarks and causes immediate rejection.
4. **Incorrect File Size for Exam Portals:** Indian recruitment portals (UPSC, SSC, IBPS) often mandate JPG files between **20KB and 50KB**. Use Zubware Image Compressor to hit exact byte caps.`
      },
      {
        id: 'print-layout-and-dpi-standards',
        title: '4. Preparing 4×6 Inch Photo Sheets for Printing',
        content: `Printing individual 2×2 inch or 35×45 mm photos directly at commercial photo kiosks can be expensive. A cost-effective alternative is tiling multiple passport photos onto a standard 4×6 inch (10×15 cm) print template:
- A single 4×6 inch canvas at 300 DPI measures **1200 × 1800 pixels**.
- It comfortably fits **6 US passport photos** (2×2 in) or **8 UK/Indian passport photos** (35×45 mm) with convenient cutting guide borders.
- Print the 4×6 sheet at any local pharmacy or retail kiosk for pennies, then cut with scissors or a paper trimmer.`
      }
    ],
    howTo: {
      name: 'How to Create Compliant Passport Photos Online',
      description: 'Step-by-step workflow to generate biometric passport and visa photos with Zubware.',
      steps: [
        {
          name: 'Upload Portrait Photo',
          text: 'Open Zubware Passport Photo Maker and upload a clear, front-facing portrait photo.'
        },
        {
          name: 'Select Country Preset',
          text: 'Choose your destination specification (US 2x2 in, India 3.5x4.5 cm, UK 35x45 mm, or custom).'
        },
        {
          name: 'Align Facial Guide Box',
          text: 'Position the interactive oval guide over your chin, eyes, and crown to ensure exact biometric proportions.'
        },
        {
          name: 'Download Photo Sheet',
          text: 'Download individual compliant photos or a tiled 4x6 print sheet directly in browser memory.'
        }
      ]
    },
    faqs: [
      {
        question: 'Can I take a passport photo with my smartphone?',
        answer: 'Yes, provided someone stands 4–6 feet away, shoots in bright natural daylight, against a plain white background, and avoids wide-angle selfie distortion.'
      },
      {
        question: 'Are eyeglasses allowed in US passport photos?',
        answer: 'No. The US Department of State has prohibited eyeglasses in passport photos since 2016 to prevent glare from obstructing biometric facial recognition.'
      },
      {
        question: 'What is the required DPI for printing passport photos?',
        answer: 'All official passport authorities require exactly 300 DPI (dots per inch) print resolution to prevent pixelated or blurry facial features.'
      },
      {
        question: 'How do I combine my photo and signature for government exams?',
        answer: 'Use Zubware Photo and Signature Joiner to stack your passport photo and scanned signature into a single recruitment-compliant JPG file.'
      },
      {
        question: 'Are my personal identity photos uploaded to external servers?',
        answer: 'Never. Zubware Passport Photo Maker processes, crops, and formats your photos 100% locally in your browser memory for complete biometric privacy.'
      }
    ],
    relatedToolIds: [
      'passport-photo-maker',
      'background-remover',
      'photo-signature-joiner',
      'signature-resizer',
      'image-compressor',
      'crop-image'
    ]
  },

  // 13. background-removal-ai-browser-guide
  {
    slug: 'background-removal-ai-browser-guide',
    title: 'Browser-Based AI Background Removal: How In-Browser Machine Learning Works',
    metaTitle: 'Browser-Based AI Background Removal: In-Browser Machine Learning — Zubware',
    description: 'Learn how client-side AI background removal works using WebAssembly and ONNX neural models. Achieve clean 32-bit PNG cutouts with zero server uploads.',
    canonicalPath: '/blog/background-removal-ai-browser-guide',
    publishedTime: '2026-09-26T00:00:00Z',
    modifiedTime: '2026-10-09T00:00:00Z',
    author: {
      name: 'Zubware Media Engineering Team',
      url: 'https://www.zubware.com/about',
      role: 'Computer Vision & Browser Media Engineering'
    },
    publisher: {
      name: 'Zubware',
      url: 'https://www.zubware.com'
    },
    category: 'Image Guides',
    readingTime: '7 min read',
    tags: [
      'Background Removal',
      'AI Image Segmentation',
      'WebAssembly ML',
      'Transparent PNG',
      'Client-Side AI',
      'Product Photography'
    ],
    excerpt: 'Extracting product cutouts, headshots, and transparent graphics used to require expensive desktop software or uploading sensitive proprietary photos to third-party cloud servers. Discover how modern machine learning models segment foreground subjects right inside your browser.',
    takeaways: [
      'Deep semantic segmentation separates foreground from background: Neural networks analyze color gradients, edge boundaries, and semantic context simultaneously.',
      'WebAssembly and WebGPU bring desktop-grade inference to browsers: Quantized neural models execute directly on your local device CPU or GPU with zero latency.',
      'Alpha matting handles fine edge transitions: Unlike binary green-screen chroma keying, modern AI produces soft semi-transparent pixels for hair strands and fabric.',
      '100% client-side execution protects corporate IP: E-commerce retailers can process unreleased product shots without cloud leaks or per-image subscription paywalls.'
    ],
    sections: [
      {
        id: 'how-neural-segmentation-works',
        title: '1. Neural Segmentation Architecture: From Pixels to Masks',
        content: `Traditional background removal relied on color thresholding (chroma keying) or manual magic-wand selection, which fail miserably when the subject wears clothing matching the background. Modern AI background removal uses deep convolutional and transformer-based semantic segmentation architectures (such as U-Net, MODNet, and RMBG):

1. **Feature Extraction:** Downsampling convolutional layers extract high-level semantic meaning (identifying "person", "dog", "shoe", or "car").
2. **Context Aggregation:** Skip connections preserve spatial coordinates while analyzing global scene context.
3. **Decoder Reconstruction:** The decoder network projects predictions back to original pixel dimensions, generating an **Alpha Matte** (\`0.0\` to \`1.0\`) representing opacity for every single pixel.`
      },
      {
        id: 'in-browser-wasm-inference',
        title: '2. The WebAssembly & WebGPU Revolution: Zero-Upload Inference',
        content: `In the past, executing a 200MB neural network required powerful cloud server clusters with costly GPU instances. In 2026, client-side machine learning frameworks run quantized ONNX models directly inside modern web browsers:

- **Model Quantization (INT8 / FP16):** Weights are compressed from 32-bit floats to 8-bit integers, shrinking model footprints down to 15MB–30MB without noticeable precision loss.
- **WebAssembly (WASM) with SIMD:** Compiles C++ neural runtimes into high-performance browser bytecode utilizing multi-core CPU SIMD (Single Instruction, Multiple Data) parallelism.
- **WebGPU Acceleration:** Enables direct hardware compute shaders on your laptop or smartphone GPU, segmenting a 4K photograph in under 2 seconds.`
      },
      {
        id: 'alpha-matting-and-fine-hair-edges',
        title: '3. Solving the Hard Problem: Fine Hair Strands & Semitransparency',
        content: `The ultimate test of any background removal algorithm is how it handles semi-transparent boundaries:
- **Binary Segmentation (Hard Edges):** Classifies pixels strictly as 100% foreground or 100% background, resulting in jagged, blocky halo artifacts around curls, hair flyaways, and fur.
- **Tri-Map & Guided Filter Matting:** Divides the image into three zones: Definite Foreground, Definite Background, and Unknown Transition Zone. A secondary matting pass computes linear color blending equations within the transition zone:
\`\`\`
Observed Pixel = Alpha × Foreground Color + (1 - Alpha) × Background Color
\`\`\`
Solving for Alpha extracts genuine transparent wisps, making cutouts blend seamlessly onto new backgrounds.`
      },
      {
        id: 'product-photography-workflow',
        title: '4. Best Practices for E-Commerce & Product Photography',
        content: `To achieve flawless automatic background removals for Amazon, Shopify, and eBay listings:
- **Maximize Contrast:** Ensure the subject does not blend entirely into the backdrop (e.g., avoid shooting a white ceramic mug directly on a white table without soft directional shadows).
- **Control Specular Highlights:** Shiny glass or metallic jewelry can reflect background colors; diffuse your light sources.
- **Export to Transparent PNG or WebP:** Download transparent 32-bit PNGs for desktop print or transparent WebP for fast-loading e-commerce web stores.`
      }
    ],
    howTo: {
      name: 'How to Remove Image Backgrounds in Your Browser',
      description: 'Step-by-step guide to extract transparent cutouts using Zubware AI tools.',
      steps: [
        {
          name: 'Select Image',
          text: 'Open Zubware Background Remover and upload your product photo, portrait, or logo.'
        },
        {
          name: 'Automatic AI Segmentation',
          text: 'The in-browser neural network automatically detects the subject and generates an alpha mask in memory.'
        },
        {
          name: 'Inspect Edge Quality',
          text: 'Toggle dark and light background preview modes to check hair strands and transparent edges.'
        },
        {
          name: 'Download Transparent PNG',
          text: 'Save your clean cutout with full alpha transparency and zero server uploads.'
        }
      ]
    },
    faqs: [
      {
        question: 'Does Zubware upload my photos to an AI cloud server?',
        answer: 'No. The neural segmentation network runs completely inside your browser using WebAssembly. Your photos never leave your device.'
      },
      {
        question: 'Can I add a solid white or custom color background after removal?',
        answer: 'Yes. Use Zubware Background Color Changer to replace transparent backgrounds with solid white, grey, or brand palette colors.'
      },
      {
        question: 'What is the best format for saving transparent cutouts?',
        answer: 'PNG and WebP both support alpha transparency. PNG is ideal for archival and print graphics, while WebP is recommended for fast web loading.'
      },
      {
        question: 'Why does my cutout have a colored halo around the edges?',
        answer: 'Halos occur when the original background color reflected onto the subject edges. Use diffuse frontal lighting when photographing subjects to prevent color spill.'
      },
      {
        question: 'Is there a limit on how many images I can process?',
        answer: 'No. Because all computation executes on your own device hardware, there are no monthly caps, subscriptions, or watermarks.'
      }
    ],
    relatedToolIds: [
      'background-remover',
      'background-color-changer',
      'passport-photo-maker',
      'image-compressor',
      'crop-image',
      'image-converter'
    ]
  }
];
