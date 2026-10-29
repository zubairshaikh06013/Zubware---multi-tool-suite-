export const biodataFields = [
  ['name', 'पूरा नाम', 'Full name'], ['dob', 'जन्म तारीख', 'Date of birth'],
  ['height', 'कद', 'Height'], ['city', 'शहर', 'City'], ['education', 'पढ़ाई', 'Education'],
  ['occupation', 'काम / नौकरी', 'Occupation'], ['income', 'आय (optional)', 'Income'],
  ['religion', 'धर्म (optional)', 'Religion'], ['community', 'समुदाय (optional)', 'Community'],
  ['father', 'पिता का नाम / काम', 'Father'], ['mother', 'माँ का नाम / काम', 'Mother'],
  ['siblings', 'भाई-बहन', 'Siblings'], ['about', 'अपने बारे में', 'About me'],
  ['partner', 'जीवनसाथी से उम्मीदें', 'Partner preferences'], ['contact', 'संपर्क की जानकारी', 'Contact'],
] as const;
export type BiodataKey = typeof biodataFields[number][0];
export type BiodataData = Record<BiodataKey, string>;
export const emptyBiodata = Object.fromEntries(biodataFields.map(([id]) => [id, ''])) as BiodataData;
export const biodataThemes = [
  { name: 'Classic Gold', ink: '#806126', paper: '#fffdf6', style: 'classic' },
  { name: 'Rose', ink: '#963f60', paper: '#fff9fc', style: 'floral' },
  { name: 'Royal Blue', ink: '#234c83', paper: '#f8fbff', style: 'royal' },
  { name: 'Emerald', ink: '#21644e', paper: '#f8fffb', style: 'arch' },
  { name: 'Minimal', ink: '#334155', paper: '#ffffff', style: 'minimal' },
  { name: 'Terracotta', ink: '#9d4b32', paper: '#fffaf5', style: 'floral' },
];
export type BiodataOptions = { language: 'hi' | 'en'; theme: number; heading: string; photo: string; data: BiodataData };
const W = 794, H = 1123, SCALE = 2;

export function wrapBiodataText(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue;
      if (ctx.measureText(line ? `${line} ${word}` : word).width <= width) { line += `${line ? ' ' : ''}${word}`; continue; }
      if (line) { lines.push(line); line = ''; }
      // Split long URLs/words so contact details never run outside the page.
      for (const char of Array.from(word)) {
        if (line && ctx.measureText(line + char).width > width) { lines.push(line); line = char; }
        else line += char;
      }
    }
    lines.push(line);
  }
  return lines.length ? lines : [''];
}

export async function renderBiodata(options: BiodataOptions): Promise<HTMLCanvasElement[]> {
  await Promise.all([
    document.fonts.load('400 16px "Biodata Devanagari"'),
    document.fonts.load('600 16px "Biodata Devanagari"'),
  ]);
  await document.fonts.ready;
  const theme = biodataThemes[options.theme] || biodataThemes[0];
  let photo: HTMLImageElement | null = null;
  if (options.photo) {
    photo = new Image(); photo.src = options.photo; await photo.decode();
  }
  const pages: HTMLCanvasElement[] = [];
  let ctx: CanvasRenderingContext2D, y = 0;
  const font = (size: number, bold = false) => { ctx.font = `${bold ? '600' : '400'} ${size}px "Biodata Devanagari", Arial, sans-serif`; };
  const newPage = () => {
    const canvas = document.createElement('canvas'); canvas.width = W * SCALE; canvas.height = H * SCALE;
    ctx = canvas.getContext('2d')!; ctx.scale(SCALE, SCALE); pages.push(canvas);
    ctx.fillStyle = theme.paper; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.5; ctx.strokeRect(28, 28, W - 56, H - 56);
    if (theme.style !== 'minimal') { ctx.lineWidth = 0.5; ctx.strokeRect(34, 34, W - 68, H - 68); }
    if (theme.style === 'floral') {
      for (const x of [48, W - 48]) for (const yy of [48, H - 48]) {
        ctx.fillStyle = theme.ink;
        for (let a = 0; a < 6; a++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(a * Math.PI / 3) * 8, yy + Math.sin(a * Math.PI / 3) * 8, 6, 3, a * Math.PI / 3, 0, Math.PI * 2); ctx.fill(); }
      }
    }
    if (theme.style === 'royal') { ctx.fillStyle = theme.ink; ctx.fillRect(35, 35, W - 70, 10); }
    if (theme.style === 'arch') { ctx.beginPath(); ctx.moveTo(260, 74); ctx.quadraticCurveTo(W / 2, 6, 534, 74); ctx.stroke(); }
    ctx.fillStyle = theme.ink; font(21, true); ctx.textAlign = 'center';
    ctx.fillText(options.heading || (options.language === 'hi' ? 'शादी का बायोडाटा' : 'Marriage Biodata'), W / 2, 94, W - 120);
    ctx.textAlign = 'left'; y = 135;
  };
  newPage();
  if (photo) {
    const pw = 112, ph = 140, x = (W - pw) / 2;
    const ratio = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight);
    const sw = pw / ratio, sh = ph / ratio;
    ctx.drawImage(photo, (photo.naturalWidth - sw) / 2, (photo.naturalHeight - sh) / 2, sw, sh, x, y, pw, ph);
    ctx.strokeStyle = theme.ink; ctx.strokeRect(x, y, pw, ph); y += ph + 26;
  }
  const sections: [string, string, BiodataKey[]][] = [
    ['निजी जानकारी', 'Personal details', ['name', 'dob', 'height', 'city', 'education', 'occupation', 'income', 'religion', 'community']],
    ['परिवार', 'Family', ['father', 'mother', 'siblings']],
    ['अपने बारे में और संपर्क', 'About & contact', ['about', 'partner', 'contact']],
  ];
  const bottom = H - 80;
  for (const [hi, en, keys] of sections) {
    const filled = keys.filter(key => options.data[key].trim());
    if (!filled.length) continue;
    if (y + 100 > bottom) newPage();
    ctx.fillStyle = theme.ink; font(17, true); ctx.fillText(options.language === 'hi' ? hi : en, 65, y);
    y += 10; ctx.strokeStyle = theme.ink; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(65, y); ctx.lineTo(W - 65, y); ctx.stroke(); y += 28;
    for (const key of filled) {
      const field = biodataFields.find(([id]) => id === key)!;
      font(16); const lines = wrapBiodataText(ctx, options.data[key].trim(), W - 330);
      let first = true;
      for (const line of lines) {
        if (y + 25 > bottom) newPage();
        if (first) { ctx.fillStyle = theme.ink; font(14, true); ctx.fillText(options.language === 'hi' ? field[1] : field[2], 65, y, 205); }
        ctx.fillStyle = '#1f2937'; font(16); ctx.fillText(line, 290, y); y += 25; first = false;
      }
      y += 9;
    }
    y += 14;
  }
  for (let i = 0; i < pages.length; i++) {
    const c = pages[i].getContext('2d')!; c.fillStyle = '#64748b'; c.font = '12px "Biodata Devanagari", Arial, sans-serif'; c.textAlign = 'center';
    c.fillText(`${i + 1} / ${pages.length}`, W / 2, H - 48);
  }
  return pages;
}

export function downloadBiodataBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
