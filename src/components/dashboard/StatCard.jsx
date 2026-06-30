'use client';

export default function StatCard({ icon: Icon, label, value, accent = 'red' }) {
  const accents = {
    red: 'from-red-600 to-rose-500 shadow-[0_0_24px_rgba(220,38,38,0.25)]',
    amber: 'from-amber-500 to-orange-500 shadow-[0_0_24px_rgba(245,158,11,0.25)]',
    emerald: 'from-emerald-500 to-teal-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.045]">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]}`}>
        <Icon size={22} className="text-white" />
      </div>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}
