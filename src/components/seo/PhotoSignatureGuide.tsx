import React from 'react';

export function PhotoSignatureGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl font-bold">Join photo and signature into one JPG with a KB range check</h2>
    <p>Use this joiner when your application explicitly asks for one combined photo-and-signature file. Upload both images, place the signature below or beside the photo, and inspect the exported JPG or PNG. If the form asks for separate files, use the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/image-resizer">Photo Resizer</a> and <a className="text-indigo-600 dark:text-indigo-400 underline" href="/signature-resizer">Signature Resizer</a> instead.</p>
    <h3 className="font-bold">How to check a combined file between 20 KB and 50 KB</h3>
    <p>Set minimum file size to 20 and maximum to 50, or use the example range button. This tool uses 1 KB = 1,000 bytes, so the inclusive range is 20,000–50,000 bytes. A 12 KB file is below that minimum, while a 55 KB file exceeds the maximum. Download is blocked when the measured export is outside your selected range or the minimum exceeds the maximum.</p>
    <p>The range is an example, not an official exam preset. Follow your notification's actual size definition, dimensions, format and layout. Compression can reduce file size but may reduce detail. The checker does not add filler bytes to make a small image appear larger. If a file is below the minimum, use a clearer original or adjust dimensions only if your form permits it.</p>
    <h3 className="font-bold">Calculate the final width and height before uploading</h3>
    <p>For a vertical layout, output width = the larger image-area width + twice the padding. Output height = photo height + signature height + gap + twice the padding. For example, a 300 × 350 px photo area above a 300 × 100 px signature area, with a 10 px gap and zero padding, produces 300 × 460 px. Adding 15 px padding on each edge changes it to 330 × 490 px.</p>
    <p>For a horizontal layout, add the photo width, signature width, gap and twice the padding for the output width; the output height is the larger image-area height plus twice the padding. These are layout calculations, not universal form specifications.</p>
    <h3 className="font-bold">Check the face and handwriting in the downloaded result</h3>
    <p>The photo fills its frame and may be cropped; use zoom and position controls to keep the required face area visible. The signature fits within its frame without stretching. Switch to View actual pixels to inspect small strokes and compressed edges. A file passing the KB check can still fail the portal's other requirements.</p>
    <h3 className="font-bold">Photo aur signature ek JPG mein kaise jodein?</h3>
    <p>Dono files choose karo, layout select karo aur form ke pixels set karo. Agar form minimum aur maximum KB deta hai to dono limits bharo. Sirf upper limit check mat karo. Preview mein face aur poori signature dekho, phir combined file download karke dobara open karo.</p>
    <p>Read the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/blog/join-photo-signature-one-jpg-size-guide">one-JPG photo and signature sizing guide</a> for worked examples and upload troubleshooting.</p>
  </section>;
}
