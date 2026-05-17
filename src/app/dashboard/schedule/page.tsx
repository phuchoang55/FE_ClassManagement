'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Trash2, Clock } from 'lucide-react';
import { classService } from '@/services/classService';
import { scheduleService } from '@/services/scheduleService';
import { Class, ClassSchedule, DayOfWeek } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'Monday', label: 'Thứ Hai' },
  { value: 'Tuesday', label: 'Thứ Ba' },
  { value: 'Wednesday', label: 'Thứ Tư' },
  { value: 'Thursday', label: 'Thứ Năm' },
  { value: 'Friday', label: 'Thứ Sáu' },
  { value: 'Saturday', label: 'Thứ Bảy' },
  { value: 'Sunday', label: 'Chủ nhật' },
];

const dayLabel = (d: string | number) => {
  const numToDay: Record<number, string> = {
    0: 'Chủ nhật',
    1: 'Thứ Hai',
    2: 'Thứ Ba',
    3: 'Thứ Tư',
    4: 'Thứ Năm',
    5: 'Thứ Sáu',
    6: 'Thứ Bảy',
  };
  if (typeof d === 'number' || !isNaN(Number(d))) {
    return numToDay[Number(d)] ?? d;
  }
  return DAYS.find((x) => x.value === d)?.label ?? d;
};

const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100';

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const initClassId = searchParams.get('classId');

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>(initClassId ?? '');
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    dayOfWeek: 'Monday' as DayOfWeek,
    startTime: '07:00',
    endTime: '09:00',
    room: '',
  });

  useEffect(() => {
    classService.getAll().then(setClasses).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) { setSchedules([]); return; }
    setLoading(true);
    scheduleService
      .getByClass(Number(selectedClass))
      .then(setSchedules)
      .catch(() => setError('Không thể tải lịch học.'))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const handleAdd = async () => {
    if (!selectedClass) return;
    setError(''); setSuccess('');
    try {
      const newSchedule = await scheduleService.create(Number(selectedClass), {
        dayOfWeek: form.dayOfWeek,
        room: form.room,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
      });
      setSchedules((prev) => [...prev, newSchedule]);
      setSuccess('Đã thêm lịch học thành công!');
    } catch {
      setError('Thêm lịch học thất bại.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa lịch học này?')) return;
    try {
      await scheduleService.delete(Number(selectedClass), id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Xóa lịch học thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Quản lý lịch học</h2>
        <p className="text-sm text-slate-500 mt-0.5">Xem và thiết lập lịch học theo lớp</p>
      </div>

      {/* Class selector */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <label className="mb-2 block text-sm font-medium text-slate-700">Chọn lớp học</label>
        <select
          id="schedule-class-select"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={`${inputCls} max-w-sm`}
        >
          <option value="">-- Chọn lớp --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && <Alert message={error} variant="error" />}
      {success && <Alert message={success} variant="success" />}

      {selectedClass && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Current schedules */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Lịch hiện tại ({schedules.length})
            </h3>
            {loading ? (
              <LoadingSpinner text="Đang tải lịch học..." />
            ) : schedules.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">Chưa có lịch học. Hãy thêm lịch mới.</p>
            ) : (
              <ul className="space-y-3">
                {schedules.map((s) => (
                  <li key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-800">{dayLabel(s.dayOfWeek)}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
                        <Clock size={14} />
                        {s.startTime.substring(0, 5)} – {s.endTime.substring(0, 5)}
                        {s.room && (
                          <span className="ml-2 rounded-md bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                            {s.room}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add new schedule */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Thêm lịch học</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày học</label>
                <select
                  id="new-schedule-day"
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })}
                  className={inputCls}
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Giờ kết thúc</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Phòng học</label>
                <input
                  id="new-schedule-room"
                  type="text"
                  placeholder="VD: A301"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className={inputCls}
                />
              </div>
              <button
                id="btn-add-schedule"
                onClick={handleAdd}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:from-red-700 hover:to-rose-700 transition-all"
              >
                <Plus size={18} />
                Thêm lịch học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
