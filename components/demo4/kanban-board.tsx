"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { useUI } from "@/lib/demo4/ui-context";
import type { Issue, Status } from "@/lib/demo4/types";

const columns: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "var(--status-todo)" },
  { id: "in_progress", label: "In Progress", color: "var(--status-progress)" },
  { id: "in_review", label: "In Review", color: "var(--status-review)" },
  { id: "done", label: "Done", color: "var(--status-done)" },
];

const priorityColors = {
  P0: "bg-[var(--priority-p0-bg)] text-[var(--priority-p0-text)] border-[var(--priority-p0-border)]",
  P1: "bg-[var(--priority-p1-bg)] text-[var(--priority-p1-text)] border-[var(--priority-p1-border)]",
  P2: "bg-[var(--priority-p2-bg)] text-[var(--priority-p2-text)] border-[var(--priority-p2-border)]",
  P3: "bg-[var(--priority-p3-bg)] text-[var(--priority-p3-text)] border-[var(--priority-p3-border)]",
};

interface KanbanBoardProps {
  sprintId: string;
}

export function KanbanBoard({ sprintId }: KanbanBoardProps) {
  const { issues, users, updateIssue } = useData();
  const { openIssueDetail } = useUI();

  const sprintIssues = issues.filter(i => i.sprintId === sprintId);

  const getIssuesByStatus = (status: Status) => {
    return sprintIssues.filter(i => i.status === status);
  };

  const getAssignee = (assigneeId?: string) => {
    return assigneeId ? users.find(u => u.id === assigneeId) : null;
  };

  const handleStatusChange = (issueId: string, newStatus: Status) => {
    updateIssue(issueId, { status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {columns.map((column) => {
        const columnIssues = getIssuesByStatus(column.id);
        const totalSP = columnIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

        return (
          <div key={column.id} className="flex flex-col min-h-[500px]">
            {/* Column Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {column.label}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {columnIssues.length}
                </Badge>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: column.color }} />
              {totalSP > 0 && (
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {totalSP} Story Points
                </p>
              )}
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {columnIssues.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-tertiary)] text-sm">
                  No issues
                </div>
              ) : (
                columnIssues.map((issue) => {
                  const assignee = getAssignee(issue.assigneeId);

                  return (
                    <Card
                      key={issue.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-[var(--bg-elevated)] border-[var(--border-default)]"
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
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                          {issue.key}
                        </span>
                        <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
                          {issue.priority}
                        </Badge>
                      </div>

                      {/* Card Title */}
                      <h4 className="font-medium text-sm text-[var(--text-primary)] mb-2 line-clamp-2">
                        {issue.title}
                      </h4>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                        {assignee ? (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={assignee.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-6 h-6" />
                        )}

                        {issue.storyPoints && (
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} SP
                          </Badge>
                        )}
                      </div>

                      {/* Blocked indicator */}
                      {issue.status === "blocked" && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-[var(--error-text)]">
                          <AlertCircle className="w-3 h-3" />
                          <span>Blocked</span>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
