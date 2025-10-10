"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ListTodo,
  Zap,
  Users,
  BarChart3,
  Activity,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/demo3/utils"
import { Button } from "@/components/demo3/ui/button"
import { Badge } from "@/components/demo3/ui/badge"
import { Separator } from "@/components/demo3/ui/separator"
import { ScrollArea } from "@/components/demo3/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/demo3/ui/tooltip"
import { useUI } from "@/lib/demo3/ui-context"

interface NavItem {
  icon: React.ElementType
  name: string
  to: string
  badge?: string | number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, name: "Dashboard", to: "/demo3" },
  { icon: ListTodo, name: "Issues", to: "/demo3/issues", badge: 6 },
  { icon: Zap, name: "Sprints", to: "/demo3/sprints" },
  { icon: Users, name: "Teams", to: "/demo3/teams" },
  { icon: BarChart3, name: "Reports", to: "/demo3/reports" },
  { icon: Activity, name: "Activity", to: "/demo3/activity" },
  { icon: Sparkles, name: "Automations", to: "/demo3/automations" },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, theme, setTheme } = useUI()

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.to
    const Icon = item.icon

    const content = (
      <Link
        href={item.to}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary",
          !isActive && "text-sidebar-foreground/70",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )

    if (sidebarCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
          sidebarCollapsed ? "w-[72px]" : "w-[280px]",
        )}
      >
        {/* Logo & Toggle */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <Link href="/demo" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary opacity-80" />
                <div className="h-2 w-2 rounded-full bg-accent opacity-90" />
                <div className="h-2 w-2 rounded-full bg-success opacity-80" />
              </div>
              <span>Syzio</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 shrink-0">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t p-3 space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                className="w-full justify-start gap-3"
                size={sidebarCollapsed ? "icon" : "default"}
              >
                <Plus className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>New Task</span>}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && <TooltipContent side="right">New Task</TooltipContent>}
          </Tooltip>

          <Separator />

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Toggle theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                  <Link href="/demo3/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Keyboard shortcuts (?)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
