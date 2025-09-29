[4 tools called]

# TaskFlow - Aplikacja do zarządzania zadaniami

TaskFlow to aplikacja do zarządzania projektami i zadaniami, zbudowana w Next.js z TypeScript. Oferuje narzędzia do sprintów, zadań i zespołów w stylu Linear/Jira.

## Funkcjonalności

### Zarządzanie zadaniami (Issues)
- Lista zadań z tabelą i filtrowaniem
- Wyszukiwanie po tytule, opisie i przypisanym użytkowniku
- Filtry według priorytetu (P0–P5), statusu i sprintu
- Priorytety z kolorowymi oznaczeniami
- Statusy: Todo, In Progress, In Review, Done
- Przypisywanie zadań do sprintów lub backlogu

### Zarządzanie sprintami
- Tworzenie sprintów z datami rozpoczęcia i zakończenia
- Statusy: Planned, Active, Completed
- Statystyki postępu i wydajności
- Zarządzanie backlogiem
- Automatyczne obliczenia metryk

### Kanban Board
- Drag & Drop między kolumnami
- Wskaźniki postępu
- Kolorowe statusy z kropkami
- Responsywny design z przewijaniem poziomym

### Raporty i statystyki
- Przegląd wydajności zespołu
- Metryki sprintów i zadań
- Wskaźniki ukończenia
- Analiza backlogu

## Design

### Interfejs
- Zielony motyw z kolorem głównym `#9be5a1`
- Czcionka Inter
- Zaokrąglone rogi (1rem)
- Responsywny design
- Tryb ciemny

### Kolory priorytetów
- P0 — Czerwony (Krytyczny)
- P1 — Pomarańczowy (Wysoki)
- P2 — Żółty (Średni)
- P3 — Zielony (Normalny)
- P4 — Niebieski (Niski)
- P5 — Fioletowy (Najniższy)

### Kolory statusów
- Todo — Szary
- In Progress — Niebieski
- In Review — Żółty
- Done — Zielony

## Technologie

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- @hello-pangea/dnd

### UI/UX
- Shadcn/ui
- Tailwind Animate
- Responsive Design
- Dark Mode

### Narzędzia deweloperskie
- ESLint
- PostCSS
- Vercel Analytics

## Struktura projektu

```
taskflow/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globalne style
│   ├── layout.tsx         # Główny layout
│   └── page.tsx           # Strona główna
├── components/            # Komponenty React
│   ├── ui/               # Komponenty UI (shadcn)
│   ├── current-sprint-view.tsx
│   ├── issues-list.tsx
│   ├── kanban-board.tsx
│   ├── navigation.tsx
│   └── sprints-view.tsx
├── lib/                  # Utilities i dane
│   ├── data.ts          # Dane testowe
│   └── utils.ts         # Funkcje pomocnicze
├── types/               # Definicje TypeScript
│   └── index.ts
├── public/              # Pliki statyczne
└── new design/          # Design mockupy
```

## Uruchomienie

### Wymagania
- Node.js 18+
- npm lub pnpm

### Instalacja
```bash
# Klonuj repozytorium
git clone https://github.com/KFranciszek/aiproductheroes.git
cd aiproductheroes

# Zainstaluj zależności
npm install
# lub
pnpm install

# Uruchom w trybie deweloperskim
npm run dev
# lub
pnpm dev
```

### Build produkcyjny
```bash
# Zbuduj aplikację
npm run build

# Uruchom w trybie produkcyjnym
npm start
```

## Wdrożenie

### Netlify
1. Połącz z GitHub
2. Build command: `npm run build`
3. Publish directory: `.next`

### Render
1. Połącz z GitHub
2. Build command: `npm install && npm run build`
3. Start command: `npm start`

## Responsywność

- Desktop — pełna funkcjonalność
- Tablet — zoptymalizowany layout
- Mobile — przewijanie poziome dla kanban

## Funkcje w planach

- [ ] Integracja z zewnętrznymi API
- [ ] System powiadomień
- [ ] Eksport danych
- [ ] Zaawansowane filtry
- [ ] Timeline view
- [ ] Integracja z Git
- [ ] System komentarzy
- [ ] Załączniki do zadań

## Licencja

MIT License

## Wkład w projekt

1. Fork projektu
2. Stwórz branch dla nowej funkcji
3. Commit zmiany
4. Push do branch
5. Otwórz Pull Request

---

**TaskFlow** — zarządzanie projektami w stylu Linear