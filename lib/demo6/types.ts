// Core TypeScript types for Syzio Canis (Demo6)

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface Citation {
  source: string; // "Checkout_v2.pdf p.5"
  fragment: string;
  confidence: number;
}

export interface ChatThread {
  id: string;
  title: string;
  preview: string;
  messages: ChatMessage[];
  context: {
    projectId: string;
    openIssueId?: string;
    documents: string[];
  };
}

export interface GeneratedStory {
  id: string;
  title: string;
  persona: string;
  goal: string;
  benefit: string;
  acceptanceCriteria: AcceptanceCriterion[];
  estimate: string;
  sources: Citation[];
  conflicts?: Conflict[];
}

export interface AcceptanceCriterion {
  id: string;
  format: 'EARS' | 'Gherkin';
  text: string;
}

export interface Conflict {
  type: 'duplicate' | 'contradiction' | 'overlap';
  existingIssueId: string;
  description: string;
}

export interface TestDataConfig {
  schema: string;
  recordCount: number;
  rules: string; // YAML string
  edgeCases: EdgeCase[];
}

export interface EdgeCase {
  description: string;
  count: number;
  overrides: Record<string, any>;
}

export interface GeneratedDataset {
  id: string;
  schema: string;
  records: Record<string, any>[];
  metadata: {
    generatedAt: string;
    totalRecords: number;
    edgeCaseCount: number;
  };
}

export interface Finding {
  id: string;
  type: 'Consistency' | 'Completeness' | 'Clarity' | 'Testability';
  severity: 'low' | 'medium' | 'high';
  summary: string;
  description: string;
  sources: string[];
  affectedArtifacts: ArtifactReference[];
  suggestedFix?: string;
}

export interface ArtifactReference {
  type: 'document' | 'issue' | 'test' | 'commit';
  id: string;
  title: string;
}

export interface Release {
  id: string;
  environment: 'staging' | 'production';
  deployedAt: string;
  issues: string[];
  commits: CommitReference[];
  status: 'Deployed' | 'Ready' | 'Failed';
}

export interface CommitReference {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
}

export interface ACCoverage {
  issueKey: string;
  totalAC: number;
  coveredAC: number;
  coverage: number;
}

export interface ReleaseAnswer {
  question: string;
  answer: string;
  sources: Citation[];
  relatedData: {
    issues: string[];
    coverage: ACCoverage[];
    commits: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface SyncStatus {
  lastSync: string;
  status: 'syncing' | 'synced' | 'error';
  sources: {
    syzio: boolean;
    devMon: boolean;
    documents: boolean;
  };
}
