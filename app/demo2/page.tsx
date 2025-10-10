"use client"

import { useState } from "react"
import Link from "next/link"
import { SidebarNavigation } from "@/components/demo2/sidebar-navigation"
import { CommandPalette } from "@/components/demo2/command-palette"
import { PersonalDashboard } from "@/components/demo2/personal-dashboard"
import { IssuesList } from "@/components/demo2/issues-list"
import { CurrentSprintView } from "@/components/demo2/current-sprint-view"
import { SprintsView } from "@/components/demo2/sprints-view"
import { TeamsView } from "@/components/demo2/teams-view"
import { ReportsView } from "@/components/demo2/reports-view"
import { ActivityView } from "@/components/demo2/activity-view"
import { AIAutomationView } from "@/components/demo2/ai-automation-view"
import { SettingsView } from "@/components/demo2/settings-view"
import { IssueDetailView } from "@/components/demo2/issue-detail-view"
import { mockData } from "@/lib/demo2/mock-data"
import { cn } from "@/lib/utils"
import type { ViewType, Issue } from "@/types/demo2"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Demo2ThemeProvider } from "@/components/demo2/theme-provider"

export default function Demo2() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [issues, setIssues] = useState(mockData.issues)
  const [sprints, setSprints] = useState(mockData.sprints)
  const [teams, setTeams] = useState(mockData.teams)
  const [activities, setActivities] = useState(mockData.activityLogs)

  const handleViewIssueDetails = (issueId: string) => {
    setSelectedIssueId(issueId)
  }

  const handleBackFromDetails = () => {
    setSelectedIssueId(null)
  }

  const handleEditIssue = (updatedIssue: Issue) => {
    setIssues(issues.map(issue => 
      issue.id === updatedIssue.id ? { ...updatedIssue, updatedAt: new Date() } : issue
    ))
    toast.success("Zadanie zostało zaktualizowane", {
      description: `${updatedIssue.key}: ${updatedIssue.title}`
    })
  }

  const handleDeleteIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId)
    setIssues(issues.filter(issue => issue.id !== issueId))
    setSelectedIssueId(null)
    toast.success("Zadanie zostało usunięte", {
      description: issue ? `${issue.key}: ${issue.title}` : "Zadanie"
    })
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <PersonalDashboard 
            issues={issues} 
            sprints={sprints}
            onNavigate={setCurrentView}
            onViewIssue={handleViewIssueDetails}
          />
        )
      case "issues":
        return (
          <IssuesList 
            issues={issues} 
            sprints={sprints}
            onUpdateIssues={setIssues}
            onViewDetails={handleViewIssueDetails}
          />
        )
      case "current-sprint":
        return (
          <CurrentSprintView 
            issues={issues}
            sprints={sprints}
            onUpdateIssues={setIssues}
            onViewDetails={handleViewIssueDetails}
          />
        )
      case "sprints":
        return (
          <SprintsView 
            sprints={sprints}
            issues={issues}
            onUpdateSprints={setSprints}
            onUpdateIssues={setIssues}
            onViewIssue={handleViewIssueDetails}
          />
        )
      case "teams":
        return (
          <TeamsView
            teams={teams}
            users={mockData.users}
            issues={issues}
            sprints={sprints}
            onUpdateTeams={setTeams}
          />
        )
      case "reports":
        return (
          <ReportsView 
            issues={issues}
            sprints={sprints}
          />
        )
      case "activity":
        return (
          <ActivityView 
            activities={activities}
            users={mockData.users}
          />
        )
      case "ai-automation":
        return (
          <AIAutomationView />
        )
      case "settings":
        return (
          <SettingsView />
        )
      default:
        return (
          <PersonalDashboard 
            issues={issues} 
            sprints={sprints}
            onNavigate={setCurrentView}
            onViewIssue={handleViewIssueDetails}
          />
        )
    }
  }

  return (
    <Demo2ThemeProvider>
      <div className="flex flex-col h-screen">
        {/* Demo Mode Banner */}
        <div className="demo2-btn-primary px-4 py-2 text-sm flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="font-medium">Demo2 Mode</span>
            <span className="opacity-80">"Precyzja i Przewidywanie" Design System</span>
          </div>
          <Link href="/demo-selector" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
            ← Powrót do wyboru demo
          </Link>
        </div>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        <CommandPalette
          issues={issues}
          sprints={sprints}
          onNavigate={setCurrentView}
          onOpenIssue={handleViewIssueDetails}
        />
        
        <SidebarNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
          issues={issues}
        />
        
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className={cn(
            "transition-all duration-300 overflow-auto",
            selectedIssueId ? "w-3/5" : "w-full"
          )}>
           <div className="sticky top-0 z-10 demo2-surface demo2-border border-b px-6 py-4" style={{backgroundColor: 'var(--demo2-surface)', backdropFilter: 'blur(8px)'}}>
             <h1 className="text-2xl font-semibold">
               {currentView === "dashboard" ? "Dashboard" :
                currentView === "issues" ? "Issues" :
                currentView === "current-sprint" ? "Current Sprint" :
                currentView === "sprints" ? "Sprints" :
                currentView === "teams" ? "Teams" :
                currentView === "reports" ? "Reports" :
                currentView === "activity" ? "Activity" :
                currentView === "ai-automation" ? "AI Automation" :
                currentView === "settings" ? "Settings" : "Dashboard"}
             </h1>
           </div>
            
            <div className="p-6">
              {renderCurrentView()}
            </div>
          </div>

          {/* Right Drawer - Issue Detail View */}
          {selectedIssueId && (() => {
            const issue = issues.find(i => i.id === selectedIssueId)
            if (!issue) {
              setSelectedIssueId(null)
              return null
            }

            return (
              <IssueDetailView
                issue={issue}
                sprints={sprints}
                allIssues={issues}
                activities={activities}
                open={!!selectedIssueId}
                onOpenChange={(open) => !open && setSelectedIssueId(null)}
                onEdit={handleEditIssue}
                onDelete={handleDeleteIssue}
              />
            )
          })()}
        </div>
       </div>
       <Toaster />
      </div>
    </Demo2ThemeProvider>
   )
 }

