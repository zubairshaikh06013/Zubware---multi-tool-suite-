import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Download, Sliders, RefreshCw, Check, Sparkles, AlertCircle, Play, Pause, Film } from 'lucide-react';


// A non-empty Blob can contain only a WebM header. Require a decoded frame
// before exposing a success message or download; codec support alone is not enough.
async function validateRecordedVideo(blob: Blob): Promise<void> {
  const probe = document.createElement('video');
  const url = URL.createObjectURL(blob);
  probe.muted = true;
  probe.playsInline = true;
  probe.preload = 'auto';
  try {
    await new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        clearTimeout(timer);
        probe.onloadeddata = null;
        probe.onerror = null;
        error ? reject(error) : resolve();
      };
      const timer = setTimeout(() => finish(new Error('This browser could not validate the recorded video. Try Chrome or a lower resolution.')), 15000);
      probe.onerror = () => finish(new Error('This browser produced an unplayable video. Try Chrome or a lower resolution.'));
      probe.onloadeddata = () => finish(probe.videoWidth > 0 && probe.videoHeight > 0
        ? undefined : new Error('The recording contains no video frames. Try Chrome.'));
      probe.src = url;
      probe.load();
    });
  } finally {
    probe.pause();
    probe.removeAttribute('src');
    probe.load();
    URL.revokeObjectURL(url);
  }
}

export function VideoCompressorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackKey, setPlaybackKey] = useState(0);

  const [processingError, setProcessingError] = useState('');
  const [audioNotice, setAudioNotice] = useState('');
  const [compatibilityMode, setCompatibilityMode] = useState(false);
  const stopActive = useRef<(() => void) | null>(null);
  useEffect(() => () => stopActive.current?.(), []);
  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
  useEffect(() => () => { if (compressedUrl) URL.revokeObjectURL(compressedUrl); }, [compressedUrl]);

  // Settings
  const [resolutionScale, setResolutionScale] = useState<number>(0.75);
  const [qualityPreset, setQualityPreset] = useState<'high' | 'medium' | 'low'>('medium');
  const [fps, setFps] = useState<number>(30);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    if (isProcessing) return;
    setProcessingError(''); setAudioNotice('');
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a video file (MP4, WebM, MOV)');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setCompressedUrl(null);
    setCompressedBlob(null);
    setProgress(0);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const getBitrate = () => {
    if (qualityPreset === 'high') return 2_500_000;
    if (qualityPreset === 'medium') return 1_200_000;
    return 600_000;
  };

  const processCompression = async () => {
    const video = videoRef.current;
    if (!videoUrl || !video || isProcessing) return;
    setIsProcessing(true); setProgress(0); setProcessingError(''); setAudioNotice('');
    setCompressedBlob(null); setCompressedUrl(null);
    let stream: MediaStream | undefined, audioStream: MediaStream | undefined;
    let audioContext: AudioContext | undefined;
    let audioSource: MediaElementAudioSourceNode | undefined;
    let recorder: MediaRecorder | undefined, frame = 0, cancelled = false;
    let recordingTimer: ReturnType<typeof setTimeout> | undefined;
    let rejectRecording: ((reason: Error) => void) | undefined;
    const cleanup = () => {
      cancelled = true; clearTimeout(recordingTimer); cancelAnimationFrame(frame); video.pause();
      rejectRecording?.(new Error('Recording cancelled.'));
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      stream?.getTracks().forEach(track => track.stop());
      audioStream?.getTracks().forEach(track => track.stop());
      audioSource?.disconnect();
      if (audioContext && audioContext.state !== 'closed') void audioContext.close().catch(() => {});
      video.muted = true;
    };
    stopActive.current = cleanup;
    try {
      if (typeof MediaRecorder === 'undefined') throw new Error('Video recording is not available in this browser.');
      if (!video.videoWidth || !video.videoHeight || !Number.isFinite(video.duration) || video.duration <= 0) throw new Error('Wait for the video to load, or try a supported video file.');
      video.pause(); video.muted = true;
      const capture = (video as HTMLVideoElement & {captureStream?: () => MediaStream}).captureStream;
      const useCompatibility = compatibilityMode || !capture;
      // Resume during the click gesture, before seek/playback awaits consume activation.
      if (useCompatibility && typeof AudioContext !== 'undefined') {
        audioContext = new AudioContext();
        await audioContext.resume();
        if (audioContext.state !== 'running') throw new Error('Audio could not start. Tap Start again and keep this tab active.');
        audioSource = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        audioSource.connect(destination);
        audioStream = destination.stream;
        // Route audio only to the recording, never to speakers or a microphone.
        video.muted = false;
      }
      // Seeking to an already-current time does not reliably dispatch seeked.
      if (video.currentTime > 0) {
        await new Promise<void>((resolve, reject) => {
          const finish = () => { clearTimeout(timeout); video.removeEventListener('seeked', done); };
          const done = () => { finish(); resolve(); };
          const timeout = setTimeout(() => { finish(); reject(new Error('Could not seek to the beginning of the video.')); }, 5000);
          video.addEventListener('seeked', done, {once:true});
          video.currentTime = 0;
        });
      }
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('The recording preview is not ready. Try again.');
      const ctx = canvas.getContext('2d');
      if (!ctx || !canvas.captureStream) throw new Error('Canvas video recording is not supported in this browser.');
      const width = Math.max(2, Math.round(video.videoWidth * resolutionScale / 2) * 2);
      const height = Math.max(2, Math.round(video.videoHeight * resolutionScale / 2) * 2);
      if (width * height > 32000000) throw new Error('Choose a smaller output resolution.');
      canvas.width = width; canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);
      stream = canvas.captureStream(fps);
      const canvasTrack = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack | undefined;
      if (!canvasTrack) throw new Error('This browser did not provide a video recording track.');
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => stream!.addTrack(track));
        setAudioNotice('Compatibility audio capture enabled. Check sound in the exported video.');
      } else if (capture) {
        audioStream = capture.call(video);
        const audioTracks = audioStream.getAudioTracks();
        audioTracks.forEach(track => stream!.addTrack(track));
        if (!audioTracks.length) setAudioNotice('No audio track was captured. Verify sound in the output.');
      } else setAudioNotice('Audio capture is unavailable in this browser. Output will be silent.');
      const mimeType = useCompatibility ? '' : ['video/webm;codecs=vp8','video/webm;codecs=vp9','video/webm'].find(type => MediaRecorder.isTypeSupported(type));
      if (!useCompatibility && !mimeType) throw new Error('Try Compatibility mode: this browser cannot record the selected WebM format.');
      // Let older browsers choose their native encoder instead of trusting codec claims.
      recorder = new MediaRecorder(stream, { ...(mimeType ? {mimeType} : {}), videoBitsPerSecond: getBitrate() });
      const chunks: Blob[] = [];
      const completed = new Promise<Blob>((resolve, reject) => {
        rejectRecording = reject;
        recorder!.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
        recorder!.onerror = () => reject(new Error('Video recording failed. Try a shorter clip or lower resolution.'));
        recorder!.onstop = () => {
          const blob = new Blob(chunks, {type: recorder!.mimeType || mimeType || chunks[0]?.type || 'video/webm'});
          if (!video.ended) reject(new Error('Recording stopped before the video finished. Keep this tab active and try again.'));
          else if (!blob.size) reject(new Error('The recorder produced an empty file.'));
          else resolve(blob);
        };
      });
      // Attach rejection handling immediately, including failures before playback starts.
      void completed.catch(() => {});
      recordingTimer = setTimeout(() => rejectRecording?.(new Error('Recording timed out. Keep this tab active, or try a shorter clip in Chrome.')), Math.max(30000, video.duration * 2000 + 15000));
      recorder.start(100);
      await video.play();
      const render = () => {
        if (cancelled) return;
        ctx.drawImage(video, 0, 0, width, height);
        if (useCompatibility && typeof canvasTrack.requestFrame === 'function') canvasTrack.requestFrame();
        setProgress(Math.min(99, Math.round(video.currentTime / video.duration * 100)));
        if (video.ended || video.paused) { if (recorder!.state !== 'inactive') recorder!.stop(); return; }
        frame = requestAnimationFrame(render);
      };
      render();
      const blob = await completed;
      clearTimeout(recordingTimer);
      if (cancelled) return;
      await validateRecordedVideo(blob);
      if (!cancelled) {
        setCompressedBlob(blob); setCompressedUrl(URL.createObjectURL(blob)); setProgress(100);
        onShowToast('Video recording finished. Check size, playback and audio before sharing.');
      }
    } catch (error) {
      if (!cancelled) {
        const message = error instanceof Error ? error.message : 'Video processing failed.';
        setProcessingError(message); onShowToast(message);
      }
    } finally {
      const wasCancelled = cancelled;
      cleanup(); stopActive.current = null;
      if (!wasCancelled) {
        // A captured media element can retain ended tracks after cleanup.
        // Give the next recording a fresh decoder/capture lifecycle.
        setPlaybackKey(key => key + 1);
        setIsProcessing(false);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getSavingsPercent = () => {
    if (!videoFile || !compressedBlob) return 0;
    const diff = videoFile.size - compressedBlob.size;
    return Math.min(99, Math.round((diff / videoFile.size) * 100));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <p className="text-xs text-slate-500">Records video using browser playback. Compatibility mode uses your browser’s default output format. Encoding can take the clip’s duration or longer; output is not guaranteed smaller. Keep this tab active and check the exported audio.</p>
      {processingError && <p role="alert" className="text-red-600">{processingError} Enable Compatibility mode below to try a different recording method.</p>}
      {audioNotice && <p role="status" className="text-amber-600">{audioNotice}</p>}
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Video Compressor (Local / Private)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reduce video file size without uploading to external servers. High-efficiency client-side encoding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              accept="video/*"
              id="video-compressor-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {videoFile ? (
              <div className="space-y-2 text-center w-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{videoFile.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  Original Size: {formatFileSize(videoFile.size)}
                </p>
                <label
                  htmlFor="video-compressor-file"
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer block pt-1"
                >
                  Choose another video
                </label>
              </div>
            ) : (
              <label htmlFor="video-compressor-file" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Video File</p>
                  <p className="text-xs text-slate-400 mt-1">Choose a video your browser can play. Input codec support varies by browser.</p>
                </div>
              </label>
            )}
          </div>

          {/* Compression Configuration */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Compression Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['high', 'medium', 'low'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQualityPreset(preset)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      qualityPreset === preset
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {preset === 'high' ? 'High Quality' : preset === 'medium' ? 'Balanced' : 'Smallest Size'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Resolution Scale:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{Math.round(resolutionScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={resolutionScale}
                onChange={(e) => setResolutionScale(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Frame Rate (FPS):</span>
                <span className="text-indigo-600 dark:text-indigo-400">{fps} FPS</span>
              </div>
              <div className="flex gap-2">
                {[24, 30, 60].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      fps === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f} FPS
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={compatibilityMode} disabled={isProcessing}
                onChange={e => setCompatibilityMode(e.target.checked)} />
              Compatibility mode — try this if recording fails. Also used automatically when direct audio capture is unavailable.
            </label>
            <button
              onClick={processCompression}
              disabled={!videoUrl || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing Video ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Video Compression</span>
                </>
              )}
            </button>

            {isProcessing && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Processing frames in browser memory...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Previews & Download */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          {videoUrl && (
            <video
              key={playbackKey}
              ref={videoRef}
              src={videoUrl}
              className="w-full max-h-48 rounded-xl"
              aria-label="Source video"
              muted
              playsInline
              preload="auto"
            />
          )}

          <canvas ref={canvasRef} aria-label="Recording preview"
            className={isProcessing ? 'w-full max-h-48 object-contain rounded-xl' : 'hidden'} />
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {compressedUrl ? (
              <div className="space-y-4 w-full text-center">
                <video
                  src={compressedUrl}
                  onError={() => {
                    setCompressedBlob(null); setCompressedUrl(null);
                    setProcessingError('The recorded video cannot play in this browser. Try Chrome or a lower resolution. No download was kept.');
                  }}
                  controls={!isProcessing}
                  className="max-h-64 mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full"
                />

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Compressed Size</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {compressedBlob ? formatFileSize(compressedBlob.size) : '0 MB'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Size Change (Rounded)</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {Math.abs(getSavingsPercent())}% {getSavingsPercent() < 0 ? 'Larger' : getSavingsPercent() > 0 ? 'Smaller' : 'Change'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <Video className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Preview will appear here after compression</p>
              </div>
            )}
          </div>

          {compressedUrl && (
            <div className="flex items-center justify-end">
              <a
                href={compressedUrl}
                download={`compressed_${videoFile?.name.replace(/\.[^/.]+$/, '') || 'video'}.${compressedBlob?.type.includes('mp4') ? 'mp4' : 'webm'}`} 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Compressed Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
