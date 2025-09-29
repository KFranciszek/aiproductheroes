"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { priorityColors } from "@/lib/data";
import type { Issue, IssueStatus, Sprint } from "@/types";

interface KanbanBoardProps {
  sprint: Sprint;
  issues: Issue[];
  onUpdateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
}

const columns: { id: IssueStatus; title: string; color: string; dotColor: string }[] = [
  { 
    id: "Todo", 
    title: "To Do", 
    color: "bg-gray-50 border-gray-200",
    dotColor: "text-status-todo"
  },
  {
    id: "In Progress",
    title: "In Progress",
    color: "bg-blue-50 border-blue-200",
    dotColor: "text-status-in-progress"
  },
  {
    id: "In Review",
    title: "In Review",
    color: "bg-yellow-50 border-yellow-200",
    dotColor: "text-status-in-review"
  },
  { 
    id: "Done", 
    title: "Done", 
    color: "bg-green-50 border-green-200",
    dotColor: "text-status-done"
  },
];

export function KanbanBoard({
  sprint,
  issues,
  onUpdateIssueStatus,
}: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [sprintIssues, setSprintIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setMounted(true);
    setSprintIssues(issues.filter((issue) => issue.sprintId === sprint.id));
  }, [issues, sprint.id]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as IssueStatus;
    onUpdateIssueStatus(draggableId, newStatus);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-4 pb-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((column) => {
          const columnIssues = sprintIssues.filter(
            (issue) => issue.status === column.id
          );

          return (
            <div key={column.id} className="kanban-column w-1/4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className={column.dotColor}>●</span> 
                  {column.title}
                </h2>
                <span className="text-sm font-medium text-muted-light dark:text-muted-dark">
                  {columnIssues.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {columnIssues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 cursor-grab active:cursor-grabbing transition-shadow ${
                              snapshot.isDragging ? "shadow-lg rotate-1" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-semibold text-sm">{issue.title}</p>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                issue.priority === 'P0' ? 'bg-priority-p0/10 text-priority-p0 ring-priority-p0/20' :
                                issue.priority === 'P1' ? 'bg-priority-p1/10 text-priority-p1 ring-priority-p1/20' :
                                issue.priority === 'P2' ? 'bg-priority-p2/10 text-priority-p2 ring-priority-p2/20' :
                                issue.priority === 'P3' ? 'bg-priority-p3/10 text-priority-p3 ring-priority-p3/20' :
                                issue.priority === 'P4' ? 'bg-priority-p4/10 text-priority-p4 ring-priority-p4/20' :
                                'bg-priority-p5/10 text-priority-p5 ring-priority-p5/20'
                              }`}>
                                {issue.priority}
                              </span>
                            </div>
                            
                            {issue.description && (
                              <p className="text-xs text-muted-light dark:text-muted-dark mb-3">
                                {issue.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                {issue.id}
                              </span>
                              {issue.assignee && (
                                <div 
                                  className="h-6 w-6 rounded-full bg-cover bg-center ring-2 ring-surface-light dark:ring-surface-dark"
                                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUXhjkTwyRgrhYaoyHgAwNg1nPLcLtqGPqxhBKC4XHaQYBZupBGZgZhBKckOq_FI6zetXv6FhinEvuMDC8LHdwh4dIZVAMhvNVK1Wy4t1GnXHg9tSEYAOeACJchIfUOd-w7nZJjS60xfHATl4TYs-7LOudXYI8n9MkYqKlBtwHIxzREK5vwBSJmFtsh9vo6HpXczGBC76TFftjglc5l0_NCXvbWWU2Sx46SL_DapsHUsFZicudqllIg5f2AODBtC5u56r9Yt5SKf6_")'}}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
