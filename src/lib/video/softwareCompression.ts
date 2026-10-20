import { FFmpeg } from '@ffmpeg/ffmpeg';

const engineBase = '/video-engine/0.12.10';

/** Single-threaded software encoding does not depend on canvas capture or SharedArrayBuffer. */
export async function softwareCompressVideo(
  file: File,
  settings: { scale: number; fps: number; bitrate: number; duration: number },
  signal: AbortSignal,
  progress: (value: number) => void,
  status: (message: string) => void,
): Promise<Blob> {
  if (file.size > 100 * 1024 * 1024) throw new Error('Software mode supports files up to 100 MB. Choose a smaller clip.');
  const ffmpeg = new FFmpeg();
  let wasmURL: string | undefined;
  const downloadAbort = new AbortController();
  const stop = () => { downloadAbort.abort(); ffmpeg.terminate(); };
  signal.addEventListener('abort', stop, { once: true });
  const timer = setTimeout(stop, 10 * 60 * 1000);
  try {
    signal.throwIfAborted();
    status('Loading local video engine (about 31 MB on first use). Your video stays on this device.');
    const manifestResponse = await fetch(`${engineBase}/manifest.json`, { signal: downloadAbort.signal });
    if (!manifestResponse.ok) throw new Error('Could not load the video engine. Check your connection and retry.');
    const manifest = await manifestResponse.json() as { parts: string[]; bytes: number };
    const parts = await Promise.all(manifest.parts.map(async name => {
      const response = await fetch(`${engineBase}/${name}`, { signal: downloadAbort.signal });
      if (!response.ok) throw new Error('Video engine download failed. Check your connection and retry.');
      return response.arrayBuffer();
    }));
    const wasm = new Blob(parts, { type: 'application/wasm' });
    if (wasm.size !== manifest.bytes) throw new Error('Video engine download was incomplete. Retry with a stable connection.');
    wasmURL = URL.createObjectURL(wasm);
    signal.throwIfAborted();
    await ffmpeg.load({
      classWorkerURL: `${engineBase}/worker.js`,
      coreURL: `${location.origin}${engineBase}/ffmpeg-core.js`,
      wasmURL,
    });
    signal.throwIfAborted();
    ffmpeg.on('progress', ({ time }) => progress(Math.min(98, Math.max(0, Math.round(time / 1e6 / settings.duration * 100)))));
    status('Converting to MP4 on this device. Keep this tab open; slower phones may take several minutes.');
    await ffmpeg.writeFile('input', new Uint8Array(await file.arrayBuffer()));
    const scale = Math.min(1, Math.max(0.1, settings.scale));
    const code = await ffmpeg.exec([
      '-i', 'input', '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', `scale=trunc(iw*${scale}/2)*2:trunc(ih*${scale}/2)*2,setsar=1`,
      '-r', String(settings.fps), '-c:v', 'libx264', '-preset', 'ultrafast',
      '-b:v', String(settings.bitrate), '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', 'output.mp4',
    ], 8 * 60 * 1000);
    if (code !== 0) throw new Error('Software conversion failed or timed out. Try a shorter clip or lower resolution.');
    const data = await ffmpeg.readFile('output.mp4');
    if (!(data instanceof Uint8Array) || !data.length) throw new Error('The encoder produced no video.');
    signal.throwIfAborted();
    return new Blob([new Uint8Array(data)], { type: 'video/mp4' });
  } catch (error) {
    if (signal.aborted) throw new Error('Conversion cancelled.');
    throw error instanceof Error ? error : new Error('The local video engine could not finish. Try a shorter clip or lower resolution.');
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', stop);
    ffmpeg.terminate();
    if (wasmURL) URL.revokeObjectURL(wasmURL);
  }
}
