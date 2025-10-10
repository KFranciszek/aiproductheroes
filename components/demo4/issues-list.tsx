"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { useUI } from "@/lib/demo4/ui-context";
import type { Issue, Priority, Status } from "@/lib/demo4/types";
import { IssueForm } from "./issue-form";

const priorityColors = {
  P0: "bg-[var(--priority-p0-bg)] text-[var(--priority-p0-text)] border-[var(--priority-p0-border)]",
  P1: "bg-[var(--priority-p1-bg)] text-[var(--priority-p1-text)] border-[var(--priority-p1-border)]",
  P2: "bg-[var(--priority-p2-bg)] text-[var(--priority-p2-text)] border-[var(--priority-p2-border)]",
  P3: "bg-[var(--priority-p3-bg)] text-[var(--priority-p3-text)] border-[var(--priority-p3-border)]",
};

const statusColors = {
  todo: "bg-[var(--status-todo-bg)] text-[var(--status-todo-text)]",
  in_progress: "bg-[var(--status-progress-bg)] text-[var(--status-progress-text)]",
  in_review: "bg-[var(--status-review-bg)] text-[var(--status-review-text)]",
  blocked: "bg-[var(--status-blocked-bg)] text-[var(--status-blocked-text)]",
  done: "bg-[var(--status-done-bg)] text-[var(--status-done-text)]",
};

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  blocked: "Blocked",
  done: "Done",
};

export function IssuesList() {
  const { issues, users, sprints } = useData();
  const { openIssueDetail, viewMode, setViewMode, density } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [issueFormOpen, setIssueFormOpen] = useState(false);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getAssignee = (assigneeId?: string) => {
    return assigneeId ? users.find(u => u.id === assigneeId) : null;
  };

  const getSprint = (sprintId?: string) => {
    return sprintId ? sprints.find(s => s.id === sprintId) : null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Issues</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {filteredIssues.length} {filteredIssues.length === 1 ? "issue" : "issues"}
            </p>
          </div>

          <Button 
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90"
            onClick={() => setIssueFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="P0">P0 - Critical</SelectItem>
              <SelectItem value="P1">P1 - High</SelectItem>
              <SelectItem value="P2">P2 - Medium</SelectItem>
              <SelectItem value="P3">P3 - Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === "table" ? (
          <div className="border border-[var(--border-default)] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Assignee</TableHead>
                  <TableHead className="w-[150px]">Sprint</TableHead>
                  <TableHead className="w-[80px] text-center">SP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-[var(--text-tertiary)]">
                      No issues found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => {
                    const assignee = getAssignee(issue.assigneeId);
                    const sprint = getSprint(issue.sprintId);

                    return (
                      <TableRow
                        key={issue.id}
                        className="cursor-pointer hover:bg-[var(--bg-hover)]"
                        onClick={() => openIssueDetail(issue.id)}
                      >
                        <TableCell className="font-mono text-xs text-[var(--text-secondary)]">
                          {issue.key}
                        </TableCell>
                        <TableCell className="font-medium text-[var(--text-primary)]">
                          {issue.title}
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
                            {statusLabels[issue.status as keyof typeof statusLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={assignee.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--text-tertiary)]">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[var(--text-secondary)]">
                            {sprint?.name || "Backlog"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {issue.storyPoints || "-"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[var(--text-tertiary)]">
                No issues found
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const assignee = getAssignee(issue.assigneeId);
                const sprint = getSprint(issue.sprintId);

                return (
                  <div
                    key={issue.id}
                    onClick={() => openIssueDetail(issue.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openIssueDetail(issue.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Issue ${issue.key}: ${issue.title}`}
                    className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-4 cursor-pointer hover:border-[var(--border-strong)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {issue.key}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
                          {issue.priority}
                        </Badge>
                        {issue.storyPoints && (
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} SP
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-medium text-[var(--text-primary)] mb-2 line-clamp-2">
                      {issue.title}
                    </h3>

                    {issue.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                      <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
                        {statusLabels[issue.status as keyof typeof statusLabels]}
                      </Badge>

                      {assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={assignee.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

      <IssueForm open={issueFormOpen} onOpenChange={setIssueFormOpen} />
