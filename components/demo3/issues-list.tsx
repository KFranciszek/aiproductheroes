"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/demo3/ui/table"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Input } from "@/components/demo3/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/demo3/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/demo3/ui/dropdown-menu"
import { LayoutGrid, LayoutList, MoreHorizontal, Plus, Search, Star, Filter } from "lucide-react"
import { cn } from "@/lib/demo3/utils"
import type { Priority, Status, Issue } from "@/lib/demo3/types"
import { IssueDetailView } from "@/components/demo3/issue-detail-view"
import { Card, CardContent, CardHeader } from "@/components/demo3/ui/card"
import { useData } from "@/lib/demo3/data-context"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/demo3/ui/alert-dialog"
import { IssueForm } from "./issue-form"
import { priorityColors, statusColors, statusLabels } from "@/lib/demo3/constants"

export function IssuesList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { issues, users, sprints, deleteIssue, toggleFavorite } = useData()
  const [view, setView] = React.useState<"table" | "cards">("table")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedIssueToEdit, setSelectedIssueToEdit] = React.useState<Issue | undefined>(undefined)
  const [issueToDelete, setIssueToDelete] = React.useState<Issue | null>(null)
  const isFavoritesView = searchParams.get("filter") === "favorites"

  React.useEffect(() => {
    const panel = searchParams.get("panel")
    if (panel) {
      setSelectedIssueId(panel)
    } else {
      setSelectedIssueId(null)
    }
  }, [searchParams])

  const filteredIssues = React.useMemo(() => {
    return issues.filter((issue) => {
      if (isFavoritesView && !issue.favorite) {
        return false
      }
      const matchesSearch =
        searchQuery === "" ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.key.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [issues, searchQuery, priorityFilter, statusFilter, isFavoritesView])

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId)
    router.push(`/demo3/issues?panel=${issueId}`, { scroll: false })
  }

  const closeIssueDetail = () => {
    setSelectedIssueId(null)
    router.push("/demo3/issues", { scroll: false })
  }
  
  const handleOpenForm = (issue?: Issue) => {
    setSelectedIssueToEdit(issue)
    setIsFormOpen(true)
  }
  
  const handleDeleteClick = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation()
    setIssueToDelete(issue)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isFavoritesView ? "Favorites" : "Issues"}</h1>
          <p className="text-muted-foreground">{filteredIssues.length} zadań</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="P0">P0</SelectItem>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
              <SelectItem value="P3">P3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("table")}
            aria-label="Table view"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("cards")}
            aria-label="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "table" ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[150px]">Assignee</TableHead>
                <TableHead className="w-[120px]">Sprint</TableHead>
                <TableHead className="w-[80px] text-center">SP</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => {
                const assignee = users.find((u) => u.id === issue.assigneeId)
                const sprint = sprints.find((s) => s.id === issue.sprintId)
                return (
                  <TableRow
                    key={issue.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openIssueDetail(issue.id)}
                  >
                    <TableCell>
                      <code className="text-xs font-mono">{issue.key}</code>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(issue.id); }}>
                          <Star className={cn("h-4 w-4 text-muted-foreground hover:text-yellow-500", issue.favorite && "fill-yellow-500 text-yellow-500")} />
                        </button>
                        {issue.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", priorityColors[issue.priority])}>{issue.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusColors[issue.status])}>
                        {statusLabels[issue.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignee.name.split(" ")[0]}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{sprint?.name.split(" - ")[0] || "-"}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-mono">{issue.storyPoints || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenForm(issue) }}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteClick(e, issue)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => {
            const assignee = users.find((u) => u.id === issue.assigneeId)
            const sprint = sprints.find((s) => s.id === issue.sprintId)
            return (
              <Card
                key={issue.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => openIssueDetail(issue.id)}
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <code className="text-xs font-mono text-muted-foreground">{issue.key}</code>
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(issue.id); }}>
                        <Star className={cn("h-4 w-4 text-muted-foreground hover:text-yellow-500", issue.favorite && "fill-yellow-500 text-yellow-500")} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenForm(issue) }}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteClick(e, issue)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h3 className="font-medium leading-tight line-clamp-2">{issue.title}</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn("text-xs", priorityColors[issue.priority])}>{issue.priority}</Badge>
                    <Badge variant="outline" className={cn("text-xs", statusColors[issue.status])}>
                      {statusLabels[issue.status]}
                    </Badge>
                    {issue.storyPoints && (
                      <Badge variant="secondary" className="text-xs font-mono">
                        {issue.storyPoints} SP
                      </Badge>
                    )}
                  </div>
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={assignee.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{assignee.name}</span>
                    </div>
                  )}
                  {sprint && <p className="text-xs text-muted-foreground">Sprint: {sprint.name.split(" - ")[0]}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Issue Detail Drawer */}
      {selectedIssueId && (
        <IssueDetailView issueId={selectedIssueId} open={!!selectedIssueId} onClose={closeIssueDetail} />
      )}
      
      {/* Issue Form Modal */}
      <IssueForm 
        issue={selectedIssueToEdit}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!issueToDelete} onOpenChange={() => setIssueToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the issue <span className="font-medium text-foreground">{issueToDelete?.key}: {issueToDelete?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if(issueToDelete) deleteIssue(issueToDelete.id)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
