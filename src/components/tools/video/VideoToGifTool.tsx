import React, { useState, useRef } from 'react';
import { Upload, Video, Download, RefreshCw, Sparkles, Film, Image as ImageIcon, Sliders } from 'lucide-react';
import { GifWriter } from 'omggif';

export function VideoToGifTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(3);
  const [duration, setDuration] = useState<number>(0);
  const [gifWidth, setGifWidth] = useState<number>(360);
  const [fps, setFps] = useState<number>(10);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a valid video file');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setGifUrl(null);
    setProgress(0);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const onVideoLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 5;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, 4));
    }
  };

  const convertToGif = async () => {
    if (!videoUrl || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);

    const video = videoRef.current;
    const clipDuration = Math.max(0.5, endTime - startTime);
    const totalFrames = Math.floor(clipDuration * fps);
    const frameInterval = 1 / fps;

    const aspect = (video.videoHeight || 1) / (video.videoWidth || 1);
    const width = gifWidth;
    const height = Math.round(width * aspect);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setIsProcessing(false);
      onShowToast('Canvas context error');
      return;
    }

    try {
      const gifBuffer = new Uint8Array(width * height * totalFrames * 4 + 1024);
      const writer = new GifWriter(gifBuffer, width, height, { loop: 0 });

      for (let i = 0; i < totalFrames; i++) {
        const targetTime = startTime + i * frameInterval;
        video.currentTime = targetTime;

        await new Promise((resolve) => {
          const onSeek = () => {
            video.removeEventListener('seeked', onSeek);
            resolve(true);
          };
          video.addEventListener('seeked', onSeek);
        });

        ctx.drawImage(video, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const rgba = imgData.data;

        // Convert RGBA to palette
        const palette: number[] = [];
        const indexedPixels = new Uint8Array(width * height);
        const colorMap = new Map<number, number>();

        for (let p = 0; p < rgba.length; p += 4) {
          const r = rgba[p] & 0xf8;
          const g = rgba[p + 1] & 0xfc;
          const b = rgba[p + 2] & 0xf8;
          const colorKey = (r << 16) | (g << 8) | b;

          let index = colorMap.get(colorKey);
          if (index === undefined) {
            if (palette.length < 256) {
              index = palette.length;
              palette.push(colorKey);
              colorMap.set(colorKey, index);
            } else {
              index = 0; // fallback clamp
            }
          }
          indexedPixels[p / 4] = index;
        }

        // Pad palette to power of 2
        let pLen = palette.length;
        if (pLen < 2) pLen = 2;
        let pow2 = 2;
        while (pow2 < pLen) pow2 <<= 1;
        while (palette.length < pow2) palette.push(0);

        const delayHundredths = Math.round(100 / fps);
        writer.addFrame(0, 0, width, height, indexedPixels as any, {
          palette,
          delay: delayHundredths,
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 100));
      }

      const gifData = gifBuffer.subarray(0, writer.end());
      const blob = new Blob([gifData], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      onShowToast('GIF generated successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to generate GIF. Try reducing duration or width.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Video to GIF Maker (Client-Side)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert any video clip into an animated GIF with customizable duration, frame rate, and dimensions.
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
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[200px]"
          >
            <input
              type="file"
              accept="video/*"
              id="video-gif-file"
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
                  Duration: {duration.toFixed(1)}s
                </p>
                <label
                  htmlFor="video-gif-file"
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer block pt-1"
                >
                  Choose another video
                </label>
              </div>
            ) : (
              <label htmlFor="video-gif-file" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Video File</p>
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV</p>
                </div>
              </label>
            )}
          </div>

          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={onVideoLoaded}
              className="hidden"
              playsInline
              preload="auto"
            />
          )}

          {/* Settings */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Time ({startTime}s)</label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, duration - 0.5)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 0.5))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">End Time ({endTime}s)</label>
                <input
                  type="range"
                  min={startTime + 0.5}
                  max={duration || 10}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">GIF Width ({gifWidth}px)</label>
                <select
                  value={gifWidth}
                  onChange={(e) => setGifWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <option value={240}>240px (Lightweight)</option>
                  <option value={360}>360px (Standard)</option>
                  <option value={480}>480px (HQ)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Frame Rate ({fps} FPS)</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <option value={6}>6 FPS (Ultra Small)</option>
                  <option value={10}>10 FPS (Balanced)</option>
                  <option value={15}>15 FPS (Smooth)</option>
                </select>
              </div>
            </div>

            <button
              onClick={convertToGif}
              disabled={!videoUrl || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Encoding GIF Frames ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Animated GIF</span>
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
                  <span>Rendering color palette & frames...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: GIF Output & Download */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {gifUrl ? (
              <div className="space-y-3 w-full text-center">
                <img
                  src={gifUrl}
                  alt="Converted GIF"
                  className="max-h-64 mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 object-contain"
                />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  GIF generated & ready to download
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <ImageIcon className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">GIF preview will appear here</p>
              </div>
            )}
          </div>

          {gifUrl && (
            <div className="flex items-center justify-end">
              <a
                href={gifUrl}
                download={`${videoFile?.name.replace(/\.[^/.]+$/, '') || 'animation'}.gif`}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Animated GIF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
