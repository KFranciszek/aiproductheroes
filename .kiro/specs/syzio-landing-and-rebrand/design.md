# Design Document - Syzio Landing Page & Rebrand

## Overview

This document outlines the technical design for creating a modern, tech-forward landing page for Syzio - a project management platform that brings perfect alignment to IT teams. The design focuses on a cosmic/celestial theme representing the astronomical concept of syzygy (perfect alignment of celestial bodies).

### Design Philosophy

**Core Metaphor:** Syzygy - when 3+ celestial bodies align perfectly
**Visual Language:** Space, cosmos, orbital mechanics, gravitational harmony
**Tone:** Tech-forward, modern, professional, aspirational
**Target Audience:** IT teams (developers, product managers, designers) in startups and enterprises

---

## Architecture

### Route Structure

```
/                          → Landing page (new)
/demo                      → Demo mode (existing app with name change)
/demo/*                    → All existing app routes
```

### Component Hierarchy

```
app/
├── page.tsx                    → Landing page (NEW)
├── demo/
│   └── page.tsx               → Demo wrapper (MODIFIED - adds "Syzio" name)
├── layout.tsx                 → Root layout (MODIFIED - conditional nav)
components/
├── landing/                   → NEW landing page components
│   ├── hero-section.tsx
│   ├── problem-section.tsx
│   ├── three-pillars.tsx
│   ├── ai-features.tsx
│   ├── multi-team-sync.tsx
│   ├── origin-story.tsx
│   ├── social-proof.tsx
│   ├── final-cta.tsx
│   └── footer.tsx
├── ui/                        → Existing shadcn components (reuse)
└── [existing components]      → Unchanged
```

---

## Data Models

### Newsletter Signup (localStorage)

```typescript
interface NewsletterSignup {
  email: string
  companyName?: string
  teamSize?: '2-10' | '11-50' | '51-200' | '200+'
  timestamp: Date
  source: 'hero' | 'footer' | 'exit-intent'
}
```

### Demo Session (localStorage)

```typescript
interface DemoSession {
  sessionId: string
  startTime: Date
  lastActivity: Date
  completedActions: string[]
  exitSurvey?: {
    rating: 1 | 2 | 3 | 4 | 5
    favoriteFeature?: string
    wouldRecommend: boolean
  }
}
```

---

## Design System

### Color Palette (Space/Cosmic Theme)

```css
/* Background Colors */
--bg-primary: #0a0e1a;        /* Deep space */
--bg-secondary: #151b2e;      /* Dark blue */
--bg-tertiary: #1e2538;       /* Lighter blue */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #a0aec0;
--text-muted: #6b7280;

/* Accent Colors (Three Pillars) */
--accent-blue: #3b82f6;       /* Team Syzio */
--accent-purple: #8b5cf6;     /* Tool Syzio */
--accent-green: #10b981;      /* Sprint Syzio */
--accent-cyan: #06b6d4;       /* Highlights */

/* Gradients */
--gradient-cosmic: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-hero: linear-gradient(180deg, #0a0e1a 0%, #1e2538 100%);
```


### Typography

```css
/* Font Families */
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Spacing System

```css
/* Consistent spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Animation Tokens

```css
/* Timing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 1000ms;
```

---

## Components Design

### 1. Navigation (Sticky Header)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Syzio Logo]    Features  How  Pricing    [Try Demo]   │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: 64px
- Background: `rgba(10, 14, 26, 0.8)` with backdrop blur
- Sticky positioning with smooth scroll behavior
- Logo: 32px height, includes icon + wordmark
- Links: Smooth scroll to sections (except Demo which navigates)
- Demo button: Primary CTA style with gradient

**Component Structure:**
```tsx
<nav className="sticky top-0 z-50 backdrop-blur-lg bg-bg-primary/80">
  <div className="container mx-auto px-6 h-16 flex items-center justify-between">
    <Logo />
    <NavLinks />
    <Button variant="primary">Try Demo</Button>
  </div>
</nav>
```


### 2. Hero Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│              [3D Animation: 3 spheres aligning]         │
│                                                          │
│                When teams, tasks, and                   │
│                tools align perfectly                    │
│                                                          │
│         Stop juggling 6 tools. Achieve syzio.          │
│                                                          │
│           [Try Demo]    [See How It Works ↓]           │
│                                                          │
│     "From 6 tools and 30 min standups to 1 view"      │
│              — Michał, Engineering Lead                 │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Min height: 100vh (full viewport)
- Background: Gradient from `--bg-primary` to `--bg-secondary`
- 3D Animation: Three.js or Spline embed (3 spheres orbiting and aligning)
- Headline: `text-6xl` (72px), `font-black`, centered
- Subheadline: `text-xl` (20px), `text-secondary`, centered
- CTAs: Primary (gradient) + Secondary (outline)
- Testimonial: Small quote below CTAs, `text-sm`, italic

**Animation Behavior:**
- Spheres continuously orbit
- On scroll: Spheres align perfectly (parallax effect)
- Subtle particle effects in background
- Smooth fade-in on page load

**Component Structure:**
```tsx
<section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-hero" />
  
  {/* 3D Animation */}
  <div className="w-full max-w-2xl h-96 mb-12">
    <SplineEmbed scene="syzio-alignment.splinecode" />
  </div>
  
  {/* Headline */}
  <h1 className="text-6xl font-black text-center mb-6 max-w-4xl">
    When teams, tasks, and<br />tools align perfectly
  </h1>
  
  {/* Subheadline */}
  <p className="text-xl text-secondary text-center mb-12">
    Stop juggling 6 tools. Achieve syzio.
  </p>
  
  {/* CTAs */}
  <div className="flex gap-4 mb-16">
    <Button size="lg" variant="gradient">Try Demo</Button>
    <Button size="lg" variant="outline">See How It Works ↓</Button>
  </div>
  
  {/* Testimonial */}
  <blockquote className="text-sm italic text-secondary">
    "From 6 tools and 30 min standups to 1 view"
    <br />— Michał, Engineering Lead
  </blockquote>
</section>
```


### 3. Problem Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  [Animated chaos: 6 tool logos scattered, lines cross]  │
│                                                          │
│         Your team is out of alignment                   │
│                                                          │
│  ❌ Information scattered across 6 tools               │
│  ❌ Automations break silently                         │
│  ❌ 2-hour manual reports every Friday                 │
│  ❌ "Who's working on what?" meetings                  │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-secondary`
- Padding: `py-24` (96px vertical)
- Animation: Tool logos (Jira, Slack, GitHub, Notion, etc.) scattered and connected by tangled lines
- Lines animate: Crossing, breaking, reconnecting chaotically
- Headline: `text-4xl`, `font-bold`, centered
- Pain points: `text-lg`, red X icons, stacked vertically

**Animation Behavior:**
- On scroll into view: Logos fly in from random directions
- Lines draw between logos creating visual chaos
- Some lines "break" with spark effect
- Subtle shake/vibration on logos

**Component Structure:**
```tsx
<section className="py-24 bg-bg-secondary">
  <div className="container mx-auto px-6">
    {/* Animated chaos visualization */}
    <div className="w-full max-w-4xl mx-auto h-96 mb-12 relative">
      <ChaoticToolsAnimation />
    </div>
    
    {/* Headline */}
    <h2 className="text-4xl font-bold text-center mb-12">
      Your team is out of alignment
    </h2>
    
    {/* Pain points */}
    <div className="max-w-2xl mx-auto space-y-6">
      <PainPoint icon="❌" text="Information scattered across 6 tools" />
      <PainPoint icon="❌" text="Automations break silently" />
      <PainPoint icon="❌" text="2-hour manual reports every Friday" />
      <PainPoint icon="❌" text='"Who\'s working on what?" meetings' />
    </div>
  </div>
</section>
```


### 4. Three Pillars Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  [3 columns with orbital animations]                    │
│                                                          │
│  🔵 Team Syzio    🟣 Tool Syzio    🟢 Sprint Syzio    │
│                                                          │
│  Everyone sees    Automations      Plan = Reality      │
│  the same state   self-heal                            │
│                                                          │
│  Real-time        Health Score     Auto drift          │
│  dependencies     monitoring       detection           │
│                                                          │
│  No human         Semantic IDs     One-click           │
│  middleware       (never break)    reporting           │
│                                                          │
│  [Hover each pillar → shows mini demo]                 │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-primary`
- Padding: `py-32` (128px vertical)
- Grid: 3 columns on desktop, stacked on mobile
- Each pillar: Card with gradient border matching its color
- Icons: Circular orbs with pillar color
- Hover effect: Card lifts, shows mini demo/screenshot

**Pillar Card Design:**
```
┌─────────────────────┐
│  🔵                 │  ← Colored orb icon
│  Team Syzio         │  ← Title (text-2xl, font-bold)
│  ─────────────      │  ← Divider
│  • Feature 1        │  ← Bullet points (text-base)
│  • Feature 2        │
│  • Feature 3        │
│                     │
│  [Mini demo img]    │  ← Shows on hover
└─────────────────────┘
```

**Animation Behavior:**
- On scroll: Pillars fade in sequentially (left → center → right)
- Orbital lines connect the three pillars
- Hover: Card scales up (1.05), shows demo screenshot
- Orb icons pulse gently

**Component Structure:**
```tsx
<section className="py-32 bg-bg-primary relative">
  {/* Orbital connection lines (SVG) */}
  <OrbitalConnections />
  
  <div className="container mx-auto px-6">
    <h2 className="text-5xl font-bold text-center mb-20">
      Three forces, one syzio
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <PillarCard
        color="blue"
        icon="🔵"
        title="Team Syzio"
        features={[
          "Everyone sees the same state",
          "Real-time dependencies",
          "No human middleware"
        ]}
        demoImage="/demos/team-syzio.png"
      />
      
      <PillarCard
        color="purple"
        icon="🟣"
        title="Tool Syzio"
        features={[
          "Automations self-heal",
          "Health Score monitoring",
          "Semantic IDs (never break)"
        ]}
        demoImage="/demos/tool-syzio.png"
      />
      
      <PillarCard
        color="green"
        icon="🟢"
        title="Sprint Syzio"
        features={[
          "Plan = Reality",
          "Auto drift detection",
          "One-click reporting"
        ]}
        demoImage="/demos/sprint-syzio.png"
      />
    </div>
  </div>
</section>
```


### 5. AI Features Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    AI THAT PREVENTS                      │
│                                                          │
│  [Split screen animation]                               │
│                                                          │
│  Left: Story A "Redesign auth"                          │
│  Right: Story B "Remove old login"                      │
│                                                          │
│  [AI mediator appears in center]                        │
│  ⚠️ Conflict detected: B depends on A                  │
│                                                          │
│  ✨ Auto-generate stories from docs                    │
│  ✨ AI suggests tasks based on context                 │
│  ✨ Stories "argue" - AI mediates                      │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-secondary`
- Padding: `py-24`
- Split screen: 2 columns showing conflicting stories
- Center: AI mediator icon/animation
- Features: Listed below with sparkle icons

**Animation Behavior:**
- Stories slide in from left and right
- AI mediator fades in center with glow effect
- Conflict warning pulses
- Connection lines draw between stories and AI

**Component Structure:**
```tsx
<section className="py-24 bg-bg-secondary">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-4">
      AI That Prevents Conflicts,<br />Not Just Detects Them
    </h2>
    
    {/* Split screen demo */}
    <div className="max-w-5xl mx-auto my-16 relative">
      <div className="grid grid-cols-2 gap-8">
        {/* Story A */}
        <StoryCard
          title="Story A"
          content="Redesign user authentication"
          status="In Progress"
        />
        
        {/* Story B */}
        <StoryCard
          title="Story B"
          content="Remove old login system"
          status="Planned"
        />
      </div>
      
      {/* AI Mediator in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AIMediator
          alert="⚠️ Conflict detected: B depends on A"
        />
      </div>
    </div>
    
    {/* AI Features */}
    <div className="max-w-2xl mx-auto space-y-4">
      <Feature icon="✨" text="Auto-generate stories from docs" />
      <Feature icon="✨" text="AI suggests tasks based on context" />
      <Feature icon="✨" text='Stories "argue" - AI mediates' />
    </div>
    
    <div className="text-center mt-12">
      <Button variant="outline">See AI in Action</Button>
    </div>
  </div>
</section>
```


### 6. Multi-Team Sync Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                  MULTI-TEAM SYNC                         │
│                                                          │
│  [Interactive diagram: 4 teams, interconnected tasks]   │
│                                                          │
│  One project. Many teams. Perfect sync.                 │
│                                                          │
│  Frontend ←→ Backend ←→ DevOps ←→ Design               │
│                                                          │
│  Real-time visibility. Shared resources. Zero meetings. │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-primary`
- Padding: `py-24`
- Network diagram: 4 team nodes with interconnected task nodes
- Connections: Animated lines showing data flow
- Responsive: Diagram scales on mobile

**Animation Behavior:**
- Team nodes pulse in sequence
- Task nodes light up when "completed"
- Connection lines animate with data packets flowing
- Hover on team: Highlights their tasks

**Component Structure:**
```tsx
<section className="py-24 bg-bg-primary">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-4">
      One Project, Many Teams, Perfect Sync
    </h2>
    
    {/* Network diagram */}
    <div className="max-w-6xl mx-auto my-16">
      <TeamNetworkDiagram
        teams={[
          { name: 'Frontend', color: 'blue', tasks: 12 },
          { name: 'Backend', color: 'purple', tasks: 15 },
          { name: 'DevOps', color: 'green', tasks: 8 },
          { name: 'Design', color: 'cyan', tasks: 10 }
        ]}
      />
    </div>
    
    {/* Features */}
    <div className="text-center space-y-2">
      <p className="text-xl text-secondary">
        Real-time visibility. Shared resources. Zero meetings.
      </p>
      <p className="text-sm text-muted">
        Scales from 2 teams to 20+
      </p>
    </div>
  </div>
</section>
```

### 7. Origin Story Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    ORIGIN STORY                          │
│                                                          │
│  [Parallax: celestial bodies slowly aligning as scroll] │
│                                                          │
│  In astronomy, syzygy is when 3 celestial bodies       │
│  align perfectly - a rare moment of cosmic harmony.     │
│                                                          │
│  In project management, perfect alignment is rare too.  │
│                                                          │
│  Syzio brings back that perfect alignment.              │
│                                                          │
│  [CTA: Achieve Your First Syzio]                        │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: Dark gradient with stars
- Padding: `py-32`
- Parallax: Background celestial bodies move slower than content
- Typography: Large, readable, centered
- CTA: Prominent gradient button

**Animation Behavior:**
- Parallax scrolling: Stars and planets move at different speeds
- Celestial bodies gradually align as user scrolls
- Text fades in sequentially
- Final alignment triggers subtle glow effect

**Component Structure:**
```tsx
<section className="py-32 bg-gradient-cosmic relative overflow-hidden">
  {/* Parallax background */}
  <ParallaxStars />
  <ParallaxPlanets alignment={scrollProgress} />
  
  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <p className="text-2xl leading-relaxed">
        In astronomy, syzygy is when 3 celestial bodies
        align perfectly - a rare moment of cosmic harmony.
      </p>
      
      <p className="text-2xl leading-relaxed text-secondary">
        In project management, perfect alignment is just as rare.
      </p>
      
      <p className="text-3xl font-bold">
        Syzio brings back that perfect alignment.
      </p>
      
      <Button size="lg" variant="gradient" className="mt-12">
        Achieve Your First Syzio
      </Button>
    </div>
  </div>
</section>
```


### 8. Social Proof Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                   SOCIAL PROOF                           │
│                                                          │
│  [Carousel of testimonials with company logos]          │
│                                                          │
│  "6 tools → 1 view. 30 min standups → 5 min."         │
│  — Michał, Engineering Lead @ TechCorp                  │
│                                                          │
│  #SyzioAchieved  #TeamSyzio  #PerfectAlignment         │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-secondary`
- Padding: `py-24`
- Carousel: Auto-rotating testimonials (5s interval)
- Company logos: Grayscale, hover to color
- Hashtags: Clickable (link to social media search)

**Component Structure:**
```tsx
<section className="py-24 bg-bg-secondary">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-16">
      Teams Achieving Syzio
    </h2>
    
    {/* Testimonial carousel */}
    <TestimonialCarousel
      testimonials={[
        {
          quote: "6 tools → 1 view. 30 min standups → 5 min.",
          author: "Michał",
          role: "Engineering Lead",
          company: "TechCorp",
          logo: "/logos/techcorp.svg"
        },
        // More testimonials...
      ]}
    />
    
    {/* Hashtags */}
    <div className="flex justify-center gap-6 mt-12">
      <Hashtag>#SyzioAchieved</Hashtag>
      <Hashtag>#TeamSyzio</Hashtag>
      <Hashtag>#PerfectAlignment</Hashtag>
    </div>
  </div>
</section>
```

### 9. Final CTA Section

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    FINAL CTA                             │
│                                                          │
│         Ready to achieve perfect alignment?              │
│                                                          │
│              [Try Demo - It's Free]                      │
│                                                          │
│  📧 Or get early access: [email] [Sign Up]             │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: Gradient with subtle animation
- Padding: `py-32`
- Primary CTA: Large "Try Demo" button
- Secondary: Email signup form inline
- Form validation: Real-time email validation

**Component Structure:**
```tsx
<section className="py-32 bg-gradient-hero">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-5xl font-bold mb-12">
      Ready to achieve perfect alignment?
    </h2>
    
    <Button size="xl" variant="gradient" className="mb-12">
      Try Demo - It's Free
    </Button>
    
    <div className="max-w-md mx-auto">
      <p className="text-secondary mb-4">Or get early access:</p>
      <NewsletterForm
        placeholder="your@email.com"
        buttonText="Sign Up"
        onSubmit={handleNewsletterSignup}
      />
    </div>
  </div>
</section>
```


### 10. Footer

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                      FOOTER                              │
│  Product    Company    Legal    Social                  │
│  Features   About      Privacy  Twitter                 │
│  Demo       Blog       Terms    LinkedIn                │
│  Pricing    Careers             GitHub                  │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--bg-primary`
- Padding: `py-16`
- Grid: 4 columns on desktop, stacked on mobile
- Links: Hover effect with color transition
- Social icons: Circular with hover scale

**Component Structure:**
```tsx
<footer className="py-16 bg-bg-primary border-t border-white/10">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      <FooterColumn
        title="Product"
        links={[
          { label: 'Features', href: '#features' },
          { label: 'Demo', href: '/demo' },
          { label: 'Pricing', href: '#pricing', badge: 'Soon' }
        ]}
      />
      
      <FooterColumn
        title="Company"
        links={[
          { label: 'About', href: '#about' },
          { label: 'Blog', href: '#blog', badge: 'Soon' },
          { label: 'Careers', href: '#careers', badge: 'Soon' }
        ]}
      />
      
      <FooterColumn
        title="Legal"
        links={[
          { label: 'Privacy', href: '#privacy', badge: 'Soon' },
          { label: 'Terms', href: '#terms', badge: 'Soon' }
        ]}
      />
      
      <FooterColumn
        title="Social"
        links={[
          { label: 'Twitter', href: '#', icon: TwitterIcon },
          { label: 'LinkedIn', href: '#', icon: LinkedInIcon },
          { label: 'GitHub', href: '#', icon: GitHubIcon }
        ]}
      />
    </div>
    
    <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted">
      © 2025 Syzio. All rights reserved.
    </div>
  </div>
</footer>
```

---

## Technical Implementation Details

### Animation Libraries

**Primary: Framer Motion**
```bash
npm install framer-motion
```

Use for:
- Page transitions
- Scroll-triggered animations
- Component entrance/exit
- Hover effects

**3D Animations: Spline or Three.js**

Option A - Spline (Easier):
```tsx
import Spline from '@splinetool/react-spline';

<Spline scene="https://prod.spline.design/[scene-id]/scene.splinecode" />
```

Option B - Three.js (More control):
```bash
npm install three @react-three/fiber @react-three/drei
```

### Responsive Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Performance Optimizations

1. **Image Optimization**
   - Use Next.js `<Image>` component
   - WebP format with fallbacks
   - Lazy loading for below-fold images

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Separate bundle for 3D animations

3. **Font Loading**
   - Use `next/font` for Inter
   - Preload critical fonts
   - Font display: swap

4. **Animation Performance**
   - Use CSS transforms (GPU accelerated)
   - `will-change` for animated elements
   - Reduce motion for accessibility


### SEO & Meta Tags

```tsx
// app/page.tsx (Landing page)
export const metadata = {
  title: 'Syzio - When Teams, Tasks, and Tools Align Perfectly',
  description: 'Stop juggling 6 tools. Achieve perfect alignment with Syzio - the project management platform built for IT teams.',
  keywords: 'project management, team collaboration, IT tools, syzygy, alignment',
  openGraph: {
    title: 'Syzio - Perfect Alignment for IT Teams',
    description: 'From 6 tools and 30 min standups to 1 view',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syzio - When Teams Align',
    description: 'Stop juggling 6 tools. Achieve syzio.',
    images: ['/twitter-card.png'],
  }
}
```

### Accessibility

1. **Semantic HTML**
   - Proper heading hierarchy (h1 → h2 → h3)
   - `<nav>`, `<main>`, `<section>`, `<footer>` landmarks
   - ARIA labels for interactive elements

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators
   - Skip to content link

3. **Screen Readers**
   - Alt text for all images
   - ARIA labels for icon buttons
   - Descriptive link text

4. **Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Demo Mode Design

### Minimal Changes to Existing App

**What Changes:**
1. Logo text: "BrainTask" → "Syzio"
2. Page title: "BrainTask" → "Syzio"
3. README.md: Update name

**What Stays the Same:**
- All colors (keep green theme)
- All layouts
- All components
- All functionality
- All terminology (Sprints, Issues, etc.)

### Demo Mode Header Addition

```tsx
// components/demo-header.tsx
export function DemoHeader() {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 text-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">Demo Mode</span>
        <span className="text-blue-200">Explore all features freely</span>
      </div>
      <Link href="/" className="hover:underline">
        ← Back to Home
      </Link>
    </div>
  )
}
```

**Integration:**
```tsx
// app/demo/layout.tsx
export default function DemoLayout({ children }) {
  return (
    <>
      <DemoHeader />
      {children}
    </>
  )
}
```

---

## Error Handling

### Newsletter Signup Errors

```tsx
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const handleSubmit = async (email: string) => {
  if (!validateEmail(email)) {
    toast.error('Please enter a valid email')
    return
  }
  
  // Check if already signed up
  const existing = localStorage.getItem('newsletter_signups')
  if (existing?.includes(email)) {
    toast.info("You're already aligned with us!")
    return
  }
  
  // Save to localStorage
  const signups = JSON.parse(existing || '[]')
  signups.push({
    email,
    timestamp: new Date().toISOString(),
    source: 'landing-page'
  })
  localStorage.setItem('newsletter_signups', JSON.stringify(signups))
  
  toast.success('🌕 You\'re on the path to perfect syzio!')
}
```

### 404 Page

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-secondary mb-8">
          This page is out of alignment
        </p>
        <Link href="/">
          <Button variant="gradient">Return to Syzio</Button>
        </Link>
      </div>
    </div>
  )
}
```

---

## Testing Strategy

### Visual Regression Testing

Use Playwright for screenshot comparisons:
```bash
npm install -D @playwright/test
```

Test critical views:
- Landing page hero (desktop/mobile)
- Three pillars section
- Demo mode entry

### Accessibility Testing

Use axe-core:
```bash
npm install -D @axe-core/playwright
```

Test for:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility

### Performance Testing

Lighthouse CI in GitHub Actions:
- Performance score > 90
- Accessibility score > 95
- Best Practices score > 90
- SEO score > 95

---

## Deployment Considerations

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://syzio.com
NEXT_PUBLIC_DEMO_MODE=true
```

### Build Optimization

```js
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

### Analytics (Optional)

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## Summary

This design document provides a complete technical blueprint for the Syzio landing page and rebrand. Key highlights:

✅ **Modern, tech-forward design** with space/cosmic theme
✅ **10 distinct sections** each with specific purpose and animations
✅ **Minimal demo changes** - only name update in existing app
✅ **Performance-first** approach with optimization strategies
✅ **Accessibility compliant** with WCAG 2.1 AA standards
✅ **SEO optimized** with proper meta tags and semantic HTML
✅ **Responsive design** mobile-first approach

The design balances visual impact with technical feasibility, ensuring the landing page tells the Syzio story compellingly while maintaining excellent performance and user experience.
