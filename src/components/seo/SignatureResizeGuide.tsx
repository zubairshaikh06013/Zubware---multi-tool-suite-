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
      <li>Choose the format your portal accepts. For JPG, select the maximum KB limit or enter a custom limit. Compression may reduce quality while keeping your chosen pixel dimensions.</li>
      <li>Check the measured output size against both boundaries. A 20 KB maximum does not enforce a 10 KB minimum: a 7 KB result is under 20 KB but outside a 10–20 KB requirement.</li>
      <li>Inspect the downloaded image for legibility and confirm its dimensions, format and file size before uploading it to the application portal.</li>
    </ol>

    <h3 className="font-bold">Why is the result below 10 KB or above 20 KB?</h3>
    <p>The selected KB value is a maximum, not an exact target or a minimum. If a JPG is too small, try a higher quality export by removing or increasing the maximum limit, then check its measured size again. If it remains below the minimum at the required dimensions, start from a clearer original and follow the portal's instructions. Do not change mandatory dimensions just to add bytes.</p>
    <p>If the file exceeds the selected maximum, the tool flags it and prevents download. For JPG, try another permitted limit or a clearer, tightly cropped original. Only reduce dimensions if the form allows it. PNG is checked against the limit but does not use the JPG quality compression process. Renaming a PNG file to .jpg does not convert it.</p>

    <h3 className="font-bold">Signature ka size aur pixels kaise set karein?</h3>
    <p>Form mein jo width, height, JPG/PNG format aur minimum–maximum KB diye hain, unhe alag-alag check karo. Sirf 20 KB button dabane se file 10–20 KB ke beech hone ki guarantee nahi milti. Preview mein poori likhawat dekho aur download ke baad actual file size bhi check karo. Final acceptance application portal decide karta hai.</p>

    <p>Need to prepare the other uploads too? Use the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/image-resizer">Photo Resizer</a> for a separate photo, or the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/photo-signature-joiner">Photo and Signature Joiner</a> when the form explicitly asks for one combined image.</p>
  </section>;
}
