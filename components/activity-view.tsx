import React from 'react';
import { ActivityLog } from '@/types';
import { ActivityFeed } from './activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityViewProps {
  activities: ActivityLog[];
}

export function ActivityView({ activities }: ActivityViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Historia aktywności</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ostatnie aktywności</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            activities={activities}
            currentUserId="CurrentUser"
          />
        </CardContent>
      </Card>
    </div>
  );
}
