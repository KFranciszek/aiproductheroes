"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  ChatThread,
  GeneratedStory,
  GeneratedDataset,
  Finding,
  Release,
  Project,
  SyncStatus,
} from "./types";
import { mockData } from "./mock-data";

interface DataContextType {
  // State
  currentProject: Project;
  chatThreads: ChatThread[];
  activeThreadId: string | null;
  generatedStories: GeneratedStory[];
  testDatasets: GeneratedDataset[];
  findings: Finding[];
  releases: Release[];
  syncStatus: SyncStatus;

  // Chat operations
  setActiveThread: (id: string) => void;
  addMessageToThread: (threadId: string, role: 'user' | 'ai', content: string) => void;
  createNewThread: (title: string, initialMessage: string) => void;
  deleteThread: (threadId: string) => void;

  // Story operations
  generateStories: (persona: string, goal: string) => Promise<void>;
  clearStories: () => void;
  refineStory: (storyId: string, updates: Partial<GeneratedStory>) => void;
  exportStory: (storyId: string, format: 'jira' | 'azure' | 'linear') => Promise<string>;
  resolveConflict: (storyId: string, resolution: 'keep' | 'merge' | 'discard') => void;

  // Test data operations
  generateTestData: (schema: string, recordCount: number) => Promise<void>;
  clearTestData: () => void;
  updateSchema: (schema: string) => void;
  exportData: (format: 'json' | 'csv' | 'sql') => void;

  // Findings operations
  verifyRequirements: () => Promise<void>;
  createTaskFromFinding: (findingId: string) => Promise<string>;
  dismissFinding: (findingId: string) => void;

  // Release operations
  answerReleaseQuestion: (releaseId: string, question: string) => Promise<string>;
  getACCoverage: (releaseId: string) => any[];

  // Sync operations
  updateSyncStatus: (status: Partial<SyncStatus>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [currentProject] = useState<Project>(mockData.currentProject);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(mockData.chatThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    mockData.chatThreads[0]?.id || null
  );
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [testDatasets, setTestDatasets] = useState<GeneratedDataset[]>([]);
  const [findings, setFindings] = useState<Finding[]>(mockData.findings);
  const [releases] = useState<Release[]>(mockData.releases);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(mockData.syncStatus);

  const setActiveThread = useCallback((id: string) => {
    setActiveThreadId(id);
  }, []);

  const addMessageToThread = useCallback(async (threadId: string, role: 'user' | 'ai', content: string) => {
    // Simulate network delay for AI responses
    if (role === 'ai') {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
    }

    setChatThreads((threads) =>
      threads.map((thread) => {
        if (thread.id === threadId) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            role,
            content,
            timestamp: new Date().toISOString(),
            citations: role === 'ai' ? mockData.sampleCitations : undefined,
          };
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
          };
        }
        return thread;
      })
    );
  }, []);

  const createNewThread = useCallback((title: string, initialMessage: string) => {
    const newThread: ChatThread = {
      id: `t-${Date.now()}`,
      title,
      preview: initialMessage.substring(0, 30) + "...",
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "user",
          content: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
      context: {
        projectId: mockData.currentProject.id,
        documents: [],
      },
    };
    setChatThreads((threads) => [...threads, newThread]);
    setActiveThreadId(newThread.id);
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    setChatThreads((threads) => threads.filter((t) => t.id !== threadId));
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }
  }, [activeThreadId]);

  const generateStories = useCallback(async (persona: string, goal: string) => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

    const { storyTemplates } = await import("./mock-data");
    const templates = storyTemplates.payment;

    const newStories: GeneratedStory[] = templates.map((template, index) => ({
      id: `story-${Date.now()}-${index + 1}`,
      title: template.titleTemplate.replace("{persona}", persona).replace("{goal}", goal),
      persona,
      goal,
      benefit: "aby zwiększyć efektywność i bezpieczeństwo",
      acceptanceCriteria: template.acceptanceCriteria.map((ac, i) => ({
        id: `ac-${index}-${i}`,
        format: ac.includes("WHEN") || ac.includes("IF") ? "EARS" : "Gherkin",
        text: ac,
      })),
      estimate: template.estimate,
      sources: mockData.sampleCitations,
      conflicts: template.hasConflict && template.conflictDetails
        ? [template.conflictDetails]
        : undefined,
    }));

    setGeneratedStories(newStories);
  }, []);

  const clearStories = useCallback(() => {
    setGeneratedStories([]);
  }, []);

  const refineStory = useCallback((storyId: string, updates: Partial<GeneratedStory>) => {
    setGeneratedStories((stories) =>
      stories.map((story) =>
        story.id === storyId ? { ...story, ...updates } : story
      )
    );
  }, []);

  const exportStory = useCallback(async (storyId: string, format: 'jira' | 'azure' | 'linear') => {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const taskId = `${format.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return taskId;
  }, []);

  const resolveConflict = useCallback((storyId: string, resolution: 'keep' | 'merge' | 'discard') => {
    setGeneratedStories((stories) =>
      stories.map((story) => {
        if (story.id === storyId) {
          if (resolution === 'discard') {
            return { ...story, conflicts: undefined };
          }
          // For 'keep' and 'merge', just remove the conflict marker
          return { ...story, conflicts: undefined };
        }
        return story;
      })
    );
  }, []);

  const generateTestData = useCallback(async (schema: string, recordCount: number) => {
    // Simulate data generation
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const { testDataSchemas } = await import("./mock-data");
    const schemaConfig = testDataSchemas[schema as keyof typeof testDataSchemas];

    if (!schemaConfig) {
      throw new Error(`Unknown schema: ${schema}`);
    }

    const records = schemaConfig.generator(Math.min(recordCount, 10));

    const newDataset: GeneratedDataset = {
      id: `dataset-${Date.now()}`,
      schema,
      records,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalRecords: recordCount,
        edgeCaseCount: 0,
      },
    };

    setTestDatasets([newDataset]);
  }, []);

  const clearTestData = useCallback(() => {
    setTestDatasets([]);
  }, []);

  const updateSchema = useCallback((schema: string) => {
    // Clear existing data when schema changes
    setTestDatasets([]);
  }, []);

  const exportData = useCallback((format: 'json' | 'csv' | 'sql') => {
    if (testDatasets.length === 0) return;

    const dataset = testDatasets[0];
    const { exportToJSON, exportToCSV, exportToSQL } = require("./export-utils");

    const filename = `test-data-${dataset.schema.replace(/[^a-z0-9]/gi, "-")}`;

    if (format === "json") {
      exportToJSON(dataset.records, filename);
    } else if (format === "csv") {
      exportToCSV(dataset.records, filename);
    } else if (format === "sql") {
      exportToSQL(dataset.records, "test_data", filename);
    }
  }, [testDatasets]);

  const verifyRequirements = useCallback(async () => {
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Findings are already in mockData
  }, []);

  const createTaskFromFinding = useCallback(async (findingId: string) => {
    // Simulate task creation
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const taskId = `FIX-${Math.floor(1000 + Math.random() * 9000)}`;
    return taskId;
  }, []);

  const dismissFinding = useCallback((findingId: string) => {
    setFindings((findings) => findings.filter((f) => f.id !== findingId));
  }, []);

  const answerReleaseQuestion = useCallback(
    async (releaseId: string, question: string) => {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

      const release = releases.find((r) => r.id === releaseId);
      if (!release) return "Release not found";

      const { acCoverageData } = await import("./mock-data");
      const coverage = acCoverageData[releaseId as keyof typeof acCoverageData] || [];

      if (question.includes("paczce") || question.includes("zawiera")) {
        return `Release ${release.id} (${release.environment}, ${new Date(release.deployedAt).toLocaleDateString("pl-PL")}) zawiera ${release.issues.length} issues: ${release.issues.join(", ")}. Wdrożono ${release.commits.length} commitów.`;
      } else if (question.includes("gate") || question.includes("pokrycie")) {
        const coverageText = coverage
          .map((c: any) => `${c.issueKey}: ${c.coveredAC}/${c.totalAC} AC (${(c.coverage * 100).toFixed(0)}%)`)
          .join(", ");
        return `Pokrycie AC dla release ${release.id}: ${coverageText}. ${coverage.every((c: any) => c.coverage === 1.0) ? "Wszystkie gate spełnione ✓" : "Niektóre AC nie są pokryte ⚠️"}`;
      } else if (question.includes("zmieniło") || question.includes("poprzedni")) {
        const prevRelease = releases.find((r) => r.id === `R-${parseInt(release.id.split("-")[1]) - 1}`);
        if (prevRelease) {
          const addedIssues = release.issues.filter((i) => !prevRelease.issues.includes(i));
          const removedIssues = prevRelease.issues.filter((i) => !release.issues.includes(i));
          return `Zmiany vs ${prevRelease.id}: Dodano ${addedIssues.length} issues (${addedIssues.join(", ")}), usunięto ${removedIssues.length} issues${removedIssues.length > 0 ? ` (${removedIssues.join(", ")})` : ""}. Nowe commity: ${release.commits.length - prevRelease.commits.length}.`;
        }
        return `Brak poprzedniego release do porównania.`;
      }

      return `Release ${release.id} (${release.environment}, ${release.deployedAt}) zawiera issues: ${release.issues.join(", ")}. Status: ${release.status}.`;
    },
    [releases]
  );

  const getACCoverage = useCallback((releaseId: string) => {
    const { acCoverageData } = require("./mock-data");
    return acCoverageData[releaseId as keyof typeof acCoverageData] || [];
  }, []);

  const updateSyncStatus = useCallback((status: Partial<SyncStatus>) => {
    setSyncStatus((prev) => ({ ...prev, ...status }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        currentProject,
        chatThreads,
        activeThreadId,
        generatedStories,
        testDatasets,
        findings,
        releases,
        syncStatus,
        setActiveThread,
        addMessageToThread,
        createNewThread,
        deleteThread,
        generateStories,
        clearStories,
        refineStory,
        exportStory,
        resolveConflict,
        generateTestData,
        clearTestData,
        updateSchema,
        exportData,
        verifyRequirements,
        createTaskFromFinding,
        dismissFinding,
        answerReleaseQuestion,
        getACCoverage,
        updateSyncStatus,
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
