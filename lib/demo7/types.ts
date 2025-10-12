export type ID = string;

export interface Objective {
  id: ID;
  name: string;
  owner: string;
  start: string;
  end: string;
  krIds: ID[];
}

export interface KeyResult {
  id: ID;
  objectiveId: ID;
  name: string;
  unit: "pct" | "abs";
  target: number;
  current: number;
  due?: string;
  owner?: string;
  confidence?: number;
  epicIds: ID[];
  issueIds: ID[];
}

export interface Epic {
  id: ID;
  name: string;
  team?: string;
  issueIds: ID[];
  krIds: ID[];
  repo?: string;
}

export interface Issue {
  id: ID;
  title: string;
  assignee?: string;
  status: "todo" | "in_progress" | "in_review" | "done";
  priority: "P0" | "P1" | "P2" | "P3";
  storyPoints?: number;
  epicId?: ID;
  krIds: ID[];
}

export interface QualityGate {
  id: ID;
  epicId: ID;
  name: string;
  metric: "coverage" | "tests_pass" | "lint" | "sec" | "approvals";
  threshold: number;
  status: "pass" | "fail" | "waived";
  updatedAt: string;
}

export interface DoraSnapshot {
  date: string;
  leadTimeH: number;
  deploys: number;
  changeFailRate: number;
  mttrH: number;
}

export interface Activity {
  id: ID;
  type: string;
  message: string;
  at: string;
}

export interface Settings {
  healthWeights: {
    outcome: number;
    delivery: number;
    quality: number;
  };
  thresholds: {
    confidenceAtRisk: number;
    confidenceOff: number;
    gatePassMin: number;
    orphanWorkMaxPct: number;
  };
}

export interface State {
  objectives: Objective[];
  krs: KeyResult[];
  epics: Epic[];
  issues: Issue[];
  gates: QualityGate[];
  dora: DoraSnapshot[];
  activities: Activity[];
  settings: Settings;
}
