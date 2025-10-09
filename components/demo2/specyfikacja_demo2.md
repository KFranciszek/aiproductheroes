# Syzio /demo — Koncept Design (v1.0)

Ultra-szczegółowy koncept design aplikacji demonstracyjnej **Syzio** jako SPA.

---

## 0) Założenia, cele i zasady projektowe

**Cele:**

* Zapewnić szybkie zrozumienie stanu projektu „na pierwszy rzut oka”.
* Zminimalizować przełączanie kontekstu dzięki bocznym panelom i palecie komend.
* Stworzyć spójny, skalowalny system komponentów (Design System) z pełną dostępnością (WCAG 2.2 AA+).
* Ułatwić demonstrację: tryb „Demo Mode” pozwala bezpiecznie eksperymentować i resetować dane.

**Zasady:**

* „Information first” (priorytetyzacja treści, hierarchia wizualna).
* „Non-blocking UI” (operacje asynchroniczne nie blokują nawigacji; optymistyczne aktualizacje).
* „One screen, zero reloads” (SPA, szybkie przejścia, panel szczegółów po prawej).
* „Consistent yet flexible” (konsekwentne wzorce, ale konfigurowalne widoki: tabela/karty/kanban).

---

## 1) Architektura informacji i routing (SPA)

**Główna nawigacja (sidebar):**

* Dashboard
* Issues
* Sprints
* Teams
* Reports
* Activity
* Automations (AI)
* Settings

**Trasy i wzorce URL:**

* `/demo` → **PersonalDashboard**
* `/demo/issues?view=table|cards&filter=…` → **IssuesList**
* `/demo/issues/:id` → otwiera **IssueDetailView** jako panel (query: `?panel=details`)
* `/demo/sprint/current` → **CurrentSprintView**
* `/demo/sprints` oraz `/demo/sprints/:id`
* `/demo/teams` oraz `/demo/teams/:id`
* `/demo/reports` (z sub-trasami: `/velocity`, `/burndown`, itp.)
* `/demo/activity` → **ActivityView**
* `/demo/automations` → **AIAutomationView** (z sub-views: rules, templates, logs)
* `/demo/settings` → **SettingsView**

**Nawigacja kontekstowa:**

* Kliknięcie zadania w dowolnym widoku otwiera **IssueDetailView** jako **prawy drawer** (bez zmiany głównego kontekstu).
* Powrót z panelu szczegółów: ESC / ikoną „<”.

---

## 2) Layout i kompozycja

**AppShell:**

* **Top „Demo Mode” banner** (wysokość 32–40px): komunikat + link „Back to Home”. Zawsze nad wszystkimi elementami; responsywnie zwijany do ikony z tooltipem.
* **Sidebar (collapsible)**: szerokość 280px (expanded) / 72px (collapsed). Stan w `localStorage`.
* **Main Content**: kontener 1280–1440px max, 24px gutter; sticky page header z tytułem widoku + akcje.
* **Right Drawer (IssueDetailView)**: 560–720px, overlay z focus trap, ARIA `dialog`.

**Siatka i spacing:**

* Grid 12-kolumnowy; breakpointy: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.
* Skala odstępów: 4/8/12/16/20/24/28/32/40/48/56/64.
* Promienie: sm 8, md 12, lg 16, xl 24; karty domyślnie md.

**Ruch i mikrointerakcje:**

* Framer Motion; wejścia/wyjścia: 150–200ms, „ease-out”.
* Drag&drop: sprężyste 120–160ms, subtelne podbicie cienia podczas przeciągania.

---

## 3) Design System (tokens, tematy, typografia)

**Kolory (CSS variables):**

* `--bg`: #0B0C10 (dark) / #FFFFFF (light)
* `--fg`: #E5E7EB (dark) / #0F172A (light)
* `--muted`: #9CA3AF
* `--primary`: #3B82F6 (brand blue)
* `--accent`: #8B5CF6 (accent purple)
* `--success`: #10B981
* `--warning`: #F59E0B
* `--danger`: #EF4444
* `--info`: #06B6D4
* `--card`: rgba(255,255,255,0.04) (dark) / #FFFFFF (light)
* `--border`: rgba(255,255,255,0.08) (dark) / #E5E7EB (light)
* **Priorytety**: P0=`--danger`, P1=`--warning`, P2=`--primary`, P3=`--muted`
* **Statusy (kanban)**: To Do=`--muted`, In Progress=`--primary`, In Review=`--info`, Blocked=`--danger`, Done=`--success`

**Typografia:**

* Headings: **Inter** (600/700), body: Inter (400/500), mono: **JetBrains Mono** dla ID, SP.
* Skala: 12/14/16/18/20/24/28/32; wiersz 1.4–1.6.

**Ikonografia:**

* **lucide-react**; rozmiary: 16, 18, 20, 24.

**Komponenty bazowe (shadcn/ui):**

* Button, Badge, Card, Tabs, Dialog, Drawer, DropdownMenu, Command, Tooltip, Progress, Skeleton, Input, Textarea, Select, Avatar, Switch, Toast, Separator, HoverCard.

**Tryby:**

* Light/Dark; przełącznik w sidebarze; pamięć w `localStorage` + `prefers-color-scheme` fallback.

---

## 4) Wspólne elementy UI/UX

### 4.1 SidebarNavigation

* Logo + „Syzio”;
* Grupa linków z badge’ami (Issues, Favorites) i aktywnym stanem (left accent bar + tło);
* Dół paska: **New Task** (primary), theme switch, Settings, Help (keyboard shortcuts).
* **Props**: `collapsed:boolean`; `items:Array<{icon,name,to,badge?}>`.

### 4.2 CommandPalette (Ctrl+K)

* Modal z `Command` + fuzzy search; grupy: **Suggestions, Navigation, Quick Filters, Tasks, Sprints**.
* Komendy: „Go to…”, „New Task”, „My Issues”, „Urgent (P0)”, otwieranie zadania po ID/tytule.
* Klawisze: ↑/↓, Enter, Esc; wyniki z ikonami i meta (`⌘/Ctrl` hinty).

### 4.3 SearchBar (IssuesList)

* Filtrowanie wielokryterialne: status, priorytet, assignee, labels, sprint, SP, data.
* Zapis filtrów: **Saved Views** (nazwa + ikona); quick-chips.
* Sort: wielopolowy (np. `priority DESC, updated DESC`).

### 4.4 Global Toaster & Notifications

* Non-blocking; sukces/błąd/info; stack do 3; znikanie po 4–6s.

### 4.5 Keyboard Shortcuts

* `Ctrl+K` palette; `?` pomoc; `N` nowy task; `G D/I/S/T/R/A` skoki do widoków; `/` focus search; `[`/`]` zmiana kolumn na kanbanie; `L` szybkie etykiety.

---

## 5) Widoki (detal)

### 5.1 PersonalDashboard

**Nagłówek:** „Twój Dzień” + data. **Karty:**

* **Pilne (P0/P1)**: lista klikalna, lewy czerwony akcent.
* **Twoje zadania**: liczby w statusach Todo/In Progress/In Review + „Zobacz wszystkie”.
* **Sprint Overview**: progress, `done/total`, dni do końca, alert o blocked.
* **Szybki Widok**: duże przyciski (Kanban, Wszystkie, Ulubione, Sprinty). **Stany:** puste (ilustracja + CTA), loading (skeletony), błąd (retry).

### 5.2 IssuesList

**Górny pasek:** SearchBar, toggler widoku (Tabela/Karty), „New Task”. **Widok Tabela:** kolumny: ID, Tytuł, Priorytet, Status, Przypisany, Sprint, SP, Akcje; wiersz klikalny otwiera panel. **Widok Karty (Spacious):** pełniejsze dane, akcje inline. **Gęstość:** Compact/Comfortable/Spacious. **Akcje masowe:** zaznaczanie, zmiana statusu, przypisania, SP, etykiet. **Paginacja lub wirtualizacja listy.**

### 5.3 IssueDetailView (Right Drawer)

**Nagłówek:** back `<`, ID, tytuł, Badge priorytet/status; akcje: Favorite, Edit, Delete. **Tabs:**

* **Szczegóły**: opis (markdown), podzadania + progress, pola (type, labels, SP).
* **Komentarze**: wątki, @wzmianki, emoji, edycja/usuwanie własnych, upload plików, cytaty.
* **Załączniki**: podgląd miniatur, linki zewnętrzne.
* **Aktywność**: story zmian w czasie. **Sidebar metadane:** assignee (z quick change), sprint, daty utworzenia/modyfikacji, relacje (parent/child), powiązane linki (np. PR). **TimeTracker:** start/stop, manualne wpisy, sumy.

### 5.4 CurrentSprintView (Kanban)

**Nagłówek:** nazwa, daty, dni do końca. **Metryki:** liczba zadań, suma SP, progress; **AI Insights** (blokady, ryzyko). **Tablica:** kolumny: To Do / In Progress / In Review / Done; **WIP limits** na In Progress/In Review (np. `4/3`). **Karty:** tytuł, priorytet, assignee, ID, SP; drag&drop; kontekstowe menu. **Skróty:** `[`/`]` do przenoszenia między kolumnami (z potwierdzeniem).

### 5.5 SprintsView

**Nagłówek:** „Sprinty” + **Create Sprint**. **Sekcje:** Active, Planned, Completed. **Karty:**

* **Active:** nazwa, status, daty, progress, done/total, SP, czas; akcje: **End Sprint**, Edit.
* **Planned:** nazwa, daty; akcje: **Start Sprint**, Edit, Delete.
* **Completed:** daty, skrót wyników; akcja: **View Report**. **Backlog Dock:** lista nieprzypisanych issues; drag&drop na planowane sprinty. **Formularz Sprintu:** nazwa, start, end, cel sprintu; walidacje (end > start, overlap guard). **Zakańczanie Sprintu:** modal: niedokończone → move do backlog/next sprint.

### 5.6 TeamsView & TeamDetailView

**TeamsView:** siatka kart (nazwa, awatary, workload/velocity skrót). Klik → szczegóły. **TeamDetail:**

* **Nagłówek:** nazwa zespołu, Back.
* **Lista członków:** avatar, imię+nazwisko, rola, obecne obciążenie (SP).
* **Dashboard:** Burndown (bieżący sprint), Podział zadań (per członek/status), Lista zadań zespołu (filtrowana), Velocity history (ostatnie sprinty).
* **Wnioski AI**: sugestie realokacji.

### 5.7 ReportsView

**Dashboard modułowy:** widgety układane drag&drop; zakres czasu (7d/30d/kwartał/custom). **Raporty:** CFD, Velocity Chart, Cycle/Lead Time, Workload Distribution, AI Insights & Predictive. **Eksport:** PDF/CSV; ustawienia raportu zapisywalne.

### 5.8 ActivityView

**Feed:** nieskończona lista; wpis: avatar, użytkownik, opis, link do obiektu, timestamp („2h temu” + tooltip z pełną datą). **Filtry:** użytkownik, typ zdarzenia, zakres dat.

### 5.9 AIAutomationView

**Sekcje:** Rules, Templates, Logs, Insights. **Lista reguł:** nazwa, opis, status (switch), ostatnie uruchomienie, sukcesy/błędy. **Edytor (When/If/Then):** wielokrotne warunki z AND/OR; test rule (dry-run) i podgląd dopasowanych issues. **Integracje:** Slack, GitHub itp.; retry polityka, throttling. **Logi:** chronologia uruchomień z payloadem i wynikiem. **Statystyki:** oszczędzony czas, najczęściej uruchamiane reguły.

### 5.10 SettingsView

**Sekcje:** Profil, Powiadomienia, Integracje, Zarządzanie Danymi. **Export Data:** JSON wszystkich danych demo; **Import Data:** przywrócenie stanu. **Preferencje:** temat, gęstość list, domyślne widoki, strefa czasowa.

---

## 6) Stany: puste, ładowanie, błędy

* **Puste:** przyjazny obrazek, krótki opis, CTA (np. „Utwórz swoje pierwsze zadanie”).
* **Ładowanie:** Skeletony kart/tabel; progres liniowy dla dłuższych fetchy.
* **Błędy:** Alert z diagnozą (kod, short id); „Spróbuj ponownie” + link do status page (w demo: pomoc).

---

## 7) Dostępność (A11y)

* Kontrast ≥ WCAG AA; focus ring wyraźny (outline 2px, offset 2px).
* Pełna nawigacja klawiaturą; focus trap w modalu/drawerze; `aria-*` dla list, tablic, przycisków.
* Live regions (`aria-live=polite`) dla toasterów/async wyników.
* Alternatywy tekstowe dla ikon; czytelne label/aria-label w akcjach.

---

## 8) Wydajność i technika

* **Stan serwerowy:** TanStack Query (cache, retry, background refetch, optymistyczne aktualizacje).
* **Stan UI:** Zustand (sidebar, tema, density, modale).
* **Wirtualizacja list:** `@tanstack/react-virtual` dla Issues/Activity.
* **D&D:** `@dnd-kit` (a11y fallback: menu „Przenieś do kolumny…”).
* **Bundle:** code-splitting per widok, lazy dla panelu IssueDetail.
* **Telemetria:** eventy UI (open_panel, drag_card, save_filter…).

---

## 9) Bezpieczeństwo, role, prywatność (dla demo)

* Role: Viewer, Member, Admin (warunkowanie akcji/ikon, układów).
* Maskowanie potencjalnie wrażliwych danych (np. e-maile testowe).
* Audyt: ActivityView jako log.

---

## 10) Internationalizacja (i18n)

* Pliki językowe JSON; plurale; formaty dat/liczb przez Intl; RTL-ready.

---

## 11) Onboarding i „Demo Mode”

* Banner informacyjny (z linkiem do dokumentacji i do „Reset demo data”).
* Pierwsze uruchomienie: wskazówki (coach marks) dla Sidebar, Command Palette, Issues.
* Szybkie utworzenie przykładowego zestawu sprint+zadania.

---

## 12) Model danych (TypeScript, skrót)

```ts
type ID = string;

export interface User { id: ID; name: string; avatarUrl?: string; role: 'viewer'|'member'|'admin'; }
export type Priority = 'P0'|'P1'|'P2'|'P3';
export type Status = 'todo'|'in_progress'|'in_review'|'blocked'|'done';

export interface Issue {
  id: ID; key: string; title: string; description?: string; priority: Priority; status: Status;
  assigneeId?: ID; sprintId?: ID; storyPoints?: number; labels?: string[];
  parentId?: ID; subtaskIds?: ID[]; favorite?: boolean;
  createdAt: string; updatedAt: string; dueAt?: string;
}

export interface Sprint { id: ID; name: string; goal?: string; start: string; end: string; status: 'planned'|'active'|'completed'; issueIds: ID[]; }
export interface Team { id: ID; name: string; memberIds: ID[]; velocityHistory?: number[]; }
export interface Comment { id: ID; issueId: ID; authorId: ID; body: string; createdAt: string; updatedAt?: string; parentId?: ID; }
export interface Attachment { id: ID; issueId: ID; name: string; url: string; type: string; size: number; }
export interface Activity { id: ID; actorId: ID; type: string; targetType: 'issue'|'sprint'|'comment'|'automation'|'team'; targetId: ID; createdAt: string; payload?: Record<string, any>; }

export interface AutomationRule {
  id: ID; name: string; active: boolean; when: string[]; if: string[]; then: string[];
  lastRunAt?: string; lastRunStatus?: 'success'|'error';
}
```

---

## 13) Mapowanie komponentów ↔ widoki

* `sidebar-navigation.tsx` → SidebarNavigation
* `command-palette.tsx` → CommandPalette
* `personal-dashboard.tsx` → Dashboard
* `issues-list.tsx`, `issue-card.tsx`, `search-bar.tsx`, `favorite-button.tsx`
* `issue-detail-view.tsx`, `comment-section.tsx`, `file-uploader.tsx`, `time-tracker.tsx`, `issue-assignment-dialog.tsx`
* `current-sprint-view.tsx`, `kanban-board.tsx`, `sprint-card.tsx`, `sprint-form.tsx`, `sprints-view.tsx`
* `teams-view.tsx`, `team-card.tsx`, `team-detail-view.tsx`
* `reports-view.tsx` + `reports/*` (BurndownChart, VelocityTrendsDashboard, itd.)
* `activity-view.tsx`, `activity-feed.tsx`
* `ai-automation-view.tsx`, `automation-*`
* `settings-view.tsx`, `data-manager.tsx`
* `keyboard-shortcuts-help.tsx`, `theme-provider.tsx`, `bulk-operations.tsx`, `template-selector.tsx`

---

## 14) Testy i kryteria akceptacji (skrót)

**Nawigacja:**

* Sidebar collapse/expand zapisuje stan.
* Aktywny link ma właściwe aria-current.

**IssuesList:**

* Filtry działają łącznie; zapis i przywołanie Saved View.
* Klik wiersza otwiera panel (bez utraty scrolla i filtra).

**IssueDetailView:**

* Edycja pól z autosave; cofanie (undo) do 10s po zmianie.
* Komentarze: @mention, upload >5MB blokuje z jasnym komunikatem.

**Kanban:**

* Przeciągnięcie między kolumnami zmienia status + zapis SP; WIP limit sygnalizuje przekroczenie.

**Sprints:**

* Start/End walidują overlap; zakończenie przenosi niedokończone zgodnie z wyborem.

**A11y:**

* Cała aplikacja obsługiwana klawiaturą; focus nie ginie przy otwieraniu/zamykanie paneli.

---

## 15) Roadmapa wydawnicza

**MVP:** Dashboard, Issues (table/cards), IssueDetail (drawer), Current Sprint (kanban), Sidebar, Command Palette, Settings (Export/Import), Activity (basic).

**V2:** SprintsView z backlog dock, Teams (detail dashboards), Reports (CFD, Velocity), AIAutomations (rules+logs), Bulk ops, Saved Views share.

**V3:** Predictive AI, zaawansowane widgety raportowe, granularne role, audyt eksportowalny, szablony procesów.

---

## 16) Mikrocopy (przykłady)

* Puste Issues: „Nie znaleziono zadań. Zmień filtr lub **utwórz nowe**.”
* Zakończenie sprintu: „Co zrobić z 5 niedokończonymi zadaniami?” [Przenieś do backlogu] [Przenieś do następnego sprintu]
* Błąd zapisu: „Nie udało się zapisać. Spróbuj ponownie lub sprawdź połączenie.”

---

## 17) Analityka i metryki

* **Aktywacja:** użycie Command Palette, utworzenie pierwszego zadania.
* **Zaangażowanie:** dzienna liczba otwarć IssueDetail, przeciągnięć na kanbanie.
* **Skuteczność:** czas od wejścia do znalezienia zadania (search success), redukcja WIP exceed.

---

## 18) Integracje (demo)

* Slack: webhook info-only (toast z symulacją powodzenia).
* GitHub: linkowanie PR do Issue (pole relacji, bez prawdziwego API w demo).

---

**Koniec dokumentu v1.0 — gotowe do implementacji zgodnie z listą komponentów.**

---

## 19) Dobór komponentów i wzorców (Tailwind, shadcn/ui, 21st.dev)

Poniżej szczegółowa mapa „co z czego zbudować” dla Syzio /demo. Każdy element zawiera:

* **shadcn/ui**: konkretne komponenty (i warianty) do instalacji i użycia,
* **Tailwind**: kluczowe utilsy/wzorce layoutu i themingu,
* **21st.dev**: gotowe bloki/wzorce do podejrzenia stylistyki (puste stany, sidebary, nawigacje, itp.).

> Skrót instalacji shadcn (CLI): `npx shadcn@latest add <component>`

### 19.1 AppShell & globalne elementy

* **Top „Demo Mode” banner**

  * shadcn/ui: `Alert`, `Button`, opcjonalnie `Separator` (pod banerem), `Sonner` (toasty informacyjne).
  * Tailwind: sticky top (`sticky top-0 z-50`), kolorystyka wg tokenów (`bg-primary/10 text-primary`), dark mode (`dark:`), siatka kontenera (`container mx-auto px-4`).
  * 21st.dev: „Alerts”, „Texts” – wzorce copy i układów.

* **Sidebar (collapsible + mobile)**

  * shadcn/ui: `ScrollArea` (lista linków), `Tooltip`/`HoverCard` (etykiety przy zwinięciu), `Separator` (sekcje), `Badge` (liczniki), `Toggle` (przełącznik gęstości), `Switch` (theme), **mobile**: `Sheet` (`side="left"`). Opcjonalnie `Resizable` dla regulowanej szerokości na desktopie.
  * Tailwind: layout `flex`, szerokości `w-72` / `w-[72px]` (collapsed), stan w `data-[collapsed=true]` + `group` do hover efektów; `transition-[width]`.
  * 21st.dev: „Sidebars”, „Navigation Menus” – warianty wzrokowe i hierarchia.

* **Page header (sticky)**

  * shadcn/ui: `Breadcrumb` (ścieżka), `DropdownMenu` (akcje), `Button` (CTA), `Separator` (pod nagłówkiem).
  * Tailwind: `sticky top-[var(--top-offset)] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60`.
  * 21st.dev: „Menus”, „Buttons”, „Texts”.

* **Command Palette (Ctrl+K)**

  * shadcn/ui: `Command` **w** `Dialog` (desktop) i/lub `Sheet` (mobile). Struktura: `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`.
  * Tailwind: focus rings (`focus-visible:outline`), `max-w-xl w-full` w modalu.
  * 21st.dev: „AI Chats”, „Search/Inputs” jako inspiracja wizualna.

* **Global Toaster**

  * shadcn/ui: preferowane `Sonner` (zamiast starego `Toast`) + `Toaster` na root layout; semantyczne warianty (success/warn/error/info).
  * Tailwind: pozycja `fixed right-4 bottom-4 sm:right-6 sm:bottom-6`.
  * 21st.dev: „Notifications”, „Alerts”.

### 19.2 Widoki

#### A) PersonalDashboard

* shadcn/ui: `Card` (sekcje), `Progress` (Sprint Overview), `Badge` (statusy), `Alert` (AI/blockers), `Button` (Szybki Widok), opcj. `Tabs` na przełączanie widoków.
* Tailwind: siatka kart (`grid grid-cols-12 gap-6`), akcenty lewą krawędzią (`border-l-4 border-destructive`).
* 21st.dev: „Cards”, „Features”, „Texts” – kompozycje kart i skrótów.

#### B) IssuesList (Tabela/Karty)

* **Tabela (Compact/Comfortable)**

  * shadcn/ui: `Data Table` (Table + integracja z TanStack Table), `Input` (search), `Select` (filtrowanie), `Checkbox` (wybór), `Badge` (priorytet/status), `Avatar` (assignee), `DropdownMenu` lub `ContextMenu` (akcje wiersza), `Pagination` (dół tabeli), `Popover` + `Calendar` ⇒ `Date Picker` (zakres dat).
  * Tailwind: wirtualizacja kontenera (wysokość + `overflow-auto`), sticky header (`sticky top-0`), responsywne ukrywanie kolumn (`hidden lg:table-cell`).
  * 21st.dev: „Tables”, „Paginations”, „Empty States”, „Badges”.

* **Karty (Spacious)**

  * shadcn/ui: `Card`, `Badge`, `Avatar`, `DropdownMenu`, `Separator`.
  * Tailwind: układ masonry (`grid grid-cols-12 gap-4`, karty `col-span-12 md:col-span-6 xl:col-span-4`).
  * 21st.dev: „Cards”, „Tags/Badges”.

* **SearchBar (zaawansowany)**

  * shadcn/ui: `Popover` + mini `Command` jako combobox filtrów; `Select`, `Input`, `Date Picker`, `Checkbox`, `Switch` (tylko moje).
  * Tailwind: chipy filtrów (`inline-flex items-center rounded-full px-2 py-1 text-xs`), `ring-1` dla focus.

#### C) IssueDetailView (Right Drawer)

* shadcn/ui: `Sheet` (`side="right"`, szer. 560–720px), w środku `Tabs` (Szczegóły/Komentarze/Załączniki/Aktywność), `ScrollArea` (długie treści), `Separator` (sekcje), `Badge`, `Avatar`, `HoverCard` (podgląd użytkownika), `Dialog` (edycja, potwierdzenia), `AlertDialog` (usunięcie), `Textarea`, `Input`, `Select`, `Progress` (subtaski), `Tooltip` (ikony akcji).
* Tailwind: focus trap + `aria-*` ze shadcn; sticky subheader w drawerze (`sticky top-0 bg-background/95`).
* 21st.dev: „Dialogs/Modals”, „File Uploads” (wzorzec listy plików), „Tabs”.

#### D) CurrentSprintView (Kanban)

* shadcn/ui: `Card` (kolumny), `Badge` (liczniki), `Progress` (postęp sprintu), `Tooltip`/`HoverCard` (detal karty), `DropdownMenu` (akcje kart), `Tabs` (przełączniki filtrów), `Alert` (AI Insights). **Kolumny** mogą korzystać z `Resizable` do regulacji szerokości w desktopie.
* Tailwind: siatka kolumn (`grid grid-cols-4 md:grid-cols-4 gap-4`), drag handle style (`cursor-grab active:cursor-grabbing`), WIP kolorystyka (`data-[over=true]:bg-destructive/10`).
* 21st.dev: „Cards”, „Badges”, „Scroll Areas” (przewijanie kolumn).

#### E) SprintsView

* shadcn/ui: `Card` (karty sprintów), `Progress`, `Badge` (status), `Button` (Start/End), `DropdownMenu` (więcej opcji), `Dialog` + formularz (`Input`, `Textarea`, `Calendar` w `Popover`).
* Tailwind: sekcje „Active/Planned/Completed” jako `grid` z nagłówkami.
* 21st.dev: „Cards”, „Calendars”, „Buttons”.

#### F) TeamsView / TeamDetailView

* shadcn/ui: `Card` (TeamCard), `Avatar` (członkowie), `Badge` (rola/status), **Charts** (Recharts przykłady ze shadcn: linia/słupek/area), `Tabs` (Burndown/Workload/Velocity), `HoverCard` (profil), `Table` (lista zadań zespołu), `Select` (filtry).
* Tailwind: wykresy responsywne (`aspect-video md:aspect-[4/1]`).
* 21st.dev: „Avatars”, „Cards”, „Tabs”, „Charts (Videos/Images as inspiration)”.

#### G) ReportsView

* shadcn/ui: `Tabs` (CFD/Velocity/Cycle Time/Workload), `Card` (widget), `DropdownMenu` (eksport), `Button` (range), `Popover` + `Date Picker` (zakres), komponenty **Charts** (Recharts zestaw od shadcn).
* Tailwind: siatka drag-ready (`grid` + klasy DnD), `print:` klasy do eksportu PDF.
* 21st.dev: „Tables”, „Charts inspirations”, „Texts”.

#### H) ActivityView

* shadcn/ui: `ScrollArea` (feed), `Separator` (elementy), `Avatar` (aktor), `Badge` (typ zdarzenia), `Button` (filtry), `Select` (użytkownik/typ), `Input` (wyszukiwarka), `Pagination` lub przycisk „Load more”.
* Tailwind: `divide-y` zamiast zbyt wielu `Separator`.
* 21st.dev: „Empty States” (gdy brak aktywności), „Avatars”.

#### I) AIAutomationView

* shadcn/ui: `Accordion` (When/If/Then sekcje), `Select`/`Command` w `Popover` (wybór pól/warunków), `Switch` (aktywny), `Badge` (status), `Table` (logi), `Alert` (błędy reguł), `Dialog` (test rule), `Toast/Sonner` (wyniki dry-run).
* Tailwind: layout 2‑kolumnowy (`lg:grid lg:grid-cols-12`), „rule chips” jako `rounded-full` elementy z ikoną „x”.
* 21st.dev: „Forms”, „Tags”, „Tables”.

#### J) SettingsView

* shadcn/ui: `Form` (schemat z `react-hook-form`), `Input`, `Textarea`, `Select`, `Switch`, `Separator` (sekcje), `AlertDialog` (reset/clear), `Dialog` (Import Data), `Progress` (upload), `Toast/Sonner` (potwierdzenia).
* Tailwind: `prose` dla treści pomocy, `space-y-*` między sekcjami.
* 21st.dev: „Forms”, „File Uploads”, „Texts”.

### 19.3 Theming i dostępność

* **Tailwind Dark Mode**: tryb `class` (dodawanie `dark` na `<html>` + sync z `localStorage`), warianty `dark:` dla `bg`, `text`, `border`.
* **Kontrast i focus**: używać domyślnych focus ringów shadcn + `outline-offset-2`.
* **Aria i klawiatura**: komponenty shadcn oparte na Radix zapewniają nawigację klawiaturą (Tabs, Dialog, Dropdown, Command).

### 19.4 Lista komponentów shadcn do instalacji (MVP)

`alert, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, checkbox, command, context-menu, date-picker, dialog, dropdown-menu, hover-card, input, pagination, popover, progress, resizable, scroll-area, select, separator, sheet, switch, table ( + data-table guide ), tabs, textarea, tooltip, sonner`

### 19.5 Wzorce 21st.dev — rekomendowane kategorie do inspiracji UI

* **Sidebars, Navigation Menus** — warianty struktur i stanów.
* **Tables, Paginations** — układ i responsywność tabel.
* **Empty States, Alerts** — ilustracje i copy.
* **File Uploads** — UX przesyłania i podglądu plików.
* **Cards, Badges, Avatars, Tabs** — drobne elementy i ich kompozycje.

### 19.6 Przykładowa kompozycja (Right Drawer + Tabs)

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[560px] max-w-[90vw] p-0">
    <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Zamknij">←</Button>
        <span className="font-medium">TASK-123 · Naprawić błąd logowania</span>
        <Badge variant="destructive">P0</Badge>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Ulubione">★</Button>
        <DropdownMenu>{/* Akcje */}</DropdownMenu>
      </div>
    </div>
    <Tabs defaultValue="details">
      <TabsList className="px-4 sticky top-14 bg-background z-10">
        <TabsTrigger value="details">Szczegóły</TabsTrigger>
        <TabsTrigger value="comments">Komentarze</TabsTrigger>
        <TabsTrigger value="attachments">Załączniki</TabsTrigger>
        <TabsTrigger value="activity">Aktywność</TabsTrigger>
      </TabsList>
      <ScrollArea className="h-[calc(100vh-6rem)] px-4">
        {/* ...tab contents... */}
      </ScrollArea>
    </Tabs>
  </SheetContent>
</Sheet>
```

### 19.7 Notatki implementacyjne

* **Responsive drawer**: na mobile łącz `Dialog`/`Drawer` (pattern), desktop `Sheet` po prawej.
* **Date Picker**: budować z `Popover` + `Calendar` (pojedyncza data) lub dwa pickery (zakres).
* **Data Table**: użyj kolumn z `accessorKey`, kolumny akcji jako `DropdownMenu`; paginacja komponentem `Pagination`.
* **Charts**: korzystać z przykładowych komponentów Recharts (Line/Bar/Area/Pie) i dostosować tokenami brandu.
* **A11y**: dbać o `aria-label`/`aria-describedby` dla ikon-only buttonów i tooltipów.

---

## 20) Procesy dodawania/edycji, AI & Automation oraz Settings — **jakie komponenty użyć** (Tailwind + shadcn/ui + 21st.dev)

Poniżej ultra‑konkretny mapping komponentów i wzorców dla kluczowych flow, wraz z krótkimi snippetami.

### 20.1 IssueForm — tworzenie/edycja zadania

**shadcn/ui**: `Dialog` (modal), `Form` (z RHF), `Input`, `Textarea`, `Select`, `Popover` + `Calendar` (daty), `Command` (combo/assignee + labels), `Badge` (podgląd etykiet), `Separator` (sekcje), `ScrollArea` (długie opisy), `Tooltip` (ikonowe przyciski), `AlertDialog` (potwierdzenie porzucenia zmian), `Sonner` (toasty), `Button`. **Tailwind**: layout formularza `grid grid-cols-12 gap-4`, sticky stopka akcji `sticky bottom-0 bg-background/95 backdrop-blur`, gęstość `space-y-3`, walidacje `aria-invalid` + klasy `ring-1 ring-destructive/50`. **21st.dev**: „Forms”, „Empty States”, „Dialogs/Modals”. **Rekomendacje UX**:

* Dynamiczny tytuł („Create…” vs „Edit…”), auto‑focus w Title, podpowiedź ID (read‑only, mono font), podgląd SP, **autosave** co 2s (opcjonalnie, sterowane w Settings).
* `Assignee` jako **combobox** (`Command` w `Popover`) z avatarami i klawiaturą.
* `Labels` wielokrotnego wyboru (Command → multiselect + `Badge` chips z `×`).
* Puste stany (np. brak sprintów) z CTA „Create Sprint”.

**Snippet (zod + RHF + shadcn Form)**

```tsx
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['P0','P1','P2','P3']),
  status: z.enum(['todo','in_progress','in_review','done']),
  assigneeId: z.string().min(1, 'Assignee is required'),
  sprintId: z.string().optional(),
  dueAt: z.date().optional(),
  storyPoints: z.number().int().min(0).optional(),
});

export function IssueForm({open, onOpenChange, defaultValues, onSubmit}: Props){
  const form = useForm({ resolver: zodResolver(schema), defaultValues });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="px-6 py-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle>{defaultValues?.id ? 'Edit Issue' : 'Create New Issue'}</DialogTitle>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4 grid grid-cols-12 gap-4">
            {/* Title */}
            <FormField control={form.control} name="title" render={({field}) => (
              <FormItem className="col-span-12">
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="Short, descriptive title" {...field}/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            {/* Priority & Status */}
            <FormField control={form.control} name="priority" render={({field}) => (
              <FormItem className="col-span-6 md:col-span-3">
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent>
                    {['P0','P1','P2','P3'].map(p=> <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="status" render={({field}) => (
              <FormItem className="col-span-6 md:col-span-3">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}/>
            {/* Assignee combobox (Command in Popover) — skrócone */}
            {/* Description */}
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem className="col-span-12">
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea rows={6} {...field}/></FormControl>
              </FormItem>
            )}/>
          </form>
        </Form>
        <div className="px-6 py-3 border-t sticky bottom-0 bg-background flex justify-end gap-2">
          <Button variant="ghost" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="issue-form">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 20.2 SprintForm — tworzenie/edycja sprintu

**shadcn/ui**: `Dialog`, `Form`, `Input`, `Popover` + `Calendar` (start/end), `Textarea` (cel sprintu), `Alert` (kolizje dat), `AlertDialog` (End Sprint), `Button`. **Tailwind**: układ `grid md:grid-cols-2 gap-4`, walidacja „end > start”, wizualny hint zakresu (`ring-1` na wybranych dniach), „overlap guard” jako `Alert` nad formularzem. **21st.dev**: „Calendars”, „Forms”. **Dodatkowo**: w `End Sprint` — modal wyboru, co zrobić z niedokończonymi (`RadioGroup`: move to backlog / move to next sprint).

### 20.3 Team create/edit — (proponowane)

**shadcn/ui**: `Dialog`, `Form`, `Input` (name), `Command` combobox (Team Lead), `Avatar` + lista członków (checkboxy), `Badge` (role), `Color picker` (Popover + custom), `Textarea` (opis), `Button`. **Tailwind**: siatka członków `grid grid-cols-2 md:grid-cols-3 gap-3`, chipsy członków `inline-flex items-center rounded-full px-2 py-1`. **21st.dev**: „Avatars”, „Lists”, „Tags/Badges”.

### 20.4 AIAutomationView — zakładki i edytor reguł

**Zakładki**: `Tabs` → `Overview`, `Rules`, `Insights`, `Logs`, `Templates`.

* **Overview**: `Card` (KPI), `Progress` (oszczędzony czas), wykresy (Recharts: `AreaChart`, `BarChart`), `Table` (ostatnie uruchomienia), `Alert` (ryzyka AI).
* **Rules**: `AutomationRulesView` z listą (`Table` + `Switch` + `DropdownMenu` akcje), `Button` → `AutomationRuleModal`.
* **AutomationRuleModal (When/If/Then)**:

  * shadcn/ui: `Dialog`, `Accordion` (sekcje When/If/Then), `Command` (wybór pól i operatorów), `Badge` chips (warunki), `Select`, `Input`, `Switch`, `Separator`, `Alert` (walidacje), `Sonner` (dry‑run wynik), `Button`.
  * Tailwind: układ 2‑kolumnowy (`lg:grid lg:grid-cols-12 gap-4`); chipsy warunków z ikoną „x” (`group hover:bg-muted`); sekcja podglądu dopasowań jako `ScrollArea`.
* **Insights**: karty (`Card`) z priorytetem, `Badge` (kategoria), `Button` (Create Task) → otwiera `IssueForm` pre‑wypełniony.
* **Logs**: `Data Table` (kolumny: rule, time, status, details), `Select` filtry, `Input` search, `Pagination`.
* **Templates**: `Card` galeria, `Button` „Use Template” → prekonfiguracja `AutomationRuleModal`.

### 20.5 SettingsView — zakładki i opcje

**Nawigacja**: `Tabs` (General, Appearance, Notifications, Data, Shortcuts).

* **General**: `RadioGroup` (Start view), `Switch` (Autosave), `Switch` (Confirm delete), `Separator` sekcje.
* **Appearance**: custom `ThemeToggle` (oparty o `Switch`/`Button`), `RadioGroup` (density), podgląd w `Card`.
* **Notifications**: lista `Switch` + opis, globalny `Switch` master.
* **Data**: `Card` z `DataManager` (Export/Import), `AlertDialog` (potwierdzenie restore), `Progress` (upload/import), `Toast`.
* **Shortcuts**: tabela (`Table`) skrótów, `Dialog` (Customize — opcjonalne), `Kbd` styl jako `code` + Tailwind.

**Tailwind**: kontener `max-w-5xl mx-auto`, spacing `space-y-8`, `prose` dla sekcji pomocy, `print:` klasy przy eksporcie. **21st.dev**: „Forms”, „Tables”, „File Uploads”, „Texts”.

### 20.6 Reports — dashboardy i komponenty

* **SprintHealthDashboard**: Recharts (`LineChart` Burndown, `AreaChart` CFD, `BarChart` Added vs Completed), `Card` KPI, `Select` (sprint), `Alert` (scope creep), `Badge` (status health).
* **TeamPerformanceDashboard**: `Select` (team/member), `BarChart` (Workload), `LineChart` (Cycle/Lead time), `Table` (porównanie członków), `Tabs`.
* **ProjectOverviewDashboard**: karty KPI (Active members, Project Health, Overall Progress), `Timeline` (custom lub `ol` + Tailwind), `PieChart` (typ/status tasków).
* **VelocityTrendsDashboard**: `BarChart` (per sprint) + linia średniej, `Table` (zaplanowane vs dostarczone SP).
* **TimeTrackingDashboard**: `Select` filtry, KPI karty, `PieChart` (czas wg kategorii), `Table` timesheet.
* **ExportReports**: `Dialog` z `Select` (format: PDF/CSV), `Date Range` (Popover+Calendar), `Switch` (tylko widoczne dane), `Button` Export.

### 20.7 Dodaj te komponenty shadcn (pod ten zakres)

`accordion, alert, alert-dialog, avatar, badge, button, calendar, card, checkbox, command, date-picker, dialog, dropdown-menu, form, hover-card, input, pagination, popover, progress, scroll-area, select, separator, sheet, sonner, switch, table, tabs, textarea, tooltip`

### 20.8 Wzorce Tailwind do wielokrotnego użycia (extract to class)

* **Panel stopki akcji**: `sticky bottom-0 bg-background/95 backdrop-blur border-t px-4 py-3`
* **Karta KPI**: `rounded-2xl border p-4 md:p-5 shadow-sm`
* **Lista chips**: `inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs`
* **Kolumny Kanban**: `flex flex-col gap-2 min-h-[60vh] rounded-xl border p-3`
* **Tabela w kontenerze**: `overflow-auto rounded-xl border` + `table-fixed`

---

---

## 21) Okna (modale) tworzenia nowych elementów

> W Syzio **„Nowy Task” = „Nowy Issue”** — oba prowadzą do tego samego formularza (`IssueForm`).

### 21.1 „Nowy Task / Nowy Issue” — `IssueForm.tsx`

**Cel:** szybkie utworzenie zgłoszenia z minimalnym kontekstem, z możliwością rozszerzenia po zapisaniu.

**Komponenty:**

* **shadcn/ui:** `Dialog` (modal), `Form` (z `react-hook-form`), `Input`, `Textarea`, `Select`, `Popover` + `Command` (combobox do Assignee/Labels), `Calendar` (opcjonalny Due Date), `Badge` (chips etykiet), `Separator`, `ScrollArea`, `Tooltip`, `AlertDialog` (potwierdzenie odrzucenia zmian), `Sonner` (toasty), `Button`.
* **Tailwind:** układ `grid grid-cols-12 gap-4`, sticky stopka akcji `sticky bottom-0 bg-background/95 backdrop-blur border-t px-4 py-3`, focus ringi, stany błędu `aria-invalid ring-1 ring-destructive/50`.

**Pola formularza:**

* **Title** *(wymagane)* — `Input` z auto‑focus, max 120 znaków.
* **Description** — `Textarea` (obsługa Markdown w kolejnych wersjach).
* **Priority** — `Select` wartości: P0/P1/P2/P3 (domyślnie P3).
* **Status** — `Select` wartości: Todo/In Progress/In Review/Done (domyślnie Todo).
* **Assignee** *(wymagane)* — `Command` w `Popover` z listą użytkowników (Avatar + name, szybkie filtrowanie klawiaturą).
* **Sprint** *(opcjonalne)* — `Select` (lista sprintów + „No Sprint”).
* **(opc.) Due date** — `Popover` + `Calendar` (data docelowa).

**Zachowanie & UX:**

* **Walidacja w czasie rzeczywistym** (zod/RHF). Komunikaty pod polami, przyciski nie blokują focusu.
* **Przyciski:** „Cancel” (zamyka modal, pyta jeśli są zmiany) • „Create Issue” (zapis + toast sukcesu, opcja „Otwórz szczegóły” w toascie).
* **Po zapisie:** optymistyczna aktualizacja listy, reset formularza.
* **Dostępność:** `Dialog` z focus trap, ESC zamyka, `aria-describedby` dla błędów.

**Kryteria akceptacji (skrót):**

* Puste Title/Assignee blokują zapis i pokazują błędy.
* Zapis dodaje rekord do store i zamyka modal ≤300ms (opt./cache).
* `Cmd/Ctrl+Enter` wysyła formularz.

---

### 21.2 „Nowy Sprint” — `SprintForm.tsx`

**Komponenty:**

* **shadcn/ui:** `Dialog`, `Form`, `Input`, `Popover` + `Calendar` (Start/End), `Textarea` (Goal), `Alert` (kolizja/niepoprawny zakres), `Button`, `AlertDialog` (End Sprint w innym flow).
* **Tailwind:** `grid md:grid-cols-2 gap-4`, wyróżniony zakres dat, sticky stopka.

**Pola:**

* **Sprint Name** *(wymagane)* — `Input`.
* **Start Date** *(wymagane)* — `Calendar`.
* **End Date** *(wymagane)* — `Calendar` (walidacja: end > start).
* **Goal** *(opcjonalne)* — `Textarea` (cel sprintu).

**Kryteria akceptacji:**

* Nie pozwala zapisać, jeśli `end <= start` (komunikat przy End Date).
* Po zapisie sprint ma status `planned` i jest widoczny w `SprintsView`.

---

### 21.3 „Nowy Zespół” — **proponowane**

**Uwaga:** w demo brak wdrożonego modala — poniżej spec do implementacji.

**Komponenty:**

* **shadcn/ui:** `Dialog`, `Form`, `Input` (Team Name), `Popover` + `Command` (Team Lead), multiselect Members (Command z checkboxami), `Avatar` (podgląd członków), `Badge` (role), `Popover` (wybór koloru), `Textarea` (Description), `Button`.
* **Tailwind:** siatka członków `grid grid-cols-2 md:grid-cols-3 gap-3`, chipsy `inline-flex items-center rounded-full px-2 py-1`.

**Pola:** Team Name *(wym.)*, Team Lead, Members (multi), Description *(opc.)*, Team Color *(opc.)*.

**Kryteria akceptacji:**

* Wymagana nazwa; po zapisie zespół pojawia się w `TeamsView`; licznik członków aktualny.

---

## 22) Braki funkcjonalne i propozycje uzupełnień

### 22.1 Zarządzanie zespołami (Teams) — **do uzupełnienia**

* **Braki:** brak modala create/edit, brak edycji członków i roli Team Lead.
* **Uzupełnić przez:** modal z pkt 21.3; w `TeamDetailView` sekcja „Members” z `Table` (akcje: Add/Remove/Make lead).
* **Akceptacja:** dodanie/usunięcie członka odbija się w listach zadań i wykresach workload.

### 22.2 Użytkownicy i profil (Users/Auth) — **poza zakresem demo, planowane**

* Logowanie/rejestracja/reset hasła; strona profilu; zarządzanie avatarami.
* **Minimal demo:** mock `CurrentUser` + edycja profilu w Settings → Profile (tekst/avatary lokalne).

### 22.3 Zależności między zadaniami (Dependencies)

* **Braki:** brak UI do relacji „blocks / is blocked by / relates to”.
* **Dodać:** w `IssueDetailView` karta „Relacje”: `Command` (wyszukaj issue) + `Select` typu relacji, lista relacji z możliwością usunięcia; wizualne oznaczenie „Blocked” (Badge + Alert z powodem).
* **Akceptacja:** przeniesienie do `In Progress` blokowane, jeśli istnieje aktywna relacja „blocked by” (z override przez admina).

### 22.4 Role i uprawnienia (RBAC)

* **Role:** Viewer, Member, Admin.
* **UI:** gating akcji (disabled + tooltip „Insufficient permission”), ukrywanie destrukcyjnych akcji dla Viewer.
* **Akceptacja:** test matrycy uprawnień (kto może tworzyć/usuwać/zmieniać status/zarządzać regułami AI).

### 22.5 Projekty (multi‑project)

* **Braki:** aplikacja działa jak single‑project.
* **Dodać:** przełącznik projektów w nagłówku (Breadcrumb + `Command` quick switch), przestrzenie danych per projekt, ustawienia per projekt.
* **Akceptacja:** URL zawiera id projektu; widoki filtrują dane po projekcie.

### 22.6 Pola niestandardowe (Custom Fields)

* **Dodać:** definicje w Settings → Data („Add field” z typem: text/number/select/date/boolean); render w `IssueDetailView` sekcja „Custom fields”.
* **Akceptacja:** pola pojawiają się w filtrach i tabeli (konfigurowalne kolumny).

### 22.7 Zaawansowane wyszukiwanie (język zapytań)

* **Propozycja:** prosty DSL (np. `status:in_progress assignee:"Jan" sort:-priority,updated`), z parserem i highlightem tokenów w `SearchBar`.
* **Akceptacja:** zapisane widoki przechowują DSL; Command Palette potrafi przyjąć DSL.

### 22.8 Roadmapa / Gantt

* **UI:** oś czasu sprintów i zadań (custom timeline; milestone’y), drag do zmiany dat (opcjonalnie w V2).
* **Akceptacja:** filtracja po zespole/projekcie; kolizje dat sygnalizowane.

### 22.9 Centrum powiadomień

* **UI:** ikona dzwonka w headerze → `Popover` z listą („mentions/assignments/changes”), `ScrollArea`, akcje „Mark as read”.
* **Integracja:** `Sonner` dla zdarzeń czasu rzeczywistego.

### 22.10 Rich Text & @mentions

* **Opis:** opis/komentarze z Markdown (lub WYSIWYG w przyszłości); `@mentions` jako `Command` z listą użytkowników, efektem jest podświetlenie i powiadomienie.
* **Akceptacja:** render Markdown; mentions generują zdarzenia w Activity i powiadomienia.

---

---

##
