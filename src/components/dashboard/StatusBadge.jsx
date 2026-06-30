'use client';

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  inprogress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  canceled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const STATUS_LABELS = {
  pending: 'Pending',
  inprogress: 'In Progress',
  done: 'Done',
  canceled: 'Canceled',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
