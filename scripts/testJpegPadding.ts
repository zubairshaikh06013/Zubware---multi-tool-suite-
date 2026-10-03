import fs from 'fs';

// Create a minimal 1x1 white JPEG in node or create from scratch
// Let's create a minimal valid JPEG buffer
const minimalJpeg = Buffer.from([
  0xFF, 0xD8, // SOI
  0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, // APP0
  0xFF, 0xDB, 0x00, 0x43, 0x00, // DQT
  ...Array(64).fill(1),
  0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, // SOF0 (1x1)
  0xFF, 0xC4, 0x00, 0x1F, 0x00, // DHT
  0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B,
  0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, // SOS
  0x7F, // scan data
  0xFF, 0xD9 // EOI
]);

console.log('Original JPEG size:', minimalJpeg.length);

function padJpegToExactBytes(jpegBuffer: Uint8Array, targetBytes: number): Uint8Array {
  if (jpegBuffer.length === targetBytes) return jpegBuffer;
  if (jpegBuffer.length > targetBytes) return jpegBuffer;
  
  const diff = targetBytes - jpegBuffer.length;
  if (diff < 4) {
    // If diff is 1, 2, or 3, we cannot fit a 4-byte COM header without increasing size
    return jpegBuffer;
  }
  
  // Find EOI marker (0xFF, 0xD9) at the end
  let eoiPos = -1;
  for (let i = jpegBuffer.length - 2; i >= 0; i--) {
    if (jpegBuffer[i] === 0xFF && jpegBuffer[i + 1] === 0xD9) {
      eoiPos = i;
      break;
    }
  }
  if (eoiPos === -1) eoiPos = jpegBuffer.length; // fallback append
  
  // Build COM segment
  // Marker: 0xFF, 0xFE
  // Length: 2 bytes (value = diff - 2)
  // Payload: (diff - 4) bytes
  const comSegment = new Uint8Array(diff);
  comSegment[0] = 0xFF;
  comSegment[1] = 0xFE;
  const segLen = diff - 2;
  comSegment[2] = (segLen >> 8) & 0xFF;
  comSegment[3] = segLen & 0xFF;
  // fill payload with spaces (0x20)
  comSegment.fill(0x20, 4);

  const result = new Uint8Array(targetBytes);
  result.set(jpegBuffer.subarray(0, eoiPos), 0);
  result.set(comSegment, eoiPos);
  result.set(jpegBuffer.subarray(eoiPos), eoiPos + diff);
  
  return result;
}

const padded = padJpegToExactBytes(minimalJpeg, 500);
console.log('Padded JPEG size:', padded.length);
console.log('Last two bytes:', padded[padded.length - 2].toString(16), padded[padded.length - 1].toString(16));
