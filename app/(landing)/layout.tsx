import { LandingThemeProvider } from "@/components/landing/theme-provider"
import type React from "react"
import type { Metadata } from "next"
import "./landing.css"

export const metadata: Metadata = {
  title: "Syzio - Perfect Team Alignment",
  description: "When teams, tasks, and tools align perfectly. Stop juggling 6 tools. Achieve syzio.",
  keywords: ["project management", "team collaboration", "task management", "agile", "scrum"],
  authors: [{ name: "Syzio Team" }],
  openGraph: {
    title: "Syzio - Perfect Team Alignment",
    description: "When teams, tasks, and tools align perfectly",
    type: "website",
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('landing-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <LandingThemeProvider>
        {children}
      </LandingThemeProvider>
    </>
  )
}
