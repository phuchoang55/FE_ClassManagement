'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Users,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { classService } from '@/services/classService';
import { studentService } from '@/services/studentService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href: string;
}

export default function DashboardPage() {
  const { user, initFromStorage } = useAuthStore();
  const [classCount, setClassCount] = useState<number | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        if (user.role === 'Student') {
          const studentClasses = await studentService.getMyClasses();
          setMyClasses(studentClasses);
        } else if (user.role === 'Admin') {
          const students = await studentService.getAll();
          setClassCount(null);
          setStudentCount(students.length);
        } else if (user.role === 'Teacher') {
          const classes = await classService.getAll();
          setClassCount(classes.length);
          setStudentCount(null);
        }
      } catch {
        if (user.role === 'Student') {
          setError('Không thể tải danh sách lớp học của bạn.');
        } else {
          setClassCount(0);
          setStudentCount(0);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const stats: (StatCard & { roles: string[] })[] = [
    {
      label: 'Tổng người dùng',
      value: studentCount ?? '–',
      icon: Users,
      color: 'from-rose-500 to-rose-600',
      href: '/dashboard/students',
      roles: ['Admin']
    },
    {
      label: 'Tổng lớp học',
      value: classCount ?? '–',
      icon: BookOpen,
      color: 'from-red-500 to-red-600',
      href: '/dashboard/classes',
      roles: ['Teacher']
    },
    {
      label: 'Lịch hôm nay',
      value: 'Xem',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard/schedule',
      roles: ['Teacher']
    },
    {
      label: 'Điểm danh',
      value: 'Quản lý',
      icon: ClipboardCheck,
      color: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/attendance',
      roles: ['Teacher']
    },
  ];

  if (loading) return <LoadingSpinner />;

  const isStudent = user?.role === 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 text-white shadow-xl shadow-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-200 text-sm mb-1">Chào mừng trở lại 👋</p>
            <h2 className="text-3xl font-bold">{user?.fullName}</h2>
            <p className="text-red-200 mt-1">
              Vai trò: <span className="text-white font-semibold">{user?.role === 'Student' ? 'Học sinh' : user?.role}</span>
            </p>
          </div>
          <div className="hidden md:block">
            {isStudent ? <GraduationCap size={80} className="text-white/20" /> : <TrendingUp size={80} className="text-white/20" />}
          </div>
        </div>
      </div>

      {isStudent ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Lớp học của tôi</h3>
          {error && <Alert message={error} variant="error" />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myClasses.length === 0 ? (
              <p className="text-slate-500 col-span-full py-8 text-center bg-white rounded-2xl ring-1 ring-slate-100">
                Bạn chưa tham gia lớp học nào.
              </p>
            ) : (
              myClasses.map((cls) => (
                <Link key={cls.id} href={`/dashboard/classes/${cls.id}/student`}>
                  <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-lg hover:ring-red-200 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="inline-flex rounded-xl bg-red-50 p-3 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <BookOpen size={24} />
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-red-500 transition-colors" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1">{cls.name}</h4>
                    <p className="text-sm text-slate-500 mt-1 mb-4 flex-1 line-clamp-2">{cls.description || 'Không có mô tả'}</p>
                    <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
                      <span>GV: <span className="font-medium text-slate-600">{cls.teacherName || '–'}</span></span>
                      <span>{cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '–'}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats
              .filter((item) => item.roles.includes(user?.role as string))
              .map(({ label, value, icon: Icon, color, href }) => (
              <Link key={label} href={href}>
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-lg hover:ring-red-200 transition-all duration-300 cursor-pointer">
                  <div
                    className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-10 transition-all group-hover:opacity-20`}
                  />
                  <div
                    className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Truy cập nhanh</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Tạo lớp mới', href: '/dashboard/classes', icon: BookOpen, roles: ['Teacher'] },
                { label: 'Thêm người dùng', href: '/dashboard/students', icon: Users, roles: ['Admin'] },
                { label: 'Xem lịch học', href: '/dashboard/schedule', icon: Calendar, roles: ['Teacher'] },
                { label: 'Điểm danh hôm nay', href: '/dashboard/attendance', icon: ClipboardCheck, roles: ['Teacher'] },
              ]
                .filter(item => item.roles.includes(user?.role as string))
                .map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-red-50 hover:border-red-200 transition-all duration-200 cursor-pointer text-center">
                    <Icon size={20} className="text-red-500" />
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
