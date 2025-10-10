"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/demo3/ui/command"
import {
  LayoutDashboard,
  ListTodo,
  Zap,
  Users,
  BarChart3,
  Activity,
  Sparkles,
  Settings,
  AlertCircle,
} from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/issues?filter=urgent"))}>
            <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
            <span>Show urgent tasks (P0)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/issues?filter=my"))}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>My issues</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G D</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/issues"))}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Issues</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G I</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/sprints"))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Sprints</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G S</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/teams"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Teams</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G T</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/reports"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Reports</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G R</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/activity"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Activity</span>
            <kbd className="ml-auto text-xs text-muted-foreground">G A</kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/automations"))}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Automations</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/demo3/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
