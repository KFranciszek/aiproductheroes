"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Layout, Activity } from "lucide-react"

export default function DemoSelector() {
  const demos = [
    {
      id: "demo1",
      title: "Syzio Project Management",
      tagline: "Podstawowe narzędzie zarządzania zmiana w Twojej organizacji",
      description: "Klasyczne podejście z sidebarem i kompleksowymi funkcjami",
      color: "blue",
      icon: Layout,
      features: [
        "Sidebar navigation z pełną hierarchią",
        "Tradycyjny layout z panelami",
        "Wszystkie funkcje w jednym miejscu",
        "Szczegółowe widoki i raporty",
        "Command Palette (Ctrl+K)",
        "AI Automations & Insights"
      ],
      status: "Dostępne",
      href: "/demo1"
    },
    {
      id: "demo5",
      title: "Syzio Dev Monitoring",
      tagline: "Deployment Tracking & Integration",
      description: "Moduł monitoringu deploymentów z integracją Syzio PM",
      color: "orange",
      icon: Activity,
      features: [
        "Tracking deploymentów i release'ów",
        "Integracja z Syzio PM (jaka paczka jakie storki i zadania)",
        "Historia commitów Git z linkami",
        "Metryki deploymentów i health status",
        "Multi-environment monitoring",
        "Incident log i śledzenie rollbacków",
        "Zapytania: „co poszło w paczce R-102?”",
        "Filtry i widoki środowiskowe"

      ],
      status: "Nowe",
      href: "/demo5",
      isNew: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do strony głównej
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Layout className="w-4 h-4" />
            Wybierz swoje doświadczenie
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Rodzinna produktów Syzio
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              One Project, Many Teams, Perfect Sync

            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
Zestaw narzędzi do planowania, dostarczania i doskonalenia wytwarzania oprogramowania. Każdy moduł działa samodzielnie, a po integracji tworzą jeden spójny ekosystem.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {demos.map((demo) => {
            const Icon = demo.icon
            return (
              <Card 
                key={demo.id} 
                className={`relative overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] border-2 ${
                  demo.color === 'blue' 
                    ? 'hover:border-blue-500/50' 
                    : demo.color === 'purple'
                    ? 'hover:border-purple-500/50'
                    : demo.color === 'green'
                    ? 'hover:border-green-500/50'
                    : demo.color === 'orange'
                    ? 'hover:border-orange-500/50'
                    : 'hover:border-cyan-500/50'
                }`}
              >
                {demo.isNew && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      Nowe
                    </Badge>
                  </div>
                )}
                
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                  demo.color === 'blue' 
                    ? 'bg-blue-500' 
                    : demo.color === 'purple'
                    ? 'bg-purple-500'
                    : demo.color === 'green'
                    ? 'bg-green-500'
                    : demo.color === 'orange'
                    ? 'bg-orange-500'
                    : 'bg-cyan-500'
                }`} />

                <CardHeader className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    demo.color === 'blue' 
                      ? 'bg-blue-500/10 text-blue-600' 
                      : demo.color === 'purple'
                      ? 'bg-purple-500/10 text-purple-600'
                      : demo.color === 'green'
                      ? 'bg-green-500/10 text-green-600'
                      : demo.color === 'orange'
                      ? 'bg-orange-500/10 text-orange-600'
                      : 'bg-cyan-500/10 text-cyan-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{demo.title}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {demo.tagline}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    {demo.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6 relative">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Kluczowe funkcje:</p>
                    <ul className="space-y-2">
                      {demo.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className={`mt-0.5 ${
                            demo.color === 'blue' 
                              ? 'text-blue-500' 
                              : demo.color === 'purple'
                              ? 'text-purple-500'
                              : demo.color === 'green'
                              ? 'text-green-500'
                              : demo.color === 'orange'
                              ? 'text-orange-500'
                              : 'text-cyan-500'
                          }`}>✓</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      asChild 
                      className={`w-full ${
                        demo.color === 'blue'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : demo.color === 'purple'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : demo.color === 'green'
                          ? 'bg-green-600 hover:bg-green-700'
                          : demo.color === 'orange'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-cyan-600 hover:bg-cyan-700'
                      }`}
                      size="lg"
                    >
                      <Link href={demo.href}>
                        {demo.status === "W budowie" ? `Podgląd ${demo.title}` : `Uruchom ${demo.title}`}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">2</div>
                  <p className="text-sm text-muted-foreground">Różne podejścia UX/UI</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Ta sama funkcjonalność</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">∞</div>
                  <p className="text-sm text-muted-foreground">Możliwości eksperymentowania</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


