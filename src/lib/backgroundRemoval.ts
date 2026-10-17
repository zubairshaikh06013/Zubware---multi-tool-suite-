import { removeBackground } from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';


export type BackgroundRemovalMode = 'fast' | 'quality';

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
  onProgress?: (progress: BackgroundRemovalProgress) => void,
  mode: BackgroundRemovalMode = 'quality'
): Promise<BackgroundRemovalResult> {
  // 1. Get original dimensions
  const origImg = await loadImage(fileOrBlob);
  const origWidth = origImg.naturalWidth || origImg.width;
  const origHeight = origImg.naturalHeight || origImg.height;

  // Initial stage notification
  onProgress?.({ stage: 'Preparing AI...', percent: 5 });

  // Revert the unverified quantized-model/WebGPU override: it caused
  // regressions on some mobile browsers. Use the library's tested defaults.
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

  // Reduce oversized input only in Fast mode; Quality uses the stable original path.
  let modelInput: File | Blob = fileOrBlob;
  if (mode === 'fast' && Math.max(origWidth, origHeight) > 1280) {
    const scale = 1280 / Math.max(origWidth, origHeight);
    const reduced = document.createElement('canvas');
    reduced.width = Math.max(1, Math.round(origWidth * scale));
    reduced.height = Math.max(1, Math.round(origHeight * scale));
    const reducedCtx = reduced.getContext('2d');
    if (!reducedCtx) throw new Error('Cannot prepare image on this device.');
    reducedCtx.drawImage(origImg, 0, 0, reduced.width, reduced.height);
    modelInput = await new Promise<Blob>((resolve, reject) => {
      reduced.toBlob(blob => blob ? resolve(blob) : reject(new Error('Cannot prepare image.')), 'image/jpeg', 0.9);
    });
    reduced.width = 0;
    reduced.height = 0;
  }

  // 2. Call AI background removal
  onProgress?.({ stage: 'Removing Background...', percent: 20 });
  const bgRemovedBlob = await removeBackground(modelInput, config);

  onProgress?.({ stage: 'Finalizing...', percent: 90 });

  // Trust the segmentation library's PNG directly. The previous
  // destination-in recompositing step could create an entirely transparent
  // image and allocated another full-resolution canvas on mobile.
  const resultImg = await loadImage(bgRemovedBlob);
  const resultWidth = resultImg.naturalWidth || resultImg.width;
  const resultHeight = resultImg.naturalHeight || resultImg.height;
  if (!resultWidth || !resultHeight) {
    throw new Error('Background remover returned an invalid image. Please try again.');
  }

  // Reject fully transparent output instead of claiming a successful removal.
  // A small canvas is enough to detect the regression without a large buffer.
  const checkCanvas = document.createElement('canvas');
  checkCanvas.width = Math.min(resultWidth, 64);
  checkCanvas.height = Math.min(resultHeight, 64);
  const checkCtx = checkCanvas.getContext('2d', { willReadFrequently: true });
  if (checkCtx) {
    checkCtx.drawImage(resultImg, 0, 0, checkCanvas.width, checkCanvas.height);
    const pixels = checkCtx.getImageData(0, 0, checkCanvas.width, checkCanvas.height).data;
    let visible = false;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) { visible = true; break; }
    }
    if (!visible) {
      throw new Error('AI returned a blank transparent image. Please try another photo or browser.');
    }
  }

  const finalBlob = bgRemovedBlob;
  const finalUrl = URL.createObjectURL(finalBlob);
  onProgress?.({ stage: 'Finalizing...', percent: 100 });

  return {
    blob: finalBlob,
    url: finalUrl,
    width: resultWidth,
    height: resultHeight,
    originalWidth: origWidth,
    originalHeight: origHeight
  };
}
