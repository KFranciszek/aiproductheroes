/**
 * Team & User Types
 * Typy związane z zespołami i użytkownikami
 */

export type UserRole = 'Admin' | 'Developer' | 'Designer' | 'Product Owner' | 'Viewer'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  skills: string[]
  capacity: number
  isActive: boolean
  joinedAt: Date
  lastSeen?: Date
  teamIds: string[]
  primaryTeamId?: string
  isTeamLead: boolean
}

export interface Team {
  id: string
  name: string
  description?: string
  avatar?: string
  color: string
  memberIds: string[]
  leadId?: string
  departmentId?: string
  parentTeamId?: string
  defaultCapacity: number
  timezone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TeamMetrics {
  teamId: string
  period: {
    startDate: Date
    endDate: Date
  }
  averageVelocity: number
  velocityTrend: 'increasing' | 'decreasing' | 'stable'
  completionRate: number
  onTimeDelivery: number
  bugRate: number
  reworkRate: number
  crossTeamDependencies: number
  blockedTasksCount: number
  avgWorkloadPerMember: number
  capacityUtilization: number
}

export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

