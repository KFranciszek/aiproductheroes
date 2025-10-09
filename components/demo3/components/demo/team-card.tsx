"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { Team } from "@/lib/types"
import { mockIssues } from "@/lib/mock-data"

interface TeamCardProps {
  team: Team
  onClick: () => void
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  const teamIssues = mockIssues.filter((i) => i.teamId === team.id)
  const inProgressIssues = teamIssues.filter((i) => i.status === "in-progress")
  const completedIssues = teamIssues.filter((i) => i.status === "done")

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Members */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Członkowie zespołu</p>
          <div className="flex -space-x-2">
            {team.members.map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* Sprint Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">W toku</p>
            <p className="text-2xl font-bold text-foreground">{inProgressIssues.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ukończone</p>
            <p className="text-2xl font-bold text-chart-2">{completedIssues.length}</p>
          </div>
        </div>

        {/* Velocity */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-chart-2" />
            <span className="text-sm text-muted-foreground">Velocity</span>
          </div>
          <Badge variant="secondary">{team.velocity} SP</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
