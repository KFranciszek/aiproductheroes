import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Crown, 
  Users, 
  Calendar, 
  Target, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Eye
} from "lucide-react";
import { IssueCard } from "@/components/demo/issue-card";
import type { Team, User, Issue, Sprint } from "@/types";

interface TeamDetailViewProps {
  team: Team;
  members: User[];
  issues: Issue[];
  activeSprint?: Sprint;
  onBack?: () => void;
  onViewIssue?: (issueId: string) => void;
}

export function TeamDetailView({ 
  team, 
  members, 
  issues, 
  activeSprint, 
  onBack,
  onViewIssue 
}: TeamDetailViewProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'issues' | 'members'>('overview');

  // Oblicz metryki zespołu
  const teamMetrics = useMemo(() => {
    const teamIssues = issues.filter(issue => issue.teamId === team.id);
    const completedIssues = teamIssues.filter(issue => issue.status === 'Done');
    const inProgressIssues = teamIssues.filter(issue => issue.status === 'In Progress');
    const todoIssues = teamIssues.filter(issue => issue.status === 'Todo');
    const inReviewIssues = teamIssues.filter(issue => issue.status === 'In Review');

    const totalStoryPoints = teamIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    
    const completionRate = teamIssues.length > 0 
      ? Math.round((completedIssues.length / teamIssues.length) * 100) 
      : 0;

    const storyPointsProgress = totalStoryPoints > 0 
      ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
      : 0;

    // Capacity utilization
    const teamCapacity = activeSprint?.teamCapacity?.find(tc => tc.teamId === team.id);
    const capacityUtilization = teamCapacity 
      ? Math.round((totalStoryPoints / teamCapacity.allocatedCapacity) * 100)
      : 0;

    // Average completion time
    const completedWithHours = completedIssues.filter(issue => issue.actualHours && issue.actualHours > 0);
    const avgCompletionTime = completedWithHours.length > 0
      ? Math.round(completedWithHours.reduce((sum, issue) => sum + (issue.actualHours || 0), 0) / completedWithHours.length)
      : 0;

    return {
      totalIssues: teamIssues.length,
      completedIssues: completedIssues.length,
      inProgressIssues: inProgressIssues.length,
      todoIssues: todoIssues.length,
      inReviewIssues: inReviewIssues.length,
      totalStoryPoints,
      completedStoryPoints,
      completionRate,
      storyPointsProgress,
      capacityUtilization,
      avgCompletionTime,
      teamCapacity
    };
  }, [team, issues, activeSprint]);

  const teamLead = members.find(member => member.id === team.leadId);

  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: team.color }}
          />
          <h1 className="text-2xl font-bold">{team.name}</h1>
        </div>
        <Badge variant={team.isActive ? "default" : "secondary"}>
          {team.isActive ? "Aktywny" : "Nieaktywny"}
        </Badge>
      </div>

      {/* Opis zespołu */}
      {team.description && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-muted-foreground">{team.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Metryki */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Zadania</p>
                <p className="text-2xl font-bold">{teamMetrics.totalIssues}</p>
                <p className="text-xs text-muted-foreground">
                  {teamMetrics.completedIssues} ukończonych
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Story Points</p>
                <p className="text-2xl font-bold">{teamMetrics.totalStoryPoints}</p>
                <p className="text-xs text-muted-foreground">
                  {teamMetrics.completedStoryPoints} ukończonych
                </p>
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
                <p className="text-2xl font-bold">{teamMetrics.completionRate}%</p>
                <p className="text-xs text-muted-foreground">
                  Zadania ukończone
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Średni czas</p>
                <p className="text-2xl font-bold">{teamMetrics.avgCompletionTime}h</p>
                <p className="text-xs text-muted-foreground">
                  Na zadanie
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="issues">Zadania</TabsTrigger>
          <TabsTrigger value="members">Członkowie</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Lead */}
            {teamLead && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Team Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={teamLead.avatar} />
                      <AvatarFallback>{teamLead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{teamLead.name}</p>
                      <p className="text-sm text-muted-foreground">{teamLead.role}</p>
                      <div className="flex gap-1 mt-1">
                        {teamLead.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Capacity Utilization */}
            {teamMetrics.teamCapacity && (
              <Card>
                <CardHeader>
                  <CardTitle>Wykorzystanie Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Przydzielone: {teamMetrics.teamCapacity.allocatedCapacity} SP</span>
                      <span>Użyte: {teamMetrics.totalStoryPoints} SP</span>
                    </div>
                    <Progress 
                      value={teamMetrics.capacityUtilization} 
                      className="h-3"
                      style={{
                        backgroundColor: teamMetrics.capacityUtilization > 100 ? '#ef4444' : 
                                        teamMetrics.capacityUtilization > 80 ? '#f59e0b' : '#10b981'
                      }}
                    />
                    <div className="flex justify-between text-sm">
                      <span>Wykorzystanie</span>
                      <span className={teamMetrics.capacityUtilization > 100 ? 'text-red-500' : 
                                      teamMetrics.capacityUtilization > 80 ? 'text-yellow-500' : 'text-green-500'}>
                        {teamMetrics.capacityUtilization}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status zadań */}
            <Card>
              <CardHeader>
                <CardTitle>Status zadań</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Ukończone</span>
                    </div>
                    <Badge variant="outline">{teamMetrics.completedIssues}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">W trakcie</span>
                    </div>
                    <Badge variant="outline">{teamMetrics.inProgressIssues}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">W recenzji</span>
                    </div>
                    <Badge variant="outline">{teamMetrics.inReviewIssues}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Do zrobienia</span>
                    </div>
                    <Badge variant="outline">{teamMetrics.todoIssues}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Postęp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zadania</span>
                      <span>{teamMetrics.completionRate}%</span>
                    </div>
                    <Progress value={teamMetrics.completionRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Story Points</span>
                      <span>{teamMetrics.storyPointsProgress}%</span>
                    </div>
                    <Progress value={teamMetrics.storyPointsProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <div className="space-y-4">
            {issues.filter(issue => issue.teamId === team.id).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onView={() => onViewIssue?.(issue.id)}
              />
            ))}
            {issues.filter(issue => issue.teamId === team.id).length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Brak zadań</h3>
                <p className="text-muted-foreground">
                  Ten zespół nie ma jeszcze przypisanych zadań.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {member.id === team.leadId && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex gap-1 mt-1">
                        {member.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
