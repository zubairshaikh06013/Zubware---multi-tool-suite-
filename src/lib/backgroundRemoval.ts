import { removeBackground } from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';


export interface BackgroundRemovalProgress {
  stage: 'Preparing AI...' | 'Removing Background...' | 'Finalizing...';
  percent: number;
}

export interface BackgroundRemovalResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

// Load image into HTMLImageElement safely
function loadImage(src: string | Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const url = typeof src === 'string' ? src : URL.createObjectURL(src);

    img.onload = () => {
      if (typeof src !== 'string') {
        URL.revokeObjectURL(url);
      }
      resolve(img);
    };

    img.onerror = (err) => {
      if (typeof src !== 'string') {
        URL.revokeObjectURL(url);
      }
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Executes AI Background Removal on an image using @imgly/background-removal
 * Completely client-side browser processing with no server uploads.
 */
export async function processBackgroundRemoval(
  fileOrBlob: File | Blob,
  onProgress?: (progress: BackgroundRemovalProgress) => void
): Promise<BackgroundRemovalResult> {
  // 1. Get original dimensions
  const origImg = await loadImage(fileOrBlob);
  const origWidth = origImg.naturalWidth || origImg.width;
  const origHeight = origImg.naturalHeight || origImg.height;

  // Initial stage notification
  onProgress?.({ stage: 'Preparing AI...', percent: 5 });

  // The default FP16 model is considerably larger to download on first use.
  // Prefer the smaller quantized model for quicker initial loading and lower
  // memory pressure; segmentation edge quality can vary by photograph.
  // WebGPU is optional: only request it when the browser advertises support.
  const supportsWebGpu = typeof navigator !== 'undefined' && 'gpu' in navigator;
  const config: Config = {
    model: 'isnet_quint8',
    device: supportsWebGpu ? 'gpu' : 'cpu',
    progress: (key: string, current: number, total: number) => {
      let stage: 'Preparing AI...' | 'Removing Background...' | 'Finalizing...' = 'Preparing AI...';
      let p = 0;

      if (total > 0) {
        p = Math.min(100, Math.round((current / total) * 100));
      } else {
        p = 50;
      }

      if (key.includes('fetch') || key.includes('download')) {
        stage = 'Preparing AI...';
      } else if (key.includes('compute') || key.includes('inference') || key.includes('process')) {
        stage = 'Removing Background...';
      } else {
        stage = 'Finalizing...';
      }

      onProgress?.({ stage, percent: p });
    },
    output: {
      format: 'image/png',
      quality: 1
    }
  };

  // 2. Call AI background removal
  onProgress?.({ stage: 'Removing Background...', percent: 20 });
  const bgRemovedBlob = await removeBackground(fileOrBlob, config);

  onProgress?.({ stage: 'Finalizing...', percent: 90 });

  // 3. Verify output dimensions & ensure original resolution preservation
  const resultImg = await loadImage(bgRemovedBlob);
  // Always retain the original RGB pixels, even if the model emits a 720p image.
  // Canvas compositing uses the model output ONLY as an alpha mask and avoids
  // two full-resolution getImageData() allocations and a JS per-pixel loop.
  // This improves memory use and finalization time on mobile devices.
  const canvas = document.createElement('canvas');
  canvas.width = origWidth;
  canvas.height = origHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx || !origWidth || !origHeight) {
    throw new Error('Unable to create a full-resolution image canvas on this device.');
  }

  ctx.drawImage(origImg, 0, 0, origWidth, origHeight);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(resultImg, 0, 0, origWidth, origHeight);
  ctx.globalCompositeOperation = 'source-over';

  const finalBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not export full-resolution PNG. Try a smaller image.'));
    }, 'image/png');
  });

  const finalUrl = URL.createObjectURL(finalBlob);
  onProgress?.({ stage: 'Finalizing...', percent: 100 });

  return {
    blob: finalBlob,
    url: finalUrl,
    width: origWidth,
    height: origHeight,
    originalWidth: origWidth,
    originalHeight: origHeight
  };
}
