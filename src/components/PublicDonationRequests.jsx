'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Droplet, MapPin, Calendar, Clock, Eye, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

function RequestCard({ request, onView }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-red-500/30 hover:bg-white/[0.045]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Recipient</p>
          <h3 className="text-lg font-bold text-white">{request.recipientName}</h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-sm font-bold text-white shadow-[0_0_16px_rgba(220,38,38,0.25)]">
          {request.bloodGroup}
        </span>
      </div>

      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin size={14} className="text-red-400 shrink-0" />
          {request.recipientUpazila}, {request.recipientDistrict}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar size={14} className="text-red-400 shrink-0" />
          {request.donationDate}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={14} className="text-red-400 shrink-0" />
          {request.donationTime}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onView(request._id)}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 text-sm font-semibold text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-500 hover:border-transparent transition-all duration-300"
      >
        <Eye size={15} />
        View Details
      </button>
    </div>
  );
}

/**
 * Route: /donation-requests (public)
 * Shows all PENDING donation requests. Clicking "View Details" sends logged-in
 * users to the private details page, and redirects guests to /login first
 * (per spec: details page is private).
 */
export default function PublicDonationRequests() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/donation-requests?status=pending');
        const data = await res.json();
        if (active) setRequests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load donation requests:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleView = (id) => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    router.push(`/dashboard/donation-requests/${id}`);
  };

  const filtered = requests.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.recipientName?.toLowerCase().includes(q) ||
      r.recipientDistrict?.toLowerCase().includes(q) ||
      r.recipientUpazila?.toLowerCase().includes(q) ||
      r.bloodGroup?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070D18]">
      {/* Ambient background, matching the rest of the site */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Blood Donation Requests
          </h1>

          <p className="text-slate-400">
            These are pending requests from people who need blood right now.
            Find one near you and help save a life.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-red-500/40 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
          >
            <ArrowLeft size={18} />
            Return to Home
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location, or blood group…"
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-16 text-center">
            <Droplet size={28} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">
              {search ? 'No requests match your search.' : 'No pending donation requests right now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((req) => (
              <RequestCard key={req._id} request={req} onView={handleView} />
            ))}
          </div>
        )}
      </div>

      F

    </div>

  );
}
