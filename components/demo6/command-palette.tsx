"use client";

import { useEffect } from "react";
import { Sparkles, CheckCircle2, Database, GitPullRequest } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUI } from "@/lib/demo6/ui-context";
import { toast } from "sonner";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveTab } = useUI();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setCommandPaletteOpen(false);
  };

  const handleAction = (action: string) => {
    toast.success(`Akcja: ${action}`, {
      description: "Funkcja zostanie wkrótce zaimplementowana",
    });
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Szukaj lub wpisz komendę..." />
      <CommandList>
        <CommandEmpty>Brak wyników.</CommandEmpty>
        <CommandGroup heading="Nawigacja">
          <CommandItem onSelect={() => handleNavigate("chat")}>Chat</CommandItem>
          <CommandItem onSelect={() => handleNavigate("stories")}>Stories</CommandItem>
          <CommandItem onSelect={() => handleNavigate("testdata")}>Test Data</CommandItem>
          <CommandItem onSelect={() => handleNavigate("verify")}>Verify</CommandItem>
          <CommandItem onSelect={() => handleNavigate("release")}>Release Q&A</CommandItem>
          <CommandItem onSelect={() => handleNavigate("settings")}>Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Akcje Canis">
          <CommandItem onSelect={() => handleAction("Generate Story")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Story
          </CommandItem>
          <CommandItem onSelect={() => handleAction("Verify Requirements")}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verify Requirements
          </CommandItem>
          <CommandItem onSelect={() => handleAction("Generate Test Data")}>
            <Database className="mr-2 h-4 w-4" />
            Generate Test Data
          </CommandItem>
          <CommandItem onSelect={() => handleAction("Ask About Release")}>
            <GitPullRequest className="mr-2 h-4 w-4" />
            Ask About Release
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
