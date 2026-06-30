'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, Wallet, Users2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GiveFundModal from './GiveFundModal';
import PaginationControls from '../users/PaginationControls';

const PAGE_SIZE = 10;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(amount, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export default function FundingPage() {
  const { user } = useAuth();
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [totals, setTotals] = useState({ totalFunding: 0, totalDonations: 0 });

  const loadFundings = async () => {
    setLoading(true);
    try {
      const [fundingsRes, totalsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fundings`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fundings/total`),
      ]);
      const fundingsData = await fundingsRes.json();
      const totalsData = await totalsRes.json();
      setFundings(Array.isArray(fundingsData) ? fundingsData : []);
      setTotals(totalsData || { totalFunding: 0, totalDonations: 0 });
    } catch (e) {
      console.error('Failed to load fundings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundings();
  }, []);

  const totalPages = Math.max(1, Math.ceil(fundings.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => fundings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [fundings, page]
  );

  const handleDonated = () => {
    setPage(1);
    loadFundings();
  };

  return (
    <div className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8  bg-[#070D18]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Funding</h1>
          <p className="mt-1 text-sm text-slate-400">All contributions made to BloodBridge.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:from-red-500 hover:to-rose-400 transition-all"
        >
          <Heart size={16} />
          Give fund
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wallet size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide">Total funds raised</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatAmount(totals.totalFunding)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users2 size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide">Total donations</span>
          </div>
          <p className="text-2xl font-bold text-white">{totals.totalDonations}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center text-slate-500">
          Loading fundings…
        </div>
      ) : pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center text-slate-400">
          No donations yet. Be the first to give a fund.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5 font-semibold">Donor</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {pageItems.map((f) => (
                    <tr key={f._id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">
                        {f.name || 'Anonymous'}
                      </td>
                      <td className="px-5 py-3.5 text-emerald-400 font-semibold whitespace-nowrap">
                        {formatAmount(f.amount, f.currency)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {formatDate(f.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {modalOpen && (
        <GiveFundModal
          user={user}
          onClose={() => setModalOpen(false)}
          onDonated={handleDonated}
        />
      )}
    </div>
  );
}
