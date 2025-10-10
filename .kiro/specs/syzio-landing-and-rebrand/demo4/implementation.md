# MASTER PROMPT: Kompleksowa Aplikacja TaskFlow - Full-Stack Implementation

Stwórz zaawansowaną aplikację do zarządzania projektami **TaskFlow (FlowCraft)** jako single-page application z pełnym Frontend i Backend. Aplikacja musi być production-ready z wszystkimi funkcjonalnościami opisanymi poniżej.

---

## 🎯 WIZJA I CELE PRODUKTU

### Problem Statement
Aplikacja rozwiązuje kluczowe problemy team leadów i project managerów:
- **Niezawodne automatyzacje** - 95% automatyzacji zawodzi bez ostrzeżenia
- **Rozproszenie informacji** - średnio 5-6 narzędzi do sprawdzenia codziennie (30 min overhead)
- **Ręczne raportowanie** - 2h każdego piątku na przygotowanie raportów
- **Brak widoczności cross-team** - opóźnienia w wykrywaniu blockerów
- **Chaos w planowaniu** - 3h planning + 2h post-processing w Jirze

### Unique Value Proposition
1. **Automation Health Monitoring** - real-time alerts gdy automatyzacja przestaje działać
2. **Unified Dashboard** - jeden widok na wszystkie zespoły i zależności
3. **One-Click Reports** - automatyczne generowanie raportów dla stakeholderów
4. **Smart Sprint Planning** - AI-powered sugestie i walidacje
5. **Git Integration Done Right** - dwukierunkowa sync odporna na zmiany naming

---

## 📐 ARCHITEKTURA TECHNICZNA

### Tech Stack

#### Frontend
```typescript
// Core
- React 18.3+ with TypeScript 5.0+
- Vite 5.0+ (build tool)
- React Router 6.20+ (routing)

// State Management
- Zustand 4.4+ (global state)
- React Query 5.0+ (server state & caching)
- Immer (immutable updates)

// UI Framework
- Tailwind CSS 3.4+
- shadcn/ui components
- Radix UI primitives
- Lucide React (icons)

// Forms & Validation
- React Hook Form 7.48+
- Zod (schema validation)

// Drag & Drop
- @dnd-kit/core + @dnd-kit/sortable

// Charts & Visualizations
- Recharts 2.10+
- D3.js 7.8+ (custom visualizations)

// Date Handling
- date-fns 3.0+

// Utilities
- clsx + tailwind-merge (className utilities)
- lodash-es (utility functions)
```

#### Backend (opcjonalnie - dla pełnej implementacji)
```typescript
// Runtime
- Node.js 20+ with TypeScript

// Framework
- Express.js 4.18+ OR Fastify 4.24+

// Database
- PostgreSQL 16+ (primary database)
- Redis 7+ (caching, real-time features)

// ORM
- Prisma 5.7+ (type-safe database client)

// Authentication
- JWT tokens
- bcrypt (password hashing)

// WebSockets
- Socket.io 4.6+ (real-time updates)

// File Storage
- AWS S3 / Cloudflare R2 (attachments)

// Task Queue
- BullMQ + Redis (background jobs, automation runs)

// Logging & Monitoring
- Winston (logging)
- Sentry (error tracking)
```

### Struktura Projektu

```
taskflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   ├── layouts/         # Layout components
│   │   │   ├── features/        # Feature-specific components
│   │   │   │   ├── issues/
│   │   │   │   ├── sprints/
│   │   │   │   ├── kanban/
│   │   │   │   ├── reports/
│   │   │   │   ├── automation/
│   │   │   │   ├── teams/
│   │   │   │   └── settings/
│   │   │   └── shared/          # Reusable components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & helpers
│   │   ├── stores/              # Zustand stores
│   │   ├── api/                 # API client & queries
│   │   ├── types/               # TypeScript types
│   │   ├── styles/              # Global styles & design tokens
│   │   ├── constants/           # Constants & config
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # Prisma schema
│   │   ├── middleware/          # Express middleware
│   │   ├── utils/               # Utilities
│   │   ├── jobs/                # Background jobs
│   │   ├── websockets/          # Socket.io handlers
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── README.md
```

---

## 🗄️ MODELE DANYCH (Database Schema)

### Prisma Schema

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatar        String?
  role          UserRole  @default(MEMBER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  assignedIssues     Issue[]        @relation("AssignedTo")
  createdIssues      Issue[]        @relation("CreatedBy")
  comments           Comment[]
  teamMemberships    TeamMember[]
  automationRuns     AutomationRun[]
  
  @@map("users")
}

enum UserRole {
  ADMIN
  TEAM_LEAD
  MEMBER
  GUEST
}

model Team {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String   @default("#2D5BFF")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  members     TeamMember[]
  sprints     Sprint[]
  
  @@map("teams")
}

model TeamMember {
  id        String   @id @default(cuid())
  userId    String
  teamId    String
  role      TeamRole @default(MEMBER)
  joinedAt  DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  @@unique([userId, teamId])
  @@map("team_members")
}

enum TeamRole {
  LEAD
  MEMBER
}

model Sprint {
  id          String        @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  status      SprintStatus  @default(PLANNED)
  goal        String?
  teamId      String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  team        Team?         @relation(fields: [teamId], references: [id])
  issues      Issue[]
  
  @@map("sprints")
}

enum SprintStatus {
  PLANNED
  ACTIVE
  COMPLETED
}

model Issue {
  id            String        @id @default(cuid())
  identifier    String        @unique  // TSK-001, TSK-002, etc.
  title         String
  description   String?       @db.Text
  priority      Priority      @default(P3)
  status        IssueStatus   @default(TODO)
  storyPoints   Int?
  sprintId      String?
  assigneeId    String
  createdById   String
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Git Integration
  gitBranch     String?
  gitPRUrl      String?
  gitMergedAt   DateTime?
  
  // Relations
  sprint        Sprint?       @relation(fields: [sprintId], references: [id])
  assignee      User          @relation("AssignedTo", fields: [assigneeId], references: [id])
  createdBy     User          @relation("CreatedBy", fields: [createdById], references: [id])
  comments      Comment[]
  dependencies  IssueDependency[] @relation("BlockingIssue")
  blockedBy     IssueDependency[] @relation("BlockedIssue")
  activityLog   IssueActivity[]
  
  @@index([sprintId])
  @@index([assigneeId])
  @@index([status])
  @@index([priority])
  @@map("issues")
}

enum Priority {
  P0  // Critical
  P1  // High
  P2  // Medium
  P3  // Normal (default)
  P4  // Low
  P5  // Lowest
}

enum IssueStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  BLOCKED
  DONE
}

model IssueDependency {
  id              String   @id @default(cuid())
  blockingIssueId String
  blockedIssueId  String
  createdAt       DateTime @default(now())
  
  blockingIssue   Issue    @relation("BlockingIssue", fields: [blockingIssueId], references: [id], onDelete: Cascade)
  blockedIssue    Issue    @relation("BlockedIssue", fields: [blockedIssueId], references: [id], onDelete: Cascade)
  
  @@unique([blockingIssueId, blockedIssueId])
  @@map("issue_dependencies")
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  issueId   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  issue     Issue    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id])
  
  @@index([issueId])
  @@map("comments")
}

model IssueActivity {
  id          String   @id @default(cuid())
  issueId     String
  userId      String?
  action      String   // "created", "updated", "status_changed", "assigned", etc.
  field       String?  // field that changed
  oldValue    String?
  newValue    String?
  timestamp   DateTime @default(now())
  
  issue       Issue    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  
  @@index([issueId])
  @@index([timestamp])
  @@map("issue_activity")
}

// AUTOMATION SYSTEM

model AutomationRule {
  id          String            @id @default(cuid())
  name        String
  description String?
  isActive    Boolean           @default(true)
  trigger     Json              // { type: "issue_created", conditions: {...} }
  actions     Json              // [{ type: "update_status", params: {...} }]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  lastRunAt   DateTime?
  
  // Health monitoring
  failureCount    Int           @default(0)
  lastFailureAt   DateTime?
  lastFailureMsg  String?
  
  runs        AutomationRun[]
  
  @@map("automation_rules")
}

model AutomationRun {
  id            String              @id @default(cuid())
  ruleId        String
  status        AutomationRunStatus @default(PENDING)
  triggeredBy   String?             // User ID or "system"
  startedAt     DateTime            @default(now())
  completedAt   DateTime?
  error         String?             @db.Text
  logs          Json?               // Detailed execution logs
  
  rule          AutomationRule      @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  user          User?               @relation(fields: [triggeredBy], references: [id])
  
  @@index([ruleId])
  @@index([startedAt])
  @@map("automation_runs")
}

enum AutomationRunStatus {
  PENDING
  RUNNING
  SUCCESS
  FAILED
  SKIPPED
}

// AI INSIGHTS

model AIInsight {
  id          String        @id @default(cuid())
  type        InsightType
  title       String
  description String        @db.Text
  severity    String        @default("medium") // "low", "medium", "high"
  metadata    Json?         // Additional context
  status      String        @default("active") // "active", "dismissed", "resolved"
  createdAt   DateTime      @default(now())
  dismissedAt DateTime?
  
  @@index([status])
  @@index([createdAt])
  @@map("ai_insights")
}

enum InsightType {
  BOTTLENECK_DETECTED
  SPRINT_AT_RISK
  OVERALLOCATION
  UNDERUTILIZATION
  DEPENDENCY_ISSUE
  VELOCITY_ANOMALY
}
```

---

## 🎨 DESIGN SYSTEM - Implementacja

### 1. CSS Variables (globals.css)

```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand Colors */
    --brand-primary-raw: 45, 91, 255;
    --brand-secondary-raw: 124, 58, 237;
    --brand-tertiary-raw: 6, 182, 212;
    
    --brand-primary: rgb(var(--brand-primary-raw));
    --brand-secondary: rgb(var(--brand-secondary-raw));
    --brand-tertiary: rgb(var(--brand-tertiary-raw));
    
    /* Dark Mode (default) */
    color-scheme: dark;
    
    --bg-base: #0A0B0F;
    --bg-elevated: #13141A;
    --bg-overlay: #1C1D26;
    --bg-subtle: rgba(var(--brand-primary-raw), 0.04);
    --bg-hover: rgba(255, 255, 255, 0.04);
    --bg-active: rgba(255, 255, 255, 0.08);
    
    --text-primary: #F1F3F5;
    --text-secondary: #9CA3AF;
    --text-tertiary: #6B7280;
    --text-on-brand: #FFFFFF;
    
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-default: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.12);
    
    /* Priority Colors */
    --priority-p0: #EF4444;
    --priority-p0-bg: rgba(239, 68, 68, 0.08);
    --priority-p1: #F59E0B;
    --priority-p1-bg: rgba(245, 158, 11, 0.08);
    --priority-p2: var(--brand-primary);
    --priority-p2-bg: rgba(var(--brand-primary-raw), 0.08);
    --priority-p3: #6B7280;
    --priority-p3-bg: rgba(107, 114, 128, 0.08);
    
    /* Status Colors */
    --status-todo: #6B7280;
    --status-todo-bg: rgba(107, 114, 128, 0.08);
    --status-progress: var(--brand-primary);
    --status-progress-bg: rgba(var(--brand-primary-raw), 0.08);
    --status-review: #06B6D4;
    --status-review-bg: rgba(6, 182, 212, 0.08);
    --status-blocked: #EF4444;
    --status-blocked-bg: rgba(239, 68, 68, 0.08);
    --status-done: #10B981;
    --status-done-bg: rgba(16, 185, 129, 0.08);
    
    /* Semantic */
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
    --info: #06B6D4;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    
    /* Border Radius */
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
  }
  
  .light {
    color-scheme: light;
    
    --bg-base: #FAFAFA;
    --bg-elevated: #FFFFFF;
    --bg-overlay: #FFFFFF;
    --bg-subtle: rgba(var(--brand-primary-raw), 0.03);
    --bg-hover: rgba(0, 0, 0, 0.04);
    --bg-active: rgba(0, 0, 0, 0.08);
    
    --text-primary: #18181B;
    --text-secondary: #52525B;
    --text-tertiary: #A1A1AA;
    
    --border-subtle: rgba(0, 0, 0, 0.04);
    --border-default: rgba(0, 0, 0, 0.08);
    --border-strong: rgba(0, 0, 0, 0.12);
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  }
  
  * {
    @apply border-[var(--border-default)];
  }
  
  body {
    @apply bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased;
  }
}
```

### 2. Tailwind Config

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary-raw) / <alpha-value>)',
          secondary: 'rgb(var(--brand-secondary-raw) / <alpha-value>)',
          tertiary: 'rgb(var(--brand-tertiary-raw) / <alpha-value>)',
        },
        bg: {
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          overlay: 'var(--bg-overlay)',
          subtle: 'var(--bg-subtle)',
          hover: 'var(--bg-hover)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 🧩 KOMPONENTY UI - Szczegółowa Implementacja

### Priority Badge Component

```typescript
// components/ui/priority-badge.tsx

import { cn } from '@/lib/utils'
import { Priority } from '@/types'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityConfig = {
  P0: {
    label: 'P0 - Critical',
    color: 'var(--priority-p0)',
    bg: 'var(--priority-p0-bg)',
  },
  P1: {
    label: 'P1 - High',
    color: 'var(--priority-p1)',
    bg: 'var(--priority-p1-bg)',
  },
  P2: {
    label: 'P2 - Medium',
    color: 'var(--priority-p2)',
    bg: 'var(--priority-p2-bg)',
  },
  P3: {
    label: 'P3 - Normal',
    color: 'var(--priority-p3)',
    bg: 'var(--priority-p3-bg)',
  },
  P4: {
    label: 'P4 - Low',
    color: 'var(--priority-p3)',
    bg: 'var(--priority-p3-bg)',
  },
  P5: {
    label: 'P5 - Lowest',
    color: 'var(--priority-p3)',
    bg: 'var(--priority-p3-bg)',
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  )
}
```

### Status Badge Component

```typescript
// components/ui/status-badge.tsx

import { cn } from '@/lib/utils'
import { IssueStatus } from '@/types'

const statusConfig = {
  TODO: {
    label: 'Todo',
    color: 'var(--status-todo)',
    bg: 'var(--status-todo-bg)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'var(--status-progress)',
    bg: 'var(--status-progress-bg)',
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'var(--status-review)',
    bg: 'var(--status-review-bg)',
  },
  BLOCKED: {
    label: 'Blocked',
    color: 'var(--status-blocked)',
    bg: 'var(--status-blocked-bg)',
  },
  DONE: {
    label: 'Done',
    color: 'var(--status-done)',
    bg: 'var(--status-done-bg)',
  },
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  const config = statusConfig[status]
  
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  )
}
```

---

## 📱 EKRANY I FUNKCJONALNOŚCI

### 1. DASHBOARD (Main View)

```typescript
// components/features/dashboard/dashboard-view.tsx

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'

export function DashboardView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats,
  })
  
  if (isLoading) return <DashboardSkeleton />
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Sprint"
          value={stats?.activeSprint?.name || 'No active sprint'}
          subtitle={`${stats?.activeSprint?.daysRemaining || 0} days remaining`}
          icon={<CalendarIcon />}
        />
        
        <KPICard
          title="Tasks in Progress"
          value={stats?.tasksInProgress || 0}
          subtitle={`${stats?.tasksCompleted || 0} completed this week`}
          icon={<ListIcon />}
        />
        
        <KPICard
          title="Team Velocity"
          value={`${stats?.velocity || 0} SP`}
          subtitle="Average last 3 sprints"
          trend={stats?.velocityTrend}
          icon={<TrendingUpIcon />}
        />
        
        <KPICard
          title="Blockers"
          value={stats?.blockers || 0}
          subtitle="Need attention"
          icon={<AlertTriangleIcon />}
          variant={stats?.blockers > 0 ? 'warning' : 'default'}
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sprint Progress */}
        <div className="lg:col-span-2 space-y-6">
          <SprintProgressCard sprint={stats?.activeSprint} />
          <RecentActivityCard activities={stats?.recentActivities} />
        </div>
        
        {/* Right Column - Quick Actions & AI Insights */}
        <div className="space-y-6">
          <QuickActionsCard />
          <AIInsightsCard insights={stats?.aiInsights} />
        </div>
      </div>
    </div>
  )
}
```

### 2. ISSUES LIST (Lista Zadań)

```typescript
// components/features/issues/issues-list-view.tsx

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { IssueCard } from './issue-card'
import { IssueFilters } from './issue-filters'
import { IssueFormDialog } from './issue-form-dialog'
import { Plus } from 'lucide-react'

export function IssuesListView() {
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
    sprint: 'all',
    search: '',
  })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues', filters],
    queryFn: () => api.issues.list(filters),
  })
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-base)] border-b border-[var(--border-subtle)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Issues</h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        </div>
        
        <IssueFilters filters={filters} onChange={setFilters} />
      </div>
      
      {/* Issues Grid */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <IssuesGridSkeleton />
        ) : issues?.length === 0 ? (
          <EmptyState
            icon={<InboxIcon />}
            title="No issues found"
            description="Try adjusting your filters or create a new issue"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues?.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
      
      {/* Create Dialog */}
      <IssueFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
}
```

### 3. KANBAN BOARD (Tablica)

```typescript
// components/features/kanban/kanban-board.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { KanbanColumn } from './kanban-column'
import { api } from '@/lib/api'
import { IssueStatus } from '@/types'

const COLUMNS: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']

export function KanbanBoard() {
  const queryClient = useQueryClient()
  
  const { data: sprint } = useQuery({
    queryKey: ['active-sprint'],
    queryFn: api.sprints.getActive,
  })
  
  const { data: issuesByStatus } = useQuery({
    queryKey: ['kanban-issues', sprint?.id],
    queryFn: () => api.issues.getByStatus(sprint?.id),
    enabled: !!sprint?.id,
  })
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ issueId, status }: { issueId: string; status: IssueStatus }) =>
      api.issues.updateStatus(issueId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-issues'] })
    },
  })
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    const issueId = active.id as string
    const newStatus = over.id as IssueStatus
    
    updateStatusMutation.mutate({ issueId, status: newStatus })
  }
  
  if (!sprint) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={<CalendarIcon />}
          title="No active sprint"
          description="Create a sprint to start using the Kanban board"
          action={
            <Button onClick={() => {/* Open sprint creation */}}>
              Create Sprint
            </Button>
          }
        />
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Sprint Header */}
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">{sprint.name}</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d, yyyy')}
            </p>
          </div>
          <SprintProgressIndicator sprint={sprint} />
        </div>
        
        <SprintStats sprint={sprint} issues={issuesByStatus} />
      </div>
      
      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4 min-w-max">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                issues={issuesByStatus?.[status] || []}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}
```

### 4. AUTOMATION DASHBOARD

```typescript
// components/features/automation/automation-dashboard.tsx

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AutomationHealthScore } from './automation-health-score'
import { RecentRunsChart } from './recent-runs-chart'
import { Plus, AlertTriangle } from 'lucide-react'

export function AutomationDashboard() {
  const { data: automationStats } = useQuery({
    queryKey: ['automation-stats'],
    queryFn: api.automation.getStats,
  })
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Automation Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Monitor and manage your automation rules
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>
      
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Automation Health</h3>
            <AutomationHealthScore score={automationStats?.healthScore} />
          </div>
          <p className="text-2xl font-bold">{automationStats?.healthScore}%</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {automationStats?.activeRules} active rules
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Time Saved This Week</h3>
          <p className="text-2xl font-bold">{automationStats?.timeSaved}h</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {automationStats?.runsThisWeek} automation runs
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Failed Runs</h3>
            {automationStats?.failedRuns > 0 && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {automationStats.failedRuns}
              </Badge>
            )}
          </div>
          <p className="text-2xl font-bold">{automationStats?.failedRuns || 0}</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Require attention
          </p>
        </Card>
      </div>
      
      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Automation Activity (Last 30 Days)</h3>
        <RecentRunsChart data={automationStats?.activityData} />
      </Card>
      
      {/* Failed Automations Alert */}
      {automationStats?.failedAutomations?.length > 0 && (
        <Card className="p-6 border-[var(--error)] bg-[var(--error-bg)]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Automations Require Attention</h3>
              <ul className="space-y-2">
                {automationStats.failedAutomations.map((automation) => (
                  <li key={automation.id} className="text-sm">
                    <span className="font-medium">{automation.name}</span>
                    <span className="text-[var(--text-secondary)] ml-2">
                      Failed {automation.failureCount} times
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-3">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
```

---

## 🔌 API ENDPOINTS (Backend)

### REST API Structure

```typescript
// backend/src/routes/index.ts

import express from 'express'
import { authRouter } from './auth.routes'
import { issuesRouter } from './issues.routes'
import { sprintsRouter } from './sprints.routes'
import { teamsRouter } from './teams.routes'
import { automationRouter } from './automation.routes'
import { reportsRouter } from './reports.routes'
import { aiRouter } from './ai.routes'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/issues', issuesRouter)
router.use('/sprints', sprintsRouter)
router.use('/teams', teamsRouter)
router.use('/automation', automationRouter)
router.use('/reports', reportsRouter)
router.use('/ai', aiRouter)

export default router
```

### Issues API

```typescript
// backend/src/routes/issues.routes.ts

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import * as issuesController from '../controllers/issues.controller'

const router = Router()

// List issues with filters
router.get('/', authenticate, issuesController.list)

// Get issue by ID
router.get('/:id', authenticate, issuesController.getById)

// Create issue
router.post('/', authenticate, issuesController.create)

// Update issue
router.patch('/:id', authenticate, issuesController.update)

// Update status (for Kanban drag & drop)
router.patch('/:id/status', authenticate, issuesController.updateStatus)

// Delete issue
router.delete('/:id', authenticate, issuesController.delete)

// Assign to sprint
router.post('/:id/assign-sprint', authenticate, issuesController.assignToSprint)

// Add/remove dependencies
router.post('/:id/dependencies', authenticate, issuesController.addDependency)
router.delete('/:id/dependencies/:depId', authenticate, issuesController.removeDependency)

// Comments
router.get('/:id/comments', authenticate, issuesController.getComments)
router.post('/:id/comments', authenticate, issuesController.addComment)

// Activity log
router.get('/:id/activity', authenticate, issuesController.getActivity)

export const issuesRouter = router
```

### Issues Controller

```typescript
// backend/src/controllers/issues.controller.ts

import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3', 'P4', 'P5']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE']),
  assigneeId: z.string(),
  sprintId: z.string().optional(),
  storyPoints: z.number().optional(),
})

export async function list(req: Request, res: Response) {
  try {
    const {
      status,
      priority,
      assignee,
      sprint,
      search,
      page = 1,
      limit = 50,
    } = req.query
    
    const where: any = {}
    
    if (status) where.status = { in: (status as string).split(',') }
    if (priority) where.priority = { in: (priority as string).split(',') }
    if (assignee) where.assigneeId = { in: (assignee as string).split(',') }
    if (sprint && sprint !== 'all') {
      if (sprint === 'backlog') {
        where.sprintId = null
      } else {
        where.sprintId = sprint
      }
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { identifier: { contains: search as string, mode: 'insensitive' } },
      ]
    }
    
    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          sprint: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
        orderBy: [
          { priority: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.issue.count({ where }),
    ])
    
    res.json({
      issues,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error('Error listing issues:', error)
    res.status(500).json({ error: 'Failed to fetch issues' })
  }
}

export async function create(req: Request, res: Response) {
  try {
    const data = createIssueSchema.parse(req.body)
    const userId = req.user!.id
    
    // Generate unique identifier
    const lastIssue = await prisma.issue.findFirst({
      orderBy: { identifier: 'desc' },
    })
    
    const lastNumber = lastIssue
      ? parseInt(lastIssue.identifier.split('-')[1])
      : 0
    const identifier = `TSK-${String(lastNumber + 1).padStart(3, '0')}`
    
    const issue = await prisma.issue.create({
      data: {
        ...data,
        identifier,
        createdById: userId,
      },
      include: {
        assignee: true,
        sprint: true,
        createdBy: true,
      },
    })
    
    // Log activity
    await prisma.issueActivity.create({
      data: {
        issueId: issue.id,
        userId,
        action: 'created',
      },
    })
    
    // Trigger automation rules
    await triggerAutomationRules('issue_created', issue)
    
    res.status(201).json(issue)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error('Error creating issue:', error)
    res.status(500).json({ error: 'Failed to create issue' })
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user!.id
    
    const oldIssue = await prisma.issue.findUnique({ where: { id } })
    
    if (!oldIssue) {
      return res.status(404).json({ error: 'Issue not found' })
    }
    
    const issue = await prisma.issue.update({
      where: { id },
      data: { status },
      include: {
        assignee: true,
        sprint: true,
      },
    })
    
    // Log activity
    await prisma.issueActivity.create({
      data: {
        issueId: id,
        userId,
        action: 'status_changed',
        field: 'status',
        oldValue: oldIssue.status,
        newValue: status,
      },
    })
    
    // Trigger automation rules
    await triggerAutomationRules('status_changed', issue)
    
    res.json(issue)
  } catch (error) {
    console.error('Error updating status:', error)
    res.status(500).json({ error: 'Failed to update status' })
  }
}

// ... more controller functions
```

### Automation Engine

```typescript
// backend/src/services/automation.service.ts

import { prisma } from '../lib/prisma'
import { Issue, AutomationRule } from '@prisma/client'

export async function triggerAutomationRules(
  event: string,
  context: any
) {
  const rules = await prisma.automationRule.findMany({
    where: {
      isActive: true,
      trigger: {
        path: ['type'],
        equals: event,
      },
    },
  })
  
  for (const rule of rules) {
    await executeAutomationRule(rule, context)
  }
}

async function executeAutomationRule(
  rule: AutomationRule,
  context: any
) {
  const runId = await prisma.automationRun.create({
    data: {
      ruleId: rule.id,
      status: 'RUNNING',
      triggeredBy: 'system',
    },
  })
  
  try {
    const trigger = rule.trigger as any
    const actions = rule.actions as any[]
    
    // Check conditions
    const conditionsMet = evaluateConditions(trigger.conditions, context)
    
    if (!conditionsMet) {
      await prisma.automationRun.update({
        where: { id: runId.id },
        data: {
          status: 'SKIPPED',
          completedAt: new Date(),
          logs: { message: 'Conditions not met' },
        },
      })
      return
    }
    
    // Execute actions
    const logs: any[] = []
    
    for (const action of actions) {
      const result = await executeAction(action, context)
      logs.push(result)
    }
    
    // Mark as success
    await prisma.automationRun.update({
      where: { id: runId.id },
      data: {
        status: 'SUCCESS',
        completedAt: new Date(),
        logs: { steps: logs },
      },
    })
    
    // Reset failure count on success
    await prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        failureCount: 0,
        lastRunAt: new Date(),
      },
    })
  } catch (error) {
    // Mark as failed
    await prisma.automationRun.update({
      where: { id: runId.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        error: error.message,
      },
    })
    
    // Increment failure count and send alert
    const updatedRule = await prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        failureCount: { increment: 1 },
        lastFailureAt: new Date(),
        lastFailureMsg: error.message,
      },
    })
    
    // Send alert if failure count exceeds threshold
    if (updatedRule.failureCount >= 3) {
      await sendAutomationFailureAlert(updatedRule)
    }
  }
}

function evaluateConditions(conditions: any, context: any): boolean {
  // Simple condition evaluator
  // Example: { field: 'priority', operator: 'equals', value: 'P0' }
  
  if (!conditions) return true
  
  for (const condition of conditions) {
    const fieldValue = getNestedValue(context, condition.field)
    
    switch (condition.operator) {
      case 'equals':
        if (fieldValue !== condition.value) return false
        break
      case 'not_equals':
        if (fieldValue === condition.value) return false
        break
      case 'contains':
        if (!fieldValue?.includes(condition.value)) return false
        break
      // ... more operators
    }
  }
  
  return true
}

async function executeAction(action: any, context: any) {
  switch (action.type) {
    case 'update_status':
      await prisma.issue.update({
        where: { id: context.id },
        data: { status: action.params.status },
      })
      return { action: 'update_status', success: true }
      
    case 'assign_to':
      await prisma.issue.update({
        where: { id: context.id },
        data: { assigneeId: action.params.userId },
      })
      return { action: 'assign_to', success: true }
      
    case 'add_comment':
      await prisma.comment.create({
        data: {
          issueId: context.id,
          authorId: 'system',
          content: action.params.content,
        },
      })
      return { action: 'add_comment', success: true }
      
    case 'send_notification':
      // Implement notification logic
      return { action: 'send_notification', success: true }
      
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}
```

---

## 🎨 WSZYSTKIE FORMULARZE

### Issue Form (Create/Edit)

```typescript
// components/features/issues/issue-form-dialog.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3', 'P4', 'P5']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE']),
  assigneeId: z.string().min(1, 'Assignee is required'),
  sprintId: z.string().optional(),
  storyPoints: z.coerce.number().optional(),
})

type IssueFormData = z.infer<typeof issueSchema>

export function IssueFormDialog({
  open,
  onOpenChange,
  issue,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue?: any
}) {
  const queryClient = useQueryClient()
  const isEdit = !!issue
  
  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: issue || {
      title: '',
      description: '',
      priority: 'P3',
      status: 'TODO',
      assigneeId: '',
      sprintId: undefined,
      storyPoints: undefined,
    },
  })
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.users.list,
  })
  
  const { data: sprints } = useQuery({
    queryKey: ['sprints'],
    queryFn: api.sprints.list,
  })
  
  const createMutation = useMutation({
    mutationFn: api.issues.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      onOpenChange(false)
      form.reset()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: (data: IssueFormData) => api.issues.update(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      onOpenChange(false)
    },
  })
  
  const onSubmit = (data: IssueFormData) => {
    if (isEdit) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Issue' : 'Create New Issue'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <option value="P0">P0 - Critical</option>
                      <option value="P1">P1 - High</option>
                      <option value="P2">P2 - Medium</option>
                      <option value="P3">P3 - Normal</option>
                      <option value="P4">P4 - Low</option>
                      <option value="P5">P5 - Lowest</option>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="DONE">Done</option>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Assignee & Sprint */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <option value="">Select assignee</option>
                      {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sprintId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprint</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <option value="">No Sprint (Backlog)</option>
                      {sprints?.map((sprint) => (
                        <option key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </option>
                      ))}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Story Points */}
            <FormField
              control={form.control}
              name="storyPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Estimate in story points"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? 'Update Issue' : 'Create Issue'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## ⚡ REAL-TIME UPDATES (WebSocket)

```typescript
// backend/src/websockets/index.ts

import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { verifyToken } from '../middleware/auth'

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  })
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const user = await verifyToken(token)
      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.id}`)
    
    // Join user's personal room
    socket.join(`user:${socket.data.user.id}`)
    
    // Join sprint rooms
    socket.on('join-sprint', (sprintId) => {
      socket.join(`sprint:${sprintId}`)
    })
    
    // Leave sprint rooms
    socket.on('leave-sprint', (sprintId) => {
      socket.leave(`sprint:${sprintId}`)
    })
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.id}`)
    })
  })
  
  return io
}

// Event emitters
export function emitIssueCreated(io: SocketIOServer, issue: any) {
  if (issue.sprintId) {
    io.to(`sprint:${issue.sprintId}`).emit('issue:created', issue)
  }
  io.to(`user:${issue.assigneeId}`).emit('issue:assigned', issue)
}

export function emitIssueUpdated(io: SocketIOServer, issue: any) {
  if (issue.sprintId) {
    io.to(`sprint:${issue.sprintId}`).emit('issue:updated', issue)
  }
}

export function emitAutomationFailed(io: SocketIOServer, rule: any, error: string) {
  // Notify all admins
  io.emit('automation:failed', { rule, error })
}
```

### Frontend WebSocket Hook

```typescript
// hooks/use-websocket.ts

import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'

let socket: Socket | null = null

export function useWebSocket() {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()
  
  useEffect(() => {
    if (!token) return
    
    // Initialize socket
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    })
    
    // Listen for issue events
    socket.on('issue:created', (issue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['kanban-issues'] })
    })
    
    socket.on('issue:updated', (issue) => {
      queryClient.setQueryData(['issues', issue.id], issue)
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['kanban-issues'] })
    })
    
    socket.on('automation:failed', ({ rule, error }) => {
      // Show toast notification
      toast.error(`Automation "${rule.name}" failed: ${error}`)
      queryClient.invalidateQueries({ queryKey: ['automation-stats'] })
    })
    
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [token, queryClient])
  
  return {
    joinSprint: (sprintId: string) => {
      socket?.emit('join-sprint', sprintId)
    },
    leaveSprint: (sprintId: string) => {
      socket?.emit('leave-sprint', sprintId)
    },
  }
}
```

---

## 📊 WSZYSTKIE DASHBOARDY I RAPORTY

Dokończę implementację w następnej części z:
- Sprint Health Dashboard (z burndown chart)
- Team Performance Dashboard (z cycle time)
- Velocity Trends Dashboard
- Reports Export funkcjonalność
- AI Insights Dashboard
- Settings View kompletny

Czy chcesz, żebym kontynuował z tymi szczegółami?

# MASTER PROMPT: TaskFlow - Kontynuacja (Część 2)

---

## 📊 DASHBOARDY RAPORTÓW - Szczegółowa Implementacja

### Sprint Health Dashboard (Kompletny)

```typescript
// components/features/reports/sprint-health-dashboard.tsx

import { useQuery } from '@tanstack/react-query'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { BurndownChart } from './burndown-chart'
import { CumulativeFlowDiagram } from './cumulative-flow-diagram'
import { api } from '@/lib/api'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

export function SprintHealthDashboard() {
  const [selectedSprintId, setSelectedSprintId] = useState<string>()
  
  const { data: sprints } = useQuery({
    queryKey: ['sprints'],
    queryFn: api.sprints.list,
  })
  
  const { data: sprintHealth, isLoading } = useQuery({
    queryKey: ['sprint-health', selectedSprintId],
    queryFn: () => api.reports.getSprintHealth(selectedSprintId),
    enabled: !!selectedSprintId,
  })
  
  // Auto-select active sprint
  useEffect(() => {
    if (sprints && !selectedSprintId) {
      const activeSprint = sprints.find(s => s.status === 'ACTIVE')
      if (activeSprint) setSelectedSprintId(activeSprint.id)
    }
  }, [sprints, selectedSprintId])
  
  if (isLoading) return <SprintHealthSkeleton />
  
  const healthStatus = calculateHealthStatus(sprintHealth)
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with Sprint Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sprint Health</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Detailed analysis of sprint progress and health
          </p>
        </div>
        
        <Select
          value={selectedSprintId}
          onValueChange={setSelectedSprintId}
        >
          {sprints?.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name} ({sprint.status})
            </option>
          ))}
        </Select>
      </div>
      
      {/* Health Indicator */}
      <Card className={`p-6 ${getHealthClass(healthStatus)}`}>
        <div className="flex items-center gap-4">
          {healthStatus === 'at-risk' && (
            <AlertTriangle className="w-8 h-8 text-[var(--error)]" />
          )}
          {healthStatus === 'on-track' && (
            <TrendingUp className="w-8 h-8 text-[var(--success)]" />
          )}
          {healthStatus === 'ahead' && (
            <TrendingUp className="w-8 h-8 text-[var(--brand-primary)]" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold">
              Sprint Status: {getHealthLabel(healthStatus)}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {getHealthDescription(healthStatus, sprintHealth)}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Completion Rate"
          value={`${sprintHealth?.completionRate || 0}%`}
          subtitle={`${sprintHealth?.completedIssues}/${sprintHealth?.totalIssues} issues`}
          trend={sprintHealth?.completionTrend}
        />
        
        <MetricCard
          title="Story Points"
          value={`${sprintHealth?.completedPoints}/${sprintHealth?.totalPoints}`}
          subtitle="Completed / Total"
          trend={sprintHealth?.pointsTrend}
        />
        
        <MetricCard
          title="Days Remaining"
          value={sprintHealth?.daysRemaining || 0}
          subtitle={`of ${sprintHealth?.totalDays} days`}
        />
        
        <MetricCard
          title="Scope Changes"
          value={sprintHealth?.scopeChanges || 0}
          subtitle="Added after start"
          variant={sprintHealth?.scopeChanges > 5 ? 'warning' : 'default'}
        />
      </div>
      
      {/* Burndown Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Burndown Chart</h3>
        <BurndownChart
          idealLine={sprintHealth?.burndown.ideal}
          actualLine={sprintHealth?.burndown.actual}
          startDate={sprintHealth?.startDate}
          endDate={sprintHealth?.endDate}
        />
      </Card>
      
      {/* Cumulative Flow Diagram */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Cumulative Flow Diagram
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Visualize work distribution across statuses over time
        </p>
        <CumulativeFlowDiagram data={sprintHealth?.cfd} />
      </Card>
      
      {/* Added vs Completed */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Added vs Completed (Scope Stability)
        </h3>
        <ScopeStabilityChart data={sprintHealth?.scopeStability} />
      </Card>
      
      {/* Critical Issues */}
      {sprintHealth?.criticalIssues?.length > 0 && (
        <Card className="p-6 border-[var(--error)] bg-[var(--error-bg)]">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--error)]" />
            Critical Issues Requiring Attention
          </h3>
          <div className="space-y-3">
            {sprintHealth.criticalIssues.map((issue) => (
              <CriticalIssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// Burndown Chart Component
function BurndownChart({ idealLine, actualLine, startDate, endDate }) {
  const data = useMemo(() => {
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) })
    
    return days.map((day, index) => ({
      date: format(day, 'MMM dd'),
      ideal: idealLine[index],
      actual: actualLine[index],
      isToday: isToday(day),
    }))
  }, [idealLine, actualLine, startDate, endDate])
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--text-tertiary)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="var(--text-tertiary)"
          style={{ fontSize: '12px' }}
          label={{ value: 'Story Points Remaining', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-overlay)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <Legend />
        <ReferenceLine
          x={data.find(d => d.isToday)?.date}
          stroke="var(--brand-primary)"
          strokeDasharray="3 3"
          label="Today"
        />
        <Line
          type="monotone"
          dataKey="ideal"
          stroke="var(--text-tertiary)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Ideal Burndown"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--brand-primary)"
          strokeWidth={3}
          dot={{ fill: 'var(--brand-primary)', r: 4 }}
          name="Actual Progress"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Cumulative Flow Diagram
function CumulativeFlowDiagram({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="date" stroke="var(--text-tertiary)" />
        <YAxis stroke="var(--text-tertiary)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-overlay)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="done"
          stackId="1"
          stroke="var(--status-done)"
          fill="var(--status-done-bg)"
          name="Done"
        />
        <Area
          type="monotone"
          dataKey="inReview"
          stackId="1"
          stroke="var(--status-review)"
          fill="var(--status-review-bg)"
          name="In Review"
        />
        <Area
          type="monotone"
          dataKey="inProgress"
          stackId="1"
          stroke="var(--status-progress)"
          fill="var(--status-progress-bg)"
          name="In Progress"
        />
        <Area
          type="monotone"
          dataKey="todo"
          stackId="1"
          stroke="var(--status-todo)"
          fill="var(--status-todo-bg)"
          name="Todo"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Helper functions
function calculateHealthStatus(sprintHealth) {
  if (!sprintHealth) return 'unknown'
  
  const { completionRate, daysRemaining, totalDays } = sprintHealth
  const daysElapsed = totalDays - daysRemaining
  const expectedCompletion = (daysElapsed / totalDays) * 100
  const variance = completionRate - expectedCompletion
  
  if (variance < -15) return 'at-risk'
  if (variance > 15) return 'ahead'
  return 'on-track'
}

function getHealthClass(status) {
  switch (status) {
    case 'at-risk': return 'border-l-4 border-l-[var(--error)]'
    case 'ahead': return 'border-l-4 border-l-[var(--brand-primary)]'
    case 'on-track': return 'border-l-4 border-l-[var(--success)]'
    default: return ''
  }
}
```

### Team Performance Dashboard

```typescript
// components/features/reports/team-performance-dashboard.tsx

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'

export function TeamPerformanceDashboard() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')
  
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: api.teams.list,
  })
  
  const { data: performance, isLoading } = useQuery({
    queryKey: ['team-performance', selectedTeamId, timeRange],
    queryFn: () => api.reports.getTeamPerformance(selectedTeamId, timeRange),
  })
  
  if (isLoading) return <TeamPerformanceSkeleton />
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team Performance</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Analyze team efficiency and workload distribution
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </Select>
          
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <option value="all">All Teams</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Average Completion Rate"
          value={`${performance?.avgCompletionRate || 0}%`}
          subtitle="Tasks completed on time"
        />
        
        <MetricCard
          title="Average Cycle Time"
          value={`${performance?.avgCycleTime || 0}d`}
          subtitle="Days from start to done"
        />
        
        <MetricCard
          title="Throughput"
          value={performance?.throughput || 0}
          subtitle="Tasks completed"
        />
        
        <MetricCard
          title="WIP Average"
          value={performance?.avgWIP || 0}
          subtitle="Work in progress"
        />
      </div>
      
      {/* Workload Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Workload Distribution (Story Points)
          </h3>
          <WorkloadPieChart data={performance?.workloadDistribution} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Completion Rate by Member
          </h3>
          <CompletionRateChart data={performance?.memberCompletionRates} />
        </Card>
      </div>
      
      {/* Cycle Time Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Cycle Time Trends
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Average time from "In Progress" to "Done" over time
        </p>
        <CycleTimeChart data={performance?.cycleTimeTrends} />
      </Card>
      
      {/* Team Member Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Individual Performance Metrics
        </h3>
        <TeamMemberTable members={performance?.memberMetrics} />
      </Card>
    </div>
  )
}

// Workload Pie Chart
function WorkloadPieChart({ data }) {
  const COLORS = [
    'var(--brand-primary)',
    'var(--brand-secondary)',
    'var(--brand-tertiary)',
    '#10B981',
    '#F59E0B',
    '#EF4444',
  ]
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="storyPoints"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Completion Rate Bar Chart
function CompletionRateChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="name" stroke="var(--text-tertiary)" />
        <YAxis stroke="var(--text-tertiary)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-overlay)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <Bar dataKey="completionRate" fill="var(--brand-primary)" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Cycle Time Trends Chart
function CycleTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="date" stroke="var(--text-tertiary)" />
        <YAxis stroke="var(--text-tertiary)" label={{ value: 'Days', angle: -90 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="avgCycleTime"
          stroke="var(--brand-primary)"
          strokeWidth={2}
          name="Avg Cycle Time"
        />
        <Line
          type="monotone"
          dataKey="p50"
          stroke="var(--success)"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="P50 (Median)"
        />
        <Line
          type="monotone"
          dataKey="p90"
          stroke="var(--warning)"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="P90"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Team Member Table
function TeamMemberTable({ members }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[var(--bg-base)] sticky top-0">
          <tr>
            <th className="text-left p-3 font-semibold text-sm">Member</th>
            <th className="text-right p-3 font-semibold text-sm">Completed</th>
            <th className="text-right p-3 font-semibold text-sm">Story Points</th>
            <th className="text-right p-3 font-semibold text-sm">Avg Cycle Time</th>
            <th className="text-right p-3 font-semibold text-sm">Completion Rate</th>
            <th className="text-left p-3 font-semibold text-sm">Workload</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member) => (
            <tr key={member.id} className="border-t border-[var(--border-subtle)]">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <span className="font-medium">{member.name}</span>
                </div>
              </td>
              <td className="p-3 text-right">{member.completedTasks}</td>
              <td className="p-3 text-right">{member.storyPoints}</td>
              <td className="p-3 text-right">{member.avgCycleTime}d</td>
              <td className="p-3 text-right">
                <span className={getCompletionRateColor(member.completionRate)}>
                  {member.completionRate}%
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Progress value={member.workloadPercentage} className="flex-1" />
                  <span className="text-xs text-[var(--text-secondary)] min-w-[40px]">
                    {member.workloadPercentage}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getCompletionRateColor(rate: number) {
  if (rate >= 80) return 'text-[var(--success)]'
  if (rate >= 60) return 'text-[var(--warning)]'
  return 'text-[var(--error)]'
}
```

### Velocity Trends Dashboard

```typescript
// components/features/reports/velocity-trends-dashboard.tsx

export function VelocityTrendsDashboard() {
  const { data: velocityData, isLoading } = useQuery({
    queryKey: ['velocity-trends'],
    queryFn: api.reports.getVelocityTrends,
  })
  
  if (isLoading) return <VelocityTrendsSkeleton />
  
  const avgVelocity = calculateAverage(velocityData?.sprints.map(s => s.delivered))
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Velocity Trends</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Track team velocity over time for better planning
          </p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Velocity"
          value={`${avgVelocity} SP`}
          subtitle="Last 5 sprints"
        />
        
        <MetricCard
          title="Velocity Stability"
          value={`${velocityData?.stability || 0}%`}
          subtitle="Consistency score"
          trend={velocityData?.stabilityTrend}
        />
        
        <MetricCard
          title="Trend"
          value={velocityData?.trend > 0 ? '↑ Increasing' : '↓ Decreasing'}
          subtitle={`${Math.abs(velocityData?.trend || 0)}% change`}
          variant={velocityData?.trend > 0 ? 'success' : 'warning'}
        />
      </div>
      
      {/* Velocity Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Velocity Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={velocityData?.sprints}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="name" stroke="var(--text-tertiary)" />
            <YAxis stroke="var(--text-tertiary)" label={{ value: 'Story Points', angle: -90 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-overlay)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <Legend />
            <Bar dataKey="planned" fill="var(--text-tertiary)" opacity={0.3} name="Planned" />
            <Bar dataKey="delivered" fill="var(--brand-primary)" name="Delivered" />
            <Line
              type="monotone"
              dataKey="average"
              stroke="var(--success)"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="Average"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Sprint Comparison Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sprint-by-Sprint Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-base)]">
              <tr>
                <th className="text-left p-3 font-semibold text-sm">Sprint</th>
                <th className="text-right p-3 font-semibold text-sm">Planned SP</th>
                <th className="text-right p-3 font-semibold text-sm">Delivered SP</th>
                <th className="text-right p-3 font-semibold text-sm">Variance</th>
                <th className="text-right p-3 font-semibold text-sm">Completion %</th>
              </tr>
            </thead>
            <tbody>
              {velocityData?.sprints.map((sprint) => (
                <tr key={sprint.id} className="border-t border-[var(--border-subtle)]">
                  <td className="p-3 font-medium">{sprint.name}</td>
                  <td className="p-3 text-right">{sprint.planned}</td>
                  <td className="p-3 text-right font-semibold">{sprint.delivered}</td>
                  <td className="p-3 text-right">
                    <span className={getVarianceColor(sprint.variance)}>
                      {sprint.variance > 0 ? '+' : ''}{sprint.variance}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {Math.round((sprint.delivered / sprint.planned) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Insights */}
      <Card className="p-6 bg-[var(--info-bg)] border-[var(--info-border)]">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--info)]" />
          Velocity Insights
        </h3>
        <ul className="space-y-2 text-sm">
          {velocityData?.insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-[var(--info)]">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function getVarianceColor(variance: number) {
  if (variance > 0) return 'text-[var(--success)]'
  if (variance < -5) return 'text-[var(--error)]'
  return 'text-[var(--text-secondary)]'
}
```

---

## 🤖 AI INSIGHTS DASHBOARD

```typescript
// components/features/ai-insights/ai-insights-dashboard.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp, Zap, CheckCircle, X } from 'lucide-react'

export function AIInsightsDashboard() {
  const queryClient = useQueryClient()
  
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: api.ai.getInsights,
  })
  
  const dismissMutation = useMutation({
    mutationFn: api.ai.dismissInsight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] })
    },
  })
  
  const createTaskMutation = useMutation({
    mutationFn: api.ai.createTaskFromInsight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] })
      toast.success('Task created successfully')
    },
  })
  
  if (isLoading) return <AIInsightsSkeleton />
  
  const groupedInsights = groupBy(insights, 'type')
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Insights</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Smart recommendations to improve team performance
          </p>
        </div>
        
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['ai-insights'] })}>
          <Zap className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </div>
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Insights"
          value={insights?.filter(i => i.status === 'active').length || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        
        <MetricCard
          title="High Priority"
          value={insights?.filter(i => i.severity === 'high').length || 0}
          variant="error"
        />
        
        <MetricCard
          title="Resolved"
          value={insights?.filter(i => i.status === 'resolved').length || 0}
          variant="success"
        />
        
        <MetricCard
          title="Dismissed"
          value={insights?.filter(i => i.status === 'dismissed').length || 0}
        />
      </div>
      
      {/* Insights by Category */}
      {Object.entries(groupedInsights).map(([type, typeInsights]) => (
        <div key={type} className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {getInsightTypeIcon(type)}
            {getInsightTypeLabel(type)}
          </h2>
          
          <div className="space-y-3">
            {typeInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={() => dismissMutation.mutate(insight.id)}
                onCreateTask={() => createTaskMutation.mutate(insight.id)}
              />
            ))}
          </div>
        </div>
      ))}
      
      {insights?.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle className="w-12 h-12 text-[var(--success)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            No active insights at the moment. Keep up the great work!
          </p>
        </Card>
      )}
    </div>
  )
}

// Insight Card Component
function InsightCard({ insight, onDismiss, onCreateTask }) {
  return (
    <Card className={`p-4 ${getSeverityBorderClass(insight.severity)}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityBgClass(insight.severity)}`}>
          {getInsightIcon(insight.type, insight.severity)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold mb-1">{insight.title}</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                {insight.description}
              </p>
            </div>
            
            <Badge variant={getSeverityVariant(insight.severity)}>
              {insight.severity}
            </Badge>
          </div>
          
          {/* Metadata */}
          {insight.metadata && (
            <div className="mt-3 p-3 bg-[var(--bg-subtle)] rounded-md">
              <InsightMetadata metadata={insight.metadata} type={insight.type} />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              onClick={onCreateTask}
              disabled={insight.status !== 'active'}
            >
              <Zap className="w-3 h-3 mr-1" />
              Create Task
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              disabled={insight.status !== 'active'}
            >
              <X className="w-3 h-3 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Insight Metadata Display
function InsightMetadata({ metadata, type }) {
  switch (type) {
    case 'BOTTLENECK_DETECTED':
      return (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Status:</span>
            <span className="font-medium">{metadata.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Avg Time in Status:</span>
            <span className="font-medium">{metadata.avgTimeInStatus}d</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Issues Affected:</span>
            <span className="font-medium">{metadata.issuesAffected}</span>
          </div>
        </div>
      )
      
    case 'SPRINT_AT_RISK':
      return (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Sprint:</span>
            <span className="font-medium">{metadata.sprintName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Completion Rate:</span>
            <span className="font-medium">{metadata.completionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Days Remaining:</span>
            <span className="font-medium">{metadata.daysRemaining}</span>
          </div>
        </div>
      )
      
    case 'OVERALLOCATION':
      return (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Team Member:</span>
            <span className="font-medium">{metadata.memberName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Current Load:</span>
            <span className="font-medium text-[var(--error)]">{metadata.currentLoad}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Active Tasks:</span>
            <span className="font-medium">{metadata.activeTasks}</span>
          </div>
        </div>
      )
      
    default:
      return <pre className="text-xs">{JSON.stringify(metadata, null, 2)}</pre>
  }
}

// Helper functions
function getInsightTypeIcon(type) {
  const icons = {
    BOTTLENECK_DETECTED: <AlertTriangle className="w-5 h-5" />,
    SPRINT_AT_RISK: <TrendingUp className="w-5 h-5" />,
    OVERALLOCATION: <AlertTriangle className="w-5 h-5" />,
    UNDERUTILIZATION: <TrendingUp className="w-5 h-5" />,
    DEPENDENCY_ISSUE: <Zap className="w-5 h-5" />,
    VELOCITY_ANOMALY: <TrendingUp className="w-5 h-5" />,
  }
  return icons[type] || <Zap className="w-5 h-5" />
}

function getSeverityBorderClass(severity) {
  switch (severity) {
    case 'high': return 'border-l-4 border-l-[var(--error)]'
    case 'medium': return 'border-l-4 border-l-[var(--warning)]'
    case 'low': return 'border-l-4 border-l-[var(--info)]'
    default: return ''
  }
}
```

---

## ⚙️ SETTINGS VIEW (Complete)

```typescript
// components/features/settings/settings-view.tsx

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GeneralSettings } from './general-settings'
import { AppearanceSettings } from './appearance-settings'
import { NotificationSettings } from './notification-settings'
import { DataManager } from './data-manager'
import { ShortcutsSettings } from './shortcuts-settings'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general')
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your application preferences
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="data">
          <DataManager />
        </TabsContent>
        
        <TabsContent value="shortcuts">
          <ShortcutsSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// General Settings Tab
function GeneralSettings() {
  const { settings, updateSettings } = useSettings()
  
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
        
        {/* Default View */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Default View on Startup
            </label>
            <RadioGroup
              value={settings.defaultView}
              onValueChange={(value) => updateSettings({ defaultView: value })}
            >
              <RadioItem value="dashboard" label="Dashboard" />
              <RadioItem value="current-sprint" label="Current Sprint" />
              <RadioItem value="issues" label="Issues List" />
            </RadioGroup>
          </div>
          
          {/* Autosave */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Autosave</label>
              <p className="text-xs text-[var(--text-secondary)]">
                Automatically save changes in forms
              </p>
            </div>
            <Switch
              checked={settings.autosave}
              onCheckedChange={(checked) => updateSettings({ autosave: checked })}
            />
          </div>
          
          {/* Confirmation on Delete */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Confirm Deletions</label>
              <p className="text-xs text-[var(--text-secondary)]">
                Show confirmation dialog before deleting items
              </p>
            </div>
            <Switch
              checked={settings.confirmDelete}
              onCheckedChange={(checked) => updateSettings({ confirmDelete: checked })}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

// Appearance Settings Tab
function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()
  
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        
        {/* Theme Toggle */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Theme</label>
            <div className="flex items-center gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
          
          {/* Density */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Interface Density
            </label>
            <RadioGroup
              value={settings.density}
              onValueChange={(value) => updateSettings({ density: value })}
            >
              <RadioItem value="compact" label="Compact" description="More content, less spacing" />
              <RadioItem value="comfortable" label="Comfortable" description="Balanced spacing" />
              <RadioItem value="spacious" label="Spacious" description="More breathing room" />
            </RadioGroup>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Notification Settings Tab
function NotificationSettings() {
  const { settings, updateSettings } = useSettings()
  
  const notificationTypes = [
    { key: 'issueAssigned', label: 'Issue Assigned to Me', description: 'When someone assigns an issue to you' },
    { key: 'commentAdded', label: 'Comments on My Issues', description: 'When someone comments on your issues' },
    { key: 'priorityChanged', label: 'Priority Changed to Critical', description: 'When issue priority is set to P0' },
    { key: 'sprintEnding', label: 'Sprint Ending Soon', description: 'Reminder when sprint is about to end' },
    { key: 'automationFailed', label: 'Automation Failures', description: 'When an automation rule fails' },
  ]
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      
      <div className="space-y-4">
        {notificationTypes.map((type) => (
          <div key={type.key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">{type.label}</label>
              <p className="text-xs text-[var(--text-secondary)]">{type.description}</p>
            </div>
            <Switch
              checked={settings.notifications?.[type.key] ?? true}
              onCheckedChange={(checked) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    [type.key]: checked,
                  },
                })
              }
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

// Data Manager Tab
function DataManager() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await api.data.export()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `taskflow-export-${format(new Date(), 'yyyy-MM-dd')}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await api.data.import(data)
      toast.success('Data imported successfully')
      window.location.reload()
    } catch (error) {
      toast.error('Failed to import data')
    } finally {
      setIsImporting(false)
    }
  }
  
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        
        {/* Export */}
        <div className="space-y-4">
          <div className="p-4 border border-[var(--border-default)] rounded-lg">
            <h4 className="font-semibold mb-2">Export Data</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Download all your data as a JSON file for backup or migration purposes.
            </p>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
          
          {/* Import */}
          <div className="p-4 border border-[var(--border-default)] rounded-lg">
            <h4 className="font-semibold mb-2">Import Data</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Restore data from a previously exported JSON file. This will overwrite existing data.
            </p>
            <label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
              <Button as="span" variant="outline" disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </label>
          </div>
          
          {/* Statistics */}
          <div className="p-4 bg-[var(--bg-subtle)] rounded-lg">
            <h4 className="font-semibold mb-3">Data Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Total Issues:</span>
                <span className="font-medium ml-2">156</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Total Sprints:</span>
                <span className="font-medium ml-2">12</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Team Members:</span>
                <span className="font-medium ml-2">8</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Last Backup:</span>
                <span className="font-medium ml-2">Never</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Shortcuts Settings Tab
function ShortcutsSettings() {
  const shortcuts = [
    { key: 'Cmd/Ctrl + K', description: 'Open command palette' },
    { key: 'Cmd/Ctrl + N', description: 'Create new issue' },
    { key: 'Cmd/Ctrl + /', description: 'Show keyboard shortcuts' },
    { key: 'Cmd/Ctrl + B', description: 'Toggle sidebar' },
    { key: 'G then D', description: 'Go to Dashboard' },
    { key: 'G then I', description: 'Go to Issues' },
    { key: 'G then S', description: 'Go to Sprint' },
    { key: 'ESC', description: 'Close modal/drawer' },
  ]
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
      
      <div className="space-y-3">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[var(--bg-subtle)] rounded-lg"
          >
            <span className="text-sm">{shortcut.description}</span>
            <kbd className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded text-xs font-mono">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">Pro Tips</h4>
        <ul className="text-sm space-y-1 text-[var(--text-secondary)]">
          <li>• Press <kbd className="text-xs">?</kbd> anytime to see all shortcuts</li>
          <li>• Use <kbd className="text-xs">Cmd + K</kbd> for quick navigation</li>
          <li>• Combine <kbd className="text-xs">G</kbd> with letter keys for fast page switching</li>
        </ul>
      </div>
    </Card>
  )
}
```

---

Czy chcesz, żebym kontynuował z:
1. **Export Reports funkcjonalność** (PDF/CSV/Excel)
2. **Command Palette** (pełna implementacja)
3. **Notification Center** (kompletny)
4. **Issue Detail View** (right drawer z komentarzami, activity log, dependencies)
5. **Backend API szczegóły** dla wszystkich endpointów?

# MASTER PROMPT: TaskFlow - Kontynuacja (Część 3)

---

## 📤 EXPORT REPORTS - Pełna Implementacja

```typescript
// components/features/reports/export-reports.tsx

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioItem } from '@/components/ui/radio-group'
import { Download, FileText, FileSpreadsheet, FileImage, Loader2 } from 'lucide-react'

interface ExportReportsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: 'sprint' | 'team' | 'velocity' | 'custom'
  reportData?: any
}

export function ExportReportsDialog({
  open,
  onOpenChange,
  reportType,
  reportData
}: ExportReportsProps) {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx' | 'png'>('pdf')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [dateRange, setDateRange] = useState<'current' | 'last-month' | 'last-quarter' | 'custom'>('current')
  const [selectedSections, setSelectedSections] = useState<string[]>(['summary', 'details', 'charts'])
  
  const exportMutation = useMutation({
    mutationFn: async () => {
      const exportConfig = {
        format,
        reportType,
        dateRange,
        includeCharts,
        sections: selectedSections,
        data: reportData
      }
      
      const response = await api.reports.export(exportConfig)
      return response
    },
    onSuccess: (data) => {
      // Trigger download
      const blob = new Blob([data.file], { 
        type: data.mimeType 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.filename
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to export report')
    }
  })
  
  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Best for presentations' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Raw data only' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Data with formatting' },
    { value: 'png', label: 'PNG', icon: FileImage, description: 'Image snapshot' },
  ]
  
  const availableSections = getAvailableSections(reportType)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as any)}
                  className={`
                    p-4 border rounded-lg text-left transition-all
                    ${format === option.value 
                      ? 'border-[var(--brand-primary)] bg-[var(--bg-subtle)]' 
                      : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <option.icon className="w-5 h-5" />
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Date Range
            </label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <option value="current">Current Period</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="custom">Custom Range</option>
            </Select>
          </div>
          
          {/* Sections to Include */}
          {format !== 'csv' && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Include Sections
              </label>
              <div className="space-y-2">
                {availableSections.map((section) => (
                  <div key={section.key} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSections.includes(section.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSections([...selectedSections, section.key])
                        } else {
                          setSelectedSections(selectedSections.filter(s => s !== section.key))
                        }
                      }}
                    />
                    <label className="text-sm">
                      {section.label}
                      <span className="text-xs text-[var(--text-secondary)] ml-2">
                        {section.description}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Include Charts */}
          {(format === 'pdf' || format === 'xlsx') && (
            <div className="flex items-center justify-between p-3 bg-[var(--bg-subtle)] rounded-lg">
              <div>
                <label className="text-sm font-medium">Include Charts & Visualizations</label>
                <p className="text-xs text-[var(--text-secondary)]">
                  Add visual representations of data
                </p>
              </div>
              <Checkbox
                checked={includeCharts}
                onCheckedChange={setIncludeCharts}
              />
            </div>
          )}
          
          {/* Preview Info */}
          <div className="p-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Export Preview</h4>
            <div className="text-xs space-y-1 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatOptions.find(f => f.value === format)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sections:</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {selectedSections.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Size:</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {estimateFileSize(format, selectedSections, includeCharts)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending || selectedSections.length === 0}
            >
              {exportMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getAvailableSections(reportType: string) {
  const sections = {
    sprint: [
      { key: 'summary', label: 'Executive Summary', description: 'Key metrics overview' },
      { key: 'burndown', label: 'Burndown Chart', description: 'Progress visualization' },
      { key: 'cfd', label: 'Cumulative Flow', description: 'Status distribution' },
      { key: 'issues', label: 'Issue Details', description: 'Complete issue list' },
      { key: 'team', label: 'Team Performance', description: 'Individual contributions' },
    ],
    team: [
      { key: 'summary', label: 'Team Summary', description: 'Overall metrics' },
      { key: 'workload', label: 'Workload Distribution', description: 'Task allocation' },
      { key: 'performance', label: 'Performance Metrics', description: 'Efficiency data' },
      { key: 'trends', label: 'Historical Trends', description: 'Time-series data' },
    ],
    velocity: [
      { key: 'summary', label: 'Velocity Summary', description: 'Average velocity' },
      { key: 'chart', label: 'Velocity Chart', description: 'Sprint-by-sprint' },
      { key: 'comparison', label: 'Sprint Comparison', description: 'Detailed breakdown' },
      { key: 'forecast', label: 'Forecast', description: 'Future predictions' },
    ],
  }
  
  return sections[reportType] || sections.sprint
}

function estimateFileSize(format: string, sections: string[], includeCharts: boolean) {
  let baseSize = 100 // KB
  baseSize += sections.length * 50
  if (includeCharts) baseSize += 200
  
  const multipliers = {
    pdf: 1.5,
    csv: 0.3,
    xlsx: 1.2,
    png: 2.0,
  }
  
  const estimated = Math.round(baseSize * multipliers[format])
  return estimated < 1024 ? `${estimated} KB` : `${(estimated / 1024).toFixed(1)} MB`
}
```

### Backend Export Implementation

```typescript
// backend/src/services/export.service.ts

import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import { createCanvas } from 'canvas'
import ChartJSNodeCanvas from 'chartjs-node-canvas'

export class ExportService {
  // PDF Export
  async exportToPDF(config: ExportConfig): Promise<Buffer> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    })
    
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))
    
    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(config.title, { align: 'center' })
      .moveDown()
    
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Generated: ${format(new Date(), 'PPpp')}`, { align: 'right' })
      .moveDown(2)
    
    // Sections
    for (const section of config.sections) {
      await this.addPDFSection(doc, section, config.data)
    }
    
    // Charts
    if (config.includeCharts) {
      for (const chart of config.charts) {
        await this.addChartToPDF(doc, chart)
      }
    }
    
    doc.end()
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })
  }
  
  private async addPDFSection(doc: PDFDocument, section: any, data: any) {
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(section.title)
      .moveDown()
    
    doc
      .fontSize(10)
      .font('Helvetica')
    
    switch (section.type) {
      case 'summary':
        this.addSummarySection(doc, data.summary)
        break
      case 'table':
        await this.addTableSection(doc, data.table)
        break
      case 'list':
        this.addListSection(doc, data.list)
        break
    }
    
    doc.moveDown(2)
  }
  
  private async addChartToPDF(doc: PDFDocument, chart: any) {
    const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 })
    
    const image = await chartCanvas.renderToBuffer({
      type: chart.type,
      data: chart.data,
      options: chart.options,
    })
    
    doc.addPage()
    doc.image(image, {
      fit: [500, 300],
      align: 'center',
    })
  }
  
  // Excel Export
  async exportToExcel(config: ExportConfig): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    
    workbook.creator = 'TaskFlow'
    workbook.created = new Date()
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary')
    this.addExcelSummary(summarySheet, config.data.summary)
    
    // Data Sheets
    for (const section of config.sections) {
      const sheet = workbook.addWorksheet(section.title)
      await this.addExcelSection(sheet, section, config.data)
    }
    
    // Styling
    workbook.eachSheet(sheet => {
      sheet.getRow(1).font = { bold: true }
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2D5BFF' },
      }
      sheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } }
      
      sheet.columns.forEach(column => {
        column.width = 15
      })
    })
    
    return workbook.xlsx.writeBuffer() as Promise<Buffer>
  }
  
  private addExcelSummary(sheet: ExcelJS.Worksheet, summary: any) {
    sheet.addRow(['Metric', 'Value'])
    
    Object.entries(summary).forEach(([key, value]) => {
      sheet.addRow([
        key.replace(/([A-Z])/g, ' $1').trim(),
        value
      ])
    })
  }
  
  private async addExcelSection(
    sheet: ExcelJS.Worksheet,
    section: any,
    data: any
  ) {
    if (section.type === 'table') {
      // Headers
      sheet.addRow(section.columns.map(col => col.header))
      
      // Data
      section.data.forEach(row => {
        sheet.addRow(section.columns.map(col => row[col.key]))
      })
      
      // Auto-filter
      sheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + section.columns.length - 1)}1`
      }
    }
  }
  
  // CSV Export
  async exportToCSV(config: ExportConfig): Promise<string> {
    const rows: string[][] = []
    
    // Header
    rows.push(['TaskFlow Export Report'])
    rows.push(['Generated', format(new Date(), 'PPpp')])
    rows.push([])
    
    // Data
    if (config.data.table) {
      // Column headers
      rows.push(config.data.table.columns.map(col => col.header))
      
      // Data rows
      config.data.table.data.forEach(row => {
        rows.push(
          config.data.table.columns.map(col => 
            this.escapeCSVValue(row[col.key])
          )
        )
      })
    }
    
    return rows.map(row => row.join(',')).join('\n')
  }
  
  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  
  // PNG Export (Screenshot)
  async exportToPNG(config: ExportConfig): Promise<Buffer> {
    // This would typically use Puppeteer to take a screenshot
    // of the rendered dashboard/report
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    await page.setViewport({ width: 1920, height: 1080 })
    
    // Render the report as HTML
    const html = this.generateReportHTML(config)
    await page.setContent(html)
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    })
    
    await browser.close()
    
    return screenshot as Buffer
  }
  
  private generateReportHTML(config: ExportConfig): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Inter, sans-serif;
              padding: 40px;
              background: #0A0B0F;
              color: #F1F3F5;
            }
            .header {
              margin-bottom: 40px;
            }
            .metric-card {
              background: #13141A;
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${config.title}</h1>
            <p>${format(new Date(), 'PPpp')}</p>
          </div>
          ${this.renderSections(config)}
        </body>
      </html>
    `
  }
}
```

---

## 🎯 COMMAND PALETTE - Pełna Implementacja

```typescript
// components/features/command-palette/command-palette.tsx

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileText,
  Calendar,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Zap,
  Hash,
} from 'lucide-react'
import Fuse from 'fuse.js'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  shortcut?: string[]
  action: () => void
  group: string
  keywords?: string[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  
  // Fetch recent items for quick access
  const { data: recentIssues } = useQuery({
    queryKey: ['recent-issues'],
    queryFn: api.issues.getRecent,
    enabled: open,
  })
  
  const { data: recentSprints } = useQuery({
    queryKey: ['recent-sprints'],
    queryFn: api.sprints.getRecent,
    enabled: open,
  })
  
  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Build command list
  const commands = useMemo<Command[]>(() => {
    const baseCommands: Command[] = [
      // Navigation
      {
        id: 'nav-dashboard',
        label: 'Go to Dashboard',
        icon: <TrendingUp className="w-4 h-4" />,
        action: () => navigate('/'),
        group: 'Navigation',
        shortcut: ['G', 'D'],
        keywords: ['home', 'overview'],
      },
      {
        id: 'nav-issues',
        label: 'Go to Issues',
        icon: <FileText className="w-4 h-4" />,
        action: () => navigate('/issues'),
        group: 'Navigation',
        shortcut: ['G', 'I'],
        keywords: ['tasks', 'tickets'],
      },
      {
        id: 'nav-sprint',
        label: 'Go to Current Sprint',
        icon: <Calendar className="w-4 h-4" />,
        action: () => navigate('/sprint'),
        group: 'Navigation',
        shortcut: ['G', 'S'],
      },
      {
        id: 'nav-teams',
        label: 'Go to Teams',
        icon: <Users className="w-4 h-4" />,
        action: () => navigate('/teams'),
        group: 'Navigation',
        shortcut: ['G', 'T'],
      },
      
      // Actions
      {
        id: 'action-new-issue',
        label: 'Create New Issue',
        icon: <Plus className="w-4 h-4" />,
        action: () => {
          setOpen(false)
          // Trigger issue creation modal
          window.dispatchEvent(new CustomEvent('open-issue-form'))
        },
        group: 'Actions',
        shortcut: ['Cmd/Ctrl', 'N'],
      },
      {
        id: 'action-new-sprint',
        label: 'Create New Sprint',
        icon: <Plus className="w-4 h-4" />,
        action: () => {
          setOpen(false)
          window.dispatchEvent(new CustomEvent('open-sprint-form'))
        },
        group: 'Actions',
      },
      
      // Settings
      {
        id: 'settings',
        label: 'Open Settings',
        icon: <Settings className="w-4 h-4" />,
        action: () => navigate('/settings'),
        group: 'System',
        shortcut: ['Cmd/Ctrl', ','],
      },
      {
        id: 'automation',
        label: 'Automation Rules',
        icon: <Zap className="w-4 h-4" />,
        action: () => navigate('/automation'),
        group: 'System',
      },
    ]
    
    // Add recent issues
    const issueCommands: Command[] = recentIssues?.map(issue => ({
      id: `issue-${issue.id}`,
      label: issue.title,
      description: `${issue.identifier} • ${issue.status}`,
      icon: <Hash className="w-4 h-4" />,
      action: () => navigate(`/issues/${issue.id}`),
      group: 'Recent Issues',
      keywords: [issue.identifier, issue.status],
    })) || []
    
    // Add recent sprints
    const sprintCommands: Command[] = recentSprints?.map(sprint => ({
      id: `sprint-${sprint.id}`,
      label: sprint.name,
      description: `${sprint.status} • ${format(new Date(sprint.startDate), 'MMM d')}`,
      icon: <Calendar className="w-4 h-4" />,
      action: () => navigate(`/sprints/${sprint.id}`),
      group: 'Recent Sprints',
    })) || []
    
    return [...baseCommands, ...issueCommands, ...sprintCommands]
  }, [navigate, recentIssues, recentSprints])
  
  // Fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(commands, {
      keys: ['label', 'description', 'keywords', 'group'],
      threshold: 0.3,
      includeScore: true,
    })
  }, [commands])
  
  const filteredCommands = useMemo(() => {
    if (!search) return commands
    return fuse.search(search).map(result => result.item)
  }, [search, commands, fuse])
  
  // Group commands
  const groupedCommands = useMemo(() => {
    const groups = new Map<string, Command[]>()
    
    filteredCommands.forEach(command => {
      if (!groups.has(command.group)) {
        groups.set(command.group, [])
      }
      groups.get(command.group)!.push(command)
    })
    
    return Array.from(groups.entries())
  }, [filteredCommands])
  
  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => 
            Math.min(i + 1, filteredCommands.length - 1)
          )
          break
          
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
          
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
            setOpen(false)
            setSearch('')
          }
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex])
  
  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="command-palette">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border-subtle)]">
            <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              autoFocus
            />
            <kbd className="px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded text-xs font-mono">
              ESC
            </kbd>
          </div>
          
          {/* Command List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {groupedCommands.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">
                <p>No commands found</p>
              </div>
            ) : (
              groupedCommands.map(([group, groupCommands], groupIndex) => (
                <div key={group} className={groupIndex > 0 ? 'mt-4' : ''}>
                  <div className="px-3 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
                    {group}
                  </div>
                  <div className="space-y-1">
                    {groupCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command)
                      const isSelected = globalIndex === selectedIndex
                      
                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action()
                            setOpen(false)
                            setSearch('')
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-md
                            transition-colors text-left
                            ${isSelected 
                              ? 'bg-[var(--bg-hover)]' 
                              : 'hover:bg-[var(--bg-hover)]'
                            }
                          `}
                        >
                          <div className="flex-shrink-0 text-[var(--text-secondary)]">
                            {command.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] text-sm">
                              {command.label}
                            </div>
                            {command.description && (
                              <div className="text-xs text-[var(--text-secondary)] truncate">
                                {command.description}
                              </div>
                            )}
                          </div>
                          
                          {command.shortcut && (
                            <div className="flex items-center gap-1">
                              {command.shortcut.map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded text-xs font-mono"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer Hints */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-base)] border border-[var(--border-default)] rounded font-mono">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-base)] border border-[var(--border-default)] rounded font-mono">
                  ↵
                </kbd>
                Select
              </span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for programmatic access
export function useCommandPalette() {
  const open = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    }))
  }
  
  return { open }
}
```

---

## 🔔 NOTIFICATION CENTER - Kompletna Implementacja

```typescript
// components/features/notifications/notification-center.tsx

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  AlertCircle,
  MessageSquare,
  GitPullRequest,
  Calendar,
  Zap,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: 'issue_assigned' | 'comment' | 'mention' | 'sprint_ending' | 'automation_failed' | 'pr_review'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  metadata?: {
    issueId?: string
    sprintId?: string
    userId?: string
    url?: string
  }
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const queryClient = useQueryClient()
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => api.notifications.list(filter),
    refetchInterval: 30000, // Poll every 30s
  })
  
  const markAsReadMutation = useMutation({
    mutationFn: api.notifications.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
  
  const markAllAsReadMutation = useMutation({
    mutationFn: api.notifications.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: api.notifications.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0
  
  // WebSocket for real-time notifications
  useEffect(() => {
    if (!open) return
    
    const ws = new WebSocket(import.meta.env.VITE_WS_URL)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'notification') {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.notification.title, {
            body: data.notification.message,
            icon: '/logo.png',
          })
        }
      }
    }
    
    return () => ws.close()
  }, [open, queryClient])
  
  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent
        className="w-[420px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="notification-center">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-semibold">Notifications</h3>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                >
                  <CheckCheck className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Open settings */}}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="w-full border-b border-[var(--border-subtle)] rounded-none">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
            
            {/* Notification List */}
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <NotificationsSkeleton />
              ) : notifications?.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {filter === 'unread' 
                      ? 'No unread notifications'
                      : 'All caught up!'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={() => markAsReadMutation.mutate(notification.id)}
                      onDelete={() => deleteMutation.mutate(notification.id)}
                      onClick={() => {
                        if (notification.metadata?.url) {
                          window.location.href = notification.metadata.url
                        }
                        if (!notification.isRead) {
                          markAsReadMutation.mutate(notification.id)
                        }
                        setOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Notification Item Component
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: {
  notification: Notification
  onMarkAsRead: () => void
  onDelete: () => void
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={`
        p-4 cursor-pointer transition-colors
        ${!notification.isRead ? 'bg-[var(--bg-subtle)]' : ''}
        hover:bg-[var(--bg-hover)]
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${getNotificationColor(notification.type)}
        `}>
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-[var(--text-primary)]">
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-tertiary)]">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            {/* Quick Actions */}
            {isHovered && (
              <div className="flex items-center gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead()
                    }}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getNotificationIcon(type: Notification['type']) {
  const icons = {
    issue_assigned: <AlertCircle className="w-5 h-5" />,
    comment: <MessageSquare className="w-5 h-5" />,
    mention: <MessageSquare className="w-5 h-5" />,
    sprint_ending: <Calendar className="w-5 h-5" />,
    automation_failed: <Zap className="w-5 h-5" />,
    pr_review: <GitPullRequest className="w-5 h-5" />,
  }
  return icons[type] || <Bell className="w-5 h-5" />
}

function getNotificationColor(type: Notification['type']) {
  const colors = {
    issue_assigned: 'bg-[var(--brand-primary)] bg-opacity-10 text-[var(--brand-primary)]',
    comment: 'bg-[var(--info-bg)] text-[var(--info)]',
    mention: 'bg-[var(--warning-bg)] text-[var(--warning)]',
    sprint_ending: 'bg-[var(--warning-bg)] text-[var(--warning)]',
    automation_failed: 'bg-[var(--error-bg)] text-[var(--error)]',
    pr_review: 'bg-[var(--success-bg)] text-[var(--success)]',
  }
  return colors[type] || 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
}

function NotificationsSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--bg-subtle)] rounded animate-pulse w-3/4" />
            <div className="h-3 bg-[var(--bg-subtle)] rounded animate-pulse w-full" />
            <div className="h-3 bg-[var(--bg-subtle)] rounded animate-pulse w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

Czy chcesz, żebym kontynuował z:
1. **Issue Detail View** (right drawer z pełną funkcjonalnością)
2. **Backend API szczegóły** dla wszystkich endpointów
3. **WebSocket implementation** (real-time updates)
4. **Authentication & Authorization** (kompletny system)
5. **Testing strategy** (unit, integration, e2e)?
# MASTER PROMPT: TaskFlow - Kontynuacja (Część 4)

---

## 📝 ISSUE DETAIL VIEW - Pełna Implementacja (Right Drawer)

```typescript
// components/features/issues/issue-detail-view.tsx

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import {
  X,
  MoreHorizontal,
  Edit,
  Trash2,
  Link2,
  Calendar,
  User,
  Tag,
  Clock,
  MessageSquare,
  Activity,
  Paperclip,
  GitBranch,
  AlertTriangle,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import ReactMarkdown from 'react-markdown'

interface IssueDetailViewProps {
  issueId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IssueDetailView({
  issueId,
  open,
  onOpenChange,
}: IssueDetailViewProps) {
  const [activeTab, setActiveTab] = useState('comments')
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  
  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => api.issues.getById(issueId!),
    enabled: !!issueId && open,
  })
  
  const { data: comments } = useQuery({
    queryKey: ['issue-comments', issueId],
    queryFn: () => api.issues.getComments(issueId!),
    enabled: !!issueId && open,
  })
  
  const { data: activity } = useQuery({
    queryKey: ['issue-activity', issueId],
    queryFn: () => api.issues.getActivity(issueId!),
    enabled: !!issueId && open,
  })
  
  const { data: dependencies } = useQuery({
    queryKey: ['issue-dependencies', issueId],
    queryFn: () => api.issues.getDependencies(issueId!),
    enabled: !!issueId && open,
  })
  
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Issue>) => 
      api.issues.update(issueId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] })
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      toast.success('Issue updated successfully')
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: () => api.issues.delete(issueId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      onOpenChange(false)
      toast.success('Issue deleted successfully')
    },
  })
  
  // Reset tab when opening new issue
  useEffect(() => {
    if (open) {
      setActiveTab('comments')
      setIsEditing(false)
    }
  }, [issueId, open])
  
  if (!issue && !isLoading) return null
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full w-[640px] max-w-[90vw]">
        {isLoading ? (
          <IssueDetailSkeleton />
        ) : (
          <>
            {/* Header */}
            <DrawerHeader className="border-b border-[var(--border-default)]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      {issue.identifier}
                    </span>
                    <Badge variant={getPriorityVariant(issue.priority)}>
                      {issue.priority}
                    </Badge>
                    <Badge variant={getStatusVariant(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  
                  {isEditing ? (
                    <IssueTitleEditor
                      issue={issue}
                      onSave={(title) => {
                        updateMutation.mutate({ title })
                        setIsEditing(false)
                      }}
                      onCancel={() => setIsEditing(false)}
                    />
                  ) : (
                    <h2 
                      className="text-xl font-semibold cursor-pointer hover:text-[var(--brand-primary)]"
                      onClick={() => setIsEditing(true)}
                    >
                      {issue.title}
                    </h2>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <IssueActions
                    issue={issue}
                    onDelete={() => deleteMutation.mutate()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DrawerHeader>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <MetadataField
                    icon={<User className="w-4 h-4" />}
                    label="Assignee"
                    value={
                      <Select
                        value={issue.assignee?.id}
                        onValueChange={(userId) =>
                          updateMutation.mutate({ assigneeId: userId })
                        }
                      >
                        {/* User options */}
                      </Select>
                    }
                  />
                  
                  <MetadataField
                    icon={<Tag className="w-4 h-4" />}
                    label="Sprint"
                    value={
                      <Select
                        value={issue.sprint?.id || 'backlog'}
                        onValueChange={(sprintId) =>
                          updateMutation.mutate({ 
                            sprintId: sprintId === 'backlog' ? null : sprintId 
                          })
                        }
                      >
                        <option value="backlog">Backlog</option>
                        {/* Sprint options */}
                      </Select>
                    }
                  />
                  
                  <MetadataField
                    icon={<Calendar className="w-4 h-4" />}
                    label="Created"
                    value={format(new Date(issue.createdAt), 'MMM d, yyyy')}
                  />
                  
                  <MetadataField
                    icon={<Clock className="w-4 h-4" />}
                    label="Updated"
                    value={formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                  />
                  
                  {issue.storyPoints && (
                    <MetadataField
                      icon={<Tag className="w-4 h-4" />}
                      label="Story Points"
                      value={
                        <input
                          type="number"
                          value={issue.storyPoints}
                          onChange={(e) =>
                            updateMutation.mutate({ 
                              storyPoints: parseInt(e.target.value) 
                            })
                          }
                          className="w-20 px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded"
                        />
                      }
                    />
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
                  {issue.description ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{issue.description}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)] italic">
                      No description provided
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Open description editor */}}
                    className="mt-2"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit Description
                  </Button>
                </div>
                
                {/* Dependencies */}
                {dependencies && dependencies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Dependencies
                    </h3>
                    <div className="space-y-2">
                      {dependencies.map((dep) => (
                        <DependencyCard key={dep.id} dependency={dep} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="comments" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Comments ({comments?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className="flex-1">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attachments
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comments" className="mt-4">
                    <CommentsSection
                      issueId={issue.id}
                      comments={comments || []}
                    />
                  </TabsContent>
                  
                  <TabsContent value="activity" className="mt-4">
                    <ActivityTimeline
                      activity={activity || []}
                    />
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="mt-4">
                    <AttachmentsSection
                      issueId={issue.id}
                      attachments={issue.attachments || []}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

// Metadata Field Component
function MetadataField({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[var(--text-tertiary)] mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[var(--text-tertiary)] mb-1">
          {label}
        </div>
        <div className="text-sm">
          {typeof value === 'string' ? (
            <span className="text-[var(--text-primary)]">{value}</span>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  )
}

// Issue Actions Dropdown
function IssueActions({ issue, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {/* Copy link */}}>
          <Link2 className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {/* Duplicate */}}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-[var(--error)]"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Comments Section
function CommentsSection({ issueId, comments }) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  
  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      api.issues.addComment(issueId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-comments', issueId] })
      queryClient.invalidateQueries({ queryKey: ['issue-activity', issueId] })
      setNewComment('')
      toast.success('Comment added')
    },
  })
  
  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setIsSubmitting(true)
    await addCommentMutation.mutateAsync(newComment)
    setIsSubmitting(false)
  }
  
  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment... (Markdown supported)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-[var(--text-tertiary)]">
            Tip: Use @mention to notify team members
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} issueId={issueId} />
          ))
        )}
      </div>
    </div>
  )
}

// Comment Card
function CommentCard({ comment, issueId }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const queryClient = useQueryClient()
  
  const updateMutation = useMutation({
    mutationFn: (content: string) =>
      api.issues.updateComment(issueId, comment.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-comments', issueId] })
      setIsEditing(false)
      toast.success('Comment updated')
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: () => api.issues.deleteComment(issueId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-comments', issueId] })
      toast.success('Comment deleted')
    },
  })
  
  const isAuthor = comment.author.id === currentUser.id
  
  return (
    <div className="flex gap-3">
      <Avatar
        src={comment.author.avatar}
        name={comment.author.name}
        size="sm"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm">
            {comment.author.name}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {comment.edited && (
            <span className="text-xs text-[var(--text-tertiary)] italic">
              (edited)
            </span>
          )}
          
          {isAuthor && (
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateMutation.mutate(editedContent)}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(comment.content)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

// Activity Timeline
function ActivityTimeline({ activity }) {
  return (
    <div className="space-y-3">
      {activity.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No activity yet</p>
        </div>
      ) : (
        activity.map((item, index) => (
          <ActivityItem
            key={item.id}
            item={item}
            isLast={index === activity.length - 1}
          />
        ))
      )}
    </div>
  )
}

// Activity Item
function ActivityItem({ item, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="relative flex flex-col items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${getActivityColor(item.type)}
        `}>
          {getActivityIcon(item.type)}
        </div>
        {!isLast && (
          <div className="w-px h-full bg-[var(--border-subtle)] absolute top-8" />
        )}
      </div>
      
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {item.user.name}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          {getActivityDescription(item)}
        </p>
      </div>
    </div>
  )
}

function getActivityIcon(type: string) {
  const icons = {
    created: <Plus className="w-4 h-4" />,
    status_changed: <ArrowRight className="w-4 h-4" />,
    assigned: <User className="w-4 h-4" />,
    commented: <MessageSquare className="w-4 h-4" />,
    priority_changed: <AlertTriangle className="w-4 h-4" />,
    moved_to_sprint: <Calendar className="w-4 h-4" />,
  }
  return icons[type] || <Activity className="w-4 h-4" />
}

function getActivityColor(type: string) {
  const colors = {
    created: 'bg-[var(--success-bg)] text-[var(--success)]',
    status_changed: 'bg-[var(--info-bg)] text-[var(--info)]',
    assigned: 'bg-[var(--brand-primary)] bg-opacity-10 text-[var(--brand-primary)]',
    commented: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
    priority_changed: 'bg-[var(--warning-bg)] text-[var(--warning)]',
    moved_to_sprint: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
  }
  return colors[type] || 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
}

function getActivityDescription(item: ActivityItem) {
  switch (item.type) {
    case 'created':
      return 'created this issue'
    case 'status_changed':
      return `changed status from ${item.metadata.from} to ${item.metadata.to}`
    case 'assigned':
      return `assigned to ${item.metadata.assignee}`
    case 'commented':
      return 'added a comment'
    case 'priority_changed':
      return `changed priority from ${item.metadata.from} to ${item.metadata.to}`
    case 'moved_to_sprint':
      return `moved to sprint ${item.metadata.sprint}`
    default:
      return item.description
  }
}

// Attachments Section
function AttachmentsSection({ issueId, attachments }) {
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()
  
  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.issues.uploadAttachment(issueId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] })
      toast.success('File uploaded')
    },
  })
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    await uploadMutation.mutateAsync(file)
    setIsUploading(false)
    e.target.value = ''
  }
  
  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button as="span" variant="outline" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Paperclip className="w-4 h-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </label>
      </div>
      
      {attachments.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No attachments</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {attachments.map((attachment) => (
            <AttachmentCard key={attachment.id} attachment={attachment} />
          ))}
        </div>
      )}
    </div>
  )
}

// Attachment Card
function AttachmentCard({ attachment }) {
  const isImage = attachment.mimeType.startsWith('image/')
  
  return (
    
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 border border-[var(--border-default)] rounded-lg hover:border-[var(--border-strong)] transition-colors"
    >
      {isImage ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      ) : (
        <div className="w-full h-32 bg-[var(--bg-subtle)] rounded mb-2 flex items-center justify-center">
          <Paperclip className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
      )}
      <p className="text-sm font-medium truncate">{attachment.name}</p>
      <p className="text-xs text-[var(--text-tertiary)]">
        {formatBytes(attachment.size)}
      </p>
    </a>
  )
}

// Dependency Card
function DependencyCard({ dependency }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--bg-subtle)] rounded-lg">
      <div className={`
        px-2 py-1 rounded text-xs font-medium
        ${dependency.type === 'blocks' 
          ? 'bg-[var(--error-bg)] text-[var(--error)]' 
          : 'bg-[var(--info-bg)] text-[var(--info)]'
        }
      `}>
        {dependency.type === 'blocks' ? 'Blocks' : 'Blocked by'}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {dependency.issue.title}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {dependency.issue.identifier} • {dependency.issue.status}
        </p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {/* Open dependency issue */}}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
```

---

## 🔌 BACKEND API - Kompletna Specyfikacja

```typescript
// backend/src/routes/api.routes.ts

import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { validate } from '@/middleware/validation'
import { IssuesController } from '@/controllers/issues.controller'
import { SprintsController } from '@/controllers/sprints.controller'
import { TeamsController } from '@/controllers/teams.controller'
import { ReportsController } from '@/controllers/reports.controller'
import { AutomationController } from '@/controllers/automation.controller'
import { NotificationsController } from '@/controllers/notifications.controller'

const router = Router()

// Apply authentication to all routes
router.use(authenticate)

// ========== ISSUES ==========

/**
 * @route   GET /api/issues
 * @desc    Get all issues with filtering and pagination
 * @access  Private
 * @query   {
 *   page?: number
 *   limit?: number
 *   status?: string[]
 *   priority?: string[]
 *   assignee?: string
 *   sprint?: string
 *   search?: string
 *   sortBy?: 'createdAt' | 'updatedAt' | 'priority'
 *   sortOrder?: 'asc' | 'desc'
 * }
 */
router.get(
  '/issues',
  validate('getIssues'),
  IssuesController.list
)

/**
 * @route   GET /api/issues/:id
 * @desc    Get single issue by ID
 * @access  Private
 */
router.get(
  '/issues/:id',
  validate('getIssue'),
  IssuesController.getById
)

/**
 * @route   POST /api/issues
 * @desc    Create new issue
 * @access  Private
 * @body    {
 *   title: string (required)
 *   description?: string
 *   priority: 'P0' | 'P1' | 'P2' | 'P3' (required)
 *   status?: 'Todo' | 'In Progress' | 'In Review' | 'Done'
 *   assigneeId: string (required)
 *   sprintId?: string
 *   storyPoints?: number
 *   labels?: string[]
 * }
 */
router.post(
  '/issues',
  validate('createIssue'),
  IssuesController.create
)

/**
 * @route   PATCH /api/issues/:id
 * @desc    Update issue
 * @access  Private
 */
router.patch(
  '/issues/:id',
  validate('updateIssue'),
  IssuesController.update
)

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete issue
 * @access  Private (Admin or Author only)
 */
router.delete(
  '/issues/:id',
  authorize(['admin', 'team_lead']),
  IssuesController.delete
)

/**
 * @route   GET /api/issues/:id/comments
 * @desc    Get all comments for an issue
 * @access  Private
 */
router.get(
  '/issues/:id/comments',
  IssuesController.getComments
)

/**
 * @route   POST /api/issues/:id/comments
 * @desc    Add comment to issue
 * @access  Private
 * @body    { content: string }
 */
router.post(
  '/issues/:id/comments',
  validate('addComment'),
  IssuesController.addComment
)

/**
 * @route   PATCH /api/issues/:id/comments/:commentId
 * @desc    Update comment
 * @access  Private (Author only)
 */
router.patch(
  '/issues/:id/comments/:commentId',
  validate('updateComment'),
  IssuesController.updateComment
)

/**
 * @route   DELETE /api/issues/:id/comments/:commentId
 * @desc    Delete comment
 * @access  Private (Author or Admin only)
 */
router.delete(
  '/issues/:id/comments/:commentId',
  IssuesController.deleteComment
)

/**
 * @route   GET /api/issues/:id/activity
 * @desc    Get activity log for issue
 * @access  Private
 */
router.get(
  '/issues/:id/activity',
  IssuesController.getActivity
)

/**
 * @route   GET /api/issues/:id/dependencies
 * @desc    Get issue dependencies
 * @access  Private
 */
router.get(
  '/issues/:id/dependencies',
  IssuesController.getDependencies
)

/**
 * @route   POST /api/issues/:id/dependencies
 * @desc    Add dependency
 * @access  Private
 * @body    {
 *   targetIssueId: string
 *   type: 'blocks' | 'blocked_by'
 * }
 */
router.post(
  '/issues/:id/dependencies',
  validate('addDependency'),
  IssuesController.addDependency
)

/**
 * @route   POST /api/issues/:id/attachments
 * @desc    Upload attachment
 * @access  Private
 */
router.post(
  '/issues/:id/attachments',
  upload.single('file'),
  IssuesController.uploadAttachment
)

// ========== SPRINTS ==========

/**
 * @route   GET /api/sprints
 * @desc    Get all sprints
 * @access  Private
 * @query   {
 *   status?: 'Active' | 'Planned' | 'Completed'
 *   teamId?: string
 * }
 */
router.get(
  '/sprints',
  validate('getSprints'),
  SprintsController.list
)

/**
 * @route   GET /api/sprints/active
 * @desc    Get active sprint
 * @access  Private
 */
router.get(
  '/sprints/active',
  SprintsController.getActive
)

/**
 * @route   GET /api/sprints/:id
 * @desc    Get sprint by ID
 * @access  Private
 */
router.get(
  '/sprints/:id',
  SprintsController.getById
)

/**
 * @route   POST /api/sprints
 * @desc    Create new sprint
 * @access  Private (Team Lead or Admin)
 * @body    {
 *   name: string (required)
 *   startDate: Date (required)
 *   endDate: Date (required)
 *   goal?: string
 *   teamId?: string
 * }
 */
router.post(
  '/sprints',
  authorize(['admin', 'team_lead']),
  validate('createSprint'),
  SprintsController.create
)

/**
 * @route   PATCH /api/sprints/:id
 * @desc    Update sprint
 * @access  Private (Team Lead or Admin)
 */
router.patch(
  '/sprints/:id',
  authorize(['admin', 'team_lead']),
  validate('updateSprint'),
  SprintsController.update
)

/**
 * @route   POST /api/sprints/:id/start
 * @desc    Start sprint (change status to Active)
 * @access  Private (Team Lead or Admin)
 */
router.post(
  '/sprints/:id/start',
  authorize(['admin', 'team_lead']),
  SprintsController.start
)

/**
 * @route   POST /api/sprints/:id/complete
 * @desc    Complete sprint
 * @access  Private (Team Lead or Admin)
 * @body    {
 *   moveIncompleteToBacklog: boolean
 *   moveIncompleteTo?: string (sprint ID)
 * }
 */
router.post(
  '/sprints/:id/complete',
  authorize(['admin', 'team_lead']),
  validate('completeSprint'),
  SprintsController.complete
)

/**
 * @route   DELETE /api/sprints/:id
 * @desc    Delete sprint (only if Planned)
 * @access  Private (Admin only)
 */
router.delete(
  '/sprints/:id',
  authorize(['admin']),
  SprintsController.delete
)

// ========== TEAMS ==========

/**
 * @route   GET /api/teams
 * @desc    Get all teams
 * @access  Private
 */
router.get(
  '/teams',
  TeamsController.list
)

/**
 * @route   GET /api/teams/:id
 * @desc    Get team by ID with members
 * @access  Private
 */
router.get(
  '/teams/:id',
  TeamsController.getById
)

/**
 * @route   POST /api/teams
 * @desc    Create new team
 * @access  Private (Admin only)
 * @body    {
 *   name: string (required)
 *   description?: string
 *   leadId: string (required)
 *   memberIds: string[]
 *   color?: string
 * }
 */
router.post(
  '/teams',
  authorize(['admin']),
  validate('createTeam'),
  TeamsController.create
)

/**
 * @route   PATCH /api/teams/:id
 * @desc    Update team
 * @access  Private (Admin or Team Lead)
 */
router.patch(
  '/teams/:id',
  authorize(['admin', 'team_lead']),
  validate('updateTeam'),
  TeamsController.update
)

/**
 * @route   POST /api/teams/:id/members
 * @desc    Add member to team
 * @access  Private (Admin or Team Lead)
 * @body    { userId: string }
 */
router.post(
  '/teams/:id/members',
  authorize(['admin', 'team_lead']),
  validate('addTeamMember'),
  TeamsController.addMember
)

/**
 * @route   DELETE /api/teams/:id/members/:userId
 * @desc    Remove member from team
 * @access  Private (Admin or Team Lead)
 */
router.delete(
  '/teams/:id/members/:userId',
  authorize(['admin', 'team_lead']),
  TeamsController.removeMember
)

// ========== REPORTS ==========

/**
 * @route   GET /api/reports/sprint-health/:sprintId
 * @desc    Get sprint health report
 * @access  Private
 */
router.get(
  '/reports/sprint-health/:sprintId',
  ReportsController.getSprintHealth
)

/**
 * @route   GET /api/reports/team-performance
 * @desc    Get team performance metrics
 * @access  Private
 * @query   {
 *   teamId?: string
 *   startDate: Date
 *   endDate: Date
 * }
 */
router.get(
  '/reports/team-performance',
  validate('getTeamPerformance'),
  ReportsController.getTeamPerformance
)

/**
 * @route   GET /api/reports/velocity-trends
 * @desc    Get velocity trends
 * @access  Private
 * @query   { teamId?: string, last?: number }
 */
router.get(
  '/reports/velocity-trends',
  ReportsController.getVelocityTrends
)

/**
 * @route   POST /api/reports/export
 * @desc    Export report to PDF/CSV/Excel
 * @access  Private
 * @body    {
 *   format: 'pdf' | 'csv' | 'xlsx' | 'png'
 *   reportType: string
 *   sections: string[]
 *   includeCharts: boolean
 *   data: any
 * }
 */
router.post(
  '/reports/export',
  validate('exportReport'),
  ReportsController.export
)

// ========== AUTOMATION ==========

/**
 * @route   GET /api/automation/rules
 * @desc    Get all automation rules
 * @access  Private
 */
router.get(
  '/automation/rules',
  AutomationController.listRules
)

/**
 * @route   POST /api/automation/rules
 * @desc    Create automation rule
 * @access  Private (Team Lead or Admin)
 * @body    {
 *   name: string
 *   trigger: { type: string, conditions: any }
 *   actions: Array<{ type: string, config: any }>
 *   enabled: boolean
 * }
 */
router.post(
  '/automation/rules',
  authorize(['admin', 'team_lead']),
  validate('createRule'),
  AutomationController.createRule
)

/**
 * @route   PATCH /api/automation/rules/:id
 * @desc    Update automation rule
 * @access  Private (Team Lead or Admin)
 */
router.patch(
  '/automation/rules/:id',
  authorize(['admin', 'team_lead']),
  validate('updateRule'),
  AutomationController.updateRule
)

/**
 * @route   DELETE /api/automation/rules/:id
 * @desc    Delete automation rule
 * @access  Private (Admin only)
 */
router.delete(
  '/automation/rules/:id',
  authorize(['admin']),
  AutomationController.deleteRule
)

/**
 * @route   GET /api/automation/logs
 * @desc    Get automation execution logs
 * @access  Private
 * @query   {
 *   ruleId?: string
 *   status?: 'success' | 'failed'
 *   startDate?: Date
 *   endDate?: Date
 * }
 */
router.get(
  '/automation/logs',
  AutomationController.getLogs
)

/**
 * @route   GET /api/automation/insights
 * @desc    Get AI-generated insights
 * @access  Private
 */
router.get(
  '/automation/insights',
  AutomationController.getInsights
)

/**
 * @route   POST /api/automation/insights/:id/dismiss
 * @desc    Dismiss an insight
 * @access  Private
 */
router.post(
  '/automation/insights/:id/dismiss',
  AutomationController.dismissInsight
)

/**
 * @route   POST /api/automation/insights/:id/create-task
 * @desc    Create task from insight
 * @access  Private
 */
router.post(
  '/automation/insights/:id/create-task',
  AutomationController.createTaskFromInsight
)

// ========== NOTIFICATIONS ==========

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 * @query   { filter: 'all' | 'unread' }
 */
router.get(
  '/notifications',
  NotificationsController.list
)

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch(
  '/notifications/:id/read',
  NotificationsController.markAsRead
)

/**
 * @route   POST /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.post(
  '/notifications/read-all',
  NotificationsController.markAllAsRead
)

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete(
  '/notifications/:id',
  NotificationsController.delete
)

// ========== USERS ==========

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private
 */
router.get('/users', UsersController.list)

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/users/me', UsersController.getCurrentUser)

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch(
  '/users/me',
  validate('updateProfile'),
  UsersController.updateProfile
)

// ========== DATA MANAGEMENT ==========

/**
 * @route   GET /api/data/export
 * @desc    Export all user data
 * @access  Private
 */
router.get('/data/export', DataController.export)

/**
 * @route   POST /api/data/import
 * @desc    Import data from JSON
 * @access  Private (Admin only)
 */
router.post(
  '/data/import',
  authorize(['admin']),
  DataController.import
)

export default router
```

---

## 🌐 WEBSOCKET IMPLEMENTATION

```typescript
// backend/src/services/websocket.service.ts

import { Server as SocketServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { verifyToken } from '@/utils/jwt'
import { logger } from '@/utils/logger'

interface AuthenticatedSocket extends Socket {
  userId: string
  teamIds: string[]
}

export class WebSocketService {
  private io: SocketServer
  private userSockets: Map<string, Set<string>> = new Map()
  
  constructor(httpServer: HTTPServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    })
    
    this.setupMiddleware()
    this.setupConnectionHandler()
  }
  
  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: any, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          throw new Error('No token provided')
        }
        
        const decoded = await verifyToken(token)
        socket.userId = decoded.userId
        socket.teamIds = decoded.teamIds || []
        
        next()
      } catch (error) {
        next(new Error('Authentication failed'))
      }
    })
  }
  
  private setupConnectionHandler() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logger.info(`User connected: ${socket.userId}`)
      
      // Track user sockets
      if (!this.userSockets.has(socket.userId)) {
        this.userSockets.set(socket.userId, new Set())
      }
      this.userSockets.get(socket.userId)!.add(socket.id)
      
      // Join user's personal room
      socket.join(`user:${socket.userId}`)
      
      // Join team rooms
      socket.teamIds.forEach(teamId => {
        socket.join(`team:${teamId}`)
      })
      
      // Handle issue subscriptions
      socket.on('subscribe:issue', (issueId: string) => {
        socket.join(`issue:${issueId}`)
        logger.debug(`User ${socket.userId} subscribed to issue ${issueId}`)
      })
      
      socket.on('unsubscribe:issue', (issueId: string) => {
        socket.leave(`issue:${issueId}`)
      })
      
      // Handle sprint subscriptions
      socket.on('subscribe:sprint', (sprintId: string) => {
        socket.join(`sprint:${sprintId}`)
      })
      
      socket.on('unsubscribe:sprint', (sprintId: string) => {
        socket.leave(`sprint:${sprintId}`)
      })
      
      // Handle typing indicators
      socket.on('typing:start', (data: { issueId: string }) => {
        socket.to(`issue:${data.issueId}`).emit('user:typing', {
          userId: socket.userId,
          issueId: data.issueId,
        })
      })
      
      socket.on('typing:stop', (data: { issueId: string }) => {
        socket.to(`issue:${data.issueId}`).emit('user:stopped-typing', {
          userId: socket.userId,
          issueId: data.issueId,
        })
      })
      
      // Handle presence
      this.broadcastPresence(socket.userId, 'online')
      
      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.userId}`)
        
        const userSocketSet = this.userSockets.get(socket.userId)
        if (userSocketSet) {
          userSocketSet.delete(socket.id)
          
          // If user has no more connections, mark as offline
          if (userSocketSet.size === 0) {
            this.userSockets.delete(socket.userId)
            this.broadcastPresence(socket.userId, 'offline')
          }
        }
      })
    })
  }
  
  // Public methods for emitting events
  
  /**
   * Notify specific user
   */
  public notifyUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data)
  }
  
  /**
   * Notify team
   */
  public notifyTeam(teamId: string, event: string, data: any) {
    this.io.to(`team:${teamId}`).emit(event, data)
  }
  
  /**
   * Broadcast issue update
   */
  public broadcastIssueUpdate(issueId: string, data: any) {
    this.io.to(`issue:${issueId}`).emit('issue:updated', {
      issueId,
      ...data,
    })
  }
  
  /**
   * Broadcast new comment
   */
  public broadcastNewComment(issueId: string, comment: any) {
    this.io.to(`issue:${issueId}`).emit('comment:added', {
      issueId,
      comment,
    })
  }
  
  /**
   * Broadcast sprint update
   */
  public broadcastSprintUpdate(sprintId: string, data: any) {
    this.io.to(`sprint:${sprintId}`).emit('sprint:updated', {
      sprintId,
      ...data,
    })
  }
  
  /**
   * Broadcast kanban card moved
   */
  public broadcastCardMoved(sprintId: string, data: any) {
    this.io.to(`sprint:${sprintId}`).emit('card:moved', data)
  }
  
  /**
   * Send notification to user
   */
  public sendNotification(userId: string, notification: any) {
    this.notifyUser(userId, 'notification', { notification })
  }
  
  /**
   * Broadcast automation failed
   */
  public broadcastAutomationFailed(teamId: string, data: any) {
    this.notifyTeam(teamId, 'automation:failed', data)
  }
  
  /**
   * Broadcast user presence
   */
  private broadcastPresence(userId: string, status: 'online' | 'offline') {
    this.io.emit('presence:changed', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    })
  }
  
  /**
   * Get online users count
   */
  public getOnlineUsersCount(): number {
    return this.userSockets.size
  }
  
  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId)
  }
}

// Singleton instance
let wsService: WebSocketService

export function initializeWebSocket(httpServer: HTTPServer): WebSocketService {
  wsService = new WebSocketService(httpServer)
  return wsService
}

export function getWebSocketService(): WebSocketService {
  if (!wsService) {
    throw new Error('WebSocket service not initialized')
  }
  return wsService
}
```

### Frontend WebSocket Hook

```typescript
// frontend/src/hooks/use-websocket.ts

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/auth-context'
import { useQueryClient } from '@tantml/react-query'

export function useWebSocket() {
  const { user, token } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!user || !token) return
    
    // Initialize socket connection
    const socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })
    
    socketRef.current = socket
    
    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected')
    })
    
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })
    
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
    
    // Data event handlers
    socket.on('issue:updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['issue', data.issueId] })
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    })
    
    socket.on('comment:added', (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['issue-comments', data.issueId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['issue-activity', data.issueId] 
      })
    })
    
    socket.on('sprint:updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', data.sprintId] })
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    })
    
    socket.on('card:moved', (data) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', data.sprintId] })
    })
    
    socket.on('notification', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.notification.title, {
          body: data.notification.message,
          icon: '/logo.png',
        })
      }
    })
    
    socket.on('presence:changed', (data) => {
      queryClient.setQueryData(['user-presence', data.userId], data.status)
    })
    
    socket.on('user:typing', (data) => {
      // Handle typing indicator
      queryClient.setQueryData(
        ['typing', data.issueId], 
        (old: string[] = []) => [...old, data.userId]
      )
    })
    
    socket.on('user:stopped-typing', (data) => {
      queryClient.setQueryData(
        ['typing', data.issueId],
        (old: string[] = []) => old.filter(id => id !== data.userId)
      )
    })
    
    // Cleanup
    return () => {
      socket.disconnect()
    }
  }, [user, token, queryClient])
  
  const subscribeToIssue = useCallback((issueId: string) => {
    socketRef.current?.emit('subscribe:issue', issueId)
  }, [])
  
  const unsubscribeFromIssue = useCallback((issueId: string) => {
    socketRef.current?.emit('unsubscribe:issue', issueId)
  }, [])
  
  const subscribeToSprint = useCallback((sprintId: string) => {
    socketRef.current?.emit('subscribe:sprint', sprintId)
  }, [])
  
  const unsubscribeFromSprint = useCallback((sprintId: string) => {
    socketRef.current?.emit('unsubscribe:sprint', sprintId)
  }, [])
  
  const startTyping = useCallback((issueId: string) => {
    socketRef.current?.emit('typing:start', { issueId })
  }, [])
  
  const stopTyping = useCallback((issueId: string) => {
    socketRef.current?.emit('typing:stop', { issueId })
  }, [])
  
  return {
    isConnected: socketRef.current?.connected || false,
    subscribeToIssue,
    unsubscribeFromIssue,
    subscribeToSprint,
    unsubscribeFromSprint,
    startTyping,
    stopTyping,
  }
}
```

---

Kontynuować z:
1. **Authentication & Authorization** (JWT, role-based access, refresh tokens)
2. **Testing Strategy** (unit, integration, e2e)
3. **Database Schema** (Prisma models)
4. **Deployment & DevOps** (Docker, CI/CD)?

# MASTER PROMPT: TaskFlow - Kontynuacja (Część 5)

---

## 🔐 AUTHENTICATION & AUTHORIZATION - Pełna Implementacja

### Backend Auth System

```typescript
// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'

interface JWTPayload {
  userId: string
  email: string
  role: string
  teamIds: string[]
}

interface AuthRequest extends Request {
  user?: JWTPayload
}

/**
 * Verify JWT token and attach user to request
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided')
    }
    
    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          teamMemberships: {
            select: { teamId: true }
          }
        }
      })
      
      if (!user || !user.isActive) {
        throw new ApiError(401, 'User not found or inactive')
      }
      
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        teamIds: user.teamMemberships.map(m => m.teamId)
      }
      
      next()
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'Invalid token')
      }
      throw error
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Role-based authorization middleware
 */
export function authorize(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'))
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'))
    }
    
    next()
  }
}

/**
 * Resource ownership check
 */
export async function checkOwnership(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    
    // Determine resource type from route
    const resourceType = req.path.split('/')[1] // issues, comments, etc.
    
    let isOwner = false
    
    switch (resourceType) {
      case 'issues':
        const issue = await prisma.issue.findUnique({
          where: { id },
          select: { creatorId: true }
        })
        isOwner = issue?.creatorId === userId
        break
        
      case 'comments':
        const comment = await prisma.comment.findUnique({
          where: { id },
          select: { authorId: true }
        })
        isOwner = comment?.authorId === userId
        break
        
      default:
        return next(new ApiError(400, 'Invalid resource type'))
    }
    
    if (!isOwner && req.user!.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to modify this resource'))
    }
    
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Team membership check
 */
export async function checkTeamMembership(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { teamId } = req.params
    const userId = req.user!.userId
    
    const membership = await prisma.teamMembership.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      }
    })
    
    if (!membership && req.user!.role !== 'admin') {
      return next(new ApiError(403, 'Not a member of this team'))
    }
    
    next()
  } catch (error) {
    next(error)
  }
}
```

### Auth Controller

```typescript
// backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'
import { sendEmail } from '@/services/email.service'
import crypto from 'crypto'

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response) {
    const { email, password, name } = req.body
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw new ApiError(400, 'User already exists')
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'member', // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)
    
    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })
    
    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    })
  }
  
  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    const { email, password } = req.body
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teamMemberships: {
          select: { teamId: true }
        }
      }
    })
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials')
    }
    
    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated')
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials')
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      teamIds: user.teamMemberships.map(m => m.teamId)
    })
    
    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    })
  }
  
  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required')
    }
    
    // Verify refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            teamMemberships: {
              select: { teamId: true }
            }
          }
        }
      }
    })
    
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new ApiError(401, 'Invalid or expired refresh token')
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      teamIds: storedToken.user.teamMemberships.map(m => m.teamId)
    })
    
    // Delete old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { token: refreshToken }
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: storedToken.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      })
    ])
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  }
  
  /**
   * Logout user
   */
  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.body
    
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      })
    }
    
    res.json({ message: 'Logged out successfully' })
  }
  
  /**
   * Request password reset
   */
  static async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      // Don't reveal if user exists
      return res.json({ 
        message: 'If email exists, reset link will be sent' 
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    
    // Store token (expires in 1 hour)
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      }
    })
    
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        name: user.name,
        resetUrl,
      }
    })
    
    res.json({ 
      message: 'If email exists, reset link will be sent' 
    })
  }
  
  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
    
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    })
    
    if (!resetToken) {
      throw new ApiError(400, 'Invalid or expired reset token')
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      }),
      // Invalidate all refresh tokens
      prisma.refreshToken.deleteMany({
        where: { userId: resetToken.userId }
      })
    ])
    
    res.json({ message: 'Password reset successful' })
  }
  
  /**
   * Change password (authenticated)
   */
  static async changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body
    const userId = req.user!.userId
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValid) {
      throw new ApiError(401, 'Current password is incorrect')
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    
    res.json({ message: 'Password changed successfully' })
  }
}

/**
 * Generate JWT tokens
 */
function generateTokens(user: any) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      teamIds: user.teamIds || [],
    },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' } // Short-lived access token
  )
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' } // Long-lived refresh token
  )
  
  return { accessToken, refreshToken }
}
```

### Frontend Auth Context

```typescript
// frontend/src/contexts/auth-context.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.setAuthToken(storedToken)
    }
    
    setIsLoading(false)
  }, [])
  
  // Auto refresh token
  useEffect(() => {
    if (!token) return
    
    // Refresh token every 10 minutes
    const interval = setInterval(async () => {
      try {
        await refreshToken()
      } catch (error) {
        console.error('Token refresh failed:', error)
        logout()
      }
    }, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [token])
  
  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password })
      
      setUser(response.user)
      setToken(response.accessToken)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      api.setAuthToken(response.accessToken)
      
      navigate('/')
    } catch (error) {
      throw error
    }
  }
  
  const register = async (data: RegisterData) => {
    try {
      const response = await api.auth.register(data)
      
      setUser(response.user)
      setToken(response.accessToken)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      api.setAuthToken(response.accessToken)
      
      navigate('/')
    } catch (error) {
      throw error
    }
  }
  
  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (refreshToken) {
      api.auth.logout({ refreshToken }).catch(console.error)
    }
    
    setUser(null)
    setToken(null)
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    api.setAuthToken(null)
    
    navigate('/login')
  }
  
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (!storedRefreshToken) {
      throw new Error('No refresh token')
    }
    
    try {
      const response = await api.auth.refreshToken({ 
        refreshToken: storedRefreshToken 
      })
      
      setToken(response.accessToken)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      api.setAuthToken(response.accessToken)
    } catch (error) {
      logout()
      throw error
    }
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Protected Route Component
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])
  
  if (isLoading) {
    return <LoadingScreen />
  }
  
  return isAuthenticated ? <>{children}</> : null
}
```

---

## 🗄️ DATABASE SCHEMA - Prisma Models

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== USER & AUTH ==========

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?
  role      Role     @default(MEMBER)
  isActive  Boolean  @default(true)
  
  createdAt    DateTime  @datetime @default(now())
  updatedAt    DateTime  @updatedAt
  lastLoginAt  DateTime?
  
  // Relations
  createdIssues     Issue[]           @relation("IssueCreator")
  assignedIssues    Issue[]           @relation("IssueAssignee")
  comments          Comment[]
  activityLogs      ActivityLog[]
  teamMemberships   TeamMembership[]
  notifications     Notification[]
  refreshTokens     RefreshToken[]
  passwordResets    PasswordResetToken[]
  automationRules   AutomationRule[]
  
  @@map("users")
}

enum Role {
  ADMIN
  TEAM_LEAD
  MEMBER
  GUEST
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("refresh_tokens")
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("password_reset_tokens")
}

// ========== TEAMS ==========

model Team {
  id          String  @id @default(cuid())
  name        String
  description String?
  color       String  @default("#2D5BFF")
  leadId      String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  members  TeamMembership[]
  sprints  Sprint[]
  
  @@map("teams")
}

model TeamMembership {
  id       String @id @default(cuid())
  userId   String
  teamId   String
  joinedAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  @@unique([userId, teamId])
  @@map("team_memberships")
}

// ========== ISSUES ==========

model Issue {
  id          String       @id @default(cuid())
  identifier  String       @unique // TSK-001, TSK-002, etc.
  title       String
  description String?
  priority    Priority     @default(P3)
  status      IssueStatus  @default(TODO)
  storyPoints Int?
  
  creatorId   String
  assigneeId  String?
  sprintId    String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  creator      User              @relation("IssueCreator", fields: [creatorId], references: [id])
  assignee     User?             @relation("IssueAssignee", fields: [assigneeId], references: [id])
  sprint       Sprint?           @relation(fields: [sprintId], references: [id])
  comments     Comment[]
  activityLogs ActivityLog[]
  attachments  Attachment[]
  labels       IssueLabel[]
  dependencies IssueDependency[] @relation("DependentIssue")
  dependents   IssueDependency[] @relation("BlockingIssue")
  
  @@index([status])
  @@index([priority])
  @@index([assigneeId])
  @@index([sprintId])
  @@map("issues")
}

enum Priority {
  P0 // Critical
  P1 // High
  P2 // Medium
  P3 // Normal
  P4 // Low
  P5 // Lowest
}

enum IssueStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  BLOCKED
  DONE
}

model Comment {
  id        String  @id @default(cuid())
  content   String
  edited    Boolean @default(false)
  
  issueId  String
  authorId String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  issue  Issue @relation(fields: [issueId], references: [id], onDelete: Cascade)
  author User  @relation(fields: [authorId], references: [id])
  
  @@map("comments")
}

model Attachment {
  id       String @id @default(cuid())
  name     String
  url      String
  mimeType String
  size     Int
  
  issueId String
  
  createdAt DateTime @default(now())
  
  issue Issue @relation(fields: [issueId], references: [id], onDelete: Cascade)
  
  @@map("attachments")
}

model Label {
  id    String @id @default(cuid())
  name  String @unique
  color String
  
  createdAt DateTime @default(now())
  
  issues IssueLabel[]
  
  @@map("labels")
}

model IssueLabel {
  issueId String
  labelId String
  
  issue Issue @relation(fields: [issueId], references: [id], onDelete: Cascade)
  label Label @relation(fields: [labelId], references: [id], onDelete: Cascade)
  
  @@id([issueId, labelId])
  @@map("issue_labels")
}

model IssueDependency {
  id   String @id @default(cuid())
  type DependencyType
  
  dependentIssueId String // Issue that is dependent
  blockingIssueId  String // Issue that blocks
  
  createdAt DateTime @default(now())
  
  dependentIssue Issue @relation("DependentIssue", fields: [dependentIssueId], references: [id], onDelete: Cascade)
  blockingIssue  Issue @relation("BlockingIssue", fields: [blockingIssueId], references: [id], onDelete: Cascade)
  
  @@unique([dependentIssueId, blockingIssueId])
  @@map("issue_dependencies")
}

enum DependencyType {
  BLOCKS
  BLOCKED_BY
}

// ========== SPRINTS ==========

model Sprint {
  id        String       @id @default(cuid())
  name      String
  goal      String?
  status    SprintStatus @default(PLANNED)
  startDate DateTime
  endDate   DateTime
  
  teamId String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  team   Team?   @relation(fields: [teamId], references: [id])
  issues Issue[]
  
  @@map("sprints")
}

enum SprintStatus {
  PLANNED
  ACTIVE
  COMPLETED
}

// ========== ACTIVITY LOG ==========

model ActivityLog {
  id          String       @id @default(cuid())
  type        ActivityType
  description String
  metadata    Json?
  
  issueId String?
  userId  String
  
  createdAt DateTime @default(now())
  
  issue Issue? @relation(fields: [issueId], references: [id], onDelete: Cascade)
  user  User   @relation(fields: [userId], references: [id])
  
  @@index([issueId])
  @@index([createdAt])
  @@map("activity_logs")
}

enum ActivityType {
  ISSUE_CREATED
  ISSUE_UPDATED
  STATUS_CHANGED
  PRIORITY_CHANGED
  ASSIGNED
  COMMENTED
  MOVED_TO_SPRINT
  DEPENDENCY_ADDED
  ATTACHMENT_ADDED
}

// ========== NOTIFICATIONS ==========

model Notification {
  id      String           @id @default(cuid())
  type    NotificationType
  title   String
  message String
  isRead  Boolean          @default(false)
  metadata Json?
  
  userId String
  
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead])
  @@map("notifications")
}

enum NotificationType {
  ISSUE_ASSIGNED
  COMMENT_ADDED
  MENTION
  SPRINT_ENDING
  AUTOMATION_FAILED
  PR_REVIEW_REQUESTED
}

// ========== AUTOMATION ==========

model AutomationRule {
  id      String  @id @default(cuid())
  name    String
  trigger Json    // { type, conditions }
  actions Json    // [{ type, config }]
  enabled Boolean @default(true)
  
  createdById String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  createdBy User                 @relation(fields: [createdById], references: [id])
  logs      AutomationLog[]
  
  @@map("automation_rules")
}

model AutomationLog {
  id       String              @id @default(cuid())
  ruleId   String
  status   AutomationLogStatus
  input    Json?
  output   Json?
  error    String?
  duration Int? // milliseconds
  
  createdAt DateTime @default(now())
  
  rule AutomationRule @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  
  @@index([ruleId, status])
  @@map("automation_logs")
}

enum AutomationLogStatus {
  SUCCESS
  FAILED
}

model AIInsight {
  id          String        @id @default(cuid())
  type        InsightType
  severity    InsightSeverity
  title       String
  description String
  metadata    Json?
  status      InsightStatus @default(ACTIVE)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("ai_insights")
}

enum InsightType {
  BOTTLENECK_DETECTED
  SPRINT_AT_RISK
  OVERALLOCATION
  UNDERUTILIZATION
  DEPENDENCY_ISSUE
  VELOCITY_ANOMALY
}

enum InsightSeverity {
  HIGH
  MEDIUM
  LOW
}

enum InsightStatus {
  ACTIVE
  DISMISSED
  RESOLVED
}
```

### Prisma Migrations

```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

### Database Seeder

```typescript
// prisma/seed.ts

import { PrismaClient, Priority, IssueStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      email: 'admin@taskflow.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  
  const alice = await prisma.user.upsert({
    where: { email: 'alice@taskflow.com' },
    update: {},
    create: {
      email: 'alice@taskflow.com',
      password: userPassword,
      name: 'Alice Johnson',
      role: 'TEAM_LEAD',
    },
  })
  
  const bob = await prisma.user.upsert({
    where: { email: 'bob@taskflow.com' },
    update: {},
    create: {
      email: 'bob@taskflow.com',
      password: userPassword,
      name: 'Bob Smith',
      role: 'MEMBER',
    },
  })
  
  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@taskflow.com' },
    update: {},
    create: {
      email: 'charlie@taskflow.com',
      password: userPassword,
      name: 'Charlie Brown',
      role: 'MEMBER',
    },
  })
  
  console.log('✅ Users created')
  
  // Create team
  const team = await prisma.team.create({
    data: {
      name: 'Engineering',
      description: 'Core engineering team',
      leadId: alice.id,
      members: {
        create: [
          { userId: alice.id },
          { userId: bob.id },
          { userId: charlie.id },
        ],
      },
    },
  })
  
  console.log('✅ Team created')
  
  // Create sprints
  const activeSprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 12',
      status: 'ACTIVE',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-10-14'),
      teamId: team.id,
    },
  })
  
  const plannedSprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 13',
      status: 'PLANNED',
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-10-28'),
      teamId: team.id,
    },
  })
  
  console.log('✅ Sprints created')
  
  // Create issues
  let issueCounter = 1
  
  const issues = await Promise.all([
    prisma.issue.create({
      data: {
        identifier: `TSK-${String(issueCounter++).padStart(3, '0')}`,
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication with refresh tokens',
        priority: Priority.P0,
        status: IssueStatus.IN_PROGRESS,
        storyPoints: 8,
        creatorId: alice.id,
        assigneeId: bob.id,
        sprintId: activeSprint.id,
      },
    }),
    prisma.issue.create({
      data: {
        identifier: `TSK-${String(issueCounter++).padStart(3, '0')}`,
        title: 'Design dashboard mockups',
        description: 'Create Figma mockups for the main dashboard',
        priority: Priority.P1,
        status: IssueStatus.DONE,
        storyPoints: 5,
        creatorId: alice.id,
        assigneeId: charlie.id,
        sprintId: activeSprint.id,
      },
    }),
    prisma.issue.create({
      data: {
        identifier: `TSK-${String(issueCounter++).padStart(3, '0')}`,
        title: 'Fix navigation bug on mobile',
        description: 'Navigation menu not showing on iOS devices',
        priority: Priority.P0,
        status: IssueStatus.TODO,
        storyPoints: 3,
        creatorId: bob.id,
        assigneeId: bob.id,
        sprintId: activeSprint.id,
      },
    }),
    prisma.issue.create({
      data: {
        identifier: `TSK-${String(issueCounter++).padStart(3, '0')}`,
        title: 'Write API documentation',
        description: 'Document all REST endpoints with examples',
        priority: Priority.P2,
        status: IssueStatus.TODO,
        storyPoints: 5,
        creatorId: alice.id,
        assigneeId: charlie.id,
      },
    }),
  ])
  
  console.log('✅ Issues created')
  
  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Started working on this. Will have it done by EOD.',
        issueId: issues[0].id,
        authorId: bob.id,
      },
      {
        content: 'Looks great! Just a few minor tweaks needed.',
        issueId: issues[1].id,
        authorId: alice.id,
      },
    ],
  })
  
  console.log('✅ Comments created')
  
  // Create automation rule
  await prisma.automationRule.create({
    data: {
      name: 'Auto-assign P0 issues',
      trigger: {
        type: 'issue_created',
        conditions: {
          priority: 'P0',
        },
      },
      actions: [
        {
          type: 'send_notification',
          config: {
            recipients: ['team_lead'],
            message: 'New critical issue created',
          },
        },
      ],
      enabled: true,
      createdById: admin.id,
    },
  })
  
  console.log('✅ Automation rule created')
  
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (Jest + React Testing Library)

```typescript
// frontend/src/components/ui/button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
  
  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary')).toHaveClass('btn-primary')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('btn-secondary')
  })
})
```

```typescript
// backend/src/services/issue.service.test.ts

import { IssueService } from './issue.service'
import { prisma } from '@/lib/prisma'
import { mockDeep, mockReset } from 'jest-mock-extended'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

const prismaMock = prisma as jest.Mocked<typeof prisma>

describe('IssueService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })
  
  describe('createIssue', () => {
    it('creates issue with auto-generated identifier', async () => {
      const mockIssue = {
        id: '1',
        identifier: 'TSK-001',
        title: 'Test Issue',
        priority: 'P2',
        status: 'TODO',
        creatorId: 'user1',
        assigneeId: 'user2',
      }
      
      prismaMock.issue.count.mockResolvedValue(0)
      prismaMock.issue.create.mockResolvedValue(mockIssue as any)
      
      const result = await IssueService.createIssue({
        title: 'Test Issue',
        priority: 'P2',
        creatorId: 'user1',
        assigneeId: 'user2',
      })
      
      expect(result.identifier).toBe('TSK-001')
      expect(prismaMock.issue.create).toHaveBeenCalledTimes(1)
    })
    
    it('throws error if title is empty', async () => {
      await expect(
        IssueService.createIssue({
          title: '',
          priority: 'P2',
          creatorId: 'user1',
          assigneeId: 'user2',
        })
      ).rejects.toThrow('Title is required')
    })
  })
  
  describe('updateIssue', () => {
    it('updates issue and logs activity', async () => {
      const mockIssue = {
        id: '1',
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      }
      
      prismaMock.issue.findUnique.mockResolvedValue({ 
        id: '1', 
        title: 'Old Title', 
        status: 'TODO' 
      } as any)
      
      prismaMock.issue.update.mockResolvedValue(mockIssue as any)
      
      const result = await IssueService.updateIssue('1', {
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      })
      
      expect(result.title).toBe('Updated Title')
      expect(prismaMock.activityLog.create).toHaveBeenCalled()
    })
  })
})
```

### Integration Tests

```typescript
// backend/tests/integration/auth.test.ts

import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })
  
  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })
  
  describe('POST /api/auth/register', () => {
    it('registers a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')
      expect(response.body.user).toHaveProperty('email', 'test@example.com')
    })
    
    it('returns 400 if email already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'First User',
        })
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password456',
          name: 'Second User',
        })
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('User already exists')
    })
  })
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 12)
      await prisma.user.create({
        data: {
          email: 'login@example.com',
          password: hashedPassword,
          name: 'Login User',
          role: 'MEMBER',
        },
      })
    })
    
    it('logs in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        })
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user.email).toBe('login@example.com')
    })
    
    it('returns 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
      
      expect(response.status).toBe(401)
    })
  })
})
```

### E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // Go to register page
    await page.goto('/register')
    
    // Fill registration form
    await page.fill('input[name="email"]', 'e2e@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="name"]', 'E2E User')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Logout')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
    
    // Login again
    await page.fill('input[name="email"]', 'e2e@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should be back on dashboard
    await expect(page).toHaveURL('/')
  })
})
```

```typescript
// e2e/issues.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Issue Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
  })
  
  test('can create a new issue', async ({ page }) => {
    // Open create issue modal
    await page.click('[data-testid="create-issue-btn"]')
    
    // Fill form
    await page.fill('input[name="title"]', 'E2E Test Issue')
    await page.fill('textarea[name="description"]', 'This is a test description')
    await page.selectOption('select[name="priority"]', 'P2')
    await page.fill('input[name="assignee"]', 'Test User')
    
    // Submit
    await page.click('button:has-text("Create Issue")')
    
    // Verify issue appears in list
    await page.goto('/issues')
    await expect(page.locator('text=E2E Test Issue')).toBeVisible()
  })
  
  test('can update issue status via kanban', async ({ page }) => {
    // Go to sprint view
    await page.goto('/sprint')
    
    // Drag and drop issue
    const issue = page.locator('[data-testid="kanban-card"]').first()
    const targetColumn = page.locator('[data-testid="kanban-column-in-progress"]')
    
    await issue.dragTo(targetColumn)
    
    // Verify status changed
    await page.reload()
    await expect(
      targetColumn.locator('[data-testid="kanban-card"]').first()
    ).toBeVisible()
  })
})
```

---

Kontynuować z **Deployment & DevOps**?