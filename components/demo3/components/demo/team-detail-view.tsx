"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Team, Issue } from "@/lib/types"

interface TeamDetailViewProps {
  team: Team
  issues: Issue[]
  onBack: () => void
}

export function TeamDetailView({ team, issues, onBack }: TeamDetailViewProps) {
  const teamIssues = issues.filter((issue) => team.members.some((member) => member.id === issue.assignee?.id))

  const velocityData = [
    { sprint: "Sprint 20", points: 34 },
    { sprint: "Sprint 21", points: 42 },
    { sprint: "Sprint 22", points: 38 },
    { sprint: "Sprint 23", points: 45 },
    { sprint: "Sprint 24", points: 41 },
  ]

  const memberWorkload = team.members.map((member) => ({
    name: member.name.split(" ")[0],
    tasks: teamIssues.filter((issue) => issue.assignee?.id === member.id).length,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót
        </Button>
        <h1 className="text-3xl font-bold">{team.name}</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Aktywne zadania</h3>
          <p className="text-3xl font-bold">{team.activeTasks}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Ukończone w sprincie</h3>
          <p className="text-3xl font-bold">{team.completedTasks}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Velocity</h3>
          <p className="text-3xl font-bold">{team.velocity} SP</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Historia Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="sprint" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="points" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Obciążenie członków</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={memberWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="tasks" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Członkowie zespołu</h3>
        <div className="space-y-4">
          {team.members.map((member) => {
            const memberTasks = teamIssues.filter((issue) => issue.assignee?.id === member.id)
            const completedTasks = memberTasks.filter((issue) => issue.status === "done").length

            return (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{memberTasks.length} zadań</span>
                    <span>{completedTasks} ukończonych</span>
                  </div>
                  <Progress value={(completedTasks / memberTasks.length) * 100} className="mt-2 h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
