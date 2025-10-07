"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { PredictiveAnalytics } from "@/lib/predictive-analytics"
import type { Sprint, Issue, User } from "@/types"

interface VelocityTrendsDashboardProps {
  sprints: Sprint[]
  issues: Issue[]
  users: User[]
}

export function VelocityTrendsDashboard({ sprints, issues, users }: VelocityTrendsDashboardProps) {
  
  // Dane velocity z ostatnich sprintów
  const velocityData = useMemo(() => {
    const completedSprints = sprints.filter(s => s.status === 'Completed')
    return completedSprints.slice(-8).map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
      const completedPoints = sprintIssues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      
      return {
        name: sprint.name,
        velocity: completedPoints,
        planned: sprint.capacity || 0,
        efficiency: sprint.capacity ? (completedPoints / sprint.capacity) * 100 : 0,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        duration: Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))
      }
    })
  }, [sprints, issues])

  // Predykcja velocity
  const predictedVelocity = useMemo(() => {
    return PredictiveAnalytics.calculateVelocityTrend(velocityData.map(s => ({ ...s, velocity: s.velocity })))
  }, [velocityData])

  // Trend wydajności zespołu
  const teamEfficiencyTrend = useMemo(() => {
    return velocityData.map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprints.find(s => s.name === sprint.name)?.id)
      const teamLoad = users.map(user => {
        const userTasks = sprintIssues.filter(task => task.assignee?.id === user.id)
        const completedTasks = userTasks.filter(task => task.status === 'Done')
        return {
          user: user.name,
          tasks: userTasks.length,
          completed: completedTasks.length,
          efficiency: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0
        }
      })
      
      const avgEfficiency = teamLoad.reduce((sum, member) => sum + member.efficiency, 0) / teamLoad.length
      
      return {
        ...sprint,
        teamEfficiency: Math.round(avgEfficiency),
        teamLoad: teamLoad.length,
        avgTasksPerMember: Math.round(sprintIssues.length / users.length)
      }
    })
  }, [velocityData, issues, sprints, users])

  // Predykcja capacity dla następnego sprintu
  const nextSprintCapacity = useMemo(() => {
    const activeUsers = users.filter(u => u.isActive)
    const sprintDays = 14 // standardowy sprint
    return PredictiveAnalytics.estimateSprintCapacity(activeUsers, sprintDays)
  }, [users])

  // Analiza trendów
  const trendAnalysis = useMemo(() => {
    if (velocityData.length < 3) return null
    
    const recent = velocityData.slice(-3)
    const older = velocityData.slice(-6, -3)
    
    const recentAvg = recent.reduce((sum, s) => sum + s.velocity, 0) / recent.length
    const olderAvg = older.length > 0 ? older.reduce((sum, s) => sum + s.velocity, 0) / older.length : recentAvg
    
    const trend = recentAvg > olderAvg ? 'increasing' : recentAvg < olderAvg ? 'decreasing' : 'stable'
    const changePercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0
    
    return {
      trend,
      changePercent: Math.round(changePercent),
      recentAvg: Math.round(recentAvg),
      olderAvg: Math.round(olderAvg),
      predictedNext: predictedVelocity
    }
  }, [velocityData, predictedVelocity])

  // Metryki jakości sprintów
  const sprintQualityMetrics = useMemo(() => {
    return velocityData.map(sprint => {
      const sprintIssues = issues.filter(issue => 
        issue.sprintId === sprints.find(s => s.name === sprint.name)?.id
      )
      
      const bugs = sprintIssues.filter(issue => issue.type === 'Bug').length
      const features = sprintIssues.filter(issue => issue.type === 'Feature').length
      const chores = sprintIssues.filter(issue => issue.type === 'Chore').length
      
      const highPriorityIssues = sprintIssues.filter(issue => 
        issue.priority === 'P0' || issue.priority === 'P1'
      ).length
      
      return {
        ...sprint,
        bugs,
        features,
        chores,
        highPriorityIssues,
        bugRatio: sprintIssues.length > 0 ? (bugs / sprintIssues.length) * 100 : 0,
        qualityScore: sprintIssues.length > 0 ? 
          Math.max(0, 100 - (bugs / sprintIssues.length) * 50 - (highPriorityIssues / sprintIssues.length) * 30) : 100
      }
    })
  }, [velocityData, issues, sprints])

  return (
    <div className="space-y-6">
      {/* Podsumowanie trendów */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktualna Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendAnalysis?.recentAvg || 0}</div>
            <p className="text-xs text-muted-foreground">ostatnie 3 sprints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trend Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trendAnalysis?.trend === 'increasing' ? '↗️' : 
               trendAnalysis?.trend === 'decreasing' ? '↘️' : '➡️'}
            </div>
            <p className="text-xs text-muted-foreground">
              {trendAnalysis?.changePercent ? `${trendAnalysis.changePercent}%` : 'Stabilny'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predykcja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictedVelocity}</div>
            <p className="text-xs text-muted-foreground">następny sprint</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextSprintCapacity}</div>
            <p className="text-xs text-muted-foreground">godziny dostępne</p>
          </CardContent>
        </Card>
      </div>

      {/* Wykres velocity z predykcją */}
      <Card>
        <CardHeader>
          <CardTitle>Velocity Trend z Predykcją</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Rzeczywista Velocity"
                />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#00C49F" 
                  strokeDasharray="5 5"
                  name="Planowana Capacity"
                />
                {/* Predykcja jako linia przerywana */}
                <Line 
                  type="monotone" 
                  dataKey={() => predictedVelocity} 
                  stroke="#FF8042" 
                  strokeDasharray="10 5"
                  strokeWidth={2}
                  name="Predykcja"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend wydajności zespołu */}
      <Card>
        <CardHeader>
          <CardTitle>Wydajność zespołu w czasie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <AreaChart data={teamEfficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="teamEfficiency" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Efektywność zespołu (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stackId="1" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Velocity Efficiency (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Analiza jakości sprintów */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza jakości sprintów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={sprintQualityMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="qualityScore" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Quality Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="bugRatio" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Bug Ratio (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Szczegółowe metryki trendów */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analiza trendów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendAnalysis && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Aktualny trend</span>
                    <span className={`font-medium ${
                      trendAnalysis.trend === 'increasing' ? 'text-green-600' :
                      trendAnalysis.trend === 'decreasing' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {trendAnalysis.trend === 'increasing' ? 'Wzrostowy' :
                       trendAnalysis.trend === 'decreasing' ? 'Spadkowy' : 'Stabilny'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Zmiana velocity</span>
                    <span className={`font-medium ${
                      trendAnalysis.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trendAnalysis.changePercent > 0 ? '+' : ''}{trendAnalysis.changePercent}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Średnia ostatnia</span>
                    <span className="font-medium">{trendAnalysis.recentAvg} SP</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Predykcja następny</span>
                    <span className="font-medium">{trendAnalysis.predictedNext} SP</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendacje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendAnalysis && (
                <>
                  {trendAnalysis.trend === 'decreasing' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800">⚠️ Spadek velocity</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Rozważ zmniejszenie scope'u sprintu lub identyfikację bottlenecków.
                      </p>
                    </div>
                  )}
                  
                  {trendAnalysis.trend === 'increasing' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">✅ Wzrost velocity</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Świetna robota! Zespół zwiększa wydajność.
                      </p>
                    </div>
                  )}
                  
                  {predictedVelocity > nextSprintCapacity && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800">📊 Capacity vs Predykcja</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Predykcja ({predictedVelocity} SP) przekracza capacity ({nextSprintCapacity}h).
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historia velocity */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowa historia velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {velocityData.map((sprint) => (
              <div key={sprint.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{sprint.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {sprint.duration} dni
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Velocity</div>
                    <div className="font-medium">{sprint.velocity} SP</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Planowana</div>
                    <div className="font-medium">{sprint.planned} SP</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Efektywność</div>
                    <div className="font-medium">{Math.round(sprint.efficiency)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className={`font-medium ${
                      sprint.efficiency >= 80 ? 'text-green-600' :
                      sprint.efficiency >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {sprint.efficiency >= 80 ? 'Dobra' :
                       sprint.efficiency >= 60 ? 'Średnia' : 'Słaba'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
