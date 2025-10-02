"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IssueForm } from "./issue-form"
import { IssueAssignmentDialog } from "./issue-assignment-dialog"
import { FavoriteButton } from "./favorite-button"
import { priorityColors, statusColors } from "@/lib/data"
import { calculateProgress } from "@/types"
import type { Issue, Sprint, IssueStatus } from "@/types"

interface IssueCardProps {
  issue: Issue
  sprints: Sprint[]
  allIssues: Issue[]
  onEdit: (issue: Issue) => void
  onDelete: (issueId: string) => void
  onAssignToSprint: (issueId: string, sprintId: string | undefined) => void
  onToggleFavorite: (issueId: string) => void
  onAddSubtask: (parentId: string) => void
  onUpdateSubtaskStatus: (subtaskId: string, status: IssueStatus) => void
  onViewDetails?: (issueId: string) => void
  showSprint?: boolean
}

export function IssueCard({
  issue,
  sprints,
  allIssues,
  onEdit,
  onDelete,
  onAssignToSprint,
  onToggleFavorite,
  onAddSubtask,
  onUpdateSubtaskStatus,
  onViewDetails,
  showSprint = true
}: IssueCardProps) {
  const sprint = sprints.find((s) => s.id === issue.sprintId)
  const progress = calculateProgress(issue, allIssues)
  const subtasks = allIssues.filter(i => i.parentId === issue.id)

  // Wrapper function to convert Partial<Issue> to Issue for onEdit
  const handleEditSubmit = (issueData: Partial<Issue>) => {
    const updatedIssue: Issue = { ...issue, ...issueData }
    onEdit(updatedIssue)
  }

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => onViewDetails?.(issue.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">{issue.id}</span>
              <Badge className={priorityColors[issue.priority]} variant="secondary">
                {issue.priority}
              </Badge>
            </div>
            <h3 className="font-medium leading-tight">{issue.title}</h3>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              issueId={issue.id}
              isFavorite={issue.isFavorite || false}
              onToggle={onToggleFavorite}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <IssueForm
                  issue={issue}
                  sprints={sprints}
                  onSubmit={handleEditSubmit}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
                <IssueAssignmentDialog
                  issue={issue}
                  sprints={sprints}
                  onAssign={onAssignToSprint}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Assign to Sprint
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem onClick={() => onAddSubtask(issue.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subtask
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{issue.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(issue.id)} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="space-y-1">
              {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-2 pl-4 border-l-2 border-muted">
                  <Checkbox
                    checked={subtask.status === 'Done'}
                    onCheckedChange={(checked) =>
                      onUpdateSubtaskStatus(subtask.id, checked ? 'Done' : 'Todo')
                    }
                  />
                  <span className="text-sm">{subtask.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {issue.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={statusColors[issue.status]} variant="outline">
              {issue.status}
            </Badge>
            {showSprint && sprint && (
              <Badge variant="secondary" className="text-xs">
                {sprint.name}
              </Badge>
            )}
            {showSprint && !sprint && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Backlog
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{issue.assignee}</span>
        </div>
      </CardContent>
    </Card>
  )
}
