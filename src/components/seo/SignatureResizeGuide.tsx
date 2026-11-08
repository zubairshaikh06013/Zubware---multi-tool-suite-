import React from 'react';

/** One guide for the interactive page and its crawler-readable HTML. */
export function SignatureResizeGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
    <h2 className="text-xl sm:text-2xl font-bold">Resize a signature to 10 KB–20 KB for an online form</h2>
    <p>Start with your form's instructions: the required width and height in pixels, accepted file format, and minimum and maximum file size. These are separate requirements. A file can have the right dimensions but still be too large or too small in KB. Zubware lets you resize the image and check the exported file before submitting it.</p>

    <h3 className="font-bold">What is the pixel size of a 10 KB–20 KB signature?</h3>
    <p>There is no fixed conversion from KB to pixels. Pixels describe the image's width and height; KB measures the encoded file's bytes. Format, compression quality, paper texture and the amount of detail all affect the file size. Two signatures with identical dimensions can have different KB sizes.</p>
    <p>For example, 140 × 60 pixels describes 8,400 pixels, not a guaranteed 10 KB or 20 KB file. Use those dimensions only if your own form requests them. Do not assume that one size applies to every SSC, UPSC, banking, railway or state application.</p>

    <h3 className="font-bold">How to resize and check your signature on a phone</h3>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Choose a clear JPG, PNG or WebP image of your signature. Keep the original image so you can start again if the export is unclear.</li>
      <li>Enter the exact pixel width and height from your form. Keep signature shape enabled to avoid stretching the handwriting. Use Auto Crop to remove empty margins, then check that faint strokes remain visible.</li>
      <li>Choose the format your portal accepts. Select Signature between 10KB and 20KB for that range, or enter your own minimum and maximum KB. JPEG compression keeps your chosen pixel dimensions.</li>
      <li>Read the measured output size and range status. A 7 KB result is under 20 KB but outside a 10–20 KB requirement. With a minimum set, the tool flags this and prevents an out-of-range download.</li>
      <li>Inspect the downloaded image for legibility and confirm its dimensions, format and file size before uploading it to the application portal.</li>
    </ol>

    <h3 className="font-bold">Why is the result below 10 KB or above 20 KB?</h3>
    <p>The individual under-10KB and under-20KB shortcuts set only a maximum. The 10–20 KB shortcut checks both boundaries. JPG export searches for the highest sampled quality that fits the maximum. If it is still below your minimum, try a more detailed original and follow the portal's instructions. The tool does not pad the file with artificial bytes or change mandatory pixel dimensions to make it look valid.</p>
    <p>If the file exceeds the selected maximum, the tool flags it and prevents download. For JPG, try another permitted limit or a clearer, tightly cropped original. Only reduce dimensions if the form allows it. PNG is checked against the limit but does not use the JPG quality compression process. Renaming a PNG file to .jpg does not convert it.</p>

    <h3 className="font-bold">Signature ka size aur pixels kaise set karein?</h3>
    <p>Form mein jo width, height, JPG/PNG format aur minimum–maximum KB diye hain, unhe alag-alag check karo. 10–20 KB range select karne par tool dono limits check karega; file range se bahar ho to warning aayegi aur download rukega. Preview mein poori likhawat dekho aur download ke baad actual file size bhi check karo. Final acceptance application portal decide karta hai.</p>

    <p>Need to prepare the other uploads too? Use the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/image-resizer">Photo Resizer</a> for a separate photo, or the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/photo-signature-joiner">Photo and Signature Joiner</a> when the form explicitly asks for one combined image.</p>
  </section>;
}
