import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  Radio,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileWarning,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus,
  QrCode,
  DoorOpen,
  UserX,
  Sparkles,
  History,
  UserPlus,
  FileText,
  DollarSign,
  Filter,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import { formatCurrency, formatTime12h, calculateAttendancePercentage } from '../../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface DashboardViewProps {
  onOpenAddSession: () => void;
  onOpenAddStudent: () => void;
  onOpenAddPayment?: () => void;
  onOpenQRScanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddSession,
  onOpenAddStudent,
  onOpenAddPayment,
  onOpenQRScanner
}) => {
  const {
    students,
    teachers,
    sessions,
    attendance,
    contracts,
    payments,
    subjects,
    rooms,
    notifications,
    auditLogs,
    studentsMap,
    teachersMap,
    subjectsMap,
    roomsMap,
    setActiveTab,
    setSelectedStudentId,
    completeSession,
    settings,
    currentUser
  } = useApp();

  const [auditFilterDept, setAuditFilterDept] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated KPI stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalTeachers = teachers.length;

  const todaySessions = sessions.filter(s => s.date === todayStr);
  const liveSessions = sessions.filter(s => s.status === 'live');
  const upcomingTodaySessions = todaySessions.filter(s => s.status === 'scheduled');

  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const todayAttendanceRate = calculateAttendancePercentage(todayAttendance);
  const absentStudentsCount = todayAttendance.filter(a => a.status === 'absent').length;

  // Financial stats
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalContractValue = contracts.reduce((acc, c) => acc + c.totalPrice, 0);
  const totalOutstanding = Math.max(0, totalContractValue - totalRevenue);

  // Contracts alert stats
  const expiringContractsCount = contracts.filter(
    c => c.status === 'expiring_soon' || (c.status === 'active' && c.totalSessions - c.usedSessions <= 3)
  ).length;

  // Chart Data: Students per Subject
  const studentsBySubjectData = subjects.map(sub => {
    const count = students.filter(st => st.subjectIds.includes(sub.id)).length;
    return { name: sub.name.split(' ')[0], full: sub.name, count };
  });

  // Chart Data: Sessions by Teacher
  const sessionsByTeacherData = teachers.map(tch => {
    const count = sessions.filter(s => s.teacherId === tch.id).length;
    return { name: tch.name.split(' ')[1] || tch.name, count };
  });

  // Filtered Audit / Changes Feed
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (auditFilterDept === 'all') return true;
      if (auditFilterDept === 'students' && (log.entityType === 'student' || log.details.includes('طالب'))) return true;
      if (auditFilterDept === 'payments' && (log.entityType === 'payment' || log.details.includes('سند') || log.details.includes('دفعة'))) return true;
      if (auditFilterDept === 'contracts' && (log.entityType === 'contract' || log.details.includes('عقد'))) return true;
      if (auditFilterDept === 'attendance' && (log.entityType === 'attendance' || log.details.includes('حضور'))) return true;
      return true;
    }).slice(0, 10);
  }, [auditLogs, auditFilterDept]);

  return (
    <div className="space-y-6 text-right">
      {/* Top Banner & Quick Shortcuts */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>نظام الإدارة المركزي المتكامل • {settings.centerName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            مرحباً، {currentUser.name} (قسم {currentUser.department})
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
            متابعة فورية للمتغيرات والتسجيلات الجديدة بالسنتر، حصص اليوم، الحضور بالباركود، إدارة المدفوعات والاشتراكات، وحالة القاعات المباشرة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>مسح QR للحضور</span>
          </button>

          <button
            onClick={onOpenAddSession}
            className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>جدولة حصة جديدة</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>تسجيل طالب جديد</span>
          </button>
        </div>

        {/* Subtle ambient circle */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-students"
          title="إجمالي الطلاب المسجلين"
          value={`${totalStudents} طالب`}
          subtitle={`منهم ${activeStudents} طالب نشط`}
          icon={GraduationCap}
          color="indigo"
          badge={{ text: 'نشط', variant: 'success' }}
          onClick={() => setActiveTab('students')}
        />

        <StatCard
          id="stat-live-sessions"
          title="الحصص الجارية الآن (LIVE)"
          value={`${liveSessions.length} حصص`}
          subtitle={`إجمالي حصص اليوم: ${todaySessions.length}`}
          icon={Radio}
          color="emerald"
          badge={{ text: 'مباشر الآن', variant: 'success' }}
          onClick={() => setActiveTab('live')}
        />

        <StatCard
          id="stat-attendance-rate"
          title="نسبة حضور اليوم"
          value={`${todayAttendanceRate}%`}
          subtitle={absentStudentsCount > 0 ? `${absentStudentsCount} حالات غياب اليوم` : 'حضور كامل'}
          icon={CheckCircle2}
          color={todayAttendanceRate >= 80 ? 'sky' : 'amber'}
          badge={
            absentStudentsCount > 0
              ? { text: `${absentStudentsCount} غياب`, variant: 'danger' }
              : { text: 'ممتاز', variant: 'success' }
          }
          onClick={() => setActiveTab('attendance')}
        />

        <StatCard
          id="stat-revenue"
          title="إجمالي التحصيلات المالية"
          value={formatCurrency(totalRevenue, settings.currency)}
          subtitle={`مستحقات مؤجلة: ${formatCurrency(totalOutstanding, settings.currency)}`}
          icon={CreditCard}
          color="purple"
          badge={{ text: 'محدّث', variant: 'info' }}
          onClick={() => setActiveTab('payments')}
        />
      </div>

      {/* SECTION: سجل المتغيرات والتحديثات الحية لكل قسم (Real-time Change & Audit Log Feed) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                لوحة المتغيرات والتسجيلات الجديدة (Live Updates)
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  تحديث لحظي
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أي تسجيل طالب جديد أو تعديل بيانات أو تحصيل مالي يظهر هنا مباشرة للأدمن ولأقسام السنتر
              </p>
            </div>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setAuditFilterDept('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                auditFilterDept === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الكل ({auditLogs.length})
            </button>
            <button
              onClick={() => setAuditFilterDept('students')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                auditFilterDept === 'students'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الطلاب والتسجيل
            </button>
            <button
              onClick={() => setAuditFilterDept('payments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                auditFilterDept === 'payments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              المالية وسندات القبض
            </button>
            <button
              onClick={() => setAuditFilterDept('contracts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                auditFilterDept === 'contracts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              العقود والاشتراكات
            </button>
          </div>
        </div>

        {/* Real-time Activity Feed List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
          {filteredAuditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">لا توجد حركات مسجلة حالياً</div>
          ) : (
            filteredAuditLogs.map(log => {
              const isCreateStudent = log.action === 'create' && log.entityType === 'student';
              const isUpdateStudent = log.action === 'update' && log.entityType === 'student';
              const isPayment = log.entityType === 'payment' || log.details.includes('سند');
              const isContract = log.entityType === 'contract' || log.details.includes('عقد');

              return (
                <div
                  key={log.id}
                  className="py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCreateStudent
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : isUpdateStudent
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : isPayment
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                          : isContract
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isCreateStudent && <UserPlus className="w-4 h-4" />}
                      {isUpdateStudent && <Activity className="w-4 h-4" />}
                      {isPayment && <DollarSign className="w-4 h-4" />}
                      {isContract && <FileText className="w-4 h-4" />}
                      {!isCreateStudent && !isUpdateStudent && !isPayment && !isContract && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{log.details}</span>
                        {log.userName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                            بواسطة: {log.userName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>

                  {log.entityId && log.entityType === 'student' && (
                    <button
                      onClick={() => {
                        setSelectedStudentId(log.entityId!);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض الطالب</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-center">
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            عرض سجل التدقيق الكامل لجميع الأقسام →
          </button>
        </div>
      </div>

      {/* SECTION: السنتر الآن (Live Center Real-Time Monitor) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              السنتر الآن (Live Now)
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                متابعة الحصص الجارية في القاعات بالوقت الفعلي
              </span>
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('live')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            عرض شاشة السنتر الكاملة
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        {liveSessions.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <Radio className="w-8 h-8 mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-sm">لا توجد حصص جارية في هذه اللحظة</p>
            <p className="text-xs text-slate-400 mt-0.5">ستظهر الحصص هنا تلقائياً عند بدء موعدها المجدول</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map(session => {
              const teacherName = teachersMap[session.teacherId] || 'المدرس';
              const subjectName = subjectsMap[session.subjectId] || 'المادة';
              const roomName = roomsMap[session.roomId] || 'القاعة';
              const studentNames = session.studentIds.map(id => studentsMap[id] || 'طالب').join('، ');

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 dark:from-emerald-950/30 via-white dark:via-slate-800 to-slate-50 dark:to-slate-800 border-2 border-emerald-200 dark:border-emerald-800 shadow-xs relative overflow-hidden space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          LIVE الآن
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{subjectName}</span>
                      </div>
                      <h4 className="font-black text-base text-slate-900 dark:text-white">{session.title}</h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      {session.sessionCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">المدرس:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{teacherName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">القاعة:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <DoorOpen className="w-3.5 h-3.5" />
                        {roomName}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block text-[11px]">الطلاب ({session.studentIds.length}):</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{studentNames}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('attendance')}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                      >
                        كشف الحضور
                      </button>
                      <button
                        onClick={() => completeSession(session.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                      >
                        إنهاء الحصة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Layout: Upcoming Sessions & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              الحصص القادمة اليوم ({upcomingTodaySessions.length})
            </h3>
            <button
              onClick={() => setActiveTab('sessions')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer"
            >
              عرض جدول الأسبوع
            </button>
          </div>

          {upcomingTodaySessions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">لا توجد حصص إضافية مجدولة لليوم</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingTodaySessions.map(ses => (
                <div
                  key={ses.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex flex-col items-center justify-center font-bold text-xs font-mono">
                      <span>{ses.startTime}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ses.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {teachersMap[ses.teacherId]} • {subjectsMap[ses.subjectId]} • {roomsMap[ses.roomId]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge status={ses.status} />
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      تسجيل الحضور
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts & Notifications Box (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              تنبيهات السنتر العاجلة
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {expiringContractsCount + absentStudentsCount} تنبيه
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map(notif => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                  notif.priority === 'high'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    : notif.priority === 'medium'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{notif.title}</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">{notif.date}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{notif.message}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('notifications')}
            className="w-full py-2 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl transition-colors block cursor-pointer"
          >
            عرض كافة الإشعارات والتنبيهات
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Subject */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            توزيع الطلاب حسب المواد الدراسية
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsBySubjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs font-bold shadow-xl text-right">
                          <p>{d.full}</p>
                          <p className="text-indigo-300">{d.count} طالب مسجل</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions by Teacher */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            عدد الحصص الأسبوعية لكل مدرس
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsByTeacherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs font-bold shadow-xl text-right">
                          <p>{d.name}</p>
                          <p className="text-emerald-300">{d.count} حصة مسجلة</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
