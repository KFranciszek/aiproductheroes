// lib/github-integration.ts
import type { Issue, Priority } from "@/types"

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  assignee?: string;
  created_at: string;
  updated_at: string;
}

class GitHubIntegration {
  private token: string | null = null;

  constructor() {
    // Pobierz token z localStorage
    this.token = localStorage.getItem('github_token');
  }

  async authenticate(token: string) {
    this.token = token;
    localStorage.setItem('github_token', token);

    // Mock - w rzeczywistości sprawdź token z GitHub API
    return { success: true, username: 'mock_user' };
  }

  async fetchIssues(repo: string): Promise<Partial<Issue>[]> {
    if (!this.token) throw new Error('Not authenticated');

    // Mock danych - w rzeczywistości: fetch z GitHub API
    const mockIssues: GitHubIssue[] = [
      {
        id: 1,
        title: 'Fix login bug',
        body: 'Users cannot login with special characters',
        state: 'open',
        labels: ['bug', 'urgent'],
        assignee: 'developer1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-16T14:30:00Z'
      }
    ];

    return mockIssues.map(issue => ({
      id: `github-${issue.id}`,
      title: issue.title,
      description: issue.body,
      priority: this.mapGitHubLabelsToPriority(issue.labels),
      status: issue.state === 'open' ? 'Todo' : 'Done',
      assignee: issue.assignee,
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at)
    }));
  }

  private mapGitHubLabelsToPriority(labels: string[]): Priority {
    if (labels.includes('urgent') || labels.includes('critical')) return 'P0';
    if (labels.includes('high')) return 'P1';
    if (labels.includes('medium')) return 'P2';
    return 'P3';
  }
}

// Hook do używania integracji
export function useGitHubIntegration() {
  const importFromGitHub = async (repo: string) => {
    try {
      const integration = new GitHubIntegration();
      const issues = await integration.fetchIssues(repo);

      // Zapisz w localStorage jako dodatkowe zadania
      const existingIssues = JSON.parse(localStorage.getItem('imported_issues') || '[]');
      const updatedIssues = [...existingIssues, ...issues];
      localStorage.setItem('imported_issues', JSON.stringify(updatedIssues));

      return issues;
    } catch (error) {
      console.error('GitHub import failed:', error);
      throw error;
    }
  };

  return { importFromGitHub };
}


