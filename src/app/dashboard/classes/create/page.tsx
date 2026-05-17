'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { classService } from '@/services/classService';
import { studentService } from '@/services/studentService';
import { User } from '@/types';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';

interface FormData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teacherId: string; // string from select, convert before submit
}

export default function CreateClassPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    studentService
      .getAll()
      .then((users) => setTeachers(users.filter((u) => u.role === 'Teacher' || u.role === 'Admin')))
      .catch(() => {});
  }, []);

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
      await classService.create({
        ...data,
        teacherId: Number(data.teacherId),
      });
      router.push('/dashboard/classes');
    } catch {
      setError('Tạo lớp học thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/classes">
          <button className="rounded-xl p-2 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Tạo lớp học mới</h2>
      </div>

      {error && <Alert message={error} variant="error" />}

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tên lớp <span className="text-red-500">*</span>
            </label>
            <input
              id="class-name"
              {...register('name')}
              placeholder="VD: Lớp Toán 10A"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              id="class-description"
              {...register('description')}
              rows={3}
              placeholder="Mô tả ngắn về lớp học..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày bắt đầu</label>
              <input
                id="class-start-date"
                type="date"
                {...register('startDate')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày kết thúc</label>
              <input
                id="class-end-date"
                type="date"
                {...register('endDate')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Giáo viên <span className="text-red-500">*</span>
            </label>
            <select
              id="class-teacher"
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
              id="btn-submit-class"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Tạo lớp học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
