import { ScriptVideoOptions, renderScriptVideoFrame } from './scriptVideoEngine';
import { convertBlobToMp4IfPossible } from './ffmpegHelper';

export interface ExportVideoProgress {
  percent: number;
  stage: string;
}

export interface ExportVideoParams {
  options: ScriptVideoOptions;
  onProgress: (progress: ExportVideoProgress) => void;
  signal?: AbortSignal;
}

export async function exportScriptToMp4Video({
  options,
  onProgress,
  signal
}: ExportVideoParams): Promise<{ url: string; filename: string }> {
  return new Promise(async (resolve, reject) => {
    let recorder: MediaRecorder | null = null;
    let animFrameId: number | null = null;

    try {
      onProgress({ percent: 5, stage: 'Initializing video canvas...' });

      // Create offscreen export canvas
      const canvas = document.createElement('canvas');

      // Do initial render to calculate layout & exact duration
      const layout = renderScriptVideoFrame(canvas, options, 0);
      const totalDuration = layout.estimatedDurationSeconds;
      const fps = 30;
      const totalFrames = Math.ceil(totalDuration * fps);
      const frameIntervalMs = 1000 / fps;

      onProgress({ percent: 10, stage: `Preparing ${layout.canvasWidth}x${layout.canvasHeight} recording stream...` });

      // Determine supported MIME type for MediaRecorder
      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported('video/mp4')) {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          mimeType = 'video/webm;codecs=vp8';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else {
          mimeType = '';
        }
      }

      if (!mimeType) {
        throw new Error('Your browser does not support canvas video recording.');
      }

      // Capture Canvas Stream at 30 FPS
      const canvasStream = canvas.captureStream(fps);
      let recordStream: MediaStream = canvasStream;

      let exportAudioEl: HTMLAudioElement | null = null;
      let audioCtx: AudioContext | null = null;

      if (options.audio && options.audio.enabled && options.audio.src) {
        try {
          exportAudioEl = new Audio(options.audio.src);
          if (!options.audio.src.startsWith('blob:') && !options.audio.src.startsWith('data:')) {
            exportAudioEl.crossOrigin = 'anonymous';
          }
          exportAudioEl.volume = options.audio.volume ?? 1;
          exportAudioEl.currentTime = 0;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            const source = audioCtx.createMediaElementSource(exportAudioEl);
            const destination = audioCtx.createMediaStreamDestination();
            source.connect(destination);

            const audioTracks = destination.stream.getAudioTracks();
            if (audioTracks.length > 0) {
              recordStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...audioTracks
              ]);
            }
          }
        } catch (audioErr) {
          console.warn('Audio track capture setup warning:', audioErr);
        }
      }

      recorder = new MediaRecorder(recordStream, {
        mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps high quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const cleanupAudio = () => {
        if (exportAudioEl) {
          try { exportAudioEl.pause(); } catch (_) {}
          exportAudioEl = null;
        }
        if (audioCtx) {
          try { audioCtx.close(); } catch (_) {}
          audioCtx = null;
        }
      };

      recorder.onstop = async () => {
        cleanupAudio();

        if (signal?.aborted) {
          reject(new Error('Export cancelled by user.'));
          return;
        }

        onProgress({ percent: 93, stage: 'Finalizing MP4 video container...' });

        // Build recorded blob
        const isMp4Mime = mimeType.includes('mp4');
        const rawBlob = new Blob(chunks, { type: isMp4Mime ? 'video/mp4' : 'video/webm' });

        // Optionally convert WebM to MP4 via lazy-loaded FFmpeg.wasm if needed
        let finalBlob = rawBlob;
        if (!isMp4Mime) {
          onProgress({ percent: 95, stage: 'Checking FFmpeg MP4 compatibility...' });
          try {
            const result = await convertBlobToMp4IfPossible(rawBlob, (ffPercent) => {
              onProgress({
                percent: Math.min(99, 95 + Math.round(ffPercent * 0.04)),
                stage: `FFmpeg transcoding to MP4 (${ffPercent}%)...`
              });
            });
            finalBlob = result.blob;
          } catch (ffErr) {
            console.warn('FFmpeg conversion bypassed, using original recorded stream:', ffErr);
          }
        }

        const videoUrl = URL.createObjectURL(finalBlob);

        // Generate clean filename
        const cleanTitle = options.text.script
          .slice(0, 30)
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();

        const ext = finalBlob.type.includes('mp4') ? 'mp4' : 'webm';
        const filename = cleanTitle ? `${cleanTitle}-script-to-video.${ext}` : `script-to-video.${ext}`;

        onProgress({ percent: 100, stage: 'Video export complete!' });
        resolve({ url: videoUrl, filename });
      };

      // Handle cancel abort signal
      if (signal) {
        signal.addEventListener('abort', () => {
          cleanupAudio();
          if (recorder && recorder.state !== 'inactive') {
            recorder.stop();
          }
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
          }
          reject(new Error('Export cancelled.'));
        });
      }

      // Start Recording
      recorder.start();

      if (exportAudioEl) {
        exportAudioEl.currentTime = 0;
        try {
          if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }
          await exportAudioEl.play();
        } catch (e) {
          console.warn('Could not auto-play voiceover during recording:', e);
        }
      }

      let frameCount = 0;
      let lastFrameTime = performance.now();
      let lastReportedPercent = -1;

      const renderLoop = (now: number) => {
        if (signal?.aborted) return;

        if (frameCount >= totalFrames) {
          if (recorder && recorder.state !== 'inactive') {
            recorder.stop();
          }
          return;
        }

        const elapsedMs = now - lastFrameTime;

        if (frameCount === 0) {
          lastFrameTime = now;
          renderScriptVideoFrame(canvas, options, 0);
          frameCount = 1;
          const currentSec = 0;
          const percent = Math.min(92, Math.round(10 + (1 / totalFrames) * 82));
          lastReportedPercent = percent;
          onProgress({
            percent,
            stage: `Rendering frame 1/${totalFrames} (${currentSec.toFixed(1)}s / ${totalDuration.toFixed(1)}s)...`
          });
        } else if (elapsedMs >= frameIntervalMs) {
          // Advance frame ticks without accumulating timing drift
          const framesToAdvance = Math.min(
            totalFrames - frameCount,
            Math.floor(elapsedMs / frameIntervalMs)
          );

          for (let i = 0; i < framesToAdvance; i++) {
            const currentSec = frameCount / fps;
            renderScriptVideoFrame(canvas, options, currentSec);
            frameCount++;
            lastFrameTime += frameIntervalMs;
          }

          const currentSec = Math.min(totalDuration, (frameCount - 1) / fps);
          const percent = Math.min(92, Math.round(10 + (frameCount / totalFrames) * 82));
          if (percent !== lastReportedPercent || frameCount >= totalFrames) {
            lastReportedPercent = percent;
            onProgress({
              percent,
              stage: `Rendering frame ${frameCount}/${totalFrames} (${currentSec.toFixed(1)}s / ${totalDuration.toFixed(1)}s)...`
            });
          }
        }

        animFrameId = requestAnimationFrame(renderLoop);
      };

      animFrameId = requestAnimationFrame(renderLoop);

    } catch (err: any) {
      if (recorder && recorder.state !== 'inactive') {
        try { recorder.stop(); } catch (_) {}
      }
      reject(err);
    }
  });
}
