"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IssueForm } from "./issue-form"
import { Search, Plus, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Issue, Sprint, Priority, IssueStatus } from "@/types"

interface IssuesListProps {
  issues: Issue[]
  sprints: Sprint[]
  onCreateIssue: (issueData: Partial<Issue>) => void
  onEditIssue: (issue: Issue) => void
  onDeleteIssue: (issueId: string) => void
  onAssignToSprint: (issueId: string, sprintId: string | undefined) => void
}

export function IssuesList({
  issues,
  sprints,
  onCreateIssue,
  onEditIssue,
  onDeleteIssue,
  onAssignToSprint,
}: IssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all")
  const [sprintFilter, setSprintFilter] = useState<string>("all")

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.assignee.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesSprint =
      sprintFilter === "all" || (sprintFilter === "backlog" && !issue.sprintId) || issue.sprintId === sprintFilter

    return matchesSearch && matchesPriority && matchesStatus && matchesSprint
  })

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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-light dark:text-muted-dark" />
        <Input
          placeholder="Search title, description, assignee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
        />
      </div>

      {/* Filter Buttons */}
      <div className="space-y-4">
        {/* Priority Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-light dark:text-muted-dark">Priority:</span>
          <div className="flex gap-2">
            {["P0", "P1", "P2", "all"].map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority as Priority | "all")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  priorityFilter === priority
                    ? priority === "all" 
                      ? "bg-primary text-white" 
                      : getPriorityColor(priority as Priority)
                    : priority === "all"
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {priority === "all" ? "All" : priority}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-light dark:text-muted-dark">Status:</span>
          <div className="flex gap-2">
            {["Todo", "In Progress", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as IssueStatus | "all")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  statusFilter === status
                    ? status === "all" 
                      ? "bg-primary text-white" 
                      : getStatusColor(status as IssueStatus)
                    : status === "all"
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Sprint Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-light dark:text-muted-dark">Sprint:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSprintFilter("all")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                sprintFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              All Sprints
            </button>
            <button
              onClick={() => setSprintFilter("backlog")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                sprintFilter === "backlog"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Backlog
            </button>
            {sprints.map((sprint) => (
              <button
                key={sprint.id}
                onClick={() => setSprintFilter(sprint.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  sprintFilter === sprint.id
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {sprint.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">ID</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">TITLE</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">DESCRIPTION</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">PRIORITY</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">STATUS</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark">ASSIGNEE</th>
                <th className="text-left p-4 font-medium text-muted-light dark:text-muted-dark"></th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue, index) => (
                <tr 
                  key={issue.id} 
                  className={cn(
                    "border-b border-border-light dark:border-border-dark hover:bg-muted/50 transition-colors",
                    index === filteredIssues.length - 1 && "border-b-0"
                  )}
                >
                  <td className="p-4 text-sm font-mono text-muted-light dark:text-muted-dark">
                    {issue.id}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {issue.title}
                  </td>
                  <td className="p-4 text-sm text-muted-light dark:text-muted-dark max-w-xs truncate">
                    {issue.description}
                  </td>
                  <td className="p-4">
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-light dark:text-muted-dark">
                    {issue.assignee || "-"}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No issues found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
