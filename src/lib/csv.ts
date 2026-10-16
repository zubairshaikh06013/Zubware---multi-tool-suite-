/** Parse delimited text without splitting quoted multiline fields or coercing identifiers. */
export function parseCsv(text: string, delimiter = ','): string[][] {
  if (delimiter.length !== 1 || /["\r\n]/.test(delimiter)) throw new Error('Choose a single valid delimiter.');
  if (!text.trim()) return [];
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false, touched = false;
  const cell = () => { row.push(field); field = ''; closed = false; };
  const record = () => { cell(); if (touched || row.length > 1 || row[0] !== '') rows.push(row); row = []; touched = false; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += c;
      continue;
    }
    if (c === delimiter) { cell(); touched = true; }
    else if (c === '\r' || c === '\n') { record(); if (c === '\r' && text[i + 1] === '\n') i++; }
    else if (closed) throw new Error('Unexpected characters after a closing quote.');
    else if (c === '"') {
      if (field !== '') throw new Error('A quote inside an unquoted field must be escaped in a quoted field.');
      quoted = true; touched = true;
    } else { field += c; touched = true; }
  }
  if (quoted) throw new Error('Unclosed quoted field.');
  if (touched || row.length || field || closed) record();
  return rows;
}
export function serializeCsv(rows: string[][], delimiter = ','): string {
  return rows.map(row => row.map(cell => /["\r\n]/.test(cell) || cell.includes(delimiter)
    ? `"${cell.replace(/"/g, '""')}"` : cell).join(delimiter)).join('\r\n');
}
export function csvObjects(text: string, delimiter = ',', inferTypes = false) {
  const [headers, ...rows] = parseCsv(text, delimiter);
  if (!headers) return [];
  if (headers.some(h => !h.trim())) throw new Error('Every column needs a non-empty header.');
  if (new Set(headers).size !== headers.length) throw new Error('Duplicate column headers would overwrite data. Rename them first.');
  return rows.map((row, index) => {
    if (row.length !== headers.length) throw new Error(`Record ${index + 2} has ${row.length} fields; expected ${headers.length}.`);
    return Object.fromEntries(headers.map((header, i) => {
      const value = row[i];
      let converted: string | number | boolean = value;
      if (inferTypes) {
        if (value === 'true' || value === 'false') converted = value === 'true';
        else if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
          const n = Number(value);
          if (Number.isFinite(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER && String(n) === value) converted = n;
        }
      }
      return [header, converted];
    }));
  });
}
