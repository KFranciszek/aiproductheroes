"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { format, isAfter, isBefore, differenceInDays } from "date-fns"
import { pl } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Sprint } from "@/lib/types"
import { mockSprints } from "@/lib/mock-data"

const sprintFormSchema = z
  .object({
    name: z.string().min(1, "Nazwa sprintu jest wymagana").max(100, "Nazwa może mieć maksymalnie 100 znaków"),
    goal: z.string().max(500, "Cel może mieć maksymalnie 500 znaków").optional(),
    startDate: z.date({ required_error: "Data rozpoczęcia jest wymagana" }),
    endDate: z.date({ required_error: "Data zakończenia jest wymagana" }),
  })
  .refine((data) => isAfter(data.endDate, data.startDate), {
    message: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
    path: ["endDate"],
  })

type SprintFormValues = z.infer<typeof sprintFormSchema>

interface SprintFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprint?: Sprint
  onSubmit: (data: SprintFormValues) => void
}

export function SprintForm({ open, onOpenChange, sprint, onSubmit }: SprintFormProps) {
  const form = useForm<SprintFormValues>({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: {
      name: sprint?.name || "",
      goal: sprint?.goal || "",
      startDate: sprint?.startDate ? new Date(sprint.startDate) : undefined,
      endDate: sprint?.endDate ? new Date(sprint.endDate) : undefined,
    },
  })

  const startDate = form.watch("startDate")
  const endDate = form.watch("endDate")

  const checkOverlap = (start: Date, end: Date) => {
    return mockSprints
      .filter((s) => s.id !== sprint?.id && s.status !== "completed")
      .some((s) => {
        const sStart = new Date(s.startDate)
        const sEnd = new Date(s.endDate)
        return (
          (isAfter(start, sStart) && isBefore(start, sEnd)) ||
          (isAfter(end, sStart) && isBefore(end, sEnd)) ||
          (isBefore(start, sStart) && isAfter(end, sEnd))
        )
      })
  }

  const hasOverlap = startDate && endDate && checkOverlap(startDate, endDate)
  const sprintDuration = startDate && endDate ? differenceInDays(endDate, startDate) : 0

  const handleSubmit = (data: SprintFormValues) => {
    if (hasOverlap) {
      form.setError("startDate", {
        message: "Ten sprint nakłada się z istniejącym sprintem",
      })
      return
    }
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sprint ? "Edytuj Sprint" : "Utwórz Nowy Sprint"}</DialogTitle>
          <DialogDescription>
            {sprint ? `Edytuj szczegóły sprintu ${sprint.name}` : "Wypełnij formularz, aby utworzyć nowy sprint"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa sprintu *</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Sprint 24, Q1 Sprint 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goal */}
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cel sprintu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Główny cel tego sprintu, np. 'Ukończenie modułu uwierzytelniania'"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Opcjonalny opis celu sprintu dla zespołu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data rozpoczęcia *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: pl }) : "Wybierz datę"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data zakończenia *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: pl }) : "Wybierz datę"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || (startDate ? date <= startDate : false)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {sprintDuration > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Długość sprintu: <strong>{sprintDuration} dni</strong>
                  {sprintDuration < 7 && " (krótki sprint)"}
                  {sprintDuration > 21 && " (długi sprint, zalecane 1-3 tygodnie)"}
                </AlertDescription>
              </Alert>
            )}

            {hasOverlap && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Uwaga: Ten sprint nakłada się z istniejącym sprintem. Wybierz inne daty.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={hasOverlap}>
                {sprint ? "Zapisz zmiany" : "Utwórz sprint"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
