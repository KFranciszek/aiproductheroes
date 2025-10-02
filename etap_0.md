# Etap 0: Ulepszenia podstawowych funkcji - Proste i skuteczne dodatki

## Opis etapu
Etap 0 skupia się na prostych, ale bardzo przydatnych ulepszeniach istniejących podstawowych funkcji aplikacji BrainTask. Celem jest poprawa doświadczenia użytkownika poprzez dodanie funkcjonalności, które ułatwiają codzienne korzystanie z aplikacji, bez wprowadzania dużych zmian architektonicznych. Wszystkie te funkcje są stosunkowo proste w implementacji i mogą być dodane stopniowo.

## Funkcje do zaimplementowania

### 1. Zaawansowane wyszukiwanie i filtrowanie
**Opis**: Rozszerzenie możliwości wyszukiwania i filtrowania o bardziej intuicyjne i potężne opcje.

**Wymagania szczegółowe**:
- Wyszukiwanie pełnotekstowe w tytułach, opisach i komentarzach zadań
- Filtrowanie po wielu kryteriach jednocześnie (priorytet + status + assignee)
- Zapisywanie ulubionych filtrów dla szybkiego dostępu
- Wyszukiwanie z podpowiedziami (autocomplete)
- Filtrowanie po dacie utworzenia/aktualizacji

**Kroki implementacji**:

1. **Rozszerzenie komponentu wyszukiwania (components/search-bar.tsx)**:
```typescript
import React, { useState, useMemo } from 'react';
import { Issue } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  issues: Issue[];
  onFilteredResults: (filtered: Issue[]) => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (filter: SavedFilter) => void;
}

interface SavedFilter {
  id: string;
  name: string;
  criteria: SearchCriteria;
}

interface SearchCriteria {
  query: string;
  priority?: string[];
  status?: string[];
  assignee?: string[];
  dateRange?: { start: Date; end: Date };
  tags?: string[];
}

export function SearchBar({
  issues,
  onFilteredResults,
  savedFilters = [],
  onSaveFilter
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchCriteria>({
    query: '',
    priority: [],
    status: [],
    assignee: []
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtrowanie w czasie rzeczywistym
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Wyszukiwanie pełnotekstowe
      if (activeFilters.query) {
        const query = activeFilters.query.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesDescription = issue.description?.toLowerCase().includes(query);
        const matchesComments = false; // TODO: Sprawdzić komentarze jeśli dostępne

        if (!matchesTitle && !matchesDescription && !matchesComments) {
          return false;
        }
      }

      // Filtrowanie po priorytecie
      if (activeFilters.priority && activeFilters.priority.length > 0) {
        if (!activeFilters.priority.includes(issue.priority)) {
          return false;
        }
      }

      // Filtrowanie po statusie
      if (activeFilters.status && activeFilters.status.length > 0) {
        if (!activeFilters.status.includes(issue.status)) {
          return false;
        }
      }

      // Filtrowanie po assignee
      if (activeFilters.assignee && activeFilters.assignee.length > 0) {
        if (!issue.assignee || !activeFilters.assignee.includes(issue.assignee)) {
          return false;
        }
      }

      return true;
    });
  }, [issues, activeFilters]);

  // Aktualizacja wyników
  React.useEffect(() => {
    onFilteredResults(filteredIssues);
  }, [filteredIssues, onFilteredResults]);

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    setActiveFilters(prev => ({ ...prev, query }));
  };

  const toggleFilter = (type: keyof SearchCriteria, value: string) => {
    setActiveFilters(prev => {
      const currentArray = (prev[type] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];

      return { ...prev, [type]: newArray.length > 0 ? newArray : undefined };
    });
  };

  const clearFilters = () => {
    setActiveFilters({ query: '' });
    setSearchQuery('');
  };

  const saveCurrentFilter = () => {
    if (onSaveFilter && (activeFilters.query || Object.keys(activeFilters).some(k => k !== 'query' && activeFilters[k as keyof SearchCriteria]))) {
      const filterName = prompt('Nazwa filtra:');
      if (filterName) {
        onSaveFilter({
          id: Date.now().toString(),
          name: filterName,
          criteria: activeFilters
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Główny pasek wyszukiwania */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj zadań po tytule, opisie..."
          value={searchQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Przycisk zaawansowanych filtrów */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Zaawansowane filtry
      </Button>

      {/* Zaawansowane filtry */}
      {showAdvanced && (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtry priorytetów */}
            <div>
              <label className="text-sm font-medium mb-2 block">Priorytet</label>
              <div className="space-y-2">
                {['P0', 'P1', 'P2', 'P3', 'P4', 'P5'].map(priority => (
                  <label key={priority} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters.priority?.includes(priority) || false}
                      onChange={() => toggleFilter('priority', priority)}
                    />
                    {priority}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtry statusów */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="space-y-2">
                {['Todo', 'In Progress', 'In Review', 'Done'].map(status => (
                  <label key={status} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters.status?.includes(status) || false}
                      onChange={() => toggleFilter('status', status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtry assignee */}
            <div>
              <label className="text-sm font-medium mb-2 block">Przypisane do</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {/* Pobierz unikalnych assignee */}
                {Array.from(new Set(issues.map(i => i.assignee).filter(Boolean))).map(assignee => (
                  <label key={assignee} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters.assignee?.includes(assignee!) || false}
                      onChange={() => toggleFilter('assignee', assignee!)}
                    />
                    {assignee}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Button size="sm" onClick={saveCurrentFilter}>
              Zapisz filtr
            </Button>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Wyczyść filtry
            </Button>
          </div>
        </div>
      )}

      {/* Aktywne filtry */}
      {(activeFilters.query || activeFilters.priority?.length || activeFilters.status?.length || activeFilters.assignee?.length) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Aktywne filtry:</span>
          {activeFilters.query && (
            <Badge variant="secondary">
              Wyszukiwanie: "{activeFilters.query}"
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleQueryChange('')} />
            </Badge>
          )}
          {activeFilters.priority?.map(p => (
            <Badge key={p} variant="secondary">
              {p}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter('priority', p)} />
            </Badge>
          ))}
          {activeFilters.status?.map(s => (
            <Badge key={s} variant="secondary">
              {s}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter('status', s)} />
            </Badge>
          ))}
          {activeFilters.assignee?.map(a => (
            <Badge key={a} variant="secondary">
              {a}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter('assignee', a)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Wyniki */}
      <div className="text-sm text-muted-foreground">
        Znaleziono {filteredIssues.length} zadań
      </div>
    </div>
  );
}
```

### 2. Ulubione zadania i szybki dostęp
**Opis**: Możliwość oznaczania zadań jako ulubionych dla szybkiego dostępu i lepszej organizacji pracy.

**Wymagania szczegółowe**:
- Przycisk "Ulubione" w karcie zadania
- Dedykowana sekcja "Moje ulubione" w nawigacji
- Filtrowanie i sortowanie ulubionych zadań
- Synchronizacja ulubionych między urządzeniami
- Powiadomienia o zmianach w ulubionych zadaniach

**Kroki implementacji**:

1. **Rozszerzenie modelu Issue (types/index.ts)**:
```typescript
export interface Issue {
  // ... istniejące pola
  isFavorite?: boolean; // Czy zadanie jest ulubione dla bieżącego użytkownika
  favoritedBy?: string[]; // Lista ID użytkowników, którzy dodali do ulubionych
}
```

2. **Komponent FavoriteButton (components/favorite-button.tsx)**:
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  issueId: string;
  isFavorite: boolean;
  onToggle: (issueId: string) => void;
}

export function FavoriteButton({ issueId, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(issueId)}
      className={`p-1 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}
```

### 3. Historia aktywności i audit log
**Opis**: Śledzenie wszystkich zmian w zadaniach dla lepszej przejrzystości i odpowiedzialności.

**Wymagania szczegółowe**:
- Log każdej zmiany (kto, kiedy, co zmienił)
- Możliwość cofania zmian (undo)
- Filtrowanie historii po typie zmiany
- Eksport historii zmian
- Powiadomienia o ważnych zmianach

**Kroki implementacji**:

1. **Model ActivityLog (types/index.ts)**:
```typescript
export interface ActivityLog {
  id: string;
  issueId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'assignee_changed' | 'comment_added';
  oldValue?: any;
  newValue?: any;
  field?: string; // Pole, które zostało zmienione
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

2. **Komponent ActivityFeed (components/activity-feed.tsx)**:
```typescript
import React from 'react';
import { ActivityLog } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: ActivityLog[];
  currentUserId: string;
}

export function ActivityFeed({ activities, currentUserId }: ActivityFeedProps) {
  const getActionDescription = (activity: ActivityLog) => {
    switch (activity.action) {
      case 'created':
        return 'utworzył zadanie';
      case 'updated':
        return `zaktualizował ${activity.field}`;
      case 'status_changed':
        return `zmienił status na ${activity.newValue}`;
      case 'assignee_changed':
        return `przypisał do ${activity.newValue}`;
      case 'comment_added':
        return 'dodał komentarz';
      default:
        return 'wykonał akcję';
    }
  };

  const getActionColor = (action: ActivityLog['action']) => {
    switch (action) {
      case 'created': return 'bg-green-100 text-green-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <Card key={activity.id} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {activity.userId[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                    {activity.action.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">{activity.userId}</span> {getActionDescription(activity)}
                </p>
                {activity.oldValue && activity.newValue && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.oldValue} → {activity.newValue}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 4. Skróty klawiaturowe i nawigacja
**Opis**: Dodanie skrótów klawiaturowych dla szybszej nawigacji i wykonywania akcji.

**Wymagania szczegółowe**:
- Podstawowe skróty: Ctrl+N (nowe zadanie), Ctrl+F (wyszukiwanie), etc.
- Konfigurowalne skróty klawiaturowe
- Podpowiedzi skrótów w interfejsie
- Obsługa na wszystkich głównych platformach

**Kroki implementacji**:

1. **Hook useKeyboardShortcuts (hooks/use-keyboard-shortcuts.ts)**:
```typescript
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatches = !!shortcut.shift === event.shiftKey;
        const altMatches = !!shortcut.alt === event.altKey;

        return keyMatches && ctrlMatches && shiftMatches && altMatches;
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
```

2. **Komponent KeyboardShortcutsHelp (components/keyboard-shortcuts-help.tsx)**:
```typescript
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  shortcuts: Array<{ key: string; ctrl?: boolean; shift?: boolean; alt?: boolean; description: string }>;
}

export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  const formatShortcut = (shortcut: typeof shortcuts[0]) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Keyboard className="h-4 w-4 mr-2" />
          Skróty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skróty klawiaturowe</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <Badge variant="outline">{formatShortcut(shortcut)}</Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. Lepsze motywy i personalizacja
**Opis**: Rozszerzenie systemu motywów o więcej opcji i personalizację interfejsu.

**Wymagania szczegółowe**:
- Więcej wbudowanych motywów kolorystycznych
- Niestandardowe motywy użytkownika
- Zapisywanie preferencji motywów
- Responsywność na zmiany systemowe (dark/light mode)

**Kroki implementacji**:

1. **Rozszerzony ThemeProvider (components/theme-provider.tsx)**:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'blue' | 'green' | 'purple' | 'orange';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Array<{ id: Theme; name: string; colors: Record<string, string> }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  const availableThemes = [
    { id: 'light' as Theme, name: 'Jasny', colors: { primary: '#3b82f6' } },
    { id: 'dark' as Theme, name: 'Ciemny', colors: { primary: '#60a5fa' } },
    { id: 'blue' as Theme, name: 'Niebieski', colors: { primary: '#1e40af' } },
    { id: 'green' as Theme, name: 'Zielony', colors: { primary: '#059669' } },
    { id: 'purple' as Theme, name: 'Fioletowy', colors: { primary: '#7c3aed' } },
    { id: 'orange' as Theme, name: 'Pomarańczowy', colors: { primary: '#ea580c' } }
  ];

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }

    // Zastosuj niestandardowe kolory dla motywów
    const selectedTheme = availableThemes.find(t => t.id === theme);
    if (selectedTheme) {
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 6. Eksport/import danych i backup
**Opis**: Możliwość eksportu danych użytkownika i importu dla backupu lub migracji.

**Wymagania szczegółowe**:
- Eksport wszystkich danych użytkownika (zadania, komentarze, ustawienia)
- Import danych z pliku JSON
- Selektywny eksport (tylko wybrane projekty/sprinty)
- Automatyczne backupy lokalne
- Historia wersji danych

**Kroki implementacji**:

1. **Funkcje eksportu/importu (lib/data-export.ts)**:
```typescript
import { Issue, Sprint, Comment, User } from '@/types';

export interface ExportData {
  version: string;
  exportDate: Date;
  userId: string;
  data: {
    issues: Issue[];
    sprints: Sprint[];
    comments: Comment[];
    settings: Record<string, any>;
  };
}

export function exportUserData(
  issues: Issue[],
  sprints: Sprint[],
  comments: Comment[],
  settings: Record<string, any>,
  userId: string
): string {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date(),
    userId,
    data: {
      issues,
      sprints,
      comments,
      settings
    }
  };

  return JSON.stringify(exportData, null, 2);
}

export function importUserData(jsonString: string): ExportData {
  try {
    const data: ExportData = JSON.parse(jsonString);

    // Walidacja wersji
    if (!data.version || data.version !== '1.0.0') {
      throw new Error('Nieobsługiwana wersja pliku eksportu');
    }

    return data;
  } catch (error) {
    throw new Error('Nieprawidłowy format pliku eksportu');
  }
}
```

2. **Komponent DataManager (components/data-manager.tsx)**:
```typescript
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText } from 'lucide-react';

interface DataManagerProps {
  onExport: () => string;
  onImport: (data: any) => void;
}

export function DataManager({ onExport, onImport }: DataManagerProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `braintask-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImport(data);
        setImportStatus('success');
      } catch (error) {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Zarządzanie danymi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Eksport danych</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Pobierz kopię wszystkich swoich danych w formacie JSON.
          </p>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Eksportuj dane
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Import danych</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Przywróć dane z wcześniej wyeksportowanego pliku.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importuj dane
          </Button>

          {importStatus === 'success' && (
            <p className="text-sm text-green-600 mt-2">Dane zostały pomyślnie zaimportowane.</p>
          )}
          {importStatus === 'error' && (
            <p className="text-sm text-red-600 mt-2">Błąd podczas importu danych. Sprawdź format pliku.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Kryteria sukcesu etapu
- Wszystkie nowe funkcje działają płynnie i intuicyjnie
- Wyszukiwanie zwraca trafne wyniki w czasie rzeczywistym
- Ulubione zadania są łatwo dostępne i synchronizowane
- Historia aktywności pokazuje wszystkie ważne zmiany
- Skróty klawiaturowe przyspieszają pracę
- Motywy są estetyczne i responsywne na preferencje systemowe
- Eksport/import danych działa niezawodnie

## Ryzyka i wyzwania
- Implementacja zaawansowanego wyszukiwania może wymagać optymalizacji dla dużych ilości danych
- Synchronizacja ulubionych między urządzeniami wymaga dodatkowej infrastruktury
- Historia aktywności może generować dużo danych - potrzebna strategia archiwizacji
- Motywy niestandardowe mogą powodować problemy z kontrastem i dostępnością

## Następne kroki
Po ukończeniu Etapu 0, aplikacja będzie miała solidne podstawy z ulepszeniami UX. Można wtedy przejść do Etapu 1 (hierarchia zadań, komentarze) lub kontynuować z kolejnymi prostymi ulepszeniami jak:
- Integracja z kalendarzem zewnętrznym
- Widgety pulpitu dla szybkiego dostępu
- Zaawansowane powiadomienia (email, SMS)
- Tryb offline dla podstawowych funkcji

