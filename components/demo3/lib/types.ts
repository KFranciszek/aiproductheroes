export type Priority = "P0" | "P1" | "P2" | "P3"
export type IssueStatus = "todo" | "in-progress" | "in-review" | "done" | "blocked"
export type IssueType = "feature" | "bug" | "improvement" | "task"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface Team {
  id: string
  name: string
  members: User[]
  velocity: number
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "planned" | "active" | "completed"
  goal?: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: Priority
  type: IssueType
  assignee?: User
  reporter: User
  sprint?: Sprint
  storyPoints?: number
  labels: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  subtasks?: Issue[]
  parentId?: string
  teamId?: string
}

export interface Comment {
  id: string
  issueId: string
  author: User
  content: string
  createdAt: string
  updatedAt?: string
  parentId?: string
}

export interface Activity {
  id: string
  type: "issue_created" | "issue_updated" | "comment_added" | "status_changed" | "sprint_started" | "sprint_completed"
  user: User
  issueId?: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: {
    event: string
    conditions: Array<{ field: string; operator: string; value: any }>
  }
  actions: Array<{ type: string; params: Record<string, any> }>
  createdAt: string
  lastRun?: string
}
