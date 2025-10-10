"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Plus, 
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { toast } from "sonner";

export function AutomationsView() {
  const { automationRules } = useData();

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    toast.success(enabled ? "Rule enabled" : "Rule disabled");
  };

  const activeRules = automationRules.filter(r => r.active);
  const inactiveRules = automationRules.filter(r => !r.active);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[var(--brand-secondary)]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                AI & Automations
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Automate your workflow with intelligent rules
              </p>
            </div>
          </div>

          <Button className="bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary)]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="overview" className="h-full">
          <div className="border-b border-[var(--border-subtle)] px-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">
                Rules
                <Badge variant="secondary" className="ml-2">
                  {automationRules.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview */}
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    Active Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    {activeRules.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    Time Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--success-text)]">
                    12h
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    98%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    Executions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    247
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest automation executions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-subtle)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[var(--success-text)]" />
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            Auto-assign P0 issues
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Executed {i}h ago
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-[var(--success-bg)] text-[var(--success-text)]">
                        Success
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules */}
          <TabsContent value="rules" className="p-6 space-y-4">
            {automationRules.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  No Automation Rules
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Create your first automation rule to get started
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{rule.name}</CardTitle>
                            <Badge
                              className={
                                rule.active
                                  ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                                  : "bg-[var(--bg-subtle)] text-[var(--text-tertiary)]"
                              }
                            >
                              {rule.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <CardDescription>
                            When: {rule.when.join(", ")} • If: {rule.if.join(", ")} • Then: {rule.then.join(", ")}
                          </CardDescription>
                        </div>
                        <Switch
                          checked={rule.active}
                          onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm">
                        {rule.lastRunAt && (
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Clock className="w-4 h-4" />
                            Last run: {new Date(rule.lastRunAt).toLocaleString()}
                          </div>
                        )}
                        {rule.lastRunStatus && (
                          <div className="flex items-center gap-2">
                            {rule.lastRunStatus === "success" ? (
                              <CheckCircle2 className="w-4 h-4 text-[var(--success-text)]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[var(--error-text)]" />
                            )}
                            <span className="text-[var(--text-secondary)]">
                              {rule.lastRunStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="p-6">
            <div className="space-y-4">
              <Card className="border-l-4 border-l-[var(--warning)]">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[var(--warning-text)] mt-0.5" />
                    <div>
                      <CardTitle className="text-base">Potential Bottleneck Detected</CardTitle>
                      <CardDescription className="mt-1">
                        The "In Review" column has accumulated 8 tasks. Consider adding more reviewers or adjusting your review process.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                    <Button size="sm">
                      Create Automation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[var(--info)]">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[var(--info-text)] mt-0.5" />
                    <div>
                      <CardTitle className="text-base">Velocity Improvement</CardTitle>
                      <CardDescription className="mt-1">
                        Your team's velocity has increased by 15% over the last 3 sprints. Great work!
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="p-6">
            <div className="text-center py-12 text-[var(--text-tertiary)]">
              <Clock className="w-16 h-16 mx-auto mb-4" />
              <p>Automation execution logs will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
