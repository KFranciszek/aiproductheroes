"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/demo3/ui/sheet"
import { useData } from "@/lib/demo3/data-context"
import { Badge } from "@/components/demo3/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Separator } from "@/components/demo3/ui/separator"
import { Button } from "@/components/demo3/ui/button"
import { MoreHorizontal, Star, Milestone, Calendar, User, Tag, Paperclip } from "lucide-react"
import { cn } from "@/lib/demo3/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/demo3/ui/tabs"
import { CommentSection } from "@/components/demo3/comment-section"
import { priorityColors, statusColors, statusLabels } from "@/lib/demo3/constants"

interface IssueDetailViewProps {
  issueId: string
  open: boolean
  onClose: () => void
}

export function IssueDetailView({ issueId, open, onClose }: IssueDetailViewProps) {
  const { issues, users, sprints, toggleFavorite } = useData()
  const issue = issues.find((i) => i.id === issueId)

  if (!issue) return null

  const assignee = users.find((u) => u.id === issue.assigneeId)
  const sprint = sprints.find((s) => s.id === issue.sprintId)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">{issue.key}</span>
              <h2 className="text-2xl font-bold tracking-tight">{issue.title}</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(issue.id)}>
                <Star className={cn("h-4 w-4", issue.favorite && "fill-yellow-500 text-yellow-500")} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <div className="px-6">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <TabsContent value="details" className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground">{issue.description || "No description provided."}</p>
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Milestone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="outline" className={cn("text-xs", statusColors[issue.status])}>
                      {statusLabels[issue.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Priority</span>
                    <Badge className={cn("text-xs", priorityColors[issue.priority])}>{issue.priority}</Badge>
                  </div>
                   <Separator />
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Assignee</span>
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatarUrl} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                   <div className="flex items-center gap-3">
                    <Milestone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sprint</span>
                     <span className="text-sm text-muted-foreground">{sprint?.name || "None"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="flex-1 overflow-auto p-6">
               <CommentSection issueId={issue.id} />
            </TabsContent>
            <TabsContent value="attachments" className="flex-1 overflow-auto p-6">
              <div className="text-center text-muted-foreground py-12">
                <Paperclip className="mx-auto h-8 w-8 mb-2" />
                <p>Attachments functionality coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
