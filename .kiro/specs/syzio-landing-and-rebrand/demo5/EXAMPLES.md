# Demo 5 - Przykłady użycia

## Podstawowe użycie

### 1. Standalone Page
```typescript
// app/demo5/page.tsx
'use client';

import { SyzioDevMonitoring } from '@/components/demo5';

export default function Demo5Page() {
  return <SyzioDevMonitoring />;
}
```

---

## Integracja z Demo 1

### Opcja 1: Jako zakładka w sidebar

#### Krok 1: Dodaj route
```typescript
// app/demo1/deployments/page.tsx
'use client';

import { SyzioDevMonitoring } from '@/components/demo5';

export default function DeploymentsPage() {
  return (
    <div className="p-6">
      <SyzioDevMonitoring />
    </div>
  );
}
```

#### Krok 2: Dodaj do navigation
```typescript
// components/demo/sidebar-navigation.tsx
import { Package } from 'lucide-react';

const navigationItems = [
  // ... existing items
  {
    id: 'deployments',
    label: 'Deployments',
    icon: Package,
    href: '/demo1/deployments',
    badge: '3' // pending deployments count
  }
];
```

### Opcja 2: Jako modal

```typescript
// components/demo/deployment-modal.tsx
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Deployment Monitoring</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-[calc(100%-4rem)] overflow-auto">
          <SyzioDevMonitoring />
        </div>
      </div>
    </div>
  );
}
```

Użycie:
```typescript
// components/demo/app-header.tsx
'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { DeploymentModal } from './deployment-modal';

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="border-b">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted"
        >
          <Package className="w-5 h-5" />
          Deployments
        </button>
      </header>

      <DeploymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

### Opcja 3: Jako widget w dashboard

```typescript
// components/demo/deployment-widget.tsx
'use client';

import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DeploymentWidget() {
  // Mock data - replace with real data from context/store
  const stats = {
    pending: 3,
    deployed: 12,
    failed: 1,
    lastDeployment: {
      name: 'Release 2.1.0',
      environment: 'staging',
      time: '2 hours ago'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Deployments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.deployed}</div>
            <div className="text-xs text-muted-foreground">Deployed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
        </div>

        {/* Last Deployment */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Last Deployment</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{stats.lastDeployment.name}</div>
              <div className="text-xs text-muted-foreground">
                {stats.lastDeployment.environment} • {stats.lastDeployment.time}
              </div>
            </div>
            <Badge variant="success">Deployed</Badge>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/demo1/deployments"
          className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View All Deployments
        </Link>
      </CardContent>
    </Card>
  );
}
```

Użycie w dashboard:
```typescript
// components/demo/personal-dashboard.tsx
import { DeploymentWidget } from './deployment-widget';

export function PersonalDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Existing widgets */}
      <TeamStatsWidget />
      <SprintProgressWidget />
      
      {/* New deployment widget */}
      <DeploymentWidget />
    </div>
  );
}
```

---

## Współdzielenie danych

### Opcja A: Context API

#### 1. Utwórz shared context
```typescript
// lib/shared/deployment-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DeploymentPackage {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'ready' | 'deploying' | 'deployed' | 'failed';
  environment: 'dev' | 'staging' | 'production';
  linkedIssues: string[];
}

interface DeploymentContextType {
  packages: DeploymentPackage[];
  addPackage: (pkg: DeploymentPackage) => void;
  updatePackage: (id: string, updates: Partial<DeploymentPackage>) => void;
  getPackagesByIssue: (issueKey: string) => DeploymentPackage[];
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export function DeploymentProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<DeploymentPackage[]>([]);

  const addPackage = (pkg: DeploymentPackage) => {
    setPackages(prev => [...prev, pkg]);
  };

  const updatePackage = (id: string, updates: Partial<DeploymentPackage>) => {
    setPackages(prev =>
      prev.map(pkg => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    );
  };

  const getPackagesByIssue = (issueKey: string) => {
    return packages.filter(pkg => pkg.linkedIssues.includes(issueKey));
  };

  return (
    <DeploymentContext.Provider
      value={{ packages, addPackage, updatePackage, getPackagesByIssue }}
    >
      {children}
    </DeploymentContext.Provider>
  );
}

export function useDeployments() {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error('useDeployments must be used within DeploymentProvider');
  }
  return context;
}
```

#### 2. Owinąć aplikację w provider
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

#### 3. Użyj w komponentach
```typescript
// components/demo/issue-card.tsx
import { useDeployments } from '@/lib/shared/deployment-context';

export function IssueCard({ issue }) {
  const { getPackagesByIssue } = useDeployments();
  const relatedPackages = getPackagesByIssue(issue.key);

  return (
    <div className="issue-card">
      <h3>{issue.summary}</h3>
      
      {relatedPackages.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">
            Included in {relatedPackages.length} deployment(s):
          </div>
          {relatedPackages.map(pkg => (
            <Badge key={pkg.id} variant="secondary" className="mr-1">
              {pkg.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Opcja B: Zustand Store

#### 1. Zainstaluj Zustand
```bash
npm install zustand
```

#### 2. Utwórz store
```typescript
// lib/stores/deployment-store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DeploymentPackage {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'ready' | 'deploying' | 'deployed' | 'failed';
  environment: 'dev' | 'staging' | 'production';
  linkedIssues: string[];
}

interface DeploymentStore {
  packages: DeploymentPackage[];
  addPackage: (pkg: DeploymentPackage) => void;
  updatePackage: (id: string, updates: Partial<DeploymentPackage>) => void;
  removePackage: (id: string) => void;
  getPackagesByIssue: (issueKey: string) => DeploymentPackage[];
}

export const useDeploymentStore = create<DeploymentStore>()(
  devtools(
    persist(
      (set, get) => ({
        packages: [],
        
        addPackage: (pkg) =>
          set((state) => ({ packages: [...state.packages, pkg] })),
        
        updatePackage: (id, updates) =>
          set((state) => ({
            packages: state.packages.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          })),
        
        removePackage: (id) =>
          set((state) => ({
            packages: state.packages.filter((p) => p.id !== id),
          })),
        
        getPackagesByIssue: (issueKey) => {
          return get().packages.filter((pkg) =>
            pkg.linkedIssues.includes(issueKey)
          );
        },
      }),
      {
        name: 'deployment-storage',
      }
    )
  )
);
```

#### 3. Użyj w komponentach
```typescript
// components/demo/issue-card.tsx
import { useDeploymentStore } from '@/lib/stores/deployment-store';

export function IssueCard({ issue }) {
  const getPackagesByIssue = useDeploymentStore((state) => state.getPackagesByIssue);
  const relatedPackages = getPackagesByIssue(issue.key);

  return (
    <div className="issue-card">
      <h3>{issue.summary}</h3>
      
      {relatedPackages.length > 0 && (
        <div className="mt-2">
          <Badge variant="secondary">
            📦 {relatedPackages.length} deployment(s)
          </Badge>
        </div>
      )}
    </div>
  );
}
```

---

## Linkowanie z istniejącymi features

### 1. Issue Card z deployment info

```typescript
// components/demo/issue-card-enhanced.tsx
import { Package } from 'lucide-react';
import { useDeployments } from '@/lib/shared/deployment-context';
import { Badge } from '@/components/ui/badge';

export function IssueCardEnhanced({ issue }) {
  const { getPackagesByIssue } = useDeployments();
  const deployments = getPackagesByIssue(issue.key);
  const latestDeployment = deployments[0];

  return (
    <div className="border rounded-lg p-4">
      {/* Issue header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-mono text-sm">{issue.key}</span>
          <h3 className="font-semibold">{issue.summary}</h3>
        </div>
        <Badge>{issue.status}</Badge>
      </div>

      {/* Deployment info */}
      {latestDeployment && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Deployment:</span>
            <Badge variant="secondary">{latestDeployment.name}</Badge>
            <Badge
              variant={
                latestDeployment.status === 'deployed'
                  ? 'success'
                  : latestDeployment.status === 'failed'
                  ? 'error'
                  : 'warning'
              }
            >
              {latestDeployment.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Environment: {latestDeployment.environment}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. Sprint view z deployment tracking

```typescript
// components/demo/sprint-with-deployments.tsx
import { useDeployments } from '@/lib/shared/deployment-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SprintWithDeployments({ sprint }) {
  const { packages } = useDeployments();
  
  // Find deployments that include issues from this sprint
  const sprintDeployments = packages.filter(pkg =>
    pkg.linkedIssues.some(issueKey =>
      sprint.issues.some(issue => issue.key === issueKey)
    )
  );

  return (
    <div className="space-y-6">
      {/* Sprint info */}
      <Card>
        <CardHeader>
          <CardTitle>{sprint.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Issues</div>
              <div className="text-2xl font-bold">{sprint.issues.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {sprint.issues.filter(i => i.status === 'done').length}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Deployments</div>
              <div className="text-2xl font-bold text-blue-600">
                {sprintDeployments.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployments */}
      {sprintDeployments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sprint Deployments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintDeployments.map(pkg => (
              <div
                key={pkg.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{pkg.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.linkedIssues.length} issues • {pkg.environment}
                  </div>
                </div>
                <Badge
                  variant={
                    pkg.status === 'deployed'
                      ? 'success'
                      : pkg.status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {pkg.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### 3. Team view z deployment stats

```typescript
// components/demo/team-deployment-stats.tsx
import { useDeployments } from '@/lib/shared/deployment-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';

export function TeamDeploymentStats({ team }) {
  const { packages } = useDeployments();
  
  // Filter packages created by team members
  const teamPackages = packages.filter(pkg =>
    team.members.some(member => pkg.createdBy === member.email)
  );

  const stats = {
    total: teamPackages.length,
    deployed: teamPackages.filter(p => p.status === 'deployed').length,
    failed: teamPackages.filter(p => p.status === 'failed').length,
    pending: teamPackages.filter(p => p.status === 'ready').length,
  };

  const successRate = stats.total > 0
    ? Math.round((stats.deployed / stats.total) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Deployment Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Deployments</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Custom Hooks

### useDeploymentStatus

```typescript
// hooks/use-deployment-status.ts
import { useDeployments } from '@/lib/shared/deployment-context';

export function useDeploymentStatus(issueKey: string) {
  const { getPackagesByIssue } = useDeployments();
  const packages = getPackagesByIssue(issueKey);
  
  const latestPackage = packages[0];
  const isDeployed = latestPackage?.status === 'deployed';
  const isPending = latestPackage?.status === 'ready';
  const isFailed = latestPackage?.status === 'failed';
  
  return {
    hasDeployment: packages.length > 0,
    latestPackage,
    isDeployed,
    isPending,
    isFailed,
    deploymentCount: packages.length,
  };
}
```

Użycie:
```typescript
function IssueCard({ issue }) {
  const deployment = useDeploymentStatus(issue.key);
  
  return (
    <div>
      <h3>{issue.summary}</h3>
      {deployment.hasDeployment && (
        <Badge variant={deployment.isDeployed ? 'success' : 'warning'}>
          {deployment.latestPackage.name}
        </Badge>
      )}
    </div>
  );
}
```

### useDeploymentMetrics

```typescript
// hooks/use-deployment-metrics.ts
import { useDeployments } from '@/lib/shared/deployment-context';

export function useDeploymentMetrics() {
  const { packages } = useDeployments();
  
  const total = packages.length;
  const deployed = packages.filter(p => p.status === 'deployed').length;
  const failed = packages.filter(p => p.status === 'failed').length;
  const pending = packages.filter(p => p.status === 'ready').length;
  
  const successRate = total > 0 ? Math.round((deployed / total) * 100) : 0;
  
  const byEnvironment = {
    dev: packages.filter(p => p.environment === 'dev').length,
    staging: packages.filter(p => p.environment === 'staging').length,
    production: packages.filter(p => p.environment === 'production').length,
  };
  
  return {
    total,
    deployed,
    failed,
    pending,
    successRate,
    byEnvironment,
  };
}
```

---

## Notifications

### Toast notifications dla deployment events

```typescript
// lib/notifications/deployment-notifications.ts
import { toast } from 'sonner'; // lub inny toast library

export function notifyDeploymentStarted(packageName: string) {
  toast.info('Deployment Started', {
    description: `${packageName} is being deployed...`,
    icon: '🚀',
  });
}

export function notifyDeploymentSuccess(packageName: string, environment: string) {
  toast.success('Deployment Successful', {
    description: `${packageName} has been deployed to ${environment}`,
    icon: '✅',
  });
}

export function notifyDeploymentFailed(packageName: string, error: string) {
  toast.error('Deployment Failed', {
    description: `${packageName}: ${error}`,
    icon: '❌',
    action: {
      label: 'View Details',
      onClick: () => {
        // Navigate to deployment details
      },
    },
  });
}
```

Użycie:
```typescript
import { notifyDeploymentSuccess } from '@/lib/notifications/deployment-notifications';

function DeployButton({ packageId }) {
  const { updatePackage } = useDeployments();
  
  const handleDeploy = async () => {
    try {
      await deployPackage(packageId);
      updatePackage(packageId, { status: 'deployed' });
      notifyDeploymentSuccess('Release 2.1.0', 'production');
    } catch (error) {
      notifyDeploymentFailed('Release 2.1.0', error.message);
    }
  };
  
  return <button onClick={handleDeploy}>Deploy</button>;
}
```

---

## Testing

### Unit test example

```typescript
// __tests__/deployment-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDeploymentStore } from '@/lib/stores/deployment-store';

describe('DeploymentStore', () => {
  it('should add a package', () => {
    const { result } = renderHook(() => useDeploymentStore());
    
    act(() => {
      result.current.addPackage({
        id: 'pkg-001',
        name: 'Release 2.1.0',
        version: '2.1.0',
        status: 'draft',
        environment: 'staging',
        linkedIssues: ['TSK-042'],
      });
    });
    
    expect(result.current.packages).toHaveLength(1);
    expect(result.current.packages[0].name).toBe('Release 2.1.0');
  });
  
  it('should update a package', () => {
    const { result } = renderHook(() => useDeploymentStore());
    
    act(() => {
      result.current.addPackage({
        id: 'pkg-001',
        name: 'Release 2.1.0',
        version: '2.1.0',
        status: 'draft',
        environment: 'staging',
        linkedIssues: [],
      });
      
      result.current.updatePackage('pkg-001', { status: 'deployed' });
    });
    
    expect(result.current.packages[0].status).toBe('deployed');
  });
});
```

---

## Best Practices

### 1. Type Safety
Zawsze używaj TypeScript types:
```typescript
import type { DeploymentPackage } from '@/types/deployment';
```

### 2. Error Handling
Zawsze obsługuj błędy:
```typescript
try {
  await deployPackage(id);
} catch (error) {
  console.error('Deployment failed:', error);
  notifyDeploymentFailed(packageName, error.message);
}
```

### 3. Loading States
Pokazuj loading states:
```typescript
const [isDeploying, setIsDeploying] = useState(false);

const handleDeploy = async () => {
  setIsDeploying(true);
  try {
    await deployPackage(id);
  } finally {
    setIsDeploying(false);
  }
};
```

### 4. Optimistic Updates
Używaj optimistic updates dla lepszego UX:
```typescript
const handleDeploy = async (id: string) => {
  // Optimistic update
  updatePackage(id, { status: 'deploying' });
  
  try {
    await deployPackage(id);
    updatePackage(id, { status: 'deployed' });
  } catch (error) {
    // Revert on error
    updatePackage(id, { status: 'failed' });
  }
};
```

---

## Więcej przykładów

Zobacz pełną dokumentację:
- `INTEGRATION_GUIDE.md` - Szczegółowy przewodnik integracji
- `API_EXAMPLES.md` - Przykłady API
- `README.md` - Kompletna dokumentacja
