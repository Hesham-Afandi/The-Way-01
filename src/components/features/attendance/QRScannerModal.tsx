import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { QrCode, CheckCircle2, User, Camera, Sparkles, AlertCircle } from 'lucide-react';
import { AttendanceStatus } from '../../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const {
    students,
    sessions,
    recordAttendance,
    addToast
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [scannedStudent, setScannedStudent] = useState<typeof students[0] | null>(null);

  const handleScan = (codeToScan?: string) => {
    const code = (codeToScan || inputCode).trim().toUpperCase();
    if (!code) return;

    const student = students.find(
      s => s.code.toUpperCase() === code || s.qrCode?.toUpperCase() === code || s.phone?.includes(code)
    );

    if (!student) {
      addToast({
        title: 'كود غير معروف',
        message: `لم يتم العثور على طالب مسجل بالكود أو الباركود: "${code}"`,
        type: 'error'
      });
      return;
    }

    if (!selectedSessionId) {
      addToast({
        title: 'يرجى اختيار الحصة',
        message: 'حدد الحصة المراد تسجيل الحضور بها أولاً',
        type: 'warning'
      });
      return;
    }

    const session = sessions.find(s => s.id === selectedSessionId);
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    recordAttendance(
      selectedSessionId,
      student.id,
      AttendanceStatus.PRESENT,
      `تم التسجيل بالباركود الذكي (${nowTime})`
    );

    setScannedStudent(student);
    setInputCode('');

    addToast({
      title: 'تم تسجيل الحضور بنجاح! ✓',
      message: `تم تسجيل حضور الطالب ${student.name} في حصة "${session?.title || 'الحصة'}"`,
      type: 'success'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="مسح كود الحضور الذكي (QR & Barcode Scanner)"
      subtitle="تسجيل الحضور الفوري للطلاب عبر قارئ الباركود أو الكود الشخصي"
      maxWidth="lg"
    >
      <div className="space-y-5 text-right">
        {/* Session Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            اختر الحصة المراد تسجيل الحضور فيها:
          </label>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {sessions.map(ses => (
              <option key={ses.id} value={ses.id}>
                {ses.title} ({ses.date} | {ses.startTime}) {ses.status === 'live' ? '🔥 [LIVE جارية الآن]' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Camera / Visual Scanner Box */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden text-center space-y-4 border border-indigo-800">
          <div className="w-36 h-36 mx-auto rounded-2xl border-2 border-dashed border-emerald-400/80 flex flex-col items-center justify-center relative shadow-inner">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-pulse" />
            <Camera className="w-10 h-10 text-emerald-400 mb-1 z-10" />
            <span className="text-[11px] text-emerald-300 font-mono font-bold z-10">منطقة المسح</span>
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-lg shadow-emerald-400 top-1/2 animate-bounce" />
          </div>

          <p className="text-xs text-indigo-200 font-medium">
            قم بتوجيه كاميرا الجهاز أو قارئ الباركود نحو بطاقة الطالب
          </p>
        </div>

        {/* Manual Barcode Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            أو أدخل كود الطالب يدوياً / امسح بجهاز الباركود USB:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="أدخل الكود، مثل: STD-1001 أو رقم الهاتف..."
              className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleScan()}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              تسجيل الحضور
            </button>
          </div>
        </div>

        {/* Quick Test Demo Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400">اختبار سريع (انقر على أي طالب للتسجيل الفوري):</p>
          <div className="flex flex-wrap gap-1.5">
            {students.slice(0, 5).map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleScan(st.code)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                {st.name} ({st.code})
              </button>
            ))}
          </div>
        </div>

        {/* Success Preview Card */}
        {scannedStudent && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{scannedStudent.name}</p>
                <p className="text-[11px] text-emerald-700">
                  {scannedStudent.grade} • كود: {scannedStudent.code}
                </p>
              </div>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
              حاضر الآن ✓
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
