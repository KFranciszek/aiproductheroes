"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
  Star,
  Calendar,
  BarChart3,
  Activity,
  Settings,
  Search,
  Plus,
  Zap,
} from "lucide-react"
import type { Issue, Sprint, ViewType } from "@/types"

interface CommandPaletteProps {
  issues: Issue[]
  sprints: Sprint[]
  onNavigate: (view: ViewType) => void
  onOpenIssue: (issueId: string) => void
  onCreateIssue: () => void
}

export function CommandPalette({
  issues,
  sprints,
  onNavigate,
  onOpenIssue,
  onCreateIssue,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (callback: () => void) => {
    setOpen(false)
    callback()
  }

  // Filter issues based on search
  const filteredIssues = React.useMemo(() => {
    if (!search) return issues.slice(0, 5)
    
    const lowerSearch = search.toLowerCase()
    return issues
      .filter(
        (issue) =>
          issue.id.toLowerCase().includes(lowerSearch) ||
          issue.title.toLowerCase().includes(lowerSearch) ||
          issue.description?.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 5)
  }, [issues, search])

  // Quick filters
  const myIssues = issues.filter((issue) => issue.assignee === "current-user").length
  const urgentIssues = issues.filter((issue) => issue.priority === "P0" || issue.priority === "P1").length
  const blockedIssues = issues.filter((issue) => issue.status === "Todo" && issue.parentId).length

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Wpisz komendę lub szukaj..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Nie znaleziono wyników.</CommandEmpty>

        <CommandGroup heading="💡 Sugestie">
          <CommandItem onSelect={() => handleSelect(onCreateIssue)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Utwórz nowe zadanie</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="📍 Nawigacja">
          <CommandItem onSelect={() => handleSelect(() => onNavigate("current-sprint"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("issues"))}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Wszystkie zadania</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("favorites"))}>
            <Star className="mr-2 h-4 w-4" />
            <span>Ulubione</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("sprints"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Sprinty</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("reports"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Raporty</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("activity"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Aktywność</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ustawienia</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="🎯 Szybkie filtry">
          <CommandItem onSelect={() => handleSelect(() => onNavigate("issues"))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Moje zadania ({myIssues})</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("issues"))}>
            <Zap className="mr-2 h-4 w-4 text-red-500" />
            <span>Pilne (P0/P1) ({urgentIssues})</span>
          </CommandItem>
          {blockedIssues > 0 && (
            <CommandItem onSelect={() => handleSelect(() => onNavigate("issues"))}>
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Zablokowane ({blockedIssues})</span>
            </CommandItem>
          )}
        </CommandGroup>

        {filteredIssues.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="📋 Zadania">
              {filteredIssues.map((issue) => (
                <CommandItem
                  key={issue.id}
                  onSelect={() => handleSelect(() => onOpenIssue(issue.id))}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>
                    {issue.id} - {issue.title}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {issue.priority}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {sprints.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="🏃 Sprinty">
              {sprints.slice(0, 3).map((sprint) => (
                <CommandItem
                  key={sprint.id}
                  onSelect={() => handleSelect(() => onNavigate("sprints"))}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{sprint.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {sprint.status}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

