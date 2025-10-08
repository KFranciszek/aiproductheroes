/**
 * Sprint Types
 * Typy związane ze sprintami
 */

import type { User } from './team'

export type SprintStatus = "Planned" | "Active" | "Completed"

export interface Sprint {
  id: string
  name: string
  status: SprintStatus
  startDate: Date
  endDate: Date
  velocity?: number
  capacity?: number
  teamId?: string
  teamCapacity?: {
    teamId: string
    allocatedCapacity: number
    memberIds: string[]
  }[]
  dependencies?: {
    sprintId: string
    teamId: string
    description: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface SprintMetrics {
  activeSprint?: Sprint
  totalTasks: number
  completedTasks: number
  progressPercentage: number
  totalStoryPoints: number
  wipLimits: Record<string, number>
  teamLoad: Array<{
    user: User
    taskCount: number
    storyPoints: number
    loadPercentage: number
  }>
}

