import type React from "react"
import { ThemeProvider } from "@/components/demo/theme-provider"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="syzio-theme">
      <div className="min-h-screen bg-background">
        {/* Demo Mode Banner */}
        <div className="h-8 bg-primary/10 border-b border-primary/20 flex items-center justify-center">
          <p className="text-xs text-primary font-medium">
            Demo Mode - Exploring Syzio Project Management
            <a href="/" className="ml-2 underline hover:text-primary/80">
              Return to Home
            </a>
          </p>
        </div>
        {children}
      </div>
    </ThemeProvider>
  )
}
