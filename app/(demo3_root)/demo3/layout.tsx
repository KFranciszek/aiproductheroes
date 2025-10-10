import type React from "react"
import { SidebarNavigation } from "@/components/demo3/sidebar-navigation"
import { DemoBanner } from "@/components/demo3/demo-banner"
import { CommandPalette } from "@/components/demo3/command-palette"
import { ThemeProvider } from "@/components/demo3/theme-provider"
import { UIProvider } from "@/lib/demo3/ui-context"

export default function Demo3Layout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </UIProvider>
  )
}
