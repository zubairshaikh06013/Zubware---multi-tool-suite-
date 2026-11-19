import type { SearchQuestionGuide } from './searchQuestionGuides';
import type { ToolSeoData } from './toolSeoData';

/** Task-specific guides; search analytics stay outside the public repository. */
export const WEEKLY_TOOL_GUIDES: Record<string, SearchQuestionGuide> = {
  'currency-calculator': {
    heading: 'How to calculate a currency conversion with your own exchange rate',
    answer: 'Choose the source currency, destination currency and amount. Use Edit Custom Rates to enter rates from your chosen provider before relying on the conversion. This is a manual exchange-rate calculator: its starting rates are examples and do not update automatically.',
    steps: ['Choose From and To currencies and enter the amount to convert.', 'Open Edit Custom Rates. Each value means units of that currency per 1 USD; keep the same USD base when editing a pair.', 'Read the converted amount and reciprocal rate. Swap the currencies to inspect the reverse direction.', 'Compare with your provider’s final quote, including its own spread and fees, before making a payment.'],
    example: 'Illustrative rates only: if 1 USD = 0.80 GBP and 1 USD = 0.90 EUR, then 100 GBP ÷ 0.80 × 0.90 = 112.50 EUR. The direct GBP-to-EUR rate is 1.125. These numbers demonstrate the formula, not today’s exchange rates.',
    note: 'The calculation is amount ÷ source units per USD × destination units per USD. Saved custom rates remain in this browser. Reset restores illustrative defaults. This tool does not fetch live rates, model dual-currency investments or reproduce a bank/card-network quote.',
    links: [{ href: '/percentage-calculator', label: 'Calculate a percentage fee separately' }, { href: '/working-days-calculator', label: 'Count working days between dates' }]
  },
  'random-letter-generator': {
    heading: 'Pick one random letter or a set of alphabet letters',
    answer: 'Set the quantity to 1 for a single random English letter, or choose a larger quantity for a set. Select uppercase, lowercase or mixed case, then choose all letters, vowels or consonants and press Generate Letters.',
    steps: ['For a classroom or word game, choose quantity 1 and the full alphabet.', 'Choose vowels for A, E, I, O, U only, or consonants to exclude those five letters.', 'Turn duplicates off when each base letter should appear at most once.', 'Generate, then copy the output with your preferred separator. Generate again for another draw.'],
    example: 'With Vowels selected, quantity 5 and duplicates off, the result contains A, E, I, O and U in a random order. Asking for more than five unique vowels still produces at most five base letters. Mixed case changes display case, not the size of that base-letter pool.',
    note: 'This picks English letters for games and prompts; it does not solve anagrams or build words from supplied letters. It uses Math.random and is not a password generator. Outputs are random, so a demonstration sequence is not a prediction of your next draw.',
    links: [{ href: '/random-number-generator', label: 'Pick random numbers instead' }, { href: '/random-name-picker', label: 'Draw from your own list of names' }]
  },
  'text-reverser': {
    heading: 'Reverse text, word order or line order',
    answer: 'Paste your text, then choose Reverse Characters for backwards text, Reverse Words to change the order of words, or Reverse Line Order to move whole lines. The output updates as you edit; copy it or download a text file.',
    steps: ['Paste a sentence or several lines into the input.', 'Choose the reversal mode that matches your task.', 'In character or word mode, keep Preserve Line Breaks enabled to process each line separately, or disable it to reverse across the whole input.', 'Inspect punctuation and spacing, then copy or download the result.'],
    example: 'For Hello world, character mode gives dlrow olleH; word mode gives world Hello. For three lines reading first, second, third, line mode changes their order to third, second, first without reversing the letters inside each line.',
    note: 'Reversing character order does not mirror the shape of each glyph or rotate letters upside down. Combined accents and complex emoji can need manual review because character mode reverses Unicode code points rather than complete visual clusters.',
    links: [{ href: '/text-compare', label: 'Compare the original and edited text' }, { href: '/remove-extra-spaces', label: 'Clean extra spaces separately' }]
  },
  'xml-validator': {
    heading: 'Validate XML syntax and find malformed tags',
    answer: 'Paste XML or upload an XML text file to check whether the browser can parse it as well-formed XML. Fix the reported tag, entity or syntax issue and check again. A syntax pass does not validate an XSD schema or the rules of a particular application.',
    steps: ['Paste your XML or select a local file. You can use a sample to see the expected structure.', 'Inspect the parser message; a line number is shown when the browser supplies one.', 'Check opening/closing tag names, nesting, quoted attributes and escaped ampersands. Fix the first error before checking again.', 'After syntax passes, format or minify if needed and copy or download the result. Use the receiving application for its schema and business-rule checks.'],
    example: '<item>Book</items> has mismatched tag names. Change it to <item>Book</item>. In ordinary XML text, write A &amp; B rather than a bare ampersand. These examples concern XML syntax; they do not establish that a sitemap, feed or invoice meets its separate requirements.',
    note: 'The checker uses the browser’s XML parser locally. Error wording and line details can differ by browser. It does not fetch a remote XSD or DTD, and it does not execute XSLT transformations.',
    links: [{ href: '/xml-formatter', label: 'Format XML for easier inspection' }, { href: '/xml-to-json', label: 'Convert parsed XML to JSON' }]
  },
  'instagram-username-generator': {
    heading: 'Find Instagram username ideas from your name and a keyword',
    answer: 'Enter your name and a topic or brand keyword to get IG username suggestions in Short, Professional, Creative, Minimal and Random styles. Copy a candidate and check it in Instagram. The tool generates ideas; it does not check whether an account name is available.',
    steps: ['Replace the sample name with your name or brand stem.', 'Add a useful keyword such as design, travel or code.', 'Compare the style groups and choose an easy-to-read candidate.', 'Copy the suggestion, review its spelling and length, and check availability and acceptance directly in Instagram before using it.'],
    example: 'With the name Alex and keyword Design, professional and creative ideas include alex.design, alexdesignstudio and alexcreates. Treat these as starting points: a generated name may already belong to another account.',
    note: 'Inputs are simplified to lowercase Latin letters and digits before the templates add separators. “Rare” or “unique” describes an idea, not verified availability. The generator does not reserve a handle, access your Instagram account or promise that every suggestion will be accepted.',
    links: [{ href: '/instagram-bio-generator', label: 'Draft a matching profile bio' }, { href: '/instagram-caption-generator', label: 'Create caption ideas for your posts' }]
  },
  'handwriting-to-text': {
    heading: 'Scan handwriting and convert it to editable text',
    answer: 'Upload a clear photo of your notes or write on the drawing canvas, then run OCR and edit the extracted text. This tool uses an English recognition model in your browser. Clear, separated block letters are a better fit than joined cursive handwriting.',
    steps: ['Photograph the page straight-on in even light, keeping all text sharp and readable.', 'Use upload mode for a photo or draw mode for a short sample. Crop empty borders and rotate the image before uploading if necessary.', 'Run recognition and compare the result with the source. If contrast enhancement loses faint strokes, try again with it disabled.', 'Correct names, numbers, punctuation and missing words in the editable result before copying or downloading it.'],
    example: 'For a shopping note reading Milk 2, OCR might confuse the handwritten 2 with Z. Compare each recognized line with the photo and correct it in the result box. A successful scan means text was extracted, not that the transcription is error-free.',
    note: 'Recognition runs locally after the OCR engine and English model load. The first scan can take longer. This workflow does not reproduce handwriting, guarantee cursive recognition, accept a PDF as the image input, or automatically create a Word document.',
    links: [{ href: '/crop-image', label: 'Crop the handwriting photo' }, { href: '/rotate-image', label: 'Straighten the page orientation' }, { href: '/image-to-text', label: 'Try OCR for printed text and other languages' }]
  }
};

export const WEEKLY_TOOL_SEO: Record<string, ToolSeoData> = Object.fromEntries(
  Object.entries(WEEKLY_TOOL_GUIDES).map(([id, guide]) => [id, {
    howTo: guide.steps.map((desc, index) => ({ title: `Step ${index + 1}`, desc })),
    faq: [
      { question: guide.heading, answer: guide.answer },
      { question: id === 'currency-calculator' ? 'Does this calculator use live exchange rates?' : id === 'xml-validator' ? 'Does a syntax pass mean my XML matches its XSD schema?' : id === 'instagram-username-generator' ? 'Are the generated Instagram usernames available?' : id === 'handwriting-to-text' ? 'Does handwriting OCR work perfectly with cursive?' : id === 'random-letter-generator' ? 'Does this tool generate words from supplied letters?' : 'Does reversing text mirror or rotate the letter shapes?', answer: guide.note }
    ]
  }])
);
