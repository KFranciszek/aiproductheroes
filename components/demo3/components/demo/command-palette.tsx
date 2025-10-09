"use client"

import { useEffect, useState, useCallback } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
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
  Search,
  Filter,
} from "lucide-react"
import { mockIssues } from "@/lib/mock-data"
import type { Issue } from "@/lib/types"

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

interface CommandPaletteProps {
  onNavigate: (view: View) => void
  onIssueSelect: (issue: Issue) => void
}

export function CommandPalette({ onNavigate, onIssueSelect }: CommandPaletteProps) {
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

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false)
    callback()
  }, [])

  const navigationItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "issues" as View, label: "Issues", icon: ListTodo },
    { id: "current-sprint" as View, label: "Current Sprint", icon: Target },
    { id: "sprints" as View, label: "Sprints", icon: Calendar },
    { id: "teams" as View, label: "Teams", icon: Users },
    { id: "reports" as View, label: "Reports", icon: BarChart3 },
    { id: "activity" as View, label: "Activity", icon: Activity },
    { id: "automation" as View, label: "AI Automation", icon: Sparkles },
    { id: "settings" as View, label: "Settings", icon: Settings },
  ]

  const quickFilters = [
    { label: "My Tasks", action: () => onNavigate("issues") },
    { label: "Urgent Tasks", action: () => onNavigate("issues") },
    { label: "Blocked Tasks", action: () => onNavigate("issues") },
    { label: "In Review", action: () => onNavigate("issues") },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => handleSelect(() => onNavigate("dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("current-sprint"))}>
            <Target className="mr-2 h-4 w-4" />
            <span>View Current Sprint</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem key={item.id} onSelect={() => handleSelect(() => onNavigate(item.id))}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Filters">
          {quickFilters.map((filter) => (
            <CommandItem key={filter.label} onSelect={() => handleSelect(filter.action)}>
              <Filter className="mr-2 h-4 w-4" />
              <span>{filter.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Tasks">
          {mockIssues.slice(0, 5).map((issue) => (
            <CommandItem key={issue.id} onSelect={() => handleSelect(() => onIssueSelect(issue))}>
              <Search className="mr-2 h-4 w-4" />
              <span>
                {issue.id}: {issue.title}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
