"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Play, Pause, Clock } from "lucide-react"

interface TimeEntry {
  id: string
  description: string
  duration: number
  date: Date
}

interface TimeTrackerProps {
  entries: TimeEntry[]
  onAddEntry: (description: string, duration: number) => void
}

export function TimeTracker({ entries, onAddEntry }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [description, setDescription] = useState("")
  const [manualHours, setManualHours] = useState("")
  const [manualDescription, setManualDescription] = useState("")

  const handleStartStop = () => {
    if (isTracking && startTime) {
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60)
      onAddEntry(description, duration)
      setIsTracking(false)
      setStartTime(null)
      setDescription("")
    } else {
      setIsTracking(true)
      setStartTime(new Date())
    }
  }

  const handleManualEntry = () => {
    const hours = Number.parseFloat(manualHours)
    if (hours > 0 && manualDescription) {
      onAddEntry(manualDescription, hours * 60)
      setManualHours("")
      setManualDescription("")
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0)

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold">Śledzenie czasu</span>
          </div>
          <div className="text-2xl font-bold text-primary">{formatDuration(totalTime)}</div>
        </div>

        <div className="space-y-3">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Co robisz?"
            disabled={!isTracking}
          />
          <Button onClick={handleStartStop} className="w-full" variant={isTracking ? "destructive" : "default"}>
            {isTracking ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Zatrzymaj
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Dodaj czas ręcznie</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Opis</Label>
            <Input
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="Opis pracy"
            />
          </div>
          <div className="space-y-2">
            <Label>Godziny</Label>
            <Input
              type="number"
              step="0.25"
              min="0"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
              placeholder="0.0"
            />
          </div>
          <Button onClick={handleManualEntry} className="w-full bg-transparent" variant="outline">
            Dodaj wpis
          </Button>
        </div>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Historia</h3>
          {entries.map((entry) => (
            <Card key={entry.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.date.toLocaleDateString("pl-PL")}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{formatDuration(entry.duration)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
