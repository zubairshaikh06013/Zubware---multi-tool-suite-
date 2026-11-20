export interface ToolChoice { task: string; toolId: string; check: string }
/** Task-led recommendations; use tool metadata for every destination and label. */
export const TOOL_CHOICES: Record<string, ToolChoice[]> = {
  'pdf-tools': [
    { task: 'Reduce a PDF for an upload limit', toolId: 'pdf-compressor', check: 'Compare the downloaded size and text clarity. A target size is not guaranteed.' },
    { task: 'Combine documents in a chosen order', toolId: 'pdf-merge', check: 'Check the page order before saving; merging does not compress the result.' },
    { task: 'Extract an editable table', toolId: 'pdf-to-excel', check: 'Selectable text works best. Scans need OCR; check the extracted cells.' },
  ],
  'image-tools': [
    { task: 'Change width and height in pixels', toolId: 'image-resizer', check: 'Pixel dimensions and KB are different. Check both against your form instructions.' },
    { task: 'Reduce the photo file size', toolId: 'image-compressor', check: 'Inspect faces and small text after compression; keep the original.' },
    { task: 'Remove a photo background', toolId: 'background-remover', check: 'Review hair and edges. Smart AI uploads the selected photo after consent; local modes are also available.' },
  ],
  'creator-tools': [
    { task: 'Draft a YouTube title', toolId: 'youtube-title-generator', check: 'Match the actual video. Suggestions do not include live search demand or guarantee views.' },
    { task: 'Check caption length', toolId: 'social-character-counter', check: 'Verify the final text in the destination app; platform counting rules can differ.' },
  ],
  'video-tools': [
    { task: 'Reduce a video file size', toolId: 'video-compressor', check: 'Try a short sample first and check audio, clarity and the exported format.' },
    { task: 'Prepare timed subtitles', toolId: 'subtitle-generator', check: 'Review every timestamp and word. Optional microphone dictation may use the browser provider.' },
  ],
  'audio-tools': [
    { task: 'Slow a track and add reverb', toolId: 'slowed-and-reverb', check: 'Preview the result and use audio you have permission to edit and publish.' },
    { task: 'Create a lofi arrangement', toolId: 'lofi-song-maker', check: 'Check the preview and available export controls before preparing a full track.' },
  ],
  'business-tools': [
    { task: 'Prepare a GST invoice', toolId: 'gst-invoice-generator', check: 'Review tax rates and required fields. A PDF invoice is not an IRP e-invoice submission.' },
    { task: 'Reconcile physical cash', toolId: 'cash-denomination-calculator', check: 'Keep card and UPI receipts separate from cash in the drawer.' },
  ],
  'text-tools': [
    { task: 'Count words in a draft', toolId: 'word-counter', check: 'Different editors can count punctuation and hyphenated words differently.' },
    { task: 'Find changes between two texts', toolId: 'text-compare', check: 'Paste the correct original and revised versions; inspect the highlighted differences.' },
  ],
  'career-tools': [
    { task: 'Review a resume before applying', toolId: 'ats-resume-checker', check: 'The score is a local heuristic, not an employer ATS score or a hiring prediction.' },
    { task: 'Calculate work experience', toolId: 'experience-calculator', check: 'Check overlapping employment dates and the reference date before using the result.' },
  ],
  'developer-tools': [
    { task: 'Read and format JSON', toolId: 'json-formatter', check: 'Valid JSON syntax does not establish that the data matches your application schema.' },
    { task: 'Inspect a JWT payload', toolId: 'jwt-decoder', check: 'Decoding does not verify the signature or prove the token is authentic.' },
  ],
  'design-tools': [
    { task: 'Calculate age on a specific date', toolId: 'age-calculator', check: 'Enter the cutoff date explicitly. For eligibility, follow the authority’s rules for leap-day birthdays.' },
    { task: 'Sample a color from an image', toolId: 'image-color-picker', check: 'A sampled color alone does not establish accessible text contrast.' },
  ],
  'prompt-tools': [
    { task: 'Structure a ChatGPT instruction', toolId: 'chatgpt-prompt-builder', check: 'Specify the task, context and output format. Review generated facts independently.' },
    { task: 'Prepare a Gemini instruction', toolId: 'gemini-prompt-builder', check: 'A prompt builder prepares text; running it in the destination model is a separate step.' },
  ],
  'health-fitness': [
    { task: 'Estimate daily calorie needs', toolId: 'calorie-calculator', check: 'The result is a formula-based estimate, not an individual medical assessment.' },
    { task: 'Explore a weight-gain target', toolId: 'weight-gain-calculator', check: 'Results depend on the inputs and assumptions; individual requirements vary.' },
  ],
  'generators': [
    { task: 'Create a QR code for a URL', toolId: 'qr-generator', check: 'Scan the downloaded code on another phone and confirm the destination before printing.' },
    { task: 'Inspect a QR code before opening it', toolId: 'qr-code-safety-checker', check: 'Structural warnings cannot prove that a destination website is safe.' },
  ],
};
