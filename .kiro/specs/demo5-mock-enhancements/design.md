# Design Document - Demo5 Mock Data Enhancement

## Overview

Celem jest rozszerzenie istniejących danych mockowych w komponencie `components/demo5/syzio-dev-monitoring.tsx` o więcej realistycznych pakietów deploymentowych, zadań Jira i commitów Git. Dodatkowo dodamy proste Quick Actions do symulacji operacji na pakietach.

### Główne Cele
- Rozszerzyć tablicę `initialPackages` o 15-20 pakietów z różnorodnymi danymi
- Dodać więcej realistycznych zadań Jira z różnymi typami, priorytetami i statusami
- Dodać więcej commitów Git powiązanych z zadaniami
- Dodać proste Quick Actions do zmiany statusu pakietów

## Architecture

Nie zmieniamy architektury - tylko rozszerzamy istniejące dane mockowe w tym samym pliku.

```
components/demo5/syzio-dev-monitoring.tsx
├── initialPackages (ROZSZERZONE)
│   ├── Więcej pakietów (15-20 total)
│   ├── Różne statusy i środowiska
│   └── Więcej jiraIssues i commits
└── Quick Actions (NOWE)
    ├── Deploy action
    └── Rollback action
```

## Components and Interfaces

### 1. Extended Mock Data Structure

Używamy istniejących interfejsów, tylko dodajemy więcej danych:

```typescript
// Istniejące interfejsy - bez zmian
interface DeploymentPackage { ... }
interface JiraIssue { ... }
interface GitCommit { ... }

// Rozszerzona tablica initialPackages
const initialPackages: DeploymentPackage[] = [
  // Istniejące pakiety (5)
  // + Nowe pakiety (10-15)
];
```

### 2. Quick Actions Component (Prosty)

```typescript
// Dodajemy prosty dropdown menu do każdego pakietu
const QuickActionsButton = ({ pkg }: { pkg: DeploymentPackage }) => {
  const { updatePackageStatus } = useMonitoringStore();
  
  const handleDeploy = () => {
    updatePackageStatus(pkg.id, 'deployed');
  };
  
  const handleRollback = () => {
    updatePackageStatus(pkg.id, 'rollback');
  };
  
  return (
    <DropdownMenu>
      {pkg.status === 'ready' && (
        <DropdownMenuItem onClick={handleDeploy}>
          Deploy
        </DropdownMenuItem>
      )}
      {pkg.status === 'deployed' && (
        <DropdownMenuItem onClick={handleRollback}>
          Rollback
        </DropdownMenuItem>
      )}
    </DropdownMenu>
  );
};
```

## Data Models

### Mock Data Generation Strategy

#### 1. Deployment Packages (15-20 total)

**Różnorodność statusów:**
- draft: 2 pakiety
- ready: 4 pakiety
- deploying: 1 pakiet
- deployed: 8-10 pakietów
- failed: 2 pakiety
- rollback: 1 pakiet

**Różnorodność środowisk:**
- dev: 5 pakietów
- staging: 5 pakietów
- production: 5-10 pakietów

**Różnorodność dat:**
- Ostatnie 7 dni: 3 pakiety
- Ostatnie 30 dni: 7 pakietów
- Ostatnie 90 dni: 5-10 pakietów

**Przykładowe nazwy pakietów:**
- Release R-104, R-105, R-106... (Canis style)
- Release 2.2.0, 2.3.0, 2.4.0... (Semantic versioning)
- Hotfix 2.1.1, 2.1.2... (Hotfixes)

#### 2. Jira Issues (2-6 per package)

**Typy zadań (rozkład):**
- story: 40%
- bug: 30%
- task: 25%
- epic: 5%

**Priorytety (rozkład):**
- highest: 10%
- high: 25%
- medium: 40%
- low: 20%
- lowest: 5%

**Statusy (rozkład):**
- todo: 10%
- in-progress: 20%
- in-review: 15%
- done: 55%

**Przykładowe summaries:**

Stories:
- "Implement payment gateway integration"
- "Add user profile customization"
- "Create admin dashboard"
- "Implement real-time notifications"

Bugs:
- "Fix memory leak in data processing"
- "Resolve login timeout issue"
- "Fix incorrect currency conversion"
- "Resolve race condition in cache"

Tasks:
- "Update dependencies to latest versions"
- "Add monitoring alerts"
- "Optimize database queries"
- "Implement rate limiting"

Epics:
- "Payment system overhaul"
- "Mobile app redesign"
- "Performance optimization initiative"

**Labels (przykłady):**
- Dla stories: feature, ui, ux, integration, api
- Dla bugs: bugfix, critical, hotfix, security
- Dla tasks: maintenance, devops, monitoring, optimization
- Dla epics: epic, initiative, milestone

**Story Points (Fibonacci):**
- 1, 2, 3, 5, 8, 13, 21

**Assignees/Reporters (pula developerów):**
- Jan Kowalski
- Anna Nowak
- Piotr Wiśniewski
- Maria Kowalczyk
- Tomasz Lewandowski
- Katarzyna Wójcik
- Michał Kamiński
- Agnieszka Zielińska

#### 3. Git Commits (3-10 per package)

**Conventional Commit Types:**
- feat: (40%) - nowe funkcje
- fix: (30%) - poprawki błędów
- perf: (10%) - optymalizacje wydajności
- docs: (5%) - dokumentacja
- test: (5%) - testy
- refactor: (5%) - refactoring
- chore: (5%) - maintenance

**Przykładowe commit messages:**
```
feat: add payment gateway integration (SZ-1234)
fix: resolve login timeout issue (SZ-1235)
perf: optimize database queries (SZ-1236)
docs: update API documentation (SZ-1237)
test: add integration tests for payments (SZ-1234)
refactor: simplify authentication flow (SZ-1235)
chore: update dependencies (SZ-1238)
```

**Hash generation:**
- 7 znaków losowych (a-f, 0-9)
- Przykłady: abc123f, def456a, ghi789b

**Timestamps:**
- Chronologiczne w ramach pakietu
- Rozłożone w czasie (co kilka godzin)

#### 4. Deployment Metrics

**buildTime (sekundy):**
- Szybkie: 120-180s
- Średnie: 180-300s
- Wolne: 300-600s

**deployTime (sekundy):**
- Szybkie: 180-240s
- Średnie: 240-360s
- Wolne: 360-600s

**errorRate (procent):**
- Zdrowe: 0-1%
- Ostrzeżenie: 1-5%
- Krytyczne: 5-10%

**successRate (procent):**
- Doskonałe: 99-100%
- Dobre: 95-99%
- Problematyczne: 90-95%

**rollbackCount:**
- Większość: 0
- Niektóre: 1-2
- Problematyczne: 3+

## Mock Data Template

### Package Template

```typescript
{
  id: 'pkg-canis-XXX',
  name: 'R-XXX (Canis)',
  version: 'R-XXX',
  status: 'deployed', // random
  environment: 'production', // random
  linkedIssues: ['SZ-XXXX', 'SZ-YYYY'],
  jiraIssues: [
    {
      id: 'canis-XX',
      key: 'SZ-XXXX',
      summary: 'Implement feature X',
      description: 'Detailed description...',
      type: 'story', // random
      status: 'done', // random
      priority: 'high', // random
      assignee: 'Jan Kowalski', // random from pool
      reporter: 'Anna Nowak', // random from pool
      storyPoints: 8, // random fibonacci
      labels: ['feature', 'backend'], // relevant to type
      createdAt: new Date('2025-XX-XX'),
      updatedAt: new Date('2025-XX-XX')
    },
    // 1-5 more issues...
  ],
  commits: [
    {
      hash: 'abc123f',
      message: 'feat: implement feature X (SZ-XXXX)',
      author: 'Jan Kowalski',
      timestamp: new Date('2025-XX-XXTXX:XX:XXZ'),
      linkedIssues: ['SZ-XXXX']
    },
    // 2-9 more commits...
  ],
  createdAt: new Date('2025-XX-XX'),
  deployedAt: new Date('2025-XX-XXTXX:XX:XXZ'),
  healthStatus: 'healthy', // random
  metrics: {
    buildTime: 195,
    deployTime: 265,
    errorRate: 0.5,
    successRate: 99.5,
    rollbackCount: 0
  },
  createdBy: 'Jan Kowalski' // random from pool
}
```

## Implementation Strategy

### Phase 1: Generate Mock Data

1. **Create data generation helpers**
   ```typescript
   const generateId = (prefix: string, num: number) => `${prefix}-${num}`;
   const generateHash = () => Math.random().toString(36).substring(2, 9);
   const randomElement = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
   const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
   ```

2. **Create data pools**
   ```typescript
   const developers = ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski', ...];
   const issueTypes = ['story', 'bug', 'task', 'epic'];
   const priorities = ['highest', 'high', 'medium', 'low', 'lowest'];
   const statuses = ['todo', 'in-progress', 'in-review', 'done'];
   const environments = ['dev', 'staging', 'production'];
   const packageStatuses = ['draft', 'ready', 'deploying', 'deployed', 'failed', 'rollback'];
   ```

3. **Generate issues**
   ```typescript
   const generateIssue = (id: number, type: string): JiraIssue => ({
     id: `canis-${id}`,
     key: `SZ-${1200 + id}`,
     summary: generateSummary(type),
     description: generateDescription(type),
     type,
     status: randomElement(statuses),
     priority: randomElement(priorities),
     assignee: randomElement(developers),
     reporter: randomElement(developers),
     storyPoints: randomElement([1, 2, 3, 5, 8, 13, 21]),
     labels: generateLabels(type),
     createdAt: randomDate(new Date('2025-07-01'), new Date('2025-10-13')),
     updatedAt: randomDate(new Date('2025-09-01'), new Date('2025-10-13'))
   });
   ```

4. **Generate commits**
   ```typescript
   const generateCommit = (issue: JiraIssue): GitCommit => ({
     hash: generateHash(),
     message: `${randomElement(['feat', 'fix', 'perf', 'docs'])}: ${issue.summary.toLowerCase()} (${issue.key})`,
     author: issue.assignee,
     timestamp: randomDate(issue.createdAt, issue.updatedAt),
     linkedIssues: [issue.key]
   });
   ```

5. **Generate packages**
   ```typescript
   const generatePackage = (id: number): DeploymentPackage => {
     const issues = Array.from({ length: 2 + Math.floor(Math.random() * 5) }, (_, i) => 
       generateIssue(id * 10 + i, randomElement(issueTypes))
     );
     const commits = issues.flatMap(issue => 
       Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => generateCommit(issue))
     );
     
     return {
       id: generateId('pkg-canis', 100 + id),
       name: `R-${100 + id} (Canis)`,
       version: `R-${100 + id}`,
       status: randomElement(packageStatuses),
       environment: randomElement(environments),
       linkedIssues: issues.map(i => i.key),
       jiraIssues: issues,
       commits,
       createdAt: randomDate(new Date('2025-07-01'), new Date('2025-10-13')),
       deployedAt: randomDate(new Date('2025-09-01'), new Date('2025-10-13')),
       healthStatus: randomElement(['healthy', 'warning', 'critical']),
       metrics: {
         buildTime: 120 + Math.floor(Math.random() * 300),
         deployTime: 180 + Math.floor(Math.random() * 300),
         errorRate: Math.random() * 5,
         successRate: 95 + Math.random() * 5,
         rollbackCount: Math.floor(Math.random() * 3)
       },
       createdBy: randomElement(developers)
     };
   };
   ```

### Phase 2: Add Quick Actions

1. **Add action buttons to package cards**
   - Add "..." button to each package card
   - Show dropdown menu on click

2. **Implement action handlers**
   - Deploy: change status from 'ready' to 'deployed'
   - Rollback: change status from 'deployed' to 'rollback'
   - Update timestamps and metrics

3. **Add visual feedback**
   - Show toast notification on action
   - Update UI immediately

## Testing Strategy

### Manual Testing

1. **Verify data variety**
   - Check that packages have different statuses
   - Check that issues have different types and priorities
   - Check that commits are linked to issues

2. **Test Quick Actions**
   - Click Deploy on ready package
   - Verify status changes to deployed
   - Click Rollback on deployed package
   - Verify status changes to rollback

3. **Visual inspection**
   - Check that all data displays correctly
   - Check that dates are realistic
   - Check that metrics are reasonable

## UI/UX Considerations

### Quick Actions
- Simple dropdown menu
- Context-aware actions (based on status)
- Immediate visual feedback
- No confirmation dialogs (simple demo)

### Data Display
- All existing UI components work with new data
- No changes to layout or styling
- More data to scroll through and explore

## Performance Considerations

- 15-20 packages is manageable for client-side rendering
- No pagination needed
- No performance optimizations required

## Future Enhancements

If needed later:
- Add more complex actions (schedule, cancel, etc.)
- Add data generation UI
- Add filtering and search
- Add analytics dashboard
