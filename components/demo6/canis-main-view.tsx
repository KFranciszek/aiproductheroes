"use client";

import { Bot, Search, Settings, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUI } from "@/lib/demo6/ui-context";
import { useTheme } from "@/components/demo6/theme-provider";
import { CanisChat } from "./canis-chat";
import { StoriesGenerator } from "./stories-generator";
import { TestDataGenerator } from "./test-data-generator";
import { VerifyView } from "./verify-view";
import { ReleaseQA } from "./release-qa";
import { SettingsView } from "./settings-view";

export function CanisMainView() {
  const { activeTab, setActiveTab, setCommandPaletteOpen } = useUI();
  const { theme, cycleTheme } = useTheme();

  const themeLabel = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Dark Blue";

  return (
    <div className="min-h-screen bg-background">
      {/* TopBar */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-3 md:px-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">Syzio — Canis</span>
            <Separator orientation="vertical" className="mx-2 h-6" />
            <Badge variant="outline">ACME / SHOP</Badge>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-64 hidden md:block">
              <Input 
                placeholder="Szukaj / ⌘K" 
                className="pl-8" 
                onFocus={() => setCommandPaletteOpen(true)}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cycleTheme}
              className="gap-2"
            >
              <Palette className="h-4 w-4"/>
              <span className="hidden md:inline text-xs">{themeLabel}</span>
            </Button>
            
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="mx-auto max-w-[1200px] p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="testdata">Test Data</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="release">Release Q&A</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <CanisChat />
          </TabsContent>

          <TabsContent value="stories" className="mt-6">
            <StoriesGenerator />
          </TabsContent>

          <TabsContent value="testdata" className="mt-6">
            <TestDataGenerator />
          </TabsContent>

          <TabsContent value="verify" className="mt-6">
            <VerifyView />
          </TabsContent>

          <TabsContent value="release" className="mt-6">
            <ReleaseQA />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
