import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  QrCode,
  Clock,
  Menu,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Users,
  UserCheck,
  Edit3,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatArabicDate } from '../../utils/formatters';
import { UserRole } from '../../types';
import { TheWayLogo } from '../common/TheWayLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenQRScanner: () => void;
  onOpenAddSession: () => void;
  onOpenAddStudent: () => void;
  onOpenEditProfile?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenQRScanner,
  onOpenAddSession,
  onOpenAddStudent,
  onOpenEditProfile,
  onToggleSidebar
}) => {
  const {
    settings,
    currentUser,
    setCurrentUser,
    users,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentTime,
    setActiveTab,
    sessions,
    logout,
    canEditSection,
    theme,
    toggleTheme
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const liveSessionsCount = sessions.filter(
    s => s.status === 'live' || (s.date === todayStr && s.status === 'scheduled')
  ).length;

  const roleBadges: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    [UserRole.ADMIN]: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    [UserRole.RECEPTION]: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    [UserRole.SALES]: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    [UserRole.TEACHER]: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    [UserRole.ACCOUNTANT]: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  };

  const canAddStudent = canEditSection('students');
  const canAddSession = canEditSection('sessions');
  const canScanQR = canEditSection('attendance');

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-6 py-3 shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Right side: Mobile Menu Button & Center Title / Live Time */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:block lg:hidden">
              <TheWayLogo size="sm" showSlogan={false} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {settings.centerName}
                </h1>
                {liveSessionsCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {liveSessionsCount} حصص نشطة
                  </span>
                )}
              </div>

              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatArabicDate(todayStr)}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {currentTime.toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800">
                  قسم {currentUser.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Trigger (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-2xl border border-slate-200/80 dark:border-slate-700 transition-all group shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span>البحث السريع في الطلاب، الحصص، العقود، أو سندات القبض...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-md border border-slate-300 dark:border-slate-600 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Left side: Action Buttons, Mobile Search, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="بحث شامل"
            aria-label="بحث شامل"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title={theme === 'dark' ? 'تفعيل الوضع النهاري (Light)' : 'تفعيل الوضع الليلي (Dark Mode)'}
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-700" />}
          </button>

          {/* Quick QR Scanner Button */}
          {canScanQR && (
            <button
              onClick={onOpenQRScanner}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100/80 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200/70 dark:border-indigo-800 transition-all shadow-2xs cursor-pointer"
              title="مسح كود الحضور بالباركود"
            >
              <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">مسح QR</span>
            </button>
          )}

          {/* Quick Add Session Button */}
          {canAddSession && (
            <button
              onClick={onOpenAddSession}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300/70 dark:border-slate-700 transition-all cursor-pointer"
              title="جدولة حصة جديدة"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">جدولة حصة</span>
            </button>
          )}

          {/* Quick Add Student Button */}
          {canAddStudent && (
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              title="تسجيل طالب جديد"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">طالب جديد</span>
            </button>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-white">التنبيهات والإشعارات</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full text-[10px] font-bold">
                        {unreadCount} غير مقروء
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">لا توجد إشعارات حالياً</div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setActiveTab('notifications');
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-right hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                          !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {notif.priority === 'high' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold py-1 cursor-pointer"
                  >
                    فتح مركز الإشعارات بالكامل →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Switch Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
            >
              {currentUser.avatar ? (
                <div className="w-8 h-8 rounded-2xl overflow-hidden border border-indigo-300 dark:border-indigo-700 shadow-xs shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </p>
                <span className={`text-[10px] font-semibold ${roleBadges[currentUser.role]}`}>
                  {currentUser.department}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Details & Switch Account Dropdown */}
            {showUserMenu && (
              <div className="absolute left-0 sm:left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    {currentUser.avatar ? (
                      <div className="w-11 h-11 rounded-2xl overflow-hidden border border-indigo-300 dark:border-indigo-700 shadow-xs shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                        {currentUser.phone || 'بدون هاتف مسجل'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      قسم: {currentUser.department}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700">
                      يوزر: {currentUser.username || 'admin'}
                    </span>
                  </div>

                  {/* Edit Profile Quick Trigger */}
                  {onOpenEditProfile && (
                    <button
                      onClick={() => {
                        onOpenEditProfile();
                        setShowUserMenu(false);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل الملف الشخصي والصورة</span>
                    </button>
                  )}
                </div>

                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 px-2 py-1">تبديل حساب موظف سريع:</p>
                  <div className="space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          currentUser.id === u.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {u.name.charAt(0)}
                          </span>
                          <span className="truncate">{u.name}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md shrink-0">
                          {u.department}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج من الحساب</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
