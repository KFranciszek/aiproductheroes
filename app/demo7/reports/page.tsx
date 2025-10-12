"use client";
import { useEffect, useState } from "react";
import { getState, subscribe, confidenceForKR, avgGatePassForKR } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

export default function Page() {
  const [s, setS] = useState(getState());
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  const dora = s.dora.map((x) => ({ date: x.date.slice(5), lead: x.leadTimeH, deploys: x.deploys, cfr: Math.round(x.changeFailRate * 100), mttr: x.mttrH }));
  const krData = s.krs.map((k) => ({ name: k.name.slice(0, 14) + "…", conf: Math.round(confidenceForKR(k.id) * 100), gates: Math.round(avgGatePassForKR(k.id) * 100) }));
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Reports</h2>
        <p className="text-muted-foreground">DORA metrics and key result analytics</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80 shadow-sm">
          <CardHeader><CardTitle>DORA — Lead Time & Deploys</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dora}>
                <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="lead" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="deploys" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="h-80 shadow-sm">
          <CardHeader><CardTitle>KR — Confidence & Gate Pass</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={krData}>
                <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="conf" fill="hsl(var(--primary))" />
                <Bar dataKey="gates" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
