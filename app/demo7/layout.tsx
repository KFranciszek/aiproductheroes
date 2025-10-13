'use client';

import type React from "react";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../demo7-globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export default function Demo7RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    return () => {
      // Cleanup demo7 theme classes when leaving (next-themes adds 'dark' class)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.removeAttribute('style');
      }
    };
  }, []);

  return (
    <div className={`${inter.variable} font-sans antialiased`}>
      <Providers>
        {children}
      </Providers>
      <Analytics />
    </div>
  );
}
