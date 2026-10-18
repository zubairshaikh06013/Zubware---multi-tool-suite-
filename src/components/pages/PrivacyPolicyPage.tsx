import { SITE_REVIEW_DATE, PRIVACY_NOTES } from '../../data/siteTrustContent';
import React from 'react';
import { ShieldCheck, Lock, HardDrive, Cookie, EyeOff, CheckCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <ShieldCheck className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last reviewed: {SITE_REVIEW_DATE} • Zubware Privacy Policy
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Highlight Banner */}
        <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Local Browser-Based Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              For local tools, processing happens locally in your browser. Files, documents, images, and text inputs are not uploaded to or stored on Zubware servers.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" /> 1. Information Processing & Server Architecture
          </h2>
          <p>
            When you use local processing utilities on Zubware (such as image splitting, image compression, PDF merging, QR code generation, calculators, converters, or text formatters), execution occurs locally within your browser using WebAssembly, HTML5 Canvas, and client-side JavaScript. Files and personal inputs processed by these tools are not transmitted to or stored on Zubware servers.
          </p>
          <p>
            For specialized network-dependent developer utilities (such as the API Request Builder, Website Downloader, and HTTP Header Viewer), requests connect directly from your browser to the external endpoints or URLs you specify. Zubware does not store your request payloads, responses, or headers on its servers.
          </p>
          <p>
            The Subtitle Generator offers optional microphone dictation. Depending on your browser, microphone audio may be sent to the browser provider's speech recognition service. This feature starts only when you select Voice Dictate and grant microphone permission. You can edit captions manually without using dictation; uploaded video playback and subtitle exports stay local.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Background Remover: On-device Processing</h2>
          <p>Quick Removal and Private Removal process your selected photo on your device. The photo is not uploaded for background removal. Local modes may download AI model files and require substantial device memory. Online Smart AI Removal is currently unavailable.</p>
          <p>Cloudflare still provides website delivery and may process request metadata for network delivery and security. Ordinary website requests and model downloads are separate from the locally processed photo. See the provider privacy information below.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" /> 2. Browser Storage & Local State
          </h2>
          <p>
            Zubware uses browser storage technologies including <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">IndexedDB</code> for both application preferences and local productivity state:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Preferences:</strong> Dark mode preference, selected language, and bookmarked favorite tools.</li>
            <li><strong>User-Created Data:</strong> Several tools save user-created drafts and work-in-progress locally on your device for your convenience, including resume versions and templates, encrypted notes, productivity planner items, calculation histories, prompt histories, GST invoice drafts, and generated QR/barcode history.</li>
          </ul>
          <p>
            This data remains stored exclusively on your device until you manually clear it, delete browser data, or reset the respective tool. Zubware servers never receive or sync your locally stored drafts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600" /> 3. Website Requests, Measurement & Advertising
          </h2>
          <p>{PRIVACY_NOTES.analytics}</p>
          <p>{PRIVACY_NOTES.hosting}</p>
          <p>{PRIVACY_NOTES.advertising}</p>
          <p><a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a> · <a className="underline" href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare privacy information</a></p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            4. Contact Messages & Privacy Controls
          </h2>
          <p>{PRIVACY_NOTES.contact}</p>
          <p>{PRIVACY_NOTES.controls}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            5. Contacting Us
          </h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy or practices of Zubware, please contact us directly:
          </p>
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 text-xs space-y-1">
            <p className="font-bold text-slate-800 dark:text-white">Zubair Shaikh (Founder & Developer)</p>
            <p>
              Email:{' '}
              <a href="mailto:zubairshaikh06013@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                zubairshaikh06013@gmail.com
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href="https://wa.me/918791209511" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                +91 87912 09511
              </a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
