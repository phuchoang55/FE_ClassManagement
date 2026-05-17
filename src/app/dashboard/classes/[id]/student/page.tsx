'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { studentService } from '@/services/studentService';
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

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  Present: { label: 'Có mặt', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  Absent: { label: 'Vắng mặt', color: 'bg-red-100 text-red-700', icon: XCircle },
  'Not yet': { label: 'Chưa học', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function StudentClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);
  const router = useRouter();

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentService.getMyClassDetail(classId)
      .then(setDetail)
      .catch(() => setError('Không thể tải thông tin lớp học. Có thể bạn không thuộc lớp này.'))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="space-y-4">
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-red-600">
        <ArrowLeft size={16} /> Quay lại
      </button>
      <Alert message={error} variant="error" />
    </div>
  );
  if (!detail) return null;

  const totalSessions = detail.attendances.length;
  const presentSessions = detail.attendances.filter((a: any) => a.status === 'Present').length;
  const absentSessions = detail.attendances.filter((a: any) => a.status === 'Absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="rounded-xl p-2 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{detail.name}</h2>
          {detail.description && (
            <p className="text-sm text-slate-500 mt-0.5">{detail.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Class Info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
              <BookOpen size={18} />
              Thông tin chung
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Giáo viên</span>
                <span className="font-medium text-slate-800">{detail.teacherName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Bắt đầu</span>
                <span className="font-medium text-slate-800">
                  {detail.startDate ? new Date(detail.startDate).toLocaleDateString('vi-VN') : '–'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kết thúc</span>
                <span className="font-medium text-slate-800">
                  {detail.endDate ? new Date(detail.endDate).toLocaleDateString('vi-VN') : '–'}
                </span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
              <Calendar size={18} />
              Lịch học cố định ({detail.schedules.length})
            </div>
            {detail.schedules.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có lịch học.</p>
            ) : (
              <ul className="space-y-2">
                {detail.schedules.map((s: any) => (
                  <li key={s.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-800">
                      {dayLabels[s.dayOfWeek] ?? s.dayOfWeek}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        {s.startTime} – {s.endTime}
                      </div>
                      {s.room && (
                        <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                          {s.room}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Attendance Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <CheckCircle size={18} />
                Lịch trình & Điểm danh
              </div>
              {/* Stats Mini */}
              <div className="flex gap-3 text-sm">
                <div className="flex flex-col items-center px-3 border-r border-slate-100">
                  <span className="text-slate-500 text-xs">Tổng số buổi</span>
                  <span className="font-bold text-slate-800">{totalSessions}</span>
                </div>
                <div className="flex flex-col items-center px-3 border-r border-slate-100">
                  <span className="text-emerald-600 text-xs">Có mặt</span>
                  <span className="font-bold text-emerald-600">{presentSessions}</span>
                </div>
                <div className="flex flex-col items-center pl-3">
                  <span className="text-red-600 text-xs">Vắng mặt</span>
                  <span className="font-bold text-red-600">{absentSessions}</span>
                </div>
              </div>
            </div>

            {/* List */}
            {detail.attendances.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-400">Chưa có dữ liệu lịch trình.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 rounded-l-xl">Ngày học</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Giờ học</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 rounded-r-xl">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {detail.attendances.map((att: any, index: number) => {
                      const cfg = statusConfig[att.status] || statusConfig['Not yet'];
                      const Icon = cfg.icon;
                      const d = new Date(att.date);
                      const dayName = dayLabels[d.toLocaleDateString('en-US', { weekday: 'long' })];
                      const sch = detail.schedules.find((s: any) => s.id === att.scheduleId);
                      
                      return (
                        <tr key={att.id || `temp-${index}`} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-800">{d.toLocaleDateString('vi-VN')}</span>
                              <span className="text-xs text-slate-500">{dayName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {sch ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-slate-700">{sch.startTime} - {sch.endTime}</span>
                                {sch.room && <span className="text-xs text-slate-500">Phòng: {sch.room}</span>}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-400">–</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}>
                              <Icon size={12} />
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
