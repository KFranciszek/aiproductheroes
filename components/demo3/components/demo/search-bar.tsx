"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IssueStatus, Priority, IssueType } from "@/lib/types"

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  status: IssueStatus[]
  priority: Priority[]
  type: IssueType[]
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    type: [],
  })

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleFilterToggle = (category: keyof FilterState, value: string) => {
    const newFilters = { ...filters }
    const currentValues = newFilters[category] as string[]

    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter((v) => v !== value) as any
    } else {
      newFilters[category] = [...currentValues, value] as any
    }

    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { status: [], priority: [], type: [] }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const activeFilterCount = filters.status.length + filters.priority.length + filters.type.length

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj zadań..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtry
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.status.includes("todo")}
              onCheckedChange={() => handleFilterToggle("status", "todo")}
            >
              Todo
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.includes("in-progress")}
              onCheckedChange={() => handleFilterToggle("status", "in-progress")}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.includes("in-review")}
              onCheckedChange={() => handleFilterToggle("status", "in-review")}
            >
              In Review
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.includes("done")}
              onCheckedChange={() => handleFilterToggle("status", "done")}
            >
              Done
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.includes("blocked")}
              onCheckedChange={() => handleFilterToggle("status", "blocked")}
            >
              Blocked
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priorytet</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.priority.includes("P0")}
              onCheckedChange={() => handleFilterToggle("priority", "P0")}
            >
              P0 - Krytyczny
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.priority.includes("P1")}
              onCheckedChange={() => handleFilterToggle("priority", "P1")}
            >
              P1 - Wysoki
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.priority.includes("P2")}
              onCheckedChange={() => handleFilterToggle("priority", "P2")}
            >
              P2 - Średni
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.priority.includes("P3")}
              onCheckedChange={() => handleFilterToggle("priority", "P3")}
            >
              P3 - Niski
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Typ</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.type.includes("feature")}
              onCheckedChange={() => handleFilterToggle("type", "feature")}
            >
              Feature
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type.includes("bug")}
              onCheckedChange={() => handleFilterToggle("type", "bug")}
            >
              Bug
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type.includes("improvement")}
              onCheckedChange={() => handleFilterToggle("type", "improvement")}
            >
              Improvement
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.type.includes("task")}
              onCheckedChange={() => handleFilterToggle("type", "task")}
            >
              Task
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Aktywne filtry:</span>
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {status}
              <button onClick={() => handleFilterToggle("status", status)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {priority}
              <button onClick={() => handleFilterToggle("priority", priority)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.type.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <button onClick={() => handleFilterToggle("type", type)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
            Wyczyść wszystkie
          </Button>
        </div>
      )}
    </div>
  )
}
