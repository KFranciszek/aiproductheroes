"use client";

import { ThemeProvider } from "@/components/demo6/theme-provider";
import { DataProvider } from "@/lib/demo6/data-context";
import { UIProvider } from "@/lib/demo6/ui-context";
import { ErrorBoundary } from "@/components/demo6/error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
