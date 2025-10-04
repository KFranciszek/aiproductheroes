"use client"

import { Button } from "@/components/ui/button"
import { Plus, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { IssueForm } from "./issue-form"
import { KeyboardShortcutsHelp } from "./keyboard-shortcuts-help"
import { TemplateSelector } from "./template-selector"
import { useState } from "react"
import type { ViewType, Issue, Sprint, TaskTemplate } from "@/types"

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  issues: Issue[]
  sprints: Sprint[]
  templates: TaskTemplate[]
  onCreateIssue: (issueData: Partial<Issue>) => void
  onTemplateSelect: (template: TaskTemplate) => void
  selectedTemplate: TaskTemplate | null
}

export function Navigation({
  currentView,
  onViewChange,
  issues,
  sprints,
  templates,
  onCreateIssue,
  onTemplateSelect,
  selectedTemplate
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const activeSprint = sprints.find((sprint) => sprint.status === "Active")
  const activeSprintIssues = issues.filter((issue) => issue.sprintId === activeSprint?.id)

  const navItems = [
    {
      id: "dashboard" as ViewType,
      label: "Dashboard",
      active: currentView === "dashboard",
    },
    {
      id: "current-sprint" as ViewType,
      label: "Current Sprint",
      active: currentView === "current-sprint",
    },
    {
      id: "issues" as ViewType,
      label: "Issues",
      active: currentView === "issues",
    },
    {
      id: "favorites" as ViewType,
      label: "Favorites",
      active: currentView === "favorites",
    },
    {
      id: "sprints" as ViewType,
      label: "Sprints",
      active: currentView === "sprints",
    },
    {
      id: "reports" as ViewType,
      label: "Reports",
      active: currentView === "reports",
    },
    {
      id: "activity" as ViewType,
      label: "Activity",
      active: currentView === "activity",
    },
  ]

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-light dark:border-border-dark px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            <circle cx="8" cy="8" r="1" fill="#22c55e"/>
            <circle cx="16" cy="8" r="1" fill="#22c55e"/>
            <circle cx="12" cy="12" r="1" fill="#22c55e"/>
            <path d="M8 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" fill="none"/>
          </svg>
          <h1 className="text-xl font-bold">BrainTask</h1>
        </div>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "text-sm font-medium transition-colors",
                item.active 
                  ? "text-foreground-light dark:text-foreground-dark" 
                  : "text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <TemplateSelector
          templates={templates}
          onSelect={onTemplateSelect}
        />
        <KeyboardShortcutsHelp
          shortcuts={[
            { key: 'n', ctrl: true, description: 'Nowe zadanie' },
            { key: 'f', ctrl: true, description: 'Przejdź do zadań' },
            { key: 's', ctrl: true, description: 'Przejdź do sprintów' },
            { key: 'r', ctrl: true, description: 'Przejdź do raportów' },
            { key: '1', alt: true, description: 'Bieżący sprint' },
            { key: '2', alt: true, description: 'Zadania' },
            { key: '3', alt: true, description: 'Ulubione' },
            { key: '4', alt: true, description: 'Sprinty' },
            { key: '5', alt: true, description: 'Raporty' },
            { key: '6', alt: true, description: 'Aktywność' }
          ]}
        />
        <IssueForm
          sprints={sprints}
          onSubmit={onCreateIssue}
          trigger={
            <Button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
              <Plus className="h-5 w-5" />
              <span>New Task</span>
            </Button>
          }
        />
        <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZ3mp4fJA4ACTLlujOEomAklJD1C4F7wHqYnuc9EyLmmM2LLX5m9CA8HEEu_USv4GeA0bwsXlxoxq5l-jLhCwJhVxktyDj6i7UUbQlxpd2flzx9HCSHOr8y4V7PsBZBf99cUfyM_WGNpzkXRFksZHXCnNtLelekaOdVUjeCjn9NaNo4DpxdZ5GKup_8m34mWiGqvNjNKzTnHrYz97UuCtOZLNkhYammJX9wyWIKFDvAwq5Kr0YD0uQL3wQ2m0k8oQS79QdOCTXZGNL")'}}></div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={cn(
                  "text-left px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  item.active 
                    ? "text-foreground-light dark:text-foreground-dark bg-accent" 
                    : "text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark hover:bg-accent"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}