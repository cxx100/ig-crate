"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { type User, type AuthError, createClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | Error | null;
  refreshUser: () => Promise<void>;
  isSupabaseInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const isSupabaseInitialized = !!supabase;

  const refreshUser = useCallback(async () => {
    if (!isSupabaseInitialized) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await getCurrentUser();

      if (error) {
        setError(error);
        setUser(null);
      } else {
        setUser(data?.user || null);
        setError(null);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      setUser(null);
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupabaseInitialized]);

  useEffect(() => {
    // Initial user fetch
    refreshUser();

    // Set up auth state change listener
    if (isSupabaseInitialized && supabase !== null) {
      const authClient = supabase;
      const { data: authListener } = authClient.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      // Clean up subscription
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, [isSupabaseInitialized, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        refreshUser,
        isSupabaseInitialized,
      }}
    >
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
