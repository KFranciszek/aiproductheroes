"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, AlertTriangle, Activity, Clock } from "lucide-react"
import type { AutomationExecution, AutomationRule } from "@/types"
import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface AutomationLogsViewProps {
  executions: AutomationExecution[]
  rules: AutomationRule[]
}

export function AutomationLogsView({ executions, rules }: AutomationLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ruleFilter, setRuleFilter] = useState<string>("all")

  const filteredExecutions = executions
    .filter(exec => {
      const matchesSearch = exec.ruleName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || exec.status === statusFilter
      const matchesRule = ruleFilter === "all" || exec.ruleId === ruleFilter
      return matchesSearch && matchesStatus && matchesRule
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'running':
        return <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Running</Badge>
    }
  }

  const successCount = executions.filter(e => e.status === 'success').length
  const failedCount = executions.filter(e => e.status === 'failed').length
  const warningCount = executions.filter(e => e.status === 'warning').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Automation Logs</h2>
        <p className="text-muted-foreground">Historia wykonań wszystkich automatyzacji</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Szukaj w logach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={ruleFilter} onValueChange={setRuleFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Reguła" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie reguły</SelectItem>
                {rules.map(rule => (
                  <SelectItem key={rule.id} value={rule.id}>{rule.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredExecutions.map(exec => (
          <Card key={exec.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(exec.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{exec.ruleName}</CardTitle>
                      {getStatusBadge(exec.status)}
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(exec.timestamp, 'PPp', { locale: pl })}
                        </span>
                        <span>•</span>
                        <span>{formatDistanceToNow(exec.timestamp, { addSuffix: true, locale: pl })}</span>
                        <span>•</span>
                        <span>Duration: {exec.duration}ms</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            {(exec.error || exec.affectedIssues) && (
              <CardContent>
                {exec.error && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-950 rounded text-sm">
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-1">Error:</p>
                    <p className="text-red-700 dark:text-red-300">{exec.error}</p>
                  </div>
                )}
                {exec.affectedIssues && exec.affectedIssues.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Affected tasks:</span>
                    <div className="flex flex-wrap gap-1">
                      {exec.affectedIssues.map(issueId => (
                        <Badge key={issueId} variant="outline" className="text-xs">
                          {issueId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}

        {filteredExecutions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Brak logów spełniających kryteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

