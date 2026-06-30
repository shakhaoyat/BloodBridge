'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import DonationRequestsTable from './DonationRequestsTable';
import StatusFilterTabs from './StatusFilterTabs';
import PaginationControls from './PaginationControls';

const PAGE_SIZE = 10;

/**
 * Route: /dashboard/my-donation-requests        -> <DonationRequestsPage role="donor" userEmail={user.email} />
 * Route: /dashboard/all-blood-donation-request   -> <DonationRequestsPage role="admin" /> or role="volunteer"
 *
 * Permissions differ by role:
 *  - donor: edit/delete own requests, set done/canceled when in-progress
 *  - admin: edit/delete ANY request, set done/canceled
 *  - volunteer: can ONLY change status (no edit/delete)
 */
export default function DonationRequestsPage({ role = 'donor', userEmail = '' }) {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const isOwnRequestsOnly = role === 'donor';
  const title = isOwnRequestsOnly ? 'My Donation Requests' : 'All Blood Donation Requests';

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams();
        if (isOwnRequestsOnly && userEmail) params.set('email', userEmail);
        if (statusFilter !== 'all') params.set('status', statusFilter);

        const res = await fetch(`/api/donation-requests?${params.toString()}`);
        const data = await res.json();
        if (active) setAllRequests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load donation requests:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isOwnRequestsOnly, userEmail, statusFilter]);

  // Reset to page 1 whenever the filter changes
  useEffect(() => setPage(1), [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(allRequests.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => allRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [allRequests, page]
  );

  const permissions =
    role === 'admin'
      ? { canEdit: true, canDelete: true, canSetDoneCanceled: true }
      : role === 'volunteer'
      ? { canChangeStatusDropdown: true }
      : { canEdit: true, canDelete: true, canSetDoneCanceled: true }; // donor, own requests only

  const handleStatusChange = async (id, donationStatus) => {
    // optimistic update
    setAllRequests((prev) => prev.map((r) => (r._id === id ? { ...r, donationStatus } : r)));
    try {
      await fetch(`/api/donation-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationStatus }),
      });
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleDelete = async (id) => {
    const prev = allRequests;
    setAllRequests((p) => p.filter((r) => r._id !== id));
    try {
      await fetch(`/api/donation-requests/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete request:', e);
      setAllRequests(prev); // revert on failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {isOwnRequestsOnly
              ? 'Track and manage every request you’ve created.'
              : 'Manage donation requests across the platform.'}
          </p>
        </div>
        {isOwnRequestsOnly && (
          <Link
            href="/dashboard/create-donation-request"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(220,38,38,0.25)] hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] transition-shadow"
          >
            <PlusCircle size={15} />
            New Request
          </Link>
        )}
      </div>

      <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

      {loading ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center text-slate-500">
          Loading requests…
        </div>
      ) : (
        <>
          <DonationRequestsTable
            requests={pageItems}
            permissions={permissions}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
