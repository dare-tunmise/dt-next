'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { setTrackingDisabled } from '@/lib/tracking';
import { adminFrame, quietAction } from '@/lib/adminStyles';

const TABS = [
  { href: '/admin/dashboard', label: 'Posts', exact: true },
  { href: '/admin/dashboard/new', label: 'Write', exact: true },
  { href: '/admin/dashboard/analytics', label: 'Analytics', exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle Protected Route Logic
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Reaching the dashboard proves this browser is the author's, so stop
  // counting it in analytics. Once per browser; reversible from the
  // analytics page.
  useEffect(() => {
    if (user) setTrackingDisabled(true);
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading
      </div>
    );
  }
  if (!user) return null;

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.exact ? pathname === tab.href : !!pathname?.startsWith(tab.href);

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Same wordmark as the public masthead — one site, two rooms. */}
      <header className={`${adminFrame} pt-12`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.2em] transition-colors hover:text-accent"
          >
            dare tunmise.
          </Link>
          <div className="flex items-baseline gap-6">
            <span className="max-w-[180px] truncate text-xs text-muted-foreground">
              {user.name}
            </span>
            <button type="button" onClick={logout} className={quietAction}>
              Log out
            </button>
          </div>
        </div>

        <nav className="mt-10 flex gap-8 border-b border-border">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`-mb-px border-b pb-3 text-xs uppercase tracking-[0.15em] transition-colors ${
                isActive(tab)
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className={`${adminFrame} py-12`}>{children}</main>
    </div>
  );
}
