// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf: Uint8Array, start: number, len: number): number {
  let crc = 0xffffffff;
  for (let i = start; i < start + len; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Minimal 1x1 PNG:
const minimalPng = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR len 13
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, // 1x1, 8bit RGB
  0x90, 0x77, 0x53, 0xDE, // IHDR CRC
  0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT len 12
  0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x03, 0x01, 0x01, 0x00, // compressed data
  0x18, 0xDD, 0x8D, 0xB0, // IDAT CRC
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
]);

console.log('Original PNG size:', minimalPng.length);

function padPngToExactBytes(pngBuffer: Uint8Array, targetBytes: number): Uint8Array {
  if (pngBuffer.length >= targetBytes) return pngBuffer;
  const diff = targetBytes - pngBuffer.length;
  // Minimum tEXt chunk is 20 bytes: 4 len + 4 type ('tEXt') + 7 ('Comment') + 1 (null) + 4 CRC
  if (diff < 20) return pngBuffer;

  // Find IEND chunk at end (last 12 bytes)
  let iendPos = pngBuffer.length - 12;
  // Verify IEND
  if (pngBuffer[iendPos + 4] !== 0x49 || pngBuffer[iendPos + 5] !== 0x45 ||
      pngBuffer[iendPos + 6] !== 0x4E || pngBuffer[iendPos + 7] !== 0x44) {
    return pngBuffer;
  }

  const keyword = 'Comment\0'; // 8 bytes
  const payloadLen = diff - 12; // length = type(4) + crc(4) + payload(diff - 12) => diff bytes total chunk
  const textLen = payloadLen - keyword.length;

  const chunk = new Uint8Array(diff);
  // Length (big endian 4 bytes)
  const view = new DataView(chunk.buffer);
  view.setUint32(0, payloadLen, false);

  // Type: 'tEXt'
  chunk[4] = 0x74; chunk[5] = 0x45; chunk[6] = 0x58; chunk[7] = 0x74;

  // Keyword
  for (let i = 0; i < keyword.length; i++) {
    chunk[8 + i] = keyword.charCodeAt(i);
  }

  // Text payload
  chunk.fill(0x20, 8 + keyword.length, diff - 4);

  // Compute CRC over type + data (from offset 4, length = 4 + payloadLen)
  const crcVal = crc32(chunk, 4, 4 + payloadLen);
  view.setUint32(diff - 4, crcVal, false);

  const result = new Uint8Array(targetBytes);
  result.set(pngBuffer.subarray(0, iendPos), 0);
  result.set(chunk, iendPos);
  result.set(pngBuffer.subarray(iendPos), iendPos + diff);

  return result;
}

const padded = padPngToExactBytes(minimalPng, 300);
console.log('Padded PNG size:', padded.length);
console.log('Matches target 300:', padded.length === 300);
