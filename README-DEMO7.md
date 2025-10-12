# Syzio Pulsar Nova - Demo 7

## Opis

**Syzio Pulsar Nova** to moduł prognozowania dostarczenia i monitorowania jakości releasów w czasie rzeczywistym. Łączy metryki DORA, Flow Metrics, OKR i Quality Gates w jeden spójny system wspomagania decyzji.

## Główne funkcje

### 1. Outcome Dashboard
- Przegląd wszystkich Objectives i Key Results
- Wskaźniki zdrowia (health) dla każdego celu
- Metryki confidence i gate pass rate
- Wizualizacja postępu w czasie rzeczywistym

### 2. OKR Manager
- Zarządzanie Objectives i Key Results
- Linkowanie zadań (issues) do KR
- Drawer z szczegółami KR
- Automatyczne obliczanie confidence na podstawie:
  - Postępu (60%)
  - Pokrycia zadaniami (25%)
  - Quality Gates (15%)

### 3. Delivery & Quality Hub
- Quality Gates dla epików
- Metryki: coverage, tests_pass, lint, security, approvals
- Możliwość zmiany statusu gate (pass/fail/waived)
- Agregacja gate pass rate dla KR

### 4. Traceability Map
- Wizualizacja powiązań Objective → KR → Epic → Issue
- (Stub - pełna implementacja w V2)

### 5. Forecast Simulator
- Prognozy Monte Carlo dla KR
- Parametry:
  - Capacity (SP/sprint)
  - Days left
  - Scope change (%)
  - Risk buffer (%)
- Wyniki: P50, P85, Projected Confidence

### 6. Risk Radar & Insights
- Automatyczna detekcja at-risk KR
- Tworzenie corrective tasks
- Alerty i rekomendacje

### 7. Reports
- Wykresy DORA metrics:
  - Lead Time
  - Deployment Frequency
  - Change Fail Rate
  - MTTR
- Porównanie Confidence vs Gate Pass dla KR

### 8. Activity & Audit
- Historia wszystkich zmian
- Audit log z timestampami
- Filtrowanie po typie zdarzenia

### 9. Automations
- Reguły When/If/Then
- Dry-run mode
- Automatyczne akcje:
  - KR confidence < 50% → create recovery task
  - Gate fail 3x/7d → escalate
  - Orphan work > 15% → suggest linking

### 10. Settings
- Konfiguracja wag dla health score:
  - Outcome weight
  - Delivery weight
  - Quality weight
- Export/Import danych (JSON)
- Thresholdy dla alertów

## Technologie

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** (shadcn/ui components)
- **Recharts** (wykresy)
- **Sonner** (toasty)
- **next-themes** (dark mode)
- **localStorage** (persystencja danych)

## Struktura projektu

```
app/(demo7_root)/
  ├── layout.tsx              # Layout z sidebar i topbar
  ├── providers.tsx           # Theme + Error Boundary
  └── demo7/
      ├── page.tsx            # Outcome Dashboard
      ├── okr/page.tsx        # OKR Manager
      ├── delivery/page.tsx   # Quality Gates
      ├── trace/page.tsx      # Traceability
      ├── forecast/page.tsx   # Forecast Simulator
      ├── insights/page.tsx   # Risk Radar
      ├── reports/page.tsx    # DORA Charts
      ├── activity/page.tsx   # Activity Log
      ├── automations/page.tsx # Automations
      └── settings/page.tsx   # Settings

components/demo7/
  ├── sidebar.tsx             # Nawigacja boczna
  ├── topbar.tsx              # Górny pasek
  ├── kpi.tsx                 # Komponent KPI card
  ├── theme-toggle.tsx        # Przełącznik dark/light
  ├── theme-provider.tsx      # Provider motywu
  └── error-boundary.tsx      # Obsługa błędów

lib/demo7/
  ├── types.ts                # Typy TypeScript
  ├── mock.ts                 # Dane mockowe
  └── store.ts                # Stan aplikacji + logika biznesowa
```

## Kluczowe algorytmy

### Confidence Score dla KR
```typescript
confidence = 0.6 * progress + 0.25 * coverage + 0.15 * delivery - 0.05
```

### Health Score dla Objective
```typescript
health = w_outcome * avg_confidence + w_delivery * avg_gate_pass + w_quality * quality_score
```

### Forecast (Monte Carlo)
```typescript
workUnits = remaining * (unit === "pct" ? 0.5 : 1) * (1 + scope/100)
daily = (capacity/10) * (1 - buffer/100)
daysNeeded = workUnits / daily
p50 = ceil(daysNeeded)
p85 = ceil(daysNeeded * 1.2)
```

## Integracja z ekosystemem Syzio

Pulsar Nova integruje się z:
- **Syzio PM (Demo 1/4)** - pobiera dane o zadaniach, sprintach, epikach
- **DevMon (Demo 5)** - otrzymuje metryki deploymentów i DORA
- **Canis (Demo 6)** - wykorzystuje weryfikacje wymagań i kontekst dokumentacji

## Uruchomienie

Demo jest dostępne pod adresem `/demo7` po uruchomieniu projektu:

```bash
npm run dev
```

Następnie przejdź do:
- http://localhost:3000/demo-selector
- Wybierz "Syzio Pulsar Nova"

## Dane demonstracyjne

Aplikacja zawiera przykładowe dane:
- 4 Objectives
- 5 Key Results
- 5 Epics
- 7 Issues
- 4 Quality Gates
- 7 dni historii DORA metrics

Dane są zapisywane w `localStorage` i można je:
- Eksportować do JSON
- Importować z JSON
- Resetować do wartości domyślnych (refresh strony + clear localStorage)

## Roadmap

### V2 (planowane)
- [ ] Pełny graf traceability z DnD
- [ ] Command Palette (Cmd+K)
- [ ] Integracja z prawdziwymi API (Jira, GitHub, etc.)
- [ ] Alerty Slack/Email
- [ ] Advanced Monte Carlo z rozkładami prawdopodobieństwa
- [ ] WIP heatmap
- [ ] Aging work analysis
- [ ] Team velocity trends
- [ ] Predictive analytics (ML)

## Licencja

Demo aplikacji Syzio - wszystkie prawa zastrzeżone.
