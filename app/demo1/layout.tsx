import { DemoThemeProvider } from "@/components/demo/theme-provider"
import type React from "react"
import type { Metadata } from "next"
import "./demo.css"

export const metadata: Metadata = {
  title: "Demo - Syzio",
  description: "Interactive demo of Syzio Atlas, project management platform. Explore all features freely.",
  robots: "noindex, nofollow",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoThemeProvider>
      {children}
    </DemoThemeProvider>
  )
}
