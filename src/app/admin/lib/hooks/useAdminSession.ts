'use client';

import { useState, useEffect, useCallback } from 'react';

interface AdminSession {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  expiresAt: number;
}

const SESSION_DURATION = 15 * 60 * 1000; // 15 dakika
const SESSION_KEY = 'admin_session';

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0); // Force update counter

  // Session'ı localStorage'dan yükle
  const loadSession = useCallback(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        const parsedSession: AdminSession = JSON.parse(storedSession);
        
        // Session süresi kontrolü
        if (parsedSession.expiresAt > Date.now()) {
          setSession(parsedSession);
          setIsLoading(false);
          return parsedSession;
        } else {
          // Session süresi dolmuş, temizle
          localStorage.removeItem(SESSION_KEY);
          setSession(null);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error loading admin session:', error);
      localStorage.removeItem(SESSION_KEY);
    }
    setSession(null);
    setIsLoading(false);
    return null;
  }, []);

  // Session'ı localStorage'a kaydet
  const saveSession = useCallback((user: { id: string; name: string; email: string }) => {
    console.log('💾 Saving session for user:', user);
    
    const newSession: AdminSession = {
      isAuthenticated: true,
      user,
      expiresAt: Date.now() + SESSION_DURATION
    };
    
    console.log('💾 New session:', newSession);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    
    // Force immediate state update with multiple triggers
    setSession(newSession);
    setIsLoading(false);
    setForceUpdate(prev => prev + 1);
    
    // Additional force update after a micro delay
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
      console.log('💾 Session state updated with force update:', newSession);
    }, 10);
    
    return newSession;
  }, []);

  // Session'ı temizle
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setIsLoading(false);
    setForceUpdate(prev => prev + 1); // Force component re-render
  }, []);

  // Login işlemi
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔍 Admin login attempt:', { email, password: password ? '***' : 'empty' });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 API response status:', response.status);
      
      const result = await response.json();
      console.log('📡 API response:', result);

      if (result.success && result.user) {
        console.log('✅ Login successful, saving session');
        const session = saveSession(result.user);
        console.log('✅ Session saved, triggering re-render');
        return session;
      } else {
        console.log('❌ Login failed:', result.error);
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  }, [saveSession]);

  // Logout işlemi
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // Component mount olduğunda session'ı yükle
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Listen for storage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        console.log('🔄 Storage change detected, reloading session');
        loadSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadSession]);

  return {
    session,
    isAuthenticated: session?.isAuthenticated || false,
    user: session?.user,
    isLoading,
    forceUpdate, // Include force update in return
    login,
    logout,
    loadSession
  };
}