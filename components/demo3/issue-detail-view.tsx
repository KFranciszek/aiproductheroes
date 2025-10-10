"use client"
import { Sheet, SheetContent } from "@/components/demo3/ui/sheet"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/demo3/ui/tabs"
import { ScrollArea } from "@/components/demo3/ui/scroll-area"
import { Separator } from "@/components/demo3/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Progress } from "@/components/demo3/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/demo3/ui/dropdown-menu"
import { ArrowLeft, Star, MoreHorizontal, Calendar, User, Zap, Activity, CheckCircle2, Circle } from "lucide-react"
import { mockIssues, mockUsers, mockSprints } from "@/lib/demo3/mock-data"
import { cn } from "@/lib/demo3/utils"
import type { Priority, Status } from "@/lib/demo3/types"

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

interface IssueDetailViewProps {
  issueId: string
  open: boolean
  onClose: () => void
}

export function IssueDetailView({ issueId, open, onClose }: IssueDetailViewProps) {
  const issue = mockIssues.find((i) => i.id === issueId)
  const assignee = issue ? mockUsers.find((u) => u.id === issue.assigneeId) : null
  const sprint = issue ? mockSprints.find((s) => s.id === issue.sprintId) : null

  if (!issue) return null

  const subtasks = mockIssues.filter((i) => issue.subtaskIds?.includes(i.id))
  const completedSubtasks = subtasks.filter((s) => s.status === "done")
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks.length / subtasks.length) * 100 : 0

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[720px] p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <code className="text-xs font-mono text-muted-foreground">{issue.key}</code>
              <Badge className={cn("text-xs", priorityColors[issue.priority])}>{issue.priority}</Badge>
              <Badge variant="outline" className={cn("text-xs", statusColors[issue.status])}>
                {statusLabels[issue.status]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" aria-label="Favorite">
              <Star className={cn("h-4 w-4", issue.favorite && "fill-yellow-500 text-yellow-500")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="details" className="flex flex-col h-[calc(100vh-73px)]">
          <TabsList className="px-6 justify-start rounded-none border-b bg-transparent h-12">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="px-6 py-6">
              <TabsContent value="details" className="mt-0 space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold leading-tight text-balance">{issue.title}</h2>
                </div>

                {/* Description */}
                {issue.description && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Description</h3>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{issue.description}</p>
                    </div>
                  </div>
                )}

                {/* Subtasks */}
                {subtasks.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Subtasks</h3>
                      <span className="text-xs text-muted-foreground">
                        {completedSubtasks.length} / {subtasks.length}
                      </span>
                    </div>
                    <Progress value={subtaskProgress} className="h-2" />
                    <div className="space-y-2">
                      {subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 rounded-lg border p-3">
                          {subtask.status === "done" ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "text-sm flex-1",
                              subtask.status === "done" && "line-through text-muted-foreground",
                            )}
                          >
                            {subtask.title}
                          </span>
                          <code className="text-xs font-mono text-muted-foreground">{subtask.key}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labels */}
                {issue.labels && issue.labels.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {issue.labels.map((label) => (
                        <Badge key={label} variant="secondary">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Metadata */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Details</h3>
                  <div className="grid gap-4">
                    {/* Assignee */}
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-24">Assignee</span>
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>

                    {/* Sprint */}
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-24">Sprint</span>
                      <span className="text-sm font-medium">{sprint?.name || "No sprint"}</span>
                    </div>

                    {/* Story Points */}
                    {issue.storyPoints && (
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-24">Story Points</span>
                        <span className="text-sm font-mono font-medium">{issue.storyPoints}</span>
                      </div>
                    )}

                    {/* Created */}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-24">Created</span>
                      <span className="text-sm">
                        {new Date(issue.createdAt).toLocaleDateString("pl-PL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Updated */}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-24">Updated</span>
                      <span className="text-sm">
                        {new Date(issue.updatedAt).toLocaleDateString("pl-PL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="mt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">No attachments.</p>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mockUsers[0].avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>{mockUsers[0].name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{mockUsers[0].name}</span> changed status from{" "}
                          <Badge variant="outline" className="text-xs">
                            To Do
                          </Badge>{" "}
                          to{" "}
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
