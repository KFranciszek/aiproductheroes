'use client';

import type React from "react";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import "../demo6-globals.css";
import { Providers } from "./providers";

export default function Demo6RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Wyczyść wszystkie theme classes z innych demo przy mount
    // Demo6 ThemeProvider w Providers ustawi swój theme
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    
    // NIE MA cleanup przy unmount - następna strona ustawi swój theme
  }, []);

  return (
    <Providers>
      {children}
      <Analytics />
    </Providers>
  );
}
