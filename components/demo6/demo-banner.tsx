"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <Link
          href="/demo-selector"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do wyboru demo
        </Link>
      </div>
    </div>
  );
}
