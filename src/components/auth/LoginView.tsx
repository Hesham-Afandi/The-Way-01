import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { TheWayLogo } from '../common/TheWayLogo';
import { InstallAppButton } from '../common/InstallAppPrompt';

export const LoginView: React.FC = () => {
  const { users, login } = useApp();

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
      className="min-h-screen w-full bg-gradient-to-br from-[#F8FAFD] via-[#EDF4FC] to-[#E3EEF9] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800 relative overflow-hidden"
      dir="rtl"
    >
      {/* Dynamic Animated Ambient Background Glows matching the logo's royal/sky blues */}
      <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar with PWA install & Status */}
      <header className="w-full max-w-5xl z-20 flex items-center justify-between py-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-700">الخادم متصل وجاهز للعمل</span>
        </div>
        <InstallAppButton variant="header" />
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl z-10 space-y-7 my-auto py-6">
        {/* Dynamic Brand Header & High-Vibrancy Logo Experience */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-xl shadow-blue-900/5 group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Dynamic Glow Halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-sky-300/30 to-indigo-400/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <TheWayLogo variant="light" size="2xl" animated={true} />
            </div>

            {/* Dynamic System Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#004D99] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>The Way Training Center • بوابة الإدارة والتحكم الأكاديمي</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg font-medium leading-relaxed">
            المنظومة السحابية الموحدة لإدارة شؤون الطلاب، المدرسين، الحصص، الحضور بالباركود، وسندات القبض
          </p>
        </div>

        {/* Main Grid: Login Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 lg:col-start-4 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/5 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#001F45] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0080DE]" />
                  <span>تسجيل الدخول للنظام</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  أدخل بيانات الحساب للمتابعة إلى لوحة التحكم
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#0070CE] border border-blue-200 text-[11px] font-bold font-mono">
                Admin Ready
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0070CE]" />
                  <span>اسم المستخدم (Username) أو البريد:</span>
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFD] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#0070CE] transition-all text-left font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#0070CE]" />
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
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8FAFD] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#0070CE] transition-all text-left font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>تختفي النقاط الثلاث تلقائياً فور النقر:</span>
                  <button
                    type="button"
                    onClick={() => setPassword('123')}
                    className="font-mono text-[#0070CE] hover:text-[#004D99] font-bold bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 transition-colors cursor-pointer"
                    title="انقر لإعادة كتابة 123"
                  >
                    123
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0080DE] via-[#0060BA] to-[#004D99] hover:from-[#0070CE] hover:to-[#013673] active:scale-[0.99] text-white font-black text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[11px] font-bold text-slate-600">
                  الحساب الرئيسي المعتمد (المدير العام):
                </p>
                <div
                  onClick={() => handleQuickLogin(users[0])}
                  className="p-3.5 rounded-2xl bg-[#F8FAFD] hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0080DE] to-[#004D99] text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 group-hover:text-[#004D99] transition-colors">
                          {users[0].name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                          المدير العام (Admin)
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        يوزر: <span className="text-[#0070CE] font-bold">{users[0].username}</span> • باسورد: <span className="text-slate-700 font-bold">{users[0].password}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-[#0070CE] group-hover:bg-[#0058A8] text-white text-xs font-bold transition-all shadow-sm"
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
        <p>The Way Training Center © 2026 • Your Way To Success • جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};
