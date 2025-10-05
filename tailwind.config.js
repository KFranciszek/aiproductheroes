/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ===== Syzio Landing Page - Space/Cosmic Theme =====
        // Background Colors
        "bg-primary": "#0a0e1a",      // Deep space
        "bg-secondary": "#151b2e",    // Dark blue
        "bg-tertiary": "#1e2538",     // Lighter blue
        
        // Text Colors
        "text-primary": "#ffffff",
        "text-secondary": "#a0aec0",
        "text-muted": "#6b7280",
        
        // Accent Colors (Three Pillars)
        "accent-blue": "#3b82f6",     // Team Syzio
        "accent-purple": "#8b5cf6",   // Tool Syzio
        "accent-green": "#10b981",    // Sprint Syzio
        "accent-cyan": "#06b6d4",     // Highlights
        
        // ===== Demo App - Keep existing colors =====
        // Primary - niebieski jak w Stitch
        primary: {
          DEFAULT: "#1173d4",
          foreground: "#ffffff",
        },
        
        // Light Mode - Linear style
        "background-light": "#f6f7f8",
        "surface-light": "#ffffff",  /* Karty białe - różne od tła */
        "text-light": "#000000",
        "text-light-muted": "rgba(0, 0, 0, 0.6)",
        "text-light-secondary": "rgba(0, 0, 0, 0.8)",
        "border-light": "rgba(0, 0, 0, 0.1)",
        
        // Dark Mode - Linear style
        "background-dark": "#101922",
        "card-dark": "#283C4F",
        "text-dark": "#E0E6EB",
        "text-dark-muted": "#9BA3AF",
        "border-dark": "rgba(255, 255, 255, 0.1)",
        "surface-dark": "#283C4F",
        
        // Linear tokens
        "surface-0": "var(--surface-0)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "text-1": "var(--text-1)",
        "text-2": "var(--text-2)",
        "border-1": "var(--border-1)",
        "accent": "var(--accent)",
        "accent-weak": "var(--accent-weak)",
        
        // Status colors - dokładnie jak w Stitch
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        
        // ===== Legacy compatibility =====
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      fontSize: {
        xs: "var(--fs-xs)",
        sm: "var(--fs-sm)",
        base: "var(--fs-md)",
        lg: "var(--fs-lg)",
        xl: "var(--fs-xl)",
        "2xl": "var(--fs-2xl)",
        "3xl": "var(--fs-3xl)",
      },
      lineHeight: {
        tight: "var(--lh-tight)",
        normal: "var(--lh-def)",
        relaxed: "var(--lh-relaxed)",
      },
      fontWeight: {
        normal: "var(--fw-regular)",
        medium: "var(--fw-medium)",
        semibold: "var(--fw-semibold)",
        bold: "var(--fw-bold)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",      // 4px - Stitch style
        DEFAULT: "var(--radius)",     // 8px (0.25rem)
        md: "var(--radius)",
        lg: "var(--radius-lg)",      // 12px (0.5rem)
        xl: "var(--radius-xl)",      // 16px (0.75rem)
        full: "var(--radius-full)",
      },
      spacing: {
        1: "var(--space-1)",  // 4px
        2: "var(--space-2)",  // 8px
        3: "var(--space-3)",  // 12px
        4: "var(--space-4)",  // 16px
        5: "var(--space-5)",  // 20px
        6: "var(--space-6)",  // 24px
        8: "var(--space-8)",  // 32px
      },
      transitionDuration: {
        fast: "var(--motion-fast)",       // 0.15s
        base: "var(--motion-base)",       // 0.2s
        slow: "var(--motion-slow)",       // 0.3s
      },
      transitionTimingFunction: {
        'stitch-ease': 'var(--motion-easing)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
