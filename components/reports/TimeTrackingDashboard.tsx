"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import type { TimeEntry, Issue, User } from "@/types"

interface TimeTrackingDashboardProps {
  timeEntries: TimeEntry[]
  issues: Issue[]
  users: User[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function TimeTrackingDashboard({ timeEntries, issues, users }: TimeTrackingDashboardProps) {
  
  // Podstawowe metryki time tracking
  const timeMetrics = useMemo(() => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60 // konwersja na godziny
    const totalEntries = timeEntries.length
    const avgSessionDuration = totalEntries > 0 ? totalHours / totalEntries : 0
    
    // Czas według typów zadań
    const timeByIssueType = issues.reduce((acc, issue) => {
      const issueTimeEntries = timeEntries.filter(entry => entry.issueId === issue.id)
      const issueHours = issueTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      
      const type = issue.type || 'Unknown'
      if (!acc[type]) {
        acc[type] = { type, hours: 0, entries: 0, issues: 0 }
      }
      acc[type].hours += issueHours
      acc[type].entries += issueTimeEntries.length
      acc[type].issues += 1
      return acc
    }, {} as Record<string, any>)

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalEntries,
      avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
      timeByIssueType: Object.values(timeByIssueType)
    }
  }, [timeEntries, issues])

  // Metryki według użytkowników
  const userTimeMetrics = useMemo(() => {
    return users.map(user => {
      const userTimeEntries = timeEntries.filter(entry => entry.userId === user.id)
      const userHours = userTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      const userIssues = issues.filter(issue => issue.assignee?.id === user.id)
      
      // Oblicz efektywność (czas rzeczywisty vs szacowany)
      const estimatedHours = userIssues.reduce((sum, issue) => sum + (issue.estimatedHours || 0), 0)
      const actualHours = userHours
      const efficiency = estimatedHours > 0 ? (actualHours / estimatedHours) * 100 : 0
      
      return {
        user,
        hours: Math.round(userHours * 10) / 10,
        entries: userTimeEntries.length,
        issues: userIssues.length,
        estimatedHours,
        actualHours,
        efficiency: Math.round(efficiency * 10) / 10,
        avgSessionDuration: userTimeEntries.length > 0 ? userHours / userTimeEntries.length : 0
      }
    }).filter(metric => metric.hours > 0) // Tylko użytkownicy z zarejestrowanym czasem
  }, [timeEntries, users, issues])

  // Trendy czasowe
  const timeTrends = useMemo(() => {
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    
    const dailyData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dayEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.startTime)
        return entryDate.toDateString() === date.toDateString()
      })
      
      const dayHours = dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      
      dailyData.push({
        date: date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
        hours: Math.round(dayHours * 10) / 10,
        entries: dayEntries.length,
        cumulative: timeEntries.filter(entry => {
          const entryDate = new Date(entry.startTime)
          return entryDate <= date
        }).reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      })
    }
    
    return dailyData
  }, [timeEntries])

  // Czas według priorytetów
  const timeByPriority = useMemo(() => {
    const priorityGroups = issues.reduce((acc, issue) => {
      const issueTimeEntries = timeEntries.filter(entry => entry.issueId === issue.id)
      const issueHours = issueTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      
      if (!acc[issue.priority]) {
        acc[issue.priority] = { priority: issue.priority, hours: 0, entries: 0, issues: 0 }
      }
      acc[issue.priority].hours += issueHours
      acc[issue.priority].entries += issueTimeEntries.length
      acc[issue.priority].issues += 1
      return acc
    }, {} as Record<string, any>)

    return Object.values(priorityGroups).map(group => ({
      ...group,
      avgHoursPerIssue: group.issues > 0 ? Math.round((group.hours / group.issues) * 10) / 10 : 0,
      avgHoursPerEntry: group.entries > 0 ? Math.round((group.hours / group.entries) * 10) / 10 : 0
    }))
  }, [issues, timeEntries])

  // Analiza wydajności vs szacunki
  const efficiencyAnalysis = useMemo(() => {
    const issuesWithTime = issues.filter(issue => {
      const issueTimeEntries = timeEntries.filter(entry => entry.issueId === issue.id)
      return issueTimeEntries.length > 0 && issue.estimatedHours
    })

    return issuesWithTime.map(issue => {
      const issueTimeEntries = timeEntries.filter(entry => entry.issueId === issue.id)
      const actualHours = issueTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      const estimatedHours = issue.estimatedHours || 0
      const variance = estimatedHours > 0 ? ((actualHours - estimatedHours) / estimatedHours) * 100 : 0
      
      return {
        issueId: issue.id,
        title: issue.title,
        priority: issue.priority,
        estimatedHours,
        actualHours: Math.round(actualHours * 10) / 10,
        variance: Math.round(variance * 10) / 10,
        status: issue.status,
        assignee: issue.assignee?.name || 'Unassigned'
      }
    })
  }, [issues, timeEntries])

  // Top zadania według czasu
  const topTimeConsumingIssues = useMemo(() => {
    return issues.map(issue => {
      const issueTimeEntries = timeEntries.filter(entry => entry.issueId === issue.id)
      const totalHours = issueTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      
      return {
        issue,
        hours: Math.round(totalHours * 10) / 10,
        entries: issueTimeEntries.length,
        avgSessionDuration: issueTimeEntries.length > 0 ? totalHours / issueTimeEntries.length : 0
      }
    }).filter(item => item.hours > 0)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10)
  }, [issues, timeEntries])

  return (
    <div className="space-y-6">
      {/* Podsumowanie time tracking */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Łączny czas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeMetrics.totalHours}h</div>
            <p className="text-xs text-muted-foreground">{timeMetrics.totalEntries} sesji</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Średnia sesja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeMetrics.avgSessionDuration}h</div>
            <p className="text-xs text-muted-foreground">na sesję</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktywni użytkownicy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTimeMetrics.length}</div>
            <p className="text-xs text-muted-foreground">z {users.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Średnia efektywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTimeMetrics.length > 0 
                ? Math.round(userTimeMetrics.reduce((sum, u) => sum + u.efficiency, 0) / userTimeMetrics.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">rzeczywisty vs szacowany</p>
          </CardContent>
        </Card>
      </div>

      {/* Trendy czasowe */}
      <Card>
        <CardHeader>
          <CardTitle>Trendy czasowe (ostatnie 30 dni)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={timeTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Godziny dziennie"
                />
                <Line 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Sesje dziennie"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Czas według użytkowników */}
      <Card>
        <CardHeader>
          <CardTitle>Czas według użytkowników</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={userTimeMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user.name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#0088FE" name="Rzeczywiste godziny" />
                <Bar dataKey="estimatedHours" fill="#00C49F" name="Szacowane godziny" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Czas według typów zadań */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Czas według typów zadań</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={timeMetrics.timeByIssueType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, hours }) => `${type}: ${hours}h`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {timeMetrics.timeByIssueType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Czas według priorytetów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <BarChart data={timeByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" name="Godziny" />
                  <Bar dataKey="avgHoursPerIssue" fill="#82ca9d" name="Średnio na zadanie" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Szczegółowe metryki użytkowników */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowe metryki użytkowników</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTimeMetrics.map((metric) => (
              <div key={metric.user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={metric.user.avatar} 
                      alt={metric.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{metric.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{metric.user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{metric.hours}h</div>
                    <div className="text-xs text-muted-foreground">łącznie</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Sesje</div>
                    <div className="font-medium">{metric.entries}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Zadania</div>
                    <div className="font-medium">{metric.issues}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Efektywność</div>
                    <div className="font-medium">{metric.efficiency}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Średnia sesja</div>
                    <div className="font-medium">{Math.round(metric.avgSessionDuration * 10) / 10}h</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Rzeczywisty: {metric.actualHours}h</span>
                    <span>Szacowany: {metric.estimatedHours}h</span>
                  </div>
                  <Progress 
                    value={Math.min(metric.efficiency, 200)} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top zadania według czasu */}
      <Card>
        <CardHeader>
          <CardTitle>Top zadania według czasu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTimeConsumingIssues.map((item, index) => (
              <div key={item.issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.issue.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.issue.priority} • {item.issue.status} • {item.issue.assignee?.name || 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.hours}h</div>
                  <div className="text-xs text-muted-foreground">{item.entries} sesji</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analiza wydajności */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza wydajności vs szacunki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {efficiencyAnalysis.slice(0, 10).map((item) => (
              <div key={item.issueId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.priority} • {item.assignee}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {item.actualHours}h / {item.estimatedHours}h
                  </div>
                  <div className={`text-xs ${
                    item.variance > 20 ? 'text-red-600' :
                    item.variance < -20 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {item.variance > 0 ? '+' : ''}{item.variance}%
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
