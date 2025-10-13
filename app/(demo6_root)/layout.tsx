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
    return () => {
      // Cleanup demo6 theme classes when leaving
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue');
      }
    };
  }, []);

  return (
    <Providers>
      {children}
      <Analytics />
    </Providers>
  );
}
