'use client'

import React, { useState, useMemo } from 'react';
import { ActivityLog } from '@/types';
import { ActivityFeed } from './activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Filter, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityViewProps {
  activities: ActivityLog[];
}

export function ActivityView({ activities }: ActivityViewProps) {
  const [timeFilter, setTimeFilter] = useState<string>('7days');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  // Get unique users from activities
  const users = useMemo(() => {
    const uniqueUsers = new Set(activities.map(a => a.userId));
    return Array.from(uniqueUsers);
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Time filter
    const now = new Date();
    const timeRanges: Record<string, number> = {
      '24h': 1,
      '7days': 7,
      '30days': 30,
      'all': Infinity,
    };
    const daysAgo = timeRanges[timeFilter] || 7;
    if (daysAgo !== Infinity) {
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => new Date(a.timestamp) >= cutoffDate);
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(a => a.action === actionFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(a => a.userId === userFilter);
    }

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [activities, timeFilter, actionFilter, userFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const last7Days = activities.filter(a => {
      const daysAgo = (Date.now() - new Date(a.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });

    return {
      statusChanges: last7Days.filter(a => a.action === 'status_changed').length,
      comments: last7Days.filter(a => a.action === 'comment_added').length,
      created: last7Days.filter(a => a.action === 'created').length,
    };
  }, [activities]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">📜 Historia aktywności</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Przeglądaj wszystkie zmiany w projekcie
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zmiany statusu</p>
                <p className="text-2xl font-bold">{stats.statusChanges}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ostatnie 7 dni</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Komentarze</p>
                <p className="text-2xl font-bold">{stats.comments}</p>
              </div>
              <Filter className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ostatnie 7 dni</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nowe zadania</p>
                <p className="text-2xl font-bold">{stats.created}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ostatnie 7 dni</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                <Calendar className="inline h-4 w-4 mr-1" />
                Okres czasu
              </label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Ostatnie 24h</SelectItem>
                  <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
                  <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
                  <SelectItem value="all">Wszystkie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                <Filter className="inline h-4 w-4 mr-1" />
                Typ akcji
              </label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="created">Utworzono</SelectItem>
                  <SelectItem value="status_changed">Zmiana statusu</SelectItem>
                  <SelectItem value="assignee_changed">Zmiana przypisania</SelectItem>
                  <SelectItem value="comment_added">Komentarz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                <User className="inline h-4 w-4 mr-1" />
                Użytkownik
              </label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(timeFilter !== '7days' || actionFilter !== 'all' || userFilter !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Aktywne filtry:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTimeFilter('7days');
                  setActionFilter('all');
                  setUserFilter('all');
                }}
              >
                Wyczyść wszystkie
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timeline aktywności</CardTitle>
            <Badge variant="secondary">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'aktywność' : 'aktywności'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length > 0 ? (
            <ActivityFeed
              activities={filteredActivities}
              currentUserId="CurrentUser"
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Brak aktywności spełniających wybrane kryteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
