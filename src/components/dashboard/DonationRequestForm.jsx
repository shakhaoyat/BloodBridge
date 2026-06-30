'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Droplet, MapPin, Building2, Calendar, Clock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const labelCls = 'block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase';
const inputCls =
  'w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300';
const selectCls =
  'w-full appearance-none pl-4 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300 cursor-pointer disabled:opacity-40';
const readOnlyCls =
  'w-full px-4 py-3 bg-white/[0.015] border border-white/[0.06] rounded-xl text-slate-500 cursor-not-allowed';

/**
 * mode: 'create' | 'edit'
 * requester: { name, email } of the logged-in user (read-only fields)
 * initialData: existing request, required when mode === 'edit'
 * onSubmit: async (payload) => void  — caller decides the POST/PUT call
 */
export default function DonationRequestForm({ mode = 'create', requester, initialData, onSubmit }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [districtsInfo, setDistrictsInfo] = useState([]);
  const [upazilasInfo, setUpazilasInfo] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [locationLoading, setLocationLoading] = useState(true);

  const [form, setForm] = useState({
    recipientName: initialData?.recipientName || '',
    recipientDistrict: initialData?.recipientDistrict || '',
    recipientUpazila: initialData?.recipientUpazila || '',
    hospitalName: initialData?.hospitalName || '',
    fullAddress: initialData?.fullAddress || '',
    bloodGroup: initialData?.bloodGroup || '',
    donationDate: initialData?.donationDate || '',
    donationTime: initialData?.donationTime || '',
    requestMessage: initialData?.requestMessage || '',
  });

  useEffect(() => {
    async function loadLocation() {
      try {
        const [dRes, uRes] = await Promise.all([
          fetch('/location/districts.json'),
          fetch('/location/upazilas.json'),
        ]);
        const dJson = await dRes.json();
        const uJson = await uRes.json();
        setDistrictsInfo(dJson[2].data);
        setUpazilasInfo(uJson[2].data);
      } catch (e) {
        console.error('Failed to load location data:', e);
        toast.error('Could not load location data. Please refresh the page.');
      } finally {
        setLocationLoading(false);
      }
    }
    loadLocation();
  }, []);

  useEffect(() => {
    if (!form.recipientDistrict || !districtsInfo.length) {
      setFilteredUpazilas([]);
      return;
    }
    const selected = districtsInfo.find((d) => d.name === form.recipientDistrict);
    if (!selected) return;
    setFilteredUpazilas(upazilasInfo.filter((u) => u.district_id === selected.id));
  }, [form.recipientDistrict, districtsInfo, upazilasInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'recipientDistrict' ? { recipientUpazila: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      'recipientName',
      'recipientDistrict',
      'recipientUpazila',
      'hospitalName',
      'fullAddress',
      'bloodGroup',
      'donationDate',
      'donationTime',
      'requestMessage',
    ];
    if (required.some((field) => !form[field])) {
      toast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload =
        mode === 'create'
          ? { ...form, requesterName: requester?.name, requesterEmail: requester?.email }
          : { ...form };

      await onSubmit(payload);
      toast.success(mode === 'create' ? 'Donation request created.' : 'Donation request updated.');
      router.push('/dashboard/my-donation-requests');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
        {mode === 'create' ? 'Create Donation Request' : 'Edit Donation Request'}
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        {mode === 'create'
          ? 'Tell us who needs blood and where donors should go.'
          : 'Update the details of this donation request.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        {/* Requester (read only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Requester Name</label>
            <input type="text" value={requester?.name || ''} readOnly className={readOnlyCls} />
          </div>
          <div>
            <label className={labelCls}>Requester Email</label>
            <input type="text" value={requester?.email || ''} readOnly className={readOnlyCls} />
          </div>
        </div>

        {/* Recipient name + blood group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={form.recipientName}
              onChange={handleChange}
              placeholder="Patient's full name"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Blood Group</label>
            <div className="relative">
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={selectCls}>
                <option value="" disabled className="bg-[#091120]">Select group</option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g} className="bg-[#091120]">{g}</option>
                ))}
              </select>
              <Droplet size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Recipient district + upazila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Recipient District</label>
            <div className="relative">
              <select
                name="recipientDistrict"
                value={form.recipientDistrict}
                onChange={handleChange}
                disabled={locationLoading}
                className={selectCls}
              >
                <option value="" disabled className="bg-[#091120]">
                  {locationLoading ? 'Loading…' : 'Select district'}
                </option>
                {districtsInfo.map((d) => (
                  <option key={d.id} value={d.name} className="bg-[#091120]">{d.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Recipient Upazila</label>
            <div className="relative">
              <select
                name="recipientUpazila"
                value={form.recipientUpazila}
                onChange={handleChange}
                disabled={!form.recipientDistrict}
                className={selectCls}
              >
                <option value="" disabled className="bg-[#091120]">
                  {!form.recipientDistrict ? 'Select district first' : 'Select upazila'}
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name} className="bg-[#091120]">{u.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Hospital + address */}
        <div>
          <label className={labelCls}>Hospital Name</label>
          <div className="relative">
            <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              placeholder="e.g. Dhaka Medical College Hospital"
              className={`${inputCls} pl-11`}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Full Address Line</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="fullAddress"
              value={form.fullAddress}
              onChange={handleChange}
              placeholder="e.g. Zahir Raihan Rd, Dhaka"
              className={`${inputCls} pl-11`}
            />
          </div>
        </div>

        {/* Date + time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Donation Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="date"
                name="donationDate"
                value={form.donationDate}
                onChange={handleChange}
                className={`${inputCls} pl-11`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Donation Time</label>
            <div className="relative">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="time"
                name="donationTime"
                value={form.donationTime}
                onChange={handleChange}
                className={`${inputCls} pl-11`}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelCls}>Request Message</label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-4 top-3.5 text-slate-500" />
            <textarea
              name="requestMessage"
              value={form.requestMessage}
              onChange={handleChange}
              rows={4}
              placeholder="Explain why blood is needed…"
              className={`${inputCls} pl-11 resize-none`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 disabled:opacity-70"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : mode === 'create' ? (
            'Request'
          ) : (
            'Update Donation Request'
          )}
        </button>
      </form>
    </div>
  );
}
