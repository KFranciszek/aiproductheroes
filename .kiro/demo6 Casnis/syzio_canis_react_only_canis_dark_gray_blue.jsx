import React, { useEffect, useState, useContext, createContext } from "react";
import { Bot, Database, Search, Settings, Menu, Moon, Sun, Send, Sparkles, SlidersHorizontal, ArrowRight, Download, CheckCircle2, GitPullRequest, Palette } from "lucide-react";

// shadcn/ui components (API‑kompatybilne)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/***************************************
 * Motywy: light | dark | dark‑gray‑blue (custom)
 **************************************/
function ThemeStyles(){
  return (
    <style>{`
    /* Wersja ciemna "dark gray blue" — nadpisuje zmienne shadcn */
    .theme-dark-blue {
      /* Paleta HSL używana przez shadcn: tła/teksty */
      --background: 220 18% 10%;           /* ciemny niebiesko-szary */
      --foreground: 210 25% 96%;           
      --card: 220 18% 12%;
      --card-foreground: 210 25% 96%;
      --popover: 220 18% 12%;
      --popover-foreground: 210 25% 96%;
      --primary: 217 90% 60%;              /* niebieski akcent */
      --primary-foreground: 210 40% 98%;
      --secondary: 220 16% 20%;
      --secondary-foreground: 210 25% 96%;
      --muted: 220 16% 18%;
      --muted-foreground: 215 20% 70%;
      --accent: 200 60% 40%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 84% 60%;
      --destructive-foreground: 210 40% 98%;
      --border: 220 16% 22%;
      --input: 220 16% 22%;
      --ring: 217 90% 60%;
      --radius: 0.75rem;
    }
    /* Subtelne wygładzenie elementów w trybie dark‑blue */
    .theme-dark-blue .shadow-sm { box-shadow: 0 1px 2px hsl(220 40% 2% / 0.5) }
    .theme-dark-blue .shadow-md { box-shadow: 0 4px 12px hsl(220 40% 2% / 0.45) }
    .theme-dark-blue .border { border-color: hsl(var(--border)) }
    .theme-dark-blue .bg-muted\/30 { background-color: hsl(var(--muted) / 0.3) }
    `}</style>
  )
}

/***************************************
 * Minimalny system Toast (PoC)
 **************************************/
const ToastCtx = createContext<{ toast: (opts:{title?:string, description?:string}) => void }|null>(null)
function TinyToastProvider({children}:{children:React.ReactNode}){
  const [toasts, setToasts] = useState<{id:string,title?:string,description?:string}[]>([])
  const toast = ({title, description}:{title?:string, description?:string}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t)=> [...t, { id, title, description }])
    setTimeout(()=> setToasts((t)=> t.filter(x=> x.id!==id)), 4000)
  }
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[320px] flex-col gap-2">
        {toasts.map(t=> (
          <div key={t.id} className="rounded-xl border bg-card p-3 shadow-md">
            {t.title && <div className="text-sm font-medium">{t.title}</div>}
            {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
function useToast(){
  const ctx = useContext(ToastCtx)
  return ctx ?? { toast: ({title, description}:{title?:string,description?:string}) => console.log("toast:", title, description) }
}

/***************************************
 * Theme Switcher: light → dark → dark‑gray‑blue
 **************************************/
function ThemeSwitcher(){
  type Mode = "light"|"dark"|"darkBlue"
  const [mode, setMode] = useState<Mode>("light")
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'theme-dark-blue')
    if (mode === 'dark') root.classList.add('dark')
    if (mode === 'darkBlue') { root.classList.add('dark', 'theme-dark-blue') }
  }, [mode])

  const label = mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'Dark Gray Blue'
  const cycle = () => setMode(m => m === 'light' ? 'dark' : m === 'dark' ? 'darkBlue' : 'light')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={cycle} aria-label="Przełącz motyw" className="gap-2">
            <Palette className="h-4 w-4"/>
            <span className="hidden md:inline text-xs">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tryb: {label} (kliknij, aby zmienić)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// -------------- MOCK DATA --------------
const canisThreads = [
  { id: "t-1", title: "Wymagania 3DS", preview: "3DS obowiązkowy dla…" },
  { id: "t-2", title: "Limit transakcji", preview: "PDF mówi 1000, API 1500…" },
]
const findings = [
  { id: "F-001", type: "Consistency", severity: "high", summary: "Rozbieżny limit transakcji (1000 vs 1500)", source: "Checkout_v2.pdf / payments.yaml" },
  { id: "F-002", type: "Completeness", severity: "medium", summary: "Brak AC w SZ-1235", source: "PM:SZ-1235" },
  { id: "F-003", type: "Clarity", severity: "low", summary: "Słowo 'szybko' bez metryki P95", source: "Checkout_v2.pdf" },
]
const mockReleases = [
  { id: "R-101", env: "staging", when: "2025-10-04 18:30", issues: ["SZ-1250"], commits: 3, status: "Deployed" },
  { id: "R-102", env: "staging", when: "2025-10-10 19:00", issues: ["SZ-1234","SZ-1235"], commits: 5, status: "Ready" },
]
const acCoverage = [
  { key: "SZ-1234", ac: 3, covered: 2 },
  { key: "SZ-1235", ac: 0, covered: 0 },
]

function SeverityBadge({ sev }: { sev: string }) {
  const map: Record<string, string> = { low: "secondary", medium: "default", high: "destructive" }
  return <Badge variant={map[sev] as any}>{sev}</Badge>
}

// -------------- APP (TYLKO CANIS) --------------
export default function App() {
  const [tab, setTab] = useState("chat")
  const [openCmd, setOpenCmd] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCmd(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <TooltipProvider>
      <TinyToastProvider>
        <ThemeStyles/>
        <div className="min-h-screen bg-background text-foreground">
          <Topbar onOpenCmd={() => setOpenCmd(true)} />
          <main className="mx-auto max-w-[1200px] p-4 md:p-6">
            <CanisTabs tab={tab} setTab={setTab} />
          </main>
          <CommandCenter open={openCmd} setOpen={setOpenCmd} setTab={setTab} />
        </div>
      </TinyToastProvider>
    </TooltipProvider>
  )
}

function Topbar({ onOpenCmd }:{ onOpenCmd: () => void }){
  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-3 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5"/></Button>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5"/>
          <span className="font-semibold">Syzio — Canis</span>
          <Separator orientation="vertical" className="mx-2 h-6"/>
          <Badge variant="outline">ACME / SHOP</Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-64">
            <Input placeholder="Szukaj / ⌘K" className="pl-8" onFocus={onOpenCmd}/>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          </div>
          <ThemeSwitcher/>
          <Button variant="outline" size="icon" aria-label="Ustawienia"><Settings className="h-4 w-4"/></Button>
        </div>
      </div>
    </div>
  )
}

// ----------------- TABS -----------------
function CanisTabs({ tab, setTab }:{ tab:string, setTab:(v:string)=>void }){
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="stories">Stories</TabsTrigger>
        <TabsTrigger value="testdata">Test Data</TabsTrigger>
        <TabsTrigger value="verify">Verify</TabsTrigger>
        <TabsTrigger value="release">Release Q&A</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="chat"><CanisChat/></TabsContent>
      <TabsContent value="stories"><CanisStories/></TabsContent>
      <TabsContent value="testdata"><CanisTestData/></TabsContent>
      <TabsContent value="verify"><CanisVerify/></TabsContent>
      <TabsContent value="release"><CanisReleaseQA/></TabsContent>
      <TabsContent value="settings"><CanisSettings/></TabsContent>
    </Tabs>
  )}

// ----------------- CHAT -----------------
function CanisChat(){
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [thread, setThread] = useState("t-1")
  const [msgs, setMsgs] = useState<{role:"user"|"ai", text:string, cites?:string[]}[]>([
    { role: "ai", text: "W skrócie: 3DS wymagany dla kwot > 100 PLN, opcjonalny poniżej.", cites:["Checkout_v2.pdf p.5","payments.yaml threeDS"] },
  ])
  const add = () => {
    if (!message.trim()) return
    setMsgs((m)=> [...m, { role:"user", text: message }])
    setTimeout(()=> setMsgs((m)=> [...m, { role:"ai", text: "Dodaję AC do scenariuszy negatywnych. Chcesz wysłać do PM?", cites:["doc:…","api:…"] }]), 400)
    setMessage("")
  }
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <Card className="md:col-span-3 rounded-2xl">
        <CardHeader>
          <CardTitle>Wątki</CardTitle>
          <CardDescription>ACME / SHOP</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[360px] pr-2">
            {canisThreads.map(t=> (
              <Button key={t.id} variant={thread===t.id?"secondary":"ghost"} className="w-full justify-start mb-1" onClick={()=>setThread(t.id)}>
                <Sparkles className="mr-2 h-4 w-4"/>{t.title}
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="md:col-span-6 rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Chat Canis</CardTitle>
            <div className="flex gap-2"><Badge variant="outline">Docs</Badge><Badge variant="outline">API</Badge><Badge variant="outline">PM</Badge></div>
          </div>
          <CardDescription>RAG nad dokumentacją i backlogiem</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-3">
              {msgs.map((m, i)=> (
                <div key={i} className={`max-w-[90%] ${m.role==='ai' ? 'bg-muted/40' : 'bg-primary/10 ml-auto'} rounded-xl p-3`}> 
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                  {m.cites && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.cites.map((c,ci)=> <Badge key={ci} variant="outline" className="text-xs">{c}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-3 flex items-center gap-2">
            <Textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Zadaj pytanie lub wklej fragment dokumentu…" className="min-h-[44px]"/>
            <div className="flex flex-col gap-2">
              <Button onClick={add}><Send className="mr-2 h-4 w-4"/>Wyślij</Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4"/>Akcje</Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" onClick={()=> toast({ title:"Generate Story", description:"Wygenerowano szkic Story + AC"})}>Generate Story</Button>
                    <Button variant="ghost" onClick={()=> toast({ title:"Verify", description:"Uruchomiono weryfikator"})}>Verify Requirements</Button>
                    <Button variant="ghost" onClick={()=> toast({ title:"Test Data", description:"Przygotowano preset YAML"})}>Generate Test Data</Button>
                    <Button variant="ghost" onClick={()=> toast({ title:"Release Q&A", description:"Pytanie o R-102"})}>Ask about Release</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-3 rounded-2xl">
        <CardHeader>
          <CardTitle>Źródła</CardTitle>
          <CardDescription>Najtrafniejsze fragmenty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border p-3"><b>Checkout_v2.pdf</b> · „3DS wymagany powyżej 100 PLN…”</div>
            <div className="rounded-xl border p-3"><b>payments.yaml</b> · `threeDS: default: true`</div>
            <div className="rounded-xl border p-3"><b>Pricing.md</b> · „Limit 1500 PLN”</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- STORIES -----------------
function CanisStories(){
  const { toast } = useToast()
  const [variants, setVariants] = useState<any[]>([])
  const [persona, setPersona] = useState("Buyer")
  const [goal, setGoal] = useState("Zapłacić kartą z autoryzacją 3DS")
  const generate = () => {
    setVariants([
      { id:"v1", title:"Jako kupujący chcę zapłacić kartą…", ac:["Given karta VISA i 3DS on…","Given 3DS challenge fail…"], est:"5sp" },
      { id:"v2", title:"Jako użytkownik chcę przejść 3DS bez zbędnych kroków…", ac:["Given kwota<=100 PLN…","Given amount>limit…"], est:"3sp" }
    ])
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl md:col-span-1">
        <CardHeader>
          <CardTitle>Generator Story</CardTitle>
          <CardDescription>INVEST + Gherkin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={persona} onChange={(e)=>setPersona(e.target.value)} placeholder="Persona"/>
          <Textarea value={goal} onChange={(e)=>setGoal(e.target.value)} placeholder="Cel"/>
          <Select>
            <SelectTrigger><SelectValue placeholder="Źródła (Doc/API)"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="doc">Checkout_v2.pdf</SelectItem>
              <SelectItem value="api">payments.yaml</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Switch id="nfr"/><label htmlFor="nfr" className="text-sm">Dodaj NFR (P95, WCAG)</label></div>
            <Button onClick={generate}><Sparkles className="mr-2 h-4 w-4"/>Generate (2)</Button>
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2 grid gap-4">
        {variants.length===0 && (
          <Alert>
            <AlertTitle>Brak wygenerowanych wariantów</AlertTitle>
            <AlertDescription>Uzupełnij formularz i kliknij <b>Generate</b>.</AlertDescription>
          </Alert>
        )}
        {variants.map(v=> (
          <Card key={v.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle>{v.title}</CardTitle>
              <CardDescription>Estymata: {v.est} · DoD: AC pokryte testami e2e</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-sm font-medium">Acceptance Criteria</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {v.ac.map((a:string, i:number)=> <li key={i}><code>{a}</code></li>)}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button variant="outline">Refine</Button>
                <Button variant="secondary" onClick={()=> toast({ title:"Wyeksportowano do PM", description:"Utworzono SZ-2001" })}><ArrowRight className="mr-2 h-4 w-4"/>Export to PM</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ----------------- TEST DATA -----------------
function CanisTestData(){
  const { toast } = useToast()
  const [schema, setSchema] = useState("payments.yaml#/Card")
  const [size, setSize] = useState(500)
  const sample = [
    { pan: "4539960452561234", expiry:"11/27", holder:"Jan Kowalski", brand:"VISA", amount:99.99, currency:"PLN", threeDS:true },
    { pan: "5256789012345678", expiry:"03/26", holder:"Anna Nowak", brand:"MASTERCARD", amount:1200.00, currency:"PLN", threeDS:true }
  ]
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <Card className="md:col-span-4 rounded-2xl">
        <CardHeader>
          <CardTitle>Generator danych testowych</CardTitle>
          <CardDescription>OpenAPI / JSON Schema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select onValueChange={(v)=> setSchema(v)} defaultValue={schema}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="payments.yaml#/Card">payments.yaml#/Card</SelectItem>
              <SelectItem value="payments.yaml#/ChargeRequest">payments.yaml#/ChargeRequest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="number" value={size} onChange={(e)=> setSize(Number(e.target.value))}/>
            <span className="text-sm text-muted-foreground">rekordów</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4"/>Reguły (YAML)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reguły generatora</DialogTitle>
                <DialogDescription>Walidacja i generatory domenowe</DialogDescription>
              </DialogHeader>
              <Textarea className="min-h-[220px] font-mono text-xs" defaultValue={`schema: ${schema}\nrules:\n  pan: luhn(cardBrand:VISA)\n  expiry: futureDate(months<=36)\n  amount: decimal(min:1,max:9999,scale:2)\n  currency: enum[PLN,EUR,USD]\nsize: ${size}\nformat: csv`}/>
              <DialogFooter>
                <Button>Zapisz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex gap-2">
            <Button onClick={()=> toast({ title:"Wygenerowano dane", description:`${size} rekordów CSV/SQL` })}><Database className="mr-2 h-4 w-4"/>Generate</Button>
            <Button variant="secondary"><Download className="mr-2 h-4 w-4"/>Download</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-8 rounded-2xl">
        <CardHeader>
          <CardTitle>Podgląd</CardTitle>
          <CardDescription>pierwsze 2 z {size} rekordów</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(sample[0]).map(h=> <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sample.map((row,i)=> (
                <TableRow key={i}>
                  {Object.values(row).map((v,j)=> <TableCell key={j} className="font-mono text-xs">{String(v)}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- VERIFY -----------------
function CanisVerify(){
  const { toast } = useToast()
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader>
          <CardTitle>Weryfikator wymagań</CardTitle>
          <CardDescription>Braki, niespójności i niejednoznaczności</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Typ</TableHead>
                <TableHead>Poziom</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Źródło</TableHead>
                <TableHead className="text-right">Akcja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {findings.map(f => (
                <TableRow key={f.id}>
                  <TableCell>{f.type}</TableCell>
                  <TableCell><SeverityBadge sev={f.severity}/></TableCell>
                  <TableCell className="max-w-[360px]">{f.summary}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.source}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={()=> toast({ title:"Utworzono zadanie w PM", description:`Fix for ${f.id}`})}>Create Task</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>TraceMatrix</CardTitle>
          <CardDescription>Powiązania Doc ↔ Story ↔ Release</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border p-3 text-sm">
            <div>Checkout_v2.pdf → SZ-1234 → R-102</div>
            <div>Pricing.md → SZ-1234 → R-102</div>
            <div>payments.yaml → SZ-1235 → R-102</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- RELEASE Q&A -----------------
function CanisReleaseQA(){
  const [rel, setRel] = useState("R-102")
  const relData = mockReleases.find(r=> r.id===rel)!
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Wybierz release</CardTitle>
          <CardDescription>Odpowiemy na najczęstsze pytania</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={rel} onValueChange={setRel}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              {mockReleases.map(r=> <SelectItem key={r.id} value={r.id}>{r.id} · {r.env}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {["Co było w paczce?","Czy gate spełnione?","Co się zmieniło vs poprzedni?"].map((q,i)=> <Badge key={i} variant="outline">{q}</Badge>)}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader>
          <CardTitle>Odpowiedź Canis</CardTitle>
          <CardDescription>Źródła: Helix + Atlas + Canis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border p-3 text-sm bg-muted/30">
            Release <b>{relData.id}</b> ({relData.env}, {relData.when}) zawiera issues: {relData.issues.join(", ")}. 
            Pokrycie AC: {acCoverage.filter(x=> relData.issues.includes(x.key)).map(x=> `${x.key} ${x.covered}/${x.ac}`).join(", ") || 'brak danych'}.
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Open in Helix</Button>
            <Button variant="outline">Open in Atlas</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- SETTINGS -----------------
function CanisSettings(){
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Connectors</CardTitle>
          <CardDescription>Źródła danych</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Syzio Atlas</div>
            <Switch defaultChecked/>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Syzio Helix</div>
            <Switch defaultChecked/>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Repo dokumentów (PDF/MD)</div>
            <Switch defaultChecked/>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Reguły & Słownik</CardTitle>
          <CardDescription>NFR / terminologia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>P95 <span className="text-muted-foreground">&lt; 300ms</span></div>
            <Switch defaultChecked/>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>WCAG AA</div>
            <Switch defaultChecked/>
          </div>
          <div className="rounded-xl border p-3">Słownik domeny: payments, card, charge, 3DS…</div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----------------- COMMAND PALETTE -----------------
function CommandCenter({ open, setOpen, setTab }:{ open:boolean, setOpen:(b:boolean)=>void, setTab:(m:any)=>void }){
  const { toast } = useToast()
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Szukaj lub wpisz komendę…" />
        <CommandList>
          <CommandEmpty>Brak wyników.</CommandEmpty>
          <CommandGroup heading="Nawigacja">
            <CommandItem onSelect={()=> { setTab("chat"); setOpen(false) }}>Chat</CommandItem>
            <CommandItem onSelect={()=> { setTab("stories"); setOpen(false) }}>Stories</CommandItem>
            <CommandItem onSelect={()=> { setTab("testdata"); setOpen(false) }}>Test Data</CommandItem>
            <CommandItem onSelect={()=> { setTab("verify"); setOpen(false) }}>Verify</CommandItem>
            <CommandItem onSelect={()=> { setTab("release"); setOpen(false) }}>Release Q&A</CommandItem>
            <CommandItem onSelect={()=> { setTab("settings"); setOpen(false) }}>Settings</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Akcje Canis">
            <CommandItem onSelect={()=> toast({ title:"Generate Story", description:"Wygenerowano szkic Story + AC"})}><Sparkles className="mr-2 h-4 w-4"/>Generate Story</CommandItem>
            <CommandItem onSelect={()=> toast({ title:"Verify", description:"Weryfikacja wymagań uruchomiona"})}><CheckCircle2 className="mr-2 h-4 w-4"/>Verify Requirements</CommandItem>
            <CommandItem onSelect={()=> toast({ title:"Test Data", description:"500 rekordów CSV gotowe"})}><Database className="mr-2 h-4 w-4"/>Generate Test Data</CommandItem>
            <CommandItem onSelect={()=> toast({ title:"Release Q&A", description:"Co w R-102?"})}><GitPullRequest className="mr-2 h-4 w-4"/>Ask About Release</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
