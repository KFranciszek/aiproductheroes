'use client'

import { useEffect } from 'react'
import './demo-selector.css'

export default function DemoSelectorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Przywróć theme demo-selector przy mount
    const savedTheme = localStorage.getItem('demo-selector-theme') || 'dark'

    // Wyczyść wszystkie theme classes z innych demo
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')

    // Ustaw theme demo-selector
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }

    // NIE MA cleanup przy unmount - żeby Landing page mógł przywrócić swój theme
  }, [])

  return children
}


