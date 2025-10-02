# Etap 1: Podstawowe rozszerzenia zadań i lepsze raporty - Szczegółowa implementacja

## Opis etapu
Etap 1 skupia się na rozszerzeniu podstawowych funkcjonalności zarządzania zadaniami oraz poprawie systemu raportowania. Celem jest dodanie hierarchii zadań, śledzenia czasu, komentarzy, załączników, szablonów oraz lepszych raportów. Implementacja w ciągu 1-2 miesięcy z naciskiem na stabilność, testowalność i użyteczność.

## Funkcje do zaimplementowania

### 1. Hierarchia zadań i podzadania
**Opis**: Implementacja hierarchicznej struktury zadań (Epic → Story → Task → Sub-task) z automatycznym obliczaniem progresu.

**Wymagania szczegółowe**:
- Model danych rozszerzony o `parentId` w Issue
- Automatyczne obliczanie progresu (np. 60% jeśli 3/5 podzadań ukończonych)
- Widok drzewa w interfejsie
- Możliwość przenoszenia podzadań

**Kroki implementacji**:

1. **Rozszerzenie modelu danych (types/index.ts)**:
```typescript
// Rozszerzenie typu Issue
export interface Issue {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: IssueStatus;
  assignee?: string;
  sprintId?: string;
  parentId?: string; // Nowe pole dla hierarchii
  progress?: number; // Automatycznie obliczane (0-100)
  subtasks?: Issue[]; // Podzadania (może powodować problemy z cyklicznymi zależnościami)
  attachments: Attachment[]; // Dodane dla załączników
  createdAt: Date;
  updatedAt: Date;
}

// Funkcja obliczająca progres - optymalizacja dla dużych list
export function calculateProgress(issue: Issue, allIssues: Issue[]): number {
  if (!issue.subtasks || issue.subtasks.length === 0) return 0;

  // Utwórz mapę dla szybkiego wyszukiwania
  const issueMap = new Map(allIssues.map(i => [i.id, i]));
  const completed = issue.subtasks.filter(sub =>
    issueMap.get(sub.id)?.status === 'Done'
  ).length;

  return Math.round((completed / issue.subtasks.length) * 100);
}
```

2. **Aktualizacja komponentu IssueCard (components/issue-card.tsx)**:
```typescript
import React from 'react';
import { Issue, calculateProgress } from '@/types';
// Importy dla komponentów UI (zakładając shadcn/ui)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  allIssues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string) => void; // Dodane jako prop
  onUpdateSubtaskStatus: (subtaskId: string, status: IssueStatus) => void; // Dodane jako prop
}

export function IssueCard({
  issue,
  allIssues,
  onEdit,
  onDelete,
  onAddSubtask,
  onUpdateSubtaskStatus
}: IssueCardProps) {
  const progress = calculateProgress(issue, allIssues);
  const subtasks = allIssues.filter(i => i.parentId === issue.id);

  return (
    <Card className="p-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{issue.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(issue)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(issue.id)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSubtask(issue.id)}>
                Add Subtask
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="space-y-1">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-2 pl-4 border-l-2 border-muted">
                  <Checkbox
                    checked={subtask.status === 'Done'}
                    onCheckedChange={(checked) =>
                      onUpdateSubtaskStatus(subtask.id, checked ? 'Done' : 'Todo')
                    }
                  />
                  <span className="text-sm">{subtask.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Priority: {issue.priority}</span>
          <span>Status: {issue.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

3. **Aktualizacja IssueForm dla podzadań (components/issue-form.tsx)**:
```typescript
import React, { useState } from 'react';
import { Issue } from '@/types';
// Importy dla komponentów UI
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IssueFormProps {
  onSubmit: (data: Partial<Issue>) => void;
  initialData?: Partial<Issue>;
  trigger: React.ReactNode;
  availableTasks: Issue[]; // Dodane jako prop dla listy zadań nadrzędnych
}

export function IssueForm({ onSubmit, initialData, trigger, availableTasks }: IssueFormProps) {
  const [parentId, setParentId] = useState<string | undefined>(initialData?.parentId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<Issue> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      parentId,
    };
    onSubmit({ ...data, parentId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              name="title"
              placeholder="Task title"
              defaultValue={initialData?.title}
              required
            />
            <Input
              name="description"
              placeholder="Description (optional)"
              defaultValue={initialData?.description}
            />
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent task (optional)" />
              </SelectTrigger>
              <SelectContent>
                {/* Lista zadań bez podzadań */}
                {availableTasks.filter(task => !task.parentId).map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 2. Śledzenie czasu pracy
**Opis**: Implementacja timera Pomodoro i rejestracji czasu z raportami.

**Wymagania szczegółowe**:
- Timer 25/5 minut
- Logowanie czasu manualnie
- Raporty czasowe

**Kroki implementacji**:

1. **Nowy model TimeEntry (types/index.ts)**:
```typescript
export interface TimeEntry {
  id: string;
  issueId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // w minutach
  description?: string;
  type: 'manual' | 'pomodoro';
}
```

2. **Komponent TimeTracker (components/time-tracker.tsx)**:
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { TimeEntry } from '@/types';
// Importy dla komponentów UI
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TimeTrackerProps {
  issueId: string;
  onTimeLogged: (entry: Omit<TimeEntry, 'id'>) => void;
  currentUserId: string; // Dodane jako prop dla użytkownika
}

export function TimeTracker({ issueId, onTimeLogged, currentUserId }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // w sekundach
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      startTimeRef.current = new Date();
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          // Automatyczne przełączanie między pracą a przerwą
          if (mode === 'work' && newTime >= 25 * 60) {
            // Zaloguj sesję pracy przed zmianą
            if (startTimeRef.current) {
              onTimeLogged({
                issueId,
                userId: currentUserId,
                startTime: startTimeRef.current,
                endTime: new Date(),
                duration: 25,
                type: 'pomodoro',
                description: 'Work session'
              });
            }
            setMode('break');
            startTimeRef.current = new Date();
            return 0;
          } else if (mode === 'break' && newTime >= 5 * 60) {
            // Zaloguj sesję przerwy
            if (startTimeRef.current) {
              onTimeLogged({
                issueId,
                userId: currentUserId,
                startTime: startTimeRef.current,
                endTime: new Date(),
                duration: 5,
                type: 'pomodoro',
                description: 'Break session'
              });
            }
            setMode('work');
            startTimeRef.current = new Date();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode, issueId, currentUserId, onTimeLogged]);

  const handleStart = () => setIsRunning(true);

  const handleStop = () => {
    setIsRunning(false);
    if (time > 0 && startTimeRef.current) {
      onTimeLogged({
        issueId,
        userId: currentUserId,
        startTime: startTimeRef.current,
        endTime: new Date(),
        duration: time / 60,
        type: 'pomodoro',
        description: `${mode === 'work' ? 'Work' : 'Break'} session`
      });
    }
    setTime(0);
    setMode('work');
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-mono">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground capitalize">{mode}</div>
          </div>
          <div className="space-x-2">
            <Button onClick={handleStart} disabled={isRunning}>Start</Button>
            <Button onClick={handleStop} variant="outline" disabled={!isRunning}>Stop</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Komentarze i dyskusje
**Opis**: System komentarzy z wątkami i @mentions.

**Wymagania szczegółowe**:
- Model Comment z parentCommentId
- Parsowanie @mentions
- Powiadomienia

**Kroki implementacji**:

1. **Model Comment (types/index.ts)**:
```typescript
export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  parentCommentId?: string; // Dla wątków
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Komponent CommentSection (components/comment-section.tsx)**:
```typescript
import React, { useState } from 'react';
import { Comment } from '@/types';
// Importy dla komponentów UI
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentSectionProps {
  issueId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  currentUserId?: string; // Opcjonalne dla kontekstu użytkownika
}

export function CommentSection({ issueId, comments, onAddComment, currentUserId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment, replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
    }
  };

  const parseMentions = (content: string) => {
    // Prosta implementacja - można rozszerzyć o lepsze parsowanie
    return content.replace(/@(\w+)/g, (match, username) => {
      return `<span class="mention" data-user="${username}">@${username}</span>`;
    });
  };

  // Grupowanie komentarzy w wątki
  const getCommentThreads = () => {
    const threads: { [key: string]: Comment[] } = {};
    comments.forEach(comment => {
      const parentId = comment.parentCommentId || comment.id;
      if (!threads[parentId]) threads[parentId] = [];
      threads[parentId].push(comment);
    });
    return threads;
  };

  const threads = getCommentThreads();

  return (
    <div className="space-y-4">
      {Object.entries(threads).map(([threadId, threadComments]) => (
        <div key={threadId} className="space-y-2">
          {threadComments
            .filter(comment => !comment.parentCommentId) // Tylko komentarze główne
            .map(comment => (
              <div key={comment.id} className="border-l-2 border-muted pl-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{comment.userId[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{comment.userId}</div>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: parseMentions(comment.content) }}
                    />
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Odpowiedzi w wątku */}
                {threadComments
                  .filter(c => c.parentCommentId === comment.id)
                  .map(reply => (
                    <div key={reply.id} className="ml-8 mt-2 border-l-2 border-muted/50 pl-4">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{reply.userId[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-xs font-medium">{reply.userId}</div>
                          <div
                            className="text-xs"
                            dangerouslySetInnerHTML={{ __html: parseMentions(reply.content) }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}

      {replyTo && (
        <div className="ml-8 p-2 bg-muted rounded">
          <Textarea
            placeholder="Write a reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSubmit}>Reply</Button>
            <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} className="self-end">Comment</Button>
      </div>
    </div>
  );
}
```

### 4. Załączniki i linki
**Opis**: Upload plików i linków z podglądem.

**Wymagania szczegółowe**:
- Upload plików z ograniczeniem rozmiaru
- Linki z podglądem
- Usuwanie załączników

**Kroki implementacji**:

1. **Rozszerzenie Issue o attachments (types/index.ts)**:
```typescript
export interface Attachment {
  id: string;
  issueId: string;
  type: 'file' | 'link';
  name: string;
  url: string;
  size?: number; // dla plików
  mimeType?: string;
}

export interface Issue {
  // ... inne pola
  attachments: Attachment[];
}
```

2. **Komponent FileUploader (components/file-uploader.tsx)**:
```typescript
import React, { useState, useRef } from 'react';
import { Attachment } from '@/types';
// Importy dla komponentów UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploaderProps {
  issueId: string;
  onUpload: (files: File[]) => void;
  onAddLink: (url: string, name: string) => void;
  existingAttachments?: Attachment[]; // Do wyświetlania istniejących załączników
  onDeleteAttachment?: (attachmentId: string) => void;
}

export function FileUploader({
  issueId,
  onUpload,
  onAddLink,
  existingAttachments = [],
  onDeleteAttachment
}: FileUploaderProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Walidacja rozmiaru (max 10MB na plik)
    const maxSize = 10 * 1024 * 1024;
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(validFiles);
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (linkUrl.trim() && linkName.trim()) {
      // Podstawowa walidacja URL
      try {
        new URL(linkUrl);
        onAddLink(linkUrl.trim(), linkName.trim());
        setLinkUrl('');
        setLinkName('');
      } catch {
        alert('Please enter a valid URL');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Istniejące załączniki */}
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attachments</h4>
          {existingAttachments.map(attachment => (
            <Card key={attachment.id} className="p-2">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attachment.type === 'file' ? (
                      <span className="text-sm">📄 {attachment.name}</span>
                    ) : (
                      <span className="text-sm">🔗 {attachment.name}</span>
                    )}
                    {attachment.size && (
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </span>
                    )}
                  </div>
                  {onDeleteAttachment && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteAttachment(attachment.id)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload plików */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Max 10MB per file. Supported: images, PDF, documents
        </p>
      </div>

      {/* Dodawanie linków */}
      <div className="flex gap-2">
        <Input
          placeholder="Link URL (e.g. https://example.com)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          type="url"
        />
        <Input
          placeholder="Link name"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />
        <Button onClick={handleAddLink} disabled={!linkUrl.trim() || !linkName.trim()}>
          Add Link
        </Button>
      </div>
    </div>
  );
}
```

### 5. Szablony zadań
**Opis**: Biblioteka szablonów dla szybkiego tworzenia zadań.

**Wymagania szczegółowe**:
- Model TaskTemplate
- Biblioteka szablonów w UI
- Tworzenie własnych szablonów

**Kroki implementacji**:

1. **Model TaskTemplate (types/index.ts)**:
```typescript
export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  category: string; // np. 'Frontend', 'Backend'
  fields: Partial<Issue>; // Pre-fill dla pól zadania
}
```

2. **Komponent TemplateSelector (components/template-selector.tsx)**:
```typescript
import { TaskTemplate } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateSelectorProps {
  templates: TaskTemplate[];
  onSelect: (template: TaskTemplate) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  return (
    <Select onValueChange={(value) => {
      const template = templates.find(t => t.id === value);
      if (template) onSelect(template);
    }}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map(template => (
          <SelectItem key={template.id} value={template.id}>
            {template.name} ({template.category})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 6. Lepsze raporty
**Opis**: Rozszerzenie raportów o filtry i eksport.

**Wymagania szczegółowe**:
- Filtry po użytkowniku, typie zadania, dacie
- Eksport do CSV/PDF
- Dashboard z metrykami

**Kroki implementacji**:

1. **Rozszerzenie ReportsView (components/reports-view.tsx)**:
```typescript
import React, { useState, useMemo } from 'react';
import { Issue, Sprint } from '@/types';
// Importy dla komponentów UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ReportsViewProps {
  issues: Issue[];
  sprints: Sprint[];
}

export function ReportsView({ issues, sprints }: ReportsViewProps) {
  const [filters, setFilters] = useState({
    assignee: '',
    status: '',
    sprintId: '',
    priority: ''
  });

  // Pobierz unikalnych assignee
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(issues.map(i => i.assignee).filter(Boolean));
    return Array.from(assignees);
  }, [issues]);

  // Filtrowanie issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      if (filters.assignee && issue.assignee !== filters.assignee) return false;
      if (filters.status && issue.status !== filters.status) return false;
      if (filters.sprintId && issue.sprintId !== filters.sprintId) return false;
      if (filters.priority && issue.priority !== filters.priority) return false;
      return true;
    });
  }, [issues, filters]);

  // Obliczenia metryk
  const metrics = useMemo(() => {
    const total = filteredIssues.length;
    const completed = filteredIssues.filter(i => i.status === 'Done').length;
    const inProgress = filteredIssues.filter(i => i.status === 'In Progress').length;
    const todo = filteredIssues.filter(i => i.status === 'Todo').length;
    const inReview = filteredIssues.filter(i => i.status === 'In Review').length;

    return { total, completed, inProgress, todo, inReview };
  }, [filteredIssues]);

  const exportToCSV = () => {
    const csvData = filteredIssues.map(issue => ({
      ID: issue.id,
      Title: issue.title,
      Status: issue.status,
      Priority: issue.priority,
      Assignee: issue.assignee || 'Unassigned',
      Sprint: sprints.find(s => s.id === issue.sprintId)?.name || 'No Sprint',
      Created: issue.createdAt.toISOString().split('T')[0],
      Updated: issue.updatedAt.toISOString().split('T')[0]
    }));

    // Tworzenie i pobieranie pliku CSV
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `issues-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      assignee: '',
      status: '',
      sprintId: '',
      priority: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtry */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filters.assignee} onValueChange={(value) => setFilters(prev => ({ ...prev, assignee: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Assignees</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee!}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sprintId} onValueChange={(value) => setFilters(prev => ({ ...prev, sprintId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sprints</SelectItem>
                {sprints.map(sprint => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="P0">P0</SelectItem>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
                <SelectItem value="P3">P3</SelectItem>
                <SelectItem value="P4">P4</SelectItem>
                <SelectItem value="P5">P5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={exportToCSV} variant="outline">
              Export to CSV ({filteredIssues.length} issues)
            </Button>
            <Button onClick={clearFilters} variant="ghost">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metryki */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-sm text-muted-foreground">Total Issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{metrics.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{metrics.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{metrics.inReview}</div>
            <p className="text-sm text-muted-foreground">In Review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{metrics.todo}</div>
            <p className="text-sm text-muted-foreground">Todo</p>
          </CardContent>
        </Card>
      </div>

      {/* Aktywne filtry */}
      {(filters.assignee || filters.status || filters.sprintId || filters.priority) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.assignee && <Badge variant="secondary">{filters.assignee}</Badge>}
              {filters.status && <Badge variant="secondary">{filters.status}</Badge>}
              {filters.sprintId && <Badge variant="secondary">
                {sprints.find(s => s.id === filters.sprintId)?.name}
              </Badge>}
              {filters.priority && <Badge variant="secondary">Priority {filters.priority}</Badge>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Kryteria sukcesu etapu
- Wszystkie nowe komponenty renderują bez błędów
- Hierarchia zadań działa poprawnie (progres aktualizuje się)
- Timer działa i loguje czas
- Komentarze z @mentions parsują się
- Upload plików nie powoduje błędów
- Raporty filtrują i eksportują dane
- Testy jednostkowe dla nowych funkcji (>80% pokrycia)

## Ryzyka i wyzwania
- Migracja istniejących danych do nowych modeli
- Optymalizacja zapytań dla hierarchicznych zadań
- Bezpieczeństwo uploadu (walidacja plików)
- Możliwe konflikty z istniejącymi komponentami

## Następne kroki
Po ukończeniu Etapu 1, przejście do Etapu 2: Zaawansowane sprinty i zarządzanie zespołem.
