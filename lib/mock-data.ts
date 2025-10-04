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

export const mockData = {
  users,
  sprints,
  issues,
  comments,
  attachments,
  activityLogs,
  timeEntries,
  taskTemplates,
};
