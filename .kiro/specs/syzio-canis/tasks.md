# Implementation Plan - Syzio Canis (Demo6)

This implementation plan breaks down the Syzio Canis PoC into discrete, manageable coding tasks following the established Syzio demo structure (demo4/demo5 pattern). Each task builds incrementally on previous work. Tasks reference specific requirements from requirements.md.

## Project Structure

Following the Syzio demo pattern:
```
app/
├── (demo6_root)/
│   ├── layout.tsx              # Root layout with metadata, fonts, Analytics
│   ├── providers.tsx           # ErrorBoundary, ThemeProvider, DataProvider, UIProvider
│   └── demo6/
│       └── page.tsx            # Main page with AppShell + CanisMainView
│
├── demo6-globals.css           # Global styles with CSS variables
│
components/
└── demo6/
    ├── app-shell.tsx           # Main layout shell (similar to demo4)
    ├── demo-banner.tsx         # "PoC Demo" banner
    ├── theme-provider.tsx      # Theme context (light/dark/dark-gray-blue)
    ├── error-boundary.tsx      # Error boundary component
    ├── canis-main-view.tsx     # Main view with tabs
    ├── canis-chat.tsx          # Chat interface
    ├── stories-generator.tsx   # Story generation view
    ├── test-data-generator.tsx # Test data view
    ├── verify-view.tsx         # Requirements verification
    ├── release-qa.tsx          # Release Q&A view
    ├── settings-view.tsx       # Settings view
    └── command-palette.tsx     # ⌘K interface
│
lib/
└── demo6/
    ├── data-context.tsx        # Main data state management
    ├── ui-context.tsx          # UI state (modals, selected items)
    ├── mock-data.ts            # Mock data for PoC
    └── types.ts                # TypeScript types
```

## Task List

- [x] 1. Set up demo6 project structure and root configuration



  - Create `app/(demo6_root)/` folder structure
  - Create `app/(demo6_root)/layout.tsx` with metadata, Geist fonts, Analytics
  - Create `app/demo6-globals.css` with CSS variables for cosmic theme
  - Create `lib/demo6/types.ts` with core TypeScript interfaces

  - _Requirements: 7.1, 7.3_





- [ ] 2. Create providers and context setup
  - [ ] 2.1 Create ThemeProvider component
    - File: `components/demo6/theme-provider.tsx`

    - Support three modes: light, dark, dark-gray-blue
    - Use localStorage for persistence
    - Apply theme classes to document root

    - Export useTheme hook
    - _Requirements: 7.7_

  
  - [ ] 2.2 Create ErrorBoundary component
    - File: `components/demo6/error-boundary.tsx`
    - Catch React errors and show fallback UI


    - Log errors to console


    - Provide reset button
    - _Requirements: 7.1_
  
  - [x] 2.3 Create DataContext for state management


    - File: `lib/demo6/data-context.tsx`

    - Define CanisState interface in types.ts
    - Manage: chatThreads, generatedStories, testDatasets, findings, releases
    - Provide CRUD methods for each entity
    - Export useData hook
    - _Requirements: All (core state)_

  

  - [ ] 2.4 Create UIContext for UI state
    - File: `lib/demo6/ui-context.tsx`
    - Manage: activeTab, commandPaletteOpen, selectedThread, modals
    - Export useUI hook





    - _Requirements: 6.1, 7.1_
  
  - [ ] 2.5 Create Providers wrapper
    - File: `app/(demo6_root)/providers.tsx`

    - Wrap: ErrorBoundary → ThemeProvider → DataProvider → UIProvider
    - Follow demo4 pattern exactly
    - _Requirements: 7.1_


- [ ] 3. Create mock data
  - File: `lib/demo6/mock-data.ts`

  - Define sample chat threads with messages and citations
  - Create sample generated stories with acceptance criteria
  - Add sample findings (consistency, completeness, clarity issues)
  - Define sample releases with issues and commits
  - Add sample test data schemas and configurations





  - Export mockData object with all entities
  - _Requirements: All (provides test data)_

- [ ] 4. Build AppShell and main page structure
  - [ ] 4.1 Create DemoBanner component
    - File: `components/demo6/demo-banner.tsx`
    - Display "PoC Demo - Syzio Canis" banner

    - Add link back to demo selector
    - Follow demo4 pattern
    - _Requirements: 7.1_



  
  - [ ] 4.2 Create AppShell component
    - File: `components/demo6/app-shell.tsx`
    - Include DemoBanner at top
    - Render children in main content area
    - Add Toaster component (Sonner)
    - Follow demo4 AppShell pattern

    - _Requirements: 7.1_
  
  - [ ] 4.3 Create main page
    - File: `app/(demo6_root)/demo6/page.tsx`
    - Use "use client" directive
    - Wrap content in Suspense

    - Render AppShell with CanisMainView
    - _Requirements: 7.1_

- [ ] 5. Build main view with tab navigation
  - [x] 5.1 Create CanisMainView component

    - File: `components/demo6/canis-main-view.tsx`
    - Add TopBar with logo, project selector, search, theme switcher, settings
    - Implement Tabs component with 6 tabs: Chat, Stories, Test Data, Verify, Release Q&A, Settings
    - Connect to UIContext for activeTab state
    - Make responsive (scrollable tabs on mobile)
    - _Requirements: 6.1, 7.1, 7.2_

  
  - [ ] 5.2 Create theme switcher button
    - Add to TopBar
    - Cycle through light → dark → dark-gray-blue
    - Show current theme label

    - Add Palette icon
    - _Requirements: 7.7_

- [ ] 6. Build Chat interface (RAG)
  - [ ] 6.1 Create ChatThread sidebar component
    - File: `components/demo6/canis-chat.tsx` (part of)



    - Display list of threads from DataContext
    - Highlight active thread
    - Add "New Thread" button
    - Use ScrollArea for scrolling
    - _Requirements: 1.1, 1.2_
  
  - [ ] 6.2 Create MessageBubble component
    - Style user vs AI messages differently (bg colors)
    - Display message text with proper formatting

    - Render citation badges below message
    - Add timestamp
    - _Requirements: 1.2, 1.3_
  
  - [ ] 6.3 Create SourcePopover component
    - Trigger on citation badge click
    - Display document fragment in Popover
    - Show source name and confidence score

    - _Requirements: 1.3, 1.4_
  
  - [ ] 6.4 Create ChatInput component
    - Textarea with auto-resize
    - Send button with Send icon
    - Actions Popover (Generate Story, Verify, Test Data, Release Q&A)

    - File upload button for documents
    - _Requirements: 1.1, 1.5_
  
  - [ ] 6.5 Create SourcesPanel component
    - Display top relevant document fragments
    - Show source name and snippet
    - Make scrollable
    - _Requirements: 1.3_

  
  - [ ] 6.6 Integrate chat components into CanisChat view
    - Layout: 3-column grid (threads 25%, chat 50%, sources 25%)
    - Connect to DataContext for threads and messages
    - Implement send message handler (mock AI response with 500ms delay)
    - Add loading state during AI response
    - Make responsive (single column on mobile, hide sources)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 7.2_




- [ ] 7. Build Stories Generator
  - [ ] 7.1 Create StoryGeneratorForm component
    - File: `components/demo6/stories-generator.tsx` (part of)
    - Add persona Input field

    - Add goal Textarea
    - Create source Select (documents/API)
    - Add NFR Switch toggles (P95, WCAG)
    - Add Generate Button with Sparkles icon
    - Show loading state during generation
    - _Requirements: 2.1, 2.7_

  
  - [ ] 7.2 Create StoryCard component
    - Display story title, persona, goal
    - Show acceptance criteria list (EARS/Gherkin format)
    - Display estimate Badge
    - Show source citations as Badges
    - Add Refine and "Export to PM" Buttons

    - Highlight conflicts with Alert
    - _Requirements: 2.2, 2.3, 2.6_
  
  - [ ] 7.3 Create ConflictAlert component
    - Display conflict type and description
    - Show existing issue reference

    - Add "View in PM" link
    - Use Alert component from shadcn/ui
    - _Requirements: 2.6_
  
  - [ ] 7.4 Implement story generation logic
    - Add generateStories function to DataContext
    - Parse persona and goal inputs
    - Generate 2-5 story variants with AC (mock)

    - Add mock citations to sources
    - Detect conflicts with existing backlog (mock check)
    - Add 400ms delay to simulate AI processing
    - _Requirements: 2.1, 2.2, 2.7_
  
  - [ ] 7.5 Integrate components into StoriesGenerator view
    - Layout: form on left (33%), story cards grid on right (67%)
    - Connect to DataContext
    - Handle generate button click
    - Implement export to PM handler (show success toast)
    - Add empty state Alert when no stories generated
    - Make responsive (stack on mobile)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.2_


- [ ] 8. Build Test Data Generator
  - [ ] 8.1 Create SchemaSelector component
    - File: `components/demo6/test-data-generator.tsx` (part of)
    - Select dropdown with sample schemas (payments.yaml#/Card, etc.)
    - Display selected schema name
    - _Requirements: 3.1_
  
  - [ ] 8.2 Create DataConfigForm component
    - Record count Input (number type)
    - Edge cases configuration section
    - Rules editor Button (opens Dialog)
    - Generate and Export Buttons
    - _Requirements: 3.2, 3.6_
  
  - [ ] 8.3 Create RulesEditor Dialog
    - Textarea with YAML syntax (monospace font)
    - Pre-fill with default rules for selected schema
    - Save Button
    - Use Dialog component from shadcn/ui
    - _Requirements: 3.2_
  
  - [ ] 8.4 Create DataPreviewTable component
    - Display first 10 records in Table
    - Show all fields as columns
    - Use monospace font for data cells
    - Add horizontal scroll for many columns
    - _Requirements: 3.3_
  
  - [ ] 8.5 Implement test data generation logic
    - Add generateTestData function to DataContext
    - Parse schema and rules
    - Generate realistic mock data (simple random generation for PoC)
    - Apply edge case overrides
    - Support JSON/CSV/SQL export formats
    - Add 300ms delay to simulate processing
    - _Requirements: 3.2, 3.4, 3.5, 3.6, 3.7_
  
  - [ ] 8.6 Integrate components into TestDataGenerator view
    - Layout: config form on left (33%), preview table on right (67%)
    - Connect to DataContext
    - Handle generate button click
    - Implement export with format Select (JSON/CSV/SQL)
    - Add loading state during generation
    - Make responsive (stack on mobile)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 7.2_

- [ ] 9. Build Verify View (Requirements Verification)
  - [ ] 9.1 Create FindingsTable component
    - File: `components/demo6/verify-view.tsx` (part of)
    - Display findings with columns: Type, Severity, Description, Source, Action
    - Use Badge for severity (destructive/default/secondary)
    - Add "Create Task" Button in action column
    - Make table scrollable with ScrollArea
    - _Requirements: 4.3, 4.5_
  
  - [ ] 9.2 Create TraceMatrix component
    - Display relationships as simple list (Doc → Story → Release)
    - Use monospace font
    - Show in Card component
    - _Requirements: 4.4_
  
  - [ ] 9.3 Create ConstellationGraph component (simplified for PoC)
    - Use simple SVG for node-edge visualization
    - Nodes as circles (color-coded: cyan=safe, red=conflict, yellow=warning)
    - Edges as lines between nodes
    - Click node to show details in Dialog
    - Keep it simple for PoC (no zoom/pan)
    - _Requirements: 4.1, 4.2, 4.7_
  
  - [ ] 9.4 Create FindingDetail Dialog
    - Show full finding description
    - Display all affected artifacts
    - Show suggested fix
    - Add "Create Fix Task" Button
    - _Requirements: 4.4, 4.6_
  
  - [ ] 9.5 Implement verification logic
    - Add verifyRequirements function to DataContext
    - Analyze documents and stories for conflicts (mock analysis)
    - Detect missing AC, ambiguous terms (mock detection)
    - Build dependency graph from mock data
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ] 9.6 Integrate components into VerifyView
    - Layout: findings table (67%), trace matrix (33%)
    - Add optional graph view toggle
    - Connect to DataContext
    - Handle "Create Task" button (show success toast)
    - Make responsive (stack on mobile)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.2_

- [ ] 10. Build Release Q&A View
  - [ ] 10.1 Create ReleaseSelector component
    - File: `components/demo6/release-qa.tsx` (part of)
    - Select dropdown with sample releases (R-101, R-102, etc.)
    - Display release ID and environment
    - _Requirements: 5.1_
  
  - [ ] 10.2 Create QuickQuestions component
    - Display common questions as clickable Badges
    - Questions: "Co było w paczce?", "Czy gate spełnione?", "Co się zmieniło?"
    - Trigger AI answer on click
    - _Requirements: 5.1_
  
  - [ ] 10.3 Create AnswerPanel component
    - Display AI-generated answer with formatting
    - Show source citations as Badges
    - Display related data (issues, coverage, commits)
    - Add "Open in DevMon" and "Open in PM" Buttons
    - _Requirements: 5.2, 5.3_
  
  - [ ] 10.4 Implement release Q&A logic
    - Add answerReleaseQuestion function to DataContext
    - Fetch release data from mockData
    - Combine with PM and DevMon mock data
    - Generate answer with citations (mock)
    - Add 500ms delay to simulate AI processing
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 10.5 Integrate components into ReleaseQA view
    - Layout: selector + questions on left (33%), answer panel on right (67%)
    - Connect to DataContext
    - Handle release selection and question clicks
    - Add loading state during answer generation
    - Make responsive (stack on mobile)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.2_


- [ ] 11. Build Command Palette
  - [ ] 11.1 Create CommandPalette component
    - File: `components/demo6/command-palette.tsx`
    - Use shadcn/ui Command component
    - Add keyboard listener for ⌘K / Ctrl+K in useEffect
    - Connect to UIContext for open state
    - _Requirements: 6.1, 6.2_
  
  - [ ] 11.2 Add navigation commands
    - CommandGroup "Navigation"
    - Commands for each tab (Chat, Stories, Test Data, Verify, Release Q&A, Settings)
    - Implement navigation on command select (update UIContext activeTab)
    - _Requirements: 6.2, 6.3_
  
  - [ ] 11.3 Add action commands
    - CommandGroup "Actions"
    - Commands: "Generate Story", "Verify Requirements", "Generate Test Data", "Ask About Release"
    - Show icons for each command (Sparkles, CheckCircle2, Database, GitPullRequest)
    - Trigger corresponding actions (show toast or navigate to tab)
    - _Requirements: 6.2, 6.3_
  
  - [ ] 11.4 Implement search and filtering
    - Use CommandInput for fuzzy search
    - Show CommandEmpty when no results
    - Display keyboard shortcuts with Kbd component
    - _Requirements: 6.4, 6.5_
  
  - [ ] 11.5 Integrate CommandPalette into app
    - Add to AppShell
    - Connect search input in TopBar to open palette (onFocus)
    - Handle Escape key to close
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 12. Build Settings View
  - [ ] 12.1 Create ConnectorsSettings component
    - File: `components/demo6/settings-view.tsx` (part of)
    - Display list of data sources (PM, DevMon, Documents)
    - Add Switch toggle for each
    - Show connection status Badge
    - _Requirements: 8.1, 8.2_
  
  - [ ] 12.2 Create RulesSettings component
    - Display NFR rules (P95 < 300ms, WCAG AA)
    - Add Switch toggles
    - Show domain dictionary terms
    - _Requirements: 9.1_
  
  - [ ] 12.3 Integrate components into SettingsView
    - Layout: 2-column grid (Connectors, Rules)
    - Connect to DataContext for settings state
    - Handle toggle changes (update context state)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1_

- [ ] 13. Implement proactive suggestions
  - [ ] 13.1 Create SuggestionBanner component
    - File: `components/demo6/suggestion-banner.tsx`
    - Display contextual suggestions based on current view
    - Show Alert with suggestion text and action Button
    - Add dismiss Button
    - _Requirements: 9.1, 9.2_
  
  - [ ] 13.2 Implement suggestion logic
    - Add getSuggestions function to DataContext
    - Analyze current context (open issue, sprint status, etc.)
    - Return relevant suggestions (mock logic)
    - Examples: "Generate AC?", "Verify requirements?", "Add test data?"
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 13.3 Integrate suggestions into views
    - Add SuggestionBanner to Chat, Stories, Verify views
    - Connect to DataContext
    - Handle suggestion actions
    - Store dismissed suggestions in UIContext
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 14. Implement export functionality
  - [ ] 14.1 Create export utilities
    - File: `lib/demo6/export-utils.ts`
    - Implement exportToMarkdown function
    - Implement exportToJSON function
    - Implement exportToCSV function
    - Implement exportToSQL function
    - Implement downloadFile utility
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 14.2 Add export buttons to views
    - Stories: Export Button with format Select (Markdown/JSON/CSV)
    - Test Data: Export Button with format Select (JSON/CSV/SQL)
    - Verify: Export graph Button (PNG/SVG/JSON) - simplified for PoC
    - Connect to export utilities
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ] 14.3 Implement file download
    - Trigger browser download with proper filename and MIME type
    - Add metadata to exported files (date, author, source)
    - Show success toast after download
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 15. Add animations and micro-interactions
  - [ ] 15.1 Implement loading animations
    - Create LoadingSpinner component with pulsing animation
    - Add skeleton loaders for chat messages, story cards (use shadcn/ui Skeleton)
    - Implement fade-in animation for new content (CSS transition)
    - _Requirements: 7.5_
  
  - [ ] 15.2 Add hover effects
    - Cards: transform scale + shadow on hover
    - Buttons: darken on hover
    - Badges: subtle pulse on hover
    - Add to global CSS
    - _Requirements: 7.6_
  
  - [ ] 15.3 Implement success/error animations
    - Success toast with checkmark icon
    - Error toast with shake animation
    - Use Sonner toast library
    - _Requirements: 7.5, 7.6_
  
  - [ ] 15.4 Add cosmic theme animations
    - Subtle pulsing for active elements (CSS keyframes)
    - Fade-in for page load
    - Keep animations subtle and performant
    - _Requirements: 7.4, 7.5_


- [ ] 16. Implement responsive design
  - [ ] 16.1 Test and fix mobile layout (< 768px)
    - Single column layouts for all views
    - Hide sources panel in chat
    - Stack form + results vertically
    - Scrollable tabs
    - Test on mobile viewport
    - _Requirements: 7.2_
  
  - [ ] 16.2 Test and fix tablet layout (768px - 1024px)
    - 2-column grids where appropriate
    - Adjusted spacing and padding
    - Test on tablet viewport
    - _Requirements: 7.2_
  
  - [ ] 16.3 Test and fix desktop layout (> 1024px)
    - 3-column grids for chat view
    - 2-column grids for other views
    - Optimal spacing (max-w-[1200px] container)
    - _Requirements: 7.1, 7.2_

- [ ] 17. Add accessibility features
  - [ ] 17.1 Implement keyboard navigation
    - Tab order for all interactive elements
    - Arrow keys for command palette navigation
    - Enter/Space for buttons
    - Escape to close dialogs and command palette
    - Test with keyboard only
    - _Requirements: 6.1, 6.2_
  
  - [ ] 17.2 Add ARIA labels and roles
    - Label all form inputs with htmlFor
    - Add aria-label to icon buttons
    - Add role="status" to loading states
    - Add aria-live for dynamic content
    - _Requirements: 7.1_
  
  - [ ] 17.3 Ensure color contrast
    - Test all text against backgrounds (use browser DevTools)
    - Ensure 4.5:1 minimum contrast ratio
    - Add visible focus indicators (outline)
    - Test in both light and dark modes
    - _Requirements: 7.3, 7.6_
  
  - [ ] 17.4 Add skip link
    - Add "Skip to main content" link at top of AppShell
    - Hidden until focused (sr-only + focus:not-sr-only)
    - Link to main content area with id="main-content"
    - _Requirements: 7.1_

- [ ] 18. Create integration with Syzio PM (mock)
  - [ ] 18.1 Create Syzio API client
    - File: `lib/demo6/syzio-api.ts`
    - Implement fetchProjects function (returns mock data)
    - Implement fetchIssues function (returns mock data)
    - Implement createIssue function (simulates API call)
    - Implement updateIssue function (simulates API call)
    - Add realistic delays (300-500ms) with setTimeout
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 18.2 Implement sync status indicator
    - Add sync status Badge to TopBar
    - Display last sync time
    - Add manual sync Button
    - Handle sync errors with Alert
    - Store sync status in DataContext
    - _Requirements: 8.2, 8.5_
  
  - [ ] 18.3 Connect Stories Generator to PM
    - Implement "Export to PM" button handler
    - Call createIssue API from syzio-api.ts
    - Show success toast with issue ID
    - Update sync status
    - _Requirements: 2.5, 8.3_
  
  - [ ] 18.4 Connect Verify View to PM
    - Implement "Create Fix Task" button handler
    - Call createIssue API with finding details
    - Show success toast
    - _Requirements: 4.6, 8.3_

- [ ] 19. Create integration with Dev Monitoring (mock)
  - [ ] 19.1 Create DevMon API client
    - File: `lib/demo6/devmon-api.ts`
    - Implement fetchReleases function (returns mock data)
    - Implement fetchReleaseDetails function (returns mock data)
    - Implement fetchCommits function (returns mock data)
    - Add realistic delays (300-500ms)
    - _Requirements: 8.6_
  
  - [ ] 19.2 Connect Release Q&A to DevMon
    - Fetch release data on selection using devmon-api.ts
    - Combine with PM data from syzio-api.ts
    - Display in answer panel
    - _Requirements: 5.1, 5.2, 8.6_
  
  - [ ] 19.3 Connect Verify View to DevMon
    - Fetch commit data for trace matrix
    - Build dependency graph from combined data
    - _Requirements: 4.1, 8.6_

- [ ] 20. Polish and final touches
  - [ ] 20.1 Optimize performance
    - Add React.memo to expensive components (MessageBubble, StoryCard)
    - Implement lazy loading for heavy views (use React.lazy)
    - Debounce search inputs (300ms)
    - Test performance with React DevTools Profiler
    - _Requirements: 7.1_
  
  - [ ] 20.2 Test all flows end-to-end
    - Chat: send message → receive response → click citation → view source
    - Stories: configure → generate → edit → export to PM
    - Test Data: select schema → configure → generate → export CSV
    - Verify: view findings → click finding → create task
    - Release Q&A: select release → ask question → view answer
    - Command Palette: open (⌘K) → search → execute command
    - Theme: switch between light/dark/dark-gray-blue
    - _Requirements: All_
  
  - [ ] 20.3 Update demo selector page
    - Verify Canis box is properly configured with id="demo6"
    - Test navigation from selector to /demo6
    - Ensure description and features are accurate
    - _Requirements: 7.1_
  
  - [ ] 20.4 Create README for demo6
    - File: `README-DEMO6.md` in project root
    - Document setup instructions
    - List features and user flows
    - Add screenshots (optional for PoC)
    - Document known limitations
    - _Requirements: All_
  
  - [ ] 20.5 Add inline code comments
    - Document complex logic in components
    - Explain mock AI integration points
    - Note future enhancements (// TODO: Real AI integration)
    - _Requirements: All_
  
  - [ ] 20.6 Prepare for deployment
    - Test build process (`pnpm build`)
    - Verify no TypeScript errors
    - Test production build locally (`pnpm start`)
    - Ensure all environment variables are documented
    - _Requirements: All_

## Implementation Notes

### Following Demo4/Demo5 Pattern

- Use exact same folder structure: `app/(demo6_root)/`
- Follow providers pattern: ErrorBoundary → Theme → Data → UI
- Use same component patterns (AppShell, view components)
- Keep consistent naming: `demo6-globals.css`, `components/demo6/`, `lib/demo6/`
- Use Geist fonts like demo4
- Include Analytics from Vercel

### Technology Choices

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **UI Components**: shadcn/ui (Button, Card, Badge, Input, Textarea, Select, Dialog, Command, etc.)
- **Styling**: Tailwind CSS with custom theme
- **State**: React Context API (DataContext, UIContext)
- **Fonts**: Geist Sans + Geist Mono
- **Toast**: Sonner
- **Icons**: Lucide React

### Mock Data Strategy

- All AI responses are mocked with realistic delays (300-800ms)
- All API calls are mocked (Syzio PM, Dev Monitoring)
- Use setTimeout to simulate async operations
- Keep mock data comprehensive but simple

### Testing Approach

- Manual testing for PoC
- Test all user flows end-to-end
- Test responsive breakpoints
- Test keyboard navigation
- Test theme switching
- No automated tests required for PoC

### Deployment

- Build with `pnpm build`
- Deploy to Render (or Vercel)
- No environment variables needed for PoC (all mocked)
- Ensure `/demo6` route works correctly
