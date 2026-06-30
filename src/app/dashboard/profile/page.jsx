'use client';

import { useAuth } from '@/hooks/useAuth';
import ProfileForm from '@/components/dashboard/ProfileForm';

export default function Page() {
  const { user, loading, refetch } = useAuth();

  const handleSave = async (fields) => {
    if (!user?.id) {
      throw new Error('Could not find your account. Try refreshing the page.');
    }

    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      let message = `Update failed (${res.status})`;
      try {
        const data = await res.json();
        message = data?.error || data?.message || message;
      } catch {
        // response wasn't JSON, fall back to status text
        message = res.statusText || message;
      }
      throw new Error(message);
    }

    refetch?.();
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="h-8 w-40 rounded-lg bg-white/[0.05] animate-pulse mb-2" />
        <div className="h-4 w-64 rounded-lg bg-white/[0.05] animate-pulse mb-8" />
        <div className="h-80 rounded-2xl border border-white/[0.08] bg-white/[0.02] animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-slate-400">
        Could not load your profile. Try refreshing the page.
      </p>
    );
  }

  return <ProfileForm user={user} onSave={handleSave} />;
}