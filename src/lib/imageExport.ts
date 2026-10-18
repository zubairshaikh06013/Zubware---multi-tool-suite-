export const IMAGE_EXPORT_MIME = {
  jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', bmp: 'image/bmp', avif: 'image/avif',
} as const;

export function imageExportExtension(mime: string): string {
  const found = Object.entries(IMAGE_EXPORT_MIME).find(([, value]) => value === mime);
  if (!found) throw new Error('Unsupported image output format.');
  return found[0];
}

/** ZIP entry names must not replace a different image with the same source name. */
export function uniqueImageExportName(name: string, used: Set<string>): string {
  const safeName = name.replace(/[\\/]/g, '_');
  let candidate = safeName;
  let suffix = 2;
  const dot = safeName.lastIndexOf('.');
  while (used.has(candidate.toLowerCase())) {
    candidate = dot > 0 ? `${safeName.slice(0, dot)}-${suffix}${safeName.slice(dot)}` : `${safeName}-${suffix}`;
    suffix++;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}
