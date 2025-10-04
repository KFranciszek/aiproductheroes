// lib/calendar-integration.ts
import type { User, Issue } from "@/types"

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

class CalendarIntegration {
  private apiKey: string | null = null;

  async authenticate(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('calendar_api_key', apiKey);
    return { success: true };
  }

  async syncTeamCalendar(teamMembers: User[], tasks: Issue[]): Promise<CalendarEvent[]> {
    // Mock danych kalendarza
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Sprint Planning',
        start: new Date('2024-01-20T10:00:00'),
        end: new Date('2024-01-20T11:00:00'),
        description: 'Planowanie następnego sprintu'
      }
    ];

    // Przelicz zadania na wydarzenia kalendarza
    const taskEvents: CalendarEvent[] = tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(task.dueDate!),
        description: `Zadanie: ${task.description || ''}`
      }));

    return [...mockEvents, ...taskEvents];
  }
}


