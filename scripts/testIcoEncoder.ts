function encodeIcoFromPng(pngBytes: Uint8Array, width: number, height: number): Uint8Array {
  const totalSize = 6 + 16 + pngBytes.length;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // ICONDIR
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type 1 = ICO
  view.setUint16(4, 1, true); // 1 Image

  // ICONDIRENTRY
  buffer[6] = width >= 256 ? 0 : width;
  buffer[7] = height >= 256 ? 0 : height;
  buffer[8] = 0; // Color count
  buffer[9] = 0; // Reserved
  view.setUint16(10, 1, true); // Planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, pngBytes.length, true); // Size of image data
  view.setUint32(18, 22, true); // Offset of image data (6 + 16 = 22)

  // Copy PNG image data
  buffer.set(pngBytes, 22);

  return buffer;
}

const dummyPng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
const ico = encodeIcoFromPng(dummyPng, 32, 32);
console.log('ICO total size:', ico.length);
console.log('ICO type:', new DataView(ico.buffer).getUint16(2, true));
console.log('Image offset:', new DataView(ico.buffer).getUint32(18, true));
