"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Badge } from "@/components/demo3/ui/badge"
import { Button } from "@/components/demo3/ui/button"
import { Progress } from "@/components/demo3/ui/progress"
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, ListTodo, Zap, Users, BarChart3 } from "lucide-react"
import { mockIssues, mockSprints, mockUsers } from "@/lib/demo3/mock-data"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/demo3/ui/alert"

export function PersonalDashboard() {
  const currentUser = mockUsers[0]
  const activeSprint = mockSprints.find((s) => s.status === "active")
  const myIssues = mockIssues.filter((i) => i.assigneeId === currentUser.id)
  const urgentIssues = mockIssues.filter((i) => i.priority === "P0" || i.priority === "P1")

  const sprintIssues = mockIssues.filter((i) => i.sprintId === activeSprint?.id)
  const doneIssues = sprintIssues.filter((i) => i.status === "done")
  const sprintProgress = sprintIssues.length > 0 ? (doneIssues.length / sprintIssues.length) * 100 : 0

  const today = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Twój Dzień</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Twoje zadania</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              {myIssues.filter((i) => i.status === "in_progress").length} w trakcie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pilne</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentIssues.length}</div>
            <p className="text-xs text-muted-foreground">P0 i P1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(sprintProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              {doneIssues.length} z {sprintIssues.length} ukończone
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dni do końca</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">Sprint 24</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Pilne zadania (P0/P1)
            </CardTitle>
            <CardDescription>Wymagają natychmiastowej uwagi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentIssues.slice(0, 3).map((issue) => (
              <Link
                key={issue.id}
                href={`/demo/issues?panel=${issue.id}`}
                className="flex items-start gap-3 rounded-lg border-l-4 border-destructive bg-card p-3 transition-colors hover:bg-accent"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-muted-foreground">{issue.key}</code>
                    <Badge variant={issue.priority === "P0" ? "destructive" : "default"}>{issue.priority}</Badge>
                  </div>
                  <p className="text-sm font-medium leading-tight">{issue.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarImage
                        src={mockUsers.find((u) => u.id === issue.assigneeId)?.avatarUrl || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {mockUsers.find((u) => u.id === issue.assigneeId)?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{mockUsers.find((u) => u.id === issue.assigneeId)?.name}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/demo3/issues?filter=urgent">Zobacz wszystkie pilne</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sprint Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Overview</CardTitle>
            <CardDescription>{activeSprint?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Postęp</span>
                <span className="font-medium">
                  {doneIssues.length} / {sprintIssues.length} zadań
                </span>
              </div>
              <Progress value={sprintProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Story Points</p>
                <p className="text-2xl font-bold">{sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Dni pozostało</p>
                <p className="text-2xl font-bold">11</p>
              </div>
            </div>

            {sprintIssues.some((i) => i.status === "blocked") && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Uwaga</AlertTitle>
                <AlertDescription>
                  {sprintIssues.filter((i) => i.status === "blocked").length} zadań zablokowanych
                </AlertDescription>
              </Alert>
            )}

            <Button className="w-full" asChild>
              <Link href="/demo3/sprints">
                Otwórz tablicę Kanban
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick View Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Szybki dostęp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
              <Link href="/demo3/sprints">
                <Zap className="h-6 w-6" />
                <span>Kanban</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
              <Link href="/demo3/issues">
                <ListTodo className="h-6 w-6" />
                <span>Wszystkie zadania</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
              <Link href="/demo3/teams">
                <Users className="h-6 w-6" />
                <span>Zespoły</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
              <Link href="/demo3/reports">
                <BarChart3 className="h-6 w-6" />
                <span>Raporty</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
