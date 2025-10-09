"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Play, AlertCircle } from "lucide-react"
import type { AutomationRule } from "@/lib/types"

const automationRuleSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana").max(100),
  description: z.string().max(500).optional(),
  enabled: z.boolean().default(true),
  when: z.array(z.string()).min(1, "Dodaj przynajmniej jeden wyzwalacz"),
  if: z.array(
    z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string(),
    }),
  ),
  then: z
    .array(
      z.object({
        action: z.string(),
        params: z.record(z.string()),
      }),
    )
    .min(1, "Dodaj przynajmniej jedną akcję"),
})

type AutomationRuleFormValues = z.infer<typeof automationRuleSchema>

interface AutomationRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: AutomationRule
  onSubmit: (data: AutomationRuleFormValues) => void
}

const TRIGGER_EVENTS = [
  "Issue created",
  "Issue updated",
  "Issue status changed",
  "Issue assigned",
  "Comment added",
  "Sprint started",
  "Sprint ended",
]

const CONDITION_FIELDS = [
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "type", label: "Type" },
  { value: "assignee", label: "Assignee" },
  { value: "labels", label: "Labels" },
  { value: "storyPoints", label: "Story Points" },
]

const OPERATORS = [
  { value: "equals", label: "równa się" },
  { value: "not_equals", label: "nie równa się" },
  { value: "contains", label: "zawiera" },
  { value: "greater_than", label: "większe niż" },
  { value: "less_than", label: "mniejsze niż" },
]

const ACTIONS = [
  { value: "set_priority", label: "Ustaw priorytet", params: ["priority"] },
  { value: "set_status", label: "Zmień status", params: ["status"] },
  { value: "assign_to", label: "Przypisz do", params: ["userId"] },
  { value: "add_label", label: "Dodaj etykietę", params: ["label"] },
  { value: "send_notification", label: "Wyślij powiadomienie", params: ["message", "channel"] },
  { value: "add_comment", label: "Dodaj komentarz", params: ["comment"] },
]

export function AutomationRuleModal({ open, onOpenChange, rule, onSubmit }: AutomationRuleModalProps) {
  const [testResults, setTestResults] = useState<string | null>(null)

  const form = useForm<AutomationRuleFormValues>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      name: rule?.name || "",
      description: rule?.description || "",
      enabled: rule?.enabled ?? true,
      when: rule?.trigger?.event ? [rule.trigger.event] : [],
      if: rule?.trigger?.conditions || [],
      then: rule?.actions || [],
    },
  })

  const handleTestRule = () => {
    setTestResults("Testowanie reguły... Znaleziono 3 pasujące zadania: TASK-123, TASK-456, TASK-789")
  }

  const addCondition = () => {
    const currentConditions = form.getValues("if")
    form.setValue("if", [...currentConditions, { field: "", operator: "", value: "" }])
  }

  const removeCondition = (index: number) => {
    const currentConditions = form.getValues("if")
    form.setValue(
      "if",
      currentConditions.filter((_, i) => i !== index),
    )
  }

  const addAction = () => {
    const currentActions = form.getValues("then")
    form.setValue("then", [...currentActions, { action: "", params: {} }])
  }

  const removeAction = (index: number) => {
    const currentActions = form.getValues("then")
    form.setValue(
      "then",
      currentActions.filter((_, i) => i !== index),
    )
  }

  const handleSubmit = (data: AutomationRuleFormValues) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 max-h-[90vh]">
        <div className="px-6 py-4 border-b sticky top-0 bg-background z-10">
          <DialogHeader>
            <DialogTitle>{rule ? "Edytuj Regułę Automatyzacji" : "Utwórz Nową Regułę"}</DialogTitle>
            <DialogDescription>Zdefiniuj wyzwalacze, warunki i akcje dla automatyzacji workflow</DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-4 space-y-6">
              {/* Name and Description */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa reguły *</FormLabel>
                    <FormControl>
                      <Input placeholder="np. Auto-assign critical bugs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Opcjonalny opis działania reguły" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <Accordion type="multiple" defaultValue={["when", "if", "then"]} className="w-full">
                {/* WHEN - Triggers */}
                <AccordionItem value="when">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <span>Kiedy (When)</span>
                      <Badge variant="secondary">{form.watch("when").length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="when"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wybierz zdarzenie wyzwalające *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value])
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz zdarzenie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TRIGGER_EVENTS.map((event) => (
                                <SelectItem key={event} value={event}>
                                  {event}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((trigger) => (
                                <Badge key={trigger} variant="outline" className="gap-1">
                                  {trigger}
                                  <button
                                    type="button"
                                    onClick={() => field.onChange(field.value.filter((t) => t !== trigger))}
                                    className="hover:text-destructive"
                                  >
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
                  </AccordionContent>
                </AccordionItem>

                {/* IF - Conditions */}
                <AccordionItem value="if">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <span>Jeśli (If)</span>
                      <Badge variant="secondary">{form.watch("if").length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Dodaj warunki, które muszą być spełnione (opcjonalne)
                    </p>
                    {form.watch("if").map((condition, index) => (
                      <div key={index} className="p-4 rounded-lg border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Warunek {index + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            value={condition.field}
                            onValueChange={(value) => {
                              const conditions = form.getValues("if")
                              conditions[index].field = value
                              form.setValue("if", conditions)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pole" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_FIELDS.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => {
                              const conditions = form.getValues("if")
                              conditions[index].operator = value
                              form.setValue("if", conditions)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATORS.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Wartość"
                            value={condition.value}
                            onChange={(e) => {
                              const conditions = form.getValues("if")
                              conditions[index].value = e.target.value
                              form.setValue("if", conditions)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addCondition} className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj warunek
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* THEN - Actions */}
                <AccordionItem value="then">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <span>Wtedy (Then)</span>
                      <Badge variant="secondary">{form.watch("then").length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {form.watch("then").map((action, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-primary/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Akcja {index + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAction(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Select
                          value={action.action}
                          onValueChange={(value) => {
                            const actions = form.getValues("then")
                            actions[index].action = value
                            form.setValue("then", actions)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz akcję" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTIONS.map((act) => (
                              <SelectItem key={act.value} value={act.value}>
                                {act.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {action.action && (
                          <Input
                            placeholder="Parametry akcji (np. critical, userId, message)"
                            onChange={(e) => {
                              const actions = form.getValues("then")
                              actions[index].params = { value: e.target.value }
                              form.setValue("then", actions)
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addAction} className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj akcję
                    </Button>
                    <FormMessage />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Test Rule */}
              <div className="space-y-3">
                <Button type="button" variant="outline" onClick={handleTestRule} className="w-full bg-transparent">
                  <Play className="h-4 w-4 mr-2" />
                  Testuj regułę (dry-run)
                </Button>
                {testResults && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{testResults}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </ScrollArea>

        <div className="px-6 py-3 border-t sticky bottom-0 bg-background/95 backdrop-blur flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            {rule ? "Zapisz zmiany" : "Utwórz regułę"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
