export type Priority = "P0" | "P1" | "P2" | "P3" | "P4" | "P5"
export type IssueStatus = "Todo" | "In Progress" | "In Review" | "Done"
export type SprintStatus = "Planned" | "Active" | "Completed"
export type ActivityAction = 'created' | 'updated' | 'deleted' | 'status_changed' | 'assignee_changed' | 'comment_added' | 'favorite_added' | 'favorite_removed'
export type Theme = 'light' | 'dark' | 'system' | 'blue' | 'green' | 'purple' | 'orange'
export type TimeEntryType = 'manual' | 'pomodoro'
export type AttachmentType = 'file' | 'link'

export interface Issue {
  id: string
  title: string
  description?: string
  priority: Priority
  status: IssueStatus
  assignee?: string
  sprintId?: string
  parentId?: string // Dla hierarchii zadań
  progress?: number // Automatycznie obliczane (0-100)
  attachments: Attachment[] // Załączniki
  isFavorite?: boolean // Ulubione zadanie
  favoritedBy?: string[] // Lista użytkowników, którzy dodali do ulubionych
  createdAt: Date
  updatedAt: Date
}

export interface Sprint {
  id: string
  name: string
  status: SprintStatus
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  content: string
  parentCommentId?: string // Dla wątków komentarzy
  createdAt: Date
  updatedAt: Date
}

export interface TimeEntry {
  id: string
  issueId: string
  userId: string
  startTime: Date
  endTime?: Date
  duration?: number // w minutach
  description?: string
  type: TimeEntryType
}

export interface Attachment {
  id: string
  issueId: string
  type: AttachmentType
  name: string
  url: string
  size?: number // dla plików
  mimeType?: string
}

export interface ActivityLog {
  id: string
  issueId: string
  userId: string
  action: ActivityAction
  oldValue?: any
  newValue?: any
  field?: string // Pole, które zostało zmienione
  timestamp: Date
  metadata?: Record<string, any>
}

export interface TaskTemplate {
  id: string
  name: string
  description?: string
  category: string // np. 'Frontend', 'Backend'
  fields: Partial<Issue> // Pre-fill dla pól zadania
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

export interface ThemeConfig {
  id: Theme
  name: string
  colors: Record<string, string>
}

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export type ViewType = "issues" | "current-sprint" | "sprints" | "reports" | "favorites" | "activity"

// Funkcja pomocnicza do obliczania progresu zadań
export function calculateProgress(issue: Issue, allIssues: Issue[]): number {
  if (!issue.parentId) return 0 // Nie jest podzadaniem

  const siblings = allIssues.filter(i => i.parentId === issue.parentId)
  if (siblings.length === 0) return 0

  const completed = siblings.filter(sub => sub.status === 'Done').length
  return Math.round((completed / siblings.length) * 100)
}
