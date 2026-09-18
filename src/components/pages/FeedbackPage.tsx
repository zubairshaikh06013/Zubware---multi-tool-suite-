import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { saveFeedback, getFeedbackList, exportFeedbackJSON, FeedbackRecord } from '../../lib/userStore';
import { MessageSquare, Star, Download, Send, CheckCircle2, History, Phone, Mail, MessageCircle } from 'lucide-react';

interface FeedbackPageProps {
  onShowToast: (msg: string) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onShowToast }) => {
  const { t } = useLanguage();

  const [type, setType] = useState<'bug' | 'feature' | 'general' | 'praise'>('feature');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackRecord[]>(() => getFeedbackList());

  const getFormattedFeedbackText = () => {
    const categoryName = type === 'feature' ? 'New Feature / Tool Request' : type === 'bug' ? 'Bug Report' : type === 'praise' ? 'Appreciation / Review' : 'General Feedback';
    return `Hi Zubair! 👋\n\n📌 Category: ${categoryName}\n⭐ Rating: ${rating}/5\n\n💬 Message:\n${message || 'I have feedback/suggestion for Zubware.'}\n\nSent from Zubware.com`;
  };

  const handleSendWhatsApp = () => {
    if (!message.trim()) {
      onShowToast(t('enterMessage', 'Please enter your message or feature request'));
      return;
    }
    saveFeedback({ type, rating, message: message.trim() });
    setFeedbackHistory(getFeedbackList());
    
    const text = getFormattedFeedbackText();
    const whatsappUrl = `https://wa.me/918791209511?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    onShowToast('Opening WhatsApp to send directly to Zubair...');
  };

  const handleSendEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) {
      onShowToast(t('enterMessage', 'Please enter your message or feature request'));
      return;
    }
    saveFeedback({ type, rating, message: message.trim() });
    setFeedbackHistory(getFeedbackList());

    const categoryName = type === 'feature' ? 'New Feature Request' : type === 'bug' ? 'Bug Report' : 'User Feedback';
    const mailtoUrl = `mailto:zubairshaikh06013@gmail.com?subject=${encodeURIComponent(`[Zubware] ${categoryName}`)}&body=${encodeURIComponent(getFormattedFeedbackText())}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
    onShowToast('Opening email client to send to Zubair...');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      
      {/* Title Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mx-auto">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Feedback & Feature Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Want a new tool added or found a bug? Send your request directly to Zubair Shaikh via WhatsApp or Email.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="https://wa.me/918791209511?text=Hi%20Zubair,%20I%20want%20to%20suggest%20a%20new%20tool%20for%20Zubware"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-4 rounded-2xl flex items-center gap-3.5 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Direct Chat
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              WhatsApp: +91 87912 09511
            </p>
          </div>
        </a>

        <a
          href="mailto:zubairshaikh06013@gmail.com?subject=Zubware%20Feedback"
          className="glass-card p-4 rounded-2xl flex items-center gap-3.5 hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Direct Email
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              zubairshaikh06013@gmail.com
            </p>
          </div>
        </a>
      </div>

      {/* Feedback Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your feedback has been prepared and sent directly to Zubair Shaikh. A copy has also been saved to your local history below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { setSubmitted(false); setMessage(''); }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Send Another Message
              </button>
              <button
                onClick={() => exportFeedbackJSON()}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'feature', label: '💡 New Tool Request' },
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'general', label: '💬 General Feedback' },
                  { id: 'praise', label: '❤️ Appreciation' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      type === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'glass-card border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Your Suggestion / Feature Request / Issue
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the tool you want added, feature improvements, or any problem you experienced..."
                className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/50 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Action Buttons to send to Zubair */}
            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Choose how to send your message to Zubair Shaikh:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp (+91 87912 09511)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendEmail()}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Local Feedback History Table */}
      {feedbackHistory.length > 0 && (
        <section className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('localFeedbackHistory', 'Saved Local Feedback Records')}</span>
            </h2>
            <button
              onClick={() => exportFeedbackJSON()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {feedbackHistory.map((fb) => (
              <div key={fb.id} className="glass-card p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                    {fb.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{fb.rating}/5</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-2">
                      {new Date(fb.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {fb.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
