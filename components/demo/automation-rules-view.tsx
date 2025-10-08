"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Settings, Trash2, Plus } from "lucide-react"
import { AutomationRuleModal } from "./automation-rule-modal"
import type { AutomationRule } from "@/types"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface AutomationRulesViewProps {
  rules: AutomationRule[]
}

export function AutomationRulesView({ rules }: AutomationRulesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || rule.category === categoryFilter
    const matchesStatus = statusFilter === "all" || rule.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      sync: '🔄',
      assignment: '👤',
      notification: '🔔',
      sprint: '🏃',
      recurring: '🔁',
      custom: '⚙️'
    }
    return icons[category] || '⚙️'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
    }
  }

  const handleCreateRule = (ruleData: Partial<AutomationRule>) => {
    console.log('Creating new rule:', ruleData)
    // Here you would typically call an API to create the rule
    // For now, we'll just log it
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automation Rules</h2>
          <p className="text-muted-foreground">Zarządzaj wszystkimi regułami automatyzacji</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Szukaj reguł..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                <SelectItem value="sync">🔄 Sync</SelectItem>
                <SelectItem value="assignment">👤 Assignment</SelectItem>
                <SelectItem value="notification">🔔 Notification</SelectItem>
                <SelectItem value="sprint">🏃 Sprint</SelectItem>
                <SelectItem value="recurring">🔁 Recurring</SelectItem>
                <SelectItem value="custom">⚙️ Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map(rule => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getCategoryIcon(rule.category)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      {getStatusBadge(rule.status)}
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-semibold text-lg">{rule.successRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Executions</p>
                  <p className="font-semibold text-lg">{rule.executionCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg. Time</p>
                  <p className="font-semibold text-lg">{rule.avgExecutionTime}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Run</p>
                  <p className="font-semibold text-sm">
                    {rule.lastRun ? formatDistanceToNow(rule.lastRun, { addSuffix: true, locale: pl }) : 'Never'}
                  </p>
                </div>
              </div>

              {/* Rule Logic */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">Trigger: {rule.trigger.type}</Badge>
                  <span>→</span>
                  {rule.conditions.length > 0 && (
                    <>
                      <Badge variant="outline">{rule.conditions.length} conditions</Badge>
                      <span>→</span>
                    </>
                  )}
                  <Badge variant="outline">{rule.actions.length} actions</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRules.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nie znaleziono reguł spełniających kryteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      <AutomationRuleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateRule}
      />
    </div>
  )
}

