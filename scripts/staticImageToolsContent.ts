/**
 * Static HTML evergreen content generator for Batch 2 Image Tools
 * Injected into renderStaticToolContent in scripts/generateSeoAndSitemap.ts
 */

export function getStaticImageToolSectionHtml(toolId: string, DOMAIN: string): string {
  switch (toolId) {
    case 'background-remover':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Remove Background from Image Online: Free AI Transparent Cutout Tool
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Automatic Neural Network Cutouts
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Isolate subjects and eliminate distracting backdrops automatically using browser-based machine learning. Our in-browser segmentation model identifies human portraits, e-commerce products, animals, and graphic objects with sub-pixel precision along hair strands and soft edges.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              E-Commerce Product Listings &amp; ID Photos
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Marketplaces like Amazon, Flipkart, Shopify, and Meesho mandate clean white or transparent product presentations. Remove cluttered room backgrounds in seconds to showcase jewelry, apparel, shoes, and gadgets. For exam forms (SSC, UPSC) and passport applications, remove background shadows effortlessly.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Multi-Backdrop Quality Inspection
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Switch between checkerboard transparency, pure white (#ffffff), solid black, and neutral studio grey backdrops to inspect edge cleanliness before downloading your 32-bit transparent PNG.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Privacy (Zero Server Uploads)
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              All machine learning neural networks execute 100% locally in your device browser RAM via WebAssembly. Your personal selfies, family photos, and commercial catalog assets are never sent to remote servers.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/background-color-changer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Background Color Changer</a> •
          <a href="${DOMAIN}/passport-photo-maker" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Passport Photo Maker</a> •
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a>
        </div>
      </section>`;

    case 'image-converter':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Online Image Converter: Convert Between JPG, PNG, WebP, SVG &amp; ICO
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Universal Graphic &amp; Web Format Support
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Export JPG, PNG, WebP, BMP and single-size ICO files in your browser. SVG is supported as an input for rasterization, not as vector output. AVIF export appears only where the browser supports encoding. Batch conversion is limited by available device memory.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Alpha Transparency &amp; Matte Background Fill
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              When converting transparent PNGs or WebP files to JPG (which lacks transparency support), choose a clean solid matte fill (pure white or custom hex color) to avoid black bounding boxes.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Windows Favicon (.ico) Packaging
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Choose one output size, from 16 to 256 pixels, for a single-size ICO file containing a PNG image. Use the dedicated Favicon Generator for a package of different icon files.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Zero Server Uploads &amp; Complete Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              All conversions execute locally using HTML5 Canvas and WebAssembly. Your photos and graphics are never uploaded across the internet.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/batch-image-converter" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Batch Image Converter</a> •
          <a href="${DOMAIN}/heic-to-jpg" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">HEIC to JPG Converter</a> •
          <a href="${DOMAIN}/favicon-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Favicon Generator</a>
        </div>
      </section>`;

    case 'image-resizer':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Free Online Image Resizer: Resize Photos by Pixels, Percentage &amp; Presets
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Exact Pixels &amp; Aspect Ratio Locking
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Specify exact pixel width and height with intelligent aspect ratio preservation to prevent image distortion. Or switch to Percentage mode (1% to 500%) for rapid proportional downscaling.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Social Media Dimension Presets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              One-click presets for Instagram Square (1080x1080), Instagram Story/Reels (1080x1920), YouTube Thumbnail (1280x720), LinkedIn Post (1200x627), and Twitter/X Header (1500x500).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Recruitment Exam &amp; Portal Dimensions
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Indian exam portals (SSC, UPSC, State PSC, IBPS) mandate specific candidate photo bounds like 100x120 px, 140x160 px, or 350x350 px. Unlock aspect ratio and set exact portal limits.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Sharp Bicubic Downsampling
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              High-quality canvas resampling avoids jagged pixelation or muddy text when downscaling photos, running 100% locally on your device GPU/CPU.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/crop-image" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Crop Image</a> •
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a> •
          <a href="${DOMAIN}/signature-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Signature Resizer</a>
        </div>
      </section>`;

    case 'crop-image':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Crop Image Online: Free Photo Cropper with Aspect Ratio Presets
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Aspect Ratio Presets for Social Platforms
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Standard presets for 1:1 Square (avatars &amp; WhatsApp DP), 4:3 (photography), 16:9 (YouTube thumbnails), 9:16 (TikTok &amp; Reels), and A4 Paper, alongside freeform custom handles.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Smooth Zoom &amp; 90° Rotation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Interactive 50% to 200% zoom controls and 90-degree clockwise / counter-clockwise rotations fix crooked horizons and re-center compositions before final export.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Lossless Multi-Format Export
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Export your cropped images in high-resolution PNG, JPG, or modern WebP format without introducing unwanted compression artifacts.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Mobile Touchscreen Friendly
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Smooth touch gesture support allows dragging crop boundaries intuitively on iPhone, iPad, and Android mobile browsers.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/image-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Resizer</a> •
          <a href="${DOMAIN}/rotate-image" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Rotate Image</a> •
          <a href="${DOMAIN}/passport-photo-maker" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Passport Photo Maker</a>
        </div>
      </section>`;

    case 'image-watermark':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Add Watermark to Images Online: Protect Photos with Text &amp; Logo Stamps
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Custom Text Autographs &amp; Brand Logos
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Protect your photography and artwork by stamping copyright notices (&copy;), creator names, website URLs, or transparent PNG brand logos with customizable fonts, drop shadows, and opacity.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              9-Point Alignment &amp; Tiled Repeat
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Anchor watermarks to corners or center with exact margin padding. Or enable Tiled Repeat Pattern diagonally across the entire image to prevent unauthorized web scraping and AI training theft.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Client-Side Canvas Stamping
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Watermark layers are rendered directly onto high-DPI HTML5 canvas buffers in device RAM without transmitting photos to remote servers.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              No Zubware Watermark on Output
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Unlike commercial apps that force their own promotional branding onto your photos, Zubware exports 100% clean files featuring only your chosen mark.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/signature-maker" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Signature Maker</a> •
          <a href="${DOMAIN}/exif-remover" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">EXIF Remover</a> •
          <a href="${DOMAIN}/image-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Resizer</a>
        </div>
      </section>`;

    case 'exif-remover':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Free EXIF Remover Online: Strip Photo Metadata, GPS &amp; Camera Tags Privately
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Hidden GPS &amp; Camera Hardware Data
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Smartphones and DSLR cameras embed exact latitude, longitude, altitude, device serial numbers, and capture timestamps into image containers.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Eliminate Stalking &amp; Privacy Hazards
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Sharing unstripped camera pictures on social media, Reddit, forums, or classifieds can reveal your home location or daily commute routes to strangers.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Zero-Loss Visual Fidelity
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Zubware re-encodes pure pixel data, stripping EXIF, IPTC, and XMP metadata chunks while retaining 100% of original photo colors and sharpness.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Local Browser Execution
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              All metadata purging executes entirely on your device without uploading pictures to remote servers or third-party analytical APIs.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/image-info-viewer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Info Viewer</a> •
          <a href="${DOMAIN}/blur-image" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Blur Image</a> •
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a>
        </div>
      </section>`;

    case 'favicon-generator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Favicon Generator: Create .ico, Apple Touch &amp; Android PWA Icon Packages
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Complete 2026 Icon Suite
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Generates multi-resolution binary favicon.ico (16x16, 32x32, 48x48), browser tab PNGs, 180x180 Apple Touch Icons for iOS Safari, and 192x192 / 512x512 Android PWA icons.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Pre-Configured site.webmanifest
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Includes a pre-formatted Web App Manifest with customizable site name, theme color, and background color for compliant Progressive Web Apps.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Ready-to-Paste HTML Head Code
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Copy clean HTML &lt;link rel="icon"&gt;, &lt;link rel="apple-touch-icon"&gt;, and manifest declarations directly into your website template header.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Single ZIP Archive Download
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Download all icons packaged in a convenient favicon_package.zip file compiled 100% locally in your browser memory.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/image-converter" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Converter</a> •
          <a href="${DOMAIN}/svg-optimizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">SVG Optimizer</a> •
          <a href="${DOMAIN}/rounded-corners" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Rounded Corners</a>
        </div>
      </section>`;

    case 'gif-maker':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Free Online GIF Maker: Create Animated GIFs from Photos in Your Browser
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Turn Photos into Smooth Animations
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Combine sequential pictures, memes, stop-motion photos, or product rotations into vibrant animated GIFs directly in your browser without software installs.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Forward, Reverse &amp; Ping-Pong Bounce
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Choose between classic Forward playback, Reverse sequence, or seamless Ping-Pong bounce looping that plays forward and reverses seamlessly without abrupt jump cuts.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Frame Timing &amp; Speed Controls
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Adjust frame delay from 50ms (rapid 20 FPS motion) to 1000ms (slow photo slideshow), reorder timeline cards, and delete unwanted frames.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Zero Watermarks on Output
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Compiled locally using client-side omggif binary encoding. Your animated GIFs are exported with clean visuals, free of forced watermarks or logos.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/crop-image" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Crop Image</a> •
          <a href="${DOMAIN}/image-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Resizer</a> •
          <a href="${DOMAIN}/image-collage" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Photo Collage Maker</a>
        </div>
      </section>`;

    case 'batch-image-converter':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Batch Image Converter: Convert Multiple Images to WebP, JPG &amp; PNG Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Simultaneous Multi-File Queue
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Queue dozens of photos across JPG, PNG, WebP, BMP, and GIF formats simultaneously and convert them all into a unified target format with zero upload latency.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Lightweight WebP Optimization
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Convert heavy PNG and JPG galleries into next-generation WebP images (25%–35% smaller) to improve Google PageSpeed Insights and mobile performance.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Real-Time Progress &amp; Savings
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Track real-time client-side conversion progress per file and inspect exact byte size reductions between source and target images.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              One-Click ZIP Archive Export
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Download all converted images bundled into a single converted_images.zip archive packaged in browser memory via JSZip.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/bulk-image-renamer-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Bulk Resizer &amp; Renamer</a> •
          <a href="${DOMAIN}/heic-to-jpg" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">HEIC to JPG Converter</a> •
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a>
        </div>
      </section>`;

    case 'heic-to-jpg':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          HEIC to JPG Converter: Convert Apple iPhone Photos to High-Quality JPG Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Solve Unsupported iPhone Photo Errors
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Apple iPhones capture photos in HEIC/HEIF containers by default. Windows PCs, Android phones, and online exam portals often reject HEIC files. Convert them to universal JPG in seconds.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              WebAssembly In-Browser Decoding
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Powered by heic2any WebAssembly. Your iPhone photos never leave your device RAM, eliminating privacy concerns associated with cloud converters.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Flexible Quality Presets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Choose High 90% for printing, Balanced 80% for sharing, or Web 65% for compact file sizes, with full original resolution preservation.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Batch Conversion &amp; ZIP Download
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Drop entire iPhone albums into the queue, convert in sequence, and download all resulting JPGs packaged in a single ZIP archive.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a> •
          <a href="${DOMAIN}/exif-remover" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">EXIF Remover</a> •
          <a href="${DOMAIN}/batch-image-converter" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Batch Image Converter</a>
        </div>
      </section>`;

    case 'passport-photo-maker':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Passport Photo Maker: Biometric ID Photos for India, US, Schengen, UK &amp; Canada
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Global Consular Standards
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Standard presets for India Passport (35x45mm), India Visa/OCI (2x2" / 51x51mm), US Passport (2x2"), Schengen Visa (35x45mm), UK (35x45mm), and Canada (50x70mm).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Biometric Head Guide Overlay
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Visual framing guidelines (chin, crown, eye level) ensure compliance with the strict 70%–80% facial coverage rules enforced by passport and visa authorities worldwide.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Printable 4&times;6" Multi-Photo Sheets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Lays out multiple passport photos (6 to 8 copies) onto standard 4x6 inch photo paper with scissor cut marks for inexpensive printing at local kiosks or home printers.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Strict File Size Tuning (20KB–50KB)
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Indian portals (Passport Seva, SSC, UPSC) mandate photo file sizes between 20KB and 50KB or 100KB. Adjust JPEG quality to meet exact upload ceilings.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/background-remover" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Background Remover</a> •
          <a href="${DOMAIN}/photo-signature-joiner" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Photo &amp; Signature Joiner</a> •
          <a href="${DOMAIN}/signature-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Signature Resizer</a>
        </div>
      </section>`;

    case 'signature-maker':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Online Signature Maker: Draw, Type or Scan Transparent Electronic Signatures
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Three Signature Creation Modes
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Draw with smooth bezier curves using stylus or finger; type your name to generate elegant cursive calligraphy; or scan a phone photo of your paper signature with adaptive shadow removal.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Transparent PNG &amp; Vector SVG Export
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Export 32-bit transparent PNG files that overlay cleanly onto Adobe Acrobat, DocuSign, Microsoft Word, and Google Docs without white boxes covering underlying text.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Legal &amp; Business Compliance
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Compliant with US ESIGN Act, EU eIDAS, and Indian IT Act 2000 provisions for commercial agreements, employment offers, invoices, and job portal submissions.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Private (No Cloud Biometric Storage)
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Your personal signature drawings and uploaded autographs are processed locally in your device RAM and are never transmitted to or stored on external servers.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/signature-resizer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Signature Resizer</a> •
          <a href="${DOMAIN}/photo-signature-joiner" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Photo &amp; Signature Joiner</a> •
          <a href="${DOMAIN}/edit-pdf" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Online PDF Editor</a>
        </div>
      </section>`;

    case 'handwriting-to-text':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Handwriting to Text OCR: Convert Handwritten Notes to Digital Text Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Digitize Notebooks &amp; Lecture Notes
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Convert handwritten student notebook pages, research scribbles, or whiteboard notes into editable, searchable digital text in seconds without manual retyping.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Interactive Canvas &amp; Photo Upload
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Upload camera photos of notebook pages, or switch to the interactive drawing canvas to write live using a stylus, Apple Pencil, or touchscreen.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Adaptive Ink Binarization
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Adaptive contrast thresholding darkens faint pencil/pen strokes while brightening paper backgrounds, eliminating shadows and lined paper margins.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Client-Side Tesseract OCR Engine
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Runs LSTM neural network character recognition in WebAssembly with a built-in text editor, confidence score, and one-click TXT export.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/image-to-text" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image to Text OCR</a> •
          <a href="${DOMAIN}/text-to-handwriting" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Text to Handwriting</a> •
          <a href="${DOMAIN}/pdf-to-text" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">PDF to Text Converter</a>
        </div>
      </section>`;

    case 'image-to-text':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Image to Text OCR: Extract Text from Photos, Scans &amp; Screenshots Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Universal Document &amp; Screen Extraction
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Extract printed text from screenshots, scanned receipts, utility bills, business cards, textbook pages, and PDFs across JPG, PNG, WebP, and BMP formats.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              11+ Global Language Models
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Supports English, Hindi (हिंदी), Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, and Arabic dictionaries for accurate transcription.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Confidence Percentage &amp; Word Counter
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Review the recognition confidence score, character and word counts, and edit recognized text directly before copying or downloading as a .txt file.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Private In-Memory WebAssembly OCR
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Powered by Tesseract.js WebAssembly. Invoices, contracts, and sensitive personal documents are never transmitted to external cloud servers.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Tools:</strong>
          <a href="${DOMAIN}/handwriting-to-text" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Handwriting to Text OCR</a> •
          <a href="${DOMAIN}/pdf-to-text" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">PDF to Text Converter</a> •
          <a href="${DOMAIN}/image-info-viewer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Info Viewer</a>
        </div>
      </section>`;

    default:
      return '';
  }
}
