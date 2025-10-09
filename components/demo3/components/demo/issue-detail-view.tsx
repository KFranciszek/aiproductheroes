"use client"

import { useState } from "react"
import { X, Star, Edit, Trash2, MessageSquare, Activity, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { Issue } from "@/lib/types"
import { mockComments } from "@/lib/mock-data"

interface IssueDetailViewProps {
  issue: Issue
  onClose: () => void
}

export function IssueDetailView({ issue, onClose }: IssueDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0":
        return "destructive"
      case "P1":
        return "default"
      case "P2":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary"
      case "in-progress":
        return "default"
      case "in-review":
        return "outline"
      case "done":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const issueComments = mockComments.filter((c) => c.issueId === issue.id)
  const subtasksCompleted = 2
  const subtasksTotal = 5
  const subtasksProgress = (subtasksCompleted / subtasksTotal) * 100

  return (
    <div className="fixed right-0 top-8 h-[calc(100vh-2rem)] w-[600px] bg-card border-l border-border shadow-2xl overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground font-mono">{issue.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground text-balance leading-tight">{issue.title}</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
          <Badge variant={getStatusColor(issue.status)}>{issue.status}</Badge>
          <Badge variant="outline">{issue.type}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[1fr_200px] gap-6 p-6">
          {/* Main Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Szczegóły
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Komentarze
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">
                  <Activity className="h-4 w-4 mr-2" />
                  Aktywność
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Opis</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{issue.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">Podzadania</h3>
                    <span className="text-xs text-muted-foreground">
                      {subtasksCompleted} / {subtasksTotal}
                    </span>
                  </div>
                  <Progress value={subtasksProgress} className="h-2 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked className="rounded" />
                      <span className="line-through text-muted-foreground">Setup OAuth providers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked className="rounded" />
                      <span className="line-through text-muted-foreground">Create login UI</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Add error handling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Write tests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Update documentation</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-6">
                {issueComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {issueComments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Brak komentarzy</p>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-3 mt-6">
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-foreground">
                      <span className="font-medium">{issue.reporter.name}</span> utworzył zadanie
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-chart-2 mt-1.5" />
                  <div>
                    <p className="text-foreground">
                      <span className="font-medium">{issue.assignee?.name}</span> zmienił status na "in-progress"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.updatedAt).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Przypisany</CardTitle>
              </CardHeader>
              <CardContent>
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {issue.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{issue.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">{issue.assignee.role}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nieprzypisane</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{issue.sprint?.name || "Brak sprintu"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Story Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{issue.storyPoints || "-"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Daty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Utworzono</p>
                  <p className="text-foreground">{new Date(issue.createdAt).toLocaleDateString("pl-PL")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Zaktualizowano</p>
                  <p className="text-foreground">{new Date(issue.updatedAt).toLocaleDateString("pl-PL")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
