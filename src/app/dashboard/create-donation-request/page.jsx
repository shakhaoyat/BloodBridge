'use client';

import { useAuth } from '@/hooks/useAuth';
import DonationRequestForm from '@/components/dashboard/DonationRequestForm';

export default function Page() {
  const { user } = useAuth();

  const handleCreate = async (payload) => {
    const res = await fetch('/api/donation-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Failed to create request');
    }
  };

  return (
    <DonationRequestForm
      mode="create"
      requester={{ name: user.name, email: user.email }}
      onSubmit={handleCreate}
    />
  );
}
