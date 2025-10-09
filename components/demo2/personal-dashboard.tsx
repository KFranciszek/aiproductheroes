"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react"
import type { Issue, Sprint, ViewType } from "@/types/demo2"

interface PersonalDashboardProps {
  issues: Issue[]
  sprints: Sprint[]
  onNavigate: (view: ViewType) => void
  onViewIssue: (issueId: string) => void
}

export function PersonalDashboard({ issues, sprints, onNavigate, onViewIssue }: PersonalDashboardProps) {
  const activeIssues = issues.filter(issue => issue.status !== "done")
  const completedIssues = issues.filter(issue => issue.status === "done")
  const urgentIssues = issues.filter(issue => issue.priority === "P0" || issue.priority === "P1")
  const activeSprint = sprints.find(sprint => sprint.status === "active")
  const myIssues = issues.filter(issue => issue.assignee === "Anna Kowalska")
  
  const sprintProgress = activeSprint ? 
    (issues.filter(i => i.sprintId === activeSprint.id && i.status === "done").length / 
     issues.filter(i => i.sprintId === activeSprint.id).length) * 100 : 0

  const statusCounts = {
    todo: issues.filter(i => i.status === "todo").length,
    in_progress: issues.filter(i => i.status === "in_progress").length,
    in_review: issues.filter(i => i.status === "in_review").length,
    blocked: issues.filter(i => i.status === "blocked").length
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Witaj w Demo2! 👋
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nowoczesny design z naciskiem na dostępność i wydajność. 
          Wszystko w jednym miejscu, bez przełączania kontekstu.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Aktywne Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeIssues.length}</div>
            <p className="text-xs opacity-75 mt-1">w trakcie realizacji</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Ukończone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedIssues.length}</div>
            <p className="text-xs opacity-75 mt-1">w tym miesiącu</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Pilne (P0/P1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urgentIssues.length}</div>
            <p className="text-xs opacity-75 mt-1">wymagają uwagi</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sprint Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(sprintProgress)}%</div>
            <p className="text-xs opacity-75 mt-1">aktualny sprint</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Sprint & Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sprint */}
          {activeSprint && (
            <Card className="shadow-lg border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    {activeSprint.name}
                  </span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Aktywny
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{activeSprint.goal}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Postęp sprintu</span>
                    <span className="font-medium">{Math.round(sprintProgress)}%</span>
                  </div>
                  <Progress value={sprintProgress} className="h-2" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    {issues.filter(i => i.sprintId === activeSprint.id && i.status === "done").length} / {issues.filter(i => i.sprintId === activeSprint.id).length} zadań ukończonych
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate("current-sprint")}
                  >
                    Zobacz Kanban
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Issues */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Najnowsze Issues</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate("issues")}
                >
                  Zobacz wszystkie
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issues.slice(0, 5).map((issue) => (
                  <div 
                    key={issue.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => onViewIssue(issue.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {issue.key} • {issue.assignee} • {issue.storyPoints} SP
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge 
                        variant={issue.priority === "P0" ? "destructive" : 
                                issue.priority === "P1" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {issue.priority}
                      </Badge>
                      <Badge 
                        variant={issue.status === "done" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {issue.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Szybkie Akcje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => onNavigate("issues")}
              >
                <Clock className="w-4 h-4 mr-2" />
                Moje zadania ({myIssues.length})
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate("current-sprint")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Kanban Board
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate("reports")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Raporty
              </Button>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Status Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">To Do</span>
                  <Badge variant="outline">{statusCounts.todo}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Progress</span>
                  <Badge className="bg-blue-100 text-blue-800">{statusCounts.in_progress}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Review</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{statusCounts.in_review}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Blocked</span>
                  <Badge variant="destructive">{statusCounts.blocked}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Zespół
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">4</div>
                <p className="text-sm text-muted-foreground">aktywnych członków</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onNavigate("teams")}
                >
                  Zobacz zespoły
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

