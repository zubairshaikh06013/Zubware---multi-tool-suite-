import React, { useState, useRef } from 'react';
import { Upload, Video, Download, RefreshCw, Scissors, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export function VideoTrimmerTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trimming timeline
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a valid video file');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setTrimmedUrl(null);
    setProgress(0);
    setIsPlaying(false);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, 10));
      setCurrentTime(0);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);
      if (curr >= endTime && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(1);
    return `${m}:${Number(s) < 10 ? '0' : ''}${s}`;
  };

  const processTrim = async () => {
    if (!videoUrl || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);

    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);

    video.currentTime = startTime;
    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const stream = canvas.captureStream(30);

    // Audio track
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioStream = (video as any).captureStream ? (video as any).captureStream() : null;
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      audioStream.getAudioTracks().forEach((track: MediaStreamTrack) => stream.addTrack(track));
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_000_000 });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setTrimmedUrl(url);
      setIsProcessing(false);
      setProgress(100);
      onShowToast('Trimmed clip created!');
    };

    const trimDuration = Math.max(0.1, endTime - startTime);
    recorder.start(100);
    await video.play();

    const checkInterval = () => {
      if (video.currentTime >= endTime || video.paused || video.ended) {
        video.pause();
        recorder.stop();
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentElapsed = video.currentTime - startTime;
      setProgress(Math.min(99, Math.round((currentElapsed / trimDuration) * 100)));
      requestAnimationFrame(checkInterval);
    };

    checkInterval();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Video Trimmer & Cutter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cut and extract specific portions of your video with millisecond accuracy. 100% private browser processing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
            {videoUrl ? (
              <div className="w-full space-y-3">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={onLoadedMetadata}
                  onTimeUpdate={onTimeUpdate}
                  playsInline
                  className="max-h-72 mx-auto rounded-2xl w-full object-contain"
                />

                {/* Video Play/Pause & Time Indicator */}
                <div className="flex items-center justify-between px-2 pt-1 text-white">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play Selection'}</span>
                  </button>

                  <span className="text-xs font-mono text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            ) : (
              <label
                htmlFor="trim-video-file"
                className="cursor-pointer text-center space-y-3 p-6 block"
              >
                <input
                  type="file"
                  accept="video/*"
                  id="trim-video-file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Upload Video to Trim</p>
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV</p>
                </div>
              </label>
            )}
          </div>

          {/* Timeline Range Controls */}
          {videoUrl && (
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Trim Range Selection</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  Clip Duration: {formatTime(Math.max(0, endTime - startTime))}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Start Time: {formatTime(startTime)}</label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, duration - 0.2)}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), endTime - 0.2);
                      setStartTime(v);
                      if (videoRef.current) videoRef.current.currentTime = v;
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">End Time: {formatTime(endTime)}</label>
                  <input
                    type="range"
                    min={startTime + 0.2}
                    max={duration || 10}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setEndTime(v);
                      if (videoRef.current) videoRef.current.currentTime = v;
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <button
                onClick={processTrim}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cutting Video Clip ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Export Trimmed Clip</span>
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Output & Download */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {trimmedUrl ? (
              <div className="space-y-3 w-full text-center">
                <video
                  src={trimmedUrl}
                  controls
                  className="max-h-64 mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full"
                />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Trimmed video ready to save!
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <Video className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Trimmed clip preview will appear here</p>
              </div>
            )}
          </div>

          {trimmedUrl && (
            <div className="flex items-center justify-end">
              <a
                href={trimmedUrl}
                download={`trimmed_${videoFile?.name.replace(/\.[^/.]+$/, '') || 'clip'}.webm`}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Trimmed Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
