"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { TeamsView } from "@/components/demo4/teams-view";

export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <TeamsView />
      </AppShell>
    </Suspense>
  );
}
