import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Check,
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  DollarSign,
  CreditCard,
  Calendar,
  FileText
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User, UserRole } from '../../../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit
}) => {
  const { addUser, updateUser, teachers, addToast } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [salary, setSalary] = useState<string>('5000');
  const [salaryType, setSalaryType] = useState<'monthly' | 'hourly' | 'per_session' | 'commission'>('monthly');
  const [joinedDate, setJoinedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [department, setDepartment] = useState<'إدارة' | 'ريسبشن' | 'سيلز' | 'مدرسين' | 'حسابات'>('ريسبشن');
  const [teacherId, setTeacherId] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setUsername(userToEdit.username || userToEdit.email.split('@')[0]);
      setPassword(userToEdit.password || '123');
      setEmail(userToEdit.email || '');
      setPhone(userToEdit.phone || '');
      setNationalId(userToEdit.nationalId || '');
      setSalary(userToEdit.salary ? String(userToEdit.salary) : '5000');
      setSalaryType(userToEdit.salaryType || 'monthly');
      setJoinedDate(userToEdit.joinedDate || new Date().toISOString().split('T')[0]);
      setNotes(userToEdit.notes || '');
      setDepartment(userToEdit.department);
      setTeacherId(userToEdit.teacherId || '');
      setIsActive(userToEdit.isActive);
    } else {
      setName('');
      setUsername('');
      setPassword('123');
      setEmail('');
      setPhone('');
      setNationalId('');
      setSalary('5000');
      setSalaryType('monthly');
      setJoinedDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setDepartment('ريسبشن');
      setTeacherId('');
      setIsActive(true);
    }
    setErrors({});
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const departmentMeta: Record<
    'إدارة' | 'ريسبشن' | 'سيلز' | 'مدرسين' | 'حسابات',
    { role: UserRole; title: string; desc: string; boards: string[]; color: string }
  > = {
    إدارة: {
      role: UserRole.ADMIN,
      title: 'إدارة السنتر والمدير العام',
      desc: 'صلاحيات كاملة للاطلاع والتعديل والإضافة والحذف في كافة الأقسام والإعدادات والمستخدمين',
      boards: ['كافة الأقسام واللوحات بدون استثناء'],
      color: 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
    },
    ريسبشن: {
      role: UserRole.RECEPTION,
      title: 'الريسبشن والاستقبال',
      desc: 'تسجيل الطلاب، الحصص والجداول، مسح باركود الـ QR، تسجيل الحضور، وتنظيم القاعات',
      boards: ['السنتر الآن', 'الطلاب', 'الحصص والجداول', 'تسجيل الحضور', 'القاعات والمعامل'],
      color: 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
    },
    سيلز: {
      role: UserRole.SALES,
      title: 'المبيعات والاشتراكات (Sales)',
      desc: 'إدارة باقات الحصص والعقود والاشتراكات، تسجيل الطلاب الجدد، وإصدار سندات القبض',
      boards: ['السنتر الآن', 'الطلاب', 'العقود والاشتراكات', 'المدفوعات وسندات القبض'],
      color: 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
    },
    مدرسين: {
      role: UserRole.TEACHER,
      title: 'طاقم التدريس',
      desc: 'الاطلاع على جدول الحصص الخاص بالمدرس، تسجيل حضور وغياب طلاب مجموعته',
      boards: ['السنتر الآن', 'الحصص والجداول (حصص المدرس)', 'تسجيل الحضور'],
      color: 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
    },
    حسابات: {
      role: UserRole.ACCOUNTANT,
      title: 'المحاسبة والمالية',
      desc: 'سندات القبض والتحصيل، مستحقات المدرسين، متابعة العقود والتقارير المالية',
      boards: ['السنتر الآن', 'المدفوعات وسندات القبض', 'مستحقات المدرسين', 'العقود', 'التقارير المالية'],
      color: 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200'
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'يرجى إدخال اسم الموظف';
    if (!username.trim()) {
      errs.username = 'يرجى إدخال اسم المستخدم (للدخول)';
    } else if (username.length < 3) {
      errs.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    }
    if (!password.trim()) errs.password = 'يرجى إدخال كلمة المرور';
    if (!phone.trim()) errs.phone = 'يرجى إدخال رقم الهاتف';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedMeta = departmentMeta[department];
    const generatedEmail = email.trim() || `${username.trim().toLowerCase()}@theway.com`;
    const numericSalary = salary ? parseFloat(salary) : 0;

    if (userToEdit) {
      updateUser(userToEdit.id, {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        email: generatedEmail,
        phone: phone.trim(),
        nationalId: nationalId.trim(),
        salary: numericSalary,
        salaryType,
        joinedDate,
        notes: notes.trim(),
        department,
        role: userToEdit.role === UserRole.SUPER_ADMIN ? UserRole.SUPER_ADMIN : selectedMeta.role,
        departmentDescription: selectedMeta.desc,
        teacherId: department === 'مدرسين' ? teacherId || undefined : undefined,
        isActive
      });
      addToast({
        type: 'success',
        title: 'تم تحديث بيانات الموظف ✓',
        message: `تم حفظ بيانات ${name.trim()} بنجاح`
      });
    } else {
      addUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        email: generatedEmail,
        phone: phone.trim(),
        nationalId: nationalId.trim(),
        salary: numericSalary,
        salaryType,
        joinedDate,
        notes: notes.trim(),
        department,
        role: selectedMeta.role,
        departmentDescription: selectedMeta.desc,
        teacherId: department === 'مدرسين' ? teacherId || undefined : undefined,
        isActive
      });
      addToast({
        type: 'success',
        title: 'تمت إضافة الموظف الجديد بنجاح ✓',
        message: `تم إنشاء حساب (${username.trim()}) في قسم (${department})`
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">
                {userToEdit ? 'تعديل بيانات وصلاحيات وراتب الموظف' : 'إضافة موظف ومستخدم جديد بالنظام'}
              </h3>
              <p className="text-xs text-indigo-200">
                تسجيل اسم المستخدم وكلمة المرور والقسم والراتب والمستحقات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Department / Specialty Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>القسم / التخصص الوظيفي:</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(['إدارة', 'ريسبشن', 'سيلز', 'مدرسين', 'حسابات'] as const).map(dept => {
                const isSelected = department === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDepartment(dept)}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30 font-black text-indigo-950 dark:text-indigo-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs">{dept}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {dept === 'إدارة' ? 'كامل الأقسام' : dept === 'ريسبشن' ? 'شؤون الطلاب والحضور' : dept === 'سيلز' ? 'العقود والمدفوعات' : dept === 'مدرسين' ? 'حصصه والتحضير' : 'الماليات والتقارير'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Department Access Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">اللوحات المصرح بالدخول إليها:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {department}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {departmentMeta[department].boards.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User Credentials (Username & Password) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/60 space-y-4">
            <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>بيانات الدخول للنظام (اسم المستخدم وكلمة المرور)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسم المستخدم للدخول (Username): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                  placeholder="مثال: ahmed_reception أو mona"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-mono text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
                {errors.username && (
                  <p className="text-[11px] text-rose-500 font-semibold">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور (Password): <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-mono text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-500 font-semibold">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم الموظف الكامل: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="الاسم ثلاثي أو رباعي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                رقم الهاتف / الواتساب: <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-mono text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.phone}</p>
              )}
            </div>

            {/* National ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                الرقم القومي / الهوية:
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
                placeholder="14 رقم"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-mono text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                البريد الإلكتروني (اختياري):
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@theway.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-mono text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Salary & Financial Compensation Section */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/50 space-y-4">
            <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>الراتب والبدلات المالية</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Salary Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نظام الراتب:</label>
                <select
                  value={salaryType}
                  onChange={e => setSalaryType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                >
                  <option value="monthly">راتب شهري ثابت</option>
                  <option value="per_session">أجر لكل حصة</option>
                  <option value="hourly">أجر بالساعة</option>
                  <option value="commission">نسبة مئوية / عمولة</option>
                </select>
              </div>

              {/* Salary Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  قيمة الراتب / الأجر (ج.م):
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Hire Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تاريخ التعيين:</label>
                <input
                  type="date"
                  value={joinedDate}
                  onChange={e => setJoinedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Teacher Linkage if department is teachers */}
          {department === 'مدرسين' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ربط الحساب بملف مدرس معتمد:
              </label>
              <select
                value={teacherId}
                onChange={e => setTeacherId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="">-- بدون ربط أو إنشاء جديد --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ملاحظات إضافية:</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="أي ملاحظات حول الوظيفة أو شروط العمل..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="user-active-status"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="user-active-status" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              حساب مفعل (يسمح للموظف بتسجيل الدخول إلى لوحة قسمه في The Way Center)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {userToEdit ? 'حفظ التعديلات' : 'إنشاء حساب الموظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
