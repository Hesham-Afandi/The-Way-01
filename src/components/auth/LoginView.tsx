import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Users,
  UserCheck,
  AlertCircle,
  FileText,
  CreditCard,
  GraduationCap,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { TheWayLogo } from '../common/TheWayLogo';
import { InstallAppButton } from '../common/InstallAppPrompt';

export const LoginView: React.FC = () => {
  const { users, login, settings } = useApp();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear default 3 dots ('123') immediately on focus, click, or touch
  const handlePasswordClearOnInteraction = () => {
    if (password === '123' || password === '•••') {
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('يرجى إدخال اسم المستخدم (Username) أو البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(identifier.trim(), password);
      setIsLoading(false);
      if (!success) {
        setError('بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور.');
      }
    }, 250);
  };

  const handleQuickLogin = (user: User) => {
    const loginKey = user.username || user.email;
    setIdentifier(loginKey);
    setPassword(user.password || '123');
    login(loginKey, user.password || '123');
  };

  return (
    <div
      className="min-h-screen w-full bg-[#080C16] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-100 relative overflow-hidden"
      dir="rtl"
    >
      {/* Dynamic Animated Ambient Background Glows */}
      <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar with PWA install & Status */}
      <header className="w-full max-w-5xl z-20 flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-slate-300">الخادم متصل وجاهز</span>
        </div>
        <InstallAppButton variant="header" />
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl z-10 space-y-7 my-auto py-6">
        {/* Dynamic Brand Header & High-Vibrancy Logo Experience */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative inline-flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-950/60 group transition-all duration-300 hover:border-blue-400/60 hover:shadow-blue-600/20">
            {/* Dynamic Glow Halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 via-sky-400/30 to-indigo-600/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <TheWayLogo variant="white" size="2xl" animated={true} />
            </div>

            {/* Dynamic System Badge */}
            <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-600/50 text-xs font-bold text-sky-200 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Way Training Center • بوابة الإدارة والتحكم الأكاديمي</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg font-medium leading-relaxed">
            المنظومة السحابية الموحدة لإدارة شؤون الطلاب، المدرسين، الحصص، الحضور بالباركود، وسندات القبض
          </p>
        </div>

        {/* Main Grid: Form on Right / Quick Admin on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Login Form Box */}
          <div className="lg:col-span-6 lg:col-start-4 bg-[#0F172A]/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>تسجيل الدخول للنظام</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أدخل بيانات الحساب للمتابعة إلى لوحة التحكم
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-bold font-mono">
                Admin Ready
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>اسم المستخدم (Username) أو البريد:</span>
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-2xl bg-[#090D16] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>كلمة المرور (Password):</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={handlePasswordClearOnInteraction}
                    onClick={handlePasswordClearOnInteraction}
                    onMouseDown={handlePasswordClearOnInteraction}
                    onTouchStart={handlePasswordClearOnInteraction}
                    placeholder="أدخل كلمة المرور..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#090D16] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span className="text-slate-400">تختفي النقاط الثلاث تلقائياً فور النقر:</span>
                  <button
                    type="button"
                    onClick={() => setPassword('123')}
                    className="font-mono text-blue-400 hover:text-blue-300 font-bold bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-700 transition-colors cursor-pointer"
                    title="انقر لإعادة كتابة 123"
                  >
                    123
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:from-blue-800 text-white font-black text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول والمتابعة</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Admin Access Card */}
            {users.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <p className="text-[11px] font-bold text-slate-300">
                  الحساب الرئيسي المعتمد (المدير العام):
                </p>
                <div
                  onClick={() => handleQuickLogin(users[0])}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-blue-950/40 border border-slate-700/80 hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {users[0].name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-extrabold border border-rose-500/30">
                          المدير العام (Admin)
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        يوزر: <span className="text-blue-300">{users[0].username}</span> • باسورد: <span className="text-slate-300">{users[0].password}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-blue-600/80 group-hover:bg-blue-600 text-white text-xs font-bold transition-all"
                  >
                    دخول سريع
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl z-10 text-center py-3 text-xs text-slate-500">
        <p>The Way Training Center © 2026 • جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};
