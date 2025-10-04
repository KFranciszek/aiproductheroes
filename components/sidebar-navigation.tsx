"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { IssueForm } from "./issue-form"
import { ThemeSelector } from "./theme-selector"
import { 
  LayoutDashboard,
  Target,
  ListTodo,
  Star,
  Calendar,
  BarChart3,
  Activity,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from "lucide-react"
import { useState } from "react"
import type { ViewType, Issue, Sprint, TaskTemplate } from "@/types"

interface SidebarNavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  issues: Issue[]
  sprints: Sprint[]
  templates: TaskTemplate[]
  onCreateIssue: (issueData: Partial<Issue>) => void
  onTemplateSelect: (template: TaskTemplate) => void
  selectedTemplate: TaskTemplate | null
}

export function SidebarNavigation({
  currentView,
  onViewChange,
  issues,
  sprints,
  templates,
  onCreateIssue,
  onTemplateSelect,
  selectedTemplate
}: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved === 'true'
    }
    return false
  })

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState))
    }
  }

  const activeSprint = sprints.find((sprint) => sprint.status === "Active")

  const navItems = [
    {
      id: "dashboard" as ViewType,
      label: "Dashboard",
      icon: LayoutDashboard,
      active: currentView === "dashboard",
    },
    {
      id: "current-sprint" as ViewType,
      label: "Current Sprint",
      icon: Target,
      active: currentView === "current-sprint",
    },
    {
      id: "issues" as ViewType,
      label: "Issues",
      icon: ListTodo,
      active: currentView === "issues",
      badge: issues.filter(i => i.status !== "Done").length,
    },
    {
      id: "favorites" as ViewType,
      label: "Favorites",
      icon: Star,
      active: currentView === "favorites",
      badge: issues.filter(i => i.isFavorite).length,
    },
    {
      id: "sprints" as ViewType,
      label: "Sprints",
      icon: Calendar,
      active: currentView === "sprints",
    },
    {
      id: "reports" as ViewType,
      label: "Reports",
      icon: BarChart3,
      active: currentView === "reports",
    },
    {
      id: "activity" as ViewType,
      label: "Activity",
      icon: Activity,
      active: currentView === "activity",
    },
  ]

  return (
    <aside 
      className={cn(
        "flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light dark:border-border-dark">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <h1 className="text-lg font-bold">TaskFlow</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="h-8 w-8"
          title={isCollapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-all duration-200",
                  isCollapsed && "justify-center",
                  item.active && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border-light dark:border-border-dark p-2 space-y-2">
        {/* New Task Button */}
        {!isCollapsed ? (
          <IssueForm
            sprints={sprints}
            onSubmit={onCreateIssue}
            templates={templates}
            onTemplateSelect={onTemplateSelect}
            selectedTemplate={selectedTemplate}
            trigger={
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            }
          />
        ) : (
          <IssueForm
            sprints={sprints}
            onSubmit={onCreateIssue}
            templates={templates}
            onTemplateSelect={onTemplateSelect}
            selectedTemplate={selectedTemplate}
            trigger={
              <Button size="icon" className="w-full bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        )}

        {/* Settings */}
        <Button
          variant={currentView === "settings" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center",
            currentView === "settings" && "bg-primary/10 text-primary"
          )}
          onClick={() => onViewChange("settings")}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </Button>

        {/* Theme Selector & Help */}
        <div className="flex gap-2">
          <ThemeSelector />
          {!isCollapsed && (
            <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}

