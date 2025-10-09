"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, MoreHorizontal, Play, Square } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Sprint } from "@/lib/types"
import { mockIssues } from "@/lib/mock-data"

interface SprintCardProps {
  sprint: Sprint
  onStartSprint?: () => void
  onEndSprint?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onViewReport?: () => void
}

export function SprintCard({ sprint, onStartSprint, onEndSprint, onEdit, onDelete, onViewReport }: SprintCardProps) {
  const sprintIssues = mockIssues.filter((i) => i.sprint?.id === sprint.id)
  const completedIssues = sprintIssues.filter((i) => i.status === "done")
  const progress = sprintIssues.length > 0 ? (completedIssues.length / sprintIssues.length) * 100 : 0

  const totalStoryPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)
  const completedStoryPoints = completedIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)

  const getStatusBadge = () => {
    switch (sprint.status) {
      case "active":
        return <Badge className="bg-chart-2">Active</Badge>
      case "planned":
        return <Badge variant="outline">Planned</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{sprint.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {sprint.startDate} - {sprint.endDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && <DropdownMenuItem onClick={onEdit}>Edytuj</DropdownMenuItem>}
                {onDelete && sprint.status === "planned" && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Usuń
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sprint.status === "active" && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Postęp</span>
                <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Zadania</p>
                <p className="text-foreground font-medium">
                  {completedIssues.length} / {sprintIssues.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Story Points</p>
                <p className="text-foreground font-medium">
                  {completedStoryPoints} / {totalStoryPoints}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {onEndSprint && (
                <Button onClick={onEndSprint} variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Square className="h-4 w-4 mr-2" />
                  Zakończ Sprint
                </Button>
              )}
            </div>
          </>
        )}

        {sprint.status === "planned" && (
          <div className="flex items-center gap-2">
            {onStartSprint && (
              <Button onClick={onStartSprint} size="sm" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Rozpocznij Sprint
              </Button>
            )}
          </div>
        )}

        {sprint.status === "completed" && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ukończone</p>
                <p className="text-foreground font-medium">
                  {completedIssues.length} / {sprintIssues.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Story Points</p>
                <p className="text-foreground font-medium">
                  {completedStoryPoints} / {totalStoryPoints}
                </p>
              </div>
            </div>
            {onViewReport && (
              <Button onClick={onViewReport} variant="outline" size="sm" className="w-full bg-transparent">
                Zobacz Raport
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
