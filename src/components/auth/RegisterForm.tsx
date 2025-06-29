"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError(t.auth.errors.allFieldsRequired || 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.errors.passwordsMismatch || 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(t.auth.errors.passwordTooShort || 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const { data, error } = await signUp(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      // Registration successful
      setSuccess(t.auth.registerSuccess || 'Registration successful! Check your email to confirm your account.');

      // Optionally redirect after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(t.auth.errors.registerFailed || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t.auth.register.title || 'Create an Account'}</CardTitle>
        <CardDescription>
          {t.auth.register.description || 'Register to save your favorite profiles and access premium features'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t.auth.email || 'Email'}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder || 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t.auth.password || 'Password'}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.passwordPlaceholder || 'Create a password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t.auth.confirmPassword || 'Confirm Password'}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t.auth.confirmPasswordPlaceholder || 'Confirm your password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 mt-2">{error}</div>
          )}

          {success && (
            <div className="text-sm text-green-500 mt-2">{success}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                {t.auth.registering || 'Registering...'}
              </>
            ) : (
              t.auth.registerButton || 'Register'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          {t.auth.haveAccount || 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {t.auth.loginLink || 'Login now'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
