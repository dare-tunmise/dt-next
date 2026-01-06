"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import useRouter
import { api, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await api.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
      // console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    api.auth.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      // 2. Use router.push for a smoother transition without full reload
      router.push('/'); 
      router.refresh(); // Tells Next.js to refresh server data
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {/* 3. Optional: Prevent UI flicker by not rendering children 
          until the first check is done? Only do this if you want 
          a blank screen/spinner on first load. */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}