import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-3xl bg-red-100 p-6">
            <ShieldAlert size={56} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Truy cập bị từ chối</h1>
        <p className="text-slate-500">Bạn không có quyền truy cập vào trang này.</p>
        <Link href="/dashboard">
          <button className="mt-4 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Về trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
}
