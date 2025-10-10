"use client"

import * as React from "react"
import { mockIssues, mockSprints, mockUsers, mockTeams, mockComments, mockAutomationRules } from "@/lib/demo3/mock-data"
import type { Issue, Sprint, Team, Comment, User, Status, Priority, AutomationRule } from "@/lib/demo3/types"
import { nanoid } from "nanoid"

interface DataContextProps {
  issues: Issue[]
  sprints: Sprint[]
  teams: Team[]
  users: User[]
  comments: Comment[]
  automationRules: AutomationRule[]
  createIssue: (issueData: Omit<Issue, "id" | "key" | "createdAt" | "updatedAt">) => void
  updateIssue: (issueId: string, issueData: Partial<Issue>) => void
  deleteIssue: (issueId: string) => void
  addComment: (issueId: string, content: string) => void
  createSprint: (sprintData: Omit<Sprint, "id" | "createdAt" | "updatedAt" | "status">) => void
  updateSprint: (sprintId: string, sprintData: Partial<Sprint>) => void
  startSprint: (sprintId: string) => void
  endSprint: (sprintId: string, moveIncompleteTo: "backlog" | "new_sprint") => void
  createTeam: (teamData: Omit<Team, "id">) => void
  updateTeam: (teamId: string, teamData: Partial<Team>) => void
  toggleFavorite: (issueId: string) => void
  exportData: () => string
  importData: (json: string) => void
}

const DataContext = React.createContext<DataContextProps | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = React.useState<Issue[]>(mockIssues)
  const [sprints, setSprints] = React.useState<Sprint[]>(mockSprints)
  const [teams, setTeams] = React.useState<Team[]>(mockTeams)
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [comments, setComments] = React.useState<Comment[]>(mockComments)
  const [automationRules, setAutomationRules] = React.useState<AutomationRule[]>(mockAutomationRules)

  // --- Issues ---
  const createIssue = (issueData: Omit<Issue, "id" | "key" | "createdAt" | "updatedAt">) => {
    const newKey = `SYZ-${Math.floor(Math.random() * 900) + 100}`
    const newIssue: Issue = {
      id: nanoid(),
      key: newKey,
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setIssues((prev) => [newIssue, ...prev])
  }

  const updateIssue = (issueId: string, issueData: Partial<Issue>) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, ...issueData, updatedAt: new Date().toISOString() } : issue
      )
    )
  }

  const deleteIssue = (issueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId))
  }

  // --- Comments ---
  const addComment = (issueId: string, content: string) => {
    const newComment: Comment = {
      id: nanoid(),
      issueId,
      userId: "user-1", // Placeholder for current user
      content,
      createdAt: new Date().toISOString(),
    }
    setComments((prev) => [newComment, ...prev])
  }

  // --- Sprints ---
  const createSprint = (sprintData: Omit<Sprint, "id" | "createdAt" | "updatedAt" | "status">) => {
    const newSprint: Sprint = {
      id: nanoid(),
      status: "planned",
      ...sprintData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSprints((prev) => [newSprint, ...prev])
  }

  const updateSprint = (sprintId: string, sprintData: Partial<Sprint>) => {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.id === sprintId ? { ...sprint, ...sprintData, updatedAt: new Date().toISOString() } : sprint
      )
    )
  }
  
  const startSprint = (sprintId: string) => {
    // Ensure only one sprint is active at a time
    setSprints((prev) =>
      prev.map((sprint) => {
        if (sprint.id === sprintId) return { ...sprint, status: "active" as const, updatedAt: new Date().toISOString() }
        if (sprint.status === "active") return { ...sprint, status: "planned" as const, updatedAt: new Date().toISOString() }
        return sprint
      })
    )
  }

  const endSprint = (sprintId: string, moveIncompleteTo: "backlog" | "new_sprint") => {
    const sprintToEnd = sprints.find(s => s.id === sprintId)
    if (!sprintToEnd) return

    const incompleteIssues = issues.filter(i => i.sprintId === sprintId && i.status !== "done")

    // Move incomplete issues
    if (moveIncompleteTo === "backlog") {
      setIssues(prev => prev.map(i => incompleteIssues.some(inc => inc.id === i.id) ? { ...i, sprintId: undefined } : i))
    }
    // "new_sprint" logic would be more complex, skipping for now.

    // Mark sprint as completed
    updateSprint(sprintId, { status: "completed" })
  }

  // --- Teams ---
  const createTeam = (teamData: Omit<Team, "id">) => {
    const newTeam: Team = {
      id: nanoid(),
      ...teamData,
    }
    setTeams((prev) => [newTeam, ...prev])
  }

  const updateTeam = (teamId: string, teamData: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, ...teamData } : team
      )
    )
  }

  // --- Favorites ---
  const toggleFavorite = (issueId: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, favorite: !issue.favorite } : issue
      )
    )
  }
  
  // --- Data Management ---
  const exportData = () => {
    const data = { issues, sprints, teams, users, comments }
    return JSON.stringify(data, null, 2)
  }

  const importData = (json: string) => {
    try {
      const data = JSON.parse(json)
      if (data.issues) setIssues(data.issues)
      if (data.sprints) setSprints(data.sprints)
      if (data.teams) setTeams(data.teams)
      if (data.users) setUsers(data.users)
      if (data.comments) setComments(data.comments)
    } catch (error) {
      console.error("Failed to import data:", error)
      // Here you might want to show a toast to the user
    }
  }

  const value = {
    issues,
    sprints,
    teams,
    users,
    comments,
    automationRules,
    createIssue,
    updateIssue,
    deleteIssue,
    addComment,
    createSprint,
    updateSprint,
    startSprint,
    endSprint,
    createTeam,
    updateTeam,
    toggleFavorite,
    exportData,
    importData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = React.useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
