import './MarriageBiodataMakerTool.css';
import React, { useEffect, useRef, useState } from 'react';
import { biodataFields, biodataThemes, emptyBiodata, renderBiodata, downloadBiodataBlob, type BiodataData, type BiodataOptions } from '../../lib/marriageBiodata';

const DRAFT_KEY = 'zubware-marriage-biodata-v1';
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white';
const initial: BiodataOptions = { language: 'hi', theme: 0, heading: '', photo: '', data: { ...emptyBiodata } };

export function MarriageBiodataMakerTool({ onShowToast }: { onShowToast: (message: string) => void }) {
  const [options, setOptions] = useState<BiodataOptions>(initial);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const preview = useRef<HTMLDivElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const photoJob = useRef(0);
  const [photoBusy, setPhotoBusy] = useState(false);
  const announce = (message: string) => { setNotice(message); onShowToast(message); };
  const change = (patch: Partial<BiodataOptions>) => setOptions(o => ({ ...o, ...patch }));

  useEffect(() => {
    let stale = false; setRendering(true); setError('');
    const timer = window.setTimeout(() => {
      renderBiodata(options).then(result => { if (!stale) { setPages(result); setRendering(false); } }).catch(() => {
        if (!stale) { setPages([]); setError('Preview नहीं बन पाया। फोटो हटाकर दोबारा कोशिश करें।'); setRendering(false); }
      });
    }, 180);
    return () => { stale = true; window.clearTimeout(timer); };
  }, [options]);
  useEffect(() => {
    if (!preview.current) return;
    preview.current.replaceChildren(...pages);
    for (const canvas of pages) { canvas.style.width = '100%'; canvas.style.height = 'auto'; canvas.style.display = 'block'; canvas.style.marginBottom = '16px'; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'बायोडाटा का A4 preview'); }
  }, [pages]);

  async function loadPhoto(file?: File) {
    if (!file) return;
    const job = ++photoJob.current;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setPhotoBusy(false); setError('JPG, PNG या WebP फोटो चुनें, ज्यादा से ज्यादा 10 MB।'); if (upload.current) upload.current.value = ''; return;
    }
    setPhotoBusy(true); setError('');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (job === photoJob.current) change({ photo: canvas.toDataURL('image/jpeg', 0.92) });
    } catch { if (job === photoJob.current) setError('यह फोटो नहीं खुली। दूसरी JPG या PNG चुनें।'); }
    finally { URL.revokeObjectURL(url); if (job === photoJob.current) setPhotoBusy(false); if (upload.current) upload.current.value = ''; }
  }

  async function exportFile(format: 'pdf' | 'png') {
    if (!options.data.name.trim()) { setError('Download से पहले पूरा नाम भरें।'); document.getElementById('biodata-name')?.focus(); return; }
    if (rendering || photoBusy || !pages.length) return;
    setBusy(true); setError('');
    try {
      const filename = 'marriage-biodata';
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf'); const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
        pages.forEach((canvas, i) => { if (i) pdf.addPage(); pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297, undefined, 'FAST'); });
        downloadBiodataBlob(pdf.output('blob'), `${filename}.pdf`);
      } else if (pages.length === 1) {
        const blob = await new Promise<Blob>((resolve, reject) => pages[0].toBlob(b => b ? resolve(b) : reject(new Error('PNG failed')), 'image/png'));
        downloadBiodataBlob(blob, `${filename}.png`);
      } else {
        const { default: JSZip } = await import('jszip'); const zip = new JSZip();
        pages.forEach((canvas, i) => zip.file(`${filename}-${i + 1}.png`, canvas.toDataURL('image/png').split(',')[1], { base64: true }));
        downloadBiodataBlob(await zip.generateAsync({ type: 'blob' }), `${filename}-pages.zip`);
      }
      announce('Download तैयार है। PDF खोलकर details check कर लें।');
    } catch { setError('Download नहीं बन पाया। दोबारा कोशिश करें।'); } finally { setBusy(false); }
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(options)); announce('Draft इसी browser में save हुआ। Shared phone पर काम खत्म होने के बाद इसे मिटा दें।'); }
    catch { setError('Draft save नहीं हुआ। Browser storage भरा या बंद हो सकता है।'); }
  }
  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY); if (!raw) { announce('इस browser में कोई saved draft नहीं है।'); return; }
      const draft = JSON.parse(raw);
      if (!draft || !draft.data) throw new Error('Invalid draft');
      const data = Object.fromEntries(biodataFields.map(([key]) => [key, typeof draft.data[key] === 'string' ? draft.data[key].slice(0, 1500) : ''])) as BiodataData;
      const restored = { language: draft.language === 'en' ? 'en' as const : 'hi' as const, theme: Number.isInteger(draft.theme) && draft.theme >= 0 && draft.theme < 6 ? draft.theme : 0,
        heading: typeof draft.heading === 'string' ? draft.heading.slice(0, 80) : '', photo: typeof draft.photo === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(draft.photo) ? draft.photo : '', data };
      photoJob.current++; setPhotoBusy(false); setError(''); setOptions(restored); announce('Saved draft खुल गया।');
    } catch { setError('Saved draft नहीं खुला। नया biodata बना सकते हैं।'); }
  }
  function reset() {
    if (!window.confirm('सारी भरी details और इसी browser में saved draft मिटा दें?')) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch { setError('Saved draft storage से नहीं मिट पाया। Browser settings से site data साफ करें।'); return; }
    photoJob.current++; setPhotoBusy(false); setOptions({ ...initial, data: { ...emptyBiodata } }); setPages([]); setError(''); announce('Details और saved draft मिट गए।');
  }

  return <div className="biodata-maker space-y-6">
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-bold">शादी का बायोडाटा बनाएं — बिल्कुल free</h2>
      <p className="mt-2 text-sm">कोई login, payment या watermark नहीं। आपकी details और फोटो इसी browser में process होती हैं। खाली fields download में नहीं दिखेंगी।</p>
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-5 min-w-0">
        <section className="rounded-2xl border border-slate-200 p-4 space-y-4 dark:border-slate-700" aria-label="बायोडाटा का design">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">बायोडाटा के labels<select className={`${inputClass} mt-1`} value={options.language} onChange={e => change({ language: e.target.value as 'hi' | 'en' })}><option value="hi">हिंदी</option><option value="en">English</option></select></label>
            <label className="text-sm font-semibold">ऊपर की heading<input className={`${inputClass} mt-1`} value={options.heading} maxLength={80} placeholder={options.language === 'hi' ? 'शादी का बायोडाटा' : 'Marriage Biodata'} onChange={e => change({ heading: e.target.value })} /></label>
          </div>
          <p className="text-xs text-slate-500">आप अपनी भाषा में लिख सकते हैं। Language बदलने से भरी हुई details translate नहीं होंगी। Muslim, Hindu या neutral biodata के लिए अपनी पसंद की heading और details रखें।</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Free templates">{biodataThemes.map((theme, i) => <button key={theme.name} type="button" aria-pressed={options.theme === i} onClick={() => change({ theme: i })} className={`rounded-xl border-2 p-3 text-sm font-semibold ${options.theme === i ? 'ring-2 ring-offset-2 ring-rose-500' : ''}`} style={{ color: theme.ink, background: theme.paper, borderColor: theme.ink }}>{theme.name}</button>)}</div>
          <label className="block text-sm font-semibold">फोटो (optional)<input ref={upload} type="file" accept="image/jpeg,image/png,image/webp" className="block mt-2 w-full text-sm" onChange={e => void loadPhoto(e.target.files?.[0])} /></label>
          <p className="text-xs text-slate-500">JPG, PNG या WebP, 10 MB तक। Portrait फोटो चुनें; frame में center crop होगा।</p>
          {photoBusy && <p role="status">फोटो तैयार हो रही है…</p>}
          {options.photo && <button className="text-sm text-rose-600 underline" type="button" onClick={() => { photoJob.current++; setPhotoBusy(false); change({ photo: '' }); }}>फोटो हटाएं</button>}
        </section>
        <section className="grid gap-4 sm:grid-cols-2" aria-label="बायोडाटा की details">
          {biodataFields.map(([key, hi, en]) => <label key={key} className={`block text-sm font-semibold ${['about', 'partner', 'contact'].includes(key) ? 'sm:col-span-2' : ''}`} htmlFor={`biodata-${key}`}>{hi}{key === 'name' ? ' *' : ''}<span className="ml-1 text-xs font-normal text-slate-500">{en}</span>
            {['about', 'partner', 'contact', 'siblings'].includes(key) ? <textarea id={`biodata-${key}`} className={`${inputClass} mt-1`} rows={3} maxLength={1500} value={options.data[key]} onChange={e => setOptions(o => ({ ...o, data: { ...o.data, [key]: e.target.value } }))} /> : <input id={`biodata-${key}`} className={`${inputClass} mt-1`} required={key === 'name'} maxLength={300} value={options.data[key]} placeholder={key === 'dob' ? 'जैसे 15 March 1998' : ''} onChange={e => setOptions(o => ({ ...o, data: { ...o.data, [key]: e.target.value } }))} />}
          </label>)}
        </section>
        <p className="text-xs text-slate-500">सिर्फ वही जानकारी भरें जो आप share करना चाहते हैं। Aadhaar, PAN या bank details जोड़ने की जरूरत नहीं है।</p>
        <div className="flex flex-wrap gap-3"><button type="button" className="rounded-xl border px-4 py-2" onClick={saveDraft}>Draft save करें</button><button type="button" className="rounded-xl border px-4 py-2" onClick={restoreDraft}>Saved draft खोलें</button><button type="button" className="rounded-xl border px-4 py-2 text-rose-600" onClick={reset}>सब मिटाएं</button></div>
        <p className="text-xs text-slate-500">Draft save करने पर details और फोटो इसी browser के storage में रहेंगी। अपने आप save नहीं होतीं।</p>
      </div>
      <section className="min-w-0 space-y-3" aria-label="Preview और download">
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy || rendering || photoBusy || !pages.length} className="rounded-xl bg-rose-600 px-5 py-3 font-bold text-white disabled:opacity-50" onClick={() => void exportFile('pdf')}>{busy ? 'तैयार हो रहा है…' : 'PDF download करें'}</button>
          <button type="button" disabled={busy || rendering || photoBusy || !pages.length} className="rounded-xl border px-5 py-3 font-semibold disabled:opacity-50" onClick={() => void exportFile('png')}>PNG download करें</button>
        </div>
        <p className="text-xs text-slate-500">A4 • {pages.length || 1} पेज • बिना watermark। ज्यादा details होने पर अगले पेज पर जाएंगी। कई PNG pages हों तो ZIP मिलेगा।</p>
        {rendering && <p role="status" className="text-sm">Preview update हो रहा है…</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
        <p role="status" aria-live="polite" className="text-sm">{notice}</p>
        {!options.data.name && <p className="text-sm text-slate-500">शुरू करने के लिए नाम और अपनी details भरें।</p>}
        <div ref={preview} className="rounded-xl bg-slate-200 p-2 sm:p-4" style={{ opacity: rendering ? 0.6 : 1 }} />
      </section>
    </div>
  </div>;
}
