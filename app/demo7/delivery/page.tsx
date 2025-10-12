"use client";
import { useEffect, useState } from "react";
import { getState, subscribe, epicById, gatesByEpic, setGateStatus, avgGatePassForKR } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [s, setS] = useState(getState());
  const [epicId, setEpic] = useState<string>(s.epics[0]?.id || "");
  useEffect(() => {
    const unsubscribe = subscribe(setS);
    return unsubscribe;
  }, []);
  const epic = epicById(epicId);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Delivery & Quality Hub</h2>
        <p className="text-muted-foreground">Monitor quality gates and delivery metrics</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quality Gates</CardTitle>
          <Select onValueChange={setEpic} value={epicId}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Select epic" /></SelectTrigger>
            <SelectContent>{s.epics.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {epic ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  KR linked: {epic.krIds.join(", ") || "None"} · Gate pass rate: {Math.round((epic.krIds[0] ? avgGatePassForKR(epic.krIds[0]) : 1) * 100)}%
                </div>
              </div>
              <div className="space-y-3">
                {gatesByEpic(epic.id).map((g) => (
                  <div key={g.id} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{g.metric}</div>
                      <div className="text-sm text-muted-foreground">Threshold: ≥ {g.threshold}</div>
                    </div>
                    <Badge className={g.status === "pass" ? "bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-200" : "bg-red-200 text-red-800 dark:bg-red-800/50 dark:text-red-200"}>{g.status}</Badge>
                    <Select onValueChange={(v) => setGateStatus(g.id, v as any)}>
                      <SelectTrigger className="w-28"><SelectValue placeholder="Change" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="waived">Waived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          ) : (<div className="text-sm text-muted-foreground p-4 text-center">Select an epic to view quality gates</div>)}
        </CardContent>
      </Card>
    </div>
  );
}
