# Design Document - Syzio Canis

## Overview

Syzio Canis is an AI-powered intelligent project assistant that integrates with the Syzio ecosystem. Built as a standalone Next.js application, it provides conversational AI capabilities powered by RAG (Retrieval-Augmented Generation) to help teams interact with project documentation, backlog, and requirements in a natural, efficient way.

The system follows a "Constellation Dependencies" visual theme with a cosmic dark mode aesthetic (navy/graphite backgrounds with purple/cyan accents), emphasizing transparency, contextual intelligence, and frictionless workflow integration.

### Core Principles

1. **Contextual Intelligence**: AI understands user roles (PM/Dev/QA) and current context
2. **Transparency**: Every AI response includes traceable source citations
3. **Frictionless Integration**: Direct actions to Syzio PM without context switching
4. **Cosmic Theme**: "Constellation Dependencies" - visualizing relationships as star maps

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Syzio Canis (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer                                         │
│  ├─ App Shell (Layout, Navigation, Command Palette)        │
│  ├─ Chat Interface (RAG UI)                                │
│  ├─ Stories Generator                                       │
│  ├─ Test Data Generator                                     │
│  ├─ Verify View (Dependency Graph)                         │
│  └─ Release Q&A                                             │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                       │
│  ├─ Canis Context (State Management)                       │
│  ├─ AI Service (RAG Processing)                            │
│  ├─ Story Generator Service                                │
│  ├─ Test Data Generator Service                            │
│  └─ Verification Engine                                     │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├─ Mock Data (PoC)                                        │
│  ├─ Document Store (PDF/MD processing)                     │
│  └─ Integration Adapters                                    │
│      ├─ Syzio PM API                                       │
│      ├─ Dev Monitoring API                                 │
│      └─ Vector DB (for RAG)                                │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Aceternity UI
- **Styling**: Tailwind CSS with custom cosmic theme
- **State Management**: React Context API + Custom Hooks
- **AI/RAG**: OpenAI API / Grok API (configurable)
- **Vector DB**: Pinecone / Weaviate (for document embeddings)
- **Validation**: Zod
- **Notifications**: Sonner (toast)
- **Charts/Graphs**: Recharts + Custom D3.js for constellation view


## Components and Interfaces

### 1. App Shell & Layout

**File**: `app/(demo6_root)/demo6/page.tsx`, `app/(demo6_root)/layout.tsx`

The app shell provides the main layout structure inspired by demo4's AppShell pattern.

**Key Components**:
- **TopBar**: Fixed header with project selector, search/command palette trigger, theme switcher, settings
- **TabNavigation**: Main navigation between Chat, Stories, Test Data, Verify, Release Q&A, Settings
- **CommandPalette**: Global ⌘K interface for quick actions
- **ThemeProvider**: Manages light/dark/dark-gray-blue themes

**Props/Interface**:
```typescript
interface AppShellProps {
  children: React.ReactNode;
}

interface TopBarProps {
  onOpenCommand: () => void;
  currentProject: { id: string; name: string };
}
```

### 2. Chat Interface (RAG)

**File**: `components/demo6/canis-chat.tsx`

Conversational AI interface with RAG capabilities.

**Features**:
- Thread management (left sidebar)
- Message history with role-based styling (user/ai)
- Source citations as clickable badges
- Context-aware suggestions
- File upload for document processing

**Key Components**:
- `ChatThread`: Individual conversation thread
- `MessageBubble`: Single message with citations
- `SourcePopover`: Shows document fragment on citation click
- `ChatInput`: Textarea with send button and action menu

**State Interface**:
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citations?: Citation[];
  timestamp: string;
}

interface Citation {
  source: string; // "Checkout_v2.pdf p.5"
  fragment: string; // actual text snippet
  confidence: number;
}

interface ChatThread {
  id: string;
  title: string;
  preview: string;
  messages: ChatMessage[];
  context: {
    projectId: string;
    openIssueId?: string;
    documents: string[];
  };
}
```

### 3. Stories Generator

**File**: `components/demo6/stories-generator.tsx`

Generates user stories with acceptance criteria from documentation.

**Features**:
- Input form (persona, goal, source selection)
- NFR toggles (P95, WCAG)
- Generated story cards in grid
- Inline editing
- Export to Syzio PM
- Conflict detection

**Key Components**:
- `StoryGeneratorForm`: Left panel configuration
- `StoryCard`: Individual generated story with AC
- `StoryEditor`: Inline editing dialog
- `ConflictAlert`: Shows conflicts with existing backlog

**Data Interface**:
```typescript
interface GeneratedStory {
  id: string;
  title: string;
  persona: string;
  goal: string;
  benefit: string;
  acceptanceCriteria: AcceptanceCriterion[];
  estimate: string; // "5sp"
  sources: Citation[];
  conflicts?: Conflict[];
}

interface AcceptanceCriterion {
  id: string;
  format: 'EARS' | 'Gherkin';
  text: string;
  // EARS: "WHEN [event] THEN [system] SHALL [response]"
  // Gherkin: "Given... When... Then..."
}

interface Conflict {
  type: 'duplicate' | 'contradiction' | 'overlap';
  existingIssueId: string;
  description: string;
}
```


### 4. Test Data Generator

**File**: `components/demo6/test-data-generator.tsx`

Generates realistic test data from API schemas and user stories.

**Features**:
- Schema selection (OpenAPI/JSON Schema)
- Parameter configuration (record count, edge cases)
- Rules editor (YAML format)
- Live preview table
- Export (JSON/CSV/SQL)

**Key Components**:
- `SchemaSelector`: Dropdown for API schema selection
- `DataConfigForm`: Parameters and rules configuration
- `RulesEditor`: YAML editor dialog
- `DataPreviewTable`: Shows first N records
- `ExportButton`: Multi-format export

**Data Interface**:
```typescript
interface TestDataConfig {
  schema: string; // "payments.yaml#/Card"
  recordCount: number;
  rules: DataGenerationRules;
  edgeCases: EdgeCase[];
}

interface DataGenerationRules {
  fields: Record<string, FieldRule>;
  relationships?: Relationship[];
}

interface FieldRule {
  type: 'luhn' | 'futureDate' | 'decimal' | 'enum' | 'regex';
  params: Record<string, any>;
  // e.g., { cardBrand: 'VISA' } for luhn
  // e.g., { min: 1, max: 9999, scale: 2 } for decimal
}

interface EdgeCase {
  description: string;
  count: number;
  overrides: Record<string, any>;
  // e.g., { pan: 'invalid', amount: -1 }
}

interface GeneratedDataset {
  schema: string;
  records: Record<string, any>[];
  metadata: {
    generatedAt: string;
    totalRecords: number;
    edgeCaseCount: number;
  };
}
```

### 5. Verify View (Requirements Verification)

**File**: `components/demo6/verify-view.tsx`

Analyzes requirements for conflicts, gaps, and ambiguities.

**Features**:
- Findings table (type, severity, description, source)
- Trace matrix (Doc ↔ Story ↔ Release)
- Dependency graph visualization (constellation view)
- Create fix tasks directly to PM

**Key Components**:
- `FindingsTable`: List of detected issues
- `TraceMatrix`: Shows relationships between artifacts
- `ConstellationGraph`: Interactive dependency visualization
- `FindingDetail`: Dialog with full context

**Data Interface**:
```typescript
interface Finding {
  id: string;
  type: 'Consistency' | 'Completeness' | 'Clarity' | 'Testability';
  severity: 'low' | 'medium' | 'high';
  summary: string;
  description: string;
  sources: string[]; // ["Checkout_v2.pdf", "payments.yaml"]
  affectedArtifacts: ArtifactReference[];
  suggestedFix?: string;
}

interface ArtifactReference {
  type: 'document' | 'issue' | 'test' | 'commit';
  id: string;
  title: string;
}

interface DependencyNode {
  id: string;
  type: 'epic' | 'story' | 'document' | 'test' | 'commit' | 'deployment';
  label: string;
  status: 'safe' | 'warning' | 'conflict';
  metadata: Record<string, any>;
}

interface DependencyEdge {
  from: string;
  to: string;
  type: 'implements' | 'tests' | 'references' | 'blocks';
  strength: number; // 0-1
}

interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}
```


### 6. Release Q&A

**File**: `components/demo6/release-qa.tsx`

Answers questions about releases using data from Dev Monitoring and PM.

**Features**:
- Release selector
- Common questions as quick badges
- AI-generated answers with sources
- AC coverage visualization
- Links to DevMon and PM

**Key Components**:
- `ReleaseSelector`: Dropdown for release selection
- `QuickQuestions`: Badge buttons for common queries
- `AnswerPanel`: AI response with citations
- `CoverageChart`: Visual AC coverage per story

**Data Interface**:
```typescript
interface Release {
  id: string; // "R-102"
  environment: 'staging' | 'production';
  deployedAt: string;
  issues: string[]; // ["SZ-1234", "SZ-1235"]
  commits: CommitReference[];
  status: 'Deployed' | 'Ready' | 'Failed';
}

interface CommitReference {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
}

interface ACCoverage {
  issueKey: string;
  totalAC: number;
  coveredAC: number;
  coverage: number; // percentage
}

interface ReleaseAnswer {
  question: string;
  answer: string;
  sources: Citation[];
  relatedData: {
    issues: string[];
    coverage: ACCoverage[];
    commits: number;
  };
}
```

### 7. Command Palette

**File**: `components/demo6/command-palette.tsx`

Global ⌘K interface for quick navigation and actions.

**Features**:
- Fuzzy search
- Grouped commands (Navigation, Actions)
- Keyboard shortcuts
- Recent actions

**Key Components**:
- `CommandDialog`: shadcn/ui Command component
- `CommandGroup`: Grouped command items
- `CommandItem`: Individual action

**Interface**:
```typescript
interface Command {
  id: string;
  label: string;
  icon: React.ComponentType;
  shortcut?: string[];
  group: 'navigation' | 'actions' | 'recent';
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: string) => void;
}
```

## Data Models

### Core Entities

```typescript
// Canis Context State
interface CanisState {
  currentProject: Project;
  currentUser: User;
  chatThreads: ChatThread[];
  activeThreadId: string | null;
  documents: Document[];
  generatedStories: GeneratedStory[];
  testDatasets: GeneratedDataset[];
  findings: Finding[];
  releases: Release[];
  syncStatus: SyncStatus;
}

interface Project {
  id: string;
  name: string;
  description: string;
  syzioProjectId: string;
  documentSources: DocumentSource[];
  apiSchemas: APISchema[];
}

interface DocumentSource {
  id: string;
  type: 'pdf' | 'markdown' | 'docx';
  name: string;
  url: string;
  uploadedAt: string;
  processed: boolean;
  embeddingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

interface APISchema {
  id: string;
  name: string;
  type: 'openapi' | 'json-schema';
  url: string;
  version: string;
}

interface SyncStatus {
  lastSync: string;
  status: 'syncing' | 'synced' | 'error';
  sources: {
    syzio: boolean;
    devMon: boolean;
    documents: boolean;
  };
}
```


## Error Handling

### Error Types

```typescript
type CanisError =
  | { type: 'AI_ERROR'; message: string; retryable: boolean }
  | { type: 'SYNC_ERROR'; source: 'syzio' | 'devmon' | 'documents'; message: string }
  | { type: 'VALIDATION_ERROR'; field: string; message: string }
  | { type: 'NETWORK_ERROR'; message: string; retryable: boolean }
  | { type: 'GENERATION_ERROR'; context: string; message: string };
```

### Error Handling Strategy

1. **AI Errors**: Show toast with retry option, log to console
2. **Sync Errors**: Display alert badge in sidebar, offer manual sync
3. **Validation Errors**: Inline form validation with Zod, toast for critical errors
4. **Network Errors**: Retry with exponential backoff (3 attempts), then show error state
5. **Generation Errors**: Show error in result panel with details, allow parameter adjustment

### Error Boundaries

- **Global Error Boundary**: Catches unhandled errors, shows fallback UI
- **Component Error Boundaries**: For Chat, Stories, TestData, Verify views
- **Graceful Degradation**: If AI unavailable, show cached results or manual input options

## Testing Strategy

### Unit Tests

**Tools**: Vitest + React Testing Library

**Coverage**:
- Utility functions (AI processing, data generation, validation)
- Custom hooks (useCanisChat, useStoryGenerator, useTestDataGenerator)
- Data transformations
- Validation schemas (Zod)

**Example Test Files**:
- `lib/demo6/ai-utils.test.ts`
- `hooks/demo6/use-canis-chat.test.ts`
- `lib/demo6/story-generator.test.ts`

### Integration Tests

**Tools**: Playwright

**Coverage**:
- Chat flow: send message → receive AI response → click citation → view source
- Story generation: configure → generate → edit → export to PM
- Test data generation: select schema → configure → generate → export CSV
- Verify flow: view findings → click finding → create fix task
- Release Q&A: select release → ask question → view answer

**Example Test Files**:
- `e2e/demo6/chat-flow.spec.ts`
- `e2e/demo6/story-generation.spec.ts`

### Component Tests

**Tools**: Storybook + Chromatic

**Coverage**:
- All major components in isolation
- Different states (loading, error, success, empty)
- Theme variations (light, dark, dark-gray-blue)
- Responsive breakpoints

### Mock Data Strategy

For PoC, use comprehensive mock data:
- `lib/demo6/mock-data.ts`: Sample projects, documents, stories, findings, releases
- Mock AI responses with realistic latency (300-800ms)
- Mock Syzio PM API responses
- Mock Dev Monitoring API responses

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Lazy load heavy components (ConstellationGraph, RulesEditor)
2. **Memoization**: Use React.memo for expensive renders (MessageBubble, StoryCard)
3. **Virtual Scrolling**: For long chat histories and large datasets
4. **Debouncing**: Search inputs, auto-save (300ms)
5. **Caching**: Cache AI responses, document embeddings, API calls (React Query)

### Performance Targets

- **Initial Load**: < 2s (FCP)
- **AI Response**: < 3s (p95)
- **Story Generation**: < 5s for 5 stories
- **Test Data Generation**: < 2s for 500 records
- **Graph Rendering**: < 1s for 100 nodes

### Monitoring

- Use Next.js Analytics for Core Web Vitals
- Custom metrics for AI response times
- Error tracking with Sentry (future)


## Integration Points

### 1. Syzio PM Integration

**API Endpoints** (Mock for PoC):
- `GET /api/syzio/projects` - List projects
- `GET /api/syzio/projects/:id/issues` - Get backlog
- `POST /api/syzio/issues` - Create issue from generated story
- `GET /api/syzio/sprints` - Get sprint data
- `PATCH /api/syzio/issues/:id` - Update issue

**Data Flow**:
```
Canis Story Generator → Validate → POST /api/syzio/issues → Show success toast
Canis Chat → Context fetch → GET /api/syzio/projects/:id/issues → Enrich AI context
```

### 2. Dev Monitoring Integration

**API Endpoints** (Mock for PoC):
- `GET /api/devmon/releases` - List releases
- `GET /api/devmon/releases/:id` - Get release details
- `GET /api/devmon/commits` - Get commit history
- `GET /api/devmon/deployments` - Get deployment status

**Data Flow**:
```
Release Q&A → GET /api/devmon/releases/:id → Combine with PM data → AI answer
Verify View → GET /api/devmon/commits → Build trace matrix
```

### 3. Document Processing

**Flow**:
1. User uploads PDF/MD → `POST /api/canis/documents`
2. Backend extracts text → Chunk into paragraphs
3. Generate embeddings (OpenAI/Cohere) → Store in Vector DB
4. Index for RAG retrieval

**Vector DB Schema**:
```typescript
interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[]; // 1536-dim for OpenAI
  metadata: {
    page?: number;
    section?: string;
    documentName: string;
  };
}
```

### 4. AI Service Integration

**Provider**: OpenAI GPT-4 / Grok (configurable)

**Endpoints**:
- Chat completions for conversational AI
- Embeddings for RAG
- Function calling for structured outputs (stories, test data)

**RAG Flow**:
```
User Query → Generate embedding → Vector search (top 5 chunks)
→ Construct prompt with context → LLM completion → Parse citations
```

**Prompt Templates**:
- `prompts/chat-rag.txt`: Chat with document context
- `prompts/story-generation.txt`: Generate user stories
- `prompts/test-data-rules.txt`: Generate test data rules
- `prompts/verify-requirements.txt`: Find conflicts/gaps

## Security Considerations

### Authentication & Authorization

- **PoC**: Mock user (no auth)
- **Production**: OAuth 2.0 with Syzio SSO
- **API Keys**: Store in environment variables, never in code
- **Rate Limiting**: Prevent AI API abuse (10 requests/min per user)

### Data Privacy

- **Document Storage**: Encrypted at rest (AES-256)
- **AI Requests**: No PII in prompts, sanitize inputs
- **Audit Log**: Track all AI generations and exports
- **GDPR Compliance**: Right to delete, data export

### Input Validation

- **Zod Schemas**: Validate all user inputs
- **Sanitization**: Escape HTML, prevent XSS
- **File Upload**: Validate file types, size limits (10MB), scan for malware

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All features accessible via keyboard
- **Screen Readers**: ARIA labels, semantic HTML
- **Color Contrast**: 4.5:1 for text, 3:1 for UI components
- **Focus Indicators**: Visible focus states
- **Skip Links**: "Skip to main content"

### Specific Implementations

- Command Palette: Fully keyboard-driven (⌘K, arrows, enter)
- Chat: Screen reader announces new messages
- Graphs: Provide text alternative for constellation view
- Forms: Associated labels, error announcements


## UI/UX Design System

### Theme: "Constellation Dependencies"

**Visual Metaphor**: Dependencies as star constellations - nodes are stars, relationships are connecting lines.

### Color Palette

**Dark Gray Blue Theme** (Primary):
```css
--background: 220 18% 10%;        /* Deep blue-gray */
--foreground: 210 25% 96%;        /* Light text */
--primary: 217 90% 60%;           /* Electric blue */
--accent: 200 60% 40%;            /* Cyan */
--secondary: 280 60% 60%;         /* Purple */
--destructive: 0 84% 60%;         /* Red for alerts */
--border: 220 16% 22%;            /* Subtle borders */
```

**Usage**:
- **Purple**: New/generated items, AI actions
- **Cyan**: Accepted/safe items, success states
- **Red**: Conflicts, errors, high severity
- **Blue**: Primary actions, links

### Typography

- **Headings**: Inter (font-semibold, tracking-tight)
- **Body**: Inter (font-normal)
- **Code/Data**: JetBrains Mono (font-mono)

### Spacing & Layout

- **Container**: max-w-[1200px] for main content
- **Grid**: 12-column responsive grid
- **Gaps**: 4 (1rem), 6 (1.5rem) for cards
- **Padding**: p-4 (mobile), p-6 (desktop)

### Component Patterns

**Cards**:
- Rounded corners: `rounded-2xl`
- Subtle shadow: `shadow-md`
- Border: `border border-border`
- Hover: `hover:shadow-lg transition-shadow`

**Badges**:
- Severity: `destructive` (high), `default` (medium), `secondary` (low)
- Status: `outline` for neutral, `default` for active
- Sources: `outline` with small text

**Buttons**:
- Primary: `bg-primary hover:bg-primary/90`
- Secondary: `variant="secondary"`
- Ghost: `variant="ghost"` for sidebar
- Icon: `size="icon"` for toolbar

**Animations**:
- Pulse: Subtle pulse for active AI processing
- Fade-in: New messages, generated items
- Slide-in: Sidebar, dialogs
- Constellation: Stars forming on load (CSS keyframes)

### Responsive Breakpoints

- **Mobile**: < 768px - Single column, hidden sidebar, fullscreen chat
- **Tablet**: 768px - 1024px - 2-column grid, collapsible sidebar
- **Desktop**: > 1024px - 3-column grid, persistent sidebar

### Micro-interactions

- **Hover**: Cards lift slightly, buttons darken
- **Click**: Ripple effect on buttons
- **Loading**: Spinning stars icon
- **Success**: Checkmark animation
- **Error**: Shake animation

## File Structure

```
app/
├── (demo6_root)/
│   ├── layout.tsx              # Root layout with providers
│   └── demo6/
│       └── page.tsx            # Main Canis page with tabs
│
components/
├── demo6/
│   ├── app-shell.tsx           # Main layout shell
│   ├── topbar.tsx              # Header with search/settings
│   ├── canis-chat.tsx          # Chat interface
│   ├── stories-generator.tsx  # Story generation view
│   ├── test-data-generator.tsx # Test data view
│   ├── verify-view.tsx         # Requirements verification
│   ├── release-qa.tsx          # Release Q&A view
│   ├── command-palette.tsx     # ⌘K interface
│   ├── constellation-graph.tsx # Dependency visualization
│   ├── theme-provider.tsx      # Theme management
│   └── theme-switcher.tsx      # Theme toggle button
│
lib/
├── demo6/
│   ├── canis-context.tsx       # Main state management
│   ├── ai-service.ts           # AI/RAG integration
│   ├── story-generator.ts      # Story generation logic
│   ├── test-data-generator.ts  # Test data logic
│   ├── verification-engine.ts  # Requirements verification
│   ├── syzio-api.ts            # Syzio PM API client
│   ├── devmon-api.ts           # Dev Monitoring API client
│   ├── mock-data.ts            # Mock data for PoC
│   └── types.ts                # TypeScript types
│
hooks/
├── demo6/
│   ├── use-canis-chat.ts       # Chat state management
│   ├── use-story-generator.ts  # Story generation hook
│   ├── use-test-data.ts        # Test data hook
│   └── use-command-palette.ts  # Command palette hook
│
styles/
└── demo6-globals.css           # Canis-specific styles
```

## Deployment

### PoC Deployment (Render)

1. **Build**: `pnpm build`
2. **Environment Variables**:
   - `OPENAI_API_KEY` or `GROK_API_KEY`
   - `SYZIO_API_URL` (mock endpoint)
   - `DEVMON_API_URL` (mock endpoint)
   - `VECTOR_DB_URL` (Pinecone/Weaviate)
3. **Deploy**: Connect GitHub repo to Render, auto-deploy on push

### Production Considerations

- **CDN**: Serve static assets via Vercel Edge Network
- **API Routes**: Separate backend service for AI processing
- **Database**: PostgreSQL for metadata, Vector DB for embeddings
- **Monitoring**: Sentry for errors, Datadog for performance
- **Scaling**: Horizontal scaling for AI service, caching layer (Redis)

## Future Enhancements (Post-PoC)

1. **Proactive Risk Agent**: Auto-analyze new tasks, flag ambiguous requirements
2. **Stand-up Copilot**: Generate daily summaries from commits and PM status
3. **Release Impact Simulator**: "What if we remove story X from release?"
4. **Data Playground**: Ephemeral test environments with generated data
5. **Multi-language Support**: i18n for Polish/English
6. **Voice Interface**: Voice commands for hands-free operation
7. **Mobile App**: Native iOS/Android with offline mode
8. **Advanced Analytics**: ML-powered insights on team velocity, quality trends
