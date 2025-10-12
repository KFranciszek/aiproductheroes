"use client";

import { ThemeProvider } from "@/components/demo7/theme-provider";
import { ErrorBoundary } from "@/components/demo7/error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  );
}
