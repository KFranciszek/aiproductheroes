"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Badge } from "@/components/demo3/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Progress } from "@/components/demo3/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/demo3/ui/alert"
import { Calendar, Target, AlertCircle, TrendingUp } from "lucide-react"
import { mockIssues, mockUsers } from "@/lib/demo3/mock-data"
import type { Sprint, Status, Priority } from "@/lib/demo3/types"
import { cn } from "@/lib/demo3/utils"
import { IssueDetailView } from "@/components/demo3/issue-detail-view"
import { useRouter } from "next/navigation"

const priorityColors: Record<Priority, string> = {
  P0: "bg-destructive text-destructive-foreground",
  P1: "bg-orange-500 text-white",
  P2: "bg-primary text-primary-foreground",
  P3: "bg-muted text-muted-foreground",
}

const columns: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-muted" },
  { id: "in_progress", label: "In Progress", color: "bg-primary" },
  { id: "in_review", label: "In Review", color: "bg-info" },
  { id: "done", label: "Done", color: "bg-success" },
]

interface KanbanBoardProps {
  sprint: Sprint
}

export function KanbanBoard({ sprint }: KanbanBoardProps) {
  const router = useRouter()
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null)

  const sprintIssues = mockIssues.filter((i) => i.sprintId === sprint.id)
  const doneIssues = sprintIssues.filter((i) => i.status === "done")
  const progress = sprintIssues.length > 0 ? (doneIssues.length / sprintIssues.length) * 100 : 0
  const totalSP = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)
  const blockedIssues = sprintIssues.filter((i) => i.status === "blocked")

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId)
    router.push(`/demo/sprints?panel=${issueId}`, { scroll: false })
  }

  const closeIssueDetail = () => {
    setSelectedIssueId(null)
    router.push("/demo3/sprints", { scroll: false })
  }

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{sprint.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(sprint.start).toLocaleDateString("pl-PL")} -{" "}
                    {new Date(sprint.end).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">11 days left</span>
                </div>
              </div>
            </div>
            <Badge variant="default" className="text-sm">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sprint.goal && (
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <Target className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Sprint Goal</p>
                <p className="text-sm">{sprint.goal}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {doneIssues.length}/{sprintIssues.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Story Points</p>
              <p className="text-2xl font-bold">{totalSP}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Velocity</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                26
                <TrendingUp className="h-4 w-4 text-success" />
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="text-2xl font-bold">{sprintIssues.length}</p>
            </div>
          </div>

          {blockedIssues.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Blocked Tasks</AlertTitle>
              <AlertDescription>{blockedIssues.length} tasks are currently blocked</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {columns.map((column) => {
          const columnIssues = sprintIssues.filter((i) => i.status === column.id)
          const columnSP = columnIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)

          return (
            <div key={column.id} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", column.color)} />
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {columnIssues.length}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{columnSP} SP</span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 min-h-[400px]">
                {columnIssues.map((issue) => {
                  const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
                  return (
                    <Card
                      key={issue.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
                      onClick={() => openIssueDetail(issue.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <code className="text-xs font-mono text-muted-foreground">{issue.key}</code>
                          <Badge className={cn("text-xs", priorityColors[issue.priority])}>{issue.priority}</Badge>
                        </div>

                        <p className="text-sm font-medium leading-tight line-clamp-2">{issue.title}</p>

                        <div className="flex items-center justify-between">
                          {assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatarUrl || "/placeholder.svg"} />
                              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          {issue.storyPoints && (
                            <Badge variant="secondary" className="text-xs font-mono">
                              {issue.storyPoints} SP
                            </Badge>
                          )}
                        </div>

                        {issue.labels && issue.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {issue.labels.slice(0, 2).map((label) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Issue Detail Drawer */}
      {selectedIssueId && (
        <IssueDetailView issueId={selectedIssueId} open={!!selectedIssueId} onClose={closeIssueDetail} />
      )}
    </div>
  )
}
