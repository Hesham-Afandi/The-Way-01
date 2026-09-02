import React, { useState, useEffect } from 'react';
import {
  ArrowDownToLine,
  CheckCircle2,
  Sparkles,
  Download,
  Info
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallAppButton: React.FC<{
  className?: string;
  variant?: 'header' | 'floating' | 'sidebar' | 'banner';
}> = ({ className = '', variant = 'header' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      triggerToast('تم تثبيت التطبيق بنجاح! يمكنك فتحه الآن من شاشتك الرئيسية.');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          triggerToast('جاري تثبيت المنظومة كتطبيق مستقل...');
        }
      } catch (err) {
        console.warn('Install prompt error', err);
      }
    } else {
      // Direct instruction toast without opening any full modal dialog
      const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
      if (isIOS) {
        triggerToast('لتثبيت التطبيق على iPhone: اضغط زر المشاركة ⎋ ثم "إضافة للشاشة الرئيسية ⊕"');
      } else {
        triggerToast('انقر على رمز التثبيت (⊕ / ⬇) بشريط العنوان أعلى المتصفح لتثبيت التطبيق مباشرة');
      }
    }
  };

  if (isInstalled) {
    return null; // Don't show if already running inside installed standalone app
  }

  return (
    <>
      {/* Header Install Trigger Button */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`relative group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer border border-amber-300/40 ${className}`}
          title="تثبيت منصة The Way Center كتطبيق على هاتفك أو جهازك"
          aria-label="تثبيت التطبيق"
        >
          <div className="relative">
            <ArrowDownToLine className="w-3.5 h-3.5 animate-bounce text-amber-100 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden md:inline font-black tracking-tight">تثبيت التطبيق</span>
          <span className="md:hidden font-bold text-[11px]">تثبيت</span>
        </button>
      )}

      {/* Sidebar Install Trigger */}
      {variant === 'sidebar' && (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900/90 hover:from-amber-900/60 hover:to-slate-800/90 text-white border border-amber-500/30 transition-all text-xs font-bold cursor-pointer group shadow-sm ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <ArrowDownToLine className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-right">
              <p className="font-extrabold text-amber-200">تثبيت التطبيق</p>
              <p className="text-[10px] text-slate-400">الوصول السريع بدون متصفح</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        </button>
      )}

      {/* Lightweight non-intrusive Toast feedback (no screen takeover modal) */}
      {showToast && (
        <div
          dir="rtl"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 text-white text-xs font-bold rounded-2xl shadow-2xl border border-amber-400/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md w-11/12 sm:w-auto"
        >
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
