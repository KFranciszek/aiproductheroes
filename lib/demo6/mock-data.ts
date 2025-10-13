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
    {
      id: "t-3",
      title: "Walidacja karty",
      preview: "Algorytm Luhn dla PAN...",
      messages: [
        {
          id: "msg-4",
          role: "user" as const,
          content: "Jak walidować numer karty kredytowej?",
          timestamp: "2025-10-11T09:00:00Z",
        },
        {
          id: "msg-5",
          role: "ai" as const,
          content:
            "Używamy algorytmu Luhn do walidacji PAN. Dodatkowo sprawdzamy BIN (pierwsze 6 cyfr) dla identyfikacji wydawcy karty.",
          citations: [
            {
              source: "payments.yaml validation",
              fragment: "pan: { validator: 'luhn', binCheck: true }",
              confidence: 0.94,
            },
          ],
          timestamp: "2025-10-11T09:01:00Z",
        },
      ],
      context: {
        projectId: "proj-1",
        documents: ["payments.yaml", "CardValidation.md"],
      },
    },
    {
      id: "t-4",
      title: "Obsługa błędów płatności",
      preview: "Retry policy i fallback...",
      messages: [
        {
          id: "msg-6",
          role: "user" as const,
          content: "Co się dzieje gdy płatność się nie powiedzie?",
          timestamp: "2025-10-11T10:00:00Z",
        },
        {
          id: "msg-7",
          role: "ai" as const,
          content:
            "System implementuje retry policy z exponential backoff (3 próby). Po wyczerpaniu prób, transakcja jest oznaczana jako 'failed' i użytkownik otrzymuje notyfikację.",
          citations: [
            {
              source: "ErrorHandling.md",
              fragment: "Retry: 3 attempts, backoff: 2^n seconds",
              confidence: 0.97,
            },
          ],
          timestamp: "2025-10-11T10:01:00Z",
        },
      ],
      context: {
        projectId: "proj-1",
        documents: ["ErrorHandling.md", "payments.yaml"],
      },
    },
    {
      id: "t-5",
      title: "Integracja z PSP",
      preview: "Webhook handling...",
      messages: [
        {
          id: "msg-8",
          role: "user" as const,
          content: "Jak obsługujemy webhooks od payment service provider?",
          timestamp: "2025-10-11T11:00:00Z",
        },
        {
          id: "msg-9",
          role: "ai" as const,
          content:
            "Webhooks są weryfikowane przez HMAC signature, następnie przetwarzane asynchronicznie przez queue worker. Status transakcji jest aktualizowany w bazie danych.",
          citations: [
            {
              source: "PSP_Integration.pdf p.15",
              fragment: "Webhook verification: HMAC-SHA256 with secret key",
              confidence: 0.96,
            },
            {
              source: "architecture.yaml webhooks",
              fragment: "queue: rabbitmq, worker: payment-webhook-processor",
              confidence: 0.93,
            },
          ],
          timestamp: "2025-10-11T11:02:00Z",
        },
      ],
      context: {
        projectId: "proj-1",
        documents: ["PSP_Integration.pdf", "architecture.yaml"],
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
    {
      id: "F-004",
      type: "Testability" as const,
      severity: "medium" as const,
      summary: "Brak testów dla edge case: karta wygasła",
      description:
        "Scenariusz płatności kartą wygasłą nie jest pokryty testami automatycznymi.",
      sources: ["TestPlan.md", "payments.spec.ts"],
      affectedArtifacts: [
        { type: "test", id: "test-1", title: "payment.spec.ts" },
      ],
      suggestedFix: "Dodać test case dla karty z datą ważności w przeszłości",
    },
    {
      id: "F-005",
      type: "Consistency" as const,
      severity: "high" as const,
      summary: "Różne formaty dat w API i dokumentacji",
      description:
        "API używa ISO 8601, ale dokumentacja pokazuje format DD/MM/YYYY",
      sources: ["API_Spec.yaml", "UserGuide.pdf"],
      affectedArtifacts: [
        { type: "document", id: "doc-3", title: "API_Spec.yaml" },
        { type: "document", id: "doc-4", title: "UserGuide.pdf" },
      ],
      suggestedFix: "Ujednolicić format dat na ISO 8601 we wszystkich dokumentach",
    },
    {
      id: "F-006",
      type: "Completeness" as const,
      severity: "low" as const,
      summary: "Brak dokumentacji dla webhook retry logic",
      description:
        "Mechanizm ponownych prób dla webhooków nie jest udokumentowany w API spec.",
      sources: ["API_Spec.yaml"],
      affectedArtifacts: [
        { type: "document", id: "doc-3", title: "API_Spec.yaml" },
      ],
      suggestedFix: "Dodać sekcję opisującą retry policy dla webhooków",
    },
    {
      id: "F-007",
      type: "Clarity" as const,
      severity: "medium" as const,
      summary: "Niejednoznaczny termin 'merchant ID'",
      description:
        "Różne dokumenty używają 'merchant ID', 'merchantId' i 'merchant_id' zamiennie.",
      sources: ["API_Spec.yaml", "Checkout_v2.pdf", "payments.yaml"],
      affectedArtifacts: [
        { type: "document", id: "doc-1", title: "Checkout_v2.pdf" },
        { type: "document", id: "doc-2", title: "payments.yaml" },
        { type: "document", id: "doc-3", title: "API_Spec.yaml" },
      ],
      suggestedFix: "Ujednolicić naming convention na 'merchantId' (camelCase)",
    },
    {
      id: "F-008",
      type: "Testability" as const,
      severity: "high" as const,
      summary: "Brak testów integracyjnych dla 3DS flow",
      description:
        "Pełny przepływ 3DS nie jest pokryty testami end-to-end, tylko unit testy.",
      sources: ["TestPlan.md", "SZ-1234"],
      affectedArtifacts: [
        { type: "test", id: "test-2", title: "3ds.spec.ts" },
        { type: "issue", id: "SZ-1234", title: "Implementacja płatności 3DS" },
      ],
      suggestedFix: "Dodać testy E2E pokrywające cały flow 3DS z mockami PSP",
    },
  ] as Finding[],

  releases: [
    {
      id: "R-100",
      environment: "production" as const,
      deployedAt: "2025-09-28T14:00:00Z",
      issues: ["SZ-1200", "SZ-1201"],
      commits: [
        {
          sha: "xyz789",
          message: "feat: initial payment gateway integration",
          author: "Jan Kowalski",
          timestamp: "2025-09-28T10:00:00Z",
        },
        {
          sha: "abc456",
          message: "fix: currency conversion bug",
          author: "Anna Nowak",
          timestamp: "2025-09-28T11:30:00Z",
        },
      ],
      status: "Deployed" as const,
    },
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
    {
      id: "R-103",
      environment: "production" as const,
      deployedAt: "2025-10-12T16:00:00Z",
      issues: ["SZ-1234", "SZ-1250", "SZ-1260"],
      commits: [
        {
          sha: "uvw123",
          message: "feat: webhook retry mechanism",
          author: "Piotr Wiśniewski",
          timestamp: "2025-10-12T10:00:00Z",
        },
        {
          sha: "xyz456",
          message: "feat: enhanced error logging",
          author: "Maria Kowalczyk",
          timestamp: "2025-10-12T11:00:00Z",
        },
        {
          sha: "rst789",
          message: "fix: 3DS redirect issue",
          author: "Jan Kowalski",
          timestamp: "2025-10-12T12:00:00Z",
        },
        {
          sha: "lmn012",
          message: "perf: optimize database queries",
          author: "Anna Nowak",
          timestamp: "2025-10-12T13:00:00Z",
        },
        {
          sha: "opq345",
          message: "test: add performance tests",
          author: "Tomasz Lewandowski",
          timestamp: "2025-10-12T14:00:00Z",
        },
        {
          sha: "hij678",
          message: "docs: update deployment guide",
          author: "Maria Kowalczyk",
          timestamp: "2025-10-12T15:00:00Z",
        },
      ],
      status: "Deployed" as const,
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

// Story templates for generation
export const storyTemplates = {
  payment: [
    {
      titleTemplate: "Jako {persona} chcę {goal}",
      acceptanceCriteria: [
        "WHEN użytkownik wprowadza dane karty THEN system SHALL walidować format PAN",
        "IF kwota > 100 PLN THEN system SHALL wymagać 3DS",
        "WHEN płatność jest autoryzowana THEN system SHALL zapisać transakcję",
      ],
      estimate: "5sp",
      hasConflict: false,
    },
    {
      titleTemplate: "Jako {persona} chcę {goal} z zabezpieczeniem 3DS",
      acceptanceCriteria: [
        "WHEN kwota przekracza próg THEN system SHALL przekierować do 3DS",
        "IF autoryzacja 3DS się powiedzie THEN system SHALL sfinalizować płatność",
        "WHEN użytkownik anuluje 3DS THEN system SHALL zwrócić błąd",
      ],
      estimate: "8sp",
      hasConflict: true,
      conflictDetails: {
        type: "contradiction" as const,
        existingIssueId: "SZ-1234",
        description:
          "Istniejące story SZ-1234 definiuje próg 3DS na 150 PLN, a nie 100 PLN jak w Checkout_v2.pdf",
      },
    },
  ],
  validation: [
    {
      titleTemplate: "Jako {persona} chcę walidować {goal}",
      acceptanceCriteria: [
        "WHEN dane są wprowadzane THEN system SHALL walidować w czasie rzeczywistym",
        "IF dane są nieprawidłowe THEN system SHALL wyświetlić komunikat błędu",
        "WHEN wszystkie pola są poprawne THEN system SHALL aktywować przycisk submit",
      ],
      estimate: "3sp",
      hasConflict: false,
    },
  ],
};

// Test data generators for different schemas
export const testDataSchemas = {
  "payments.yaml#/Card": {
    fields: ["pan", "expiry", "holder", "brand", "cvv"],
    generator: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        pan: `4539${Math.random().toString().slice(2, 14)}`,
        expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/2${7 + Math.floor(Math.random() * 3)}`,
        holder: `CARDHOLDER ${i + 1}`,
        brand: ["VISA", "MASTERCARD", "AMEX"][Math.floor(Math.random() * 3)],
        cvv: String(Math.floor(Math.random() * 900) + 100),
      })),
  },
  "payments.yaml#/ChargeRequest": {
    fields: ["amount", "currency", "pan", "threeDS", "merchantId"],
    generator: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        amount: (Math.random() * 2000).toFixed(2),
        currency: ["PLN", "EUR", "USD"][Math.floor(Math.random() * 3)],
        pan: `4539${Math.random().toString().slice(2, 14)}`,
        threeDS: Math.random() > 0.5,
        merchantId: `MERCH-${String(i + 1).padStart(4, "0")}`,
      })),
  },
  "users.yaml#/User": {
    fields: ["id", "email", "name", "role", "createdAt"],
    generator: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
        role: ["admin", "user", "viewer"][Math.floor(Math.random() * 3)],
        createdAt: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
  },
};

// AC Coverage data for releases
export const acCoverageData = {
  "R-102": [
    {
      issueKey: "SZ-1234",
      totalAC: 3,
      coveredAC: 2,
      coverage: 0.67,
    },
    {
      issueKey: "SZ-1235",
      totalAC: 2,
      coveredAC: 0,
      coverage: 0,
    },
  ],
  "R-103": [
    {
      issueKey: "SZ-1234",
      totalAC: 3,
      coveredAC: 3,
      coverage: 1.0,
    },
    {
      issueKey: "SZ-1250",
      totalAC: 4,
      coveredAC: 4,
      coverage: 1.0,
    },
    {
      issueKey: "SZ-1260",
      totalAC: 2,
      coveredAC: 1,
      coverage: 0.5,
    },
  ],
};
