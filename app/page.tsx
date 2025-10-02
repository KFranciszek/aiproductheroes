"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { IssuesList } from "@/components/issues-list"
import { CurrentSprintView } from "@/components/current-sprint-view"
import { SprintsView } from "@/components/sprints-view"
import { ReportsView } from "@/components/reports-view"
import { ActivityView } from "@/components/activity-view"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { DataManager } from "@/components/data-manager"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { initialIssues, initialSprints, initialActivityLogs, initialComments, initialAttachments, initialTemplates, generateTaskId, generateCommentId, generateAttachmentId } from "@/lib/data"
import type { Issue, Sprint, ViewType, IssueStatus, ActivityLog, KeyboardShortcut, Comment, Attachment, TaskTemplate } from "@/types"
import { IssueDetailView } from "@/components/issue-detail-view"

export default function TaskFlowApp() {
  const [currentView, setCurrentView] = useState<ViewType>("current-sprint")
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [activities, setActivities] = useState<ActivityLog[]>(initialActivityLogs)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments)
  const [templates, setTemplates] = useState<TaskTemplate[]>(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)

  // Definicja skrótów klawiaturowych
  const keyboardShortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrl: true,
      action: () => setCurrentView('issues'),
      description: 'Nowe zadanie'
    },
    {
      key: 'f',
      ctrl: true,
      action: () => setCurrentView('issues'),
      description: 'Przejdź do zadań'
    },
    {
      key: 's',
      ctrl: true,
      action: () => setCurrentView('sprints'),
      description: 'Przejdź do sprintów'
    },
    {
      key: 'r',
      ctrl: true,
      action: () => setCurrentView('reports'),
      description: 'Przejdź do raportów'
    },
    {
      key: '1',
      alt: true,
      action: () => setCurrentView('current-sprint'),
      description: 'Przejdź do bieżącego sprintu'
    },
    {
      key: '2',
      alt: true,
      action: () => setCurrentView('issues'),
      description: 'Przejdź do zadań'
    },
    {
      key: '3',
      alt: true,
      action: () => setCurrentView('favorites'),
      description: 'Przejdź do ulubionych'
    },
    {
      key: '4',
      alt: true,
      action: () => setCurrentView('sprints'),
      description: 'Przejdź do sprintów'
    },
    {
      key: '5',
      alt: true,
      action: () => setCurrentView('reports'),
      description: 'Przejdź do raportów'
    },
    {
      key: '6',
      alt: true,
      action: () => setCurrentView('activity'),
      description: 'Przejdź do aktywności'
    }
  ]

  useKeyboardShortcuts(keyboardShortcuts)

  // Data management functions
  const handleExportData = () => {
    const exportData = {
      version: '1.0.0',
      exportDate: new Date(),
      userId: 'current-user',
      data: {
        issues,
        sprints,
        activities,
        comments,
        attachments,
        templates,
      }
    };
    return JSON.stringify(exportData, null, 2);
  };

  const handleImportData = (data: any) => {
    try {
      // Walidacja wersji
      if (!data.version || data.version !== '1.0.0') {
        throw new Error('Nieobsługiwana wersja pliku eksportu');
      }

      // Import danych
      if (data.data.issues) {
        setIssues(data.data.issues);
      }
      if (data.data.sprints) {
        setSprints(data.data.sprints);
      }
      if (data.data.activities) {
        setActivities(data.data.activities);
      }
      if (data.data.comments) {
        setComments(data.data.comments);
      }
      if (data.data.attachments) {
        setAttachments(data.data.attachments);
      }
      if (data.data.templates) {
        setTemplates(data.data.templates);
      }
    } catch (error) {
      throw new Error('Nieprawidłowy format pliku eksportu');
    }
  };

  const handleEditIssue = (updatedIssue: Issue) => {
    setIssues(
      issues.map((issue) =>
        issue.id === updatedIssue.id
          ? {
              ...issue,
              ...updatedIssue,
              updatedAt: new Date(),
            }
          : issue,
      ),
    )
  }

  const handleDeleteIssue = (issueId: string) => {
    setIssues(issues.filter((issue) => issue.id !== issueId))
  }

  const handleUpdateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: newStatus,
              updatedAt: new Date(),
            }
          : issue,
      ),
    )
  }

  const handleAssignToSprint = (issueId: string, sprintId: string | undefined) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              sprintId,
              updatedAt: new Date(),
            }
          : issue,
      ),
    )
  }

  const handleToggleFavorite = (issueId: string) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              isFavorite: !issue.isFavorite,
              favoritedBy: issue.isFavorite
                ? issue.favoritedBy?.filter(user => user !== "CurrentUser") || []
                : [...(issue.favoritedBy || []), "CurrentUser"],
              updatedAt: new Date(),
            }
          : issue,
      ),
    )
  }

  const handleAddSubtask = (parentId: string) => {
    // Otwórz formularz dodawania nowego zadania z ustawionym parentId
    // To będzie implementowane w komponencie IssueForm
    setCurrentView('issues')
  }

  const handleUpdateSubtaskStatus = (subtaskId: string, status: IssueStatus) => {
    setIssues(
      issues.map((issue) =>
        issue.id === subtaskId
          ? {
              ...issue,
              status,
              updatedAt: new Date(),
            }
          : issue,
      ),
    )
  }

  const handleAddComment = (issueId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: generateCommentId(comments),
      issueId,
      userId: "CurrentUser",
      content,
      parentCommentId: parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setComments([...comments, newComment])

    // Dodaj aktywność dla nowego komentarza
    const newActivity: ActivityLog = {
      id: `activity-${Date.now()}`,
      issueId,
      userId: "CurrentUser",
      action: "comment_added",
      newValue: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      timestamp: new Date(),
    }
    setActivities([...activities, newActivity])
  }

  const handleFileUpload = async (issueId: string, files: File[]) => {
    // Symulacja uploadu plików
    for (const file of files) {
      const newAttachment: Attachment = {
        id: generateAttachmentId(attachments),
        issueId,
        type: 'file',
        name: file.name,
        url: `/files/${file.name}`,
        size: file.size,
        mimeType: file.type,
      }
      setAttachments([...attachments, newAttachment])
    }
  }

  const handleAddLink = (issueId: string, url: string, name: string) => {
    const newAttachment: Attachment = {
      id: generateAttachmentId(attachments),
      issueId,
      type: 'link',
      name,
      url,
    }
    setAttachments([...attachments, newAttachment])
  }

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId))
  }

  const handleTemplateSelect = (template: TaskTemplate) => {
    setSelectedTemplate(template)
  }

  // Issue management functions
  const handleCreateIssue = (issueData: Partial<Issue>) => {
    const templateFields = selectedTemplate?.fields || {}
    const newIssue: Issue = {
      id: generateTaskId(issues),
      title: issueData.title || templateFields.title || "",
      description: issueData.description || templateFields.description || "",
      priority: issueData.priority || templateFields.priority || "P3",
      status: issueData.status || templateFields.status || "Todo",
      assignee: issueData.assignee || templateFields.assignee || "",
      sprintId: issueData.sprintId || templateFields.sprintId,
      attachments: [],
      isFavorite: false,
      favoritedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setIssues([...issues, newIssue])
    setSelectedTemplate(null) // Reset szablonu po użyciu
  }

  // Sprint management functions
  const handleCreateSprint = (sprintData: Partial<Sprint>) => {
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name: sprintData.name || "",
      status: "Planned",
      startDate: sprintData.startDate || new Date(),
      endDate: sprintData.endDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSprints([...sprints, newSprint])
  }

  const handleEditSprint = (updatedSprint: Sprint) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === updatedSprint.id
          ? {
              ...sprint,
              ...updatedSprint,
              updatedAt: new Date(),
            }
          : sprint,
      ),
    )
  }

  const handleStartSprint = (sprintId: string) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId
          ? {
              ...sprint,
              status: "Active" as const,
              updatedAt: new Date(),
            }
          : sprint,
      ),
    )
  }

  const handleEndSprint = (sprintId: string) => {
    // Move unfinished issues back to backlog
    const unfinishedIssues = issues.filter((issue) => issue.sprintId === sprintId && issue.status !== "Done")

    setIssues(
      issues.map((issue) =>
        unfinishedIssues.some((ui) => ui.id === issue.id)
          ? {
              ...issue,
              sprintId: undefined,
              updatedAt: new Date(),
            }
          : issue,
      ),
    )

    // Update sprint status
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId
          ? {
              ...sprint,
              status: "Completed" as const,
              updatedAt: new Date(),
            }
          : sprint,
      ),
    )
  }

  // Get current active sprint
  const activeSprint = sprints.find((sprint) => sprint.status === "Active")

  const handleViewIssueDetails = (issueId: string) => {
    setSelectedIssueId(issueId)
  }

  const handleBackFromDetails = () => {
    setSelectedIssueId(null)
  }

  const renderCurrentView = () => {
    // Jeśli wybrano zadanie, pokaż widok szczegółów
    if (selectedIssueId) {
      const issue = issues.find(i => i.id === selectedIssueId)
      if (!issue) {
        setSelectedIssueId(null)
        return null
      }

      return (
        <IssueDetailView
          issue={issue}
          sprints={sprints}
          allIssues={issues}
          comments={comments}
          attachments={attachments}
          activities={activities}
          onBack={handleBackFromDetails}
          onEdit={handleEditIssue}
          onDelete={handleDeleteIssue}
          onToggleFavorite={handleToggleFavorite}
          onAddComment={handleAddComment}
          onFileUpload={handleFileUpload}
          onAddLink={handleAddLink}
          onDeleteAttachment={handleDeleteAttachment}
          onTimeLogged={(entry) => {
            // Tutaj możesz dodać logikę zapisu czasu
            console.log('Time logged:', entry)
          }}
        />
      )
    }
    switch (currentView) {
      case "issues":
        return (
          <IssuesList
            issues={issues}
            sprints={sprints}
            onCreateIssue={handleCreateIssue}
            onEditIssue={handleEditIssue}
            onDeleteIssue={handleDeleteIssue}
            onAssignToSprint={handleAssignToSprint}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewIssueDetails}
          />
        )
      case "current-sprint":
        return (
          <CurrentSprintView
            sprint={activeSprint || null}
            issues={issues}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onViewDetails={handleViewIssueDetails}
          />
        )
      case "sprints":
        return (
          <SprintsView
            sprints={sprints}
            issues={issues}
            onCreateSprint={handleCreateSprint}
            onEditSprint={handleEditSprint}
            onStartSprint={handleStartSprint}
            onEndSprint={handleEndSprint}
          />
        )
      case "reports":
        return <ReportsView issues={issues} sprints={sprints} />
      case "favorites":
        return (
          <IssuesList
            issues={issues.filter(issue => issue.isFavorite)}
            sprints={sprints}
            onCreateIssue={handleCreateIssue}
            onEditIssue={handleEditIssue}
            onDeleteIssue={handleDeleteIssue}
            onAssignToSprint={handleAssignToSprint}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewIssueDetails}
          />
        )
      case "activity":
        return <ActivityView activities={activities} />
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Ustawienia</h1>
            <DataManager onExport={handleExportData} onImport={handleImportData} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        issues={issues}
        sprints={sprints}
        templates={templates}
        onCreateIssue={handleCreateIssue}
        onTemplateSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
      />
      <main className="flex-1 overflow-x-auto p-6">
        <div className="mx-auto max-w-full">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  )
}