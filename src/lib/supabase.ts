"use client";

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
// Check if we're in a browser environment and if the keys are available
const isBrowser = typeof window !== 'undefined';
const hasValidCredentials = supabaseUrl && supabaseAnonKey;

export const supabase: SupabaseClient | null = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helper functions with safety checks
export const signUp = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: new Error('Supabase client not initialized') };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: new Error('Supabase client not initialized') };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    return { error: new Error('Supabase client not initialized') };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    return { data: null, error: new Error('Supabase client not initialized') };
  }

  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export const resetPassword = async (email: string) => {
  if (!supabase) {
    return { data: null, error: new Error('Supabase client not initialized') };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};
