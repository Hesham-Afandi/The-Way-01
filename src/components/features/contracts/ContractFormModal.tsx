import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Contract, ContractStatus } from '../../../types';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractToEdit?: Contract | null;
  defaultStudentId?: string;
}

export const ContractFormModal: React.FC<ContractFormModalProps> = ({
  isOpen,
  onClose,
  contractToEdit,
  defaultStudentId
}) => {
  const { students, subjects, addContract, updateContract, settings } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    studentId: defaultStudentId || students[0]?.id || '',
    subjectIds: [] as string[],
    totalSessions: 12,
    totalPrice: 1800,
    startDate: todayStr,
    endDate: nextMonthStr,
    status: ContractStatus.ACTIVE,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contractToEdit) {
      setFormData({
        studentId: contractToEdit.studentId,
        subjectIds: contractToEdit.subjectIds || [],
        totalSessions: contractToEdit.totalSessions,
        totalPrice: contractToEdit.totalPrice,
        startDate: contractToEdit.startDate,
        endDate: contractToEdit.endDate,
        status: contractToEdit.status,
        notes: contractToEdit.notes || ''
      });
    } else {
      setFormData({
        studentId: defaultStudentId || students[0]?.id || '',
        subjectIds: subjects.length > 0 ? [subjects[0].id] : [],
        totalSessions: 12,
        totalPrice: 1800,
        startDate: todayStr,
        endDate: nextMonthStr,
        status: ContractStatus.ACTIVE,
        notes: ''
      });
    }
    setErrors({});
  }, [contractToEdit, defaultStudentId, isOpen, students, subjects, todayStr, nextMonthStr]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.studentId) errs.studentId = 'يرجى اختيار الطالب';
    if (formData.subjectIds.length === 0) errs.subjectIds = 'يجب اختيار مادة دراسية واحدة على الأقل';
    if (formData.totalSessions <= 0) errs.totalSessions = 'عدد الحصص يجب أن يكون أكبر من الصفر';
    if (formData.totalPrice <= 0) errs.totalPrice = 'إجمالي السعر يجب أن يكون أكبر من الصفر';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (contractToEdit) {
      updateContract(contractToEdit.id, formData);
    } else {
      addContract(formData);
    }
    onClose();
  };

  const toggleSubject = (id: string) => {
    setFormData(prev => {
      const exists = prev.subjectIds.includes(id);
      return {
        ...prev,
        subjectIds: exists ? prev.subjectIds.filter(sId => sId !== id) : [...prev.subjectIds, id]
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contractToEdit ? `تعديل العقد (${contractToEdit.contractNumber})` : 'إنشاء عقد اشتراك جديد للطالب'}
      subtitle="تحديد عدد الحصص، القيمة المالية الإجمالية، والمواد المغطاة"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            اسم الطالب <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.studentId}
            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {students.map(st => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.grade} - {st.code})
              </option>
            ))}
          </select>
          {errors.studentId && <p className="text-[11px] text-rose-500 mt-1">{errors.studentId}</p>}
        </div>

        {/* Subjects Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            المواد المشمولة بالعقد <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjects.map(sub => {
              const isSelected = formData.subjectIds.includes(sub.id);
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-2 rounded-xl border text-right transition-all text-xs font-bold ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{sub.name}</span>
                    <span>{isSelected ? '✓' : ''}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.subjectIds && <p className="text-[11px] text-rose-500 mt-1">{errors.subjectIds}</p>}
        </div>

        {/* Sessions Count & Total Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              إجمالي عدد الحصص (الباقة) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.totalSessions}
              onChange={e => setFormData({ ...formData, totalSessions: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {errors.totalSessions && <p className="text-[11px] text-rose-500 mt-1">{errors.totalSessions}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              إجمالي القيمة المالية ({settings.currency}) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.totalPrice}
              onChange={e => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {errors.totalPrice && <p className="text-[11px] text-rose-500 mt-1">{errors.totalPrice}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ بداية العقد</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ نهاية العقد</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات العقد أو شروط الدفع</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="مثال: خصم 10% للأخوة، دفع على دفعتين..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer"
          >
            {contractToEdit ? 'حفظ التعديلات' : 'تأكيد وحفظ العقد'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
