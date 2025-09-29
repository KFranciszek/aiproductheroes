"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Issue, Sprint } from "@/types"

interface ReportsViewProps {
  issues: Issue[]
  sprints: Sprint[]
}

interface EngineerUtilization {
  name: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  utilizationRate: number
  currentSprintTasks: number
}

export function ReportsView({ issues, sprints }: ReportsViewProps) {
  const activeSprint = sprints.find((sprint) => sprint.status === "Active")

  // Calculate engineer utilization data
  const engineerStats = calculateEngineerUtilization(issues, activeSprint?.id)

  // Prepare chart data
  const utilizationChartData = engineerStats.map((engineer) => ({
    name: engineer.name,
    utilization: engineer.utilizationRate,
    tasks: engineer.totalTasks,
  }))

  const taskDistributionData = engineerStats.map((engineer) => ({
    name: engineer.name,
    completed: engineer.completedTasks,
    inProgress: engineer.inProgressTasks,
    todo: engineer.todoTasks,
  }))

  const overallStats = {
    totalEngineers: engineerStats.length,
    averageUtilization: engineerStats.reduce((sum, eng) => sum + eng.utilizationRate, 0) / engineerStats.length,
    totalActiveTasks: engineerStats.reduce((sum, eng) => sum + eng.inProgressTasks, 0),
    totalCompletedTasks: engineerStats.reduce((sum, eng) => sum + eng.completedTasks, 0),
  }

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raporty Utylizacji Inżynierów</h1>
          <p className="text-muted-foreground">Analiza poziomu wykorzystania i wydajności zespołu inżynierskiego</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liczba Inżynierów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalEngineers}</div>
            <p className="text-xs text-muted-foreground">Aktywnych członków zespołu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średnia Utylizacja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Ogólny poziom wykorzystania</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zadania w Toku</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalActiveTasks}</div>
            <p className="text-xs text-muted-foreground">Obecnie realizowane</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukończone Zadania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalCompletedTasks}</div>
            <p className="text-xs text-muted-foreground">Całkowicie zakończone</p>
          </CardContent>
        </Card>
      </div>

      {/* Engineer Utilization Details */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowa Utylizacja Inżynierów</CardTitle>
          <CardDescription>Poziom wykorzystania każdego członka zespołu z podziałem na statusy zadań</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {engineerStats.map((engineer) => (
              <div key={engineer.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{engineer.name}</h3>
                    <Badge variant="outline">{engineer.utilizationRate.toFixed(1)}% utylizacji</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{engineer.totalTasks} zadań łącznie</div>
                </div>

                <Progress value={engineer.utilizationRate} className="h-2" />

                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Ukończone: {engineer.completedTasks}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>W toku: {engineer.inProgressTasks}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    Do zrobienia: {engineer.todoTasks}
                  </span>
                  {activeSprint && (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Aktualny sprint: {engineer.currentSprintTasks}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wykres Utylizacji</CardTitle>
            <CardDescription>Poziom wykorzystania każdego inżyniera</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "utilization" ? `${value}%` : value,
                    name === "utilization" ? "Utylizacja" : "Zadania",
                  ]}
                />
                <Bar dataKey="utilization" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rozkład Zadań</CardTitle>
            <CardDescription>Podział zadań według statusów dla każdego inżyniera</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Ukończone" />
                <Bar dataKey="inProgress" stackId="a" fill="#8884d8" name="W toku" />
                <Bar dataKey="todo" stackId="a" fill="#ffc658" name="Do zrobienia" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function calculateEngineerUtilization(issues: Issue[], activeSprintId?: string): EngineerUtilization[] {
  const engineerMap = new Map<string, EngineerUtilization>()

  // Initialize engineers
  issues.forEach((issue) => {
    if (issue.assignee && !engineerMap.has(issue.assignee)) {
      engineerMap.set(issue.assignee, {
        name: issue.assignee,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        utilizationRate: 0,
        currentSprintTasks: 0,
      })
    }
  })

  // Calculate stats for each engineer
  issues.forEach((issue) => {
    if (!issue.assignee) return

    const engineer = engineerMap.get(issue.assignee)!
    engineer.totalTasks++

    switch (issue.status) {
      case "Done":
        engineer.completedTasks++
        break
      case "In Progress":
        engineer.inProgressTasks++
        break
      case "In Review":
        engineer.inProgressTasks++
        break
      case "Todo":
        engineer.todoTasks++
        break
    }

    if (activeSprintId && issue.sprintId === activeSprintId) {
      engineer.currentSprintTasks++
    }
  })

  // Calculate utilization rate (completed + in progress tasks / total tasks * 100)
  engineerMap.forEach((engineer) => {
    if (engineer.totalTasks > 0) {
      engineer.utilizationRate = ((engineer.completedTasks + engineer.inProgressTasks) / engineer.totalTasks) * 100
    }
  })

  return Array.from(engineerMap.values()).sort((a, b) => b.utilizationRate - a.utilizationRate)
}
