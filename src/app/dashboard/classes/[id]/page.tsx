'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Clock, Users, UserPlus, Trash2 } from 'lucide-react';
import { classService } from '@/services/classService';
import { scheduleService } from '@/services/scheduleService';
import { studentService } from '@/services/studentService';
import { Class, ClassSchedule } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const dayLabels: Record<string | number, string> = {
  Sunday: 'Chủ nhật',
  Monday: 'Thứ Hai',
  Tuesday: 'Thứ Ba',
  Wednesday: 'Thứ Tư',
  Thursday: 'Thứ Năm',
  Friday: 'Thứ Sáu',
  Saturday: 'Thứ Bảy',
  0: 'Chủ nhật',
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
};

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);

  const [cls, setCls] = useState<Class | null>(null);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clsData, schedData, stuData] = await Promise.all([
          classService.getById(classId),
          scheduleService.getByClass(classId),
          studentService.getByClass(classId),
        ]);
        setCls(clsData);
        setSchedules(schedData);
        setStudents(stuData);
      } catch {
        setError('Không thể tải thông tin lớp học.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [classId]);

  const handleAddStudent = async () => {
    if (!emailInput) return;
    setError(''); setSuccess('');
    try {
      const res = await studentService.addToClass(classId, emailInput);
      // Backend returns { message, student }
      setStudents([...students, res.student || res]);
      setEmailInput('');
      setSuccess('Thêm học sinh thành công!');
    } catch (e: any) {
      setError(e?.response?.data || 'Thêm học sinh thất bại.');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm('Xóa học sinh này khỏi lớp?')) return;
    setError(''); setSuccess('');
    try {
      await studentService.removeFromClass(classId, studentId);
      setStudents(students.filter(s => s.id !== studentId));
      setSuccess('Đã xóa học sinh khỏi lớp.');
    } catch {
      setError('Xóa học sinh thất bại.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!cls) return <Alert message="Không tìm thấy lớp học." variant="error" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/classes">
          <button className="rounded-xl p-2 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{cls.name}</h2>
          {cls.description && (
            <p className="text-sm text-slate-500 mt-0.5">{cls.description}</p>
          )}
        </div>
        <div className="ml-auto">
          <Link href={`/dashboard/classes/${classId}/edit`}>
            <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              Chỉnh sửa
            </button>
          </Link>
        </div>
      </div>

      {error && <Alert message={error} variant="error" />}
      {success && <Alert message={success} variant="success" />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <BookOpen size={18} />
            Thông tin lớp học
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Giáo viên</span>
              <span className="font-medium">{cls.teacher?.fullName ?? '–'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bắt đầu</span>
              <span className="font-medium">
                {cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '–'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kết thúc</span>
              <span className="font-medium">
                {cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '–'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tạo lúc</span>
              <span className="font-medium">
                {new Date(cls.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        {/* Schedules */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <Calendar size={18} />
            Lịch học ({schedules.length})
          </div>
          {schedules.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có lịch học nào.</p>
          ) : (
            <ul className="space-y-2">
              {schedules.map((s) => (
                <li key={s.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">
                    {dayLabels[s.dayOfWeek] ?? s.dayOfWeek}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Clock size={12} />
                    {s.startTime.substring(0, 5)} – {s.endTime.substring(0, 5)}
                    {s.room && ` | Phòng: ${s.room}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/dashboard/schedule?classId=${classId}`}>
            <button className="w-full rounded-xl border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2">
              Quản lý lịch học
            </button>
          </Link>
        </div>

        {/* Students */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Users size={18} />
              Học sinh ({students.length})
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email học sinh..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <button
              onClick={handleAddStudent}
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <UserPlus size={16} />
            </button>
          </div>

          {students.length === 0 ? (
            <p className="text-sm text-slate-400 mt-2">Chưa có học sinh nào.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto mt-2">
              {students.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-500 text-xs font-bold text-white shrink-0">
                      {s.fullName?.charAt(0) ?? 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {s.fullName ?? `ID: ${s.id}`}
                      </p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa khỏi lớp"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/dashboard/attendance?classId=${classId}`}>
            <button className="w-full rounded-xl border border-emerald-200 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors mt-4">
              Xem điểm danh
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
