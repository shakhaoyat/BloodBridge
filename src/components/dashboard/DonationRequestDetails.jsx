'use client';

import { useState } from 'react';
import { Droplet, MapPin, Calendar, Clock, Building2, User, Mail, HeartHandshake, X } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';

function DonateModal({ open, onClose, donor, onConfirm, submitting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0c1424] p-6 sm:p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shadow-[0_0_18px_rgba(220,38,38,0.3)]">
            <HeartHandshake size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Confirm Donation</h3>
            <p className="text-xs text-slate-500">Your details will be shared with the requester.</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Donor Name</label>
            <input value={donor.name} readOnly className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-slate-300 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Donor Email</label>
            <input value={donor.email} readOnly className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-slate-300 text-sm cursor-not-allowed" />
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all disabled:opacity-70"
        >
          {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Donation'}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-0">
      <Icon size={16} className="mt-0.5 text-red-400 shrink-0" />
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-medium text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/**
 * request: full donation request document
 * donor: { name, email } of the logged-in user
 * onDonate: async () => void — caller PATCHes status to "inprogress" + attaches donor info
 */
export default function DonationRequestDetails({ request, donor, onDonate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!request) {
    return <div className="text-center py-20 text-slate-500">Donation request not found.</div>;
  }

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onDonate();
      toast.success('Thank you! Your donation has been confirmed.');
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to confirm donation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Donation Request Details</h1>
        <StatusBadge status={request.donationStatus} />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        <InfoRow icon={User} label="Recipient Name" value={request.recipientName} />
        <InfoRow icon={MapPin} label="Recipient Location" value={`${request.recipientUpazila}, ${request.recipientDistrict}`} />
        <InfoRow icon={Building2} label="Hospital" value={request.hospitalName} />
        <InfoRow icon={MapPin} label="Full Address" value={request.fullAddress} />
        <InfoRow icon={Droplet} label="Blood Group" value={request.bloodGroup} />
        <InfoRow icon={Calendar} label="Donation Date" value={request.donationDate} />
        <InfoRow icon={Clock} label="Donation Time" value={request.donationTime} />
        <InfoRow icon={Mail} label="Requester" value={`${request.requesterName} · ${request.requesterEmail}`} />

        <div className="pt-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Message</p>
          <p className="text-sm text-slate-300 leading-relaxed">{request.requestMessage}</p>
        </div>

        {request.donationStatus === 'inprogress' && request.donorName && (
          <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 flex items-center gap-2.5">
            <User size={15} className="text-blue-400" />
            <p className="text-sm text-blue-300">
              Donor confirmed: <span className="font-medium">{request.donorName}</span> ({request.donorEmail})
            </p>
          </div>
        )}

        {request.donationStatus === 'pending' && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300"
          >
            <HeartHandshake size={18} />
            Donate
          </button>
        )}
      </div>

      <DonateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        donor={donor}
        onConfirm={handleConfirm}
        submitting={submitting}
      />
    </div>
  );
}
