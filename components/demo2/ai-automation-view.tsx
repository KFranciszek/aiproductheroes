"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Zap
} from "lucide-react"

export function AIAutomationView() {
  const automationRules = [
    {
      id: "rule-1",
      name: "Auto-assign P0 issues",
      description: "Automatycznie przypisuje zadania P0 do team leada",
      active: true,
      lastRun: "2 min temu",
      executions: 12,
      successRate: 100
    },
    {
      id: "rule-2", 
      name: "Sprint capacity warning",
      description: "Ostrzega gdy sprint przekracza 80% capacity",
      active: true,
      lastRun: "1h temu",
      executions: 3,
      successRate: 100
    },
    {
      id: "rule-3",
      name: "Blocked issue escalation", 
      description: "Eskaluje zablokowane zadania po 24h",
      active: false,
      lastRun: "Nigdy",
      executions: 0,
      successRate: 0
    }
  ]

  const insights = [
    {
      id: "insight-1",
      title: "Ryzyko opóźnienia sprintu",
      description: "Obecne tempo może spowodować 15% niedostarczenie zaplanowanych zadań",
      priority: "high",
      action: "Rozważ przeniesienie 2-3 zadań do następnego sprintu"
    },
    {
      id: "insight-2",
      title: "Optymalizacja workload",
      description: "Anna Kowalska ma 40% więcej zadań niż średnia zespołu",
      priority: "medium", 
      action: "Sugeruj realokację 1-2 zadań do innych członków"
    },
    {
      id: "insight-3",
      title: "Wzorzec blokad",
      description: "Zadania związane z API są blokowane 3x częściej",
      priority: "low",
      action: "Rozważ dodatkowe review dla zadań API"
    }
  ]

  const templates = [
    {
      id: "template-1",
      name: "Sprint Health Monitor",
      description: "Monitoruje zdrowie sprintu i wysyła alerty",
      category: "Sprint Management"
    },
    {
      id: "template-2",
      name: "Team Workload Balancer", 
      description: "Automatycznie balansuje obciążenie zespołu",
      category: "Team Management"
    },
    {
      id: "template-3",
      name: "Priority Escalator",
      description: "Eskaluje zadania na podstawie wieku i priorytetu", 
      category: "Issue Management"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Automation
          </h1>
          <p className="text-muted-foreground">
            Inteligentne automatyzacje i insights dla Twojego zespołu
          </p>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nowa reguła
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Aktywne reguły
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs opacity-75 mt-1">z 3 reguł</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Wykonania
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
            <p className="text-xs opacity-75 mt-1">w tym tygodniu</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">100%</div>
            <p className="text-xs opacity-75 mt-1">ostatnie 30 dni</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Oszczędzony czas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2h</div>
            <p className="text-xs opacity-75 mt-1">w tym tygodniu</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Reguły</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="templates">Szablony</TabsTrigger>
          <TabsTrigger value="logs">Logi</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Aktywna" : "Nieaktywna"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Ostatnie uruchomienie: {rule.lastRun}</span>
                        <span>Wykonania: {rule.executions}</span>
                        <span>Success rate: {rule.successRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch checked={rule.active} />
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority === "high" ? "Wysoki" :
                             insight.priority === "medium" ? "Średni" : "Niski"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      
                      {insight.priority === "high" && (
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Sugerowana akcja:</strong> {insight.action}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">Zastosuj sugestię</Button>
                      <Button size="sm" variant="outline">Odrzuć</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {template.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Użyj szablonu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-lg font-semibold">Logi automatyzacji</h3>
                  <p className="text-muted-foreground">
                    Historia wykonań i szczegółowe logi pojawią się tutaj
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
