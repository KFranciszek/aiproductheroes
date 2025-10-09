"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Database, 
  Keyboard, 
  Download, 
  Upload,
  Sun,
  Moon,
  Monitor
} from "lucide-react"
import { useTheme } from "next-themes"

export function SettingsView() {
  const { theme, setTheme } = useTheme()

  const handleExportData = () => {
    const exportData = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      userId: 'demo-user',
      data: {
        // Mock export data
        issues: [],
        sprints: [],
        activities: [],
        settings: {}
      }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `syzio-demo2-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const keyboardShortcuts = [
    { key: "Ctrl + K", description: "Otwórz Command Palette" },
    { key: "G D", description: "Przejdź do Dashboard" },
    { key: "G I", description: "Przejdź do Issues" },
    { key: "G S", description: "Przejdź do Current Sprint" },
    { key: "G P", description: "Przejdź do Sprints" },
    { key: "G T", description: "Przejdź do Teams" },
    { key: "G R", description: "Przejdź do Reports" },
    { key: "G A", description: "Przejdź do Activity" },
    { key: "N", description: "Nowe zadanie" },
    { key: "?", description: "Pokaż skróty klawiszowe" },
    { key: "ESC", description: "Zamknij panel/modal" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Zarządzaj preferencjami i ustawieniami aplikacji
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="appearance">Wygląd</TabsTrigger>
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="data">Dane</TabsTrigger>
          <TabsTrigger value="shortcuts">Skróty</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil użytkownika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Imię i nazwisko</label>
                  <p className="text-sm text-muted-foreground mt-1">Anna Kowalska</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground mt-1">anna@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rola</label>
                  <Badge className="mt-1">Admin</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Strefa czasowa</label>
                  <p className="text-sm text-muted-foreground mt-1">Europe/Warsaw (GMT+1)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Domyślny widok startowy</label>
                  <p className="text-sm text-muted-foreground">Widok wyświetlany po zalogowaniu</p>
                </div>
                <Badge variant="outline">Dashboard</Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Automatyczne zapisywanie</label>
                  <p className="text-sm text-muted-foreground">Zapisuj zmiany automatycznie co 2 sekundy</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Potwierdzenia usuwania</label>
                  <p className="text-sm text-muted-foreground">Pytaj przed usunięciem elementów</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Motyw
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    theme === "light" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4" />
                    <span className="font-medium">Jasny</span>
                  </div>
                  <div className="w-full h-16 bg-white border rounded flex items-center justify-center text-xs">
                    Podgląd jasnego motywu
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4" />
                    <span className="font-medium">Ciemny</span>
                  </div>
                  <div className="w-full h-16 bg-gray-900 border rounded flex items-center justify-center text-xs text-white">
                    Podgląd ciemnego motywu
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    theme === "system" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-4 h-4" />
                    <span className="font-medium">System</span>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 border rounded flex items-center justify-center text-xs">
                    Auto
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gęstość interfejsu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Gęstość wyświetlania</label>
                  <p className="text-sm text-muted-foreground">Wpływa na odstępy między elementami</p>
                </div>
                <Badge variant="outline">Comfortable</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Powiadomienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Wszystkie powiadomienia</label>
                  <p className="text-sm text-muted-foreground">Główny przełącznik powiadomień</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Nowe zadania</label>
                    <p className="text-sm text-muted-foreground">Powiadom gdy zostanę przypisany do zadania</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Zmiany statusu</label>
                    <p className="text-sm text-muted-foreground">Powiadom o zmianach w moich zadaniach</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Komentarze</label>
                    <p className="text-sm text-muted-foreground">Powiadom o nowych komentarzach</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Wzmianki (@mentions)</label>
                    <p className="text-sm text-muted-foreground">Powiadom gdy ktoś mnie wspomni</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Zarządzanie danymi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Eksport danych</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pobierz wszystkie dane demo w formacie JSON
                  </p>
                  <Button onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Eksportuj dane
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Import danych</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Przywróć dane z wcześniejszego eksportu
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importuj dane
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Reset danych demo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Przywróć domyślne dane demonstracyjne
                  </p>
                  <Button variant="destructive">
                    Resetuj do domyślnych
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Skróty klawiszowe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
