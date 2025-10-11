# Przewodnik integracji Demo 5 z Demo 1

## Przegląd

Ten dokument opisuje jak zintegrować moduł Dev Monitoring (Demo 5) z główną aplikacją (Demo 1).

## Opcje integracji

### Opcja 1: Jako nowa zakładka w sidebar (Zalecane)

#### Krok 1: Dodaj route w Demo 1

Utwórz nowy plik: `app/demo1/deployments/page.tsx`

```typescript
'use client';

import { SyzioDevMonitoring } from '@/components/demo5';

export default function DeploymentsPage() {
  return <SyzioDevMonitoring />;
}
```

#### Krok 2: Dodaj link w sidebar navigation

W pliku `components/demo/sidebar-navigation.tsx` dodaj nową pozycję:

```typescript
import { Package } from 'lucide-react';

const navigationItems = [
  // ... existing items
  {
    id: 'deployments',
    label: 'Deployments',
    icon: Package,
    href: '/demo1/deployments',
    badge: '3' // opcjonalnie - liczba pending deployments
  }
];
```

#### Krok 3: Dodaj do mock data (opcjonalnie)

W `lib/demo/mock-data.ts` możesz dodać licznik deploymentów:

```typescript
export const deploymentStats = {
  pending: 3,
  deployed: 12,
  failed: 1
};
```

---

### Opcja 2: Jako modal/drawer overlay

#### Krok 1: Utwórz komponent wrapper

Utwórz: `components/demo/deployment-modal.tsx`

```typescript
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SyzioDevMonitoring } from '@/components/demo5';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeploymentModal({ isOpen, onClose }: DeploymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-background rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Deployment Monitoring</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-auto">
          <SyzioDevMonitoring />
        </div>
      </div>
    </div>
  );
}
```

#### Krok 2: Dodaj przycisk w header/toolbar

```typescript
'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { DeploymentModal } from './deployment-modal';

export function AppHeader() {
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);

  return (
    <>
      <header>
        {/* ... existing header content */}
        <button
          onClick={() => setIsDeploymentOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted"
        >
          <Package className="w-5 h-5" />
          Deployments
        </button>
      </header>

      <DeploymentModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
      />
    </>
  );
}
```

---

### Opcja 3: Jako embedded widget w dashboard

#### Krok 1: Utwórz mini-widget

Utwórz: `components/demo/deployment-widget.tsx`

```typescript
'use client';

import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DeploymentWidget() {
  // Możesz użyć useMonitoringStore z demo5 lub własnych danych
  const stats = {
    pending: 3,
    deployed: 12,
    failed: 1
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Deployments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-2xl font-bold">{stats.pending}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Deployed</span>
            <span className="text-2xl font-bold text-green-600">{stats.deployed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Failed</span>
            <span className="text-2xl font-bold text-red-600">{stats.failed}</span>
          </div>
          <Link
            href="/demo1/deployments"
            className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mt-4"
          >
            View All Deployments
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Krok 2: Dodaj do dashboard

W `components/demo/personal-dashboard.tsx`:

```typescript
import { DeploymentWidget } from './deployment-widget';

export function PersonalDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* ... existing widgets */}
      <DeploymentWidget />
    </div>
  );
}
```

---

## Współdzielenie danych między Demo 1 i Demo 5

### Opcja A: Shared Context Provider

Utwórz: `lib/shared/deployment-context.tsx`

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { DeploymentPackage } from '@/types/deployment';

interface DeploymentContextType {
  packages: DeploymentPackage[];
  addPackage: (pkg: DeploymentPackage) => void;
  updatePackage: (id: string, updates: Partial<DeploymentPackage>) => void;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export function DeploymentProvider({ children }: { children: ReactNode }) {
  // Implementacja z demo5/syzio-dev-monitoring.tsx
  // ...

  return (
    <DeploymentContext.Provider value={{ packages, addPackage, updatePackage }}>
      {children}
    </DeploymentContext.Provider>
  );
}

export function useDeployments() {
  const context = useContext(DeploymentContext);
  if (!context) throw new Error('useDeployments must be used within DeploymentProvider');
  return context;
}
```

Następnie owinąć Demo 1 w provider:

```typescript
// app/demo1/layout.tsx
import { DeploymentProvider } from '@/lib/shared/deployment-context';

export default function Demo1Layout({ children }) {
  return (
    <DeploymentProvider>
      {children}
    </DeploymentProvider>
  );
}
```

### Opcja B: Zustand Store (dla większych aplikacji)

```bash
npm install zustand
```

Utwórz: `lib/stores/deployment-store.ts`

```typescript
import { create } from 'zustand';
import { DeploymentPackage } from '@/types/deployment';

interface DeploymentStore {
  packages: DeploymentPackage[];
  addPackage: (pkg: DeploymentPackage) => void;
  updatePackage: (id: string, updates: Partial<DeploymentPackage>) => void;
  removePackage: (id: string) => void;
}

export const useDeploymentStore = create<DeploymentStore>((set) => ({
  packages: [],
  addPackage: (pkg) => set((state) => ({ packages: [...state.packages, pkg] })),
  updatePackage: (id, updates) =>
    set((state) => ({
      packages: state.packages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePackage: (id) =>
    set((state) => ({ packages: state.packages.filter((p) => p.id !== id) })),
}));
```

Użycie w komponentach:

```typescript
import { useDeploymentStore } from '@/lib/stores/deployment-store';

function MyComponent() {
  const { packages, addPackage } = useDeploymentStore();
  // ...
}
```

---

## Integracja z istniejącymi funkcjami Demo 1

### 1. Linkowanie Issues z Deployments

W `components/demo/issue-card.tsx` dodaj informację o deploymencie:

```typescript
import { useDeployments } from '@/lib/shared/deployment-context';

export function IssueCard({ issue }) {
  const { packages } = useDeployments();
  
  const relatedDeployment = packages.find(pkg =>
    pkg.linkedIssues.includes(issue.key)
  );

  return (
    <div className="issue-card">
      {/* ... existing content */}
      {relatedDeployment && (
        <div className="mt-2 text-xs text-muted-foreground">
          📦 Included in: {relatedDeployment.name}
        </div>
      )}
    </div>
  );
}
```

### 2. Deployment status w Sprint view

W `components/demo/sprints-view.tsx`:

```typescript
export function SprintsView() {
  const { packages } = useDeployments();
  
  const sprintDeployments = packages.filter(pkg =>
    pkg.linkedIssues.some(issueKey => 
      currentSprint.issues.includes(issueKey)
    )
  );

  return (
    <div>
      {/* ... existing sprint content */}
      <div className="mt-4">
        <h3>Deployments ({sprintDeployments.length})</h3>
        {sprintDeployments.map(pkg => (
          <DeploymentCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Notifications dla deployment events

Utwórz: `lib/notifications/deployment-notifications.ts`

```typescript
export function notifyDeploymentSuccess(packageName: string) {
  // Integracja z istniejącym systemem notyfikacji Demo 1
  showNotification({
    title: 'Deployment Successful',
    message: `${packageName} has been deployed successfully`,
    type: 'success',
    icon: '🚀'
  });
}

export function notifyDeploymentFailed(packageName: string, error: string) {
  showNotification({
    title: 'Deployment Failed',
    message: `${packageName} deployment failed: ${error}`,
    type: 'error',
    icon: '❌'
  });
}
```

---

## Typy TypeScript

Utwórz: `types/deployment.ts`

```typescript
export interface DeploymentPackage {
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

export interface JiraIssue {
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

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: Date;
  linkedIssues: string[];
}

export interface DeploymentMetrics {
  buildTime: number;
  deployTime: number;
  errorRate: number;
  successRate: number;
  rollbackCount: number;
}

export interface Environment {
  name: 'dev' | 'staging' | 'production';
  url: string;
  lastDeployment?: DeploymentPackage;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
}
```

---

## Testowanie integracji

### 1. Sprawdź routing
```bash
# Uruchom dev server
npm run dev

# Sprawdź dostępność:
# - http://localhost:3000/demo5 (standalone)
# - http://localhost:3000/demo1/deployments (zintegrowane)
```

### 2. Sprawdź współdzielenie danych
- Utwórz deployment w Demo 5
- Sprawdź czy pojawia się w Demo 1 (jeśli używasz shared context)
- Sprawdź linkowanie z issues

### 3. Sprawdź theme consistency
- Przełącz dark/light mode w Demo 1
- Sprawdź czy Demo 5 używa tego samego theme

---

## Najlepsze praktyki

1. **Używaj shared types** - Trzymaj typy w `types/` dla łatwego współdzielenia
2. **Centralizuj state** - Użyj Context API lub Zustand dla współdzielonego stanu
3. **Lazy loading** - Ładuj Demo 5 komponent tylko gdy jest potrzebny
4. **Error boundaries** - Owinąć Demo 5 w error boundary
5. **Loading states** - Dodaj loading indicators podczas ładowania danych

---

## Troubleshooting

### Problem: Styles nie działają
**Rozwiązanie**: Upewnij się, że `demo5-globals.css` jest importowany w layout

### Problem: Context undefined
**Rozwiązanie**: Sprawdź czy komponent jest owinięty w odpowiedni Provider

### Problem: Routing nie działa
**Rozwiązanie**: Sprawdź strukturę folderów w `app/` i nazwy plików

---

## Następne kroki

Po podstawowej integracji możesz:
1. Dodać prawdziwe API endpoints
2. Zintegrować z CI/CD pipeline
3. Dodać real-time updates (WebSockets)
4. Rozszerzyć analytics i metryki
5. Dodać role-based access control
