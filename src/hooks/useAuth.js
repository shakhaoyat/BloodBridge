'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext(null);

/**
 * Wrap app/dashboard/layout.jsx with <AuthProvider> once.
 * Fetches the session a single time and shares it via context, so
 * individual pages never have to re-fetch or guess at loading state.
 *
 * Adjust `authClient.getSession()` to match your actual auth library's API.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch (e) {
      console.error('Failed to load session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Use inside any dashboard page. Throws clearly if used outside the
 * provider, instead of silently returning null and crashing later on
 * something like `user.email`.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>. Did you wrap app/dashboard/layout.jsx with it?');
  }
  return ctx;
}