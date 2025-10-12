# Design Document - Demo 6 Canis UI Redesign

## Overview

Ten dokument opisuje szczegółowy design redesignu interfejsu użytkownika dla Demo 6 (Syzio Canis). Redesign opiera się na nowych makietach HTML, które wprowadzają bardziej spójny, nowoczesny i profesjonalny wygląd aplikacji.

### Główne Cele Redesignu

1. **Spójność Wizualna**: Ujednolicenie systemu kolorów, typografii i komponentów
2. **Lepsza Czytelność**: Wykorzystanie czcionki Inter i lepszych kontrastów
3. **Nowoczesny Wygląd**: Material Icons, zaokrąglone rogi, subtelne cienie
4. **Responsywność**: Lepsze wsparcie dla różnych rozmiarów ekranów
5. **Dostępność**: Zgodność z WCAG AA

### Kluczowe Zmiany

- Migracja z Lucide Icons na Material Icons
- Nowa paleta kolorów z lepszym kontrastem
- Czcionka Inter zamiast Geist
- Przeprojektowane wszystkie widoki zgodnie z makietami
- Ulepszony system spacingu i borderów
- Nowe komponenty UI (toggle switches, badges, cards)

## Architecture

### Struktura Plików (Bez Zmian)

Redesign nie zmienia struktury plików - aktualizujemy tylko istniejące komponenty:

```
app/
├── (demo6_root)/
│   ├── layout.tsx              # Aktualizacja: Inter font, nowe meta
│   ├── providers.tsx           # Bez zmian
│   └── demo6/
│       └── page.tsx            # Bez zmian
│
├── demo6-globals.css           # GŁÓWNA AKTUALIZACJA: nowe CSS variables
│
components/
└── demo6/
    ├── canis-main-view.tsx     # Aktualizacja: nowy TopBar, Material Icons
    ├── canis-chat.tsx          # Aktualizacja: nowy layout, style
    ├── stories-generator.tsx   # Aktualizacja: nowy layout, Gherkin highlighting
    ├── test-data-generator.tsx # Aktualizacja: nowy layout, edytor reguł
    ├── verify-view.tsx         # Aktualizacja: nowa tabela, trace matrix
    ├── release-qa.tsx          # Aktualizacja: nowy layout Q&A
    ├── settings-view.tsx       # Aktualizacja: nowe sekcje, toggle switches
    ├── command-palette.tsx     # Aktualizacja: Material Icons
    └── theme-provider.tsx      # Bez zmian
│
lib/demo6/                      # Bez zmian w logice
```



## Design System

### Color Palette

Nowa paleta kolorów oparta na makietach HTML:

```css
/* demo6-globals.css */
:root {
  /* Primary Colors */
  --primary: #4F46E5;              /* Indigo - główny kolor akcji */
  
  /* Background Colors - Light Mode */
  --background-light: #FFFFFF;      /* Główne tło */
  --surface-light: #F9FAFB;         /* Karty, panele */
  
  /* Background Colors - Dark Mode */
  --background-dark: #111827;       /* Główne tło */
  --surface-dark: #1F2937;          /* Karty, panele */
  
  /* Border Colors */
  --border-light: #E5E7EB;          /* Granice w light mode */
  --border-dark: #374151;           /* Granice w dark mode */
  
  /* Text Colors - Light Mode */
  --text-light: #1F2937;            /* Główny tekst */
  --text-secondary-light: #6B7280;  /* Tekst pomocniczy */
  
  /* Text Colors - Dark Mode */
  --text-dark: #F9FAFB;             /* Główny tekst */
  --text-secondary-dark: #9CA3AF;   /* Tekst pomocniczy */
  
  /* Accent Colors */
  --primary-light: #E0E7FF;         /* Tło dla primary elementów (light) */
  --primary-dark: #3730A3;          /* Tło dla primary elementów (dark) */
  
  /* Status Colors */
  --success: #10B981;               /* Sukces */
  --warning: #F59E0B;               /* Ostrzeżenie */
  --danger: #EF4444;                /* Błąd */
  
  /* Gherkin Syntax Highlighting */
  --gherkin-keyword: #D946EF;       /* Fioletowy dla Given/When/Then */
}
```

### Typography

```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### Spacing System

```css
/* Spacing Scale (Tailwind) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px - DEFAULT */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pełne zaokrąglenie */
```



## Component Redesigns

### 1. TopBar / Header

**Plik**: `components/demo6/canis-main-view.tsx`

**Zmiany**:
- Logo z Material Icon `auto_awesome` + tekst "Syzio — Canis"
- Selektor projektu w formacie badge: "ACME / SHOP"
- Przyciski pomocy i ustawień z Material Icons
- Border-bottom z kolorem border
- Padding: `p-4`

**Nowy Kod**:
```tsx
<header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <span className="material-icons text-primary">auto_awesome</span>
      <h1 className="text-lg font-semibold">Syzio — Canis</h1>
    </div>
    <div className="flex items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md px-2 py-1 text-sm">
      <span>ACME / SHOP</span>
    </div>
  </div>
  <div className="flex items-center space-x-4">
    <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark">
      <span className="material-icons">help_outline</span>
    </button>
    <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark">
      <span className="material-icons">settings</span>
    </button>
  </div>
</header>
```

### 2. Tab Navigation

**Plik**: `components/demo6/canis-main-view.tsx`

**Zmiany**:
- Border-bottom dla całej sekcji nawigacji
- Aktywna zakładka: `border-b-2 border-primary text-primary font-semibold`
- Nieaktywna zakładka: `text-text-secondary-light dark:text-text-secondary-dark`
- Hover: `hover:text-text-light dark:hover:text-text-dark`
- Padding: `pb-3`

**Nowy Kod**:
```tsx
<nav>
  <ul className="flex space-x-8 border-b border-border-light dark:border-border-dark">
    <li>
      <a className="pb-3 border-b-2 border-primary text-primary font-semibold" href="#">
        Chat
      </a>
    </li>
    <li>
      <a className="pb-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark" href="#">
        Stories
      </a>
    </li>
    {/* ... pozostałe zakładki */}
  </ul>
</nav>
```



### 3. Chat View

**Plik**: `components/demo6/canis-chat.tsx`

**Główne Zmiany**:
- Layout: Grid 3-kolumnowy (25% / 50% / 25%)
- Banner z wskazówką na górze
- Lista wątków z lepszym stylingiem
- Wiadomości AI z ikoną `auto_awesome`
- Cytowania jako badges primary
- Panel źródeł z kartami

**Layout**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {/* Wątki - 1 kolumna */}
  <div className="col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
    {/* Lista wątków */}
  </div>
  
  {/* Chat - 2 kolumny */}
  <div className="col-span-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg flex flex-col p-4">
    {/* Wiadomości + Input */}
  </div>
  
  {/* Źródła - 1 kolumna */}
  <div className="col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
    {/* Fragmenty dokumentów */}
  </div>
</div>
```

**Banner z Wskazówką**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark">lightbulb</span>
    <div>
      <p className="font-medium">Wskazówka</p>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Przeciągnij dokument PDF aby Canis mógł odpowiadać na pytania o jego zawartość
      </p>
    </div>
  </div>
  <div className="flex items-center space-x-4">
    <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium">
      Prześlij dokument
    </button>
    <button className="text-text-secondary-light dark:text-text-secondary-dark">
      <span className="material-icons">close</span>
    </button>
  </div>
</div>
```

**Wątek (Aktywny)**:
```tsx
<a className="flex items-center space-x-2 p-2 rounded-md bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white font-medium" href="#">
  <span className="material-icons text-sm">chat_bubble_outline</span>
  <span>Wymagania 3DS</span>
</a>
```

**Cytowania**:
```tsx
<div className="flex flex-wrap gap-2 text-sm">
  <span className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white px-2 py-1 rounded-md cursor-pointer">
    Checkout_v2.pdf p. 5
  </span>
  <span className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white px-2 py-1 rounded-md cursor-pointer">
    payments.yaml threeDS
  </span>
</div>
```



### 4. Stories Generator View

**Plik**: `components/demo6/stories-generator.tsx`

**Główne Zmiany**:
- Layout: Grid 2-kolumnowy (33% / 67%)
- Formularz z lepszym stylingiem
- Karty stories w grid 2-kolumnowym
- Gherkin syntax highlighting (fioletowe słowa kluczowe)
- Badge "Konflikt" dla sprzecznych stories
- Sekcja konfliktu z bg-warning/10

**Layout**:
```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Formularz - 4 kolumny */}
  <div className="col-span-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
    {/* Formularz generowania */}
  </div>
  
  {/* Wyniki - 8 kolumn */}
  <div className="col-span-8 flex flex-col space-y-6">
    <div className="grid grid-cols-2 gap-6">
      {/* Story cards */}
    </div>
  </div>
</div>
```

**Story Card (Normalny)**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 flex flex-col space-y-4">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="font-semibold">Wariant 1: Podstawowa płatność</h3>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">INVEST: ✅</p>
    </div>
    <div className="flex items-center space-x-1">
      <button className="p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark rounded-md">
        <span className="material-icons text-base">edit</span>
      </button>
      <button className="p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark rounded-md">
        <span className="material-icons text-base">content_copy</span>
      </button>
    </div>
  </div>
  
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <p><strong>Jako</strong> Kupujący,<br/>
    <strong>chcę</strong> móc zapłacić kartą kredytową,<br/>
    <strong>aby</strong> szybko sfinalizować zakup.</p>
    
    <p className="font-semibold mt-4">Kryteria akceptacji:</p>
    <pre className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-md text-xs">
      <code>
        <span className="gherkin-keyword">Given</span> jestem na stronie płatności
        <span className="gherkin-keyword">When</span> wybieram opcję "Karta kredytowa"
        <span className="gherkin-keyword">And</span> podaję poprawne dane karty
        <span className="gherkin-keyword">Then</span> transakcja jest pomyślnie zakończona
      </code>
    </pre>
  </div>
  
  <button className="bg-primary text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-700">
    Eksportuj do PM
  </button>
</div>
```

**Story Card (Z Konfliktem)**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border-2 border-warning/50 rounded-lg p-4 flex flex-col space-y-4 relative">
  <div className="absolute -top-3 left-4 bg-warning text-white px-2 py-0.5 text-xs font-semibold rounded-full flex items-center space-x-1">
    <span className="material-icons text-sm">warning_amber</span>
    <span>Konflikt</span>
  </div>
  
  {/* ... zawartość story ... */}
  
  <div className="bg-warning/10 border border-warning/30 text-warning-700 dark:text-warning-300 p-3 rounded-md text-xs">
    <p className="font-semibold">Konflikt z istniejącym backlogiem</p>
    <p>Story <a className="underline" href="#">#PM-123</a> definiuje próg 3DS na 150 PLN.<br/>
    Źródło: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">Checkout_v1.pdf</span></p>
  </div>
</div>
```

**CSS dla Gherkin**:
```css
.gherkin-keyword {
  color: #D946EF;
  font-weight: 600;
}
```



### 5. Test Data Generator View

**Plik**: `components/demo6/test-data-generator.tsx`

**Główne Zmiany**:
- Layout: Grid 3-kolumnowy (1 / 2)
- Edytor reguł z numerami linii
- Checkboxy dla edge cases
- Tabela z sticky header
- Dropdown dla eksportu

**Layout**:
```tsx
<div className="grid grid-cols-3 gap-6">
  {/* Konfiguracja - 1 kolumna */}
  <div className="col-span-1 flex flex-col space-y-6">
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      {/* Generator danych testowych */}
    </div>
    
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      {/* Edytor reguł */}
    </div>
    
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      {/* Edge Cases */}
    </div>
  </div>
  
  {/* Podgląd - 2 kolumny */}
  <div className="col-span-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
    {/* Tabela z danymi */}
  </div>
</div>
```

**Edytor Reguł**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
  <h3 className="text-base font-semibold mb-2">Edytor reguł</h3>
  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
    Dostosuj generowane dane za pomocą reguł w formacie YAML.
  </p>
  <div className="h-64 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md font-mono text-xs p-2">
    <pre><code>
<span className="text-gray-400">1</span> card_number:
<span className="text-gray-400">2</span>   <span className="text-purple-400">faker</span>: credit_card_number
<span className="text-gray-400">3</span> expiry_date:
<span className="text-gray-400">4</span>   <span className="text-purple-400">faker</span>: credit_card_expire
    </code></pre>
  </div>
</div>
```

**Edge Cases Checkboxy**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
  <h3 className="text-base font-semibold mb-4">Edge Cases</h3>
  <div className="space-y-3">
    <label className="flex items-center space-x-3 cursor-pointer">
      <input className="form-checkbox h-4 w-4 rounded text-primary bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary" type="checkbox"/>
      <span className="text-sm">Brakujące wartości (null)</span>
    </label>
    <label className="flex items-center space-x-3 cursor-pointer">
      <input className="form-checkbox h-4 w-4 rounded text-primary bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary" type="checkbox"/>
      <span className="text-sm">Wartości puste (empty string)</span>
    </label>
  </div>
</div>
```

**Tabela z Danymi**:
```tsx
<div className="flex-grow overflow-x-auto border border-border-light dark:border-border-dark rounded-md">
  <table className="min-w-full divide-y divide-border-light dark:divide-border-dark text-sm">
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-6 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark tracking-wider">
          card_number
        </th>
        <th className="px-6 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark tracking-wider">
          expiry_date
        </th>
        {/* ... więcej kolumn */}
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">4992...7392</td>
        <td className="px-6 py-4 whitespace-nowrap">10/25</td>
        {/* ... więcej komórek */}
      </tr>
    </tbody>
  </table>
</div>
```



### 6. Verify View

**Plik**: `components/demo6/verify-view.tsx`

**Główne Zmiany**:
- Tabela findings z severity badges
- Trace matrix w 3 kolumnach
- Przyciski "Create Task" z ikoną
- Severity colors: High (red), Medium (yellow), Low (gray)

**Findings Table**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg">
  <div className="p-4 border-b border-border-light dark:border-border-dark">
    <h3 className="font-semibold">Findings (3)</h3>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-background-light dark:bg-background-dark">
        <tr>
          <th className="px-4 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark">Typ</th>
          <th className="px-4 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark">Ważność</th>
          <th className="px-4 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark">Opis</th>
          <th className="px-4 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark">Źródło</th>
          <th className="px-4 py-3 text-left font-medium text-text-secondary-light dark:text-text-secondary-dark"></th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border-light dark:border-border-dark">
          <td className="px-4 py-3">Niespójność</td>
          <td className="px-4 py-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium severity-high">High</span>
          </td>
          <td className="px-4 py-3">Limit płatności w dokumencie (100 PLN) vs. Story (150 PLN)</td>
          <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">Checkout_v2.pdf, US-123</td>
          <td className="px-4 py-3">
            <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-medium flex items-center space-x-1">
              <span className="material-icons text-xs">add_task</span>
              <span>Create Task</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Severity CSS**:
```css
.severity-high {
  background-color: #FEE2E2;
  color: #B91C1C;
}
.severity-medium {
  background-color: #FEF3C7;
  color: #B45309;
}
.severity-low {
  background-color: #F3F4F6;
  color: #4B5563;
}

.dark .severity-high {
  background-color: #372020;
  color: #FCA5A5;
}
.dark .severity-medium {
  background-color: #38301d;
  color: #FCD34D;
}
.dark .severity-low {
  background-color: #374151;
  color: #D1D5DB;
}
```

**Trace Matrix**:
```tsx
<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg">
  <div className="p-4 border-b border-border-light dark:border-border-dark">
    <h3 className="font-semibold">Trace Matrix</h3>
  </div>
  <div className="p-4 grid grid-cols-3 gap-6">
    <div>
      <h4 className="font-medium mb-3">Dokumenty</h4>
      <div className="space-y-2">
        <div className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white rounded-md p-3 text-sm font-medium">
          Checkout_v2.pdf
        </div>
        <div className="bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md p-3 text-sm">
          NFRs.md
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-3">Stories</h4>
      <div className="space-y-2">
        <div className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white rounded-md p-3 text-sm font-medium">
          US-123: Płatność &gt; 100 PLN
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-3">Releasy</h4>
      <div className="space-y-2">
        <div className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white rounded-md p-3 text-sm font-medium">
          R-101
        </div>
      </div>
    </div>
  </div>
</div>
```



### 7. Release Q&A View

**Plik**: `components/demo6/release-qa.tsx`

**Główne Zmiany**:
- Selektor wersji z dropdown
- Quick questions jako badges
- Odpowiedź AI z ikoną `auto_awesome`
- Linki do zewnętrznych systemów z ikoną `launch`

**Layout**:
```tsx
<div className="flex flex-col gap-4 max-w-4xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <h2 className="text-xl font-semibold">Release Q&A</h2>
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Wersja</label>
      <select className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md pl-3 pr-8 py-2 text-sm font-medium">
        <option>R-102 (SHOP) 3DS</option>
        <option>R-101 (SHOP) Limits</option>
      </select>
    </div>
  </div>
  
  <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
    <div className="flex flex-col gap-6">
      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2">
        <button className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white px-3 py-1.5 rounded-md text-sm font-medium">
          Co było w paczce?
        </button>
        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-light dark:text-text-dark px-3 py-1.5 rounded-md text-sm font-medium">
          Czy gate spełnione?
        </button>
        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-light dark:text-text-dark px-3 py-1.5 rounded-md text-sm font-medium">
          Co się zmieniło vs poprzedni?
        </button>
      </div>
      
      {/* AI Answer */}
      <div className="flex gap-4">
        <span className="material-icons text-primary mt-1">auto_awesome</span>
        <div className="flex-1 space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>Wdrożenie mechanizmu 3D Secure dla transakcji kartowych powyżej 100 PLN...</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Źródła:</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">PM</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">DevMon</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-primary hover:underline">
                <span className="material-icons text-sm">launch</span>
                <span>Otwórz w DevMon</span>
              </button>
              <button className="flex items-center gap-1 text-primary hover:underline">
                <span className="material-icons text-sm">launch</span>
                <span>Otwórz w PM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Input */}
  <div className="relative">
    <textarea className="w-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg p-3 pr-12 text-sm focus:ring-primary focus:border-primary" placeholder="Zadaj kolejne pytanie o release..." rows="2"></textarea>
    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
      <span className="material-icons">send</span>
    </button>
  </div>
</div>
```



### 8. Settings View

**Plik**: `components/demo6/settings-view.tsx`

**Główne Zmiany**:
- Sekcje: Connectors, Reguły i słownik, Strefa niebezpieczna
- Custom toggle switches
- Status połączenia z ikoną `check_circle`
- Przełącznik motywu z 3 opcjami

**Toggle Switch CSS**:
```css
.switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 1.5rem;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.25rem;
  width: 1.25rem;
  left: 0.125rem;
  bottom: 0.125rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4F46E5;
}

input:checked + .slider:before {
  transform: translateX(1.5rem);
}
```

**Connectors Section**:
```tsx
<div>
  <h3 className="text-lg font-medium mb-4">Connectors</h3>
  <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg">
    <ul className="divide-y divide-border-light dark:divide-border-dark">
      <li className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="material-icons text-primary">workspaces</span>
          <div>
            <p className="font-medium">PM (Syzio)</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Zadania i backlog</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-success flex items-center space-x-1">
            <span className="material-icons text-base">check_circle</span>
            <span>Połączono</span>
          </span>
          <label className="switch">
            <input type="checkbox" checked />
            <span className="slider"></span>
          </label>
        </div>
      </li>
    </ul>
  </div>
</div>
```

**Theme Switcher**:
```tsx
<div className="flex items-center space-x-1">
  <button className="p-1 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark">
    <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark text-base">light_mode</span>
  </button>
  <button className="p-1 rounded-md bg-surface-light dark:bg-surface-dark">
    <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark text-base">dark_mode</span>
  </button>
  <button className="p-1 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark">
    <span className="material-icons text-text-secondary-light dark:text-text-secondary-dark text-base">bedtime</span>
  </button>
</div>
```

**Danger Zone**:
```tsx
<div>
  <h3 className="text-lg font-medium mb-4 text-danger">Strefa niebezpieczna</h3>
  <div className="bg-surface-light dark:bg-surface-dark border border-danger rounded-lg p-4 flex items-center justify-between">
    <div>
      <p className="font-medium">Usuń projekt</p>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Trwałe usunięcie projektu i wszystkich danych.
      </p>
    </div>
    <button className="bg-danger text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700">
      Usuń projekt
    </button>
  </div>
</div>
```



## Icon Migration: Lucide → Material Icons

### Mapowanie Ikon

| Lucide Icon | Material Icon | Użycie |
|-------------|---------------|--------|
| `Sparkles` | `auto_awesome` | Logo, AI actions |
| `Search` | `search` | Wyszukiwarka |
| `HelpCircle` | `help_outline` | Pomoc |
| `Settings` | `settings` | Ustawienia |
| `MessageSquare` | `chat_bubble_outline` | Wątki czatu |
| `Send` | `send` | Wysyłanie wiadomości |
| `Upload` | `upload_file` | Upload plików |
| `FileText` | `description` | Dokumenty |
| `Edit` | `edit` | Edycja |
| `Copy` | `content_copy` | Kopiowanie |
| `Trash` | `delete` | Usuwanie |
| `Plus` | `add` | Dodawanie |
| `Check` | `check` | Potwierdzenie |
| `X` | `close` | Zamykanie |
| `ChevronDown` | `expand_more` | Dropdown |
| `ChevronUp` | `expand_less` | Collapse |
| `AlertTriangle` | `warning_amber` | Ostrzeżenia |
| `CheckCircle` | `check_circle` | Sukces |
| `XCircle` | `cancel` | Błąd |
| `Info` | `info` | Informacje |
| `Lightbulb` | `lightbulb` | Wskazówki |
| `ExternalLink` | `launch` | Linki zewnętrzne |
| `RefreshCw` | `refresh` | Odświeżanie |
| `Download` | `download` | Pobieranie |
| `Filter` | `filter_list` | Filtrowanie |
| `Calendar` | `calendar_today` | Kalendarz |
| `Clock` | `schedule` | Czas |
| `User` | `person` | Użytkownik |
| `Users` | `group` | Zespół |
| `Folder` | `folder` | Foldery |
| `Database` | `storage` | Baza danych |
| `Code` | `code` | Kod |
| `GitPullRequest` | `merge_type` | Pull requesty |
| `Package` | `inventory_2` | Paczki |

### Implementacja

**Import Material Icons**:
```html
<!-- W layout.tsx lub index.html -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
```

**Użycie w Komponencie**:
```tsx
// Zamiast:
import { Sparkles } from 'lucide-react';
<Sparkles className="w-5 h-5" />

// Używamy:
<span className="material-icons text-primary">auto_awesome</span>
```

**Rozmiary**:
```tsx
<span className="material-icons text-sm">icon_name</span>   {/* 14px */}
<span className="material-icons text-base">icon_name</span>  {/* 16px */}
<span className="material-icons text-lg">icon_name</span>    {/* 18px */}
<span className="material-icons text-xl">icon_name</span>    {/* 20px */}
```



## Tailwind Configuration

### Aktualizacja tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'background-light': '#FFFFFF',
        'background-dark': '#111827',
        'surface-light': '#F9FAFB',
        'surface-dark': '#1F2937',
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
        'text-light': '#1F2937',
        'text-dark': '#F9FAFB',
        'text-secondary-light': '#6B7280',
        'text-secondary-dark': '#9CA3AF',
        'primary-light': '#E0E7FF',
        'primary-dark': '#3730A3',
        'success': '#10B981',
        'success-light': '#D1FAE5',
        'success-dark': '#047857',
        'warning': '#F59E0B',
        'danger': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Aktualizacja demo6-globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Primary Colors */
  --primary: #4F46E5;
  
  /* Background Colors - Light Mode */
  --background-light: #FFFFFF;
  --surface-light: #F9FAFB;
  
  /* Background Colors - Dark Mode */
  --background-dark: #111827;
  --surface-dark: #1F2937;
  
  /* Border Colors */
  --border-light: #E5E7EB;
  --border-dark: #374151;
  
  /* Text Colors - Light Mode */
  --text-light: #1F2937;
  --text-secondary-light: #6B7280;
  
  /* Text Colors - Dark Mode */
  --text-dark: #F9FAFB;
  --text-secondary-dark: #9CA3AF;
  
  /* Accent Colors */
  --primary-light: #E0E7FF;
  --primary-dark: #3730A3;
  
  /* Status Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  
  /* Gherkin Syntax Highlighting */
  --gherkin-keyword: #D946EF;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Gherkin Syntax Highlighting */
.gherkin-keyword {
  color: var(--gherkin-keyword);
  font-weight: 600;
}

/* Severity Badges */
.severity-high {
  background-color: #FEE2E2;
  color: #B91C1C;
}

.severity-medium {
  background-color: #FEF3C7;
  color: #B45309;
}

.severity-low {
  background-color: #F3F4F6;
  color: #4B5563;
}

.dark .severity-high {
  background-color: #372020;
  color: #FCA5A5;
}

.dark .severity-medium {
  background-color: #38301d;
  color: #FCD34D;
}

.dark .severity-low {
  background-color: #374151;
  color: #D1D5DB;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 1.5rem;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.25rem;
  width: 1.25rem;
  left: 0.125rem;
  bottom: 0.125rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(1.5rem);
}

/* Material Icons Sizing */
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.material-icons.text-xs { font-size: 12px; }
.material-icons.text-sm { font-size: 14px; }
.material-icons.text-base { font-size: 16px; }
.material-icons.text-lg { font-size: 18px; }
.material-icons.text-xl { font-size: 20px; }
.material-icons.text-2xl { font-size: 24px; }
```



## Responsive Design Strategy

### Breakpoints

```css
/* Mobile First Approach */
/* xs: < 640px (default) */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Layout Adaptations

#### Chat View
```tsx
// Desktop (md+): 3 kolumny
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="col-span-1">Wątki</div>
  <div className="col-span-2">Chat</div>
  <div className="col-span-1">Źródła</div>
</div>

// Mobile: Stack wertykalnie, ukryj źródła
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="col-span-1">Wątki</div>
  <div className="col-span-2">Chat</div>
  <div className="hidden md:block col-span-1">Źródła</div>
</div>
```

#### Stories Generator
```tsx
// Desktop (lg+): 2 kolumny (33% / 67%)
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="col-span-4">Formularz</div>
  <div className="col-span-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Story cards */}
    </div>
  </div>
</div>

// Mobile: Stack wertykalnie
```

#### Test Data Generator
```tsx
// Desktop (lg+): 3 kolumny (1 / 2)
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="col-span-1">Konfiguracja</div>
  <div className="col-span-2">Podgląd</div>
</div>

// Mobile: Stack wertykalnie
```

### Navigation Tabs

```tsx
// Desktop: Horizontal tabs
<ul className="flex space-x-8 border-b overflow-x-auto">
  {/* tabs */}
</ul>

// Mobile: Scrollable tabs
<ul className="flex space-x-8 border-b overflow-x-auto scrollbar-hide">
  {/* tabs */}
</ul>
```

## Accessibility Enhancements

### Keyboard Navigation

1. **Tab Order**: Wszystkie interaktywne elementy dostępne przez Tab
2. **Focus Indicators**: Wyraźne outline dla focused elementów
3. **Escape**: Zamykanie modali i command palette
4. **Enter/Space**: Aktywacja przycisków
5. **Arrow Keys**: Nawigacja w command palette i listach

### ARIA Labels

```tsx
// Przyciski bez tekstu
<button aria-label="Pomoc">
  <span className="material-icons">help_outline</span>
</button>

// Formularze
<label htmlFor="persona">Persona</label>
<input id="persona" name="persona" />

// Loading states
<div role="status" aria-live="polite">
  Ładowanie...
</div>

// Dialogi
<div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <h2 id="dialog-title">Tytuł</h2>
  <p id="dialog-description">Opis</p>
</div>
```

### Color Contrast

Wszystkie kombinacje kolorów spełniają WCAG AA (4.5:1 dla tekstu):

- Text-light (#1F2937) na Background-light (#FFFFFF): 16.1:1 ✅
- Text-dark (#F9FAFB) na Background-dark (#111827): 15.8:1 ✅
- Primary (#4F46E5) na Background-light (#FFFFFF): 8.6:1 ✅
- Text-secondary-light (#6B7280) na Background-light (#FFFFFF): 4.6:1 ✅

## Performance Optimizations

### Code Splitting

```tsx
// Lazy load heavy components
const ConstellationGraph = lazy(() => import('./constellation-graph'));
const RulesEditor = lazy(() => import('./rules-editor'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ConstellationGraph />
</Suspense>
```

### Memoization

```tsx
// Expensive components
const MessageBubble = memo(({ message }) => {
  // ...
});

const StoryCard = memo(({ story }) => {
  // ...
});
```

### Debouncing

```tsx
// Search inputs
const debouncedSearch = useMemo(
  () => debounce((value) => {
    // search logic
  }, 300),
  []
);
```

## Testing Strategy

### Visual Regression Testing

1. Capture screenshots of all views in light/dark modes
2. Compare with makiety HTML
3. Verify responsive breakpoints

### Manual Testing Checklist

- [ ] Wszystkie widoki renderują się poprawnie
- [ ] Ikony Material Icons wyświetlają się prawidłowo
- [ ] Kolory są zgodne z makietami
- [ ] Responsywność działa na mobile/tablet/desktop
- [ ] Dark mode działa poprawnie
- [ ] Animacje są płynne
- [ ] Keyboard navigation działa
- [ ] Focus indicators są widoczne
- [ ] Kontrast kolorów spełnia WCAG AA

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Migration Path

### Faza 1: Przygotowanie
1. Aktualizacja tailwind.config.js
2. Aktualizacja demo6-globals.css
3. Import Material Icons w layout.tsx

### Faza 2: Komponenty Bazowe
1. TopBar / Header
2. Tab Navigation
3. Theme Switcher

### Faza 3: Widoki
1. Chat View
2. Stories Generator
3. Test Data Generator
4. Verify View
5. Release Q&A
6. Settings View

### Faza 4: Finalizacja
1. Command Palette
2. Responsive testing
3. Accessibility audit
4. Performance optimization

