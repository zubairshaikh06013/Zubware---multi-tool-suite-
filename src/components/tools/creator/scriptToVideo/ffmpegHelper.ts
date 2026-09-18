// FFmpeg.wasm Lazy Loading and Browser Compatibility Helper
// Provides client-side WebM -> MP4 conversion with graceful browser fallback

export interface TranscodeProgress {
  ratio: number; // 0 to 1
  timeSeconds?: number;
}

// Global cache for loaded FFmpeg instance
let ffmpegInstance: any = null;
let isLoadingFFmpeg = false;

// Helper to check if browser supports WebAssembly
export function isWasmSupported(): boolean {
  try {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch (_) {
    return false;
  }
  return false;
}

// Lazy-load FFmpeg library from CDN if needed
export async function loadFFmpegScript(): Promise<any> {
  if (ffmpegInstance) return ffmpegInstance;
  if (!isWasmSupported()) return null;

  if (isLoadingFFmpeg) {
    // Wait for existing load request
    let checks = 0;
    while (isLoadingFFmpeg && checks < 50) {
      await new Promise((r) => setTimeout(r, 100));
      checks++;
    }
    if (ffmpegInstance) return ffmpegInstance;
  }

  isLoadingFFmpeg = true;

  try {
    // Check if FFmpeg global is already loaded
    if ((window as any).FFmpegWASM || (window as any).FFmpeg) {
      ffmpegInstance = (window as any).FFmpegWASM || (window as any).FFmpeg;
      isLoadingFFmpeg = false;
      return ffmpegInstance;
    }

    // Inject FFmpeg script tag safely
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load FFmpeg.wasm script from CDN'));
      document.head.appendChild(script);
    });

    if ((window as any).FFmpeg) {
      const { createFFmpeg } = (window as any).FFmpeg;
      if (typeof createFFmpeg === 'function') {
        const ffmpeg = createFFmpeg({ log: false });
        await ffmpeg.load();
        ffmpegInstance = ffmpeg;
      }
    }
  } catch (err) {
    console.warn('FFmpeg.wasm lazy initialization failed, falling back to browser MediaRecorder native stream:', err);
    ffmpegInstance = null;
  } finally {
    isLoadingFFmpeg = false;
  }

  return ffmpegInstance;
}

// Transcode WebM blob to MP4 if FFmpeg is available; otherwise return original Blob
export async function convertBlobToMp4IfPossible(
  inputBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; converted: boolean }> {
  // If input blob is already MP4, return as is
  if (inputBlob.type.includes('mp4')) {
    return { blob: inputBlob, converted: false };
  }

  try {
    const ffmpeg = await loadFFmpegScript();
    if (!ffmpeg) {
      return { blob: inputBlob, converted: false };
    }

    const { fetchFile } = (window as any).FFmpeg || {};
    if (!fetchFile) {
      return { blob: inputBlob, converted: false };
    }

    const inputData = await fetchFile(inputBlob);
    ffmpeg.FS('writeFile', 'input.webm', inputData);

    if (onProgress) {
      ffmpeg.setProgress(({ ratio }: { ratio: number }) => {
        if (typeof ratio === 'number' && !isNaN(ratio)) {
          onProgress(Math.min(100, Math.max(0, Math.round(ratio * 100))));
        }
      });
    }

    // Transcode WebM to MP4 using fast preset and H.264 video codec
    await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Cleanup FFmpeg virtual filesystem
    try {
      ffmpeg.FS('unlink', 'input.webm');
      ffmpeg.FS('unlink', 'output.mp4');
    } catch (_) {}

    return { blob: mp4Blob, converted: true };
  } catch (err) {
    console.warn('FFmpeg conversion fallback triggered:', err);
    return { blob: inputBlob, converted: false };
  }
}
