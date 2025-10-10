"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Layout, Grid3x3, Zap } from "lucide-react"

export default function DemoSelector() {
  const demos = [
    {
      id: "demo1",
      title: "Demo 1 - Classic Experience",
      tagline: "Traditional & Feature-Rich",
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
      id: "demo2",
      title: "Demo 2 - Modern Design",
      tagline: "Information First & Non-Blocking UI",
      description: "Ultra-szczegółowy koncept design z naciskiem na dostępność i wydajność",
      color: "purple",
      icon: Grid3x3,
      features: [
        "Top navigation z dostępnością WCAG 2.2 AA+",
        "Card-based interface z Design System",
        "Right drawer dla szczegółów (non-blocking)",
        "Zaawansowane wyszukiwanie i filtry",
        "Kanban z WIP limits i AI insights",
        "Modułowy dashboard z drag&drop"
      ],
      status: "W budowie",
      href: "/demo2",
      isNew: true
    },
    {
      id: "demo3",
      title: "Demo 3 - Modern UI",
      tagline: "Next-Gen Interface & Full Stack",
      description: "Nowoczesny interfejs z pełną funkcjonalnością i zaawansowanymi komponentami",
      color: "green",
      icon: Zap,
      features: [
        "Nowoczesny design system z Tailwind CSS 4",
        "Kompletny zestaw komponentów UI",
        "Dark/Light mode z preferencjami użytkownika",
        "Responsywny design z różnymi gęstościami",
        "Command Palette i skróty klawiszowe",
        "Zaawansowane zarządzanie stanem"
      ],
      status: "Nowe",
      href: "/demo3",
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
            <Sparkles className="w-4 h-4" />
            Wybierz swoje doświadczenie
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Wypróbuj różne podejścia
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              do tego samego produktu
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Każde demo oferuje pełną funkcjonalność, ale z innym UX/UI. 
            Porównaj podejścia i zobacz, które działa dla Ciebie najlepiej.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {demos.map((demo) => {
            const Icon = demo.icon
            return (
              <Card 
                key={demo.id} 
                className={`relative overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] border-2 ${
                  demo.color === 'blue' 
                    ? 'hover:border-blue-500/50' 
                    : 'hover:border-purple-500/50'
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
                  demo.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />

                <CardHeader className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    demo.color === 'blue' 
                      ? 'bg-blue-500/10 text-blue-600' 
                      : 'bg-purple-500/10 text-purple-600'
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
                            demo.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
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
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      }`}
                      size="lg"
                    >
                      <Link href={demo.href}>
                        {demo.status === "W budowie" ? "Podgląd Demo 2" : "Uruchom Demo 1"}
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


