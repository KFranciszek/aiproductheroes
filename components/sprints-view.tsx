"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SprintForm } from "./sprint-form"
import { Plus, Calendar, Target, TrendingUp, Users, Clock, CheckCircle, AlertCircle, Play, Square, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Sprint, Issue } from "@/types"

interface SprintsViewProps {
  sprints: Sprint[]
  issues: Issue[]
  onCreateSprint: (sprintData: Partial<Sprint>) => void
  onEditSprint: (sprint: Sprint) => void
  onStartSprint: (sprintId: string) => void
  onEndSprint: (sprintId: string) => void
}

export function SprintsView({
  sprints,
  issues,
  onCreateSprint,
  onEditSprint,
  onStartSprint,
  onEndSprint,
}: SprintsViewProps) {
  const activeSprint = sprints.find((sprint) => sprint.status === "Active")
  const plannedSprints = sprints.filter((sprint) => sprint.status === "Planned")
  const completedSprints = sprints.filter((sprint) => sprint.status === "Completed")
  
  // Calculate statistics
  const totalIssues = issues.length
  const assignedIssues = issues.filter(issue => issue.sprintId).length
  const backlogIssues = totalIssues - assignedIssues
  
  const completedIssues = issues.filter(issue => issue.status === "Done").length
  const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0
  
  const avgSprintDuration = sprints.length > 0 
    ? Math.round(sprints.reduce((acc, sprint) => {
        const duration = new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()
        return acc + (duration / (1000 * 60 * 60 * 24))
      }, 0) / sprints.length)
    : 0

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysRemaining = (sprint: Sprint) => {
    // Use a fixed date for consistent server/client rendering
    const today = new Date('2024-01-20T12:00:00Z')
    const endDate = new Date(sprint.endDate)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSprintProgress = (sprint: Sprint) => {
    const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
    const completed = sprintIssues.filter(issue => issue.status === "Done").length
    return sprintIssues.length > 0 ? Math.round((completed / sprintIssues.length) * 100) : 0
  }

  const getActiveSprintIssues = () => {
    if (!activeSprint) return { total: 0, completed: 0 }
    const sprintIssues = issues.filter(issue => issue.sprintId === activeSprint.id)
    const completed = sprintIssues.filter(issue => issue.status === "Done").length
    return { total: sprintIssues.length, completed }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sprints Management</h1>
        <SprintForm
          onSubmit={onCreateSprint}
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Sprint
            </Button>
          }
        />
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Total Sprints</p>
                <p className="text-2xl font-bold">{sprints.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Backlog Issues</p>
                <p className="text-2xl font-bold">{backlogIssues}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Avg Duration</p>
                <p className="text-2xl font-bold">{avgSprintDuration}d</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sprint Highlight */}
      {activeSprint && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                <CardTitle className="text-lg">Active Sprint</CardTitle>
                <Badge className="bg-primary text-white">Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEndSprint(activeSprint.id)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Sprint
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg">{activeSprint.name}</h3>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark mt-1">
                  {getDaysRemaining(activeSprint)} days remaining
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-semibold">{getSprintProgress(activeSprint)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{width: `${getSprintProgress(activeSprint)}%`}}
                  />
                </div>
                <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                  {(() => {
                    const { total, completed } = getActiveSprintIssues()
                    return `${completed} of ${total} issues completed`
                  })()}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  View Kanban Board
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Sprints Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Sprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Sprint</th>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Status</th>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Duration</th>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Issues</th>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Progress</th>
                  <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...plannedSprints, ...completedSprints].map((sprint, index) => {
                  const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
                  const completedIssues = sprintIssues.filter(issue => issue.status === "Done")
                  const progress = getSprintProgress(sprint)
                  
                  return (
                    <tr 
                      key={sprint.id} 
                      className={cn(
                        "border-b border-border-light dark:border-border-dark hover:bg-muted/50 transition-colors",
                        index === [...plannedSprints, ...completedSprints].length - 1 && "border-b-0"
                      )}
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{sprint.name}</p>
                          <p className="text-xs text-muted-light dark:text-muted-dark">
                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={cn(
                            "text-xs",
                            sprint.status === "Active" && "bg-green-100 text-green-800",
                            sprint.status === "Planned" && "bg-blue-100 text-blue-800",
                            sprint.status === "Completed" && "bg-gray-100 text-gray-800"
                          )}
                        >
                          {sprint.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-light dark:text-muted-dark">
                        {Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{sprintIssues.length}</span>
                          {sprintIssues.length > 0 && (
                            <span className="text-muted-light dark:text-muted-dark">
                              ({completedIssues.length} done)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{width: `${progress}%`}}
                            />
                          </div>
                          <span className="text-xs text-muted-light dark:text-muted-dark">{progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {sprint.status === "Planned" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onStartSprint(sprint.id)}
                              disabled={!!activeSprint}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {sprint.status === "Active" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEndSprint(sprint.id)}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Backlog Section */}
      {backlogIssues > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Backlog ({backlogIssues} issues)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
              Issues not assigned to any sprint. Consider creating a new sprint or assigning them to existing ones.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Sprint for Backlog
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Assign to Existing Sprint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sprints.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No sprints created yet</h3>
          <p className="text-muted-foreground mb-4">Create your first sprint to start organizing your work.</p>
          <SprintForm
            onSubmit={onCreateSprint}
            trigger={
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Sprint
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}