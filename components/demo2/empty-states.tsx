"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  BarChart3, 
  Activity, 
  Bot,
  Plus,
  Search,
  Filter,
  Sparkles,
  Target,
  Zap
} from "lucide-react"

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  icon: Icon = ClipboardList, 
  title, 
  description, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {action && (
              <Button onClick={action.onClick}>
                <Plus className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NoIssuesEmpty({ onCreateIssue }: { onCreateIssue: () => void }) {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Brak zadań"
      description="Nie znaleziono żadnych zadań. Utwórz swoje pierwsze zadanie, aby rozpocząć pracę."
      action={{
        label: "Utwórz zadanie",
        onClick: onCreateIssue
      }}
    />
  )
}

export function NoSprintsEmpty({ onCreateSprint }: { onCreateSprint: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="Brak sprintów"
      description="Nie masz jeszcze żadnych sprintów. Utwórz pierwszy sprint, aby rozpocząć planowanie."
      action={{
        label: "Utwórz sprint",
        onClick: onCreateSprint
      }}
    />
  )
}

export function NoTeamsEmpty({ onCreateTeam }: { onCreateTeam: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Brak zespołów"
      description="Nie masz jeszcze żadnych zespołów. Utwórz pierwszy zespół, aby rozpocząć współpracę."
      action={{
        label: "Utwórz zespół",
        onClick: onCreateTeam
      }}
    />
  )
}

export function NoActivityEmpty() {
  return (
    <EmptyState
      icon={Activity}
      title="Brak aktywności"
      description="Nie ma jeszcze żadnej aktywności w projekcie. Aktywność pojawi się gdy zaczniesz pracować z zadaniami."
    />
  )
}

export function NoReportsEmpty() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Brak danych do raportów"
      description="Potrzebujesz więcej danych, aby wygenerować raporty. Utwórz zadania i sprinty, aby zobaczyć analizy."
    />
  )
}

export function NoAutomationRulesEmpty({ onCreateRule }: { onCreateRule: () => void }) {
  return (
    <EmptyState
      icon={Bot}
      title="Brak reguł automatyzacji"
      description="Nie masz jeszcze żadnych reguł automatyzacji. Utwórz pierwszą regułę, aby zautomatyzować swój workflow."
      action={{
        label: "Utwórz regułę",
        onClick: onCreateRule
      }}
    />
  )
}

export function SearchEmpty({ searchTerm, onClearSearch }: { searchTerm: string, onClearSearch: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Brak wyników"
      description={`Nie znaleziono wyników dla "${searchTerm}". Spróbuj zmienić kryteria wyszukiwania.`}
      action={{
        label: "Wyczyść wyszukiwanie",
        onClick: onClearSearch
      }}
    />
  )
}

export function FilterEmpty({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      icon={Filter}
      title="Brak wyników"
      description="Nie znaleziono elementów spełniających wybrane filtry. Spróbuj zmienić kryteria filtrowania."
      action={{
        label: "Wyczyść filtry",
        onClick: onClearFilters
      }}
    />
  )
}

export function NoActiveSprintEmpty({ onStartSprint }: { onStartSprint: () => void }) {
  return (
    <EmptyState
      icon={Target}
      title="Brak aktywnego sprintu"
      description="Aby korzystać z widoku kanban, musisz mieć aktywny sprint. Rozpocznij sprint z listy planowanych."
      action={{
        label: "Zobacz sprinty",
        onClick: onStartSprint
      }}
    />
  )
}

export function NoSprintIssuesEmpty({ onAddIssues }: { onAddIssues: () => void }) {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Sprint jest pusty"
      description="Ten sprint nie zawiera żadnych zadań. Dodaj zadania, aby rozpocząć pracę."
      action={{
        label: "Dodaj zadania",
        onClick: onAddIssues
      }}
    />
  )
}

export function AIInsightsEmpty() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Brak insights"
      description="AI analizuje Twoje dane. Insights pojawią się gdy będzie więcej aktywności w projekcie."
    />
  )
}

export function ErrorState({ 
  title = "Wystąpił błąd", 
  description = "Nie udało się załadować danych. Spróbuj ponownie.", 
  onRetry 
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <Zap className="h-6 w-6 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
          
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Spróbuj ponownie
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
