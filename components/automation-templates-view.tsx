"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Download, Eye } from "lucide-react"
import type { AutomationTemplate } from "@/types"
import { useState } from "react"

interface AutomationTemplatesViewProps {
  templates: AutomationTemplate[]
}

export function AutomationTemplatesView({ templates }: AutomationTemplatesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity")

  let filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Sort templates
  filteredTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.popularity - a.popularity
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      sync: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      assignment: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      notification: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      sprint: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      recurring: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      custom: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
    return (
      <Badge className={colors[category] || colors.custom}>
        {category}
      </Badge>
    )
  }

  const getPopularityStars = (popularity: number) => {
    const stars = Math.round((popularity / 100) * 5)
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Automation Templates</h2>
        <p className="text-muted-foreground">Gotowe szablony automatyzacji do wdrożenia w jeden klik</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Szukaj szablonów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                <SelectItem value="sync">Sync</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="sprint">Sprint</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Najpopularniejsze</SelectItem>
                <SelectItem value="name">Nazwa A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{template.icon}</span>
                {getCategoryBadge(template.category)}
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Popularność</span>
                  {getPopularityStars(template.popularity)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {template.popularity}% użytkowników używa
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nie znaleziono szablonów spełniających kryteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

