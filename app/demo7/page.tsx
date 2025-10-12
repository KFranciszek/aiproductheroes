"use client";
import { useEffect, useState } from "react";
import {
  getState,
  subscribe,
  outcomeHealthForObjective,
  gatePassRateForEpic,
  confidenceForKR,
} from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Page() {
  const [s, setS] = useState(getState());
  useEffect(() => {
    const unsubscribe = subscribe(setS);
    return unsubscribe;
  }, []);
  const onTrack = s.krs.filter(
    (k) => (k.confidence ?? 0.7) >= s.settings.thresholds.confidenceAtRisk
  ).length;
  
  const gatePassRates = s.epics.map((e) => gatePassRateForEpic(e.id));
  const avgGatePassRate = gatePassRates.length > 0
    ? gatePassRates.reduce((a, b) => a + b, 0) / gatePassRates.length
    : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Quick status of delivery, quality, and outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Gate Pass Rate</p>
                <p className="text-4xl font-bold mt-1">
                  {Math.round(avgGatePassRate * 100)}%
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                <span className="text-destructive">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg KR Confidence
                </p>
                <p className="text-4xl font-bold mt-1">
                  {Math.round(
                    (s.krs.reduce((a, k) => a + (k.confidence ?? 0.7), 0) /
                      s.krs.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10">
                <span className="text-success">↗</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-sm font-bold mb-4">Active Work</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Epics</span>
                <span className="font-semibold">{s.epics.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Key Results</span>
                <span className="font-semibold">{s.krs.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Results Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {s.krs.map((kr) => {
            const conf = confidenceForKR(kr.id);
            const progress = (kr.current / kr.target) * 100;
            const isOnTrack = conf >= s.settings.thresholds.confidenceAtRisk;
            return (
              <div
                key={kr.id}
                className="p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{kr.name}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mr-4">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            isOnTrack ? "bg-primary" : "bg-destructive"
                          )}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {Math.round(conf * 100)}%
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "ml-4 px-3 py-1 text-xs font-semibold rounded-full",
                      isOnTrack
                        ? "text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-800/50"
                        : "text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800/50"
                    )}
                  >
                    {isOnTrack ? "On Track" : "At Risk"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
