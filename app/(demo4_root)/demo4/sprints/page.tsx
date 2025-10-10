"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { SprintsView } from "@/components/demo4/sprints-view";

export default function SprintsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <SprintsView />
      </AppShell>
    </Suspense>
  );
}
