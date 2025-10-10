"use client";

import { useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { CommandPalette } from "./command-palette";
import { DemoBanner } from "./demo-banner";
import { IssueDetailView } from "./issue-detail-view";
import { IssueForm } from "./issue-form";
import { useUI } from "@/lib/demo4/ui-context";
import { Toaster } from "@/components/ui/sonner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, selectedIssueId } = useUI();
  const [issueFormOpen, setIssueFormOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--brand-primary)] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      <DemoBanner />
      
      <div className="flex flex-1">
        <SidebarNavigation onNewTask={() => setIssueFormOpen(true)} />
        
        <main 
          id="main-content"
          className={`flex-1 transition-all duration-200 ${
            sidebarCollapsed ? "ml-[72px]" : "ml-[280px]"
          }`}
        >
          {children}
        </main>
      </div>

      <CommandPalette onNewTask={() => setIssueFormOpen(true)} />
      {selectedIssueId && <IssueDetailView />}
      <IssueForm open={issueFormOpen} onOpenChange={setIssueFormOpen} />
      <Toaster />
    </div>
  );
}
