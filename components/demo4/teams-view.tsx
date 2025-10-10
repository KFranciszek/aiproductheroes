"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, TrendingUp, Target } from "lucide-react";
import { useData } from "@/lib/demo4/data-context";

export function TeamsView() {
  const { teams, users, issues } = useData();

  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return users.filter(u => team.memberIds.includes(u.id));
  };

  const getTeamIssues = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return issues.filter(i => i.assigneeId && team.memberIds.includes(i.assigneeId));
  };

  const getTeamStats = (teamId: string) => {
    const teamIssues = getTeamIssues(teamId);
    const doneIssues = teamIssues.filter(i => i.status === "done");
    const totalSP = teamIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    const doneSP = doneIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);

    return {
      total: teamIssues.length,
      done: doneIssues.length,
      totalSP,
      doneSP,
      progress: teamIssues.length > 0 ? (doneIssues.length / teamIssues.length) * 100 : 0,
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Teams</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {teams.length} {teams.length === 1 ? "team" : "teams"}
            </p>
          </div>

          <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Team
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {teams.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                No Teams Yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Create your first team to get started
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const members = getTeamMembers(team.id);
              const stats = getTeamStats(team.id);
              const avgVelocity = team.velocityHistory
                ? Math.round(team.velocityHistory.reduce((a: number, b: number) => a + b, 0) / team.velocityHistory.length)
                : 0;

              return (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {team.name}
                    </CardTitle>
                    <CardDescription>
                      {members.length} {members.length === 1 ? "member" : "members"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Members */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          Team Members
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {members.slice(0, 5).map((member) => (
                          <Avatar
                            key={member.id}
                            className="w-8 h-8 border-2 border-[var(--bg-elevated)]"
                          >
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>
                              {member.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {members.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] border-2 border-[var(--bg-elevated)] flex items-center justify-center text-xs font-medium">
                            +{members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-[var(--text-secondary)]">Current Work</span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {stats.done}/{stats.total} issues
                          </span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[var(--bg-subtle)] rounded-lg p-3">
                          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
                            <TrendingUp className="w-3 h-3" />
                            Velocity
                          </div>
                          <div className="text-lg font-bold text-[var(--text-primary)]">
                            {avgVelocity}
                          </div>
                        </div>

                        <div className="bg-[var(--bg-subtle)] rounded-lg p-3">
                          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
                            <Target className="w-3 h-3" />
                            Story Points
                          </div>
                          <div className="text-lg font-bold text-[var(--text-primary)]">
                            {stats.doneSP}/{stats.totalSP}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
