"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Save
} from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { useUI } from "@/lib/demo4/ui-context";
import { useTheme } from "./theme-provider";
import { toast } from "sonner";

export function SettingsView() {
  const { exportData, importData, resetData } = useData();
  const { density, setDensity } = useUI();
  const { theme, toggleTheme } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `syzio-demo4-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importData(data);
        toast.success("Data imported successfully");
      } catch (error) {
        toast.error("Failed to import data");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetData();
      toast.success("Data reset successfully");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your preferences and data
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="general" className="max-w-4xl">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>
                  Configure your general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autosave">Auto-save</Label>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <Switch
                    id="autosave"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="confirm-delete">Confirm before deleting</Label>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Show confirmation dialog before deleting items
                    </p>
                  </div>
                  <Switch
                    id="confirm-delete"
                    checked={confirmDelete}
                    onCheckedChange={setConfirmDelete}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Choose your preferred color scheme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => theme === "dark" && toggleTheme()}
                    className="flex-1"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => theme === "light" && toggleTheme()}
                    className="flex-1"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Density</CardTitle>
                <CardDescription>
                  Adjust the spacing and size of UI elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={density} onValueChange={(v: any) => setDensity(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="compact" />
                    <Label htmlFor="compact" className="flex-1 cursor-pointer">
                      <div className="font-medium">Compact</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        More content in less space
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="comfortable" />
                    <Label htmlFor="comfortable" className="flex-1 cursor-pointer">
                      <div className="font-medium">Comfortable</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Balanced spacing (recommended)
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spacious" id="spacious" />
                    <Label htmlFor="spacious" className="flex-1 cursor-pointer">
                      <div className="font-medium">Spacious</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        More breathing room
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download all your demo data as a JSON file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExport} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>
                  Restore data from a previously exported file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("import-file")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Note: This will replace all current data
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--error-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--error-text)]">Reset Data</CardTitle>
                <CardDescription>
                  Reset all data to default demo values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Statistics</CardTitle>
                <CardDescription>
                  Overview of your demo data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[var(--text-secondary)]">Last Export</div>
                    <div className="font-medium text-[var(--text-primary)]">Never</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-secondary)]">Data Size</div>
                    <div className="font-medium text-[var(--text-primary)]">
                      {(new Blob([exportData()]).size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
