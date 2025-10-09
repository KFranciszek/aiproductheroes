"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Clock, Users } from "lucide-react"
import { mockIssues, mockSprints } from "@/lib/mock-data"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ReportsView() {
  const activeSprint = mockSprints.find((s) => s.status === "active")
  const sprintIssues = mockIssues.filter((i) => i.sprint?.id === activeSprint?.id)

  // Velocity data for last 5 sprints
  const velocityData = [
    { sprint: "Sprint 1", planned: 45, completed: 42 },
    { sprint: "Sprint 2", planned: 48, completed: 45 },
    { sprint: "Sprint 3", planned: 50, completed: 38 },
    { sprint: "Sprint 4", planned: 46, completed: 46 },
    { sprint: "Sprint 5", planned: 52, completed: 48 },
  ]

  // Cumulative flow data
  const cumulativeFlowData = [
    { date: "Jan 15", todo: 12, inProgress: 5, inReview: 3, done: 8 },
    { date: "Jan 16", todo: 11, inProgress: 6, inReview: 4, done: 10 },
    { date: "Jan 17", todo: 10, inProgress: 7, inReview: 3, done: 12 },
    { date: "Jan 18", todo: 9, inProgress: 6, inReview: 5, done: 14 },
    { date: "Jan 19", todo: 8, inProgress: 7, inReview: 4, done: 16 },
    { date: "Jan 20", todo: 7, inProgress: 6, inReview: 6, done: 18 },
  ]

  // Cycle time data
  const cycleTimeData = [
    { type: "Feature", avgDays: 5.2 },
    { type: "Bug", avgDays: 2.8 },
    { type: "Improvement", avgDays: 4.1 },
    { type: "Task", avgDays: 3.5 },
  ]

  // Workload distribution
  const workloadData = mockIssues.reduce(
    (acc, issue) => {
      if (issue.assignee) {
        const existing = acc.find((item) => item.name === issue.assignee!.name)
        if (existing) {
          existing.tasks += 1
        } else {
          acc.push({ name: issue.assignee.name, tasks: 1 })
        }
      }
      return acc
    },
    [] as Array<{ name: string; tasks: number }>,
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Raporty</h1>
          <p className="text-muted-foreground mt-1">Analiza danych i metryki projektu</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Wybierz zakres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
            <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
            <SelectItem value="quarter">Ten kwartał</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Średni Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43.8 SP</div>
            <p className="text-xs text-muted-foreground">+12% od ostatniego sprintu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Średni Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.9 dni</div>
            <p className="text-xs text-muted-foreground">-8% od ostatniego miesiąca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktywne Zadania</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprintIssues.length}</div>
            <p className="text-xs text-muted-foreground">W bieżącym sprincie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Członkowie Zespołu</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Aktywnych kontrybutorów</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="velocity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="flow">Cumulative Flow</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Time</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
        </TabsList>

        <TabsContent value="velocity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Velocity Trend</CardTitle>
              <CardDescription>Porównanie planowanych i ukończonych Story Points</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  planned: {
                    label: "Planowane",
                    color: "hsl(var(--chart-1))",
                  },
                  completed: {
                    label: "Ukończone",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="sprint" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="planned" fill="var(--color-planned)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Flow Diagram</CardTitle>
              <CardDescription>Przepływ zadań przez statusy w czasie</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  todo: {
                    label: "To Do",
                    color: "hsl(var(--chart-1))",
                  },
                  inProgress: {
                    label: "In Progress",
                    color: "hsl(var(--chart-2))",
                  },
                  inReview: {
                    label: "In Review",
                    color: "hsl(var(--chart-3))",
                  },
                  done: {
                    label: "Done",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeFlowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="done"
                      stackId="1"
                      stroke="var(--color-done)"
                      fill="var(--color-done)"
                    />
                    <Area
                      type="monotone"
                      dataKey="inReview"
                      stackId="1"
                      stroke="var(--color-inReview)"
                      fill="var(--color-inReview)"
                    />
                    <Area
                      type="monotone"
                      dataKey="inProgress"
                      stackId="1"
                      stroke="var(--color-inProgress)"
                      fill="var(--color-inProgress)"
                    />
                    <Area
                      type="monotone"
                      dataKey="todo"
                      stackId="1"
                      stroke="var(--color-todo)"
                      fill="var(--color-todo)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Średni Cycle Time</CardTitle>
              <CardDescription>Czas realizacji według typu zadania</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  avgDays: {
                    label: "Średnia (dni)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cycleTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="type" type="category" className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgDays" fill="var(--color-avgDays)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rozkład Obciążenia</CardTitle>
              <CardDescription>Liczba zadań przypisanych do członków zespołu</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tasks: {
                    label: "Zadania",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
