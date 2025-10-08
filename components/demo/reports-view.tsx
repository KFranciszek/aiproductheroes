import React, { useState, useMemo } from 'react';
import type { Sprint, Issue, User, Team, AutomationMetrics, AIInsight, TimeEntry } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { SprintHealthDashboard } from "@/components/demo/reports/SprintHealthDashboard"
import { TeamPerformanceDashboard } from "@/components/demo/reports/TeamPerformanceDashboard"
import { ProjectOverviewDashboard } from "@/components/demo/reports/ProjectOverviewDashboard"
import { VelocityTrendsDashboard } from "@/components/demo/reports/VelocityTrendsDashboard"
import { TimeTrackingDashboard } from "@/components/demo/reports/TimeTrackingDashboard"
import { ExportReports } from "@/components/demo/reports/ExportReports"

interface ReportsViewProps {
  sprints: Sprint[]
  issues: Issue[]
  activeSprint: Sprint | undefined
  users?: User[]
  teams?: Team[]
  automationMetrics?: AutomationMetrics
  aiInsights?: AIInsight[]
  timeEntries?: TimeEntry[]
}

export function ReportsView({ 
  sprints, 
  issues, 
  activeSprint, 
  users = [], 
  teams = [],
  automationMetrics, 
  aiInsights = [],
  timeEntries = []
}: ReportsViewProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  
  // For now, we only have one tab, but this structure allows for easy expansion.
  // We will default to showing the active sprint.
  const selectedSprint = activeSprint;

  // Filtruj zadania według wybranego zespołu
  const filteredIssues = useMemo(() => {
    if (selectedTeamId === 'all') {
      return issues;
    }
    return issues.filter(issue => issue.teamId === selectedTeamId);
  }, [issues, selectedTeamId]);

  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        {/* Filtry zespołów */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Wybierz zespół" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie zespoły</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTeamId !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTeamId('all')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="sprint-health">
        <TabsList>
          <TabsTrigger value="sprint-health">Sprint Health</TabsTrigger>
          <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
          <TabsTrigger value="project-overview">Project Overview</TabsTrigger>
          <TabsTrigger value="velocity-trends">Velocity Trends</TabsTrigger>
          <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        <TabsContent value="sprint-health" className="mt-4">
          <SprintHealthDashboard sprint={selectedSprint} issues={filteredIssues} />
        </TabsContent>
        <TabsContent value="team-performance" className="mt-4">
          <TeamPerformanceDashboard 
            users={users} 
            issues={filteredIssues} 
            sprints={sprints} 
          />
        </TabsContent>
        <TabsContent value="project-overview" className="mt-4">
          <ProjectOverviewDashboard 
            users={users}
            issues={filteredIssues}
            sprints={sprints}
            automationMetrics={automationMetrics}
            aiInsights={aiInsights}
          />
        </TabsContent>
        <TabsContent value="velocity-trends" className="mt-4">
          <VelocityTrendsDashboard 
            sprints={sprints}
            issues={filteredIssues}
            users={users}
          />
        </TabsContent>
        <TabsContent value="time-tracking" className="mt-4">
          <TimeTrackingDashboard 
            timeEntries={timeEntries}
            issues={filteredIssues}
            users={users}
          />
        </TabsContent>
        <TabsContent value="export" className="mt-4">
          <ExportReports 
            sprints={sprints}
            issues={filteredIssues}
            users={users}
            automationMetrics={automationMetrics}
            aiInsights={aiInsights}
            timeEntries={timeEntries}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
