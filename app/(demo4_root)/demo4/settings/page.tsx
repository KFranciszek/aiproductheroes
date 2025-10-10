"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo4/app-shell";
import { SettingsView } from "@/components/demo4/settings-view";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <AppShell>
        <SettingsView />
      </AppShell>
    </Suspense>
  );
}
