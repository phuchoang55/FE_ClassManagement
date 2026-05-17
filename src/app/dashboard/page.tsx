'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { classService } from '@/services/classService';
import { studentService } from '@/services/studentService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classes, students] = await Promise.all([
          classService.getAll(),
          studentService.getAll(),
        ]);
        setClassCount(classes.length);
        setStudentCount(students.length);
      } catch {
        setClassCount(0);
        setStudentCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats: StatCard[] = [
    {
      label: 'Tổng lớp học',
      value: classCount ?? '–',
      icon: BookOpen,
      color: 'from-red-500 to-red-600',
      href: '/dashboard/classes',
    },
    {
      label: 'Tổng học sinh',
      value: studentCount ?? '–',
      icon: Users,
      color: 'from-rose-500 to-rose-600',
      href: '/dashboard/students',
    },
    {
      label: 'Lịch hôm nay',
      value: 'Xem',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard/schedule',
    },
    {
      label: 'Điểm danh',
      value: 'Quản lý',
      icon: ClipboardCheck,
      color: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/attendance',
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 text-white shadow-xl shadow-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-200 text-sm mb-1">Chào mừng trở lại 👋</p>
            <h2 className="text-3xl font-bold">{user?.fullName}</h2>
            <p className="text-red-200 mt-1">
              Vai trò: <span className="text-white font-semibold">{user?.role}</span>
            </p>
          </div>
          <div className="hidden md:block">
            <TrendingUp size={80} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
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
            { label: 'Tạo lớp mới', href: '/dashboard/classes', icon: BookOpen },
            { label: 'Thêm học sinh', href: '/dashboard/students', icon: Users },
            { label: 'Xem lịch học', href: '/dashboard/schedule', icon: Calendar },
            { label: 'Điểm danh hôm nay', href: '/dashboard/attendance', icon: ClipboardCheck },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href}>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-red-50 hover:border-red-200 transition-all duration-200 cursor-pointer text-center">
                <Icon size={20} className="text-red-500" />
                <span className="text-xs font-medium text-slate-600">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
