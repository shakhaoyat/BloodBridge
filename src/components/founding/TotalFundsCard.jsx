'use client';

import { useEffect, useState } from 'react';
import { Wallet, Users, ClipboardList } from 'lucide-react';

function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Drop under the hero section to show total funds raised, total donors,
 * and total requests at a glance. Pulls from /api/dashboard/stats so the
 * numbers stay consistent with the rest of the app.
 */
export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(() => setError(true));
  }, []);

  const cards = [
    {
      key: 'totalFunding',
      label: 'Total funds raised',
      icon: Wallet,
      value: stats ? formatAmount(stats.totalFunding) : null,
    },
    {
      key: 'totalDonors',
      label: 'Total donors',
      icon: Users,
      value: stats ? formatNumber(stats.totalDonors) : null,
    },
    {
      key: 'totalRequests',
      label: 'Total requests',
      icon: ClipboardList,
      value: stats ? formatNumber(stats.totalRequests) : null,
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, value }) => (
        <div
          key={key}
          className="rounded-2xl border border-white/[0.08] bg-[#070D18] p-5"
        >
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Icon size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
          </div>
          {error ? (
            <p className="text-sm text-slate-500">Could not load.</p>
          ) : value === null ? (
            <div className="h-8 w-28 rounded-lg bg-white/[0.05] animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}