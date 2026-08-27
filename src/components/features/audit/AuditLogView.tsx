import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, User, FileText } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q);
    const matchesEntity = selectedEntity === 'all' || log.entityType === selectedEntity;
    return matchesSearch && matchesEntity;
  });

  const entityTypeLabels: Record<string, string> = {
    student: 'الطلاب',
    teacher: 'المدرسين',
    session: 'الحصص',
    contract: 'العقود',
    payment: 'المدفوعات',
    attendance: 'الحضور',
    room: 'القاعات',
    subject: 'المواد'
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            سجل العمليات والأمان (Audit Log & Activity Trail)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تتبع كافة العمليات الإدارية والمالية المنفذة في النظام مع الطابع الزمني واسم المستخدم
          </p>
        </div>

        <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl font-mono">
          إجمالي {auditLogs.length} عملية مسجلة
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3 right-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في تفاصيل العملية أو الإجراء..."
              className="w-full pr-9 pl-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedEntity}
            onChange={e => setSelectedEntity(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">كافة أقسام النظام</option>
            <option value="student">شؤون الطلاب</option>
            <option value="teacher">طاقم التدريس</option>
            <option value="session">الحصص والجداول</option>
            <option value="contract">العقود والاشتراكات</option>
            <option value="payment">المدفوعات وسندات القبض</option>
            <option value="attendance">تسجيل الحضور</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold">
                <th className="py-3.5 px-4">التوقيت والتاريخ</th>
                <th className="py-3.5 px-4">المستخدم</th>
                <th className="py-3.5 px-4">القسم</th>
                <th className="py-3.5 px-4">نوع الإجراء</th>
                <th className="py-3.5 px-4">تفاصيل العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => {
                const dateObj = new Date(log.timestamp);
                const timeStr = dateObj.toLocaleTimeString('ar-EG', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                const dateStr = dateObj.toLocaleDateString('ar-EG');

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {dateStr} <span className="font-bold text-slate-700">{timeStr}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {log.userId === 'usr-1' ? 'أ. أحمد الشناوي (مدير)' : 'المسؤول'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {entityTypeLabels[log.entityType] || log.entityType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-md ${
                          log.action.includes('CREATE') || log.action.includes('ADD')
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.action.includes('UPDATE')
                            ? 'bg-amber-50 text-amber-700'
                            : log.action.includes('DELETE')
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">{log.details}</td>
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
