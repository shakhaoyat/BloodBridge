'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
      User,
      Mail,
      Lock,
      Eye,
      EyeOff,
      Phone,
      ArrowRight,
      ShieldCheck,
      ChevronDown,
      Upload,
      Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

// JSON files live in /public/location/ — served as static assets, not importable via ES modules.
// We fetch them at runtime in a useEffect below.

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ─── Avatar upload helper ────────────────────────────────────────────────────
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMAGEDB_API_KEY;

async function uploadToImgBB(file) {
      if (!IMGBB_KEY) throw new Error('ImageBB API key is not configured.');
      const body = new FormData();
      body.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
            method: 'POST',
            body,
      });
      const json = await res.json();
      if (!json.success) throw new Error('ImageBB upload failed.');
      return json.data.url;
}
// ────────────────────────────────────────────────────────────────────────────

const RegisterPage = () => {
      const router = useRouter();
      const fileInputRef = useRef(null);
      const previewUrlRef = useRef(null);

      const [formData, setFormData] = useState({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            bloodGroup: '',
            phone: '',
            district: '',
            upazila: '',
            avatarUrl: '',
      });

      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [agreeTerms, setAgreeTerms] = useState(false);
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const [focusedField, setFocusedField] = useState(null);

      // Avatar
      const [avatarPreview, setAvatarPreview] = useState(null);
      const [avatarUploading, setAvatarUploading] = useState(false);

      // Location data fetched from /public/location/
      const [districtsInfo, setDistrictsInfo] = useState([]);
      const [upazilasInfo, setUpazilasInfo] = useState([]);
      const [locationLoading, setLocationLoading] = useState(true);

      // Filtered upazilas for selected district
      const [filteredUpazilas, setFilteredUpazilas] = useState([]);

      // ── Revoke preview object-URL on unmount ─────────────────────────────────
      useEffect(() => {
            return () => {
                  if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
            };
      }, []);

      // ── Fetch location JSON from /public/location/ ───────────────────────────
      useEffect(() => {
            async function loadLocation() {
                  try {
                        const [dRes, uRes] = await Promise.all([
                              fetch('/location/districts.json'),
                              fetch('/location/upazilas.json'),
                        ]);
                        const dJson = await dRes.json();
                        const uJson = await uRes.json();
                        // Each JSON file is an array; index 2 contains { data: [...] }
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

      // ── Filter upazilas whenever district changes ────────────────────────────
      useEffect(() => {
            if (!formData.district) {
                  setFilteredUpazilas([]);
                  setFormData((prev) => ({ ...prev, upazila: '' }));
                  return;
            }
            const selectedDistrict = districtsInfo.find((d) => d.name === formData.district);
            if (!selectedDistrict) return;
            const upazilas = upazilasInfo.filter((u) => u.district_id === selectedDistrict.id);
            setFilteredUpazilas(upazilas);
            setFormData((prev) =>
                  upazilas.find((u) => u.name === prev.upazila)
                        ? prev
                        : { ...prev, upazila: '' }
            );
      }, [formData.district, districtsInfo, upazilasInfo]);

      const handleChange = (e) => {
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            setError('');
      };

      // ── Avatar upload ────────────────────────────────────────────────────────
      const handleAvatarChange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
            const previewUrl = URL.createObjectURL(file);
            previewUrlRef.current = previewUrl;

            setAvatarPreview(previewUrl);
            setAvatarUploading(true);
            setError('');

            try {
                  const url = await uploadToImgBB(file);
                  setFormData((prev) => ({ ...prev, avatarUrl: url }));
            } catch {
                  setError('Avatar upload failed. Please try again.');
                  setAvatarPreview(null);
                  setFormData((prev) => ({ ...prev, avatarUrl: '' }));
            } finally {
                  setAvatarUploading(false);
            }
      };

      // ── Form submit ──────────────────────────────────────────────────────────
      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');

            if (avatarUploading) {
                  setError('Please wait for the avatar to finish uploading.');
                  return;
            }

            const { fullName, email, password, confirmPassword, bloodGroup, district, upazila } = formData;

            if (!fullName || !email || !password || !confirmPassword || !bloodGroup || !district || !upazila) {
                  setError('Please fill in all required fields.');
                  return;
            }
            if (password.length < 8) {
                  setError('Password must be at least 8 characters.');
                  return;
            }
            if (password !== confirmPassword) {
                  setError('Passwords do not match.');
                  return;
            }
            if (!agreeTerms) {
                  setError('You must agree to the Terms and Privacy Policy.');
                  return;
            }

            setLoading(true);
            try {
                  const { error: signUpError } = await authClient.signUp.email({
                        email: formData.email,
                        password: formData.password,
                        name: formData.fullName,
                        image: formData.avatarUrl || undefined,
                        bloodGroup: formData.bloodGroup,
                        district: formData.district,
                        upazila: formData.upazila,
                        phone: formData.phone || undefined,
                        // role defaults to "donor" on the server
                  });

                  if (signUpError) {
                        setError(signUpError.message || 'Registration failed. Please try again.');
                        toast.error(signUpError.message || 'Registration failed.');
                        return;
                  }

                  toast.success('Account created! Welcome to BloodBridge.');
                  router.push('/dashboard');
            } catch (err) {
                  console.error('Unexpected registration error:', err);
                  setError('Something went wrong. Please try again.');
            } finally {
                  setLoading(false);
            }
      };

      // ── Shared class helpers ─────────────────────────────────────────────────
      const inputCls =
            'w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300';

      const iconCls = (field) =>
            `absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === field ? 'text-red-400' : 'text-slate-500'
            }`;

      const labelCls = 'block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase';

      const selectCls =
            'w-full appearance-none pl-4 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

      return (
            <div className="min-h-screen bg-[#070D18]">
                  <div className="pointer-events-none fixed inset-0 overflow-hidden">
                        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
                        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />
                  </div>

                  <div className="relative mx-auto max-w-xl px-4 sm:px-6 py-12 lg:py-16">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                              <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                                    <p className="text-slate-400 text-sm">Fill in the details to register as a donor.</p>
                              </div>

                              <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Avatar */}
                                    <div>
                                          <label className={labelCls}>
                                                Avatar <span className="text-slate-600 font-normal normal-case">(optional)</span>
                                          </label>
                                          <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-white/20 bg-white/[0.03] flex items-center justify-center overflow-hidden group cursor-pointer hover:border-red-500/50 transition-colors">
                                          {avatarPreview ? (
                                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                          ) : (
                                                <ImageIcon size={24} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                                          )}
                                          <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={handleAvatarChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={avatarUploading}
                                          />
                                    </div>
                                    <div className="flex flex-col">
                                          <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={avatarUploading}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                                          >
                                                <Upload size={14} />
                                                {avatarUploading ? 'Uploading…' : 'Choose Image'}
                                          </button>
                                          <p className="text-[10px] text-slate-500 mt-1">JPG, PNG · up to 5 MB</p>
                                          {avatarUploading && (
                                                <p className="text-[10px] text-amber-400 mt-1 animate-pulse">Uploading avatar…</p>
                                          )}
                                          {!avatarUploading && formData.avatarUrl && (
                                                <p className="text-[10px] text-green-400 mt-1">✓ Avatar uploaded</p>
                                          )}
                                    </div>
                              </div>
                        </div>

                        {/* Full Name */}
                        <div>
                              <label className={labelCls}>Full Name</label>
                              <div className="relative">
                                    <User size={18} className={iconCls('name')} />
                                    <input
                                          type="text"
                                          name="fullName"
                                          required
                                          onFocus={() => setFocusedField('name')}
                                          onBlur={() => setFocusedField(null)}
                                          value={formData.fullName}
                                          onChange={handleChange}
                                          placeholder="John Doe"
                                          className={inputCls}
                                    />
                              </div>
                        </div>

                        {/* Email */}
                        <div>
                              <label className={labelCls}>Email Address</label>
                              <div className="relative">
                                    <Mail size={18} className={iconCls('email')} />
                                    <input
                                          type="email"
                                          name="email"
                                          required
                                          onFocus={() => setFocusedField('email')}
                                          onBlur={() => setFocusedField(null)}
                                          value={formData.email}
                                          onChange={handleChange}
                                          placeholder="you@example.com"
                                          className={inputCls}
                                    />
                              </div>
                        </div>

                        {/* Blood Group & District */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                    <label className={labelCls}>Blood Group</label>
                                    <div className="relative">
                                          <select
                                                name="bloodGroup"
                                                required
                                                onFocus={() => setFocusedField('blood')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.bloodGroup}
                                                onChange={handleChange}
                                                className={selectCls}
                                          >
                                                <option value="" disabled className="bg-[#091120] text-slate-400">Select group</option>
                                                {bloodGroups.map((g) => (
                                                      <option key={g} value={g} className="bg-[#091120] text-white">{g}</option>
                                                ))}
                                          </select>
                                          <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${focusedField === 'blood' ? 'text-red-400' : 'text-slate-500'}`} />
                                    </div>
                              </div>

                              <div>
                                    <label className={labelCls}>District</label>
                                    <div className="relative">
                                          <select
                                                name="district"
                                                required
                                                onFocus={() => setFocusedField('district')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.district}
                                                onChange={handleChange}
                                                disabled={locationLoading}
                                                className={selectCls}
                                          >
                                                <option value="" disabled className="bg-[#091120] text-slate-400">
                                                      {locationLoading ? 'Loading…' : 'Select district'}
                                                </option>
                                                {districtsInfo.map((d) => (
                                                      <option key={d.id} value={d.name} className="bg-[#091120] text-white">{d.name}</option>
                                                ))}
                                          </select>
                                          <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${focusedField === 'district' ? 'text-red-400' : 'text-slate-500'}`} />
                                    </div>
                              </div>
                        </div>

                        {/* Upazila & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                    <label className={labelCls}>Upazila</label>
                                    <div className="relative">
                                          <select
                                                name="upazila"
                                                required
                                                onFocus={() => setFocusedField('upazila')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.upazila}
                                                onChange={handleChange}
                                                disabled={!formData.district || locationLoading}
                                                className={selectCls}
                                          >
                                                <option value="" disabled className="bg-[#091120] text-slate-400">
                                                      {!formData.district ? 'Select district first' : 'Select upazila'}
                                                </option>
                                                {filteredUpazilas.map((u) => (
                                                      <option key={u.id} value={u.name} className="bg-[#091120] text-white">{u.name}</option>
                                                ))}
                                          </select>
                                          <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${focusedField === 'upazila' ? 'text-red-400' : 'text-slate-500'}`} />
                                    </div>
                              </div>

                              <div>
                                    <label className={labelCls}>
                                          Phone <span className="text-slate-600 font-normal normal-case">(optional)</span>
                                    </label>
                                    <div className="relative">
                                          <Phone size={18} className={iconCls('phone')} />
                                          <input
                                                type="tel"
                                                name="phone"
                                                onFocus={() => setFocusedField('phone')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+880 1XXX-XXXXXX"
                                                className={inputCls}
                                          />
                                    </div>
                              </div>
                        </div>

                        {/* Password & Confirm Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                    <label className={labelCls}>Password</label>
                                    <div className="relative">
                                          <Lock size={18} className={iconCls('pass')} />
                                          <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                minLength={8}
                                                onFocus={() => setFocusedField('pass')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Min. 8 characters"
                                                className={`${inputCls} pr-11`}
                                          />
                                          <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                          >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                          </button>
                                    </div>
                              </div>

                              <div>
                                    <label className={labelCls}>Confirm Password</label>
                                    <div className="relative">
                                          <Lock size={18} className={iconCls('cpass')} />
                                          <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                required
                                                onFocus={() => setFocusedField('cpass')}
                                                onBlur={() => setFocusedField(null)}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repeat password"
                                                className={`${inputCls} pr-11`}
                                          />
                                          <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                          >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                          </button>
                                    </div>
                              </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-2">
                              <div className="relative flex items-center justify-center mt-0.5">
                                    <input
                                          type="checkbox"
                                          id="terms"
                                          checked={agreeTerms}
                                          onChange={(e) => setAgreeTerms(e.target.checked)}
                                          className="peer appearance-none w-4 h-4 border border-slate-600 rounded bg-white/[0.03] checked:bg-red-500 checked:border-red-500 transition-colors cursor-pointer"
                                    />
                                    <ShieldCheck size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                              </div>
                              <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                                    I agree to BloodBridge's{' '}
                                    <Link href="/terms" className="text-red-400 hover:text-red-300 font-medium transition-colors">Terms</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-red-400 hover:text-red-300 font-medium transition-colors">Privacy Policy</Link>.
                              </label>
                        </div>

                        {/* Error banner */}
                        {error && (
                              <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                                    {error}
                              </div>
                        )}

                        {/* Submit */}
                        <button
                              type="submit"
                              disabled={loading || avatarUploading}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
                        >
                              {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : avatarUploading ? (
                                    <>
                                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          Uploading avatar…
                                    </>
                              ) : (
                                    <>
                                          Create Account
                                          <ArrowRight size={18} className="ml-1" />
                                    </>
                              )}
                        </button>
                  </form>

                  <p className="text-center text-sm text-slate-400 mt-8">
                        Already have an account?{' '}
                        <Link
                              href="/login"
                              className="text-white font-semibold hover:text-red-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-red-400/50"
                        >
                              Sign in here
                        </Link>
                  </p>
                        </div>
                  </div>
            </div>

      );
};

export default RegisterPage;