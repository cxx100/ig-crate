"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t.auth.errors.emailRequired || 'Email is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        return;
      }

      // Password reset email sent successfully
      setSuccess(t.auth.passwordResetSuccess || 'Password reset instructions have been sent to your email.');

      // Clear the form
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(t.auth.errors.passwordResetFailed || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t.auth.forgotPassword || 'Forgot Password'}</CardTitle>
        <CardDescription>
          {t.auth.forgotPasswordDescription || 'Enter your email to receive password reset instructions'}
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
                {t.auth.sendingResetEmail || 'Sending reset email...'}
              </>
            ) : (
              t.auth.sendResetEmail || 'Send Reset Email'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {t.auth.backToLogin || 'Back to Login'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
