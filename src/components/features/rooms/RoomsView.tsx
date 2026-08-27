import React, { useState } from 'react';
import {
  DoorOpen,
  Plus,
  Tv,
  Wind,
  Volume2,
  Users,
  CheckCircle2,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { ConfirmModal } from '../../common/ConfirmModal';
import { ViewOnlyBanner } from '../../common/ViewOnlyBanner';
import { Room } from '../../../types';

export const RoomsView: React.FC = () => {
  const { rooms, sessions, addRoom, updateRoom, deleteRoom, canEditSection } = useApp();

  const isEditable = canEditSection('rooms');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    capacity: 20,
    equipment: [] as string[],
    notes: '',
    isActive: true
  });

  const handleOpenAdd = () => {
    setRoomToEdit(null);
    setFormData({
      name: '',
      code: `RM-${rooms.length + 1}`,
      capacity: 20,
      equipment: ['سبورة بيضاء', 'تكييف هوائي'],
      notes: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setRoomToEdit(room);
    setFormData({
      name: room.name,
      code: room.code,
      capacity: room.capacity,
      equipment: room.equipment || [],
      notes: room.notes || '',
      isActive: room.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.capacity <= 0) return;

    if (roomToEdit) {
      updateRoom(roomToEdit.id, formData);
    } else {
      addRoom(formData);
    }
    setIsModalOpen(false);
  };

  const toggleEquipment = (item: string) => {
    setFormData(prev => {
      const exists = prev.equipment.includes(item);
      return {
        ...prev,
        equipment: exists ? prev.equipment.filter(i => i !== item) : [...prev.equipment, item]
      };
    });
  };

  const equipmentOptions = [
    'سبورة بيضاء',
    'شاشة ذكية (Smart TV)',
    'بروجيكتور (Projector)',
    'تكييف هوائي',
    'نظام صوتي ومايك',
    'أجهزة حاسوب (Lab)'
  ];

  return (
    <div className="space-y-6 text-right">
      {/* View Only Banner for restricted departments */}
      <ViewOnlyBanner section="rooms" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-indigo-600" />
            إدارة القاعات والمعامل الدراسية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تحديد الطاقة الاستيعابية، التجهيزات التقنية، وجداول إشغال القاعات
          </p>
        </div>

        {isEditable && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قاعة جديدة</span>
          </button>
        )}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => {
          const liveSession = sessions.find(s => s.roomId === room.id && s.status === 'live');
          const upcomingSessions = sessions.filter(
            s => s.roomId === room.id && s.status === 'scheduled'
          );

          return (
            <div
              key={room.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs space-y-4 text-xs transition-all ${
                liveSession ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {room.code}
                    </span>
                    {liveSession ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        مشغولة الآن
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-full text-[10px]">
                        متاحة
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-base text-slate-900">{room.name}</h3>
                </div>

                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                  <DoorOpen className="w-6 h-6" />
                </div>
              </div>

              {/* Room Stats */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">الطاقة الاستيعابية:</span>
                  <span className="font-bold text-slate-900">{room.capacity} مقعد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الحصص المجدولة:</span>
                  <span className="font-bold text-indigo-700">{upcomingSessions.length} حصة</span>
                </div>
              </div>

              {/* Equipment list */}
              <div>
                <span className="text-slate-400 block text-[10px] mb-1 font-bold">التجهيزات المتوفرة:</span>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  title="تعديل"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRoomToDelete(room)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={roomToEdit ? `تعديل القاعة (${roomToEdit.name})` : 'إضافة قاعة دراسية جديدة'}
        subtitle="تحديد السعة القصوى والتجهيزات التقنية لتفادي التداخل"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم القاعة / المعمل</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: قاعة ابن سينا (A1)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود القاعة</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">السعة الاستيعابية (طالب)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Equipment Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">التجهيزات التقنية والمرافق</label>
            <div className="grid grid-cols-2 gap-2">
              {equipmentOptions.map(eq => {
                const isSelected = formData.equipment.includes(eq);
                return (
                  <button
                    type="button"
                    key={eq}
                    onClick={() => toggleEquipment(eq)}
                    className={`p-2 rounded-xl border text-right text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {eq} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              {roomToEdit ? 'حفظ التعديلات' : 'إضافة القاعة'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={() => {
          if (roomToDelete) {
            deleteRoom(roomToDelete.id);
          }
        }}
        title="تأكيد حذف القاعة"
        message={`هل أنت متأكد من رغبتك في حذف القاعة "${roomToDelete?.name}" نهائياً؟`}
        confirmText="نعم، حذف القاعة"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
};
