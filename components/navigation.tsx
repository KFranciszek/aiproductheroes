"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { IssueForm } from "./issue-form"
import type { ViewType, Issue, Sprint } from "@/types"

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  issues: Issue[]
  sprints: Sprint[]
  onCreateIssue: (issueData: Partial<Issue>) => void
}

export function Navigation({ currentView, onViewChange, issues, sprints, onCreateIssue }: NavigationProps) {
  const activeSprint = sprints.find((sprint) => sprint.status === "Active")
  const activeSprintIssues = issues.filter((issue) => issue.sprintId === activeSprint?.id)

  const navItems = [
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
      id: "sprints" as ViewType,
      label: "Sprints",
      active: currentView === "sprints",
    },
    {
      id: "reports" as ViewType,
      label: "Reports",
      active: currentView === "reports",
    },
  ]

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-light dark:border-border-dark px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4.5 7.8L12 12.2L19.5 7.8L12 3.4L4.5 7.8Z"></path>
          </svg>
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>
        
        <nav className="flex items-center gap-4">
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
    </header>
  )
}