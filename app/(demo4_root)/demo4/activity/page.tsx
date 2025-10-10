"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { ActivityView } from "@/components/demo4/activity-view";

export default function ActivityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <ActivityView />
      </AppShell>
    </Suspense>
  );
}
