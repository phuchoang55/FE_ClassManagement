'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { classService } from '@/services/classService';
import { studentService } from '@/services/studentService';
import { User } from '@/types';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface FormData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teacherId: string;
}

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);
  const router = useRouter();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    Promise.all([classService.getById(classId), studentService.getAll()])
      .then(([cls, users]) => {
        setTeachers(users.filter((u) => u.role === 'Teacher' || u.role === 'Admin'));
        reset({
          name: cls.name,
          description: cls.description ?? '',
          startDate: cls.startDate ? cls.startDate.split('T')[0] : '',
          endDate: cls.endDate ? cls.endDate.split('T')[0] : '',
          teacherId: String(cls.teacherId),
        });
      })
      .catch(() => setError('Không thể tải thông tin lớp học.'))
      .finally(() => setFetchLoading(false));
  }, [classId, reset]);

  const validate = (data: FormData): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) errs.name = 'Tên lớp không được trống';
    if (!data.teacherId || data.teacherId === '') errs.teacherId = 'Vui lòng chọn giáo viên';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!validate(data)) return;
    setError('');
    try {
      await classService.update(classId, {
        ...data,
        teacherId: Number(data.teacherId),
      });
      router.push('/dashboard/classes');
    } catch {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/classes">
          <button className="rounded-xl p-2 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa lớp học</h2>
      </div>

      {error && <Alert message={error} variant="error" />}

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tên lớp *</label>
            <input
              id="edit-class-name"
              {...register('name')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày bắt đầu</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày kết thúc</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Giáo viên *</label>
            <select
              {...register('teacherId')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">-- Chọn giáo viên --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.email})
                </option>
              ))}
            </select>
            {validationErrors.teacherId && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.teacherId}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/dashboard/classes">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
