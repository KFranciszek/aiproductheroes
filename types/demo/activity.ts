/**
 * Activity & Time Tracking Types
 * Typy związane z aktywnością i czasem
 */

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'status_changed' | 'assignee_changed' | 'comment_added' | 'favorite_added' | 'favorite_removed'
export type TimeEntryType = 'manual' | 'pomodoro'

export interface ActivityLog {
  id: string
  issueId: string
  userId: string
  action: ActivityAction
  oldValue?: any
  newValue?: any
  field?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface TimeEntry {
  id: string
  issueId: string
  userId: string
  startTime: Date
  endTime?: Date
  duration?: number
  description?: string
  type: TimeEntryType
}

