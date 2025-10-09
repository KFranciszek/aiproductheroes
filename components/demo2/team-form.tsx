"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Save,
  AlertTriangle,
  Users,
  ChevronDown,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Team, User } from "@/types/demo2"
import { toast } from "sonner"

interface TeamFormProps {
  team?: Team
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (team: Partial<Team>) => void
}

export function TeamForm({ team, users, open, onOpenChange, onSave }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: team?.name || "",
    description: "",
    leadId: "",
    memberIds: team?.memberIds || [],
    color: team?.color || "#3B82F6",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLeadPopoverOpen, setIsLeadPopoverOpen] = useState(false)

  const availableUsers = users.filter(user => user.role !== "viewer")
  const selectedMembers = users.filter(user => formData.memberIds.includes(user.id))
  const teamLead = users.find(user => user.id === formData.leadId)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nazwa zespołu jest wymagana"
    }

    if (formData.memberIds.length === 0) {
      newErrors.members = "Zespół musi mieć przynajmniej jednego członka"
    }

    if (formData.leadId && !formData.memberIds.includes(formData.leadId)) {
      newErrors.lead = "Team Lead musi być członkiem zespołu"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const teamData: Partial<Team> = {
      ...formData,
      velocityHistory: team?.velocityHistory || [],
    }

    onSave(teamData)
    onOpenChange(false)
    
    toast.success(team ? "Zespół zaktualizowany" : "Zespół utworzony", {
      description: formData.name
    })

    // Reset form
    if (!team) {
      setFormData({
        name: "",
        description: "",
        leadId: "",
        memberIds: [],
        color: "#3B82F6",
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    if (!team) {
      setFormData({
        name: "",
        description: "",
        leadId: "",
        memberIds: [],
        color: "#3B82F6",
      })
    }
    setErrors({})
  }

  const handleMemberToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter(id => id !== userId)
        : [...prev.memberIds, userId]
    }))
  }

  const handleLeadSelect = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      leadId: userId,
      // Automatically add lead to members if not already included
      memberIds: prev.memberIds.includes(userId) 
        ? prev.memberIds 
        : [...prev.memberIds, userId]
    }))
    setIsLeadPopoverOpen(false)
  }

  const removeMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.filter(id => id !== userId),
      // Remove as lead if they were the lead
      leadId: prev.leadId === userId ? "" : prev.leadId
    }))
  }

  const colorOptions = [
    { value: "#3B82F6", label: "Blue" },
    { value: "#10B981", label: "Green" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Red" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#84CC16", label: "Lime" },
    { value: "#F97316", label: "Orange" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team ? "Edytuj zespół" : "Nowy zespół"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nazwa zespołu *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={cn(errors.name && "border-destructive")}
              placeholder="np. Frontend Team"
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Team Lead */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Team Lead</Label>
            <Popover open={isLeadPopoverOpen} onOpenChange={setIsLeadPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !teamLead && "text-muted-foreground",
                    errors.lead && "border-destructive"
                  )}
                >
                  {teamLead ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {teamLead.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {teamLead.name}
                    </div>
                  ) : (
                    "Wybierz team leada..."
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Szukaj użytkownika..." />
                  <CommandList>
                    <CommandEmpty>Nie znaleziono użytkownika.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setFormData(prev => ({ ...prev, leadId: "" }))
                          setIsLeadPopoverOpen(false)
                        }}
                      >
                        Brak team leada
                      </CommandItem>
                      {availableUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleLeadSelect(user.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            {user.name}
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              formData.leadId === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.lead && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.lead}
              </p>
            )}
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Członkowie zespołu *</Label>
            
            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedMembers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 bg-background rounded-full px-3 py-1 border">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    {formData.leadId === user.id && (
                      <Badge variant="secondary" className="text-xs">Lead</Badge>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeMember(user.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Users */}
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={formData.memberIds.includes(user.id)}
                      onCheckedChange={() => handleMemberToggle(user.id)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {errors.members && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.members}
              </p>
            )}
          </div>

          {/* Team Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kolor zespołu</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    formData.color === color.value 
                      ? "border-foreground scale-110" 
                      : "border-muted hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Opis zespołu
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Krótki opis zespołu i jego odpowiedzialności..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Save className="h-4 w-4 mr-2" />
              {team ? "Zapisz zmiany" : "Utwórz zespół"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
