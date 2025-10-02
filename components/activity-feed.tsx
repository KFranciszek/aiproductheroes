import React from 'react';
import { ActivityLog } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: ActivityLog[];
  currentUserId: string;
}

export function ActivityFeed({ activities, currentUserId }: ActivityFeedProps) {
  const getActionDescription = (activity: ActivityLog) => {
    switch (activity.action) {
      case 'created':
        return 'utworzył zadanie';
      case 'updated':
        return `zaktualizował ${activity.field}`;
      case 'status_changed':
        return `zmienił status na ${activity.newValue}`;
      case 'assignee_changed':
        return `przypisał do ${activity.newValue}`;
      case 'comment_added':
        return 'dodał komentarz';
      case 'favorite_added':
        return 'dodał do ulubionych';
      case 'favorite_removed':
        return 'usunął z ulubionych';
      default:
        return 'wykonał akcję';
    }
  };

  const getActionColor = (action: ActivityLog['action']) => {
    switch (action) {
      case 'created': return 'bg-green-100 text-green-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <Card key={activity.id} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {activity.userId[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                    {activity.action.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">{activity.userId}</span> {getActionDescription(activity)}
                </p>
                {activity.oldValue && activity.newValue && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.oldValue} → {activity.newValue}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
