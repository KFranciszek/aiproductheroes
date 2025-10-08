"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, TrendingUp } from "lucide-react"
import type { AutomationRule, AutomationExecution, AutomationMetrics, AIInsight } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface AutomationDashboardProps {
  rules: AutomationRule[]
  executions: AutomationExecution[]
  metrics: AutomationMetrics
  insights: AIInsight[]
}

export function AutomationDashboard({
  rules,
  executions,
  metrics,
  insights
}: AutomationDashboardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthIcon = (score: number) => {
    if (score >= 90) return "🟢"
    if (score >= 70) return "🟡"
    return "🔴"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getRuleStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">🟢 Active</Badge>
      case 'paused':
        return <Badge variant="secondary">⚪ Paused</Badge>
      case 'failed':
        return <Badge variant="destructive">🔴 Failed</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  const recentExecutions = executions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10)

  const highPriorityInsights = insights
    .filter(i => !i.dismissed && i.severity === 'high')
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <span className="text-2xl">{getHealthIcon(metrics.healthScore)}</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.healthScore)}`}>
              {metrics.healthScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              System działa sprawnie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              {rules.length} total rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.timeSavedHours}h</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Automations */}
        <Card>
          <CardHeader>
            <CardTitle>Active Automations</CardTitle>
            <CardDescription>Status wszystkich aktywnych reguł</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules
              .filter(r => r.status === 'active' || r.status === 'paused')
              .map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRuleStatusBadge(rule.status)}
                    <div>
                      <p className="font-medium text-sm">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last run: {rule.lastRun ? formatDistanceToNow(rule.lastRun, { addSuffix: true, locale: pl }) : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{rule.successRate}%</p>
                    <p className="text-xs text-muted-foreground">{rule.executionCount} runs</p>
                  </div>
                </div>
              ))}
            {rules.filter(r => r.status === 'active' || r.status === 'paused').length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Brak aktywnych automatyzacji
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Ostatnie 10 wykonań</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentExecutions.map(exec => (
              <div key={exec.id} className="flex items-start gap-3 p-2 border-b last:border-0">
                <div className="mt-1">{getStatusIcon(exec.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exec.ruleName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(exec.timestamp, { addSuffix: true, locale: pl })} • {exec.duration}ms
                  </p>
                  {exec.error && (
                    <p className="text-xs text-red-600 mt-1">{exec.error}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {highPriorityInsights.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Critical Alerts
            </CardTitle>
            <CardDescription>Wymagają natychmiastowej uwagi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityInsights.map(insight => (
              <div key={insight.id} className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  {insight.actionable && insight.action && (
                    <Button size="sm" className="ml-4">
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

