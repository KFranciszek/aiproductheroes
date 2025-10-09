"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  User,
  Calendar,
  AlertTriangle,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import type { Issue, Sprint } from "@/types/demo2"

interface BacklogDockProps {
  issues: Issue[]
  sprints: Sprint[]
  onViewDetails: (issueId: string) => void
  onCreateIssue?: () => void
  onEditIssue?: (issue: Issue) => void
  onDeleteIssue?: (issueId: string) => void
  onMoveToSprint?: (issueId: string, sprintId: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "P0": return "bg-red-500 text-white"
    case "P1": return "bg-orange-500 text-white"
    case "P2": return "bg-blue-500 text-white"
    case "P3": return "bg-gray-500 text-white"
    default: return "bg-gray-500 text-white"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo": return "bg-gray-100 text-gray-800 border-gray-200"
    case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
    case "in_review": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "blocked": return "bg-red-100 text-red-800 border-red-200"
    case "done": return "bg-green-100 text-green-800 border-green-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function BacklogDock({ 
  issues, 
  sprints, 
  onViewDetails, 
  onCreateIssue, 
  onEditIssue, 
  onDeleteIssue,
  onMoveToSprint 
}: BacklogDockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter issues that are not assigned to any sprint (backlog items)
  const backlogIssues = issues.filter(issue => !issue.sprintId)
  
  // Filter by search term
  const filteredBacklogIssues = backlogIssues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort by priority (P0 first) and creation date
  const sortedBacklogIssues = filteredBacklogIssues.sort((a, b) => {
    const priorityOrder = { "P0": 0, "P1": 1, "P2": 2, "P3": 3 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const activeSprints = sprints.filter(sprint => sprint.status === "active" || sprint.status === "planned")

  return (
    <Card className="sticky bottom-0 z-10 bg-background/95 backdrop-blur border-t-2">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Backlog</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {backlogIssues.length} zadań
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {onCreateIssue && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateIssue()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj zadanie
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Szukaj w backlogu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Backlog Items */}
          <ScrollArea className="h-80">
            {sortedBacklogIssues.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <h3 className="font-semibold mb-1">
                  {backlogIssues.length === 0 ? "Pusty backlog" : "Brak wyników"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {backlogIssues.length === 0 
                    ? "Wszystkie zadania są przypisane do sprintów"
                    : "Nie znaleziono zadań pasujących do wyszukiwania"
                  }
                </p>
                {backlogIssues.length === 0 && onCreateIssue && (
                  <Button variant="outline" onClick={onCreateIssue}>
                    <Plus className="w-4 h-4 mr-2" />
                    Utwórz pierwsze zadanie
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedBacklogIssues.map((issue) => (
                  <Card 
                    key={issue.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                    style={{ borderLeftColor: issue.priority === "P0" ? "#ef4444" : issue.priority === "P1" ? "#f97316" : issue.priority === "P2" ? "#3b82f6" : "#6b7280" }}
                    onClick={() => onViewDetails(issue.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {issue.key}
                            </Badge>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status.replace("_", " ")}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-sm line-clamp-1 mb-2">
                            {issue.title}
                          </h4>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {issue.assignee && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{issue.assignee}</span>
                              </div>
                            )}
                            
                            {issue.storyPoints && (
                              <div className="flex items-center gap-1">
                                <span>{issue.storyPoints} SP</span>
                              </div>
                            )}
                            
                            {issue.dueAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(issue.dueAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            {issue.status === "blocked" && (
                              <div className="flex items-center gap-1 text-red-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Zablokowane</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {/* Move to Sprint Dropdown */}
                          {onMoveToSprint && activeSprints.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {activeSprints.map(sprint => (
                                  <DropdownMenuItem 
                                    key={sprint.id}
                                    onClick={() => onMoveToSprint(issue.id, sprint.id)}
                                  >
                                    Przenieś do {sprint.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          
                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewDetails(issue.id)}>
                                <Eye className="h-3 w-3 mr-2" />
                                Zobacz szczegóły
                              </DropdownMenuItem>
                              {onEditIssue && (
                                <DropdownMenuItem onClick={() => onEditIssue(issue)}>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Edytuj
                                </DropdownMenuItem>
                              )}
                              {onDeleteIssue && (
                                <DropdownMenuItem 
                                  onClick={() => onDeleteIssue(issue.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Usuń
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  )
}
