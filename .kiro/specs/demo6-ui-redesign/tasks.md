# Implementation Plan - Demo 6 Canis UI Redesign

Ten plan implementacji zawiera szczegółowe zadania do przeprowadzenia redesignu UI Demo 6 Canis zgodnie z nowymi makietami HTML. Każde zadanie jest konkretne, wykonalne i buduje na poprzednich krokach.

## Struktura Zadań

Zadania są podzielone na logiczne grupy odpowiadające głównym obszarom redesignu. Każde zadanie zawiera:
- Jasny cel
- Pliki do modyfikacji
- Szczegółowe kroki implementacji
- Referencje do wymagań

## Task List

- [x] 1. Przygotowanie środowiska i konfiguracji





  - [ ] 1.1 Aktualizacja tailwind.config.js







    - Otwórz `tailwind.config.js`
    - Zaktualizuj sekcję `extend.colors` o nowe zmienne kolorów
    - Dodaj `darkMode: 'class'`
    - Zaktualizuj `fontFamily.sans` na `['Inter', 'sans-serif']`
    - Ustaw `borderRadius.DEFAULT` na `'0.5rem'`
    - _Requirements: 1.1-1.7, 16.1-16.5_
  -

  - [x] 1.2 Aktualizacja demo6-globals.css






    - Otwórz `app/demo6-globals.css`
    - Dodaj import czcionki Inter z Google Fonts
    - Zaktualizuj CSS variables dla kolorów
    - Dodaj style dla `.gherkin-keyword`
    - Dodaj style dla `.severity-high`, `.severity-medium`, `.severity-low`
    - Dodaj style dla `.switch` i `.slider` (toggle switches)
    - Dodaj style dla Material Icons sizing
    - _Requirements: 1.1-1.7, 2.1-2.5, 11.1-11.7_
  
  - [x] 1.3 Dodanie Material Icons do layout


    - Otwórz `app/(demo6_root)/layout.tsx`
    - Dodaj link do Material Icons w sekcji `<head>`
    - Zaktualizuj import czcionki na Inter (usuń Geist)
    - _Requirements: 2.1-2.5, 15.1-15.5_

- [x] 2. Aktualizacja TopBar i Header
  - [x] 2.1 Przeprojektowanie TopBar

    - Otwórz `components/demo6/canis-main-view.tsx`
    - Znajdź sekcję header/topbar
    - Zamień logo na Material Icon `auto_awesome` + tekst "Syzio — Canis"
    - Zaktualizuj selektor projektu na badge format: "ACME / SHOP"
    - Zamień ikony pomocy i ustawień na Material Icons
    - Zaktualizuj style zgodnie z makietą (padding, border, kolory)
    - _Requirements: 3.1-3.6_
  
  - [x] 2.2 Dodanie przycisku wyszukiwania (opcjonalnie)


    - W TopBar dodaj przycisk z ikoną `search` i tekstem "Search"
    - Dodaj badge "⌘K" obok tekstu
    - Podłącz do command palette
    - _Requirements: 3.6_


  - [x] 2.3 Aktualizacja nawigacji zakładek


    - W `components/demo6/canis-main-view.tsx` znajdź sekcję nawigacji
    - Zaktualizuj style zakładek:
      - Aktywna: `border-b-2 border-primary text-primary font-semibold`
      - Nieaktywna: `text-text-secondary-light dark:text-text-secondary-dark`
      - Hover: `hover:text-text-light dark:hover:text-text-dark`
    - Dodaj `pb-3` do wszystkich zakładek
    - Dodaj `border-b` do kontenera `<ul>`
    - _Requirements: 4.1-4.6_

- [-] 3. Redesign widoku Chat

  - [x] 3.1 Aktualizacja layoutu Chat


    - Otwórz `components/demo6/canis-chat.tsx`
    - Zmień layout na grid 3-kolumnowy: `grid-cols-1 md:grid-cols-4`
    - Kolumna 1 (Wątki): `col-span-1`
    - Kolumna 2 (Chat): `col-span-2`
    - Kolumna 3 (Źródła): `col-span-1`
    - Zaktualizuj style kart (bg, border, rounded-lg, padding)
    - _Requirements: 5.1_
  

  - [x] 3.2 Dodanie bannera z wskazówką

    - Na górze widoku Chat dodaj banner
    - Ikona `lightbulb` + tekst wskazówki
    - Przycisk "Prześlij dokument" + przycisk zamknięcia (ikona `close`)
    - Style: bg-surface, border, rounded-lg, flex layout
    - _Requirements: 5.7_
  

  - [x] 3.3 Aktualizacja listy wątków

    - Zaktualizuj style wątków:
      - Aktywny: `bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-white`
      - Nieaktywny: `hover:bg-gray-100 dark:hover:bg-gray-800`
    - Zamień ikony na Material Icon `chat_bubble_outline`
    - Dodaj `rounded-md` i `p-2`
    - _Requirements: 5.2_
  

  - [x] 3.4 Aktualizacja wiadomości AI

    - Dodaj ikonę `auto_awesome` w kolorze primary przed wiadomością AI
    - Zaktualizuj style wiadomości (prose, spacing)
    - _Requirements: 5.4_
  

  - [x] 3.5 Aktualizacja cytowań

    - Zmień cytowania na badges:
      - `bg-primary-light dark:bg-primary-dark`
      - `text-primary-dark dark:text-white`
      - `px-2 py-1 rounded-md cursor-pointer`
    - Wyświetl jako flex wrap z gap-2
    - _Requirements: 5.5_
  

  - [ ] 3.6 Aktualizacja panelu źródeł


    - Zaktualizuj karty źródeł:
      - Border, rounded-lg, padding
      - Font-medium dla nazwy dokumentu
      - Text-secondary dla fragmentu
    - _Requirements: 5.6_
  
  - [-] 3.7 Aktualizacja inputu czatu

    - Zaktualizuj textarea (border, rounded-lg, focus:ring-primary)
    - Zamień ikony przycisków na Material Icons: `send`, `tune`, `upload_file`
    - Pozycjonowanie absolute dla przycisków
    - _Requirements: 5.1-5.7_

- [ ] 4. Redesign widoku Stories Generator
  - [ ] 4.1 Aktualizacja layoutu Stories
    - Otwórz `components/demo6/stories-generator.tsx`
    - Zmień layout na grid 12-kolumnowy
    - Formularz: `col-span-4`
    - Wyniki: `col-span-8` z grid 2-kolumnowym wewnątrz
    - _Requirements: 6.1_
  
  - [ ] 4.2 Aktualizacja formularza
    - Zaktualizuj style pól (border, rounded-md, focus:ring-primary)
    - Zaktualizuj przyciski źródeł (bg-primary dla aktywnego)
    - Zaktualizuj checkboxy NFR
    - Przycisk "Generuj Story" z ikoną `auto_awesome`
    - _Requirements: 6.2_
  
  - [ ] 4.3 Aktualizacja kart stories (normalnych)
    - Zaktualizuj layout karty (flex flex-col space-y-4)
    - Header z tytułem i przyciskami (ikony `edit`, `content_copy`)
    - User story z bold dla "Jako", "chcę", "aby"
    - Kryteria akceptacji w `<pre><code>` z bg-gray-100
    - Przycisk "Eksportuj do PM" (bg-primary)
    - _Requirements: 6.4_
  
  - [ ] 4.4 Dodanie Gherkin syntax highlighting
    - Owinąć słowa kluczowe (Given/When/Then/And) w `<span class="gherkin-keyword">`
    - CSS już dodany w globals.css (kolor #D946EF)
    - _Requirements: 6.6_
  
  - [ ] 4.5 Aktualizacja kart stories (z konfliktem)
    - Dodaj `border-2 border-warning/50` do karty
    - Dodaj badge "Konflikt" na górze (absolute positioning)
      - `bg-warning text-white`
      - Ikona `warning_amber`
    - Dodaj sekcję konfliktu na dole:
      - `bg-warning/10 border border-warning/30`
      - Link do story z underline
      - Źródło w `font-mono bg-gray-200`
    - _Requirements: 6.7, 6.8_

- [ ] 5. Redesign widoku Test Data Generator
  - [ ] 5.1 Aktualizacja layoutu Test Data
    - Otwórz `components/demo6/test-data-generator.tsx`
    - Zmień layout na grid 3-kolumnowy
    - Konfiguracja: `col-span-1` (flex flex-col space-y-6)
    - Podgląd: `col-span-2`
    - _Requirements: 7.1_
  
  - [ ] 5.2 Aktualizacja sekcji konfiguracji
    - Zaktualizuj style selecta i inputa
    - Dodaj sekcję "Generator danych testowych" w karcie
    - _Requirements: 7.2_
  
  - [ ] 5.3 Aktualizacja edytora reguł
    - Dodaj kartę "Edytor reguł"
    - Textarea/div z YAML kodem
    - Dodaj numery linii (span z text-gray-400)
    - Syntax highlighting dla kluczy (text-purple-400)
    - Font-mono, text-xs
    - _Requirements: 7.3_
  
  - [ ] 5.4 Aktualizacja sekcji Edge Cases
    - Dodaj kartę "Edge Cases"
    - Checkboxy z labelami
    - Style: form-checkbox, rounded, text-primary
    - _Requirements: 7.4_
  
  - [ ] 5.5 Aktualizacja tabeli podglądu
    - Zaktualizuj header tabeli (bg-gray-50 dark:bg-gray-800)
    - Zaktualizuj style komórek (px-6 py-4)
    - Dodaj border i rounded-md do kontenera
    - Overflow-x-auto dla scrollowania
    - _Requirements: 7.5_
  
  - [ ] 5.6 Aktualizacja przycisków eksportu
    - Przycisk "Generuj" z ikoną `refresh`
    - Dropdown "Eksportuj" z ikoną `expand_more`
    - _Requirements: 7.6, 7.7_

- [ ] 6. Redesign widoku Verify
  - [ ] 6.1 Aktualizacja tabeli findings
    - Otwórz `components/demo6/verify-view.tsx`
    - Zaktualizuj header tabeli (bg-background-light dark:bg-background-dark)
    - Zaktualizuj style komórek
    - _Requirements: 8.1, 8.2_
  
  - [ ] 6.2 Dodanie severity badges
    - Dodaj CSS classes dla severity (już w globals.css)
    - Zastosuj klasy: `severity-high`, `severity-medium`, `severity-low`
    - Rounded-full, px-2 py-1, text-xs font-medium
    - _Requirements: 8.3_
  
  - [ ] 6.3 Aktualizacja przycisków "Create Task"
    - Zamień na Material Icon `add_task`
    - Style: bg-white dark:bg-gray-700, border, rounded-md
    - _Requirements: 8.6_
  
  - [ ] 6.4 Aktualizacja Trace Matrix
    - Grid 3-kolumnowy (Dokumenty, Stories, Releasy)
    - Aktywne elementy: `bg-primary-light dark:bg-primary-dark`
    - Nieaktywne: `bg-background-light dark:bg-surface-dark border`
    - Rounded-md, padding
    - _Requirements: 8.4, 8.5_

- [ ] 7. Redesign widoku Release Q&A
  - [ ] 7.1 Aktualizacja layoutu Release Q&A
    - Otwórz `components/demo6/release-qa.tsx`
    - Max-width container (max-w-4xl mx-auto)
    - Flex layout dla header z selektorem
    - _Requirements: 9.1_
  
  - [ ] 7.2 Aktualizacja selektora wersji
    - Select z ikoną `unfold_more` (absolute positioning)
    - Style: bg-surface, border, rounded-md
    - _Requirements: 9.2_
  
  - [ ] 7.3 Aktualizacja quick questions
    - Badges jako przyciski
    - Aktywny: `bg-primary-light dark:bg-primary-dark`
    - Nieaktywny: `bg-gray-200 dark:bg-gray-700`
    - Hover: `hover:bg-gray-300 dark:hover:bg-gray-600`
    - _Requirements: 9.3_
  
  - [ ] 7.4 Aktualizacja odpowiedzi AI
    - Ikona `auto_awesome` w kolorze primary
    - Prose dla tekstu odpowiedzi
    - Badges dla źródeł (PM, DevMon)
    - _Requirements: 9.4, 9.5_
  
  - [ ] 7.5 Aktualizacja linków zewnętrznych
    - Ikona `launch` przed tekstem linku
    - Kolor primary, hover:underline
    - _Requirements: 9.6_
  
  - [ ] 7.6 Aktualizacja inputu pytania
    - Textarea z przyciskiem send (absolute positioning)
    - Ikona `send`
    - _Requirements: 9.1-9.6_

- [ ] 8. Redesign widoku Settings
  - [ ] 8.1 Aktualizacja layoutu Settings
    - Otwórz `components/demo6/settings-view.tsx`
    - Max-width container (max-w-4xl mx-auto)
    - Space-y-8 dla sekcji
    - _Requirements: 10.1_
  
  - [ ] 8.2 Aktualizacja sekcji Connectors
    - Lista z divide-y
    - Każdy item: flex justify-between
    - Ikony Material: `workspaces`, `monitor_heart`, `folder`
    - Status z ikoną `check_circle` (kolor success)
    - _Requirements: 10.2, 10.3_
  
  - [ ] 8.3 Dodanie toggle switches
    - Dodaj HTML dla switch (input + slider)
    - CSS już dodany w globals.css
    - Checked state z bg-primary
    - _Requirements: 10.4_
  
  - [ ] 8.4 Aktualizacja sekcji Reguły i słownik
    - Karty z border
    - Bloki kodu z bg-background-dark
    - Font-mono, text-sm
    - _Requirements: 10.5_
  
  - [ ] 8.5 Aktualizacja Theme Switcher
    - 3 przyciski z ikonami: `light_mode`, `dark_mode`, `bedtime`
    - Aktywny: `bg-surface-light dark:bg-surface-dark`
    - Hover: `hover:bg-surface-light dark:hover:bg-surface-dark`
    - _Requirements: 10.7_
  
  - [ ] 8.6 Aktualizacja Danger Zone
    - Border w kolorze danger (czerwony)
    - Przycisk "Usuń projekt" (bg-danger)
    - _Requirements: 10.6_

- [ ] 9. Migracja ikon z Lucide na Material Icons
  - [ ] 9.1 Aktualizacja ikon w CanisMainView
    - Zamień wszystkie ikony Lucide na Material Icons
    - Użyj mapowania z design.md
    - Zaktualizuj rozmiary (text-sm, text-base, text-lg)
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.2 Aktualizacja ikon w CanisChat
    - Zamień ikony w wątkach, wiadomościach, inputach
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.3 Aktualizacja ikon w StoriesGenerator
    - Zamień ikony w przyciskach, formularzu
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.4 Aktualizacja ikon w TestDataGenerator
    - Zamień ikony w przyciskach
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.5 Aktualizacja ikon w VerifyView
    - Zamień ikony w przyciskach
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.6 Aktualizacja ikon w ReleaseQA
    - Zamień ikony w przyciskach, linkach
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.7 Aktualizacja ikon w SettingsView
    - Zamień ikony w connectors, theme switcher
    - _Requirements: 15.1-15.5_
  
  - [ ] 9.8 Aktualizacja ikon w CommandPalette
    - Zamień ikony w komendach
    - _Requirements: 15.1-15.5_

- [ ] 10. Responsywność i testy
  - [ ] 10.1 Test mobile layout (< 768px)
    - Sprawdź wszystkie widoki na mobile
    - Upewnij się, że kolumny układają się wertykalnie
    - Sprawdź scrollowanie zakładek
    - _Requirements: 12.1, 12.4, 12.5_
  
  - [ ] 10.2 Test tablet layout (768px - 1024px)
    - Sprawdź 2-kolumnowe layouty
    - Sprawdź spacing i padding
    - _Requirements: 12.2_
  
  - [ ] 10.3 Test desktop layout (> 1024px)
    - Sprawdź 3-kolumnowe layouty
    - Sprawdź max-width containers
    - _Requirements: 12.3_

- [ ] 11. Dostępność i finalizacja
  - [ ] 11.1 Dodanie ARIA labels
    - Dodaj aria-label do przycisków bez tekstu
    - Dodaj role="status" do loading states
    - _Requirements: 14.1, 14.2_
  
  - [ ] 11.2 Test keyboard navigation
    - Sprawdź Tab order
    - Sprawdź focus indicators
    - Sprawdź Escape dla modali
    - _Requirements: 14.3, 14.4_
  
  - [ ] 11.3 Test kontrastu kolorów
    - Użyj narzędzi DevTools do sprawdzenia kontrastu
    - Upewnij się, że wszystkie kombinacje spełniają WCAG AA (4.5:1)
    - _Requirements: 14.5_
  
  - [ ] 11.4 Test dark mode
    - Sprawdź wszystkie widoki w dark mode
    - Upewnij się, że kolory są poprawne
    - Sprawdź czytelność tekstu
    - _Requirements: 1.1-1.7_
  
  - [ ] 11.5 Finalne testy
    - Sprawdź wszystkie widoki w różnych przeglądarkach
    - Sprawdź animacje i transitions
    - Sprawdź loading states
    - Sprawdź error states
    - _Requirements: 13.1-13.5_

## Notatki Implementacyjne

### Kolejność Wykonywania

1. **Faza 1 (Zadania 1-2)**: Przygotowanie - konfiguracja, CSS, header
2. **Faza 2 (Zadania 3-8)**: Widoki - redesign wszystkich głównych widoków
3. **Faza 3 (Zadanie 9)**: Ikony - migracja na Material Icons
4. **Faza 4 (Zadania 10-11)**: Testy - responsywność, dostępność, finalizacja

### Wskazówki

- **Incremental Approach**: Implementuj po jednym widoku na raz
- **Test After Each View**: Sprawdzaj każdy widok po zakończeniu przed przejściem do następnego
- **Dark Mode**: Zawsze testuj w obu trybach (light/dark)
- **Material Icons**: Używaj dokładnie tych samych nazw ikon co w makietach
- **Spacing**: Trzymaj się systemu spacingu z Tailwind (space-x-2, space-x-4, etc.)
- **Colors**: Używaj zmiennych CSS zamiast hardcoded kolorów

### Referencje

- **Makiety HTML**: Dostarczone w prompt (Chat, Stories, Test Data, Verify, Release Q&A, Settings)
- **Design Document**: `.kiro/specs/demo6-ui-redesign/design.md`
- **Requirements**: `.kiro/specs/demo6-ui-redesign/requirements.md`
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Material Icons**: https://fonts.google.com/icons

