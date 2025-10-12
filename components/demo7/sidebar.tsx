"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Truck,
  Sparkles,
  TrendingUp,
  Link2,
  Activity,
  Bot,
  Settings,
  BarChart3,
} from "lucide-react";

const items = [
  { href: "/demo7", label: "Home", icon: Home },
  { href: "/demo7/delivery", label: "Delivery", icon: Truck },
  { href: "/demo7/insights", label: "Insights", icon: Sparkles },
  { href: "/demo7/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/demo7/trace", label: "Traceability", icon: Link2 },
  { href: "/demo7/reports", label: "Reports", icon: BarChart3 },
  { href: "/demo7/activity", label: "Activity", icon: Activity },
  { href: "/demo7/automations", label: "Automations", icon: Bot },
  { href: "/demo7/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Pulsar Nova</h1>
            <p className="text-xs text-muted-foreground">
              Delivery · Quality · Outcomes
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-auto p-4 space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors",
                active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted/50"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <p className="text-sm font-medium">PoC v1.0</p>
      </div>
    </aside>
  );
}
