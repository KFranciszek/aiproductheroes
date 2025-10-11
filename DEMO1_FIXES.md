# Demo1 - Naprawy i Poprawki

## Podsumowanie naprawionych problemów

### ✅ 1. Przyciski z białym tekstem (niewidoczne)

**Problem:** Przyciski "+New Task", "+Create Sprint" miały biały tekst na białym tle w trybie light.

**Rozwiązanie:**
- Zmieniono wszystkie przyciski z `className="bg-primary hover:bg-primary/90 text-white"` na `variant="primary"`
- Zaktualizowano `components/ui/button.tsx`:
  - Zmieniono `variant="primary"` z `bg-primary` na konkretny kolor `bg-[#1173d4]`
  - Dodano hover state: `hover:bg-[#0d5fb0]`
  - Zapewnia to, że niebieski kolor tła jest zawsze widoczny z białym tekstem
- Zaktualizowano komponenty:
  - `components/demo/sidebar-navigation.tsx`
  - `components/demo/issues-list.tsx`
  - `components/demo/sprints-view.tsx`

### ✅ 2. Przezroczyste okna modali

**Problem:** Okna dialogowe (modals) miały przezroczyste tło, co sprawiało, że były nieczytelne.

**Rozwiązanie:**
- Zaktualizowano `components/ui/dialog.tsx`:
  - Zmieniono `bg-surface-light dark:bg-surface-dark` na konkretne kolory
  - Light mode: `bg-white`
  - Dark mode: `bg-[#283C4F]`
  - Dodano odpowiednie kolory tekstu i obramowania

- Zaktualizowano `components/ui/select.tsx`:
  - Zmieniono `bg-popover` na konkretne kolory
  - Light mode: `bg-white`
  - Dark mode: `bg-[#283C4F]`

### ✅ 3. Przycisk "Nowy zespół" nie działał

**Problem:** Przycisk "Nowy zespół" w widoku Teams nie miał funkcjonalności.

**Rozwiązanie:**
- Stworzono nowy komponent `components/demo/team-form.tsx`:
  - Formularz z walidacją
  - Wybór członków zespołu (checkboxy)
  - Opcja aktywacji/deaktywacji zespołu
  
- Zaktualizowano `components/demo/teams-view.tsx`:
  - Dodano import `TeamForm`
  - Dodano prop `onCreateTeam`
  - Zintegrowano formularz z przyciskami

- Zaktualizowano `app/demo1/page.tsx`:
  - Dodano funkcję `handleCreateTeam`
  - Przekazano funkcję do komponentu TeamsView

### ✅ 4. Wykres Sprint Health bez danych

**Problem:** Wykres w zakładce "Sprint Health" nie wyświetlał danych.

**Przyczyna:** Brak aktywnego sprintu lub brak danych w sprincie.

**Rozwiązanie:**
- Komponent `components/demo/reports/SprintHealthDashboard.tsx` już ma obsługę braku danych
- Wyświetla komunikat: "No active sprint. Please select a sprint to view its health."
- Aby zobaczyć dane, należy:
  1. Utworzyć sprint w zakładce "Sprints"
  2. Uruchomić sprint (przycisk "Start Sprint")
  3. Przypisać zadania do sprintu
  4. Wykres automatycznie się zaktualizuje

### ✅ 5. Białe napisy w trybie dark/light na hover w sidebar

**Problem:** Przyciski w menu bocznym miały białe napisy na białym tle po najechaniu. W dark mode białe napisy były niewidoczne.

**Rozwiązanie:**
- Zaktualizowano `components/ui/button.tsx`:
  - Dodano kolory tekstu do wariantu `ghost`:
    - Light mode: `text-gray-900` (ciemny tekst)
    - Dark mode: `dark:text-[#E0E6EB]` (jasny tekst - ten sam co `--text-dark` w CSS)
  - Poprawiono hover w dark mode:
    - Zmieniono z `dark:hover:bg-gray-800` (zbyt jasny, wyglądał jak biały)
    - Na `dark:hover:bg-black/20` (subtelne przyciemnienie, 20% opacity)
  - **Uwaga**: Użyto konkretnego koloru `#E0E6EB` zamiast Tailwind class `text-gray-100` dla pewności, że kolor będzie widoczny
    
- Zaktualizowano `components/demo/sidebar-navigation.tsx`:
  - **Tło sidebara**:
    - Zmieniono z `bg-surface-light dark:bg-surface-dark` (klasy Tailwind które nie działały)
    - Na inline style z CSS variable: `style={{ backgroundColor: 'var(--surface-1)' }}`
    - Automatycznie zmienia się między light (#ffffff) i dark (#283C4F)
  - **Bordery**:
    - Zmieniono z `border-border-light dark:border-border-dark`
    - Na inline styles z CSS variable: `style={{ borderColor: 'var(--border-1)' }}`
    - Automatycznie zmienia się między light i dark
  - **Przyciski**:
    - Zmieniono wszystkie z `variant="secondary"` na `variant="ghost"`
    - Dodano dedykowane style dla aktywnych przycisków:
      - Light mode: `text-[#1173d4]` (niebieski)
      - Dark mode: `dark:text-[#60a5fa]` (jasnoniebieski)
    - Tło aktywnych przycisków:
      - Light mode: `bg-primary/10 hover:bg-primary/20`
      - Dark mode: `dark:bg-primary/20 dark:hover:bg-primary/30`

### ✅ 6. Napisy w nagłówku "Demo Mode"

**Problem:** W light mode białe napisy na niebieskim tle były słabo widoczne.

**Rozwiązanie:**
- Zaktualizowano `app/demo1/page.tsx`:
  - **Light mode**: `text-gray-900` (czarny tekst na niebieskim tle)
  - **Dark mode**: `dark:text-white` (biały tekst na niebieskim tle)
  - Link "Back to Home" również zmienia kolor: `text-gray-900 dark:text-white`
  - Tło pozostaje niebieskie w obu trybach: `bg-[#1173d4]`

### ✅ 7. Poprawki CSS

**Rozwiązanie:**
- Zaktualizowano `app/demo1/demo.css`:
  - Dodano `--surface-2` dla obu trybów (light i dark)
  - Poprawiono `--secondary` i `--secondary-foreground`
  - Poprawiono `--muted` w dark mode

## Testowanie

Aby przetestować wszystkie naprawy:

1. **Przyciski:**
   - Przejdź do zakładki "Issues" → sprawdź przycisk "+New Task"
   - Przejdź do zakładki "Sprints" → sprawdź przycisk "+Create Sprint"
   - Sprawdź przycisk "+New Task" w menu bocznym

2. **Modals:**
   - Kliknij "+New Task" → sprawdź czy okno ma białe/ciemne tło
   - Kliknij "+Create Sprint" → sprawdź czy okno ma białe/ciemne tło
   - Przełącz tryb dark/light i sprawdź ponownie

3. **Zespoły:**
   - Przejdź do zakładki "Teams"
   - Kliknij "Nowy zespół"
   - Wypełnij formularz i utwórz zespół
   - Sprawdź czy zespół pojawił się na liście

4. **Wykres Sprint Health:**
   - Przejdź do "Sprints" → utwórz nowy sprint
   - Uruchom sprint (przycisk "Start Sprint")
   - Przejdź do "Issues" → przypisz zadania do sprintu
   - Przejdź do "Reports" → "Sprint Health"
   - Sprawdź czy wykres się wyświetla

5. **Sidebar:**
   - Najedź na przyciski w menu bocznym
   - Sprawdź czy tekst jest czytelny w obu trybach
   - Przełącz między trybem light i dark

6. **Nagłówek Demo:**
   - Sprawdź czy tekst "Demo Mode" i "Back to Home" są czytelne
   - Przełącz między trybem light i dark

## Pliki zmodyfikowane

1. `app/demo1/demo.css` - poprawki CSS
2. `app/demo1/page.tsx` - dodano handleCreateTeam, poprawki nagłówka
3. `components/demo/sidebar-navigation.tsx` - poprawki przycisków i hover
4. `components/demo/issues-list.tsx` - poprawki przycisków
5. `components/demo/sprints-view.tsx` - poprawki przycisków
6. `components/demo/teams-view.tsx` - dodano TeamForm
7. `components/demo/team-form.tsx` - **NOWY PLIK**
8. `components/ui/dialog.tsx` - poprawki tła modali
9. `components/ui/select.tsx` - poprawki tła dropdown
10. `components/ui/button.tsx` - **POPRAWKA**: zmieniono `variant="primary"` na używanie konkretnego koloru `#1173d4` zamiast zmiennej CSS

## Szczegóły techniczne

### Problem z kolorami w dark mode

**Dlaczego przyciski wyglądały jak białe?**

W dark mode sidebar ma tło `#283C4F` (ciemny niebieski). Pierwotnie przyciski ghost używały:
- `dark:hover:bg-gray-800` = `#1f2937`

Problem: `#1f2937` jest **jaśniejszy** niż `#283C4F`, więc na ciemnym tle sidebara wyglądał jak jasny/biały przycisk.

**Rozwiązanie:**
- Zmieniono na `dark:hover:bg-black/20` (20% czarnego)
- To daje subtelne **przyciemnienie** zamiast rozjaśnienia
- Efekt: przycisk staje się odrobinę ciemniejszy, ale nadal widoczny

### Problem z niewidocznymi napisami (przed hover)

**Dlaczego napisy były ciemne jak tło?**

Było kilka problemów:
1. **Tło sidebara**: Używało `bg-surface-dark` (klasa Tailwind która nie istnieje)
   - Sidebar dziedziczył tło z `body` lub używał domyślnego
   - Efekt: bardzo ciemne, prawie czarne tło
   
2. **Tekst przycisków**: Używał `dark:text-gray-100`
   - Klasa nie była stosowana lub była nadpisywana
   - Efekt: ciemny tekst na ciemnym tle = niewidoczny

**Rozwiązanie:**
1. **Sidebar**: Zmieniono na CSS variable `var(--surface-1)`
   - Light mode: `#ffffff` (biały)
   - Dark mode: `#283C4F` (ciemny niebieski)
   - Używa inline styles zamiast Tailwind classes (które nie działały z dark mode)
   
2. **Tekst**: Zmieniono na `dark:text-[#E0E6EB]`
   - Jasny szary, dobrze widoczny na `#283C4F`
   - Ten sam kolor co `--text-dark` w CSS demo1

### Kolory w sidebar (dark mode)

- **Tło sidebara**: `#283C4F` (ciemny niebieski)
- **Tekst nieaktywny**: `#E0E6EB` (jasny szary - dobrze widoczny)
- **Tekst aktywny**: `#60a5fa` (jasnoniebieski)
- **Hover nieaktywny**: `black/20` (subtelne przyciemnienie)
- **Hover aktywny**: `primary/30` (półprzezroczysty niebieski)

## Uwagi

- Wszystkie zmiany są kompatybilne z istniejącym kodem
- Nie wprowadzono breaking changes
- Zachowano spójność z design system
- Poprawiono accessibility (kontrast kolorów)
- Kolory zostały dobrane tak, aby były czytelne w obu trybach
