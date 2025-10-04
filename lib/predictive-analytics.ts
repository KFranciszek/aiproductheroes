// lib/predictive-analytics.ts
import type { Sprint, Issue, User } from "@/types"

export class PredictiveAnalytics {
  static calculateVelocityTrend(sprints: Sprint[]): number {
    if (sprints.length < 2) return 0;

    // Prosta regresja liniowa dla trendu velocity
    const recentSprints = sprints.slice(-5);
    const velocities = recentSprints.map(s => s.velocity || 0);

    if (velocities.length < 2) return velocities[0] || 0;

    // Oblicz trend (prosta implementacja)
    const n = velocities.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = velocities.reduce((a, b) => a + b, 0);
    const sumXY = velocities.reduce((sum, vel, i) => sum + vel * (i + 1), 0);
    const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predykcja dla następnego sprintu
    return Math.round(slope * (n + 1) + intercept);
  }

  static estimateSprintCapacity(teamMembers: User[], sprintDays: number): number {
    const totalCapacity = teamMembers.reduce((sum, member) => {
      return sum + (member.capacity || 8);
    }, 0);

    return totalCapacity * sprintDays;
  }

  static suggestTaskAssignments(tasks: Issue[], teamMembers: User[]): Record<string, string[]> {
    const suggestions: Record<string, string[]> = {};

    // Grupuj zadania według umiejętności wymaganych
    const skillGroups = this.groupTasksBySkills(tasks);

    // Rozkładaj zadania na członków zespołu według ich umiejętności
    Object.entries(skillGroups).forEach(([skill, skillTasks]) => {
      const suitableMembers = teamMembers.filter(member =>
        member.skills?.includes(skill) || member.role === 'Developer'
      );

      if (suitableMembers.length > 0) {
        suggestions[skill] = skillTasks.map(task => {
          // Prosty algorytm round-robin
          const memberIndex = skillTasks.indexOf(task) % suitableMembers.length;
          return suitableMembers[memberIndex].id;
        });
      }
    });

    return suggestions;
  }

  private static groupTasksBySkills(tasks: Issue[]): Record<string, Issue[]> {
    // Prosta heurystyka - w rzeczywistości użyj AI lub analizy treści
    return {
      'Frontend': tasks.filter(task =>
        task.title.toLowerCase().includes('ui') ||
        task.title.toLowerCase().includes('frontend')
      ),
      'Backend': tasks.filter(task =>
        task.title.toLowerCase().includes('api') ||
        task.title.toLowerCase().includes('backend')
      ),
      'Design': tasks.filter(task =>
        task.title.toLowerCase().includes('design') ||
        task.title.toLowerCase().includes('ui')
      )
    };
  }
}


