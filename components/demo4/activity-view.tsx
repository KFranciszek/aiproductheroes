"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Activity as ActivityIcon,
  GitCommit,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Calendar
} from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { useUI } from "@/lib/demo4/ui-context";

const activityIcons = {
  issue_created: GitCommit,
  issue_updated: GitCommit,
  status_changed: CheckCircle2,
  comment_added: MessageSquare,
  assigned: UserPlus,
  sprint_changed: Calendar,
};

const activityColors = {
  issue_created: "text-[var(--success-text)]",
  issue_updated: "text-[var(--info-text)]",
  status_changed: "text-[var(--brand-primary)]",
  comment_added: "text-[var(--text-secondary)]",
  assigned: "text-[var(--warning-text)]",
  sprint_changed: "text-[var(--brand-secondary)]",
};

export function ActivityView() {
  const { activities, users, issues } = useData();
  const { openIssueDetail } = useUI();

  const getUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const getIssue = (issueId: string) => {
    return issues.find(i => i.id === issueId);
  };

  const getActivityDescription = (activity: typeof activities[0]) => {
    const issue = getIssue(activity.targetId);
    if (!issue) return "performed an action";

    switch (activity.type) {
      case "issue_created":
        return `created issue ${issue.key}`;
      case "issue_updated":
        return `updated issue ${issue.key}`;
      case "status_changed":
        return `changed status of ${issue.key} to ${activity.payload?.status || "unknown"}`;
      case "comment_added":
        return `commented on ${issue.key}`;
      case "assigned":
        return `was assigned to ${issue.key}`;
      case "sprint_changed":
        return `moved ${issue.key} to a different sprint`;
      default:
        return `performed an action on ${issue.key}`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="flex items-center gap-3">
          <ActivityIcon className="w-6 h-6 text-[var(--brand-primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Activity</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Recent activity across all projects
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <ActivityIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                No Activity Yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Activity will appear here as you work
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const user = getUser(activity.actorId);
                const issue = getIssue(activity.targetId);
                const Icon = activityIcons[activity.type as keyof typeof activityIcons] || GitCommit;
                const iconColor = activityColors[activity.type as keyof typeof activityColors] || "text-[var(--text-secondary)]";

                return (
                  <Card
                    key={activity.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => issue && openIssueDetail(issue.id)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && issue) {
                        e.preventDefault();
                        openIssueDetail(issue.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Activity: ${getActivityDescription(activity)}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>
                          {user?.name.split(" ").map((n: string) => n[0]).join("") || "?"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm text-[var(--text-primary)]">
                            <span className="font-medium">{user?.name || "Unknown"}</span>
                            {" "}
                            <span className="text-[var(--text-secondary)]">
                              {getActivityDescription(activity)}
                            </span>
                          </p>
                          <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                          <span>{getTimeAgo(activity.createdAt)}</span>
                          {issue && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {issue.key}
                              </Badge>
                            </>
                          )}
                        </div>

                        {/* Payload details */}
                        {activity.payload && Object.keys(activity.payload).length > 0 && (
                          <div className="mt-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded px-2 py-1">
                            {JSON.stringify(activity.payload, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
