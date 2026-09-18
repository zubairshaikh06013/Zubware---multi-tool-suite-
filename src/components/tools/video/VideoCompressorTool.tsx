import React, { useState, useRef } from 'react';
import { Upload, Video, Download, Sliders, RefreshCw, Check, Sparkles, AlertCircle, Play, Pause, Film } from 'lucide-react';

export function VideoCompressorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings
  const [resolutionScale, setResolutionScale] = useState<number>(0.75);
  const [qualityPreset, setQualityPreset] = useState<'high' | 'medium' | 'low'>('medium');
  const [fps, setFps] = useState<number>(30);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
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
    if (!videoUrl || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);

    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = true;

    await new Promise((resolve) => {
      video.onseeked = resolve;
      video.currentTime = 0;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      onShowToast('Canvas context not available');
      return;
    }

    const targetWidth = Math.round((video.videoWidth * resolutionScale) / 2) * 2;
    const targetHeight = Math.round((video.videoHeight * resolutionScale) / 2) * 2;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const stream = canvas.captureStream(fps);

    // Also attach audio track if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioStream = (video as any).captureStream ? (video as any).captureStream() : null;
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      audioStream.getAudioTracks().forEach((track: MediaStreamTrack) => stream.addTrack(track));
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: getBitrate(),
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setCompressedBlob(blob);
      setCompressedUrl(url);
      setIsProcessing(false);
      setProgress(100);
      onShowToast('Video compression completed!');
    };

    recorder.start(100);
    await video.play();

    const duration = video.duration || 1;

    const renderLoop = () => {
      if (video.paused || video.ended) {
        recorder.stop();
        return;
      }

      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      const currentProgress = Math.min(99, Math.round((video.currentTime / duration) * 100));
      setProgress(currentProgress);
      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getSavingsPercent = () => {
    if (!videoFile || !compressedBlob) return 0;
    const diff = videoFile.size - compressedBlob.size;
    return Math.max(0, Math.round((diff / videoFile.size) * 100));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
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
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV, AVI</p>
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
              ref={videoRef}
              src={videoUrl}
              className="hidden"
              playsInline
              preload="auto"
            />
          )}

          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {compressedUrl ? (
              <div className="space-y-4 w-full text-center">
                <video
                  src={compressedUrl}
                  controls
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
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Space Saved</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {getSavingsPercent()}% Reduction
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
                download={`compressed_${videoFile?.name.replace(/\.[^/.]+$/, '') || 'video'}.webm`}
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
