'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/classes': 'Quản lý lớp học',
  '/dashboard/students': 'Quản lý học sinh',
  '/dashboard/schedule': 'Lịch học',
  '/dashboard/attendance': 'Điểm danh',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const title = pageTitles[pathname] ?? 'ClassManagement';
  const isStudent = user?.role === 'Student';

  if (!mounted) return null; // Avoid hydration mismatch on role-based rendering

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {!isStudent && <Sidebar />}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isStudent ? 'w-full' : 'lg:pl-64'}`}>
          <Header title={title} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
