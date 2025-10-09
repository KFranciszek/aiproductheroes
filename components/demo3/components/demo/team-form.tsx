"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Crown } from "lucide-react"
import { useState } from "react"
import type { Team } from "@/lib/types"

const teamFormSchema = z.object({
  name: z.string().min(2, "Nazwa zespołu musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
  teamLeadId: z.string().optional(),
  color: z.string().default("#3b82f6"),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
      }),
    )
    .min(1, "Zespół musi mieć co najmniej jednego członka"),
})

type TeamFormValues = z.infer<typeof teamFormSchema>

interface TeamFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
  onSubmit: (data: TeamFormValues) => void
}

const teamColors = [
  { name: "Niebieski", value: "#3b82f6" },
  { name: "Zielony", value: "#10b981" },
  { name: "Fioletowy", value: "#8b5cf6" },
  { name: "Różowy", value: "#ec4899" },
  { name: "Pomarańczowy", value: "#f97316" },
  { name: "Czerwony", value: "#ef4444" },
  { name: "Żółty", value: "#eab308" },
  { name: "Turkusowy", value: "#06b6d4" },
]

export function TeamForm({ open, onOpenChange, team, onSubmit }: TeamFormProps) {
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("")

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: team?.name || "",
      description: team?.description || "",
      teamLeadId: team?.teamLeadId || "",
      color: team?.color || "#3b82f6",
      members: team?.members || [],
    },
  })

  const handleSubmit = (data: TeamFormValues) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  const addMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const currentMembers = form.getValues("members")
      form.setValue("members", [...currentMembers, { name: newMemberName, role: newMemberRole }])
      setNewMemberName("")
      setNewMemberRole("")
    }
  }

  const removeMember = (index: number) => {
    const currentMembers = form.getValues("members")
    form.setValue(
      "members",
      currentMembers.filter((_, i) => i !== index),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? "Edytuj Zespół" : "Utwórz Nowy Zespół"}</DialogTitle>
          <DialogDescription>
            {team ? "Zaktualizuj informacje o zespole i zarządzaj członkami" : "Dodaj nowy zespół do projektu"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Team Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa Zespołu</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Frontend Team" {...field} />
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
                      placeholder="Krótki opis zespołu i jego odpowiedzialności..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Opcjonalny opis zespołu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kolor Zespołu</FormLabel>
                  <FormDescription>Wybierz kolor identyfikacyjny zespołu</FormDescription>
                  <div className="flex gap-2 mt-2">
                    {teamColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => field.onChange(color.value)}
                        className={`h-10 w-10 rounded-full border-2 transition-all ${
                          field.value === color.value ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Members */}
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Członkowie Zespołu</FormLabel>
                  <FormDescription>Dodaj członków zespołu i przypisz im role</FormDescription>

                  {/* Add Member Input */}
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Imię i nazwisko"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addMember()
                        }
                      }}
                    />
                    <Input
                      placeholder="Rola"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addMember()
                        }
                      }}
                    />
                    <Button type="button" onClick={addMember} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Members List */}
                  <div className="mt-4 space-y-2">
                    {form.watch("members").map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.watch("members").length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Brak członków zespołu. Dodaj pierwszego członka powyżej.
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("members").length > 0 && (
              <FormField
                control={form.control}
                name="teamLeadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lider Zespołu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz lidera zespołu (opcjonalnie)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Brak lidera</SelectItem>
                        {form.watch("members").map((member, index) => (
                          <SelectItem key={index} value={member.name}>
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-yellow-500" />
                              {member.name} - {member.role}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Osoba odpowiedzialna za koordynację zespołu</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit">{team ? "Zaktualizuj Zespół" : "Utwórz Zespół"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
