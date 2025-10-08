import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: {
    default: "Syzio - Perfect Team Alignment",
    template: "%s | Syzio"
  },
  description: "When teams, tasks, and tools align perfectly. Stop juggling 6 tools. Achieve syzio.",
  keywords: ["project management", "team collaboration", "task management", "agile", "scrum", "kanban", "sprints"],
  authors: [{ name: "Syzio Team" }],
  generator: "v0.app",
  openGraph: {
    title: "Syzio - Perfect Team Alignment",
    description: "When teams, tasks, and tools align perfectly",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head></head>
      <body className="font-display bg-background text-foreground">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
