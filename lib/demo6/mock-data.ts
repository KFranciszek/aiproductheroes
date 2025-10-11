import type {
  ChatThread,
  Citation,
  Finding,
  Release,
  Project,
  SyncStatus,
} from "./types";

export const sampleCitations: Citation[] = [
  {
    source: "Checkout_v2.pdf p.5",
    fragment: "3DS wymagany dla kwot > 100 PLN, opcjonalny poniżej",
    confidence: 0.95,
  },
  {
    source: "payments.yaml threeDS",
    fragment: "threeDS: { default: true, threshold: 100 }",
    confidence: 0.92,
  },
];

export const mockData = {
  currentProject: {
    id: "proj-1",
    name: "ACME Shop",
    description: "E-commerce platform with payment integration",
  } as Project,

  chatThreads: [
    {
      id: "t-1",
      title: "Wymagania 3DS",
      preview: "3DS obowiązkowy dla…",
      messages: [
        {
          id: "msg-1",
          role: "ai" as const,
          content:
            "W skrócie: 3DS wymagany dla kwot > 100 PLN, opcjonalny poniżej. Zgodnie z dokumentacją Checkout_v2.pdf i konfiguracją w payments.yaml.",
          citations: sampleCitations,
          timestamp: "2025-10-10T10:00:00Z",
        },
      ],
      context: {
        projectId: "proj-1",
        documents: ["Checkout_v2.pdf", "payments.yaml"],
      },
    },
    {
      id: "t-2",
      title: "Limit transakcji",
      preview: "PDF mówi 1000, API 1500…",
      messages: [
        {
          id: "msg-2",
          role: "user" as const,
          content: "Jaki jest limit transakcji?",
          timestamp: "2025-10-10T11:00:00Z",
        },
        {
          id: "msg-3",
          role: "ai" as const,
          content:
            "Znalazłem rozbieżność: Checkout_v2.pdf określa limit na 1000 PLN, ale payments.yaml ma 1500 PLN. Wymaga wyjaśnienia.",
          citations: [
            {
              source: "Checkout_v2.pdf p.12",
              fragment: "Maksymalny limit transakcji: 1000 PLN",
              confidence: 0.98,
            },
            {
              source: "payments.yaml limits",
              fragment: "maxAmount: 1500",
              confidence: 0.96,
            },
          ],
          timestamp: "2025-10-10T11:01:00Z",
        },
      ],
      context: {
        projectId: "proj-1",
        documents: ["Checkout_v2.pdf", "payments.yaml"],
      },
    },
  ] as ChatThread[],

  findings: [
    {
      id: "F-001",
      type: "Consistency" as const,
      severity: "high" as const,
      summary: "Rozbieżny limit transakcji (1000 vs 1500)",
      description:
        "Dokument Checkout_v2.pdf określa maksymalny limit transakcji na 1000 PLN, podczas gdy konfiguracja API w payments.yaml ma wartość 1500 PLN. To może prowadzić do błędów w produkcji.",
      sources: ["Checkout_v2.pdf p.12", "payments.yaml"],
      affectedArtifacts: [
        { type: "document", id: "doc-1", title: "Checkout_v2.pdf" },
        { type: "document", id: "doc-2", title: "payments.yaml" },
      ],
      suggestedFix:
        "Uzgodnić z zespołem biznesowym właściwy limit i zaktualizować oba dokumenty",
    },
    {
      id: "F-002",
      type: "Completeness" as const,
      severity: "medium" as const,
      summary: "Brak AC w SZ-1235",
      description:
        "User story SZ-1235 nie zawiera kryteriów akceptacji, co utrudnia testowanie i weryfikację implementacji.",
      sources: ["PM:SZ-1235"],
      affectedArtifacts: [
        { type: "issue", id: "SZ-1235", title: "Implementacja płatności 3DS" },
      ],
      suggestedFix: "Dodać kryteria akceptacji w formacie EARS lub Gherkin",
    },
    {
      id: "F-003",
      type: "Clarity" as const,
      severity: "low" as const,
      summary: "Słowo 'szybko' bez metryki P95",
      description:
        "Wymaganie niefunkcjonalne używa terminu 'szybko' bez określenia konkretnej metryki wydajności (np. P95 < 300ms).",
      sources: ["Checkout_v2.pdf p.8"],
      affectedArtifacts: [
        { type: "document", id: "doc-1", title: "Checkout_v2.pdf" },
      ],
      suggestedFix: "Zastąpić 'szybko' konkretną metryką: P95 < 300ms",
    },
  ] as Finding[],

  releases: [
    {
      id: "R-101",
      environment: "staging" as const,
      deployedAt: "2025-10-04T18:30:00Z",
      issues: ["SZ-1250"],
      commits: [
        {
          sha: "abc123",
          message: "feat: add 3DS validation",
          author: "Jan Kowalski",
          timestamp: "2025-10-04T16:00:00Z",
        },
        {
          sha: "def456",
          message: "fix: handle edge cases",
          author: "Anna Nowak",
          timestamp: "2025-10-04T17:00:00Z",
        },
        {
          sha: "ghi789",
          message: "test: add integration tests",
          author: "Piotr Wiśniewski",
          timestamp: "2025-10-04T18:00:00Z",
        },
      ],
      status: "Deployed" as const,
    },
    {
      id: "R-102",
      environment: "staging" as const,
      deployedAt: "2025-10-10T19:00:00Z",
      issues: ["SZ-1234", "SZ-1235"],
      commits: [
        {
          sha: "jkl012",
          message: "feat: implement payment limits",
          author: "Jan Kowalski",
          timestamp: "2025-10-10T14:00:00Z",
        },
        {
          sha: "mno345",
          message: "feat: add 3DS flow",
          author: "Anna Nowak",
          timestamp: "2025-10-10T15:00:00Z",
        },
        {
          sha: "pqr678",
          message: "fix: validation errors",
          author: "Piotr Wiśniewski",
          timestamp: "2025-10-10T16:00:00Z",
        },
        {
          sha: "stu901",
          message: "docs: update API documentation",
          author: "Maria Kowalczyk",
          timestamp: "2025-10-10T17:00:00Z",
        },
        {
          sha: "vwx234",
          message: "test: e2e payment tests",
          author: "Tomasz Lewandowski",
          timestamp: "2025-10-10T18:00:00Z",
        },
      ],
      status: "Ready" as const,
    },
  ] as Release[],

  syncStatus: {
    lastSync: new Date().toISOString(),
    status: "synced" as const,
    sources: {
      syzio: true,
      devMon: true,
      documents: true,
    },
  } as SyncStatus,

  sampleCitations,
};
