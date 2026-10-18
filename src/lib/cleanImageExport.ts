import { imageExportExtension, uniqueImageExportName } from './imageExport';

/** PNG retains alpha for non-JPEG inputs; animated inputs export the decoded still frame. */
export function cleanedImageMime(sourceType: string): string {
  return sourceType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
}

export function cleanedImageName(name: string, mime: string): string {
  return `${name.replace(/\.[^.]+$/, '') || 'image'}_no_exif.${imageExportExtension(mime)}`;
}

export async function cleanedImagesZip(images: {name:string;blob:Blob}[]): Promise<Blob> {
  if (!images.length) throw new Error('No cleaned images to download.');
  const {default:JSZip}=await import('jszip');
  const zip = new JSZip(), used = new Set<string>();
  for (const image of images) {
    const name = uniqueImageExportName(cleanedImageName(image.name,image.blob.type),used);
    zip.file(name,await image.blob.arrayBuffer());
  }
  return zip.generateAsync({type:'blob'});
}
