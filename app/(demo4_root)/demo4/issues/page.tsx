"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { IssuesList } from "@/components/demo4/issues-list";

export default function IssuesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <IssuesList />
      </AppShell>
    </Suspense>
  );
}
