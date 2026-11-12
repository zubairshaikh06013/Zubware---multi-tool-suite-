import React from 'react';

const steps = [
  {
    title: 'फोटो चुनें',
    image: 'choose-image.svg',
    alt: 'Photo Resizer का Browse Images to Resize बटन, नारंगी बॉर्डर से दिखाया गया है।',
    text: 'Browse Images to Resize दबाकर अपनी JPG, PNG या WebP फोटो चुनें। मोबाइल पर gallery से भी फोटो ले सकते हैं।',
  },
  {
    title: 'Pixels, KB और format सेट करें',
    image: 'choose-settings.svg',
    alt: 'असली settings का example: maximum 50 KB, width और height 300 pixels, output JPG।',
    text: 'अपने form के हिसाब से Width, Height, minimum–maximum KB और Output Format चुनें। फोटो खिंचने से बचाने के लिए सही proportions रखें। फिर Resize All Images दबाएं।',
  },
  {
    title: 'Result चेक करके download करें',
    image: 'download-result.svg',
    alt: 'Demo logo का 300 × 300 pixels, 11.78 KB result और हरा download icon।',
    text: 'Result में pixels और actual KB दोनों देखें। सही हों तो हरा download icon दबाएं। कई फोटो हों तो Download All as ZIP चुनें। डाउनलोड की गई फोटो खोलकर भी चेक करें।',
  },
];

/** Real UI screenshots, shared with the generated initial HTML. */
export function PhotoResizeVisualGuide() {
  return <section aria-labelledby="photo-visual-guide-title" className="space-y-5">
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Screenshot guide · 3 steps</p>
      <h2 id="photo-visual-guide-title" className="text-xl sm:text-2xl font-bold">Photo resize kaise karein? — तस्वीरों के साथ सीखें</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">हर screenshot में नारंगी highlight पर ध्यान दें। बड़ा देखने के लिए तस्वीर खोलें।</p>
    </div>
    <ol className="space-y-5" style={{ listStyle: 'none', padding: 0 }}>
      {steps.map((step, index) => <li key={step.image} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-4 sm:p-5 flex items-start gap-3">
          <span aria-hidden="true" className="shrink-0 rounded-full bg-indigo-600 text-white font-bold text-sm w-8 h-8 flex items-center justify-center">{index + 1}</span>
          <div className="space-y-2 min-w-0">
            <h3 className="font-bold text-base sm:text-lg">{step.title}</h3>
            <p lang="hi" className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.text}</p>
          </div>
        </div>
        <a href={`/guides/image-resizer/${step.image}`} target="_blank" rel="noopener" aria-label={`Step ${index + 1} की बड़ी screenshot खोलें (नई tab)`} className="block border-t border-slate-100 dark:border-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
          <img src={`/guides/image-resizer/${step.image}`} alt={step.alt} width={720} height={340} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', maxWidth: 720, height: 'auto', margin: '0 auto' }} />
        </a>
      </li>)}
    </ol>
    <p lang="hi" className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Screenshots में demo logo पर 300 × 300 pixels और maximum 50 KB का example है; यह किसी exam की official requirement नहीं है। अपनी फोटो और form के अनुसार values रखें। Screenshots desktop view के हैं; मोबाइल पर controls नीचे-ऊपर दिख सकते हैं।</p>
  </section>;
}
