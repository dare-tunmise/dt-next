'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, PenSquare, List } from 'lucide-react';
import Link from 'next/link';

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

  // if (loading || !user) {
  //   return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
  // }

  if (loading) return <div>Loading...</div>; // Prevents the loop
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg sm:text-xl font-bold font-mono">Blog Admin</Link>
              <Button variant="outline" size="sm" onClick={logout} className="sm:hidden">
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-4">
              <Link href="/admin/dashboard" className="flex-1 sm:flex-none">
                <Button variant={pathname === '/admin/dashboard' ? 'default' : 'ghost'} size="sm" className="w-full sm:w-auto">
                  <List className="w-4 h-4 mr-2" /> All Posts
                </Button>
              </Link>
              <Link href="/admin/dashboard/new" className="flex-1 sm:flex-none">
                <Button variant={pathname === '/admin/dashboard/new' ? 'default' : 'ghost'} size="sm" className="w-full sm:w-auto">
                  <PenSquare className="w-4 h-4 mr-2" /> New Post
                </Button>
              </Link>
            </nav>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm font-semibold truncate max-w-[160px]">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}