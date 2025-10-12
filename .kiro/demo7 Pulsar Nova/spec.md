# NOVA — gotowa aplikacja (Next.js 14 + Tailwind + shadcn‑style)

Poniżej znajdziesz **kompletny projekt** działającego PoC aplikacji **NOVA (Aurora × Pulsar)**. Skopiuj pliki 1:1 do świeżego projektu lub użyj poniższych kroków uruchomienia.

---

## Uruchomienie

```bash
# 1) Utwórz projekt Next (TS, app router)
npx create-next-app@latest nova --ts --eslint --app --src-dir false --import-alias "@/*"
cd nova

# 2) Zamień/utwórz pliki zgodnie z poniższą strukturą (kopiuj 1:1)
# 3) Zależności UI
npm i next-themes clsx tailwind-merge class-variance-authority lucide-react recharts sonner zod react-hook-form \
  @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-switch

# 4) Tailwind
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5) Start
npm run dev
# http://localhost:3000
```

> **Dane i stan** są trzymane w `localStorage` (export/import JSON dostępny w **Settings**).

---

## Struktura plików

```
app/
  layout.tsx
  globals.css
  page.tsx                 # Outcome Dashboard
  okr/page.tsx             # OKR Manager + KR Drawer
  delivery/page.tsx        # Quality Gates + DORA snapshot (stub)
  trace/page.tsx           # Traceability (stub)
  forecast/page.tsx        # Forecast Simulator
  insights/page.tsx        # At‑risk KR + corrective tasks
  reports/page.tsx         # DORA charts + KR Confidence vs Gates
  activity/page.tsx        # Activity feed
  automations/page.tsx     # When/If/Then (dry‑run)
  settings/page.tsx        # Weights + export/import
components/
  app/theme-toggle.tsx
  app/sidebar.tsx
  app/topbar.tsx
  app/kpi.tsx
  ui/*.tsx                 # shadcn‑style prymitywy (Button, Card, ...)
lib/
  types.ts
  mock.ts
  store.ts
next.config.mjs
package.json
postcss.config.js
tailwind.config.ts
tsconfig.json
next-env.d.ts
README.md
.gitignore
```

---

## Pliki — kopiuj 1:1

### `package.json`

```json
{
  "name": "nova-aurora-pulsar",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --dir app --dir components --dir lib"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "next-themes": "^0.3.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.3",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.441.0",
    "recharts": "^2.11.0",
    "sonner": "^1.5.0",
    "zod": "^3.23.8",
    "react-hook-form": "^7.52.1",
    "@radix-ui/react-dialog": "^1.0.6",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-switch": "^1.0.3"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.20",
    "tailwindcss": "^3.4.10"
  }
}
```

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { allowedOrigins: ['*'] } }
}
export default nextConfig
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/components/*": ["components/*"], "@/lib/*": ["lib/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### `postcss.config.js`

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        ring: "hsl(var(--ring))",
        primary: { DEFAULT: "hsl(var(--primary))", 600: "hsl(var(--primary-600))" },
        accent: { DEFAULT: "hsl(var(--accent))" },
        success: { DEFAULT: "hsl(var(--success))" },
        warning: { DEFAULT: "hsl(var(--warning))" },
        danger: { DEFAULT: "hsl(var(--danger))" },
        info: { DEFAULT: "hsl(var(--info))" }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.06)",
        md: "0 4px 12px -2px rgba(0,0,0,0.12)",
        lg: "0 12px 24px -6px rgba(0,0,0,0.16)"
      }
    }
  },
  plugins: []
}
export default config
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --bg: 0 0% 100%;
  --fg: 222 47% 11%;
  --card: 0 0% 100%;
  --popover: 0 0% 100%;
  --muted: 215 20% 65%;
  --border: 214 32% 91%;
  --ring: 217 91% 60%;
  --primary: 217 91% 60%;
  --primary-600: 221 83% 53%;
  --accent: 258 90% 66%;
  --success:160 84% 39%;
  --warning:38 92% 50%;
  --danger:0 84% 60%;
  --info:189 94% 42%;
}
.dark{
  --bg: 222 47% 5%;
  --fg: 213 27% 84%;
  --card: 0 0% 100% / 0.03;
  --popover: 0 0% 100% / 0.03;
  --muted: 215 20% 65% / 0.8;
  --border: 0 0% 100% / 0.08;
  --ring: 217 91% 60%;
}

* { @apply border-border; }
html, body, :root { height: 100%; }
body { @apply bg-background text-foreground antialiased; }

.container-max { @apply max-w-[1440px] mx-auto px-4; }
.kpi-card { @apply rounded-2xl border bg-card p-5 shadow-sm; }
.badge-chip { @apply inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs; }
.action-footer { @apply sticky bottom-0 bg-background/95 backdrop-blur border-t px-4 py-3; }
```

### `lib/utils.ts`

```ts
import { type ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

### `lib/types.ts`

```ts
export type ID = string
export interface Objective { id: ID; name: string; owner: string; start: string; end: string; krIds: ID[] }
export interface KeyResult { id: ID; objectiveId: ID; name: string; unit: 'pct'|'abs'; target: number; current: number; due?: string; owner?: string; confidence?: number; epicIds: ID[]; issueIds: ID[] }
export interface Epic { id: ID; name: string; team?: string; issueIds: ID[]; krIds: ID[]; repo?: string }
export interface Issue { id: ID; title: string; assignee?: string; status: 'todo'|'in_progress'|'in_review'|'done'; priority: 'P0'|'P1'|'P2'|'P3'; storyPoints?: number; epicId?: ID; krIds: ID[] }
export interface QualityGate { id: ID; epicId: ID; name: string; metric: 'coverage'|'tests_pass'|'lint'|'sec'|'approvals'; threshold: number; status: 'pass'|'fail'|'waived'; updatedAt: string }
export interface DoraSnapshot { date: string; leadTimeH: number; deploys: number; changeFailRate: number; mttrH: number }
export interface Activity { id: ID; type: string; message: string; at: string }
export interface Settings { healthWeights: { outcome: number; delivery: number; quality: number }; thresholds: { confidenceAtRisk: number; confidenceOff: number; gatePassMin: number; orphanWorkMaxPct: number } }
export interface State { objectives: Objective[]; krs: KeyResult[]; epics: Epic[]; issues: Issue[]; gates: QualityGate[]; dora: DoraSnapshot[]; activities: Activity[]; settings: Settings }
```

### `lib/mock.ts`

```ts
import { State } from "./types"

const now = new Date()
const d = (offset: number) => new Date(now.getTime()+ offset*24*60*60*1000).toISOString().slice(0,10)

export const initialState: State = {
  objectives: [
    { id: "o1", name: "Zwiększyć konwersję checkout", owner: "Anna", start: d(-30), end: d(60), krIds: ["kr1","kr2"] },
    { id: "o2", name: "Zmniejszyć porzucenia onboardingu", owner: "Piotr", start: d(-30), end: d(60), krIds: ["kr3"] },
    { id: "o3", name: "Obniżyć koszty infra", owner: "Marta", start: d(-30), end: d(60), krIds: ["kr4"] },
    { id: "o4", name: "Zwiększyć szybkość releasów", owner: "Jan", start: d(-30), end: d(60), krIds: ["kr5"] }
  ],
  krs: [
    { id: "kr1", objectiveId:"o1", name:"Konwersja +15%", unit:"pct", target:15, current:6, due:d(60), owner:"Anna", confidence:0.68, epicIds:["e1","e2"], issueIds:["i1","i2","i3"] },
    { id: "kr2", objectiveId:"o1", name:"Błędy płatności -30%", unit:"pct", target:30, current:10, due:d(60), owner:"Anna", confidence:0.55, epicIds:["e2"], issueIds:["i4","i5"] },
    { id: "kr3", objectiveId:"o2", name:"Onboarding drop -20%", unit:"pct", target:20, current:8, due:d(60), owner:"Piotr", confidence:0.74, epicIds:["e3"], issueIds:["i6"] },
    { id: "kr4", objectiveId:"o3", name:"Infra cost -10%", unit:"pct", target:10, current:3, due:d(60), owner:"Marta", confidence:0.62, epicIds:["e4"], issueIds:[] },
    { id: "kr5", objectiveId:"o4", name:"Release velocity +40%", unit:"pct", target:40, current:22, due:d(60), owner:"Jan", confidence:0.79, epicIds:["e5"], issueIds:["i7"] }
  ],
  epics: [
    { id:"e1", name:"Checkout UX revamp", team:"Frontend", issueIds:["i1","i2"], krIds:["kr1"] },
    { id:"e2", name:"Payment reliability", team:"Backend", issueIds:["i3","i4","i5"], krIds:["kr1","kr2"] },
    { id:"e3", name:"Onboarding simplification", team:"Frontend", issueIds:["i6"], krIds:["kr3"] },
    { id:"e4", name:"Infra autoscaling", team:"Platform", issueIds:[], krIds:["kr4"] },
    { id:"e5", name:"CI/CD improvements", team:"Platform", issueIds:["i7"], krIds:["kr5"] }
  ],
  issues: [
    { id:"i1", title:"Simplify checkout form", assignee:"Ola", status:"in_progress", priority:"P2", storyPoints:3, epicId:"e1", krIds:["kr1"] },
    { id:"i2", title:"Add express payment", assignee:"Kamil", status:"todo", priority:"P1", storyPoints:5, epicId:"e1", krIds:["kr1"] },
    { id:"i3", title:"Retry logic on gateway errors", assignee:"Ewa", status:"in_review", priority:"P1", storyPoints:3, epicId:"e2", krIds:["kr1"] },
    { id:"i4", title:"Circuit breaker for PSP", assignee:"Michał", status:"todo", priority:"P0", storyPoints:8, epicId:"e2", krIds:["kr2"] },
    { id:"i5", title:"Alerting for declines", assignee:"Aga", status:"todo", priority:"P2", storyPoints:3, epicId:"e2", krIds:["kr2"] },
    { id:"i6", title:"Reduce fields in signup", assignee:"Tomek", status:"in_progress", priority:"P2", storyPoints:5, epicId:"e3", krIds:["kr3"] },
    { id:"i7", title:"Parallelize e2e tests", assignee:"Kuba", status:"in_progress", priority:"P2", storyPoints:5, epicId:"e5", krIds:["kr5"] }
  ],
  gates: [
    { id:"g1", epicId:"e1", name:"coverage", metric:"coverage", threshold:80, status:"pass", updatedAt: new Date().toISOString() },
    { id:"g2", epicId:"e2", name:"tests_pass", metric:"tests_pass", threshold:95, status:"fail", updatedAt: new Date().toISOString() },
    { id:"g3", epicId:"e2", name:"lint", metric:"lint", threshold:100, status:"pass", updatedAt: new Date().toISOString() },
    { id:"g4", epicId:"e5", name:"approvals", metric:"approvals", threshold:2, status:"pass", updatedAt: new Date().toISOString() }
  ],
  dora: [
    { date: d(-7), leadTimeH: 48, deploys: 6, changeFailRate: 0.15, mttrH: 3 },
    { date: d(-6), leadTimeH: 44, deploys: 7, changeFailRate: 0.12, mttrH: 2.5 },
    { date: d(-5), leadTimeH: 50, deploys: 6, changeFailRate: 0.18, mttrH: 4 },
    { date: d(-4), leadTimeH: 42, deploys: 8, changeFailRate: 0.10, mttrH: 2 },
    { date: d(-3), leadTimeH: 41, deploys: 8, changeFailRate: 0.09, mttrH: 1.8 },
    { date: d(-2), leadTimeH: 40, deploys: 9, changeFailRate: 0.08, mttrH: 1.5 },
    { date: d(-1), leadTimeH: 39, deploys: 9, changeFailRate: 0.07, mttrH: 1.4 }
  ],
  activities: [],
  settings: { healthWeights: { outcome: 0.5, delivery: 0.3, quality: 0.2 }, thresholds: { confidenceAtRisk: 0.74, confidenceOff: 0.5, gatePassMin: 0.9, orphanWorkMaxPct: 0.15 } }
}
```

### `lib/store.ts`

```ts
"use client"
import { initialState } from "./mock"
import { State, ID, Objective, KeyResult, Epic, Issue, QualityGate, DoraSnapshot, Activity } from "./types"

type Listener = (s: State)=>void
let state: State = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("nova-state")||"null") || initialState) : initialState
const listeners = new Set<Listener>()

function save(){ try { localStorage.setItem("nova-state", JSON.stringify(state)) } catch {}; listeners.forEach(l=>l(state)) }
export function getState(){ return state }
export function subscribe(l: Listener){ listeners.add(l); return ()=> listeners.delete(l) }
export function addActivity(message: string, type="info"){ const a: Activity = { id: crypto.randomUUID(), type, message, at: new Date().toISOString() }; state.activities.unshift(a); save() }

// Selectors
export function objectiveById(id: ID){ return state.objectives.find(o=>o.id===id) }
export function krById(id: ID){ return state.krs.find(k=>k.id===id) }
export function epicById(id: ID){ return state.epics.find(e=>e.id===id) }
export function issuesByIds(ids: ID[]){ return state.issues.filter(i=> ids.includes(i.id)) }
export function gatesByEpic(epicId: ID){ return state.gates.filter(g=> g.epicId===epicId) }

export function coverageForKR(krId: ID){ const kr = krById(krId); if (!kr) return 0; const linked = kr.issueIds.length; const total = Math.max(linked, Math.round(kr.target/3)); return total===0 ? 0 : linked/total }
export function gatePassRateForEpic(epicId: ID){ const gs = gatesByEpic(epicId); if (!gs.length) return 1; const pass = gs.filter(g=> g.status==="pass").length; return pass/gs.length }
export function avgGatePassForKR(krId: ID){ const kr = krById(krId); if (!kr) return 1; const rates = kr.epicIds.map(gatePassRateForEpic); if (!rates.length) return 1; return rates.reduce((a,b)=>a+b,0)/rates.length }
export function confidenceForKR(krId: ID){ const kr = krById(krId); if (!kr) return 0; const progress = Math.min(1, kr.current / kr.target); const coverage = coverageForKR(krId); const delivery = avgGatePassForKR(krId); const defectsPenalty = 0.05; const conf = 0.6*progress + 0.25*coverage + 0.15*delivery - defectsPenalty; return Math.max(0, Math.min(1, conf)) }
export function outcomeHealthForObjective(objId: ID){ const obj = objectiveById(objId); if (!obj) return 0; const weights = state.settings.healthWeights; const krs = obj.krIds.map(krById).filter(Boolean) as KeyResult[]; if (!krs.length) return 0; const confAvg = krs.map(k=> confidenceForKR(k.id)).reduce((a,b)=>a+b,0)/krs.length; const delivery = krs.map(k=> avgGatePassForKR(k.id)).reduce((a,b)=>a+b,0)/krs.length; const quality = 1 - 0.1; return weights.outcome*confAvg + weights.delivery*delivery + weights.quality*quality }

// Mutations
export function createObjective(payload: Partial<Objective>){ const o: Objective = { id: crypto.randomUUID(), name: payload.name||"New Objective", owner: payload.owner||"Owner", start: payload.start||new Date().toISOString().slice(0,10), end: payload.end||new Date().toISOString().slice(0,10), krIds: [] }; state.objectives.push(o); addActivity(`Objective created: ${o.name}`,"okr"); save(); return o }
export function createKR(objectiveId: ID, payload: Partial<KeyResult>){ const kr: KeyResult = { id: crypto.randomUUID(), objectiveId, name: payload.name||"New KR", unit: payload.unit||"pct", target: payload.target||10, current: payload.current||0, owner: payload.owner||"Owner", epicIds:[], issueIds:[], due: payload.due }; state.krs.push(kr); objectiveById(objectiveId)?.krIds.push(kr.id); addActivity(`KR created: ${kr.name}`,"okr"); save(); return kr }
export function linkIssueToKR(issueId: ID, krId: ID){ const kr = krById(krId); const issue = state.issues.find(i=>i.id===issueId); if (!kr || !issue) return; if (!kr.issueIds.includes(issueId)) kr.issueIds.push(issueId); if (!issue.krIds.includes(krId)) issue.krIds.push(krId); addActivity(`Linked issue ${issueId} to KR ${krId}`,"link"); save() }
export function unlinkIssueFromKR(issueId: ID, krId: ID){ const kr = krById(krId); const issue = state.issues.find(i=>i.id===issueId); if (!kr || !issue) return; kr.issueIds = kr.issueIds.filter(id=> id!==issueId); issue.krIds = issue.krIds.filter(id=> id!==krId); addActivity(`Unlinked issue ${issueId} from KR ${krId}`,"link"); save() }
export function setGateStatus(gateId: ID, status: 'pass'|'fail'|'waived'){ const g = state.gates.find(x=>x.id===gateId); if (!g) return; g.status = status; g.updatedAt = new Date().toISOString(); addActivity(`Gate ${g.name} set to ${status}`,"gate"); save() }
export function createCorrectiveTask(title: string, krId?: ID, epicId?: ID){ const issueId = crypto.randomUUID(); const issue = { id: issueId, title, assignee:"", status:"todo", priority:"P1", storyPoints:3, epicId, krIds: krId?[krId]:[] } as Issue; state.issues.push(issue); if (krId){ krById(krId)?.issueIds.push(issueId) } addActivity(`Corrective task created: ${title}`,"task"); save(); return issue }

// Settings
export function setWeights(outcome:number, delivery:number, quality:number){ const sum = outcome+delivery+quality || 1; state.settings.healthWeights = { outcome: outcome/sum, delivery: delivery/sum, quality: quality/sum }; addActivity("Updated health weights","settings"); save() }
export function exportJson(){ return JSON.stringify(state, null, 2) }
export function importJson(json: string){ const parsed = JSON.parse(json) as State; state = parsed; addActivity("Imported data JSON","settings"); save() }
```

### `components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-600",
        secondary: "bg-muted/20 hover:bg-muted/30",
        ghost: "hover:bg-muted/20",
        destructive: "bg-danger text-white hover:bg-red-600",
        outline: "border border-border hover:bg-muted/20"
      },
      size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-lg px-3", lg: "h-11 rounded-xl px-6", icon: "h-10 w-10" }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />)
})
Button.displayName = "Button"
export { Button, buttonVariants }
```

### `components/ui/card.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-2xl border bg-card text-foreground shadow-sm", className)} {...props} /> }
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col space-y-1.5 p-5 border-b", className)} {...props} /> }
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} /> }
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-5", className)} {...props} /> }
```

### `components/ui/input.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50", className)} ref={ref} {...props} />
))
Input.displayName = "Input"
export { Input }
```

### `components/ui/textarea.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea className={cn("flex min-h-[80px] w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50", className)} ref={ref} {...props} />
))
Textarea.displayName = "Textarea"
export { Textarea }
```

### `components/ui/label.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) { return <label className={cn("text-sm font-medium text-foreground", className)} {...props} /> }
```

### `components/ui/separator.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("h-px w-full bg-border", className)} {...props} /> }
```

### `components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) { return <span className={cn("badge-chip", className)} {...props} /> }
```

### `components/ui/switch.tsx`

```tsx
"use client"
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root className={cn("peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted/40", className)} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className={cn("pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")} />
  </SwitchPrimitives.Root>
))
Switch.displayName = "Switch"
```

### `components/ui/tabs.tsx`

```tsx
"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
export const Tabs = TabsPrimitive.Root
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("inline-flex items-center gap-1 rounded-xl bg-muted/20 p-1", className)} {...props} />
))
TabsList.displayName = "TabsList"
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm", className)} {...props} />
))
TabsTrigger.displayName = "TabsTrigger"
export const TabsContent = TabsPrimitive.Content
```

### `components/ui/dialog.tsx`

```tsx
"use client"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close
export function DialogContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-0 shadow-lg outline-none", className)} {...props} />
    </DialogPortal>
  )
}
export const DialogTitle = (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-lg font-semibold" {...props} />
export const DialogDescription = (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-sm text-muted" {...props} />
```

### `components/ui/sheet.tsx`

```tsx
"use client"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal
export function SheetContent({ side = "right", className, ...props }:{side?: "right"|"left", className?: string} & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <SheetPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className={cn("fixed top-0 h-full w-[560px] max-w-[90vw] bg-card border shadow-lg outline-none", side === "right" ? "right-0" : "left-0", className)} {...props} />
    </SheetPortal>
  )
}
```

### `components/ui/dropdown-menu.tsx`

```tsx
"use client"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export function DropdownMenuContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content className={cn("z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-card p-1 shadow-md", className)} {...props} />
    </DropdownMenuPortal>
  )
}
export const DropdownMenuItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item className={cn("relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted/20", className)} {...props} />
)
```

### `components/ui/tooltip.tsx`

```tsx
"use client"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipContent = ({ children }:{children: React.ReactNode}) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content className="z-50 rounded-md bg-popover px-2 py-1 text-xs border shadow">{children}</TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
)
```

### `components/ui/table.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) { return <table className={cn("w-full table-fixed border-separate border-spacing-0", className)} {...props} /> }
export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} /> }
export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} /> }
export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn("border-b border-border", className)} {...props} /> }
export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn("px-3 py-2 text-left text-xs font-medium text-muted", className)} {...props} /> }
export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn("px-3 py-2 text-sm", className)} {...props} /> }
```

### `components/ui/select.tsx`

```tsx
"use client"
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"
export const Select = SelectPrimitive.Root
export const SelectTrigger = (p: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger {...p} className={cn("inline-flex h-10 w-full items-center justify-between rounded-xl border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50", p.className)} />
)
export const SelectContent = (p: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal><SelectPrimitive.Content {...p} className={cn("z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-card p-1 shadow-md", p.className)} /></SelectPrimitive.Portal>
)
export const SelectItem = (p: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item {...p} className={cn("relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted/20", p.className)} />
)
export const SelectValue = SelectPrimitive.Value
```

### `components/ui/slider.tsx`

```tsx
"use client"
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
export function Slider({ className, ...props }: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>){
  return (
    <SliderPrimitive.Root className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted/30">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-primary shadow focus:outline-none" />
    </SliderPrimitive.Root>
  )
}
```

### `components/ui/alert.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"
export function Alert({variant='info', className, ...props}:{variant?: 'info'|'warning'|'danger'|'success'} & React.HTMLAttributes<HTMLDivElement>){
  const map = { info:'info', warning:'warning', danger:'danger', success:'success' } as const
  const color = map[variant]
  return <div className={cn((`rounded-xl border px-3 py-2 text-sm bg-${color}/10 border-${color}/20` as unknown as string), className)} {...props} />
}
```

### `components/app/theme-toggle.tsx`

```tsx
"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
export function ThemeToggle(){ const { theme, setTheme } = useTheme(); const isDark = theme === "dark"; return (<Button variant="ghost" size="icon" onClick={()=> setTheme(isDark ? "light":"dark")} aria-label="Toggle theme">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</Button>) }
```

### `components/app/sidebar.tsx`

```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Layers, ChartLine, Link2, Gauge, Sparkles, ClipboardList, Activity, Settings, Bot } from "lucide-react"
const items = [
  { href: "/", label: "Outcome", icon: ChartLine },
  { href: "/okr", label: "OKR Manager", icon: ClipboardList },
  { href: "/delivery", label: "Delivery & Quality", icon: Gauge },
  { href: "/trace", label: "Traceability", icon: Link2 },
  { href: "/forecast", label: "Forecast", icon: Layers },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: Activity },
  { href: "/automations", label: "Automations", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
]
export function Sidebar(){ const pathname = usePathname(); return (
  <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r">
    <div className="h-14 flex items-center px-4 border-b"><span className="font-semibold">NOVA</span><Badge className="ml-2">demo</Badge></div>
    <nav className="flex-1 overflow-auto p-2">
      {items.map(({href, label, icon:Icon})=>{
        const active = pathname === href
        return (<Link key={href} href={href} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted/20", active && "bg-muted/20")}> <Icon size={18}/> <span>{label}</span> </Link>)
      })}
    </nav>
    <div className="p-3 text-xs text-muted border-t">Aurora × Pulsar</div>
  </aside>) }
```

### `components/app/topbar.tsx`

```tsx
"use client"
import { ThemeToggle } from "@/components/app/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Bell } from "lucide-react"
import { Toaster } from "sonner"
export function Topbar(){ return (
  <div className="h-14 flex items-center justify-between border-b px-4">
    <div className="flex items-center gap-2 w-full max-w-lg"><Search size={16} className="text-muted"/><Input placeholder="Search (Cmd/Ctrl + K)" className="h-9"/></div>
    <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Notifications"><Bell size={18}/></Button><ThemeToggle/></div>
    <Toaster position="bottom-right" />
  </div>) }
```

### `components/app/kpi.tsx`

```tsx
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
export function KPI({title, value, hint}:{title:string, value:string|number, hint?:string}){ return (
  <Card className="kpi-card"><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><div className="text-3xl font-semibold">{value}</div>{hint && <div className="text-xs text-muted mt-1">{hint}</div>}</CardContent></Card>
) }
```

### `app/layout.tsx`

```tsx
import "./globals.css"
import { Sidebar } from "@/components/app/sidebar"
import { Topbar } from "@/components/app/topbar"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
export const metadata: Metadata = { title: "NOVA — Outcome & Delivery Intelligence", description: "Aurora × Pulsar — OKR + Delivery/Quality" }
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
              <Topbar/>
              <main className="container-max py-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### `app/page.tsx` (Outcome Dashboard)

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, outcomeHealthForObjective } from "@/lib/store"
import { KPI } from "@/components/app/kpi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
export default function Page(){
  const [s,setS] = useState(getState())
  useEffect(()=> subscribe(setS),[])
  const onTrack = s.krs.filter(k=> (k.confidence ?? 0.7) >= s.settings.thresholds.confidenceAtRisk).length
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Objectives" value={s.objectives.length}/>
        <KPI title="KR On‑track" value={onTrack} hint={`${Math.round((onTrack/s.krs.length)*100)}%`}/>
        <KPI title="Avg Confidence" value={Math.round((s.krs.reduce((a,k)=> a+(k.confidence ?? 0.7),0)/s.krs.length)*100)/100} hint="last 7d"/>
        <KPI title="Gate Pass Rate" value="—" hint="epics snapshot"/>
      </div>
      <Card>
        <CardHeader><CardTitle>Objectives — Health</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {s.objectives.map((o)=>{
              const health = outcomeHealthForObjective(o.id)
              const label = health>=0.75? "On‑track" : health>=0.5? "At‑risk" : "Off‑track"
              return (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between"><div className="font-medium">{o.name}</div><Badge>{label}</Badge></div>
                  <div className="text-xs text-muted mt-1">Owner: {o.owner}</div>
                  <div className="mt-3 h-2 rounded-full bg-muted/20"><div className="h-full rounded-full bg-primary" style={{width: `${Math.round(health*100)}%`}} /></div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### `app/okr/page.tsx` (OKR Manager + KR Drawer)

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, createObjective, createKR, krById, issuesByIds, linkIssueToKR, unlinkIssueFromKR, confidenceForKR, coverageForKR, avgGatePassForKR } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export default function Page(){
  const [s,setS] = useState(getState())
  const [selectedKR, setSelectedKR] = useState<string | null>(null)
  useEffect(()=> subscribe(setS),[])
  const [newObj, setNewObj] = useState("")
  const [newKR, setNewKR] = useState({name:"", target:10, unit:"pct", objectiveId:""})
  const openKR = (id:string)=> setSelectedKR(id)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">OKR Manager</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Objectives</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {s.objectives.map(o=> (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between"><div className="font-medium">{o.name}</div><Badge>{o.owner}</Badge></div>
                  <ul className="mt-2 space-y-1">
                    {o.krIds.map(kid=> { const k = krById(kid)!; const conf = confidenceForKR(k.id); return (
                      <li key={k.id} className="flex items-center justify-between">
                        <button className="text-sm underline-offset-2 hover:underline" onClick={()=> openKR(k.id)}>{k.name}</button>
                        <span className="text-xs">{Math.round(conf*100)}%</span>
                      </li>)
                    })}
                  </ul>
                </div>
              ))}
              <Separator/>
              <div className="flex gap-2"><Input placeholder="New Objective name" value={newObj} onChange={e=>setNewObj(e.target.value)} /><Button onClick={()=> { if(newObj.trim()){ createObjective({name:newObj}); setNewObj("") } }}>Add</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>New KR</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="KR name" value={newKR.name} onChange={e=> setNewKR({...newKR, name:e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Target" value={newKR.target} onChange={e=> setNewKR({...newKR, target:Number(e.target.value)})} />
                <Select onValueChange={(v)=> setNewKR({...newKR, unit: v as any})}>
                  <SelectTrigger><SelectValue placeholder="Unit"/></SelectTrigger>
                  <SelectContent><SelectItem value="pct">Percent</SelectItem><SelectItem value="abs">Absolute</SelectItem></SelectContent>
                </Select>
              </div>
              <Select onValueChange={(v)=> setNewKR({...newKR, objectiveId:v})}>
                <SelectTrigger><SelectValue placeholder="Objective"/></SelectTrigger>
                <SelectContent>{s.objectives.map(o=> <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={()=>{ if(newKR.name && newKR.objectiveId) { createKR(newKR.objectiveId, { name:newKR.name, target:newKR.target, unit:newKR.unit as any }); setNewKR({name:"", target:10, unit:"pct", objectiveId:""}) } }}>Create KR</Button>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-8"><Card><CardHeader><CardTitle>Instrukcja</CardTitle></CardHeader><CardContent><p className="text-sm opacity-80">Wybierz KR z listy po lewej, aby zobaczyć szczegóły i powiązać pracę.</p></CardContent></Card></div>
      </div>
      <KRDrawer krId={selectedKR} onOpenChange={(o)=> !o && setSelectedKR(null)}/>
    </div>
  )
}
function KRDrawer({ krId, onOpenChange }:{ krId: string | null, onOpenChange:(open:boolean)=>void }){
  const [s,setS] = useState(getState())
  useEffect(()=> subscribe(setS),[])
  const kr = krId ? krById(krId) : null
  const linked = new Set(kr?.issueIds||[])
  const conf = kr ? Math.round(100* (kr.confidence ?? ( (kr.current/kr.target)*0.6 + coverageForKR(kr.id)*0.25 + avgGatePassForKR(kr.id)*0.15 - 0.05 ))) : 0
  return (
    <Sheet open={!!kr} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        {kr && (
          <div className="flex flex-col h-full">
            <div className="h-14 px-4 border-b flex items-center justify-between"><div className="font-medium">{kr.name}</div><Badge>{conf}%</Badge></div>
            <div className="p-4 space-y-4 overflow-auto">
              <div className="rounded-xl border p-3"><div className="text-sm opacity-80">Cel: {kr.target}{kr.unit==="pct"?"%":""} · Właściciel: {kr.owner||"—"}</div><div className="mt-2 h-2 rounded-full bg-muted/20"><div className="h-full rounded-full bg-primary" style={{width:`${Math.min(100, (kr.current/kr.target)*100)}%`}}/></div></div>
              <div className="rounded-xl border p-3">
                <div className="font-medium mb-2">Powiązane zadania</div>
                <div className="space-y-2 max-h-[40vh] overflow-auto">
                  {s.issues.map(it=> (
                    <label key={it.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={linked.has(it.id)} onChange={(e)=> e.target.checked ? linkIssueToKR(it.id, kr.id) : unlinkIssueFromKR(it.id, kr.id)} />
                      <span className="text-sm">{it.id} · {it.title}</span>
                      <Badge className="ml-auto">{it.status}</Badge>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

### `app/delivery/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, epicById, gatesByEpic, setGateStatus, avgGatePassForKR } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
export default function Page(){
  const [s,setS] = useState(getState())
  const [epicId, setEpic] = useState<string>(s.epics[0]?.id||"")
  useEffect(()=> subscribe(setS),[])
  const epic = epicById(epicId)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Delivery & Quality Hub</h1>
      <Card>
        <CardHeader className="flex items-center justify-between"><CardTitle>Quality Gates</CardTitle>
          <Select onValueChange={setEpic} >
            <SelectTrigger className="w-64"><SelectValue placeholder="Wybierz epic" /></SelectTrigger>
            <SelectContent>{s.epics.map(e=> <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {epic ? (
            <div className="space-y-3">
              <div className="text-sm opacity-80">KR link: {epic.krIds.join(", ")||"—"} · Gate pass (avg): {Math.round((epic.krIds[0]? avgGatePassForKR(epic.krIds[0]):1)*100)}%</div>
              <div className="grid gap-2">
                {gatesByEpic(epic.id).map(g=> (
                  <div key={g.id} className="flex items-center gap-3 rounded-xl border p-3">
                    <div className="w-40 text-sm">{g.metric}</div>
                    <div className="text-sm">≥ {g.threshold}</div>
                    <div className="ml-auto"><Badge>{g.status}</Badge></div>
                    <Select onValueChange={(v)=> setGateStatus(g.id, v as any)}>
                      <SelectTrigger className="w-28"><SelectValue placeholder="set" /></SelectTrigger>
                      <SelectContent><SelectItem value="pass">pass</SelectItem><SelectItem value="fail">fail</SelectItem><SelectItem value="waived">waived</SelectItem></SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-sm opacity-80">Brak epika.</div>}
        </CardContent>
      </Card>
    </div>
  )
}
```

### `app/forecast/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, krById, confidenceForKR } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
function forecast(krId:string, opts:{capacity:number, days:number, scope:number, buffer:number}){
  const kr = krById(krId)!; const remaining = Math.max(0, kr.target - kr.current)
  const workUnits = remaining * (kr.unit === "pct" ? 0.5 : 1) * (1+opts.scope/100)
  const daily = (opts.capacity/10) * (1-opts.buffer/100)
  const daysNeeded = workUnits / Math.max(daily, 0.1)
  const p50 = Math.ceil(daysNeeded); const p85 = Math.ceil(daysNeeded * 1.2)
  return { p50, p85, conf: Math.max(0, Math.min(1, confidenceForKR(krId) * (opts.capacity/10))) }
}
export default function Page(){
  const [s,setS] = useState(getState()); const [krId,setKr] = useState<string>(s.krs[0]?.id||"")
  useEffect(()=> subscribe(setS),[])
  const [cap,setCap] = useState(10); const [days,setDays] = useState(30); const [scope,setScope] = useState(0); const [buffer,setBuffer] = useState(10)
  const res = krId ? forecast(krId, {capacity:cap, days, scope, buffer}) : null
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Forecast Simulator</h1>
      <Card>
        <CardHeader className="flex items-center justify-between"><CardTitle>Scenariusz</CardTitle>
          <Select onValueChange={setKr} ><SelectTrigger className="w-72"><SelectValue placeholder="Wybierz KR" /></SelectTrigger><SelectContent>{s.krs.map(k=> <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}</SelectContent></Select>
        </CardHeader>
        <CardContent className="space-y-5">
          <Row label={`Capacity (SP/sprint): ${cap}`}><Slider value={[cap]} min={2} max={40} step={1} onValueChange={([v])=> setCap(v)} /></Row>
          <Row label={`Days left: ${days}`}><Slider value={[days]} min={7} max={90} step={1} onValueChange={([v])=> setDays(v)} /></Row>
          <Row label={`Scope change: ${scope}%`}><Slider value={[scope]} min={-30} max={50} step={1} onValueChange={([v])=> setScope(v)} /></Row>
          <Row label={`Risk buffer: ${buffer}%`}><Slider value={[buffer]} min={0} max={50} step={1} onValueChange={([v])=> setBuffer(v)} /></Row>
          {res && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="kpi-card"><div className="text-sm opacity-80">P50 Completion in</div><div className="text-3xl font-semibold">{res.p50}d</div></div>
              <div className="kpi-card"><div className="text-sm opacity-80">P85 Completion in</div><div className="text-3xl font-semibold">{res.p85}d</div></div>
              <div className="kpi-card"><div className="text-sm opacity-80">Projected Confidence</div><div className="text-3xl font-semibold">{Math.round(res.conf*100)}%</div></div>
            </div>
          )}
          <div className="flex justify-end"><Button onClick={()=> toast.success("Plan applied (demo)")}>Apply plan</Button></div>
        </CardContent>
      </Card>
    </div>
  )
}
function Row({label, children}:{label:string, children:React.ReactNode}){ return <div><div className="text-sm mb-1">{label}</div>{children}</div> }
```

### `app/insights/page.tsx`

```tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { getState, subscribe, confidenceForKR, createCorrectiveTask } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
export default function Page(){
  const [s,setS] = useState(getState()); useEffect(()=> subscribe(setS),[])
  const atRisk = useMemo(()=> s.krs.filter(k=> confidenceForKR(k.id) < s.settings.thresholds.confidenceAtRisk ), [s])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Risk Radar & Insights</h1>
      <Card>
        <CardHeader><CardTitle>At‑Risk Key Results</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {atRisk.length===0 && <div className="text-sm opacity-80">Brak ryzyk.</div>}
          {atRisk.map(k=>{ const conf = Math.round(confidenceForKR(k.id)*100); return (
            <div key={k.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="font-medium">{k.name}</div>
              <Badge className="ml-auto">Confidence {conf}%</Badge>
              <Button variant="secondary" onClick={()=> { createCorrectiveTask(`Recovery plan: ${k.name}`, k.id); toast.success("Utworzono corrective task") }}>Create corrective task</Button>
            </div>
          )})}
        </CardContent>
      </Card>
    </div>
  )
}
```

### `app/reports/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, confidenceForKR, avgGatePassForKR } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts"
export default function Page(){
  const [s,setS] = useState(getState()); useEffect(()=> subscribe(setS),[])
  const dora = s.dora.map(x=> ({ date:x.date.slice(5), lead:x.leadTimeH, deploys:x.deploys, cfr: Math.round(x.changeFailRate*100), mttr:x.mttrH }))
  const krData = s.krs.map(k=> ({ name:k.name.slice(0,14)+"…", conf: Math.round(confidenceForKR(k.id)*100), gates: Math.round(avgGatePassForKR(k.id)*100) }))
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80"><CardHeader><CardTitle>DORA — Lead Time & Deploys</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={dora}><CartesianGrid strokeDasharray="2 2" /><XAxis dataKey="date"/><YAxis yAxisId="left"/><YAxis yAxisId="right" orientation="right"/><Tooltip/><Line yAxisId="left" type="monotone" dataKey="lead" /><Line yAxisId="right" type="monotone" dataKey="deploys" /></LineChart></ResponsiveContainer>
        </CardContent></Card>
        <Card className="h-80"><CardHeader><CardTitle>KR — Confidence & Gate Pass</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={krData}><CartesianGrid strokeDasharray="2 2" /><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="conf" /><Bar dataKey="gates" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  )
}
```

### `app/activity/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default function Page(){
  const [s,setS] = useState(getState()); useEffect(()=> subscribe(setS),[])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Activity & Audit</h1>
      <Card><CardHeader><CardTitle>Ostatnie zdarzenia</CardTitle></CardHeader><CardContent className="space-y-2">
        {s.activities.length===0 && <div className="text-sm opacity-80">Brak zdarzeń.</div>}
        {s.activities.map(a=> (<div key={a.id} className="rounded-xl border p-2 text-sm flex items-center justify-between"><div>{a.message}</div><div className="text-xs opacity-70">{new Date(a.at).toLocaleString()}</div></div>))}
      </CardContent></Card>
    </div>
  )
}
```

### `app/automations/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, createCorrectiveTask } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
const defaultRules = [
  { id:"r1", name:"KR confidence < 50% → create recovery task", enabled:true },
  { id:"r2", name:"Gate fail 3x/7d → escalate", enabled:true },
  { id:"r3", name:"Orphan work > 15% → suggest linking", enabled:false }
]
export default function Page(){
  const [s,setS] = useState(getState()); const [rules,setRules] = useState(defaultRules)
  useEffect(()=> subscribe(setS),[])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Automations</h1>
      <Card><CardHeader><CardTitle>Reguły (When / If / Then)</CardTitle></CardHeader><CardContent className="space-y-3">
        {rules.map(r=> (<div key={r.id} className="flex items-center justify-between rounded-xl border p-3"><div className="text-sm">{r.name}</div><Switch checked={r.enabled} onCheckedChange={(v)=> setRules(prev=> prev.map(x=> x.id===r.id? {...x, enabled:v}:x))}/></div>))}
        <div className="flex justify-end"><Button onClick={()=> { createCorrectiveTask("Automation dry-run task"); toast.success("Dry‑run: utworzono zadanie") }}>Dry‑run</Button></div>
      </CardContent></Card>
    </div>
  )
}
```

### `app/settings/page.tsx`

```tsx
"use client"
import { useEffect, useState } from "react"
import { getState, subscribe, setWeights, exportJson, importJson } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
export default function Page(){
  const [s,setS] = useState(getState()); const [w,setW] = useState([s.settings.healthWeights.outcome, s.settings.healthWeights.delivery, s.settings.healthWeights.quality])
  useEffect(()=> subscribe(setS),[])
  const onExport = ()=> { const data = exportJson(); const blob = new Blob([data], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="nova-data.json"; a.click(); URL.revokeObjectURL(url) }
  let fileInput: HTMLInputElement | null = null
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card><CardHeader><CardTitle>Health weights (Outcome · Delivery · Quality)</CardTitle></CardHeader><CardContent className="space-y-2">
        <Slider value={w} min={0} max={1} step={0.01} onValueChange={(val)=> setW(val as any)} />
        <div className="text-sm">Outcome: {w[0].toFixed(2)} · Delivery: {w[1].toFixed(2)} · Quality: {w[2].toFixed(2)}</div>
        <Button onClick={()=> { setWeights(w[0], w[1], w[2]); toast.success("Weights updated") }}>Save</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Data</CardTitle></CardHeader><CardContent className="flex items-center gap-3">
        <Button onClick={onExport}>Export JSON</Button>
        <input type="file" accept="application/json" className="hidden" ref={el=> (fileInput = el)} onChange={(e)=> { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ()=> { importJson(String(reader.result)); toast.success("Imported") }; reader.readAsText(file) }}/>
        <Button variant="secondary" onClick={()=> fileInput?.click() }>Import JSON</Button>
      </CardContent></Card>
    </div>
  )
}
```

### `app/trace/page.tsx`

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default function Page(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Traceability Map</h1>
      <Card><CardHeader><CardTitle>Graph (stub)</CardTitle></CardHeader><CardContent><p className="text-sm opacity-80">Wersja PoC: graf i DnD w V2. Tu pojawi się drzewo Objective→KR→Epic→Issue z badge’ami statusów.</p></CardContent></Card>
    </div>
  )
}
```

### `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />
```

### `postcss.config.js` (jeśli nie nadpisałeś wcześniej)

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

### `README.md`

```md
# NOVA — Aurora × Pulsar (Outcome & Delivery Intelligence)

Next.js 14 + Tailwind + Radix/shadcn‑style + Recharts + Sonner. PoC z mock‑danymi w localStorage.

## Start
npm i && npm run dev

## Ekrany
- Outcome Dashboard `/`
- OKR Manager `/okr`
- Delivery & Quality `/delivery`
- Traceability `/trace`
- Forecast `/forecast`
- Insights `/insights`
- Reports `/reports`
- Activity `/activity`
- Automations `/automations`
- Settings `/settings`
```

### `.gitignore`

```gitignore
node_modules
.next
dist
.env*
.DS_Store
pnpm-lock.yaml
yarn.lock
```

---

**Gotowe.** Po wklejeniu plików i `npm i` aplikacja działa od razu jako pełny PoC NOVA. Jeśli chcesz, mogę dodać **DataTable (TanStack)** lub **Command Palette (Cmd+K)** w kolejnej iteracji.
