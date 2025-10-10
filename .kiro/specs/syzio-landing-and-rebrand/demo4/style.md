
# Syzio Design System — Kompletna Specyfikacja Wizualna

## 1. Strategia Koloru i Identyfikacja Wizualna

### 1.1 Paleta Podstawowa

```css
/* Brand Colors */
--brand-primary: #2D5BFF;      /* Intensywny niebieski - główny akcent */
--brand-secondary: #7C3AED;    /* Fiolet - akcent pomocniczy */
--brand-tertiary: #06B6D4;     /* Cyjan - info/tech akcent */

/* Background System (Dark Mode First) */
--bg-base: #0A0B0F;            /* Główne tło */
--bg-elevated: #13141A;        /* Karty, panele */
--bg-overlay: #1C1D26;         /* Modale, drawery */
--bg-subtle: rgba(45, 91, 255, 0.04); /* Subtelne podświetlenia */

/* Light Mode */
--bg-base-light: #FAFAFA;
--bg-elevated-light: #FFFFFF;
--bg-overlay-light: #FFFFFF;
--bg-subtle-light: rgba(45, 91, 255, 0.03);

/* Text System */
--text-primary: #F1F3F5;       /* Główny tekst (dark) */
--text-secondary: #9CA3AF;     /* Drugorzędny tekst */
--text-tertiary: #6B7280;      /* Pomocniczy tekst */
--text-inverse: #0A0B0F;       /* Tekst na jasnym tle */

--text-primary-light: #18181B;
--text-secondary-light: #52525B;
--text-tertiary-light: #A1A1AA;
```

### 1.2 Kolory Semantyczne (Status & Priority)

```css
/* Priority Colors */
--priority-p0: #EF4444;        /* Krytyczny - czerwony */
--priority-p0-bg: rgba(239, 68, 68, 0.08);
--priority-p0-border: rgba(239, 68, 68, 0.3);

--priority-p1: #F59E0B;        /* Wysoki - pomarańczowy */
--priority-p1-bg: rgba(245, 158, 11, 0.08);
--priority-p1-border: rgba(245, 158, 11, 0.3);

--priority-p2: #2D5BFF;        /* Średni - brand blue */
--priority-p2-bg: rgba(45, 91, 255, 0.08);
--priority-p2-border: rgba(45, 91, 255, 0.3);

--priority-p3: #6B7280;        /* Niski - szary */
--priority-p3-bg: rgba(107, 114, 128, 0.08);
--priority-p3-border: rgba(107, 114, 128, 0.3);

/* Status Colors */
--status-todo: #6B7280;        /* Szary */
--status-todo-bg: rgba(107, 114, 128, 0.08);

--status-progress: #2D5BFF;    /* Brand blue */
--status-progress-bg: rgba(45, 91, 255, 0.08);

--status-review: #06B6D4;      /* Cyjan */
--status-review-bg: rgba(6, 182, 212, 0.08);

--status-blocked: #EF4444;     /* Czerwony */
--status-blocked-bg: rgba(239, 68, 68, 0.08);

--status-done: #10B981;        /* Zielony */
--status-done-bg: rgba(16, 185, 129, 0.08);

/* Feedback Colors */
--success: #10B981;
--success-bg: rgba(16, 185, 129, 0.08);
--warning: #F59E0B;
--warning-bg: rgba(245, 158, 11, 0.08);
--error: #EF4444;
--error-bg: rgba(239, 68, 68, 0.08);
--info: #06B6D4;
--info-bg: rgba(6, 182, 212, 0.08);
```

### 1.3 Borders & Dividers

```css
--border-subtle: rgba(255, 255, 255, 0.06);
--border-default: rgba(255, 255, 255, 0.08);
--border-strong: rgba(255, 255, 255, 0.12);
--border-brand: rgba(45, 91, 255, 0.3);

/* Light mode */
--border-subtle-light: rgba(0, 0, 0, 0.04);
--border-default-light: rgba(0, 0, 0, 0.08);
--border-strong-light: rgba(0, 0, 0, 0.12);
```

---

## 2. Typografia

### 2.1 Font Stack

```css
/* Primary Font - Interface */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Monospace - IDs, code */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Display - Headers (opcjonalnie) */
--font-display: 'Inter', system-ui, sans-serif;
```

### 2.2 Skala Typograficzna

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 Text Styles (Komponenty)

```css
/* Display Heading - główne nagłówki */
.text-display {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* Page Title */
.text-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Section Heading */
.text-heading {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
}

/* Body Large */
.text-body-lg {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

/* Body */
.text-body {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Caption */
.text-caption {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

/* Monospace - IDs */
.text-mono {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: -0.01em;
}
```

---

## 3. Spacing System

```css
/* Base: 4px */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-7: 1.75rem;   /* 28px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-14: 3.5rem;   /* 56px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */

/* Semantic Spacing */
--spacing-xs: var(--space-2);
--spacing-sm: var(--space-3);
--spacing-md: var(--space-4);
--spacing-lg: var(--space-6);
--spacing-xl: var(--space-8);
--spacing-2xl: var(--space-12);
```

---

## 4. Border Radius

```css
--radius-sm: 0.5rem;    /* 8px - małe elementy */
--radius-md: 0.75rem;   /* 12px - karty, inputy */
--radius-lg: 1rem;      /* 16px - duże karty */
--radius-xl: 1.5rem;    /* 24px - modale */
--radius-full: 9999px;  /* Okrągłe - avatary, badges */

/* Semantic */
--radius-button: var(--radius-md);
--radius-card: var(--radius-lg);
--radius-input: var(--radius-md);
--radius-modal: var(--radius-xl);
```

---

## 5. Shadows & Elevation

```css
/* Subtle elevation - małe karty */
--shadow-sm: 
  0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default cards */
--shadow-md: 
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Elevated panels */
--shadow-lg: 
  0 10px 15px -3px rgba(0, 0, 0, 0.2),
  0 4px 6px -2px rgba(0, 0, 0, 0.1);

/* Floating elements - dropdowns, popovers */
--shadow-xl: 
  0 20px 25px -5px rgba(0, 0, 0, 0.3),
  0 10px 10px -5px rgba(0, 0, 0, 0.15);

/* Modals, drawers */
--shadow-2xl: 
  0 25px 50px -12px rgba(0, 0, 0, 0.4);

/* Brand glow - accent elements */
--shadow-brand: 
  0 0 0 1px rgba(45, 91, 255, 0.1),
  0 8px 24px -4px rgba(45, 91, 255, 0.2);

/* Focus ring */
--shadow-focus: 
  0 0 0 2px var(--bg-base),
  0 0 0 4px var(--brand-primary);
```

---

## 6. Komponenty UI — Szczegółowe Style

### 6.1 Button

```tsx
/* Button Variants */
.btn-primary {
  background: var(--brand-primary);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-button);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: all 150ms ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: #1E47E5;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}

.btn-ghost:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.btn-destructive {
  background: var(--error);
  color: white;
}

/* Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
}
```

### 6.2 Card

```tsx
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-out;
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

/* Card z lewym akcentem (priorytet) */
.card-accented {
  border-left: 3px solid var(--brand-primary);
  padding-left: calc(var(--space-6) - 3px);
}

/* Priority variants */
.card-p0 {
  border-left-color: var(--priority-p0);
}

.card-p1 {
  border-left-color: var(--priority-p1);
}
```

### 6.3 Badge

```tsx
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
  white-space: nowrap;
}

/* Priority badges */
.badge-p0 {
  background: var(--priority-p0-bg);
  color: var(--priority-p0);
  border: 1px solid var(--priority-p0-border);
}

.badge-p1 {
  background: var(--priority-p1-bg);
  color: var(--priority-p1);
  border: 1px solid var(--priority-p1-border);
}

/* Status badges */
.badge-todo {
  background: var(--status-todo-bg);
  color: var(--status-todo);
}

.badge-progress {
  background: var(--status-progress-bg);
  color: var(--status-progress);
}

.badge-done {
  background: var(--status-done-bg);
  color: var(--status-done);
}

/* Numbered badge (counters) */
.badge-count {
  background: var(--brand-primary);
  color: white;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 6.4 Input & Textarea

```tsx
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all 150ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-focus);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-error {
  border-color: var(--error);
}

.input-error:focus {
  box-shadow: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--error);
}

/* Search input z ikoną */
.input-search {
  padding-left: var(--space-10);
  background-image: url("data:image/svg+xml,..."); /* search icon */
  background-position: var(--space-3) center;
  background-repeat: no-repeat;
}
```

### 6.5 Avatar

```tsx
.avatar {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  border: 2px solid var(--border-default);
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Sizes */
.avatar-sm {
  width: 24px;
  height: 24px;
}

.avatar-lg {
  width: 48px;
  height: 48px;
}

.avatar-xl {
  width: 64px;
  height: 64px;
}

/* Avatar group - overlapping */
.avatar-group {
  display: flex;
  align-items: center;
  margin-left: calc(-1 * var(--space-2));
}

.avatar-group .avatar {
  margin-left: calc(-1 * var(--space-2));
  border: 2px solid var(--bg-elevated);
}
```

### 6.6 Progress Bar

```tsx
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-base);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--brand-primary);
  border-radius: var(--radius-full);
  transition: width 300ms ease-out;
}

/* Success variant */
.progress-success .progress-bar {
  background: var(--success);
}

/* With label */
.progress-labeled {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-labeled .progress {
  flex: 1;
}

.progress-labeled .progress-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}
```

---

## 7. Layout Patterns

### 7.1 Sidebar Navigation

```tsx
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  transition: width 200ms ease-out;
}

.sidebar-collapsed {
  width: 72px;
}

.sidebar-header {
  padding: var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 150ms ease-out;
  position: relative;
}

.sidebar-link:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.sidebar-link-active {
  background: var(--bg-subtle);
  color: var(--brand-primary);
}

.sidebar-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: var(--space-2);
  bottom: var(--space-2);
  width: 3px;
  background: var(--brand-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
```

### 7.2 Page Header (Sticky)

```tsx
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-base);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.page-header-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

### 7.3 Right Drawer (IssueDetail)

```tsx
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 560px;
  max-width: 90vw;
  background: var(--bg-overlay);
  border-left: 1px solid var(--border-default);
  box-shadow: var(--shadow-2xl);
  z-index: 50;
  display: flex;
  flex-direction: column;
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-default);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}
```

### 7.4 Kanban Board

```tsx
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  gap: var(--space-4);
  padding: var(--space-6);
  overflow-x: auto;
}

.kanban-column {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  min-height: 60vh;
  max-height: calc(100vh - 200px);
}

.kanban-column-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-column-title {
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.kanban-column-count {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: var(--bg-subtle);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}

.kanban-column-content {
  flex: 1;
  padding: var(--space-3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* WIP limit warning */
.kanban-column-wip-exceeded .kanban-column-header {
  background: var(--error-bg);
  border-bottom-color: var(--error);
}
```

### 7.5 Kanban Card (Task Card)

```tsx
.kanban-card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  cursor: grab;
  transition: all 150ms ease-out;
}

.kanban-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.kanban-card:active {
  cursor: grabbing;
  box-shadow: var(--shadow-xl);
  transform: scale(1.02);
}

.kanban-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.kanban-card-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.kanban-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-2);
}

.kanban-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.kanban-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

---

## 8. Animacje i Mikrointerakcje

```css
/* Timing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Durations */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;

/* Hover lift */
@keyframes lift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-2px);
  }
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide from right (drawer) */
@keyframes slideFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Skeleton loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 0%,
    var(--bg-overlay) 50%,
    var(--bg-elevated) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Przykład użycia w Tailwind */
@media (min-width: 768px) {
  .sidebar {
    display: block;
  }
  
  .kanban-board {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .sidebar-open {
    transform: translateX(0);
  }
  
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
```

---

## 10. Dark Mode Toggle Implementation

```tsx
// ThemeProvider component
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(stored || preferred);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () =>

# Syzio Design System — Kompletna Specyfikacja z Trybem Light & Dark

## 1. System Kolorów — Pełna Implementacja Dual Theme

### 1.1 Architektura Tokenów (CSS Variables)

```css
:root {
  /* === BRAND COLORS (stałe w obu trybach) === */
  --brand-primary-raw: 45, 91, 255;      /* #2D5BFF */
  --brand-secondary-raw: 124, 58, 237;   /* #7C3AED */
  --brand-tertiary-raw: 6, 182, 212;     /* #06B6D4 */
  
  --brand-primary: rgb(var(--brand-primary-raw));
  --brand-secondary: rgb(var(--brand-secondary-raw));
  --brand-tertiary: rgb(var(--brand-tertiary-raw));
}

/* === DARK MODE (domyślny) === */
:root, .dark {
  color-scheme: dark;
  
  /* Backgrounds */
  --bg-base: #0A0B0F;
  --bg-elevated: #13141A;
  --bg-overlay: #1C1D26;
  --bg-subtle: rgba(var(--brand-primary-raw), 0.04);
  --bg-hover: rgba(255, 255, 255, 0.04);
  --bg-active: rgba(255, 255, 255, 0.08);
  
  /* Text */
  --text-primary: #F1F3F5;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
  --text-quaternary: #52525B;
  --text-inverse: #0A0B0F;
  --text-on-brand: #FFFFFF;
  
  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.12);
  --border-brand: rgba(var(--brand-primary-raw), 0.3);
  
  /* Overlays */
  --overlay-light: rgba(255, 255, 255, 0.08);
  --overlay-dark: rgba(0, 0, 0, 0.4);
  --backdrop: rgba(0, 0, 0, 0.6);
  
  /* Shadows */
  --shadow-color: 0, 0, 0;
}

/* === LIGHT MODE === */
.light {
  color-scheme: light;
  
  /* Backgrounds */
  --bg-base: #FAFAFA;
  --bg-elevated: #FFFFFF;
  --bg-overlay: #FFFFFF;
  --bg-subtle: rgba(var(--brand-primary-raw), 0.03);
  --bg-hover: rgba(0, 0, 0, 0.04);
  --bg-active: rgba(0, 0, 0, 0.08);
  
  /* Text */
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --text-tertiary: #A1A1AA;
  --text-quaternary: #D4D4D8;
  --text-inverse: #FFFFFF;
  --text-on-brand: #FFFFFF;
  
  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.12);
  --border-brand: rgba(var(--brand-primary-raw), 0.3);
  
  /* Overlays */
  --overlay-light: rgba(0, 0, 0, 0.04);
  --overlay-dark: rgba(0, 0, 0, 0.6);
  --backdrop: rgba(0, 0, 0, 0.3);
  
  /* Shadows */
  --shadow-color: 0, 0, 0;
}
```

### 1.2 Kolory Semantyczne (adaptują się do trybu)

```css
:root {
  /* === SUCCESS === */
  --success-raw: 16, 185, 129;           /* #10B981 */
  --success: rgb(var(--success-raw));
}

.dark {
  --success-bg: rgba(var(--success-raw), 0.08);
  --success-border: rgba(var(--success-raw), 0.25);
  --success-text: #34D399;
  --success-hover: rgba(var(--success-raw), 0.12);
}

.light {
  --success-bg: rgba(var(--success-raw), 0.06);
  --success-border: rgba(var(--success-raw), 0.2);
  --success-text: #059669;
  --success-hover: rgba(var(--success-raw), 0.1);
}

:root {
  /* === WARNING === */
  --warning-raw: 245, 158, 11;           /* #F59E0B */
  --warning: rgb(var(--warning-raw));
}

.dark {
  --warning-bg: rgba(var(--warning-raw), 0.08);
  --warning-border: rgba(var(--warning-raw), 0.25);
  --warning-text: #FCD34D;
  --warning-hover: rgba(var(--warning-raw), 0.12);
}

.light {
  --warning-bg: rgba(var(--warning-raw), 0.06);
  --warning-border: rgba(var(--warning-raw), 0.2);
  --warning-text: #D97706;
  --warning-hover: rgba(var(--warning-raw), 0.1);
}

:root {
  /* === ERROR / DANGER === */
  --error-raw: 239, 68, 68;              /* #EF4444 */
  --error: rgb(var(--error-raw));
}

.dark {
  --error-bg: rgba(var(--error-raw), 0.08);
  --error-border: rgba(var(--error-raw), 0.25);
  --error-text: #F87171;
  --error-hover: rgba(var(--error-raw), 0.12);
}

.light {
  --error-bg: rgba(var(--error-raw), 0.06);
  --error-border: rgba(var(--error-raw), 0.2);
  --error-text: #DC2626;
  --error-hover: rgba(var(--error-raw), 0.1);
}

:root {
  /* === INFO === */
  --info-raw: 6, 182, 212;               /* #06B6D4 */
  --info: rgb(var(--info-raw));
}

.dark {
  --info-bg: rgba(var(--info-raw), 0.08);
  --info-border: rgba(var(--info-raw), 0.25);
  --info-text: #22D3EE;
  --info-hover: rgba(var(--info-raw), 0.12);
}

.light {
  --info-bg: rgba(var(--info-raw), 0.06);
  --info-border: rgba(var(--info-raw), 0.2);
  --info-text: #0891B2;
  --info-hover: rgba(var(--info-raw), 0.1);
}
```

### 1.3 Priority Colors (adaptują się)

```css
:root {
  /* === P0 - CRITICAL === */
  --priority-p0-raw: 239, 68, 68;
  --priority-p0: rgb(var(--priority-p0-raw));
}

.dark {
  --priority-p0-bg: rgba(var(--priority-p0-raw), 0.08);
  --priority-p0-border: rgba(var(--priority-p0-raw), 0.3);
  --priority-p0-text: #F87171;
}

.light {
  --priority-p0-bg: rgba(var(--priority-p0-raw), 0.06);
  --priority-p0-border: rgba(var(--priority-p0-raw), 0.2);
  --priority-p0-text: #DC2626;
}

:root {
  /* === P1 - HIGH === */
  --priority-p1-raw: 245, 158, 11;
  --priority-p1: rgb(var(--priority-p1-raw));
}

.dark {
  --priority-p1-bg: rgba(var(--priority-p1-raw), 0.08);
  --priority-p1-border: rgba(var(--priority-p1-raw), 0.3);
  --priority-p1-text: #FCD34D;
}

.light {
  --priority-p1-bg: rgba(var(--priority-p1-raw), 0.06);
  --priority-p1-border: rgba(var(--priority-p1-raw), 0.2);
  --priority-p1-text: #D97706;
}

:root {
  /* === P2 - MEDIUM === */
  --priority-p2: var(--brand-primary);
}

.dark {
  --priority-p2-bg: rgba(var(--brand-primary-raw), 0.08);
  --priority-p2-border: rgba(var(--brand-primary-raw), 0.3);
  --priority-p2-text: #60A5FA;
}

.light {
  --priority-p2-bg: rgba(var(--brand-primary-raw), 0.06);
  --priority-p2-border: rgba(var(--brand-primary-raw), 0.2);
  --priority-p2-text: #1D4ED8;
}

:root {
  /* === P3 - LOW === */
  --priority-p3-raw: 107, 114, 128;
  --priority-p3: rgb(var(--priority-p3-raw));
}

.dark {
  --priority-p3-bg: rgba(var(--priority-p3-raw), 0.08);
  --priority-p3-border: rgba(var(--priority-p3-raw), 0.3);
  --priority-p3-text: #9CA3AF;
}

.light {
  --priority-p3-bg: rgba(var(--priority-p3-raw), 0.06);
  --priority-p3-border: rgba(var(--priority-p3-raw), 0.2);
  --priority-p3-text: #6B7280;
}
```

### 1.4 Status Colors (Kanban)

```css
:root {
  /* === TODO === */
  --status-todo-raw: 107, 114, 128;
  --status-todo: rgb(var(--status-todo-raw));
}

.dark {
  --status-todo-bg: rgba(var(--status-todo-raw), 0.08);
  --status-todo-border: rgba(var(--status-todo-raw), 0.25);
  --status-todo-text: #9CA3AF;
}

.light {
  --status-todo-bg: rgba(var(--status-todo-raw), 0.06);
  --status-todo-border: rgba(var(--status-todo-raw), 0.2);
  --status-todo-text: #6B7280;
}

:root {
  /* === IN PROGRESS === */
  --status-progress: var(--brand-primary);
}

.dark {
  --status-progress-bg: rgba(var(--brand-primary-raw), 0.08);
  --status-progress-border: rgba(var(--brand-primary-raw), 0.25);
  --status-progress-text: #60A5FA;
}

.light {
  --status-progress-bg: rgba(var(--brand-primary-raw), 0.06);
  --status-progress-border: rgba(var(--brand-primary-raw), 0.2);
  --status-progress-text: #1D4ED8;
}

:root {
  /* === IN REVIEW === */
  --status-review: var(--info);
}

.dark {
  --status-review-bg: rgba(var(--info-raw), 0.08);
  --status-review-border: rgba(var(--info-raw), 0.25);
  --status-review-text: #22D3EE;
}

.light {
  --status-review-bg: rgba(var(--info-raw), 0.06);
  --status-review-border: rgba(var(--info-raw), 0.2);
  --status-review-text: #0891B2;
}

:root {
  /* === BLOCKED === */
  --status-blocked: var(--error);
}

.dark {
  --status-blocked-bg: rgba(var(--error-raw), 0.08);
  --status-blocked-border: rgba(var(--error-raw), 0.25);
  --status-blocked-text: #F87171;
}

.light {
  --status-blocked-bg: rgba(var(--error-raw), 0.06);
  --status-blocked-border: rgba(var(--error-raw), 0.2);
  --status-blocked-text: #DC2626;
}

:root {
  /* === DONE === */
  --status-done: var(--success);
}

.dark {
  --status-done-bg: rgba(var(--success-raw), 0.08);
  --status-done-border: rgba(var(--success-raw), 0.25);
  --status-done-text: #34D399;
}

.light {
  --status-done-bg: rgba(var(--success-raw), 0.06);
  --status-done-border: rgba(var(--success-raw), 0.2);
  --status-done-text: #059669;
}
```

---

## 2. Shadows — Adaptacja do Trybu

```css
/* === DARK MODE SHADOWS === */
.dark {
  --shadow-sm: 
    0 1px 2px 0 rgba(0, 0, 0, 0.3);
  
  --shadow-md: 
    0 4px 6px -1px rgba(0, 0, 0, 0.4),
    0 2px 4px -1px rgba(0, 0, 0, 0.3);
  
  --shadow-lg: 
    0 10px 15px -3px rgba(0, 0, 0, 0.5),
    0 4px 6px -2px rgba(0, 0, 0, 0.4);
  
  --shadow-xl: 
    0 20px 25px -5px rgba(0, 0, 0, 0.6),
    0 10px 10px -5px rgba(0, 0, 0, 0.4);
  
  --shadow-2xl: 
    0 25px 50px -12px rgba(0, 0, 0, 0.7);
  
  --shadow-brand: 
    0 0 0 1px rgba(var(--brand-primary-raw), 0.15),
    0 8px 24px -4px rgba(var(--brand-primary-raw), 0.25);
  
  --shadow-focus: 
    0 0 0 2px var(--bg-base),
    0 0 0 4px var(--brand-primary);
  
  --shadow-error: 
    0 0 0 2px var(--bg-base),
    0 0 0 4px var(--error);
}

/* === LIGHT MODE SHADOWS === */
.light {
  --shadow-sm: 
    0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  --shadow-md: 
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 2px 4px -1px rgba(0, 0, 0, 0.04);
  
  --shadow-lg: 
    0 10px 15px -3px rgba(0, 0, 0, 0.12),
    0 4px 6px -2px rgba(0, 0, 0, 0.08);
  
  --shadow-xl: 
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.1);
  
  --shadow-2xl: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  --shadow-brand: 
    0 0 0 1px rgba(var(--brand-primary-raw), 0.1),
    0 8px 24px -4px rgba(var(--brand-primary-raw), 0.15);
  
  --shadow-focus: 
    0 0 0 2px var(--bg-base),
    0 0 0 4px var(--brand-primary);
  
  --shadow-error: 
    0 0 0 2px var(--bg-base),
    0 0 0 4px var(--error);
}
```

---

## 3. Komponenty z Pełnym Wsparciem Dark/Light

### 3.1 Button — Wszystkie Warianty

```css
/* === PRIMARY BUTTON === */
.btn-primary {
  background: var(--brand-primary);
  color: var(--text-on-brand);
  border: 1px solid transparent;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-button);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: all 150ms ease-out;
  box-shadow: 0 1px 2px rgba(var(--shadow-color), 0.1);
}

.btn-primary:hover {
  background: rgb(29, 78, 216); /* darker blue */
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* === SECONDARY BUTTON === */
.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-button);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: all 150ms ease-out;
}

.btn-secondary:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}

/* Light mode specific hover */
.light .btn-secondary:hover {
  background: var(--bg-subtle);
}

/* === GHOST BUTTON === */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid transparent;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-button);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  transition: all 150ms ease-out;
}

.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* === DESTRUCTIVE BUTTON === */
.btn-destructive {
  background: var(--error);
  color: white;
  border: 1px solid transparent;
}

.btn-destructive:hover {
  background: rgb(220, 38, 38); /* darker red */
}

/* === DISABLED STATE === */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 3.2 Card — Dark & Light

```css
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-out;
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

/* Light mode - delikatniejszy hover */
.light .card:hover {
  box-shadow: var(--shadow-lg);
}

/* Card z lewym akcentem (priority) */
.card-accented-p0 {
  border-left: 3px solid var(--priority-p0);
  padding-left: calc(var(--space-6) - 3px);
}

.card-accented-p1 {
  border-left: 3px solid var(--priority-p1);
  padding-left: calc(var(--space-6) - 3px);
}

.card-accented-p2 {
  border-left: 3px solid var(--priority-p2);
  padding-left: calc(var(--space-6) - 3px);
}

/* Card interactive (clickable) */
.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-2px);
}

.card-interactive:active {
  transform: translateY(0);
}
```

### 3.3 Input & Textarea — Dark/Light

```css
.input, .textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  transition: all 150ms ease-out;
}

.input::placeholder, .textarea::placeholder {
  color: var(--text-tertiary);
}

.input:focus, .textarea:focus {
  outline: none;
  background: var(--bg-elevated);
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-focus);
}

/* Light mode - białe tło przy focus */
.light .input:focus, .light .textarea:focus {
  background: var(--bg-elevated);
}

/* Error state */
.input-error, .textarea-error {
  border-color: var(--error);
}

.input-error:focus, .textarea-error:focus {
  box-shadow: var(--shadow-error);
}

/* Disabled */
.input:disabled, .textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-subtle);
}
```

### 3.4 Badge — Wszystkie Warianty z Dark/Light

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all 150ms ease-out;
}

/* Priority badges */
.badge-p0 {
  background: var(--priority-p0-bg);
  color: var(--priority-p0-text);
  border-color: var(--priority-p0-border);
}

.badge-p1 {
  background: var(--priority-p1-bg);
  color: var(--priority-p1-text);
  border-color: var(--priority-p1-border);
}

.badge-p2 {
  background: var(--priority-p2-bg);
  color: var(--priority-p2-text);
  border-color: var(--priority-p2-border);
}

.badge-p3 {
  background: var(--priority-p3-bg);
  color: var(--priority-p3-text);
  border-color: var(--priority-p3-border);
}

/* Status badges */
.badge-todo {
  background: var(--status-todo-bg);
  color: var(--status-todo-text);
  border-color: var(--status-todo-border);
}

.badge-progress {
  background: var(--status-progress-bg);
  color: var(--status-progress-text);
  border-color: var(--status-progress-border);
}

.badge-review {
  background: var(--status-review-bg);
  color: var(--status-review-text);
  border-color: var(--status-review-border);
}

.badge-blocked {
  background: var(--status-blocked-bg);
  color: var(--status-blocked-text);
  border-color: var(--status-blocked-border);
}

.badge-done {
  background: var(--status-done-bg);
  color: var(--status-done-text);
  border-color: var(--status-done-border);
}

/* Solid variant (np. dla liczników) */
.badge-solid {
  background: var(--brand-primary);
  color: var(--text-on-brand);
  border-color: transparent;
}
```

### 3.5 Avatar — Dark/Light

```css
.avatar {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  border: 2px solid var(--border-default);
  overflow: hidden;
  position: relative;
}

/* Light mode - cieńsza ramka */
.light .avatar {
  border-color: var(--border-subtle);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fallback - inicjały */
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--bg-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
}

/* Online indicator */
.avatar-online::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: var(--success);
  border: 2px solid var(--bg-elevated);
  border-radius: var(--radius-full);
}

/* Sizes */
.avatar-sm {
  width: 24px;
  height: 24px;
}

.avatar-lg {
  width: 48px;
  height: 48px;
}

.avatar-xl {
  width: 64px;
  height: 64px;
}

/* Avatar group */
.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-group .avatar {
  margin-left: calc(-1 * var(--space-2));
  border-width: 2px;
  border-color: var(--bg-elevated);
}

.avatar-group .avatar:first-child {
  margin-left: 0;
}
```

---

## 4. Layout Components — Dark/Light

### 4.1 Sidebar Navigation

```css
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  transition: width 200ms ease-out;
}

/* Light mode - mocniejszy cień */
.light .sidebar {
  box-shadow: var(--shadow-sm);
}

.sidebar-collapsed {
  width: 72px;
}

.sidebar-header {
  padding: var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
}

/* Custom scrollbar dla dark mode */
.dark .sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.dark .sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.dark .sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.dark .sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Light mode scrollbar */
.light .sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.light .sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all 150ms ease-out;
  position: relative;
}

.sidebar-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-link-active {
  background: var(--bg-subtle);
  color: var(--brand-primary);
}

/* Active indicator */
.sidebar-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: var(--space-2);
  bottom: var(--space-2);
  width: 3px;
  background: var(--brand-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
```

### 4.2 Page Header (Sticky)

```css
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-base);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 64px;
}

```css
/* Light mode - lekka przezroczystość */
.light .page-header {
  background: rgba(250, 250, 250, 0.8);
}

/* Dark mode - mocniejsze tło */
.dark .page-header {
  background: rgba(10, 11, 15, 0.8);
}

.page-header-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.page-header-title h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

### 4.3 Right Drawer (IssueDetailView)

```css
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  z-index: 40;
  animation: fadeIn 200ms ease-out;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 560px;
  max-width: 90vw;
  background: var(--bg-overlay);
  border-left: 1px solid var(--border-default);
  box-shadow: var(--shadow-2xl);
  z-index: 50;
  display: flex;
  flex-direction: column;
  animation: slideFromRight 200ms ease-out;
}

/* Light mode - mocniejszy cień */
.light .drawer {
  box-shadow: 
    -4px 0 24px rgba(0, 0, 0, 0.08),
    -1px 0 4px rgba(0, 0, 0, 0.04);
}

.drawer-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-default);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 64px;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

/* Scrollbar styling */
.dark .drawer-content::-webkit-scrollbar {
  width: 8px;
}

.dark .drawer-content::-webkit-scrollbar-track {
  background: transparent;
}

.dark .drawer-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.light .drawer-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}
```

### 4.4 Kanban Board — Complete Dark/Light

```css
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  gap: var(--space-4);
  padding: var(--space-6);
  overflow-x: auto;
  min-height: calc(100vh - 200px);
}

/* Custom scrollbar dla horizontal scroll */
.dark .kanban-board::-webkit-scrollbar {
  height: 8px;
}

.dark .kanban-board::-webkit-scrollbar-track {
  background: var(--bg-base);
  border-radius: var(--radius-full);
}

.dark .kanban-board::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.light .kanban-board::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.kanban-column {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  min-height: 60vh;
  max-height: calc(100vh - 200px);
}

/* Light mode - subtelny cień */
.light .kanban-column {
  box-shadow: var(--shadow-sm);
}

.kanban-column-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.kanban-column-title {
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.kanban-column-count {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  min-width: 24px;
  text-align: center;
}

.kanban-column-content {
  flex: 1;
  padding: var(--space-3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Status-specific column headers */
.kanban-column-todo .kanban-column-header {
  background: var(--status-todo-bg);
}

.kanban-column-progress .kanban-column-header {
  background: var(--status-progress-bg);
}

.kanban-column-review .kanban-column-header {
  background: var(--status-review-bg);
}

.kanban-column-done .kanban-column-header {
  background: var(--status-done-bg);
}

/* WIP limit exceeded */
.kanban-column-wip-exceeded .kanban-column-header {
  background: var(--error-bg);
  border-bottom-color: var(--error-border);
}

.kanban-column-wip-exceeded .kanban-column-count {
  background: var(--error);
  color: white;
}
```

### 4.5 Kanban Card — Dark/Light z Priority

```css
.kanban-card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  cursor: grab;
  transition: all 150ms ease-out;
  position: relative;
}

/* Light mode - subtelny cień zawsze */
.light .kanban-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.kanban-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.kanban-card:active {
  cursor: grabbing;
  box-shadow: var(--shadow-xl);
  transform: scale(1.02);
}

/* Priority indicator - lewy akcent */
.kanban-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: var(--space-2);
  bottom: var(--space-2);
  width: 3px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.kanban-card-p0::before {
  background: var(--priority-p0);
}

.kanban-card-p1::before {
  background: var(--priority-p1);
}

.kanban-card-p2::before {
  background: var(--priority-p2);
}

.kanban-card-p3::before {
  background: var(--priority-p3);
}

.kanban-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.kanban-card-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-medium);
}

.kanban-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.kanban-card-description {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.kanban-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.kanban-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.kanban-card-sp {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  background: var(--bg-subtle);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

/* Dragging state */
.kanban-card-dragging {
  opacity: 0.5;
  cursor: grabbing;
}

/* Drop zone highlight */
.kanban-column-dragover {
  background: var(--bg-subtle);
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--brand-primary);
}
```

---

## 5. Modal & Dialog — Dark/Light

```css
/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeIn 200ms ease-out;
}

/* Modal container */
.modal {
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 640px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: scaleIn 200ms ease-out;
}

/* Light mode - mocniejszy cień */
.light .modal {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 150ms ease-out;
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
}

/* Alert Dialog (destructive) */
.alert-dialog .modal-header {
  background: var(--error-bg);
  border-bottom-color: var(--error-border);
}

.alert-dialog .modal-title {
  color: var(--error-text);
}
```

---

## 6. Table — Dark/Light

```css
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
}

/* Light mode - cień */
.light .table-container {
  box-shadow: var(--shadow-sm);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table thead {
  background: var(--bg-base);
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Light mode - mocniejsze tło nagłówka */
.light .table thead {
  background: var(--bg-subtle);
}

.table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-default);
  white-space: nowrap;
}

.table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background 150ms ease-out;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody tr:hover {
  background: var(--bg-hover);
}

/* Light mode - wyraźniejszy hover */
.light .table tbody tr:hover {
  background: var(--bg-subtle);
}

.table td {
  padding: var(--space-4);
  color: var(--text-primary);
}

/* Row selection */
.table tbody tr.selected {
  background: var(--bg-subtle);
}

.table tbody tr.selected:hover {
  background: rgba(var(--brand-primary-raw), 0.08);
}

/* Clickable rows */
.table tbody tr.clickable {
  cursor: pointer;
}

/* Responsive table */
@media (max-width: 768px) {
  .table th,
  .table td {
    padding: var(--space-3);
    font-size: var(--text-xs);
  }
}
```

---

## 7. Toast Notifications — Dark/Light

```css
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 420px;
  width: 100%;
}

.toast {
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  animation: slideUp 200ms ease-out;
}

/* Light mode */
.light .toast {
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.toast-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.toast-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Toast variants */
.toast-success {
  border-left: 3px solid var(--success);
}

.toast-success .toast-icon {
  color: var(--success-text);
}

.toast-error {
  border-left: 3px solid var(--error);
}

.toast-error .toast-icon {
  color: var(--error-text);
}

.toast-warning {
  border-left: 3px solid var(--warning);
}

.toast-warning .toast-icon {
  color: var(--warning-text);
}

.toast-info {
  border-left: 3px solid var(--info);
}

.toast-info .toast-icon {
  color: var(--info-text);
}
```

---

## 8. Command Palette — Dark/Light

```css
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  z-index: 60;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  animation: fadeIn 150ms ease-out;
}

.command-palette {
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 640px;
  max-width: 90vw;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  animation: scaleIn 150ms ease-out;
}

/* Light mode */
.light .command-palette {
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.08);
}

.command-palette-input-wrapper {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.command-palette-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--text-base);
  color: var(--text-primary);
  padding: 0;
}

.command-palette-input::placeholder {
  color: var(--text-tertiary);
}

.command-palette-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.command-palette-group {
  padding: var(--space-2) 0;
}

.command-palette-group:not(:last-child) {
  border-bottom: 1px solid var(--border-subtle);
}

.command-palette-group-label {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.command-palette-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms ease-out;
  color: var(--text-primary);
}

.command-palette-item:hover,
.command-palette-item-selected {
  background: var(--bg-hover);
}

/* Light mode - wyraźniejszy hover */
.light .command-palette-item:hover,
.light .command-palette-item-selected {
  background: var(--bg-subtle);
}

.command-palette-item-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.command-palette-item-content {
  flex: 1;
  min-width: 0;
}

.command-palette-item-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.command-palette-item-subtitle {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.command-palette-item-shortcut {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.command-palette-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--space-2);
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  box-shadow: 0 1px 2px rgba(var(--shadow-color), 0.05);
}

/* Light mode - wyraźniejsze keybindy */
.light .command-palette-key {
  background: white;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.command-palette-empty {
  padding: var(--space-12) var(--space-6);
  text-align: center;
  color: var(--text-tertiary);
}
```

---

## 9. Theme Toggle Component

```tsx
// ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
```

```css
.theme-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.theme-toggle:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.theme-toggle:active {
  transform: scale(0.95);
}
```

---

## 10. Empty States — Dark/Light

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16) var(--space-8);
  min-height: 400px;
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-4);
  color: var(--text-quaternary);
}

/* Light mode - lżejsza ikona */
.light .empty-state-icon {
  opacity: 0.4;
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  max-width: 400px;
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
}

.empty-state-action {
  /* Używa .btn-primary */
}
```

---

## 11. Loading States — Skeleton & Spinner

```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 0%,
    var(--bg-overlay) 50%,
    var(--bg-elevated) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Light mode - subtelniejszy shimmer */
.light .skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 0%,
    var(--bg-subtle) 50%,
    var(--bg-elevated) 100%
  );
}

.skeleton-text {
  height: 1em;
  border-radius: var(--radius-sm);
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}

.skeleton-card {
  width: 100%;
  height: 200px;
  border-radius: var(--radius-lg);
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-default);
  border-top-color: var(--brand-primary);
  border-radius: var(--radius-full);
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}
```

---

## 12. Progress Bar — Dark/Light

```css
.progress-wrapper {
  width: 100%;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.progress-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.progress-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-base);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

/* Light mode - border dla widoczności */
.light .progress {
  border: 1px solid var(--border-subtle);
}

.progress-bar {
  height: 100%;
  background: var(--brand-primary);
  border-radius: var(--radius-full);
  transition: width 300ms ease-out;
  position: relative;
  overflow: hidden;
}

/* Animated gradient */
.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: progressShine 2s infinite;
}

@keyframes progressShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Variants */
.progress-bar-success {
  background: var(--success);
}

.progress-bar-warning {
  background: var(--warning);
}

.progress-bar-error {



```css
.progress-bar-error {
  background: var(--error);
}

/* Sizes */
.progress-sm {
  height: 4px;
}

.progress-lg {
  height: 12px;
}

/* Indeterminate (loading) */
.progress-indeterminate .progress-bar {
  width: 40% !important;
  animation: progressIndeterminate 1.5s ease-in-out infinite;
}

@keyframes progressIndeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}
```

---

## 13. Tabs Component — Dark/Light

```css
.tabs {
  width: 100%;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 var(--space-4);
}

.tabs-trigger {
  position: relative;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all 150ms ease-out;
  white-space: nowrap;
}

.tabs-trigger:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tabs-trigger-active {
  color: var(--brand-primary);
  background: transparent;
}

/* Active indicator */
.tabs-trigger-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand-primary);
  border-radius: var(--radius-full) var(--radius-full) 0 0;
}

.tabs-content {
  padding: var(--space-6) var(--space-4);
  animation: fadeIn 200ms ease-out;
}

/* Pills variant */
.tabs-pills .tabs-list {
  border-bottom: none;
  background: var(--bg-elevated);
  padding: var(--space-1);
  border-radius: var(--radius-lg);
  display: inline-flex;
}

.tabs-pills .tabs-trigger {
  border-radius: var(--radius-md);
}

.tabs-pills .tabs-trigger-active {
  background: var(--bg-base);
  box-shadow: var(--shadow-sm);
}

.tabs-pills .tabs-trigger-active::after {
  display: none;
}

/* Light mode - wyraźniejsze tło pills */
.light .tabs-pills .tabs-list {
  background: var(--bg-subtle);
}

.light .tabs-pills .tabs-trigger-active {
  background: white;
  box-shadow: var(--shadow-sm);
}
```

---

## 14. Dropdown Menu — Dark/Light

```css
.dropdown-trigger {
  /* Używa .btn-ghost lub .btn-secondary */
}

.dropdown-content {
  min-width: 200px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  box-shadow: var(--shadow-xl);
  animation: scaleIn 150ms ease-out;
}

/* Light mode */
.light .dropdown-content {
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 150ms ease-out;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--bg-hover);
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

.dropdown-item:hover .dropdown-item-icon {
  color: var(--text-primary);
}

.dropdown-item-destructive {
  color: var(--error-text);
}

.dropdown-item-destructive:hover {
  background: var(--error-bg);
}

.dropdown-item-destructive .dropdown-item-icon {
  color: var(--error-text);
}

.dropdown-separator {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-2) 0;
}

.dropdown-label {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Shortcut hint */
.dropdown-item-shortcut {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
```

---

## 15. Select Component — Dark/Light

```css
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-input);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.select-trigger:hover {
  border-color: var(--border-strong);
}

.select-trigger:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-focus);
}

.select-trigger[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-trigger-placeholder {
  color: var(--text-tertiary);
}

.select-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  transition: transform 150ms ease-out;
}

.select-trigger[data-state="open"] .select-icon {
  transform: rotate(180deg);
}

.select-content {
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  box-shadow: var(--shadow-xl);
  animation: scaleIn 150ms ease-out;
}

/* Light mode */
.light .select-content {
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.select-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 150ms ease-out;
  position: relative;
}

.select-item:hover {
  background: var(--bg-hover);
}

.select-item[data-state="checked"] {
  background: var(--bg-subtle);
  color: var(--brand-primary);
}

.select-item-indicator {
  position: absolute;
  right: var(--space-3);
  width: 16px;
  height: 16px;
  color: var(--brand-primary);
}
```

---

## 16. Checkbox & Switch — Dark/Light

```css
/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.checkbox {
  width: 20px;
  height: 20px;
  background: var(--bg-base);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.checkbox:hover {
  border-color: var(--border-strong);
}

.checkbox[data-state="checked"] {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.checkbox-icon {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 150ms ease-out;
}

.checkbox[data-state="checked"] .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-label {
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

/* Switch */
.switch {
  width: 44px;
  height: 24px;
  background: var(--bg-base);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.switch:hover {
  border-color: var(--border-strong);
}

.switch[data-state="checked"] {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.switch-thumb {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: var(--radius-full);
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 200ms ease-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.switch[data-state="checked"] .switch-thumb {
  transform: translateX(20px);
}

.switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 17. Tooltip — Dark/Light

```css
.tooltip-trigger {
  /* Element który wywołuje tooltip */
}

.tooltip-content {
  max-width: 300px;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  animation: fadeIn 150ms ease-out;
}

/* Light mode */
.light .tooltip-content {
  background: var(--text-inverse);
  color: white;
  border-color: transparent;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.1);
}

.tooltip-arrow {
  fill: var(--bg-overlay);
}

.light .tooltip-arrow {
  fill: var(--text-inverse);
}
```

---

## 18. Separator — Dark/Light

```css
.separator {
  background: var(--border-subtle);
  flex-shrink: 0;
}

.separator-horizontal {
  height: 1px;
  width: 100%;
}

.separator-vertical {
  width: 1px;
  height: 100%;
}

/* Stronger variant */
.separator-strong {
  background: var(--border-default);
}
```

---

## 19. Alert Component — Dark/Light

```css
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.alert-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.alert-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}

/* Variants */
.alert-info {
  background: var(--info-bg);
  border-color: var(--info-border);
}

.alert-info .alert-icon {
  color: var(--info-text);
}

.alert-success {
  background: var(--success-bg);
  border-color: var(--success-border);
}

.alert-success .alert-icon {
  color: var(--success-text);
}

.alert-warning {
  background: var(--warning-bg);
  border-color: var(--warning-border);
}

.alert-warning .alert-icon {
  color: var(--warning-text);
}

.alert-error {
  background: var(--error-bg);
  border-color: var(--error-border);
}

.alert-error .alert-icon {
  color: var(--error-text);
}

/* Solid variant */
.alert-solid-info {
  background: var(--info);
  color: white;
  border-color: transparent;
}

.alert-solid-success {
  background: var(--success);
  color: white;
  border-color: transparent;
}

.alert-solid-warning {
  background: var(--warning);
  color: white;
  border-color: transparent;
}

.alert-solid-error {
  background: var(--error);
  color: white;
  border-color: transparent;
}
```

---

## 20. Demo Mode Banner — Dark/Light

```css
.demo-banner {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--brand-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-banner-icon {
  width: 20px;
  height: 20px;
}

.demo-banner-text {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.demo-banner-link {
  color: white;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 150ms ease-out;
}

.demo-banner-link:hover {
  opacity: 0.8;
}

.demo-banner-close {
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 150ms ease-out;
}

.demo-banner-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Collapsed state (mobile) */
@media (max-width: 768px) {
  .demo-banner-text span:not(:first-child) {
    display: none;
  }
}
```

---

## 21. Context Menu — Dark/Light

```css
.context-menu-content {
  min-width: 200px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  box-shadow: var(--shadow-xl);
  animation: scaleIn 150ms ease-out;
}

/* Light mode */
.light .context-menu-content {
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.context-menu-item:hover {
  background: var(--bg-hover);
}

.context-menu-item-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

.context-menu-item:hover .context-menu-item-icon {
  color: var(--text-primary);
}

.context-menu-item[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.context-menu-separator {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-2) 0;
}
```

---

## 22. Pagination — Dark/Light

```css
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
}

.pagination-button {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-2);
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.pagination-button:hover:not([disabled]) {
  background: var(--bg-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.pagination-button-active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;
}

.pagination-button-active:hover {
  background: var(--brand-primary);
  opacity: 0.9;
}

.pagination-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-ellipsis {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}
```

---

## 23. Breadcrumb — Dark/Light

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 150ms ease-out;
}

.breadcrumb-link:hover {
  color: var(--text-primary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

.breadcrumb-separator {
  color: var(--text-tertiary);
  user-select: none;
}
```

---

## 24. Responsive Utilities

```css
/* Hide/Show based on breakpoint */
.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: block;
  }
}

.hidden-desktop {
  display: block;
}

@media (min-width: 768px) {
  .hidden-desktop {
    display: none;
  }
}

/* Mobile-first grid */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 25. Print Styles

```css
@media print {
  /* Hide navigation */
  .sidebar,
  .page-header,
  .demo-banner,
  .drawer {
    display: none !important;
  }

  /* Adjust colors for print */
  :root {
    --bg-base: white;
    --bg-elevated: white;
    --text-primary: black;
    --text-secondary: #333;
    --border-default: #ddd;
  }

  /* Remove shadows */
  * {
    box-shadow: none !important;
  }

  /* Page breaks */
  .card,
  .kanban-card {
    page-break-inside: avoid;
  }
}
```

---

## 26. Accessibility Focus Styles

```css
/* Enhanced focus visible */
*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  z-index: 200;
  padding: var(--space-3) var(--space-4);
  background: var(--brand-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  text-decoration: none;
  box-shadow: var(--shadow-xl);
}

.skip-to-content:focus {
  top: var(--space-4);
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 27. Utility Classes (pomocnicze)

```css
/* Spacing utilities */
.p-0 { padding: 0; }
.p-2 { padding: var(--space-2); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }

.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }

.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }

/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }

/* Text utilities */
.text-center { text-align: center; }
.font-bold { font-weight: var(--font-bold); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }

/* Color utilities */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-brand { color: var(--brand-primary); }
.text-error { color: var(--error-text); }
.text-success { color: var(--success-text); }
```

---

## 28. Tailwind Config (dla projektu)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary-raw) / <alpha-value>)',
          secondary: 'rgb(var(--brand-secondary-raw) / <alpha-value>)',
          tertiary: 'rgb(var(--brand-tertiary-raw) / <alpha-value>)',
        },
        bg: {
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          overlay: 'var(--bg-overlay)',
          subtle: 'var(--bg-subtle)',
          hover: 'var(--bg-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'brand': 'var(--shadow-brand)',
        'focus': 'var(--shadow-focus)',
      },
    },
  },
  plugins: [],
};
```

---

**🎨 Design System Complete — Gotowy do Implementacji**

Ten system zapewnia:
- ✅ Pełne wsparcie Dark & Light mode
- ✅ Wszystkie komponenty shadcn/ui
- ✅ Semantyczne tokeny kolorów
- ✅ Responsywność mobile-first
- ✅ Accessibility (WCAG AA+)
- ✅ Smooth animations & transitions
- ✅ Print styles
- ✅ Utility classes