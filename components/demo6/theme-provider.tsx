"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "dark-blue";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark-blue");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("demo6-theme") as Theme;
    if (stored && ["light", "dark", "dark-blue"].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark", "theme-dark-blue");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "dark-blue") {
      root.classList.add("dark", "theme-dark-blue");
    }

    localStorage.setItem("demo6-theme", theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const cycleTheme = () => {
    setThemeState((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "dark-blue";
      return "light";
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default values during SSR
    return {
      theme: "dark-blue" as Theme,
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return context;
}
