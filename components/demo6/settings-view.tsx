"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SettingsView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Connectors</CardTitle>
          <CardDescription>Źródła danych</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <Label htmlFor="pm">PM (Syzio)</Label>
            <Switch id="pm" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <Label htmlFor="devmon">Dev Monitoring</Label>
            <Switch id="devmon" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <Label htmlFor="docs">Repo dokumentów (PDF/MD)</Label>
            <Switch id="docs" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reguły & Słownik</CardTitle>
          <CardDescription>NFR / terminologia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <Label htmlFor="p95">P95</Label>
              <span className="text-sm text-muted-foreground ml-2">&lt; 300ms</span>
            </div>
            <Switch id="p95" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <Label htmlFor="wcag">WCAG AA</Label>
            <Switch id="wcag" defaultChecked />
          </div>
          <div className="rounded-xl border p-3 text-sm">
            Słownik domeny: payments, card, charge, 3DS…
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
