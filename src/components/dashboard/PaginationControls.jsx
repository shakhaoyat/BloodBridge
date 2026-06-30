'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-white/[0.03] disabled:hover:text-slate-400 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-slate-600">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              p === page
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-[0_0_14px_rgba(220,38,38,0.3)]'
                : 'border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-white/[0.03] disabled:hover:text-slate-400 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
