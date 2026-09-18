import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Sparkles, Phone, User, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendViaEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const mailtoUrl = `mailto:zubairshaikh06013@gmail.com?subject=${encodeURIComponent(subject || 'Zubware Inquiry / Feedback')}&body=${encodeURIComponent(`Hi Zubair,\n\nName: ${name || 'Anonymous'}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUrl;
    onShowToast('Opening email client...');
  };

  const sendViaWhatsApp = () => {
    const text = `Hi Zubair! 👋\n\nName: ${name || 'User'}\nSubject: ${subject || 'Zubware Query'}\n\nMessage:\n${message || 'I have a question/suggestion for Zubware.'}`;
    const whatsappUrl = `https://wa.me/918791209511?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Opening WhatsApp...');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 my-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block shadow-xs">
          <MessageCircle className="w-8 h-8" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Contact & Direct Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Need help, want to suggest a new tool, or have a feature request? Connect directly with the creator of Zubware.
        </p>
      </div>

      {/* Quick Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp Card */}
        <a
          href="https://wa.me/918791209511?text=Hi%20Zubair,%20I%20have%20a%20question%20about%20Zubware"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 rounded-2xl flex items-center gap-4 group hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Instant Chat
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              WhatsApp Support
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
              +91 87912 09511
            </p>
          </div>
        </a>

        {/* Email Card */}
        <a
          href="mailto:zubairshaikh06013@gmail.com?subject=Zubware%20Inquiry"
          className="glass-card p-5 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Direct Email
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Zubair Shaikh
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
              zubairshaikh06013@gmail.com
            </p>
          </div>
        </a>
      </div>

      {/* Contact Form Panel */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Send a Message
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill out the form to send your message directly via WhatsApp or Email.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold">
            Fast Response
          </span>
        </div>

        <form onSubmit={sendViaEmail} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject / Topic
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Tool Request, Bug Report, Feedback"
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Details
            </label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your suggestions, tool idea, or feedback here..."
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Action Buttons: WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={sendViaWhatsApp}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Send via WhatsApp
            </button>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Send via Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
