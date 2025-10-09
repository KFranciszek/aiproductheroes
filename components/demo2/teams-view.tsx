"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TeamForm } from "./team-form"
import { TeamDetailView } from "./team-detail-view"
import { NoTeamsEmpty } from "./empty-states"
import { Users, Plus, TrendingUp, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import type { Team, User, Issue } from "@/types/demo2"
import { toast } from "sonner"

interface TeamsViewProps {
  teams: Team[]
  users: User[]
  issues: Issue[]
  sprints?: any[]
  onUpdateTeams?: (teams: Team[]) => void
}

export function TeamsView({ teams, users, issues, sprints = [], onUpdateTeams }: TeamsViewProps) {
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | undefined>()
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>()
  const [isTeamDetailOpen, setIsTeamDetailOpen] = useState(false)
  const getTeamMembers = (team: Team) => {
    return users.filter(user => team.memberIds.includes(user.id))
  }

  const getTeamIssues = (team: Team) => {
    const teamMembers = getTeamMembers(team)
    return issues.filter(issue => 
      teamMembers.some(member => issue.assignee === member.name)
    )
  }

  const handleCreateTeam = () => {
    setEditingTeam(undefined)
    setIsTeamFormOpen(true)
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setIsTeamFormOpen(true)
  }

  const handleSaveTeam = (teamData: Partial<Team>) => {
    if (!onUpdateTeams) return

    if (editingTeam) {
      // Update existing team
      const updatedTeams = teams.map(team =>
        team.id === editingTeam.id 
          ? { ...team, ...teamData }
          : team
      )
      onUpdateTeams(updatedTeams)
    } else {
      // Create new team
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        ...teamData as Required<Pick<Team, 'name' | 'memberIds'>>,
        velocityHistory: [],
      }
      onUpdateTeams([...teams, newTeam])
    }
  }

  const handleDeleteTeam = (team: Team) => {
    if (!onUpdateTeams) return

    const updatedTeams = teams.filter(t => t.id !== team.id)
    onUpdateTeams(updatedTeams)
    toast.success("Zespół usunięty", {
      description: team.name
    })
  }

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team)
    setIsTeamDetailOpen(true)
  }

  const handleEditFromDetail = (team: Team) => {
    setIsTeamDetailOpen(false)
    setEditingTeam(team)
    setIsTeamFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Zarządzaj zespołami i ich wydajnością
          </p>
        </div>
        
        <Button onClick={handleCreateTeam}>
          <Plus className="w-4 h-4 mr-2" />
          Nowy zespół
        </Button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <NoTeamsEmpty onCreateTeam={handleCreateTeam} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
          const members = getTeamMembers(team)
          const teamIssues = getTeamIssues(team)
          const completedIssues = teamIssues.filter(issue => issue.status === "done")
          const completionRate = teamIssues.length > 0 ? 
            Math.round((completedIssues.length / teamIssues.length) * 100) : 0

            return (
              <Card 
                key={team.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewTeamDetails(team)}
              >
              <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color || "#3b82f6" }}
                    />
                    {team.name}
                  </CardTitle>
                  {team.description && (
                    <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                  )}
                </div>
                
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTeamDetails(team)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Zobacz szczegóły
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteTeam(team)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Team Members */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Członkowie ({members.length})</span>
                  </div>
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">+{members.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{teamIssues.length}</div>
                    <div className="text-xs text-muted-foreground">Aktywne zadania</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      {completionRate}%
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Completion rate</div>
                  </div>
                </div>

                {/* Team Lead */}
                {team.leadId && (
                  <div>
                    <div className="text-sm font-medium mb-1">Team Lead</div>
                    {(() => {
                      const lead = users.find(u => u.id === team.leadId)
                      return lead ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {lead.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{lead.name}</span>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        </div>
      )}

        <TeamForm
          team={editingTeam}
          users={users}
          open={isTeamFormOpen}
          onOpenChange={setIsTeamFormOpen}
          onSave={handleSaveTeam}
        />

        {selectedTeam && (
          <TeamDetailView
            team={selectedTeam}
            users={users}
            issues={issues}
            sprints={sprints}
            open={isTeamDetailOpen}
            onOpenChange={setIsTeamDetailOpen}
            onEdit={handleEditFromDetail}
          />
        )}
      </div>
    )
  }
