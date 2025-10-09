"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, Database, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DataManager() {
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  const handleExport = () => {
    try {
      // In a real app, this would gather all data from state/database
      const demoData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        issues: [], // Would be populated from actual data
        sprints: [],
        teams: [],
        automationRules: [],
        settings: {},
      }

      const dataStr = JSON.stringify(demoData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `syzio-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportStatus("success")
      setTimeout(() => setExportStatus("idle"), 3000)
    } catch (error) {
      console.error("Export error:", error)
      setExportStatus("error")
      setTimeout(() => setExportStatus("idle"), 3000)
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error("Invalid backup file format")
        }

        // In a real app, this would update state/database with imported data
        console.log("Imported data:", data)

        setImportStatus("success")
        setTimeout(() => setImportStatus("idle"), 3000)
      } catch (error) {
        console.error("Import error:", error)
        setImportStatus("error")
        setTimeout(() => setImportStatus("idle"), 3000)
      }
    }

    input.click()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Eksport i Import Danych
          </CardTitle>
          <CardDescription>Eksportuj dane demo do pliku JSON lub importuj wcześniej zapisane dane</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Messages */}
          {exportStatus === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Eksport zakończony sukcesem</AlertTitle>
              <AlertDescription>Plik został pobrany na Twoje urządzenie</AlertDescription>
            </Alert>
          )}
          {exportStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Błąd eksportu</AlertTitle>
              <AlertDescription>Nie udało się wyeksportować danych. Spróbuj ponownie.</AlertDescription>
            </Alert>
          )}
          {importStatus === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Import zakończony sukcesem</AlertTitle>
              <AlertDescription>Dane zostały pomyślnie zaimportowane</AlertDescription>
            </Alert>
          )}
          {importStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Błąd importu</AlertTitle>
              <AlertDescription>Nieprawidłowy format pliku lub uszkodzone dane</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
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

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="text-sm font-medium mb-2">Co jest eksportowane?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Wszystkie zadania (issues) z pełnymi szczegółami</li>
              <li>• Sprinty i ich konfiguracja</li>
              <li>• Zespoły i członkowie</li>
              <li>• Reguły automatyzacji AI</li>
              <li>• Ustawienia aplikacji</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Eksport zawiera wszystkie dane w formacie JSON. Możesz użyć tego do tworzenia kopii zapasowych lub
            przenoszenia danych między sesjami. Plik jest czytelny dla człowieka i może być edytowany ręcznie.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
