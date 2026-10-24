import QRCode from 'qrcode';
export interface QrDesign {
  qrSize: number; margin: number; fgColor: string; bgColor: string; transparentBg: boolean;
  errorCorrection: 'L' | 'M' | 'Q' | 'H'; dotStyle: 'square' | 'dots' | 'rounded' | 'classy';
  cornerStyle: 'square' | 'rounded' | 'circle'; useGradient: boolean; fgColor2: string;
  gradientType: 'linear' | 'radial'; logoImage: string | null; logoSize: number;
  frameText: string; frameColor: string; framePosition: 'top' | 'bottom';
}
export const escapeXml = (text: string) => text.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]!));
export function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)?.map(c => parseInt(c, 16) / 255) ?? [0, 0, 0];
  const [r, g, b] = channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function qrContrast(d: QrDesign) {
  const bg = luminance(d.transparentBg ? '#ffffff' : d.bgColor);
  const fg = Math.max(luminance(d.fgColor), d.useGradient ? luminance(d.fgColor2) : 0);
  return { ratio: (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05), inverted: fg >= bg };
}
/** One vector source feeds both the SVG download and the PNG/PDF preview. */
export function renderQrSvg(content: string, d: QrDesign) {
  for (const color of [d.fgColor, d.bgColor, d.fgColor2, d.frameColor]) {
    if (!/^#[\da-f]{6}$/i.test(color)) throw new Error('Use six-digit hex colors, for example #0f172a.');
  }
  if (!content.trim()) throw new Error('Enter content to generate a QR code.');
  if (new TextEncoder().encode(content).length > 2900) throw new Error('This content is too long. Use a shorter message or a link to the full content.');
  let qr: ReturnType<typeof QRCode.create>;
  try { qr = QRCode.create(content, { errorCorrectionLevel: d.logoImage ? 'H' : d.errorCorrection }); }
  catch { throw new Error('This content exceeds QR capacity at the selected correction level. Shorten it or remove the logo and lower correction.'); }
  const n = qr.modules.size;
  const margin = Math.max(4, Math.min(12, Math.round(d.margin)));
  const cell = Math.max(3, Math.ceil(Math.min(2048, Math.max(256, d.qrSize)) / (n + 2 * margin)));
  const width = (n + 2 * margin) * cell;
  const banner = d.frameText.trim() ? Math.round(width * 0.13) : 0;
  const height = width + banner;
  const offset = d.framePosition === 'top' ? banner : 0;
  const paint = d.useGradient ? 'url(#ink)' : d.fgColor;
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`];
  if (d.useGradient) {
    const gradient = d.gradientType === 'linear' ? 'linearGradient' : 'radialGradient';
    out.push(`<defs><${gradient} id="ink" gradientUnits="userSpaceOnUse" ${gradient === 'linearGradient' ? `x1="0" y1="${offset}" x2="${width}" y2="${offset + width}"` : `cx="${width / 2}" cy="${offset + width / 2}" r="${width * 0.7}"`}><stop stop-color="${d.fgColor}"/><stop offset="1" stop-color="${d.fgColor2}"/></${gradient}></defs>`);
  }
  if (!d.transparentBg) out.push(`<rect width="${width}" height="${height}" fill="${d.bgColor}"/>`);
  const eyes = [[0, 0], [n - 7, 0], [0, n - 7]];
  const isEye = (x: number, y: number) => eyes.some(([ex, ey]) => x >= ex && x < ex + 7 && y >= ey && y < ey + 7);
  out.push(`<g fill="${paint}">`);
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
    if (!qr.modules.get(row, col) || isEye(col, row)) continue;
    const x = (col + margin) * cell, y = (row + margin) * cell + offset;
    // Keep timing, alignment and format modules intact even with decorative data dots.
    const style = qr.modules.isReserved(row, col) ? 'square' : d.dotStyle;
    if (style === 'dots' || style === 'classy') out.push(`<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * (style === 'dots' ? 0.46 : 0.5)}"/>`);
    else out.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="${style === 'rounded' ? cell * 0.25 : 0}"/>`);
  }
  // Continuous finder rings preserve the three recognisable corner targets.
  for (const [ex, ey] of eyes) {
    const x = (ex + margin) * cell, y = (ey + margin) * cell + offset;
    const radius = d.cornerStyle === 'circle' ? 2 * cell : d.cornerStyle === 'rounded' ? cell : 0;
    out.push(`<rect x="${x + cell / 2}" y="${y + cell / 2}" width="${6 * cell}" height="${6 * cell}" rx="${radius}" fill="none" stroke="${paint}" stroke-width="${cell}"/>`);
    out.push(`<rect x="${x + 2 * cell}" y="${y + 2 * cell}" width="${3 * cell}" height="${3 * cell}" rx="${radius / 2}"/>`);
  }
  out.push('</g>');
  if (d.logoImage) {
    if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(d.logoImage)) throw new Error('Upload a PNG, JPEG or WebP logo again.');
    const size = n * cell * Math.max(10, Math.min(20, d.logoSize)) / 100;
    const x = (width - size) / 2, y = (width - size) / 2 + offset;
    out.push(`<rect x="${x - cell / 2}" y="${y - cell / 2}" width="${size + cell}" height="${size + cell}" rx="${cell}" fill="${d.transparentBg ? '#ffffff' : d.bgColor}"/>`);
    out.push(`<image x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" xlink:href="${d.logoImage}"/>`);
  }
  if (banner) {
    const y = d.framePosition === 'top' ? 0 : width;
    const label = d.frameText.trim().slice(0, 32);
    const font = Math.min(width * 0.045, width * 0.85 / Math.max(1, label.length * 0.65));
    const labelColor = luminance(d.frameColor) > 0.45 ? '#0f172a' : '#ffffff';
    out.push(`<rect y="${y}" width="${width}" height="${banner}" fill="${d.frameColor}"/><text x="${width / 2}" y="${y + banner / 2 + font * 0.35}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${font}" font-weight="bold" fill="${labelColor}">${escapeXml(label)}</text>`);
  }
  out.push('</svg>');
  return { svg: out.join(''), width, height, modules: n, margin, cell, correction: d.logoImage ? 'H' : d.errorCorrection };
}
