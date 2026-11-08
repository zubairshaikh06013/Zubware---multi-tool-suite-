import React from 'react';

/** Shared by the interactive page and the generated HTML. */
export function PhotoResizeGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
    <h2 className="text-xl sm:text-2xl font-bold">Resize a photo to 20–50 KB with the required pixels</h2>
    <p>A form can specify three different things: width and height in pixels, a file-size range in KB, and a format such as JPG. Check all three on the final downloaded file. Zubware resizes photos in your browser and measures the exported bytes; a maximum KB setting does not enforce a minimum.</p>
    <h3 className="font-bold">What is a 20 KB to 50 KB photo size in pixels?</h3>
    <p>There is no single pixel size for a 20–50 KB photo. Pixels measure image dimensions, while KB measures encoded bytes. A detailed photo and a plain image can have different file sizes at the same dimensions. For example, 160 × 200 pixels is 32,000 pixels, not 32 KB. Use the dimensions in your own application instructions.</p>
    <h3 className="font-bold">How to resize a photo to 160 × 200 pixels and under 20 KB</h3>
    <ol className="list-decimal pl-5 space-y-2">
      <li>If needed, <a href="/crop-image" className="underline text-indigo-600 dark:text-indigo-400">crop your photo</a> to the required proportions first so the face will not be stretched.</li>
      <li>Choose Exact Dimensions and enter width 160 and height 200. Unlock the aspect ratio only when necessary to enter both exact values.</li>
      <li>Select JPG / JPEG if the portal requires it. Set Maximum Photo File Size to 20 KB, then upload and select Resize All Images.</li>
      <li>Check the output shows 160 × 200 pixels and no more than 20,000 bytes. If the portal also specifies a minimum, check that separately. Download and inspect the image before submitting.</li>
    </ol>
    <p>These numbers are a worked setup example, not an official exam preset or a guarantee that every source photo can meet the limit clearly. For 132 × 170 pixels or 256 × 64 pixels, enter those values only when your form requests them.</p>
    <h3 className="font-bold">Why is my photo below 20 KB when I selected 50 KB?</h3>
    <p>50 KB is a ceiling, not an exact target. If a form requires 20–50 KB and your output is 14 KB, it is still below that form's minimum. Increase JPEG quality and resize again, or remove the maximum temporarily to inspect a higher-quality export. Keep mandatory dimensions unchanged. A low-detail source may remain too small; do not assume a larger filename or changing its extension changes the image format or valid file size.</p>
    <h3 className="font-bold">What if the image is still too large or looks blurry?</h3>
    <p>Use the original photo rather than repeatedly compressing a downloaded copy. JPEG and WebP support quality compression here; PNG and BMP are checked against the cap but may remain too large. If the tool cannot meet your maximum, it reports an error. Reduce dimensions only if the form permits it, and keep enough detail for the photo to remain recognisable.</p>
    <h3 className="font-bold">Mobile par photo ka KB aur pixels kaise check karein?</h3>
    <p>Form ki width, height, format aur minimum–maximum KB note karo. Resize ke baad result ke pixels aur file size dono dekho. Sirf “under 50 KB” hone se 20–50 KB ki condition poori nahi hoti. Photo dhundhli ya stretched ho to original se dobara try karo. Final acceptance portal decide karta hai.</p>
    <p>For a separate signature, use the <a href="/signature-resizer" className="underline text-indigo-600 dark:text-indigo-400">Signature Resizer with minimum and maximum KB checks</a>. Use the <a href="/photo-signature-joiner" className="underline text-indigo-600 dark:text-indigo-400">Photo and Signature Joiner</a> only when one combined file is requested. For the final upload checklist, see <a href="/blog/photo-upload-rejected-file-size-format-checklist" className="underline text-indigo-600 dark:text-indigo-400">why a photo upload can be rejected</a>.</p>
  </section>;
}
