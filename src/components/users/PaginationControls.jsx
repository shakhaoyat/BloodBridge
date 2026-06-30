'use client';

export default function PaginationControls({
      page,
      totalPages,
      onPageChange,
}) {
      if (totalPages <= 1) return null;

      return (
            <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="rounded-lg border border-white/10 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/10 transition"
                  >
                        Previous
                  </button>

                  <span className="text-sm text-slate-300">
                        Page {page} of {totalPages}
                  </span>

                  <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="rounded-lg border border-white/10 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/10 transition"
                  >
                        Next
                  </button>
            </div>
      );
}