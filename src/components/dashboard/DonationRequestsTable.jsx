'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, Check, X as XIcon, User } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Generic donation requests table.
 *
 * permissions:
 *  - canEdit / canDelete: show edit/delete icon buttons (donor on own requests, admin on all)
 *  - canSetDoneCanceled: show done/cancel buttons when status is "inprogress" (donor, admin)
 *  - canChangeStatusDropdown: volunteers can ONLY update status, via a select dropdown
 */
export default function DonationRequestsTable({
  requests = [],
  permissions = {},
  onDelete,
  onStatusChange,
  editHref = (id) => `/dashboard/edit-donation-request/${id}`,
  viewHref = (id) => `/dashboard/donation-requests/${id}`,
}) {
  const { canEdit = false, canDelete = false, canSetDoneCanceled = false, canChangeStatusDropdown = false } = permissions;
  const [confirmId, setConfirmId] = useState(null);

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center">
        <p className="text-slate-400">No donation requests to show yet.</p>
      </div>
    );
  }

  const handleDeleteClick = (id) => {
    if (confirmId === id) {
      onDelete?.(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3.5 font-semibold">Recipient</th>
              <th className="px-5 py-3.5 font-semibold">Location</th>
              <th className="px-5 py-3.5 font-semibold">Date</th>
              <th className="px-5 py-3.5 font-semibold">Time</th>
              <th className="px-5 py-3.5 font-semibold">Blood Group</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Donor Info</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {requests.map((req) => {
              const isInProgress = req.donationStatus === 'inprogress';
              return (
                <tr key={req._id} className="transition-colors hover:bg-white/[0.025]">
                  <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{req.recipientName}</td>
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                    {req.recipientUpazila}, {req.recipientDistrict}
                  </td>
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{req.donationDate}</td>
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{req.donationTime}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {canChangeStatusDropdown ? (
                      <select
                        value={req.donationStatus}
                        onChange={(e) => onStatusChange?.(req._id, e.target.value)}
                        className="rounded-lg border border-white/[0.1] bg-[#0c1424] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/50"
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    ) : (
                      <StatusBadge status={req.donationStatus} />
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {isInProgress && req.donorName ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User size={13} className="text-red-400" />
                        <span className="text-slate-300">{req.donorName}</span>
                        <span className="text-slate-600">·</span>
                        <span>{req.donorEmail}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {isInProgress && canSetDoneCanceled && (
                        <>
                          <button
                            type="button"
                            title="Mark as done"
                            onClick={() => onStatusChange?.(req._id, 'done')}
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            title="Cancel"
                            onClick={() => onStatusChange?.(req._id, 'canceled')}
                            className="rounded-lg border border-slate-500/20 bg-slate-500/10 p-1.5 text-slate-400 hover:bg-slate-500/20 transition-colors"
                          >
                            <XIcon size={14} />
                          </button>
                        </>
                      )}
                      <Link
                        href={viewHref(req._id)}
                        title="View details"
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <Eye size={14} />
                      </Link>
                      {canEdit && (
                        <Link
                          href={editHref(req._id)}
                          title="Edit request"
                          className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          title={confirmId === req._id ? 'Click again to confirm' : 'Delete request'}
                          onClick={() => handleDeleteClick(req._id)}
                          onBlur={() => setConfirmId(null)}
                          className={`rounded-lg border p-1.5 transition-colors ${
                            confirmId === req._id
                              ? 'border-red-500/40 bg-red-500/20 text-red-300'
                              : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
