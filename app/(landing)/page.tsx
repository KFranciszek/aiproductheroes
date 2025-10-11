"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-[family-name:var(--font-inter)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo - Three celestial bodies in alignment (Syzygy) */}
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="12" r="3" fill="#3b82f6" opacity="0.8"/>
              <circle cx="12" cy="12" r="3" fill="#8b5cf6" opacity="0.9"/>
              <circle cx="18" cy="12" r="3" fill="#10b981" opacity="0.8"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </svg>
            <h1 className="text-lg font-bold text-foreground">Syzio</h1>
          </div>

          {/* Right side - Theme Toggle + Demo Button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Demo Button */}
            <Link 
              href="/demo-selector" 
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden container mx-auto px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-[#3b82f6]/10 absolute top-10 -left-24 animate-pulse"></div>
          <div className="w-80 h-80 rounded-full bg-[#8b5cf6]/10 absolute bottom-0 -right-20 animate-pulse" style={{ animationDelay: "200ms" }}></div>
          <div className="w-72 h-72 rounded-full bg-[#10b981]/10 absolute top-1/3 left-1/4 -translate-x-1/2 animate-pulse" style={{ animationDelay: "400ms" }}></div>
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="md:col-span-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-foreground">
              When teams, tasks, and<br />tools align perfectly
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
              Stop juggling 6 tools. Achieve syzio.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <Link href="/demo-selector" className="px-6 py-3 font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center">
                Try Demo
              </Link>
              <a href="#features" className="px-6 py-3 font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors w-full sm:w-auto text-center">
                See How It Works ↓
              </a>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "From 6 tools and 30 min standups to 1 view" <br />— Michał, Engineering Lead
            </p>
          </div>
          <div className="md:col-span-1 flex justify-center md:justify-end relative">
              <div className="absolute -top-16 -right-8 bg-card p-4 rounded-lg shadow-xl border border-border transform -rotate-2 z-30 hidden md:block">
               <p className="text-sm font-medium text-card-foreground">"Amazing visibility into projects."</p>
               <p className="text-xs text-muted-foreground">— David, Project Manager</p>
             </div>
            <div className="w-full max-w-md aspect-video bg-muted rounded-xl shadow-lg overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/1124786700?badge=0&autopause=0&player_id=0&app_id=58479"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                title="Syzio Demo"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-card p-4 rounded-lg shadow-xl border border-border transform rotate-3 z-10 hidden md:block">
              <p className="text-sm font-medium text-card-foreground">"Streamlined our workflow!"</p>
              <p className="text-xs text-muted-foreground">— Sarah, Marketing Lead</p>
            </div>
          </div>
        </div>
      </section>
                    {/* Syzio Product Family Section */}
      <section id="product-family" className="py-20 md:py-32 bg-muted/50">
  <div className="container mx-auto px-6">
    <div className="text-center max-w-4xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
        Meet the Syzio Product Family
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground">
        Four Syzio modules interact in an event-driven model to create a cohesive ecosystem for managing the entire software development lifecycle.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Syzio Project Management (PM) */}
      <div className="bg-background border border-border rounded-xl p-6 flex flex-col items-start hover:shadow-lg hover:border-primary/50 transition-all duration-300">
        <div className="p-3 mb-4 bg-blue-500/10 rounded-lg">
          {/* PM Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Syzio Project Management</h3>
        <p className="text-sm font-semibold text-primary mb-3">System of Truth for planning</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
          <li>Epics, stories, tasks</li>
          <li>Sprints & backlog</li>
          <li>Statuses & priorities</li>
          <li>Assignments & labels</li>
        </ul>
      </div>

      {/* Syzio Development Monitoring (DevMon) */}
      <div className="bg-background border border-border rounded-xl p-6 flex flex-col items-start hover:shadow-lg hover:border-violet-500/50 transition-all duration-300">
        <div className="p-3 mb-4 bg-violet-500/10 rounded-lg">
          {/* DevMon Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Syzio Development Monitoring</h3>
        <p className="text-sm font-semibold text-violet-500 mb-3">System of Truth for delivery</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
          <li>Commits & Pull Requests</li>
          <li>Builds & release packages</li>
          <li>Deployments & environments</li>
          <li>Incidents & roll-backs</li>
        </ul>
      </div>

      {/* Syzio Canis */}
      <div className="bg-background border border-border rounded-xl p-6 flex flex-col items-start hover:shadow-lg hover:border-emerald-500/50 transition-all duration-300">
        <div className="p-3 mb-4 bg-emerald-500/10 rounded-lg">
          {/* Canis Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Syzio Canis</h3>
        <p className="text-sm font-semibold text-emerald-500 mb-3">System of Truth for knowledge & AI</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
          <li>Stories/AC from documentation</li>
          <li>Test data generation</li>
          <li>Requirements verification</li>
          <li>Traceability to sources</li>
        </ul>
      </div>

      {/* Syzio Pulsar */}
      <div className="bg-background border border-border rounded-xl p-6 flex flex-col items-start hover:shadow-lg hover:border-amber-500/50 transition-all duration-300">
        <div className="p-3 mb-4 bg-amber-500/10 rounded-lg">
          {/* Pulsar Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Syzio Pulsar</h3>
        <p className="text-sm font-semibold text-amber-500 mb-3">System of Truth for forecasts</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
          <li>DORA/Flow metrics</li>
          <li>Release Readiness Score</li>
          <li>Forecasts & risk alerts</li>
          <li>"What-if" analysis</li>
        </ul>
      </div>
    </div>
  </div>
</section>



      {/* Problem Section */}
      <section id="features" className="py-20 md:py-24 relative overflow-hidden container mx-auto px-6">
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Your team is out of alignment</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-[#10b981]/10 rounded-xl transform -rotate-2 scale-105 opacity-50 z-0"></div>
          <div className="md:col-span-1 space-y-6 relative z-10">
            <div className="flex items-start p-4 bg-muted rounded-lg shadow-md border border-border/20">
              <span className="text-red-500 text-2xl mr-4">❌</span>
              <p className="text-foreground">Information scattered across 6 tools</p>
            </div>
            <div className="flex items-start p-4 bg-muted rounded-lg shadow-md border border-border/20">
              <span className="text-red-500 text-2xl mr-4">❌</span>
              <p className="text-foreground">Automations break silently</p>
            </div>
          </div>
          <div className="md:col-span-1 space-y-6 relative z-10 pt-8 md:pt-16">
            <div className="flex items-start p-4 bg-muted rounded-lg shadow-md border border-border/20">
              <span className="text-red-500 text-2xl mr-4">❌</span>
              <p className="text-foreground">2-hour manual reports every Friday</p>
            </div>
            <div className="flex items-start p-4 bg-muted rounded-lg shadow-md border border-border/20">
              <span className="text-red-500 text-2xl mr-4">❌</span>
              <p className="text-foreground">"Who's working on what?" meetings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 md:py-24 relative container mx-auto px-6">
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Three forces, one syzio</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="p-8 border border-border rounded-xl hover:shadow-xl hover:border-[#3b82f6] transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#3b82f6]/20 rounded-full blur-xl"></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center text-foreground">
              <span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-3"></span>Team Syzio
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Everyone sees the same state</li>
              <li>Real-time dependencies</li>
              <li>No human middleware</li>
            </ul>
          </div>
          <div className="p-8 border border-border rounded-xl hover:shadow-xl hover:border-[#8b5cf6] transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden md:mt-16">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#8b5cf6]/20 rounded-full blur-xl"></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center text-foreground">
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-3"></span>Tool Syzio
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Automations self-heal</li>
              <li>Health Score monitoring</li>
              <li>Semantic IDs (never break)</li>
            </ul>
          </div>
          <div className="p-8 border border-border rounded-xl hover:shadow-xl hover:border-[#10b981] transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#10b981]/20 rounded-full blur-xl"></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center text-foreground">
              <span className="w-3 h-3 rounded-full bg-[#10b981] mr-3"></span>Sprint Syzio
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Plan = Reality</li>
              <li>Auto drift detection</li>
              <li>One-click reporting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 md:py-24 container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            AI That Prevents Conflicts,<br />Not Just Detects Them
          </h2>
        </div>
        <div className="bg-muted rounded-xl p-8 md:p-12 relative overflow-hidden border border-border/20">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#06b6d4]/15 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#3b82f6]/15 rounded-full blur-xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center mb-8">
            <div className="p-4 border border-border rounded-lg bg-card shadow-md">
              <p className="font-mono text-sm text-muted-foreground">Story A</p>
              <p className="font-medium text-card-foreground">Redesign user authentication</p>
              <span className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/50 rounded-full px-2 py-0.5">In Sprint</span>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card shadow-md transform translate-x-4 md:translate-x-12">
              <p className="font-mono text-sm text-muted-foreground">Story B</p>
              <p className="font-medium text-card-foreground">Remove old login system</p>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">Backlog</span>
            </div>
          </div>
          <div className="text-center bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-500/50 rounded-lg p-6 mb-12 relative z-10 transform rotate-1">
            <p className="text-yellow-600 dark:text-yellow-300 text-2xl mb-2">⚠️</p>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Conflict detected: Story B depends on Story A</p>
          </div>
          <div className="relative z-10 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-card rounded-lg shadow-sm transform -rotate-1">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-muted-foreground">Auto-generate stories from docs</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm transform rotate-2">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-muted-foreground">AI suggests tasks based on context</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm transform -rotate-1">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-muted-foreground">Stories "argue" - AI mediates</p>
            </div>
          </div>
        </div>
      </section>  
   

     

      {/* Multi-Team Sync Section */}
      <section className="py-20 md:py-24 text-center relative overflow-hidden container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10 text-foreground">One Project, Many Teams, Perfect Sync</h2>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 my-10 font-mono text-sm relative z-10">
          <div className="p-3 md:p-4 border border-border rounded-lg transform rotate-2 shadow-sm">
            Frontend <span className="text-[#3b82f6]">●</span>
          </div>
          <span className="text-muted-foreground text-lg">←→</span>
          <div className="p-3 md:p-4 border border-border rounded-lg transform -rotate-1 shadow-sm">
            Backend <span className="text-[#8b5cf6]">●</span>
          </div>
          <span className="text-muted-foreground text-lg">←→</span>
          <div className="p-3 md:p-4 border border-border rounded-lg transform rotate-3 shadow-sm">
            DevOps <span className="text-[#10b981]">●</span>
          </div>
          <span className="text-muted-foreground text-lg">←→</span>
          <div className="p-3 md:p-4 border border-border rounded-lg transform -rotate-2 shadow-sm">
            Design <span className="text-[#06b6d4]">●</span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto relative z-10">
          Real-time visibility. Shared resources. Zero meetings.<br />Scales from 2 teams to 20+.
        </p>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 md:py-24 relative overflow-hidden container mx-auto px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="md:col-span-1 text-center md:text-left">
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              In astronomy, <strong className="text-foreground">syzygy</strong> is when 3 celestial bodies align perfectly - a rare moment of cosmic harmony.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              In project management, perfect alignment is just as rare. <br />
              <strong className="text-foreground">Syzio brings back that perfect alignment.</strong>
            </p>
            <a href="#cta" className="px-6 py-3 font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:opacity-90 transition-opacity inline-block">
              Achieve Your First Syzio
            </a>
          </div>
          <div className="md:col-span-1 flex justify-center md:justify-end relative">
            <div className="w-full max-w-sm h-64 bg-muted rounded-xl shadow-lg overflow-hidden transform rotate-3 relative">
              <Image
                src="/landing/syzio-illustration.jpg"
                alt="Syzio - Perfect alignment visualization"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-16 -left-8 bg-card p-4 rounded-lg shadow-xl border border-border transform -rotate-2 z-20 hidden md:block">
              <p className="text-sm font-medium text-card-foreground">"Cosmic harmony, indeed!"</p>
              <p className="text-xs text-muted-foreground">— Alex, CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 md:py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Teams Achieving Syzio</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-sm relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-xl transform rotate-2 scale-105 opacity-50 z-0 hidden md:block"></div>
          <div className="p-6 bg-muted rounded-lg shadow-md transform rotate-1 relative z-10 border border-border/20">
            <p className="text-foreground mb-4 italic">"6 tools → 1 view. 30 min standups → 5 min."</p>
            <p className="font-medium text-foreground">Michał</p>
            <p className="text-muted-foreground">Engineering Lead</p>
          </div>
          <div className="p-6 bg-muted rounded-lg shadow-md transform -rotate-1 md:translate-y-8 relative z-10 border border-border/20">
            <p className="text-foreground mb-4 italic">"We went from chaos to perfect alignment in 2 weeks."</p>
            <p className="font-medium text-foreground">Anna</p>
            <p className="text-muted-foreground">Product Manager</p>
          </div>
          <div className="p-6 bg-muted rounded-lg shadow-md transform rotate-2 relative z-10 border border-border/20">
            <p className="text-foreground mb-4 italic">"Finally a tool that actually prevents problems."</p>
            <p className="font-medium text-foreground">Tom</p>
            <p className="text-muted-foreground">CTO</p>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mt-12 relative z-10">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full shadow-sm transform -rotate-1">#SyzioAchieved</span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full shadow-sm transform rotate-2">#TeamSyzio</span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full shadow-sm transform -rotate-1">#PerfectAlignment</span>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="text-center py-20 md:py-32 relative overflow-hidden container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10 text-foreground">Ready to achieve perfect alignment?</h2>
        <div className="flex justify-center my-8 relative z-10">
          <Link href="/demo-selector" className="px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:opacity-90 transition-opacity">
            Try Demo - It's Free
          </Link>
        </div>
        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-muted-foreground mb-4">Or get early access:</p>
          <form className="flex justify-center items-center max-w-md mx-auto">
            <input
              className="w-full px-4 py-2 text-foreground bg-background border border-border rounded-l-lg focus:ring-[#06b6d4] focus:border-[#06b6d4]"
              placeholder="your@email.com"
              type="email"
            />
            <button className="px-6 py-2 font-medium text-white bg-[#06b6d4] rounded-r-lg hover:bg-[#06b6d4]/90 transition-colors" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
