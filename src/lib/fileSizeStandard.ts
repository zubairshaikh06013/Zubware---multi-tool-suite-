/**
 * Zubware Centralized File Size Standard & Format Utilities
 * 
 * Strict Single Byte-Level Standard:
 * 1 KB = 1,000 bytes (decimal standard)
 * 1 MB = 1,000,000 bytes (decimal standard)
 * 
 * All internal targets and comparisons use integer bytes.
 * Formatting for UI is derived directly from authoritative blob.size.
 */

export const DECIMAL_KB_BYTES = 1000;
export const DECIMAL_MB_BYTES = 1000000;

/**
 * Format bytes to human-readable string using consistent decimal units (1 KB = 1000 B, 1 MB = 1,000,000 B)
 */
export function formatDecimalBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < DECIMAL_KB_BYTES) {
    return `${Math.round(bytes)} B`;
  }
  if (bytes < DECIMAL_MB_BYTES) {
    const kb = bytes / DECIMAL_KB_BYTES;
    const formatted = kb % 1 === 0 ? kb.toFixed(0) : kb.toFixed(decimals);
    return `${formatted} KB`;
  }
  const mb = bytes / DECIMAL_MB_BYTES;
  const formatted = mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(decimals);
  return `${formatted} MB`;
}

/**
 * Convert user input number and unit ('KB' | 'MB') into exact integer bytes
 */
export function parseTargetBytes(size: number, unit: 'KB' | 'MB'): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  if (unit === 'MB') {
    return Math.round(size * DECIMAL_MB_BYTES);
  }
  return Math.round(size * DECIMAL_KB_BYTES);
}

/**
 * CRC32 Lookup Table and calculation for PNG chunks
 */
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[n] = c;
}

export function computeCrc32(buf: Uint8Array, start: number, len: number): number {
  let crc = 0xffffffff;
  for (let i = start; i < start + len; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Safely pad a valid JPEG to an exact byte count using standard JPEG Comment (COM) segment(s).
 * Does not corrupt visible pixels or decoding in any standard JPEG viewer or browser.
 */
export function padJpegToExactBytes(jpegBytes: Uint8Array, targetBytes: number): Uint8Array {
  if (jpegBytes.length >= targetBytes) return jpegBytes;
  const diff = targetBytes - jpegBytes.length;
  // A JPEG COM marker requires at least 4 bytes: 0xFF, 0xFE, length (2 bytes)
  if (diff < 4) return jpegBytes;

  // Locate final EOI marker (0xFF, 0xD9)
  let eoiPos = -1;
  for (let i = jpegBytes.length - 2; i >= 0; i--) {
    if (jpegBytes[i] === 0xFF && jpegBytes[i + 1] === 0xD9) {
      eoiPos = i;
      break;
    }
  }
  if (eoiPos === -1) eoiPos = jpegBytes.length;

  let remaining = diff;
  const segments: Uint8Array[] = [];

  while (remaining >= 4) {
    // Max JPEG segment length is 65535, minus 2 header bytes = 65533 payload bytes
    const segTotal = Math.min(remaining, 65530);
    const seg = new Uint8Array(segTotal);
    seg[0] = 0xFF;
    seg[1] = 0xFE; // COM marker
    const payloadLen = segTotal - 2;
    seg[2] = (payloadLen >> 8) & 0xFF;
    seg[3] = payloadLen & 0xFF;
    // Fill comment payload with harmless spaces
    seg.fill(0x20, 4);
    segments.push(seg);
    remaining -= segTotal;
  }

  // If remaining is 1, 2, or 3, we cannot safely fit another COM marker
  if (remaining > 0) {
    return jpegBytes;
  }

  const result = new Uint8Array(targetBytes);
  result.set(jpegBytes.subarray(0, eoiPos), 0);
  let curOffset = eoiPos;
  for (const seg of segments) {
    result.set(seg, curOffset);
    curOffset += seg.length;
  }
  result.set(jpegBytes.subarray(eoiPos), curOffset);

  return result;
}

/**
 * Safely pad a valid PNG to an exact byte count using standard PNG tEXt metadata chunk.
 * Calculates valid CRC32 so every PNG reader/browser parses it with 100% compliance.
 */
export function padPngToExactBytes(pngBytes: Uint8Array, targetBytes: number): Uint8Array {
  if (pngBytes.length >= targetBytes) return pngBytes;
  const diff = targetBytes - pngBytes.length;
  // Minimum tEXt chunk is 20 bytes: 4 len + 4 type ('tEXt') + 7 ('Comment') + 1 (null) + 4 CRC
  if (diff < 20) return pngBytes;

  // Verify IEND (last 12 bytes of standard PNG)
  const iendPos = pngBytes.length - 12;
  if (
    pngBytes[iendPos + 4] !== 0x49 ||
    pngBytes[iendPos + 5] !== 0x45 ||
    pngBytes[iendPos + 6] !== 0x4E ||
    pngBytes[iendPos + 7] !== 0x44
  ) {
    return pngBytes;
  }

  const keyword = 'Comment\0';
  const payloadLen = diff - 12; // payloadLen + 4 (type) + 4 (crc) + 4 (len) = diff bytes
  const chunk = new Uint8Array(diff);
  const view = new DataView(chunk.buffer);

  // Set Length (big endian 4 bytes)
  view.setUint32(0, payloadLen, false);

  // Set Type: 'tEXt'
  chunk[4] = 0x74; chunk[5] = 0x45; chunk[6] = 0x58; chunk[7] = 0x74;

  // Keyword
  for (let i = 0; i < keyword.length; i++) {
    chunk[8 + i] = keyword.charCodeAt(i);
  }

  // Fill text payload with spaces
  chunk.fill(0x20, 8 + keyword.length, diff - 4);

  // Compute CRC-32 over Type + Data
  const crcVal = computeCrc32(chunk, 4, 4 + payloadLen);
  view.setUint32(diff - 4, crcVal, false);

  const result = new Uint8Array(targetBytes);
  result.set(pngBytes.subarray(0, iendPos), 0);
  result.set(chunk, iendPos);
  result.set(pngBytes.subarray(iendPos), iendPos + diff);

  return result;
}

/**
 * Pure client-side standard Windows 24-bit BMP encoder.
 * Guarantees 100% valid BMP files across all browsers without canvas toBlob fallback issues.
 */
export function encodeBmpFromImageData(imageData: ImageData): Uint8Array {
  const { width, height, data } = imageData;
  const rowSize = (width * 3 + 3) & ~3; // 4-byte aligned rows
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;

  const buffer = new Uint8Array(fileSize);
  const view = new DataView(buffer.buffer);

  // BMP File Header (14 bytes)
  buffer[0] = 0x42; // 'B'
  buffer[1] = 0x4D; // 'M'
  view.setUint32(2, fileSize, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  view.setUint32(10, 54, true); // Pixel array offset

  // DIB Header (BITMAPINFOHEADER, 40 bytes)
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true); // positive = bottom-up
  view.setUint16(26, 1, true); // 1 plane
  view.setUint16(28, 24, true); // 24 bpp
  view.setUint32(30, 0, true); // BI_RGB (uncompressed)
  view.setUint32(34, imageSize, true);
  view.setInt32(38, 2835, true); // ~72 DPI
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Write pixel rows from bottom to top (BGR order)
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      buffer[rowOffset] = data[srcIdx + 2];     // B
      buffer[rowOffset + 1] = data[srcIdx + 1]; // G
      buffer[rowOffset + 2] = data[srcIdx];     // R
      rowOffset += 3;
    }
    offset += rowSize;
  }

  return buffer;
}

/**
 * Pure client-side standard Windows ICO container encoder.
 * Encapsulates a PNG byte stream into standard ICO format with ICONDIR and ICONDIRENTRY.
 */
export function encodeIcoFromPngBytes(pngBytes: Uint8Array, width: number, height: number): Uint8Array {
  const totalSize = 6 + 16 + pngBytes.length;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // ICONDIR (6 bytes)
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type: 1 = ICO
  view.setUint16(4, 1, true); // Number of images

  // ICONDIRENTRY (16 bytes)
  buffer[6] = width >= 256 ? 0 : width;
  buffer[7] = height >= 256 ? 0 : height;
  buffer[8] = 0; // Colors in palette
  buffer[9] = 0; // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, pngBytes.length, true); // Image data size
  view.setUint32(18, 22, true); // Offset of image data (6 + 16 = 22)

  // Copy PNG image data
  buffer.set(pngBytes, 22);

  return buffer;
}

/**
 * Detect runtime canvas export format capabilities of the current browser.
 */
export function checkBrowserCanvasSupport(): {
  jpeg: boolean;
  png: boolean;
  webp: boolean;
  avif: boolean;
} {
  const support = {
    jpeg: true,
    png: true,
    webp: false,
    avif: false
  };

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Check WebP
    const webpData = canvas.toDataURL('image/webp');
    support.webp = webpData.startsWith('data:image/webp');

    // Check AVIF
    const avifData = canvas.toDataURL('image/avif');
    support.avif = avifData.startsWith('data:image/avif');
  } catch {
    // Fallback defaults
  }

  return support;
}
