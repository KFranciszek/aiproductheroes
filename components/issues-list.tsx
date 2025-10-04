"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IssueForm } from "./issue-form"
import { Plus, MoreVertical, Edit, Trash2, Star, StarOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "./search-bar"
import { SavedFilter } from "@/types"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import type { Issue, Sprint, Priority, IssueStatus } from "@/types"

interface IssuesListProps {
  issues: Issue[]
  sprints: Sprint[]
  onCreateIssue: (issueData: Partial<Issue>) => void
  onEditIssue: (issue: Issue) => void
  onDeleteIssue: (issueId: string) => void
  onAssignToSprint: (issueId: string, sprintId: string | undefined) => void
  onToggleFavorite: (issueId: string) => void
  onViewDetails: (issueId: string) => void
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

  const handleFilteredResults = (filtered: Issue[]) => {
    setFilteredIssues(filtered)
  }

  const handleSaveFilter = (filter: SavedFilter) => {
    setSavedFilters(prev => [...prev, filter])
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>Story Points</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => {
              const sprint = sprints.find(s => s.id === issue.sprintId)
              return (
                <TableRow 
                  key={issue.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetails(issue.id)}
                >
                  <TableCell className="font-medium">{issue.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{issue.title}</span>
                      {issue.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    {issue.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {issue.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell>
                    {sprint ? (
                      <Badge variant="secondary">{sprint.name}</Badge>
                    ) : (
                      <Badge variant="outline">Backlog</Badge>
                    )}
                  </TableCell>
                  <TableCell>{issue.storyPoints}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(issue.id)
                        }}
                      >
                        {issue.isFavorite ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditIssue(issue)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteIssue(issue.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No issues found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
