import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Crown, Calendar, Target } from "lucide-react";
import type { Team, User, Issue, Sprint } from "@/types";

interface TeamCardProps {
  team: Team;
  members: User[];
  issues: Issue[];
  activeSprint?: Sprint;
  onViewDetails?: (teamId: string) => void;
}

export function TeamCard({ 
  team, 
  members, 
  issues, 
  activeSprint, 
  onViewDetails 
}: TeamCardProps) {
  // Oblicz metryki zespołu
  const teamIssues = issues.filter(issue => issue.teamId === team.id);
  const completedIssues = teamIssues.filter(issue => issue.status === 'Done');
  const inProgressIssues = teamIssues.filter(issue => issue.status === 'In Progress');
  
  const completionRate = teamIssues.length > 0 
    ? Math.round((completedIssues.length / teamIssues.length) * 100) 
    : 0;
  
  const totalStoryPoints = teamIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
  const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
  
  const teamLead = members.find(member => member.id === team.leadId);
  
  // Oblicz capacity utilization
  const teamCapacity = activeSprint?.teamCapacity?.find(tc => tc.teamId === team.id);
  const capacityUtilization = teamCapacity 
    ? Math.round((totalStoryPoints / teamCapacity.allocatedCapacity) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: team.color }}
            />
            <CardTitle className="text-lg">{team.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {members.length} członków
          </Badge>
        </div>
        
        {team.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {team.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team Lead */}
        {teamLead && (
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <Avatar className="w-6 h-6">
              <AvatarImage src={teamLead.avatar} />
              <AvatarFallback>{teamLead.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{teamLead.name}</span>
            <Badge variant="outline" className="text-xs">Lead</Badge>
          </div>
        )}

        {/* Metryki */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Zadania</span>
            </div>
            <div className="text-2xl font-bold">{teamIssues.length}</div>
            <div className="text-xs text-muted-foreground">
              {completedIssues.length} ukończonych
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Story Points</span>
            </div>
            <div className="text-2xl font-bold">{totalStoryPoints}</div>
            <div className="text-xs text-muted-foreground">
              {completedStoryPoints} ukończonych
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Postęp</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Capacity Utilization */}
        {teamCapacity && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Wykorzystanie capacity</span>
              <span>{capacityUtilization}%</span>
            </div>
            <Progress 
              value={capacityUtilization} 
              className="h-2"
              // Kolor w zależności od wykorzystania
              style={{
                backgroundColor: capacityUtilization > 100 ? '#ef4444' : 
                                capacityUtilization > 80 ? '#f59e0b' : '#10b981'
              }}
            />
          </div>
        )}

        {/* Członkowie zespołu */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Członkowie</span>
          </div>
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Akcje */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(team.id)}
          >
            Szczegóły
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Zadania
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
