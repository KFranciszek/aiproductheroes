"use client"

import { useState, useMemo } from "react"
import { Plus, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar, type FilterState } from "./search-bar"
import { IssueCard } from "./issue-card"
import { mockIssues } from "@/lib/mock-data"
import type { Issue } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IssuesListProps {
  onIssueClick: (issue: Issue) => void
}

type ViewMode = "table" | "cards"

export function IssuesList({ onIssueClick }: IssuesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({ status: [], priority: [], type: [] })
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !issue.title.toLowerCase().includes(query) &&
          !issue.id.toLowerCase().includes(query) &&
          !issue.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(issue.status)) {
        return false
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
        return false
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(issue.type)) {
        return false
      }

      return true
    })
  }, [searchQuery, filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary"
      case "in-progress":
        return "default"
      case "in-review":
        return "outline"
      case "done":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0":
        return "destructive"
      case "P1":
        return "default"
      case "P2":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Zadania</h1>
          <p className="text-muted-foreground mt-1">
            {filteredIssues.length} {filteredIssues.length === 1 ? "zadanie" : "zadań"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nowe zadanie
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar onSearch={setSearchQuery} onFilterChange={setFilters} />

      {/* Issues Display */}
      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tytuł</TableHead>
                <TableHead>Priorytet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Przypisany</TableHead>
                <TableHead>Sprint</TableHead>
                <TableHead className="text-right">SP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow
                  key={issue.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => onIssueClick(issue)}
                >
                  <TableCell className="font-mono text-xs">{issue.id}</TableCell>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {issue.assignee && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {issue.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{issue.assignee.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{issue.sprint?.name || "-"}</TableCell>
                  <TableCell className="text-right">{issue.storyPoints || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nie znaleziono zadań spełniających kryteria</p>
        </div>
      )}
    </div>
  )
}
