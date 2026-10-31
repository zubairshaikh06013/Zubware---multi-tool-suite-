export const SITE_REVIEW_DATE = '17 October 2026';
export const PRIVACY_NOTES = {
  invitations: 'Wedding Invitation Maker editing and downloads run locally. Only after you choose to publish a guest link are the invitation text, dates, venues and compressed photo stored in Cloudflare Workers KV. Anyone with the guest link can view them without login. The record expires 90 days after the last event, capped at one year from publishing or updating (past events receive at least one day). Your private edit key stays in this browser or a downloaded private backup; only its hash is stored online. Use that key to update or unpublish. Updates and unpublishing may take about a minute to propagate. Do not share your private backup with guests.',
  analytics: 'Zubware loads Google Tag Manager on its production website to manage configured measurement tags. Third-party measurement services may receive page URLs, device/browser information, identifiers and network information such as an IP address. Local file processing does not mean the website makes no network requests. Browser privacy controls and blockers can affect measurement.',
  hosting: 'The website is delivered through Cloudflare. Visiting a page requires network requests, and hosting/security providers may process request information to deliver and protect the service. Some tools also download fonts, libraries, OCR language data or machine-learning models. These downloads are separate from uploading a file for processing.',
  contact: 'Contact and feedback actions open an email or WhatsApp draft. The message is delivered only after you send it in that service. Information you choose to send is handled by the recipient and the email or messaging provider. Feedback history may also remain in this browser until you clear site data.',
  advertising: 'Zubware does not currently display AdSense ads. If advertising is introduced, this policy and the applicable privacy choices will be updated to describe the actual providers and data use.',
  controls: 'You can clear locally saved drafts and preferences using your browser’s site-data controls; this may permanently remove your local work. For questions about information you sent by email or messaging, contact the site operator. Privacy rights and available remedies depend on your location and the service involved.'
};
export const ABOUT_QUALITY = 'Zubware is maintained by Zubair Shaikh. Tools are intended for everyday tasks such as preparing images, working with documents and checking calculations. Supported formats, limits and assumptions differ by tool and browser. Review the result before submitting an application or relying on it for an important decision.';
export const REPORT_A_PROBLEM = 'To report a problem, include the tool URL, browser/device, steps to reproduce, and expected versus actual result. Use a non-sensitive sample where possible. Contact actions prepare a draft in your email app or WhatsApp; you must send it there.';

// Shared wording for the rendered site and build-time HTML.
export const SITE_SUMMARY = 'Free online tools for images, PDFs, calculations and everyday tasks. Processing options vary by tool.';
export const PROCESSING_PRIVACY_TITLE = 'Local and Online Processing';
export const PROCESSING_PRIVACY_SUMMARY = 'Local tools process files on your device. Online features may send data to a service; check the tool notice before starting.';
export const FREE_TOOLS_SUMMARY = 'Free to use. File-size, device and online-service limits may apply; check each tool for details.';
export const BACKGROUND_REMOVAL_NOTES = {
  quality: 'Choose Quick or Private Removal for on-device processing, or Smart AI Removal for optional online processing. Hair, fur, glass and low-contrast edges can be imperfect; inspect the cutout before using it.',
  uses: 'Prepare transparent cutouts for product photos, presentations or graphics. Check the destination requirements for background color, size and framing; this tool does not certify compliance or guarantee acceptance.',
  privacy: 'Quick Removal and Private Removal process the selected photo on your device. The browser may download model resources first. Smart AI Removal sends the selected photo to Cloudflare only after you give permission and start.',
  limits: 'Smart AI Removal accepts photos up to 10 MB and depends on online-service availability and allowance. If it is unavailable, use Quick or Private Removal. Preview background colors are for inspection; the downloaded PNG remains transparent.'
};
