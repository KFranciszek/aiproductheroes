"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/demo6/app-shell";
import { CanisMainView } from "@/components/demo6/canis-main-view";

export default function Demo6Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AppShell>
        <CanisMainView />
      </AppShell>
    </Suspense>
  );
}
