import type { Issue, User, Team, Sprint, Comment, Activity, AutomationRule } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Jan Kowalski",
    email: "jan@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Developer",
  },
  {
    id: "2",
    name: "Anna Nowak",
    email: "anna@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Designer",
  },
  {
    id: "3",
    name: "Piotr Wiśniewski",
    email: "piotr@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "QA Engineer",
  },
  {
    id: "4",
    name: "Maria Kowalczyk",
    email: "maria@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Product Manager",
  },
  {
    id: "5",
    name: "Tomasz Kamiński",
    email: "tomasz@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Developer",
  },
]

export const mockTeams: Team[] = [
  { id: "team-1", name: "Frontend", members: [mockUsers[0], mockUsers[1]], velocity: 42 },
  { id: "team-2", name: "Backend", members: [mockUsers[4]], velocity: 38 },
  { id: "team-3", name: "Core Team", members: [mockUsers[2], mockUsers[3]], velocity: 35 },
]

export const mockSprints: Sprint[] = [
  { id: "sprint-1", name: "Sprint 1", startDate: "2025-01-01", endDate: "2025-01-14", status: "completed" },
  {
    id: "sprint-2",
    name: "Sprint 2",
    startDate: "2025-01-15",
    endDate: "2025-01-28",
    status: "active",
    goal: "Complete user authentication and dashboard",
  },
  { id: "sprint-3", name: "Sprint 3", startDate: "2025-01-29", endDate: "2025-02-11", status: "planned" },
]

export const mockIssues: Issue[] = [
  {
    id: "TASK-123",
    title: "Implement user authentication",
    description: "Add OAuth2 authentication with Google and GitHub providers",
    status: "in-progress",
    priority: "P0",
    type: "feature",
    assignee: mockUsers[0],
    reporter: mockUsers[3],
    sprint: mockSprints[1],
    storyPoints: 8,
    labels: ["auth", "security"],
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
    teamId: "team-1",
  },
  {
    id: "TASK-124",
    title: "Fix navigation menu on mobile",
    description: "The hamburger menu is not closing properly on iOS devices",
    status: "todo",
    priority: "P1",
    type: "bug",
    assignee: mockUsers[1],
    reporter: mockUsers[2],
    sprint: mockSprints[1],
    storyPoints: 3,
    labels: ["ui", "mobile"],
    createdAt: "2025-01-16T09:00:00Z",
    updatedAt: "2025-01-16T09:00:00Z",
    teamId: "team-1",
  },
  {
    id: "TASK-125",
    title: "Optimize database queries",
    description: "Improve performance of dashboard data loading",
    status: "in-review",
    priority: "P1",
    type: "improvement",
    assignee: mockUsers[4],
    reporter: mockUsers[3],
    sprint: mockSprints[1],
    storyPoints: 5,
    labels: ["performance", "backend"],
    createdAt: "2025-01-17T11:00:00Z",
    updatedAt: "2025-01-22T16:00:00Z",
    teamId: "team-2",
  },
  {
    id: "TASK-126",
    title: "Design new landing page",
    description: "Create mockups for the new marketing landing page",
    status: "done",
    priority: "P2",
    type: "task",
    assignee: mockUsers[1],
    reporter: mockUsers[3],
    sprint: mockSprints[1],
    storyPoints: 5,
    labels: ["design"],
    createdAt: "2025-01-14T08:00:00Z",
    updatedAt: "2025-01-19T17:00:00Z",
    teamId: "team-1",
  },
  {
    id: "TASK-127",
    title: "API rate limiting",
    description: "Implement rate limiting for public API endpoints",
    status: "blocked",
    priority: "P0",
    type: "feature",
    assignee: mockUsers[4],
    reporter: mockUsers[3],
    sprint: mockSprints[1],
    storyPoints: 8,
    labels: ["api", "security"],
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-23T12:00:00Z",
    teamId: "team-2",
  },
]

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    issueId: "TASK-123",
    author: mockUsers[0],
    content: "Started working on the OAuth integration. Google provider is almost done.",
    createdAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "comment-2",
    issueId: "TASK-123",
    author: mockUsers[3],
    content: "Great progress! Make sure to add proper error handling.",
    createdAt: "2025-01-20T15:00:00Z",
  },
]

export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    type: "issue_created",
    user: mockUsers[3],
    issueId: "TASK-127",
    description: "created issue TASK-127",
    timestamp: "2025-01-18T10:00:00Z",
  },
  {
    id: "activity-2",
    type: "status_changed",
    user: mockUsers[0],
    issueId: "TASK-123",
    description: 'changed status of TASK-123 from "todo" to "in-progress"',
    timestamp: "2025-01-20T09:00:00Z",
  },
  {
    id: "activity-3",
    type: "comment_added",
    user: mockUsers[0],
    issueId: "TASK-123",
    description: "added a comment to TASK-123",
    timestamp: "2025-01-20T14:30:00Z",
  },
]

export const mockAutomationRules: AutomationRule[] = [
  {
    id: "rule-1",
    name: "Auto-assign P0 bugs to QA Lead",
    description: "Automatically assign all P0 priority bugs to the QA Lead",
    enabled: true,
    trigger: {
      event: "issue_created",
      conditions: [
        { field: "priority", operator: "equals", value: "P0" },
        { field: "type", operator: "equals", value: "bug" },
      ],
    },
    actions: [
      { type: "assign", params: { userId: "3" } },
      { type: "notify", params: { channel: "slack", message: "New P0 bug assigned" } },
    ],
    createdAt: "2025-01-10T10:00:00Z",
    lastRun: "2025-01-23T12:00:00Z",
  },
]
