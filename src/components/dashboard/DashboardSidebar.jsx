'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Droplet,
  PlusCircle,
  Users,
  ListChecks,
  Menu,
  X,
  LogOut,
  HeartHandshake,
} from 'lucide-react';

// Centralized nav config per role. Keep it here so dashboard pages
// don't have to know about role logic individually.
const NAV_BY_ROLE = {
  donor: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Donation Requests', href: '/dashboard/my-donation-requests', icon: Droplet },
    { label: 'Create Request', href: '/dashboard/create-donation-request', icon: PlusCircle },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  volunteer: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'All Blood Requests', href: '/dashboard/all-blood-donation-request', icon: Droplet },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'All Users', href: '/dashboard/all-users', icon: Users },
    { label: 'All Blood Requests', href: '/dashboard/all-blood-donation-request', icon: ListChecks },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ],
};

const ROLE_BADGE = {
  donor: 'Donor',
  volunteer: 'Volunteer',
  admin: 'Admin',
};

function NavLink({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-red-600/20 to-rose-500/10 text-white border border-red-500/20'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-red-500 to-rose-400" />
      )}
      <Icon
        size={18}
        className={active ? 'text-red-400' : 'text-slate-500 group-hover:text-red-400 transition-colors'}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export default function DashboardSidebar({ role = 'donor', userName = '', userAvatar = '', onLogout }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.donor;

  const SidebarContent = (
    <div className="flex h-full flex-col bg-[#070D18] border-r border-white/[0.06]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/[0.06]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <HeartHandshake size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">BloodBridge</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.08]">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                {userName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{userName || 'Guest'}</p>
            <p className="text-[11px] uppercase tracking-wide text-red-400">{ROLE_BADGE[role]}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-[#070D18]/95 backdrop-blur border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-rose-500">
            <HeartHandshake size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">BloodBridge</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/[0.06]"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-20">{SidebarContent}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06]"
              >
                <X size={20} />
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
