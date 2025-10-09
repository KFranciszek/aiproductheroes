"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, MoreHorizontal } from "lucide-react"
import type { Issue } from "@/lib/types"

interface IssueCardProps {
  issue: Issue
  onClick: () => void
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary"
      case "in-progress":
        return "default"
      case "in-review":
        return "outline"
      case "done":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return "🐛"
      case "feature":
        return "✨"
      case "improvement":
        return "📈"
      default:
        return "📋"
    }
  }

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground font-mono">{issue.id}</span>
                <span className="text-xs">{getTypeIcon(issue.type)}</span>
              </div>
              <h3 className="font-medium text-foreground text-balance leading-snug">{issue.title}</h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                <Star className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Description Preview */}
          {issue.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{issue.description}</p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getStatusColor(issue.status)} className="text-xs">
              {issue.status}
            </Badge>
            <Badge variant={getPriorityColor(issue.priority)} className="text-xs">
              {issue.priority}
            </Badge>
            {issue.storyPoints && (
              <Badge variant="outline" className="text-xs">
                {issue.storyPoints} SP
              </Badge>
            )}
            {issue.labels.map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {issue.assignee && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {issue.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{issue.assignee.name}</span>
                </div>
              )}
            </div>
            {issue.sprint && <span className="text-xs text-muted-foreground">{issue.sprint.name}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
