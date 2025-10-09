"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  ArrowLeft, 
  Star, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  MessageSquare,
  Paperclip,
  Activity,
  Play,
  Pause,
  Plus
} from "lucide-react"
import type { Issue, Sprint, ActivityLog } from "@/types/demo2"

interface IssueDetailViewProps {
  issue: Issue
  sprints: Sprint[]
  allIssues: Issue[]
  activities: ActivityLog[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (issue: Issue) => void
  onDelete: (issueId: string) => void
}

export function IssueDetailView({ 
  issue, 
  sprints, 
  allIssues, 
  activities, 
  open,
  onOpenChange,
  onEdit, 
  onDelete 
}: IssueDetailViewProps) {
  const [isTracking, setIsTracking] = useState(false)
  
  const sprint = issue.sprintId ? sprints.find(s => s.id === issue.sprintId) : null
  const subtasks = allIssues.filter(i => i.parentId === issue.id)
  const issueActivities = activities.filter(a => a.targetId === issue.id)
  
  const completedSubtasks = subtasks.filter(s => s.status === "done").length
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-red-500 text-white"
      case "P1": return "bg-orange-500 text-white"
      case "P2": return "bg-blue-500 text-white"
      case "P3": return "bg-gray-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800 border-gray-200"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_review": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "blocked": return "bg-red-100 text-red-800 border-red-200"
      case "done": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[560px] max-w-[90vw] p-0">
          {/* Sticky Header - zgodnie z punktem 19.6 specyfikacji */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Zamknij">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zamknij</TooltipContent>
              </Tooltip>
              
              <Badge variant="outline" className="font-mono text-xs shrink-0">
                {issue.key}
              </Badge>
              
              <span className="font-medium truncate">{issue.title}</span>
              
              <Badge className={getPriorityColor(issue.priority)}>
                {issue.priority}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Ulubione">
                    <Star className={`h-4 w-4 ${issue.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dodaj do ulubionych</TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(issue)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(issue.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs - zgodnie z punktem 19.6 specyfikacji */}
          <Tabs defaultValue="details" className="flex-1 flex flex-col">
            <div className="px-4 sticky top-14 bg-background z-10">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Szczegóły</TabsTrigger>
                <TabsTrigger value="comments">Komentarze</TabsTrigger>
                <TabsTrigger value="attachments">Załączniki</TabsTrigger>
                <TabsTrigger value="activity">Aktywność</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="details" className="m-0 p-4">
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status.replace("_", " ")}
                    </Badge>
                    {issue.storyPoints && (
                      <Badge variant="outline">{issue.storyPoints} SP</Badge>
                    )}
                  </div>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Opis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {issue.description ? (
                        <div className="prose prose-sm max-w-none">
                          <p>{issue.description}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">Brak opisu</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Subtasks */}
                  {subtasks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Podzadania ({completedSubtasks}/{subtasks.length})</span>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Dodaj
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Postęp</span>
                            <span>{Math.round(subtaskProgress)}%</span>
                          </div>
                          <Progress value={subtaskProgress} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          {subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <Badge variant="outline" className="text-xs font-mono">
                                {subtask.key}
                              </Badge>
                              <span className="flex-1 text-sm">{subtask.title}</span>
                              <Badge className={getStatusColor(subtask.status)}>
                                {subtask.status.replace("_", " ")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Metadata - zgodnie ze specyfikacją sidebar metadane */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Metadane
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Assignee */}
                      <div>
                        <label className="text-xs text-muted-foreground">Przypisany</label>
                        {issue.assignee ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {issue.assignee.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{issue.assignee}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">Nieprzypisane</p>
                        )}
                      </div>

                      {/* Sprint */}
                      <div>
                        <label className="text-xs text-muted-foreground">Sprint</label>
                        {sprint ? (
                          <div className="space-y-1 mt-1">
                            <p className="text-sm font-medium">{sprint.name}</p>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {sprint.status === "active" ? "Aktywny" : 
                               sprint.status === "planned" ? "Planowany" : "Ukończony"}
                            </Badge>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">Brak sprintu</p>
                        )}
                      </div>

                      {/* Dates */}
                      <div>
                        <label className="text-xs text-muted-foreground">Daty</label>
                        <div className="space-y-2 mt-1">
                          <div>
                            <p className="text-xs text-muted-foreground">Utworzone</p>
                            <p className="text-sm">{formatDate(issue.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Ostatnia zmiana</p>
                            <p className="text-sm">{formatDate(issue.updatedAt)}</p>
                          </div>
                          {issue.dueAt && (
                            <div>
                              <p className="text-xs text-muted-foreground">Termin</p>
                              <p className="text-sm">{formatDate(issue.dueAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* TimeTracker - zgodnie ze specyfikacją */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Tracker
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dzisiaj: 2h 30m</span>
                        <Button
                          size="sm"
                          variant={isTracking ? "destructive" : "default"}
                          onClick={() => setIsTracking(!isTracking)}
                        >
                          {isTracking ? (
                            <>
                              <Pause className="h-3 w-3 mr-1" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Łącznie: 8h 45m
                      </div>
                    </CardContent>
                  </Card>

                  {/* Labels */}
                  {issue.labels && issue.labels.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Etykiety</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {issue.labels.map((label, index) => (
                            <Badge key={index} variant="secondary">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="m-0 p-4">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Brak komentarzy</h3>
                  <p className="text-muted-foreground mb-4">
                    Rozpocznij dyskusję o tym zadaniu
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj komentarz
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="m-0 p-4">
                <div className="text-center py-12">
                  <Paperclip className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Brak załączników</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodaj pliki lub linki do tego zadania
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj załącznik
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="m-0 p-4 space-y-4">
                {issueActivities.length > 0 ? (
                  issueActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {activity.userId.split("-")[1]?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Użytkownik</span>
                          {" "}
                          {activity.action === "created_issue" ? "utworzył zadanie" :
                           activity.action === "status_changed" ? `zmienił status z "${activity.oldValue}" na "${activity.newValue}"` :
                           activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Brak aktywności</h3>
                    <p className="text-muted-foreground">
                      Historia zmian pojawi się tutaj
                    </p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}