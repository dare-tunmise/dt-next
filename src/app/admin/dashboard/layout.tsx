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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold font-mono">Blog Admin</Link>
            <nav className="flex gap-4">
              <Link href="/admin/dashboard">
                <Button variant={pathname === '/admin/dashboard' ? 'default' : 'ghost'} size="sm">
                  <List className="w-4 h-4 mr-2" /> All Posts
                </Button>
              </Link>
              <Link href="/admin/dashboard/new">
                <Button variant={pathname === '/admin/dashboard/new' ? 'default' : 'ghost'} size="sm">
                  <PenSquare className="w-4 h-4 mr-2" /> New Post
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children} {/* This replaces <Outlet /> */}
      </main>
    </div>
  );
}