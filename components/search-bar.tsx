import React, { useState, useMemo } from 'react';
import { Issue, SavedFilter, SearchCriteria } from '@/types';
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

        if (!matchesTitle && !matchesDescription) {
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
