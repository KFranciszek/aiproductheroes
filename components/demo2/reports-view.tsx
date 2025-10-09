"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle2
} from "lucide-react"
import type { Issue, Sprint } from "@/types/demo2"

interface ReportsViewProps {
  issues: Issue[]
  sprints: Sprint[]
}

export function ReportsView({ issues, sprints }: ReportsViewProps) {
  const activeSprint = sprints.find(sprint => sprint.status === "active")
  const completedSprints = sprints.filter(sprint => sprint.status === "completed")
  
  // Calculate metrics
  const totalIssues = issues.length
  const completedIssues = issues.filter(issue => issue.status === "done").length
  const completionRate = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0
  
  const priorityBreakdown = {
    P0: issues.filter(issue => issue.priority === "P0").length,
    P1: issues.filter(issue => issue.priority === "P1").length,
    P2: issues.filter(issue => issue.priority === "P2").length,
    P3: issues.filter(issue => issue.priority === "P3").length,
  }

  const statusBreakdown = {
    todo: issues.filter(issue => issue.status === "todo").length,
    in_progress: issues.filter(issue => issue.status === "in_progress").length,
    in_review: issues.filter(issue => issue.status === "in_review").length,
    blocked: issues.filter(issue => issue.status === "blocked").length,
    done: issues.filter(issue => issue.status === "done").length,
  }

  const teamPerformance = [
    { name: "Anna Kowalska", completed: 8, total: 12, velocity: 32 },
    { name: "Michał Nowak", completed: 6, total: 10, velocity: 28 },
    { name: "Katarzyna Wiśniewska", completed: 5, total: 8, velocity: 24 },
    { name: "Tomasz Lewandowski", completed: 3, total: 6, velocity: 16 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Raporty & Analityki</h1>
          <p className="text-muted-foreground">
            Szczegółowe analizy wydajności zespołu i projektów
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Eksportuj raporty
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Wszystkie Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIssues}</div>
            <p className="text-xs opacity-75 mt-1">w całym projekcie</p>
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
            <div className="text-3xl font-bold">{completedIssues}</div>
            <p className="text-xs opacity-75 mt-1">{Math.round(completionRate)}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Sprinty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sprints.length}</div>
            <p className="text-xs opacity-75 mt-1">{completedSprints.length} ukończonych</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Cycle Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2</div>
            <p className="text-xs opacity-75 mt-1">dni na zadanie</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Podział według priorytetu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = totalIssues > 0 ? (count / totalIssues) * 100 : 0
              const color = priority === "P0" ? "bg-red-500" :
                           priority === "P1" ? "bg-orange-500" :
                           priority === "P2" ? "bg-blue-500" : "bg-gray-500"
              
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{priority}</span>
                    <span className="text-sm text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Podział według statusu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statusBreakdown).map(([status, count]) => {
              const percentage = totalIssues > 0 ? (count / totalIssues) * 100 : 0
              const color = status === "done" ? "bg-green-500" :
                           status === "in_progress" ? "bg-blue-500" :
                           status === "in_review" ? "bg-yellow-500" :
                           status === "blocked" ? "bg-red-500" : "bg-gray-500"
              
              const statusLabel = status === "todo" ? "To Do" :
                                 status === "in_progress" ? "In Progress" :
                                 status === "in_review" ? "In Review" :
                                 status === "blocked" ? "Blocked" : "Done"
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{statusLabel}</span>
                    <span className="text-sm text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Wydajność zespołu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member) => {
              const completionRate = (member.completed / member.total) * 100
              
              return (
                <div key={member.name} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{member.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{member.completed}/{member.total} zadań</span>
                      <Badge variant="outline">{member.velocity} SP</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sprint Velocity */}
      {activeSprint && (
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Aktualny Sprint - {activeSprint.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {issues.filter(i => i.sprintId === activeSprint.id).length}
                </div>
                <div className="text-sm text-muted-foreground">Wszystkie zadania</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.sprintId === activeSprint.id && i.status === "done").length}
                </div>
                <div className="text-sm text-muted-foreground">Ukończone</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {issues.filter(i => i.sprintId === activeSprint.id)
                    .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Story Points</div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                AI Insights
              </h4>
              <p className="text-sm text-muted-foreground">
                Obecne tempo pracy wskazuje na ukończenie sprintu w 85% zaplanowanego zakresu. 
                Zespół pracuje efektywnie, ale zadanie TASK-004 może opóźnić dostawę.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

