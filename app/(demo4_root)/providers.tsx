"use client";

import { ThemeProvider } from "@/components/demo4/theme-provider";
import { DataProvider } from "@/lib/demo4/data-context";
import { UIProvider } from "@/lib/demo4/ui-context";
import { ErrorBoundary } from "@/components/demo4/error-boundary";

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
