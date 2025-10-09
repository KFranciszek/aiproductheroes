"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CalendarIcon, 
  Save,
  AlertTriangle,
  Flag
} from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Sprint } from "@/types/demo2"
import { toast } from "sonner"

interface SprintFormProps {
  sprint?: Sprint
  sprints: Sprint[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (sprint: Partial<Sprint>) => void
}

export function SprintForm({ sprint, sprints, open, onOpenChange, onSave }: SprintFormProps) {
  const [formData, setFormData] = useState({
    name: sprint?.name || "",
    goal: sprint?.goal || "",
    startDate: sprint ? new Date(sprint.startDate) : undefined,
    endDate: sprint ? new Date(sprint.endDate) : undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nazwa sprintu jest wymagana"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data rozpoczęcia jest wymagana"
    }

    if (!formData.endDate) {
      newErrors.endDate = "Data zakończenia jest wymagana"
    }

    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = "Data zakończenia musi być późniejsza niż data rozpoczęcia"
    }

    // Check for overlapping sprints
    if (formData.startDate && formData.endDate) {
      const overlappingSprint = sprints.find(existingSprint => {
        if (sprint && existingSprint.id === sprint.id) return false // Skip current sprint when editing
        
        const existingStart = new Date(existingSprint.startDate)
        const existingEnd = new Date(existingSprint.endDate)
        
        return (
          (formData.startDate! >= existingStart && formData.startDate! <= existingEnd) ||
          (formData.endDate! >= existingStart && formData.endDate! <= existingEnd) ||
          (formData.startDate! <= existingStart && formData.endDate! >= existingEnd)
        )
      })

      if (overlappingSprint) {
        newErrors.dateRange = `Sprint nakłada się z "${overlappingSprint.name}"`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const sprintData: Partial<Sprint> = {
      ...formData,
      startDate: formData.startDate!.toISOString(),
      endDate: formData.endDate!.toISOString(),
      status: sprint?.status || "planned",
      issueIds: sprint?.issueIds || [],
    }

    onSave(sprintData)
    onOpenChange(false)
    
    toast.success(sprint ? "Sprint zaktualizowany" : "Sprint utworzony", {
      description: formData.name
    })

    // Reset form
    if (!sprint) {
      setFormData({
        name: "",
        goal: "",
        startDate: undefined,
        endDate: undefined,
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    if (!sprint) {
      setFormData({
        name: "",
        goal: "",
        startDate: undefined,
        endDate: undefined,
      })
    }
    setErrors({})
  }

  const getDuration = () => {
    if (formData.startDate && formData.endDate) {
      const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${diffDays} dni`
    }
    return ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            {sprint ? "Edytuj sprint" : "Nowy sprint"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sprint Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nazwa sprintu *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={cn(errors.name && "border-destructive")}
              placeholder="np. Sprint 1: User Authentication"
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data rozpoczęcia *</Label>
              <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: pl })
                    ) : (
                      "Wybierz datę..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, startDate: date }))
                      setIsStartCalendarOpen(false)
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data zakończenia *</Label>
              <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP", { locale: pl })
                    ) : (
                      "Wybierz datę..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, endDate: date }))
                      setIsEndCalendarOpen(false)
                    }}
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      (formData.startDate && date <= formData.startDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {getDuration() && (
            <div className="text-sm text-muted-foreground">
              <strong>Czas trwania:</strong> {getDuration()}
            </div>
          )}

          {/* Date Range Error */}
          {errors.dateRange && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.dateRange}</AlertDescription>
            </Alert>
          )}

          {/* Sprint Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-medium">
              Cel sprintu
            </Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="Opisz główny cel tego sprintu..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Opcjonalne: Krótki opis tego, co chcesz osiągnąć w tym sprincie
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Save className="h-4 w-4 mr-2" />
              {sprint ? "Zapisz zmiany" : "Utwórz sprint"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
