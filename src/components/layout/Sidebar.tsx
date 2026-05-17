'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/classes', label: 'Lớp học', icon: BookOpen },
  { href: '/dashboard/students', label: 'Học sinh', icon: Users },
  { href: '/dashboard/schedule', label: 'Lịch học', icon: Calendar },
  { href: '/dashboard/attendance', label: 'Điểm danh', icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setOpen(true)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-30 flex h-full flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl transition-all duration-300 ${
          open ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-5">
          {open && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-red-400" />
              <span className="text-lg font-bold tracking-tight">
                Class<span className="text-red-400">Mgmt</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-1.5 hover:bg-slate-700 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    {open && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-slate-700 p-4">
          {open && user && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-white truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300">
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={20} className="shrink-0" />
            {open && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
