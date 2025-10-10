"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/demo3/ui/card"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Switch } from "@/components/demo3/ui/switch"
import { Plus, Sparkles, Zap, CheckCircle2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/demo3/ui/dialog"
import { useData } from "@/lib/demo3/data-context"

export function AutomationsView() {
  const { automationRules } = useData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground">Streamline your workflow with automated rules.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Automation Rule</DialogTitle>
              <DialogDescription>
                The advanced, multi-step rule creator is coming soon.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center text-muted-foreground">
              <Zap className="mx-auto h-12 w-12 mb-4" />
              <p>Define triggers, conditions, and actions to automate your process.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRules.filter((r) => r.active).length}</div>
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
          {automationRules.map((rule) => (
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
