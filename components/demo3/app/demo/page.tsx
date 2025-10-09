"use client"

import { useState } from "react"

import dynamic from "next/dynamic"
import type { Issue } from "@/lib/types"

const SidebarNavigation = dynamic(
  () => import("@/components/demo/sidebar-navigation").then((mod) => ({ default: mod.SidebarNavigation })),
  { ssr: false },
)
const PersonalDashboard = dynamic(
  () => import("@/components/demo/personal-dashboard").then((mod) => ({ default: mod.PersonalDashboard })),
  { ssr: false },
)
const IssuesList = dynamic(() => import("@/components/demo/issues-list").then((mod) => ({ default: mod.IssuesList })), {
  ssr: false,
})
const CurrentSprintView = dynamic(
  () => import("@/components/demo/current-sprint-view").then((mod) => ({ default: mod.CurrentSprintView })),
  { ssr: false },
)
const SprintsView = dynamic(
  () => import("@/components/demo/sprints-view").then((mod) => ({ default: mod.SprintsView })),
  { ssr: false },
)
const TeamsView = dynamic(() => import("@/components/demo/teams-view").then((mod) => ({ default: mod.TeamsView })), {
  ssr: false,
})
const ReportsView = dynamic(
  () => import("@/components/demo/reports-view").then((mod) => ({ default: mod.ReportsView })),
  { ssr: false },
)
const ActivityView = dynamic(
  () => import("@/components/demo/activity-view").then((mod) => ({ default: mod.ActivityView })),
  { ssr: false },
)
const AIAutomationView = dynamic(
  () => import("@/components/demo/ai-automation-view").then((mod) => ({ default: mod.AIAutomationView })),
  { ssr: false },
)
const SettingsView = dynamic(
  () => import("@/components/demo/settings-view").then((mod) => ({ default: mod.SettingsView })),
  { ssr: false },
)
const CommandPalette = dynamic(
  () => import("@/components/demo/command-palette").then((mod) => ({ default: mod.CommandPalette })),
  { ssr: false },
)
const IssueDetailView = dynamic(
  () => import("@/components/demo/issue-detail-view").then((mod) => ({ default: mod.IssueDetailView })),
  { ssr: false },
)

type View =
  | "dashboard"
  | "issues"
  | "current-sprint"
  | "sprints"
  | "teams"
  | "reports"
  | "activity"
  | "automation"
  | "settings"

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <PersonalDashboard onNavigate={setCurrentView} onIssueClick={setSelectedIssue} />
      case "issues":
        return <IssuesList onIssueClick={setSelectedIssue} />
      case "current-sprint":
        return <CurrentSprintView onIssueClick={setSelectedIssue} />
      case "sprints":
        return <SprintsView />
      case "teams":
        return <TeamsView />
      case "reports":
        return <ReportsView />
      case "activity":
        return <ActivityView onIssueClick={setSelectedIssue} />
      case "automation":
        return <AIAutomationView />
      case "settings":
        return <SettingsView />
      default:
        return <PersonalDashboard onNavigate={setCurrentView} onIssueClick={setSelectedIssue} />
    }
  }

  return (
    <>
      <CommandPalette onNavigate={setCurrentView} onIssueSelect={setSelectedIssue} />
      <div className="flex h-[calc(100vh-2rem)]">
        <SidebarNavigation
          currentView={currentView}
          onNavigate={setCurrentView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 overflow-auto transition-all ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          {renderView()}
        </main>
        {selectedIssue && <IssueDetailView issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
      </div>
    </>
  )
}
