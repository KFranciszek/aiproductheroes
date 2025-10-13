// Type definitions for Pulsar Nova

export interface HealthScore {
  overall: number;
  breakdown: {
    outcome: number;
    delivery: number;
    quality: number;
  };
}

export interface AIInsight {
  icon: string;
  title: string;
  description: string;
  confidence: number;
  type: 'warning' | 'info' | 'success';
  source: 'atlas' | 'canis' | 'helix' | 'cross-system';
}

export interface TeamMetric {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  velocity: number;
  throughput: number;
  qualityScore: number;
  capacity: number;
}

export interface UserPerformance {
  id: string;
  name: string;
  avatar: string;
  role: string;
  teamId?: string;
  velocity: number;
  utilization: number;
  qualityScore: number;
  tasksCompleted: number;
  tasksInProgress: number;
}

export interface QualityGate {
  name: string;
  value: string;
  target: string;
  status: 'pass' | 'fail';
  actual: number;
}

export interface BurndownData {
  ideal: { day: number; remaining: number }[];
  actual: { day: number; remaining: number }[];
  totalSP: number;
  daysPassed: number;
  sprintDays: number;
}

export interface OKRData {
  companyOKR: {
    title: string;
    progress: number;
    quarter: string;
  };
  teamOKRs: {
    team: string;
    title: string;
    progress: number;
    status: string;
    type: 'success' | 'warning' | 'danger';
    krs: number;
    linkedIssues: string[];
    issueCount: number;
  }[];
}
