"use client";

import { useUI } from "@/lib/demo6/ui-context";

interface SuggestionBannerProps {
  suggestionId: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuggestionBanner({
  suggestionId,
  title,
  description,
  actionLabel,
  onAction,
}: SuggestionBannerProps) {
  const { dismissedSuggestions, dismissSuggestion } = useUI();

  if (dismissedSuggestions.includes(suggestionId)) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg mb-4 animate-fade-in">
      <div className="flex items-center space-x-3">
        <span className="material-icons text-warning">lightbulb</span>
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors"
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={() => dismissSuggestion(suggestionId)}
          className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
          aria-label="Zamknij"
        >
          <span className="material-icons text-base">close</span>
        </button>
      </div>
    </div>
  );
}
