import React, { useEffect, useRef, useState } from 'react';

export function PartnerSignaturePad({ name, value, onChange, hindi }: { name: string; value?: string; onChange: (image: string) => void; hindi: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const uploadVersion = useRef(0);
  const [error, setError] = useState('');
  const tr = (en: string, hi: string) => hindi ? hi : en;
  useEffect(() => {
    uploadVersion.current++;
    const c = canvas.current, ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (value) { const img = new Image(); const version = uploadVersion.current; img.onload = () => { if (version !== uploadVersion.current) return; const scale = Math.min(c.width / img.width, c.height / img.height); ctx.drawImage(img, (c.width - img.width * scale) / 2, (c.height - img.height * scale) / 2, img.width * scale, img.height * scale); }; img.src = value; }
  }, [value]);
  const position = (e: React.PointerEvent<HTMLCanvasElement>) => { const c = canvas.current!; const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height }; };
  const finish = (e: React.PointerEvent<HTMLCanvasElement>) => { if (!drawing.current) return; drawing.current = false; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); onChange(canvas.current!.toDataURL('image/png')); };
  const upload = async (file?: File) => {
    if (!file) return;
    setError('');
    const request = ++uploadVersion.current;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError(tr('Use PNG, JPG or WebP up to 5 MB.', '5 MB तक की PNG, JPG या WebP चुनें।')); return; }
    const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url; await img.decode();
      if (request !== uploadVersion.current) return;
      if (!img.width || !img.height || img.width * img.height > 20000000) throw Error();
      // Re-encode as a bounded local PNG. No original SVG or external references enter the PDF.
      const c = document.createElement('canvas'); c.width = 720; c.height = 240;
      const ctx = c.getContext('2d')!;
      const scale = Math.min(c.width / img.width, c.height / img.height);
      ctx.drawImage(img, (c.width - img.width * scale) / 2, (c.height - img.height * scale) / 2, img.width * scale, img.height * scale);
      onChange(c.toDataURL('image/png'));
    } catch { setError(tr('Image could not be read. Try a smaller image.', 'इमेज नहीं खुल पाई। छोटी इमेज चुनें।')); }
    finally { URL.revokeObjectURL(url); }
  };
  return <div className="pa-sign-pad"><strong>{name}</strong><p>{tr('Draw with a finger / mouse, or upload this partner’s authorized signature.', 'उंगली / माउस से साइन करें या इस पार्टनर का अनुमति वाला साइन अपलोड करें।')}</p><canvas ref={canvas} width={720} height={240} aria-label={`${name} ${tr('signature drawing area', 'हस्ताक्षर की जगह')}`} style={{ touchAction: 'none' }} onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); const ctx = canvas.current!.getContext('2d')!; const p = position(e); ctx.beginPath(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = '#142438'; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + .1, p.y + .1); ctx.stroke(); }} onPointerMove={e => { if (!drawing.current) return; const p = position(e); const ctx = canvas.current!.getContext('2d')!; ctx.lineTo(p.x, p.y); ctx.stroke(); }} onPointerUp={finish} onPointerCancel={finish}/><div className="pp-toolbar"><label className="pa-upload">{tr('Upload signature', 'साइन अपलोड करें')}<input aria-label={`${name} ${tr('upload signature', 'साइन अपलोड करें')}`} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }}/></label><button type="button" onClick={() => { uploadVersion.current++; drawing.current = false; onChange(''); }}>{tr('Clear signature', 'साइन मिटाएं')}</button><span>{value ? tr('Image attached', 'साइन इमेज जुड़ी') : tr('Blank — sign on paper later', 'खाली — बाद में कागज पर साइन करें')}</span></div>{error && <p role="alert">{error}</p>}</div>;
}
