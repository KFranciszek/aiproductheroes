'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { DataManager } from './data-manager'
import { ThemeSelector } from './theme-selector'
import { 
  Settings, 
  Palette, 
  Bell, 
  Database, 
  Keyboard, 
  Zap,
  Moon,
  Sun,
  Monitor 
} from 'lucide-react'

interface SettingsViewProps {
  onExport: () => void
  onImport: (data: any) => void
}

export function SettingsView({ onExport, onImport }: SettingsViewProps) {
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    commentAdded: true,
    priorityChanged: false,
    sprintEnding: true,
  })

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    // TODO: Zapisz w localStorage
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">⚙️ Ustawienia</h1>
        <p className="text-muted-foreground mt-1">
          Zarządzaj preferencjami i konfiguracją aplikacji
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Ogólne
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Wygląd
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Powiadomienia
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Dane
          </TabsTrigger>
          <TabsTrigger value="shortcuts">
            <Keyboard className="h-4 w-4 mr-2" />
            Skróty
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia ogólne</CardTitle>
              <CardDescription>
                Podstawowa konfiguracja aplikacji
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Domyślny widok startowy</Label>
                <RadioGroup defaultValue="dashboard">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dashboard" id="start-dashboard" />
                    <Label htmlFor="start-dashboard">Dashboard (Twój Dzień)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current-sprint" id="start-sprint" />
                    <Label htmlFor="start-sprint">Current Sprint</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="issues" id="start-issues" />
                    <Label htmlFor="start-issues">Lista zadań</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autosave</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatyczne zapisywanie zmian
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Konfirmacja przy usuwaniu</Label>
                  <p className="text-sm text-muted-foreground">
                    Pytaj przed usunięciem zadań
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Motyw</CardTitle>
              <CardDescription>
                Wybierz styl interfejsu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tryb wyświetlania</Label>
                <RadioGroup value={theme} onValueChange={(v: any) => setTheme(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Jasny
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Ciemny
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Kolor akcentu</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-12 h-12 p-0 bg-[#84a98c] hover:bg-[#84a98c]/80"
                    title="Szałwiowy (domyślny)"
                  />
                  <Button 
                    variant="outline" 
                    className="w-12 h-12 p-0 bg-blue-500 hover:bg-blue-600"
                    title="Niebieski"
                  />
                  <Button 
                    variant="outline" 
                    className="w-12 h-12 p-0 bg-purple-500 hover:bg-purple-600"
                    title="Fioletowy"
                  />
                  <Button 
                    variant="outline" 
                    className="w-12 h-12 p-0 bg-orange-500 hover:bg-orange-600"
                    title="Pomarańczowy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gęstość interfejsu</CardTitle>
              <CardDescription>
                Domyślna gęstość widoku zadań
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={density} onValueChange={(v: any) => setDensity(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="density-compact" />
                  <Label htmlFor="density-compact">
                    Compact - Więcej zadań na ekran
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="density-comfortable" />
                  <Label htmlFor="density-comfortable">
                    Comfortable - Zbalansowany (domyślny)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spacious" id="density-spacious" />
                  <Label htmlFor="density-spacious">
                    Spacious - Maksymalna czytelność
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Powiadomienia</CardTitle>
              <CardDescription>
                Wybierz, kiedy chcesz otrzymywać powiadomienia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Przypisano Ci zadanie</Label>
                  <p className="text-sm text-muted-foreground">
                    Powiadomienie gdy ktoś przypisze Ci nowe zadanie
                  </p>
                </div>
                <Switch 
                  checked={notifications.taskAssigned}
                  onCheckedChange={(v) => handleNotificationChange('taskAssigned', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Komentarz w Twoim zadaniu</Label>
                  <p className="text-sm text-muted-foreground">
                    Powiadomienie o nowych komentarzach
                  </p>
                </div>
                <Switch 
                  checked={notifications.commentAdded}
                  onCheckedChange={(v) => handleNotificationChange('commentAdded', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Zmiana priorytetu na P0/P1</Label>
                  <p className="text-sm text-muted-foreground">
                    Powiadomienie gdy zadanie staje się pilne
                  </p>
                </div>
                <Switch 
                  checked={notifications.priorityChanged}
                  onCheckedChange={(v) => handleNotificationChange('priorityChanged', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sprint kończy się za 2 dni</Label>
                  <p className="text-sm text-muted-foreground">
                    Przypomnienie o zbliżającym się końcu sprintu
                  </p>
                </div>
                <Switch 
                  checked={notifications.sprintEnding}
                  onCheckedChange={(v) => handleNotificationChange('sprintEnding', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zarządzanie danymi</CardTitle>
              <CardDescription>
                Eksport, import i backup danych
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataManager onExport={onExport} onImport={onImport} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
              <CardDescription>
                Informacje o Twoich danych
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rozmiar danych:</span>
                <span className="text-sm font-medium">~2.5 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ostatni backup:</span>
                <span className="text-sm font-medium">Dzisiaj, 09:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Auto-backup:</span>
                <Badge variant="secondary">Włączony</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shortcuts Tab */}
        <TabsContent value="shortcuts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skróty klawiaturowe</CardTitle>
              <CardDescription>
                Przyspiesz pracę używając klawiatury
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Otwórz Command Palette</p>
                    <p className="text-sm text-muted-foreground">Globalne wyszukiwanie</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Cmd+K
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Nowe zadanie</p>
                    <p className="text-sm text-muted-foreground">Utwórz nowe zadanie</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Ctrl+N
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Przejdź do sprintów</p>
                    <p className="text-sm text-muted-foreground">Otwórz widok sprintów</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Ctrl+S
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-sm text-muted-foreground">Twój Dzień</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Alt+1
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Raporty</p>
                    <p className="text-sm text-muted-foreground">Otwórz raporty</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Ctrl+R
                  </Badge>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Keyboard className="h-4 w-4 mr-2" />
                  Dostosuj skróty
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Zap className="inline h-5 w-5 mr-2" />
                Wskazówki
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Użyj <Badge variant="outline" className="mx-1 font-mono">Cmd+K</Badge> aby szybko znaleźć dowolne zadanie</p>
              <p>• Naciśnij <Badge variant="outline" className="mx-1 font-mono">?</Badge> aby zobaczyć wszystkie skróty</p>
              <p>• Kliknij zadanie aby otworzyć Split View</p>
              <p>• Użyj przełącznika gęstości aby dopasować widok do swoich potrzeb</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

