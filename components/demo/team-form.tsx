"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { Team, User } from "@/types"

interface TeamFormProps {
  team?: Team
  users: User[]
  onSubmit: (teamData: Partial<Team>) => void
  trigger?: React.ReactNode
}

export function TeamForm({ team, users, onSubmit, trigger }: TeamFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: team?.name || "",
    description: team?.description || "",
    memberIds: team?.memberIds || [],
    isActive: team?.isActive ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required"
    }
    if (formData.memberIds.length === 0) {
      newErrors.members = "At least one team member is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)

    setOpen(false)
    if (!team) {
      // Reset form for new teams
      setFormData({
        name: "",
        description: "",
        memberIds: [],
        isActive: true,
      })
    }
  }

  const toggleMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter(id => id !== userId)
        : [...prev.memberIds, userId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Create Team</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter team name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter team description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={formData.memberIds.includes(user.id)}
                    onCheckedChange={() => toggleMember(user.id)}
                  />
                  <Label
                    htmlFor={`user-${user.id}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {user.name} ({user.email})
                  </Label>
                </div>
              ))}
            </div>
            {errors.members && <p className="text-sm text-red-500">{errors.members}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
            />
            <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
              Active team
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{team ? "Update Team" : "Create Team"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
