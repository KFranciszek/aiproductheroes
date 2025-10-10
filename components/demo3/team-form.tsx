"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/demo3/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/demo3/ui/dialog"
import { Input } from "@/components/demo3/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/demo3/ui/form"
import { useData } from "@/lib/demo3/data-context"
import type { Team, User } from "@/lib/demo3/types"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/demo3/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/demo3/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/demo3/utils"
import { Badge } from "@/components/demo3/ui/badge"

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  memberIds: z.array(z.string()).min(1, "At least one member is required"),
})

type TeamFormData = z.infer<typeof teamSchema>

interface TeamFormProps {
  team?: Team
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function TeamForm({ team, open, onOpenChange }: TeamFormProps) {
  const { users, createTeam, updateTeam } = useData() 
  
  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name || "",
      memberIds: team?.memberIds || [],
    },
  })
  
  const onSubmit = (data: TeamFormData) => {
    if (team) {
      updateTeam(team.id, data)
    } else {
      createTeam(data)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frontend Wizards" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Members</FormLabel>
                  <MultiSelect users={users} selected={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{team ? "Save Changes" : "Create Team"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// MultiSelect component for selecting team members
function MultiSelect({ users, selected, onChange }: { users: User[], selected: string[], onChange: (ids: string[]) => void }) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (userId: string) => {
    const newSelected = selected.includes(userId)
      ? selected.filter(id => id !== userId)
      : [...selected, userId]
    onChange(newSelected)
  }
  
  const selectedUsers = users.filter(user => selected.includes(user.id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
        >
          <div className="flex flex-wrap gap-1">
            {selectedUsers.length > 0 ? selectedUsers.map(user => (
              <Badge key={user.id} variant="secondary" className="gap-1.5">
                {user.name}
                <button
                  aria-label={`Remove ${user.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(user.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )) : "Select members..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[375px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => handleSelect(user.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(user.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
