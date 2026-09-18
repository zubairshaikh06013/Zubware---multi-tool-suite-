import { Layer, BackgroundConfig, BrandingConfig, VideoAnimationPreset, AudioConfig } from './types';
import { renderIslamicShortsCanvas } from './canvasRenderer';

export interface ExportVideoOptions {
  layers: Layer[];
  background: BackgroundConfig;
  branding: BrandingConfig;
  audio: AudioConfig;
  durationSeconds: number;
  animationPreset: VideoAnimationPreset;
  onProgress: (percent: number, statusText: string) => void;
  signal?: AbortSignal;
}

export async function exportIslamicShortVideo({
  layers,
  background,
  branding,
  audio,
  durationSeconds,
  animationPreset,
  onProgress,
  signal
}: ExportVideoOptions): Promise<{ url: string; mimeType: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      onProgress(5, 'Initializing 1080x1920 video engine...');

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;

      const fps = 30;
      const totalFrames = Math.ceil(durationSeconds * fps);
      const frameInterval = 1000 / fps;

      // Audio setup if present
      let audioContext: AudioContext | null = null;
      let audioDestination: MediaStreamAudioDestinationNode | null = null;
      let audioSource: AudioBufferSourceNode | null = null;

      if (audio.src && !audio.muted) {
        try {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const resp = await fetch(audio.src);
          const arrayBuf = await resp.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuf);

          audioDestination = audioContext.createMediaStreamDestination();
          audioSource = audioContext.createBufferSource();
          audioSource.buffer = audioBuffer;

          const gainNode = audioContext.createGain();
          gainNode.gain.value = audio.volume;

          audioSource.connect(gainNode);
          gainNode.connect(audioDestination);
        } catch (audioErr) {
          console.warn('Audio decoding failed, exporting video without audio', audioErr);
        }
      }

      // Check supported MIME type
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          mimeType = 'video/webm;codecs=vp8';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else {
          mimeType = '';
        }
      }

      if (!mimeType) {
        throw new Error('Your browser does not support MediaRecorder video export.');
      }

      // Canvas Stream
      const canvasStream = canvas.captureStream(fps);
      const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

      if (audioDestination && audioDestination.stream.getAudioTracks().length > 0) {
        combinedTracks.push(...audioDestination.stream.getAudioTracks());
      }

      const combinedStream = new MediaStream(combinedTracks);
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        onProgress(100, 'Video generated successfully!');
        resolve({ url: videoUrl, mimeType });
      };

      // Start recording & audio
      mediaRecorder.start();
      if (audioSource && audioContext) {
        audioSource.start(0, audio.startTime || 0);
      }

      let currentFrame = 0;

      const renderLoop = () => {
        if (signal?.aborted) {
          mediaRecorder.stop();
          if (audioContext) audioContext.close();
          reject(new Error('Video export cancelled.'));
          return;
        }

        if (currentFrame >= totalFrames) {
          mediaRecorder.stop();
          if (audioContext) audioContext.close();
          return;
        }

        const currentTime = currentFrame / fps;
        renderIslamicShortsCanvas({
          canvas,
          layers,
          background,
          branding,
          timeSeconds: currentTime,
          durationSeconds,
          animationPreset,
          selectedLayerId: null,
          showEditorControls: false
        });

        currentFrame++;
        const percent = Math.min(99, Math.round((currentFrame / totalFrames) * 90) + 10);
        onProgress(percent, `Rendering frame ${currentFrame}/${totalFrames} (${Math.round(currentTime)}s)`);

        setTimeout(renderLoop, frameInterval / 2);
      };

      renderLoop();
    } catch (err: any) {
      reject(err);
    }
  });
}
