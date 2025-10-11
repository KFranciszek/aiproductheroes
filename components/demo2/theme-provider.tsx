"use client"

import { createContext, useContext, useEffect, useState } from "react"
import "./styles/theme.css"

type Demo2Theme = "light" | "dark"

interface Demo2ThemeContextType {
  theme: Demo2Theme
  setTheme: (theme: Demo2Theme) => void
  toggleTheme: () => void
}

const Demo2ThemeContext = createContext<Demo2ThemeContextType | undefined>(undefined)

export function Demo2ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Demo2Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Read theme preference from localStorage
    const stored = localStorage.getItem("demo2-theme") as Demo2Theme
    if (stored && (stored === "light" || stored === "dark")) {
      setTheme(stored)
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save theme preference to localStorage
      localStorage.setItem("demo2-theme", theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light")
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="demo2-theme">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  const themeClass = theme === "dark" ? "demo2-theme dark" : "demo2-theme"

  return (
    <Demo2ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={themeClass}>
        {children}
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="demo2-theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
        </button>
      </div>
    </Demo2ThemeContext.Provider>
  )
}

export function useDemo2Theme() {
  const context = useContext(Demo2ThemeContext)
  if (context === undefined) {
    throw new Error('useDemo2Theme must be used within a Demo2ThemeProvider')
  }
  return context
}

// Utility hook for getting theme-aware classes
export function useDemo2Classes() {
  const { theme } = useDemo2Theme()
  
  return {
    // Button classes
    btnPrimary: "demo2-btn-primary",
    btnSuccess: "demo2-btn-success", 
    btnInfo: "demo2-btn-info",
    btnWarning: "demo2-btn-warning",
    btnDestructive: "demo2-btn-destructive",
    btnSecondary: "demo2-btn-secondary",
    
    // Badge classes
    badge: "demo2-badge",
    badgePrimary: "demo2-badge demo2-badge-primary",
    badgeSuccess: "demo2-badge demo2-badge-success",
    badgeInfo: "demo2-badge demo2-badge-info", 
    badgeWarning: "demo2-badge demo2-badge-warning",
    badgeDestructive: "demo2-badge demo2-badge-destructive",
    badgeSecondary: "demo2-badge demo2-badge-secondary",
    badgeMuted: "demo2-badge demo2-badge-muted",
    
    // Status badges
    statusTodo: "demo2-badge demo2-status-todo",
    statusInProgress: "demo2-badge demo2-status-in-progress",
    statusInReview: "demo2-badge demo2-status-in-review", 
    statusBlocked: "demo2-badge demo2-status-blocked",
    statusDone: "demo2-badge demo2-status-done",
    
    // Priority badges
    priorityP0: "demo2-badge demo2-priority-p0",
    priorityP1: "demo2-badge demo2-priority-p1",
    priorityP2: "demo2-badge demo2-priority-p2",
    priorityP3: "demo2-badge demo2-priority-p3",
    
    // Layout classes
    surface: "demo2-surface",
    card: "demo2-card",
    textMuted: "demo2-text-muted",
    border: "demo2-border",
    input: "demo2-input",
    aiInsight: "demo2-ai-insight",
    
    // Utility functions
    getStatusClass: (status: string) => {
      const statusMap = {
        'todo': 'demo2-badge demo2-status-todo',
        'in_progress': 'demo2-badge demo2-status-in-progress',
        'in_review': 'demo2-badge demo2-status-in-review',
        'blocked': 'demo2-badge demo2-status-blocked', 
        'done': 'demo2-badge demo2-status-done'
      } as const
      return statusMap[status as keyof typeof statusMap] || 'demo2-badge demo2-status-todo'
    },
    
    getPriorityClass: (priority: string) => {
      const priorityMap = {
        'P0': 'demo2-badge demo2-priority-p0',
        'P1': 'demo2-badge demo2-priority-p1',
        'P2': 'demo2-badge demo2-priority-p2', 
        'P3': 'demo2-badge demo2-priority-p3'
      } as const
      return priorityMap[priority as keyof typeof priorityMap] || 'demo2-badge demo2-priority-p3'
    }
  }
}


