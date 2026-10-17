import type { BackgroundRemovalProgress, BackgroundRemovalResult } from './backgroundRemoval';

const API = 'https://api.zubware.com/remove-background';
const MAX_BYTES = 10 * 1024 * 1024;

function dimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read the image. Please try another photo.'));
    };
    img.src = url;
  });
}

/** Explicitly opted-in server-side Cloudflare AI. No automatic browser fallback or hidden upload. */
export async function processCloudflareBackgroundRemoval(
  file: File,
  onProgress?: (progress: BackgroundRemovalProgress) => void
): Promise<BackgroundRemovalResult> {
  const mime = file.type.toLowerCase();
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
    throw new Error('Cloudflare AI supports JPG, PNG or WebP. Please choose a supported image.');
  }
  if (!file.size || file.size > MAX_BYTES) {
    throw new Error('Cloudflare AI supports images up to 10 MB.');
  }

  onProgress?.({ stage: 'Preparing AI...', percent: 10 });
  // Start image metadata decoding concurrently with the network request.
  // Previously this blocked the upload on slower Android devices.
  const originalPromise = dimensions(file).catch(() => ({ width: 0, height: 0 }));
  onProgress?.({ stage: 'Uploading & removing background...', percent: 30 });

  let response: Response;
  try {
    response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': mime },
      body: file,
      cache: 'no-store'
    });
  } catch {
    throw new Error('Could not connect to Cloudflare AI. Check your internet connection or try Browser mode.');
  }
  if (!response.ok) {
    const message = (await response.text().catch(() => '')).slice(0, 160);
    if (response.status === 429) throw new Error('Cloudflare AI is busy. Wait a minute or use Browser mode.');
    throw new Error(message || 'Cloudflare AI could not remove the background. Try Browser mode.');
  }
  const blob = await response.blob();
  if (blob.type !== 'image/png' || !blob.size) throw new Error('Cloudflare returned an invalid PNG.');
  onProgress?.({ stage: 'Finalizing...', percent: 90 });
  const [output, original] = await Promise.all([dimensions(blob), originalPromise]);
  const url = URL.createObjectURL(blob);
  onProgress?.({ stage: 'Finalizing...', percent: 100 });
  return {
    blob, url, width: output.width, height: output.height,
    originalWidth: original.width, originalHeight: original.height
  };
}
