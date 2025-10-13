'use client';

import type React from "react";
import { useEffect } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "../demo4-globals.css";
import { Providers } from "./providers";

export default function Demo4RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Wyczyść wszystkie theme classes z innych demo przy mount
    // Demo4 ThemeProvider w Providers ustawi swój theme
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    
    // NIE MA cleanup przy unmount - następna strona ustawi swój theme
  }, []);

  return (
    <div className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <Providers>
        {children}
      </Providers>
      <Analytics />
    </div>
  );
}
