import React, { useState, useRef } from 'react';
import { Upload, Video, Download, RefreshCw, Layout, Smartphone, Monitor, Square, Sparkles, Check } from 'lucide-react';

const ASPECT_RATIOS = [
  { id: '9:16', name: '9:16 (Reels / TikTok / Shorts)', w: 720, h: 1280, icon: Smartphone },
  { id: '16:9', name: '16:9 (YouTube / Widescreen)', w: 1280, h: 720, icon: Monitor },
  { id: '1:1', name: '1:1 (Square Post)', w: 1080, h: 1080, icon: Square },
  { id: '4:5', name: '4:5 (Instagram Portrait)', w: 1080, h: 1350, icon: Smartphone },
  { id: '4:3', name: '4:3 (Standard Video)', w: 1024, h: 768, icon: Monitor },
];

export function VideoAspectRatioTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<string>('9:16');
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [bgColor, setBgColor] = useState<string>('#000000');
  const [blurBackground, setBlurBackground] = useState<boolean>(true);

  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a valid video file');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setOutputUrl(null);
    setProgress(0);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const processResize = async () => {
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

    const ratioConfig = ASPECT_RATIOS.find((r) => r.id === selectedRatio) || ASPECT_RATIOS[0];
    const targetWidth = ratioConfig.w;
    const targetHeight = ratioConfig.h;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const stream = canvas.captureStream(30);

    // Attach audio track if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioStream = (video as any).captureStream ? (video as any).captureStream() : null;
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      audioStream.getAudioTracks().forEach((t: MediaStreamTrack) => stream.addTrack(t));
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_500_000 });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setIsProcessing(false);
      setProgress(100);
      onShowToast('Video converted to new aspect ratio!');
    };

    recorder.start(100);
    await video.play();

    const duration = video.duration || 1;

    const drawFrame = () => {
      if (video.paused || video.ended) {
        recorder.stop();
        return;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const vW = video.videoWidth;
      const vH = video.videoHeight;
      const srcRatio = vW / vH;
      const destRatio = targetWidth / targetHeight;

      if (fitMode === 'contain') {
        if (blurBackground) {
          // Draw blurred background covering entire canvas
          ctx.save();
          ctx.filter = 'blur(20px) brightness(0.7)';
          ctx.drawImage(video, -20, -20, targetWidth + 40, targetHeight + 40);
          ctx.restore();
        }

        let drawW = targetWidth;
        let drawH = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcRatio > destRatio) {
          drawH = targetWidth / srcRatio;
          offsetY = (targetHeight - drawH) / 2;
        } else {
          drawW = targetHeight * srcRatio;
          offsetX = (targetWidth - drawW) / 2;
        }

        ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
      } else {
        // Cover / Fill Mode
        let cropW = vW;
        let cropH = vH;
        let cropX = 0;
        let cropY = 0;

        if (srcRatio > destRatio) {
          cropW = vH * destRatio;
          cropX = (vW - cropW) / 2;
        } else {
          cropH = vW / destRatio;
          cropY = (vH - cropH) / 2;
        }

        ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, targetWidth, targetHeight);
      }

      const p = Math.min(99, Math.round((video.currentTime / duration) * 100));
      setProgress(p);
      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Video Resolution & Aspect Ratio Changer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert landscape videos to 9:16 Shorts/Reels/TikTok, 1:1 Square, or 16:9 Widescreen with blurred letterboxing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[180px]"
          >
            <input
              type="file"
              accept="video/*"
              id="ratio-video-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {videoFile ? (
              <div className="space-y-1 text-center w-full">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{videoFile.name}</p>
                <label
                  htmlFor="ratio-video-file"
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block pt-1 font-bold"
                >
                  Choose another video
                </label>
              </div>
            ) : (
              <label htmlFor="ratio-video-file" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload Video File</p>
              </label>
            )}
          </div>

          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              className="hidden"
              playsInline
              preload="auto"
            />
          )}

          {/* Aspect Ratio Presets */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Aspect Ratio
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ratio) => {
                  const Icon = ratio.icon;
                  return (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={`p-3 rounded-xl text-xs font-bold text-left border flex items-center gap-2.5 transition-all cursor-pointer ${
                        selectedRatio === ratio.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="font-bold">{ratio.id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ratio.name.split(' ')[1]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fit Modes */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setFitMode('contain')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fitMode === 'contain' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Fit (Letterbox / Blur)
              </button>
              <button
                onClick={() => setFitMode('cover')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fitMode === 'cover' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Crop to Fill (Cover)
              </button>
            </div>

            {fitMode === 'contain' && (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={blurBackground}
                  onChange={(e) => setBlurBackground(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Add dynamic blurred background fill</span>
              </label>
            )}

            <button
              onClick={processResize}
              disabled={!videoUrl || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Aspect Ratio ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert Aspect Ratio</span>
                </>
              )}
            </button>

            {isProcessing && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Output & Download */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[340px]">
            {outputUrl ? (
              <div className="space-y-3 w-full text-center">
                <video
                  src={outputUrl}
                  controls
                  className="max-h-80 mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 object-contain"
                />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Resized video ready!
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <Layout className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Resized video preview will appear here</p>
              </div>
            )}
          </div>

          {outputUrl && (
            <div className="flex items-center justify-end">
              <a
                href={outputUrl}
                download={`resized_${selectedRatio.replace(':', '_')}_${videoFile?.name.replace(/\.[^/.]+$/, '') || 'video'}.webm`}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Resized Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
