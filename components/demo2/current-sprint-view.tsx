"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Play,
  Users,
  Brain,
  Zap
} from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Issue, Sprint, IssueStatus } from "@/types/demo2"
import { toast } from "sonner"

interface CurrentSprintViewProps {
  issues: Issue[]
  sprints: Sprint[]
  onUpdateIssues: (issues: Issue[]) => void
  onViewDetails: (issueId: string) => void
}

interface Column {
  id: IssueStatus
  title: string
  status: IssueStatus
  wipLimit?: number
}

interface DraggableIssueProps {
  issue: Issue
  onViewDetails: (issueId: string) => void
}

interface DroppableColumnProps {
  column: Column
  issues: Issue[]
  onViewDetails: (issueId: string) => void
}

function DraggableIssue({ issue, onViewDetails }: DraggableIssueProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "P1": return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
      case "P2": return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      case "P3": return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
      default: return "border-l-gray-300"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card 
        className={`mb-3 hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(issue.priority)}`}
        onClick={() => onViewDetails(issue.id)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="text-xs font-mono">
              {issue.key}
            </Badge>
            <Badge className={
              issue.priority === "P0" ? "bg-red-500" :
              issue.priority === "P1" ? "bg-orange-500" :
              issue.priority === "P2" ? "bg-blue-500" : "bg-gray-500"
            }>
              {issue.priority}
            </Badge>
          </div>
          
          <h4 className="font-medium text-sm mb-2 line-clamp-2">
            {issue.title}
          </h4>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {issue.assignee && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{issue.assignee.split(" ")[0]}</span>
                </div>
              )}
              {issue.storyPoints && (
                <Badge variant="outline" className="text-xs">
                  {issue.storyPoints} SP
                </Badge>
              )}
            </div>
            
            {issue.status === "blocked" && (
              <AlertTriangle className="w-3 h-3 text-red-500" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DroppableColumn({ column, issues, onViewDetails }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const isOverLimit = column.wipLimit && issues.length >= column.wipLimit

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {column.title}
            <Badge variant="secondary" className="text-xs">
              {issues.length}
            </Badge>
          </CardTitle>
          {column.wipLimit && (
            <Badge 
              variant={isOverLimit ? "destructive" : "outline"}
              className="text-xs"
            >
              {issues.length}/{column.wipLimit}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <SortableContext
          items={issues.map(issue => issue.id)}
          strategy={verticalListSortingStrategy}
        >
          <div 
            ref={setNodeRef}
            className={`min-h-[200px] p-2 rounded-lg transition-colors ${
              isOver ? 'bg-blue-100 dark:bg-blue-900/20' : 
              isOverLimit ? 'bg-red-50 dark:bg-red-900/10' : 'bg-muted/20'
            }`}
          >
            {issues.map((issue) => (
              <DraggableIssue
                key={issue.id}
                issue={issue}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}

export function CurrentSprintView({ issues, sprints, onUpdateIssues, onViewDetails }: CurrentSprintViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  
  const activeSprint = sprints.find(sprint => sprint.status === "active")
  const sprintIssues = activeSprint ? 
    issues.filter(issue => issue.sprintId === activeSprint.id) : []

  const columns: Column[] = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in_progress", title: "In Progress", status: "in_progress", wipLimit: 4 },
    { id: "in_review", title: "In Review", status: "in_review", wipLimit: 3 },
    { id: "done", title: "Done", status: "done" }
  ]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getIssuesByStatus = (status: IssueStatus) => 
    sprintIssues.filter(issue => issue.status === status)

  const sprintProgress = sprintIssues.length > 0 ? 
    (getIssuesByStatus("done").length / sprintIssues.length) * 100 : 0

  const totalStoryPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  const completedStoryPoints = getIssuesByStatus("done").reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)

  const blockedIssues = sprintIssues.filter(issue => issue.status === "blocked")

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeIssue = issues.find(issue => issue.id === active.id)
    if (!activeIssue) return

    const newStatus = over.id as IssueStatus
    if (activeIssue.status === newStatus) return

    // Check WIP limits
    const targetColumn = columns.find(col => col.id === newStatus)
    if (targetColumn?.wipLimit) {
      const currentCount = getIssuesByStatus(newStatus).length
      if (currentCount >= targetColumn.wipLimit) {
        toast.error("WIP Limit przekroczony!", {
          description: `Kolumna "${targetColumn.title}" może zawierać maksymalnie ${targetColumn.wipLimit} zadań`
        })
        return
      }
    }

    const updatedIssues = issues.map(issue =>
      issue.id === active.id 
        ? { ...issue, status: newStatus, updatedAt: new Date() }
        : issue
    )

    onUpdateIssues(updatedIssues)
    
    toast.success("Zadanie przeniesione", {
      description: `${activeIssue.key} → ${targetColumn?.title || newStatus}`
    })
  }

  const activeIssue = activeId ? issues.find(issue => issue.id === activeId) : null

  if (!activeSprint) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Brak aktywnego sprintu</h3>
          <p className="text-muted-foreground mb-4">
            Aby korzystać z widoku kanban, musisz mieć aktywny sprint
          </p>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Rozpocznij sprint
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{activeSprint.name}</h1>
          <p className="text-muted-foreground">
            {new Date(activeSprint.startDate).toLocaleDateString()} - {new Date(activeSprint.endDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <Clock className="w-4 h-4 inline mr-1" />
            {Math.ceil((new Date(activeSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dni pozostało
          </div>
        </div>
      </div>

      {/* Sprint Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Postęp</p>
                <p className="text-2xl font-bold">{Math.round(sprintProgress)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={sprintProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Story Points</p>
                <p className="text-2xl font-bold">{completedStoryPoints}/{totalStoryPoints}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zadania</p>
                <p className="text-2xl font-bold">{getIssuesByStatus("done").length}/{sprintIssues.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zablokowane</p>
                <p className="text-2xl font-bold">{blockedIssues.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {blockedIssues.length > 0 && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>AI Insight:</strong> Masz {blockedIssues.length} zablokowanych zadań. 
            Rozważ eskalację lub realokację zasobów dla: {blockedIssues.map(i => i.key).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnIssues = getIssuesByStatus(column.status)
            return (
              <DroppableColumn
                key={column.id}
                column={column}
                issues={columnIssues}
                onViewDetails={onViewDetails}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeIssue ? (
            <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rotate-3 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {activeIssue.key}
                  </Badge>
                  <Badge className="bg-blue-500">
                    {activeIssue.priority}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">
                  {activeIssue.title}
                </h4>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-muted-foreground text-center">
        <p>
          <kbd className="px-2 py-1 bg-muted rounded text-xs">[</kbd> / 
          <kbd className="px-2 py-1 bg-muted rounded text-xs mx-1">]</kbd> 
          Przenieś zadanie między kolumnami
        </p>
      </div>
    </div>
  )
}