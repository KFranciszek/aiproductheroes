"use client";
import { useEffect, useMemo, useState } from "react";
import { getState, subscribe, confidenceForKR, createCorrectiveTask } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Page() {
  const [s, setS] = useState(getState());
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  const atRisk = useMemo(() => s.krs.filter((k) => confidenceForKR(k.id) < s.settings.thresholds.confidenceAtRisk), [s]);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Risk Radar & Insights</h2>
        <p className="text-muted-foreground">Identify and address at-risk key results</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>At-Risk Key Results</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {atRisk.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 text-center">All KRs are on track</div>
          )}
          {atRisk.map((k) => {
            const conf = Math.round(confidenceForKR(k.id) * 100);
            return (
              <div key={k.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{k.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Confidence: {conf}%</p>
                  </div>
                  <Button variant="secondary" onClick={() => { createCorrectiveTask(`Recovery plan: ${k.name}`, k.id); toast.success("Created corrective task"); }}>
                    Create Task
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
