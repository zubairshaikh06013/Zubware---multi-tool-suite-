import React, { useState, useRef } from 'react';
import { Subtitles, Video, Upload, Download, Copy, Check, Plus, Trash2, Play, Pause, RefreshCw, Mic, Sparkles } from 'lucide-react';

interface SubtitleLine {
  id: string;
  start: number; // in seconds
  end: number;
  text: string;
}

export function SubtitleGeneratorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([
    { id: '1', start: 0, end: 2.5, text: 'Welcome to this video tutorial.' },
    { id: '2', start: 2.6, end: 5.0, text: 'Today we will learn fast client-side video tools.' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a video file');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const formatTimestampSrt = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  };

  const formatTimestampVtt = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  const addLine = () => {
    const last = subtitles[subtitles.length - 1];
    const newStart = last ? Number((last.end + 0.1).toFixed(1)) : Number(currentTime.toFixed(1));
    const newEnd = Number((newStart + 2.5).toFixed(1));
    const newLine: SubtitleLine = {
      id: Date.now().toString(),
      start: newStart,
      end: newEnd,
      text: '',
    };
    setSubtitles([...subtitles, newLine]);
    onShowToast('Added caption line');
  };

  const updateLine = (id: string, field: keyof SubtitleLine, value: any) => {
    setSubtitles(subtitles.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  };

  const removeLine = (id: string) => {
    setSubtitles(subtitles.filter((line) => line.id !== id));
  };

  const setStartToCurrent = (id: string) => {
    if (!videoRef.current) return;
    const time = Number(videoRef.current.currentTime.toFixed(1));
    updateLine(id, 'start', time);
    onShowToast(`Start time set to ${time}s`);
  };

  const setEndToCurrent = (id: string) => {
    if (!videoRef.current) return;
    const time = Number(videoRef.current.currentTime.toFixed(1));
    updateLine(id, 'end', time);
    onShowToast(`End time set to ${time}s`);
  };

  // Generate SRT format
  const generateSrt = (): string => {
    return subtitles
      .sort((a, b) => a.start - b.start)
      .map((line, idx) => {
        return `${idx + 1}\n${formatTimestampSrt(line.start)} --> ${formatTimestampSrt(line.end)}\n${line.text}\n`;
      })
      .join('\n');
  };

  // Generate WebVTT format
  const generateVtt = (): string => {
    const body = subtitles
      .sort((a, b) => a.start - b.start)
      .map((line) => {
        return `${formatTimestampVtt(line.start)} --> ${formatTimestampVtt(line.end)}\n${line.text}\n`;
      })
      .join('\n');
    return `WEBVTT\n\n${body}`;
  };

  const downloadSrt = () => {
    const srt = generateSrt();
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoFile?.name.replace(/\.[^/.]+$/, '') || 'subtitles'}.srt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded SRT Subtitles file!');
  };

  const downloadVtt = () => {
    const vtt = generateVtt();
    const blob = new Blob([vtt], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoFile?.name.replace(/\.[^/.]+$/, '') || 'subtitles'}.vtt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded WebVTT file!');
  };

  // Speech Recognition for live transcribing while playing
  const toggleSpeechRecognition = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onShowToast('Speech Recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      onShowToast('Voice dictation stopped');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      const lastIndex = event.results.length - 1;
      const transcript = event.results[lastIndex][0].transcript.trim();
      const current = videoRef.current ? Number(videoRef.current.currentTime.toFixed(1)) : 0;

      const newLine: SubtitleLine = {
        id: Date.now().toString(),
        start: Math.max(0, current - 2),
        end: current + 1,
        text: transcript,
      };

      setSubtitles((prev) => [...prev, newLine]);
    };

    rec.onend = () => setIsRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
    onShowToast('Listening for speech cues...');
  };

  const activeSubtitle = subtitles.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  );

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Subtitles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Subtitle & Closed Caption Generator (SRT / VTT)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, auto-sync, and export formatted subtitles (.SRT and .VTT) with real-time video playback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Video Player with Live Subtitle Overlay */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            {videoUrl ? (
              <div className="w-full relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onTimeUpdate={() => {
                    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                  }}
                  playsInline
                  controls
                  className="max-h-72 mx-auto rounded-2xl w-full object-contain"
                />

                {/* Subtitle Overlay */}
                {activeSubtitle && (
                  <div className="absolute bottom-14 inset-x-4 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1 bg-black/80 text-white font-bold text-xs rounded-lg shadow-md border border-white/10">
                      {activeSubtitle.text}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="subtitle-video-file"
                className="cursor-pointer text-center space-y-3 p-6 block"
              >
                <input
                  type="file"
                  accept="video/*"
                  id="subtitle-video-file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Upload Video File</p>
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV</p>
                </div>
              </label>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
            </button>

            <button
              onClick={addLine}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subtitle Line
            </button>
          </div>
        </div>

        {/* Right Col: Subtitles Timeline & List Editor */}
        <div className="lg:col-span-7 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Captions Timeline ({subtitles.length} lines)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadSrt}
                disabled={!subtitles.length}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download .SRT
              </button>
              <button
                onClick={downloadVtt}
                disabled={!subtitles.length}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3 h-3" /> Download .VTT
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {subtitles.map((sub, index) => (
              <div
                key={sub.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  currentTime >= sub.start && currentTime <= sub.end
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-slate-400">#{index + 1}</span>

                  <div className="flex items-center gap-1 text-xs">
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={sub.start}
                      onChange={(e) => updateLine(sub.id, 'start', Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-mono font-bold text-xs"
                    />
                    <span className="text-slate-400">&rarr;</span>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={sub.end}
                      onChange={(e) => updateLine(sub.id, 'end', Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-mono font-bold text-xs"
                    />
                    <span className="text-[10px] text-slate-400">sec</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setStartToCurrent(sub.id)}
                      title="Set start time to current playback timestamp"
                      className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                    >
                      Set Start
                    </button>
                    <button
                      onClick={() => setEndToCurrent(sub.id)}
                      title="Set end time to current playback timestamp"
                      className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                    >
                      Set End
                    </button>
                    <button
                      onClick={() => removeLine(sub.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={sub.text}
                  onChange={(e) => updateLine(sub.id, 'text', e.target.value)}
                  placeholder="Type subtitle line..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
