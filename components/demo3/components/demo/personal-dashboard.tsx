"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, Kanban, List, Star, Calendar } from "lucide-react"
import { mockIssues, mockSprints } from "@/lib/mock-data"
import type { Issue } from "@/lib/types"

interface PersonalDashboardProps {
  onNavigate: (view: "issues" | "current-sprint" | "sprints") => void
  onIssueClick: (issue: Issue) => void
}

export function PersonalDashboard({ onNavigate, onIssueClick }: PersonalDashboardProps) {
  const activeSprint = mockSprints.find((s) => s.status === "active")
  const urgentIssues = mockIssues.filter((i) => i.priority === "P0" && i.status !== "done")
  const myIssues = mockIssues.filter((i) => i.assignee?.id === "1")
  const todoCount = myIssues.filter((i) => i.status === "todo").length
  const inProgressCount = myIssues.filter((i) => i.status === "in-progress").length
  const inReviewCount = myIssues.filter((i) => i.status === "in-review").length

  const sprintIssues = mockIssues.filter((i) => i.sprint?.id === activeSprint?.id)
  const completedSprintIssues = sprintIssues.filter((i) => i.status === "done")
  const sprintProgress = sprintIssues.length > 0 ? (completedSprintIssues.length / sprintIssues.length) * 100 : 0
  const blockedCount = sprintIssues.filter((i) => i.status === "blocked").length

  const today = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Twój Dzień</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Urgent Tasks Card */}
        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Pilne
            </CardTitle>
            <CardDescription>Zadania wymagające natychmiastowej uwagi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentIssues.length === 0 ? (
                <p className="text-sm text-muted-foreground">Brak pilnych zadań</p>
              ) : (
                urgentIssues.slice(0, 3).map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => onIssueClick(issue)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{issue.id}</p>
                      </div>
                      <Badge variant={getPriorityColor(issue.priority)} className="shrink-0">
                        {issue.priority}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Your Tasks Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">Twoje zadania</CardTitle>
            <CardDescription>Podsumowanie Twoich aktywnych zadań</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Todo</span>
                <span className="text-2xl font-bold text-foreground">{todoCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-2xl font-bold text-primary">{inProgressCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">In Review</span>
                <span className="text-2xl font-bold text-chart-2">{inReviewCount}</span>
              </div>
              <Button onClick={() => onNavigate("issues")} variant="outline" className="w-full mt-2" size="sm">
                Zobacz wszystkie
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sprint Overview</CardTitle>
            <CardDescription>{activeSprint?.name || "Brak aktywnego sprintu"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Postęp</span>
                  <span className="text-sm font-medium text-foreground">{Math.round(sprintProgress)}%</span>
                </div>
                <Progress value={sprintProgress} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ukończone</span>
                <span className="text-sm font-medium text-foreground">
                  {completedSprintIssues.length} / {sprintIssues.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pozostało dni</span>
                <span className="text-sm font-medium text-foreground">7</span>
              </div>
              {blockedCount > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-xs text-destructive">{blockedCount} zadań zablokowanych</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick View Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Szybki Widok</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            onClick={() => onNavigate("current-sprint")}
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-accent"
          >
            <Kanban className="h-6 w-6" />
            <span className="font-medium">Kanban</span>
          </Button>
          <Button
            onClick={() => onNavigate("issues")}
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-accent"
          >
            <List className="h-6 w-6" />
            <span className="font-medium">Wszystkie</span>
          </Button>
          <Button
            onClick={() => onNavigate("issues")}
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-accent"
          >
            <Star className="h-6 w-6" />
            <span className="font-medium">Ulubione</span>
          </Button>
          <Button
            onClick={() => onNavigate("sprints")}
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-accent"
          >
            <Calendar className="h-6 w-6" />
            <span className="font-medium">Sprinty</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
