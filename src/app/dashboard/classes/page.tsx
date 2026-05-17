'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { classService } from '@/services/classService';
import { Class } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function ClassesPage() {
  const { user, initFromStorage } = useAuthStore();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    classService
      .getAll()
      .then(setClasses)
      .catch(() => setError('Không thể tải danh sách lớp học.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa lớp học này?')) return;
    try {
      await classService.delete(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Xóa lớp học thất bại.');
    }
  };

  const isAdmin = user?.role === 'Admin';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Danh sách lớp học</h2>
          <p className="text-sm text-slate-500 mt-0.5">{classes.length} lớp học</p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/classes/create">
            <button
              id="btn-create-class"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Plus size={18} />
              Tạo lớp mới
            </button>
          </Link>
        )}
      </div>

      {error && <Alert message={error} variant="error" />}

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Tên lớp', 'Giáo viên', 'Ngày bắt đầu', 'Ngày kết thúc', 'Hành động'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Chưa có lớp học nào. Hãy tạo lớp đầu tiên!
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/classes/${cls.id}`}>
                        <div className="flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                          {cls.name}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {cls.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {cls.description}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {cls.teacher?.fullName ?? `ID: ${cls.teacherId}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {cls.startDate
                        ? new Date(cls.startDate).toLocaleDateString('vi-VN')
                        : '–'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {cls.endDate
                        ? new Date(cls.endDate).toLocaleDateString('vi-VN')
                        : '–'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <>
                            <Link href={`/dashboard/classes/${cls.id}/edit`}>
                              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <Pencil size={16} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
