"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { HelpCircle } from "lucide-react"

const shortcuts = [
  { keys: ["Ctrl", "K"], description: "Otwórz paletę komend" },
  { keys: ["N"], description: "Nowe zadanie" },
  { keys: ["G", "D"], description: "Przejdź do Dashboard" },
  { keys: ["G", "I"], description: "Przejdź do Issues" },
  { keys: ["G", "S"], description: "Przejdź do Sprintów" },
  { keys: ["G", "T"], description: "Przejdź do Zespołów" },
  { keys: ["Esc"], description: "Zamknij panel/modal" },
  { keys: ["/"], description: "Szukaj" },
  { keys: ["?"], description: "Pokaż skróty klawiszowe" },
]

export function KeyboardShortcutsHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Skróty klawiszowe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skróty klawiszowe</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <Kbd key={keyIndex}>{key}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
