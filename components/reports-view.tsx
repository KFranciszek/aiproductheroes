import React, { useState, useMemo } from 'react';
import { Issue, Sprint } from '@/types';
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
      if (filters.assignee && filters.assignee !== 'all-assignees' && issue.assignee !== filters.assignee) return false;
      if (filters.status && filters.status !== 'all-statuses' && issue.status !== filters.status) return false;
      if (filters.sprintId && filters.sprintId !== 'all-sprints' && issue.sprintId !== filters.sprintId) return false;
      if (filters.priority && filters.priority !== 'all-priorities' && issue.priority !== filters.priority) return false;
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
                <SelectItem value="all-assignees">All Assignees</SelectItem>
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
                <SelectItem value="all-statuses">All Statuses</SelectItem>
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
                <SelectItem value="all-sprints">All Sprints</SelectItem>
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
                <SelectItem value="all-priorities">All Priorities</SelectItem>
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
