# Demo 5 - Dev Monitoring & Deployment Tracking

## Przegląd

Demo 5 to oddzielny moduł monitoringu deploymentów, który można zintegrować z główną aplikacją (Demo 1). Oferuje kompleksowe śledzenie release'ów, integrację z JIRA i Git, oraz monitoring środowisk.

## Struktura projektu

```
demo5/
├── app/
│   ├── (demo5_root)/
│   │   ├── demo5/
│   │   │   └── page.tsx          # Główna strona demo5
│   │   └── layout.tsx             # Layout z importem stylów
│   └── demo5-globals.css          # Style globalne (Tailwind)
│
└── components/
    └── demo5/
        ├── syzio-dev-monitoring.tsx  # Główny komponent
        └── index.ts                   # Export modułu
```

## Funkcjonalności

### 1. Deployment Packages
- Tworzenie i zarządzanie pakietami deploymentowymi
- Statusy: draft, ready, deploying, deployed, failed, rollback
- Linkowanie z JIRA issues i Git commits
- Metryki deploymentów (build time, deploy time, error rate)

### 2. Integracja JIRA
- Pełne informacje o issue (type, status, priority)
- Story points i labels
- Assignee i reporter
- Szczegółowe opisy i timeline

### 3. Integracja Git
- Historia commitów z hashami
- Linkowanie commitów z JIRA issues
- Informacje o autorach i timestampach
- Wiadomości commitów

### 4. Multi-Environment Monitoring
- Monitoring środowisk: dev, staging, production
- Status środowisk (online, offline, degraded)
- Uptime tracking
- Health status

### 5. Dashboard & Analytics
- Przegląd wszystkich deploymentów
- Statystyki i metryki
- Filtry i wyszukiwanie
- Szczegółowe widoki pakietów

## Technologie

- **React 18** z hooks (useState, useContext)
- **TypeScript** - pełne typowanie
- **Tailwind CSS** - styling
- **Lucide React** - ikony
- **Context API** - zarządzanie stanem
- **Dark/Light Mode** - przełączanie motywów

## Komponenty

### ThemeProvider
Zarządza motywem aplikacji (dark/light).

### MonitoringProvider
Główny store z danymi o deploymentach i środowiskach.

### UI Components (shadcn-style)
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Badge (z wariantami: success, warning, error, secondary)
- Button (z wariantami: default, outline, secondary, ghost)
- StatusBadge, IssueTypeBadge, PriorityBadge, IssueStatusBadge
- Separator

### Views
- **Dashboard** - przegląd wszystkich deploymentów
- **PackageDetailView** - szczegóły pojedynczego pakietu
- **EnvironmentsView** - monitoring środowisk

## Integracja z Demo 1

Demo 5 jest zaprojektowane jako moduł, który można łatwo zintegrować z główną aplikacją:

### Opcja 1: Jako osobna zakładka w sidebar
```typescript
// W demo1 sidebar navigation
{
  id: 'deployments',
  label: 'Deployments',
  icon: Package,
  href: '/demo1/deployments'
}
```

### Opcja 2: Jako modal/drawer
```typescript
// Otwieranie jako overlay
<DeploymentMonitoring />
```

### Opcja 3: Jako standalone route
```typescript
// Dostęp przez /demo5
// Już zaimplementowane
```

## Dane mockowe

Aplikacja zawiera przykładowe dane:
- 3 deployment packages z różnymi statusami
- 9 JIRA issues (różne typy, priorytety, statusy)
- 3 środowiska (dev, staging, production)
- Committy Git z linkami do issues

## Uruchomienie

Demo 5 jest dostępne pod adresem:
```
http://localhost:3000/demo5
```

Lub przez selektor demo:
```
http://localhost:3000/demo-selector
```

## Dalszy rozwój

### Planowane funkcjonalności:
1. **Prawdziwa integracja z JIRA API**
   - Pobieranie issues z JIRA
   - Synchronizacja statusów
   - Webhooks dla aktualizacji

2. **Integracja z Git**
   - Połączenie z GitHub/GitLab API
   - Automatyczne wykrywanie commitów
   - Pull requests tracking

3. **CI/CD Integration**
   - Jenkins/GitHub Actions/GitLab CI
   - Automatyczne tworzenie pakietów
   - Pipeline visualization

4. **Notifications**
   - Email/Slack powiadomienia
   - Alerty o failed deployments
   - Scheduled deployment reminders

5. **Advanced Analytics**
   - Deployment frequency metrics
   - Lead time tracking
   - DORA metrics
   - Custom dashboards

6. **Rollback Management**
   - One-click rollback
   - Rollback history
   - Automated rollback triggers

## Struktura danych

### DeploymentPackage
```typescript
interface DeploymentPackage {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'ready' | 'deploying' | 'deployed' | 'failed' | 'rollback';
  environment: 'dev' | 'staging' | 'production';
  linkedIssues: string[];
  jiraIssues: JiraIssue[];
  commits: GitCommit[];
  createdAt: Date;
  scheduledAt?: Date;
  deployedAt?: Date;
  healthStatus: 'healthy' | 'warning' | 'critical';
  metrics?: DeploymentMetrics;
  createdBy: string;
}
```

### JiraIssue
```typescript
interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  type: 'story' | 'bug' | 'task' | 'epic';
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  assignee: string;
  reporter: string;
  storyPoints?: number;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### GitCommit
```typescript
interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: Date;
  linkedIssues: string[];
}
```

## Styling

Demo 5 używa własnego pliku stylów `demo5-globals.css` z pełną paletą kolorów dla dark/light mode, zgodną z shadcn/ui design system.

## Status

✅ **Gotowe do użycia**
- Pełna funkcjonalność UI
- Mock data
- Dark/Light mode
- Responsive design
- TypeScript typing

🚧 **W planach**
- Prawdziwe API integrations
- Backend endpoints
- Database persistence
- Real-time updates
