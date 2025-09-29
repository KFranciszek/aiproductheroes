"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Target, MoreHorizontal } from "lucide-react"
import { KanbanBoard } from "./kanban-board"
import type { Issue, Sprint, IssueStatus } from "@/types"

interface CurrentSprintViewProps {
  sprint: Sprint | null
  issues: Issue[]
  onUpdateIssueStatus: (issueId: string, newStatus: IssueStatus) => void
}

export function CurrentSprintView({ sprint, issues, onUpdateIssueStatus }: CurrentSprintViewProps) {
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
    const today = new Date()
    const endDate = new Date(sprint.endDate)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

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

      <KanbanBoard sprint={sprint} issues={issues} onUpdateIssueStatus={onUpdateIssueStatus} />
    </div>
  )
}
