export type ViewType = 
  | "dashboard"
  | "issues" 
  | "current-sprint"
  | "sprints"
  | "teams"
  | "reports"
  | "activity"
  | "ai-automation"
  | "settings"

export type Priority = "P0" | "P1" | "P2" | "P3"

export type IssueStatus = 
  | "todo"
  | "in_progress" 
  | "in_review"
  | "blocked"
  | "done"

export type SprintStatus = "planned" | "active" | "completed"

export interface Issue {
  id: string
  key: string
  title: string
  description?: string
  priority: Priority
  status: IssueStatus
  assignee?: string
  sprintId?: string
  storyPoints?: number
  labels?: string[]
  isFavorite?: boolean
  createdAt: Date
  updatedAt: Date
  dueAt?: Date
}

export interface Sprint {
  id: string
  name: string
  goal?: string
  status: SprintStatus
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: "viewer" | "member" | "admin"
}

export interface Team {
  id: string
  name: string
  description?: string
  memberIds: string[]
  leadId?: string
  color?: string
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  content: string
  parentCommentId?: string
  createdAt: Date
  updatedAt?: Date
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  targetType: "issue" | "sprint" | "comment" | "team"
  targetId: string
  oldValue?: string
  newValue?: string
  timestamp: Date
}

