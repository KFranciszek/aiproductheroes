import type {
  User,
  Team,
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
  SprintMetrics,
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

// 1. Generate Teams (przed użytkownikami, żeby móc je użyć)
const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Squad',
    description: 'Zespół odpowiedzialny za UI/UX i frontend development',
    color: '#3B82F6', // Niebieski
    memberIds: [
      'user-2', 'user-8', 'user-10', 'user-16', 'user-19', // Frontend devs
      'user-3', 'user-13', // Designers
    ],
    leadId: 'user-2', // Ewa Kowalska jako lead
    defaultCapacity: 80, // 7 osób * ~11 SP/osoba
    isActive: true,
    createdAt: new Date(2022, 0, 15),
    updatedAt: new Date(),
  },
  
  {
    id: 'team-2',
    name: 'Backend Core',
    description: 'API, bazy danych, mikrousługi i infrastruktura',
    color: '#10B981', // Zielony
    memberIds: [
      'user-1', 'user-4', 'user-7', 'user-11', 'user-14', 'user-15', 'user-18', // Backend devs
      'user-12', // DevOps
    ],
    leadId: 'user-1', // Adam Nowak jako lead
    defaultCapacity: 95, // 8 osób * ~12 SP/osoba
    isActive: true,
    createdAt: new Date(2022, 0, 10),
    updatedAt: new Date(),
  },
  
  {
    id: 'team-3',
    name: 'Mobile & Platform',
    description: 'React Native, iOS, Android i platformy mobilne',
    color: '#8B5CF6', // Fioletowy
    memberIds: [
      'user-6', 'user-13', 'user-17', // Mobile devs
      'user-9', 'user-23', // Full-stack (mobile support)
    ],
    leadId: 'user-13', // Michał Mazur jako lead
    defaultCapacity: 55, // 5 osób * ~11 SP/osoba
    isActive: true,
    createdAt: new Date(2022, 1, 1),
    updatedAt: new Date(),
  },
];

// 2. Generate Users
// Add current user first
const currentUser: User = {
  id: 'current-user',
  name: 'Ty (Demo User)',
  email: 'demo@example.com',
  avatar: 'https://i.pravatar.cc/150?u=current-user',
  role: 'Developer',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  capacity: 8,
  isActive: true,
  joinedAt: new Date(2023, 0, 1),
  lastSeen: new Date(),
  teamIds: ['team-2'],
  primaryTeamId: 'team-2',
  isTeamLead: false,
};

const users: User[] = [currentUser, ...Array.from({ length: 25 }, (_, i) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const userId = `user-${i + 1}`;
  
  // Znajdź zespół dla tego użytkownika
  const userTeam = teams.find(team => team.memberIds.includes(userId));
  const isLead = userTeam?.leadId === userId;
  
  return {
    id: userId,
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
    // Team assignments
    teamIds: userTeam ? [userTeam.id] : [],
    primaryTeamId: userTeam?.id,
    isTeamLead: isLead,
  };
})];

// 3. Generate Sprints with correct dates
const sprints: Sprint[] = Array.from({ length: 60 }, (_, i) => {
  const today = new Date();
  const sprintNumber = i + 1;
  
  let startDate: Date;
  let endDate: Date;
  let status: SprintStatus;
  
  if (sprintNumber === 59) {
    // Active sprint - rozpoczął się 7 dni temu, kończy się za 7 dni
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    status = "Active";
  } else if (sprintNumber === 60) {
    // Planned sprint - zaczyna się za 7 dni
    startDate = new Date(today);
    startDate.setDate(today.getDate() + 7);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);
    status = "Planned";
  } else {
    // Completed sprints - każdy 2 tygodnie wstecz
    const weeksBack = 59 - sprintNumber;
    startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksBack * 14) - 7);
    endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);
    status = "Completed";
  }

  return {
    id: `sprint-${sprintNumber}`,
    name: `Sprint ${sprintNumber} - ${getRandomElement(issueNouns)} ${getRandomElement(issueActions)}`,
    status,
    startDate,
    endDate,
    velocity: status === "Completed" ? getRandomNumber(15, 25) : undefined,
    capacity: 40, // Deprecated - use teamCapacity instead
    // Team assignments
    teamId: sprintNumber === 59 ? 'team-1' : undefined, // Backward compatibility
    teamCapacity: sprintNumber === 59 ? [
      {
        teamId: 'team-1',
        allocatedCapacity: 30, // Frontend Squad
        memberIds: teams.find(t => t.id === 'team-1')?.memberIds || []
      },
      {
        teamId: 'team-2', 
        allocatedCapacity: 35, // Backend Core
        memberIds: teams.find(t => t.id === 'team-2')?.memberIds || []
      },
      {
        teamId: 'team-3',
        allocatedCapacity: 20, // Mobile & Platform  
        memberIds: teams.find(t => t.id === 'team-3')?.memberIds || []
      }
    ] : undefined,
    createdAt: startDate,
    updatedAt: new Date(),
  };
});

// 3. Generate Predefined Tasks for Active Sprint (Sprint 59)
const activeSprint = sprints.find(s => s.id === 'sprint-59');

const predefinedTasks = [
  {
    id: 'TSK-1490',
    title: 'Refaktoryzacja API',
    priority: 'P1' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'user-1', // Adam Nowak - Backend Developer
    storyPoints: 8,
    estimatedHours: 16,
    teamId: 'team-2', // Backend Core
    blocks: ['TSK-1495', 'TSK-1498'] // Blokuje rejestrację
  },
  {
    id: 'TSK-1495', 
    title: 'Walidacja rejestracji',
    priority: 'P0' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'user-2', // Ewa Kowalska - Frontend Developer
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-1', // Frontend Squad
    blockedBy: ['TSK-1490'] // Zablokowane przez API
  },
  {
    id: 'TSK-1498',
    title: 'Integracja rejestracji', 
    priority: 'P1' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'user-3', // Piotr Wiśniewski - Full-stack
    storyPoints: 5,
    estimatedHours: 12,
    teamId: 'team-1', // Frontend Squad (Piotr Wiśniewski jest w Frontend Squad)
    blockedBy: ['TSK-1490', 'TSK-1495'] // Zablokowane przez API i walidację
  },
  {
    id: 'TSK-1503',
    title: 'Błąd logowania',
    priority: 'P1' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'user-4', // Anna Dąbrowska - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: ['TSK-1490'] // Zablokowane przez API
  },
  {
    id: 'TSK-1508',
    title: 'Test eksportu',
    priority: 'P2' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'user-5', // Jan Lewandowski - QA
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-2', // Backend Core (QA może być w Backend Core)
    blockedBy: [] // Nie zablokowane
  },
  // In Progress tasks (8 tasks - over WIP limit of 5)
  {
    id: 'TSK-1492',
    title: 'Dokumentacja eksportu',
    priority: 'P3' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-6', // Katarzyna Wójcik - Technical Writer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-3', // Mobile & Platform (Technical Writer)
    blockedBy: []
  },
  {
    id: 'TSK-1494',
    title: 'Usprawnienie API',
    priority: 'P3' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-1', // Adam Nowak
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1496',
    title: 'Problem eksportu',
    priority: 'P2' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-7', // Marek Kamiński - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1499',
    title: 'Optymalizacja wyszukiwania',
    priority: 'P3' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-8', // Zofia Zieliński - Frontend Developer
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-1', // Frontend Squad
    blockedBy: []
  },
  {
    id: 'TSK-1504',
    title: 'Walidacja synchronizacji',
    priority: 'P2' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-9', // Tomasz Szymański - Full-stack
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-3', // Mobile & Platform (Full-stack)
    blockedBy: []
  },
  {
    id: 'TSK-1514',
    title: 'Implementacja wyszukiwania',
    priority: 'P2' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-10', // Magdalena Woźniak - Frontend Developer
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-1', // Frontend Squad
    blockedBy: []
  },
  {
    id: 'TSK-1515',
    title: 'Debugging API',
    priority: 'P1' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-11', // Paweł Kozłowski - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1516',
    title: 'Performance tuning',
    priority: 'P2' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'user-12', // Joanna Jankowski - DevOps
    storyPoints: 8,
    estimatedHours: 16,
    teamId: 'team-2', // Backend Core (DevOps)
    blockedBy: []
  },
  // In Review tasks (9 tasks - over WIP limit of 3)
  {
    id: 'TSK-1491',
    title: 'Błąd mobilnego',
    priority: 'P4' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-13', // Michał Mazur - Mobile Developer
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-3', // Mobile & Platform
    blockedBy: []
  },
  {
    id: 'TSK-1493',
    title: 'Wdrożenie raportowania',
    priority: 'P4' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-14', // Agnieszka Krawczyk - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1497',
    title: 'Test rejestracji',
    priority: 'P4' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-5', // Jan Lewandowski - QA
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-2', // Backend Core (QA)
    blockedBy: []
  },
  {
    id: 'TSK-1505',
    title: 'Zadanie API',
    priority: 'P3' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-15', // Łukasz Piotrowski - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1506',
    title: 'Optymalizacja raportowania',
    priority: 'P4' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-16', // Monika Grabowskiego - Frontend Developer
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-1', // Frontend Squad
    blockedBy: []
  },
  {
    id: 'TSK-1510',
    title: 'Implementacja mobilnego',
    priority: 'P2' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-17', // Krzysztof Nowakowski - Mobile Developer
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-3', // Mobile & Platform
    blockedBy: []
  },
  {
    id: 'TSK-1511',
    title: 'Usprawnienie importu',
    priority: 'P1' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-18', // Karolina Pawłowski - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1512',
    title: 'Zadanie rejestracji',
    priority: 'P4' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-19', // Rafał Michalski - Frontend Developer
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-1', // Frontend Squad
    blockedBy: []
  },
  {
    id: 'TSK-1513',
    title: 'Code review',
    priority: 'P3' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'user-20', // Natalia Król - Senior Developer
    storyPoints: 1,
    estimatedHours: 2,
    teamId: 'team-2', // Backend Core (Senior Developer)
    blockedBy: []
  },
  // Done tasks (6 tasks)
  {
    id: 'TSK-1500',
    title: 'Optymalizacja logowania',
    priority: 'P4' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-21', // Adam Nowakowski - Backend Developer
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  {
    id: 'TSK-1501',
    title: 'Refaktoryzacja wyszukiwania',
    priority: 'P3' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-22', // Ewa Pawłowski - Frontend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-1', // Frontend Squad
    blockedBy: []
  },
  {
    id: 'TSK-1502',
    title: 'Zadanie logowania',
    priority: 'P2' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-23', // Piotr Michalski - Full-stack
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-3', // Mobile & Platform (Full-stack)
    blockedBy: []
  },
  {
    id: 'TSK-1507',
    title: 'Walidacja wyszukiwania',
    priority: 'P3' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-24', // Anna Król - QA
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-2', // Backend Core (QA)
    blockedBy: []
  },
  {
    id: 'TSK-1509',
    title: 'Analiza zabezpieczeń',
    priority: 'P2' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-25', // Jan Nowak - Security Engineer
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-2', // Backend Core (Security Engineer)
    blockedBy: []
  },
  {
    id: 'TSK-1517',
    title: 'Funkcja bazy danych',
    priority: 'P3' as Priority,
    status: 'Done' as IssueStatus,
    assigneeId: 'user-1', // Adam Nowak - Backend Developer
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2', // Backend Core
    blockedBy: []
  },
  // Tasks for current user (Dashboard demo)
  {
    id: 'TSK-1520',
    title: 'Naprawa krytycznego błędu w płatnościach',
    priority: 'P0' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'current-user',
    storyPoints: 8,
    estimatedHours: 16,
    teamId: 'team-2',
    blockedBy: []
  },
  {
    id: 'TSK-1521',
    title: 'Implementacja nowego dashboardu',
    priority: 'P1' as Priority,
    status: 'In Progress' as IssueStatus,
    assigneeId: 'current-user',
    storyPoints: 13,
    estimatedHours: 24,
    teamId: 'team-1',
    blockedBy: []
  },
  {
    id: 'TSK-1522',
    title: 'Code review dla PR #234',
    priority: 'P1' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'current-user',
    storyPoints: 2,
    estimatedHours: 4,
    teamId: 'team-2',
    blockedBy: []
  },
  {
    id: 'TSK-1523',
    title: 'Aktualizacja dokumentacji API',
    priority: 'P2' as Priority,
    status: 'Todo' as IssueStatus,
    assigneeId: 'current-user',
    storyPoints: 3,
    estimatedHours: 6,
    teamId: 'team-2',
    blockedBy: []
  },
  {
    id: 'TSK-1524',
    title: 'Optymalizacja zapytań do bazy danych',
    priority: 'P2' as Priority,
    status: 'In Review' as IssueStatus,
    assigneeId: 'current-user',
    storyPoints: 5,
    estimatedHours: 10,
    teamId: 'team-2',
    blockedBy: []
  }
];

// Generate issues with full assignee data
const activeSprintIssues: Issue[] = predefinedTasks.map(taskData => {
  const assignee = users.find(u => u.id === taskData.assigneeId);
  
  return {
    id: taskData.id,
    title: taskData.title,
    description: `Szczegółowy opis dla zadania ${taskData.id}. Należy zaimplementować wymaganą funkcjonalność zgodnie ze specyfikacją. To zadanie wymaga uwagi i dokładnego podejścia.`,
    priority: taskData.priority,
    status: taskData.status,
    storyPoints: taskData.storyPoints,
    type: 'Feature',
    assignee: assignee ? {
      id: assignee.id,
      name: assignee.name,
      avatar: assignee.avatar,
      role: assignee.role,
      skills: assignee.skills,
      capacity: assignee.capacity
    } : undefined,
    sprintId: 'sprint-59', // Active sprint
    teamId: taskData.teamId, // Dodaj teamId z predefiniowanych zadań
    dependencies: {
      blocks: taskData.blocks || [],
      blockedBy: taskData.blockedBy || []
    },
    estimatedHours: taskData.estimatedHours,
    actualHours: taskData.status === 'Done' ? taskData.estimatedHours : Math.floor(taskData.estimatedHours * 0.3),
    attachments: [],
    isFavorite: Math.random() > 0.8,
    favoritedBy: [],
    statusHistory: [
      { status: "Todo", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { status: "In Progress", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  };
});

// Generate additional issues for other sprints
const issues: Issue[] = [...activeSprintIssues];
let issueCounter = 1518; // Start from next number

sprints.forEach(sprint => {
  if (sprint.id === 'sprint-59') return; // Skip active sprint, already handled
  
  const issuesInSprint = getRandomNumber(15, 35);
  for (let i = 0; i < issuesInSprint; i++) {
    const creationDate = getRandomDate(sprint.startDate, sprint.endDate);
    const assignee = getRandomElement(users);

    issues.push({
      id: `TSK-${String(issueCounter).padStart(3, "0")}`,
      title: `${getRandomElement(issueNouns)} ${getRandomElement(issueActions)}`,
      description: `Szczegółowy opis dla zadania TSK-${String(issueCounter).padStart(3, "0")}. Należy zaimplementować wymaganą funkcjonalność zgodnie ze specyfikacją. To zadanie wymaga uwagi i dokładnego podejścia.`,
      priority: getRandomElement<Priority>(["P0", "P1", "P2", "P3", "P4"]),
      status: sprint.status === "Completed" ? "Done" : getRandomElement<IssueStatus>(["Todo", "In Progress", "In Review", "Done"]),
      storyPoints: getRandomElement([1, 2, 3, 5, 8, 13]),
      type: getRandomElement(["Bug", "Feature", "Chore"]),
      assignee: {
        id: assignee.id,
        name: assignee.name,
        avatar: assignee.avatar,
        role: assignee.role,
        skills: assignee.skills,
        capacity: assignee.capacity
      },
      sprintId: sprint.id,
      teamId: assignee.primaryTeamId, // Przypisz zadanie do zespołu użytkownika
      dependencies: {
        blocks: [],
        blockedBy: []
      },
      estimatedHours: getRandomNumber(2, 16),
      actualHours: 0,
      attachments: [],
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
let activityCounter = 1;

// Generate activity logs for issues
issues.forEach(issue => {
  // Issue creation
  activityLogs.push({
    id: `activity-${activityCounter++}`,
    issueId: issue.id,
    userId: issue.assignee?.id || 'system',
    action: 'created',
    timestamp: issue.createdAt,
    metadata: { title: issue.title }
  });

  // Status changes
  if (issue.statusHistory) {
    issue.statusHistory.forEach((statusChange, index) => {
      if (index > 0) {
        const prevStatus = issue.statusHistory![index - 1].status;
        activityLogs.push({
          id: `activity-${activityCounter++}`,
          issueId: issue.id,
          userId: issue.assignee?.id || 'system',
          action: 'status_changed',
          oldValue: prevStatus,
          newValue: statusChange.status,
          field: 'status',
          timestamp: statusChange.date
        });
      }
    });
  }

  // Assignee changes (if different from creator)
  if (issue.assignee && issue.assignee.id !== 'system') {
    activityLogs.push({
      id: `activity-${activityCounter++}`,
      issueId: issue.id,
      userId: issue.assignee.id,
      action: 'assignee_changed',
      oldValue: 'Unassigned',
      newValue: issue.assignee.name,
      field: 'assignee',
      timestamp: new Date(issue.createdAt.getTime() + 24 * 60 * 60 * 1000) // 1 day later
    });
  }

  // Favorite toggles
  if (issue.isFavorite) {
    activityLogs.push({
      id: `activity-${activityCounter++}`,
      issueId: issue.id,
      userId: issue.assignee?.id || 'system',
      action: 'favorite_added',
      timestamp: new Date(issue.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days later
    });
  }

  // Sprint assignment
  if (issue.sprintId) {
    const sprint = sprints.find(s => s.id === issue.sprintId);
    activityLogs.push({
      id: `activity-${activityCounter++}`,
      issueId: issue.id,
      userId: issue.assignee?.id || 'system',
      action: 'updated',
      oldValue: 'Backlog',
      newValue: sprint?.name || 'Sprint',
      field: 'sprint',
      timestamp: new Date(issue.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days later
    });
  }
});

// Generate some comments
issues.slice(0, 20).forEach(issue => {
  const numComments = getRandomNumber(1, 3);
  for (let i = 0; i < numComments; i++) {
    const commentDate = getRandomDate(issue.createdAt, new Date());
    comments.push({
      id: `comment-${commentCounter++}`,
      issueId: issue.id,
      userId: issue.assignee?.id || getRandomElement(users).id,
      content: `Komentarz do zadania ${issue.id}. ${getRandomElement([
        'Sprawdzam implementację.',
        'Potrzebuję więcej informacji.',
        'Gotowe do review.',
        'Wymaga poprawek.',
        'Dobra robota!'
      ])}`,
      createdAt: commentDate,
      updatedAt: commentDate,
    });
  }
});

// Generate some attachments
issues.slice(0, 10).forEach(issue => {
  const numAttachments = getRandomNumber(0, 2);
  for (let i = 0; i < numAttachments; i++) {
    attachments.push({
      id: `attachment-${attachmentCounter++}`,
      issueId: issue.id,
      name: `${getRandomElement(['design', 'mockup', 'spec', 'test'])}-${issue.id}.${getRandomElement(['pdf', 'png', 'docx', 'zip'])}`,
      url: `/attachments/${issue.id}/file-${i + 1}`,
      size: getRandomNumber(1024, 1024 * 1024 * 5), // 1KB to 5MB
      mimeType: getRandomElement(['application/pdf', 'image/png', 'application/zip', 'text/plain']),
      uploadedBy: issue.assignee?.id || getRandomElement(users).id,
      uploadedAt: getRandomDate(issue.createdAt, new Date()),
    });
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

// --- Dynamic AI Insights Generation ---
const generateAIInsights = (issues: Issue[], users: User[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // 1. Find blocked tasks
  const blockedTasks = issues.filter(issue => 
    issue.dependencies?.blockedBy && issue.dependencies.blockedBy.length > 0
  );
  
  if (blockedTasks.length > 0) {
    insights.push({
      id: 'insight-blocked-tasks',
      type: 'risk',
      title: `${blockedTasks.length} zadań są zablokowane`,
      description: `System wykrył zadania zależne, które mogą opóźnić sprint. Sprawdź zależności i rozważ przepriorytetyzowanie.`,
      severity: 'high',
      actionable: true,
      action: {
        label: 'Pokaż zależności',
      },
      relatedIssues: blockedTasks.map(t => t.id),
      relatedSprints: ['sprint-59'],
      createdAt: new Date(),
      dismissed: false,
    });
  }
  
  // 2. Check WIP limits
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const wipLimits = {
    'In Progress': 5,
    'In Review': 3
  };
  
  Object.entries(wipLimits).forEach(([status, limit]) => {
    const current = statusCounts[status] || 0;
    if (current > limit) {
      insights.push({
        id: `insight-wip-${status.toLowerCase().replace(' ', '-')}`,
        type: 'warning',
        title: `Przekroczony WIP limit w ${status}`,
        description: `${status}: ${current}/${limit} - za dużo zadań w tym statusie`,
        severity: 'medium',
        actionable: true,
        action: {
          label: 'Zbalansuj WIP',
        },
        createdAt: new Date(),
        dismissed: false,
      });
    }
  });
  
  // 3. Check team load
  const teamLoad = users.map(user => {
    const userTasks = issues.filter(issue => issue.assignee?.id === user.id);
    const totalStoryPoints = userTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    return {
      user,
      taskCount: userTasks.length,
      storyPoints: totalStoryPoints,
      loadPercentage: (totalStoryPoints / 20) * 100 // Assuming 20 SP capacity
    };
  });
  
  const overloadedUsers = teamLoad.filter(load => load.loadPercentage > 100);
  if (overloadedUsers.length > 0) {
    insights.push({
      id: 'insight-team-overload',
      type: 'risk',
      title: `${overloadedUsers.length} członków zespołu przeciążonych`,
      description: `Niektórzy członkowie zespołu mają za dużo zadań. Rozważ redystrybucję obciążenia.`,
      severity: 'high',
      actionable: true,
      action: {
        label: 'Zbalansuj zespół',
      },
      createdAt: new Date(),
      dismissed: false,
    });
  }
  
  // 4. High priority tasks in review
  const highPriorityInReview = issues.filter(issue => 
    issue.status === 'In Review' && (issue.priority === 'P0' || issue.priority === 'P1')
  );
  
  if (highPriorityInReview.length > 0) {
    insights.push({
      id: 'insight-high-priority-review',
      type: 'warning',
      title: `${highPriorityInReview.length} zadań wysokiego priorytetu w review`,
      description: `Zadania P0/P1 czekają na review. Rozważ przyspieszenie procesu lub przypisanie dodatkowego reviewera.`,
      severity: 'medium',
      actionable: true,
      action: {
        label: 'Przyspiesz review',
      },
      relatedIssues: highPriorityInReview.map(t => t.id),
      createdAt: new Date(),
      dismissed: false,
    });
  }
  
  // 5. Sprint progress analysis
  const completedTasks = issues.filter(issue => issue.status === 'Done').length;
  const totalTasks = issues.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  if (progressPercentage < 30) {
    insights.push({
      id: 'insight-sprint-progress',
      type: 'risk',
      title: 'Niska velocity sprintu',
      description: `Tylko ${progressPercentage}% zadań ukończonych. Sprint może nie zostać ukończony w terminie.`,
      severity: 'high',
      actionable: true,
      action: {
        label: 'Przepriorytetyzuj zadania',
      },
      relatedSprints: ['sprint-59'],
      createdAt: new Date(),
      dismissed: false,
    });
  }
  
  return insights;
};

const aiInsights = generateAIInsights(activeSprintIssues, users);

// --- Sprint Metrics ---
const generateSprintMetrics = (issues: Issue[], users: User[], activeSprint: Sprint | undefined): SprintMetrics => {
  const totalTasks = issues.length;
  const completedTasks = issues.filter(issue => issue.status === 'Done').length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  const totalStoryPoints = issues.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  
  const wipLimits = {
    'In Progress': 5,
    'In Review': 3,
    'Todo': 10
  };
  
  const teamLoad = users.map(user => {
    const userTasks = issues.filter(issue => issue.assignee?.id === user.id);
    const totalStoryPoints = userTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    return {
      user,
      taskCount: userTasks.length,
      storyPoints: totalStoryPoints,
      loadPercentage: (totalStoryPoints / 20) * 100 // Assuming 20 SP capacity
    };
  });
  
  return {
    activeSprint,
    totalTasks,
    completedTasks,
    progressPercentage,
    totalStoryPoints,
    wipLimits,
    teamLoad
  };
};

const sprintMetrics = generateSprintMetrics(activeSprintIssues, users, activeSprint);

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
  teams,
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
  sprintMetrics,
};
