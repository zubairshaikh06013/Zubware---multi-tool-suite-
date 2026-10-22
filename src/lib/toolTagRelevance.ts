// Restrict historically bulk-added capability tags to tools that implement them.
// Other curated tags are retained; this is not an automatic keyword rewrite.
export function relevantToolTags(id: string, tags: string[]): string[] {
  const capability: Record<string, RegExp> = {
    password: /password|passphrase|protect-pdf|unlock-pdf|text-encrypt/,
    qr: /qr-|qr-generator|gst-invoice-generator/,
    security: /password|passphrase|encrypt|decrypt|hash|checksum|jwt|exif|qr-code-safety|protect-pdf|unlock-pdf/,
  };
  return Array.from(new Set(tags)).filter(tag => {
    const rule = capability[tag.toLowerCase()];
    return !rule || rule.test(id);
  });
}
