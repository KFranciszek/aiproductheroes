import type {
  User,
  Sprint,
  Issue,
  Comment,
  Attachment,
  ActivityLog,
  Priority,
  IssueStatus,
  SprintStatus,
  ActivityAction,
  UserRole,
  AttachmentType,
  AutomationRule,
  AutomationExecution,
  AutomationTemplate,
  AIInsight,
  AutomationMetrics,
} from "@/types"

// --- Helper Functions ---
// Deterministic pseudo-random generator using seed
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const seededRandom = new SeededRandom(12345); // Fixed seed for consistency

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(seededRandom.next() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + seededRandom.next() * (end.getTime() - start.getTime()));
const getRandomNumber = (min: number, max: number): number => Math.floor(seededRandom.next() * (max - min + 1)) + min;

// --- Sample Data for Generation ---
const firstNames = ["Adam", "Ewa", "Piotr", "Anna", "Jan", "Katarzyna", "Marek", "Zofia", "Tomasz", "Magdalena", "Paweł", "Joanna", "Michał", "Agnieszka", "Łukasz", "Monika", "Krzysztof", "Karolina", "Rafał", "Natalia"];
const lastNames = ["Nowak", "Kowalski", "Wiśniewski", "Dąbrowski", "Lewandowski", "Wójcik", "Kamiński", "Zieliński", "Szymański", "Woźniak", "Kozłowski", "Jankowski", "Mazur", "Krawczyk", "Piotrowski", "Grabowski", "Nowakowski", "Pawłowski", "Michalski", "Król"];
const issueNouns = ["Błąd", "Funkcja", "Zadanie", "Usprawnienie", "Problem", "Wdrożenie", "Test", "Refaktoryzacja", "Dokumentacja", "Analiza", "Optymalizacja", "Integracja", "Walidacja", "Implementacja", "Konfiguracja"];
const issueActions = ["logowania", "rejestracji", "płatności", "API", "interfejsu użytkownika", "bazy danych", "wydajności", "zabezpieczeń", "raportowania", "mobilnego", "wyszukiwania", "filtrowania", "eksportu", "importu", "synchronizacji"];
const commentContents = [
  "Zgadzam się z tym podejściem.",
  "Nie jestem pewien, czy to dobry pomysł.",
  "Możesz podać więcej szczegółów?",
  "Zrobione! Sprawdź proszę.",
  "Sprawdzę to i wrócę z odpowiedzią.",
  "To jest zablokowane przez inne zadanie.",
  "Myślę, że powinniśmy to zrobić inaczej.",
  "Dzięki za informację.",
  "Kto jest za to odpowiedzialny?",
  "Jaki jest termin realizacji?",
  "Czy możemy to zrobić w następnym sprincie?",
  "Potrzebuję więcej informacji o wymaganiach.",
  "To wygląda dobrze, ale sprawdźmy jeszcze raz.",
  "Mam pytanie dotyczące implementacji.",
  "Czy możemy dodać testy do tego?",
];
const fileNames = ["specyfikacja.pdf", "mockup.png", "diagram.drawio", "logi.txt", "prezentacja.pptx", "dane.csv", "dokumentacja.docx", "test_results.xml", "config.json", "requirements.txt"];
const linkNames = ["Dokumentacja Google", "Repozytorium GitHub", "Projekt w Figmie", "Artykuł na Medium", "Stack Overflow", "Dokumentacja API", "Design System", "Style Guide", "User Stories", "Technical Spec"];

// --- Data Generation ---

// 1. Generate Users
const users: User[] = Array.from({ length: 25 }, (_, i) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  return {
    id: `user-${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    avatar: `https://i.pravatar.cc/150?u=user-${i + 1}`,
    role: getRandomElement<UserRole>(["Admin", "Developer", "Designer", "Product Owner", "Viewer"]),
    skills: getRandomElement([
      ["React", "TypeScript", "Node.js"],
      ["Python", "Django", "PostgreSQL"],
      ["Figma", "UI/UX", "Prototyping"],
      ["Project Management", "Agile", "Scrum"],
      ["DevOps", "Docker", "AWS"],
      ["Mobile", "React Native", "iOS"],
      ["Backend", "API", "Microservices"],
      ["Frontend", "CSS", "JavaScript"]
    ]),
    capacity: getRandomNumber(6, 10),
    isActive: Math.random() > 0.1,
    joinedAt: getRandomDate(new Date(2022, 0, 1), new Date()),
    lastSeen: getRandomDate(new Date(), new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)),
  };
});

// 2. Generate Sprints
const sprints: Sprint[] = Array.from({ length: 60 }, (_, i) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (60 - i) * 14); // Sprints every 2 weeks for the last year

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);

  let status: SprintStatus = "Completed";
  if (i === 58) status = "Active";
  if (i > 58) status = "Planned";

  return {
    id: `sprint-${i + 1}`,
    name: `Sprint ${i + 1} - ${getRandomElement(issueNouns)} ${getRandomElement(issueActions)}`,
    status,
    startDate,
    endDate,
    createdAt: startDate,
    updatedAt: endDate,
  };
});

// 3. Generate Issues
const issues: Issue[] = [];
let issueCounter = 1;

sprints.forEach(sprint => {
  const issuesInSprint = getRandomNumber(15, 35);
  for (let i = 0; i < issuesInSprint; i++) {
    const creationDate = getRandomDate(sprint.startDate, sprint.endDate);
    const hasParent = issueCounter > 20 && Math.random() > 0.7; // 30% chance of being a sub-task

    issues.push({
      id: `TSK-${String(issueCounter).padStart(3, "0")}`,
      title: `${getRandomElement(issueNouns)} ${getRandomElement(issueActions)}`,
      description: `Szczegółowy opis dla zadania TSK-${String(issueCounter).padStart(3, "0")}. Należy zaimplementować wymaganą funkcjonalność zgodnie ze specyfikacją. To zadanie wymaga uwagi i dokładnego podejścia.`,
      priority: getRandomElement<Priority>(["P0", "P1", "P2", "P3", "P4"]),
      status: sprint.status === "Completed" ? "Done" : getRandomElement<IssueStatus>(["Todo", "In Progress", "In Review", "Done"]),
      storyPoints: getRandomElement([1, 2, 3, 5, 8, 13]),
      type: getRandomElement(["Bug", "Feature", "Chore"]),
      assignee: getRandomElement(users).id,
      sprintId: sprint.id,
      parentId: hasParent ? `TSK-${String(getRandomNumber(1, issueCounter - 1)).padStart(3, "0")}` : undefined,
      attachments: [], // Will be populated later
      isFavorite: Math.random() > 0.8,
      favoritedBy: [],
      statusHistory: [
        { status: "Todo", date: creationDate },
        { status: "In Progress", date: getRandomDate(creationDate, new Date(creationDate.getTime() + 2 * 24 * 60 * 60 * 1000)) },
      ],
      createdAt: creationDate,
      updatedAt: getRandomDate(creationDate, new Date()),
    });
    issueCounter++;
  }
});

// 4. Generate Comments, Attachments, and ActivityLogs
const comments: Comment[] = [];
const attachments: Attachment[] = [];
const activityLogs: ActivityLog[] = [];

let commentCounter = 1;
let attachmentCounter = 1;
let activityLogCounter = 1;

issues.forEach(issue => {
  // Generate Activity Log for creation
  activityLogs.push({
    id: `log-${activityLogCounter++}`,
    issueId: issue.id,
    userId: issue.assignee || getRandomElement(users).id,
    action: 'created',
    newValue: issue.title,
    timestamp: issue.createdAt,
  });

  // Generate a few status changes
  for (let i = 0; i < getRandomNumber(1, 5); i++) {
    activityLogs.push({
      id: `log-${activityLogCounter++}`,
      issueId: issue.id,
      userId: getRandomElement(users).id,
      action: 'status_changed',
      oldValue: getRandomElement<IssueStatus>(["Todo", "In Progress"]),
      newValue: getRandomElement<IssueStatus>(["In Progress", "In Review", "Done"]),
      timestamp: getRandomDate(issue.createdAt, new Date()),
    });
  }

  // Generate assignee changes
  if (Math.random() > 0.6) {
    activityLogs.push({
      id: `log-${activityLogCounter++}`,
      issueId: issue.id,
      userId: getRandomElement(users).id,
      action: 'assignee_changed',
      oldValue: getRandomElement(users).id,
      newValue: getRandomElement(users).id,
      timestamp: getRandomDate(issue.createdAt, new Date()),
    });
  }

  // Generate comments
  const numComments = getRandomNumber(0, 12);
  for (let i = 0; i < numComments; i++) {
    comments.push({
      id: `comment-${String(commentCounter++).padStart(3, "0")}`,
      issueId: issue.id,
      userId: getRandomElement(users).id,
      content: getRandomElement(commentContents),
      createdAt: getRandomDate(issue.createdAt, new Date()),
      updatedAt: new Date(),
    });
  }

  // Generate attachments
  const numAttachments = getRandomNumber(0, 4);
  for (let i = 0; i < numAttachments; i++) {
    const isLink = Math.random() > 0.5;
    const attachment: Attachment = {
      id: `attachment-${String(attachmentCounter++).padStart(3, "0")}`,
      issueId: issue.id,
      type: isLink ? 'link' : 'file',
      name: isLink ? getRandomElement(linkNames) : getRandomElement(fileNames),
      url: isLink ? 'https://example.com' : `/uploads/${getRandomElement(fileNames)}`,
      size: isLink ? undefined : getRandomNumber(10, 10000) * 1024,
      mimeType: isLink ? undefined : 'application/octet-stream',
    };
    attachments.push(attachment);
    issue.attachments.push(attachment); // Add to issue as well
  }
});

// 5. Generate Time Entries
const timeEntries = issues.flatMap(issue => {
  const numEntries = getRandomNumber(0, 8);
  return Array.from({ length: numEntries }, (_, i) => {
    const startTime = getRandomDate(issue.createdAt, new Date());
    const duration = getRandomNumber(30, 480); // 30 minutes to 8 hours
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    return {
      id: `time-${issue.id}-${i + 1}`,
      issueId: issue.id,
      userId: issue.assignee || getRandomElement(users).id,
      startTime,
      endTime,
      duration,
      description: `Praca nad ${issue.title.toLowerCase()}`,
      type: getRandomElement(['manual', 'pomodoro'] as const),
    };
  });
});

// 6. Generate Task Templates
const taskTemplates = [
  {
    id: "template-001",
    name: "Bug Report",
    description: "Standardowy szablon dla zgłaszania błędów",
    category: "Development",
    fields: {
      title: "[BUG] ",
      priority: "P2",
      status: "Todo",
      description: "Opisz szczegółowo napotkany błąd...",
    },
  },
  {
    id: "template-002",
    name: "Feature Request",
    description: "Szablon dla nowych funkcjonalności",
    category: "Product",
    fields: {
      title: "[FEATURE] ",
      priority: "P3",
      status: "Todo",
      description: "Opisz proponowaną funkcjonalność...",
    },
  },
  {
    id: "template-003",
    name: "Code Review",
    description: "Szablon dla review kodu",
    category: "Development",
    fields: {
      title: "[REVIEW] ",
      priority: "P1",
      status: "In Review",
      description: "Wymagany review kodu przed mergem...",
    },
  },
  {
    id: "template-004",
    name: "UI/UX Task",
    description: "Szablon dla zadań związanych z interfejsem",
    category: "Design",
    fields: {
      title: "[UI/UX] ",
      priority: "P2",
      status: "Todo",
      description: "Zadanie związane z interfejsem użytkownika...",
    },
  },
  {
    id: "template-005",
    name: "Performance Task",
    description: "Szablon dla zadań optymalizacyjnych",
    category: "Performance",
    fields: {
      title: "[PERF] ",
      priority: "P1",
      status: "Todo",
      description: "Zadanie związane z optymalizacją wydajności...",
    },
  },
];

// --- Automation Rules ---
const automationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'GitLab Sync - Status Update',
    description: 'Automatycznie aktualizuje status zadania gdy PR jest zmergowany w GitLab',
    category: 'sync',
    trigger: {
      type: 'pr_merged',
      config: { source: 'gitlab' }
    },
    conditions: [
      { field: 'status', operator: 'not_equals', value: 'Done' }
    ],
    actions: [
      { type: 'move_status', config: { newStatus: 'Done' } },
      { type: 'add_comment', config: { content: 'PR został zmergowany - zadanie zamknięte automatycznie' } }
    ],
    status: 'active',
    successRate: 98.5,
    lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    executionCount: 247,
    failureCount: 4,
    avgExecutionTime: 145,
    createdBy: 'Adam Nowak',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-09-20'),
  },
  {
    id: 'rule-2',
    name: 'Auto-assign by Skills',
    description: 'Przypisuje zadania do developerów na podstawie ich umiejętności',
    category: 'assignment',
    trigger: {
      type: 'status_change',
      config: { fromStatus: 'Todo', toStatus: 'In Progress' }
    },
    conditions: [
      { field: 'assignee', operator: 'equals', value: null }
    ],
    actions: [
      { type: 'assign_user', config: { strategy: 'by_skills' } }
    ],
    status: 'active',
    successRate: 95.2,
    lastRun: new Date(Date.now() - 5 * 60 * 1000),
    executionCount: 189,
    failureCount: 9,
    avgExecutionTime: 98,
    createdBy: 'Ewa Kowalska',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rule-3',
    name: 'Sprint Cleanup',
    description: 'Przenosi niedokończone zadania do backlogu po zakończeniu sprintu',
    category: 'sprint',
    trigger: {
      type: 'sprint_end',
      config: {}
    },
    conditions: [
      { field: 'status', operator: 'not_equals', value: 'Done' }
    ],
    actions: [
      { type: 'move_to_sprint', config: { sprintId: null } },
      { type: 'send_notification', config: { channel: 'slack', message: 'Task moved to backlog' } }
    ],
    status: 'active',
    successRate: 89.1,
    lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    executionCount: 45,
    failureCount: 5,
    avgExecutionTime: 234,
    createdBy: 'Piotr Wiśniewski',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-09-28'),
  },
  {
    id: 'rule-4',
    name: 'Blocker Alert',
    description: 'Wysyła powiadomienie gdy zadanie jest zablokowane przez więcej niż 24h',
    category: 'notification',
    trigger: {
      type: 'time_based',
      config: { interval: '1h' }
    },
    conditions: [
      { field: 'status', operator: 'equals', value: 'In Progress' },
      { field: 'blocked_duration', operator: 'greater_than', value: 24 }
    ],
    actions: [
      { type: 'send_notification', config: { channel: 'slack', target: 'team_lead' } }
    ],
    status: 'paused',
    successRate: 100,
    lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000),
    executionCount: 12,
    failureCount: 0,
    avgExecutionTime: 56,
    createdBy: 'Anna Dąbrowska',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-10-03'),
  },
  {
    id: 'rule-5',
    name: 'Friday Report Generator',
    description: 'Generuje automatyczny raport tygodniowy w każdy piątek o 16:00',
    category: 'notification',
    trigger: {
      type: 'time_based',
      config: { schedule: 'friday-16:00' }
    },
    conditions: [],
    actions: [
      { type: 'send_notification', config: { type: 'weekly_report', recipients: 'stakeholders' } }
    ],
    status: 'active',
    successRate: 94.7,
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    executionCount: 19,
    failureCount: 1,
    avgExecutionTime: 1245,
    createdBy: 'Jan Lewandowski',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-09-27'),
  },
];

// --- Automation Executions ---
const automationExecutions: AutomationExecution[] = [
  {
    id: 'exec-1',
    ruleId: 'rule-1',
    ruleName: 'GitLab Sync - Status Update',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    duration: 134,
    triggerData: { prId: '!456', taskId: 'TASK-123' },
    result: { statusChanged: true, commentAdded: true },
    affectedIssues: ['TASK-123'],
  },
  {
    id: 'exec-2',
    ruleId: 'rule-2',
    ruleName: 'Auto-assign by Skills',
    status: 'success',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    duration: 98,
    triggerData: { taskId: 'TASK-124', requiredSkills: ['React', 'TypeScript'] },
    result: { assignedTo: 'Michał Nowak' },
    affectedIssues: ['TASK-124'],
  },
  {
    id: 'exec-3',
    ruleId: 'rule-1',
    ruleName: 'GitLab Sync - Status Update',
    status: 'success',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    duration: 156,
    triggerData: { prId: '!455', taskId: 'TASK-122' },
    result: { statusChanged: true, commentAdded: true },
    affectedIssues: ['TASK-122'],
  },
  {
    id: 'exec-4',
    ruleId: 'rule-5',
    ruleName: 'Friday Report Generator',
    status: 'failed',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    duration: 245,
    triggerData: { reportType: 'weekly' },
    error: 'Slack API rate limit exceeded',
    affectedIssues: [],
  },
  {
    id: 'exec-5',
    ruleId: 'rule-3',
    ruleName: 'Sprint Cleanup',
    status: 'warning',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 289,
    triggerData: { sprintId: 'sprint-3' },
    result: { movedTasks: 7, failedTasks: 1 },
    affectedIssues: ['TASK-110', 'TASK-111', 'TASK-112', 'TASK-113', 'TASK-114', 'TASK-115', 'TASK-116'],
  },
  {
    id: 'exec-6',
    ruleId: 'rule-2',
    ruleName: 'Auto-assign by Skills',
    status: 'success',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    duration: 102,
    triggerData: { taskId: 'TASK-125', requiredSkills: ['Python', 'API'] },
    result: { assignedTo: 'Paweł Zieliński' },
    affectedIssues: ['TASK-125'],
  },
];

// --- Automation Templates ---
const automationTemplates: AutomationTemplate[] = [
  {
    id: 'template-1',
    name: 'GitLab → Jira Sync',
    description: 'Dwukierunkowa synchronizacja statusów między GitLab a Jira',
    category: 'sync',
    icon: '🔄',
    popularity: 95,
    rule: {
      name: 'GitLab ↔ Jira Status Sync',
      description: 'Synchronizuje statusy zadań między GitLab i Jira',
      category: 'sync',
      trigger: { type: 'pr_merged', config: { source: 'gitlab' } },
      conditions: [],
      actions: [
        { type: 'move_status', config: { newStatus: 'Done' } },
        { type: 'add_comment', config: { content: 'Synced from GitLab' } }
      ],
      status: 'draft',
      successRate: 0,
      avgExecutionTime: 0,
    },
  },
  {
    id: 'template-2',
    name: 'Sprint Auto-cleanup',
    description: 'Automatyczne przenoszenie niedokończonych zadań po zakończeniu sprintu',
    category: 'sprint',
    icon: '🧹',
    popularity: 88,
    rule: {
      name: 'Sprint Cleanup Rule',
      description: 'Przenosi niedokończone zadania do backlogu',
      category: 'sprint',
      trigger: { type: 'sprint_end', config: {} },
      conditions: [{ field: 'status', operator: 'not_equals', value: 'Done' }],
      actions: [{ type: 'move_to_sprint', config: { sprintId: null } }],
      status: 'draft',
      successRate: 0,
      avgExecutionTime: 0,
    },
  },
  {
    id: 'template-3',
    name: 'Blocker Alert System',
    description: 'Automatyczne powiadomienia o zablokowanych zadaniach',
    category: 'notification',
    icon: '🚨',
    popularity: 76,
    rule: {
      name: 'Blocker Notification',
      description: 'Wysyła alert gdy zadanie jest zablokowane',
      category: 'notification',
      trigger: { type: 'time_based', config: { interval: '2h' } },
      conditions: [{ field: 'status', operator: 'equals', value: 'In Progress' }],
      actions: [{ type: 'send_notification', config: { channel: 'slack' } }],
      status: 'draft',
      successRate: 0,
      avgExecutionTime: 0,
    },
  },
  {
    id: 'template-4',
    name: 'Weekly Report Generator',
    description: 'Automatyczny raport tygodniowy w każdy piątek',
    category: 'notification',
    icon: '📊',
    popularity: 92,
    rule: {
      name: 'Friday Report',
      description: 'Generuje raport tygodniowy',
      category: 'notification',
      trigger: { type: 'time_based', config: { schedule: 'friday-16:00' } },
      conditions: [],
      actions: [{ type: 'send_notification', config: { type: 'report' } }],
      status: 'draft',
      successRate: 0,
      avgExecutionTime: 0,
    },
  },
  {
    id: 'template-5',
    name: 'Smart Task Assignment',
    description: 'Inteligentne przypisywanie zadań na podstawie umiejętności',
    category: 'assignment',
    icon: '🎯',
    popularity: 84,
    rule: {
      name: 'Skill-based Assignment',
      description: 'Przypisuje zadania według umiejętności',
      category: 'assignment',
      trigger: { type: 'status_change', config: {} },
      conditions: [{ field: 'assignee', operator: 'equals', value: null }],
      actions: [{ type: 'assign_user', config: { strategy: 'by_skills' } }],
      status: 'draft',
      successRate: 0,
      avgExecutionTime: 0,
    },
  },
];

// --- AI Insights ---
const aiInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'risk',
    title: 'Sprint velocity spadło o 30%',
    description: 'Obecny sprint ma znacznie niższą velocity niż poprzednie. Zalecane przepriorytetyzowanie zadań lub przeniesienie części do następnego sprintu.',
    severity: 'high',
    actionable: true,
    action: {
      label: 'Podejrzyj szczegóły sprintu',
    },
    relatedSprints: ['sprint-4'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    dismissed: false,
  },
  {
    id: 'insight-2',
    type: 'suggestion',
    title: 'Nieprzypisane zadania w sprincie',
    description: '5 zadań w aktywnym sprincie nie ma przypisanego developera. Rozważ użycie automatycznego przypisywania.',
    severity: 'medium',
    actionable: true,
    action: {
      label: 'Włącz auto-assignment',
      ruleTemplate: automationTemplates[4],
    },
    relatedIssues: ['TASK-120', 'TASK-121', 'TASK-122', 'TASK-123', 'TASK-124'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    dismissed: false,
  },
  {
    id: 'insight-3',
    type: 'pattern',
    title: 'Powtarzający się wzorzec: Zadania czekają na review',
    description: 'Wykryto wzorzec - 80% zadań spędza więcej niż 2 dni w statusie "In Review". Rozważ automatyzację przypominania o code review.',
    severity: 'medium',
    actionable: true,
    action: {
      label: 'Utwórz przypomnienia',
      ruleTemplate: automationTemplates[2],
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    dismissed: false,
  },
  {
    id: 'insight-4',
    type: 'optimization',
    title: 'Możesz zaoszczędzić 5h/tydzień',
    description: 'Ręcznie przenosisz zadania między sprintami. Automatyzacja tego procesu zaoszczędzi około 5 godzin tygodniowo.',
    severity: 'low',
    actionable: true,
    action: {
      label: 'Włącz automatyzację',
      ruleTemplate: automationTemplates[1],
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dismissed: false,
  },
  {
    id: 'insight-5',
    type: 'risk',
    title: 'Potencjalne opóźnienie w deadline',
    description: 'Na podstawie obecnej velocity, sprint może nie zostać ukończony na czas. 3 zadania wysokiego priorytetu są zagrożone.',
    severity: 'high',
    actionable: true,
    relatedIssues: ['TASK-101', 'TASK-102', 'TASK-103'],
    relatedSprints: ['sprint-4'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    dismissed: false,
  },
];

// --- Automation Metrics ---
const automationMetrics: AutomationMetrics = {
  healthScore: 94,
  activeRules: 4,
  totalExecutions: 1247,
  successRate: 98.2,
  timeSavedHours: 12.5,
  failureRate: 1.8,
  avgResponseTime: 145,
};

export const mockData = {
  users,
  sprints,
  issues,
  comments,
  attachments,
  activityLogs,
  timeEntries,
  taskTemplates,
  automationRules,
  automationExecutions,
  automationTemplates,
  aiInsights,
  automationMetrics,
};
