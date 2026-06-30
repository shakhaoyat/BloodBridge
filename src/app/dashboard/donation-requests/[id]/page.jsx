'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DonationRequestDetails from '@/components/dashboard/DonationRequestDetails';

export default function Page() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/donation-requests/${id}`);
      const data = await res.json();
      setRequest(data);
    } catch (e) {
      console.error('Failed to load donation request:', e);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDonate = async () => {
    await fetch(`/api/donation-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donationStatus: 'inprogress',
        donorName: user.name,
        donorEmail: user.email,
      }),
    });
    await load();
  };

  return (
    <DonationRequestDetails
      request={request}
      donor={{ name: user.name, email: user.email }}
      onDonate={handleDonate}
    />
  );
}
