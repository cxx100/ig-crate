"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t.auth.errors.allFieldsRequired || 'All fields are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      // Redirect to dashboard/profile on successful login
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError(t.auth.errors.loginFailed || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t.auth.login.title || 'Login'}</CardTitle>
        <CardDescription>
          {t.auth.login.description || 'Enter your email and password to access your account'}
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                {t.auth.password || 'Password'}
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                {t.auth.forgotPassword || 'Forgot password?'}
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t.auth.passwordPlaceholder || 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 mt-2">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                {t.auth.loggingIn || 'Logging in...'}
              </>
            ) : (
              t.auth.loginButton || 'Login'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          {t.auth.noAccount || "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {t.auth.registerLink || 'Register now'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
