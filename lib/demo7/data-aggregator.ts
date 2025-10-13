// Data Aggregator for Pulsar Nova
// Integrates data from Atlas (demo), Canis (demo6), and Helix (demo5)

import * as atlasData from '@/lib/demo/mock-data';
import { mockData as canisData } from '@/lib/demo6/mock-data';

// Re-export types
export type { HealthScore, AIInsight } from './types';

// Access Atlas data
const users = (atlasData as any).users || [];
const teams = (atlasData as any).teams || [];
const sprints = (atlasData as any).sprints || [];
const issues = (atlasData as any).issues || [];

// ============================================
// ATLAS DATA EXTRACTION
// ============================================

export function getAtlasMetrics() {
  const activeSprint = sprints.find(s => s.status === 'Active');
  const activeSprintIssues = issues.filter(i => i.sprintId === activeSprint?.id);
  
  const completedSP = activeSprintIssues
    .filter(i => i.status === 'Done')
    .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  
  const totalSP = activeSprintIssues
    .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  
  const deliveryScore = totalSP > 0 ? (completedSP / totalSP) * 100 : 0;
  
  // Calculate velocity from last 6 completed sprints
  const completedSprints = sprints
    .filter(s => s.status === 'Completed')
    .slice(-6);
  
  const velocityData = completedSprints.map(s => ({
    sprintId: s.id,
    sprintName: s.name,
    velocity: s.velocity || 0
  }));
  
  const avgVelocity = velocityData.reduce((sum, v) => sum + v.velocity, 0) / velocityData.length;
  
  return {
    delivery: deliveryScore,
    velocityData,
    avgVelocity,
    activeSprint,
    activeSprintIssues,
    completedSP,
    totalSP
  };
}

export function getBlockedTasks() {
  return issues.filter(i => 
    i.dependencies?.blockedBy && 
    i.dependencies.blockedBy.length > 0 &&
    i.status !== 'Done'
  );
}

export function getTeamMetrics() {
  return teams.map(team => {
    const teamMembers = users.filter(u => u.teamIds?.includes(team.id));
    const teamIssues = issues.filter(i => i.teamId === team.id);
    const completedIssues = teamIssues.filter(i => i.status === 'Done');
    
    const velocity = completedIssues
      .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    
    const throughput = completedIssues.length;
    
    const bugCount = teamIssues.filter(i => i.type === 'Bug' && i.status !== 'Done').length;
    const qualityScore = teamIssues.length > 0 
      ? ((teamIssues.length - bugCount) / teamIssues.length) * 100 
      : 100;
    
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      memberCount: teamMembers.length,
      velocity,
      throughput,
      qualityScore,
      capacity: team.defaultCapacity
    };
  });
}

export function getUserPerformance() {
  return users.slice(0, 10).map(user => {
    const userIssues = issues.filter(i => i.assignee?.id === user.id);
    const completedIssues = userIssues.filter(i => i.status === 'Done');
    
    const velocity = completedIssues
      .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    
    const totalHours = completedIssues
      .reduce((sum, i) => sum + (i.actualHours || 0), 0);
    
    const utilization = user.capacity > 0 
      ? Math.min((totalHours / (user.capacity * 8 * 10)) * 100, 150) 
      : 0;
    
    const bugCount = userIssues.filter(i => i.type === 'Bug').length;
    const qualityScore = userIssues.length > 0 
      ? ((userIssues.length - bugCount) / userIssues.length) * 100 
      : 100;
    
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      teamId: user.primaryTeamId,
      velocity,
      utilization: Math.round(utilization),
      qualityScore: Math.round(qualityScore),
      tasksCompleted: completedIssues.length,
      tasksInProgress: userIssues.filter(i => i.status === 'In Progress').length
    };
  });
}

// ============================================
// CANIS DATA EXTRACTION
// ============================================

export function getCanisMetrics() {
  const findings = canisData.findings;
  const highSeverityFindings = findings.filter(f => f.severity === 'high').length;
  const totalFindings = findings.length;
  
  const qualityScore = totalFindings > 0 
    ? ((totalFindings - highSeverityFindings) / totalFindings) * 100 
    : 100;
  
  return {
    quality: qualityScore,
    findings,
    highSeverityCount: highSeverityFindings,
    totalFindings
  };
}

export function getReleaseData() {
  return canisData.releases.map(release => ({
    id: release.id,
    environment: release.environment,
    deployedAt: release.deployedAt,
    status: release.status,
    issueCount: release.issues.length,
    commitCount: release.commits.length,
    issues: release.issues
  }));
}

// ============================================
// HELIX DATA EXTRACTION (Simulated)
// ============================================

export function getHelixMetrics() {
  // Simulate deployment metrics based on Canis releases
  const releases = canisData.releases;
  const deployedReleases = releases.filter(r => r.status === 'Deployed');
  
  const successRate = deployedReleases.length > 0 
    ? (deployedReleases.length / releases.length) * 100 
    : 100;
  
  return {
    stability: successRate,
    deploymentCount: releases.length,
    successfulDeployments: deployedReleases.length,
    avgBuildTime: 195,
    avgDeployTime: 265,
    errorRate: 1.2
  };
}

// ============================================
// AGGREGATED HEALTH SCORE
// ============================================

export function aggregateHealthScore() {
  const atlasData = getAtlasMetrics();
  const canisData = getCanisMetrics();
  const helixData = getHelixMetrics();
  
  const overall = Math.round(
    atlasData.delivery * 0.4 + 
    canisData.quality * 0.3 + 
    helixData.stability * 0.3
  );
  
  return {
    overall,
    breakdown: {
      outcome: Math.round(canisData.quality * 0.85), // Slightly adjusted for OKR context
      delivery: Math.round(atlasData.delivery),
      quality: Math.round(canisData.quality * 0.8) // Adjusted for quality gates
    }
  };
}

// ============================================
// AI INSIGHTS GENERATION
// ============================================

export interface AIInsight {
  icon: string;
  title: string;
  description: string;
  confidence: number;
  type: 'warning' | 'info' | 'success';
  source: 'atlas' | 'canis' | 'helix' | 'cross-system';
}

export function generateAIInsights(): AIInsight[] {
  const insights: AIInsight[] = [];
  
  // Detect blockers from Atlas
  const blockedTasks = getBlockedTasks();
  if (blockedTasks.length > 0) {
    const blocker = blockedTasks[0];
    const blockingTask = blocker.dependencies?.blockedBy?.[0];
    const affectedCount = issues.filter(i => 
      i.dependencies?.blockedBy?.includes(blockingTask || '')
    ).length;
    
    insights.push({
      icon: '⚠️',
      title: 'Critical Path Blocker',
      description: `${blockingTask} blocking ${affectedCount} tasks`,
      confidence: 100,
      type: 'warning',
      source: 'atlas'
    });
  }
  
  // Detect overallocation from Atlas
  const overallocatedUsers = users.filter(u => {
    const userIssues = issues.filter(i => 
      i.assignee?.id === u.id && 
      i.status === 'In Progress'
    );
    const totalSP = userIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    return totalSP > u.capacity * 1.2;
  });
  
  if (overallocatedUsers.length > 0) {
    const user = overallocatedUsers[0];
    insights.push({
      icon: '👤',
      title: 'Resource Overallocation',
      description: `${user.name} at ${Math.round((user.capacity * 1.5))}% capacity`,
      confidence: 100,
      type: 'warning',
      source: 'atlas'
    });
  }
  
  // Velocity forecast from Atlas
  const atlasMetrics = getAtlasMetrics();
  const velocityTrend = atlasMetrics.velocityData.slice(-3);
  const avgRecent = velocityTrend.reduce((sum, v) => sum + v.velocity, 0) / velocityTrend.length;
  const forecast = {
    min: Math.round(avgRecent * 0.9),
    max: Math.round(avgRecent * 1.1)
  };
  
  insights.push({
    icon: '📈',
    title: 'Velocity Forecast',
    description: `Next sprint: ${forecast.min}-${forecast.max} SP`,
    confidence: 85,
    type: 'info',
    source: 'atlas'
  });
  
  // Quality issues from Canis
  const canisMetrics = getCanisMetrics();
  if (canisMetrics.highSeverityCount > 3) {
    insights.push({
      icon: '🔍',
      title: 'Documentation Debt',
      description: `${canisMetrics.highSeverityCount} high severity findings detected`,
      confidence: 95,
      type: 'warning',
      source: 'canis'
    });
  }
  
  // Cross-system insight
  const techDebtIssues = issues.filter(i => 
    i.status !== 'Done' && 
    (i.type === 'Chore' || i.title.toLowerCase().includes('refactor'))
  );
  const techDebtSP = techDebtIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  
  if (techDebtSP > 30) {
    insights.push({
      icon: '🔧',
      title: 'Technical Debt Alert',
      description: `${techDebtSP} SP of tech debt accumulated`,
      confidence: 92,
      type: 'warning',
      source: 'cross-system'
    });
  }
  
  return insights.slice(0, 3); // Return top 3 insights
}

// ============================================
// BURNDOWN CALCULATION
// ============================================

export function calculateBurndown() {
  const atlasMetrics = getAtlasMetrics();
  const { activeSprint, activeSprintIssues, totalSP } = atlasMetrics;
  
  if (!activeSprint) return { ideal: [], actual: [] };
  
  const sprintDays = 14;
  const today = new Date();
  const startDate = new Date(activeSprint.startDate);
  const daysPassed = Math.min(
    Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    sprintDays
  );
  
  // Ideal burndown
  const ideal = Array.from({ length: sprintDays + 1 }, (_, day) => ({
    day,
    remaining: Math.round(totalSP - (totalSP / sprintDays) * day)
  }));
  
  // Actual burndown (simulate daily progress)
  const actual: { day: number; remaining: number }[] = [];
  let remainingSP = totalSP;
  
  for (let day = 0; day <= daysPassed; day++) {
    // Simulate some variance in daily completion
    const dailyCompletion = (totalSP / sprintDays) * (0.8 + Math.random() * 0.4);
    remainingSP = Math.max(0, remainingSP - dailyCompletion);
    actual.push({ day, remaining: Math.round(remainingSP) });
  }
  
  return { ideal, actual, totalSP, daysPassed, sprintDays };
}

// ============================================
// QUALITY GATES
// ============================================

export function getQualityGates() {
  const bugIssues = issues.filter(i => i.type === 'Bug');
  const totalIssues = issues.length;
  const bugDensity = (bugIssues.length / totalIssues) * 10;
  
  const techDebtIssues = issues.filter(i => 
    i.type === 'Chore' || i.title.toLowerCase().includes('refactor')
  );
  const techDebtRatio = (techDebtIssues.length / totalIssues) * 100;
  
  const helixMetrics = getHelixMetrics();
  const codeCoverage = 87;
  const testPassRate = Math.round((1 - helixMetrics.errorRate / 100) * 100);
  
  return [
    {
      name: 'Code Coverage',
      value: `${codeCoverage}%`,
      target: '85%',
      status: codeCoverage >= 85 ? 'pass' : 'fail',
      actual: codeCoverage
    },
    {
      name: 'Bug Density',
      value: bugDensity.toFixed(1),
      target: '<2.0',
      status: bugDensity < 2.0 ? 'pass' : 'fail',
      actual: bugDensity
    },
    {
      name: 'Test Pass Rate',
      value: `${testPassRate}%`,
      target: '90%',
      status: testPassRate >= 90 ? 'pass' : 'fail',
      actual: testPassRate
    },
    {
      name: 'Tech Debt Ratio',
      value: `${Math.round(techDebtRatio)}%`,
      target: '<15%',
      status: techDebtRatio < 15 ? 'pass' : 'fail',
      actual: techDebtRatio
    },
    {
      name: 'Code Review Time',
      value: '1.8d',
      target: '<2d',
      status: 'pass',
      actual: 1.8
    },
    {
      name: 'Security Score',
      value: 'A',
      target: 'A/B',
      status: 'pass',
      actual: 100
    }
  ];
}

// ============================================
// OKR DATA WITH REAL LINKS
// ============================================

export function getOKRData() {
  const mobileTeam = teams.find(t => t.id === 'team-3');
  const mobileIssues = issues.filter(i => i.teamId === 'team-3');
  const mobileCompleted = mobileIssues.filter(i => i.status === 'Done');
  const mobileProgress = mobileIssues.length > 0 
    ? Math.round((mobileCompleted.length / mobileIssues.length) * 100) 
    : 0;
  
  const frontendTeam = teams.find(t => t.id === 'team-1');
  const frontendIssues = issues.filter(i => i.teamId === 'team-1');
  const frontendCompleted = frontendIssues.filter(i => i.status === 'Done');
  const frontendProgress = frontendIssues.length > 0 
    ? Math.round((frontendCompleted.length / frontendIssues.length) * 100) 
    : 0;
  
  const backendTeam = teams.find(t => t.id === 'team-2');
  const backendIssues = issues.filter(i => i.teamId === 'team-2');
  const backendCompleted = backendIssues.filter(i => i.status === 'Done');
  const backendProgress = backendIssues.length > 0 
    ? Math.round((backendCompleted.length / backendIssues.length) * 100) 
    : 0;
  
  const teamOKRs = [
    {
      team: mobileTeam?.name || 'Mobile & Platform',
      title: 'Launch Mobile MVP',
      progress: mobileProgress,
      status: mobileProgress > 60 ? 'On Track' : 'Blocked',
      type: mobileProgress > 60 ? 'success' : 'danger',
      krs: 3,
      linkedIssues: mobileIssues.slice(0, 5).map(i => i.id),
      issueCount: mobileIssues.length
    },
    {
      team: frontendTeam?.name || 'Frontend Squad',
      title: 'User Experience Enhancement',
      progress: frontendProgress,
      status: frontendProgress > 60 ? 'On Track' : 'At Risk',
      type: frontendProgress > 60 ? 'success' : 'warning',
      krs: 4,
      linkedIssues: frontendIssues.slice(0, 5).map(i => i.id),
      issueCount: frontendIssues.length
    },
    {
      team: backendTeam?.name || 'Backend Core',
      title: 'API Performance & Scalability',
      progress: backendProgress,
      status: 'On Track',
      type: 'success',
      krs: 3,
      linkedIssues: backendIssues.slice(0, 5).map(i => i.id),
      issueCount: backendIssues.length
    }
  ];
  
  const companyProgress = Math.round(
    teamOKRs.reduce((sum, okr) => sum + okr.progress, 0) / teamOKRs.length
  );
  
  return {
    companyOKR: {
      title: 'Achieve Product-Market Fit',
      progress: companyProgress,
      quarter: 'Q4 2024'
    },
    teamOKRs
  };
}
