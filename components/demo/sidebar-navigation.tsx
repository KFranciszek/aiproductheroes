"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { IssueForm } from "./issue-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard,
  Target,
  ListTodo,
  Star,
  Calendar,
  BarChart3,
  Activity,
  Bot,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Users,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useMemo, useEffect } from "react"
import type { ViewType, Issue, Sprint, TaskTemplate } from "@/types"

interface SidebarNavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  issues: Issue[]
  sprints: Sprint[]
  onCreateIssue: (issueData: Partial<Issue>) => void
}

export function SidebarNavigation({
  currentView,
  onViewChange,
  issues,
  sprints,
  onCreateIssue
}: SidebarNavigationProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved === 'true'
    }
    return false
  })
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState))
    }
  }

  const activeSprint = sprints.find((sprint) => sprint.status === "Active")

  // Memoize badge calculations to prevent hydration mismatch
  const openIssuesCount = useMemo(() => 
    issues.filter(i => i.status !== "Done").length, 
    [issues]
  )
  
  const favoritesCount = useMemo(() => 
    issues.filter(i => i.isFavorite).length, 
    [issues]
  )

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
      badge: openIssuesCount,
    },
    {
      id: "favorites" as ViewType,
      label: "Favorites",
      icon: Star,
      active: currentView === "favorites",
      badge: favoritesCount,
    },
    {
      id: "sprints" as ViewType,
      label: "Sprints",
      icon: Calendar,
      active: currentView === "sprints",
    },
    {
      id: "teams" as ViewType,
      label: "Teams",
      icon: Users,
      active: currentView === "teams",
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
    {
      id: "ai-automation" as ViewType,
      label: "AI & Automation",
      icon: Bot,
      active: currentView === "ai-automation",
    },
  ]

  return (
    <aside 
      className={cn(
        "flex flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        backgroundColor: 'var(--surface-1)',
        borderRightColor: 'var(--border-1)'
      }}
    >
      {/* Logo */}
      <div 
        className="h-16 flex items-center justify-between px-4 border-b"
        style={{ borderBottomColor: 'var(--border-1)' }}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Three celestial bodies in alignment - Syzygy */}
              <circle cx="6" cy="12" r="3" fill="#3b82f6" opacity="0.8"/>
              <circle cx="12" cy="12" r="3" fill="#8b5cf6" opacity="0.9"/>
              <circle cx="18" cy="12" r="3" fill="#10b981" opacity="0.8"/>
              {/* Alignment line */}
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </svg>
            <h1 className="text-lg font-bold">Syzio</h1>
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
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 transition-all duration-200",
                  isCollapsed && "justify-center",
                  item.active && "bg-primary/10 text-[#1173d4] hover:bg-primary/20 dark:bg-primary/20 dark:text-[#60a5fa] dark:hover:bg-primary/30"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && mounted && item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-auto" suppressHydrationWarning>
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div 
        className="border-t p-2 space-y-2"
        style={{ borderTopColor: 'var(--border-1)' }}
      >
        {/* New Task Button */}
        {!isCollapsed ? (
          <IssueForm
            sprints={sprints}
            onSubmit={onCreateIssue}
            trigger={
              <Button variant="primary" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            }
          />
        ) : (
          <IssueForm
            sprints={sprints}
            onSubmit={onCreateIssue}
            trigger={
              <Button variant="primary" size="icon" className="w-full">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        )}

        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 px-2 py-2",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/avatars/demo-user.png" />
            <AvatarFallback className="bg-[#1173d4] text-white">JD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Atlas Pod</p>
            </div>
          )}
        </div>

        {/* Integrations Section */}
        {!isCollapsed && (
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-muted-foreground">Integracje</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onViewChange("settings")}
              >
                Więcej
              </Button>
            </div>
            
            {/* Integration Status Indicators */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors">
                <div className="h-5 w-5 rounded bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                  <span className="text-orange-600 dark:text-orange-400 text-[10px] font-semibold">H</span>
                </div>
                <span className="text-xs flex-1">Helix</span>
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" title="Connected" />
              </div>
              
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors">
                <div className="h-5 w-5 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 text-[10px] font-semibold">C</span>
                </div>
                <span className="text-xs flex-1">Canis</span>
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" title="Connected" />
              </div>
              
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors">
                <div className="h-5 w-5 rounded bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center shrink-0">
                  <span className="text-pink-600 dark:text-pink-400 text-[10px] font-semibold">P</span>
                </div>
                <span className="text-xs flex-1">Pulsar</span>
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" title="Connected" />
              </div>
            </div>
          </div>
        )}

        {/* Collapsed view - just show status dots */}
        {isCollapsed && (
          <div className="flex justify-center gap-1 py-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" title="Helix: Connected" />
            <div className="h-2 w-2 rounded-full bg-purple-500" title="Canis: Connected" />
            <div className="h-2 w-2 rounded-full bg-pink-500" title="Pulsar: Connected" />
          </div>
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center"
          )}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={isCollapsed ? "Toggle theme" : undefined}
        >
          <Sun className="h-5 w-5 shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {!isCollapsed && <span className="flex-1 text-left">Theme</span>}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center",
            currentView === "settings" && "bg-primary/10 text-[#1173d4] hover:bg-primary/20 dark:bg-primary/20 dark:text-[#60a5fa] dark:hover:bg-primary/30"
          )}
          onClick={() => onViewChange("settings")}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </Button>

        {/* Help */}
        {!isCollapsed && (
          <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </aside>
  )
}

