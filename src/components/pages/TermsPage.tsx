import React from 'react';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block mb-3">
          <FileText className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last Updated: September 2026 • Zubware Online Tools Suite
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Zubware (https://www.zubware.com), you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Free License & Permitted Use</h2>
          <p>
            Zubware offers browser-based utilities for personal, educational, and lawful business use. Features and available file formats vary by tool and browser. Please review the instructions and limitations shown on each tool page before relying on an output.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. User Responsibility & File Ownership</h2>
          <p>
            You remain responsible for ensuring that you have permission to use, upload, edit, and share any files or other content you provide. Many tools process files locally in your browser, while some AI-powered or network-dependent features may use remote services. Review the relevant tool information and our Privacy Policy before submitting sensitive content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">4. Accuracy and Important Documents</h2>
          <p>
            Generated files, calculations, templates and previews may depend on browser support and the quality of your inputs. Check results before printing, publishing, submitting an application or using them for legal, financial or other important purposes. Keep your own backup of original files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">5. External Services and Availability</h2>
          <p>
            Some features may require an internet connection or third-party services. Availability, processing limits and supported formats can change. External websites linked from Zubware have their own terms and privacy practices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">6. Limitation of Liability</h2>
          <p>
            Zubware tools are provided "as is" without warranty of any kind. Under no circumstances shall Zubware or its operators be held liable for any damages or file loss resulting from the use or inability to use our website.
          </p>
        </section>
      </div>
    </div>
  );
};
