import * as imglyModule from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';

const removeBackground: (image: any, config?: Config) => Promise<Blob> =
  (imglyModule as any).removeBackground || (imglyModule as any).default || imglyModule;

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
 * Completely client-side, 100% private with no server uploads.
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

  const config: Config = {
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
  const resWidth = resultImg.naturalWidth || resultImg.width;
  const resHeight = resultImg.naturalHeight || resultImg.height;

  let finalBlob: Blob = bgRemovedBlob;

  // If the model resized the output (e.g. to inference tensor dimensions),
  // transfer the alpha matte back onto the original high-resolution image.
  if (resWidth > 0 && resHeight > 0 && (resWidth !== origWidth || resHeight !== origHeight)) {
    const canvas = document.createElement('canvas');
    canvas.width = origWidth;
    canvas.height = origHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = origWidth;
    maskCanvas.height = origHeight;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

    if (ctx && maskCtx) {
      // Draw original full-res image
      ctx.drawImage(origImg, 0, 0, origWidth, origHeight);
      const origData = ctx.getImageData(0, 0, origWidth, origHeight);

      // Draw model output scaled to full resolution with smooth interpolation
      maskCtx.imageSmoothingEnabled = true;
      maskCtx.imageSmoothingQuality = 'high';
      maskCtx.drawImage(resultImg, 0, 0, origWidth, origHeight);
      const maskData = maskCtx.getImageData(0, 0, origWidth, origHeight);

      // Apply alpha channel from mask to original full-res pixels
      const len = origData.data.length;
      for (let i = 0; i < len; i += 4) {
        // Transfer alpha channel from mask
        origData.data[i + 3] = maskData.data[i + 3];
      }

      ctx.putImageData(origData, 0, 0);

      const highResBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });

      if (highResBlob) {
        finalBlob = highResBlob;
      }
    }
  }

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
