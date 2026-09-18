import React, { useState, useEffect } from 'react';
import { Download, X, WifiOff, Wifi, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ZubwareLogo } from './ZubwareLogo';

export const InstallBanner: React.FC = () => {
  const { t } = useLanguage();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showNetworkNotice, setShowNetworkNotice] = useState<boolean>(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Online/Offline network monitoring
    const handleOnline = () => {
      setIsOffline(false);
      setShowNetworkNotice(true);
      setTimeout(() => setShowNetworkNotice(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowNetworkNotice(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Network Status Badge Toast */}
      <AnimatePresence>
        {(isOffline || showNetworkNotice) && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-18 right-4 z-50 px-4 py-2.5 rounded-2xl backdrop-blur-xl border font-bold text-xs shadow-xl flex items-center gap-2.5 transition-all ${
              isOffline
                ? 'bg-amber-500/90 text-slate-950 border-amber-400'
                : 'bg-emerald-500/90 text-white border-emerald-400'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('offlineNotice', 'Offline Mode — Local tools remain 100% active!')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('onlineNotice', 'Online Connection Restored!')}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Smart Install Banner */}
      <AnimatePresence>
        {showInstallBanner && deferredPrompt && (
          <motion.div
            role="region"
            aria-label="PWA Application Installation Notice"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/30 dark:border-indigo-500/20 shadow-2xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ZubwareLogo className="w-10 h-10 rounded-2xl shadow-md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{t('installApp', 'Install Zubware App')}</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('installAppDesc', 'Get 100% offline access, desktop shortcuts, and zero load delays.')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallBanner(false)}
                aria-label="Close install prompt"
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstallClick}
                aria-label="Install Zubware App Now"
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('installNow', 'Install App Now')}</span>
              </motion.button>
              <button
                onClick={() => setShowInstallBanner(false)}
                aria-label="Dismiss app install prompt"
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                {t('maybeLater', 'Dismiss')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
