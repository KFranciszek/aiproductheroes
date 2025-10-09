"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Activity } from "lucide-react"
import { useState } from "react"
import type { ActivityLog, User } from "@/types/demo2"

interface ActivityViewProps {
  activities: ActivityLog[]
  users: User[]
}

export function ActivityView({ activities, users }: ActivityViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.newValue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = userFilter === "all" || activity.userId === userFilter
    const matchesAction = actionFilter === "all" || activity.action === actionFilter
    
    return matchesSearch && matchesUser && matchesAction
  })

  const getActionLabel = (action: string) => {
    switch (action) {
      case "created_issue": return "Utworzył zadanie"
      case "status_changed": return "Zmienił status"
      case "assigned": return "Przypisał zadanie"
      case "commented": return "Dodał komentarz"
      case "updated": return "Zaktualizował"
      default: return action
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "created_issue": return "bg-green-100 text-green-800"
      case "status_changed": return "bg-blue-100 text-blue-800"
      case "assigned": return "bg-purple-100 text-purple-800"
      case "commented": return "bg-yellow-100 text-yellow-800"
      case "updated": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Teraz"
    if (diffMins < 60) return `${diffMins}m temu`
    if (diffHours < 24) return `${diffHours}h temu`
    if (diffDays < 7) return `${diffDays}d temu`
    
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const uniqueActions = [...new Set(activities.map(a => a.action))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Activity Feed</h1>
        <p className="text-muted-foreground">
          Historia wszystkich zmian w projekcie
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Szukaj w aktywności..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Użytkownik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy użytkownicy</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Akcja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie akcje</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Znaleziono {filteredActivities.length} z {activities.length} zdarzeń
        </p>
      </div>

      {/* Activity Feed */}
      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-6">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => {
                  const user = users.find(u => u.id === activity.userId)
                  
                  return (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="text-sm">
                          {user ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">{user?.name || "Użytkownik"}</span>
                              {" "}
                              <span className="text-muted-foreground">
                                {getActionLabel(activity.action).toLowerCase()}
                              </span>
                              {activity.oldValue && activity.newValue && (
                                <span>
                                  {" z "}
                                  <Badge variant="outline" className="text-xs">
                                    {activity.oldValue}
                                  </Badge>
                                  {" na "}
                                  <Badge variant="outline" className="text-xs">
                                    {activity.newValue}
                                  </Badge>
                                </span>
                              )}
                              {activity.newValue && !activity.oldValue && (
                                <span>
                                  {": "}
                                  <Badge variant="outline" className="text-xs">
                                    {activity.newValue}
                                  </Badge>
                                </span>
                              )}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                                {getActionLabel(activity.action)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Brak aktywności</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || userFilter !== "all" || actionFilter !== "all" 
                    ? "Spróbuj zmienić filtry wyszukiwania"
                    : "Historia zmian pojawi się tutaj gdy rozpoczniesz pracę"
                  }
                </p>
                {(searchTerm || userFilter !== "all" || actionFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("")
                      setUserFilter("all")
                      setActionFilter("all")
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
