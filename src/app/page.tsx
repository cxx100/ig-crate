"use client";

import { useState } from "react";
import { Search, Users, UserCheck, Grid3X3, Instagram, Shield, Eye, Home as HomeIcon, Info, Github, Globe, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { instagramApi, type InstagramProfile, type ApiError } from "@/lib/instagram-api";
import { signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Using InstagramProfile interface from the API service

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isSupabaseInitialized } = useAuth();
  const router = useRouter();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "IG Crate - Instagram Profile Viewer",
    "description": "Free Instagram profile viewer to check any public Instagram account anonymously. View followers, posts, and bio without login.",
    "url": "https://igcrate.com",
    "applicationCategory": "SocialNetworkingApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2451"
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<InstagramProfile | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const parseUsername = (input: string): string => {
    // Remove whitespace
    const cleaned = input.trim();

    // If it's a URL, extract username
    if (cleaned.includes("instagram.com/")) {
      const match = cleaned.match(/instagram\.com\/([^\/\?]+)/);
      return match ? match[1] : "";
    }

    // Remove @ if present
    return cleaned.replace(/^@/, "");
  };


  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    // Check if input is a link or username
    const cleaned = inputValue.trim();
    const isLink = cleaned.includes("instagram.com/");

    // For links, pass the full URL; for usernames, clean them
    const searchValue = isLink ? cleaned : cleaned.replace(/^@/, "");

    if (!searchValue) {
      setError({ code: "INVALID_USERNAME", message: t.search.errors.invalidUsername });
      return;
    }

    setIsLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const data = await instagramApi.getProfile(searchValue, language);
      setProfileData(data);
    } catch (err) {
      const apiError = err as ApiError; setError({ code: apiError.code || "FETCH_ERROR", message: apiError.message || t.search.errors.fetchError, details: apiError.details });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-1">
              <Instagram className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                IG Crate
              </span>
            </div>

            {/* Centered Navigation Links */}
            <nav className="hidden md:flex items-center justify-center space-x-6 flex-1">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <HomeIcon className="h-4 w-4 mr-2" />
                {t.nav.home}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Info className="h-4 w-4 mr-2" />
                {t.nav.about}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Github className="h-4 w-4 mr-2" />
                {t.nav.github}
              </Button>
            </nav>

            {/* Right Side: Auth + Language */}
            <div className="hidden md:flex items-center justify-end flex-1 space-x-4">
              {/* Authentication Section */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-white/50">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-[120px] truncate">{user?.email || t.auth.myProfile}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      {t.auth.myProfile}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/login')}
                    className="text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-white/50 h-9"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.nav.login}
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-9"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t.nav.register}
                  </Button>
                </div>
              )}

              {/* Vertical Separator */}
              <Separator orientation="vertical" className="h-6 bg-gray-300" />

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Globe className="h-4 w-4 mr-2" />
                    {t.nav.language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇺🇸 {t.languages.english}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('zh')}
                    className={language === 'zh' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇨🇳 {t.languages.chinese}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Mobile Auth Buttons */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      {t.auth.myProfile}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/login')}
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/register')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('zh')}
                    className={language === 'zh' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇨🇳 中文
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm">
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="h-12 w-12 text-pink-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {t.header.title}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {t.header.subtitle}
          </p>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  <strong>{t.privacy.title}</strong> {t.privacy.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Search Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              {t.search.title}
            </CardTitle>
            <CardDescription>
              {t.search.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder={t.search.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t.search.searching}
                  </>
                ) : (
                  t.search.button
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Skeleton key={`skeleton-${Math.random()}-${i}`} className="aspect-square w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Display */}
        {profileData && !isLoading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.profile_picture_url} alt={profileData.full_name} />
                  <AvatarFallback>{profileData.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{profileData.username}</h2>
                    {profileData.is_verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {t.profile.verified}
                      </Badge>
                    )}
                    {profileData.is_private && (
                      <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                        <Eye className="h-3 w-3 mr-1" />
                        {t.profile.private}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{profileData.full_name}</h3>
                  <p className="text-gray-600">{profileData.bio}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Grid3X3 className="h-5 w-5 text-gray-500 mr-1" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.posts_count}</div>
                  <div className="text-sm text-gray-500">{t.profile.stats.posts}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-gray-500 mr-1" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.followers}</div>
                  <div className="text-sm text-gray-500">{t.profile.stats.followers}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserCheck className="h-5 w-5 text-gray-500 mr-1" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.following}</div>
                  <div className="text-sm text-gray-500">{t.profile.stats.following}</div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Recent Posts */}
              {!profileData.is_private ? (
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Grid3X3 className="h-5 w-5 mr-2" />
                    {t.profile.recentPosts}
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {profileData.recent_posts.map((post) => (
                      <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg">
                        <img
                          src={post.image_url}
                          alt="Instagram post"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">{t.profile.privateAccount}</h4>
                  <p className="text-gray-500">{t.profile.privateAccountDesc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer with SEO Content */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600 space-y-4">
            <p>{t.footer.disclaimer}</p>

            {/* SEO Content */}
            <div className="max-w-3xl mx-auto mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">About IG Crate - Instagram Profile Viewer</h2>
              <p className="text-gray-600 leading-relaxed">
                IG Crate is a free Instagram profile viewer that allows you to view any public Instagram profile anonymously.
                Our Instagram viewer tool lets you check Instagram accounts without login, making it the perfect solution for
                viewing Instagram profiles privately. Whether you want to view Instagram stories, check followers count, or
                browse Instagram posts, our anonymous Instagram viewer provides a safe and secure way to explore Instagram content.
              </p>

              <div className="grid md:grid-cols-3 gap-4 text-left mt-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View Instagram without account</li>
                    <li>• Anonymous Instagram viewer</li>
                    <li>• Check Instagram followers</li>
                    <li>• View Instagram bio</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Privacy</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 100% anonymous viewing</li>
                    <li>• No login required</li>
                    <li>• No data storage</li>
                    <li>• Secure & private</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Popular Uses</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Instagram profile checker</li>
                    <li>• View private Instagram safely</li>
                    <li>• Instagram stalker alternative</li>
                    <li>• IG profile viewer</li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                © 2024 IG Crate. Instagram Profile Viewer is not affiliated with Instagram or Meta Platforms, Inc.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}
