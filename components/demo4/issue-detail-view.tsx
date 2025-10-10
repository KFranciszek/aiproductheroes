"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  MoreHorizontal, 
  Calendar,
  User,
  Tag,
  Hash
} from "lucide-react";
import { useUI } from "@/lib/demo4/ui-context";
import { useData } from "@/lib/demo4/data-context";

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

export function IssueDetailView() {
  const { selectedIssueId, closeIssueDetail } = useUI();
  const { issues, users, comments, sprints } = useData();

  const issue = issues.find(i => i.id === selectedIssueId);
  const assignee = issue?.assigneeId ? users.find(u => u.id === issue.assigneeId) : null;
  const sprint = issue?.sprintId ? sprints.find(s => s.id === issue.sprintId) : null;
  const issueComments = comments.filter(c => c.issueId === selectedIssueId);

  if (!issue) return null;

  return (
    <Sheet open={!!selectedIssueId} onOpenChange={closeIssueDetail}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[600px] sm:max-w-[90vw] p-0 flex flex-col"
        aria-label="Issue details"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--bg-overlay)] border-b border-[var(--border-default)] px-6 py-4">
          <SheetHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeIssueDetail}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-[var(--text-secondary)]">
                      {issue.key}
                    </span>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                    <Badge className={statusColors[issue.status]}>
                      {statusLabels[issue.status]}
                    </Badge>
                  </div>
                  <SheetTitle className="text-lg truncate">
                    {issue.title}
                  </SheetTitle>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <div className="px-6 pt-4 border-b border-[var(--border-subtle)]">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Szczegóły</TabsTrigger>
                <TabsTrigger value="comments">
                  Komentarze
                  {issueComments.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {issueComments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="activity">Aktywność</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="details" className="p-6 space-y-6 mt-0">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Opis
                  </h3>
                  <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {issue.description || "Brak opisu"}
                  </div>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Szczegóły
                  </h3>

                  {/* Assignee */}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)] w-24">
                      Przypisany
                    </span>
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={assignee.avatarUrl} />
                          <AvatarFallback>
                            {assignee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[var(--text-primary)]">
                          {assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text-tertiary)]">
                        Nieprzypisane
                      </span>
                    )}
                  </div>

                  {/* Sprint */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)] w-24">
                      Sprint
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {sprint?.name || "Backlog"}
                    </span>
                  </div>

                  {/* Story Points */}
                  {issue.storyPoints && (
                    <div className="flex items-center gap-3">
                      <Hash className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text-secondary)] w-24">
                        Story Points
                      </span>
                      <span className="text-sm text-[var(--text-primary)]">
                        {issue.storyPoints}
                      </span>
                    </div>
                  )}

                  {/* Labels */}
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-[var(--text-secondary)] mt-0.5" />
                      <span className="text-sm text-[var(--text-secondary)] w-24">
                        Etykiety
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {issue.labels.map((label) => (
                          <Badge key={label} variant="secondary">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)] w-24">
                      Utworzono
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {new Date(issue.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)] w-24">
                      Zaktualizowano
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {new Date(issue.updatedAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-6 space-y-4 mt-0">
                {issueComments.length > 0 ? (
                  issueComments.map((comment) => {
                    const author = users.find(u => u.id === comment.authorId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={author?.avatarUrl} />
                          <AvatarFallback>
                            {author?.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {author?.name}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                              {new Date(comment.createdAt).toLocaleString("pl-PL")}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-[var(--text-tertiary)]">
                    Brak komentarzy
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="p-6 mt-0">
                <div className="text-center py-8 text-[var(--text-tertiary)]">
                  Historia aktywności
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
