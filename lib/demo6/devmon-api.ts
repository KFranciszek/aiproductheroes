// Mock Dev Monitoring API client

export interface DevMonRelease {
  id: string;
  environment: string;
  deployedAt: string;
  issues: string[];
  commits: DevMonCommit[];
  status: string;
}

export interface DevMonCommit {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
}

export async function fetchReleases(): Promise<DevMonRelease[]> {
  await delay(300);
  return [
    {
      id: "R-101",
      environment: "staging",
      deployedAt: "2025-10-04 18:30",
      issues: ["SZ-1250"],
      commits: [
        {
          sha: "abc123",
          message: "Fix payment bug",
          author: "dev@example.com",
          timestamp: "2025-10-04 17:00",
        },
      ],
      status: "Deployed",
    },
    {
      id: "R-102",
      environment: "staging",
      deployedAt: "2025-10-10 19:00",
      issues: ["SZ-1234", "SZ-1235"],
      commits: [
        {
          sha: "def456",
          message: "Implement 3DS",
          author: "dev@example.com",
          timestamp: "2025-10-10 16:00",
        },
      ],
      status: "Ready",
    },
  ];
}

export async function fetchReleaseDetails(releaseId: string): Promise<DevMonRelease | null> {
  await delay(400);
  const releases = await fetchReleases();
  return releases.find((r) => r.id === releaseId) || null;
}

export async function fetchCommits(releaseId: string): Promise<DevMonCommit[]> {
  await delay(300);
  const release = await fetchReleaseDetails(releaseId);
  return release?.commits || [];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
