import type { Issue, Sprint, User, Team, ActivityLog } from "@/types/demo2"

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Anna Kowalska",
    email: "anna@example.com",
    role: "admin",
    avatarUrl: "/demo/avatar-1.jpg"
  },
  {
    id: "user-2", 
    name: "Michał Nowak",
    email: "michal@example.com",
    role: "member",
    avatarUrl: "/demo/avatar-2.jpg"
  },
  {
    id: "user-3",
    name: "Katarzyna Wiśniewska", 
    email: "kasia@example.com",
    role: "member",
    avatarUrl: "/demo/avatar-3.jpg"
  },
  {
    id: "user-4",
    name: "Tomasz Lewandowski",
    email: "tomasz@example.com", 
    role: "viewer"
  }
]

export const mockSprints: Sprint[] = [
  {
    id: "sprint-1",
    name: "Sprint 2024.10 - Authentication Redesign",
    goal: "Przeprojektowanie systemu uwierzytelniania użytkowników",
    status: "active",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-14"),
    createdAt: new Date("2024-09-25"),
    updatedAt: new Date("2024-10-01")
  },
  {
    id: "sprint-2", 
    name: "Sprint 2024.11 - Dashboard Improvements",
    goal: "Ulepszenia dashboardu i raportowania",
    status: "planned",
    startDate: new Date("2024-10-15"),
    endDate: new Date("2024-10-28"),
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05")
  },
  {
    id: "sprint-3",
    name: "Sprint 2024.09 - Mobile Optimization", 
    goal: "Optymalizacja aplikacji mobilnej",
    status: "completed",
    startDate: new Date("2024-09-15"),
    endDate: new Date("2024-09-28"),
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-09-28")
  }
]

export const mockIssues: Issue[] = [
  {
    id: "issue-1",
    key: "TASK-001",
    title: "Implementacja nowego systemu logowania",
    description: "Przeprojektowanie interfejsu logowania z uwzględnieniem 2FA",
    priority: "P1",
    status: "in_progress",
    assignee: "Anna Kowalska",
    sprintId: "sprint-1",
    storyPoints: 8,
    labels: ["frontend", "security"],
    isFavorite: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-08"),
    dueAt: new Date("2024-10-12")
  },
  {
    id: "issue-2",
    key: "TASK-002", 
    title: "Optymalizacja wydajności dashboardu",
    description: "Poprawa czasu ładowania głównego dashboardu",
    priority: "P2",
    status: "todo",
    assignee: "Michał Nowak",
    sprintId: "sprint-1",
    storyPoints: 5,
    labels: ["performance", "frontend"],
    isFavorite: false,
    createdAt: new Date("2024-10-02"),
    updatedAt: new Date("2024-10-02")
  },
  {
    id: "issue-3",
    key: "TASK-003",
    title: "Dodanie dark mode",
    description: "Implementacja trybu ciemnego w całej aplikacji",
    priority: "P3", 
    status: "in_review",
    assignee: "Katarzyna Wiśniewska",
    sprintId: "sprint-1",
    storyPoints: 3,
    labels: ["ui", "theme"],
    isFavorite: false,
    createdAt: new Date("2024-10-03"),
    updatedAt: new Date("2024-10-07")
  },
  {
    id: "issue-4",
    key: "TASK-004",
    title: "Naprawa błędu w eksporcie raportów",
    description: "Błąd podczas eksportowania raportów do PDF",
    priority: "P0",
    status: "blocked",
    assignee: "Tomasz Lewandowski",
    storyPoints: 2,
    labels: ["bug", "reports"],
    isFavorite: true,
    createdAt: new Date("2024-10-04"),
    updatedAt: new Date("2024-10-06")
  },
  {
    id: "issue-5",
    key: "TASK-005",
    title: "Dokumentacja API v2",
    description: "Aktualizacja dokumentacji dla nowej wersji API",
    priority: "P2",
    status: "done",
    assignee: "Anna Kowalska",
    sprintId: "sprint-3",
    storyPoints: 4,
    labels: ["documentation", "api"],
    isFavorite: false,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-25")
  }
]

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Frontend Team",
    description: "Zespół odpowiedzialny za interfejs użytkownika",
    memberIds: ["user-1", "user-3"],
    leadId: "user-1",
    color: "#3b82f6"
  },
  {
    id: "team-2",
    name: "Backend Team", 
    description: "Zespół odpowiedzialny za logikę biznesową",
    memberIds: ["user-2", "user-4"],
    leadId: "user-2",
    color: "#8b5cf6"
  }
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "activity-1",
    userId: "user-1",
    action: "created_issue",
    targetType: "issue",
    targetId: "issue-1",
    newValue: "TASK-001",
    timestamp: new Date("2024-10-01T09:00:00")
  },
  {
    id: "activity-2",
    userId: "user-1", 
    action: "status_changed",
    targetType: "issue",
    targetId: "issue-1",
    oldValue: "todo",
    newValue: "in_progress",
    timestamp: new Date("2024-10-01T14:30:00")
  },
  {
    id: "activity-3",
    userId: "user-3",
    action: "status_changed", 
    targetType: "issue",
    targetId: "issue-3",
    oldValue: "in_progress",
    newValue: "in_review",
    timestamp: new Date("2024-10-07T11:15:00")
  }
]

export const mockData = {
  users: mockUsers,
  issues: mockIssues,
  sprints: mockSprints,
  teams: mockTeams,
  activityLogs: mockActivityLogs
}

