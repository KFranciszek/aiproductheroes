"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, Database } from "lucide-react"

export function SettingsView() {
  const handleExport = () => {
    console.log("Exporting data...")
    // In a real app, this would export all demo data to JSON
  }

  const handleImport = () => {
    console.log("Importing data...")
    // In a real app, this would open a file picker and import JSON data
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ustawienia</h1>
        <p className="text-muted-foreground mt-1">Zarządzaj konfiguracją aplikacji</p>
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Zarządzanie Danymi</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Eksport i Import Danych
            </CardTitle>
            <CardDescription>Eksportuj dane demo do pliku JSON lub importuj wcześniej zapisane dane</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleExport} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Eksportuj Dane
              </Button>
              <Button onClick={handleImport} variant="outline" className="flex-1 bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Importuj Dane
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Eksport zawiera wszystkie zadania, sprinty, komentarze i ustawienia. Możesz użyć tego do tworzenia kopii
              zapasowych lub przenoszenia danych między sesjami.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Wygląd</h2>

        <Card>
          <CardHeader>
            <CardTitle>Motyw</CardTitle>
            <CardDescription>Wybierz preferowany motyw aplikacji</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Użyj przełącznika motywu w bocznym menu nawigacji, aby zmienić między trybem jasnym i ciemnym.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">O Aplikacji</h2>

        <Card>
          <CardHeader>
            <CardTitle>Syzio Project Management</CardTitle>
            <CardDescription>Wersja Demo 1.0.0</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Aplikacja demonstracyjna systemu zarządzania projektami z funkcjami Kanban, sprintów, raportów i
              automatyzacji AI.
            </p>
            <p>Zbudowana z Next.js, React, Tailwind CSS i shadcn/ui.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
