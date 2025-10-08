import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Users, TrendingUp, Clock, Target } from "lucide-react";
import { TeamCard } from "@/components/demo/team-card";
import type { Team, User, Issue, Sprint } from "@/types";

interface TeamsViewProps {
  teams: Team[];
  users: User[];
  issues: Issue[];
  activeSprint?: Sprint;
  onViewTeamDetails?: (teamId: string) => void;
}

export function TeamsView({ 
  teams, 
  users, 
  issues, 
  activeSprint, 
  onViewTeamDetails 
}: TeamsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'progress' | 'capacity'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overloaded'>('all');

  // Filtruj i sortuj zespoły
  const filteredTeams = useMemo(() => {
    let filtered = teams.filter(team => {
      // Filtruj po nazwie
      if (searchTerm && !team.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtruj po statusie
      if (filterStatus === 'active') {
        return team.isActive;
      } else if (filterStatus === 'overloaded') {
        const teamIssues = issues.filter(issue => issue.teamId === team.id);
        const totalStoryPoints = teamIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
        const teamCapacity = activeSprint?.teamCapacity?.find(tc => tc.teamId === team.id);
        const capacityUtilization = teamCapacity 
          ? (totalStoryPoints / teamCapacity.allocatedCapacity) * 100
          : 0;
        return capacityUtilization > 100;
      }

      return true;
    });

    // Sortuj
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.memberIds.length - a.memberIds.length;
        case 'progress':
          const aIssues = issues.filter(issue => issue.teamId === a.id);
          const bIssues = issues.filter(issue => issue.teamId === b.id);
          const aProgress = aIssues.length > 0 
            ? (aIssues.filter(issue => issue.status === 'Done').length / aIssues.length) * 100
            : 0;
          const bProgress = bIssues.length > 0 
            ? (bIssues.filter(issue => issue.status === 'Done').length / bIssues.length) * 100
            : 0;
          return bProgress - aProgress;
        case 'capacity':
          const aCapacity = activeSprint?.teamCapacity?.find(tc => tc.teamId === a.id)?.allocatedCapacity || 0;
          const bCapacity = activeSprint?.teamCapacity?.find(tc => tc.teamId === b.id)?.allocatedCapacity || 0;
          return bCapacity - aCapacity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [teams, issues, activeSprint, searchTerm, sortBy, filterStatus]);

  // Oblicz statystyki
  const stats = useMemo(() => {
    const totalMembers = teams.reduce((sum, team) => sum + team.memberIds.length, 0);
    const activeTeams = teams.filter(team => team.isActive).length;
    const totalIssues = issues.filter(issue => issue.teamId).length;
    const completedIssues = issues.filter(issue => issue.teamId && issue.status === 'Done').length;
    const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    return {
      totalMembers,
      activeTeams,
      totalIssues,
      completionRate
    };
  }, [teams, issues]);

  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Zespoły</h1>
          <p className="text-muted-foreground">
            Zarządzaj zespołami i śledź ich wydajność
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nowy zespół
        </Button>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Członkowie</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Aktywne zespoły</p>
                <p className="text-2xl font-bold">{stats.activeTeams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Zadania</p>
                <p className="text-2xl font-bold">{stats.totalIssues}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Postęp</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtry i sortowanie */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Szukaj zespołów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="overloaded">Przeciążone</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nazwa</SelectItem>
              <SelectItem value="members">Członkowie</SelectItem>
              <SelectItem value="progress">Postęp</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista zespołów */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const teamMembers = users.filter(user => team.memberIds.includes(user.id));
          return (
            <TeamCard
              key={team.id}
              team={team}
              members={teamMembers}
              issues={issues}
              activeSprint={activeSprint}
              onViewDetails={onViewTeamDetails}
            />
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Brak zespołów</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Nie znaleziono zespołów pasujących do wyszukiwania.' : 'Nie ma jeszcze żadnych zespołów.'}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Stwórz pierwszy zespół
          </Button>
        </div>
      )}
    </div>
  );
}
