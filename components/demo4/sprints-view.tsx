"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Play, 
  Square, 
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { KanbanBoard } from "./kanban-board";

export function SprintsView() {
  const { sprints, issues } = useData();

  const activeSprint = sprints.find(s => s.status === "active");
  const plannedSprints = sprints.filter(s => s.status === "planned");
  const completedSprints = sprints.filter(s => s.status === "completed");

  const getSprintStats = (sprintId: string) => {
    const sprintIssues = issues.filter(i => i.sprintId === sprintId);
    const doneIssues = sprintIssues.filter(i => i.status === "done");
    const totalSP = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    const doneSP = doneIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    
    return {
      total: sprintIssues.length,
      done: doneIssues.length,
      totalSP,
      doneSP,
      progress: sprintIssues.length > 0 ? (doneIssues.length / sprintIssues.length) * 100 : 0,
    };
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sprints</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage your sprint cycles
            </p>
          </div>

          <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Sprint
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="active" className="h-full">
          <div className="border-b border-[var(--border-subtle)] px-6">
            <TabsList>
              <TabsTrigger value="active">
                Active Sprint
                {activeSprint && <Badge variant="secondary" className="ml-2">1</Badge>}
              </TabsTrigger>
              <TabsTrigger value="planned">
                Planned
                {plannedSprints.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{plannedSprints.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                {completedSprints.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{completedSprints.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active Sprint */}
          <TabsContent value="active" className="mt-0 h-full">
            {activeSprint ? (
              <div className="flex flex-col h-full">
                {/* Sprint Header */}
                <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] px-6 py-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                          {activeSprint.name}
                        </h2>
                        <Badge className="bg-[var(--success-bg)] text-[var(--success-text)]">
                          Active
                        </Badge>
                      </div>
                      {activeSprint.goal && (
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {activeSprint.goal}
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm">
                      <Square className="w-4 h-4 mr-2" />
                      End Sprint
                    </Button>
                  </div>

                  {/* Sprint Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(() => {
                      const stats = getSprintStats(activeSprint.id);
                      const daysLeft = getDaysRemaining(activeSprint.end);

                      return (
                        <>
                          <div className="bg-[var(--bg-base)] rounded-lg p-3">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                              {stats.done}/{stats.total}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Issues Completed
                            </div>
                          </div>

                          <div className="bg-[var(--bg-base)] rounded-lg p-3">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                              {stats.doneSP}/{stats.totalSP}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Story Points
                            </div>
                          </div>

                          <div className="bg-[var(--bg-base)] rounded-lg p-3">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                              {Math.round(stats.progress)}%
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Progress
                            </div>
                            <Progress value={stats.progress} className="h-1 mt-2" />
                          </div>

                          <div className="bg-[var(--bg-base)] rounded-lg p-3">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              {daysLeft}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Days Remaining
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-auto">
                  <KanbanBoard sprintId={activeSprint.id} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    No Active Sprint
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Start a sprint to begin tracking your work
                  </p>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Start Sprint
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Planned Sprints */}
          <TabsContent value="planned" className="p-6">
            {plannedSprints.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  No Planned Sprints
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Create a sprint to plan your upcoming work
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {plannedSprints.map((sprint) => {
                  const stats = getSprintStats(sprint.id);

                  return (
                    <Card key={sprint.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {sprint.name}
                              <Badge variant="outline">Planned</Badge>
                            </CardTitle>
                            {sprint.goal && (
                              <CardDescription className="mt-2">
                                {sprint.goal}
                              </CardDescription>
                            )}
                          </div>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Start Sprint
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Calendar className="w-4 h-4" />
                            {new Date(sprint.start).toLocaleDateString()} - {new Date(sprint.end).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Target className="w-4 h-4" />
                            {stats.total} issues
                          </div>
                          {stats.totalSP > 0 && (
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                              <TrendingUp className="w-4 h-4" />
                              {stats.totalSP} SP
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Completed Sprints */}
          <TabsContent value="completed" className="p-6">
            {completedSprints.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  No Completed Sprints
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Completed sprints will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {completedSprints.map((sprint) => {
                  const stats = getSprintStats(sprint.id);

                  return (
                    <Card key={sprint.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {sprint.name}
                          <Badge className="bg-[var(--success-bg)] text-[var(--success-text)]">
                            Completed
                          </Badge>
                        </CardTitle>
                        {sprint.goal && (
                          <CardDescription>{sprint.goal}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Completion Rate</span>
                            <span className="font-medium text-[var(--text-primary)]">
                              {Math.round(stats.progress)}%
                            </span>
                          </div>
                          <Progress value={stats.progress} />
                          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
                            <span>{stats.done}/{stats.total} issues</span>
                            <span>{stats.doneSP}/{stats.totalSP} SP</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
