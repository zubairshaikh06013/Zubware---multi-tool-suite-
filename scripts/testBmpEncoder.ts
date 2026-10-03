function encodeBmp(width: number, height: number, rgba: Uint8Array): Uint8Array {
  const rowSize = (width * 3 + 3) & ~3; // 4-byte aligned
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
  view.setUint32(10, 54, true); // offset to pixel data

  // DIB Header (BITMAPINFOHEADER, 40 bytes)
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true); // bottom-up
  view.setUint16(26, 1, true); // 1 plane
  view.setUint16(28, 24, true); // 24 bpp
  view.setUint32(30, 0, true); // BI_RGB
  view.setUint32(34, imageSize, true);
  view.setInt32(38, 2835, true); // ~72 DPI
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Write pixel rows from bottom to top
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      buffer[rowOffset] = rgba[srcIdx + 2];     // B
      buffer[rowOffset + 1] = rgba[srcIdx + 1]; // G
      buffer[rowOffset + 2] = rgba[srcIdx];     // R
      rowOffset += 3;
    }
    offset += rowSize;
  }

  return buffer;
}

// Test with 2x2 image
const rgba = new Uint8Array([
  255, 0, 0, 255,   0, 255, 0, 255,
  0, 0, 255, 255,   255, 255, 255, 255
]);
const bmp = encodeBmp(2, 2, rgba);
console.log('BMP generated size:', bmp.length);
console.log('Header:', String.fromCharCode(bmp[0], bmp[1]));
console.log('File size in header:', new DataView(bmp.buffer).getUint32(2, true));
