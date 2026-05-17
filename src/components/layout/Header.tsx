'use client';

import { Bell, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  
  const isStudent = user?.role === 'Student';

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* Notification */}
        <button className="relative rounded-xl p-2 hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-sm font-bold text-white shadow-md">
            {user?.fullName?.charAt(0) ?? 'U'}
          </div>
          {isStudent && (
            <button 
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
