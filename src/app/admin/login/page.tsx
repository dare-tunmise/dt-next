"use client"

import { useEffect } from 'react';
// 1. Change the import to next/navigation
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground font-mono mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to manage your content</p>
        </div>
        
        <Button 
          onClick={login}
          className="w-full"
          size="lg"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}