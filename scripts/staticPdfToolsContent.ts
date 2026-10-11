/**
 * Static HTML generator for Batch 4 (16 PDF Tools)
 * Provides comprehensive, semantic HTML for static prerendering and search crawlers.
 */

export function getStaticPdfToolSectionHtml(toolId: string, domain: string): string {
  switch (toolId) {
    case 'pdf-merge':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF Merge: Combine Multiple Documents into One Unified PDF
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Zubware PDF Merge combines separate PDF files, scanned contracts, academic research papers, and corporate financial statements into a single sequentially ordered PDF directly inside your web browser. Powered by client-side WebAssembly and pdf-lib, your private records never travel across remote servers.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Drag &amp; Drop Reordering</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Arrange files into the exact sequence required. Move items up or down with responsive control handles, audit individual document page counts, and eliminate accidental misordering before merging.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">100% Vector Fidelity</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Unlike converters that flatten pages into low-resolution images, our engine extracts and stitches native object streams. Crisp vector typography, sharp line art, form fields, and hyperlinks remain intact.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Zero Server Uploads</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              All document processing takes place in local browser RAM. Whether assembling confidential tax filings or sensitive NDAs, zero bytes are transmitted to external cloud infrastructure.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-split" style="color: #0284c7; text-decoration: underline;">PDF Split</a>, <a href="${domain}/image-to-pdf" style="color: #0284c7; text-decoration: underline;">Image to PDF</a>, <a href="${domain}/protect-pdf" style="color: #0284c7; text-decoration: underline;">Protect PDF</a>, and <a href="${domain}/edit-pdf" style="color: #0284c7; text-decoration: underline;">Online PDF Editor</a>.
        </div>
      </section>
      `;

    case 'pdf-split':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF Split: Separate, Extract &amp; Divide PDF Pages
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Divide massive PDF documents into standalone chapters, isolated page ranges, or individual single-page files with complete visual control. Zubware PDF Split offers 3 specialized splitting modes engineered for office workers, students, legal teams, and administrators.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Extract All Pages</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Disassembles your entire multi-page document so that every single page becomes an independent PDF file. Automatically packaged into a clean, lightweight ZIP archive for instant one-click download.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Custom Page Ranges</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Specify comma-delimited ranges such as 1-4, 7, 10-15. Each defined range is saved into its own separate PDF document, preserving original page ordering.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Interval Splitting</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Automate document partitioning by setting a fixed page interval (e.g., split every 2 pages or every 5 pages). Perfect for standardized multi-student exam papers and multi-vendor invoices.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>, <a href="${domain}/delete-pdf-pages" style="color: #0284c7; text-decoration: underline;">Delete PDF Pages</a>, and <a href="${domain}/extract-pdf-pages" style="color: #0284c7; text-decoration: underline;">Extract PDF Pages</a>.
        </div>
      </section>
      `;

    case 'image-to-pdf':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Image to PDF: Convert JPG, PNG &amp; WebP into Print-Ready PDF
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Transform camera snapshots, scanned receipts, digital drawings, and screenshots into standardized, multi-page PDF documents. Choose standard ISO page sizes, adjust margin padding, reorder images intuitively, and export pristine vector-wrapped PDFs in seconds.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Paper Size Standards</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Select between A4 (standard international documentation), US Letter (North American standard), or Fit to Image (creates custom page dimensions matching the exact image aspect ratio without letterboxing).
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Margin &amp; Bleed Controls</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Configure edge spacing with three clean presets: None (full-bleed edge-to-edge rendering), Small (10pt) for standard office printing, or Large (20pt) for formal corporate presentation sheets.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Multi-Format Batch Support</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Upload JPG, JPEG, PNG, and modern WebP images simultaneously. Reorder images in your queue with easy up/down controls, rotate orientations (Portrait vs. Landscape), and compile dozens of images into a single PDF.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-images" style="color: #0284c7; text-decoration: underline;">PDF to Images</a>, <a href="${domain}/pdf-to-jpg" style="color: #0284c7; text-decoration: underline;">PDF to JPG</a>, and <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>.
        </div>
      </section>
      `;

    case 'pdf-to-images':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF to Images: Extract &amp; Rasterize PDF Pages as PNG or JPG
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Convert any PDF document into crisp, high-resolution raster images in browser memory. Whether creating PowerPoint presentation slides, web banner graphics, or archiving book pages, Zubware PDF to Images delivers true pixel-perfect rendering using modern canvas WebGL/Canvas2D acceleration.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">PNG vs. JPG Formats</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Choose Lossless PNG for razor-sharp text, CAD blueprints, and high-contrast infographics, or Compressed JPG for photographic booklets and smaller file storage footprints.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Resolution Scaling (DPI)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Select between 1x (standard web viewing ~72 DPI), 2x (retina displays ~150 DPI), and 3x (ultra-fine print quality ~300 DPI) for unmatched clarity when zooming into micro-text.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Individual &amp; ZIP Download</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Download isolated single-page images as you browse thumbnails, or hit Download All (ZIP) to pack every rendered page into an organized archive with zero cloud waiting queues.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-jpg" style="color: #0284c7; text-decoration: underline;">PDF to JPG Converter</a>, <a href="${domain}/image-to-pdf" style="color: #0284c7; text-decoration: underline;">Image to PDF</a>, and <a href="${domain}/pdf-to-text" style="color: #0284c7; text-decoration: underline;">PDF to Text Converter</a>.
        </div>
      </section>
      `;

    case 'delete-pdf-pages':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Delete PDF Pages: Remove Unwanted, Blank &amp; Confidential Pages
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Clean up PDF documents by removing accidental blank scans, outdated policy terms, duplicate pages, or sensitive internal addendums. Zubware Delete PDF Pages reconstructs a lean, pristine PDF containing only the pages you want, executing entirely in client-side memory.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Visual Thumbnail Grid</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Browse high-fidelity preview thumbnails of every page in your document. Click any page card to toggle deletion with clear visual badging and live remaining page counters.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Range &amp; Number Syntax</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Prefer keyboard entry? Input exact page numbers and ranges such as 2, 5-8, 14 to instantly target bulk sections without manual clicking.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">True Object Cleanup</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Deleted pages are not merely hidden—they are completely omitted during document re-serialization, purging orphan font descriptors and embedded assets to reduce overall file weight.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/extract-pdf-pages" style="color: #0284c7; text-decoration: underline;">Extract PDF Pages</a>, <a href="${domain}/pdf-split" style="color: #0284c7; text-decoration: underline;">PDF Split</a>, and <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>.
        </div>
      </section>
      `;

    case 'extract-pdf-pages':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Extract PDF Pages: Pull Specific Pages into a New PDF
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Isolate key chapters, executive summaries, signed signature sheets, or specific diagrams from large PDF manuals. Zubware Extract PDF Pages creates a standalone document containing solely your chosen pages, preserving fonts, vector graphics, and metadata with zero server exposure.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Extraction vs. Splitting</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              While splitting separates an entire document into multiple pieces, extraction pulls only your target pages into a singular, clean document while leaving unneeded sections behind.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Intuitive Page Selection</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Click thumbnails directly or enter comma-separated values like 1, 4-6, 11. The output PDF compiles extracted pages in the exact chronological sequence specified.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">No Quality Degradation</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Text stays searchable, hyperlinks remain clickable, and high-resolution figures retain their original vector clarity. Zero re-compression or rasterization artifacts are introduced.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/delete-pdf-pages" style="color: #0284c7; text-decoration: underline;">Delete PDF Pages</a>, <a href="${domain}/pdf-split" style="color: #0284c7; text-decoration: underline;">PDF Split</a>, and <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>.
        </div>
      </section>
      `;

    case 'protect-pdf':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Protect PDF: Password Encryption &amp; Permission Restriction Online
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Shield confidential financial statements, proprietary patents, legal briefs, and personal records against unauthorized viewing, printing, and copying. Powered by standard-compliant AES encryption directly in your browser, your passwords and sensitive files are never exposed to remote third parties.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">User Password (Open Lock)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Locks the PDF document so that unauthorized recipients cannot view or render its contents without typing the required passphrase. Works universally across Adobe Acrobat, Apple Preview, and web browsers.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Owner Password &amp; Permissions</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Enforce operational restrictions on your documents. Prevent printing in high resolution, prohibit copying text and graphics to clipboard, and block unauthorized page modifications or form tampering.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Client-Side Cipher Engine</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              All cryptographic key derivation and AES encryption routines execute inside browser WebAssembly. Your unencrypted source documents and chosen passwords never touch a network socket.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/unlock-pdf" style="color: #0284c7; text-decoration: underline;">Unlock PDF</a>, <a href="${domain}/pdf-signature" style="color: #0284c7; text-decoration: underline;">Sign PDF Online</a>, and <a href="${domain}/edit-pdf" style="color: #0284c7; text-decoration: underline;">Online PDF Editor</a>.
        </div>
      </section>
      `;

    case 'unlock-pdf':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Unlock PDF: Remove Passwords &amp; Security Restrictions
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Eliminate recurring password prompts from your personal e-statements, payslips, utility bills, and contracts. By entering your known password once, Zubware Unlock PDF decrypts the document in browser memory and outputs a clean, unencrypted PDF that opens friction-free anywhere.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Permanent Password Removal</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Strips internal security handler dictionaries and encryption keys from the PDF structure. The resulting output can be merged, printed, annotated, and shared without entering passphrases repeatedly.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Authorized Owner Utility</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              This tool is engineered for authorized document owners to streamline routine workflows. It decrypts files using legitimate credentials; it does not crack or brute-force unknown passwords.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Total Financial Privacy</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Personal payslips and bank statements carry highly confidential data. Because decryption executes 100% locally on your machine, your private financial records and passwords never touch a server.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/protect-pdf" style="color: #0284c7; text-decoration: underline;">Protect PDF</a>, <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>, and <a href="${domain}/pdf-size-adjuster" style="color: #0284c7; text-decoration: underline;">PDF Size Adjuster</a>.
        </div>
      </section>
      `;

    case 'pdf-size-adjuster':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF Size Adjuster: Precision Target KB/MB Adjustment for Upload Portals
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Government recruitment portals (UPSC, SSC, IBPS, State PSCs), university admission gateways, and visa applications frequently mandate strict file size boundaries—rejecting documents that are either too large (over 200KB) or too small (under 100KB). Zubware PDF Size Adjuster solves both problems with mathematical byte accuracy in your browser.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #4338ca; margin-bottom: 0.5rem;">Expansion Mode (Increasing PDF Size)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              When an application portal rejects your certificate for being below the minimum size (e.g., must be between 100KB and 300KB), this mode adds standard-compliant PDF-internal private data streams (PieceInfo). Crucially, it does NOT blur text, degrade visual clarity, or alter page layout. Your document remains 100% vector-crisp and legible.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #0284c7; margin-bottom: 0.5rem;">Reduction Mode (Compressing PDF Size)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              When your scanned PDF exceeds strict file caps (e.g., max 500KB or 2MB), this mode optimizes object streams, purges duplicate font subsets, and applies smart stream compression. It shrinks file weight while preserving essential text sharpness and document readability.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/signature-resizer" style="color: #0284c7; text-decoration: underline;">Signature Resizer</a>, <a href="${domain}/photo-signature-joiner" style="color: #0284c7; text-decoration: underline;">Photo &amp; Signature Joiner</a>, and <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>.
        </div>
      </section>
      `;

    case 'pdf-to-jpg':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF to JPG: Convert PDF Pages into High-Quality JPEG Images
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Convert PDF reports, product catalogs, brochures, and artwork into universally compatible JPG image files. Zubware PDF to JPG gives you direct control over rendering resolution, JPEG compression quality, and batch export packaging with zero server uploads.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Quality Presets</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Choose between High (100%) for maximum photo fidelity and crisp text readability, Medium (80%) for balanced web sharing, or Low (60%) for lightweight email attachments.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Multi-Scale DPI Rendering</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Scale your output canvas by 1x (standard 72 DPI display), 2x (retina 150 DPI), or 3x (300 DPI print quality) to prevent pixelation on ultra-high-definition monitors.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Automated Background Filling</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Unlike poorly configured converters that render transparent PDF layers as solid black, our canvas pipeline automatically fills background canvas bounds with clean solid white for natural image viewing.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-images" style="color: #0284c7; text-decoration: underline;">PDF to Images (PNG/JPG)</a>, <a href="${domain}/image-to-pdf" style="color: #0284c7; text-decoration: underline;">Image to PDF</a>, and <a href="${domain}/pdf-to-word" style="color: #0284c7; text-decoration: underline;">PDF to Word</a>.
        </div>
      </section>
      `;

    case 'edit-pdf':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Online PDF Editor: Add Text, Freehand Drawings &amp; Annotations Free
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Fill out non-interactive PDF application forms, annotate blueprints, sign documents, and add textual feedback directly in your browser. Zubware Online PDF Editor provides an intuitive client-side canvas workspace that permanently flattens your edits into the PDF with zero software installations and zero watermarks.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Add Text Overlays</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Click anywhere on any page to type text. Adjust font sizes (10pt to 32pt), select colors (black, blue, red, green), and reposition text blocks to fill out unfillable scanned forms seamlessly.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Freehand Drawing &amp; Pen</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Draw circles around key clauses, underline important terms, sketch arrows, and write handwritten notes with smooth mouse and touchscreen pen support, customizable stroke weights, and colors.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Permanent Stream Flattening</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Edits are not temporary HTML overlays. When you click download, pdf-lib burns text and drawings directly into the PDF content stream so they display correctly on every PDF viewer.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-signature" style="color: #0284c7; text-decoration: underline;">Sign PDF Online</a>, <a href="${domain}/protect-pdf" style="color: #0284c7; text-decoration: underline;">Protect PDF</a>, and <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>.
        </div>
      </section>
      `;

    case 'pdf-to-word':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF to Word: Convert PDF into Editable Microsoft Word (.DOCX)
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Extract formatted text, headings, and paragraphs from PDF documents and compile them into a genuine OpenXML Microsoft Word (.docx) document. Zubware PDF to Word extracts digital content client-side, builds Word XML packages with JSZip, and lets you edit contracts and resumes in Word or Google Docs immediately.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Native OpenXML Packaging</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Generates legitimate .docx files compliant with Microsoft Word standards, including proper XML namespaces, paragraph structures, and document body tags. Opens natively in MS Word, LibreOffice, and Google Docs.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Interactive HTML Preview</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Inspect converted page contents inside our interactive reading pane before exporting. Review paragraph groupings and page breaks in real time to verify text accuracy.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Digital Vector Scope</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Extracts selectable digital text. For image-scanned documents where letters are trapped inside pictures, use our neural PDF to Text OCR converter for optical recognition.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/word-to-pdf" style="color: #0284c7; text-decoration: underline;">Word to PDF Converter</a>, <a href="${domain}/pdf-to-text" style="color: #0284c7; text-decoration: underline;">PDF to Text Converter</a>, and <a href="${domain}/pdf-to-excel" style="color: #0284c7; text-decoration: underline;">PDF to Excel Converter</a>.
        </div>
      </section>
      `;

    case 'word-to-pdf':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Word to PDF: Convert DOCX Documents into Professional PDF
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Convert Microsoft Word (.docx) documents into clean, standardized vector PDF files directly in your web browser. Zubware Word to PDF unzips document XML, maps headings, lists, tables, and paragraphs, and renders crisp vector PDF files ready for printing and email distribution.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Structure &amp; Hierarchy Parsing</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Recognizes Heading 1, 2, 3 styles, standard body paragraphs, bulleted item lists, and multi-cell tabular data (w:tbl) to recreate document flow accurately.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Paper Geometry Controls</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Customize your target document dimensions between A4 and US Letter, adjust base typographic font sizing (9pt to 14pt), and set margin padding (10mm to 25mm) for precise print formatting.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Modern OpenXML Standard</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Built specifically for modern .docx OpenXML formats (Office 2007 to present). For legacy 1997-2003 binary .doc files, save them as .docx in Word first before converting.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-word" style="color: #0284c7; text-decoration: underline;">PDF to Word Converter</a>, <a href="${domain}/pdf-merge" style="color: #0284c7; text-decoration: underline;">PDF Merge</a>, and <a href="${domain}/edit-pdf" style="color: #0284c7; text-decoration: underline;">Online PDF Editor</a>.
        </div>
      </section>
      `;

    case 'pdf-to-text':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF to Text: Extract Digital Text &amp; Scanned Documents with OCR
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Extract plain text from research papers, ebooks, invoices, and historical archives. Zubware PDF to Text features a dual-engine architecture: ultra-fast digital vector text parsing via pdfjs-dist, and client-side neural optical character recognition (OCR) via Tesseract.js for scanned, image-only documents.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #b45309; margin-bottom: 0.5rem;">Digital Mode (Selectable Text)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Reads embedded Unicode font tables directly from modern PDF files. Operates instantaneously across hundreds of pages, extracting raw strings with zero typos and organizing output cleanly by page markers.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #0f766e; margin-bottom: 0.5rem;">OCR Scan Mode (Neural OCR)</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              When documents consist of scanned flat photos where text cannot be selected, our Tesseract WebAssembly engine rasterizes pages to high-resolution canvas buffers and transcribes printed characters across multiple supported languages without cloud uploads.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-excel" style="color: #0284c7; text-decoration: underline;">PDF to Excel Converter</a>, <a href="${domain}/pdf-to-word" style="color: #0284c7; text-decoration: underline;">PDF to Word Converter</a>, and <a href="${domain}/handwriting-to-text" style="color: #0284c7; text-decoration: underline;">Handwriting to Text OCR</a>.
        </div>
      </section>
      `;

    case 'pdf-to-excel':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          PDF to Excel: Extract Tables to Microsoft Excel (.XLSX) &amp; CSV
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Stop manually retyping numbers from PDF invoices, bank account statements, tax summaries, and inventory manifests. Zubware PDF to Excel groups text coordinates into tabular rows and columns, displays an editable interactive grid, and exports directly to .xlsx and .csv in your browser.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Geometric Coordinate Bucketing</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Extracts raw PDF text glyphs alongside their precise 2D (X, Y) page coordinates. Groups text elements sharing similar Y positions into coherent rows, then orders items by horizontal X coordinates to preserve column alignment.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Interactive Grid Editor</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Preview your reconstructed spreadsheet before downloading. Fix cell text, insert missing rows, or remove unnecessary header noise directly within our responsive table interface.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Dual XLSX &amp; CSV Export</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Download authentic OpenXML .xlsx spreadsheets for Microsoft Excel and Apple Numbers, or export standard comma-separated .csv files for Google Sheets and accounting software.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/pdf-to-text" style="color: #0284c7; text-decoration: underline;">PDF to Text Converter</a>, <a href="${domain}/gst-invoice-generator" style="color: #0284c7; text-decoration: underline;">GST Invoice Generator</a>, and <a href="${domain}/pdf-to-word" style="color: #0284c7; text-decoration: underline;">PDF to Word Converter</a>.
        </div>
      </section>
      `;

    case 'pdf-signature':
      return `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Sign PDF Online: Draw, Type &amp; Embed Electronic Signatures
        </h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">
          Sign employment agreements, NDAs, lease contracts, and permission slips without printing a single sheet of paper. Zubware Sign PDF Online provides a fast, privacy-focused electronic signing workflow with 3 signature creation methods and interactive page placement, executing entirely in client-side memory.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Draw Autograph</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Draw your natural handwritten signature with mouse or touchscreen finger/stylus support on an HTML5 canvas featuring smooth bezier curve smoothing and crisp anti-aliasing.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Type Cursive Signature</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Type your full legal name to generate an elegant, realistic cursive signature in seconds. Ideal for quick approvals when signing on desktop workstations without touchscreens.
            </p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.75rem; border: 1px solid #cbd5e1;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Upload Signature Image</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
              Already have a scanned transparent PNG of your signature or official company stamp? Upload it directly into the tool for seamless placement on any document line.
            </p>
          </div>
        </div>
        <div style="margin-top: 1.25rem; font-size: 0.85rem; color: #64748b;">
          Related workflows: <a href="${domain}/edit-pdf" style="color: #0284c7; text-decoration: underline;">Online PDF Editor</a>, <a href="${domain}/protect-pdf" style="color: #0284c7; text-decoration: underline;">Protect PDF</a>, and <a href="${domain}/signature-maker" style="color: #0284c7; text-decoration: underline;">Online Signature Maker</a>.
        </div>
      </section>
      `;

    default:
      return '';
  }
}
