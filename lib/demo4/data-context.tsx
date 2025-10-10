"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { z } from "zod";
import type { Issue, Sprint, Team, User, Comment, Activity, AutomationRule } from "./types";
import { mockData } from "./mock-data";
import { toast } from "sonner";

// Validation Schemas
const IssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
  priority: z.enum(["P0", "P1", "P2", "P3"]),
  status: z.enum(["todo", "in_progress", "in_review", "blocked", "done"]),
  assigneeId: z.string().min(1, "Assignee is required"),
  sprintId: z.string().optional(),
  storyPoints: z.number().int().min(0).max(100).optional(),
});

const SprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required").max(100),
  goal: z.string().max(500).optional(),
  start: z.string(),
  end: z.string(),
  status: z.enum(["planned", "active", "completed"]),
  issueIds: z.array(z.string()),
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: "End date must be after start date",
  path: ["end"],
});

interface DataContextType {
  issues: Issue[];
  sprints: Sprint[];
  teams: Team[];
  users: User[];
  comments: Comment[];
  activities: Activity[];
  automationRules: AutomationRule[];
  currentUser: User;
  
  // Issue operations
  addIssue: (issue: Omit<Issue, "id" | "createdAt" | "updatedAt">) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  
  // Sprint operations
  addSprint: (sprint: Omit<Sprint, "id">) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  
  // Team operations
  addTeam: (team: Omit<Team, "id">) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  
  // Comment operations
  addComment: (comment: Omit<Comment, "id" | "createdAt">) => void;
  
  // Activity logging
  logActivity: (activity: Omit<Activity, "id" | "createdAt">) => void;
  
  // Data management
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockData.issues);
  const [sprints, setSprints] = useState<Sprint[]>(mockData.sprints);
  const [teams, setTeams] = useState<Team[]>(mockData.teams);
  const [users] = useState<User[]>(mockData.users);
  const [comments, setComments] = useState<Comment[]>(mockData.comments);
  const [activities, setActivities] = useState<Activity[]>(mockData.activities);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockData.automationRules);
  const currentUser = mockData.currentUser;

  const addIssue = useCallback((issueData: Omit<Issue, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Validate data
      const validated = IssueSchema.parse(issueData);
      
      const newIssue: Issue = {
        ...validated,
        id: `TASK-${Date.now()}`,
        key: `TASK-${issues.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIssues(prev => [...prev, newIssue]);
      logActivity({
        actorId: currentUser.id,
        type: "issue_created",
        targetType: "issue",
        targetId: newIssue.id,
        payload: { title: newIssue.title },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        throw error;
      }
      throw error;
    }
  }, [issues.length, currentUser.id]);

  const updateIssue = useCallback((id: string, updates: Partial<Issue>) => {
    try {
      // Validate updates (partial schema)
      if (updates.title !== undefined || updates.priority !== undefined || updates.status !== undefined) {
        const issue = issues.find(i => i.id === id);
        if (!issue) {
          toast.error("Issue not found");
          return;
        }
        
        const updatedData = { ...issue, ...updates };
        IssueSchema.parse({
          title: updatedData.title,
          description: updatedData.description,
          priority: updatedData.priority,
          status: updatedData.status,
          assigneeId: updatedData.assigneeId,
          sprintId: updatedData.sprintId,
          storyPoints: updatedData.storyPoints,
        });
      }
      
      setIssues(prev => prev.map(issue => 
        issue.id === id 
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue
      ));
      logActivity({
        actorId: currentUser.id,
        type: "issue_updated",
        targetType: "issue",
        targetId: id,
        payload: updates,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        throw error;
      }
      throw error;
    }
  }, [currentUser.id, issues]);

  const deleteIssue = useCallback((id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
    logActivity({
      actorId: currentUser.id,
      type: "issue_deleted",
      targetType: "issue",
      targetId: id,
      payload: {},
    });
  }, [currentUser.id]);

  const addSprint = useCallback((sprintData: Omit<Sprint, "id">) => {
    try {
      // Validate sprint data
      const validated = SprintSchema.parse(sprintData);
      
      const newSprint: Sprint = {
        ...validated,
        id: `sprint-${Date.now()}`,
      };
      setSprints(prev => [...prev, newSprint]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        throw error;
      }
      throw error;
    }
  }, []);

  const updateSprint = useCallback((id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(sprint => 
      sprint.id === id ? { ...sprint, ...updates } : sprint
    ));
  }, []);

  const deleteSprint = useCallback((id: string) => {
    setSprints(prev => prev.filter(sprint => sprint.id !== id));
  }, []);

  const addTeam = useCallback((teamData: Omit<Team, "id">) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
    };
    setTeams(prev => [...prev, newTeam]);
  }, []);

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === id ? { ...team, ...updates } : team
    ));
  }, []);

  const addComment = useCallback((commentData: Omit<Comment, "id" | "createdAt">) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  }, []);

  const logActivity = useCallback((activityData: Omit<Activity, "id" | "createdAt">) => {
    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const exportData = useCallback(() => {
    const data = {
      issues,
      sprints,
      teams,
      comments,
      activities,
      automationRules,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [issues, sprints, teams, comments, activities, automationRules]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.issues) setIssues(data.issues);
      if (data.sprints) setSprints(data.sprints);
      if (data.teams) setTeams(data.teams);
      if (data.comments) setComments(data.comments);
      if (data.activities) setActivities(data.activities);
      if (data.automationRules) setAutomationRules(data.automationRules);
    } catch (error) {
      console.error("Failed to import data:", error);
    }
  }, []);

  const resetData = useCallback(() => {
    setIssues(mockData.issues);
    setSprints(mockData.sprints);
    setTeams(mockData.teams);
    setComments(mockData.comments);
    setActivities(mockData.activities);
    setAutomationRules(mockData.automationRules);
  }, []);

  return (
    <DataContext.Provider
      value={{
        issues,
        sprints,
        teams,
        users,
        comments,
        activities,
        automationRules,
        currentUser,
        addIssue,
        updateIssue,
        deleteIssue,
        addSprint,
        updateSprint,
        deleteSprint,
        addTeam,
        updateTeam,
        addComment,
        logActivity,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
