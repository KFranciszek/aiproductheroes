'use client'

import { LandingThemeProvider } from "@/components/landing/theme-provider"
import type React from "react"
import { useEffect } from "react"
import "./landing.css"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Przywróć theme landing page przy mount
    const savedTheme = localStorage.getItem('landing-theme') || 'dark'
    
    // Wyczyść wszystkie theme classes z innych demo
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    
    // Ustaw theme landing page
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('landing-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <LandingThemeProvider>
        {children}
      </LandingThemeProvider>
    </>
  )
}
