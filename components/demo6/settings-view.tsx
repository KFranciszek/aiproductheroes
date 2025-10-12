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
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Syzio Atlas</div>
            <Switch id="pm" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Syzio Helix</div>
            <Switch id="devmon" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>Repo dokumentów (PDF/MD)</div>
            <Switch id="docs" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reguły & Słownik</CardTitle>
          <CardDescription>NFR / terminologia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>P95 <span className="text-muted-foreground">&lt; 300ms</span></div>
            <Switch id="p95" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>WCAG AA</div>
            <Switch id="wcag" defaultChecked />
          </div>
          <div className="rounded-xl border p-3">
            Słownik domeny: payments, card, charge, 3DS…
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
