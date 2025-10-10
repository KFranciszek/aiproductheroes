"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UIContextType {
  sidebarCollapsed: boolean
  theme: "light" | "dark"
  density: "compact" | "comfortable" | "spacious"
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark") => void
  setDensity: (density: "compact" | "comfortable" | "spacious") => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setThemeState] = useState<"light" | "dark">("dark")
  const [density, setDensityState] = useState<"compact" | "comfortable" | "spacious">("comfortable")

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("syzio-ui-store")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.state) {
          setSidebarCollapsed(parsed.state.sidebarCollapsed ?? false)
          setThemeState(parsed.state.theme ?? "dark")
          setDensityState(parsed.state.density ?? "comfortable")
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "syzio-ui-store",
      JSON.stringify({
        state: { sidebarCollapsed, theme, density },
      }),
    )
  }, [sidebarCollapsed, theme, density])

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  const setTheme = (newTheme: "light" | "dark") => setThemeState(newTheme)
  const setDensity = (newDensity: "compact" | "comfortable" | "spacious") => setDensityState(newDensity)

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        theme,
        density,
        toggleSidebar,
        setTheme,
        setDensity,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}
