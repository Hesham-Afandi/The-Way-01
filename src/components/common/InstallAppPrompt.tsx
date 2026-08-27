import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  Share2,
  PlusSquare,
  X,
  Sparkles,
  ArrowDownToLine,
  ExternalLink,
  ShieldCheck
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

export const InstallAppButton: React.FC<{
  className?: string;
  variant?: 'header' | 'floating' | 'sidebar' | 'banner';
}> = ({ className = '', variant = 'header' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error', err);
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (isInstalled) {
    return null; // Don't show if already running inside installed standalone app
  }

  return (
    <>
      {/* Header Install Trigger Button with pulsating arrow */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`relative group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-black shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all cursor-pointer border border-blue-400/40 ${className}`}
          title="تثبيت منصة The Way Center كتطبيق على هاتفك أو جهازك"
          aria-label="تثبيت التطبيق"
        >
          {/* Animated Install Arrow Icon */}
          <div className="relative">
            <ArrowDownToLine className="w-4 h-4 animate-bounce text-sky-200 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden md:inline font-black tracking-tight">تثبيت التطبيق</span>
          <span className="md:hidden font-bold text-[11px]">تثبيت</span>
        </button>
      )}

      {/* Sidebar Install Trigger */}
      {variant === 'sidebar' && (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800/80 hover:to-indigo-800/80 text-white border border-blue-500/30 transition-all text-xs font-bold cursor-pointer group shadow-sm ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <ArrowDownToLine className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-right">
              <p className="font-extrabold text-white">تثبيت التطبيق</p>
              <p className="text-[10px] text-blue-200">الوصول السريع بدون متصفح</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Instructions Modal if direct prompt not available or for iOS/Desktop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          dir="rtl"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-right relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Ambient Accent */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

            <div className="flex items-start justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800 shrink-0">
                  <Download className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    تثبيت منصة The Way Center
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    احصل على تجربة سريعة وتطبيق مستقل على شاشتك الرئيسية
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">⚡ سرعة فائقة</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">فتح بلمسة واحدة</span>
              </div>
              <div className="space-y-1 border-x border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">📱 شاشة كاملة</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">بدون شريط المتصفح</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">🔒 أمان عالي</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">حفظ تلقائي للبيانات</span>
              </div>
            </div>

            {/* Step-by-Step Guides per device */}
            <div className="space-y-4">
              {isIOS ? (
                /* iOS Instructions (Safari) */
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>طريقة التثبيت على أجهزة iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-2 pr-2 list-decimal list-inside font-medium leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span>1. اضغط على زر المشاركة</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]">
                        <Share2 className="w-3 h-3 text-blue-500" /> مشاركة (Share)
                      </span>
                      <span>في أسفل المتصفح.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>2. مرر للأسفل واختر</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold">
                        <PlusSquare className="w-3 h-3 text-emerald-500" /> إضافة للشاشة الرئيسية (Add to Home Screen)
                      </span>
                    </li>
                    <li>3. اضغط على <strong>إضافة (Add)</strong> في أعلى الزاوية.</li>
                  </ol>
                </div>
              ) : (
                /* Android / Chrome / Windows / Mac Instructions */
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2.5">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-xs">
                      <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>على هواتف Android (Chrome / Edge):</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      اضغط على قائمة المتصفح (الثلاث نقاط <strong>⋮</strong>) ثم اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold text-xs">
                      <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>على الكمبيوتر أو اللابتوب (Windows / Mac):</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      انقر على رمز التثبيت <Download className="w-3.5 h-3.5 inline text-blue-500 mx-1" /> الموجود في شريط العنوان (URL) بأعلى متصفح Chrome أو Edge لتثبيته كتطبيق مستقل.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Action or Close */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>تثبيت الآن فوراً</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
