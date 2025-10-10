"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Search, 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Users, 
  BarChart3,
  Activity,
  Sparkles,
  Settings,
  AlertCircle,
  Plus
} from "lucide-react";
import { useUI } from "@/lib/demo4/ui-context";
import { useData } from "@/lib/demo4/data-context";

interface CommandPaletteProps {
  onNewTask?: () => void;
}

export function CommandPalette({ onNewTask }: CommandPaletteProps) {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette, openIssueDetail } = useUI();
  const { issues } = useData();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          closeCommandPalette(); // This will toggle via the parent
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, closeCommandPalette]);

  const filteredIssues = issues
    .filter(issue => 
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.key.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  const urgentIssues = issues.filter(i => i.priority === "P0" && i.status !== "done").slice(0, 3);

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={closeCommandPalette}>
      <CommandInput 
        placeholder="Search or type a command..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {search === "" && (
          <>
            <CommandGroup heading="Suggestions">
              <CommandItem
                onSelect={() => {
                  router.push("/demo4");
                  closeCommandPalette();
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Go to Dashboard</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/issues");
                  closeCommandPalette();
                }}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                <span>View All Issues</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/sprints");
                  closeCommandPalette();
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Current Sprint</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={() => {
                  onNewTask?.();
                  closeCommandPalette();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>New Task</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">N</span>
                </kbd>
              </CommandItem>
            </CommandGroup>

            {urgentIssues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Urgent (P0)">
                  {urgentIssues.map((issue) => (
                    <CommandItem
                      key={issue.id}
                      onSelect={() => {
                        openIssueDetail(issue.id);
                        closeCommandPalette();
                      }}
                    >
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      <span className="flex-1">{issue.title}</span>
                      <span className="text-xs text-muted-foreground">{issue.key}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}

        {search !== "" && filteredIssues.length > 0 && (
          <CommandGroup heading="Issues">
            {filteredIssues.map((issue) => (
              <CommandItem
                key={issue.id}
                onSelect={() => {
                  openIssueDetail(issue.id);
                  closeCommandPalette();
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="flex-1">{issue.title}</span>
                <span className="text-xs text-muted-foreground font-mono">{issue.key}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {search === "" && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/teams");
                  closeCommandPalette();
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Teams</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/reports");
                  closeCommandPalette();
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Reports</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/activity");
                  closeCommandPalette();
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                <span>Activity</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/automations");
                  closeCommandPalette();
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Automations</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/demo4/settings");
                  closeCommandPalette();
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
