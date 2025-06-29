"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Instagram, User, Settings, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { signOut } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only
  useEffect(() => {
    setIsMounted(true);

    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Show loading state until we confirm authentication status
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  // Render profile only if authenticated
  if (!isAuthenticated) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3"
            >
              <Instagram className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                IG Crate
              </span>
            </button>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-600"
              >
                {t.nav.home}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            {t.auth.myProfile}
          </h1>
          <p className="text-gray-600">
            {t.auth.welcomeBack}, {user?.email}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1 text-center">{user?.email}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {t.auth.accountSettings}
                  </p>

                  <Separator className="my-4 w-full" />

                  <div className="w-full space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600"
                      onClick={() => {}}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t.auth.myProfile}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600"
                      onClick={() => {}}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      {t.auth.savedProfiles}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600"
                      onClick={() => {}}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {t.auth.accountSettings}
                    </Button>

                    <Separator className="my-4" />

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav.logout}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{t.auth.accountSettings}</CardTitle>
                <CardDescription>
                  {t.auth.myProfile}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t.auth.email}</h3>
                    <p className="text-gray-700 bg-gray-100 p-3 rounded-md">
                      {user?.email}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">{t.auth.savedProfiles}</h3>
                    <p className="text-gray-500 italic">
                      {/* Placeholder for saved profiles */}
                      No saved profiles yet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
