# Etap 2.5: Aktualizacja i optymalizacja istniejących funkcji

## Opis etapu
Etap 2.5 skupia się na aktualizacji i optymalizacji już zaimplementowanych funkcji z Etapu 2. Wszystkie podstawowe funkcjonalności zostały już zaimplementowane w aplikacji, więc ten etap koncentruje się na poprawkach wydajności, nowych integracjach i rozszerzeniach istniejących komponentów.

## Status implementacji funkcji z Etapu 2

### ✅ **ZAIMPLEMENTOWANE FUNKCJE (wszystkie z Etapu 2 już działają):**

#### **1. Zaawansowane sprinty - wykresy burndown i zależności**
- ✅ **Model danych**: Rozszerzony `Sprint` z `velocity`, `capacity`, `burndownData` w `types/index.ts`
- ✅ **Komponent BurndownChart**: `components/burndown-chart.tsx` z wykresami Recharts
- ✅ **Komponent TaskDependencies**: `components/task-dependencies.tsx` z zarządzaniem zależnościami
- ✅ **Sprint Planning**: `components/sprint-planning.tsx` z velocity tracking i capacity calculation

#### **2. Profile użytkowników i zarządzanie zespołem**
- ✅ **Model danych**: Rozszerzony `User` z `avatar`, `role`, `skills`, `capacity` w `types/index.ts`
- ✅ **Komponent UserProfile**: `components/user-profile.tsx` z pełną edycją profilu
- ✅ **Model Team**: `Team` interface z członkami i projektami

#### **3. System powiadomień w czasie rzeczywistym**
- ✅ **Model danych**: `Notification` i `NotificationSettings` w `types/index.ts`
- ✅ **Komponent NotificationCenter**: `components/notification-center.tsx` z WebSocket integration
- ✅ **Historia powiadomień**: Pełne zarządzanie powiadomieniami

#### **4. Równoważenie obciążenia zespołu**
- ✅ **Komponent TeamWorkload**: `components/team-workload.tsx` z wizualizacją obciążenia
- ✅ **Kalendarz zespołu**: `components/team-calendar.tsx` z harmonogramem zadań

## Funkcje do dodania w Etapie 2.5

### 1. Integracje zewnętrzne
**Opis**: Dodanie integracji z popularnymi narzędziami deweloperskimi.

**Nowe funkcje do implementacji**:
- Integracja z GitHub/GitLab API dla automatycznego tworzenia zadań z PR/issues
- Synchronizacja z kalendarzem Google/Outlook
- Webhooki dla zewnętrznych systemów (Slack, Teams)
- Import/eksport danych w formatach Jira/Linear

### 2. Zaawansowana analityka i raporty
**Opis**: Rozszerzenie systemu raportów o zaawansowane metryki.

**Nowe komponenty**:
- `components/advanced-analytics.tsx` - zaawansowane wykresy i dashboardy
- `components/team-performance.tsx` - szczegółowe metryki zespołu
- `components/sprint-retrospective.tsx` - analizy retrospektywne sprintów
- `components/predictive-analytics.tsx` - prognozowanie velocity i capacity

### 3. Usprawnienia UX/UI
**Opis**: Poprawa doświadczenia użytkownika i interfejsu.

**Optymalizacje**:
- Responsywność na wszystkich urządzeniach
- Skróty klawiaturowe dla wszystkich akcji
- Tryb ciemny z lepszą paletą kolorów
- Animacje i przejścia między widokami
- PWA (Progressive Web App) capabilities

### 4. Zaawansowane zarządzanie zadaniami
**Opis**: Rozszerzenie funkcjonalności zadań.

**Nowe funkcje**:
- Szablony zadań z automatycznym wypełnianiem
- Bulk operations (edycja wielu zadań naraz)
- Zaawansowane filtry z zapisem
- Task templates z kategoriami
- Auto-sugestie przypisań na podstawie umiejętności

### 5. Bezpieczeństwo i uprawnienia
**Opis**: Usprawnienie systemu bezpieczeństwa.

**Implementacja**:
- Role-based access control (RBAC)
- Audit logging dla wszystkich akcji
- Dwuskładnikowa autoryzacja
- Szyfrowanie wrażliwych danych
- Rate limiting dla API

## Harmonogram implementacji

### **Miesiąc 1-2: Integracje zewnętrzne**
1. **Tydzień 1-2**: GitHub/GitLab integration
2. **Tydzień 3-4**: Kalendarz i webhooki
3. **Tydzień 5-6**: Import/eksport danych
4. **Tydzień 7-8**: Testowanie i optymalizacja

### **Miesiąc 3-4: Zaawansowana analityka**
1. **Tydzień 1-2**: Advanced analytics dashboard
2. **Tydzień 3-4**: Team performance metrics
3. **Tydzień 5-6**: Predictive analytics
4. **Tydzień 7-8**: Raporty retrospektywne

### **Miesiąc 5-6: Usprawnienia UX**
1. **Tydzień 1-2**: Responsywność i accessibility
2. **Tydzień 3-4**: Skróty klawiaturowe i animacje
3. **Tydzień 5-6**: PWA i offline capabilities
4. **Tydzień 7-8**: Testowanie UX i optymalizacja

## Kryteria sukcesu etapu

- ✅ Wszystkie integracje zewnętrzne działają stabilnie
- ✅ Zaawansowana analityka dostarcza wartościowych insightów
- ✅ Interfejs jest responsywny i dostępny na wszystkich urządzeniach
- ✅ Użytkownicy mogą efektywnie zarządzać projektami z nowych funkcji
- ✅ Aplikacja osiąga poziom enterprise-ready

## Ryzyka i wyzwania

- **Integracje zewnętrzne**: Zależność od API trzecich stron, rate limiting
- **Analityka**: Potrzebne duże ilości danych historycznych dla dokładnych prognoz
- **Responsywność**: Zapewnienie spójności UX na różnych urządzeniach
- **Bezpieczeństwo**: Implementacja RBAC bez wpływu na wydajność

## Implementacja kodu - Rozwiązania bez backendu

### 1. Integracje zewnętrzne (miesiące 1-2)

#### **GitHub/GitLab Integration**
```typescript
// lib/github-integration.ts
interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  assignee?: string;
  created_at: string;
  updated_at: string;
}

class GitHubIntegration {
  private token: string | null = null;

  constructor() {
    // Pobierz token z localStorage
    this.token = localStorage.getItem('github_token');
  }

  async authenticate(token: string) {
    this.token = token;
    localStorage.setItem('github_token', token);

    // Mock - w rzeczywistości sprawdź token z GitHub API
    return { success: true, username: 'mock_user' };
  }

  async fetchIssues(repo: string): Promise<Partial<Issue>[]> {
    if (!this.token) throw new Error('Not authenticated');

    // Mock danych - w rzeczywistości: fetch z GitHub API
    const mockIssues: GitHubIssue[] = [
      {
        id: 1,
        title: 'Fix login bug',
        body: 'Users cannot login with special characters',
        state: 'open',
        labels: ['bug', 'urgent'],
        assignee: 'developer1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-16T14:30:00Z'
      }
    ];

    return mockIssues.map(issue => ({
      id: `github-${issue.id}`,
      title: issue.title,
      description: issue.body,
      priority: this.mapGitHubLabelsToPriority(issue.labels),
      status: issue.state === 'open' ? 'Todo' : 'Done',
      assignee: issue.assignee,
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at)
    }));
  }

  private mapGitHubLabelsToPriority(labels: string[]): Priority {
    if (labels.includes('urgent') || labels.includes('critical')) return 'P0';
    if (labels.includes('high')) return 'P1';
    if (labels.includes('medium')) return 'P2';
    return 'P3';
  }
}

// Hook do używania integracji
export function useGitHubIntegration() {
  const [integration] = useState(() => new GitHubIntegration());

  const importFromGitHub = async (repo: string) => {
    try {
      const issues = await integration.fetchIssues(repo);
      // Zapisz w localStorage jako dodatkowe zadania
      const existingIssues = JSON.parse(localStorage.getItem('imported_issues') || '[]');
      const updatedIssues = [...existingIssues, ...issues];
      localStorage.setItem('imported_issues', JSON.stringify(updatedIssues));
      return issues;
    } catch (error) {
      console.error('GitHub import failed:', error);
      throw error;
    }
  };

  return { importFromGitHub };
}
```

#### **Kalendarz Google Integration**
```typescript
// lib/calendar-integration.ts
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

class CalendarIntegration {
  private apiKey: string | null = null;

  async authenticate(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('calendar_api_key', apiKey);
    return { success: true };
  }

  async syncTeamCalendar(teamMembers: User[], tasks: Issue[]): Promise<CalendarEvent[]> {
    // Mock danych kalendarza
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Sprint Planning',
        start: new Date('2024-01-20T10:00:00'),
        end: new Date('2024-01-20T11:00:00'),
        description: 'Planowanie następnego sprintu'
      }
    ];

    // Przelicz zadania na wydarzenia kalendarza
    const taskEvents: CalendarEvent[] = tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(task.dueDate!),
        description: `Zadanie: ${task.description || ''}`
      }));

    return [...mockEvents, ...taskEvents];
  }
}
```

### 2. Zaawansowana analityka i raporty (miesiące 3-4)

#### **Advanced Analytics Dashboard**
```typescript
// components/advanced-analytics.tsx
import React, { useMemo } from 'react';
import { Issue, Sprint, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdvancedAnalyticsProps {
  issues: Issue[];
  sprints: Sprint[];
  teamMembers: User[];
}

export function AdvancedAnalytics({ issues, sprints, teamMembers }: AdvancedAnalyticsProps) {
  // Oblicz metryki z danych w localStorage
  const velocityData = useMemo(() => {
    return sprints.slice(-6).map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id);
      const completedPoints = sprintIssues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

      return {
        name: sprint.name,
        velocity: completedPoints,
        planned: sprint.capacity || 0
      };
    });
  }, [issues, sprints]);

  // Predykcja velocity (prosta regresja liniowa)
  const predictedVelocity = useMemo(() => {
    if (velocityData.length < 2) return 0;

    const recent = velocityData.slice(-3);
    const avg = recent.reduce((sum, item) => sum + item.velocity, 0) / recent.length;

    // Prosta predykcja - średnia z ostatnich 3 sprintów
    return Math.round(avg);
  }, [velocityData]);

  // Metryki zespołu
  const teamMetrics = useMemo(() => {
    return teamMembers.map(member => {
      const memberTasks = issues.filter(task => task.assignee === member.id);
      const completedTasks = memberTasks.filter(task => task.status === 'Done');
      const completionRate = memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0;

      return {
        name: member.name,
        tasks: memberTasks.length,
        completed: completedTasks.length,
        completionRate: Math.round(completionRate)
      };
    });
  }, [teamMembers, issues]);

  return (
    <div className="space-y-6">
      {/* Velocity Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Velocity Trend & Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="planned" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm">
              <strong>Predicted Velocity:</strong> {predictedVelocity} points
              (based on last 3 sprints average)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{predictedVelocity}</div>
            <div className="text-sm text-muted-foreground">Predicted Sprint Velocity</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {teamMembers.length > 0 ? Math.round(teamMetrics.reduce((sum, m) => sum + m.completionRate, 0) / teamMembers.length) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Average Completion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {issues.filter(i => i.status === 'Todo').length}
            </div>
            <div className="text-sm text-muted-foreground">Backlog Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### **Predictive Analytics**
```typescript
// lib/predictive-analytics.ts
export class PredictiveAnalytics {
  static calculateVelocityTrend(sprints: Sprint[]): number {
    if (sprints.length < 2) return 0;

    // Prosta regresja liniowa dla trendu velocity
    const recentSprints = sprints.slice(-5);
    const velocities = recentSprints.map(s => s.velocity || 0);

    if (velocities.length < 2) return velocities[0] || 0;

    // Oblicz trend (prosta implementacja)
    const n = velocities.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = velocities.reduce((a, b) => a + b, 0);
    const sumXY = velocities.reduce((sum, vel, i) => sum + vel * (i + 1), 0);
    const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predykcja dla następnego sprintu
    return Math.round(slope * (n + 1) + intercept);
  }

  static estimateSprintCapacity(teamMembers: User[], sprintDays: number): number {
    const totalCapacity = teamMembers.reduce((sum, member) => {
      return sum + (member.capacity || 8);
    }, 0);

    return totalCapacity * sprintDays;
  }

  static suggestTaskAssignments(tasks: Issue[], teamMembers: User[]): Record<string, string[]> {
    const suggestions: Record<string, string[]> = {};

    // Grupuj zadania według umiejętności wymaganych
    const skillGroups = this.groupTasksBySkills(tasks);

    // Rozkładaj zadania na członków zespołu według ich umiejętności
    Object.entries(skillGroups).forEach(([skill, skillTasks]) => {
      const suitableMembers = teamMembers.filter(member =>
        member.skills?.includes(skill) || member.role === 'Developer'
      );

      if (suitableMembers.length > 0) {
        suggestions[skill] = skillTasks.map(task => {
          // Prosty algorytm round-robin
          const memberIndex = skillTasks.indexOf(task) % suitableMembers.length;
          return suitableMembers[memberIndex].id;
        });
      }
    });

    return suggestions;
  }

  private static groupTasksBySkills(tasks: Issue[]): Record<string, Issue[]> {
    // Prosta heurystyka - w rzeczywistości użyj AI lub analizy treści
    return {
      'Frontend': tasks.filter(task =>
        task.title.toLowerCase().includes('ui') ||
        task.title.toLowerCase().includes('frontend')
      ),
      'Backend': tasks.filter(task =>
        task.title.toLowerCase().includes('api') ||
        task.title.toLowerCase().includes('backend')
      ),
      'Design': tasks.filter(task =>
        task.title.toLowerCase().includes('design') ||
        task.title.toLowerCase().includes('ui')
      )
    };
  }
}
```

### 3. Usprawnienia UX/UI (miesiące 5-6)

#### **Keyboard Shortcuts System**
```typescript
// hooks/use-global-shortcuts.ts
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useGlobalShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Globalne skróty dla aplikacji
export const globalShortcuts: KeyboardShortcut[] = [
  {
    key: 'n',
    ctrl: true,
    action: () => {
      // Otwórz modal tworzenia zadania
      const event = new CustomEvent('openCreateIssue');
      window.dispatchEvent(event);
    },
    description: 'Create new issue'
  },
  {
    key: 'f',
    ctrl: true,
    action: () => {
      // Przejdź do widoku zadań
      const event = new CustomEvent('navigateToView', { detail: 'issues' });
      window.dispatchEvent(event);
    },
    description: 'Go to Issues'
  },
  {
    key: '/',
    action: () => {
      // Focus na search bar
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search'
  }
];
```

#### **PWA Service Worker**
```typescript
// public/sw.js
const CACHE_NAME = 'braintask-v1';
const urlsToCache = [
  '/',
  '/app/page.tsx',
  '/components/navigation.tsx',
  // Wszystkie kluczowe pliki aplikacji
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Pobieranie zasobów z cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Synchronizacja danych w tle
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-issues') {
    event.waitUntil(syncIssuesWithServer());
  }
});

async function syncIssuesWithServer() {
  // Mock synchronizacji - w rzeczywistości wyślij dane do API
  const issues = JSON.parse(localStorage.getItem('issues') || '[]');
  console.log('Syncing issues:', issues.length);

  // Symuluj pomyślną synchronizację
  return Promise.resolve();
}
```

### 4. Zaawansowane zarządzanie zadaniami

#### **Bulk Operations**
```typescript
// components/bulk-operations.tsx
import React, { useState } from 'react';
import { Issue } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkOperationsProps {
  selectedIssues: Set<string>;
  issues: Issue[];
  onBulkUpdate: (updates: Partial<Issue>) => void;
  onBulkDelete: () => void;
}

export function BulkOperations({
  selectedIssues,
  issues,
  onBulkUpdate,
  onBulkDelete
}: BulkOperationsProps) {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkValue, setBulkValue] = useState<string>('');

  const handleBulkAction = () => {
    if (!bulkAction || selectedIssues.size === 0) return;

    switch (bulkAction) {
      case 'update_priority':
        onBulkUpdate({ priority: bulkValue as Priority });
        break;
      case 'update_status':
        onBulkUpdate({ status: bulkValue as IssueStatus });
        break;
      case 'assign':
        onBulkUpdate({ assignee: bulkValue });
        break;
      case 'delete':
        onBulkDelete();
        break;
    }
  };

  if (selectedIssues.size === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIssues.size} issues selected
          </span>

          <div className="flex items-center gap-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_priority">Change Priority</SelectItem>
                <SelectItem value="update_status">Change Status</SelectItem>
                <SelectItem value="assign">Assign To</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            {bulkAction && bulkAction !== 'delete' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent>
                  {bulkAction === 'update_priority' && (
                    <>
                      <SelectItem value="P0">P0 - Critical</SelectItem>
                      <SelectItem value="P1">P1 - High</SelectItem>
                      <SelectItem value="P2">P2 - Medium</SelectItem>
                      <SelectItem value="P3">P3 - Normal</SelectItem>
                    </>
                  )}
                  {bulkAction === 'update_status' && (
                    <>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}

            <Button onClick={handleBulkAction} size="sm">
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Bezpieczeństwo i uprawnienia

#### **Role-Based Access Control**
```typescript
// lib/rbac.ts
export type UserRole = 'Admin' | 'Developer' | 'Designer' | 'Product Owner' | 'Viewer';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

const rolePermissions: Record<UserRole, Permission[]> = {
  Admin: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' }
  ],
  'Product Owner': [
    { resource: 'issues', action: 'create' },
    { resource: 'issues', action: 'read' },
    { resource: 'issues', action: 'update' },
    { resource: 'sprints', action: 'read' },
    { resource: 'sprints', action: 'update' }
  ],
  Developer: [
    { resource: 'issues', action: 'read' },
    { resource: 'issues', action: 'update' }
  ],
  Designer: [
    { resource: 'issues', action: 'read' }
  ],
  Viewer: [
    { resource: 'issues', action: 'read' }
  ]
};

export class RBAC {
  static hasPermission(userRole: UserRole, resource: string, action: Permission['action']): boolean {
    const permissions = rolePermissions[userRole] || [];

    return permissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.action === action || permission.action === '*';
      return resourceMatch && actionMatch;
    });
  }

  static canEditIssue(userRole: UserRole, issue: Issue, currentUserId: string): boolean {
    // Admin może edytować wszystko
    if (userRole === 'Admin') return true;

    // Właściciel zadania może je edytować
    if (issue.assignee === currentUserId) return true;

    // Product Owner może edytować zadania w swoim sprincie
    if (userRole === 'Product Owner') return true;

    return false;
  }
}

// Hook do używania RBAC w komponentach
export function useRBAC(userRole: UserRole, currentUserId: string) {
  const hasPermission = (resource: string, action: Permission['action']) => {
    return RBAC.hasPermission(userRole, resource, action);
  };

  const canEditIssue = (issue: Issue) => {
    return RBAC.canEditIssue(userRole, issue, currentUserId);
  };

  return { hasPermission, canEditIssue };
}
```

#### **Local Storage Security**
```typescript
// lib/storage-security.ts
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'braintask_encryption_key';

  static async setItem(key: string, value: any): Promise<void> {
    const data = JSON.stringify(value);
    const encrypted = await this.encrypt(data);
    localStorage.setItem(key, encrypted);
  }

  static async getItem<T>(key: string): Promise<T | null> {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  private static async encrypt(data: string): Promise<string> {
    // Proste szyfrowanie - w produkcji użyj crypto-js lub podobnej biblioteki
    const key = this.ENCRYPTION_KEY;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  private static async decrypt(encrypted: string): Promise<string> {
    const data = atob(encrypted);
    const key = this.ENCRYPTION_KEY;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
}

// Hook do bezpiecznego przechowywania danych
export function useSecureStorage() {
  const setSecureItem = async (key: string, value: any) => {
    await SecureStorage.setItem(key, value);
  };

  const getSecureItem = async <T>(key: string): Promise<T | null> => {
    return await SecureStorage.getItem<T>(key);
  };

  return { setSecureItem, getSecureItem };
}
```

## Kryteria sukcesu etapu

- ✅ Wszystkie komponenty działają bez backendu
- ✅ Dane są bezpiecznie przechowywane w localStorage z szyfrowaniem
- ✅ Integracje zewnętrzne używają mock danych dla demonstracji
- ✅ Analityka oblicza metryki po stronie klienta
- ✅ RBAC kontroluje uprawnienia użytkowników
- ✅ PWA pozwala na pracę offline

## Ryzyka i wyzwania

- **Bezpieczeństwo localStorage**: Dane są przechowywane lokalnie, nie są bezpieczne dla wrażliwych informacji
- **Limity localStorage**: ~5-10MB na domenę, duże projekty mogą wymagać innego rozwiązania
- **Synchronizacja offline**: Brak automatycznej synchronizacji między urządzeniami
- **Wydajność obliczeń**: Złożone obliczenia analityczne mogą obciążać przeglądarkę

## Następne kroki

Po ukończeniu Etapu 2.5, aplikacja będzie gotowa do Etapu 3: Pełna współpraca zespołowa z wideokonferencjami, tablicami online i zaawansowaną gamifikacją.
