# Demo 5 - Quick Start Guide

## Szybki start

### 1. Uruchom aplikację

```bash
npm run dev
```

### 2. Otwórz Demo 5

Przejdź do jednego z adresów:
- **Standalone**: http://localhost:3000/demo5
- **Przez selektor**: http://localhost:3000/demo-selector (kliknij "Demo 5")

### 3. Eksploruj funkcjonalności

#### Dashboard View
- Przegląd wszystkich deployment packages
- Filtry i wyszukiwanie
- Szybki dostęp do szczegółów

#### Package Detail View
- Kliknij na dowolny package aby zobaczyć szczegóły
- Zobacz powiązane JIRA issues
- Sprawdź historię commitów Git
- Przejrzyj metryki deploymentu

#### Environments View
- Monitoring statusu środowisk
- Uptime tracking
- Ostatnie deploymenty

#### Theme Toggle
- Kliknij ikonę słońca/księżyca w prawym górnym rogu
- Przełącz między dark/light mode

---

## Struktura plików

```
demo5/
├── app/
│   ├── (demo5_root)/
│   │   ├── demo5/
│   │   │   └── page.tsx              # ← Główna strona
│   │   └── layout.tsx                # ← Layout z stylami
│   └── demo5-globals.css             # ← Style Tailwind
│
├── components/
│   └── demo5/
│       ├── syzio-dev-monitoring.tsx  # ← Główny komponent (1300+ linii)
│       └── index.ts                  # ← Export
│
└── .kiro/specs/syzio-landing-and-rebrand/demo5/
    ├── README.md                     # ← Pełna dokumentacja
    ├── INTEGRATION_GUIDE.md          # ← Przewodnik integracji
    └── QUICK_START.md                # ← Ten plik
```

---

## Główne komponenty

### 1. ThemeProvider
Zarządza motywem (dark/light)

```typescript
const { theme, toggleTheme } = useTheme();
```

### 2. MonitoringProvider
Store z danymi deploymentów

```typescript
const { packages, environments, addPackage, updatePackageStatus, simulateDeploy } = useMonitoringStore();
```

### 3. UI Components
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Badge` (success, warning, error, secondary)
- `Button` (default, outline, secondary, ghost)
- `StatusBadge`, `IssueTypeBadge`, `PriorityBadge`, `IssueStatusBadge`

---

## Przykładowe dane

### Deployment Packages (3)
1. **Release 2.1.0** (staging, ready)
   - 3 JIRA issues (bug, story, task)
   - 3 commits
   - Scheduled deployment

2. **Release 2.0.1** (production, deployed)
   - 3 JIRA issues (security patches)
   - 1 commit
   - Deployed 1 day ago

3. **Release 2.0.0** (production, deployed)
   - 3 JIRA issues (major UI overhaul)
   - 1 commit
   - Deployed 3 days ago

### JIRA Issues (9 total)
- **Types**: story, bug, task, epic
- **Statuses**: todo, in-progress, in-review, done
- **Priorities**: highest, high, medium, low, lowest
- **Story Points**: 3-21

### Environments (3)
- **dev**: online, 99.2% uptime
- **staging**: degraded, 98.5% uptime
- **production**: online, 99.9% uptime

---

## Testowanie funkcjonalności

### 1. Przeglądanie deploymentów
✅ Otwórz dashboard
✅ Zobacz listę wszystkich packages
✅ Sprawdź statusy i badges

### 2. Szczegóły pakietu
✅ Kliknij na package
✅ Zobacz JIRA issues z pełnymi szczegółami
✅ Sprawdź commity Git
✅ Przejrzyj metryki (jeśli deployed)

### 3. Przełączanie widoków
✅ Dashboard → Package Detail → Back
✅ Dashboard → Environments
✅ Sprawdź nawigację

### 4. Theme switching
✅ Przełącz na dark mode
✅ Przełącz na light mode
✅ Sprawdź czy wszystkie kolory się zmieniają

### 5. Responsive design
✅ Zmień rozmiar okna
✅ Sprawdź mobile view
✅ Sprawdź tablet view

---

## Następne kroki

### Dla developera:
1. Przeczytaj `README.md` dla pełnej dokumentacji
2. Przeczytaj `INTEGRATION_GUIDE.md` dla integracji z Demo 1
3. Eksperymentuj z kodem w `syzio-dev-monitoring.tsx`

### Dla integracji:
1. Wybierz opcję integracji (sidebar, modal, widget)
2. Postępuj zgodnie z `INTEGRATION_GUIDE.md`
3. Dostosuj do swoich potrzeb

### Dla rozszerzenia:
1. Dodaj prawdziwe API endpoints
2. Zintegruj z JIRA API
3. Dodaj Git integration
4. Rozszerz analytics

---

## Kluczowe funkcje do przetestowania

### ✅ Deployment Tracking
- [x] Lista wszystkich deploymentów
- [x] Statusy (draft, ready, deploying, deployed, failed)
- [x] Filtry i wyszukiwanie

### ✅ JIRA Integration
- [x] Issue types (story, bug, task, epic)
- [x] Priorities (highest → lowest)
- [x] Statuses (todo → done)
- [x] Story points
- [x] Labels i metadata

### ✅ Git Integration
- [x] Commit history
- [x] Linkowanie z issues
- [x] Author info
- [x] Timestamps

### ✅ Environment Monitoring
- [x] Multi-environment support
- [x] Status tracking
- [x] Uptime metrics
- [x] Last deployment info

### ✅ UI/UX
- [x] Dark/Light mode
- [x] Responsive design
- [x] Smooth transitions
- [x] Intuitive navigation

---

## Znane ograniczenia (Mock Data)

⚠️ **To jest demo z mock data**:
- Dane są statyczne (nie zapisują się)
- Brak prawdziwej integracji z JIRA
- Brak prawdziwej integracji z Git
- Brak backend API
- Brak persistence

Dla produkcji potrzebne będą:
- Backend API endpoints
- Database (PostgreSQL/MongoDB)
- JIRA API integration
- Git provider integration (GitHub/GitLab)
- Authentication & Authorization
- Real-time updates (WebSockets)

---

## Pomoc i wsparcie

### Problemy?
1. Sprawdź console w DevTools (F12)
2. Sprawdź czy wszystkie pliki są na miejscu
3. Sprawdź czy `npm run dev` działa bez błędów

### Pytania?
- Zobacz `README.md` dla szczegółów
- Zobacz `INTEGRATION_GUIDE.md` dla integracji
- Sprawdź kod w `syzio-dev-monitoring.tsx`

---

## Podsumowanie

Demo 5 to w pełni funkcjonalny moduł monitoringu deploymentów, gotowy do:
- ✅ Standalone użycia
- ✅ Integracji z Demo 1
- ✅ Rozszerzenia o prawdziwe API
- ✅ Customizacji pod własne potrzeby

**Enjoy! 🚀**
