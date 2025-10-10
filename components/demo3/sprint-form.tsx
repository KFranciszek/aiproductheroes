"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/demo3/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/demo3/ui/dialog"
import { Input } from "@/components/demo3/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/demo3/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/demo3/ui/popover"
import { Calendar } from "@/components/demo3/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/demo3/utils"
import { format } from "date-fns"
import { useData } from "@/lib/demo3/data-context"
import type { Sprint } from "@/lib/demo3/types"
import { DateRange } from "react-day-picker"

const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  goal: z.string().optional(),
  dates: z.object({
    from: z.date({ required_error: "Start date is required." }),
    to: z.date({ required_error: "End date is required." }),
  }),
})

type SprintFormData = z.infer<typeof sprintSchema>

interface SprintFormProps {
  sprint?: Sprint
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function SprintForm({ sprint, open, onOpenChange }: SprintFormProps) {
  const { createSprint, updateSprint } = useData()
  
  const form = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: sprint?.name || "",
      goal: sprint?.goal || "",
      dates: {
        from: sprint?.startDate ? new Date(sprint.startDate) : new Date(),
        to: sprint?.endDate ? new Date(sprint.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    },
  })

  const onSubmit = (data: SprintFormData) => {
    const sprintPayload = {
      name: data.name,
      goal: data.goal,
      startDate: data.dates.from.toISOString(),
      endDate: data.dates.to.toISOString(),
    }
    if (sprint) {
      updateSprint(sprint.id, sprintPayload)
    } else {
      createSprint(sprintPayload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{sprint ? "Edit Sprint" : "Create New Sprint"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sprint Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Phoenix Project - Week 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sprint Goal (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Implement user authentication" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sprint Dates</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{sprint ? "Save Changes" : "Create Sprint"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
