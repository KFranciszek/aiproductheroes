"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Button } from "@/components/demo3/ui/button"
import { Label } from "@/components/demo3/ui/label"
import { Switch } from "@/components/demo3/ui/switch"
import { Separator } from "@/components/demo3/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/demo3/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/demo3/ui/select"
import { Download, Upload, RefreshCw } from "lucide-react"
import { useUI } from "@/lib/demo3/ui-context"

export function SettingsView() {
  const { theme, setTheme, density, setDensity } = useUI()

  const handleExportData = () => {
    // Demo functionality
    console.log("Export data")
  }

  const handleImportData = () => {
    // Demo functionality
    console.log("Import data")
  }

  const handleResetDemo = () => {
    // Demo functionality
    console.log("Reset demo")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and demo data</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your workspace preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirm before delete</Label>
                  <p className="text-sm text-muted-foreground">Show confirmation dialog when deleting items</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default view</Label>
                <Select defaultValue="dashboard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                    <SelectItem value="sprints">Sprints</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Syzio looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(value: "light" | "dark") => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Density</Label>
                <Select
                  value={density}
                  onValueChange={(value: "compact" | "comfortable" | "spacious") => setDensity(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Adjust spacing and sizing of UI elements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or reset your demo data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">Download all your demo data as JSON</p>
                <Button onClick={handleExportData} variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Import Data</Label>
                <p className="text-sm text-muted-foreground">Restore data from a previous export</p>
                <Button onClick={handleImportData} variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Reset Demo</Label>
                <p className="text-sm text-muted-foreground">Reset all data to default demo state</p>
                <Button onClick={handleResetDemo} variant="destructive" className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
