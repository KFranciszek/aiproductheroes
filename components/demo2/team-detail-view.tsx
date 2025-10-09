"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  UserPlus,
  UserMinus,
  Settings,
  BarChart3,
  Activity,
  Trophy,
  Zap
} from "lucide-react"
import type { Team, User, Issue, Sprint } from "@/types/demo2"

interface TeamDetailViewProps {
  team: Team
  users: User[]
  issues: Issue[]
  sprints: Sprint[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (team: Team) => void
}

export function TeamDetailView({
  team,
  users,
  issues,
  sprints,
  open,
  onOpenChange,
  onEdit
}: TeamDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const teamMembers = users.filter(user => team.memberIds.includes(user.id))
  const teamLead = team.leadId ? users.find(u => u.id === team.leadId) : null

  // Calculate team metrics
  const teamIssues = issues.filter(issue =>
    teamMembers.some(member => issue.assignee === member.name)
  )
  
  const completedIssues = teamIssues.filter(issue => issue.status === "done")
  const inProgressIssues = teamIssues.filter(issue => issue.status === "in_progress")
  const blockedIssues = teamIssues.filter(issue => issue.status === "blocked")
  
  const completionRate = teamIssues.length > 0 ? 
    Math.round((completedIssues.length / teamIssues.length) * 100) : 0

  const totalStoryPoints = teamIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  
  const currentSprint = sprints.find(sprint => sprint.status === "active")
  const sprintIssues = currentSprint ? 
    teamIssues.filter(issue => issue.sprintId === currentSprint.id) : []
  
  const sprintProgress = sprintIssues.length > 0 ?
    Math.round((sprintIssues.filter(i => i.status === "done").length / sprintIssues.length) * 100) : 0

  // Mock velocity data (in real app this would come from historical data)
  const velocityHistory = team.velocityHistory || [
    { sprint: "Sprint 1", velocity: 23, capacity: 30 },
    { sprint: "Sprint 2", velocity: 28, capacity: 30 },
    { sprint: "Sprint 3", velocity: 31, capacity: 35 },
    { sprint: "Sprint 4", velocity: 27, capacity: 35 },
    { sprint: "Sprint 5", velocity: 34, capacity: 40 }
  ]

  const averageVelocity = velocityHistory.length > 0 ?
    Math.round(velocityHistory.reduce((sum, v) => sum + v.velocity, 0) / velocityHistory.length) : 0

  const getMemberWorkload = (member: User) => {
    const memberIssues = issues.filter(issue => issue.assignee === member.name)
    const activeIssues = memberIssues.filter(issue => 
      issue.status === "in_progress" || issue.status === "in_review"
    )
    return {
      total: memberIssues.length,
      active: activeIssues.length,
      completed: memberIssues.filter(i => i.status === "done").length,
      storyPoints: activeIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[800px] max-w-[90vw] p-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zamknij</TooltipContent>
              </Tooltip>

              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: team.color || "#3b82f6" }}
              />

              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold truncate">{team.name}</h1>
                {team.description && (
                  <p className="text-sm text-muted-foreground truncate">{team.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Dodaj członka
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dodaj nowego członka zespołu</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(team)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edytuj zespół
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Ustawienia
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 py-4 border-b sticky top-16 bg-background z-10">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Przegląd</TabsTrigger>
                  <TabsTrigger value="members">Członkowie</TabsTrigger>
                  <TabsTrigger value="performance">Wydajność</TabsTrigger>
                  <TabsTrigger value="activity">Aktywność</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 px-6 py-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Ukończone zadania</span>
                        </div>
                        <div className="text-2xl font-bold">{completedIssues.length}</div>
                        <div className="text-xs text-muted-foreground">
                          z {teamIssues.length} całkowitych
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Współczynnik ukończenia</span>
                        </div>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <Progress value={completionRate} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Średnia velocity</span>
                        </div>
                        <div className="text-2xl font-bold">{averageVelocity}</div>
                        <div className="text-xs text-muted-foreground">
                          SP na sprint
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Sprint Progress */}
                  {currentSprint && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Aktualny Sprint: {currentSprint.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Postęp sprintu</span>
                          <span>{sprintProgress}%</span>
                        </div>
                        <Progress value={sprintProgress} />
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Zadania w sprincie</div>
                            <div className="font-medium">{sprintIssues.length}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Ukończone</div>
                            <div className="font-medium">
                              {sprintIssues.filter(i => i.status === "done").length}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">W trakcie</div>
                            <div className="font-medium">
                              {sprintIssues.filter(i => i.status === "in_progress").length}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Team Lead */}
                  {teamLead && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Team Lead
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {teamLead.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{teamLead.name}</div>
                            <div className="text-sm text-muted-foreground">{teamLead.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Issues Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Status zadań
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Ukończone</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(completedIssues.length / teamIssues.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{completedIssues.length}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">W trakcie</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(inProgressIssues.length / teamIssues.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{inProgressIssues.length}</span>
                          </div>
                        </div>
                        
                        {blockedIssues.length > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-600">Zablokowane</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${(blockedIssues.length / teamIssues.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{blockedIssues.length}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Członkowie zespołu ({teamMembers.length})
                    </h3>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Dodaj członka
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {teamMembers.map((member) => {
                      const workload = getMemberWorkload(member)
                      const isLead = team.leadId === member.id
                      
                      return (
                        <Card key={member.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{member.name}</span>
                                    {isLead && (
                                      <Badge variant="secondary" className="text-xs">
                                        Team Lead
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{member.email}</div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {workload.active} aktywnych zadań
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {workload.storyPoints} SP w trakcie
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Zobacz profil
                                  </DropdownMenuItem>
                                  {!isLead && (
                                    <DropdownMenuItem className="text-destructive">
                                      <UserMinus className="h-4 w-4 mr-2" />
                                      Usuń z zespołu
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Member workload bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Obciążenie</span>
                                <span>{workload.completed}/{workload.total} ukończonych</span>
                              </div>
                              <Progress 
                                value={workload.total > 0 ? (workload.completed / workload.total) * 100 : 0} 
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6 mt-0">
                  {/* Velocity Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Historia Velocity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {velocityHistory.map((sprint, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{sprint.sprint}</span>
                              <span>{sprint.velocity}/{sprint.capacity} SP</span>
                            </div>
                            <div className="flex gap-1">
                              <Progress 
                                value={(sprint.velocity / sprint.capacity) * 100} 
                                className="flex-1"
                              />
                              <div className="w-12 text-xs text-right">
                                {Math.round((sprint.velocity / sprint.capacity) * 100)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Story Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Ukończone</span>
                            <span className="font-medium">{completedStoryPoints}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Całkowite</span>
                            <span className="font-medium">{totalStoryPoints}</span>
                          </div>
                          <Progress 
                            value={totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0}
                            className="mt-2"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Średni czas cyklu</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3.2 dni</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Średni czas od rozpoczęcia do ukończenia
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Ostatnia aktywność
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Brak aktywności</h3>
                        <p className="text-muted-foreground">
                          Historia aktywności zespołu pojawi się tutaj
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
