import React, { useState, useMemo } from 'react';
import type { Sprint, Issue } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SprintHealthDashboard } from "@/components/reports/SprintHealthDashboard"

interface ReportsViewProps {
  sprints: Sprint[]
  issues: Issue[]
  activeSprint: Sprint | undefined
}

export function ReportsView({ sprints, issues, activeSprint }: ReportsViewProps) {
  // For now, we only have one tab, but this structure allows for easy expansion.
  // We will default to showing the active sprint.
  const selectedSprint = activeSprint;

  return (
    <div className="p-4 sm:p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <Tabs defaultValue="sprint-health">
        <TabsList>
          <TabsTrigger value="sprint-health">Sprint Health</TabsTrigger>
          <TabsTrigger value="team-performance" disabled>Team Performance</TabsTrigger>
          <TabsTrigger value="project-overview" disabled>Project Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="sprint-health" className="mt-4">
          <SprintHealthDashboard sprint={selectedSprint} issues={issues} />
        </TabsContent>
        <TabsContent value="team-performance">
          {/* Placeholder for future implementation */}
          <p>Team Performance Dashboard coming soon.</p>
        </TabsContent>
        <TabsContent value="project-overview">
          {/* Placeholder for future implementation */}
          <p>Project Overview Dashboard coming soon.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
