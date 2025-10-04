"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  ListTodo, 
  Target, 
  AlertTriangle,
  Calendar,
  TrendingUp 
} from "lucide-react"
import type { Issue, Sprint } from "@/types"

interface PersonalDashboardProps {
  issues: Issue[]
  sprints: Sprint[]
  currentUser?: string
  onNavigate: (view: string) => void
  onViewIssue: (issueId: string) => void
}

export function PersonalDashboard({
  issues,
  sprints,
  currentUser = "current-user",
  onNavigate,
  onViewIssue,
}: PersonalDashboardProps) {
  // Get active sprint
  const activeSprint = sprints.find((s) => s.status === "Active")
  
  // Filter issues for current user
  const myIssues = issues.filter((issue) => issue.assignee === currentUser)
  const myTodo = myIssues.filter((i) => i.status === "Todo")
  const myInProgress = myIssues.filter((i) => i.status === "In Progress")
  const myInReview = myIssues.filter((i) => i.status === "In Review")
  
  // Urgent issues (P0, P1)
  const urgentIssues = myIssues.filter(
    (i) => (i.priority === "P0" || i.priority === "P1") && i.status !== "Done"
  ).slice(0, 3)
  
  // Sprint progress
  const sprintIssues = activeSprint
    ? issues.filter((i) => i.sprintId === activeSprint.id)
    : []
  const completedSprintIssues = sprintIssues.filter((i) => i.status === "Done")
  const sprintProgress = sprintIssues.length > 0
    ? Math.round((completedSprintIssues.length / sprintIssues.length) * 100)
    : 0
  
  // Blocked issues
  const blockedIssues = sprintIssues.filter(
    (i) => i.status === "Todo" && i.parentId
  ).length

  // Days remaining in sprint
  const getDaysRemaining = () => {
    if (!activeSprint) return 0
    const today = new Date('2024-01-20T12:00:00Z')
    const endDate = new Date(activeSprint.endDate)
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">🏠 Twój Dzień</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('pl-PL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Tasks */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Pilne ({urgentIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urgentIssues.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak pilnych zadań</p>
            ) : (
              <div className="space-y-2">
                {urgentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer transition-all duration-150 hover:scale-[1.01]"
                    onClick={() => onViewIssue(issue.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {issue.id} - {issue.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {issue.status}
                      </p>
                    </div>
                    <Badge 
                      variant="destructive"
                      className="ml-2 shrink-0"
                    >
                      {issue.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Tasks */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-blue-500" />
              Twoje zadania ({myIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Todo</span>
                <Badge variant="outline">{myTodo.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <Badge variant="secondary">{myInProgress.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Review</span>
                <Badge variant="secondary">{myInReview.length}</Badge>
              </div>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => onNavigate('issues')}
              >
                Zobacz wszystkie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Overview */}
      {activeSprint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {activeSprint.name}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate('current-sprint')}
              >
                Zobacz Kanban
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Postęp</span>
                  <span className="text-sm font-semibold">{sprintProgress}%</span>
                </div>
                <Progress value={sprintProgress} className="h-2" />
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{completedSprintIssues.length} z {sprintIssues.length} zadań</span>
                  <span>{daysRemaining} dni pozostało</span>
                </div>
              </div>

              {blockedIssues > 0 && (
                <div className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    {blockedIssues} {blockedIssues === 1 ? 'zadanie zablokowane' : 'zadania zablokowane'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📊 Szybki Widok</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={() => onNavigate('current-sprint')}
          >
            <Target className="h-5 w-5" />
            <span className="text-xs">Kanban</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={() => onNavigate('issues')}
          >
            <ListTodo className="h-5 w-5" />
            <span className="text-xs">Wszystkie</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={() => onNavigate('favorites')}
          >
            <Zap className="h-5 w-5" />
            <span className="text-xs">Ulubione</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={() => onNavigate('sprints')}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Sprinty</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

