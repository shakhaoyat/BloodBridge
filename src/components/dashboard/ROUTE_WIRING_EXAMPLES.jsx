/**
 * EXAMPLE ROUTE WIRING
 * ---------------------------------------------------------------------------
 * Copy each section below into the matching app/ file. Adjust the `useAuth`
 * import to whatever your auth-client hook is actually called/shaped like.
 * ---------------------------------------------------------------------------
 */

// =============================================================================
// app/dashboard/layout.jsx
// =============================================================================
('use client');
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // your session hook, returns { user, loading }
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authClient } from '@/lib/auth-client';

export function DashboardRootLayout({ children }) {
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

  return (
    <DashboardLayout role={user.role} userName={user.name} userAvatar={user.image} onLogout={handleLogout}>
      {children}
    </DashboardLayout>
  );
}

// =============================================================================
// app/dashboard/page.jsx
// =============================================================================
import DashboardHome from '@/components/dashboard/DashboardHome';

export function DashboardHomePage() {
  const { user } = useAuth();
  return <DashboardHome role={user.role} userName={user.name} userEmail={user.email} />;
}

// =============================================================================
// app/dashboard/profile/page.jsx
// =============================================================================
import ProfileForm from '@/components/dashboard/ProfileForm';

export function ProfilePage() {
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

// =============================================================================
// app/dashboard/my-donation-requests/page.jsx
// =============================================================================
import DonationRequestsPage from '@/components/dashboard/DonationRequestsPage';

export function MyDonationRequestsPage() {
  const { user } = useAuth();
  return <DonationRequestsPage role="donor" userEmail={user.email} />;
}

// =============================================================================
// app/dashboard/all-blood-donation-request/page.jsx
// (shared by admin + volunteer — table permissions differ by role internally)
// =============================================================================
export function AllBloodDonationRequestPage() {
  const { user } = useAuth(); // user.role is 'admin' or 'volunteer'
  return <DonationRequestsPage role={user.role} />;
}

// =============================================================================
// app/dashboard/create-donation-request/page.jsx
// =============================================================================
import DonationRequestForm from '@/components/dashboard/DonationRequestForm';

export function CreateDonationRequestPage() {
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
    <DonationRequestForm mode="create" requester={{ name: user.name, email: user.email }} onSubmit={handleCreate} />
  );
}

// =============================================================================
// app/dashboard/edit-donation-request/[id]/page.jsx
// =============================================================================
('use client');
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export function EditDonationRequestPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/donation-requests/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  const handleUpdate = async (payload) => {
    const res = await fetch(`/api/donation-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update request');
  };

  if (!data) return <div className="text-slate-500 text-center py-20">Loading…</div>;

  return <DonationRequestForm mode="edit" initialData={data} onSubmit={handleUpdate} />;
}

// =============================================================================
// app/dashboard/donation-requests/[id]/page.jsx
// =============================================================================
import DonationRequestDetails from '@/components/dashboard/DonationRequestDetails';

export function DonationRequestDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);

  const load = () => fetch(`/api/donation-requests/${id}`).then((r) => r.json()).then(setRequest);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    <DonationRequestDetails request={request} donor={{ name: user.name, email: user.email }} onDonate={handleDonate} />
  );
}

// =============================================================================
// app/dashboard/all-users/page.jsx
// =============================================================================
import AllUsersTable from '@/components/dashboard/AllUsersTable';

export function AllUsersPage() {
  return <AllUsersTable />;
}
