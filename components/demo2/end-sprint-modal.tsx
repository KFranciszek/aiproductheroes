"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  FileText
} from "lucide-react"
import type { Sprint, Issue } from "@/types/demo2"

interface EndSprintModalProps {
  sprint: Sprint
  issues: Issue[]
  sprints: Sprint[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEndSprint: (sprintId: string, options: EndSprintOptions) => void
}

interface EndSprintOptions {
  moveIncompleteToBacklog: boolean
  moveIncompleteToSprint?: string
  selectedIssues: string[]
  retrospectiveNotes?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo": return "bg-gray-100 text-gray-800 border-gray-200"
    case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
    case "in_review": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "blocked": return "bg-red-100 text-red-800 border-red-200"
    case "done": return "bg-green-100 text-green-800 border-green-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
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

export function EndSprintModal({
  sprint,
  issues,
  sprints,
  open,
  onOpenChange,
  onEndSprint
}: EndSprintModalProps) {
  const [moveIncompleteToBacklog, setMoveIncompleteToBacklog] = useState(true)
  const [moveIncompleteToSprint, setMoveIncompleteToSprint] = useState<string>("")
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [retrospectiveNotes, setRetrospectiveNotes] = useState("")

  const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
  const completedIssues = sprintIssues.filter(issue => issue.status === "done")
  const incompleteIssues = sprintIssues.filter(issue => issue.status !== "done")
  
  const completionRate = sprintIssues.length > 0 ? 
    Math.round((completedIssues.length / sprintIssues.length) * 100) : 0

  const totalStoryPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  const incompleteStoryPoints = incompleteIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)

  // Available sprints for moving incomplete issues (planned sprints only)
  const availableSprints = sprints.filter(s => 
    s.status === "planned" && s.id !== sprint.id
  )

  const handleEndSprint = () => {
    const options: EndSprintOptions = {
      moveIncompleteToBacklog,
      moveIncompleteToSprint: moveIncompleteToBacklog ? undefined : moveIncompleteToSprint,
      selectedIssues: moveIncompleteToBacklog ? incompleteIssues.map(i => i.id) : selectedIssues,
      retrospectiveNotes
    }
    
    onEndSprint(sprint.id, options)
    onOpenChange(false)
  }

  const handleIssueSelection = (issueId: string, checked: boolean) => {
    setSelectedIssues(prev => 
      checked 
        ? [...prev, issueId]
        : prev.filter(id => id !== issueId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIssues(checked ? incompleteIssues.map(i => i.id) : [])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Zakończ Sprint: {sprint.name}
          </DialogTitle>
          <DialogDescription>
            Przejrzyj wyniki sprintu i zdecyduj co zrobić z nieukończonymi zadaniami
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Sprint Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Podsumowanie Sprintu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{completedIssues.length}</div>
                    <div className="text-sm text-muted-foreground">Ukończone zadania</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{incompleteIssues.length}</div>
                    <div className="text-sm text-muted-foreground">Nieukończone zadania</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Współczynnik ukończenia</div>
                  </div>
                </div>

                <Progress value={completionRate} className="w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span>Story Points ukończone:</span>
                      <span className="font-medium">{completedStoryPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Story Points nieukończone:</span>
                      <span className="font-medium">{incompleteStoryPoints}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Całkowite Story Points:</span>
                      <span>{totalStoryPoints}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Data rozpoczęcia:</span>
                      <span>{new Date(sprint.startDate).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data zakończenia:</span>
                      <span>{new Date(sprint.endDate).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Czas trwania:</span>
                      <span>
                        {Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))} dni
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Issues */}
            {completedIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Ukończone Zadania ({completedIssues.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <Badge variant="outline" className="font-mono text-xs">
                          {issue.key}
                        </Badge>
                        <span className="flex-1 text-sm">{issue.title}</span>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        {issue.storyPoints && (
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} SP
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Incomplete Issues */}
            {incompleteIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Nieukończone Zadania ({incompleteIssues.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Move Options */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Co zrobić z nieukończonymi zadaniami?</Label>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="move-to-backlog"
                          checked={moveIncompleteToBacklog}
                          onCheckedChange={(checked) => {
                            setMoveIncompleteToBacklog(checked as boolean)
                            if (checked) {
                              setMoveIncompleteToSprint("")
                              setSelectedIssues(incompleteIssues.map(i => i.id))
                            }
                          }}
                        />
                        <Label htmlFor="move-to-backlog" className="text-sm">
                          Przenieś wszystkie do backlogu
                        </Label>
                      </div>
                      
                      {availableSprints.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="move-to-sprint"
                            checked={!moveIncompleteToBacklog}
                            onCheckedChange={(checked) => {
                              setMoveIncompleteToBacklog(!(checked as boolean))
                              if (checked) {
                                setSelectedIssues([])
                              }
                            }}
                          />
                          <Label htmlFor="move-to-sprint" className="text-sm">
                            Przenieś wybrane do innego sprintu
                          </Label>
                        </div>
                      )}
                    </div>

                    {!moveIncompleteToBacklog && availableSprints.length > 0 && (
                      <div className="ml-6 space-y-3">
                        <Select value={moveIncompleteToSprint} onValueChange={setMoveIncompleteToSprint}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz sprint docelowy..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSprints.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Wybierz zadania do przeniesienia:</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAll(selectedIssues.length !== incompleteIssues.length)}
                            >
                              {selectedIssues.length === incompleteIssues.length ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Issues List */}
                  <div className="space-y-2">
                    {incompleteIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        {!moveIncompleteToBacklog && (
                          <Checkbox
                            checked={selectedIssues.includes(issue.id)}
                            onCheckedChange={(checked) => handleIssueSelection(issue.id, checked as boolean)}
                          />
                        )}
                        <Badge variant="outline" className="font-mono text-xs">
                          {issue.key}
                        </Badge>
                        <span className="flex-1 text-sm">{issue.title}</span>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        {issue.storyPoints && (
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} SP
                          </Badge>
                        )}
                        {issue.status === "blocked" && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Retrospective Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notatki Retrospektywne (opcjonalne)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Dodaj notatki z retrospektywy sprintu - co poszło dobrze, co można poprawić..."
                  value={retrospectiveNotes}
                  onChange={(e) => setRetrospectiveNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {!moveIncompleteToBacklog && incompleteIssues.length > 0 && (
                <span>
                  {selectedIssues.length} z {incompleteIssues.length} zadań zostanie przeniesionych
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button 
                onClick={handleEndSprint}
                disabled={!moveIncompleteToBacklog && incompleteIssues.length > 0 && (!moveIncompleteToSprint || selectedIssues.length === 0)}
              >
                <Target className="h-4 w-4 mr-2" />
                Zakończ Sprint
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
