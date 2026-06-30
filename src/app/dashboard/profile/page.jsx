'use client';

import { useAuth } from '@/hooks/useAuth';
import ProfileForm from '@/components/dashboard/ProfileForm';

export default function Page() {
  const { user, refetch } = useAuth();

  const handleSave = async (fields) => {
    const res = await fetch(`/api/users/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error('Update failed');
    refetch?.();
  };

  return <ProfileForm user={user} onSave={handleSave} />;
}
