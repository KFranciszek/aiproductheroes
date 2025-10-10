"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, GitCommit, MessageSquare, CheckCircle2, AlertCircle, Zap, Users } from "lucide-react"
import { mockActivities, mockUsers, mockIssues } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

const activityIcons = {
  issue_created: GitCommit,
  issue_updated: CheckCircle2,
  comment_added: MessageSquare,
  sprint_started: Zap,
  sprint_completed: CheckCircle2,
  team_updated: Users,
  automation_triggered: AlertCircle,
}

export function ActivityView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground">Recent activity across all projects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search activity..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="issues">Issues</SelectItem>
            <SelectItem value="sprints">Sprints</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
            <SelectItem value="teams">Teams</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-users">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-users">All Users</SelectItem>
            {mockUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockActivities.map((activity, index) => {
              const actor = mockUsers.find((u) => u.id === activity.actorId)
              const Icon = activityIcons[activity.type as keyof typeof activityIcons] || GitCommit
              const issue = activity.targetType === "issue" ? mockIssues.find((i) => i.id === activity.targetId) : null

              return (
                <div key={activity.id} className="flex gap-4 p-6 hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={actor?.avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>{actor?.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm leading-relaxed">
                          <span className="font-medium">{actor?.name}</span>{" "}
                          {activity.type === "issue_created" && "created issue"}
                          {activity.type === "issue_updated" && "updated issue"}
                          {activity.type === "comment_added" && "commented on"}
                          {issue && (
                            <>
                              {" "}
                              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{issue.key}</code>
                              <span className="text-muted-foreground"> - {issue.title}</span>
                            </>
                          )}
                        </p>

                        {activity.payload && activity.type === "issue_updated" && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Changed {activity.payload.field}:</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.payload.from}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.payload.to}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: pl })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Additional mock activities */}
            <div className="flex gap-4 p-6 hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={mockUsers[1].avatarUrl || "/placeholder.svg"} />
                <AvatarFallback>{mockUsers[1].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">{mockUsers[1].name}</span> started sprint{" "}
                    <span className="font-medium">Sprint 24</span>
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <time className="text-xs text-muted-foreground whitespace-nowrap">3 days ago</time>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-6 hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={mockUsers[2].avatarUrl || "/placeholder.svg"} />
                <AvatarFallback>{mockUsers[2].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">{mockUsers[2].name}</span> added a comment on{" "}
                    <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">TASK-102</code>
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <time className="text-xs text-muted-foreground whitespace-nowrap">5 days ago</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
