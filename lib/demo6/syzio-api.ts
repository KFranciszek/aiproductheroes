// Mock Syzio PM API client

export interface SyzioProject {
  id: string;
  name: string;
}

export interface SyzioIssue {
  id: string;
  key: string;
  title: string;
  status: string;
}

export async function fetchProjects(): Promise<SyzioProject[]> {
  await delay(300);
  return [
    { id: "proj-1", name: "ACME Shop" },
    { id: "proj-2", name: "Internal Tools" },
  ];
}

export async function fetchIssues(projectId: string): Promise<SyzioIssue[]> {
  await delay(400);
  return [
    { id: "SZ-1234", key: "SZ-1234", title: "Implement 3DS", status: "In Progress" },
    { id: "SZ-1235", key: "SZ-1235", title: "Payment validation", status: "To Do" },
  ];
}

export async function createIssue(issue: Partial<SyzioIssue>): Promise<SyzioIssue> {
  await delay(500);
  return {
    id: `SZ-${Date.now()}`,
    key: `SZ-${Math.floor(Math.random() * 9000) + 1000}`,
    title: issue.title || "New Issue",
    status: "To Do",
  };
}

export async function updateIssue(
  issueId: string,
  updates: Partial<SyzioIssue>
): Promise<SyzioIssue> {
  await delay(400);
  return {
    id: issueId,
    key: issueId,
    title: updates.title || "Updated Issue",
    status: updates.status || "In Progress",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
