import React from 'react';

export function QrDecoderGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl font-bold">Read a QR code from a screenshot or saved image</h2>
    <p>A QR code displayed on your own phone can be difficult to scan with its camera. Save a screenshot and upload it here instead. Keep the whole square and the blank border around it visible. Choose a PNG, JPEG or WebP image under 15 MB; images above 24 million pixels must be resized first.</p>
    <h3 className="font-bold">What the decoded result means</h3>
    <p>The result is the raw text stored in the QR code. It may be a website address, a short message, a WiFi configuration beginning with WIFI:, or a contact card beginning with BEGIN:VCARD. This reader displays those values as text; it does not connect to a network or import contacts for you.</p>
    <p>Some people call this a QR code translator or search for decrypt QR code. Decoding converts the QR pattern into its stored data. It does not translate languages, reveal a password protected destination, or decrypt an encrypted payload.</p>
    <h3 className="font-bold">If the QR image will not decode</h3>
    <p>Use the original image rather than a tiny preview. Avoid glare, blur and cropped corners. Leave a clear margin, improve contrast and try an upright screenshot. Not every damaged or stylized code can be recovered. This tool reads saved QR images; it does not provide live camera scanning or read ordinary one dimensional barcodes.</p>
    <h3 className="font-bold">Review a link before opening it</h3>
    <p>Image decoding happens in your browser. A decoded address is not a safety verdict. Check its domain before choosing Open Link; the tool does not open it automatically. You can also copy the text without visiting the destination.</p>
    <p>Need to create a code instead? Use the <a className="text-indigo-600 underline" href="/qr-generator">QR Code Generator</a> to encode your own text or URL.</p>
  </section>;
}
