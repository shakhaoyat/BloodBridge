'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Droplet, Mail, ChevronDown, UserRound, ArrowLeft } from 'lucide-react';

const labelCls = 'block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase';
const selectCls =
  'w-full appearance-none pl-4 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300 cursor-pointer disabled:opacity-40';

function DonorCard({ donor }) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-red-500/30 hover:bg-white/[0.045]">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.08]">
          {donor.avatarUrl || donor.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={donor.avatarUrl || donor.image} alt={donor.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <UserRound size={20} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{donor.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={11} className="text-red-400 shrink-0" />
            {donor.upazila}, {donor.district}
          </div>
        </div>
        <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-rose-500 text-xs font-bold text-white shadow-[0_0_14px_rgba(220,38,38,0.25)]">
          {donor.bloodGroup}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400 truncate">
        <Mail size={13} className="text-slate-500 shrink-0" />
        <span className="truncate">{donor.email}</span>
      </div>
    </div>
  );
}

/**
 * Route: /search-donor (public)
 *
 * Search form: blood group, district, upazila, search button.
 * No donor data is shown by default — results only appear after the
 * visitor fills the form and clicks "Search". Reads from /api/donors
 * (Express endpoint), which filters the "users" collection server-side
 * to role in [Donor, Volunteer] && status === Active.
 */
export default function SearchDonorPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');

  const [districtsInfo, setDistrictsInfo] = useState([]);
  const [upazilasInfo, setUpazilasInfo] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [locationLoading, setLocationLoading] = useState(true);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load district/upazila reference data (needed to populate the selects)
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
      } finally {
        setLocationLoading(false);
      }
    }
    loadLocation();
  }, []);

  useEffect(() => {
    if (!district || !districtsInfo.length) {
      setFilteredUpazilas([]);
      setUpazila('');
      return;
    }
    const selected = districtsInfo.find((d) => d.name === district);
    if (!selected) return;
    setFilteredUpazilas(upazilasInfo.filter((u) => u.district_id === selected.id));
    setUpazila('');
  }, [district, districtsInfo, upazilasInfo]);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setLoadError(false);
    setHasSearched(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const params = new URLSearchParams();
      if (bloodGroup) params.set('bloodGroup', bloodGroup);
      if (district) params.set('district', district);
      if (upazila) params.set('upazila', upazila);

      const res = await fetch(`${apiBase}/api/donors?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to search donors:', err);
      setDonors([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070D18]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">Search Donors</h1>
          <p className="text-slate-400">Find a registered blood donor or volunteer near you by blood group and location.</p>
        <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-red-500/40 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
          >
            <ArrowLeft size={18} />
            Return to Home
          </Link>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Blood Group</label>
              <div className="relative">
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={selectCls}>
                  <option value="" className="bg-[#091120]">All groups</option>
                  {bloodGroups.map((g) => (
                    <option key={g} value={g} className="bg-[#091120]">{g}</option>
                  ))}
                </select>
                <Droplet size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelCls}>District</label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={locationLoading}
                  className={selectCls}
                >
                  <option value="" className="bg-[#091120]">
                    {locationLoading ? 'Loading…' : 'All districts'}
                  </option>
                  {districtsInfo.map((d) => (
                    <option key={d.id} value={d.name} className="bg-[#091120]">{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Upazila</label>
              <div className="relative">
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  disabled={!district}
                  className={selectCls}
                >
                  <option value="" className="bg-[#091120]">
                    {!district ? 'Select district first' : 'All upazilas'}
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name} className="bg-[#091120]">{u.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white font-semibold shadow-[0_0_14px_rgba(220,38,38,0.25)] hover:brightness-110 transition-all duration-300 disabled:opacity-50"
              >
                <Search size={16} />
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Results — nothing shown until a search has been performed */}
        {!hasSearched ? null : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-dashed border-red-500/30 bg-red-500/[0.03] px-6 py-16 text-center">
            <UserRound size={28} className="mx-auto mb-3 text-red-500/60" />
            <p className="text-slate-400">
              Couldn&apos;t load donors. Check that the API server is running and reachable.
            </p>
          </div>
        ) : donors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-16 text-center">
            <UserRound size={28} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">No donors match your search.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {donors.length} donor{donors.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((donor) => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}