"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SprintCard } from "./sprint-card"
import { mockSprints, mockIssues } from "@/lib/mock-data"

export function SprintsView() {
  const [sprints] = useState(mockSprints)

  const activeSprints = sprints.filter((s) => s.status === "active")
  const plannedSprints = sprints.filter((s) => s.status === "planned")
  const completedSprints = sprints.filter((s) => s.status === "completed")

  const backlogIssues = mockIssues.filter((i) => !i.sprint)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sprinty</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj sprintami i planuj pracę</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Utwórz Sprint
        </Button>
      </div>

      {/* Active Sprint */}
      {activeSprints.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Aktywny Sprint</h2>
          <div className="grid gap-4">
            {activeSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onEndSprint={() => console.log("End sprint", sprint.id)}
                onEdit={() => console.log("Edit sprint", sprint.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Planned Sprints */}
      {plannedSprints.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Planowane</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {plannedSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onStartSprint={() => console.log("Start sprint", sprint.id)}
                onEdit={() => console.log("Edit sprint", sprint.id)}
                onDelete={() => console.log("Delete sprint", sprint.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Backlog */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Backlog
          <span className="ml-2 text-base font-normal text-muted-foreground">({backlogIssues.length} zadań)</span>
        </h2>
        <div className="p-6 rounded-lg border border-dashed border-border bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            Przeciągnij zadania z backlogu do planowanych sprintów, aby je zaplanować
          </p>
        </div>
      </div>

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Zakończone</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedSprints.map((sprint) => (
              <SprintCard key={sprint.id} sprint={sprint} onViewReport={() => console.log("View report", sprint.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
