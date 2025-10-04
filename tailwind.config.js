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
        // New design colors - Calm by Default
        primary: "#84a98c", // Szałwiowy zielony - bardziej stonowany
        "background-light": "#FBFBFA", // Off-white zamiast czystej bieli
        "background-dark": "#181818", // Ciemny szary zamiast czarnego
        "foreground-light": "#101922",
        "foreground-dark": "#f6f7f8",
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
        "border-light": "#e5e7eb",
        "border-dark": "#2c2c2c",
        "muted-light": "#6b7280",
        "muted-dark": "#9ca3af",
        
        // Priority colors - Calm approach (tylko P0/P1 kolorowe)
        "priority-p0": "#ef4444", // Czerwony - tylko dla krytycznych
        "priority-p1": "#f97316", // Pomarańczowy - tylko dla wysokich
        "priority-p2": "#9ca3af", // Szary - neutralny
        "priority-p3": "#9ca3af", // Szary - neutralny
        "priority-p4": "#9ca3af", // Szary - neutralny
        "priority-p5": "#9ca3af", // Szary - neutralny
        
        // Status colors
        "status-todo": "#9ca3af",
        "status-in-progress": "#3b82f6",
        "status-in-review": "#eab308",
        "status-done": "#22c55e",
        
        // Legacy colors for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
        // Legacy compatibility
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
