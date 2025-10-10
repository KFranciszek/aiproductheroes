"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Button } from "@/components/demo3/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Plus, Users, TrendingUp, Activity } from "lucide-react"
import { mockTeams, mockUsers, mockIssues } from "@/lib/demo3/mock-data"

export function TeamsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">{mockTeams.length} teams</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((team) => {
          const members = mockUsers.filter((u) => team.memberIds.includes(u.id))
          const teamIssues = mockIssues.filter((i) => members.some((m) => m.id === i.assigneeId))
          const avgVelocity =
            team.velocityHistory && team.velocityHistory.length > 0
              ? Math.round(team.velocityHistory.reduce((a, b) => a + b, 0) / team.velocityHistory.length)
              : 0

          return (
            <Card key={team.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.name}
                </CardTitle>
                <CardDescription>{members.length} members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Members */}
                <div className="flex -space-x-2">
                  {members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {members.length > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{members.length - 4}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>Active Tasks</span>
                    </div>
                    <p className="text-2xl font-bold">{teamIssues.filter((i) => i.status !== "done").length}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>Avg Velocity</span>
                    </div>
                    <p className="text-2xl font-bold">{avgVelocity}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
