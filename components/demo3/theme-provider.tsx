"use client"

import * as React from "react"
import { useUI } from "@/lib/demo3/ui-context"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUI()

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
