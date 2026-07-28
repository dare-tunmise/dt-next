"use client"

import { useEffect } from 'react';
// 1. Change the import to next/navigation
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { primaryButton } from '@/lib/adminStyles';

export default function Login() {
  const { user, login, loading } = useAuth();
  // 2. Initialize the Next.js router
  const router = useRouter(); 

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard'); 
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 font-mono">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          dare tunmise.
        </p>
        <h1 className="mt-6 text-2xl text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is restricted to the site owner.
        </p>

        <div className="mt-10 border-t border-border pt-8">
          <button type="button" onClick={login} className={`${primaryButton} w-full`}>
            Continue with Google
          </button>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-accent"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}