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
  storyPoints?: number // Story Points dla zadania
  type?: 'Bug' | 'Feature' | 'Chore' // Typ zadania
  assignee?: string
  sprintId?: string
  parentId?: string // Dla hierarchii zadań
  progress?: number // Automatycznie obliczane (0-100)
  attachments: Attachment[] // Załączniki
  isFavorite?: boolean // Ulubione zadanie
  favoritedBy?: string[] // Lista użytkowników, którzy dodali do ulubionych
  statusHistory?: { status: IssueStatus; date: Date }[] // Historia zmian statusu
  createdAt: Date
  updatedAt: Date
}

export interface Sprint {
  id: string
  name: string
  status: SprintStatus
  startDate: Date
  endDate: Date
  velocity?: number
  capacity?: number
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

export type ViewType = "dashboard" | "issues" | "current-sprint" | "sprints" | "reports" | "favorites" | "activity" | "ai-automation" | "settings"

// From etap_2.5.md
export type UserRole = 'Admin' | 'Developer' | 'Designer' | 'Product Owner' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  skills: string[];
  capacity: number; // hours per day
  isActive: boolean;
  joinedAt: Date;
  lastSeen?: Date;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// AI & Automation Types
export type AutomationCategory = 'sync' | 'assignment' | 'notification' | 'sprint' | 'recurring' | 'custom'
export type AutomationTriggerType = 'status_change' | 'pr_merged' | 'time_based' | 'assignee_change' | 'sprint_start' | 'sprint_end' | 'comment_added' | 'manual'
export type AutomationConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in_sprint' | 'has_tag'
export type AutomationActionType = 'move_status' | 'assign_user' | 'send_notification' | 'move_to_sprint' | 'add_comment' | 'update_field' | 'create_task'
export type AutomationStatus = 'active' | 'paused' | 'failed' | 'draft'
export type ExecutionStatus = 'success' | 'failed' | 'warning' | 'running'

export interface AutomationTrigger {
  type: AutomationTriggerType
  config: Record<string, any>
}

export interface AutomationCondition {
  field: string
  operator: AutomationConditionOperator
  value: any
}

export interface AutomationAction {
  type: AutomationActionType
  config: Record<string, any>
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  category: AutomationCategory
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  status: AutomationStatus
  successRate: number
  lastRun?: Date
  executionCount: number
  failureCount: number
  avgExecutionTime: number // ms
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface AutomationExecution {
  id: string
  ruleId: string
  ruleName: string
  status: ExecutionStatus
  timestamp: Date
  duration: number // ms
  triggerData: any
  result?: any
  error?: string
  affectedIssues?: string[]
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: AutomationCategory
  icon: string
  popularity: number // 0-100
  rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'executionCount' | 'failureCount' | 'lastRun'>
}

export interface AIInsight {
  id: string
  type: 'risk' | 'suggestion' | 'pattern' | 'optimization'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  actionable: boolean
  action?: {
    label: string
    ruleTemplate?: AutomationTemplate
  }
  relatedIssues?: string[]
  relatedSprints?: string[]
  createdAt: Date
  dismissed?: boolean
}

export interface AutomationMetrics {
  healthScore: number // 0-100
  activeRules: number
  totalExecutions: number
  successRate: number // %
  timeSavedHours: number
  failureRate: number
  avgResponseTime: number // ms
}

// Funkcja pomocnicza do obliczania progresu zadań
export function calculateProgress(issue: Issue, allIssues: Issue[]): number {
  if (!issue.parentId) return 0 // Nie jest podzadaniem

  const siblings = allIssues.filter(i => i.parentId === issue.parentId)
  if (siblings.length === 0) return 0

  const completed = siblings.filter(sub => sub.status === 'Done').length
  return Math.round((completed / siblings.length) * 100)
}
