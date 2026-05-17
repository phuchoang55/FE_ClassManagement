'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { isInitialized, isAuthenticated, user, initFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initFromStorage();
    }
  }, [initFromStorage, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  if (!isInitialized) return null;
  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
