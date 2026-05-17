'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { studentService } from '@/services/studentService';
import { User } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const roleBadge: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Teacher: 'bg-rose-100 text-rose-700',
  Student: 'bg-emerald-100 text-emerald-700',
};

export default function StudentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentService
      .getAll()
      .then(setUsers)
      .catch(() => setError('Không thể tải danh sách người dùng.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý học sinh</h2>
          <p className="text-sm text-slate-500 mt-0.5">{users.filter(u => u.role === 'Student').length} học sinh</p>
        </div>
        <button
          id="btn-add-user"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:from-red-700 hover:to-rose-700 transition-all"
        >
          <UserPlus size={18} />
          Thêm người dùng
        </button>
      </div>

      {error && <Alert message={error} variant="error" />}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="search-users"
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-red-200 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 text-lg font-bold text-white shadow-md">
                {user.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                roleBadge[user.role] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {user.role === 'Admin' ? 'Quản trị viên' : user.role === 'Teacher' ? 'Giáo viên' : 'Học sinh'}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            Không tìm thấy người dùng nào.
          </div>
        )}
      </div>
    </div>
  );
}
