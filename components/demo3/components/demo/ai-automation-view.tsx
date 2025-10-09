"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Zap, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { mockAutomationRules } from "@/lib/mock-data"

export function AIAutomationView() {
  const [rules, setRules] = useState(mockAutomationRules)

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const activeRulesCount = rules.filter((r) => r.enabled).length

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automatyzacje AI</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj regułami automatyzacji i usprawniaj workflow</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nowa Reguła
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktywne Reguły</CardTitle>
            <Zap className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRulesCount}</div>
            <p className="text-xs text-muted-foreground">z {rules.length} łącznie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Zaoszczędzony Czas</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5h</div>
            <p className="text-xs text-muted-foreground">w tym miesiącu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wykonania</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">w ostatnich 30 dniach</p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Reguły Automatyzacji</h2>

        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    {rule.enabled ? (
                      <Badge className="bg-chart-2">Aktywna</Badge>
                    ) : (
                      <Badge variant="secondary">Nieaktywna</Badge>
                    )}
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trigger */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Wyzwalacz</h4>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Gdy:</span> {rule.trigger.event}
                  </p>
                  {rule.trigger.conditions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {rule.trigger.conditions.map((condition, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                          • {condition.field} {condition.operator} "{String(condition.value)}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Akcje</h4>
                <div className="space-y-2">
                  {rule.actions.map((action, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Wtedy:</span> {action.type}
                      </p>
                      {Object.keys(action.params).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Object.entries(action.params)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                <span>Utworzono: {new Date(rule.createdAt).toLocaleDateString("pl-PL")}</span>
                {rule.lastRun && (
                  <span>Ostatnie uruchomienie: {new Date(rule.lastRun).toLocaleDateString("pl-PL")}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Szablony Automatyzacji</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Auto-assign nowych bugów</CardTitle>
              <CardDescription>Automatycznie przypisuj nowe bugi do QA Leada</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Użyj szablonu
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Przypomnienia o deadline</CardTitle>
              <CardDescription>Wysyłaj powiadomienia 2 dni przed terminem</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Użyj szablonu
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Zamykanie starych zadań</CardTitle>
              <CardDescription>Automatycznie zamykaj zadania nieaktywne przez 30 dni</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Użyj szablonu
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Slack notifications</CardTitle>
              <CardDescription>Powiadamiaj zespół o krytycznych zadaniach</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Użyj szablonu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-chart-1" />
            Sugestie AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Na podstawie analizy Twojego workflow, AI sugeruje utworzenie reguły automatycznego przypisywania zadań typu
            "Feature" do Frontend Team, co może zaoszczędzić około 2h tygodniowo.
          </p>
          <Button variant="outline" size="sm" className="mt-4 bg-transparent">
            Utwórz sugerowaną regułę
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
