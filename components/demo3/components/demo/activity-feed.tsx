"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"
import { MessageSquare, GitCommit, AlertCircle, UserPlus, FileText } from "lucide-react"

interface Activity {
  id: string
  type: "comment" | "status_change" | "assignment" | "creation" | "update"
  user: {
    name: string
    avatar?: string
  }
  description: string
  issueId?: string
  timestamp: Date
}

interface ActivityFeedProps {
  activities: Activity[]
  onIssueClick?: (issueId: string) => void
}

const activityIcons = {
  comment: MessageSquare,
  status_change: GitCommit,
  assignment: UserPlus,
  creation: FileText,
  update: AlertCircle,
}

const activityColors = {
  comment: "text-blue-500",
  status_change: "text-green-500",
  assignment: "text-purple-500",
  creation: "text-yellow-500",
  update: "text-orange-500",
}

export function ActivityFeed({ activities, onIssueClick }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <div key={activity.id} className="flex gap-3 relative">
            {index !== activities.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />}
            <Avatar className="h-10 w-10 relative z-10">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{activity.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${colorClass}`} />
                <span className="font-medium text-sm">{activity.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: pl })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
                {activity.issueId && onIssueClick && (
                  <button onClick={() => onIssueClick(activity.issueId!)} className="ml-1 text-primary hover:underline">
                    {activity.issueId}
                  </button>
                )}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
