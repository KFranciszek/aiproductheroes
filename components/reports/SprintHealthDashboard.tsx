"use client"

import React, { useMemo } from "react"
import { BurndownChart } from "./BurndownChart"
import { generateBurndownData } from "@/lib/analytics"
import type { Sprint, Issue } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SprintHealthDashboardProps {
  sprint: Sprint | undefined
  issues: Issue[]
}

const StatCard = ({ title, value, subValue }: { title: string; value: string | number; subValue?: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </CardContent>
  </Card>
);

export function SprintHealthDashboard({ sprint, issues }: SprintHealthDashboardProps) {
  const sprintIssues = useMemo(() => {
    return issues.filter(issue => issue.sprintId === sprint?.id)
  }, [sprint, issues])

  const burndownData = useMemo(() => {
    if (!sprint) return []
    return generateBurndownData(sprint, sprintIssues)
  }, [sprint, sprintIssues])

  const sprintStats = useMemo(() => {
    if (!sprint) return null;

    const totalPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    const completedPoints = sprintIssues
      .filter(issue => issue.status === 'Done')
      .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;
    
    const tasksInReview = sprintIssues.filter(i => i.status === 'In Review').length;

    const today = new Date();
    const endDate = new Date(sprint.endDate);
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));


    return { totalPoints, completedPoints, progress, tasksInReview, daysLeft };
  }, [sprint, sprintIssues]);

  if (!sprint) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No active sprint. Please select a sprint to view its health.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Sprint Progress" value={`${Math.round(sprintStats?.progress || 0)}%`} subValue={`${sprintStats?.completedPoints} / ${sprintStats?.totalPoints} SP`} />
        <StatCard title="Days Remaining" value={sprintStats?.daysLeft || 0} subValue={`Ends on ${new Date(sprint.endDate).toLocaleDateString()}`} />
        <StatCard title="Tasks In Review" value={sprintStats?.tasksInReview || 0} subValue="Waiting for approval" />
        <StatCard title="Total Issues" value={sprintIssues.length} />
      </div>

      <div>
        <BurndownChart data={burndownData} title={`Sprint "${sprint.name}" Burndown`} />
      </div>
    </div>
  )
}


