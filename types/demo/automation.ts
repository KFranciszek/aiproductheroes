/**
 * Automation & AI Types
 * Typy związane z automatyzacją i AI
 */

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
  avgExecutionTime: number
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
  duration: number
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
  popularity: number
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
  healthScore: number
  activeRules: number
  totalExecutions: number
  successRate: number
  timeSavedHours: number
  failureRate: number
  avgResponseTime: number
}

