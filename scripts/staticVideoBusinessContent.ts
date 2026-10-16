/**
 * Static HTML evergreen content generator for Batch 3 Video & Business Tools
 * Injected into renderStaticToolContent in scripts/generateSeoAndSitemap.ts
 */

export function getStaticVideoBusinessSectionHtml(toolId: string, DOMAIN: string): string {
  switch (toolId) {
    case 'subtitle-generator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Video Subtitle &amp; SRT Generator: Create, Time &amp; Sync Captions Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Interactive Timestamp Synchronization
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Play your video and pin cue start and end times with one click using the &quot;Set Start to Current&quot; and &quot;Set End to Current&quot; buttons. Fine-tune duration numbers manually down to tenths of a second to eliminate audio drift and align spoken dialogue with lip movement.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Browser Web Speech Dictation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Toggle the microphone icon to transcribe spoken words directly into caption cards via your browser's native Web Speech API (in Chrome, Edge, and Safari). Optional dictation listens to your microphone, not the uploaded video. Your browser may send audio to its speech recognition provider. Manual captions remain available without microphone access.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Dual Format Export: .SRT &amp; .VTT
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Export universal SubRip (.srt) files formatted with standard sequential indexes and comma millisecond delimiters (00:00:02,500), or WebVTT (.vtt) files formatted with period millisecond delimiters (00:02.500) for HTML5 video elements.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Local Video Editing & Optional Dictation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Video decoding and subtitle cue synchronization execute entirely inside your local browser session. Uploaded video playback and manual captions stay local. Optional microphone dictation may use an external speech recognition service.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Video Tools:</strong>
          <a href="${DOMAIN}/video-trimmer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Trimmer &amp; Cutter</a> •
          <a href="${DOMAIN}/video-aspect-ratio" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Aspect Ratio Converter</a> •
          <a href="${DOMAIN}/video-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Compressor</a>
        </div>
      </section>`;

    case 'video-aspect-ratio':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Video Aspect Ratio Converter: Convert 16:9 to 9:16 Reels &amp; TikTok Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              9:16 Vertical Mobile Presets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Render crisp 720×1280 px vertical video optimized for mobile discovery feeds on TikTok, Instagram Reels, and YouTube Shorts. Eliminate awkward black bars by duplicating your video with smooth blurred ambient background padding.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Contain vs. Cover Framing
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Contain mode preserves 100% of your source video frame, centering it within the new canvas and padding the edges with blurred video or solid hex color. Cover mode scales the video to fill the screen edge-to-edge without borders by cropping outer margins.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Hardware-Accelerated WebM Capture
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              The engine records 30 frames per second directly from an HTML5 canvas stream via MediaRecorder (using VP9 or VP8 codecs at 3.5 Mbps high bitrate), simultaneously capturing the original soundtrack for perfect lip sync.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% In-Browser Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              All canvas transformations, aspect ratio adjustments, and re-encoding occur locally on your machine with zero server communication.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Video Tools:</strong>
          <a href="${DOMAIN}/video-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Compressor</a> •
          <a href="${DOMAIN}/video-trimmer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Trimmer &amp; Cutter</a> •
          <a href="${DOMAIN}/subtitle-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Subtitle &amp; SRT Generator</a>
        </div>
      </section>`;

    case 'video-compressor':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Video Compressor Online: Shrink MP4 &amp; WebM Files in Your Browser Free
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Three Curated Bitrate Presets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Choose High Quality (2.5 Mbps) for client presentations and high-motion sports; Medium Quality (1.2 Mbps) for balanced 50–70% compression savings on social posts; or Low Quality (600 Kbps) for compact ~4.5 MB/minute files suitable for email and Discord.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Resolution Downscaling
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Downscale resolution to 75% or 50% scale. Downscaling a 1080p frame to 720p reduces the total number of pixels by over 55%, yielding massive byte savings without noticeable blur on mobile phone screens.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Audio Track Preservation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              The compressor captures the audio stream directly from the media element and muxes it alongside the compressed video stream, preserving vocal clarity and sound synchronization.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Zubware executes all video decoding and re-encoding inside your device RAM with zero network uploads, guaranteeing complete confidentiality for personal and business videos.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Video Tools:</strong>
          <a href="${DOMAIN}/video-trimmer" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Trimmer &amp; Cutter</a> •
          <a href="${DOMAIN}/video-aspect-ratio" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Aspect Ratio Converter</a> •
          <a href="${DOMAIN}/image-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Image Compressor</a>
        </div>
      </section>`;

    case 'video-trimmer':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Video Trimmer &amp; Cutter: Cut &amp; Extract Video Clips Online Free
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Frame-Level Timestamp Entry
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Combine the speed of interactive visual timeline scrubbing with numerical decimal input boxes. Enter exact start and end seconds (e.g. 14.5s to 32.8s) to cleanly cut unwanted lead-in silence or abrupt camera movements.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Isolated Loop Playback Preview
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Press Play to audition the exact trimmed cut. Playback automatically loops between your specified start and end markers, letting you confirm audio flow and dialogue endpoints before spending time re-encoding.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Zero Watermarks &amp; Full Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Many online video editors stamp an unsightly logo watermark on exported clips unless you pay a monthly fee. Zubware is completely free and stamps zero watermarks. Your source video remains strictly on your device.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              High-Speed Canvas Capture
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Re-encodes the selected segment at 30 FPS with audio tracks synchronized through the browser MediaRecorder pipeline into standard WebM format.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Video Tools:</strong>
          <a href="${DOMAIN}/video-compressor" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Compressor</a> •
          <a href="${DOMAIN}/video-aspect-ratio" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Aspect Ratio Converter</a> •
          <a href="${DOMAIN}/subtitle-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Video Subtitle &amp; SRT Generator</a>
        </div>
      </section>`;

    case 'gst-invoice-generator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          GST Invoice Generator Online: Free Indian Tax Invoice &amp; Bill of Supply Maker
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Automatic CGST / SGST vs IGST Split
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              The engine compares the Supplier State code with the Place of Supply (POS). If both match, the tax slab (0%, 5%, 12%, 18%, 28%) is split 50/50 into Central GST and State GST. If they differ, the full rate is applied as Integrated GST (IGST).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              37 States &amp; Union Territories Support
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Pre-configured with all 37 Indian state and Union Territory GST codes (01 Jammu &amp; Kashmir to 38 Ladakh). Entering a 15-character GSTIN automatically parses and validates the 2-digit state prefix.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Dynamic UPI Payment QR Integration
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Input your business UPI ID (VPA) to automatically render a scannable payment QR code on the invoice with the exact calculated invoice total. Customers scan with PhonePe, Google Pay, or Paytm for instant bank-to-bank settlement.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Privacy &amp; Draft Saving
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Your customer names, billing amounts, and bank account details are never transmitted to Zubware servers. Save drafts in local browser storage to reload anytime.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Business Tools:</strong>
          <a href="${DOMAIN}/barcode-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Free Barcode Generator</a> •
          <a href="${DOMAIN}/sale-price-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Sale Price Calculator</a> •
          <a href="${DOMAIN}/qr-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">QR Code Generator</a>
        </div>
      </section>`;

    case 'omr-sheet-generator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          OMR Sheet Generator: Create Printable MCQ Answer Sheets &amp; Keys in PDF
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Print-Ready ISO A4 Dimensions
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Rendered at 1240 × 1754 px canvas resolution specifically calibrated for 150–300 DPI printing on standard 210 × 297 mm A4 paper. Four solid black corner fiducial registration marks provide optical alignment anchors for grading scanners.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Interactive Answer Key Mode
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Switch from Blank Sheet to Answer Key mode to click and darken correct bubbles directly on the canvas preview. Download an authoritative shaded master answer key to assist teachers during manual grading or physical transparent overlay evaluation.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Custom Student Info Grids
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Enable roll number bubble grids with 4 to 10 numerical digit columns (0–9), test booklet set selectors (Set A, B, C, D), candidate and invigilator signature boxes, and standard pen-shading instruction notices.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              20 to 150 Questions Presets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Choose 20, 50, 100, 120, or 150 questions across 1 to 4 responsive columns with 4 (A–D), 5 (A–E), or 6 (A–F) options, fitting exam content cleanly on a single sheet.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Education Tools:</strong>
          <a href="${DOMAIN}/learning-licence-mock-test" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Learning Licence Mock Test</a> •
          <a href="${DOMAIN}/exam-score-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Exam Score Calculator</a> •
          <a href="${DOMAIN}/pdf-merge" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">PDF Merge</a>
        </div>
      </section>`;

    case 'barcode-generator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Free Barcode Generator: Create Code 128, EAN-13, UPC-A in Vector SVG &amp; PNG
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              9 Supported Symbologies
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Generate universal Code 128 (alphanumeric logistics), EAN-13 (global retail), UPC-A (North American retail), EAN-8 (small goods), Code 39, ITF-14 (cartons), MSI Plessey, Pharmacode, and Codabar.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Scalable Vector SVG &amp; High-Res PNG
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Download vector SVG files with mathematically crisp bar boundaries that never pixelate when scaled for commercial packaging, or export raster PNG files for direct thermal label printers.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Automated Checksum Validation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              The generator validates modulo-10 check digits required by EAN and UPC retail specifications in real time, preventing unreadable or rejected barcodes before you commit to printing bulk product packaging.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Generation
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Barcode encoding and rendering execute locally in browser memory with zero tracking or database storage.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Business Tools:</strong>
          <a href="${DOMAIN}/qr-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">QR Code Generator</a> •
          <a href="${DOMAIN}/gst-invoice-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">GST Invoice Generator</a> •
          <a href="${DOMAIN}/sale-price-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Sale Price Calculator</a>
        </div>
      </section>`;

    case 'loan-eligibility-calculator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Loan Eligibility Calculator: Check Maximum Borrowing Power &amp; DTI Limits
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Present Value Annuity Math
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Calculates loan capacity using: P = EMI × [(1+r)^n - 1] ÷ [r × (1+r)^n], where r is the monthly interest rate and n is loan tenure in months. This models the exact mathematical discounting algorithm used by institutional loan underwriters.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              DTI / FOIR Cap Analysis
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Lenders strictly limit combined monthly debt to 40%–50% of net income (known as FOIR in India or DTI in the US). The calculator displays your current debt ratio versus projected debt ratio to ensure you remain within conservative lending guidelines.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Headroom &amp; Maximum EMI
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Subtracts existing debt payments from your allowable monthly obligation to determine the maximum new EMI you can comfortably handle without triggering lender rejections.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Private Financial Modeling
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Calculates your borrowing capacity 100% locally in browser memory with zero tracking, marketing phone calls, or credit bureau checks.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Financial Calculators:</strong>
          <a href="${DOMAIN}/personal-loan-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Personal Loan Calculator</a> •
          <a href="${DOMAIN}/down-payment-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Down Payment Calculator</a> •
          <a href="${DOMAIN}/us-income-tax-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">US Income Tax Calculator</a>
        </div>
      </section>`;

    case 'down-payment-calculator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Down Payment Calculator: Home Savings Goal &amp; Mortgage Cash Needed
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Loan Type Presets &amp; PMI Check
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Evaluate conventional loans requiring 20% down to eliminate Private Mortgage Insurance (PMI), alongside first-time homebuyer programs (Conventional 3%, FHA 3.5%, and VA 0%). The calculator flags whether your down payment triggers monthly PMI requirements.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Total Cash to Close Accounting
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Factors in 2% to 5% closing expenses (lender origination, appraisal, title insurance, and property tax escrows) to compute Down Payment + Closing Costs for true Total Cash to Close.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              HYSA Compound Growth Model
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Models the compound growth of your existing savings plus monthly deposits at your specified High-Yield Savings Account APY (e.g. 4.25%), showing how interest earnings help you reach your down payment goal faster than linear cash saving.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              All financial calculations and savings projections execute in your browser memory with zero tracking or lead capture.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Financial Calculators:</strong>
          <a href="${DOMAIN}/loan-eligibility-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Loan Eligibility Calculator</a> •
          <a href="${DOMAIN}/personal-loan-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Personal Loan Calculator</a> •
          <a href="${DOMAIN}/us-income-tax-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">US Income Tax Calculator</a>
        </div>
      </section>`;

    case 'us-income-tax-calculator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          US Income Tax Calculator: 2025–2026 Federal Brackets &amp; Employee FICA
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Official 2025 &amp; 2026 IRS Brackets
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Implements official IRS inflation-adjusted progressive brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%) and standard deductions: Single ($15,750 for 2025 / $16,100 for 2026) and Married Filing Jointly ($31,500 for 2025 / $32,200 for 2026).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              FICA Social Security &amp; Medicare
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Calculates mandatory federal payroll deductions: 6.2% Social Security up to the SSA wage base ($176,100 for 2025; $184,500 for 2026), 1.45% Medicare on all earned income, and the 0.9% Additional Medicare surtax on income over $200,000 ($250,000 MFJ).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Optional Effective State Rate
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Enter your own effective state rate for a rough estimate applied to federal taxable income. State-specific brackets, deductions and local taxes are not modeled. Leaving this at zero excludes state tax from the estimate.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Paycheck Take-Home Pay Frequencies
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Calculates net take-home salary across annual, monthly, semi-monthly (24), bi-weekly (26), and weekly (52) pay periods for precise household budgeting.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Financial Calculators:</strong>
          <a href="${DOMAIN}/personal-loan-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Personal Loan Calculator</a> •
          <a href="${DOMAIN}/loan-eligibility-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Loan Eligibility Calculator</a> •
          <a href="${DOMAIN}/down-payment-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Down Payment Calculator</a>
        </div>
      </section>`;

    case 'personal-loan-calculator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Personal Loan Calculator: Monthly EMI, True APR &amp; Amortization Schedule
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Standard Amortization Formula
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Computes fixed monthly installments using: EMI = P × [r × (1+r)^n] ÷ [(1+r)^n - 1]. Calculates the exact monthly principal and interest split for loan terms between 12 and 84 months.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Origination Fee &amp; Net Disbursed Cash
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Online lenders often deduct an upfront administrative origination fee (1% to 8%) from your payout. If you borrow $20,000 with a 3% fee, $600 is withheld upfront and you receive $19,400 in cash while paying interest on the full $20,000.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Early Payoff Prepayment Modeling
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Add an optional extra monthly principal payment (such as $50/month) to calculate the exact number of months shaved off your loan term and total interest dollars saved over the life of the loan.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              CSV Amortization Export
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Export a complete month-by-month spreadsheet breakdown showing month number, payment, principal, interest, and declining balance for Excel or Google Sheets.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Financial Calculators:</strong>
          <a href="${DOMAIN}/loan-eligibility-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Loan Eligibility Calculator</a> •
          <a href="${DOMAIN}/down-payment-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Down Payment Calculator</a> •
          <a href="${DOMAIN}/us-income-tax-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">US Income Tax Calculator</a>
        </div>
      </section>`;

    case 'sale-price-calculator':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Sale Price Calculator: Calculate Markdown Discounts &amp; Stacked Coupons Online
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Sequential Stacked Discount Logic
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Applies the primary markdown to the original price, and then calculates the secondary promo code on the already-discounted subtotal. For a $100 item with 25% off + 10% coupon: $100 &rarr; $75 &rarr; $67.50 (32.5% effective savings, not 35%).
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Sales Tax &amp; VAT Integration
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Select quick tax presets for US average (~8.25%), California/New York (~8.875%), UK VAT (20%), India GST (18%), or EU average (21%) to calculate true register checkout totals including applicable sales tax.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              Multi-Currency &amp; Quantity Support
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              Switch currencies between USD ($), EUR (€), GBP (£), INR (₹), CAD (CA$), and AUD (AU$). Increase the item quantity to compute aggregate shopping cart savings and final multi-item checkout totals.
            </p>
          </div>
          <div style="background: #ffffff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">
              100% Client-Side Privacy
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              The Sale Price Calculator runs 100% locally in your client web browser memory with zero server tracking or price logging.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #64748b;">
          <strong>Related Retail Tools:</strong>
          <a href="${DOMAIN}/discount-calculator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Discount Calculator</a> •
          <a href="${DOMAIN}/gst-invoice-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">GST Invoice Generator</a> •
          <a href="${DOMAIN}/barcode-generator" style="color: #4f46e5; margin-left: 0.5rem; text-decoration: underline;">Free Barcode Generator</a>
        </div>
      </section>`;

    default:
      return '';
  }
}
