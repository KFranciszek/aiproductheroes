"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Sparkles, Zap, CheckCircle2, AlertCircle } from "lucide-react"

const mockRules = [
  {
    id: "1",
    name: "Auto-assign urgent issues",
    description: "Automatically assign P0 issues to team lead",
    active: true,
    lastRun: "2 hours ago",
    status: "success" as const,
  },
  {
    id: "2",
    name: "Sprint completion reminder",
    description: "Send notification 2 days before sprint end",
    active: true,
    lastRun: "1 day ago",
    status: "success" as const,
  },
  {
    id: "3",
    name: "Stale issue detection",
    description: "Flag issues with no activity for 7 days",
    active: false,
    lastRun: "5 days ago",
    status: "error" as const,
  },
]

export function AutomationsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Automations
          </h1>
          <p className="text-muted-foreground">Automate your workflow with intelligent rules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRules.filter((r) => r.active).length}</div>
            <p className="text-xs text-muted-foreground">Running automatically</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">100%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Automation Rules</h2>
        <div className="space-y-3">
          {mockRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                      {rule.status === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {rule.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    <p className="text-xs text-muted-foreground">Last run: {rule.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={rule.active} />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
