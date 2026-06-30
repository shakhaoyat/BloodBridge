'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/lib/auth-client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Layout({ children }) {
      const router = useRouter();
      const { user, loading } = useAuth();

      if (loading) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-[#070D18]">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
                  </div>
            );
      }

      if (!user) {
            router.push('/login');
            return null;
      }

      const handleLogout = async () => {
            await authClient.signOut();
            router.push('/login');
      };

      // user is guaranteed non-null below this point (AuthProvider lives in the
      // root layout), so every page under /dashboard can safely read user.email etc.
      return (
            <DashboardLayout role={user.role} userName={user.name} userAvatar={user.image} onLogout={handleLogout}>
                  {children}
            </DashboardLayout>
      );
}