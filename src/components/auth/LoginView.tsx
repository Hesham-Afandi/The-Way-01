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
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { TheWayLogo } from '../common/TheWayLogo';

export const LoginView: React.FC = () => {
  const { users, login, settings } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setError('بيانات الدخول غير صحيحة أو الحساب غير مفعّل. تأكد من اسم المستخدم وكلمة المرور.');
      }
    }, 300);
  };

  const handleQuickLogin = (user: User) => {
    const loginKey = user.username || user.email;
    setIdentifier(loginKey);
    setPassword(user.password || '123');
    login(loginKey, user.password || '123');
  };

  const departmentIcons: Record<string, React.ElementType> = {
    إدارة: ShieldCheck,
    ريسبشن: UserCheck,
    سيلز: FileText,
    مدرسين: GraduationCap,
    حسابات: CreditCard
  };

  const departmentColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    إدارة: {
      bg: 'bg-rose-50 hover:bg-rose-100/80',
      text: 'text-rose-900',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800'
    },
    ريسبشن: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/80',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    سيلز: {
      bg: 'bg-amber-50 hover:bg-amber-100/80',
      text: 'text-amber-900',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800'
    },
    مدرسين: {
      bg: 'bg-blue-50 hover:bg-blue-100/80',
      text: 'text-blue-900',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    },
    حسابات: {
      bg: 'bg-cyan-50 hover:bg-cyan-100/80',
      text: 'text-cyan-900',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800'
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#090D16] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-100 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background Subtle Gradient Glows */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl z-10 space-y-8 my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <TheWayLogo variant="white" size="xl" />
          <p className="text-xs sm:text-sm text-slate-400 max-w-md pt-1 font-medium">
            نظام إدارة وتدريب شامل للمركز التعليمي، الطلاب، المدرسين، وسندات الدفع
          </p>
        </div>

        {/* Main Grid: Form on Right / Quick Roles on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Login Form Box (5 cols) */}
          <div className="lg:col-span-5 bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>تسجيل الدخول للنظام</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                سجّل الدخول بحساب موظف للوصول إلى لوحة الاختصاصات
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>اسم المستخدم (Username) أو البريد:</span>
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin / reception / sales / teacher / accountant"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>كلمة المرور (Password):</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-left font-mono"
                  required
                />
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>كلمة المرور الافتراضية للجميع:</span>
                  <span className="font-mono text-blue-400 font-bold bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">123</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 text-center">
              <p className="font-semibold text-slate-300">إدارة المستخدمين والصلاحيات:</p>
              <p className="text-slate-500">
                تسجيل الدخول بحساب الأدمن (ولاء حمدان) يتيح تعديل وتوليد موظفين جدد وكلمات المرور الخاصة بهم.
              </p>
            </div>
          </div>

          {/* Quick 1-Click Role Accounts Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>دخول تجريبي سريع بحسابات الأقسام المعتمدة:</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  انقر على أي بطاقة لتسجيل الدخول الفوري بحساب الموظف:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {users.map(user => {
                const Icon = departmentIcons[user.department] || Users;
                const colors = departmentColors[user.department] || departmentColors['إدارة'];

                return (
                  <div
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className="p-4 rounded-3xl bg-[#0F172A]/70 hover:bg-[#1E293B]/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 text-blue-400 border border-slate-700/80 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                            {user.name}
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${colors.badge} ${colors.border}`}
                          >
                            قسم: {user.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {user.departmentDescription || 'عضو في طاقم عمل The Way Center'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                          <span className="text-blue-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                            يوزر: {user.username || user.email.split('@')[0]}
                          </span>
                          <span className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                            باسورد: {user.password || '123'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 self-end sm:self-center shadow-xs"
                    >
                      <span>دخول كـ {user.department}</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Department Rules Legend */}
            <div className="p-4 rounded-3xl bg-[#0F172A]/50 border border-slate-800 text-xs text-slate-400 space-y-2.5">
              <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>صلاحيات واختصاصات أقسام The Way Center:</span>
              </h5>
              <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed pr-1">
                <li>
                  <strong className="text-white">الأدمن (ولاء حمدان):</strong> الصلاحيات الكاملة للتحكم في كافة الأقسام، التقارير، إضافة مستخدمين وباسوردات جديدة وإعدادات المركز.
                </li>
                <li>
                  <strong className="text-blue-400">المعلم (أ. محمد هشام):</strong> إدارة حصص الرياضيات والفيزياء، تسجيل الحضور لطلابه والملاحظات والواجبات.
                </li>
                <li>
                  <strong className="text-emerald-400">الريسبشن (منى إبراهيم):</strong> شؤون الطلاب، مسح QR الحضور والغياب، جدولة الحصص، ومتابعة القاعات.
                </li>
                <li>
                  <strong className="text-amber-400">السيلز (أحمد طارق):</strong> العقود والاشتراكات، تسجيل الطلاب بالباقات، وسندات القبض.
                </li>
                <li>
                  <strong className="text-cyan-400">الحسابات (سامح محمود):</strong> تحصيل الرسوم، سندات القبض، صرف مستحقات المدرس، والتقارير المالية.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
