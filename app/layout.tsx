import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AimCreditsBadge from '@/components/AimCreditsBadge';
import FloatingChatWidget from '@/components/FloatingChatWidget';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex by AIM — AI Music Manager",
  description: "Create more. Manage less. A premium AI music manager for artists, producers, DJs, and songwriters.",
  icons: {
    icon: "/alex-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AimCreditsBadge />
        <FloatingChatWidget />
      </body>
    </html>
  );
}
