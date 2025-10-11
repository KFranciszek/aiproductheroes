"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, Clock, Users, Zap } from "lucide-react"
import { KanbanBoard } from "./kanban-board"
import type { Sprint, Issue, IssueStatus } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface CurrentSprintViewProps {
  sprint: Sprint | null
  issues: Issue[]
  onUpdateIssueStatus: (issueId: string, newStatus: IssueStatus) => void
  onViewDetails: (issueId: string) => void
}

export function CurrentSprintView({
  sprint,
  issues,
  onUpdateIssueStatus,
  onViewDetails
}: CurrentSprintViewProps) {
  if (!sprint) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Brak aktywnego sprintu</h2>
          <p className="text-muted-foreground">Utwórz nowy sprint aby rozpocząć pracę</p>
        </div>
      </div>
    )
  }

  const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
  const completedTasks = sprintIssues.filter(issue => issue.status === 'Done').length
  const totalTasks = sprintIssues.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalStoryPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)

  // WIP Limits
  const wipLimits = {
    'In Progress': 5,
    'In Review': 3
  }

  const statusCounts = sprintIssues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Find blocked tasks
  const blockedTasks = sprintIssues.filter(issue => 
    issue.dependencies?.blockedBy && issue.dependencies.blockedBy.length > 0
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'P1': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'P2': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'P3': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'P4': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'In Review': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'Done': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getWipStatus = (status: string, current: number, limit: number) => {
    if (current > limit) {
      return { color: 'text-red-600', icon: '🔸', warning: true }
    } else if (current === limit) {
      return { color: 'text-yellow-600', icon: '⚠️', warning: false }
    } else {
      return { color: 'text-green-600', icon: '✅', warning: false }
    }
  }

  const columns = [
    { status: 'Todo' as IssueStatus, title: 'To Do', limit: 10 },
    { status: 'In Progress' as IssueStatus, title: 'In Progress', limit: 5 },
    { status: 'In Review' as IssueStatus, title: 'In Review', limit: 3 },
    { status: 'Done' as IssueStatus, title: 'Done', limit: null }
  ]

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{sprint.name}</h1>
          <p className="text-muted-foreground mt-1">
            {formatDistanceToNow(sprint.startDate, { addSuffix: false, locale: pl })} - {formatDistanceToNow(sprint.endDate, { addSuffix: false, locale: pl })} 
            ({Math.ceil((sprint.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dni pozostało)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Complete Sprint</Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">More options</span>
            ⋯
          </Button>
        </div>
      </div>

      {/* Sprint Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStoryPoints}</div>
            <p className="text-xs text-muted-foreground">
              Średnio: {totalTasks > 0 ? Math.round(totalStoryPoints / totalTasks) : 0} SP/zadanie
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} Tasks Done / {totalTasks} Total Tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {blockedTasks.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                  ⚠️ {blockedTasks.length} zadań są zablokowane
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Sprawdź zależności i rozważ przepriorytetyzowanie
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board with Drag & Drop */}
      <KanbanBoard
        sprint={sprint}
        issues={issues}
        onUpdateIssueStatus={onUpdateIssueStatus}
        onViewDetails={onViewDetails}
      />
    </div>
  )
}