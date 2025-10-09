"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle } from "lucide-react"
import type { Issue, IssueStatus } from "@/lib/types"

interface KanbanBoardProps {
  issues: Issue[]
  onIssueClick: (issue: Issue) => void
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void
}

const columns: { status: IssueStatus; label: string; limit?: number }[] = [
  { status: "todo", label: "To Do" },
  { status: "in-progress", label: "In Progress", limit: 3 },
  { status: "in-review", label: "In Review", limit: 2 },
  { status: "done", label: "Done" },
]

const priorityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
}

export function KanbanBoard({ issues, onIssueClick, onStatusChange }: KanbanBoardProps) {
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)

  const getIssuesByStatus = (status: IssueStatus) => {
    return issues.filter((issue) => issue.status === status)
  }

  const handleDragStart = (issue: Issue) => {
    setDraggedIssue(issue)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: IssueStatus) => {
    if (draggedIssue && draggedIssue.status !== status) {
      onStatusChange(draggedIssue.id, status)
    }
    setDraggedIssue(null)
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {columns.map((column) => {
        const columnIssues = getIssuesByStatus(column.status)
        const isOverLimit = column.limit && columnIssues.length > column.limit

        return (
          <div key={column.status} className="flex flex-col min-h-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{column.label}</h3>
                <Badge variant="secondary">{columnIssues.length}</Badge>
              </div>
              {column.limit && (
                <span className={`text-xs ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                  Limit: {column.limit}
                </span>
              )}
            </div>

            <div
              className="flex-1 space-y-2 overflow-y-auto bg-muted/30 rounded-lg p-2 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.status)}
            >
              {columnIssues.map((issue) => (
                <Card
                  key={issue.id}
                  draggable
                  onDragStart={() => handleDragStart(issue)}
                  onClick={() => onIssueClick(issue)}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{issue.id}</p>
                      </div>
                      <div className={`w-1 h-8 rounded-full ${priorityColors[issue.priority]}`} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {issue.labels?.slice(0, 2).map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      {issue.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {issue.assignee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {issue.status === "blocked" && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <span>Zablokowane</span>
                      </div>
                    )}

                    {issue.storyPoints && <div className="text-xs text-muted-foreground">SP: {issue.storyPoints}</div>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
