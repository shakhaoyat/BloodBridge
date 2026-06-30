'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, ShieldCheck, UserCog, Ban, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PaginationControls from './PaginationControls';

const PAGE_SIZE = 10;

function ActionMenu({ user, onAction }) {
  const [open, setOpen] = useState(false);

  const items = [
    user.status === 'Active'
      ? { key: 'block', label: 'Block User', icon: Ban, danger: true }
      : { key: 'unblock', label: 'Unblock User', icon: CheckCircle2, danger: false },
    user.role !== 'volunteer' && user.role !== 'admin'
      ? { key: 'make-volunteer', label: 'Make Volunteer', icon: UserCog, danger: false }
      : null,
    user.role !== 'admin' ? { key: 'make-admin', label: 'Make Admin', icon: ShieldCheck, danger: false } : null,
  ].filter(Boolean);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c1424] shadow-xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onAction(item.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AllUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const loadUsers = async (status = statusFilter) => {
    setLoading(true);
    try {
      const params = status !== 'all' ? `?status=${status}` : '';
      const res = await fetch(`/api/users${params}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load users:', e);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pageItems = useMemo(() => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [users, page]);

  const handleAction = async (id, key) => {
    const patch =
      key === 'block'
        ? { status: 'Blocked' }
        : key === 'unblock'
          ? { status: 'Active' }
          : key === 'make-volunteer'
            ? { role: 'volunteer' }
            : { role: 'admin' };

    // optimistic update
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...patch } : u)));

    try {
      const res = await fetch(`/api/users/${id}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        let message = `Update failed (${res.status})`;
        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }
      toast.success('User updated.');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to update user. Reverting.');
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">All Users</h1>
        <p className="mt-1 text-sm text-slate-400">Manage donor, volunteer, and admin accounts.</p>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'blocked'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${statusFilter === s
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-[0_0_14px_rgba(220,38,38,0.3)]'
                : 'border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center text-slate-500">
          Loading users…
        </div>
      ) : pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center text-slate-400">
          No users found.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5 font-semibold">User</th>
                    <th className="px-5 py-3.5 font-semibold">Email</th>
                    <th className="px-5 py-3.5 font-semibold">Role</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {pageItems.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.08]">
                            {u.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                                {u.name?.[0]?.toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-white whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs font-medium capitalize text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${u.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ActionMenu user={u} onAction={(key) => handleAction(u._id, key)} />
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
    </div>
  );
}