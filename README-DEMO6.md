# Syzio Canis (Demo6) - README

## Overview

**Syzio Canis** is an AI-powered intelligent project assistant that integrates with the Syzio ecosystem. It provides conversational AI capabilities powered by RAG (Retrieval-Augmented Generation) to help teams interact with project documentation, backlog, and requirements.

## Features

### 1. Chat Interface (RAG)
- Conversational AI with document context
- Source citations with popover previews
- Thread management
- Quick actions (Generate Story, Verify, Test Data, Release Q&A)
- File upload support (UI ready)

### 2. Stories Generator
- Generate user stories from persona and goal
- EARS/Gherkin format acceptance criteria
- Automatic estimation
- Conflict detection with existing backlog
- Export to Syzio PM

### 3. Test Data Generator
- Generate test data from OpenAPI/JSON schemas
- Configurable record count and edge cases
- YAML rules editor
- Export to JSON/CSV/SQL formats
- Live preview table

### 4. Verify View
- Requirements verification
- Findings table (consistency, completeness, clarity)
- Trace matrix (Doc ↔ Story ↔ Release)
- Create fix tasks directly to PM

### 5. Release Q&A
- Query releases from Dev Monitoring
- Quick questions (What's in the package?, Gates met?, Changes?)
- AI-generated answers with sources
- Links to DevMon and PM

### 6. Settings
- Data source connectors (PM, DevMon, Documents)
- NFR rules (P95, WCAG)
- Domain dictionary

### 7. Command Palette
- Global ⌘K / Ctrl+K access
- Navigation commands
- Action commands
- Fuzzy search

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS with custom cosmic theme
- **State**: React Context API
- **Fonts**: Geist Sans + Geist Mono
- **Toast**: Sonner
- **Icons**: Lucide React

## Theme

**"Constellation Dependencies"** - Cosmic dark mode with:
- Navy/graphite backgrounds
- Purple/cyan accents
- Subtle pulsing animations
- Star-forming loading states

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Access

Navigate to: `http://localhost:3000/demo6`

## Project Structure

```
app/(demo6_root)/
├── layout.tsx              # Root layout with providers
├── providers.tsx           # Context providers
└── demo6/
    └── page.tsx            # Main page

components/demo6/
├── app-shell.tsx           # Main layout
├── canis-main-view.tsx     # Main view with tabs
├── canis-chat.tsx          # Chat interface
├── stories-generator.tsx   # Story generation
├── test-data-generator.tsx # Test data generation
├── verify-view.tsx         # Requirements verification
├── release-qa.tsx          # Release Q&A
├── settings-view.tsx       # Settings
├── command-palette.tsx     # ⌘K interface
├── suggestion-banner.tsx   # Proactive suggestions
├── demo-banner.tsx         # Demo banner
├── theme-provider.tsx      # Theme management
└── error-boundary.tsx      # Error handling

lib/demo6/
├── data-context.tsx        # Main state management
├── ui-context.tsx          # UI state
├── mock-data.ts            # Mock data
├── types.ts                # TypeScript types
├── syzio-api.ts            # Syzio PM API client (mock)
├── devmon-api.ts           # Dev Monitoring API client (mock)
└── export-utils.ts         # Export utilities

app/demo6-globals.css       # Global styles
```

## Key Flows

### Chat Flow
1. Select thread from sidebar
2. Type message and send
3. AI responds with citations
4. Click citation to view source
5. Use actions menu for quick commands

### Story Generation Flow
1. Fill persona and goal
2. Select source documents
3. Click Generate
4. Review generated stories with AC
5. Export to Syzio PM

### Test Data Flow
1. Select schema
2. Configure record count
3. Optionally edit YAML rules
4. Generate data
5. Preview in table
6. Export to JSON/CSV/SQL

### Verify Flow
1. View findings table
2. Check trace matrix
3. Click "Create Task" for fixes
4. Task created in Syzio PM

### Release Q&A Flow
1. Select release
2. Click quick question or ask custom
3. View AI answer with sources
4. Open in DevMon or PM

## Mock Data

All AI responses and API calls are mocked for PoC:
- Chat responses: 500ms delay
- Story generation: 400ms delay
- Test data generation: 300ms delay
- API calls: 300-500ms delays

## Known Limitations (PoC)

- No real AI integration (mock responses)
- No real API integration (mock clients)
- File upload UI only (no processing)
- Simplified dependency graph
- No authentication
- No data persistence

## Future Enhancements

- Real AI integration (OpenAI/Grok)
- Vector DB for RAG (Pinecone/Weaviate)
- Real Syzio PM API integration
- Real Dev Monitoring integration
- Document processing (PDF/MD)
- Advanced dependency visualization
- Proactive risk detection
- Stand-up copilot
- Release impact simulator

## License

Part of Syzio ecosystem - Internal demo

## Contact

For questions or feedback, contact the Syzio team.
