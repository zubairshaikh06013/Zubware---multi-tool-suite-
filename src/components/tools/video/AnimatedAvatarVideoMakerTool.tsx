import React, { useEffect, useRef, useState } from 'react';

/** Client-only, no paid API. Recorded exports use uploaded audio; browser TTS is preview-only. */
export function AnimatedAvatarVideoMakerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [script, setScript] = useState('Namaste dosto! Aaj hum ek zabardast free tool dekhenge.');
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('#7c3aed');
  const frame = useRef(0);
  const speaking = useRef(false);
  const audioLevel = useRef(0);
  const playbackTime = useRef(0);
  const playbackDuration = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const samplesRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const words = script.trim().split(/\s+/).filter(Boolean);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const render = () => {
      const t = frame.current++ / 30;
      const w = canvas.width, h = canvas.height;
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#111827');
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff22';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath(); ctx.arc((i * 193) % w, (i * 287 + t * 12) % h, 20 + i * 5, 0, Math.PI * 2); ctx.fill();
      }
      const analyser = analyserRef.current;
      const samples = samplesRef.current;
      if (analyser && samples && speaking.current) {
        analyser.getByteTimeDomainData(samples);
        let energy = 0;
        for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
        const target = Math.min(1, Math.sqrt(energy / samples.length) * 5);
        audioLevel.current += (target - audioLevel.current) * 0.4;
      } else audioLevel.current *= 0.8;
      const cy = 780 + Math.sin(t * 2) * 8;
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.ellipse(540, 1250, 340, 320, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f4b183'; ctx.beginPath(); ctx.ellipse(540, cy, 230, 280, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#171717'; ctx.beginPath(); ctx.ellipse(540, cy - 190, 235, 112, 0, Math.PI, 2 * Math.PI); ctx.fill();
      for (const x of [455, 625]) {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x, cy - 30, 30, 36, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(x, cy - 26, 13, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#7f1d1d'; ctx.beginPath();
      ctx.ellipse(540, cy + 115, 65, speaking.current ? 9 + audioLevel.current * 75 : 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 54px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('ZUBWARE VIDEO MAKER', 540, 160);
      ctx.fillStyle = '#000b'; ctx.fillRect(65, 1490, 950, 250);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 55px sans-serif';
      const index = playbackDuration.current > 0
        ? Math.min(words.length - 1, Math.floor((playbackTime.current / playbackDuration.current) * words.length))
        : Math.floor(t * 2.3) % Math.max(1, words.length);
      const groupStart = Math.floor(Math.max(0, index) / 4) * 4;
      const group = words.slice(groupStart, groupStart + 4);
      ctx.font = 'bold 65px sans-serif';
      const widths = group.map(word => ctx.measureText(word).width);
      const total = widths.reduce((a, b) => a + b, 0) + (group.length - 1) * 22;
      let x = (w - total) / 2;
      group.forEach((word, i) => {
        ctx.fillStyle = groupStart + i === index ? '#facc15' : '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(word, x, 1620);
        x += widths[i] + 22;
      });
      ctx.textAlign = 'center';
      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [script, color]);

  const preview = () => {
    playbackDuration.current = 0;
    if (!('speechSynthesis' in window)) { setMessage('This browser does not support text-to-speech.'); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = voiceLang; utterance.rate = 0.95;
    utterance.onstart = () => { speaking.current = true; };
    utterance.onend = () => { speaking.current = false; };
    utterance.onerror = () => { speaking.current = false; };
    speechSynthesis.speak(utterance);
  };

  const exportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioFile || !audioRef.current) {
      setMessage('Video with sound export karne ke liye pehle voice audio upload karein.');
      return;
    }
    if (!canvas.captureStream || typeof MediaRecorder === 'undefined') {
      setMessage('Is browser mein video recording supported nahi hai. Chrome desktop try karein.');
      return;
    }
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      .find(type => MediaRecorder.isTypeSupported(type));
    if (!mime) { setMessage('WebM recording unsupported.'); return; }
    const audio = audioRef.current;
    const url = URL.createObjectURL(audioFile);
    audio.src = url;
    try {
      await new Promise<void>((resolve, reject) => {
        audio.onloadedmetadata = () => resolve();
        audio.onerror = () => reject(new Error('Audio could not be loaded'));
      });
      const audioCtx = audioContextRef.current || new AudioContext();
      audioContextRef.current = audioCtx;
      const source = sourceRef.current || audioCtx.createMediaElementSource(audio);
      sourceRef.current = source;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      samplesRef.current = new Uint8Array(analyser.fftSize);
      source.connect(analyser);
      const destination = audioCtx.createMediaStreamDestination();
      analyser.connect(destination);
      analyser.connect(audioCtx.destination);
      const stream = canvas.captureStream(30);
      destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        const video = new Blob(chunks, { type: mime });
        const downloadUrl = URL.createObjectURL(video);
        const link = document.createElement('a');
        link.href = downloadUrl; link.download = 'zubware-avatar-video.webm'; link.click();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 30000);
        stream.getTracks().forEach(track => track.stop());
        analyser.disconnect(); analyserRef.current = null;
        URL.revokeObjectURL(url);
        speaking.current = false; setRecording(false);
        setMessage('WebM video download ready. MP4 export future update mein aayega.');
      };
      recorder.onerror = () => setMessage('Recording failed. Please try again.');
      await audioCtx.resume();
      recorder.start(250);
      setRecording(true); setMessage('Recording video...');
      audio.currentTime = 0;
      playbackDuration.current = audio.duration;
      playbackTime.current = 0;
      audio.ontimeupdate = () => { playbackTime.current = audio.currentTime; };
      speaking.current = true;
      audio.onended = () => recorder.state !== 'inactive' && recorder.stop();
      await audio.play();
    } catch (error) {
      URL.revokeObjectURL(url); setRecording(false); speaking.current = false;
      setMessage(error instanceof Error ? error.message : 'Unable to record');
    }
  };

  return <section className="mx-auto max-w-5xl p-4 text-slate-900 dark:text-white">
    <h1 className="text-3xl font-bold mb-2">Free Animated Avatar Video Maker</h1>
    <p className="mb-5">Create talking cartoon videos with captions. Free, browser-based and no API key required.</p>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <label className="block font-semibold">Video script
          <textarea className="w-full rounded-lg border p-3 text-black min-h-36" maxLength={2000} value={script} onChange={e => setScript(e.target.value)} />
        </label>
        <label className="block font-semibold">Voice language
          <select className="block w-full rounded-lg border p-3 text-black" value={voiceLang} onChange={e => setVoiceLang(e.target.value)}>
            <option value="hi-IN">Hindi / Hinglish</option><option value="en-IN">Indian English</option><option value="en-US">English</option>
          </select>
        </label>
        <label className="block font-semibold">Background color
          <input className="block mt-2" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </label>
        <button type="button" onClick={preview} className="rounded-lg bg-indigo-600 px-5 py-3 text-white">▶ Preview AI-style voice</button>
        <p className="text-sm">For export with sound, upload your own narration MP3/WAV/M4A. Browser speech preview cannot reliably be recorded into video.</p>
        <label className="block font-semibold">Narration audio
          <input className="block mt-2 w-full" type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
        </label>
        <button type="button" disabled={recording || !audioFile} onClick={exportVideo} className="rounded-lg bg-emerald-600 px-5 py-3 text-white disabled:opacity-50">Export 9:16 WebM video</button>
        <p role="status" aria-live="polite">{message}</p>
      </div>
      <div className="mx-auto w-full max-w-xs">
        <canvas ref={canvasRef} width={1080} height={1920} className="w-full rounded-2xl shadow-xl" aria-label="Animated avatar video preview" />
      </div>
    </div>
    <audio ref={audioRef} hidden />
    <p className="mt-5 text-sm opacity-75">Privacy: rendering runs locally in your browser. Captions use approximate timing, not speech recognition. Output is WebM, not MP4.</p>
  </section>;
}
