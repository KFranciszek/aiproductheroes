"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SprintForm } from "./sprint-form"
import { BacklogDock } from "./backlog-dock"
import { EndSprintModal } from "./end-sprint-modal"
import { useDemo2Classes } from "./theme-provider"
import { 
  Plus, 
  Play, 
  Square, 
  CheckCircle2, 
  Calendar, 
  Target,
  MoreHorizontal,
  Users,
  Edit,
  Trash2
} from "lucide-react"
import type { Issue, Sprint } from "@/types/demo2"
import { toast } from "sonner"

interface SprintsViewProps {
  sprints: Sprint[]
  issues: Issue[]
  onUpdateSprints: (sprints: Sprint[]) => void
  onUpdateIssues?: (issues: Issue[]) => void
  onViewIssue?: (issueId: string) => void
}

export function SprintsView({ sprints, issues, onUpdateSprints, onUpdateIssues, onViewIssue }: SprintsViewProps) {
  const [isSprintFormOpen, setIsSprintFormOpen] = useState(false)
  const [editingSprint, setEditingSprint] = useState<Sprint | undefined>()
  const [endingSprint, setEndingSprint] = useState<Sprint | undefined>()
  const [isEndSprintModalOpen, setIsEndSprintModalOpen] = useState(false)
  const classes = useDemo2Classes()
  
  const activeSprints = sprints.filter(sprint => sprint.status === "active")
  const plannedSprints = sprints.filter(sprint => sprint.status === "planned")
  const completedSprints = sprints.filter(sprint => sprint.status === "completed")

  const getSprintProgress = (sprintId: string) => {
    const sprintIssues = issues.filter(issue => issue.sprintId === sprintId)
    if (sprintIssues.length === 0) return 0
    const completedIssues = sprintIssues.filter(issue => issue.status === "done")
    return (completedIssues.length / sprintIssues.length) * 100
  }

  const getSprintStats = (sprintId: string) => {
    const sprintIssues = issues.filter(issue => issue.sprintId === sprintId)
    const completedIssues = sprintIssues.filter(issue => issue.status === "done")
    const totalStoryPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    
    return {
      totalIssues: sprintIssues.length,
      completedIssues: completedIssues.length,
      totalStoryPoints,
      completedStoryPoints
    }
  }

  const handleCreateSprint = () => {
    setEditingSprint(undefined)
    setIsSprintFormOpen(true)
  }

  const handleEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint)
    setIsSprintFormOpen(true)
  }

  const handleSaveSprint = (sprintData: Partial<Sprint>) => {
    if (editingSprint) {
      // Update existing sprint
      const updatedSprints = sprints.map(sprint =>
        sprint.id === editingSprint.id 
          ? { ...sprint, ...sprintData, updatedAt: new Date().toISOString() }
          : sprint
      )
      onUpdateSprints(updatedSprints)
    } else {
      // Create new sprint
      const newSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        ...sprintData as Required<Pick<Sprint, 'name' | 'startDate' | 'endDate'>>,
        status: 'planned',
        issueIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onUpdateSprints([...sprints, newSprint])
    }
  }

  const handleStartSprint = (sprint: Sprint) => {
    // End any currently active sprint first
    const updatedSprints = sprints.map(s => 
      s.status === 'active' ? { ...s, status: 'completed' as const } : s
    )
    
    // Start the selected sprint
    const finalSprints = updatedSprints.map(s =>
      s.id === sprint.id ? { ...s, status: 'active' as const } : s
    )
    
    onUpdateSprints(finalSprints)
    toast.success("Sprint rozpoczęty", {
      description: sprint.name
    })
  }

  const handleEndSprint = (sprint: Sprint) => {
    setEndingSprint(sprint)
    setIsEndSprintModalOpen(true)
  }

  const handleEndSprintConfirm = (sprintId: string, options: any) => {
    if (!onUpdateIssues) return

    // Update sprint status
    const updatedSprints = sprints.map(s =>
      s.id === sprintId ? { ...s, status: 'completed' as const } : s
    )
    onUpdateSprints(updatedSprints)

    // Handle incomplete issues
    if (options.moveIncompleteToBacklog) {
      // Move all incomplete issues to backlog (remove sprintId)
      const updatedIssues = issues.map(issue =>
        options.selectedIssues.includes(issue.id)
          ? { ...issue, sprintId: undefined, updatedAt: new Date() }
          : issue
      )
      onUpdateIssues(updatedIssues)
    } else if (options.moveIncompleteToSprint && options.selectedIssues.length > 0) {
      // Move selected issues to another sprint
      const updatedIssues = issues.map(issue =>
        options.selectedIssues.includes(issue.id)
          ? { ...issue, sprintId: options.moveIncompleteToSprint, updatedAt: new Date() }
          : issue
      )
      onUpdateIssues(updatedIssues)
    }

    const sprint = sprints.find(s => s.id === sprintId)
    toast.success("Sprint zakończony", {
      description: `${sprint?.name} - ${options.selectedIssues.length} zadań przeniesionych`
    })
  }

  const handleDeleteSprint = (sprint: Sprint) => {
    const updatedSprints = sprints.filter(s => s.id !== sprint.id)
    onUpdateSprints(updatedSprints)
    toast.success("Sprint usunięty", {
      description: sprint.name
    })
  }

  const handleMoveToSprint = (issueId: string, sprintId: string) => {
    if (!onUpdateIssues) return
    
    const updatedIssues = issues.map(issue =>
      issue.id === issueId ? { ...issue, sprintId, updatedAt: new Date() } : issue
    )
    onUpdateIssues(updatedIssues)
    
    const sprint = sprints.find(s => s.id === sprintId)
    const issue = issues.find(i => i.id === issueId)
    
    toast.success("Zadanie przeniesione do sprintu", {
      description: `${issue?.key}: ${issue?.title} → ${sprint?.name}`
    })
  }

  const handleCreateIssue = () => {
    // TODO: Open issue creation form
    console.log("Create issue")
  }

  const handleEditIssue = (issue: Issue) => {
    // TODO: Open issue edit form
    console.log("Edit issue", issue)
  }

  const handleDeleteIssue = (issueId: string) => {
    if (!onUpdateIssues) return
    
    const issue = issues.find(i => i.id === issueId)
    const updatedIssues = issues.filter(i => i.id !== issueId)
    onUpdateIssues(updatedIssues)
    
    toast.success("Zadanie usunięte", {
      description: issue ? `${issue.key}: ${issue.title}` : "Zadanie"
    })
  }

  const SprintCard = ({ sprint, showActions = true }: { sprint: Sprint, showActions?: boolean }) => {
    const stats = getSprintStats(sprint.id)
    const progress = getSprintProgress(sprint.id)
    const daysRemaining = Math.ceil((sprint.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return (
      <div className={classes.card}>
        <div className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold line-clamp-2">{sprint.name}</h3>
              {sprint.goal && (
                <p className={`text-sm ${classes.textMuted} line-clamp-2`}>
                  {sprint.goal}
                </p>
              )}
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sprint.status === "planned" && (
                    <DropdownMenuItem onClick={() => handleStartSprint(sprint)}>
                      <Play className="h-4 w-4 mr-2" />
                      Rozpocznij sprint
                    </DropdownMenuItem>
                  )}
                  {sprint.status === "active" && (
                    <DropdownMenuItem onClick={() => handleEndSprint(sprint)}>
                      <Square className="h-4 w-4 mr-2" />
                      Zakończ sprint
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleEditSprint(sprint)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edytuj
                  </DropdownMenuItem>
                  {sprint.status !== "active" && (
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSprint(sprint)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Usuń
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span 
              className={
                sprint.status === "active" ? classes.badgeSuccess :
                sprint.status === "planned" ? classes.badgeInfo :
                classes.badgeSecondary
              }
            >
              {sprint.status === "active" ? "Aktywny" :
               sprint.status === "planned" ? "Planowany" : "Ukończony"}
            </span>
            
            {sprint.status === "active" && daysRemaining >= 0 && (
              <div className={`text-sm ${classes.textMuted} flex items-center gap-1`}>
                <Calendar className="w-4 h-4" />
                {daysRemaining} dni pozostało
              </div>
            )}
          </div>

          {/* Progress */}
          {sprint.status !== "planned" && stats.totalIssues > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Postęp</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold">{stats.completedIssues}/{stats.totalIssues}</div>
              <div className={`text-xs ${classes.textMuted}`}>Zadania</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold">{stats.completedStoryPoints}/{stats.totalStoryPoints}</div>
              <div className={`text-xs ${classes.textMuted}`}>Story Points</div>
            </div>
          </div>

          {/* Dates */}
          <div className={`text-xs ${classes.textMuted} space-y-1`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              {sprint.status === "planned" && (
                <button className={`${classes.btnSuccess} flex-1 text-sm`} onClick={() => handleStartSprint(sprint)}>
                  <Play className="w-4 h-4 mr-1" />
                  Rozpocznij
                </button>
              )}
              
              {sprint.status === "active" && (
                <button className={`${classes.btnSecondary} flex-1 text-sm`} onClick={() => handleEndSprint(sprint)}>
                  <Square className="w-4 h-4 mr-1" />
                  Zakończ
                </button>
              )}
              
              {sprint.status === "completed" && (
                <button className={`${classes.btnSecondary} flex-1 text-sm`}>
                  <Target className="w-4 h-4 mr-1" />
                  Raport
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sprinty</h1>
          <p className={classes.textMuted}>
            Zarządzaj sprintami i planuj iteracje rozwoju
          </p>
        </div>
        
        <button 
          onClick={handleCreateSprint}
          className={classes.btnPrimary}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy Sprint
        </button>
      </div>

      {/* Active Sprints */}
      {activeSprints.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Aktywne Sprinty</h2>
            <span className={classes.badgeSuccess}>
              {activeSprints.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSprints.map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} />
            ))}
          </div>
        </div>
      )}

      {/* Planned Sprints */}
      {plannedSprints.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Planowane Sprinty</h2>
            <span className={classes.badgeInfo}>
              {plannedSprints.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plannedSprints.map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Ukończone Sprinty</h2>
            <span className={classes.badgeSecondary}>
              {completedSprints.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedSprints.slice(0, 6).map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} />
            ))}
          </div>
          
          {completedSprints.length > 6 && (
            <div className="text-center">
              <Button variant="outline">
                Pokaż więcej ukończonych sprintów
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {sprints.length === 0 && (
        <div className={classes.card}>
          <div className="py-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🏃‍♂️</div>
              <div>
                <h3 className="text-lg font-semibold">Brak sprintów</h3>
                <p className={classes.textMuted}>
                  Utwórz swój pierwszy sprint, aby rozpocząć pracę w iteracjach
                </p>
              </div>
              <button className={classes.btnPrimary} onClick={handleCreateSprint}>
                <Plus className="w-4 h-4 mr-2" />
                Utwórz pierwszy sprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backlog Dock */}
      <BacklogDock
        issues={issues}
        sprints={sprints}
        onViewDetails={onViewIssue || (() => {})}
        onCreateIssue={handleCreateIssue}
        onEditIssue={handleEditIssue}
        onDeleteIssue={handleDeleteIssue}
        onMoveToSprint={handleMoveToSprint}
      />

        <SprintForm
          sprint={editingSprint}
          sprints={sprints}
          open={isSprintFormOpen}
          onOpenChange={setIsSprintFormOpen}
          onSave={handleSaveSprint}
        />

        {endingSprint && (
          <EndSprintModal
            sprint={endingSprint}
            issues={issues}
            sprints={sprints}
            open={isEndSprintModalOpen}
            onOpenChange={setIsEndSprintModalOpen}
            onEndSprint={handleEndSprintConfirm}
          />
        )}
      </div>
    )
  }

