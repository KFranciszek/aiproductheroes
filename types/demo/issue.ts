/**
 * Issue Types
 * Typy związane z zadaniami/issue
 */

import type { Priority } from '../shared'
import type { UserRole } from './team'

export type IssueStatus = "Todo" | "In Progress" | "In Review" | "Done"
export type AttachmentType = 'file' | 'link'

export interface Issue {
  id: string
  title: string
  description?: string
  priority: Priority
  status: IssueStatus
  storyPoints?: number
  type?: 'Bug' | 'Feature' | 'Chore'
  assignee?: {
    id: string
    name: string
    avatar?: string
    role: UserRole
    skills: string[]
    capacity: number
  }
  sprintId?: string
  parentId?: string
  progress?: number
  attachments: Attachment[]
  isFavorite?: boolean
  favoritedBy?: string[]
  statusHistory?: { status: IssueStatus; date: Date }[]
  dependencies?: {
    blocks: string[]
    blockedBy: string[]
  }
  estimatedHours?: number
  actualHours?: number
  createdAt: Date
  updatedAt: Date
}

export interface Attachment {
  id: string
  issueId: string
  type: AttachmentType
  name: string
  url: string
  size?: number
  mimeType?: string
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  content: string
  parentCommentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface TaskTemplate {
  id: string
  name: string
  description?: string
  category: string
  fields: Partial<Issue>
}

export interface SavedFilter {
  id: string
  name: string
  criteria: SearchCriteria
}

export interface SearchCriteria {
  query: string
  priority?: string[]
  status?: string[]
  assignee?: string[]
  dateRange?: { start: Date; end: Date }
  tags?: string[]
}

// Helper function
export function calculateProgress(issue: Issue, allIssues: Issue[]): number {
  if (!issue.parentId) return 0

  const siblings = allIssues.filter(i => i.parentId === issue.parentId)
  if (siblings.length === 0) return 0

  const completed = siblings.filter(sub => sub.status === 'Done').length
  return Math.round((completed / siblings.length) * 100)
}

