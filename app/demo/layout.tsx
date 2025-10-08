"use client"

import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="demo-theme" // Używamy innego klucza niż na stronie głównej
    >
      {children}
    </ThemeProvider>
  )
}
