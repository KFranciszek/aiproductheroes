import type React from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { DemoBanner } from "@/components/demo-banner"
import { CommandPalette } from "@/components/command-palette"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNavigation />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DemoBanner />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-[1440px] p-6">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
