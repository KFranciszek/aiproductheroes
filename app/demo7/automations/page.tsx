"use client";
import { useEffect, useState } from "react";
import { getState, subscribe, createCorrectiveTask } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultRules = [
  { id: "r1", name: "KR confidence < 50% → create recovery task", enabled: true },
  { id: "r2", name: "Gate fail 3x/7d → escalate", enabled: true },
  { id: "r3", name: "Orphan work > 15% → suggest linking", enabled: false },
];

export default function Page() {
  const [s, setS] = useState(getState());
  const [rules, setRules] = useState(defaultRules);
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Automations</h2>
        <p className="text-muted-foreground">Configure automated workflows and rules</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>When / If / Then Rules</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {rules.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium">{r.name}</div>
              <Switch checked={r.enabled} onCheckedChange={(v) => setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, enabled: v } : x)))} />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={() => { createCorrectiveTask("Automation dry-run task"); toast.success("Dry‑run: created task"); }}>Run Dry-Run</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
