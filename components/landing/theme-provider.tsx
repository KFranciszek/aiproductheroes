'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * Landing Page Theme Provider
 * Domyślnie dark mode (cosmic theme)
 */
export function LandingThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="landing-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

