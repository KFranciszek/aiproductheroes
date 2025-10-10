"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Calendar,
  User,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Grid,
  List
} from "lucide-react"
import type { Issue, Sprint } from "@/types/demo2"
import { IssueCardSkeleton, TableSkeleton } from "./skeletons"
import { NoIssuesEmpty, SearchEmpty, FilterEmpty } from "./empty-states"
import { useDemo2Classes } from "./theme-provider"

interface IssuesListProps {
  issues: Issue[]
  sprints: Sprint[]
  onUpdateIssues: (issues: Issue[]) => void
  onViewDetails: (issueId: string) => void
}

// These functions will be replaced by useDemo2Classes hooks in components

export function IssuesList({ issues, sprints, onUpdateIssues, onViewDetails }: IssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const classes = useDemo2Classes()

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const hasActiveFilters = searchTerm || statusFilter !== "all" || priorityFilter !== "all"

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
  }

  const handleCreateIssue = () => {
    // TODO: Open issue form
    console.log("Create issue")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className={classes.textMuted}>
            Zarządzaj wszystkimi zadaniami w projekcie
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center ${classes.border} rounded-lg p-1`}>
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <button className={classes.btnPrimary}>
            <Plus className="w-4 h-4 mr-2" />
            Nowe Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Szukaj zadań..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="todo">Do zrobienia</SelectItem>
                <SelectItem value="in_progress">W trakcie</SelectItem>
                <SelectItem value="in_review">W recenzji</SelectItem>
                <SelectItem value="blocked">Zablokowane</SelectItem>
                <SelectItem value="done">Ukończone</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priorytet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie priorytety</SelectItem>
                <SelectItem value="P0">P0 - Krytyczny</SelectItem>
                <SelectItem value="P1">P1 - Wysoki</SelectItem>
                <SelectItem value="P2">P2 - Średni</SelectItem>
                <SelectItem value="P3">P3 - Niski</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Znaleziono {filteredIssues.length} z {issues.length} issues
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <IssueCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={8} />
        )
      ) : filteredIssues.length === 0 ? (
        // Empty States
        issues.length === 0 ? (
          <NoIssuesEmpty onCreateIssue={handleCreateIssue} />
        ) : searchTerm ? (
          <SearchEmpty searchTerm={searchTerm} onClearSearch={handleClearSearch} />
        ) : hasActiveFilters ? (
          <FilterEmpty onClearFilters={handleClearFilters} />
        ) : null
      ) : (
        // Issues Content
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card 
                key={issue.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onViewDetails(issue.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {issue.key}
                        </Badge>
                        <span className={classes.getPriorityClass(issue.priority)}>
                          {issue.priority}
                        </span>
                      </div>
                      <CardTitle className="text-base line-clamp-2">
                        {issue.title}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(issue.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Zobacz szczegóły
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edytuj
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {issue.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={classes.getStatusClass(issue.status)}>
                      {issue.status.replace("_", " ")}
                    </span>
                    {issue.storyPoints && (
                      <Badge variant="outline" className="text-xs">
                        {issue.storyPoints} SP
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    {issue.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {issue.assignee}
                      </div>
                    )}
                    
                    {issue.dueAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(issue.dueAt).toLocaleDateString()}
                      </div>
                    )}

                    {issue.status === "blocked" && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        Zablokowane
                      </div>
                    )}
                  </div>

                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {issue.labels.map((label, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedIssues.length === filteredIssues.length}
                      onCheckedChange={(checked) => {
                        setSelectedIssues(checked ? filteredIssues.map(i => i.id) : [])
                      }}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Tytuł</TableHead>
                  <TableHead>Priorytet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Przypisany</TableHead>
                  <TableHead className="hidden lg:table-cell">Sprint</TableHead>
                  <TableHead className="hidden lg:table-cell">SP</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow 
                    key={issue.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetails(issue.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIssues.includes(issue.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIssues(prev => 
                            checked 
                              ? [...prev, issue.id]
                              : prev.filter(id => id !== issue.id)
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {issue.key}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate font-medium">{issue.title}</div>
                      {issue.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {issue.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={classes.getPriorityClass(issue.priority)}>
                        {issue.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={classes.getStatusClass(issue.status)}>
                        {issue.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {issue.assignee.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{issue.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {issue.sprintId ? (
                        <Badge variant="outline" className="text-xs">
                          Sprint
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {issue.storyPoints ? (
                        <Badge variant="outline" className="text-xs">
                          {issue.storyPoints} SP
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(issue.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Zobacz szczegóły
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      )}
    </div>
  )
}