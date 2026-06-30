'use client';

import { useAuth } from '@/hooks/useAuth';
import DonationRequestsPage from '@/components/dashboard/DonationRequestsPage';

export default function Page() {
  const { user } = useAuth(); // user.role is 'admin' or 'volunteer'
  return <DonationRequestsPage role={user.role} />;
}
