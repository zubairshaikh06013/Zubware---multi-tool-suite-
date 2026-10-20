/** Pad a generated PDF with PDF whitespace before its final startxref section.
 * Existing object offsets, page data, and the final EOF marker remain unchanged.
 * Padding is size matching, not additional image quality or compression.
 */
export function matchPdfByteLength(bytes: Uint8Array, targetBytes: number): Uint8Array {
  if (!Number.isSafeInteger(targetBytes) || targetBytes <= 0 || targetBytes > 50_000_000) {
    throw new Error('Target must be a positive whole byte count up to 50 MB.');
  }
  if (bytes.length > targetBytes) throw new Error('The compressed PDF is still above the requested target.');
  if (bytes.length === targetBytes) return bytes;
  const tailStart = Math.max(0, bytes.length - 1024);
  const tail = new TextDecoder('latin1').decode(bytes.subarray(tailStart));
  const marker = /(?:\r\n|\n|\r)startxref\s+\d+\s+%%EOF\s*$/.exec(tail);
  if (!marker) throw new Error('Cannot safely match the size of this PDF: final cross-reference marker is missing.');
  const position = tailStart + marker.index;
  const extra = targetBytes - bytes.length;
  const output = new Uint8Array(targetBytes);
  output.set(bytes.subarray(0, position));
  output.fill(32, position, position + extra);
  // Keep whitespace lines short for compatibility with PDF readers.
  for (let n = position; n < position + extra; n += 80) output[n] = 10;
  output.set(bytes.subarray(position), position + extra);
  return output;
}
