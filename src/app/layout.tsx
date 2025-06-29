import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Profile Viewer - IG Crate | View Instagram Profiles Anonymously",
  description: "Free Instagram profile viewer to check any public Instagram account anonymously. View followers, following, posts, bio, and profile picture without login. 100% safe and private Instagram viewer tool.",
  keywords: "instagram profile viewer, instagram viewer, view instagram without account, anonymous instagram viewer, instagram profile checker, ig profile viewer, instagram stalker, view private instagram, instagram anonymous viewer, ig crate",
  authors: [{ name: "IG Crate" }],
  openGraph: {
    title: "Instagram Profile Viewer - View Any Instagram Profile Anonymously",
    description: "Check any public Instagram profile without logging in. View followers, posts, and bio anonymously with our free Instagram viewer tool.",
    type: "website",
    locale: "en_US",
    siteName: "IG Crate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Profile Viewer - IG Crate",
    description: "View any public Instagram profile anonymously. No login required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            <ClientBody>{children}</ClientBody>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
