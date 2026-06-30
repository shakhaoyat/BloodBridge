'use client';

import { useEffect, useState } from 'react';
import { Pencil, Save, ChevronDown, Upload, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const labelCls = 'block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase';
const inputCls =
  'w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/[0.015]';
const selectCls =
  'w-full appearance-none pl-4 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed';

/**
 * user: { name, email, avatar, bloodGroup, district, upazila }
 * onSave: async (updatedFields) => void
 */
export default function ProfileForm({ user, onSave }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    bloodGroup: user?.bloodGroup || '',
    district: user?.district || '',
    upazila: user?.upazila || '',
  });
  const [districtsInfo, setDistrictsInfo] = useState([]);
  const [upazilasInfo, setUpazilasInfo] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

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
      }
    }
    loadLocation();
  }, []);

  useEffect(() => {
    if (!form.district || !districtsInfo.length) return;
    const selected = districtsInfo.find((d) => d.name === form.district);
    if (!selected) return;
    setFilteredUpazilas(upazilasInfo.filter((u) => u.district_id === selected.id));
  }, [form.district, districtsInfo, upazilasInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'district' ? { upazila: '' } : {}) }));
  };

  const handleEditToggle = () => setEditing(true);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      toast.success('Profile updated.');
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="mt-1 text-sm text-slate-400">View and update your account information.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={handleEditToggle}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.08] transition-colors"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
            {form.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={22} className="text-slate-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{form.name || 'Your name'}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className={inputCls}
          />
        </div>

        {/* Email - never editable */}
        <div>
          <label className={labelCls}>Email Address</label>
          <input type="text" value={user?.email || ''} disabled className={inputCls} />
        </div>

        {/* Blood group + district */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Blood Group</label>
            <div className="relative">
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                disabled={!editing}
                className={selectCls}
              >
                <option value="" disabled className="bg-[#091120]">Select group</option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g} className="bg-[#091120]">{g}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>District</label>
            <div className="relative">
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                disabled={!editing}
                className={selectCls}
              >
                <option value="" disabled className="bg-[#091120]">Select district</option>
                {districtsInfo.map((d) => (
                  <option key={d.id} value={d.name} className="bg-[#091120]">{d.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Upazila */}
        <div>
          <label className={labelCls}>Upazila</label>
          <div className="relative">
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              disabled={!editing || !form.district}
              className={selectCls}
            >
              <option value="" disabled className="bg-[#091120]">
                {!form.district ? 'Select district first' : 'Select upazila'}
              </option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name} className="bg-[#091120]">{u.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {editing && (
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
}