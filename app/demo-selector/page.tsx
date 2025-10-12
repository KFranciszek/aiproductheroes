"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Layout, Activity,Bot,Radar } from "lucide-react"

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
    },

    {
    id: "demo6",
    title: "Syzio Canis",
    tagline: "Agent AI rozumiejący Twoją dokumentację i backlog",
    description: "Generuje story z AC, dane testowe i weryfikuje wymagania na podstawie dokumentacji (RAG) i danych z Syzio.",
    color: "purple",
    icon: Bot,
    features: [
      "Chat RAG nad dokumentacją i backlogiem (cytowania)",
      "Generator Story/AC (INVEST, Gherkin)",
      "Generator danych testowych (JSON/CSV/SQL)",
      "Weryfikator wymagań i wykrywanie konfliktów",
      "Release Q&A (co było w paczce?)",
      "Command Palette akcje Canis (Ctrl+K)",
      "Eksport artefaktów bezpośrednio do PM",
      "Słownik domeny i reguły walidacyjne"

    ],

      status: "Nowe",
      href: "/demo6",
      isNew: true
    
  },

    {
    id: "demo7",
    title: "Syzio Pulsar Nova",
    tagline: "Prognozy dostarczenia i jakość releasów w czasie rzeczywistym",
    description: "DORA/Flow, Readiness Score i Risk Radar zasilane danymi z PM, DevMon i Canis — decyzje go/no-go na fakty.",
    color: "pink",
    icon: Radar,
    features: [
      "Dashboard DORA + Flow Metrics",
      "Release Readiness Score i Quality Gates",
      "Prognozy Monte Carlo dla epików i releasów",
      "Risk Radar i alerty (Slack/Email)",
      "What-if: +1 dev, limit WIP, scope cut",
      "Aging work i WIP heatmap",
      "Trendy i insighty dla liderów",
      "API do eksportu metryk i raportów"
    ],
      status: "Nowe",
      href: "/demo7",
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

        {/* Ecosystem Description */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="space-y-6">
                {/* Main Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    <h3 className="text-2xl font-bold">Zintegrowany Ekosystem</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Syzio to zintegrowany ekosystem <span className="font-semibold text-foreground">czterech modułów</span>, które łączą plan, dostarczanie, wiedzę i analitykę w jednej pętli.
                    Dane przepływają między <span className="text-blue-600 font-medium">Project Management</span>, <span className="text-orange-600 font-medium">Development Monitoring</span>, <span className="text-purple-600 font-medium">Canis</span> i <span className="text-pink-600 font-medium">Pulsarem</span> w czasie rzeczywistym,
                    tworząc wspólny graf śledzenia od story do wdrożenia.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Każdy moduł działa samodzielnie, a po spięciu zyskujesz <span className="font-semibold text-foreground">automatyczne feedback-loopy</span>, które podnoszą jakość i przewidywalność.
                    W praktyce oznacza to mniej niejasności przed sprintem, bardziej świadome decyzje o releasach i natychmiastowe odpowiedzi na pytania o to, co i dlaczego trafiło do paczki.
                  </p>
                </div>

                {/* Integration Flow */}
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Canis → PM</div>
                        <div className="text-sm text-muted-foreground">
                          Wygenerowane AC + weryfikacje → podnosi jakość story przed sprintem
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Pulsar → PM</div>
                        <div className="text-sm text-muted-foreground">
                          Risk Radar i prognozy → zmiany zakresu lub re-plan
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-600 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Pulsar → DevMon</div>
                        <div className="text-sm text-muted-foreground">
                          Quality Gates (np. blokada wdrożenia, jeśli criticalBugs &gt; 0)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-600 font-bold text-sm">
                        4
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">DevMon → Canis</div>
                        <div className="text-sm text-muted-foreground">
                          Kontekst paczek → Canis odpowiada „co poszło gdzie i dlaczego"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-center text-muted-foreground italic">
                    💡 Poniżej możesz przetestować <span className="font-semibold text-foreground">Project Management</span> i <span className="font-semibold text-foreground">Development Monitoring</span> — dwa kluczowe moduły ekosystemu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {demos.map((demo) => {
            const Icon = demo.icon
            return (
              <Card
                key={demo.id}
                className={`relative overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] border-2 ${demo.color === 'blue'
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

                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${demo.color === 'blue'
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
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${demo.color === 'blue'
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
                          <span className={`mt-0.5 ${demo.color === 'blue'
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
                      className={`w-full ${demo.color === 'blue'
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
                  <div className="text-3xl font-bold text-primary mb-2">∞</div>
                  <p className="text-sm text-muted-foreground">Jeden ekosystem</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Jedno flow</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">end2end</div>
                  <p className="text-sm text-muted-foreground">Pełna kontrola i wiedza</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


