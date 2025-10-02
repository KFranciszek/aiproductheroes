"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IssueForm } from "./issue-form"
import { IssueCard } from "./issue-card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowUpDown, 
  Star, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "./search-bar"
import { IssueAssignmentDialog } from "./issue-assignment-dialog"
import { FavoriteButton } from "./favorite-button"
import { priorityColors, statusColors } from "@/lib/data"
import { SavedFilter } from "@/types"
import type { Issue, Sprint, Priority, IssueStatus } from "@/types"

interface IssuesListProps {
  issues: Issue[]
  sprints: Sprint[]
  onCreateIssue: (issueData: Partial<Issue>) => void
  onEditIssue: (issue: Issue) => void
  onDeleteIssue: (issueId: string) => void
  onAssignToSprint: (issueId: string, sprintId: string | undefined) => void
  onToggleFavorite?: (issueId: string) => void
  onViewDetails?: (issueId: string) => void
}

export function IssuesList({
  issues,
  sprints,
  onCreateIssue,
  onEditIssue,
  onDeleteIssue,
  onAssignToSprint,
  onToggleFavorite,
  onViewDetails,
}: IssuesListProps) {
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [sortField, setSortField] = useState<keyof Issue | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleFilteredResults = (filtered: Issue[]) => {
    setFilteredIssues(filtered)
  }

  const handleSaveFilter = (filter: SavedFilter) => {
    setSavedFilters(prev => [...prev, filter])
  }

  const handleSort = (field: keyof Issue) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortedIssues = () => {
    if (!sortField) return filteredIssues

    return [...filteredIssues].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === bValue) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  }

  const getSortIcon = (field: keyof Issue) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "P0": return "bg-priority-p0 text-white"
      case "P1": return "bg-priority-p1 text-white"
      case "P2": return "bg-priority-p2 text-white"
      case "P3": return "bg-priority-p3 text-white"
      case "P4": return "bg-priority-p4 text-white"
      case "P5": return "bg-priority-p5 text-white"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "Todo": return "bg-gray-100 text-gray-800"
      case "In Progress": return "bg-blue-100 text-blue-800"
      case "In Review": return "bg-yellow-100 text-yellow-800"
      case "Done": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const sortedIssues = getSortedIssues()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Issues Screen (Task List)</h1>
        <IssueForm
          sprints={sprints}
          onSubmit={onCreateIssue}
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          }
        />
      </div>

      {/* Zaawansowane wyszukiwanie */}
      <SearchBar
        issues={issues}
        onFilteredResults={handleFilteredResults}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />

      {/* Issues Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-2">
                  ID
                  {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Title
                  {getSortIcon('title')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-2">
                  Priority
                  {getSortIcon('priority')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('assignee')}
              >
                <div className="flex items-center gap-2">
                  Assignee
                  {getSortIcon('assignee')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('sprintId')}
              >
                <div className="flex items-center gap-2">
                  Sprint
                  {getSortIcon('sprintId')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Created
                  {getSortIcon('createdAt')}
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedIssues.map((issue) => {
              const sprint = sprints.find((s) => s.id === issue.sprintId)
              return (
                <TableRow 
                  key={issue.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetails?.(issue.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {onToggleFavorite && (
                      <FavoriteButton
                        issueId={issue.id}
                        isFavorite={issue.isFavorite || false}
                        onToggle={onToggleFavorite}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {issue.id}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      <div className="font-medium truncate">{issue.title}</div>
                      {issue.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {issue.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[issue.priority]} variant="secondary">
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[issue.status]} variant="outline">
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {issue.assignee || '-'}
                  </TableCell>
                  <TableCell>
                    {sprint ? (
                      <Badge variant="secondary" className="text-xs">
                        {sprint.name}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Backlog
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                          onSubmit={(issueData) => {
                            const updatedIssue: Issue = { ...issue, ...issueData }
                            onEditIssue(updatedIssue)
                          }}
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
                              <AlertDialogAction 
                                onClick={() => onDeleteIssue(issue.id)} 
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {sortedIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No issues found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
