"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface UIContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
  dismissedSuggestions: string[];
  dismissSuggestion: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>("t-1");
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const dismissSuggestion = useCallback((id: string) => {
    setDismissedSuggestions(prev => [...prev, id]);
  }, []);

  return (
    <UIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        commandPaletteOpen,
        setCommandPaletteOpen,
        selectedThreadId,
        setSelectedThreadId,
        dismissedSuggestions,
        dismissSuggestion,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}
