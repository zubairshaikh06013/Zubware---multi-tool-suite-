import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, Download, Save } from 'lucide-react';
import { calculatePartnership, type PartnershipPlan } from '../../../lib/partnership';
import { agreementContext, agreementFinancialClauses, agreementIssues, emptyAgreementDetails, type AgreementDetails } from '../../../lib/partnershipAgreement';
import { PartnerSignaturePad } from './PartnerSignaturePad';
import './partnershipAgreement.css';
import documentStyles from './partnershipAgreement.css?raw';

export function PartnershipAgreementBuilder({ plan, currency, hindi, onRestore, onShowToast }: { plan: PartnershipPlan; currency: string; hindi: boolean; onRestore: (plan: PartnershipPlan, currency: string, hindi: boolean) => void; onShowToast: (message: string) => void }) {
  const [details, setDetails] = useState<AgreementDetails>(emptyAgreementDetails);
  const [signed, setSigned] = useState<{ context: string; images: Record<string, string> }>({ context: '', images: {} });
  const [signatureReset, setSignatureReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [restoreRevision, setRestoreRevision] = useState(0);
  const docRef = useRef<HTMLDivElement>(null);
  const context = useMemo(() => agreementContext(plan, details, currency, hindi), [plan, details, currency, hindi]);
  const contextRef = useRef(context);
  contextRef.current = context;
  const images = signed.context === context ? signed.images : {};
  useEffect(() => {
    if (signed.context !== context) {
      if (Object.values(signed.images).some(Boolean)) setSignatureReset(true);
      setSigned({ context, images: {} });
    }
    setStatus('');
  }, [context]);
  const tr = (en: string, hi: string) => hindi ? hi : en;
  const money = (n: number) => new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency }).format(n);
  const result = calculatePartnership(plan);
  const issues = agreementIssues(plan, details);
  const clauses = agreementFinancialClauses(plan, currency, hindi);
  const set = (patch: Partial<AgreementDetails>) => setDetails(d => ({ ...d, ...patch }));
  const field = (key: keyof AgreementDetails, label: string, options: { type?: string; long?: boolean; max?: number; required?: boolean } = {}) => <label className="pp-field"><span>{label}{options.required !== false ? ' *' : ''}</span>{options.long ? <textarea maxLength={options.max || 500} value={String(details[key])} onChange={e => set({ [key]: e.target.value })}/> : <input key={`${key}-${restoreRevision}`} type={options.type || 'text'} maxLength={options.max || 160} {...(options.type === 'date' ? { defaultValue: String(details[key]) } : { value: String(details[key]) })} onChange={e => set({ [key]: e.target.value })}/>} {options.type === 'date' && <button type="button" onClick={() => { const now = new Date(); const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; set({ [key]: date }); setRestoreRevision(r => r + 1); }}>{tr('Use today', 'आज की तारीख')}</button>}</label>;
  const addSignature = (id: string, value: string) => { if (contextRef.current !== context) return; setSigned(previous => ({ context, images: { ...(previous.context === context ? previous.images : {}), [id]: value } })); setSignatureReset(false); };
  const activeSigners = [...plan.partners.map(p => ({ id: p.id, name: p.name })), ...details.witnesses.flatMap((w, i) => w.name.trim() ? [{ id: `witness-${i}`, name: `${tr('Witness', 'गवाह')} ${i + 1}: ${w.name}` }] : [])];
  const signatureCount = activeSigners.filter(s => images[s.id]).length;
  const issueLabels: Record<string, string> = { calculation: tr('Fix calculator inputs above.', 'ऊपर कैलकुलेटर के इनपुट सही करें।'), details: tr('Complete the required business details, dates and operating terms.', 'बिजनेस, तारीख और कामकाज के जरूरी नियम भरें।'), dates: tr('Enter valid agreement and start dates.', 'समझौते और शुरुआत की सही तारीख भरें।'), notice: tr('Notice period must be 1–3650 whole days.', 'नोटिस अवधि 1–3650 पूरे दिन रखें।'), parties: tr('Enter every partner’s full legal name and address.', 'हर पार्टनर का पूरा कानूनी नाम और पता भरें।'), witnesses: tr('For each optional witness, complete both name and address or leave both blank.', 'गवाह के लिए नाम और पता दोनों भरें या दोनों खाली रखें।') };
  const save = () => {
    try { localStorage.setItem('zubware-partnership-agreement-v1', JSON.stringify({ version: 1, plan, details, currency, hindi })); onShowToast(tr('Agreement draft saved on this device. Signature images are not saved.', 'समझौते का ड्राफ्ट इस डिवाइस पर सेव हुआ। साइन इमेज सेव नहीं की गईं।')); }
    catch { onShowToast(tr('Could not save. Device storage may be full.', 'ड्राफ्ट सेव नहीं हुआ। डिवाइस स्टोरेज भर सकता है।')); }
  };
  const load = () => {
    try {
      const raw = localStorage.getItem('zubware-partnership-agreement-v1'); if (!raw) throw Error();
      const saved = JSON.parse(raw);
      if (saved.version !== 1 || calculatePartnership(saved.plan).errors.length || !['INR', 'USD', 'EUR', 'GBP', 'AED'].includes(saved.currency)) throw Error();
      const d = saved.details;
      for (const [key, value] of Object.entries(emptyAgreementDetails())) if (typeof value === 'string' && (typeof d[key] !== 'string' || d[key].length > 2000)) throw Error();
      if (!Number.isInteger(d.noticeDays) || !Array.isArray(d.witnesses) || d.witnesses.length !== 2 || !d.witnesses.every(w => typeof w.name === 'string' && typeof w.address === 'string') || !d.parties || typeof d.parties !== 'object' || typeof d.includeIllustration !== 'boolean') throw Error();
      if (Object.values(d.parties).some((p: any) => typeof p.address !== 'string' || typeof p.duties !== 'string')) throw Error();
      setSigned({ context: '', images: {} }); setSignatureReset(false); setDetails(d); setRestoreRevision(r => r + 1); onRestore(saved.plan, saved.currency, Boolean(saved.hindi));
      onShowToast(tr('Agreement and calculation restored. Add signatures again.', 'समझौता और हिसाब खुल गया। साइन फिर से जोड़ें।'));
    } catch { onShowToast(tr('No valid agreement draft found.', 'कोई सही समझौता ड्राफ्ट नहीं मिला।')); }
  };
  const exportPdf = async () => {
    if (issues.length || !docRef.current) return;
    setBusy(true); setStatus('');
    let frame: HTMLIFrameElement | undefined;
    // Capture one exact version; edits while rendering cannot mix terms and signatures.
    const markup = docRef.current.outerHTML;
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      frame = document.createElement('iframe'); frame.title = 'Agreement PDF export'; frame.setAttribute('aria-hidden', 'true');
      Object.assign(frame.style, { position: 'fixed', left: '-14000px', top: '0', width: '794px', height: '1123px', border: '0' });
      const ready = new Promise<void>((resolve, reject) => { frame!.onload = () => resolve(); frame!.onerror = () => reject(Error('Export frame failed')); });
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>${documentStyles}body{margin:0;background:#fff}.pa-document{width:794px;max-width:none;margin:0;border:0;padding:0}</style></head><body>${markup}</body></html>`;
      document.body.appendChild(frame); await ready;
      const d = frame.contentDocument!; await d.fonts.ready;
      await Promise.all(Array.from(d.images).map(img => img.decode()));
      const root = d.querySelector('.pa-document')!;
      const blocks = Array.from(root.children);
      root.replaceChildren();
      const pages: HTMLElement[] = [];
      const newPage = () => {
        const page = d.createElement('div'); page.className = 'pa-page';
        const content = d.createElement('div'); content.className = 'pa-page-content'; page.appendChild(content);
        const footer = d.createElement('div'); footer.className = 'pa-page-footer'; page.appendChild(footer); root.appendChild(page); pages.push(page);
        return content;
      };
      let content = newPage();
      for (const block of blocks) {
        content.appendChild(block);
        if (content.scrollHeight > content.clientHeight + 1) {
          content.removeChild(block); content = newPage(); content.appendChild(block);
          if (content.scrollHeight > content.clientHeight + 1) throw Error('A section is too long. Shorten notes or addresses.');
        }
      }
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
      for (let i = 0; i < pages.length; i++) {
        pages[i].querySelector('.pa-page-footer')!.textContent = `ZUBWARE • ${tr('DRAFT FOR REVIEW', 'समीक्षा के लिए ड्राफ्ट')} • ${i + 1} / ${pages.length}`;
        const canvas = await html2canvas(pages[i], { scale: 1.7, backgroundColor: '#ffffff', logging: false });
        if (i) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, 210, 297);
      }
      const url = URL.createObjectURL(pdf.output('blob'));
      const a = document.createElement('a'); a.href = url; a.download = 'zubware-partnership-agreement-draft.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
      setStatus(tr('Agreement PDF ready. Open the download to print or share.', 'समझौते की PDF तैयार है। डाउनलोड खोलकर प्रिंट या शेयर करें।'));
    } catch (error) { console.error('Agreement PDF export failed', error); setStatus(tr('PDF could not be created. Try again; shorten long notes if needed.', 'PDF नहीं बन पाई। फिर कोशिश करें; जरूरत हो तो लंबे नोट छोटे करें।')); }
    finally { frame?.remove(); setBusy(false); }
  };
  const displayDate = (v: string) => v || '________________';
  const blank = (v?: string) => v?.trim() || '________________';
  const signatureBox = (id: string, label: string, address?: string) => <div className="pa-sign-box" key={id}><h4>{label}</h4>{images[id] ? <img src={images[id]} alt={`${label} ${tr('signature image', 'साइन इमेज')}`}/> : <div className="pa-blank-sign">{tr('Signature', 'हस्ताक्षर')}: ____________________</div>}<p>{tr('Address', 'पता')}: {blank(address)}</p><p>{tr('Signed on', 'हस्ताक्षर की तारीख')}: ____________________</p></div>;
  return <details className="pp-panel pa-builder"><summary><FileText size={20}/><span>{tr('Create partnership agreement', 'पार्टनरशिप समझौता बनाएं')}</span><small>{tr('Auto-fill from this calculation →', 'इसी हिसाब से अपने आप भरें →')}</small></summary><div className="pa-form">
    <p className="pa-intro">{tr('Turn the calculation into a reviewable agreement draft. Fill business details, review the imported rules and attach each partner’s signature, or leave signature lines blank for paper signing.', 'इसी हिसाब से समझौते का ड्राफ्ट बनाएं। बिजनेस की जानकारी भरें, आए हुए नियम जांचें और हर पार्टनर का साइन जोड़ें या कागज पर साइन करने के लिए जगह खाली रखें।')}</p>
    <p className="pa-legal-note">{tr('This is a draft template, not legal advice. Local stamp duty, registration and execution requirements need review before signing. Drawn/uploaded images are not certificate-based digital signatures or Aadhaar eSign; signer identity is not verified.', 'यह ड्राफ्ट टेम्पलेट है, कानूनी सलाह नहीं। साइन से पहले स्थानीय स्टाम्प ड्यूटी, रजिस्ट्रेशन और जरूरी प्रक्रिया जांचें। Draw/upload साइन इमेज हैं, प्रमाणपत्र वाला डिजिटल साइन या Aadhaar eSign नहीं; व्यक्ति की पहचान सत्यापित नहीं होती।')}</p>
    <div className="pp-toolbar"><button type="button" onClick={save}><Save size={15}/>{tr('Save agreement draft', 'समझौता ड्राफ्ट सेव करें')}</button><button type="button" onClick={load}>{tr('Load agreement draft', 'समझौता ड्राफ्ट खोलें')}</button><button type="button" onClick={() => { try { localStorage.removeItem('zubware-partnership-agreement-v1'); onShowToast(tr('Saved agreement draft deleted.', 'सेव समझौता ड्राफ्ट मिट गया।')); } catch { onShowToast(tr('Storage unavailable.', 'स्टोरेज उपलब्ध नहीं है।')); } }}>{tr('Delete saved agreement', 'सेव समझौता मिटाएं')}</button></div><p className="pp-help">{tr('Drafts stay on this device. Signature images stay in memory only and are never saved with a draft. Changing the calculation, language or any agreement term clears all attached signatures.', 'ड्राफ्ट इसी डिवाइस पर रहता है। साइन इमेज सिर्फ मौजूदा सत्र में रहेंगी; ड्राफ्ट के साथ सेव नहीं होंगी। हिसाब, भाषा या समझौते का कोई नियम बदलने पर सभी जुड़े साइन हटेंगे।')}</p>
    <h4>{tr('1. Business & dates', '1. बिजनेस और तारीखें')}</h4><div className="pp-grid">{field('business', tr('Firm / business name', 'फर्म / बिजनेस का नाम'))}{field('activity', tr('Business activity', 'बिजनेस का काम'))}{field('address', tr('Principal business address', 'बिजनेस का मुख्य पता'), { long: true })}{field('place', tr('Place of agreement', 'समझौते की जगह'))}{field('country', tr('Country', 'देश'))}{field('state', tr('State / region', 'राज्य / क्षेत्र'))}{field('date', tr('Agreement date', 'समझौते की तारीख'), { type: 'date' })}{field('startDate', tr('Business start / effective date', 'बिजनेस शुरू / लागू होने की तारीख'), { type: 'date' })}{field('duration', tr('Term / duration (e.g. until ended in writing)', 'समय अवधि (जैसे लिखित रूप से समाप्त होने तक)'))}{field('distribution', tr('Distribution frequency & approval process', 'भुगतान की अवधि और मंजूरी का तरीका'))}</div>
    <h4>{tr('2. Partner details', '2. पार्टनर की जानकारी')}</h4><p className="pp-help">{tr('Names, capital and payment rules come from the calculator. Enter full legal names in the partner cards above. Addresses below are not uploaded.', 'नाम, निवेश और भुगतान के नियम ऊपर के कैलकुलेटर से आए हैं। ऊपर पार्टनर कार्ड में पूरा कानूनी नाम भरें। नीचे के पते अपलोड नहीं होते।')}</p><div className="pa-party-fields">{plan.partners.map((p, i) => <article key={p.id}><strong>{i + 1}. {blank(p.name)}</strong><span>{money(p.capital)} · {p.working ? tr('Working partner', 'काम करने वाला पार्टनर') : tr('Investor partner', 'निवेश करने वाला पार्टनर')}</span><label className="pp-field"><span>{tr('Full address', 'पूरा पता')} *</span><textarea aria-label={`${p.name || i + 1} ${tr('full address', 'पूरा पता')}`} maxLength={500} value={details.parties[p.id]?.address || ''} onChange={e => set({ parties: { ...details.parties, [p.id]: { duties: '', ...details.parties[p.id], address: e.target.value } } })}/></label><label className="pp-field"><span>{tr('Responsibilities (optional)', 'जिम्मेदारियां (वैकल्पिक)')}</span><textarea maxLength={500} value={details.parties[p.id]?.duties || ''} onChange={e => set({ parties: { ...details.parties, [p.id]: { address: '', ...details.parties[p.id], duties: e.target.value } } })}/></label></article>)}</div>
    <h4>{tr('3. Operating terms', '3. कामकाज के नियम')}</h4><div className="pp-grid">{field('management', tr('Decision-making / management rights', 'फैसले लेने / प्रबंधन के अधिकार'), { long: true })}{field('banking', tr('Bank operation & spending approvals', 'बैंक संचालन और खर्च की मंजूरी'), { long: true })}<label className="pp-field"><span>{tr('Exit notice period (days)', 'अलग होने का नोटिस (दिन)')} *</span><input type="number" min={1} max={3650} step={1} value={Number.isNaN(details.noticeDays) ? '' : details.noticeDays} onChange={e => set({ noticeDays: e.target.value === '' ? NaN : Number(e.target.value) })}/></label>{field('disputes', tr('Dispute process & proposed jurisdiction', 'विवाद सुलझाने का तरीका और प्रस्तावित क्षेत्राधिकार'), { long: true })}{field('additional', tr('Additional agreed terms (optional)', 'अतिरिक्त तय नियम (वैकल्पिक)'), { long: true, max: 2000, required: false })}</div>
    <h4>{tr('4. Witnesses (optional)', '4. गवाह (वैकल्पिक)')}</h4><div className="pp-grid">{details.witnesses.map((w, i) => <div key={i}><label className="pp-field"><span>{tr(`Witness ${i + 1} full name`, `गवाह ${i + 1} का पूरा नाम`)}</span><input maxLength={160} value={w.name} onChange={e => set({ witnesses: details.witnesses.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })}/></label><label className="pp-field"><span>{tr('Witness address', 'गवाह का पता')}</span><textarea maxLength={500} value={w.address} onChange={e => set({ witnesses: details.witnesses.map((x, j) => j === i ? { ...x, address: e.target.value } : x) })}/></label></div>)}</div>
    <label className="pp-check"><input type="checkbox" checked={details.includeIllustration} onChange={e => set({ includeIllustration: e.target.checked })}/>{tr('Attach the current profit calculation as an illustration', 'मौजूदा मुनाफे का हिसाब उदाहरण के रूप में जोड़ें')}</label>
    {issues.length > 0 && <div className="pa-checklist" role="status"><strong>{tr('Complete before exporting or adding signatures:', 'PDF या साइन जोड़ने से पहले पूरा करें:')}</strong>{issues.map(issue => <p key={issue}>{issueLabels[issue]}</p>)}</div>}
    <h4>{tr('5. Partner signatures', '5. पार्टनरों के हस्ताक्षर')}</h4>{signatureReset && <p className="pp-warning" role="status">{tr('The draft changed. Previous signature images were cleared; each signer must review and add their signature again.', 'ड्राफ्ट बदला है। पुराने साइन हटा दिए गए; हर व्यक्ति दोबारा जांचकर अपना साइन जोड़े।')}</p>}{!issues.length ? <><p className="pp-help">{tr(`${signatureCount} of ${activeSigners.length} signature images attached. Unsigned slots remain blank in the PDF.`, `${activeSigners.length} में से ${signatureCount} साइन इमेज जुड़ी हैं। बाकी जगह PDF में खाली रहेगी।`)}</p><div className="pa-pads">{activeSigners.map(s => <PartnerSignaturePad key={s.id} name={s.name} value={images[s.id]} onChange={value => addSignature(s.id, value)} hindi={hindi}/>)}</div></> : <p className="pp-help">{tr('Signature pads appear after the required details are complete.', 'जरूरी जानकारी पूरी होने पर साइन करने की जगह खुलेगी।')}</p>}
    <div className="pp-toolbar"><button type="button" className="pp-primary" disabled={busy || issues.length > 0} onClick={exportPdf}><Download size={16}/>{busy ? tr('Preparing agreement…', 'समझौता बन रहा है…') : tr('Download agreement PDF / Print', 'समझौता PDF डाउनलोड / प्रिंट')}</button></div>{status && <p role="status">{status}</p>}
    <h4>{tr('Live agreement preview', 'समझौते का लाइव प्रीव्यू')}</h4><div className="pa-preview-scroll"><div className="pa-document" ref={docRef}>
      <header className="pa-doc-heading"><span>ZUBWARE · {tr('DRAFT FOR REVIEW', 'समीक्षा के लिए ड्राफ्ट')}</span><h2>{tr('Partnership Agreement', 'पार्टनरशिप समझौता')}</h2><p>{tr('Firm', 'फर्म')}: {blank(details.business)}<br/>{tr('Date / place', 'तारीख / जगह')}: {displayDate(details.date)} / {blank(details.place)}</p><p className="pa-doc-note">{tr('Review draft only. Complete local legal, stamp-duty, registration and execution formalities before use. Signature images do not verify identity or certify execution.', 'समीक्षा के लिए ड्राफ्ट। इस्तेमाल से पहले स्थानीय कानूनी, स्टाम्प ड्यूटी, रजिस्ट्रेशन और साइन की जरूरी प्रक्रिया पूरी करें। साइन इमेज पहचान या समझौता पूरा होने की पुष्टि नहीं करती।')}</p></header>
      <section className="pa-doc-block"><h3>{tr('1. Business and commencement', '1. बिजनेस और शुरुआत')}</h3><p>{tr('Business name and activity', 'बिजनेस का नाम और काम')}: {blank(details.business)} — {blank(details.activity)}</p><p>{tr('Principal address', 'मुख्य पता')}: {blank(details.address)}</p><p>{tr('Country / State', 'देश / राज्य')}: {blank(details.country)} / {blank(details.state)}</p><p>{tr('Effective date and duration', 'लागू होने की तारीख और अवधि')}: {displayDate(details.startDate)} — {blank(details.duration)}</p></section>
      <section className="pa-doc-block"><h3>{tr('2. Parties to this draft', '2. इस ड्राफ्ट के पार्टनर')}</h3><p>{tr('The following persons propose to conduct the stated business under the terms below, subject to their review, consent and applicable law.', 'नीचे के व्यक्ति इन नियमों पर, अपनी समीक्षा, सहमति और लागू कानून के अनुसार, बताया गया बिजनेस करने का प्रस्ताव रखते हैं।')}</p></section>
      {plan.partners.map((p, i) => <section className="pa-doc-block pa-party-doc" key={p.id}><h4>{i + 1}. {blank(p.name)}</h4><p>{tr('Address', 'पता')}: {blank(details.parties[p.id]?.address)}</p><p>{tr('Role', 'भूमिका')}: {p.working ? tr('Working partner', 'काम करने वाला पार्टनर') : tr('Investor partner', 'निवेश करने वाला पार्टनर')} · {tr('Capital', 'निवेश')}: {money(p.capital)} · {tr('Scheduled months invested', 'हिसाब में निवेश के महीने')}: {p.months}</p>{details.parties[p.id]?.duties && <p>{tr('Responsibilities', 'जिम्मेदारियां')}: {details.parties[p.id].duties}</p>}</section>)}
      <section className="pa-doc-block"><h3>{tr('3. Initial financial schedule', '3. शुरुआती वित्तीय अनुसूची')}</h3><p>{tr('Changes to contributions, time periods or allocation rules must be agreed and documented; recalculate and regenerate the draft after any change.', 'निवेश, अवधि या बंटवारे में बदलाव सहमति से लिखित रूप में दर्ज करें; बदलाव के बाद हिसाब और ड्राफ्ट दोबारा बनाएं।')}</p></section>
      {clauses.map((clause, i) => <section className="pa-doc-block" key={i}><h4>{clause.title}</h4><p>{clause.text}</p></section>)}
      {plan.method === 'slabs' && <section className="pa-doc-block"><h4>{tr('Agreed whole-pool profit slabs', 'पूरी बची रकम के लिए तय स्लैब')}</h4>{plan.slabs.map((s, i) => <p key={i}>{tr('Input profit from', 'भरा मुनाफा यहां से')} {money(s.from)}{plan.slabs[i + 1] ? ` ${tr('to below', 'से नीचे तक')} ${money(plan.slabs[i + 1].from)}` : ` ${tr('and above', 'और ऊपर')}`}: {plan.partners.map((p, j) => `${p.name}: ${s.weights[j]}`).join(' / ')}</p>)}</section>}
      <section className="pa-doc-block"><h3>{tr('4. Management and accounts', '4. प्रबंधन और खाते')}</h3><p>{tr('Management / decision rights', 'प्रबंधन / फैसला लेने के अधिकार')}: {blank(details.management)}</p><p>{tr('Banking / spending approvals', 'बैंक / खर्च की मंजूरी')}: {blank(details.banking)}</p><p>{tr('Distribution frequency and approvals', 'भुगतान की अवधि और मंजूरी')}: {blank(details.distribution)}</p><p>{tr('Maintain accurate business records and give partners reasonable access to accounts and supporting records. Capital return, drawings and borrowing require a recorded agreement; they are not automatically treated as profit.', 'बिजनेस के सही रिकॉर्ड रखें और पार्टनरों को खाते और संबंधित रिकॉर्ड देखने की उचित सुविधा दें। पूंजी वापसी, निकासी और उधार के लिए लिखित सहमति रखें; ये अपने आप मुनाफा नहीं बनते।')}</p></section>
      <section className="pa-doc-block"><h3>{tr('5. Changes, exit and settlement', '5. बदलाव, अलग होना और हिसाब निपटाना')}</h3><p>{tr(`A partner proposing to leave should give ${details.noticeDays} days’ written notice, subject to applicable law and the final agreement. On exit or closure, prepare accounts, identify debts and obligations and agree the settlement of capital and outstanding balances. This draft does not automatically release any partner from liabilities. New partners or changes to these terms require recorded consent of all partners.`, `अलग होने का प्रस्ताव देने वाला पार्टनर ${details.noticeDays} दिन पहले लिखित नोटिस दे, लागू कानून और अंतिम समझौते के अधीन। अलग होने या बंद होने पर खाते, कर्ज और देनदारियां जांचकर पूंजी और बाकी रकम का निपटारा तय करें। इस ड्राफ्ट से कोई पार्टनर अपने आप देनदारी से मुक्त नहीं होता। नए पार्टनर या इन नियमों में बदलाव सभी की लिखित सहमति से हों।`)}</p></section>
      <section className="pa-doc-block"><h3>{tr('6. Disputes and additional terms', '6. विवाद और अतिरिक्त नियम')}</h3><p>{tr('Proposed dispute process / jurisdiction', 'प्रस्तावित विवाद प्रक्रिया / क्षेत्राधिकार')}: {blank(details.disputes)}</p><p>{tr('Any selected forum or process remains subject to applicable law and professional review.', 'चुनी गई प्रक्रिया या क्षेत्राधिकार लागू कानून और पेशेवर समीक्षा के अधीन है।')}</p></section>
      {details.additional && <section className="pa-doc-block"><h4>{tr('Additional terms supplied by partners', 'पार्टनरों के दिए अतिरिक्त नियम')}</h4><p>{details.additional}</p></section>}
      {details.includeIllustration && !result.errors.length && <section className="pa-doc-block"><h3>{tr('Appendix — current calculation illustration', 'परिशिष्ट — मौजूदा हिसाब का उदाहरण')}</h3><p>{tr(`Input profit/loss: ${money(plan.profit)} for ${plan.months} month(s). The following amounts illustrate the chosen rules; they are not guaranteed future payouts.`, `${plan.months} महीने का भरा मुनाफा/घाटा: ${money(plan.profit)}। नीचे की रकम चुने नियमों का उदाहरण है, भविष्य के भुगतान की गारंटी नहीं।`)}</p><table className="pa-table"><thead><tr>{[tr('Partner', 'पार्टनर'), tr('Salary', 'वेतन'), tr('Interest', 'ब्याज'), tr('Bonus', 'बोनस'), tr('Residual share', 'बचा हिस्सा'), tr('Total', 'कुल')].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{result.rows.map(p => <tr key={p.id}><td>{p.name}</td><td>{money(p.salaryAmount)}</td><td>{money(p.interestAmount)}</td><td>{money(p.bonusAmount)}</td><td>{money(p.residual)}</td><td>{money(p.total)}</td></tr>)}</tbody></table><p>{tr('Business reserve', 'बिजनेस रिजर्व')}: {money(result.reserveAmount)} · {tr('Allocations + reserve', 'आवंटन + रिजर्व')}: {money(result.allocated + result.reserveAmount)}</p></section>}
      <section className="pa-doc-block"><h3>{tr('Signatures and review', 'हस्ताक्षर और समीक्षा')}</h3><p>{tr('Each partner should review all pages and the financial schedule before signing. The spaces below allow handwritten signatures after printing or attached signature images. Attached images are visual representations only; Zubware does not authenticate the signer or provide a digital-signature certificate.', 'हर पार्टनर साइन करने से पहले सभी पेज और वित्तीय अनुसूची जांचे। नीचे कागज पर साइन करने की जगह या जुड़ी साइन इमेज हैं। जुड़ी इमेज केवल दिखने वाला साइन है; Zubware व्यक्ति की पहचान या डिजिटल साइन प्रमाणपत्र नहीं देता।')}</p></section>
      {Array.from({ length: Math.ceil(plan.partners.length / 2) }, (_, i) => <section className="pa-sign-row pa-doc-block" key={i}>{plan.partners.slice(i * 2, i * 2 + 2).map(p => signatureBox(p.id, p.name, details.parties[p.id]?.address))}</section>)}
      <section className="pa-sign-row pa-doc-block">{details.witnesses.map((w, i) => signatureBox(`witness-${i}`, `${tr('Witness', 'गवाह')} ${i + 1}: ${blank(w.name)}`, w.address))}</section>
    </div></div>
    <p className="pp-help">{tr('References:', 'संदर्भ:')} <a href="https://www.indiacode.nic.in/bitstream/123456789/19863/1/indian_partnership_act_1932.pdf" target="_blank" rel="noopener noreferrer">{tr('Indian Partnership Act', 'भारतीय साझेदारी अधिनियम')}</a> · <a href="https://cca.gov.in/eSign.html" target="_blank" rel="noopener noreferrer">{tr('CCA: verified eSign', 'CCA: सत्यापित eSign')}</a></p>
  </div></details>;
}
