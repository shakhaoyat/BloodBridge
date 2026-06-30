'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DonationRequestForm from '@/components/dashboard/DonationRequestForm';

export default function Page() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/donation-requests/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error('Failed to load donation request:', e));
  }, [id]);

  const handleUpdate = async (payload) => {
    const res = await fetch(`/api/donation-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update request');
  };

  if (!data) {
    return <div className="text-slate-500 text-center py-20">Loading…</div>;
  }

  return <DonationRequestForm mode="edit" initialData={data} onSubmit={handleUpdate} />;
}
