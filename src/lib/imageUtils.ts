export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  format: string;
  width: number;
  height: number;
  aspectRatio: string;
  colorDepth: string;
  hasTransparency: boolean;
  lastModified: string;
  estimatedPrintSize: string;
  exifData: Record<string, string>;
  exifStatus: string;
}

import { inspectJpegExif } from './jpegExif';
import { formatDecimalBytes } from './fileSizeStandard';
import { encodeCanvasBlob } from './canvasEncoding';
import { cleanedImageMime } from './cleanImageExport';

export function formatBytes(bytes: number, decimals = 2): string {
  return formatDecimalBytes(bytes, decimals);
}

export async function getImageMetadata(file: File, img: HTMLImageElement): Promise<ImageMetadata> {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  
  // Calculate simplified aspect ratio
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(width, height);
  const aspectRatio = `${Math.round(width / common)}:${Math.round(height / common)}`;

  // Print size at 300 DPI (inches and cm)
  const widthInches = (width / 300).toFixed(1);
  const heightInches = (height / 300).toFixed(1);
  const widthCm = ((width / 300) * 2.54).toFixed(1);
  const heightCm = ((height / 300) * 2.54).toFixed(1);
  const estimatedPrintSize = `${widthCm} × ${heightCm} cm (${widthInches}" × ${heightInches}") @ 300 DPI`;

  // Detect format
  let format = file.type.replace('image/', '').toUpperCase() || 'UNKNOWN';
  if (format === 'JPEG') format = 'JPG';

  // Check transparency via canvas sample
  let hasTransparency = false;
  try {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = Math.min(width, 100);
    sampleCanvas.height = Math.min(height, 100);
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
      const imgData = ctx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 255) {
          hasTransparency = true;
          break;
        }
      }
    }
  } catch {
    hasTransparency = false;
  }

  // Parse EXIF tags from array buffer if available
  const inspection = inspectJpegExif(new Uint8Array(await file.arrayBuffer()));

  return {
    fileName: file.name,
    fileSize: file.size,
    format,
    width,
    height,
    aspectRatio,
    colorDepth: 'Browser-decoded RGB' + (hasTransparency ? ' + Alpha' : ''),
    hasTransparency,
    lastModified: new Date(file.lastModified).toLocaleString(),
    estimatedPrintSize,
    exifData: inspection.tags,
    exifStatus: inspection.status
  };
}

/** Redraw only the decoded pixels; source metadata is never copied into the new encoder. */
export async function stripExifFromImage(file: File, img: HTMLImageElement): Promise<{ cleanedBlob: Blob; originalSize: number; newSize: number }> {
  const w = img.naturalWidth, h = img.naturalHeight;
  if (!w || !h || w > 16384 || h > 16384 || w * h > 32000000) throw new Error('Resize this image to at most 16,384 px per side and 32 megapixels before processing.');
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create canvas context.');
  const mimeType = cleanedImageMime(file.type);
  if (mimeType === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(img, 0, 0);
  const cleanedBlob = await encodeCanvasBlob(canvas, mimeType, 0.95);
  return {cleanedBlob, originalSize: file.size, newSize: cleanedBlob.size};
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rP = r / 255, gP = g / 255, bP = b / 255;
  const k = 1 - Math.max(rP, gP, bP);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rP - k) / (1 - k);
  const m = (1 - gP - k) / (1 - k);
  const y = (1 - bP - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}
