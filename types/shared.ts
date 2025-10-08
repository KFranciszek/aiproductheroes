/**
 * Shared Types
 * Podstawowe typy używane w całej aplikacji
 */

export type Theme = 'light' | 'dark' | 'system' | 'blue' | 'green' | 'purple' | 'orange'
export type Priority = "P0" | "P1" | "P2" | "P3" | "P4" | "P5"

export interface ThemeConfig {
  id: Theme
  name: string
  colors: Record<string, string>
}

