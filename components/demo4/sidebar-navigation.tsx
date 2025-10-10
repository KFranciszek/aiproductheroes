"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Users, 
  BarChart3, 
  Activity, 
  Sparkles, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Moon,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUI } from "@/lib/demo4/ui-context";
import { useTheme } from "./theme-provider";
import { useData } from "@/lib/demo4/data-context";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/demo4", badge: null },
  { icon: ListTodo, label: "Issues", href: "/demo4/issues", badge: "urgent" },
  { icon: Calendar, label: "Sprints", href: "/demo4/sprints", badge: null },
  { icon: Users, label: "Teams", href: "/demo4/teams", badge: null },
  { icon: BarChart3, label: "Reports", href: "/demo4/reports", badge: null },
  { icon: Activity, label: "Activity", href: "/demo4/activity", badge: null },
  { icon: Sparkles, label: "Automations", href: "/demo4/automations", badge: "new" },
];

interface SidebarNavigationProps {
  onNewTask?: () => void;
}

export function SidebarNavigation({ onNewTask }: SidebarNavigationProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, openCommandPalette } = useUI();
  const { theme, toggleTheme, mounted } = useTheme();
  const { issues } = useData();

  const urgentCount = issues.filter(i => i.priority === "P0" && i.status !== "done").length;

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`fixed left-0 top-[40px] h-[calc(100vh-40px)] bg-[var(--bg-elevated)] border-r border-[var(--border-default)] flex flex-col transition-all duration-200 z-40 ${
          sidebarCollapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-semibold text-[var(--text-primary)]">Syzio</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/demo4" && pathname?.startsWith(item.href));
            const badgeCount = item.badge === "urgent" ? urgentCount : null;

            const content = (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative group ${
                  isActive
                    ? "bg-[var(--bg-subtle)] text-[var(--brand-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--brand-primary)] rounded-r-full" />
                )}
                
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {badgeCount && badgeCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                        {badgeCount}
                      </Badge>
                    )}
                    {item.badge === "new" && (
                      <Badge className="h-5 px-2 text-xs bg-[var(--brand-secondary)]">
                        New
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {content}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{content}</div>;
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2">
          <Button
            onClick={onNewTask}
            className="w-full justify-start gap-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90"
            size={sidebarCollapsed ? "icon" : "default"}
          >
            <Plus className="w-5 h-5" />
            {!sidebarCollapsed && <span>New Task</span>}
          </Button>

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="flex-1"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="flex-1"
                >
                  <Link href="/demo4/settings">
                    <Settings className="w-5 h-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-1"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard shortcuts (?)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
