import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeConfig } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ExtendedThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  const availableThemes: ThemeConfig[] = [
    { id: 'light', name: 'Jasny', colors: { primary: '#3b82f6' } },
    { id: 'dark', name: 'Ciemny', colors: { primary: '#60a5fa' } },
    { id: 'blue', name: 'Niebieski', colors: { primary: '#1e40af' } },
    { id: 'green', name: 'Zielony', colors: { primary: '#059669' } },
    { id: 'purple', name: 'Fioletowy', colors: { primary: '#7c3aed' } },
    { id: 'orange', name: 'Pomarańczowy', colors: { primary: '#ea580c' } }
  ];

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark', 'blue', 'green', 'purple', 'orange');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark', 'blue', 'green', 'purple', 'orange');
      root.classList.add(theme);
    }

    // Zastosuj niestandardowe kolory dla motywów
    const selectedTheme = availableThemes.find(t => t.id === theme);
    if (selectedTheme) {
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Zapisz preferencje w localStorage
    localStorage.setItem('theme', theme);
  }, [theme, availableThemes]);

  // Wczytaj zapisane preferencje przy inicjalizacji
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an ExtendedThemeProvider');
  }
  return context;
}
