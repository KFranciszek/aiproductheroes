"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { mockActivities } from "@/lib/mock-data"
import type { Issue } from "@/lib/types"

interface ActivityViewProps {
  onIssueClick: (issue: Issue) => void
}

export function ActivityView({ onIssueClick }: ActivityViewProps) {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")

  const filteredActivities = mockActivities.filter((activity) => {
    if (filterType !== "all" && activity.type !== filterType) return false
    if (filterUser !== "all" && activity.user.id !== filterUser) return false
    return true
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issue_created":
        return "🆕"
      case "issue_updated":
        return "✏️"
      case "comment_added":
        return "💬"
      case "status_changed":
        return "🔄"
      case "sprint_started":
        return "🚀"
      case "sprint_completed":
        return "✅"
      default:
        return "📌"
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "issue_created":
        return "bg-chart-2/10 border-chart-2/20"
      case "status_changed":
        return "bg-chart-1/10 border-chart-1/20"
      case "comment_added":
        return "bg-chart-3/10 border-chart-3/20"
      case "sprint_started":
      case "sprint_completed":
        return "bg-chart-4/10 border-chart-4/20"
      default:
        return "bg-muted/50 border-border"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Teraz"
    if (diffMins < 60) return `${diffMins} min temu`
    if (diffHours < 24) return `${diffHours} godz. temu`
    if (diffDays < 7) return `${diffDays} dni temu`
    return date.toLocaleDateString("pl-PL")
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aktywność</h1>
          <p className="text-muted-foreground mt-1">Śledź wszystkie zmiany w projekcie</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Typ aktywności" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie typy</SelectItem>
              <SelectItem value="issue_created">Utworzone zadania</SelectItem>
              <SelectItem value="status_changed">Zmiany statusu</SelectItem>
              <SelectItem value="comment_added">Komentarze</SelectItem>
              <SelectItem value="sprint_started">Sprinty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}
              >
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              {index < filteredActivities.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{activity.user.name}</span>
                    <span className="text-sm text-muted-foreground">{activity.description}</span>
                  </div>
                  {activity.issueId && (
                    <Badge variant="outline" className="text-xs font-mono">
                      {activity.issueId}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Brak aktywności spełniającej kryteria</p>
          </div>
        )}

        {filteredActivities.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" size="sm">
              Załaduj więcej
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
