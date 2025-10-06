"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Lightbulb, TrendingUp, Target, X } from "lucide-react"
import type { AIInsight } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface AutomationInsightsViewProps {
  insights: AIInsight[]
}

export function AutomationInsightsView({ insights }: AutomationInsightsViewProps) {
  const activeInsights = insights.filter(i => !i.dismissed)
  
  const riskInsights = activeInsights.filter(i => i.type === 'risk')
  const suggestionInsights = activeInsights.filter(i => i.type === 'suggestion')
  const patternInsights = activeInsights.filter(i => i.type === 'pattern')
  const optimizationInsights = activeInsights.filter(i => i.type === 'optimization')

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-blue-600" />
      case 'pattern':
        return <TrendingUp className="h-5 w-5 text-purple-600" />
      case 'optimization':
        return <Target className="h-5 w-5 text-green-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const renderInsightSection = (title: string, insights: AIInsight[], description: string) => {
    if (insights.length === 0) return null

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-3">
          {insights.map(insight => (
            <Card key={insight.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        {getSeverityBadge(insight.severity)}
                      </div>
                      <CardDescription className="mt-2">{insight.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(insight.createdAt, { addSuffix: true, locale: pl })}
                    {insight.relatedIssues && insight.relatedIssues.length > 0 && (
                      <span className="ml-3">
                        • {insight.relatedIssues.length} related tasks
                      </span>
                    )}
                  </div>
                  {insight.actionable && insight.action && (
                    <Button size="sm">
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">AI Insights</h2>
        <p className="text-muted-foreground">Inteligentne sugestie i predykcje dla Twojego zespołu</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Risks Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskInsights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestionInsights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Patterns Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patternInsights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationInsights.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Sections */}
      {renderInsightSection(
        "🚨 Risk Predictions",
        riskInsights,
        "Potencjalne problemy wykryte przez AI"
      )}

      {renderInsightSection(
        "💡 Smart Suggestions",
        suggestionInsights,
        "Rekomendacje usprawniające pracę zespołu"
      )}

      {renderInsightSection(
        "📊 Pattern Analysis",
        patternInsights,
        "Wykryte wzorce w pracy zespołu"
      )}

      {renderInsightSection(
        "⚡ Optimization Opportunities",
        optimizationInsights,
        "Możliwości zaoszczędzenia czasu"
      )}

      {activeInsights.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <Lightbulb className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-semibold">Brak aktywnych insightów</p>
              <p className="text-sm text-muted-foreground">
                AI analizuje Twoje dane. Sprawdź później, aby zobaczyć sugestie.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

