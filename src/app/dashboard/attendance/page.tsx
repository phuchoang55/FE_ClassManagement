'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { classService } from '@/services/classService';
import { attendanceService } from '@/services/attendanceService';
import { studentService } from '@/services/studentService';
import { Class, Attendance, ClassStudent, AttendanceStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const statusConfig: Record<
  AttendanceStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  Present: { label: 'Có mặt', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  Absent: { label: 'Vắng mặt', color: 'bg-red-100 text-red-700', icon: XCircle },
  'Not yet': { label: 'Chưa điểm danh', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const initClassId = searchParams.get('classId');

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>(initClassId ?? '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    classService.getAll().then(setClasses).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setAttendance([]);
      return;
    }
    setLoading(true);
    Promise.all([
      studentService.getByClass(Number(selectedClass)),
      attendanceService.getByClassAndDate(Number(selectedClass), selectedDate),
    ])
      .then(([studs, atts]) => {
        setStudents(studs);
        setAttendance(atts);
      })
      .catch(() => setError('Không thể tải dữ liệu điểm danh.'))
      .finally(() => setLoading(false));
  }, [selectedClass, selectedDate]);

  const getStatus = (studentId: number): AttendanceStatus => {
    const found = attendance.find((a) => a.studentId === studentId);
    return found?.status ?? 'Not yet';
  };

  const getAttendanceId = (studentId: number): number | undefined => {
    return attendance.find((a) => a.studentId === studentId)?.id;
  };

  const handleUpdateStatus = async (studentId: number, status: AttendanceStatus) => {
    const attId = getAttendanceId(studentId);
    setError('');
    setSuccess('');
    try {
      if (attId) {
        await attendanceService.update(attId, { status });
        setAttendance((prev) =>
          prev.map((a) => (a.id === attId ? { ...a, status } : a))
        );
      }
      setSuccess('Đã cập nhật điểm danh.');
    } catch {
      setError('Cập nhật điểm danh thất bại.');
    }
  };

  const stats = {
    present: attendance.filter((a) => a.status === 'Present').length,
    absent: attendance.filter((a) => a.status === 'Absent').length,
    notYet: students.length - attendance.filter((a) => a.status !== 'Not yet').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Điểm danh</h2>
        <p className="text-sm text-slate-500 mt-0.5">Quản lý điểm danh theo lớp và ngày</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex-1 min-w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Lớp học</label>
          <select
            id="attendance-class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày</label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error && <Alert message={error} variant="error" />}
      {success && <Alert message={success} variant="success" />}

      {selectedClass && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Có mặt', count: stats.present, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Vắng mặt', count: stats.absent, color: 'from-red-500 to-red-600' },
              { label: 'Chưa điểm danh', count: stats.notYet, color: 'from-amber-500 to-amber-600' },
            ].map(({ label, count, color }) => (
              <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <p className="text-sm text-slate-500">{label}</p>
                <p className={`text-3xl font-bold mt-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  {count}
                </p>
              </div>
            ))}
          </div>

          {/* Attendance table */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            {loading ? (
              <LoadingSpinner />
            ) : students.length === 0 ? (
              <p className="py-12 text-center text-slate-400">Chưa có học sinh trong lớp này.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Học sinh', 'Email', 'Trạng thái', 'Cập nhật'].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const status = getStatus(s.studentId);
                      const cfg = statusConfig[status];
                      const Icon = cfg.icon;
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                                {s.student?.fullName?.charAt(0) ?? 'S'}
                              </div>
                              <span className="font-medium text-slate-800">
                                {s.student?.fullName ?? `ID: ${s.studentId}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {s.student?.email ?? '–'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}
                            >
                              <Icon size={12} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {(['Present', 'Absent'] as AttendanceStatus[]).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(s.studentId, st)}
                                  disabled={status === st || !getAttendanceId(s.studentId)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                    status === st
                                      ? st === 'Present'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-red-500 text-white'
                                      : 'border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40'
                                  }`}
                                >
                                  {st === 'Present' ? 'Có mặt' : 'Vắng mặt'}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
