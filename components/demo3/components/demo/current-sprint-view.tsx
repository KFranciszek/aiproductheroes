"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockIssues, mockSprints } from "@/lib/mock-data"
import type { Issue, IssueStatus } from "@/lib/types"

interface CurrentSprintViewProps {
  onIssueClick: (issue: Issue) => void
}

export function CurrentSprintView({ onIssueClick }: CurrentSprintViewProps) {
  const activeSprint = mockSprints.find((s) => s.status === "active")
  const sprintIssues = mockIssues.filter((i) => i.sprint?.id === activeSprint?.id)

  const todoIssues = sprintIssues.filter((i) => i.status === "todo")
  const inProgressIssues = sprintIssues.filter((i) => i.status === "in-progress")
  const inReviewIssues = sprintIssues.filter((i) => i.status === "in-review")
  const doneIssues = sprintIssues.filter((i) => i.status === "done")

  const totalStoryPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)
  const completedStoryPoints = doneIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)
  const sprintProgress = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0

  const blockedIssues = sprintIssues.filter((i) => i.status === "blocked")
  const wipLimit = { "in-progress": 3, "in-review": 2 }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0":
        return "destructive"
      case "P1":
        return "default"
      case "P2":
        return "secondary"
      default:
        return "outline"
    }
  }

  const KanbanColumn = ({
    title,
    status,
    issues,
    limit,
  }: {
    title: string
    status: IssueStatus
    issues: Issue[]
    limit?: number
  }) => {
    const isOverLimit = limit && issues.length > limit

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{issues.length}</Badge>
              {limit && (
                <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                  / {limit}
                </span>
              )}
            </div>
          </div>
          {isOverLimit && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>Przekroczono limit WIP</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => onIssueClick(issue)}
              className="w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground text-balance leading-snug flex-1">{issue.title}</p>
                  <Badge variant={getPriorityColor(issue.priority)} className="text-xs shrink-0">
                    {issue.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">{issue.id}</span>
                  {issue.assignee && (
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{activeSprint?.name || "Bieżący Sprint"}</h1>
        <p className="text-muted-foreground">
          {activeSprint?.startDate} - {activeSprint?.endDate} • 7 dni pozostało
        </p>
      </div>

      {/* Sprint Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Zadania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {doneIssues.length} / {sprintIssues.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ukończone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {completedStoryPoints} / {totalStoryPoints}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ukończone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Postęp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{Math.round(sprintProgress)}%</div>
              <Progress value={sprintProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {blockedIssues.length > 0 && (
        <Card className="border-l-4 border-l-chart-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-chart-3" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Wykryto {blockedIssues.length} zablokowanych zadań. Rozważ przeprowadzenie daily standup, aby
              zidentyfikować blokery.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn title="To Do" status="todo" issues={todoIssues} />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          issues={inProgressIssues}
          limit={wipLimit["in-progress"]}
        />
        <KanbanColumn title="In Review" status="in-review" issues={inReviewIssues} limit={wipLimit["in-review"]} />
        <KanbanColumn title="Done" status="done" issues={doneIssues} />
      </div>
    </div>
  )
}
