// Mock Data for Pulsar Nova
// Standalone data that doesn't depend on Atlas/Canis/Helix

export const novaMockData = {
  // Active Blockers
  activeBlockers: [
    { 
      id: 'TSK-1490',
      title: 'Refaktoryzacja API', 
      priority: 'P1', 
      blockedBy: 'TSK-1489',
      affectedTasks: 3 
    },
    { 
      id: 'TSK-1495',
      title: 'Walidacja rejestracji', 
      priority: 'P0', 
      blockedBy: 'TSK-1490',
      affectedTasks: 2 
    },
    { 
      id: 'TSK-1498',
      title: 'Integracja rejestracji', 
      priority: 'P1', 
      blockedBy: 'TSK-1490',
      affectedTasks: 1 
    },
    { 
      id: 'TSK-1503',
      title: 'Błąd logowania', 
      priority: 'P1', 
      blockedBy: 'TSK-1490',
      affectedTasks: 2 
    },
    { 
      id: 'TSK-1512',
      title: 'Problem z bazą danych', 
      priority: 'P2', 
      blockedBy: 'TSK-1505',
      affectedTasks: 1 
    },
  ],

  // AI Insights
  aiInsights: [
    {
      icon: '⚠️',
      title: 'Critical Path Blocker',
      description: 'TSK-1490 blocking 5 tasks in current sprint',
      confidence: 100,
      type: 'warning' as const,
      source: 'atlas' as const,
    },
    {
      icon: '👤',
      title: 'Resource Overallocation',
      description: 'Jan Kowalski at 145% capacity this sprint',
      confidence: 100,
      type: 'warning' as const,
      source: 'atlas' as const,
    },
    {
      icon: '📈',
      title: 'Velocity Forecast',
      description: 'Next sprint: 38-44 SP based on 6-sprint trend',
      confidence: 85,
      type: 'info' as const,
      source: 'atlas' as const,
    },
    {
      icon: '🔍',
      title: 'Documentation Debt',
      description: '8 high severity findings in requirements',
      confidence: 95,
      type: 'warning' as const,
      source: 'canis' as const,
    },
    {
      icon: '🔧',
      title: 'Technical Debt Alert',
      description: '34 SP of tech debt accumulated',
      confidence: 92,
      type: 'warning' as const,
      source: 'cross-system' as const,
    },
  ],

  // Team Velocity Data
  teamVelocity: [
    { sprintId: 'sprint-54', sprintName: 'Sprint 54', velocity: 38 },
    { sprintId: 'sprint-55', sprintName: 'Sprint 55', velocity: 45 },
    { sprintId: 'sprint-56', sprintName: 'Sprint 56', velocity: 41 },
    { sprintId: 'sprint-57', sprintName: 'Sprint 57', velocity: 48 },
    { sprintId: 'sprint-58', sprintName: 'Sprint 58', velocity: 39 },
    { sprintId: 'sprint-59', sprintName: 'Sprint 59', velocity: 41 },
  ],

  // Team Comparison Data
  teamComparison: [
    {
      id: 'team-1',
      name: 'Frontend Squad',
      color: '#3B82F6',
      memberCount: 7,
      velocity: 45,
      throughput: 23,
      qualityScore: 94,
      capacity: 80,
    },
    {
      id: 'team-2',
      name: 'Backend Core',
      color: '#10B981',
      memberCount: 8,
      velocity: 52,
      throughput: 28,
      qualityScore: 91,
      capacity: 95,
    },
    {
      id: 'team-3',
      name: 'Mobile & Platform',
      color: '#8B5CF6',
      memberCount: 5,
      velocity: 38,
      throughput: 18,
      qualityScore: 89,
      capacity: 55,
    },
  ],

  // Top Contributors
  topContributors: [
    {
      id: 'user-1',
      name: 'Jan Kowalski',
      avatar: 'https://i.pravatar.cc/150?u=jan-kowalski',
      role: 'Senior Developer',
      teamId: 'team-2',
      velocity: 21,
      utilization: 95,
      qualityScore: 96,
      tasksCompleted: 12,
      tasksInProgress: 3,
    },
    {
      id: 'user-2',
      name: 'Anna Nowak',
      avatar: 'https://i.pravatar.cc/150?u=anna-nowak',
      role: 'Frontend Developer',
      teamId: 'team-1',
      velocity: 18,
      utilization: 88,
      qualityScore: 98,
      tasksCompleted: 11,
      tasksInProgress: 2,
    },
    {
      id: 'user-3',
      name: 'Piotr Wiśniewski',
      avatar: 'https://i.pravatar.cc/150?u=piotr-wisniewski',
      role: 'Full-stack Developer',
      teamId: 'team-1',
      velocity: 16,
      utilization: 82,
      qualityScore: 94,
      tasksCompleted: 10,
      tasksInProgress: 2,
    },
    {
      id: 'user-4',
      name: 'Maria Kowalczyk',
      avatar: 'https://i.pravatar.cc/150?u=maria-kowalczyk',
      role: 'Backend Developer',
      teamId: 'team-2',
      velocity: 15,
      utilization: 78,
      qualityScore: 97,
      tasksCompleted: 9,
      tasksInProgress: 2,
    },
    {
      id: 'user-5',
      name: 'Tomasz Lewandowski',
      avatar: 'https://i.pravatar.cc/150?u=tomasz-lewandowski',
      role: 'Mobile Developer',
      teamId: 'team-3',
      velocity: 14,
      utilization: 85,
      qualityScore: 92,
      tasksCompleted: 8,
      tasksInProgress: 3,
    },
    {
      id: 'user-6',
      name: 'Katarzyna Wójcik',
      avatar: 'https://i.pravatar.cc/150?u=katarzyna-wojcik',
      role: 'QA Engineer',
      teamId: 'team-2',
      velocity: 13,
      utilization: 75,
      qualityScore: 99,
      tasksCompleted: 10,
      tasksInProgress: 1,
    },
    {
      id: 'user-7',
      name: 'Michał Kamiński',
      avatar: 'https://i.pravatar.cc/150?u=michal-kaminski',
      role: 'DevOps Engineer',
      teamId: 'team-2',
      velocity: 12,
      utilization: 90,
      qualityScore: 93,
      tasksCompleted: 7,
      tasksInProgress: 2,
    },
    {
      id: 'user-8',
      name: 'Agnieszka Zielińska',
      avatar: 'https://i.pravatar.cc/150?u=agnieszka-zielinska',
      role: 'UI/UX Designer',
      teamId: 'team-1',
      velocity: 11,
      utilization: 70,
      qualityScore: 95,
      tasksCompleted: 8,
      tasksInProgress: 1,
    },
    {
      id: 'user-9',
      name: 'Łukasz Nowicki',
      avatar: 'https://i.pravatar.cc/150?u=lukasz-nowicki',
      role: 'Backend Developer',
      teamId: 'team-2',
      velocity: 10,
      utilization: 68,
      qualityScore: 91,
      tasksCompleted: 6,
      tasksInProgress: 2,
    },
    {
      id: 'user-10',
      name: 'Monika Pawlak',
      avatar: 'https://i.pravatar.cc/150?u=monika-pawlak',
      role: 'Frontend Developer',
      teamId: 'team-1',
      velocity: 9,
      utilization: 65,
      qualityScore: 90,
      tasksCompleted: 7,
      tasksInProgress: 1,
    },
  ],

  // Recent Activity
  recentActivity: [
    {
      user: 'Jan Kowalski',
      action: 'completed',
      item: 'TSK-1520',
      time: '5 min ago',
      avatar: 'https://i.pravatar.cc/150?u=jan-kowalski',
    },
    {
      user: 'Anna Nowak',
      action: 'started',
      item: 'TSK-1521',
      time: '12 min ago',
      avatar: 'https://i.pravatar.cc/150?u=anna-nowak',
    },
    {
      user: 'Piotr Wiśniewski',
      action: 'commented on',
      item: 'TSK-1495',
      time: '23 min ago',
      avatar: 'https://i.pravatar.cc/150?u=piotr-wisniewski',
    },
    {
      user: 'Maria Kowalczyk',
      action: 'reviewed',
      item: 'TSK-1510',
      time: '1 hour ago',
      avatar: 'https://i.pravatar.cc/150?u=maria-kowalczyk',
    },
    {
      user: 'Tomasz Lewandowski',
      action: 'deployed',
      item: 'R-103',
      time: '2 hours ago',
      avatar: 'https://i.pravatar.cc/150?u=tomasz-lewandowski',
    },
  ],

  // Risk Analysis
  risks: [
    {
      risk: 'Scope Creep',
      level: 'Medium',
      impact: 'High',
      probability: 60,
      color: 'amber',
    },
    {
      risk: 'Resource Availability',
      level: 'Low',
      impact: 'Medium',
      probability: 30,
      color: 'green',
    },
    {
      risk: 'Technical Debt',
      level: 'High',
      impact: 'High',
      probability: 75,
      color: 'red',
    },
    {
      risk: 'Dependencies',
      level: 'Medium',
      impact: 'High',
      probability: 55,
      color: 'amber',
    },
  ],

  // OKR Timeline
  okrTimeline: [
    { quarter: 'Q4 2024', status: 'current', progress: 65, objectives: 3 },
    { quarter: 'Q3 2024', status: 'completed', progress: 87, objectives: 3 },
    { quarter: 'Q2 2024', status: 'completed', progress: 92, objectives: 4 },
    { quarter: 'Q1 2024', status: 'completed', progress: 78, objectives: 3 },
  ],

  // Velocity Trend
  velocityTrend: {
    current: 41,
    average: 41,
    forecast: 43,
    confidence: 85,
  },

  // Flow Efficiency
  flowEfficiency: {
    activeWork: 65,
    waitTime: 25,
    blockedTime: 10,
  },

  // WIP Limits
  wipLimits: [
    { stage: 'To Do', current: 15, limit: 20, color: 'green' },
    { stage: 'In Progress', current: 12, limit: 10, color: 'red' },
    { stage: 'In Review', current: 8, limit: 8, color: 'amber' },
    { stage: 'Done', current: 18, limit: null, color: 'gray' },
  ],

  // Code Quality Trends
  codeQualityTrends: [
    { metric: 'Code Smells', value: 23, trend: '-15%', color: 'green' },
    { metric: 'Duplications', value: '3.2%', trend: '-8%', color: 'green' },
    { metric: 'Complexity', value: 'Medium', trend: 'stable', color: 'amber' },
    { metric: 'Maintainability', value: 'A', trend: '+5%', color: 'green' },
  ],

  // Security Scan
  securityScan: [
    { severity: 'Critical', count: 0, color: 'green' },
    { severity: 'High', count: 2, color: 'red' },
    { severity: 'Medium', count: 8, color: 'amber' },
    { severity: 'Low', count: 15, color: 'gray' },
  ],

  // Compliance Status
  complianceStatus: [
    { standard: 'OWASP Top 10', status: 'Compliant', score: 95 },
    { standard: 'GDPR', status: 'Compliant', score: 100 },
    { standard: 'SOC 2', status: 'In Progress', score: 78 },
    { standard: 'ISO 27001', status: 'Compliant', score: 92 },
  ],

  // Collaboration Metrics
  collaborationMetrics: [
    { metric: 'Code Reviews', value: 47, unit: 'this week', icon: '👀' },
    { metric: 'PR Comments', value: 156, unit: 'this week', icon: '💬' },
    { metric: 'Pair Programming', value: '12h', unit: 'this week', icon: '👥' },
    { metric: 'Knowledge Sharing', value: 8, unit: 'sessions', icon: '📚' },
  ],

  // Team Satisfaction
  teamSatisfaction: [
    { category: 'Work-Life Balance', score: 8.5, max: 10 },
    { category: 'Team Collaboration', score: 9.2, max: 10 },
    { category: 'Tools & Resources', score: 7.8, max: 10 },
    { category: 'Career Growth', score: 8.1, max: 10 },
  ],

  // Skill Distribution
  skillDistribution: [
    { skill: 'Frontend', members: 7, color: 'blue' },
    { skill: 'Backend', members: 8, color: 'green' },
    { skill: 'DevOps', members: 3, color: 'purple' },
    { skill: 'Mobile', members: 5, color: 'pink' },
    { skill: 'Design', members: 2, color: 'amber' },
  ],

  // Capacity Planning
  capacityPlanning: [
    { week: 'Week 42', available: 200, planned: 185, utilization: 92.5 },
    { week: 'Week 43', available: 200, planned: 210, utilization: 105 },
    { week: 'Week 44', available: 180, planned: 165, utilization: 91.7 },
    { week: 'Week 45', available: 200, planned: 175, utilization: 87.5 },
  ],

  // Story Breakdown by Type
  storyBreakdownByType: [
    { type: 'Features', count: 12, percent: 45, color: 'bg-blue-500' },
    { type: 'Bugs', count: 8, percent: 30, color: 'bg-red-500' },
    { type: 'Tech Debt', count: 7, percent: 25, color: 'bg-amber-500' },
  ],

  // Bug Severity Distribution
  bugSeverity: [
    { severity: 'Critical', count: 2, color: 'bg-red-500' },
    { severity: 'High', count: 8, color: 'bg-orange-500' },
    { severity: 'Medium', count: 23, color: 'bg-amber-500' },
    { severity: 'Low', count: 14, color: 'bg-gray-400' },
  ],

  // Technical Debt Breakdown
  techDebtBreakdown: [
    { priority: 'Must Fix', count: 5, effort: '12 SP', color: 'border-red-500' },
    { priority: 'Should Fix', count: 11, effort: '18 SP', color: 'border-amber-500' },
    { priority: 'Nice to Fix', count: 7, effort: '4 SP', color: 'border-gray-400' },
  ],

  // Test Coverage by Module
  testCoverageByModule: [
    { module: 'Auth Module', coverage: 95, color: 'bg-green-500' },
    { module: 'Payment Module', coverage: 78, color: 'bg-amber-500' },
    { module: 'Dashboard', coverage: 92, color: 'bg-green-500' },
  ],

  // Cycle Time & Lead Time
  timeMetrics: {
    cycleTime: 4.2,
    leadTime: 8.5,
    avgResolutionTime: 3.2,
  },

  // Sprint Health Indicators
  sprintHealth: {
    riskLevel: 'HIGH',
    daysRemaining: 8,
    completionRate: 40,
  },
};

// Helper function to get mock data
export function getNovaMockData() {
  return novaMockData;
}

// Specific getters for different sections
export function getActiveBlockers() {
  return novaMockData.activeBlockers;
}

export function getAIInsightsMock() {
  return novaMockData.aiInsights;
}

export function getTeamVelocity() {
  return novaMockData.teamVelocity;
}

export function getTeamComparison() {
  return novaMockData.teamComparison;
}

export function getTopContributors() {
  return novaMockData.topContributors;
}

export function getRecentActivity() {
  return novaMockData.recentActivity;
}

export function getRiskAnalysis() {
  return novaMockData.risks;
}

export function getOKRTimeline() {
  return novaMockData.okrTimeline;
}

export function getFlowEfficiency() {
  return novaMockData.flowEfficiency;
}

export function getWIPLimits() {
  return novaMockData.wipLimits;
}

export function getCodeQualityTrends() {
  return novaMockData.codeQualityTrends;
}

export function getSecurityScan() {
  return novaMockData.securityScan;
}

export function getComplianceStatus() {
  return novaMockData.complianceStatus;
}

export function getCollaborationMetrics() {
  return novaMockData.collaborationMetrics;
}

export function getTeamSatisfaction() {
  return novaMockData.teamSatisfaction;
}

export function getSkillDistribution() {
  return novaMockData.skillDistribution;
}

export function getCapacityPlanning() {
  return novaMockData.capacityPlanning;
}

export function getStoryBreakdown() {
  return {
    byType: novaMockData.storyBreakdownByType,
    bySeverity: novaMockData.bugSeverity,
  };
}

export function getTechDebtBreakdown() {
  return novaMockData.techDebtBreakdown;
}

export function getTestCoverage() {
  return {
    overall: 87,
    byModule: novaMockData.testCoverageByModule,
    trend: '+2%',
  };
}

export function getTimeMetrics() {
  return novaMockData.timeMetrics;
}
