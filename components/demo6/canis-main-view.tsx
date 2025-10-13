"use client";

import Link from "next/link";
import { useUI } from "@/lib/demo6/ui-context";
import { CanisChat } from "./canis-chat";
import { StoriesGenerator } from "./stories-generator";
import { TestDataGenerator } from "./test-data-generator";
import { VerifyView } from "./verify-view";
import { ReleaseQA } from "./release-qa";
import { SettingsView } from "./settings-view";

export function CanisMainView() {
  const { activeTab, setActiveTab, setCommandPaletteOpen } = useUI();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* TopBar */}
      <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-primary">auto_awesome</span>
            <h1 className="text-lg font-semibold">Syzio — Canis</h1>
          </div>
          <div className="flex items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md px-2 py-1 text-sm">
            <span>Projekt płatności</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/demo-selector"
            className="flex items-center space-x-1 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
          >
            <span className="material-icons text-base">arrow_back</span>
            <span>Back to Demos</span>
          </Link>
          <button 
            className="flex items-center space-x-2 px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Wyszukiwanie"
          >
            <span className="material-icons text-base">search</span>
            <span className="text-sm">Search</span>
            <span className="px-1.5 py-0.5 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded text-xs">⌘K</span>
          </button>
          <button 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
            aria-label="Pomoc"
          >
            <span className="material-icons">help_outline</span>
          </button>
          <button 
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
            onClick={() => setActiveTab('settings')}
            aria-label="Ustawienia"
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="mx-auto max-w-[1200px] p-4 md:p-6">
        {/* Tab Navigation */}
        <nav className="border-b border-border-light dark:border-border-dark">
          <ul className="flex space-x-8">
            {[
              { id: 'chat', label: 'Chat' },
              { id: 'stories', label: 'Stories' },
              { id: 'testdata', label: 'Test Data' },
              { id: 'verify', label: 'Verify' },
              { id: 'release', label: 'Release Q&A' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary font-semibold'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'chat' && <CanisChat />}
          {activeTab === 'stories' && <StoriesGenerator />}
          {activeTab === 'testdata' && <TestDataGenerator />}
          {activeTab === 'verify' && <VerifyView />}
          {activeTab === 'release' && <ReleaseQA />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
