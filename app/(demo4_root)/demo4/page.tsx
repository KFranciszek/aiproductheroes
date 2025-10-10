"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { PersonalDashboard } from "@/components/demo4/personal-dashboard";

export default function Demo4Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <PersonalDashboard />
      </AppShell>
    </Suspense>
  );
}
