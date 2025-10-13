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
    // Wyczyść wszystkie theme classes z innych demo przy mount
    // Demo7 ThemeProvider w Providers ustawi swój theme
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    document.documentElement.removeAttribute('style')
    
    // NIE MA cleanup przy unmount - następna strona ustawi swój theme
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
