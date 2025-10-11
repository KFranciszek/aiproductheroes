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

  // Story operations
  generateStories: (persona: string, goal: string) => Promise<void>;
  clearStories: () => void;

  // Test data operations
  generateTestData: (schema: string, recordCount: number) => Promise<void>;
  clearTestData: () => void;

  // Findings operations
  verifyRequirements: () => Promise<void>;

  // Release operations
  answerReleaseQuestion: (releaseId: string, question: string) => Promise<string>;

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

  const addMessageToThread = useCallback((threadId: string, role: 'user' | 'ai', content: string) => {
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

  const generateStories = useCallback(async (persona: string, goal: string) => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newStories: GeneratedStory[] = [
      {
        id: `story-${Date.now()}-1`,
        title: `Jako ${persona} chcę ${goal}`,
        persona,
        goal,
        benefit: "aby zwiększyć efektywność pracy",
        acceptanceCriteria: [
          {
            id: "ac-1",
            format: "EARS",
            text: "WHEN użytkownik kliknie przycisk THEN system SHALL wyświetlić wynik",
          },
          {
            id: "ac-2",
            format: "Gherkin",
            text: "Given użytkownik jest zalogowany When wykonuje akcję Then widzi potwierdzenie",
          },
        ],
        estimate: "5sp",
        sources: mockData.sampleCitations,
      },
      {
        id: `story-${Date.now()}-2`,
        title: `Jako ${persona} chcę mieć możliwość ${goal} z walidacją`,
        persona,
        goal: `${goal} z walidacją`,
        benefit: "aby zapewnić jakość danych",
        acceptanceCriteria: [
          {
            id: "ac-3",
            format: "EARS",
            text: "IF dane są nieprawidłowe THEN system SHALL wyświetlić komunikat błędu",
          },
        ],
        estimate: "3sp",
        sources: mockData.sampleCitations,
      },
    ];

    setGeneratedStories(newStories);
  }, []);

  const clearStories = useCallback(() => {
    setGeneratedStories([]);
  }, []);

  const generateTestData = useCallback(async (schema: string, recordCount: number) => {
    // Simulate data generation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const records = Array.from({ length: Math.min(recordCount, 10) }, (_, i) => ({
      id: i + 1,
      pan: `4539${Math.random().toString().slice(2, 14)}`,
      expiry: "12/27",
      holder: `User ${i + 1}`,
      brand: "VISA",
      amount: Math.random() * 1000,
      currency: "PLN",
      threeDS: true,
    }));

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

  const verifyRequirements = useCallback(async () => {
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Findings are already in mockData
  }, []);

  const answerReleaseQuestion = useCallback(
    async (releaseId: string, question: string) => {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      const release = releases.find((r) => r.id === releaseId);
      if (!release) return "Release not found";

      return `Release ${release.id} (${release.environment}, ${release.deployedAt}) zawiera issues: ${release.issues.join(", ")}. Status: ${release.status}.`;
    },
    [releases]
  );

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
        generateStories,
        clearStories,
        generateTestData,
        clearTestData,
        verifyRequirements,
        answerReleaseQuestion,
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
