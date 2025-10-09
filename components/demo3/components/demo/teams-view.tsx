"use client"

import { useState } from "react"
import { TeamCard } from "./team-card"
import { mockTeams } from "@/lib/mock-data"
import type { Team } from "@/lib/types"

export function TeamsView() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  if (selectedTeam) {
    return (
      <div className="p-8">
        <button onClick={() => setSelectedTeam(null)} className="text-sm text-primary hover:underline mb-4">
          ← Powrót do zespołów
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-8">{selectedTeam.name}</h1>
        <p className="text-muted-foreground">Szczegółowy widok zespołu w przygotowaniu...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Zespoły</h1>
        <p className="text-muted-foreground mt-1">Przegląd wszystkich zespołów i ich wydajności</p>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((team) => (
          <TeamCard key={team.id} team={team} onClick={() => setSelectedTeam(team)} />
        ))}
      </div>
    </div>
  )
}
