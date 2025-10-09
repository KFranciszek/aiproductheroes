"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Check, ChevronsUpDown, X, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import type { Issue } from "@/lib/types"
import { mockSprints } from "@/lib/mock-data"

const issueFormSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany").max(200, "Tytuł może mieć maksymalnie 200 znaków"),
  description: z.string().optional(),
  type: z.enum(["task", "bug", "feature", "story"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["todo", "in-progress", "in-review", "done", "blocked"]),
  assigneeId: z.string().min(1, "Przypisanie jest wymagane"),
  sprintId: z.string().optional(),
  dueAt: z.date().optional(),
  storyPoints: z.number().int().min(0).max(100).optional(),
  labels: z.array(z.string()).default([]),
})

type IssueFormValues = z.infer<typeof issueFormSchema>

interface IssueFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue?: Issue
  onSubmit: (data: IssueFormValues) => void
}

export function IssueForm({ open, onOpenChange, issue, onSubmit }: IssueFormProps) {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      type: issue?.type || "task",
      priority: issue?.priority || "medium",
      status: issue?.status || "todo",
      assigneeId: issue?.assigneeId || "defaultAssigneeId", // Updated default value to be a non-empty string
      sprintId: issue?.sprintId || "",
      storyPoints: issue?.storyPoints,
      labels: issue?.labels || [],
    },
  })

  const handleSubmit = (data: IssueFormValues) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  const addLabel = (label: string) => {
    const currentLabels = form.getValues("labels")
    if (!currentLabels.includes(label)) {
      form.setValue("labels", [...currentLabels, label])
    }
  }

  const removeLabel = (label: string) => {
    const currentLabels = form.getValues("labels")
    form.setValue(
      "labels",
      currentLabels.filter((l) => l !== label),
    )
  }

  const availableLabels = ["frontend", "backend", "design", "urgent", "tech-debt", "documentation"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 max-h-[90vh]">
        <div className="px-6 py-4 border-b sticky top-0 bg-background z-10">
          <DialogHeader>
            <DialogTitle>{issue ? "Edytuj Zadanie" : "Utwórz Nowe Zadanie"}</DialogTitle>
            <DialogDescription>
              {issue ? `Edytuj szczegóły zadania ${issue.key}` : "Wypełnij formularz, aby utworzyć nowe zadanie"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-4 space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł *</FormLabel>
                    <FormControl>
                      <Input placeholder="Krótki, opisowy tytuł zadania" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Szczegółowy opis zadania, kryteria akceptacji, notatki..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Możesz użyć Markdown do formatowania</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type and Priority */}
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-6 md:col-span-3">
                      <FormLabel>Typ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="col-span-6 md:col-span-3">
                      <FormLabel>Priorytet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-6 md:col-span-3">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storyPoints"
                  render={({ field }) => (
                    <FormItem className="col-span-6 md:col-span-3">
                      <FormLabel>Story Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sprint */}
              <FormField
                control={form.control}
                name="sprintId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprint</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === "none" ? "" : value)
                      }}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz sprint (opcjonalnie)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Brak (Backlog)</SelectItem>
                        {mockSprints.map((sprint) => (
                          <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Termin</FormLabel>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Labels */}
              <FormField
                control={form.control}
                name="labels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etykiety</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="justify-start bg-transparent">
                            <ChevronsUpDown className="mr-2 h-4 w-4" />
                            Dodaj etykiety
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Szukaj etykiety..." />
                          <CommandList>
                            <CommandEmpty>Nie znaleziono etykiety.</CommandEmpty>
                            <CommandGroup>
                              {availableLabels.map((label) => (
                                <CommandItem key={label} value={label} onSelect={() => addLabel(label)}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(label) ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((label) => (
                          <Badge key={label} variant="secondary" className="gap-1">
                            {label}
                            <button type="button" onClick={() => removeLabel(label)} className="hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <div className="px-6 py-3 border-t sticky bottom-0 bg-background/95 backdrop-blur flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            {issue ? "Zapisz zmiany" : "Utwórz zadanie"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
