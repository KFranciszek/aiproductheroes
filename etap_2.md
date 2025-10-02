# Etap 2: Zaawansowane sprinty i podstawowe zarządzanie zespołem - Szczegółowa implementacja

## Opis etapu
Etap 2 skupia się na zaawansowanych funkcjonalnościach sprintów oraz podstawowym zarządzaniu zespołem. Celem jest dodanie wykresów burndown, zależności między zadaniami, planowania sprintu z velocity tracking, profili użytkowników, systemu powiadomień oraz równoważenia obciążenia zespołu. Implementacja w ciągu 2-3 miesięcy z naciskiem na współpracę zespołową i analitykę.

## Funkcje do zaimplementowania

### 1. Zaawansowane sprinty - wykresy burndown i zależności
**Opis**: Implementacja wykresów burndown, zależności między zadaniami, velocity tracking i zaawansowanego planowania sprintu.

**Wymagania szczegółowe**:
- Interaktywny wykres burndown pokazujący postęp sprintu w czasie
- Zależności między zadaniami (blokery, następniki)
- Śledzenie velocity zespołu (punkty ukończone w poprzednich sprintach)
- Planowanie sprintu z automatycznym szacowaniem capacity
- Wizualizacja zależności w kanban board

**Kroki implementacji**:

1. **Rozszerzenie modelu Sprint o velocity i capacity (types/index.ts)**:
```typescript
export interface Sprint {
  id: string;
  name: string;
  status: 'Planned' | 'Active' | 'Completed';
  startDate: Date;
  endDate: Date;
  velocity?: number; // Punkty ukończone w poprzednim sprincie
  capacity?: number; // Maksymalna liczba punktów dla zespołu
  burndownData?: BurndownPoint[]; // Dane do wykresu
  createdAt: Date;
  updatedAt: Date;
}

export interface BurndownPoint {
  date: Date;
  idealPoints: number; // Idealna linia (pozostałe punkty / dni)
  actualPoints: number; // Rzeczywiste pozostałe punkty
  completedPoints: number; // Ukończone punkty
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string; // ID zadania, od którego zależy
  type: 'blocks' | 'is_blocked_by' | 'relates_to';
}
```

2. **Komponent BurndownChart (components/burndown-chart.tsx)**:
```typescript
import React from 'react';
import { Sprint, BurndownPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BurndownChartProps {
  sprint: Sprint;
  burndownData: BurndownPoint[];
}

export function BurndownChart({ sprint, burndownData }: BurndownChartProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burndown Chart - {sprint.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => formatDate(new Date(date))}
                formatter={(value, name) => [value, name === 'idealPoints' ? 'Idealna linia' : 'Pozostałe punkty']}
              />
              <Line
                type="monotone"
                dataKey="idealPoints"
                stroke="#8884d8"
                strokeDasharray="5 5"
                name="Idealna linia"
              />
              <Line
                type="monotone"
                dataKey="actualPoints"
                stroke="#82ca9d"
                strokeWidth={3}
                name="Pozostałe punkty"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{sprint.capacity || 0}</div>
            <div className="text-sm text-muted-foreground">Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sprint.velocity || 0}</div>
            <div className="text-sm text-muted-foreground">Velocity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(((sprint.capacity || 0) - (burndownData[burndownData.length - 1]?.actualPoints || 0)) / (sprint.capacity || 1) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

3. **Komponent TaskDependencies (components/task-dependencies.tsx)**:
```typescript
import React, { useState } from 'react';
import { Issue, TaskDependency } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface TaskDependenciesProps {
  task: Issue;
  allTasks: Issue[];
  dependencies: TaskDependency[];
  onAddDependency: (dependency: Omit<TaskDependency, 'id'>) => void;
  onRemoveDependency: (dependencyId: string) => void;
}

export function TaskDependencies({
  task,
  allTasks,
  dependencies,
  onAddDependency,
  onRemoveDependency
}: TaskDependenciesProps) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [dependencyType, setDependencyType] = useState<TaskDependency['type']>('blocks');

  const taskDependencies = dependencies.filter(d => d.taskId === task.id);
  const blockingTasks = taskDependencies.filter(d => d.type === 'is_blocked_by');

  const availableTasks = allTasks.filter(t =>
    t.id !== task.id &&
    !dependencies.some(d => d.taskId === task.id && d.dependsOnTaskId === t.id)
  );

  const handleAddDependency = () => {
    if (selectedTaskId) {
      onAddDependency({
        taskId: task.id,
        dependsOnTaskId: selectedTaskId,
        type: dependencyType
      });
      setSelectedTaskId('');
      setDependencyType('blocks');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Dependencies</h3>

        {/* Istniejące zależności */}
        {taskDependencies.length > 0 && (
          <div className="space-y-2 mb-4">
            {taskDependencies.map(dep => {
              const dependentTask = allTasks.find(t => t.id === dep.dependsOnTaskId);
              return (
                <div key={dep.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={dep.type === 'blocks' ? 'destructive' : 'secondary'}>
                      {dep.type === 'blocks' ? 'Blocks' : 'Blocked by'}
                    </Badge>
                    <span className="text-sm">{dependentTask?.title}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveDependency(dep.id)}
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Ostrzeżenia o blokerach */}
        {blockingTasks.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">This task is blocked by {blockingTasks.length} task(s)</span>
            </div>
          </div>
        )}

        {/* Dodawanie nowej zależności */}
        <div className="space-y-2">
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger>
              <SelectValue placeholder="Select task to depend on" />
            </SelectTrigger>
            <SelectContent>
              {availableTasks.map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dependencyType} onValueChange={(value: TaskDependency['type']) => setDependencyType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blocks">Blocks</SelectItem>
              <SelectItem value="is_blocked_by">Blocked by</SelectItem>
              <SelectItem value="relates_to">Relates to</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAddDependency} disabled={!selectedTaskId}>
            Add Dependency
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Planowanie sprintu z velocity tracking
**Opis**: Zaawansowane planowanie sprintu z automatycznym szacowaniem capacity i śledzeniem velocity.

**Wymagania szczegółowe**:
- Obliczanie capacity zespołu na podstawie dostępności członków
- Śledzenie velocity z poprzednich sprintów
- Sugerowanie zadań do sprintu na podstawie velocity
- Planowanie spotkań sprint planning

**Kroki implementacji**:

1. **Komponent SprintPlanning (components/sprint-planning.tsx)**:
```typescript
import React, { useState, useMemo } from 'react';
import { Sprint, Issue, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SprintPlanningProps {
  sprint: Sprint;
  availableTasks: Issue[];
  teamMembers: User[];
  onUpdateSprint: (sprint: Partial<Sprint>) => void;
  onAssignTaskToSprint: (taskId: string) => void;
  onRemoveTaskFromSprint: (taskId: string) => void;
}

export function SprintPlanning({
  sprint,
  availableTasks,
  teamMembers,
  onUpdateSprint,
  onAssignTaskToSprint,
  onRemoveTaskFromSprint
}: SprintPlanningProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Oblicz capacity zespołu
  const teamCapacity = useMemo(() => {
    const workingDays = Math.ceil((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalCapacity = teamMembers.reduce((sum, member) => sum + (member.capacity || 8), 0) * workingDays;
    return totalCapacity;
  }, [sprint, teamMembers]);

  // Oblicz velocity zespołu (średnia z ostatnich 3 sprintów)
  const teamVelocity = useMemo(() => {
    // Symulacja - w rzeczywistości pobierz z danych historycznych
    return sprint.velocity || 20;
  }, [sprint]);

  const plannedPoints = useMemo(() => {
    return Array.from(selectedTasks).reduce((sum, taskId) => {
      const task = availableTasks.find(t => t.id === taskId);
      return sum + (task?.storyPoints || 0);
    }, 0);
  }, [selectedTasks, availableTasks]);

  const handleTaskToggle = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handlePlanSprint = () => {
    // Aktualizuj sprint z nowymi danymi
    onUpdateSprint({
      capacity: teamCapacity,
      velocity: teamVelocity
    });

    // Przypisz wybrane zadania do sprintu
    selectedTasks.forEach(taskId => onAssignTaskToSprint(taskId));
  };

  return (
    <div className="space-y-6">
      {/* Metryki sprintu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{teamCapacity}</div>
            <div className="text-sm text-muted-foreground">Team Capacity (hours)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{teamVelocity}</div>
            <div className="text-sm text-muted-foreground">Team Velocity (points)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{plannedPoints}</div>
            <div className="text-sm text-muted-foreground">Planned Points</div>
            <Progress value={(plannedPoints / teamVelocity) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Dostępne zadania */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {availableTasks.map(task => (
              <div
                key={task.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedTasks.has(task.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTaskToggle(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{task.priority}</Badge>
                      <Badge variant="secondary">{task.status}</Badge>
                      {task.storyPoints && (
                        <Badge>{task.storyPoints} pts</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.assignee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Akcje */}
      <div className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Selected: {selectedTasks.size} tasks ({plannedPoints} points)
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setSelectedTasks(new Set())}>
            Clear Selection
          </Button>
          <Button onClick={handlePlanSprint}>
            Plan Sprint
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Profile użytkowników i zarządzanie zespołem
**Opis**: Implementacja profili użytkowników z rolami, umiejętnościami i zdjęciami.

**Wymagania szczegółowe**:
- Profile z podstawowymi informacjami, zdjęciami, umiejętnościami
- Role użytkowników (Admin, Developer, Designer, Product Owner)
- Status dostępności i obciążenie pracą
- Edycja profili przez użytkowników i adminów

**Kroki implementacji**:

1. **Rozszerzenie modelu User (types/index.ts)**:
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // URL do zdjęcia
  role: 'Admin' | 'Developer' | 'Designer' | 'Product Owner' | 'Viewer';
  skills: string[]; // Umiejętności/technologie
  capacity: number; // Godziny pracy dziennie (domyślnie 8)
  isActive: boolean; // Status dostępności
  joinedAt: Date;
  lastSeen?: Date;
}

export interface Team {
  id: string;
  name: string;
  members: User[];
  projects: string[]; // ID projektów
}
```

2. **Komponent UserProfile (components/user-profile.tsx)**:
```typescript
import React, { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfileProps {
  user: User;
  isEditing?: boolean;
  onSave?: (updatedUser: Partial<User>) => void;
  onCancel?: () => void;
}

export function UserProfile({ user, isEditing = false, onSave, onCancel }: UserProfileProps) {
  const [editedUser, setEditedUser] = useState<Partial<User>>(user);

  const handleSave = () => {
    if (onSave) {
      onSave(editedUser);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !editedUser.skills?.includes(skill)) {
      setEditedUser(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setEditedUser(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant={user.isActive ? 'default' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Podstawowe informacje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select
                value={editedUser.role}
                onValueChange={(value: User['role']) =>
                  setEditedUser(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Product Owner">Product Owner</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium">{user.role}</p>
            )}
          </div>

          <div>
            <Label htmlFor="capacity">Daily Capacity (hours)</Label>
            {isEditing ? (
              <Input
                id="capacity"
                type="number"
                min="1"
                max="12"
                value={editedUser.capacity || 8}
                onChange={(e) =>
                  setEditedUser(prev => ({ ...prev, capacity: parseInt(e.target.value) || 8 }))
                }
              />
            ) : (
              <p className="text-sm">{user.capacity || 8} hours</p>
            )}
          </div>
        </div>

        {/* Umiejętności */}
        <div>
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {(editedUser.skills || user.skills || []).map(skill => (
              <Badge key={skill} variant="outline" className="flex items-center gap-1">
                {skill}
                {isEditing && (
                  <button
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add skill (e.g. React, TypeScript)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSkillAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Akcje */}
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. System powiadomień w czasie rzeczywistym
**Opis**: Implementacja systemu powiadomień z WebSocket dla zdarzeń w czasie rzeczywistym.

**Wymagania szczegółowe**:
- Powiadomienia o nowych zadaniach, komentarzach, zmianach statusu
- Grupowanie powiadomień (nie spamować)
- Historia powiadomień
- Ustawienia powiadomień per użytkownik

**Kroki implementacji**:

1. **Model Notification (types/index.ts)**:
```typescript
export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'sprint_started' | 'mention';
  title: string;
  message: string;
  data?: any; // Dodatkowe dane (np. taskId)
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationSettings {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    comments: boolean;
    mentions: boolean;
    sprintChanges: boolean;
  };
}
```

2. **Komponent NotificationCenter (components/notification-center.tsx)**:
```typescript
import React, { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // WebSocket connection dla powiadomień w czasie rzeczywistym
    const ws = new WebSocket('ws://localhost:3001/notifications');

    ws.onmessage = (event) => {
      const newNotification: Notification = JSON.parse(event.data);
      // Dodaj do stanu aplikacji
      console.log('New notification:', newNotification);
    };

    return () => ws.close();
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-10 w-80 z-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={onMarkAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {notification.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {formatTime(notification.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### 5. Równoważenie obciążenia zespołu (Workload Balancing)
**Opis**: Widok obciążenia zespołu z sugestiami równoważenia zadań.

**Wymagania szczegółowe**:
- Wizualizacja obciążenia każdego członka zespołu
- Sugestie przeniesienia zadań między członkami
- Kalendarz z zadaniami zespołu
- Alerty o przeładowaniu

**Kroki implementacji**:

1. **Komponent TeamWorkload (components/team-workload.tsx)**:
```typescript
import React, { useMemo } from 'react';
import { User, Issue } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Calendar } from 'lucide-react';

interface TeamWorkloadProps {
  teamMembers: User[];
  allTasks: Issue[];
  onReassignTask: (taskId: string, newAssigneeId: string) => void;
}

export function TeamWorkload({ teamMembers, allTasks, onReassignTask }: TeamWorkloadProps) {
  const workloadData = useMemo(() => {
    return teamMembers.map(member => {
      const memberTasks = allTasks.filter(task =>
        task.assignee === member.id &&
        (task.status === 'Todo' || task.status === 'In Progress')
      );

      const totalPoints = memberTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
      const capacity = (member.capacity || 8) * 5; // Tygodniowa capacity
      const utilization = (totalPoints / capacity) * 100;

      return {
        member,
        tasks: memberTasks,
        totalPoints,
        capacity,
        utilization,
        isOverloaded: utilization > 100
      };
    });
  }, [teamMembers, allTasks]);

  const getWorkloadColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Podsumowanie zespołu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {workloadData.filter(d => d.isOverloaded).length}
            </div>
            <div className="text-sm text-muted-foreground">Overloaded Members</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(workloadData.reduce((sum, d) => sum + d.utilization, 0) / workloadData.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Utilization</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {workloadData.reduce((sum, d) => sum + d.totalPoints, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
      </div>

      {/* Szczegóły obciążenia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workloadData.map(({ member, tasks, totalPoints, capacity, utilization, isOverloaded }) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{member.name}</h3>
                  <Badge variant="outline" className="text-xs">{member.role}</Badge>
                </div>
                {isOverloaded && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Workload</span>
                  <span className={getWorkloadColor(utilization)}>
                    {totalPoints}/{capacity} pts ({Math.round(utilization)}%)
                  </span>
                </div>
                <Progress value={Math.min(utilization, 100)} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Active Tasks: {tasks.length}
                </div>
                {tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-xs p-1 bg-muted rounded">
                    {task.title} ({task.storyPoints || 0} pts)
                  </div>
                ))}
                {tasks.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{tasks.length - 3} more tasks
                  </div>
                )}
              </div>

              {isOverloaded && (
                <Button size="sm" variant="outline" className="w-full">
                  Rebalance Workload
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 6. Kalendarz zespołu z zadaniami
**Opis**: Kalendarz pokazujący zadania członków zespołu w czasie.

**Wymagania szczegółowe**:
- Widok miesięczny/tygodniowy z zadaniami
- Kolorowanie według statusu zadania
- Możliwość przenoszenia zadań między dniami
- Integracja z kalendarzem Google/Outlook

**Kroki implementacji**:

1. **Komponent TeamCalendar (components/team-calendar.tsx)**:
```typescript
import React, { useState, useMemo } from 'react';
import { Issue, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface TeamCalendarProps {
  teamMembers: User[];
  tasks: Issue[];
  onTaskDateChange?: (taskId: string, newDate: Date) => void;
}

export function TeamCalendar({ teamMembers, tasks, onTaskDateChange }: TeamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const calendarData = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const days: Date[] = [];
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    const tasksByDate = days.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;
        return taskDate && taskDate.toDateString() === date.toDateString();
      });

      return {
        date,
        tasks: dayTasks
      };
    });

    return tasksByDate;
  }, [currentDate, tasks]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTaskColor = (status: Issue['status']) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'In Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Team Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setViewMode('week')}>
              Week
            </Button>
            <Button size="sm" variant="outline" onClick={() => setViewMode('month')}>
              Month
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Nawigacja */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold">
            {currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Kalendarz */}
        <div className="grid grid-cols-7 gap-1">
          {/* Nagłówki dni */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Dni miesiąca */}
          {calendarData.map(({ date, tasks }) => (
            <div
              key={date.toISOString()}
              className="min-h-20 p-1 border rounded text-xs"
            >
              <div className="font-medium mb-1">
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {tasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={`p-1 rounded text-xs ${getTaskColor(task.status)}`}
                    title={task.title}
                  >
                    {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                  </div>
                ))}
                {tasks.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{tasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Kryteria sukcesu etapu
- Wszystkie wykresy burndown renderują poprawnie i aktualizują się w czasie rzeczywistym
- Zależności między zadaniami są wizualizowane i funkcjonalne
- Profile użytkowników pozwalają na edycję i wyświetlanie wszystkich informacji
- System powiadomień działa w czasie rzeczywistym z WebSocket
- Równoważenie obciążenia pokazuje dokładne metryki i sugestie
- Kalendarz zespołu wyświetla zadania w odpowiednich dniach
- Wszystkie komponenty są responsywne i dostępne

## Ryzyka i wyzwania
- Implementacja WebSocket dla powiadomień w czasie rzeczywistym (wymaga backend)
- Optymalizacja wykresów burndown dla dużych ilości danych
- Migracja istniejących danych użytkowników do nowego modelu
- Synchronizacja z zewnętrznymi kalendarzami (wymaga API)
- Bezpieczeństwo edycji profili (rola-based access control)

## Następne kroki
Po ukończeniu Etapu 2, przejście do Etapu 3: Pełna współpraca (spotkania, gamifikacja) i integracje z narzędziami zewnętrznymi.

