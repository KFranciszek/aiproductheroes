"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CalendarIcon, 
  X, 
  Plus,
  Save,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Issue, Sprint, Priority, IssueStatus } from "@/types/demo2"

interface IssueFormProps {
  issue?: Issue
  sprints: Sprint[]
  onSave: (issue: Partial<Issue>) => void
  onCancel: () => void
}

export function IssueForm({ issue, sprints, onSave, onCancel }: IssueFormProps) {
  const [formData, setFormData] = useState({
    title: issue?.title || "",
    description: issue?.description || "",
    priority: issue?.priority || "P2" as Priority,
    status: issue?.status || "todo" as IssueStatus,
    assignee: issue?.assignee || "",
    sprintId: issue?.sprintId || "",
    storyPoints: issue?.storyPoints?.toString() || "",
    labels: issue?.labels || [],
    dueAt: issue?.dueAt ? new Date(issue.dueAt) : undefined,
  })

  const [newLabel, setNewLabel] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: "P0", label: "Krytyczny (P0)", color: "bg-red-500" },
    { value: "P1", label: "Wysoki (P1)", color: "bg-orange-500" },
    { value: "P2", label: "Średni (P2)", color: "bg-blue-500" },
    { value: "P3", label: "Niski (P3)", color: "bg-gray-500" },
  ]

  const statuses: { value: IssueStatus; label: string }[] = [
    { value: "todo", label: "Do zrobienia" },
    { value: "in_progress", label: "W trakcie" },
    { value: "in_review", label: "W recenzji" },
    { value: "blocked", label: "Zablokowane" },
    { value: "done", label: "Ukończone" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Tytuł jest wymagany"
    }

    if (formData.storyPoints && (isNaN(Number(formData.storyPoints)) || Number(formData.storyPoints) < 0)) {
      newErrors.storyPoints = "Story Points musi być liczbą dodatnią"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const issueData: Partial<Issue> = {
      ...formData,
      storyPoints: formData.storyPoints ? Number(formData.storyPoints) : undefined,
      dueAt: formData.dueAt?.toISOString(),
    }

    onSave(issueData)
  }

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }))
      setNewLabel("")
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {issue ? "Edytuj zadanie" : "Nowe zadanie"}
          {issue && (
            <Badge variant="outline" className="font-mono text-xs">
              {issue.key}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Tytuł *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={cn(errors.title && "border-destructive")}
                placeholder="Wprowadź tytuł zadania..."
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Opis
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Opisz zadanie..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priorytet</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", priority.color)} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value: IssueStatus) => 
                setFormData(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignment and Sprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium">
                Przypisany
              </Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Nazwa użytkownika..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Sprint</Label>
              <Select value={formData.sprintId} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, sprintId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz sprint..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Brak sprintu</SelectItem>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          sprint.status === "active" ? "bg-green-500" :
                          sprint.status === "planned" ? "bg-blue-500" : "bg-gray-500"
                        )} />
                        {sprint.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Story Points and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storyPoints" className="text-sm font-medium">
                Story Points
              </Label>
              <Input
                id="storyPoints"
                type="number"
                min="0"
                value={formData.storyPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, storyPoints: e.target.value }))}
                className={cn(errors.storyPoints && "border-destructive")}
                placeholder="0"
              />
              {errors.storyPoints && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.storyPoints}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Termin</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueAt ? (
                      format(formData.dueAt, "PPP", { locale: pl })
                    ) : (
                      "Wybierz datę..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueAt}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, dueAt: date }))
                      setIsCalendarOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Labels */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Etykiety</Label>
            <div className="space-y-3">
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.labels.map((label, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Dodaj etykietę..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLabel()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addLabel}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Save className="h-4 w-4 mr-2" />
              {issue ? "Zapisz zmiany" : "Utwórz zadanie"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
