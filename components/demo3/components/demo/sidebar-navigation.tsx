"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  ListTodo,
  Target,
  Calendar,
  Users,
  BarChart3,
  Activity,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
  HelpCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "./theme-provider"
import { cn } from "@/lib/utils"
import { mockIssues } from "@/lib/mock-data"

type View =
  | "dashboard"
  | "issues"
  | "current-sprint"
  | "sprints"
  | "teams"
  | "reports"
  | "activity"
  | "automation"
  | "settings"

interface SidebarNavigationProps {
  currentView: View
  onNavigate: (view: View) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function SidebarNavigation({ currentView, onNavigate, collapsed, onToggleCollapse }: SidebarNavigationProps) {
  const { theme, setTheme } = useTheme()
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

  const issuesCount = mockIssues.filter((i) => i.status !== "done").length
  const favoritesCount = 3

  const navItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "issues" as View, label: "Issues", icon: ListTodo, badge: issuesCount },
    { id: "current-sprint" as View, label: "Current Sprint", icon: Target },
    { id: "sprints" as View, label: "Sprints", icon: Calendar },
    { id: "teams" as View, label: "Teams", icon: Users },
    { id: "reports" as View, label: "Reports", icon: BarChart3 },
    { id: "activity" as View, label: "Activity", icon: Activity },
    { id: "automation" as View, label: "AI Automation", icon: Sparkles },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-8 h-[calc(100vh-2rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Syzio</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            )
          })}

          {!collapsed && (
            <>
              <Separator className="my-4" />
              <button
                onClick={() => onNavigate("issues")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Star className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Favorites</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {favoritesCount}
                </Badge>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-sidebar-border p-2 space-y-2">
        {!collapsed && (
          <Button onClick={() => setShowNewTaskForm(true)} className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}

        <div className={cn("flex gap-1", collapsed ? "flex-col" : "flex-row")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!collapsed && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("settings")}
                className="h-8 w-8"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Keyboard shortcuts">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
