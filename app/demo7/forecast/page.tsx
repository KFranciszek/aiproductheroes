"use client";
import { useEffect, useState } from "react";
import { getState, subscribe, krById, confidenceForKR } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function forecast(krId: string, opts: { capacity: number; days: number; scope: number; buffer: number }) {
  const kr = krById(krId)!;
  const remaining = Math.max(0, kr.target - kr.current);
  const workUnits = remaining * (kr.unit === "pct" ? 0.5 : 1) * (1 + opts.scope / 100);
  const daily = (opts.capacity / 10) * (1 - opts.buffer / 100);
  const daysNeeded = workUnits / Math.max(daily, 0.1);
  const p50 = Math.ceil(daysNeeded);
  const p85 = Math.ceil(daysNeeded * 1.2);
  return { p50, p85, conf: Math.max(0, Math.min(1, confidenceForKR(krId) * (opts.capacity / 10))) };
}

export default function Page() {
  const [s, setS] = useState(getState());
  const [krId, setKr] = useState<string>(s.krs[0]?.id || "");
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  const [cap, setCap] = useState(10);
  const [days, setDays] = useState(30);
  const [scope, setScope] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const res = krId ? forecast(krId, { capacity: cap, days, scope, buffer }) : null;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Forecast Simulator</h2>
        <p className="text-muted-foreground">Run what-if scenarios for key results</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Scenario Parameters</CardTitle>
          <Select onValueChange={setKr} value={krId}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Select KR" /></SelectTrigger>
            <SelectContent>{s.krs.map((k) => (<SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>))}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div><div className="flex justify-between text-sm mb-2"><span>Capacity (SP/sprint)</span><span className="font-semibold">{cap}</span></div><Slider value={[cap]} min={2} max={40} step={1} onValueChange={([v]) => setCap(v)} /></div>
            <div><div className="flex justify-between text-sm mb-2"><span>Days left</span><span className="font-semibold">{days}</span></div><Slider value={[days]} min={7} max={90} step={1} onValueChange={([v]) => setDays(v)} /></div>
            <div><div className="flex justify-between text-sm mb-2"><span>Scope change</span><span className="font-semibold">{scope}%</span></div><Slider value={[scope]} min={-30} max={50} step={1} onValueChange={([v]) => setScope(v)} /></div>
            <div><div className="flex justify-between text-sm mb-2"><span>Risk buffer</span><span className="font-semibold">{buffer}%</span></div><Slider value={[buffer]} min={0} max={50} step={1} onValueChange={([v]) => setBuffer(v)} /></div>
          </div>
          {res && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-6 shadow-sm"><div className="text-sm text-muted-foreground">P50 Completion</div><div className="text-4xl font-bold mt-1">{res.p50}d</div></Card>
              <Card className="p-6 shadow-sm"><div className="text-sm text-muted-foreground">P85 Completion</div><div className="text-4xl font-bold mt-1">{res.p85}d</div></Card>
              <Card className="p-6 shadow-sm"><div className="text-sm text-muted-foreground">Projected Confidence</div><div className="text-4xl font-bold mt-1">{Math.round(res.conf * 100)}%</div></Card>
            </div>
          )}
          <div className="flex justify-end"><Button onClick={() => toast.success("Plan applied successfully")}>Apply Plan</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
