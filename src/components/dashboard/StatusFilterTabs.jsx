'use client';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];

export default function StatusFilterTabs({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
            value === f.value
              ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-[0_0_14px_rgba(220,38,38,0.3)]'
              : 'border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
