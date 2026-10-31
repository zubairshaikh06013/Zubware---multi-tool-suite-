import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Eye, Link2, Save, Upload, X, Plus, Trash2, Copy, Check, Sparkles, ArrowUpRight, Heart } from 'lucide-react';
import { normalizeWedding, renderWedding, sampleWedding, validateWedding, weddingThemes, weddingWording, type WeddingInvitation, type WeddingEvent } from '../../lib/weddingInvitation';
import { downloadBiodataBlob } from '../../lib/marriageBiodata';
import './WeddingInvitationMakerTool.css';
const API = 'https://zubware-invitations.zubairshaikh06013.workers.dev';
const KEY = 'zubware-wedding-invitation-v1';
interface Publication { id: string; token: string; expiresAt: number; snapshot: string }
interface Backup { data: WeddingInvitation; publication: Publication | null }
const blankEvent = (): WeddingEvent => ({ name: '', date: '', time: '19:00', venue: '', address: '' });
export function WeddingInvitationMakerTool({ onShowToast }: { onShowToast: (text: string) => void }) {
  const [data, setData] = useState<WeddingInvitation>(sampleWedding);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [busy, setBusy] = useState(''); const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [readyDownload, setReadyDownload] = useState<{url:string;filename:string}|null>(null);
  useEffect(()=>()=>{if(readyDownload)URL.revokeObjectURL(readyDownload.url)},[readyDownload]);
  const offerFile = (blob: Blob, filename: string) => setReadyDownload({url:URL.createObjectURL(blob),filename});
  const [preview, setPreview] = useState(false); const [publishConsent, setPublishConsent] = useState(false);
  const [debounced, setDebounced] = useState(data);
  const photoJob = useRef(0); const iframe = useRef<HTMLIFrameElement>(null);
  const photoInput = useRef<HTMLInputElement>(null), backupInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null); const previewTrigger = useRef<HTMLButtonElement>(null);
  const announce = (msg: string) => { setNotice(msg); onShowToast(msg); };
  const update = (patch: Partial<WeddingInvitation>) => { setData(d=>({...d,...patch})); setError(''); };
  const snapshot = JSON.stringify(data), dirty = publication && publication.snapshot !== snapshot;
  const link = publication ? `${API}/i/${publication.id}` : '';
  useEffect(()=>{ const timer=setTimeout(()=>setDebounced(data),180); return()=>clearTimeout(timer); },[data]);
  const previewHtml = useMemo(()=>renderWedding(debounced,{open:true}),[debounced]);
  const guestHtml = useMemo(()=>preview?renderWedding(data):'',[preview,data]);
  useEffect(()=>{ if(preview){dialog.current?.showModal()}else{dialog.current?.close()} },[preview]);
  useEffect(()=>()=>{photoJob.current++},[]);
  const changeEvent = (i: number, patch: Partial<WeddingEvent>) => update({events:data.events.map((ev,index)=>index===i?{...ev,...patch}:ev)});
  function language(value: 'hi'|'en') {
    const old=weddingWording[data.language], next=weddingWording[value];
    update({language:value,title:data.title===old.title?next.title:data.title,message:data.message===old.message?next.message:data.message,closing:data.closing===old.closing?next.closing:data.closing});
  }
  async function photo(file?: File) {
    if(!file)return; const job=++photoJob.current;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){setPhotoBusy(false);setError('JPG, PNG या WebP photo चुनें (10 MB तक)।');if(photoInput.current)photoInput.current.value='';return}
    setPhotoBusy(true);setError('');const url=URL.createObjectURL(file);
    try {
      const image=new Image();image.src=url;await image.decode();
      const scale=Math.min(1,700/Math.max(image.naturalWidth,image.naturalHeight)); const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
      const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
      let quality=.85,encoded=canvas.toDataURL('image/jpeg',quality);while(encoded.length>175000&&quality>.25){quality-=.1;encoded=canvas.toDataURL('image/jpeg',quality)}
      if(encoded.length>180000)throw Error('Photo बहुत detailed है। छोटी या crop की हुई photo चुनें।');
      if(job===photoJob.current)update({photo:encoded});
    }catch(e){if(job===photoJob.current)setError(e instanceof Error?e.message:'Photo नहीं खुली। दूसरी photo चुनें।')}
    finally{URL.revokeObjectURL(url);if(job===photoJob.current)setPhotoBusy(false);if(photoInput.current)photoInput.current.value=''}
  }
  function persist(p: Publication|null=publication, current: WeddingInvitation=data) { localStorage.setItem(KEY,JSON.stringify({data:current,publication:p})); }
  function saveDraft(){try{persist();announce('Draft इसी browser में save हो गया।')}catch{setError('Browser में draft save नहीं हुआ। Private backup download करें।')}}
  function restore(value: unknown) {
    if(!value||typeof value!=='object')throw Error('Backup invalid है।'); const raw=value as Record<string, unknown>; const restored=normalizeWedding(raw.data);
    let pub: Publication|null=null; const p=raw.publication as Record<string, unknown>|null;
    if(p&&typeof p.id==='string'&&/^[a-f0-9]{32}$/.test(p.id)&&typeof p.token==='string'&&/^[a-f0-9]{64}$/.test(p.token))pub={id:p.id,token:p.token,expiresAt:typeof p.expiresAt==='number'?p.expiresAt:0,snapshot:typeof p.snapshot==='string'?p.snapshot:''};
    photoJob.current++;setPhotoBusy(false);setData(restored);setPublication(pub);setPublishConsent(false);setError('');announce('Draft खुल गया। बदलाव preview में देखें।');
  }
  function loadDraft(){try{const raw=localStorage.getItem(KEY);if(!raw){announce('इस browser में saved draft नहीं है।');return}restore(JSON.parse(raw))}catch{setError('Saved draft नहीं खुला। Private backup import कर सकते हैं।')}}
  async function importBackup(file?: File){if(!file)return;try{if(file.size>500000)throw Error();restore(JSON.parse(await file.text()))}catch{setError('यह सही invitation backup JSON नहीं है।')}finally{if(backupInput.current)backupInput.current.value=''}}
  function backup(){const out: Backup={data,publication};downloadBiodataBlob(new Blob([JSON.stringify(out)],{type:'application/json'}),'wedding-invitation-private-backup.json');announce('Private backup तैयार है। इसमें edit key है—इसे guests को न भेजें।')}
  async function exportFile(format:'png'|'pdf'|'html'){
    const invalid=validateWedding(data);if(invalid){setError(invalid);return}setBusy(format);setError('');
    let frame:HTMLIFrameElement|null=null;
    try{
      if(format==='html'){offerFile(new Blob([renderWedding(data)],{type:'text/html;charset=utf-8'}),'wedding-invitation.html');announce('Animated HTML तैयार है। Browser में खुलती है; WhatsApp पर link share करना ज्यादा आसान है।');return}
      frame=document.createElement('iframe');frame.title='Invitation export';frame.setAttribute('sandbox','allow-same-origin');frame.style.cssText='position:fixed;left:-10000px;top:0;width:700px;height:1000px;border:0;';
      const ready=new Promise<void>((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Export preview timed out')),15000);frame!.onload=()=>{clearTimeout(timeout);resolve()}});
      frame.srcdoc=renderWedding(data,{export:true});document.body.appendChild(frame);await ready;
      const doc=frame.contentDocument!;await doc.fonts.ready;await Promise.all(Array.from(doc.images).map(image=>image.decode()));
      const element=doc.getElementById('invitation')!;frame.style.height=element.scrollHeight+'px';
      const { default:html2canvas }=await import('html2canvas');const canvas=await html2canvas(element,{scale:2,backgroundColor:weddingThemes.find(t=>t.id===data.theme)!.paper,logging:false,windowWidth:700,windowHeight:element.scrollHeight});
      if(format==='png'){const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG failed')),'image/png'));offerFile(blob,'wedding-invitation.png')}
      else{
        const {jsPDF}=await import('jspdf');const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
        // Fit the complete invitation proportionally on one tall custom page when needed.
        const widthMm=160,heightMm=widthMm*canvas.height/canvas.width;
        const invitePdf=heightMm>277?new jsPDF({orientation:'portrait',unit:'mm',format:[180,heightMm+20],compress:true}):pdf;
        const pageWidth=invitePdf.internal.pageSize.getWidth();invitePdf.addImage(canvas.toDataURL('image/jpeg',.95),'JPEG',(pageWidth-widthMm)/2,10,widthMm,heightMm,undefined,'FAST');
        offerFile(invitePdf.output('blob'),'wedding-invitation.pdf');
      }
      announce('File तैयार है। नीचे Download तैयार file पर टैप करके save करें।');
    }catch{setError('Download नहीं बन पाया। Photo हटाकर दोबारा कोशिश करें या animated HTML download करें।')}
    finally{frame?.remove();setBusy('')}
  }
  async function publish(){
    const invalid=validateWedding(data);if(invalid){setError(invalid);return}if(!publishConsent){setError('Link बनाने के लिए नीचे publishing वाला checkbox चुनें।');return}setBusy('publish');setError('');
    try{
      const res=await fetch(`${API}/api/invitations${publication?'/'+publication.id:''}`,{method:publication?'PUT':'POST',headers:{'Content-Type':'application/json',...(publication?{Authorization:'Bearer '+publication.token}:{})},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
      const result=await res.json();if(!res.ok)throw Error(result.error||'Link नहीं बना। बाद में कोशिश करें।');
      const p:Publication={id:result.id,token:result.token||publication?.token||'',expiresAt:result.expiresAt,snapshot};setPublication(p);
      try{persist(p)}catch{setError('Link बन गया, लेकिन edit key browser में save नहीं हुई। अभी private backup download करें।')}
      announce('Invitation publish हो गया! Link नीचे से copy करें। Update सभी जगह दिखने में लगभग एक मिनट लग सकता है।');
    }catch(e){setError(e instanceof Error?e.message:'Publish नहीं हुआ। आपका draft और downloads अभी भी काम करते हैं।')}
    finally{setBusy('')}
  }
  async function unpublish(){if(!publication||!window.confirm('यह invitation link बंद कर दें? Guests इसे नहीं खोल पाएंगे। आपका local draft रहेगा।'))return;setBusy('unpublish');setError('');try{const res=await fetch(`${API}/api/invitations/${publication.id}`,{method:'DELETE',headers:{Authorization:'Bearer '+publication.token},signal:AbortSignal.timeout(15000)});const result=await res.json();if(!res.ok)throw Error(result.error);setPublication(null);try{persist(null)}catch{}announce('Link बंद किया गया। सभी जगह लागू होने में लगभग एक मिनट लग सकता है।')}catch(e){setError(e instanceof Error?e.message:'Link बंद नहीं हुआ। फिर कोशिश करें।')}finally{setBusy('')}}
  async function copy(){try{await navigator.clipboard.writeText(link);announce('Guest link copy हो गया।')}catch{setError('Link नीचे से select करके copy करें।')}}
  function reset(){if(!window.confirm('Editor और saved draft खाली करें? Published invitation बंद करने के लिए पहले Unpublish दबाएं और अपना private backup सुरक्षित रखें।'))return;photoJob.current++;setPhotoBusy(false);try{localStorage.removeItem(KEY)}catch{setError('Saved draft मिट नहीं पाया। Browser site settings check करें।');return}setData({...sampleWedding(),bride:'',groom:'',brideFamily:'',groomFamily:'',events:[blankEvent()],photo:''});setPublication(null);setPublishConsent(false);setError('');announce('Editor खाली हो गया।')}
  const disabled=!!busy||photoBusy;
  return <div className="wedding-maker">
    <div className="wm-intro"><div><span className="wm-kicker"><Heart size={13}/> A LITTLE CARD. A BIG BEAUTIFUL DAY.</span><h2>आपकी शादी, आपका अंदाज़।</h2><p>Design चुनें, अपनी details भरें और प्यार भरा invitation भेजें। सभी 6 designs free हैं।</p></div><span className="wm-free"><Check size={15}/> No payment · No RSVP</span></div>
    <div className="wm-layout"><div className="wm-editor">
      <section className="wm-panel" aria-labelledby="wm-design"><div className="wm-section-title"><span>01</span><h3 id="wm-design">अपना design चुनें</h3></div><div className="wm-themes">{weddingThemes.map(t=><button disabled={disabled} type="button" key={t.id} aria-pressed={data.theme===t.id} className={`wm-theme wm-theme-${t.id}${data.theme===t.id?' selected':''}`} onClick={()=>update({theme:t.id})}><span className="wm-theme-art" style={{background:t.paper,color:t.ink,borderColor:t.accent}}><span style={{color:t.accent}}>{t.symbol}</span><i>A & A</i><small>YOU ARE INVITED</small>{data.theme===t.id&&<b><Check size={13}/></b>}</span><strong>{t.name}</strong><small>{t.detail}</small></button>)}</div></section>
      <section className="wm-panel"><div className="wm-section-title"><span>02</span><h3>नाम और invitation</h3></div><div className="wm-fields"><label>Labels / भाषा<select value={data.language} onChange={e=>language(e.target.value as 'hi'|'en')} disabled={disabled}><option value="hi">हिंदी</option><option value="en">English</option></select></label><label>ऊपर की heading<input maxLength={90} value={data.title} onChange={e=>update({title:e.target.value})}/></label><label>दुल्हन का नाम *<input maxLength={80} value={data.bride} onChange={e=>update({bride:e.target.value})} placeholder="जैसे आलिया" required/></label><label>दूल्हे का नाम *<input maxLength={80} value={data.groom} onChange={e=>update({groom:e.target.value})} placeholder="जैसे अयान" required/></label><label>दुल्हन का परिवार<input maxLength={160} value={data.brideFamily} onChange={e=>update({brideFamily:e.target.value})}/></label><label>दूल्हे का परिवार<input maxLength={160} value={data.groomFamily} onChange={e=>update({groomFamily:e.target.value})}/></label><label className="wm-wide">Invitation message<textarea rows={4} maxLength={600} value={data.message} onChange={e=>update({message:e.target.value})}/></label><label className="wm-wide">आखिरी प्यार भरी लाइन<textarea rows={2} maxLength={180} value={data.closing} onChange={e=>update({closing:e.target.value})}/></label></div><p className="wm-hint">भाषा बदलने से labels और default message बदलते हैं। आपके लिखे नाम और details translate नहीं होते। शुरुआत में sample details हैं—अपनी details ज़रूर भरें।</p></section>
      <section className="wm-panel"><div className="wm-section-title"><span>03</span><h3>कार्यक्रम और venue</h3></div><label className="wm-label">कार्यक्रम का time zone<select value={data.offset} onChange={e=>update({offset:e.target.value})}><option value="+05:30">India — UTC +05:30</option><option value="+05:00">Pakistan — UTC +05:00</option><option value="+04:00">UAE — UTC +04:00</option><option value="+03:00">Saudi Arabia — UTC +03:00</option><option value="+00:00">UTC +00:00</option><option value="+01:00">UTC +01:00</option><option value="-04:00">UTC −04:00</option><option value="-05:00">UTC −05:00</option><option value="-07:00">UTC −07:00</option><option value="-08:00">UTC −08:00</option></select></label><p className="wm-hint">Countdown इसी UTC offset से चलेगा। बाहर की शादी के लिए उस तारीख का सही offset चुनें।</p><div className="wm-events">{data.events.map((ev,i)=><fieldset key={i} className="wm-event"><legend>कार्यक्रम {i+1}</legend><div className="wm-fields"><label>कार्यक्रम का नाम *<input value={ev.name} maxLength={60} placeholder="शादी / निकाह / Reception" onChange={e=>changeEvent(i,{name:e.target.value})}/></label><label>Venue *<input value={ev.venue} maxLength={140} onChange={e=>changeEvent(i,{venue:e.target.value})}/></label><label>तारीख *<input type="date" value={ev.date} onChange={e=>changeEvent(i,{date:e.target.value})}/></label><label>समय *<input type="time" value={ev.time} onChange={e=>changeEvent(i,{time:e.target.value})}/></label><label className="wm-wide">पूरा पता<input value={ev.address} maxLength={220} placeholder="जगह, शहर, राज्य" onChange={e=>changeEvent(i,{address:e.target.value})}/></label></div>{data.events.length>1&&<button type="button" className="wm-text-btn" disabled={disabled} onClick={()=>update({events:data.events.filter((_,index)=>index!==i)})}><Trash2 size={14}/> यह कार्यक्रम हटाएं</button>}</fieldset>)}</div><button type="button" className="wm-btn secondary" disabled={disabled||data.events.length>=6} onClick={()=>update({events:[...data.events,blankEvent()]})}><Plus size={16}/> कार्यक्रम जोड़ें ({data.events.length}/6)</button></section>
      <section className="wm-panel"><div className="wm-section-title"><span>04</span><h3>Photo और music</h3></div><div className="wm-photo-row">{data.photo&&<img src={data.photo} alt="Invitation photo"/>}<div><input className="wm-visually-hidden" ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void photo(e.target.files?.[0])}/><button className="wm-btn secondary" disabled={disabled} type="button" onClick={()=>photoInput.current?.click()}><Upload size={16}/>{photoBusy?'Photo तैयार हो रही है…':data.photo?'Photo बदलें':'Photo जोड़ें (optional)'}</button>{data.photo&&<button type="button" className="wm-text-btn" disabled={disabled} onClick={()=>{photoJob.current++;update({photo:''})}}>Photo हटाएं</button>}<p className="wm-hint">JPG / PNG / WebP · 10 MB तक। Photo छोटी करके जोड़ी जाती है।</p></div></div><label className="wm-check"><input type="checkbox" checked={data.music} onChange={e=>update({music:e.target.checked})}/><span>Guest के लिए हल्का instrumental music रखें<small>Music button दबाने पर बजेगा। Built-in tune है; song upload नहीं है।</small></span></label></section>
      <section className="wm-panel"><div className="wm-section-title"><span>05</span><h3>Save, download और share</h3></div><div className="wm-actions"><button type="button" className="wm-btn secondary" disabled={disabled} onClick={saveDraft}><Save size={16}/> Draft save</button><button type="button" className="wm-btn secondary" disabled={disabled} onClick={loadDraft}>Saved draft खोलें</button><button type="button" className="wm-btn secondary" disabled={disabled} onClick={backup}><Download size={16}/> Private backup</button><input className="wm-visually-hidden" ref={backupInput} type="file" accept=".json,application/json" onChange={e=>void importBackup(e.target.files?.[0])}/><button type="button" className="wm-btn secondary" disabled={disabled} onClick={()=>backupInput.current?.click()}>Backup import</button></div><p className="wm-hint">Draft इसी browser में रहता है। Private backup में edit key हो सकती है—इसे अपने पास रखें।</p><div className="wm-actions"><button className="wm-btn" disabled={disabled} onClick={()=>void exportFile('png')}><Download size={16}/>{busy==='png'?'बन रहा है…':'PNG card'}</button><button className="wm-btn" disabled={disabled} onClick={()=>void exportFile('pdf')}><Download size={16}/>{busy==='pdf'?'बन रहा है…':'PDF card'}</button><button className="wm-btn secondary" disabled={disabled} onClick={()=>void exportFile('html')}>Animated HTML</button></div>{readyDownload&&<div className="wm-download-ready" role="status"><Check size={18}/><div><strong>{readyDownload.filename} तैयार है</strong><p>Save करने के लिए नीचे टैप करें। Details बदलने पर नई file तैयार करें।</p><a className="wm-btn" href={readyDownload.url} download={readyDownload.filename}>Download तैयार file <Download size={16}/></a></div></div>}<p className="wm-hint">PNG/PDF में पूरा invitation आता है; animation और music share link या HTML में चलेंगे। PDF की page length content के अनुसार होगी।</p><div className="wm-publish"><label className="wm-check"><input type="checkbox" checked={publishConsent} onChange={e=>setPublishConsent(e.target.checked)}/><span>मैं इन details और photo को guest link के लिए publish करना चाहता/चाहती हूं।<small>Link रखने वाला कोई भी invitation देख सकेगा। अंतिम कार्यक्रम के 90 दिन बाद मिट जाएगा (अधिकतम 1 साल)।</small></span></label><button type="button" className="wm-btn" disabled={disabled} onClick={()=>void publish()}><Link2 size={16}/>{busy==='publish'?'Publish हो रहा है…':publication?'इसी link पर update publish करें':'Guest link बनाएं — Free'}</button>{publication&&<div className="wm-share-result"><p><Check size={15}/> {dirty?'बदलाव अभी publish नहीं हुए हैं।':'Invitation live है। Guests को login नहीं चाहिए।'}</p><label>Guest invitation link<input readOnly value={link} onFocus={e=>e.target.select()}/></label><div className="wm-actions"><button className="wm-btn secondary" type="button" disabled={!!busy} onClick={()=>void copy()}><Copy size={15}/> Copy link</button><a className="wm-btn secondary" href={link} target="_blank" rel="noopener noreferrer">Guest view <ArrowUpRight size={15}/></a><a className="wm-btn secondary" href={`https://wa.me/?text=${encodeURIComponent(data.bride+' & '+data.groom+' — '+data.title+'\n'+link)}`} target="_blank" rel="noopener noreferrer">WhatsApp पर भेजें ↗</a></div><p className="wm-hint">Link valid until: {new Date(publication.expiresAt).toLocaleDateString('en-IN')} · Update दिखने में लगभग एक मिनट लग सकता है।</p><button className="wm-text-btn" type="button" disabled={disabled} onClick={()=>void unpublish()}>Unpublish / guest link बंद करें</button></div>}</div><button type="button" className="wm-text-btn" disabled={disabled} onClick={reset}>नया invitation / saved draft साफ करें</button></section>
    </div><aside className="wm-preview-panel"><div className="wm-preview-heading"><div><span className="wm-kicker">YOUR INVITATION</span><h3>प्यार से, आपकी ओर से।</h3></div><span className="wm-live">● LIVE</span></div><div className="wm-phone"><iframe ref={iframe} title="Live wedding invitation preview" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" srcDoc={previewHtml}/></div><button ref={previewTrigger} type="button" className="wm-btn wm-preview-button" onClick={()=>setPreview(true)}><Eye size={17}/> पूरा animated preview देखें</button><p className="wm-hint">Preview में scroll करें। पूरा preview खोलकर opening animation भी देखें।</p><div className="wm-note"><Sparkles size={17}/><p>सिर्फ रंग नहीं—हर design का layout, border और opening style भी अलग है।</p></div></aside></div>
    {error&&<div className="wm-alert" role="alert">{error}</div>}<p className="wm-notice" role="status">{busy?'काम हो रहा है…':notice}</p>
    <dialog ref={dialog} className="wm-dialog" onCancel={()=>setPreview(false)} onClose={()=>{setPreview(false);previewTrigger.current?.focus()}}><div className="wm-dialog-bar"><strong>Guest preview · {weddingThemes.find(t=>t.id===data.theme)?.name}</strong><button type="button" aria-label="Preview बंद करें" onClick={()=>setPreview(false)}><X size={22}/></button></div>{preview&&<iframe title="Full animated invitation" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" srcDoc={guestHtml}/>}</dialog>
  </div>;
}
