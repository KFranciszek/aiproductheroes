"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface UIContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  
  selectedIssueId: string | null;
  openIssueDetail: (issueId: string) => void;
  closeIssueDetail: () => void;
  
  density: "compact" | "comfortable" | "spacious";
  setDensity: (density: "compact" | "comfortable" | "spacious") => void;
  
  viewMode: "table" | "cards" | "kanban";
  setViewMode: (mode: "table" | "cards" | "kanban") => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [density, setDensityState] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [viewMode, setViewModeState] = useState<"table" | "cards" | "kanban">("table");

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openIssueDetail = useCallback((issueId: string) => {
    setSelectedIssueId(issueId);
  }, []);

  const closeIssueDetail = useCallback(() => {
    setSelectedIssueId(null);
  }, []);

  const setDensity = useCallback((newDensity: "compact" | "comfortable" | "spacious") => {
    setDensityState(newDensity);
    localStorage.setItem("density", newDensity);
  }, []);

  const setViewMode = useCallback((mode: "table" | "cards" | "kanban") => {
    setViewModeState(mode);
    localStorage.setItem("viewMode", mode);
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        commandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        selectedIssueId,
        openIssueDetail,
        closeIssueDetail,
        density,
        setDensity,
        viewMode,
        setViewMode,
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
