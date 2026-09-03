import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowDownToLine,
  CheckCircle2,
  Sparkles,
  Share2,
  PlusSquare,
  X,
  Smartphone,
  Laptop,
  Check,
  Download,
  ExternalLink
} from 'lucide-react';
import { TheWayLogo } from './TheWayLogo';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    deferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const InstallAppButton: React.FC<{
  className?: string;
  variant?: 'header' | 'floating' | 'sidebar' | 'banner';
}> = ({ className = '', variant = 'header' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    typeof window !== 'undefined' ? window.deferredInstallPrompt || null : null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);
  const [platformType, setPlatformType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
  };

  useEffect(() => {
    // Detect OS / Platform
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setPlatformType('ios');
      } else if (/android/.test(ua)) {
        setPlatformType('android');
      } else {
        setPlatformType('desktop');
      }
    }

    // Check if running in standalone mode (already installed)
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Check if global prompt already captured
    if (typeof window !== 'undefined' && window.deferredInstallPrompt) {
      setDeferredPrompt(window.deferredInstallPrompt);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.deferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePwaReady = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeInstallPromptEvent>;
      if (customEvent.detail) {
        setDeferredPrompt(customEvent.detail);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredInstallPrompt = null;
      setShowInstallGuideModal(false);
      triggerToast('تم تثبيت تطبيق The Way Training Center بنجاح!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('theway:pwa-ready', handlePwaReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('theway:pwa-installed', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('theway:pwa-ready', handlePwaReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('theway:pwa-installed', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    // 1. If on iOS (iPhone / iPad), show Safari Home Screen installation guide
    if (platformType === 'ios') {
      setShowInstallGuideModal(true);
      return;
    }

    // 2. Check if inside an iframe (e.g. AI Studio preview)
    const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;
    if (isInsideIframe) {
      // In iframes, browsers disallow calling prompt(). Open in a full browser tab with auto install prompt
      const fullUrl = new URL(window.location.href);
      fullUrl.searchParams.set('install', 'true');
      window.open(fullUrl.toString(), '_blank');
      triggerToast('جاري فتح التطبيق في نافذة مخصصة لإتمام التثبيت الفوري...');
      return;
    }

    // 3. If native prompt event is available in top level window
    const activePrompt = deferredPrompt || (typeof window !== 'undefined' ? window.deferredInstallPrompt : null);

    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choice = await activePrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          if (typeof window !== 'undefined') {
            window.deferredInstallPrompt = null;
          }
          triggerToast('تم تثبيت المنظومة بنجاح!');
        }
        return;
      } catch (err) {
        console.warn('Install prompt execution:', err);
      }
    }

    // 4. If prompt is not available yet (browser requires manual menu or unsupported), show quick guide modal
    setShowInstallGuideModal(true);
  }, [deferredPrompt, platformType]);

  if (isInstalled) {
    return null; // Suppress button when already installed
  }

  return (
    <>
      {/* Header Install Button */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`relative group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer border border-amber-300/40 ${className}`}
          title="تثبيت منصة The Way Center كتطبيق مستقل على هاتفك أو جهازك"
          aria-label="تثبيت التطبيق"
        >
          <div className="relative flex items-center justify-center">
            <ArrowDownToLine className="w-3.5 h-3.5 animate-bounce text-amber-100 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden md:inline font-black tracking-tight">تثبيت التطبيق</span>
          <span className="md:hidden font-bold text-[11px]">تثبيت</span>
        </button>
      )}

      {/* Sidebar Install Button */}
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
              <p className="text-[10px] text-slate-400">تطبيق سريع بدون متصفح</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        </button>
      )}

      {/* Interactive Install Guide Modal (iOS, Android, & Desktop Fallback) */}
      {showInstallGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            dir="rtl"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <TheWayLogo variant="light" size="sm" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    تثبيت تطبيق The Way Center
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">منظومة المركز التعليمي الرسمية</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuideModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* iOS Instructions */}
            {platformType === 'ios' && (
              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200">
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  لتثبيت المنظومة كتطبيق أصيل على جهاز iPhone أو iPad الخاص بك:
                </p>
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-0.5">1. اضغط زر المشاركة (Share)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">في شريط أدوات Safari أسفل أو أعلى الشاشة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-0.5">2. اختر "إضافة إلى الشاشة الرئيسية"</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">(Add to Home Screen ⊕)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Android / Desktop Instructions */}
            {platformType !== 'ios' && (
              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950 dark:text-amber-200 text-xs">تثبيت فوري على جهازك</p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      يمكنك تشغيل التطبيق في نافذة مستقلة وبدون أشرطة المتصفح
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                    <span>انقر على قائمة المتصفح (⋮) أو رمز التثبيت (⊕) بشريط العنوان</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                    <span>اختر <b>تثبيت تطبيق The Way Center</b> (Install App)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const fullUrl = new URL(window.location.href);
                    fullUrl.searchParams.set('install', 'true');
                    window.open(fullUrl.toString(), '_blank');
                    setShowInstallGuideModal(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح التطبيق في نافذة كاملة للتثبيت</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowInstallGuideModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Non-intrusive Feedback Toast */}
      {showSuccessToast && (
        <div
          dir="rtl"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 text-white text-xs font-bold rounded-2xl shadow-2xl border border-amber-400/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md w-11/12 sm:w-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
