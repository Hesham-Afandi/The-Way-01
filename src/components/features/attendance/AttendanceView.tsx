import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  QrCode,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Search,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { ViewOnlyBanner } from '../../common/ViewOnlyBanner';
import { AttendanceStatus } from '../../../types';
import { formatTime12h, formatArabicDate } from '../../../utils/formatters';

interface AttendanceViewProps {
  onOpenQRScanner: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onOpenQRScanner }) => {
  const {
    sessions,
    students,
    attendance,
    subjectsMap,
    teachersMap,
    roomsMap,
    recordAttendance,
    markAllSessionAttendance,
    addToast,
    canEditSection
  } = useApp();

  const isEditable = canEditSection('attendance');

  const todayStr = new Date().toISOString().split('T')[0];

  // Select current live session, or first session today, or first session
  const defaultSession =
    sessions.find(s => s.status === 'live') ||
    sessions.find(s => s.date === todayStr) ||
    sessions[0];

  const [selectedSessionId, setSelectedSessionId] = useState(defaultSession?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const currentSession = sessions.find(s => s.id === selectedSessionId);

  // Get attendance records for this session
  const sessionAttendance = useMemo(() => {
    return attendance.filter(a => a.sessionId === selectedSessionId);
  }, [attendance, selectedSessionId]);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, typeof sessionAttendance[0]>();
    sessionAttendance.forEach(a => map.set(a.studentId, a));
    return map;
  }, [sessionAttendance]);

  // Session students list
  const sessionStudents = useMemo(() => {
    if (!currentSession) return [];
    const list = students.filter(s => currentSession.studentIds.includes(s.id));
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.parent.phone.includes(q)
    );
  }, [currentSession, students, searchQuery]);

  // Attendance metrics
  const totalEnrolled = currentSession?.studentIds.length || 0;
  const presentCount = sessionAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
  const absentCount = sessionAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length;
  const lateCount = sessionAttendance.filter(a => a.status === AttendanceStatus.LATE).length;
  const excusedCount = sessionAttendance.filter(a => a.status === AttendanceStatus.EXCUSED).length;

  const attendanceRate = totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    recordAttendance(
      selectedSessionId,
      studentId,
      status,
      status === AttendanceStatus.LATE ? `متأخر (تم الدخول: ${nowTime})` : undefined
    );
  };

  const handleSendWhatsAppNotice = (student: typeof students[0]) => {
    const message = `السلام عليكم ورحمة الله، ولي أمر الطالب/ة ${student.name}.\nنود إحاطتكم علماً بغياب الطالب اليوم عن حصة (${currentSession?.title}) بتاريخ ${currentSession?.date}.\nيرجى التواصل مع إدارة المركز للتنسيق والتعويض.\nشكراً لتعاونكم.`;
    const cleanPhone = student.parent.whatsapp?.replace(/\D/g, '') || student.parent.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    addToast({
      title: 'تم تجهيز رسالة الواتساب',
      message: `تم فتح محادثة ولي أمر الطالب ${student.name}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 text-right">
      {/* View Only Banner for restricted departments */}
      <ViewOnlyBanner section="attendance" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            دفتر تسجيل الحضور والغياب الإلكتروني
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تسجيل الحضور الفوري بالباركود الذكي، تحديث الرصيد، وإرسال تنبيهات الغياب الفورية
          </p>
        </div>

        {isEditable && (
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>مسح باركود الحضور (QR)</span>
          </button>
        )}
      </div>

      {/* Session Selection & Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اختر الحصة المراد مراجعة وتسجيل كشف حضورها:
            </label>
            <select
              value={selectedSessionId}
              onChange={e => setSelectedSessionId(e.target.value)}
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
            >
              {sessions.map(ses => (
                <option key={ses.id} value={ses.id}>
                  {ses.title} | {subjectsMap[ses.subjectId]} | {teachersMap[ses.teacherId]} (
                  {ses.date} - {formatTime12h(ses.startTime)}) {ses.status === 'live' ? '🔥 [LIVE جارية الآن]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => markAllSessionAttendance(selectedSessionId, AttendanceStatus.PRESENT)}
              className="flex-1 py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-2xl transition-colors"
            >
              تحديد الكل حاضر ✓
            </button>
            <button
              onClick={() => markAllSessionAttendance(selectedSessionId, AttendanceStatus.ABSENT)}
              className="flex-1 py-3 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-2xl transition-colors"
            >
              تحديد الكل غائب ✗
            </button>
          </div>
        </div>

        {/* Selected Session Info Pill */}
        {currentSession && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">المدرس:</span>
                <span className="font-bold text-slate-900">{teachersMap[currentSession.teacherId]}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">القاعة:</span>
                <span className="font-bold text-emerald-700">{roomsMap[currentSession.roomId]}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الموعد:</span>
                <span className="font-bold font-mono text-slate-800">
                  {currentSession.date} ({formatTime12h(currentSession.startTime)} - {formatTime12h(currentSession.endTime)})
                </span>
              </div>
            </div>

            {/* Live Metrics Counter */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl font-bold">
                حاضر: {presentCount}
              </span>
              <span className="px-3 py-1 bg-rose-100 text-rose-900 rounded-xl font-bold">
                غائب: {absentCount}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl font-bold">
                متأخر: {lateCount}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-xl font-black">
                النسبة: {attendanceRate}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute top-2.5 right-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في طلاب هذه الحصة..."
              className="w-full pr-9 pl-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-bold">
            عدد الطلاب المسجلين: {sessionStudents.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold">
                <th className="py-3.5 px-4">الطالب</th>
                <th className="py-3.5 px-4">الكود</th>
                <th className="py-3.5 px-4">ولي الأمر والهاتف</th>
                <th className="py-3.5 px-4 text-center">تسجيل الحالة</th>
                <th className="py-3.5 px-4">وقت وملاحظات الحضور</th>
                <th className="py-3.5 px-4 text-center">إشعار ولي الأمر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionStudents.map(student => {
                const att = attendanceMap.get(student.id);
                const currentStatus = att?.status;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                          style={{ backgroundColor: student.avatarColor || '#4f46e5' }}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.grade}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {student.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{student.parent.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">{student.parent.phone}</p>
                    </td>

                    {/* Interactive Status Buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            currentStatus === AttendanceStatus.PRESENT
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          حاضر ✓
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            currentStatus === AttendanceStatus.ABSENT
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          غائب ✗
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.LATE)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            currentStatus === AttendanceStatus.LATE
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          متأخر ⏱
                        </button>

                        {/* Excused */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.EXCUSED)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            currentStatus === AttendanceStatus.EXCUSED
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                          }`}
                        >
                          معتذر
                        </button>
                      </div>
                    </td>

                    {/* Timestamp & Notes */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      {att?.checkInTime && (
                        <span className="font-mono font-bold text-slate-700 block">
                          وقت الدخول: {att.checkInTime}
                        </span>
                      )}
                      <span>{att?.notes || (currentStatus ? 'تم التوثيق' : 'لم يسجل بعد')}</span>
                    </td>

                    {/* WhatsApp Alert Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppNotice(student)}
                        title="إرسال إشعار ولي الأمر عبر WhatsApp"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>واتساب</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
