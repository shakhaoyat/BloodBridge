'use client';

import DashboardSidebar from './DashboardSidebar';

/**
 * Wrap every /dashboard/* page with this layout.
 * Pass the logged-in user's role/name/avatar down from your auth context.
 *
 * Usage (e.g. app/dashboard/layout.jsx):
 *
 *   export default function Layout({ children }) {
 *     const { user } = useAuth(); // role: 'donor' | 'volunteer' | 'admin'
 *     return (
 *       <DashboardLayout role={user.role} userName={user.name} userAvatar={user.image} onLogout={logout}>
 *         {children}
 *       </DashboardLayout>
 *     );
 *   }
 */
export default function DashboardLayout({ role = 'donor', userName, userAvatar, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#070D18]">
      <DashboardSidebar role={role} userName={userName} userAvatar={userAvatar} onLogout={onLogout} />

      {/* Background ambience to match the auth pages */}
      <div className="pointer-events-none fixed inset-0 lg:left-64 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />
      </div>

      <main className="relative lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
