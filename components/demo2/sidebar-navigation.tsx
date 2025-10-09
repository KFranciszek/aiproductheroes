"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { 
  Home, 
  List, 
  Play, 
  FolderOpen, 
  Users, 
  BarChart3, 
  Activity, 
  Sparkles,
  Settings,
  Plus,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Sun,
  Moon
} from "lucide-react"
import { useTheme } from "next-themes"
import type { ViewType, Issue } from "@/types/demo2"

interface SidebarNavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  issues: Issue[]
}

export function SidebarNavigation({ currentView, onViewChange, issues }: SidebarNavigationProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  const favoriteIssues = issues.filter(issue => issue.isFavorite)
  const urgentIssues = issues.filter(issue => issue.priority === "P0" || issue.priority === "P1")

  const navItems = [
    { 
      id: "dashboard" as ViewType, 
      label: "Dashboard", 
      icon: Home,
      description: "Przegląd projektów"
    },
    { 
      id: "issues" as ViewType, 
      label: "Issues", 
      icon: List,
      description: "Wszystkie zadania",
      badge: issues.length.toString()
    },
    { 
      id: "current-sprint" as ViewType, 
      label: "Current Sprint", 
      icon: Play,
      description: "Aktywny sprint"
    },
    { 
      id: "sprints" as ViewType, 
      label: "Sprints", 
      icon: FolderOpen,
      description: "Zarządzanie sprintami"
    },
    { 
      id: "teams" as ViewType, 
      label: "Teams", 
      icon: Users,
      description: "Zespoły projektowe"
    },
    { 
      id: "reports" as ViewType, 
      label: "Reports", 
      icon: BarChart3,
      description: "Raporty i analityki"
    },
    { 
      id: "activity" as ViewType, 
      label: "Activity", 
      icon: Activity,
      description: "Historia zmian"
    },
    { 
      id: "ai-automation" as ViewType, 
      label: "AI Automation", 
      icon: Sparkles,
      description: "Automatyzacja AI"
    }
  ]

  const quickItems = [
    {
      id: "favorites",
      label: "Favorites",
      icon: Star,
      badge: favoriteIssues.length.toString(),
      onClick: () => onViewChange("issues") // TODO: Add favorites filter
    }
  ]

  return (
    <TooltipProvider>
      <div className={`
        flex flex-col h-full bg-card border-r border-border transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-[280px]"}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                {/* Logo - Three celestial bodies in alignment (Syzygy) */}
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="12" r="3" fill="var(--primary)" opacity="0.8"/>
                  <circle cx="12" cy="12" r="3" fill="var(--accent)" opacity="0.9"/>
                  <circle cx="18" cy="12" r="3" fill="var(--success)" opacity="0.8"/>
                  <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                </svg>
                <h2 className="text-lg font-bold">Syzio</h2>
              </div>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCollapsed(!collapsed)}
                  className="h-8 w-8 p-0"
                >
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {collapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <Tooltip key={item.id} delayDuration={collapsed ? 0 : 1000}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => onViewChange(item.id)}
                      className={`
                        w-full justify-start relative group
                        ${collapsed ? "px-2" : "px-3"}
                        ${isActive ? "bg-primary text-primary-foreground border-l-4 border-l-accent" : ""}
                      `}
                    >
                      <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="flex flex-col gap-1">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs w-fit">
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>

          {/* Quick Access */}
          {!collapsed && <Separator className="my-4" />}
          
          <div className="space-y-1">
            {quickItems.map((item) => {
              const Icon = item.icon
              
              return (
                <Tooltip key={item.id} delayDuration={collapsed ? 0 : 1000}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={item.onClick}
                      className={`
                        w-full justify-start relative
                        ${collapsed ? "px-2" : "px-3"}
                      `}
                    >
                      <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && item.badge !== "0" && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && item.badge !== "0" && (
                        <Badge 
                          variant="outline" 
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <span>{item.label}</span>
                      {item.badge && item.badge !== "0" && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-border space-y-2">
          {/* New Task Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className={`w-full ${collapsed ? "px-2" : "px-3"}`}
                onClick={() => {
                  // TODO: Open new task modal
                  console.log("New Task")
                }}
              >
                <Plus className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
                {!collapsed && "New Task"}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                New Task
              </TooltipContent>
            )}
          </Tooltip>

          {/* Theme Toggle */}
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          )}

          {/* Settings & Help */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewChange("settings")}
                  className={`${collapsed ? "flex-1" : "flex-1"}`}
                >
                  <Settings className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Settings</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Settings
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Open keyboard shortcuts help
                    console.log("Help")
                  }}
                  className={`${collapsed ? "flex-1" : "flex-1"}`}
                >
                  <HelpCircle className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Help</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Keyboard Shortcuts (?)
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
