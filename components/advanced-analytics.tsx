// components/advanced-analytics.tsx
import React, { useMemo } from 'react';
import type { Issue, Sprint, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdvancedAnalyticsProps {
  issues: Issue[];
  sprints: Sprint[];
  teamMembers: User[];
}

export function AdvancedAnalytics({ issues, sprints, teamMembers }: AdvancedAnalyticsProps) {
  // Oblicz metryki z danych w localStorage
  const velocityData = useMemo(() => {
    return sprints.slice(-6).map(sprint => {
      const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id);
      const completedPoints = sprintIssues
        .filter(issue => issue.status === 'Done')
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

      return {
        name: sprint.name,
        velocity: completedPoints,
        planned: sprint.capacity || 0
      };
    });
  }, [issues, sprints]);

  // Predykcja velocity (prosta regresja liniowa)
  const predictedVelocity = useMemo(() => {
    if (velocityData.length < 2) return 0;

    const recent = velocityData.slice(-3);
    const avg = recent.reduce((sum, item) => sum + item.velocity, 0) / recent.length;

    // Prosta predykcja - średnia z ostatnich 3 sprintów
    return Math.round(avg);
  }, [velocityData]);

  // Metryki zespołu
  const teamMetrics = useMemo(() => {
    return teamMembers.map(member => {
      const memberTasks = issues.filter(task => task.assignee === member.id);
      const completedTasks = memberTasks.filter(task => task.status === 'Done');
      const completionRate = memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0;

      return {
        name: member.name,
        tasks: memberTasks.length,
        completed: completedTasks.length,
        completionRate: Math.round(completionRate)
      };
    });
  }, [teamMembers, issues]);

  return (
    <div className="space-y-6">
      {/* Velocity Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Velocity Trend & Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="planned" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm">
              <strong>Predicted Velocity:</strong> {predictedVelocity} points
              (based on last 3 sprints average)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{predictedVelocity}</div>
            <div className="text-sm text-muted-foreground">Predicted Sprint Velocity</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {teamMembers.length > 0 ? Math.round(teamMetrics.reduce((sum, m) => sum + m.completionRate, 0) / teamMembers.length) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Average Completion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {issues.filter(i => i.status === 'Todo').length}
            </div>
            <div className="text-sm text-muted-foreground">Backlog Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


