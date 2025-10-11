"use client";

import { DemoBanner } from "./demo-banner";
import { CommandPalette } from "./command-palette";
import { Toaster } from "@/components/ui/sonner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      <DemoBanner />
      
      <main 
        id="main-content"
        className="flex-1"
      >
        {children}
      </main>

      <CommandPalette />
      <Toaster />
    </div>
  );
}
