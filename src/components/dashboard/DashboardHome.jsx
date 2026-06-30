'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Wallet, Droplet, ArrowRight, PlusCircle } from 'lucide-react';
import StatCard from './StatCard';
import DonationRequestsTable from './DonationRequestsTable';

/**
 * Dashboard home page, route: /dashboard
 *
 * role: 'donor' | 'volunteer' | 'admin'
 * userName: logged-in user's display name
 *
 * Data fetching is left to you to wire to your API — pass in already-fetched
 * data via props, or adapt the two effects below to your data layer
 * (e.g. swap fetch() calls for your existing axios/react-query hooks).
 */
export default function DashboardHome({ role = 'donor', userName = '', userEmail = '' }) {
  const [recentRequests, setRecentRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(role === 'donor');

  const [stats, setStats] = useState({ totalDonors: 0, totalFunding: 0, totalRequests: 0 });
  const [statsLoading, setStatsLoading] = useState(role !== 'donor');

  // Donor: fetch up to 3 most recent own requests
  useEffect(() => {
    if (role !== 'donor' || !userEmail) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/donation-requests?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (active) setRecentRequests(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        console.error('Failed to load recent donation requests:', e);
      } finally {
        if (active) setRequestsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [role, userEmail]);

  // Admin / Volunteer: fetch dashboard stats
  useEffect(() => {
    if (role === 'donor') return;
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (active) setStats(data);
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        if (active) setStatsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [role]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome back, <span className="text-red-400">{userName || 'there'}</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          {role === 'donor'
            ? 'Here’s a snapshot of your recent donation requests.'
            : 'Here’s how BloodBridge is doing today.'}
        </p>
      </div>

      {/* Admin / Volunteer: stat cards */}
      {role !== 'donor' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={Users} label="Total Donors" value={statsLoading ? '—' : stats.totalDonors} accent="red" />
          <StatCard
            icon={Wallet}
            label="Total Funding"
            value={statsLoading ? '—' : `৳${stats.totalFunding}`}
            accent="amber"
          />
          <StatCard
            icon={Droplet}
            label="Blood Requests"
            value={statsLoading ? '—' : stats.totalRequests}
            accent="emerald"
          />
        </div>
      )}

      {/* Donor: recent requests */}
      {role === 'donor' && !requestsLoading && recentRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Donation Requests</h2>
            <Link
              href="/dashboard/create-donation-request"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(220,38,38,0.25)] hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] transition-shadow"
            >
              <PlusCircle size={15} />
              New Request
            </Link>
          </div>

          <DonationRequestsTable
            requests={recentRequests}
            permissions={{ canEdit: true, canDelete: true, canSetDoneCanceled: true }}
          />

          <div className="flex justify-center pt-1">
            <Link
              href="/dashboard/my-donation-requests"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              View my all requests
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* Donor with zero requests yet: gentle nudge instead of empty table */}
      {role === 'donor' && !requestsLoading && recentRequests.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-12 text-center">
          <p className="text-slate-400 mb-4">You haven’t made any donation requests yet.</p>
          <Link
            href="/dashboard/create-donation-request"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(220,38,38,0.25)] hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] transition-shadow"
          >
            <PlusCircle size={15} />
            Create your first request
          </Link>
        </div>
      )}
    </div>
  );
}
