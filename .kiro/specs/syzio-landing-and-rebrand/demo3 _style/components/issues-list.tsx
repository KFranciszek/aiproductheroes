"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutGrid, LayoutList, MoreHorizontal, Plus, Search, Star, Filter } from "lucide-react"
import { mockIssues, mockUsers, mockSprints } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Priority, Status } from "@/lib/types"
import { IssueDetailView } from "@/components/issue-detail-view"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const priorityColors: Record<Priority, string> = {
  P0: "bg-destructive text-destructive-foreground",
  P1: "bg-orange-500 text-white",
  P2: "bg-primary text-primary-foreground",
  P3: "bg-muted text-muted-foreground",
}

const statusColors: Record<Status, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary text-primary-foreground",
  in_review: "bg-info text-white",
  blocked: "bg-destructive text-destructive-foreground",
  done: "bg-success text-white",
}

const statusLabels: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  blocked: "Blocked",
  done: "Done",
}

export function IssuesList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [view, setView] = React.useState<"table" | "cards">("table")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const panel = searchParams.get("panel")
    if (panel) {
      setSelectedIssueId(panel)
    }
  }, [searchParams])

  const filteredIssues = React.useMemo(() => {
    return mockIssues.filter((issue) => {
      const matchesSearch =
        searchQuery === "" ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.key.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [searchQuery, priorityFilter, statusFilter])

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId)
    router.push(`/demo/issues?panel=${issueId}`, { scroll: false })
  }

  const closeIssueDetail = () => {
    setSelectedIssueId(null)
    router.push("/demo/issues", { scroll: false })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">{filteredIssues.length} zadań</p>
        </div>
        <Button>
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
                const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
                const sprint = mockSprints.find((s) => s.id === issue.sprintId)
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
                        {issue.favorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
            const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
            const sprint = mockSprints.find((s) => s.id === issue.sprintId)
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
                      {issue.favorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
    </div>
  )
}
