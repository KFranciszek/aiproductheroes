"use client";

import { ThemeProvider } from "@/components/demo7/theme-provider";
import { ErrorBoundary } from "@/components/demo7/error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
