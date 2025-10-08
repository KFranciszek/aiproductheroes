"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Table, Calendar } from "lucide-react"
import type { Sprint, Issue, User, AutomationMetrics, AIInsight, TimeEntry } from "@/types"

interface ExportReportsProps {
  sprints: Sprint[]
  issues: Issue[]
  users: User[]
  automationMetrics?: AutomationMetrics
  aiInsights?: AIInsight[]
  timeEntries?: TimeEntry[]
}

export function ExportReports({ 
  sprints, 
  issues, 
  users, 
  automationMetrics, 
  aiInsights = [],
  timeEntries = []
}: ExportReportsProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [selectedReports, setSelectedReports] = useState<string[]>(['sprint-health', 'team-performance'])
  const [dateRange, setDateRange] = useState<'last-30' | 'last-90' | 'all'>('last-30')

  const reportOptions = [
    { id: 'sprint-health', name: 'Sprint Health', description: 'Metryki zdrowia sprintu' },
    { id: 'team-performance', name: 'Team Performance', description: 'Wydajność zespołu' },
    { id: 'project-overview', name: 'Project Overview', description: 'Przegląd projektu' },
    { id: 'velocity-trends', name: 'Velocity Trends', description: 'Trendy velocity' },
    { id: 'time-tracking', name: 'Time Tracking', description: 'Analiza czasu pracy' },
    { id: 'automation-metrics', name: 'Automation Metrics', description: 'Metryki automatyzacji' },
  ]

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const generateCSVData = () => {
    const data: Record<string, any[]> = {}

    if (selectedReports.includes('sprint-health')) {
      const activeSprint = sprints.find(s => s.status === 'Active')
      if (activeSprint) {
        const sprintIssues = issues.filter(issue => issue.sprintId === activeSprint.id)
        data['sprint-health'] = [{
          'Sprint Name': activeSprint.name,
          'Total Issues': sprintIssues.length,
          'Completed Issues': sprintIssues.filter(i => i.status === 'Done').length,
          'Total Story Points': sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0),
          'Completed Story Points': sprintIssues.filter(i => i.status === 'Done').reduce((sum, i) => sum + (i.storyPoints || 0), 0),
          'Progress %': Math.round((sprintIssues.filter(i => i.status === 'Done').length / sprintIssues.length) * 100)
        }]
      }
    }

    if (selectedReports.includes('team-performance')) {
      data['team-performance'] = users.map(user => {
        const userIssues = issues.filter(issue => issue.assignee?.id === user.id)
        const completedIssues = userIssues.filter(issue => issue.status === 'Done')
        return {
          'User Name': user.name,
          'Role': user.role,
          'Total Tasks': userIssues.length,
          'Completed Tasks': completedIssues.length,
          'Completion Rate %': userIssues.length > 0 ? Math.round((completedIssues.length / userIssues.length) * 100) : 0,
          'Total Story Points': userIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0),
          'Completed Story Points': completedIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)
        }
      })
    }

    if (selectedReports.includes('project-overview')) {
      const totalIssues = issues.length
      const completedIssues = issues.filter(issue => issue.status === 'Done').length
      data['project-overview'] = [{
        'Total Issues': totalIssues,
        'Completed Issues': completedIssues,
        'Completion Rate %': Math.round((completedIssues / totalIssues) * 100),
        'Total Story Points': issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0),
        'Completed Story Points': issues.filter(i => i.status === 'Done').reduce((sum, i) => sum + (i.storyPoints || 0), 0),
        'Active Users': users.filter(u => u.isActive).length,
        'Total Users': users.length
      }]
    }

    if (selectedReports.includes('velocity-trends')) {
      const completedSprints = sprints.filter(s => s.status === 'Completed').slice(-8)
      data['velocity-trends'] = completedSprints.map(sprint => {
        const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id)
        const completedPoints = sprintIssues
          .filter(issue => issue.status === 'Done')
          .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
        return {
          'Sprint Name': sprint.name,
          'Velocity': completedPoints,
          'Planned Capacity': sprint.capacity || 0,
          'Efficiency %': sprint.capacity ? Math.round((completedPoints / sprint.capacity) * 100) : 0,
          'Start Date': sprint.startDate.toLocaleDateString(),
          'End Date': sprint.endDate.toLocaleDateString()
        }
      })
    }

    if (selectedReports.includes('time-tracking') && timeEntries.length > 0) {
      const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60
      data['time-tracking'] = [{
        'Total Hours': Math.round(totalHours * 10) / 10,
        'Total Entries': timeEntries.length,
        'Average Session Duration': timeEntries.length > 0 ? Math.round((totalHours / timeEntries.length) * 10) / 10 : 0,
        'Active Users': new Set(timeEntries.map(e => e.userId)).size,
        'Issues Tracked': new Set(timeEntries.map(e => e.issueId)).size
      }]
    }

    if (selectedReports.includes('automation-metrics') && automationMetrics) {
      data['automation-metrics'] = [{
        'Health Score': automationMetrics.healthScore,
        'Active Rules': automationMetrics.activeRules,
        'Total Executions': automationMetrics.totalExecutions,
        'Success Rate %': automationMetrics.successRate,
        'Time Saved Hours': automationMetrics.timeSavedHours,
        'Failure Rate %': automationMetrics.failureRate,
        'Average Response Time': automationMetrics.avgResponseTime
      }]
    }

    return data
  }

  const exportToCSV = () => {
    const data = generateCSVData()
    
    Object.entries(data).forEach(([reportName, reportData]) => {
      if (reportData.length === 0) return

      const headers = Object.keys(reportData[0])
      const csvContent = [
        headers.join(','),
        ...reportData.map(row => 
          headers.map(header => {
            const value = row[header]
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          }).join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportName}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const exportToJSON = () => {
    const data = generateCSVData()
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange,
      reports: data,
      metadata: {
        totalSprints: sprints.length,
        totalIssues: issues.length,
        totalUsers: users.length,
        totalTimeEntries: timeEntries.length
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reports-export-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // Dla PDF użyjemy prostego HTML to PDF
    const data = generateCSVData()
    let htmlContent = `
      <html>
        <head>
          <title>Raporty - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Raporty Projektu - ${new Date().toLocaleDateString()}</h1>
          <div class="summary">
            <p><strong>Zakres dat:</strong> ${dateRange}</p>
            <p><strong>Eksportowane raporty:</strong> ${selectedReports.length}</p>
            <p><strong>Data eksportu:</strong> ${new Date().toLocaleString()}</p>
          </div>
    `

    Object.entries(data).forEach(([reportName, reportData]) => {
      if (reportData.length === 0) return

      htmlContent += `<h2>${reportName.replace('-', ' ').toUpperCase()}</h2>`
      htmlContent += '<table>'
      
      const headers = Object.keys(reportData[0])
      htmlContent += '<tr>'
      headers.forEach(header => {
        htmlContent += `<th>${header}</th>`
      })
      htmlContent += '</tr>'

      reportData.forEach(row => {
        htmlContent += '<tr>'
        headers.forEach(header => {
          htmlContent += `<td>${row[header]}</td>`
        })
        htmlContent += '</tr>'
      })
      
      htmlContent += '</table>'
    })

    htmlContent += '</body></html>'

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `reports-${new Date().toISOString().split('T')[0]}.html`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = () => {
    switch (selectedFormat) {
      case 'csv':
        exportToCSV()
        break
      case 'json':
        exportToJSON()
        break
      case 'pdf':
        exportToPDF()
        break
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Eksport raportów
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wybór formatu */}
          <div>
            <label className="text-sm font-medium mb-2 block">Format eksportu</label>
            <Select value={selectedFormat} onValueChange={(value: 'csv' | 'json' | 'pdf') => setSelectedFormat(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    CSV (Excel)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    JSON (Strukturalny)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    HTML (Do druku)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zakres dat */}
          <div>
            <label className="text-sm font-medium mb-2 block">Zakres danych</label>
            <Select value={dateRange} onValueChange={(value: 'last-30' | 'last-90' | 'all') => setDateRange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ostatnie 30 dni
                  </div>
                </SelectItem>
                <SelectItem value="last-90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ostatnie 90 dni
                  </div>
                </SelectItem>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Wszystkie dane
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Wybór raportów */}
          <div>
            <label className="text-sm font-medium mb-2 block">Raporty do eksportu</label>
            <div className="space-y-3">
              {reportOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedReports.includes(option.id)}
                    onCheckedChange={() => handleReportToggle(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-muted-foreground">{option.description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Podsumowanie */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Podsumowanie eksportu</h3>
            <div className="text-sm space-y-1">
              <p><strong>Format:</strong> {selectedFormat.toUpperCase()}</p>
              <p><strong>Zakres:</strong> {dateRange === 'last-30' ? 'Ostatnie 30 dni' : dateRange === 'last-90' ? 'Ostatnie 90 dni' : 'Wszystkie dane'}</p>
              <p><strong>Raporty:</strong> {selectedReports.length} z {reportOptions.length}</p>
              <p><strong>Dane:</strong> {sprints.length} sprintów, {issues.length} zadań, {users.length} użytkowników</p>
            </div>
          </div>

          {/* Przycisk eksportu */}
          <Button 
            onClick={handleExport} 
            className="w-full"
            disabled={selectedReports.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Eksportuj raporty
          </Button>
        </CardContent>
      </Card>

      {/* Instrukcje */}
      <Card>
        <CardHeader>
          <CardTitle>Instrukcje eksportu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>CSV:</strong> Najlepszy do analizy w Excelu. Każdy raport zostanie zapisany jako osobny plik.
          </div>
          <div>
            <strong>JSON:</strong> Strukturalny format z metadanymi. Idealny do integracji z innymi systemami.
          </div>
          <div>
            <strong>HTML:</strong> Format do druku lub podglądu w przeglądarce. Można łatwo przekonwertować na PDF.
          </div>
          <div className="text-muted-foreground">
            <em>Uwaga: Eksportowane dane są aktualne na moment eksportu i nie są automatycznie aktualizowane.</em>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
