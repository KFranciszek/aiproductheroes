// Core data types for Syzio demo

export type ID = string

export type Priority = "P0" | "P1" | "P2" | "P3"
export type Status = "todo" | "in_progress" | "in_review" | "blocked" | "done"
export type Role = "viewer" | "member" | "admin"
export type SprintStatus = "planned" | "active" | "completed"

export interface User {
  id: ID
  name: string
  email: string
  avatarUrl?: string
  role: Role
}

export interface Issue {
  id: ID
  key: string
  title: string
  description?: string
  priority: Priority
  status: Status
  assigneeId?: ID
  sprintId?: ID
  storyPoints?: number
  labels?: string[]
  parentId?: ID
  subtaskIds?: ID[]
  favorite?: boolean
  createdAt: string
  updatedAt: string
  dueAt?: string
}

export interface Sprint {
  id: ID
  name: string
  goal?: string
  start: string
  end: string
  status: SprintStatus
  issueIds: ID[]
}

export interface Team {
  id: ID
  name: string
  memberIds: ID[]
  velocityHistory?: number[]
}

export interface Comment {
  id: ID
  issueId: ID
  authorId: ID
  body: string
  createdAt: string
  updatedAt?: string
  parentId?: ID
}

export interface Attachment {
  id: ID
  issueId: ID
  name: string
  url: string
  type: string
  size: number
}

export interface Activity {
  id: ID
  actorId: ID
  type: string
  targetType: "issue" | "sprint" | "comment" | "automation" | "team"
  targetId: ID
  createdAt: string
  payload?: Record<string, any>
}

export interface AutomationRule {
  id: ID
  name: string
  active: boolean
  when: string[]
  if: string[]
  then: string[]
  lastRunAt?: string
  lastRunStatus?: "success" | "error"
}
