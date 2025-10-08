/**
 * View & UI Types
 * Typy związane z widokami i UI
 */

export type ViewType = "dashboard" | "issues" | "current-sprint" | "sprints" | "teams" | "reports" | "favorites" | "activity" | "ai-automation" | "settings"

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

