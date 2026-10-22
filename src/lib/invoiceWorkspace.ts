/** Local invoice records and portable backups. No network storage. */
export function validateInvoiceSnapshot<T extends Record<string, unknown>>(input: unknown, template: T): T {
  const check = (value: unknown, sample: unknown, path: string): unknown => {
    if (sample === null) {
      if (value === null || (typeof value === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 3_000_000)) return value;
      throw new Error(`Invalid image: ${path}`);
    }
    if (Array.isArray(sample)) {
      if (!Array.isArray(value) || value.length < 1 || value.length > 200) throw new Error('Use 1–200 invoice items.');
      return value.map((item, i) => check(item, sample[0], `${path}.${i}`));
    }
    if (typeof sample === 'object') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid ${path}`);
      return Object.fromEntries(Object.entries(sample).map(([key, child]) => [key, check((value as Record<string, unknown>)[key], child, `${path}.${key}`)]));
    }
    if (typeof value !== typeof sample || (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) || (typeof value === 'string' && value.length > 20_000)) throw new Error(`Invalid ${path}`);
    return value;
  };
  const result = check(input, template, 'invoice') as T;
  const data = result as any;
  if (!['auto', 'intra', 'inter'].includes(data.taxOverride) || !['Yes', 'No'].includes(data.invoiceMeta.reverseCharge) || !['Tax Invoice', 'Bill of Supply', 'Receipt Voucher'].includes(data.invoiceMeta.invoiceType) || data.items.some((item: any) => !['amount', 'percent'].includes(item.discountType))) throw new Error('Invalid invoice options.');
  return result;
}

export function buildInvoicePaymentUri(upiId: string, businessName: string, balanceDue: number): string | null {
  if (!upiId.trim() || !Number.isFinite(balanceDue) || balanceDue < 0.005) return null;
  return `upi://pay?${new URLSearchParams({ pa: upiId.trim(), pn: businessName || 'Business', am: balanceDue.toFixed(2), cu: 'INR' })}`;
}

/** Choose a page boundary before a table row where possible, never losing pixels. */
export function invoicePageSlices(height: number, capacity: number, rows: {top: number; bottom: number}[]) {
  const slices: {start: number; height: number}[] = [];
  let start = 0;
  while (start < height) {
    let end = Math.min(height, start + capacity);
    const crossing = rows.find(row => row.top < end && row.bottom > end && row.top > start);
    if (crossing) end = Math.floor(crossing.top);
    if (end <= start) end = Math.min(height, start + capacity);
    slices.push({ start, height: end - start });
    start = end;
  }
  return slices;
}
