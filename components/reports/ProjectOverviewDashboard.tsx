"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import type { User, Issue, Sprint, AutomationMetrics, AIInsight } from "@/types"

interface ProjectOverviewDashboardProps {
  users: User[]
  issues: Issue[]
  sprints: Sprint[]
  automationMetrics: AutomationMetrics
  aiInsights: AIInsight[]
}

export function ProjectOverviewDashboard({ 
  users, 
  issues, 
  sprints, 
  automationMetrics, 
  aiInsights 
}: ProjectOverviewDashboardProps) {
  
  // Ogólne metryki projektu
  const projectMetrics = useMemo(() => {
    const totalIssues = issues.length
    const completedIssues = issues.filter(issue => issue.status === 'Done').length
    const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length
    const todoIssues = issues.filter(issue => issue.status === 'Todo').length
    const inReviewIssues = issues.filter(issue => issue.status === 'In Review').length
    
    const totalStoryPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    const completedStoryPoints = issues
      .filter(issue => issue.status === 'Done')
      .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    
    const avgCompletionTime = completedIssues > 0 
      ? issues.filter(issue => issue.status === 'Done').reduce((sum, issue) => {
          const createdAt = new Date(issue.createdAt)
          const updatedAt = new Date(issue.updatedAt)
          return sum + (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / completedIssues
      : 0

    return {
      totalIssues,
      completedIssues,
      inProgressIssues,
      todoIssues,
      inReviewIssues,
      completionRate: totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0,
      totalStoryPoints,
      completedStoryPoints,
      storyPointsRate: totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      activeUsers: users.filter(u => u.isActive).length,
      totalUsers: users.length,
    }
  }, [issues, users])

  // Trendy w czasie
  const timeTrends = useMemo(() => {
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    
    const dailyData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dayIssues = issues.filter(issue => {
        const issueDate = new Date(issue.createdAt)
        return issueDate.toDateString() === date.toDateString()
      })
      
      const dayCompleted = issues.filter(issue => {
        if (issue.status !== 'Done') return false
        const completionDate = issue.statusHistory?.find(h => h.status === 'Done')?.date
        if (!completionDate) return false
        return new Date(completionDate).toDateString() === date.toDateString()
      })
      
      dailyData.push({
        date: date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
        created: dayIssues.length,
        completed: dayCompleted.length,
        cumulative: issues.filter(issue => {
          const issueDate = new Date(issue.createdAt)
          return issueDate <= date
        }).length
      })
    }
    
    return dailyData
  }, [issues])

  // Metryki sprintów
  const sprintMetrics = useMemo(() => {
    return sprints.slice(-8).map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
      const completedIssues = sprintIssues.filter(issue => issue.status === 'Done')
      const totalPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      const completedPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      
      return {
        name: sprint.name,
        status: sprint.status,
        totalIssues: sprintIssues.length,
        completedIssues: completedIssues.length,
        totalPoints,
        completedPoints,
        completionRate: sprintIssues.length > 0 ? (completedIssues.length / sprintIssues.length) * 100 : 0,
        velocity: completedPoints,
        plannedCapacity: sprint.capacity || 0,
        efficiency: sprint.capacity ? (completedPoints / sprint.capacity) * 100 : 0
      }
    })
  }, [sprints, issues])

  // Metryki według typów zadań
  const issueTypeMetrics = useMemo(() => {
    const typeGroups = issues.reduce((acc, issue) => {
      const type = issue.type || 'Unknown'
      if (!acc[type]) {
        acc[type] = { type, total: 0, completed: 0, storyPoints: 0, completedPoints: 0 }
      }
      acc[type].total++
      if (issue.status === 'Done') acc[type].completed++
      acc[type].storyPoints += issue.storyPoints || 0
      if (issue.status === 'Done') acc[type].completedPoints += issue.storyPoints || 0
      return acc
    }, {} as Record<string, any>)

    return Object.values(typeGroups).map(group => ({
      ...group,
      completionRate: group.total > 0 ? (group.completed / group.total) * 100 : 0,
      pointsRate: group.storyPoints > 0 ? (group.completedPoints / group.storyPoints) * 100 : 0
    }))
  }, [issues])

  // Metryki według priorytetów
  const priorityMetrics = useMemo(() => {
    const priorityGroups = issues.reduce((acc, issue) => {
      if (!acc[issue.priority]) {
        acc[issue.priority] = { priority: issue.priority, total: 0, completed: 0, avgTime: 0 }
      }
      acc[issue.priority].total++
      if (issue.status === 'Done') acc[issue.priority].completed++
      return acc
    }, {} as Record<string, any>)

    // Oblicz średni czas realizacji dla każdego priorytetu
    Object.keys(priorityGroups).forEach(priority => {
      const priorityIssues = issues.filter(issue => issue.priority === priority && issue.status === 'Done')
      if (priorityIssues.length > 0) {
        const avgTime = priorityIssues.reduce((sum, issue) => {
          const createdAt = new Date(issue.createdAt)
          const updatedAt = new Date(issue.updatedAt)
          return sum + (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / priorityIssues.length
        priorityGroups[priority].avgTime = Math.round(avgTime * 10) / 10
      }
    })

    return Object.values(priorityGroups).map(group => ({
      ...group,
      completionRate: group.total > 0 ? (group.completed / group.total) * 100 : 0
    }))
  }, [issues])

  // Aktywne AI Insights
  const activeInsights = useMemo(() => {
    return aiInsights.filter(insight => !insight.dismissed)
  }, [aiInsights])

  return (
    <div className="space-y-6">
      {/* Kluczowe metryki projektu */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Postęp projektu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(projectMetrics.completionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.completedIssues}/{projectMetrics.totalIssues} zadań
            </p>
            <Progress value={projectMetrics.completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(projectMetrics.storyPointsRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.completedStoryPoints}/{projectMetrics.totalStoryPoints} SP
            </p>
            <Progress value={projectMetrics.storyPointsRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Średni czas realizacji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.avgCompletionTime}</div>
            <p className="text-xs text-muted-foreground">dni na zadanie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktywny zespół</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              z {projectMetrics.totalUsers} członków
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trendy w czasie */}
      <Card>
        <CardHeader>
          <CardTitle>Trendy aktywności (ostatnie 30 dni)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <AreaChart data={timeTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="created" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Utworzone zadania"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Ukończone zadania"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wydajność sprintów */}
      <Card>
        <CardHeader>
          <CardTitle>Wydajność sprintów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={sprintMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="velocity" fill="#0088FE" name="Rzeczywista Velocity" />
                <Bar dataKey="plannedCapacity" fill="#00C49F" name="Planowana Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metryki według typów zadań */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wydajność według typów zadań</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issueTypeMetrics.map((metric) => (
                <div key={metric.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.type}</span>
                    <span>{Math.round(metric.completionRate)}%</span>
                  </div>
                  <Progress value={metric.completionRate} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metric.completed}/{metric.total} zadań • {metric.completedPoints}/{metric.storyPoints} SP
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metryki według priorytetów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityMetrics.map((metric) => (
                <div key={metric.priority} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.priority}</span>
                    <span>{Math.round(metric.completionRate)}%</span>
                  </div>
                  <Progress value={metric.completionRate} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {metric.completed}/{metric.total} zadań • Średnio {metric.avgTime} dni
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights i Automatyzacja */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                      insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.severity}
                    </span>
                  </div>
                </div>
              ))}
              {activeInsights.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak aktywnych insights</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metryki automatyzacji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Health Score</span>
                <span className="font-medium">{automationMetrics.healthScore}%</span>
              </div>
              <Progress value={automationMetrics.healthScore} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Aktywne reguły</div>
                  <div className="font-medium">{automationMetrics.activeRules}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Success Rate</div>
                  <div className="font-medium">{automationMetrics.successRate}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Wykonania</div>
                  <div className="font-medium">{automationMetrics.totalExecutions}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Zaoszczędzony czas</div>
                  <div className="font-medium">{automationMetrics.timeSavedHours}h</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Podsumowanie sprintów */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowe metryki sprintów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sprintMetrics.slice(-5).map((sprint) => (
              <div key={sprint.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{sprint.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    sprint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Zadania</div>
                    <div className="font-medium">{sprint.completedIssues}/{sprint.totalIssues}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Story Points</div>
                    <div className="font-medium">{sprint.completedPoints}/{sprint.totalPoints}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completion Rate</div>
                    <div className="font-medium">{Math.round(sprint.completionRate)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Efficiency</div>
                    <div className="font-medium">{Math.round(sprint.efficiency)}%</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress value={sprint.completionRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
