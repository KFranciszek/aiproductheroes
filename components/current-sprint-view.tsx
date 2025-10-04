"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Target, MoreHorizontal, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { KanbanBoard } from "./kanban-board"
import type { Issue, Sprint, IssueStatus } from "@/types"

interface CurrentSprintViewProps {
  sprint: Sprint | null
  issues: Issue[]
  onUpdateIssueStatus: (issueId: string, newStatus: IssueStatus) => void
  onViewDetails?: (issueId: string) => void
}

export function CurrentSprintView({ sprint, issues, onUpdateIssueStatus, onViewDetails }: CurrentSprintViewProps) {
  if (!sprint) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">No Active Sprint</h1>
            <p className="text-muted-light dark:text-muted-dark">Start a sprint from the Sprints view to see the kanban board here.</p>
          </div>
        </div>
      </div>
    )
  }

  const sprintIssues = issues.filter((issue) => issue.sprintId === sprint.id)
  const completedIssues = sprintIssues.filter((issue) => issue.status === "Done")
  const inProgressIssues = sprintIssues.filter((issue) => issue.status === "In Progress")
  const inReviewIssues = sprintIssues.filter((issue) => issue.status === "In Review")
  const todoIssues = sprintIssues.filter((issue) => issue.status === "Todo")

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysRemaining = () => {
    // Use a fixed date for consistent server/client rendering
    const today = new Date('2024-01-20T12:00:00Z')
    const endDate = new Date(sprint.endDate)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  // AI Insights - Smart suggestions
  const blockedIssues = sprintIssues.filter(i => i.parentId && i.status !== "Done").length
  const openIssues = sprintIssues.filter(i => i.status !== "Done").length
  const progressPercentage = sprintIssues.length > 0 ? (completedIssues.length / sprintIssues.length) * 100 : 0
  
  const aiInsights = [
    blockedIssues > 0 && {
      icon: AlertTriangle,
      message: `${blockedIssues} ${blockedIssues === 1 ? 'zadanie jest zablokowane' : 'zadania są zablokowane'}`,
      type: 'warning' as const
    },
    daysRemaining < 3 && openIssues > 5 && {
      icon: Clock,
      message: `Ryzyko niedokończenia sprintu - ${openIssues} otwartych zadań, ${daysRemaining} dni pozostało`,
      type: 'error' as const
    },
    progressPercentage > 80 && {
      icon: TrendingUp,
      message: `Świetny postęp! Sprint jest na dobrej drodze do zakończenia`,
      type: 'success' as const
    },
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{sprint.name}</h1>
          <p className="text-muted-light dark:text-muted-dark">
            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)} ({daysRemaining} days remaining)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-border-light/50 dark:hover:bg-border-dark/50"
          >
            Complete Sprint
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-light dark:text-muted-dark hover:text-primary">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4">
          <h3 className="font-semibold text-muted-light dark:text-muted-dark mb-1">Total Tasks</h3>
          <p className="text-2xl font-bold">{sprintIssues.length}</p>
        </div>
        
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4">
          <h3 className="font-semibold text-muted-light dark:text-muted-dark mb-1">Story Points</h3>
          <p className="text-2xl font-bold">124</p>
        </div>
        
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 col-span-1 md:col-span-2">
          <h3 className="font-semibold text-muted-light dark:text-muted-dark mb-1">Progress</h3>
          <div className="flex items-center gap-4">
            <div className="w-full bg-background-light dark:bg-surface-dark/50 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{width: `${sprintIssues.length > 0 ? (completedIssues.length / sprintIssues.length) * 100 : 0}%`}}
              />
            </div>
            <span className="text-sm font-semibold">
              {sprintIssues.length > 0 ? Math.round((completedIssues.length / sprintIssues.length) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-light dark:text-muted-dark mt-1">
            <span>{completedIssues.length} Tasks Done</span>
            <span>{sprintIssues.length} Total Tasks</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              💡 AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiInsights.map((insight: any, index) => {
                const Icon = insight.icon
                const colorClass = 
                  insight.type === 'error' ? 'text-red-600 dark:text-red-400' :
                  insight.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                
                return (
                  <li key={index} className="flex items-start gap-2">
                    <Icon className={`h-4 w-4 mt-0.5 ${colorClass}`} />
                    <span className="text-sm">{insight.message}</span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <KanbanBoard sprint={sprint} issues={issues} onUpdateIssueStatus={onUpdateIssueStatus} onViewDetails={onViewDetails} />
    </div>
  )
}
