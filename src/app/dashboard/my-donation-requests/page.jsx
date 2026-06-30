'use client';

import { useAuth } from '@/hooks/useAuth';
import DonationRequestsPage from '@/components/dashboard/DonationRequestsPage';

export default function Page() {
  const { user } = useAuth();
  return <DonationRequestsPage role="donor" userEmail={user.email} />;
}
