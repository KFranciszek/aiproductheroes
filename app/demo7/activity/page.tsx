"use client";
import { useEffect, useState } from "react";
import { getState, subscribe } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [s, setS] = useState(getState());
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      okr: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      link: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      gate: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      task: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      settings: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[type] || colors.settings;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Activity & Audit</h2>
        <p className="text-muted-foreground">Recent system events and changes</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {s.activities.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 text-center">No events yet</div>
          )}
          {s.activities.map((a) => (
            <div key={a.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Badge className={getTypeBadge(a.type)}>{a.type}</Badge>
                <span className="text-sm">{a.message}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                {new Date(a.at).toLocaleString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
