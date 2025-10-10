"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Progress } from "@/components/demo3/ui/progress"
import { Plus, Play, Square, Calendar, Target, TrendingUp } from "lucide-react"
import { mockSprints, mockIssues } from "@/lib/demo3/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/demo3/ui/tabs"
import { KanbanBoard } from "@/components/demo3/kanban-board"

export function SprintsView() {
  const activeSprints = mockSprints.filter((s) => s.status === "active")
  const plannedSprints = mockSprints.filter((s) => s.status === "planned")
  const completedSprints = mockSprints.filter((s) => s.status === "completed")

  const activeSprint = activeSprints[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
          <p className="text-muted-foreground">Manage your sprints and view progress</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Sprint
        </Button>
      </div>

      {/* Active Sprint Kanban */}
      {activeSprint && (
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">Sprint List</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4">
            <KanbanBoard sprint={activeSprint} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            {/* Active Sprints */}
            {activeSprints.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Active Sprint</h2>
                <div className="grid gap-4">
                  {activeSprints.map((sprint) => {
                    const sprintIssues = mockIssues.filter((i) => i.sprintId === sprint.id)
                    const doneIssues = sprintIssues.filter((i) => i.status === "done")
                    const progress = sprintIssues.length > 0 ? (doneIssues.length / sprintIssues.length) * 100 : 0
                    const totalSP = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)

                    return (
                      <Card key={sprint.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="flex items-center gap-2">
                                {sprint.name}
                                <Badge variant="default">Active</Badge>
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {new Date(sprint.start).toLocaleDateString("pl-PL")} -{" "}
                                {new Date(sprint.end).toLocaleDateString("pl-PL")}
                              </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                              <Square className="mr-2 h-3 w-3" />
                              End Sprint
                            </Button>
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

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {doneIssues.length} / {sprintIssues.length} tasks
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Story Points</p>
                              <p className="text-2xl font-bold">{totalSP}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Days Left</p>
                              <p className="text-2xl font-bold">11</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Velocity</p>
                              <p className="text-2xl font-bold flex items-center gap-1">
                                26
                                <TrendingUp className="h-4 w-4 text-success" />
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Planned Sprints */}
            {plannedSprints.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Planned Sprints</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {plannedSprints.map((sprint) => (
                    <Card key={sprint.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {sprint.name}
                          <Badge variant="secondary">Planned</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(sprint.start).toLocaleDateString("pl-PL")} -{" "}
                          {new Date(sprint.end).toLocaleDateString("pl-PL")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {sprint.goal && (
                          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                            <Target className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                            <p className="text-sm">{sprint.goal}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Play className="mr-2 h-3 w-3" />
                            Start Sprint
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Sprints */}
            {completedSprints.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed Sprints</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedSprints.map((sprint) => (
                    <Card key={sprint.id} className="opacity-75">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {sprint.name}
                          <Badge variant="outline">Completed</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(sprint.start).toLocaleDateString("pl-PL")} -{" "}
                          {new Date(sprint.end).toLocaleDateString("pl-PL")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          View Report
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
