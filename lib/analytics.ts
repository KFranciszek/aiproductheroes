import type { Sprint, Issue, IssueStatus } from "@/types";

export interface BurndownDataPoint {
  day: string;
  remaining: number;
  ideal: number;
}

/**
 * Calculates the number of days between two dates, inclusive.
 */
function daysBetween(start: Date, end: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay)) + 1;
}

/**
 * Generates burndown chart data for a given sprint.
 * @param sprint The sprint to analyze.
 * @param issues The list of issues associated with the sprint.
 * @returns An array of data points for the burndown chart.
 */
export function generateBurndownData(sprint: Sprint, issues: Issue[]): BurndownDataPoint[] {
  if (!sprint || issues.length === 0) {
    return [];
  }

  const { startDate, endDate } = sprint;
  const sprintDurationInDays = daysBetween(startDate, endDate);
  const totalStoryPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

  const burndownData: BurndownDataPoint[] = [];

  let remainingPoints = totalStoryPoints;
  const idealPointsPerDay = totalStoryPoints / (sprintDurationInDays - 1);

  for (let i = 0; i < sprintDurationInDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const pointsCompletedOnThisDay = issues
      .filter(issue => {
        const historyEntry = issue.statusHistory?.find(h => h.status === 'Done');
        if (!historyEntry) return false;
        const completionDate = new Date(historyEntry.date);
        return (
          completionDate.getFullYear() === currentDate.getFullYear() &&
          completionDate.getMonth() === currentDate.getMonth() &&
          completionDate.getDate() === currentDate.getDate()
        );
      })
      .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

    remainingPoints -= pointsCompletedOnThisDay;

    // Ensure remaining points don't go below zero
    remainingPoints = Math.max(0, remainingPoints);

    burndownData.push({
      day: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      remaining: remainingPoints,
      ideal: Math.max(0, totalStoryPoints - idealPointsPerDay * i),
    });
  }

  return burndownData;
}


