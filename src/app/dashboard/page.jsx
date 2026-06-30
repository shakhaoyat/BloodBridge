'use client';

import { useAuth } from '@/hooks/useAuth';
import DashboardHome from '@/components/dashboard/DashboardHome';

export default function Page() {
  const { user } = useAuth();
  return <DashboardHome role={user.role} userName={user.name} userEmail={user.email} />;
}
