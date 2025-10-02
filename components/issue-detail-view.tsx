"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  MessageSquare, 
  Paperclip,
  Calendar,
  User,
  AlertCircle
} from "lucide-react"
import { CommentSection } from "./comment-section"
import { FileUploader } from "./file-uploader"
import { TimeTracker } from "./time-tracker"
import { IssueForm } from "./issue-form"
import { FavoriteButton } from "./favorite-button"
import { priorityColors, statusColors } from "@/lib/data"
import { calculateProgress } from "@/types"
import type { 
  Issue, 
  Sprint, 
  Comment, 
  Attachment, 
  TimeEntry,
  ActivityLog 
} from "@/types"

interface IssueDetailViewProps {
  issue: Issue
  sprints: Sprint[]
  allIssues: Issue[]
  comments: Comment[]
  attachments: Attachment[]
  activities: ActivityLog[]
  onBack: () => void
  onEdit: (issue: Issue) => void
  onDelete: (issueId: string) => void
  onToggleFavorite: (issueId: string) => void
  onAddComment: (issueId: string, content: string, parentId?: string) => void
  onFileUpload: (issueId: string, files: File[]) => Promise<void>
  onAddLink: (issueId: string, url: string, name: string) => void
  onDeleteAttachment: (attachmentId: string) => void
  onTimeLogged: (entry: Omit<TimeEntry, 'id'>) => void
}

export function IssueDetailView({
  issue,
  sprints,
  allIssues,
  comments,
  attachments,
  activities,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddComment,
  onFileUpload,
  onAddLink,
  onDeleteAttachment,
  onTimeLogged,
}: IssueDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details")
  const sprint = sprints.find((s) => s.id === issue.sprintId)
  const progress = calculateProgress(issue, allIssues)
  const subtasks = allIssues.filter(i => i.parentId === issue.id)
  const issueComments = comments.filter(c => c.issueId === issue.id)
  const issueAttachments = attachments.filter(a => a.issueId === issue.id)
  const issueActivities = activities.filter(a => a.issueId === issue.id)

  const handleEditSubmit = (issueData: Partial<Issue>) => {
    const updatedIssue: Issue = { ...issue, ...issueData }
    onEdit(updatedIssue)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">{issue.id}</span>
              <Badge className={priorityColors[issue.priority]} variant="secondary">
                {issue.priority}
              </Badge>
              <Badge className={statusColors[issue.status]} variant="outline">
                {issue.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold">{issue.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton
            issueId={issue.id}
            isFavorite={issue.isFavorite || false}
            onToggle={onToggleFavorite}
          />
          <IssueForm
            issue={issue}
            sprints={sprints}
            onSubmit={handleEditSubmit}
            trigger={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edytuj
              </Button>
            }
          />
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              if (confirm(`Czy na pewno chcesz usunąć "${issue.title}"?`)) {
                onDelete(issue.id)
                onBack()
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Usuń
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Szczegóły</TabsTrigger>
              <TabsTrigger value="comments">
                Komentarze ({issueComments.length})
              </TabsTrigger>
              <TabsTrigger value="attachments">
                Załączniki ({issueAttachments.length})
              </TabsTrigger>
              <TabsTrigger value="activity">
                Aktywność ({issueActivities.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Opis</CardTitle>
                </CardHeader>
                <CardContent>
                  {issue.description ? (
                    <p className="text-sm whitespace-pre-wrap">{issue.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Brak opisu</p>
                  )}
                </CardContent>
              </Card>

              {subtasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Podzadania ({subtasks.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <div className="space-y-2">
                        {subtasks.map(subtask => (
                          <div 
                            key={subtask.id} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono text-muted-foreground">
                                {subtask.id}
                              </span>
                              <span className="text-sm">{subtask.title}</span>
                            </div>
                            <Badge className={statusColors[subtask.status]} variant="outline">
                              {subtask.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Time Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Śledzenie czasu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeTracker
                    issueId={issue.id}
                    onTimeLogged={onTimeLogged}
                    currentUserId="CurrentUser"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Komentarze
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentSection
                    issueId={issue.id}
                    comments={issueComments}
                    onAddComment={(content, parentId) => 
                      onAddComment(issue.id, content, parentId)
                    }
                    currentUserId="CurrentUser"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Załączniki
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    issueId={issue.id}
                    onUpload={(files) => onFileUpload(issue.id, files)}
                    onAddLink={(url, name) => onAddLink(issue.id, url, name)}
                    existingAttachments={issueAttachments}
                    onDeleteAttachment={onDeleteAttachment}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historia aktywności</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issueActivities.length > 0 ? (
                      issueActivities
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(activity => (
                          <div key={activity.id} className="flex items-start gap-3 text-sm">
                            <div className="mt-1">
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{activity.userId}</span>
                                <span className="text-muted-foreground">{activity.action}</span>
                              </div>
                              {activity.field && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {activity.field}: {activity.oldValue} → {activity.newValue}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(activity.timestamp).toLocaleString('pl-PL')}
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Brak aktywności
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Przypisany:</span>
                  <span className="font-medium">{issue.assignee || "Brak"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sprint:</span>
                  {sprint ? (
                    <Badge variant="secondary" className="text-xs">
                      {sprint.name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Backlog</span>
                  )}
                </div>

                <Separator />

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>
                    Utworzono: {new Date(issue.createdAt).toLocaleString('pl-PL')}
                  </div>
                  <div>
                    Zaktualizowano: {new Date(issue.updatedAt).toLocaleString('pl-PL')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {sprint && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sprint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm font-medium">{sprint.name}</div>
                <Badge variant="secondary">{sprint.status}</Badge>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Start: {new Date(sprint.startDate).toLocaleDateString('pl-PL')}
                  </div>
                  <div>
                    Koniec: {new Date(sprint.endDate).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
