import React from 'react';

export function PhotoNameDateGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl font-bold">Add name and date below a photo: check the complete output</h2>
    <p>Use a visible name and date strip only when your application instructions request it. Enter the candidate name and the actual date the photograph was taken. DOP means date of photograph, not date of birth. The Today button uses your device date; choose it only if the photo was taken today.</p>
    <h3 className="font-bold">Strip or overlay: why the final pixels change</h3>
    <p>A top or bottom strip adds space outside the original photo. At the default 20% strip height, a 600 × 700 px original receives a 140 px strip: output 600 × 840 px. Bottom overlay keeps 600 × 700 px but covers the bottom 140 px of the photo. Make sure it does not hide the face, chin or other required area. These are layout examples, not exam presets.</p>
    <h3 className="font-bold">Can I add a name and date to a photo under 50 KB?</h3>
    <p>Choose JPG and enter 50 in Maximum file size. This tool uses 1 KB = 1,000 bytes and tries lower JPG quality while retaining the output pixels. It measures the encoded file; download is blocked if it still exceeds 50,000 bytes. PNG is measured without lossy compression. Results depend on the source image. No minimum-size check is applied here, so check any minimum in your form separately.</p>
    <p>The preview shows the encoded export, including compression changes. Read the complete name and date, check the final width, height and bytes, then open the downloaded file. The tool does not set exact final dimensions: use the <a className="underline text-indigo-600 dark:text-indigo-400" href="/image-resizer">Image Resizer</a> for a different pixel size and check the label again.</p>
    <h3 className="font-bold">Photo par naam aur date kaise lagayein?</h3>
    <p>Photo choose karo, apna sahi naam aur photo lene ki actual date bharo. Bottom Strip mein alag jagah judti hai; Overlay photo ke neeche ka hissa cover karta hai. Final pixels aur KB dono dekho. Form ki instruction alag ho sakti hai, isliye preview ko accepted photo ka proof mat samjho.</p>
    <p>Read the <a className="underline text-indigo-600 dark:text-indigo-400" href="/blog/add-name-date-photo-size-guide">name and date photo sizing guide</a>. If you need both photo and signature in one file, use the <a className="underline text-indigo-600 dark:text-indigo-400" href="/photo-signature-joiner">Photo and Signature Joiner</a>.</p>
  </section>;
}
