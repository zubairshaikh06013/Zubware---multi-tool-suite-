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
          Effective Date: September 2026 • Zubware Client-Side Security & Privacy Policy
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Highlight Banner */}
        <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              100% In-Browser Local Processing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Zubware operates completely inside your local web browser. Your private images, PDF documents, text, code, and personal data are never sent to external servers or cloud databases.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" /> 1. Information We Do Not Collect (No Server Uploads)
          </h2>
          <p>
            When you use any utility on Zubware (such as image splitting, image compression, PDF merging, QR code generation, calculators, or converters), the execution occurs strictly within your browser's RAM memory using WebAssembly, HTML5 Canvas, and client-side JavaScript. We do not store, view, or retain your files on any server.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" /> 2. Local Storage & Cookies
          </h2>
          <p>
            Zubware uses <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">IndexedDB</code> solely to remember your preferences (such as dark mode, selected language, or favorite tools) locally on your device. You can clear this data at any time via your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600" /> 3. Google AdSense & Third-Party Cookies Policy
          </h2>
          <p>
            We use Google AdSense to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on Zubware:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads to users based on their visits to our site and other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Ads Settings</a> or via <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">www.aboutads.info</a>.
            </li>
            <li>
              Third-party ad networks or ad servers use technology in their respective advertisements and links that appear on Zubware, sent directly to your browser. They automatically receive your IP address when this occurs.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            4. CCPA & GDPR Privacy Rights
          </h2>
          <p>
            Under GDPR and CCPA, users have rights including the right to request access to personal data, the right to erasure, and the right to non-discrimination. Because Zubware processes all files client-side and does not create user accounts or store personal files on our servers, no personal files are retained in our systems.
          </p>
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
