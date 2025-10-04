// hooks/use-global-shortcuts.ts
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useGlobalShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Globalne skróty dla aplikacji
export const globalShortcuts: KeyboardShortcut[] = [
  {
    key: 'n',
    ctrl: true,
    action: () => {
      // Otwórz modal tworzenia zadania
      const event = new CustomEvent('openCreateIssue');
      window.dispatchEvent(event);
    },
    description: 'Create new issue'
  },
  {
    key: 'f',
    ctrl: true,
    action: () => {
      // Przejdź do widoku zadań
      const event = new CustomEvent('navigateToView', { detail: 'issues' });
      window.dispatchEvent(event);
    },
    description: 'Go to Issues'
  },
  {
    key: '/',
    action: () => {
      // Focus na search bar
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search'
  }
];


