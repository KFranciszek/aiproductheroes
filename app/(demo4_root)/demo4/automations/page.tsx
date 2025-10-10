"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { AutomationsView } from "@/components/demo4/automations-view";

export default function AutomationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <AutomationsView />
      </AppShell>
    </Suspense>
  );
}
