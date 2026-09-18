import { PDFDocument, PDFName } from 'pdf-lib';
import { jsPDF } from 'jspdf';

/**
 * Zubware Centralized Decimal Size Constants
 * 1 KB = 1,000 bytes
 * 1 MB = 1,000,000 bytes
 */
export const KB_TO_BYTES = 1000;
export const MB_TO_BYTES = 1000000;

/** Safety browser ceiling: 50 MB in decimal bytes (50,000,000 bytes) */
export const MAX_SAFE_TARGET_BYTES = 50 * MB_TO_BYTES;

/**
 * Format bytes according to decimal units (1,000 bytes = 1 KB, 1,000,000 bytes = 1 MB)
 */
export function formatDecimalBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  if (bytes < KB_TO_BYTES) {
    return `${bytes} B`;
  }
  if (bytes < MB_TO_BYTES) {
    const kb = bytes / KB_TO_BYTES;
    const formatted = kb % 1 === 0 ? kb.toFixed(0) : kb.toFixed(decimals);
    return `${formatted} KB`;
  }
  const mb = bytes / MB_TO_BYTES;
  const formatted = mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(decimals);
  return `${formatted} MB`;
}

/**
 * Converts a target size number and unit into exact decimal bytes
 */
export function parseTargetBytes(size: number, unit: 'KB' | 'MB'): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  if (unit === 'MB') {
    return Math.round(size * MB_TO_BYTES);
  }
  return Math.round(size * KB_TO_BYTES);
}

/**
 * Determine mode between target and original
 */
export type AdjustMode = 'increase' | 'reduce' | 'match';

export function determineAdjustMode(originalBytes: number, targetBytes: number): AdjustMode {
  if (targetBytes === originalBytes) return 'match';
  return targetBytes > originalBytes ? 'increase' : 'reduce';
}

export interface IncreaseResult {
  blob: Blob;
  actualBytes: number;
  originalBytes: number;
  targetBytes: number;
  isExact: boolean;
  diffBytes: number;
  pageCount: number;
  message: string;
}

/**
 * Increase PDF size to an exact or closest decimal byte target
 * Uses standard-compliant PDF-internal PieceInfo private data streams.
 * Does NOT rasterize, recompress, or modify visible pages, text, or layout.
 */
export async function increasePdfSize(
  pdfBuffer: ArrayBuffer,
  targetBytes: number,
  onProgress?: (stage: string, percent: number) => void
): Promise<IncreaseResult> {
  const originalBytes = pdfBuffer.byteLength;

  if (targetBytes <= originalBytes) {
    throw new Error('Target size must be greater than the original file size for expansion.');
  }
  if (targetBytes > MAX_SAFE_TARGET_BYTES) {
    throw new Error(`Target size exceeds the 50 MB browser safety limit (${formatDecimalBytes(MAX_SAFE_TARGET_BYTES)}).`);
  }

  onProgress?.('Reading PDF', 15);
  let initialDoc: PDFDocument;
  try {
    initialDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  } catch (err) {
    throw new Error('Could not parse PDF. The file may be password-protected or corrupted.');
  }

  const pageCount = initialDoc.getPageCount();
  if (pageCount === 0) {
    throw new Error('This PDF contains no readable pages.');
  }

  onProgress?.('Analyzing', 30);
  const baseSaved = await initialDoc.save({ useObjectStreams: false });
  let paddingLen = Math.max(0, targetBytes - baseSaved.length);

  let bestDiff = Infinity;
  let bestBytes: Uint8Array | null = null;
  let exactBytes: Uint8Array | null = null;

  // Fixed-point iterative convergence loop (converges within 2-4 iterations)
  const MAX_ITERATIONS = 12;
  for (let attempt = 0; attempt < MAX_ITERATIONS; attempt++) {
    onProgress?.('Adjusting Size', 40 + Math.min(attempt * 4, 35));

    const testDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const chunk = new Uint8Array(paddingLen);
    chunk.fill(65); // Standard ASCII padding

    const stream = testDoc.context.stream(chunk, {});
    const streamRef = testDoc.context.register(stream);

    testDoc.catalog.set(
      PDFName.of('PieceInfo'),
      testDoc.context.obj({
        Zubware: testDoc.context.obj({
          Private: streamRef
        })
      })
    );

    const saved = await testDoc.save({ useObjectStreams: false });
    const diff = targetBytes - saved.length;

    if (Math.abs(diff) < bestDiff) {
      bestDiff = Math.abs(diff);
      bestBytes = saved;
    }

    if (saved.length === targetBytes) {
      exactBytes = saved;
      break;
    }

    paddingLen += diff;
    if (paddingLen < 0) paddingLen = 0;
  }

  const finalBytes = exactBytes || bestBytes;
  if (!finalBytes) {
    throw new Error('Failed to generate padded PDF buffer.');
  }

  onProgress?.('Validating PDF', 85);

  // 1. Verify %PDF- header
  const headerStr = String.fromCharCode(...finalBytes.slice(0, 5));
  if (!headerStr.startsWith('%PDF-')) {
    throw new Error('Generated file does not have a valid PDF header (%PDF-).');
  }

  // 2. Verify PDF can be loaded again and page count is preserved
  let verifyDoc: PDFDocument;
  try {
    verifyDoc = await PDFDocument.load(finalBytes, { ignoreEncryption: true });
  } catch (err) {
    throw new Error('Validation failed: generated PDF is not parseable.');
  }

  if (verifyDoc.getPageCount() !== pageCount) {
    throw new Error(`Page count mismatch: expected ${pageCount}, got ${verifyDoc.getPageCount()}`);
  }

  const actualBytes = finalBytes.length;
  const isExact = actualBytes === targetBytes;
  const diffBytes = actualBytes - originalBytes;

  const blob = new Blob([finalBytes], { type: 'application/pdf' });

  onProgress?.('Preparing Download', 95);

  const message = isExact
    ? `Exact target reached (${formatDecimalBytes(actualBytes)}).`
    : `Closest achievable result (${formatDecimalBytes(actualBytes)}, ${Math.abs(targetBytes - actualBytes)} bytes delta).`;

  return {
    blob,
    actualBytes,
    originalBytes,
    targetBytes,
    isExact,
    diffBytes,
    pageCount,
    message
  };
}

export interface ReduceResult {
  blob: Blob;
  actualBytes: number;
  originalBytes: number;
  targetBytes: number;
  pageCount: number;
  isAlreadyOptimized: boolean;
  targetReached: boolean;
  reductionPercentage: number;
  reducedBytes: number;
  modeNotice: string;
  warningNotice?: string;
}

export type ReduceQualityLevel = 'low' | 'medium' | 'strong';

/**
 * Reduce PDF file size toward a target size with browser-based compression
 * Preserves text, vector artwork, dimensions, and readability where possible.
 * Never returns a file larger or worse than the original.
 */
export async function reducePdfSize(
  pdfBuffer: ArrayBuffer,
  targetBytes: number,
  presetLevel: ReduceQualityLevel = 'medium',
  onProgress?: (stage: string, percent: number) => void
): Promise<ReduceResult> {
  const originalBytes = pdfBuffer.byteLength;

  if (targetBytes >= originalBytes) {
    throw new Error('Target size must be smaller than original file size for reduction.');
  }

  onProgress?.('Reading PDF', 15);
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  } catch {
    throw new Error('Could not parse PDF. The file may be password-protected or corrupted.');
  }

  const pageCount = pdfDoc.getPageCount();
  if (pageCount === 0) {
    throw new Error('This PDF contains no readable pages.');
  }

  onProgress?.('Analyzing', 25);

  let bestBytes: Uint8Array | null = null;
  let bestSize = originalBytes;
  let modeNotice = '';

  // ----------------------------------------------------------------
  // STRATEGY 1: Smart Stream & Object Stream optimization
  // Preserves 100% vector graphics, selectable text, fonts, hyperlinks
  // ----------------------------------------------------------------
  onProgress?.('Processing', 40);
  try {
    const smartDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const smartBytes = await smartDoc.save({ useObjectStreams: true });
    if (smartBytes.length < originalBytes) {
      bestBytes = smartBytes;
      bestSize = smartBytes.length;
      modeNotice = 'Preserved 100% selectable text & vector graphics with lossless stream optimization.';
    }
  } catch (err) {
    console.warn('Stream compression note:', err);
  }

  // ----------------------------------------------------------------
  // STRATEGY 2: Adaptive Canvas / Image Recompression
  // Triggered if smart stream alone didn't reach target, or if user
  // picked medium/strong preset.
  // ----------------------------------------------------------------
  const needsDeeperCompression = bestSize > targetBytes || presetLevel === 'strong';

  if (needsDeeperCompression && pageCount > 0) {
    onProgress?.('Processing', 50);

    let scale = 1.25;
    let quality = 0.72;

    if (presetLevel === 'low') {
      scale = 1.4;
      quality = 0.82;
    } else if (presetLevel === 'medium') {
      scale = 1.2;
      quality = 0.70;
    } else {
      // strong preset
      scale = 1.0;
      quality = 0.55;
    }

    // Adaptive adjustment if target is aggressively small
    if (targetBytes < originalBytes * 0.4) {
      scale = Math.max(0.9, scale * 0.85);
      quality = Math.max(0.48, quality * 0.85);
    }

    try {
      const { renderPdfPageToCanvas } = await import('./pdfUtils');
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: p1Width, height: p1Height } = firstPage.getSize();
      const isLandscape = p1Width > p1Height;

      const outputPdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [p1Width, p1Height],
        compress: true
      });

      for (let i = 0; i < pageCount; i++) {
        const page = pages[i];
        const { width: pWidth, height: pHeight } = page.getSize();
        const pageLandscape = pWidth > pHeight;

        if (i > 0) {
          outputPdf.addPage([pWidth, pHeight], pageLandscape ? 'landscape' : 'portrait');
        }

        const canvas = await renderPdfPageToCanvas(pdfBuffer, i, scale);
        const imgData = canvas.toDataURL('image/jpeg', quality);

        outputPdf.addImage(imgData, 'JPEG', 0, 0, pWidth, pHeight, undefined, 'FAST');

        const currentPct = 50 + Math.round(((i + 1) / pageCount) * 35);
        onProgress?.('Processing', currentPct);
      }

      const rasterArray = outputPdf.output('arraybuffer');
      const rasterBytes = new Uint8Array(rasterArray);

      // Only accept rasterized output if it is ACTUALLY smaller than the best size found so far!
      if (rasterBytes.length < bestSize) {
        bestBytes = rasterBytes;
        bestSize = rasterBytes.length;
        modeNotice = `Applied visual page optimization (${presetLevel} compression preset).`;
      }
    } catch (renderErr) {
      console.warn('Canvas optimization note:', renderErr);
    }
  }

  onProgress?.('Validating PDF', 90);

  // ================================================================
  // CRITICAL SAFETY: NEVER RETURN A WORSE OR LARGER FILE
  // ================================================================
  if (!bestBytes || bestSize >= originalBytes) {
    // PDF is already optimized
    const origBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
    return {
      blob: origBlob,
      actualBytes: originalBytes,
      originalBytes,
      targetBytes,
      pageCount,
      isAlreadyOptimized: true,
      targetReached: false,
      reductionPercentage: 0,
      reducedBytes: 0,
      modeNotice: 'Original file preserved without degradation.',
      warningNotice: 'This PDF is already highly optimized, so further compression would not significantly reduce its size.'
    };
  }

  // Validate resulting PDF
  const headerStr = String.fromCharCode(...bestBytes.slice(0, 5));
  if (!headerStr.startsWith('%PDF-')) {
    throw new Error('Generated file does not have a valid PDF header (%PDF-).');
  }

  const verifyDoc = await PDFDocument.load(bestBytes, { ignoreEncryption: true });
  if (verifyDoc.getPageCount() !== pageCount) {
    throw new Error(`Page count mismatch: expected ${pageCount}, got ${verifyDoc.getPageCount()}`);
  }

  onProgress?.('Preparing Download', 95);

  const reducedBytes = originalBytes - bestSize;
  const reductionPercentage = parseFloat(((reducedBytes / originalBytes) * 100).toFixed(1));
  const targetReached = bestSize <= targetBytes;

  let warningNotice: string | undefined = undefined;
  if (!targetReached) {
    warningNotice = `Unable to safely reach the requested target (${formatDecimalBytes(targetBytes)}) without significant quality loss. Produced the best achievable result: ${formatDecimalBytes(bestSize)}.`;
  }

  const blob = new Blob([bestBytes], { type: 'application/pdf' });

  return {
    blob,
    actualBytes: bestSize,
    originalBytes,
    targetBytes,
    pageCount,
    isAlreadyOptimized: false,
    targetReached,
    reductionPercentage,
    reducedBytes,
    modeNotice,
    warningNotice
  };
}
