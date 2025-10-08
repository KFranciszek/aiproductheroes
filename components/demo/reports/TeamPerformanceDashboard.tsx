"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { User, Issue, Sprint } from "@/types"

interface TeamPerformanceDashboardProps {
  users: User[]
  issues: Issue[]
  sprints: Sprint[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function TeamPerformanceDashboard({ users, issues, sprints }: TeamPerformanceDashboardProps) {
  // Metryki wydajności zespołu
  const teamMetrics = useMemo(() => {
    return users.map(user => {
      const userIssues = issues.filter(issue => issue.assignee?.id === user.id)
      const completedIssues = userIssues.filter(issue => issue.status === 'Done')
      const totalStoryPoints = userIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      
      // Oblicz średni czas realizacji zadania
      const avgCompletionTime = completedIssues.length > 0 
        ? completedIssues.reduce((sum, issue) => {
            const createdAt = new Date(issue.createdAt)
            const updatedAt = new Date(issue.updatedAt)
            return sum + (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) // dni
          }, 0) / completedIssues.length
        : 0

      return {
        user,
        totalTasks: userIssues.length,
        completedTasks: completedIssues.length,
        completionRate: userIssues.length > 0 ? (completedIssues.length / userIssues.length) * 100 : 0,
        totalStoryPoints,
        completedStoryPoints,
        storyPointsRate: totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
        avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        activeTasks: userIssues.filter(issue => issue.status === 'In Progress').length,
        reviewTasks: userIssues.filter(issue => issue.status === 'In Review').length,
      }
    })
  }, [users, issues])

  // Metryki według ról
  const roleMetrics = useMemo(() => {
    const roleGroups = teamMetrics.reduce((acc, metric) => {
      const role = metric.user.role
      if (!acc[role]) {
        acc[role] = {
          role,
          users: [],
          totalTasks: 0,
          completedTasks: 0,
          totalStoryPoints: 0,
          completedStoryPoints: 0,
        }
      }
      acc[role].users.push(metric.user.name)
      acc[role].totalTasks += metric.totalTasks
      acc[role].completedTasks += metric.completedTasks
      acc[role].totalStoryPoints += metric.totalStoryPoints
      acc[role].completedStoryPoints += metric.completedStoryPoints
      return acc
    }, {} as Record<string, any>)

    return Object.values(roleGroups).map(group => ({
      ...group,
      completionRate: group.totalTasks > 0 ? (group.completedTasks / group.totalTasks) * 100 : 0,
      storyPointsRate: group.totalStoryPoints > 0 ? (group.completedStoryPoints / group.totalStoryPoints) * 100 : 0,
    }))
  }, [teamMetrics])

  // Trend velocity zespołu
  const velocityTrend = useMemo(() => {
    return sprints.slice(-6).map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
      const completedPoints = sprintIssues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
      
      return {
        sprint: sprint.name,
        velocity: completedPoints,
        planned: sprint.capacity || 0,
        efficiency: sprint.capacity ? (completedPoints / sprint.capacity) * 100 : 0
      }
    })
  }, [sprints, issues])

  // Rozkład zadań według priorytetów
  const priorityDistribution = useMemo(() => {
    const priorityCounts = issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      percentage: (count / issues.length) * 100
    }))
  }, [issues])

  return (
    <div className="space-y-6">
      {/* Podsumowanie zespołu */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktywni członkowie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
            <p className="text-xs text-muted-foreground">z {users.length} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Średnia completion rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teamMetrics.reduce((sum, m) => sum + m.completionRate, 0) / teamMetrics.length)}%
            </div>
            <p className="text-xs text-muted-foreground">zespół</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Średni czas realizacji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teamMetrics.reduce((sum, m) => sum + m.avgCompletionTime, 0) / teamMetrics.length)} dni
            </div>
            <p className="text-xs text-muted-foreground">na zadanie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Velocity trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {velocityTrend.length > 1 
                ? velocityTrend[velocityTrend.length - 1].velocity > velocityTrend[velocityTrend.length - 2].velocity 
                  ? "↗️" 
                  : "↘️"
                : "➡️"
              }
            </div>
            <p className="text-xs text-muted-foreground">ostatnie sprints</p>
          </CardContent>
        </Card>
      </div>

      {/* Wykres wydajności według ról */}
      <Card>
        <CardHeader>
          <CardTitle>Wydajność według ról</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={roleMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completionRate" fill="#8884d8" name="Completion Rate (%)" />
                <Bar dataKey="storyPointsRate" fill="#82ca9d" name="Story Points Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend velocity */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={velocityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="velocity" fill="#0088FE" name="Rzeczywista Velocity" />
                <Bar dataKey="planned" fill="#00C49F" name="Planowana Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Szczegółowe metryki członków zespołu */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowe metryki zespołu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMetrics.map((metric) => (
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
                    <div className="text-lg font-bold">{Math.round(metric.completionRate)}%</div>
                    <div className="text-xs text-muted-foreground">completion rate</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Zadania</div>
                    <div className="font-medium">{metric.completedTasks}/{metric.totalTasks}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Story Points</div>
                    <div className="font-medium">{metric.completedStoryPoints}/{metric.totalStoryPoints}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Średni czas</div>
                    <div className="font-medium">{metric.avgCompletionTime} dni</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Aktywne</div>
                    <div className="font-medium">{metric.activeTasks} in progress, {metric.reviewTasks} in review</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress value={metric.completionRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rozkład priorytetów */}
      <Card>
        <CardHeader>
          <CardTitle>Rozkład zadań według priorytetów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ priority, percentage }) => `${priority}: ${Math.round(percentage)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
