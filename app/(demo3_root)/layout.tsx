'use client';

import type React from "react";
import { useEffect } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "../demo3-globals.css";
import { DataProvider } from "@/lib/demo3/data-context";
import { UIProvider } from "@/lib/demo3/ui-context";
import { ThemeProvider } from "@/components/demo3/theme-provider";

export default function Demo3RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Wyczyść wszystkie theme classes z innych demo przy mount
    // Demo3 ThemeProvider ustawi swój theme
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    
    // NIE MA cleanup przy unmount - następna strona ustawi swój theme
  }, []);

  return (
    <div className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <DataProvider>
        <UIProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </UIProvider>
      </DataProvider>
      <Analytics />
    </div>
  );
}
