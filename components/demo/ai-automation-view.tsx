"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Zap, Brain, ScrollText, Package } from "lucide-react"
import { AutomationDashboard } from "./automation-dashboard"
import { AutomationRulesView } from "./automation-rules-view"
import { AutomationInsightsView } from "./automation-insights-view"
import { AutomationLogsView } from "./automation-logs-view"
import { AutomationTemplatesView } from "./automation-templates-view"
import type { 
  AutomationRule, 
  AutomationExecution, 
  AutomationTemplate, 
  AIInsight, 
  AutomationMetrics 
} from "@/types"

interface AIAutomationViewProps {
  rules: AutomationRule[]
  executions: AutomationExecution[]
  templates: AutomationTemplate[]
  insights: AIInsight[]
  metrics: AutomationMetrics
}

export function AIAutomationView({
  rules,
  executions,
  templates,
  insights,
  metrics
}: AIAutomationViewProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  const activeRulesCount = rules.filter(r => r.status === 'active').length
  const activeInsightsCount = insights.filter(i => !i.dismissed && i.severity === 'high').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🤖 AI & Automation
          </h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj automatyzacjami i analizuj dane AI
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Rules</span>
            {activeRulesCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeRulesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
            {activeInsightsCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {activeInsightsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
            <Badge variant="secondary" className="ml-1">
              {templates.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AutomationDashboard 
            rules={rules}
            executions={executions}
            metrics={metrics}
            insights={insights}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <AutomationRulesView rules={rules} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AutomationInsightsView insights={insights} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AutomationLogsView executions={executions} rules={rules} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <AutomationTemplatesView templates={templates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

