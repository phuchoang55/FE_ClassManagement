'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { classService } from '@/services/classService';
import { scheduleService } from '@/services/scheduleService';
import { studentService } from '@/services/studentService';
import { Class, ClassSchedule, ClassStudent } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const dayLabels: Record<string, string> = {
  Sunday: 'Chủ nhật',
  Monday: 'Thứ Hai',
  Tuesday: 'Thứ Ba',
  Wednesday: 'Thứ Tư',
  Thursday: 'Thứ Năm',
  Friday: 'Thứ Sáu',
  Saturday: 'Thứ Bảy',
};

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);

  const [cls, setCls] = useState<Class | null>(null);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <button className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
              Chỉnh sửa
            </button>
          </Link>
        </div>
      </div>

      {error && <Alert message={error} variant="error" />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <Calendar size={18} />
              Lịch học ({schedules.length})
            </div>
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
            <button className="w-full rounded-xl border border-indigo-200 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors mt-2">
              Quản lý lịch học
            </button>
          </Link>
        </div>

        {/* Students */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <Users size={18} />
              Học sinh ({students.length})
            </div>
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có học sinh nào.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {students.map((s) => (
                <li
                  key={s.studentId}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white shrink-0">
                    {s.student?.fullName?.charAt(0) ?? 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {s.student?.fullName ?? `ID: ${s.studentId}`}
                    </p>
                    <p className="text-xs text-slate-500">{s.student?.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/dashboard/attendance?classId=${classId}`}>
            <button className="w-full rounded-xl border border-emerald-200 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors mt-2">
              Xem điểm danh
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
