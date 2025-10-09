"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
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
  Star,
  AlertTriangle,
  Clock
} from "lucide-react"
import type { ViewType, Issue, Sprint } from "@/types/demo2"

interface CommandPaletteProps {
  issues: Issue[]
  sprints: Sprint[]
  onNavigate: (view: ViewType) => void
  onOpenIssue: (issueId: string) => void
}

export function CommandPalette({ issues, sprints, onNavigate, onOpenIssue }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const navigationItems = [
    { id: "dashboard", label: "Go to Dashboard", icon: Home, shortcut: "G D" },
    { id: "issues", label: "Go to Issues", icon: List, shortcut: "G I" },
    { id: "current-sprint", label: "Go to Current Sprint", icon: Play, shortcut: "G S" },
    { id: "sprints", label: "Go to Sprints", icon: FolderOpen, shortcut: "G P" },
    { id: "teams", label: "Go to Teams", icon: Users, shortcut: "G T" },
    { id: "reports", label: "Go to Reports", icon: BarChart3, shortcut: "G R" },
    { id: "activity", label: "Go to Activity", icon: Activity, shortcut: "G A" },
    { id: "ai-automation", label: "Go to AI Automation", icon: Sparkles, shortcut: "G AI" },
    { id: "settings", label: "Go to Settings", icon: Settings, shortcut: "G S" },
  ]

  const quickActions = [
    { id: "new-task", label: "New Task", icon: Plus, shortcut: "N" },
    { id: "new-sprint", label: "New Sprint", icon: FolderOpen, shortcut: "Shift N" },
  ]

  const quickFilters = [
    { 
      id: "my-issues", 
      label: "My Issues", 
      icon: List, 
      count: issues.filter(i => i.assignee === "Anna Kowalska").length 
    },
    { 
      id: "favorites", 
      label: "Favorite Issues", 
      icon: Star, 
      count: issues.filter(i => i.isFavorite).length 
    },
    { 
      id: "urgent", 
      label: "Urgent (P0/P1)", 
      icon: AlertTriangle, 
      count: issues.filter(i => i.priority === "P0" || i.priority === "P1").length 
    },
    { 
      id: "in-progress", 
      label: "In Progress", 
      icon: Clock, 
      count: issues.filter(i => i.status === "in_progress").length 
    },
  ]

  const recentIssues = issues.slice(0, 5)
  const activeSprints = sprints.filter(s => s.status === "active")

  const handleSelect = (callback: () => void) => {
    setOpen(false)
    callback()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-red-500 text-white"
      case "P1": return "bg-orange-500 text-white"
      case "P2": return "bg-blue-500 text-white"
      case "P3": return "bg-gray-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <Command className="rounded-lg border-0 shadow-md">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Wpisz komendę lub wyszukaj..." 
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ESC
                </kbd>
              </div>
            </div>
            
            <CommandList className="max-h-[400px] overflow-y-auto">
              <CommandEmpty>Nie znaleziono wyników.</CommandEmpty>
              
              {/* Suggestions */}
              <CommandGroup heading="Sugestie">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <CommandItem
                      key={action.id}
                      onSelect={() => handleSelect(() => {
                        if (action.id === "new-task") {
                          onNavigate("issues")
                          // TODO: Open new task modal
                        } else if (action.id === "new-sprint") {
                          onNavigate("sprints")
                          // TODO: Open new sprint modal
                        }
                      })}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{action.label}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          {action.shortcut}
                        </kbd>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              <CommandSeparator />

              {/* Navigation */}
              <CommandGroup heading="Nawigacja">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(() => onNavigate(item.id as ViewType))}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          {item.shortcut}
                        </kbd>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              <CommandSeparator />

              {/* Quick Filters */}
              <CommandGroup heading="Szybkie Filtry">
                {quickFilters.map((filter) => {
                  const Icon = filter.icon
                  return (
                    <CommandItem
                      key={filter.id}
                      onSelect={() => handleSelect(() => {
                        onNavigate("issues")
                        // TODO: Apply filter
                      })}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{filter.label}</span>
                      {filter.count > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {filter.count}
                        </Badge>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              <CommandSeparator />

              {/* Recent Issues */}
              <CommandGroup heading="Ostatnie Issues">
                {recentIssues.map((issue) => (
                  <CommandItem
                    key={issue.id}
                    onSelect={() => handleSelect(() => onOpenIssue(issue.id))}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs font-mono shrink-0">
                        {issue.key}
                      </Badge>
                      <span className="truncate">{issue.title}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* Active Sprints */}
              {activeSprints.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Aktywne Sprinty">
                    {activeSprints.map((sprint) => (
                      <CommandItem
                        key={sprint.id}
                        onSelect={() => handleSelect(() => onNavigate("current-sprint"))}
                        className="flex items-center gap-2 px-4 py-2"
                      >
                        <Play className="h-4 w-4" />
                        <span className="truncate">{sprint.name}</span>
                        <Badge className="ml-auto bg-green-100 text-green-800 text-xs">
                          Aktywny
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
        <div className="bg-muted/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border">
          <div className="flex items-center gap-2">
            <span>Command Palette</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>
    </>
  )
}
