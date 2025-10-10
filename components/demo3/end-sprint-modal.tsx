"use client"

import * as React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/demo3/ui/alert-dialog"
import { Button } from "@/components/demo3/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/demo3/ui/radio-group"
import { Label } from "@/components/demo3/ui/label"
import { useData } from "@/lib/demo3/data-context"
import type { Sprint, Issue } from "@/lib/demo3/types"

interface EndSprintModalProps {
  sprint: Sprint | null
  onOpenChange: (open: boolean) => void
}

export function EndSprintModal({ sprint, onOpenChange }: EndSprintModalProps) {
  const { issues, endSprint } = useData()
  const [moveIncompleteTo, setMoveIncompleteTo] = React.useState<"backlog" | "new_sprint">("backlog")

  if (!sprint) return null
  
  const incompleteIssues = issues.filter(i => i.sprintId === sprint.id && i.status !== "done")

  const handleComplete = () => {
    endSprint(sprint.id, moveIncompleteTo)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!sprint} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Sprint: {sprint.name}</AlertDialogTitle>
          <AlertDialogDescription>
            This sprint has {incompleteIssues.length} incomplete issue(s). What would you like to do with them?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <RadioGroup defaultValue="backlog" onValueChange={(value: "backlog" | "new_sprint") => setMoveIncompleteTo(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="backlog" id="backlog" />
            <Label htmlFor="backlog">Move to backlog</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new_sprint" id="new_sprint" disabled />
            <Label htmlFor="new_sprint">Move to a new sprint (coming soon)</Label>
          </div>
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete}>Complete Sprint</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
