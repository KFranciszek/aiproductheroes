"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Progress } from "@/components/demo3/ui/progress"
import { Plus, Play, Square, Calendar, Target, TrendingUp } from "lucide-react"
import { mockSprints, mockIssues } from "@/lib/demo3/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/demo3/ui/tabs"
import { KanbanBoard } from "@/components/demo3/kanban-board"
import { useData } from "@/lib/demo3/data-context"
import type { Sprint } from "@/lib/demo3/types"
import { SprintForm } from "@/components/demo3/sprint-form"
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/demo3/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { EndSprintModal } from "@/components/demo3/end-sprint-modal"

export function SprintsView() {
  const { sprints, issues, startSprint } = useData()
  const [activeTab, setActiveTab] = React.useState("active")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedSprint, setSelectedSprint] = React.useState<Sprint | undefined>(undefined)
  const [sprintToComplete, setSprintToComplete] = React.useState<Sprint | null>(null)

  const activeSprint = sprints.find((s) => s.status === "active")
  const plannedSprints = sprints.filter((s) => s.status === "planned")
  const completedSprints = sprints.filter((s) => s.status === "completed")
  
  const handleOpenForm = (sprint?: Sprint) => {
    setSelectedSprint(sprint)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
          <p className="text-muted-foreground">Plan, track, and manage your team's work in sprints.</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Sprint
        </Button>
      </div>

      {/* Active Sprint Kanban */}
      {activeSprint && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Sprint</TabsTrigger>
            <TabsTrigger value="planned">Planned Sprints</TabsTrigger>
            <TabsTrigger value="completed">Completed Sprints</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <KanbanBoard sprint={activeSprint} />
          </TabsContent>

          <TabsContent value="planned" className="space-y-6">
            {/* Active Sprints */}
            {plannedSprints.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Planned Sprints</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {plannedSprints.map((sprint) => (
                    <SprintCard key={sprint.id} sprint={sprint} issues={issues} onEdit={() => handleOpenForm(sprint)} onStart={() => startSprint(sprint.id)} onComplete={() => setSprintToComplete(sprint)} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {/* Completed Sprints */}
            {completedSprints.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed Sprints</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedSprints.map((sprint) => (
                    <SprintCard key={sprint.id} sprint={sprint} issues={issues} onEdit={() => handleOpenForm(sprint)} onStart={() => startSprint(sprint.id)} onComplete={() => setSprintToComplete(sprint)} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <SprintForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        sprint={selectedSprint}
      />
      
      <EndSprintModal 
        sprint={sprintToComplete}
        onOpenChange={() => setSprintToComplete(null)}
      />
    </div>
  )
}

function SprintCard({ sprint, issues, onEdit, onStart, onComplete }: { sprint: Sprint, issues: any[], onEdit: () => void, onStart: () => void, onComplete: () => void }) {
  const sprintIssues = issues.filter((issue) => issue.sprintId === sprint.id)
  const doneIssues = sprintIssues.filter((i) => i.status === "done")
  const progress = sprintIssues.length > 0 ? (doneIssues.length / sprintIssues.length) * 100 : 0
  const totalSP = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {sprint.name}
              <Badge variant="default">{sprint.status}</Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {new Date(sprint.start).toLocaleDateString("pl-PL")} -{" "}
              {new Date(sprint.end).toLocaleDateString("pl-PL")}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sprint.status === "planned" && <DropdownMenuItem onClick={onStart}>Start Sprint</DropdownMenuItem>}
              {sprint.status === "active" && <DropdownMenuItem onClick={onComplete}>Complete Sprint</DropdownMenuItem>}
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
}
