export type QrContentType = 'url' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'upi' | 'geo' | 'event';
export type QrFields = Record<string, string | boolean>;
export const escapeQrText = (text: string) => text.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/([;,])/g, '\\$1');
export const escapeWifi = (text: string) => text.replace(/([\\;,:"])/g, '\\$1');

/** Construct payloads without silently replacing missing input with example data. */
export function buildQrPayload(type: QrContentType, fields: QrFields): string {
  const s = (key: string) => String(fields[key] ?? '');
  const required = (key: string, label: string) => {
    const value = s(key);
    if (!value.trim()) throw new Error(`Enter ${label}.`);
    return value;
  };
  const phone = () => {
    const value = required('phoneNumber', 'a phone number including country code').replace(/[\s().-]/g, '');
    if (!/^\+?\d{3,15}$/.test(value)) throw new Error('Use a phone number with digits and an optional leading +.');
    return value;
  };
  const email = (key: string) => {
    const value = required(key, 'an email address').trim();
    if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) throw new Error('Check the email address.');
    return value;
  };
  switch (type) {
    case 'url': return required('textValue', 'a website URL or text');
    case 'wifi': {
      const ssid = required('wifiSsid', 'the Wi-Fi network name');
      const security = s('wifiEnc');
      if (!['WPA', 'WEP', 'nopass'].includes(security)) throw new Error('Choose a Wi-Fi security type.');
      const password = security === 'nopass' ? '' : `P:${escapeWifi(required('wifiPass', 'the Wi-Fi password'))};`;
      return `WIFI:T:${security};S:${escapeWifi(ssid)};${password}${fields.wifiHidden ? 'H:true;' : ''};`;
    }
    case 'vcard': {
      if (!(s('vFirstName') + s('vLastName')).trim()) throw new Error('Enter a contact name.');
      const v = (key: string) => escapeQrText(s(key));
      return ['BEGIN:VCARD', 'VERSION:3.0', `N:${v('vLastName')};${v('vFirstName')};;;`,
        `FN:${escapeQrText(`${s('vFirstName')} ${s('vLastName')}`.trim())}`,
        s('vOrg') && `ORG:${v('vOrg')}`, s('vTitle') && `TITLE:${v('vTitle')}`,
        s('vPhone') && `TEL;TYPE=CELL:${v('vPhone')}`, s('vEmail') && `EMAIL:${v('vEmail')}`,
        s('vUrl') && `URL:${v('vUrl')}`, s('vAddress') && `ADR;TYPE=WORK:;;${v('vAddress')};;;;`,
        'END:VCARD'].filter(Boolean).join('\r\n');
    }
    case 'email': return `mailto:${encodeURIComponent(email('emailTo')).replace(/%40/g, '@')}?subject=${encodeURIComponent(s('emailSubject'))}&body=${encodeURIComponent(s('emailBody'))}`;
    case 'phone': return `tel:${phone()}`;
    case 'sms': return `sms:${phone()}?body=${encodeURIComponent(s('smsMessage'))}`;
    case 'whatsapp': {
      const number = phone().replace(/^\+/, '');
      if (!/^[1-9]\d{6,14}$/.test(number)) throw new Error('Use the full international WhatsApp number, without a leading zero.');
      return `https://wa.me/${number}${s('smsMessage') ? `?text=${encodeURIComponent(s('smsMessage'))}` : ''}`;
    }
    case 'upi': {
      const id = required('upiId', 'a UPI ID').trim();
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(id)) throw new Error('Use a UPI ID such as name@bank.');
      const name = required('upiName', 'the payee name').trim();
      const amount = s('upiAmount').trim();
      if (amount && (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || !Number.isFinite(Number(amount)))) throw new Error('Enter a positive INR amount with at most two decimal places, or leave it blank.');
      return `upi://pay?pa=${encodeURIComponent(id)}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount}` : ''}${s('upiNote') ? `&tn=${encodeURIComponent(s('upiNote'))}` : ''}`;
    }
    case 'geo': {
      const lat = Number(required('geoLat', 'a latitude'));
      const lng = Number(required('geoLng', 'a longitude'));
      if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lng) || Math.abs(lng) > 180) throw new Error('Latitude must be −90 to 90 and longitude −180 to 180.');
      return `geo:${lat},${lng}`;
    }
    case 'event': {
      const title = required('eventTitle', 'an event title');
      const start = new Date(required('eventStart', 'the start date and time'));
      const end = s('eventEnd') ? new Date(s('eventEnd')) : null;
      if (!Number.isFinite(start.getTime()) || (end && !Number.isFinite(end.getTime()))) throw new Error('Enter valid event dates.');
      if (end && end <= start) throw new Error('The event must end after it starts.');
      const utc = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      return ['BEGIN:VEVENT', `SUMMARY:${escapeQrText(title)}`, `DTSTART:${utc(start)}`,
        end && `DTEND:${utc(end)}`, s('eventLocation') && `LOCATION:${escapeQrText(s('eventLocation'))}`,
        s('eventDescription') && `DESCRIPTION:${escapeQrText(s('eventDescription'))}`, 'END:VEVENT'].filter(Boolean).join('\r\n');
    }
  }
}
